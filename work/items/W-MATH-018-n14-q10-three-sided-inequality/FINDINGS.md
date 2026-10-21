# W-MATH-018 — FINDINGS
Status: SOURCE-STRUCTURE-CONFIRMED / P-001 IMPLEMENTING

## F-018-01 Ready-made operation + completed bounds in N14 Q10
- Existing N14 Q09 `|x-3|<5`→`-5<x-3<5`, original Q10 asks "各辺に同じ操作"; prior graded one compound "三辺に3を足す、-2<x<8". Students did not separately decide three matching additions and two endpoint calculations.
- Exact approval of 3 math rows + 1 short explanation + 5 in-equation holes: `-5<x-3<5`→`-5+[3]<x-3+[3]<5+[3]`→`[-2]<x<[8]`.
- Original teacher Word v2 indexed text was read; its embedded math source not directly verified because the original raw bytes were not accessible. UNVERIFIED full original source fidelity.
- N14 original 16 question marker map maintained, N14 revision6→7 selective archive required. Original Q07 Q08 Q12, Figure F01 and Q14/Q15 unchanged.
- A screenshot's width 320px must not be assumed fitting before actual Chromium runs. An overflow requiring redesign triggers revised proposal approval.
- Other same-root open: N14 Q14/Q15 and N01-N14 screened candidates, each needs separate source proposal approval.

## F-018-02 Governance metadata failure
New Work folder initially had only WORK and PROPOSAL files and a status line with suffix; repository-governance-check.mjs requires ACTION_LOG.md, FINDINGS.md, VERIFICATION.md and a standalone `Status: APPROVED` line for executable Work. This is a record/template error, not learner-app source defect.


## F-018-03 — gate1 evidence discovers inner Q10 formula clipping at 320px AND 390px
Full real screenshots on exact SHA e1e913f2230c42175bc5e67a53e726d030752634: 320 pre-Q10 third 5+□ hidden; 390 initial third 選択 partly hidden. After all 3 are resolved, numeric 3 fits. Because global formula line overflow-x:auto hides excess inside the row, the existing E2E document-width test passed, **false positive**. See P001_GATE1_VISUAL_DEFECT.md. No user visual check yet. P002 local responsive CSS change is proposed only.

## F-018-04 — historical E2E rev6/Q12 offsets obsolete, original contents protected
Full math CI 39629959584 reached N04–N14 batch then six N14 Q07/Q08/Q12 cases failed on expecting revision6 while actual rev7; Q12 also tests old source offset slice15:18. Corrected only their test expectations in 0b63f8a1fc9b6d70d8ce6c0f90732345d431e8a9, preserving Q07/08/12 earlier user-approved content and historic v6 migration tests. Other tests still need rerun; do not declare overall PASS.
