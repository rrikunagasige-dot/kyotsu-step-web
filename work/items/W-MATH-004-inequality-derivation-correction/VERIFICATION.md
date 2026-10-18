# W-MATH-004 — VERIFICATION
Status: IMPLEMENTATION STATIC CHECKS COMPLETE / CI, BROWSER AND ACCEPTANCE PENDING
Date: 2026-10-18 JST

## Recorded checks
- V-001 PASS: live target repo ID, `main` SHA and canonical governance/command loaded before writes.
- V-002 PASS: 54 source markers accounted for (N11=14, N12=15, N13=9, N14=16); original DOCX located at 212863 bytes and 53 pages; document pages 36–47 inspected in text extraction. Caveat: OMML equations may be omitted by extracted document text; original bytes SHA not rehashed in this Work. PR #73 independent audit supplied exact math.
- V-003 PASS: N12 source code is review-only and contains one answer stage per original 15 markers; confirmed compressed reasoning in Q01/Q02/Q06/Q12/Q13 by reading `readingFlow` and `item` definitions. No actual browser output was tested during assessment.
- V-004 PASS WITH LIMIT: N01/N02/N03/N09/N10 representative first/late flow screened, no blanket assertion of unaffected status; each remains UNVERIFIED for full no-defect review.
- V-005 PASS: PR #73 P-003 is draft and unapproved; no N11/N13/N14 implementation or merged app change is attributed to it.
- V-006 PASS: Proposed files are docs-only; no replacement of accepted source, stable response IDs, Word, assets or app files in this proposal.

## Pending after exact P-001 approval
- V-007 pending: N12 15 preserved original source IDs, 15 existing answer IDs and six supplemental reason stages (total 21); source and figure hash/gating QA.
- V-008 pending: mathematical derivation and detailed feedback correctness, no answer leakage, safe right/wrong behavior, no progress regression.
- V-009 pending: typecheck, focused math tests, math-textbook CI, desktop/mobile browser clickthrough, formula render and all 21 stage unlocking.
- V-010 pending: complete approved-creation sibling impact ledger with proof of nonaffected/confirmed, additional linked proposal gate where appropriate.
- V-011 pending: user actual hands-on acceptance, merged PR/Pages only under separate authorization, dedup lessons and Work DONE.

Assessment PASS is **not** app verification, user acceptance or release authorization.

## Implementation stage (remote CI still pending)
- V-007 PASS STATIC: 21 unique item IDs and 21 matching inline choice refs, original 15 IDs preserved, six new substep IDs, two headings, same 3 figure paths, F03 after final Q15, same status review and revision 1. Targeted Vitest authored but execution pending.
- V-008 PASS MATH REVIEW / CI PENDING: verified Q01/Q02/Q06/Q12/Q13 algebra, inequality direction and integer/cost boundaries x=11:3200, x=12:3250, x=13:3300. Choices contain unique plausible distractors; browser feedback remains pending.
- V-009 PENDING: PR Actions typecheck/lint/Vitest/build, math textbook CI, full 21-step desktop+mobile flow, KaTeX, wrong feedback, answered-state reveal, persistence and progress restore.
- V-010 PASS SOURCE WITH LIMIT: all approved N01/02/03/09/10 item and readingFlow source scanned; no same-signature R1/R2 confirmed; source blob and precise evidence in updated impact ledger. Browser/mobile/other errors UNVERIFIED.
- V-011 PENDING: user hands-on acceptance, separate main merge/Pages approval, successful deployment, shared-memory close and correction-queue recheck before P-003.

- V-012 FIRST RUN FAILED / REPAIR SUBMITTED: Repository Governance Check on PR #76 SHA 2219f52a9644a54167f522ee59acafc5da150d91 reported WORK.md missing Status; cause machine-readable label had explanatory suffix and Proposal also needed exact APPROVED line. Rewrote both standalone status labels, awaiting next run. Failure preserved as evidence.

- V-013 FIRST MATH CI FAILED, PRECISE CAUSE AND PATCH: 2026-10-18 workflow 39092607921 typecheck PASS; Vitest 145 PASS/3 FAIL in old N12 pilot/nextbatch assertions expecting 15 total item IDs/answers. This is the approved 15→21 change, not an algebra failure. Updated those tests to distinguish 15 original source IDs from 6 additional learning stages. Re-run full math CI and do not conceal initial failures.

- V-014 NEW AUTOMATION AUTHORED / EXECUTION PENDING: N12 all-21 Playwright flow in mobile/desktop Chromium, explicit wrong sign branch, F01/F02/F03 gates and progress persistence; focused Vitest added to explicit math-textbook CI list. Results must be checked after the next workflow run.

