# Proposals — W-GOV-006

## P-001 — CMD-WORK-002 「作成」の追加

Status: APPROVED
Created: 2026-10-14

### Problem / Need
現在の指示辞書では「修正」は登録済みだが、新しい章の問題作成・概念導入を行う「作成」は未登録。資料を渡された場合の原資料分析、モード別教訓、承認、作成、検証、レビューという制作ループを定義する必要がある。

### Proposed Solution — exact user-reviewed design
1. 原資料受付・正本/範囲確認（Word問題集、教科書、PDF、既存教材など）。
2. 科目とモードを選択：数学/物理×教科書/練習。既存問題guided化と新規設計を区別。
3. 原問題/概念/例題/証明/図を棚卸しし、出典ID・概念/問題依存・coverage mapを構築。
4. 対象modeの文章・教育・技術教訓を読み、既存仕様との衝突や不足原典を報告。別モードへの無検証適用なし。
5. モード別の完全な作成案（問題構成、解法、thinking nodes、穴、図位置、文章、UI、検証法、Do Not Touch、火柴図）を作成。
6. exact Proposalをユーザーに提示して停止。修正フィードバックならREVISE-PROPOSAL→全文再提示→STOP。承認された内容だけ続行。
7. 承認後、小さな代表単位から教材/アプリを作成し、正本・ID・依存・教材本文・図を保護。
8. 数学/物理正当性、文章/解法、正答漏洩、依存図、レンダリング/PC/スマホ/回帰/CIなど該当QA。
9. 実アプリ/プレビューをユーザーへ渡しHands-on review。承認で受入/記録・次単元、否認なら独立した`CMD-WORK-001 — 修正`で問題点と修正案を起こす。技術PASSと人間の教材PASSは別。

### Mode distinction
- 数学教科書：具体的な問い→概念→性質→必要な証明→例題。本文と穴は一続きの教材。
- 数学練習：原問題→完全解法→問題内外依存→思考ノード/穴/選択肢→段階表示。
- 物理教科書：現象→図/文章→物理量→法則/式→導出→例題、表現を相互に結ぶ。
- 物理練習：元問題→形式分類→推論/計算→元選択肢への最終回答（無誘導Simulationとは区別）。

### Scope
`governance/INSTRUCTION_DICTIONARY.md`、`governance/COMMAND_WORDS.md`への既存意味を変えない追記、`work/templates/CREATION_DESIGN.md`追加、`memory/LESSONS/CREATION_SOURCE_AND_MODE_ROUTING.md`追加、Workの五記録。

### Out of Scope
Constitution変更、教材コンテンツ・アプリ実装、四モード原仕様上書き、原Word/過去成果物消去、ユーザーデータ操作、mainマージ・公開。

### Risks
原本不明のまま量産、教科書/練習の混同、問題依存漏れ、図/答え先出し、最新ではない資料を正本として読む、承認未取得で実装、PASS誇張。

### Verification Plan
live mainと対象repo確認、差分scope比較、四モードと個別必読教訓を実在パスに結び付ける、CMD-WORK-001/ROOTの保持、未知/類似命令ルール、REVISEとSTOP、学生向けレビュー・修正ループ、`node tools/repo-governance-check.mjs`をPR Actionsで確認。

### Approval
Status: APPROVED
Approved by user: YES
Approval date: 2026-10-14
Approval evidence: 直前に明示された対象ファイル、9工程、モード別分岐、補足規則を含む全設計に対する「いいと思う。このデザインで行きましょう」。
Does not approve unrelated curriculum changes, app release or merge to main.

### Review History
- Review status: USER-APPROVED-AS-PRESENTED
- User feedback: 条件変更なし。
- Supersedes: none
- Superseded by: none
