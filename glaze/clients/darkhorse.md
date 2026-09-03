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
merch, Wix Events for tickets, and the 4,800-member Mug Club run from one
staff inbox. The audit in the repo README lists every finding with a link
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

**The proposal is not sendable until `/demo` exists.** Section four links
to it and describes it as built. The HTML carries a PLACEHOLDER comment at
that spot and the README checklist names it as blocking.

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
