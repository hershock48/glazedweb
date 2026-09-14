#!/usr/bin/env node
/**
 * THE SCOUT. Fills the prospect pool from OpenStreetMap around a town, then
 * checks each candidate's website the way the scorecard scores it.
 *
 * Usage, from the glazedweb repo root:
 *
 *   node glaze/scripts/scout.mjs --around "Jackson, Michigan" [--radius 12] [--check]
 *   node glaze/scripts/scout.mjs --check [--anchor "Jackson, Michigan"] [--limit 40]
 *   node glaze/scripts/scout.mjs list [--anchor ...] [--status new|picked|skip|ledger]
 *   node glaze/scripts/scout.mjs skip "<name>" "<reason>"
 *
 * --around geocodes the town (once; anchors are cached), asks Overpass for
 * every restaurant, cafe, bar, bakery, florist, butcher and the like within
 * the radius, and adds what it finds. Chains are dropped (OSM brand tag, or
 * the name list in lib/geo.mjs). Names already in the ledger are kept at
 * status "ledger" so they never come back as new. Names on the pool's skip
 * list (seeded from prospecting.md's "checked and set aside") stay skipped.
 *
 * --check probes each unchecked candidate: the website tag if there is one,
 * else the obvious domain for the name, which is the "one curl -I each"
 * signal from prospecting.md. The result (dead, parked, empty, free-host,
 * live, and whether the page carries its own ordering or a third party's)
 * is what the selector turns into the presence-gap and rented-stack points.
 * Four at a time, ten-second timeout each, polite.
 *
 * WHERE THE POOL LIVES. contracts-private/pool.json, next to the ledger. Same
 * privacy reasoning: which businesses the studio is sizing up, and what it
 * concluded, is not for a public repo. Same git guard.
 *
 * OpenStreetMap is a seed, not a census (lib/geo.mjs). A business the scout
 * never finds is added to the ledger by hand, the way the statewide scan
 * names were, and the selector treats ledger "scouted" rows as part of the
 * pool when they carry coordinates.
 */
import fs from "node:fs";
import path from "node:path";
import { parseArgs, localDate, resolveDataPath, insideGit, loadBook, norm } from "./lib/ledger.mjs";
import { HOME, miles, geocode, overpass, CHAIN_NAMES, probeSite, guessDomain } from "./lib/geo.mjs";

const { flags, positional } = parseArgs(process.argv.slice(2));
const command = positional[0] && !positional[0].startsWith("-") && ["list", "skip"].includes(positional[0]) ? positional.shift() : "scan";
const today = flags.today || localDate();
const LEDGER = resolveDataPath(flags);
const POOL = path.resolve(flags.pool || process.env.GLAZE_POOL || path.join(path.dirname(LEDGER), "pool.json"));

function fail(msg) {
  console.error(`scout: ${msg}`);
  process.exit(1);
}

// Names prospecting.md checked and set aside on 2026-09-13, so the scout does
// not resurface them: own ordering, closed, or not a transition.
const SET_ASIDE = [
  ["Yesterdog", "own site with ordering"], ["Coach's Pub", "Toast"], ["Sara's Pizza", "Heartland ordering"],
  ["Polish Village Cafe", "own site with ordering"], ["Byron Family Restaurant", "own site with ordering"],
  ["Mr. Don's", "own site with ordering"], ["Pizza Sam's", "own site with ordering"], ["Apple Knockers", "own site with ordering"],
  ["Fricano's", "own site with ordering"], ["Clara's on the River", "closed"], ["Harvey's on the Mall", "closed"],
  ["Fat Boy Burgers", "closed"], ["Kountry Kitchen", "closed"], ["Telly's Coney", "closed"], ["Campau Tower", "closed"],
  ["Crews Inn", "sold to a neighboring operator, not a transition"], ["Zimmerman's Meat Market", "status contradictory"],
];

function loadPool() {
  if (fs.existsSync(POOL)) return JSON.parse(fs.readFileSync(POOL, "utf8"));
  return {
    version: 1,
    updated: today,
    anchors: {},
    skip: Object.fromEntries(SET_ASIDE.map(([n, why]) => [norm(n), { name: n, why, since: "2026-09-13" }])),
    candidates: {},
  };
}
function savePool(pool) {
  const gitRoot = insideGit(POOL);
  if (gitRoot && !flags["allow-git"]) fail(`refusing to write ${POOL} inside the git tree at ${gitRoot}; the pool is private. Pass --allow-git if you mean it.`);
  pool.updated = today;
  fs.mkdirSync(path.dirname(POOL), { recursive: true });
  fs.writeFileSync(POOL, `${JSON.stringify(pool, null, 2)}\n`);
}

function ledgerNames() {
  const book = loadBook(LEDGER);
  const names = new Map();
  if (!book) return names;
  for (const [slug, row] of Object.entries(book.rows)) {
    names.set(norm(row.name), slug);
    for (const a of row.aliases || []) names.set(norm(a), slug);
  }
  return names;
}

// ---------------------------------------------------------------- scan

