# Jelly data model

**Source.** Our own code first: Mike's Place and Copper `lib/ordering/*`
(`order-quote`, `order-acceptance`, `kitchen-operations`, `printer-jobs`
1.0.0 and the menu document), DeVine `src/lib/square/payment-engine.ts`
and `payment-attempts.ts`, Scooplist's org model. Then the nine design
notes beside this file. Step 0.3 of the build outline. Written 2026-10-29.
Nothing here is migrated code; it is the schema the Jelly repo's first
migration is written from.

## What it is

One Postgres database, one schema, every row owned by a tenant. The menu
is one document with a revision, and a normalized read model is derived
from it on every save. An order is a header, lines, modifiers on lines,
adjuster lines for the totals, tenders against it, and an append-only
event log. A drawer session owns tenders and closes into a stored Z row.
Every money column is integer cents. Every record a browser can create
carries a client uuid. Every record a browser can edit carries a version.

## Rules on every table

| Rule | How | From |
|---|---|---|
| Tenant on every row | `tenant_id uuid not null references tenant`, first column of every unique index | Scooplist `org_id`, `tenant-record.md` |
| Client identity | `uuid uuid not null`, unique per tenant on order, line, modifier, tender, drawer event, kitchen action | Odoo unique `uuid` on order, line, payment |
| Optimistic version | `version integer not null default 1`; the server rejects a write whose version is stale with 409 and the current row | `kitchen-operations 1.0.0` revision check; the inverse of Odoo's `write_date` last-write-wins |
| Money | `*_cents bigint`, never numeric or float; tax rates in basis points `smallint`; shares of a cent never stored | `order-quote 1.0.0`; Floreant's `Double` columns and Odoo's `Float digits=0` as the counterexamples |
| Time | `timestamptz` everywhere; `location.timezone` for display; `promised_at` in UTC | Odoo's slot bug (browser local versus server formatted string) |
| Snapshots | names, prices, tax rates and option labels are copied onto the order at sale; nothing on an order re-reads the menu | TastyIgniter `order_menus`; Odoo `price_subtotal` stored as sent |
| Never deleted | rows that money or audit depend on are never deleted; `cancelled`, `voided`, `retired_at`, `left_at` | Floreant deletes an unpaid ticket on void; TastyIgniter deletes option rows missing from a submit |
| Written together | the change and its audit row and its outbox row commit in one transaction | `order-acceptance 1.0.0` one statement; Floreant's two-session close as the counterexample |
| Keys | `id uuid` primary key generated server side; `uuid` is the client's; `slug` only on tenant | |

## Tenancy and people

