# W-MATH-003/P-003-R1 — 8単元まとめて確認（実アプリ画面画像）

## W-MATH-012 N11-Q11：新しい3段階の導出（2026-10-21）
[**Q11の実画面レビュー票：18枚（320/390×回答前・誤答・正答後）**](../../../W-MATH-012-n11-q11-derivation-correction/GATE1_N11_Q11_REVIEW_SHEET.md)。教材SHA `74b73ad275b8aced7ccf99c3ef0ffc943f02d208`、[撮影 #39519331072](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39519331072) SUCCESS、[最終数学CI #39519336157](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39519336157) SUCCESS。初回画像で判明した320pxの式の横切れは修正済みで、**最終画像18枚だけが承認用**。今回のQ11 Gate①はユーザー確認待ち、従来Q01〜Q04 Gate①は承認済み。

## W-MATH-011 N11-Q01〜Q04 修正（2026-10-21）
[**4原問・9操作の細部確認票（全54枚の実画面）**](../../../W-MATH-011-n11-inequality-derivation-correction/GATE1_N11_Q01_Q04_REVIEW_SHEET.md) — 320px/390px、各回答前・誤答後・正答後。対象コードSHA `2ebdf7fbb0c7387ae05753c286b3c457da74e17c`、[撮影 #39440719673](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39440719673) PASS、[全数学CI #39442017686](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39442017686) PASS。以前のR5画像は別バージョンの歴史的監査証拠として以下に残す。今回のGate①ユーザー細部確認は未取得。

## P-004-R5｜数学独立監査で補った3問の実画面（新規一括確認）

**対象コードSHA**：`ad77318b37e90b9c39150b14ee706283b3f59355`。
**実画面18枚の保存コミット**：`0c8177880ee6d71a441d02da7655a04c8c5ce47c`。
**技術検証**：[Math textbook CI #39419920062](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419920062) **SUCCESS**、[実画面撮影 #39419915311](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39419915311) **SUCCESS**。

| 確認ID | 原問 | 生徒自身が選ぶ思考操作 | 320px | 390px |
|---|---|---|---|---|
| R5-1 | N06-Q15 | 和の計算＋元の係数と一致する判断 | [回答前](p004-r5-n06-15-320-before.png) · [誤答・ヒント](p004-r5-n06-15-320-wrong.png) · [正答後](p004-r5-n06-15-320-resolved.png) | [回答前](p004-r5-n06-15-390-before.png) · [誤答・ヒント](p004-r5-n06-15-390-wrong.png) · [正答後](p004-r5-n06-15-390-resolved.png) |
| R5-2 | N08-Q10 | 絶対値0の値＋原点に一致する理由 | [回答前](p004-r5-n08-10-320-before.png) · [誤答・ヒント](p004-r5-n08-10-320-wrong.png) · [正答後](p004-r5-n08-10-320-resolved.png) | [回答前](p004-r5-n08-10-390-before.png) · [誤答・ヒント](p004-r5-n08-10-390-wrong.png) · [正答後](p004-r5-n08-10-390-resolved.png) |
| R5-3 | N13-Q08 | 絶対値を外した二方程式＋両方の解 | [回答前](p004-r5-n13-08-320-before.png) · [誤答・ヒント](p004-r5-n13-08-320-wrong.png) · [正答後](p004-r5-n13-08-320-resolved.png) | [回答前](p004-r5-n13-08-390-before.png) · [誤答・ヒント](p004-r5-n13-08-390-wrong.png) · [正答後](p004-r5-n13-08-390-resolved.png) |

計 **18枚＝3問×2画面幅×3状態**。実アプリを操作した証拠であり、同じコードSHAで修正の採点内容・学習履歴と結び付いている。直接開いた320pxの回答前・正答後3問は、複合回答の二行が途切れずに表示された。以前のP-004-R2/R3/R4の**11問66枚は下の表に保存済み**で、初回8単元や旧10問の承認を再取得する必要はない。

**Gate①のR5三問受入記録（2026-10-20 22:32 JST頃）**：ユーザーに新規R5の3問のみの一括画面確認を依頼した直後、ユーザーが **「ok続けて」** と返答。既存のGate①に従いN06-Q15/N08-Q10/N13-Q08のR5画面を **BLOCK-VISUAL-OK** として記録する（「細部OK」という逐語回答を偽って引用しない）。これはアプリ全体の操作承認・公開/統合許可ではない。原Word123問・アプリ127操作・全381誤答の数学的再監査は[Gate② R5 post-repair](../../GATE2_P004_R5_POST_REPAIR_INDEPENDENT_AUDIT_20261020.md)を参照。Gate③の実働URL全体総チェックは未実施。

---

## P-004-R4｜承認済み修正をすべて反映した11問の最新実画面

**現在の画像を撮影した教材コードSHA**：`61498366f2bed5324326e55d09b8f5c984a1a714`。
**現在の画像保存commit**：`7a4a1c846ff03923136b29e3dd9ec5490ca9dc40`。
**技術検証**：[Math textbook CI #39374550368](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39374550368) **SUCCESS**、[実画像ギャラリーCI #39374547022](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39374547022) **SUCCESS**。

これは修正後の実際のアプリをChromeで進行させた **66枚＝11問×2画面幅（320px/390px）×3状態（回答前／誤答後・ヒント／正答後）**。ファイル名には旧R2識別子が残るが、**リンク先の現行ブランチ内の画像内容はR4修正後の再撮影版**。R2修正前の比較用画像は[歴史的な画像保存commit 8ea2b1e3](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/8ea2b1e331f4e64e3976ef8860fbe1ebdd1b7193/work/items/W-MATH-003-numbers-expressions-creation/evidence/n04-n14-gallery)で確認できる。従来P-004/R1の10問60枚は別ファイル。数学的正答・問題ID・進捗は変えていない。

| マーク | 原問 | 学習者が実際に考える操作 | 320pxの実画面 | 390pxの実画面 |
|---|---|---|---|---|
| **確認01** | N06-Q01 | 共通部分を生徒が発見し、Xで置く | [回答前](p004-r2-n06-01-320-before.png) · [誤答→ヒント](p004-r2-n06-01-320-wrong.png) · [正答後](p004-r2-n06-01-320-resolved.png) | [回答前](p004-r2-n06-01-390-before.png) · [誤答→ヒント](p004-r2-n06-01-390-wrong.png) · [正答後](p004-r2-n06-01-390-resolved.png) |
| **確認02** | N06-Q05 | 四次式から二次式への置換 | [回答前](p004-r2-n06-05-320-before.png) · [誤答→ヒント](p004-r2-n06-05-320-wrong.png) · [正答後](p004-r2-n06-05-320-resolved.png) | [回答前](p004-r2-n06-05-390-before.png) · [誤答→ヒント](p004-r2-n06-05-390-wrong.png) · [正答後](p004-r2-n06-05-390-resolved.png) |
| **確認03** | N07-Q09 | 循環小数の最小倍率と等式 | [回答前](p004-r2-n07-09-320-before.png) · [誤答→ヒント](p004-r2-n07-09-320-wrong.png) · [正答後](p004-r2-n07-09-320-resolved.png) | [回答前](p004-r2-n07-09-390-before.png) · [誤答→ヒント](p004-r2-n07-09-390-wrong.png) · [正答後](p004-r2-n07-09-390-resolved.png) |
| **確認04** | N08-Q02 | a≥0の絶対値 | [回答前](p004-r2-n08-02-320-before.png) · [誤答→ヒント](p004-r2-n08-02-320-wrong.png) · [正答後](p004-r2-n08-02-320-resolved.png) | [回答前](p004-r2-n08-02-390-before.png) · [誤答→ヒント](p004-r2-n08-02-390-wrong.png) · [正答後](p004-r2-n08-02-390-resolved.png) |
| **確認05** | N11-Q06 | 正の3で割る操作と解 | [回答前](p004-r2-n11-06-320-before.png) · [誤答→ヒント](p004-r2-n11-06-320-wrong.png) · [正答後](p004-r2-n11-06-320-resolved.png) | [回答前](p004-r2-n11-06-390-before.png) · [誤答→ヒント](p004-r2-n11-06-390-wrong.png) · [正答後](p004-r2-n11-06-390-resolved.png) |
| **確認06** | N11-Q08 | 両辺から3を引く | [回答前](p004-r2-n11-08-320-before.png) · [誤答→ヒント](p004-r2-n11-08-320-wrong.png) · [正答後](p004-r2-n11-08-320-resolved.png) | [回答前](p004-r2-n11-08-390-before.png) · [誤答→ヒント](p004-r2-n11-08-390-wrong.png) · [正答後](p004-r2-n11-08-390-resolved.png) |
| **確認07** | N11-Q09 | 負の2で割る・不等号反転 | [回答前](p004-r2-n11-09-320-before.png) · [誤答→ヒント](p004-r2-n11-09-320-wrong.png) · [正答後](p004-r2-n11-09-320-resolved.png) | [回答前](p004-r2-n11-09-390-before.png) · [誤答→ヒント](p004-r2-n11-09-390-wrong.png) · [正答後](p004-r2-n11-09-390-resolved.png) |
| **確認08** | N11-Q13 | 分母を払う操作と式 | [回答前](p004-r2-n11-13-320-before.png) · [誤答→ヒント](p004-r2-n11-13-320-wrong.png) · [正答後](p004-r2-n11-13-320-resolved.png) | [回答前](p004-r2-n11-13-390-before.png) · [誤答→ヒント](p004-r2-n11-13-390-wrong.png) · [正答後](p004-r2-n11-13-390-resolved.png) |
| **確認09** | N14-Q10 | 三辺に3を足す操作 | [回答前](p004-r2-n14-10-320-before.png) · [誤答→ヒント](p004-r2-n14-10-320-wrong.png) · [正答後](p004-r2-n14-10-320-resolved.png) | [回答前](p004-r2-n14-10-390-before.png) · [誤答→ヒント](p004-r2-n14-10-390-wrong.png) · [正答後](p004-r2-n14-10-390-resolved.png) |
| **確認10** | N14-Q14 | 三辺に2を足す操作 | [回答前](p004-r2-n14-14-320-before.png) · [誤答→ヒント](p004-r2-n14-14-320-wrong.png) · [正答後](p004-r2-n14-14-320-resolved.png) | [回答前](p004-r2-n14-14-390-before.png) · [誤答→ヒント](p004-r2-n14-14-390-wrong.png) · [正答後](p004-r2-n14-14-390-resolved.png) |
| **確認11** | N14-Q15 | 三辺を3で割る操作 | [回答前](p004-r2-n14-15-320-before.png) · [誤答→ヒント](p004-r2-n14-15-320-wrong.png) · [正答後](p004-r2-n14-15-320-resolved.png) | [回答前](p004-r2-n14-15-390-before.png) · [誤答→ヒント](p004-r2-n14-15-390-wrong.png) · [正答後](p004-r2-n14-15-390-resolved.png) |

**一括細部確認ポイント（自動撮影PASS≠ユーザー細部OK）**：R2〜R4で修正した11問を確認01〜11で一度に確認する。R3の先出し5箇所とN07-Q09の3行化は反映済み。**R4ではN11-Q13、N14-Q14、N14-Q15の正答後の長い式を2行化**し、320/390pxの回答後表示で右側が切れない自動検査がPASS。直接開いた320px実画像3問でも各2行が収まることを確認。他の関連4問N11-Q06/Q08/Q09とN14-Q10の正答後320px画像も確認し、同様の切れは認めなかった。問題文、正答・誤答の採点文字列、ID、revision、学習記録は変更していない。ユーザーの**今回の確認①〜⑪ 細部OK**はまだ未取得であり、画像生成PASSだけで承認を代行しない。Gate②の全123問・全誤答候補の独立数学監査は未完了。Gate③の実動アプリ全体プレイ・総チェックOKも未実施。

**既存10問の確認について**：ユーザーはこの会話で「一旦確認もうした」と報告済み。過去に承認された8単元の初期Gate①も繰り返さない。独立の数学・全誤答候補監査（Gate②）と、同じコードを持つ実動アプリURLでユーザーが最初から最後まで行う総チェック（Gate③）はいずれも未完了。PR #101はDraft、main/公開の権限とは別。

---



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
