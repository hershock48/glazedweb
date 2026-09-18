# September 17 review corrections

This release answers H1 through H7 and M8 in the private cross-agent review. It is ready for review when the four branches below carry these files; production rollout is separate.

| Finding | Correction | Evidence |
|---|---|---|
| H1 | Normalize older imported operations; reconcile explicit delivery evidence. Paid build, delivery and monthly billing remain independent. | Authority projection regression; private fact plan and full before/after comparison. |
| H2 | Import nested legacy price.build/monthly; restore the preserved proposed quote without inferring agreement or receipt. | Dashboard review-facts test; private reconciliation. |
| H3 | Reconcile stale snapshots against the pinned registry on main. Add an explicit comparison and guarded fact-plan tool. | Named corrections are private; other accounts remain unchanged. |
| H4 | Ledger, research and selector commands use the dashboard's local lock/revision writer. Research uses the signed-in session and never calls a model API. | Actual PowerShell CLI fixture plus concurrent writer/source-retention tests. |
| H5 | Staff explicitly retry a confirmed decline with another card or cash. The exact failed reference is archived transactionally; one new generation wins. Remove the obsolete owner release action. | Payment repository SQL, concurrent/stale-generation and actual component controls tests. |
| H6 | Known failures before CreatePayment settle as NOT_SUBMITTED. Unknown payment responses still require reconciliation. Compare saved gateway fields independently of jsonb key order. | Invalid price/token/fee, order race, changed connection, CreateOrder errors, mismatched totals and CreatePayment timeout cases. |
| H7 | DeVine and Copper throttle each trusted address durably. Copper owner and kitchen use separate address buckets. | Cross-instance SQL reservations, address isolation, proxy-header validation, expiry and production failure checks. |
| M8 | Restore full-pipeline automation and subscription runtime rules; document the real data path and executable session commands. Disable the retired closing-model API mode. | Ledger spec, glaze front door, CLI headers and session fixture. |

Related corrections include quiet-time calculations that ignore edits/notes, advanced-stage projection and un-parking, explicit fixture overrides, checkout failure recovery copy, and a clean 503 when successful DeVine sign-in cannot clear its limit or issue a cookie.

Run dashboard tests with node --test --test-isolation=none tests/*.test.mjs. Run the public authority test and glaze/scripts/tests/session-write.ps1. DeVine's tools/payment-tests has a pinned private test dependency; run npm ci --ignore-scripts --prefix tools/payment-tests, then node --test --test-isolation=none tests/*.test.cjs tools/payment-tests/*.test.cjs. Copper runs lib/__tests__/launch-readiness.cjs and tools/workroom-tests/*.test.cjs with the same Node flags.

Deploy matching DeVine payment route and UI files together; older forms must refresh. Vercel supplies the overwritten trusted address header. Other hosts require an overwriting trusted proxy and WORKROOM_TRUSTED_IP_HEADER, with direct access blocked. Existing unknown attempts stay unknown because their earlier provider contact cannot be disproved by this release. PGlite uses a serialized local connection, not independent hosted PostgreSQL connections. Square sandbox, actual proxy/TLS, staff devices and owner handover remain rollout checks. Copper's public ordering remains Toast.

No live deployment, payment, refund, customer message or scheduled provider action was performed. Immutable shared component releases were not changed.

## R1-R6 re-review follow-up

Verdicts are recorded per item in handoff.md. R1/R2/R3/R4/R6 are CONCEDE; R5 is PARTIAL on diagnosis, with both reproducibility defects fixed. Copper selected another client's seed when a scratch checkout had a different folder name. No missing production seed module needs to be committed.

- R1: restore LF in the named DeVine files and add .gitattributes. Additive history preserves published release pins.
- R2: authenticated-owner evidence, exact generation check, five-minute activity guard, latest provider reconciliation and one transactional audit/failure update. Empty provider search alone never releases a payment; staff cannot invoke the action. Repeat saves cannot release a replacement generation. Known provider payments remain fenced. The review page shows the original reference/location/amount and distinguishes online retry instructions.
- R3: glazedweb-studio-session version 1 handshake before invoking the adapter. Optional marker adapter path supports OS-temp fixtures. Merge the admin PR first, then the public reader PR.
- R4: missing trusted address has its own 503 reason in DeVine, Copper owner and Copper kitchen. Both environment examples and READMEs name Vercel's Automatically expose System Environment Variables setting and required redeployment. Storage failures retain their separate message.
- R5: Copper tests no longer infer their client from a directory name. Session fixture stores every temporary data file under one OS-temp directory and removes PowerShell-7-only AsHashtable. Installed PowerShell 7 runs both real CLI fixtures; PowerShell 5.1 parsing passes, but its script policy blocks runtime file execution. No policy change was made.
- R6/H3: digest/show/close compare current GitHub main, display REGISTRY DIFFERS with both values, record source blob/time, report unavailable checks and withhold uncertain closing drafts. Downloaded code is parsed, never executed. Prices and newer receipts remain unchanged. The original Not the registry / Not a CRM wording is restored with the existing owner-requested dashboard scope documented pending Kevin's doctrine ruling.

Local verification: 50 DeVine tests; 86 Copper integration plus nine launch checks; 53 dashboard tests in the working tree; 11 public reader/adapter tests; actual session and registry CLI fixtures. Both client production builds and targeted Copper route lint pass. The owner recovery save also ran through the actual production Next server in a browser against isolated PGlite, with one audit receipt, no provider call, no console errors and no 320px overflow. Clean published-tree results are recorded in the PR handoff after publication. The real private ledger SHA-256 remains abbe4b41e0c0adfff30f601529f92014dc57f645ec851e6db8867e51f0e3d6d8.

The Documents backlog is now a retirement pointer; glaze/backlog.md is the only active list. Cross-review takes place on the GitHub pull requests. These corrections do not claim unrelated M2/R7 findings or hosted rollout checks are complete.

Fresh committed-tree verification also passes: admin 46, public reader/adapter 11, DeVine 50, Copper 95 (202 total), both actual CLI fixtures and both client production Webpack/TypeScript builds. The admin count excludes the separate economics branch, which has 53 tests. Copper's archive was tested under a renamed directory. Dependencies were linked from installed packages; all tested source came from the published archives. See handoff.md and the PR comments for immutable code commits.
