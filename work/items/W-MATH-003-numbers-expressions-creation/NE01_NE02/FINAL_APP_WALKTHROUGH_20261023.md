# アプリ全体・最終総チェック票 — 数と式

Status: FINAL-REVIEW-READY（本人の総チェックOKは未取得）

配信ソースSHA: `171c04781f32c1286a0762905891b582714834f9`。教材基準SHA: `3055ed71b25057b80b85d46b1d219f1005d0a35d`。公開許可: 2026-10-23、既存Pagesを候補版へ置換する具体的な質問へのユーザー「いいよ」。

**最初から確認する実アプリ：** [数と式の最初へ](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n01)

[配信manifest](https://rrikunagasige-dot.github.io/kyotsu-step-web/release.json)と実ソースSHAを照合済み。認証壁なし。公開URLの320px/1440pxで16単元それぞれ最初の操作の誤答→ヒント→再回答→正答→再読込、32ケース成功。普段のkyotsu-step-storeを変更せず、専用保存先 `kyotsu-step-gate3-math-20261023` を使用することを実ブラウザで確認。実画像を目視確認。実run: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39946760582 。詳細: GATE3_HOSTED_RESULTS_20261023.json。

この公開後検査は各単元の最初の操作であり、ユーザー全315操作の通しプレイの代替ではない。教材本体の全315操作×3幅・全章の自動検査は基準SHA3055の別記録に保持。配信ソースとの差は任意の保存キー指定だけで、他のsrcが一致することもworkflowで検査済み。

Gate①新規25問はユーザー「そうだねよろしく」で受入済み。既存14単元の受入は保持。Gate②CROSS-VERIFIED。mainへの教材mergeは行わず、mainの配信workflowから固定候補を公開した。

## 本人の通し確認

今回の範囲は数学・学習モード「数と式」全16単元・233原問・315操作です。下表のすべてを最初から最後まで確認してください。各問題の誤答時のヒントと再回答、正答後の式と次へのつながり、戻る・再読み込み・保存・初期化、スマホとPCを確認します。他の数学章・物理・練習は自動回帰済みですが、この章のプレイでそれらまで本人受入済みとは扱いません。

| 単元 | 全操作ID | 本人の結果 |
|---|---|---|
| [N01（18操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n01) | `n01-01`、`n01-02a`、`n01-02b`、`n01-02c`、`n01-03`、`n01-04`、`n01-05`、`n01-06a`、`n01-06b`、`n01-r3-q07-x2coef`、`n01-r3-q07-xcoef`、`n01-r3-q07-const`、`n01-07`、`n01-08`、`n01-09a`、`n01-09b`、`n01-10a`、`n01-10b` | PENDING |
| [N02（12操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n02) | `n02-01`、`n02-02`、`n02-03`、`n02-04`、`n02-05`、`n02-06`、`n02-07`、`n02-08`、`n02-09`、`n02-10`、`n02-11`、`n02-12` | PENDING |
| [N03（17操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n03) | `n03-01`、`n03-02`、`n03-03`、`n03-04`、`n03-05`、`n03-06`、`n03-07`、`n03-08`、`n03-09`、`n03-r3-q10-p1`、`n03-r3-q10-p2`、`n03-r3-q10-p3`、`n03-r3-q10-p4`、`n03-10`、`n03-11`、`n03-12`、`n03-13` | PENDING |
| [N04（26操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n04) | `n04-q01-p1`、`n04-q01-p2`、`n04-q01-p3`、`n04-q01-p4`、`n04-01`、`n04-02`、`n04-03`、`n04-04`、`n04-05`、`n04-06`、`n04-07`、`n04-08`、`n04-09`、`n04-10`、`n04-11`、`n04-12`、`n04-13`、`n04-14`、`n04-15`、`n04-16`、`n04-17`、`n04-18`、`n04-19`、`n04-20`、`n04-21`、`n04-22` | PENDING |
| [N05（20操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n05) | `n05-01`、`n05-02`、`n05-03`、`n05-04`、`n05-05`、`n05-06`、`n05-07`、`n05-08`、`n05-09`、`n05-10`、`n05-11`、`n05-12`、`n05-13`、`n05-14`、`n05-15`、`n05-16`、`n05-17`、`n05-18`、`n05-19`、`n05-20` | PENDING |
| [N06（16操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n06) | `n06-01`、`n06-02`、`n06-03`、`n06-04`、`n06-05`、`n06-06`、`n06-07`、`n06-08`、`n06-09`、`n06-10`、`n06-11`、`n06-12`、`n06-13`、`n06-14`、`n06-15`、`n06-16` | PENDING |
| [N07（14操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n07) | `n07-01`、`n07-02`、`n07-03`、`n07-04`、`n07-05`、`n07-06`、`n07-07`、`n07-08`、`n07-09`、`n07-10`、`n07-11`、`n07-12`、`n07-13`、`n07-14` | PENDING |
| [N08（12操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n08) | `n08-01`、`n08-02`、`n08-03`、`n08-04`、`n08-05`、`n08-06`、`n08-07`、`n08-08`、`n08-09`、`n08-10`、`n08-11`、`n08-12` | PENDING |
| [N09（18操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n09) | `n09-01`、`n09-02`、`n09-03`、`n09-04`、`n09-05`、`n09-06`、`n09-07`、`n09-p001-q08-left-square`、`n09-p001-q08-right-square`、`n09-p001-q08-lower-sign`、`n09-p001-q08-upper-sign`、`n09-08`、`n09-09`、`n09-10`、`n09-11`、`n09-12`、`n09-13`、`n09-14` | PENDING |
| [N10（21操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n10) | `n10-01`、`n10-02`、`n10-03`、`n10-04`、`n10-05`、`n10-06`、`n10-07`、`n10-08`、`n10-09`、`n10-10`、`n10-11`、`n10-12`、`n10-13`、`n10-14`、`n10-15`、`n10-16`、`n10-17`、`n10-18`、`n10-19`、`n10-20`、`n10-21` | PENDING |
| [N11（31操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n11) | `n11-01`、`n11-02`、`n11-wm011-q02-compare`、`n11-wm011-q03-factor`、`n11-wm011-q03-positive`、`n11-03`、`n11-wm011-q03-zero`、`n11-wm011-q04-fraction`、`n11-04`、`n11-wm017-q05-operation`、`n11-wm017-q05-balance`、`n11-05`、`n11-06`、`n11-07`、`n11-p007-q08-subtract-left`、`n11-p007-q08-subtract-right`、`n11-08`、`n11-p007-q09-direction`、`n11-09`、`n11-10`、`n11-wm012-q11-expand`、`n11-wm012-q11-xcoef`、`n11-11`、`n11-12`、`n11-p008-q13-mul-left`、`n11-p008-q13-mul-right`、`n11-13`、`n11-p008-q13-constant`、`n11-wm013-q14-xcoef`、`n11-wm013-q14-const`、`n11-14` | PENDING |
| [N12（35操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n12) | `n12-p002-q01-coef`、`n12-p002-q01-const`、`n12-01`、`n12-p002-q02-coef`、`n12-p002-q02-const`、`n12-02`、`n12-03`、`n12-04`、`n12-05`、`n12-p002-q06-left-coef`、`n12-p002-q06-left-const`、`n12-p002-q06-right-coef`、`n12-p002-q06-right-const`、`n12-06`、`n12-07`、`n12-08`、`n12-09`、`n12-p003-q10-meaning`、`n12-p003-q10-cream-coef`、`n12-p003-q10-pudding-coef`、`n12-p003-q10-box-fee`、`n12-10`、`n12-p003-q11-lower-sign`、`n12-p003-q11-upper-sign`、`n12-11`、`n12-p003-q12-product-constant`、`n12-p002-q12-signed-coef`、`n12-p003-q12-total-constant`、`n12-p003-q12-x-coef`、`n12-12`、`n12-p002-q13-lower`、`n12-p002-q13-upper`、`n12-13`、`n12-14`、`n12-15` | PENDING |
| [N13（12操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n13) | `n13-01`、`n13-02`、`n13-03`、`n13-04`、`n13-wm023-q05-right`、`n13-05`、`n13-06`、`n13-07`、`n13-wm023-q08-branches`、`n13-wm023-q08-positive-root`、`n13-08`、`n13-09` | PENDING |
| [N14（38操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n14) | `n14-01`、`n14-02`、`n14-03`、`n14-04`、`n14-05`、`n14-06`、`n14-wm014-q07-nonnegative`、`n14-wm014-q07-negative`、`n14-07`、`n14-wm015-q08-nonnegative`、`n14-wm015-q08-negative`、`n14-08`、`n14-09`、`n14-wm018-q10-add-left`、`n14-wm018-q10-add-center`、`n14-wm018-q10-add-right`、`n14-10`、`n14-wm018-q10-bound-right`、`n14-11`、`n14-wm016-q12-left`、`n14-wm016-q12-right`、`n14-12`、`n14-13`、`n14-wm019-q14-add-left`、`n14-wm019-q14-add-center`、`n14-wm019-q14-add-right`、`n14-14`、`n14-wm019-q14-bound-right`、`n14-wm020-q15-divide-left`、`n14-wm020-q15-divide-center`、`n14-wm020-q15-divide-right`、`n14-15`、`n14-wm020-q15-bound-right`、`n14-wm022-q16-left-inner`、`n14-wm022-q16-left-abs`、`n14-wm022-q16-right-inner`、`n14-wm022-q16-right-abs`、`n14-16` | PENDING |
| [NE01（13操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-ne01) | `ne01-01`、`ne01-02`、`ne01-03`、`ne01-04`、`ne01-05`、`ne01-06`、`ne01-07`、`ne01-08`、`ne01-09`、`ne01-10`、`ne01-11`、`ne01-12`、`ne01-13` | PENDING |
| [NE02（12操作）](https://rrikunagasige-dot.github.io/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-ne02) | `ne02-01`、`ne02-02`、`ne02-03`、`ne02-04`、`ne02-05`、`ne02-06`、`ne02-07`、`ne02-08`、`ne02-09`、`ne02-10`、`ne02-11`、`ne02-12` | PENDING |

未訪問はPENDINGのままです。全章を確認して問題なければ **総チェックOK**、問題があれば **要修正：単元・問・症状** と返信してください。候補版の公開成功・自動テスト・個別の見た目承認だけでFINAL-APP-ACCEPTEDとはしません。
