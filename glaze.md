# glaze.md

**The Glazed Web front door.** Read this before touching a Glazed Web site, a
client repo, a pitch, or a proposal. It says who the studio is, what it sells,
what "done" means, and where to find the things it cannot say in prose.

Written for whoever is doing the work: Kevin, an AI session, or a contractor.
Everything before the appendix is true anywhere. The appendix is labelled as
sandbox-only.

Last revised August 2026. **If this file disagrees with the code, the code is
right.** Fix the file.

---

## Read these, in this order

This file is deliberately not the whole system. A colour described in prose gets
approximated; a colour written as `#E84D8A` gets used. So the things that have to
be exact live in their own files, next door, and the two scripts the rules depend
on live here too rather than somewhere a fresh session cannot reach.

**Attaching the `glazedweb` repo loads all of it.** If you only have this file
pasted into a chat with no repo, say so, because half the rules below point at
something you cannot open.

| File | Read it when |
|---|---|
| **glaze.md** (this) | Always, first. Who we are, the bar, the process, the traps. |
| **glaze/brand.md** | Any time the studio's own mark, palette, type or footer credit is involved. Has the hexes, the file paths, the mark's real painted bounds. |
| **glaze/link-cards.md** | Before anything gets pasted into a text or posted anywhere. The OG spec, the proposal card versus the demo card, and the platform traps. |
| **glaze/proposal.md** | Any pitch to a prospect. The six-section structure, the sample to lift verbatim, the host split. |
| **glaze/intake.md** | At the start of every client build, and any time you are about to guess a fact about their business. |
| **glaze/launch.md** | The full definition of done, the zero-to-live order, and the checklist you copy into their README. |
| **glaze/clients/** | One file per client. Durable facts only, no live state. Read the relevant one before touching that repo. |
| **glaze/standards.md** | Account-wide rules earned in client builds that no other file carries, and the open rulings awaiting Kevin. Read it before re-litigating the JS budget or the spec-build credit line. |
| **glaze/catalog/** | Before building any tool, harness, form flow, checkout, auth scheme, admin surface or asset pipeline. The inventory of bones the account already owns, categorized; the same file when you finish building one, because the entry ships in the same commit. |
| **glaze/starting-a-session.md** | Not for the session, for Kevin. The opening message to paste into a new Cowork chat, and why attaching the repos beats pasting a token. |
| **glaze/scripts/** | The house harnesses. `audit.mjs` is the standing auditor, `plate.mjs` computes the credit plate, `width-check.mjs` covers 320 and 768, `motion-check.mjs` samples transient overflow and verifies reduced motion actually stops everything, `perf-check.mjs` measures LCP, CLS and JS weight on a throttled mobile profile. Run these rather than writing fresh ones; each has been sharpened by a real failure. |
| **glaze/assets/glazed-credit/** | The credit components, `.tsx` and `.jsx`, plus their CSS. Copy, never rebuild. |

---

## The first ninety seconds of any session

**Do not trust this document for anything that changes.** Derive it:

```bash
git remote -v                       # which repo am I actually in
git merge-base HEAD origin/main     # empty means unrelated histories, STOP
cat package.json                    # Next version, Tailwind 3 or 4, scripts
cat .env.example                    # what this build needs, authoritatively
grep -rn PLACEHOLDER app lib components
```

Then check Vercel for the project's deployment state and its domains, and read
`glaze/clients/<client>.md`.

Repos are deliberately not unified on one version, so **check `package.json`
before assuming anything**, including whether Tailwind is 3.x
(`tailwind.config.js`, `theme.extend`) or 4.x (CSS-first `@theme`).

---

## 1. Who we are

Glazed Web is a one-person website studio in Marshall, Michigan, run by Kevin
Hershock. Hand-built sites for small local businesses: a sports bar, a poultry
farm, a bakery, a brewery, a food truck, a barbershop, a cannabis cultivation
consultant, a caterer, a nonprofit.

No templates. No page builders. No plugin stacks. Every site is written.

The pitch is "order it like a donut: pick a flavor, we bake it fresh, it ships
glazed." That last word is the standard, not the branding. A site is not done when
it renders. It is done when it has been checked in a real browser, measured rather
than eyeballed, and handed over with a README that tells the next person why it is
built the way it is.

### The three things that make this different from a template shop

1. **The client owns it.** Code, content, accounts, domain. Not licensed, owned.
2. **Nothing in the site costs the client a subscription they did not choose.** If
   a feature can be written instead of rented, it gets written.
3. **The work is measured.** Contrast is computed, not judged. Motion is sampled
   frame by frame. Copy is counted. Claims are checked before they are made.

Those three are also the sales argument, which means breaking one of them costs
more than the work it saves.

---

## 2. What we sell, and on what terms

| | Build | Monthly | What it is |
|---|---|---|---|
| **The Original** | $750 (market $1,500) | $99 | One sharp page. Contact form, map, hours. Live in two weeks. |
| **The Baker's Dozen** | $2,000 (market $3,900) | $150 | Up to six pages. Online ordering or booking built in. SEO foundations plus a Google Business tune-up. |
| **Custom Order** | Quoted | Scoped to fit | Stores, membership, web apps, rebrands. |

Real quotes on file, for range: Chism Chicken Ranch at $500 plus $50 a month (an
early friend price that predates the menu), Cascarelli's of Homer at roughly
$1,500 plus $100.

**The monthly covers hosting, security patching, updates, and small content
edits.** It is not a license fee and it is not rent on the site. It buys care.

### Ownership, stated the way the client hears it

Once the build fee is paid in full, the client owns the code, the content and the
accounts, and gets the repo, the hosting project and the logins handed over. The
domain is registered in their name and transferred free whenever they ask. Month
to month after launch, thirty days' notice, no early termination penalty. They can
leave at any time and take everything.

This supersedes an earlier unsigned draft in which Glazed Web retained ownership
of the website with a $1,000 client buyout. **That model is retired.** If a copy
turns up in a folder somewhere, it is the dangerous one, because it contradicts
the promise made on the live site.

### The agreement

**glazedweb Client Agreement v1.1** (v1.0 until September 2, 2026), in three places that must change together:

1. `contracts/Glazed_Web_Client_Agreement_v1.1.docx`, the master, generated by
   `contracts/build-agreement.js`. **Edit the generator, not the .docx**, or the
   next build silently reverts you.
2. `glazedweb.com/agreement`, the web mirror. What menu-order clients accept.
3. `public/glazed-web-agreement-v1-1.pdf`, the download linked from that page
   (the v1.0 PDF stays published for the orders accepted under it).

**If the terms change, the version goes up in all three.** Punctuation is not the
terms; there is a precedent for a typographic revision that deliberately did not
move the number, and the reasoning is in `contracts/README.md`.

**How a client agrees.** Menu orders: no document changes hands. They read
`/agreement`, tick the unchecked box on `/order`, and the order email records the
agreement version and an acceptance timestamp. That is a formed agreement under
ESIGN/UETA. Custom Orders: fill the bracketed fields, complete Exhibit A with
scope and pricing, export to PDF, send through an e-signature service. Or, since
2026-09-03, give the client their own page: an entry in `lib/customOrders.js`
renders `glazedweb.com/agreement/{slug}` with Exhibit A in plain English, where
things stand (build fee paid, monthly plan running, read live from Stripe), a
button that starts the monthly fee as a subscription on glazedweb's own Stripe
(`/api/pay/{slug}`), and the same clickwrap acceptance emailed to both parties
(`/api/agreement`). The Stripe webhook (`/api/stripe/webhook`) emails Kevin when
a plan starts, a charge fails, or a plan ends. Needs `STRIPE_SECRET_KEY` and
`STRIPE_WEBHOOK_SECRET` in Vercel; without them the page says the card link is
not switched on yet. The paper draft in `contracts-private` carries its own
copy of every number, so a change is two edits in one commit.

Not legal advice. Worth an hour with a Michigan attorney before real money runs
through it.

Offboarding is a six-step runbook in `glaze/launch.md`. Written down it is a
selling point; unwritten it is an obligation nobody can execute under pressure.

---

## 3. What done means

**The full list is in `glaze/launch.md`, and it is one list, not a vibe.** Copy it
into the client's README as unchecked boxes and work it to zero.

The headline numbers, so they are in front of you without a second file open:

- **Zero** accessibility violations at 390px and 1440px on every route. WCAG 2.1 AA.
- **Zero** console errors, **zero** 4xx.
- Checked at **320, 390, 768 and 1440**. 320 is the one that breaks.
- LCP under **2.5s**, CLS under **0.1**, total JavaScript under **150KB** compressed.
- Every route has **its own** title and meta description.
- Every form **actually submitted** and confirmed arriving in a real inbox.
- Reduced motion produces a **complete** page. JavaScript off still submits and navigates.

---

## 4. The quality bar

Rules first. The story that produced each rule is indented underneath, because the
rule is what you need and the story is what makes you believe it.

### Lift the real thing. Do not approximate it.

**If the real asset exists, use the real asset.** A client's mark, palette,
stylesheet or animation that already exists gets taken, not redrawn. Search the
client's repo and site before drawing anything. If you must diverge, say so and
say why, in a comment next to the divergence.

> The worst instance was not a client's mark, it was Kevin's own. The studio credit
> shipped to four live footers with a donut drawn from scratch while the real
> `<symbol id="mark">` sat in glazedweb's `components/Logo.jsx` the whole time.
> Kevin caught it: *"it's not MY donut. Did you actually rebuild using source code
> or just guess?"* Three true-sounding constraints produced it, and every one had a
> fix that touched no geometry.

The four techniques that make lifting practical, plus the mark's real painted
bounds, are in `glaze/brand.md`.

### Facts live in one place

**Every business fact goes in one constant file** (`lib/site.*`), so a correction
is one edit. **Any surface that cannot read from it gets named in the README.**

> Copper's TV count was published wrong three times because it was typed into six
> separate pieces of copy. Worse, the retired "0 treadmills" line survived on the
> portfolio card in *this* repo for a while after Copper's own site had dropped it.
> You cannot grep a JPEG, and you will not remember another repo.

### Placeholder data on a live site is a live problem

**Mark it `PLACEHOLDER` in the code, put it on the README checklist, and say it
out loud at handover.** Silence about a placeholder reads as "this number is real."

> Sprinkles served invented prices to real customers because a placeholder was
> left in a constant and nobody said so.

**A guess written as a plain value is worse than a blank.** If you do not know
it, mark it `PLACEHOLDER` even when the guess feels safe, because the next
person cannot tell your assumption from a confirmed fact.

> An agency's whole site said the wrong town for a full build. `city` was the one
> field in the contact block written as a bare string while every neighbour was a
> marked placeholder, so it read as checked. It reached page titles, the hero,
> the structured data, the link card image and four local guides.

### Accessibility is measured, not intended

**Run `glaze/scripts/audit.mjs`. Zero violations at both widths on every route.** Fix contrast at
the token or the class, **never on the one element that got flagged.**

> glazedweb.com itself carried 62 violations. The auditor named the wordmark; the
> actual fault was a palette token used by eleven separate pieces of small text.
> Hidden underneath it: a footer link at **1.09**, near-black on near-black, in the
> DOM, clickable and invisible, on the two pages a paying client uses. And the
> clickwrap link a client taps to read the terms they are about to accept measured
> 3.58. A fix applied to the flagged element would have shipped all of that again.

### Motion has three requirements

1. **The un-animated state is the finished state.** Hide things with a class that
   JavaScript adds, so a blocked script or reduced motion leaves a complete page
   rather than an empty one.
2. **Reduced motion must degrade to something, and you have to look at it.** Not
   `animation: none` and hope.
3. **Check the curve, not just the duration.** An easing that spends 90% of its
   travel in the first half and then creeps is the pop-then-creep trap.

Beyond that: the best effect is usually the client's own brand doing something,
not a generic reveal. Scroll-scrubbed beats autoplay because the visitor controls
it, except where the effect has more discrete steps than the scroll has pixels to
spend on them -- see the counter entry in the failure log. And desynchronisation
matters more than amplitude. Three things arriving on schedules roughly 150 to
300ms apart reads as weather; three arriving together reads as a slide
transition.

### Copy is counted, not vibed

**Count your own repetitions before shipping.** Read the rendered text, not the
source. If a phrase appears more than twice on one page it is a tic, not a theme.

> One draft used pasture or grass six times and Michigan six times on a single
> page. Another restated the site's main promise three times, in worse grammar
> each time.

**House voice.** Warm and normal. Say plainly what a thing is rather than naming
it cleverly: "menu", "sunday brunch", not a themed label. Cut copy about the site
or the business itself. **No em dashes**, use a period or a comma. **American
spelling**, always: color, license, program, standardizing, toward, catalog.

Watch two habits. **Antithesis**, the "X, not Y" verdict, works rationed: twice on
a site is a style, five times is a tic. And **explaining the cards before the
reader reaches them**: if a section's items each carry their own plain summary, an
introductory paragraph restating them in a cleverer register is doing worse the job
the items already do. Cut it.

### Don't rent what the site can own

**No third-party service in a client site that anybody has to pay a subscription
for.** It is not only the bill. "You own everything" is the pitch, and a
subscription the client did not choose and cannot maintain undercuts it.

Most of what these sites would rent is a small amount of code. A scheduler is a
slot list. A calendar invite is a text format from 1998 and about eighty lines. An
upload store is an email attachment. Web fonts are free if you download them at
build time, which `next/font/google` does: it self-hosts from the site's own
origin, so that is compliant. A runtime `<link>` to a font CDN is not.

The bar for a paid dependency: **the alternative is genuinely hard or genuinely
regulated, and the client hears the cost before it is added.** Taking a card is
the real exception, so Stripe and Square are allowed.

Availability is the one that bites: a hand-written slot list does not know what is
already booked, so say that plainly and leave a named seam for a calendar feed
rather than implying it is solved.

> Four repos predate this rule and still expect a `RESEND_API_KEY`. That is
> backlog, not permission.

### Write the reasoning next to the thing

**Every non-obvious decision gets a comment or a README section saying why,
including what was tried and rejected.** The code is readable and the reasoning is
not recoverable. This is why these repos have long comments, and it is deliberate.

**Record retractions as retractions.** A rule that was wrong is worth keeping with
the reasoning that produced it, because that is what stops the next person
re-deriving it. Every client file has a **Retired** section for exactly this.

### Being straight

Never report something as done without checking it. When you are wrong, say so and
say what the actual state is. Do not send the client to fix a fault you have not
localized: Kevin was once sent to re-save GitHub settings for a fault that did not
exist.

**When a thing appears N times, check all N.** A fix verified on one instance is
unverified. This applies to repos, to a component rendered twice on a page, to
footers across two layouts, and to routes.

### Do not argue the other guy's case in our own pitch

Being straight is a rule about facts. It is not a license to hedge our work in
a client's document, and the two get confused constantly, because the hedge
sounds like the virtue.

A price note on the Insurance for a Cause proposal read: *"In fairness to them,
theirs is a themed WordPress site rather than twenty-one written pages and three
tools, so the comparison flatters us on what you get. It does not flatter us on
what you keep."* Kevin's response was to delete it, and he was right. It is two
sentences of a competitor's defense sitting in the middle of our price, written
by us, unprompted, in a document whose job is to be stood behind.

**The test is who pays for the silence.**

- If leaving it out costs the client money, time or a bad surprise, say it.
  *"Getting your first twenty reviews will probably do more for you than half of
  this website will"* costs us the sale and saves her the disappointment. That
  is the house voice and it stays.
- If leaving it out costs only our own comfort, cut it. Pre-emptively softening
  a comparison, apologizing for a number that is already sourced, or
  volunteering the counter-argument nobody raised is not honesty. It is
  flinching, and the client can hear it.

A figure with a link under it needs no apology. It is already checkable, which
is the entire point of putting it there. If a comparison genuinely cannot be
defended without a caveat, **the comparison is the thing to change**, not to
annotate.

Related and different: **do not tell a client something unflattering about their
own idea unless they can act on it.** That is settled elsewhere, in the Insurance
for a Cause file, and it was settled the same way.

---

## 5. The process

Four engagement shapes. Say which one you think you are in if it is ambiguous,
rather than doing four times the work the client wanted or a quarter of it.

### Scout

"Look at it and tell me what you'd do." Audit the live site, report what is
actually wrong. **No building.** In the order that finds the most:

1. **Search and sharing.** Titles, meta descriptions, Open Graph, structured data,
   sitemap, robots. Most often broken, cheapest to fix, most persuasive opening.
2. **Usability, on a phone.** Is the phone number a `tel:` link? Is there an email
   at all? Is there a call to action above the fold, or a full screen of uncropped
   photo?
3. **Brand consistency.** Sub-pages on a different palette, a second button style,
   a plugin's default form styling, a logo in the wrong colour.
4. **Content.** Typos, prices formatted as `12.00`, missing consumer advisories,
   contradictions between the site and their ordering system.
5. **Performance.** Image weights and formats, script and stylesheet counts.
   Concrete numbers land.
6. **Security.** HTTPS enforced? A certificate that does not match the host, or a
   redirect down to HTTP, marks the site "Not secure" in every visitor's browser.
   Verifiable in one click, which makes it a strong opening claim.
7. **Accessibility.** Run the auditor against the live site.

**Every finding links to the page that proves it.** Anything unprovable gets named
as unverifiable rather than dropped silently.

### Pitch

See `glaze/proposal.md` for the whole thing: the six sections, the file to lift
verbatim, the host split and its `beforeFiles` rewrites, and the two link cards.

### Build

Full rebuild. Start with `glaze/intake.md`, because the parts most often
underestimated are all facts you do not have yet.

- **Forms need a real destination and a confirmed inbox.** Two separate things.
  Until both exist, the honest behaviour is a `mailto:` handoff with every field
  prefilled, or for a long form, accept the submission, tell the visitor the truth,
  and write the whole payload to the log so nothing is lost. What is not acceptable
  is a stub that waits half a second and says "Thanks, we got it" while sending
  nowhere.
- **Mail is SMTP through a mailbox the client already owns**, not a hosted API.
  Where the client has no mailbox, send from a `glazedweb.com` address with
  `replyTo` set to the customer, so client DNS work is never on the critical path.
  When mail is unconfigured the form must still succeed for the visitor and log the
  full payload. A form that reports "something went wrong" because of an unset
  variable teaches people the form is broken. The delivery is what is missing, and
  that is the operator's problem to see in the log.
- **Nothing paid gets added without the client hearing the cost.**
- **A before-launch checklist in the README**, with every placeholder and
  unconfirmed fact on it as an unchecked box.
- **The studio credit goes on before launch**, not as an afterthought.

### Polish

A site already stands. Bring the mark alive, measure the details, sweep
accessibility and performance.

### Handover

The README is the deliverable, not a courtesy. It should let someone who has never
seen the repo change the thing they came to change without breaking something
else: what the project is and how to run it, where content lives and which
surfaces cannot read from it, every trap named as "this will break if you do not
know", decisions with their reasoning including what was rejected, and the
checklist.

---

## 6. Stack

**Defaults.** Next.js App Router, TypeScript where the repo allows it, Tailwind,
deployed on Vercel from a GitHub repo under `hershock48`. Fonts self-hosted at
build time. **Audit the production build, never the dev server**; dev serves
different CSS and hides build-time failures.

**Secrets are set in the Vercel dashboard by Kevin.** Never ask for a paste, never
write one into a file. `.env.example` in each repo is the authority. If a feature
is gated on a missing key, say which key and stop.

**Payments.** Stripe or Square hosted checkout. Note that Stripe's published
restricted-business list prohibits courses and information on cultivating
marijuana. Do not put a Venmo button in a footer; it has nothing to pay for.

**Ordering integrations.** Toast sends `x-frame-options: SAMEORIGIN`, so on-page
ordering is impossible. The on-brand answer is Ordering Pro on `order.<client>.com`
so the URL stays theirs. Always link the canonical ordering URL, never a legacy
link that 301s.

Zero to live, in order, is in `glaze/launch.md`.

---

## 7. Verifying: how to know before you say

Every embarrassing moment on this account has been an outbound claim rather than a
broken build.

### Before you write down a finding about a live site

1. Open the rendered page in a real browser if you can reach it. **Check whether
   you can, this session, rather than assuming.** If you cannot, say so in the
   report.
2. Tag every finding: **M** if markup alone proves it, **R** if it needs a render.
3. Every M finding carries the URL or the line that proves it.
4. No R finding ships without being labelled unverified.

Markup alone is enough for: title tags, meta and Open Graph, structured data,
sitemap, robots, HTTP headers, certificate validity, script and stylesheet counts,
image formats and weights. Markup is **not** enough for anything JavaScript
injects, anything that depends on layout, or any class-based styling claim, because
a fetch strips class names.

> A confident, twice-repeated claim that a homepage had no Facebook embed. A
> Facebook plugin and a Yelp waitlist both sat at the foot of it, injected client
> side. Kevin found them on his phone.

### Before you say a build is done

0. Prerequisites: production build not dev, no stale server on the port, correct
   repo confirmed with `git remote -v`.
1. Work `glaze/launch.md` top to bottom. Every box.
2. **A green build proves syntax and types and nothing else.** Not which repo, not
   which data, not what rendered.

> A news filter was 75% wrong in production while the local build reported
> compiled successfully, types clean, failure path verified. The data source was
> unreachable from the development machine and the code degraded silently. When a
> data source is unreachable from where you develop, the deployment is the test
> environment.

### Before you say a fix is deployed

Four steps in `glaze/launch.md`. Step 4, fetching the deployed URL and confirming
the change is in the response, is the one people skip and the only one that proves
the visitor sees it.

### When re-checking your own work against a request

Open the original message. Number each request 1 to n. Against each, name the file
and line that satisfies it. Any request you cannot point at a line for is not done.

### Sanity-checking a measurement

A number too large to be plausible is evidence of a broken environment, not a
broken layout. A 1834px overflow on a page that was clean a minute ago means the
harness is wrong. **Check the harness before you check the code**, and never report
a measurement you cannot explain.

> A hit-test harness once reported all 149 links and buttons on a site as
> unclickable. `elementFromPoint` returns null outside the viewport, and
> `scroll-behavior: smooth` meant `scrollIntoView` had not finished. A harness that
> reports everything broken is telling you about itself.

---

## 8. The failure log

Each of these has cost real hours. They are not exotic. They are what a competent
session does by default, which is why they need naming.

### Git and deploys

- **A remote that is not GitHub.** Cloning from a bundle leaves `origin` as a local
  path, and `git push origin` reports success having written to disk. Four commits
  went missing that way. `git remote -v` before the first push in any working copy.
- **Unrelated histories.** Empty `merge-base` means stop. `--force` would replace
  the client's whole site. Fix with `git merge --allow-unrelated-histories`.
- **Never `git config http.extraHeader`.** It writes the token into `.git/config`
  where it can be committed. Pass it per command with `-c`, and pipe output through
  `sed` to redact, because git leaks the header on failure.
- **A stale local server is the most misleading failure available.** It serves a
  build you deleted, or a different repo entirely, and manufactures audit results
  for code that is fine. Kill by PID and **confirm the port is free** before
  starting.

### Browsers and screenshots

- **`scroll-behavior: smooth` breaks harnesses.** Disable it in the harness.
- **Judge at true size.** Elements calibrated at one render size look wrong at the
  size they ship at.
- **Headless WebKit is not iOS Safari.** Different compositing path; it has
  rendered correctly where a real iPhone showed a grey square.

### CSS

- **Plain CSS after `@tailwind utilities` beats utilities**, and `position` is the
  nastiest case. A rule setting `position: relative` beat an `absolute` utility, so
  the element laid itself out in the flow and silently ignored every offset.
- **Duplicate selectors and split grouped rules are silent.** Inserting a comment
  between two selectors in a grouped rule deletes the shared declaration from the
  second one. That made two elements 0 by 0.
- **An `opacity: 0` element still receives clicks.** An invisible overlay is a dead
  button with no visible cause.
- **A reveal-on-scroll system in a root layout must re-arm on navigation.** Queried
  once on mount, it hides the next page's elements forever, so every internal link
  lands on a blank page while the URL and the nav highlight both change correctly.
  **A navigation test that does not assert visibility is not a navigation test.**
- **A generic element selector can style a class you thought was independent.**
  `footer { background: dark }` painted a footer whose own class set light-ground
  text colours, producing a 1.09 link.
- **An animated element wider than about 4096px stops being composited on
  mobile.** Mobile GPUs cap a layer's texture, commonly at 4096 and on older
  devices 2048, and past it iOS Safari can decline to run the animation at all.
  Two marquee rails measuring 4,510px and 11,488px animated perfectly in every
  desktop browser and sat dead still on a phone. **Measure the track, treat its
  width as a budget, and say so next to the content that spends it.**
- **A rotation's apparent movement scales with the element's size.** The same
  2.6 degrees that reads as a gentle sway on a 300px mark is a third of the
  travel at 180px and reads as static. Responsive artwork needs responsive
  amplitude, and the thing to measure is pixels travelled, not degrees.
- **A colour token validated against one ground is not validated.** Two tokens
  passed on the page colour and failed on the second, quieter band that was
  added later. Check every token against **every** ground it can land on.
- **A bare text node can overflow the document and no element rect will show
  it.** A 38-character email address in plain body text pushed the devine
  letter's scrollWidth to 323 at 320, while every `getBoundingClientRect` sweep
  read clean: the paragraph's border box stayed at its laid-out width and the
  overflowing line belonged to a text node, which is not an element. It read as
  a transient animation bug for exactly that reason. Attribute this class of
  overflow by bisection, hiding subtrees while watching `scrollWidth`, not by
  scanning rects; fix it with `overflow-wrap: break-word` at the body level,
  which fires only when a single token cannot fit its line.
- **A scroll-scrubbed counter needs pixels per step, and a short element has
  none to give.** Schuler's rolled 1909 to 2026 across `cover 34%` to `74%`.
  The number is only 57.6px tall at 390px wide, so `cover` is barely one
  viewport -- 902px, of which the band is 361px. That is 3.08px of scroll per
  year. A normal flick, ~900px in 450ms decelerating, crosses the whole band in
  about seven frames, so the count rendered EIGHT of its 117 values and lurched
  in twenty-year jumps. It read correctly on a desktop wheel the entire time,
  which is why it shipped. **Before scrubbing anything with discrete states,
  divide the band's pixels by the number of states. Under roughly 8px per step
  a thumb skips most of them.** A leader drawing or a fade has no steps to skip
  and degrades into "less far along"; a counter degrades into a stutter. Make
  the counter time-based — but a fired-once timer is the OTHER half of the
  same bug: measured on a phone profile it ran its whole duration with the
  element off screen, zero mid-count values visible. Scrubbing at least
  guarantees the element is in frame while it animates; keep that guarantee
  by gating the clock on visibility, so elapsed time only accumulates while
  the element is on screen. And print the value as text from the loop, not
  as `counter()` over an animated custom property — WebKit does not reliably
  repaint that, and the number sat frozen on every iPhone while every
  desktop check passed. `Schulers/components/YearCount.jsx` is the surviving
  version and its header carries all three failures.

### SVG and images

- **State `width` and `height` on every SVG**, derived from the viewBox. A viewBox
  alone gives an aspect ratio but no intrinsic size, and Safari can fall back to a
  150px default.
- **A component that can render twice cannot own a fixed `id`.** Two instances
  sharing a gradient id is undefined behaviour and has painted a dark square.
- **`mix-blend-mode` inside an isolated stacking context costs a tiled backdrop
  read-back.** A tile that resolves differently from its neighbours prints as a
  visible square. It is also the largest performance cost on an animated element.
- **`filter: blur()` does not soften fine structure, it erases it.**
- **Trace at 8x with a slight blur, and pick the threshold by rendering candidates
  and diffing**, because a solid shape at full ink has to be narrower than an
  anti-aliased one to carry the same visual weight.

### Forms and Next.js

- **A `"use server"` file can only export async functions.**
- **Serverless request bodies cap out well under a phone photo.** Downscale in the
  browser before submitting, write the smaller files back to the input so the no-JS
  path still works, and make every failure path return the original.
- **A hidden submit button is still the form's default button.** Enter submits from
  any step of a wizard unless the button is disabled.
- **Route caching and time do not mix.** A page whose content depends on the
  current date cannot be statically generated or revalidated on a timer.
  Regeneration is request-triggered, so on a quiet site the cached page ages
  indefinitely. Render it per request.
- **`new Date()` in a statically generated page freezes at build time.** It printed
  "taking orders for 2027" on a page selling birds for October 2026, and it will
  freeze a copyright year too.
- **Next.js does not deep-merge `openGraph`.** A page defining its own replaces the
  parent's wholesale, image included.
- **A `301` may turn a POST into a GET.** Exclude `/api` from any catch-all
  redirect, or use `308`, which preserves the method.
- **Anything the server renders open and the client collapses is a layout
  shift.** A mobile menu rendered expanded, so it would work with JavaScript
  off, then collapsed on hydration, shipped a header 365px taller than it ends
  up and threw the page upward. **CLS 0.3947 against a 0.1 bar, and only on a
  throttled connection.** A native `<details>` is collapsed in the server's HTML
  *and* opens without JavaScript, which is both problems solved and less code.
- **On a pitch host, `/` is the proposal, not the site.** Every other path is
  served normally, so a root-relative link is fine everywhere except the one
  that points at `/`. A logo linking home therefore throws the client out of
  their own demo and back into the sales document. Resolve it from the hostname
  and keep that pattern in sync with the rewrite's.
- **A dashboard build setting survives deleting the file that created it.** A
  repo that began as a static pitch with `"outputDirectory": "public"` kept
  serving `public/` as a flat directory after it became a Next app: `next build`
  ran, reported success, and every route needing the framework returned Vercel's
  own `NOT_FOUND`. `vercel.json` takes precedence over project settings and is
  how you clear it from the repo.

### Scripted edits

**Assert before you write.** Every replacement asserts its target matched exactly
once, and the write happens at the end, after every assertion has passed. A
scripted edit that silently no-ops and then prints "done" is how a change gets
reported as made twice without existing. Do not put a stale-check after the edits
and before the write, or a failed check discards work already done in memory.

---

## Appendix: things true only of one sandbox

Everything above is portable. These are artifacts of the AI sandbox this document
grew up in, and several are actively wrong on a Mac.

- **Outbound HTTPS.** An earlier version of this document stated flatly that the
  browser had no outbound HTTPS and built the whole audit discipline on it. That
  was true once and is not now, and in some sandboxes a headless browser can reach
  Vercel-hosted URLs through an MCP tool while a direct connection is refused.
  **Test it at the start of a session** and say in the report which it was.
- **Chromium path.** Some sandboxes pin Chromium at `/opt/pw-browsers/chromium`
  with downloads disabled. On a Mac you must run `npx playwright install chromium`.
  Resolve the executable from an environment variable with a fallback.
- **Playwright may resolve from a global path**, not the project's `node_modules`,
  and may be CommonJS, so a bare `import { chromium } from "playwright"` fails
  twice over.
- **Git authentication.** In a sandbox with a git proxy, a 403 on push is usually
  authorization rather than credentials, the authorized repo set is fixed at task
  start, and `gh auth login`, credential helpers and tokens in the URL all fail. On
  a normal machine `gh auth login` is the correct answer.
- **`gh` and the GitHub API** may be unavailable or blocked. They are the right
  tools everywhere else.
- **`pip install --break-system-packages`** is a sandbox workaround. On macOS use a
  virtual environment or `pipx`.
- **`apt-get install potrace`** is Linux. On a Mac it is `brew install potrace`.
- **`df` and the working directory.** Disk may be a fixed per-session allowance,
  and the working directory may reset between commands. Use absolute paths, which
  is good practice anywhere.
- **Frame-time numbers** in the failure log came from a software renderer with no
  GPU. Treat the absolute figures as pessimistic; the attribution holds.

---

## Standing cautions

**Never put a credential in a file, a commit, a README, or any document in this
system.** If you notice one: stop, say so, recommend rotating it, and do not quote
it again.

**If this document disagrees with the code, the code is right.** Fix the document.
