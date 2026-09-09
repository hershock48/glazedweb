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

**Toast:** the finding is the Thursday-evening visit (2026-09-03, 7:15 PM,
mid-service, "Currently not accepting online orders"). The Wed 2026-09-09
10:00 AM visit showed "scheduled orders only," which Kevin pointed out is
correct before the 11 AM opening; it is stated as expected behavior, not
evidence. The Toast menu disagrees with the website menu on soup prices and
lists items the site never mentions; that stays.

**The tap list is live (2026-09-09).** Their Untappd for Business board
page carries the whole board as JSON in `data-react-props`; `demo/taps.mjs`
parses it, `build.mjs` bakes it, `/api/taps` serves it with a five-minute
edge cache. They edit the board (last on 2026-09-05). Real build: Untappd
for Business API with their token. InkSoft is a print shop's storefront
(publisher #20305), almost certainly printer-fulfilled. In-house merch means
the goods the General Store already stocks, fulfilled by them; the printer's
on-demand catalog stays with the printer unless Chuck wants to change
printers. Ask: who the printer is, what is held in stock, what the split is.
Full reasoning in the repo README under the demo placeholders.

**They have a distillery and a wine label, and the website says nothing
about either.** Table-top menus photographed by Kevin 2026-09-09: DH Gin and
DH Vodka cocktails (their own spirits, 90 proof, bottles at the Commons and
General Store), Crooked Tree Cellars wine with Fennville Winery, a third
dessert. All in `demo/data.mjs` under `drinks`; the demo menu has Cocktails
and Wine sections. "Sivarticus" is cheese bread with jalapeños and bacon
(on the printed menu), so it is not a Toast phantom; the proposal no longer
says it is.

**Cans are trimmed to alpha bounds** (`tools/trim-cans.mjs`) because the
source PNGs carry different margins. Re-run it if a can is re-pulled.

**No age gate, ruled by Kevin 2026-09-09.** Everyone is welcome at the
brewery. The demo has none; the proposal's build table says the 655KB
script goes with nothing in its place. Do not add one back. The audit in the repo README lists every finding with a link
and an M/R tag.

**Priced like Griffin Claw, ruled by Kevin 2026-09-03: $4,500 build plus
$195 a month. The Mug Club system is inside the $4,500, ruled 2026-09-09.**
The proposal says so in a sentence under the price. Do not split it out as
an add-on or a phase.

**The proposal goes to Emily, and nothing in it may point at a person**
(Kevin, 2026-09-09, "remove the emily critiques immediately"). Her address
is the Mug Club renewal contact on their site; she does not manage the
website, someone else does, and that person is off limits too. The proposal the proposal now says "no system" and "no
online way to join or renew," never "one employee" or "one inbox," and the
"if she is out for a month" question is gone. Grep for
`emily|inbox|mailbox|employee|one person` before any send.

**The price melts from Untappd's own guide** (2026-09-09, "like the other
proposals"): fully custom $10,000 to $20,000+ upfront, $100 to $500 a month,
lounge.untappd.com/how-much-should-a-website-cost/. Count from $10,000 to
$4,500; monthly card cites the band beside $195. Melt lifted verbatim from
Sprinkles. Launch window is two to four weeks (was four to six).

**The proposal tracks the demo.** Sections three and four describe what is
built; when the demo changes, re-read both before a send. Findings carry
dates and get re-verified against their live site before a send.

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
