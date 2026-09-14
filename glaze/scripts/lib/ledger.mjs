/**
 * Shared bones for the ledger tools (ledger.mjs, close.mjs).
 *
 * Everything here is pure: no argv, no process.exit, no printing. The two
 * CLIs own their own output. See glaze/ledger.md for what the ledger is.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const LADDER = [
  "scouted", "audited", "built", "sent", "replied", "meeting", "confirmed",
  "paid-part", "paid", "live", "retained", "dormant", "passed",
];
export const EVENTS = {
  scout: "scouted", audit: "audited", build: "built", send: "sent",
  reply: "replied", meet: "meeting", confirm: "confirmed",
  "pay-part": "paid-part", pay: "paid", launch: "live", retain: "retained",
  pass: "passed", park: "dormant",
  touch: null, note: null, decision: null,
};
export const TERMINAL = new Set(["dormant", "passed"]);
// How the first touch reached them. warm: an owner Kevin knows, usually a
// text. cold: a letter or email to a stranger. visit: a cold letter followed
// by walking in. Reply and close rates are read per channel, never pooled.
export const CHANNELS = ["warm", "cold", "visit"];
export const ACTIVE_DEAL = new Set(["replied", "meeting", "confirmed"]);
// The stages the closing brief covers: a letter is out and nobody has paid
// in full. paid-part is in because half a fee is a deal still being closed.
export const CLOSING = new Set(["sent", "replied", "meeting", "confirmed", "paid-part"]);

// Days of quiet before a row is flagged. Numbers, so they can be argued
// with; a flag with no number is a vibe.
export const QUIET = { sent: 7, deal: 5, "paid-part": 14, scouted: 21 };

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(here, "..", "..", "..");

// ---------------------------------------------------------------- argv

export function parseArgs(raw) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < raw.length; i += 1) {
    const a = raw[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > -1) {
        flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else if (i + 1 < raw.length && !raw[i + 1].startsWith("--")) {
        flags[a.slice(2)] = raw[i + 1];
        i += 1;
      } else {
        flags[a.slice(2)] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

// ---------------------------------------------------------------- dates

// Local date, not toISOString(): that one is UTC, and at 9 PM in Marshall it
// already says tomorrow, which made True North's payment "due today" a day
// early on the ledger's first run.
export function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export const ISO = /^\d{4}-\d{2}-\d{2}$/;
export function isDate(d) {
  return ISO.test(d) && !Number.isNaN(Date.parse(d));
}
export function daysBetween(a, b) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

// ---------------------------------------------------------------- data file

export function resolveDataPath(flags = {}) {
  return path.resolve(
    flags.file || process.env.GLAZE_LEDGER || path.join(REPO, "..", "contracts-private", "ledger.json"),
  );
}

export function insideGit(p) {
  let dir = path.dirname(p);
  for (;;) {
    if (fs.existsSync(path.join(dir, ".git"))) return dir;
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

export function loadBook(file) {
  if (!fs.existsSync(file)) return null;
  const book = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!book.rows || typeof book.rows !== "object") throw new Error(`${file} has no "rows" object`);
  return book;
}

export function lastEvent(row) {
  return row.events.length ? row.events[row.events.length - 1] : null;
}
export function lastOf(row, type) {
  for (let i = row.events.length - 1; i >= 0; i -= 1) if (row.events[i].type === type) return row.events[i];
  return null;
}

// ---------------------------------------------------------------- registry

/**
 * lib/customOrders.js, imported live, plus the TODO comments per row parsed
 * out of the source, because a comment is not in the runtime object and the
 * TODOs are exactly the facts the closing brief has to ask for.
 */
