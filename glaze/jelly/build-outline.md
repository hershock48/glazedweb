# Jelly build outline

**What this file is.** The step-by-step path from the ordering code the
studio owns today to a register that does what Toast does for a small
Michigan restaurant and leaves out what operators resent. Kevin, 2026-10-28:
"reconstruct our version of Toast, but better," drawing on the nine
open-source patterns in `glaze/research/pos-oss-teardown-2026-10-28.md`
and the three research documents on his Desktop (the Toast and Aloha study,
the investor view, and the Jelly platform proposal and plan, October 2026).
This outline does not replace the Jelly plan. The plan says what and why;
this file says in what order, built on what, borrowed from where, and done
when.

**Product-first.** Kevin, 2026-10-29. Jelly is built as a product against
a made-up demo restaurant, a pizza tavern with a bar and two terminals,
stage by stage. Real restaurants plug in as tenants when they want a piece.
The named restaurants below are the ones expected to stand at each gate,
never the ones the product is shaped for. Take every restaurant name out
and every step stays the same. Kevin, same day: "build the product first
and test and test and test it before I ship it to an actual customer."
Nothing reaches a real restaurant until the demo gate for that stage has
passed.

**How to use it.** Every step has a checkbox, an owner lane, the component
it builds on, the source it reads first, and a "done when" that a stranger
could verify. Work the stages in order. Never start a step whose stage gate
is not passed. When a step changes, change this file in the same commit.
Same contract as every glaze file: if this disagrees with the code, the
code is right, fix the file. Status marks: `[ ]` not started, `[~]` in
progress, `[x]` done and verified, `[!]` blocked, with the blocker named.

**Lanes.** Kevin, 2026-10-29: "forget Codex." Claude builds Jelly end to
end, code and words, and the handoff entries that asked Codex to sign the
offline contract or review the schema are closed as not needed. Kevin
owns prices, agreements, hardware purchases, and every decision in
section 8. Money code still waits for a proper review window, never a
stand-in; the reviewer is a fresh Claude session reading the contract and
the spec, not the session that wrote the code.

---

## 1. What we are building

A register, a kitchen, online ordering and an owner's workroom that are one
system, built for one restaurant at a time, kept close, and run as one
multi-tenant platform behind custom sites. The guest orders on the
restaurant's own site. The order lands on the kitchen screen and the
printer. Staff key phone orders on the same screen. The bartender opens a
tab with one tap. The owner changes a price on her phone and every screen
has it within seconds. At close the register prints the day, the tax and
the tips, and the accountant's numbers are a download.

**Acceptance criteria are the promise page** (Jelly plan, section 3). Each
line is a product decision and this outline names the step that makes it
true:

| Promise | Made true by |
|---|---|
| You own the hardware | 2.3 hardware list; 5.1 hub as the one thing we ship |
| You can leave | 1.6 tenant export; agreement copy |
| You can read the bill | 6.2 books; 2.5 Connect fee as a stated number |
| Your guests pay the order fee only if you choose | 1.5 fee as a totals line with an operator switch |
| Edits are instant | 1.2 workroom as the price source; 4.4 register reads the menu on every load |
| The register works when the internet does not | 5.2 offline contract; 5.1 hub |
| A person answers | 6.3 runbooks and remote screen before the counter gate |
| Your data is yours and safe | 1.3 two-factor on owner login; 6.4 verified call before bank changes; 4.8 audit rows |

---

## 2. Principles that decide arguments

1. **Software-forward.** Runs in a browser on hardware the operator owns.
   We ship exactly one box, the hub, and buy everything else off the shelf.
   Kevin, 2026-10-28: competitors lock with the terminal; that is their
   weakness and our edge. Square is the standing exception already in this
   lane; the counter thesis of September still governs there.
2. **One copy.** Jelly is one repo on the Scooplist org model and every
   restaurant is a tenant. Client repos keep the site and stop carrying
   runtime. The finish line is a restaurant onboarded with no code written
   for it.
3. **The menu is the one price source.** Mike's model, ruled in the
   comparison matrix. The orderable board, the register and the site derive
   from one document with a revision and a history.
4. **The server is the till.** Client prices are display only. Quotes are
   recomputed server side in integer cents, tax in BigInt, as
   `order-quote 1.0.0` already does.
5. **Everything is idempotent.** Client uuid on every record, upsert by
   uuid, one Postgres statement per acceptance, revision checks on every
   action. `order-acceptance 1.0.0` and `kitchen-operations 1.0.0` are the
   existing proof.
6. **Offline is a contract, not a feature.** Section 5.2 states it. Every
   component from stage 1 on is written against it, even before any
   register code exists.
