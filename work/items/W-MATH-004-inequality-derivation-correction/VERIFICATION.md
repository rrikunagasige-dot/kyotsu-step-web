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
