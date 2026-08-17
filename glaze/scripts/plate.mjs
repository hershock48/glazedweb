#!/usr/bin/env node
/**
 * Pick the signature plate for a client footer, and print the three CSS values to paste.
 *
 *   node scripts/plate.mjs "#191919"
 *   node scripts/plate.mjs "#FFF6EA" --line "Baked by"
 *   node scripts/plate.mjs "#3B2F28" "#FFF6EA" "#141414"     (several at once)
 *
 * WHY THIS IS A SCRIPT AND NOT A PARAGRAPH. The plate's ground is decided by contrast against
 * the footer above it, and getting it wrong produces a graphic that is not visible at all
 * rather than one that looks slightly off. Chocolate under copperac's #191919 measures 1.00 —
 * a drip with no tonal step is a flat band pretending to be a drip. Eyeballing a hex against
 * another hex is exactly the thing this studio has decided not to do, so the decision is a
 * command instead of a judgement.
 *
 * No dependencies, no network. WCAG 2.1 relative luminance.
 */

const TOKENS = {
  raspberry: "#E84D8A",
  "raspberry-deep": "#CE3672",
  slime: "#BFE07A",
  "slime-bright": "#A9D65C",
  fern: "#55974A",
  chocolate: "#2B1E16",
  "chocolate-2": "#201712",
  cream: "#FDF6EC",
  "cream-2": "#FFFDF8",
  taupe: "#8A7663",
};

const PLATE_DARK = TOKENS["chocolate-2"]; // #201712 — the plate for a LIGHT footer
const PLATE_LIGHT = TOKENS.cream; // #FDF6EC — the plate for a DARK footer
const INK_ON_DARK = TOKENS.cream;
const INK_ON_LIGHT = TOKENS.chocolate;

/**
 * A drip needs a real tonal step or it reads as a solid band.
 *
 * Worth knowing: with the current tokens this can never fire, and that is a property of the
 * system rather than luck. Sweeping every possible footer luminance and taking the better of
 * the two grounds, the worst case is 4.05 — at luminance 0.1916, where a footer is equidistant
 * from cream (0.9285) and chocolate-2 (0.0096). So **there is no colour a client footer can be
 * for which neither Glazed ground separates from it.** Two grounds is provably enough, which is
 * why the plate needs no third option and no per-site judgement.
 *
 * The check stays as a guard against someone changing the tokens. If cream and chocolate-2 ever
 * move closer together, this is what tells you the plate has stopped working.
 */
const MIN_STEP = 3.0;
/** WCAG AA for normal-size text. The credit line is ~12px, so this is the bar that applies. */
const AA = 4.5;

function parse(hex) {
  const h = String(hex).trim().replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function luminance(hex) {
  const [r, g, b] = parse(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function decide(footer, line) {
  const vsDark = ratio(footer, PLATE_DARK);
  const vsLight = ratio(footer, PLATE_LIGHT);
  // Whichever ground the footer contrasts with more is the plate. There is no third option:
  // Glazed has exactly two grounds and the mark is drawn against both.
  const useLight = vsLight >= vsDark;
  const plate = useLight ? PLATE_LIGHT : PLATE_DARK;
  const ink = useLight ? INK_ON_LIGHT : INK_ON_DARK;
  const step = useLight ? vsLight : vsDark;
  const inkRatio = ratio(ink, plate);

  const notes = [];
  if (step < MIN_STEP) {
    notes.push(
      `REJECT: the best available step is ${step.toFixed(2)}, under ${MIN_STEP}. This footer is ` +
        `mid-tone and neither Glazed ground separates from it. Do not ship a drip nobody can ` +
        `see — either put the plate under a different band of the footer, or use a flat rule.`
    );
  }
  if (inkRatio < AA) {
    notes.push(
      `REJECT: ${ink} on ${plate} is ${inkRatio.toFixed(2)}, under AA ${AA} for 12px text.`
    );
  }
  if (ratio(footer, plate) > 1 && Math.abs(luminance(footer) - luminance(plate)) < 0.02) {
    notes.push("CAUTION: near-identical luminance despite the ratio. Look at a render.");
  }

  return { footer, plate, ink, step, inkRatio, vsDark, vsLight, notes, line };
}

function report(d) {
  const name = (hex) =>
    Object.entries(TOKENS).find(([, v]) => v.toLowerCase() === hex.toLowerCase())?.[0] ?? hex;

  console.log(`\nfooter above the plate   ${d.footer}`);
  console.log(`  vs chocolate-2 #201712  ${d.vsDark.toFixed(2)}`);
  console.log(`  vs cream       #FDF6EC  ${d.vsLight.toFixed(2)}`);
  console.log(
    `  -> ${name(d.plate).toUpperCase()} plate (${d.plate}), step ${d.step.toFixed(2)}, ` +
      `ink ${name(d.ink)} at ${d.inkRatio.toFixed(2)}`
  );
  if (d.notes.length) {
    console.log("");
    for (const n of d.notes) console.log(`  ** ${n}`);
  }
  console.log(`\n  Paste into this site's own CSS, next to its palette:\n`);
  console.log(`  .gw-plate {`);
  console.log(`    --gw-above: ${d.footer};`);
  console.log(`    --gw-plate: ${d.plate};`);
  console.log(`    --gw-plate-ink: ${d.ink};`);
  console.log(`  }`);
  console.log(`\n  Last child of <footer>, outside the max-width container so it is full bleed:\n`);
  console.log(`  <GlazedPlate line="${d.line}" />\n`);
}

const args = process.argv.slice(2);
const li = args.indexOf("--line");
const line = li !== -1 ? args[li + 1] : "Double Dipped by";
// Guard the li === -1 case. Without it, `li + 1` is 0 and the filter silently drops the FIRST
// colour argument — so `plate.mjs "#191919" "#FFF6EA"` reported only the second, and a single
// colour reported nothing and fell through to the usage text looking like a bad argument.
const skip = li === -1 ? -1 : li + 1;
const colours = args.filter((a, i) => !a.startsWith("--") && i !== skip);

if (!colours.length) {
  console.log(`
Usage: node scripts/plate.mjs <footer-hex> [more hexes...] [--line "Baked by"]

Reads the footer colour that will sit directly above the plate and prints which Glazed
ground to use, with the ratios behind the choice. Glazed's tokens:

${Object.entries(TOKENS).map(([k, v]) => `  ${k.padEnd(15)} ${v}`).join("\n")}

--gw-above must match the footer above EXACTLY or a seam shows along the top edge.
`);
  process.exit(1);
}

let bad = 0;
for (const c of colours) {
  const d = decide(c, line);
  report(d);
  if (d.notes.some((n) => n.startsWith("REJECT"))) bad++;
}
process.exit(bad ? 1 : 0);
