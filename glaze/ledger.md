# The ledger

**One row per business, from scouted to retained, and the digest that reads
it every morning.** The tool is `glaze/scripts/ledger.mjs`. The data is
`../contracts-private/ledger.json`, outside this repo on purpose.

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

The glazedweb repo is public. A row that says "paid half" or "sent, silent"
about a named business is not. The data file sits next to the paper
agreements in `contracts-private/`, a local folder that is not a git repo.
The script refuses to write a ledger inside any git working tree unless
`--allow-git` is passed, because the first time that goes wrong it goes
wrong in public.

Override the path with `--file` or `GLAZE_LEDGER`.

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
| `quiet Nd` | Stage replied, meeting or confirmed, five or more days since the last event. A `touch` resets it. |
| `quiet Nd` | Stage paid-part, fourteen or more days. |
| `unpitched Nd` | Scouted with a score of 7 or more, three weeks old, never audited. |

Then every row grouped by stage, oldest first within a stage, with the last
event and its age, and the **registry** column: build fee, `paid` once it is,
needs done N of M from the project block, and the count of `TODO` comments
on the row. Those come from `lib/customOrders.js` at run time and are not
copied into the ledger; a prospect with no registry row yet shows the
ledger's own price as a fallback marked `(no row)`. Facts live in one place.

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
- **Money.** Build, monthly, paid or not, accepted or not, from the registry.
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
node glaze/scripts/close.mjs --claude        # draft with Claude Opus 5 instead of the template
node glaze/scripts/close.mjs --email         # also email the brief to Kevin (RESEND_API_KEY)
node glaze/scripts/close.mjs --json          # for an agent
```

The template is house voice by construction and never invents an ask. With
`--claude` the same brief goes to the model with the "Write like a person"
rules from `glaze/standards.md` as the system prompt and the template as the
floor; a draft that comes back with an em dash or without a subject line is
discarded for the template. Credentials resolve the SDK's normal way
(`ANTHROPIC_API_KEY` or an `ant auth login` profile); with none it says so
and stops. The SDK is a devDependency of this repo.

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
registry, not a second home for it.

Not a CRM. Twenty rows and a text digest. The day it needs a screen is the
day a second person reads it.

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
