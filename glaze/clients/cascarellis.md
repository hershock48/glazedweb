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
`SCOOPLIST_ALLERGENS=-`, and `SCOOPLIST_SIZES` needs real pour prices from
the owner, otherwise new taps default to ice cream Mini/Small/Large in the
admin. Still to do: create that Vercel project from the scooplist repo, set
its env plus a real PIN, then set `SCOOPLIST_FEED_URL` on the cascarellis
project.

## Permissions

Logo and photos, granted for the spec build.