7. **The fee is a line.** The 99 cents is its own persisted total with its
   own tax, labelled to the guest, switchable by the operator, never inside
   a tax total. That is the disclosure Toast failed in 2023.
8. **Read, then write our own.** Open-source code is read for design and
   re-expressed in TypeScript against our schema. Each component's README
   carries a one-line clean-room note naming what was read. Odoo is LGPL-3
   and Floreant is MRPL 1.2: never copied. TastyIgniter is MIT: a direct
   port is allowed with the notice. Nothing under `odoo/enterprise` is
   opened.
9. **Reporting is where we beat them.** Toast cannot save a custom report
   or export order lines; Aloha's reporting is split across four tools.
   Every component emits the rows the report needs on day one, and the
   report is designed, not generated.
10. **A gate is a gate.** The DeVine rule. A phase is used daily by a real
    restaurant before the next is funded. No skipping for location count.

---

## 3. The sources, and what each gives

| Source | Pattern | Feeds step | Read first |
|---|---|---|---|
| Floreant | Drawer pull as the Z report column list; `drawerResetted` sweep so nothing double counts | 3.3 cash and close | `DrawerPullReport.hbm.xml`, `PosTransaction.hbm.xml` |
| Odoo Community | Offline contract: uuid on every record, upsert by uuid, ordered replay, reload guard; the two weaknesses to avoid (memory queue, last-write-wins) | 5.2 offline contract, adopted in 1.4 | `data_service.js`, `pos_store.js`, `models/related_models/` |
| Odoo Community | IoT Box: Pi image, hardware proxy over HTTP, receipt as raster to ESC/POS or Star, drawer as a printer command, LAN printing survives the cloud | 5.1 hub | `addons/iot_box_image`, `iot_drivers/printer_driver_base.py`, `hardware_proxy_service.js` |
| Odoo Community | Session, order, line, payment model | 0.3 data model note; 3.1 register schema | `pos_session.py`, `pos_order.py`, `pos_payment.py`, `pos_restaurant.py`, `restaurant_order_course.py` |
| Odoo Community | Preset as the channel: taxes, pricing and computed time slots bound in one object | 1.5 channel and slots; 3.5 Michigan engine | `pos_self_order/models/pos_preset.py` |
| TastyIgniter | Cart conditions as persisted total lines | 1.5 fee as a line | `ti-ext-cart/src/CartConditions/*.php` |
| TastyIgniter | Shared option catalogue with per-item required, min, max, free quantity; order snapshotting | 1.2 menu model | `MenuItemOption.php`, `MenuOption.php`, `MenuItemOptionValue.php` |
| Floreant | Pizza model: sections, multipliers, price by size, crust and order type, section and multiplier recorded on the ticket modifier | 1.2 pizza matrix | `MenuItem.hbm.xml`, `TicketItem.hbm.xml` |
| Floreant | Void reasons as a table, `voidedBy`, action history rows | 4.8 discounts, comps, voids | `ActionHistory.hbm.xml` |
| Toast developer docs (public) | Data model for menus, modifier groups and checks; the offline platform guide as the behavior benchmark | 0.3; 5.2 | `doc.toasttab.com` platform guide and menus API |
| Toast and Aloha study | What to recreate (handheld to kitchen loop, one-tap tab, general-contractor onboarding) and what to invert (terms, rate changes, add-on stacking, support) | Everywhere; 6.3 support | Desktop study, sections on complaints and on the Homer tavern |
| DeVine (ours) | Payment engine with prepared, processing, unknown, completed, failed states; counter-side card and cash | 3.2 Stripe Terminal adapter | `payment-engine.ts`, `payment-attempts.ts`, `PayControls.tsx` |
| Scooplist (ours) | Multi-tenant org model, slugs, PINs, signed handoff | 1.1 tenant record | the scooplist repo |
| Mike's Place and Copper (ours) | The newest workroom, the ordering pins, the kitchen board, CloudPRNT | Stage 1 throughout | the two repos and `glaze/catalog/` |

---

## 4. The stages and their gates

```
Stage 0  Reading pass and foundations        no gate; two to three weeks
Stage 1  Jelly repo, first tenant, ordering   gate: a month of real orders beside Aloha
Stage 2  The counter                          gate: a month of every to-go order, accountant signs tax + tips
Stage 3  The floor                            gate: Friday + Saturday with the cable pulled, every tab closed
Stage 4  The second restaurant on the register gate: onboarded with no code written for it
```

