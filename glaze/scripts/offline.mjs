#!/usr/bin/env node
/**
 * THE SHELF. Fills and refreshes a local copy of the parts of the internet
 * the studio actually uses, so the work keeps going when the pipe is gone or
 * cannot be trusted. Spec and reasoning in glaze/offline.md. What goes on the
 * shelf is glaze/offline.manifest.json.
 *
 * Usage, from the glazedweb repo root, with the drive plugged in:
 *
 *   node glaze/scripts/offline.mjs plan   --root E:/glaze-offline [--tier 1] [--only kiwix,repos] [--offline]
 *   node glaze/scripts/offline.mjs fill   --root E:/glaze-offline [--tier 1] [--only ...] [--pick devdocs,pjs] [--prune] [--dry]
 *   node glaze/scripts/offline.mjs warm   --root E:/glaze-offline            # fill the npm proxy from every lockfile
 *   node glaze/scripts/offline.mjs seal   --root E:/glaze-offline            # env files, encrypted; needs GLAZE_OFFLINE_KEY
 *   node glaze/scripts/offline.mjs unseal --root E:/glaze-offline [--restore <dir>] [--file <blob>]
 *   node glaze/scripts/offline.mjs verify --root E:/glaze-offline [--deep]
 *   node glaze/scripts/offline.mjs status --root E:/glaze-offline [--json]
 *   node glaze/scripts/offline.mjs serve  --root E:/glaze-offline [--port 8080]
 *
 * --root can also come from GLAZE_OFFLINE_ROOT. plan needs no root. The root
 * is refused inside any git tree, and a root on the same volume as the
 * source files gets a warning, because a copy on the disk that fails with the
 * original is not a backup.
 *
 * Sections, each its own --only key: repos, copies, kiwix, downloads, npm,
 * docker, seal. --tier N takes every section item at or below N; default 1.
 * --pick a,b narrows to items whose name or id contains a term, so one book
 * or one repo can be fetched or re-fetched on its own.
 *
 * How each upstream is resolved, so the manifest can hold names and the
 * monthly refresh finds the new file by itself:
 *   kiwix      library.kiwix.org OPDS catalog by exact name (+ flavour), then
 *              the .meta4 metalink for the SHA-256. Verified after download.
 *   node-lts   nodejs.org/dist/index.json, newest LTS, msi + SHASUMS256.
 *   github     api.github.com releases/latest, asset by regex.
 *   ubuntu     releases.ubuntu.com/<series>/SHA256SUMS, file by regex.
 *   url        plain URL; refreshed when the remote Content-Length changes.
 * Every download resumes (curl -C -), lands as .part, and is renamed only
 * after the hash or size check passes. Windows ships curl.exe; nothing else
 * is installed for this.
 *
 * State lives on the shelf itself (state.json), not in the repo: the drive
 * has to be self-describing when this repo is the thing being restored.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import net from "node:net";
import { spawn, spawnSync } from "node:child_process";
import { parseArgs, localDate, insideGit, REPO } from "./lib/ledger.mjs";

const { flags, positional } = parseArgs(process.argv.slice(2));
const command = positional[0] || "plan";
const MANIFEST_PATH = path.join(REPO, "glaze", "offline.manifest.json");
const UA = "glaze-offline/1 (+https://glazedweb.com; curl)";
const TIER = Number(flags.tier || 1);
const ONLY = flags.only ? new Set(String(flags.only).split(",").map((s) => s.trim())) : null;
const DRY = Boolean(flags.dry);
// --pick a,b keeps only items whose id or name contains one of the terms.
const PICK = flags.pick ? String(flags.pick).split(",").map((s) => s.trim()).filter(Boolean) : null;
function picked(...names) {
  if (!PICK) return true;
  return names.some((n) => n && PICK.some((p) => String(n).includes(p)));
}
const JSON_OUT = Boolean(flags.json);
const SECTIONS = ["repos", "copies", "kiwix", "downloads", "npm", "docker", "seal"];

function fail(msg) {
  console.error(`offline: ${msg}`);
  process.exit(1);
}
function say(msg) {
  if (!JSON_OUT) console.log(msg);
}
function gb(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return "?";
  if (bytes < 1024 ** 2) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}
function expandHome(p) {
  return p.replace(/^~(?=$|[\\/])/, os.homedir());
}
function wants(section, tier) {
  if (ONLY && !ONLY.has(section)) return false;
  return (tier ?? 1) <= TIER;
}
function rel(p) {
  return path.relative(process.cwd(), p) || ".";
}

// ------------------------------------------------------------ manifest, root

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

function resolveRoot({ required }) {
  const raw = flags.root || process.env.GLAZE_OFFLINE_ROOT;
  if (!raw) {
    if (required) fail("no --root and no GLAZE_OFFLINE_ROOT. Plug the drive in and pass --root E:/glaze-offline");
    return null;
  }
  const root = path.resolve(String(raw));
  const inGit = insideGit(path.join(root, "x"));
  if (inGit) fail(`${root} is inside the git tree at ${inGit}. The shelf never lives in a repo.`);
  if (required && !DRY) fs.mkdirSync(root, { recursive: true });
  const homeVol = path.parse(os.homedir()).root.toLowerCase();
  if (["fill", "warm"].includes(command) && path.parse(root).root.toLowerCase() === homeVol) {
    console.error(`offline: warning, ${root} is on the same volume as your home folder. That is a copy, not a backup. Fine for a first fill, move it to its own drive after.`);
  }
  return root;
}

function statePath(root) {
  return path.join(root, "state.json");
}
function loadState(root) {
  try {
    return JSON.parse(fs.readFileSync(statePath(root), "utf8"));
  } catch {
    return { items: {}, runs: [] };
  }
}
function saveState(root, state) {
  if (DRY) return;
  fs.writeFileSync(statePath(root), JSON.stringify(state, null, 2) + "\n");
}
function record(state, id, patch) {
  state.items[id] = { ...(state.items[id] || {}), ...patch, updated: localDate() };
}

// ------------------------------------------------------------------- http

async function fetchText(url, { headers = {} } = {}) {
  const res = await fetch(url, { headers: { "user-agent": UA, ...headers }, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}
async function fetchJSON(url) {
  return JSON.parse(await fetchText(url, { headers: { accept: "application/json" } }));
}
// HEAD via curl so the same path (redirects, mirrors, UA gates) is measured
// as the download itself. Geofabrik answers 000 to a bare HEAD without a UA.
function remoteSize(url) {
  const r = spawnSync("curl.exe", ["-sIL", "--max-time", "30", "-A", UA, url], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const lens = [...r.stdout.matchAll(/^content-length:\s*(\d+)/gim)].map((m) => Number(m[1]));
  return lens.length ? lens[lens.length - 1] : null;
}

// ------------------------------------------------------------- resolvers

async function resolveKiwix(item) {
  const xml = await fetchText(`https://library.kiwix.org/catalog/v2/entries?name=${encodeURIComponent(item.name)}`);
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  const wantFlavour = item.flavour || "";
  const hit = entries.find((e) => {
    const f = (e.match(/<flavour>([^<]*)<\/flavour>/) || [, ""])[1];
    return f === wantFlavour;
  }) || (entries.length === 1 && !item.flavour ? entries[0] : null);
  if (!hit) {
    const seen = entries.map((e) => (e.match(/<flavour>([^<]*)<\/flavour>/) || [, "(none)"])[1] || "(none)");
    throw new Error(`not in the Kiwix catalog: ${item.name}${item.flavour ? " " + item.flavour : ""}${seen.length ? ` (flavours seen: ${seen.join(", ")})` : ""}`);
  }
  const link = hit.match(/href="(https:[^"]+\.zim)\.meta4"\s+length="(\d+)"/);
  if (!link) throw new Error(`catalog entry for ${item.name} has no zim link`);
  const url = link[1];
  const file = path.basename(url);
  let sha256 = null;
  try {
    const meta = await fetchText(`${url}.meta4`);
    sha256 = (meta.match(/<hash type="sha-256">([0-9a-f]{64})<\/hash>/) || [])[1] || null;
  } catch {
    /* the metalink is a courtesy; size still gates */
  }
  const size = Number((await fetchText(`${url}.meta4`).catch(() => "")).match(/<size>(\d+)<\/size>/)?.[1] || link[2]);
  return { url, file, size, sha256, family: `${item.name}${item.flavour ? "_" + item.flavour : ""}_` };
}

