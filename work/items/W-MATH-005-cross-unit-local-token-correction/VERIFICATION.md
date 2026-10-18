# Verification — W-MATH-005
Status: R3 IMPLEMENTATION PLUS LINKED VISUAL-ONLY CORRECTION STAGED; FINAL CI RECHECK IN PROGRESS
## V-001 — PASS SOURCE ONLY
Three original IDs, answers and lesson blobs checked on main f4d3ab40a27808a3ecb56c379efbe16a3fe19be4. Arithmetic: 3−5=−2; −5+2=−3; 6−3=3; 2x·3x=6x²; 2x·4=8x; 1·3x=3x; 1·4=4; 1.41²=1.9881; 1.42²=2.0164.
## V-002 — USER APPROVAL CONFIRMED
Exact direct user message 2026-10-18 JST: 「N12の公開とW-MATH-005/P-001を承認する」. W-MATH-005 implementation scope only, no merge/Pages.

## V-003 — ORIGINAL SCOPE STAGED / VALIDATION FOLLOW-UPS V-004–V-006
26 existing N12 stages and 42 original N01/N03/N09 IDs untouched; nine new local items, per-unit progress, figures, mobile/desktop E2E staged on isolated implementation branch. Browser passes are recorded in V-006; final full CI and user hands-on review still outstanding.

## V-004 — PASS / BASELINE-TO-BRANCH SOURCE INVARIANCE
Compared 42 old item IDs and exact answers against main 51c184286e5207b189dd7b412643e99c426bc884: all invariant (N01 15, N03 13, N09 14). Source maps and original figure paths/identifiers/reveal references match exactly. Nine additions alone expand stages to N01 18, N03 17, N09 16. Math values independently verified in unit tests. Existing figure binaries were not changed.
## V-005 — INITIAL CI FAILURE / RETEST ON TEST-ONLY TYPE NARROWING
Initial Math textbook CI 39100729652: normal Typecheck PASS, 167 Vitest tests across 16 files PASS, Build FAIL. Errors TS2345 in n01Lesson.test.ts and TS2339/TS7006 in r3LocalTokens.test.ts due to test-only union narrowing. Sequential fix commits 98a1dd358ae5a7cb137e18e60fce3e485447761a and e3d34e7517a98958619b0ceb58d630ac9baa0565; second full run 39100947795 completed with a later catalog assertion failure described in V-006. Governance check on first and second revisions passed. No claim of full PASS until workflow completes.
## V-006 — SECOND CI FAILURE / R3 E2E PASS, CATALOG COUNT TEST STALE
Workflow 39100947795: PASS Typecheck, 167 Vitest tests, Build, compiled SVG, N12 26-stage E2E, math textbook mobile and desktop smoke, N02/N09 original-image/browser gate, and newly added N01/N03/N09 R3 in-equation, wrong answer, old-v1 restored-progress tests on mobile and desktop. FAIL at existing e2e/numbers-catalog-publish.spec.ts:61 after topic numerator `1` persisted but denominator now correctly `37` following N09's two new choices; old assertion `1/35 完了` contradicted correct UI `1/37 完了`. Updated test to 37. Full rerun required before final PASS declaration. Neither the catalog application code nor old learner answers were changed for this failure.

## V-007 — W-MATH-006/P-001 SUPERCEDES ONLY LOCAL TOKEN PRESENTATION
W-MATH-006 exact proposal user response 「いいよ」 (2026-10-18 JST) authorizes aligning the nine new N01/N03/N09 in-formula buttons with established N02 [選択] thin square-corner rectangular appearance. Same implementation as N12 draft correction #83. Existing W-MATH-005/P-001 math, nine new answer IDs/values, three original problem IDs, original forty-two answers, migrations, figure gates are not changed. E2E now asserts label, 1px border, 0px radius, >=44px touch target alongside wrong/correct, progress and mobile width. Final CI for latest branch still pending. No main or Pages authorization.

## V-008 — CI FAILURE / SHARED N12 VISUAL EXPECTATION CORRECTED
Math textbook CI 39103142659 failed at N12 old Playwright /□|×/ expectations after W-MATH-006 changed the display to [選択]. The four failed mobile/desktop N12 tests were never teaching-content failures; logs confirmed the button rendered [選択]. Synced the correct W-MATH-006/N12 expectations and geometry checks into existing draft PR #80. Fresh full CI pending; Math practice CI 39103142669 and governance 39103142658 passed on prior revision.


## P-002 current verification state (supersedes the historical #80 branch status above)
Status: **PENDING current-main PR CI / user hands-on**. Old V-001–V-008 runs apply to historical P-001 base and do not qualify the newer P-002 as PASS.

### V-009 — PASS / source arithmetic and isolated revision design
Compared current main N01 and N03 source blobs to old P-001 source baseline; both identical. Independently computed N01 -2,-3,+3, N03 6x²,8x,3x,4, and retained all original 15+13 question IDs/answers, source map and figure references. Current N09 rev2 18 stages and N12 rev3 35 stages are explicitly exempt from the code/data migration.

### V-010 — PENDING / fresh CI and browser acceptance
New GitHub draft PR and main-head integration run must verify typecheck, N01/N03 formula/KaTeX tests, N09/N12 archived-progress regressions, 320/375/390px N03 width, wrong-answer gating, reload, desktop/mobile smoke, physics/math-practice regressions and governance. No PASS claim until run evidence is read. Separate learner hands-on QA and separate merge/Pages release remain pending.
