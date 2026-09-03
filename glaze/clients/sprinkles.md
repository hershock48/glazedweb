# Sprinkles & Sparkles BB

**Repo** `sprinklesandsparklesbb` · **Live** sprinklessparklesbb.com (Shopify) ·
**Vercel** `sprinklesandsparklesbb` (glazedweb team) · **Pitch host**
sprinkles.glazedweb.com (attached)

## Status

Spec build complete, deployed, noindexed. Proposal built per `../proposal.md` on
2026-09-03 and served at the pitch root; demo under `/demo`. Not yet shown to
Brittany.

**Price: $500 build, $50 a month.** Kevin's number, 2026-09-03: an old friend-price
pitch that predates the menu, same bracket as Chism. The proposal melts $500 down
from Shopify's own published $1,000 floor for custom development (their website
cost guide, linked in the letter). No calculator: her Shopify Basic is $39 a month,
so the monthly does not win on money and the letter does not pretend it does. It
states the $39 once, sourced, and moves on. Card fees are identical either way,
2.9% + 30c on Shopify Basic and on Stripe, both linked.

**The hook is "Does your website sparkle?"** Her own words about her site, on file
below, are "not very sprinkle-y"; the letter quotes that back once.

## What the audit found, 2026-09-03

All verified in a browser that session, each with a link in the letter:

- Theme is Dawn 15.2.0, Shopify's free default, at `/cdn/shop/t/1/` (first theme
  ever installed). `theme_store_id` 887.
- og:image is the logo PNG, black script on white, no "BB", declared over `http://`.
- Homepage fetches 96 checkout-web files (74 JS, 22 CSS) for every visitor; the
  HTML carries 50 script tags and 29 stylesheets. 453KB of JS on the perf profile.
- Sugar page: ten shades, every button goes to the retailers page; the same block
  is pasted onto the Holographic Cake Info page.
- `/collections/in-person-workshops` has 0 products; `/blogs/news` has 0 posts;
  both in the sitemap.
- No page says Marshall or Michigan (15 fetched). Organization schema has four
  empty strings in sameAs. Contact page is a form with no email or phone.
- Main menu has nine links including Terms of Use Agreement; no Shop, About or
  Workshops.
- Announcement bar "Holographic Dessert Sheets Now Available!" since the product
  was created 2025-03-22. Cake pop tutorial page: "New Product!" badge, vendor
  "MY STORE", "Shipping calculated at checkout" on a download, title with hyphens.
- Accessibility is GOOD: axe found one violation across six routes (announcement
  bar contrast). The letter says so. Do not build an a11y argument against her.
- Her LCP on the house perf profile: 3216ms on `/`. Ours is 3804ms (the hero image
  through the soft fade). The letter therefore does NOT claim faster; it claims
  a third of the JavaScript, which is measured. Fixing the demo's LCP is open.

## Demo facts corrected 2026-09-03

- Dessert Sheets are $15.50 on her store now, not $13.99. Fixed.
- Mystery Dumpling Cake Pop Label ($3, added to her store 2026-08-13) added to the
  catalog, with a `DL_MYSTERY_DUMPLING_LABEL` env slot.
- The list signup promised a free "holographic color guide". No such thing exists;
  it was invented. Removed. Do not bring it back unless she makes one.
- `SUGAR_PRICE`, `SHIPPING`, `FREE_SHIPPING_AT` remain PLACEHOLDER and the letter
  says so in section three.

## What they are

Run by Brittany, based in Marshall, Michigan, mostly online. Holographic dessert
tutorials, a Sparkling Sanding Sugar line sold through retailers, plus pop-ups and
workshops. Kevin is fairly confident she manufactures the sanding sugars herself.

## Decisions on file

**Build the storefront into the site.** Do not link out to Shopify. Part of the
pitch is that Brittany drops her Shopify bill and owns her shop. Stripe hosted
Checkout.

**Not changing her business model**, just making the site much prettier and
on-brand. Her current site is plain, in her words "not very sprinkle-y", and does
basically the right things already.

**Design direction, revised August 2026:** the first concept came back too dark.
She wants lighter, simpler, multicoloured confetti-cake-and-sprinkles styling,
fun, with sparkle effects as you scroll.

**Leave her domain spelling alone.** The live domain is `sprinklessparklesbb.com`
and the business name has the ampersand; Kevin's call is not to raise the
mismatch with her.

## Permissions

Any photos on her site, granted.
