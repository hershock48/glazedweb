#!/usr/bin/env node
/**
 * THE CLOSING AGENT. For every business with a letter out and no full
 * payment in, a brief: what still blocks the agreement, who owes which fact,
 * and a follow-up ready to send. Then the ledger commands to run once it went.
 *
 * Why it exists. Nine of the first ten pitched businesses answered, and on
 * 2026-09-13 none of the five "interested" ones had launched. Every one was
 * stuck the same way: a registry row with TODO comments (entity, contact
 * name, edit allowance), a needs list nobody had asked the owner for, and no
 * follow-up after the first reply. Closing is not more pitching. It is asking
 * for the four facts the agreement is waiting on, and asking again.
 *
 * Usage, from the glazedweb repo root:
 *
 *   node glaze/scripts/close.mjs                   briefs for every closing-stage row
 *   node glaze/scripts/close.mjs --slug anchor     one business
 *   node glaze/scripts/close.mjs --all             include rows nothing is flagging today
 *   node glaze/scripts/close.mjs --json            for an agent
 *   node glaze/scripts/close.mjs --out             also write contracts-private/closing/<date>.md
 *   node glaze/scripts/close.mjs --email           also email the brief to Kevin (RESEND_API_KEY)
 *
 * Without --all a row is briefed only when the digest would flag it (quiet,
 * silent, due) or when it has never been touched since the reply. Run it
 * every morning and it is a nag; run it with --all before a day of calls and
 * it is the call sheet.
 *
 * WHAT IT READS. The ledger (stage, events, next action) and the registry
 * (lib/customOrders.js: the TODO comments on the row, which are the facts
 * Kevin has to get, and the project needs list, which is the ask already
 * written in the client's own language, with a WHY on every line). It never
 * invents an ask. If a business has no registry row yet, the brief says so
 * and the follow-up asks only for a reply.
 *
 * THE DRAFT. The template is house voice by construction: one idea per
 * sentence, the asks as a numbered list lifted verbatim from the needs, the
 * build page as the one link, Kevin's name and number, nothing else. No
 * threes, no "not X but Y", no punchline closing (glaze/standards.md, "Write
 * like a person"). --json includes the session voice prompt and sourced
 * briefs for the signed-in assistant to draft from. No model API key or
 * separate API charge is used, per Kevin's 2026-09-14 rule.
 *
 * NOTHING HERE SENDS TO A CLIENT. --email sends the brief to Kevin's own
 * inbox through the studio's Resend domain. The follow-up itself is copied
 * and sent by a person, then logged:
 *
 *   node glaze/scripts/ledger.mjs log anchor touch "asked for name, entity, address"
 */
import fs from "node:fs";
import path from "node:path";
import {
  CLOSING, TERMINAL, parseArgs, localDate, daysBetween, resolveDataPath, loadBook,
  lastEvent, lastOf, loadRegistry, registryFacts, flagsFor,
} from "./lib/ledger.mjs";

const { flags } = parseArgs(process.argv.slice(2));
const today = flags.today || localDate();
let DATA;try{DATA=resolveDataPath(flags);}catch(error){fail(error.message);}
if(flags.claude)fail("Use --json for drafting in the signed-in session. The retired --claude API mode is disabled; no model API key is needed.");
const SITE = "https://www.glazedweb.com";
const KEVIN = { name: "Kevin", phone: "(269) 274-3203", email: "kevin@glazedweb.com" };
const MAX_ASKS = 4;

function fail(msg) {
  console.error(`close: ${msg}`);
  process.exit(1);
}

let book;try{book=loadBook(DATA);}catch(error){fail(error.message);}
if (!book) fail(`no ledger at ${DATA}; see glaze/ledger.md`);
const registry = await loadRegistry();

// ---------------------------------------------------------------- which rows

const rows = Object.entries(book.rows)
  .filter(([slug, row]) => CLOSING.has(row.stage) && !TERMINAL.has(row.stage) && (!flags.slug || slug === flags.slug))
  .map(([slug, row]) => brief(slug, row))
  .filter((b) => flags.all || flags.slug || b.reasons.length);

if (flags.slug && !rows.length) {
  const row = book.rows[flags.slug];
  fail(row ? `${flags.slug} is at "${row.stage}", which is not a closing stage (${[...CLOSING].join(", ")})` : `no row "${flags.slug}"`);
}

// ---------------------------------------------------------------- the brief

