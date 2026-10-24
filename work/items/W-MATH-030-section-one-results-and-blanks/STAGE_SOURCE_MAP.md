# 現行71段階との対応表

W-MATH-030 / P-003。現行データから抽出した照合資料。実装データではない。段階番号は各単元の詳細設計と対応。既存の設問は、詳細設計で明示した移設・置換・分割以外を維持する。

## N01

| 段階 | 現行anchor ID | 現行の回答箇所ID | 現行の前段階参照ID |
|---|---|---|---|
| 01 数と文字に分けて読む | `heading-factors` | `n01-01`、`n01-bridge-r3-negative-coefficient`、`n01-bridge-r3-negative-degree`、`n01-bridge-r3-square-coefficient`、`n01-bridge-r3-square-degree`、`n01-bridge-r3-product-coefficient`、`n01-bridge-r3-product-degree` | なし |
| 02 注目する文字を変える | `heading-variable` | `n01-03`、`n01-s4-y-coefficient`、`n01-s4-y-degree` | なし |
| 03 別の式へ使う | `marker-variable-check` | `n01-s4-axy-x`、`n01-s4-axy-y` | なし |
| 04 問題と整理の見通し | `heading-like-terms` | なし | なし |
| 05 二次の項をまとめる | `n01-s4-like-square` | `n01-06a`、`n01-r3-q07-x2coef` | なし |
| 06 一次の項をまとめる | `n01-s4-like-linear` | `n01-r3-q07-xcoef` | `formula-like-original` |
| 07 定数項をまとめる | `n01-s4-like-constant` | `n01-r3-q07-const` | `formula-like-original` |
| 08 結果を戻して式を読む | `n01-s4-like-assembly` | `n01-s4-like-degree`、`n01-s4-like-constant` | `n01-s4-square-result`、`n01-s4-linear-result`、`n01-s4-constant-result` |
| 09 例題と解き方の見通し | `marker-degree-check` | なし | なし |
| 10 ① 一次の項をまとめる | `n01-r3-linear-heading` | `n01-bridge-r3-linear` | `formula-cancellation-original` |
| 11 ② 二次の項を確かめる | `n01-r3-quadratic-heading` | なし | `formula-cancellation-original` |
| 12 ③ 三次の項をまとめる | `n01-r3-cubic-heading` | `n01-bridge-r3-cubic` | `formula-cancellation-original` |
| 13 ④ 定数項を確かめる | `n01-r3-constant-heading` | なし | `formula-cancellation-original` |
| 14 ⑤ 式全体をまとめる | `n01-r3-assembly-heading` | `n01-bridge-r3-reuse` | なし |
| 15 整理後の次数を読む | `n01-r3-interpret-heading` | `n01-10a`、`n01-10b` | `n01-r3-final-equation` |

## N02

| 段階 | 現行anchor ID | 現行の回答箇所ID | 現行の前段階参照ID |
|---|---|---|---|
| 01 注目文字と整理 | `heading-variable` | `n02-bridge-audit-like-b`、`n02-01`、`n02-02` | なし |
| 02 文字式の係数を作る | `marker-variable-check` | `n02-bridge-detail-linear-coefficient`、`n02-bridge-audit-constant-part`、`n02-s4-reuse-linear` | なし |
| 03 次数をそろえて足す | `heading-add` | `n02-05`、`n02-bridge-audit-sum-cube`、`n02-bridge-audit-sum-square`、`n02-bridge-audit-sum-linear`、`n02-bridge-audit-sum-constant` | なし |
| 04 −Bを完成させる | `heading-minus` | `n02-bridge-audit-minus-cube-sign`、`n02-bridge-audit-minus-square-sign`、`n02-bridge-audit-minus-constant-sign` | `formula-ab-definition` |
| 05 Aに−Bを足す | `paragraph-minus-add` | `n02-bridge-audit-diff-cube`、`n02-bridge-audit-diff-square`、`n02-bridge-audit-diff-linear`、`n02-bridge-audit-diff-constant` | `formula-ab-definition`、`formula-n02-07` |
| 06 2Aを完成させる | `marker-multiply-check` | `n02-bridge-distribute`、`n02-bridge-detail-cube-coefficient`、`n02-bridge-detail-signed-coefficient`、`n02-bridge-audit-twice-linear`、`n02-bridge-audit-twice-constant` | `formula-ab-definition` |
| 07 −3Bを完成させる | `n02-s4-minus-three-goal` | `n02-bridge-minus-multiplier`、`n02-bridge-minus-cube`、`n02-bridge-minus-square`、`n02-bridge-minus-constant` | `formula-ab-definition` |
| 08 二式の結果を足す | `paragraph-multiple-collect` | `n02-bridge-cube-sum`、`n02-bridge-like-square`、`n02-bridge-square-sum`、`n02-bridge-constant-sum` | `n02-s4-twice-result`、`formula-n02-09` |
| 09 AとBのまま整理して再利用 | `heading-structure` | `n02-bridge-outer-minus`、`n02-bridge-audit-a-coefficient`、`n02-bridge-audit-b-coefficient`、`n02-12` | `formula-n02-10` |

