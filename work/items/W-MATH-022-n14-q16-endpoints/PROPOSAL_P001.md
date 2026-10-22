# W-MATH-022/P-001 — N14 Q16: two independent endpoint substitutions and absolute values
Status: PROPOSED — EXACT USER APPROVAL REQUIRED; NOT IMPLEMENTED
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正 / WORK_SYSTEM §§12A/12B.
Source: user-provided teacher-edited 数と式 textbook v2, N14 original Q16, live `src/data/textbook/math/numbers/n14Lesson.ts` at `36b7065b6c43964926e7f65c2d3adfb6c5a73cbb`. Draft parent PR #110, no main or public release.

## 1. Original question and precise defect
Original Q16 asks to substitute **both** previously obtained endpoints `x=-2/3` and `x=2` into `3x-2` and confirm that the absolute value equals 4. This follows **already-accepted** Q13→Q14→Q15 and must not ask the learner to rediscover the interval. The original teacher question is retained as `N14-Q16`.

Current `n14-16` bundles two separately computed results into ONE graded answer:
`|-4|=4,\quad |4|=4`.
It skips (i) left inner substitution, (ii) left absolute value, (iii) right inner substitution, (iv) right absolute value. Its after-wrong hint **gives the target numbers explicitly**:
`x=−2/3では3x−2=−4、x=2では3x−2=4。距離はいずれも非負。`
This is after an incorrect choice (not before first attempt); it defeats the remaining reasoning challenge when the learner retries. These are two defects of the **same original Q16 small block**, so the exact proposal resolves them together, not by mass-editing another lesson.

## 2. Exact proposed student-visible math and gating
Start with **only** the original condition `|3x−2|≤4` and the already-derived endpoints from Q15 `x=-2/3,2`, without supplying either evaluation.

1. For the **left endpoint** `x=-2/3` show a SINGLE logical formula containing two individually graded blanks:
   `|3(-2/3)-2| = | [ left inner ] | = [ left absolute ]`.
   Key 1: `-4`; key 2: `4`. Hide subsequent right-endpoint problem until both are resolved.
2. One short interstitial explanation **only after the left result is complete**: `左端を元の式に代入し、まず絶対値の内側を計算した。次は右端も同じ順番で確かめよう。`
3. For **right endpoint** `x=2`, one logical formula and two independent graded blanks:
   `|3(2)-2| = | [ right inner ] | = [ right absolute ]`.
   Key 3: `4`; key 4: `4`.
4. Keep original post-answer conclusion, only after key4 is solved:
   `両端とも元の条件を等号で満たすため含める。これで絶対値不等式の範囲が完成した。`
   Include the reasoning that `|...|=4≤4` *after both answers*, not as an unsolved hint.
This is **2 endpoint formulas, 4 graded local computations and 1 explanatory bridge** (plus the initial condition and original concluding paragraph), *not* a mandatory copy of Q14/Q15's 3-equation/five-hole design. No solved evaluation may appear above an unsolved hole.

For review only, a readable shorthand:
`x=-\frac23:\quad |3(-\frac23)-2|=|\boxed{\phantom{-4}}|=\boxed{\phantom4}`
then the bridge paragraph, then
`x=2:\quad |3(2)-2|=|\boxed{\phantom4}|=\boxed{\phantom4}`.

## 3. Exact stable IDs and answers (source marker unchanged)
`n14SourceToItemIds['N14-Q16']` maps to FOUR graded items in order:
- `n14-wm022-q16-left-inside` → `-4`: one choice for evaluated `3(-2/3)-2`, 3 distinct plausible distractors (e.g. `4,-2,2`).
- `n14-wm022-q16-left-abs` → `4`: absolute value of negative left result, distinct plausible distractors (`-4,2,0`).
- `n14-wm022-q16-right-inside` → `4`: `3(2)-2`, distractors (`-4,2,6`).
- preserve `n14-16` → **`4` as right absolute value only**; it no longer grades the bundled two-endpoint answer, distractors (`-4,2,0`).
New readingFlow blocks scoped to the Q16 block, with original `n14-lead-16` and `n14-after-16` stable; retain already-approved Q15 result and the original one N14 figure. Use `derivationId=n14-q16-chain` and local formula segments with original full-sized blue「選択」/red「×」. Any actual mobile wrapping choice must be measured in Chromium 320/390/1440 and proposed again if it needs styling beyond this approved plan. Q16 reviewer metadata initially `awaiting-user`.

