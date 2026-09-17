# Menu save protection — 1.0.0

Copper and Mike's Place now reject a save based on an older menu and retain the owner's draft. Every accepted edit records its before/after content in the same PostgreSQL statement. The owner sees the ten most recent save times. These are review-branch changes; live installations have not been verified.

## Client-owned pieces

- `content-cas@1.0.0`: compares the saved JSON snapshot before writing and adds the audit record atomically. It also supports a disposable development memory store.
- `menu-write@1.0.0`: requires the current revision, every known item, and typed price/description/visibility fields. Unknown and missing items fail validation. Each client keeps its own price rules. Existing long built-in descriptions are preserved rather than silently truncated.
- `owner-save@1.0.0`: the previously released browser response helper remains unchanged. The editor freezes submitted fields, validates returned menu/history metadata, and retains drafts after rejected or uncertain saves.

The revision is a hash of saved overrides and the current built-in menu, not a monotonically increasing number. Identical restored content can produce the same revision. Every writer of `menu-overrides` must use the atomic comparison path; a raw `setValue` writer would bypass that protection.

## Integration

Publish the menu route, content loader, store, and editor together. Editors opened on an older release without a revision will be rejected; keep any typing before opening a fresh editor. `Check latest menu` opens a second tab for comparison. Draft recovery across reloads is not implemented.

Schema initialization adds `workroom_content_history` with key, actor, timestamp, and full before/after JSON. The existing content record shape is unchanged. The application database role must be allowed to create and write the history table. No audit failure may leave a menu mutation committed. History timestamps come from the application clock. `owner` identifies a role, not a named person; no separate user identity or restore-history control is provided.

Mike's workroom storage now refuses memory writes in production, propagates initialization failures, and chooses an explicit or unambiguous database URL. It no longer disables certificate verification in pool options. Verify its intended hosted database and TLS configuration before deployment. Its older owner sign-in and login limiter remain separate work.

Menu edits affect the website menu. They do not update Toast or another ordering menu. Copper continues to direct public ordering to Toast.

## Verification

- Shared validator tests cover missing/old revisions, incomplete/unknown item sets, invalid values, blank-price restoration, and a 436-character built-in description.
- PGlite 0.5.8 tests execute PostgreSQL statements for first/subsequent competing writes, audit snapshots, stale rejection, and rollback when the audit insert fails. PGlite serializes its connection; this is not a hosted multi-connection concurrency certification.
- Actual local Next routes in both clients reject unauthorized reads, accept valid edits with an audit record, reject stale/missing revisions and incomplete menus, and retain the accepted saved state after rejection. Tests use isolated memory and fake credentials.
- A two-window browser check on Mike's actual local routes saved the first edit, rejected the stale second edit, retained its typing, and confirmed the first price after reload. Recent history rendered successfully.
- Final TypeScript production builds and targeted lint passed for both clients. The dashboard's 36 tests and isolated production build also passed.

Before treating either installation as operational, repeat permission, concurrent save, restart persistence, public-page refresh, and owner handover checks against its intended hosted database and site. Other owner controls do not yet share this complete contract.
