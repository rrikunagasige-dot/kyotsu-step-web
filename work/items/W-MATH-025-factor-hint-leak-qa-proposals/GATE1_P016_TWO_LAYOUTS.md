# P016 — 2件まとめて確認①

Status: BLOCK-CHECK-PENDING

実装承認はユーザー「いいよ続けて」により取得済み。以下は実装後の見た目確認です。以前承認済みの7件・5件は再確認しません。

固定ソース: `91f7b2df72d5403931e0a0df0b656627516116d8`。原画像保存コミット: `e2743fefc3a4652ec94cea8b8b5c40247fa434c7`。元のChrome画像を加工せず掲載しています。

## 1. N12 Q06 左側の係数

スマホは元の不等式→下向き矢印→穴と x+2≤4 のまとまり。PCは横一列。係数1の保存値を維持し、正答後はx表示。

![Q06 実画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/e2743fefc3a4652ec94cea8b8b5c40247fa434c7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/p016/p016-n12-p002-q06-left-coef-review-wrong-390.png)

## 2. N12 Q12 符号付き係数

スマホは左辺の次に =2600+(穴)x を一まとまりで表示。PCは横一列。括弧とxを穴から切り離しません。

![Q12 実画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/e2743fefc3a4652ec94cea8b8b5c40247fa434c7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/p016/p016-n12-p002-q12-signed-coef-review-wrong-390.png)

確認点は、穴と後ろの文字・括弧のつながり、式と説明・ヒントの読みやすさ、選択肢の操作の分かりやすさです。誤答状態の×は正常な教材動作です。実画面検査320/390/1440通過。選択肢全体は縦スクロールで確認します。

残る別4件の320px問題は [影響監査](./P016_IMPACT_AUDIT_20261023.md) に記録。今回の2件の技術検査通過は章全体の完了ではありません。人による見た目確認はまだ未取得です。
