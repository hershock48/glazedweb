# St. Mary Catholic Church, Marshall

**Repo** `hershock48/stmarymarshall` (local folder `stmarymarshall`) · **Client**, Kevin's own parish · Built 2026-10-27 ·
**Live** at stmarymarshall.vercel.app and stmarymarshall.glazedweb.com/demo; stmarymarshall.org is still the eCatholic site until DNS moves.
Since 2026-11-02 the repo is the multi-parish platform for the diocese pilot; see `diokzoo.md`.

## What they are

The Catholic parish of Marshall, MI, Diocese of Kalamazoo, founded 1852;
present church dedicated October 27, 1889, renovated 2021. Pastor Fr. Craig
Lusk. Church at 214 S. Eagle St. (corner of Eagle and Green); office and all
mail at 212 W. Hanover St., Marshall 49068. (269) 781-3949,
stmarymarshall@aol.com. Mass Sat 5:00 PM, Sun 9:00 and 11:00 AM, Tue 4:00 PM,
Wed noon, Fri 7:30 AM; Confession and Adoration Sat 3:30 to 4:30 PM.

## The old site, read 2026-10-27

eCatholic (theme18), AngularJS-era, account 6225 (predates the diocesan
batch). Six pages of tabbed content, an eCatholic Mass Times panel (which
feeds the diocesan Parish Finder), an online form that posted to eCatholic,
Vanco online giving, bulletins on DiscoverMass, the calendar as an eCatholic
iCalendar feed. Every document on files.ecatholic.com, every photo in the
eCatholic slideshow. Nothing is lost when they leave: the PDFs and photos are
under `public/parishes/stmarymarshall/`, the calendar transcribed into
`parishes/stmarymarshall/data.ts`.

## Terms

Kevin, 2026-10-27: a gift build, $99 a month. Registry row
`stmarymarshall` (buildFee 0, monthly 99); glazedweb.com/build/stmarymarshall
and /agreement/stmarymarshall live since PRs #25 and #26. The letter to Fr.
Craig is at stmarymarshall.glazedweb.com. Not sent as a letter: Kevin spoke
to Stacie in the office on 2026-11-02, who was interested and said the
website is paid by the diocese; that turned the conversation into the
diocese one.

## Decisions on file

- **Calendar is data the site owns**, not the eCatholic feed, because the feed
  dies with eCatholic. Editing it is a pull request until the office asks for
  an owner panel.
- **Bulletins stay on DiscoverMass** (Diocesan Publications prints them). The
  site reads their page server side and falls back to a plain link.
- **Giving stays on Vanco**, the parish's existing processor. Not ours to
  replace; no Stripe, no fee.
- **Registration is a plain POST with three honest states.** SMTP through a
  parish mailbox once Kevin sets the variables; logged in full until then.
- **Both addresses kept** (church on Eagle, office on Hanover). The old site's
  own directions link used 214 S. Eagle.
- **Two phone numbers for Gus Groat** were on the old site; both kept where
  they were, flagged in the README.
- **Deacon Mike not on the staff list**; the old site did not list him there.
- The Respect Life Month slide and the parking-lot notice were not carried
  over: one is stock art, the other expired.
- **The site became a platform on 2026-11-02** (parish chosen per Host
  header) without changing anything a visitor sees; the audits were re-run
  clean after the refactor.

## Permissions

Kevin, 2026-10-27: "we have permission to use all photos and info from their
site." Photos and copy on the rebuild are the parish's own, from
stmarymarshall.org. The photographer is not named anywhere; ask.

## Palette and type

Lifted into `app/globals.css`, contrast computed: navy `#0e1a2b`, navy-soft
`#152540`, line `#26395a`, marian `#1f3c7f` (links on paper), gold `#d6b25a`,
gold-light `#e6c97e`, cream `#f4eddf`, dim `#cdc3ad`, paper `#f7f2e8`, ink
`#1a2233`. Cormorant Garamond display, Source Sans 3 body. Mark: the parish's
ring-and-M favicon redrawn in `components/Mark.tsx`.

## Retired

Nothing yet.
