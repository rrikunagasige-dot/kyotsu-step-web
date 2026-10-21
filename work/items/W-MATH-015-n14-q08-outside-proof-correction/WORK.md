# W-MATH-015 — N14 Q08「外側」一般式の導出不足を修正する準備
Status: VERIFYING
Updated: 2026-10-21

## Objective
§12Bの既知R2 N14 Q08を**1原問**として独立した証明→2つの式中穴→元の最終4択に再設計する。ただし今はProposal-only。Q08のコード・main・公開アプリは触れない。

## Ground truth / approval
Repo `rrikunagasige-dot/kyotsu-step-web`。Root Constitution, dictionary CMD-WORK-001「修正」, WORK_SYSTEM §§12A/B/C, Master lessons, Math Textbook SPEC。原典教師編集Word SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`、W-MATH-011横断監査 Q08 R2 CONFIRMED。現N14 blob `b8b0148c5abb0e99c95d4352b0549fe19a63110a`、revision 4。user has NOT approved this P-001 yet.

## A/B independent-work predicate
Primary A = W-MATH-014/P-001 N14 Q07, tested review merge SHA `e42356de0b01a314e3e39779de1ab98a57f4f85b`, real 18 screenshot job #39538301948 and image save SHA `50465039632687ab1891687678a85b10904c9276`; Q07 image Gate① user pending. Secondary B = W-MATH-015/P-001 research and documentation only from primary's Work checkpoint `4aa7d38c05dde2c060b979868258967948fe9be9` on separate branch. Proposal source analysis is independent of Q07 human Gate. Code change would conflict on N14 lesson and progress migration; NOT AUTHORIZED now. Never overlap active writes; max one secondary Work.

## Proposed scope and limits
[P-001](./PROPOSAL.md) proposes two sign-case holes `X>a`, `X<-a` before stable original `n14-08` OR final; backward proof after answer; historical N14 v4→v5 migration and strict tests on separate future approval. Anticipated N14 decisions18→20, eight-unit choices138→140, original N14 sources 16 intact. Preserve original wrong keys and existing Q07. No new figure/mode/lesson.

## Current state / return
Full P-001 **PROPOSED**. Wait for explicit user acceptance before learner implementation. Q07 Gate① still awaiting human review, and Q12 separate R1 backlog. Do not merge/deploy/publish. After this source/proposal small block checkpoint, return to primary W-MATH-014, confirm actual CI status at a meaningful boundary, show Q07 current image review + Q08 proposal.

## 2026-10-21 implementation underway (supersedes prior proposal-only restriction)
User 「いいよ」 approved exact W-MATH-015/P-001 following Q07 Gate① explicit acceptance. Work branch `work/W-MATH-015-n14-q08-outside-proof-20261021` starts from review-only commit `0841561265b95576fcfc84570fea9eaf2ef24488`, after Q07 Gate① recorded. First bounded learner/test commit: `64aa1e452099ed66c91b41efa5b92c4b1d133b41` with four files (N14 Q08 local, N14-only rev5 migration, math source tests, existing E2E review capture tests). Q07 approved source is frozen; Q12 untouched. CI & 18 real Q08 screenshots and user Q08 Gate① PENDING. Do not claim success before exact run results, or merge/deploy main.
