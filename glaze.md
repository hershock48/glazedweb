# glaze.md

**The Glazed Web operating document.** Read this before touching a Glazed Web site,
a client repo, a pitch, or a proposal. It is the front door: who the studio is, what
it sells, what "done" means, and the traps that have already cost real hours.

Written for whoever is doing the work, whether that is Kevin, an AI session, or a
contractor. Where something is true only of one particular machine or sandbox, it is
in the appendix at the end and labeled as such. Everything before the appendix is
true anywhere.

Last revised August 2026. Dated claims carry their date. If a number here disagrees
with the code, the code wins and this file is wrong.

---

## 1. Who we are

Glazed Web is a one-person website studio in Marshall, Michigan, run by Kevin
Hershock. Hand-built sites for small local businesses: a sports bar, a poultry farm,
a bakery, a brewery, a food truck, a cannabis cultivation consultant.

No templates. No page builders. No plugin stacks. Every site is written.

The pitch is "order it like a donut: pick a flavor, we bake it fresh, it ships
glazed." That last word is the standard, not the branding. A site is not done when it
renders. It is done when it has been checked in a real browser, measured rather than
eyeballed, and handed over with a README that tells the next person why it is built
the way it is.

### The three things that make this different from a template shop

1. **The client owns it.** Code, content, accounts, domain. Not licensed, owned.
2. **Nothing in the site costs the client a subscription they did not choose.** If a
   feature can be written instead of rented, it gets written.
3. **The work is measured.** Contrast is computed, not judged. Motion is sampled
   frame by frame. Copy is counted. Claims are checked before they are made.

Those three are also the sales argument, which means breaking one of them costs more
than the work it saves.

---

## 2. What we sell, and on what terms

This is the half most easily forgotten, and it belongs at the front because it
governs decisions further down. Three flavors on the menu, plus custom work.

| | Build | Monthly | What it is |
|---|---|---|---|
| **The Original** | $750 (market $1,500) | $59 | One sharp page. Contact form, map, hours. Live in two weeks. |
| **The Baker's Dozen** | $1,900 (market $3,900) | $99 | Up to six pages. Booking, menus, or light e-commerce, one of them. SEO foundations plus a Google Business tune-up. |
| **Custom Order** | Quoted | Scoped to fit | Stores, membership, web apps, rebrands. |

Real quotes on file, for range: Chism Chicken Ranch at $500 plus $50 a month (an
early friend price that predates the menu), Cascarelli's of Homer at roughly $1,500
plus $100.

**The monthly covers hosting, security patching, updates, and small content edits.**
It is not a license fee and it is not rent on the site. It buys care.

### Ownership, stated the way the client hears it

Once the build fee is paid in full, the client owns the code, the content, and the
accounts, and gets the repo, the hosting project, and the logins handed over. The
domain is registered in their name and transferred free whenever they ask. Month to
month after launch, thirty days' notice, no early termination penalty. They can leave
at any time and take everything.

This supersedes an earlier unsigned draft in which Glazed Web retained ownership of
the website with a $1,000 client buyout. That model is retired. If a copy of it turns
up in a folder somewhere, it is the dangerous one, because it contradicts the promise
made on the live site.

### The agreement

**Glazed Web Client Agreement v1.0.** It lives in three places that must change
together, and the version number goes up in all three:

1. `contracts/Glazed_Web_Client_Agreement_v1.docx` in the `glazedweb` repo. The
   master text, and the paper that gets signed for Custom Orders.
2. `glazedweb.com/agreement`, the web mirror. This is what menu-order clients
   actually accept.
3. `public/glazed-web-agreement-v1.pdf`, the downloadable copy linked from that page.

Drift between the page and the paper is the exact problem v1.0 was written to fix.

**How a client agrees.** Menu orders: no document changes hands. They read
`/agreement`, tick the unchecked box on `/order`, and the order email records the
agreement version and an acceptance timestamp. That is a formed agreement under
ESIGN/UETA, the same mechanism as any software signup. Custom Orders: fill the
bracketed fields in the .docx, complete Exhibit A with scope and pricing, export to
PDF, send through an e-signature service.

The sections that set expectations are 1 (what we build, including two rounds of
design revisions and nothing added to the bill by surprise), 6 (what we need from
you, and the plain statement that projects stall on content more than anything else),
and 7 (what we promise and what we do not: careful work and uptime to the best of our
ability, no promises on rankings, traffic, or business results).

