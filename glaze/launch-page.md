# Launch: the page after yes, and the one action that leads to it

The standard for how a proposal closes and what the client lands on. Written
2026-09-10 from the four pages that exist: True North (the first, 2026-09-09),
Anchor and Copper (studio side), and DeVine (client side). Read this before
finishing any proposal or setting up any signed client. Supersedes
`glaze/project-page.md`.

**The short version.** A proposal closes on ONE action, a button that says
**Launch ↗**, and it opens one page, **Your build**, at
`glazedweb.com/build/{slug}`. That page answers the four questions a client has
after saying yes, never restates the deal, and stays current until the site is
live on their domain. The agreement is a plain link under the button, never a
second button. If the client wants to test things first, the list is on that
page, and the letter points at it.

---

## 1. The one action

The letter's job is diagnosis, proof, price, ask. It ends on one action, and
since 2026-09-09 that action is the build page rather than a meeting or an
email: the meeting has usually happened, and what a prospect who has decided
needs is the page that comes after yes, from any scroll position.

"Launch ↗" appears in exactly these places, all the same link:

| Where | How |
|---|---|
| Sticky header | The one pill in the nav bar. A 62px bar with two pills is two closes. |
| Hero | The ghost button beside the "see the site" button. |
| "What happens next", step 1 | Named in prose: *Everything from here lives on one page, yours.* |
| Closing band | The single big button. Headline: **Everything from here is on one page.** |

Under the closing button, as plain links in the "after" text, in this order:
the agreement ("Ready to say yes?"), the try-it list ("Want to test it first?",
pointing at `/build/{slug}#try`), the intake sheet if the build has one, then
email Kevin and the demo. Nothing else gets a pill.

The agreement is **never** a second pill. Someone who has decided goes to the
build page and finds "Read and accept the agreement" as the first status row.

---

## 2. Where the page lives

**Default: the studio side.** `glazedweb.com/build/{slug}`, route
`app/(en)/build/[slug]/page.jsx`, data from the client's `project` block in
`lib/customOrders.js`. Three reasons, and they hold for every pitch build:

- The client repo's pitch folder is deleted at signing or passing, and at
  launch `/` on the client's host becomes their site. A page living there would
  move exactly when it is most in use.
- The agreement is already at `glazedweb.com/agreement/{slug}`, reading from
  the same row, so the name, the numbers and the slug exist once.
- One route, one registry, N clients.

**The exception: the client side.** DeVine's agreement's one home is on her
own host (`devine.glazedweb.com/agreement`, because her acceptances live in her
workroom store), so her launch page lives beside it at `/launch` in the devine
repo. Its money lights read `glazedweb.com/api/build-status/{slug}`, a public
booleans-only endpoint (build state word, monthly yes or no; no amounts, no
ids), so no Stripe key ever enters a client repo. Use this shape only when the
agreement genuinely has to live on the client's host. Do not start a new client
there.

Noindex, not in the sitemap, not in any nav, on either side. The link in the
letter is the only way in, same as the agreement page.

---

## 3. The page

Title: **Your build.** It matches "build fee" and it is what the client calls
it. (DeVine's says "The launch plan."; when that page is next touched, align
it.) Kicker: `Your build · {Client}`. The mark in the corner goes back to the
proposal the client arrived from (`pitchUrl`), never to the studio home; a page
that exists for one client should not dump them on our homepage.

The lead paragraph says what the page is and points at the agreement for
"what was agreed, and for how much". The note under it says the page is
updated by us, so an open circle means we have not received it yet.

### The sections, in order

1. **Where things stand.** Five rows in the status pattern: the agreement,
   the build fee, monthly care, your content (N of M), live on the domain.
   The content row is the reason to open the page: it turns "we are waiting on
   you" into a number that goes up.
2. **What we need from you.** The client's homework, each item with *why*,
   ordered by what blocks what. Name, title and registered entity always
   first, because the agreement waits on them and nothing else does.
3. **What happens, in order.** Sequence, never scope. One link to Exhibit A.
   No dates until content is in.
4. **What we are doing anyway.** The proposal's free items, restated as a
   receipt. Omitted when there are none.
5. **Your stuff.** Plain links: the site, the owner tools, the agreement,
   Kevin. No buttons, no persuasion. A passcode or PIN is "sent separately";
   it never appears on a page.
