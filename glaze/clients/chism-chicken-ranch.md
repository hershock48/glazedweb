# Chism Chicken Ranch

**Repo** `chism-chicken-ranch` · **Live** www.chismchickenranch.com · **Since** 2013

## What they are

Family-run pasture-raised poultry farm in Marshall, Michigan. Derek Chism and
Tiffany Tucker. Cornish Cross Rock broilers raised on pasture with a 28% protein
non-GMO ration, humanely processed at about eight weeks, plus seasonal free-range
eggs. APPPA member. Wholesale through Blight Farms in Albion, Jolo Farms in Battle
Creek, and Local Pastures delivering into Chicago.

The first Glazed Web client.

## Terms

$500 build plus $50 a month. An early friend price that predates the menu, and
worth knowing when quoting anyone else.

## Decisions on file

**The short name is "Chism", not "CCR".** Tiffany raised that CCR is Creedence
Clearwater Revival; Derek's position was to let it ride. The decision went to
Chism because the downside is lopsided rather than because the odds are bad: a
demand letter is cheap to send and expensive to answer, and it would arrive after
the signage, the cartons and the search results all say CCR. Three letters shared
with a famous band was never the strong option anyway. It is one line,
`site.short` in `lib/site.js`, if they ever want it back.

**Birds are one flock sorted by dressed weight after processing**, not two things
raised separately. Derek's numbers, 13 August 2026: **broilers 2.5 to 4 lb,
roasters 4 lb and up to about 5.5.** Weight depends on the meat after dressing,
which is why every estimate on the site is a **range** and never a single figure.
Processing at Stutzmans, chicks from Morren Ag.

**They love the pre-calculated price estimate** and so do their customers. Derek:
previous buyers he showed it to ordered because of it. Keep the calculator; make
it honest, do not simplify it away.

**Deposit is $6.50 a bird, non-refundable**, and it buys the chicks and starter
feed. Balance by actual weight at pickup, about $6.50 a pound.

**Rounds are pre-sold.** Everything seasonal reads from the `round` object in
`lib/site.js`, so opening the next one is an edit there and nowhere else. Never
compute the season from the clock: `/reserve` is statically generated, so a
`new Date()` in it freezes at build time. That fault shipped once and printed
"taking orders for 2027" on a page selling birds for October 2026.

**Every reservation emails the farm before payment**, with name, phone, size,
quantity and the estimate shown. Square is not the order record. The birds are
collected eight weeks out on a date that moves, so the farm has to be able to
telephone every buyer.

**Copy voice.** Warm and plain. Emelia's first year in 4-H is the photo that leads
the gallery and, in the family's own framing, the reason any of this exists.

## Permissions

Logo and all photos, granted.

## Palette and type

From `tailwind.config.js`. Lora for display, Inter for body, both self-hosted via
`next/font/google`.

| Token | Hex |
|---|---|
| paper / paper-dark | `#FAF0E6` / `#F0E4D2` |
| cream | `#FFFCF6` |
| ink / ink-soft | `#3B2F28` / `#6B5A4E` |
| terracotta / dark | `#AD5142` / `#9E4739` |
| barn / light | `#4E5B45` / `#6F7D5A` |
| wheat / light | `#C79A54` / `#E0C489` |

Their logo exists only as a 500×500 JPEG; the hen inside it is 103×101 pixels of
cross-hatched engraving and is used as a bitmap sprite rather than redrawn. The
wordmark was traced to vector from their own bitmap at threshold 162, chosen by
rendering nine candidates and diffing against the original.

Credit reads **"Double Dipped by"**.

## Retired

- **"taking orders for {year+1}"** computed from the clock. Replaced by the
  `round` constant.
- **A single `avgWeight: 4.5`** applied to both bird sizes. It made the summary
  contradict the option the customer had just chosen.
- **The static Square Payment Link as the preferred checkout path.** It cannot
  carry a computed amount, so it is the labelled fallback now, never first.

## Open

- The business card QR code points at the old website and nobody has read the URL
  off it yet. That one answer decides whether the remaining printed stock can be
  saved with a redirect. `/order`, `/preorder` and `/qr` already 301 to `/reserve`
  for whatever gets printed next.
- Derek is setting up the Square API token himself. Until it is in Vercel,
  checkout runs in the labelled degraded mode.
- Round 3 pickup is planned for the first or second week of October 2026 and is
  not confirmed. When Stutzmans books it, set `round.pickupWindow` and flip
  `round.pickupConfirmed` to `true`.
- The contact email in `lib/site.js` was flagged as a placeholder in the first
  commit. Confirm it is the real one.
