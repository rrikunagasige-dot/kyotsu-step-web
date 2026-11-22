# 操作記録

- 2026-11-22 goal再開。前ターンは新ZIP作成・回復案と証拠保存を完了したprogress。今回は元ZIP待ちへ戻らず、checkpointの具体的技術検証へ進んだ。
- 主担当が未採用read viewとtail writerを別pathへ作成。元core/正式Store/公開先は変更していない。
- axis_reviewがread33/tail32の別回帰を作成。authority_reviewがproof・projection・依存・定義移行・サイズ・junction境界をレビュー。
- 既知prefix ID不足、極大timeの例外漏れ、書読サイズ差、junction逸脱、不正IDの自動採番を検出して限定補修。原FAILと修正後を区別する。
- 実temp TEST_FIXTUREで33＋32件を実行し61PASS/4SKIP/失敗0。Windowsのsymlink特権不足4件を未検証として保持。実二process競合は1追記だけ成功。
- canonical account/repo/main494b6b0をAPIで再確認。元Git1f10の2blobを取得しGit SHAとseed SHA256を照合、別ディレクトリへ回復証拠を保存。現appは不変。
- 新schema/Store接続/定義移行/publisher再結合のpath・動作・検証・未確認を本具体案へまとめた。正式採用・新CI・公開・本人受入は未実施。
- 本人が固定版PROPOSAL SHA2561d167fe02fa7e6fa8480f45e5c0bb02d5d401f869e82952940311103284ee86bへの採用質問に「この限定案を採用して進める」と明示回答。原文・質問call ID・保存commitをWORK.mdへ保存し、同じ案の採用確認は繰り返さない。以後の正式実装はこの限定scopeで進める。

- 承認後、元core9ee19f65から専用worktree/branch qf01-recovery-core を作成。rootがcheckpoint/Store factory/Runtime/preflight/definition/CLI、authority_reviewが13consumer、axis_reviewがTEST_FIXTURE回帰を担当。Store/Gitはrootのみが書く。
- 元candidate325bと5pathのbefore bytes、全protected360を確認してから、material291fc142と同一の検証済み修復5pathを新worktreeへ同期。before/after SHA256照合、protected不変を確認。旧patch_appliedや新T03 filewriteは記録していない。
- 読取レビューで通常Store専用pathの大文字小文字/..経由初期化と、-Bだけではpyc読取を止めない点を発見。正規化した専用path拒否とSourceOnly loaderへ限定修正。最終回帰で再確認予定。
- checkpoint current-candidate proofを新技術ownerと現在R06claim/compileへ結ぶ接続を制作中。元の版移行guardを通常経路で保持する。

- 2026-11-23 JST: codec/tail65とRuntime/definition18を隔離TEST_FIXTUREで検査し79PASS/4SKIP。元入力/実装の前後hash不変。実compilerも現在sourceで原canonical出力一致を確認。依存不足による初回FAILと補修をVERIFICATIONへ保存。正式台帳はまだ作成していない。

- 92件の直接captureを保存後、全Git diff guardとCLI SourceOnly起動を追加。元の成功を補修後全件PASSとは表示せず、新分岐の焦点検査と固定Linux CIへつなぐ。source-only hash導出とcaller全bytecode証明の範囲を分けてrunbookへ記録。
- Git push dry-runはCLI credential未設定で失敗。remoteは未変更。利用可能な正しいGitHub接続のGit object APIで同一treeを保存し、返却された実commit SHAを固定してから台帳を初期化する。

- 最終焦点run2は6/6PASS。現在97件を未実行のLinux全件PASSとせず、旧92run・修復前focused FAIL・修復後6runを分けて保存。全実装と修復5pathを固定し、以降の正式操作はfresh source-only CLIから行う。

- 本人の32file送信許可後、GitHub実source A=abe5ff13/tree67e55…を固定し、local1dcは別branchで保存。実bootstrap13743・定義移行13744で原users/旧結果を保存、旧8結果を現在入力では失効。新RECOVERY T01/T02/T03と教材R01〜R03をfresh CLIで実施。
- 固定Linux CIのstartup/既存lint/artifact path/比較stdoutの失敗を保存して修復し、最終run45044989004は全体SUCCESS。現在97（95PASS/2Windows専用SKIP）と通常267等、build、changed TS4 lint、既存全体28診断のbaseline一致、入力17件不変を確認。検査source Aとworkflow HEAD0d1cを区別し、artifact14763387458の実SHA3858426d…/CRC/現在bytesを照合後、新RECOVERY技術T04を実claim/submit。result702919fa64a60fa8085fa6ed33c6d9148ee4f84da0a1a24c7939eae31ccea51d。教材Gate/公開/本人受入は認定しない。
- 現2名維持の本人指示から審査方法を読取調査し、追加具体案D02（SHA706ac7b5…）を提示。既存独立審査要件の変更を含むため実採用待ち、Dコードは未実装。原1d案と原記録を上書きせず保持。

- 続報：本人が固定D02へ「限定D02案を採用して進める」と実回答。元D02 raw hash706ac7b5…を確認してcore/publisherの既存技術Workへ同一bytesを保存し、実採用転記JSONを新しいreportsへ保存。旧pending記録は当時の履歴として保持。
- rootがRuntime/checkpoint/integration/adapters/CLIを、axisがteam/team_transportと既存checkpoint回帰を担当。authorityは同じpublisher checker/testを担当。現在2名・孫なし・Store/Git rootのみを維持。body authority→段階input→後続receiptの二段階参照、原sourceと現在rendererのdual binding、両実報告/CODE/作者履歴・限定finding解消を実装中。
- 最初のD fixture2件はrootの最終checkpoint追記と重なり、実source hash変化/RUNNING_CORE_IMPORT_IS_STALEにより無効として保存。明示freeze後の再runで正確採用/原plan-users-seal保持は成功、target artifact名のfixture不一致は拒否。fixtureのみ補修して再検査し、失敗をPASSへ改名しない。新Git source/definition/実Gateはまだ適用していない。

D02実装追補（2026-11-23）: 固定採用回答をfile evidence QF01-D02-ACTUAL-USER-ADOPTION-20261123として専用台帳seq13849へ実記録。D02専用authority/実2名の寄与開示receipt/現CODEとfinding解消条件/後続定義移行/既存RECOVERY候補の読み取り専用照合/直接CLIを実装中。通常Store/team規則と教材5pathのbytesは維持する。焦点20回帰はPASS。追加6回帰は5PASS・1FAILで、同一定義内の旧T01入力が候補再結合後も失効しない点を検出したため補修・再検査中。旧FAILと実行前後hashを保存し、合算して現在123件成功とは扱わない。新Git B/固定Linux全体/新current技術結果/教材Gate/公開/本人受入は未実施。

D02入力補修後の焦点確認: 既存RECOVERYのT01〜T04だけ、新候補照合proofRef/authorityRef/current candidate manifestを入力へ結合。owner positive再検査は1/1 PASS（17.315秒）、source/runbook/固定入力/D02提案の前後hash一致。旧plan/users/results/原snapshotと実file bytesは保持し、候補再結合後の旧T01入力失効を確認。rawはworkspace qf_audit_download/checkpoint-native-tests/d02-native-owner-repair-run-1.log/.json。最終sourceの全123件と通常workflow/公開側全体は、これから実Git固定版のLinux CIで確認する。method authority/教材Gate/公開/本人受入は未実施。