Not legal advice. Worth an hour with a Michigan attorney before real money runs
through it.

### Offboarding, because "leave anytime with everything" needs a procedure

Written down it is a selling point. Unwritten it is an obligation nobody can execute
under time pressure.

1. Transfer the GitHub repo to the client's account, or hand over a full clone.
2. Transfer the Vercel project, or disconnect it and let them import the repo.
3. Unlock and transfer the domain, and hand over DNS.
4. Hand over any Stripe or Square connection, and the sending mailbox if we set one up.
5. Remove the studio credit. It is one line.
6. Send the READMEs and the before-launch checklist state as-is.

---

## 3. What done means

One list. Everything else in this document exists to make these achievable. A build
is not done until every line is true, and none of them is a judgment call.

**Correctness**

- [ ] Zero accessibility violations from the auditor at 390px and 1440px on every route.
- [ ] Zero console errors, zero 4xx, on every route.
- [ ] `grep -rn PLACEHOLDER` returns nothing, or every hit is on the README checklist.
- [ ] Every form actually submitted, and the message confirmed arriving in a real inbox.
- [ ] Any remote data source verified on the deployment, not locally. See §7.
- [ ] Every heading, button and body run measured for contrast, not glanced at.

**The visitor's experience**

- [ ] Checked at 320, 390, 768 and 1440 wide. 320 is the one that breaks.
- [ ] Reduced motion produces a complete page, not an empty one.
- [ ] With JavaScript off, every form still submits and every nav link still works.
- [ ] Keyboard: focus visible on every interactive element, skip link first in tab order.
- [ ] Largest Contentful Paint under 2.5s and Cumulative Layout Shift under 0.1 on a
      throttled mobile profile. Total JavaScript under 150KB compressed.

**Search and sharing**

- [ ] Every route has its own title and meta description. No route inherits a generic one.
- [ ] `og:image` is an absolute URL on the origin that actually serves it, and it resolves.
- [ ] Canonical URL points at the client's real domain, never at a `.vercel.app` host.
- [ ] `LocalBusiness` structured data, with hours and address, on the homepage.
- [ ] `sitemap.xml` and `robots.txt` present, and the demo or preview host is `noindex`.

**Security and handover**

- [ ] HTTPS enforced, no redirect that drops to HTTP.
- [ ] `npm audit` reviewed, and any remaining advisory named in the README with a reason.
- [ ] No secret in the repo, in a commit, in a README, or in this file.
- [ ] Studio credit placed, plate ground computed, and the client told it is there.
- [ ] README written: what it is, how to run it, where content lives, every trap named,
      decisions with reasoning, and a before-launch checklist of unchecked boxes.

**Support target.** Current versions of Chrome, Safari, Firefox and Edge, plus iOS
Safari and Chrome on Android. Real iOS Safari behaves differently from a headless
WebKit and has produced bugs that no local check caught, so anything visually
unusual needs a real device before it ships.

**Accessibility target.** WCAG 2.1 AA, measured with the auditor. State it once,
here, so the target does not drift between files.

---

## 4. The quality bar

Rules first. The story that produced each rule is indented underneath, because the
rule is what you need and the story is what makes you believe it.

### Lift the real thing. Do not approximate it.

**If the real asset exists, use the real asset.** A client's mark, palette, stylesheet
or animation that already exists gets taken, not redrawn. Before drawing anything,
search the client's repo and site for it. If you must diverge, say so and say why, in
a comment next to the divergence.

> The worst instance on this account was not a client's mark, it was Kevin's own. The
> studio credit shipped to four live footers with a donut drawn from scratch while the
> real `<symbol id="mark">` sat in glazedweb's `components/Logo.jsx` the whole time.
> Kevin caught it: *"it's not MY donut. Did you actually rebuild using source code or
> just guess?"* Three true-sounding constraints produced it, and every one had a fix
> that touched no geometry. A redrawn logo sits next to the real type where the
> comparison is immediate, and every wobble reads as a mistake.

Four techniques that make lifting practical:

**Measure the ink, not the declared viewBox.** Pixel-scan a large render for the
painted bounds and crop to them. Glazed's mark declares `0 0 200 250` and paints
`x 48.00-151.75, y 18.00-199.75`, so 48% of the declared width is empty margin. At
26px that is the difference between a 12.5px disc and a 19.1px one. Note that
`getBBox()` ignores stroke width, so it is not a substitute for the scan.

