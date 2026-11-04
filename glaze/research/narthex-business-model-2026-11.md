# The business model, researched (2026-11-04)

Three research passes on 2026-11-04: how the vendors to Catholic parishes
make money; how dioceses and parishes pay for technology; church-SaaS unit
economics. Sources are in the three reports summarised here; the numbers
below are the ones the model stands on.

## What the market does

| Pattern | Who | Shape |
|---|---|---|
| Cheap door, percentage of giving | eCatholic (1% + Fiserv), Vanco, Tithe.ly, Subsplash, Pushpay | Processing is the real revenue line; Pushpay's revenue was 68% processing at ~$14k a customer a year |
| Sponsorship-funded media | LPi (4,000+ parishes, 63,000 advertisers), Diocesan.com, Catholic Online | Parish pays nothing; local businesses pay; the vendor cross-sells giving and sites |
| Diocesan enterprise license | Detroit/eCatholic $50 a site billed by the archdiocese; Pittsburgh and Paterson paid in full; San Francisco subsidises Flocknote; ParishSOFT master contracts at ~$100 to $200 a parish | One contract, central billing, churn near zero |
| PE roll-ups | Ministry Brands, Pushpay, eCatholic, LPi | Subscription plus processing, gross margin near 70% |
| Church-sponsored nonprofits | OSV, FAITH Catholic ($8M, funded by diocesan contracts and appeals) | Funded as a program, not sold as SaaS |

## What the money looks like in our two dioceses

| | Kalamazoo | Lansing |
|---|---|---|
| Parishes | 59 | 73 |
| Offertory, implied from the appeal formula | mean ~$313k, median ~$273k; 47% under $250k; two above $1M | not computed |
| Annual appeal | goal $3.48M, pledged $4.01M, 7,537 pledge cards, overage returned to parishes ($387k in 2024) | goal $5.9M, 15,050 donors |
| Chancery and communications | not published; comms is a named appeal purpose | $836k expense FY24; "Communications and Technology" a named DSA item |
| Online share of offertory | 15% to 30% (parish anecdotes); recurring = 42% of digital dollars (Ministry Brands 2025) | same |
| Who signs a sub-$50k subscription | chancellor or CFO as ordinary administration; comms director sponsors; 6 to 12 months with a pilot | same |

## Unit economics

- COGS per parish per month: $4 to $6 without video; $22 to $27 with a
  weekly livestream kept twelve weeks.
- Support is the cost. One loaded support FTE ≈ $90k a year ≈ $53 an
  hour. At a conventional 1.35 hours a parish a month, support alone is
  ~$70 a parish, more than the Detroit price. The platform's only lever
  here is hours per parish: edits done by the studio with AI assistance,
  self-serve for the parishes that want it, and the write-once engine that
  removes the retyping that generates tickets. Plan on 0.5 to 0.8 hours.
- A single 60-parish diocese at $99 is $71k a year: less than one FTE.
  Two dioceses at ~$75 a parish plus giving fund one hire with margin.
- Donors cover the fee 55% to 60% of the time when offered, ~70% when
  pre-checked. Average online gift $157; a third under $50.
- A 1% platform fee on a median Kalamazoo parish's online giving (say
  $60k a year) is about $600 a year, ~$50 a month: the same as a site fee.

## The model

1. **A diocesan program license, billed to the diocese, every parish
   included, no parish sees a bill.** Sized against the appeal and under
   the bishop-signature threshold so a chancellor can sign: Kalamazoo
   ~$3,990 a month ($47,880 a year, 1.2% of the appeal, $68 a parish);
   Lansing ~$4,990 a month. Twelve-month first term, then month to month.
   Includes every parish site, the diocese layer, the edits, the feeds,
   ownership and export. The three-rung ladder stays: layer free for
   ninety days with nothing signed, three parishes built free, then the
   license.
2. **Giving at 1%, capped at $5 a gift, donor-covered by default, on the
   parish's own Stripe nonprofit account.** No monthly fee for the giving
   module. The appeal on the same rails on the diocese's own account.
   This is the growth line and it grows with online giving, which the
   platform exists to push.
3. **Parish-paid add-ons** at prices that clear their cost with margin:
   hosted video $89 a month, office panel $29, texting at cost plus a
   margin, newsletter sending $19. Each one a parish chooses.
4. **A lone parish outside a license** pays the published build price
   and $99 a month, as today. That path stays open as the fallback if a
   diocese says no, and as the proof that builds pull.
5. **Later lines, not now:** sponsorships on the finder and the digest
   (funeral homes, Catholic schools, cemeteries) under the diocese's
   control, which is LPi's whole business; the Annual Appeal processed on
   the platform; records migration as a paid service.

## Why this and not the $99 flat

- It matches how the money already flows (assessments in, services out,
  Detroit's chancery invoice) and removes 59 separate approvals.
- It removes the $50-a-site comparison entirely, because no parish sees a
  per-site number.
- It sits inside the appeal's own stated purpose and under the signature
  threshold, which is what makes a diocese sign.
- Base revenue per diocese is lower than the $99 letter asked for and
  far more certain; giving and add-ons carry the upside.
- Two dioceses on it fund the first hire, which is the promise about
  support made good.
