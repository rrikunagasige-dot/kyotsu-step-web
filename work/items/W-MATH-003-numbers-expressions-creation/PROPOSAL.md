# W-MATH-003 / P-001 — 「数と式」新規数学教科書アプリ制作

Status: APPROVED (source gate BLOCKED)
Created: 2026-10-17

## Need
現行 `mathCatalog.ts` には「数と式」未登録。以前の教員作成Wordの16単元を、承認済み集合モードの一続きの教育本文とアプリ上の意味ある考える穴を使った新しい章に導入する。

## Exact proposal presented to and approved by user
1. Recover **original Word bytes + full formula & figure audit** (not the lossy indexed text as answer authority).
2. Coverage: N01–N14 + NE01–NE02 = 16 units / 233 question markers and 12 referenced figure IDs, with each question source and mapping.
3. Build dependency/coverage map and complete solutions, checking mathematical correctness.
4. Build naturally linked **hole-free** explanatory narrative: motivating question→meaning→concept→properties→proof when needed→example→reuse.
5. Classify thinking nodes, inline blanks/choices/feedback, no answer leakage, keep coherent derivations.
6. Figure purpose/position/no-leak, proposed **3 major learner-facing chunks** 多項式・実数・1次不等式, optional separate NE.
7. Pilot detailed design + source diff + user review prior to material application; representative N01 (definition), N03 (table & formulas), N10 (proof), N12 (number-line and application).
8. Pilot app implementation only after exact source and design verified, then browser QA and user hands-on review.
9. Remaining 12 units in batches after pilot accepted; no mass autoproduction before proven reusable design.
10. No main merge/Pages release without distinct authorization. User-rejected pilots move to CMD-WORK-001「修正」.

## Explicit scope
Design and, once source fidelity gate passes, creation of new numbers-and-expressions textbook chapter only. Original questions/figures remain unmodified and provenance preserved; new questions clearly distinguished.
Initial N01 N03 N10 N12 total source markers = 10 + 13 + 21 + 15 = 59; all only *initial mapping count*, not necessarily 59 inline holes.

## Not authorized
Invent omitted equations; claim publisher original consulted; rewrite legacy math/physics/practice or learner progress; alter technical mode laws; merge branch without approval; publish new textbook without QA and user acceptance.

## Verification
- Original Word byte access + OCR-independent OMML/layout inspection, figure source mapping.
- All source formulas, 233 markers, and 12 figures audited, including domain, equality direction, boundary and figure timing.
- Prototype user review, mathematics completeness, text/interaction/KaTeX/PC/mobile CI and regression.
- PR/preview link for user; separate public deployment authorization.

## Approval
Status: APPROVED
Evidence: after receiving full `NUMBERS_AND_EXPRESSIONS_CMD_WORK_002_INVENTORY_PROPOSAL_20261017.md` and its proposed phase/gates, user answered 「いいよ。こうやって作ろうか」 (2026-10-17).
Scope unchanged; this does not waive blocked raw-source requirement.

## Revision history
P-001 is approved as proposed. No revised proposal/conditions at present.
