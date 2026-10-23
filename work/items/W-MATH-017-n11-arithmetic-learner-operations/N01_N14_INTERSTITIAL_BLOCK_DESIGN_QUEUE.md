# N01–N14 — 次の具体設計キュー（P-006以外は未承認）
Status: DESIGN-QUEUE ONLY; NOT AN IMPLEMENTATION PROPOSAL
Date: 2026-10-21 JST
Source: [N01–N14 full unit structure audit](./N01_N14_INTERSTITIAL_EXPLANATION_ANALYSIS_20261021.md) and current code branch.

## Separation rule
No all-N automatic same shape. Classify `KEEP`, `CHAIN`, `SHORT-REASON-BETWEEN`, `NUMBER-LINE/FIGURE`, `SOURCE-UNVERIFIED` at each original concept/Q boundary. Compare approved set, N12 mixed derivation, canonical math render lessons. Prior accepted individual blocks are protected. Source-level impact is a **candidate** until original Word and real app evidence say otherwise.

## Next bounded proposals, in order after P-006 gate
| Order | Exact original Q scope | Source current defect/candidate | Learner equation / reason placement suggested | Exclusions |
|---|---|---|---|---|
| 1 | N11 Q08–Q09 | `-2x+3≤5` combines operation+ready result. | `-2x+3≤5 → -2x+3-[3]≤5-[3] → -2x≤[2]`; **after** numeric step, short reason `負の係数で割ると不等号の向きが逆になる`; final `x≥[-1]`, with orientation learner decision designed separately, not given too early. | Q07/Q10 boundaries and Q11 approved proof untouched. |
| 2 | N14 Q09–Q10 | `-5<x-3<5` grades ready result together with `+3`. | `-5<x-3<5 → -5+[3]<x-3+[3]<5+[3] → -2<x<[8]`; explanation of **all three expressions** sharing one operation after the decision, not before it. | Preserve original two-boundary diagrams and Q07/Q08/Q12 approved fixes. |
| 3 | N14 Q13–Q16 | `-4≤3x-2≤4 → -2≤3x≤6 → -2/3≤x≤2` packed in compound choices. | In-equation addition / both endpoints, then **positive 3 division** explanation before final endpoint calculation, preserving both ≤, and original endpoint equality check Q16. | Do not expose original completed answer or skip Q16 verification. |
| 4 | N06 Q01–Q04 | X-substitution accepted as one complete option instead of steps. | `X=x+2y → (X+1)(X-2)-4 → X²-X-6 → (X-3)(X+2) → (x+2y-3)(x+2y+2)`; between penultimate/final rows, say `Xは一時的な置換だから元の文字に戻す` without revealing numbers. | Preserve source's real named X and original question mapping. |
| 5 | N07 Q06–Q10 | Paired `10x,100x` and subtraction as full equation choices. | `x=0.\overline8 →10x=8.\overline8 →10x-x=8 →9x=8 →x=8/9`; put `循環する小数部分が同じなので差で打ち消せる` **between** multiply and subtract. For `0.\overline{69}` replace 10 with 100, explain two-digit period. | Preserve number type explanations, Q01–Q05 division/remainders. |
| 6 | N10 Q15–Q21 | Rationalization often presents result before the reason. | `1/(2√3)= (1×√3)/(2√3×√3)=√3/6`; between multiplication and simplification explain `分母分子に同じゼロでない数を掛けるので分数の値は不変`; conjugates: `(a+b)(a-b)=a²-b²` and cross-terms cancel. | Protect already authored positivity proof and valid N10 grouped derivations. |
| 7 | N04 Q02–Q08 | Two cross-products collapse into full answer options. | `(a+b)^2=a²+ab+ba+b² → a²+[2ab]+b²` with **why two cross-products** short reason between. Q06–Q08 treat sign and cancellation independently. | Already-approved Q01 four-products figure and proof preserved. |
| 8 | N05 Q09–Q15 | Coefficient comparison and tasuki candidates conflated. | `(a+r)(a+s)=a²+(r+s)a+rs` → conditions `r+s,rs` as *two* decisions; before reverse-factor selection explain both **sum and product** must match; for tasuki show both cross-products before final pattern. | Canonical graphic and accepted drawing order unchanged. |
| 9 | N03 Q07–Q13 | Formula outputs sometimes hide distribution process. | `x²(x²-3x+4)→x⁴-3x³+4x²`; `(2x+1)(3x+4)` generate four products before collecting. Interstitial text says `各項は一度ずつ掛ける`. | Existing four-product node IDs and approved proof read first. |
| 10 | N08 Q05–Q09 / N09 Q08–Q09 | Sign decision and removal of absolute/root disconnected. | `5<9 → √5<3 → √5-3<0 → |√5-3|=3-√5`, with reason **only both compared terms nonnegative** after squared inequality before unsquare; N09 `1.41²<2<1.42²` → `1.41<√2<1.42` similarly. | N08 original figure and N09 prior sign/approximation fixes must remain. |
| 11 | N13 Q02–Q04 / Q06–Q08 | Two branches bundled into ready-made compound answer. | `|x-1|=4 → x-1=4 \text{ or } x-1=-4 → x=5 \text{ or } x=-3`; short explanation that both positions are at distance4, before solving branches, not after all answers. | Protect Q01 definition/Q09 negative condition. |
| 12 | N01 Q07/Q09–Q10; N02 Q05–Q10; N12 existing | Mixed existing authored prose and meaningful groups; not confirmed defective. | Source/manual/screen audit before any additional proposal. N02 Q05 must respect coefficient0 vs term0x; N12 already provides accepted between-equation paragraph idiom and should normally be **KEEP**. | No silent N12 group rewrite, no preapproved-block reacceptance. |

## Per-small-block exact-design checklist
1. Reread relevant MASTER §§7–12,20,52 and math SPEC, original Q, answer/rubric, previous accepted Work.
2. Copy the **actual original starting formula**, the intended successive intermediate formulas, and correct transformation proof into a numbered thought diagram. Do not invent expressions/extra definitions not used by source.
3. Mark `HOLE` at each distinct learner decision, and `EXPLAIN` only between rows where the next transformation is not self-evident. Precisely specify paragraph content **before** programming, so explanation never reveals the next hole.
4. Preserve student source ID→multiple decisions mapping and revision migration; list unchanged item IDs and existing acceptance.
5. After exact approval implement **one** concept/problem group at a time, capture real GitHub images, user Gate①, then independent Gate② cross-audit. Collect approvals without reopening unchanged accepted units.
6. Do not conflate draft PR #107 with final public SHA-matched app Gate③; user-approved merge intent preserved and executed only after gates.
