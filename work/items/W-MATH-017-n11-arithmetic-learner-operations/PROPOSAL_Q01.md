# W-MATH-017/P-001 — N11 Q01 負数比較を「数と関係記号」にする
Status: PROPOSED — no implementation approval
Updated: 2026-10-21

## 1. Current bug / exact source
User's genuine public screenshot contains one bordered expression showing BOTH "\(-2\;?\;-5\)" and selected completed "\(-2>-5\)" at once. Underlying \`n11-formula-01\` has \`M('-2\;\mathrel{?}\;-5\quad'), C('n11-01')\` on the same formula line. The question asks what happens after multiplying \`2<5\` by \`−1\`, but raw signs are visually compressed and selected complete comparison duplicates the question.
Teacher Word original question N11-Q01 and diagram \`n11-f01\` are authoritative and must not change.

## 2. Correct mathematical meaning
\[
2<5 \quad \xRightarrow{\times(-1)\text{ on both sides}}\quad (-2)>(-5).
\]
The parentheses are *reading delimiters* for the two negative operands, not multiplication or change of value. \(-2\) is to the right of \(-5\) on the number line.

## 3. Proposed visual/cognitive redesign (small block Q01 only)
- **Before answer**: display exactly one comparison \(\boxed{(-2)\ \square\ (-5)}\) where the single *interactive* choice is the relationship symbol. The learner chooses \`>\` from \`>\`, \`<\`, \`=\`, \`≤\` (all three wrong signs false for these operands; the final 4-way exact set must be reviewed for KaTeX and appropriate plausible misconceptions). Do **not** also display a second completed full formula inside the same frame.
- **After answer**: the same equation reads \((-2)>(-5)\), with a compact explanation citing the number line and negative multiplication; maintain image \`n11-f01\` exactly and distinguish "comparison of negative values" from subtraction.
- Implement locally using the existing math textbook inline-choice rendering API if it supports replacing a chosen relation without duplication. **If a common renderer/schema change is necessary, STOP and re-present a revised P-001 for explicit approval**; do not silently edit common UI.

## 4. Preservation/migration and verification
Original teacher N11-Q01 source number and old mathematical key \(-2>-5\) remain documented; changing the graded answer from a full formula to \`>\` is a *material semantic change* in stored \`n11-01\` and cannot auto-complete from previous \`-2>-5\` progress. Require selective N11 revision archival or a separate new stable thinking ID and exact source mapping, preserving all old attempt/timestamp data and accepted other questions. Choose the final safe ID strategy only after inspecting existing schema and include it in the implementation plan; do not claim it is already implemented.
Authentic screenshots 320/390 before/wrong/hint/after/reload, choice correctness, number-line placement, overflow/KaTeX, progression into Q02 and unchanged previous accepted N11 other blocks. User small-block Gate① then cross-Gate② and full Gate③. No Word, diagram, global renderer, main or deployment edits without separate permission.

## 5. Approval boundary
P-001 is a *proposal*, not user-approved. Do not turn prior approval of N11 Q01 as an earlier version into approval of this new display. Wait for exact explicit approval before coding.
