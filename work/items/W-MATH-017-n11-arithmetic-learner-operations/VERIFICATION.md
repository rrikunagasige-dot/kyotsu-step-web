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
