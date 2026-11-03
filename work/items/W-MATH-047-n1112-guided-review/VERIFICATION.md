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
