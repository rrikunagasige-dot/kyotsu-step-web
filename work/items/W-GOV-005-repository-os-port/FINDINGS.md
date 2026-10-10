# FINDINGS — W-GOV-005
## F-001 — ERROR-PROVENANCE
Prior assistant claimed `paulfields83/kyotsu-step-web` as target without user owner verification. Correct target is `rrikunagasige-dot/kyotsu-step-web`.
## F-002 — CONFIRMED
The target already has active 87–120 guided practice sources and detailed first-read/QA documentation.
## F-003 — ERROR-SPEC / RISK
Upstream PR #14 Q95/Q98 do not correspond to target Q95/Q98. Do not import by problem number.
## F-004 — CONFIRMED
113 upstream governance/history/work-system files preserved without overwriting target app source.
## F-005 — OPEN-QUESTION
Ported subject specs are candidate summaries until comparison with established target detailed rules; Math textbook draft PR #31 remains separate.
## F-006 — RISK
Imported upstream ratification/Work statuses are only upstream historical evidence; main adoption awaits target PR.

## F-007 — CONFIRMED (Section 2/3 structural coverage)
The existing rriku Math Practice already guides set operations and related proofs via published source: Q92 (∩/∪, 16 guide blanks), Q93 (three sets, 7), Q94 (complements, 12), Q95 (Venn reconstruction, 7), Q96 (complex three-set operations, 11), Q97 (parameter from intersection, 8), and Q98 (proposition classification and counterexample, staged).
`presentation.ts` contains prerequisite target edges for Q93, Q94, Q96, and Q97. The learner renderer provides current-target and inline choice/hint/retry. This is source inspection, not fresh visual/browser QA.
The upstream PR #14 Section2/3 task numbering maps to different content; neither its IDs nor code can be ported by number. Upstream A-8 absolute-value parameter task did not have an exact target match established by this audit.
