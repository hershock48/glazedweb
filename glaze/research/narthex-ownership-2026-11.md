# Who owns what, on a platform: the ownership clause, the exit, and the entity

Research note, 2026-11-05. Written for Kevin's question: "the diocese holds
the repository" came from single-site work; the platform is one codebase
serving every diocese, so handing one diocese the repository hands it the
product. What is the best way to structure this so the customer is still
un-trappable (the promise that beats eCatholic) while the product stays
ours? Three research passes: how vendors write exit licenses and escrow;
how lock-in actually hurts church customers and what portability can be
verified; how a one-person agency structures a product entity. Not legal
or tax advice; the steps that need a Michigan attorney or a CPA are
marked.

## The short answer

Three layers, in order of weight. The first costs nothing and is where
the whole promise lives. The second is what the old "you get the
repository" line becomes. The third is a later option, not now.

1. **Data, content, domains and accounts: the diocese's, outright.** Export
   at any time, self-serve and free, in open formats, plus a static copy of
   every site that runs anywhere. Feeds for its own data never metered.
   Domains in the diocese's or parish's own registrar account. Stripe
   accounts with full Dashboard in the parish's name, so donors and
   recurring gifts keep running without us. Ninety days of read access
   after any ending, then deletion confirmed in writing. No export fee,
   ever.
2. **Continuity: an exit license, not a handover.** If we fail the diocese
   (we close, go insolvent, discontinue the platform, terminate for
   convenience, or do not cure a material breach within sixty days), it
   receives a perpetual, royalty-free license to the platform source as it
   stands that day, with build documentation, to host its own parishes,
   schools and institutions, modifiable by any contractor it hires. No
   resale, no hosting for another diocese, as-is. The diocese's own
   non-renewal is not a trigger. A quarterly encrypted deposit of the code
   and runbook goes to the diocese's own storage with the hash attested in
   writing; the key sits with our attorney and is released on a trigger.
   Recite 11 U.S.C. 365(n) so the license survives our bankruptcy.
3. **Source-available publication (FSL): not yet.** It would make the
   promise unbeatable, but it starts an irreversible two-year clock per
   version on a codebase with two dioceses and a thin operations moat.
   Revisit at three or more dioceses after a security pass.

And one structural step before the first diocese signs: a product entity
(a Michigan LLC) that owns the platform by written IP assignment from
Glazed Web LLC, and is the licensor on the diocese contract. Without it the
contract licenses something its signer does not own.

## 1. Why the old clause does not transfer

The general terms, section 3 ("You own the website"), say that when the
build fee is paid all rights in the site transfer to the client, and we
hand over "the code repository, the hosting project, and the logins." The
diocese Exhibit A repeats it: "the diocese gets the working project, the
repository, the hosting project and the logins." Both letters say "The
diocese holds the repository, the hosting and the data, in writing."

On a single site that costs us nothing: the code is that client's and no
one else's. On the platform the repository is `stmarymarshall`, which
serves Kalamazoo and Lansing from one tree and will serve the next
diocese. Giving Kalamazoo "the repository" gives it Lansing's finder,
Lansing's voice data and every diocese to come, plus the right to run the
product for anyone. It also cannot be given twice.

What the clause was for still matters, and the research says it matters
more than we had written. The whole Catholic web market is built on the
opposite promise, in writing.

## 2. The incumbent, in its own terms

eCatholic's terms of service (Webpro Productions LLC, last modified
2024-01-01, Texas law): the subscription is "non-exclusive,
non-transferable, limited"; eCatholic and its suppliers "own all rights,
title, and interest" in the platform, and its source code is a trade
secret; on termination the parish may copy and paste, but "eCatholic will
not provide you with any form of export of your Website"; in capitals,
eCatholic "WILL NOT PROVIDE YOU AN EXPORT OR DOWNLOAD IN ANY FORMAT OF THE
DATABASE" without a separate executed agreement; eCatholic may cancel "for
any reason at any time upon notice"; "no full or partial refunds"; the sole
remedy for anything is to cancel; it may discontinue any product "with or
without notice"; stock photos are deleted at termination; and section 26
disclaims any escrow relationship. The terms say nothing about who
registers the domain, while eCatholic offers to register and hold domains
"on your behalf" and its help center never says whose name is on the
registration. Help-center searches for export, cancel, transfer domain and
leaving return no article on exporting pages, forms, submissions, news or
events. The lock-in is in the terms, not in anecdotes: no forum complaints
were found.

