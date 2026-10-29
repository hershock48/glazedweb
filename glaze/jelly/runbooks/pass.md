# Runbook: the pass

**What this is.** Build outline step 1.12, version one. What to do when
something goes wrong where the tickets come out, written so someone other
than Kevin can walk every case on the demo tenant. Each case says what the
restaurant sees, what we see, what to do in the first two minutes, and
what to say. Keep it to a page per case. Update it in the commit that
changes the behavior.

## Before service

- The kitchen screen is signed in and the printer shows a green poll in
  the workroom's printer panel within the last minute.
- The owner's phone has the workroom open and the pause control reachable.
- Our side: the ops view shows the tenant's printer last-poll time and the
  order count for the day.

## Case 1. Paper out

**They see:** a ticket on the kitchen screen with no paper, the printer's
light blinking.
**We see:** the print job stays `leased`, never `confirmed`; after two
minutes the workroom's printer panel shows "no paper confirmed".
**Do:** the kitchen works from the screen. Load paper. The queued jobs
print in order once the printer polls again; nothing is lost and nothing
prints twice (`printer-jobs 1.0.0` leases).
**Say:** "Paper's out. Screen has it. Load paper and the tickets catch up."

## Case 2. Printer offline, cloud up

**They see:** tickets on the screen, nothing on paper, the printer light
off or steady with no activity.
**We see:** last poll older than two minutes; jobs piling up `queued`.
**Do:** check power and the network cable at the printer. If it comes
back, the queue drains. If not, the kitchen runs from the screen for the
rest of service and the owner is told the printer is down. A spare printer
from the shelf is a Stage 4 answer; in Stage 1 it is the screen.
**Say:** "Printer's not reaching us. Screen has every ticket. We'll keep
watching it."

## Case 3. Cloud down, restaurant up

**They see:** the kitchen screen shows "lost connection" in the chrome;
new online orders stop arriving; the printer stops.
**We see:** our own monitoring, and the owner's text.
**Do:** nothing prints anywhere until the cloud is back; CloudPRNT polls
the cloud by design and the hub does not exist until Stage 3. Orders placed
by guests during the outage are refused with a plain message and the phone
number, never silently queued, so no guest thinks an order exists that the
kitchen has not seen. Phone orders keep coming the old way. When the cloud
returns, the screen reconnects on its own and the printer resumes.
**Say:** "Our side is down. Online ordering is paused and says so to
guests. Phone's still phone. We'll tell you the moment it's back."

## Case 4. A card failed after the ticket printed

**They see:** a ticket at the pass for an order whose payment did not
finish, which can happen when the processor answers late.
**We see:** `payment_attempt` in `unknown` or `failed` with an order in
`placed`; the recovery screen lists it.
**Do:** the order is held, not made, until the attempt resolves. The owner
can mark it pay at counter from the workroom if the guest is standing
there, or cancel it with a reason. Never make food on an `unknown`
attempt; the guest is texted that we are confirming payment.
**Say:** "Card didn't clear. Hold the ticket. If they're here, take it at
the counter; the workroom has a button for that."

## Case 5. A refund from the owner's phone

**They see:** a guest who wants their money back, in person or by phone.
**We see:** the refund row with a reason and who did it.
**Do:** the workroom's order page has Refund behind the owner's PIN, with a
reason list. Whole or partial. Card refunds go back through Stripe to the
same card and take days on the guest's side; cash refunds in Stage 1 are
a drawer matter and are written as a note until Stage 2's drawer exists.
**Say:** "Refund's in. Card takes a few days to show on their statement."

## What to log

Every case is an `audit_event` with who, when and what, and a line in the
tenant's support note in the ops console, so a quarterly visit can read
what the pass went through.
