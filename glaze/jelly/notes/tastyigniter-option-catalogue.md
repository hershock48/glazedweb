# TastyIgniter option catalogue: the two-level option model

**Source.** `tastyigniter/ti-ext-cart` and `tastyigniter/core`, branch `4.x`, MIT. Raw files read 2026-10-29. Nothing installed or executed.

## What it is

TastyIgniter keeps modifiers at two levels. A `menu_options` row is a reusable group such as "Size" with a display type, and its `menu_option_values` rows are the choices with a base price. A `menu_item_options` row attaches a group to one menu item and sets that item's rules: required, min and max picks, free units. Its `menu_item_option_values` rows choose the shown values and override price, default, and free count. The cart validates picks against the attachment and copies chosen names and prices into `order_menu_options` at checkout. Availability comes from mealtime windows, and sold-out from a stock row with an override switch.

## Observed

| Thing | Where (file, class, method or line) | What it does |
| --- | --- | --- |
| Original tables | `core/database/migrations/system/2015_03_25_000001_create_tables.php`, `_create_options()` L343-352, `_create_option_values()` L354-364, `_create_menu_options()` L366-377, `_create_menu_option_values()` L379-392 | `options`: `option_name` string(32), `display_type` string(15), `priority`. `option_values`: `value` string(128), `price` decimal(15,4) nullable. `menu_options`: `option_id`, `menu_id`, `required`, `default_value_id`. `menu_option_values`: `option_value_id`, `new_price`, `quantity`, `subtract_stock`. |
| Schema drift | `core/.../admin/2020_04_16_000300_drop_stale_unused_columns.php` L19-23; `admin/2019_11_08_000300_add_selected_columns_to_menu_options_table.php` L15-18; `admin/2022_11_03_003000_merge_menu_item_options_tables.php` L11-30 | 2020 renames the per-item pair to `menu_item_options` and `menu_item_option_values`, and `options` to `menu_options`. 2019 adds `min_selected` and `max_selected`, default 0. 2022 renames `value` to `name`, `required` to `is_required`, `new_price` to `override_price`. |
| 2026 additions | `ti-ext-cart/database/migrations/2026_07_11_010000_add_free_quantity_to_menu_tables.php`; `2026_06_20_010000_create_menu_item_option_linked_values_table.php` | `free_quantity` unsigned default 0 on both per-item tables, `free_qty` on `order_menu_options`. Linked values: composite key (`menu_option_id`, `menu_item_option_value_id`). |
| Group and value models | `ti-ext-cart/src/Models/MenuOption.php`, `getDisplayTypeOptions()` L113-121, `attachToMenu()` L184-196, `addOptionValues()` L151-177; `MenuOptionValue.php` rules L73-78 | Types `radio`, `checkbox`, `select`, `quantity`. Attaching copies every value into a per-item row. Saving deletes any value missing from the submitted list and cascades to per-item rows. |
| Attachment model | `MenuItemOption.php`, rules L87-95, `beforeValidate()` L168-179, `getFreeQuantityAttribute()` L193-200, `getOptionValuesAttribute()` L113-132 | `min_selected lte max_selected`. For `select` and `radio` the min and max rules become `max:1` and free quantity reads 0. `is_enabled` means a per-item row exists. |
| Attached value model | `MenuItemOptionValue.php`, `getPriceAttribute()` L85-92, `getFreeQuantityAttribute()` L104-113 | Price is `override_price` when truthy, else the parent price. Free quantity is 0 for `select` and `radio`, capped at 1 for `checkbox`. |
| Pick validation | `ti-ext-cart/src/Classes/CartManager.php`, `validateMenuItemOption()` L489-539, `validateContents()` L360-384 | Required and empty throws. Count is summed `qty` for `quantity`, else the number of picks. Min and max apply only when either is above 0. Unknown value ids throw. Each pick runs `option_value->outOfStock(locationId)`. Re-run on the whole cart before save. |
| Pricing picks | `CartManager.php`, `prepareCartItemOptionValues()` L268-300, `allocateFreeQuantities()` L309-335; `src/CartItemOptionValue.php`, `subtotal()` L83-86; `src/CartItem.php` L132-139, L277-282 | Free units granted in pick order as `min(qty, value free_quantity, remaining group cap)`. Value subtotal `max(0, qty - free_qty) * price`; line `qty * (price + optionsSum)`. Row id `md5(id . serialize(options) . comment)`. |
| Mealtimes | `2015_..._create_tables.php`, `_create_mealtimes()` L313-323; `admin/2020_06_11_000300_create_menu_mealtimes_table.php`; `ti-ext-cart/database/migrations/2025_07_08_010000_add_start_end_date_mealtimes_table.php`; `src/Models/Mealtime.php`, `isAvailable()` L82-110 | Pivot `menu_mealtimes` (`menu_id`, `mealtime_id`, unique). 2025 adds `validity` default `daily`, `start_at`, `end_at`, `recurring_every` json, `recurring_from`, `recurring_to`. `period` checks the date range; `recurring` checks weekday and time with overnight handled; `daily` cannot cross midnight. |
| Item availability | `Menu.php`, `isAvailable()` L246-263, `hasOrderTypeRestriction()` L290-297; `CartManager.php`, `validateMenuItem()` L424-447, `validateMenuItemLocation()` L541-550 | False when any enabled mealtime is closed at the order time, or any ingredient is disabled; fires `admin.menu.isAvailable`. `order_restriction` lists allowed order types. Items assigned to locations (morph table `locationables`) are rejected elsewhere. |
| Stock and sold-out | `admin/2021_11_28_000300_create_stocks_table.php` L14-25, L45-53; `ti-ext-cart/.../2026_02_27_010000_add_out_of_stock_override_to_stocks_table.php`; `src/Models/Stock.php`, `outOfStock()` L263-270, `hasOutOfStockOverride()` L272-283, `applyOutOfStockOverride()` L285-308; `Concerns/Stockable.php`, `outOfStock()` L71-80 | `stocks`: `location_id`, morph `stockable`, `quantity`, `is_tracked`, plus 2026 `out_of_stock_type` and `out_of_stock_until`. Out when the override is `indefinitely`, or `custom` with a future `until`, or tracked with `quantity <= 0`. The override throws unless `is_tracked`. |

