# Floreant drawer pull and Z report

**Source.** github.com/floreantpos/floreantpos, branch `floreantpos-2.0` (2.0 Beta, build 2001, tip commit 2026-05-23), license MRPL 1.2 (Mozilla Public License 1.1 with an attribution clause). Read 2026-10-29 from raw.githubusercontent.com. Paths are relative to `src/com/floreantpos/`.

## What it is

Floreant treats the cash drawer as a property of the terminal. The terminal row carries both balances and an assigned cashier. Every tender, payout, cash drop, refund and tip payment nudges `currentBalance` in Java, and every ticket and transaction carries a `drawerResetted` flag that starts false. Closing the drawer builds a `DrawerPullReport` from everything still flagged false for that terminal, saves it, then runs two HQL updates that flip the flag to true. That saved row is the Z report. The open and close screen here is `DrawerStatusDialog`.

## Observed

| Thing | Where (file, property or line) | What it does |
|---|---|---|
| Report row | `model/DrawerPullReport.hbm.xml`, table `DRAWER_PULL_REPORT` | One row per close, linked to `terminal` (74) and `assignedUser` (70) |
| `beginCash` | hbm 11; `print/DrawerpullReportService.java` 96 | Copied from `terminal.openingBalance` |
| `netSales`, `salesTax`, `ticketCount`, `chargedTips` | hbm 10-13, 31; service 224-280 | Tickets with `paidAmount > 0`, not voided (or refunded), `drawerResetted = false`, this terminal; tips sum unrefunded `Gratuity.amount` |
| Cash, credit, debit receipt amount and count | hbm 20-25; service 299-312 | Per ticket, transactions summed by Java class |
| `giftCertReturnAmount`, `giftCertChangeAmount`, `cashBack`, `refundAmount` | hbm 17-19, 26-29; service 74-76, 314-318 | Gift tenders and change; refunds per terminal |
| `tipsPaid` | hbm 32; `model/dao/TicketDAO.java` 252-272 | Sum of `gratuity.amount` where `paid = true` on un-reset tickets |
| `payOutAmount`, `drawerBleedAmount` and counts | hbm 34-37; service 80-94 | Unsettled `PAY_OUT` and `CASH_DROP` transactions; Drawer Bleed opens `CashDropDialog` (`actions/DrawerBleedAction.java` 34) |
| `drawerAccountable` | hbm 38; `model/DrawerPullReport.java` 114-122 | Formula below |
| `cashToDeposit`, `variance`, `cashTips` | hbm 30, 39-40; service 97; `ui/dialog/CashCardManagementDialog.java` 580-645 | Deposit is seeded from `terminal.currentBalance` and later editable as "Actual"; the other two have no writer |
| `voidTickets`, `totalVoid`, `totalVoidWst`, `totalDiscount*` | hbm 43-68; service 122-163, 186-220 | Per-ticket void entries are commented out (199-210); totals are filled |
| Transaction row | `model/PosTransaction.hbm.xml`, discriminator `PAYMENT_TYPE` (10) | Table `TRANSACTIONS`; subclasses `CASH`, `CUSTOM_PAYMENT`, `GIFT_CERT`, `CREDIT_CARD`, `DEBIT_CARD`, `CASH_DROP`, `REFUND`, `PAY_OUT`, `VOID_TRANS` (81-107) |
| Transaction columns | hbm 14-26, 47 | `tipsAmount`, `tenderAmount`, `transactionType` (`CREDIT` or `DEBIT`), `paymentType` in `PAYMENT_SUB_TYPE`, `captured`, `authorizable`, `drawerResetted` |
| Ticket columns | `model/Ticket.hbm.xml` 14-27, 82-98 | `PAID`, `VOIDED`, `VOID_REASON`, `WASTED`, `REFUNDED`, `SETTLED` (property `closed`), `DRAWER_RESETTED`, `PAID_AMOUNT`, `DUE_AMOUNT`; links `shift`, `owner`, `gratuity`, `voidedBy` in `VOID_BY_USER`, `terminal` |
| Terminal | `model/Terminal.hbm.xml` 11-13, 26 | `OPENING_BALANCE`, `CURRENT_BALANCE`, `HAS_CASH_DRAWER`, `ASSIGNED_USER`; shift label in `TERMINAL_PROPERTIES` as `drawer.shift.name` (`Terminal.java` 32) |
| Balance moves | `services/PosTransactionService.java` 192-213; `ui/dialog/PayoutDialog.java` 80-88; `ui/dialog/VoidTicketDialog.java` 371-376; `model/dao/GratuityDAO.java` 79-81 | Cash tender adds; void, gift cash back, payout, refund and tip payout subtract; payout and drop refuse an amount above `currentBalance` (`CashDropDialog.java` 286) |
| Open drawer | `ui/dialog/DrawerStatusDialog.java` 315-370 | Needs a clocked-in user with `DRAWER_ASSIGNMENT` and an amount >= 0; sets `assignedUser` and both balances; stamps the shift label; writes `DrawerAssignedHistory` ASSIGNMENT |
| Close drawer | same 464-510; `model/dao/TerminalDAO.java` 103-149 | Builds the report, HQL flips `drawerResetted` on closed tickets and all transactions for the terminal, nulls `assignedUser`, zeroes both balances, saves report plus `CashDrawerResetHistory` plus CLOSE history, prints |
| Tips cash-out | `model/Gratuity.hbm.xml` 9-18; `GratuityDAO.java` 47-93; `CashCardManagementDialog.java` 1462-1495 | Gratuity has `AMOUNT`, `PAID`, `REFUNDED`, `TICKET_ID`, `OWNER_ID`, `TERMINAL_ID`; unpaid ones by owner are set `paid = true` and each amount is subtracted from `currentBalance` |

