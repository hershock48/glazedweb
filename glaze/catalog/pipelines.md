# Pipelines: asset and brand work

The house rule these all serve: **lift the real thing, do not approximate it**
(glaze.md, quality bar). Every pipeline here exists to get a client's actual
artwork into a build at usable resolution, or to make it move.

| Pipeline | Lives in | What it does |
|---|---|---|
| Crest harvest | `Schulers/harvest/` | Recovered a 4.34× resolution crest from the client's own banquet-packet PDF (800 DPI render, isolated by connected component), split it into base + script layers, rebuilt the engraved hatch row by row. |
| Building ink mask | `Schulers/` (see `components/BuildingInk.jsx` header) | Turns a heavily-hatched pen drawing into a self-drawing reveal: skeleton gridded, per-cell stroke direction by SVD, 667 strokes ordered with jitter. For artwork too dense to vectorise. |
| Signature tracing | `Schulers/`, `donna/tools/trace.py` | Filled glyph mask → single-pass pen path: skeleton as a graph, covering walk, spur shaving, even arc-length resample, Catmull-Rom fit. donna's is the generalized write-up. |
| Brand re-cut | `donna/tools/extract-brand.py` | Re-cuts a site's brand assets from the client's one original logo file. |
| Petal extraction | `devine/tools/extract-petal.py` | Lifts one element out of a logo so the animated element IS theirs, not a lookalike. |
| Hero tracing | `devine/tools/trace-hero.py` | Photograph → hand-drawn-style ink rendering matched to the client's line-art mark. |
| Photo processing | `devine/tools/process-supplied.py` | Supplied photography normalized with derived (not eyeballed) color matching. |
| Badge layering | `stagecoach/tools/cut-mark.py` | Cuts a client badge into animatable layers without redrawing it. Same technique as the Lemoncello build. |
| Link-card rendering | `devine/tools/og.mjs`, `og-products.mjs`, `stagecoach/tools/make-og.mjs` | Render og.jpg from a real route so the card is the site, not a mock. |
| Shirt-print preflight | `beanumber/` (scripts around the shirt SVGs) | Raster preflight at 20px/mm: distance-transform thickness gates, erosion survival, washout floors. For anything screen-printed. |
| Video renders | `beanumber/src/remotion/` | Remotion impact-report and reel compositions — the account's only programmatic video. |
| Logo→raster | `beanumber/scripts/convert-logo-to-jpg.js` | SVG → JPG at set sizes. |
| Agreement builder | `glazedweb/contracts/build-agreement.js` | Generates the client agreement .docx from code (docx lib). The contract is a build artifact, not a Word file someone edits. |
