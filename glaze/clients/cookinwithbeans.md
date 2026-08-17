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

## Open

Confirm the menu, the catering minimum and who answers bookings. See
`../intake.md`.