## What Jelly takes

1. Two levels: a reusable group with values, and a per-item attachment overriding price, default, visibility, and free count.
2. Single-pick groups force min and max to 1 and free count to 0, enforced in one place.
3. Server-side validation of picks on add and at commit against required, min, max, and membership.
4. Quantity picks count by summed qty and price as `max(0, qty - free) * price`.
5. Free units allocated in pick order, capped per value and optionally per group.
6. Availability windows joined many-to-many, with daily, date-period, and weekly recurring shapes.
7. Sold-out as an explicit override, indefinite or until a timestamp, separate from counted stock.
8. Chosen option names and prices copied onto the order line.

## What Jelly changes

1. Stable ids. TastyIgniter deletes per-item value rows missing from a submitted list and keys cart lines by an md5 of serialized options, so a catalogue edit can orphan a cart. Jelly soft-deletes.
2. Nullable price override in cents. The truthiness check in `getPriceAttribute()` makes an override of 0 fall back to the parent price, so a free size is impossible. Null inherits, 0 is free.
3. Sold-out without counting. The override requires `is_tracked`, so a shop that does not count stock cannot flip an item off. Jelly puts `sold_out_until` on items and values; counts are optional.
4. One window shape, `{days[], from, to, dateRange?}`, with overnight handled once, since TastyIgniter's `daily` branch cannot cross midnight.
5. Linked values as a validation rule. `validateMenuItemOption()` never reads the 2026 table, so it looks display-only; Jelly checks "shown when" inside the validator.
6. Plain foreign keys. `locationables` and `stocks.stockable` are polymorphic; Jelly's rows belong to a location by FK.
7. Typed errors from a pure validator instead of thrown exceptions built from language keys.
8. Display type becomes a UI hint. Rules are `min`, `max`, `perValueMax`, and `allowQty`.

## Clean-room line

Read for design on 2026-10-29; MIT allows a direct port with the notice; nothing is intended to be ported, the two-level shape, the pick rules, and the free-unit allocation are re-expressed in TypeScript against Postgres with integer cents.

## Open questions

- Where `priority` and `is_default` on the two per-item tables were added. The 2015 schema has neither; no later migration touching them was found.
- Columns of `locationables`; its 2018 migration was listed, not read.
- Whether linked values are enforced outside the admin form and theme; only `CartManager` and the models were read.
- Whether `menu_options.priority` (present in 2015) is still written; `MenuOption::$fillable` omits it.
