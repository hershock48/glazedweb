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
 *   ?what=part    one Checkout for the NEXT installment when the order is
 *                 paid in more than two (Ruin the Party, 2026-10-03: three
 *                 payments of $1,500, launch day, +30, +60). `installments`
 *                 on the order sets the count (default 2, which is the half
 *                 door above under another name); the amount is the next
 *                 unpaid part, so the same door serves every payment.
 *
 * The invoice route is untouched; a client who pays that way is marked
 * `buildFeePaid: true` in lib/customOrders.js by hand, exactly as before.
 *
 * NO DATABASE, same as lib/monthly.js: Stripe is the record. Whether the
 * build is paid is read from Stripe's Checkout session list, filtered by
 * `metadata.client` and `metadata.kind` (build | both | half | part) and
 * paid. Parts are summed by what Stripe says was paid; when the sum reaches
 * the fee, or one build or both is paid, the build is paid in full. The
 * list endpoint is used rather than search because search lags
 * a minute behind and the client lands back here seconds after paying; the
 * session id in the return URL is the fast path for that first view, and
 * the list is still read so a second half can be seen as the second half.
 */

/** How many payments the build fee is split into. Two unless the order says. */
export const installments = (order) => (Number.isInteger(order.installments) && order.installments > 1 ? order.installments : 2);

/** One part of the fee in whole dollars, rounded the way a person would round it. */
export const partFee = (order) => Math.round(order.buildFee / installments(order));

/** The amount of part `index` (0-based): equal parts, the last one takes the rounding. */
export const partAmount = (order, index) => {
  const n = installments(order);
  const each = partFee(order);
  return index >= n - 1 ? order.buildFee - each * (n - 1) : each;
};

/** The word for one part: half, third, quarter; "payment" past that. */
export const partWord = (order) => ({ 2: "half", 3: "third", 4: "quarter" })[installments(order)] || "payment";

/** Kept for callers that still say half; it is the two-part case of partFee. */
export const halfFee = (order) => partFee(order);

/**
 * @returns {{ state: "off" } | { state: "due", mode: string, unsure?: boolean } |
 *   { state: "part", mode: string, paid: number, remaining: number, count: number, of: number, next: number, when: string | null, unsure?: boolean } |
 *   { state: "paid", mode: string, how: "card" | "invoice", when: string | null, id: string | null }}
 */
export async function buildStatus(order, sessionId) {
  // A $0 build (beanumber, 2026-09-10: the site was built at no charge and
  // only the monthly is billed). Nothing to pay, nothing to read from
  // Stripe, and no door may ever open for it: the pay route treats "paid"
  // as the redirect-away state, which is exactly right here.
  if (order.buildFee === 0) return { state: "paid", mode: stripeMode(), how: "none", when: null, id: null };
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
    const full = mine.find((s) => !isPart(s));
    if (full) return paid(full, mode);
    const parts = mine.filter(isPart);
    if (!parts.length) return { state: "due", mode };
    // What Stripe says was paid, not what the registry says a part should be:
    // a fee that changed between payments must not strand a client.
    const paidSoFar = parts.reduce((sum, s) => sum + (Number.isFinite(s.amount_total) ? s.amount_total / 100 : partFee(order)), 0);
    if (paidSoFar >= order.buildFee) return paid(parts[0], mode);
    const remaining = order.buildFee - paidSoFar;
    return {
      state: "part",
      mode,
      paid: paidSoFar,
      remaining,
      count: parts.length,
      of: installments(order),
      next: Math.min(partAmount(order, parts.length), remaining),
      when: new Date((parts[0].created || 0) * 1000).toISOString(),
    };
  } catch (err) {
    console.error(`[buildfee] status for ${order.slug} failed:`, err instanceof StripeError ? err.message : err);
    return { state: "due", mode, unsure: true };
  }
}

const isPart = (s) => s?.metadata?.kind === "half" || s?.metadata?.kind === "part";

function isBuildPayment(s, order) {
  return (
    s?.metadata?.client === order.slug &&
    (s.metadata?.kind === "build" || s.metadata?.kind === "both" || isPart(s)) &&
    s.payment_status === "paid"
  );
}

function paid(s, mode) {
  return { state: "paid", mode, how: "card", when: new Date((s.created || 0) * 1000).toISOString(), id: s.id };
}

const AGREEMENT_SHORT = "Client Agreement v1.1";

/**
 * Opens Checkout for the build fee, alone, with the monthly plan, or as the
 * next part, and returns the URL to send the client to. The amounts come
 * from the registry, never from the browser. `kind` is "build" | "both" |
 * "part" ("half" is accepted and means the same).
 */
export async function createBuildCheckout(order, origin, kind) {
  // agreementUrl: the client's agreement lives on its own host (devine).
  const back = order.agreementUrl || `${origin}/agreement/${order.slug}`;
  const withMonthly = kind === "both";
  const part = kind === "part" || kind === "half";
  // Which part this is comes from Stripe, so the amount is the next unpaid
  // one and the line names it (payment 2 of 3), never a guess from a stale tab.
  const status = part ? await buildStatus(order) : null;
  const index = status?.state === "part" ? status.count : 0;
  const n = installments(order);
  const amount = part ? (status?.state === "part" ? status.next : partAmount(order, 0)) : order.buildFee;
  const partName = n === 2 ? (index === 0 ? "the deposit" : "the balance") : `payment ${index + 1} of ${n}`;
  const body = new URLSearchParams({
    mode: withMonthly ? "subscription" : "payment",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(amount * 100),
    "line_items[0][price_data][product_data][name]": part
      ? `glazedweb build fee, ${partName}: ${order.client}`
      : `glazedweb build fee: ${order.client}`,
    "line_items[0][price_data][product_data][description]": part
      ? n === 2
        ? "Half of the build fee: the deposit to start, or the balance at launch. One time."
        : `One of ${n} payments of the build fee${order.schedule ? `: ${order.schedule}` : ""}. One time.`
      : "Design, build and launch of the site, paid in full. One time.",
    "line_items[0][quantity]": "1",
    customer_email: order.email,
    client_reference_id: order.slug,
    "metadata[client]": order.slug,
    "metadata[kind]": part ? "part" : kind,
    success_url: `${back}?session_id={CHECKOUT_SESSION_ID}&what=${part ? "part" : kind}`,
    cancel_url: `${back}?pay=cancelled&what=${part ? "part" : kind}`,
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
    body.set("payment_intent_data[metadata][kind]", part ? "part" : kind);
    body.set(
      "payment_intent_data[description]",
      part ? `Build fee for ${order.client}, ${partName} (${AGREEMENT_SHORT})` : `Build fee for ${order.client} (${AGREEMENT_SHORT})`
    );
  }
  const session = await stripe("/v1/checkout/sessions", { body });
  if (!session.url) throw new StripeError(500, "Checkout session came back without a URL.");
  return session.url;
}
