# N13 Q05 — 本物のアプリ実画像・確認①〜②

Review: W-MATH-023 / APPROVED P-002, Stage A N13 Q05 only  
Status: **BLOCK-CHECK-PENDING（ユーザー細部確認待ち）**  
Block: N13-Q05; `n13-q05-chain`; `n13-wm023-q05-right`, `n13-05`  
**実際に動かした教材コード完全SHA:** `c911529360f070a5b6ddb6cf2a104eabe4abd708`  
**画像15枚のGitHub固定保存コミット:** `913a7b0d6ce165f910c85bb3498fb5a9921c6a7d`（元画像のURLを固定。将来の文書更新では変化しない）  
元教材: 教師原Word N13 Q05 / 原図 N13-F01; current unit revision **3**, 9 Word源問題 / 10採点選択  
対象画面: `/#/review/n13-q05`（実際のGitHub Actions内プレビュー。公開URLではない）と通常学習 `/#/learning/textbook/math-numbers-expressions-n13`  
**撮影証拠:** [GitHub Actions #39777436057](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39777436057) **SUCCESS**／Noto CJK JP正常表示、Chromium 320/390/1440px、誤答→ヒント→再回答、通常学習の保存・再読込を実操作。  
**全CI:** 数学教科書 [#39777436006](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39777436006)、練習 [#39777435983](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39777435983)、Governance [#39777435948](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39777435948)、レビューコード [#39777436057](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39777436057) **いずれもSUCCESS**。  
**保護:** N13 Q01–04/Q06–09、旧R5履歴、元Word・原図、N14 Q10/Q14/Q15/Q16、他モード、main、公開環境。N13 Q08 Stage Bは未実装・Gate① Q05承認待ち。

## ユーザーに見せる部分

**今回ここだけ確認：N13 Q05「点xと点1の距離を左右で考える」**。選択を2回に分けました。日本語フォントを修正した実アプリ画像です。

### 確認①　x≥1 なら、距離は x−1

![実アプリ390px・最初の選択・確認①](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/913a7b0d6ce165f910c85bb3498fb5a9921c6a7d/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1/wm023-q05-review-before-390.png)

原図の「点xが1の右」という位置から、どちらを引くか考え、**自分で選択**できることを確認してください。

### 確認②　x<1 なら、距離は 1−x

![実アプリ320px・二つの選択が終わった状態・確認①と②](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/913a7b0d6ce165f910c85bb3498fb5a9921c6a7d/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1/wm023-q05-review-complete-320.png)

**320pxでは式と選択部分が上下2行**になり、幅からはみ出さず、選択後に距離が負にならない説明を読めることを確認してください。

[390pxの誤答ヒント実画像](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/913a7b0d6ce165f910c85bb3498fb5a9921c6a7d/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1/wm023-q05-review-wrong-390.png) ／ [通常学習の完成画面・1440px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/913a7b0d6ce165f910c85bb3498fb5a9921c6a7d/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1/wm023-q05-normal-complete-1440.png) ／ [15枚の実画像の一覧（固定コミット）](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/913a7b0d6ce165f910c85bb3498fb5a9921c6a7d/work/items/W-MATH-023-n13-q05-q08-sibling/evidence/gate1/README.md)

**返信：** `細部OK` または `要修正：確認①・②の気になる点`。

**注意：** `細部OK`はN13 Q05のGate①**画像・細部確認のみ**です。N13 Q08への着手はこの返答後。横断Gate②・全アプリGate③の`総チェックOK`、mainマージ・公開・追加支出にはなりません。N14 Q16の別Gate①も依然未完了です。

## Agent-only record

- [x] 教師の原Word・Work P-002・旧R5 revision2履歴・9 original source markers を検証
- [x] 初回画像の日本語豆腐（□）を検出。日本語 Noto CJK JPをGitHub Actionsの**撮影環境にだけ**追加して再撮影
- [x] 最新の実画像で日本語・選択と数式を実際に画像表示して確認。320pxの2視覚行と誤答ヒントのPlaywrightが通過
- [x] 15枚の画像は画像保存SHA `913a7b0d6ce165f910c85bb3498fb5a9921c6a7d` のまま固定して表示し、`c911529360f070a5b6ddb6cf2a104eabe4abd708`との差分は画像とREADMEのみ。教材は1バイトも変更なし
- [x] 数学教科書・練習・ガバナンス・レビューCIはいずれも対象SHAでSUCCESS
- [x] Q08とN14承認済み部分にはコード変更なし
- [ ] **ユーザーのGate① `細部OK` または `要修正` の正確な記録**
- [ ] その後のQ08 P-002 Stage B、別途Gate①・独立Gate②・実働全体Gate③