function brief(slug, row) {
  const reg = registryFacts(registry, slug, row);
  const last = lastEvent(row);
  const days = last ? daysBetween(last.date, today) : null;
  const reply = lastOf(row, "reply");
  const touch = lastOf(row, "touch");
  const untouchedSinceReply = !!reply && (!touch || touch.date < reply.date);
  const f = flagsFor(row, today);
  const reasons = [...f];
  if (untouchedSinceReply) reasons.push("no touch since their reply");

  // Our side: the registry TODOs. Their side: the needs not done, in the
  // order the row lists them, which is already priority order ("who" first).
  const ours = reg ? reg.todos : [];
  const theirs = reg ? reg.needsOpen : [];

  const money = reg
    ? { build: reg.build, monthly: reg.monthly, monthlyStatus:reg.monthlyStatus||'unknown', buildFeePaid: reg.buildFeePaid, accepted: reg.accepted, source: reg.source||"registry" }
    : row.price
      ? { build: row.price.build ?? null, monthly: row.price.monthly ?? null, buildFeePaid: false, accepted: null, source: "ledger" }
      : null;

  const firstName = firstNameOf(reg?.contactName || "") || firstNameOf(row.contact || "");
  const draft = templateDraft({ slug, row, reg, theirs, firstName, reply, days });

  return {
    slug,
    name: reg?.client || row.name,
    stage: row.stage,
    days,
    lastType: last?.type ?? null,
    reasons,
    money,
    contact: { name: reg?.contactName || "", email: reg?.email || "", ledger: row.contact || "" },
    ours,
    theirs,
    hasRegistryRow: !!reg&&reg.hasRegistry!==false,
    hasProjectPage: !!reg?.hasProject,
    next: row.next?.action ? row.next : null,
    draft,
    afterSending: row._studio ? ['Record the completed follow-up in this account’s dated dashboard history. Nothing is sent automatically.'] : [
      `node glaze/scripts/ledger.mjs log ${slug} touch "${draft.summary}"`,
      ...(ours.length ? [`node glaze/scripts/ledger.mjs log ${slug} decision "<which TODO got answered>"`] : []),
    ],
  };
}

// A contact string like "Brittany Bennett" or "Jake (last name not on file)"
// yields a first name; "owner (name not on file)" yields nothing, on purpose.
function firstNameOf(s) {
  const m = s.trim().match(/^([A-Z][a-z]+)\b/);
  if (!m) return "";
  if (/^(owner|the|name|contact|board|emily)$/i.test(m[1])) return "";
  return m[1];
}

// ---------------------------------------------------------------- the template

function templateDraft({ slug, row, reg, theirs, firstName, reply, days }) {
  const name = reg?.client || row.name;
  const buildPage = reg?.hasProject ? `${SITE}/build/${slug}` : "";
  const agreement = reg&&reg.hasRegistry!==false ? `${SITE}/agreement/${slug}` : "";
  const demo = row.host ? `${row.host.replace(/\/$/, "")}/demo` : "";
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  const lines = [];
  let summary;

  if (row.stage === "sent") {
    // Silent after the letter. Second touch, short, one out for them.
    summary = "second touch after the letter";
    lines.push(greeting, "");
    lines.push(`I sent over a proposal for the ${name} site${days !== null ? ` about ${days === 0 ? "a day" : `${days} days`} ago` : ""}.`);
    if (demo) lines.push(`The demo is at ${demo}. It is the same site the letter is about.`);
    lines.push("If the timing is wrong, a one-line no is fine and I will leave it there.");
  } else {
    summary = theirs.length ? `asked for ${theirs.slice(0, MAX_ASKS).map((n) => n.id).join(", ")}` : "checked in";
    lines.push(greeting, "");
    lines.push(reply ? `Thanks for getting back to me on the ${name} site.` : `Following up on the ${name} site.`);
    if (theirs.length) {
      lines.push("To get it moving I need a few things from you. A blank is fine, send what you have.", "");
      theirs.slice(0, MAX_ASKS).forEach((n, i) => lines.push(`${i + 1}. ${n.ask}`));
      if (theirs.length > MAX_ASKS) lines.push(`The rest of the list is on your page, ${theirs.length - MAX_ASKS} more.`);
      lines.push("");
    } else if (!reg||reg.hasRegistry===false) {
      lines.push("The next step is a short call so I can put the agreement together. Any afternoon this week works on my end.");
    }
    if (row.stage === "confirmed") lines.push("Once the build fee is in, the build starts the same week.");
    if (row.stage === "paid-part") lines.push("Thank you for the deposit. The list above is what the build is waiting on.");
    if (buildPage) lines.push(`Where things stand, what happens next, and your links are all on one page: ${buildPage}`);
    if (agreement && row.stage !== "paid-part") lines.push(`The agreement is there when you are ready: ${agreement}`);
  }
  lines.push("", KEVIN.name, KEVIN.phone);

  return {
    subject: row.stage === "sent" ? `${name} website` : `${name} site, next step`,
    body: lines.join("\n"),
    summary,
    source: "template",
  };
}

// ---------------------------------------------------------------- claude

