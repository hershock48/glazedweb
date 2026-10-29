# computeTotals: the one place arithmetic happens

**What this is.** The spec for the pure function that prices a cart, the
successor of `order-quote 1.0.0` and `option-pricing 1.0.0`, for build
outline steps 1.2 and 1.5. It runs in the browser for the live quote and
on the server at commit, and the two results must be byte-identical for
the same inputs. The commit stores its output as `order_total` rows and
`order_line` snapshots (data model). Written 2026-10-29 for Codex to build
and test; the expected values below are the test table.

## Signature

```
computeTotals(input: {
  revision: MenuRevision          // the document the cart was built from
  channel: Channel                // dine_in | to_go | pickup_online | phone | delivery
  profile: ChannelProfile         // fee, waiver floor, house share, capacity
  taxRules: TaxRule[]             // category x channel -> rate_bp, included
  pizzaPolicy: PizzaPolicy        // halfPricing, sameToppingBothHalves
  cart: CartLine[]                // itemStableId, qty, picks, pizza?, note
  tipCents: number                // guest-entered, already whole cents
  discounts: AppliedDiscount[]    // empty in Stage 1
}): Quote | QuoteError
```

Every number in and out is an integer number of cents or basis points.
A fractional input is a `QuoteError`, never coerced. No floats are created
inside the function; fractions are applied as integer multiply then divide
with one rounding at the end of each line.

## Stages, in order

| Stage | What it does | Taxable | Persisted as |
|---|---|---|---|
| lines | price each cart line from the snapshot (below) | per line category | `order_line` and `line_modifier` rows |
| discount | Stage 2; empty now | reduces the taxable base of the lines it touches | `order_total` stage `discount` |
| delivery | Stage 1 has no delivery; the row exists and is zero | yes, as `fee` category | `order_total` stage `delivery` |
| fee | the guest order fee, see below | yes, category `fee` | `order_total` stage `fee` |
| tax | one row per tax category present | no | `order_total` stage `tax`, one per category |
| tip | the guest's tip, whole cents, never taxed, never in any base | no | `order_total` stage `tip` |

`subtotal` is the sum of line cents. `total` is subtotal plus every
summable row. Tip comes last so a tip can never change a tax. This is the
TastyIgniter shape with the order fixed: that system taxes a base that
includes the tip, and this one never does.

## Pricing a line

