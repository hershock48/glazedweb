# Ruin the Party

**Repo** `ruintheparty` · **Pitch** ruintheparty.glazedweb.com (proposal at the
root, the build at `/demo`) · **Their domain** ruintheparty.com (held;
contents unverified from the sandbox)

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

Who the person behind it is, their title, the legal entity and the town are
**not on file**. The brief is unsigned. See Open.

## Terms

**$4,500 build plus $150 a month, Claude's recommendation, awaiting Kevin's
ruling** (2026-10-01). A Custom Order: nine pages plus a merchandise store on
the client's own Stripe. Reasoning: the Griffin Claw and Dark Horse shape is
$4,500 + $195 for restaurant builds with workrooms; this has a store but no
workroom and no feed, so the lower monthly. The proposal anchors against a
published 2026 range of $8,000 to $25,000 for a full-service agency nonprofit
site (vincecomfort.com, linked in the letter). The two numbers live in
`lib/customOrders.js` and in the proposal HTML; change both in one commit.

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

**The store is built and switched off** until `STRIPE_SECRET_KEY` is set.
Prices are PLACEHOLDER and the shop page says they are samples. Stripe
Checkout hosted, raw fetch, no SDK. Fulfillment (own stock vs print on
demand) is an agreement term, undecided.

**Mail is SMTP (nodemailer)**, not Resend, per the don't-rent rule. Until
they have a mailbox the sending account can be a glazedweb.com one;
reply-to is the visitor either way.

**The studio credit reads "Baked by"**, not the default "Double Dipped by":
a donut pun under a page about consent is the wrong reading of a joke with
two readings. Kevin's call per build (standards.md); confirm.

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

- The person, their title, the registered entity and the town. Blocks the
  agreement. The proposal is addressed to the brand for this reason.
- The price. Kevin's ruling.
- What ruintheparty.com serves today. The sandbox could not open it; the
  letter says only that the name resolves. Kevin opens it before sending.
- The TikTok tag view count (about 253,000) and the nature of the videos came
  from the tag page as a search index surfaced it on 2026-10-01, not from
  the page itself. Kevin opens it before sending.
- Every number on the resources page was read by search listing from each
  organization's own site; re-check each in a browser before launch.
- The second opinion (`second.mjs` judge and prose) was not run on the
  letter; the sandbox has no Codex sign-in.
