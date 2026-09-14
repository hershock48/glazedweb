# Prospecting

**How the studio picks who to pitch.** Since the 2026-09-01 ruling in
`standards.md` ("Who the menu is for now") the studio sells ordering and POS
integration to businesses that take orders. Until September 2026 the targets
were chosen by walking downtown Marshall. This file is the scorecard, the
signals that turned out to predict a fit, the sources that work, and a dated
appendix with the first statewide scan. The scorecard is durable. The appendix
goes stale; re-run it rather than trusting it after a season.

---

## The scorecard

Score a name out of 14 before spending an hour on it. Anything under 7 is a
bench name, not a pitch.

| Signal | Points | How to score it |
|---|---|---|
| **A. Presence gap** | 0 to 3 | 3: no site at all, or the obvious domain is parked, squatted or dead. 2: a site exists but is dated, broken, a free Wix subdomain, or has no menu. 1: a working site with no ordering. 0: a current site with its own ordering (stop here). |
| **B. Demand proof** | 0 to 3 | 3: 4.5+ on 500+ Google reviews, or a top-three town ranking on Tripadvisor, or press (Roadfood, PBS, NYT, MLive best-of). 2: 4.3+ on 150+ Google or 40+ Yelp/Tripadvisor. 1: under that but reviews mention lines, waits or selling out. 0: thin or mixed. |
| **C. Order-shaped** | 0 to 2 | 2: takeout, phone orders, call-ahead, sells out, catering, dozens, holiday orders, drive-through. 1: sit-down with some carryout. 0: reservations-only dining, a bar with no kitchen orders. |
| **D. Transition** | 0 to 2 | 2: sold or handed to a younger owner in the last 24 months, or listed for sale now. 1: founder died or retired and the family carried on, or kids visibly run the floor. 0: same owner for decades with no tell. |
| **E. Proximity** | 0 to 2 | 2: 30 minutes from Marshall. 1: 60 minutes. 0: farther. A far name is not dead; it is batched into a trip or sold by letter and demo link. |
| **F. Rented stack** | 0 to 1 | 1: on DoorDash, Grubhub, Uber Eats, Toast or Clover without ordering of their own, or a card surcharge they wrote themselves. This is the "five other companies own your name" hook. |
| **G. Referral path** | 0 to 1 | 1: same town or chamber as a signed client, or a client can name the owner. |

**Disqualifiers, regardless of score:** a chain or franchise, a polished site with
its own ordering, an announced closure, or a Toast or Clover contract signed in
the last year (they are locked; note the date and come back).

---

## The signals that predicted a fit

Learned in the 2026-09-13 scan. Each one is cheap to check.

- **Scraper sites ranking for the name.** weeblyte, wheree, res-menu,
  hey-restaurants, gotoeat.net, Locallya, placejoys and `.site` or `.shop`
  domains only rank when the business has no site of its own. They are also,
  verbatim, the list for the proposal's "Do you own your website?" section.
- **The obvious domain is parked or dead.** masondepotdiner.com is for sale.
  mikesplace.com is squatted. nipnsipdrive-in.com does not resolve.
  ginospizzagr.com refuses connections. One `curl -I` each.
- **"Claim this listing."** Tripadvisor prints it in the open; Yelp shows a claim
  banner. An unclaimed listing means nobody at the business has ever logged
  into anything about the business.
- **Cash only with a line out the door.** A business that never needed a system
  and whose newest owner is the one who will add one. Mike's Famous Ham Place
  sold in October 2024 and the buyers' first announcement was "we will take
  cards and add catering."
- **Sells out by noon, call ahead.** Hungarian Strudel Shop, Mr. Foisie's
  Pasties, Amy J's. Pre-order is the whole product.
- **Hours that live only on Facebook.** Hinkley Bakery closed for two months in
  summer 2026 and announced it in a post. Customers asked Tripadvisor whether it
  had closed for good. Publishing hours is the first thing a site does.
- **Transition tells.** A funeral-home obituary naming the founder (Richie's
  Koffee Shop), a BizBuySell or BizQuest listing, a "sold" story on a local
  radio station site (WGRD, WITL, WBCH, WKHM break it before the papers), a
  second Facebook page with a new name ("Schlenkers / Fullers"), or a
  Tripadvisor review that says "new owners this month" (Mason Depot Diner).

---

## Where to look, and what blocks you

