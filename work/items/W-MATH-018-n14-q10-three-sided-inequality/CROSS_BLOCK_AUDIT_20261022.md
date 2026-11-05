# W-MATH-018 — independent cross-block audit checkpoint
Status: IN-PROGRESS; NOT CROSS-VERIFIED
Target app source SHA: f058ec38a6e21f2925fc4535c34d0c741f356046
Date: 2026-10-22 JST
Procedure: WORK_SYSTEM §§12A–12B, existing work/templates/CROSS_BLOCK_AUDIT.md

The user accepted the *concise formula representation* with the exact message 「对对对，可以的继续」, after source-matched real screenshots were shown earlier in ChatGPT. This is N14 Q10 visual/layout acceptance only, not a claim that every individual screenshot was examined. Earlier acceptance history is not annulled.

| Surface | Result | Evidence / boundary |
| --- | --- | --- |
| Original source-to-item structure | PASS structural / UNVERIFIED Word OMML | N14 Q01–Q16 mapping, 26 items and revision7 verified by src/data/textbook/math/numbers/wMath018P001.test.ts. Original teacher Word embedded equation bytes not independently checked. |
| Math and five learner decisions | PASS | Add +3 on three sides; -5+3=-2 and 5+3=8; 5 stepwise correct answers 3,3,3,-2,8 and distinct wrong options asserted in wMath018P001.test.ts. |
| No answer leakage and continuity Q09→Q10→Q11 | PASS tested | Q10 three logical formulas and one explanation, gated decisions; previous/next content order asserted in wMath018P001.test.ts and e2e/wmath018-n14-q10-gate1.spec.ts. |
| Error/hint/retry, focus and state timing | PASS | Authentic Chromium screenshots and E2E six cases at 320/390/1440: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39643764980 (SUCCESS). |
| Mobile equation fit and canonical controls | PASS | All six formula parts visible; 2 visual rows on phone, one row on desktop; old full-size blue 選択/red × retained. Same actual Chromium run. |
| Historical answer preservation | PASS tested | N14 rev6→7 archives old combined n14-10 and preserves other answers, including Q07/Q08/Q12/Q14/Q15. wMath018P001.test.ts in Math textbook CI run #39643764939 SUCCESS. |
| Unaffected approved modes | PASS regression / NOT-AFFECTED by P004 selector | N14 Q07/Q08/Q12, N11 Q05–Q09/Q13, math practice and physics textbook; same full CI + math practice #39643765326 and governance #39643764970 all SUCCESS; previous user acceptances stand. |
| Other review-only narrow screens | UNVERIFIED globally | P004 targets only the Q10 mark; no independent exhaustive screenshot check of other long marked formulas. |
| W-MATH-017 same-root sibling | CONFIRMED separate corrective candidates | Existing N14 Q14 and Q15 bundle an operation with its finished result in one choice. Do NOT change under Q10 consent. Separate exact proposals are required; Q14 should be examined first. |
| Original Word raw equation fidelity / all 123 markers / final four-mode candidate | UNVERIFIED | Earlier structural mapping/CI cannot establish every original equation from raw Word or certify full-pedagogy Gate②. |

§12B visited: (combined operation-and-completed-answer, N14-Q10 rev7) verified; (same root, N14-Q14 rev7) candidate; (same root, N14-Q15 rev7) candidate. Related N11 earlier approved corrections are preserved. No duplicate MASTER rule: docs/MASTER_APP_LESSONS.md §§8–12, 20, 52–54 and subjects/mathematics/textbook/SPEC.md §§5–8 already cover the need for student-generated intermediate work, equation-visible choices and no leakage.

**Independent global Gate② remains IN-PROGRESS**, not CROSS-VERIFIED, because the above UNVERIFIED and known separately authorized Work queue remain. Gate③ FINAL-REVIEW-NOT-READY. Main/Pages/public unchanged; no new authority granted by this audit.
