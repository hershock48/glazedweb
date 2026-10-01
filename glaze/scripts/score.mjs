#!/usr/bin/env node
/**
 * THE SCORECARD. One line per review: who built it, who reviewed it, what
 * kind of work, how many findings, how many held up after the other side
 * answered. Over a month this is the studio's own evidence for which model
 * to trust with what, instead of a public leaderboard that never measured
 * a Marshall bar owner reading a letter.
 *
 * Usage, from the glazedweb repo root:
 *
 *   node glaze/scripts/score.mjs                          the table: per author, per kind
 *   node glaze/scripts/score.mjs --json
 *   node glaze/scripts/score.mjs add --author codex --reviewer claude --repo devine \
 *        --ref fix/launch-readiness --kind code --findings 7 --held 6 --note "H5 partial"
 *   node glaze/scripts/score.mjs add ... --date 2026-09-17     backdate an entry
 *
 * Fields: author and reviewer are one of claude, codex, kevin, local (a
 * local model). kind is code, copy, pitch or data. findings is what the
 * reviewer raised; held is how many stood after the author answered, so
 * findings minus held is the reviewer's false-alarm count. A review with
 * no findings is still a row: it says the author shipped clean.
 *
 * The data file is contracts-private/reviews/scorecard.jsonl, beside the
 * ledger and outside every public repo. The script refuses to write one
 * inside a git tree, the same rule ledger.mjs follows.
 */
import fs from "node:fs";
import path from "node:path";
import { REPO, parseArgs, localDate, insideGit, pad } from "./lib/ledger.mjs";

const { flags, positional } = parseArgs(process.argv.slice(2));
const FILE = path.resolve(flags.file || process.env.GLAZE_SCORECARD || path.join(REPO, "..", "contracts-private", "reviews", "scorecard.jsonl"));
const WHO = ["claude", "codex", "kevin", "local"];
const KINDS = ["code", "copy", "pitch", "data"];

function fail(msg) {
  console.error(`score: ${msg}`);
  process.exit(1);
}

function load() {
  if (!fs.existsSync(FILE)) return [];
  return fs.readFileSync(FILE, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
}

if (positional[0] === "add") {
  if (insideGit(path.dirname(FILE))) fail(`refusing to write inside a git tree: ${FILE}`);
  const row = {
    date: flags.date || localDate(),
    author: flags.author, reviewer: flags.reviewer,
    repo: flags.repo || null, ref: flags.ref || null,
    kind: flags.kind || "code",
    findings: Number(flags.findings ?? 0), held: Number(flags.held ?? flags.findings ?? 0),
    note: flags.note || null,
  };
  if (!WHO.includes(row.author)) fail(`--author is one of ${WHO.join(", ")}`);
  if (!WHO.includes(row.reviewer)) fail(`--reviewer is one of ${WHO.join(", ")}`);
  if (!KINDS.includes(row.kind)) fail(`--kind is one of ${KINDS.join(", ")}`);
  if (!Number.isInteger(row.findings) || !Number.isInteger(row.held) || row.held > row.findings) fail("--held is a whole number no larger than --findings");
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.appendFileSync(FILE, JSON.stringify(row) + "\n");
  console.log(`score: ${row.author} ${row.kind} in ${row.repo || "?"} reviewed by ${row.reviewer}, ${row.held}/${row.findings} held`);
  process.exit(0);
}

// ---------------------------------------------------------------- table

const rows = load();
const cells = {};
for (const r of rows) {
  const k = `${r.author}|${r.kind}`;
  cells[k] ||= { author: r.author, kind: r.kind, reviews: 0, findings: 0, held: 0, clean: 0 };
  const c = cells[k];
  c.reviews += 1; c.findings += r.findings; c.held += r.held;
  if (r.held === 0) c.clean += 1;
}
const byReviewer = {};
for (const r of rows) {
  byReviewer[r.reviewer] ||= { reviews: 0, findings: 0, held: 0 };
  const b = byReviewer[r.reviewer];
  b.reviews += 1; b.findings += r.findings; b.held += r.held;
}
const out = Object.values(cells).sort((a, b) => a.author.localeCompare(b.author) || a.kind.localeCompare(b.kind));

if (flags.json) {
  process.stdout.write(JSON.stringify({ file: FILE, entries: rows.length, authors: out, reviewers: byReviewer }, null, 2) + "\n");
  process.exit(0);
}

if (!rows.length) {
  console.log(`score: no entries yet at ${FILE}`);
  process.exit(0);
}
console.log(`Scorecard, ${rows.length} reviews, ${FILE}\n`);
console.log(`${pad("author", 8)} ${pad("kind", 6)} ${pad("reviews", 8)} ${pad("findings", 9)} ${pad("held", 5)} ${pad("clean", 6)} held per review`);
for (const c of out) {
  console.log(`${pad(c.author, 8)} ${pad(c.kind, 6)} ${pad(String(c.reviews), 8)} ${pad(String(c.findings), 9)} ${pad(String(c.held), 5)} ${pad(String(c.clean), 6)} ${(c.held / c.reviews).toFixed(1)}`);
}
console.log("\nreviewer accuracy (held / raised)");
for (const [who, b] of Object.entries(byReviewer)) {
  console.log(`  ${pad(who, 8)} ${b.held}/${b.findings}${b.findings ? ` (${Math.round((100 * b.held) / b.findings)}%)` : ""} over ${b.reviews} reviews`);
}