Every stage is built against the demo restaurant first and its gate has
two parts: the demo runs it end to end, then a real restaurant runs it for
a month. Stage 1 is Phase 0 of the Jelly plan. Stage 2 is Phase 1. Stage 3
is Phase 2 and remains a decision taken at Stage 2's gate, with a real
restaurant asking rather than us offering (plan section 12). Stage 4 is Phase 3. A second
restaurant on ordering alone can go up as soon as Stage 1 passes (plan
section 13, item 6), and that is where the Scooplist test is first run.

---

## Stage 0. Reading pass and foundations

No product code. The output is design notes a stranger could build from,
the empty repo, and the books. Two to three weeks alongside client work.

- [x] **0.1 Design note per source.** One page each in `glaze/jelly/notes/`,
  nine notes, named after the row in section 3. Written 2026-10-29; each
  carries its unverified items under Open questions. Each note: the exact
  fields or behaviors observed with file and line, what we take, what we
  change, the clean-room line. Lane: Claude writes, Codex reads before
  building the step that cites it. Done when: all nine exist and each is
  cited by at least one step below.
- [~] **0.2 Tenant record design.** One table, one slug, keyed off by the
  registry on glazedweb.com, the platform, the ledger, the workroom login
  and the books. Scooplist's org model is the shape. Drafted 2026-10-29 in
  `notes/tenant-record.md`; waiting on Kevin's read. Done when: the schema
  is written, the six places a client exists today are listed with how each
  will point at the record, and Kevin has read it.
- [~] **0.3 Data model note.** Written 2026-10-29 in `notes/data-model.md`;
  waiting on Codex review via the handoff. Our schema for session, order, line,
  line modifier (with section and multiplier), payment, tender type, drawer
  pull, employee, shift, void reason, action history, menu, option
  catalogue, channel preset, tax category, totals line. Laid beside Odoo's
  model, Floreant's tables, Toast's public menu and check model, DeVine's
  payment attempts and Copper's order model. Done when: every field has a
  reason, and the integer-cents and uuid rules are stated on every money
  and every record column.
- [~] **0.4 Offline contract written.** Section 5.2 of this file expanded
  into a one-page spec that stage 1 code is reviewed against, at
  `glaze/jelly/offline-contract.md` since 2026-10-29. Done when: Codex has
  signed it in the handoff (entry open).
- [~] **0.5 The Jelly repo exists.** On the Scooplist org model, Next 16,
  Postgres-or-memory store with production refusing memory writes (Copper's
  two stores), the connection module cut as its own component. Empty of
  features. Done when: a tenant can be created and signed into on the demo
  host. 2026-10-29: `hershock48/jelly` (private) exists and the walk passes
  on a local production build. The Vercel project `jelly` (GlazedWeb team)
  deploys main to jelly.glazedweb.com since 2026-10-29 with
  `JELLY_PLATFORM_HOSTS` set; it answers nothing until Kevin sets
  `JELLY_MASTER` in the dashboard and attaches a Neon database, then seeds.
  The connection module is not yet cut as its own catalog component.
- [ ] **0.6 The books.** Five lines (subscription, payments margin, order
  fees, hardware at cost, services) and one row per restaurant, before the
  first Cascarelli's $150 lands in November. Designed so the lines come off
  Stripe's export, not a spreadsheet. Lane: Kevin with Claude. Done when:
  November's entries exist in that shape.
- [ ] **0.7 Michigan rules read from a live machine.** RAB 2026-2 on
  prepared food, MCL 436.1537a as amended after the December 2025 sunset,
  the MLCC happy-hour rule text, the 2026 tipped-wage schedule. Findings
  with sources into `glaze/jelly/notes/michigan.md`. The accountant meeting
  booked. Lane: Kevin reads or Claude in a session with a browser; the
  accountant rules. Done when: the note exists and the accountant has seen
  it.
- [ ] **0.8 Pricing made one thing.** Copper was pitched at $0 monthly for
  ordering; the Jelly plan proposes $99 plus $29 a terminal; the per-terminal
  line reads as add-on stacking against the promise page. Kevin rules before
  the next restaurant is pitched. Done when: the registry carries the ruling.
- [ ] **0.9 The demo restaurant.** Tenant one is made up: a pizza tavern
  with a bar, twenty drafts, a banquet room, two terminals and a kitchen
  printer, seeded with a full menu including a pizza matrix, a draft grid
  and cocktails to go. Every stage is built and demonstrated against it
  first. It is also the pitch demo from here on, so a pitch costs a config
  and copy, not a repo. Done when: the demo tenant exists on the demo host
  with its seed data and a one-page script that walks a visitor through
  ordering, the kitchen and the workroom. 2026-10-29: Mill Street Tavern is
  seeded by `tools/seed-demo.mjs` (six sections, 25 items, a three-size,
  fourteen-topping pizza matrix, eight drafts with variants, cocktails to
  go, hours, channel settings) and `docs/demo-script.md` walks Stage 0 and
  names what each later stage adds; waits on the demo host like 0.5.

