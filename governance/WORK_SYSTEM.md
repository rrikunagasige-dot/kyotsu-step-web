# Work Operating System

Status: CANONICAL
Version: 1.6.0
Updated: 2026-10-21

## 1. Purpose

This document defines how a concrete unit of work is proposed, approved, executed, recorded, verified, and handed to the next chat/agent.

A repository can remember the project correctly and still lose the history of a particular task. The Work Operating System closes that gap.

## 2. Core invariant

**An unapproved proposal must not silently become implementation.**

Before execution, an agent must determine whether the exact work proposal is already approved.

- If no approved proposal exists: investigate, write the proposal, present it to the user, and stop at the approval gate.
- If an approved proposal exists and the requested work is still inside that approved scope: continue without asking the same question again.
- If implementation discovers a material scope/design change: move the Work to `REVISE-PROPOSAL`, record why, propose the change, and wait for approval before executing the changed portion.
- **REVIEW-FEEDBACK ≠ APPROVAL.** If the user changes, adds, removes, rejects, or conditions any part of a proposal, do not infer a revised approval. Create and present the revised proposal, then wait for explicit approval of that revision.

## 3. Definition of Work

A **Work** is one traceable unit of activity with one clear objective and one stable Work ID.

A Work records:

- what the objective is,
- what was proposed,
- what the user approved,
- what actions were actually performed,
- where those actions occurred,
- what was found to be correct or wrong,
- how the result was verified,
- what must be promoted into project memory.

Example IDs:

- `W-GOV-001` — governance/process work
- `W-PHY-001` — Physics work
- `W-MATH-001` — Mathematics work
- `W-APP-001` — application/runtime work

The numeric suffix is stable once assigned.

## 4. Work state machine

```text
UNDEFINED
    ↓
PROPOSED
    ↓  explicit user approval
APPROVED
    ↓
IMPLEMENTING
    ↓
VERIFYING
    ↓
DONE
```

Exceptional states:

- `BLOCKED` — cannot proceed because required information/resource/authority is missing.
- `REVISE-PROPOSAL` — approved plan is no longer sufficient; a material change needs approval.
- `FAILED-VERIFICATION` — implementation exists but the required verification gate failed.

### Transition rules

1. Only explicit user approval may move a proposal from `PROPOSED` to `APPROVED`.
2. User feedback that modifies the proposal is review feedback, not approval, even when it contains positive wording such as “good”, “OK”, or 「結構」.
3. After material review feedback, move to `REVISE-PROPOSAL`, create a new proposal revision/ID, present the full revision, and stop.
4. Only explicit approval of that exact revised proposal may return the Work to `APPROVED`.
5. `APPROVED` authorizes only the recorded proposal and scope.
6. Mechanical implementation choices that do not change the approved intent/scope do not require repeated approval.
7. A material change to objective, user-visible behavior, pedagogy, data contract, destructive action, or approved scope invalidates automatic continuation.
8. `DONE` requires both verification and memory close.

## 5. Work record structure

New work uses:

```text
work/items/<WORK-ID>-<short-name>/
├── WORK.md
├── PROPOSAL.md
├── ACTION_LOG.md
├── FINDINGS.md
└── VERIFICATION.md
```

Legacy files under `work/active/` remain valid historical/active records until deliberately migrated. They are not deleted merely because this system exists.

## 6. WORK.md

The Work cover sheet. It must answer:

- Work ID
- Title
- Status
- Objective
- Authority / relevant canonical spec
- Branch
- Scope
- Do Not Touch
- Approved Proposal
- Current Step
- Next Step

A new chat should be able to understand the Work's current state from this file before reading detailed logs.

## 7. PROPOSAL.md

Stores the planned change and approval state.

Each proposal has a stable Proposal ID such as `P-001`.

Required information:

- problem / need
- proposed solution
- scope
- out of scope
- affected areas/files if known
- risks
- verification plan
- approval status
- approval evidence/date

If a proposal changes materially, create a new proposal revision/ID rather than rewriting history so that an old approval appears to cover a new plan.

## 8. ACTION_LOG.md

Stores what was actually done.

Each action uses a stable ID such as `A-001`.

