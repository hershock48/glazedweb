# Odoo preset as order channel

**Source.** github.com/odoo/odoo 19.0, `addons/point_of_sale` (`models/pos_preset.py`, `static/src/app/models/pos_preset.js`, `pos_order.js`, `services/pos_store.js`), `addons/pos_restaurant` (`models/pos_preset.py`, `data/scenarios/restaurant_preset.xml`), `addons/pos_self_order` (`models/pos_preset.py`, `pos_config.py`, `controllers/orders.py`); github.com/odoo/documentation 19.0, `.../point_of_sale/extra/presets.rst`, `self_order.rst`. LGPL-3. Read 2026-10-29.

## What it is

In 19.0 the preset lives in core `point_of_sale` as `pos.preset`. One row bundles a pricelist, a fiscal position (the tax mapping), an identification rule, a return flag and an optional time-slot schedule. A config lists its available presets and a default. Picking a preset swaps the order's pricelist and fiscal position in the browser, and the server maps line taxes through that fiscal position. The restaurant module seeds Dine In, Takeout and Delivery and adds a guest-count flag. The self-order module adds a service location and exposes slot usage to kiosk and QR flows.

## Observed

| Thing | Where (file, line or function) | What it does |
|---|---|---|
| Model | `point_of_sale/models/pos_preset.py` (7 to 10) | `_name = 'pos.preset'`, inherits `pos.load.mixin` |
| Price and tax | `pos_preset.py` (13, 14) | `pricelist_id` Many2one `product.pricelist`; `fiscal_position_id` Many2one `account.fiscal.position` |
| Identification | `pos_preset.py` (15) | `identification` Selection `none`, `address`, `name`; default `none` |
| Return mode | `pos_preset.py` (16) | `is_return` Boolean, "All quantity in the cart will be in negative" |
| Timing | `pos_preset.py` (25 to 36) | `use_timing` Boolean; `resource_calendar_id` Many2one `resource.calendar`; `attendance_ids` related; `slots_per_interval` Integer default 5; `interval_time` Integer minutes default 20; `_check_slots` requires start before end |
| Loaded fields | `pos_preset.py` `_load_pos_data_fields` (43 to 46) | `name`, `pricelist_id`, `fiscal_position_id`, `is_return`, `color`, `identification`, `use_timing`, `slots_per_interval`, `interval_time`, `attendance_ids`, `write_date` |
| Slot usage | `pos_preset.py` `_compute_slots_usage` (74 to 91), `get_available_slots` (67 to 72) | counts orders with this `preset_id`, session `opened`, `preset_time` set, state `draft` or `paid`, created in the last day; returns `{'usage_utc': {"YYYY-MM-DD HH:MM:SS": [order ids]}}`; the comment says slots are dates, no slot table |
| Self slot route | `pos_self_order/controllers/orders.py` (203 to 207) | `/pos-self-order/get-slots`, auth public, jsonrpc, takes `access_token` and `preset_id` |
| Config binding | `point_of_sale/models/pos_config.py` (155 to 157) | `use_presets` Boolean; `default_preset_id` Many2one; `available_preset_ids` Many2many |
| Restaurant seeds | `restaurant_preset.xml` (20 to 35) | `pos_takein_preset` "Dine In"; `pos_takeout_preset` "Takeout" with `identification=name`, `use_timing=True` and a lunch/evening calendar; `pos_delivery_preset` "Delivery" with `identification=address` |
| Guest flag | `pos_restaurant/models/pos_preset.py` (8) | `use_guest` Boolean forces a guest count prompt |
| Self-order fields | `pos_self_order/models/pos_preset.py` (7 to 19) | `available_in_self` Boolean; `service_at` Selection `counter` ("Pickup zone"), `table`, `delivery`; `mail_template_id` |
| Takeaway rule | `orders.py` `_verify_authorization` (236, 237) | `is_takeaway` when `service_at != 'table'` |
| Self-order modes | `pos_self_order/models/pos_config.py` (37 to 50, 84 to 90, 225 to 230) | `self_ordering_mode` Selection `nothing`, `consultation` ("QR menu"), `mobile` ("QR menu + Ordering"), `kiosk`; `self_ordering_service_mode` `counter`, `table`; `self_ordering_pay_after` `meal`, `each`; the `each` label gains "(require Odoo Enterprise)" on community |
| Client swap | `models/pos_order.js` `setPreset` (200 to 208), `updatePricelistAndFiscalPosition` (706 to 712) | sets the pricelist and `fiscal_position_id` from the preset, else the config default; negates quantities when `is_return`; a customer's own pricelist or fiscal position is skipped when the preset carries one |
| Server tax mapping | `point_of_sale/models/pos_order.py` (1840 to 1842) | `order_id.fiscal_position_id.map_tax(line.tax_ids)` into the non-stored `tax_ids_after_fiscal_position` |
| Select flow | `services/pos_store.js` `selectPreset` (2544 to 2595), (1432, 1433) | requires a partner for `needsPartner`, prompts a name for `identification === "name"`, opens the slot popup when `use_timing`, else falls back to `nextSlot`; a new order gets `default_preset_id` |
| Client slots | `models/pos_preset.js` `generateSlots` (90 to 137), `computeAvailabilities` (61 to 76) | seven days of slots from `attendance_ids` (`dayofweek`, `hour_from`, `hour_to`) stepping by `interval_time`, in browser local time; `isFull` when `order_ids.size >= slots_per_interval` |
| Order fields | `pos_order.py` (345, 346, 359); `pos_session.py` `get_session_orders` (383 to 387) | `preset_id`, `floating_order_name`, `preset_time`; session orders exclude those with `preset_time` in the future |
| Self-order pricing | `orders.py` `process_order` (10 to 42) | server calls `sync_from_ui`, then `recompute_prices()`; a negative line raises; a zero total is auto-paid |
| Docs | `presets.rst` | flower shop presets for goods against service tax; restaurant presets for Dine In, Takeout, Delivery capacity; "The default preset is automatically restored for the next order" |

