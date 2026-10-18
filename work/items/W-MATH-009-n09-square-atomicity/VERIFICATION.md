# Verification — W-MATH-009
Status: VERIFIED-AND-USER-ACCEPTED

## V-001
Date: 2026-10-18
Target: N09-Q08 source code
Check: Existing row uses one C('n09-08') and no previous square/comparison sub-choice.
Expected: Evidence supports proposal, not an implementation pass.
Result: CONFIRMED-SOURCE-ONLY
Evidence: main N09 lesson SHA 07b8523e7b64b5c72d525fa0805d4e211cfb3e00.
Follow-up: No implementation until P-001 approval.

## V-002
Date: 2026-10-18
Target: N09 revision 2, migration, views and all other lessons
Check: Unit test integrity, correct/wrong gated browser choices, reload, 320/375/390px no overflow/KaTeX error; no N02/N12 modification.
Expected: PASS
Result: PENDING-CI
Evidence: src/data/textbook/math/numbers/n09Atomicity.test.ts; numbersNextBatch.test.ts; e2e/math-textbook-set-smoke.spec.ts.
Follow-up: Inspect PR CI and user review before main merge/publication.

## V-003
Date: 2026-10-18
Target: PR #89 review branch and main release
Check: Full math CI, repository governance and GitHub Pages deployment.
Expected: PASS before declaring a live release.
Result: PASS (AUTOMATED + DEPLOY, NOT USER HANDS-ON)
Evidence: math CI #39117627867; governance #39117628023; merge commit 9cdc86b2f5b76e8c6363bcdd6dd434e385a013c5; Pages #39119290710.
Follow-up: User checks published N09 Q08 derivation holes, mobile display, and progress reset. Do not claim pedagogical DONE until user QA.

## V-004
Date: 2026-10-18
Target: Published N09 release and lesson-memory close
Check: Final Pages PASS; direct response to explicit N02/N09 published-app acceptance request; shared lesson deduplication.
Expected: Release and user acceptance before returning to creation.
Result: PASS (automated deployment + user-reported acceptance). Actual hands-on navigation is not independently observable.
Evidence: Pages #39119290710; user 「いいよ」 following N02/N09 app links, 2026-10-18; PR #91 shared memory §§52–53.
