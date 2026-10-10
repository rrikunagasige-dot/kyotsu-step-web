# W-GOV-007 — P-001: 旧GitHubのRepository OSを現在のGitHubで実際に守れるようにする

Status: APPROVED
Created: 2026-10-11
Target repo: `rrikunagasige-dot/kyotsu-step-web` (ID 1391122224)
Target baseline main: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`
Upstream reference ONLY: `paulfields83/kyotsu-step-web` (`b6687b571c8a292591e91cad84a452f180184ea1`)

## 1. 目的（What / Why）
新しいOS、教材、機能を作るのではない。旧paulfields83の管理体系をできるだけ忠実に移植済みの現在repoで、AIが次の順に運用するための不足を最小限補う。
`README / AGENTS → 指示辞典 → 憲法 → 現在地・火柴図 → 記憶 → 対象モード正本 → Work提案/承認 → 実装 → QA → PRレビュー → Memory Close`。
既存成果を壊さない。現在の数学/物理の実体が旧paulfields83と違う場合、現在repoの既存教材正本を優先し、旧資料は履歴のまま残す。

## 2. 実際に比較して判明した状態
- `governance/` の主要6文書：旧6/新6。 `WORK_SYSTEM.md` / `COMMAND_WORDS.md` / `CHANGE_PROTOCOL.md` は旧新版Git blob SHA完全一致。辞典と憲法は現repoのowner/authority調整が加わっている。
- `subjects/` の主要8ファイル：旧8/新8。公開・レビュー範囲は現repoの`navigation/MODE_STATE_2026-10-10.md`が優先。
- `work/templates/`の5種のWork記録はすべて現repoに存在し、旧版とハッシュ一致。
- `navigation/`の旧2文書は現repoに存在。現repoには公開状態ファイルも追加。
- `memory/DECISIONS/`旧7文書や`technical/`旧6文書は`history/imports/paulfields83-20261010/`内に原形保存。旧技術のbackend仕様を現repoの正本として昇格してはいけない。
- 現在の`README.md`は入口が短く、旧アプリ記述（古い問題数・Nodeバージョン含む）が主体。旧repoの人間向けOS目次ほど体系的にナビゲートできない。
- 現在の既存`repository-governance.yml`は構造検査を動かすが、すべてのPRについて提出された修正の承認済みscopeを機械判定するものではない。
- W-GOV-006のPR #53は狭域のpilotであり、指定された同一Workブランチだけでscope/承認記録のハッシュを検査。一般化できたと宣言しない。
- 現在のmainはブランチ保護もRulesetsも無効。CI成功はマージ強制ではなく、Git SHAは人間の本当の承認の証明にはならない。

## 3. 承認された場合の小さな実装段階

### R0 — 変更前保全基準
live owner / repo ID / main HEAD / PR #53未統合を毎回再確認。現repoの`src/`, `public/`, `e2e/`, `docs/`, `history/`, 原本・教材・公開範囲、元の憲法、Pages workflow、lockfileのGit blob SHAを記録。既存の学習・練習の4モードとstatusを保持。想定外の差分でSTOP。

### R1 — READMEを旧repoと同等の「人間の入口」にする
`README.md`の先頭に明瞭な日本語Repository OS目次を置く。辞典、憲法、Change Protocol、Work、`AGENTS.md`、CURRENT_POSITION、MASTER_MATCH_GRAPH、memory、4モード、QA、現在の実体を区別してリンクする。旧アプリ説明は壊したり消さず、古い数値は`HISTORICAL`と見えるよう明示。旧paulfields83のbackend構成を現repoに誤って書き込まない。リンクが実在することを検証。

### R2 — 既存OSへの接続を点検・最小補強
`AGENTS.md`と`navigation/`が、辞典の`EXACT / SIMILAR / UNKNOWN`、`憲法から`、Workの提案・修正版・承認、毎回のレビューリンク、4モードの正本階層を正しく参照することを確認。必要な明瞭化のみ追加。
現行6 governance文書と既存5 Workテンプレートはできる限り**変更ゼロ**。特に憲法・Work System・コマンド定義の書換えは禁止。もし意味変更が必要ならConstitution Amendment等の別提案へ戻す。
旧ADR/technical/workの資料は既存`history/imports/`から必要時に参照する「位置索引」を補うだけで、勝手に正本へ移さない。

### R3 — 普通の作業で効く、承認・scopeの共通PR検査
旧`tools/repo-governance-check.mjs`と既存GitHub Actionsの必須構造検査を壊さず、`tests/governance/`等に追加実装する。
提案だけのPRと実装PRを区別し、実装PRなら「Work ID / exact approved proposal / revision identity / permitted changed paths / reviewer-required status」を検査する。差分だけでなく削除・リネームも監査。
辞典の`EXACT / SIMILAR / UNKNOWN`運用、未承認/旧承認流用/偽`APPROVED`文字列/誤owner/他モード汚染/履歴削除の負試験と、正しい提案のみ/承認後実装の正試験を設計する。
**限界:** GitHubに書かれた`APPROVED`の文字やGit blob SHAだけではチャット本人の承認を自動証明できない。人間の承認証拠を読み、未確認は`NEEDS-HUMAN-REVIEW`と表示する。PR merge permissionは独立確認。
初回は非必須のpilotとして複数のWork種別で試験し、既存PRや既知lint等を無差別に止めない。GitHub Settings上の必須化は別承認に限定。

### R4 — 「憲法から」を新しいAgentで実地復元テスト
旧repoの`audit/FRESH_AGENT_RECOVERY_TEST_2026-10-05.md`（現repoの`history/imports/`）を参照。空の文脈のAIがrepo/HEAD→辞典→憲法→現在地・火柴図→記憶→対象mode→Work承認を正しく復元するか試験する。
シナリオは (a)単なる状態確認、(b)未承認の数学教材修正、(c)既承認の同scope続き、(d)似た指示`SIMILAR`、(e)レビューコメントによる案変更、(f)誤った旧paulfields83への書込要求。各ケースをPASS/FAIL/PENDINGで記録。
自動テストでは「AIが本当に読んだ」ことは保証できないので、再現可能な手順と手動実地監査を併用。

### R5 — CI・差分・復旧を正直に記録してレビュー
承認済み範囲内のGit差分を監査し、保護した既存成果はGit blob SHA全一致で検証。現在のgovernance、型検査、対象モードのテスト・build・mobile/desktop代表E2Eを検査し、旧来の既知lint24件・full-unit2件・旧UI E2E4件などの失敗は未解決と明記。緑化のため削除や隠蔽しない。
レビュアーへ具体的なPR URLと何が変わったかを提示する。**main mergeは独立の明示承認**、GitHub Rulesets/branch protectionはさらに独立の別承認。STOP。

## 4. 予定する変更範囲（例外が必要なら改訂提案）
- `README.md`: OS入口を上に追加。元の内容を非破壊保存。
- `AGENTS.md`, `navigation/CURRENT_POSITION.md`, `navigation/MASTER_MATCH_GRAPH.md`, `memory/ACTIVE_CONTEXT.md`, `memory/PROGRESS.md`: 必要な参照・記憶の追加に限定。
- `technical/README.md`, `work/README.md`: 旧技術を履歴として参照する索引・作業導線の必要な追記のみ。
- `tools/repo-governance-check.mjs`, `.github/workflows/repository-governance.yml`, `tests/governance/**`: 一般化のための独立監査・試験。
- `work/items/W-GOV-007-repository-os-parity/**`: 比較台帳、Work・提案・検証・教訓。
必須の既存`governance/`原文やWorkテンプレートを変更する必要が発生したら**実装を停止**して追加承認を求める。

## 5. 変更禁止 / 別の承認が必要
- 既存アプリ・公開教材・元Word/PDF/図・ID・保存データ・4モードの公開状態・元の`src/`/`public/`/`e2e/`/`docs/`/`history/`全体。
- `governance/CONSTITUTION.md`・`governance/WORK_SYSTEM.md`・`governance/COMMAND_WORDS.md`・`governance/INSTRUCTION_DICTIONARY.md`の改訂（今回必要ではない）。
- 旧GitHubからbackendや技術仕様を「現行」として丸ごとコピーすること、別リポジトリへの書込、過去のWork/PR/承認記録を改竄すること。
- PR #53のmerge/変更/閉鎖、main統合、GitHub Settings/branch protection、deploy設定変更、既存失敗テストの無断修正、無断cleanup。

## 6. 明示的な受入基準
A. 旧Repo OSの辞典/憲法/変更規則/Work/テンプレート/4モード/火柴図/Memoryの全経路を`PARITY_AUDIT.md`で実在リンク・権限階層・現行/履歴区別付きでPASS。
B. 新規Agentが`憲法から`でlive repository・mode・Work・承認を正しく復元できる実地検証記録。曖昧な指示や未承認案ではSTOP。
C. 承認とscopeの正試験・負試験がPASSし、一般のPRでもパイロットを実行できる。CIの結果は承認済みと同一視しない。
D. 全既存保護ファイルのSHA差分ゼロ（追加・削除を含む）、4モード公開状態不変、既存教材/原本/過去PR不変。旧repoのbackendを混同しない。
E. 既知失敗の扱いに変更なし。実測しなかったテストはPENDING、失敗したらFAILとする。
F. `main`とPagesには承認前の変更なし。実装後も別のPR merge承認とbranch settings承認を待つ。

## 7. 承認段階
- **P-001: APPROVED FOR R0–R5 IMPLEMENTATION ONLY; merge and settings NOT APPROVED.**
- ユーザーの「これでいいと思う。じゃよろしく。」は、旧GitHubとの比較と具体的な新しい提案の整理を依頼したものとして記録。詳細R0–R5・変更範囲は今ここで初提示するため、実装の明示承認として先取りしない。
- P-001へのユーザーフィードバックで範囲が変わる場合はP-002を別に作り、旧案を消さずに再審査。

### Approval
Status: APPROVED FOR IMPLEMENTATION ONLY
Approved by user: YES (in this conversation)
Approval date: 2026-10-11
Approval evidence: 「我觉得可以继续」 (direct response to the explicit P-001 implementation question; no main merge or Settings consent)

### Review History
- Review status: P-001 EXPLICIT IMPLEMENTATION APPROVAL (user replied 「我觉得可以继续」 to the exact request); separate PR merge approval missing
- User feedback: goal is ONLY faithful old Paul-side OS parity and reliable enforcement on current repo; preserve existing target achievements.
- Supersedes: none (new Work; W-GOV-006 stays separate)
- Superseded by: none