## N03

| 段階 | 現行anchor ID | 現行の回答箇所ID | 現行の前段階参照ID |
|---|---|---|---|
| 01 個数から指数法則を作る | `heading-indices` | `n03-bridge-audit-count-a`、`n03-01`、`n03-02`、`n03-03`、`n03-04` | なし |
| 02 係数と文字を分けて累乗する | `marker-powers-check` | `n03-05`、`n03-bridge-detail-negative-pair`、`n03-bridge-negative-cube`、`n03-bridge-x-power`、`n03-bridge-detail-y-power`、`n03-06` | なし |
| 03 三つの積を順に作る | `heading-distribute` | `n03-07`、`n03-bridge-audit-product-fourth`、`n03-s4-product-exponent`、`n03-bridge-audit-product-negative`、`n03-bridge-audit-product-last`、`n03-08` | なし |
| 04 図で四つの積を対応させる | `paragraph-two-brackets` | `n03-09`、`n03-r3-q10-p1`、`n03-r3-q10-p2`、`n03-r3-q10-p3`、`n03-r3-q10-p4`、`n03-10`、`n03-bridge-audit-grid-collect`、`n03-11` | なし |
| 05 二項×三項の見通し | `marker-final-check` | `n03-12` | なし |
| 06 3xを掛けた行を作る | `n03-bridge-explain-n03-13-before` | `n03-bridge-detail-first-product`、`n03-bridge-detail-second-product`、`n03-bridge-detail-third-product`、`n03-bridge-first-row` | `formula-n03-12` |
| 07 −1を掛けた行を作る | `n03-bridge-second-row-lead` | `n03-bridge-audit-minus-minus`、`n03-bridge-second-row`、`n03-bridge-collect-square`、`n03-bridge-collect-linear`、`n03-13` | `formula-n03-12`、`n03-bridge-first-row-formula` |

## N04