1. Resolve the item by `itemStableId` in the revision. Missing or hidden
   is `QuoteError{ code: "stale_menu" }` with the current revision number,
   so the client refreshes and shows the guest what changed
   (`order-quote 1.0.0`'s fresh-price review, kept).
2. A plain item: `unit = item.priceCents` plus a chosen variant's price if
   the item has variants (the draft grid), plus the sum of option picks.
3. Option picks are validated against the item's groups before pricing:
   required groups have at least one pick, single groups have at most one,
   multi groups respect `min` and `max`, quantity groups count summed qty
   and charge `max(0, qty - freeQuantity) * price` with free units given in
   pick order. A pick naming a group or value the item does not have is
   `QuoteError{ code: "bad_pick" }` naming the group. Group-qualified
   matching, never bare names across groups, which is the bug
   `option-pricing 1.0.0` fixed at Copper.
4. `line = unit * qty`. Snapshot name, unit, qty, every pick's label and
   cents, and the tax category onto the line.

## Pricing a pizza

The pizza block of the revision holds sizes, crusts, base prices by size
and crust, topping levels with a rate in basis points, toppings with a
price per size, and a policy. A pizza cart line carries `sizeId`,
`crustId`, and a list of toppings each with `toppingId`, `levelId` and
`section` (`whole`, `left`, `right`, or `q1` to `q4`).

1. Base: `basePriceCents[size][crust]`, by channel if the block carries a
   per-channel table (Floreant's order-type dimension), else the one table.
   A crust not offered at that size is `QuoteError{ code: "bad_crust" }`.
2. Each topping row: start from `topping.priceCents[size]`. If the level
   is not the default, multiply by `level.rateBp` and divide by 10000. If
   no explicit price exists for the level and size, the default level's
   price scaled by the rate is the price (Floreant's fallback). Then apply
   the section fraction under the policy:
   - `proportional`: whole 1, half 1/2, quarter 1/4, rounded half up on
     the row.
   - `full`: every section charges the whole price.
   - `rounded_up`: half and quarter charge the whole price when the
     topping count on that section is odd, the proportional price when
     even. (Rarely used; the shop that wants it says so.)
3. The same topping on both halves is one row at the whole price when the
   policy says `whole_price`, which is the default. The cashier is never
   asked (Floreant asks mid-order).
4. More toppings than `policy.maxToppings` is `QuoteError{ code: "too_many_toppings" }`.
5. The line's unit is base plus every topping row, times qty. Each
   topping row is snapshotted as a `line_modifier` with section, fraction,
   level id, level name and cents, so the kitchen ticket prints "L:
   pepperoni" and the report can count what sells by side.

Rounding is on the row, half up, exactly once. A row is never rounded and
then scaled again (the compounding rescale in Floreant is the thing to
avoid).

## The guest order fee

The fee is `profile.guestFeeCents`, 99 in the seed. It applies when the
channel is `pickup_online` (or `delivery` later), the operator has it on,
and the subtotal is at or above `profile.guestFeeWaivedUnderCents` (1000
in the seed). It is one `order_total` row, stage `fee`, code `guest_fee`,
title "Order fee", taxable under category `fee`, summable. Half of it is
the house's by `profile.guestFeeHouseShareBp`; that split is not a total
line, it is a `platform_fee` row written at payment from the same number.
When the operator has switched the fee to absorb, the row is zero and
hidden, and nothing else changes. Pay-at-counter orders (Copper's
`payAtPickup`) still carry the fee row; whether the house keeps all of it
is a payment question, not a pricing one.

## Tax

Michigan has one rate, 6 percent, and no local add-ons. The engine still
takes a rate per category and channel, because prepared food, grocery,
alcohol on and off premise, and the fee are separate categories on the
accountant's report, and because a second state is a configuration
change. For each category present among the lines and summable rows, sum
its base in cents, multiply by `rate_bp`, divide by 10000, round half up
once, and emit one `order_total` row stage `tax`, code `tax_<category>`,
title from the category. Tax on the fee is its own row, code `tax_fee`.
`included` categories (tax-inclusive pricing) emit the row with
`summable = false` and the base unchanged; Michigan uses none.

What 0.7 settles and this spec assumes until then: pizza and everything
hot or combined is `prepared_food`; packaged nuts and bottled drinks sold
by a restaurant whose prepared-food share exceeds 75 percent are
`prepared_food` too (the utensil standard); the fee is taxable; tips are
not. The accountant's answer changes the category table, never the code.

## The test table

Values the Stage 1 test pins. Seed menu, channel `pickup_online`, tax 6
percent on `prepared_food` and `fee`, fee 99 waived under 1000, policy
`proportional` with `whole_price` for both halves.

| Case | Lines | Fee | Tax rows | Tip | Total |
|---|---|---|---|---|---|
| A. Large hand tossed, pepperoni left, mushroom right, extra cheese left at Extra | 1700 + 125 + 100 + 263 = 2188 | 99 | food 131, fee 6 | 0 | 2424 |
| B. Same pizza, policy `full` | 1700 + 250 + 200 + 525 = 2675 | 99 | food 161 (160.5 up), fee 6 | 0 | 2941 |
| C. Pepperoni on both halves as two picks | one row at 250: 1950 | 99 | food 117, fee 6 | 0 | 2172 |
| D. One Vernors, 250 | 250 | 0 (under floor) | food 15 | 0 | 265 |
| E. Case A with the operator absorbing the fee | 2188 | 0, hidden | food 131 | 0 | 2319 |
| F. Case A with a 400 tip | 2188 | 99 | food 131, fee 6 | 400 | 2824 |
| G. Wings, no sauce picked | QuoteError bad_pick naming Sauce | | | | |
| H. Wings with Buffalo and BBQ both picked on the single-pick Sauce group | QuoteError bad_pick | | | | |
| I. Deep Dish at Small | QuoteError bad_crust | | | | |
| J. Case A against a revision that raised Large to 1800 | QuoteError stale_menu with current revision | | | | |
| K. Case A priced in the browser and on the server | identical bytes | | | | |

Case A's third topping row is 300 times 17500 over 10000 equals 525,
halved to 262.5, rounded half up to 263. If the accountant or Kevin rules
that a half of an odd price rounds down, the table changes and the code
reads the policy; it does not hard-code either.

## Errors

`QuoteError{ code, message, detail }` with codes `stale_menu`, `bad_pick`,
`bad_crust`, `too_many_toppings`, `not_whole_cents`, `closed` (ordering
window), `capacity` (slot full). Messages are plain words a guest can
read; `detail` is for the client to act on (the group name, the current
revision). Never a thrown exception for a guest's mistake.

## Done when

The function exists once, imported by the browser quote and the server
commit, with every row of the test table as a test, the three policies
covered, and the snapshot written by the commit matching the quote the
guest approved to the cent.
