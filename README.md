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
environment, use a branch and a preview deployment, not a second import.

## Brand

- Mark: pink donut + green slime drip (see `components/Logo.jsx`)
- Standalone assets in `public/brand/` (`logo.svg`, `logo-800.png`)
- Favicons in `public/` (`favicon.svg`, `favicon.ico`, `icon-192/512.png`, `apple-touch-icon.png`)
- Palette: Raspberry `#E84D8A` · Slime `#BFE07A` · Fern `#55974A` · Chocolate `#2B1E16` · Cream `#FDF6EC`
