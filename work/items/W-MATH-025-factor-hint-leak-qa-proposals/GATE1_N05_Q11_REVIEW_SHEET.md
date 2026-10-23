# N05 Q11 — 実画像 Gate① 確認①「正解の整数組を先に教えないヒント」
**Work:** W-MATH-025/P-001（ユーザーがP-001/P-002とも「承認続けて」で承認、ただし今回はP-001のQ11のみ）  
**Status:** BLOCK-CHECK-PENDING — Q11 ユーザー細部確認待ち  
**実働教材/ブラウザの完全SHA:** `26c6e82130e52ff89a7bec352ec785aed2a062ad`  
**実画像18枚のGitHub固定コミット:** `eb7d99d0901562b7909e89903af01483f6aa23c1`（元画像が後から変わらないよう固定）  
**元の問題:** N05 Q11、a²−6a−16 の因数分解。元Word 20問、N05 revision2／20選択、正答 `(a-8)(a+2)` は不変。  
**実際のChrome証拠:** [レビュー・画像検査成功 #39881650791](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39881650791)、日本語 Noto CJK JP、320/390/1440px、番号付きレビュー/通常学習、誤答→ヒント→再回答、保存後リロード。  
**現時点の他CI:** 修正後の全面的な数学教科書・ガバナンスCIは結果確認中。画像検査の成功を全体CIの成功と取り違えない。

## 今回見る場所 — 確認①のみ

生徒が誤答したとき、**求める整数組「−8と2」は出さず、積と和を自分で確かめる方法だけ示す**ように変更しました。

### 確認① 320px：誤答後の本物のヒント

![N05 Q11 320px 実ブラウザ誤答時のヒント](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-review-wrong-320.png)

### 確認① 390px：誤答後の選択・ヒントが読みやすいか

![N05 Q11 390px 実ブラウザ誤答時のヒント](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-review-wrong-390.png)

### 正答後の既存の答え（変更していません）

![N05 Q11 390px 実ブラウザ正答後の画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-review-complete-390.png)

[通常学習モードの320px誤答画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-normal-wrong-320.png) ／ [通常学習モード1440pxの完成画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/wm025-q11-normal-complete-1440.png) ／ [全18枚の固定画像一覧](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/eb7d99d0901562b7909e89903af01483f6aa23c1/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1/README.md)

**返信:** この**確認①**だけに対して `細部OK` または `要修正（気になる点）`。

N05 Q18・N13 Q05/Q08の細部は承認済みなので、再確認は不要。N06 Q12は修正案P-002承認済みですが**コード未変更**で、Q11の細部確認の次に進みます。N14 Q16のGate①も独立して未完了。Gate②・全アプリGate③・main統合・公開は別段階です。

## 監査用情報（実画像の作り物禁止）
- [x] Original N05 Q11 guided item `n05-11` / original `n05-formula-11` / preview ID `n05-q11`, 1 graded choice, answer and distractors unchanged; one confirmed hint replaced.
- [x] Actual source SHA `26c6e82130e52ff89a7bec352ec785aed2a062ad` / fixed 18 PNG capture storage `eb7d99d0901562b7909e89903af01483f6aa23c1`; image storage branch diff was exactly 18 PNG and README. N05-Q18 and accepted N13 blocks source protected.
- [x] Genuine screenshots manually inspected for Japanese text and hint no correct-coefficient pre-exposure. Browser reviewer workflow PASS.
- [ ] Current full math/Governance CI exact final SHA success (still check).
- [ ] User Q11 `細部OK` / `要修正`; cannot mark BLOCK-VISUAL-OK just because user approved P-001.
- [ ] After accepted Q11, separately implement approved P-002 N06 Q12, cross-audit and final live user playthrough.