Elsewhere in church software the picture is the same shape. Pushpay's
organization terms run a thirty-six-month initial term with ninety days'
non-renewal notice and fees that may rise ten percent a year. Flocknote
claims no IP in your content but says content "may be immediately and
permanently deleted" on cancellation, and its terms carry no export
clause. Planning Center says customer data remains yours and then takes a
perpetual, irrevocable license to use it. Tithe.ly says access "will
immediately cease" and you are responsible for downloading first. On
giving, no first-party Vanco, OSV or Pushpay page admits it, but every
migration guide in the sector says the same thing: saved payment methods
and recurring gifts do not move between providers, donors re-enroll, and
nonprofits lose most monthly donors in a switch. eCatholic itself ships
bulletin announcements for re-enrolling donors from the old provider.

Nobody in the templated-site market gives everything back. Squarespace
exports blog and layout pages as WordPress XML and excludes calendars,
forms and styles. Wix has no whole-site export. WordPress.com exports
posts but "will not include your theme design, customizations."
Webflow exports static code but empties CMS lists and drops forms.
Ghost(Pro) comes closest (content, members, media and theme, and the
software is open source), and it is single-tenant. A multi-parish
platform that hands back content, structured data, a running static site,
the domain in the parish's name and open feeds states something no one in
this market states.

## 3. What dioceses already require, and what they do not

Diocesan policies that exist say one thing: the domain and the admin
access belong to the Church entity. Los Angeles: "Domain name
registrations must be in the name of the archdiocese or the Location."
Raleigh (2026): the diocese or a controlled entity "must be the
registered owner of the domain." Arlington: the same, "whenever possible."
Seattle: parish websites "are owned by the respective institutions."
Des Moines (draft): ParishSoft data "is owned by the parish." Detroit,
Lansing and Kalamazoo publish nothing on websites or domains.

No diocese anywhere was found asking a vendor for data export, exit terms
or source escrow. NTEN's 2025 equity guide tells nonprofits a
nonprofit's data "belongs to it and its constituents" and that they
"should be able to extract all their data or reports without additional
fees." Venable (October 2026) tells nonprofits to negotiate "detailed data
export rights (including format, frequency, and completeness)." Neither
mentions escrow.

So: the domain line is the one a chancery will recognize and nod at. The
rest is a promise we volunteer. It will not be demanded, which is exactly
why stating it is worth something.

## 4. Layer one: data and accounts, in detail

Each promise below is checkable by the diocese or parish without trusting
us, which is what makes it worth writing.

- **Content and structured data are the diocese's and the parish's.** Text,
  photos, documents, schedules, calendars, events, groups, notices, form
  submissions. We take a license to host and display during the term and
  nothing after; no perpetual data license, and no training on it.
- **Export at any time, self-serve, free.** JSON and CSV of every record,
  a zip of every uploaded file, and a static HTML copy of each live site
  that runs on any host. A written request is filled within ten business
  days. Export stays available ninety days after any ending; deletion
  follows within thirty, confirmed in writing. No export, offboarding or
  "special case" fee, ever.
- **Feeds for the diocese's own data are never metered or rate-limited.**
  iCalendar, RSS and JSON for events, news and notices; the Mass-times
  feed. The diocese and any future vendor can read live data without us.
  No published model clause exists for this line; it is ours.
- **Domains in the parish's or diocese's own registrar account**, with its
  own login. We hold at most DNS-edit rights, revocable, and hand over the
  DNS record list in writing on exit. This matches the diocesan policies
  above and is the line eCatholic's terms cannot match.
- **Giving on the parish's own Stripe account with full Dashboard
  access.** Stripe's docs confirm the mechanics: a connected account with
  full Dashboard has "a direct relationship with Stripe"; with direct
  charges, "transaction objects such as PaymentIntents and Charges exist
  on the connected account, not on the platform"; on disconnect,
  "subscriptions continue to run on the connected account." That is true
  only if we create Customers, PaymentMethods, Prices and Subscriptions on
  the parish's account and never clone from ours, and only if we never
  enable platform controls that block disconnecting or payouts. Both go
  in the contract as promises, and the parish can verify them by logging
  in to dashboard.stripe.com. Stripe now calls Standard/Express/Custom
  legacy names, so the contract should say "a connected account with full
  Stripe Dashboard access," not "Standard."
