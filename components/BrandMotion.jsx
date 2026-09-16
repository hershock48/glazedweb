"use client";
import { useEffect, useRef, useState } from "react";

// A static, server-rendered poster is the default. No 3D engine runs on visitors' devices.
export default function BrandMotion() {
  const root = useRef(null);
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [foreground, setForeground] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setEnabled(!preference.matches && !navigator.connection?.saveData);
    const syncVisibility = () => setForeground(!document.hidden);
    syncPreference(); syncVisibility(); setReady(true);
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(root.current);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);
  const playing = enabled && visible && foreground && !failed;
  return (
    <div ref={root} className="brand-motion" data-playing={playing}>
      <div className="brand-motion-shadow" aria-hidden="true" />
      <img className="brand-motion-poster" src="/brand/motion/logo-still.webp" width="600" height="720" alt="" fetchPriority="high" />
      <picture>
        <source media="(max-width: 600px)" srcSet={playing ? "/brand/motion/logo-loop-small.webp" : "/brand/motion/logo-still.webp"} />
        <img src={playing ? "/brand/motion/logo-loop.webp" : "/brand/motion/logo-still.webp"}
          width="600" height="720" alt="" decoding="async" fetchPriority="high"
          onError={() => { setFailed(true); setEnabled(false); }} />
      </picture>
      <button className="brand-motion-toggle" type="button" aria-pressed={!enabled} disabled={!ready} style={{ visibility: ready ? "visible" : "hidden" }}
        onClick={() => { setFailed(false); setEnabled(value => !value); }}>
        <span aria-hidden="true">{enabled ? "Ⅱ" : "▷"}</span>
        {enabled ? "Pause logo animation" : "Play logo animation"}
      </button>
    </div>
  );
}