**A hole should be a hole.** Express a disc and its hole as one path with
`fill-rule="evenodd"` rather than painting an opaque circle in the background color.
The background then shows through whatever it happens to be. Verify by pixel diff:
zero interior pixels should differ.

**Sample the palette out of the asset, do not guess it.** Isolate by channel
difference rather than brightness, and take both the brightest and the median value
per region. Brightness alone picks up highlights and reports a color the artwork does
not contain.

**When namespacing an SVG id, rewrite both ends.** `url(#x)` and `id="x"`. A
search-and-replace that catches one and not the other resolves every gradient to
nothing and renders invisible shapes.

### Facts live in one place

**Every business fact goes in one constant file** (`lib/site.ts`), so a correction is
one edit. Any surface that cannot read from it gets named in the README.

> Copper's TV count was published wrong three times because it was typed into six
> separate pieces of copy. The two surfaces that could not read a constant, a
> rendered image and another repo's portfolio card, are now named in the README so
> they get remembered. You cannot grep a JPEG.

### Placeholder data on a live site is a live problem

**Mark it `PLACEHOLDER` in the code, put it on the README checklist, and say it out
loud at handover.** Silence about a placeholder reads as "this number is real."

> Sprinkles served invented prices to real customers because a placeholder was left
> in a constant and nobody said so.

### Accessibility is measured, not intended

**Run the auditor. Zero violations at both widths on every route, or it is not done.**
Fix contrast at the class or token, not on the one element that got flagged, or the
same fault ships on the next page.

> A heading measured 2.48 against a 3:1 requirement because its color came from a
> section wrapper rather than from the heading's own rule.

### Motion has three requirements

1. **The un-animated state is the finished state.** Hide things with a class that
   JavaScript adds, so a blocked script or reduced motion leaves a complete page
   rather than an empty one. Someone who asked their machine to stop moving things
   should still get the picture.
2. **Reduced motion must degrade to something, and you have to look at it.** Not
   "animation: none" and hope.
3. **Check the curve, not just the duration.** An easing that spends 90% of its
   travel in the first half and then creeps is the pop-then-creep trap. Sample it
   frame by frame.

Beyond that: the best effect is usually the client's own brand doing something, not a
generic reveal. Scroll-scrubbed beats autoplay because the visitor controls it. And
desynchronization matters more than amplitude. Three things arriving on schedules
roughly 150 to 300ms apart reads as weather. Three arriving together reads as a slide
transition.

### Copy is counted, not vibed

**Count your own repetitions before shipping.** Read the rendered text, not the
source, and count the words you leaned on. If a phrase appears more than twice on one
page it is a tic, not a theme.

> One draft used pasture or grass six times and Michigan six times on a single page.
> Another restated the site's main promise three times, once in the hero and again in
> the closing band, in worse grammar the second time.

**House voice.** Warm and normal. Say plainly what a thing is rather than naming it
cleverly: "menu," "sunday brunch," not a themed label. Cut copy about the site or the
business itself. No em dashes, use a period or a comma. **American spelling**, always:
color, license, program, standardizing, toward, catalog.

Watch for two specific habits. **Antithesis**, the "X, not Y" verdict, is a real
device and works rationed. Twice on a site is a style, five times is a tic. And
**explaining the cards before the reader reaches them**: if a section's items each
carry their own plain summary, an introductory paragraph restating them in a cleverer
register is doing worse the job the items already do. Cut it.

### Don't rent what the site can own

**No third-party service in a client site that anybody has to pay a subscription for.**
It is not only the bill. "You own everything" is the pitch, and a subscription the
client did not choose and cannot maintain undercuts it.

Most of what these sites would rent is a small amount of code. A scheduler is a slot
list. A calendar invite is a text format from 1998 and about eighty lines. An upload
store is an email attachment. Web fonts are free if you download them at build time.

The bar for adding a paid dependency: **the alternative is genuinely hard or
genuinely regulated, and the client hears the cost before it is added.** Taking a card
is the real exception, so Stripe and Square are allowed. Availability is the one that
bites: a hand-written slot list does not know what is already booked, so say that
plainly and leave a named seam for a calendar feed rather than implying it is solved.

> Four repos predate this rule and still expect a `RESEND_API_KEY`. That is backlog,
> not permission.

### The studio credit

