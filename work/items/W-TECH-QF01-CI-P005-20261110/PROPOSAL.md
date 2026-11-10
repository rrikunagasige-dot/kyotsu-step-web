Status: APPROVED

2026-11-10 JST 本人「ネットが切れた続けて」を直前のP005承認質問への直接回答として記録。原HTML d85eea6277ae8b62fe8432a240b3905f2007c3f4b7f10a995cf7c56a2321e3b9、固定2patch4022a9dd9be5a128fb7ed9913dbf58086a4138f0307cb61e625388b893964669。品質受入・main公開は含まない。以下は提示時の原文。

Status: PROPOSED

# P-QF01-COMMON-CI-20261110-005 — 残る生成検査と移行検査の補修

未承認・未適用。二次関数QF01の作成は継続中です。P004は本人承認後、原adapterで7件を一度適用しT03完了。最終source b0a512dの実CIは4成功・3失敗・1skipでした。広域877件は両pushで全成功、型/lint/259単体/build/画像6検査も成功しました。残る失敗に対する今回の具体差分は2ファイルです。

## 変更1：旧生成結果と現行教材をそれぞれ検査する

対象：work/items/W-MATH-036-ne02-n11-n12-guided-design/materialize.mjs。

P001で承認された説明注記により、旧提案書のwhole-file hashが旧APPROVALと一致せず3検査が停止していました。既承認の特定envelopeだけをfull/prefix/bodyの厳密hashで認識し、元の11設計入力のhash・元承認commitのGit原本比較を維持します。未知の注記や本文変更は拒否します。旧承認記録を更新しません。

注記だけを認識した試作では19中17成功・2失敗でした。残りはW036の旧N11/N12生成結果と、後に承認されたW047の現行表示が異なるためです。この試作の失敗も保存します。

最終案では--checkを読取専用にし、旧MATERIALIZED3件を固定Git原本・固定hashと再生成rawで厳密照合します。NE02は現教材との一致も維持します。N11/N12は既存W047のverify_current/projectionを固定helper・承認資料・計画・生成物・baseline commitに結び付けて実行し、双方のAPPROVEDモードを要求します。未知の現教材、改変helper/approval/plan/生成物、旧版への戻しは拒否します。旧MATERIALIZEDを上書きして一致を作りません。

## 変更2：N12移行1ケースの合計時間枠

対象：e2e/n12-derivation.spec.ts。

実CIでは旧35穴・現行46判断の全経路は両幅で成功しました。v1移行の短caseは両幅・各retryで合計30秒切れです。一部は保存・reset後の全検査を通過し、最後のreload中に30秒となりました。P004の準備2行の改善だけでは不十分でした。

今回、このv1移行caseにだけtest.setTimeout(90_000)を1行追加します。総待機許容量を30秒から90秒に広げる変更です。全assertion、移行/保存/reload/reset操作、expectの5秒制限、他caseの150秒制限、全体設定・retryは変更しません。ローカルのブラウザ起動制約は継続しており、新90秒案の実効果は未検証です。合格は新sourceの実CIで判定します。

## 範囲と承認後の工程

対象はrrikunagasige-dot/kyotsu-step-web（repository ID1391122224）、source b0a512d4b650b732eb43d096c2d930d3bda0abe7、tree a769fed74d8030912389f49c3edf792df316eb3aです。独立補修branch work/qf01-common-ci-repair-20261109、draft PR141を継続します。変更は固定2件とP005自身の記録だけです。全332src・教材・画面実装・進捗・stable ID・原文資料・原core/guard/定義・旧承認/設計/生成記録・依存・CI YAMLを保持します。

新technical Work W-TECH-QF01-CI-P005-20261110を原APIで開始し、固定入力とpatchを照合して2件を一度適用します。実親W-MATH-QF01-BUILD-20261109、同親の既存依頼QF01-CI-P003-CORRECTION-20261110、原CIRepair issueへ正規接続します。P003/P004の失敗と旧P002の別未解決依頼を保持し、過去Workの候補や承認を新差分へ書き換えません。

新commitに対する全該当CIを確認し、記録だけの補修でpush filterが対象外になる場合は既存CI専用補助branchで同一sourceを再検査します。失敗は保存し、新範囲は再提案します。全CI成功時だけ既承認QF featureへCAS照合して統合し、既承認の親保護12例外（P0018＋P0044）以外を維持して正式revise・新sourceのCODE/四幅320/390/430/1440・C09・G2を再検査します。P005によるsrc保護例外の追加はありません。main統合・本番公開・本人受入はこの承認に含みません。

## 検証の限界と承認境界

最終W036案は元の19検査が19/19成功し、正例2・負例14の別プロセス検査も全期待どおりです。旧注記/承認/設計・歴史raw・現教材/helper/marker/IR/plan・baseline環境・不明modeの改変を拒否し、歴史/proofファイルへの書込がないことも確認しました。後続のpipeline35件・runtime adapter4件、既存W038/W039/W037検査、共通lint/buildも局所で成功しました。3稼働workflowの60コマンドを棚卸ししています。N12の1行以外の全文一致と非作者の静的審査を保存しています。詳細はVERIFICATION.mdと原報告に記録します。ブラウザ後半は前段停止で未実行です。新2差分の実CI、新QF四幅/C09/G2は未検証です。旧失敗や限定PASSを全体成功へ拡大しません。

P004の承認は固定7after文面に結び付いています。今回のW036追加とN12の新時間枠はその外にあるため、WORK_SYSTEM §11・§12Bと元adapterのexact patch承認照合に従い、全文提示後の明示承認を待ちます。P005はnative未open・正本未適用です。

固定2patch SHA-256：4022a9dd9be5a128fb7ed9913dbf58086a4138f0307cb61e625388b893964669

native digest：ac151226dc3db3e098e35e1c7c131de0d511d262ae492fa48377451de5e64a2c

固定入力：92件（保持する既存24入力＋今回の全追加読取依存の和集合）。全before文面とhashはproposal/DECLARED_INPUTS.jsonに収録。
