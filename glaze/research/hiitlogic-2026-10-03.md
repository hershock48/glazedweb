# HIIT Logic: scout and proposal draft, 2026-10-03

**What was asked.** Kevin, 2026-10-03: "can you give me a glazedweb analysis
and proposal based on that analysis of this site?" for https://hiitlogic.com/.

**Who this is.** HIIT Logic is Jonathan Cruz's gym. He is already a client:
Ruin the Party launched on 2026-10-03 under the entity HIIT Logic LLC
(`glaze/clients/ruintheparty.md`, `lib/customOrders.js`). So this is a second
build for a client who has paid nothing yet and whose first invoice lands on
launch day. That shapes the letter: it is a reply to someone we are already
working with, not a cold pitch, and the proposal.md rule "When the client came
to us" applies in spirit even though he did not ask for this one.

**How it was gathered, and what it is worth.** This sandbox's egress policy
blocks hiitlogic.com, www.hiitlogic.com, the Wayback Machine, PageSpeed
Insights (quota), Google DNS, crt.sh and every mirror tried (Yelp, Birdeye,
Nextdoor, Alignable, ZoomInfo, WellnessLiving, Cascade Business News, Bend
Source, builtwith). Not one byte of the site's own markup was read. Every
finding below comes from what the search index surfaced on 2026-10-03, and
per glaze.md section 7 **every one of them is unverified until Kevin opens the
page**. They are tagged **L** (read from a search listing) rather than M or R.
The audit commands to run on the Mac are in section 7. Nothing here should go
into a letter until that is done.

---

## 1. The business

Facts with the page that carries them. Each is a listing read, not a page
read.

