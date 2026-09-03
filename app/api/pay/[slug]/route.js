import { getCustomOrder } from "@/lib/customOrders";
import { createMonthlyCheckout } from "@/lib/monthly";
import { stripeKey } from "@/lib/stripe";

/**
 * "Start the monthly plan." A plain link on /agreement/{slug} lands here; we
 * open a Stripe Checkout session for that client's monthly fee and send them
 * to it. No JavaScript needed on the page, and nothing about the amount
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

  if (!stripeKey()) return Response.redirect(`${back}?pay=off`, 303);
  try {
    const url = await createMonthlyCheckout(order, origin);
    return Response.redirect(url, 303);
  } catch (err) {
    console.error(`[pay] checkout for ${order.slug} failed:`, err);
    return Response.redirect(`${back}?pay=failed`, 303);
  }
}
