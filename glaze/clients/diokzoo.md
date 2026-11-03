# Diocese of Kalamazoo (the parish platform)

**Repo** `hershock48/stmarymarshall` (the St. Mary repo, now a multi-parish platform) · **Prospect**, nothing sent · Pilot built 2026-11-02 ·
**Letter** kalamazoo.glazedweb.com · **Demos** stmarymarshall.glazedweb.com/demo, stphilip.glazedweb.com, sanfelipe.glazedweb.com · **Feed** kalamazoo.glazedweb.com/diocese/mass-times.json · all noindex.

## What they are

The Diocese of Kalamazoo, nine counties of southwest Michigan, Bishop Edward
M. Lohse (installed July 25, 2023). Pastoral Center at 215 N. Westnedge Ave,
Kalamazoo 49007, (269) 349-8714. Sixty parishes and missions in the Parish
Finder, 46 distinct websites, 41 of the 42 reachable ones eCatholic under a
diocesan partnership (ecatholic.com/kzoo). The audit of every home page is
`glaze/research/diokzoo-audit-2026-11.md` and its CSV.

## How this came about

St. Mary Marshall was rebuilt as a gift (`stmarymarshall.md`). On
2026-11-02 the office said the diocese pays for the website and would ask
someone there about it; Kevin said he could do all of them. Kevin's ruling
the same day: do not wait for the contract facts, build the work and a
proposal that pokes holes, and let that open the door.

## What is built

One deployment, parish per Host header. St. Mary (permission granted), St.
Philip Battle Creek and San Felipe de Jesús Fennville (both read off their
public eCatholic sites and feeds on 2026-11-01 without asking them; the
letter says so). San Felipe is in Spanish throughout: every platform word
lives in `lib/i18n.ts` in both languages and a parish picks one. A diocesan
feed joins every parish's Mass, Confession and Adoration times as one JSON
file, the thing the Parish Finder would read from the diocese instead of
from eCatholic.

Since the evening of 2026-11-02: each parish has its own palette
(`Parish.theme`, St. Philip wine and gold, San Felipe umber with Marian
blue and amber; `tools/palette-check.mjs` must clear every role); `/diocese`
on any host is the readable twin of the feed, every parish's address and
schedule on one page, which is what the letter's "The diocese on one page"
box opens (it used to open the raw JSON). It is read-only. The letter
never promises a management panel; an office panel for self-service edits
is the phase-two add-on the cost section says is quoted first.

The letter opens in the first person with the story (a parishioner whose
own parish site was the problem, now wanting to help the whole area, a
person inside the diocese rather than a template vendor), a "What the
monthly covers" table (hosting, security, backups, edits, checks, feed, a
person), four bar charts written by `tools/letter-charts.mjs` (missing
items on the 42 home pages, images per home page, Pew 2016 on how people
search, CARA 2023 on parish-website use), two stat tiles (Stanford 46%,
Google 53%) and a claim card from the 490-page inner crawl. The research
and the crawl are in the research note.

## The diocese layer and the chancery view (built 2026-11-03)

Kevin, 2026-11-03: "yes build this in" (the finder, events, groups and
notices folded into the diocesan agreement at no extra charge) and "also we
need to build this" (the chancery view). Built the same day in the
stmarymarshall repo:

- **/diocese/near**: Mass near you. Zip, town or the phone's location;
  10/25/50 miles; every parish nearest first with the next Mass, Confession
  and Adoration from the clock. **All sixty parishes and missions from day
  one**: the three platform parishes from their data, the other 57 read
  from the diocese's own Parish Finder (diokzoo.org/parishfinder, one page
  with every address and Mass panel) by tools/finder-import.mjs, geocoded
  once through Nominatim. All three of the finder's blocks are read (Mass,
  Confession, Adoration: 56 parishes list confession times, 47 adoration,
  several perpetual), since the evening of 2026-11-03.
- **/diocese/events** (14 days, by kind and town, add-to-calendar) and
  **/diocese/groups** (ministries and formation groups with contacts), from
  platform parishes; **/diocese** every parish on one page.
