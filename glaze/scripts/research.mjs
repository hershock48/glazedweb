#!/usr/bin/env node
/**
 * THE RESEARCH AGENT. For each scouted business, the two scorecard signals
 * the selector cannot read from a map or a domain: demand proof (B) and
 * transition (D). Plus the facts a letter needs: who runs it, how many
 * people say it is good, what changed lately, and the one line to open with.
 *
 * Usage, from the glazedweb repo root:
 *
 *   node glaze/scripts/research.mjs                 every scouted row not yet researched, up to --limit
 *   node glaze/scripts/research.mjs --slug schlenkers
 *   node glaze/scripts/research.mjs --limit 3
 *   node glaze/scripts/research.mjs --force         redo rows that already have research
 *   node glaze/scripts/research.mjs --draft         same as the default: print the briefs, call nothing
 *   node glaze/scripts/research.mjs --json
 *   node glaze/scripts/research.mjs --brief <slug>              the full brief for one row, rules and JSON shape included
 *   node glaze/scripts/research.mjs --write <slug> --from file.json   ingest a result produced elsewhere
 *
 * SESSION RUNTIME. Kevin, 2026-09-14: use the signed-in subscription,
 * without model API keys or separate API charges. Default and --draft modes
 * print a batch of research briefs. The session searches with its own tools,
 * writes sourced JSON privately, and --write persists the result into the
 * same authority store the dashboard uses. --brief prints one complete brief.
 * B and D add to scoreAuto; the result and its dated event remain reviewable.
 * A missing source is marked unverified, not made into a business fact.
 *
 * WHAT IT WILL NOT DO. Invent a number. Every figure comes with the URL it
 * was read from or is marked unverified, the same rule the proposal's "What
 * we found" section runs on. A Google Business Profile is never claimed as
 * seen, because Google serves automated visitors a CAPTCHA; Restaurantji and
 * Wanderlog mirror the rating and the count is quoted from the lower one.
 *
 */
import fs from "node:fs";
import path from "node:path";
import {
  REPO, parseArgs, localDate, resolveDataPath, insideGit, loadBook, lastOf, norm, assertLegacyWritable, saveSessionBook,
} from "./lib/ledger.mjs";

const { flags } = parseArgs(process.argv.slice(2));
const today = flags.today || localDate();
let LEDGER;try{LEDGER=resolveDataPath(flags);}catch(error){fail(error.message);}
const POOL = path.resolve(flags.pool || process.env.GLAZE_POOL || path.join(path.dirname(LEDGER), "pool.json"));
const LIMIT = Number(flags.limit || 5);

function fail(msg) {
  console.error(`research: ${msg}`);
  process.exit(1);
}

let book;try{book=loadBook(LEDGER);}catch(error){fail(error.message);}
const before=structuredClone(book);
if (!book) fail(`no ledger at ${LEDGER}`);
const pool = fs.existsSync(POOL) ? JSON.parse(fs.readFileSync(POOL, "utf8")) : { candidates: {} };

// ---------------------------------------------------------------- targets

const one = flags.brief || flags.write || flags.slug;
const targets = Object.entries(book.rows)
  .filter(([slug, row]) => (one ? slug === one : row.stage === "scouted" && (flags.force || !row.research)))
  .slice(0, one ? 1 : LIMIT);
if (!targets.length) fail(one ? `no row "${one}"` : "nothing to research: every scouted row has research. --force to redo.");

// ---------------------------------------------------------------- the card, from the file

function scorecardText() {
  const file = path.join(REPO, "glaze", "prospecting.md");
  const md = fs.readFileSync(file, "utf8");
  const start = md.indexOf("## The scorecard");
  const end = md.indexOf("## Timing and routing");
  if (start === -1 || end === -1) fail("glaze/prospecting.md no longer has the scorecard and where-to-look sections this agent reads");
  return md.slice(start, end).trim();
}