| 段階 | 現行anchor ID | 現行の回答箇所ID | 現行の前段階参照ID |
|---|---|---|---|
| 01 具体的な平方と四つの積 | `heading-four-products` | `n04-q01-p1`、`n04-q01-p2`、`n04-q01-p3`、`n04-q01-p4`、`n04-01` | なし |
| 02 和の平方を一般化する | `n04-heading-1` | `n04-02`、`n04-03`、`n04-04`、`n04-bridge-audit-square-cross-count`、`n04-05` | なし |
| 03 差の平方を四組から導く | `n04-lead-06` | `n04-bridge-audit-negative-cross-sign`、`n04-bridge-audit-negative-square-sign`、`n04-06`、`n04-bridge-audit-negative-cross-sum`、`n04-07` | `n04-formula-05` |
| 04 和と差の積を導く | `n04-lead-08` | `n04-bridge-audit-opposite-cancel`、`n04-08` | `n04-formula-05` |
| 05 一問目：平方の式を調べる | `n04-heading-2` | `n04-s4-square-rule`、`n04-bridge-formula-substitute`、`n04-bridge-audit-square-2a`、`n04-bridge-cross-coefficient` | `n04-formula-07` |
| 06 二問目：二つの括弧を調べる | `n04-s4-product-heading` | `n04-s4-product-rule`、`n04-bridge-audit-square-3x` | `n04-formula-08` |
| 07 一般の一次式と係数 | `n04-lead-11` | `n04-11`、`n04-bridge-audit-general-linear`、`n04-12`、`n04-bridge-audit-concrete-cross`、`n04-bridge-audit-concrete-linear` | なし |
| 08 三項の平方と復元 | `n04-s4-three-goal` | `n04-14`、`n04-bridge-restore-t`、`n04-bridge-expand-restored`、`n04-15`、`n04-bridge-audit-minus-ac`、`n04-bridge-audit-minus-bc`、`n04-16` | `n04-formula-05` |
| 09 二つの括弧を比較する | `n04-heading-3` | `n04-s4-shared-part`、`n04-s4-opposite-part`、`n04-18`、`n04-bridge-audit-remaining-square`、`n04-19` | なし |
| 10 四因子を二組に分ける | `n04-lead-20` | `n04-bridge-pairing`、`n04-bridge-pair-first`、`n04-bridge-pair-second`、`n04-20` | なし |
| 11 共通部分をTと置いて展開 | `n04-lead-21` | `n04-bridge-audit-t-linear`、`n04-21` | `n04-formula-20` |
| 12 xへ戻して元の問題を終える | `n04-lead-22` | `n04-bridge-detail-square-cross`、`n04-bridge-detail-square-last`、`n04-bridge-restore-square`、`n04-bridge-audit-ten-linear`、`n04-bridge-restore-ten`、`n04-bridge-restore-collect`、`n04-22` | `n04-lead-21`、`n04-formula-21` |

## N05

| 段階 | 現行anchor ID | 現行の回答箇所ID | 現行の前段階参照ID |
|---|---|---|---|
| 01 共通因数をくくり、検算する | `n05-heading-1` | `n05-01`、`n05-bridge-detail-coefficient-factor`、`n05-bridge-factor-t`、`n05-02`、`n05-bridge-audit-reverse-constant`、`n05-03` | なし |
| 02 符号をそろえて共通因数を作る | `n05-lead-04` | `n05-05` | なし |
| 03 平方の候補と中央項を比べる | `n05-heading-2` | `n05-bridge-audit-positive-root-16`、`n05-bridge-audit-positive-root-9`、`n05-07`、`n05-08` | なし |
| 04 展開から和と積の条件を作る | `n05-lead-09` | `n05-09`、`n05-s4-factor-sum`、`n05-s4-factor-product`、`n05-bridge-factor-candidates-1`、`n05-bridge-factor-candidates-2`、`n05-bridge-factor-candidates-3`、`n05-bridge-audit-factor-pair-select`、`n05-11` | なし |
| 05 一般の係数と三条件 | `n05-heading-3` | `n05-12`、`n05-s4-quadratic-condition`、`n05-s4-constant-condition`、`n05-s4-linear-condition` | なし |
| 06 候補を比較して積を決める | `n05-s4-candidate-heading` | `n05-bridge-cross-a`、`n05-bridge-cross-b`、`n05-bridge-cross-c`、`n05-15` | `n05-formula-13` |
| 07 条件を立てる練習 | `n05-heading-4` | `n05-s4-last-linear-condition`、`n05-s4-last-constant-condition`、`n05-17` | なし |
| 08 四候補を比較して元へ戻す | `n05-lead-18` | `n05-bridge-search-rs-1`、`n05-bridge-search-rs-2`、`n05-bridge-search-rs-3`、`n05-bridge-search-rs-4`、`n05-bridge-select-rs`、`n05-18` | `n05-formula-16` |
| 09 共通因数の後も分解する | `n05-lead-19` | `n05-s4-common-factor`、`n05-bridge-audit-common-negative-four`、`n05-19`、`n05-bridge-audit-square-root-four`、`n05-20` | なし |

## N06

