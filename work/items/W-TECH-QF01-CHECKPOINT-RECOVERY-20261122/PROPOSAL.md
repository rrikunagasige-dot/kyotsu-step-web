# P-QF01-CHECKPOINT-RECOVERY-01（未採用）

## 問題と到達させる状態

元ZIPは未取得で内包も未確認。一方、固定publisherから承認済みseed/baseState/299objects/nodesとanchor13742をhash検証でき、現修復sourceと実検証証拠も保存できている。今のStoreはseq1/zero始点の全鎖だけを読み、Runtimeはopenedから状態を再生するため、この保存状態から正規に続ける接続がない。

QF01の対象Workに限ってcheckpointから再開し、旧資料を不変保存したまま、以後の実イベントを13743から連続して記録できるようにする。原13742件を再生成しない。教材の見せ方・教授順・判断・正答・ID・学習保存は本案で変えない。既存の通常Storeの検証はそのまま保つ。

## 入力・信頼境界

- canonical repo rrikunagasige-dot/kyotsu-step-web / ID1391122224。元core9ee19f65、元publisher55d844f2を固定。
- 元contract raw SHA256 b5f49f53b3895a8169f817a91efd376b4e73b17526d5b08bcb77e2b7fa4aee30を、外部入力と一緒に自己選択できない固定値として保持。
- 元blob Git SHA ccb58fd71a927953093a567dc9732d6730fdda12、SHA25614586a74…、展開SHA2566ef58796…、baseState digest44d23caf…、全299objects/nodes/原team/feedbackを元contractへ照合。
- anchor13742/head586be1a3…を不変で保存。原candidate325b7003と現在の製品修復291fc142を区別する。
- 原2sourceはGit1f10ecbcから回収し、各Git blobと元source_manifestを照合。再構成snapshot digest08d0e50a…をGit由来の新しい回復証拠として扱い、旧opened envelopeを創作しない。
- 未回復の版archivef6e2de67…、元受付snapshot8911ed35…、全prefixのnonce/他Work/queueは欠落・未知のまま保持する。

## 採用する動作

1. 新しい専用pathへ一度だけcheckpointを初期化する。既存Storeの上書き・空Storeへのすり替えを拒否する。回復元・scope・欠落範囲・採用案・実行者と実時刻を新しい回復記録へ結ぶ。
2. 完全な新suffix、真正な原event部分集合、feedback本文projectionを別APIにする。teamは原135件を保存し、承認原event等を含む既知envelope138件のID再利用を拒否する。全prefixのnonce確認済みとは表示しない。
3. suffixは全Workのseq/previous/hashを先に検証してから、対象Workへ投影する。旧headから新しい実操作だけを追記。expectedHEADのCAS、単一writer、既存eventの非上書き、改竄・重複・途中欠落拒否を維持する。
4. Runtimeは固定baseStateのdeep copyに実suffixを適用する。未知Workのstateやglobal queueを空に変換しない。旧snapshot/版archive/元受付に依存する未対応操作は明示的に拒否し、調査・非破壊検査とは分ける。
5. 新実装で変わるDEFINITION/serviceをfresh processで導出し、checkpoint専用の定義移行preflightを行う。全旧結果の保持・失効理由、原承認・scope・元hash・候補manifestを固定する。旧PASSを新PASSとして移植せず、入力が失効した必要nodeを正規に再検査する。
6. 原snapshotはGit由来証拠へ明示的に接続する。原承認の本文・対象案・scopeが同じ場合は承認を維持する。技術方式の本案承認と、同じ公開方向の再許可を混同しない。
7. 実exportに基づいてsource/core/publisher/pinsを再結合する。publisherの旧MERGE履歴を保存し、現anchor後のMERGEだけを数える修復も含める。現在版CI、R07_VERIFY/SEMANTIC/G2、実CAS/DEPLOY、公開後検査を必要な根拠が揃った順に実施する。後述の未確認事項が必須依存ならそこで止め、この方式の採用だけで公開完了を保証しない。本人受入は代行しない。

## 適用済み候補のR06再検証

旧transitionの技術owner state、原T04、patch_applied envelope、版archiveは未回復。既存のALREADY_APPLIED再検証へ架空のownerや旧イベントを渡さない。現候補を旧325bへの再適用として扱うこともしない。

