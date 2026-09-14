#!/usr/bin/env node
/**
 * THE SELECTOR. Picks the day's five from the pool, all inside one drive, by
 * the prospecting.md scorecard, and learns from the ledger which kinds of
 * business and which towns have answered.
 *
 * Usage, from the glazedweb repo root:
 *
 *   node glaze/scripts/select.mjs                          best cluster, five names
 *   node glaze/scripts/select.mjs --n 5 --radius 10        cluster size and how tight
 *   node glaze/scripts/select.mjs --anchor "Jackson, Michigan"   force the town
 *   node glaze/scripts/select.mjs --kinds bakery,restaurant      only these kinds
 *   node glaze/scripts/select.mjs --min 5                  floor on the auto score (default 5)
 *   node glaze/scripts/select.mjs --commit                 add the picks to the ledger as scouted, channel visit
 *   node glaze/scripts/select.mjs --json
 *
 * WHY A CLUSTER. Kevin, 2026-09-13: the first ten pitches were texts to
 * people he knows. A cold letter to a stranger is a different thing, and the
 * best version of it is a letter followed by walking in. So the five are not
 * the five best names in Michigan; they are the five best names that fit one
 * trip. Every eligible candidate is tried as the center of a circle, the top
 * N inside the circle are summed, and the circle with the highest sum wins.
 * The route is nearest-neighbor from Marshall, miles printed, so the day is
 * planned before the letters are written.
 *
 * WHAT IT CAN SCORE WITHOUT A PERSON. Of the fourteen points on the card,
 * nine can be read from the pool: presence gap (A, from the site check),
 * order-shaped (C, from the kind of business and the takeaway tag), proximity
 * (E, miles from Marshall), rented stack (F, third-party ordering on the
 * page), referral path (G, a town where a client has already signed). Demand
 * proof (B) and transition (D) need reviews and news, which is research, and
 * the brief says so on every pick. A candidate whose page carries its own
 * ordering is out, per the card's stop rule.
 *
 * WHAT IT LEARNS. From ledger rows that carry a kind and have a send event,
 * the reply rate per kind and per town, per channel. Three sends of a kind
 * with half replying is a point up; three with none is a point down. Today
 * every send in the ledger is warm, so the table prints empty and nothing is
 * bumped. The rule is written now so the first cold and visit rows feed it
 * without anyone remembering to.
 *
 * --commit writes the picks into the ledger as scouted rows with channel
 * "visit", the auto score, the pool id, and a next action naming the trip.
 * Nothing is sent. The letter is the next agent's job.
 */
import fs from "node:fs";
import path from "node:path";
import { parseArgs, localDate, resolveDataPath, insideGit, loadBook, norm, pad } from "./lib/ledger.mjs";
import { HOME, miles } from "./lib/geo.mjs";

const { flags } = parseArgs(process.argv.slice(2));
const today = flags.today || localDate();
const LEDGER = resolveDataPath(flags);
const POOL = path.resolve(flags.pool || process.env.GLAZE_POOL || path.join(path.dirname(LEDGER), "pool.json"));
const N = Number(flags.n || 5);
const RADIUS = Number(flags.radius || 12);
const MIN = Number(flags.min ?? 5);
const KINDS = flags.kinds ? String(flags.kinds).split(",").map((s) => s.trim()) : null;

