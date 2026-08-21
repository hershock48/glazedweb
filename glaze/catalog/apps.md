# Apps: whole systems with routes, state and a second user

The heavyweight bones. Each of these is a product, not a page, and each has
already cost multiple sessions. Check here FIRST when a client needs ordering,
admin, payments, or a dashboard.

## The kitchen system  ⚠ four copies, already past the graduation bar

Online ordering + kitchen display + receipt printer. API shape:
`ordering/order`, `ordering/state`, `kitchen/login`, `kitchen/menu`,
`kitchen/orders`, `kitchen/state`, `printer`.

| Copy | State |
|---|---|
| `copperac/` | Byte-identical order route to stagecoach (md5 e242594…). |
| `stagecoach/` | Byte-identical to copperac. |
| `cookinwithbeans/` | Same shape, separate copy. |
| `pjs/` | DIVERGED — its fixes exist nowhere else, and vice versa. |

**Standing hazard:** a bug fixed in one copy is alive in three others. "When a
thing appears N times, check all N" (glaze.md) applies to whole apps. The next
session that touches any copy should extract it — a package, a template repo,
or at minimum a canonical-copy declaration here.

The kitchen system now has a florist cousin: `devine/src/app/workroom/` +
`src/lib/workroom/` ports the store (two backends, self-creating tables) and
the PIN gate to TypeScript, swaps the ticket queue for a date-bucketed order
board (orders live for weeks, not minutes), and adds three ledgers the kitchen
never needed: stem purchases, shrink with reasons, and per-product recipes
that price a week's margin. If the kitchen system gets extracted, the
workroom's store/auth are the newest TS copies to extract FROM.

## The rest

| App | Lives in | What it is |
|---|---|---|
| Florist workroom | `devine/src/app/workroom/`, `src/lib/workroom/` | Order board (web orders land automatically, phone orders written up at the counter, one button moves an order along) + stem/shrink/recipe tracker with a Monday-morning week report + a wedding/funeral QUOTE BUILDER: stems in, priced quote out, autosaving, with a client-facing print view and a wholesale buy list. One importless math file (`quote-math.ts`) shared by list, builder and print. Never guesses a number it was not given. The shape for any Phase-3 floral SaaS. |
| Sponsorship platform | `beanumber/` | The account's largest system: Stripe subscriptions + one-time gifts, webhook with Postgres-first mirror and idempotent retries, magic-link auth, shirt-number claiming, admin roster with uploads and compliance digests, drip email pipeline, newsletter engine with per-sponsor links, Remotion video, an Expo mobile app, a rep program (Airtable-backed — see the retirement memo before touching). Steal subsystems, not the whole. |
| Grant pipeline | `bangrants/` | Discovery dashboard: grants.gov ingest, page-change monitoring, funders/inbox/pipeline/watchlist views, Supabase auth. The shape for any "watch external sources, triage into a pipeline" tool. |
| Insurance pitch site + quote engine | `anchor/` | Content site with a working quote intake, a giving ledger, and a public calculator. |
| Digital download store | `sprinklesandsparklesbb/` | Stripe checkout → webhook → gated `/api/download/[slug]`. The reference for selling files. |
| Order-ahead + shop | `louies/` | Cart, checkout, paid-state handling, shipping orders — the demo that "takes a shipping order." |
| Kids' curriculum shop | `kidniche/` | Cart + shop + reviews + free-sample funnel. |
| Coffee storefronts | `superduper/` (cart flow), `superduperr/` (wholesale + rewards) | Two generations of the same client; superduperr is newer. |
| Egg-share reservations | `chism-chicken-ranch/` | Reserve + checkout + wholesale inquiry for a farm share. |
| Company site + order flow | `glazedweb/` | The studio's own site: agreement page, order intake, and `contracts/build-agreement.js` generating the client agreement .docx. |
| Pitch-host pattern | `Schulers/next.config.mjs` | Not an app but the deployment bone every pitch uses: host-scoped rewrites putting the proposal at `/` and the demo at `/demo` on the pitch host only, with noindex headers and the 404-on-client-domain guard for `/pitch`. Copy this file, not the idea. |
