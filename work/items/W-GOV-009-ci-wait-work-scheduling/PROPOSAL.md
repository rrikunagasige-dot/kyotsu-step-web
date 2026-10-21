# W-GOV-009 / P-001 — CI待機時間の安全な並行作業と確実な元Work復帰
Status: APPROVED
Release authorization: isolated implementation only; main merge NOT authorized
Created: 2026-10-21 JST
Command: CMD-WORK-001「修正」 (user agreed to this command classification and proposal creation only)

**Approval 2026-10-21 JST:** The user replied 「いいよ」 immediately to the exact unchanged P-001 implementation approval question. Original preapproval language is retained below as history; normative text becomes effective only in the implementation branch until separately approved main merge.

## 1. Problem / Need
正式な `memory/PROGRESS.md` に「avoid repeated idle CI polling; do independent work while CI runs. After disconnect resume from latest proven checkpoint.」がある。しかし `WORK_SYSTEM.md` は独立タスクの選定・他Work実装の許可条件・CI中のbranch/SHA保護・復帰記録・CI失敗時の割込を具体化していない。結果としてCI中の無駄な確認、無計画な別作業、復帰地点の取り違えを防ぎ切れない。目的はCIを速くすることではなく、今のWorkを安全に前進させつつ有効な独立作業に時間を使うことである。

## 2. Authority / old-versus-new comparison
### Preserved (higher/equal authority)
- `CONSTITUTION.md` I–VIII: single canonical source, Spec before production, scope isolation, stable nodes, verification, provenance and distinct memories. Constitution itself is NOT amended.
- `INSTRUCTION_DICTIONARY.md` CMD-ROOT-001 (correct repo/main/HEAD), CMD-WORK-001「修正」 and CMD-WORK-002「作成」 with exact proposal approval; no new command or alias.
- `WORK_SYSTEM.md` §11 review-feedback ≠ approval; §12A Gate① GitHub real screenshot → Gate② agent cross-audit → Gate③ exact-SHA live app whole-play; §12B correction-first and cross-created-artifact audit. These are unchanged.
- `memory/PROGRESS.md` historical ERROR-PROCESS, preserve old incidents and source.
### Proposed addition, NOT active
A single normative subsection `WORK_SYSTEM.md §12C「CI待機中の独立作業と復帰」`, referenced briefly by `AGENTS.md` and by two strictly nonsemantic route notes in `INSTRUCTION_DICTIONARY.md`. This is an execution scheduler inside existing approved Work, not a fourth Gate or additional Work state.

## 3. Exact proposed §12C rules (normative text to adopt only after approval)
### C1. CI開始時のチェックポイント（必須）
As soon as a CI run is launched or discovered, save in existing `ACTION_LOG.md` and `VERIFICATION.md`:
(a) primary Work ID, exact approved Proposal/revision, current action and Do Not Touch;
(b) correct owner/repo/main HEAD, feature branch, **tested full commit SHA** and current branch HEAD if different;
(c) workflow name, GitHub run ID + real URL, relevant required test surfaces and `RUNNING / PENDING` evidence;
(d) current Gate①/②/③ and approval status (CI PASS never substitutes for human acceptance);
(e) exact safe return step for success/failure/cancellation/API error, and secondary Work chosen if any.
If a context handoff/disconnect risk is present, copy a compact pointer into the existing `ACTIVE_CONTEXT.md` only under a separately authorized update; do not overwrite another Work's active context. No new formal Work state or project-wide status label.

