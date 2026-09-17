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
