# W-GOV-006 / P-002 — 成果保全を絶対条件とする工作流システム修正案
Status: APPROVED
Date: 2026-10-10
Target: `rrikunagasige-dot/kyotsu-step-web` (Repository ID 1391122224)
Main checkpoint: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`
Supersedes: P-001. Original `PROPOSAL.md` is preserved unchanged; P-001 was NOT approved.
User feedback: 「また認めるわけにはいけない。今の成果をつぶさないということの前提で」

## I. 最上位前提
**現在の成果を一切つぶさないことが実施の必須条件。** 既存のアプリ・学習教材・研究済みQA・原本・GitHub運用・正式記憶を守れない変更は実行しない。保全の検証不能、未知の差分、新しいテスト失敗、復旧手順不明のいずれかを発見したら**STOP**し、ユーザーへ事実と修正版の作戦を示す。成功を装って先へ進めない。

目的は新規の工作流を作ることではない。以前定義した
`憲法から → live repo確認 → 正本/火柴図/Work復元 → 修正提案 → ユーザー承認 → 承認範囲のみ実装 → QA → PRで別途統合承認 → main検証 → 記憶更新`
を、成果を壊さず運用上も守れるようにすること。

## II. 守る範囲（変更禁止）
1. **既存アプリ全体：** `src/`, `public/`, `e2e/`, `package.json`, `pnpm-lock.yaml`, `.github/workflows/deploy-pages.yml`。URL、保存済み学習状態の互換、状態機械、ルーティング、数式・図版・選択肢・回答/フィードバック挙動を維持する。
2. **教材と正本：** `docs/`, `CHATGPT_README_FIRST.md`, `WORKFLOW.md`、Word母本、物理原教科書、図、QA報告、stable question/unit IDs、日中教材テキストを維持する。特に数学練習87–120、数学学習の公開 `math-sets` と残り4単元の `review` status、物理学習第1章、既存物理練習3問と第1章adapterを守る。
3. **過去と憲法：** `history/`、旧PR、旧ブランチ、過去Work・承認文書を削除/改竄しない。`governance/CONSTITUTION.md`, `governance/WORK_SYSTEM.md`, `governance/COMMAND_WORDS.md` の既存内容・意味はこのWorkでは変更禁止。意味を変える必要があれば別のConstitution Amendment Proposalを作り、STOPする。
4. **公開基準点：** 実装開始前に最新live `main` HEADを再検証し、保護ファイルのGit blob SHA台帳を作る。現時点の基準 `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33` は歴史的チェックポイントであり、以後のlive HEADを推測しない。

## III. P-001からの修正
P-001は「管理システムを強化すること」を中心に置いたが、P-002は**成果保全ゲートを各工程に優先**させる。一括変更を禁止し、実装前のSHA台帳・独立テスト・実装diff監査・既存CI回帰を通らなければ統合しない。
- 既存原則や承認履歴を書き換えて辻褄を合わせない。W-GOV-005のPR #49統合許可の記録が不十分だった点は新しいFindingに残す。
- `Status: APPROVED` という字面だけではユーザー承認を証明できないことを明記する。PRのCI成功もユーザー承認とは異なる。
- GitHubのRuleset/branch protectionなど**リポジトリ設定にはこの提案の承認だけでは触れない**。設定はテスト完了後の別提案・別承認。オーナーをロックアウトする設定は禁止。

## IV. 承認された場合だけ実施する段階
**G0 保全監査（読み取り中心）：** owner/ID/live HEAD、全保護ファイルのSHA、公開アプリ4モードの現状と公開/未公開区分、既存テスト・Pages成功コミットを台帳に記録。想定外があればSTOP。既存データに触れない。

**G1 独立した失敗シミュレーション：** 新しい `tests/governance/` にfixtureを作り、(a)未承認の実装、(b)修正版への旧承認流用、(c)対象外ファイル変更、(d)偽のAPPROVEDラベル、(e)誤ったrepository、(f)現在地の矛盾、(g)正常な既存Work、を検査。Node標準テストランナー等を優先し、新依存・既存教材変更なし。

**G2 追加的な管理監査だけを改善：** 上記試験が確実に動いてから `tools/repo-governance-check.mjs` と `.github/workflows/repository-governance.yml` を必要最小限変更。既存検査やJobは削除しない。新チェックは最初**非必須の検証段階**で動作確認し、現行のPR/アプリCIを不意に止めない。必須化はレビューによる追加判断。CIにユーザー承認の真正性を自動認定させない。

**G3 管理記憶を最小修正：** `CURRENT_POSITION.md` のPR #49統合済みなのに「未統合」とする残存記述を直し、`MASTER_MATCH_GRAPH.md`, `ACTIVE_CONTEXT.md`, `PROGRESS.md` と同期。旧記録は修正せず、記録上の矛盾は新しいFindingで追う。数学・物理4モードの実体は編集しない。

**G4 回帰・差分確認：** PRを統合する前に保護ファイルのSHAが100%不変であること、変更が事前指定ファイル内だけであることを機械比較する。既存のgovernance、数学練習、数学学習、物理第1章、型検査、ビルド、Playwrightの該当ゲートを実行し、必要ならスマホ/PC両方の代表操作を確認。新規失敗・保護差分が1件でもあればSTOP。旧来の既知失敗と新規回帰を区別して報告。

**G5 PRレビューと統合の別承認：** 検証済みPRのURL・diff・成果保全台帳を提示し、**該当PRのmain統合について明示的に了承されるまでmergeしない**。承認後もmainの実コミットSHA・Actions・Pages状態を確認する。もし意図しない影響が見つかれば、巻き戻し案（revertする具体コミット・影響範囲・検証）を示し、ユーザー承認なしに削除やforce pushはしない。

**G6 GitHub保護設定（独立した将来作業）：** G0〜G5が正常に完了してから、PR必須・required checks・force-push防止などの設定値とrollback案を別途提示する。**別の明示承認がなければSettingsには手を付けない**。単独オーナーがself-approval不可で締め出される状態を作らない。設定が確認できないなら自動強制は未完成と報告する。

## V. 実装範囲（P-002への後日の明示承認を前提）
- `work/items/W-GOV-006-workflow-integrity/` の新規記録・台帳
- `tests/governance/` の新規fixture/test
- `tools/repo-governance-check.mjs` および `.github/workflows/repository-governance.yml` の必要最小限の**追加的**検査
- `navigation/CURRENT_POSITION.md`, `navigation/MASTER_MATCH_GRAPH.md`, `memory/ACTIVE_CONTEXT.md`, `memory/PROGRESS.md` の矛盾のある記述だけ、必要なら `memory/LESSONS/` に新しい教訓

これ以外のファイルが必要なら勝手に範囲を広げず `REVISE-PROPOSAL` へ戻す。バージョンアップ・教材追加・一般的な「GitHub掃除」は対象外。

## VI. 受入基準
A. 保護ファイル全件のGit blob SHAが最新live mainの着手前基準と一致（追加/削除/更新ゼロ）。
B. 4モードの公開範囲・未公開status・主要挙動・既存CI/ブラウザ回帰に悪化なし。
C. 試験用の否定ケースは正しくFAILし、正常ケースはPASS。CIをgreenにするための検査無効化は禁止。
D. 承認・実装・PRレビュー・main統合・Pages・教材のユーザー評価を別々に記録。
E. 記憶と火柴図が矛盾せず、既存Work/原本/過去PRは保存される。
F. 不確実性はPENDING/BLOCKEDと明記。**未確認事項をPASS/DONEにしない**。
G. P-002を仮に実装承認しても、PRの統合とSettingsの変更にはそれぞれ新たな明示許可が必要。

## VII. Review state
**P-001: NOT APPROVED; superseded, original document kept intact.**
**P-002: APPROVED FOR G0–G4 IMPLEMENTATION ONLY.**
ユーザーはP-002提示後に「よし今は大丈夫じゃ修正よろしく。」と指示し、G0–G4の保全監査・テスト・管理実装を承認した。別記録 `APPROVAL_P-002.md` に範囲を固定する。**特定PRのmain統合とGitHub Settings変更は未承認であり、実行しない。**
