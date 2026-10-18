# W-MATH-005 — N01/N03/N09 式内局所計算穴の連動修正
Status: VERIFYING / W-MATH-006 VISUAL CORRECTION INCLUDED / RELEASE NOT AUTHORIZED
Updated: 2026-10-18 JST
Command: CMD-WORK-001「修正」
Root cause: W-MATH-004 F-012 / R3 (whole-expression choice obscures local evaluated value)
Approval: P-001 APPROVED by exact user message 2026-10-18 JST; only isolated code/QA. Main/Pages release remains unapproved.
Scope: approved/review-visible N01 Q07, N03 Q10, N09 Q08; nine local result holes proposed.
Do not touch: N02/N10, N12 P-002, unapproved N11/N13/N14, original source figures/Word or main/Pages.
Dependency: N12 P-002 merged in PR #78, main 51c184286e5207b189dd7b412643e99c426bc884; W-MATH-003/P-003 creation paused.
Evidence: W-MATH-004/P002_R3_IMPACT_LEDGER.md.
Proposal: PROPOSAL.md / P-001 — APPROVED. Implementation branch: work/W-MATH-005-R3-local-token-implementation-20261018. Implemented: nine added local token slots, revision-safe old progress conversion, aligned math/catalog tests and desktop/mobile E2E in draft PR #80. Initial CI test TypeScript narrowing failure and second CI stale catalog count assertion were both recorded and fixed. Linked visual correction: W-MATH-006/P-001 was approved by direct user 「いいよ」 (2026-10-18 JST) after concrete proposal; existing draft #80 now displays familiar N02-style 「選択」 thin square-corner rectangle for the nine R3 holes, preserving 44px tap height. Its earlier small □ text in W-MATH-005/P-001 is superseded **only for appearance**; nine new answer values/IDs are unchanged. Next: rerun full CI and hand off draft for QA; **no main merge/Pages publish**.