---

## Stage 1. Jelly repo, first tenant, online ordering

Phase 0 of the plan. Built against the demo restaurant (0.9) first. The
first real tenant expected is Cascarelli's (paid 2026-10-28, ordering
wanted from January 2027), with Mike's Place behind it. In a real
restaurant the existing register keeps ringing the room; ordering runs
beside it and prints at the pass.

- [ ] **1.1 Tenant record and platform routing.** Build 0.2. One Vercel
  project for the platform, one host per tenant (`order.<domain>` or a
  platform subdomain), the client site static and linking in. Builds on:
  Scooplist orgs, `workroom-session 1.0.0`, Copper's login limiter packaged
  as a component. Done when: two tenants exist on the demo host with
  separate logins and separate menus and neither can see the other.
- [~] **1.2 Menu as the one price source, with the catalogue and the pizza
  matrix.** Spec and test table in `specs/compute-totals.md` (2026-10-29);
  code waits on Codex. Builds on: `menu-write 1.0.0`, `option-pricing 1.0.0`,
  `content-cas 1.0.0`, Mike's workroom menu editor. Borrows: TastyIgniter's
  shared option catalogue (required, min, max, free quantity, overridable
  value prices) and order snapshotting; Floreant's sections and multipliers
  for half and quarter toppings with a configurable half-topping rule, and
  the section and multiplier recorded on every ticket modifier so the
  kitchen ticket reads left and right. Done when: Cascarelli's real menu,
  entered by Ryan, prices a half-and-half large with an extra topping on
  one side exactly as he would price it by hand, in a test the repo pins.
- [~] **1.3 Workroom.** Hours, 86, pause and busy dial, events, photos, the
  Scooplist taps handoff, and the party form landing as a lead. Two-factor
  on the owner login. Built 2026-10-29 in `jelly` (`/workroom`,
  `/workroom/menu`, `/workroom/hours`, `/api/workroom/*`): the whole-menu
  editor with the pizza matrix and a validated, revision-checked save; the
  kitchen hours and ordering settings; the fee switch; Today with the
  day's money lines and printer health. 86, pause and the dial are on the
  kitchen board, which the owner opens from the chrome. Walked on a
  production build. Not done: events, photos, the taps handoff, the party
  form as a lead, two-factor. Builds on: Mike's workroom (newest copy),
  `owner-save`, `owner-request`, `event-cas`, `event-fields`, `event-photo`
  1.0.0. Done when: Ryan changes a price on his phone and the orderable
  board shows it inside ten seconds without a deploy.
- [~] **1.4 Ordering, guest side, written to the offline contract.** Flow,
  screens, words and funnel in `specs/ordering-guest.md` (2026-10-29).
  Built the same day in `jelly` (proxy routing, bundle, slots, idempotent
  placement, the five screens, confirmation, funnel) and walked on a
  production build: case A placed by API and by browser, replay by uuid
  returned one order. Still owed: the cart in IndexedDB rather than
  localStorage, and the dropped-network test as an automated check. Pickup,
  order-ahead, the 21-plus flag off by default (alcohol online waits for
  0.7). Builds on: `order-quote`, `order-acceptance`, `order-recovery`
  1.0.0 and Mike's ordering. Adopts now from 5.2: client uuid on every
  order, upsert by uuid, and the reload guard. Done when: a guest order
  placed with the network dropped mid-submit lands exactly once.
- [~] **1.5 Channel presets, capacity slots, and the fee as a line.** Fee
  and tax stages specified in `specs/compute-totals.md`; slots in
  `specs/ordering-guest.md`. Built 2026-10-29: slots computed from the
  kitchen hours with capacity per interval (`src/lib/ordering/slots.ts`,
  tested), the fee as its own taxable row with the operator switch as a
  tenant setting. Still owed: the channel profile as a row per channel
  rather than the document's `ordering` block, and the accountant's
  answer on tax on the fee (0.7).
  Borrows: Odoo's preset binding taxes, pricing and timing per channel,
  slots computed from an interval and a per-interval count, never stored;
  TastyIgniter's conditions as persisted total lines. The 99 cents is one
  such line with its own tax, labelled, waived under a floor, switchable by
  the operator to absorb, half to the house. Done when: the receipt shows
  the fee on its own line with its tax, the operator switch works, and the
  Michigan tax on the fee matches the accountant's answer from 0.7.
