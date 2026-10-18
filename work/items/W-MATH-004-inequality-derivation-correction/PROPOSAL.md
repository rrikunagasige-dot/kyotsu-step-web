# W-MATH-004 / P-001 — N12導出補完と不等式54問の品質ゲート
Status: APPROVED
Implementation gate: P-001 approved; merge and Pages NOT APPROVED.
Approval: 2026-10-18 JST, user explicitly stated 「P-001を承認する。N12の導出6段階追加を実装し、他の承認済み単元への影響も点検して続けて。」 in this chat.
Approval scope: exact seven-point P-001; review-only N12 app + focused tests + cross-creation audit and records; no main/Pages authority.
Date: 2026-10-18 JST
Instruction: CMD-WORK-001「修正」 — user approved entering assessment/proposal via 「それでつづけて？」 after exact command-match question.
Repo: rrikunagasige-dot/kyotsu-step-web, main 023bec8219fbb44194e7f69bed306af44e7e235f.

## Problem and verified evidence
The user found that inequality teaching skips too much reasoning, and suspects successive later sections decline in pedagogical rigor. In the review-visible N12 learner app, original source Q01/Q02 jump directly to solved bounds; Q06 solves both branches in one answer; Q12/Q13 hide multiple arithmetic transformations in one choice. See INEQUALITY_COGNITIVE_AUDIT.md (54 rows) and FINDINGS.md. N11/N13/N14 are **unimplemented P-003 draft**, not confirmed app defects. The hypothesis of universally decreasing quality is not proven: some late-stage N03/N09/N10 derivations remain fully staged.

## Exact approved implementation
1. **Repair existing review-only N12 learner copy** in `src/data/textbook/math/numbers/n12Lesson.ts` and its focused tests. Preserve all 15 original source markers, their ordering, the original three PNGs and gating (F03 after Q15), and all current 15 stable response IDs. Keep `status:'review'` and the 3-topic/2-heading information architecture.
2. Split five confirmed compressed locations into meaningful thought/derivation substeps, with **six additional authored inline answer stages**, not six new source questions:
   - Q01 insert `n12-01a` (after moving terms, `-7<2x`) before existing final result.
   - Q02 insert `n12-02a` (`2x≤1`) before existing final result.
   - Q06 insert `n12-06a` (`3x+2≤2x+4→x≤2`) and `n12-06b` (`2x+4≤9-x→3x≤5`), then original `n12-06` pair; preserve original Q07 as intersection decision.
   - Q12 insert `n12-12a` (`50+180x+130(20-x)→50+180x+2600-130x`), then existing simplified amount Q12.
   - Q13 insert `n12-13a` (`550≤50x<650`), then existing `11≤x<13`. Clearly note positive 50 preserves inequality directions.
3. Every added stage must ask a distinct cognitive operation (which algebraic action/which sign/why) inside the mathematical text/formula where possible; no repetitive blank cards, no answer leakage, coherent post-answer prose and calibrated feedback. UI compression can keep earlier steps compact after they are completed. No renumbering/automatic overwriting of progress keys. If the additional-stage schema causes a material migration/contract change, STOP and submit revised P-002 first.
4. **Cross-creation impact assessment** covers accepted/review-visible N01/N02/N03/N09/N10/N12, with documented signature R1/R2 and status CONFIRMED / NOT-AFFECTED / UNVERIFIED for each after inspect. New affected artifacts require linked correction proposal/approval, not automatic rewrite. The current preliminary ledger is `CROSS_CREATION_IMPACT_LEDGER.md`; only N12 is confirmed affected now.
5. **Design-only correction for pending creation**: compare N11 (14), N13 (9), N14 (16) source markers with the corrected reasoning standard; issue a dependency/required revision note for unapproved W-MATH-003/P-003, keeping PR #73 paused. Do **not** implement these three units or modify PR #73 under this P-001.
6. After verified N12 correction and any separately approved linked fixes, reconcile lessons into existing `docs/MASTER_APP_LESSONS.md` §§7/8/11/18/42/45/51 and mode-specific rules with deduplication. Reopen paused creation proposal only when correction queue closes; revision of its exact scope needs explicit approval.
7. Deliver separate implementation PR and review/app link. Main merge and Pages publication require separate user authorization; no direct main writes.

## Out of scope / Do Not Touch
Original teacher-edited Word mother (212863 bytes), existing N01/N02/N03/N09/N10 code unless separately approved on a linked correction proposal; N11/N13/N14 app data, all other chapters, Math Practice, Physics, published Math sets, source image bytes, setup title cards, URL/progress identity, released status, GitHub main and protected history. Unapproved P-003 is neither implementation approval nor something to merge.

## Verification gate
- Correct math: inequalities x>-7/2, x≤1/2, common -7/2<x≤1/2; triple x≤5/3; monetary 11≤x<13 and integer 11 or 12; both costs 3200 and 3250.
- Full source coverage: exact 15 N12 question markers, stable existing 15 IDs, six distinct supplemental cognitive choices; no hidden source question edits.
- No answer revealed in paragraph/alt/image/below-card before earlier answer; F01/F02 source figure correct, F03 gated after Q15; original PNG unchanged.
- Explain every necessary intermediate transform, separate content/math correctness from QA/UI and approval. Check start/middle/end for causal completeness, not hole count as KPI.
- Vitest/typecheck, math-textbook CI, desktop+mobile E2E, KaTeX/inline choices, wrong feedback, progress/restore/regression, user-visible original item access.
- Cross-creation ledger: explicit per-unit version, proof of confirmed/non-affected/unverified; second pass after any new root-cause discovery.
- User actual review and lesson memory close required before DONE. No deployment claim until separate Pages run succeeds.

## Approval question
**P-001 approval** requests authorization for the N12 15→21 inline-cognitive-stage review-only rewrite and exactly scoped QA, plus the linked audit/design reconciliation described above. It does **not** request permission to merge to main, deploy Pages, or implement N11/N13/N14. Material feedback creates new P-002 and awaits explicit approval.

Current gate: IMPLEMENTING on isolated branch; do not merge to main or deploy without separate explicit approval.