import { stripe, stripeKey, stripeMode, StripeError } from "@/lib/stripe";

/**
 * The build fee on a Custom Order, paid by card through Stripe Checkout on
 * glazedweb's own account. Kevin, 8 Sep 2026: "we might as well wire up the
 * $2000 charge to the agreement too; they can choose to pay the full 2k and
 * start 150/mo too."
 *
 * Three doors on the agreement page, all landing in /api/pay/{slug}:
 *
 *   ?what=build   one Checkout in payment mode for the whole build fee
 *   ?what=both    one Checkout in subscription mode carrying the build fee
 *                 as a one-time line on the first invoice plus the monthly,
 *                 so a client who wants to be done in one card form is
 *   ?what=half    one Checkout in payment mode for HALF the build fee. The
 *                 first one is the deposit, the second one is the balance at
 *                 launch; it is the same door both times and the page names
 *                 which it is. Kevin, 9 Sep 2026: the copy promised half to
 *                 start and half at launch, and the page offered no way to
 *                 do it except waiting for an invoice.
 *
 * The invoice route is untouched; a client who pays that way is marked
 * `buildFeePaid: true` in lib/customOrders.js by hand, exactly as before.
 *
 * NO DATABASE, same as lib/monthly.js: Stripe is the record. Whether the
 * build is paid is read from Stripe's Checkout session list, filtered by
 * `metadata.client` and `metadata.kind` (build | both | half) and paid. One
 * paid half is the deposit; two paid halves, or one build or both, is paid
 * in full. The list endpoint is used rather than search because search lags
 * a minute behind and the client lands back here seconds after paying; the
 * session id in the return URL is the fast path for that first view, and
 * the list is still read so a second half can be seen as the second half.
 */

/** Half the fee in whole dollars, rounded the way a person would round it. */
export const halfFee = (order) => Math.round(order.buildFee / 2);

/**
 * @returns {{ state: "off" } | { state: "due", mode: string, unsure?: boolean } |
 *   { state: "half", mode: string, paid: number, remaining: number, when: string | null, unsure?: boolean } |
 *   { state: "paid", mode: string, how: "card" | "invoice", when: string | null, id: string | null }}
 */
export async function buildStatus(order, sessionId) {
  if (order.buildFeePaid) return { state: "paid", mode: stripeMode(), how: "invoice", when: null, id: null };
  if (!stripeKey()) return { state: "off" };
  const mode = stripeMode();
  try {
    const list = await stripe("/v1/checkout/sessions?limit=100");
    const mine = (list.data || []).filter((s) => isBuildPayment(s, order));
    // The session just paid may not be in the list yet; fold it in by id.
    if (sessionId && /^cs_[A-Za-z0-9_]+$/.test(sessionId) && !mine.some((s) => s.id === sessionId)) {
      const s = await stripe(`/v1/checkout/sessions/${sessionId}`);
      if (isBuildPayment(s, order)) mine.push(s);
    }
    mine.sort((a, b) => b.created - a.created);
    const full = mine.find((s) => s.metadata?.kind !== "half");
    if (full) return paid(full, mode);
    const halves = mine.filter((s) => s.metadata?.kind === "half");
    if (halves.length >= 2) return paid(halves[0], mode);
    if (halves.length === 1) {
      const h = halfFee(order);
      return { state: "half", mode, paid: h, remaining: order.buildFee - h, when: new Date((halves[0].created || 0) * 1000).toISOString() };
    }
    return { state: "due", mode };
  } catch (err) {
    console.error(`[buildfee] status for ${order.slug} failed:`, err instanceof StripeError ? err.message : err);
    return { state: "due", mode, unsure: true };
  }
}

function isBuildPayment(s, order) {
  return (
    s?.metadata?.client === order.slug &&
    (s.metadata?.kind === "build" || s.metadata?.kind === "both" || s.metadata?.kind === "half") &&
    s.payment_status === "paid"
  );
}

function paid(s, mode) {
  return { state: "paid", mode, how: "card", when: new Date((s.created || 0) * 1000).toISOString(), id: s.id };
}

const AGREEMENT_SHORT = "Client Agreement v1.1";

/**
 * Opens Checkout for the build fee, alone, with the monthly plan, or as a
 * half, and returns the URL to send the client to. The amounts come from the
 * registry, never from the browser. `kind` is "build" | "both" | "half".
 */
export async function createBuildCheckout(order, origin, kind) {
  const back = `${origin}/agreement/${order.slug}`;
  const withMonthly = kind === "both";
  const half = kind === "half";
  const amount = half ? halfFee(order) : order.buildFee;
  const body = new URLSearchParams({
    mode: withMonthly ? "subscription" : "payment",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(amount * 100),
    "line_items[0][price_data][product_data][name]": half
      ? `glazedweb build fee, one half: ${order.client}`
      : `glazedweb build fee: ${order.client}`,
    "line_items[0][price_data][product_data][description]": half
      ? "Half of the build fee: the deposit to start, or the balance at launch. One time."
      : "Design, build and launch of the site, paid in full. One time.",
    "line_items[0][quantity]": "1",
    customer_email: order.email,
    client_reference_id: order.slug,
    "metadata[client]": order.slug,
    "metadata[kind]": kind,
    success_url: `${back}?session_id={CHECKOUT_SESSION_ID}&what=${kind}`,
    cancel_url: `${back}?pay=cancelled&what=${kind}`,
  });
  if (withMonthly) {
    body.set("line_items[1][price_data][currency]", "usd");
    body.set("line_items[1][price_data][unit_amount]", String(order.monthly * 100));
    body.set("line_items[1][price_data][recurring][interval]", "month");
    body.set("line_items[1][price_data][product_data][name]", `glazedweb monthly care: ${order.client}`);
    body.set(
      "line_items[1][price_data][product_data][description]",
      "Hosting, SSL, updates, backups and included edits, month to month."
    );
    body.set("line_items[1][quantity]", "1");
    body.set("subscription_data[metadata][client]", order.slug);
    body.set("subscription_data[description]", `Monthly care for ${order.client} (${AGREEMENT_SHORT})`);
  } else {
    body.set("payment_intent_data[metadata][client]", order.slug);
    body.set("payment_intent_data[metadata][kind]", kind);
    body.set(
      "payment_intent_data[description]",
      half ? `Half of the build fee for ${order.client} (${AGREEMENT_SHORT})` : `Build fee for ${order.client} (${AGREEMENT_SHORT})`
    );
  }
  const session = await stripe("/v1/checkout/sessions", { body });
  if (!session.url) throw new StripeError(500, "Checkout session came back without a URL.");
  return session.url;
}
