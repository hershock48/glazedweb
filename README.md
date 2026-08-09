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

This repo is currently imported twice: `glazedweb`, which owns
`glazedweb.com` and `www.glazedweb.com`, and `glazedweb-9qy6`, which owns
nothing. Both are wired to the same GitHub webhook, so one push fires two
builds, and they do not reliably both finish. On 8 August both built commit
`05dc86d` nine milliseconds apart, and on the next commit only
`glazedweb-9qy6` built. The code was on GitHub, the build was green, and
`glazedweb.com` still served the previous version — with nothing anywhere
reporting a failure, because nothing failed.

The tell is a pair of projects whose latest deployments diverge. Check both
before assuming a push did not land.

**Delete `glazedweb-9qy6`.** Keep whichever project holds the real domain.

Where the twins came from is in this repo's own history: commit `545cf6a`,
"Vercel projects were imported while the repo was empty, so framework
detection saved Other and only public/ was served". Plural. The same double
import happened to `copperac` (fixed, duplicate deleted), `cookinwithbeans`
and `bangrants`. If a deploy ever seems to vanish on any of these, look for
the twin first.

## Brand

- Mark: pink donut + green slime drip (see `components/Logo.jsx`)
- Standalone assets in `public/brand/` (`logo.svg`, `logo-800.png`)
- Favicons in `public/` (`favicon.svg`, `favicon.ico`, `icon-192/512.png`, `apple-touch-icon.png`)
- Palette: Raspberry `#E84D8A` · Slime `#BFE07A` · Fern `#55974A` · Chocolate `#2B1E16` · Cream `#FDF6EC`
