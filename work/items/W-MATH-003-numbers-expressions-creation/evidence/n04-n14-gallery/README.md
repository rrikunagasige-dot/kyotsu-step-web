# W-MATH-003/P-003-R1 — 8単元まとめて確認（実アプリ画面画像）


## P-004：承認済み8件の修正箇所を一括確認（新しい証拠）

**この確認①〜⑧は以前の8単元全体の承認とは別の「修正した8問」の画像です。まだユーザーの修正後細部OKを受け取っていません。** 下の旧一括確認①〜⑧は元の制作時の履歴であり、承認状態を上書きしません。

- 修正対象のアプリコード: `e397d77e39168958499eafd8f7ad0025243ee7e6`（途中のテスト修正・その時点の教材コード）。実スクリーンショット保存コミット: `d74b210187d90c98628271f173ed5cf795c3f964`。
- 8問×画面幅2種類（320px、390px）×回答前／誤答・再挑戦時のヒント／正答後＝**48枚**。モックではなく Playwright が実教材画面を操作して採取。
- 各行の確認番号はこのGitHub確認票の**確認マーク**。学習者用のアプリUIに確認番号を混入させない。
- **Gate②の完全合格・Gate③本番受入を示すものではない。** 自動検証と同型不具合の横断調査は別に行う。

| 確認マーク | 問題 | 見る場所 | 320px スマホ画面 | 390px スマホ画面 |
|---|---|---|---|---|
| 確認① | N04-Q13 | 二つの交差積・式全体の展開 | [回答前](p004-n04-13-320-before.png) / [誤答→ヒント](p004-n04-13-320-wrong.png) / [正答後](p004-n04-13-320-resolved.png) | [回答前](p004-n04-13-390-before.png) / [誤答→ヒント](p004-n04-13-390-wrong.png) / [正答後](p004-n04-13-390-resolved.png) |
| 確認② | N05-Q17 | 異符号を積から理由付きで判断 | [回答前](p004-n05-17-320-before.png) / [誤答→ヒント](p004-n05-17-320-wrong.png) / [正答後](p004-n05-17-320-resolved.png) | [回答前](p004-n05-17-390-before.png) / [誤答→ヒント](p004-n05-17-390-wrong.png) / [正答後](p004-n05-17-390-resolved.png) |
| 確認③ | N06-Q08 | xの次数・yの次数・注目する文字 | [回答前](p004-n06-08-320-before.png) / [誤答→ヒント](p004-n06-08-320-wrong.png) / [正答後](p004-n06-08-320-resolved.png) | [回答前](p004-n06-08-390-before.png) / [誤答→ヒント](p004-n06-08-390-wrong.png) / [正答後](p004-n06-08-390-resolved.png) |
| 確認④ | N07-Q06 | 繰り返しの最小倍率 | [回答前](p004-n07-06-320-before.png) / [誤答→ヒント](p004-n07-06-320-wrong.png) / [正答後](p004-n07-06-320-resolved.png) | [回答前](p004-n07-06-390-before.png) / [誤答→ヒント](p004-n07-06-390-wrong.png) / [正答後](p004-n07-06-390-resolved.png) |
| 確認⑤ | N08-Q05 | 平方の比較から大小判断 | [回答前](p004-n08-05-320-before.png) / [誤答→ヒント](p004-n08-05-320-wrong.png) / [正答後](p004-n08-05-320-resolved.png) | [回答前](p004-n08-05-390-before.png) / [誤答→ヒント](p004-n08-05-390-wrong.png) / [正答後](p004-n08-05-390-resolved.png) |
| 確認⑥ | N11-Q05 | 両辺への操作と変形結果 | [回答前](p004-n11-05-320-before.png) / [誤答→ヒント](p004-n11-05-320-wrong.png) / [正答後](p004-n11-05-320-resolved.png) | [回答前](p004-n11-05-390-before.png) / [誤答→ヒント](p004-n11-05-390-wrong.png) / [正答後](p004-n11-05-390-resolved.png) |
| 確認⑦ | N14-Q06 | 左右の範囲を「または」で結ぶ | [回答前](p004-n14-06-320-before.png) / [誤答→ヒント](p004-n14-06-320-wrong.png) / [正答後](p004-n14-06-320-resolved.png) | [回答前](p004-n14-06-390-before.png) / [誤答→ヒント](p004-n14-06-390-wrong.png) / [正答後](p004-n14-06-390-resolved.png) |
| 確認⑧ | N14-Q11 | 距離の外側と端点を含む条件 | [回答前](p004-n14-11-320-before.png) / [誤答→ヒント](p004-n14-11-320-wrong.png) / [正答後](p004-n14-11-320-resolved.png) | [回答前](p004-n14-11-390-before.png) / [誤答→ヒント](p004-n14-11-390-wrong.png) / [正答後](p004-n14-11-390-resolved.png) |

※スクリーンショットの確認点は式の正確さ、長い選択肢の切れ、誤答後に閉じた穴が再度開くこと、再開時にヒントが表示されること、回答後の説明が自然であること。

---

**制作・自動操作が全部完了してから、ここで一度に確認してください。** この画像はGitHub Actionsで実際のアプリを操作して撮影するもので、デザイン案やモック画像ではありません。画像ファイルが生成される前は未完成です。

