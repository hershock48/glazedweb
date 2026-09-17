# Software inventory, 2026-09-17 (R01 / D1)

Every copy of pricing, cart and order validation, provider payments, fulfillment and kitchen, notifications, owner and staff auth, and storage across the nine client repositories. Read from git refs only, never from working trees. Line counts are `git show <ref>:<path> | wc -l`. Byte comparisons are LF-normalized `cmp`; "differs in N lines" is the count of `<` and `>` lines from `diff`.

This is analysis only. No client code changed. It feeds R02 (the comparison matrix); it does not recommend.

## Refs read

| Repo | Ref | Commit | Why this ref |
|---|---|---|---|
| copperac | origin/fix/launch-readiness | 16f3ea4 | Newest ordering code; main is 8 review-workflow commits ahead and 17 behind. |
| devine | origin/fix/launch-readiness | e08293e | Newest payments code; main is 8 review-workflow commits ahead and 8 behind. |
| truenorth | origin/fix/launch-readiness | 19f0b61 | 3 real commits ahead of main; main's 8 extra commits are all `.github` review workflow. |
| mikesplace | origin/chore/shared-component-references | 66e069a | Only branch carrying `.glazed/components.json`; 13 ahead of main; main's 8 extra commits are all `.github`. |
| louies | origin/main | f08637a | Only branch. |
| sprinklesandsparklesbb | origin/main | bfcdc51 | `store-wip` (689d21d) is older and does not build. |
| pjs | origin/main | 3aecdd6 | Only branch. |
| anchor | origin/main | 89a8512 | Only branch. |
| cookinwithbeans | origin/main | e84df12 | Only branch. |

The task said "otherwise main". For truenorth and mikesplace the named branches are the newest ordering code and main differs from them only in `.github/`, so those were used. Distinct source files inventoried per repo (a file that serves two concerns appears in two tables but is counted once; test files are counted separately, 18 in all): copperac 49, mikesplace 35, devine 38, louies 13, truenorth 6, sprinklesandsparklesbb 7, pjs 16, anchor 19, cookinwithbeans 15. Total 198.

Pin column: "pinned <id>" means the file is a copy listed in that repo's `.glazed/components.json`; "not pinned" means the repo has a manifest but the file is not in it; "no manifest" means the repo has no `.glazed/components.json`. Manifests exist in copperac (19 pins), mikesplace (19 pins) and devine (1 pin, workroom-session).

## 1. Pricing and money math

| Repo | Branch | File | Lines | Unit / provider | Pin | Distinctive |
|---|---|---|---|---|---|---|
| copperac | fix/launch-readiness | lib/ordering/pricing.ts | 90 | integer cents | pinned option-pricing 1.0.0 | Group-qualified option picks, required/single/multi rules, disambiguated labels. Identical in mikesplace. |
| copperac | fix/launch-readiness | lib/ordering/order-quote.ts | 85 | integer cents, BigInt tax | pinned order-quote 1.0.0 | Tax = (subtotal + fee) x basis points / 10000, half-up in BigInt. Tip capped at 2x subtotal. Qty 1 to 12, 30 lines max. `quoteWasReviewed` requires the client to echo unit cents and totals. |
| copperac | fix/launch-readiness | lib/ordering/config.ts | 51 | | not pinned | feeCents 99, feeStudioCents 49 "when Stripe is wired", taxBasisPoints 600, window minutes hard-coded per weekday, KITCHEN_PIN_FALLBACK "0133". |
| copperac | fix/launch-readiness | lib/ordering/menu-document-fields.ts | 124 | string to cents | not pinned | `parseMenuPrice` / `moneyText` for the owner price editor and menu snapshot validation. Copperac only. |
| copperac | fix/launch-readiness | lib/__tests__/ordering-pricing.mjs | 147 | test | | |
| copperac | fix/launch-readiness | tools/workroom-tests/order-quote.test.cjs | 99 | test | | Differs in 17 lines from mikesplace's 108-line copy. |
| mikesplace | chore/shared-component-references | lib/ordering/pricing.ts | 90 | integer cents | pinned option-pricing 1.0.0 | Identical to copperac. |
| mikesplace | chore/shared-component-references | lib/ordering/order-quote.ts | 85 | integer cents | pinned order-quote 1.0.0 | Identical to copperac. |
| mikesplace | chore/shared-component-references | lib/ordering/config.ts | 59 | | not pinned | Same fee and tax numbers; window derived from BAR_HOURS and KITCHEN_CLOSE_MINUTES in lib/site.ts; `fmtMinutes` helper; PIN fallback "0116". Differs in 50 lines from copperac. |
| mikesplace | chore/shared-component-references | lib/ordering/seed.ts | 74 | string to cents | not pinned | Regex-parses "12.50" menu strings to cents and generates the orderable doc from lib/menu.ts. The workroom is the only price editor. |
| mikesplace | chore/shared-component-references | tools/workroom-tests/order-quote.test.cjs | 108 | test | | |
| devine | fix/launch-readiness | src/lib/intake.ts | 410 | float dollars | not pinned | `priceOrder`: qty 1 to 99, line = round(price x qty x 100) / 100, subtotal in dollars, no tax. Also renders shop ticket and customer mail. |
| devine | fix/launch-readiness | src/lib/square/payments.ts | 173 | Square, cents at charge | not pinned | `cents(dollars) = Math.round(d * 100)`. Card fee is a separate Square line item. App fee defaults to 99c (SQUARE_APP_FEE_CENTS), taken only via OAuth and only when fee x 5 <= total. |
| devine | fix/launch-readiness | src/app/api/order/route.ts | 149 | Square | not pinned | Online convenience fee = round(base x cardFeePct / 100) + appFeeCents; delivery fee by zip; delivery minimums 45 / 55 dollars. |
| devine | fix/launch-readiness | src/app/api/workroom/pay/route.ts | 75 | Square | not pinned | In-shop card fee = round(round(subtotal x 100) x pct / 100), appFeeCents 0. A second fee formula from the online one. |
| devine | fix/launch-readiness | src/lib/workroom/quote-math.ts | 253 | float dollars | not pinned | Wedding and funeral quotes: stems x cost x markup, labor pct, tax pct, delivery, setup. `cents()` here means round to 2 decimals in dollars. |
| devine | fix/launch-readiness | src/lib/site.ts | 166 | | not pinned | deliveryFees by zip, deliveryMinimums, cardFeePct 3. |
| louies | main | src/lib/money.ts | 12 | integer cents | no manifest | One formatter. |
| louies | main | src/lib/cart.ts | 111 | integer cents | no manifest | Prices come from src/data/shipping.ts only; qty clamp 1 to 20, at most 12 slugs; shipping included in box price; no tax. |
| louies | main | src/data/shipping.ts | 121 | integer cents | no manifest | Box catalog with `comingSoon` and optional price. |
| truenorth | fix/launch-readiness | src/app/api/order/route.ts | 239 | dollar strings | no manifest | Prices parsed from "$5.75" display strings with a regex; total is an "estimate, pay at pickup"; qty 0 to 20 per item. |
| truenorth | fix/launch-readiness | src/data/menu.ts | 156 | dollar strings | no manifest | Prices stored as display strings ("+$2", "$13"). |
| sprinklesandsparklesbb | main | lib/catalog.js | 223 | integer cents | no manifest | SUGAR_PRICE 950, SHIPPING 650, FREE_SHIPPING_AT 5000, all marked PLACEHOLDER. Digital items forced to qty 1. |
| pjs | main | lib/ordering/config.js | 41 | | no manifest | feeCents 99, feeStudioCents 49, taxRate 0.06 float, basePickupMinutes 12, PIN fallback "0105". |
| pjs | main | app/api/ordering/order/route.js | 252 | integer cents, float tax | no manifest | Option pricing inline (predates pricing.ts); qty 1 to 200; tax = Math.round((subtotal + fee) x 0.06); tip cap 2x. |
| pjs | main | lib/ordering/catalog.js | 146 | | no manifest | Per-location catalog. |
| cookinwithbeans | main | src/lib/ordering/config.ts | 29 | | no manifest | feeCents 99, no feeStudioCents, taxRate 0.06 float, basePickupMinutes 10, PIN fallback "0707". |
| cookinwithbeans | main | src/app/api/ordering/order/route.ts | 205 | integer cents, float tax | no manifest | Option pricing inline; qty 1 to 12; 30-line cap; same float tax as pjs. |
| anchor | main | lib/workroom/book.ts | 195 | integer cents | no manifest | Policy amountCents and cadence; Payment premiumCents, feeCents, totalCents. |
| anchor | main | lib/pay.ts | 512 | Stripe | no manifest | convenienceFeeCents 99 as a second Stripe line item; `feePercentFor` for subscriptions; `recordSession` and `recordInvoice` infer the fee from total > amountCents. |
| anchor | main | lib/site.ts | 453 | | no manifest | payments.convenienceFeeCents 99, payLinkDays 120, reminderDaysBefore [7, 0]. |

