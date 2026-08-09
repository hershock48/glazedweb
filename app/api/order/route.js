import { ORDER_TO } from "@/lib/contact";

export const runtime = "nodejs";

const FROM = process.env.ORDER_FROM_EMAIL || "orders@glazedweb.com";

function esc(s) {
  return String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, reason: "bad_request" }, { status: 400 });
  }

  const { name, business, email } = body || {};
  if (!name || !business || !email) {
    return Response.json({ ok: false, reason: "missing_fields" }, { status: 400 });
  }

  // Both are required, and a missing one is a 503 rather than a best guess.
  // The client turns a 503 into a pre-filled mailto, so the order survives
  // either way. What must never happen is answering ok:true when the message
  // went nowhere: the customer would be told we had their order and we would
  // not, with nothing anywhere to notice it.
  const key = process.env.RESEND_API_KEY;
  if (!key || !ORDER_TO) {
    return Response.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const rows = [
    ["Flavor", `${body.flavor} — ${body.flavorPrice}`],
    ["Name", name],
    ["Business", business],
    ["Email", email],
    ["Phone", body.phone],
    ["Town", body.town],
    ["Current site", body.currentSite],
    ["Timeline", body.timeline],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0;color:#8A7663">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`)
    .join("");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2B1E16">
      <h2 style="margin:0 0 4px">New order — ${esc(body.flavor)}</h2>
      <p style="margin:0 0 16px;color:#8A7663">${esc(business)} · ${esc(body.town || "")}</p>
      <table style="border-collapse:collapse;font-size:14px">${rows}</table>
      <h3 style="margin:20px 0 6px">What they need</h3>
      <p style="white-space:pre-wrap;line-height:1.55;font-size:14px">${esc(body.details)}</p>
      <hr style="border:none;border-top:1px solid #E6DACB;margin:22px 0" />
      <p style="font-size:12px;color:#8A7663;line-height:1.6">
        <b>Agreement acceptance record</b><br />
        Accepted: ${esc(body.agreementAcceptedAt)}<br />
        Version: ${esc(body.agreementVersion)}<br />
        Method: clickwrap checkbox (unchecked by default) on /order
      </p>
    </div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `glazedweb orders <${FROM}>`,
        to: [ORDER_TO],
        reply_to: email,
        subject: `New order — ${body.flavor} — ${business}`,
        html,
      }),
    });
    if (!r.ok) {
      return Response.json({ ok: false, reason: "send_failed" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, reason: "send_failed" }, { status: 502 });
  }
}
