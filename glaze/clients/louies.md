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

## Open

- Show Jason. One action in the proposal: look at the demo, then call Kevin.
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
