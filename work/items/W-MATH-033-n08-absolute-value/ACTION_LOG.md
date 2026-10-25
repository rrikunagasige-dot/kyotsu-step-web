# N08 作業記録 — 2026-10-25

1. 接続GitHub profile rriku ID332552275、canonical repo1391122224、live main3c1cd665を照合。独立branch work/n08-absolute-value-design-20261025を作成した。
2. 現在地・憲法・修正命令・WORK_SYSTEM §12A/12B・数学教科書spec・typesetting教訓・W032受入とL01・旧N08 Q05 hint承認を復元。
3. 既存import-word.pyで原Wordを再抽出。N08の35block/30数式/12markersを確認し、OMMLの根号を保持した。原図はmedia/image5.pngとappのn08-f01.pngがbyte一致。
4. 旧N08ソースの12設問を忠実に投影し、新候補とは分離して診断。36思考node/31穴/12段階を具体化。旧12IDと正答を自動照合した。
5. 候補IR・原資料coverage・compile・可視状態投影・9恒等式を実行。SymPyは既存の固定ML用venvにあるものを使用した。base Pythonでのimport失敗を、検査成功に読み替えていない。
6. 共有StoreのN07閉鎖証拠を保持してW033を開き、既存production/2のR01–R04を実行。Work入力のcache/phase/図hashの誤りは、中央codeを変更せず契約に合わせて修正した。過去の失敗receiptは保持。
7. 現在はR05_APPROVAL@n08。N08具体案の承認は未取得。N07受入、P004基盤承認、今回の開始依頼を代用していない。
8. git diff --exit-code -- src public tools workflow は差分なし。アプリの再配信、ユーザー品質ラベル生成、モデルfit・昇格は実施していない。

生成物: PROPOSAL.md、NODE_DESIGN.md/json、CANDIDATE_IR/COMPILED、COMPLETE_SOLUTION、SOURCE_COVERAGE、IMPACT_LEDGER、CASE_DISPOSITIONS、生成火柴図とcheckpoint。

最終意味監査: Q10逆向きの回答前本文に完成式の先出しを発見。提案・IRを改訂し、Runtime.reviseで承認対象hashを更新した。R01–R03の有効な既存結果を保持し、R04を実際に再検査してR05へ戻した。機械検査だけでは足りなかった事実もFINDINGSへ保存。

承認後: N08の凍結設計への直接承認を記録。新規3ファイルと既存3ファイルの限定実装は、Work専用のmaterialization adapterで原不在・backup・出力hashを共有Runtimeへ記録。汎用adapterの置換専用制約を、新しい承認を捏造したり中央codeを書き換えたりして回避していない。旧版専用テストは凍結N08 v3 fixtureへ結び、現行N08を別の5検査で確認。過去版・他単元の検査を削除していない。

最終内部QA: source ea47dd97 / CI40162373237 SUCCESS。620 learner・7専用・39 authoring・buildと、4幅の全31正答/74誤答・全履歴・v1/v2/v3移行・廃止誤答再開を確認。実画像監査とR07/G2を同じsourceへ結び、publication-v2 intentを記録。mainの公開holdを493b62a8の厳密source pinへ置換し、既存Pagesへの配信を開始。配信成功はまだ未記録。

公開完了: run40162687421 SUCCESS。公開N08の31回答/74誤答/履歴/3版移行/廃止誤答再開の四幅検査、既存N07と第一タイトルのcompile/公開保護検査を完了。実HTTPSでsource ea47dd97、workflow493b62a8、IR hash、既存namespace、N07/第一タイトルの保持を照合。G3_HOSTを実台帳へ記録しG3_FINAL@n08へ進めた。N08受入や品質正例、学習fitを捏造していない。
