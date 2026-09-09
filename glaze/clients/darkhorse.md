# Dark Horse Brewing Co.

**Repo** `darkhorse` · **Prospect**, not signed · Scouted 2026-09-03

## What they are

Brewery, taproom, kitchen (wood-fired pizza, Thursday to Sunday breakfast at
the Commons Market), general store, beer garden with a live music calendar,
all at 511 S. Kalamazoo Ave., Marshall, MI 49068. Founded 1997. Five labels:
Dark Horse, ROAK (Royal Oak, acquired 2024), Brew Detroit, Altes, Great
America (10 percent ABV malt beverages). Managing partner Chuck Mascari Jr.
Parent or distribution entity: Benchmark Beverage Company. Local to the
studio; same town.

## Decisions on file

**The wedge is ownership, five ways.** Wix for the site, Toast for ordering
(at a URL carrying the ROAK name), Untappd for the tap list, InkSoft for
merch, Wix Events for tickets, and the Mug Club, more than 5,000 members,
run from one staff inbox.

**Mug Club facts, ruled by Kevin 2026-09-09:** say "more than 5,000" (never
4,800, which is their Mug Club page's stale number); the perk is "every
sixth fill is $1, on the punch card." Annual price still unpublished.

**The Sep 7 event dates were show dates, not post dates.** Wix Events has
no post date; the structured data said `startDate 2026-09-07`, and on
2026-09-09 both listings had dropped off Upcoming Events as past, taking
the Sept 19 Boy Mob show off the site ten days early. Kevin raised the
post-date reading on 2026-09-09; it was checked and does not hold.

**Toast, two dated visits:** Thu 2026-09-03 7:15 PM "Currently not accepting
online orders"; Wed 2026-09-09 10:00 AM "Only accepting scheduled orders."
The Toast menu disagrees with the website menu on soup prices and lists
items the site never mentions. State both; conclude nothing about why. The audit in the repo README lists every finding with a link
and an M/R tag.

**Priced like Griffin Claw, ruled by Kevin 2026-09-03: $4,500 build plus
$195 a month.** The proposal (`pitch/darkhorse/index.html` in the repo)
puts the Mug Club signup and renewal system inside that number. If that is
more than the price is meant to carry, change the price-card line and the
Mug Club row of the build table before sending, not after.

**They own their domain.** `darkhorsebrewery.com` is registered through
Network Solutions, since February 2005, paid to 2029, on worldnic
nameservers. The proposal says so; it is the one ownership fact in their
favor and it is what the rebuild sits behind.

**The demo exists, at `/demo`, built 2026-09-03.** Static pages generated
from `demo/data.mjs` by `demo/build.mjs`; the weekday under an event is
derived from its date, hours print from one table. Two event dates in the
data are inferred from their own description and marked PLACEHOLDER; the
Mug Club price and perks are unpublished and the page says so rather than
inventing them. Ordering still links to Toast's URL; there is no workroom.
Both are said out loud in the proposal's build table.

**Assets.** Pulled from their Wix CDN at layout sizes. The CDN serves AVIF
with alpha when asked with `enc_auto` and an `image/avif` Accept header,
which is a quarter the weight of the WebP it gives by default for PNG
sources. Originals from them before any real launch.

**Toast stays behind their own hostname if they keep it.** On-page embedding
is impossible (frame policy, see `glaze.md`); `order.darkhorsebrewery.com`
is the on-brand answer.

**Their real menu lives on `/brewery`.** A separate placeholder "Dinner Menu"
at `/menu` is Wix template filler and is indexable. Both facts are in the
audit; if the placeholder disappears before the pitch, remove the finding
rather than presenting a stale screenshot.

## Retired

- "Their phone number is not on their site." It is in the footer on every
  page. The Contact page body lacks it. Say the narrow version.
- "Seven homepage images have no alt text." They are `alt=""`, correct for
  decorative images. The real fault is camera filenames used as alt text.
- "The Untappd beer list link is broken." It renders a full tap list;
  only a text-only fetch failed.
- "The mobile menu is broken." Observed stuck twice in a backgrounded
  emulator, which throttles animation. Unverified until opened on a phone.
