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

**Closing eCatholic's gaps (2026-11-03, Kevin: "we could close the gaps"):**
the three they would raise and what now answers them. *A suite, not a
site*: a "What stays, what changes" table in the letter and the agreement
scope (giving, bulletin, Flocknote, livestream, ChMS all stay and are
linked; livestream now linked as "Watch Mass online"; the Mass page's
"find a Mass nearby" goes to our finder, not FindAMass). *They scraped
us*: the letter says the finder reads the diocese's own public page at the
diocese's request under the agreement, demo sites come down the day a
parish asks, and part 3 of the agreement now has "Reading the diocese's
own pages". *Security and compliance*: /diocese/security on the platform
(what we store, what we do not, where it runs; linked from the letter's
security row and part 3), plus real headers on every response (nosniff,
referrer policy, permissions policy, frame-ancestors). Still open from
that list: a live reference parish, a named second person with a
continuity clause, the office panel in the deal.

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

## Call with Stacie, St. Mary Marshall (2026-11-04, Kevin's notes)

**Why the diocese chose eCatholic, ten years ago, in her words.** Parishes
had ad hoc websites, people were paying big money with no support, and
eCatholic gave security, promotion and support. The diocese pays for the
site. That is the case we are answering: ownership, support written down,
and the measured gaps in `glaze/research/diokzoo-audit-2026-11.md`.

**People.** Stacie is introducing Kevin to **Vikki Sesna, communications
director of the diocese**, who writes the diocesan email. Stacie expects
her to be defensive about anyone taking over social events; Kevin offered
to carry her newsletter inside the parish sites instead. Stacie is also
giving Kevin her own eCatholic login so he can see the back end and the
MassTime panel. Kevin looks; nothing is changed on her site.

**Vikki's newsletter is the announcements-inbox problem in one person.**
Subscribers only, fed by parish workers emailing her, items dropped on the
way. Stacie's own idea was a side panel on every parish site showing what is
happening across the diocese, which is the diocese layer as built
(`/diocese`, the "Across the diocese" strip). Her other idea: the bishop's
voice carried on the diocese site and every parish site.

**Structure.** Two deaneries, eastern and western. Parish staff from the
whole diocese meet once a year; the last meeting discussed activities not
shared between parishes and a push on social events. The diocese has
Flocknote.

**What she likes about eCatholic.** The MassTime popup on holy days and
special days. Build it: a schedule-aware notice on every page when the
next day's Masses differ from the usual week, reading the same data as the
finder.

**The Lansing model.** Stacie holds the Diocese of Lansing up as the most
tech-savvy in Michigan: Bishop Boyea (75, retiring) with a young team doing
podcasting, weekly Lent reflections by subscription, a families series,
Facebook live Mass, and clips. She wishes Bishop Lohse of Kalamazoo were
shared the same way. Checked 2026-11-04: dioceseoflansing.org is a custom
Drupal 8 build, not eCatholic; Queen of the Miraculous Medal in Jackson is
queenschurch.com, a WordPress site with Diocesan.com links and its own
YouTube channel. Lansing is the second
diocese to pitch and the proof that a diocese will leave the template.

**What this adds to the build.** A **bishop's voice module**: video and audio
posts hosted with the livestream layer, clipped, published on the diocese
page and syndicated to every parish site, with a subscribe path that is not
Facebook. The **holy-day popup**. And the **announcements inbox** as the
tool Vikki is missing, offered to her as help, not replacement.

**Kevin's follow-ups.** Take the Vikki introduction. Look at the eCatholic
back end once Stacie sends access, noting the MassTime panel's fields and
whether any export exists. Ask which deanery St. Mary sits in and when the
annual staff meeting is, because that room is the pitch.

## The Insider (the diocese's weekly email), read 2026-11-04

