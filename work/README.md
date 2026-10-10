# Work Records

Status: CANONICAL
Updated: 2026-10-07

Concrete project work is tracked as a **Work** according to `governance/WORK_SYSTEM.md`.

## New Work layout

```text
work/items/<WORK-ID>-<short-name>/
├── WORK.md
├── PROPOSAL.md
├── ACTION_LOG.md
├── FINDINGS.md
└── VERIFICATION.md
```

Use templates under `work/templates/`.

## Rules

- one clear objective per Work ID
- status and approval state must be explicit
- do not execute an unapproved material proposal
- record actual actions and locations
- record both errors and confirmed facts
- verification is required before DONE
- promote only durable decisions/lessons/current-state changes to global memory

## Legacy active work

Existing files under `work/active/` are retained. Migrate them only when actively resumed or when migration itself is approved; do not delete them merely to make the tree uniform.


## Port provenance

Original upstream W-GOV-001..004 and related approvals are retained in `history/imports/paulfields83-20261010/work/items/`, not as live target works. Target works need target scope/approval; target migration record is `W-GOV-005-repository-os-port`. Never inherit upstream W-MATH approval as license to overwrite this repository's practice data.

## 今回の承認とPR範囲の機械検査（追加パイロット）

実装PRには、同じWorkディレクトリに `SCOPE.json`（厳密な許可パス・禁止パス、Work ID、Proposal revision）と `APPROVAL_P-xxx.md`（提案書とscopeのGit blob SHA、ユーザーの明示的な許可の記録）を保存する。改訂案へ旧承認を流用しない。参照文書の提案のみのPRには実装許可がない。

通常PRの変更範囲を `tests/governance/pr-work-audit.mjs` で照合する独立パイロットを導入。未承認変更、記録欠落、改訂案のSHA不一致、保護対象の変更を検知する。ただし、ファイル内の人間承認文言は偽造できるため **Human approval verified: false** とする。CIの緑表示とmergeの許可は無関係。全PRへの強制/Required化およびGitHub Settingsは別の明示承認を要する。古いPRは適合前でも勝手に修正・消去しない。
