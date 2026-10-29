# TastyIgniter cart conditions: totals as ordered, persisted lines

**Source.** `tastyigniter/ti-ext-cart` and `tastyigniter/core`, branch `4.x`, MIT. Delivery and Coupon read from `tastyigniter/ti-ext-local` and `tastyigniter/ti-ext-coupons`, same branch. Raw files read 2026-10-29. Nothing installed or executed.

## What it is

TastyIgniter prices a cart by running a sorted list of "conditions" over a running total. Each condition has a priority, a guard, rules, and actions written as strings such as `+6%`. At checkout every condition result is copied onto the order as a row in `order_totals`, and each cart line is copied into `order_menus` with its name, price, and serialized options. The order total is then recomputed from those rows, so a receipt never depends on the live catalogue.

## Observed

| Thing | Where (file, class, method or line) | What it does |
| --- | --- | --- |
| Base class | `ti-ext-cart/src/CartCondition.php`, `$priority = 0` L38, `apply()` L107-127 | A false `beforeApply()` resets `passed` and `calculatedValue` and returns the subtotal untouched. Otherwise rules are validated, then `calculate()`. |
| Action math | `ti-ext-cart/src/Concerns/CartConditionHelper.php`, `processActionValue()` L38-57, `calculateActionValue()` L59-88 | `%` means a share of the running total, else a fixed amount. Each action is rounded to `valuePrecision` (default 2). An `inclusive` action adds to `calculatedValue` and never moves the total. Result floored at 0. |
| Sort and apply | `ti-ext-cart/src/CartConditions.php`, `apply()` L11-16 | `sortBy(priority)` then `reduce` from `content->subtotal()`. `applied()` keeps those with `isValid()` true. |
| Loading | `ti-ext-cart/src/Cart.php`, `loadCondition()` L329-350; `src/Classes/CartManager.php`, `loadCartConditions()` L206-223; `src/Extension.php`, `registerCartConditions()` L146-165 | Null priority becomes last + 1. Conditions come from the `conditions` setting, skipped when `status` is false. Names: `paymentFee`, `tax`, `tip`. |
| Tax | `ti-ext-cart/src/CartConditions/Tax.php`, priority 300 L22, `onLoad()` L35-46, `calculate()` L70-85 | `taxInclusive = !tax_menu_price`. Rate is `(int)setting('tax_percentage')`, so 6.5 becomes 6. Inclusive mode rewrites the rate as `rate / ((100 + rate) / 100)` and flags the action `inclusive`. With `tax_delivery_charge` off, the delivery charge is removed before the percent and added back after. |
| Tip | `Tip.php`, priority 100 L18, `beforeApply()` L34-52, `getActions()` L55-67 | Needs `enable_tipping`. Amount must match `^\d+(\.\d{1,2})?%?$`. `%` is appended when `tip_value_type` is not `F` and `isCustom` is unset. Presets: `tip_amounts` repeater in `resources/models/cartsettings.php` L91-131. |
| Payment fee | `PaymentFee.php`, priority 600 L15, `beforeApply()` L29-46, `getActions()` L49-57; `src/Classes/OrderManager.php`, `processPayment()` L265-270 | Loads `Payment::whereCode(metaData.code)`, skips when `order_fee <= 0`. Action `+fee`, with `%` when `order_fee_type === 2`. Payment refused when a fee is due and not applied. |
| Delivery and Coupon | `ti-ext-local/src/CartConditions/Delivery.php` priority 100 L15; `ti-ext-coupons/src/CartConditions/Coupon.php` priority 200 L25, `removeable` L23 | Delivery applies only to delivery orders. Coupon uses `ActsAsItemable` to attach to lines (`Cart.php` L362-371), reports `0 - calculatedValue`, and apportions fixed discounts L144-160. |
| Effective order | Priorities above | Delivery and Tip 100, Coupon 200, Tax 300, PaymentFee 600. Tax sees tip and delivery in its base; the fee comes after tax. |
| Totals built | `OrderManager.php`, `getCartTotals()` L312-359 | Item conditions summed by name with `is_summable = false`. Cart conditions get `is_summable = !isInclusive()`. `subtotal` at priority 0, `total` at 999 floored at 0. |
| Checkout events and save | `OrderManager.php` L196, L235, L242; `saveOrder()` L225-233 | `igniter.checkout.beforeSaveOrder`, `afterSaveOrder`, `beforePayment`. Retried transaction: lock row, `saveQuietly()`, `addOrderMenus()`, `addOrderTotals()`. |
| `order_totals` | `core/database/migrations/system/2015_03_25_000001_create_tables.php`, `_create_order_totals()` L472-484; `admin/2021_05_29_010000_add_is_summable_on_order_totals_table.php` | `code` string(30), `title`, `value` decimal(15), `priority` declared `boolean`. `is_summable` added 2021, backfilled where title is not like `%included%`. `src/Models/OrderTotal.php` casts value float, priority int. |
| Totals persisted | `src/Models/Concerns/ManagesOrderItems.php`, `addOrderTotals()`, `calculateTotals()` | `updateOrCreate` by `code`, delete the rest. Subtotal = sum(`order_menus.subtotal`); total = max(0, subtotal + summable values), written to `orders.order_total`. |
| Line snapshot | `ManagesOrderItems.php`, `addOrderMenus()`, `addOrderMenuOptions()`; `src/Models/OrderMenu.php` L50 | `name`, `price`, `subtotal`, `comment`, `option_values = serialize($cartItem->options)`. Per value: `order_option_name`, `order_option_price` (0 when nothing is chargeable), `quantity`, `free_qty`. |
| Status history | `core/src/Admin/Models/StatusHistory.php`, `createHistory()` L108-138; `core/src/Admin/Models/Concerns/LogsStatusHistory.php`, `addStatusHistory()` L45-62 | Polymorphic row with `status_id`, `user_id`, `comment`, `notify`. Saves, then writes the parent `status_id` and `status_updated_at` by query. |