Record:

- action
- target/location
- reason
- result
- evidence (commit, file, test, artifact, PR, etc.)
- related proposal/task when useful

This is the answer to: **what did the agent do, and where?**

Do not turn the Action Log into verbose chain-of-thought. Record observable actions, decisions, outputs, and evidence.

## 9. FINDINGS.md

Stores facts learned during the Work, including both correct and incorrect assumptions.

Each finding uses a stable ID such as `F-001`.

### Positive / neutral types

- `CONFIRMED` — verified fact, interpretation, behavior, or design constraint.
- `OPEN-QUESTION` — unresolved point that may block or alter work.
- `RISK` — known risk that has not yet become an error.

### Error types

- `ERROR-SPEC` — misunderstood user intent, specification, or acceptance criteria.
- `ERROR-REASONING` — mathematical, physical, logical, or pedagogical reasoning error.
- `ERROR-IMPLEMENTATION` — code, UI, content-data, or integration implementation error.
- `ERROR-PROCESS` — workflow violation such as executing before approval or mixing modes.
- `ERROR-QA` — missing/insufficient verification, missed regression, false PASS.
- `ERROR-PROVENANCE` — wrong source, stale branch, wrong canonical document, or lineage mistake.

A user correction is not disposable chat text. If it establishes that an assumption/action was wrong, record the appropriate finding.

A user confirmation is also not disposable chat text. If it establishes a stable fact/design constraint, record it as `CONFIRMED` and promote it when necessary.

## 10. VERIFICATION.md

Stores evidence that the Work satisfies its approved proposal.

Each verification uses an ID such as `V-001`.

Depending on scope, verification may include:

- mathematical/physical correctness
- pedagogical correctness
- content/reference integrity
- answer leakage checks
- figure/rendering checks
- typecheck / lint / unit tests
- build / E2E / browser / mobile QA
- repository governance validator

A failed check must be recorded. Do not erase failures after fixing them; append the later PASS result.

## 11. Approval gate

Before implementation, ask:

```text
Does an approved proposal exist for exactly this work?
                 │
          ┌──────┴──────┐
          │             │
         NO            YES
          │             │
          ▼             ▼
      investigate    execute inside
      + proposal     approved scope
          │
          ▼
      user approval
          │
          ▼
       APPROVED
```

### Proposal review loop

A proposal review is iterative.

```text
PROPOSED P-001
    ↓
USER REVIEW
    ├─ explicit approval of exact P-001
    │      ↓
    │   APPROVED
    │
    └─ correction / addition / condition / rejection
           ↓
      REVISE-PROPOSAL
           ↓
      create P-002
           ↓
      present full P-002
           ↓
          STOP
           ↓
      USER REVIEW
           ├─ explicit approval → APPROVED
           └─ more feedback → REVISE-PROPOSAL again
```

Rules:

- A review comment is never silently converted into a revised approved proposal.
- Do not rewrite P-001 so that earlier approval appears to cover P-002.
- A short reply such as “yes”, “そう”, or “OK” may count only when it directly answers a specific approval question about the exact current proposal and introduces no new change.
- If approval intent is ambiguous, ask and do not implement.
- The revised proposal must be shown before implementation.

### No repeated approval

Do not mechanically ask the user to approve the same unchanged proposal again in every chat.

Approval survives chat boundaries when the repository contains adequate evidence of:
- what was approved,
- its scope,
- and that the current action is inside that scope.

### When approval must be renewed

Return to `REVISE-PROPOSAL` when a material new decision is needed, especially:
- changed user-visible behavior,
- changed pedagogical structure,
- expanded destructive cleanup,
- schema/API contract change not covered by the proposal,
- replacement of the chosen technical approach,
- newly discovered conflict with higher authority.

## 12. Standard execution logic

```text
RECOVER
  ↓
IDENTIFY WORK
  ↓
RECONSTRUCT STATE
  ↓
CHECK APPROVAL
  ├─ no → ASSESS → PROPOSE → USER APPROVAL → APPROVED
  └─ yes ───────────────────────────────────────┘
  ↓
PLAN / TASKS
  ↓
IMPLEMENT
  ↓
LOG ACTIONS + FINDINGS
  ↓
VERIFY
  ├─ fail → record → FIX or REVISE-PROPOSAL
  └─ pass
  ↓
MEMORY CLOSE
  ↓
DONE
```

