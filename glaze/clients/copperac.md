# Copper Athletic Club

**Repo** `copperac` · **Live** copperac.com · **Demo** copperac.glazedweb.com/demo

## What they are

Sports bar in downtown Marshall, Michigan. Built on the bones of the beloved
Copper Bar and, in their own words, inspired by the Lindell A.C. in Detroit. Every
wall is memorabilia, every screen is sports. Detroit-style loose burger, coneys,
wings, Sunday brunch nine to two, and a private room upstairs called the Copper
Reserve seating 72 with its own bar and bartender, four TVs and the NFL Sunday
Ticket, at $50 an hour.

## Decisions on file

**Keep their brand, fix the execution.** Full Next.js rebuild, same play as Super
Duper. The palette, logo and photography are theirs and stay.

**The hero leads with a Bobby Layne quote**, Kevin's call, August 2026:

> "When Bobby said 'block,' you blocked. And when Bobby said 'drink,' you drank."
> Yale Lary, on playing with Bobby Layne

Yale Lary was a Lions safety and Layne's team-mate on the 1952, 1953 and 1957
championship sides. Verified against a published account before it went near the
site. The newspaper setting runs *"When Bobby said, 'Block,' you blocked," Lary
said. "And when Bobby said, 'Drink,' you drank."* The only differences are the
comma after "said" and the capitals, which come from the sentence being split
around an attribution the site does not print.

It is marked up as a `blockquote` inside a `figure`, **not** as the h1, because a
quotation as the page's main heading tells a screen reader and a search engine
that a 1950s locker room anecdote is what the page is about. The h1 underneath
does the real job: "A Detroit sports bar in downtown Marshall, Michigan."

**Do not connect Layne to the Lindell A.C.** It is the obvious move and it is
wrong. The bar took the "A.C." name in 1963, five years after Layne was traded,
and he is not among the regulars its histories name, a list that runs Mantle, Martin,
Karras, Hornung, Kaline. The quote earns its place as Detroit football, not as bar
lore.

**Screen policy, confirmed by the owner August 2026:** both, depending on the
night. Several games up on an ordinary night and staff will put a customer's game
on; when Detroit has a marquee game it takes every screen in the room. The site
deliberately says neither number and instead says "every screen dedicated to
sports," which is the claim that is true on every night of the year.

**The news ticker runs a little faster than the score ticker**, and pulls current
items from feeds rather than showing stale ones.

**The board pulls live Detroit scores**, which is the thing their WordPress site
cannot do. The homepage revalidates every 15 minutes rather than being frozen at
build time.

## Permissions

Logo and photos, granted.

## Palette and type

From `app/globals.css`. Oswald for display, Inter for body, both self-hosted via
`next/font/google`.

| Token | Hex |
|---|---|
| copper / light / dark | `#b86d2a` / `#d18a48` / `#8f5219` |
| ink / soft / line | `#0d0d0d` / `#191919` / `#2a2a2a` |
| cream / dim | `#faf7f2` / `#e8e2d8` |

Note for the studio credit: the chocolate mark under a `#191919` footer measures
**1.00**. Run `glaze/scripts/plate.mjs` and use what it prints.

Credit reads **"Double Dipped by"**.

## Retired

- **"7 TVs. 0 treadmills."** The owner does not like it. Retired outright rather
  than relocated, from the hero h1 and from the portfolio card on glazedweb.com,
  which kept publishing it for a while after the site itself had dropped it. Do
  not bring it back in any form.
- **The eyebrow "Sports bar · Downtown Marshall, Michigan."** It existed only to
  smuggle search terms in above an h1 that was a joke. With a real h1 it was
  redundant.
- **"Est. 2013 · 14 screens · 0 treadmills."** Both numbers unverified, and the
  year probably wrong: their own Facebook avatar reads "est. 2018" and nothing on
  copperac.com states a founding year.
- **`tvCountMain` and `tvCountTotal`** as constants. Unverifiable counts with no
  remaining consumer. `tvCountReserve` stays because four pages quote it and the
  private room is a countable, askable thing.

## Open

- The enquiry form's destination mailbox has never been confirmed to exist. It is
  a placeholder and it is both the mailto fallback target and the default inbox.
- No founding year has been established. Ask, do not infer.
