# Beating eCatholic on substance, not design (2026-11-04)

Three research passes on 2026-11-04: eCatholic's own terms, FAQ, help
center and the thin public review record; the day-to-day digital work of
a US parish office; and a DOM inspection of four live eCatholic sites
(diokzoo.org, stmarymarshall.org, nolacatholic.org, bostoncatholic.org).
Our own measurement of the 42 Kalamazoo home pages and 490 inner pages is
in `diokzoo-audit-2026-11.md`. Design is left out on purpose.

## What eCatholic is, honestly

Eight thousand Catholic organisations, twenty years, Cloudflare in front of
everything, sane defaults nobody has to think about (sitemap, RSS, ICS,
HTTPS, WebP), Catholic-specific modules (Mass times, sacraments, calendar,
payments into their own ChMS), and the only network effect in the market:
the MassTime panel feeds FindAMass.org and every diocesan Parish Finder,
and only an eCatholic site joins it. Do not underestimate the editing
experience either. Parish staff know where the buttons are.

## Where it is weak, with sources

| Weakness | Evidence |
|---|---|
| No export, by contract | ToS sec. 9: "eCatholic will not provide you with any form of export"; sec. 20 forbids any database export without a separate signed agreement. The parish's right is copy and paste. |
| Donors do not travel | Blog "switching giving platforms": card tokens "generally can't be released"; recurring donors are rebuilt from scratch on exit. |
| 1% of every gift, forever | FAQ: 1% to eCatholic on top of Fiserv 2.1% + 35c; a new Fiserv merchant account is mandatory; PCI non-compliance fee $19.95 a month. |
| Support is weekday business hours | ToS sec. 19: 8 to 5 Central, Monday to Friday. Sunday Mass is outside support. Support does not make changes to the site. |
| Price can change on 30 days' notice, no refunds | ToS sec. 7 and 8; eCatholic may terminate for any reason; stock photos are deleted on cancellation. |
| No API, no webhooks, no JSON | Help center lists one-way imports into their ChMS only; the parish finder is a 716 KB to 1.6 MB HTML page; the only feeds are RSS and ICS. |
| No bilingual mechanism | lang=en hardcoded, no hreflang, no /es; "Language" exists only as a field on a Mass entry; the Google Translate help article is about removing it. |
| Zero structured data | No Church, Event or openingHours markup on any of the four sites or any of the 42 Kalamazoo sites. Google cannot show their Mass times. |
| 2013-era weight | 19 to 29 scripts; jQuery, jQuery UI, moment, Modernizr 2.7.1; editor CSS shipped to visitors; 150 to 340 inline styles. |
| Accessibility basics | No skip links, no h1 on three of four home pages, 8 to 15 unlabeled icon links per page, galleries with empty alt. |
| Thin security | X-Frame-Options only; no CSP, HSTS, Referrer-Policy, with Facebook SDK and Elfsight injected on donation-taking pages. |
| Reliability | StatusGator: 37+ outages since Oct 2022; ToS: "AS IS", liability capped at one month, remedy is to cancel. |
| Content policed by the vendor | ToS sec. 11 and 21: "Church appropriate" as determined by eCatholic, removable without notice. |
| Diocese deals exclude the extras | Detroit: $50 a site, with giving, livestream, stock photos and design all extra. |

## Where parish offices actually hurt

The office is four to six people, mostly part-time, median age 55. Nothing
in the research counts hours per task; the pains below recur in parish
pages, diocesan guidance and Catholic press.

1. The same announcement is typed three or four times: bulletin, website
   news, Flocknote, Facebook. Diocesan guidance tells parishes to repeat
   every message across every channel for three or four weeks.
2. The bulletin printer deadline (LPi, Diocesan Publications) falls Monday
   to Wednesday, ten to twenty days before holidays, so the bulletin is
   stale by Sunday and funerals miss it.
3. Mass intentions are booked in a paper book months ahead, then re-typed
   into the bulletin. Double bookings, per-family caps and stipends are
   tracked by hand.