6. **Try it yourself.** Optional; see section 6 below. Anchored `#try`.
7. **What the monthly actually is.** Three lines of service, because the
   monthly is the part clients forget they are buying.

Footer note: "Page kept since {since}. The numbers on it are the agreement's
numbers, read from the same place."

### What each light reads

| Row | Source | Who flips it |
|---|---|---|
| The agreement | `project.accepted` | Us, when the acceptance email lands |
| Build fee | Stripe, via `buildStatus(order)` (`buildFeePaid: true` overrides for invoiced clients) | Live |
| Monthly care | Stripe, via `monthlyStatus(order)` | Live |
| Your content | `contentProgress(order)` counting `needs[].done` | Us, one line per item |
| Live on the domain | `project.liveOnDomain` | Us, on cutover day |

Live truth where it exists, hand-kept where it cannot. A hand-kept light must
never claim more than we have actually received.

---

## 4. The rules

- **Never restate scope or numbers.** Scope lives once, in Exhibit A on
  `/agreement/{slug}`; this page links there. Two descriptions of one job drift,
  and the day they disagree the client quotes whichever helps them. (DeVine
  goes further: not one dollar figure on the page. The studio page shows the
  build fee and monthly as numbers in status rows, read from the registry, and
  that is the limit.)
- **We tick the boxes, not the client.** A client-editable list needs a
  login, and the honest state is what we have received, not what they believe
  they sent. Ticking is a one-line registry edit, in the same commit as the
  README checklist item it resolves.
- **No dates before content is in.** Content is the only real variable; a
  schedule published before it lands is a broken promise waiting for week two.
- **No price argument, no diagnosis of the old site.** Both jobs ended at
  yes; repeating them to a signed client is a small insult.
- **A client without a `project` block 404s.** An empty page with a client's
  name on it is worse than no page.
- **Every array is defaulted.** A registry typo must not 500 a page a client
  was sent a link to.
- **Bare URLs as link text must be able to break.** `.legal-wrap a` carries
  `overflow-wrap: anywhere`; a 35-character address pushed the page 19px wide
  at 320 on the first try-it list.

---

## 5. The registry block

```
project: {
  since: "YYYY-MM-DD",
  accepted: false,           // hand kept: the acceptance email is the record
  liveOnDomain: false,       // hand kept: flipped on cutover day
  needs:    [ { id, ask, why, done } ],     // their homework, OUR boxes to tick
  steps:    [ { title, detail } ],          // sequence, never scope
  freebies: [ { lead, text } ],             // what we do regardless (optional)
  links:    [ { label, href, note } ],      // their stuff
  tryIt:    [ { lead, text, href? } ],      // hands-on list (optional, section 6)
  monthlyIs: [ "...", "...", "..." ],       // service, not fee
}
```

On the same row, for the agreement page (not the build page):

```
figures: [ { src, width, height, alt, caption } ]   // real screens (optional, section 7)
```

### Where the "what we need" list comes from

`glaze/launch.md` copies the launch checklist into the client README. Half of
it is always things only the client can supply; those items, rewritten for the
client with a reason each, ARE section 2. Ordering rule: what unblocks what.
Typical shape, in order: name and entity; contact details and the inbox forms
land in; hours; anything the site prints as a placeholder; the accounts only
they can open (Stripe, Square, a domain login); the data only they hold (a
menu read-through, a customer export, a pricing spreadsheet); the recorded hour
for the about page; the domain, "not needed until launch week". PINs and
passcodes are told by phone, "spoken, never written down".

---

## 6. Try it yourself

For builds with owner tools or a payment flow, a numbered list of things the
prospect can do on the demo right now. Standard since Anchor (2026-09-10,
Kevin: "a test me section"). It lives on the build page, under Your stuff, so
the links it needs are already on the page, and the letter's "Want to test it
first?" line points at `#try`.

Rules:
- Every item is real and **leaves a trace they can find afterwards** in the
  owner tools (a lead in the queue, a payment recorded, a fact changed).
  Nothing is a video or a mock.
- One sentence of what to do, one of what they will see, and a link where
  there is one.
- Payments use the test card, named in the item (4242 4242 4242 4242), and say
  "no real charge" in those words.
