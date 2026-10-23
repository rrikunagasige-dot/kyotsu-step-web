# W-MATH-017/P-003: 数と式・問題別文章統合影響監査（PRE-FLIGHT）

Status: ASSESSMENT (not implementation evidence)
Date: 2026-10-21 JST
Main SHA: `15ae503455bc6ae75b080caa1c4919cafb250027`
Review source: `src/data/textbook/math/numbers/`, `src/data/textbook/math/set/setLesson.ts`, `docs/MASTER_APP_LESSONS.md` §§8–11/52–54, `subjects/mathematics/textbook/SPEC.md` §§3–6.

## Scope and interpretation
- Reviewed source declarations for 123/123 teacher Word markers across N04/05/06/07/08/11/13/14. This is **source-structure triage**, not 123 independent live-screen reviews or 123 proven defects.
- Generator `makeReviewSteps` mechanically emits intro/lead paragraph → separate formula/question block → after paragraph. It does not implement the accepted Set-style prose-embedded decision by default. The `readingFlow` API can render `choice` in paragraphs without new global UI.
- Original source, diagrams, math keys, accepted other blocks, and prior historical Gate① remain protected. A formula block is permitted for a meaningful continuous derivation; **blanket white-box deletion is prohibited**.
- Q01/Q05 are confirmed defects; pattern matches N11 Q06/08/09/13 and N14 Q10/14/15 are **candidate impact audit cells**, not individual authorization or confirmed independent defects.
- N01/02/03/09/10/12 are compare-and-preserve scope; inspect approved handcrafted text before marking any separate issue.

## Problem-by-problem register

