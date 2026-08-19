"use client";

import { useEffect } from "react";
import { LogoDefs, Mark, AnimatedMark, DripDivider, BeANumberMark, ChismEggs } from "@/components/Logo";
import { CONTACT_EMAIL } from "@/lib/contact";

export default function Home() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Be A Number work card: the shirt number rolls as you scroll —
  // every number is a child, so the card cycles through them (001–052).
  useEffect(() => {
    const card = document.getElementById("ban-card");
    const num = document.getElementById("ban-num");
    if (!card || !num) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = card.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const s = String(1 + Math.round(p * 51)).padStart(3, "0");
      if (num.textContent !== s) {
        num.textContent = s;
        const wrap = num.parentElement;
        wrap.classList.remove("tick");
        void wrap.offsetWidth; // restart the pulse animation
        wrap.classList.add("tick");
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Chism card: fresh eggs, delivered by scroll. Each egg's fall is scrubbed
  // to scroll position — the big glazed one drops in first, then two smaller
  // ones follow, each landing with a little squash and a deepening shadow.
  // Scroll back up and they lift right back out of the card.
  useEffect(() => {
    const card = document.getElementById("chism-card");
    if (!card) return;
    const eggs = [
      { el: card.querySelector(".egg-a"), sh: card.querySelector(".sh-a"), zone: [0.34, 0.47], tilt: 0 },
      { el: card.querySelector(".egg-b"), sh: card.querySelector(".sh-b"), zone: [0.43, 0.56], tilt: -7 },
      { el: card.querySelector(".egg-c"), sh: card.querySelector(".sh-c"), zone: [0.51, 0.64], tilt: 6 },
    ].filter((e) => e.el);
    if (!eggs.length) return;
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const place = (egg, ei) => {
      const y = -200 * (1 - ei); // starts fully above the card's top edge
      const k = ei > 0.86 ? (ei - 0.86) / 0.14 : 0;
      const squash = 1 - 0.13 * Math.sin(k * Math.PI);
      egg.el.style.transform = `translateY(${y}px) rotate(${egg.tilt * ei}deg) scaleY(${squash})`;
      if (egg.sh) {
        egg.sh.style.opacity = String(0.12 + 0.88 * ei);
        egg.sh.style.transform = `scaleX(${0.5 + 0.5 * ei})`;
      }
    };
    if (reduced) {
      eggs.forEach((egg) => place(egg, 1)); // calm, fully-set scene
      return;
    }
    let hideT = 0;
    let raf = 0;
    let visible = false;
    const render = () => {
      raf = 0;
      const r = card.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const cp = clamp01((vh - r.top) / (vh + r.height));
      eggs.forEach((egg) => place(egg, clamp01((cp - egg.zone[0]) / (egg.zone[1] - egg.zone[0]))));
    };
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (!visible) card.classList.remove("boking");
        else render();
      },
      { threshold: 0.2 }
    );
    io.observe(card);
    const onScroll = () => {
      if (visible) {
        card.classList.add("boking");
        clearTimeout(hideT);
        hideT = setTimeout(() => card.classList.remove("boking"), 1200);
      }
      if (!raf) raf = requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(hideT);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Menu prices: each one counts down from its market anchor SEPARATELY, as
  // your scroll reaches it — first you glimpse the market price, then it melts
  // to ours as your eyes pass. Scroll back up and it re-arms for the next pass.
  useEffect(() => {
    const menu = document.getElementById("menu");
    if (!menu) return;
    const nums = Array.from(menu.querySelectorAll(".price-num"));
    if (!nums.length) return;
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // struck-through anchor still shows; numbers stay static
    const fmt = (v) => Math.round(v).toLocaleString("en-US");
    // Each price watches its OWN card: melts as that card reaches your eyes.
    // Stacked (mobile) => naturally sequential; same row (desktop) => a short
    // left-to-right time stagger so they still melt one after another.
    const items = nums.map((el) => ({
      el,
      card: el.closest(".mcard") || el,
      status: "idle", // idle | primed | counting | done
      raf: 0,
      delayT: 0,
    }));
    const cancelWork = (it) => {
      if (it.raf) cancelAnimationFrame(it.raf);
      if (it.delayT) clearTimeout(it.delayT);
      it.raf = 0;
      it.delayT = 0;
    };
    const startCount = (it) => {
      const from = parseFloat(it.el.dataset.from);
      const to = parseFloat(it.el.dataset.to);
      const dur = 1100;
      let start;
      const tickDown = (ts) => {
        if (start === undefined) start = ts;
        const p = Math.min(1, (ts - start) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        it.el.textContent = fmt(from + (to - from) * ease);
        if (p < 1) it.raf = requestAnimationFrame(tickDown);
        else it.status = "done";
      };
      it.raf = requestAnimationFrame(tickDown);
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const tops = items.map((it) => Math.round(it.card.getBoundingClientRect().top));
      items.forEach((it, idx) => {
        const r = it.card.getBoundingClientRect();
        const cp = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        if (cp >= 0.45) {
          if (it.status === "idle" || it.status === "primed") {
            const rowMatesBefore = items.filter((o, j) => j < idx && Math.abs(tops[j] - tops[idx]) < 8).length;
            it.status = "counting";
            it.delayT = setTimeout(() => startCount(it), rowMatesBefore * 380);
          }
        } else if (cp >= 0.12 && cp < 0.38) {
          if (it.status !== "primed") {
            cancelWork(it);
            it.el.textContent = fmt(parseFloat(it.el.dataset.from));
            it.status = "primed";
          }
        } else if (cp < 0.12) {
          if (it.status !== "idle") {
            cancelWork(it);
            it.el.textContent = fmt(parseFloat(it.el.dataset.to));
            it.status = "idle";
          }
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      items.forEach(cancelWork);
    };
  }, []);

  // Process steps: each number glazes as your scroll reaches it — 1 first,
  // then 2, 3, 4 as the section moves through the viewport. Recrossing a
  // threshold re-runs that number's shine.
  useEffect(() => {
    const sec = document.getElementById("process");
    if (!sec) return;
    const steps = Array.from(sec.querySelectorAll(".step"));
    if (!steps.length) return;
    const thresholds = [0.22, 0.38, 0.54, 0.7];
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      steps.forEach((el, i) => {
        const t = thresholds[i] ?? 0.8;
        if (p >= t) el.classList.add("glazed");
        else if (p < t - 0.06) el.classList.remove("glazed");
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
            {/* The new pitch needs a way in. Placed second, next to the packages,
                because Jelly is what goes inside one rather than a fourth package. */}
            <a href="#jelly">Jelly</a>
            <a href="#process">Process</a>
            <a href="#work">Work</a>
            <a className="btn" href="/order">
              Get a site
            </a>
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
            Hand-built sites for restaurants, food trucks, breweries and the local shops around them. And if people
            order from you online, we build the ordering into your site instead of renting it from a platform.
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
            Live in as little as <b>2 weeks</b> · You own everything · Online ordering with <b>no monthly fee</b>
          </div>
        </div>
        <div className="mark">
          <AnimatedMark />
        </div>
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-inner">
          {[0, 1].map((i) => (
            <span key={i} style={{ display: "contents" }}>
              <span>Fresh sites</span>
              <span>◦</span>
              <span>Ordering built in</span>
              <span>◦</span>
              <span>No templates</span>
              <span>◦</span>
              <span>Your orders, your list</span>
              <span>◦</span>
              <span>2-week launches</span>
              <span>◦</span>
              <span>You own the code</span>
              <span>◦</span>
              <span>Baked in Marshall, MI</span>
              <span>◦</span>
            </span>
          ))}
        </div>
      </div>

      <section id="menu">
        <div className="inner">
          <div className="sec-kicker" style={{ color: "var(--fern)" }}>
            The menu
          </div>
          <h2 className="sec-title">Order it like a donut.</h2>
          <p className="sec-sub">
            Three flavors. One build price, one small monthly that keeps your site hosted, secure, and fresh, with no
            surprise invoices. Every site is baked from scratch, never from a template.
          </p>
          <div className="menu-grid">
            <div className="mcard reveal">
              <h3>The Original</h3>
              <div className="flavor">One-pager · classic glaze</div>
              <div className="price">
                <span className="was" aria-hidden="true">
                  market <s>$1,500</s>
                </span>
                $<span className="price-num" data-from="1500" data-to="750">750</span> <small>+ $59/mo</small>
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
                  market <s>$3,900</s>
                </span>
                $<span className="price-num" data-from="3900" data-to="1900">1,900</span> <small>+ $99/mo</small>
              </div>
              <ul>
                <li>Up to 6 pages: services, about, gallery, the works</li>
                <li>Custom design that looks like you, not a theme</li>
                <li>Booking, menus, or online ordering, one baked in</li>
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
                <li>Online stores, membership sites, web apps</li>
                <li>Rebrands and redesigns of existing sites</li>
                <li>Care plan scoped to fit: hosting, updates, and edits</li>
                <li>If you can sketch it on a napkin, we can bake it</li>
              </ul>
              <a className="btn ghost" href="/order?flavor=custom">
                Get a quote
              </a>
            </div>
          </div>
        </div>
      </section>

      <DripDivider fill="#FFFDF8" bg="var(--chocolate-2)" />

      <section id="jelly">
        <div className="inner">
          <div className="sec-kicker">The filling</div>
          <h2 className="sec-title">Jelly goes inside the donut.</h2>
          <p className="sec-sub">
            If people order from you online, that ordering can live in your own website instead of on someone
            else&apos;s platform. Same kitchen, same register, same menu. The difference is whose customer it is when
            the order lands.
          </p>

          <div className="jgrid">
            <div className="jcard reveal">
              <h3>Order ahead</h3>
              <div className="jflavor">In your own site</div>
              <div className="jprice">
                $0<small>/mo</small>
              </div>
              <ul>
                <li>Guests order from your website, not a marketplace that also sells your competitor</li>
                <li>You keep the order, the email address and the phone number</li>
                <li>Your POS does not change. This replaces the online channel, not the register</li>
                <li>Guests pay 99¢ at checkout and half of that comes back to you</li>
              </ul>
            </div>

            <div className="jcard reveal">
              <h3>Jelly Register</h3>
              <div className="jflavor">At the counter</div>
              <div className="jprice">
                $249<small> once</small>
              </div>
              <ul>
                <li>2.7% + 15¢ all in, and a dime of that is ours</li>
                <li>Bought once, not rented monthly like the handheld you have now</li>
                <li>Same rails as the online ordering, so it is one payout and one report</li>
                <li>Optional. The site works without it</li>
              </ul>
            </div>

            <div className="jcard reveal">
              <h3>The math</h3>
              <div className="jflavor">On your own statement</div>
              <div className="jprice">Bring it</div>
              <ul>
                <li>Toast&apos;s pay-as-you-go processing runs up to 3.69% + 15¢</li>
                <li>A rented handheld is around $50 a month on top of that</li>
                <li>On $10,000 of card volume the rate difference alone is about $99 a month</li>
                <li>Those are published numbers. Yours is the one that decides it, so we read it first</li>
              </ul>
            </div>
          </div>

          <p className="jnote">
            Jelly is new, and we would rather say so than have you find out. It is going in at Copper Athletic Club
            and Cookin&apos; with Beans first, both here in Marshall, and the standing rule is simple: if the all-in
            cost does not beat the statement you are already paying, we do not switch you.
          </p>

          <div className="jctas">
            <a className="btn big" href="/order?flavor=dozen">
              Talk about ordering
            </a>
          </div>
        </div>
      </section>

      <DripDivider fill="#201712" bg="var(--cream)" />

      <section id="process">
        <div className="inner">
          <div className="sec-kicker" style={{ color: "var(--fern)" }}>
            The process
          </div>
          <h2 className="sec-title">Fresh out of the fryer in four steps.</h2>
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
            Fresh from the shop.
          </h2>
          <p className="sec-sub">Recent bakes, and room in the case for yours.</p>
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
                Small-batch websites for small businesses. Baked in Marshall, Michigan, serving Battle Creek,
                Calhoun County, and everywhere else.
              </p>
            </div>
            <div className="foot-links">
              <div className="col">
                <b>Shop</b>
                <a href="#menu">The menu</a>
                <a href="#process">Process</a>
                <a href="#work">Work</a>
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