## What Jelly takes

1. One channel object binds a tax rule, a price list, an identification requirement and a timing rule, so the cashier picks one thing.
2. The default channel applies to every new order and is restored after each sale.
3. A channel can require a name, an address or nothing before checkout.
4. Capacity per interval is derived from order rows, with no slot table.
5. The self-order side keeps service location (pickup, table, delivery) separate from the register's channel.
6. Prices are recomputed on the server for any order from a public endpoint.
7. Orders promised for later are hidden from the live list until their time.

## What Jelly changes

1. Jelly stores `channel` as an enum column (`dine_in`, `to_go`, `pickup`, `delivery`) with a `channel_profile` row for the mutable settings, because `preset_id` points at a row that can be renamed or swapped and tax reports need a fixed value.
2. Jelly resolves the tax rule at line time and writes rate and amount on the line, because Odoo stores base `tax_ids` and maps them in a non-stored compute.
3. Jelly stores `promised_at` in UTC with the location's time zone on the order, because the client builds slots in browser local time and the server keys usage by a formatted string.
4. Jelly computes capacity in SQL over a `promised_at` range, because `_compute_slots_usage` loads a day of orders into Python per call.
5. Jelly's identification rule adds a phone option, because to-go orders are found by phone at the counter.
6. Jelly never gates pay-per-order behind an edition.
7. Jelly keeps returns off the channel and on a refund flow, because a channel that flips quantities negative mixes two concerns.

## Clean-room line

Read for design on 2026-10-29; nothing copied; LGPL-3 forbids copying into Jelly. Schema names reused as facts only: `pos.preset`, `preset_id`, `preset_time`, `interval_time`, `slots_per_interval`, `service_at`, `identification`.

## Open questions

- Whether `preset_time` is stored in UTC and shifted on the client; `_compute_slots_usage` formats it with no time zone conversion.
- How a changed `interval_time` affects orders already booked into the old grid.
- Whether `map_tax` is applied to the stored `price_subtotal_incl` for register orders, or only to accounting entries.
