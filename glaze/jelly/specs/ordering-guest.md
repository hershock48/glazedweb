# The guest ordering flow, and its words

**What this is.** Build outline steps 1.4 and 1.5 as the guest sees them,
on the demo tenant first. The screens, what each one owes the offline
contract, the funnel events it writes, and the words on it. Words are
Claude's lane and follow glaze.md and the no-tells list in standards.md.
Written 2026-10-29. Design, not code; Codex builds it against
`compute-totals.md` and the data model.

## The flow

Five screens, one domain, no account. The restaurant's site links to the
ordering host; from there to a placed order the guest never leaves it.
That is the whole reason the funnel can be seen.

| Screen | Path | What it does | Funnel event |
|---|---|---|---|
| Landing | `/` on the tenant host | The restaurant's name, open or closed right now with the next opening, the Order button, the phone number as a tap target. If ordering is paused, says so and still shows the phone. | `landing` with referrer and UTM |
| Menu | `/order` | Sections in the revision's order, items with price, sold-out items shown struck through and unorderable, alcohol sections marked 21+. Tapping an item opens its sheet. | `menu` |
| Item sheet | `/order/item/<stableId>` | Options by group with the rules enforced live, the pizza builder for pizza items, quantity, a note field, Add. The price updates as picks change, from the same `computeTotals`. | `item` |
| Cart | `/order/cart` | Lines with their picks in words, edit and remove, the subtotal, and the fee line if it applies, labelled. Continue. | `cart` |
| Checkout | `/order/checkout` | Name, phone, pickup time from the slot grid, the 21+ acknowledgement when the cart has alcohol, tip presets and custom, payment. One button. | `checkout`, then `placed` on success |
| Confirmation | `/order/<trackingCode>` | The order as placed, the promised time, "we'll text you when it's ready", the phone number, the receipt lines. Bookmarkable; refreshes status. | |

## The pizza builder

Size first, crust second, then toppings. Each topping has a whole, left
and right choice (quarters only when the shop's policy allows them), and
a level (Regular, Extra) when the shop defines more than one. The running
price shows every row the way the receipt will. Choosing the same topping
on both halves collapses to whole. Over the shop's topping limit, the
button says so and stays off. Named pizzas start with their preset
toppings loaded and editable.

## Pickup time

The slot grid is computed from the channel profile: interval, capacity per
interval, lead time, order-ahead days, and the kitchen hours. A full slot
is shown and unselectable, never hidden, so the guest sees why. The first
available slot is selected by default. "As soon as possible" is the first
slot, named by its time. The promised time is stored in UTC with the
location's zone.

## Alcohol

A cart holding an item from a 21+ section shows one acknowledgement at
checkout, required, and the ticket prints ID CHECK. The actual carding
happens at the counter, where it always has. Online sale of alcohol is off
in Stage 1 until step 0.7 confirms the statute; the sections exist in the
seed so the switch is one setting.

## Payment

Card through Stripe on the restaurant's connected account with the
platform fee attached (step 1.9), or pay at the counter if the shop allows
it, which the seed does. Pay-at-counter orders print DUE AT PICKUP on the
slip. A card order places the order only after the payment intent
succeeds; a dropped connection between the two is the offline contract's
first test.

## What the screens owe the offline contract

- A client uuid is minted when the cart is created and travels with the
  order to the server, which upserts by it. A retried submit creates one
  order.
- The checkout button disables on tap and shows the state. If the
  response is lost, the client asks the server for the order by uuid
  before letting the guest try again (`order-recovery 1.0.0`, kept).
- The menu and the guest's cart live in IndexedDB; a reload mid-order
  keeps the cart. The price is recomputed from the current revision on
  reload and any difference is shown before checkout.
- The connection state is shown in the chrome, quietly, only when it is
  not fine.

## The words

Plain, short, the way the owner would say it across the bar. No sets of
three by habit, no contrast sentences, no punchline closers. The fee is
stated once, never defended (Kevin, 2026-09-01).

| Where | Words |
|---|---|
| Landing, open | Open now. Kitchen closes at 9. |
| Landing, closed | Closed right now. Ordering opens Tuesday at 11. |
| Landing, paused | We're catching up in the kitchen. Online ordering is back in about 20 minutes. Call us at (phone). |
| Menu, sold out | Sold out today |
| Item sheet, required group empty | Pick a sauce |
| Pizza builder, over the limit | Eight toppings is the limit on this one |
| Cart, fee line | Order fee $0.99 |
| Cart, fee note (once, small) | A flat 99 cents on online orders. No percentage. |
| Checkout, slot full | That time is full. The next open one is 6:15. |
| Checkout, alcohol | I'm 21 or older and will show ID at pickup. |
| Checkout, tip | Tip the kitchen |
| Checkout, button | Place order |
| Checkout, button while placing | Placing... |
| Checkout, lost connection | We lost the connection. Checking whether your order went through. |
| Confirmation, title | Got it. Ready around 6:15. |
| Confirmation, ready line | We'll email (address) when it's ready. Or, with no email: Show the code at pickup. (A text needs an SMS provider; none exists yet.) |
| Receipt, tax on fee | Tax on order fee |

Nothing on any shop-facing or guest-facing screen totals the fee as a
metric; it appears on receipts and in the owner's reports only.

## Funnel events

Written server side where the event is a fact (`placed` after the commit)
and client side for the steps before it, into `funnel_event` with a
session hash, the step, the referrer and the UTM fields, never a name or
a phone. The owner's report shows the five counts and the drop between
each, by day, by referrer. That is the "where orders were lost" number.

## Done when

On the demo tenant: a guest orders the Case A pizza from the spec's test
table and a Vernors, picks a slot, tips, pays at counter, and the
confirmation, the kitchen ticket and the receipt all show the same cents;
the network dropped mid-submit yields one order; the funnel shows one
visitor at every step.
