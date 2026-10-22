# W-MATH-022/P-001 — N14 Q16 端点の段階的な代入検算
Status: PROPOSED — exact user approval required; NO IMPLEMENTATION
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正, WORK_SYSTEM §§12A/12B
Parent: accepted W-MATH-021/P-003 four-example Q15 hint, source branch SHA 689544fe453ff4ceb7fd96fc5d770d3569a87211. Main unchanged.

## 1. Grounded original, confirmed defect
Original teacher Word N14【16】 asks to substitute both endpoints x=−2/3 and x=2 back into |3x−2| and test equality to 4. Current n14Lesson.ts original Q16 has one precompleted multiple-choice answer |-4|=4 and |4|=4; the after-wrong hint directly says that 3x−2=−4 for the left endpoint and =4 for the right. The answer is mathematically correct, but the student performs neither endpoint's calculation. This is separate from all previously accepted Q10/Q14/Q15 derivations and the Q15-center hint.

## 2. Proposed complete learner sequence, all values initially blank
Given known original inequality and the endpoints derived in Q15:

\[
|3x-2|\le 4,\qquad x=-\frac23,\;x=2.
\]

At x=−2/3, first calculate multiplication, then subtraction (TWO independently graded choices):
\[
3\left(-\frac23\right)-2
=\boxed{\phantom{-2}}-2
=\boxed{\phantom{-4}}.
\]
Only AFTER the subtraction choice is resolved reveal a separate left absolute-value choice:
\[
|-4|=\boxed{\phantom4}.
\]

At x=2, multiply and subtract (TWO choices):
\[
3(2)-2
=\boxed{\phantom6}-2
=\boxed{\phantom4}.
\]
Only AFTER that subtraction is resolved reveal one right absolute-value choice:
\[
|4|=\boxed{\phantom4}.
\]

Six graded answers in order: −2, −4, 4, 6, 4, 4. Provide each choice four unique plausible alternatives. Separate gates prevent subsequent visible constants −4/4 from spoiling an earlier unresolved question. The original problem is kept under its single N14-Q16 source marker.

After all six choices, show just one short explanation: 両端で |3x−2|=4 となる。もとの条件は ≤4 だから、等号が成り立つ両端も解に含まれる。

## 3. Proposed error hints, one per new decision, not worked answers
Left multiplication: 3×(1/3)はどうなる？ では3×(−2/3)は？
Left subtraction: 直前に求めた数からさらに2を引くと、数直線ではどちらに進む？
Left absolute value: 負の数の絶対値は、原点からのどんな距離だった？
Right multiplication: 3×2は、2を3回足すといくつになる？
Right subtraction: 直前の積から2を引くと、いくつ残る？
Right absolute value: 正の数の絶対値は、どのように求められる？

These are short example/question scaffolds, not completed evaluated target formulas. The old direct after-wrong result (-4 and 4) must not be shown before its answer is resolved.

## 4. Exact code and history boundaries, ONLY after fresh approval
- Keep 16 original N14 Word source markers. Add five new item IDs under Q16 for left multiplication/subtraction/absolute value and right multiplication/subtraction. Preserve existing original n14-16 ID as right absolute-value choice, no change to any accepted Q10/Q14/Q15 item or Q15-center four-example hint.
- Current revision9 = 34 graded choices. Six replace old one -> proposed revision10 = 39. Snapshot and preserve all prior revision1–9 answers/progress, reopen ONLY old bundled n14-16 as the rekeyed right absolute value, leave every other correct answer and accepted visual history untouched.
- Preserve original N14 single figure, Q15→Q16 source order, mobile original blue「選択」and red「×」button size, no global CSS/render changes, no premature future formulas/results.
- Gate① requires authentic exact-SHA 320/390/1440 normal AND numbered reviewer Chrome images, full six choices, keyboard, wrong/hint/retry, staged unlock, KaTeX and no clipping. If mobile bounds fail, STOP and propose new exact design, never unilaterally shrink buttons.
- Gate② requires independent source Word OMML, all six arithmetic answers, hint leakage/choice types and math/physics/practice regression, history 9→10 and unaffected accepted Q10/Q14/Q15 blocks. Gate③ exact-SHA playable whole-app link and user full play + 総チェックOK is a later separate gate.

## 5. Authorization boundary
This Q16 P-001 is PROPOSED ONLY. The user's latest 「承認」 applies to earlier W-MATH-021/P-003 Q15-center hint Gate① and does NOT authorize Q16 changes. Need separate user approval for this six-step Q16 design BEFORE any source, CSS, tests or review metadata implementation. PR merge, main, Pages, deploy and costs are out of scope.
