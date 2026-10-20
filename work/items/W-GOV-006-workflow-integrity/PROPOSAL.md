# W-GOV-006 / P-001 — Work-flow integrity and approval-gate hardening

Status: PROPOSED
Date: 2026-10-10
Canonical repository: `rrikunagasige-dot/kyotsu-step-web` (GitHub ID `1391122224`)
Checked baseline `main`: `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`
**Approval state: NOT APPROVED. The user has authorized drafting/review of this proposal only; no implementation or main merge is authorized by this record.**

## 1. Problem / Why
The original Constitution / Work Operating System files exist on official main and preserve the upstream conceptual flow, but operational enforcement and navigation consistency do not fully meet the design:

**E-001 — Approval / merge provenance:** W-GOV-005's recorded P-001 says "No ... automated merge into main"; its Work was continued and PR #49 was merged without a separately traceable, specific merge-authorization gate in the GitHub Work record. Do **not** retroactively claim the user clearly authorized or prohibited that specific merge; label authorization evidence **INSUFFICIENT / NEEDS REVIEW**. Preserve the historical record unchanged and record the concern separately.

**E-002 — Technical bypass:** `main` has `protected: false` and `required_status_checks.enforcement_level: off`; repository Rulesets query returned `[]`. A CI PASS cannot by itself block direct edits or unreviewed merge.

**E-003 — Weak validator:** `tools/repo-governance-check.mjs` ensures expected files, states and some keywords, but does not compare changed paths to an *approved proposal's scope*, does not verify an approval evidence link, and does not prevent passing with invented `Status: APPROVED` wording. A recorded claim of approval must not be treated as independent proof of human approval.

**E-004 — Contradictory navigation:** `navigation/CURRENT_POSITION.md` has both W-GOV-005 DONE and an `Open issues` entry instructing to merge PR #49 (already merged). Old `main` snapshot is dated and must be distinguished from live HEAD. The graph/current node must be semantically consistent, not just contain tokens.

**E-005 — False sense of completion:** CI validates structure, not pedagogical completeness nor user acceptance. Four modes must retain true publication/review status.

## 2. Objective / desired workflow
Retain exactly the previously designed workflow, with a reliable approval and record trail:

`憲法から` → identify correct live repo/HEAD → recover CURRENT_POSITION + graph + relevant canonical mode docs → identify Work → assess scope → exact proposal → **human approval of that exact proposal** → independent feature branch → implement within scope → evidence logs → tests / scope diff → separate reviewed merge gate → after-merge verification → memory close / DONE.

Never collapse `PROPOSED`, `APPROVED`, `MERGED`, `DEPLOYED` and `USER-QA-ACCEPTED` into a single status. Any material revised proposal returns to `REVISE-PROPOSAL` and STOP.

## 3. Proposed solution / scope (P-001)
### Phase A — Fix canonical navigation and historical truth
1. Remove stale *live* TODO to merge already-merged PR #49 from `CURRENT_POSITION.md`; preserve the old timeline in audit/history.
2. Reconcile `CURRENT_POSITION.md`, `MASTER_MATCH_GRAPH.md`, `ACTIVE_CONTEXT.md` and `PROGRESS.md`; stable T00–T06 identifiers remain.
3. Add a durable Work finding recording the previous approval/merge evidence ambiguity, without fabricating a user approval or altering original W-GOV-005's PROPOSAL.
4. Explain the difference between latest live HEAD and a dated checkpoint, and between code deployment and student-facing approval.

### Phase B — Enforce what can actually be checked
5. Update `tools/repo-governance-check.mjs` and `.github/workflows/repository-governance.yml` to validate more than keywords:
   - Work PROPOSED → five-file record may exist but contains no execution claim; an *implementation* diff must require an approved Work.
   - Implementing Work → exact Proposal ID/status and non-empty approval evidence, review history; Scope/Out of Scope and Do Not Touch must be explicit.
   - For PR builds, evaluate `base...head` file changes against the declared scope, distinguish proposal-only file changes and independent source fixes. Do not grant a universal wildcard to any Work.
   - Explicitly prohibit silently rewriting an approved Proposal to cover new work and falsely marking verification PASS.
   - Validate cross-document current statuses and known merged-PR/Work contradictions with a specific semantic smoke test.
   - Fail closed on missing credentials/data for checks that purport to validate an external fact, rather than pretending it passed.
6. Add positive and *negative* tests for approval-missing, wrong repo, unauthorized file edits, contradictory state and amended Proposal without reapproval. Tests must include a fixture intentionally trying to fool the validator with only `Status: APPROVED` text.
7. Preserve the original `WORK_SYSTEM.md` and `COMMAND_WORDS.md` semantics (currently Git blob SHA-equal to the historical upstream); no Constitution amendment without a separate approved amendment proposal and version bump.
8. Clearly state automatic checks **cannot establish authentic human approval from repo text alone**. Work records require a verifiable human confirmation / review. A fabricated evidence URL or markdown claim is not authoritative.

