/**
 * Does the clearance between two elements hold at every width?
 *
 * Exists because eyeballing two screenshots is not a test. A speech bubble on the
 * Chism egg band cleared the small egg by 1px at 390px wide and overlapped it by
 * 18px at 320px — because the bubble was a px-sized HTML element and the band it
 * sat over scaled with the viewport, so the gap closed as screens narrowed. Both
 * widths looked fine in isolation.
 *
 * Two traps this handles that a hand-rolled version usually misses:
 *
 *  - getBoundingClientRect returns the TRANSFORMED box. An element resting at
 *    scale(0.2) measures at a fifth of its real size, which once turned a collision
 *    into a reported "clearance of 41px". Use --settle to write a transform inline
 *    with the transition off before measuring.
 *  - A horizontal gap only matters if the two things also overlap vertically, so
 *    that is reported separately rather than folded into one number.
 *
 * Usage:
 *   node gap.mjs --url http://127.0.0.1:4490/ --a ".egg-c path" --b ".bok"
 *   node gap.mjs ... --settle ".bok:opacity:1;transform:scale(1)"
 *   node gap.mjs ... --widths 320,375,390,430,768,1280
 */
import { chromium } from "playwright-core";

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const URL_ = arg("url", "http://127.0.0.1:4490/");
const A = arg("a", null);
const B = arg("b", null);
const SETTLE = arg("settle", null); // "selector:css;css"
const WIDTHS = arg("widths", "320,360,375,390,414,430,540,768,1024,1280,1600")
  .split(",").map(Number);
if (!A || !B) {
  console.error('--a and --b are required, e.g. --a ".egg-c path" --b ".bok"');
  process.exit(1);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
let worst = Infinity;
let worstAt = null;

for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(URL_, { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
  const out = await page.evaluate(
    ({ a, b, settle }) => {
      if (settle) {
        const [sel, css] = [settle.slice(0, settle.indexOf(":")), settle.slice(settle.indexOf(":") + 1)];
        const el = document.querySelector(sel);
        if (el) {
          el.style.transition = "none";
          for (const decl of css.split(";").filter(Boolean)) {
            const [k, v] = decl.split(":");
            el.style.setProperty(k.trim(), v.trim());
          }
        }
      }
      const ea = document.querySelector(a);
      const eb = document.querySelector(b);
      if (!ea || !eb) return { missing: !ea ? a : b };
      const ra = ea.getBoundingClientRect();
      const rb = eb.getBoundingClientRect();
      const gapX = rb.left >= ra.right ? rb.left - ra.right : ra.left - rb.right;
      return {
        gapX: Math.round(gapX * 10) / 10,
        vOverlap: rb.top < ra.bottom && rb.bottom > ra.top,
        aW: Math.round(ra.width),
        bW: Math.round(rb.width),
      };
    },
    { a: A, b: B, settle: SETTLE }
  );
  if (out.missing) {
    console.log(`${String(w).padStart(5)}px  selector not found: ${out.missing}`);
    continue;
  }
  if (out.vOverlap && out.gapX < worst) { worst = out.gapX; worstAt = w; }
  const verdict = out.gapX < 0 && out.vOverlap ? "*** OVERLAP ***" : "ok";
  console.log(
    `${String(w).padStart(5)}px  a=${String(out.aW).padStart(4)}px  b=${String(out.bW).padStart(4)}px  ` +
      `gap ${String(out.gapX).padStart(7)}px  vertical overlap ${out.vOverlap ? "yes" : "no "}  ${verdict}`
  );
}
console.log(
  worstAt === null
    ? "\nThe two never share vertical space, so the horizontal gap is not load-bearing."
    : `\ntightest clearance where they share vertical space: ${worst}px (at ${worstAt}px wide)`
);
await browser.close();
process.exit(worst < 0 ? 1 : 0);
