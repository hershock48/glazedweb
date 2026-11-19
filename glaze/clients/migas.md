# MI Gas

**Repo** `migas`, **not** `mi-gas` · **Client's domain** mi-gas.net ·
**Build host** migas.glazedweb.com

## What they are

Cannabis cultivation consultant operating a licensed Michigan facility. Sells
consulting to other growers: room triage, program review, the fixes that come
from having actually run a canopy.

**Engaged as of the 2026-08-27 owner call.** His direction, all landed in the
repo the same day: merch sales off the site, guide selling off the site (the
Patreon gets one advertising section instead, with only numbers checkable on his
public page), consulting at **$250/hour, his number**, a **co-management** offer
in his own terms ($50-150/light by project size, Aroya/Pinnacle/Growlink-class
sensors required and TrolMaster excluded, head grower must run the program,
grower-relocation network, genetic sourcing via Bractworx or another nursery,
design-build by conversation), and booking availability he edits himself at
`/admin` with his calendar's iCal feed removing taken slots.

## Decisions on file

**Booking is the whole point.** In the client's words: "like Calendly but make the
whole experience better." Built into the site rather than rented, per the
no-paid-dependencies rule. A scheduler is a slot list; a calendar invite is a text
format from 1998 and about eighty lines.

**A hand-written slot list does not know what is already booked.** Say that
plainly and leave a named seam for a calendar feed rather than implying
availability is solved.

**The logo is a black interlocked MIGAS wordmark**, set once then mirrored
vertically beneath itself, over a burning sun. The wordmark currently in the build
is **not** their real logo; it needs their actual file and font.

**The sun is the site's signature and it is expensive to get right.** Notes that
cost real hours:

- `mix-blend-mode` inside an isolated stacking context costs a tiled backdrop
  read-back, and a tile that resolves its backdrop differently from its neighbours
  prints as a **visible square**. On a 3× display the WebKit compositor tile is
  512 device pixels, which is 170.7 CSS px. It is also the largest performance
  cost available on an animated element: three blend layers ran at 30fps where two
  ran at 60. The churn layer is plain alpha now, no blend mode.
- `filter: blur()` does not soften fine structure, it erases it. Build soft edges
  from stacked geometry or a mask.
- Headless WebKit is not iOS Safari. It rendered the sun correctly while a real
  iPhone showed a grey square. Anything visually unusual needs a real device.

**Consulting page renders per request.** `export const dynamic = "force-dynamic"`,
not `revalidate`. A page whose content depends on the current date cannot be
statically generated or revalidated on a timer: regeneration is request-triggered,
so on a quiet site the cached page ages indefinitely and serves times the server
then rejects. That killed the booking form for fourteen days once.

**Copy voice.** See `migas-voice.md`, drawn from his own Patreon writing. The
short version: he is specific to the decimal, he hedges on purpose, he credits
everyone including people who have wronged him, and he is explicitly anti-hype.
He is not epigrammatic, which is the trap the current site copy fell into.

Diagnosis rather than introduction. The closing line, after
several passes: *"Yours has a switch, a schedule and a feed chart. Somebody set
every one of those, which means every one can be changed. That is what the call is
for."* Everything in that sentence is a decision, which is the point.

**Credit reads "Baked by"**, not "Double Dipped by". A donut pun lands wrong in a
room where somebody is mid-decision about spending real money on expertise.

## Permissions

Logo and any photos from mi-gas.net, granted.

## Palette and type

From `tailwind.config.ts`. Archivo for display, Inter for body.

| Token | Hex |
|---|---|
| ink / panel | `#060403` / `#151010` |
| line / edge | `#332621` / `#77604F` |
| bone / muted | `#F7F3EC` / `#A89C90` |
| ember / hot / deep / core | `#D95E27` / `#F0722C` / `#8E2C11` / `#5E1B0A` |
| flare | `#F5A83C` |
| hot | `#FFEFA8` |
| alert | `#FF9E8C` |

`ink` is near-black rather than `#000000` on purpose: a true black clips on OLED
and makes the sun's outer corona terminate in a visible edge instead of falling
off into the page.

**Button labels are `ink` on `ember`, never `bone`.** Ink on ember is 5.44; bone on
ember is 3.40 and fails for normal text.

`og.jpg` is 1200×630 and about 196KB, rendered from an `app/og-card` route rather
than assembled by hand.

## Retired

- **`robots.txt` with `disallow: "/"`.** It protected nothing, because robots.txt
  governs fetching and not indexing, and it broke every link preview except
  Apple's. What keeps the build out of the index is the pair that remains:
  `robots: { index: false }` in the metadata export and the `X-Robots-Tag` header
  in `next.config.ts`. **Both come off together on launch day**, and a sitemap goes
  in at the same time.
