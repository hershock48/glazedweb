# What to ask before building

**This file exists because every build stalls on the same thing, and it is never
code.** It is one fact only the owner has, discovered at the moment it blocks
something, usually with the client on the road and not answering.

Real examples, all from one working day in August 2026:

- A reserve page quoted a single average bird weight because nobody had asked how
  the birds are actually sorted. The answer, when it came, was that broilers run
  2.5 to 4 lb and roasters 4 and up, sorted after processing. The page had been
  publishing an estimate that was wrong on nearly every order.
- A pre-order page said "spring and summer" while the farm was selling a round for
  October pickup, because nobody had asked when the round was.
- A stack of printed business cards carried a QR code and nobody knew what URL it
  contained, which is the single fact that decides between a one-line redirect and
  a reprint.
- A credentials strip on a licensed cannabis facility's site sat empty for two
  rounds of work because it needs a licence class and a canopy figure that only
  the operator has.

None of those were hard questions. All of them were asked late.

**Ask the whole list at the start, in one message, and tell them a blank is fine.**
A client who answers eight of twelve has still unblocked eight things.

---

## Every business

1. **What is the one thing you want a visitor to do?** Call, order, book, walk in,
   fill in a form. One answer, not four.
2. **What do people ask you on the phone that the site should answer?** This is
   the fastest route to the real content, and it is usually hours, location,
   parking, price and whether you do the thing.
3. **Who answers the email?** A named human and an inbox they actually read. Not a
   forwarding address nobody opens.
4. **Hours, including the seasonal exceptions and the one day that is different.**
5. **What is the correct legal name, and what do customers call you?** These
   differ more often than not, and both need to appear.
6. **Founding year, and is it the year you want on the site?** Verify it rather
   than inferring: one build published a founding year taken from a redesign date,
   while the client's own social avatar said something else.
7. **Do you have the logo as a file, and who made it?** A vector if it exists. If
   the only copy is a JPEG, say so now, because that changes the build.
8. **Which photos may we use, and are any of them somebody else's?** Get this in
   writing. Permission on file for photos and logos is recorded per client.
9. **Anything on the current site that is wrong or out of date?** Owners usually
   know and rarely volunteer it.
10. **Is there anything you do *not* want changed?** The answer is often the
    brand, and finding that out after a redesign is expensive.

## If they take money on the site

11. **What exactly is being paid for, and is it a deposit or the whole thing?**
12. **What is the price, and is it per unit, per pound, per hour, or quoted?** If
    it varies, ask for the **range**, not the average. A single number becomes a
    quote the business gets held to.
13. **Which processor do you already use?** Square and Stripe are both fine.
    Whichever they have is the right answer, because it is the one they can
    reconcile.
14. **Who needs to know an order came in, and how?** Email, text, or the
    processor's own notification. Then confirm that whatever the site sends
    contains enough to fulfil the order: what was bought, how many, and a phone
    number.
15. **What happens after they pay?** Pickup, delivery, a call, a confirmation.
    If it is pickup, when, and is that date fixed?

## If they take bookings

16. **What is actually being booked, and how long does it take?**
17. **Who is available, and when?** Real opening hours, real breaks, real days off.
18. **What has to be true before a booking is worth taking?** Deposit, minimum
    party size, notice period, a form filled in first.
19. **What happens when two people want the same slot?** A hand-written slot list
    cannot know what is already booked. Say that plainly and leave a named seam
    for a calendar feed rather than implying availability is solved.

## If they sell physical goods

20. **What are the sizes, weights or variants, in the terms the customer sees?**
21. **Do they vary, and by how much?** Ranges, again.
22. **Shipping, pickup, or both, and who packs it?**
23. **How many can you actually make?** A store that oversells is worse than no
    store.

## If there is printed material in the world

24. **What is printed right now, and how much of it is left?** Cards, flyers,
    menus, vehicle wraps, signage.
25. **What URL or QR code is on it?** Then **scan the code and read the URL out
    loud**, because what the owner believes is printed and what is printed are
    two different facts. This single answer decides whether existing stock can be
    saved with a redirect or has to be reprinted.
26. **Who has the login for whatever generated the QR code?** A dynamic short link
    can be re-pointed and the stock is saved outright. A static code cannot.

## Before launch day

27. **Who owns the domain, and where is it registered?** Login, not just the name.
28. **What is currently at that domain, and who can change the DNS?**
29. **Is there anything we must not break?** An old email setup on the same
    domain is the usual one, and it is the one that takes a business offline.

---

## What to do with the answers

**Write them into the client's file in `glaze/clients/` the moment they arrive**,
in the client's own words where the wording matters. That is what makes the next
session cheap.

**A fact nobody has confirmed is `PLACEHOLDER` in the code, on the README
checklist, and said out loud at handover.** Silence about a placeholder reads as
"this number is real." A site once served invented prices to real customers
because a placeholder was left in a constant and nobody said so.

**Never invent a credential.** Licence numbers, certifications, member
associations, years in business, award names. If the client has not supplied it,
the strip stays empty and the gap is named.