本案では`qf01-checkpoint-current-candidate-proof/1`と、対象限定の`reconcile-checkpoint-candidate`を追加する。入力は固定checkpoint/anchor、原source1f10、旧承認後material325b、製品修復candidate291fc142、現在core/definition/service、新技術ownerの実T01〜T04結果ref、実Git差分、全対象/保護manifest、実compile出力、現在検査refとする。

対象の適用済み製品差分は以下の5pathだけ。旧325bのbefore bytesと291fc142のafter bytesをGitから照合し、他の教材data/ID/保存/revision/採点と保護filesを不変確認する。Work文書の差分は製品差分と分ける。

- src/components/textbook/GuidedMathReadingFlow.tsx
- src/components/textbook/guided-math-reading.css
- src/components/textbook/QF01ReadingRevision3.test.tsx
- src/domain/transformationReading.ts
- src/domain/readingSourceViews.test.ts

新proofは「現在の候補が適用済みで、現在版で検証した」証拠であり、旧patchイベント復元・旧技術owner閉鎖の証明ではない。新sourceと新definitionへbindし、R06の有効な現在claim/正規compile/現検証へ結ぶ。再filewrite・旧patch_applied追加・自動R06 PASSは行わない。必要なら原教材具体案を保存したまま、この5pathの機械的修復と再結合に対応する改訂patch manifest/承認束を作り、本案の共同採用確認を対象へ正確に結ぶ。旧教材案の承認を消したり、新patchまで同じ承認があったことにしたりしない。

新たに状態を作れる技術Workは、`W-TECH-QF01-CHECKPOINT-RECOVERY-20261122`（core/回復接続）と`W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122`（publisher7path）だけとする。旧owner状態をこの2Workへ改名・転記して済ませず、今回の実T01〜T04を記録する。新publisher contractはこの実publisher Workと現在exportへ結ぶ。旧7path制限をcore全体へ拡げたことにはしない。

bootstrap自身は本案の採用原文・固定コード/入力・隔離先・実file作成/検証結果を回復記録へ保存し、旧T03イベントや旧T04の代わりにしない。実装が既に隔離先にあるものは、書き込んだ時点の実証拠と現在の再検証を区別し、今回のT工程でも未実施のfilewriteを実施したと記録しない。新しいT04が現在definition/service/inputで成立するまでは、上記R06 reconciliationを受理しない。

## 未確認の受付・queueが残る場合の到達点

原資料回収、実装、検査、対象の意味審査は先行できる。G2は現在の対象inventory・既知指摘・保護範囲に必要な情報を列挙し、未確認を0件/PASSに変換しない。

旧受付三件の派生receiptを付ける`link-correction-receipt`、元受付を要する事後sweep/R08/L01/閉鎖は、元状態の正規回復またはその欠落を扱う別の明示案が成立するまで未完了として維持する。G2/公開前判定自身が未回復の受付・queue情報を必須依存とする場合は公開前で止め、追加の根拠か改訂案を用意する。関連しない他Workの未知状態を「未実施／完了」と断定しない。本案だけで全旧Workの閉鎖や公開成功まで自動認定しない。

## 変更するpathの上限

この表以外が必要になれば、理由と差分を示して改訂する。無関係なWorkへ汎用的な例外を広げない。

