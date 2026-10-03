# MATH PRACTICE 87–120 COMPLETION HANDOFF

Last updated: 2026-10-04

## Authoritative current state

Main:
- 87–119 merged
- latest completed merge: Math 119, PR #41
- Math 119 main merge SHA: b3eb3d0d59958f8c5d6fd0ed142ac44d3660392c

Open work:
- Math 120 clean implementation branch:
  chatgpt/math-120-verbal-function-pilot-clean
- PR #42
- only Math 120-related files are in the PR
- no physics files
- no duplicate Math 119 files

## Math 120 implementation status

DONE:
- source fidelity re-check against original problem
- no-blank derivation
- thinking-node design
- stable blank IDs / choice IDs
- Japanese source
- Chinese source
- presentation stages
- catalog publication
- adapter test
- taxonomy test
- question catalog test
- Chinese title test
- presentation dependency test
- mobile/desktop E2E flow
- wrong-answer non-progression check
- final 87–120 QA plan
- PR changed-file audit
- JA/ZH/presentation blank-ID parity audit
- all 34 problems published
- all 34 problems use current-stage compression

CI for PR #42:
- typecheck PASS
- focused math-practice tests PASS
- build PASS
- mobile smoke currently running at time of this handoff
- desktop smoke pending after mobile

## Math 120 canonical stage graph

(1):
p1-formula -> p1-model

p1-domain-meaning -> p1-domain

No convenience dependency from p1-model to p1-domain.

(2):
p2-distance-rule -> p2-traveled -> p2-model

p2-start
p2-end
  \-> p2-domain

p2-domain imports only p2-start and p2-end.

## Math 120 correct results

(1):
y = 3x
x > 0

(2):
y = 15 - 3x
0 <= x <= 5

## If connection is lost

1. Read:
   - docs/MATH_PRACTICE_MASTER_LESSONS.md
   - docs/MATH_PRACTICE_87_120_STRUCTURE_MAP.md
   - docs/MATH_PRACTICE_120_CONTENT_DESIGN.md
   - docs/MATH_PRACTICE_87_120_FINAL_QA_PLAN.md
   - this handoff
2. Check PR #42 latest CI.
3. If CI succeeds:
   - merge PR #42
   - check main deploy
   - run final 87–120 QA
4. If CI fails:
   - inspect only the failing step
   - fix root cause on chatgpt/math-120-verbal-function-pilot-clean
   - do not weaken tests
5. Do not create new learner-facing theme for 118–120.
