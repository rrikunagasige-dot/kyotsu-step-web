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
