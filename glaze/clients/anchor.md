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
**"Insurance for a cause" is the tagline**, not a name.

That is the state since **August 28, 2026**, when the client decided at the
pitch meeting to move away from "Insurance for a Cause" as the name and fold
everything under Anchor. The old name became the tagline, replacing "Coverage
that gives back." The giving program is unchanged. The site's structured data
keeps "Insurance for a Cause" as `alternateName` for continuity.

The mark is an anchor with a heart for a rope ring, so it survived the rename
untouched: it was drawn for the licensed name in the first place.

## The people

The owner is a woman; **we do not have her name.** There is a second person named
**Amanda** whose role is unconfirmed. Both are visible placeholders on the site
and in the logo page. Do not guess either.

## The giving program, and the rule that shapes the build

Michigan DIFS publishes six conditions on a producer donating commission. Three
matter here:

1. **Offered uniformly, not tied to specific transactions.** The site never says
   "your policy bought X."
2. **The insured must not control which organization receives it.** This is why
   the cause is chosen by a **public vote open to anyone** and why there is no
   choose-your-charity control on the quote form. **Do not add one**, however
   good an idea it looks.
3. **The recipient must not be a client of the producer.** In the footer only.
   It was on the homepage and the giving page too and Kevin pulled it: in the
   body of a page it explains a licensing constraint to a customer who never
   asked.

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

Warm, plain, and willing to say the unflattering thing. The whole brand rests on
being checkable, so anything on this site that cannot be verified undercuts the
product. Two lines that set the register:

- "We are new, so this is honestly at zero."
- "We will tell you if we cannot beat what you have."

The about page is the one that cannot be written without her. It needs a recorded
hour, in her words. **Inventing it would be the most damaging thing available on
this site.**

## Retired

**"Insurance for a Cause" as the customer-facing name.** The original DBA and
the name the whole first build wore, retired by the client on August 28, 2026.
Everything runs under Anchor Insurance now and the old name survives only as
the tagline, the schema `alternateName`, and history notes. The pitch directory
moved from `public/pitch/insuranceforacause/` to `public/pitch/anchor/`, and
this file was renamed from `insuranceforacause.md`. Do not reintroduce the old
name as a name.

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
