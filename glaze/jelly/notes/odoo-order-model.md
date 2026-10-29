# Odoo POS order model

**Source.** github.com/odoo/odoo 19.0, `addons/point_of_sale/models/` (`pos_session.py`, `pos_order.py`, `pos_payment.py`, `pos_payment_method.py`, `pos_config.py`) and `addons/pos_restaurant/models/` (`pos_restaurant.py`, `restaurant_order_course.py`, `pos_order.py`, `pos_order_line.py`). LGPL-3. Read 2026-10-29.

## What it is

A register config (`pos.config`) opens a `pos.session`, which is the shift. Every sale is a `pos.order` with `pos.order.line` and `pos.payment` rows, each keyed by a client-generated `uuid`. Money fields are Odoo `Monetary`, a numeric rounded to the currency. The restaurant module adds `restaurant.floor`, `restaurant.table` and `restaurant.order.course` and hangs `table_id`, `customer_count` and `course_ids` on the order.

## Observed

| Thing | Where (file, line or function) | What it does |
|---|---|---|
| Session states | `pos_session.py` `POS_SESSION_STATE` (23 to 28), `state` (48 to 51) | `opening_control`, `opened`, `closing_control`, `closed`; Selection, default `opening_control`, indexed |
| Session identity | `pos_session.py` (30 to 46) | `config_id` Many2one; `name` Char default `/`; `user_id` Many2one; `start_at`, `stop_at` Datetime |
| Cash control | `pos_session.py` (55 to 76) | `cash_control` Boolean from the config; `cash_journal_id` Many2one `account.journal`; `cash_register_balance_start`, `cash_register_balance_end_real` Monetary; `cash_register_balance_end` computed theoretical; `cash_register_difference` computed real minus theoretical; `cash_real_transaction` Monetary |
| Difference accounts | `pos_session.py` `action_pos_session_close` (497 to 512) | a short posts to `cash_journal_id.loss_account_id`, an over to `profit_account_id`; a missing account raises |
| Opening balance | `pos_session.py` `action_pos_session_open` (372 to 380) | copied from the previous session's `cash_register_balance_end_real` |
| Rescue | `pos_session.py` (84 to 87) | `rescue` Boolean, auto-created session for orphan orders |
| Order identity | `pos_order.py` (304, 306, 369, 388) | `name` Char default `/`; `date_order` Datetime indexed; `uuid` Char default `uuid4()`; `_unique_uuid` constraint |
| Order numbers | `pos_order.py` (350, 368); `pos_config.py` `_get_next_order_refs` (217 to 221) | `pos_reference` Char indexed; `tracking_number` Char; built as `<yy><device>-<config_id>-<seq>` with `tracking_number = seq % 1000` |
| Order state | `pos_order.py` (335 to 337, 376 to 379) | `draft`, `cancel`, `paid`, `done`; `invoice_status` is a separate Selection |
| Amounts | `pos_order.py` (312 to 316) | `amount_difference`, `amount_tax`, `amount_total`, `amount_paid`, `amount_return`, all Monetary; `margin`, `margin_percent` computed |
| Order links | `pos_order.py` (321 to 356) | `lines` One2many; `session_id`; `config_id` computed stored; `partner_id`; `pricelist_id`; `fiscal_position_id`; `payment_ids`; `account_move` |
| Channel fields | `pos_order.py` (345, 346, 359) | `preset_id` Many2one `pos.preset`; `floating_order_name` Char; `preset_time` Datetime |
| Tip and misc | `pos_order.py` (347, 348, 361 to 373) | `is_tipped` Boolean; `tip_amount` Monetary; `ticket_code` Char; `is_edited`, `has_deleted_line`, `is_refund` Boolean; `nb_print` Integer; `general_customer_note`, `internal_note` Text |
| Line identity | `pos_order.py` (1615, 1640, 1658, 1669) | `name` Char; `order_id` Many2one cascade; `uuid` Char default `uuid4()`; `_unique_uuid` constraint |
| Line product and qty | `pos_order.py` (1617 to 1632) | `product_id` Many2one required; `attribute_value_ids` Many2many; `custom_attribute_value_ids` One2many; `price_unit` Float `digits=0`; `qty` Float default 1; `price_extra` Float; `price_type` Selection `original`, `manual`, `automatic`; `discount` Float percent |
| Line totals | `pos_order.py` (1625 to 1628) | `price_subtotal` and `price_subtotal_incl` Monetary, readonly, required, stored as sent |
| Line taxes | `pos_order.py` (1641 to 1649, 1840 to 1842) | `tax_ids` Many2many `account.tax`; `tax_ids_after_fiscal_position` computed by `fiscal_position_id.map_tax(tax_ids)`, not stored |
| Line extras | `pos_order.py` (1650 to 1667) | `full_product_name`, `customer_note`, `note` Char; `refunded_orderline_id` Many2one self, `refunded_qty` computed; `combo_parent_id` Many2one self, `combo_line_ids`, `combo_item_id`; `extra_tax_data` Json |
| Payment | `pos_payment.py` (20 to 46) | `pos_order_id` cascade; `amount` Monetary; `payment_method_id`; `payment_date` Datetime; `session_id` related stored; Char fields `card_type`, `card_brand`, `card_no`, `cardholder_name`, `payment_ref_no`, `payment_method_authcode`, `transaction_id`, `payment_status`, `ticket`; `is_change` Boolean; `uuid` unique |
| Payment method | `pos_payment_method.py` (23 to 68, 116 to 121) | `journal_id`; `type` computed `cash`, `bank`, `pay_later` from the journal; `is_cash_count`; `use_payment_terminal` Selection filled by terminal modules; `payment_method_type` Selection `none`, `terminal`, `qr_code` |
| Floor | `pos_restaurant.py` `RestaurantFloor` (8 to 22) | `name`; `pos_config_ids` Many2many; `background_image` Binary; `background_color` Char; `table_ids`; `sequence`; `active`; `floor_background_image` Image |
| Table | `pos_restaurant.py` `RestaurantTable` (90 to 113) | `floor_id`; `table_number` Integer required; `shape` Selection `square`, `round`; `position_h`, `position_v` Float default 10; `width`, `height` Float default 50 pixels; `seats` Integer default 1; `color` Char CSS; `parent_id` Many2one self for merged tables; `active`; display name `"<floor>, <number>"` |
| Restaurant order | `pos_restaurant/models/pos_order.py` (8 to 22) | `table_id` Many2one readonly; `customer_count` Integer; `course_ids` One2many; `_get_open_order` also matches a draft by same `table_id` and `config_id`, so two devices opening one table merge |
| Course | `restaurant_order_course.py` (12 to 17); `pos_order_line.py` (8) | `fired` Boolean; `fired_date` set on first fire; `uuid`; `index` Integer; `order_id` cascade; `line_ids`; line `course_id` with `ondelete='set null'` |

