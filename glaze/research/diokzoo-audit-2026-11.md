# Diocese of Kalamazoo: every parish website, measured

Measured 2026-11-02 by opening each site in a real browser and reading its
markup; eCatholic sites sit behind a Cloudflare challenge that blocks scripted
fetches, so nothing here came from curl. The raw rows are in
`diokzoo-audit-2026-11.csv` beside this file. Home pages only; inner pages
were not crawled, except St. Mary Marshall, which was rebuilt
(`hershock48/stmarymarshall`).

## The population

The diocesan Parish Finder (diokzoo.org/parishfinder) lists 60 parishes and
missions with 46 distinct websites. Four do not work: olqop.org (Bridgman)
has an expired TLS certificate, sscmparish.org (Wayland) and
stedwardmendon.org (Mendon) do not resolve, stjosephwhitepigeon.org times
out. That leaves 42 reachable sites. **41 are eCatholic; one is WordPress
(St. Joseph, Battle Creek).** The diocese's own site is eCatholic too.

The eCatholic customer ids tell the history. Seven sites carry ids under
15,000 (St. John Bosco 5297, Our Lady of the Lake 5403, the Cathedral 5540,
**St. Mary Marshall 6225**, St. Mary Niles 11002, St. Joseph St. Joseph
12487, Blessed Sacrament 14715): early customers with their own accounts.
Seventeen sites sit in a tight block from 19059 to 19971, which is a batch
onboarding, almost certainly the diocesan partnership
(ecatholic.com/kzoo). The rest trail upward to 39077. So "the diocese pays"
may be true for the 19xxx block and not for St. Mary, whose account predates
the deal. The parish's own invoice settles it.

**Re-measured the same evening, every site again in the browser pane.**
Two of the four "down" sites load now: olqop.org (Bridgman) answers over
TLS and is a hand-built page with no `<title>` at all; stjosephwhitepigeon.org
loads, is not eCatholic, and its home-page headline misspells "Eucharist"
as "Eurcharist". sscmparish.org still fails the TLS handshake and
stedwardmendon.org still does not resolve; the Parish Finder links all
four. So: 44 of 46 load, 41 eCatholic, one WordPress, two hand-built. The
table below is over the 42 template sites and held on the re-measure
except og:image, which is 40 of 42 (95%), not 39; only St. Mark Niles and
St. Catherine of Siena carry one. New, verified, in the letter: St.
Anthony Buchanan's home page has 85 links with no text, image or label
(St. Ambrose Parchment 61, San Felipe 28), the template's slideshow and
tab controls. The MassTime-panel count (30 of 42) was not re-measured;
the second pass used a broader selector and is not comparable.

## What the 42 home pages have in common

| Measure | Share of 42 | Notes |
|---|---|---|
| No meta description | 60% (25) | The page's one sentence in a search result is blank or auto-filled. |
| No link-card image (og:image) | 93% (39) | A shared link shows no picture in a text or on Facebook. |
| No structured data | 100% (42) | No Church record, no Mass events, nothing for Google's "Mass times" box or an answer engine. |
| Missing or duplicate h1 | 14% (6) | Five eCatholic sites have no h1 at all; the WordPress site has seven. |
| Phone not tappable | 17% (7) | The number is plain text; a phone cannot dial it. |
| Email not tappable | 50% (21) | |
| No office hours on the home page | 64% (27) | The most-asked question after Mass times. |
| No online giving link detected | 52% (22) | 12 use OSV, 7 Vanco, 1 links a PDF form. |
| Livestream or video link | 33% (14) | |
| Spanish on the home page | 10% (4) | Holy Angels, San Felipe, St. Joseph Kalamazoo, St. Joseph Battle Creek. |
| eCatholic MassTime panel | 71% (30) | The feature that feeds the diocesan finder; 12 sites type their times as text instead. |
| More than 100 images on the home page | 6 sites | St. Mary Paw Paw loads 472, St. Joseph St. Joseph 431. |
| Five or more images 1400px+ wide | 14 sites | Full slideshows served to every phone. |
| Newest year on the page before 2026 | St. Mary Niles (2022) | Twelve sites show no date at all, so staleness cannot be judged from outside. |

Median home page: 16 scripts, 8 stylesheets, 13 images, 46 requests. The
template is the same on every one, so the faults are the same on every one.

## The inner pages (read 2026-11-02, evening)

