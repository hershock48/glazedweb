# Floreant pizza and modifier model

**Source.** github.com/floreantpos/floreantpos, branch `floreantpos-2.0` (2.0 Beta, build 2001, tip commit 2026-05-23), license MRPL 1.2 (Mozilla Public License 1.1 with an attribution clause). Read 2026-10-29 from raw.githubusercontent.com. Paths are relative to `src/com/floreantpos/`.

## What it is

A Floreant pizza is a normal menu item with `pizzaType` set. Its base price comes from a matrix of size, crust and order type. Toppings are menu modifiers with a per-size price table, one price per "multiplier" such as Regular or Extra. A topping can land on the whole pie, a half or a quarter, and a flag on the modifier decides whether a half costs half. The ticket keeps one `TicketItem` with a size-and-crust pseudo-modifier and a flat list of `TicketItemModifier` rows stamped with section and multiplier names.

## Observed

| Thing | Where (file, property or line) | What it does |
|---|---|---|
| Pizza flag, portion, price link | `model/MenuItem.hbm.xml` 37-38, 45-48, 60-65 | `pizzaType` in `PIZZA_TYPE`; `defaultSellPortion` (a percent) in `DEFAULT_SELL_PORTION`; `pizzaPriceList` through table `MENUITEM_PIZZAPIRCE` (typo in source); `menuItemModiferGroups` |
| `PizzaPrice` | `model/PizzaPrice.hbm.xml` 9-20; `PizzaPrice.java` 16-18 | `PRICE`, `size`, `crust`, `orderType`; `getPrice(portion)` returns `price * portion / 100` |
| Size and crust | `model/MenuItemSize.hbm.xml` 9-14; `model/PizzaCrust.hbm.xml` 9-13 | `NAME`, `SORT_ORDER`, `SIZE_IN_INCH`, `DEFAULT_SIZE`; `NAME`, `DEFAULT_CRUST` |
| `Multiplier` | `model/Multiplier.hbm.xml` 5-12; `Multiplier.java` 7 | Primary key is `NAME` (20 chars); `TICKET_PREFIX`, `RATE`, `DEFAULT_MULTIPLIER`, `MAIN`; constant `REGULAR = "Regular"` |
| Price tables | `model/PizzaModifierPrice.hbm.xml` 9-16; `model/ModifierMultiplierPrice.hbm.xml` 8-19 | One `PizzaModifierPrice` per size (`ITEM_SIZE`) holding a list of `ModifierMultiplierPrice` rows: `PRICE` per `multiplier` |
| `MenuModifier` | `model/MenuModifier.hbm.xml` 13-29, 38-48 | `PRICE`, `EXTRA_PRICE`, `FIXED_PRICE`, `shouldSectionWisePrice` in `SECTION_WISE_PRICING`, `pizzaModifier` in `PIZZA_MODIFIER`, both price lists |
| Group limits | `model/MenuItemModifierGroup.hbm.xml` 9-16; `TicketItem.java` 924-930; `PizzaModifierSelectionDialog.java` 515-538 | `MIN_QUANTITY`, `MAX_QUANTITY`, no `required` column; required means `minQuantity > 0`; max is raised to min when lower and an add past max shows an error |
| `TicketItem` pizza fields | `model/TicketItem.hbm.xml` 30-31, 40, 42, 44-50, 84; `TicketItem.java` 50-70 | `TREAT_AS_SEAT`, `SEAT_NUMBER`, `PIZZA_TYPE`, `sizeModifier` in `SIZE_MODIFIER_ID`, ordered list via `TICKET_ITEM_MODIFIER_RELATION`, `PIZZA_SECTION_MODE` with FULL 1, HALF 2, QUARTER 3 |
| `TicketItemModifier` | `model/TicketItemModifier.hbm.xml` 12-25; `TicketItemModifier.java` 28-32 | `unitPrice` in `MODIFIER_PRICE`, `MODIFIER_TYPE` (NORMAL 1, EXTRA 3, CRUST 5, SEPERATOR 6), `INFO_ONLY`, `SECTION_NAME` (20 chars), `MULTIPLIER_NAME`, `SECTION_WISE_PRICING` |
| Sections | `ui/views/order/multipart/PizzaModifierSelectionDialog.java` 315-321, 965-967 | WHOLE factor 1; Half 1 and Half 2 factor 0.5; Quarter 1 to 4 factor 0.25; `Section.calculatePrice` returns `price * factor` |
| Size and crust pick | dialog 1432-1447 | `ticketItem.unitPrice = PizzaPrice.getPrice(defaultSellPortion)`; a CRUST modifier is created with `infoOnly = true` and the size and crust names |
| Topping add | dialog 530-660, 706-725; `TicketItem.java` 217-226 | New row: count 1, `unitPrice = getPriceForSizeAndMultiplier(size, false, multiplier)`, `multiplierName`, `shouldSectionWisePrice` copied from the menu modifier; `sectionName` set and, when section-wise, `unitPrice *= factor` (626-630); then every non-info modifier is multiplied by `portion / 100` again (641-643) |
| Price lookup | `model/MenuModifier.java` 154-183 | Find the size row; a Regular entry sets `regularPrice`; an entry matching the multiplier name wins; otherwise `regularPrice * rate / 100` |
| Subtotal | `TicketItem.java` 555-600 | Base `unitPrice * count`, plus size modifier, plus each section-wise modifier, plus each non-section-wise modifier once per `modifierId`, plus add-ons |

