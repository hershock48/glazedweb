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
 *   node glaze/scripts/research.mjs --dry           print what would be asked, call nothing
 *   node glaze/scripts/research.mjs --json
 *
 * HOW IT WORKS. One Claude Opus 5 call per business with web search and web
 * fetch, the scorecard and the "signals that predicted a fit" lifted from
 * glaze/prospecting.md at run time as the system prompt (one source of
 * truth; edit the card, the agent changes), and a fixed JSON block at the
 * end of the answer that gets written back onto the ledger row as
 * `research`, with B and D added to the auto score and a dated `research`
 * event. Server-side tool loops can pause after ten iterations; the loop
 * resumes them, up to six times.
 *
 * WHAT IT WILL NOT DO. Invent a number. Every figure comes with the URL it
 * was read from or is marked unverified, the same rule the proposal's "What
 * we found" section runs on. A Google Business Profile is never claimed as
 * seen, because Google serves automated visitors a CAPTCHA; Restaurantji and
 * Wanderlog mirror the rating and the count is quoted from the lower one.
 *
 * CREDENTIALS AND COST. The SDK's usual resolution: ANTHROPIC_API_KEY or an
 * `ant auth login` profile. With none it says so and stops. Each business
 * is one call with up to ten searches and six fetches; the usage line at
 * the end estimates dollars at the published Opus 5 rates so the daily five
 * has a visible price. Server-side fallbacks are on, so a policy decline
 * re-runs on another model inside the same call.
 */
import fs from "node:fs";
import path from "node:path";
import {
  REPO, parseArgs, localDate, resolveDataPath, insideGit, loadBook, lastOf, norm,
} from "./lib/ledger.mjs";

const { flags } = parseArgs(process.argv.slice(2));
const today = flags.today || localDate();
const LEDGER = resolveDataPath(flags);
const POOL = path.resolve(flags.pool || process.env.GLAZE_POOL || path.join(path.dirname(LEDGER), "pool.json"));
const MODEL = flags.model || "claude-opus-5";
const LIMIT = Number(flags.limit || 5);
const MAX_CONTINUATIONS = 6;
// Published first-party rates for Opus 5, per million tokens, from the API
// reference cached 2026-06. An estimate for the usage line, not a bill.
const RATE = { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 };

function fail(msg) {
  console.error(`research: ${msg}`);
  process.exit(1);
}

const book = loadBook(LEDGER);
if (!book) fail(`no ledger at ${LEDGER}`);
const pool = fs.existsSync(POOL) ? JSON.parse(fs.readFileSync(POOL, "utf8")) : { candidates: {} };

// ---------------------------------------------------------------- targets

const targets = Object.entries(book.rows)
  .filter(([slug, row]) => (flags.slug ? slug === flags.slug : row.stage === "scouted" && (flags.force || !row.research)))
  .slice(0, flags.slug ? 1 : LIMIT);
if (!targets.length) fail(flags.slug ? `no row "${flags.slug}"` : "nothing to research: every scouted row has research. --force to redo.");

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
    row.kind ? `Kind (OpenStreetMap): ${row.kind}${c?.cuisine ? `, ${c.cuisine}` : ""}.` : "",
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

// ---------------------------------------------------------------- the call

