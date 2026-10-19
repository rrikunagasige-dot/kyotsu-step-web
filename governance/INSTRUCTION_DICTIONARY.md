# 指示辞書 / Instruction Dictionary

Status: CANONICAL
Version: 1.6.0
Updated: 2026-10-19

## Purpose

この辞書は、ユーザーがGitHub上の塾プロジェクトに対して与える**上位命令**を登録する。

Agentは、登録された命令の意味を勝手に拡張してはならない。
辞書に存在しないGitHub命令を、推測だけで実行してはならない。

---

## Instruction Matching Rule

ユーザーのGitHub指示は、実行前にこの辞書と照合する。

### 1. EXACT

Canonical Phrase と明確に一致する場合、そのCommandとして処理する。

### 2. SIMILAR

登録済みCommandに意味が近いが、Canonical Phraseと一致しない場合:

1. 実行しない。
2. 最も近いCommandを特定する。
3. Command ID / Canonical Phrase / 実行内容をユーザーへ提示する。
4. **「今回この指示として扱いますか？」** と確認する。
5. ユーザーが肯定した場合のみ、そのCommandとして処理する。

類似していること自体は:
- 同一Commandであること
- Aliasであること
- 実行許可

を意味しない。

### 3. UNKNOWN

適切な登録Commandが存在しない場合:

- GitHub変更作業を開始しない。
- その指示がGitHub作業に重要なら、通常Workを停止する。
- まず指示辞書の不足をユーザーへ報告し、辞書修正案を優先する。
- ユーザー承認前に新Commandを勝手に登録しない。

### Alias rule

自然言語表現をAgentが勝手にAlias登録してはならない。
Alias化にはユーザーの明示承認が必要。

---

## CMD-ROOT-001 — 憲法から

Status: ACTIVE  
Class: ROOT  
Priority: HIGHEST  
Canonical Phrase: **憲法から**

### Purpose

GitHub上の正式なRepository OSを起点に、現在の正本・現在地・作業状態を復元し、以後のGitHub作業を正しい前提から開始できる状態を作る。

これは最上位の起動命令である。

### Stage 0 — Repository identity verification

他の資料を読む前に、まず実際のGitHubを確認する。

最低限:

1. Repository が `rrikunagasige-dot/kyotsu-step-web` であること
2. authoritative branch が `main` であること
3. live `main` の現在HEADを取得すること
4. そのlive `main` 上で必須Repository OSファイルの存在を確認すること

必須確認対象:

- `AGENTS.md`
- `governance/CONSTITUTION.md`
- `navigation/CURRENT_POSITION.md`
- `navigation/MASTER_MATCH_GRAPH.md`
- `memory/ACTIVE_CONTEXT.md`
- `memory/PROGRESS.md`
- `governance/INSTRUCTION_DICTIONARY.md`

### Critical rule

必須ファイルについて「存在しない」と結論する前に、repository / branch / live HEAD が正しいことを確認する。

古いclone、古いbranch、古いsnapshot、別worktreeの状態を、live `main` の状態として扱ってはならない。

### Stage 1 — Repository OS recovery

Stage 0 が通った後、`AGENTS.md` と `governance/COMMAND_WORDS.md` に従ってRepository OSを復元する。

少なくとも:

- Constitution
- Current Position
- Master Match Graph
- Active Context
- Progress
- 対象subject / modeのcanonical spec
- 必要なDecision / Lesson

を必要範囲で確認する。

### Stage 2 — Instruction dictionary load

この辞書を読み、以後のGitHub命令解釈の基準とする。

「憲法から」自身は、この辞書を読み込むためのRoot Commandでもある。

### Authorization

「憲法から」だけを理由に、未確認のGitHub操作へ権限を拡張してはならない。

後続の具体的な作業は、現行のcanonical governance / command / approval rulesに従う。

### Failure behavior

Stage 0でrepository identityまたはlive mainを確定できない場合:

- 実装・修正・削除・merge等へ進まない
- 不確定な内容を「現行mainの事実」として報告しない
- 何が確認できていないかを明示する

### Evidence rule

「存在する / 存在しない」「現在mainでは〜」というRepository状態の主張は、可能な限りlive GitHub確認を根拠にする。

---

## CMD-WORK-001 — 修正

Status: ACTIVE  
Class: WORK  
Priority: NORMAL  
Canonical Phrase: **修正**

