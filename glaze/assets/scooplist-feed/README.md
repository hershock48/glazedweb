# The Scooplist feed client: drop-in file

Copy `scooplist-feed.ts` into a client repo (`lib/scooplist-feed.ts`). Do not
rebuild it, and do not fetch the feed ad hoc: the file exists because two
sites (truenorth, cascarellis) each hand-rolled this and a third was about to.
It generalizes `cascarellis/src/data/liveBar.ts` (the section map, the mapAll
strictness, the per-section fallback) and `truenorth/src/data/liveCase.ts`
(the enhancement-never-dependency fetch policy). The first instantiation of
the template is `copperac/lib/taplist.ts`.

The repo it lands in is TypeScript everywhere so far; a JavaScript repo would
strip the types rather than fork the logic.

## How to wire a site

1. **Copy the file** to `lib/scooplist-feed.ts`. It is server-only on
   purpose: the feed resolves during render and the browser never fetches it.
2. **Write one consumer module** next to it (`lib/taplist.ts`,
   `lib/liveCase.ts`, whatever the site calls its program). It owns:
   - the site's own row types and the mappers into them. A mapper returns
     `null` to reject a row it cannot honestly render (no producer on a tap,
     no price on a cocktail), and one rejected row falls the whole section
     back. Misconfig beats partial truth.
   - the static fallbacks, which are the site's pre-feed data, unchanged.
     The site file keeps owning section titles and order (site voice); the
     feed only fills rows in.
   - the CATEGORY CONTRACT: a header comment listing the org's category
     keys (`taps:On Tap,cocktails:Cocktails`). The org creation command,
     the populate script, and this module must state the same list; a key
     missing on the deployment silently coerces categories, which is why
     the populate script hard-exits on a coerced save.
3. **The feed URL is a code default** in the consumer module, with
   `SCOOPLIST_FEED_URL` as the env override for local testing. It is the
   client's own infrastructure URL, a public fact like their phone number;
   requiring a dashboard step to turn the feature on once left a site
   silently running on its snapshot with nothing saying so. Every failure
   path still lands on the fallback, so the default is safe. Say all of
   this in the site's `.env.example`, especially if that file promises
   "nothing here is optional-with-a-fallback" (copperac's does; the feed
   URL is the documented exception).
4. **Copy a status route.** `truenorth/src/app/api/status/route.ts` is the
   model: an unauthenticated JSON answer to "is the site live or on its
   snapshot", because the fallback is deliberately invisible to visitors
   and must not be invisible to the operator too.

## Multi-org vs single-tenant feeds

Set `org` in the `FeedConfig` for the central multi-org deployment
(`https://scooplist.glazedweb.com`, path `/api/v1/orgs/{org}/case/{location}`).
Omit it for a dedicated single-tenant install (truenorth, cascarellis; path
`/api/v1/case/{location}`). Same JSON shape either way, additive-only
contract, breaking it breaks live menus.

## What not to do

- Do not render partial sections. `mapAll` exists because a half-rendered
  wine list with confident prices on it is a lie with good posture.
- Do not invent a fallback where none exists. Copper AC had no tap list
  before the feed, so its taps fallback is the site's honest "Taps rotate.
  Ask what's pouring." panel, not placeholder beers.
- Do not take section titles from the feed. Board labels there are admin
  vocabulary; the site's voice belongs to the site.
