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
- THE ONLINE STORE IS A PRICED ADD-ON, not a "talk later": +$600 one time and +$51/mo,
  so site and store together are $2,500 and $150/mo, which still sits under Mopro's
  published $199 entry price. Plus 99c an order, paid by the customer at checkout, not
  by the bakery. Kevin's numbers, Aug 2026.
- THE DEMO SELLS. /shop has the five boxes at their own prices, a cookie cart, and a
  checkout: Stripe hosted Checkout when STRIPE_SECRET_KEY is set, an emailed order and
  an honest "nothing has been charged" when it is not. No marketplace price, name or
  link anywhere on the site now (Kevin, emphatically); the listing stays in the schema
  as a sameAs only. The $600 add-on is now precisely "switch the card payment on".
- Superseded, kept for the reasoning: the demo takes shipping orders: /shop has a real form (box, address, gift note, who
  to ring for the card), same no-JS server-form pattern as /order, no payment taken and
  the page says so twice. Paid checkout is exactly what the $600 add-on replaces.
- Proposal is six sections now, not five: the shipping argument was promoted out of
  "What we built" into its own section four, because it is the revenue case and it was
  reading as a footnote. Cost is five, next is six.
- Section five carries a second calculator: boxes a month and what Goldbelly pays per
  box, returning what passes through the middle and the payback on the store. It
  assumes only a QUARTER of orders move to the bakery's own page, and it says the tin
  and the truck are real costs either way. Do not let anyone "simplify" it into a
  commission figure we do not have.
- One price per menu row, no cash column. Kevin's call once Square landed. Do not
  reintroduce a `cash` field on MenuItem.
- HOW GLAZED GETS PAID PER ORDER, since it decides the architecture. If the bakery's
  own Square or their own Stripe key takes the money, we earn nothing per order and the
  99c in the proposal is fiction: the monthly is all there is. Two rails that do pay:
    Stripe Connect, direct charges. The bakery is a connected account, the money lands
    in THEIR balance, and `application_fee_amount` lands in ours on every payment,
    automatically. Needs the card_payments capability on their account, which is
    ordinary onboarding. This is the one to build on: the checkout is already Stripe
    hosted Checkout, and Connect is a change of parameters rather than a rewrite.
    Square app fees. `app_fee_money` on payments our app processes for them under
    OAuth, requiring the PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS grant. Fees land in the
    Glazed Square developer account, capped at 90% of the payment. Only applies to
    payments taken THROUGH our integration; anything they ring up on their own POS or
    sell through Square Online pays us nothing.
  Note the wording of the quote: "99c an order, paid by the customer". To be literally
  true that is a 99c line item added at checkout and then collected as the application
  fee. Taking it out of the bakery's proceeds instead is a different deal and should be
  described differently.
- THE MONEY RAIL AND THE PRINTER ARE SEPARATE and this is the unlock. We can own the
  checkout (and the per-order fee) and still push the finished order into Square via
  the Orders API so it lands in their dashboard and prints on the same printer as the
  to-go tickets. Pointing them at Square Online instead hands away both the fee and the
  relationship.
- Phase-two checkout is quoted on Stripe as the base layer (2.9% + 30c, no monthly).
  Square's own online rate is 3.3% + 30c on the free plan and 2.9% + 30c on Plus at
  $49/mo, so building on Square only pays for itself if the bakery wants one dashboard
  badly enough to move up a plan. Worth offering as an option, not as the default.

## Facts that matter

- NOT ON A CORNER. 144 W. Michigan is mid block, storefronts either side, which the
  night photograph shows plainly. "Same corner of Michigan Avenue" was in the site
  description, the story page twice, the homepage and the proposal before Kevin caught
  it. Say building, or block, or the address.

- The spelling customers type, louiesbakery.com, is a bakery in Emmaus, Pennsylvania
  (verified Aug 2026). Their hyphenated domain is painted on the building.
- The coffee is Starbucks, brewed in the bakery, three sizes (Kevin, Aug 2026). Their published menu already priced it; the demo now says it out loud on the drinks section.
- POS: SQUARE, and the cash discount is gone with it (Kevin, from the shop, Aug 2026).
  This answers the open POS question and invalidates every price on their published
  menu, which still prints a card price and a cash price on every line. The build now
  shows one price, the card figure carried across, and it is the largest PLACEHOLDER
  on the site until Jason hands over the current Square list.
