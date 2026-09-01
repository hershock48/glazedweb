# DeVine's Flowers & Botanicals

## What they are

Retail florist in Marshall, Michigan: 800 Industrial Rd., corner of Industrial
and Linden. Everyday arrangements, weddings, sympathy work, plants, and a
business "greening" service. Four names on the team page, no titles published.
Repo: `devine`.

## Terms

None yet. Prospect. The proposal lives at the root of `devine.glazedweb.com`,
the concept site at `/demo`. A meeting with the owner is set for late August
2026; the build and the IRIS research below are the material for it.

## Decisions on file

- **They run IRIS (onlyiris.com) as their POS**, and the owner is not attached
  to it. Her words, from a text in August 2026: "I'm not really a fan but this
  industry has a big gap in floral software. It's very archaic... The front end
  is not very user friendly and boring. It feels clunky. It could help with stem
  management and shrink, better analytics, etc... it feels like they promise
  more then they are delivering and I think it's pricey. The floral groups I
  belong to struggle with a good software system as well. Very little
  flexibility." She offered to walk through IRIS in person.
- **The IRIS facts, researched 2026-08-21**: installed desktop app
  (Windows/Mac), licensed per computer, "60% usable" offline, $40/mo/computer
  support add-on, four gem-named pricing tiers with no public prices
  (~$79/user/mo per Capterra). Reviewed weak spots match hers: QuickBooks sync,
  reporting depth, support consistency. Its website-builder module is the
  weakest part and the part our build replaces first.
- **CORRECTION from the owner, by text 2026-08-21 (supersedes the guesses
  above about her usage)**: she uses IRIS for her WEBSITE ONLY, at **$230 a
  month, with no card processing**. "Absolutely no wire services." She does
  not track stems at all: "Shrink is minimal but I wish I had numbers. We
  don't have visibility to this." All wedding work is offline in **Canva and
  spreadsheets**; "funerals are a different model from weddings"; she wants a
  model that takes flowers + stem counts and produces an accurate **quote**,
  for both. On the floral groups: "all over the board," will explain in
  person. And the strategic line, verbatim: "I would like an all encompassing
  tool not companion. I feel this is doable with a new software system. It
  just doesn't exist yet. :)"
- **The agreed path, decided with Kevin 2026-08-21, in three gated phases**:
  Phase 1, storefront with live order intake (email ticket to the shop, payment
  on the confirm call, no card online). Phase 2, an internal order board plus
  stem/shrink/recipe-costing tracker for the shop, adapting the pjs ordering
  pattern. Phase 3, productize the Phase 2 tool as a subscription app for other
  shops ONLY if DeVine's uses it daily and other shops turn up wanting to pay
  for it. The full-POS question (payments hardware, wire services) is
  deliberately deferred, not declined.
- **Order intake design**: prices come from the catalog on the server, never
  from the browser. An off-list delivery zip warns and still submits; the ticket
  carries a flag line ("a near miss is a phone call, not a wall"). A failed send
  is told to the customer with the phone number and a prefilled mailto, never
  swallowed: an order that reaches only a log is a customer waiting for flowers
  nobody is making.
- **No delivery fee, minimum, or cutoff is invented anywhere.** Their site
  publishes none of the three. Checkout says the subtotal is settled on the
  confirm call. All three are questions for the owner.
- **The quote builder built 2026-08-21, same day, on a PROVISIONAL model** at
  `/workroom/quotes`: wedding and funeral templates as separate models (her
  distinction), per-stem flower pricing prefilled from purchase history,
  flowers × markup (default ×3) + labor % (default 25%) + hardgoods +
  delivery/setup, 50% wedding deposit from their published process, a
  wholesale buy list, and a client print view that carries no stem counts or
  markup and only published policies. Everything about the model is a dial,
  and the whole thing is a stand-in to be rewritten from her real wedding
  spreadsheet and funeral worksheet after the meeting. A quote-validity line
  was deliberately NOT printed; she has to supply one if she has one.
