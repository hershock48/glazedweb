"use client";

import { LogoDefs, Mark, AnimatedMark, DripDivider, HeroDrip, OpenSign, BeANumberMark, ChismEggs } from "@/components/Logo";
import { CONTACT_EMAIL } from "@/lib/contact";
import { PRICING, usd, num } from "@/lib/pricing";
import { useHomeEffects } from "@/components/homeEffects";

export default function Home() {
  // Scroll effects live in components/homeEffects.js, shared with the Spanish
  // page at /do so the two homepages can't drift apart in behavior.
  useHomeEffects();

  return (
    <>
      <LogoDefs />

      <header>
        <div className="navwrap">
          {/* Was href="#", so the logo did nothing when clicked. Home is the
              one link every visitor expects a wordmark to be. */}
          <a className="brand" href="/">
            <Mark />
            <span className="bw">
              glazed<span>web</span>
            </span>
          </a>
          <nav>
            <a href="#menu">Menu</a>
            <a href="#process">Process</a>
            <a href="#work">Work</a>
            <a className="btn" href="/order">
              Get a site
            </a>
            {/* The ES pill that lived here is gone by Kevin's call (Aug 2026):
                it read as clutter to the US audience, and Dominican visitors
                never need it because middleware.js geo-routes them to /do on
                arrival. /do keeps its EN toggle as the escape hatch for a
                wrong geo guess; hreflang alternates in the layout still tell
                Google the two pages are the same site in two languages. */}
          </nav>
        </div>
      </header>

      <div className="hero">
        <div>
          <div className="kicker">Small-batch web studio · Marshall, MI</div>
          <h1>
            Websites people actually{" "}
            <em>
              crave
              <svg viewBox="0 0 200 14" preserveAspectRatio="none">
                <path
                  d="M4 10 C 40 2, 90 2, 120 7 C 150 11, 180 9, 196 5"
                  fill="none"
                  stroke="#BFE07A"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </em>
          </h1>
          <p className="sub">
            Hand-built sites for restaurants, shops, and anywhere with a counter. No templates, no third-party
            apps, no off-brand widgets. Order it like a donut: pick a flavor, we bake it fresh, it ships{" "}
            <span className="glazed">glazed</span>.
          </p>
          <div className="ctas">
            <a className="btn big" href="/order">
              Start your order
            </a>
            <a className="btn big ghost" href="#menu">
              See the menu
            </a>
          </div>
          <div className="proof">
            Launched in as little as <b>2 weeks</b> · Simple pricing · You own everything
          </div>
        </div>
        <div className="mark">
          <AnimatedMark />
        </div>
      </div>

      {/* Glaze band in place of the old scrolling ticker. The hero sits on
          --cream and #menu on --cream-2, so a cream-on-cream drip would be
          invisible; the band wears the mark's glaze instead — gradient, sheen,
          falling droplets — all inside HeroDrip. */}
      <HeroDrip />

      <section id="menu">
        <OpenSign />
        <div className="inner">
          <div className="sec-kicker" style={{ color: "var(--fern)" }}>
            The menu
          </div>
          <h2 className="sec-title">Order it like a donut.</h2>
          <p className="sec-sub">
            Three flavors. One build price, one small monthly that keeps your site hosted, secure, and up to date,
            with no surprise invoices. Every site is made from scratch, never from a template.
          </p>
          <div className="menu-grid">
            <div className="mcard reveal">
              <h3>The Original</h3>
              <div className="flavor">One-pager · classic glaze</div>
              <div className="price">
                <span className="was" aria-hidden="true">
                  market <s>{usd(PRICING.us.original.market)}</s>
                </span>
                $<span className="price-num" data-from={PRICING.us.original.market} data-to={PRICING.us.original.build}>{num(PRICING.us.original.build)}</span> <small>+ {usd(PRICING.us.original.monthly)}/mo</small>
              </div>
              <ul>
                <li>A single sharp page that says who you are and gets people to call</li>
                <li>Mobile-first, fast, and found on Google</li>
                <li>Contact form, map, hours. The essentials, done right</li>
                <li>Live in 2 weeks, then the monthly covers hosting, security, and small edits forever</li>
              </ul>
              <a className="btn ghost" href="/order?flavor=original">
                Order this
              </a>
            </div>
            <div className="mcard featured reveal">
              <div className="tag">Most popular</div>
              <h3>The Baker&apos;s Dozen</h3>
              <div className="flavor">Full site · double dipped</div>
              <div className="price">
                <span className="was" aria-hidden="true">
                  market <s>{usd(PRICING.us.dozen.market)}</s>
                </span>
                $<span className="price-num" data-from={PRICING.us.dozen.market} data-to={PRICING.us.dozen.build}>{num(PRICING.us.dozen.build)}</span> <small>+ {usd(PRICING.us.dozen.monthly)}/mo</small>
              </div>
              <ul>
                {/* Ordering leads, per Kevin's 2026-09-01 focus ruling: the
                    studio's audience is businesses that take orders, and the
                    most differentiated line item goes first, not third. */}
                <li>Online ordering or booking, built into your own site</li>
                <li>Up to 6 pages: services, about, gallery, the works</li>
                <li>Custom design that looks like you, not a theme</li>
                <li>SEO foundations + Google Business tune-up</li>
                <li>Monthly covers hosting, updates, edits, and a check-in</li>
              </ul>
              <a className="btn" href="/order?flavor=dozen">
                Order this
              </a>
            </div>
            <div className="mcard reveal">
              <h3>Custom Order</h3>
              <div className="flavor">Special recipe</div>
              <div className="price">Let&apos;s talk</div>
              <ul>
                <li>Online ordering, POS integration, stores, web apps</li>
                <li>Rebrands and redesigns of existing sites</li>
                <li>Care plan scoped to fit: hosting, updates, and edits</li>
                <li>If you can sketch it on a napkin, we can build it</li>
              </ul>
              <a className="btn ghost" href="/order?flavor=custom">
                Get a quote
              </a>
            </div>
          </div>
          {/* The counter, named where the menu is read. EN-only because it
              points at an English SEO page; /do mirrors the bullet order but
              its ordering story is still WhatsApp-first. */}
          <p className="menu-note">
            Take orders? We build the counter too: ordering on your own site, tied into your register, with no
            percentage commission. <a href="/online-ordering-website-michigan">How ordering works</a>
          </p>
        </div>
      </section>

      <DripDivider fill="#FFFDF8" bg="var(--cream)" />

      <section id="process">
        <div className="inner">
          <div className="sec-kicker" style={{ color: "var(--fern)" }}>
            The process
          </div>
          <h2 className="sec-title">Out of the fryer in four steps.</h2>
          <div className="steps">
            <div className="step reveal">
              <div className="num">1</div>
              <h4>Pick your flavor</h4>
              <div className="sub">Discovery</div>
              <p>A 30-minute call. You talk about your business; we take notes and pick the right package together.</p>
            </div>
            <div className="step reveal">
              <div className="num">2</div>
              <h4>Mix the dough</h4>
              <div className="sub">Design</div>
              <p>We design your homepage first and show you. You react, we adjust. No big reveals, no surprises.</p>
            </div>
            <div className="step reveal">
              <div className="num">3</div>
              <h4>Into the fryer</h4>
              <div className="sub">Build</div>
              <p>We build the real thing: fast, mobile-first, accessible. You watch progress on a live link the whole time.</p>
            </div>
            <div className="step reveal">
              <div className="num">4</div>
              <h4>Glazed &amp; delivered</h4>
              <div className="sub">Launch</div>
              <p>Domain connected, Google set up, everything handed over. You own it all: code, content, accounts.</p>
            </div>
          </div>
        </div>
      </section>

      <DripDivider fill="#FDF6EC" bg="var(--chocolate-2)" />

      <section id="work">
        <div className="inner">
          <div className="sec-kicker">The case</div>
          <h2 className="sec-title" style={{ color: "#F3EAE1" }}>
            Straight from the shop.
          </h2>
          <p className="sec-sub">Recent work, and room in the case for yours.</p>
          <div className="work-grid">
            <a
              id="chism-card"
              className="wcard reveal"
              href="https://www.chismchickenranch.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bok-bubble" aria-hidden="true">
                bok bok bok
              </div>
              <div
                className="thumb"
                style={{
                  background: "linear-gradient(135deg,#B5532A,#8A3C1C)",
                  color: "#FFF7EA",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <svg
                  viewBox="0 0 220 54"
                  width="200"
                  height="49"
                  aria-hidden="true"
                  style={{ overflow: "visible", marginBottom: -10 }}
                >
                  <defs>
                    <path id="chismArcPath" d="M 14 48 Q 110 6 206 48" fill="none" />
                  </defs>
                  <text fill="#FFF7EA" fontSize="13.5" fontWeight="800" letterSpacing="2">
                    <textPath href="#chismArcPath" startOffset="50%" textAnchor="middle">
                      CHISM CHICKEN RANCH
                    </textPath>
                  </text>
                </svg>
                <ChismEggs className="chism-eggs" />
              </div>
              <div className="meta">
                <b>Chism Chicken Ranch</b>
                <span>Pasture-raised poultry · Marshall, MI</span>
              </div>
            </a>
            {/* Copper Athletic Club. Points at /demo, not the root of that
                host: the root is the proposal document, which is written for
                them and not for the public. Says "in progress" because it is a
                live demo of an unsigned job, and the rest of this case is real
                shipped work. Palette and the proof line are theirs. */}
            <a
              id="cac-card"
              className="wcard reveal"
              href="https://copperac.glazedweb.com/demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="thumb"
                style={{
                  background: "linear-gradient(150deg,#191919,#0d0d0d)",
                  color: "#e8e2d8",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                <span className="cac-glow" aria-hidden="true" />
                <span className="cac-lockup">
                  <span className="cac-word">COPPER</span>
                  <span className="cac-sub">ATHLETIC CLUB</span>
                </span>
                <span className="cac-rule" aria-hidden="true" />
                {/* Kept in sync with SITE.tvCount in the copperac repo by hand,
                    because this card cannot import from there. It has now been
                    14 (mine, invented), 9, and 7. If it changes again, the other
                    two places are that constant and copperac's own share card,
                    public/og/home.jpg. "EST. 2013" was dropped for good:
                    Copper's Facebook avatar reads "est. 2018" and their site
                    states no year, so we were publishing a likely-wrong
                    founding date for a client on our own portfolio. */}
                {/* Was "7 TVS · 0 TREADMILLS". Retired at the owner's request on
                    the Copper site itself, and this card kept publishing it,
                    which is the portfolio-card-in-another-repo failure the
                    README warns about. This is their own sentence, compressed:
                    "Every wall is memorabilia and every screen dedicated to
                    sports." Two counts nobody could verify become two claims
                    that are true on every night of the year. */}
                <span className="cac-spec">EVERY WALL · EVERY SCREEN</span>
              </div>
              <div className="meta">
                <b>Copper Athletic Club</b>
                <span>Sports bar · Marshall, MI · in progress</span>
              </div>
            </a>
            <a
              id="ban-card"
              className="wcard reveal"
              href="https://www.beanumber.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="thumb"
                style={{
                  background: "linear-gradient(160deg,#1E1B17,#0d0d0d)",
                  color: "#FFF8F0",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <BeANumberMark size={54} style={{ color: "#D4A843" }} className="ban-logo" />
                <span className="ban-counter" style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px" }}>
                  № <span id="ban-num">001</span>
                </span>
                <span style={{ fontSize: 10.5, letterSpacing: ".22em", opacity: 0.8 }}>EVERY NUMBER IS A CHILD</span>
              </div>
              <div className="meta">
                <b>Be A Number International</b>
                <span>Nonprofit · child sponsorship · beanumber.org</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <DripDivider fill="#201712" bg="var(--raspberry)" />

      <section className="ctaband" id="order">
        <div className="inner">
          <h2>Hungry yet?</h2>
          <p>
            Tell us about your business in two minutes. We&apos;ll reply within one business day with a plan and a price.
            No calls required until you want one.
          </p>
          <a className="btn big" href="/order">
            Start your order →
          </a>
        </div>
      </section>

      <DripDivider fill="#E84D8A" bg="var(--chocolate-2)" />

      <footer>
        <div className="inner">
          <div className="foot-top">
            <div>
              <div className="foot-brand">
                <Mark width={30} height={38} hole="#201712" />
                <span className="bw">
                  glazed<span>web</span>
                </span>
              </div>
              <p style={{ marginTop: 14, fontSize: 13.5, maxWidth: 260, lineHeight: 1.6 }}>
                Small-batch websites for small businesses. Baked in Marshall, Michigan, serving the whole state and
                everywhere else.
              </p>
            </div>
            <div className="foot-links">
              <div className="col">
                <b>Shop</b>
                <a href="#menu">The menu</a>
                <a href="#process">Process</a>
                <a href="#work">Work</a>
              </div>
              {/* Internal links are how Google discovers and weighs the
                  service pages; the sitemap alone is a hint, not a vote. */}
              <div className="col">
                <b>Services</b>
                <a href="/restaurant-website-design-michigan">Restaurant websites</a>
                <a href="/online-ordering-website-michigan">Online ordering</a>
                <a href="/restaurant-pos-integration-michigan">POS integration</a>
                <a href="/small-business-web-design-michigan">Small business sites</a>
              </div>
              <div className="col">
                <b>Contact</b>
                <span style={{ display: "block", color: "#A6907F", fontSize: 14, marginBottom: 8 }}>
                  Marshall, Michigan
                </span>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                {/* Instagram and Facebook links lived here as href="#".
                    Neither account exists yet, so they went nowhere at all.
                    When the accounts are real, add them back here and add a
                    sameAs array to the Organization JSON-LD in layout.jsx at
                    the same time, which is what actually tells Google the
                    profiles belong to this business. */}
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 glazedweb. All rights reserved.</span>
            <span>Websites, fresh daily.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
