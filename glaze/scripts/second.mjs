#!/usr/bin/env node
/**
 * THE SECOND OPINION. Hands a file, or a question, to OpenAI's model through
 * the Codex CLI and prints what it says. A different training set reads the
 * work with different blind spots, which is the whole value; the house rules
 * still decide, and nothing here writes to a repo or a client.
 *
 * Usage, from the glazedweb repo root:
 *
 *   node glaze/scripts/second.mjs review <file...>          find real defects in copy or code, ranked
 *   node glaze/scripts/second.mjs prose <file...>           the "Write like a person" tells, one per line
 *   node glaze/scripts/second.mjs judge <file...>           does every element move the reader to Launch
 *   node glaze/scripts/second.mjs ask "question" [file...]  freeform, files attached if given
 *
 *   --out <file>     also write the answer there
 *   --model <name>   override the model in ~/.codex/config.toml
 *   --repo           let it read this repo while it thinks (still read-only)
 *   --json           {mode, files, model, tokens, answer} for an agent
 *   --dry            print the prompt, call nothing
 *
 * HOW IT PAYS. Kevin, 2026-09-14: no API keys, subscriptions only. The Codex
 * CLI signs in with the ChatGPT account (auth_mode "chatgpt" in
 * ~/.codex/auth.json), so every call here rides that subscription the way
 * research.mjs --brief rides Claude Max. If auth.json ever carries an API key
 * instead, this script is spending money and the usage line says so.
 *
 * HOW IT IS FENCED. `codex exec` runs with the read-only sandbox, ephemeral
 * (no session files), approvals off, and its working directory is the OS
 * temp folder unless --repo is passed. The file contents go inline in the
 * prompt, so the model reads exactly what it was handed and nothing else.
 *
 * WHERE THE DOCTRINE COMES FROM. The prose mode lifts "Write like a person,
 * not like a model" from glaze/standards.md at run time; the judge mode lifts
 * "What goes in and what stays out" and "Before you send it" from
 * glaze/proposal.md. Edit the rule, the reviewer changes. Nothing is copied.
 *
 * WHAT IT WILL NOT DO. Rewrite the work unless the ask mode asks for it.
 * Praise. Agree for the sake of it: the review prompt says an empty list is a
 * fine answer. And two models agreeing is not verification; audit.mjs, the
 * width check and a real render still run before anything ships.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { REPO, parseArgs } from "./lib/ledger.mjs";

const { flags, positional } = parseArgs(process.argv.slice(2));
const MODES = ["review", "prose", "judge", "ask"];
const mode = positional[0];

function fail(msg) {
  console.error(`second: ${msg}`);
  process.exit(1);
}
if (!MODES.includes(mode)) fail(`first argument is one of ${MODES.join(", ")}`);

// ---------------------------------------------------------------- inputs

const rest = positional.slice(1);
const question = mode === "ask" ? rest.shift() : null;
if (mode === "ask" && !question) fail("ask needs a question in quotes");
if (mode !== "ask" && rest.length === 0) fail(`${mode} needs at least one file`);

const files = rest.map((f) => {
  const abs = path.resolve(f);
  if (!fs.existsSync(abs)) fail(`no file at ${f}`);
  return { rel: path.relative(REPO, abs) || f, text: fs.readFileSync(abs, "utf8") };
});

// ---------------------------------------------------------------- doctrine

// A "## Heading" block up to the next "## ", with the trailing rule stripped.
function section(file, heading) {
  const src = fs.readFileSync(path.join(REPO, file), "utf8");
  const start = src.indexOf(`## ${heading}`);
  if (start < 0) fail(`no section "${heading}" in ${file}`);
  const body = src.slice(start);
  const end = body.indexOf("\n## ", 4);
  return (end < 0 ? body : body.slice(0, end)).replace(/\n---\s*$/, "").trim();
}

const FLOOR = [
  "You are a second reader for Glazed Web, a small web studio in Michigan that builds sites and online ordering for restaurants, bars, florists and similar owner-run businesses.",
  "Be specific: quote the exact line you mean and give its line number when the material has lines.",
  "No praise, no summary of what the material is, no restating the task.",
  "Do not rewrite the material unless the task asks for a rewrite.",
  "If you are not sure something is a defect, say so in the finding instead of dropping it.",
  "An empty list is a fine answer when nothing is wrong. Do not invent findings to fill space.",
  "In your own writing: no em dashes, American spelling, one idea per sentence.",
].join("\n");

const TASKS = {
  review: () => [
    "Task: find the real defects in the material below. Copy defects are claims that are unverified, sentences about the studio instead of the reader, vague adjectives where a number belongs, and anything an owner would call out across the bar. Code defects are bugs, wrong assumptions, unhandled cases, and security holes.",
    "Output: a numbered list ranked by severity. Each item is one line of what is wrong and one line of why it matters. Nothing else.",
  ].join("\n"),
  prose: () => [
    "Task: read the material once for the tells listed under the rule below and report every one.",
    "Output: one finding per line in the form `line N | tell | the quoted words`. After the list, one line with the count. If there are none, write `none`.",
    "",
    section("glaze/standards.md", "Write like a person, not like a model"),
  ].join("\n"),
  judge: () => [
    "Task: the material is a proposal or pitch page. Its only job is to move the reader, a business owner, to press Launch and sign. Judge every section and every sentence by that one test.",
    "Output: for each section, one line `keep`, `cut` or `change` followed by the reason. Then list every sentence that argues the other side of a comparison the studio is making, quoted. Then one line: the single change that would most move the reader to Launch.",
    "",
    "The studio's own rules for what belongs in a proposal:",
    "",
    section("glaze/proposal.md", "What goes in and what stays out"),
    "",
    section("glaze/proposal.md", "Before you send it"),
  ].join("\n"),
  ask: () => `Task: ${question}`,
};

const attached = files
  .map((f) => `--- ${f.rel} ---\n${f.text}\n--- end ${f.rel} ---`)
  .join("\n\n");

const prompt = [FLOOR, "", TASKS[mode](), attached ? "\nMaterial:\n\n" + attached : ""].join("\n");

if (flags.dry) {
  process.stdout.write(prompt + "\n");
  process.exit(0);
}

// ---------------------------------------------------------------- codex

// The desktop app keeps the CLI under a hashed folder that changes on update,
// and writes the current one into config.toml. Prefer the explicit override,
// then PATH, then the config, then the newest hashed folder.
function findCodex() {
  const home = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
  if (process.env.GLAZE_CODEX && fs.existsSync(process.env.GLAZE_CODEX)) return process.env.GLAZE_CODEX;
  const onPath = spawnSync(process.platform === "win32" ? "where" : "which", ["codex"], { encoding: "utf8" });
  if (onPath.status === 0) {
    const first = onPath.stdout.split(/\r?\n/).find((l) => l.trim());
    if (first && fs.existsSync(first.trim())) return first.trim();
  }
  const cfg = path.join(home, "config.toml");
  if (fs.existsSync(cfg)) {
    const m = fs.readFileSync(cfg, "utf8").match(/CODEX_CLI_PATH\s*=\s*['"]([^'"]+)['"]/);
    if (m && fs.existsSync(m[1])) return m[1];
  }
  const bin = path.join(process.env.LOCALAPPDATA || "", "OpenAI", "Codex", "bin");
  if (fs.existsSync(bin)) {
    const found = fs
      .readdirSync(bin)
      .map((d) => path.join(bin, d, "codex.exe"))
      .filter(fs.existsSync)
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    if (found[0]) return found[0];
  }
  return null;
}

function authMode() {
  const home = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
  try {
    const auth = JSON.parse(fs.readFileSync(path.join(home, "auth.json"), "utf8"));
    if (auth.auth_mode) return auth.auth_mode;
    if (auth.OPENAI_API_KEY) return "apikey";
  } catch {}
  return "unknown";
}

const codex = findCodex();
if (!codex) fail("no Codex CLI found: install the Codex app or set GLAZE_CODEX to codex.exe");
const auth = authMode();
if (auth !== "chatgpt") console.error(`second: Codex auth is "${auth}", not the ChatGPT subscription. This may be billing an API key.`);

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "glaze-second-"));
const lastFile = path.join(scratch, "answer.md");
const cwd = flags.repo ? REPO : scratch;
const args = [
  "exec", "--skip-git-repo-check", "--ephemeral", "-s", "read-only", "--color", "never",
  "-C", cwd, "-o", lastFile,
];
if (flags.model) args.push("-m", String(flags.model));
args.push("-");

const run = spawnSync(codex, args, { input: prompt, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
if (run.error) fail(`could not start Codex: ${run.error.message}`);
if (run.status !== 0 || !fs.existsSync(lastFile)) {
  console.error(run.stderr || run.stdout);
  fail(`Codex exited ${run.status}`);
}

const answer = fs.readFileSync(lastFile, "utf8").trim();
// The header (model, provider) and the usage line are printed to stderr; the
// answer alone goes to stdout. Read both so the usage line is honest.
const log = `${run.stderr}\n${run.stdout}`;
const modelUsed = (log.match(/^model:\s*(.+?)\s*$/m) || [])[1] || flags.model || "config default";
const tokens = Number(((log.match(/tokens used\s*\r?\n\s*([\d,]+)/) || [])[1] || "0").replace(/,/g, ""));
fs.rmSync(scratch, { recursive: true, force: true });

if (flags.out) fs.writeFileSync(path.resolve(flags.out), answer + "\n");

if (flags.json) {
  process.stdout.write(JSON.stringify({ mode, files: files.map((f) => f.rel), model: modelUsed, auth, tokens, answer }, null, 2) + "\n");
} else {
  process.stdout.write(answer + "\n");
  console.error(`\nsecond: ${mode} via ${modelUsed}, ${auth} auth, ${tokens.toLocaleString()} tokens`);
}