- **Phase 2 built 2026-08-21, before the meeting, as demo material**: the
  workroom at `/workroom` (order board; phone orders written up at the
  counter, web orders landing by themselves) and `/workroom/stems` (purchases,
  shrink with reasons, recipes, week report). Decisions that should survive:
  orders bucket on the REQUESTED date, not the order's age; a phone order is
  born "confirmed" because the shop is already talking to the customer; a web
  order reaches the board only if its email actually sent; and the tracker
  never prints a dollar figure it was not given — unknown costs and missing
  recipes say so. Storage is the pjs two-backend pattern (Neon Postgres via
  Vercel, in-memory fallback with a visible warning). The gate is a PIN
  (shop phone's last four until WORKROOM_PIN is set), a gate not a vault:
  nothing behind it moves money.

- **She rings counter sales on Square, on the basic (free) plan** (owner,
  by text, relayed 2026-08-31). The free plan is fully sufficient for
  everything built here: Square does not gate API access (OAuth, catalog,
  webhooks, Payments API) by plan, and Payments API processing is
  2.9% + 30c on every plan. The 3.3% rate that would apply to Square's
  own hosted checkout on the free plan never applies, because our checkout
  is our own. No upgrade to recommend, ever, unless she wants Square's own
  software features.
- **Square OAuth + platform fee plumbing built 2026-08-31**: the register
  link's production path. A Glazed-owned Square developer app
  (SQUARE_APP_ID/SECRET; account kevin@glazedweb.com) that HER account
  authorizes at /api/square/connect, grant stored in Neon (square_oauth
  table), lazy 30-day token refresh, sandbox env-token path unchanged.
  All scopes requested at connect time including
  PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS, so turning on online card payments
  later (with the 99c app fee riding to the Glazed account) is a deploy,
  not a reconnect. lib/square/payments.ts holds the dormant payment helper
  and the fee mechanics; nothing calls it yet, by phase-plan design. The
  99c fee must be named in her agreement before cards go live: disclosed
  and boring beats discovered.
- **The whole sandbox loop was VERIFIED end to end 2026-08-31**, Kevin
  driving the dashboards: OAuth connect (grant stored in Neon), webhook
  subscription (payment.created + payment.updated, signature key live),
  and a $20 virtual-terminal test charge that landed as a square_sales
  row three seconds after it was rung. Two traps recorded for the next
  person: the Application Secret is on the app's OAuth page (the
  Credentials page offers an Access Token in the same slot, and pasting
  that 401s the token exchange after a clean-looking Allow), and every
  Vercel env-var save needs a redeploy after it before the runtime sees
  it. The developer app is named "devine", one app per client. Later the
  same day the catalog push went 57-for-57 into the sandbox register
  (zero strays) and an itemized sale (invoice route; the sandbox web
  dashboard has no register app, so its "Charge card" only does custom
  amounts) came back through the webhook with its SKU mapped to
  slug "wing-and-a-prayer": every pipe is now exercised, including the
  one that lets counter sales decrement stems. Production flip remains
  gated on her signing: her one technical step is a single Allow click
  on her own Square login.
- **The letter was revised 2026-08-22** to match the built reality: checkout
  described in the present tense (payment on the confirming call now, Stripe
  as the option later, matching her no-card-processing operation), a new
  section four for the workroom with its stand-ins declared, and the cost
  section carrying the comparison sourced to her own number: $230 a month
  against our $150, $960 a year less after the build year, $11,000 against
  $13,800 over five, ownership against receipts. **A pricing call is baked
  in: the workroom is written as included in the $150 monthly.** Kevin can
  veto with one edit; it stands as a plain product decision about what the
  monthly buys, nothing more (see Retired for the framing that was cut).

- **She said YES at the meeting (Kevin, 2026-08-31), and the paper went up
  the same day**: /agreement on the pitch host is a clickwrap acceptance of
  the Client Agreement v1.0 (incorporated by reference, never restated)
  plus her Exhibit A. Terms: $2,000 build with $1,000 on acceptance and
  balance at launch, $150 monthly including store and workroom, 2 hours of
  edits a month, $125/hour beyond scope quoted in advance, timeline agreed
  in writing later. Deal facts live in devine `src/lib/agreement.ts`; the
  letter repeats them in prose and is named there as the surface that
  cannot read the constant. Acceptance record: email to AGREEMENT_TO
  (default kevin@glazedweb.com) is THE record, DB row the duplicate.
- **The letter's fee promise was corrected before she signs** (Kevin's
  ruling, same day): the old Stripe take-nothing-on-top bullet now says
  cards run on her own Square account and names the 99c customer-paid
  service fee, written as first-pass prose with no correction framing.
  A session's suggestion that Kevin owed her a heads-up text about the
  change was RETIRED by Kevin the same day: she barely read the original
  letter, the current letter and the agreement both name the fee plainly,
  and that is the disclosure. Do not resurrect the heads-up obligation.