export async function loadRegistry() {
  const file = path.join(REPO, "lib", "customOrders.js");
  if (!fs.existsSync(file)) return null;
  // customOrders.js is ESM in a package with no "type" field. Node reparses
  // it and warns once; that warning is about the site's package.json, not
  // these scripts, so it is swallowed and every other warning still prints.
  process.removeAllListeners("warning");
  process.on("warning", (w) => {
    if (w.code !== "MODULE_TYPELESS_PACKAGE_JSON") console.error(w);
  });
  const mod = await import(pathToFileURL(file).href);
  return { orders: mod.CUSTOM_ORDERS, todos: parseTodos(fs.readFileSync(file, "utf8")) };
}

export function parseTodos(src) {
  const todos = {};
  let cur = null;
  let capture = null;
  for (const line of src.split("\n")) {
    const open = line.match(/^  ([a-z0-9]+): \{$/);
    if (open) { cur = open[1]; todos[cur] = []; capture = null; continue; }
    if (/^  \},?$/.test(line)) { cur = null; capture = null; continue; }
    if (!cur) continue;
    if (capture !== null) {
      capture.push(line);
      if (line.includes("*/")) { todos[cur].push(cleanTodo(capture.join(" "))); capture = null; }
      continue;
    }
    const at = line.indexOf("TODO");
    if (at === -1) continue;
    if (line.includes("*/", at) || !line.includes("/*")) {
      todos[cur].push(cleanTodo(line.slice(at)));
    } else {
      capture = [line.slice(at)];
    }
  }
  return todos;
}

function cleanTodo(s) {
  return s
    .replace(/\*\/.*$/, "")
    .replace(/^\s*\*\s?/gm, "")
    .replace(/\s*\*\s+/g, " ")
    .replace(/^TODO\s*(Kevin)?\s*:?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function registryFacts(registry, slug) {
  if (!registry) return null;
  const order = registry.orders[slug];
  if (!order) return null;
  const needs = order.project?.needs || [];
  const todos = registry.todos[slug] || [];
  return {
    client: order.client,
    contactName: order.contactName || "",
    email: order.email || "",
    build: order.buildFee ?? null,
    monthly: order.monthly ?? null,
    buildFeePaid: !!order.buildFeePaid,
    accepted: order.project ? !!order.project.accepted : null,
    needsDone: needs.filter((n) => n.done).length,
    needsTotal: needs.length,
    needsOpen: needs.filter((n) => !n.done).map((n) => ({ id: n.id, ask: n.ask, why: n.why })),
    todos,
    todoCount: todos.length,
    live: !!order.live,
    hasProject: !!order.project,
  };
}

export function clientFileSlugs() {
  const dir = path.join(REPO, "glaze", "clients");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md").map((f) => f.slice(0, -3));
}

export const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// ---------------------------------------------------------------- flags per row

export function flagsFor(row, today) {
  const out = [];
  const last = lastEvent(row);
  const age = last ? daysBetween(last.date, today) : null;
  if (row.next?.due) {
    const over = daysBetween(row.next.due, today);
    if (over > 0) out.push(`OVERDUE ${over}d`);
    else if (over === 0) out.push("DUE TODAY");
  }
  if (row.stage === "sent") {
    const sent = lastOf(row, "send");
    const silent = sent ? daysBetween(sent.date, today) : age;
    if (silent !== null && silent >= QUIET.sent) out.push(`silent ${silent}d`);
  } else if (ACTIVE_DEAL.has(row.stage) && age !== null && age >= QUIET.deal) {
    out.push(`quiet ${age}d`);
  } else if (row.stage === "paid-part" && age !== null && age >= QUIET["paid-part"]) {
    out.push(`quiet ${age}d`);
  } else if (row.stage === "scouted" && (row.score ?? 0) >= 7 && age !== null && age >= QUIET.scouted) {
    out.push(`unpitched ${age}d`);
  }
  return out;
}

// ---------------------------------------------------------------- text

export function pad(s, n) {
  s = String(s ?? "");
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}
export function trunc(s, n) {
  return s.length > n ? `${s.slice(0, n - 1)}~` : s;
}
