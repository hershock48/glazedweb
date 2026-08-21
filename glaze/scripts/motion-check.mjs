/**
 * Motion, checked for the two things that actually break.
 *
 * 1. DOES ANY ANIMATION PUSH THE DOCUMENT SIDEWAYS WHILE IT RUNS? The Pastrami
 *    Joe's hero photograph scaled to 1.055 on load. The audit's overflow check
 *    measures a settled page and would never see a scrollbar that exists for
 *    1.6 seconds. This samples scrollWidth every 100ms through the entrance.
 *
 * 2. DOES prefers-reduced-motion ACTUALLY STOP IT? A reduced-motion block that
 *    is overridden by a later rule is worse than none, because it looks
 *    handled. (The louies hat froze mid-fall at translateY(-55px) exactly this
 *    way.) This loads the page with the media feature forced and asserts that
 *    every animated element reports animation-name: none.
 *
 *   node glaze/scripts/motion-check.mjs --base http://127.0.0.1:4490 --routes /
 *
 * Generalised from pjs/tools/motion-check.mjs: routes come from --routes, and
 * the styled-page wait no longer keys on one site's background hex. It waits
 * for any non-transparent background on html or body, because sampling an
 * unstyled document reports its raw content width at every viewport and fails
 * all three widths identically, which is how the original check first "failed".
 */
import { loadChromium, launchOpts, arg } from "./lib/browser.mjs";

const chromium = await loadChromium();
const BASE = arg("base", "http://127.0.0.1:4490");
const ROUTES = arg("routes", "/").split(",").map((r) => r.trim()).filter(Boolean);
const browser = await chromium.launch(launchOpts());
let bad = 0;

// ---- 1. transient horizontal overflow, sampled through the entrance
for (const route of ROUTES) {
  for (const width of [1440, 390, 320]) {
    const c = await browser.newContext({ viewport: { width, height: 900 } });
    const p = await c.newPage();
    await p.goto(BASE + route, { waitUntil: "commit" });
    await p
      .waitForFunction(
        () => {
          const clear = "rgba(0, 0, 0, 0)";
          return (
            getComputedStyle(document.body).backgroundColor !== clear ||
            getComputedStyle(document.documentElement).backgroundColor !== clear
          );
        },
        null,
        { timeout: 5000 }
      )
      .catch(() => console.log(`  note  ${route} never painted a background; sampling anyway`));
    let worst = 0;
    for (let i = 0; i < 26; i += 1) {
      const w = await p.evaluate(() => document.documentElement.scrollWidth).catch(() => 0);
      if (w > worst) worst = w;
      await p.waitForTimeout(100);
    }
    const over = worst - width;
    const ok = over <= 1;
    if (!ok) bad += 1;
    console.log(
      `  ${ok ? "ok  " : "FAIL"}  ${route.padEnd(16)} ${String(width).padStart(4)}px  widest document during the entrance ${worst}px (${over > 0 ? "+" : ""}${over})`
    );
    await c.close();
  }
}

// ---- 2. reduced motion really is no motion
for (const route of ROUTES) {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await c.newPage();
  await p.goto(BASE + route, { waitUntil: "networkidle" });
  const running = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll("*").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.animationName && cs.animationName !== "none") {
        out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} -> ${cs.animationName}`);
      }
    });
    return out;
  });
  const ok = running.length === 0;
  if (!ok) bad += 1;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${route.padEnd(16)} reduced motion: ${ok ? "nothing animates" : running.join(", ")}`);
  await c.close();
}

await browser.close();
console.log(bad === 0 ? "\nmotion is contained and reduced motion is honoured" : `\n${bad} motion problem(s).`);
process.exit(bad === 0 ? 0 : 1);
