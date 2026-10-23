# 5件の実画面 — 一括細部確認
Status: BLOCK-CHECK-PENDING / ENGINEERING-READY
作成・限定修正と問別技術QAをまとめて行い、約5問ずつ提示するユーザー指示に従う。今回の人手回答はこの5件一括のみ。

| 番号 | 対象 | 今回の内容 | 運用 |
|---|---|---|---|
| 1 | N06 Q12 | 数学的に同じ誤答1つを別の積へ差替 | 四択の重複解消と読みやすさ |
| 2 | N05 Q06 | 平方の係数を自分で求める誤答hint | 数値4/3を先出ししない |
| 3 | N07 Q09 | 周期から倍率を考える誤答hint | 正しい倍率100を先出ししない |
| 4 | N08 Q05 | 二乗して大小を比べる誤答hint | 計算結果5/9を先出ししない |
| 5 | N14 Q16 | 左右端の代入・絶対値・端点包含の5判断 | 生徒の計算を段階に分けた既作成候補 |

共通確認: **数式と説明を読めるか／各ヒントが考え直す手掛かりになるか**。5番は左端と右端の計算をたどり、最後に両端を含むと自分で判断できるか。
返信は「5件OK」、または「番号と直したい点」を一度に。
これはGate①の細部受入であり、アプリ全体の総チェックOKやmain統合/公開への承認にはならない。

## 1 — N06 Q12 選択肢
正答 `(x+y)(x+2)(x-1)`、受入済みhint、rev3/16問を保持。旧重複wrong[2]だけを `(x+y)(x+2)(x+1)` へ差替。
![1 N06 Q12 390pxの四択](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/113298ed523af9f3523aaa1f87469fc3aa737528/work/items/W-MATH-026-n06-q12-distinct-distractor/evidence/gate1-q12-choices/wm026-q12-choices-review-choices-390.png)
[誤答保存から再回答した通常画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/113298ed523af9f3523aaa1f87469fc3aa737528/work/items/W-MATH-026-n06-q12-distinct-distractor/evidence/gate1-q12-choices/wm026-q12-choices-normal-wrong-390.png) ／ [正式確認票](../W-MATH-026-n06-q12-distinct-distractor/GATE1_N06_Q12_CHOICES_REVIEW_SHEET.md)

## 2 — N05 Q06 誤答後ヒント
> 両端の係数と文字の指数を別々に見て、それぞれ何を二乗すると元の項に戻るか確かめよう。

![2 N05 Q06 390px 誤答後](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/8a3cfc05d173a92386f5bf8244fa28a1d31fabd1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p005-p007/wm025-batch-n05-06-review-wrong-390.png)

原問20 / rev2、問題文・数式・全選択肢・正答・図・進捗は保持。[この問の全状態/幅](./evidence/gate1-p005-p007/README.md#n05-06--320px)。
## 3 — N07 Q09 誤答後ヒント
> 繰り返す数字の一周期が何桁か数えよう。その桁数だけ小数点を右へ動かして元の小数部分と揃え、差をとろう。

![3 N07 Q09 390px 誤答後](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/8a3cfc05d173a92386f5bf8244fa28a1d31fabd1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p005-p007/wm025-batch-n07-09-review-wrong-390.png)

原問14 / rev3、問題文・数式・全選択肢・正答・図・進捗は保持。[この問の全状態/幅](./evidence/gate1-p005-p007/README.md#n07-09--320px)。
## 4 — N08 Q05 誤答後ヒント
> 根号の付いた数は、二乗すると根号の中の数に戻る。もう一方も二乗し、二つの値を比べよう。両方とも非負なので大小の向きは保たれる。

![4 N08 Q05 390px 誤答後](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/8a3cfc05d173a92386f5bf8244fa28a1d31fabd1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p005-p007/wm025-batch-n08-05-review-wrong-390.png)

原問12 / rev3、問題文・数式・全選択肢・正答・図・進捗は保持。[この問の全状態/幅](./evidence/gate1-p005-p007/README.md#n08-05--320px)。

## 5 — N14 Q16 左右端を計算して含めるか判断する
左端x=−2/3: 3x−2=−4、絶対値4。右端x=2: 中身4、絶対値4。最後の「両端とも含む」は別の生徒判断。
![5 N14 Q16 完成状態・確認①②③](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1/q16-review-complete-1440.png)
[320px誤答後ヒント](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1/q16-review-wrong-320.png) ／ [390px完成状態](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1/q16-review-complete-390.png) ／ [既存正式確認票](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/b37ac791fb583d947a3044dca11372139a156d8b/work/items/W-MATH-022-n14-q16-endpoint-verification/GATE1_N14_Q16_REVIEW_SHEET.md)

## Evidence / candidate boundaries
| 番号 | 実操作・撮影source SHA | 固定画像commit | 状態 |
|---|---|---|---|
| 1 | d894e38820829c387386d207ff2d44d1ac95eebb | 113298ed523af9f3523aaa1f87469fc3aa737528 | W026 exact QA PASS、細部受入待ち |
| 2–4 | b1025cab41342b7648acb191abadfa8aaaa66e5c | 8a3cfc05d173a92386f5bf8244fa28a1d31fabd1 | W025 exact new3 QA/画像/全体CI PASS、細部受入待ち |
| 5 | e64fd99b18ba167364c2dd6b108a6f7fef76f439 | f5b15694740325b56077fe64d740c7a7dc8fb22e | W022既存QA/画像、細部受入待ち |

5番だけはN14rev10の別候補。1–4の枝はN14rev9を保つ。これらを統合済みの同じapp buildと表示しない。5番PC原画像は五判断の式を遮らず読めるため一覧主画像に選定。スマホの旧fullpage画像は固定header/skip linkが途中へ写り、一部に重なるため、数学の全体確認はPC原画像も併用する。この旧画像の配置だけから実app不具合と断定せず、全体候補の実viewport確認はGate②へ残す。元画像は加工しない。
2–4の新しいviewport画像は320/390/1440でhint全文と式が読め、末尾choicesは必要に応じ縦スクロールする。PCは高さ1400で撮影。
実装前の画像/モック/生成画像は使っていない。通常版画像も原本READMEに保持。通常の本番学習記録は触っていない。

## CI
2–4 source: Review39902362044 SUCCESS、check120246569696: 5files/41unit tests PASS（境界14件）。capture120246569941:18real cases PASS/18matrix skips、72PNG+READMEのみの子commitをcompareで検証。Gov39902362009SUCCESS。全体Math39902361997もSUCCESS、25unit files/240tests、254browser cases PASS/9explicit skips、全型/lint/build・数学/物理教科書/数学練習setup回帰を完了。
1のsource: Math39900003882/Review39900003982/Gov39900003884SUCCESS（240unit/254browser PASS、明示skip9、専用6cases）。
5のsource: 既存専用actual Chrome39752264290SUCCESS、固定15原画像。詳細は既存確認票。
Gate②は別にOPEN。5件の細部受入後、変更後影響・必須UNVERIFIED・N14候補整合を確認。Gate③は同じSHAで操作できるapp全体通し確認が未了。main統合/公開は行わない。
