# W-MATH-022 — N14 Q16 端点代入・絶対値による確認
Status: VERIFYING
Updated: 2026-10-22 JST
Command: CMD-WORK-001 — 修正

## Objective
原Word N14【16】「両端の値を元の絶対値に代入し、どちらも含めてよいことを確認しよう。」を、完成計算の一括選択から、生徒自身の端点代入・絶対値・境界包含の段階確認へ直す。ただし本Workでは診断・exact提案まで。Q16 learner code実装は未承認。

## Authority
- Repository: rrikunagasige-dot/kyotsu-step-web。repo ID 1391122224。
- Baseline main HEAD: 15ae503455bc6ae75b080caa1c4919cafb250027.
- Parent approved Q15 work HEAD: 1e3cb0dd3a6d1a86e856ea8cdf625feccdb985a8.
- teacher original: KYOTSU_MATH_N14_Q10_Q16_AUTHORITATIVE_HANDOFF_20261022(1).zip / SOURCE/teacher_N14_original_word_v2.docx, SHA256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa; N14 question【16】 (DOCX paragraph index 611, following N14 Q13–Q15).
- AGENTS.md, governance/CONSTITUTION.md, INSTRUCTION_DICTIONARY.md, WORK_SYSTEM.md §§12A/12B, subjects/mathematics/textbook/SPEC.md and docs/MASTER_APP_LESSONS.md.
- Earlier W-MATH-020 Q15 + W-MATH-021 4-stage hint accepted; W-MATH-021 FINDINGS F-021-02 confirms the Q16 sibling.

## Branch
work/W-MATH-022-n14-q16-endpoint-proposal-20261022; created from W-MATH-021 HEAD, **proposal documents only**.

## Scope
Original N14 Q16; code reading and impact audit; PROPOSAL_P001 exact design (five distinct learning decisions) awaiting individual user review.

## Do Not Touch
N14 Q10/Q14/Q15 approved mathematics, Q15 P-003 four-stage wrong hint, other N14 blocks, original Word and one canonical figure n14-f01; math practice/physics; main, production, Pages, Vercel, PR merges, costs. No learner source, unit revision, history, tests, CSS, generated images changed in this proposal-only branch.

## Approved Proposal
P-001, 2026-10-22 JST: user's direct 「いいよ。続けて」 to the exact Q16 proposal. Not a visual Gate① acceptance or release authorization.

## Current Step
P-001 approved; five Q16 decisions, v9→v10 selective progress archive, dedicated unit/browser tests implemented in isolated branch. Native CI verification pending.

## Next Step
Run exact-SHA native GitHub CI and real Chromium 320/390/1440; check Q16-specific phone line wrapping and all 5 wrong/hint/retry; create real GitHub images and Gate① only after verified. Gate② and Gate③ remain open.

## Dependencies
Q13→accepted Q14→accepted Q15 results → Q16. Q16 needs Q15 endpoints -2/3 and 2; Q16 new answers must not leak earlier holes.

## Completion Condition
Proposal stage is completed when diagnosis/impact + exact proposed text/answers/hints/IDs/migration/tests is recorded and user can decide. Work itself cannot reach DONE without explicit approval, scoped implementation/verification and its applicable gates. Overall Gate②/③ remain OPEN.