## What Jelly takes

1. An ordered list of adjusters, each a pure step over a running total.
2. Every adjuster result persisted on the order as a line with code, title, value, order, and a summable flag.
3. Line snapshots of name, unit price, and chosen option values at purchase, never re-read from the catalogue.
4. The order total recomputed from persisted lines after the write.
5. A guard that skips an adjuster and clears its stale value in the same step.
6. A per-gateway fee, fixed or percent, with a hard refusal to take payment when the fee is due and missing.
7. Append-only status rows carrying who, comment, and notify flag; the parent caches the latest status.
8. One transaction around the order, its lines, and its totals.

## What Jelly changes

1. Integer cents everywhere. TastyIgniter rounds each percent action to currency precision and sums floats, which drifts across steps.
2. Tax has a declared base. Tip sits at priority 100 and is taxed at 300; delivery is carved out by a special case inside `Tax::calculate()`. Jelly marks each line and fee taxable or not, and tip is never taxable.
3. Rates in basis points, because the `(int)` cast on `tax_percentage` drops fractional rates.
4. Named stages (discounts, delivery, tax, fee, tip) instead of magic integers.
5. No PHP `serialize` blobs. `order_menus.option_values` and `orders.cart` are readable only by PHP; Jelly stores `jsonb`.
6. No session state inside adjusters. `CartCondition` keeps metadata in `Session`; Jelly's `computeTotals(cart, rules)` is pure and runs at quote and at commit.
7. Inclusive tax is an explicit `included` flag on the line, replacing the `title not like '%included%'` backfill.
8. An idempotency key on commit, since a retried transaction alone does not stop a double submit.

## Clean-room line

Read for design on 2026-10-29; MIT allows a direct port with the notice; nothing is intended to be ported, the shape (ordered adjusters, persisted total lines, snapshot lines, status rows) is re-expressed in TypeScript and the arithmetic is rewritten in integer cents.

## Open questions

- Where `order_fee` and `order_fee_type` live on `payments`; the docblock declares them, the column or JSON key was not traced.
- Whether `order_totals.priority` was widened from `boolean` after 2015.
- Whether `status_history.staff_id` (2015 schema) was renamed to `user_id` (model). The rename was not located.
- What sets the Tip `isCustom` metadata; the theme component was not read.
