# W046 Findings

Status: ACTIVE

## F-UX03-01 — ERROR-SPEC / ERROR-QA
旧UIはN08の排版・番号付き選択肢・左下resetを継承せず、memo再掲と学習行為不足を見落とした。旧技術PASSを消さず、本人のG3_FINAL要修正を保持。旧案UX-02も詳細不足で未完成だった。原指摘・原因の履歴はWORK.md。

## F-UX03-02 — ERROR-IMPLEMENTATION（補修済み）
Aが、旧r2保留回答の親記録欠落とmain-only r3の比較表示漏れを確認。親の初回値/回数/時刻/正誤投影とmain/archive fallbackで補修。実browserでr2移行45新規回答/r3移行3新規回答後に両方36/36を確認。

## F-UX03-03 — ERROR-QA（補修済み）
Bが予備画像で番号枠・node間余白・ラベル横並び・条件再掲を指摘。N08の既存class/tokenと文脈内条件表示へ補修。固定SHA `830b620b343112e4f8c4e3d00b51461dc8ecc098` の20画像をBが確認し限定PASS。

## F-UX03-04 — CONFIRMED / 限定意味審査
H07の正性は正の因子二つの積から導ける。同定には正性と平方125の両条件が必要。Aが現compiledHash `5f42dba655ce6dad1348dcf6cce705138fc7c266240277ad769d22be82f24f2b` で明示PASS。finite-mathのunsupported31件全体をPASSにはしない。

## F-UX03-05 — OPEN-QUESTION / 全体governance
源candidateで42件の他Work記録不足等が残り、修正前adbbc230にも同じ42件があった。新規source違反なし。このWorkの正規記録整備による減少を別途記録する。未合格を隠して公開ゲートへ進めない。他Workの記録や承認を推測で補完しない。
