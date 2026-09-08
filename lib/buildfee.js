import { stripe, stripeKey, stripeMode, StripeError } from "@/lib/stripe";

/**
 * The build fee on a Custom Order, paid by card through Stripe Checkout on
 * glazedweb's own account. Kevin, 8 Sep 2026: "we might as well wire up the
 * $2000 charge to the agreement too; they can choose to pay the full 2k and
 * start 150/mo too."
 *
 * Two doors on the agreement page, both landing in /api/pay/{slug}:
 *
 *   ?what=build   one Checkout in payment mode for the whole build fee
 *   ?what=both    one Checkout in subscription mode carrying the build fee
 *                 as a one-time line on the first invoice plus the monthly,
 *                 so a client who wants to be done in one card form is
 *
 * The invoice route (half to start, half at launch) is untouched; a client
 * who pays that way is marked `buildFeePaid: true` in lib/customOrders.js
 * by hand, exactly as before.
 *
 * NO DATABASE, same as lib/monthly.js: Stripe is the record. Whether the
 * build is paid is read from Stripe's Checkout session list, filtered by
 * `metadata.client` and `metadata.kind` (build | both) and paid. The list
 * endpoint is used rather than search because search lags a minute behind
 * and the client lands back here seconds after paying; the session id in
 * the return URL is the fast path for that first view.
 */

/**
 * @returns {{ state: "off" } | { state: "due", mode: string, unsure?: boolean } |
 *   { state: "paid", mode: string, how: "card" | "invoice", when: string | null, id: string | null }}
 */
export async function buildStatus(order, sessionId) {
  if (order.buildFeePaid) return { state: "paid", mode: stripeMode(), how: "invoice", when: null, id: null };
  if (!stripeKey()) return { state: "off" };
  const mode = stripeMode();
  try {
    if (sessionId && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
      const s = await stripe(`/v1/checkout/sessions/${sessionId}`);
      if (isBuildPayment(s, order)) return paid(s, mode);
    }
    const list = await stripe("/v1/checkout/sessions?limit=100");
    const mine = (list.data || []).filter((s) => isBuildPayment(s, order)).sort((a, b) => b.created - a.created);
    if (mine[0]) return paid(mine[0], mode);
    return { state: "due", mode };
  } catch (err) {
    console.error(`[buildfee] status for ${order.slug} failed:`, err instanceof StripeError ? err.message : err);
    return { state: "due", mode, unsure: true };
  }
}

function isBuildPayment(s, order) {
  return (
    s?.metadata?.client === order.slug &&
    (s.metadata?.kind === "build" || s.metadata?.kind === "both") &&
    s.payment_status === "paid"
  );
}

function paid(s, mode) {
  return { state: "paid", mode, how: "card", when: new Date((s.created || 0) * 1000).toISOString(), id: s.id };
}

const AGREEMENT_SHORT = "Client Agreement v1.1";

/**
 * Opens Checkout for the build fee, alone or with the monthly plan, and
 * returns the URL to send the client to. The amounts come from the registry,
 * never from the browser.
 */
export async function createBuildCheckout(order, origin, withMonthly) {
  const back = `${origin}/agreement/${order.slug}`;
  const kind = withMonthly ? "both" : "build";
  const body = new URLSearchParams({
    mode: withMonthly ? "subscription" : "payment",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(order.buildFee * 100),
    "line_items[0][price_data][product_data][name]": `glazedweb build fee: ${order.client}`,
    "line_items[0][price_data][product_data][description]": "Design, build and launch of the site, paid in full. One time.",
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
    body.set("payment_intent_data[metadata][kind]", "build");
    body.set("payment_intent_data[description]", `Build fee for ${order.client} (${AGREEMENT_SHORT})`);
  }
  const session = await stripe("/v1/checkout/sessions", { body });
  if (!session.url) throw new StripeError(500, "Checkout session came back without a URL.");
  return session.url;
}