- V-015 SECOND MATH CI FAILURE (workflow 39092757624): Typecheck step PASS and original math tests PASS, but build TS1005 n12DerivationIntegrity.test.ts line 6 (missing closing parenthesis in test declaration). Corrected the one-character syntax error, new focused test now integrated into CI; rerun pending.

- V-016 THIRD MATH CI FAILURE / PATCH: run 39092932229 passed typecheck, focused math tests (including new N12 five checks), build, preview smoke, but old mobile textbook smoke expected Q01 before Q01a (three retries). Updated old smoke progression for 21 stages. Grouped bridging paragraphs into four contiguous math derivation cards; strengthened Vitest and E2E. Latest CI pending.

- V-017 FOURTH MATH CI FAILURE / TEST FIX: 39093203142 passed governance/typecheck/math Vitest/build/preview/mobile and desktop complete smoke/N02-N09 26 choices. New N12 E2E failed in mobile+desktop at line55 because hidden seeded distractor -7>2x was not among selected strong-scaffold 2 choices. Test now chooses a visible wrong option; longer end-to-end timeout and earlier workflow step; new run pending.

## P-002 verification ledger — 2026-10-18 JST (new correction)
Status: CODE STAGED / CI PENDING
- Baseline: main f4d3ab40a27808a3ecb56c379efbe16a3fe19be4 / N12 revision 1 / 21 answers.
- Code change staged only on work/W-MATH-004-P002-inline-token-implementation-20261018, originating at docs-only proposal snapshot; no main or published app mutation.
- Static in-memory check passed: 26 flow choices, 26 matching item IDs in sequence, no active retired P-001 supplemental IDs.
- Eleven explicit scalar/signed-coefficient bounds have exact authored math and distractors; original 15 source answer IDs untouched. Targeted UI and v1 state converter prepared.
- Still **UNVERIFIED** until CI: KaTeX formula compilation, typecheck, Vitest 26/legacy history, Playwright mobile and desktop, figure image timing, viewport width and restored completion. Do not report this as DONE.


## P-002 execution evidence after CI
- V-018 FIRST CI FAILURE REPRODUCED AND FIXED: Math textbook mode CI run 39098464146 passed typecheck and 154/156 Vitest tests, but two new static N12 formula-integrity assertions failed. Cause: generated TypeScript formula literals used a single backslash before LaTeX commands, particularly \le followed immediately by a digit and \quad followed immediately by a coefficient. A first regex correction with a word-boundary anchor missed that case. Corrected all 11 new formula blocks to retain literal escaped LaTeX commands before letters or digits; commit eb8e7fd922e48dd9e9f7af98354d78e891ffcfa7. Failed run is retained, not overwritten by the green result.
- V-019 PASS CI AT eb8e7fd922e48dd9e9f7af98354d78e891ffcfa7: Math textbook mode CI **39098595400 SUCCESS**: typecheck, focused schema/math/N12 Vitest, build, production SVG decode, complete N12 26-stage wrong-feedback/figure/restore browser tests on mobile+desktop, math textbook smoke on both, N02/N09 full 26-choice regression, chapter catalog, physics regression and practice setup. Math practice pilot CI **39098595404 SUCCESS** (typecheck, tests, build and mobile/desktop practice pilot). Repository Governance Check **39098595409 SUCCESS**. CI's old step label says “21-step” but the updated E2E source exercises/asserts 26; updating that label as a separate nonfunctional clean-up.
- V-020 PASS SOURCE AUDIT / RUNTIME LIMIT: R3 second-pass source review of N01/N02/N03/N09/N10 identifies CONFIRMED local-computation-in-whole-choice gaps at N01 Q07, N03 Q10 and N09 Q08. N02 and N10 NOT-AFFECTED only under R3 applicability (not blanket visual QA). New ledger P002_R3_IMPACT_LEDGER.md has blob SHA and detailed evidence. Separate docs-only **W-MATH-005/P-001 proposal PR #79** prepared; NO sibling implementation approval. N11/N13/N14 P-003 still paused.
- V-021 GATES NOT SATISFIED: user hands-on acceptance, approved main merge and GitHub Pages release are still absent. Published app remains P-001 (21-stage N12) until those gates. N12 implementation is reviewable at draft PR #78 and source CI, not a new live URL. Shared cross-work lessons cannot yet be promoted because related linked corrections remain proposal-only.


- V-022 FINAL SOURCE/CI PASS and EXPLICIT RELEASE AUTHORIZATION: Head 08dcaa89a72cdbba79ed5e119178172d398bbc36: Math textbook CI 39099106182 SUCCESS; math practice pilot CI 39099106186 SUCCESS; governance CI 39099106188 SUCCESS, including corrected 26-stage step label. User direct message 「N12の公開とW-MATH-005/P-001を承認する」 separately authorizes PR #78 main integration and Pages; user hands-on content acceptance remains a different gate. Post-merge Pages run and live URL must still be checked; this entry is not a deployment PASS.