## 12A. W-GOV-008/P-003 — GitHub小ブロック確認 → 横断監査 → 最終アプリ総チェック

Approved: 2026-10-19 JST; CMD-WORK-001「修正」; W-GOV-008/P-003. **P-003 expressly revises P-001/P-002's mandatory per-block live-app gate.** The preceding P-001 version remains historical in its original Work/PR; this section is the forward-looking rule **now effective on target main** under the user's separate 2026-10-19 integration approval. Constitution, instruction matching, proposal approval, correction-first §12B, Work states and release authorization do not change.

**Three distinct evidence gates (no automatic equivalence):**

| Gate | Reviewer / proof | Status and scope |
| --- | --- | --- |
| ① Small-block GitHub visual sheet | User sees an authentic screenshot/render, numbered `確認①`, stable block ID, target exact SHA, 2–4 concrete points; responds `細部OK` or `要修正` in ChatGPT | `BLOCK-CHECK-PENDING` → `BLOCK-VISUAL-OK` (layout/content visual acceptance **only**) |
| ② Cross-block audit | Agent tests source, math/physics, answers, hint leaks, transitions, progress and regression across affected units | `CROSS-VERIFIED` only with recorded evidence; new confirmed defects return to §12B |
| ③ Entire-app user playthrough | **Verified live app link** for a frozen release-candidate SHA; user actually plays the whole agreed app scope from the beginning to the end | `FINAL-REVIEW-NOT-READY` → `FINAL-REVIEW-READY` → explicit `FINAL-APP-ACCEPTED` |

These are *review labels*, not extra Work statuses. Preserve Work's `PROPOSED / APPROVED / IMPLEMENTING / VERIFYING / DONE / BLOCKED / REVISE-PROPOSAL / FAILED-VERIFICATION` machine. A narrow technical Work may be `DONE` when its own specified gates pass, **without claiming the app has passed final overall review**. Do not call an app-wide release accepted before `FINAL-APP-ACCEPTED`.

### Gate ① — one small block, GitHub-centered
1. For both `CMD-WORK-001 修正` and `CMD-WORK-002 作成`, define one bounded concept/question/decision, read §12B's correction queue and the applicable MASTER, mode SPEC, original-source and approved Work lessons *before* touching each block. Record the stable block ID, Work/Proposal, source revision, preview head SHA, changed/unchanged boundaries and expected learner decision. No unauthorized broad batch change.
2. Produce a **plain-language review sheet viewable in GitHub**, using `work/templates/BLOCK_REVIEW_SHEET.md`. Include a **real app-derived screenshot** attached/embedded at a verified GitHub location, `確認①` etc. precisely where changes occurred, the target complete commit SHA, check-point names, and 2–4 short actual visual checks. Never fabricate screenshots or claim an image is actual if it was not produced from the referenced commit. Raw PR/code/ZIP links are optional engineer evidence, **not the user's only review task**. A missing authentic image or mismatched SHA is `BLOCK-CHECK-PENDING`, not an acceptance request.
3. The user checks just the visibly marked places and responds `細部OK` or `要修正` in ChatGPT; agent logs the exact response, Work/Proposal, stable block IDs, SHA, date and image reference. **`細部OK` means visual/design acceptance only, not interactive app functionality.** Treat it neither as proposal approval nor as main/production publication permission. Do not infer consent from viewing a sheet or completing a textbook question.
4. After a recorded `BLOCK-VISUAL-OK`, hide that block's marker in the **next review output** but retain append-only acceptance history, SHA, underlying block ID and pending final playthrough. Do not erase prior evidence, change learner answers/IDs, or silently expand the accepted scope. P-002 app-side markers are an optional implementation; the P-002 pilot's independent-branch history is preserved, while the N01/N03 learner release subsequently reached main through PR #98.
5. On `要修正`, stop the next creation block, log the observed defect, root-cause signature and impact, follow `CMD-WORK-001` full-proposal permission and §12B correction-first sweep. Recheck the corrected screenshot against the *new* SHA, and invalidate the affected prior visual acceptance as appropriate; no mass changes merely because an audit found related concerns.

