# W-MATH-017/P-002 — N11 Q05「答えの選択」を「実際の計算」に置換
Status: PROPOSED — no implementation approval
Updated: 2026-10-21

## 1. Current confirmed defect
N11 Q05 displays \`3x-2<5\`. Its original \`makeReviewSteps\` item has the combined correct answer \`\text{両辺に 2 を足す},\quad3x<7\`; the 3 wrong choices also combine an operation label and its already completed outcome. Screenshot shows only this complete paired formula as a selectable final answer. This tests recognition of a completed operation/result, **not whether the learner can carry out the required algebra**.
Same root is detected in other N11 items Q06/Q08/Q09/Q13 and N14 Q10/Q14/Q15; those are NOT authorized to edit under P-002 and require separate bounded per-question inspection/proposals.

## 2. Exact mathematics and cognitive sequence
\[
3x-2<5
\quad\xRightarrow{\text{add 2 to both sides}}\quad
3x-2+2<5+2
\quad\Longrightarrow\quad
3x<7.
\]
Both addition and resulting calculation are necessary; addition leaves the strict \(<\) orientation unchanged. Following Q06 has to solve \`3x<7\` via division by positive 3, but that is a **separate** future block, not silently part of Q05.
Use the accepted Set-mode learning flow: concrete need → learner judgment in the actual expression → after-answer reasoning → reuse of the previous result in the next question. **Do not simply insert more complete worked equations or three disconnected formula cards.** One visually continuous derivation and concise surrounding sentences.

## 3. Proposed 2 student decisions inside original Q05
**Thinking node A (operation):** show \`3x-2<5\` and ask which same number to add on both sides to eliminate \`−2\`; an inline selection of \`+2\`/numeric \`2\` in the operation, NOT a full final transformed expression. Use authored false operations \`−2\`, \`+3\`, \`0\`, all with distinct conceptual causes.
**Thinking node B (actual arithmetic):** after A is solved, show \`3x-2+2<5+2\` in one aligned proof frame; learner fills the *calculated right-side numeric result* in \`3x<\boxed{7}\`. Wrong values e.g. \`3\`, \`5\`, \`9\` diagnose wrong subtraction, omitted operation, arithmetic error. Confirm all options are distinct and not self-evidently leaked by the preceding paragraph.
**After B**: briefly explain \`−2+2=0\`, \`5+2=7\`, and no reversal, then keep Q06's unchanged given \`3x<7\` as a continuation. Avoid explaining the complete result before B is answered. Distinct cognitive work: choose reversible operation → execute calculation. No redundant full-expression third choice.

## 4. Stable ID and old progress
Source Word marker \`N11-Q05\` and its original correct mathematical result are protected. Current graded \`n11-05\` is a long compound math answer; replacing it with the numeric last blank **changes grading semantics**. Do not silently migrate old \`n11-05\` resolved flag onto a new numeric question. Plan must explicitly archive prior attempt values/timestamps, preserve all other N11 Q01–Q14 answers and earlier approved gates, add one new local thinking ID, and increment N11 unit revision appropriately only after approval. If exact old stable-ID semantics cannot safely be preserved, return with a revised P-002 rather than guessing.
Keep teacher Word, original question count, N11 original number-line figures, common renderer/schema, Math Practice/Physics/other units unchanged. Math unit counts after repair are test-derived, never guessed as a source-question increase.
Test 4 plausible options per hole; wrong→hint→retry→correct→reload in real 320px/390px and desktop, answer-gating, preservation of old progress, source mathematics, regression on prior N11 and N14 corrections; then one Q05 Gate①, impacted Gate② and full user Gate③.

## 5. Approval boundary
P-002 is NOT approved merely because the user criticized the live implementation. Source/UX inspection and proposal creation permitted; **no learner code changes before exact user approval**. Source-manifest and ID-migration design must be rechecked before implementation.