async function resolveNodeLts() {
  const list = await fetchJSON("https://nodejs.org/dist/index.json");
  const lts = list.find((v) => v.lts && v.files.includes("win-x64-msi"));
  if (!lts) throw new Error("no LTS in nodejs.org/dist/index.json");
  const file = `node-${lts.version}-x64.msi`;
  const base = `https://nodejs.org/dist/${lts.version}/`;
  const sums = await fetchText(`${base}SHASUMS256.txt`);
  const sha256 = (sums.match(new RegExp(`^([0-9a-f]{64})\\s+${file.replace(/\./g, "\\.")}$`, "m")) || [])[1] || null;
  return { url: base + file, file, sha256, size: null, family: "node-v" };
}

async function resolveGithub(item) {
  const rel = await fetchJSON(`https://api.github.com/repos/${item.repo}/releases/latest`);
  const re = new RegExp(item.asset);
  const asset = (rel.assets || []).find((a) => re.test(a.name));
  if (!asset) throw new Error(`no asset matching ${item.asset} in ${item.repo} ${rel.tag_name}`);
  return { url: asset.browser_download_url, file: asset.name, size: asset.size, sha256: null, family: asset.name.replace(/[\d.]+.*$/, "") };
}

async function resolveUbuntu(item) {
  const base = `https://releases.ubuntu.com/${item.series}/`;
  const sums = await fetchText(`${base}SHA256SUMS`);
  const re = new RegExp(item.pattern);
  const line = sums.split("\n").find((l) => re.test(l));
  if (!line) throw new Error(`nothing matching ${item.pattern} in ${base}SHA256SUMS`);
  const [sha256, name] = line.trim().split(/\s+\*?/);
  return { url: base + name, file: name, sha256, size: null, family: name.replace(/[\d.]+-desktop.*$/, "") };
}

async function resolveDownload(item) {
  if (item.resolve === "node-lts") return resolveNodeLts();
  if (item.resolve === "github-latest") return resolveGithub(item);
  if (item.resolve === "ubuntu") return resolveUbuntu(item);
  let md5 = null;
  if (item.md5) {
    try {
      md5 = (await fetchText(item.md5)).trim().split(/\s+/)[0] || null;
    } catch {
      /* md5 sidecar missing is not fatal */
    }
  }
  return { url: item.url, file: item.file, size: remoteSize(item.url), sha256: null, md5, family: null };
}
async function resolveDownloadSized(item) {
  const r = await resolveDownload(item);
  if (r.size == null) r.size = remoteSize(r.url);
  return r;
}

// ------------------------------------------------------------ downloading

function hashFile(file, algo) {
  return new Promise((resolve, reject) => {
    const h = crypto.createHash(algo);
    fs.createReadStream(file).on("data", (d) => h.update(d)).on("end", () => resolve(h.digest("hex"))).on("error", reject);
  });
}

function curlDownload(url, dest) {
  return new Promise((resolve) => {
    // A progress bar only when a person is watching; a log gets one line.
    const progress = process.stdout.isTTY ? ["--progress-bar"] : ["-sS"];
    const args = ["-L", "--fail", "--retry", "5", "--retry-delay", "10", "--retry-all-errors", "-C", "-", "-A", UA, ...progress, "-o", dest, url];
    const child = spawn("curl.exe", args, { stdio: ["ignore", "inherit", "inherit"] });
    child.on("close", (code) => resolve(code));
  });
}

