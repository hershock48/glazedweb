# Owner sign-in verification

The shared `workroom-session@1.0.0` source is copied into DeVine, Copper and Mike's Place. Each client owns the wrapper that selects roles, namespaces the signing key, configures cookies, and limits login attempts. Sharing the token primitive does not certify another client's authentication setup.

## Mike's Place, September 16, 2026

- The server checks the signed owner's token and its 18-hour expiry. Legacy credential-derived hash cookies and raw passcodes are rejected. App-specific key derivation prevents reuse of a Copper token. Staff tokens do not open this owner workroom.
- A production passcode and separate signing secret of at least 32 characters are required. Mike's wrapper rejects using the same value for both. Rotating either invalidates existing tokens. Logout expires the browser cookie; copied tokens remain valid until expiry or credential rotation.
- Cookies are HttpOnly, SameSite=Strict, Secure in production, and scoped to the site root. The kitchen has a separate staff session; its subsequent September 17 integration is documented in [kitchen access verification](kitchen-access-release.md).
- PostgreSQL reserves each login attempt atomically. Five attempts are allowed per ten-minute account window across application instances; a successful login clears the count. No caller-supplied IP header can create another bucket. This means repeated bad attempts can temporarily prevent legitimate sign-in, while existing signed sessions continue to work.
- Missing or failed persistent login storage returns 503 without issuing a cookie. Memory counters support development only. Status reports session configuration and storage type without exposing credentials.

## Evidence and limits

Ten client tests execute the actual TypeScript wrappers and routes with isolated framework dependencies, plus PostgreSQL statements in PGlite 0.5.8. Coverage includes legacy/forged/cross-app/staff tokens, expiry, passcode/key rotation, cookie flags, unavailable configuration/storage, malformed login input, throttling, reset, independent module instances, production memory refusal, and the existing generated ordering-menu source. Run `npm ci --prefix tools/workroom-tests` followed by `npm test --prefix tools/workroom-tests` in Mike's repository after installing its development dependencies.

The production Webpack/TypeScript build and targeted lint pass. Actual production HTTP routes were exercised against a local PGlite storage adapter: secure cookie headers, old-cookie rejection, audited menu write, five-attempt throttle, and logout. The process was stopped and restarted against the same local fixture directory. Signed access, saved menu content, audit records, and throttling persisted. A browser on that production build showed a wrong-passcode error and then opened the menu after correct sign-in.

These checks do not exercise the hosted `pg` pool, provider database/TLS configuration, cross-process multi-connection contention, or the owner's device. Before deploying, set the separate signing secret privately, confirm the intended database/schema permissions, and repeat login, rotation, logout, concurrent saves, restart persistence and owner handover on the intended installation. Existing owner browsers will need to sign in again when the new cookie format is deployed. Do not record a live version in the ledger until those checks are evidenced.
