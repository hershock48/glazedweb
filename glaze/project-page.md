# The project page

`glazedweb.com/build/{slug}`. Route: `app/(en)/build/[slug]/page.jsx`. Data: the
client's `project` block in `lib/customOrders.js`. Built 2026-09-09, first client
True North.

## What it is

One page per signed client, at a URL that outlives the proposal, answering the
four questions a client actually has after saying yes:

1. Where are we?
2. What do you need from me?
3. What happens next, and when?
4. Where is my stuff?

It is the page the client opens for the next six weeks instead of texting "any
update?" It is not a proposal, not a scope document, and not a second
agreement.

## Why it is not a proposal v2

The proposal's job ends at yes. Its structure is diagnosis, proof, price, ask,
and every one of those is spent the moment the client agrees. A signed client
reading nine sections about what is wrong with his old site is being sold
something he already bought.

## The one rule

**This page never restates scope.** Scope lives once, in Exhibit A on
`/agreement/{slug}`, and this page links there. Two descriptions of the same
job drift, and the day they disagree the client quotes whichever helps him. It
is the same failure as three copies of a price, and the same fix: one home.

## Where it lives, and why the studio side

- The client repo's pitch folder is scheduled for deletion at signing or
  passing (`next.config.ts` in every pitch build says so). At launch `/` on the
  client's host becomes their site. A project page living there would have to
  move exactly when it is most in use.
- The agreement is already at `glazedweb.com/agreement/{slug}`, reading from
  `lib/customOrders.js`. This page reads the same row, so the client's name,
  numbers and slug exist once.
- Every client needs one. One route, one registry, N clients.

Page title is **Your build.** It matches "build fee" and it is what the client
would call it. Noindexed, not in the sitemap, not in any nav; the link Kevin
sends is the only way in, same as the agreement page.

## The registry block

```
project: {
  since: "YYYY-MM-DD",
  accepted: false,           // hand kept: acceptance is an email record
  liveOnDomain: false,       // hand kept: flipped on launch day
  needs:    [ { id, ask, why, done } ],   // the client's homework, OUR boxes to tick
  steps:    [ { title, detail } ],        // sequence, never scope
  freebies: [ { lead, text } ],           // what we do regardless
  links:    [ { label, href, note } ],    // their stuff
  monthlyIs: [ "...", "...", "..." ],     // service, not fee
}
```

`contentProgress(order)` in the registry counts `needs` so the "3 of 11" on the
page cannot disagree with the list under it. Build fee and monthly read live
from Stripe through the same `buildStatus` and `monthlyStatus` the agreement
page uses.

## The sections, in order

1. **Where things stand.** Five rows in the agreement page's status pattern:
   agreement, build fee, monthly, your content (N of M), live on the domain.
   The content row is what makes the page worth opening: it turns "we are
   waiting on you" from a nagging text into a number that goes up.
2. **What we need from you.** The client-facing half of the README launch
   checklist, written for the client, each item with *why*. Ordered by what
   blocks what.
3. **What happens, in order.** Sequence, not scope, with one link to Exhibit A.
   No dates until content is in: content is the only real variable, and a
   schedule published before it lands manufactures a broken promise for week
   two.
4. **What we are doing anyway.** The free items the proposal offered. In the
   proposal they were an inducement; here they are a receipt.
5. **Your stuff.** Plain links: the site, their owner tools, the agreement,
   Kevin. No buttons, no persuasion.
6. **What the monthly actually is.** Three lines of service, because the
   monthly is the part clients forget they are buying.

## Decisions made, and why

- **We tick the boxes, not the client.** A client-editable checklist needs a
  login, and the honest state is what we have actually received, not what he
  believes he sent. Ticking one is a one-line registry edit.
- **No price argument.** The price is settled. It appears as a number in a
  status row, never as a case.
- **No diagnosis of the old site.** That work is done, and quoting it back to a
  signed client is a small insult.
- **A client without a `project` block 404s.** An empty page with a client's
  name on it is worse than no page.
- **Same guards as the agreement page.** Every array defaulted, because a
  registry typo must not 500 a page a client was sent a link to.

## Where the "what we need" list comes from

`glaze/launch.md` says to copy the launch checklist into the client README as
the handover artifact. Half of that checklist is always things only the client
can supply. Those items, rewritten for the client with reasons, ARE this page's
section 2. Do not maintain them twice: when the README item is resolved, tick
`done` here in the same commit.

## Open

- Does it survive launch? The intent is yes, renamed to something like "your
  account", holding the monthly, the links and how to ask for an edit.
  Otherwise it dies the week it stops being useful and the client has nowhere
  to go.
- Chism is paid and live with no proposal ever written, which is exactly the
  client this page serves best. He does not have one yet.
