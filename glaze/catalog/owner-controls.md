# Owner controls comparison and common behavior

Source inspection: September 16, 2026. This is an implementation comparison, not a live-deployment certification.

| Control | Copper | Mike's Place | DeVine | True North |
|---|---|---|---|---|
| Working navigation | Events, Menu, external Taps | What's on, Menu | Orders, Dashboard, Payment recovery, Inventory, Weekly order, Quotes | Flavor feed is managed outside the inspected site |
| Hours | Site configuration; no workroom hours editor found | Site configuration; no workroom hours editor found | Site configuration; no common hours control established | Site/shop configuration and feed settings; no shared hours editor established |
| Prices and availability | Website menu overrides and hide switch; separate Toast ordering | Website menu overrides and hide switch; separate ordering menu | Inventory, plants and quote/order controls have florist-specific pricing | Flavor availability comes from validated shop feeds |
| Photos | Event flyer uploads in workroom image storage | Event flyer uploads in workroom image storage | No shared image editor verified in this pass | Feed/content mapping; no shared upload control verified |
| Incoming work | Event/contact inquiry workflow; Toast orders stay external | Event/contact controls; own ordering/kitchen implementation is separate | Dated florist orders, quotes and payment recovery | Public ordering remains disabled |
| Access | Signed owner session and persistent login limiter in review branch | Older credential-derived session and limiter still require hardening | Signed owner/staff roles; owner-only refund confirmation | Provider-owned feed access needs handover verification |
| Save behavior changed here | Menu draft retained, fields locked while saving, truthful uncertain feedback | Same client-owned owner-save 1.0.0 helper and interaction | Existing forms still need broader error/pending-state audit | Last-good feed behavior already implemented; no new owner form added |

## Common interaction rules

Use task labels owners recognize: Menu, Orders, Availability, Hours and Photos when those tasks are actually supported. Retain specialist tasks such as florist quotes or a separate tap board. Only one navigation item should represent the active page; `/workroom` matches itself, while deeper pages may match their own subtree.

Every editable control needs a visible label, field-level validation, a pending state, and a clear save result. Freeze the fields included in a pending write so a response cannot erase newer typing. A validation rejection, expired session, conflict, and uncertain connection result require different recovery instructions. Never clear the draft after an unconfirmed write. Let the owner compare the latest saved version in another tab.

The label must state the effect: “Off the site” currently hides a website menu item; it does not change Toast or the separate ordering menu. A shared menu/pricing source is needed before presenting one switch as controlling both. A database acknowledgement is not proof that every cached public page has updated.

## Remaining work, in order

1. Add atomic conflict detection and audit records to owner edits so two open devices cannot silently replace each other's work. Menu PUT currently replaces the override set.
2. Harden Mike's owner session/storage behavior using the proven Copper patterns before treating it as launch-ready.
3. Establish which clients should control hours, photos and order availability, then bind each field to its actual public/ordering source. Preserve Toast and florist-specific boundaries.
4. Apply the save contract to event/photo and florist controls after checking each response and authorization contract.
5. Test actual owner/staff permissions, durable persistence, public-site updates, uploads and fulfillment on each intended deployment, followed by an owner handover.