### Gate ② — cross-block audit, not user labor
6. Before the final candidate, audit links/dependencies across blocks and modes: source fidelity, math and physics reasoning, exact answer keys and choice types, figure/value consistency, premature hint/answer revelation, wrong/correct gates, navigation, shared UI, small-phone and desktop rendering, persistence/reset, previous corrections, and unaffected accepted units. The impact ledger must say `PASS / FAIL / UNVERIFIED` per surface, linked evidence/SHA and why a surface is out of scope. Use `work/templates/CROSS_BLOCK_AUDIT.md`; absence of evidence is UNVERIFIED, not PASS.
7. New confirmed defects re-enter §12B with linked scope-specific Work and exact approval; finish correction, repeat the affected checks and ensure no confirmed defect remains. `CROSS-VERIFIED` cannot be granted while a required audit cell is FAIL/UNVERIFIED.

### Gate ③ — one final entire-app user check
8. Only after Gate ① acceptance/closure and Gate ② QA, freeze a **release-candidate full commit SHA** and exact in-scope content manifest. Supply a real, reachable and *tested* one-tap **app URL**, not just a GitHub code page, linking to a start point. Verify the hosted build matches SHA, has no auth wall, works on phone and desktop, and does not pollute production learner progress. Vercel is optional; an already authorized free alternative may be used. A GitHub repository/Markdown screenshot **cannot itself serve as a playable app**. If no authorized accessible build exists, show `FINAL-REVIEW-NOT-READY` and request separate deployment/publication permission if needed; never invent a URL or use old main Pages as the new candidate.
9. The user starts at the beginning and plays the **entire agreed app scope**, each subject/mode/chapter/question, correct/wrong choices, transitions, hints/figures, refresh/reset and phone/desktop. Provide `work/templates/FINAL_APP_WALKTHROUGH.md` with actual URL, SHA, scope, route coverage and checkboxes. Sampling cannot replace the entire-app check unless the user separately approves a scoped exception.
10. Explicit user `総チェックOK` on the tested SHA/scope creates `FINAL-APP-ACCEPTED`; `要修正` records the failure and reopens CMD-WORK-001, affected cross audits and the relevant/full playthrough before another acceptance. No final acceptance is inferred from individual `細部OK` or engineering CI success.

**Authorization guard:** The user separately approved this governance-only main integration on 2026-10-19 JST. This does **not** authorize future learner-data edits, other feature merges, further production/Pages deployments, new public staging, Vercel deletion, bank/card entry, cost-bearing services, unauthorized account connections, or changing source lessons/previous approvals. Future actions still require their own applicable permission. Never imply Vercel is required. Prefer GitHub evidence for Gate ① and a playable app link only for Gate ③. The engineering helper workflow is evidence-only; it does not publish or make acceptance decisions.

## 12B. Correction-first gate and approved-creation impact sweep (CMD-WORK-001 ↔ CMD-WORK-002)

User-approved workflow extension: 2026-10-18 (W-GOV-007/P-001). This section is the canonical cross-command **orchestration**. It does not change the commands' own approval rules or add a new Work state.

日本語要約: **未完了の修正依頼を作成より優先**し、修正中は他の**承認済み作成成果物の同型不具合を横断監査**する。見つかった修正は各Proposalの**明示承認**後に実行し、全関連修正・検証・共通教訓の重複統合後に作成を再開する。

### Gate 1 — Before starting or resuming 「作成」

1. Recover the current repository, Work/approval records and all **outstanding user correction requests**; record the actionable queue with Work IDs/links, scopes and evidence. Historical fixed/accepted findings are not an outstanding correction.
2. An outstanding correction takes priority even when a creation proposal is already approved. Record the creation's paused checkpoint and dependency; do **not** cancel its approval or silently edit its source.
3. Process the correction via CMD-WORK-001. If an exact correction proposal is approved, perform only that scope. If absent/changed, investigate and present the complete proposal or revision and STOP; the creation remains on hold while authorization is pending.
4. A blocked or unresolved correction is not silently treated as DONE. If prioritization is impossible, ask the user explicitly rather than bypassing the queue.

