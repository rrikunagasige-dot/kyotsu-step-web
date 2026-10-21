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


## 2026-10-21 current verified screenshot checkpoint — human Gate① pending
- Exact approved W-MATH-015/P-001 source commit `9bd7b347f9e9fd1a9a53fd6c0e5928fcdfda3beb`: [Math CI #39541910451](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39541910451) **SUCCESS**, repo governance #39541910596 and preview-code #39541910526 SUCCESS. Full 140 math operations, past accepted N11 and Q07, source/migration and physics/math-practice regressions included.
- Internal PR #105 merged **ONLY into Draft PR #101 review branch** at source `1983966b718bbdd38ac13f8de5eb3a0709d4445b`; all 4 modified source/test blobs match the tested PR #105 source byte-for-byte. [Actual image job #39543275894](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39543275894) **SUCCESS**; PNG-only save commit `b94fe90710aafef37e04d8200ceffb1bbd4cc3fb` changed 48 PNGs (18 newly added Q08 genuine frames), no learner code change.
- [Q08 Gate① actual review sheet](./GATE1_N14_Q08_REVIEW_SHEET.md) ready: **BLOCK-CHECK-PENDING for human visual approval**. Q07 and N11 earlier detailed user approvals are maintained, no re-approval. Global Gate② still pending separate N14 Q12 R1 correction (proposal-only W-MATH-016/P-001). Final entire app Gate③ NOT READY, main SHA `2f05c6b34e4853a76bc5b24b9eb0b0cee6ac3c79` untouched, no deploy/publication.
- Under §12C while primary CI and screenshot ran, audited [Q08 source/math options](./SOURCE_AUDIT_N14_Q08_20261021.md), [N14 Q01–Q06](./ADJACENT_N14_Q01_Q06_AUDIT.md), [N14 Q09–Q16](./ADJACENT_N14_Q09_Q16_AUDIT.md), and drafted separately scoped Q12 P-001 at `b800caafcf73a914379a692a35d93eecc1a9be04`, without code modification. Check CI only at block boundary, avoid arbitrary repeated waits.