function fail(msg) {
  console.error(`select: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(POOL)) fail(`no pool at ${POOL}. Fill it first:  node glaze/scripts/scout.mjs --around "Jackson, Michigan" --check`);
const pool = JSON.parse(fs.readFileSync(POOL, "utf8"));
const book = loadBook(LEDGER) || { rows: {} };

// ---------------------------------------------------------------- learning

const CLIENT_STAGES = new Set(["confirmed", "paid-part", "paid", "live", "retained"]);
const clientTowns = new Set();
for (const row of Object.values(book.rows)) {
  if (CLIENT_STAGES.has(row.stage) && row.town) for (const t of row.town.split(/[+,]/)) clientTowns.add(norm(t));
}
clientTowns.add(norm(HOME.name.split(",")[0]));

function learn() {
  const byKind = {};
  const byTown = {};
  const bump = (table, key, sent, replied) => {
    if (!key) return;
    table[key] = table[key] || { sends: 0, replies: 0 };
    table[key].sends += sent;
    table[key].replies += replied;
  };
  for (const row of Object.values(book.rows)) {
    const sent = row.events.some((e) => e.type === "send") ? 1 : 0;
    if (!sent) continue;
    // A text to a friend teaches nothing about a letter to a stranger, and a
    // row with no channel recorded teaches nothing at all.
    if (row.channel !== "cold" && row.channel !== "visit") continue;
    const replied = row.events.some((e) => ["reply", "meet", "confirm", "pay-part", "pay"].includes(e.type)) ? 1 : 0;
    bump(byKind, row.kind ? `${row.channel || "?"}:${row.kind}` : "", sent, replied);
    bump(byTown, row.town ? `${row.channel || "?"}:${norm(row.town)}` : "", sent, replied);
  }
  const adjust = (table, key) => {
    const t = table[key];
    if (!t || t.sends < 3) return 0;
    const rate = t.replies / t.sends;
    if (rate >= 0.5) return 1;
    if (t.replies === 0) return -1;
    return 0;
  };
  return { byKind, byTown, adjust };
}
const learned = learn();

// ---------------------------------------------------------------- scoring

const ORDER_SHAPED = { fast_food: 2, bakery: 2, ice_cream: 2, deli: 2, butcher: 2, confectionery: 2, pastry: 2, chocolate: 2, farm: 2 };
const SIT_DOWN = { restaurant: 1, cafe: 1, coffee: 1, florist: 1, cheese: 1, greengrocer: 1 };

// Does the page that answered look like this business's own? Learned on the
// first Jackson run: stevesranch.com, guessed from the name, was really
// Steve's Ranch ("Steve's Ranch Restaurant - Family Dining in Jackson"),
// while rockytop.com was a Tennessee football site and veritas.com a data
// company. The title carrying the name is the tell.
function looksTheirs(name, title) {
  if (!title) return false;
  const n = norm(name);
  const t = norm(title);
  if (n.length >= 6 && t.includes(n)) return true;
  const first = name.split(/[\s'’&]+/).filter((w) => w.length >= 5 && !/^(the|restaurant|cafe|grill|pizza|bar|house|family|kitchen|jackson|marshall)$/i.test(w))[0];
  return !!first && t.includes(norm(first));
}
// yenkingrestaurant.com, tagged as the restaurant's site, answered with a
// "Slot Demo Mahjong" page: the domain lapsed and a spammer took it. That is
// the top of the presence gap, and a stronger opening than no site at all.
const HIJACKED = /(slot|casino|judi|poker|togel|gacor|viagra|cialis|payday loan|crypto exchange)/i;

function score(c) {
  const s = { A: null, B: null, C: null, D: null, E: null, F: 0, G: 0 };
  const why = [];
  let stop = "";

  // A. Presence gap, from the site check.
  if (c.site) {
    const st = c.site.state;
    const guessed = c.site.source === "guess";
    const theirs = looksTheirs(c.name, c.site.title);
    if (st === "none" || st === "dead" || st === "parked" || st === "empty") {
      s.A = 3;
      why.push(guessed ? `no site; ${c.site.target} is ${st}` : `their site ${c.site.target} is ${st}`);
    } else if (!guessed && st === "live" && !theirs && HIJACKED.test(c.site.title || "")) {
      s.A = 3;
      why.push(`their domain ${c.site.target} now serves "${(c.site.title || "").slice(0, 40)}": lapsed and taken over`);
    } else if (guessed && !theirs) {
      // A live page at the guessed domain is somebody's, not necessarily
      // theirs. No website tag anywhere is still the top of the gap.
      s.A = 3;
      why.push(`no site listed; ${c.site.target} answers with "${(c.site.title || "").slice(0, 40)}", not theirs`);
    } else if (guessed && theirs && c.site.ownOrdering) {
      s.A = 0;
      stop = `own ordering on ${c.site.target}, found by guessing the domain`;
    } else if (guessed && theirs) {
      s.A = 1;
      why.push(`site found by guessing the domain, no ordering of their own (${c.site.url}); OSM did not know it`);
    } else if (st === "free-host") {
      s.A = 2;
      why.push(`site is a free host or a Facebook page (${c.site.url})`);
    } else if (c.site.ownOrdering) {
      s.A = 0;
      stop = "own ordering on their site";
    } else {
      s.A = 1;
      why.push(`working site, no ordering of their own (${c.site.url})`);
    }
    if (c.site.thirdParty && !c.site.ownOrdering) {
      s.F = 1;
      why.push("third-party ordering on the page (the rented-stack hook)");
    }
  }

  // C. Order-shaped, from the kind and the takeaway tag.
  s.C = ORDER_SHAPED[c.kind] ?? SIT_DOWN[c.kind] ?? 0;
  if (c.takeaway === "yes" || c.takeaway === "only") s.C = Math.max(s.C, c.takeaway === "only" ? 2 : 1);
  if (c.delivery === "yes") s.C = Math.max(s.C, 1);

  // E. Proximity, miles from Marshall.
  s.E = c.distanceHome <= 25 ? 2 : c.distanceHome <= 50 ? 1 : 0;

  // G. Referral path: a town where a client has signed.
  if (c.town && clientTowns.has(norm(c.town))) { s.G = 1; why.push(`${c.town} already has a signed client`); }

  // Kevin's or a research pass's numbers win over the auto ones.
  const manual = c.score?.manual || {};
  for (const k of Object.keys(s)) if (manual[k] !== undefined && manual[k] !== null) s[k] = manual[k];

  const known = Object.values(s).filter((v) => v !== null);
  let total = known.reduce((a, b) => a + b, 0);
  const maxPossible = total + (s.B === null ? 3 : 0) + (s.D === null ? 2 : 0);
  const bumps = [];
  for (const ch of ["cold", "visit"]) {
    const k = learned.adjust(learned.byKind, `${ch}:${c.kind}`);
    const t = learned.adjust(learned.byTown, `${ch}:${norm(c.town || "")}`);
    if (k) bumps.push(`${ch} ${c.kind} ${k > 0 ? "+" : ""}${k}`);
    if (t) bumps.push(`${ch} ${c.town} ${t > 0 ? "+" : ""}${t}`);
    total += k + t;
  }
  return { ...s, total, maxPossible, why, stop, bumps, needs: [s.B === null ? "B demand proof (reviews, press)" : "", s.D === null ? "D transition (sale, new owner, obituary)" : ""].filter(Boolean) };
}

// ---------------------------------------------------------------- eligible

// One row per name: OSM carries a second location or a duplicate node for
// some businesses (Los Tres Amigos twice on the first Jackson run). Keep the
// one nearest home so the trip is honest.
const byName = new Map();
for (const c of Object.values(pool.candidates)) {
  if (c.status !== "new" || (KINDS && !KINDS.includes(c.kind))) continue;
  const k = norm(c.name);
  if (!byName.has(k) || c.distanceHome < byName.get(k).distanceHome) byName.set(k, c);
}
const eligible = [...byName.values()]
  .map((c) => ({ ...c, s: score(c) }))
  .filter((c) => !c.s.stop && c.s.total >= MIN);

if (!eligible.length) fail(`no eligible candidates (status new, no own ordering, auto score >= ${MIN}). Scout more, lower --min, or check sites: node glaze/scripts/scout.mjs --check`);

// ---------------------------------------------------------------- clustering

const rank = (a, b) => b.s.total - a.s.total || b.s.maxPossible - a.s.maxPossible || a.distanceHome - b.distanceHome;

function clusterAround(center) {
  const members = eligible.filter((c) => miles(center, c) <= RADIUS).sort(rank);
  const picks = members.slice(0, N);
  return {
    center,
    members: members.length,
    picks,
    sum: picks.reduce((a, c) => a + c.s.total, 0),
    meanHome: picks.length ? picks.reduce((a, c) => a + c.distanceHome, 0) / picks.length : Infinity,
  };
}

let clusters;
if (flags.anchor) {
  const a = pool.anchors[norm(flags.anchor)];
  if (!a) fail(`anchor "${flags.anchor}" is not in the pool; scan it first with scout.mjs --around`);
  clusters = [clusterAround({ ...a, isAnchor: true })];
} else {
  clusters = eligible.map((c) => clusterAround(c));
}
clusters.sort((a, b) => b.sum - a.sum || b.picks.length - a.picks.length || a.meanHome - b.meanHome);
const best = clusters[0];
if (!best.picks.length) fail("the cluster is empty");

// The runner-up that shares no picks with the winner, so tomorrow has a plan.
const bestIds = new Set(best.picks.map((c) => c.id));
const runnerUp = clusters.find((cl) => cl !== best && cl.picks.length && !cl.picks.some((c) => bestIds.has(c.id)));

// ---------------------------------------------------------------- route

function route(picks) {
  const left = [...picks];
  const legs = [];
  let at = HOME;
  let total = 0;
  while (left.length) {
    left.sort((a, b) => miles(at, a) - miles(at, b));
    const nxt = left.shift();
    const d = miles(at, nxt);
    legs.push({ to: nxt, miles: d });
    total += d;
    at = nxt;
  }
  const back = miles(at, HOME);
  return { legs, total: total + back, back };
}
const trip = route(best.picks);

// ---------------------------------------------------------------- output

const centerName = best.center.isAnchor ? best.center.name : `${best.center.name}${best.center.town ? `, ${best.center.town}` : ""}`;
const townOf = (c) => c.town || pool.anchors[c.anchor]?.name?.split(",")[0] || "";

if (flags.json) {
  console.log(JSON.stringify({ today, pool: POOL, n: N, radius: RADIUS, min: MIN, cluster: { center: centerName, members: best.members, sum: best.sum }, route: trip, picks: best.picks, runnerUp: runnerUp ? { center: runnerUp.center.name, sum: runnerUp.sum, picks: runnerUp.picks.map((c) => c.name) } : null, learned: { byKind: learned.byKind, byTown: learned.byTown } }, null, 2));
} else {
  console.log(`# The day's ${best.picks.length}, ${today}`);
  console.log("");
  console.log(`Cluster: within ${RADIUS} mi of ${centerName}. ${best.members} eligible inside it, top ${best.picks.length} sum to ${best.sum}. ${eligible.length} eligible in the pool, auto score >= ${MIN}, no own ordering.`);
  console.log(`Route from Marshall: ${trip.legs.map((l) => `${l.to.name} (${l.miles.toFixed(1)} mi)`).join(" -> ")} -> home (${trip.back.toFixed(1)} mi). ${trip.total.toFixed(0)} miles round trip.`);
  console.log("");
  best.picks.forEach((c, i) => {
    const site = c.site ? `${c.site.source === "guess" ? "no site tag; guessed " : ""}${c.site.target || ""} ${c.site.state}` : "site unchecked";
    console.log(`## ${i + 1}. ${c.name}  (${c.kind}${c.cuisine ? `, ${c.cuisine}` : ""}; ${townOf(c)}; ${c.distanceHome} mi from Marshall)`);
    console.log(`   score ${c.s.total} of a possible ${c.s.maxPossible} without research  [A ${fmt(c.s.A)} B ${fmt(c.s.B)} C ${c.s.C} D ${fmt(c.s.D)} E ${c.s.E} F ${c.s.F} G ${c.s.G}]${c.s.bumps.length ? `  learned: ${c.s.bumps.join(", ")}` : ""}`);
    for (const w of c.s.why) console.log(`   - ${w}`);
    console.log(`   - ${site}${c.phone ? `; phone ${c.phone}` : "; no phone listed"}${c.address ? `; ${c.address}` : ""}${c.hours ? `; hours ${c.hours}` : ""}`);
    if (c.s.needs.length) console.log(`   research before the letter: ${c.s.needs.join("; ")}`);
    console.log("");
  });
  if (runnerUp) console.log(`Tomorrow's cluster, no overlap: within ${RADIUS} mi of ${runnerUp.center.name}${runnerUp.center.town ? `, ${runnerUp.center.town}` : ""}, sum ${runnerUp.sum}: ${runnerUp.picks.map((c) => c.name).join("; ")}.`);
  const learnedRows = [...Object.entries(learned.byKind), ...Object.entries(learned.byTown)];
  console.log(learnedRows.length
    ? `Learned from the ledger (cold and visit sends only): ${learnedRows.map(([k, v]) => `${k} ${v.replies}/${v.sends}`).join(", ")}.`
    : "Learned from the ledger: nothing yet. Every send so far is warm. The first cold and visit rows with a send event start the table.");
  console.log("");
  console.log(flags.commit ? "Committing to the ledger:" : "To put them in the ledger as scouted (channel visit):  node glaze/scripts/select.mjs --commit" + (flags.anchor ? ` --anchor "${flags.anchor}"` : ""));
}

function fmt(v) { return v === null ? "?" : String(v); }

// ---------------------------------------------------------------- commit

if (flags.commit) {
  const gitRoot = insideGit(LEDGER);
  if (gitRoot && !flags["allow-git"]) fail(`refusing to write ${LEDGER} inside the git tree at ${gitRoot}`);
  const realBook = loadBook(LEDGER);
  if (!realBook) fail(`no ledger at ${LEDGER}`);
  const taken = new Set(Object.keys(realBook.rows));
  for (const c of best.picks) {
    let slug = norm(c.name).slice(0, 24) || `pool${c.id.replace(/\W/g, "")}`;
    let i = 2;
    while (taken.has(slug)) slug = `${norm(c.name).slice(0, 22)}${i++}`;
    taken.add(slug);
    realBook.rows[slug] = {
      name: c.name,
      town: townOf(c),
      repo: "",
      host: "",
      contact: c.phone ? `phone ${c.phone}` : "",
      aliases: [],
      channel: "visit",
      kind: c.kind,
      poolId: c.id,
      lat: c.lat,
      lon: c.lon,
      score: c.s.total,
      stage: "scouted",
      next: { action: `Research B and D, then the letter; stop-in on the ${centerName.split(",")[0]} run`, due: "" },
      events: [{ date: today, type: "scout", note: `Selected by select.mjs in the ${centerName} cluster. Auto score ${c.s.total}/${c.s.maxPossible}: ${c.s.why.join("; ") || "no site check yet"}.` }],
    };
    pool.candidates[c.id].status = "picked";
    pool.candidates[c.id].picked = { date: today, slug };
    if (!flags.json) console.log(`  ${pad(slug, 24)} ${c.name}`);
  }
  realBook.updated = today;
  fs.writeFileSync(LEDGER, `${JSON.stringify(realBook, null, 2)}\n`);
  pool.updated = today;
  fs.writeFileSync(POOL, `${JSON.stringify(pool, null, 2)}\n`);
  if (!flags.json) console.log(`Wrote ${best.picks.length} rows to the ledger and marked them picked in the pool.`);
}
