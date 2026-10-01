# The ledger

**One row per business, from scouted to retained, and the digest that reads
it every morning.** The tool is `glaze/scripts/ledger.mjs`. The data is
the private studio dashboard when the local authority marker below is present.
The original `../contracts-private/ledger.json` remains an archive outside this
public repo.

## Studio authority (September 2026)

The local migration retains original account snapshots in the dashboard and
uses `ledger.json.authority.json` beside the archived ledger to point to the
current `glazedweb-admin/data/studio.json` storage envelope. The marker contains
version 1, mode `studio-local`, and a file path relative to the marker. It and
all account data stay private; neither belongs in this public repository.

With that marker, digest/show, closing briefs, scouting comparisons and research
briefs read the current dashboard. Ledger add/log/next/set, research --write and
selector --commit write to that same store through the session adapter. They use
the dashboard's exclusive file lock and revision check. Install the admin change
first: the reader requires adapter ID `glazedweb-studio-session` and the
`SESSION_WRITER_VERSION` (1) exported by glazedweb-admin/lib/session-writer.mjs,
which the admin repeats as `SESSION_ADAPTER.version`; both numbers are checked.
A missing, non-integer or different version refuses the write before touching
account data, and the refusal names both versions and which repo to update.
An optional `adapter` path in the private authority marker resolves relative to
the marker; it lets test storage live outside the application data directory. A stale command fails
with a short message; it cannot replace newer dashboard work. Missing or invalid
authority storage fails closed. The archived ledger remains unchanged.

Kevin's prices in lib/customOrders.js on main remain the price of record. The
dashboard records events, payments, independent monthly billing and next actions.
An imported registry snapshot is evidence of its import date, not permission to
override a newer owner edit. Compare a pinned main registry with
glazedweb-admin/scripts/reconcile-facts.mjs --registry <pinned-registry.mjs>.
Review each difference and use its --plan preview followed by --apply --expect
<sha256> to reconcile. A private backup and a dated account decision preserve the
source and prior value. Newer receipts and billing facts are not erased by an old
registry flag. Digest, show and closing briefs also check current GitHub main on
every run. `REGISTRY DIFFERS` prints both saved and registry values;
`REGISTRY NOT CHECKED` reports network, rate-limit or parsing failures explicitly.
Ambiguous aliases are flagged too. No read changes either record. Closing drafts
are withheld while that account differs or the check is unavailable.

The check has a five-second timeout, uses the public GitHub API without a token,
and records the source blob SHA and check time. Run `npm ci` in glazedweb first:
Next supplies the parser. Downloaded registry code is parsed as literal data,
never executed. An unavailable check never silently falls back to a local copy.

The full pipeline decision from September 13 still stands: automate finding and
qualifying prospects, research, proposal and demo preparation, follow-up drafting,
and the recorded handoff into a client account. September 14's runtime rule also
stands: use the signed-in Claude Code or Codex subscription, with no model API keys
or separate API charges. Research defaults to session briefs; --brief <slug> and
--write <slug> --from <private-result.json> cover the single-account path. --draft
--json produces batch briefs without a model call. Selection writes prospects
directly; sessions log confirmed sends, replies, meetings and payments directly.
Research sources survive dashboard edits as source records, and a proposed price
does not become an accepted agreement or payment. Proposal/demo generation and
reviewed sending stay on the full-pipeline backlog; this repair restores the
working data connection instead of declaring that pipeline manual.

Kevin still approves client-facing material and outreach before it is sent.
Recording a send reports something that happened; it does not send a message.
These commands create no charges and contact no model API. Standalone test ledgers
require --fixture with --file while the production marker is active. Do not remove
the marker to fork production records. A future hosted authority needs its own
authenticated adapter; the current marker explicitly supports the local pilot.

---

## Why it exists

On 2026-09-13 every pitch note in the account said "not sent." Six proposals
had gone out. Five owners had replied interested. Copper was a confirmed
client waiting to pay, DeVine had paid half, True North had been met twice
with a first payment due the next day. None of it was written anywhere a
session could read, so the session reported the funnel as empty and planned
work to fix a problem that did not exist.

The registry (`lib/customOrders.js`) knows the deal. The client files know
the durable facts. Nothing knew the **state**: who was sent what, who
answered, who paid, and when. A pipeline that selects, researches, pitches
and learns has nothing to learn from until that is recorded, and every
success metric Kevin wants to measure is a query against it.

