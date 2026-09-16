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
 *        [--stage scouted] [--score N] [--channel warm|cold|visit] [--note "..."]
 *
 * CHANNEL MATTERS MORE THAN STAGE FOR LEARNING. The first ten pitches were
 * texts to owners Kevin already knew ("warm"), and five of six replied. A
 * cold email to a stranger is a different experiment with a different base
 * rate, and a visit after a letter is a third. Every row carries one so the
 * reply and close rates are never pooled across them.
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
 *
 * The shared pieces (paths, dates, registry reading, the flag rules) live in
 * lib/ledger.mjs so close.mjs reads the same book the same way.
 */
import fs from "node:fs";
import path from "node:path";
import {
  LADDER, EVENTS, TERMINAL, CHANNELS, parseArgs, localDate, isDate, daysBetween,
  resolveDataPath, insideGit, loadBook, lastEvent, loadRegistry, registryFacts, assertLegacyWritable,
  clientFileSlugs, norm, flagsFor, pad, trunc,
} from "./lib/ledger.mjs";

const { flags, positional } = parseArgs(process.argv.slice(2));
const command = positional[0] && !positional[0].includes("=") ? positional.shift() : "digest";
const today = flags.today || localDate();
const DATA = resolveDataPath(flags);

function fail(msg) {
  console.error(`ledger: ${msg}`);
  process.exit(1);
}
function assertDate(d, what) {
  if (!isDate(d)) fail(`${what} must be YYYY-MM-DD, got "${d}"`);
  return d;
}

function load() {
  const book = loadBook(DATA);
  if (!book) {
    fail(`no ledger at ${DATA}\n  create it with:  node glaze/scripts/ledger.mjs add <slug> --name "..."\n  or point --file / GLAZE_LEDGER at the right one.`);
  }
  return book;
}

function save(book) {
  assertLegacyWritable(DATA);
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

// ---------------------------------------------------------------- commands

async function digest(book) {
  const registry = await loadRegistry();
  const rows = Object.entries(book.rows).map(([slug, row]) => {
    const last = lastEvent(row);
    const reg = registryFacts(registry, slug, row);
    return {
      slug,
      ...row,
      registry: reg,
      lastType: last?.type ?? null,
      lastDate: last?.date ?? null,
      days: last ? daysBetween(last.date, today) : null,
      flags: flagsFor(row, today),
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
    console.log(JSON.stringify({ today, file: DATA, authority:book.authority||null, rows, missing }, null, 2));
    return;
  }

  console.log(`Ledger  ${today}  ${book.authority?`studio dashboard revision ${book.authority.revision} (read through archive pointer)`:DATA}`);
  const attention = rows.filter((r) => r.flags.length && !TERMINAL.has(r.stage));
  console.log("");
  console.log(attention.length ? "NEEDS A TOUCH" : "NEEDS A TOUCH: nothing today");
  for (const r of attention) {
    console.log(`  ${pad(r.slug, 14)} ${pad(r.stage, 10)} ${r.flags.join(", ")}${r.next?.action ? `  ->  ${r.next.action}` : ""}`);
  }

  console.log("");
  console.log(`  ${pad("slug", 14)} ${pad("stage", 10)} ${pad("chan", 6)} ${pad("last", 14)} ${pad("registry", 22)} next`);
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
          r.registry.todoCount ? `${r.registry.todoCount} TODO` : "",
        ].filter(Boolean).join(" ")
      : r.price?.build ? `$${r.price.build} (no row)` : "no row";
    const next = r.next?.action ? `${r.next.action}${r.next.due ? ` [${r.next.due}]` : ""}` : "";
    console.log(`  ${pad(r.slug, 14)} ${pad(r.stage, 10)} ${pad(r.channel || "-", 6)} ${pad(last, 14)} ${pad(reg, 22)} ${trunc(next, 64)}`);
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
  for (const k of ["channel", "repo", "host", "contact", "score"]) if (row[k] !== undefined && row[k] !== "") console.log(`  ${pad(k, 8)} ${row[k]}`);
  if (row.price?.build || row.price?.monthly) console.log(`  price    $${row.price.build ?? "?"} + $${row.price.monthly ?? "?"}/mo (ledger fallback)`);
  if (row.next?.action) console.log(`  next     ${row.next.action}${row.next.due ? ` [${row.next.due}]` : ""}`);
  const f = flagsFor(row, today);
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
    channel: flags.channel || "",
    stage,
    next: { action: "", due: "" },
    events: [{ date, type: "note", note: flags.note || "added to the ledger" }],
  };
  if (row.channel && !CHANNELS.includes(row.channel)) fail(`channel must be one of ${CHANNELS.join(", ")}`);
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
    } else if (key === "channel") {
      if (!CHANNELS.includes(val)) fail(`channel must be one of ${CHANNELS.join(", ")}`);
      row.channel = val;
    } else if (["name", "town", "repo", "host", "contact"].includes(key)) {
      row[key] = val;
    } else {
      fail(`unknown key "${key}". Settable: name town repo host contact stage channel aliases build monthly score`);
    }
  }
  save(book);
  console.log(`${slug}: set ${pairs.join(" ")}`);
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
