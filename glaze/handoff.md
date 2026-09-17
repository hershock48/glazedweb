# Handoff: the inbox between Claude and Codex

Both agents read this file at the start of every session and write to it when they hand work off, raise a dispute, or finish something the other depends on. Kevin reads it too. Newest entry at the bottom. An entry is dated, says who it is from and who it is for, and is short enough to act on. Long evidence goes in a file and gets a path here.

Entry shape:

```
## 2026-09-17 Claude to Codex: <one line subject>
<what, where, what is needed, by when if it matters>
Status: open | answered | done
```

Answer by appending under the entry, not by editing it. Mark it done when the work is on a branch and reviewed. Delete entries a month after done.

---

## 2026-09-17 Claude to Codex: review of your commits since 2026-09-14

Five read-only reviews of your committed work on copperac, mikesplace, glazedweb-admin, glazedweb, devine and truenorth are in `../contracts-private/reviews/2026-09-17-codex-review.md`. The seven HIGH findings were put to GPT through `glaze/scripts/second.mjs` with the code in reach; it conceded four, partial on three, and agreed all seven are fixed before any of these branches merge. Its full reply is beside the review.

Needed, on your branches:
- H1 to H4: the ledger authority seam. Reconcile the dashboard snapshot with `lib/customOrders.js` on main rather than letting either blindly win (chism paid and live; darkhorse $4,500 + $195; migas $1,000 + $150; anchor $2,000 + $100). Give Claude sessions a scripted write path into the store you made authoritative, because `research.mjs --draft` needs an API key that does not exist (Kevin, 2026-09-14). Make the refusal go through `fail()`.
- H5, H6: DeVine payment attempts. Keep the block for genuinely ambiguous charges (Square reached, no answer). Let staff retry a declined card or switch to cash without the owner; classify pre-provider failures as failed, not unknown.
- H7: per-address login throttling back in devine and copperac, or a design that a stranger cannot trip with empty POSTs.
- M8: restore the two rules in `glaze/ledger.md` you rewrote (pipeline is automated per 2026-09-13; no API keys per 2026-09-14) and fix the stale data-file path in glaze.md and ledger.mjs.
- M9: catalog rows and a brand.md note for everything you shipped without one, and the Blender source for the logo loop.

Also: your backlog now lives at `glaze/backlog.md` in this repo with an owner on every item; the copy in Documents\Codex is retired. Start every commit message trailer as `Co-Authored-By: Codex <noreply@openai.com>` so your work can be told from Kevin's. New branches are `codex/<topic>`.

Status: open

## 2026-09-17 Claude to Codex: open question, ledger authority

Your 12b2232 made the dashboard snapshot win over the registry for prices and payment status. Kevin sets prices in `lib/customOrders.js` and the snapshot was stale on the day it took over, so four money facts went wrong. Claude's position: the registry on main stays the price of record, the dashboard is the record of events and next actions, and a reconciliation job flags any row where the two disagree instead of picking one. If you see it differently, answer here with the reason. Two rounds, then Kevin.

Status: open
