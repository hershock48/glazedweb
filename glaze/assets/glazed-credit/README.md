# The studio credit: drop-in files

Copy these into a client repo. Do not rebuild them, and do not redraw the mark: every path
string and gradient stop in `GlazedCredit` is copied verbatim from glazedweb's
`components/Logo.jsx` (the v9 `<symbol id="mark">`), and the drip in `GlazedPlate` is his
`dripEdge` symbol. That is the whole point of these files existing here.

The mark was once redrawn from scratch by a session that reasoned its way to it through three
true-sounding constraints, shipped it to four live sites, and was caught by Kevin: *"it's not
MY donut. Did you actually rebuild using source code or just guess?"* The fix is not to
remember harder. It is that the real artwork lives here now.

## Files

| file | goes to |
| --- | --- |
| `GlazedCredit.tsx` / `.jsx` | `components/` (or `src/components/`), the words plus the mark |
| `GlazedPlate.tsx` / `.jsx` | same, the drip edge plus the credit on a Glazed ground |
| `glazed-credit.css` | appended to that site's `globals.css` |

Pick `.tsx` or `.jsx` to match the repo. The `.jsx` files are generated from the `.tsx` by
stripping the type annotation. If you change one, regenerate the other rather than editing
both, or they drift.

`GlazedPlate` imports `GlazedCredit` from `@/components/GlazedCredit`. In a repo without that
alias (mi-gas uses relative imports) change it to `./GlazedCredit`.

## The four steps

**1. Pick the plate ground with the script, not by eye.**

```
node scripts/plate.mjs "#191919"
```

It prints the ratios, the choice, and the three CSS values to paste. The footer colour you
pass is the one that will sit *directly above* the plate. Chocolate under a `#191919` footer
measures 1.00. The drip would be invisible, not merely subtle.

**2. Paste the three values** into that site's own CSS, next to its palette:

```css
.gw-plate {
  --gw-above: #191919;      /* must match the footer above EXACTLY, or a seam shows */
  --gw-plate: #FDF6EC;
  --gw-plate-ink: #2B1E16;
}
```

**3. Hang the plate off the end of `<footer>`**, last child, *outside* any max-width
container, so it is full bleed:

```jsx
      </div>
      {/* Glazed Web signs off below the client's footer, not inside it. */}
      <GlazedPlate line="Double Dipped by" />
    </footer>
```

**4. Leave the client's copyright where it is.** Only the credit moves onto the plate.
Sweeping their copyright line onto Glazed's ground makes the studio's plate the last word on
their own site, which is not what a signature is.

## The wording

`line` is a prop with a plain default, because the register is not the same everywhere.

| line | used on |
| --- | --- |
| `Double Dipped by` | the default: farms, bars, bakeries, food trucks, the nonprofit |
| `Baked by` | mi-gas. Kevin's, and better than the flat "Built by" it replaced |
| `Concept build by` | superduperr and the griffin-claw pitch, concept builds not live stores |

Title case on **Double Dipped**: it is the studio's phrase, so it takes a name's
capitalisation. Sentence case read as a description of a process.

On a concept build the disclaimer beside it (`Demo data, not a live store.`) is doing real
work, so keep it. Swapping in the client wording deletes it.

## Two things not to change without measuring

The credit link carries `rel="noopener noreferrer"`. Whether it should also carry `nofollow`
is an open decision with Kevin. Google's explicit recommendation for designer credit links
you control is to add it, and the risk of not doing so lands on the client's site as much as
ours. See the SEO note in `standards.md`.

The mark is sized in `em` (2.15em ≈ 26px against a 12px footer line). At 22px the hole closes
to 3px and it starts reading as a lollipop; at 30px it dominates the bar. Both ends were
rendered before that number was picked.
