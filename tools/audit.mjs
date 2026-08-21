/**
 * Forwarder. The standing auditor lives at glaze/scripts/audit.mjs and this
 * file only re-executes it, so a fix to the auditor can never miss a copy.
 *
 * Why: this repo carried two diverged copies of the auditor for a while. The
 * glaze/scripts one grew a hardened browser resolver that this one never got,
 * and every client repo invokes that one. "When a thing appears N times, check
 * all N" applies to tools too, and the cheapest N is one.
 *
 * All arguments pass through unchanged:
 *   node tools/audit.mjs --base http://127.0.0.1:4490 --routes /,/about
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const canonical = path.join(path.dirname(fileURLToPath(import.meta.url)), "../glaze/scripts/audit.mjs");
const child = spawn(process.execPath, [canonical, ...process.argv.slice(2)], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));
