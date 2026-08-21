# The catalog: bones we have already built

Kevin's rule, 2026-08-21: **every tool and every web app built in any repo gets
an entry here, so no session spends a day remaking something the account
already owns.** The proof it was needed: at the time of the first scan, the
account carried three contrast checkers, three motion samplers, two flow-check
suites — and the same kitchen/ordering system pasted into four repos, two of
them byte-identical.

Two obligations, one per direction:

- **Before building** a harness, a checker, a form flow, a checkout, an auth
  scheme, an admin surface, an asset pipeline — read the matching file below.
  If a cousin exists, port it the way the field harnesses were ported into
  `glaze/scripts/` (generalize the arguments, strip the site-specific waits),
  and note the port here.
- **After building** one, add its row in the same commit that builds it. An
  entry costs a minute; the rebuild it prevents costs a day.

## The files

| File | What lives there |
|---|---|
| [harnesses.md](harnesses.md) | Audit and QA tooling: the canonical `glaze/scripts` set and every field cousin still in a client repo. |
| [pipelines.md](pipelines.md) | Asset work: brand extraction, glyph tracing, self-drawing artwork, link-card rendering. |
| [web-bones.md](web-bones.md) | Components and flows that took a session or more to get right. |
| [apps.md](apps.md) | Whole systems — things with routes, state and a second user. The kitchen system lives here. |

## The bar for an entry

Not every component — buttons and cards are cheaper to rewrite than to look
up. An entry is earned when the thing **took a session or more to get right,
or encodes a decision a future session would otherwise re-litigate.**

Same contract as every glaze file: if this file disagrees with the code, the
code is right — but a missing entry is a defect in the commit that built the
tool, not a fact about the catalog.

## Graduation

A field tool used from a second repo gets ported to `glaze/scripts/` and its
row moves to the canonical table. A web bone needed by a second client gets
extracted the way `glaze/assets/glazed-credit/` was. The kitchen system is
already four repos past this bar; its row in apps.md says so.