// Returns "fresh" | "kept" | "failed". Refresh rule: a different file name is
// always new; the same name is refreshed when the remote size changed.
async function fetchInto(resolved, dir, state, id, { deleteFamily = false } = {}) {
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, resolved.file);
  const have = fs.existsSync(dest) ? fs.statSync(dest).size : null;
  const prior = state.items[id];
  if (have != null) {
    const sameSize = resolved.size == null || have === resolved.size;
    const sameName = prior?.file === resolved.file;
    if (sameSize && (sameName || resolved.size != null)) {
      say(`  kept    ${resolved.file} (${gb(have)})`);
      record(state, id, { file: resolved.file, url: resolved.url, size: have });
      return "kept";
    }
  }
  say(`  fetch   ${resolved.file}${resolved.size ? ` (${gb(resolved.size)})` : ""}`);
  if (DRY) return "fresh";
  const part = `${dest}.part`;
  if (have != null && resolved.size != null && have !== resolved.size) fs.rmSync(dest, { force: true });
  const code = await curlDownload(resolved.url, part);
  if (code !== 0 || !fs.existsSync(part)) {
    console.error(`  failed  curl exit ${code} for ${resolved.url}`);
    record(state, id, { lastError: `curl exit ${code}`, url: resolved.url });
    return "failed";
  }
  const got = fs.statSync(part).size;
  if (resolved.size != null && got !== resolved.size) {
    console.error(`  failed  size ${got} != ${resolved.size}, kept ${path.basename(part)} for resume`);
    record(state, id, { lastError: `short ${got}/${resolved.size}` });
    return "failed";
  }
  if (resolved.sha256) {
    say(`  hash    sha256 over ${gb(got)}`);
    const sum = await hashFile(part, "sha256");
    if (sum !== resolved.sha256) {
      fs.rmSync(part, { force: true });
      console.error(`  failed  sha256 mismatch for ${resolved.file}; deleted`);
      record(state, id, { lastError: "sha256 mismatch" });
      return "failed";
    }
  } else if (resolved.md5) {
    const sum = await hashFile(part, "md5");
    if (sum !== resolved.md5) {
      fs.rmSync(part, { force: true });
      console.error(`  failed  md5 mismatch for ${resolved.file}; deleted`);
      record(state, id, { lastError: "md5 mismatch" });
      return "failed";
    }
  }
  fs.renameSync(part, dest);
  if (deleteFamily && resolved.family) {
    for (const f of fs.readdirSync(dir)) {
      if (f !== resolved.file && f.startsWith(resolved.family) && !f.endsWith(".part")) {
        say(`  pruned  ${f}`);
        fs.rmSync(path.join(dir, f), { force: true });
      }
    }
  }
  record(state, id, { file: resolved.file, url: resolved.url, size: got, sha256: resolved.sha256 || undefined, fetched: localDate(), lastError: undefined });
  return "fresh";
}

// ------------------------------------------------------------------ repos

function scanRepos() {
  const parent = path.resolve(REPO, manifest.repos.scan || "..");
  const out = [];
  for (const name of fs.readdirSync(parent)) {
    const dir = path.join(parent, name);
    if (!fs.existsSync(path.join(dir, ".git"))) continue;
    const r = spawnSync("git", ["-C", dir, "remote", "get-url", "origin"], { encoding: "utf8" });
    const origin = r.status === 0 ? r.stdout.trim() : "";
    out.push({ name, dir, origin });
  }
  return out;
}

function git(args, opts = {}) {
  const r = spawnSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}

function mirrorRepos(root, state) {
  const dir = path.join(root, "repos");
  fs.mkdirSync(dir, { recursive: true });
  const repos = scanRepos();
  let fresh = 0;
  let failed = 0;
  for (const r of repos) {
    if (!picked(r.name)) continue;
    const target = path.join(dir, `${r.name}.git`);
    const src = r.origin || r.dir;
    if (DRY) {
      say(`  mirror  ${r.name} <- ${r.origin ? "origin" : "working copy"}`);
      continue;
    }
    let res;
    if (!fs.existsSync(target)) {
      res = git(["clone", "--mirror", "--quiet", src, target]);
      if (!res.ok && r.origin) res = git(["clone", "--mirror", "--quiet", r.dir, target]);
    } else {
      res = git(["--git-dir", target, "remote", "update", "--prune"]);
      if (!res.ok && r.origin) res = git(["--git-dir", target, "fetch", "--prune", r.dir, "+refs/heads/*:refs/heads/*", "+refs/tags/*:refs/tags/*"]);
    }
    if (res.ok) {
      fresh += 1;
      const head = git(["--git-dir", target, "rev-parse", "--short", "HEAD"]).out.trim();
      say(`  mirror  ${r.name} @ ${head}${r.origin ? "" : " (no remote; from the working copy)"}`);
      record(state, `repo:${r.name}`, { head, source: r.origin || "working copy", fetched: localDate(), lastError: undefined });
    } else {
      failed += 1;
      console.error(`  failed  ${r.name}: ${res.out.trim().split("\n").pop()}`);
      record(state, `repo:${r.name}`, { lastError: res.out.trim().split("\n").pop() });
    }
  }
  return { count: repos.length, fresh, failed };
}

// ----------------------------------------------------------------- copies

function robocopy(from, to, { purge }) {
  fs.mkdirSync(to, { recursive: true });
  const args = [from, to, "/E", "/R:2", "/W:5", "/NP", "/NFL", "/NDL", "/NJH", "/XJ", "/MT:8"];
  if (purge) args.push("/PURGE");
  const r = spawnSync("robocopy", args, { encoding: "utf8" });
  // robocopy: 0 nothing to do, 1 copied, 2 extras, 4 mismatches; 8+ is failure
  return { ok: r.status < 8, code: r.status, out: r.stdout || "" };
}