### Gate 2 — During every approved correction

1. Diagnose the **root cause and applicability conditions**, distinguish similar symptoms with different causes, and fix/verify the approved primary target first.
2. Before closing the correction, derive an **impact set** of other artifacts produced under approved 「作成」 proposals (live, previously accepted, and review-only). Search relevant units and shared technical/pedagogical surfaces for the same error pattern. Scope audit by shared cause or rule; do not blindly mass-edit all units or mix modes.
3. Record an impact ledger: origin finding/Work; root-cause signature; each examined source/unit/version/approved creation Work; evidence; result CONFIRMED / NOT-AFFECTED / UNVERIFIED; and linked correction Work/proposal where applicable. Mark missing sources/permissions as UNVERIFIED, not PASS.
4. If an additional real defect is confirmed, enqueue a linked CMD-WORK-001 correction. Existing exact approval applies only if it genuinely covers that artifact and fix; otherwise submit a new or revised full proposal and await its **explicit** approval. A cross-artifact audit is **not** automatic authorization for changes.
5. After each approved fix, verify the original symptom and affected regression surfaces and repeat the impact check for newly identified failure patterns. Track visited (root-cause signature, artifact, version) to prevent duplicate work or an infinite loop.

### Gate 3 — Memory close, lesson deduplication, return

1. Only when the related approved corrections are verified and accepted as required, reconcile their findings into **shared project lessons** and specific mode exceptions. Search existing canonical rules first: exact duplicate → reference/no new lesson; partially overlapping → consolidate common rule and preserve exceptions; novel rule → add once with evidence.
2. The canonical shared working lesson is `docs/MASTER_APP_LESSONS.md`; its specialized render/IA/pedagogy documents remain authoritative within scope. Detailed correction facts stay in Work records, while `memory/LESSONS/` points to the reusable rule. Preserve historical approvals and lessons; never silently delete or rewrite their provenance.
3. Close the correction ledger only when there is no confirmed unresolved applicable defect, including a second pass over newly discovered linked corrections. If evidence or approval is missing, remain BLOCKED/REVISE-PROPOSAL as appropriate and report it.
4. Recheck the correction queue **again** before resuming the paused creation; review updated lessons against the preserved creation proposal. Continue an unchanged approved scope without another approval, but use REVISE-PROPOSAL if new lessons materially change the creation design. Keep main merge/Pages authorization separate.

The existing Work states and proposal-review requirements in sections 4, 11 and 15 remain unchanged. Do not confuse a successful audit with complete user acceptance, or an original creation source with a changed app artifact.

## 12C. W-GOV-009/P-001 — CI待機中の独立作業と元Workへの復帰

Approved proposal: **W-GOV-009/P-001**. User replied 「いいよ」 on 2026-10-21 JST to the exact unchanged implementation proposal. This rule governs only **authorized** in-progress Work; approval to implement it on an isolated branch does not grant `main` merge. No new command, Work state, fourth user review gate, background automation, or unilateral authorization is created.

**Unchanged higher/adjacent authorities:** Constitution, §11 approval/REVISE-PROPOSAL, §12A small-block GitHub screenshot → independent cross-audit → SHA-matched live app complete playthrough, and §12B correction-first/sibling impact audit. CI running does not close an outstanding correction. Optimize safe progress on the primary Work rather than maximizing parallel work.

### C1. CI開始時のチェックポイント

Immediately on launching or discovering a CI run, record in existing `ACTION_LOG.md` and `VERIFICATION.md`:
1. Primary Work ID, exact approved Proposal/revision, current step, Do Not Touch and next permitted Gate.
2. Verified repository/owner/ID, current live `main` HEAD, primary branch, **full CI-tested commit SHA**, and branch HEAD if different.
3. Workflow name, actual run ID/URL or explicit `PENDING` if unavailable, test surfaces, and current `RUNNING/PENDING` evidence; do not invent runs or PASS.
4. Separate §12A Gate①/②/③ and human approval states, including any review/host blocker.
5. Safe return instruction for SUCCESS, FAILURE, CANCELLED/TIMED OUT, API/disconnect; identify secondary Work/branch/scope if selected.