**"Double Dipped by Glazed Web"** is the default wording, title case on Double
Dipped, with the drippy donut linking to glazedweb.com. **"Baked by"** where a donut
pun would land wrong, which is any room where somebody is mid-decision about spending
real money on expertise. **"Concept build by"** on a spec build that has not been
bought.

Retired, and recorded so nobody reintroduces them: "Designed and built by," "Made in
Marshall by," and a bare "Built by" default. They exist nowhere in the shipped system.

Procedure, four steps, and the components are ready rather than rebuilt each time:

1. `node scripts/plate.mjs "<footer bg hex>"` prints the plate ground, the ink, and
   the three CSS values. Run it even when the answer looks obvious. The failure mode
   is an invisible graphic, not an ugly one: Glazed's chocolate under a `#191919`
   footer measures 1.00.
2. Copy the `GlazedCredit` and `GlazedPlate` components into `components/`, and
   append the credit CSS to `globals.css`.
3. Paste the three `--gw-*` values next to that site's palette.
4. `<GlazedPlate line="..." />` as the last child of `<footer>`, outside any max-width
   container so it is full bleed. Leave the client's copyright where it is.

Then confirm the plate rendered: `.gw-plate` present, computed background and drip
color matching what you set. A missing `--gw-above` fails silently to the default and
produces a seam rather than an error.

Two judgments worth keeping. Check that **both** readings of the wording work, because
it is our joke sitting in their footer and the downside lands on them. And do not
sweep the client's copyright onto Glazed's plate, because that would make the studio's
plate the last word on their site, which is not what a signature is.

**The credit belongs in the contract, not in a surprise deploy.** Removing it is one
line. Tell the client it is there. As of August 2026 it is live on seven sites and no
owner has been told, which is an open item rather than a precedent.

### Write the reasoning next to the thing

**Every non-obvious decision gets a comment or a README section saying why, including
what was tried and rejected.** The code is readable and the reasoning is not
recoverable. This is why these repos have long comments, and it is deliberate.

Record retractions as retractions. A rule that was wrong is worth keeping with the
reasoning that produced it, because that is what stops the next person re-deriving it.

### Being straight

Never report something as done without checking it. When you are wrong, say so and
say what the actual state is. Do not send the client to fix a fault you have not
localized: Kevin was once sent to re-save GitHub settings for a fault that did not
exist.

**When a thing appears N times, check all N.** A fix verified on one instance is
unverified. This applies to repos, to a component rendered twice on a page, to
footers across two layouts, and to routes.

---

## 5. The process

Four engagement shapes. Say which one you think you are in if it is ambiguous, rather
than doing four times the work the client wanted or a quarter of it.

### Scout

"Look at it and tell me what you'd do." Audit the live site and report what is
actually wrong. **No building.**

What an audit covers, in the order that finds the most:

1. **Search and sharing.** Titles, meta descriptions, Open Graph, structured data,
   sitemap, robots. Most often broken, cheapest to fix, most persuasive opening. Found
   in the wild: an events page whose Open Graph still advertised an event from three
   years earlier, a homepage titled `CAC Home`, no `LocalBusiness` schema anywhere.
2. **Usability, on a phone.** Is the phone number a `tel:` link? Is there an email at
   all? Is there a call to action above the fold, or a full screen of uncropped photo?
3. **Brand consistency.** Sub-pages on a different palette, a second button style, a
   plugin's default form styling, a logo in the wrong color.
4. **Content.** Typos, prices formatted as `12.00`, missing consumer advisories,
   contradictions between the site and their ordering system.
5. **Performance.** Image weights and formats, script and stylesheet counts. Concrete
   numbers land: "the homepage loads 32 script tags and 33 stylesheets."
6. **Security.** HTTPS enforced? A certificate that does not match the host name, or a
   redirect down to HTTP, marks the site "Not secure" in every visitor's browser. It
   is verifiable in one click, which makes it a strong opening claim.
7. **Accessibility.** Run the auditor against the live site.

**Every finding links to the page that proves it.** Anything unprovable gets named as
unverifiable rather than dropped silently.

### Pitch

For a prospect who has not signed. Three deliverables:

- **The rebuild concept.** A real, deployed Next.js site using their brand, their
  photography, their copy. Not a mockup.
- **The proposal page.** One self-contained HTML file with no build step so it can be
  hand-edited. Its stylesheet and the animated donut marks are lifted verbatim from
  the Griffin Claw proposal rather than re-derived. Strip what it does not use.
