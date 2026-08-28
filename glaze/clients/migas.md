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
model"** — likely the model's name, not confirmed as the company's; two web
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
"random calls" — visitors who will not finish an intake ("some might know and
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

- **Four env settings before anyone real books**, all visible as a status panel
  on `/admin`: SMTP, `MIGAS_NOTIFY_TO`, `MIGAS_ADMIN_PIN`, a Blob store on the
  Vercel project, and `MIGAS_BUSY_ICS_URL`. Kevin sets them in the dashboard.
  Then book a real test call end to end (inbox + phone calendar + slot gone).
- **The co-management project minimum.** He named a minimum, no figure. The page
  says one exists without a number until he sets it.
- **The 30/90-minute prices** are pro-rata arithmetic on his $250/hour, flagged
  on the page. Confirm, or drop the half-hour session.
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
  First ask: what settles his existing Squarespace store sales today?
- **When the pitch host converts**: he is in, so the day the deposit lands the
  rewrites() block and public/pitch/migas come out, noindex comes off with the
  domain cutover per the README's Going live section.
- Whether to gate the live URL, the h1 weight, the price ticker placement, and
  where the `Totem` mark goes. All open, all Kevin's call.
