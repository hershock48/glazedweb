# Louie's Bakery

**Repo** `louies` · **Live** louies-bakery.com · **Vercel** `louies` (glazedweb team)
· **Pitch host** louies.glazedweb.com (domain not yet attached)

## What they are

Family bakery in Marshall, Michigan, since November 1952. Founded by Louis Bagi, who
worked in the building into his late eighties and died in 2002 at eighty-eight. Third
generation now: Jason LaForge, Louie's grandson, is Executive Baker; Louie's children
are still involved. About 1,000 nut rolls a day, and they sell out. Carousel oven with
six revolving shelves that is turned down, not off, overnight (Jason, to WWMT).

## Status

Spec build, complete, deployed, noindexed. Proposal built per glaze/proposal.md and
live at the pitch root; demo under /demo. Neither has been shown to the bakery.

## Permissions

Any photos on their site, granted. That turned out to be two files: a 350x144 logo
PNG and an AI video. The two photographs in the build are from their own Goldbelly
merchant profile (same rights basis, flag at signing). WWMT's feature gallery is the
shot list and is NOT usable: the station's photographs, not the bakery's.

Their Goldbelly profile holds exactly two photographs, the same two, at full size:
the storefront at 2400x1800 and the Louie portrait at 2400x3078. The build now uses
the full-size storefront. There is no product photography on that listing, so the nut
roll hero still waits on the shoot.

## Decisions

- The site is the case, not a price list: availability rules from their old menu's
  parentheses live in data, and open/closed, the daily board and menu badges compute
  from Marshall time. /, /menu and /visit are force-dynamic for this reason.
- Hero: "A lot has changed since 1952. The donuts haven't." Kevin's heritage angle.
  One antithesis on the page, and that is it.
- Credit line is "Double Dipped by" on Kevin's explicit call, diverging from
  brand.md's "Concept build by" for spec builds. Commented in SiteFooter.
- Wordmark is a two-layer trace of their logo (hat is a separate connected component
  in their artwork); hat animates. Replace with original art when it arrives.
- Voice is first person. Kevin's call, after catching "See what they make".
- Proposal prices the Baker's Dozen: $1,900 + $99/mo. Set in the pitch page.

## Facts that matter

- The spelling customers type, louiesbakery.com, is a bakery in Emmaus, Pennsylvania
  (verified Aug 2026). Their hyphenated domain is painted on the building.
- Cash discount on every line of their menu; the site explains it once.
- POS: unknown. No Toast/Square/Clover footprint findable; likely a basic terminal.
  Ask Jason.
- Their old site still showed a July vacation banner on August 18, and /team is live
  with lorem ipsum and three invented names. Both are findings in the proposal, with
  links.
- Their own store is broken in the same way the homepage is: /store quotes "shipped on
  tuesday feb, 10" and /shopping-cart quotes "We ship April 25", two stale dates on two
  pages. This is finding five in the proposal, replacing the one Kevin killed.
- Kevin's rule on tone, stated: the letter must not read as dicks, and must not sell
  Goldbelly on the bakery's behalf. Blame the platform, never the owner.
- Goldbelly is a marketplace, not a credential. Sellers apply through a form and
  Goldbelly decides; the only published standard is their own phrase, "Goldbelly
  good". No acceptance rate, no audit, no certification behind it, and their ratings
  display has been questioned in the trade press. Treat their listing as a place the
  bakery currently sells, never as a badge, and do not build an argument on it.
- Their Goldbelly profile calls them a "repeat winner of Best Bakery in Michigan".
  Nothing independent confirms which award or which years, and the only "best bakery"
  wording findable elsewhere is the title of a customer's Tripadvisor review. UNUSED
  until Jason names the award. Do not ship it on the strength of marketplace copy.

## Open

- Show Jason. One action in the proposal: look at the demo, then call Kevin.
- Ask Jason about the "Best Bakery in Michigan" wins: which award, which years. If it
  is real and namable it is worth a line on the story page.
- Attach louies.glazedweb.com to the Vercel project (Kevin, dashboard).
- SMTP_* and ORDER_TO in Vercel, then one real test send of the order form.
- Original logo art; unframed scan of the Louie photograph; half-morning photo shoot
  (shot list in the repo README); real closures; four PLACEHOLDER menu facts.
- On signing: remove noindex (robots.ts + next.config header), delete the pitch and
  rewrites, tell the bakery about the review quotes and the studio credit.

## Retired

- "The lights are on at three" hero: invented, nothing sourced it. Do not bring back.
- "Concept build by" wording: overridden by Kevin for this client.
- revalidate=900 on time-dependent routes: glaze.md's route-caching trap, replaced
  with force-dynamic. Do not reintroduce for cost reasons.