- **The host split.** Proposal at the root of `<client>.glazedweb.com`, demo at
  `/demo`, and the client's own domain serving the site at its root with no proposal
  anywhere.

The host split needs three host-scoped rewrites in `next.config.ts`, and **they must
be in `beforeFiles`**:

```ts
async rewrites() {
  const onPitchHost = [{ type: "host", value: "<client>.glazedweb.com" }];
  return {
    beforeFiles: [
      { source: "/", destination: "/pitch/<client>.html", has: onPitchHost },
      { source: "/demo", destination: "/", has: onPitchHost },
      { source: "/demo/:path*", destination: "/:path*", has: onPitchHost },
    ],
  };
}
```

A plain `rewrites()` array is `afterFiles`, which only runs once Next has failed to
find a page, and `app/page.tsx` already answers `/`, so the root rewrite silently
never fires. Host scoping rather than `basePath: "/demo"`, because `basePath` is
global to a build and would bury the real site under `/demo` the day the domain goes
live. One acceptable wart: links are root-relative, so the `/demo` prefix drops off
after the first click. Nothing 404s.

**Every path on the pitch host sends `X-Robots-Tag: noindex, nofollow`,** because the
demo is a full copy of the client's site and must never compete with them for their
own name. **The `.vercel.app` host is the same duplicate-content risk and is
indexable by default.** As of August 2026 three live repos have this open, and one has
its canonical URL pointing at the `.vercel.app` host, which aims canonicals, sitemap
and Open Graph at the duplicate. Check it on every build.

Delete the pitch file and the rewrites once the client signs or passes.

### Build

Full rebuild. The parts most often underestimated:

- **Forms need a real destination and a confirmed inbox.** Two separate things.
  Configured mail, and a human-monitored address confirmed by the client. Until both
  exist, the honest behavior is a `mailto:` handoff with every field prefilled, or for
  a long form, accept the submission, tell the visitor the truth, and write the whole
  payload to the log so nothing is lost. What is not acceptable is a stub that waits
  half a second and says "Thanks, we got it" while sending nowhere.
- **Mail is SMTP through a mailbox the client already owns**, not a hosted API. Where
  the client has no mailbox, send from a `glazedweb.com` address with `replyTo` set to
  the customer, so client DNS work is never on the critical path. When mail is
  unconfigured the form must still succeed for the visitor and log the full payload. A
  form that reports "something went wrong" because of an unset variable teaches people
  the form is broken. The delivery is what is missing, and that is the operator's
  problem to see in the log.
- **Nothing paid gets added without the client hearing the cost.**
- **A before-launch checklist in the README**, with every placeholder and unconfirmed
  fact on it as an unchecked box.
- **The studio credit goes on before launch,** not as an afterthought.

### Polish

A site already stands. Bring the mark alive, measure the details, sweep accessibility
and performance. See the motion rules in §4.

### Handover

The README is the deliverable, not a courtesy. It should let someone who has never
seen the repo change the thing they came to change without breaking something else:
what the project is and how to run it, where content lives and which surfaces cannot
read from it, every trap named as "this will break if you do not know," decisions with
their reasoning including what was rejected, and the before-launch checklist.

---

## 6. Stack and standing up a new site

**Defaults.** Next.js App Router, TypeScript where the repo allows it, Tailwind,
deployed on Vercel from a GitHub repo under `hershock48`. Fonts downloaded at build
time, never fetched from a third party at runtime. Repos are deliberately not unified
on one version, so **check `package.json` before assuming anything**, and check
whether Tailwind is 3.x (`tailwind.config.js`, `theme.extend`) or 4.x (CSS-first
`@theme`) before editing tokens. Do not maintain a version table in this file. It goes
stale in days and `package.json` is one read away.

**Audit the production build, never the dev server.** Dev serves different CSS and
hides build-time failures.

**Secrets are set in the Vercel dashboard by Kevin.** Never ask for a paste, never
write one into a file. Each repo carries a `.env.example` listing exactly what it
needs, and that file is the authority. If a feature is gated on a missing key, say
which key and stop.

**Payments.** Stripe or Square hosted checkout. Note that Stripe's published
restricted-business list prohibits courses and information on cultivating marijuana,
so for that client the processor question may not be answerable yet. Do not put a
Venmo button in a footer. It has nothing to pay for.

**Ordering integrations.** Toast sends `x-frame-options: SAMEORIGIN`, so on-page
ordering is impossible. The on-brand answer is Ordering Pro on `order.<client>.com` so
the URL stays theirs. Always link the canonical ordering URL, never a legacy link that
301s.

