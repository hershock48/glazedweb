"use client";

import { useState } from "react";

/**
 * A note written for the client to send on, with a Copy button: the email
 * to whoever holds their domain, for instance. The text sits in the page
 * as a <pre>, so it reads and prints without JavaScript; the button copies
 * it whole, says "Copied" for a moment, and falls back to selecting the
 * text when the clipboard is refused (an http page, an old browser), so the
 * reader can still copy by hand.
 *
 * First use: Copper's note to Kyle, 15 Oct 2026 (Kevin: "an email to his
 * current provider on this page where he can click a button and it copies").
 */
export default function CopyNote({ id, text, label = "Copy" }) {
  const [state, setState] = useState("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      const pre = document.getElementById(id);
      if (pre) {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setState("select");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <div className="agr-copy">
      <button type="button" className="btn agr-copy-btn" onClick={copy} aria-live="polite">
        {state === "copied" ? "Copied" : state === "select" ? "Selected, press copy" : label}
      </button>
      <pre id={id}>{text}</pre>
    </div>
  );
}
