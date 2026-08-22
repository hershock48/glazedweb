# Cascarelli's of Homer

**Repo** `cascarellis` · **Live** cascarellis.com

## What they are

Pizza restaurant and tavern in Homer, Michigan, since 1935. **The Albion location
is permanently closed**, so the work targets Homer only. POS is Aloha.

Spec build, with permission.

## Terms

Around $1,500 build plus $100 a month.

## Decisions on file

**Base the rebuild on their current site rather than reinventing it.** Keep their
brand, apply Glazed Web styling, and research current pizza and pub web design
trends. Same keep-their-brand play as Super Duper and Copper AC.

**A deadpan or snarky copy voice was explicitly rejected.** Kevin: "nobody wants
to be told it's going to be a while on a Friday." Warm, normal restaurant tone.

**The owner likes highlighting the specialty nuts**, especially cashews and
redskin peanuts, and wants to sell them online via Stripe Checkout.

**The tap list is managed in Scooplist, not Taplist.io.** Kevin floated
Taplist.io ("taproom.io" in his message, no such product); the ruling was to
run the studio's own board app instead, as a SECOND single-tenant Scooplist
deployment configured as a tap room, not a fork and not multi-tenancy. The
site consumes `GET {feed}/api/v1/case/homer` via `src/data/liveTaps.ts`
(truenorth's liveCase.ts pattern: 3s abort, 60s revalidate, and the
transcribed snapshot in `src/data/bar.ts` as the fallback on any failure,
including an empty board). The deployment's own env: `SCOOPLIST_LOCATIONS=
homer:Cascarelli's`, `SCOOPLIST_CATEGORIES=taps:On Tap`,
`SCOOPLIST_ALLERGENS=-`, and `SCOOPLIST_SIZES=-` ("-" = deliberately no
default prices, supported since scooplist `8b9ee1b`). LIVE since 2026-08-22:
the deployment is `cascarellis-taps` on Vercel, public at
`cascarellistaps.glazedweb.com`, Neon postgres attached (the app resolves
the integration's PREFIXED var, `DATABASE_CASCARELLIS_DATABASE_URL`, via
scooplist's connectionVar() — the dashboard never produced a plain
DATABASE_URL despite an evening of trying). The full bar program (89 items,
ten boards) SELF-SEEDS at first boot from scooplist's `seed-bar.ts`,
generated from this repo's `bar.ts`; the site's feed URL is a CODE DEFAULT
in `src/data/liveBar.ts`, so no env var is needed on the site project
either. `tools/populate-scooplist.mjs` remains the way to push future
`bar.ts` corrections into the live library (matches by name+category,
updates in place; needs the PIN). Wine sections, cocktails and zero-proof
all render from the feed with per-section fallback to `bar.ts`. Photos
(Vercel Blob) not configured — optional. The owner's surfaces: `/case` on
their phone, `/board/homer` for a TV.

## Permissions

Logo and photos, granted for the spec build.