- **Nearby strip** on every parish Mass times page (three nearest, next
  Mass); diocese links in every footer; **chancery notices**
  (parishes/diocese/notices.ts) at the top of every parish home page unless
  the parish opts out. One Advent notice is in the file as the pattern.
- **/diocese/office**, the chancery view, behind DIOCESE_PASSCODE: each
  site's freshness and unconfirmed facts from the data, the finder's
  coverage, and with DATABASE_URL (Neon, db/tally.sql) counts of pages
  served, finder searches (point rounded to ~7 miles plus result count,
  empty searches called out as planning data), forms sent, Give taps (the
  Give button leaves through /give/out). No cookies, ids or contents.
- Letter: three new "demo" boxes (the finder for all sixty, this week +
  groups + notices, the chancery view), a "diocese layer" row in what the
  monthly covers, and the cost line now quotes the chancery view and the
  office panel separately; the finder is no longer "quoted separately".
  Agreement row scope and notIncluded match.

**Reviewed 2026-11-03** (Kevin: "double check and debug"): a fresh-session
review found one real data bug, finder rows whose note carries the rule
("2nd & 4th Fridays", "First Thursday", "May-October", "Sept thru May",
"Memorial Day thru Labor Day", "Communion Service Only", "No Mass Tuesdays
during...") shown as weekly Masses; fixed by parsing ordinals into dated
Masses, seasons into a per-day gate, one-offs into dated rows, and leaving
non-Masses off. Also fixed: /diocese paths were never counted and a client
could spoof x-path; the chancery cookie compare could throw on odd bytes;
secure cookie on plain http; a missing tally table 500'd the page; a stale
finder date rolled a year ahead; typed text vanished on a bad search.
tools/diocese-tests.mjs holds 44 cases. Confession and Adoration for every
parish followed the same evening (Kevin: "why? can't we add this?"); the
notes parser covers the patterns in this finder, a new
pattern in a future read should be checked against the tests.

**Kevin steps**: DIOCESE_PASSCODE and DATABASE_URL in Vercel, apply
db/tally.sql; a diocese-owned host for the layer (mass.diokzoo.org or a
path on diokzoo.org) is a DNS decision for the call. **Open**: price of the
chancery view (recommended: with the office panel); event kinds and group
kinds are the platform's six, so cross-parish filters mean the same thing.

## Terms

Ruled by Kevin, 2026-11-02, after the market research
(`glaze/research/diokzoo-audit-2026-11.md` and the memory
parish-website-market-prices): **$99 a parish a month, no build fee for any
parish that moves under the diocesan agreement, a twelve-month first term on
that agreement, then month to month, thirty days' notice, no exit fee.** A
parish that comes alone pays the published build price. $4,158 a month for
the 42 with a site today. Anchors: eCatholic's own entry plan is $99; the
diocesan block most likely pays about $50 a site through the diocese
(Detroit, Pittsburgh and Boston all bill parishes that way), so the letter
never says "cheaper." The one action is glazedweb.com/schedule.

The agreement page exists since the evening of 2026-11-02: registry row
`diokzoo` in lib/customOrders.js, /agreement/diokzoo and /build/diokzoo.
The client is the diocese; Exhibit A part 3, "the diocesan agreement and
its first term," is the clause the general terms have no home for (section
5 says month to month, no multi-year term): the diocese signs once, a
parish joins by a note from the Pastoral Center, twelve months from the
first parish going live during which only a material breach ends it, then
month to month on thirty days' notice; $99 a parish from the month after it
goes live on one statement to the diocese; leaving hands over the working
project for every parish at once; the feed is the diocese's data. Two new
optional row fields carry it into part 2: `monthlyWhen` (when the monthly
starts, in the client's own words) and `termNote` (replaces the
month-to-month sentence). The letter's "The diocesan agreement runs twelve
months" sentence links to the page. No paper twin yet in contracts-private.

**Open on the terms, for Kevin:** a parish added in month eleven rides the
diocese's term and could be dropped at month thirteen; the ruling does not
cover it and the clause follows the ruling. Who is billed (diocese or
parish) is a TODO in the row and a question on the build page.

## The eCatholic question (2026-11-02, evening)

