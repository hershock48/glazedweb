import { stripe, stripeKey, stripeMode, StripeError } from "@/lib/stripe";

/**
 * The monthly care plan on a Custom Order, as a Stripe subscription on
 * glazedweb's own account. Two jobs: say whether a client's plan is running,
 * and open Checkout to start it.
 *
 * NO DATABASE. glazedweb.com has none, and it does not need one for this:
 * Stripe is the record of who is subscribed. The status is read live from
 * Stripe on each page view, tied to the client by `metadata.client` on the
 * subscription (set at checkout below). The page says "not switched on"
 * when there is no key, never a false "not started".
 *
 * The list call is used rather than Stripe's search endpoint because the
 * search index lags a minute or so behind a new subscription, and the
 * client lands back on the page seconds after paying. The list is live.
 */

const RENDERABLE = new Set(["active", "trialing", "past_due"]);

/**
 * @returns {{ state: "off" } | { state: "none", mode: string } |
 *   { state: "active", mode: string, since: string, pastDue: boolean, id: string }}
 */
export async function monthlyStatus(order, sessionId) {
  if (!stripeKey()) return { state: "off" };
  const mode = stripeMode();
  try {
    const list = await stripe("/v1/subscriptions?status=all&limit=100");
    const mine = (list.data || [])
      .filter((s) => s.metadata?.client === order.slug && RENDERABLE.has(s.status))
      .sort((a, b) => b.created - a.created);
    if (mine[0]) {
      return {
        state: "active",
        mode,
        since: new Date(mine[0].created * 1000).toISOString(),
        pastDue: mine[0].status === "past_due",
        id: mine[0].id,
      };
    }
    // Just back from Checkout: the session says so before the list does.
    if (sessionId && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
      const s = await stripe(`/v1/checkout/sessions/${sessionId}`);
      if (s.metadata?.client === order.slug && s.mode === "subscription" && s.status === "complete") {
        return { state: "active", mode, since: new Date().toISOString(), pastDue: false, id: String(s.subscription || s.id) };
      }
    }
    return { state: "none", mode };
  } catch (err) {
    console.error(`[monthly] status for ${order.slug} failed:`, err instanceof StripeError ? err.message : err);
    return { state: "none", mode, unsure: true };
  }
}

/** Opens Checkout for the plan and returns the URL to send the client to. */
export async function createMonthlyCheckout(order, origin) {
  const back = `${origin}/agreement/${order.slug}`;
  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(order.monthly * 100),
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][price_data][product_data][name]": `glazedweb monthly care: ${order.client}`,
    "line_items[0][price_data][product_data][description]": "Hosting, SSL, updates, backups and included edits, month to month.",
    "line_items[0][quantity]": "1",
    customer_email: order.email,
    client_reference_id: order.slug,
    "metadata[client]": order.slug,
    "subscription_data[metadata][client]": order.slug,
    "subscription_data[description]": `Monthly care for ${order.client} (${AGREEMENT_SHORT})`,
    success_url: `${back}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${back}?pay=cancelled`,
  });
  const session = await stripe("/v1/checkout/sessions", { body });
  if (!session.url) throw new StripeError(500, "Checkout session came back without a URL.");
  return session.url;
}

const AGREEMENT_SHORT = "Client Agreement v1.1";
