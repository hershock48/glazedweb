"use client";

import { useEffect } from "react";

// Every scroll effect on the homepage, shared by the English page at / and the
// Dominican page at /do. The two pages carry different copy but must behave
// identically, and four hand-tuned effects duplicated across two files is how
// they'd drift apart. Both pages render the same ids and classes these hooks
// look for (#ban-card, #chism-card, #menu, #process, .reveal), so the hook
// binds by document query and neither page passes anything in.
export function useHomeEffects() {
  // Freeze decorative loops offscreen and in background tabs, resuming their
  // existing phase rather than restarting the pour each time the hero returns.
  useEffect(() => {
    const nodes = [...document.querySelectorAll('.animated-mark, .hero-drip')];
    const visible = new Set(nodes);
    const sync = () => nodes.forEach(node => node.classList.toggle('motion-paused', document.hidden || !visible.has(node)));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      sync();
    });
    nodes.forEach(node => observer.observe(node));
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); nodes.forEach(node => node.classList.remove('motion-paused')); };
  }, []);

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