| Need | Source | Note |
|---|---|---|
| Google rating and count | Restaurantji, Wanderlog | Both mirror Google without a CAPTCHA. Counts disagree; quote the lower one. |
| Unclaimed flag, town rank | Tripadvisor town lists | Fetchable. Yelp blocks fetches; read it in a real browser. |
| Owner names | BBB profiles, chamber directories, obituaries, Secretary of State LLC search | BBB names the principal on most restaurants. |
| Sale and closure news | MLive, WGRD, WITL, WBCH, WKHM, WLNS, WWMT, Crain's | MLive and WLNS block fetches; the snippet usually carries the fact. |
| Pending transitions | BizBuySell, BizQuest, LoopNet | Owners list before they tell customers. |
| Third-party menus | MenuPix, Menus With Price, AllMenus | If the only priced menu is here, the business has no site. |

Google itself serves a CAPTCHA to automated browsers. Do not claim anything
about a Google Business Profile that was not seen in a real browser; say "not
checked," as the Mike's Place letter does.

---

## Timing and routing

- **Seasonal stands pitch in January.** Bill's Hot Dog Stand (Feb to Oct), West
  Pier Drive-In (to Sept 30), The Root Beer Stand (April to Sept). A letter in
  January lands while the owner is planning the season.
- **New owners pitch inside six months of the sale**, before they sign a Toast
  or Clover term. After that the fit drops to a rebuild in year three.
- **Anniversaries are hooks.** Schlenker's turns 100 in 2027. Hinkley is 113.
  Mike's Famous Ham Place is 65.
- **Cluster by trip.** Jackson: Schlenker's, Hinkley, Candi's BZB, Milligan's
  meat market. Lansing and Mason: Nip N Sip, Golden Harvest, Weston's Kewpee,
  Mason Depot. Holland: Good Time Donuts, Donutville, Windmill. Straits:
  Keyhole, West Pier, Zorba's. Escanaba: Rosy's, Gram's, Frapps, then Clyde's
  Manistique on US-2.

---

## Appendix: statewide scan, 2026-09-13

Five parallel scans (succession angle, Southwest, West and Lansing, Southeast
and Flint, North and UP), about 190 searches and 500 page checks. Marshall
49068 was excluded because it was scanned 2026-09-11. Every name below was
checked for a site of its own; "no site" means only scraper pages and social
rank. Google counts are via Restaurantji or Wanderlog. Drive times are from
Marshall.

Each of the five has a row in the ledger (`glaze/ledger.md`) as of
2026-09-13, so what happens to them next is logged there, not here.

### The five

**1. Schlenker's Sandwich Shop, Jackson. 10 of 14.**
1104 E Ganson St, Jackson 49201. (517) 783-1667. Since 1927, on Ganson since
1969. Owners Nick and Tina Fuller, lifelong customers who bought it from Bob
Fitzpatrick in September 2018 as the fourth owners; volume is up since
(50 lb of hand-rolled sirloin a day). Google 4.7 on 781, Tripadvisor 4.4 on 38
and unclaimed, Yelp 4.0 on 98, Roadfood, PBS Under the Radar 2025. No site;
weeblyte and wheree pages rank for the name. Cash only until 2024. Takeout is
already a big share. About 40 minutes. **Hook:** it turns 100 in 2027 and the
first search result for its name is a scraper.

**2. Mason Depot Diner, Mason. 9 of 14.**
111 Mason St, Mason 48854. (517) 676-3344. Breakfast and lunch in the 1902 depot.
Rod and Kathy Hunt listed it at $650,000 in August 2024 to retire; new owners
took over January 2025 and reviews since praise them. Buyer names not found;
the chamber listing names nobody. No site; masondepotdiner.com is parked for
sale; Facebook and Instagram only. Cash only. Google 4.6 on 184, Tripadvisor
4.3 on 34, Yelp 42. About 50 minutes. **Hook:** the domain with their name on
it is for sale to anyone.

**3. Mike's Famous Ham Place, Detroit. 10 of 14, but 1 hour 50.**
3700 Michigan Ave, Detroit 48216. (313) 894-6922. Opened 1961; Sadiq "Mike" and
Yvet Muftari owned it from 1974 and sold in October 2024 to longtime customers
Kim and John Lambert of St. Clair Shores. Announced changes: credit cards,
catering, a cheesecake. NYT 26 Best Dishes 2024. Google 4.9 on 213. No site
found. Historically cash only. **Hook:** catering with no order form, and a
new owner who already said out loud what they need.

