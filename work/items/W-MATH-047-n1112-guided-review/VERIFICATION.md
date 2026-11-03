# Verification

- 既存verify-ir/compile-ir/coverage/blank-candidates/teaching-candidates/visible-snapshots：基準/候補のN11/N12とも限定PASS。W038 active overlayのverify-irもPASS。
- interaction全項目同一、85ID/expected/choices/prerequisites/answerInsertion保持。本文や式の変化はN11 6node、N12 5nodeだけ。
- 基準390px操作：N11=39正答/109誤答、N12=46正答/127誤答。14/15段階、元図2/3点、履歴/reload/resize/旧版移行がPASS。これはsource6b439のlocal build検査。
- 候補の四幅・未回答/誤答/途中/完成/履歴・実寸・公開操作はNOT_RUN（承認後R06/R07）。初回のstatic design FAILは保持し、最終targetの非作者design/render静的PASSを実task/原報告/対象hash付きで登録した。
- Formal現在地はshared Storeから生成したgenerated/を優先。Storeの合格と教育の本人受入を混同しない。USER承認・教材実装・公開・Gold/fitはない。

- R04 N11/N12を正式提出済み。P006の提案書誤記訂正でIRは不変。同一targetの元初見を保持した再束縛を新たな初回審査とは扱わない。N12最終検算は既存materializeの独立行後処理を保持することを照合。

- P006承認を原文・request ID・proposal hashへ記録しR05@n11受理。稼働子agent二人のみ。
- 実製品へは未適用。既存compilerのTG03_COVERAGE原FAILを保存。未適用生成の全85回答/安定ID/式番号/保持nodeを検証。
- 追加2pathは隔離コピーのみで実行。7case PASS、旧/新source/同一W038表示・採点維持、未知sourceおよびgraph改変・欠落・追加・重複はFAIL。実画面検証とは別。

## N11実装後 source f04e3d
- T1 exact mapping 2tool適用済み。旧/新sourceと不正graph/sourceの7case PASS。
- build PASS。transformation tests33 PASS。旧W038の現在behavior4 PASS（旧byte固定2項目は今回の内容判定に使用せず、原FAIL保持）。
- 各320/390/430/1440pxで39正答/109誤答、14段階・2原図、履歴/reload/resize/旧rev1–10移行、幾何PASS。原REPORT.sourceSHA=nullは維持し、実行した固定local buildのsource bindingを別receiptに記録。
- 6代表nodeのinitial/complete実画像と非作者source/image PASS。正式CI captureではない。
- R06/R07_VERIFYは正式受理。R07_SEMANTICはcapture登録条件が未充足。G2/公開/本人受入は未実施。N12本体は未変更。

## 正式CI・R07完了
T2の成功CI41617178126と、文脈画像改善後の成功CI41620137341を実APIで確認。後者source4a09de7a、artifact13223652318、ZIP sha256 c6e9868609860de690d791a8e7f9ce0de9faff7a80e564999c3901df255b4144。native CI/capture/screenshotを経てR07_VERIFY/R07_SEMANTIC PASS。修正版99 raw files、全四幅39/109、保存移行、原図/番号/契約/W038一致。N12 mode BASELINEは旧版保持のみ。公開/本人アプリ受入は未実施。main Gate①の実画像確認票を提示する。

## 2026-11-03 G2再開

G2-A01/G2-B-L01: 保持W038の未回答商7/3先出しを確認しG2 FAIL、issue W047-G2-L01を正式登録。必須初見を満たさないfirstPass=falseを保存し、PASSに変換していない。原報告と未確認面はCROSS_BLOCK_AUDIT_N11.md/evidence/N11_G2_*参照。G2結果初回提出はaudit_rows version欠落で拒否され、全行に正しいrelease SHAを付与して再提出。CODEの拒否条件は変更していない。未適用修正案の初回compileは数学依存不足、PYTHONPATH=/tmp/w046-sympyで再実行し静的PASS。製品ファイルはこの再開中に未変更。次はG2_CORRECTION_PROPOSAL.mdの具体案承認と修正工程。
