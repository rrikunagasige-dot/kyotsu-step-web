# W-MATH-013 — Findings
Status: CONFIRMED (pedagogical R1), CODE NOT CHANGED

- F-013-01 / R1-MULTISTEP-COLLAPSE: N11 Q14 from teacher original Word asks 「同類項を整理して解こう」, with current equation `x-2≤6x+3`. Current only `n11-14` final choice `x≥-1` hides x subtraction, constant subtraction and positive-5 division. Final key mathematically **correct**, so this is a stage/cognitive issue, not a wrong answer.
- Mathematical equivalence: subtract x → `−2≤5x+3`; subtract 3 → `−5≤5x`; positive divide by 5 → `−1≤x`, i.e. `x≥−1`.
- Root-cause impact: linked W-MATH-011 Gate② demonstrates N11 Q11 was repaired/accepted, Q12 NOT-AFFECTED, and N14 Q07/Q08/Q12 are **distinct separately scoped** defects. Do not bundle Q14 with them. The source + Master existing lessons already prohibit hidden multistep algebra; no duplication of lessons.
- Risk: Old `n11-14` answer already may be marked resolved; two *new* nodes must be unresolved without deleting old correct record. Revision 6 and archive 5 needed; failed idempotence or migrated progress must block code release.
- Risk: 320px combined premise and full final choice may clip, as demonstrated in older Q11; use short formula-local holes and preface math in adjacent narrative.
- Candidate alternatives: no new material math, no invented independent original Q15, no global renderer/style/schema changes. Reuse approved Q11 local method.

## 2026-10-21 bounded approved Q14 implementation
- CONFIRMED (already approved): Q14 original final `n11-14` correct response and 3 original wrong choices are unchanged. New answer stages are `5`, `-5`, with independent wrongs `[6,7,-5]`, `[1,-2,5]`.
- IMPLEMENTED IN ISOLATED BRANCH ONLY: New Q14 2-node source map and local reading flow, N11 revision6 archive preserving prior v5 answers. No other question source, figure, Word or public app changed.
- REVIEW LIMIT: E2E and screenshots remain NOT VERIFIED until actual exact SHA CI and authentic captured files can be inspected. N14 other pedagogical gaps are separately scoped, not silently fixed.