### Purpose

既存成果物について、**何を修正すべきかを確認し、承認済み修正案がある場合だけその範囲を実装する**。

「修正」は、問題点が未確定の状態からいきなり書き換える命令ではない。

### Expanded behavior

```text
対象を特定
↓
対象Mode / subject / technical canon を確認
↓
現在の実物・既存Work・Decision・Lessonを確認
↓
何を修正すべきか確認
↓
approved correction proposal exists?
   │
   ├─ NO
   │   ↓
   │  問題点を整理
   │   ↓
   │  修正案を作成
   │   ↓
   │  ユーザーへ提示
   │   ↓
   │  REVIEW
   │   ├─ 修正コメントあり
   │   │   ↓
   │   │  REVISE-PROPOSAL
   │   │   ↓
   │   │  修正版を再提示
   │   │   ↓
   │   │  STOP
   │   └─ exact Proposalを明示承認
   │       ↓
   │      APPROVED
   │
   └─ YES
       ↓
      承認済みscope内だけ修正
       ↓
      Action Log
       ↓
      Findings
       ↓
      Verification
       ↓
      Memory Close
```

### Approval behavior

**REVIEW-FEEDBACK ≠ APPROVAL**

- 承認済み修正案が存在しない場合、実装してはならない。
- ユーザーの修正コメント、追加条件、反対意見、改善案は、たとえ「いい」「結構」「OK」などの肯定表現を含んでいても、Proposalの内容を変更するなら承認として扱わない。
- Proposalへのレビューで内容が追加・削除・変更・条件付きになった場合:
  1. 実装しない。
  2. Workを `REVISE-PROPOSAL` に戻す。
  3. 新しいProposal revision / IDを作る。
  4. 旧Proposalを上書きせず履歴として残す。
  5. **修正版Proposalをユーザーへ全文提示する。**
  6. **そこでSTOPする。**
  7. 修正版そのものへの明示承認を受けて初めて `APPROVED` / `IMPLEMENTING` へ進む。
- 「そう」「OK」などの短い肯定は、**直前に exact Proposal の承認を尋ねる明確な質問へ直接答えており、かつ新しい変更条件を含まない場合だけ**承認証拠になり得る。
- 承認なのかレビューなのか曖昧なら、実装せず確認する。
- 既に同じ未変更Proposalが明示承認済みなら、承認を取り直さず続行できる。
- 修正中にmaterialな変更が必要になった場合も `REVISE-PROPOSAL` へ戻り、修正版提示 → 再承認を行う。

### Assessment requirement

修正前に最低限確認する:

- 現在の症状 / 問題
- 何を修正すべきか
- 影響範囲
- 既存の承認済み修正案の有無
- Do Not Touch
- 必要なverification

### User review handoff (W-GOV-008/P-001)

The exact user-review gate is governance/WORK_SYSTEM.md §12A. A correction is **not USER-REVIEW-READY** until the agent has verified a directly opening app-preview URL for the exact changed place and exact implementation commit, with a short observation checklist. An unpublished PR cannot be reviewed through an older live Pages URL. PR, branch, ZIP and CI links are **technical evidence only** and cannot stand in for user hands-on acceptance. If no valid preview exists, report USER-REVIEW-NOT-READY/BLOCKED and remedy it; do not ask the user to decipher GitHub or start a development environment. External preview publication/connection needs separate approval.

### Cross-creation impact audit before correction closure

修正で根本原因を確定したら、その問題が他の**承認済み「作成」成果物**（公開済み・レビュー中を含む）にもあるか、関連範囲を横断監査する。同型不具合を確認したら別の/関連する `CMD-WORK-001` へ戻り、各exact Proposalの承認を守って修正・再検証する。すべての関連修正後に、共通とmode固有の教訓を既存教訓と重複照合し、必要な統合だけを行う。全条件と再帰停止条件は `governance/WORK_SYSTEM.md` §12Bを正本とする。横断監査は無承認一括修正の許可ではない。

### Record requirement

修正Workでは必要に応じて:

- `WORK.md`
- `PROPOSAL.md`
- `ACTION_LOG.md`
- `FINDINGS.md`
- `VERIFICATION.md`

を使う。

ユーザーから「それは違う」と訂正された内容は、適切なERROR findingとして残す。
正しいと確認された重要事項はCONFIRMEDとして残す。

---

