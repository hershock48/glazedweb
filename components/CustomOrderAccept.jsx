"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * The acceptance form on a Custom Order page. Clickwrap: type the name,
 * tick the box, one button. Ported from anchor's AgreementAccept.
 *
 * THE FAILURE PATHS TELL THE TRUTH. "unconfigured" and "send-failed" both
 * hand the visitor a prefilled mailto carrying the server's own record
 * text, so the acceptance can still reach a person even when mail plumbing
 * cannot send it. A false "you're all set" on a legal record would be the
 * worst version of the bug.
 */
export default function CustomOrderAccept({ slug, business, contactName, contactTitle, email, payHref }) {
  const [state, setState] = useState({ step: "form" });
  const [name, setName] = useState(contactName || "");
  const [title, setTitle] = useState(contactTitle || "");
  const [biz, setBiz] = useState(business);
  const [mail, setMail] = useState(email || "");
  const [agreed, setAgreed] = useState(false);

  if (state.step === "done") {
    return (
      <div className="agr-done" role="status">
        <h3>Accepted. Thank you.</h3>
        <p>A copy of the signed record is on its way to your email, and to ours.</p>
        {payHref ? (
          <p>
            One thing left: <a href={payHref}>start the monthly plan</a>. It is the same card form as any online
            checkout, and you can stop it any time.
          </p>
        ) : null}
      </div>
    );
  }

  if (state.step === "fallback") {
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Agreement acceptance, " + biz)}&body=${encodeURIComponent(state.record)}`;
    return (
      <div className="agr-done" role="status">
        <h3>One more tap to deliver it.</h3>
        <p>
          Your acceptance was recorded on our server, but the confirmation email could not be sent from here right
          now. Tap the button below and hit send; it carries the exact record, so both of us have the copy that
          matters.
        </p>
        <a className="btn" href={href}>
          Email the signed record
        </a>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setState({ step: "form", busy: true });
    try {
      const res = await fetch("/api/agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, title, business: biz, email: mail, agreed }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ step: "form", error: json.error || "Something went wrong. Nothing was recorded." });
        return;
      }
      if (json.state === "sent") setState({ step: "done" });
      else setState({ step: "fallback", record: json.record || "" });
    } catch {
      setState({ step: "form", error: `The connection dropped before anything was recorded. Try again, or email ${CONTACT_EMAIL}.` });
    }
  }

  const busy = !!state.busy;

  return (
    <form className="order-form agr-form" onSubmit={submit}>
      <div className="fgrid">
        <label>
          <span className="flabel">
            Your full name <span className="req">*</span>
          </span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" maxLength={120} />
        </label>
        <label>
          <span className="flabel">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="organization-title" maxLength={120} placeholder="Owner" />
        </label>
        <label>
          <span className="flabel">
            Business name <span className="req">*</span>
          </span>
          <input value={biz} onChange={(e) => setBiz(e.target.value)} required autoComplete="organization" maxLength={160} />
        </label>
        <label>
          <span className="flabel">
            Email <span className="req">*</span>
          </span>
          <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} required autoComplete="email" maxLength={200} />
        </label>
      </div>
      <label className="clickwrap">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
        <span>
          I have read the <a href="/agreement">glazedweb Client Agreement v1.1</a> and the Exhibit A above, and I
          accept both on behalf of the business named here.
        </span>
      </label>
      {state.error ? (
        <p className="agr-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="order-submit">
        <button className="btn big" type="submit" disabled={busy || !agreed}>
          {busy ? "Recording…" : "Accept the agreement"}
        </button>
      </div>
    </form>
  );
}
