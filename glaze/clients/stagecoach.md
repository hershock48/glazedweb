# The Stagecoach Inn

**Repo** `hershock48/stagecoach` · **Host** stagecoach.glazedweb.com (proposal at `/`, demo at `/demo`, both noindex) · **Prospect**, not signed, nothing sent · Built 2026-08-18 · Re-pitched cold 2026-10-28 · Ledger `stagecoach`

**Build page** glazedweb.com/build/stagecoach · **Agreement** glazedweb.com/agreement/stagecoach · registry row `stagecoach` in `lib/customOrders.js`. **Price: $3,000 build, $150 a month, ordering a $500 add-on with the 99¢ guest fee.** That is the Mike's Place tier applied by Claude on 2026-10-28 because the build is the same shape; Kevin ruled it the same day ("Yes, keep it"). The August letter's $1,900 + $99 and its 50/50 split of the order fee are retired.

## What they are

Bar and restaurant at 201 W Michigan Ave, Marshall, MI 49068, in a building
that has been a stagecoach stop since 1838. (269) 781-3571. Open Monday to
Saturday 11am to midnight, Sunday 10am to 10pm. Chef Jared Knight. Trivia
Wednesday 7 to 9, DJ bingo Thursday 7 to 9, live music Saturday (no time
published anywhere), karaoke Sunday 7 to 10. Toast's mirror site says "now
under new ownership and management" and names nobody. Owner unnamed in
anything public; do not guess.

## Web presence, audited 2026-08-18 and re-checked 2026-10-28

Nothing had changed between the two checks.

- **stagecoach1838.com**: WordPress on Flywheel with Elementor. Sitemap lists
  three URLs (home, contact, privacy policy). `/menu/` returns 404; every Menu
  link in the nav goes to order.toasttab.com. `/events/` reads "There are no
  upcoming events" while the homepage advertises three weekly nights. The
  phone number appears zero times in the homepage source. Yoast schema is
  WebPage, WebSite and Organization only: no Restaurant or BarOrPub type, no
  address, phone, hours or menu. Homepage loads 37 stylesheets and 19 scripts
  (18 in August). Features Ahi Tuna, which is not on the ordering menu.
- **thecoach.toast.site**: Toast's own site about them, with the phone number
  above the fold and the Saturday live music line. Returns 403 to curl; open
  it in a browser.
- **Toast ordering**: order.toasttab.com/online/the-coach-201-west-michigan-avenue,
  61 items harvested 2026-08-18 with photos and modifier groups. Also a Toast
  waitlist and rewards signup.

## Decisions on file

**Hook:** "You own the building. You do not own the website." Unchanged
since August; the share card (`public/pitch/og.jpg`) carries the same line,
so no regeneration was needed on the re-pitch.

**The order fee is one sentence**, matter-of-fact, no defense (standards.md).
The August letter's Toast-versus-ours money dial and its Menufy and Owner.com
comparisons were cut on 2026-10-28: the dial assumed the bar kept half the
fee, which is not the terms, and the pitch is better-not-cheaper (counter
thesis, 2026-09). "We do not touch your register" stays.

**Ordering terms are Part 3** on the registry row, copied verbatim from the
Mike's Place row so the two Marshall bars carry identical terms. The register
is Toast; the processor for web orders is the studio default (Stripe) unless
Kevin rules otherwise.

**Footer credit reads "Double Dipped by"**, following Bates, Mike's Place and
two others. Kevin has not ruled it for this build; ask.

**Launch page and agreement** per `../launch-page.md`: Launch in the four
places (header pill, hero ghost, step 1, closing band), agreement a plain link
under the closing button. Eight needs, six steps, no freebies, four links,
four try-it items.

## Before the letter is sent

The Vercel project `stagecoach` has **no environment variables** (checked
2026-10-28). Without `DATABASE_URL` orders live in one lambda's memory, and
without `ORDERING_DEMO_ALWAYS_OPEN=1` the order page only opens in kitchen
hours. The try-it list on the build page assumes both are set. `KITCHEN_PIN`
falls back to the street number, which is what the letter says. Kevin sets
these in the dashboard; never paste values into a file.

The pitch folder (`public/pitch/`) and the host rewrites in `next.config.ts`
are deleted at signing or passing, per the stagecoach README.
