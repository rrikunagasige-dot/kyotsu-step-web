# Verification — W-GOV-008

Status: PENDING CI AND HOSTED PILOT. USER-REVIEW-NOT-READY.

## V-001 — target identity
Date: 2026-10-19 JST
Check: owner/repo ID and authoritative branch/live HEAD.
Result: PASS — rrikunagasige-dot/kyotsu-step-web, ID 1391122224, main 154a16ff379321016f4692bb0ac6fe9a8a596214.

## V-002 — approval and isolation
Date: 2026-10-19 JST
Check: exact P-001 approved, feature branch separate, no Constitution/main/Pages deployment mutation.
Result: PASS for approval and branch creation. Commit diff must be checked after publishing branch.

## V-003 — policy static contract
Date: 2026-10-19 JST
Check: Work OS §12A, instruction handoffs, master/memory lesson and template forbid PR-only acceptance, preserve independent release gate.
Result: PREPARED; verify exact committed files and governance CI.

## V-004 — code typecheck/preview build
Check: Vite base override, review route guarded by VITE_REVIEW_PREVIEW, no persistent store writes.
Result: NOT RUN until draft PR CI.

## V-005 — PR92-derived real pilot
Check: N01 Q07 4 decisions / N03 Q10 5 decisions, seven new calculations, original figure, wrong/correct, reload, 320/390/desktop and no persistent progress.
Result: NOT RUN. Main-derived governance branch deliberately does not contain the seven unmerged PR92 additions. e2e/review-preview-gate.spec.ts is for downstream pilot.

## V-006 — link and SHA truth
Check: open both hosted deep links with exact PR head/revision and no user setup.
Result: BLOCKED — no hosting provider/publication approved; no URLs exist.

## V-007 — human acceptance / release
Check: user PASS or 要修正 for the actual app, independent main merge/Pages.
Result: PENDING. Do not present technical CI as user PASS.
