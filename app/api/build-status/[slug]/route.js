import { getCustomOrder } from "@/lib/customOrders";
import { buildStatus } from "@/lib/buildfee";
import { monthlyStatus } from "@/lib/monthly";

/**
 * The money lights, as booleans, for a client page hosted OUTSIDE this repo.
 *
 * devine's launch page lives in the devine repo (her agreement's one home is
 * devine.glazedweb.com), but her build fee and monthly run on THIS repo's
 * pay rail. Rather than handing the devine project a Stripe key of its own,
 * this route says whether, never what: the build state word and whether the
 * monthly runs, read from the same buildStatus and monthlyStatus the
 * agreement and build pages read. No amounts, no ids, no customer anything,
 * which is why it can be public - it reveals exactly what the client's own
 * status lights already show.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const { slug } = await params;
  const order = getCustomOrder(slug);
  if (!order) return Response.json({ error: "Not found" }, { status: 404 });
  const [build, monthly] = await Promise.all([buildStatus(order), monthlyStatus(order)]);
  return Response.json(
    // build: "off" | "due" | "half" | "paid". A consumer treats off and due
    // the same (an unlit light), so no key is never mistaken for unpaid.
    { build: build.state, monthly: monthly.state === "active" },
    { headers: { "cache-control": "no-store" } },
  );
}