- **The seasonal engine, built 2026-08-31 from the owner's own observation**
  (relayed by Kevin: the change of seasons is a huge part of her sales). The
  demo turns with the calendar on its own: four premade seasons as the base
  (accent token, hero copy, featured six) and six flower holidays highlighted
  as each approaches, every date computed rather than stored, rendered per
  request in the shop's timezone. Holiday bands state the day and its date and
  link into her catalog, and deliberately carry no cutoffs or availability
  claims, because she has published none. Seasonal copy and picks are Glazed's,
  on the README checklist for her veto; spring, summer and winter each lean on
  three photographed plants until the remaining product photos land. The footer
  preview row (cookie via `/api/season`) is the demo move for the meeting:
  flip her site through the whole year across the table.

- **The register/board seam, verified in code 2026-09-01**: a Square ring
  never creates a board order (createOrder is called only by web checkout
  and the phone write-up), and money is never double-counted (Square is
  the only money ledger; board subtotals are worksheet numbers). But STEM
  consumption counts both board orders marked made/done AND recipe-mapped
  Square sales with no linkage, so an arrangement written on the board and
  ALSO rung by its product tile decrements stems twice. The counter rule
  that resolves it, part of her training: product tile = leaving the store
  now; custom amount = the work is on the board. Custom-amount rings carry
  no line items and cannot decrement, and the inventory page counts them
  visibly. SUPERSEDED same day by Kevin's ruling to close the seam now:
  board orders settle their own money in the workroom (PayControls on each
  order card: Take card via the Web Payments SDK, or Record cash), creating
  a real Square order + payment in her account with reference_id set, so
  the webhook links the sale, marks the order paid, and inventory counts
  stems exactly once. Researched first: unpaid API orders collected at the
  POS are explicitly unsupported (Square staff, dev forum 2026-08-18), so
  the register-side version was never viable. The DV-number-in-the-note
  match survives as the fallback recognizer. FEE SCOPE also widened by
  Kevin 2026-09-01: ALL remote card payments carry the 99c customer-paid
  fee (keyed phone orders now, online checkout later); cash and in-person
  register sales never do. Agreement page, exhibit text, and letter all
  updated BEFORE she accepts.

- **Customer autofill on the phone-order form, built 2026-09-01 on Kevin's
  ask** (a weekly caller must not become 52 retypings): the customer base
  IS the order history. Typing two letters of name or three digits of
  phone offers matching customers; one tap fills WHO and WHERE (name,
  phone, fulfillment, address) from their latest order. Kevin's same-day
  refinement, do not resurrect: NOT the lines and NOT the occasion; what
  they are ordering and why is each call's own business, and a prefilled
  Sympathy on a birthday order is the kind of wrong that ships. No
  separate customer table: nothing to maintain, nothing to drift.

- **Workroom payments verified end to end in sandbox 2026-09-01**, Kevin
  driving: three card charges through the order-card SDK pane (each
  itemized in Square with the customer-paid $0.99 line and linked back by
  workroomOrderId) and one cash recording (no fee, linked). The fee is
  named "Order fee" everywhere as of the same day (Kevin's palatability
  ask; concrete labels tolerate best, and the pre-rename sale correctly
  keeps its historical "Service fee" line). Board polish from the same
  test pass: receipt-style fee rows instead of a nagging sentence, phone
  link beside the customer's name, paid badge trimmed, done-but-unpaid
  living in its own "Out the door, not paid" section that never ages off.
  SDK trap recorded: the script lives on web.squarecdn.com (squareup.com
  does not resolve).

- **"This week" analytics screen built 2026-09-01 on Kevin's ruling not to
  wait**: /workroom/week narrates what the ledgers add up to, the
  florist-native numbers Square cannot compute (money split
  counter/board/by-hand with linked payments summed once; owed-right-now;
  order mix, occasions, returning share, median lead time; stems
  bought/tossed/made with shrink percent and reasons). Every section names
  which ledger feeds it; unknowables counted, never guessed. Born from his
  critique of stems-and-shrink ("you put the info in there, so what?");
  the stems page now states where its data goes, right at the top. Also
  from the same pass: focus rings turn inward inside scroll regions (the
  clipped-ring catch), and the fee's paid badge trimmed.

