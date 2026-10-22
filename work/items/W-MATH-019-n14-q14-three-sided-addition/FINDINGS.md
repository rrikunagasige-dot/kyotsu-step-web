# W-MATH-019 — FINDINGS
Status: CONFIRMED

F-019-01: Old N14 Q14 code under n14Lesson.ts combines action 「三辺に2を足す」 with entire result 「-2≤3x≤6」 in a single selection, preventing the learner from performing the 3 additions and independent -4+2 / 4+2 arithmetic. W-MATH-017/F-017-08 identified same-root error.

F-019-02: Existing N14 Q13 supplies -4≤3x−2≤4 and Q15 consumes -2≤3x≤6; replacing only Q14 preserves mathematical continuity, Q15 is still unmodified and requires separate later correction for its own compound choice.

F-019-03: Earlier N14 Q10 approved original blue「選択」/red「×」 controls with mobile two-visual-row but 3 logical equations. Q14 uses identical pedagogic principle with a Q14-only selector; same-root Q14 review narrower yellow wrapper may still need empirical verification, so no UI PASS without real 320px Chromium.

F-019-04: Historical current v7 student answers for old n14-14 have different grading meaning. User approval explicitly requires selective v7→8 historical snapshot, active reopen solely n14-14 and four new IDs, preservation of Q07/Q08/Q10/Q12/Q15 and source figure. No unrelated answer-reset permitted.

Scope: N14 Q14 only. Other potentially affected review widths and teacher Word raw OMML are UNVERIFIED; no permission to alter unrelated lessons, main, Pages, or hosting.

F-019-05: CONFIRMED real Q14 320 numbered-review horizontal clipping: scrollWidth=225px > clientWidth=220px by 5px, Chromium [#39707797563](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39707797563) source SHA `594c17c7226bdcbab67a255d50e1773cfd880aac`. The same actual source passes ordinary 320/390/1440 and numbered 390/1440 (five other genuine cases). Root is Q14 yellow wrapper consuming left/right inset (currently .4rem) in its already-bordered restricted width, NOT an arithmetic issue and NOT permission to shrink canonical controls. P-002 proposes targeted .15rem at <=350 only; UNVERIFIED until approved rerun. Q10 selector, Q15 source and all previously accepted blocks remain OUT OF SCOPE.


F-019-06 CONFIRMED: Real Chromium #39709378275 at SHA 4700299964b946cb9dc440606dd986dfe233b2ad: 5/6 cases PASS; 320px marked review FAIL. Original 225px vs 220px inner-width assertion no longer fails. The next assertion finds a math child left coordinate 47.125px against minimum 47.578125px, exceeding 1px allowance by 0.453125px (1.453125px outside formula line). Reviewed 390/1440 and ordinary 320/390/1440 PASS. P-002 approval and CSS implementation stand; no full Gate1 PASS. No reapproval of math content needed. P-003 only PROPOSED, code not changed.
