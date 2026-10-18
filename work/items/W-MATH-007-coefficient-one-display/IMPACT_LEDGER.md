# W-MATH-007/P-001 — cross-creation impact ledger

Root-cause signature: resolved formula choice with value 1 rendered as one math span, immediately followed by another math span whose first symbol is a variable factor.

| Unit / scope | Finding | Source evidence | Planned action |
| --- | --- | --- | --- |
| Published N12 / Q06 left | CONFIRMED SOURCE DEFECT | n12-p002-q06-left-coef answer 1, then math x+2\\le4 | One narrowly scoped post-answer display correction |
| Published N12 / Q01 Q02 Q06 right coefficients | NOT AFFECTED, control cases | Values 2, 2, 3 before x | Confirm they remain 2x, 2x, 3x |
| Published N12 / Q02 constant | NOT AFFECTED, high-risk counterexample | Answer 1 at equation end, no following x | Keep visible numeric 1 |
| Published N02 and N10 | NO SAME SIGNATURE IN REVIEWED NUMBER-LESSON SOURCE | No local choice immediately followed by math starting with variable | Do not edit; regression only |
| Published N01/N03/N09 | NO SAME SIGNATURE IN REVIEWED NUMBER-LESSON SOURCE | No local numeric-1 choice directly adjacent to variable | Do not edit; regression only |
| Draft W-MATH-005 PR #80 N01/N03/N09 nine holes | NO SAME SIGNATURE IN LINKED R3 FORMULA SOURCES | -2/-3 coefficients, four algebraic products, two numeric square results | Leave draft unchanged; targeted regression |
| Other approved math textbook families | AUDITED / NO SAME SIGNATURE | All 11 math `*Lesson.ts` modules (numbers/function/proposition/set) plus 3 math slices/helpers read from main 066e0da; no `C(id), M('x+...')`-style resolved coefficient boundary outside N12 | No additional correction under this P-001 |
| Physics & math practice | OUT OF SCOPE / REGRESSION | Different modes; no confirmed same scenario | No code edits |

Current: user approved P-001 implementation-only with 「いいよ続けて」; PR #85 implements the N12-local coefficient normalization; main/Pages remain unchanged. Read-only secondary scan found only four N12 adjacent-choice-x+ boundaries: q01 coefficient 2, q02 coefficient 2, q06-left coefficient 1 (affected), q06-right coefficient 3. A broad `1x` substring match in N03 denotes `11x`, not a unit-coefficient display defect. No new correction directive required at this time. Final CI verification pending. Shared lessons update and new creation remain paused until acceptance.