### Phase C — GitHub main protection (account-side settings, separate execution step)
9. After tests pass and user authorizes changing repository settings, configure a `main` ruleset / branch protection via the owner's GitHub UI:
   - require pull requests for merges;
   - require `Repository Governance Check / governance` (and appropriate app checks by changed area where available);
   - block force pushes / deletion;
   - avoid bypass except a documented emergency recovery policy;
   - optionally require review approvals **only if an authorized second reviewer is available**. A solo-owner repo should not be locked out by requiring self-approval; GitHub PR review is separate from the user's Work approval in chat.
10. Verify settings through live API where permitted plus a throwaway PR test: a failing validation cannot merge and a proposed-only draft cannot accidentally publish or modify runtime. Do not assert settings changed merely because the CI passes.
11. If account permissions/connector cannot modify settings, provide exact owner UI procedure; the Work remains `BLOCKED`/partial until the user confirms the settings.

### Phase D — Full workflow rehearsal and closure
12. Simulate three processes: (i) a never-approved modification must stop, (ii) feedback changing a proposal must return to REVISE-PROPOSAL and present P-002 before any implementation, (iii) an approved small change must produce action/finding/verification evidence, reviewed PR, and memory close.
13. Require post-merge checking on the actual merge SHA, not merely the feature-branch commit.
14. Record only verified steps as PASS; report any residual limitations and make the final CURRENT_POSITION / graph coherent. Provide a real GitHub PR and, for UI changes in *future* Works, the live app link.

## 4. Affected areas (planned, NOT modified in this PR)
`AGENTS.md`, `navigation/CURRENT_POSITION.md`, `navigation/MASTER_MATCH_GRAPH.md`, `memory/ACTIVE_CONTEXT.md`, `memory/PROGRESS.md`, `memory/LESSONS/`, `governance/CHANGE_PROTOCOL.md`, `quality/REPOSITORY_VALIDATION_POLICY.md`, `tools/repo-governance-check.mjs`, `.github/workflows/repository-governance.yml`, `work/templates/`, `work/items/W-GOV-006-*/`, new tests `tests/governance/`. Repository Rulesets/branch protection **only with separate explicit permission**. `governance/WORK_SYSTEM.md` only for approved nonsemantic clarification, not silent semantic modification.

## 5. Explicit out of scope / Do Not Touch
- NO editing `src/`, `public/`, `e2e/`, textbook/practice source, figures, original Word/PDF/ZIP, `package.json`, `pnpm-lock.yaml`, or `.github/workflows/deploy-pages.yml`.
- NO automatic publication of math review units, Physics full-bank claims, restructuring of four subject modes, upstream repo changes, rewriting historical approval records or deleting historical branches.
- NO direct edits to `main`; NO merging this proposal draft PR as if it were implementation approval.
- NO irreversible settings changes or branch lockout without a separate verified rollback plan and explicit user consent.
- No claim that any CI can perfectly verify the authenticity of a ChatGPT user message.

## 6. Risks / mitigations
- **Lockout:** required reviewer cannot self-approve; prefer PR+required CI first, then separately evaluate reviewers/override/rollback.
- **False authorization:** validation of markup alone is spoofable; pair machine-enforced scope checks with independent human review and explicit approval evidence.
- **Misclassified old work:** do not retroactively fail a past Work using a future contract; grandfather historical evidence with recorded risk, require new rules prospectively.
- **Flaky CI:** do not disable existing checks to make tests green; use isolated fixtures and local gate, preserve good production baselines.
- **Complexity:** keep the root router short and detailed gates in Work/technical files; do not force all subject docs into a single master.
- **External settings:** API access may not permit administration, so owner UI confirmation is a distinct acceptance gate.

## 7. Verification and acceptance criteria (proposed)
A. Root owner/repo ID/live HEAD mismatch stops changes.
B. New unapproved Work never produces an implementation diff.
C. A revised proposal with changed scope cannot inherit old approval.
D. A PR changing files outside approved scope is rejected or escalated for human review; don't claim checking an approval's genuineness automatically.
E. At least five negative tests plus positive passing/retired-work fixtures pass in PR CI.
F. Existing Maths/Physics code and release workflow blob SHAs remain unchanged.
G. `CURRENT_POSITION` and `MASTER_MATCH_GRAPH` no longer contradict merged W-GOV-005 and record the exact current checkpoint.
H. Once the user approves setting changes, live GitHub verifies `main` PR+required CI enforcement and blocked bypass test. If not set, Work remains partially incomplete, not DONE.
I. After final explicit merge authorization, check actual main merge SHA and GitHub Actions run before Work status PASS/DONE.
J. Handoff includes GitHub review link and all errors/lessons.

## 8. Approval and review history
- Requested now: **write/present a formal correction plan** — completed as a proposal draft ONLY.
- Status: **WAITING FOR THE USER'S EXPLICIT APPROVAL OF THIS EXACT P-001** before beginning Phase A/B implementation or changing settings.
- Review result: NOT REVIEWED.
- If feedback modifies this P-001, issue P-002 in the same Work and STOP until explicitly approved.
- No approval is inferred from "please make a plan" or from the proposal PR existing.
