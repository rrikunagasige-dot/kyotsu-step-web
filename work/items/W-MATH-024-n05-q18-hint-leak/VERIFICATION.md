# W-MATH-024 — VERIFICATION
Status: VERIFYING / HINT-ONLY CODED / BROWSER NOT YET VERIFIED
- Grounding: canonical teacher Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa` and live source q18; correct answer factorization and wrong example expansion checked algebraically.
- Branch from `9816954b94593389fd6e92bed47dede35621eee2`, which had all four native CI workflows SUCCESS. That pre-existing PASS is **not evidence of the unapproved correction**.
- After proposed fix: N05 revision2/20 original source labels and choice IDs should be unchanged, but this is NOT IMPLEMENTED OR VERIFIED.
- User P-001 approval PENDING; genuine N05 Gate①, wider Gate②, whole-app Gate③, main merge and deployment NOT DONE.

## 2026-10-22 Gate/branch provenance refinement (no learner edit)
- Since this proposal branch was forked, the user directly accepted N13 Q08 genuine Gate① and W-MATH-023 recorded `BLOCK-VISUAL-OK` at SHA `4502f92bc25abddaa90b8e6673d990c7a4a17867` (the only learner-facing change was hiding accepted Q08 review markers).
- W-MATH-024 was forked from older all-green W-MATH-023 source SHA `9816954b94593389fd6e92bed47dede35621eee2`. **It does not include the Q08 accepted-marker revision.** If P-001 is later approved, reconcile the exact current W-MATH-023 Gate① state before previewing/combining changes; never overwrite accepted N13/Q08/Q05 or W-MATH-022/Q16. This is a branch coordination prerequisite, not permission to merge/rebase/publish.
- New W-MATH-023 cross-block ledger records N05 Q18 as a confirmed, unresolved same-root hint leak, and Gate② remains open. W-MATH-024/P-001 is still PROPOSED / not approved / no source edits.

## Stage approval checkpoint
2026-10-22 JST: The user's immediate 「可以」 directly answered the explicit question 「N05のP-001を承認しますか？」 after displaying the unchanged exact proposal. **P-001 is APPROVED for N05 Q18 hint-only implementation**, not for extra lesson edits, N13/Q16 changes, Gate① or merges. This implementation branch starts from W-MATH-023 accepted Q05/Q08 branch SHA 4502f92bc25abddaa90b8e6673d990c7a4a17867; older proposal-only branch is retained as archival history. Only the Q18 hint text was modified in learner source (original N05 rev2, 20 IDs and two images intact). Tests and genuine Chrome capture pending.
- Dedicated N05 Vitest and review-only screenshot target/spec authored. Need CI and Noto JP Chromium images before Gate① user review. Do not mark PASS prematurely.
