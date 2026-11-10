# Findings
F-001: 34件は初手expect5s未出現、2件は総30s。通常App機能8case PASSがある。未観測の個別失敗画面をfatal/loadingと断定しない。
F-002: 既存review-loopのzeroerror/overflowだけでは空画面も通り得る。新positive-reader gateで検査開始条件を明示する。
F-003: 初期fatal-error classは通常loadingにも使うため、それだけで起動失敗扱いしない。実BOOT/DOM/console診断を分ける。
F-004: compiled distに元JSONfixtureは無い。同originの既存SVGをstatus/MIME/origin検査してstorageだけ準備する。
F-005: historicalHTML literalにmain-contentが無いことからDOM欠如を推測したM初期仮説はDISPROVEN。実AppShell importがmainを生成する。fixedHTMLの設定routeにreaderを要求する中間案はsource反例で差戻し。原症状の確定原因と混同しない。
F-006: preview直接観測は自動承認審査拒否、未実施。account操作/回避なし。新browser効果・後半CI・四幅/C09/G2は未検証。

F-007 ERROR-PROCESS（実行前検出・訂正済）: 適用script生成時の件数文字列一括置換がsource/patch引用hashの各literalを誤変換。native実行前に元binding値へ訂正し、sourceSHA・patchbyteSHAの明示assertを追加。実PLANは正しいa0/5ccdで生成。
