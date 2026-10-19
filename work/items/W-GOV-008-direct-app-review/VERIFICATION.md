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
Result: INITIAL FAIL — run 39190305363 enforced obsolete review-link markers; update validator and rerun. Do not hide failure.

## V-004 — code typecheck/preview build
Check: Vite base override, review route guarded by VITE_REVIEW_PREVIEW, no persistent store writes.
Result: PASS for preview typecheck/build on PR #93 CI run 39190305343. Ordinary Math textbook CI was still running at this checkpoint.

## V-005 — PR92-derived real pilot
Check: N01 Q07 4 decisions / N03 Q10 5 decisions, seven new calculations, original figure, wrong/correct, reload, 320/390/desktop and no persistent progress.
Result: RUNNING on separate PR #94 (head 6fa112a4c3f8728f0fbf62fe7f0a847d1d1765b6, based on PR #92 original cb726d843263c645bfa08891cc5cef7375a82f8d). Main-derived PR #93 intentionally lacks the seven unpublished additions.

## V-006 — link and SHA truth
Check: open both hosted deep links with exact PR head/revision and no user setup.
Result: BLOCKED — no hosting provider/publication approved; no URLs exist.

## V-007 — human acceptance / release
Check: user PASS or 要修正 for the actual app, independent main merge/Pages.
Result: PENDING. Do not present technical CI as user PASS.
