# W-MATH-014 — N14 Q07 一般化の証明の小ブロック修正
Status: VERIFYING
Updated: 2026-10-21

## Objective
Repair confirmed R2 root cause (original source N14 Q07 marked 「導出」 but source learner app has only a final inequality). Produce ONE sign-case guided proof block, preserving original Q07 key, figure, progress and earlier user-approved content.

## Current authority
Owner/repo rrikunagasige-dot/kyotsu-step-web, canonical main 2f05c6b34e4853a76bc5b24b9eb0b0cee6ac3c79; review-only PR #101 remains Draft. Approved correction order from W-MATH-011: N11 Q14 repaired, user 「おけ続けて」 grants visual Gate① for Q14; outstanding N14 Q07, then Q08, Q12. Constitution, CMD-WORK-001, WORK_SYSTEM §§12A/12B/12C, MASTER_APP_LESSONS and Textbook SPEC apply.

## Proposal branch and checkpoint
proposal/W-MATH-014-n14-q07-general-proof-20261021, based on exact PR #101 review HEAD 5f5d92a1a798259dc6e947ff561065a4800850c6. Original Word SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa. N14 current Git blob 15cfb7bb70153a9661a9377270ae090974d54c1b, revision3, 16 original Q markers.

## Proposed exact scope
Only N14-Q07 original source marker, 2 new sign-case choices and original unchanged final n14-07, after-answer two-direction proof, conditional N14 rev3→v4 archive and exact source/migration/browser tests. No learner source changes under this unapproved plan.

## Depends on
Q14 user Gate① completed; no actual Q07 implementation approval. Need user to decide on [P-001](./PROPOSAL.md) first. N14 Q08/Q12 remain separate known and unapproved corrections. Gate② and Gate③ incomplete.

## Do Not Touch
All N14 Q08/Q12 source, existing Q07 key/3 authored wrong options, N14 original figure and other Qs, N11 already accepted, original Word, existing learner progress outside selective N14 revision, shared renderer/style/schema/mode/lessons, main, PR #101 merge, Pages and Vercel.

## Next step / stop rule
Present exact proposal; STOP before learner implementation. On exact approval implement on isolated branch, verify 18 actual screenshots and Q07 user Gate①, then independent impact audit. No future done or approval claims now.

## 2026-10-21 implementation checkpoint (supersedes old STOP-before-approval)
User replied **「いいよ」** after full P-001 approval question; exact learner implementation APPROVED. Source/test branch `work/W-MATH-014-n14-q07-general-proof-20261021` from proposal SHA `a8171711f1410e5cb9def0470e3389e809345b35`. Initial code-only commit `bcfebfb6e3c94e632eb7c0326ead88980805080a` has Q07 local guided branches, N14-only revision4 migration, 138-ops source math tests and browser 320/390 proof/wrong/retry checks. No other N14 question or main changed. Test results and Q07 Gate① images currently PENDING, not assumed PASS. N11 Q01–04/Q11/Q14 Gate① accepted unaffected; next work only after exact-SHA verification.


## 2026-10-21 current primary Work checkpoint / Gate① review
- Exact P-001 approval 「いいよ」 applied only to N14 Q07. Implementation branch/source SHA `e2bd800e72c488fe9e51c98a4a01ec4b56086ff7`, internal review-only merged source SHA `e42356de0b01a314e3e39779de1ab98a57f4f85b`. GitHub [full math CI #39536925762](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39536925762) SUCCESS for implementation SHA.
- [Actual screenshot job #39538301948](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39538301948) SUCCESS for source SHA `e42356de0b01a314e3e39779de1ab98a57f4f85b`; screenshot commit `50465039632687ab1891687678a85b10904c9276`. 18 genuine files verified. [Q07 actual-image Gate① sheet](./GATE1_N14_Q07_REVIEW_SHEET.md) created: **BLOCK-CHECK-PENDING human review**. Gate② Q08/Q12 and Gate③ full app review pending, main/public release not authorized.
- Operational issue: §12C C2/C5 was not followed during CI; assistant repeatedly checked unchanged GitHub workflow after short arbitrary waits instead of recording checkpoint and carrying out safe independent source/lesson audit. User supplied screenshot and explicitly called this out. This violation is acknowledged, not a claimed rule defect.
- Corrected execution: on CI start save exact primary SHA/run/return point; perform independent approved source/maths and linked correction proposal drafting when predicates C3 hold; inspect CI only after a substantial independent block or before a CI-dependent operation; limit to 1 primary+1 secondary. Keep Q07 source frozen while Q08 proposal drafting (not code) is independent. Do not overwrite previous approved Q14/Q11 statuses.

## 2026-10-21 Q07 human visual approval
User replied 「いいよ」 when asked to decide Q07 Gate① AND separate W-MATH-015/P-001 implementation. Q07 only **BLOCK-VISUAL-OK** after 18 real image review sheet, exact source commit `e42356de0b01a314e3e39779de1ab98a57f4f85b`; Work remains VERIFYING pending Gate② and later entire Gate③. Q08 implementation separately approved, but source changes require its own bounded Work and migration. Q12 unapproved and not merged; main/hosting protected.
