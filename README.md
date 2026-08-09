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

Two things it was **not**, both ruled out by evidence rather than by looking:

* **The Vercel GitHub App's repository access.** It was set to *All
  repositories*, so the App could see the repo the whole time.
* **Production Branch or Ignored Build Step.** Neither can produce this
  symptom. An Ignored Build Step still creates a deployment and marks it
  *Canceled*; a wrong Production Branch still creates a *Preview*. Here
  there was no deployment record of any kind, which means Vercel never
  started one.

A caution on how to test this, because the obvious experiment does not work:
pushing a throwaway branch to check whether the webhook fires proves
nothing. A bare branch push with no pull request open does not create a
deployment on this setup — verified by pushing one to `copperac`, a project
that was demonstrably building fine at the time, and getting no deployment
there either. Test with a real commit on the production branch or not at
all.

What is left, once those are gone, is the project's own link record to the
repo on Vercel's side. Fix: project → **Settings → Git → Disconnect**, then
reconnect `hershock48/glazedweb`. The dashboard reports the repo as
connected either way, which is why this is invisible from both ends until
you compare a working project against a broken one.

## Brand

- Mark: pink donut + green slime drip (see `components/Logo.jsx`)
- Standalone assets in `public/brand/` (`logo.svg`, `logo-800.png`)
- Favicons in `public/` (`favicon.svg`, `favicon.ico`, `icon-192/512.png`, `apple-touch-icon.png`)
- Palette: Raspberry `#E84D8A` · Slime `#BFE07A` · Fern `#55974A` · Chocolate `#2B1E16` · Cream `#FDF6EC`
