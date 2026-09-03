import { getCustomOrder, money, AGREEMENT_VERSION, AGREEMENT_URL, AGREEMENT_PDF, PROVIDER } from "@/lib/customOrders";
import { ORDER_TO } from "@/lib/contact";
import { stripeMode } from "@/lib/stripe";

/**
 * Where a Custom Order acceptance lands. Clickwrap, the same mechanism as
 * the menu-order form on /order: the client reads the published v1.1 terms
 * plus the Exhibit A on their page, types their name, ticks the box, and
 * THE EMAIL IS THE RECORD. Both parties get a copy carrying the version,
 * the exhibit, the typed name and title, and the server's timestamp.
 *
 * glazedweb.com keeps no database, and this does not need one: the menu
 * orders have run on the email record since the first one. The full record
 * is logged before anything can fail, and when mail cannot be sent the page
 * hands the visitor a prefilled mailto carrying the same text rather than a
 * false "you're all set."
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FROM = process.env.ORDER_FROM_EMAIL || "orders@glazedweb.com";
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function recordText(order, a) {
  return [
    `AGREEMENT ACCEPTED`,
    ``,
    `${AGREEMENT_VERSION}`,
    `${order.exhibit}`,
    ``,
    `Provider:    ${PROVIDER} (Kevin Hershock)`,
    `Business:    ${a.business}`,
    `Accepted by: ${a.name}${a.title ? `, ${a.title}` : ""}`,
    `Email:       ${a.email}`,
    `Accepted at: ${a.acceptedAt} (server time)`,
    `Record id:   ${a.id}`,
    `From IP:     ${a.ip}`,
    ``,
    `Terms: ${AGREEMENT_URL} (v1.1), incorporated by reference.`,
    `Exhibit A as shown at glazedweb.com/agreement/${order.slug} on the acceptance date:`,
    ``,
    `  Build fee ${money(order.buildFee)}${order.buildFeePaid ? ", paid in full before acceptance; nothing further owed on it" : ""}.`,
    `  Monthly service fee ${money(order.monthly)}, month to month, started by the client on glazedweb.com.`,
    `  Edit allowance ${order.editAllowance}. Additional work ${money(order.hourlyRate)}/hour, quoted and approved in advance.`,
    `  The site is ${order.live ? "live" : "to be published"} at ${order.domain}.`,
    ``,
    ...order.scope.map((s, i) => `  Scope ${i + 1}. ${s}`),
    `  Not included: ${order.notIncluded}`,
    ``,
    `  Exhibit A, part 3:`,
    ...order.payments.map((p, i) => `  ${i + 1}. ${p.lead} ${p.text}`),
  ].join("\n");
}

/** For a browser poke while wiring things up: says whether the pieces exist,
    never what they are. */
export async function GET() {
  return Response.json({
    mail: !!process.env.RESEND_API_KEY,
    recordTo: process.env.AGREEMENT_TO ? "AGREEMENT_TO" : "default (orders inbox)",
    stripe: stripeMode(),
    webhook: !!process.env.STRIPE_WEBHOOK_SECRET,
  });
}

export async function POST(req) {
  let raw;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "Empty submission." }, { status: 400 });
  }
  const p = raw ?? {};
  const order = getCustomOrder(str(p.slug, 40));
  if (!order) return Response.json({ error: "Unknown order." }, { status: 404 });

  const name = str(p.name, 120);
  const title = str(p.title, 120);
  const business = str(p.business, 160) || order.client;
  const email = str(p.email, 200);
  if (p.agreed !== true) return Response.json({ error: "The agreement box was not checked." }, { status: 400 });
  if (name.length < 2) return Response.json({ error: "A full name is required." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "A working email is required; your copy of the record goes there." }, { status: 400 });
  }

  const a = {
    id: `agr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    business,
    name,
    title,
    email,
    acceptedAt: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
  };
  const text = recordText(order, a);
  console.log(`[agreement] acceptance ${a.id}:\n${text}`);

  const key = process.env.RESEND_API_KEY;
  const to = process.env.AGREEMENT_TO || ORDER_TO;
  if (!key) {
    console.log(`[agreement] acceptance ${a.id} NOT emailed: RESEND_API_KEY not set.`);
    return Response.json({ state: "unconfigured", record: text });
  }

  const send = (msg) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `glazedweb <${FROM}>`, to: [msg.to], reply_to: msg.replyTo, subject: msg.subject, text: msg.text }),
    });

  // Kevin's copy decides success; it is the countersignature record.
  try {
    const res = await send({ to, replyTo: email, subject: `Agreement accepted: ${business} (${AGREEMENT_VERSION})`, text });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  } catch (err) {
    console.error(`[agreement] acceptance ${a.id} send FAILED:`, err);
    return Response.json({ state: "send-failed", record: text });
  }

  // The client's copy is best-effort but AWAITED: fire-and-forget dies on
  // serverless the moment the response returns.
  try {
    await send({
      to: email,
      replyTo: to,
      subject: `Your signed copy: ${AGREEMENT_VERSION}, ${business}`,
      text: `This is your record of acceptance. Keep this email.\n\n${text}\n\nThe full terms: ${AGREEMENT_URL}\nPDF copy: ${AGREEMENT_PDF}`,
    });
  } catch (err) {
    console.error(`[agreement] acceptance ${a.id} client copy not sent:`, err);
  }

  return Response.json({ state: "sent" });
}
