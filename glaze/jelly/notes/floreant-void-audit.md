# Floreant voids, discounts, permissions and the audit trail

**Source.** github.com/floreantpos/floreantpos, branch `floreantpos-2.0` (2.0 Beta, build 2001, tip commit 2026-05-23), license MRPL 1.2 (Mozilla Public License 1.1 with an attribution clause). Read 2026-10-29 from raw.githubusercontent.com. Paths are relative to `src/com/floreantpos/`.

## What it is

Floreant has a managed list of void reasons, a void flag on the ticket row, a flat permission set attached to a user type, and two history tables. `ACTION_HISTORY` holds a timestamp, a label, a free-text description and a performer. `ATTENDENCE_HISTORY` holds clock in and clock out with shift and terminal. One table holds coupons and discounts; an applied one is snapshotted onto the ticket or item.

## Observed

| Thing | Where (file, property or line) | What it does |
|---|---|---|
| Void reason | `model/VoidReason.hbm.xml` 4-8 | Table `VOID_REASONS`, one column `REASON_TEXT` |
| Ticket void fields | `model/Ticket.hbm.xml` 10, 15-20, 94-96 | `CLOSING_DATE`, `VOIDED`, `VOID_REASON` (text, no id), `WASTED`, `REFUNDED`, `SETTLED` (property `closed`), `voidedBy` in `VOID_BY_USER` |
| Void flow | `model/dao/TicketDAO.java` 136-191; `actions/VoidTicketAction.java` 41 | Sets `voided`, `closed`, `closingDate`; if paid, adds one `VOID_TRANS` transaction (DEBIT, CASH, amount = `paidAmount`); the action requires `VOID_TICKET` |
| Void dialog | `ui/dialog/VoidTicketDialog.java` 286-300, 371-376 | Copies reason text, sets `wasted` and `voidedBy`; an unpaid ticket with nothing printed to the kitchen is deleted outright via `deleteTickets`; a refund creates a `REFUND` transaction and adjusts `terminal.currentBalance` |
| Discount definition | `model/Discount.hbm.xml` 8-38 | Table `COUPON_AND_DISCOUNT`: `TYPE`, `BARCODE`, `QUALIFICATION_TYPE`, `APPLY_TO_ALL`, `MINIMUM_BUY` (property `minimunBuy`), `MAXIMUM_OFF` (property `miximumOff`), `VALUE`, `EXPIRY_DATE`, `ENABLED`, `AUTO_APPLY`, `MODIFIABLE`, `NEVER_EXPIRE`, `UUID`; many-to-many to menu items, groups and categories; types (`Discount.java` 47-54) AMOUNT 0, PERCENTAGE 1, RE_PRICE 3, ALT_PRICE 4; qualification ITEM 0, ORDER 1 |
| Discount snapshots | `model/TicketDiscount.hbm.xml` 8-17; `model/TicketItemDiscount.hbm.xml` 8-17; `Ticket.java` 452-461 | `DISCOUNT_ID`, `NAME`, `TYPE`, `AUTO_APPLY`, `MINIMUM_AMOUNT`, `VALUE`, `TICKET_ID`; item version adds `MINIMUM_QUANTITY` and computed `AMOUNT` |
| Permission list | `UserPermission.java` 71-106 | Table `USER_PERMISSION` with `NAME` as primary key (`UserPermission.hbm.xml` 8). The 27: Create New Ticket, View All Open Ticket, Void Ticket, Perform Administrative Task, Perform Manager Task, View Back Office, Authorize Tickets, Drawer Assignment, Drawer Pull, Split Ticket, Settle Ticket, Reopen Ticket, Pay Out, Shut Down, Add Discount, Refund, View Explorers, View Reports, Manage Table Layout, Booking, Modify Printed Ticket, Transfer Ticket, Kitchen Display, All Functions, Hold Ticket, View All Close Tickets, Quick Maintenance |
| Role and check | `model/UserType.hbm.xml` 9-17; `UserType.java` 52-59; `User.java` 70-72, 175-180 | Table `USER_TYPE`, `P_NAME`, permission set via `USER_USER_PERMISSION`; `hasPermission` is set membership; manager and admin are permissions |
| User row and login | `model/User.hbm.xml` 5-29; `model/dao/UserDAO.java` 110-117 | Table `USERS`: `USER_ID` unique, `USER_PASS` (16 chars, not null, unique), `SSN`, `COST_PER_HOUR`, `CLOCKED_IN`, `LAST_CLOCK_IN_TIME`, `LAST_CLOCK_OUT_TIME`, `N_USER_TYPE`; login is equality on the password column |
| Action history | `model/ActionHistory.hbm.xml` 4-12; `model/dao/ActionHistoryDAO.java` 36-47; `ActionHistory.java` 42-52 | Table `ACTION_HISTORY`: `ACTION_TIME`, `ACTION_NAME`, `DESCRIPTION`, `performer` in `USER_ID`; `saveHistory` swallows failures; the eleven names come from the `Messages` bundle, so stored names are translated text |
| Logged actions found | `ui/views/order/OrderController.java` 252, 255; `services/PosTransactionService.java` 130, 186; `VoidTicketDialog.java` 318; `ui/dialog/PayoutDialog.java` 110 | NEW_CHECK, EDIT_CHECK, SETTLE_CHECK, VOID_CHECK, PAY_OUT |
| Not logged in files read | `model/dao/GratuityDAO.java` 66-93; `ui/dialog/DrawerStatusDialog.java`; `DiscountSelectionDialog.java`; `actions/RefundAction.java` | Tips paid, drawer open and close, discounts, refunds and clock events write no `ACTION_HISTORY` row; drawer events go to `DRAWER_ASSIGNED_HISTORY` |
| Attendance row | `model/AttendenceHistory.hbm.xml` 8-18 | `CLOCK_IN_TIME`, `CLOCK_OUT_TIME`, `CLOCK_IN_HOUR`, `CLOCK_OUT_HOUR`, `CLOCKED_OUT`, `USER_ID`, `SHIFT_ID`, `TERMINAL_ID` |
| Clock in and out | `User.java` 74-109; `actions/ClockInOutAction.java` 154-171 | Clock in writes a row with `HOUR_OF_DAY`; clock out marks the open row, or synthesizes one using `Calendar.HOUR` (12-hour) at line 162 |
| Report templates | `report/AttendanceReportView.java` 169; `report/PayrollReportView.java` 138; `report/HourlyLaborReportView.java` 276-279; `report/SalesExceptionReportView.java` 107-121 | `EmployeeAttendanceReport`; `PayrollReport` over `AttendenceHistoryDAO.findPayroll` (149-183, clock in >= from and clock out <= to); `hourly_labor_report` with `hourly_labor_subreport` and `hourly_labor_shift_subreport`; `sales_summary_exception` with `_voids` and `_discounts`; `drawer-pull-void-veport.jrxml` exists with no Java reference found |

