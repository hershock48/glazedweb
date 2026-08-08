"use client";

import { useEffect } from "react";
import { LogoDefs, Mark, AnimatedMark, DripDivider, BeANumberMark, ChismEggs } from "@/components/Logo";

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
    const grid = menu.querySelector(".menu-grid") || menu;
    const thresholds = [0.3, 0.62]; // The Original melts first, Baker's Dozen clearly after
    const state = nums.map(() => ({ status: "idle", raf: 0 }));
    const fmt = (v) => Math.round(v).toLocaleString("en-US");
    const startCount = (el, st) => {
      const from = parseFloat(el.dataset.from);
      const to = parseFloat(el.dataset.to);
      const dur = 1100;
      let start;
      st.status = "counting";
      const tickDown = (ts) => {
        if (start === undefined) start = ts;
        const p = Math.min(1, (ts - start) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(from + (to - from) * ease);
        if (p < 1) st.raf = requestAnimationFrame(tickDown);
        else st.status = "done";
      };
      st.raf = requestAnimationFrame(tickDown);
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = grid.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      nums.forEach((el, i) => {
        const st = state[i];
        const t = thresholds[i] ?? 0.5;
        if (p >= t) {
          if (st.status === "idle" || st.status === "primed") startCount(el, st);
        } else if (p >= 0.1 && p < t - 0.08) {
          // in view but your eyes haven't reached it: show the market price, armed to melt
          if (st.status !== "primed") {
            if (st.raf) cancelAnimationFrame(st.raf);
            el.textContent = fmt(parseFloat(el.dataset.from));
            st.status = "primed";
          }
        } else if (p < 0.1) {
          // section out of view below: rest at the real price
          if (st.status !== "idle") {
            if (st.raf) cancelAnimationFrame(st.raf);
            el.textContent = fmt(parseFloat(el.dataset.to));
            st.status = "idle";
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
      state.forEach((st) => st.raf && cancelAnimationFrame(st.raf));
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
          <a className="brand" href="#">
            <Mark />
            <span className="bw">
              glazed<span>web</span>
            </span>
          </a>
          <nav>
            <a href="#menu">Menu</a>
            <a href="#process">Process</a>
            <a href="#work">Work</a>
            <a className="btn" href="#order">
              Get a site
            </a>
          </nav>
        </div>
      </header>

      <div className="hero">
        <div>
          <div className="kicker">Small-batch web studio</div>
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
            Hand-built sites for small businesses — no templates, no bloat, no six-month timelines. Order it like a
            donut: pick a flavor, we bake it fresh, it ships glazed.
          </p>
          <div className="ctas">
            <a className="btn big" href="#order">
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

      <div className="ticker" aria-hidden="true">
        <div className="ticker-inner">
          {[0, 1].map((i) => (
            <span key={i} style={{ display: "contents" }}>
              <span>Fresh sites</span>
              <span>◦</span>
              <span>No templates</span>
              <span>◦</span>
              <span>Simple pricing</span>
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
            Three flavors. One build price, one small monthly that keeps your site hosted, secure, and fresh — no
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
                <li>Contact form, map, hours — the essentials, done right</li>
                <li>Live in 2 weeks — then the monthly covers hosting, security, and small edits forever</li>
              </ul>
              <a className="btn ghost" href="#order">
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
                <li>Booking, menus, or e-commerce lite — one baked in</li>
                <li>SEO foundations + Google Business tune-up</li>
                <li>Monthly covers hosting, updates, edits, and a check-in</li>
              </ul>
              <a className="btn" href="#order">
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
                <li>Care plan scoped to fit — hosting, updates, and edits</li>
                <li>If you can sketch it on a napkin, we can bake it</li>
              </ul>
              <a className="btn ghost" href="#order">
                Get a quote
              </a>
            </div>
          </div>
        </div>
      </section>

      <DripDivider fill="#FFFDF8" bg="var(--cream)" />

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
              <p>We design your homepage first and show you. You react, we adjust — no big reveals, no surprises.</p>
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
              <p>Domain connected, Google set up, everything handed over. You own it all — code, content, accounts.</p>
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
          <p className="sec-sub">Recent bakes — and room in the case for yours.</p>
          <div className="work-grid">
            <a
              id="chism-card"
              className="wcard reveal"
              href="https://chism-chicken-ranch.vercel.app"
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
            <div className="wcard reveal">
              <div className="thumb" style={{ background: "linear-gradient(135deg,#BFE07A,#8FBC4E)", color: "#2B1E16" }}>
                PROJECT TWO
              </div>
              <div className="meta">
                <b>Coming soon</b>
                <span>Restaurant / menu site</span>
              </div>
            </div>
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
            Tell us about your business in two minutes. We&apos;ll reply within one business day with a plan and a price
            — no calls required until you want one.
          </p>
          <a className="btn big" href="mailto:hello@glazedweb.com">
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
                Small-batch websites for small businesses. Baked in Marshall, Michigan — serving Battle Creek,
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
                <a href="mailto:hello@glazedweb.com">hello@glazedweb.com</a>
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
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
