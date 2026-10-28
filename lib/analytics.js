/**
 * Server-side conversion events for Vercel Web Analytics.
 *
 * Page views, referrers, UTM tags, country, device and the path a visitor
 * takes through the site come from the <Analytics /> component in each root
 * layout. The four moments that are actually money (an order placed, a call
 * requested, an agreement accepted, a checkout opened) happen inside route
 * handlers, two of them on the no-JavaScript path, so they are recorded here
 * on the server and attributed to the visitor by the request that is already
 * in hand. Nothing is identified: Vercel keys a visitor by a hash of the
 * request and sets no cookie, which is why the site needs no consent banner.
 *
 * Every call is fire-and-forget. A failed analytics call must never fail the
 * thing it is measuring: an order that reached the inbox is an order whether
 * or not the count went up. So this swallows and logs rather than throwing,
 * and callers do not await it.
 *
 * Event names are nouns the dashboard reads cleanly, kept in one place so a
 * rename happens once. Properties are small and never carry the visitor's
 * name, email, phone or message.
 */
import { track } from "@vercel/analytics/server";

export const EVENTS = {
  /** /order form reached the inbox. Property: flavor (original | dozen). */
  ORDER_PLACED: "order_placed",
  /** /schedule request confirmed to the visitor. Property: session (length). */
  CALL_REQUESTED: "call_requested",
  /** A client checked the box on a custom agreement. Property: slug. */
  AGREEMENT_ACCEPTED: "agreement_accepted",
  /** A client clicked through to a Stripe checkout. Properties: slug, kind. */
  CHECKOUT_OPENED: "checkout_opened",
};

export function record(event, properties = {}) {
  // No return value on purpose. Callers must not await this and must not
  // let it change the response they were about to send.
  track(event, properties).catch((err) => {
    console.log(`[analytics] ${event} not recorded: ${err?.message || err}`);
  });
}
