# Ruin the Party

**Repo** `ruintheparty` · **Pitch** ruintheparty.glazedweb.com (proposal at the
root, the build at `/demo`) · **Live** ruintheparty.com since 2026-10-03
(GoDaddy DNS pointed at Vercel; the GoDaddy Website Builder that held the
domain was detached first)

## What they are

A movement, not a local business. The client reached out in October 2026
with a brief: talk directly to young men about consent and about what to do
when another man crosses the line, under one phrase, **Ruin the Party**, and
the hashtag **#RuinTheParty**. Three jobs for the site in their order:
educate, empower, spread (merchandise). Audience: teenagers, college
students, athletes, coaches, fathers, teams, schools. Their own lines: "Good
men don't stay silent." "'No' is a complete sentence. It doesn't matter when
no is said." The message is not that men are bad; it is that good men have a
responsibility to act.

**Jonathan Cruz**, Bend, Oregon, jon@cruzconsultants.com. The entity is
**HIIT Logic LLC** (his gym, HIIT Logic, Redmond), trading as Ruin the Party;
the Stripe account for the store is a separate account under that LLC's
login, named Ruin the Party, bank shared with the gym. He does not want his
email on the site; the forms deliver to it server-side.

## Terms

**$4,500 build plus $150 a month, accepted by the client 2026-10-03**, the
build fee in **three payments of $1,500**: the day the site goes live,
thirty days later, thirty days after that; nothing before launch. The
**monthly starts at launch** (Kevin's call), not when the build is paid off.
He asked what the $150 buys; the answer that landed was two hours a month of
a person who knows the site, the order emails, and the resources numbers
checked monthly. A Custom Order: nine pages plus a merchandise store on the
client's own Stripe. The numbers and the schedule live in `lib/customOrders.js`
(`installments: 3`, `schedule`, `monthlyFromLaunch`) and in the proposal
HTML; change both in one commit.

Agreement: `glazedweb.com/agreement/ruintheparty`. Build page:
`glazedweb.com/build/ruintheparty`. Edit allowance 2 hours a month.

## Decisions on file

**The mark is their file, keyed, never redrawn.** They sent a 1254px brush
logo on black (`public/brand/source-logo.webp` in the repo). Every painted
pixel is one of two inks, teal `#00DFDF` and white; the site's teal is that
measurement. The hash is cut from it for the icons and for the hero's
two-piece arrival. The "#R" roundel and the boxed "RUIN THE PARTY" on their
boards were not sent as files and are not on the site.

**Teal is never text on a light ground.** 1.66 on white. The light bands use
`#0E6E6E` (6.04 on white). Table at the top of `globals.css`.

**Barlow Condensed (800) and Barlow (400, 600).** One family, two widths,
three files. The boards set every headline in condensed heavy caps.

**Be the Guy was built first and biggest**, because the brief said it could
become the most important section and it was right. Eight scenarios, each
with say / do / when to get authority / after. Green Dot's direct, delegate,
distract is credited by name on the page; the words are ours.

**Statistics appear once**, on What it means, with the RAINN campus link
(2019 AAU survey: 13% of undergraduates, 1 in 4 undergraduate women, 1 in 14
undergraduate men). The brief says not to build a seminar.

**The refrain repeats on purpose, on the home page only.** "Ruin the party."
after each setup is the client's own device.

**No photography, and the design does not wait for any.** The boards' photos
are generated concept art and are not on the site.

**The store is open since 2026-10-03**, selling the first run as pre-orders
(ships in 4 to 6 weeks; "you are in at the start", no campaign trappings, his
wording). Prices are his (he kept the first cut's numbers). A portion of
every sale goes to local youth resources; the percentage is not named yet.
Stripe Checkout hosted, raw fetch, no SDK, on a restricted key (Checkout
Sessions, Prices, Products: write). Fulfillment for now: a Stripe webhook
emails him each order and he places it with his printer by hand. He uses
BrandLab (Redmond, OR; All Access, hosted stores on checkoutstores.com,
likely Bespoke Labs' white label) for his gym's merch; a seamless hand-off
is a later quote, and beanumber's Printful line is the pattern.

**Mail is SMTP (nodemailer)**, not Resend, per the don't-rent rule. Sends
from kevin@glazedweb.com with a Google app password, display name "Ruin the
Party Website"; reply-to is the visitor. There is no mailbox at the domain
and no address shown on the site; CONTACT_TO is his personal address.

**The studio credit reads "Double Dipped by"**, the default; Kevin overruled
the first cut's "Baked by" on 2026-10-02. The plate is black with teal
drips (a `--gw-drip` override; the shared plate's `--gw-above` keeps its
meaning).

**Organization schema, not LocalBusiness.** It is a movement.

**The letter is a reply, not a pitch.** Kevin, 2026-10-01: "sell him less,
he came to us." The first draft opened on "Does #RuinTheParty mean anything
yet? Not yet." and carried the cold-prospect machinery (audit framing, the
struck market anchor, the vendor questions). All of it came out the same day;
the h1 is now "You wrote the brief. We built the site. Open it." The rule is
in `glaze/proposal.md` under "When the client came to us".

**Vercel.** Project `ruintheparty` on the GlazedWeb team, framework set to
Next.js by hand on 2026-10-01 after the first deploy served Vercel's own
NOT_FOUND on every route with the framework unset (the glaze.md failure-log
case). Domain ruintheparty.glazedweb.com attached; vercel.app hosts sit
behind SSO, the custom domain does not.

## Permissions

The logo file and the brief: sent by the client with the request to build
the proposal and demo, October 2026. Nothing in writing beyond that. No
photographs on file.

## Palette and type

Lifted from `src/app/globals.css` in the repo: black `#000000`, coal
`#121414`, chalk `#E6E6E6` (body on dark, 16.83), ash `#A6ADAD` (secondary
on dark, 9.20), paper `#F2F2F0`, ink `#0B0B0B`, smoke `#5C6666` (secondary
on light, 5.92), teal `#00DFDF` (the mark's ink), teal-ink `#0E6E6E` (links
on light). Barlow Condensed 800 for display, Barlow 400 and 600 for body.

## Retired

Nothing yet.

## Open

- The agreement is not yet accepted on the page (2026-10-03); the terms on
  it now match what he agreed by text. First $1,500 due on launch day.
- The percentage of sales to local youth resources, and whether to name them.
- Who is behind it, as he wants it said on the site, or left unsaid.
- The Green Dot page at alteristic.org moved; both links point at the root.
- The CDC 2023 YRBS high school figure (1 in 9) on What it means was read
  from the search index; confirm in a browser.
- The TikTok tag view count (about 253,000) and the nature of the videos came
  from the tag page as a search index surfaced it on 2026-10-01, not from
  the page itself. Kevin opens it before sending.
- Every number on the resources page was read by search listing from each
  organization's own site; re-check each in a browser before launch.
- The second opinion (`second.mjs` judge and prose) was not run on the
  letter; the sandbox has no Codex sign-in.
