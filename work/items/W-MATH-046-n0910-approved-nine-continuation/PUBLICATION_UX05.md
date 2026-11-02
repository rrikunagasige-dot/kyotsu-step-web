# P-W046-PUBLISH-UX05 — 公開承認対象

状態：本人承認待ち。UX05本体の再承認ではない。

- [Draft PR #135](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/135)
- head `900644e0663e8e5f027d2a7827e030182ea2da8c` / base main `6bc54447ef015a2a579a56a5966ceb58a0600d3a`
- 製品source `691d3d160493bf684ca8a31a22476d31d98caeec`。N09r8/43part・N10r5/60part。
- main差分は `.github/workflows/deploy-pages.yml` と `tools/release/w046-publish-check.mjs` の2ファイル。Work branch全体や教材群をmainへ一括mergeしない。既存namespace/Pagesを使用。追加サービス・費用なし。

承認後、このheadのCI・main不変を再照合してmainへ反映し、既存Pages workflowで固定sourceをbuildする。32source byte hash、配信121asset、N09/N10四幅・正誤・履歴・旧版・保存/resetを公開前に検査し、成功時だけupload/deploy。公開後は実配信byte/操作を照合して実在URLを提示する。本人総チェックOKは別に記録し、公開承認やCIを総合受入へ読み替えない。

最終sourceのローカル製品検査は上記121asset/両unit四幅とN08/N11の既存320検証がPASS。代表細部OKはa39 pilot、残23は本人承認済み案を適用。初回の式番号余白はN09/N10へ横断して共通一条件を修正し、新source全幅で再確認。個別証拠はevidence/ux05-full。

main採用WORK_SYSTEM§12Aは細部OKを「not … main/production publication permission」と区別するため、この2ファイルのmain反映・既存Pages再公開だけを別に承認いただく。承認済みUX05案を聞き直さない。正式Store26イベント欠落の本人特例と既存他Work38件は維持、正式受理receipt/Gold/fitは作らない。