function dirSize(dir) {
  let total = 0;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isSymbolicLink()) continue;
      if (e.isDirectory()) walk(p);
      else total += fs.statSync(p).size;
    }
  };
  try {
    walk(dir);
  } catch {
    /* partial is fine for a report */
  }
  return total;
}

function runCopies(root, state) {
  let fresh = 0;
  let failed = 0;
  let skipped = 0;
  for (const c of manifest.copies) {
    if (!wants("copies", c.tier) || !picked(c.id)) continue;
    const from = expandHome(c.from);
    const to = path.join(root, c.to);
    if (!fs.existsSync(from)) {
      if (c.optional) {
        say(`  absent  ${c.id} (${from} is not on this machine)`);
        skipped += 1;
        continue;
      }
      console.error(`  failed  ${c.id}: ${from} does not exist`);
      failed += 1;
      continue;
    }
    if (DRY) {
      say(`  copy    ${c.id} (${gb(dirSize(from))}) -> ${rel(to)}`);
      continue;
    }
    const purge = Boolean(flags.prune) && fs.readdirSync(from).length > 0;
    const r = robocopy(from, to, { purge });
    const copied = (r.out.match(/Files\s*:\s*\d+\s+(\d+)/) || [])[1];
    if (r.ok) {
      fresh += 1;
      say(`  copy    ${c.id}: ${copied ?? "?"} files copied, ${gb(dirSize(to))} on the shelf`);
      record(state, `copy:${c.id}`, { from, to: c.to, size: dirSize(to), fetched: localDate(), lastError: undefined });
    } else {
      failed += 1;
      console.error(`  failed  ${c.id}: robocopy exit ${r.code}`);
      record(state, `copy:${c.id}`, { lastError: `robocopy exit ${r.code}` });
    }
  }
  return { fresh, failed, skipped };
}

// ------------------------------------------------------------------ kiwix

async function runKiwix(root, state) {
  const dir = path.join(root, "kiwix");
  let fresh = 0;
  let failed = 0;
  for (const item of manifest.kiwix) {
    if (!wants("kiwix", item.tier) || !picked(item.name, item.flavour)) continue;
    const id = `kiwix:${item.name}${item.flavour ? ":" + item.flavour : ""}`;
    let resolved;
    try {
      resolved = await resolveKiwix(item);
    } catch (e) {
      console.error(`  failed  ${id}: ${e.message}`);
      record(state, id, { lastError: e.message });
      failed += 1;
      continue;
    }
    const r = await fetchInto(resolved, dir, state, id, { deleteFamily: Boolean(flags.prune) });
    if (r === "fresh") fresh += 1;
    if (r === "failed") failed += 1;
  }
  return { fresh, failed };
}

// -------------------------------------------------------------- downloads

async function runDownloads(root, state) {
  let fresh = 0;
  let failed = 0;
  for (const item of manifest.downloads) {
    if (!wants("downloads", item.tier) || !picked(item.id)) continue;
    const id = `dl:${item.id}`;
    let resolved;
    try {
      resolved = await resolveDownloadSized(item);
    } catch (e) {
      console.error(`  failed  ${id}: ${e.message}`);
      record(state, id, { lastError: e.message });
      failed += 1;
      continue;
    }
    const r = await fetchInto(resolved, path.join(root, item.to), state, id, { deleteFamily: Boolean(flags.prune) });
    if (r === "fresh") fresh += 1;
    if (r === "failed") failed += 1;
  }
  for (const m of manifest.manual) {
    if (PICK) break;
    say(`  manual  ${m.id} -> ${m.to}/. ${m.why}`);
  }
  return { fresh, failed };
}

// ------------------------------------------------------------- npm proxy

function npmPaths(root) {
  const base = path.join(root, manifest.npm.to || "npm");
  return {
    base,
    prefix: path.join(base, "verdaccio"),
    bin: path.join(base, "verdaccio", "node_modules", "verdaccio", "bin", "verdaccio"),
    storage: path.join(base, "storage"),
    config: path.join(base, "config.yaml"),
    cache: path.join(base, "npm-cache"),
    port: manifest.npm.port || 4873,
  };
}

// Node refuses to spawn npm.cmd without a shell since the 2024 batch-file
// fix, so npm is run as the JavaScript it is, with this same node binary.
function npmCli() {
  const cli = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  if (fs.existsSync(cli)) return { cmd: process.execPath, pre: [cli], shell: false };
  return { cmd: process.platform === "win32" ? "npm.cmd" : "npm", pre: [], shell: process.platform === "win32" };
}
function runNpmCli(args, opts = {}) {
  const n = npmCli();
  const r = spawnSync(n.cmd, [...n.pre, ...args], { encoding: "utf8", shell: n.shell, ...opts });
  if (r.error) r.stderr = (r.stderr || "") + String(r.error.message);
  return r;
}

function writeVerdaccioConfig(p) {
  const yaml = [
    "# Written by glaze/scripts/offline.mjs. Storage on the shelf, upstream npmjs.",
    `storage: ${p.storage.replace(/\\/g, "/")}`,
    "uplinks:",
    "  npmjs:",
    "    url: https://registry.npmjs.org/",
    "    cache: true",
    "    maxage: 30d",
    "    fail_timeout: 2m",
    "packages:",
    "  '@*/*':",
    "    access: $all",
    "    publish: $authenticated",
    "    proxy: npmjs",
    "  '**':",
    "    access: $all",
    "    publish: $authenticated",
    "    proxy: npmjs",
    "server:",
    "  keepAliveTimeout: 60",
    "log: { type: stdout, format: pretty, level: warn }",
    "",
  ].join("\n");
  fs.writeFileSync(p.config, yaml);
}

