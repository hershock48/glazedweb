/**
 * Is this element's animation actually running?
 *
 * Exists because a CSS animation can look completely healthy while doing nothing.
 * The marquee on chismchickenranch.com had its keyframes purged from the build —
 * declared in tailwind.config.js, but Tailwind only emits a @keyframes block when
 * the matching utility appears in the markup, and nothing used the utility. The
 * result: animation-play-state reported "running", animation-duration reported the
 * full 34s, the class was on the element, the CSS was served, and the strip had
 * never moved once. There is simply nothing to interpolate between.
 *
 * The only thing that catches it is reading the computed transform twice and
 * comparing. That is all this does.
 *
 * Usage:
 *   node animating.mjs --url http://127.0.0.1:4490/ --selector ".marquee-track"
 *   node animating.mjs --url ... --selector ... --ms 3000 --touch --tap
 *
 * --touch emulates a touch device and --tap taps the element first, which is how
 * you catch the other half of this bug: on a touch screen :hover latches after a
 * tap and does not reliably release, so a hover-pause rule can freeze an animation
 * indefinitely. Guard those rules with @media (hover: hover) and (pointer: fine).
 */
import { chromium } from "playwright-core";

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const has = (n) => process.argv.includes(`--${n}`);

const URL_ = arg("url", "http://127.0.0.1:4490/");
const SEL = arg("selector", null);
const MS = Number(arg("ms", "2000"));
if (!SEL) {
  console.error("--selector is required, e.g. --selector \".marquee-track\"");
  process.exit(1);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 780 },
  hasTouch: has("touch"),
  isMobile: has("touch"),
  reducedMotion: has("reduced") ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: "networkidle" });
// A site with scroll-behavior: smooth animates scripted jumps, so a measurement
// taken straight after scrollIntoView can catch the page mid-flight.
await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), SEL);
await page.waitForTimeout(400);

if (has("tap")) {
  const box = await (await page.$(SEL)).boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(300);
}

const read = () =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const cs = getComputedStyle(el);
    const m = new DOMMatrixReadOnly(cs.transform);
    return {
      // The WHOLE matrix, not just translation. An early version read only m41/m42
      // and opacity, and reported the glazedweb donut as dead — its wobble is a
      // pure scaleY/scaleX, which lives in m11/m22 and leaves translation at zero.
      // Any animation that only scales, rotates or skews would have looked broken.
      m: [m.m11, m.m12, m.m21, m.m22, m.m41, m.m42].map((v) => Math.round(v * 1e4) / 1e4),
      opacity: cs.opacity,
      name: cs.animationName,
      duration: cs.animationDuration,
      playState: cs.animationPlayState,
    };
  }, SEL);

const a = await read();
if (!a) {
  console.error(`nothing matches ${SEL}`);
  process.exit(1);
}
await page.waitForTimeout(MS);
const b = await read();

// Largest change across any matrix component. Translation is in px so it moves in
// whole numbers; scale and rotation are unitless and move in hundredths, hence the
// deliberately small threshold below.
const delta = Math.max(...a.m.map((v, i) => Math.abs(b.m[i] - v)));
const faded = Math.abs(Number(b.opacity) - Number(a.opacity));
console.log(`selector        ${SEL}`);
console.log(`animation-name  ${b.name}`);
console.log(`duration        ${b.duration}`);
console.log(`play-state      ${b.playState}`);
console.log(`transform delta ${delta.toFixed(4)} in ${MS}ms  (matrix ${a.m.join(", ")} -> ${b.m.join(", ")})`);
console.log(`opacity change  ${faded.toFixed(4)}`);
const alive = delta > 0.001 || faded > 0.005;
console.log(`\n${alive ? "MOVING" : "*** NOT MOVING ***"}`);
if (!alive && b.playState === "running" && b.name !== "none") {
  console.log(
    `It claims to be running with a real duration but nothing measurable changes.\n` +
      `Check in this order:\n` +
      `  1. Is @keyframes ${b.name} actually in the SERVED css? Grep the built\n` +
      `     stylesheets, not the source. Tailwind purges a @keyframes block declared\n` +
      `     in tailwind.config.js unless its matching utility appears in the markup,\n` +
      `     which is what left the Chism marquee frozen for months.\n` +
      `  2. Does it animate something other than transform or opacity — a colour, a\n` +
      `     filter, an SVG attribute, a custom property? This script only watches\n` +
      `     those two, so it cannot see anything else and will say NOT MOVING.\n` +
      `  3. Was it sampled across a still point? A long ease can move very little in\n` +
      `     ${MS}ms. Try --ms 4000.`
  );
}
await browser.close();
process.exit(alive ? 0 : 1);
