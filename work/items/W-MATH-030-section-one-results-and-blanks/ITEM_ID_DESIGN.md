# 回答箇所ID・移行設計

W-MATH-030 / P-003。下記は設計用の予約ID。現行のアプリには追加していない。

同じIDを使うのは移設・表示修正のみ。置換・分割では旧設問の回答を保存したまま、新しいIDの回答を未回答にする。次表にない現行設問は維持する。

## N01

回答操作数の見込み：23 → 27（純増4）。

| 設計箇所 | 改修後のID | 扱い | 対応する既存ID |
|---|---|---|---|
| D01 | `n01-s4-y-coefficient` | 移設 | `n01-s4-y-coefficient` |
| D02 | `n01-s5-square-regroup` | 新規 | なし |
| D03 | `n01-s5-linear-regroup` | 新規 | なし |
| D04 | `n01-s5-example-linear-regroup` | 新規 | なし |
| D05 | `n01-s5-example-cubic-regroup` | 新規 | なし |

## N02

回答操作数の見込み：35 → 40（純増5）。

| 設計箇所 | 改修後のID | 扱い | 対応する既存ID |
|---|---|---|---|
| D01 | `n02-s5-classify-linear` | 新規 | なし |
| D02 | `n02-s5-sum-square-regroup` | 新規 | なし |
| D03 | `n02-s5-minus-distribute` | 新規 | なし |
| D04 | `n02-s5-minus-three-square-distribute` | 新規 | なし |
| D05 | `n02-bridge-like-square` | 表示修正 | `n02-bridge-like-square` |
| D06 | `n02-s5-group-a-coefficients` | 新規 | なし |

## N03

回答操作数の見込み：35 → 39（純増4）。

| 設計箇所 | 改修後のID | 扱い | 対応する既存ID |
|---|---|---|---|
| D01 | `n03-s5-cube-x-count` | 新規 | なし |
| D02 | `n03-12` | 表示修正 | `n03-12` |
| D03 | `n03-s5-minus-row-distribute` | 新規 | なし |
| D04 | `n03-s5-collect-square-terms` | 新規 | なし |
| D05 | `n03-s5-collect-linear-terms` | 新規 | なし |

## N04

回答操作数の見込み：53 → 59（純増6）。

| 設計箇所 | 改修後のID | 扱い | 対応する既存ID |
|---|---|---|---|
| D01 | `n04-s5-cross-regroup` | 新規 | なし |
| D02 | `n04-s5-product-substitute` | 新規 | なし |
| D03 | `n04-s5-three-substitute` | 新規 | なし |
| D04 | `n04-s5-negative-c-substitute` | 新規 | なし |
| D05 | `n04-s4-shared-part` | 表示修正 | `n04-s4-shared-part` |
| D06 | `n04-s5-four-substitute` | 新規 | なし |
| D07 | `n04-s5-four-restore-square` | 新規 | なし |

## N05

回答操作数の見込み：41 → 45（純増4）。

| 設計箇所 | 改修後のID | 扱い | 対応する既存ID |
|---|---|---|---|
| D01 | `n05-s5-reverse-difference` | 新規 | なし |
| D02 | `n05-s5-sum-condition-map` | 置換 | `n05-s4-factor-sum` |
| D03 | `n05-s5-general-cross-regroup` | 新規 | なし |
| D04 | `n05-s5-linear-condition-map` | 置換 | `n05-s4-linear-condition` |
| D05 | `n05-s5-last-linear-regroup` | 新規 | なし |
| D06 | `n05-s5-last-condition-map` | 置換 | `n05-s4-last-linear-condition` |
| D07 | `n05-s5-square-difference-rewrite` | 新規 | なし |

## N06

回答操作数の見込み：36 → 41（純増5）。

| 設計箇所 | 改修後のID | 扱い | 対応する既存ID |
|---|---|---|---|
| D01 | `n06-s5-substitute-whole` | 新規 | なし |
| D02 | `n06-s5-classify-y` | 新規 | なし |
| D03 | `n06-11` | 表示修正 | `n06-11` |
| D04 | `n06-s5-classify-x` | 新規 | なし |
| D05 | `n06-s5-constant-linear-condition` | 新規 | なし |
| D06 | `n06-s5-factor-sum-target` | 置換 | `n06-s4-sum-match` |
| D07 | `n06-s5-restore-coefficient-sum` | 新規 | なし |

## NE01

回答操作数の見込み：33 → 40（純増7）。

| 設計箇所 | 改修後のID | 扱い | 対応する既存ID |
|---|---|---|---|
| D01 | `ne01-s5-cube-as-square` | 新規 | なし |
| D02 | `ne01-s5-concrete-second-distribute` | 新規 | なし |
| D03 | `ne01-s5-concrete-square-terms` | 新規 | なし |
| D04 | `ne01-s5-general-a2b-terms` | 新規 | なし |
| D05 | `ne01-s5-general-ab2-terms` | 新規 | なし |
| D06 | `ne01-s5-factor-common-remainder` | 置換 | `ne01-09` |
| D07 | `ne01-s5-difference-substitute` | 新規 | なし |
| D08a | `ne01-s5-sum-linear-factor` | 分割 | `ne01-bridge-factor-sum-substitute` |
| D08b | `ne01-s5-sum-quadratic-substitute` | 分割 | `ne01-bridge-factor-sum-substitute` |

## 集計

設計回答位置46。既存の回答操作256から291へ、純増35。NE01のD08a/bは、同じ一つの旧設問を二つへ分けるため、旧設問の廃止は一回だけ数える。

旧回答の履歴は残し、学習の完了状態は新しい設問の解決状況から再判定する。途中のページで新規設問が発生した利用者が、未回答のまま最終完了と表示されないことを実装後に確認する。