## 4. After-wrong hints: guide from smaller examples, do NOT reveal each target answer
All four hints are part of this *proposed* small-block design; they are distinct from currently accepted Q15 hint:
- Left inner `3(-2/3)-2`: `3×(1/3)を考えると、分母の3はどうなる？ 負の2/3を掛けた場合も同じ考え方で、最後に2を引こう。` (does not give -4).
- Left absolute `|-4|`: `例えば|-1|=1。絶対値は0からの距離だから、直前に出た負の数の絶対値はどうなる？` (worked DIFFERENT easy example; does not give |−4|=4).
- Right inner `3(2)-2`: `まず3×2を計算してみよう。そこから2を引くとどんな数になる？` (does not give 4).
- Right absolute `|4|`: `例えば|1|=1。正の数の絶対値はどんな値になる？ 直前に求めた右端の値に当てはめよう。` (does not give |4|=4).
Hints only appear after a wrong choice; if any exact wording or option distractor materially changes, return to REVISE-PROPOSAL before implementing.

## 5. Source/archive and authorization controls
N14 currently revision9 / **34 items / original source Q01–Q16**. Changing old combined `n14-16` to a single right-endpoint output is a material answer-key semantic change: propose revision **9→10**, with prior v9 answer and every earlier archived revision snapshotted and only active `n14-16` reopened. Add 3 local items, total **37**. Keep all Q10/Q14/Q15 accepted choices, user progress, 16 source markers, 1 existing figure, and Q16 original word problem/after conclusion. No change to Q15 P-003 four-example hint, global renderer, accepted visual markers, practice, physics or public app.
Do NOT implement any of this on user-approved branch before explicit approval. Draft PR base is W-MATH-021, not main; Gate①=Q16 genuine SHA-matched screenshot and user concise review only, Gate② independent cross-mode math/original source/keys/history audit, Gate③ user personally runs exact-SHA playable full app and says `総チェックOK`. CI is only technical evidence. Do not merge/publish/deploy or generate billable hosted previews under this approval.

## 6. Test plan and same-root §12B
- Original Word Q16 source and Q15→Q16 dependency; algebra:
  `3(-2/3)-2=-4`, `|-4|=4`, `3(2)-2=4`, `|4|=4`, both satisfy `|3x-2|≤4`; boundary equalities included.
- Independent 4 choices, unique distractors, answer type, 2-stage per endpoint unlock, wrong/hint/retry and keyboard; disallow premature finished result or leaked answer.
- Source ID count16, 37 interaction count, 9→10 + older 1–8 archives and old combined `n14-16` preserved, Q10/Q14/Q15 answers unaffected. Screenshots actual app normal+numbered 320/390/1440, viewport fragment bounds, full-sized choice controls; full textbook/practice/physics/Review/Governance CI.
- Same root: Q16 single bundled check + answer hint is CONFIRMED; Q10/Q14/Q15 prior separate repairs are NOT-AFFECTED by Q16 ID-only code; remaining N01–N13 different issues UNVERIFIED. If actual source does not fit these exact assumptions or extra CSS is required, STOP and resubmit exact amendment.
- No previously accepted small block reapproval; no shortcut to Gate②/③.

## User approval requested
May we implement **only Q16** as 2 independently solved endpoint expressions (4 blanks) with example-based after-wrong hints and safeguarded revision9→10 history? P-001 remains **PROPOSED** until a new explicit assent.
