# Glazed Web brand assets

**Everything here is lifted from the code, not remembered.** If a value below
disagrees with `app/globals.css` or `components/Logo.jsx`, the code is right and
this file is stale. Fix it here.

The reason this file exists at all: the operating document can tell you to use
the real mark, and it does, but it cannot *contain* a hex or a path. A colour
described in prose gets approximated. A colour written as `#E84D8A` gets used.

---

## The mark

**It lives in `components/Logo.jsx` in this repo. Never redraw it.** That file is
390 lines and already contains everything, in four exports:

| Export | What it is | Use it for |
|---|---|---|
| `LogoDefs()` | The four gradients and the `#mark` / `#dripEdge` symbols | Mount once per page, hidden, before anything that references them |
| `Mark({width, height, hole})` | The static donut via `<use href="#mark">` | Header, footer, favicons, anywhere small |
| `AnimatedMark({width, height})` | The full drip: sagging glaze, a falling droplet, a shimmer | Hero only, one per page |
| `DripDivider({fill, bg})` | The drip edge that separates every band | Section boundaries |

It also carries **client** artwork: `BeANumberMark`, `ChismChicken`, `ChismEgg`,
`ChismEggs`. That is a smell worth naming rather than tidying blind: those are
other businesses' marks sitting in the studio's logo file, and they are there
because the work cards on the homepage animate them. Leave them, but do not add
to the pile without deciding where client artwork should live.

### Geometry, measured rather than declared

The mark declares `viewBox="0 0 200 250"` and **paints only x 48.00–151.75,
y 18.00–199.75.** So 48% of the declared width and 27% of the height is empty
margin. At a 26px render that is the difference between a 12.5px disc and a
19.1px one.

**For any small render, crop the viewBox to `46 16 110 186`.** No coordinate
moves; the artwork is identical, the matting is gone. This is why the footer
credit works at 26px. It was never too detailed for that size, it was matted.

`getBBox()` will not give you this. It ignores stroke width. Pixel-scan a large
render for the painted bounds.

### The hole is a hole

Express the disc and its hole as one path with `fill-rule="evenodd"`, not as an
opaque circle in the background colour. On glazedweb.com the cream circle is
correct because the cream *is* the page. In a client's near-black footer the same
fill reads as a pale disc floating in the middle of the donut.

Verify by pixel diff: zero interior pixels should differ from the backdrop.

### Gradients

Four, all in `LogoDefs`. If you namespace the ids, **rewrite both ends**:
`url(#x)` and `id="x"`. Catching one and not the other resolves every gradient to
nothing and renders invisible shapes.

| Id | Type | Stops |
|---|---|---|
| `pinkGrad` | radial, 40% 34%, r 75% | `#F887B2` → `#E84D8A` 55% → `#CE3672` |
| `lgGrad` | linear, y 92→215 | `#D9EDA0` → `#BFE07A` 55% → `#A3CE55` |
| `creepGrad` | linear, y 90→124 | `#E3F2B0` → `#C3E181` |
| `dgGrad` | linear, y 92→165 | `#5FA850` → `#43813A` |

### Raster copies

`public/brand/logo.svg`, `public/brand/logo-800.png`, plus `public/favicon.svg`,
`public/favicon.ico`, `public/apple-touch-icon.png`, `public/icon-192.png`,
`public/icon-512.png`, and the studio's own link card at `public/og.png`.

Use the SVG. The PNGs exist for surfaces that cannot take vector, such as the
`image` and `logo` fields in the site's JSON-LD.

---

## The palette

From `app/globals.css`. **Three of these have a measured contrast requirement
attached, and picking the wrong one of the three pinks reintroduces a fault that
took a full audit to find.**

