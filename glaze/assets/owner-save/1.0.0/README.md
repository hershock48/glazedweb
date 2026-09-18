# Owner save feedback 1.0.0

Client-owned TypeScript helper for menu-editor writes. It sends one PUT with a 15-second timeout and returns saved, invalid, locked, conflict, or uncertain. It never retries automatically. A timeout or lost response can follow a committed write, so the draft must remain visible until the owner compares the saved state.

The caller must validate the entire success payload. `isMenuSaveState(value, Object.keys(draft))` checks the expected menu item keys as well as the response shape and explicit `ok: true` acknowledgement. A partial response cannot replace the local draft.

## Integration contract

- Disable the editable fieldset while saving; use an immediate ref guard to reject a second submission before React renders the busy state.
- Replace the draft only on a validated saved result. Retain it on all other results.
- Use an alert for errors, a status message for confirmed saves, and a separate-tab link to compare the latest menu or sign in again.
- Say when a save only lives in demo memory. Database acknowledgement still requires a public-site check; it does not verify a deployment.
- Keep each client's branding, menu data, navigation labels, authorization and storage policy.

This helper does not implement authorization, durable storage, server-side validation, audit trails or cross-window concurrency protection. A conflict message only helps if the server actually rejects conflicting writes. Copper and Mike's Place still require server-side concurrency protection. Prices in their website menu editor are separate from the ordering system; Copper's public ordering remains on Toast.

Run `node --test --test-isolation=none glaze/assets/owner-save/1.0.0/owner-save.test.mjs` from the studio repository. The integration was also built in both clients and exercised in disposable browser fixtures (pending field lock, uncertain response with retained price, acknowledged demo save). Real databases and live public-menu updates remain separate deployment checks.
