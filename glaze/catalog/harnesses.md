# Harnesses: audit and QA tooling

## Canonical (this repo — improve these, not the cousins)

| Tool | Path | What it does |
|---|---|---|
| Auditor | `glaze/scripts/audit.mjs` | axe + contrast + overflow walk per route, phone and desktop widths. `tools/audit.mjs` is a forwarder; client repos carry pinned copies (`stagecoach/audit.mjs`, `truenorth/tools/audit.mjs`, `campbarber/scripts/audit.mjs`). |
| Width check | `glaze/scripts/width-check.mjs` | The widths the auditor does not visit (320/360…), including container-level overflow the page-level check misses. |
| Motion check | `glaze/scripts/motion-check.mjs` | Samples animations frame by frame and asserts their shape, not their existence. |
| Perf check | `glaze/scripts/perf-check.mjs` | LCP, CLS, JS weight on a throttled connection. |
| Browser loader | `glaze/scripts/lib/browser.mjs` | Shared driver resolution: CHROMIUM_PATH aware, sandbox pin fallback, Windows-safe. New scripts import this, never resolve their own. |
| Plate renderer | `glaze/scripts/plate.mjs` | Renders the Glazed credit plate. |
| Ledger | `glaze/scripts/ledger.mjs`, spec in `glaze/ledger.md` | The prospect and client ledger: one row per business, dated events (scout, send, reply, meet, pay...), one next action, and a digest that flags silent, quiet and overdue rows with the number behind each flag. Reads build fee, needs done and TODO count live from `lib/customOrders.js` instead of copying them. Data file is `contracts-private/ledger.json`, outside the public repo, and the script refuses to write one inside any git tree. Built 2026-09-13 after six sent pitches were on record as unsent. `--json` for an agent. Rows carry a `channel` (warm, cold, visit) so reply rates are never pooled. |
| Closing brief | `glaze/scripts/close.mjs`, same spec | For every row with a letter out and no full payment in: the registry TODOs (parsed from the comments, full text), the needs not done with their WHY, the money, and a follow-up drafted in house voice from the needs verbatim, plus the ledger command to run once it went. `--claude` drafts through the Anthropic SDK (Opus 5, server-side fallbacks) with the "Write like a person" rules as the system prompt and the template as the floor; `--out` writes `contracts-private/closing/<date>.md`; `--email` mails it to Kevin via Resend. Never sends to a client. Shared bones in `glaze/scripts/lib/ledger.mjs`. |

## Field cousins (port on second use; merge when touched)

| Tool | Lives in | What it does |
|---|---|---|
| practice-check + claim-check | `Schulers/tools/` | Parse the PROPOSAL itself and assert the demo delivers every claim in it. Found six empty claims on first run. The pair that keeps a pitch honest; wants generalizing badly. |
| flow-checks | `Schulers/tools/`, `pjs/tools/` | Behaviour checks against a production server — "the checks that would otherwise be somebody remembering." |
| degrade checks | `Schulers/tools/degrade-check.mjs`, `ink-degrade-check.mjs` | Assert the no-JS / reduced-motion state is a finished page, per the motion rules. |
| copy-check | `campbarber/scripts/copy-check.mjs` | Guards against copy that was "fixed" but never actually changed. |
| done | `campbarber/scripts/done.mjs` | Launch gate that prints the measured value with every verdict, because "pass" with no number is a claim. |
| contrast checkers ×3 | `pjs/tools/contrast-sweep.mjs`, `truenorth/tools/contrast.mjs`, `campbarber/scripts/contrast.mjs` | Cousins; whoever needs a fourth merges them into glaze/scripts first. |
| scrim-check | `pjs/tools/scrim-check.mjs` | Text-over-photograph contrast measured on the composite, not the palette. |
| sticky-check | `pjs/tools/sticky-check.mjs` | Two sticky bars measured against each other. |
| motion samplers ×3 | `devine/tools/motion.mjs`, `donna/tools/frames.js`, `campbarber/scripts/motion.mjs` | Pre-port cousins of the house motion check; frames.js pauses via getAnimations() so wall-clock cannot race the animation. |
| leak checks | `donna/tools/leak.js`, `leak.py` | "Is anything lit ahead of the pen?" — pixel-level check that a write-on reveal never shows ink early. |
| share/meta audit | `donna/tools/share.js` | canonical / og:url / twitter audit, written after a site shipped a day with all of them wrong. |
| ux + walk audits | `donna/tools/ux.js`, `walk.js` | Numbers pulled out of a real render; a walk of the one conversion path the site exists for. |
| clock-logic test | `stagecoach/tools/test-tonight.mjs` | Tests time-of-day logic against a supplied clock instead of the real one. |
| filmstrip / shots | `devine/tools/filmstrip.mjs`, `shots.mjs`, `griffin-claw-rebuild/{check,loc,shot}.mjs`, `migas/live.mjs` | Contact sheets and screenshots for looking at rather than measuring. The griffin/migas ones hardcode the sandbox Chromium path — see the portability note in glaze.md. |