| Fact | Source |
|---|---|
| Founded 2016 in Tumalo by Katie Cruz (CEO) and Jonathan Cruz; "Central Oregon's first and only" HIIT gym at the time. | [KIPS, Katie Cruz feature](https://kipsonline.org/building-your-brand-through-customer-experience/), [ShoutoutAtlanta](https://shoutoutatlanta.com/meet-jonathan-cruz-hiit-logic-creative-specialist/), [Alignable, Tumalo, Aug 2018](https://www.alignable.com/bend-or/hiit-logic/hiit-logic-tumalo-aug-2018) |
| Jon's title at HIIT Logic is "Creative Specialist". During the pandemic the two of them "built a new website" in weeks and launched "HIIT at Home" live classes three times a day. | [ShoutoutAtlanta](https://shoutoutatlanta.com/meet-jonathan-cruz-hiit-logic-creative-specialist/), [hiitlogic.com/adjusting-to-a-pandemic/](https://hiitlogic.com/adjusting-to-a-pandemic/) |
| The site says "seven locations": Tumalo, Redmond, Bend West, Bend East (coming soon), Prineville, Sisters, La Pine. | [hiitlogic.com](https://hiitlogic.com/) |
| Tumalo: 19855 4th St #102, Bend OR 97703. | [hiitlogic.com](https://hiitlogic.com/) |
| Redmond (HQ): 453 SW 6th St, Redmond OR 97756. (541) 633-4717. info@hiitlogic.com. | [ZoomInfo](https://zoominfo.com/c/hiit-logic/529531162), [Zen Planner membership page](https://hiitlogic.sites.zenplanner.com/membershipTemplate-view.cfm?membershipTemplateId=A2697A12-3FC6-4D4F-9E6A-9124BAE4C9CD) |
| Bend West: 70 SW Century Dr #140, Bend OR 97702, in Century Center. Hours per Yelp: Mon to Thu 6:00 to 6:30pm, Fri 6:00 to 5:00pm, Sat 8:00 to 9:00pm, Sun closed. | [Yelp](https://www.yelp.com/biz/hiit-logic-no-title) |
| Bend East: 575 SE 9th St #140, Bend OR 97702, "coming soon in the heart of the Midway Campus". Has its own free-class page already. | [hiitlogic.com](https://hiitlogic.com/), [free-class-bend-east](https://hiitlogic.com/free-class-bend-east/) |
| Prineville: 102 NW 4th St, Prineville OR 97754. "Prineville's first and only." Unlimited $135 a month; punch card $110 for 5. | [hiitlogic.com/prineville/](https://hiitlogic.com/prineville/) |
| Sisters: 152 E Main Ave #5, Sisters OR 97759. Owned and operated by Jess Haag. support@hiitlogic.com, 541-906-3895. The page says "opening in January 2026". | [hiitlogic.com/sisters/](https://hiitlogic.com/sisters/) |
| La Pine: 51538 Highway 97, La Pine OR 97739. Opened March (2025, from the article's date context, unconfirmed) by Jarred and Sierra Montgomery; Sierra is a doctor of physical therapy. Grand opening drew 50 people. | [Cascade Business News](https://cascadebusnews.com/hiit-logic-brings-sense-of-community-fitness-to-la-pine/) |
| Prices on the site: Tumalo and Redmond unlimited $150 a month; Bend West unlimited $175 (includes Tumalo and Redmond); punch card $135 for 5 classes; first class free for Central Oregon residents; drop-in "inquire below". | [hiitlogic.com](https://hiitlogic.com/) |
| Affiliate program: a one-time licensing fee, an annual affiliate fee and ongoing support, costs on request. Sisters and La Pine read as affiliate-owned. | [hiitlogic.com/affiliate/](https://hiitlogic.com/affiliate/) |
| Volleyball: "Oregon's first volleyball-specific gym", Redmond. | [hiitlogic.com/volleyball/](https://hiitlogic.com/volleyball/) |
| Reviews: Birdeye shows 5.0 on 19 (Bend) and 5.0 on 11 (Redmond). Google's own counts were not seen; Google is never claimed as seen (prospecting.md). | [Birdeye Bend](https://reviews.birdeye.com/hiit-logic-168006395162156), [Birdeye Redmond](https://reviews.birdeye.com/hiit-logic-168049501692074) |
| Instagram @hiitlogic: 3,295 followers. | [Instagram](https://www.instagram.com/hiitlogic/) |
| Booking software seen under their name: WellnessLiving (Bend schedule page), Zen Planner (membership templates at hiitlogic.sites.zenplanner.com), and a bookrgo.app listing for Redmond. | [WellnessLiving](https://www.wellnessliving.com/explore/locations/open-gym/us-or-bend/hiitlogic/schedule/), [Zen Planner](https://hiitlogic.sites.zenplanner.com/membershipTemplate-view.cfm?membershipTemplateId=781DF602-A415-449F-8B80-D3C04B3924BA), [bookrgo](https://bookrgo.app/v/hiit-logic-redmond-MTOX34) |
| A second domain, hiitlogicfreeclass.com, serves "Book Your Free 7 DAYS at HIIT LOGIC" at a `/bogo...` path. | [hiitlogicfreeclass.com](https://hiitlogicfreeclass.com/bogo54316342) |
| Merch for the gym is printed by BrandLab (Redmond) with hosted stores on checkoutstores.com. | `glaze/clients/ruintheparty.md`, from Jon directly |

## 2. The scorecard, honestly

The card in `prospecting.md` was built for restaurants within an hour of
Marshall. Scored as written:

| Signal | Score | Why |
|---|---|---|
| A. Presence gap | 1 | A working site. Booking exists but it is rented and lives on other domains, so not "its own ordering". |
| B. Demand proof | 1 | 5.0 stars but 30 reviews across the two Birdeye pages, under the 150 bar. Reviews name the community and the owners in class. |
| C. Order-shaped | 2 | Memberships, punch cards, a free first class, a lead form per gym. The lead is the product. |
| D. Transition | 0 | Same owners since 2016. The expansion and the affiliate model are the tell that matters here, and the card has no row for it. |
| E. Proximity | 0 | Oregon. Sold by letter and demo link, as the card says far names are. |
| F. Rented stack | 1 | WellnessLiving, Zen Planner and a funnel domain all carry the name. |
| G. Referral path | 1 | He is a client as of this week. |
| **Total** | **6 of 14** | Under 7 is a bench name on the card. |

The card says bench. The card does not know that G here is a signed client
with a live site, a Stripe webhook emailing him orders, and a first payment
due. **Recommendation: pitch it**, as a second build for an existing client,
with the letter written warm. The reason to do it now rather than later is
also in the facts: Bend East is "coming soon" and Sisters is nine months past
its announced opening, so the site is about to need work whether we do it or
not.

## 3. What we found

Every item is **L**: read from the search index on 2026-10-03, to be opened
in a browser before it is written anywhere a client sees it. Items the index
cannot show are listed in section 7 as not checked, not as clean.

**Search and sharing**

- L1. The home page, /sisters/, /prineville/ and /la-pine/ all carry the same
  title, "HIIT Logic". A search for "HIIT Logic Sisters" shows four results
  that look identical. /affiliate/ is titled "Affiliate" with no site name.
  Blog posts use the "Post - HIIT Logic" pattern.
  Proof: [hiitlogic.com](https://hiitlogic.com/), [/sisters/](https://hiitlogic.com/sisters/),
  [/prineville/](https://hiitlogic.com/prineville/), [/la-pine/](https://hiitlogic.com/la-pine/),
  [/affiliate/](https://hiitlogic.com/affiliate/).
- L2. Seven gyms, each with its own Google listing and reviews, and no sign
  of a per-location `LocalBusiness` schema. Not provable from a listing;
  checked in section 7.

**Stale and contradictory copy**

- L3. The Sisters page says "opening in January 2026". Today is October 3,
  2026. Either it opened and the page never changed, or it did not and the
  page is wrong the other way. Proof: [/sisters/](https://hiitlogic.com/sisters/).
- L4. The site's offer is "first class free for Central Oregon residents".
  hiitlogicfreeclass.com, a second domain under their name, offers "Free 7
  DAYS" at a `/bogo` path. Two offers, two domains. Proof:
  [hiitlogicfreeclass.com/bogo54316342](https://hiitlogicfreeclass.com/bogo54316342).
- L5. Three booking systems are indexed under the name. The Zen Planner page
  prices the Tumalo and Redmond punch card at $125; the site says $135.
  WellnessLiving carries the Bend schedule. bookrgo.app lists Redmond. A
  member searching "HIIT Logic membership" can land on a price the gym no
  longer charges. Proof: [Zen Planner template](https://hiitlogic.sites.zenplanner.com/membershipTemplate-view.cfm?membershipTemplateId=A2697A12-3FC6-4D4F-9E6A-9124BAE4C9CD),
  [WellnessLiving](https://www.wellnessliving.com/explore/locations/open-gym/us-or-bend/hiitlogic/schedule/),
  [bookrgo](https://bookrgo.app/v/hiit-logic-redmond-MTOX34).
- L6. Two support addresses in public: info@hiitlogic.com (Zen Planner,
  ZoomInfo) and support@hiitlogic.com (Sisters page). Which one a member
  should write to is not stated.

**Usability on a phone**

- L7. The free class is one form copied per gym: /free-class/,
  /free-class-bend-east/, /free-class-prineville/, /free-class-sisters/,
  /free-class-la-pine/, and presumably more. A visitor who picks the wrong
  one sends the lead to the wrong owner, and since Sisters and La Pine are
  affiliate-owned that is a real misroute. Proof: the five URLs above, all
  indexed.
- L8. Hours appear on Yelp and Yahoo for Bend West. Whether the site carries
  hours per gym, and whether the phone number is a `tel:` link, needs a
  render.

**Brand**

- L9. The mark, palette and type were not seen. If Jon sends the files the
  way he sent the Ruin the Party logo, they get lifted, not redrawn
  (glaze.md, "Lift the real thing").

**Platform**

- L10. WordPress is the likely build: `/category/members/` paths and the
  "Post - Site" title separator are both WordPress defaults. If so, the
  2020 rebuild is six years old and was done in a hurry by the owners
  themselves (ShoutoutAtlanta). That is a fact to handle with care in the
  letter: he built it, under pressure, and it worked. Proof of the pattern:
  [/category/members/](https://hiitlogic.com/category/members/).

## 4. The part that matters most

For a cold prospect the wedge is ownership. HIIT Logic almost certainly owns
its WordPress install, so that argument would land on nothing. The wedge here
is different and it is in the facts above:

**Seven gyms, at least three owners, one site that does not know which gym
you mean.** Every location is a separate Google listing with its own reviews
and its own owner answering the phone, and the site hands Google one page
per gym with the same title as the home page, one free-class form per gym
that a visitor has to pick correctly, and a schedule that lives on a vendor's
domain. The thing HIIT Logic sells is a first class. The path to it is the
weakest part of the site.

Second, the rented pieces have already changed once. Zen Planner's prices are
still indexed under the name a year or more after the move to WellnessLiving
(the dates are unverified, but the two cannot both be current at different
prices). Every vendor change leaves a trail unless the site owns its own
pages for schedule and prices and the vendor sits behind them.

What we would not do, said plainly in the letter: replace WellnessLiving.
Membership billing, waivers, check-in and class capacity across seven gyms is
the "genuinely hard or genuinely regulated" case the don't-rent rule allows.
We build the front door and keep their software behind it.

## 5. What we would build

Routes, not adjectives. Fifteen pages plus the blog.

| Route | What is on it |
|---|---|
| `/` | What HIIT Logic is, the seven gyms as a map and a list with open-now state, the free class as the one action, the HIIT Logic 7 in one paragraph. |
| `/gyms/tumalo`, `/gyms/redmond`, `/gyms/bend-west`, `/gyms/bend-east`, `/gyms/prineville`, `/gyms/sisters`, `/gyms/la-pine` | One page each: address with a map, hours, the owner or lead coach by name, this gym's prices, this gym's schedule, this gym's free-class form with the gym already chosen. `LocalBusiness` schema per page, its own title and description, its own share card. Bend East says "opening" with a date field that cannot go stale silently. |
| `/free-class` | One form. Pick a gym, and the lead goes to that gym's inbox, with a copy to Redmond. Replaces five or more pages and the second domain, which redirects here. |
| `/memberships` | Every price, read from one file so a change is one edit and the gym pages and this page agree. |
| `/schedule` | WellnessLiving embedded or linked per gym. Named seam: if WellnessLiving exposes a feed we read it; if not, the page says where the live schedule is and sends people there without pretending. |
| `/volleyball` | The Redmond program. |
| `/online` | HIIT at Home, if it still runs; if not, this page is cut and the old URL redirects. |
| `/own-a-gym` | The affiliate program with its own inquiry form, since it is a different reader from a member. |
| `/about` | Katie and Jon, the 2016 Tumalo start, the coaches. |
| `/blog`, `/blog/[slug]` | The existing posts migrated, every old URL redirected. |
| `/contact` | One address, one phone per gym, which inbox answers. |

Also: a redirect for every URL the site has today (sitemap first, then the
search index), hiitlogicfreeclass.com pointed at `/free-class`, the Zen
Planner pages asked to be taken down or marked, the forms delivering over
SMTP from a mailbox they own with the honest unconfigured path, zero axe
violations at 320 and 1440 on every route, LCP under 2.5s, the JS number
recorded honestly, and the studio credit. Credit wording is Kevin's call per
build (standards.md open ruling); Ruin the Party got "Double Dipped by".

Intake questions that block this build specifically (from `intake.md`):
which gyms are company-owned and which affiliate, and who gets each lead; is
HIIT at Home still sold; who holds the hiitlogicfreeclass.com registration
and the Zen Planner account; the current WellnessLiving plan and whether it
exposes a schedule feed or only a widget; the logo as a vector; which photos
are theirs.

## 6. What it costs

Kevin owns the price. The reasoning, for his call:

- The Baker's Dozen ($2,000 and $150) is up to six pages. This is fifteen
  plus a blog, so it is a Custom Order on the menu as written.
- Ruin the Party was $4,500 and $150 for nine pages and a store, accepted
  this week, in three payments from launch. The same client reading a
  second number will compare it to that one.
- Insurance for a Cause was $3,500 for twenty-one pages and three tools.

**Recommendation: $4,500 build and $150 a month, the build in three payments
from launch day, mirroring the Ruin the Party terms he already agreed to.**
A floor of $3,500 if Kevin wants to reward a second build; a ceiling around
$6,000 if the schedule integration turns out to need WellnessLiving's API
rather than a widget. No struck-through market anchor in the letter, per the
inbound rule; for Kevin's pocket, a published US agency range for a gym site
is $8,700 to $29,000 ([projectcostestimator.com](https://projectcostestimator.com/cost/industry/gym),
read from the listing, not opened).

Two monthlies from one LLC is $300 a month. Worth saying out loud to him
rather than letting him add it up.

## 7. What Kevin runs before any of this goes out

In the glazedweb repo, against the live site. These are the house harnesses
and they replace every L tag above with an M or an R:

```bash
curl -sSI https://hiitlogic.com/ | head -20          # status, server, HSTS, redirects
curl -sSI http://hiitlogic.com/ | head -5             # does HTTP redirect up
curl -sS https://hiitlogic.com/robots.txt
curl -sS https://hiitlogic.com/sitemap.xml | head -50
curl -sS https://hiitlogic.com/ | grep -o '<title>[^<]*' ; curl -sS https://hiitlogic.com/sisters/ | grep -o '<title>[^<]*'
curl -sS https://hiitlogic.com/ | grep -c '<script'   # script count
curl -sS https://hiitlogic.com/ | grep -o 'application/ld+json' | wc -l
node glaze/scripts/audit.mjs https://hiitlogic.com/ https://hiitlogic.com/sisters/ https://hiitlogic.com/free-class/
node glaze/scripts/width-check.mjs https://hiitlogic.com/
node glaze/scripts/perf-check.mjs https://hiitlogic.com/
```

Then open on a phone: the Sisters page (L3), the free-class pages (L7), the
Zen Planner link (L5), hiitlogicfreeclass.com (L4), and the tel: links (L8).
Google Business Profile for each gym in a real browser; never claimed as
seen otherwise.

Not checked from here, and not to be described as clean: HTTPS enforcement,
certificate, headers, structured data, sitemap, robots, script and
stylesheet counts, image weights, accessibility, LCP, CLS, console errors,
the hours on the site, the mark and palette.

---

## 8. The letter, draft one

For Jon. Written as a reply to a client, not a cold pitch: no question hook,
no struck anchor, no vendor questions, ownership said once. Every bracketed
item is a fact Kevin confirms in section 7 before it stays in. The h1 is a
fact. Alternatives for Kevin at the end.

> # Seven gyms. One site built for all of them.
>
> Jon,
>
> While Ruin the Party was going live we kept landing on hiitlogic.com, and
> we would like to build it next. This is what we saw and what we would do.
> Nothing here is started.
>
> ## What we checked
>
> HIIT Logic has seven gyms with at least three owners, and the site treats
> them as one. [The home page, Sisters, Prineville and La Pine all carry the
> same title in Google: "HIIT Logic."] Someone searching for the Sisters gym
> sees four identical results and picks one.
>
> [The Sisters page still says "opening in January 2026."] [The site offers
> a first class free. hiitlogicfreeclass.com offers a free seven days.] [A
> Zen Planner page under your name still prices the punch card at $125; the
> site says $135.] None of this is a design problem. It is seven gyms' worth
> of facts living in more places than one person can keep current.
>
> The free class is the thing you sell, and the path to it is a form copied
> once per gym. Pick the wrong page and the lead goes to the wrong owner.
>
> ## What we would build
>
> A page for each gym: address, hours, who runs it, that gym's prices, that
> gym's schedule, and the free-class form with the gym already chosen. One
> free-class form behind all of them that sends each lead to the right
> inbox, with a copy to Redmond. Memberships read from one file, so a price
> changes once. The schedule stays on WellnessLiving; we build the front
> door and keep your software behind it. Volleyball, the affiliate program
> with its own form, HIIT at Home if it still runs, the blog with every old
> link redirected, and hiitlogicfreeclass.com pointed at your own page.
>
> Every page gets its own title and description and its own share card.
> Each gym is marked up so Google reads it as a place. Accessibility is
> measured at phone and desktop widths on every page, and the numbers go in
> the README you own.
>
> Same terms as Ruin the Party. You own the code, the content and the
> accounts. Month to month after launch, thirty days' notice, and you can
> leave with everything.
>
> ## What it costs
>
> $[4,500] to build, in three payments of $[1,500] from the day it goes
> live. $150 a month after that for hosting, updates, two hours of edits,
> and a monthly check that every price and every opening date on the site
> is still true. That is a second $150 beside Ruin the Party's, and we would
> rather say that than have you add it up.
>
> ## If you want to go ahead
>
> Send the logo file, the current prices by gym, and who should get each
> gym's leads. The build takes about three weeks from there. Launch ↗
>
> Kevin

**h1 alternatives for Kevin.** "A HIIT Logic site that knows which gym you
mean." (cuter). "Your seven gyms, one page each." (plainer). The draft above
is the fact-shaped one.

**Copy count on the draft.** "gym" or "gyms" appears twelve times, which is
the subject and is fine for a letter about seven of them. "seven" four
times, one of them in "seven days". "free class" three. One "X not Y" shape ("None of this is a design
problem. It is...") and it is the only one; it stays unless Kevin wants it
out. No lists of three by habit (the route list in the second section is
however many there are). No em dashes.

**Before you send (proposal.md list).** Every bracketed fact opened in a
browser. The demo built and deployed (not started; this document is the
scout). Two link cards. Pitch host and vercel.app noindex. The price is a
number. Read once as Jon. Search the letter for "in fairness", "to be fair",
"admittedly", "of course", "that said": zero hits in the draft.

## 9. What has to happen in the studio

- **Ledger.** HIIT Logic needs its own row (scouted, channel warm, next
  action "Kevin rules the price"). The store is the private dashboard,
  unreachable from this sandbox; add it with `ledger.mjs add` on the Mac.
- **Registry.** `lib/customOrders.js` gets a `hiitlogic` row once the price is
  ruled, so `/agreement/hiitlogic` and `/build/hiitlogic` exist for the
  letter's one action. Not written here because the price is Kevin's.
- **Repo.** `hershock48/hiitlogic`, pitch at `hiitlogic.glazedweb.com`, demo
  at `/demo`, per `proposal.md`. Not created.
- **Second opinion.** `second.mjs` on the letter needs a Codex sign-in the
  sandbox does not have.
- **Backlog.** C10 in `glaze/backlog.md`.
