# W-MATH-003/P-003-R1 — 8単元まとめて確認（実アプリ画面画像）


## P-004 + P-004-R1｜修正10問を一括確認（現行版）

**今回のチェックは、この10問を一度だけまとめて見る。** 最初の8問はP-004で、追加のN06-Q11・N14-Q05は承認済みP-004-R1で修正した。以前承認された**8単元全体の制作時の細部確認**とは別の「修正後の細部確認」であり、まだユーザーの`細部OK`は受け取っていない。

- **実際のアプリ画面60枚**：10問 × 320px/390px × 回答前・誤答後に再開してヒント・正答後。模擬画像ではない。
- **撮影した教材コードSHA**：`2604589da22062cb67928ee5e1569a5de0338845`。実画面保存commit：`fd1cc4192b9c19ec5acae9f0154425df38249174`。撮影した画面が現在の2問の修正を含むことを確認。
- **自動検証**：[Math textbook CI #39346035269](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39346035269) **成功**。10問の誤答→パネル閉鎖→再開・ヒント→正答・再読込20ケース、全127操作のスマホ/PC、旧数学・物理・練習モード回帰、型・Lint・ビルドを含む。
- **見てほしい点**：回答前に答えを出していないか、理由を考えられるか、誤答後にヒントを読んで再挑戦できるか、数式・長い選択肢が切れていないか。

| マーク | 問題 | 修正箇所 | スマホ320px | スマホ390px |
|---|---|---|---|---|
| **確認①** | N04-Q13 | 二つの交差積と展開結果 | [回答前](p004-n04-13-320-before.png) · [誤答・再挑戦](p004-n04-13-320-wrong.png) · [正答後](p004-n04-13-320-resolved.png) | [回答前](p004-n04-13-390-before.png) · [誤答・再挑戦](p004-n04-13-390-wrong.png) · [正答後](p004-n04-13-390-resolved.png) |
| **確認②** | N05-Q17 | 異符号と積による理由 | [回答前](p004-n05-17-320-before.png) · [誤答・再挑戦](p004-n05-17-320-wrong.png) · [正答後](p004-n05-17-320-resolved.png) | [回答前](p004-n05-17-390-before.png) · [誤答・再挑戦](p004-n05-17-390-wrong.png) · [正答後](p004-n05-17-390-resolved.png) |
| **確認③** | N06-Q08 | x・yの次数比較 | [回答前](p004-n06-08-320-before.png) · [誤答・再挑戦](p004-n06-08-320-wrong.png) · [正答後](p004-n06-08-320-resolved.png) | [回答前](p004-n06-08-390-before.png) · [誤答・再挑戦](p004-n06-08-390-wrong.png) · [正答後](p004-n06-08-390-resolved.png) |
| **確認④** | N07-Q06 | 循環小数の最小倍率 | [回答前](p004-n07-06-320-before.png) · [誤答・再挑戦](p004-n07-06-320-wrong.png) · [正答後](p004-n07-06-320-resolved.png) | [回答前](p004-n07-06-390-before.png) · [誤答・再挑戦](p004-n07-06-390-wrong.png) · [正答後](p004-n07-06-390-resolved.png) |
| **確認⑤** | N08-Q05 | 平方の比較と大小 | [回答前](p004-n08-05-320-before.png) · [誤答・再挑戦](p004-n08-05-320-wrong.png) · [正答後](p004-n08-05-320-resolved.png) | [回答前](p004-n08-05-390-before.png) · [誤答・再挑戦](p004-n08-05-390-wrong.png) · [正答後](p004-n08-05-390-resolved.png) |
| **確認⑥** | N11-Q05 | 両辺の操作と不等式 | [回答前](p004-n11-05-320-before.png) · [誤答・再挑戦](p004-n11-05-320-wrong.png) · [正答後](p004-n11-05-320-resolved.png) | [回答前](p004-n11-05-390-before.png) · [誤答・再挑戦](p004-n11-05-390-wrong.png) · [正答後](p004-n11-05-390-resolved.png) |
| **確認⑦** | N14-Q06 | 外側の二枝と「または」 | [回答前](p004-n14-06-320-before.png) · [誤答・再挑戦](p004-n14-06-320-wrong.png) · [正答後](p004-n14-06-320-resolved.png) | [回答前](p004-n14-06-390-before.png) · [誤答・再挑戦](p004-n14-06-390-wrong.png) · [正答後](p004-n14-06-390-resolved.png) |
| **確認⑧** | N14-Q11 | 内外・端点の判定 | [回答前](p004-n14-11-320-before.png) · [誤答・再挑戦](p004-n14-11-320-wrong.png) · [正答後](p004-n14-11-320-resolved.png) | [回答前](p004-n14-11-390-before.png) · [誤答・再挑戦](p004-n14-11-390-wrong.png) · [正答後](p004-n14-11-390-resolved.png) |
| **確認⑨** | N06-Q11 | 共通因数を自分で見つける | [回答前](p004-n06-11-320-before.png) · [誤答・再挑戦](p004-n06-11-320-wrong.png) · [正答後](p004-n06-11-320-resolved.png) | [回答前](p004-n06-11-390-before.png) · [誤答・再挑戦](p004-n06-11-390-wrong.png) · [正答後](p004-n06-11-390-resolved.png) |
| **確認⑩** | N14-Q05 | 境界・内外・等号を自分で判断 | [回答前](p004-n14-05-320-before.png) · [誤答・再挑戦](p004-n14-05-320-wrong.png) · [正答後](p004-n14-05-320-resolved.png) | [回答前](p004-n14-05-390-before.png) · [誤答・再挑戦](p004-n14-05-390-wrong.png) · [正答後](p004-n14-05-390-resolved.png) |

**判定**：10問すべて問題なければ`確認①〜⑩ 細部OK`、修正箇所があれば`確認番号 + 要修正の内容`だけでよい。初回8単元の承認を再度求めない。

**注意**：これは作成・修正のGate①相当の実画面確認票であり、全123問の公式解答と数学的妥当性の独立証明、Gate②正式完了、Gate③アプリ全体の総チェックを自動で合格扱いにしない。main統合・本番公開・Vercel・課金は今回対象外。

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
