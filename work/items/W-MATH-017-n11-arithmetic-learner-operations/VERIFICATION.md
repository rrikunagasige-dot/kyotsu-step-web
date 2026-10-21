# W-MATH-017 — VERIFICATION
Status: PENDING
2026-10-21 source + screenshot evaluation only (no implementation, no CI claimed).
- Verified live Q01 screenshot shows `-2 ? -5` plus selected `-2>-5`, matched N11 formula source; mathematical direction itself correct.
- Verified live Q05 screenshot and authored `n11-05` answer: complete operation/result selected as one answer; confirmed there is no Q05 result computation hole.
- Checked Set chapter's concrete→choice→meaning→formalization pattern and original math-teaching MASTER §§8–11/53.
- Read-only §12B sibling scan: N11 Q05/06/08/09/13, N14 Q10/14/15. All need individual cognition analysis, not automatic new faults or permission to edit.
- P-001/Q01 & P-002/Q05 scope proposals NOT APPROVED; N11 revision migration/grading semantics unverified, no new Playwright PNGs/CI. Affected Gate② status REOPENED pending repair; Gate③ user final play FAILED/REOPENED (not FINAL-APP-ACCEPTED). Main/publication existing state unchanged. Preserve prior historical proof, no retroactive deletion of previously passed CI.


## P-003 new candidate technical gate — NOT YET PASS
Candidate code commit: `1739a98f55e1320209795131442044ef81fc39fe` (earlier docs+source commits referenced above).
- Source-structure audit: 123/123 Word markers in eight specified units **enumerated**; not independently visually played.
- Candidate static tests added: source item map 123 and now 143 learner actions, Q01 embedded relation, Q05 operation + numeric result, N11 v7 archive; historical v6 expectations separately preserved.
- Draft PR [#107](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/107) for CI only. Initial governance CI [39576274721](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39576274721) **FAIL** (missing canonical `PROPOSAL.md`, fixed in this documentation commit). Math textbook [39576274614](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39576274614), review code check [39576274619](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39576274619) **RUNNING at prior observation**; no PASS inference on current changed HEAD.
- Gate① **BLOCK-CHECK-PENDING** (authentic 320/390 screenshots not yet verified); Gate② **OPEN**; Gate③ **FAILED/REOPENED**, no final user `総チェックOK` and no new hosting/merge authorization.


## P-003 Gate① authentic browser evidence, 2026-10-21
- Learner/test source SHA: `0a5d695ec5622519a5398274b7b14bbecb2fb587`. No main/deploy modification. Source code N11 revision7; Word/figure hashes unchanged.
- Real App Gate① capture and photo provenance at [evidence/p003-gate1/README.md](./evidence/p003-gate1/README.md); committed by screenshot-only GitHub Actions job at `07b7104eb6a3ff2c682d6bdcbe2157c2700f600d`. **42 authentic PNGs**, including normal full N11 learner route progressing first 9 proof decisions through Q05 (15 screens), plus numbered yellow-marked review-only before/wrong/hint/resolved (27 screens), across 320/390/1440px.
- Review Preview Check [39581161131](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39581161131) **PASS**, including bounded screenshot job. Governance check [39581161063](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39581161063) **PASS**. Full Math Textbook CI [39581161230](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39581161230) **RUNNING at this snapshot** (specific single tests/typecheck/build/mobile smoke already PASS); never infer final result.
- Original N11 Q01 relation and Q05 independent operation/numeric computation are correct in actual normal learner UI, without a detached formula-choice box; yellow frames only mark review blocks, not normal learner appearance. The remainder of older N11 author's formula blocks are not modified/approved by this Gate①.
- Gate① STATUS: `REAL-IMAGES-READY / USER-SMALL-BLOCK-ACCEPTANCE-PENDING`; Gate② `OPEN / §12B sibling impact ongoing`; Gate③ `FAILED/REOPENED`. No user `細部OK` or `総チェックOK` has been received at this point.


## Review-feedback status
P-003 correctness CI PASS and screenshot files do not amount to Gate① user acceptance. User raised an additional **pedagogical continuity** defect for generic learner `確認` markers; P-004 is proposed only, no new Gate① PASS. Original answer/revision invariants untouched pending P-004 approval.


## P-005 technical verification / exact SHA 0bb59e4b7…
- User directly approved four vertically continuous equations with holes, replacing earlier unapproved P-004 prose-led variant. Exact P-005 is `PROPOSAL_P005_FOUR_LINE_DERIVATION.md`, status APPROVED.
- Authored N11 version 8 uses grouped formula blocks `n11-lead-05`, `n11-formula-05`, `n11-after-05`, `n11-formula-06`; all same `derivationId`. No inherited normal-learner `n11-marker-2` `確認`. Numbered yellow Gate① review-only boxes remain separate and never appear on the normal learner route.
- Source mapping 123/123 original Word markers passes; math choices 144 including an extra independent balancing operation. v7->v8 migration archives entire v7 answer ledger, reopens only old n11-06 answer, and preserves n11-01 / n11-wm017-q05-operation / n11-05. Old v1–v6 migration tests preserved.
- Review screenshot source SHA `0bb59e4e9fa6314dcdda7b8d5dd5559f7fd92944`. See [real normal-app and marked screenshots](./evidence/p003-gate1/README.md), generated by passing GitHub Actions [39587993923](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39587993923). Actual normal screenshot inspection confirms a **single connected four-line derivation frame**, and final `x<7/3` after solving.
- [39587993960](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39587993960) governance PASS; [39587993923](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39587993923) review/screenshot PASS; full [39587993927](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39587993927) has Typecheck/Lint/Vitest/Build/mobile smoke PASS individually, full CI RUNNING as of last read. Earlier failed runs preserved historically, not promoted to final PASS.
- Gate① images READY, USER review PENDING. Gate② cross-block not yet PASS, Gate③ no whole-app SHA-matched approval. No main/production merge.