Fee constants seen: 99 cents in copperac, mikesplace, pjs, cookinwithbeans, anchor and DeVine (as the Square app fee); DeVine also adds 3 percent. Tax: 600 basis points in BigInt (copperac, mikesplace), 0.06 float (pjs, cookinwithbeans), none (DeVine, Louie's, True North, Sprinkles, Anchor).

## 2. Cart and order validation

| Repo | Branch | File | Lines | Provider | Pin | Distinctive |
|---|---|---|---|---|---|---|
| copperac | fix/launch-readiness | app/api/ordering/order/route.ts | 76 | none | not pinned | Requires a client UUID v4 `attemptId`; `requestFingerprint` (sha256 of key-sorted body); a recorded attempt is replayed, a different fingerprint gets 409 "conflict". Contact caps 60/25/120/300; window, pause, fresh menu, `quoteWasReviewed`, 21+ acknowledgment. Identical in mikesplace. |
| copperac | fix/launch-readiness | lib/ordering/order-acceptance.ts | 81 | | pinned order-acceptance 1.0.0 | 64 KiB body cap; `validateSettlement`; one CTE inserts attempt, order, print jobs and email confirmation atomically; memory twin. |
| copperac | fix/launch-readiness | lib/ordering/order-recovery.ts | 45 | | pinned order-recovery 1.0.0 | Browser-side reading of attempt outcomes. |
| copperac | fix/launch-readiness | app/api/ordering/attempt/route.ts | 26 | | not pinned | GET replays a recorded attempt; POST records a cancellation with null fingerprint. Identical in mikesplace. |
| copperac | fix/launch-readiness | components/ordering/OrderClient.tsx | 737 | | not pinned | Attempt reference kept in sessionStorage (RECOVERY_KEY). Differs in 46 lines from mikesplace. |
| copperac | fix/launch-readiness | lib/ordering/time.ts | 59 | | not pinned | `orderingWindow` from config minutes. Identical in mikesplace. |
| copperac | fix/launch-readiness | tools/workroom-tests/order-acceptance.test.cjs | 108 | test | | Differs in 2 lines from mikesplace. |
| mikesplace | chore/shared-component-references | app/api/ordering/order/route.ts | 76 | none | not pinned | Identical to copperac. |
| mikesplace | chore/shared-component-references | lib/ordering/order-acceptance.ts | 81 | | pinned order-acceptance 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/order-recovery.ts | 45 | | pinned order-recovery 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | app/api/ordering/attempt/route.ts | 26 | | not pinned | Identical. |
| mikesplace | chore/shared-component-references | components/ordering/OrderClient.tsx | 737 | | not pinned | Differs in 46 lines from copperac. |
| mikesplace | chore/shared-component-references | lib/ordering/time.ts | 59 | | not pinned | Identical. |
| devine | fix/launch-readiness | src/lib/intake.ts | 410 | | not pinned | `priceOrder(raw)`: qty 1 to 99, delivery needs street and town, pickup or delivery. |
| devine | fix/launch-readiness | src/app/api/order/route.ts | 149 | Square | not pinned | Card path needs a client UUID v4 `attemptKey` and CHECKOUT_CARDS=on; fingerprint = sha256 of {order minus number, deliveryFee, convenienceCents}. Unpaid path emails and writes the board with no idempotency. |
| devine | fix/launch-readiness | src/app/api/order/payment-status/route.ts | 16 | Square | not pinned | Reconcile by attemptKey. |
| devine | fix/launch-readiness | src/components/Cart.tsx | 179 | | not pinned | Cart in sessionStorage "devines.cart.v1". |
| devine | fix/launch-readiness | src/components/CartView.tsx | 862 | | not pinned | Checkout UI including Square card form. |
| devine | fix/launch-readiness | tests/checkout-ui.test.cjs | 126 | test | | |
| louies | main | src/lib/cart.ts | 111 | | no manifest | Cart is the cookie `lb_cart` = "slug:qty,..." (httpOnly false, 30 days); `sellable()` drops unpriced and comingSoon. |
| louies | main | src/app/api/cart/route.ts | 100 | | no manifest | Form POST add/set/remove; `safeBack` compares parsed origin; DIRECT_CHECKOUT=1 gate. |
| louies | main | src/app/api/checkout/route.ts | 266 | Stripe | no manifest | `missingDetails` (10 digits, 2-letter state, zip regex) checked before either path; honeypot after cart read so the log holds the box; `clean()` flattens newlines and slices by code point. |
| louies | main | src/app/api/order/route.ts | 99 | | no manifest | Inquiry form, no cart; three result states sent / unconfigured / failed. |
| louies | main | src/lib/availability.ts | 285 | | no manifest | Per-item day, season, lead-days and occasional availability with closures. |
| louies | main | src/components/OrderForm.tsx | 133 | | no manifest | |
| truenorth | fix/launch-readiness | src/app/api/order/route.ts | 239 | | no manifest | ORDERING_LIVE=false in src/data/site.ts returns 503 for JSON and form posts; per-shop `item.at` availability; qty fields per item, no cart. |
| truenorth | fix/launch-readiness | src/components/OrderForm.tsx | 292 | | no manifest | Client state only, form falls back to a plain POST. |
| truenorth | fix/launch-readiness | tests/ordering-availability.test.cjs | 40 | test | | Proves a disabled route never sends mail. |
| sprinklesandsparklesbb | main | components/CartProvider.jsx | 94 | | no manifest | Cart in localStorage "ssbb-cart-v1"; qty cap 99; digital qty 1. |
| sprinklesandsparklesbb | main | app/api/checkout/route.js | 116 | Stripe | no manifest | Rebuilds items by slug server-side, dedupes, qty 1 to 99; cart slugs travel in session metadata. |
| pjs | main | app/api/ordering/order/route.js | 252 | none | no manifest | No attempt id; qty 1 to 200; location-aware (locationSlug) window and printers; validation inline. |
| pjs | main | lib/ordering/window.js | 81 | | no manifest | ORDERING_DEMO_ALWAYS_OPEN=1 override; per-location hours. |
| pjs | main | components/ordering/OrderClient.jsx | 666 | | no manifest | No recovery reference. |
| cookinwithbeans | main | src/app/api/ordering/order/route.ts | 205 | none | no manifest | No attempt id; qty 1 to 12; 30-line cap routes to catering. |
| cookinwithbeans | main | src/lib/ordering/time.ts | 41 | | no manifest | Truck window. Differs in 78 lines from copperac's 59-line time.ts. |
| anchor | main | app/api/pay/find/route.ts | 57 | | no manifest | Policy number plus zip lookup, honeypot, memory limiter 8 per 10 min. |
| anchor | main | lib/paylink.ts | 70 | | no manifest | HMAC-SHA256 base64url pay link with expiry in the payload, timing-safe compare. |
| anchor | main | app/api/pay/checkout/route.ts | 60 | Stripe | no manifest | Token must read; interest keys capped at 8. |

## 3. Provider payments

| Repo | Branch | File | Lines | Provider | Pin | Distinctive |
|---|---|---|---|---|---|---|
| copperac | fix/launch-readiness | lib/ordering/config.ts | 51 | Toast (external), demo checkout | not pinned | Public /order links to order.toasttab.com/online/copper-pub. Demo notice "No card is charged". |
| copperac | fix/launch-readiness | app/api/ordering/order/route.ts | 76 | none | not pinned | `paid: false` always; `payAtPickup` boolean. |
| mikesplace | chore/shared-component-references | app/api/ordering/order/route.ts | 76 | none | not pinned | Same. |
| devine | fix/launch-readiness | src/lib/square/client.ts | 87 | Square REST via fetch | not pinned | Sandbox or production base by SQUARE_ENV; 20 s timeout; optional Square-Version header. |
| devine | fix/launch-readiness | src/lib/square/oauth.ts | 249 | Square OAuth | not pinned | Code exchange and refresh; tokens in the square_oauth table; env token fallback. |
| devine | fix/launch-readiness | src/lib/square/payment-engine.ts | 41 | provider-neutral | not pinned | `runPayment` state machine prepared / processing / unknown / completed / failed; `PaymentNotSubmitted`. |
| devine | fix/launch-readiness | src/lib/square/payment-attempts.ts | 99 | Postgres | not pinned | devine_payment_attempts keyed by attempt_key plus fingerprint, claimed FOR UPDATE; devine_payment_reviews for owner "no payment" resolution. |
| devine | fix/launch-readiness | src/lib/square/payment-service.ts | 145 | Square | not pinned | `takePayment` refuses without the postgres backend; gateway identity (env, location, viaOAuth) must match the saved attempt; card, cash, manual. |
| devine | fix/launch-readiness | src/lib/square/payments.ts | 173 | Square Orders and Payments | not pinned | Provider idempotency key = sha256("order:" or "payment:" + attemptKey) first 40 chars; DECLINED code set; app fee only via OAuth. |
| devine | fix/launch-readiness | src/lib/square/sync.ts | 187 | Square Catalog | not pinned | Catalog sync. |
| devine | fix/launch-readiness | src/lib/square/web-sdk.ts | 44 | Square Web Payments SDK | not pinned | Script loader, sandbox or production CDN. |
| devine | fix/launch-readiness | src/app/api/square/webhook/route.ts | 218 | Square | not pinned | HMAC-SHA256 over url + raw body; matches reference_id or a DV-####-#### note; records square_sales. |
| devine | fix/launch-readiness | src/app/api/square/connect/route.ts | 44 | Square OAuth | not pinned | |
| devine | fix/launch-readiness | src/app/api/square/oauth/callback/route.ts | 44 | Square OAuth | not pinned | |
| devine | fix/launch-readiness | src/app/api/square/sales/route.ts | 19 | Square | not pinned | |
| devine | fix/launch-readiness | src/app/api/square/sync/route.ts | 86 | Square | not pinned | |
| devine | fix/launch-readiness | src/app/api/checkout/config/route.ts | 38 | Square | not pinned | CHECKOUT_CARDS=on plus SQUARE_APP_ID gate; exposes feeCents and cardPct. |
| devine | fix/launch-readiness | src/app/api/workroom/pay/route.ts | 75 | Square | not pinned | In-shop card, cash, manual; 409 when already paid. |
| devine | fix/launch-readiness | src/components/workroom/PayControls.tsx | 267 | Square | not pinned | |
| devine | fix/launch-readiness | tests/payment-engine.test.cjs | 105 | test | | |
| devine | fix/launch-readiness | tests/payment-recovery.test.cjs | 62 | test | | |
| devine | fix/launch-readiness | tests/payment-routes.test.cjs | 90 | test | | |
| devine | fix/launch-readiness | tests/order-refunds.test.cjs | 48 | test | | |
| devine | fix/launch-readiness | tools/payment-tests/review-regressions.test.cjs | 224 | test | | |
| louies | main | src/app/api/checkout/route.ts | 266 | Stripe Checkout via fetch | no manifest | No SDK; success_url goes through /api/paid; no webhook; bakery is emailed before the redirect; a Stripe refusal falls through to the email path. |
| louies | main | src/app/api/paid/route.ts | 78 | Stripe via fetch | no manifest | Verifies payment_status = paid with the secret key on GET; clears the cart cookie; sets `lb_paid` for 10 minutes. |
| louies | main | src/lib/flags.ts | 19 | | no manifest | DIRECT_CHECKOUT env flag gates cart, checkout and paid routes. |
| sprinklesandsparklesbb | main | app/api/checkout/route.js | 116 | Stripe SDK | no manifest | `stripe.checkout.sessions.create`; allow_promotion_codes; cart in metadata. |
| sprinklesandsparklesbb | main | app/api/stripe/webhook/route.js | 152 | Stripe SDK | no manifest | `constructEvent`; checkout.session.completed sends buyer and owner mail; mail failure still returns 200. |
| sprinklesandsparklesbb | main | app/api/download/[slug]/route.js | 54 | Stripe SDK | no manifest | Retrieves the session to gate a digital download. |
| anchor | main | lib/stripe.ts | 171 | Stripe via fetch | no manifest | Stripe-Account header (Connect); own signature verifier with 300 s tolerance; STRIPE_API_BASE override. |
| anchor | main | lib/pay.ts | 512 | Stripe via fetch | no manifest | Payment or subscription mode; application_fee_amount or application_fee_percent; billing_cycle_anchor and trial_end; `recordSession`, `recordInvoice`, `endAutopay`, reminders. |
| anchor | main | app/api/stripe/webhook/route.ts | 72 | Stripe | no manifest | checkout.session.completed, invoice.paid, customer.subscription.deleted. |
| anchor | main | app/api/pay/checkout/route.ts | 60 | Stripe | no manifest | |
| anchor | main | app/api/workroom/payments/route.ts | 115 | Stripe | no manifest | |
| anchor | main | app/api/workroom/book/autopay/route.ts | 30 | Stripe | no manifest | |
| truenorth | fix/launch-readiness | (none) | | none | | Pay at pickup. |
| pjs | main | (none) | | none | | Demo checkout. |
| cookinwithbeans | main | (none) | | none | | Demo checkout. |

Provider count: Square in one repo (DeVine), Stripe in three (Louie's via fetch, Sprinkles via SDK, Anchor via fetch with Connect), Toast external in one (copperac), none in four.

## 4. Fulfillment and kitchen

| Repo | Branch | File | Lines | Provider | Pin | Distinctive |
|---|---|---|---|---|---|---|
| copperac | fix/launch-readiness | lib/ordering/kitchen-operations.ts | 124 | Postgres | pinned kitchen-operations 1.0.0 | Revision = sha256 of canonical JSON; commands carry operationId; statuses new / accepted / done / cancelled / refunded. |
| copperac | fix/launch-readiness | lib/ordering/kitchen-request.ts | 40 | | pinned kitchen-request 1.0.0 | |
| copperac | fix/launch-readiness | lib/ordering/kitchen-service.ts | 46 | | not pinned | `runKitchenAction`, 8 KiB body cap, refuses memory backend in production. Identical in mikesplace. |
| copperac | fix/launch-readiness | lib/ordering/store.ts | 376 | Postgres or memory | not pinned | KitchenState unavailable / busyMinutes / pausedUntil; ticket numbers; menu document with revision and history. Differs in 59 lines from mikesplace. |
| copperac | fix/launch-readiness | lib/ordering/printer-jobs.ts | 195 | Postgres | pinned printer-jobs 1.0.0 | Leased fetch, unique index one fetched job per printer, print history and actions. |
| copperac | fix/launch-readiness | lib/ordering/printer-review.ts | 16 | | pinned printer-review 1.0.0 | |
| copperac | fix/launch-readiness | lib/ordering/printing.ts | 142 | text tickets | not pinned | ORDERING_PRINTERS JSON; tokens must be 32+ chars in production; kitchen ticket and front slip. Differs in 4 lines (site name) from mikesplace. |
| copperac | fix/launch-readiness | app/api/printer/route.ts | 55 | CloudPRNT-style | not pinned | Basic auth id:token, timing-safe; POST poll, GET fetch, DELETE settle. Identical in mikesplace. |
| copperac | fix/launch-readiness | app/api/kitchen/operation/route.ts | 19 | | not pinned | Identical in mikesplace. |
| copperac | fix/launch-readiness | app/api/kitchen/orders/route.ts | 16 | | not pinned | Identical. |
| copperac | fix/launch-readiness | app/api/kitchen/state/route.ts | 19 | | not pinned | Identical. |
| copperac | fix/launch-readiness | app/api/kitchen/menu/route.ts | 41 | | not pinned | Copperac only; mikesplace has no kitchen menu route. |
| copperac | fix/launch-readiness | app/api/kitchen/print-review/route.ts | 25 | | not pinned | Identical. |
| copperac | fix/launch-readiness | components/ordering/KitchenClient.tsx | 590 | | not pinned | Differs in 55 lines from mikesplace. |
| copperac | fix/launch-readiness | components/ordering/PrinterReview.tsx | 36 | | not pinned | Identical. |
| copperac | fix/launch-readiness | tools/workroom-tests/kitchen-operations.test.cjs | 158 | test | | Differs in 2 lines. |
| copperac | fix/launch-readiness | tools/workroom-tests/printer-jobs.test.cjs | 123 | test | | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/kitchen-operations.ts | 124 | Postgres | pinned kitchen-operations 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/kitchen-request.ts | 40 | | pinned kitchen-request 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/kitchen-service.ts | 46 | | not pinned | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/store.ts | 365 | Postgres or memory | not pinned | `setMenuDoc` with no revision or history; advisory lock 4213712 (copperac 4213711). |
| mikesplace | chore/shared-component-references | lib/ordering/printer-jobs.ts | 195 | Postgres | pinned printer-jobs 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/printer-review.ts | 16 | | pinned printer-review 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/printing.ts | 142 | text tickets | not pinned | |
| mikesplace | chore/shared-component-references | app/api/printer/route.ts | 55 | CloudPRNT-style | not pinned | Identical. |
| mikesplace | chore/shared-component-references | components/ordering/KitchenClient.tsx | 585 | | not pinned | |
| devine | fix/launch-readiness | src/lib/workroom/store.ts | 1052 | Postgres or memory | not pinned | WorkroomOrder statuses new / confirmed / made / out / done / canceled; `markOrderRefunded` only for canceled orders with a recorded payment. |
| devine | fix/launch-readiness | src/app/api/workroom/orders/route.ts | 144 | | not pinned | PATCH status; "out" refused for pickup; "done" on delivery sends the delivered mail; refund confirmation needs the owner role. No revision check. |
| devine | fix/launch-readiness | src/components/workroom/Board.tsx | 1087 | | not pinned | Dated florist board. |
| devine | fix/launch-readiness | src/lib/workroom/derive.ts | 356 | | not pinned | Stem and recipe derivation for inventory. |
| devine | fix/launch-readiness | src/components/workroom/Inventory.tsx | 1287 | | not pinned | |
| devine | fix/launch-readiness | src/components/workroom/WeeklyOrderScreen.tsx | 550 | | not pinned | |
| devine | fix/launch-readiness | src/components/workroom/FuneralPad.tsx | 870 | | not pinned | |
| devine | fix/launch-readiness | src/components/workroom/QuoteBuilder.tsx | 786 | | not pinned | |
| pjs | main | lib/ordering/store.js | 307 | Postgres or memory | no manifest | Statuses new / accepted / done / refunded; `enqueuePrintJob`; no attempts or operations tables. |
| pjs | main | lib/ordering/printing.js | 125 | text tickets | no manifest | ORDERING_PRINTERS as "id:role:location" CSV, no token; printers filtered by order location. |
| pjs | main | app/api/kitchen/state/route.js | 39 | | no manifest | POST writes unavailable, busyMinutes, pauseMinutes directly with no revision. |
| pjs | main | app/api/kitchen/orders/route.js | 25 | | no manifest | accepted / done / refunded. |
| pjs | main | app/api/kitchen/menu/route.js | 22 | | no manifest | |
| pjs | main | lib/ordering/board.js | 292 | | no manifest | `counterSections()`. |
| pjs | main | components/ordering/KitchenClient.jsx | 428 | | no manifest | |
| cookinwithbeans | main | src/lib/ordering/store.ts | 379 | Postgres or memory | no manifest | Statuses new / accepted / done / refunded, no cancelled. |
| cookinwithbeans | main | src/lib/ordering/printing.ts | 142 | text tickets | no manifest | JSON printers with token, no length rule. Differs in 30 lines from copperac. |
| cookinwithbeans | main | src/app/api/printer/route.ts | 75 | | no manifest | Printer identified by `?token=` query, plain `===` compare. |
| cookinwithbeans | main | src/app/api/kitchen/state/route.ts | 84 | | no manifest | PATCH toggle86 / busyMinutes / pauseMinutes, no revision. |
| cookinwithbeans | main | src/app/api/kitchen/orders/route.ts | 53 | | no manifest | LEGAL accepted / done / refunded. |
| cookinwithbeans | main | src/app/api/kitchen/menu/route.ts | 36 | | no manifest | |
| cookinwithbeans | main | src/components/ordering/KitchenClient.tsx | 466 | | no manifest | |
| cookinwithbeans | main | src/components/ordering/MenuEditor.tsx | 378 | | no manifest | Kitchen-side menu editor; copperac's 325-line cousin differs in 243 lines. |
| louies | main | src/lib/board.ts | 90 | | no manifest | Today / soon / notice board from availability; no kitchen. |
| truenorth | fix/launch-readiness | (none) | | | | Order is an email. |
| sprinklesandsparklesbb | main | (none) | | | | Digital download plus owner-shipped physical goods. |
| anchor | main | (none) | | | | No fulfillment; policy book. |

Order status sets seen: five (copperac, mikesplace), four with refunded and no cancelled (pjs, cookinwithbeans), six with canceled and no refunded status (DeVine, refund is a flag on a canceled order).

## 5. Notifications

No SMS code exists in any of the nine repos (no twilio or similar import). Print is in section 4.

| Repo | Branch | File | Lines | Provider | Pin | Distinctive |
|---|---|---|---|---|---|---|
| copperac | fix/launch-readiness | lib/ordering/notification-outbox.ts | 167 | Postgres queue | pinned notification-outbox 1.0.0 | 5 attempts in 20 minutes, 60 s lease, idempotency key retired after 23 h; history and review tables. |
| copperac | fix/launch-readiness | lib/ordering/notification-provider.ts | 29 | Resend via fetch | pinned notification-provider 1.0.0 | Idempotency-Key header, bounded JSON reads, 8 s timeout; `retrieveResend` checks last_event against the stored payload. |
| copperac | fix/launch-readiness | lib/ordering/notification-request.ts | 23 | | pinned notification-request 1.0.0 | |
| copperac | fix/launch-readiness | lib/ordering/email.ts | 44 | Resend | not pinned | ORDERING_EMAIL_ENABLED=true gate plus RESEND_API_KEY and INQUIRY_FROM; refuses without postgres; text-only confirmation. Differs in 2 lines (site name) from mikesplace. |
| copperac | fix/launch-readiness | app/api/kitchen/notifications/route.ts | 31 | | not pinned | Owner review. Identical in mikesplace. |
| copperac | fix/launch-readiness | app/api/kitchen/notifications/dispatch/route.ts | 11 | | not pinned | Queue run. Identical. |
| copperac | fix/launch-readiness | components/ordering/NotificationInbox.tsx | 54 | | not pinned | Identical. |
| copperac | fix/launch-readiness | app/api/inquiry/route.ts | 156 | Resend via fetch | not pinned | Contact form. Differs in 12 lines from mikesplace. |
| copperac | fix/launch-readiness | tools/workroom-tests/notification-outbox.test.cjs | 99 | test | | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/notification-outbox.ts | 167 | Postgres queue | pinned notification-outbox 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/notification-provider.ts | 29 | Resend via fetch | pinned notification-provider 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/notification-request.ts | 23 | | pinned notification-request 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/ordering/email.ts | 44 | Resend | not pinned | |
| mikesplace | chore/shared-component-references | app/api/inquiry/route.ts | 152 | Resend via fetch | not pinned | |
| devine | fix/launch-readiness | src/lib/intake.ts | 410 | nodemailer SMTP | not pinned | SMTP_HOST / SMTP_USER / SMTP_PASS, port 465; `sendOrder`, `sendPaymentNotice` (shop and customer), `sendDeliveredEmail`, `sendWorkroomReceipt`. |
| devine | fix/launch-readiness | src/app/api/inquiry/route.ts | 165 | nodemailer SMTP | not pinned | |
| devine | fix/launch-readiness | src/lib/square/payment-attempts.ts | 99 | Postgres | not pinned | notified, customer_notified and notify_until columns; payment notices retried through `fulfillPayment`. |
| louies | main | src/lib/mail.ts | 181 | nodemailer SMTP (dynamic import) | no manifest | `configured()` needs SMTP_HOST / USER / PASS / ORDER_TO; SendResult sent / unconfigured / failed. |
| truenorth | fix/launch-readiness | src/app/api/order/route.ts | 239 | Resend SDK | no manifest | HTML order mail to the shop; RESEND_API_KEY and ORDER_TO. |
| truenorth | fix/launch-readiness | src/app/api/inquiry/route.ts | 185 | Resend SDK | no manifest | |
| sprinklesandsparklesbb | main | app/api/stripe/webhook/route.js | 152 | Resend via fetch | no manifest | Buyer and owner HTML mail from the webhook; no idempotency; failure logged, 200 returned. |
| sprinklesandsparklesbb | main | app/api/subscribe/route.js | 51 | Resend via fetch | no manifest | List signup relayed to ORDER_TO. |
| pjs | main | lib/ordering/email.js | 76 | Resend via fetch | no manifest | ORDER_FROM defaults to orders@glazedweb.com; awaited since 3aecdd6. |
| cookinwithbeans | main | src/lib/ordering/email.ts | 84 | Resend via fetch | no manifest | INQUIRY_FROM; `sendOrderConfirmation` and `sendRefundNotice`. |
| anchor | main | lib/pay.ts | 512 | Resend via fetch | no manifest | `sendReminder` and `notifyAgency`; reminded map per due date. |
| anchor | main | app/api/cron/reminders/route.ts | 64 | | no manifest | CRON_SECRET bearer, timing-safe; reminderDaysBefore [7, 0]. |
| anchor | main | app/api/intake/route.ts | 186 | Resend via fetch | no manifest | INTAKE_TO. |
| anchor | main | app/api/quote/route.ts | 150 | Resend via fetch | no manifest | |

Mail transports: Resend via raw fetch in six repos (copperac, mikesplace, sprinkles, pjs, cookinwithbeans, anchor), Resend SDK in one (truenorth), nodemailer SMTP in two (DeVine, Louie's). Only copperac and mikesplace queue with retries and provider idempotency keys.

## 6. Owner and staff auth

| Repo | Branch | File | Lines | Provider | Pin | Distinctive |
|---|---|---|---|---|---|---|
| copperac | fix/launch-readiness | lib/workroom/session.ts | 22 | HMAC token | pinned workroom-session 1.0.0 | Payload.signature, signed with secret and the role's PIN, 18 h expiry, 24-char nonce. Identical in mikesplace and DeVine. |
| copperac | fix/launch-readiness | lib/workroom/auth.ts | 72 | | not pinned | WORKROOM_PASSCODE min 4 chars, dev fallback "workroom-dev"; WORKROOM_SESSION_SECRET min 32; cookie copperac_workroom, sameSite strict. Differs in 12 lines from mikesplace. |
| copperac | fix/launch-readiness | lib/workroom/login-limit.ts | 44 | Postgres | not pinned | Per-client key = sha256 of the trusted IP header (x-vercel-forwarded-for on Vercel, else WORKROOM_TRUSTED_IP_HEADER); 5 per 10 min in copper_login_attempts; memory in dev; throws in production without a DB. Differs in 65 lines from mikesplace. |
| copperac | fix/launch-readiness | lib/workroom/ratelimit.ts | 47 | memory | not pinned | Imported by nothing in copperac or mikesplace. Identical apart from the global name to anchor/lib/ratelimit.ts. |
| copperac | fix/launch-readiness | lib/ordering/auth.ts | 63 | | not pinned | Kitchen PIN must be 6 to 12 digits in production and differ from the fallback and the passcode; staff cookie copper_kitchen; an owner workroom cookie also grants the kitchen. Differs in 8 lines (names) from mikesplace. |
| copperac | fix/launch-readiness | lib/ordering/login-limit.ts | 4 | | not pinned | Wraps `allowLogin(client, now, "kitchen")`. |
| copperac | fix/launch-readiness | app/api/kitchen/login/route.ts | 71 | | not pinned | Same-origin check via sec-fetch-site and origin; 1 KiB body cap; GET answers {authed, role, configured}. Differs in 6 lines from mikesplace. |
| copperac | fix/launch-readiness | app/api/workroom/login/route.ts | 20 | | not pinned | Differs in 9 lines from mikesplace. |
| copperac | fix/launch-readiness | app/api/workroom/logout/route.ts | 11 | | not pinned | Identical in mikesplace. |
| copperac | fix/launch-readiness | components/workroom/Gate.tsx | 68 | | not pinned | Differs in 2 lines. |
| copperac | fix/launch-readiness | tools/workroom-tests/kitchen-access.test.cjs | 200 | test | | Differs in 63 lines from mikesplace's 159. |
| mikesplace | chore/shared-component-references | lib/workroom/session.ts | 22 | HMAC token | pinned workroom-session 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/workroom/auth.ts | 72 | | not pinned | Adds "secret must differ from passcode"; cookie mikesplace_workroom. |
| mikesplace | chore/shared-component-references | lib/workroom/login-limit.ts | 31 | Postgres | not pinned | One global bucket, row id 'owner' in mikes_login_attempts, no client identity. |
| mikesplace | chore/shared-component-references | lib/ordering/login-limit.ts | 24 | Postgres | not pinned | One global bucket, row id 'kitchen'. Differs in 28 lines from copperac's 4-line wrapper. |
| mikesplace | chore/shared-component-references | lib/ordering/auth.ts | 63 | | not pinned | Cookie mikes_kitchen. |
| mikesplace | chore/shared-component-references | app/api/kitchen/login/route.ts | 67 | | not pinned | No `loginClient`. |
| mikesplace | chore/shared-component-references | app/api/workroom/login/route.ts | 17 | | not pinned | |
| mikesplace | chore/shared-component-references | tools/workroom-tests/workroom-auth.test.cjs | 164 | test | | Mikesplace only. |
| devine | fix/launch-readiness | src/lib/workroom/session.ts | 22 | HMAC token | pinned workroom-session 1.0.0 | Identical (the registry source). |
| devine | fix/launch-readiness | src/lib/workroom/auth.ts | 31 | | not pinned | Two PINs: WORKROOM_PIN (staff, dev 0830) and WORKROOM_OWNER_PIN (dev 0831); role chosen by plain `===` on the PIN; cookie devine_workroom. |
| devine | fix/launch-readiness | src/lib/workroom/login-limit.ts | 50 | Postgres | not pinned | Per-client trusted-IP key like copperac but LIMIT 10 (copperac 5), its own pool (max 2) and devine_login_attempts. Differs in 40 lines from copperac. |
| devine | fix/launch-readiness | src/app/api/workroom/login/route.ts | 39 | | not pinned | PIN compared with `===`, not timing-safe. |
| devine | fix/launch-readiness | tests/workroom-session.test.cjs | 41 | test | | |
| anchor | main | lib/workroom/auth.ts | 112 | hash cookie | no manifest | Cookie value is sha256("anchor-workroom-v1:" + passcode); no session secret, no expiry inside the token (cookie maxAge 18 h); timing-safe compare; sameSite lax. Differs in 94 lines from copperac. |
| anchor | main | lib/ratelimit.ts | 51 | memory | no manifest | 5 failures per 10 min keyed by first x-forwarded-for hop; resets on redeploy. |
| anchor | main | app/api/workroom/login/route.ts | 51 | | no manifest | |
| anchor | main | components/workroom/Gate.tsx | 78 | | no manifest | Differs in 26 lines from copperac. |
| pjs | main | lib/ordering/auth.js | 36 | PIN cookie | no manifest | Cookie value is the PIN itself; `===` compare; KITCHEN_PIN default "0105"; sameSite lax; no rate limit; no owner role. |
| pjs | main | app/api/kitchen/login/route.js | 13 | | no manifest | |
| cookinwithbeans | main | src/lib/ordering/auth.ts | 28 | PIN cookie | no manifest | Same scheme as pjs, default "0707". Differs in 22 lines (TS types). |
| cookinwithbeans | main | src/app/api/kitchen/login/route.ts | 18 | | no manifest | |
| louies | main | (none) | | | | No owner surface. |
| truenorth | fix/launch-readiness | (none) | | | | No owner surface. |
| sprinklesandsparklesbb | main | (none) | | | | No owner surface. |

Auth schemes seen: signed session token with PIN-bound signature (copperac, mikesplace, DeVine); passcode hash as the cookie value (anchor); the PIN as the cookie value (pjs, cookinwithbeans). Login throttles: per-client Postgres rows (copperac, DeVine), one global Postgres row (mikesplace), per-IP memory (anchor), none (pjs, cookinwithbeans).

## 7. Storage

| Repo | Branch | File | Lines | Provider | Pin | Distinctive |
|---|---|---|---|---|---|---|
| copperac | fix/launch-readiness | lib/ordering/store.ts | 376 | Postgres (pg Pool max 3) or memory | not pinned | DATABASE_URL or POSTGRES_URL, refuses when both are set and differ; no `ssl` option (the connection string decides); schema under advisory lock 4213711; tables ordering_orders, _state, _print_jobs, _printers, _menu plus attempts, confirmations, operations, print history, notification history, menu history; memory writes refused in production. |
| copperac | fix/launch-readiness | lib/workroom/store.ts | 252 | Postgres (second pool) or memory | not pinned | `connectionVar` also accepts any *_DATABASE_URL suffix; JSON key/data tables; copper_login_attempts; advisory lock 4213702. Differs in 28 lines (names) from mikesplace. |
| copperac | fix/launch-readiness | lib/workroom/content-cas.ts | 32 | Postgres or memory | pinned content-cas 1.0.0 | Identical in mikesplace. |
| copperac | fix/launch-readiness | lib/workroom/event-cas.ts | 15 | Postgres | pinned event-cas 1.0.0 | Identical. |
| copperac | fix/launch-readiness | lib/ordering/menu-document-store.ts | 25 | Postgres | not pinned | ordering_menu.revision plus ordering_menu_history. Copperac only. |
| copperac | fix/launch-readiness | lib/workroom/write-guard.ts | 11 | | not pinned | 503 in production without a DB. Copperac only. |
| copperac | fix/launch-readiness | tools/workroom-tests/menu-document.test.cjs | 83 | test | | Copperac only. |
| mikesplace | chore/shared-component-references | lib/ordering/store.ts | 365 | Postgres or memory | not pinned | Advisory lock 4213712; `setMenuDoc` without history. |
| mikesplace | chore/shared-component-references | lib/workroom/store.ts | 252 | Postgres or memory | not pinned | mikes_login_attempts. |
| mikesplace | chore/shared-component-references | lib/workroom/content-cas.ts | 32 | | pinned content-cas 1.0.0 | Identical. |
| mikesplace | chore/shared-component-references | lib/workroom/event-cas.ts | 15 | | pinned event-cas 1.0.0 | Identical. |
| devine | fix/launch-readiness | src/lib/workroom/store.ts | 1052 | Postgres or memory | not pinned | `ssl: { rejectUnauthorized: false }` off localhost; 11 tables: workroom_orders, _stems, _recipes, _quotes, square_sales, _varieties, _weekly_orders, _plants, square_oauth, agreement_acceptances, photo_submissions. |
| devine | fix/launch-readiness | src/lib/square/payment-attempts.ts | 99 | Postgres (own pool max 3) | not pinned | devine_payment_attempts and devine_payment_reviews. |
| devine | fix/launch-readiness | src/lib/workroom/login-limit.ts | 50 | Postgres (third pool max 2) | not pinned | devine_login_attempts. Three separate pools in one app. |
| devine | fix/launch-readiness | src/app/api/photos/route.ts | 182 | Postgres | not pinned | JPEG accepted as a base64 data URL into photo_submissions. |
| anchor | main | lib/workroom/store.ts | 339 | Postgres (dynamic pg import) or memory | no manifest | `rejectUnauthorized: false` unless localhost or sslmode=disable; JSON tables plus workroom_leads; memory bag on globalThis. Differs in 315 lines from copperac's workroom store. |
| pjs | main | lib/ordering/store.js | 307 | Postgres or memory | no manifest | `rejectUnauthorized: false` off localhost; the original five ordering_* tables; memory allowed in production. |
| cookinwithbeans | main | src/lib/ordering/store.ts | 379 | Postgres or memory | no manifest | Same as pjs in TypeScript; pool __beansPgPool. Differs in 335 lines from copperac. |
| louies | main | (none) | | cookie only | | No database; the cart cookie and the emailed order are the record. |
| truenorth | fix/launch-readiness | src/data/liveCase.ts | 129 | HTTP feed cache | no manifest | Flavor board from SCOOPLIST_FEED_URL through `unstable_cache`, 3 s timeout; no writes. |
| sprinklesandsparklesbb | main | (none) | | localStorage cart | | Stripe holds the order record. |

Storage seen: Postgres through `pg` in six repos (copperac, mikesplace, DeVine, anchor, pjs, cookinwithbeans), every one with a memory fallback keyed on globalThis; no Neon, Supabase, KV, Blob or JSON-file store in any of the nine. Nothing pins the Postgres host; every repo takes DATABASE_URL or POSTGRES_URL.

## Same code in more than one place

Method: LF-normalized SHA-256 over every .ts/.tsx/.js/.jsx/.cjs/.mjs blob in the nine refs. 57 identical groups span more than one repo: 50 are copperac and mikesplace pairs, 1 spans copperac, mikesplace and DeVine, and 6 are brand components or config boilerplate shared by other repos. The lists below leave out config boilerplate (eslint, postcss, robots) and the GlazedCredit / GlazedPlate brand components (identical across anchor, cookinwithbeans, devine, louies; separately identical across pjs and sprinkles).

### Byte-identical, copperac and mikesplace

Ordering: order-quote.ts (85), order-acceptance.ts (81), order-recovery.ts (45), pricing.ts (90), kitchen-operations.ts (124), kitchen-request.ts (40), kitchen-service.ts (46), printer-jobs.ts (195), printer-review.ts (16), notification-outbox.ts (167), notification-provider.ts (29), notification-request.ts (23), time.ts (59).

Routes: api/ordering/order (76), api/ordering/attempt (26), api/ordering/state (39), api/kitchen/operation (19), api/kitchen/orders (16), api/kitchen/state (19), api/kitchen/print-review (25), api/kitchen/notifications (31), api/kitchen/notifications/dispatch (11), api/printer (55), api/workroom/events (46), api/workroom/events/contact (21), api/workroom/events/image (18), api/workroom/logout (11), img/events/[id] (23).

Workroom: session.ts (22, also DeVine), content-cas.ts (32), event-cas.ts (15), event-photo.ts (16), events-def.ts (75), menu-write.ts (30), owner-request.ts (24), owner-save.ts (45), event-service.ts (19).

Components and pages: NotificationInbox.tsx (54), PrinterReview.tsx (36), workroom/resize.ts (41), (site)/kitchen/page.tsx (25), workroom/menu/page.tsx (14), jsonld.ts (8).

Tests: event-controls (131), notification-outbox (99), printer-jobs (123).

That is 43 identical source files plus 3 identical tests between the two restaurants. 19 of the 43 are pinned in both manifests; 24 are not (the 15 routes, kitchen-service, time.ts, event-service, jsonld and the 5 components and pages).

### Byte-identical across three repos

`lib/workroom/session.ts` (22 lines): copperac, mikesplace, devine/src/lib/workroom/session.ts. Pinned in all three.

### Near-identical (same purpose, measured difference)

| Pair | Lines | Differs in |
|---|---|---|
| copperac vs mikesplace lib/ordering/auth.ts | 63 / 63 | 8 lines (cookie and secret names only) |
| copperac vs mikesplace lib/workroom/auth.ts | 72 / 72 | 12 lines (names plus mikesplace's extra secret != passcode check) |
| copperac vs mikesplace lib/workroom/ratelimit.ts | 47 / 47 | 8 lines (global name); anchor/lib/ratelimit.ts differs from copperac's in 26 lines |
| copperac vs mikesplace lib/workroom/store.ts | 252 / 252 | 28 lines (globals, table name) |
| copperac vs mikesplace lib/ordering/store.ts | 376 / 365 | 59 lines (menu history, advisory lock id) |
| copperac vs mikesplace lib/ordering/email.ts | 44 / 44 | 2 lines (site key) |
| copperac vs mikesplace lib/ordering/printing.ts | 142 / 142 | 4 lines (ticket header) |
| copperac vs mikesplace lib/ordering/config.ts | 51 / 59 | 50 lines |
| copperac vs mikesplace lib/ordering/login-limit.ts | 4 / 24 | 28 lines (different scheme) |
| copperac vs mikesplace lib/workroom/login-limit.ts | 44 / 31 | 65 lines (different scheme) |
| copperac vs mikesplace app/api/kitchen/login/route.ts | 71 / 67 | 6 lines |
| copperac vs mikesplace app/api/workroom/login/route.ts | 20 / 17 | 9 lines |
| copperac vs mikesplace app/api/workroom/menu/route.ts | 40 / 37 | 3 lines |
| copperac vs mikesplace app/api/inquiry/route.ts | 156 / 152 | 12 lines |
| copperac vs mikesplace components/ordering/OrderClient.tsx | 737 / 737 | 46 lines |
| copperac vs mikesplace components/ordering/KitchenClient.tsx | 590 / 585 | 55 lines |
| copperac vs mikesplace components/workroom/EventsScreen.tsx | 436 / 436 | 28 lines |
| copperac vs mikesplace components/workroom/MenuEditor.tsx | 207 / 207 | 6 lines |
| copperac vs mikesplace components/workroom/Gate.tsx | 68 / 68 | 2 lines |
| copperac vs mikesplace lib/workroom/menu-def.ts | 45 / 48 | 11 lines |
| copperac vs mikesplace tools/workroom-tests/kitchen-access.test.cjs | 200 / 159 | 63 lines |
| copperac vs mikesplace tools/workroom-tests/order-quote.test.cjs | 99 / 108 | 17 lines |
| copperac vs mikesplace tools/workroom-tests/kitchen-operations.test.cjs | 158 / 158 | 2 lines |
| copperac vs mikesplace tools/workroom-tests/order-acceptance.test.cjs | 108 / 108 | 2 lines |
| devine vs copperac lib/workroom/login-limit.ts | 50 / 44 | 40 lines (same trusted-header logic, different limit and pool) |
| devine vs copperac lib/workroom/auth.ts | 31 / 72 | 101 lines |
| devine vs copperac api/workroom/logout | 10 / 11 | 7 lines |
| anchor vs copperac lib/workroom/auth.ts | 112 / 72 | 94 lines |
| anchor vs copperac api/workroom/logout | 11 / 11 | 2 lines |
| anchor vs copperac components/workroom/Gate.tsx | 78 / 68 | 26 lines |
| anchor vs copperac components/workroom/Chrome.tsx | 68 / 59 | 61 lines |
| anchor vs copperac lib/workroom/store.ts | 339 / 252 | 315 lines |
| cookinwithbeans vs copperac lib/ordering/printing.ts | 142 / 142 | 30 lines |
| cookinwithbeans vs copperac api/ordering/state | 37 / 39 | 10 lines |
| cookinwithbeans vs copperac lib/ordering/store.ts | 379 / 376 | 335 lines |
| cookinwithbeans vs copperac lib/ordering/auth.ts | 28 / 63 | 65 lines |
| cookinwithbeans vs copperac api/ordering/order | 205 / 76 | 247 lines |
| cookinwithbeans vs copperac components/ordering/MenuEditor.tsx | 378 / 325 | 243 lines |
| pjs vs cookinwithbeans lib/ordering/auth | 36 / 28 | 22 lines (same scheme, JS vs TS) |
| pjs vs cookinwithbeans api/kitchen/login | 13 / 18 | 13 lines |
| pjs vs cookinwithbeans lib/ordering/config | 41 / 29 | 48 lines |
| pjs vs cookinwithbeans lib/ordering/store | 307 / 379 | 224 lines |
| pjs vs cookinwithbeans api/ordering/order | 252 / 205 | 213 lines |
| pjs vs cookinwithbeans components/ordering/KitchenClient | 428 / 466 | 732 lines |
| louies vs truenorth api/order/route.ts | 99 / 239 | 318 lines (both inquiry-style, not the same code) |

The pjs and cookinwithbeans pair, which apps.md calls "same shape", is not byte-identical anywhere; the closest files differ in 13 and 22 lines and are JS versus TS rewrites of the same scheme.

Also measured: copperac's `lib/ordering/toast-menu.json` is 11,441 lines against cookinwithbeans' 416; they share a name and nothing else.

## What R02 must decide

Questions the comparison matrix has to answer, each drawn from a difference measured above.

1. Money representation. Integer cents (copperac, mikesplace, Louie's, Sprinkles, Anchor, pjs, cookinwithbeans) versus float dollars converted at charge time (DeVine intake.ts and quote-math.ts) versus display strings parsed by regex (True North). Which one is the contract, and what happens to DeVine's `round(price * qty * 100) / 100` lines and its two different card-fee formulas (online: pct of base plus 99c app fee; in-shop: pct only)?

2. Tax. BigInt basis points with half-up rounding (copperac, mikesplace) versus `Math.round((subtotal + fee) * 0.06)` in a float (pjs, cookinwithbeans) versus no tax at all (five repos). Is the float path a defect to retire or a client choice?

3. Quantity and size limits. Qty caps of 12 (copperac, mikesplace, cookinwithbeans), 20 (Louie's, True North), 99 (DeVine, Sprinkles), 200 (pjs); line caps of 30 (copperac, mikesplace, cookinwithbeans) and 12 (Louie's). Which limits are trade facts and which are accidents?

4. Idempotency. Three schemes exist: client UUID attemptId plus sha256 request fingerprint settled in one CTE (copperac, mikesplace); client UUID attemptKey plus sha256 of a chosen subset, claimed FOR UPDATE with a provider idempotency key derived from it (DeVine payments); none (pjs, cookinwithbeans, DeVine's unpaid path, Louie's, Sprinkles, True North). Are the first two one contract with two adapters, or two contracts? DeVine's unpaid order path writes the board with no attempt record; is that in scope?

5. Provider idempotency keys. DeVine sends Square `sha256("order:" + attemptKey)[0..40]`; the notification provider sends Resend an outbox key with a 23-hour retirement; Louie's, Sprinkles and Anchor send Stripe nothing. Which provider calls need keys, and does one derivation rule fit Square, Stripe and Resend?

6. Order state machines. Five states with cancelled and refunded (copperac, mikesplace, revision-checked), four states with refunded and no cancelled (pjs, cookinwithbeans, no revision), six states with canceled and a refund flag (DeVine). What is the shared order-state contract R03 is meant to extract, and does "refunded" belong to the order or to the payment?

7. Kitchen state changes. Revision-checked commands with operationId and receipts (copperac, mikesplace) versus direct POST or PATCH writes (pjs, cookinwithbeans, DeVine orders route). Is the older direct write a defect once the shared component exists?

8. Staff and owner auth. Three schemes: PIN-bound signed session token (copperac, mikesplace, DeVine), passcode hash as the cookie value (Anchor), PIN as the cookie value compared with `===` (pjs, cookinwithbeans). DeVine also compares the PIN with `===` before signing. Which scheme is the boundary, and does Anchor's no-secret cookie meet it?

9. Login throttling. Per-client Postgres rows keyed by a trusted IP header with limit 5 (copperac) or 10 (DeVine); one global Postgres row with no client identity (mikesplace); per-IP memory limiter that resets on redeploy (Anchor); nothing (pjs, cookinwithbeans). Mikesplace's global bucket locks every user out after five failures by anyone. Which is the contract, and is `lib/workroom/ratelimit.ts` (unused in copperac and mikesplace) dead code to delete?

10. Kitchen PIN policy. Copperac requires 6 to 12 digits in production and rejects the fallback and the passcode; mikesplace copies that; pjs and cookinwithbeans accept any string with 4-digit defaults; DeVine has two PINs (staff and owner) with 4-digit dev defaults. One rule or per-client?

11. Printer authentication. Basic auth id:token with 32-char minimum and timing-safe compare (copperac, mikesplace); `?token=` query with `===` (cookinwithbeans); no token at all, "id:role:location" (pjs). Is the CloudPRNT-style protocol in copperac the single printer contract, and what happens to pjs's per-location routing that copperac lacks?

12. Notification delivery. Durable outbox with five attempts, leases and delivery checks (copperac, mikesplace); single awaited fetch with no retry (pjs, cookinwithbeans, Sprinkles, Anchor, True North); SMTP through nodemailer (DeVine, Louie's). Does the outbox become the contract for every order mail, and does it need an SMTP adapter?

13. Mail transport. Six raw-fetch Resend copies, one Resend SDK, two nodemailer. Is the fetch adapter in notification-provider.ts the one adapter, and who owns the SMTP path?

14. Payments. Square with durable attempts and owner review (DeVine); Stripe hosted Checkout with no webhook and email-before-redirect (Louie's); Stripe SDK with webhook (Sprinkles); Stripe via fetch with Connect, subscriptions and application fees (Anchor); Toast external link (copperac). The backlog says do not force these into one flow. What is provider-independent in DeVine's payment-engine.ts (41 lines, no Square import) and is it the seed of R03's contract?

15. Fee inference. Anchor infers the 99c fee from `total > amountCents` in recordSession and recordInvoice; DeVine records feeCents from the provider result; copperac records feeCents from config. Which is the audit rule?

16. Storage. Six `pg` copies with memory fallbacks; copperac refuses memory writes in production, pjs and cookinwithbeans allow them; pjs, cookinwithbeans, DeVine and Anchor set `rejectUnauthorized: false` off localhost while copperac and mikesplace set no `ssl` option. DeVine opens three pools. Is one connection module the contract, and what is the TLS rule?

17. Menu as the price source. Copperac keeps an ordering_menu document with revision and history plus a kitchen menu route; mikesplace generates the orderable doc from lib/menu.ts through seed.ts and has no kitchen menu route; pjs and cookinwithbeans have kitchen-side menu editors. Which is the price-of-record model?

18. Manifest coverage. 24 of the 43 identical copperac and mikesplace source files are not in either manifest (all 15 API routes, kitchen-service.ts, time.ts, event-service.ts, jsonld.ts, the components and pages). Do routes and components get pinned, or is the manifest for lib files only?

19. Carts. Cookie string (Louie's), sessionStorage (DeVine, and the attempt reference in copperac and mikesplace), localStorage (Sprinkles), no cart (True North). Is cart persistence in scope for a shared contract?

20. Mikesplace's branch. The manifest and the newest code live on `chore/shared-component-references`, 13 commits ahead of main. Which ref does R02 compare against, and when does it merge?