**4. Hinkley Bakery, Jackson. 9 of 14.**
700 S Blackstone St, Jackson 49203. (517) 782-1122. Since 1913, fourth
generation. Google 4.9 on 1,574, Tripadvisor 4.8 on 291 and number one of 225
in Jackson, MLive best donuts. Cash only. No site. Closed "until further
notice" December 2024 for maintenance, reopened, then posted a two-month heat
break for July and August 2026; Tripadvisor carries customer questions asking
whether it closed for good. Same trip as Schlenker's. **Hook:** the most
reviewed bakery in the region has nowhere to publish its hours. Call first;
an owner posting heat breaks may be nearer a handoff than a rebuild.

**5. Richie's Koffee Shop, Hastings. 8 of 14.**
146 W State St, Hastings 49058. (269) 945-4327. Since 1979. Founder Richard
Marsh died September 2022 at 80; his obituary names daughters Toni and
Courtney and does not say who runs it now. Two Facebook pages exist, which
reads as a page reset at the handoff. Cash or check only, ATM inside. No site;
gotoeat.net and res-menu rank. Google 4.3 on 964, Restaurantji 4.1 on 219,
Tripadvisor 3.8 on 22 and unclaimed. About 50 minutes. **Hook:** whoever
inherited a cash-only diner with 964 reviews inherited no way to take a card.
Weakest reputation of the five; confirm the operator before writing.

### The bench, best first

| Name | Town | Score | Why it is not in the five |
|---|---|---|---|
| Bill's Hot Dog Stand | Ypsilanti | 9 | 1939, Google 4.7 on 551, cash only, Facebook only, unclaimed. Seasonal Feb to Oct, no transition. Pitch in January. |
| Nip N Sip Drive In | Lansing | 8 | Takeout-only carhop since the 1960s, cash only, dead domain, Google 4.5 on 339. Owner unknown. |
| Golden Harvest | Lansing | 7 | Cult diner, Yelp 772, cash or Venmo only, no site. Sit-down, four days a week; ordering fit is weak. |
| Keyhole Bar & Grill | Mackinaw City | 8 | Sharon Zulski 40+ years with her children on the floor, Google 4.4 on 626, no site. 3 hours 50. |
| Clyde's Drive-In | Manistique | 8 | Cliff and Gail Blose since the early 1990s, Google 4.8 on 1,660, no site. 5 hours. |
| Whitey's Restaurant | Davison | 7 | Fish and chips since 1955, drive-through, Google 4.4 on 436, site has no menu. 1 hour 35. |
| Hungarian Strudel Shop | Allen Park | 7 | Since 1974, sells out by noon, frozen product, no site, cash only. 1 hour 35. |
| Charlie's Tavern | Albion | 6 | Since 1944, free Wix subdomain, 15 minutes from the studio. Google count not verified. |
| Choo Choo Grill | Grand Rapids | 6 | Listed for sale 2023 at owner's retirement; dated site. Unknown whether it sold. |
| Angelo's Italian Eatery | Portage | 5 | Sold Jan 2026 to Bryan and Missie Adams, but they run SkyTab ordering. A POS consolidation pitch, not a first system. |
| Mr. Foisie's Pasties | Cadillac | 7 | Sells out daily, "call ahead," unclaimed, no site. 2 hours 15. |

### Checked and set aside

Own site with ordering: Yesterdog (sold 2025, modern site), Coach's Pub
(Toast), Sara's Pizza Hudsonville (Heartland), Polish Village Cafe, Byron
Family Restaurant, Mr. Don's, Pizza Sam's, Apple Knockers, Fricano's. Closed
or closing: Clara's on the River, Harvey's on the Mall, Fat Boy Burgers,
Kountry Kitchen Cadillac, Telly's Coney, Campau Tower. Not a transition:
Crews Inn (sold to a neighboring operator), Zimmerman's Meat Market (status
contradictory).

### Gaps in this scan

Search budgets ran out before dedicated passes on Hillsdale, Jonesville, Three
Rivers, Chelsea, Monroe, Bay City, Frankenmuth, Midland, Corktown and Eastern
Market, plus meat markets and florists statewide. Yelp claim status was not
checked anywhere except by snippet.
