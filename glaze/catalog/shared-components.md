# Versioned client-owned components

`components.json` is the machine-readable registry. Each entry pins the repository and commit that published its source; the copy verifier requires the same source reference in client manifests. The versioned source under
`glaze/assets/<id>/<version>/` is the reference copy; clients keep their own files
and do not depend on another client's deployment or an always-online package
service. Existing designs, menus and provider choices stay in their repositories.

## First releases

| Component | Version | Verified working copies | Boundary |
|---|---|---|---|
| content-cas | 1.0.0 | Copper, Mike's Place | Atomic PostgreSQL content comparison and audit insertion, with local-memory equivalent. |
| menu-write | 1.0.0 | Copper, Mike's Place | Revision and full-menu validation; client-specific price rules remain local. |
| owner-save | 1.0.0 | Copper, Mike's Place | Explicit save outcomes, bounded request, complete response validation; callers retain drafts and freeze submitted fields. |
| workroom-session | 1.0.0 | DeVine, Copper | Signed owner/staff tokens with an 18-hour expiry; wrappers own app isolation, credentials, cookie flags and login throttling. |
| option-pricing | 1.0.0 | Copper, Mike's Place | Group-qualified option picks, required/single/multiple selection rules, integer-cent option totals and disambiguated ticket labels. |

The initial session and pricing copies matched before extraction. Later menu-save releases include new shared behavior adopted in both clients. Versioning makes that relationship
explicit; it does not certify their whole applications or live installations.
Copper's ordering implementation remains a parked demo; customers use Toast.

Run `node --test --test-isolation=none glaze/assets/shared-components.test.mjs`
and `node glaze/scripts/verify-component-copies.mjs` from this repository.
The verifier normalizes CRLF to LF, then compares SHA-256 content. It reports
missing or locally changed files and never overwrites them. Review differences
before any upgrade. Client-specific wrapper tests remain required.

For option pricing, `menu.d.ts` documents the required structural interface;
the client supplies its own compatible menu module. Menu prices must already be
validated integer cents. Base prices, quantities, taxes, delivery and provider
fees are separate contracts and are not covered by this release.

For menu writes, see [the integration and verification notes](menu-save-release.md). Run the separate PostgreSQL statement tests with `npm ci --prefix glaze/assets/content-cas/1.0.0` and `npm test --prefix glaze/assets/content-cas/1.0.0`. This private test package uses PGlite and is not an application dependency.

## Upgrade procedure

See [owner controls](owner-controls.md) for the comparison, integration rules, and remaining concurrency/access/storage work. The owner-save helper is a client integration; it does not certify server persistence or deployment.

1. Create a new immutable version directory and record its source commit,
   capability, limitations and change notes in the registry.
2. Compare the installed client file against its recorded hash. Preserve local
   changes explicitly; never replace an edited client file automatically.
3. Copy the reviewed version into the client's repository, run its integration
   tests, and record the new reference in the client manifest and private ledger.
4. Record deployment separately after inspecting the installed site. A source
   commit, successful local build or manifest does not prove a deployed version.

## Inventory and remaining extraction

`node glaze/scripts/inventory-components.mjs` emits source paths and content
hashes for nine working repositories, including uncommitted files. The checked-in
`component-inventory.json` is a dated snapshot, not runtime verification.

| Area | Evidence inspected | Next reuse boundary |
|---|---|---|
| Restaurant options | Copper and Mike's Place have identical tested group-aware pricing. | Extend with shared money/quantity validation after comparing other restaurant copies. |
| Owner sessions | DeVine and Copper share the signed-token primitive; their wrappers differ. PJ's still uses a PIN-valued cookie in the inspected copy. | Adopt signed sessions through each client's wrapper and test its roles/cookies/storage. |
| Payments | DeVine has durable Square attempts and recovery in its review branch. Copper uses Toast publicly. | Keep Square adapters distinct from Stripe and external Toast ordering. |
| Small-shop carts | Louie's has separate money/cart/availability/mail modules. | Compare quantity and rounding contracts before adoption; do not infer equivalence from names. |
| Fulfillment | Restaurant kitchen queues and the florist's dated board have different lifecycles. | Extract only common state and retry contracts after cancellation/concurrency checks. |
| Public feeds | True North and Copper consume inventory feeds. | Preserve empty/stale/unavailable distinctions; inspect provider-specific shapes. |

This is an initial comparison, not completion of the full pricing, payment,
notification and kitchen consolidation program.