- **Online card checkout built 2026-09-01, behind the CHECKOUT_CARDS env
  switch, PICKUP ONLY**: the storefront half of the proven payment rails.
  Pay-now-by-card at checkout shows the Order fee as its own row, charges
  through her Square with the board id as reference, and the ticket lands
  born confirmed and already wearing the paid badge. Pickup-only because
  the delivery fee is still her unanswered question and a charged total a
  fee might change would be the checkout lying; deliveries keep pay-on-
  call and say so. Switch off = byte-for-byte the phase-1 flow. The
  Exhibit A line "when both parties agree in writing" is satisfied by
  Kevin flipping the switch after that writing exists. Sandbox test of
  the full customer flow still pending (needs CHECKOUT_CARDS=on in
  Vercel + a redeploy).

## Permissions

- **Product photographs were supplied by Kevin directly** (their host captchas
  automated requests). Matched to products by original WordPress filenames, not
  by eye. 20 of 57 products photographed as of August 2026.
- No written permission for anything else yet. The proposal and demo are
  noindexed and shared by link only.

## Palette and type

The cream, ink, and green in `globals.css` are **a Glazed choice, not theirs**:
their mark is black line art and their site has no coherent palette to lift.
Marked as a placeholder in the repo README. If they have brand colors, swap the
six tokens and re-run the auditor.

## Retired

- **The "design partner" framing, retired by Kevin 2026-08-22.** Sessions had
  been describing her as a design partner whose feedback and floral-group
  reach were consideration she pays with. Kevin's ruling, near verbatim: "I
  see her as a customer. I don't want to partner with her in that way. If we
  build a better product she will tell people naturally, and if it needs work
  she will tell me what to fix." So: she is a customer who pays money and
  owns what she buys. Her feedback is customer feedback, welcome and acted
  on, never an obligation or a payment. Her floral groups are market
  information she volunteered, never a distribution channel we recruit her
  into. Do not resurrect the partner framing in letters, meeting docs, phase
  plans, or pricing rationale.
- The checkout's "switched off and says so" demo notice was replaced by real
  order intake in August 2026; that was the plan, not a retraction.

## Open

- ~~Delivery fee, order minimum~~ ANSWERED and CONFIRMED by the owner
  (she sent the numbers to Kevin, 2026-09-01; provenance in devine
  `research/delivery-fees.md`): per-zip fees $8.95 (Marshall 49068) to
  $32, minimums $45 in Marshall / $55 outside. LIVE in site.ts and wired
  through checkout the same day: known zips price delivery in both pay
  modes, card payment opens for deliveries clearing the minimum, server
  re-enforces everything from site.ts. ONE STATED ASSUMPTION awaiting her
  word: the minimum is read as FLOWERS SUBTOTAL with the fee on top (the
  stricter reading; her correction can only loosen checkout). The sheet
  also gave the owner's name as IRIS knows it: Katy DeVine. Same-day
  cutoff STILL open.
- Big-order threshold: at what order size does she want a confirmation
  call even for paid, future-dated orders? (Same-day paid orders already
  flag for a timing call.)
- Team roles and portraits: on the owner.
- 37 remaining product photographs: on the owner/Kevin.
- Whether "Classic Red Dozen" is still meant to be on sale at $75: on the owner.
- ~~How she takes card payments today~~ answered 2026-08-31: Square at the
  counter, basic plan (see Decisions). Still open: what hardware (register,
  reader, terminal) and whether anything else takes cards.
- The real wedding spreadsheet: **she has agreed to send it.** The wedding
  model and template get rewritten from it when it lands.
- **The funeral pad was built 2026-08-21 from research, not from a document**,
  and the design decisions in it are the thing to check against reality:
  price-first (funeral work is sold by naming a piece and a price, stems
  worked out later, so quote-math runs in reverse to report the flower
  budget); the family's stated budget as the frame with a live gap; the
  service as a DEADLINE (an hour before the viewing, day-before when the
  service is early) rather than a date; ribbon wording and who each piece is
  from as per-piece fields; and "put it on the board" as the last button,
  because the family is standing there. Price points are published 2026
  industry ranges, labelled as such on screen, awaiting hers.
- Funerals, corrected 2026-08-21: **there is no funeral worksheet.** Her
  words: funerals "are done on the spot... quotes in person, no spreadsheet."
  So the funeral variant's job is a counter pad, not a document pipeline:
  speed and a live total across a desk from the family, with print as a
  same-visit courtesy. The refinement ask changes from "bring the worksheet"
  to "walk us through one on-the-spot funeral quote at the meeting" - watch
  the real motion, then shape the tool to it. Likely follow-on once observed:
  a finished funeral quote becomes an order on the board in one tap, because
  the family ordering is standing right there.
- What "all over the board" means about the floral groups: in person.