- Their old site still showed a July vacation banner on August 18, and /team is live
  with lorem ipsum and three invented names. Both are findings in the proposal, with
  links.
- Their own store is broken in the same way the homepage is: /store quotes "shipped on
  tuesday feb, 10" and /shopping-cart quotes "We ship April 25", two stale dates on two
  pages. This is finding five in the proposal, replacing the one Kevin killed.
- Kevin's rule on tone, stated: the letter must not read as dicks, and must not sell
  Goldbelly on the bakery's behalf. Blame the platform, never the owner.
- THEIR GOLDBELLY LISTING SELLS FIVE THINGS (screenshot from Kevin, Aug 2026, after my
  own probe wrongly suggested it was empty: product pages are readable by URL, but none
  of theirs is indexed and Goldbelly's search returns nothing for their name, which is
  not the same as having no products. Do not repeat that inference).
    Classic Nut Rolls, 1 dozen, $75.95
    Signature Tin, 6 pieces, $79.95
    Apple & Raisin Fritters, 6 pack, $79.95
    Signature Cookie Tin, 2 dozen, $79.95
    Pumpkin-Shaped Sugar Cookie Gift Tin, 16, $85.95, marked coming soon
  All free shipping, meaning freight is inside the price. Listing tagline is theirs:
  "OVER 70 YEARS OF DONUTS DONE THE RIGHT WAY". Two verified-purchase reviews, both
  Virginia F. of Tucson AZ, May 2026: "Not one cookie broke! They taste great, love
  them, will buy more!" and "These rolls are amazing!" Both now on the demo's /shop.
- A dozen nut rolls is $75.95 delivered on the marketplace against roughly $23 at
  counter prices. That spread is the shipping argument in the proposal. It is NOT a
  commission figure: it holds the tin, the freight and Goldbelly's share together, and
  the letter says so rather than implying the marketplace pockets $53.
- Product photography exists on those five listings and is usable per Kevin. Still not
  in the repo: the imgix URLs are generated per product page and the slugs did not
  guess (four attempts, all 404). Need one product URL from Kevin to lift them.
- Photo rights on Goldbelly product imagery: Kevin says we have permission, Aug 2026.
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
- GET THE SQUARE PRICE LIST. Every figure on the demo is a carried-over card price and
  needs replacing with what the register actually charges.
- Ask Jason about the "Best Bakery in Michigan" wins: which award, which years. If it
  is real and namable it is worth a line on the story page.
- Attach louies.glazedweb.com to the Vercel project (Kevin, dashboard).
- SMTP_* and ORDER_TO in Vercel, then one real test send of the order form.
- Original logo art; unframed scan of the Louie photograph; half-morning photo shoot
  (shot list in the repo README); real closures; four PLACEHOLDER menu facts.
- On signing: remove noindex (robots.ts + next.config header), delete the pitch and
  rewrites, tell the bakery about the review quotes and the studio credit.

## Debug pass, August 18

Every closure path in the availability engine was broken and is now fixed and tested by
simulating a live closure: "back" naming the last closed day (usually a Monday), the
board and menu badges ignoring closures entirely, nextOpenDay walking into a shutdown,
overlapping ranges resolving to the earliest, unvalidated dates that silently matched
nothing, /visit's table and the structured data advertising hours through a closure.
Closure dates now throw at build if they are not yyyy-mm-dd.

Also: honeypot returning success while discarding an order and logging nothing (and
named `company`, which Chrome autofills); send failures reported as "email not switched
on"; "[object File]" passing validation; two open redirects; the coming-soon tin
orderable by cookie; the Stripe path never telling the bakery; ?state=paid claimable by
anybody; /menu?today=1 unfiltered without JavaScript.

Standing numbers after it: twelve routes, zero axe violations at 320/390/768/1440,
/ at 2160ms LCP and 0.000 CLS, menu prints on three pages.

## Retired

- "The lights are on at three" hero: invented, nothing sourced it. Do not bring back.
- "Concept build by" wording: overridden by Kevin for this client.
- revalidate=900 on time-dependent routes: glaze.md's route-caching trap, replaced
  with force-dynamic. Do not reintroduce for cost reasons.