- [~] **1.6 Tenant export.** Menu, orders, customers and reports in open
  formats from the workroom on demand. This is the "you can leave" line
  and it is cheapest to build before there is much data. Built
  2026-10-29 in `jelly`: `/api/workroom/export` returns the tenant as one
  JSON file (tenant row without secrets, locations, every menu revision,
  every order with its receipt, the owner's settings; PIN hashes, printer
  tokens and board state left out), and `tools/create-tenant.mjs --import`
  loads it into an empty tenant through the master route (a second import
  into a tenant with a menu is refused). Walked on a production build: the
  demo tenant exported with four orders and reimported into a new tenant
  whose reports read the same four. Done when: a tenant's full export
  reimports into an empty tenant. Open: the export is a download, not a
  scheduled copy; customers are inside the orders, not a separate list.
- [~] **1.7 Kitchen board and printer, certified on paper.** Built
  2026-10-29 in `jelly` (`src/lib/kitchen/`, `/t/[slug]/kitchen`,
  `/api/kitchen/*`, `/api/printer/[printerId]`): operation ids with
  fingerprints, revision checks, placed to accepted to ready to done,
  owner-only cancel with a reason, the 86 list, busy dial and pause
  reaching the guest menu, the CloudPRNT poll, fetch and confirm cycle
  with paper at the pass accepting the order. Walked on a production
  build with curl as the printer. Not done: no physical printer has
  polled it, and the owner printer review (reprint, skip) is not built. Builds on:
  `kitchen-operations`, `kitchen-request`, `printer-jobs`, `printer-review`
  1.0.0. One Star CloudPRNT printer bought and installed at the pass in
  Homer running the demo before any real order. Staff key phone orders on
  the same screen so every ticket looks the same, which is the first step
  of the counter at no extra cost. Done when: a real ticket prints at the
  pass, paper confirms acceptance, and the no-paper and printer-offline
  cases behave as the runbook says.
- [~] **1.8 Notifications.** Builds on: `notification-outbox`,
  `notification-provider`, `notification-request` 1.0.0 with the Resend
  adapter. Guest confirmation, ready text, owner daily close summary. Done
  when: the daily summary arrives at close with the day's orders, fees and
  tax. Built 2026-10-29 in `jelly` (`src/lib/notify/outbox.ts`,
  `/api/notify/drain`): the outbox with leases, idempotency keys,
  backoff and review; the guest confirmation and ready note by email;
  no_provider shown on Today until `RESEND_API_KEY` is set. Not done: the
  owner's daily close summary (with 1.10), the owner's close-out of a
  reviewed message, and any SMS, which needs a provider that does not
  exist yet.
- [~] **1.9 Stripe Connect, the money spine.** Built 2026-10-29 in
  `jelly` (`src/lib/stripe/`, `src/lib/payments/attempts.ts`,
  `/api/order/intent`, `/api/stripe/webhook`, `/order/pay/return`,
  `/workroom/payments`): Standard connected accounts onboarded from the
  workroom, direct charges with the application fee, attempts keyed by
  the order uuid with DeVine's finality, placement from the snapshot by
  webhook or return page. Keyless paths walked on a production build. Not
  verified: the card flow end to end, which waits on the platform keys
  and a Connect webhook endpoint in Vercel (Kevin); the five-line books
  read off Stripe. The glazedweb Stripe account
  becomes the Connect platform; Cascarelli's existing Stripe account is the
  connected account; `application_fee_amount` carries the studio's half.
  Builds on: DeVine's payment engine states (port, Stripe adapter new).
  Done when: one real order's money is traced from the guest's card to the
  restaurant's payout and the studio's fee, and the five book lines can be
  read off Stripe for that order.
- [~] **1.10 Reports, version one.** Designed in `specs/reports-v1.md`
  (2026-10-29). Hourly sales, item mix, channel split
  (phone versus online once 1.7 runs), fee, tax and tip lines separated,
  repeat guests, saved reports, raw order-line CSV, and the ordering funnel
  (landing, menu, cart, checkout, placed, with referrer) as a first-party
  event log the tenant owns, because the whole flow is on one domain and
  Toast's is not. Designed against the Toast and Aloha complaints in the
  study. Built 2026-10-29 in `jelly` (`src/lib/reports/`, `/workroom/reports`,
  `/api/workroom/reports`, `/reports/export`, `/reports/saved`): five
  screens (sales, items, kitchen timing, guests, funnel) over one range
  from six presets or two dates in the location's zone, per location or
  all, saved views by name as a tenant setting, order-line and order CSV
  of the rows behind the range, every screen computed from the order rows
  as written (pure functions under test, 6 cases). Walked on a production
  build with four orders through the kitchen. Lane: Claude. Done when:
  Ryan opens it on his phone and finds the number he asked for without
  help. Open: card-path orders (webhook or return page) do not write the
  placed funnel step yet; returning means ordered before the range, so a
  guest with two orders in one day reads as first time. The daily close
  mail landed 2026-10-29 (`src/lib/notify/close.ts`, queued by the cron
  drain half an hour after the kitchen close, same compute as the
  screen, 5 tests), walked on the production build with a moved close
  hour.
