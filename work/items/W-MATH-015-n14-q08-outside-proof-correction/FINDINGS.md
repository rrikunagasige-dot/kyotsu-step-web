# W-MATH-015 — FINDINGS
Status: CONFIRMED

## F-015-01 / R2 general-case outer absolute-value proof omission
- Teacher-edited Word N14-Q08 belongs to generalizing/deriving from numerical distance, under a>0. W-MATH-011 independent source audit confirmed missing general sign-case proof in current app. This is a pedagogical derivation omission, not a mathematically wrong old key or confirmed exact-symbol answer leak.
- For X≥0: |X|=X>a. For X<0: |X|=−X>a ⇒ X<−a (multiply by −1 reverses >). Branches are exhaustive and cannot overlap because a>0. Therefore |X|>a iff (X<−a OR X>a). Conversely either inequality implies |X|>a by definition. Boundary X=±a is excluded, X=0 excluded.
- Existing original final n14-08 correct key and 3 wrong alternatives already diagnose inner vs outer, strict vs weak, OR vs AND, so retain them. New thinking proposals: two case decisions with 6 distinct authored wrong options, final original key afterwards; no original Q08 source marker increase.
- Related defects: N14 Q07 R2 already implemented on PR #101 review source, real screenshot evidence complete but Gate① human still pending. N14 Q12 R1 remains a separately queued and not-yet-authorized repair. Do not claim either closed by the present proposal.
- Conflict/security: Both Q07 and Q08 share n14Lesson.ts and N14 revision migration; **Q08 is NOT independently implementable while Q07 primary Work is unresolved**. Proposal-only separate markdown is safe. Do not let the existence of a proposal branch imply authorization or that missing Q07 Gate① was waived.
- No new reusable MASTER lesson needed. §12B/§12C and existing text/math teaching skills already address the omitted proof and efficient CI waits; execute them instead of rewriting governance.

## 2026-10-21 approved Q08 code scope (verification pending)
- Approved conditional sign-case choice: X≥0 → X>a and X<0 → X<−a. Original final `n14-08` and its 3 original authored wrong keys preserved; reverse iff and OR/AND explanation only after final correct choice.
- N14 Q07 has human Gate① acceptance and its source content is untouched; N14 Q12 R1 is a separate unapproved correction.
- New N14 revision5 migration chains old revisions and archives v4 including all previous original answers and Q07 added nodes; until CI tests this is an implementation hypothesis, not a verified runtime result.
