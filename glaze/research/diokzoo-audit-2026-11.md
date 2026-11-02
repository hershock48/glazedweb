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
  studio runs on every build (glaze/launch.md), which a diocese answers for
  under the ADA in a way a parish secretary does not.
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
