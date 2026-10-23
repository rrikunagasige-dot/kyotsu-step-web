# ヒント7件の一括確認

Status: BLOCK-CHECK-PENDING / implementation APPROVED, implemented and native browser tested.

ユーザー「まとめて修正してくれ」により、P008–P014の提示済み7文のみ修正。既承認5件は受入済みを維持。

実操作ソース: `22ccf559a70d758689b958c77d19f4c9cdd43b7e`。原画像保存コミット: `97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b`（直接の親は実操作ソース）。画像はChromium実操作の原PNG、加工なし。各画像内の黄色い「確認①」が対象。下の1〜7はこのレビュー表の番号。

見る点: 数式と説明のつながり／ヒントが答えを先に示さず手順を案内すること／日本語の読みやすさ。実画面の誤答→ヒント→再挑戦、保存・再読込、単元完了は自動操作で別途確認。

## 1. N04 Q20 — P008

Stable block: `n04-formula-20` / review target: `n04-q20-hint`.

ヒント: 二つずつ組にして展開したとき、xの係数が何の和になるか考えよう。その和が同じになる組合せを探そう。

![1 N04Q20 新ヒント実画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p008-p014/wm025-seven-n04-20-review-wrong-1440.png)

[390px原画像](./evidence/gate1-p008-p014/wm025-seven-n04-20-review-wrong-390.png) / [320px原画像](./evidence/gate1-p008-p014/wm025-seven-n04-20-review-wrong-320.png)

## 2. N04 Q22 — P013

Stable block: `n04-formula-22` / review target: `n04-q22-hint`.

ヒント: 二乗の公式でT²を展開し、それから一次のTの項も元の式へ戻そう。同じ次数の項を集め、各係数を自分で計算しよう。

![2 N04Q22 新ヒント実画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p008-p014/wm025-seven-n04-22-review-wrong-1440.png)

[390px原画像](./evidence/gate1-p008-p014/wm025-seven-n04-22-review-wrong-390.png) / [320px原画像](./evidence/gate1-p008-p014/wm025-seven-n04-22-review-wrong-320.png)

## 3. N07 Q11 — P014

Stable block: `n07-formula-11` / review target: `n07-q11-hint`.

ヒント: 10を素数の積に分け、同じ積をk回掛けた形を考えよう。それぞれの素数が何回ずつ掛かるかを数え、指数で表そう。

![3 N07Q11 新ヒント実画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p008-p014/wm025-seven-n07-11-review-wrong-1440.png)

[390px原画像](./evidence/gate1-p008-p014/wm025-seven-n07-11-review-wrong-390.png) / [320px原画像](./evidence/gate1-p008-p014/wm025-seven-n07-11-review-wrong-320.png)

## 4. N10 Q07 — P009

Stable block: `formula-n10-07` / review target: `n10-q07-hint`.

ヒント: まず根号の中の数どうしを掛けよう。得られた数を、できるだけ大きい平方数と残りの因子の積に分けよう。

![4 N10Q7 新ヒント実画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p008-p014/wm025-seven-n10-07-review-wrong-1440.png)

[390px原画像](./evidence/gate1-p008-p014/wm025-seven-n10-07-review-wrong-390.png) / [320px原画像](./evidence/gate1-p008-p014/wm025-seven-n10-07-review-wrong-320.png)

## 5. N10 Q08 — P010

Stable block: `formula-n10-08` / review target: `n10-q08-hint`.

ヒント: 前の式で見つけた平方数が、何を二乗した数か確かめよう。その平方根を根号の外へ出し、残りの因子は根号の中に残そう。

![5 N10Q8 新ヒント実画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p008-p014/wm025-seven-n10-08-review-wrong-1440.png)

[390px原画像](./evidence/gate1-p008-p014/wm025-seven-n10-08-review-wrong-390.png) / [320px原画像](./evidence/gate1-p008-p014/wm025-seven-n10-08-review-wrong-320.png)

## 6. N12 Q06（係数欄） — P011

Stable block: `formula-q06-left-coef` / review target: `n12-q06-coef-hint`.

ヒント: 両辺から同じ文字の項を引くと、係数どうしの引き算になる。文字xを残したまま、係数だけを計算しよう。

![6 N12Q6 新ヒント実画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p008-p014/wm025-seven-n12-p002-q06-left-coef-review-wrong-1440.png)

[390px原画像](./evidence/gate1-p008-p014/wm025-seven-n12-p002-q06-left-coef-review-wrong-390.png) / [320px原画像](./evidence/gate1-p008-p014/wm025-seven-n12-p002-q06-left-coef-review-wrong-320.png)

## 7. N12 Q12（係数欄） — P012

Stable block: `formula-q12-signed-coef` / review target: `n12-q12-coef-hint`.

ヒント: 括弧の外の正の数を、括弧内の負の項にも掛けよう。係数の大きさと符号を別々に確かめ、文字xを除いた数を選ぼう。

![7 N12Q12 新ヒント実画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/97ed3d8e4a03ec4a6af8cc96987f79f5ba31aa3b/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-p008-p014/wm025-seven-n12-p002-q12-signed-coef-review-wrong-1440.png)

[390px原画像](./evidence/gate1-p008-p014/wm025-seven-n12-p002-q12-signed-coef-review-wrong-390.png) / [320px原画像](./evidence/gate1-p008-p014/wm025-seven-n12-p002-q12-signed-coef-review-wrong-320.png)

## 表示の残課題と確認範囲

320px/390pxでは縦にスクロールして読む。N12Q06の長い数式は320/390px、N12Q12も320pxで左側が画面外になる原画像を確認した。数式欄の水平位置・フォーカスとの関係は未診断で、モバイル表示の合格とはしない。共通描画は今回変更していない。PC画像は式全体と新ヒントを示す。長い選択肢も狭幅では全体が同時に見えない場合がある。別途原因調査・修正提案が必要。

7件の画像受入は[WORK_SYSTEM §12A](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/22ccf559a70d758689b958c77d19f4c9cdd43b7e/governance/WORK_SYSTEM.md)に従い「7件OK」または「番号＋修正点」でまとめて回答。これは新7件の視覚確認で、過去5件の再承認やmain統合・公開の承認ではない。

[全168枚・通常/確認画面・誤答前後と完了](./evidence/gate1-p008-p014/README.md) / [PNGハッシュ](./evidence/gate1-p008-p014/SHA256SUMS.txt)

全章Gate②はOPEN、Gate③はFINAL-REVIEW-NOT-READY。既存14単元208原問/290採点欄、未作成NE01 13原問＋NE02 12原問＝2単元25原問。