const SYSTEM = `You research small food and drink businesses in Michigan for Glazed Web, a one-person website studio in Marshall that builds sites with online ordering for places that take orders. Your job is two numbers from the studio's scorecard and the facts a first letter needs, all of it sourced.

Rules that are not optional:
- Every figure, name and date carries the URL it was read from. Anything you could not verify is listed under unverified, not guessed and not dropped.
- Google serves automated visitors a CAPTCHA. Never claim to have seen a Google Business Profile. Read the Google rating and review count from Restaurantji or Wanderlog and quote the lower count.
- Yelp and MLive block fetches; use the search snippet and say so.
- A chain or franchise, an announced closure, a polished site with its own ordering, or a Toast or Clover contract signed in the last year is a disqualifier. Say which and stop scoring.
- Do not write marketing. Facts, short, the way an investigator files them.

The studio's scorecard, signals and sources, verbatim from its own file:

${scorecardText()}

End your answer with one JSON object in a \`\`\`json fence, this shape and nothing else in the fence:
{
  "B": 0-3 or null, "B_evidence": ["one line each, with URL"],
  "D": 0-2 or null, "D_evidence": ["one line each, with URL"],
  "owner": "name(s) and role, or unknown", "owner_source": "URL or unknown",
  "google": {"rating": number or null, "count": number or null, "source": "URL or unverified"},
  "tripadvisor": {"rank": "x of y in Town or unknown", "claimed": true/false/null, "source": "URL or unverified"},
  "press": ["outlet, what, URL"],
  "transition": "one line on any sale, new owner, death, retirement, listing, with date, or none found",
  "cash_only": true/false/null,
  "ordering": "what they use today: none, phone, Facebook, DoorDash, Toast, etc., with URL",
  "hours_source": "where hours live today (Facebook only, Google only, a site), URL",
  "disqualified": "reason or null",
  "hook": "one plain sentence a letter could open with, built on a verified fact",
  "unverified": ["what you could not confirm"]
}`;

function facts(slug, row) {
  const c = row.poolId ? pool.candidates?.[row.poolId] : null;
  const scout = lastOf(row, "scout");
  return [
    `Business: ${row.name}${row.town ? `, ${row.town}, Michigan` : ", Michigan"}.`,
    (row.businessKind||row.kind) ? `Kind (OpenStreetMap): ${row.businessKind||row.kind}${c?.cuisine ? `, ${c.cuisine}` : ""}.` : "",
    c?.address ? `Address: ${c.address}.` : "",
    c?.phone || row.contact ? `Contact on file: ${c?.phone || row.contact}.` : "",
    c?.site ? `Site check: ${c.site.source === "guess" ? `no website listed; ${c.site.target} is ${c.site.state}` : `${c.site.target} is ${c.site.state}`}${c.site.title ? ` (title "${c.site.title.slice(0, 80)}")` : ""}.` : "",
    row.scoreAuto !== undefined
      ? `Auto score so far: ${row.scoreAuto} (A, C, E, F, G only; B and D are yours to find).`
      : row.score !== undefined
        ? `Score on file: ${row.score} of 14 from a hand scan that already guessed B and D. Re-derive both from sources anyway.`
        : "",
    scout?.note ? `Scout note: ${scout.note}` : "",
    "",
    "Find B (demand proof) and D (transition) per the card, the owner or operator, the Google rating and count via Restaurantji or Wanderlog, the Tripadvisor rank and claim status, any press, any sale or closure or handoff news with its date, whether it is cash only, what ordering exists today, and where the hours live. Then the hook. Search widely first (name plus town; name plus \"sold\"; name plus \"owner\"; name plus \"obituary\"; name plus \"for sale\"; Restaurantji name town; Tripadvisor name town), fetch the pages that carry the facts, and file the JSON.",
  ].filter(Boolean).join("\n");
}

// ---------------------------------------------------------------- write back

