# Runbook: the pass

**What this is.** Build outline step 1.12, version one, rewritten
2026-10-29 to say what Jelly does today, not what it might. What to do
when something goes wrong where the tickets come out, written so someone
other than Kevin can walk every case on the demo tenant. Each case says
what the restaurant sees, what we see, what to do in the first two
minutes, and what to say. A page per case. Update it in the commit that
changes the behavior.

## Before service

- The kitchen board (`/t/{slug}/kitchen`, staff PIN) is signed in. Its
  printer strip shows each printer as polling; a printer that has not
  polled in the last minute shows "last seen" with a time instead.
- The owner's phone has the workroom open. Hours and ordering has the
  pause control; Today has the orders, the printers and the tickets that
  need a look.
- Our side: the workroom's Today for the tenant, read the same way. No
  separate ops console exists yet (Stage 4).

## Case 1. Paper out

**They see:** a ticket on the kitchen board with no paper, the printer's
light blinking.
**We see:** the print job stays leased, never confirmed. After the lease
runs out the job goes back to queued and is offered again on the next
poll. Today says "N tickets need a look: fetched and never confirmed,
failed, or expired" once a job has been fetched without a confirm.
**Do:** the kitchen works from the board. Load paper. The queued jobs
print in order once the printer polls again; a job is leased to one poll
at a time and confirmed once, so nothing prints twice.
**Say:** "Paper's out. The board has it. Load paper and the tickets catch
up."

## Case 2. Printer offline, cloud up

**They see:** tickets on the board, nothing on paper, the printer light
off or steady with no activity. The board's printer strip shows "last
seen" instead of polling.
**We see:** the same strip on Today, and jobs piling up queued.
**Do:** check power and the network cable at the printer. If it comes
back, the queue drains in order. If not, the kitchen runs from the board
for the rest of service and the owner is told the printer is down. A
spare printer from the shelf is a Stage 4 answer; in Stage 1 it is the
board. Orders are accepted by the board's Accept as well as by paper, so
nothing waits on the printer.
**Say:** "Printer's not reaching us. The board has every ticket. We'll
keep watching it."

## Case 3. Cloud down, restaurant up

**They see:** the kitchen board shows "Lost connection. The board shows
the last tickets it saw and retries every five seconds." New online
orders stop arriving; the printer stops.
**We see:** Vercel's status, and the owner's text.
**Do:** nothing prints anywhere until the cloud is back; CloudPRNT polls
the cloud by design and the hub does not exist until Stage 3. The
ordering page is served by the same cloud, so guests do not reach a page
that takes an order it cannot keep: the site is simply down for them. A
guest who was mid-checkout when it went sees "We lost the connection.
Checking whether your order went through," and the page checks by the
order's own id before telling them to try again; a charge is never taken
for an order that was not written. Phone orders keep coming the old way.
When the cloud returns the board reconnects on its own and the printer
resumes.
**Say:** "Our side is down. Online ordering is off and guests cannot
reach it. Phone's still phone. We'll tell you the moment it's back."

## Case 4. A card payment that did not finish

**They see:** nothing, and that is the point. A ticket prints only once
an order is written, and a card order is written only once the payment
succeeds, so a ticket at the pass for a card that did not clear cannot
happen. What can happen is a guest at the counter saying they paid and
no order exists.
**We see:** Payments in the workroom lists "Payments that need a look":
attempts that are unknown (the processor may hold the money and nobody
confirmed it) or still processing after ten minutes, with the guest's
name, the amount and the Stripe payment id.
**Do:** if the guest is standing there, take the order at the counter the
old way. Do not key it as a card order. If Stripe's dashboard shows the
charge, refund it there and tell the guest it takes a few days to show;
Stripe's notice brings that refund back to Jelly on its own. Never make
food on an unknown attempt; the guest's page says we are confirming
payment.
**Say:** "The card didn't finish on our side. Take it at the counter. If
their bank shows a charge, it comes back to them."

## Case 5. A refund from the owner's phone

**They see:** a guest who wants their money back, in person or by phone.
**We see:** the refund line under the order on Today, with the amount,
the time, the reason and where it stands: to the card, pending at Stripe,
not confirmed, failed. Today also carries Refunds given and Net under the
day's totals, and Payments lists the refunds that need a person.
**Do:** on Today, a paid order has Refund. Amount (whole by default, or
part), a reason, and the owner's PIN typed again; five wrong PINs lock it
for ten minutes. A card order is refunded through Stripe to the same card
on the restaurant's own account, and the studio's share of the order fee
is refunded in proportion. The refund is on the order before Stripe is
asked, so two phones cannot refund more than the order and a lost answer
cannot double it. If the line reads "not confirmed", tap Finish on the
order: it asks Stripe for the same refund again. Never refund it on the
Stripe dashboard as well. A cancelled card order keeps its Refund and is
flagged until the money is back; cancelling never refunds by itself. A
counter order was not collected through Jelly, so it has no Refund until
the Stage 2 drawer: hand back the cash. Cancel sits beside Refund while
an order is placed or accepted; it goes through the kitchen board's own
operation, so the board and the guest's page agree.
**Say:** "Refund's in. A card takes a few days to show on their
statement."

## What to log

Every order action is a kitchen operation with an id, who did it and the
state before and after, kept with the order. Refunds live on the order.
There is no separate audit log or support note yet; a quarterly visit
reads Today and Reports. An ops console with a per-tenant support note is
Stage 4.
