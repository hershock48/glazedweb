# Event, contact and photo controls — 1.0.0

Copper and Mike's Place now share client-owned event fields, atomic event writes, owner request feedback and photo processing. Each site retains its own design and public ordering choices. Copper customers continue to order through Toast.

## Resulting behavior

- Event/contact writes compare the current saved snapshot and record before/after history atomically. New event drafts retain one ID across retries; a lost acknowledgement cannot create a second event with the same ID.
- The editor freezes submitted fields during saves and photo uploads. Validation, access, conflict and uncertain results preserve the draft and link to the latest saved copy in another tab. A complete operation-specific acknowledgement is required before clearing it.
- Archive retains the event and photo while removing it from public listings. Restore returns it as an unpublished draft. Recent event history shows the last ten changes; arbitrary history rollback is not provided.
- Contact saves submit all three fields with a revision, preventing incomplete requests from clearing omitted values. A contact draft is not reset by an unrelated event save.
- The photo helper decodes real JPEG/PNG/WebP bytes, checks the declared format, caps input size/pixels and outputs a metadata-stripped JPEG within 1200px using Sharp 0.35.4. A SHA-256 ID identifies the normalized bytes. Existing photos remain available to other posts and historical snapshots.
- Michigan dates/times reject impossible dates and spring clock-change gaps. An optional end time must follow the start on the same date; overnight events need a future schema change.

## Source and dependencies

| Component | Source | Responsibility |
|---|---|---|
| event-cas 1.0.0 | ../assets/event-cas/1.0.0/event-cas.ts | PostgreSQL compare-and-set plus event audit |
| owner-request 1.0.0 | ../assets/owner-request/1.0.0/owner-request.ts | Single bounded POST/PUT/DELETE and acknowledgement handling |
| event-fields 1.0.0 | ../assets/event-fields/1.0.0/events-def.ts | Shared typed fields, validation and listing shape |
| event-photo 1.0.0 | ../assets/event-photo/1.0.0/event-photo.ts | Server-only Node/Sharp decoding and immutable image identity |

Registry and client manifests pin exact source commits and hashes. The pre-existing content-cas 1.0.0 supplies the audit schema, content hashes and contact comparison. owner-save 1.0.0 remains the immutable menu-specific helper. Applications must install Sharp 0.35.4 as a runtime dependency. The private test package is not an application dependency.

## Verification

Run `npm ci --prefix glaze/assets/event-controls-tests` then `npm test --prefix glaze/assets/event-controls-tests`: four standalone tests cover invalid/full fields and clock changes, SQL duplicate/stale writes and audit-failure rollback, request acknowledgements/errors/timeouts without retries, and real image decoding/normalization/deduplication.

Both client packages in `tools/workroom-tests` include eight event/contact/photo/request/SQL integration tests. Mike additionally has ten signed-session/login tests. All passed. Both client targeted lint and isolated production Webpack/TypeScript builds passed.

Actual production Next routes were exercised on local port 4334 with fake credentials and a persistent local PGlite adapter. Both clients passed unauthorized reads, accepted audited writes, concurrent/stale writes, duplicate creates, incomplete fields, photo decoding/deduplication, archive/restore, public visibility, retained image access and contact conflicts. PGlite serializes a local connection; it does not certify hosted multi-connection PostgreSQL, TLS or permissions.

Browser checks confirmed Mike's delayed photo upload disables editing/save/close while retaining the draft, failed saves retain typed text and photo description, retry creates one draft, and archive/restore returns it unpublished. Copper's failed-save browser check retained its typed details. Fixture tabs and servers were closed. No production customer records were changed.

## Rollout and remaining limits

Deploy each client's editor, API, store, content loader and shared files together. Existing event/contact records remain readable; the existing schema gains no destructive migration. Old open editors without revisions are rejected and must open a fresh tab. Production memory writes remain refused.

Before rollout, verify the intended PostgreSQL schema permissions/TLS, simultaneous writes from real connections, restart persistence, public cache refresh, uploaded images and owner device/handover. No live deployment is certified here.

The event list/history reads are separate snapshots, not a single consistent transaction. Change hashes are not monotonic versions, and audit actors identify an owner role rather than a named person. Unsaved browser drafts do not survive navigation/reload. Uploaded and historical images are retained; storage quotas and safe orphan cleanup remain future work. This release does not add hours controls, change Toast, certify kitchen/payment workflows, or complete the broader owner-control program.