原Wordの N04/N05/N06/N07/N08/N11/N13/N14、原問123個（操作127段階）・元図9点を対象とし、既存6単元は変更しません。各単元の「確認①〜⑧」は **開始・中盤・最終結果** の順で見る。各画像は実画面の部分キャプチャです。間違いがあれば、最後にまとめて「確認番号＋直したい点」でお知らせください。

| 確認 | 単元 | スマホの開始・中盤・最終 | PCの開始・中盤・最終 |
|---|---|---|---|
| ① | N04：乗法公式と展開 | [開始](n04-start-mobile.png) ・ [中盤](n04-middle-mobile.png) ・ [最終](n04-finish-mobile.png) | [開始](n04-start-desktop.png) ・ [中盤](n04-middle-desktop.png) ・ [最終](n04-finish-desktop.png) |
| ② | N05：因数分解・たすき掛け | [開始](n05-start-mobile.png) ・ [中盤](n05-middle-mobile.png) ・ [最終](n05-finish-mobile.png) | [開始](n05-start-desktop.png) ・ [中盤](n05-middle-desktop.png) ・ [最終](n05-finish-desktop.png) |
| ③ | N06：置換と文字選択 | [開始](n06-start-mobile.png) ・ [中盤](n06-middle-mobile.png) ・ [最終](n06-finish-mobile.png) | [開始](n06-start-desktop.png) ・ [中盤](n06-middle-desktop.png) ・ [最終](n06-finish-desktop.png) |
| ④ | N07：小数と有理数 | [開始](n07-start-mobile.png) ・ [中盤](n07-middle-mobile.png) ・ [最終](n07-finish-mobile.png) | [開始](n07-start-desktop.png) ・ [中盤](n07-middle-desktop.png) ・ [最終](n07-finish-desktop.png) |
| ⑤ | N08：絶対値と符号 | [開始](n08-start-mobile.png) ・ [中盤](n08-middle-mobile.png) ・ [最終](n08-finish-mobile.png) | [開始](n08-start-desktop.png) ・ [中盤](n08-middle-desktop.png) ・ [最終](n08-finish-desktop.png) |
| ⑥ | N11：一次不等式 | [開始](n11-start-mobile.png) ・ [中盤](n11-middle-mobile.png) ・ [最終](n11-finish-mobile.png) | [開始](n11-start-desktop.png) ・ [中盤](n11-middle-desktop.png) ・ [最終](n11-finish-desktop.png) |
| ⑦ | N13：絶対値方程式 | [開始](n13-start-mobile.png) ・ [中盤](n13-middle-mobile.png) ・ [最終](n13-finish-mobile.png) | [開始](n13-start-desktop.png) ・ [中盤](n13-middle-desktop.png) ・ [最終](n13-finish-desktop.png) |
| ⑧ | N14：絶対値不等式 | [開始](n14-start-mobile.png) ・ [中盤](n14-middle-mobile.png) ・ [最終](n14-finish-mobile.png) | [開始](n14-start-desktop.png) ・ [中盤](n14-middle-desktop.png) ・ [最終](n14-finish-desktop.png) |

## 元図の確認位置（元Wordと同一画像・アプリ内の表示時点）

| 単元 | 元図 | スマホ | PC |
|---|---|---|---|
| N04 | N04-F01 | [実画面を見る](n04-figure-n04-f01-mobile.png) | [実画面を見る](n04-figure-n04-f01-desktop.png) |
| N05 | N05-F01 | [実画面を見る](n05-figure-n05-f01-mobile.png) | [実画面を見る](n05-figure-n05-f01-desktop.png) |
| N05 | N05-F02 | [実画面を見る](n05-figure-n05-f02-mobile.png) | [実画面を見る](n05-figure-n05-f02-desktop.png) |
| N08 | N08-F01 | [実画面を見る](n08-figure-n08-f01-mobile.png) | [実画面を見る](n08-figure-n08-f01-desktop.png) |
| N11 | N11-F01 | [実画面を見る](n11-figure-n11-f01-mobile.png) | [実画面を見る](n11-figure-n11-f01-desktop.png) |
| N11 | N11-F02 | [実画面を見る](n11-figure-n11-f02-mobile.png) | [実画面を見る](n11-figure-n11-f02-desktop.png) |
| N13 | N13-F02 | [実画面を見る](n13-figure-n13-f02-mobile.png) | [実画面を見る](n13-figure-n13-f02-desktop.png) |
| N13 | N13-F01 | [実画面を見る](n13-figure-n13-f01-mobile.png) | [実画面を見る](n13-figure-n13-f01-desktop.png) |
| N14 | N14-F01 | [実画面を見る](n14-figure-n14-f01-mobile.png) | [実画面を見る](n14-figure-n14-f01-desktop.png) |

元図は `public/assets/math/textbook/numbers/nXX-fXX.png` に原Wordの画像バイトを保持しています。完成図の表示はそれぞれ関連する穴への正答後です。画像生成コミットに撮影対象コードの完全SHAを明記し、変更の履歴が追えるようにします。

**最後の「アプリ全体総チェック」は別のゲートです。** 新しい公開環境は作っておらず、これは画像確認票です。動作するアプリの正確なブランチ版リンクが提供できる状態になったら、最初から最後まで総チェックします。`main`への統合・本番公開・課金は承認されていません。
