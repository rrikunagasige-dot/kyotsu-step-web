# W-MATH-003/P-003-R1 — 8単元まとめて確認（実アプリ画面画像）

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
