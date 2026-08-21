/**
 * Shared browser resolution for the glaze/scripts harnesses.
 *
 * One copy, because the auditor and the tools/ forwarder diverging is exactly
 * the class of failure this kit exists to prevent. The rules encoded here each
 * have a story:
 *
 *  - A bare `import { chromium } from "playwright-core"` resolves relative to
 *    the importing FILE, not the project being audited. It failed twice in one
 *    session: once from a read-only cache directory, once from a global install
 *    that was CommonJS, so the named export did not exist either. loadChromium
 *    tries the audited project's node_modules, playwright-core by name,
 *    playwright by name, and accepts ESM named or CJS default exports.
 *
 *  - The sandbox pins Chromium at /opt/pw-browsers/chromium; a Mac does not.
 *    Per the appendix in glaze.md, launchOpts resolves from CHROMIUM_PATH with
 *    the sandbox pin as a fallback, and otherwise lets Playwright find its own
 *    install.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

export async function loadChromium() {
  const req = createRequire(pathToFileURL(path.join(process.cwd(), "package.json")));
  for (const name of ["playwright-core", "playwright"]) {
    for (const resolve of [() => req.resolve(name), () => name]) {
      try {
        const spec = resolve();
        const mod = await import(path.isAbsolute(spec) ? pathToFileURL(spec).href : spec);
        const chromium = mod.chromium ?? mod.default?.chromium;
        if (chromium) return chromium;
      } catch {}
    }
  }
  console.error(
    "Could not load a browser driver. From the project you are auditing, run:\n" +
      "  npm install axe-core playwright-core --no-save\n" +
      "Install them together: axe-core alone has pruned playwright-core before."
  );
  process.exit(1);
}

export function launchOpts() {
  const pinned = "/opt/pw-browsers/chromium";
  const executablePath = process.env.CHROMIUM_PATH ?? (fs.existsSync(pinned) ? pinned : undefined);
  return executablePath ? { executablePath } : {};
}

export function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
