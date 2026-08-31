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
| Florist workroom | `devine/src/app/workroom/`, `src/lib/workroom/` | Order board (web orders land automatically, phone orders written up at the counter, one button moves an order along) + stem/shrink/recipe tracker with a Monday-morning week report + a wedding/funeral QUOTE BUILDER: stems in, priced quote out, autosaving, with a client-facing print view and a wholesale buy list. One importless math file (`quote-math.ts`) shared by list, builder and print. Never guesses a number it was not given. Since 2026-08-31 also the INVENTORY CORE: a master stem list seeded from the shop's laminated selling-price lists, a weekly distributor order that starts from last week and logs the whole truck as purchases in one tap (bunches converted by a stems-per-bunch the shop teaches it once), a plant par sheet with derived Need, and a cooler ledger (bought minus tossed minus made over a short window) with per-recipe can-make counts, fed by both the order board and recipe-mapped Square register sales. The shape for any Phase-3 floral SaaS. |
| Sponsorship platform | `beanumber/` | The account's largest system: Stripe subscriptions + one-time gifts, webhook with Postgres-first mirror and idempotent retries, magic-link auth, shirt-number claiming, admin roster with uploads and compliance digests, drip email pipeline, newsletter engine with per-sponsor links, Remotion video, an Expo mobile app, a rep program (Airtable-backed — see the retirement memo before touching). Steal subsystems, not the whole. |
| Grant pipeline | `bangrants/` | Discovery dashboard: grants.gov ingest, page-change monitoring, funders/inbox/pipeline/watchlist views, Supabase auth. The shape for any "watch external sources, triage into a pipeline" tool. |
| Insurance pitch site + quote engine | `anchor/` | Content site with a working quote intake, a giving ledger, and a public calculator. |
| Digital download store | `sprinklesandsparklesbb/` | Stripe checkout → webhook → gated `/api/download/[slug]`. The reference for selling files. |
| Order-ahead + shop | `louies/` | Cart, checkout, paid-state handling, shipping orders — the demo that "takes a shipping order." |
| Kids' curriculum shop | `kidniche/` | Cart + shop + reviews + free-sample funnel. |
| Coffee storefronts | `superduper/` (cart flow), `superduperr/` (wholesale + rewards) | Two generations of the same client; superduperr is newer. |
| Egg-share reservations | `chism-chicken-ranch/` | Reserve + checkout + wholesale inquiry for a farm share. |
| Scooplist (flavor board) | `scooplist/` | Taplist.io-for-scoop-shops, the studio's first PRODUCT repo (not a client site): flavor library (photos, allergens, price-by-size) + per-location case with a two-tap blow-a-tub flow, public versioned feed (`/api/v1/case/{location}`, open CORS) that client sites and the built-in TV board (`/board/{location}`) consume. Assembled from the workroom store/auth bones + browser-resized photo upload (Blob or inline). MULTI-VERTICAL since Aug 2026: a first-run `/setup` page picks the business type (scoop shop / tavern / coffee / other-with-free-text-nouns) from presets in `src/lib/presets.ts` that set boards, prices, allergens, copy voice, and the app's nouns (flavor/case, drink/cooler); stored in the app's own settings table, with env vars as the operator override that pins a deployment (`SCOOPLIST_CATEGORIES` et al., the live installs). MULTI-TENANT since Aug 2026, superseding the "single-tenant per deployment until a second client proves the shape" ruling (the gate tripped: Cascarelli's proved the second vertical, Copper AC was the third install): the central deployment (`scooplist` project, scooplist.glazedweb.com; Kevin's ruling that the product's domain belongs to the product, so True North's single-tenant install there flipped into the `truenorth` org via `--adopt-legacy`, its old public URLs kept alive by `SCOOPLIST_LEGACY_ALIAS`) opts in via `SCOOPLIST_MASTER` (see `src/lib/org.ts` for the inverted mode rule), orgs are data (per-org PIN hashes, locations, vertical; created with `tools/create-org.mjs`, no signup and no billing on purpose), owners sign in at `/login/{org}`, and sites read `/api/v1/orgs/{org}/case/{location}` via the `glaze/assets/scooplist-feed/` template. True North and Cascarelli's are grandfathered on their own env-pinned deployments and databases, zero migration. First client: True North; second deployment: Cascarelli's tap list; first org: Copper AC's taps + cocktails. |
| Owner panel (Glaze Panel, session 1 of 3) | `kidniche/app/admin/`, `lib/panel/`, `lib/content.ts` | The per-site owner admin from the Aug 2026 sketch: every screen is a form over rows, never a design surface. Session 1 ships the PIN login (scooplist gate, ported), the two-backend store (scooplist store, cut to one key->jsonb table, org-scoped keys from day one), and the business-facts editor: a whitelist config (`lib/panel/facts-def.ts`) drives the form, the validation and the merge, `lib/content.ts` lays stored edits over `lib/site.ts` (seed and safety net; clearing an edit restores the built-in value), and saves call `revalidatePath("/", "layout")` so static pages update in seconds. On memory backend the panel says so on screen. Sessions 2-3 add blog + photos, collection screens, and the leads inbox. THE canonical copy to extract once a second client proves it. |
| Company site + order flow | `glazedweb/` | The studio's own site: agreement page, order intake, and `contracts/build-agreement.js` generating the client agreement .docx. |
| Beer League site | `beerleague/` | Kevin's own fantasy league (Fleaflicker league 37401) rebuilt as an experience layer: live scoreboard, roster-personalized ESPN news, Sleeper waiver buzz, and a 2007-onward committed archive (standings, every box score) distilled by `tools/derive.mjs` into franchises/champions/H2H/record book. The bones to steal for ANY league-history site: `tools/sync.mjs` (polite Fleaflicker archiver; the API 403-blocks fast pulls, header explains), the derive engine (champion = undefeated in playoffs at best seed, ranks are seeds not finishes), and the no-key news/trending fetchers in `lib/news.ts`. |
| Pitch-host pattern | `Schulers/next.config.mjs` | Not an app but the deployment bone every pitch uses: host-scoped rewrites putting the proposal at `/` and the demo at `/demo` on the pitch host only, with noindex headers and the 404-on-client-domain guard for `/pitch`. Copy this file, not the idea. |
