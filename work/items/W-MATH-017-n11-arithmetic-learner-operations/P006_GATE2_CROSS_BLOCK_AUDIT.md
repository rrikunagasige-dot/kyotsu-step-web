# W-MATH-017 / P-006 — Gate② 横断監査（部分実施・保留）
Status: IN-PROGRESS / NOT CROSS-VERIFIED
Work: W-MATH-017 / P-003, P-005, P-006 / upcoming P-007 PROPOSED
Frozen *tested source* SHA: `2c568703cb3e56b5ef4ab119b411bdb89e674cc6`
Audit: assistant, 2026-10-21 JST
Gate①: **BLOCK-VISUAL-OK** for P-006 paragraphs, original screenshot and direct user response recorded in [P-006 Gate① acceptance](./P006_GATE1_VISUAL_ACCEPTANCE.md).
Evidence [full math CI #39593071259](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39593071259) **SUCCESS**, [review and screenshot CI #39593071069](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39593071069) **SUCCESS**, [governance #39593071076](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39593071076) **SUCCESS**.

| Surface | Scope | Status | Evidence / exact observation |
| --- | --- | --- | --- |
| Original teacher Word direct line-by-line fidelity | N11 Q01–Q14 original Word v2 | UNVERIFIED | Prior W-MATH-011 original 212,863-byte source recorded and source-map Q01–Q14 present, but fresh original Word binary not available in current session. Don't claim renewed original-source verification. |
| Mathematically correct transformed chain | P-006 Q05/Q06 | PASS | Source equations `3x-2<5`→`3x-2+2<5+2`→`3x<7`→`x<7/3`; two explanations inserted after prerequisite decisions, matched math and source assertions. |
| Answer keys/ID preservation | N11 Q05/Q06 | PASS | `n11-wm017-q05-operation`=2; `...balance`=2; `n11-05`=7; `n11-06`=7/3; N11 revision8, 25 decisions; P-006 changed no answer/item ID; TypeScript/Vitest CI PASS. |
| No premature formula answer/leak | Q05→Q06→Q07 | PASS (targeted) | Browser normal route 320/390/1440 proves explanation1 invisible before both +2, explanation2 invisible until 7, 7/3 only after later node; wrong→retry→correct capture PASS. |
| Figures/KaTeX/mobile | N11 Q05/Q06 and unchanged N11 F01/F02 | PASS (targeted) | Original figures unaffected; browser three widths no KaTeX errors/side overflow; full CI SVG decode and original graphics tests PASS. |
| Wrong/retry/correct/navigation | N11 lesson review + neighboring accepted N11 Q11/Q14 | PASS (automated) | 39593071069 screenshots and 39593071259 original Q11/Q14 flow mobile E2E, route/navigation PASS. |
| Shared UI and other subjects/modes | math textbook N01–N14, physics textbook, math practice setup | PASS (tested scope) | Full math CI includes 134 interaction math-source batch plus physics regression and practice setup PASS. Does NOT prove pedagogical fidelity in all 123 originals. |
| Learner progress/review isolation | N11 revision8, archived revision7 and earlier | PASS (automated scope) | N11 unit migration tests and review-only non-persisting flow success; P-006 prose-only change did not touch progress implementation. |
| Previously accepted corrections | N11 Q01/Q11/Q14, N14 Q07/08/12 & others | PASS (automated regression); pedagogical source status UNVERIFIED | Existing code/distractors unchanged; full CI passes, but prior visual user acceptance remains independently authoritative. |
| §12B sibling cognitive impact | N11 Q08/Q09/Q13; N14 Q10/Q14/Q15; other generated units | **FAIL/CONFIRMED OPEN** | [Existing sibling audit](./P003_SIBLING_COGNITIVE_LEDGER.md) confirms single graded ready-made operation+result. Q08/Q09 new exact P-007 proposal is NOT APPROVED or implemented. Further source-specific cases listed in [all-unit analysis](./N01_N14_INTERSTITIAL_EXPLANATION_ANALYSIS_20261021.md). |

## Root-cause signature / recursion
`makeReviewSteps` generated formula-choice cards currently let a single answer choice supply **both the chosen operation and the final transformed inequality**. This is the same pedagogical root cause repaired for N11 Q05/Q06; independent decisions matter on subtraction, negative division and ≥/≤ inclusion.
Visited: (compound operation+result, N11 Q05/Q06, revision8) → repaired & P-006 Gate① accepted; (same signature, N11 Q08/Q09, revision8) → P-007 candidate; (same signature, N11 Q13, N14 Q10/Q14/Q15) → audited candidates, not auto-implemented; (other N04–N14) → further source/visual audit needed.
Do not re-edit accepted P-006 nor change common generator without exact approval. No new rule duplicated into MASTER: existing §§10/20/52 already cover this.

## Close condition
**Gate② must remain NOT CROSS-VERIFIED** until fresh source-level provenance and all confirmed sibling defects (including P-007 if approved) have individually verified repairs or a reasoned documented no-change determination. Gate③ FINAL-REVIEW-NOT-READY; user's earlier merge intent remains on record but no main merge/publication yet.


## 2026-10-21 Gate② status update after P-007
Superseding the historical P-006-era P-007 `PROPOSED` row **only**: N11-Q08/Q09 P-007 now implemented, Math CI [39598038354](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39598038354) PASS, real Chromium Gate① [39598038524](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39598038524) PASS, user visual acceptance verbatim `いいよ` recorded in [P-007 sheet](./P007_GATE1_REVIEW_SHEET.md). N11-Q13 **OPEN — P-008 proposal only**; N14-Q10/Q14/Q15 **OPEN**; original DOCX direct source-level new reinspection **UNVERIFIED**. Gate② overall still not CROSS-VERIFIED; Gate③ still not ready. Do not mark full chapter accepted or merge.
