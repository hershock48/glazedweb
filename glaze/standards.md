# Standards that live in no other file

Account-wide rules earned in client builds that `glaze.md`, `brand.md`,
`launch.md` and `link-cards.md` do not carry. Same contract as the rest of
these documents: rules first, the story that produced each one underneath, and
**if this file disagrees with the code, the code is right.** When a rule here
graduates into one of the main files, delete it here rather than keeping two
copies.

This file was first created because `glaze/assets/glazed-credit/README.md`
cited an SEO note in it that had never been written. That note is below, so the
pointer is no longer dangling.

---

## The SEO note: `rel` on the studio credit link

**The credit link ships `rel="noopener noreferrer"`. Whether it should also
carry `nofollow` is an open decision with Kevin, and until he rules, do not add
it or remove it site by site.** Google's explicit recommendation for designer
credit links you control is to add `nofollow`; the risk of not doing so is a
cross-site link pattern that lands on the client's ranking as much as ours.
The counterargument is that a handful of honest credit links from real client
sites is exactly what the guideline's spirit permits. Whichever way it goes,
it goes the same way on every site in the same week, because a mixed pattern
is worse than either choice.

---

## Tap targets are measured, not assumed

**Every interactive control measures at least 24px in both dimensions, and the
effective hit area of small-looking controls is grown to about 48px with an
invisible overlay rather than by inflating the visual design.**

> On the devine build, `.btn` kept its hairline look and grew its hit area
> with an `::after` overlay to ~48px. On the same build, `tel:` links were an
> 18px-tall inline text link on the pjs build until they were fixed at the
> attribute selector, all of them at once, rather than link by link.

**And measure the container, not just the page.** A nav that scrolls inside
its own box can clip its last item with no page-level overflow anywhere.

> devine's mobile nav was an `overflow-x: auto` scroller with no affordance
> that clipped the last item at 390px and the last two at 320px, invisible to
> the page-level overflow check because the clipping happened inside the nav's
> own box.

---

## Icons and favicons, beyond the cuts

`brand.md` carries the cut rules (two cuts, full bleed, three sizes in the
`.ico`). Two more, from the cookinwithbeans icon work:

**Nothing thinner than about one pixel at 16x16** (that is ~12 units in a
200-unit viewBox). A lockup that measures 2.23 contrast with sub-pixel strokes
renders as a smudge in a browser tab. Invert or simplify until every element
clears ~4.5 and the thinnest stroke is a full pixel.

**The maskable Android icon is a separate cut with the mark pulled into the
middle 68%.** Android crops maskable icons to its own shape and will take the
edges off a full-bleed cut.

**One `icon.svg` is the source of truth for the whole icon set**, and raster
sizes are generated from it, not drawn beside it.

---

## Open rulings

Recorded here so sessions stop re-litigating them per build. Each needs a call
from Kevin, and until then the standing behavior is what is written.

**The 150KB JavaScript budget.** louies measured a stock Next 16.3 + React
19.2 app containing one `h1` at 168KB compressed, over the budget before any
site code exists, and truenorth landed at 184KB for the same reason. anchor
hit 139KB and devine 142.6KB worst-route on the same stack, so the bar is
reachable on lean page trees and unreachable on heavy ones. Until ruled:
**keep measuring and recording the number honestly, never hide an overage, and
file framework-floor overages against `launch.md` rather than against the
repo.** Options when it is ruled: raise the bar, or split it into a framework
floor plus a page-code budget.

**The credit wording for unbought spec builds.** `brand.md` says "Concept
build by". Kevin has overridden it to "Double Dipped by" on truenorth, pjs and
louies, three times in one month. Until ruled: **ask Kevin per build rather
than applying the brand.md line**, and when he rules, either retire the rule
or start following it.

**Telling clients the credit is there.** The credit is live on seven-plus
sites and no owner has been told. `glaze.md` calls the credit a contract item,
not a surprise deploy. This is not a design decision but it blocks calling any
of those launches finished. One message per client closes it.

---

## Who the menu is for now

**The studio's focus, ruled by Kevin 2026-09-01: businesses that take or want
online ordering (restaurants, flower shops, and the like) and POS
integrations, with the studio as the brain behind the register. Farm sites,
nonprofit sites, and other plain-brochure work are no longer what the copy
sells, even though past builds of that kind stay in the portfolio and get
honored.** The homepage hero, the Baker's Dozen bullet order, and the Custom
card were reframed the same day; ordering leads everywhere it appears. A
dedicated ordering flavor with its own price is still open with Kevin, so the
menu structure (three flavors) has not changed, only what it leads with.

---

## How the order fee is worded in public

**Public copy never says "we never charge per order." The true and rulable
sentence, per Kevin 2026-09-01: no percentage commission, a flat 99¢ order
fee added at checkout, paid by the customer and named plainly before they
pay.** The fee mechanics live in the payments memory and the client files
(`app_fee_money`, all remote card payments, named in the client agreement
before cards go live).

> The ordering service page shipped "We never charge per order" while the
> 99¢-per-order fee model was being decided in the devine and beans builds.
> Both were true in their own file and false together, and a client could
> have quoted the site back at the first invoice. Retired 2026-09-01; if the
> old sentence turns up in a pitch or a client README, it is the dangerous
> copy.

---

## What almost lived here and lives elsewhere instead

So the next session does not re-add them: the mobile compositing budget
(4096px), rotation amplitude scaling, tokens validated against every ground,
the layout-shift cost of server-open/client-collapsed, the pitch-host home
link, the surviving dashboard build setting, and "a guess written as a plain
value is worse than a blank" are all in `glaze.md`. Favicon cuts are in
`brand.md`. Throttled-connection CLS, the 404 lines and the favicon checklist
lines are in `glaze/launch.md`. The one-host-one-favicon rule is in
`glaze/link-cards.md`.
