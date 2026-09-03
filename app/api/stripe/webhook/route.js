import { verifyStripeSignature } from "@/lib/stripe";
import { getCustomOrder, money } from "@/lib/customOrders";
import { ORDER_TO } from "@/lib/contact";

/**
 * Stripe tells us what happened on a monthly plan, and we tell Kevin.
 *
 *   checkout.session.completed      a client started their plan
 *   invoice.payment_failed          a monthly charge bounced
 *   customer.subscription.deleted   a plan ended
 *
 * Signature first, on the RAW body, always. An unset secret answers 503 and
 * Stripe keeps retrying, which is the visible failure we want. Stripe's own
 * dashboard email is the backup for all of this; the point here is a note
 * in the same inbox as orders, in plain words, the minute it happens.
 *
 * Configure in Stripe: Developers > Webhooks > add endpoint
 * https://www.glazedweb.com/api/stripe/webhook, pick the three events, then
 * set STRIPE_WEBHOOK_SECRET in Vercel.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FROM = process.env.ORDER_FROM_EMAIL || "orders@glazedweb.com";

function clientOf(obj) {
  const slug =
    obj?.metadata?.client ||
    obj?.subscription_details?.metadata?.client ||
    obj?.lines?.data?.[0]?.metadata?.client ||
    obj?.client_reference_id;
  return slug ? getCustomOrder(String(slug)) : null;
}

async function tell(subject, lines) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.AGREEMENT_TO || ORDER_TO;
  if (!key) {
    console.log(`[stripe] not emailed (RESEND_API_KEY unset): ${subject}\n${lines.join("\n")}`);
    return;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `glazedweb <${FROM}>`, to: [to], subject, text: lines.join("\n") }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status} ${await r.text()}`);
}

export async function POST(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const raw = await req.text();
  if (!secret) {
    console.error("[stripe] webhook received but STRIPE_WEBHOOK_SECRET is not set.");
    return Response.json({ error: "Webhook not configured." }, { status: 503 });
  }
  if (!verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return Response.json({ error: "Bad signature." }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Bad JSON." }, { status: 400 });
  }
  const obj = event.data?.object || {};
  const order = clientOf(obj);
  const live = !!event.livemode;
  const tag = live ? "" : " (TEST MODE)";

  // Not one of ours (a stray event, or a client we have not registered):
  // acknowledge and move on, so Stripe stops retrying.
  if (!order) {
    console.log(`[stripe] ${event.type} ignored: no custom order on it.`);
    return Response.json({ received: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      if (obj.mode !== "subscription") break;
      await tell(`${order.client} started the monthly plan${tag}`, [
        `${order.client} just started the ${money(order.monthly)} a month plan on glazedweb.com.`,
        ``,
        `Paid by:      ${obj.customer_details?.email || obj.customer_email || "unknown"}`,
        `Subscription: ${obj.subscription || "pending"}`,
        `Session:      ${obj.id}`,
        `When:         ${new Date((obj.created || 0) * 1000).toISOString()}`,
        ``,
        `The circle on /agreement/${order.slug} is a check now.`,
      ]);
      break;
    }
    case "invoice.payment_failed": {
      await tell(`${order.client}: a monthly payment failed${tag}`, [
        `Stripe could not collect ${money((obj.amount_due || 0) / 100)} from ${order.client}.`,
        ``,
        `Invoice:      ${obj.id}`,
        `Subscription: ${obj.subscription || "unknown"}`,
        `Attempts:     ${obj.attempt_count ?? "?"}`,
        ``,
        `Stripe retries on its own schedule and emails the customer. Nothing to do yet unless it keeps failing.`,
      ]);
      break;
    }
    case "customer.subscription.deleted": {
      await tell(`${order.client}: monthly plan ended${tag}`, [
        `The ${money(order.monthly)} a month plan for ${order.client} has ended on Stripe.`,
        ``,
        `Subscription: ${obj.id}`,
        `Ended:        ${new Date((obj.ended_at || obj.canceled_at || 0) * 1000).toISOString()}`,
        ``,
        `Under the agreement, hosting and care stop and the site stays theirs. Worth a text before anything is turned off.`,
      ]);
      break;
    }
    default:
      break;
  }
  return Response.json({ received: true });
}
