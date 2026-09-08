import { getCustomOrder } from "@/lib/customOrders";
import { createMonthlyCheckout } from "@/lib/monthly";
import { createBuildCheckout } from "@/lib/buildfee";
import { stripeKey } from "@/lib/stripe";

/**
 * "Start the monthly plan", "Pay the build in full", or both at once. A plain
 * link on /agreement/{slug} lands here with ?what=monthly (the default),
 * ?what=build or ?what=both; we open a Stripe Checkout session for that and
 * send them to it. No JavaScript needed on the page, and nothing about the amount
 * comes from the browser: the number is read from lib/customOrders.js.
 *
 * Every failure goes back to the agreement page with a reason in the query,
 * where the page says so in words. A client should never see a JSON error.
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
  const back = `${origin}/agreement/${order.slug}`;

  const what = new URL(req.url).searchParams.get("what");
  const kind = what === "build" || what === "both" ? what : "monthly";
  if (!stripeKey()) return Response.redirect(`${back}?pay=off&what=${kind}`, 303);
  // The build fee has one door: once it is paid, both build links go away on
  // the page, but a stale tab could still hold one. Refuse to sell it twice.
  if (kind !== "monthly" && order.buildFeePaid) return Response.redirect(`${back}?pay=paid`, 303);
  try {
    const url =
      kind === "monthly" ? await createMonthlyCheckout(order, origin) : await createBuildCheckout(order, origin, kind === "both");
    return Response.redirect(url, 303);
  } catch (err) {
    console.error(`[pay] ${kind} checkout for ${order.slug} failed:`, err);
    return Response.redirect(`${back}?pay=failed&what=${kind}`, 303);
  }
}
