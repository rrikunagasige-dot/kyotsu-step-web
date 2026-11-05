# W-MATH-017/P-003 — 同型不具合・7問の個別認知監査

Status: **SOURCE-COMFIRMED-STRUCTURE / FIXES NOT IMPLEMENTED**
Date: 2026-10-21 JST
Source: `src/data/textbook/math/numbers/n11Lesson.ts` + `n14Lesson.ts`, their `makeReviewSteps` helper; math SPEC §§3–6; MASTER §§8–11/52–54; earlier N11-Q05 confirmed root. Base code SHA is carried by Draft [PR #107](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107).

All seven source entries combine **operation instruction + already completed transformed result into one graded option**; that structural defect is CONFIRMED. The **precise** cognitive defect and the correct number of learner decisions must still be designed independently per source marker. This ledger is not authorization for mechanical replacement nor a Gate① acceptance.

| Marker | Currently graded in one ready-made option | Learner action(s) to restore (provisional design; verify source and no leakage before coding) | Next status |
| --- | --- | --- | --- |
| N11-Q06 | divide `3x<7` by positive 3 + `x<7/3` | distinguish choice of positive divisor, keeping orientation, and compute right-side fraction; maintain connection to Q05 | COGNITIVE-PATTERN-CONFIRMED / design pending |
| N11-Q08 | subtract 3 from `−2x+3≤5` + `−2x≤2` | select cancellation operation; perform right endpoint subtraction `5−3=2` | COGNITIVE-PATTERN-CONFIRMED / design pending |
| N11-Q09 | divide `−2x≤2` by `−2` + `x≥−1` | decide negative division and strict orientation; compute `2/(−2)=−1` without giving result early | COGNITIVE-PATTERN-CONFIRMED / design pending |
| N11-Q13 | multiply `(x−2)/3≤2x+1` by positive 3 + `x−2≤6x+3` | decide multiplication; distribute into both terms `3(2x+1)`, then preserve inequality | COGNITIVE-PATTERN-CONFIRMED / design pending |
| N14-Q10 | add 3 to all three `−5<x−3<5` + `−2<x<8` | choose shared operation; calculate both boundary updates `−5+3` and `5+3` | COGNITIVE-PATTERN-CONFIRMED / design pending |
| N14-Q14 | add 2 to all three `−4≤3x−2≤4` + `−2≤3x≤6` | choose operation; independently transform lower/upper boundaries and preserve inclusion | COGNITIVE-PATTERN-CONFIRMED / design pending |
| N14-Q15 | divide all three `−2≤3x≤6` by +3 + `−2/3≤x≤2` | decide positive factor and relation; calculate left and right bounds, preserving both inclusive signs | COGNITIVE-PATTERN-CONFIRMED / design pending |

## Work-order / preflight constraint
1. Finish CI and authentic user Gate① for first two confirmed bounded blocks N11-Q01 and N11-Q05. Do not request visual acceptance without real rendered SHA evidence.
2. Then reopen §12B preflight **per individual Q**; compare approved Set prose and existing Word math; distinguish independently necessary cognition vs redundant holes.
3. For each required semantic change, record old/new answer ID meaning and selective archive/revision contract; edit only exact user-approved P-003 scope or REVISE-PROPOSAL on material expansion.
4. Repeat QA and sibling impact scan; no asserted full Gate② PASS until all required items are PASS/NOT-AFFECTED with evidence.

## Other affected source units
N04/N05/N06/N07/N08/N13 and the remaining N11/N14 original markers share generator structure in portions. The 123-source-marker register is a **screening list**, not proof all need rewriting. Determine individually whether a standalone formula frame carries an actual multi-line derivation or an unnecessarily detached short answer. Preserve justified derivation frames, original figures and previously accepted pedagogy.
