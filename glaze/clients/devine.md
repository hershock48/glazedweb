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
  shops ONLY if DeVine's uses it daily and 3 to 5 shops from the owner's floral
  groups will pay for it. The full-POS question (payments hardware, wire
  services) is deliberately deferred, not declined.
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

- Nothing shipped and pulled yet. (The checkout's "switched off and says so"
  demo notice was replaced by real order intake in August 2026; that was the
  plan, not a retraction.)

## Open

- Delivery fee, order minimum, same-day cutoff: on the owner.
- Team roles and portraits: on the owner.
- 37 remaining product photographs: on the owner/Kevin.
- Whether "Classic Red Dozen" is still meant to be on sale at $75: on the owner.
- How she takes card payments today at all (IRIS does none; is there a
  terminal, Square, paper slips?): on the owner, at the meeting.
- The real wedding spreadsheet: **she has agreed to send it.** The wedding
  model and template get rewritten from it when it lands.
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
