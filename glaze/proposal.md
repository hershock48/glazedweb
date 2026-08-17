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
their current site that has not been verified in a browser this session.

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
