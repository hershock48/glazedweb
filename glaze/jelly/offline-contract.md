# The offline contract

**What this is.** Step 0.4 of the build outline, the one page every piece
of Jelly client and server code is reviewed against from Stage 1 on. It
expands section 5.2 of the outline. It is written from
`notes/odoo-offline-contract.md`, from Toast's public offline platform
guide as the behavior benchmark, and from the studio's own
`order-acceptance`, `order-recovery` and `kitchen-operations` 1.0.0
components. Written 2026-10-29; in force when Codex signs it in
`glaze/handoff.md`.

**Why it exists.** On October 20, 2025 a fifteen-hour cloud outage took
Toast registers down across the country. Toast's own docs show why: its
devices talk to each other through the cloud, checks cannot be closed
offline, and online orders wait for reconnection. Aloha's register kept
ringing because the system of record was in the building. Jelly is a
browser app on the cloud, which inherits Toast's weakness unless the
contract below is kept.

## Definitions

- **Online** means the last ping to the platform succeeded. The client
  pings `/ping` every two seconds while `navigator.onLine` is true and
  treats a failed ping as offline. `navigator.onLine` alone never decides.
- **Durable** means written to IndexedDB and acknowledged by the browser
  before the UI shows success.
- **Synced** means the server acknowledged the record with its version.
- **The hub** is the one box the studio ships at Stage 3, on the
  restaurant's network, running the same app against a local replica.
  Before Stage 3 there is no hub, and the contract says what works
  without one.

## The seven rules

1. **Every record has a client uuid and the server upserts by it.** Order,
   line, modifier, tender, kitchen action, drawer event, clock event.
   Unique per tenant. A create whose uuid already exists is an update. A
   record the server considers final (paid, accepted, closed) is left alone
   on replay and its current state returned.
2. **Writes go into a durable outbox, never memory, and replay in order.**
   The outbox row is `{uuid, kind, payload, base_version, created_at,
   tries, last_error}` in IndexedDB. On reconnect the client replays
   oldest first, one record per request, stops at the first failure that
   is not a connection error, and surfaces that record to the user. A
   connection error leaves the row and waits for the next ping.
3. **The page refuses to leave while the outbox holds money.** A reload,
   sign-out or tab close is blocked with a visible message while any
   outbox row is a placed order, a tender, a refund or a drawer event. The
   `beforeunload` listener is wired and has a test; Odoo defined the set
   and the listener could not be found.
4. **Concurrency is a version check, never last-write-wins.** Every
   editable record carries `version`. A write states the version it saw.
   The server rejects a stale write with 409 and the current row, and the
   client shows the conflict and offers the current row. Two registers on
   one tab never silently overwrite each other.
5. **The app boots from cache with the menu and open work.** The service
   worker precaches the shell, the receipt font and the menu images. The
   menu revision, open orders, open tabs, the drawer session and the
   staff list are mirrored in IndexedDB on every change as an event log,
   not a debounced snapshot, so a crash loses at most the tap in flight.
6. **Cards offline use the processor's offline mode within a limit the
   operator sets, and the agreement says who bears a later decline.**
   Stripe Terminal's S700 and S710 offline mode, the per-transaction and
   total limits set in the workroom, the tender marked `offline = true`,
   and `declined_offline` as a terminal state the owner is told about.
   Cash and pay-later tenders never need the network.
7. **Printing has a path for each state of the world.** Cloud up and
   restaurant up: CloudPRNT as today. Cloud down and restaurant up, before
   the hub: no kitchen paper, the register shows the ticket, the runbook
   says so, and the kitchen works from the screen. Cloud down with the
   hub: the hub is the printers' server and the local system of record.
   Restaurant down (power or LAN): nothing prints anywhere and the
   contract has nothing to say.

## Client responsibilities

- Generate uuids with `crypto.randomUUID()` at the moment a record is
  created, before any network call.
- Append to the IndexedDB event log on every state change, then render.
  Compaction runs after a successful sync, never before.
- Keep one outbox for all writes, including order placement. Odoo runs two
  retry paths and excludes order sync from the first; Jelly has one.
- Show the connection state in the chrome at all times, with the count of
  unsynced records. The owner's phone shows the same count.
- After reconnect, replay the outbox, then pull changed records by
  `version` and `updated_at` since the last sync, then re-render. Incoming
  records never overwrite a local dirty record; the conflict is shown.
- Refuse to leave the page per rule 3, and refuse to open the drawer
  close screen while any tender is unsynced.

## Server responsibilities

- Upsert by `(tenant_id, uuid)` in one statement, with the version check
  in the same statement. Return the row's server version in the ack of
  every write.
- Treat a replayed create of a final record as a no-op that returns the
  record.
- An order whose drawer session or shift has since closed lands in the
  open session for that register, with an audit row saying so. It never
  fails for being late.
- An idempotency key on order placement from the guest side, so a retried
  submit after a dropped response creates exactly one order
  (`order-acceptance 1.0.0`, kept).
- Recompute every price on the server from the stored menu revision the
  client says it used. If that revision is no longer current, reprice
  against the current one and return the differences for confirmation,
  the way `order-quote 1.0.0`'s fresh-price review does today.

## Multi-register

Two registers on one location see each other through a server nudge and a
pull, never by trusting a pushed payload. A tab or table open on two
registers is one order with one version; the second register to write
loses and sees the first's lines. With the hub, the nudge is served
locally; without it, two registers offline from the cloud cannot see each
other's new work and the chrome says so.

## What Odoo does that Jelly does not

- A 300 millisecond debounced snapshot instead of an event log.
- Pending writes in memory with a warning not to reload.
- Two retry paths with order sync excluded from the queue.
- Last-write-wins by `write_date` between registers.
- A reload guard defined but not demonstrably wired.

## What the hub adds at Stage 3

The hub runs the same server code against a local Postgres replica. When
the cloud is unreachable it elects itself the system of record for its
location, serves the registers over the LAN, serves the printers, and
queues its own outbox toward the cloud with the same rules above. When the
cloud returns, the hub replays and the cloud wins only where the version
check says it should, which is never for records the hub created. The
election is explicit and logged. The hub is owned by the restaurant and
sits in the hardware line at cost.

## Tests the contract requires

Each is a script on the demo tenant and later on a real floor, and each
is a gate check in the outline.

| Test | Pass |
|---|---|
| Drop the network mid-submit of a guest order | Exactly one order exists after reconnect |
| Kill the browser tab with three unsynced kitchen actions | All three exist after reopen and sync in order |
| Place ten orders offline on a register, reconnect | Ten orders, ten acks, ten versions, no duplicates |
| Edit one tab on two registers | One write succeeds, the other sees a conflict with the winner's lines |
| Reload with an unsynced tender | Blocked with the message; allowed after sync |
| Close the drawer with an unsynced cash sale | Refused until the sale syncs |
| Pull the uplink for a scripted hour with the hub (Stage 3) | Every tab closed, every tip reconciled, Z matches the drawer |
| Stripe Terminal offline sale within the limit, reconnect | Captured; above the limit refused at the reader |

## Acceptance

A component is accepted against this contract when its README names which
rules it touches, its tests include the rows above that apply, and the
reviewer has run them on the demo tenant. Money code waits for a full
review window. Signed in `glaze/handoff.md` by Codex before Stage 1 code
starts.
