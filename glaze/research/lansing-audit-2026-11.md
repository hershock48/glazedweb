# Diocese of Lansing: every parish website, measured (2026-11-04)

The second diocese. Read with `tools/sites-audit.mjs` in the stmarymarshall
repo: every parish site named in the diocese's own directory
(dioceseoflansing.org/parish-list-vicariate, 73 parishes in six
vicariates, read by `tools/lansing-import.mjs`), opened on a phone profile
in a real browser, home page only, markup read the same way as Kalamazoo
(`diokzoo-audit-2026-11.md`). Raw rows in `lansing-audit-2026-11.csv`.

## What is different about Lansing

The diocese is not on eCatholic as a diocese. Its own site is a custom
Drupal build; its parish directory has name, address, phone, website and
vicariate, and no Mass times at all (the site sends people to
MassTimes.org). Each parish chose its own platform. That is the opposite
of Kalamazoo's one-template problem and it has its own costs: nothing is
shared, nothing is measured the same way, and the diocese has no feed of
its own parishes' schedules to point anyone at.

| Platform | Sites |
|---|---|
| eCatholic | 26 |
| WordPress | 14 |
| Diocesan.com (WeConnect) | 7 |
| Custom or unknown | 6 |
| Wix | 5 |
| Squarespace | 5 |
| Weebly | 4 |

72 distinct sites for 73 parishes (one directory entry's "website" is a
Facebook page). 67 answered. Five did not: stmarymorrice.org answers 403,
christthekingparishflint.org fails its certificate (the name on the
certificate is not the site's), and srbcatholic.com, stjos.com and the
Facebook page did not load inside 45 seconds.

## The 67 home pages that answered

| Measure | Share of 67 | Kalamazoo (42) |
|---|---|---|
| No meta description | 64% (43) | 60% |
| No link-card image (og:image) | 57% (38) | 93% |
| No structured data at all | 67% (45) | 100% |
| Missing or duplicate h1 | 55% (37) | 14% |
| Phone not tappable | 37% (25) | 17% |
| Email not tappable | 58% (39) | 50% |
| No office hours on the home page | 37% (25) | 64% |
| Mass times as text on the home page | 28% (19) | |
| No online giving link detected | 28% (19) | 52% |
| Livestream or video link | 79% (53) | 33% |
| Spanish on the home page | 4% (3) | 10% |
| Newest year on the page before 2026 | 8 sites | 1 |

Median home page: 16 scripts, 79 requests, 11 images; 13 sites serve five
or more images 1400px wide or wider to a phone; three load more than 100
images. Giving providers where one was found: WeShare 9, OSV 8, PayPal 6,
Vanco 4, Pushpay 2, nineteen others, nineteen none.

The third that has structured data is the WordPress and Squarespace
sites' generic page markup (a WebSite or Organization record), not a
Church with its Mass times; no site in either diocese publishes its
schedule as data.

## What it means for the pitch

- **Livestream is the strength to build on, not the gap.** Four in five
  Lansing parishes link a stream, against one in three in Kalamazoo. The
  Watch page and the bishop's voice land on habits the parishes already
  have; the diocese's podcast ("Made for Mission", Buzzsprout) gives the
  voice module an audio episode from day one.
- **The finder is the gap.** The diocese has no schedule of its own: its
  directory sends people to MassTimes.org, and 28% of parishes do not even
  put a Mass time on their home page. Narthex's finder for Lansing carries
  every parish's address, phone, site and vicariate today, and gains times
  one parish at a time as each one joins. There is no eCatholic finder to
  replace here; there is a missing one to supply.
- **Seven platforms means no one to blame and no one to ask.** The letter
  says it that way: the diocese cannot hand its parishes a standard it
  does not have.
- **The eCatholic 26** are the same template as Kalamazoo's 41 and carry
  the same five gaps; the Kalamazoo letter's measurements apply to them
  verbatim.

## Not measured

Inner pages (Kalamazoo's 490-page crawl has no Lansing twin yet).
Accessibility beyond h1 and tappable links. Speed, beyond request counts.