| path | 変更目的 |
|---|---|
| workflow/checkpoint.py（新規） | 固定proof読込み、typed projection、anchored suffix、移行preflight |
| workflow/store.py | 通常Storeを保った明示opt-in factory/共通読取interface |
| workflow/runtime.py | checkpoint初期state、suffix適用、Work/open/既知ID、専用移行 |
| workflow/integration.py | feedbackと実receipt bindingの出所を区別 |
| workflow/team.py、workflow/team_transport.py | 原team部分集合＋実suffixから作者/担当/指摘を読む |
| workflow/requests.py、workflow/impact.py | 未知の他Work/queue/旧受付依存を明示する |
| workflow/views.py | anchor・suffix・欠落・未知を表示 |
| workflow/capabilities.py、workflow/learning.py | feedback projection等の版対応 |
| workflow/runner.py | Git由来原source回復証拠を明示接続 |
| workflow/agent_guard.py | 実harness証拠・nonce参照をcheckpoint対応、未知を許可へ変換しない |
| workflow/adapters.py | patch/版移行/旧archive guardを保持し、未対応は拒否 |
| workflow/legacy_diagnostics.py、workflow/team_migration.py | checkpoint対応または明示的unsupported拒否 |
| workflow/definitions.py | checkpoint実装も工程hashへ結ぶ |
| workflow/cli.py | 明示preflight/init/migrate操作。statusだけで初期化しない |
| workflow/test_checkpoint.py、workflow/test_checkpoint_runtime.py、workflow/test_checkpoint_definition.py（新規） | proof/永続化/再生/移行/失効/通常互換/拒否回帰 |
| workflow/INTEGRATION_RUNBOOK.md | QF01限定の手順・出所・未確認範囲 |
| .github/workflows/qf01-publisher-g3.yml | 新core/source/publisherの固定CI経路 |
| tools/release/qf01-publish-contract.json、qf01-publish-check.mjs、qf01-retained-adapters.mjs、qf01-browser.mjs、qf01-publish-check.test.mjs、qf01-retained-adapters.test.mjs | 実export由来の再結合・旧MERGE保持・現版QA |
| 上記の製品修復5path（適用済み・再検証対象） | 新しい製品修正の拡大ではなく、実Git候補と現在proof/承認束へ結ぶ |
| work/items/W-TECH-QF01-CHECKPOINT-RECOVERY-20261122/{WORK,PROPOSAL,ACTION_LOG,FINDINGS,VERIFICATION}.md | 本技術案・実行・失敗・hashを保存 |
| work/items/W-TECH-QF01-CHECKPOINT-PUBLISHER-20261122/{WORK,PROPOSAL,ACTION_LOG,FINDINGS,VERIFICATION}.md | publisher7pathの実T工程を別に記録 |
| work/items/W-MATH-QF01-P046-R3-continuation-20261122/{WORK,ACTION_LOG,FINDINGS,VERIFICATION,RECOVERY_HANDOFF}.md | 継続Workの現在地を更新 |
| work/recovery-checkpoints/qf01-p046-r3/origin/{publisher-contract.json,BUILD_AUTHORITY.blob,APPROVED_MATERIAL_SEED.json,NODES.json,ORIGIN_SOURCE_PROOF.json,ORIGIN_SOURCE_SNAPSHOT.json,TEAM_PREFIX_SUBSET.json,KNOWN_PREFIX_ENVELOPES.json,FEEDBACK_PROJECTION.json} | 元固定入力とGit由来回復証拠を不変保存 |
| work/recovery-checkpoints/qf01-p046-r3/CHECKPOINT_ORIGIN.json、events/*.json、artifacts/*.json、preflight/*.json、reports/*.json | 新しい実記録・実結果・preflightを専用namespaceに保存。既存pathを上書きしない |

新schemaはQF01 checkpoint origin/proof/suffix/preflightだけ。元イベントschema、通常Storeのzero始点検証、原承認、教材schema、学習保存schemaは緩めない。旧guardを単に無効にしない。prototypeのowner-token lockを正式採用する際は中断照合と永続化境界も検証する。PID推測による古いlock削除は導入しない。

## 検証と採用条件

読み取り試作33件と永続tail試作32件を作成し、61PASS/4SKIP/失敗0。実二processの同HEAD競合は1件だけ追記、再openで13743/13744とhead継承を確認。symlink4件はWindows権限不足で未検証。junction差替えは実検査PASS。これらはTEST_FIXTUREだけで、正式Runtime/Gateの認定ではない。

正式採用後は、正常再開、原承認不変、全旧結果disposition、現在definition/service/inputの失効、原資料proof、typed team/feedback、未知queue拒否、通常Store互換、改竄・部分書込・競合・再起動・symlink・中断lock・現publisher終端拒否/受入を検証する。Linux/固定pnpmの必要検査も実施し、ローカル試作結果だけで完了としない。

## 承認の対象

確認済みcheckpointからの対象限定再開、必要な定義移行、適用済み製品5pathの現在proof/R06再検証、上記path内の接続・回帰・再結合を採用すること。元資料や承認・既存成果を消さず、欠落を明示して現在版の必要工程を実行する。公開方向の既存同意は維持し、本人受入・未実施検査のPASS代行は含めない。

現時点では未採用。WORK_SYSTEM§11の「schema/API contract change not covered by the proposal」「replacement of the chosen technical approach」に該当するため、元の教材案やgoal再開だけを本案のexact承認としない。