## CMD-WORK-002 — 作成

Status: ACTIVE  
Class: WORK  
Priority: NORMAL  
Canonical Phrase: **作成**

### Purpose

数学・物理の新しい章・問題導入のため、ユーザーが指定/提供する**原問題集（Word等）または教科書（PDF・Word等）**を起点に、問題/概念を漏れなく特定し、対象モードの教訓に従って、設計→明示承認→教材/アプリ作成→検証→ユーザーレビューまで進める。

「作成」は**無条件にコードや問題を作り始める許可ではない**。完成/本番公開とも同義ではない。

### Preconditions — identity, source, mode

1. `CMD-ROOT-001`のrepo identityと現行main/Repository OSを復元し、Work OSを照合する。
2. 原資料を確定する: Word問題集 / 教科書 / PDF / 既存教材。出典、版、章範囲、問題番号、元図、利用可否、original vs newly authoredを記録する。ファイル名の「完成版」だけでcanonicalとしない。
3. 対象の科目とモードを**数学/物理 × 教科書/練習**から特定する。特定できなければ確認して停止。Simulationは練習へ黙って統合しない。
4. 既存問題のguided化と、教科書を根拠にした**新規導入問題・例題の作成**を区別する。既存原問題の条件・図・正解・小問間の参照は無断変更しない。
5. 元資料/母版を読み取れない、正本・権限・対象範囲が曖昧、教訓に矛盾がある場合は `BLOCKED` / `OPEN-QUESTION` とし、推測による大量生産を止める。

### Correction-first entry gate

新規「作成」の開始時だけでなく中断からの再開時にも、未完了のユーザー修正依頼/修正Workを点検する。残件があれば `CMD-WORK-001 — 修正` を先に処理し、承認・検証・関連教材への横断監査・教訓統合を終えるまで作成を保留する。既承認の作成案は保持するが、後からmaterialに設計が変われば `REVISE-PROPOSAL` を必要とする。具体的な優先ゲートは `governance/WORK_SYSTEM.md` §12B。未承認修正を即実装してはならない。

### Required mode routing — do not mix pedagogy

| Target | Starting authority and pedagogical route |
| --- | --- |
| 数学・教科書/学習 | `subjects/mathematics/textbook/SPEC.md` と正本教材/ユーザー承認済み本文。具体的な問い→概念→性質→証明（必要時のみ）→例題。元のMath Master Skillの現物が未確認なら読了扱いにしない。 |
| 数学・練習 | `docs/MATH_PRACTICE_MASTER_LESSONS.md` を必読。該当時 `docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md`。元問題→完全解法→問題内/問題間依存→thinking nodes→holes/choices→段階解放。 |
| 物理・教科書/学習 | `docs/physics-ch01/LEARNING_TEXT_WRITING_RULES.md`、`FORMULA_DERIVATION_RULES.md`、`CH1_USER_QA_DESIGN_LESSONS.md` と `subjects/physics/textbook/SPEC.md`。現象→図/文章→量/式→導出→意味→例題。 |
| 物理・練習 | `subjects/physics/practice/SPEC.md` と `docs/QUESTION_SCHEMA.md`、原問題・承認済みguided例。元問題→形式分類→推論ガイド→元選択肢で最終回答。Simulationは別。 |

共通の**技術/文章/デザイン**教訓: `docs/MASTER_APP_LESSONS.md`、`docs/MATH_RENDERING_RULES.md`、`docs/INFORMATION_ARCHITECTURE_RULES.md`、対応する `memory/LESSONS/` と現行アプリのsource/テスト。これらは各モードのより具体的な承認済み教訓を上書きしない。

原典 `MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1` / `SCIENTIFIC_WRITING_MASTER_SKILL_2026-09-24` 等を根拠とする場合、正本の所在/アクセスを確認する。現物を読めなければ未確認と明記し、既存要約を原本と取り違えない。

### Expanded behavior — nine stages

