# W-MATH-020 — independent Gate② audit checkpoint
Status: IN-PROGRESS; NOT CROSS-VERIFIED
Frozen audited learner SHA: `93dfa96de05803ef9cdeeb8ee00f1b5665bcca44`
Auditor/date: independent QA, 2026-10-22 JST
Work: W-MATH-018 Q10, W-MATH-019 Q14, W-MATH-020 Q15; approved Q07/Q08/Q12/N11 unchanged.
Source Word: user original v2 via authoritative N14 handoff ZIP; extracted DOCX SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`. Original question numbering and embedded OMML inspected at N14; no separate answer book.

| Audit surface | N14 Q09–Q16 result | Exact evidence / exception |
| --- | --- | --- |
| Original Word source, numbering and wording | PASS scoped N14 Q01–16 | Original Word OOXML N14 Q13–16 has 【13】 abs removal, 【14】 cancel constant, 【15】 make coefficient one + final range, 【16】 check both endpoints; Word source Q01–16 intact. Full 123 cross-unit source fidelity UNVERIFIED. |
| Algebra, proof and source dependency | PASS Q09–Q16 | Q10 -5<x-3<5 iff -2<x<8. Q13–Q16 |3x-2|≤4 iff -4≤3x-2≤4 iff -2≤3x≤6 iff −2/3≤x≤2; substituting endpoints gives |-4|=|4|=4. Both endpoints inclusive. |
| Choice IDs, answer types, no premade final results | PASS Q10/Q14/Q15 first-state | 16 original N14 IDs → 34 interactions in revision9; Q15 3 divisors + 2 endpoints: 3,3,3,-2/3,2; four unique options each, progressive blocking, `wMath020P001.test.ts`. |
| Hints and no-answer leakage | **FAIL confirmed Q15 middle AFTER WRONG** | `n14-wm020-q15-divide-center` hint includes `3x÷3=x` before the center response is correct. Separate W-MATH-021/P-001 proposed only. Q16 old hint also directly computes endpoints; separate review candidate. Other root modes UNVERIFIED. |
| Figure, mobile and KaTeX | PASS targeted Q15 | One original N14 figure retained, no changed binary; real Chromium 320/390/1440 normal and marked reviewer #39716176256 6/6 PASS; code-SHA screenshots at `evidence/gate1`. |
| Wrong/hint/retry/keyboard and Q14→Q15→Q16 transition | PASS functional, hint quality FAIL separate | Playwright native normal/review six cases; old E2E terminal assumption fixed at source SHA above; Q15 first division choice unlocks after Q14, final Q15 left bound only after three divisors. |
| Prior revision answer archive, review isolation | PASS tested | N14 8→9 archive of old n14-15, preserves unchanged Q10/Q14/Q16 choices and prior revisions via unit tests; accepted Q15 marker hidden in future reviewer, old true images retained. |
| Related subjects/modes and approved old blocks | PASS automated covered; broader human audit UNVERIFIED | Full Math textbook CI #39719059325, Practice #39719059617, Governance #39719059314, Review Code #39719059324 all SUCCESS at same source SHA. Not a substitute for independent all-123 key/distractor & other modes visual audit. |
| Gate③ real link and full user walkthrough | NOT READY | PR #109 remains DRAFT unmerged; main `15ae503455bc6ae75b080caa1c4919cafb250027`, no deployed app code-SHA proof, user `総チェックOK` absent. |

## §12B same root and correction queue
- Root 1: completed operation+result instead of learner-produced derivation → Q10, Q14, Q15 repaired/visual accepted and guarded by stable source map, no repeated approval.
- Root 2: after-wrong hint supplies an unselected answer explicitly → Q15 center CONFIRMED, W-MATH-021/P-001 PROPOSED only; old Q16 worked-endpoint hint CONFIRMED separate candidate, NO CODE CHANGES; N11/Q10/Q14 local hints inspected for this direct division equation (NOT-AFFECTED by exact signature), broad 123 others UNVERIFIED.
- Visited tuples: (combined-op-result,N14 Q10,rev7) verified; (combined-op-result,N14 Q14,rev8) verified; (combined-op-result,N14 Q15,rev9) verified; (after-wrong-explicit-answer,N14 Q15,rev9) CONFIRMED pending; (after-wrong-explicit-answer,N14 Q16,rev9) pending distinct proposal.

Do NOT claim CROSS-VERIFIED or FINAL-APP-ACCEPTED while any required row FAIL/UNVERIFIED. Do NOT revise already accepted Q10/Q14/Q15 math, merge into main, deploy or create billing actions without separate authorizations.