4. Mass times on Google, MassTimes.org and DiscoverMass drift from the
   parish's own schedule because each is its own login and nobody owns it.
5. Religious education enrollment is a PDF packet, a Jotform and a check in
   the basket; parish registration is a prerequisite that bounces families.
6. Sacramental prep is a document chase (birth certificate, godparent
   letters, class certificates) with no status the family can see.
7. Liturgical minister scheduling runs on Ministry Scheduler Pro, reviewed
   as old and overpriced for small parishes; swaps happen by phone.
8. Funeral and wedding notices need same-day publishing and get a ten-day
   bulletin cycle.
9. Flocknote is a second content system to feed, priced up to $791 a month
   on member brackets.
10. Bilingual parishes have one person translating everything by hand.
11. Diocesan compliance pages (safe environment, appeal, bishop's letter)
    arrive as PDFs and toolkits for each parish to paste in.
12. Livestream dies for lack of a person; one parish costed it at $500 a
    week in staff time and quit.
13. Families of parishes share staff across three to six parishes but
    parishioners keep their own front door.

## The ideas, ranked by how much they change a parish's week

1. **Write once, everywhere.** One announcements inbox with a run window
   per item. It renders the website news feed, the weekly email, the text,
   the Facebook post and the bulletin PDF the printer accepts. This is the
   single biggest removal of work in the whole list and nobody sells it.
   Flocknote and LPi stay as outputs, not as second keyboards.
2. **The schedule as the source of truth.** Mass, Confession, Adoration and
   holy days typed once, published as schema.org, ICS and JSON, pushed to
   the Google Business Profile hours, the diocesan finder and MassTimes.org
   and DiscoverMass on their self-update paths. Already half built.
3. **Mass intentions online.** A calendar of open Masses the family books
   and pays, the office approves, and the bulletin and site list auto-fill.
   Sold today as a $20 to $40 add-on by two small vendors; it belongs in
   the platform.
4. **A household account.** Parish registration creates the household once;
   RE enrollment, sacramental prep, retreats and tickets prefill from it and
   take a card. This is the honest first step toward records, without
   touching the canonical registers.
5. **Sacramental prep as a checklist.** Per sacrament, the documents, the
   classes, the status, visible to the family and the office.
6. **Notice types that know their deadlines.** A funeral posts to the site
   and email the same hour; a wedding banns item runs three weeks; a
   diocesan notice lands on every parish at once (built).
7. **Open data in the agreement.** Full export at any time, read API, ICS and
   JSON feeds per parish, giving on the parish's own Stripe account so the
   donors travel. Every one of these is a line eCatholic's terms forbid.
8. **Bilingual as a field, not a site.** EN and ES on every content type,
   one publish, language-aware Mass times (built for San Felipe).
9. **Hosted livestream with the scheduler and clips,** one stream out to the
   parish page, YouTube and Facebook, the bishop's Mass shared diocese-wide.
   Rent the video layer (Cloudflare Stream or Mux), write the Catholic part.
10. **Reliability and support written down.** A public status page, uptime
    in the agreement, security headers on every response, weekend coverage
    around Mass times, and edits done for the parish inside the monthly.
11. **Minister scheduling with self-serve swaps,** the roster printed into
    the bulletin. A later module; MSP's reviews say the market is open.
12. **One admin, many front doors.** A family of parishes shares staff,
    events and the announcements inbox while each parish keeps its own site.

## What this changes in the plan

Phase one (public layer, finder, livestream) stands. The new items that
belong in phase two beside giving and paid forms are the announcements
inbox with bulletin PDF output, Mass intentions, Google Business Profile
sync, and the household account. The records system stays phase four and
the household account is its on-ramp. The agreement gains three lines:
export at any time, API and feeds, giving on the parish's own account.

## Not verified

No published Lighthouse scores or WCAG complaints name eCatholic. No
parish-secretary forum surfaced. Current list prices above "plans start at
$99" are quote-only. Techjockey's ten reviews are anonymous. Hours per
task are nowhere counted; the pains are documented, the cost is not.
