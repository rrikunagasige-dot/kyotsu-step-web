# W-MATH-004 — 不等式の認知操作・導出密度の監査

Status: ASSESSMENT / PROPOSAL ONLY — not learner implementation
Date: 2026-10-18 JST
Target: 数学Ⅰ・教科書/学習モード、N11–N14（原問14+15+9+16=54）

Sources: original teacher-edited Word `01_数と式_教科書モード_対話段階導入版_v2(1).docx` (Library-resolved 212863 bytes, 53 pages; printed 27–37 / document pages 36–47); existing `src/data/textbook/math/numbers/n12Lesson.ts` on main; PR #73 P-003 source/learner audits; approved N01/N02/N03/N09/N10 implementations. The independent answer table has no publisher answer booklet.

Legend: **C** = confirmed existing N12 app design compression (correction candidate); **D** = pedagogical depth to inspect/design before implementation, or under-guided meaning; **P** = source/current flow already separates the core operation sufficiently on initial inspection. **P is not final user/mobile PASS.** N11/N13/N14 are unimplemented, so **D/P are design assessments, not app-bug verdicts**.

## Audited 54 source markers

| Source | Class | Result / missing or retained cognitive action |
| --- | :---: | --- |
| N11-Q01 | D | 符号反転の観察→差での証明を接続 |
| N11-Q02 | P | (b+c)-(a+c)=b-a を学習者に構成させる |
| N11-Q03 | D | c(b-a)の正/負/0の三場合と0除算禁止を明示 |
| N11-Q04 | D | 負数倍と加法を分け、変換順と理由を問う |
| N11-Q05 | P | 両辺へ2を加える理由を示す |
| N11-Q06 | P | 正の3で割るので向きが保たれる |
| N11-Q07 | P | 開区間端点を元式代入で調べる |
| N11-Q08 | P | 両辺から3を引く |
| N11-Q09 | D | -2で割る操作と反転理由を結ぶ |
| N11-Q10 | P | 閉じた端点を等号成立で確認 |
| N11-Q11 | D | 括弧展開・文字移項・定数整理の中間式を可視化 |
| N11-Q12 | P | -4で割ると≤へ逆転 |
| N11-Q13 | P | 分母3を消すとき正数倍と確認 |
| N11-Q14 | D | 移項→5で割る2操作を分離して提示 |
| N12-Q01 | C | x-2<3x+5→-2<2x+5→-7<2x→-7/2<x の途中を見せる |
| N12-Q02 | C | x+4≤5-x→2x≤1→x≤1/2 に分ける |
| N12-Q03 | P | x=1を両条件に代入する判断は明示済み |
| N12-Q04 | P | 共通部分・白丸黒丸の意味は明示済み |
| N12-Q05 | P | 三連不等式を2条件へ分解する問いは明示済み |
| N12-Q06 | C | 二つを一括最終解で答えず、各辺の変形と2/5/3比較を示す |
| N12-Q07 | D | 5/3<2の根拠と「同時=かつ」を明示 |
| N12-Q08 | P | 個数20-xの根拠は説明済み |
| N12-Q09 | P | 整数かつ0≤x≤20を先に保持する |
| N12-Q10 | P | 3費目の意味を結んだ式作成は明示済み |
| N12-Q11 | P | 以上・未満の端点を式に対応させる |
| N12-Q12 | C | 130(20-x)の分配と係数整理を別表示 |
| N12-Q13 | C | 2650差引→正の50除算の2操作を別表示 |
| N12-Q14 | P | 実数範囲を整数候補へ戻す問いは明示済み |
| N12-Q15 | P | 両候補を元の代金条件で検算する |
| N13-Q01 | P | 原点から左右2点の距離を先に考える |
| N13-Q02 | P | X=x-1という塊の意味を明示する |
| N13-Q03 | P | X=±4を二式x-1=±4に戻す |
| N13-Q04 | D | x-1=4と=-4の二枝の計算をそれぞれ表示 |
| N13-Q05 | D | 1を基準とする距離の左右場合分けと符号を説明 |
| N13-Q06 | P | abs(x+2)=3を二式へ分ける |
| N13-Q07 | P | 両枝を解き元式で確認する |
| N13-Q08 | D | 3x=±6→x=±2を中間式で見せる（転移支援は抑制） |
| N13-Q09 | D | a>0/a=0/a<0の三つの答えの理由を切り分ける |
| N14-Q01 | P | 絶対値を原点からの距離として言い換える |
| N14-Q02 | P | 境界±3を考える |
| N14-Q03 | P | 内側・外側と端点除外の判断を行う |
| N14-Q04 | P | -3<x<3へ表す |
| N14-Q05 | D | abs(x)≥4で境界・外側・等号を一度に問うため必要に応じ分解 |
| N14-Q06 | P | 離れた左右2範囲を「または」で結ぶ |
| N14-Q07 | D | abs(X)<a⇔-a<X<a の一般化の前提a>0と距離の理由 |
| N14-Q08 | D | abs(X)>aの外側が「または」となる根拠 |
| N14-Q09 | P | abs(x-3)<5を三辺へ翻訳 |
| N14-Q10 | P | 三辺全体へ+3を行う |
| N14-Q11 | P | abs(x+3)≥2を二つの不等式に分ける |
| N14-Q12 | D | 分岐ごとにx≤-5、x≥-1までの途中を見せる |
| N14-Q13 | P | abs(3x-2)≤4を-4≤3x-2≤4へ翻訳 |
| N14-Q14 | P | 三辺へ+2を行う |
| N14-Q15 | P | 正の3で三辺を割る |
| N14-Q16 | P | 両端を元式へ代入し包含確認 |

