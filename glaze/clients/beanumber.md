# Be A Number International

**Repo** `beanumber` · **Live** www.beanumber.org

| | |
|---|---|
| Legal name | Be A Number, International. U.S. 501(c)(3), EIN 93-1948872, incorporated 2023, Marshall, Michigan |
| Pitch host | `beanumber.glazedweb.com` (any `*.glazedweb.com` or `*.vercel.app` host serves the proposal at `/`; attach the subdomain in Vercel) |
| Proposal | `/` on the pitch host, `public/pitch/beanumber/index.html`. Retroactive: it describes the live site |
| Agreement | `glazedweb.com/agreement/beanumber` (registry row in glazedweb `lib/customOrders.js`; paper twin `contracts-private/build-beanumber-agreement.js`) |
| Build page | `glazedweb.com/build/beanumber`, the proposal's one action ("Launch") |
| Terms | No build fee. $50 a month from the day it is started on the agreement page. One hour of edits |

## What they are

Nonprofit. Numbered t-shirt child sponsorship: every number is a child. Uganda
programme on the Youth Development Organisation campus in Omoro District, with a
trip planned for October 2026. $25 buys the shirt, $25 a month is the
sponsorship. **Kevin is the founder**, so the agreement is a related-party one:
the board approves it and someone other than Kevin signs for the charity.

**Being a nonprofit changes two things:** the tone, and the budget expectations.
Do not quote menu prices here without thinking about it.

## The mechanic, stated so nobody breaks it

Nobody assigns a child to a buyer, ever. The number is printed on the shirt; the
buyer types it in and holds the button. Numbers 1 to 53 are real children; higher
numbers fold back onto the roster through the `batches` table. A shirt buyer is a
holder; $25 a month makes a sponsor, and a child's personal updates are for
sponsors. The numbered pages are noindex and off the sitemap on purpose.

## Owed to the site (in the monthly, 2026-09-10)

- Airtable is not a data source any more but `src/lib/env.ts` still requires its
  keys at boot and the rep portal still calls it. Remove the requirement first,
  then the calls, then the env vars. Never the env vars first.
- SPF and DKIM are missing on beanumber.org, so mail from kevin@beanumber.org
  carries an authentication warning. Needs the registrar login.

## Notes

The work card on glazedweb.com rolls the shirt number as you scroll, driven by
`BeANumberMark` in `components/Logo.jsx`. That mark is Be A Number's, used with
permission, and it is annotated as such in the file.

Credit reads **"Double Dipped by"**.
