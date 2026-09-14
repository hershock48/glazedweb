#!/usr/bin/env node
/**
 * THE LEDGER. One row per business, from scouted to retained, and the
 * morning digest that reads it.
 *
 * Why it exists. On 2026-09-13 every pitch memory in the account said "not
 * sent" while six proposals had gone out and five owners had replied
 * interested. Copper was a confirmed client, DeVine had paid half, True North
 * had been met twice. None of that was written anywhere a session could read.
 * The registry (lib/customOrders.js) knows the deal; the client files know the
 * durable facts; nothing knew the STATE. This file is the state, and the rule
 * that goes with it: when Kevin says a thing was sent, answered, met or paid,
 * it gets logged here in the same turn, with the date.
 *
 * Usage, from the glazedweb repo root:
 *
 *   node glaze/scripts/ledger.mjs                    the digest (default)
 *   node glaze/scripts/ledger.mjs digest --json      the same, for an agent
 *   node glaze/scripts/ledger.mjs show <slug>        one row, every event
 *   node glaze/scripts/ledger.mjs add <slug> --name "Mason Depot Diner" [--town ...]
 *        [--repo ...] [--host ...] [--contact ...] [--build N] [--monthly N]
 *        [--stage scouted] [--score N] [--note "..."]
 *   node glaze/scripts/ledger.mjs log <slug> <event> ["note"] [--date YYYY-MM-DD] [--stage <stage>]
 *   node glaze/scripts/ledger.mjs next <slug> "action" [--due YYYY-MM-DD]   ("" clears it)
 *   node glaze/scripts/ledger.mjs set <slug> key=value [key=value ...]
 *
 * Events and the stage each one moves a row to:
 *
 *   scout -> scouted     audit -> audited      build -> built
 *   send  -> sent        reply -> replied      meet  -> meeting
 *   confirm -> confirmed pay-part -> paid-part pay   -> paid
 *   launch -> live       retain -> retained
 *   pass  -> passed      park  -> dormant
 *   touch, note, decision: logged, stage unchanged. "touch" is a follow-up we
 *   sent; "decision" is a registry TODO that got answered.
 *
 * A stage never moves backwards by accident: a "meet" logged on a confirmed
 * client keeps the row confirmed. pass and park always apply. --stage forces.
 *
 * WHERE THE DATA LIVES, AND WHY NOT HERE. The glazedweb repo is public. A row
 * that says "paid half" or "sent, silent" about a named business is not.
 * The data file defaults to ../contracts-private/ledger.json next to the
 * paper agreements, which is a local folder and not a git repo. Override with
 * --file or GLAZE_LEDGER. The script refuses to write a ledger that sits
 * inside any git working tree unless --allow-git is passed, because the
 * first time this goes wrong it goes wrong in public.
 *
 * WHAT THE DIGEST READS FROM THE REGISTRY. Build fee, monthly, build fee
 * paid, agreement accepted, needs done N of M, and the count of TODO comments
 * on the row. Prices are NOT copied into the ledger for a business that has a
 * registry row; the ledger's own build/monthly fields are the fallback for a
 * prospect who has not reached the registry yet (a Dark Horse). Facts live in
 * one place (glaze.md).
 *
 * Dates are ISO, day math is UTC, and "days" in the digest means whole days
 * since the row's most recent event. A row seeded on the day it was written
 * up rather than the day the thing happened says so in the event note; the
 * age is then an underestimate, which is the safe direction.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// ---------------------------------------------------------------- arguments

const raw = process.argv.slice(2);
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
const command = positional[0] && !positional[0].includes("=") ? positional.shift() : "digest";

// ---------------------------------------------------------------- constants

const LADDER = [
  "scouted", "audited", "built", "sent", "replied", "meeting", "confirmed",
  "paid-part", "paid", "live", "retained", "dormant", "passed",
];
const EVENTS = {
  scout: "scouted", audit: "audited", build: "built", send: "sent",
  reply: "replied", meet: "meeting", confirm: "confirmed",
  "pay-part": "paid-part", pay: "paid", launch: "live", retain: "retained",
  pass: "passed", park: "dormant",
  touch: null, note: null, decision: null,
};
const TERMINAL = new Set(["dormant", "passed"]);
const ACTIVE_DEAL = new Set(["replied", "meeting", "confirmed"]);

// Days of quiet before the digest flags a row. Numbers, so they can be argued
// with; a flag with no number is a vibe.
const QUIET = { sent: 7, deal: 5, "paid-part": 14, scouted: 21 };

// ---------------------------------------------------------------- paths

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(here, "..", "..");
const DATA = path.resolve(
  flags.file || process.env.GLAZE_LEDGER || path.join(REPO, "..", "contracts-private", "ledger.json"),
);

function insideGit(p) {
  let dir = path.dirname(p);
  for (;;) {
    if (fs.existsSync(path.join(dir, ".git"))) return dir;
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

// ---------------------------------------------------------------- dates

// Local date, not toISOString(): that one is UTC, and at 9 PM in Marshall it
// already says tomorrow, which made True North's payment "due today" a day
// early on the first run.
const today = flags.today || localDate(new Date());
function localDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const ISO = /^\d{4}-\d{2}-\d{2}$/;
function assertDate(d, what) {
  if (!ISO.test(d) || Number.isNaN(Date.parse(d))) fail(`${what} must be YYYY-MM-DD, got "${d}"`);
  return d;
}
function daysBetween(a, b) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

// ---------------------------------------------------------------- io

function fail(msg) {
  console.error(`ledger: ${msg}`);
  process.exit(1);
}

function load() {
  if (!fs.existsSync(DATA)) {
    fail(`no ledger at ${DATA}\n  create it with:  node glaze/scripts/ledger.mjs add <slug> --name "..."\n  or point --file / GLAZE_LEDGER at the right one.`);
  }
  const book = JSON.parse(fs.readFileSync(DATA, "utf8"));
  if (!book.rows || typeof book.rows !== "object") fail(`${DATA} has no "rows" object`);
  return book;
}

function save(book) {
  const gitRoot = insideGit(DATA);
  if (gitRoot && !flags["allow-git"]) {
    fail(`refusing to write ${DATA}\n  it sits inside the git working tree at ${gitRoot}. Deal state about named businesses does not belong in a repo, and glazedweb is public.\n  Pass --allow-git if that tree is private and you mean it.`);
  }
  book.version = 1;
  book.updated = today;
  fs.mkdirSync(path.dirname(DATA), { recursive: true });
  fs.writeFileSync(DATA, `${JSON.stringify(book, null, 2)}\n`);
}

function getRow(book, slug) {
  const row = book.rows[slug];
  if (!row) fail(`no row "${slug}". Rows: ${Object.keys(book.rows).sort().join(", ")}`);
  return row;
}

function lastEvent(row) {
  return row.events.length ? row.events[row.events.length - 1] : null;
}

function lastOf(row, type) {
  for (let i = row.events.length - 1; i >= 0; i -= 1) if (row.events[i].type === type) return row.events[i];
  return null;
}

// ---------------------------------------------------------------- registry

async function loadRegistry() {
  const file = path.join(REPO, "lib", "customOrders.js");
  if (!fs.existsSync(file)) return null;
  // customOrders.js is ESM in a package with no "type" field. Node reparses it
  // and warns once; that warning is about the site's package.json, not this
  // script, so it is swallowed here and every other warning is still printed.
  process.removeAllListeners("warning");
  process.on("warning", (w) => {
    if (w.code !== "MODULE_TYPELESS_PACKAGE_JSON") console.error(w);
  });
  const mod = await import(pathToFileURL(file).href);
  const src = fs.readFileSync(file, "utf8");
  const todos = {};
  let cur = null;
  for (const line of src.split("\n")) {
    const open = line.match(/^  ([a-z0-9]+): \{$/);
    if (open) { cur = open[1]; todos[cur] = 0; continue; }
    if (/^  \},?$/.test(line)) { cur = null; continue; }
    if (cur && line.includes("TODO")) todos[cur] += 1;
  }
  return { orders: mod.CUSTOM_ORDERS, todos };
}

function registryFacts(registry, slug) {
  if (!registry) return null;
  const order = registry.orders[slug];
  if (!order) return null;
  const needs = order.project?.needs || [];
  return {
    build: order.buildFee ?? null,
    monthly: order.monthly ?? null,
    buildFeePaid: !!order.buildFeePaid,
    accepted: order.project ? !!order.project.accepted : null,
    needsDone: needs.filter((n) => n.done).length,
    needsTotal: needs.length,
    todos: registry.todos[slug] ?? 0,
    live: !!order.live,
  };
}

function clientFileSlugs() {
  const dir = path.join(REPO, "glaze", "clients");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md").map((f) => f.slice(0, -3));
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// ---------------------------------------------------------------- flags per row

function flagsFor(row) {
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

// ---------------------------------------------------------------- commands

async function digest(book) {
  const registry = await loadRegistry();
  const rows = Object.entries(book.rows).map(([slug, row]) => {
    const last = lastEvent(row);
    const reg = registryFacts(registry, slug);
    return {
      slug,
      ...row,
      registry: reg,
      lastType: last?.type ?? null,
      lastDate: last?.date ?? null,
      days: last ? daysBetween(last.date, today) : null,
      flags: flagsFor(row),
    };
  });
  rows.sort((a, b) => {
    const r = LADDER.indexOf(a.stage) - LADDER.indexOf(b.stage);
    return r !== 0 ? r : (b.days ?? 0) - (a.days ?? 0);
  });

  const known = new Set();
  for (const [slug, row] of Object.entries(book.rows)) {
    known.add(norm(slug));
    for (const a of row.aliases || []) known.add(norm(a));
  }
  const missing = [];
  for (const s of Object.keys(registry?.orders || {})) if (!known.has(norm(s))) missing.push(`${s} (registry)`);
  for (const s of clientFileSlugs()) if (!known.has(norm(s))) missing.push(`${s} (client file)`);

  if (flags.json) {
    console.log(JSON.stringify({ today, file: DATA, rows, missing }, null, 2));
    return;
  }

  console.log(`Ledger  ${today}  ${DATA}`);
  const attention = rows.filter((r) => r.flags.length && !TERMINAL.has(r.stage));
  console.log("");
  console.log(attention.length ? "NEEDS A TOUCH" : "NEEDS A TOUCH: nothing today");
  for (const r of attention) {
    console.log(`  ${pad(r.slug, 14)} ${pad(r.stage, 10)} ${r.flags.join(", ")}${r.next?.action ? `  ->  ${r.next.action}` : ""}`);
  }

  console.log("");
  console.log(`  ${pad("slug", 14)} ${pad("stage", 10)} ${pad("last", 14)} ${pad("registry", 22)} next`);
  let group = null;
  for (const r of rows) {
    if (r.stage !== group) {
      group = r.stage;
      console.log(`  -- ${group}`);
    }
    const last = r.lastType ? `${r.lastType} ${r.days}d` : "no events";
    const reg = r.registry
      ? [
          r.registry.build !== null ? `$${r.registry.build}${r.registry.buildFeePaid ? " paid" : ""}` : "",
          r.registry.needsTotal ? `needs ${r.registry.needsDone}/${r.registry.needsTotal}` : "",
          r.registry.todos ? `${r.registry.todos} TODO` : "",
        ].filter(Boolean).join(" ")
      : r.price?.build ? `$${r.price.build} (no row)` : "no row";
    const next = r.next?.action ? `${r.next.action}${r.next.due ? ` [${r.next.due}]` : ""}` : "";
    console.log(`  ${pad(r.slug, 14)} ${pad(r.stage, 10)} ${pad(last, 14)} ${pad(reg, 22)} ${trunc(next, 70)}`);
  }

  if (missing.length) {
    console.log("");
    console.log("NOT IN THE LEDGER (add a row or an alias):");
    for (const m of missing) console.log(`  ${m}`);
  }
  console.log("");
  console.log(`${rows.length} rows. Stages: ${LADDER.join(" > ")}.`);
}

function show(book) {
  const slug = positional[0] || fail("show needs a slug");
  const row = getRow(book, slug);
  console.log(`${slug}: ${row.name}${row.town ? `, ${row.town}` : ""}`);
  console.log(`  stage    ${row.stage}`);
  for (const k of ["repo", "host", "contact", "score"]) if (row[k] !== undefined && row[k] !== "") console.log(`  ${pad(k, 8)} ${row[k]}`);
  if (row.price?.build || row.price?.monthly) console.log(`  price    $${row.price.build ?? "?"} + $${row.price.monthly ?? "?"}/mo (ledger fallback)`);
  if (row.next?.action) console.log(`  next     ${row.next.action}${row.next.due ? ` [${row.next.due}]` : ""}`);
  const f = flagsFor(row);
  if (f.length) console.log(`  flags    ${f.join(", ")}`);
  console.log("  events");
  for (const e of row.events) console.log(`    ${e.date}  ${pad(e.type, 9)} ${e.note || ""}`);
}

function add(book) {
  const slug = positional[0] || fail("add needs a slug");
  if (!/^[a-z0-9-]+$/.test(slug)) fail(`slug "${slug}" must be lowercase letters, digits, hyphens`);
  if (book.rows[slug]) fail(`row "${slug}" exists; use log / set`);
  if (!flags.name) fail("add needs --name");
  const stage = flags.stage || "scouted";
  if (!LADDER.includes(stage)) fail(`unknown stage "${stage}"; one of ${LADDER.join(", ")}`);
  const date = flags.date ? assertDate(flags.date, "--date") : today;
  const row = {
    name: flags.name,
    town: flags.town || "",
    repo: flags.repo || "",
    host: flags.host || "",
    contact: flags.contact || "",
    aliases: [],
    stage,
    next: { action: "", due: "" },
    events: [{ date, type: "note", note: flags.note || "added to the ledger" }],
  };
  if (flags.score !== undefined) row.score = Number(flags.score);
  if (flags.build || flags.monthly) row.price = { build: num(flags.build), monthly: num(flags.monthly) };
  book.rows[slug] = row;
  save(book);
  console.log(`added ${slug} at ${stage}`);
}

function log(book) {
  const slug = positional[0] || fail("log needs a slug");
  const type = positional[1] || fail(`log needs an event: ${Object.keys(EVENTS).join(", ")}`);
  if (!(type in EVENTS)) fail(`unknown event "${type}"; one of ${Object.keys(EVENTS).join(", ")}`);
  const row = getRow(book, slug);
  const date = flags.date ? assertDate(flags.date, "--date") : today;
  const note = positional[2] || "";
  row.events.push({ date, type, note });
  row.events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  let moved = "";
  if (flags.stage) {
    if (!LADDER.includes(flags.stage)) fail(`unknown stage "${flags.stage}"`);
    row.stage = flags.stage;
    moved = ` -> ${row.stage} (forced)`;
  } else {
    const to = EVENTS[type];
    if (to && (TERMINAL.has(to) || LADDER.indexOf(to) > LADDER.indexOf(row.stage) || TERMINAL.has(row.stage))) {
      row.stage = to;
      moved = ` -> ${to}`;
    }
  }
  save(book);
  console.log(`${slug}: ${type} on ${date}${moved}${note ? `  "${note}"` : ""}`);
}

function next(book) {
  const slug = positional[0] || fail("next needs a slug");
  const row = getRow(book, slug);
  const action = positional[1] ?? "";
  row.next = { action, due: flags.due ? assertDate(flags.due, "--due") : "" };
  save(book);
  console.log(action ? `${slug}: next "${action}"${row.next.due ? ` by ${row.next.due}` : ""}` : `${slug}: next cleared`);
}

function set(book) {
  const slug = positional[0] || fail("set needs a slug");
  const row = getRow(book, slug);
  const pairs = positional.slice(1);
  if (!pairs.length) fail("set needs key=value pairs");
  for (const p of pairs) {
    const eq = p.indexOf("=");
    if (eq < 1) fail(`bad pair "${p}"`);
    const key = p.slice(0, eq);
    const val = p.slice(eq + 1);
    if (key === "stage") {
      if (!LADDER.includes(val)) fail(`unknown stage "${val}"`);
      row.stage = val;
    } else if (key === "aliases") {
      row.aliases = val.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (key === "build" || key === "monthly") {
      row.price = row.price || {};
      row.price[key] = num(val);
    } else if (key === "score") {
      row.score = Number(val);
    } else if (["name", "town", "repo", "host", "contact"].includes(key)) {
      row[key] = val;
    } else {
      fail(`unknown key "${key}". Settable: name town repo host contact stage aliases build monthly score`);
    }
  }
  save(book);
  console.log(`${slug}: set ${pairs.join(" ")}`);
}

// ---------------------------------------------------------------- helpers

function pad(s, n) {
  s = String(s ?? "");
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}
function trunc(s, n) {
  return s.length > n ? `${s.slice(0, n - 1)}~` : s;
}
function num(v) {
  if (v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[$,]/g, ""));
  if (Number.isNaN(n)) fail(`not a number: ${v}`);
  return n;
}

// ---------------------------------------------------------------- main

const commands = { digest, show, add, log, next, set };
if (!(command in commands)) fail(`unknown command "${command}". One of: ${Object.keys(commands).join(", ")}`);
if (command === "add" && !fs.existsSync(DATA)) {
  await commands.add({ rows: {} });
} else {
  await commands[command](load());
}