Count: 54 rows; class C 5, D 15, P 34. Only class C is confirmed existing-app problem. This is not a count of required holes: one source question may need zero, one, or multiple learner choices depending on cognitive transitions.

## Four representative repairs

1. **N11-Q02/Q03**: If a<b, then b-a>0; adding c gives (b+c)-(a+c)=b-a>0; multiplying by c gives bc-ac=c(b-a). c>0 preserves direction; c<0 reverses; c=0 yields equality and division by zero is invalid. Show the difference-sign cause, not merely a memorized flip.
2. **N12-Q01/Q02/Q06**: Input → move terms with the same operation on both sides → sign check of divisor → solved interval → intersection (AND) → endpoints. Reveal each intermediate equation after the preceding reasoning step. Do not add four giant separate blank cards.
3. **N13-Q02–05**: |x-1|=4 means distance(x,1)=4 → x-1=4 OR x-1=-4 → x=5 OR x=-3; verify both solutions. Define X only if it helps; include x<1 and x≥1 distance branch after the learner has chosen the two candidates.
4. **N14-Q01–08,Q13–16**: abs(X)<a inside (AND), abs(X)>a outside (OR) with a>0, then abs(3x-2)≤4 → -4≤3x-2≤4 → -2≤3x≤6 → -2/3≤x≤2 and both endpoint substitutions. Answer-filled N14-F01 only after Q06.

## Quality-drift hypothesis vs verified facts

- User observation: the first part of a lengthy unit is carefully guided while later parts may lose derivation and causal prose.
- Confirmed instance: N12 has compressed multi-operation holes, even though the source Word's learning questions carry reasonable conceptual staging.
- Counterexamples against a universal monotonic decline: N03 separates distribution→4 products→combine; N10 separates conjugate choice→denominator→numerator→last check near its end; N09 explicitly stages comparison and sign. Therefore **drift is an audit hypothesis, not yet a universal law**.
- Candidate root signature R1: one choice is asked to perform two or more previously unmodeled nontrivial operations while intermediate lines/reasons are hidden. R2: result is presented without a meaning/why link. A third systemic QA gate should check beginning/middle/end, but its prior absence is not yet proven the unique root cause.

## Gate for next design

Write the complete hole-free textbook paragraph first. For each transition classify: known fact, reason, algebra operation, sign/endpoint, interpretation, new application. A nontrivial transition is either visible and explained or a meaningful interactive decision with individualized feedback; do not force one answer per source marker. Compare start/middle/end of each subheading, including first proof and last transfer, to an approved anchor. Visual and original source image timing have separate checks.