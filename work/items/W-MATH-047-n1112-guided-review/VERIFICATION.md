# 2026-11-04 G3現在の検証範囲

最終publisher6cd11/run41754189894は実success、publish/配送6step skipped。原73input・教材69path・実4blob、原ZIP全2665filehash、原3manifest、N11/N12全85回答/236誤答×4幅と保持N08/N09/N10、focus/reset390を照合しA/B実監査PASS。技術W-TECH-052はT04/L01/Z01正式DONE、親G3_HOSTは未配信。詳細はG3_FINAL_TECHNICAL_CHECK/G3_FINAL_CI/G3_ACTUAL_REVIEW_A/B/G3_TECH_DONEと両generatedを参照。

技術試験と限定表示確認であり、実公開HOST・本人最終受入・全repositoryCIgreen・全1452PNGの意味/全長大履歴行読了を意味しない。原JSON1212件はlossless archiveで全byte保存、7代表PNGも原byte保存。

以下は以前の検証履歴。NOT_RUN/未適用は記録時点の状態である。

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

## 2026-11-03 W047/G2-R1 承認・限定適用

8faa9b19の実発言をR1へ記録。R1承認planのsource coverage/aliasを生成器が追従しない原FAILを検出し、承認planの完全一致を保つため限定技術patchを既存adapterで適用（W-TECH-050初回→W-TECH-051整合補修、初回を成功へ書換えない）。汎用JSON ID順guardは変更せず実拒否を保存。Work専用のexact移行CODEは17動的/負例/復旧検査とA/B審査を経て使用。新実render初回所見は旧IRの初見再利用と区別。R04では旧finding解決の現在入力版への束縛不足、同taskの報告変更、figure.verify空入力をCODEが拒否し、改訂assignment/実画像確認/原図2件検査で補修、原拒否を保持した。R06適用後の入力失効はclaim照合→R01〜R06再結合で修復し、同じpatchを再適用していない。現在R06受理/R07待ち。独立CODE検証はevidence/r1-independent-codeへ保存、実CI未取得と区別する。

## 2026-11-03 R1固定sourceのR07完了

source 2b7780b97bf8c3bde463742e71bf3e816ea8b562、実CI41635935097成功、artifact13231101167/ZIP0876cff…/raw112件を照合。74PNGを既存capture経路で登録。残留lockを原session終了・PID開始時刻・台帳連鎖で照合して復旧し、既登録capture再利用のidempotent取込で完了。A実CI初回・B非初回補足を保持。R07技術/意味PASS、CI-V06 VERIFIED_FIXED。G2-L01は実症状修正を確認し統合閉鎖は次G2へ留保。修正版Gate①シート作成。旧固定CI二本FAIL原ログ保持。未公開・N12未適用・最終受入未実施。

## 2026-11-03 Gate①了承・N11 G2と後続順序

ac2ac082実発言「いいよ続けて」を提示済み修正版二箇所/source2bへの限定画面了承として記録。G2の10監査面PASS、原G2-B-L01を同claim/facet/blockの現在targetへ対応付けVERIFIED_FIXED。BのfirstPassの初期false（既視/非盲検の意味）とsource2b統合対象初回の意味訂正を開示、復元版を直接退避原版とは称していない。A監視/B正式統合審査を保存、N11限定PASS。native nextG3_HOSTがN12より先のため、未適用S1を具体化。既存CODEのscope完全一致guardを外さず、新scopeの実承認待ち。CODE静的差分検査で権限拡張・paths追加・教材/graph/保存/旧検査の変更なしを確認。未公開・N12未適用。

S1案の最終照合：既存CODEのG3_FINAL@n11→G3_HOST@n12順と単一release_unit受入をAが指摘（S1-A04）。実HOST証拠を両routeで本人提示前に取得し、一回の実確認を同source/sessionのunit別二記録へ対応付け、未到達node/権限/評価を捏造しない手順を補足。A/B静的PASS、元OPEN原報告を直接保存。提案hash179e750…に再生成し、ネイティブplanと元user scopeは変更せず実承認待ち。