For cross-chat handoff, update the existing `ACTIVE_CONTEXT.md` pointer only under separate applicable authorization, without overwriting unrelated Work. No new formal Work status is introduced.

### C2. 待機中の候補と優先順位

Select the first **safe, independent and authorized** candidate; never interpret a waiting CI as permission to bypass §12B:
- **P0:** A detected primary CI failure or integrity/provenance issue → checkpoint secondary B and return to primary A.
- **P1:** Primary A's independent original-source/mathematical checks, source audit, known-root impact assessment, or clearly unverified review preparation.
- **P2:** Related outstanding correction audits or linked corrections with exact approved scope, within §12B.
- **P3:** Other already exactly approved independent corrections on separate Work branches.
- **P4:** Other exactly approved creation implementation **only after** the §12B correction queue is genuinely empty, even if any earlier correction CI is RUNNING.
- **P5:** Already authorized nondestructive records/provenance checks relevant to the goal.

A waiting human Gate①/③, missing hosting authorization, or unapproved proposal is not resolved by CI completion. Do not invent irrelevant tasks to occupy time.

### C3. Independent-work predicate — ALL conditions necessary

Before switching A → B, verify:
1. B's results do not rely on A's pending CI, unaccepted lesson changes, or unavailable approval; record dependencies.
2. B has a stable Work ID, verified exact Proposal and Do Not Touch. Only independently authorized research/proposal drafting may proceed without an implementation approval; never implement unapproved scope.
3. B does not conflict with A's file paths, canonical source data, stable IDs, shared renderer/schema/lockfile, progress migrations or derived artifacts. Two branches alone do not establish non-conflict. Defer overlap or obtain a separately exact-approved reconciliation plan.
4. Any B implementation uses its **own** feature branch from a known SHA, not `main` and not A's frozen test branch. The SHA under CI must remain identifiable and reproducible.
5. A and B use separate action/results/verification records; old CI successes never verify changed HEADs or other work.
6. §12B correction-first, §12A user acceptance and all source/lesson/merge/hosting/cost authorization boundaries remain unchanged.

If any condition fails, perform only permitted non-writing independent assessment where applicable, or do not switch.

### C4. Context-switch budget

Keep **one primary Work and at most one actively executing secondary Work** in a single agent turn. A candidate list is not a mandate to start multiple unfinished branches. Finish one meaningful small block and leave an exact checkpoint before switching again. Do not fabricate DONE/APPROVED to clear capacity.

### C5. CI状態再確認とSHA整合

Avoid repeatedly polling unchanged workflow runs without intervening meaningful work or material new evidence. Recheck at the end of a secondary small block, or before any primary operation that depends on CI results. With no safe independent task, check as needed; do not invent a timer, background job or autonomous watcher.

CI outcome applies **only to the run's tested commit SHA and covered surfaces**. Compare branch HEAD, SHA and outputs before treating any PASS as current. If HEAD changed, keep the older PASS as history and rerun affected checks for new code. `RUNNING` or `PENDING` is never PASS, and a partial job PASS is not the whole Work gate.

### C6. Safe return to primary A

- **SUCCESS:** record real URL, full tested SHA, verified coverage; resume the next permitted primary action, separately preserving human Gate①/②/③.
- **FAILURE:** at the first discovered failure, checkpoint B safely, record job/step/evidence and return to A for root-cause diagnosis and exactly approved repair/retest. Material changes use `REVISE-PROPOSAL`.
- **CANCELLED/TIMED OUT:** log NOT VERIFIED, inspect why; rerun only when appropriate within authorization.
- **API/permissions/network/chat disconnect:** log last **proven** branch/run/SHA, error and pending step. Avoid tight retry loops; upon resumption verify true target repo/live main, A and B checkpoints, and actual CI status before acting.
- **Human-review or hosting blocker:** preserve existing Gate/Work pending states. Independent work cannot silently clear authorization blockers.

### C7. Collisions and stopping conditions