The St. Mary office called Kevin: the diocesan communications director
says the parishes "have to stick with eCatholic." What that most likely
is: the diocesan partnership at ecatholic.com/kzoo ("the Diocese of
Kalamazoo has partnered with eCatholic"; Quick Flip migration, hosting and
stock photos included, a diocesan specialist, DioKzoo@eCatholic.com), the
same shape as Detroit's ($50 a site through the archdiocese), New Orleans'
(the archdiocese underwrites every site; 137 sites) and Portland's
(Diocesan Sharing pushes diocesan content to every parish site). A diocese
that pays or co-pays for the block, and whose Parish Finder reads
eCatholic's MassTime panels, tells its parishes to stay on it; it is
administrative, not canonical.

On penalties: eCatholic's published Terms of Service (last modified
2024-01-01) section 8 lets an organization "terminate this Agreement by
canceling your use of the Platform at any time," with no refund of anything
prepaid (section 7: fees are paid in advance, annually or monthly) and no
export of the site (section 9; section 20 repeats it in capitals). So
breaking with eCatholic under its own terms costs a parish nothing but the
rest of a prepaid year and its site. Any real penalty would be in the
diocese's partnership paper, which is not public; `needs.ecatholic` on the
build page asks for it. Detroit's and Pittsburgh's arrangements are priced per
site through the diocese (parish-website-market-prices), which is the shape
in which the diocese, not the parish, is the one with something to lose.

Kevin's read on 2026-11-02 should decide whether the next move is the
diocese call as planned or a quieter route through parishes the agreement
does not bind.

## Decisions on file

- **The letter says "we" (Kevin, 2026-11-03).** Never "I", never "Glazed
  Web is one person": the studio is a team and he is bringing someone on.
  The founder's story is told as "one of us sits in the pews at St. Mary."
  Applied to the diocese letter (fd2b804); the St. Mary letter to Fr. Craig
  still says "I" in twelve places, a personal letter, not changed without
  asking.
- **Say the age plainly (Kevin, 2026-11-03).** The people keeping parish
  sites are in their fifties and sixties (CARA: lay ecclesial ministers
  median 55, most over 50; parish life coordinators 57 to 60; staff under
  ten); the page builder asks them to learn software and keep learning it,
  and when they leave the next person starts over. We are younger and do
  this for a living; that is the advantage and it goes in the letter as a
  fact, respectful, never a joke. Section "Who keeps a parish website
  today" in the letter, with the two CARA sources linked.
- **Gatherings across the diocese (Kevin, 2026-11-03).** What he means by
  a "social element" is meet-ups: coffee hour, a beer-and-Bible night, a
  young adult gathering, findable across parish lines, the thing MassTimes
  has nothing of. Not profiles or a feed. The build is data the parishes
  already keep: a diocesan events page joined from every parish calendar
  (town and date filters, add-to-calendar), groups across parishes from the
  ministries data with a contact, and "Mass and Confession near me, today"
  from the feed. Phase two; not in the letter yet; Kevin to rule whether it
  goes in as a paragraph with no price.

- **The pitch is to the Pastoral Center, not 41 pastors.** The deal is above
  them.
- **Ownership is the wedge**: the diocese holds the repository, hosting and
  data; "no hostage-taking" clause as on every agreement.
- **The feed has to exist from day one** or the Parish Finder goes dark one
  parish at a time; the format it consumes is the first thing to ask for.
- **Demo parishes set no `mailTo`**, so a form on a demo never reaches a real
  office that has not asked for it.
- **Giving never moves**: Vanco stays Vanco, OSV stays OSV.
- **Never say "cheaper."**

## Open

- Who holds the eCatholic agreement and when it ends (Stacie at St. Mary was
  asking).
- The Parish Finder's feed format.
- A Spanish-capable reviewer for San Felipe, Holy Angels and the two St.
  Josephs.
- Kevin's ruling on the price and on sending the letter.
- Parish-level letters for St. Philip and San Felipe do not exist; their
  pitch hosts serve the site at `/`.
- Data conflicts flagged in the repo README (St. Philip's Thursday and
  Friday Masses, a staff name, reconstructed emails; San Felipe's adoration
  time).