## What Jelly takes

1. Shift as its own row with explicit states and an opening balance carried from the last counted close.
2. Counted against theoretical cash, with the difference stored and posted to a named over/short account.
3. Client `uuid` on order, line and payment, each with a unique index.
4. A short `tracking_number` for the customer and a longer `pos_reference` for the books.
5. Lines store both subtotals, so a reprint never recomputes.
6. Lines store the tax set that applied at sale time.
7. A refund line points at the line it refunds.
8. Combo children point at a parent line.
9. Payments carry terminal fields and an `is_change` flag.
10. Tables store shape, position, size, seats and a parent for merges; courses store `index`, `fired` and `fired_date`.

## What Jelly changes

1. Jelly resolves taxes per line at sale time and stores rate and amount, because `tax_ids_after_fiscal_position` is a non-stored compute that re-reads the mapping later.
2. Jelly stores `channel` as an enum column, because `preset_id` is a nullable pointer to a deletable row and reporting needs a stable value.
3. Jelly uses integer cents, because `price_unit` is `Float` with `digits=0`.
4. Jelly puts `guest_count` and `table_id` in the core order table, because a quick-service shop still needs guest counts for reports.
5. Jelly uses one `order_number` sequence per location per day, because `pos_reference` embeds device and config ids and reads like a serial.
6. Jelly keeps a `line_kind` column (`item`, `modifier`, `combo_child`, `refund`, `fee`) instead of inferring kind from which foreign key is set.
7. Jelly makes the "two devices open one table" merge an explicit server rule with a version check, because `_get_open_order` silently reuses the other device's draft.

## Clean-room line

Read for design on 2026-10-29; nothing copied; LGPL-3 forbids copying into Jelly. Schema names reused as facts only: `uuid`, `state`, `tracking_number`, `pos_reference`, `tip_amount`, `customer_count`, `table_id`, `card_brand`, `transaction_id`, `is_change`, `shape`, `seats`, `parent_id`.

## Open questions

- Whether `amount_total` is checked against the sum of lines for register orders; the self-order controller recomputes prices, `_process_order` was not traced for it.
- How `tip_amount` interacts with `amount_paid` for "tip later"; `sync_from_ui` (1305 to 1309) notes a paid order can be re-synced for tips.
- Whether `restaurant.table` enforces a unique `table_number` per floor; no constraint was seen.
