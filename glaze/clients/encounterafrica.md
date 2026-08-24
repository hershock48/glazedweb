# Encounter Africa Safaris

Gorilla trekking and wildlife safari operator, Entebbe, Uganda. Edison and
Chris run it; Plot 198 Bukaya Road, Garuga, Entebbe. Operating since 2012,
473 Excellent reviews on TripAdvisor. Two live websites carry the business:
encounterafricasafaris.com and gorilla-tracking-uganda.com, both WordPress,
the second a 2012 Robylinks Solutions build. WhatsApp is the booking desk:
+256 772 197157, info@gorilla-tracking-uganda.com.

**Status: pitched, not signed.** The repo is `hershock48/encounterafrica`,
a static demo plus proposal on the house host split: proposal at the root,
demo under `/demo`. Pitch host: encounterafrica.glazedweb.com.

## The deal on the table

The Baker's Dozen at $1,900 once plus $450/yr care, and the jelly line:
1.5% of card deposits taken through the site, first 90 days at 0%, permits
excluded (that money passes to UWA), billed quarterly, cancelable while
keeping the site. Deposit rail is the client's own Pesapal account; client
money never routes through Glazed. Deposit shown at 30%, a marked
placeholder until Encounter Africa confirms terms.

**This is an Andrew Otage deal.** Andrew (Entebbe, WhatsApp +256 774
189668) is the in-country partner who fronts the relationship; the split
lives in the Andrew partnership term sheet, which stays OUT of this public
repo and out of the client repo (gitignored local copy there). Track One
terms apply: 20% of the build to Andrew, 20% of care and jelly on the
account for as long as it stays.

## Decisions that should survive

- **Photography is theirs, with permission**, lifted from their two live
  sites and compressed into `demo/img/`. The storks image on their Uganda
  page carries a third-party photographer's watermark (Wietse Jongsma) and
  was deliberately not used; their permission likely does not cover it.
- **The proposal says built, not would-build.** The demo existed before
  the proposal went out, and the proposal's whole argument leans on it:
  open `/demo`, every price is real. Keep it true.
- **Consolidation plan**: everything moves to encounterafricasafaris.com
  at launch with page-for-page redirects from gorilla-tracking-uganda.com,
  so the split Google authority merges.
- The demo's day-by-day itinerary copy is sample structure, labeled as
  such on the pages; on build it is lifted from their real itineraries.

## Launch checklist deltas

Both hosts noindex (meta on every page plus X-Robots-Tag from
vercel.json). Per glaze/proposal.md: delete the root proposal and restore
the demo to the root once they sign or pass.
