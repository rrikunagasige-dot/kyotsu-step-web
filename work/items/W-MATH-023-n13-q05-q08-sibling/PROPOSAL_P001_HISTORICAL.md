# W-MATH-023 / P-001 — N13 Q05/Q08 二つの独立思考に直す
Status: PROPOSED
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正; independent new authorization required.

## Exact two original teacher targets
- N13 Q05 `と...のそれぞれで、二点間の距離を式で書こう。` (Word paragraph 557, original x case conditions carried in OMML)
- N13 Q08 `絶対値を使わない条件にし、解を求めよう。` (paragraph 566)

Scope is exactly N13 Q05 and Q08; work **one small question at a time**, and require individual genuine image review before moving to Q08 if approved jointly. All existing accepted N13 historical and N14 Q10/Q14/Q15/Q16 content and original diagrams are protected. No common helper refactor.

## P-001A exact learner design — N13 Q05 (2 local choices)
Intro: 「`|x−1|` は点 `x` と点 `1` の距離。数直線でどちらが右にあるかを先に見て、右の座標から左の座標を引こう。」

One derivation group:
- `x≥1` のとき：`|x-1| = [C(n13-wm023-q05-right)]`; answer formula `x-1`; three alternatives `1-x`, `x+1`, `-1-x`. Wrong-only hint: 「たとえば x=3 のときは点3が点1より右。2点の距離はどちらの座標からどちらを引くだろう。」
- `x<1` のとき：`|x-1| = [C(n13-05)]`; answer formula `1-x`; alternatives `x-1`, `1+x`, `-1-x`. Wrong-only hint: 「たとえば x=0 のときは点1が点0より右。右側から左側を引く順番を、文字 x に戻そう。」
- After both are answered, explain why both expressions are nonnegative under their case conditions; do not show answers before graded resolution. Source label N13-Q05 maps exactly these two IDs; original figure N13-F01 unchanged.

## P-001B exact learner design — N13 Q08 (3 meaningful choices)
Intro: 「`|3x|=6` では、はじめに絶対値の中身がとり得る二通りの等式を作り、それぞれを x について解こう。」

One derivation group:
1. `|3x|=6` から、正・負の**二つの等式をまとめて選ぶ** `[C(n13-wm023-q08-branches)]`: answer formula `3x=6\;\text{または}\;3x=-6`, alternatives `3x=6\;\text{かつ}\;3x=-6`, `3x=6`, `3x=-6`. Wrong-only hint: 「|y|=3なら、正の位置と負の位置の両方がある。その2通りを今の中身3xに当てはめよう。」
2. Positive branch `3x=6\Rightarrow x=[C(n13-wm023-q08-positive-root)]` answer `2`, alternatives `-2`, `6`, `\frac12`; hint: 「たとえば2u=6なら両辺を2で割ってu=3。ここでは係数3を使おう。」
3. Negative branch `3x=-6\Rightarrow x=[C(n13-08)]` answer `-2`, alternatives `2`, `-6`, `-\frac12`; hint: 「たとえば2u=−6ならu=−3。負の方も同じ正の係数3で割ろう。」
- After third resolution only: `x=2\;\text{または}\;x=-2`; the two roots are joined by 「または」, not simultaneous. N13-Q08 mapping becomes those 3 IDs; original teacher source marker remains one.
- No dummy or inactive static □. Native formulas and choice buttons with black math, original correct/wrong feedback and keyboard/reload behavior; explanatory prose appears between formulas where genuinely necessary.

## Exact technical plan, only AFTER approval
1. Modify only N13 Q05 and Q08 readingFlow/items/source-to-item mapping in `src/data/textbook/math/numbers/n13Lesson.ts`; N13 rev2→3, source marker count 9, app choice count 9→12, existing 2 image assets untouched.
2. Add N13 rev2→3 migration in `src/domain/textbook.ts`: normalize v1→v2 using already accepted historical R5 logic, then archive v2 and reopen only old `n13-05` and `n13-08`, new choices unanswered, keep other seven answers and all previously archived v1 history. Unit completion state invalidated only because new questions not yet solved; previous completion preserved in archive. Must be idempotent.
3. Tests: exact 12 IDs, 9 teacher markers, fraction/inequality KaTeX semantics, distractor uniqueness, hint no exact unfinished answer, input ordering/gate dependencies, 2 mobile widths 320/390 and desktop1440, wrong/red ×→hint→retry/blue 選択, save/reload, figure hashes, ancient progress archives and unrelated source regression.
4. After user implementation approval and each block's genuine screenshot, user Gate① visual confirmation **separately** for Q05 then Q08; independent Gate② cross-audit and eventual separate Gate③ whole app user playthrough only after their own conditions.

## Explicit approval boundary
**No P-001A/P-001B implementation approval exists.** A user saying 「続けて」 about W-MATH-022 is **not** approval to edit N13. If the user changes either learner wording, revision mapping or scope, set REVISE-PROPOSAL and present full new version before implementation. PR merge, public deployment and paid services are outside scope.