async function scan(pool) {
  const place = flags.around;
  if (!place) fail('scan needs --around "Town, Michigan" (or use list / skip / --check)');
  const radius = Number(flags.radius || 12);
  const key = norm(place);
  let anchor = pool.anchors[key];
  if (!anchor) {
    anchor = await geocode(place);
    anchor.scans = [];
    pool.anchors[key] = anchor;
    console.error(`scout: geocoded ${place} -> ${anchor.lat.toFixed(4)}, ${anchor.lon.toFixed(4)} (${anchor.label})`);
  }
  console.error(`scout: asking Overpass for everything within ${radius} mi of ${anchor.name}...`);
  const found = await overpass(anchor, radius);
  anchor.scans.push({ date: today, radius, found: found.length });

  const inLedger = ledgerNames();
  const tally = { added: 0, updated: 0, chain: 0, ledger: 0, skip: 0 };
  for (const c of found) {
    const n = norm(c.name);
    if (c.brand || CHAIN_NAMES.test(c.name)) { tally.chain += 1; continue; }
    const existing = pool.candidates[c.id];
    const rec = existing || {
      ...c,
      anchor: key,
      added: today,
      status: "new",
      site: null,
      score: null,
    };
    Object.assign(rec, c, { distanceHome: Math.round(miles(HOME, c) * 10) / 10 });
    if (inLedger.has(n)) { rec.status = "ledger"; rec.ledgerSlug = inLedger.get(n); tally.ledger += 1; }
    else if (pool.skip[n]) { rec.status = "skip"; rec.skipReason = pool.skip[n].why; tally.skip += 1; }
    else if (existing) tally.updated += 1;
    else tally.added += 1;
    pool.candidates[c.id] = rec;
  }
  savePool(pool);
  console.log(`scout: ${anchor.name}, ${radius} mi: ${found.length} named places. added ${tally.added}, updated ${tally.updated}, chains dropped ${tally.chain}, already in ledger ${tally.ledger}, set aside ${tally.skip}.`);
  if (flags.check) await check(pool, key);
}

// ---------------------------------------------------------------- check

async function check(pool, anchorKey = flags.anchor ? norm(flags.anchor) : null) {
  const todo = Object.values(pool.candidates).filter(
    (c) => c.status === "new" && !c.site && (!anchorKey || c.anchor === anchorKey),
  );
  const limit = Number(flags.limit || 60);
  const batch = todo.slice(0, limit);
  if (!batch.length) { console.log("scout: nothing unchecked."); return; }
  console.error(`scout: checking ${batch.length} of ${todo.length} unchecked sites, four at a time...`);
  let i = 0;
  const states = {};
  async function worker() {
    while (i < batch.length) {
      const c = batch[i++];
      const target = c.website || guessDomain(c.name);
      const source = c.website ? "tag" : "guess";
      let probe;
      if (!target) probe = { state: "none" };
      else probe = await probeSite(target);
      c.site = { source, target, ...probe, checked: today };
      // A guessed domain that is live and clearly somebody else's business is
      // not their site. The selector treats guess+live as "none", which is a
      // stronger presence gap than a tagged live site; the title is kept so a
      // person can see what answered.
      states[c.site.state] = (states[c.site.state] || 0) + 1;
      console.error(`  ${c.name}: ${source} ${target} -> ${c.site.state}${c.site.title ? ` "${c.site.title.slice(0, 60)}"` : ""}${c.site.ownOrdering ? " OWN-ORDERING" : ""}${c.site.thirdParty ? " third-party" : ""}`);
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  savePool(pool);
  console.log(`scout: checked ${batch.length}. ${Object.entries(states).map(([k, v]) => `${k} ${v}`).join(", ")}.${todo.length > batch.length ? ` ${todo.length - batch.length} left; run --check again.` : ""}`);
}

// ---------------------------------------------------------------- list / skip

function list(pool) {
  const anchorKey = flags.anchor ? norm(flags.anchor) : null;
  const status = flags.status || null;
  const rows = Object.values(pool.candidates)
    .filter((c) => (!anchorKey || c.anchor === anchorKey) && (!status || c.status === status))
    .sort((a, b) => a.distanceHome - b.distanceHome);
  for (const c of rows) {
    const site = c.site ? `${c.site.source === "guess" ? "guess " : ""}${c.site.state}` : "unchecked";
    console.log(`${c.status.padEnd(7)} ${String(c.distanceHome).padStart(5)} mi  ${c.name.padEnd(34).slice(0, 34)} ${c.kind.padEnd(12)} ${(c.town || "").padEnd(16)} ${site}`);
  }
  console.log(`${rows.length} candidates. Anchors: ${Object.values(pool.anchors).map((a) => `${a.name} (${a.scans?.length || 0} scans)`).join("; ") || "none"}.`);
}

function skip(pool) {
  const name = positional[0] || fail("skip needs a name");
  const why = positional[1] || "skipped";
  pool.skip[norm(name)] = { name, why, since: today };
  for (const c of Object.values(pool.candidates)) if (norm(c.name) === norm(name)) { c.status = "skip"; c.skipReason = why; }
  savePool(pool);
  console.log(`skipped ${name}: ${why}`);
}

// ---------------------------------------------------------------- main

const pool = loadPool();
if (command === "list") list(pool);
else if (command === "skip") skip(pool);
else if (flags.around) await scan(pool);
else if (flags.check) await check(pool);
else fail('nothing to do. --around "Town, Michigan" to scan, --check to probe sites, list, or skip.');
