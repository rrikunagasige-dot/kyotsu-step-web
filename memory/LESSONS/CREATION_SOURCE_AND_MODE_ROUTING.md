# 「作成」命令: 原資料・モード別教訓・レビュー

Status: APPROVED GOVERNANCE LESSON
Approved design date: 2026-10-14
Scope: `CMD-WORK-002 — 作成` only. Exact command in `governance/INSTRUCTION_DICTIONARY.md`, Work `W-GOV-006`.

## Why this rule exists
資料を受け取ると、原問題のguided化（練習）と概念の導入から新しい学習問題を作ること（教科書）は容易に混同される。4モードの教育目的は異なるため、文章作成法/数式・図/穴/画面を共通テンプレートへ機械的に変換してはいけない。

## Reusable production rule
1. 正本を特定（Word問題集なら原問題・小問・解法、教科書なら概念・性質・証明・例題・図を全数把握）。
2. 数学/物理、教科書/練習を別modeとして固定し、既存母本のguided化と新規導入問題を区別する。
3. 出典→問題/概念→作成ノード表、概念・問題内・問題間依存、必要図の位置を先に設計する。
4. 各mode必読教訓と共通技術/文章教訓を出典確認の上で使う。実際に読めない原本は読了扱いにしない。
5. 完全な設計案と火柴図を作り、ユーザーの明示承認前に教材/アプリを実装しない。
6. 承認範囲の代表例→テスト→アプリ/PC/スマホ→ユーザー実物レビューを行い、問題があれば `CMD-WORK-001 — 修正`へ。
7. 資料番号/元図/答え/学習進捗/他モードを保護し、技術PASSと教材PASSを分離する。

## Canonical router (not a new master copy)
- Math textbook: `subjects/mathematics/textbook/SPEC.md` + user-approved original lesson/mother Word.
- Math practice: `docs/MATH_PRACTICE_MASTER_LESSONS.md`; when relevant `docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md`.
- Physics textbook: `docs/physics-ch01/LEARNING_TEXT_WRITING_RULES.md`, `FORMULA_DERIVATION_RULES.md`, `CH1_USER_QA_DESIGN_LESSONS.md`.
- Physics practice: `subjects/physics/practice/SPEC.md` + accepted actual practice examples/`docs/QUESTION_SCHEMA.md`.
- Cross technical: `docs/MASTER_APP_LESSONS.md`, `docs/MATH_RENDERING_RULES.md`, `docs/INFORMATION_ARCHITECTURE_RULES.md`.

Imported `subjects/**/SPEC.md` carry a CANONICAL-CANDIDATE note and cannot override target-accepted detailed lessons. `MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1` and `SCIENTIFIC_WRITING_MASTER_SKILL_2026-09-24` are historically referenced but originals were not located in current main; future work needing their exact rules must recover/check original rather than claim it was read.

## Process invariants
- Root `憲法から` first; instruction dictionary decides EXACT/SIMILAR/UNKNOWN.
- Every new Work has exact Proposal scope, approval evidence and stable IDs.
- User-requested change to Proposal → REVISE-PROPOSAL and STOP; a positive review with altered requirements is not approval.
- Browser/user review link at every user-inspection gate.
- Human rejection → record precise finding → route to `CMD-WORK-001`; no silent rewrite.
- Completion = verified artifact + user acceptance + memory close (release only if approved).
