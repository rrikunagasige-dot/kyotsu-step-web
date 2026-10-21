# W-MATH-019/P-001 — N14 Q14 三辺に同じ2を足す過程を式中穴として導く
Status: PROPOSED — EXACT USER APPROVAL REQUIRED / CODE NOT IMPLEMENTED
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正 (same-root approved-creation sweep §12B)
Stable original source marker: N14-Q14. Source: teacher-edit Word indexed N14 Q13→Q14→Q15 and current src/data/textbook/math/numbers/n14Lesson.ts rev7.

## Root cause and position
- Earlier W-MATH-017 F-017-03/F-017-08 independently confirmed the old N14-Q14 single item combines "三辺に2を足す" and the already completed -2≤3x≤6 in **one** final choice.
- N14 Q13 provides -4≤3x−2≤4. Q14 must remove −2 from the middle by +2 on all three members, not merely recognize the finished answer. Q15 subsequently divides by +3 and is **not** included in this proposal.
- Follow approved N14 Q10 three-logical-equation, one-prose-explanation, five-local-choices precedent, not new global rendering rules.

## Exact learner-facing flow (one bounded original Q14)
1. Existing starting formula (not a new graded item):
   `-4\le 3x-2\le 4`
2. One logical intermediate formula, mobile **two visual lines** with unchanged standard blue 選択/red ×:
   `-4+\boxed{\phantom{2}}\le 3x-2+\boxed{\phantom{2}}`
   visual continuation `\le 4+\boxed{\phantom{2}}`.
   Three distinct learned additions, answer `2,2,2`. Each answer is available from the preceding `-2` cancellation target. Do not prefill 2 or show result yet.
3. **After** resolving all three, display ONE short connecting paragraph:
   `三辺に同じ数を足しても、不等号の向きと等号は変わらない。中央の−2と＋2が打ち消し合い、3xだけが残る。`
4. Final logical inequality: `\boxed{\phantom{-2}}\le 3x\le\boxed{\phantom{6}}` — independent left and right endpoint calculations, correct answers `-2` and `6`. Five holes total in one original Q14 (three +2 decisions, two computed endpoints), no combined operation+answer selection.
5. Keep original `n14-after-14` then next source Q15 unchanged (Q15 leads from -2≤3x≤6 to divide by +3; a separate Work must design it).

## Stable IDs and bounded code candidates — proposal only
- Under `n14SourceToItemIds['N14-Q14']`, introduce, in source order, `n14-wm019-q14-add-left`, `n14-wm019-q14-add-center`, `n14-wm019-q14-add-right`, preserve `n14-14` as final left endpoint re-keyed from original combined choice to `-2`, then `n14-wm019-q14-bound-right` answer `6`. Final item types all formula-choice; wrong options must be distinct, source-grounded sign/endpoint errors, no answer leakage in hints.
- Three formula blocks + one paragraph, grouped via `derivationId: 'n14-q14-chain'`; no new section, no generic learner `確認` title. Preserve Q13->Q14->Q15 ordering, N14 16 original markers, review-only state and original figure.
- Expected N14 interaction total rev7 26 -> rev8 30 (five in Q14 replace original one). **Selective revision7→8 archive** of all v7 answers/progress; reopen only semantically re-keyed `n14-14` and its four genuinely new ids, preserve previously resolved N14 Q07/Q08/Q10/Q12 and other unchanged IDs; old `n14-14` attempt stays in `archivedRevisions['7']`. Require detailed migration tests from older revisions.
- Candidate code files only after consent: `src/data/textbook/math/numbers/n14Lesson.ts`, directly corresponding focused/unit/browser test files, and strictly Q14-specific narrow mobile CSS in `src/styles/global.css` / review-only yellow wrapper `src/review/review.css` if measurable fit requires it. No common renderer/button change. No alteration of Q10 CSS or question source. Put one approved CSS design in testable code, not unapproved repeated patches.
- Phones 320px and 390px: second *logical* equation is split visually into 2 lines, retaining exact original-sized buttons and correct DOM answer order; PC1440px retains logical single line. Exact Q14-scoped selectors only, with Q10 untouched.

## Review and stop conditions
- Math: independently check -4+2=-2, (3x-2)+2=3x and 4+2=6; ≤ and both equalities preserved. Verify Q14 and Q15 dependency, five choices/no duplicate distractors and stage unlock.
- UI and progression: original blue 選択 / red × unchanged; source-to-item exact map; 320/390 review & normal Chromium with scrollWidth/clientWidth and all child bounds, wrong/hint/retry/keyboard, 1440 desktop, no repeat/overlap; one explanation appears between logical 2nd and 3rd formulas.
- Student history: revision7→8 archives earlier attempts and only reopens n14-14 (new 4 ids unanswered); no prior accepted answer resetting. Full mathematics/physics/practice regression before Gate①.
- Gate①: genuine SHA-matched GitHub-backed screenshot capture of Q14 block; respect user-requested **concise equation-only chat review**, preserve screenshots internally and do not force a long gallery. User's exact response logged.
- Gate②: independent root-cause audit of Q15 separate, previous approved blocks, full original Q14 source if raw Word available. Gate③ actual same-SHA playable app from start to finish only after all fixes are closed.
- **STOP** and propose revision on inability to fit 320 full-size choices, ambiguous word-original/answer key, unexpected migration or anything outside exact scope. No blind button shrinking, no main merge, public hosting, release, costs.

## Explicit approval boundary
Only *after* user approves this exact P-001 may N14 Q14 be implemented on an isolated branch. The concise formula preview in conversation is a proposed pedagogical layout, not an actual screenshot or Gate① acceptance. N14 Q15 is not implicitly approved.
