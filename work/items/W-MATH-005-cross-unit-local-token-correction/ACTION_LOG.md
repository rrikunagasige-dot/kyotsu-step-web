# Action Log — W-MATH-005
## A-001 — Linked correction proposal drafted (2026-10-18 JST)
N12 P-002 second-pass approved-creation source audit found R3 in N01 Q07, N03 Q10, N09 Q08. Drafted distinct P-001 for nine local answer holes. No sibling learner code modified; awaiting exact approval.

## A-002 — Exact P-001 approved, separate N12 release completed
User message 2026-10-18 JST: 「N12の公開とW-MATH-005/P-001を承認する」. PR #78 was merged to main at 51c184286e5207b189dd7b412643e99c426bc884 after green final CI. W-MATH-005 P-001 authorizes 3+4+2=9 local slots in N01/N03/N09, targeted progress conversion and QA. Does not authorize W-MATH-005 merge/Pages.
## A-003 — Isolated implementation branch started from released N12 baseline
Created work/W-MATH-005-R3-local-token-implementation-20261018 at main 51c184286e5207b189dd7b412643e99c426bc884, preserving original lesson/image/mapping IDs and unrelated modes. Source/test changes to be committed and CI tested before review.

## A-004 — Nine scoped slots implemented in independent draft PR #80
At base N12 main 51c184286e5207b189dd7b412643e99c426bc884, authored n01-r3-* (3), n03-r3-* (4), n09-r3-* (2) with in-math local □ choices; original full-expression questions remain. Added revision-1-to-2 safe conversion only for approved unit allowlist, migration learner note, math/schema/domain/desktop/mobile E2E tests. Opened draft PR #80 (https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/80) on isolated branch; no main merge or Pages release.
## A-005 — First CI failure disclosed and corrected, not ignored
Math textbook CI run 39100729652 on commit a508e0a1cdbf1781d2da0cf3b020936125569330 passed initial typecheck and all 167 Vitest tests, but failed the build step because TypeScript in two NEW test files did not narrow union types. Fixed the source-ID list to string[] and narrowed formula block/preceding math part in sequential commits 98a1dd358ae5a7cb137e18e60fce3e485447761a and e3d34e7517a98958619b0ceb58d630ac9baa0565. Re-ran full CI; no learner math answer changed.
## A-006 — Second CI surfaced stale catalog aggregate assertion
Full textbook CI run 39100947795 passed Typecheck, 167 Vitest tests, Build, N12 E2E, original math mobile/desktop smoke, N02/N09 figure gate, and **N01/N03/N09 new R3 holes E2E** on mobile/desktop. It then failed only the chapter catalog progress assertion in `e2e/numbers-catalog-publish.spec.ts`: old `1/35 完了` hardcode must become `1/37 完了` because N09 gained two real answer stages. Corrected the test expectation; learner catalog shows the correct 37-stage count. Remaining later workflow steps had succeeded except skipped actions due to this assertion; rerun required.

## A-007 — Approved W-MATH-006/P-001 linked design-only correction (2026-10-18 JST)
After user reported N12 token □ mismatched original N02 [選択] look, W-MATH-006/P-001 explicitly identified this same visual defect for the nine unmerged W-MATH-005 R3 holes. User answered 「いいよ」 to the exact W-MATH-006/P-001 scope. In the existing draft PR #80, switched only local token label and shared token CSS to thin 1px square-corner [選択] rectangle with minimum 44px hit height; added E2E geometry assertions. No new holes, math, answer IDs, progress mapping, source figures or main/Pages publication. N12 correction tracked separately in draft PR #83.

## A-008 — W-MATH-006 label regression exposed in shared N12 E2E (2026-10-18 JST)
CI textbook run 39103142659 failed four N12 mobile/desktop test cases because the old N12 e2e/n12-derivation.spec.ts still expected □/× after the approved UI changed to 選択/×. Browser showed the correct new [選択] label, and the error was a stale test assertion, not a wrong math answer. Copied the independently updated N12 E2E checks from W-MATH-006 draft #83, including 1px rectangular geometry, >=44px touch target and correct math/progress/figure behavior. Kept all learner source unchanged and reran full CI.


