# N06 Q12 — 選択肢だけの確認票
Status: BLOCK-CHECK-PENDING / 次5件まとめ提示用
Source SHA: `d894e38820829c387386d207ff2d44d1ac95eebb`
Images SHA: `113298ed523af9f3523aaa1f87469fc3aa737528`
Draft PR: https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/116

## Exact scope
W026/P001既承認。旧 `(x+y)(x+1)(x-2)` を新 `(x+y)(x+2)(x+1)` へ1選択肢だけ変更。
正答 `(x+y)(x+2)(x-1)`、受入済みヒント、他15問、原16問、revision3、stable ID、保存schemaは保持。
Q12 hint targetはacceptedのまま、choicesは別target `n06-q12-choices`。Q06受入マーカーを隠した。Q12単独の人手回答は求めず5件にまとめる。

## まとめ確認時の2点
1. スマホで四つの式を読めるか。
2. 誤答後の既存ヒントで符号を考え直せるか。

![390px 四つの選択肢・誤答前](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/113298ed523af9f3523aaa1f87469fc3aa737528/work/items/W-MATH-026-n06-q12-distinct-distractor/evidence/gate1-q12-choices/wm026-q12-choices-review-choices-390.png)

[320px誤答後](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/113298ed523af9f3523aaa1f87469fc3aa737528/work/items/W-MATH-026-n06-q12-distinct-distractor/evidence/gate1-q12-choices/wm026-q12-choices-review-wrong-320.png) /
[390px旧誤答保存から復元した通常画面](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/113298ed523af9f3523aaa1f87469fc3aa737528/work/items/W-MATH-026-n06-q12-distinct-distractor/evidence/gate1-q12-choices/wm026-q12-choices-normal-wrong-390.png) /
[全24枚](./evidence/gate1-q12-choices/README.md)

## Engineering evidence
- Review39900003982 SUCCESS; check120239161134: 5files/38tests PASS (review境界11 + 専用数学/履歴3を含む)。
- capture120239161585: 6実ケースPASS/6project matrix skips、320/390/1440通常とreview。24original PNG + READMEのみをsource直後の固定子コミットへ保存し、compareでsourcecode差分なしを確認。
- 旧保存wrongをそのまま復元→hint→新四択でretry。firstValue/firstAnsweredAt/isFirstCorrect/attemptCountを維持、既存11答を保全、Q13は正答後のみ解放、全16完了→reload同値。previewは通常localStorageを変更しない。
- Governance39900003884 SUCCESS。全体Math39900003882もSUCCESS：25unit files/240tests、254browser cases PASS/9explicit skips、型/lint/buildと他モード回帰を完了。
- 日本語フォントNotoCJK JP Regular SHA25668a3fc98800b2a27b371f2fb79991daf3633bd89309d4ffaa6946fd587f375b5、Bold e53dcb0dcb2922e45d01aae1ebd2f382bb81d4229b18b6b883bd170678af1f76（runnerだけ）。
- 直接視認: 390reviewchoicesは四択すべて読める。320reviewwrongはhintと各式が横にはみ出さず、下段は通常縦スクロール。390normalwrongには削除した旧値の赤いchoice印が無いまま四択/hintがある（事前開示通り）。1440reviewchoices画像は上2択までを表示する切り取りで、下2択はスクロールが必要。画像一枚でPC全四択可視とは主張しない。
- PNG取得初回encoding省略はUTF-8 decodeerror。base64を指定し直し上記4原画像を直接視認、画像変更なし。

Gate①は人手受入待ち。Gate②OPEN、Gate③FINAL-REVIEW-NOT-READY。main統合/公開は行わない。