- Never more than four or five items. It is an invitation, not a manual.

Anchor's four: walk a quote; pay a bill in test mode (and try autopay); tick an
add-on on that bill; change a fact and watch the site follow.

---

## 7. Real screens on the agreement

Optional `figures` on the registry row render a "What that looks like" block
between the scope and the price on `/agreement/{slug}`. Standard since Anchor
(Kevin: "just so they can see what we're talking about").

Rules:
- **Real renders of the build with sample data**, produced by the house
  harness at 2x, never mockups. Label the data as sample in the caption.
- Show the version the client is buying: a bill that pays on the site, not one
  that hands off to a carrier; an owner screen with a few fields filled, not a
  column of blanks.
- Hide local-only states before shooting (a memory-backend warning, a test-mode
  note), because the client never sees those.
- **A picture is never a term.** The scope text stays complete without it.
- Three is the right number: the owner tool, the customer's view, one more.
  Portrait shots are capped at 390px wide by the `tall` class.

---

## 8. Lifecycle

1. **Proposal sent.** The letter's Launch links point at the build page, which
   already exists, with every light off and every box open. The proposal is
   `pitchUrl` on the row so the mark can go back to it.
2. **Yes.** Accept on the agreement page; we flip `accepted`. The build fee
   lights itself.
3. **The six weeks.** Boxes get ticked as things arrive; the content count goes
   up; steps happen in order. The client opens this page instead of texting.
4. **Cutover.** The pitch folder is deleted (every pitch build's
   `next.config.ts` promises it); `pitchUrl` is re-pointed at the build page;
   `liveOnDomain` flips; the monthly starts from the agreement page.
5. **After launch.** Open question, unchanged since True North: keep the page
   as "your account" (the monthly, the links, how to ask for an edit), or let
   it retire like DeVine's plans to. Decide before the first client reaches it.

---

## 9. Setting up a new client, in order

1. Add the registry row: identity, numbers, `pitchUrl`, scope, `notIncluded`,
   the part-3 terms if the build has any, `figures` if there are screens.
2. Add the `project` block: `since` today, the needs list from the README
   checklist with a why each, the steps, the freebies from the letter, the
   links, `tryIt` if there are owner tools, `monthlyIs`.
3. Build the studio site and open both pages at 320, 390, 768 and 1440
   (`audit.mjs` and `width-check.mjs`). Zero violations, no overflow.
4. Put the four Launch links in the letter (section 1) and the plain links
   under the closing button. The agreement link goes to
   `glazedweb.com/agreement/{slug}`, never to a page in the client repo.
5. If the client repo ever had its own agreement or launch page, retire it to
   a 308 to the studio page; do not leave two homes.
6. Update `glaze/clients/{slug}.md` with the two URLs.

---

## 10. The ones that exist

| Client | Build page | Agreement | Divergences to reconcile |
|---|---|---|---|
| True North | studio `/build/truenorth` | studio | The reference. |
| Anchor | studio `/build/anchor` | studio | Adds `tryIt` and `figures`, now standard. Had an in-repo agreement for eight days; 308 now. |
| Copper | studio `/build/copperac` | studio | No freebies beyond two; no try-it list yet, though the workroom and tap board would carry one. |
| MI Gas | studio `/build/migas` | studio | No try-it list by design: the editor and the mail are both off until he supplies the PIN and the mailbox, so nothing on the demo leaves a findable trace yet. Letter's hero had no "see the site" button; one was added beside the ghost Launch. Had an in-repo agreement for seven days (Sept 3 to 10); 308 now. |
| Griffin Claw | studio `/build/griffinclaw` | studio | Two demos, so the hero's "see the site" button points at the letter's own Versions section rather than at one of them. No try-it list, same reason as MI Gas. First client whose domain was long enough to push the status rows wide at 320: `.agr-status` now breaks anywhere, alongside `.legal-wrap a`. |
| DeVine | client `/launch` in the devine repo | client host | Title "The launch plan."; six lights including "Square connected"; phases rather than steps; plans to retire at cutover rather than survive. Reads money via `api/build-status`. Align the title and the section names when next touched. |
| Chism | none | studio | Paid and live with no proposal; the client the page would serve best, and he does not have one. |
