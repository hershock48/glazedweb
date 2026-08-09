# glazedweb

Websites, fresh daily. 🍩

Small-batch web studio site — Next.js, deployable on Vercel.

## Develop

```bash
npm install
npm run dev
```

## Deploy

Push to `main`. Vercel builds it. Import the repo **once** — see below.

### Only one Vercel project per repo

Fixed on 9 August 2026, and worth keeping the diagnosis because the failure
mode is silent.

This repo was imported twice: `glazedweb`, which owns `glazedweb.com` and
`www.glazedweb.com`, and `glazedweb-9qy6`, which owned nothing. Both were
wired to the same GitHub webhook, so one push fired two builds and they did
not reliably both finish. Commit `05dc86d` built on both, nine milliseconds
apart. The two commits after it built **only** on `glazedweb-9qy6`. So the
code was on GitHub, a build went green, and `glazedweb.com` kept serving the
old page — with nothing anywhere reporting a failure, because nothing had
failed.

**The tell is a pair of projects whose latest deployments diverge.** If a
push ever seems not to land, check for a twin before checking anything else.

Where the twins came from is in this repo's own history: commit `545cf6a`,
"Vercel projects were imported while the repo was empty, so framework
detection saved Other and only public/ was served". Plural. The same double
import hit `copperac`, `cookinwithbeans` and `bangrants`. All four
duplicates are now deleted and every repo has exactly one project.

`superduper` and `superduperr` look similar but are separate projects, not a
duplicate pair. Leave them alone.

Rule going forward: **one Vercel project per repo.** If you need a second
environment, use a branch and a pull request, not a second import.

### When a push to `main` builds nothing at all

Separate fault, found the same evening and worth writing down because the
diagnosis is counter-intuitive.

`glazedweb` stopped building at `05dc86d` and then ignored three consecutive
pushes to `main`. Meanwhile `copperac`, `griffin-claw-rebuild` and
`sprinklesandsparklesbb` all built normally from pushes minutes either side,
using the same credentials and the same machine. So the push itself, the
token and GitHub were all fine.

**What fixed it: re-saving the Vercel GitHub App's repository access.**
GitHub → Settings → Applications → Vercel → Configure → Repository access →
Save. The setting was already on *All repositories*; saving it anyway is the
point, because saving re-fires the installation event and Vercel
re-registers the repo. The next push to `main` built immediately, and the
three before it had not.

So the App's *stated* access is not evidence that the link works. A screen
reading "All repositories" tells you what GitHub intends, not whether Vercel
currently has a live registration for this repo. Save it regardless.

What it was **not**: Production Branch or Ignored Build Step. Neither can
produce this symptom, and it is worth knowing why so nobody goes hunting
there. An Ignored Build Step still creates a deployment and marks it
*Canceled*; a wrong Production Branch still creates a *Preview*. Here there
was no deployment record of any kind, which means Vercel never started one.

A caution on how to test this, because the obvious experiment does not work:
pushing a throwaway branch to check whether the webhook fires proves
nothing. A bare branch push with no pull request open does not create a
deployment on this setup — verified by pushing one to `copperac`, a project
that was demonstrably building fine at the time, and getting no deployment
there either. Test with a real commit on the production branch or not at
all.

If re-saving the App access ever fails to fix it, the next thing to try is
the project's own link record: **Settings → Git → Disconnect**, then
reconnect the repo. Vercel's dashboard reports the repo as connected either
way, and its Production Checklist keeps "Connect Git Repository" ticked, so
neither end of this shows you anything. The only reliable signal is
comparing a working project's latest deployment against a broken one's.

## The /order form is not delivering email yet

`/order` is the funnel: flavour, business details, clickwrap acceptance of the
agreement. `POST /api/order` sends it through Resend, and **one** variable
switches it on: `RESEND_API_KEY` in the Vercel project. Until then it answers
`503 not_configured` and the form opens a pre-filled email instead, so an order
survives a half-finished setup. See `.env.example`.

Sending needs glazedweb.com verified in Resend with DNS records. That is
deliberately our domain rather than each client's: verify once and every site
we build can send, with `reply_to` set to the customer so hitting reply on a
notification lands with them.

`ORDER_TO_EMAIL` is optional and defaults to `CONTACT_EMAIL`. It used to be
required with no default, because at the time the address was a guess, and a
guessed inbox is worse than none: Resend accepts the message, the route answers
`ok:true`, the customer is told their order arrived, and it is gone with no
bounce anyone sees. Now that the address is confirmed the default is safe.
Anything unconfirmed should go back to failing loudly.

All contact addresses come from `lib/contact.js`. It was hardcoded in eight
places before that file existed, including the `ProfessionalService` JSON-LD in
`app/layout.jsx` that Google reads as the studio's contact address. `kevin@` is
the address of record, confirmed 9 August 2026; `hello@` also reaches him, so
nothing already sent there is lost and nothing needed migrating.

The fallback copy used to read "Email isn't wired up on this form yet". True,
and the wrong thing to say on the last screen of a funnel to somebody deciding
whether to pay us to build their website. Same behaviour, no confession.

## The share card

`public/og.png` is what appears when the link is texted or posted: the mark on
the cream ground with "Websites, fresh daily." under it. The wordmark, the
hand-built line, the geo line and the green rule are all gone. Four lines of
copy is too much to read at the size a text message renders this.

Nothing is lost by cutting the rest, because every client renders the
`openGraph` title and description as text beside the image, and those still
carry "Web Design in Marshall & Battle Creek, MI" with the price and timeline.
The card only has to be recognisable.

To remake it: `public/brand/logo.svg` at 380px tall above the tagline at 54px /
800 weight in `#CE3672`, centred on `#FDF6EC` in a 1200x630 frame, rendered at
2x and downsampled. Type is the system stack, because the site ships no webfont
at all and matching it means using the same stack rather than picking something
close.

Two details that were measured rather than eyeballed, both caused by the same
thing. The logo's viewBox carries roughly 58px of empty space below the drips.
That slack stacks on top of any flex gap, which pushed the tagline away from the
mark it belongs to, so the mark carries `margin-bottom: -58px` to absorb it. And
the same slack makes a box-centred layout sit high, so the mark is shifted up
28px to bring the combined artwork to 126px of cream above against 124 below.
The result stays inside the central 630x630 square, so the square crop some
clients apply does not clip it.

`twitter` in `app/layout.jsx` sets the card type and nothing else, on purpose.
A root twitter block carrying title, description or image is inherited by every
sub-page, so pages that override `openGraph` would still hand the homepage's
card to any scraper preferring `twitter:*`.

Changing this file does not change what has already been shared. Facebook,
iMessage and LinkedIn cache preview images hard. Force a re-scrape through
Facebook's Sharing Debugger; iMessage clears itself over a few days and has no
button.

## Brand

- Mark: pink donut + green slime drip (see `components/Logo.jsx`)
- Standalone assets in `public/brand/` (`logo.svg`, `logo-800.png`)
- Favicons in `public/` (`favicon.svg`, `favicon.ico`, `icon-192/512.png`, `apple-touch-icon.png`)
- Palette: Raspberry `#E84D8A` · Slime `#BFE07A` · Fern `#55974A` · Chocolate `#2B1E16` · Cream `#FDF6EC`
