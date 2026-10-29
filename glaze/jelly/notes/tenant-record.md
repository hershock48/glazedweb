# The tenant record

**Source.** Scooplist, `src/lib/org.ts`, `src/lib/store.ts`,
`tools/create-org.mjs` and README section "One deployment, many shops",
read 2026-10-29. Our own code, no license question. Step 0.2 of the build
outline.

## What it is

One row per restaurant that every other system keys off. Today a client
exists in six places that do not agree: the registry row in
`lib/customOrders.js` on glazedweb main (prices, agreement, Launch), a repo,
a Vercel project, a Stripe customer and subscription on the glazedweb
account, a ledger row in `glazedweb-admin/data/studio.json` (events, next
action), and a client file in `glaze/clients/`. Jelly adds a seventh, the
runtime tenant. The rule this note sets is that the runtime tenant is keyed
by the same slug as the registry row and that nothing else is ever a key.

## Observed in Scooplist

| Thing | Where | What it does |
|---|---|---|
| Org mode is opt-in | `org.ts` `orgMode()` | Multi-org only when `SCOOPLIST_MASTER` is set and the two pinning env vars are absent; pins win over master so a misconfiguration fails toward the mode that cannot lose data |
| Reserved slugs | `org.ts` `RESERVED_SLUGS` | `default`, `api`, `login`, `board`, `admin`, `master` and the rest of the top-level URL space, so an org can never shadow a route |
| Slug shape | `org.ts` `SLUG_RE` | `^[a-z0-9][a-z0-9-]{1,30}$`; no `/`, `:`, `,` or `.` because each is a separator somewhere (settings keys, env pairs, the cookie) |
| The org row | `org.ts` `type Org`, `store.ts` `OrgRow` | `slug`, `name`, `locations[]` as JSON on the row, `pinHash`, `handoffKey`, `siteHook` |
| Every row carries the org | `store.ts` store interface | Every method takes `orgId` first; legacy rows were backfilled with `org_id = 'default'` and the unique indexes widened |
| Settings per org | `store.ts` `settingKey()` | `org/{slug}/{key}`; the legacy sentinel keeps bare keys |
| Creation | `tools/create-org.mjs` | Master secret from the environment only, never a flag or a file; re-running with the same slug updates in place and never touches data; `--adopt-legacy` flips a single-tenant install into the first org |
| Owner sign-in | README | `/login/{slug}` plus a PIN; a signed two-minute handoff link from the org's own website lands the owner on the admin with no PIN |
| Public surfaces | README | `/board/{slug}/{location}` and `/api/v1/orgs/{slug}/...`; an alias env keeps old printed URLs alive through a flip |

## What Jelly takes

1. The slug is the key, with Scooplist's regex and a reserved list, and it
   is immutable once created.
2. Every table carries `tenant_id` from the first migration; there is no
   legacy sentinel because Jelly has no single-tenant past.
3. The row holds what is needed to route and to pay, nothing else: `slug`,
   `name`, `legal_name`, `timezone`, `hosts[]` (the ordering host and any
   alias), `stripe_account_id` (the Connect connected account),
   `registry_slug` (always equal to `slug`, present so the join is explicit),
   `status` (`demo`, `building`, `live`, `left`), `created_at`, `left_at`.
4. Locations are their own table, not JSON on the row, because the register
   has per-location terminals, printers, tax configuration and a drawer.
5. Settings are rows keyed `tenant_id, key`, never env vars, so one
   dashboard edit can never restyle every tenant at once (Scooplist's rule,
   kept word for word).
6. Creation is a tool with the master secret from the environment only, and
   re-running with the same slug updates the row and never the data.
7. The signed handoff from the client's own site is kept as the way an
   owner moves between the site's workroom and the platform without a
   second login.
8. The demo restaurant is a tenant like any other with `status = demo`, so
   every stage is built against the same code path a real tenant uses.

## What Jelly changes

1. **PIN becomes an account.** Scooplist's single PIN per org fits a tap
   list. A register needs named owners with two-factor, named staff with
   PINs and roles, and an audit row that says who. The tenant row carries no
   `pinHash`; owners and staff are rows in their own tables
   (`workroom-session 1.0.0` is the session shape, `pos_hr`'s three rights
   levels the permission shape).
2. **Locations and registers are tables.** `location` (address, timezone,
   tax configuration, alcohol flags, hours), `register` (a terminal, its
   printer group, whether it has a drawer), `printer` (device token, model,
   station). Scooplist's JSON list is right for two scoop shops and wrong
   for a drawer that must balance.
3. **Hosts are explicit.** Scooplist serves one host; Jelly serves
   `order.<client domain>` per tenant and a platform subdomain as fallback,
   so `hosts[]` is on the row and the router resolves tenant by host first,
   slug second.
4. **Money identifiers live here.** The Connect account id is on the tenant
   because the application fee and the payouts resolve from it, and because
   the books (five lines, one row per restaurant) are read off Stripe by
   this id.
5. **Status is a column**, because the demo, a tenant mid-build and a tenant
   that left all need to exist and behave differently, and because "you can
   leave" is a state the system has to represent, with `left_at` and the
   export (step 1.6) that goes with it.

## The six places, and how each points at the record

| Place today | Stays as | Points at the tenant by |
|---|---|---|
| Registry row, `lib/customOrders.js` on main | The price of record and the agreement (Kevin edits it; AGENTS.md) | Same slug; a reconciliation job flags any tenant whose slug has no registry row or whose status disagrees |
| Client repo | The site, presentation only | A link to `order.<domain>`; `JELLY_TENANT` env for the handoff key, nothing else |
| Vercel project | The site's hosting | Unchanged; Jelly is one separate Vercel project for all tenants |
| Stripe customer and subscription | The monthly billing | `stripe_customer_id` on the tenant; the Connect account is a second, separate id |
| Ledger row in glazedweb-admin | The record of events and next actions | Same slug; the ledger reads tenant status to know who is live |
| `glaze/clients/*.md` | Durable facts a human reads | Named after the slug |

The dispute rule from `glaze/handoff.md` holds: the registry on main is the
price of record, the dashboard is the record of events, the tenant is the
record of runtime, and a reconciliation job flags disagreement instead of
letting any one of them win silently.

## Open questions

- Whether Scooplist itself becomes a module of Jelly or stays its own
  product with a shared tenant slug. Copper's Scooplist org and its future
  Jelly tenant should be the same slug either way.
- Whether the Stripe customer for the monthly and the Connect account for
  the restaurant's own payments should ever be the same Stripe account.
  Today they are not, and the note assumes they stay separate.
- The reconciliation job's home: glazedweb-admin already reconciles the
  registry against the dashboard (`reconcile-facts.mjs`); adding the tenant
  table as a third party to that job is the likely answer and is not
  decided here.
- Kevin has not read this. Step 0.2 is done when he has.