```text
① 原資料受付・source authority/coverage特定
 ↓
② subject / mode / newly authored vs guided source を固定
 ↓
③ 問題・概念・性質・例題・証明・図を全件棚卸し
   → 問題対応表 / 概念グラフ / 問題間依存
 ↓
④ 対象modeの文章・技術・教育教訓を探して照合
   → 衝突と不足原典は報告し、推測しない
 ↓
⑤ mode別作成案 + 火柴図（詳しいノードはIDで参照）
   → 思考ステップ/図位置/穴/文章/UI/QA/Do Not Touch
 ↓
⑥ exact Proposal をユーザーへ提示
   ├─ 条件追加・修正コメント → REVISE-PROPOSAL
   │                           → 改訂案を全文提示 → STOP
   └─ 明示承認 → APPROVED
                 ↓
⑦ 承認範囲で教材/アプリ作成（まず代表単位で検証）
 ↓
⑧ 数理・文章・図・依存・answer leakage・実UI/回帰を検証
 ↓
⑨ 実物のreview linkを渡してユーザーが確認
   ├─ 合格 → acceptance証拠 + Work/Memory Close、次単元へ
   └─ 不合格 → 問題と証拠を記録 → CMD-WORK-001「修正」へ
```

### Required design artifact

⑤では少なくとも `work/templates/CREATION_DESIGN.md` の項目を埋める:

- 出典→問題/概念→作成ノードの対応表（coverage/除外理由）
- 演習なら完全解法・問題内/問題間`depends_on`/再利用結果
- 学習なら導入動機→意味→名称→性質→必要な証明→例題、表現の往復
- 図が必要なノードと配置、図の出典、未解答漏洩リスク
- 記述→holes/choices/feedback→画面での提示順
- 章/テーマ見出し、既存state/IDs保護、Do Not Touch
- 作成対象ごとのテスト・レビュー・合格条件

図を作るか否かも**設計時に**判断し、存在しない図を捏造して作る必要はない。原問題と既存正本の図を優先する。長い制作では一括量産せず代表単位の実機レビューで適用可否を確認する。

### Approval and modification rules

- この命令を受けた時点では資料読解/設計はできるが、**未承認Proposalの教材・アプリ実装は不可**。既にexact Proposalが承認済みなら同じ承認を聞き直さない。
- `REVIEW-FEEDBACK ≠ APPROVAL`、`REVISE-PROPOSAL`、明示再承認などは `governance/WORK_SYSTEM.md` と `CMD-WORK-001` の承認規則に従う。
- 教科書モードの対話/概念導入を練習モードへ自動移植しない。練習モードのUI圧縮を教材本文変更と混同しない。
- source fidelity、Stable ID、学習進捗、他subject/mode、原資料、既存acceptanceを守る。承認範囲外の生成/変更は別Proposal。
- `main`のmerge/Pages公開は実装承認と区別し、既存release rulesと当該Workの権限に従う。

### Completion / review-link handoff

`DONE`は技術QAだけでなく対象教材のユーザーhands-on acceptanceとMemory Closeを確認してから。技術PASSは「ユーザー合格」ではない。

レビュー依頼は governance/WORK_SYSTEM.md §12A に従う。**変更した箇所へ直接開く、対象commitを検証済みの実アプリ・プレビューURL**と短いチェック項目がなければ USER-REVIEW-READY と呼ばず、ユーザーに合否判定を依頼しない。PR/branch/ZIP/CIは技術証拠であり代替リンクとして受入依頼に使わない。外部ホスティング連携・公開、本番merge/Pagesは別の明示承認を要する。

不合格なら観測された具体的問題を `FINDINGS.md` に記録し、`CMD-WORK-001` の調査→修正案→承認→修正→再検証へ渡す。次単元の「作成」へ進む前に現在の受入状態を明示する。

### Work records

`WORK.md` / `PROPOSAL.md` / `ACTION_LOG.md` / `FINDINGS.md` / `VERIFICATION.md` と図・対応表・検証証拠を必要範囲で保持。完了時に耐久性のある教訓のみ適切なmodeの`memory/LESSONS/`または詳細`docs/`へ昇格する。

---

## Registry rule

この辞書に新しい上位命令を追加・変更する場合は、ユーザーの明示承認を必要とする。

未登録の命令を、Agentが勝手に既存命令として登録・同一視してはならない。


## Target-specific identity enforcement (2026-10-10)

For this repository, CMD-ROOT-001 Stage 0 MUST verify the exact owner `rrikunagasige-dot`, repo ID `1391122224`, `main`, and its live HEAD. Do not use historical snapshots or the upstream `paulfields83` repository as current authority. If ownership or repository differs, STOP, report ERROR-PROVENANCE and re-evaluate. No cross-repository action is authorized by a generic instruction.