- **Sending domains in the parish's or diocese's own subdomain**; on exit we
  rotate or hand over DKIM and stop sending.
- **Analytics are counts with no person in them**, exportable; no
  third-party trackers.
- **Term mechanics that match the story:** twelve months, then month to
  month with thirty days' notice; no fee escalator beyond a stated cap; a
  written pledge that a site keeps running with security updates while
  any parish still pays.

Positioning line that is defensible: everything on the site, and every
recurring gift, belongs to the parish and works without us; eCatholic's
own terms say the opposite. Quote their terms; do not claim more about
other vendors than their published terms show.

## 5. Layer two: the exit license and the deposit

This is what "you get the repository" becomes. The legal backbone is
section 365(n) of the Bankruptcy Code: if a vendor's trustee rejects a
contract, the licensee may elect to keep its license to the IP, and if
the agreement says so, receive the "embodiments" (source, documentation).
Practitioner drafting agrees on the shape: release triggers that are
objective, a license limited to internal use of the released version, no
right to distribute or compete.

**The grant.** On a trigger, the diocese receives a perpetual,
non-exclusive, royalty-free, non-transferable license to the then-current
platform source and build documentation, to host its own parishes,
schools and institutions, with the right to modify and to hire any
contractor to do so. No sublicense, no resale, no hosting for any other
diocese, as-is, no updates or support. Real clauses read the same way:
one grants source "for its internal use, modification and implementation
without cost," surviving termination or insolvency; a school-district
contract releases code if the vendor "shall cease to provide the
maintenance or warranty services" or is "declared insolvent." Canvas (the
learning platform) open-sourced in 2011 because startup customers "weren't
sure if it was safe"; its analyst called that "a form of software
escrow."

**The triggers**, all objective: (a) Glazed Web or the product entity
dissolves or gives written notice of ceasing operations; (b) a bankruptcy
or insolvency filing; (c) we discontinue the platform; (d) we fail to cure
a material support or uptime breach within sixty days of written notice;
(e) we terminate for convenience. Not a trigger: the diocese's own
non-renewal or termination for convenience. That one line keeps the
product ours. A diocese that simply leaves takes everything in layer one,
which is everything it made and everything about it, and not the
software.

**The deposit.** Formal escrow agents publish prices: EscrowTech $995
setup plus $1,595 a year for one beneficiary (three-year lock), a file
listing verification from $295; Codekeeper $139 a month billed annually
plus $249 setup, release processing $199 an hour; a full build
verification at a traditional agent runs about $9,000 to $10,000. The
industry's own numbers say where escrow fails: NCC released about fifty
of eight thousand agreements a year, and Iron Mountain found 66 to 76
percent of deposits incomplete. The failure is a stale deposit, not a
refusing vendor.

So the recommendation is a deposit we control and the diocese can check:
quarterly, an encrypted archive (git bundle, schema and migrations,
runbook, environment inventory, deploy steps) delivered to the diocese's
own storage, with the SHA-256 and the exact commit attested in writing
along with a statement that it builds. The decryption key is held by our
attorney or registered agent and released on a trigger. Cost zero. Offer
Codekeeper or EscrowTech at the diocese's option and expense if it wants
an independent agent. No diocese or nonprofit procurement document asking
for escrow was found, so this is volunteered, and the letters should say
it in one sentence rather than a paragraph.

**The multi-tenant wrinkle.** The released source serves every diocese.
Two answers, and the contract should take the first: the license is to the
source as it stands, and the diocese may run it only for its own parishes
and institutions; another diocese's data is never in the deposit (the
deposit is code and schema, not a database), so nothing of Lansing's
reaches Kalamazoo. The second, stripping other dioceses' config folders
from each deposit, is possible (they are `dioceses/<slug>/`) but adds work
for little; the use restriction does the job.

## 6. Layer three: source-available, and why not yet

The Functional Source License (Sentry; fair.io) permits any use except a
"Competing Use" (offering the software, or something substantially
similar, to others commercially) and converts each version to MIT two
years after release. Published under it, every diocese could self-host
today and anyone could host it in two years; eCatholic and LPi could not
resell the current version. It is the strongest possible form of "never
trapped."