## What Jelly takes

1. Void reasons are an owner-edited list with a free-text fallback.
2. A void records who did it, when, why, and whether food was wasted.
3. Voiding a paid ticket produces a reversing money event.
4. Permissions are a flat named set on a role, checked by membership.
5. Applied discounts are snapshotted onto the ticket, and attendance rows carry shift and terminal.

## What Jelly changes

1. `void_reason_id` is a foreign key with the text snapshotted beside it. Reason: Floreant stores only the text, so reason edits orphan old tickets.
2. No ticket is ever deleted on void; an unpaid unsent ticket becomes `cancelled`. Reason: `VoidTicketDialog` 290-294 deletes the row, hiding a cashier who opens and drops tickets.
3. The audit row is written in the same transaction as the change, with `entity_type`, `entity_id`, a stable `action_code` and before and after JSON. Reason: Floreant's writer swallows failures, stores a translated label and a free string, outside the change's transaction.
4. Every state change is logged, each with performer and approver. Reason: five actions are logged in the files read, the rest have constants with no writer, and there is no approver column.
5. PINs are salted and hashed per tenant, and there is no `SSN` column. Reason: `USER_PASS` is a plaintext 16-character unique column and login is an equality lookup.
6. Clock times are `timestamptz` with no duplicated hour columns. Reason: Floreant stores the hour twice, in two code paths that disagree on 12-hour versus 24-hour.

## Clean-room line

Read for design on 2026-10-29; nothing copied; MRPL 1.2 forbids copying into Jelly. Column names reused only as facts: `REASON_TEXT`, `VOID_REASON`, `VOID_BY_USER`, `WASTED`, `QUALIFICATION_TYPE`, `ACTION_NAME`, `CLOCK_IN_HOUR`, `USER_PASS`, `N_USER_TYPE`.

## Open questions

- Whether SPLIT_CHECK, REOPEN_CHECK, PRINT_CHECK, PAY_CHECK, GROUP_SETTLE or PAY_TIPS are written anywhere; no caller found in the files read; the full tree was not grepped.
- Whether `ADD_DISCOUNT` (`UserPermission.java` 85) and `REFUND` are checked anywhere; no check appeared in `DiscountSelectionDialog.java` or `RefundAction.java`.
- Whether `Discount.getAmountByType` (88-89 subtracts `value / 100` from a price) is live; no caller traced.
- Whether `drawer-pull-void-veport.jrxml` is loaded by `print/PosPrintService.java`, which was not read.
