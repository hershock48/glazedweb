# The shelf: a local copy of the internet the studio uses

Kevin, 2026-09-17, after asking whether a "backup internet" could be built
while there is still time: the answer is that the internet's value is the
other endpoints, and none of those can be copied. What can be copied is the
part the studio reads and installs from. That copy is the shelf. It lives on
its own drive, never inside a repo, and `glaze/scripts/offline.mjs` fills and
refreshes it from `glaze/offline.manifest.json`.

Two situations it is for. The pipe is gone (Marshall FiberNet down for days, a
regional outage, power back before the network). Or the pipe is up and cannot
be trusted (upstream compromised, a package or a model pulled, an account
driven by something other than Kevin). In both, the shelf plus the local AI
rig is a working studio: every repo, every model, the reference books, the
installers to rebuild a machine, and an npm registry that installs every
project without asking anyone.

Whatever this file says about sizes, names and dates is a snapshot. The
script measures; if they disagree, the script is right.

---

## What is on it

Three tiers. `--tier N` takes everything at or below N. Sizes measured
2026-09-17 by `offline.mjs plan --tier 3`.

| Tier | What | About |
|---|---|---|
| 1 | Bare mirrors of every sibling repo (33 today), working copy when there is no remote | a few GB |
| 1 | LM Studio model weights, the verified kit | 96 GB |
| 1 | OneDrive Desktop (client source images), Documents/Codex | 2 GB |
| 1 | DevDocs books: JavaScript, Node, npm, React, Next, TypeScript, CSS, HTML, DOM, HTTP, Tailwind, PostgreSQL, SQLite, Git, Bash, nginx, Docker | 45 MB |
| 1 | iFixit, WikiMed, WikEM, NHS medicines, Wiktionary, Wikipedia mini (lead sections) | 28 GB |
| 1 | kiwix-tools and Kiwix Desktop, Node LTS msi, Git for Windows, Ventoy, Ubuntu desktop ISO, Ollama, VS Code | 8 GB |
| 1 | Michigan OpenStreetMap extract | 300 MB |
| 1 | Verdaccio npm proxy, storage filled from every lockfile | grows with `warm` |
| 1 | Every repo env file, one encrypted blob | KB |
| 2 | Wikipedia full text, no pictures | 49 GB |
| 2 | Docker Desktop installer and saved images: postgres, registry, gitea, minio, mailpit, pihole | 3 GB |
| 3 | Wikipedia with pictures | 119 GB |
| 3 | Stack Overflow | 107 GB |
| 3 | Project Gutenberg | 206 GB |

Tier 1 is about 135 GB. Everything is about 620 GB. A 1 TB SSD holds all
of it today; 2 TB leaves room for the models to grow.

Three things cannot be fetched by script and are printed as `manual` by
`plan` and `fill`: the LM Studio installer (no stable link), the Windows 11
ISO (behind a form), and Organic Maps' Michigan pack (downloaded inside the
phone app). Drop the first two in `installers/`.

Not on the shelf, on purpose: MDN and wikiHow (no longer published as Kiwix
books), Common Crawl (petabytes), the Internet Archive (not downloadable),
anything that is a service rather than a file (Stripe, Vercel, GitHub, Gmail).
Hosted client sites keep running on Vercel while Marshall is dark; when the
whole region is dark, nobody is ordering online either.

---

## The drive

- Its own external SSD. `fill` warns when the root is on the same volume as
  the home folder, because a copy on the disk that fails with the original is
  not a backup. The warning is not a refusal, so a first fill on C: to test
  is fine.
- Never inside a git tree. The script refuses.
- Self-describing. `state.json` on the drive records every item, its file,
  size, SHA-256 and the date it was fetched. The repo is one of the things
  being restored, so the drive cannot depend on it.
- Plugged in only for the refresh and the emergency. A drive that is always
  mounted is exposed to whatever the machine catches.

Layout under the root: `repos/`, `models/`, `assets/`, `kiwix/`,
`installers/`, `tools/`, `maps/`, `npm/`, `docker/`, `sealed/`, `state.json`.

---

## First fill

From the glazedweb repo root, drive plugged in as E:.

```bash
node glaze/scripts/offline.mjs plan --root E:/glaze-offline --tier 1
```

Read the plan. Every line resolves to a real file name and size before a
byte moves, and anything upstream that cannot be found says `UNRESOLVED`.

```bash
node glaze/scripts/offline.mjs fill --root E:/glaze-offline --tier 1
```

Repos, copies, books, installers, the npm proxy, in that order. Every
download resumes if interrupted, lands as `.part`, and is renamed only after
the SHA-256 (Kiwix, Node, Ubuntu), MD5 (Geofabrik) or size check passes.
Run it again after a failure; finished items are kept.

```bash
node glaze/scripts/offline.mjs warm --root E:/glaze-offline
```

Starts the proxy, runs `npm ci --ignore-scripts` against it for every repo
with a lockfile, stops it. Afterward the storage folder holds every tarball
every project needs. One repo took 13 seconds on the first run.

