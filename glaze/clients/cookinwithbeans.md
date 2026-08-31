# Cookin' with Beans

**Repo** `cookinwithbeans`

## What they are

Mini street taco food truck in Marshall, Michigan. Facebook only before this, no
website at all. Kevin knows the owners personally.

## Decisions on file

**Three priorities, in the client's order:** a where-is-the-truck schedule,
catering and event bookings, and online ordering from their menu.

**Match the truck wrap.** Turquoise body, red-orange sugar skulls, lime green
sunburst and zigzag accents. Same keep-their-brand play as Super Duper and
Copper AC.

A truck schedule is a date-dependent page, so read the caching note in
`../launch.md`: content that depends on the current date cannot be statically
generated or revalidated on a timer.

**The window is Square's, not ours.** Kevin's call, Aug 31 2026. The pitch
recommends switching Toast for Square at the window, Glazed Web makes nothing
on it, and setup plus loading the menu is on us. Online order-ahead stays
ours: the guest pays a 99 cent fee per online order and all of it is Glazed
Web's, taken as the Stripe application fee. The truck keeps the full food
price.

## Open

Confirm the menu, the catering minimum and who answers bookings. See
`../intake.md`.

## Retired

**The register piece.** Through Aug 30 2026 the pitch sold a $249 Stripe
reader plus a Glazed Web register screen replacing Toast at the window, on
founding Jelly terms (99 cent guest fee split 50/49 with the truck). Retired
because being the truck's till during a lunch rush is all liability and no
business: offline card-present was the one thing the pitch admitted Toast did
better, the Jelly stack has not yet run a real rush anywhere, and Square
delivers the same savings without us in the money path. The fee split went
with it; the reasoning is in the pitch's head comment and
`lib/ordering/config.ts` in the client repo.
