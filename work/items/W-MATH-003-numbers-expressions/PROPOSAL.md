# W-MATH-003 — Approved Proposals

## P-001: 「数と式」を数学教科書モードの新章として作成

Status: APPROVED (implementation subject to source-fidelity gate)
Created: 2026-10-17

### Need
Existing draft Word for 数学Ⅰ「数と式」 comprises N01–N14 (6 多項式, 4 実数, 4 一次不等式) and NE01–NE02 (two extension units), with 233 question markers and 12 figure IDs. It contains educational material but has many standalone answers, inconsistent inline interactions, opportunities for continuous explanation and proof/figure staging improvements.

### Approved design
1. Confirm raw Word as canonical *supplied teaching draft*, distinguish publisher original/teacher edits and check reuse scope, verify formulas/figures and 16-unit inventory.
2. Map every source question/concept/figure to new or retained conceptual nodes; distinguish source line from newly authored questions and explicitly log omissions.
3. Apply previously accepted `集合` textbook-pedagogy (question→thinking→meaning→concept→property→proof-if-needed→example), relevant subject mode canon and technical prose/rendering/heading lessons. Do not substitute a research writing playbook for educational canon.
4. Write coherent hole-free instructional text, then design purpose-led inline holes and choices with answer unlock, concept bold black, proof/example distinction, no answer leakage, maintain detailed fire diagram.
5. Use **three conceptual heading chunks** (多項式, 実数, 1次不等式) with 発展 optional/auxiliary. Nxx IDs internal, no sixteen equal-size headings.
6. Pilot exactly four representative units before batch rollout: **N01, N03, N10, N12**. N01 concept, N03 table/derivation, N10 proof/root, N12 inequalities/number-line/practical case.
7. Source figure timing and semantic veracity, exact stable content IDs, route/topic integration into math textbook catalog without breaking other mode state.
8. Verify mathematical/physical correctness, source fidelity, diagrams, rendering/KaTeX, PC/mobile interaction and regression; provide runnable preview/app link, wait for actual user acceptance and separately authorized release.
9. Once pilot approved and generalizable, batch implementation of N02,N04–N06; N07–N09; N11,N13,N14; and NE01,NE02, respecting prerequisites and source mapping.
10. If user rejects product, register finding and transfer to `CMD-WORK-001 修正`; revised scope requires new proposal.

### Source gate before implementation
Original Word text index alone cannot preserve OMML equations and floating images; source Word raw-byte retrieval currently unavailable. Do not fabricate original equations. Distinguish fully legible word problem conditions (can independently solve) from math expressions missing in index (BLOCKED). User may supply original Word again or a fully rendered PDF preserving equations and figures.

### Approved scope
Source audit, detailed four-pilot lesson design, pilot app implementation (after source gate), QA/handoff, batching within approved structure after pilot acceptance. No textbook content edits to existing modes; no main/Pages merge without later approval.

### Out of scope
Original Word overwrite, source author's numbers/problems silently modified, 233 mechanical hole transplant, 12 figures replaced without explicit design reason, physics/practice changes, automated publication.

### QA
A strict source ID ↔ concept/problem ↔ learner node matrix for all 16 units; mathematical equation proofs, stable figure placement/answer gating, verification of N12 integer word problem, concept/proof/example hierarchy, overall mobile+desktop tests and user review.

### Approval
Approved by user: YES
Date: 2026-10-17
Evidence: After delivery of exact 21KB P-001 audit/proposal `NUMBERS_AND_EXPRESSIONS_CMD_WORK_002_INVENTORY_PROPOSAL_20261017.md`, user replied 「いいよ。こうやって作ろうか」.
Interpretation: approved unchanged design; cannot waive original-source/figure fidelity gate and cannot automatically authorize production merge.
