import { getCustomOrder } from "@/lib/customOrders";
import { createMonthlyCheckout } from "@/lib/monthly";
import { buildStatus, createBuildCheckout } from "@/lib/buildfee";
import { stripeKey } from "@/lib/stripe";

/**
 * "Pay the build in full", "Pay half now", "Pay the balance", or "Start the
 * monthly plan". A plain link on /agreement/{slug} lands here with
 * ?what=build, ?what=half, ?what=both or ?what=monthly (the default); we open
 * a Stripe Checkout session for that and send them to it. No JavaScript
 * needed on the page, and nothing about the amount comes from the browser:
 * the number is read from lib/customOrders.js.
 *
 * Every failure goes back to the agreement page with a reason in the query,
 * where the page says so in words. A client should never see a JSON error.
 *
 * The build fee is refused twice over, because a stale tab can hold a link
 * the page no longer shows: paid in full means every build door redirects
 * to ?pay=paid; a deposit already paid means the full-fee doors redirect to
 * ?pay=half-paid and only the balance (another ?what=half) is sold.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const { slug } = await params;
  const order = getCustomOrder(slug);
  if (!order) return new Response("Not found", { status: 404 });

  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "www.glazedweb.com";
  const origin = `${proto}://${host}`;
  // A client whose agreement lives on its own host (devine) goes back
  // there, never to a twin page here; lib/buildfee and lib/monthly honor
  // the same field for Stripe's success and cancel returns.
  const back = order.agreementUrl || `${origin}/agreement/${order.slug}`;

  const what = new URL(req.url).searchParams.get("what");
  const kind = what === "build" || what === "both" || what === "half" ? what : "monthly";
  if (!stripeKey()) return Response.redirect(`${back}?pay=off&what=${kind}`, 303);
  try {
    if (kind !== "monthly") {
      const status = await buildStatus(order);
      if (status.state === "paid") return Response.redirect(`${back}?pay=paid`, 303);
      if (status.state === "half" && kind !== "half") return Response.redirect(`${back}?pay=half-paid`, 303);
    }
    const url = kind === "monthly" ? await createMonthlyCheckout(order, origin) : await createBuildCheckout(order, origin, kind);
    return Response.redirect(url, 303);
  } catch (err) {
    console.error(`[pay] ${kind} checkout for ${order.slug} failed:`, err);
    return Response.redirect(`${back}?pay=failed&what=${kind}`, 303);
  }
}