| Word marker | Status / current structure | Learner prompt (source excerpt) | Required judgment before edit |
| --- | --- | --- | --- |
| `N04-Q01` | HAND-AUTHORED/PRESERVE: 4-product derivation | 4 stages + final source result | Inspect current grouped derivation; not a blanket removal |
| `N04-Q02` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 欠けていた二つの交差項を同類項としてまとめよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q03` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | すべての項を係数まで整理して展開しよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q04` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 四つの積を、まだ同類項をまとめずに並べよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q05` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 和の平方の一般式を完成させよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q06` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 同類項をまとめる前の四項を書こう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q07` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 同類項をまとめた結果を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q08` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 四つの積と相殺を含む等式を書こう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q09` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 二つの式で使う公式と、対応する二つのまとまりを選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q10` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 左から順に展開結果を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N04-Q11` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 四つの積を同類項をまとめずに書こう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q12` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 一次項の係数をまとめた一般式を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q13` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 一次項を作る二つの積と、整理した展開結果をこの順で選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N04-Q14` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 和の平方の公式で展開しよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q15` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | すべての交差項を含む形を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q16` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 符号を追って展開しよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q17` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 共通する塊と符号が反対の塊を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N04-Q18` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 平方差で表した式を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q19` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 同類項を整理した結果を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q20` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 一次係数が同じになる二つの積を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q21` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | Tの二次式として展開しよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N04-Q22` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 四次式としてすべての項をまとめよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q01` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 共通因数となる括弧を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q02` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 積に戻した式を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q03` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 展開して元の式と一致する形を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q04` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | b−aをa−bの何倍と見ればよいか。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q05` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 一つの積にまとめよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q06` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 最初と最後の項をそれぞれ平方として表そう。 | Review compound decision; split only if cognitive steps independent |
| `N05-Q07` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 中央の項を計算しよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q08` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 因数分解を完成させよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q09` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 次数ごとに整理した形を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q10` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | r+sとrsが満たす条件を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N05-Q11` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 整数の組と完成した因数分解を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q12` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 三つの係数が見える形へ展開しよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q13` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | p,q,r,sについて必要な三条件を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N05-Q14` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | A、B、Cの一次係数をこの順に選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N05-Q15` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 原図の候補と因数分解の組を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q16` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 一次係数と定数項から二条件を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N05-Q17` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | rとsの符号関係と、その理由を組にして選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q18` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 両条件に一致する因数分解を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q19` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 共通因数でくくった最初の形を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N05-Q20` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | できるところまで因数分解しよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q01` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | Xの定義と置換後の式を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N06-Q02` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 同類項をまとめた二次式を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q03` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | Xを使う因数分解を完成させよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q04` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 元の文字だけで積を書こう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q05` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 置換の定義とTの二次式を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N06-Q06` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | xの式として戻した積を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q07` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 一次式の積まで因数分解しよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q08` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | xとyそれぞれの次数を比べ、低い次数で整理できる文字を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q09` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | yをくくった形を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q10` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | この部分だけを共通因数でくくろう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q11` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 共通の括弧を一度だけ外へ出そう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q12` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 因数分解を最後まで完成させよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q13` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | xについて整理した形を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q14` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 定数項の因数分解を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N06-Q15` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 和を計算し、元のxの係数に一致して因数分解に使えるか判断しよう。 | Review compound decision; split only if cognitive steps independent |
| `N06-Q16` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | xとyを含む因数分解の完成形を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q01` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 小数と、割り算が終わる位を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q02` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 二つの小数の位の「商・余り」を順に選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q03` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 繰り返し部分を含む小数表示を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q04` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 二数の小数分類と有理数かどうかを選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q05` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 余りが繰り返す理由を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q06` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 繰り返す部分がそろう最小の倍率と、掛けた後の小数を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N07-Q07` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 引き算から得られる等式を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q08` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | もとの循環小数を分数で表そう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q09` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 最小倍率、倍率後の式、引き算の結果を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N07-Q10` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 既約分数で答えよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q11` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 分母の素因数分解を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q12` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 条件を満たす整数aを漏れなく選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q13` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 二つの値と自然数かどうかを選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N07-Q14` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | この循環小数は有理数か、理由とともに選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N08-Q01` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 二点から原点までの距離を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N08-Q02` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | この場合の/a/を記号なしで書こう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N08-Q03` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 引き算から簡単にした距離を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N08-Q04` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 代入して得られる値を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N08-Q05` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 二乗した値の大小比較と、√5と3の大小関係を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N08-Q06` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | この式の符号を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N08-Q07` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 絶対値を外した式を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N08-Q08` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 差の符号と根拠を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N08-Q09` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 絶対値記号のない式で答えよう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N08-Q10` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | aの値と、数直線上で距離が0になる理由を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N08-Q11` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 原点までの距離の関係を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N08-Q12` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 絶対値の二乗をaで表そう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N11-Q01` | CONFIRMED: Q01 duplicate formula / relation type | 負の1を掛けた後の不等号を選ぼう。 | Inspect actual hand-authored block + protected gate |
| `N11-Q02` | HAND-AUTHORED/PRESERVE: compare visual | 差を整理し、変化するかどうか確かめよう。 | Inspect actual hand-authored block + protected gate |
| `N11-Q03` | HAND-AUTHORED/PRESERVE: compare visual | cの符号と不等号の対応を選ぼう。 | Inspect actual hand-authored block + protected gate |
| `N11-Q04` | HAND-AUTHORED/PRESERVE: compare visual | −a/5と−b/5、および3−aと3−bの向きを選ぼう。 | Inspect actual hand-authored block + protected gate |
| `N11-Q05` | CONFIRMED: Q05 completed answer not calculation | 両辺への操作と、変形直後の不等式を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N11-Q06` | SAME-ROOT-CANDIDATE (not individually proven) | 操作と変形結果を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N11-Q07` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 境界の値が含まれるかを選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N11-Q08` | SAME-ROOT-CANDIDATE (not individually proven) | 操作と変形結果を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N11-Q09` | SAME-ROOT-CANDIDATE (not individually proven) | 操作と変形結果を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N11-Q10` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 境界を含むかどうか、根拠とともに選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N11-Q11` | HAND-AUTHORED/PRESERVE: compare visual | 整理した不等式を選ぼう。 | Inspect actual hand-authored block + protected gate |
| `N11-Q12` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 解の範囲を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N11-Q13` | SAME-ROOT-CANDIDATE (not individually proven) | 操作と変形結果を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N11-Q14` | HAND-AUTHORED/PRESERVE: compare visual | 最終的な解の範囲を選ぼう。 | Inspect actual hand-authored block + protected gate |
| `N13-Q01` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | すべての実数解を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N13-Q02` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | Xについての二つの可能性を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N13-Q03` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | xについての二つの方程式を書こう。 | Review compound decision; split only if cognitive steps independent |
| `N13-Q04` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | xの解をすべて選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N13-Q05` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 二つの場合の式を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N13-Q06` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 絶対値なしの二つの方程式を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N13-Q07` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 両方の解を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N13-Q08` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 絶対値を外した二つの方程式と、得られた解を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N13-Q09` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | それぞれの実数解について選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N14-Q01` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 言葉で表した条件を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N14-Q02` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 二つの境界を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N14-Q03` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 残す位置と境界の扱いを選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N14-Q04` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | xについての範囲を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N14-Q05` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 境界・内外・等号の扱いを選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N14-Q06` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 残す範囲と二つの枝のつなぎ方を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N14-Q07` | HAND-AUTHORED/PRESERVE: compare visual | 絶対値なしの一つの範囲を選ぼう。 | Inspect actual hand-authored block + protected gate |
| `N14-Q08` | HAND-AUTHORED/PRESERVE: compare visual | 絶対値のない二つの範囲を選ぼう。 | Inspect actual hand-authored block + protected gate |
| `N14-Q09` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 最初に得られる二重不等式を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N14-Q10` | SAME-ROOT-CANDIDATE (not individually proven) | 操作と変形結果を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N14-Q11` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 内外と端点を判断し、絶対値を外した二条件を選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N14-Q12` | HAND-AUTHORED/PRESERVE: compare visual | 最終的な二領域を選ぼう。 | Inspect actual hand-authored block + protected gate |
| `N14-Q13` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 絶対値を外した条件を選ぼう。 | Compare prose-integrated inline choice vs justified math derivation |
| `N14-Q14` | SAME-ROOT-CANDIDATE (not individually proven) | 操作と変形結果を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N14-Q15` | SAME-ROOT-CANDIDATE (not individually proven) | 操作と変形結果を組にして選ぼう。 | Review compound decision; split only if cognitive steps independent |
| `N14-Q16` | GENERATOR-STRUCTURE/VERIFY (not automatically a defect) | 両端の代入結果を選ぼう。 | Review compound decision; split only if cognitive steps independent |

## Pre-implementation exit conditions
1. For each distinct modified question inspect actual current reading flow, accepted Set paragraph/choice pattern, original Word source and predecessor/result dependency; mark `CONFIRMED / NOT-AFFECTED / UNVERIFIED` with evidence.
2. First two confirmed cases are N11 Q01 relation and N11 Q05 operation/calculation. Recheck existing progress archive and question ID semantics before introducing a revised answer.
3. Before **each** block re-read relevant MASTER §§8–11,20,52–54, math SPEC §4 and already approved history; do not treat 123-row structural inventory as an automatic license for all 123 edits.
4. After actual implementation: exact SHA real screenshots Gate①; independent Gate② including prose flow/cognitive actions; freeze+host separately authorized exact SHA before Gate③.
