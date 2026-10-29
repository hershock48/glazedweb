# Reports, version one

**What this is.** Build outline step 1.10, designed against the Toast and
Aloha complaints in the study: Toast cannot save a custom report or export
order lines and has no report builder; Aloha splits reporting across four
tools and its phone app is rated under two stars. Reporting is where a
small studio can be plainly better, because it is design and data, not
scale. Claude designs, Codex builds. Written 2026-10-29. Phone first.

## The rule underneath

Every component emits the rows its report needs at the time of the event.
No report is reconstructed from logs later. Stage 1 reports read `order`,
`order_line`, `line_modifier`, `order_total`, `tender`, `kitchen_action`
timestamps, `order_status_history` and `funnel_event`. Nothing else.

## The screens, in the order an owner opens them

1. **Today.** One screen that answers "how are we doing" in five seconds.
   Orders placed, sales, the hourly bars for today against the same
   weekday last week, the current pause and busy state, and the three
   latest orders. Refreshes itself.
2. **Sales.** A date range with presets (today, yesterday, this week, last
   week, this month, a custom range). Totals split exactly as the receipt
   is: subtotal, discounts, fees, tax by category, tips, total, and by
   tender. By channel (online, phone, to-go, dine-in). By hour of day as a
   heat strip. By day as bars.
3. **Items.** What sold, how many, for how much, by section. Toppings by
   side (left, right, whole) and by level, because the pizza matrix
   records them. Variants (pint, pitcher, growler) as their own rows.
   Sort by count or by cents. Tap an item for its hourly curve.
4. **Kitchen.** Time from placed to accepted, accepted to ready, by hour
   and by station, from `kitchen_action` timestamps. The slowest ten
   tickets of the range with their contents. The pause and busy dial
   history.
5. **Guests.** Repeat guests by phone (hashed in storage, shown as last
   four), first-time versus returning by week, the guests who ordered
   most. No marketing in Stage 1; the question is who comes back.
6. **Funnel.** Landing, menu, item, cart, checkout, placed, as counts and
   as the drop between each, by day and by referrer. The sentence at the
   top says it plainly: "412 people opened the menu this week, 61 placed
   an order."
7. **Close of day.** The day as a text at close and as a page: orders,
   sales, fees collected, tax collected by category, tips, tenders. In
   Stage 2 this becomes the Z report with the drawer.

## Saved reports and export

Any filter set on any screen can be saved with a name and reopened. The
owner's saved reports sit at the top of the Sales screen. Every screen has
Export: the rows behind the screen as CSV with a header, and the raw
order-line export (one row per line with its picks, section, level, cents,
tax category, channel, promised and placed times) for any range, which is
the thing Toast's reviewers ask for and cannot get. Both are generated on
request and streamed, never cached as files.

## On the phone

Every screen is a single column. Numbers are large, labels small and
above. Bars are tappable. Date presets are chips. Nothing requires a
horizontal scroll at 320 pixels (the glaze width check applies). The
owner's thumb reaches every control from the bottom third.

## What it never does

- Totals the guest fee as a metric on any shop-facing screen. It appears
  on receipts and on this owner-only report.
- Invents a number. A screen with no data for the range says so.
- Mixes test orders in. The demo tenant's data is the demo's; a real
  tenant's `status = building` orders are flagged and excluded from Today.

## Done when

Ryan, or the demo's Dana Mills, opens it on a phone and finds the number
they asked for without help. The Stage 1 gate names that sentence.