Formula as the code computes it (`DrawerPullReport.java` 122):

`drawerAccountable = beginCash + cashReceiptAmount - tipsPaid - payOutAmount - cashBack - refundAmount - drawerBleedAmount`

Lines 105-112 also set `grossReceipts`, `receiptDifferential` and `tipsDifferential = chargedTips - tipsPaid`.

## What Jelly takes

1. A drawer session opens with a named cashier and a counted float, and the same act that closes it produces the Z report.
2. The Z report is a stored row, so later ticket edits cannot change it.
3. Expected cash comes only from recorded movements: float, cash tenders, cash refunds, payouts, drops, tips paid out.
4. Charged tips and tips paid out are tracked apart, and the gap is printed.
5. Payouts and drops are refused above the expected cash on hand, and drawer open and close are audit events with user and time.

## What Jelly changes

1. An append-only `drawer_event` ledger keyed by `drawer_session_id` replaces a mutable balance on the terminal. Reason: Floreant writes `currentBalance` from at least seven call sites, so the number is hard to trust.
2. A `drawer_session_id` foreign key on every tender row replaces the `drawerResetted` sweep. Reason: the HQL updates at `TerminalDAO` 118-125 mutate two tables and cannot be re-run safely.
3. `counted_cash` is entered at close and `variance = counted - expected` is computed in integer cents. Reason: `variance` has no writer, `cashToDeposit` is seeded from the running balance, and every amount is a `Double`.
4. Per-void detail stays in the Z report. Reason: Floreant's entry set is commented out, so the report shows a void total with nothing behind it.
5. A cash drop is a ledger line with a destination (safe, deposit bag). Reason: Floreant's `CASH_DROP` transaction has no destination.
6. The session belongs to a drawer, with the terminal as a device attribute. Reason: binding the drawer to the terminal row breaks when two cashiers share a device.

## Clean-room line

Read for design on 2026-10-29; nothing copied; MRPL 1.2 forbids copying into Jelly. Column names reused only as facts: `BEGIN_CASH`, `NET_SALES`, `DRAWER_ACCOUNTABLE`, `CASH_TO_DEPOSIT`, `VARIANCE`, `DRAWER_RESETTED`, `PAYMENT_TYPE`, `OPENING_BALANCE`, `CURRENT_BALANCE`.

## Open questions

- Whether `CashDropTransactionDAO.saveNewCashDrop` lowers `currentBalance`; not read.
- Whether anything writes `cashTips` or `variance`; nothing found, so both may be dead columns.
- Close is not atomic: `DrawerStatusDialog` 475-501 saves the report in one session and the CLOSE history row in a second.
- The "2.0.1" label was not found; the changelog says 2.0 Beta build 2001.