Never concurrently write to the same branch HEAD or overlapping source/progress/schema/renderer/lockfile or stable-ID set without separately exact-approved conflict resolution. A discovered same-root defect enters §12B linked correction with its own approval. CI waiting does not permit unsolicited merge, publishing, deployment, deletion, billing, credential changes, lesson rewrite or workflow/infrastructure modifications.

### C8. Records and closure

Use existing `WORK.md`, `PROPOSAL.md`, `ACTION_LOG.md`, `FINDINGS.md` and `VERIFICATION.md` for A/B IDs, branch SHA, dependencies, reason for safe task selection, CI runs/results and return checkpoints. After interruption, resume only from the last **verified** checkpoint. Existing Work state machine, memory close and §12A final user acceptance retain their original meanings.

## 13. Memory promotion

Work records are detailed local memory. Only durable information is promoted upward.

```text
Work record
   ├─ reusable mistake/rule ──→ memory/LESSONS/
   ├─ durable design choice ──→ memory/DECISIONS/
   ├─ project-current-state ──→ CURRENT_POSITION / PROGRESS
   ├─ dependency/state change ─→ MASTER_MATCH_GRAPH
   ├─ significant chronology ─→ CHANGELOG
   └─ ordinary local detail ──→ remains inside the Work
```

Do not promote every action to global memory.

## 14. What counts as a Decision vs Finding vs Lesson

- **Finding**: something learned in this concrete Work.
- **Decision**: a durable choice adopted for future implementation.
- **Lesson**: a reusable rule extracted from success/failure.
- **Action**: something actually performed.
- **Verification**: evidence that a requirement passes or fails.

## 15. Modification work

“修正” does not itself authorize implementation.

For a correction request:

```text
RECOVER
→ identify current behavior
→ determine what actually needs correction
→ check for an existing approved correction proposal
→ if absent: propose correction and wait
→ if user gives correction/advice: REVISE-PROPOSAL → show revised proposal → STOP
→ only after explicit approval of the revised proposal: fix only that approved scope
→ validate original symptom + regression
→ record error/confirmed findings
→ memory close
```

If the user has already approved the exact correction plan, do not ask again.

## 16. Record quality

Records must be detailed enough for a fresh agent to continue, but not become hidden reasoning dumps.

Prefer:
- observable facts,
- exact file/branch/path,
- proposal/approval state,
- actions taken,
- results,
- errors,
- evidence,
- next step.

Avoid:
- speculative internal monologue,
- untraceable “seems fixed” claims,
- rewriting old failures out of history.



## 12D. W-GOV-010/P-002 — executable workflow binding

P-002の実装入口は `workflow/README.md`。命令・承認の意味と§12A/12B/12Cは維持する。CMD-WORK-001を修正経路、CMD-WORK-002を作成経路へ渡し、実装済みの技術限定Workは別profileで扱う。新しい第四Gateを追加しない。

イベント台帳 `<Work>/runtime/events/` を実行状態の正本とし、AI課題・結果・承認原文・証拠はhashで対応付ける。現在地・火柴図・次課題は同じ台帳から生成する。既存WORK/ACTION_LOG等は規範・要約・履歴として参照を残す。全体CURRENT_POSITIONや他チャットの現在地は個別Workの生成物で上書きしない。

既存の具体案・版・範囲に有効な承認があれば再使用する。会話転記は暗号署名ではなく、出所と検証段階を記録する。AI出力のapprovedフラグを承認と扱わない。修正差分は承認scope・保護範囲・前後hash・安定ID・保存履歴を照合して適用し、原症状の機械検証とAIによる意味の審査をともに残す。未知の変更、未確定の外部操作、中断された差分は自動再実行しない。

正本・規則・入力・候補SHAの変更を検出して必要な結果を失効させる。変更のないブロックのGate①は内容hashで保持できるが、Gate②・③とCIは現在の対象版を要する。後続の否定を事例更新へ戻し、単なる続行や実装承認は教材の正例へ変換しない。

この実行器は、終了したチャットの自動起動・任意教材の意味理解・分散系の完全な一度限り実行を保証しない。自然言語規則の対応状況と未自動化部分は `workflow/rules/mapping.json` に残す。憲法本文の変更はない。
