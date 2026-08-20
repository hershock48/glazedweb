# Link cards: what shows up when you paste a URL

**This is the file for "what photo appears when I text somebody the demo" and
"what does the proposal link look like when I send it."** They are two different
cards with two different jobs, and getting them backwards is the most common
mistake.

Every rule below cost something to learn. The ones with numbers in them were
measured.

---

## The two cards, and which is which

A pitch host serves two things at once: the proposal at the root and a full copy
of the client's site at `/demo`. So it needs two cards.

| | The proposal card | The demo card |
|---|---|---|
| Where it is served from | `public/pitch/<client>/og.jpg` | `public/og.jpg` |
| Who it is for | The owner, deciding whether to read | Anyone the owner forwards the demo to |
| Whose brand it wears | **Glazed Web's argument, in their colours** | **Theirs, entirely** |
| Title | A question the owner cannot answer comfortably | What the business is |

The live precedent is Griffin Claw, and it is worth copying rather than
re-deriving. Its proposal card carries:

```html
<meta property="og:site_name" content="Glazed Web">
<meta property="og:title"     content="Do you own your website?">
<meta property="og:description"
      content="A website proposal for Griffin Claw Brewing Company, where every claim links to the proof.">
<meta property="og:image"     content="https://griffinclaw.glazedweb.com/pitch/griffin-claw/og.jpg">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt"  content="Do you own your website? A proposal from Glazed Web.">
```

Note what the title is not. It is not "Website proposal for Griffin Claw" and it
is not "Glazed Web: hand-built websites." It is the one question whose honest
answer, for that prospect, is *no*. The card has to earn a tap from somebody who
did not ask for a proposal.

The demo card is the client's own, because the demo is a full copy of the client's
site and should look like it in every surface, including this one.

---

## The geometry

**1200 × 630, always.** Both live cards are exactly that.

**Everything that must be read has to sit inside the centre 630 × 630 band, which
is x 285 to x 915.** Newer iOS crops link previews toward square, so the outer
285px on each side can simply vanish. A card that reads perfectly in a browser
preview can lose its own headline in Messages.

Build it, then crop it to 630 wide from the centre and look at that crop. If the
crop still says what the card is for, it works everywhere.

**Under 1MB.** The live cards are 67KB and 73KB, so this is not a tight
constraint, but it is a real one: for iMessage the *sender's* phone downloads the
image before the bubble renders. A 3MB card means the preview lags behind the
message. JPEG at quality 82 to 88 hits well under the limit at this size.

**No text under about 28px at 1200 wide.** It is being viewed at a third of that
in a message list.

---

## The traps, all of which have bitten

**`og:image` must be an absolute URL on an origin that actually serves it.** Not
a path, not a `.vercel.app` host when the client's domain is live. Fetch the URL
and confirm a 200 with an image content type before believing it.

**Next.js does not deep-merge `openGraph`.** A page that defines its own
`openGraph` block **replaces the parent's wholesale**, including the image. A
single sub-page adding an `openGraph.title` silently drops the site's card for
that route. Either set the image on every page that overrides, or override
nothing but `title` and `description` at the root level where merging does work.

**`metadataBase` decides what relative URLs resolve to.** Point it at the
client's real domain. Pointing it at a `.vercel.app` host makes every canonical,
every sitemap entry and every OG url advertise a duplicate of the site as the
original, which is the one SEO fault that actively works against a client rather
than merely missing an opportunity.

**`robots.txt` with `Disallow: /` kills every link preview except Apple's.**
Facebook, LinkedIn, Slack and X all honour robots.txt, so pasting the URL into any
of them produces a bare row of text. iMessage is the exception, because Apple's
preview is fetched by the sending device rather than by a crawl, which is exactly
why a card can look right in Messages and be empty everywhere else.

**To keep a build out of the index, use `noindex`, not `Disallow`.** They are
different switches. robots.txt governs *fetching*; a crawler told not to fetch can
never see the noindex, so a URL discovered from a link elsewhere can still be
listed, with no title and no snippet. Allow crawling and send
`X-Robots-Tag: noindex` plus `robots: { index: false }` in the metadata.

**Every path on a pitch host sends `noindex, nofollow`.** The demo is a full copy
of the client's site and must never compete with them for their own name.

**Caches are sticky.** Facebook and LinkedIn keep a card for days. Change the
image filename or add a query string rather than expecting a re-fetch, and use
each platform's debugger to force one when it matters.

---

## One host, three documents, two icons

A pitch host serves the proposal at `/`, the logo page at `/logo` and the whole
client site at `/demo`. Three documents, one origin, and a favicon is cached per
origin, which is what makes this look harder than it is.

**Glazed's documents carry Glazed's mark. The client's site carries theirs.**
The proposal and the logo presentation are ours. The demo is theirs, and the tab
above their own site should say their name, not ours.

The failure people try to prevent here is the donut sticking in the tab while
the client looks at their site. It is real, and the cause is not two icons on
one origin. It is a document that declares no icon at all and lets the browser
fall back to `/favicon.ico` at the root, which on a pitch host is whatever the
demo app happens to serve. **Declare explicitly on both sides and neither falls
back, so neither can win the other's tab.** On a Next demo the file conventions
do it for you: `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` all emit
real `<link>` tags. On a static pitch page you write them yourself.

Two details that are easy to get wrong on the static side:

- **SVG first, `.ico` after it.** Safari does not take an SVG through
  `rel=icon`, so a page with only the SVG shows Safari nothing.
- **Absolute paths.** `/` and `/logo` are rewrites. A relative href resolves
  against the pretty URL, not against the file it was written in.

**Lift the icon, do not redraw it.** Glazed's own `public/favicon.svg`,
`favicon.ico` and `apple-touch-icon.png` are the assets. Copy them next to the
pitch pages.

---

## Making the image

Render it from a real page rather than assembling it in an image editor, so the
card uses the site's own type, palette and artwork and cannot drift from them.

The pattern that works: an ordinary route in the project, `app/og-card/page.tsx`,
sized 1200 × 630 and marked `force-static`, screenshotted at 1× and written to
`public/og.jpg`. It costs one throwaway route and the card is then generated from
the same tokens as the site.

Two things to check on the render before shipping it:

**Contrast, computed not eyeballed.** A headline over artwork is the single most
common place a card fails. Measure the text against the actual pixels behind it,
at the darkest and lightest points of the region it covers.

**Nothing important behind a scrim that only exists on one background.** A
gradient that reads as a scrim on desktop can turn the headline into grey mush
in a message bubble where the card is a third the size.

---

## The checklist

- [ ] 1200 × 630, under 1MB.
- [ ] The centre 630 × 630 crop still carries the headline and the point.
- [ ] `og:image` is absolute, on the right origin, and returns 200 with an image type.
- [ ] `og:image:width`, `:height` and `:alt` all present.
- [ ] `metadataBase` is the client's real domain.
- [ ] No sub-page defines a partial `openGraph` that drops the image.
- [ ] `robots.txt` allows crawling; `noindex` handled by header and metadata.
- [ ] Pasted into Messages **and** one non-Apple surface, and looked at.
- [ ] For a pitch host: proposal card and demo card are different files, and the
      demo card is the client's.
- [ ] For a pitch host: **every** document declares an icon explicitly, so
      nothing falls back to the origin root. Proposal and logo page declare
      Glazed's; the demo declares the client's.