| 段階 | 現行anchor ID | 現行の回答箇所ID | 現行の前段階参照ID |
|---|---|---|---|
| 01 因数分解の目標と置換 | `n06-heading-1` | `n06-s4-substitution-part`、`n06-bridge-x-expand`、`n06-bridge-audit-x-linear-sum`、`n06-bridge-audit-x-constant-sum`、`n06-02` | なし |
| 02 Xで因数分解し、元へ戻す | `n06-s4-pair-method` | `n06-bridge-x-pair`、`n06-03`、`n06-bridge-audit-restore-x-first`、`n06-bridge-audit-restore-x-second`、`n06-04` | `n06-formula-01`、`n06-formula-02` |
| 03 四次式の繰り返しを見つける | `n06-heading-2` | `n06-s4-fourth-substitution`、`n06-bridge-t-pair`、`n06-bridge-t-factor`、`n06-bridge-detail-restore-first`、`n06-bridge-detail-restore-second`、`n06-06` | なし |
| 04 残る因子も最後まで分解する | `n06-lead-07` | `n06-bridge-detail-difference-first`、`n06-bridge-detail-difference-second`、`n06-07` | `n06-formula-06` |
| 05 二つの文字の次数を比べる | `n06-heading-3` | `n06-s4-x-degree`、`n06-s4-y-degree`、`n06-s4-choose-variable` | なし |
| 06 yを含む部分と残りをまとめる | `n06-lead-09` | `n06-bridge-audit-y-coefficient`、`n06-09`、`n06-10` | `n06-lead-08` |
| 07 共通因数を使って全体を分解する | `n06-lead-11` | `n06-11`、`n06-bridge-last-pair`、`n06-12` | `n06-formula-09`、`n06-formula-10` |
| 08 xの二次式として条件を作る | `n06-heading-4` | `n06-bridge-audit-x-coefficient`、`n06-13` | なし |
| 09 定数部分の二因子を探す | `n06-lead-14` | `n06-bridge-audit-constant-pair`、`n06-14` | `n06-formula-13`、`n06-s4-factor-rule` |
| 10 和も照合し、元の式へ戻す | `n06-lead-15` | `n06-bridge-audit-sum-y-coefficient`、`n06-bridge-audit-sum-y-constant`、`n06-s4-sum-match`、`n06-16` | `n06-formula-13`、`n06-formula-14`、`n06-s4-factor-rule` |

## NE01

| 段階 | 現行anchor ID | 現行の回答箇所ID | 現行の前段階参照ID |
|---|---|---|---|
| 01 平方から具体的な三乗へ | `ne01-heading-01` | `ne01-01` | なし |
| 02 二つの行を作ってまとめる | `ne01-lead-02` | `ne01-bridge-audit-collect-square`、`ne01-bridge-audit-collect-linear`、`ne01-02` | `ne01-formula-01` |
| 03 和の三乗を一般化する | `ne01-heading-03` | `ne01-03`、`ne01-04`、`ne01-bridge-audit-general-first-middle`、`ne01-bridge-audit-general-second-middle`、`ne01-05` | なし |
| 04 負の式を代入して差の三乗へ | `ne01-lead-06` | `ne01-bridge-negative-substitute`、`ne01-bridge-detail-even-coefficient`、`ne01-bridge-detail-odd-coefficient`、`ne01-06` | `ne01-formula-05` |
| 05 具体式を左から計算する | `ne01-heading-07` | `ne01-bridge-concrete-substitute`、`ne01-bridge-detail-quadratic-coefficient`、`ne01-bridge-linear-number`、`ne01-bridge-detail-constant-power`、`ne01-07` | `ne01-formula-06` |
| 06 三乗の和を積へ戻す | `ne01-heading-08` | `ne01-08`、`ne01-09`、`ne01-bridge-audit-cube-factor-middle`、`ne01-10` | なし |
| 07 三乗の差を因数分解する | `ne01-lead-11` | `ne01-bridge-difference-substitute`、`ne01-11` | `ne01-formula-10` |
| 08 一問目：x³−1を因数分解する | `ne01-heading-12` | `ne01-s4-difference-rule`、`ne01-bridge-factor-difference` | `ne01-formula-11` |
| 09 二問目：二項を三乗の形へ | `ne01-s4-second-factor-heading` | `ne01-bridge-audit-cube-root-eight`、`ne01-bridge-audit-cube-root-twentyseven`、`ne01-s4-sum-rule`、`ne01-bridge-factor-sum-substitute`、`ne01-bridge-audit-cube-factor-square-a`、`ne01-bridge-audit-cube-factor-product`、`ne01-bridge-audit-cube-factor-square-b` | `ne01-formula-10` |

