# True North Ice Cream

**Repo** `truenorth` · **Pitch** truenorth.glazedweb.com (proposal at the root,
the build at `/demo`) · **Their site** truenorthicecream.com

## What they are

Two ice cream shops in Michigan, both scooping ice cream made in the shop.
Marshall at 403 S Kalamazoo Ave, open noon to 9 daily. Battle Creek, open 2 to 9
daily. Their own promise, in their own words, is "Happiness is homemade," and it
is the line the rebuild's hero carries.

Kevin met the owner on 21 August 2026 and the meeting went well. The owner's
name and the registered legal entity are still not on file, which blocks the
agreement (see Terms).

## Terms

**$2,000 build plus $150 a month.** Kevin's ruling, 4 September 2026.

The reasoning matters more than the number, because the number changed. The
August proposal quoted **$1,900 plus $99** and told the reader the price came
"straight off our public menu, no custom-quote theater." The published menu
moved to 2,000 and 150 on 1 September 2026 (`lib/pricing.js`). Honoring the menu
is the only move that keeps the August sentence true, so the proposal names the
change out loud rather than hoping nobody remembers it. **The owner has seen the
August letter** (Kevin, 4 September 2026), so that paragraph is mandatory, not
optional.

$150 is the floor of the recommended 150 to 350 per-location band, for two
locations, and unlike the August number it now includes the Scooplist account
for both shops.

$4,500 plus $195, the Griffin Claw and Dark Horse shape, was considered and
rejected: a 2.4x jump on a warm relationship, and Dark Horse sits at 511 S
Kalamazoo while True North's Marshall shop is at 403 S Kalamazoo. Two live
proposals on the same street have to be explainable by scope.

The Custom Order agreement is `glazedweb.com/agreement/truenorth`, entry in
`lib/customOrders.js`. Edit allowance 2 hours a month, the $150-tier convention.
**Flavors are explicitly outside the edit allowance**, because they change those
themselves in Scooplist, which is the whole point of the deal.

## Decisions on file

**The flavor board is the pitch, and it is already running.** Their live flavors
page had not changed since 1 February 2025. The rebuild's boards are fed by
Scooplist from their own case: the owner taps a tub out at the counter and the
website follows within a minute, with no deploy and nobody to call. Adopted as
the `truenorth` org on the shared Scooplist deployment, 4 September 2026.

**"Homemade" is their word and it wins over ours.** Scooplist's scoops preset
calls the first board `handscooped`; the category label was relabelled to
Homemade for this org, and the site's board KEY was moved to `handscooped` to
match the feed. The key is Scooplist's, the title is theirs. Kevin, 4 September
2026.

**No ABV anywhere near an ice cream shop.** The Scooplist item editor used to
show an ABV field to every trade. It is now a per-trade preset flag, off for
scoops. Kevin, 4 September 2026.

**Per shop, always, never merged.** Marshall and Battle Creek have different
hours, different cases and different menus, and every surface resolves through a
shop before it answers a customer question. Their current site contradicts
itself (header says 12 to 9, hero says 2 to 9) because each number belongs to a
different store and a single-store template could not split them. This is the
strongest finding in the proposal and it is theirs, not a template's.

**Their Marshall Google Business Profile lists Friday as "12 AM to 9 PM."** A
midnight typo that Restaurantji and Bing have scraped verbatim. Offered as part
of onboarding, free, alongside a mailbox on their own domain.

**Ordering is built and switched off.** `ORDERING_LIVE` in `src/data/site.ts`.
Order to inbox, pay at the counter, prices resolved server-side. Never describe
it as live and never imply cards work; taking cards needs a payment account of
theirs and is quoted separately.

**"Strawberry Lemondade"** on their live flavors page is corrected to Lemonade in
the rebuild. Small, and exactly the kind of thing that proves somebody read the
site.

**The studio credit reads "Double Dipped by Glazed Web,"** Kevin's override of
the glaze.md spec-build wording, title case on Double Dipped.

## What is not known and must not be invented

- The owner's name, his title, and the legal entity as registered. The agreement
  cannot go out without them.
- Who holds the domain registration for truenorthicecream.com.
- Which shop runs the soft serve machine and the espresso bar. Both are tagged
  Marshall on the strength of one Choose Marshall article, not the owners' word.
- How many flavors they actually rotate. No source on file. Every other figure in
  the proposal carries a link, so this one either gets sourced or gets cut.
- No speed or Lighthouse number for their current site has ever been measured.
  Markup was counted, which is quotable; performance was not.