### C2. Wait-time candidate queue and priority
First decide whether there is safe independent work. Priority (choose the first applicable, not automatic simultaneous execution):
P0. Confirmed primary-run error / blocking integrity concern → safely stop secondary at a checkpoint, return to primary immediately.
P1. Independent tasks within primary Work (teacher source/independent mathematical proof, known-root impact ledger, targeted review preparation clearly labeled unverified).
P2. Related outstanding correction audits or already exactly approved nonconflicting linked fixes under §12B.
P3. Other pending exactly approved corrections on separated Work and branch.
P4. Exactly approved creation work ONLY after §12B correction queue is empty and all independent prerequisites hold; a currently open correction is not treated as closed because its CI happens to be running.
P5. Previously authorized nondestructive organizational/record checks useful to the same goal.
No invention of new work merely to fill time. A waiting user Gate①/③ or missing proposal approval is NOT implicitly satisfied by idling/CI success.

### C3. Independence predicate (all necessary)
Select secondary B only if:
1. It does not need the pending CI result from primary A, or an unaccepted pedagogical change, to be valid.
2. A and B have recorded Work IDs / dependencies; B's proposed activity is inside its independently approved Proposal. Evidence-only research/draft is allowed to the extent already permitted, but NEVER execution of an unapproved proposal.
3. B does not write to conflicting filenames, stable IDs, schema, progress migration, same source-of-truth or derived artifacts; if a shared file is affected, B must wait, or a new conflict-resolving exact Proposal is approved. Distinct branches alone do NOT prove nonconflict.
4. If B involves implementation, it uses its independent feature branch rooted on a known commit; do not work on `main` or silently amend the primary's tested branch. The primary tested SHA remains frozen as evidence.
5. B's own verification, gate status, history and provenance are separate; no promotion of old passing CI to new head.
6. §12B correction-first, user review boundaries, source/lesson preservation and publication permissions still hold.
When any predicate fails, limit B to non-writing assessment or do not switch.

### C4. Context-switch limit and selection
Keep one primary Work and at most one actively executing secondary Work in this agent turn. Maintain a candidate queue, not N simultaneous half-changed branches. Finish one meaningful small analysis/implementation checkpoint before changing focus. Never change the primary Work's success/approval status just to enable another Work.

### C5. CI recheck and branch-SHA safety
Avoid repeatedly polling the same run with no intervening meaningful task or relevant new signal. Recheck at a completed secondary small-block checkpoint or before any primary action that depends on the CI result. If no independent task is available, check the run when needed; do not force unrelated work or claim there is a timer/background monitor.
Every success/failure applies strictly to the run's tested SHA. Recheck whether current branch HEAD equals tested SHA and whether the delivered artifacts correspond to it; if HEAD moved, record both and rerun affected checks for new code before calling the new candidate verified. CI status RUNNING/PENDING is not a failure or PASS.

### C6. Return policy
- SUCCESS: log run URL + complete tested SHA, confirm relevant check coverage, return to primary's next permitted Work step; Gate①/②/③ approvals remain separate.
- FAILURE: record failed job/step/root-cause evidence, stop secondary at a safe checkpoint, return to primary for diagnosis and exact-approved localized remediation/retest. Material changes require `REVISE-PROPOSAL`.
- CANCELLED/TIMED OUT: record non-PASS, inspect cause, re-run only if authorized/appropriate; never declare verified.
- API/permission/disconnect: record last proven state and error. Do not loop indefinitely on API polls. On resumption recover correct repo/main/HEAD, exact primary and secondary checkpoint, branch SHA and actual run state before continuing. No fabricated PASS.
- Review approval or host authorization missing: remain at existing gate, report blocker; do not route around it by another work.

### C7. Collision/stop rules
No parallel writes to the same branch HEAD; no concurrency on overlapping source/progress/schema/renderer/lockfile without explicit reviewed integration. For any newly confirmed same-root bug in creation outputs, apply §12B and linked exact correction approvals; finding a defect does not grant blanket edit permission. Do not merge, deploy, publish, delete, incur cost, rewrite lessons or grant credentials as a wait-time operation.

### C8. Recording and closure
Reuse existing `WORK.md`, `PROPOSAL.md`, `ACTION_LOG.md`, `FINDINGS.md`, `VERIFICATION.md`. Include primary/suspended secondary status, dependency, results and exact SHA. Work completion still requires verification and memory close. A chat interruption resumes from most recent **verified** checkpoint, not from an assumed progress statement.

