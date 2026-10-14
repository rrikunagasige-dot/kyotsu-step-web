# W-GOV-006 — 「作成」命令の導入
Status: VERIFYING
Updated: 2026-10-14
Repository: `rrikunagasige-dot/kyotsu-step-web` (ID `1391122224`)
Base main: `994f9634e2e5288b97887e71df3948bcc3bfc717`
Branch: `work/W-GOV-006-create-command-20261014`

## Objective
既存の `CMD-WORK-001 — 修正` と独立した `CMD-WORK-002 — 作成` を登録し、Word問題集・教科書等の原資料から数学/物理×教科書/練習の問題を設計・承認・作成・検証・ユーザーレビューへ進める一語マクロを定義する。

## Authority
`AGENTS.md`; `governance/CONSTITUTION.md`; `governance/INSTRUCTION_DICTIONARY.md`; `governance/COMMAND_WORDS.md`; `governance/WORK_SYSTEM.md`; 四モードSPECおよびtarget-approved詳細教訓。

## Scope
命令辞書の新Command、起動ルーター追記、作成設計表テンプレート、再利用可能な教訓記録、Workの証跡のみ。新教材の実制作はこのWorkに含まない。

## Do Not Touch
Constitution原則、CMD-ROOT-001 / CMD-WORK-001の既存意味、既存mode SPEC、アプリのsrc/public/e2e/CI/Pages、過去成果物/母本、旧PRや上流repo、mainへの直接コミット。

## Approved Proposal
P-001 / `PROPOSAL.md`。ユーザーが具体的な9工程と適用範囲を確認し、「いいと思う。このデザインで行きましょう」と明示承認した。承認条件の追加なし。PR作成は本Work内、mainへのmergeは別review gate。

## Current Step
命令とTemplateを実装。Static gates 9/9 PASS。Governance CI・ユーザーreview pending。

## Next Step
変更範囲監査→Repository Governance CI→PRリンクでユーザーレビュー。mainへのmergeは別途指示待ち。

## Dependencies
実際に教材を「作成」する際は、毎回原資料の正本性とモード別教訓の所在を再確認。未確認Word母本や研究/文章スキル原本を見たと偽らない。

## Completion Condition
四モードに正しくルートし、承認前制作禁止、教材source fidelity、学習者QA→修正へのhandoffが明記され、既存修正命令が残り、CIとmemory closeが記録されること。