### Zero to live, in order

1. **Pick the repo name and verify it exists before pushing anything to it.** Probing
   the wrong name returns "Repository not found," which reads like a permissions
   problem and is not.
2. Create the repo on GitHub first, empty is fine, then clone it. Do not build first
   and graft later.
3. Create exactly one Vercel project per repo. Duplicated imports have happened and
   produce two projects racing on one repo.
4. Decide the canonical host, `www` or apex, and set it in the constant file. It must
   be the client's real domain, never the `.vercel.app` one.
5. `noindex` the preview and pitch hosts.
6. Set environment variables in the dashboard.
7. Run the plate script and place the studio credit.
8. Run the auditor at both widths on every route.
9. Work the before-launch checklist to zero.

**If you inherit a working copy that was never a clone of the target repo:** run
`git merge-base HEAD origin/main`. Empty output means the histories are unrelated and
`--force` would replace the client's whole site. The fix is
`git merge --allow-unrelated-histories`, which keeps the repo's initial commit. Expect
`README.md` as the only conflict, and keep ours. Rename `master` to `main` to match
the account.

---

## 7. Verifying: how to know before you say

Every embarrassing moment on this account has been an outbound claim rather than a
broken build. These are gates, and each one is a list you can tick.

### Before you write down a finding about a live site

1. Open the rendered page in a real browser if you can reach it. **Check whether you
   can, this session, rather than assuming.** If you cannot, say so in the report.
2. Tag every finding: **M** if markup alone proves it, **R** if it needs a render.
3. Every M finding carries the URL or the line that proves it.
4. No R finding ships without being labeled as unverified.

Markup alone is enough for: title tags, meta and Open Graph, structured data,
sitemap, robots, HTTP headers, certificate validity, script and stylesheet counts,
image formats and weights. Markup is **not** enough for anything JavaScript injects,
anything that depends on layout, or any class-based styling claim, because a fetch
strips class names.

> A confident, twice-repeated claim that a homepage had no Facebook embed. A Facebook
> plugin and a Yelp waitlist both sat at the foot of it, injected client side. Kevin
> found them on his phone.

### Before you say a build is done

0. Prerequisites: production build not dev, no stale server on the port, correct repo
   confirmed with `git remote -v`.
1. Work §3, "What done means," top to bottom. Every box.
2. **A green build proves syntax and types and nothing else.** Not which repo, not
   which data, not what rendered.

> A news filter was 75% wrong in production while the local build reported compiled
> successfully, types clean, failure path verified. The data source was unreachable
> from the development machine and the code degraded silently. When a data source is
> unreachable from where you develop, the deployment is the test environment. And a
> bug found in production output should leave the production output behind as a
> committed fixture with a non-zero exit.

### Before you say a fix is deployed

1. `git remote -v`, and `git merge-base HEAD origin/main` is non-empty.
2. `git ls-remote origin <branch>` matches your local SHA.
3. The deployment for that SHA reports READY.
4. **Fetch the deployed URL and confirm the change is in the response.**

Step 4 is the one people skip, and it is the only one that proves the visitor sees it.

### When re-checking your own work against a request

Open the original message. Number each request 1 to n. Against each, name the file and
line that satisfies it. Any request you cannot point at a line for is not done.

### Sanity-checking a measurement

A number too large to be plausible is evidence of a broken environment, not a broken
layout. A 1834px overflow on a page that was clean a minute ago means the harness is
wrong. Check the harness before you check the code, and never report a measurement you
cannot explain.

---

## 8. The failure log

Each of these has cost real hours. They are not exotic. They are what a competent
session does by default, which is why they need naming.

### Git and deploys

- **A remote that is not GitHub.** Cloning from a bundle leaves `origin` as a local
  path, and `git push origin` reports success having written to disk. Four commits
  went missing that way while the blame went to Vercel and then GitHub.
  `git remote -v` before the first push in any working copy.
- **Unrelated histories.** See §6. Empty `merge-base` means stop.
- **Never `git config http.extraHeader`.** It writes the token into `.git/config`
  where it can be committed. Pass it per command with `-c`, and pipe output through
  `sed` to redact, because git leaks the header on failure.
- **A stale local server is the most misleading failure available.** It serves a build
  you deleted, or a different repo entirely, and manufactures audit results for code
  that is fine. Kill by PID and confirm the port is free before starting.

