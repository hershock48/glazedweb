# The proposal

For a prospect who has not signed. Three deliverables go out together: a real
deployed rebuild, a proposal page, and a host split that keeps them apart.

---

## The sample to lift

**`public/pitch/griffin-claw/index.html` in `hershock48/griffin-claw-rebuild`.**
One self-contained 44KB HTML file, no build step, so it can be hand-edited on a
phone if a call goes sideways.

Lift its stylesheet and its animated donut marks **verbatim**. Do not re-derive
them. Then strip what the new proposal does not use.

**The numbered steps glaze, and the glaze is lifted too.** The discs in the
process section come from `.step .num` in glazedweb's own `app/globals.css`: a
radial that puts the light at 32% 26%, two inset shadows, a blurred white
highlight on `::before`, and a skewed white gradient on `::after` that sweeps
across when the step arrives. The driver is the scroll handler in its
`app/page.jsx`, thresholds `[0.22, 0.38, 0.54, 0.7]` included, rewritten as
plain JS because a proposal page has no React.

Copying only the disc is the trap. It looks glazed sitting still and never
glazes, because the two pieces that make it work are the ones with no visible
effect on their own: **`position: relative`, which the pseudo-elements position
against, and `overflow: hidden`, which keeps the sweep inside the circle.**
Without them the highlight lands somewhere up the page and the sweep runs across
the card. Scroll-scrubbed, never autoplayed, and off under reduced motion.

**The price melts too.** The build number counts down from a market anchor as
the card reaches the reader, same 1100ms and cubic ease-out as the menu prices
on glazedweb, same idle/primed/counting machine so scrolling back up re-arms it.
One card instead of three, so the left-to-right stagger is the only thing
dropped.

Two rules on that, and the second one is not optional:

- **The anchor is a published figure with a link under it, not a number you
  liked.** Every other figure in a proposal carries a source, and an invented
  one in the price section is the one place a client will actually check.
  Insurance for a Cause anchors at $15,000 against $3,500, which is the top of
  a published range for an independent agent's site, with the range and what it
  buys said out loud underneath.
- **The rendered number is the real price.** `data-to` is what sits in the
  markup and the anchor is only in `data-from`. Write the anchor into the DOM
  at load and count down from it, and a reader with scripts blocked, or on
  reduced motion, is looking at a price you are not charging.

Also in that repo, for reference:

| Path | What it is |
|---|---|
| `public/pitch/griffin-claw/index.html` | The proposal page |
| `public/pitch/griffin-claw/og.jpg` | The proposal's own link card, 1200×630, 67KB |
| `public/og.jpg` | The demo's link card, the client's own |
| `public/proposal/Glazed-Proposal-Griffin-Claw.pdf` | The printable version |
| `public/assets/brand/` | Their logo, can shots and photography, used with permission |

---

## The six sections, in this order

This is the Griffin Claw structure, and the order is the argument. Each heading
below is the real one from the live file.

**1. "Do you own your website?"** The hook is a question, not a claim, and it is
chosen so the honest answer is *no*. It is the h1. Everything else in the
proposal is downstream of the discomfort in that one line.

**2. "What we found."** The audit. Specific, provable, linked. Not a list of
opinions about their design. Real findings from real audits have included an
events page whose Open Graph still advertised an event from three years earlier, a
homepage titled `CAC Home`, no `LocalBusiness` schema anywhere, and a homepage
loading 32 script tags and 33 stylesheets. **Every finding links to the page that
proves it.** Anything unprovable is named as unverified rather than dropped
silently.

**3. "The part that matters most."** The wedge. This is where the ownership
argument lands, and it is the section that wins or loses the job. Griffin Claw's
incumbent contract keeps code ownership with the vendor at $13,500 upfront plus
$350 a month. Ours does not. That contrast is the whole business.

**4. "What we would build."** Concrete pages and features, not adjectives. Point
at the live demo constantly; it exists so this section can be short.

**5. "What it costs."** The menu price if it is a menu job, a real number if it is
custom. Nothing hedged, nothing "starting from."

**6. "What happens next."** One action. Not three.

---

## What goes in and what stays out

**In:** their real logo, their real photography, their real copy where it is
already good, the audit findings with links, the demo URL, the price, the
ownership terms, one next step.

**Out:** stock photography. Anything about Glazed Web's process that the client
did not ask about. Adjectives doing the work a number should do. Any claim about
their current site that has not been verified in a browser this session. **Any
sentence that argues the competitor's side of a comparison we are making.**

That last one is worth a paragraph, because it does not feel like a mistake
while you are writing it. A price note on the Insurance for a Cause proposal
read: *"In fairness to them, theirs is a themed WordPress site rather than
twenty-one written pages and three tools, so the comparison flatters us on what
you get."* That is the other guy's defense, written by us, unprompted, inside
our own price. Kevin deleted it.

**A sourced figure needs no apology. It is already checkable, which is why it is
there.** If a comparison cannot be defended without a caveat, change the
comparison rather than annotate it. The full rule, and where the line sits
against the unflattering things we DO say, is under "Being straight" in
`glaze.md`.

---

## The host split

Proposal at the root of `<client>.glazedweb.com`, demo at `/demo`, and the
client's own domain serving the site at its root with **no proposal anywhere.**

Three host-scoped rewrites in `next.config.ts`, and **they must be in
`beforeFiles`**:

```ts
async rewrites() {
  const onPitchHost = [{ type: "host", value: "<client>.glazedweb.com" }];
  return {
    beforeFiles: [
      { source: "/", destination: "/pitch/<client>.html", has: onPitchHost },
      { source: "/demo", destination: "/", has: onPitchHost },
      { source: "/demo/:path*", destination: "/:path*", has: onPitchHost },
    ],
  };
}
```

A plain `rewrites()` array is `afterFiles`, which only runs once Next has failed
to find a page, and `app/page.tsx` already answers `/`, so the root rewrite
silently never fires.

Host scoping rather than `basePath: "/demo"`, because `basePath` is global to a
build and would bury the real site under `/demo` the day the domain goes live.

One acceptable wart: links are root-relative, so the `/demo` prefix drops off
after the first click. Nothing 404s.

**Every path on the pitch host sends `X-Robots-Tag: noindex, nofollow`.** The
`.vercel.app` host is the same duplicate-content risk and is indexable by default;
check it on every build.

**Delete the pitch file and the rewrites once the client signs or passes.**

---

## Before you send it

- [ ] Every audit finding links to the page that proves it, and unverifiable ones
      are labelled unverified.
- [ ] The demo is deployed and every route loads.
- [ ] Proposal card and demo card exist, are different files, and both render.
      See `link-cards.md`.
- [ ] The pitch host and the `.vercel.app` host are both `noindex`.
- [ ] The price is a number.
- [ ] Read it once as the owner, not as the builder. If a sentence is about us
      rather than about them, cut it.
- [ ] No sentence anywhere argues the other side of a comparison we are making.
      Search it for "in fairness", "to be fair", "admittedly", "of course" and
      "that said" and justify every hit or cut it.