**The rule that goes with the file:** when Kevin says a thing was sent,
answered, met, paid or passed, it gets logged in the same turn, with the
date. A state that lives only in his head is a state the next session will
get wrong.

---

## Where the data lives, and why not here

The glazedweb repo is public. Account records stay in the ignored private
glazedweb-admin/data/studio.json envelope. The pointer and original archive stay
in contracts-private. Never commit any of those files or reconciliation backups.
An unmigrated standalone fixture still refuses writes inside a Git tree unless
--allow-git is explicit; it cannot override an active authority marker.

---

## The stages

```
scouted > audited > built > sent > replied > meeting > confirmed
        > paid-part > paid > live > retained
```

plus two side exits, `dormant` (we parked it) and `passed` (they said no).

Events move a row along:

| Event | Stage after | Use it when |
|---|---|---|
| `scout` | scouted | A name scored on the prospecting card. |
| `audit` | audited | The Scout pass is written up with proof links. |
| `build` | built | Proposal, demo, launch page or a build pass shipped. |
| `send` | sent | The letter went to the owner. |
| `reply` | replied | They answered. Put what they said in the note. |
| `meet` | meeting | A call or a visit. |
| `confirm` | confirmed | They said yes, money not yet moved. |
| `pay-part` | paid-part | A deposit or half. |
| `pay` | paid | Build fee paid in full. |
| `launch` | live | On their domain. |
| `retain` | retained | Monthly running past the first cycle. |
| `pass` | passed | They declined. Record why. |
| `park` | dormant | We stopped. Record why and when to look again. |
| `touch` | unchanged | A follow-up we sent. This is how "quiet" resets. |
| `decision` | unchanged | A registry TODO got answered. |
| `note` | unchanged | Anything else worth a dated line. |

A stage never moves backwards by accident. A `meet` logged on a confirmed
client keeps it confirmed. `pass` and `park` always apply. `--stage` forces.

---

## The commands

From the glazedweb repo root:

```bash
node glaze/scripts/ledger.mjs                      # the digest
node glaze/scripts/ledger.mjs digest --json        # the same, for an agent
node glaze/scripts/ledger.mjs show darkhorse       # one row, every event
node glaze/scripts/ledger.mjs log griffinclaw reply "wants the classic look, asked about the edit cap" --date 2026-09-12
node glaze/scripts/ledger.mjs log darkhorse touch "second note, the Wix menu finding"
node glaze/scripts/ledger.mjs next darkhorse "park if silent" --due 2026-09-27
node glaze/scripts/ledger.mjs add masondepot --name "Mason Depot Diner" --town Mason --score 9
node glaze/scripts/ledger.mjs set migas contact="Jake Example" aliases=migas-voice
```

`add` takes `--name` (required), `--town`, `--repo`, `--host`, `--contact`,
`--build`, `--monthly`, `--stage`, `--score`, `--note`. `set` accepts `name
town repo host contact stage aliases build monthly score`.

---

## What the digest shows

**NEEDS A TOUCH** first. A row lands there when any of these is true, and
the number is printed so the flag can be argued with:

| Flag | Rule |
|---|---|
| `DUE TODAY` / `OVERDUE Nd` | The row's `next.due` has arrived. |
| `silent Nd` | Stage `sent`, seven or more days since the send, no reply. |
| `quiet Nd` | Stage replied, meeting or confirmed, five or more days since the last contact event. A `touch` resets it; an admin edit or note does not. |
| `quiet Nd` | Stage paid-part, fourteen or more days. |
| `unpitched Nd` | Scouted with a score of 7 or more, three weeks old, never audited. |

Then every row is grouped by stage, oldest first, with the last event and age,
the reconciled build and monthly prices, paid status, missing client items and
studio tasks. Build payment and live delivery are normalized for older imported
rows. Monthly billing stays separate. A proposed quote is still a proposed quote.

Last, **NOT IN THE LEDGER**: every registry slug and every `glaze/clients`
file with no row and no alias. That list is the backlog of businesses whose
state nobody has written down. Add a row, or an alias if the row exists
under a different slug (`griffinclaw` carries `griffin-claw`).

---

## The channel

