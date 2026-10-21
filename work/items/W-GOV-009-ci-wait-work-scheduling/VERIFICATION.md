# W-GOV-009 — Verification / plan
Status: PENDING
Stage: isolated implementation and governance CI, not yet confirmed
Date: 2026-10-21 JST
Baseline: observed GitHub main SHA `537c3cbf28d40f45228d8a0c4bdd20327136aa93`

## Proposal-stage consistency checks
- Identity/authority: target owner/repository ID, main HEAD, Constitution, dictionary, Work OS and CHANGE_PROTOCOL read.
- Scope design: proposes normative `WORK_SYSTEM.md §12C` only after approval; minimal pointers in `AGENTS.md` and dictionary; no new command/Work state/Gate.
- §12A compatibility: separate user visual approval, agent cross QA and exact SHA user hands-on acceptance preserved.
- §12B compatibility: pending corrections always outrank new creation; sibling corrections need exact approvals; same-cause audit stays mandatory.
- Authority: initial user response authorizes proposal-writing only; rule implementation must await a second explicit approval.
- No production/app changes, no main merge, and no alteration of tested content in this proposal branch.

## Implementation verification plan — NOT RUN
See `PROPOSAL.md` V01–V10. Check source/approval/priority/independence gate, successful/failed/cancelled CI, SHA mismatch, API disconnect, context switch limits and exact changed-file scope on a later implementation branch or approved work branch.

## Stop condition
Present full proposal to the user; if changed, revise exact proposal and stop; if accepted, execute only approved files and record evidence, then request separate main merge approval. This file must not label proposed workflow semantics as already deployed/validated.

## Implementation checkpoints (2026-10-21)
- P-001 exact approval recorded; no main merge authorization.
- Static review required: §12A/§12B body byte unchanged, §12C C1–C8 present, two dictionary references, one AGENTS reference, no Work state or command creation, allowed paths only.
- V01–V09: specified policy scenarios require decision-table analysis; they are not claims of nine actual concurrent CI runs. V10: confirm actual PR change list and governance CI with full run SHA.


## Technical governance QA — tested SHA `f5759ab8b1ffd87d7e4537081ecea97ff4ea9bb1`
- **PASS (GitHub Action):** [Repository Governance Check run 39526681491](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39526681491) concluded SUCCESS on tested full SHA.
- **PASS (GitHub Action):** [Review Preview Code Check run 39526681402](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39526681402) concluded SUCCESS on the same full SHA. This is a code check, not a deployment or user app acceptance.
- **PASS (static diff):** prior §12A and §12B body identical to main, eight C1–C8 subsections present; exactly two reference sentences in the dictionary, one brief AGENTS pointer; only eight approved file paths changed.
- **PASS (canonical status syntax):** Work Status: VERIFYING, Proposal Status: APPROVED as required by `tools/repo-governance-check.mjs`.
- **NOT YET CLAIMED:** final record-only head's own CI or external user review, and future actual multi-Work behavioral execution.

### V01–V10 decision-table coverage (policy/static checks; not real parallel CI simulation)
| Case | Expected safe branch | Rule | Static review |
| --- | --- | --- | --- |
| V01: primary CI RUNNING and independent audit | Do scoped independent primary audit; recheck at small-block boundary | C2 P1, C5 | PASS (text coverage) |
| V02: independent approved correction | B's exact approval/branch/SHA/log distinct | C2 P2/P3, C3 | PASS (text coverage) |
| V03: B unapproved or creation while correction open | No B implementation; §12B still blocks new creation | C2 P4, C3 | PASS (text coverage) |
| V04: CI FAILURE during B | Safely checkpoint B, restore A and diagnose; revised Proposal if material | C6 | PASS (text coverage) |
| V05: tested SHA differs from latest head | Preserve historical PASS, rerun affected current-head checks | C5 | PASS (text coverage) |
| V06: API failure/disconnect | Restore last proven repo/branch/Work/run state; no fabricated PASS | C1, C6 | PASS (text coverage) |
| V07: shared source, IDs or migrations | Reject concurrency or require exact approved conflict plan | C3, C7 | PASS (text coverage) |
| V08: CI PASS while human review/host pending | Keep §12A Gate status pending; never imply final-app acceptance | C1, C6 | PASS (text coverage) |
| V09: no safe independent work | Do not fabricate work; CI check when necessary | C2, C5 | PASS (text coverage) |
| V10: governance-only patch | Preserve Constitution/§12A/§12B/workflow/app and release separation | C7, static diff | PASS (text coverage) |

The first keyword-only scan produced false negatives for V02/V08/V10 because synonyms were used; after applying the actual section's semantic anchors, all 10 cases had textual coverage. No live autonomous parallel process has been exercised. This is not a new operational Gate.

### Next and acceptance boundary
After this append-only Work-record commit, rerun/inspect GitHub Actions for the **new final branch head** and record the exact final SHA and CI links in the handoff. No further mutation is necessary merely to paste the final CI result into this file. Remain Work VERIFYING for explicit user document acceptance and **separate main integration permission**.