## 4. Files to edit AFTER separate P-001 authorization
1. `governance/WORK_SYSTEM.md` — add self-contained §12C *after* §12B, leaving §12A/§12B text intact, retaining the existing state machine.
2. `AGENTS.md` — one short referral in the workflow section to §12C for CI wait-time scheduling.
3. `governance/INSTRUCTION_DICTIONARY.md` — at most one short cross-reference for each of CMD-WORK-001/002. No command meaning, alias, approval or version claims changed except normal doc revision metadata if required.
4. `work/items/W-GOV-009-ci-wait-work-scheduling/` — evidence/action/findings/verification and final user review. No unnecessary duplicated master lesson.

## 5. Out of scope / Do Not Touch
`governance/CONSTITUTION.md`, `governance/COMMAND_WORDS.md`, existing §12A/§12B terms or three gates, existing Work status machine, `docs/MASTER_APP_LESSONS.md` (already covers preflight; not to be edited for this task), `src/`, `public/`, `e2e/`, source Word, learner history/progress, user-approved teaching, existing PR/branches, main, GitHub Pages/Vercel/hosts/billing, CI workflows themselves. A proposed scheduler does not authorize new infrastructure or autonomous unattended work.

## 6. Risks and explicit mitigations
- Priority conflict with §12B: never start new creation while an actionable correction remains open, even if correction CI is running; safe independent audits remain permitted.
- False independence: overlapping stable IDs/shared files/progress migrations → do not implement until conflicts resolved.
- CI misattribution: record exact tested SHA, branch HEAD and run ID separately; passing old SHA does not verify newer HEAD.
- Context switching thrash: one active secondary, small-block boundary rechecks, no compulsory multitasking.
- False acceptance: preserve every Gate①/②/③ and human authorization.
- GitHub API/network flakiness: no tight polling, resumption from recorded checkpoint.

## 7. Verification plan for implementation (must be evidenced; not claimed PASS now)
V01. Primary CI RUNNING + independent same-Work audit → audit proceeds; CI checked at task boundary.
V02. Primary CI RUNNING + independent approved correction B → separate branch; own SHA/log/QA, no overlap.
V03. Unapproved B or correction queue open + unrelated creation B → B implementation BLOCKED.
V04. Primary CI FAILURE during B → B checkpoint preserved; A diagnosis resumed; no blind fix.
V05. Test SHA differs from latest branch HEAD → old SUCCESS not usable as latest-code PASS.
V06. API error/disconnect and resume → correct repo/main/branch/run/last verified checkpoint reconstructed.
V07. Candidate requires shared file/source/progress or dependent result → no parallel implementation.
V08. CI SUCCESS but Gate①/②/③ or host permission pending → pending status preserved; no false DONE.
V09. No safe secondary work → no busywork; CI check when appropriate.
V10. Governance-only patch scope: no edits to Constitution, app/source/assets/e2e, production/deploy or user lessons; no unsolicited merge.

## 8. User approval gate — STOP
**Proposal-writing permission:** user replied 「いいよ続けて」 to the invitation to treat this as CMD-WORK-001 and create a formal GitHub proposal. This is NOT approval to implement §12C.
**Required before rule changes:** Explicit user approval of this *complete* W-GOV-009/P-001 proposal and its exact touched paths. Feedback changing any material term → REVISE-PROPOSAL, present complete revision, STOP.
**Required separately:** Any later main merge or deployment/publication authorization, even after documentation QA.

## 9. Recorded implementation approval
- User's exact reply: 「いいよ」 to full W-GOV-009/P-001, no changed conditions.
- Scope: §12C, brief AGENTS and dictionary pointers, these Work records, isolated branch implementation + verification.
- Still prohibited: main merge/publication/deployment, learner code, source Word, master lessons, billing and CI workflow changes.