function writeBack(row, r) {
  const p = r.parsed || {};
  const B = Number.isInteger(p.B) ? p.B : null;
  const D = Number.isInteger(p.D) ? p.D : null;
  row.research = { date: today, model: r.model, ...p, prose: r.prose, stop: r.stop };
  // A selector row carries scoreAuto (A, C, E, F, G) and gets B and D added.
  // A hand-scanned row (the statewide five) already has a 14-point score that
  // guessed B and D; the research is recorded beside it, not added on top.
  if (typeof row.scoreAuto === "number" && (B !== null || D !== null)) {
    row.score = row.scoreAuto + (B ?? 0) + (D ?? 0);
  }
  const note = p.disqualified
    ? `DISQUALIFIED: ${p.disqualified}`
    : `B ${B ?? "?"}, D ${D ?? "?"}, score ${row.score}. ${p.hook || "no hook"}${p.owner && p.owner !== "unknown" ? ` Owner: ${p.owner}.` : ""}`;
  row.events.push({ date: today, type: "research", note });
  if (p.disqualified) {
    row.stage = "passed";
    row.next = { action: `Disqualified by research: ${p.disqualified}`, due: "" };
  } else if (row.next?.action?.startsWith("Research B and D")) {
    row.next = { action: `Write the letter. Hook: ${p.hook || "see research"}`, due: "" };
  }
}

// ---------------------------------------------------------------- brief / write (the Claude Code path)

if (flags.brief) {
  const [slug, row] = targets[0];
  console.log(`# Research brief: ${slug}\n\n${SYSTEM}\n\n---\n\n${facts(slug, row)}\n`);
  process.exit(0);
}

if (flags.write) {
  try {
  const [slug, row] = targets[0];
  const from = flags.from || fail("--write needs --from <file.json>");
  if (!fs.existsSync(from)) fail(`no file ${from}`);
  const raw = fs.readFileSync(from, "utf8");
  let parsed;
  try {
    const fence = raw.match(/```json\s*([\s\S]*?)```/);
    parsed = JSON.parse(fence ? fence[1] : raw);
  } catch (e) {
    fail(`${from} is not JSON (${e.message})`);
  }
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))fail('Research must be a JSON object.');
  for(const [key,max] of [['B',3],['D',2]])if(parsed[key]!==null&&(!Number.isInteger(parsed[key])||parsed[key]<0||parsed[key]>max))fail(key+' is outside its scorecard range.');
  if (row.research && !flags.force) fail(`${slug} already has research from ${row.research.date}; --force to replace`);
  writeBack(row, { parsed, prose: "", model: flags.model || "claude-code", stop: "end_turn" });
  if(!await saveSessionBook(LEDGER,before,book,today)){
  assertLegacyWritable(LEDGER);
  const gitRoot = insideGit(LEDGER);
  if (gitRoot && !flags["allow-git"]) fail(`refusing to write ${LEDGER} inside the git tree at ${gitRoot}`);
  book.updated = today;
  fs.writeFileSync(LEDGER, `${JSON.stringify(book, null, 2)}\n`);
  }
  const p = parsed;
  console.log(`${slug}: B ${p.B ?? "?"} D ${p.D ?? "?"}${p.disqualified ? ` DISQUALIFIED (${p.disqualified}) -> passed` : ` -> score ${row.score}`}. ${p.hook || ""}`);
  process.exit(0);
  }catch(error){fail(error.message);}
}

// ---------------------------------------------------------------- main

// Research runs in the signed-in session, whose tools can read these briefs.
// Default/draft mode is a batch of briefs, never a surprise metered API call.
const briefs=targets.map(([slug,row])=>({slug,system:SYSTEM,facts:facts(slug,row),writeCommand:`node glaze/scripts/research.mjs --write ${slug} --from <private-result.json>`}));
if(flags.json)console.log(JSON.stringify({today,runtime:'signed-in-session',briefs},null,2));
else for(const brief of briefs)console.log(`# Research brief: ${brief.slug}\n\n${brief.system}\n\n${brief.facts}\n\nSave with: ${brief.writeCommand}\n`);
