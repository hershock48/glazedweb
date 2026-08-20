"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";
import { LogoDefs, Mark } from "@/components/Logo";

const FLAVORS = {
  original: { key: "original", name: "The Original", price: "$750 + $59/mo", blurb: "One-pager · classic glaze" },
  dozen: { key: "dozen", name: "The Baker's Dozen", price: "$1,900 + $99/mo", blurb: "Full site · double dipped" },
  custom: { key: "custom", name: "Custom Order", price: "Let's talk", blurb: "Special recipe" },
};

export default function OrderPage() {
  const [flavor, setFlavor] = useState("dozen");
  /** Set when they arrived from the Jelly section rather than the menu. Carried into
   *  the payload so the enquiry does not land looking like every other one. */
  const [wantsOrdering, setWantsOrdering] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | done | fallback | error
  const [fallbackHref, setFallbackHref] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("flavor");
    if (q && FLAVORS[q]) setFlavor(q);
    if (params.get("jelly") === "1") setWantsOrdering(true);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.flavor = FLAVORS[flavor].name;
    payload.flavorPrice = FLAVORS[flavor].price;
    if (wantsOrdering) {
      payload.ordering = "Yes, came in through Jelly";
      // Object.fromEntries already put the raw field in payload, so this normalises it
      // rather than reading the form again. An empty box must still send a value, or the
      // email row disappears and "they did not answer" looks identical to "we never asked".
      payload.orderVolume = String(payload.orderVolume || "").trim() || "not given";
    }
    payload.agreementAcceptedAt = new Date().toISOString();
    payload.agreementVersion = "v1.0 (2026-08)";
    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("done");
        return;
      }
      // Not configured yet (or transient failure): hand them a prefilled email
      const lines = [
        `Flavor: ${payload.flavor} (${payload.flavorPrice})`,
        ...(payload.ordering ? [`Online ordering: ${payload.ordering}`] : []),
        ...(payload.orderVolume ? [`Orders per month: ${payload.orderVolume}`] : []),
        `Name: ${payload.name || ""}`,
        `Business: ${payload.business || ""}`,
        `Email: ${payload.email || ""}`,
        `Phone: ${payload.phone || ""}`,
        `Town: ${payload.town || ""}`,
        `Current site: ${payload.currentSite || "none"}`,
        `Timeline: ${payload.timeline || ""}`,
        "",
        "About the business / what they need:",
        payload.details || "",
        "",
        `Agreement accepted: ${payload.agreementAcceptedAt} (${payload.agreementVersion})`,
      ].join("\n");
      setFallbackHref(
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
          `New order${payload.ordering ? " + Jelly" : ""}: ${payload.flavor}, ${
            payload.business || payload.name || "new client"
          }`
        )}&body=${encodeURIComponent(lines)}`
      );
      setStatus(data?.reason === "not_configured" ? "fallback" : "fallback");
    } catch {
      setStatus("error");
    }
  };

  const f = FLAVORS[flavor];

  if (status === "done") {
    return (
      <>
        <LogoDefs />
        <OrderHeader />
        <main className="order-wrap">
          <div className="order-done">
            <div className="done-mark">
              <Mark width={54} height={70} hole="#FFFDF8" />
            </div>
            <h1>Order in the oven.</h1>
            <p>
              Got it. Your {f.name} order is on the board. I read every one myself and reply within one business day
              with next steps and a start date. No calls required until you want one.
            </p>
            <p className="done-small">Check your inbox for a copy. If it&apos;s not there in a few minutes, peek in spam.</p>
            <Link className="btn big" href="/">
              Back to the shop
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <LogoDefs />
      <OrderHeader />
      <main className="order-wrap">
        <div className="order-head">
          <div className="sec-kicker" style={{ color: "var(--fern)" }}>
            Start your order
          </div>
          <h1>Tell us what you need.</h1>
          <p className="sec-sub">
            Two minutes, no calls, no pressure. You&apos;ll get a real reply from Kevin within one business day, with a
            plan, a price, and a start date.
          </p>
        </div>

        <form className="order-form" onSubmit={onSubmit}>
          <section className="ostep">
            <h2>
              <span className="onum">1</span> Pick your flavor
            </h2>
            <div className="flavor-picker">
              {Object.values(FLAVORS).map((opt) => (
                <label key={opt.key} className={`fopt ${flavor === opt.key ? "on" : ""}`}>
                  <input
                    type="radio"
                    name="flavorChoice"
                    value={opt.key}
                    checked={flavor === opt.key}
                    onChange={() => setFlavor(opt.key)}
                  />
                  <b>{opt.name}</b>
                  <span className="fblurb">{opt.blurb}</span>
                  <span className="fprice">{opt.price}</span>
                </label>
              ))}
            </div>
            {wantsOrdering && (
              <p className="jelly-note">
                <b>Online ordering is on the list.</b> You came in from Jelly, so send us your
                current processing statement and we will work out whether ours actually beats it.
                If it does not, we will tell you so and you owe nothing for the asking. Pick
                whichever size site fits: ordering goes in either way.
              </p>
            )}
            <p className="hint">
              Not sure? Pick the closest one and we&apos;ll sort it out together. See the full{" "}
              <Link href="/#menu">menu</Link>.
            </p>
          </section>

          <section className="ostep">
            <h2>
              <span className="onum">2</span> Who are we baking for?
            </h2>
            <div className="fgrid">
              <label>
                <span className="flabel">Your name <span className="req">*</span></span>
                <input name="name" required autoComplete="name" placeholder="Jane Baker" />
              </label>
              <label>
                <span className="flabel">Business name <span className="req">*</span></span>
                <input name="business" required placeholder="Jane&apos;s Bakery" />
              </label>
              {wantsOrdering && (
                <label>
                  <span className="flabel">Online orders in a normal month</span>
                  <input
                    name="orderVolume"
                    inputMode="numeric"
                    placeholder="A rough number is fine"
                  />
                </label>
              )}
              <label>
                <span className="flabel">Email <span className="req">*</span></span>
                <input name="email" type="email" required autoComplete="email" placeholder="jane@janesbakery.com" />
              </label>
              <label>
                <span className="flabel">Phone</span>
                <input name="phone" type="tel" autoComplete="tel" placeholder="(269) 555-0134" />
              </label>
              <label>
                <span className="flabel">Town</span>
                <input name="town" placeholder="Marshall, MI" />
              </label>
              <label>
                <span className="flabel">Current website (if any)</span>
                <input name="currentSite" placeholder="janesbakery.com, or none yet" />
              </label>
            </div>
            <label className="full">
              <span className="flabel">What do you need the site to do? <span className="req">*</span></span>
              <textarea
                name="details"
                required
                rows={5}
                placeholder="Tell me about the business, who you're trying to reach, and what the site needs to do: take orders, show a menu, get the phone ringing…"
              />
            </label>
            <label className="full">
              When would you like to be live?
              <select name="timeline" defaultValue="">
                <option value="">No rush / flexible</option>
                <option value="ASAP">As soon as possible</option>
                <option value="2-4 weeks">In the next 2–4 weeks</option>
                <option value="1-2 months">1–2 months out</option>
                <option value="Just exploring">Just exploring for now</option>
              </select>
            </label>
          </section>

          <section className="ostep">
            <h2>
              <span className="onum">3</span> The fine print
            </h2>
            <div className="terms-box">
              <p className="terms-lead">The whole deal, in five lines:</p>
              <ul>
                <li>
                  <b>You own it all.</b> When the build is paid in full, the site is yours: code, content, accounts.
                </li>
                <li>
                  <b>No lock-in.</b> The monthly covers hosting, security, and edits. Cancel anytime; you keep the site.
                </li>
                <li>
                  <b>Your domain is yours</b> from day one, and transfers to you free whenever you ask.
                </li>
                <li>
                  <b>Nothing is owed today.</b> Submitting this doesn&apos;t charge you. We confirm scope first, then
                  invoice a deposit to start.
                </li>
                <li>
                  <b>Two revision rounds</b> are included in the build; anything beyond scope gets quoted before work
                  starts.
                </li>
              </ul>
              <p className="terms-link">
                Full terms: <Link href="/agreement">Glazed Web Service Agreement</Link> (v1.0). It&apos;s two pages and
                written in plain English.
              </p>
            </div>
            <label className="clickwrap">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>
                I&apos;ve read and agree to the <Link href="/agreement">Glazed Web Service Agreement</Link>.
              </span>
            </label>
          </section>

          <div className="order-submit">
            <button className="btn big" type="submit" disabled={!agreed || status === "sending"}>
              {status === "sending" ? "Sending…" : "Send my order →"}
            </button>
            <span className="submit-note">
              {agreed ? "No payment due now." : "Tick the box above to send your order."}
            </span>
          </div>

          {/* Was: "Email isn't wired up on this form yet". True, and the wrong
              thing to say to somebody deciding whether to pay us to build their
              website. It read as an apology for our own half-finished site on
              the last screen of the funnel. Same behaviour, no confession: the
              hand-off to their mail app is presented as the step it is. */}
          {status === "fallback" && (
            <div className="order-note">
              <b>One more tap.</b> Your answers are ready to go in an email. Open it, hit send, and it is with me.
              <a className="btn" href={fallbackHref} style={{ marginTop: 12, display: "inline-block" }}>
                Open pre-filled email
              </a>
            </div>
          )}
          {status === "error" && (
            <div className="order-note">
              Something went sideways on our end. Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and I&apos;ll take it from there.
            </div>
          )}
        </form>
      </main>
      <footer className="order-foot">
        <Link href="/">← glazedweb</Link>
        <span>Marshall, Michigan · {CONTACT_EMAIL}</span>
      </footer>
    </>
  );
}

function OrderHeader() {
  return (
    <header>
      <div className="navwrap">
        <Link className="brand" href="/">
          <Mark />
          <span className="bw">
            glazed<span>web</span>
          </span>
        </Link>
        <nav>
          <Link href="/#menu">Menu</Link>
          <Link href="/#process">Process</Link>
          <Link href="/#work">Work</Link>
        </nav>
      </div>
    </header>
  );
}
