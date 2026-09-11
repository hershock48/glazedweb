# Mike's Place

**Repo** `hershock48/mikes` (local folder `mikesplace`; renamed from `mikesplace` 2026-09-11 at Kevin's request) · **Prospect**, not signed, not yet shown · Scouted 2026-09-11 ·
**Pitch host** mikesplace.glazedweb.com (attached by Kevin 2026-09-11; letter at /, demo at /demo, verified live) · **Live** nothing: no
website exists.

## What they are

Family-friendly bar and grill at 116 W Michigan Ave, downtown Marshall, MI 49068,
four doors from the studio. (269) 789-0775, mikesplace116@yahoo.com. Open seven
days to 2 AM (Yelp and Tripadvisor: 11 AM to 2 AM Mon to Sat, noon to 2 AM Sun);
kitchen hours unpublished anywhere. Burgers (jalapeño popper, Hawaiian bacon,
mushroom swiss), Reuben, patty melt, fried pickles, pool table, Keno, front and
rear entrance, parking behind. Chamber member, accepts Marshall Bucks. Owner
unnamed in anything public; a 2016 review mentions "the owner and his parents."

## Web presence, audited 2026-09-11 (all in a real browser this session)

- **No website.** Facebook only: Page · Bar & Grill, 2.7K followers, 96% recommend
  from 375, intro lists Dine-in · Outdoor seating · In-store pickup, price $. Signed
  out you get the intro card, the Labor Day post (Sept 7: "reopen Tuesday with
  normal business hours") and a login wall.
- **Tripadvisor** (claimed): 4.4 from 47, #5 of 31 in Marshall; its Website button
  goes to `facebook.com/Mikes-Place-524381794256019`. **Bing's** Website button
  goes to the same page.
- **Yelp: UNCLAIMED.** 3.8 from 17, 16 photos. Hours as above. "Takes
  reservations, accepts credit cards, outdoor seating."
- **Menus With Price** publishes ~30 priced items (Soup $3.95, Wings $6.95, Nachos
  $6.95, half-pound shrimp $9.95), undated, "4.4 based on 108 votes", and a block
  reading **"Official Website: mikesplace.com"**. `mikesplace.com` 307s to
  `forsale.godaddy.com/forsale/mikesplace.com`. A squatter's page.
- **Delivery apps:** searched, not found on DoorDash, Uber Eats or Grubhub. Not
  verified inside the apps themselves.
- **Google:** NOT checked. Google served a CAPTCHA to the browser this session. The
  letter says so and makes no claim about the Google listing.
- **Domains available 2026-09-11** (Vercel registrar): mikesplacemarshall.com,
  mikesplace116.com, mikesplacemi.com, mikesplacebarandgrill.com, all $11.25/yr.

## Decisions on file

**Hook:** "Do you own your website? Five other companies do." The five: Meta,
Menus With Price, Yelp, Tripadvisor, GoDaddy (the squatter). Same structure as
Dark Horse; the letter's stylesheet and marks are lifted from that file.

**Price: the published Baker's Dozen, $2,000 + $150/mo.** Melts from Untappd's
mid-range top ($1,000 to $5,000 upfront, $50 to $200 a month, their website cost
guide, linked). The letter says it is the menu price, not a number for this letter.

**The order fee is one sentence** in the price section, matter-of-fact, no
defense: flat 99¢ at checkout, customer-paid, named before they pay, no percentage
of anything. Ordering terms are Part 3 on the registry row, rail-neutral ("your
processor") until someone asks which register they ring. Stripe is the default;
Square only if we place the POS.

**Nothing in the letter names a person at the bar.** Owner unknown; do not guess.

**Launch page and agreement** per `../launch-page.md`: registry row `mikesplace` in
`lib/customOrders.js`; Launch in the four places; agreement link plain under the
closing button. Build page glazedweb.com/build/mikesplace, agreement
glazedweb.com/agreement/mikesplace. Nine needs, seven steps, two freebies (claim
Yelp; chase the mikesplace.com listing once the site is live), no try-it list
until the demo and its kitchen screen exist.

**The demo exists (built 2026-09-11), at `/demo` on the pitch host once attached.**
The repo is now a Next 16 app ported from copperac: home, menu, order ahead,
what's on, about, contact, `/kitchen` (PIN falls back to 0116, the street
number, a PLACEHOLDER), `/workroom` (what's on + menu editor; CLOSED until
`WORKROOM_PASSCODE` is set). The orderable board is generated from
`lib/menu.ts` with the workroom edits applied, so the workroom is the ONE price
editor; Copper's kitchen menu editor was removed on purpose. Every price is a
marked sample (`PRICES_ARE_PLACEHOLDERS`); dish names come from reviews. Hours
are Yelp/Tripadvisor until confirmed and `HOURS_NOTE` says so on the page. One
photograph: the Facebook avatar (the room), permission not yet asked. Audited
clean at four widths; perf inside budget; order, 86 and workroom flows walked
through the APIs.

**Still needed on Vercel before showing** (project `mikesplace`, prj_85fblONVG72tTBEWOLqskgaP1uwF, created 2026-09-11 from the repo): attach
`mikesplace.glazedweb.com`, set `ORDERING_DEMO_ALWAYS_OPEN=1` and
`WORKROOM_PASSCODE`, add a Neon `DATABASE_URL` (memory storage cannot show a
kitchen ticket across two devices). Add the try-it list to the registry row only
once those are set, per `../launch-page.md` section 6.

## Retired

Nothing yet.

## The improvement pass, 2026-09-11 (Kevin: "looks pretty standard")

What made it Mike's rather than a template: a **Tonight strip** under the hero
that reads the Detroit clock and lights the current part of the bar's own
five-part day (lunch after church to the bar till two), with a true static
sentence for no-JS; the pendant **lamps** in the one photograph warming up on
load, 240 ms apart, then still; **What's On as a letterboard** with a
Tonight/Tomorrow tag; **section chips** on the menu; reveal-on-scroll (the pjs
copy). Link cards recomposed inside the 630 px band. Verified with audit,
width, motion and perf harnesses; screenshots walked so reveals fire before
capture (a full-page capture without a walk shows blank sections and is a
harness fault, not a site fault). Env set by Kevin the same day: pitch host
attached, ordering window held open, workroom passcode set, Neon on. Try-it
list of five is on the build page.