const VOICE = `You write short follow-up emails for Kevin Hershock, who runs Glazed Web, a one-person website studio in Marshall, Michigan. Each email goes to a small business owner who has already received a proposal and, in most cases, replied that they are interested.

Write the way Kevin talks across a bar: one idea per sentence, subject then verb, the fact and nothing around it. American spelling. No em dashes; use a period or a comma. No greeting longer than "Hi <name>," and no sign-off beyond his name and number.

Do not do any of these, they are the tells of machine writing:
- Lists of three by habit. A list has however many items there really are.
- "Not X, but Y", "It is not about A, it is about B", or any contrast that corrects nobody.
- A short punchline sentence closing a paragraph.
- Fragments after a colon.
- Adjectives about the business, the site, or the work. No "great", "exciting", "beautiful", "amazing".
- Apologizing for asking, or explaining why the asks matter beyond one plain clause.
- Any claim, date, price, or feature not present in the brief you are given.

The asks must appear exactly as written in the brief, as a numbered list, in the brief's order, and no more than ${MAX_ASKS} of them. Keep the link or links from the brief and add none. Under 140 words. Output the email only: a first line "Subject: ..." then a blank line then the body. No commentary.`;

// ---------------------------------------------------------------- output

function render(b) {
  const out = [];
  const money = b.money
    ? `$${b.money.build ?? "?"} build + $${b.money.monthly ?? "?"}/mo` +
      (b.money.buildFeePaid ? ", build fee PAID" : "") +
      (b.money.accepted === true ? ", agreement accepted" : b.money.accepted === false ? ", agreement not accepted" : "") +
      (b.money.source === "ledger" ? " (ledger fallback, no registry row)" : "")
    : "no price on file";
  out.push(`## ${b.name}  (${b.slug}, ${b.stage}${b.days !== null ? `, ${b.lastType} ${b.days}d ago` : ""})`);
  out.push("");
  out.push(`Why today: ${b.reasons.length ? b.reasons.join("; ") : "nothing flagged today"}`);
  out.push(`Money: ${money}`);
  if (b.contact.name || b.contact.email || b.contact.ledger) {
    out.push(`Contact: ${[b.contact.name, b.contact.email, b.contact.ledger].filter(Boolean).join(" / ")}`);
  }
  if (b.next) out.push(`Next on the ledger: ${b.next.action}${b.next.due ? ` [${b.next.due}]` : ""}`);
  out.push("");
  if (!b.hasRegistryRow) {
    out.push("No registry row yet, so no needs list and no agreement page. The brief can only ask for a reply.");
  } else {
    out.push(`Kevin still has to get (${b.ours.length} TODO on the registry row):`);
    if (b.ours.length) b.ours.forEach((t) => out.push(`  - ${t}`));
    else out.push("  - nothing, the row is clean");
    out.push("");
    out.push(`They still owe (${b.theirs.length} of the needs list):`);
    if (b.theirs.length) b.theirs.forEach((n) => out.push(`  - ${n.ask}${n.why ? `  (${n.why})` : ""}`));
    else out.push("  - nothing");
  }
  out.push("");
  out.push(`Follow-up (${b.draft.source}):`);
  out.push("");
  out.push(`    Subject: ${b.draft.subject}`);
  out.push("");
  for (const l of b.draft.body.split("\n")) out.push(`    ${l}`);
  out.push("");
  out.push("After it goes:");
  for (const c of b.afterSending) out.push(`    ${c}`);
  out.push("");
  return out.join("\n");
}

const heading = `# Closing brief, ${today}\n\n${rows.length} ${rows.length === 1 ? "business" : "businesses"}${flags.all ? " (all closing stages)" : " needing a touch"}. Ledger: ${DATA}\n`;
const text = rows.length
  ? `${heading}\n${rows.map(render).join("\n---\n\n")}`
  : `${heading}\nNothing to close today. Run with --all for the whole call sheet.\n`;

if (flags.json) {
  console.log(JSON.stringify({ today, file: DATA, authority:book.authority||null, sessionVoice:VOICE, rows }, null, 2));
} else {
  console.log(text);
}

if (flags.out) {
  const dir = typeof flags.out === "string" ? path.resolve(flags.out) : path.join(path.dirname(DATA), "closing");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${today}.md`);
  fs.writeFileSync(file, `${text}\n`);
  console.error(`close: wrote ${file}`);
}

if (flags.email) {
  const key = process.env.RESEND_API_KEY;
  if (!key) fail("--email needs RESEND_API_KEY in the environment (a sending-only key for glazedweb.com).");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Glazed ledger <ledger@glazedweb.com>",
      to: [KEVIN.email],
      subject: `Closing brief ${today}: ${rows.length} to touch`,
      text,
    }),
  });
  if (!r.ok) fail(`--email: Resend answered ${r.status} ${await r.text()}`);
  console.error(`close: emailed ${KEVIN.email}`);
}
