# W-MATH-019 — FINDINGS
Status: CONFIRMED

F-019-01: Old N14 Q14 code under n14Lesson.ts combines action 「三辺に2を足す」 with entire result 「-2≤3x≤6」 in a single selection, preventing the learner from performing the 3 additions and independent -4+2 / 4+2 arithmetic. W-MATH-017/F-017-08 identified same-root error.

F-019-02: Existing N14 Q13 supplies -4≤3x−2≤4 and Q15 consumes -2≤3x≤6; replacing only Q14 preserves mathematical continuity, Q15 is still unmodified and requires separate later correction for its own compound choice.

F-019-03: Earlier N14 Q10 approved original blue「選択」/red「×」 controls with mobile two-visual-row but 3 logical equations. Q14 uses identical pedagogic principle with a Q14-only selector; same-root Q14 review narrower yellow wrapper may still need empirical verification, so no UI PASS without real 320px Chromium.

F-019-04: Historical current v7 student answers for old n14-14 have different grading meaning. User approval explicitly requires selective v7→8 historical snapshot, active reopen solely n14-14 and four new IDs, preservation of Q07/Q08/Q10/Q12/Q15 and source figure. No unrelated answer-reset permitted.

Scope: N14 Q14 only. Other potentially affected review widths and teacher Word raw OMML are UNVERIFIED; no permission to alter unrelated lessons, main, Pages, or hosting.