| Table | Fields | Notes |
|---|---|---|
| `tenant` | `id, slug, name, legal_name, timezone, hosts text[], status (demo, building, live, left), stripe_account_id, stripe_customer_id, registry_slug, created_at, left_at` | `tenant-record.md` |
| `location` | `tenant_id, id, name, address jsonb, timezone, tax_profile_id, sdm_licensed boolean, alcohol_to_go boolean, hours jsonb, order_number_seq_date date, order_number_seq integer` | One order number sequence per location per day (Odoo's embedded device id was the counterexample) |
| `register` | `tenant_id, location_id, id, name, kind (counter, bar, handheld, hub), printer_group_id, has_drawer, reader_id, last_seen_at` | A device; the drawer belongs to a session, never to the register (Floreant bound it to the terminal) |
| `printer` | `tenant_id, location_id, id, station (pass, bar, expo, receipt), model, protocol (cloudprnt, escpos_lan, epos), device_token_hash, last_poll_at` | `printer-jobs 1.0.0` per-device token |
| `owner` | `tenant_id, id, email, name, totp_secret_enc, created_at, disabled_at` | Named owners with two-factor; `workroom-session 1.0.0` |
| `staff` | `tenant_id, id, display_name, pin_hash, pin_salt, role_id, hourly_cents, tipped boolean, active, created_at` | Floreant's plaintext `USER_PASS` and `SSN` column are what this avoids |
| `role` | `tenant_id, id, name, permissions text[]` | Flat named set checked by membership (Floreant's 27); seeded `owner`, `manager`, `staff` |

## Menu

The one price source stays a document: `menu_revision` holds the editor's
whole menu as `jsonb` with a revision number, saved through `menu-write
1.0.0`'s validation and compare-and-swap. On every save the normalized
tables below are rebuilt from it in the same transaction, so the register,
the ordering board and the site read tables and the owner edits a document.

| Table | Fields | From |
|---|---|---|
| `menu_revision` | `tenant_id, location_id, id, revision, document jsonb, saved_by, saved_at` | Mike's workroom; `content-cas 1.0.0` |
| `menu_section` | `id, revision_id, name, sort, age_restricted` | ours |
| `menu_item` | `id, stable_id, revision_id, section_id, name, description, price_cents, tax_category_id, kind (item, pizza, drink_variant_parent), image, hidden, sold_out_until, prep_station` | `stable_id` survives revisions so reports and history join across edits |
| `option_group` | `tenant_id, id, stable_id, name, kind (single, multi, quantity)` | TastyIgniter's reusable `menu_options` catalogue |
| `option_value` | `id, group_id, stable_id, name, price_cents, sort` | |
| `item_option` | `id, item_id, group_id, required, min_picks, max_picks, free_quantity, sort` | TastyIgniter's per-item attachment; single-pick groups force min and max to 1 and free to 0 in one place |
| `item_option_value` | `id, item_option_id, value_id, price_override_cents (nullable), is_default, hidden, sold_out_until` | Null inherits, 0 is free (TastyIgniter's truthiness bug) |
| `variant` | `id, item_id, name, price_cents, sort` | Pint, pitcher, growler as one-tap variants; the draft grid |
| `pizza_size` | `tenant_id, id, name, inches, sort` | Floreant `MenuItemSize` |
| `pizza_crust` | `tenant_id, id, name, sort` | |
| `pizza_base_price` | `item_id, size_id, crust_id, channel, price_cents` | Floreant `PizzaPrice` by size, crust and order type |
| `topping_level` | `tenant_id, id, name (regular, extra, double), rate_bp, ticket_prefix, sort` | Floreant `Multiplier`, with an id instead of the name as key |
| `topping_price` | `topping_value_id, size_id, level_id, price_cents` | Floreant `ModifierMultiplierPrice`; missing row falls back to regular times `rate_bp` |
| `pizza_policy` | `tenant_id, half_pricing (proportional, full, rounded_up), same_topping_both_halves (whole_price)` | Per-shop rule, snapshotted on the line |
| `availability_window` | `id, item_id or section_id, days smallint[], from_minute, to_minute, date_from, date_to` | One shape, overnight handled once (TastyIgniter's three branches) |

## Channel and tax

| Table | Fields | From |
|---|---|---|
| `channel` (enum) | `dine_in, to_go, pickup_online, phone, delivery` | A fixed value on the order for reports; Odoo's `preset_id` was a deletable pointer |
| `channel_profile` | `tenant_id, location_id, channel, tax_profile_id, price_list_id (nullable), identification (none, name, phone, address), capacity_per_interval, interval_minutes, lead_minutes, order_ahead_days, active` | Odoo preset as the mutable settings behind the fixed enum; slots computed, never stored |
| `tax_profile` | `tenant_id, id, name` | |
| `tax_category` | `tenant_id, id, name (prepared_food, grocery, alcohol_on, alcohol_off, non_taxable, fee)` | Michigan's prepared-food rules per item |
| `tax_rule` | `tax_profile_id, tax_category_id, channel, rate_bp, included boolean` | Resolved at line time, rate and amount written on the line; Odoo's non-stored `map_tax` was the counterexample |

## Orders

| Table | Fields | From |
|---|---|---|
| `order` | `tenant_id, location_id, id, uuid, version, order_number, tracking_code, channel, status (draft, placed, accepted, ready, done, cancelled, voided, refunded), register_id, staff_id, guest_name, guest_phone, guest_email, guest_count, table_id, tab_id, promised_at, placed_at, accepted_at, ready_at, done_at, cancelled_at, cancel_reason, note, subtotal_cents, discount_cents, fee_cents, tax_cents, tip_cents, total_cents, paid_cents, due_cents, has_alcohol, id_checked_by, menu_revision_id, drawer_session_id (nullable), idempotency_key` | Mike's `Order` plus Odoo's `tracking_number`, `customer_count`, `table_id`, `preset_time`; status carries Mike's `new, accepted, done, cancelled, refunded` as a subset |
| `order_line` | `id, order_id, uuid, version, line_kind (item, combo_child, refund, fee), item_stable_id, name_snapshot, qty, unit_cents, line_cents, tax_category_id, tax_rate_bp, tax_cents, seat_number, course_id, station, size_id, crust_id, variant_id, refunds_line_id, combo_parent_id, note` | Odoo line with both subtotals stored and `refunded_orderline_id`; Floreant `seatNumber` on every line |
| `line_modifier` | `id, line_id, uuid, group_stable_id, value_stable_id, name_snapshot, qty, free_qty, unit_cents, section (whole, left, right, q1..q4), fraction (1, 1/2, 1/4), level_id, level_name_snapshot, cents` | Floreant `sectionName` and `multiplierName` on every topping row; TastyIgniter `free_qty` |
| `order_total` | `id, order_id, stage (discount, delivery, fee, tax, tip), code, title, cents, taxable boolean, included boolean, sort` | TastyIgniter conditions as persisted lines; stages are names, tax has a declared base, tip is never in it, the 99 cent fee is one row with its own tax row |
| `order_status_history` | `id, order_id, from_status, to_status, by_staff_id, by_owner_id, note, at` | TastyIgniter `status_history`; Odoo's `is_edited` flags as the counterexample |
| `order_event` | `id, order_id, uuid, action_code, before jsonb, after jsonb, performer_id, approver_id, at` | `kitchen-operations 1.0.0` before and after receipts; Floreant `ACTION_HISTORY` with a stable code, both parties, same transaction |

Totals are computed by one pure function, `computeTotals(cart, rules)`,
the successor of `order-quote 1.0.0`, run at quote and again at commit,
and the commit stores its output as `order_total` rows. The function is
the only place arithmetic happens.

## Payments and tenders

| Table | Fields | From |
|---|---|---|
| `payment_attempt` | `tenant_id, attempt_key (pk), fingerprint, state (prepared, processing, unknown, completed, failed), snapshot jsonb, result jsonb, order_id, created_at, updated_at` | DeVine's attempt repository as is; `claim` moves `prepared` to `processing` in one statement, `settle` never overwrites `completed` |
| `tender` | `id, order_id, uuid, version, kind (cash, card_present, card_online, gift, house, pay_later), cents, tip_cents, change_cents, provider (stripe, square, none), provider_payment_id, card_brand, last4, auth_code, status (authorized, captured, voided, refunded, declined_offline), captured_at, offline boolean, drawer_session_id, staff_id, at` | Odoo `pos.payment` fields plus Floreant `authorizable` and `captured` for pre-auth; `offline` and `declined_offline` for Stripe's offline mode |
| `refund` | `id, order_id, tender_id, uuid, cents, reason_id, reason_snapshot, by_staff_id, approver_id, provider_refund_id, at` | A reversing money event, never an edit to the tender |
| `platform_fee` | `id, order_id, tender_id, application_fee_cents, stripe_transfer_id` | The studio's half of the 99 cents and the stated basis points, read back off Stripe for the books |

## Drawer

| Table | Fields | From |
|---|---|---|
| `drawer_session` | `tenant_id, location_id, id, uuid, register_id, opened_by, opened_at, float_cents, state (open, closing, closed), closed_by, closed_at` | Odoo session states; Floreant open with a named cashier and a counted float |
| `drawer_event` | `id, session_id, uuid, kind (float, cash_sale, cash_refund, payout, drop, tip_payout, cash_back, adjustment), cents, destination (safe, bank_bag, vendor), reference_id, by_staff_id, note, at` | Append-only ledger replacing Floreant's mutable `currentBalance` written from seven call sites |
| `drawer_close` | `session_id (pk), begin_cash_cents, cash_sales_cents, cash_refunds_cents, payouts_cents, drops_cents, tips_paid_cents, cash_back_cents, expected_cents, counted_cents, variance_cents, card_sales_cents, card_count, cash_count, net_sales_cents, sales_tax_cents, fee_cents, charged_tips_cents, declared_cash_tips_cents, void_count, void_cents, discount_count, discount_cents, voids jsonb, closed_at` | Floreant's `DRAWER_PULL_REPORT` column by column, with `variance` and `cash_tips` actually written and per-void detail kept; `expected = float + cash_sales - cash_refunds - payouts - drops - tips_paid - cash_back` |

The Z report is `drawer_close` rendered. Payouts and drops are refused above
`expected` at the moment of entry. Closing writes `drawer_close`, flips the
session to `closed`, and nothing afterward can join a tender to that
session, all in one transaction.

## Floor, tabs, courses

| Table | Fields | From |
|---|---|---|
| `floor` | `tenant_id, location_id, id, name, sort, background` | Odoo `restaurant.floor` |
| `table` | `id, floor_id, number, shape (square, round), x, y, w, h, seats, merged_into_id` | Odoo `restaurant.table` with `parent_id` for merges; unique `(floor_id, number)` enforced |
| `tab` | `id, order_id, uuid, name, card_hold_tender_id, hold_cents, opened_at, closed_at` | Floreant `barTab` plus `authorizable` and `captured`; Stripe Terminal manual capture |
| `course` | `id, order_id, uuid, index, fired_at` | Odoo `restaurant.order.course` |

## Time, tips, labor

| Table | Fields | From |
|---|---|---|
| `clock_event` | `tenant_id, location_id, id, uuid, staff_id, kind (in, out, break_start, break_end), at, register_id, edited_by, edit_note` | Floreant `ATTENDENCE_HISTORY` with one `timestamptz` and no duplicated hour columns |
| `tip_declaration` | `id, staff_id, shift_date, cash_tips_cents, declared_at` | No open-source register has it |
| `tip_pool` | `id, location_id, rule jsonb, period_start, period_end, computed jsonb` | Pooling by rule; the per-shift tip-credit check against Michigan's schedule reads `staff.hourly_cents`, `staff.tipped`, charged tips and declared tips |

## Kitchen and printing

| Table | Fields | From |
|---|---|---|
| `kitchen_action` | `id, order_id, uuid, kind (accept, bump, recall, eighty_six, pause, busy_dial, cancel), payload jsonb, expected_version, result, by_staff_id, at` | `kitchen-operations 1.0.0` and `kitchen-request 1.0.0` |
| `print_job` | `id, order_id, printer_id, uuid, kind (kitchen, receipt, drawer_kick, reprint), payload, state (queued, leased, printed, confirmed, failed), lease_until, confirmed_at` | `printer-jobs 1.0.0`; paper confirms acceptance |
| `station_state` | `location_id, station, paused_until, busy_level, updated_at` | Mike's board |

## Voids, discounts, audit

| Table | Fields | From |
|---|---|---|
| `void_reason` | `tenant_id, id, text, active, sort` | Floreant `VOID_REASONS` with an id; text snapshotted on the order |
| `discount` | `tenant_id, id, name, kind (amount, percent, reprice), value, scope (item, order), requires_role, active` | Floreant `COUPON_AND_DISCOUNT` without the typos |
| `order_discount` | `id, order_id, line_id (nullable), discount_id, name_snapshot, cents, by_staff_id, approver_id` | Snapshotted; written to `order_total` stage `discount` as well |

Audit is `order_event` for anything on an order and `audit_event`
(`tenant_id, id, entity_type, entity_id, action_code, before, after,
performer_id, approver_id, at`) for everything else, both written in the
change's transaction, never swallowed.

## Reporting rows

Nothing is reconstructed later. The report reads `order`, `order_line`,
`order_total`, `tender`, `drawer_close`, `kitchen_action` timestamps for
prep time, `clock_event` for labor, and a `funnel_event` table
(`tenant_id, id, session_hash, step (landing, menu, cart, checkout,
placed), referrer, utm jsonb, at`) written by the ordering host for the
"where orders were lost" funnel.

## Where the existing components land

| Component | Becomes |
|---|---|
| `order-quote 1.0.0` | `computeTotals` with `order_total` output and the pizza matrix |
| `option-pricing 1.0.0` | the validator over `item_option` with free quantity and linked values |
| `order-acceptance 1.0.0` | the order commit: one transaction, idempotency key, outbox row |
| `order-recovery 1.0.0` | the client side of the offline contract's reload guard |
| `kitchen-operations`, `kitchen-request` | `kitchen_action` with `expected_version` |
| `printer-jobs`, `printer-review` | `print_job` |
| `notification-*` | unchanged, keyed by tenant |
| `menu-write`, `content-cas`, `owner-save`, `owner-request` | `menu_revision` and the rebuild |
| DeVine `payment-attempts.ts` | `payment_attempt`, with a Stripe adapter beside the Square one |
| `workroom-session` | `owner` sessions; staff PIN sessions are new |

## Open questions

- Whether `menu_revision` is per location or per tenant; two-location Bates
  argues per location with a shared catalogue; not decided.
- Whether `order_total` rows for tax are one per rate or one per line
  category; the accountant's report wants per category.
- The tip-credit rule's exact inputs after 0.7 reads the 2026 schedule.
- Codex has not reviewed this. 0.3 is done when it has.