- [ ] **1.11 Ordering exhibit signed.** Add-on price per 0.8, the fee, whose
  Stripe account, refunds, chargebacks, the second printer. Lane: Kevin.
  Done when: signed, before the first commit of 1.4 reaches production.
- [~] **1.12 Runbook for the pass, version one.** Written at
  `runbooks/pass.md` (2026-10-29), rewritten the same day to say what
  Jelly does rather than what it might: paper out, printer offline while
  the cloud is up, cloud down while the restaurant is up, a card payment
  that did not finish (a ticket after a failed card cannot happen, since
  a card order is written only after the payment succeeds; what remains
  is an attempt that needs a look, now listed on Payments), a refund from
  the owner's phone (built: Refund and Cancel on Today behind the PIN
  with a reason, card refunds through Stripe on the restaurant's account
  with the fee share refunded, counter refunds written on the order).
  Cases 1, 2 and 5 walked by Claude on the production build 2026-10-29;
  case 3 reasoned from the code (the board's lost-connection line, the
  guest's recovery check); case 4 waits on Stripe keys. Money code:
  the refund route owes a fresh-session review. Done when: someone other
  than Kevin has walked each case on the demo.

**Gate, two parts.** First the demo: every step above demonstrated end to
end on the demo tenant, including a ticket on a real printer. Then a real
restaurant: its owner has entered real prices, a real online order has
printed at its pass and been picked up, and it has run ordering for a
month beside its register with the capacity slots and the pause control
used in anger. Cascarelli's through Super Bowl Sunday (February 2027) is
the expected case. The second real restaurant goes up with no code written
for it, and that is the first Scooplist test.

---

## Stage 2. The counter

Phase 1 of the plan. Built and demonstrated on the demo restaurant first,
then run for real: every to-go order, phone and walk-in, rung on ours while
the existing register still owns the dining room. Three to four months,
sequential, with Stage 1 running in production the whole time.

- [ ] **2.1 Touch order entry.** The draft grid with pint, pitcher and
  growler as one-tap variants; pizza by size and crust with the matrix from
  1.2; open checks with seat numbers (Floreant's `seatNumber` on every
  line, which Odoo lacks). Builds on 1.4's order model. Done when: a
  bartender rings ten real to-go orders in a row without touching a
  modifier dialog.
- [ ] **2.2 Stripe Terminal adapter.** S700 or S710 readers, the platform
  fee through Connect, tips on the reader, Stripe's own offline card mode
  with a stated limit the operator sets. Builds on: DeVine's engine and
  attempt repository ported; the adapter is new. Before building, read
  Stripe's Terminal offline limits from the live docs; the study could
  not. Lane: Codex, money code, full review window. Done when: card, cash,
  split tender and a PIN-gated refund each reconcile to the drawer pull.
- [ ] **2.3 Cash and close.** Drawer kick through the Star printer, blind
  counts, paid-outs, bleeds, and the Z report built column by column from
  Floreant's drawer pull: begin cash, net sales, sales tax, cash and card
  receipts, cash tips, charged tips, tips paid, payouts, bleeds, refunds,
  cash back, accountable, to deposit, variance, voided tickets. Every
  ticket and tender carries a not-yet-pulled flag swept by exactly one pull.
  Odoo's session states (opening control, open, closing control, closed)
  are the state machine. Done when: a month of drawers balance and the
  accountant signs the report against a month of Aloha's.
- [ ] **2.4 Tips.** On the reader, on the receipt, declared at clock-out,
  pooled by rule, the per-shift tip-credit check against Michigan's 2026
  schedule, and the inputs for IRS Form 8027. No open-source register does
  declaration or pooling; this is ours from the rules in 0.7. Done when:
  the tip report for a pay period matches payroll.
- [ ] **2.5 Michigan engine.** Tax categories per item and per channel
  under the prepared-food rules from 0.7, carried on the preset from 1.5.
  A to-go alcohol item class that forces the sealed-container flag, blocks
  original containers unless the SDM flag is set, and prompts for ID.
  Happy-hour guardrails as configuration. Done when: the accountant signs
  the tax report, and alcohol to go online is switched on only after 0.7
  confirms the statute.
- [ ] **2.6 Employees.** PINs, clock in and out, roles, a labor report.
  Floreant's attendance and payroll reports are the reference list; Odoo's
  three rights levels per register are the permission shape. Done when: a
  pay period's hours export matches what the owner paid.
- [ ] **2.7 Discounts, comps and voids.** Manager PIN, reason codes as a
  table, audit rows with time, action, description and performer. The
  kitchen's audit contract already writes rows like this. Done when: every
  void on a month's Z traces to a reason and a person.
- [ ] **2.8 Reports, version two.** Prep time per station from the kitchen
  timestamps, server productivity, menu usage, the hourly heat, both
  locations on one screen for a two-site tenant. Done when: Bates's
  two-location case is designed even if Bates has not signed.
- [ ] **2.9 Runbooks and the remote screen.** Before this gate, not after:
  a screen that shows us what the restaurant sees without a visit, the
  runbook set, and one contractor who has deployed the system end to end
  and fixed an incident. Done when: the contractor runs a Saturday close on
  the demo alone.

**Gate, two parts.** On the demo: a scripted day of to-go orders, cash and
card, closes with a Z that balances to the cent and a tip report that
matches the script. In a real restaurant: every to-go order for a month,
cash and card, rung on ours, with the accountant signing the tax report and
the tip report against a month of the old register. Then, and only then,
section 8 decision 9: whether the studio funds the floor, and with it which
of the two businesses this is.

---

## Stage 3. The floor

Phase 2 of the plan. A decision, not an assumption, taken at Stage 2's gate
with a real restaurant asking. Built on the demo first. Three to four
months.

- [ ] **3.1 Tabs with pre-authorization.** One-tap tab open against a card
  hold, tab to table transfer, merge, hold and fire per ticket. No
  open-source register does pre-auth; Floreant's `authorizable` and
  `captured` fields on a transaction and its `barTab` flag are the only
  reference, and Stripe Terminal's manual capture is the mechanism. Done
  when: a Saturday's tabs all close to the right card.
- [ ] **3.2 Tables and seats.** Floor plan, split by seat and by item,
  coursing where the kitchen wants it. Odoo's floors and tables and courses
  are the reference; its split-by-line-only is what we exceed. Done when:
  a six-top splits four ways by seat in under a minute.
- [ ] **3.3 The hub.** The one box we ship: a fanless mini PC on the
  restaurant's network, running the same app against a local replica,
  electing itself the hub when the cloud is unreachable, serving the
  printers and the drawer. Odoo's IoT Box is the design: hardware proxy
  over HTTP, receipt as raster to ESC/POS or Star, drawer as a printer
  command, LAN printing that survives the cloud. Ours is owned by the
  restaurant, not rented. Done when: 5.2 holds with the cable out.
- [ ] **3.4 Second terminal behind the bar.** Multi-register sync by
  revision check, not last-write-wins. Done when: two registers ring the
  same tab without a lost line.

**Gate, two parts.** On the demo: a scripted night with the hub's uplink
pulled, every tab closed, every tip reconciled, the Z matching the drawer.
In a real restaurant: a Friday and a Saturday with the internet
deliberately pulled and the same result. The old register is unplugged
after this, not before.

---

## Stage 4. The second restaurant on the register

Phase 3 of the plan.

- [ ] **4.1 Per-tenant tax and alcohol configuration** from the preset.
- [ ] **4.2 Hardware provisioning and the spare-parts shelf.**
- [ ] **4.3 The ops console in glazedweb-admin:** tenants, orders, printer
  health, subscription state, support notes.
- [ ] **4.4 The one-page policy and pricing page on the site.**
- [ ] **4.5 The demo tenant kept current** with every shipped stage, since
  it is the pitch (0.9).

**Gate.** The second restaurant onboarded onto the register with no code
written for it.

---

## 5. Cross-cutting specifications

### 5.1 The hub

One piece of hardware, shipped at Stage 3, designed at Stage 0. A Pi-class
or fanless mini PC on the LAN. It runs the same app against a local
replica, serves `/hw` to the browsers on the LAN, drives the printers and
the drawer, and elects itself the system of record when the cloud is gone.
CloudPRNT polls the cloud by design, so the hub is also what keeps paper
moving. Owned by the restaurant. Odoo charges $173 or $30 a month for its
box and requires a subscription for production use; ours is in the hardware
line at cost.

### 5.2 The offline contract

Written at Stage 0, adopted by ordering at Stage 1, proven at Stage 3.

1. Every record carries a client-generated uuid. The server upserts by
   uuid: a draft re-sent is an update, a paid or accepted record is left
   alone.
2. Writes go into a durable outbox in IndexedDB, never memory, and replay
   in order on reconnect, one record at a time.
3. The page refuses to reload or sign out while the outbox holds paid or
   accepted records, and says so.
4. Multi-register sync is by revision check with a visible conflict, never
   last-write-wins on a timestamp.
5. The menu and open checks are mirrored locally and the app boots from
   cache.
6. Cards offline use the processor's own offline mode within a limit the
   operator sets, and the operator is told in the agreement who bears a
   later decline.
7. When the hub exists, it is the local system of record and the printers'
   server; when it does not, printing needs the cloud and the runbook says
   so.

### 5.3 Reporting, the bar we set

Saved custom reports and raw order-line CSV on day one. Hourly sales, item
mix, channel split, prep time per station, fee, tax and tip lines
separated, repeat guests, both locations on one screen, a text at close.
The ordering funnel from landing to placed order, with referrer, as events
in a table the tenant owns on the platform, never a rented script on their
site. Toast's web traffic report shows where orders came from; ours shows
where they were lost, because landing, menu, cart and checkout are one
domain. Designed on the phone first. Every component emits its rows at build time;
no report is reconstructed later.

### 5.4 Security

Two-factor on every owner login. A verified call before any bank or payout
change. Per-address login limits packaged from Copper. Full edit history in
the workroom. Card data never touches our app: semi-integrated readers only.

---

## 6. Operations that run beside the code

- [ ] **6.1 Hardware list** at cost with a named vendor for each: readers,
  tablets, the Star printer, the drawer, the hub. Bought in the order the
  stages need them: printer at Stage 1, readers and drawer at Stage 2, hub
  at Stage 3.
- [ ] **6.2 Books** per 0.6, kept monthly from November 2026.
- [ ] **6.3 Support** structured for a small studio: a named person, the
  general-contractor onboarding checklist, remote diagnostics, a quarterly
  visit, no ticket queue the owner can see. The five-minute promise priced
  or softened before it enters an agreement (section 8, decision 10).
- [ ] **6.4 Agreement amendments** for ordering (Stage 1), the counter
  (Stage 2) and the floor (Stage 3), each written by Claude for Kevin's
  read before the stage's first production commit.
- [ ] **6.5 Ledger entries** for every send, reply, meeting and payment as
  they happen.

---

## 7. What we know we do not know

- Stripe Terminal's offline limits on the S700 and S710. Read before 2.2.
- Whether the alcohol-to-go statute is in force after December 2025. Read
  in 0.7; alcohol online stays off until then.
- RAB 2026-2's exact prepared-food standard and how the fee is taxed. 0.7
  and the accountant.
- Cascarelli's and Copper's NCR and Toast contract end dates. Asked in the
  next sitting; they set the register's real timeline.
- How many of Cascarelli's guests will move from the phone to the site.
  Adoption is a project with Ryan's name on it, not an assumption.
- Whether Mike's ordering pins lift cleanly into Jelly or carry Mike's
  chrome. The first week of 0.5 tells; if they do not, the fifth copy
  ships for Cascarelli's and consolidation follows a month later.
- Multi-tablet reliability under a weekend rush. Only Stage 3's gate
  answers it.

---

## 8. Decisions for Kevin, in the order they block

1. The name on the box. Jelly is in the code.
2. The promise page, line by line, since it becomes the agreement.
3. Pricing made one thing (0.8): the ordering monthly, the terminal line,
   the fee split and the waiver floor. Into the registry.
4. Stripe Terminal as the register's rail, which this outline assumes.
5. Which real restaurant is first onto each stage. Cascarelli's for
   ordering and Mike's Place behind it are the expected answers.
6. Who reads the Michigan rules and when the accountant meeting is.
7. The hardware purchases at each stage.
8. The ordering exhibit for Cascarelli's (1.11).
9. The floor, at Stage 2's gate and not before, and with it which business
   this is: a dozen or two restaurants kept close, or a count that grows
   past what one studio can know by name.
10. The support promise: five minutes during service hours priced, or
    softened to a person who knows the restaurant.

---

## 9. Tracking

Progress is the checkboxes in this file, changed in the commit that does
the work. Open questions go to `glaze/backlog.md` with an owner. Handoffs
between the agents go to `glaze/handoff.md`. Every component enters
`glaze/catalog/` in the commit that builds it, with Cascarelli's as the
first manifest. Reviews are logged with `score.mjs`. When this outline and
the Jelly plan disagree, this outline is the newer and wins on order; the
plan wins on why; the code wins on both.