function runNpm(root, state) {
  const p = npmPaths(root);
  if (DRY) {
    say(`  npm     install verdaccio into ${rel(p.prefix)}, write ${rel(p.config)}`);
    return { fresh: 0, failed: 0 };
  }
  fs.mkdirSync(p.prefix, { recursive: true });
  fs.mkdirSync(p.storage, { recursive: true });
  const r = runNpmCli(["install", "--prefix", p.prefix, "verdaccio@latest", "--no-audit", "--no-fund", "--loglevel", "error"]);
  if (r.status !== 0) {
    console.error(`  failed  verdaccio install: ${(r.stderr || "").trim().split("\n").pop() || `exit ${r.status}`}`);
    record(state, "npm:verdaccio", { lastError: "install failed" });
    return { fresh: 0, failed: 1 };
  }
  writeVerdaccioConfig(p);
  const ver = JSON.parse(fs.readFileSync(path.join(p.prefix, "node_modules", "verdaccio", "package.json"), "utf8")).version;
  say(`  npm     verdaccio ${ver} on the shelf; run "offline.mjs warm" to fill it from the lockfiles`);
  record(state, "npm:verdaccio", { version: ver, fetched: localDate(), lastError: undefined });
  return { fresh: 1, failed: 0 };
}

function portOpen(port) {
  return new Promise((resolve) => {
    const s = net.connect({ port, host: "127.0.0.1" });
    s.once("connect", () => {
      s.end();
      resolve(true);
    });
    s.once("error", () => resolve(false));
  });
}

async function startVerdaccio(root) {
  const p = npmPaths(root);
  if (!fs.existsSync(p.bin)) fail(`verdaccio is not on the shelf yet; run: offline.mjs fill --only npm --root ${root}`);
  if (await portOpen(p.port)) {
    say(`  npm     something already listens on ${p.port}; using it`);
    return null;
  }
  const child = spawn(process.execPath, [p.bin, "--config", p.config, "--listen", `127.0.0.1:${p.port}`], { stdio: ["ignore", "ignore", "inherit"] });
  for (let i = 0; i < 60; i += 1) {
    if (await portOpen(p.port)) return child;
    await new Promise((r) => setTimeout(r, 500));
  }
  child.kill();
  fail("verdaccio did not come up on its port in 30 seconds");
  return null;
}

async function warm(root, state) {
  const p = npmPaths(root);
  const child = await startVerdaccio(root);
  const registry = `http://127.0.0.1:${p.port}/`;
  const repos = scanRepos().filter((r) => picked(r.name) && fs.existsSync(path.join(r.dir, "package-lock.json")));
  say(`warming ${registry} from ${repos.length} lockfiles`);
  let ok = 0;
  let failed = 0;
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "glaze-warm-"));
  try {
    for (const r of repos) {
      const work = path.join(scratch, r.name);
      fs.mkdirSync(work, { recursive: true });
      for (const f of ["package.json", "package-lock.json"]) fs.copyFileSync(path.join(r.dir, f), path.join(work, f));
      const t0 = Date.now();
      const res = runNpmCli(["ci", "--ignore-scripts", "--no-audit", "--no-fund", "--loglevel", "error", "--registry", registry, "--cache", p.cache], { cwd: work });
      const secs = Math.round((Date.now() - t0) / 1000);
      if (res.status === 0) {
        ok += 1;
        say(`  warm    ${r.name} (${secs}s)`);
        record(state, `warm:${r.name}`, { fetched: localDate(), lastError: undefined });
      } else {
        failed += 1;
        const line = (res.stderr || "").trim().split("\n").filter(Boolean).pop() || `exit ${res.status}`;
        console.error(`  failed  ${r.name}: ${line}`);
        record(state, `warm:${r.name}`, { lastError: line });
      }
      fs.rmSync(work, { recursive: true, force: true });
    }
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
    if (child) child.kill();
  }
  const tarballs = countFiles(p.storage, ".tgz");
  say(`storage now holds ${tarballs} tarballs, ${gb(dirSize(p.storage))}`);
  record(state, "npm:storage", { tarballs, size: dirSize(p.storage), fetched: localDate() });
  return { ok, failed };
}

function countFiles(dir, ext) {
  let n = 0;
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const q = path.join(d, e.name);
      if (e.isDirectory()) walk(q);
      else if (e.name.endsWith(ext)) n += 1;
    }
  };
  walk(dir);
  return n;
}

// ----------------------------------------------------------------- docker

function runDocker(root, state) {
  const which = spawnSync(process.platform === "win32" ? "where" : "which", ["docker"], { encoding: "utf8" });
  if (which.status !== 0) {
    say(`  absent  docker is not on PATH; the images wait for Docker Desktop (installers/)`);
    return { fresh: 0, failed: 0, skipped: 1 };
  }
  const dir = path.join(root, manifest.docker.to || "docker");
  fs.mkdirSync(dir, { recursive: true });
  let fresh = 0;
  let failed = 0;
  for (const image of manifest.docker.images) {
    if (!picked(image)) continue;
    const file = path.join(dir, `${image.replace(/[\/:]/g, "_")}.tar`);
    if (DRY) {
      say(`  docker  pull + save ${image}`);
      continue;
    }
    const pull = spawnSync("docker", ["pull", "--quiet", image], { encoding: "utf8" });
    if (pull.status !== 0) {
      failed += 1;
      console.error(`  failed  docker pull ${image}: ${(pull.stderr || "").trim().split("\n").pop()}`);
      continue;
    }
    const save = spawnSync("docker", ["save", "-o", file, image], { encoding: "utf8" });
    if (save.status !== 0) {
      failed += 1;
      console.error(`  failed  docker save ${image}`);
      continue;
    }
    fresh += 1;
    say(`  docker  ${image} -> ${path.basename(file)} (${gb(fs.statSync(file).size)})`);
    record(state, `docker:${image}`, { file: path.basename(file), size: fs.statSync(file).size, fetched: localDate() });
  }
  return { fresh, failed, skipped: 0 };
}

