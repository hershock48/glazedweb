"use client";

import { useEffect } from "react";

// Every scroll effect on the homepage, shared by the English page at / and the
// Dominican page at /do. The two pages carry different copy but must behave
// identically, and four hand-tuned effects duplicated across two files is how
// they'd drift apart. Both pages render the same ids and classes these hooks
// look for (#ban-card, #chism-card, #menu, #process, .reveal), so the hook
// binds by document query and neither page passes anything in.
export function useHomeEffects() {
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

  // Be A Number work card: the shirt number rolls as you scroll:
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
  // to scroll position: the big glazed one drops in first, then two smaller
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
  // your scroll reaches it: first you glimpse the market price, then it melts
  // to ours as your eyes pass. Scroll back up and it re-arms for the next pass.
  useEffect(() => {
    const menu = document.getElementById("menu");
    if (!menu) return;
    const nums = Array.from(menu.querySelectorAll(".price-num"));
    if (!nums.length) return;
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // struck-through anchor still shows; numbers stay static
    // en-US grouping (1,900) is also how prices are written in the DR, so one
    // formatter serves both pages.
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

  // Process steps: each number glazes as your scroll reaches it: 1 first,
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
}