### Browsers and screenshots

- **`scroll-behavior: smooth` breaks harnesses.** `scrollIntoView` animates, so a
  measurement taken immediately after reads the pre-scroll position. Disable it in the
  harness. This has produced two separate false results: `elementFromPoint` returning
  null for every element on a page, reported as "149 links unclickable," and a
  screenshot of the wrong region.
- **Judge at true size.** Elements calibrated at one render size look wrong at the size
  they ship at. Sample the real widths.
- **Headless WebKit is not iOS Safari.** It has a different compositing path and has
  rendered correctly where a real iPhone showed a grey square. Anything visually
  unusual needs a real device.

### CSS

- **Plain CSS after `@tailwind utilities` beats utilities**, and `position` is the
  nastiest case. A rule setting `position: relative` beat an `absolute` utility on the
  same element, so the element laid itself out in the flow and silently ignored every
  offset it was handed.
- **Duplicate selectors and split grouped rules are silent.** No build failure, no
  warning. Inserting a comment between two selectors in a grouped rule deletes the
  shared declaration from the second one. That once made two elements 0 by 0 and cost
  three attempts to fix something with no area.
- **An `opacity: 0` element still receives clicks.** An invisible overlay is a dead
  button with no visible cause.
- **A reveal-on-scroll system in a root layout must re-arm on navigation.** Queried
  once on mount, it hides the next page's elements and never shows them, so every
  internal link lands on a blank page while the URL and the nav highlight both change
  correctly. A navigation test that does not assert visibility is not a navigation
  test.

### SVG and images

- **State `width` and `height` on every SVG**, derived from the viewBox. A viewBox
  alone gives an aspect ratio but no intrinsic size, and Safari can fall back to a
  150px default, producing a near-square box where a wide one belongs.
- **A component that can render twice cannot own a fixed `id`.** Two instances sharing
  a gradient or filter id is undefined behavior and has painted a dark square on a page.
- **`mix-blend-mode` inside an isolated stacking context costs a backdrop read-back**,
  which is tiled. A tile that resolves its backdrop differently from its neighbors
  prints as a visible square. It is also the largest performance cost available on an
  animated element: three blend layers ran at 30fps where two ran at 60.
- **`filter: blur()` does not soften fine structure, it erases it.** Build soft edges
  from stacked geometry or a mask.
- **Trace at 8x with a slight blur, and pick the threshold by rendering candidates and
  diffing**, because a solid shape at full ink has to be narrower than an anti-aliased
  one to carry the same visual weight, which is the opposite of the intuition.

### Forms and Next.js

- **A `"use server"` file can only export async functions.** Exporting an object from
  one fails at build with a message that does not name the export.
- **Serverless request bodies cap out well under a phone photo.** Downscale in the
  browser before submitting, write the smaller files back to the input so the no-JS
  path still works, and make every failure path return the original rather than
  nothing.
- **A hidden submit button is still the form's default button.** Pressing Enter in any
  field submits, from any step of a wizard, unless the button is disabled or the key is
  intercepted. On a complete form that means sending the booking early.
- **Route caching and time do not mix.** A page whose content depends on the current
  date cannot be statically generated or revalidated on a timer. Regeneration is
  request-triggered, so on a quiet site the cached page ages indefinitely and serves
  times that the server then rejects. Render it per request.

### Scripted edits

**Assert before you write.** A scripted edit that silently no-ops and then prints
"done" is how a change gets reported as made twice without existing. Every replacement
asserts its target matched exactly once, and the write happens at the end, after every
assertion has passed. Do not put a stale-check after the edits and before the write,
or a failed check discards work already done in memory.

---

## 9. Clients, durable facts only

Deliberately no live state here: no "is it deployed," no "is this env var set," no
open bugs. Those go wrong within a day and a wrong document is worse than none. Derive
current state at the start of a session from Vercel and from `git ls-remote`. What
belongs here is what a machine cannot find out: what the business is, what was
decided, and what was promised.