// ------------------------------------------------------------------- seal

function keyFromPassphrase(pass, salt) {
  // 128 * N * r bytes of memory; Node caps at 32 MB unless told otherwise.
  return crypto.scryptSync(pass, salt, 32, { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
}

function gatherEnv() {
  const files = {};
  for (const r of scanRepos()) {
    for (const name of manifest.seal.files) {
      const p = path.join(r.dir, name);
      if (fs.existsSync(p)) files[`${r.name}/${name}`] = fs.readFileSync(p, "utf8");
    }
  }
  return files;
}

function seal(root, state) {
  const pass = process.env.GLAZE_OFFLINE_KEY;
  if (!pass || pass.length < 12) fail("set GLAZE_OFFLINE_KEY in this shell (12+ characters) before sealing. It is used once and never written down.");
  const files = gatherEnv();
  const names = Object.keys(files);
  if (!names.length) {
    say("  seal    no env files found in any sibling repo; nothing to seal");
    return { fresh: 0, failed: 0 };
  }
  if (DRY) {
    say(`  seal    ${names.length} env files from ${new Set(names.map((n) => n.split("/")[0])).size} repos`);
    return { fresh: 0, failed: 0 };
  }
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = keyFromPassphrase(pass, salt);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plain = Buffer.from(JSON.stringify({ sealed: localDate(), files }), "utf8");
  const body = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  const blob = { v: 1, kdf: "scrypt N=32768 r=8 p=1", cipher: "aes-256-gcm", salt: salt.toString("base64"), iv: iv.toString("base64"), tag: tag.toString("base64"), data: body.toString("base64") };
  const dir = path.join(root, manifest.seal.to || "sealed");
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `env-${localDate()}.json.enc`);
  fs.writeFileSync(out, JSON.stringify(blob));
  say(`  seal    ${names.length} env files from ${new Set(names.map((n) => n.split("/")[0])).size} repos -> ${rel(out)}`);
  record(state, "seal", { file: path.basename(out), count: names.length, fetched: localDate() });
  return { fresh: 1, failed: 0 };
}

function unseal(root) {
  const pass = process.env.GLAZE_OFFLINE_KEY;
  if (!pass) fail("set GLAZE_OFFLINE_KEY in this shell to unseal");
  const dir = path.join(root, manifest.seal.to || "sealed");
  let file = flags.file ? path.resolve(String(flags.file)) : null;
  if (!file) {
    const blobs = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json.enc")).sort() : [];
    if (!blobs.length) fail(`nothing sealed under ${dir}`);
    file = path.join(dir, blobs[blobs.length - 1]);
  }
  const blob = JSON.parse(fs.readFileSync(file, "utf8"));
  const key = keyFromPassphrase(pass, Buffer.from(blob.salt, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(blob.iv, "base64"));
  decipher.setAuthTag(Buffer.from(blob.tag, "base64"));
  let plain;
  try {
    plain = Buffer.concat([decipher.update(Buffer.from(blob.data, "base64")), decipher.final()]).toString("utf8");
  } catch {
    fail("wrong passphrase, or the blob is damaged");
  }
  const { sealed, files } = JSON.parse(plain);
  const names = Object.keys(files);
  console.log(`sealed ${sealed}, ${names.length} files:`);
  for (const n of names) console.log(`  ${n} (${files[n].split("\n").filter((l) => l.trim() && !l.startsWith("#")).length} vars)`);
  if (flags.restore) {
    const to = path.resolve(String(flags.restore));
    for (const n of names) {
      const p = path.join(to, n);
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, files[n]);
    }
    console.log(`restored under ${to}`);
  } else {
    console.log("values not printed. --restore <dir> writes the files there.");
  }
}

// ------------------------------------------------------------------- plan

async function plan(root) {
  const state = root ? loadState(root) : { items: {} };
  const rows = [];
  const push = (section, tier, id, size, note) => rows.push({ section, tier, id, size, note, chosen: (tier ?? 1) <= TIER && (!ONLY || ONLY.has(section)) });
  if (!ONLY || ONLY.has("repos")) {
    const repos = scanRepos();
    push("repos", manifest.repos.tier, `${repos.length} repos, bare mirrors`, null, root && fs.existsSync(path.join(root, "repos")) ? "on shelf, will refresh" : "new");
  }
  for (const c of manifest.copies) {
    const from = expandHome(c.from);
    const exists = fs.existsSync(from);
    push("copies", c.tier, c.id, exists ? dirSize(from) : null, exists ? (root && fs.existsSync(path.join(root, c.to)) ? "on shelf, will refresh" : "new") : c.optional ? "not on this machine" : "MISSING");
  }
  if (!ONLY || ONLY.has("kiwix")) {
    for (const item of manifest.kiwix) {
      const id = `${item.name}${item.flavour ? " " + item.flavour : ""}`;
      if (flags.offline) {
        push("kiwix", item.tier, id, null, "not resolved (--offline)");
        continue;
      }
      try {
        const r = await resolveKiwix(item);
        const key = `kiwix:${item.name}${item.flavour ? ":" + item.flavour : ""}`;
        const have = root && fs.existsSync(path.join(root, "kiwix", r.file));
        push("kiwix", item.tier, id, r.size, have ? `have ${r.file}` : state.items[key]?.file ? `newer: ${r.file} replaces ${state.items[key].file}` : r.file);
      } catch (e) {
        push("kiwix", item.tier, id, null, `UNRESOLVED ${e.message}`);
      }
    }
  }
  if (!ONLY || ONLY.has("downloads")) {
    for (const item of manifest.downloads) {
      if (flags.offline) {
        push("downloads", item.tier, item.id, null, "not resolved (--offline)");
        continue;
      }
      try {
        const r = await resolveDownloadSized(item);
        const have = root && fs.existsSync(path.join(root, item.to, r.file));
        push("downloads", item.tier, item.id, r.size, have ? `have ${r.file}` : r.file);
      } catch (e) {
        push("downloads", item.tier, item.id, null, `UNRESOLVED ${e.message}`);
      }
    }
    for (const m of manifest.manual) push("downloads", 1, m.id, null, `MANUAL ${m.why}`);
  }
  push("npm", manifest.npm.tier, "verdaccio proxy + storage", null, "size grows with warm");
  push("docker", manifest.docker.tier, `${manifest.docker.images.length} images`, null, "needs docker on PATH");
  push("seal", manifest.seal.tier, "env files, encrypted", null, "needs GLAZE_OFFLINE_KEY");

  if (JSON_OUT) {
    console.log(JSON.stringify({ tier: TIER, root, rows }, null, 2));
    return;
  }
  console.log(`the shelf, tier ${TIER}${root ? `, root ${root}` : ", no root given (plan only)"}`);
  let total = 0;
  let unknown = 0;
  for (const s of SECTIONS) {
    const mine = rows.filter((r) => r.section === s);
    if (!mine.length) continue;
    console.log(`\n${s}`);
    for (const r of mine) {
      const mark = r.chosen ? "*" : " ";
      if (r.chosen && r.size != null) total += r.size;
      if (r.chosen && r.size == null && !/MANUAL|not on this machine|needs/.test(r.note || "")) unknown += 1;
      console.log(`  ${mark} t${r.tier ?? 1}  ${r.id.padEnd(34)} ${gb(r.size).padStart(9)}  ${r.note || ""}`);
    }
  }
  console.log(`\n* = fetched at --tier ${TIER}. About ${gb(total)} measured${unknown ? `, ${unknown} item${unknown > 1 ? "s" : ""} of unknown size` : ""}. Repos and npm storage are small next to that.`);
  if (root) {
    try {
      const st = fs.statfsSync(root);
      console.log(`free on ${path.parse(root).root}: ${gb(st.bavail * st.bsize)}`);
    } catch {
      /* statfs is best effort */
    }
  }
}

// ------------------------------------------------------------------- fill

async function fill(root) {
  const state = loadState(root);
  const run = { started: new Date().toISOString(), tier: TIER, only: ONLY ? [...ONLY] : null, dry: DRY, results: {} };
  const step = async (name, tier, fn) => {
    if (!wants(name, tier)) return;
    say(`\n${name}`);
    try {
      run.results[name] = await fn();
    } catch (e) {
      run.results[name] = { error: e.message };
      console.error(`  failed  ${name}: ${e.message}`);
    }
    saveState(root, state);
  };
  await step("repos", manifest.repos.tier, async () => mirrorRepos(root, state));
  await step("copies", 1, async () => runCopies(root, state));
  await step("kiwix", 1, () => runKiwix(root, state));
  await step("downloads", 1, () => runDownloads(root, state));
  await step("npm", manifest.npm.tier, async () => runNpm(root, state));
  await step("docker", manifest.docker.tier, async () => runDocker(root, state));
  await step("seal", manifest.seal.tier, async () => {
    if (!process.env.GLAZE_OFFLINE_KEY) {
      say("  skip    GLAZE_OFFLINE_KEY not set; run seal on its own when you can type it");
      return { skipped: 1 };
    }
    return seal(root, state);
  });
  run.finished = new Date().toISOString();
  state.runs = [...(state.runs || []).slice(-23), run];
  saveState(root, state);
  const failures = Object.values(run.results).reduce((n, r) => n + (r?.failed || 0) + (r?.error ? 1 : 0), 0);
  say(`\n${DRY ? "dry run" : "done"}${failures ? `, ${failures} failure${failures > 1 ? "s" : ""} above` : ", no failures"}. state: ${rel(statePath(root))}`);
  if (JSON_OUT) console.log(JSON.stringify(run, null, 2));
  if (failures) process.exitCode = 2;
}

// ----------------------------------------------------------------- verify

async function verify(root) {
  const state = loadState(root);
  const ids = Object.keys(state.items);
  if (!ids.length) fail(`nothing recorded in ${statePath(root)}; run fill first`);
  let bad = 0;
  for (const id of ids) {
    const it = state.items[id];
    if (id.startsWith("repo:")) {
      const target = path.join(root, "repos", `${id.slice(5)}.git`);
      const r = flags.deep ? git(["--git-dir", target, "fsck", "--connectivity-only", "--no-progress"]) : { ok: fs.existsSync(path.join(target, "HEAD")) };
      if (!r.ok) bad += 1;
      say(`  ${r.ok ? "ok    " : "BAD   "} ${id}${flags.deep ? " (fsck)" : ""}`);
      continue;
    }
    if (id.startsWith("copy:")) {
      const to = path.join(root, it.to);
      const ok = fs.existsSync(to) && fs.readdirSync(to).length > 0;
      if (!ok) bad += 1;
      say(`  ${ok ? "ok    " : "BAD   "} ${id} ${ok ? gb(dirSize(to)) : "missing or empty"}`);
      continue;
    }
    if (id.startsWith("kiwix:") || id.startsWith("dl:")) {
      if (!it.file) {
        say(`  never  ${id} ${it.lastError || ""}`);
        continue;
      }
      const sub = id.startsWith("kiwix:") ? "kiwix" : manifest.downloads.find((d) => `dl:${d.id}` === id)?.to || "installers";
      const file = path.join(root, sub, it.file);
      if (!fs.existsSync(file)) {
        bad += 1;
        say(`  BAD    ${id} ${it.file} missing`);
        continue;
      }
      const size = fs.statSync(file).size;
      let ok = it.size == null || size === it.size;
      let how = `size ${gb(size)}`;
      if (ok && flags.deep && it.sha256) {
        const sum = await hashFile(file, "sha256");
        ok = sum === it.sha256;
        how = ok ? "sha256 ok" : "sha256 MISMATCH";
      }
      if (!ok) bad += 1;
      say(`  ${ok ? "ok    " : "BAD   "} ${id} ${how}`);
      continue;
    }
    say(`  noted  ${id} ${it.fetched || it.updated || ""}`);
  }
  say(bad ? `\n${bad} problem${bad > 1 ? "s" : ""}` : "\nall present");
  if (bad) process.exitCode = 2;
}

// ----------------------------------------------------------------- status

function status(root) {
  const state = loadState(root);
  const today = localDate();
  const age = (d) => (d ? Math.round((new Date(today) - new Date(d)) / 86400000) : null);
  const rows = Object.entries(state.items).map(([id, it]) => ({ id, file: it.file || it.head || it.version || "", size: it.size ?? null, fetched: it.fetched || null, days: age(it.fetched), error: it.lastError || null }));
  if (JSON_OUT) {
    console.log(JSON.stringify({ root, runs: state.runs?.slice(-3) || [], rows }, null, 2));
    return;
  }
  const last = state.runs?.[state.runs.length - 1];
  console.log(`shelf at ${root}${last ? `, last run ${last.started.slice(0, 10)} tier ${last.tier}${last.dry ? " (dry)" : ""}` : ", never filled"}`);
  let total = 0;
  for (const r of rows) {
    total += r.size || 0;
    console.log(`  ${r.id.padEnd(40)} ${gb(r.size).padStart(9)}  ${r.fetched ? `${r.days}d ago` : "never"}${r.error ? `  ERR ${r.error}` : ""}  ${r.file}`);
  }
  console.log(`\n${rows.length} items recorded, ${gb(total)} measured`);
  const stale = rows.filter((r) => r.days != null && r.days > 45).length;
  if (stale) console.log(`${stale} older than 45 days; the refresh is monthly`);
  try {
    const st = fs.statfsSync(root);
    console.log(`free on ${path.parse(root).root}: ${gb(st.bavail * st.bsize)}`);
  } catch {
    /* best effort */
  }
}

// ------------------------------------------------------------------ serve

function findFile(dir, name) {
  if (!fs.existsSync(dir)) return null;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      const r = findFile(p, name);
      if (r) return r;
    } else if (e.name.toLowerCase() === name) return p;
  }
  return null;
}

