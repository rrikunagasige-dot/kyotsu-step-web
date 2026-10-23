# 塾 — Repository Agent Entry Point (target-owned)

## 0. Identity gate / 最優先
GitHub操作の前に必ず接続アカウント、owner、repository、branch、live HEADを検証する。
- canonical writable target: `rrikunagasige-dot/kyotsu-step-web`
- repository ID: `1391122224`
- authoritative branch: `main`
- upstream: `paulfields83/kyotsu-step-web` is **NOT** this target; it is a read-only source reference for transplant
- STOP / ERROR-PROVENANCE when repo identity or current source authority differs.

## 1. Root command — 「憲法から」
Read `governance/INSTRUCTION_DICTIONARY.md` / `CMD-ROOT-001`. Then:
1. Verify target live repo/main/HEAD and required Repository OS paths.
2. Read `governance/CONSTITUTION.md` and `governance/COMMAND_WORDS.md`.
3. Read `navigation/CURRENT_POSITION.md` and `navigation/MASTER_MATCH_GRAPH.md`.
4. Read `memory/ACTIVE_CONTEXT.md` and `memory/PROGRESS.md`.
5. Read `CHATGPT_README_FIRST.md` + applicable `docs/` first-read.
6. Read mode-specific `subjects/` spec without overriding existing accepted learner rules.
7. Recover applicable Work records / decisions / lessons.
8. Check exact approved proposal under `governance/WORK_SYSTEM.md` before implementation.
9. Execute only approved scope in an independent feature branch; verify and memory-close.

No whole-repo automatic merge, cleanup, removal, or rewriting of working app data.

## 2. Target authoritative mode material
- Math Practice: `docs/MATH_PRACTICE_MASTER_LESSONS.md`,
  `docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md`,
  `docs/MATH_PRACTICE_87_120_FINAL_QA_FINDINGS.md`,
  and `src/data/mathPractice/` (real source and current published behavior).
- Physics Textbook: `CHATGPT_README_FIRST.md`,
  `docs/physics-ch01/MASTER_FIRE_DIAGRAM.md`,
  `docs/physics-ch01/CH1_USER_QA_DESIGN_LESSONS.md`,
  and present `src/data/textbook/`.
- Math Textbook: published `math-sets` in target main via PR #50; review-only other candidate units remain in original draft PR #31. Read `src/data/textbook/math/`, original mother Word and `navigation/MODE_STATE_2026-10-10.md`; do not promote review units without explicit user hands-on approval.
- Physics Practice: representative guided questions + Ch1 adapter, not a complete bank. See `navigation/MODE_STATE_2026-10-10.md` for all four modes and current authoritative source paths.
- Ported `subjects/**/SPEC.md` are **candidate integration summaries**, not a license to
  replace detailed approved target-mode rules.

## 3. Authority
Direct user instruction > target Constitution > exact approved Work > target mode source
and approved lesson > ported candidate mode spec > target code/data > legacy records.
Conflicts are OPEN-QUESTION / BLOCKED; NEVER silently choose old upstream content.

## 4. Workflow / safety
Use `governance/WORK_SYSTEM.md` for WORK / PROPOSAL / ACTION_LOG / FINDINGS / VERIFICATION.
While CI runs, follow §12C of the same Work OS: record the exact tested SHA/run/return step; pursue only authorized, independent, nonconflicting work; recheck at safe task boundaries and return to primary. §12A/§12B and all approvals remain binding.
REVIEW-FEEDBACK is NOT approval; new scope needs new exact proposal approval.
Record errors and success, run relevant QA and attach a real review link at handoff.
Preserve `main`, source archives, old PRs/branches, stable IDs, previous user-approved pedagogy.
Do not confuse upstream Q95/Q98 with target Q95/Q98.



## 5. P-002 executable workflow router
教材の作成・修正と対応する技術Workでは、先に `workflow/README.md` を読み、Workごとの固定計画とイベント台帳を復元する。`python workflow/cli.py --root . --store <Work>/runtime next --work <ID>` で次課題を照合する。AI課題の claim / submit と既存承認の記録を分離し、結果未提出の工程を飛ばさない。憲法・本入口の正本確認を省略しない。技術試験の完了は教材Gate完了ではない。
