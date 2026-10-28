# Open-source register teardown, 2026-10-28

**What was asked.** Kevin, 2026-10-28, after reading the Toast and Aloha
study and the Jelly plan: "there has to be an opensource version of what
Toast is and does." Score the open-source restaurant registers and ordering
systems against the Jelly plan's list of what the studio still has to build,
and say what is worth reading, what is worth running, and what is worth
nothing. Three read-only research passes ran the same day, one per project,
with the source trees and official docs as the evidence. Every claim carries
a URL or is marked unverified. No code changed.

**What it is judged against.** Section 4 of the Jelly plan ("Missing, in
the order the register needs them"), the eleven pieces the studio does not
own: touch order entry with the pizza matrix, tabs and tables with
pre-authorization, Stripe Terminal with the platform fee, cash and close,
tips, the Michigan tax and alcohol engine, discounts and voids behind a PIN,
employees, the offline shell and the hub, reports and export, and
multi-tenant onboarding. Two more rows were added because the research
turned on them: kitchen printing and online ordering.

**The short answer.** There is no open-source Toast. Odoo Community is the
only living open-source register and it is a general-purpose ERP with a POS
module, built for a shop that also runs Odoo accounting. TastyIgniter is
online ordering with no register. Floreant is a 2008 Java register that one
small company revived this spring to feed its paid product. None of the
three does half toppings, pre-authorized bar tabs, tip declaration, tip
pooling, a tip-credit check or a per-channel alcohol rule. The missing half
the Jelly plan describes is missing from open source too. What the three
hold is a set of worked data models, one offline design, one hardware-bridge
design and one cash-drawer checklist, all readable, none runnable as our
product.

---

## The three, and two cousins

| Project | What it really is | License | Stack | Health, October 2026 | Verdict |
|---|---|---|---|---|---|
| **Odoo Community POS** ([repo](https://github.com/odoo/odoo)) | A full register and restaurant module inside an ERP. Floors, courses, splits, Stripe Terminal, cash sessions, offline, QR self-order. Kitchen display, the IoT app, per-order self-pay and AvaTax are Enterprise only. | LGPL-3 (Community); OEEL-1 (Enterprise) | Python, PostgreSQL, OWL JavaScript, IndexedDB | 20.0 shipped September 2026; about 9,100 commits in six months; Odoo S.A., Belgium | Read it. The best data model and the only worked offline design. Do not run it as the product. |
| **TastyIgniter** ([repo](https://github.com/tastyigniter/TastyIgniter)) | Online ordering, delivery zones and reservations for one or more locations. No register, no cash, no card-present. | MIT since 3.0; 2.x was GPL, version unverified | PHP 8.3, Laravel 12, Livewire, MySQL or Postgres | v4.4.5 on 2026-10-12; one maintainer wrote 86 percent of six months of commits; about $100 a month on Open Collective | A checklist for ordering. Two patterns worth porting. |
| **Floreant POS** ([SourceForge](https://sourceforge.net/projects/floreantpos/), [GitHub copy](https://github.com/floreantpos/floreantpos)) | A Swing desktop register from 2008 with a real pizza model, cash control and payroll reports. ORO POS is the paid closed fork. | MRPL 1.2, an MPL 1.1 variant with a startup-credit clause | Java 8, Swing, Hibernate 3, Derby or MySQL or Postgres | 2.0 beta May 2026 after a gap from December 2022; OROCUBE LLC; 83 downloads a week | Dead for running. The best cash-management and pizza-matrix reference in the set. |
| uniCenta oPOS | Openbravo fork, retail-leaning | GPLv3, but current source is subscriber-only | Java 11, MariaDB | 5.5.1 September 2026; "a small team" | Skip. Closed in practice. |
| Chromis POS | Openbravo fork | GPLv3 | Java 11, MariaDB | 1.5.3 July 2024; one developer; one GitHub commit | Skip. |

Sources for the row facts: Odoo `LICENSE` and the `pos_*` manifests on the
19.0 branch; the [Odoo 20 release notes](https://www.odoo.com/odoo-20-release-notes);
TastyIgniter [core composer.json](https://raw.githubusercontent.com/tastyigniter/core/4.x/composer.json),
[Packagist](https://packagist.org/packages/tastyigniter/core),
[Open Collective](https://opencollective.com/tastyigniter) and the
[3.x README](https://raw.githubusercontent.com/tastyigniter/TastyIgniter/3.x/README.md);
Floreant [pom.xml](https://raw.githubusercontent.com/floreantpos/floreantpos/floreantpos-2.0/pom.xml),
[license text](https://floreantpos.org/license-html/) and the
[2.0.1 beta post](https://floreantpos.org/2026/05/floreant-pos-2-0-1-beta-is-here-a-bold-new-look-and-a-smarter-cash-command-center/);
[uniCenta sources page](https://unicenta.com/unicentaopos-sources/);
[Chromis licence page](https://chromis.co.uk/licence-details/).

---

## The scorecard

Rows are the Jelly plan's missing list in its own order. Cells say whether
the project has the piece and the one fact that decides it. "Enterprise"
means Odoo sells it only under the paid license.

| Jelly needs | Odoo Community | TastyIgniter | Floreant |
|---|---|---|---|
| **1. Touch order entry**, variants, modifiers, half toppings, open checks, seats | Partial. Attributes with extra price and combos. No fractional portion. Open orders shared across registers. No seat on a line. | Menu model only. Option groups with required, min, max and free quantity; per-value pricing. No half toppings. No register. | Yes. `pizzaType`, `pizzaSectionModeType`, `sectionName` whole or half, `multiplierName` regular or extra, `PizzaPrice` by size, crust and order type, `seatNumber` on every line. |
| **2. Tabs and tables**, pre-auth, transfer, split, merge, hold and fire | Partial. Floors, tables, transfer and merge. Split by line only. Courses fire from the floor plan. No pre-authorization anywhere. | No. Reservations only. | Partial. `barTab` flag, `authorizable` and `captured` on a transaction for pre-auth then capture, split and transfer dialogs. Floor plan is ORO only. Split by seat unverified. |
| **3. Card-present on Stripe Terminal with a platform fee** | Partial. Stripe Terminal and twelve other terminals, no IoT Box needed for Stripe. No `application_fee_amount` or Connect in the source. No Square. | No card-present. Online Stripe with pre-auth and refunds. Connect is a $49 a year add-on. | Weak. Authorize.Net tested "against Sandbox only" in the 2026 changelog, PAX and Dejavoo code present, no Stripe, no Square. |
| **4. Cash and close**, drawer kick, counts, paid-outs, Z report, export | Yes, nearly. Session state machine `opening_control` to `closed`, coin and bill counts, cash in and out with a reason, difference posted to an account, manager gate on the maximum difference, kick by ESC/POS or ePOS pulse. The Sales Details report has no tips line. | No. | Yes. `DrawerPullReport` with begin cash, net sales, sales tax, cash and card receipts, cash tips, charged tips, tips paid, payouts, bleeds, accountable, to deposit, variance, voids. Kick and CSV unverified. |
| **5. Tips**, on reader, on receipt, declared, pooled, tip credit | Partial. Tip product on the order. Tip after payment "only works for a POS in the United States" with Stripe or Adyen. No declaration, no pooling. | Partial. Tip as a cart condition, percent or fixed, online only. | Partial. `Gratuity` rows, `tipsAmount` per transaction, a tips cash-out report that pays each server. No declaration, no pooling. |
| **6. Michigan engine**, per-item and per-channel tax, alcohol class | Partial. `tax_ids` per product; presets for dine-in, to-go and delivery swap taxes per channel. US rates are manual or AvaTax, which is Enterprise. No alcohol or age class. | No. One flat `tax_percentage` cast to an integer, so 6.5 becomes 6. | Partial. `Tax`, `TaxGroup`, `taxGroup` per item, `taxExempt` per ticket. No channel, no alcohol class. |
| **7. Discounts, comps, voids** behind a PIN with reasons and an audit row | Partial. Line and global discounts, rights gate discounts, refunds and cancel, edit tracking on the order. No reason codes. | No. Coupons, and a status history with a staff comment. | Yes. `VoidReason`, `voidedBy`, ticket and line discounts, VOID and REFUND permissions, `ActionHistory` with time, name, description, performer. |
| **8. Employees**, PINs, clock, roles, labor report | Partial. `pos_hr` badge or PIN login, three rights levels, per-employee sales. No clock-in inside the POS. | No. Admin roles only. | Yes. `AttendenceHistory` with clock in and out, shift and terminal; Attendance, Payroll and Hourly Labor reports. |
| **9. Offline shell and hub** | Partial, and the only worked design. Whole catalog in IndexedDB, orders and cash payments continue, terminals and invoices stop. Writes queue in memory and replay on reconnect, upsert by client uuid. The IoT Box is a Raspberry Pi 4 image, LGPL, that rasterizes receipts to ESC/POS or Star; production use needs a subscription and the Enterprise IoT app. | No. Server-rendered PHP. | Yes by architecture. One database on the LAN, no cloud at all. No queue if that database host dies. |
| **10. Reports and export**, saved custom reports, raw CSV | Partial. Pivot and graph with saved favourites, Sales Details per session, CSV or XLS export of any list with saved templates. No report builder in Community. | Paid add-on for reports and for CSV. | Yes. Sales Summary, Detailed, Balance, Analysis, Exception, Journal, Server Productivity, Hourly Labor, Menu Usage, Payroll, Attendance, Inventory, all JasperReports templates. CSV unverified. |
| **11. Multi-tenant onboarding** | Yes. One `pos.config` per register, multi-company free in Community. | Multi-location yes. True multi-tenant is a $149 a year add-on. | No. `Terminal.location` is a string. Multi-store is ORO only. |
| **Kitchen printing and display** | Printers per category by IoT Box or Epson ePOS over the LAN, ESC/POS and Star raster, cancellation tickets. No Star CloudPRNT. Kitchen Display is Enterprise. | Kitchen Display free, needs a websocket service. Printing is paid: a Windows tray helper at $75 a year; the Star CloudPRNT add-on is unsupported. | OS printer by name through JasperReports, no raw ESC/POS, no network socket. Display needs a plugin. |
| **Online ordering** | QR self-order in consultation, mobile and kiosk modes, presets with `interval_time` and `slots_per_interval`, one online payment provider. Register must be open. No delivery. | Yes, its whole purpose. Delivery and collection, lead times, future days, delivery areas with tiered fees, minimum order, status workflow. No per-slot order cap in core. | ORO only, through an abstract `OnlineOrderPlugin`. |

Reading the table by count: Odoo covers something in every row and finishes
almost none of them the way the plan wants. Floreant finishes cash, voids,
employees and the pizza matrix and fails payments, offline sync and
everything cloud. TastyIgniter is strong in exactly one row and that row is
the one the studio has already built four times.

Sources per row are in the three research notes behind this file; the
decisive ones are Odoo
[`pos_order.py`](https://github.com/odoo/odoo/blob/19.0/addons/point_of_sale/models/pos_order.py),
[`pos_session.py`](https://github.com/odoo/odoo/blob/19.0/addons/point_of_sale/models/pos_session.py),
[`pos_stripe/models/pos_payment_method.py`](https://github.com/odoo/odoo/blob/19.0/addons/pos_stripe/models/pos_payment_method.py),
[`data_service.js`](https://github.com/odoo/odoo/blob/19.0/addons/point_of_sale/static/src/app/services/data_service.js),
[`pos_preset.py`](https://github.com/odoo/odoo/blob/19.0/addons/pos_self_order/models/pos_preset.py)
and the [IoT FAQ](https://www.odoo.com/app/iot-faq); TastyIgniter
[`MenuItemOption.php`](https://raw.githubusercontent.com/tastyigniter/ti-ext-cart/4.x/src/Models/MenuItemOption.php),
[`Tax.php`](https://raw.githubusercontent.com/tastyigniter/ti-ext-cart/4.x/src/CartConditions/Tax.php),
[`PaymentFee.php`](https://raw.githubusercontent.com/tastyigniter/ti-ext-cart/4.x/src/CartConditions/PaymentFee.php)
and the [marketplace](https://tastyigniter.com/marketplace); Floreant
[`TicketItem.hbm.xml`](https://raw.githubusercontent.com/floreantpos/floreantpos/floreantpos-2.0/src/com/floreantpos/model/TicketItem.hbm.xml),
[`DrawerPullReport.hbm.xml`](https://raw.githubusercontent.com/floreantpos/floreantpos/floreantpos-2.0/src/com/floreantpos/model/DrawerPullReport.hbm.xml),
[`ActionHistory.hbm.xml`](https://raw.githubusercontent.com/floreantpos/floreantpos/floreantpos-2.0/src/com/floreantpos/model/ActionHistory.hbm.xml),
[`Gratuity.hbm.xml`](https://raw.githubusercontent.com/floreantpos/floreantpos/floreantpos-2.0/src/com/floreantpos/model/Gratuity.hbm.xml)
and the [2.0 CHANGELOG](https://raw.githubusercontent.com/floreantpos/floreantpos/floreantpos-2.0/CHANGELOG.md).

---

## What to borrow, ranked by what it saves

Each item names the file to read and the license posture. The posture is the
same for all of them: read for design, write our own in TypeScript against
our own schema, keep a one-line clean-room note in the component's README
saying what was read. Schema names and API shapes are facts and are not
copyrightable. Copying or translating a file line for line is a different
act: under LGPL-3 (Odoo) it makes our file a derivative that must ship with
source; under MRPL 1.2 (Floreant) it makes the file "Covered Code" with a
startup-credit clause; under MIT (TastyIgniter) it is allowed if the notice
travels with it. Never read anything under `odoo/enterprise`.

1. **Floreant's drawer pull as the Z report checklist.** The
   `DRAWER_PULL_REPORT` columns and the `drawerResetted` sweep are an
   explicit list of what a close has to reconcile: begin cash, net sales,
   sales tax, cash receipts, card receipts, cash tips, charged tips, tips
   paid out, payouts, bleeds, refunds, cash back, accountable, to deposit,
   variance, voided tickets. Every transaction and ticket stays
   `drawerResetted=false` until a pull sweeps it into one report row and
   flips the flag, so a Z can never double count. The Jelly plan's Phase 1
   gate is the accountant signing the tax and tip report against a month of
   Aloha; this is the column list to build that report from. Read
   `DrawerPullReport.hbm.xml` and `PosTransaction.hbm.xml` (single table,
   `PAYMENT_TYPE` discriminator: cash, card, cash drop, refund, payout,
   void). Saves the design of the whole cash phase.

2. **Odoo's offline contract.** Client-generated uuid on every record,
   `sync_from_ui` as an upsert by uuid (a draft re-sent is an update, a paid
   order is left alone), orders pushed one at a time in order, a `/ping`
   every two seconds, and a guard that refuses to reload the page while paid
   orders are unsynced. Two things to do differently: Odoo keeps the pending
   queue in memory and warns users not to reload offline, so ours goes in
   IndexedDB; and Odoo's multi-register sync is last-write-wins on
   `write_date`, which is the thing its own forum says reloads registers
   mid-order, so ours uses the revision check the kitchen board already has.
   Read `data_service.js`, `pos_store.js` and `models/related_models/`.
   Saves weeks of design on the hardest item in the plan.

3. **Odoo's IoT Box as the hub reference.** A Raspberry Pi 4 image under
   LGPL (`addons/iot_box_image`, `addons/iot_drivers`); the browser polls
   `/hw_proxy/status_json` every five seconds and posts a receipt as a
   base64 PNG that the box rasterizes to ESC/POS or Star; the cash drawer is
   a printer command. That is the Jelly hub, already shaped, including the
   detail that printing over the LAN keeps working when the cloud is gone.
   The commercial detail matters as much as the code: Odoo charges $173 for
   the box or $30 a month, and production use requires a subscription and
   the Enterprise IoT app. Even the open-source register monetizes the
   hardware bridge. Read `printer_driver_base.py` (a compact ESC/POS and
   Star reference) and `hardware_proxy_service.js`. Saves the hub design;
   the Phase 2 decision on whether to ship one is unchanged.

4. **Odoo's session, order, line and payment model.** `pos.session`
   carries the opening and closing balances and the state machine;
   `pos.order` carries uuid, state, `tracking_number`, `preset_id`,
   `preset_time`, `floating_order_name`, `tip_amount`, `customer_count`,
   `table_id`; `pos.order.line` carries uuid, qty, unit price, discount,
   taxes, attribute values, combo parent, course, and a pointer to the line
   it refunds; `pos.payment` carries card brand, reference, transaction id,
   status and an `is_change` flag. Worth laying beside DeVine's
   `payment-attempts.ts` and Copper's order model before the register's
   schema is cut. Read `pos_order.py`, `pos_session.py`, `pos_payment.py`,
   `pos_restaurant.py`, `restaurant_order_course.py`.

5. **Odoo's preset as the channel abstraction.** A preset is one object
   that binds a fiscal position (which taxes), a pricelist, an
   identification rule and a timing rule, and the time slots are computed
   from `interval_time` and `slots_per_interval`, never stored. That is
   dine-in, to-go and delivery as data, and it is how the Michigan
   per-channel tax rule and the fifteen-minute capacity slots become one
   mechanism instead of two. Read `pos_preset.py`.

6. **TastyIgniter's cart conditions as total lines.** Tax, tip, payment
   fee, delivery and coupon are each a priority-sorted condition that
   persists as its own `order_totals` row. This is the right shape for the
   99 cent fee: its own labelled line, taxable in Michigan, never inside a
   tax total, which is the exact disclosure failure that sank Toast's fee
   in 2023. Read `src/CartConditions/*.php` in `ti-ext-cart`. MIT, so even
   a direct port is allowed with the notice.

7. **TastyIgniter's two-level option model.** A shared `menu_options`
   catalogue attached per item through `menu_item_options` with
   item-specific required, min, max and free-quantity rules and
   overridable value prices, plus `order_menus` snapshotting name and price
   at purchase so menu edits never rewrite history. The studio's
   `option-pricing 1.0.0` already has group-qualified options; the free
   quantity rule and the shared catalogue are the two things it lacks.
   Read `MenuItemOption.php`, `MenuOption.php`, `MenuItemOptionValue.php`.

8. **Floreant's pizza model.** Sections (whole, half), multipliers
   (regular, extra, with a rate and a ticket prefix), `PizzaPrice` by size
   and crust and order type, `ModifierMultiplierPrice` per modifier per
   size, and `sectionName` plus `multiplierName` recorded on every ticket
   modifier so the kitchen ticket prints "L: pepperoni, R: extra mushroom".
   The only open-source half-topping model found. Read `MenuItem.hbm.xml`
   and `TicketItem.hbm.xml`.

9. **Floreant's void and audit rows.** `VoidReason` as a table, `voidedBy`
   on the ticket, and `ActionHistory` with time, action, description and
   performer. The kitchen's audit contract already writes rows like this;
   the reason table is the missing piece for item 7 of the plan.

Not worth borrowing: Odoo's tax engine (built for VAT and fiscal positions,
US sales tax is manual or AvaTax), Odoo's reporting (pivot tables, no
builder), TastyIgniter's tax (one integer), TastyIgniter's printing (paid,
Windows-only), Floreant's payments (sandbox-only Authorize.Net) and
Floreant's printing (OS printer by name through Jasper).

---

## Could we just run Odoo

The honest option, stated once. Odoo Community 19 or 20 on a $20 to $40 a
month VPS or a mini PC on the restaurant's LAN gives tables, courses, split
by item, Stripe Terminal without a box, Epson ePOS printers over the LAN,
cash sessions, PIN login and QR ordering with time slots. Our online
ordering could create draft orders through the JSON-2 API or by mimicking
the self-order routes. The research estimate is two to four weeks of studio
time to install, set Michigan tax by hand, style receipts, fake half
toppings as attributes and build the bridge, plus Postgres backups and a
yearly OpenUpgrade pass.

Why it is not the product. The kitchen display is Enterprise. The IoT Box
in production is Enterprise plus a subscription, so the one piece of
hardware the plan says to own would be rented. There is no Connect
application fee, so the processing line on the promise page cannot be
printed on the bill. The interface is Odoo's, and the pitch is ours. The
client was rewritten between versions 16 and 18 and custom modules broke,
so every yearly upgrade is a risk carried for the restaurant. And the
Community forum's own reports of registers reloading mid-order and a site
"basically unusable" after an upgrade are the Saturday-night failure the
plan says it cannot have. It is the only shortcut that exists, and it leads
somewhere other than the promise page.

Unverified either way: whether a pure Community database can pair an IoT
Box at all, how Stripe tip-after-payment behaves in a real rush, and
multi-tablet reliability on a weekend.

---

## What this says about the Jelly plan

Findings, not amendments. The plan is not edited by this note.

- **The missing half is missing everywhere.** Nothing open source does
  pre-authorized tabs, tip declaration or pooling, a tip-credit check, a
  per-channel alcohol rule or half toppings (Floreant excepted). The
  Toast and Aloha study's closing sentence survives a second look: the
  half the studio does not own is the half nobody does well for a small
  pizza tavern, and that includes the free software.
- **The hub is a solved shape and a known price.** Odoo's box is the design
  and the proof that it can be a Pi. The decision to ship one stays at the
  Phase 2 gate, but the engineering risk in section 9 of the plan is
  smaller than it read.
- **Offline is a contract, not a feature.** Uuid upsert, ordered replay,
  a reload guard, and a durable outbox. The plan's item 9 can be written
  as that contract now, before any register code exists, and the ordering
  system can adopt the uuid and the reload guard in Phase 0 at no cost.
- **The fee is a totals line.** Modelling the 99 cents as its own
  persisted line, with its own tax, is both the clean implementation and
  the disclosure the study says the fee needs.
- **The Z report has a column list.** Floreant's drawer pull is the
  accountant's checklist for the Phase 1 gate. Build the report to those
  columns and the gate has a definition.
- **Software-forward is the edge, and even Odoo sells the hardware.**
  Toast, Aloha, SkyTab and Clover lock with the terminal; Odoo locks the
  hub behind a subscription. A register that runs in a browser on hardware
  the operator owns, with one box we build and they keep, is the inverse of
  every one of them. Kevin, 2026-10-28: "the fact that these competitors
  are primarily focused on hardware and not software feels like a huge
  advantage to us." The teardown agrees, with Square as the standing
  exception that is already software-forward.

## What was not checked

No project was installed or run. Odoo's HTML documentation rendered empty
for the fetcher, so its docs were read from the documentation repo on
GitHub at the same version. TastyIgniter's storefront quality is unverified
because the demo requires sign-up; its 2.x GPL version is unverified. For
Floreant, drawer kick, CSV export, split by seat and the behaviour when the
database host dies mid-shift are unverified. Nothing here is a license
opinion; the posture above is the conservative reading of the three
licenses and should be confirmed before any file is copied rather than
read.
