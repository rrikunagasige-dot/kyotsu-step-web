# N06 Q06 — 実画像 Gate① 確認①「完成した因数を教えないヒント」
Work: W-MATH-025/P-004
Status: BLOCK-CHECK-PENDING — authentic images verified; user Q06 hint visual pending

**対象・撮影コード完全SHA:** `98ffc53ca390ef4769a4800a58cf3436f87b2057`  
**原画像18枚の固定コミット:** `dd0842e26de33565afdc28e412d26182ad3dec35`  
**原典:** 教師Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`、paragraph260【6】。N06 revision3 / 原16問 / 選択16件。  
**実ブラウザ:** [Review/actual Chrome39897233016 SUCCESS](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39897233016)、capture120230370990。320/390/1440px、限定確認/通常全16問、誤答→reload→hint→retry、旧firstValue/attemptCountと全問完了を復元。  
**技術と人間の境界:** Review4ファイル34単体テスト・Governance成功。同じ撮影SHAの全体Math39897233018もSUCCESS（237単体/254画面成功、明示skip9件）。コード検査、実装承認、このヒントの細部受入、アプリ全体受入は別。

## 今回ここだけ — 確認①

原問題は `T²−5T+4` を因数分解し、前問の `T=x²` を元へ戻すもの。完成した因数T−1とT−4を示す旧ヒントを、承認済みの次の文へ変更しました。

> 積が正なので二数は同符号。和が負なので両方とも負になる。和と積を確かめ、最後にTをx²へ戻そう。

![N06 Q06 確認① 390px 誤答後の本物のヒント](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/dd0842e26de33565afdc28e412d26182ad3dec35/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q06/wm025-q06-review-wrong-390.png)

[320pxの同じ確認①](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/dd0842e26de33565afdc28e412d26182ad3dec35/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q06/wm025-q06-review-wrong-320.png) ／ [正答後390px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/dd0842e26de33565afdc28e412d26182ad3dec35/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q06/wm025-q06-review-complete-390.png) ／ [通常学習1440px](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/dd0842e26de33565afdc28e412d26182ad3dec35/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q06/wm025-q06-normal-wrong-1440.png) ／ [原画像全18枚](https://github.com/rrikunagasige-dot/kyotsu-step-web/blob/dd0842e26de33565afdc28e412d26182ad3dec35/work/items/W-MATH-025-factor-hint-leak-qa-proposals/evidence/gate1-q06/README.md)

- 確認①：正解の−1と−4や完成した因数を教えず、符号と置換を戻す手掛かりになるか。
- 同じ確認①：スマホでもヒントと数式を読めるか。

**返信:** このQ06の**誤答後ヒント1文だけ**について `細部OK` または `要修正（気になる箇所）`。既定WORK_SYSTEM §12Aの小ブロックGate①としてこの2点を確認します。

## Agent ledger
- [x] P-004 exact implementation approval preserved; no repeated approval request. Q03 accepted by exact direct 「ヒントならいいよじゃ続けて」, no body/derivation redesign inferred.
- [x] Original Word Q05–Q07 and per-block lessons reread; (T−1)(T−4)=T²−5T+4 independently verified, restoration gives unchanged key `(x^2-1)(x^2-4)`.
- [x] Source diff q6hint1literal only. All original16, options/keys/IDs/revision3/progress/source figures retained.
- [x] Real original18 PNG fixed in image-only child; operated SHA in README matches actual CI source. No generated or retouched screenshot.
- [x] Original320/390 wrong,390 correct,1440 normal images directly inspected; exact approved Japanese hint and formulas readable.
- [x] Normal/review actual6 cases, before/wrong/correct images, wrong Q07 gate and retry, firstValue/attemptCount/prior5 answers/all16 completion restoration verified. Preview leaves learner localStorage unchanged.
- [x] Accepted Q03/Q12-hint/Q11/Q18/N13 marks hidden; original accepted evidence retained.
- [x] Genuine font hashes: Regular `68a3fc98800b2a27b371f2fb79991daf3633bd89309d4ffaa6946fd587f375b5`, Bold `e53dcb0dcb2922e45d01aae1ebd2f382bb81d4229b18b6b883bd170678af1f76`.
- [ ] User Q06 hint-only visual acceptance; never inferred from a solved choice or CI.
- [ ] Overall Gate②: Q12 separate-cause fix approved/deferred, new P-005/P-006/P-007 unapproved, residual audit open.
- [ ] Separate N14 Q16 Gate① / SHA-matched playable-app Gate③ / main integration-publication permission.
