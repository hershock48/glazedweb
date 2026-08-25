import { redirect } from "next/navigation";
import { ORDER_TO, CONTACT_EMAIL } from "@/lib/contact";
import { SESSIONS, slotIsBookable, describeSlot, buildIcs } from "@/lib/schedule";

export const runtime = "nodejs";

const FROM = process.env.ORDER_FROM_EMAIL || "orders@glazedweb.com";

function esc(s) {
  return String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
}

// Native form POST, so the reply is a redirect to a page rather than JSON:
// the no-JS path lands somewhere readable either way. Delivery follows the
// same honesty contract as /api/order: never claim a message was sent when
// it went nowhere. Unconfigured or failed sends still confirm the REQUEST to
// the visitor, with the truth and a working mailto, because the request
// itself (name, time, session) survives in the redirect and the visitor can
// carry it to a mailbox by hand.
export async function POST(req) {
  let form;
  try {
    form = await req.formData();
  } catch {
    redirect("/schedule");
  }

  const name = String(form.get("name") ?? "").trim();
  const business = String(form.get("business") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const note = String(form.get("note") ?? "").trim();
  const slot = String(form.get("slot") ?? "");
  const session = SESSIONS.find((s) => s.slug === form.get("session"));

  if (!name || !email || !session || !slotIsBookable(slot, session.minutes)) {
    redirect("/schedule");
  }

  const when = describeSlot(slot);
  const uid = `${slot.replace(/[^0-9]/g, "")}-${Date.now()}@glazedweb.com`;
  const ics = buildIcs(
    {
      uid,
      localStart: slot,
      minutes: session.minutes,
      title: `glazedweb ${session.name}: ${name} (${business})`,
      description: `${session.name}, requested via glazedweb.com/schedule.\n${note ? `Project: ${note}\n` : ""}Kevin sends the meeting link by email.`,
      attendeeEmail: email,
    },
    CONTACT_EMAIL
  );

  const done = new URLSearchParams({ slot, session: session.slug, name });

  const key = process.env.RESEND_API_KEY;
  if (!key || !ORDER_TO) {
    done.set("delivery", "mailto");
    redirect(`/schedule/requested?${done}`);
  }

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2B1E16">
      <h2 style="margin:0 0 4px">Call request: ${esc(session.name)}</h2>
      <p style="margin:0 0 16px;color:#8A7663">${esc(when)}</p>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 14px 4px 0;color:#8A7663">Name</td><td><b>${esc(name)}</b></td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#8A7663">Business</td><td><b>${esc(business)}</b></td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#8A7663">Email</td><td><b>${esc(email)}</b></td></tr>
      </table>
      ${note ? `<h3 style="margin:20px 0 6px">The project</h3><p style="white-space:pre-wrap;font-size:14px">${esc(note)}</p>` : ""}
      <p style="font-size:13px;color:#8A7663;margin-top:18px">The invite is attached. Accepting it is the confirmation; remember to send the meeting link.</p>
    </div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `glazedweb schedule <${FROM}>`,
        to: [ORDER_TO],
        reply_to: email,
        subject: `Call request: ${session.name} · ${when} · ${business}`,
        html,
        attachments: [{ filename: "glazedweb-call.ics", content: Buffer.from(ics).toString("base64") }],
      }),
    });
    if (!r.ok) done.set("delivery", "mailto");
  } catch {
    done.set("delivery", "mailto");
  }

  redirect(`/schedule/requested?${done}`);
}