- **`site.url` pointing at the client's Squarespace domain** while the build lives
  elsewhere. It aimed every canonical, the sitemap and every OG url at a site we
  do not control.
- **The plume/flare SVG layer on the sun.** Random strands left over from an
  earlier build. The exterior fire carries the flare now.

## The co-management division prospect (Kevin's own notes from the same call)

Not yet a project; recorded so the site decisions below read correctly.

Jake is in talks with a partner group: they sell books, programs and biosecurity
SOPs for grows, run a beneficial/predatory-insect business ("wrong bugs wrong
time" was their teachable failure), have a greenhouse in the greater Detroit
area with exotic plants, and brought in partners from LA and New York. The idea
on the table: a **co-management division that Jake runs**, presented to them
with a framework and business model, managing grows around the country,
charging **a flat fee** because it is "more digestible for the owner grower
who's paying it." Working phrase in Kevin's notes: **"Plantsmen grow management
model"**, likely the model's name, not confirmed as the company's; two web
searches found no matching company, so identifying them is a question for Jake.

**Two consequences for the work:**

- The shipped per-light pricing ($50-150/light) is Jake's solo rate card and may
  be superseded by the division's flat fee. Pricing already reads from one
  constant, so the pivot is one edit; do not harden per-light language anywhere
  new.
- The Glazed Web upside is bigger than the migas site: build the division's
  site by converting the co-management work, then manage website, platforms,
  content, and design the SOP/template/paperwork library. The current
  /co-management page plus the booking loop is effectively the demo for that
  pitch.

Also in Kevin's notes: besides the booked-consult flow, Jake wants to capture
"random calls", visitors who will not finish an intake ("some might know and
others don't know what's up"), worded so both kinds convert. **Both capture
paths shipped 2026-08-28:** the co-management application at
`/co-management#apply` (nine questions in `COMANAGE_APPLY`, capture-not-wall on
the disqualifying sensor answers) and the callback at `/consulting#call` (name
plus ONE of phone or email).

## Retired by the 2026-08-27 call

- **The consulting-rates placeholder.** $150/$300/$500 were ours; $250/hour is
  his. Prices now derive from `RATE` in `lib/site.ts`.
- **/shop, /guides, MERCH, GUIDES, BUNDLE, the restock and guide-request
  actions.** The site no longer sells anything directly; the booking request and
  the question form are the only forms left.
- **The static-availability caveat.** `lib/slots.ts` spent its life promising a
  calendar-feed seam; it is filled. Windows are Blob-stored JSON edited at
  `/admin` (PIN via `MIGAS_ADMIN_PIN`), busy times come from
  `MIGAS_BUSY_ICS_URL`, every failure is open so the form never goes down with
  the feed. Recurring events deliberately not expanded; counted and logged.

## Open

- **The env settings before anyone real books**, all visible as a status panel
  on `/admin`: SMTP, `MIGAS_NOTIFY_TO`, `MIGAS_ADMIN_PIN`, a Blob store on the
  Vercel project, and `MIGAS_BUSY_ICS_URL`. Since 2026-11-04 the day-before
  reminder also needs `CRON_SECRET`. `STRIPE_SECRET_KEY` stays unset until the
  processor is decided, and the booking goes on the invoice path meanwhile.
  Kevin sets them in the dashboard. Then book a real test call end to end
  (inbox + phone calendar + slot gone + the reminder the day before).
- **Closed by his email of 2026-11-04** (see "The site in his four sections"
  below): the co-management project minimum, moot now that co-management is
  priced by the platform's tiers, and the 30/90-minute prices, replaced by his
  own two numbers, a half hour at $250 and a full hour at $400.
- **Patreon dashboard exports**: member growth over the years and member quotes,
  both offered by him on the call. Seams in `PATREON` render them when supplied.
  Refresh `PATREON.stats` (45 members / 162 posts / from $100, read 2026-08-27)
  and bump `checkedOn` whenever touched.
- **The credentials strip.** "Licensed / 4 / SOPs" is not doing the job. This was
  blocked twice on the assumption that it needed a licence class, a licence number
  and a canopy figure from him. **His own writing says that is not what he thinks
  proves anything**, so it is no longer blocked on paperwork. See the proof section
  of `migas-voice.md`: what he treats as evidence is the same rooms photographed
  over time plus stated deltas, and there are several of those in his own words.
  Still confirm any figure with him before publishing, since the posts are dated
  and the numbers move, and run any licence wording past him because what a
  licensed operator may claim is his lawyer's question. **Do not invent any of it.**
- **A real email address.** The ICS invitation is not a true invitation without an
  `ORGANIZER`, which RFC 5546 §3.2.2 makes mandatory in `METHOD:REQUEST`. Without
  it Outlook refuses the item and other clients drop Accept and Decline.
- Whether the compositor-tile square is actually gone on a real iPhone. Not
  verifiable from a sandbox.
- Stripe's published restricted-business list prohibits courses and information on
  cultivating marijuana, so the processor question may not be answerable yet.
  First ask: what settles his existing Squarespace store sales today? The
  Checkout code shipped 2026-11-04 behind `STRIPE_SECRET_KEY`, off until this
  is answered; `lib/pay.ts` in the migas repo says why.
- **His picks for the tiles**: four Instagram posts and four Patreon posts.
  Stand-ins are on the home page until he sends them. Also his to supply: the
  reviews text.
- **A text reminder** needs a messaging provider he has not chosen. The .ics on
  the phone is the phone reminder until then.
- **Whether the November restructure, the payment step and the cron sit inside
  the $1,000 build** or are an addition. Kevin's call.
- **When the pitch host converts**: he is in, so the day the deposit lands the
  rewrites() block and public/pitch/migas come out, noindex comes off with the
  domain cutover per the README's Going live section.
- Whether to gate the live URL, the h1 weight, the price ticker placement, and
  where the `Totem` mark goes. All open, all Kevin's call.

## Launch page and agreement (2026-09-10)

Per `glaze/launch-page.md`. The `migas` row in `glazedweb/lib/customOrders.js`
renders both; the proposal closes on "Launch" (header pill, hero ghost button,
step 1 of "What happens next", the closing band).

- **Build page** `glazedweb.com/build/migas`: fourteen needs, eight steps
  (including the September 3 wording pass, which is inside the build fee), one
  freebie (the post-call scope at the August price), three links (the demo, the
  availability editor, the one-pager). **No try-it list on purpose**: the editor
  is off until `MIGAS_ADMIN_PIN` exists and the mail until SMTP does, so nothing
  on the demo leaves a trace he could find afterwards, which is what the page's
  try-it intro promises. Add one the day both are on.
- **Agreement** `glazedweb.com/agreement/migas`: $1,000 build (Kevin,
  2026-09-16, down from $3,500; the letter's revision line says so), $150 a month
  (Kevin, 2026-09-10, up from the letter's $99),
  edit allowance 2 hours and $125 an hour (house numbers, unconfirmed). Part 3
  covers the mailbox login, the private calendar address, what a grower sends
  through the intake, his hours document, no card taken, and no legal advice on
  licence wording. No `figures` yet.
- **The in-repo agreement is retired.** The migas repo carried its own
  `/agreement` (Anchor's clickwrap ported, `lib/agreement.ts`, a server action
  emailing the record) from 2026-09-03 to 2026-09-10. Same rule as Anchor: one
  home. `next.config.ts` 308s `/agreement` to the studio page; the row above
  absorbed its two facts (the wording pass in scope, the 2-hour allowance).
- **Paper twin**: `contracts-private/build-migas-agreement.js` (cloned from the
  Anchor generator 2026-09-10) writes
  `Glazed_Web_Client_Agreement_v1.1_MIGAS_DRAFT.docx` and `.pdf` (PDF via Word
  COM). It mirrors the registry row's numbers, scope and part 3 by hand; change
  both in one commit. The v1.0 draft of 2026-08-28 was deleted. Still bracketed:
  the entity, the address, Jake's last name, the annual adjustment cap, the two
  dates.
- **Open on the row**: registered entity, Jake's last name, email, town, and the
  edit allowance.

## Remote Grow Solutions: the platform (2026-11-04)

Jake forwarded a planning thread (ChatGPT, November 2026) for a second
business, **Remote Grow Solutions**: subscription cultivation management for
commercial grows, high volume and lower price than the per-light
co-management on the site (which is the Plantsman model). Kevin said build
it. It lives in its own repo, `rgs/` (private), catalogued in
`glaze/catalog/apps.md`; the migas site is untouched by it.

**Facts from his thread, now in `rgs/lib/site.ts` and `lib/pricing.ts`:**
four tiers at $2,000 / $4,000 / $6,000 / $8,000+ a month, set by flowering
lights (100 / 400 / 750) OR flower rooms (2 / 5 / 8), the higher of the two
wins and the prices are never added; a 10% light-count expansion allowance
for existing customers reviewed at renewal; three check-ins a week per
flower room; one 60-minute call a week; a weekly report (week behind, week
ahead); a living calendar; call notes the client keeps for good; clone, mom
and veg advisory included at no additional cost (his decision, replacing the
earlier paid add-on idea); three-month minimum; an onboarding fee for
complex facilities, number not set. The thread also noted the sensor API
dependency (Aroya, Growlink, Pinnacle), which the build treats as typed
input until a platform grants access.

**Open with Jake:** the inquiry mailbox (`SITE.email` is a PLACEHOLDER), the
host (rgs.glazedweb.com meanwhile), the onboarding fee number, which sensor
platforms grant API access, and billing. His thread assumes Stripe
subscriptions; the migas booking code already records why Stripe is a
problem for cultivation education, and management is the same category.
Nothing in the build takes money.

**Kevin steps before a paying facility:** Neon database and a Blob store on
the Vercel project, `RGS_ADMIN_PASSCODE`, create the first facility, run one
full week on the deployment. The README carries the launch checklist with
what is verified and what is not.

## The site in his four sections (2026-11-04)

Jake's email of 2026-11-04 set the home page's shape, and the migas repo
follows it (commit 7150362): intro (the sun, his canopy, three ways in),
Patreon and Instagram (both clickable, four tiles each), schedule a call,
co-management. Nothing after. Remote Grow Solutions is a product within
MI Gas; the co-management section shows a real screenshot of it and links
to the demo.

**Prices changed, his numbers from the email:** a half hour at $250, a full
hour at $400. The 90-minute call is gone. **The per-light co-management
range from August is retired everywhere** (home, /co-management, the
one-pager); co-management is priced by the platform's four tiers
($2,000 / $4,000 / $6,000 / $8,000+ a month by flower rooms or flowering
lights, the higher wins). `COMANAGEMENT.tiers` in migas `lib/site.ts` and
`lib/pricing.ts` in the RemoteGrowSolutions repo carry the same four; change
both. The project minimum and per-light billing cadence, long open on the
registry row, are moot.

**Schedule and pay:** Stripe Checkout at booking behind `STRIPE_SECRET_KEY`,
with the webhook marking the booking paid and emailing him. The processor is
NOT settled (Stripe's restricted list names cultivation courses and
information); until Jake and his bank decide, the key stays unset and the
booking goes on the invoice path. **Reminders:** bookings kept in the Blob
store, an hourly Vercel cron emails both sides the day before
(`CRON_SECRET`). A text reminder needs a messaging provider he has not
chosen; the .ics on the phone is the phone reminder until then.

**Still his to supply:** the four Instagram posts and four Patreon posts
(stand-ins on the page until then), the processor decision, the reviews
text, the email address. **Open with Kevin:** whether the restructure, the
payment step and the cron sit inside the $1,000 build or are an addition;
the Exhibit A scope lines on the registry row now describe the new shape.

## Security bump merged (2026-11-11)

`claude/next-security-2026-10` (2026-10-22: next 15.5.23 to 15.5.28, sharp
pinned at ^0.35.5, for the October 2026 advisories) sat unmerged for three
weeks. Kevin said merge it on 2026-11-11. Merge commit `e2aa3ac` on migas
main; `npm ci` and `next build` passed on the merged tree first (13 pages,
types and lint clean). Only `package.json` and `package-lock.json` changed,
and main had not touched either since the branch was cut.

`claude/migas-wording-agreement-q05hnr` has nothing main lacks and can be
deleted. Not deleted; nobody asked.

## UX pass merged (2026-11-11)

Kevin asked for a UX and UI pass over the whole site and sent three of Jake's
room photos to use. Branch `claude/ux-pass-2026-11`, merged as `d6b6121` on
his OK. The branch commit (`20d6767`) lists every behavior change with its
measurements. The ones to know:

- The booking wizard's time step overflowed on phones, because a `<fieldset>`
  sizes to its widest child, and the whole page zoomed out at 390px. Fixed
  for every fieldset in globals.css.
- "Book Half hour" and "Book Full hour" links carry `?session=hour` or
  `?session=half`, and the wizard opens on step 2 with that session chosen.
- Commit `7150362` used `.dot` on five lists and never defined it, so those
  bullets were invisible. It is defined now.
- The three photos are on the home page (one on phones), as WebP with all
  metadata dropped. LCP on `/` went from 3.12s to 2.06s on a throttled phone
  after the sun textures moved to lossless WebP and the first one got a
  preload.
- Reviews is out of the header nav until `REVIEWS` has a real quote, and the
  footer no longer prints "Email: to be supplied".

## Copy that sounds like AI (2026-11-11)

Kevin, 2026-11-11: Jake is intense about anything on the site that reads as
AI-written. Treat every line as read by an expert detector: the best study we
have found that people who use AI tools daily spot AI text almost every time,
paraphrased or not. The house reference is `glaze/writing-tells.md`. Run
`glaze/scripts/tells.mjs` against a production build before any copy ships.

**The first pass** is migas branch `claude/copy-pass-2026-11`, merged to
main as `7c6ea49` on Kevin's OK (2026-11-11). It took the live site from 2 hard
and 50 check hits to 0 and 14, each of the 14 read and kept. It also removed
the "Most booked" badge on the full-hour card, which claimed bookings the site
had never taken.

**Decisions:**

- "We" stays. The marketing research says to use "I" for a solo practice, but
  his posts say "we" for a real team (see migas-voice.md), so "we" is his voice.
- Contractions follow his writing.
- His own phrases stay even when the checker flags them: "Grow with us", the
  call topics from his email, and his Patreon tagline.

**Ask him:**

- The three draft FAQ answers in his own words: confidentiality (consulting and
  co-management) and rescheduling, plus term and notice for co-management.
- One thing that went wrong that he is willing to publish. His posts always
  have one and the site has none. Nothing gets lifted from the Patreon to fill
  it.
- Whether MI Gas takes a cut on any gear, nutrients or genetics it recommends.
  If it takes none, saying so is a claim a nutrient company's education arm
  cannot make (migas-voice.md, "no product attached to his advice").

## Debug and UX pass, merged (2026-11-11)

Kevin, 2026-11-11: "double check and debug. improve ux and ui in pass." Migas
branch `claude/ux-debug-pass-2026-11` (`8849010`), merged as `7e3e63d` on
Kevin's OK the same day. Its commit message lists every change with the measurements. What
later work needs to know:

- The three small forms (call-back, question, co-management application) move
  focus to the first problem after a rejected submit and to the confirmation
  after a sent one. On a phone, both used to land off screen.
- `.wrap`, `.eyebrow`, `.btn*`, `.card` and `.field` are in `@layer components`
  now, so a utility beside one of them wins. Before, the class won silently.
- Two-column form fields are three rows of a subgrid (label and hint, control,
  message). Keep the label and hint inside the first row's wrapper, or the
  pairs stop lining up.
- globals.css has a print block for every page except the one-pager's sheet.
  Printed from the top, /co-management used to come out with 6 blank pages.
- The Professional tier highlight is gone. It never rendered, and drawing it
  would have recommended a tier with no reason given.

**Ask Jake:**

- Whether a co-management prospect's first call is the paid full hour. The
  buttons on /co-management now say "Full hour $400" beside them, because
  that is where they go.
- Whether the application should ask for a flower-room count. Tiers are priced
  by rooms or lights, and today only lights is asked.
- Whether to name or picture who takes the calls.

## Motion, the loop redrawn, the demo sign-in (2026-11-11)

Kevin, 2026-11-11, after seeing the site: more motion, a better co-management
loop graphic, the AI-sounding lines he still saw on the home page, the demo
button "behind a lock", and "push all to live". Migas `e4a3d2e`, merged as
`1f21066` and live. The commit message has every change and the measurements.
For later work:

- Motion classes in globals.css: `.stagger` on a card grid (the Reveal
  component watches it; never on a `gap-px` grid, whose background flashes),
  `.lift` on a linked card, `.drift` on a photo inside an `overflow-hidden`
  frame, and `.scroll-progress` in the header. All of it is off under reduced
  motion and nothing animates on the first screen.
- The loop's styles are `components/SteerLoop.css`, loaded only where the loop
  is drawn. The light and the station flares share one 8s cycle; change both
  durations together or they drift apart.
- The demo button shows the platform's demo sign-in (facility `demo`, passcode
  `grow-demo`) from `COMANAGEMENT.software.demoLogin`. If the platform changes
  it, change it there. A one-click demo needs a change in the `rgs` repo,
  which this session could not reach.
- Home copy changed: the section heading is "Half an hour or a full hour"; the
  mirrored session taglines are gone; guide and service titles lost their
  comma shape; new hero and footer lines. "The work is public. The method is on
  Patreon." and "The foundation." went with the copy pass (`7c6ea49`); if
  anyone still sees them, the page is stale.

**Still his to supply:** his four Patreon picks. Two stand-in titles now name
his real posts (the complete bloom guide, the runoff guide).

## Build fee checkout fixed (2026-11-12)

Jake tried "Pay the build in full" on /agreement/migas three times at 19:15 UTC
and got "The card page could not be opened just now" each time. Stripe had
answered 400 "Invalid email address: " because this order's `email` is empty
(no MI Gas address exists yet) and checkout sent it anyway. Every payment
button failed the same way: full, half, build plus monthly, and monthly. Fixed
in glazedweb `e843fe2` (merged `1f486ec`): an address that isn't real is left
out, and Stripe asks the client for one on its own page. Checked live with one
unpaid session; no money moved. When Jake gives a real address, put it in the
order's `email` and Checkout will prefill it.

## Admin switched on, storage connected (2026-11-12)

Kevin set `MIGAS_ADMIN_PIN` (production) and asked for /admin to be debugged
before it went to Jake. What changed:

- **Storage.** Blob store `migas-availability` (`store_aa012wFV9Hxejj5y`,
  public-read, iad1) is connected to the migas project for production and
  preview, which adds `BLOB_READ_WRITE_TOKEN`. Created with the Vercel CLI on
  Kevin's Mac; the Vercel connector is refused (403) on store creation.
  /admin could sign in before this, but every save was refused.
- **Admin fixes**, migas `922bdcc` (merged `5db320c`): a rejected save keeps
  what was typed, the weekly hours stack on a phone, and the status panel
  reads for the owner.
- **Booking records**, migas `14b3f1e`: connecting the store also switched on
  `lib/bookings.ts`, which was writing each booking (name, email, phone) to
  `bookings/<reference>.json` in the public store, a guessable address. The
  path now ends in an HMAC of the reference. No booking was written under the
  old path. A private store for bookings would be stronger; it needs a second
  store and token.

Still off, and the admin's status tiles say so: his calendar feed
(`MIGAS_BUSY_ICS_URL`), outgoing mail (SMTP), and an address for bookings
(`MIGAS_NOTIFY_TO`). `CRON_SECRET` is unset too, so the day-before reminder
does not run yet.

## Calendar, mail and bookings checked before connecting (2026-11-12)

Kevin asked that each connection be proven before /admin went to Jake. Tested
on a production build against local stand-ins (an ICS feed, an SMTP server,
the Blob API), not against his real calendar or mailbox. Migas `8fbcb5a`,
merged `f47b3e9`; the commit message has every finding.

- **A booked time closes at once.** The grid subtracts the bookings on record.
  Before, the same time could be booked twice until he added the invite to his
  calendar by hand.
- **/admin lists upcoming calls** with Remove, which reopens the time and does
  not email the grower.
- **Repeating calendar events block their times** (daily and weekly rules).
  Monthly and yearly rules are not read; /admin counts them.
- **/admin has "Send a test email"**, which shows the mail server's own error
  when it fails.

**To connect each piece** (Vercel, migas project, then redeploy):

- Calendar: `MIGAS_BUSY_ICS_URL`, his calendar's private iCal address. A
  `webcal://` link works as given.
- Mail: `SMTP_HOST`, `SMTP_PORT` (587, or 465 for implicit TLS), `SMTP_USER`,
  `SMTP_PASS`, `SMTP_FROM`, and `MIGAS_NOTIFY_TO` for where bookings land.
  Then press "Send a test email" on /admin.
- Reminder: `CRON_SECRET`, any long random value. It also needs mail.
- The invite stays METHOD:PUBLISH until `SITE.email` in migas `lib/site.ts`
  is a real address; that one is a code change.


## Remote Grow Solutions: Jake's second review (2026-11-16)

His email "Kevin software", read from a photo of it. RemoteGrowSolutions
`33c69d8`, live on remotegrowsolutions.vercel.app. The repo README has the
point-by-point table.

**What he asked for, in his words where it matters.**

- Consultant side: "Need this eliminated" (the four counters). No "needs a
  look", no "1 of 3, 2 to go". "This side doesn't need to be as
  instructional. Just use color coordination and/or check list style in each
  room."
- A visual for each flower room, "maybe even a 3d profile of the room with a
  simple rendering of benches/lights/ and plants".
- A full irrigation schedule worked out from dripper size and drippers per
  plant, P1 and P2 with on and off times.
- Logins for Aroya, Growlink and TrolMaster so live graphs show under
  irrigation and environment. Substrate sensor data uploads as a graph.
- The customer is prompted for daily and weekly tasks, starting from his own
  laminated weekly sheet with the facility and name details removed. The list
  checks itself when the information is entered.
- A guide page with a video for runoff reads: at least two plants per feed
  zone, spread out, or a whole-row collection, or both.
- Runoff EC, pH and volume for each feed zone of every room.
- No "this week" tab on either side. Prompts sit under each room, with small
  alerts at the top or bottom of the screen.
- Mobile friendly. Aroya's customer interface is the reference for a simple
  profile.
- A question: can calls be hosted in the app with notes generated
  automatically?

**Built.** All of it except the four items below.

**Not built, and why.**

- Live readings pulled from a vendor. Growlink documents a developer API on
  its Sprout plan and above. TrolMaster runs an API gateway that issues keys
  on request for a monthly fee per device. No public Aroya API was found.
  Each needs its own connector and a real facility's key to test against.
  Until then a room links out to the vendor's live dashboard and draws graphs
  from an uploaded CSV export.
- Stored vendor logins. Nothing in the app can use one, so the profile
  records the platform and the access route with no password field.
- Video upload. Photos upload; a phone video needs direct-to-storage upload.
- Calls in the app with generated notes. It needs a calling provider,
  transcription, a model API key and recording consent. The model key
  conflicts with the no-API-key rule, so it is Kevin's decision.

**Two things only Jake can settle.**

- His sheet is Monday to Friday. The public pages still say three check-ins a
  week.
- He names TrolMaster for temperature and RH graphs. The public requirements
  still say TrolMaster sensors are not supported, which was about substrate
  sensors on the August call.

**Still his to supply.** The runoff video, and a read of the guide's written
steps, which are the ordinary method and a draft until he confirms them.

## Rename, the Aroya reference, time off by blocking (2026-11-16, later)

A second note from Jake the same day. RemoteGrowSolutions `3939ba5`, migas
`3a7b7ae`.

- **The platform is "MI-Gas x Plantsman Management" now**, spelled as he
  wrote it, "instead of RGS". Changed everywhere a customer reads it, on the
  platform and on the MI Gas home page. The repository, the
  remotegrowsolutions.vercel.app address and the `RGS_` variables keep the old
  name until Kevin renames them.
- **Aroya is the format reference**, in his words "one of the most important
  notes": their customer interface, "without having to start from scratch or
  reinvent the wheel". Their app is behind a login, so what was read is what
  they publish on aroya.io. Taken from it: a row of ring gauges at the top of
  each room, every room as one table of latest readings with a status, and
  the run as a strip of weeks. Ours colour the status against the room's own
  setpoints. He named the differences himself: direct management and runoff.
  If he can share screenshots of his own Aroya account, the next pass can be
  closer.
- **"I guess we need to test scheduling and payment."** Scheduling was tested
  end to end on a production build against a local stand-in for storage: a
  full booking, the time closing, /admin listing the call. Payment is OFF on
  the live site: there is no Stripe key, so bookings go on the invoice path.
  The half that is ours was tested with a locally signed notice: it marked
  the call paid, refused a wrong signature and ignored a repeat. Creating a
  real card page needs a Stripe test key in Vercel, and the processor
  question in `lib/pay.ts` is still open.
- **Time off by blocking.** His words: "instead of setting availability, I'm
  just blocking off windows I'm not available and outside of that I'm open
  from 7 am to 10 pm". /admin has a Time off section with one-off blocks,
  weekly blocks and whole days, and one button that sets the weekly hours to
  7 AM to 10 PM every day. The default hours were left alone because he wrote
  "I might". He presses the button when he wants it.

Still off on the live MI Gas site, same as 2026-11-12: his calendar feed,
outgoing mail, the address bookings land at, the reminder, and card payment.
Until mail is connected a booking is saved and shown on /admin but emailed to
nobody, and the confirmation screen says so.

## Correction on vendor APIs, the API key field, the room redrawn (2026-11-16, evening)

Kevin asked whether the vendor findings above were certain. One was wrong.
RemoteGrowSolutions `1ca812a`, migas `c58ac10`.

- **Aroya does publish an API.** The two sections above say none was found.
  It exists: a REST API, the key issued by Aroya customer support and tied to
  an Aroya user, with facilities, rooms, devices, a chart per room and per
  device, and a validate call.
- **TrolMaster.** Read-only sensor readings, Pro controllers only, requested
  through their API portal. Their help center says it is free for now. An
  older TrolMaster page quoted $15 a month per device. They have to confirm.
- **Growlink.** Keys on request, and access depends on the plan.
- **So the key is the login.** No vendor lets another app sign in with a
  username and password. The facility profile now takes each vendor's API
  key, sealed before it is stored and shown as its last four characters. An
  Aroya key can be checked against Aroya from the profile. Pulling the
  readings into graphs is not built for any vendor: it waits for one real key,
  because Aroya's schema does not describe what its chart call returns.
- **The room drawing** was redone at Kevin's request: benches on legs, a
  canopy sized to the day of flower, bar fixtures on rails, lights that follow
  the lighting schedule.
- **Calls with automatic notes** can be done with open-source parts: Jitsi
  Meet for the call, Whisper for the transcript, an open model on Jake's own
  computer for the notes. Not built. The recommendation is to start with
  "upload a recording, get a transcript and a draft".
- **The document for Jake.** "Open items for Jake: MI-Gas x Plantsman
  Management", a Claude Doc Kevin forwards. It lists every open item, what it
  needs from Jake, and the vendor pages behind the facts.

## The day's work reviewed and debugged (2026-11-16, night)

Kevin asked for everything built that day to be double checked.
RemoteGrowSolutions `2417427`, migas `517b138`.

How it was checked: two read-only review sessions read the full diffs with no
conclusions handed to them; a scripted browser walked a new, empty facility
through every platform screen and action; a second script drove the MI Gas
time-off controls against a local stand-in for storage, including a rehearsed
outage. Neither review found an authorization hole or a leak of a stored key.

**Fixed on the platform.**

- A later partial entry hid an earlier out-of-range flag. The rules now read
  each reading from the newest entry that has it, inside a week.
- A wrong number could not be removed from an entry. Clearing a box now
  removes it. A form opened before someone else saved only adds.
- A gap in a sensor export drew as zero, and a decimal comma was misread.
- An export with substrate and climate columns now lands under both headings.
- A schedule typed without lights on was dropped in silence. It is refused.
- Smaller ones: the assigned line rewriting past days, an old ticked item
  vanishing, duplicate entries from two saves at once, the key check writing
  back a stale copy, an oversized photo losing the typed entry.

**Fixed on the MI Gas site.**

- Adding a block could lose Jake's saved hours three ways: a stale copy on
  another server instance, a failed read taken for "nothing saved", and a
  cached copy of an overwritten file. All three are closed. Saves now write a
  new versioned file.
- The storage SDK retried a failing request for about seventeen minutes, so
  the booking and admin pages would hang in an outage. Capped at a few
  seconds.
- A booking submit now checks the blocks as stored at that moment.

**Still not verified.** Nothing was signed in to on the live sites. The
versioned saves were tested against a stand-in, not the real Blob store. No
real vendor API key has been tried. Card payment has never run against Stripe.

## Signed in to the live sites, then Jake's answers (2026-11-16, later)

RemoteGrowSolutions `cf723ed`, migas `a7ae562`.

**Signing in found one thing local testing could not.** With no database, each
server instance on Vercel kept its own copy of the demo, so a saved entry
often did not show on the page that came back. The demo said so on screen
from `7e96f2d`. By the time of the next deploy a Postgres database was
attached to the platform project: the consultant page showed 0 facilities and
the "Load the demo facility" button. Until that button is pressed the demo
sign-in printed on the MI Gas page does not work.

On the MI Gas admin, against the real Blob store: a test time-off block and a
test booking (MG-FE63D0) both worked and were removed. Mail, calendar feed,
notify address, reminder and card payment are still not connected.

**Jake answered five of the open questions.** His words are quoted in the
platform README under "His answers of 2026-11-16".

- Data is due daily. Both sites say so. A room is flagged the morning after a
  weekday with no entry.
- Three levels of service: Remote (one review and one call a week), Middle
  (three reviews, one call), Top (daily review, several calls). On the public
  page, set per facility by the consultant, shown to the grower. Called
  levels because "tier" already means facility size.
- Canopy video: built. Picked on the entry form for that room and day, sent
  from the phone straight to storage, played on the room page, ticks the
  canopy line. 300 MB limit. Off until a Blob store is attached to the
  platform project.
- TrolMaster: substrate sensors are not accepted as a room's only substrate
  sensors; environmental sensors are approved. His reason ("not reliable") is
  left off the public pages.
- Yes to recording calls. He did not pick between the two setups, so nothing
  is built.

**He sent an Aroya email and password as the "API login".** It was not used
and is not written down anywhere, here included. Aroya's API takes a key from
Aroya support, not a sign-in. Told through Kevin: ask Aroya support for a key,
and change that password since it traveled in a message.

**Open with Jake now.** Whether daily includes the weekend. Customer-facing
names for Middle and Top. What a level costs: pricing is still by facility
size only and no page ties a level to a price. Simpler or fuller for call
recording. The Aroya API key. Everything else on the earlier list stands.

**Found on the way, not fixed.** The co-management one-pager prints on two
pages, and did before this change (the live copy measured the same).

**Not verified.** The video upload against the real Blob store, or from a real
iPhone. A real vendor key. Card payment.

## Co-management hidden for the launch (2026-11-19)

migas `81bf57a`. Jake, by text: "lmk what i need to do on my end w the calendar
scheduling/payments to finalize the website and launch. Then we can just hide
the 3rd section (co-management and software) until its ready."

- `COMANAGEMENT_LIVE` in the MI Gas `lib/site.ts` is false. The home page has
  two ways in and ends after the call. No reachable page links to or mentions
  co-management or the platform. The two co-management pages still open by
  address, unlinked and noindex. Set the switch to true to bring it all back.
- Checked on the live site after deploy. On the Vercel project only the Blob
  token and the admin PIN are set: no mail, no notify address, no calendar
  feed, no reminder secret, no Stripe key.
- Kevin was given a list to forward: hours and time off on the admin page,
  the calendar's private iCal link, the mailbox that sends and the address
  bookings land at, invoice or card for launch, the domain, and the two draft
  FAQ answers and eight post links still owed.