Kevin asked why only the home pages were measured. So twelve inner pages
were read on each of the 42 sites, the ones in each main menu, 490 pages in
all, fetched inside the browser pane and parsed for title, description and
headings.

| Measured on 490 inner pages | Result |
|---|---|
| No meta description | 454 of 490 (93%) |
| Every inner page has two or more h1 | 34 of 42 sites (the template prints the parish name and the page title both as h1; St. Charles Coldwater's history page has 17, St. Mary's Visitation's baptism page 5) |
| Module pages titled only "Bulletin", "Calendar", "News", "Photo Albums" or "Events", no parish name | 27 of 42 sites |
| Blank page title | 7 pages on 6 sites, incl. St. Basil South Haven's Mass times page ("  - St. Basil Parish") and St. Rose Hastings' contact page |
| Titles that are a sentence or the wrong page | Sacred Heart Silver Creek contact "office hours mon & Fri 9am-1pm"; St. Anthony Buchanan contact "Please visit or reach out to us with any questions."; St. Mary Marshall three "Please click to learn more..." titles; St. John Bosco Mattawan /marriage-preparation "Funerals" and /contact-us "St. Margaret Mary Mission"; Holy Maternity /contact-us "Our Staff" |
| 404 from the main menu | St. Ann Cassopolis (/worship-with-us), St. Mary Marshall |
| Thin page | St. Joseph Battle Creek (WordPress) employment page, 13 words |

In the letter as the claim card "The inner pages are worse than the front
pages" with three verify links (St. Basil's Mass times, Sacred Heart's
contact page, St. John Bosco's marriage page).

## Research for the "Why it matters" section (verified at the source)

- Pew Research Center, *Choosing a New Church or House of Worship*, 2016
  (5,000 adults, 2015 fieldwork): 49% have ever looked for a new
  congregation; of those, 85% attended a service, 69% talked to members, 68%
  friends, 55% clergy, 37% looked online, 19% phoned. 47% of searches in the
  last five years used the internet against 26% of older searches; 59% of
  searchers under 30. What mattered: sermons 83%, feeling welcomed 79%,
  style 74%, location 70%, children's RE 56%.
- CARA, *Catholic Media Use Report* 2023 (1,019 self-identified Catholics,
  April 21 to May 5 2023, non-probability sample): 44% have used their parish
  website, 5% in 2005; 62% of monthly-or-more attenders visited it recently;
  "very much" use during the pandemic 24% (18-34), 24% (35-54), 10% (55+).
- Google, *The Need for Mobile Speed*, 2016: 53% of mobile visits abandoned
  past three seconds.
- Stanford Persuasive Technology Lab (Fogg), 2002, 2,684 people: "design
  look" in 46.1% of credibility comments, the most frequent factor.
- Not used: the "80% / 70% visit the website before attending" figures are
  church-marketing blog numbers with no study behind them. Churches are
  exempt from ADA Title III website rules, so accessibility is a quality
  claim, never a legal one.

## What that means

Every parish is paying, directly or through the diocese, for the same
template with the same five gaps: no search-engine description, no link card,
no structured data, hours missing, half the contact details untappable. None
of these is a design opinion. Each is a measurement, and each is fixed by the
build, not by the office.

The template's one real asset is the MassTime panel, because it feeds the
diocesan Parish Finder. Any replacement has to keep that feed working or the
finder goes dark one parish at a time. The St. Mary rebuild already holds the
schedule as structured data; emitting it as the finder's feed is a route, not
a project.

## The diocese plan, if the diocese wants it

Not a parish-by-parish sale. One conversation with the Pastoral Center
(215 N. Westnedge, Kalamazoo, 269-349-8714), and the thing being sold is a
platform the diocese owns, with the parishes as tenants.

**What the diocese gets.**
- One codebase, 60 parish sites, each on its own domain with its own
  photos and words, none of them a template.
- Mass, Confession and Adoration as structured data on every parish, feeding
  the diocesan finder and, through schema.org, Google's Mass-times box and
  the Mass-finder apps. The diocese becomes the source of its own schedule
  data instead of a subscriber to someone else's.
- Every page measured: zero accessibility violations, the same checks the
  studio runs on every build (glaze/launch.md). Churches are exempt from the
  ADA's public-accommodation website rules (Church Law and Tax, Church
  Leaders, 2019), so this is a quality claim, not a legal one; say it that
  way.