async function research(slug, row) {
  const user = facts(slug, row);
  if (flags.dry) {
    console.log(`## ${slug}\n\n${user}\n`);
    return null;
  }
  let Anthropic;
  try {
    ({ default: Anthropic } = await import("@anthropic-ai/sdk"));
  } catch {
    fail("needs the SDK:  npm install --save-dev @anthropic-ai/sdk");
  }
  const client = new Anthropic();
  const tools = [
    { type: "web_search_20260209", name: "web_search", max_uses: 10, user_location: { type: "approximate", region: "Michigan", country: "US", timezone: "America/Detroit" } },
    { type: "web_fetch_20260209", name: "web_fetch", max_uses: 6 },
  ];
  const messages = [{ role: "user", content: user }];
  const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, searches: 0 };
  let useFallbacks = !flags["no-fallback"];
  let res;
  for (let turn = 0; turn <= MAX_CONTINUATIONS; turn += 1) {
    try {
      const params = {
        model: MODEL,
        max_tokens: 16000,
        output_config: { effort: "high" },
        system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
        tools,
        messages,
      };
      res = useFallbacks
        ? await client.beta.messages.create({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" })
        : await client.messages.create(params);
    } catch (err) {
      if (err instanceof Anthropic.AuthenticationError || /authentication method/i.test(err?.message || "")) {
        fail("no working Anthropic credential. Set ANTHROPIC_API_KEY or run `ant auth login`. (--dry prints the prompts without calling.)");
      }
      if (useFallbacks && err instanceof Anthropic.BadRequestError && /fallback|beta/i.test(err.message)) {
        console.error(`research: the API rejected server-side fallbacks (${err.message.slice(0, 120)}); retrying this call without them.`);
        useFallbacks = false;
        turn -= 1;
        continue;
      }
      if (err instanceof Anthropic.RateLimitError) fail("rate limited; try again in a minute.");
      if (err instanceof Anthropic.APIError) fail(`API error ${err.status}: ${err.message}`);
      throw err;
    }
    usage.input += res.usage?.input_tokens || 0;
    usage.output += res.usage?.output_tokens || 0;
    usage.cacheRead += res.usage?.cache_read_input_tokens || 0;
    usage.cacheWrite += res.usage?.cache_creation_input_tokens || 0;
    usage.searches += res.usage?.server_tool_use?.web_search_requests || 0;
    if (res.stop_reason === "pause_turn") {
      // The server-side tool loop hit its iteration cap. Push the assistant
      // turn back and call again; the API resumes where it stopped.
      messages.push({ role: "assistant", content: res.content });
      continue;
    }
    break;
  }
  if (res.stop_reason === "refusal") {
    console.error(`research: declined for ${slug} (${res.stop_details?.category ?? "no category"}); nothing written.`);
    return { slug, declined: true, usage };
  }
  if (res.stop_reason === "pause_turn") {
    console.error(`research: ${slug} still paused after ${MAX_CONTINUATIONS} continuations; writing what came back.`);
  }
  const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const fence = text.match(/```json\s*([\s\S]*?)```/);
  let parsed = null;
  if (fence) {
    try { parsed = JSON.parse(fence[1]); } catch (e) { console.error(`research: ${slug}: JSON in the fence did not parse (${e.message}); keeping the prose only.`); }
  } else {
    console.error(`research: ${slug}: no JSON fence in the answer; keeping the prose only.`);
  }
  const prose = fence ? text.slice(0, text.indexOf(fence[0])).trim() : text.trim();
  return { slug, model: res.model, parsed, prose, usage, stop: res.stop_reason };
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

// ---------------------------------------------------------------- main

const results = [];
for (const [slug, row] of targets) {
  console.error(`research: ${slug} (${row.name})...`);
  const r = await research(slug, row);
  if (r) results.push(r);
  if (r && !r.declined) writeBack(row, r);
}

if (!flags.dry && results.some((r) => !r.declined)) {
  const gitRoot = insideGit(LEDGER);
  if (gitRoot && !flags["allow-git"]) fail(`refusing to write ${LEDGER} inside the git tree at ${gitRoot}`);
  book.updated = today;
  fs.writeFileSync(LEDGER, `${JSON.stringify(book, null, 2)}\n`);
}

if (flags.json) {
  console.log(JSON.stringify({ today, results }, null, 2));
} else if (!flags.dry) {
  for (const r of results) {
    const p = r.parsed || {};
    console.log(`## ${r.slug}${r.declined ? " (declined)" : ""}`);
    if (!r.declined) {
      console.log(`B ${p.B ?? "?"}  D ${p.D ?? "?"}  ${p.disqualified ? `DISQUALIFIED: ${p.disqualified}` : ""}`);
      if (p.hook) console.log(`Hook: ${p.hook}`);
      if (p.owner) console.log(`Owner: ${p.owner} (${p.owner_source || "?"})`);
      if (p.google) console.log(`Google: ${p.google.rating ?? "?"} on ${p.google.count ?? "?"} (${p.google.source || "?"})`);
      if (p.transition) console.log(`Transition: ${p.transition}`);
      for (const e of p.B_evidence || []) console.log(`  B: ${e}`);
      for (const e of p.D_evidence || []) console.log(`  D: ${e}`);
      for (const u of p.unverified || []) console.log(`  unverified: ${u}`);
    }
    console.log("");
  }
  const u = results.reduce((a, r) => ({ input: a.input + r.usage.input, output: a.output + r.usage.output, cacheRead: a.cacheRead + r.usage.cacheRead, cacheWrite: a.cacheWrite + r.usage.cacheWrite, searches: a.searches + r.usage.searches }), { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, searches: 0 });
  const dollars = (u.input * RATE.input + u.output * RATE.output + u.cacheRead * RATE.cacheRead + u.cacheWrite * RATE.cacheWrite) / 1e6 + u.searches * 0.01;
  console.log(`${results.length} researched. Tokens in ${u.input + u.cacheRead + u.cacheWrite}, out ${u.output}, searches ${u.searches}. About $${dollars.toFixed(2)} at published rates (estimate).`);
}