Against it, for a services business whose revenue is support: the
two-year clock is per version and irreversible, so a competitor can
legally stand up the 2026 platform for a diocese in 2028 and undercut on
operations; publishing a multi-tenant codebase publishes the data model,
the chancery features and any weakness, so a security pass and secret
scrub come first; and a diocese hosting its parishes for money arguably
"makes the software available to others," so an express grant would be
needed so the license does not read against our own customer. Critics
call it "not open source" and note the terms can change; that is noise,
not revenue risk. Recommendation: revisit at three or more dioceses. A
cheap visible gesture now, if wanted: publish the parish theme or the
finder embed under MIT and keep the platform core under layer two.

## 7. The entity: a product company that owns the code

What solo founders do when a product gets its own recurring revenue, a
different risk profile and a plausible buyer (all three true here): form a
second LLC for the product. Two shapes. A sister LLC, Kevin owning both,
is simplest; a buyer buys the product LLC and Glazed Web is untouched. A
subsidiary, Glazed Web LLC owning the product LLC, keeps one identity at
the top; for a single owner the tax result is the same since both are
disregarded entities, and a wholly owned LLC subsidiary is disregarded
too (IRS, Reg. 301.7701-3). The CPA picks. Staying in one LLC with a DBA
($25) is what agencies regret: one liability pool, one balance sheet, and
a carve-out later.

Michigan costs: articles of organization $50; annual statement $25 (an
LLC formed after September 30 skips the first); attorney for formation
and an operating agreement roughly $350 to $1,650; Kevin as his own
registered agent, $0.

