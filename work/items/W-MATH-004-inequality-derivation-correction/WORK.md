# W-MATH-004 — 不等式の導出不足・局所穴の修正
Status: VERIFYING
Updated: 2026-10-18 JST
Command: CMD-WORK-001「修正」
Current revision: P-002 — APPROVED, code complete and all first-party CI PASS on isolated PR #78; awaiting hands-on acceptance and separate main/Pages release.
Historical proposal: P-001 — APPROVED, six derivation stages merged to main through PR #76 (commit f4d3ab40a27808a3ecb56c379efbe16a3fe19be4), GitHub Pages published under prior user authorization.
Repository: rrikunagasige-dot/kyotsu-step-web
Proposal: P002_PROPOSAL.md (exact user acceptance: direct 「いいよ」 to the proposal-approval question, 2026-10-18 JST)
Proposal branch: work/W-MATH-004-P002-inline-token-proposal-20261018 (draft PR #77)
Implementation branch: work/W-MATH-004-P002-inline-token-implementation-20261018

## Current user request
The derivation is mathematically correct but the *transformations themselves* should be answered inside the equation: coefficients of x, constants, signed coefficients, inequality endpoints. User accepted this design direction; exact P-002 implementation was accepted in the user's direct response to its approval question. Publishing is still separately gated. Preserve the user's distinct proposal approval gate.

## Baseline / verified state
- Published review-visible N12 is 15 original source-marked questions + six P-001 supplemental whole-expression choices = 21 answer stages; original 3 images and F03 after Q15 remain.
- Current formula renderer supports adjacent math/choice/math parts, but generic choice displays a wide 「選択」 button. Grouped derivation lines reveal up to the first unresolved *block*. New compact single-token display needs a scoped change.
- N12 revision=1 and stored progress rely on unitRevision + itemId. Reusing six supplemental IDs with different answers would risk false completion; a safe N12-only revision-2 transition is approved in P-002 and implemented only on this isolated branch.
- R3 local-token second-pass source audit completed: N01 Q07, N03 Q10, N09 Q08 CONFIRMED; N02/N10 narrowly not affected. Linked exact proposal W-MATH-005/P-001 is unapproved, PR #79; browser sibling QA remains unverified.
- W-MATH-003/P-003 pending creation of N11/N13/N14 remains paused.

## Approved P-002 implementation scope
- Keep N12 15 source items, answer keys, mapping and figures. Replace old six supplemental active items with 11 new uniquely identified local formula gaps, for **26 total answer stages**.
- N12-scoped compact accessible □, sequential gated derivation, suitable mobile overflow and feedback. Original question items remain full responses where they test meaning, conjunction, modeling, domain, result and verification.
- Deterministic N12 v1→v2 progress conversion: source answers remain credited, historical supplemental records preserved but not credited as new holes, no unrelated unit reset.
- Tests, user QA, new R3 affected-unit scan, then cross-work lesson deduplication after all corrections close.
- Keep code isolated on the P-002 implementation branch; no source-image, production, main or Pages mutations without distinct authorization.

## Approval and next action
1. Implementation complete on isolated P-002 branch: N12 26 stages, targeted progress conversion, math textbook CI 39098595400 PASS, math practice 39098595404 PASS, governance 39098595409 PASS, R3 cross-unit source review documented.
2. Review implementation PR #78 and W-MATH-005 separate docs-only proposal PR #79; await user hands-on review/authorization before either proposed content release or sibling fixes.
3. Main merge and Pages publication require distinct authorization; W-MATH-003 creation stays paused. Close and share lessons only following verification, user acceptance and related correction queue.

Related: [P-001 implementation PR #76](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/76); [app N12](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n12); [paused creation PR #73](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/73).
