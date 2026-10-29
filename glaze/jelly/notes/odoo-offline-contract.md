# Odoo POS offline contract

**Source.** github.com/odoo/odoo 19.0, `addons/point_of_sale`; github.com/odoo/documentation 19.0, `content/applications/sales/point_of_sale/use.rst`. LGPL-3. Read 2026-10-29.

## What it is

The Odoo POS client is a browser app that keeps a working copy of its data in IndexedDB and treats the server as something it can lose at any moment. Orders, lines and payments are created in the browser, written to IndexedDB on change, and pushed by one RPC named `sync_from_ui`. A ping loop decides whether the client is offline. Other writes that fail offline are queued in memory and replayed once the ping succeeds. Registers on one config stay in step through a websocket nudge plus a pull for records whose `write_date` moved. A service worker caches the app shell.

## Observed

| Thing | Where (file, line or function) | What it does |
|---|---|---|
| Database | `static/src/app/services/data_service.js` `get databaseName` (114) | `point-of-sale-<config_id>-<db>`, one IndexedDB per register config |
| Stores | `models/utils/indexed_db.js` `onupgradeneeded` (104), `create` (368); `models/data_service_options.js` `databaseTable` | one store per model, `keyPath` `id`; `pos.order`, `pos.order.line`, `pos.payment` keyed by `uuid`; every write is a `put`; a missing store bumps the version (60 to 90) |
| Local save | `data_service.js` `synchronizeLocalDataInIndexedDB` (162 to 281), debounce 300 ms (33) | runs on `update` of `dynamicModels`; drops finalized synced orders from other sessions |
| localStorage | `data_service.js` `loadFieldsAndRelations` (436); `hardware_proxy_service.js` (58) | `pos_data_params_<config_id>` holds model metadata for an offline boot; `hw_proxy_url` holds the last box address |
| Ping | `data_service.js` `checkConnectivity` (65 to 95); `controllers/main.py` `pos_ping` (122) | `rpc("/pos/ping")` returns `pong`; on `ConnectionLostError` sets `network.offline` and retries every 2000 ms while `navigator.onLine`; on success runs `syncData` and dispatches `pos-network-online` |
| Write queue | `data_service.js` `execute` catch (701 to 719) | pushes `{args, date, try, uuid}` to `network.unsyncData` on `ConnectionLostError` when `queue` is set; `sync_from_ui` calls are excluded |
| Replay | `data_service.js` `syncData` (828 to 846) | mutex, FIFO, stops at the first failure and increments `try` |
| Order push | `pos_store.js` `syncAllOrders` (1583 to 1701) | returns `ConnectionLostError` offline; syncs dirty orders one per RPC with `serializeForORM({ keepCommands: true })`; a connection error logs "will be synced later"; any other error triggers a server pull |
| Server sync | `models/pos_order.py` `sync_from_ui` (1268 to 1321), `_get_open_order` (1258) | looks up by `uuid`; a draft is updated, a missing order is created, a non-draft is left alone and its id returned |
| Create becomes update | `pos_order.py` `_process_order` (118 to 123) | a `Command.CREATE` line whose `uuid` exists is rewritten to `Command.UPDATE` |
| Closed session | `pos_order.py` `_get_valid_session` (34 to 53) | an order for a closed session moves to an open session on the config, else raises |
| Unique uuid | `pos_order.py` (388, 1669); `pos_payment.py` (46) | `models.Constraint('unique (uuid)')` on order, line and payment |
| Reload guard | `pos_store.js` `reloadData` (285 to 300); `models/pos_order.js` (113 to 127) | refuses a reload with an `AlertDialog` if any order is `isUnsyncedPaid`, which is `state !== "draft"` and not synced |
| Unload guard | `data_service.js` (45 to 47, 240 to 272) | `localUnsyncedPaidOrderUuids` is checked against IndexedDB after each save; the `beforeunload` listener was not found in the files read |
| Peer nudge | `utils/devices_synchronisation.js` (28, 37 to 85) | websocket channel `SYNCHRONISATION`; `dispatch` calls `pos.config.notify_synchronisation` with a device identifier; `collect` drops its own echo, then pulls |
| Pull domain | `devices_synchronisation.js` `constructOrdersDomain` (181 to 244), (134) | per known order: `write_date >= own + 1 s` or `state` changed; plus unknown drafts on this config or `trusted_config_ids`; incoming records keep local dirty edits |
| Server pull | `models/pos_config.py` `read_config_open_orders` (251 to 281) | returns `dynamic_records` and `deleted_record_ids`; cancelled orders are reported as deleted |
| Service worker | `static/src/app/service_worker.js`; `controllers/main.py` (19) | cache `odoo-pos-cache`, network first, cache fallback on GET; skips `web/dataset` and `hw_proxy/hello`; a `urlsToCache` message precaches |
| Boot | `data_service.js` `loadInitialData` (343 to 422) | boots from IndexedDB when offline; else loads a delta since `pos_last_server_date` |
| Docs | `use.rst` (469 to 523) | offline keeps order creation; unavailable: invoices, new customers, product info, live stock, payment terminals; LAN printers and scales keep working; "do not close or reload the browser" until synced |

## What Jelly takes

1. Client-generated `uuid` on order, line and payment with a unique constraint, so a replayed push updates and never duplicates.
2. A create whose key already exists is treated as an update on the server.
3. One order per sync RPC, so one bad order cannot block the rest.
4. Offline is decided by a server ping on a short retry, never by `navigator.onLine` alone.
5. Boot metadata is kept in localStorage so the app starts with the server down.
6. A reload is refused while any paid order is unsynced.
7. Orphan orders from a closed shift land in an open shift instead of failing.
8. Peers pull by `write_date` after a websocket nudge instead of trusting the pushed payload.

## What Jelly changes

1. Jelly appends an event log to IndexedDB on every action instead of a 300 ms debounced snapshot, because a crash inside the debounce window loses the last taps.
2. Jelly uses one outbox for every write including order pushes, because Odoo runs two retry paths and excludes `sync_from_ui` from the first.
3. Jelly rows carry a version and the server rejects a stale one, because `sync_from_ui` writes whatever payload arrives over the draft and two registers on one tab can overwrite each other.
4. Jelly returns a per-order ack with the server version, because the client today infers success from the returned record set.
5. Jelly wires and tests the `beforeunload` guard, because the Set exists in Odoo but the listener could not be located.
6. Jelly precaches product images and the receipt font, because Odoo caches only what was fetched once.

## Clean-room line

Read for design on 2026-10-29; nothing copied; LGPL-3 forbids copying into Jelly. Schema names reused as facts only: `uuid`, `write_date`, `state`.

## Open questions

- Where the `beforeunload` listener that reads `localUnsyncedPaidOrderUuids` lives; it is in none of `data_service.js`, `pos_store.js`, `pos_app.js`, `payment_screen.js`.
- Whether `sync_from_ui` takes a row lock; two registers pushing the same draft in the same second were not traced.
- Whether the 2000 ms ping retry backs off; the code shows a fixed interval.
