# Anchor Insurance

---

Independent insurance agency, Manchester, Michigan. **Prospect, not signed** as of
August 2026.

| | |
|---|---|
| Repo | `hershock48/anchor` |
| Pitch host | `anchor.glazedweb.com` |
| Proposal | `/` |
| Logo presentation | `/logo` |
| Demo | `/demo` |
| Client domain | Not bought. `lib/site.ts` assumes `anchorinsurancemi.com` and flags it |
| Price quoted | $3,500 build, $150 a month |

## The names, and the flip

**Anchor Insurance and Risk Management** is the licensed entity, and
**Anchor Insurance** is the customer-facing short form everything runs under.
**The tagline is "Coverage that gives back."**

That is the state since **August 28, 2026**, when the client decided at the
pitch meeting to move away from "Insurance for a Cause" as the name and fold
everything under Anchor. The old name auditioned as the tagline for a few
hours the same day and the client said no to that too; the site's structured
data keeps it as `alternateName` for continuity and it appears nowhere else.

## The logo is the client's own, and the brand derives from it

**She brought a real logo on August 28, 2026**: a navy anchor with a ring, a
knobbed stock, barbed flukes, and a gold wave flowing across it, the name in
Trajan-style serif capitals over a gold rule. It replaced the heart-ring mark
Glazed drew before the logo existed (retired, in the anchor repo's git history).

What derives from it, all measured, all in the repo's README:

- **The mark** is her logo redrawn as clean vectors in `components/Logo.tsx`,
  two cuts, water always drawn in front of the shank.
- **The palette** is navy and gold now, not navy and red. Gold is a fill that
  cannot carry white text and fails as text on light grounds, so it has four
  tokens and gold surfaces always carry navy lettering. Buttons are navy.
- **The wordmark face is Cinzel**, lockup and footer only, never headings.
- **The water is the motion**, per the client, explicitly: the hero's ribbons
  flow on looping periodic paths, the anchor rocks, the header plays a
  one-shot drop-then-flow entrance. Reduced motion gets the still, complete
  mark.

## The people

The owner is a woman; **we do not have her name.** There is a second person named
**Amanda** whose role is unconfirmed. Both are visible placeholders on the site
and in the logo page. Do not guess either.

## The giving program, and the shape the client chose

**Since August 28, 2026: no set percentage, no ledger, no goal bar, no vote.**
The site says a percentage of what we earn goes back, without committing to
the number, and the effort goes into content: every supported cause gets a
write-up on `/giving/causes` (who they are, why we picked them, what came of
it), with no amounts anywhere. `giving.stories` in `lib/site.ts` holds them.
The receipts suite this build originally shipped is in the repo's git history
before that date.

Michigan DIFS publishes six conditions on a producer donating commission. They
still apply, because the money is still commission and the giving is still
advertised. Three matter here:

1. **Offered uniformly, not tied to specific transactions.** The site never says
   "your policy bought X."
2. **The insured must not control which organization receives it.** The agency
   picks the causes itself, and there is no choose-your-charity control on the
   quote form. **Do not add one**, however good an idea it looks.
3. **The recipient must not be a client of the producer.** In the footer only.
   It was on the homepage and the giving page too and Kevin pulled it: in the
   body of a page it explains a licensing constraint to a customer who never
   asked.

There is also a **Google review ask** on the homepage and contact page, added
the same day at the client's request. It is gated on
`site.social.googleReview`, the direct write-a-review URL, which does not
exist until the Google Business Profile does.

Her attorney or E&O carrier signs the program off. DIFS closes its own FAQ
recommending counsel. **We do not give the legal opinion**, we hand over a written
description of the mechanic so that conversation is short.

## Permission

**No photo or logo permission on file.** There are no photographs on the site at
all and no stock, on purpose. Carrier logos are absent for the same reason:
`site.carriers` is an empty array and the homepage says the list is coming rather
than showing marks the agency may not be entitled to display. Several carriers
restrict use of their mark and a few require marketing review before anything
publishes. **Ask before adding any.**

## Voice

Warm, plain, and willing to say the unflattering thing. The brand rests on
specificity: real causes with real write-ups, and honesty about being new
where there is nothing to show yet. Two lines that set the register:

- "We are new, and this page is honest about it."
- "We will tell you if we cannot beat what you have."

The about page is the one that cannot be written without her. It needs a recorded
hour, in her words. **Inventing it would be the most damaging thing available on
this site.**

## Retired

**The heart-ring anchor mark and the navy-and-red palette.** Both were drawn
before the client produced her real logo on August 28, 2026, and both retired
the same day the logo arrived. The heart's ring and "Cause Red" have no basis
in her actual brand. In the anchor repo's git history before commit 20d874b.

**"Insurance for a Cause" as the customer-facing name.** The original DBA and
the name the whole first build wore, retired by the client on August 28, 2026.
Everything runs under Anchor Insurance now. The old name auditioned as the
tagline for a few hours the same day and was retired from that too; it
survives only as the schema `alternateName` and in history notes. The pitch
directory moved from `public/pitch/insuranceforacause/` to
`public/pitch/anchor/`, and this file was renamed from `insuranceforacause.md`.
Do not reintroduce the old name anywhere visible.

**The receipts suite: set percentage, ledger, goal bar, public vote.** The
build's original differentiator, retired by the client the same day. She wants
the softer "we give a percentage back" with content about the donations
instead of published numbers. The proposal was softened to match: the argument
is now "show the giving with real write-ups," not "publish the receipts." The
research that produced the original shape (96% of agencies donate, almost none
show it) still stands and still drives the content angle. **Do not re-argue
the ledger with her unless she reopens it.**

**"Marshall, Michigan," then "Grass Lake."** The town was wrong twice. The first
build said Marshall throughout, in page titles, the hero, the structured data,
the rendered card image and four local guides, because that is Kevin's town and
nobody asked. The correction to Grass Lake was also wrong.

**They are in Manchester**: a city of about 2,000 on the River Raisin with M-52
through the middle, in **Washtenaw** county, roughly 70 miles east of Marshall.
It is a **city**, not a village. It was a village from 1867 and voted for
cityhood in November 2023, so plenty of copy still says village. Do not.

The first correction was expensive and the second was cheap, and the difference
is the whole lesson: `city`, `county` and `nearby` in `lib/site.ts` are now the
only places a town name is allowed to live, so the second fix was one edit plus
regenerating a card image.

**The towns a local guide may name are Chelsea, Saline, Clinton, Tecumseh and
Ann Arbor.** They are in `site.contact.nearby` so it is checkable instead of
remembered.

One piece of local content died with the first miss and stays dead: **the
BlueOval hook.** Ford's battery plant is a Marshall story and has nothing to do
with their book. **"An EF-3 fifteen miles away"** went the same way; the March 6
2026 tornadoes hit Branch, St Joseph, Cass and Calhoun counties, which is about
70 miles from Manchester. The storm guide keeps the event, because the strongest
Michigan tornado since 1977 is a statewide fact and the claims advice is
unchanged, but not the proximity.

**Worth raising with her:** the River Raisin runs through the middle of
Manchester. Flood and water backup on a river town is a genuinely local coverage
angle and we have not written it, because nobody has confirmed anything about
their flood book.

**"The giving program is the differentiator."** Researched and dropped. 96% of
independent agents already donate, only about 34% of Americans say a charitable
tie makes them more likely to buy, and personal auto is decided on price. The
giving is not what makes her different. **Publishing the number is.** Almost no
agency does, and the one that does has a first-year total of $1,940 and the most
convincing giving page in the category.

**"Let the giving pick a nonprofit niche."** Strategically sound and explicitly
rejected by Kevin: she is a paying client who is excited about her own model, and
the job is to make her version excellent rather than to redirect it. It survives
in the proposal as one short paragraph labelled as a thought for later, not as a
recommendation. **Do not reopen it unless she does.**

**A lifetime donation counter on the homepage.** Replaced by a single active goal.
A counter reading $0 is worse than no counter, and a "$X donated" placeholder is
how invented numbers reach real people.

## Traps carried in this repo's README

The no-JS quote form, the `beforeFiles` host split, the two mark cuts, the
three-token color system validated against both light grounds, and `Reveal`
re-arming on navigation. All written up there with the reasoning.

## Still unknown

Everything in the README's placeholder list. The big ones: her name, the giving
percentage, the carrier appointments, the license numbers, and whether there is a
walk-in office.
