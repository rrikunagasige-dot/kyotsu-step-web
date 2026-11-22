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
