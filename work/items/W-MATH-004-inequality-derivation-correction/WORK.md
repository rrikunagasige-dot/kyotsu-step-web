# W-MATH-004 — 不等式の導出不足・局所穴の修正
Status: REVISE-PROPOSAL
Updated: 2026-10-18 JST
Command: CMD-WORK-001「修正」
Current revision: P-002 — PROPOSED, awaiting explicit exact implementation approval.
Historical proposal: P-001 — APPROVED, six derivation stages merged to main through PR #76 (commit f4d3ab40a27808a3ecb56c379efbe16a3fe19be4), GitHub Pages published under prior user authorization.
Repository: rrikunagasige-dot/kyotsu-step-web
Proposal: P002_PROPOSAL.md
Docs-only branch: work/W-MATH-004-P002-inline-token-proposal-20261018

## Current user request
The derivation is mathematically correct but the *transformations themselves* should be answered inside the equation: coefficients of x, constants, signed coefficients, inequality endpoints. User accepted this design direction; exact P-002 content/implementation is not yet approved. Preserve the user's distinct proposal approval gate.

## Baseline / verified state
- Published review-visible N12 is 15 original source-marked questions + six P-001 supplemental whole-expression choices = 21 answer stages; original 3 images and F03 after Q15 remain.
- Current formula renderer supports adjacent math/choice/math parts, but generic choice displays a wide 「選択」 button. Grouped derivation lines reveal up to the first unresolved *block*. New compact single-token display needs a scoped change.
- N12 revision=1 and stored progress rely on unitRevision + itemId. Reusing six supplemental IDs with different answers would risk false completion; a safe N12-only revision-2 transition is part of the new requested implementation, not an approved action yet.
- Previous R1/R2 approved-creation source audit covered N01/N02/N03/N09/N10; a new R3 local-token-gate pass is proposed and still unverified.
- W-MATH-003/P-003 pending creation of N11/N13/N14 remains paused.

## P-002 scope requested, NOT authorized for implementation yet
- Keep N12 15 source items, answer keys, mapping and figures. Replace old six supplemental active items with 11 new uniquely identified local formula gaps, for **26 total answer stages**.
- N12-scoped compact accessible □, sequential gated derivation, suitable mobile overflow and feedback. Original question items remain full responses where they test meaning, conjunction, modeling, domain, result and verification.
- Deterministic N12 v1→v2 progress conversion: source answers remain credited, historical supplemental records preserved but not credited as new holes, no unrelated unit reset.
- Tests, user QA, new R3 affected-unit scan, then cross-work lesson deduplication after all corrections close.
- NO code, images, production, main or Pages mutations under proposal-only stage.

## Approval and next action
1. Present full P-002, ask the user for explicit 「P-002を承認する」 or requested edits; **STOP**.
2. After exact P-002 approval: implement in isolated branch, run tests / mobile+desktop, scan R3 siblings, propose linked repairs if needed, report implementation PR.
3. Merge and Pages publication still require distinct user authorization. Close and share lessons only following verification, user acceptance and related correction queue.

Related: [P-001 implementation PR #76](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/76); [app N12](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n12); [paused creation PR #73](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/73).