| Token | Hex | What it is for |
|---|---|---|
| `--raspberry` | `#E84D8A` | The brand pink. Accents, borders, the h1 flourish, hovers, focus rings, list bullets. **Never as text on cream and never under white text.** |
| `--raspberry-deep` | `#CE3672` | Backgrounds that carry white text: buttons, badges, the CTA band. White on it is 4.78. |
| `--raspberry-ink` | `#C9356F` | Link text on a light ground. 4.63 on cream, 4.89 on the white cards. |
| `--slime` | `#BFE07A` | The glaze green. Dark grounds, the ticker, hover states in the footer. |
| `--slime-bright` | `#A9D65C` | Focus borders, card hover edges, the numbered step discs. |
| `--fern` | `#467C3D` | Small bold text on a light ground: kickers, flavours, step labels. 4.65. |
| `--chocolate` | `#2B1E16` | Body ink. |
| `--chocolate-2` | `#201712` | Dark sections and every footer. |
| `--cream` | `#FDF6EC` | The page. |
| `--cream-2` | `#FFFDF8` | Cards and raised panels. |
| `--taupe` | `#7F6D5B` | Secondary small text. 4.61 on cream. |

### Why there are three pinks, in one paragraph

`--raspberry` measures **3.34** as text on cream and **3.58** under white text.
Both fail the 4.5 that normal-weight text requires. `--raspberry-deep` fixes the
white-on-pink case at 4.78 but is only **4.45** as text on cream, which is close
enough to the line to be infuriating and still a fail. So there is a third,
`--raspberry-ink`, two percent darker, for text. Nobody sees the difference; axe
does. Use the one that matches the direction the colour is working in.

### The rule these came from

**Fix contrast at the token or the class, never on the one element the auditor
named.** `--taupe` was flagged once, on the wordmark, and was the colour of
eleven separate pieces of small text all carrying the same fault. A fix applied
to the flagged element ships the fault again on the next page.

---

## Type

**The studio's own site uses the system sans stack and no webfont:**

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Which renders as San Francisco on Apple, Segoe UI on Windows, Roboto on Android.
It loads in zero bytes, cannot fail, and is never a third-party dependency, which
is the same argument the studio makes to clients about everything else. Display
weight comes from `font-weight: 800` and tight negative letter-spacing rather
than from a display face.

**Client sites get their own faces**, chosen for the business, and they are
self-hosted at build time via `next/font/google`. That is not a rented
dependency: Next downloads the files during the build and serves them from the
site's own origin, so there is no runtime request to Google and nothing breaks if
Google does. What is forbidden is a `<link>` to a font CDN at runtime.

Live examples, for the pattern rather than for copying:

| Site | Display | Body |
|---|---|---|
| Chism Chicken Ranch | Lora | Inter |
| Copper Athletic Club | Oswald | Inter |
| MI Gas | Archivo | Inter |

Inter three times is a default worth questioning on the next build, not a house
standard.

---

## The studio credit

**"Double Dipped by Glazed Web"** is the default, title case on Double Dipped,
with the drippy donut linking to glazedweb.com.

**"Baked by"** where a donut pun would land wrong, which is any room where
somebody is mid-decision about spending real money on expertise. MI Gas gets
this one.

**"Concept build by"** on a spec build that has not been bought.

Retired, and recorded so nobody reintroduces them: *Designed and built by*,
*Made in Marshall by*, and a bare *Built by*.

### Procedure

The components are ready. Do not rebuild them.

1. `node glaze/scripts/plate.mjs "<footer bg hex>"` prints the plate ground, the ink,
   and the three CSS values. **Run it even when the answer looks obvious.** The
   failure mode is an invisible graphic, not an ugly one: the chocolate mark
   under a `#191919` footer measures 1.00.
2. Copy `GlazedCredit` and `GlazedPlate` from `glaze/assets/glazed-credit/` into
   the client's `components/`, taking the `.tsx` or `.jsx` pair to match the repo,
   and append `glazed-credit.css` to their `globals.css`.
3. Paste the three `--gw-*` values next to that site's palette.
4. `<GlazedPlate line="..." />` as the last child of `<footer>`, outside any
   max-width container so it is full bleed. Leave the client's copyright alone.

Then confirm it rendered: `.gw-plate` present, computed background and drip
colour matching what you set. A missing `--gw-above` fails silently to the
default and produces a seam rather than an error.

**Two judgments worth keeping.** Check that *both* readings of the wording work,
because it is our joke sitting in their footer and the downside lands on them.
And do not sweep the client's copyright onto the plate, because that would make
the studio's plate the last word on their site, which is not what a signature is.

**The credit belongs in the contract, not in a surprise deploy.** Removing it is
one line. Tell the client it is there. As of August 2026 it is live on seven
sites and no owner has been told, which is an open item rather than a precedent.
