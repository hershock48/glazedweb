/**
 * Can the browser in this environment reach the public internet?
 *
 * Answer, as of the last time this was run: no. Not proxied, not unproxied, not for
 * any domain. Four cells — a target and example.com as a control, each with and
 * without the environment's proxy handed to Chromium explicitly — all fail with
 * ERR_CONNECTION_RESET.
 *
 * Run this before concluding anything about a specific site being blocked, because
 * the wrong diagnosis ("that domain is on a blocklist") sends you hunting for a
 * workaround that does not exist. And note the reason a naive test misleads:
 * headless Chromium does NOT read https_proxy from the environment, so a test that
 * omits --proxy-server is not a test of whether the browser can reach the internet.
 * It only tells you it cannot do so unproxied.
 *
 * The practical consequence: the browser is for pages you serve locally. For a live
 * client site, WebFetch gets the markup and that is the ceiling — so split findings
 * into what markup can prove and what needs a screenshot, and say which is which.
 *
 * Usage:  node egress.mjs [https://target.example/]
 */
import { chromium } from "playwright-core";

const PROXY = process.env.https_proxy || process.env.HTTPS_PROXY || null;
const target = process.argv[2] || "https://example.org/";
console.log("proxy from env:", PROXY ? PROXY.replace(/\/\/.*@/, "//<redacted>@") : "(none set)");

for (const useProxy of [true, false]) {
  if (useProxy && !PROXY) continue;
  for (const url of [target, "https://example.com/"]) {
    const label = `${useProxy ? "WITH proxy   " : "WITHOUT proxy"}  ${url}`;
    let browser;
    try {
      browser = await chromium.launch({
        executablePath: "/opt/pw-browsers/chromium",
        ...(useProxy ? { proxy: { server: PROXY } } : {}),
      });
      const page = await browser.newPage();
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
      console.log(`${label}  ->  HTTP ${res?.status()}  "${(await page.title()).slice(0, 45)}"`);
    } catch (e) {
      console.log(`${label}  ->  FAILED: ${e.message.split("\n")[0].slice(0, 70)}`);
    } finally {
      if (browser) await browser.close();
    }
  }
}