Every row carries `channel`: `warm`, `cold` or `visit`. The first ten pitches
were texts to owners Kevin already knew, and five of six replied. That is a
warm number. A letter to a stranger has a different base rate, and a letter
followed by walking in has a third. The channel is set on the row, never
inferred, and reply and close rates are read per channel or not at all.
Pooling them would make the cold approach look like it works before it has
been tried.

```bash
node glaze/scripts/ledger.mjs set schlenkers channel=cold
node glaze/scripts/ledger.mjs add masondepot --name "Mason Depot Diner" --channel visit
```

---

## The closing brief

`glaze/scripts/close.mjs`. For every row with a letter out and no full
payment in (stages sent, replied, meeting, confirmed, paid-part), one brief:

- **Why today.** The digest's flags, plus "no touch since their reply",
  which is the state every interested prospect was in on 2026-09-13.
- **Money.** Reconciled account prices and separate payment/billing facts, with a current registry comparison and visible differences.
- **Kevin still has to get.** The `TODO` comments on the registry row, parsed
  out of `lib/customOrders.js` with their full text. These are the facts the
  agreement cannot be signed without.
- **They still owe.** The project needs not yet done, each with its WHY, in
  the row's own order, which is already priority order.
- **The follow-up.** A drafted email: the first four asks as a numbered list,
  lifted verbatim from the needs, the build page as the one link, the
  agreement link, Kevin's name and number. For a silent `sent` row it is a
  second touch with the demo link and a plain way to say no.
- **After it goes.** The exact `ledger.mjs log ... touch` command, and a
  `decision` command if TODOs are open.

```bash
node glaze/scripts/close.mjs                 # the rows that need a touch today
node glaze/scripts/close.mjs --all           # the whole call sheet
node glaze/scripts/close.mjs --slug anchor   # one business
node glaze/scripts/close.mjs --out           # also write contracts-private/closing/<date>.md
node glaze/scripts/close.mjs --email         # also email the brief to Kevin (RESEND_API_KEY)
node glaze/scripts/close.mjs --json          # for an agent
```

The template never invents an ask. --json includes the sourced brief and house
voice instructions for the signed-in session to draft from. The old --claude
model API option is disabled. Model API credentials and separate API charges are
not part of this pipeline. --out saves a private brief without sending anything.

**Nothing in it sends to a client.** `--email` mails the brief to Kevin's
own inbox from `ledger@glazedweb.com`. The follow-up is copied, sent by a
person, and then logged as a `touch`. That is deliberate: the day a follow-up
goes out unread is the day one goes out wrong, to a brewery in the middle of
an ownership case.

**To run it every morning** without a hand on it, a Windows scheduled task
is one line. It is Kevin's to create, not a session's:

```bash
schtasks /Create /SC DAILY /ST 07:30 /TN "Glazed closing brief" /TR "\"C:\Program Files\nodejs\node.exe\" C:\Users\hersh\Glazedweb\glazedweb\glaze\scripts\close.mjs --out --email"
```

`--email` needs `RESEND_API_KEY` in the task's environment. Without it, drop
the flag and read `contracts-private/closing/<date>.md`.

---

## What the ledger is not

Not the client file. Durable facts, decisions, permissions and retired lines
stay in `glaze/clients/<client>.md`. The ledger holds dated events and one
next action.

Not the registry. Scope and numbers stay in `lib/customOrders.js` and the
ledger reads them. If a price shows up in a ledger note it is a quote of the
registry, not a second home for it. The dashboard carries the reviewed copy
used by account workflows; the comparison and reconciliation above prevent
that copy from silently replacing Kevin's price of record.

Not a CRM. Twenty rows and a text digest. The day it needs a screen is the
day a second person reads it.

That is the original scope rule, retained pending Kevin's doctrine ruling.
Kevin subsequently requested the private studio dashboard; it and session
commands now share one account store. This implementation does not silently
replace that rule with a broader CRM or unattended outreach policy.

---

## Seeded 2026-09-13

Ten pitched or signed businesses and nine scouted names, from the memory
notes and `glaze/prospecting.md`. The ten are `warm`; Dark Horse's channel
is blank because nobody recorded how the letter reached them. Send and reply dates for the six September
pitches were not recorded when they happened, so those events carry the
seeding date and say so in the note. The age the digest prints for them is
therefore an underestimate, which is the safe direction. Nine client files
had no state known to the seeding session and appear under NOT IN THE
LEDGER until Kevin fills them in.