Kevin forwarded the 2026-11-03 issue. Facts: published Tuesdays by the
Office of Communications (sent under Emily Walsh, ewalsh@diokzoo.org;
Vikki Sesna is the director), deadline the Thursday before, subscriber-only.
Sections: diocesan news, "REMINDER" items repeated week to week (the manual
version of a run window), parish events from across the diocese (bazaars,
galas, a parish mission), the bishop's Masses and gatherings, Liturgical
Living feast days, Pray for Our Clergy, job openings, national news. The
annual staff meeting Stacie mentioned is "Connecting with Our Parishes",
2026-10-27 at St. Martin of Tours, Vicksburg, 100+ staff, sessions
including communications. Young Adult Gethsemane Night with the bishop
rotates parishes monthly (Office of Mission and Ministry, Jen Metzger).

Its dated items are now rows in `parishes/diocese/events.ts` on the
platform, so /diocese/events shows the diocese, not just the three platform
parishes. This is the hand-kept version of the announcements inbox (phase
two): Vikki's email is the inbox's first customer.

## Narthex, phase one built (2026-11-04)

The platform is named Narthex (Kevin ruled 2026-11-04; "Egnatia" is the one
alternative on file, egnatia.church and egnatia.io free). Plan:
`docs/narthex-plan.md` in the stmarymarshall repo. Built and live on the
pilot hosts the same day: the finder on its own host
(finder.kalamazoo.glazedweb.com, diocesan chrome, checked-on date, wrong-time
report, embeddable by diokzoo.org only, weekly GitHub Action refresh that
read all 60 parishes through Cloudflare on the first live run); the diocese
calendar with the Insider's dates and a diocese .ics; the holy-day line on
every parish page; the bishop's voice (seven recordings from the diocese's
YouTube channel, /diocese/voice, RSS at /diocese/voice.xml, a card on every
parish home page); Watch pages (St. Philip on YouTube, San Felipe on
Facebook, schedule-aware, Cloudflare Stream seam behind
STREAM_CUSTOMER_CODE); letter copy for all of it. Still owed in phase one:
side-by-side finder screenshots in the letter, the agreement's open-data
lines (done on this branch if the row below carries them).

## Phase two started the same day (2026-11-04, afternoon)

Built, audited and verified in production on stmarymarshall main (last
4cc5d34): the write-once news engine (`lib/news.ts`: /news, /news.xml,
/bulletin-insert that prints to a half sheet, /diocese/insider and
/diocese/insider.xml as the diocese's weekly email compiled from notices,
the bishop, offered parish announcements and the next two weeks; typed
announcements on the home page while they run); the two finder screenshots
side by side in the letter (`tools/finder-compare.mjs`); deaneries and
collaboratives from the December 2025 diocesan directory on every finder
card and as a filter on /diocese/events (`parishes/diocese/deaneries.ts`,
a test fails if any finder row is unmatched); a Spanish-Mass switch on the
finder; Mass intention requests that offer the parish's actual Masses for
six weeks instead of a free-text date. The agreement row on this branch
carries the news engine and the slots in scope. No parish has typed an
announcement yet, so the home sections render nothing until one does; the
diocese digest is populated today from The Insider's dates and the
bishop's message.

Not built, waiting on Kevin's to-do in `docs/narthex-plan.md`: giving and
paid forms (Stripe keys), the inbox with a database (DATABASE_URL), Google
Business Profile sync (OAuth), hosted video (Cloudflare Stream).

## The list, built (2026-11-04, evening)

Kevin's ordered list, all done and live on main (last b1a4e83): the
platform is multi-diocese (a diocese is `dioceses/<slug>/config.ts` plus a
registry row; Kalamazoo moved under its folder); Lansing is the second
diocese (73 parishes read from the diocese's Drupal directory by
`tools/lansing-import.mjs`, six vicariates as deaneries, the bishop's
podcast as an audio voice entry, finder.lansing.glazedweb.com and the letter
at lansing.glazedweb.com; the audit of its 72 sites is in
`glaze/research/lansing-audit-2026-11.md`); religious education
enrollment at /enroll; sacramental prep as checklists from what each
parish already publishes; the chancery view by deanery with the finder's
age and each parish's week.