```bash
node glaze/scripts/offline.mjs seal --root E:/glaze-offline
```

Needs `GLAZE_OFFLINE_KEY` set in the shell, 12 characters or more, typed by
Kevin. Gathers the env files listed in the manifest from every repo and
writes one AES-256-GCM blob under `sealed/`. The key is used once and never
written anywhere. On 2026-09-17 only one repo carried an env file locally;
the rest of the secrets live in Vercel, so before the shelf is a real
restore path, pull each project's env from the Vercel dashboard into its
`.env.local` and seal again.

Then `--tier 2`, then `--tier 3` when the drive has the room and the night is
free. `--only kiwix` and `--pick wikipedia_en_all` narrow either command to
one section or one item.

Set `GLAZE_OFFLINE_ROOT` in the environment and every command drops
`--root`.

---

## Monthly refresh

Same `fill`. Kiwix books, Node, Git, Ventoy and Ubuntu are resolved by name
each run, so a newer file is fetched and the old one is left in place until
`--prune` is added, which deletes the older file of the same family after
the new one verifies. Plain URLs (Ollama, VS Code, Docker, the map) are
refetched when the remote size changes. Model weights and assets are
robocopied on top; `--prune` there mirrors deletions too.

Task Scheduler, monthly, drive plugged in:

```bash
node C:\Users\hersh\Glazedweb\glazedweb\glaze\scripts\offline.mjs fill --root E:/glaze-offline --tier 2 --prune
```

`status` shows every item, its age in days, and flags anything older than 45
days. `verify` checks presence and size; `verify --deep` re-hashes every
book and installer and runs `git fsck` on every mirror.

---

## Using it with the cable out

- **Books.** `offline.mjs serve --root E:/glaze-offline` unzips kiwix-tools
  the first time, starts `kiwix-serve` on port 8080 bound to every
  interface, prints the LAN address, and starts the npm proxy beside it.
  Every phone and laptop in the house reads Wikipedia from that address.
  Kiwix Desktop (in `tools/`) opens the same `.zim` files without a server.
- **Installing a project.** With `serve` running:
  `npm config set registry http://127.0.0.1:4873/` and `npm ci` works in any
  warmed repo. Verdaccio serves from storage when its upstream is
  unreachable. Undo with `npm config delete registry`.
- **A repo.** `git clone E:/glaze-offline/repos/copperac.git` gives every
  branch and tag as of the last refresh. Uncommitted work was never on the
  shelf; commit before the refresh.
- **Secrets.** `offline.mjs unseal --root E:/glaze-offline --restore <dir>`
  with the same `GLAZE_OFFLINE_KEY` writes the env files under `<dir>`. It
  lists names and variable counts, never values, unless asked to restore.
- **A machine.** Ventoy onto a USB stick, copy the Ubuntu ISO (and the
  Windows ISO once it is in `installers/`) onto it, boot. Then Node, Git,
  VS Code, Ollama or LM Studio from `installers/`, models from `models/`.
- **Maps.** Organic Maps on the phone with Michigan downloaded is the
  reader. The `.osm.pbf` on the shelf is the raw data for anything else.
- **The local model.** Already on the machine and in `models/`. Kevin's
  verdict stands: grunt work only, never client copy. Offline it is the
  only model, so keep the one best general model current rather than a
  shelf of specialists.

---

## The edge, which the shelf does not cover

The shelf answers "the pipe is gone". "The pipe cannot be trusted" also
needs the edge hardened, and none of this is a script:

- Hardware keys or passkeys on Google, GitHub, Vercel, Stripe and the bank.
- Branch protection on every hershock48 repo. Open since 2026-09-17; the
  most realistic agent takeover is the studio's own Codex thread with write
  access to six dirty trees.
- Lockfiles committed everywhere, which they are, and `npm ci` rather than
  `npm install` in every build.
- A firewall with an allowlist mode that can be flipped on. Pi-hole plus
  Unbound covers DNS on a day-to-day basis. The WAN kill switch is the
  cable.
- A UPS on the box, so the shelf can be reached when the power flickers with
  the network.

---

## Verified 2026-09-17

On a scratch root on C:, against the live upstreams: two Kiwix books fetched
and SHA-256 verified; kiwix-tools and the Michigan extract fetched and MD5
verified; two repos mirrored, one from GitHub and one from a working copy
with no remote; OneDrive Desktop robocopied; `verify --deep` clean including
`git fsck`; `seal` then `unseal --restore` round-tripped one env file, and a
wrong passphrase was refused; `serve` answered 200 on the LAN address;
Verdaccio 6.10.3 installed to the shelf and `warm --pick pjs` filled 35
tarballs in 13 seconds. Every tier 3 item resolved to a current dated file.
Not exercised: a full tier 1 fill (no drive yet), Docker images (Docker is
not installed), and a fill on a real external drive.