**The IP assignment is the step that matters most.** One to three pages:
Glazed Web LLC assigns to the product LLC all copyright, trade secrets,
marks, domains and goodwill in the platform code, schema, designs,
content and brand, for stated consideration, with a schedule of
repositories and domains and a further-assurances clause. Before the
first diocese signs, because the licensor named in the contract must own
what it licenses; before any investor or buyer, because chain of title is
the first diligence question. Marketplace bids $500 to $2,000. Two traps
for the attorney: confirm no client-owned code from the old
deliver-the-code contracts sits inside the platform (St. Mary was a gift
build; the single-site clients' code is theirs); and the diocese contract
must be drafted as a license, not from the code-transfer template.

**Liability.** A separate entity ring-fences the diocese obligations
(uptime, data, indemnity) from agency work and lets the liability cap sit
against the product entity's fees. Stripe matters here: with direct
charges the parish is merchant of record, but in every mode the platform
is responsible if a connected account goes negative; keep the Stripe
platform account in the product LLC's name and put negative-balance risk
in the parish terms. Parishioner data brings Michigan's breach-notice law
(MCL 445.72) and a data-processing addendum the diocese will want. The
shield for a one-person firm is thinner than people think; insurance does
more work than the entity does.

**What the diocese actually asks a vendor for.** A W-9 matching the entity
on the invoice; a certificate of insurance naming the diocese and bishop
as additional insureds, general liability $1,000,000 per occurrence under
the Michigan Catholic Conference's program for all Michigan dioceses
($2,000,000 in Detroit); and, where a diocese spells out tech vendors,
$1,000,000 cyber liability. Budget $1,000 to $2,000 a year for GL plus
tech E&O/cyber at $1M from Hiscox or Insureon in the product LLC's name.
Michigan dioceses are church trustee corporations; the signer is the
bishop, chancellor or CFO. The license is ordinary administration (canon
1277 extraordinary acts start at $250,000 for dioceses this size); the
finance officer is the real gatekeeper and will ask whether it is
budgeted. Changing the vendor entity after signing is a nuisance for a
chancery; form it first.

**Name and mark.** USPTO base application $350 a class (Class 42 for
SaaS; 36 if giving is marketed under the mark); first action about 4.5
to 5.6 months, registration about ten; intent-to-use filing is possible
before launch. Check tmsearch.uspto.gov, LARA's entity search and the
.com and .org in one sitting. "Catholic," "parish" and "diocese" in a mark
will be treated as descriptive and need disclaiming (eCatholic did
register ECATHOLIC in Class 42, so it is possible, but a coined word is
stronger and cheaper to clear); on the canon-law side no association may
call itself Catholic without the bishop's consent, and a chancery is more
comfortable with a name that does not claim to be. Name question stays
parked until Kevin raises it; this is what to check when he does.

**Precedent.** None of the vendors in this market trade as the founder's
agency. eCatholic is Webpro Productions LLC with a registered mark, took
growth equity in 2021 and bought a ChMS; LPi sold its giving products to
Ministry Brands and then itself to private equity; ParishSOFT belongs to
Ministry Brands; Pushpay was taken private; Flocknote has stayed
founder-owned for fifteen years on subscriptions. The buyers are roll-ups
that buy clean single-purpose entities with assigned IP and recurring
diocesan contracts; the giving module gets carved out and sold
separately, so keep giving as a module that could stand alone.

## 8. The sequence

| # | Step | Cost | When |
|---|------|------|------|
| 1 | Product LLC in Michigan (sister or subsidiary; CPA picks), EIN, bank account | $50 state, $0 to $1,500 attorney | Before signing |
| 2 | IP assignment Glazed Web LLC to product LLC; schedule of repos and domains; confirm no client code inside [attorney] | $500 to $2,000 | Before signing |
| 3 | Diocese agreement redrafted as a twelve-month SaaS license: layers one and two, data-processing addendum, breach notice, liability cap, Stripe direct-charge terms [attorney] | $1,500 to $3,500, reused for every diocese | Before signing |
| 4 | Insurance in the product LLC's name: GL $1M plus tech E&O/cyber $1M; diocese and bishop as additional insureds; COI and W-9 in the vendor packet | $1,000 to $2,000 a year | Before signing |
| 5 | Stripe platform account under the product LLC; parishes connect their own accounts; direct charges only; no platform controls | $0 | Before the first gift |
| 6 | First quarterly deposit and attestation to the diocese's storage | $0 | At go-live |
| 7 | Federal mark, intent to use, Class 42 (36 if giving is marketed) | $350 to $700, or $1,400 to $2,500 with attorney | Within thirty days of a name |
| 8 | S-corp election review | CPA fee | After the first diocese pays |

Steps 1 to 4 are about two weeks and $3,000 to $8,000 with an attorney,
or under $1,500 if Kevin files the LLC himself and pays only for the IP
assignment and the license review. Steps 2 and 3 are the two not to do
alone.

## 9. What changes in the copy, if adopted

Nothing has been changed yet; these are drafts for Kevin's yes.

**Letters, the ownership box** (both), replacing "The diocese holds the
repository, the hosting and the data, in writing. ... If the diocese ever
leaves us, it gets the working project, repository, hosting and logins.
Not a snapshot. Not an export.":

> The diocese owns everything it puts in and everything about it: every
> page, photo and document, every schedule, calendar and form, its domains
> in its own registrar account, its giving on each parish's own Stripe
> account, in writing. Export at any time, free, as readable files, as
> data and as a copy of each site that runs anywhere; feeds nobody is
> charged for. And if we ever fail the diocese, if we close, stop the
> platform or stop answering, it receives a perpetual license to the
> software as it stands that day, source included, to run for its own
> parishes, with a copy already in its hands. No one in this market
> offers that. eCatholic's terms say it "will not provide you with any
> form of export of your Website."

**Agreement, part 3, "Leaving, and what the diocese keeps"**, replacing the
section 3 reference:

> Ending the agreement ends it for every parish on it. The diocese and
> each parish keep everything that is theirs under "Export at any time":
> every page as readable files and as a static site that runs on any
> host, every photo and document, every schedule, calendar, event, group,
> notice and form submission as data, the domains in their own registrar
> accounts, and their Stripe accounts with every donor and recurring gift
> in them. Export stays open ninety days after the ending; we then delete
> what we hold and confirm it in writing. A parish the diocese releases
> can continue on its own at $99 a month, month to month, with no build
> fee, under its own agreement.

**Agreement, part 3, new item "If we fail you"**:

> If glazedweb dissolves, gives written notice that it is ceasing
> operations, files for bankruptcy or insolvency, discontinues the
> platform, terminates this agreement for convenience, or fails to cure a
> material breach of its support or uptime obligations within sixty days
> of written notice, the diocese receives a perpetual, non-exclusive,
> royalty-free license to the platform's source code and build
> documentation as they stand that day, to host its own parishes, schools
> and institutions, to modify, and to hire anyone it chooses to do so;
> not to resell it or host it for another diocese. Each quarter glazedweb
> delivers an encrypted copy of that code and documentation to storage the
> diocese names, with its hash and the exact version attested in writing;
> the key is held by glazedweb's attorney and released on any of those
> events. This agreement is a license of intellectual property under 11
> U.S.C. 365(n), and those copies are embodiments of it. The diocese's
> own decision to end the agreement does not trigger this item; what it
> keeps then is set out above.

**Agreement, part 1 bullet**, "The diocese holds the repository, the
hosting project and the data" becomes "The diocese holds its data, its
content, its domains and its accounts; the platform is glazedweb's, and
part 3 says what the diocese receives if glazedweb ever fails it."

**General terms section 3** ("You own the website ... the code
repository") stays as written for single-site clients and does not apply
to the platform; Exhibit A part 3 should say so in one sentence where it
already says these terms govern over section 5.

The lone-parish line ($99 a month under its own agreement) gets the same
layer-one promise and the same exit license.

## Sources

Exit license and escrow: Frost Brown Todd on 365(n)
(gibbonslawalert.frostbrowntodd.com/?p=5182); GC.AI escrow clause guide
(gc.ai/clauses/software-escrow); Law Insider source-code-in-escrow and
term-license-cessation clauses; Vermont Attachment D (dlt.com); Virginia
VITA chapter 25/27; Phil Hill on Canvas
(onedtech.philhillaa.com/p/friday-follow-up-20250207); DLA Piper business
continuity (2021); EscrowTech fees (escrowtech.com/software-escrow-fees);
Codekeeper pricing (codekeeper.co/pricing/software-escrow); The Register
2010-01-06 on NCC releases; Iron Mountain 2009 survey; Lewis Silkin
2024-10-28 on SaaS escrow; FSL-1.1-MIT template (fsl.software); Sentry FSL
announcement; fair.io/licenses; Ronacher 2024-09-23.

Portability: eCatholic terms (ecatholic.com/terms-of-service, read in full
2026-11-05) and help center articles 203, 1224, 250, 2189, 1676, 831;
aod.org/ecatholic; Flocknote terms and help 113, 77; Planning Center terms
(2026-09-21); Tithe.ly terms (2026-09-21); Pushpay organization
agreements; Whole Whale on donor payment tokens; Better Giving, Nucleus and
Simple Donation migration guides; Stripe docs: connect/accounts,
connect/direct-charges, connect/subscriptions (disconnect behavior),
connect/cloning-customers-across-accounts,
connect/platform-controls-for-stripe-dashboard-accounts,
get-started/data-migrations/pan-export, connect/merchant-of-record;
Squarespace, Wix, WordPress.com, Ghost and Webflow export help pages;
Archdiocese of Los Angeles handbook 10.3.5; Diocese of Raleigh 2026
guidelines; Arlington social media policy (2018); Seattle EC 18; Des
Moines draft data ownership policy; NTEN Equity Guide 2025 p.14, p.30;
Venable, Technology Contracts for Nonprofits (October 2026).

Entity: Michigan LARA FAQ and name reservations; IRS single-member LLC
page and Reg. 301.7701-3; Weintraub 2026-01 on startup IP; SPZ Legal
spin-out guide; ContractsCounsel Michigan bids; USPTO fee changes
2025-01-18 and pendency report 2026; USPTO disclaimer guidance; TTABlog
HOLY HABITS (2025-11); Justia ECATHOLIC registration 5673881; OSV News and
Ius et Iustitium on canon 300; Michigan Catholic Conference third-party
vendor requirements; Arlington insurance requirements; Orlando vendor
qualification form; USCCB complementary norms for canons 1277 and 1292;
1931 PA 327 section 450.160; MCL 445.72; Stripe connect/manage-risk;
Hiscox, TechInsurance, Insureon, Vouch and Thimble cost pages; Mergr on
eCatholic, Greenridge, GabrielSoft, LPi and Sound Growth; Ministry Brands
on WeShare; parishsoft.com/about; Pushpay press releases; Inc. on
Flocknote; diocesan.com.