**The letters were reframed the same evening on Kevin's direction:** the
story is the platform (a parish site that is alive, parishes connected to
each other, what the diocese sees and sends), with the rebuilt sites and
the measurements as proof further down. Both letters now open that way.
The name is still Narthex in the files; Kevin rejected it as too hard
("sounds like anthrax") and has six softer candidates with free domains
(Angelus recommended, Vespers the familiar one); the rename is one commit
once he picks.

## The business model, adopted (2026-11-05)

Researched (`glaze/research/narthex-business-model-2026-11.md`) and
ruled by Kevin: one diocesan license billed to the diocese with every
parish included and no parish billed, Kalamazoo $3,990 a month ($47,880 a
year, about one percent of the appeal's $4.01M pledged, under the
chancellor's signature threshold), Lansing $4,990; no build fee; twelve
months then month to month. Giving at 1% of each gift capped at $5,
donor-covered by default, on the parish's own Stripe nonprofit account,
no monthly fee, the appeal on the same rails. Add-ons a parish pays for:
hosted video $89, office panel $29, texting at cost plus margin. A lone
parish outside a license: the published build and $99 a month. The
letters, the agreement row (`lib/customOrders.js`, part 3 "What is
billed" and "Giving, stated plainly") and the plan carry it. Never say
"$99 a parish" to a diocese. Google Ads rejected; diocese-controlled
sponsorships with a parish revenue share are a later line.

## Who owns what, adopted (2026-11-05)

Researched (`glaze/research/narthex-ownership-2026-11.md`) and ruled by
Kevin the same day: the single-site "diocese holds the repository" line is
gone from both letters and the agreement. In its place: the diocese owns
its data, content, domains and accounts outright with export at any time
(files, data, a static copy of each site), feeds never metered, ninety
days of export after any ending; if glazedweb fails it (dissolves, ceases,
insolvency, discontinues, terminates for convenience, uncured breach in
sixty days) it receives a perpetual source-included license to run the
platform for its own parishes, with a quarterly encrypted deposit and
attestation; the diocese's own leaving is not a trigger. FSL publication
deferred. The agreement row carries a new part 3 item "If glazedweb fails
the diocese" and a `noBuildLine` so the status box no longer says the
code is theirs. Kevin's to-do (in the plan): a product LLC and IP
assignment before signing, agreement redraft with an attorney, insurance,
Stripe platform account under the entity.

## The letters after the sales-lens pass (2026-11-05)

Kevin asked whether the proposal was laid out the way the research said;
seven gaps were named and he said fix them. Done in the stmarymarshall
repo (6fc7433) and verified in production:

- Lansing's letter rebuilt in the story's order, as Kalamazoo's was.
- `/terms` on kalamazoo.glazedweb.com: the Exhibit A text of this row,
  written by `tools/terms-page.mjs` from `lib/customOrders.js`. Both
  letters link there, so nothing depends on PR #33 being merged. Run the
  script again whenever this row changes.
- `/brief` on both letter hosts: the letter on one printed sheet.
- In both letters: the price against published rates paid today (41 sites
  at $50 to $99 is $24,600 to $48,700 a year in Kalamazoo; 26 sites is
  $15,600 to $30,900 in Lansing; we do not know what either pays, and the
  letter says so), a paragraph for the finance office and one for the
  communications office, day ninety-one of the free layer, who the diocese
  would be dealing with (the not-a-vendor box is gone), and a real picture
  of the chancery view.
- The letters say "the platform"; no name is printed anywhere a diocese
  reads.

## The letters lead with the offer and the diocese layer (2026-11-05)

Kevin caught that the earlier pass had been measured against the wrong
order: the sales-lens recommendation of 2026-11-04 (the offer as a
three-rung ladder at the top, with two concrete asks) was never carried
out, and the letters still opened on the parish site. Ruled and rebuilt
the same day. Each letter now opens with the offer in three steps (the
layer free for ninety days with the ask "point the Parish Finder page at
it"; three parishes built free with the ask "name three"; then the
license), and the body runs connected, the diocese, the parish site,
measured, ownership, cost, next. The migration note moved out of the
parish section into "What happens next" with a new order: the parishes
with no website first, then the ones the diocese names, then the rest as
agreements allow; this row's scope line says the same. The Kalamazoo
letter cites Lansing (46 of 72 parish sites off eCatholic) as the diocese
next door. The one-page briefs follow the same order.

Still thin, and Kevin's facts to supply: live clients to name and a named
second person in the "who the diocese would be dealing with" block.

## The audit of 2026-11-05, and four more rulings

Kevin asked what the research was being used for. The answer was uneven,
so every note was re-read and mapped in the stmarymarshall repo at
`docs/narthex-research-ledger.md`; read it before any review. Changed the
same day, all live:

- No "Book a call" button anywhere a diocese reads. The buttons are the
  two asks, each a prefilled email to Kevin; the scheduler is a line of
  text. `glaze/proposal.md` carries the rule for diocese letters.
- The per-site price comparison is gone. The license exists so that no
  one compares it to $50 a site, and the comparison had been added from an
  older note.
- Each letter has a table of what is running and what is not built yet.
  Not built: giving through the platform, hosted video, the office panel,
  texting, the self-serve export, the deposit script, the uptime monitor.
- eCatholic's support terms (weekdays 8 to 5 Central, no changes made for
  the parish; sections 7, 8 and 19, re-read that day) are in both letters.
  This row gains "Support and uptime" (99.9% a month; urgent fixes the same
  day, seven days a week), which are Kevin's numbers to change.
- Kevin's rulings mid-pass: parishes built free are not capped ("name as
  many as you want and we build them all"); no failure talk in anything a
  diocese reads, so the exit license is titled "Continuity" and stated as
  what the diocese holds; the social layer between parishes leads the
  "connected" section.

Built the same day on Kevin's word: the diocese's own site on the
platform, a demonstration at diokzoo.glazedweb.com. The 142 pages
diokzoo.org's menu links to, the finder first on the home page, a staff
directory built from the office pages. The Kalamazoo letter offers the
finder either way (on the site the diocese has, or on this one) and the
agreement's scope includes the site "if the diocese wants it"; that
inclusion is an assumption for Kevin to confirm. Not read: the news
archive (344 posts), staff pages and unlinked pages, because the site's
host declines its sitemap to an automated browser and that was not worked
around. Not copied: the list of those disqualified from ministry. The
communications director's name, from the diocese's own staff page, is
Vicki Cessna (Executive Director, Secretariat of Communications and Public
Affairs).

## Open
- (Ruled 2026-11-05: the chancery view is inside the license. Letters,
  this row and the terms page say so.)
- Facts only Kevin has, for the vendor packet and the brief: a phone
  number, a named second person, and (after the entity) W-9 and insurance.

- Who holds the eCatholic agreement and when it ends (Stacie at St. Mary was
  asking). Stacie confirmed 2026-11-04 that the diocese pays for St. Mary's
  site; the paper is still unseen.
- The platform's name (parked by Kevin 2026-11-04; candidates on file).
- Whether the diocese carries the license in full or recharges parishes.
- A Lansing agreement row (/agreement/lansing) when the diocese asks; the
  letter points at Kalamazoo's terms until then. A Lansing og.jpg for the
  letter's link card.
- Kevin steps for phase one: DIOCESE_MAIL_TO (or MAIL_TO) in Vercel so the
  wrong-time reports reach a person; a Cloudflare Stream account for hosted
  video; the price of hosted video (about $49 a month is in the letter).
- The Parish Finder's feed format.
- A Spanish-capable reviewer for San Felipe, Holy Angels and the two St.
  Josephs.
- Kevin's ruling on the price and on sending the letter.
- Parish-level letters for St. Philip and San Felipe do not exist; their
  pitch hosts serve the site at `/`.
- Data conflicts flagged in the repo README (St. Philip's Thursday and
  Friday Masses, a staff name, reconstructed emails; San Felipe's adoration
  time).
