# N06 Q03 — 実画像 Gate① 確認①「整数組を先に教えないヒント」
Work: W-MATH-025/P-003
Status: BLOCK-CHECK-PENDING — authentic images verified; user Q03 visual response pending

**対象・撮影コード完全SHA:** `7bad9d800d143dcc99f52fecb96b867914ca09d7`  
**原画像18枚の固定コミット:** `d889a22957362c50ef0cf88c3d023cf2e9b844c7`  
**原典:** 教師Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`、N06 paragraph254【3】。N06 revision3 / 原16問 / 選択16件。  
**実ブラウザ:** [Review/real Chrome39894543039 SUCCESS](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39894543039)、capture job120221810195。320/390/1440px、限定確認と通常全16問、誤答→再読込→ヒント→再回答、旧回答/firstValue/attemptCountと全問完了の復元を確認。  
**検証の境界:** 同じ撮影SHAのReviewコード/33単体テストとGovernanceはSUCCESS。全体Math回帰39894542994は別項目として結果を記録する。実装承認・CI・この細部確認・最終全体受入は別。

## 今回ここだけ — 確認①

原問題は `X²−X−6` の因数分解です。和−1・積−6の二数を生徒が考えます。正解の−3と2を直接示す旧ヒントを、承認済みの次の文章へ変更しました。

> 積が負なので二数は異符号。和が負になるには、絶対値の大きい方が負になる。和と積の両方を確かめよう。

![N06 Q03 確認① 390px 誤答後の本物のヒント](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/d889a22957362c50ef0cf88c3d023cf2e9b844c7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q03/wm025-q03-review-wrong-390.png)

[320pxの同じ確認①](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/d889a22957362c50ef0cf88c3d023cf2e9b844c7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q03/wm025-q03-review-wrong-320.png) ／ [正答後390px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/d889a22957362c50ef0cf88c3d023cf2e9b844c7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q03/wm025-q03-review-complete-390.png) ／ [通常学習1440px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/d889a22957362c50ef0cf88c3d023cf2e9b844c7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q03/wm025-q03-normal-wrong-1440.png) ／ [原画像18枚](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/d889a22957362c50ef0cf88c3d023cf2e9b844c7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q03/README.md)

- 確認①：正解の−3と2を教えず、符号と和・積から考え直す手掛かりになるか。
- 同じ確認①：スマホでもヒントと数式を読めるか。

**返信:** このQ03の**ヒント1文**について `細部OK` または `要修正（気になる箇所）`。既定WORK_SYSTEM §12Aの小ブロックGate①としてこの2点だけ確認します。

## Agent ledger
- [x] Exact P-003/P-004/W-MATH-026 P-001 implementation approval recorded from the direct three-proposal 「いいよ続けて」 response; no reapproval requested.
- [x] Original Word/read-before-each-question lessons, mathematical coefficient check and source-diff boundary verified.
- [x] Sole learner change q3hint. Correct answer `(X-3)(X+2)`, all original options/16 markers/revision3/IDs/progress/source figures unchanged.
- [x] Real font hashes: Regular `68a3fc98800b2a27b371f2fb79991daf3633bd89309d4ffaa6946fd587f375b5`, Bold `e53dcb0dcb2922e45d01aae1ebd2f382bb81d4229b18b6b883bd170678af1f76`.
- [x] Fixed child commit has18 genuine PNGs + README only; images source SHA exactly matches the successful operated code. Preview attempts do not alter normal learner localStorage.
- [x] Read original320/390 wrong,390 correct,1440 normal screenshots directly. Hint and math readable. Mobile choices can continue by normal vertical scrolling; no scope expansion to shared UI.
- [x] Accepted Q11/Q18/Q12 hint/N13 markers remain hidden and old immutable images preserved.
- [ ] Q03 user visual acceptance. 「続けて」 during preparation is not fabricated as this review's acceptance.
- [ ] Entire Gate②: Q06 same-root and Q12 separate-cause fixes still deferred, sibling/root audit and required regressions open. See focused impact ledger.
- [ ] Separate N14 Q16 Gate① / complete SHA-matched playable-app Gate③ / merge/publication authority.
