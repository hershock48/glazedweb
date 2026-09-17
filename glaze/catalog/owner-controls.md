# Owner controls comparison and common behavior

Source inspection: September 16, 2026. This is an implementation comparison, not a live-deployment certification.

| Control | Copper | Mike's Place | DeVine | True North |
|---|---|---|---|---|
| Working navigation | Events, Menu, external Taps | What's on, Menu | Orders, Dashboard, Payment recovery, Inventory, Weekly order, Quotes | Flavor feed is managed outside the inspected site |
| Hours | Site configuration; no workroom hours editor found | Site configuration; no workroom hours editor found | Site configuration; no common hours control established | Site/shop configuration and feed settings; no shared hours editor established |
| Prices and availability | Website menu overrides and hide switch; separate Toast ordering | Workroom overrides feed the website and generated ordering board; kitchen sold-out state remains separate | Inventory, plants and quote/order controls have florist-specific pricing | Flavor availability comes from validated shop feeds |
| Photos | Event flyer uploads in workroom image storage | Event flyer uploads in workroom image storage | No shared image editor verified in this pass | Feed/content mapping; no shared upload control verified |
| Incoming work | Event/contact inquiry workflow; Toast orders stay external | Event/contact controls; own ordering/kitchen implementation is separate | Dated florist orders, quotes and payment recovery | Public ordering remains disabled |
| Access | Signed owner session and persistent login limiter in review branch | Signed owner session, persistent account login limit, and production memory-write refusal in review branch | Signed owner/staff roles; owner-only refund confirmation | Provider-owned feed access needs handover verification |
| Save behavior changed here | Menu/event/contact drafts retained, pending fields locked, atomic conflict checks and history; recoverable event archive and validated photo uploads | Same menu/event/contact save behavior, conflict history, recoverable event archive and validated photo uploads | Existing forms still need broader error/pending-state audit | Last-good feed behavior already implemented; no new owner form added |

## Common interaction rules

Use task labels owners recognize: Menu, Orders, Availability, Hours and Photos when those tasks are actually supported. Retain specialist tasks such as florist quotes or a separate tap board. Only one navigation item should represent the active page; `/workroom` matches itself, while deeper pages may match their own subtree.

Every editable control needs a visible label, field-level validation, a pending state, and a clear save result. Freeze the fields included in a pending write so a response cannot erase newer typing. A validation rejection, expired session, conflict, and uncertain connection result require different recovery instructions. Never clear the draft after an unconfirmed write. Let the owner compare the latest saved version in another tab.

The label must state the effect. Copper's “Off the site” switch affects its website menu and does not update Toast. Mike's generated ordering board already reads the workroom-backed website menu through `lib/ordering/menu.ts` and `seed.ts`, with a ten-second process cache; its kitchen sold-out state is separate. The earlier comparison that called Mike's an independent ordering-menu copy was incorrect. A database acknowledgement does not prove every cached public page has updated.

## Remaining work, in order

1. Menu, event and contact edits now use the conflict/audit contract. Event/photo browser and production-route fixtures passed; see [event control verification](event-controls-release.md). Review remaining florist and other owner edits against their own storage contracts. Copper and Mike's menu PUT now compare the complete saved override snapshot atomically and record accepted changes in the same statement. Local route, SQL, and two-window browser checks are documented in [menu-save-release.md](menu-save-release.md). Hosted multi-connection persistence still needs verification.
2. Verify the deployed owner access and storage configurations. Mike's now has signed owner sessions and a persistent account-wide five-attempt/ten-minute login limit. Its local wrapper/SQL tests and production-build browser/restart fixture pass; see [owner sign-in verification](owner-sign-in.md). Hosted configuration and handover remain outstanding.
3. Establish which clients should control hours, photos and order availability, then bind each field to its actual public/ordering source. Preserve Toast and florist-specific boundaries.
4. Apply the save contract to florist controls after checking each response and authorization contract. Event/photo controls are implemented in Copper and Mike; image retention cleanup, quotas and draft recovery after reload remain open.
5. Test actual owner/staff permissions, durable persistence, public-site updates, uploads and fulfillment on each intended deployment, followed by an owner handover.