- Ownership: the diocese holds the repository, the hosting and every domain.
  Leaving means taking it, not exporting it.
- Office self-service for the four things that change (Mass times, holy
  days, staff, the calendar), through the owner-panel line the studio already
  has (glaze/catalog, owner-controls.md).

**How it gets built.** The 41 eCatholic sites share one markup, which is
why St. Mary took a day: the tabs, the MassTime panel, the staff list, the
documents on files.ecatholic.com and the iCalendar feed are all in
predictable places. A migration script reads each parish's eCatholic site
into the same data shape St. Mary uses (`lib/site.ts`, `lib/schedule.ts`,
`lib/events.ts`, `lib/content.ts`, `public/docs/`), and a human reads the
result once per parish. The order: five parishes as a pilot (St. Mary
Marshall plus four the diocese picks, one of them Spanish-speaking), then
the 19xxx block, then the rest, then the fourteen with no site at all.

**Price, to be ruled by Kevin.** The pricing memory says Square's $49 is
the floor and the pitch is never "cheaper." The anchor here is what the
diocese or parishes pay eCatholic today, which is unknown: the Archdiocese
of Detroit's comparable deal is $50 per site per month. A diocesan platform
at $99 per parish per month is $4,950 a month for 50 sites, $59,400 a year,
against a build that is mostly one script plus a day of reading per parish.
Whether the build fee is per parish or one diocesan number is Kevin's call;
the studio menu has no shape for sixty sites yet.

**What has to be true first.**
1. Who holds the eCatholic contract and when it ends. Stacie at St. Mary is
   asking; the answer decides whether this is a 2027 conversation or a 2028 one.
2. Whether the diocese wants to own a platform or buy a service. The pitch
   is ownership; a diocese that wants a vendor to blame is not this client.
3. The MassTime feed format the finder consumes, so the replacement feeds
   it from day one.
4. A Spanish-capable reviewer for San Felipe, Holy Angels and the two St.
   Josephs.

**What not to do.** Do not pitch 41 pastors one at a time; the deal is above
them. Do not build a second parish site before the contract facts are in.
Do not say "cheaper" anywhere.

## Sites by name

Reachable eCatholic (41): Blessed Sacrament Allegan, Holy Angels Sturgis,
Holy Family Decatur, Holy Maternity of Mary Dowagiac, Immaculate Conception
Three Rivers, St. Charles Borromeo Coldwater (also serves Our Lady of
Fatima), Our Lady of the Lake Edwardsburg, Sacred Heart of Mary Silver
Creek, San Felipe de Jesus Fennville, SS. John and Bernard Benton Harbor,
St. Ambrose Delton, St. Ambrose Parchment, St. Ann Cassopolis, St. Ann
Augusta, St. Anthony Buchanan, St. Augustine Cathedral, St. Basil South
Haven, St. Catherine of Siena Portage, St. John Bosco Mattawan, St. John the
Evangelist Albion, St. Joseph Kalamazoo, St. Joseph Watervliet, St. Joseph
St. Joseph (Downtown and South), St. Jude Gobles, St. Margaret Otsego, St.
Mark Niles, St. Martin of Tours Vicksburg, St. Mary Niles, St. Mary of the
Lake New Buffalo, St. Mary Marshall, St. Mary Paw Paw, St. Mary Kalamazoo,
St. Mary's Assumption Bronson, St. Mary's Visitation Byron Center, St. Monica
Kalamazoo, St. Peter Douglas, St. Philip Battle Creek, St. Rose of Lima
Hastings, St. Stanislaus Dorr, St. Therese Wayland, St. Thomas More
Kalamazoo.

WordPress (1): St. Joseph Battle Creek.

Down or broken (4): Our Lady Queen of Peace Bridgman (expired certificate),
SS. Cyril and Methodius Wayland, St. Edward Mendon, St. Joseph White Pigeon.

No website listed (about 14): the missions and the smallest parishes,
including St. Agnes Sawyer, St. Barbara Colon, St. Clare Centreville, St.
Cyril Nashville, St. Gabriel Berrien Springs, St. Jerome Battle Creek, St.
Margaret Mary Marcellus, Our Lady of Great Oak Bellevue, Sacred Heart
Allegan, Sacred Heart Bangor, Immaculate Conception Hartford, St. Mary of
the Assumption Three Oaks.