Half-and-half with an extra topping on one half, as the code prices it: large pizza, pepperoni on Half 1, mushroom on Half 2, extra cheese on Half 1 at the "Extra" multiplier, section-wise pricing on.

1. Base: `PizzaPrice(large, crust, order type).price * defaultSellPortion / 100`.
2. Pepperoni: large Regular price times 0.5.
3. Mushroom: large Regular price times 0.5.
4. Extra cheese: the (large, Extra) row if it exists, else large Regular times `Extra.rate / 100`; then times 0.5.
5. Subtotal is the sum, one row per topping.

With section-wise pricing off, each distinct topping is charged its full size price once, however many sections it covers. If `defaultSellPortion` is anything other than 100, the rescale compounds on every add, which reads as a bug and is unverified at runtime.

## What Jelly takes

1. Base price is a matrix of size, crust and channel, looked up once and snapshotted onto the line.
2. Toppings carry a per-size price and a named level (regular, extra, double).
3. A topping row records which section it covers and which level it was sold at.
4. Whole, half and quarter are the only coverage shapes.
5. Group minimum and maximum are enforced at add time.

## What Jelly changes

1. Section coverage is a fraction column and a position, with the price factor derived from the fraction. Reason: Floreant hard-codes the factor into seven UI objects and stores a 20-character name.
2. The half-price rule is a per-shop policy (`proportional`, `full`, `rounded_up`) applied at pricing and snapshotted on the line. Reason: Floreant's flag lives on each modifier, so a shop must set it on every topping.
3. Pricing runs once in a pure function from the snapshot, with no rescale pass. Reason: the `updateModifiersUnitPrice` loop multiplies already-scaled prices on every add.
4. Levels are a lookup table with an id. Reason: Floreant uses the name as primary key, so renaming "Extra" breaks every price row and stored line.
5. The same topping on both halves is one line at the whole price, by rule. Reason: Floreant asks the cashier a yes/no question mid-order (dialog 613-620).

## Clean-room line

Read for design on 2026-10-29; nothing copied; MRPL 1.2 forbids copying into Jelly. Column names reused only as facts: `PIZZA_TYPE`, `DEFAULT_SELL_PORTION`, `SECTION_WISE_PRICING`, `SECTION_NAME`, `MULTIPLIER_NAME`, `PIZZA_SECTION_MODE`, `MIN_QUANTITY`, `MAX_QUANTITY`, `RATE`.

## Open questions

- Whether `model/TicketItemSection.hbm.xml` (`NAME`, `MAIN`, `SHOW_NAME`, toppings list) is used; its Java class returned 404 and no reference was found.
- Whether `defaultSellPortion` is ever set below 100 in practice; the rescale was read from source only.
- Whether `extraPrice` applies on the pizza path; the count-based swap was seen only in `ui/views/order/modifier/ModifierView.java` 241.
- Whether `TREAT_AS_SEAT` touches pizza lines; it was seen only in merge and display code (`TicketItem.java` 437-440, 725).
