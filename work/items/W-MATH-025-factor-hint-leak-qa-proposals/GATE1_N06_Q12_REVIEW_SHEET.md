# N06 Q12 — 実画像 Gate① 確認①「因数を先に教えないヒント」
Work: W-MATH-025/P-002
Status: BLOCK-VISUAL-OK — hint-only user response 「いいよ続けて」, 2026-10-23 JST

**対象・撮影コード完全SHA:** `6d75ec551e738abc92be3af22b4502bb55e18a99`  
**原画像18枚の固定コミット:** `0f93e549f418b3f67851dbfee161b726b278d7b7`  
**原典:** 教師Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`、N06 paragraph 271【12】。N06 revision3 / 16原問 / 16選択。  
**実ブラウザ:** [run 39890748804 SUCCESS](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39890748804)、native Q12 capture job 120209654721。320/390/1440px、番号付き確認と通常学習、誤答→ヒント→再回答、全16問と保存後の復元。  
**他の検証:** 同じ撮影SHAのReviewコードとGovernanceはSUCCESS。全体数学回帰は別の未完了項目として記録する。この画像確認はGate②/③の代用ではない。

## 今回ここだけ — 確認①

原問題は `(x+y)(x²+x−2)` の残る二次式を因数分解し、全体を完成させるものです。正解の定数2と−1を直接教える旧ヒントを、承認済みの次の文章へ変更しました。

> 積が負なので二数は異符号。和が正なので、絶対値の大きい方が正になる。元の因子(x+y)も残そう。

![N06 Q12 確認① 390px 誤答後の本物のヒント](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/0f93e549f418b3f67851dbfee161b726b278d7b7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q12/wm025-q12-review-wrong-390.png)

[320pxの同じ確認①](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/0f93e549f418b3f67851dbfee161b726b278d7b7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q12/wm025-q12-review-wrong-320.png) ／ [正答後390px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/0f93e549f418b3f67851dbfee161b726b278d7b7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q12/wm025-q12-review-complete-390.png) ／ [通常学習1440px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/0f93e549f418b3f67851dbfee161b726b278d7b7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q12/wm025-q12-normal-wrong-1440.png) ／ [全18枚](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/0f93e549f418b3f67851dbfee161b726b278d7b7/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q12/README.md)

- 確認①：正解の整数組を先出しせず、符号から考え直す手掛かりになるか。
- 同じ確認①：スマホでもヒントと数式を読めるか。

**受入記録:** このQ12の**ヒント1文**の実画像確認に対し、ユーザーが本チャットで **「いいよ続けて」** と直接回答（2026-10-23 JST）。ヒントのみを **BLOCK-VISUAL-OK** とし、次のレビュー出力ではこの確認①を非表示にする。ここに載る番号付き原画像は当時の履歴として保持し、再確認は求めない。別原因の選択肢修正・Gate②/③・統合/公開の承認ではない。

## Agent acceptance / impact ledger
- [x] Original Word/OMML Q12 and all 16 markers read; exact P-002 approval preserved, no reapproval request.
- [x] Learner source diff exactly one hint literal. Correct answer `(x+y)(x+2)(x-1)`, choices, IDs, revision3, progress and figures unchanged.
- [x] 18 authentic original PNGs fixed at 0f93e549f418b3f67851dbfee161b726b278d7b7; that image commit changes only PNGs and their README, never learner code.
- [x] N05 Q11 user visual response 「続けていいよ」 recorded; accepted mark hidden. Q18 and N13 Q05/Q08 not re-requested.
- [x] Actual readable font hashes recorded: Regular `68a3fc98800b2a27b371f2fb79991daf3633bd89309d4ffaa6946fd587f375b5`; Bold `e53dcb0dcb2922e45d01aae1ebd2f382bb81d4229b18b6b883bd170678af1f76`.
- [x] User Q12 hint-only visual acceptance: verbatim 「いいよ続けて」; reviewed sheet HEAD b1dc7e2ce7542ea1b7dd244a9490dfd1d4c2bf10, image/source SHA above. Marker hidden, source IDs retained; no fabricated literal `細部OK`.
- [ ] Full math/regression / Gate② still open. New Q03/Q06 hint leaks and existing Q12 duplicate wrong choices have separate unapproved scope; see impact precheck.
- [ ] Separate N14 Q16 Gate① and full live-app SHA-matched Gate③. No main merge/hosting/release.
