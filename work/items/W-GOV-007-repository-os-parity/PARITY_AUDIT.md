# W-GOV-007 / Old-to-target OS parity — baseline audit

Date: 2026-10-11
Source READ-ONLY: https://github.com/paulfields83/kyotsu-step-web/tree/b6687b571c8a292591e91cad84a452f180184ea1
Target LIVE: https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/be98aa0dc2c4f29d5bfb33e2295bbb9063099e33
Source 805 tracked blobs / target 455 tracked blobs. **Different application trees**, counts alone are NOT a defect indicator.

| Area | Paul original | Current target root | Assessment |
| --- | --- | --- | --- |
| `governance/` | six main documents | same six paths | PRESENT; `WORK_SYSTEM`, `COMMAND_WORDS`, `CHANGE_PROTOCOL` Git blob identical; others adapted |
| `AGENTS.md` | root agent router | root agent router | PRESENT and adapted to correct target repo; not byte-identical intentionally |
| Instruction dictionary | canonical EXACT/SIMILAR/UNKNOWN `CMD-ROOT-001` | same canonical commands plus target identity | PRESENT, guard execution and confirm false-match |
| Constitution | canonical authority and isolation | target adapted constitution | PRESENT; correct target provenance supersedes old source-repo ratification |
| `navigation/` | `CURRENT_POSITION`, `MASTER_MATCH_GRAPH` | both plus `MODE_STATE_2026-10-10.md` | PRESENT; target release/status overrides upstream claims |
| `memory/` | 16 files, including 7 old ADRs | 13 root files incl target ADRs and new lessons | PARTIAL ROOT PARITY, NOT LOSS: old 7 ADRs retained under `history/imports/.../memory/DECISIONS/` |
| `work/templates/` | 5 | same 5 | PRESENT and Git SHA-identical |
| `work/items/` | historic W-GOV-001..004 | target W-GOV-005 on main | CORRECT AUTHORITY SPLIT: old 4 Work folders retained under `history/imports/.../work/items/`; target approvals independent |
| `subjects/` | 8 main paths | 8 main paths | PRESENT, some specs are CANONICAL-CANDIDATE; target existing approved lessons take precedence |
| `technical/` | 6 backend-inclusive canonical files | target root `technical/README.md` | INTENTIONAL NON-COPY: old 6 files archived `history/imports/.../technical/`. No backend in current target; do not promote |
| `quality/` | 3 | 3 | PRESENT; QUALITY_GATES target-adjusted for no backend |
| `README.md` | OS-first human entrypoint | old app README plus 1-line OS preface | GAP: actual OS table of contents/current target release/clear source-of-truth navigation |
| `tools/repo-governance-check.mjs` | root structural checker | target-adapted checker | PRESENT; validates file existence and markers, NOT all runtime/user approvals |
| `.github/workflows/repository-governance.yml` | basic governance on PR/push | same basic job on PR/push | PRESENT; no universal approved Work diff gate |
| W-GOV-006 Draft PR #53 | absent | preservation pilot with 16/16 tests, 395 file hashes | VALIDATED but **SCOPED TO ONE BRANCH/WORK** and unmerged; do not conflate |
| GitHub protection | source main unprotected, 0 rulesets | target main unprotected, 0 rulesets | NEITHER can guarantee required status checks at GitHub level; separate owner authorization required |

## Authority hierarchy
- Direct user instruction and approved current-target Work > `governance/CONSTITUTION.md` > current target accepted mode originals > target mode candidates > current target code > archived Paul source.
- Never infer old PR IDs, old Work approvals, upstream backend, old content or historic release states apply to the target.
- Math Practice Q87–120, Math Textbook published sets / other units review-only, Physics Textbook Ch1 three learner groups, Physics Practice three guided representatives: preserve target `navigation/MODE_STATE_2026-10-10.md`.

## Read-first check (current target)
`README.md → AGENTS.md → governance/INSTRUCTION_DICTIONARY.md [憲法から] → governance/CONSTITUTION.md → governance/COMMAND_WORDS.md → navigation/CURRENT_POSITION.md → navigation/MASTER_MATCH_GRAPH.md → memory/ACTIVE_CONTEXT.md + memory/PROGRESS.md → CHATGPT_README_FIRST.md/docs + applicable subjects/ mode → work/items/ exact WORK + approved PROPOSAL → allowed branch edits → QA + real PR review link → memory close`.

## Identified actual gaps; no destructive mirroring
1. OS human entrypoint/read-first route not as clear as old README.
2. Historic old ADR and technical docs not readily indexed as historical, causing agents to omit them or incorrectly treat them as current.
3. Current governance check verifies text/structure but not general every-PR approval-scope; W-GOV-006 check is one-branch pilot.
4. Unprotected main means future merge may bypass a failed check; fixed only by owner Settings with independent consent, not by mere document words.
5. AI cannot prove it read files from a successful CI check; a true fresh-agent recovery drill is required.
6. Target README's legacy question counts and Node-version text may mislead an Agent; preserve the old text but insert current authoritative routing.

## Baseline known defects (NOT W-GOV-007 work)
W-GOV-006 diagnostic: 24 old ESLint errors, 2 outdated full Vitest catalog-count assertions (249/251 passing), 4 obsolete `e2e/learning-flow.spec.ts` UI assertions. Do not claim their tests PASS just because a `continue-on-error` CI job completes successfully.

## STOP conditions
Any changed original course/answer/figure/id/source, change to Constitution/Work System/dictionary command meaning, old archival modification, broad cleanup, branch-protection setting change or unintended status promotion requires a new exact proposal/approval. This is an audit of parity, not a permission to replace the current app with upstream.