async function serve(root) {
  const tools = path.join(root, "tools");
  let exe = findFile(tools, "kiwix-serve.exe") || findFile(tools, "kiwix-serve");
  if (!exe) {
    const zip = path.join(tools, "kiwix-tools_win-i686.zip");
    if (!fs.existsSync(zip)) fail(`no kiwix-tools on the shelf; run: offline.mjs fill --only downloads --root ${root}`);
    const r = spawnSync("powershell", ["-NoProfile", "-Command", `Expand-Archive -LiteralPath '${zip}' -DestinationPath '${path.join(tools, "kiwix-tools")}' -Force`], { encoding: "utf8" });
    if (r.status !== 0) fail(`could not unzip kiwix-tools: ${r.stderr}`);
    exe = findFile(tools, "kiwix-serve.exe");
    if (!exe) fail("kiwix-tools unzipped but kiwix-serve.exe is not in it");
  }
  const zims = fs.existsSync(path.join(root, "kiwix")) ? fs.readdirSync(path.join(root, "kiwix")).filter((f) => f.endsWith(".zim")).map((f) => path.join(root, "kiwix", f)) : [];
  if (!zims.length) fail("no .zim files on the shelf yet");
  const port = String(flags.port || 8080);
  const lan = Object.values(os.networkInterfaces()).flat().find((i) => i && i.family === "IPv4" && !i.internal)?.address;
  console.log(`kiwix-serve on http://localhost:${port}/${lan ? ` and http://${lan}:${port}/ for the LAN` : ""}, ${zims.length} books. Ctrl-C stops it.`);
  const kiwix = spawn(exe, ["--port", port, "--address", "0.0.0.0", ...zims], { stdio: "inherit" });
  let verdaccio = null;
  if (fs.existsSync(npmPaths(root).bin)) {
    verdaccio = await startVerdaccio(root);
    console.log(`verdaccio on http://127.0.0.1:${npmPaths(root).port}/  (npm config set registry http://127.0.0.1:${npmPaths(root).port}/ to use it)`);
  }
  const stop = () => {
    kiwix.kill();
    if (verdaccio) verdaccio.kill();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  kiwix.on("close", (code) => {
    if (verdaccio) verdaccio.kill();
    process.exit(code || 0);
  });
}

// ------------------------------------------------------------------- main

(async () => {
  switch (command) {
    case "plan":
      await plan(resolveRoot({ required: false }));
      break;
    case "fill":
      await fill(resolveRoot({ required: true }));
      break;
    case "warm": {
      const root = resolveRoot({ required: true });
      const state = loadState(root);
      const r = await warm(root, state);
      saveState(root, state);
      if (r.failed) process.exitCode = 2;
      break;
    }
    case "seal": {
      const root = resolveRoot({ required: true });
      const state = loadState(root);
      seal(root, state);
      saveState(root, state);
      break;
    }
    case "unseal":
      unseal(resolveRoot({ required: true }));
      break;
    case "verify":
      await verify(resolveRoot({ required: true }));
      break;
    case "status":
      status(resolveRoot({ required: true }));
      break;
    case "serve":
      await serve(resolveRoot({ required: true }));
      break;
    default:
      fail(`unknown command "${command}". plan | fill | warm | seal | unseal | verify | status | serve`);
  }
})().catch((e) => fail(e.stack || e.message));
