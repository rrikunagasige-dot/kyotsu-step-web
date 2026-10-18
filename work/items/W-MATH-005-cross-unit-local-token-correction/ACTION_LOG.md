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