| Client | Repo | What they are | Notes that stay true |
|---|---|---|---|
| Chism Chicken Ranch | `chism-chicken-ranch` | Poultry farm, Marshall MI | $500 plus $50/mo, an early friend price. Owner had a trademark concern about the initials. |
| Copper Athletic Club | `copperac` | Sports bar, Marshall MI | Keep their brand, fix execution. Several games on an ordinary night; a big Detroit game takes every screen. News ticker runs faster than the score ticker. |
| Super Duper | `superduperr` | Coffee, retail and wholesale | Client does not want the brand changed. Wants "adventure" positioning. Kevin's favorite line: "Coffee that shows up before you run out." |
| Cookin' with Beans | `cookinwithbeans` | Mini street taco truck, Marshall MI | Facebook only before this. Needs truck schedule, catering bookings, online ordering. Match the wrap: turquoise, red-orange sugar skulls, lime green accents. |
| Sprinkles & Sparkles BB | `sprinklesandsparklesbb` | Brittany, holographic dessert tutorials and sanding sugars | Storefront built into the site, not linked out to Shopify, so she drops that bill and owns her shop. Lighter, multicolored confetti styling with sparkle on scroll. Leave her domain spelling alone. |
| Cascarelli's of Homer | `cascarellis` | 1935 pizza tavern, Homer MI | Homer only, Albion is closed. Roughly $1,500 plus $100/mo. Warm normal restaurant tone, a snarky voice was explicitly rejected. Sells specialty nuts, cashews and redskin peanuts, online. POS is Aloha. |
| Louie's Bakery | `louies` | 1952 family bakery, Marshall MI | Permission to use any photos from their site. |
| Griffin Claw Brewing | `griffin-claw-rebuild` | Brewery, prospect | Source of the Glazed proposal stylesheet and the animated donut marks. Their incumbent contract keeps code ownership with the vendor, which is the contrast our terms sell against. They do have a current tap list, buried under Locations. |
| MI Gas | `migas` | Cannabis cultivation consultant, licensed Michigan facility | Repo is `migas`, not `mi-gas`. Domain is mi-gas.net. Wants consulting booking, "like Calendly but make the whole experience better." Logo is a black interlocked MIGAS wordmark mirrored vertically over a burning sun. Credit reads "Baked by." |
| Be A Number | `beanumber` | Nonprofit, numbered shirt sponsorship | Nonprofit, which changes tone and budget expectations. |

`bangrants` is Kevin's and does not matter.

**Permissions on file:** logo and photo use granted by MI Gas, Copper AC, Louie's,
Sprinkles, and Cascarelli's (spec build).

---

## Appendix: things true only of one sandbox

Everything above is portable. The following are artifacts of the AI sandbox this
document grew up in, and several are actively wrong on a Mac. Check which situation
you are in before applying any of them.

- **Outbound HTTPS.** An earlier version of this document stated flatly that the
  browser had no outbound HTTPS and built the whole audit discipline on it. That was
  true once and is not now. **Test it at the start of a session** rather than assuming
  either way, and say in the report which it was.
- **Chromium path.** Some sandboxes pin Chromium at `/opt/pw-browsers/chromium` with
  downloads disabled. On a Mac you must run `npx playwright install chromium`. Any
  script that hardcodes that path fails at launch off-sandbox, which silently retires
  the gate. Resolve the executable from an environment variable with a fallback.
- **Git authentication.** In a sandbox with a git proxy, a 403 on push is usually
  authorization rather than credentials, the authorized repo set is fixed at task
  start, and `gh auth login`, credential helpers and tokens in the URL all fail. On a
  normal machine `gh auth login` is the correct answer.
- **`gh` and the GitHub API** may be unavailable or blocked in a sandbox. They are the
  right tools everywhere else.
- **`pip install --break-system-packages`** is a sandbox workaround. On macOS use a
  virtual environment or `pipx`. Against the system Python it can damage the toolchain.
- **`apt-get install potrace`** is Linux. On a Mac it is `brew install potrace`.
- **No `rsvg-convert`, `inkscape` or `cairosvg`** in some sandboxes. The workaround,
  loading the SVG into a browser and screenshotting it, is good and portable. The
  premise is not.
- **`df` and the working directory.** Disk may be a fixed per-session allowance rather
  than what `df` reports, and the working directory may reset between commands. Use
  absolute paths regardless, which is good practice anywhere.
- **Frame-time numbers** in the failure log came from a software renderer with no GPU.
  Treat the absolute figures as pessimistic. The attribution holds either way.

---

## Standing cautions

**Never put a credential in a file, a commit, a README, or this document.** Kevin's
GitHub token has spent a long session in plaintext in a transcript and been used
repeatedly. If you notice one: stop, say so, recommend rotating it, and do not quote
it again.

**If this document disagrees with the code, the code is right.** Fix the document.
