/**
 * The two widths the standing auditor does not visit.
 *
 * `glaze/scripts/audit.mjs` runs 390 and 1440. `glaze.md` and `glaze/launch.md`
 * both require 320, 390, 768 and 1440, and say plainly that 320 is the one that
 * breaks. It was: at 320 the Pastrami Joe's header wordmark was hidden with
 * `display: none`, which removes it from the accessibility tree as well as the
 * screen, and since both images inside the mark were decorative the home link
 * was left with no accessible name on all twelve routes. Nothing at 390 or 1440
 * could see it. The devine build's mobile nav clipped its last item at 390 the
 * same invisible way, inside the nav's own box.
 *
 *   node glaze/scripts/width-check.mjs --base http://127.0.0.1:4490 --routes /,/menu
 *   node glaze/scripts/width-check.mjs --widths 320,768        # the default
 *
 * SETTLING MATTERS HERE MORE THAN IN THE HOUSE AUDITOR. A staggered reveal can
 * finish three quarters of a second after networkidle, and auditing mid-fade
 * reports the composited in-between colour as a contrast failure: 27 nodes of
 * it on one build, every one a blend that does not exist on the settled page.
 * This waits for every finite animation and transition to finish before it
 * measures. Shorten that wait and you will get a page of failures that describe
 * the harness rather than the site.
 *
 * Generalised from pjs/tools/width-check.mjs: routes and widths come from
 * arguments, axe resolves like the house auditor, and the reveal-forcing step
 * covers the class names used across the account (.reveal → in / is-visible /
 * is-in).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadChromium, launchOpts, arg } from "./lib/browser.mjs";

const chromium = await loadChromium();
const BASE = arg("base", "http://127.0.0.1:4490");
const ROUTES = arg("routes", "/").split(",").map((r) => r.trim()).filter(Boolean);
const WIDTHS = arg("widths", "320,768").split(",").map((w) => parseInt(w.trim(), 10)).filter(Boolean);

// --cookie name=value lets the harness through a gate; see the matching
// note in audit.mjs (the PIN-gated workroom screens audit as the gate
// otherwise, at every route, and read as clean).
const cookieRaw = arg("cookie", "");
const COOKIE = cookieRaw.includes("=")
  ? { name: cookieRaw.slice(0, cookieRaw.indexOf("=")), value: cookieRaw.slice(cookieRaw.indexOf("=") + 1), url: BASE }
  : null;

const here = path.dirname(fileURLToPath(import.meta.url));
const axePath = [
  path.join(process.cwd(), "node_modules/axe-core/axe.min.js"),
  path.join(here, "node_modules/axe-core/axe.min.js"),
  path.join(here, "../node_modules/axe-core/axe.min.js"),
  path.join(here, "../../node_modules/axe-core/axe.min.js"),
].find((p) => fs.existsSync(p));
if (!axePath) {
  console.error("axe-core not found. Install it in the working directory:\n  npm install axe-core playwright-core --no-save");
  process.exit(1);
}

const browser = await chromium.launch(launchOpts());
let violations = 0;
let overflow = 0;
let consoleErrors = 0;

for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  if (COOKIE) await context.addCookies([COOKIE]);
  const page = await context.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") {
      consoleErrors += 1;
      console.log(`  console error at ${width}: ${m.text().slice(0, 120)}`);
    }
  });

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });

    // Reveal-on-scroll content does not exist for axe until it has been
    // revealed, so scroll the whole page first, then force the rest.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(250);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.querySelectorAll(".reveal, [data-reveal]").forEach((el) => el.classList.add("in", "is-visible", "is-in"));
    });

    // Then wait for the page to actually stop moving. getAnimations() covers
    // both the CSS transitions on the reveal and any keyframe entrance.
    await page.evaluate(async () => {
      // Infinite animations never resolve `finished`; awaiting one hangs the
      // harness forever, which is what it did on the first run of the original
      // file (a breathing status dot). Only wait for animations that end.
      const ending = document
        .getAnimations()
        .filter((a) => {
          const it = a.effect?.getTiming?.().iterations;
          return it !== Infinity;
        })
        .map((a) => a.finished.catch(() => {}));
      await Promise.all(ending);
    });
    // Outlive the longest reveal transition (commonly 700ms) so axe never
    // samples a half-faded element; see the matching note in audit.mjs.
    await page.waitForTimeout(1100);

    await page.addScriptTag({ path: axePath });
    const res = await page.evaluate(async () =>
      window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      })
    );
    for (const v of res.violations) {
      violations += v.nodes.length;
      console.log(`  FAIL ${width} ${route}  ${v.id} (${v.nodes.length})  ${v.nodes[0].target.join(" ")}`);
    }

    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > width + 1) {
      overflow += 1;
      console.log(`  FAIL ${width} ${route}  horizontal overflow, scrollWidth ${sw}`);
    }
  }
  await context.close();
}

await browser.close();
console.log(
  `\n=== ${BASE} — ${ROUTES.length} route(s) at ${WIDTHS.join(" and ")}px ===\n` +
    `axe violations total: ${violations}\n` +
    `horizontal overflow:  ${overflow === 0 ? "none" : `${overflow} route(s)`}\n` +
    `console errors:       ${consoleErrors === 0 ? "none" : consoleErrors}`
);
process.exit(violations + overflow + consoleErrors === 0 ? 0 : 1);