## A-009 — P-002 explicitly approved / stale PR conflict isolated (2026-10-18 JST)
User's direct 「いいよ」 approved the previously presented revised W-MATH-005/P-002 (N01/N03 seven holes only, tests, not main/Pages). Verified live main `154a16ff379321016f4692bb0ac6fe9a8a596214`; old draft #80 conflicts with accepted N09/N12. Created a fresh exact-main branch `work/W-MATH-005-P002-n01-n03-20261018`. Historical P-001 remains preserved.

## A-010 — N01-Q07 §52 preflight and staged change
Read MASTER_APP_LESSONS §7–12/20/51–53, accepted N01 source, N01-Q06 grouping and Q08 downstream degree. Independently recomputed `3−5=-2`, `−5+2=-3`, `6−3=3`; mapped three unique `n01-r3-q07-*` choices before the unchanged original `n01-07`, no other N01 problems modified. Unit becomes rev2/18 stages; original fifteen IDs/answers remain unchanged.

## A-011 — N03-Q10 independent §52 preflight and staged change
Repeated the same relevant preflight for the distinct four-product grid problem. Verified four products `2x·3x=6x²`, `2x·4=8x`, `1·3x=3x`, `1·4=4`; placed unique progressive `n03-r3-q10-p*` tokens after original N03-F01 figure and Q09 setup, before unchanged Q10 summary/Q11 collection. Unit rev2/17 stages; original thirteen IDs/answers and figure untouched.

## A-012 — narrowly adapted current shared behavior and safety tests
Extended only current local-token ID-prefix recognition and N01/N03 rev1→rev2 answer-history projection; kept existing N09 rev2 and N12 rev3 archive/reset routines intact. Added focused source/math/KaTeX tests, wrong-answer/progress and reload tests, mobile/desktop browser gating and N03 320/375/390px viewport checks. Enabled CI entrypoints. These are staged changes; final checks and learner review have not yet passed.


## A-013 — Initial current-main CI failures explicitly retained
PR #92 head `925baf02b1d96ca554208cbcf47ec88102dc04bf`: Math textbook CI 39136348368 Typecheck PASS and 176/177 Vitest tests PASS, but one stale sibling count in `n02ZeroTerm.test.ts` expected N01 15/N03 13 even though P-002 intentionally moves them to 18/17. Repository governance CI 39136348404 FAIL because WORK.md Status was bold-decorated instead of exact standalone enum required by `tools/repo-governance-check.mjs`. Corrected only N02 test expectations and Work status format. No N02 learner content changed; fresh CI required.


## A-014 — Compiled-app mobile smoke fixture updated after 3 gating failures
Second textbook CI 39136503642 passed typecheck, all Vitest tests, build, image smoke and N12 regression, then failed the original N01/N03 full-content Playwright smoke three tests: those old sequences attempted original Q07/Q10 before completing the newly inserted seven dependent stages. Added the 3 N01 and 4 N03 IDs/answers in the existing full-solve fixtures, preserving all earlier and later checks. No learner answer/content change; separate fresh CI run required.


## A-015 — Final complete CI PASS at code commit 6144f103
Full third textbook CI [39136923029](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39136923029) completed SUCCESS after 177 tests, typecheck, build, full mobile and desktop math textbook smoke, N12 rev3 checks, N02/N09 original figure/catalog, N01/N03 P-002 old-v1/wrong-answer/reload and N03 320/375/390px, Physics textbook and Math practice regressions. Repository governance [39136923007](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39136923007) SUCCESS. All earlier CI failures retained in A-013/A-014. Draft [PR #92](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/92) remains UNMERGED; no Pages deploy or learner hands-on acceptance authorized/claimed. MASTER_APP_LESSONS §51–53 already records the common R3 rule, so do not duplicate shared lessons while user acceptance is pending.
