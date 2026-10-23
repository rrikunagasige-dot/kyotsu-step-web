# W-MATH-025 — approved P-001 & P-002, staged execution
Status: APPROVED

## CURRENT — 2026-10-23 JST Q12 hint-only Gate① accepted; new proposals await approval
- User's direct response **「いいよ続けて」** followed the numbered authentic Q12 hint review in this chat. Record **W-MATH-025/P-002 BLOCK-VISUAL-OK** for the hint-only scope, without inventing a literal 「細部OK」 quotation.
- Accepted IDs: item `n06-12`, block `n06-formula-12`, review target `n06-q12`; frozen app/source SHA `6d75ec551e738abc92be3af22b4502bb55e18a99`, original 18 PNG commit `0f93e549f418b3f67851dbfee161b726b278d7b7`; reviewed sheet predecessor `b1dc7e2ce7542ea1b7dd244a9490dfd1d4c2bf10`. The existing marker is hidden in subsequent review output, its IDs/history retained, and its accepted capture job disabled. Historical images are not replaced.
- This checkpoint changes review acceptance, its existing assertion and records only. **No learner source, hint, answer, choice, revision, progress, shared UI or original source changes.** Q11/Q18 and N13 Q05/Q08 acceptance remains intact.
- Full regression on predecessor `b1dc7e2ce7542ea1b7dd244a9490dfd1d4c2bf10`: Math [39891841676](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39891841676) **SUCCESS**, validate job 120213458428 (typecheck/lint/schema-unit tests/build, math mobile+desktop/source+derivations+figures+restore, physics textbook, math-practice setup); Review 39891841672 and Governance 39891841720 **SUCCESS**. This records CI success, not Gate② clearance of the independently confirmed unresolved defects. Updated acceptance HEAD CI is initially PENDING; recover actual SHA/run rather than treating prior PASS as verification of changed files.
- New exact proposals, **all PROPOSED / unapproved / not implemented**: [P-003 N06 Q03 hint](./PROPOSAL_P003.md), [P-004 N06 Q06 hint](./PROPOSAL_P004.md); different-cause [W-MATH-026/P-001 Q12 one duplicate distractor](../W-MATH-026-n06-q12-distinct-distractor/PROPOSAL.md). Drafting under §12B/§12C is authorized; this visual response does not approve those new edits.
- Next: present the three exact proposals, then execute only separately approved scope, one question and authentic Gate① at a time. Gate② remains OPEN due confirmed unresolved defects and required audits; separate N14 Q16 Gate① remains pending on PR111. Gate③ FINAL-REVIEW-NOT-READY; no main merge or publication authorization.
- Earlier snapshots below retain historical facts and pending states as of their own checkpoints; this CURRENT checkpoint governs present status.

## Current 2026-10-23
P-001 Q11 visual accepted by direct 「続けていいよ」. P-002 exact hint is implemented; its original 18-image Gate① is ready but user acceptance is pending. Frozen capture/source `6d75ec551e738abc92be3af22b4502bb55e18a99`; images `0f93e549f418b3f67851dbfee161b726b278d7b7`. Review/Chrome and Governance succeeded; full regression/Gate② remains incomplete. See [current verification](./VERIFICATION.md) and [Q12 review](./GATE1_N06_Q12_REVIEW_SHEET.md). No additional finding is authorized for implementation.


## 2026-10-23 JST — authoritative Q11 visual acceptance and Stage B checkpoint
- Direct user response **「続けていいよ」** immediately followed this chat's Q11 確認① real-image review and explicit request for `細部OK / 要修正`. This is **Q11 BLOCK-VISUAL-OK**, not a fabricated literal `細部OK` quote, not Gate②/③ or release permission.
- Accepted original Q11 IDs: `n05-11`, `n05-formula-11`, review target `n05-q11`; original screenshot source `26c6e82130e52ff89a7bec352ec785aed2a062ad`, immutable images `eb7d99d0901562b7909e89903af01483f6aa23c1`. Reviewed current predecessor `aa6758fa8a8a8656a9c10860bd3815e4c51de57c`; all three source-head CI successes independently rechecked. Retain old evidence/history; hide only Q11's accepted marker and stop its recapture job.
- Stage B uses existing exact **W-MATH-025/P-002** approval (prior verbatim 「承認続けて」 for both proposals). Sole learner source mutation: `src/data/textbook/math/numbers/n06Lesson.ts` q:12 hint `2と−1なら和は1、積は−2。` → `積が負なので二数は異符号。和が正なので、絶対値の大きい方が正になる。元の因子(x+y)も残そう。`.
- Word source SHA256 `93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa`: N06 heading paragraph 248, Q12 paragraph 271, original Q01–Q16 confirmed including OMML. Actual N06 revision3 has **16 original questions / 16 graded items**, not the stale handoff shorthand 15; no source/revision/IDs/options/answers/progress edits.
- Existing same Work feature branch / Draft PR #115 retained; parent `aa6758fa8a8a8656a9c10860bd3815e4c51de57c`; base PR remains accepted W-MATH-024 branch. Preserve N05 Q11/Q18, N13 Q05/Q08 and all other learner code. Separate W-MATH-022 N14 Q16 Gate① remains pending.
- Verification-only surfaces: one N06 review target, review boundary assertions, actual Chrome test and Q12 capture in its own `evidence/gate1-q12/` folder at 320/390/1440. CI source/run IDs initially **PENDING**, to be recorded from actual GitHub results; no invented PASS.
- **Next:** obtain actual CI and original Q12 images; inspect Japanese/formula/hint; present only Q12 確認① for user Gate①. Same-root second pass / Gate② OPEN, Gate③ FINAL-REVIEW-NOT-READY; main/hosting unchanged. Sections below retain historical snapshots and are superseded by this checkpoint on current state.


**Current 2026-10-23:** exact separate P-001/P-002 both approved by 「承認続けて」. P-001 Q11 Stage A implemented and under verification; P-002 Q12 approved but code not touched until Q11 user Gate①. Historical prose below records original proposal-only state.

# W-MATH-025 — 同じ根本原因の未修正2問（提案のみ）
**Status: BOTH P-001/P-002 APPROVED; Stage A Q11 IMPLEMENTING / Q12 PENDING**

- [P-001 N05 Q11 — 数値対を先出ししないヒント](./PROPOSAL_P001.md)：**2026-10-23 明示承認済み**。
- [P-002 N06 Q12 — 因数の整数対を先出ししないヒント](./PROPOSAL_P002.md)：**明示承認済み**。

これらは2026-10-22のW-MATH-024 Q18修正後、§12B同根再監査から新たに見つかった**別問の不具合**。既存のW-MATH-024/P-001「可以」はN05 Q18のヒント1文だけを許可したもので、この2問の修正は許可していない。新しいコード変更、Gate①、Gate②の全体承認、main統合、配信をここでは行わない。最終的な別案の順番と承認はユーザーに委ねる。

## 2026-10-23 JST — both exact original proposals approved, staged sequentially
- The user replied **「承認続けて」** directly to the explicit question confirming **both** W-MATH-025/P-001 (N05-Q11) and P-002 (N06-Q12). This approves the existing exact one-hint-only scope of each proposal, **not** mass changes, merging or release.
- User later replied **「继续」** to continuation. Canonical Work §12A stages each small question independently: **N05 Q11 implementation and real numbered Gate① first**. N06 Q12 P-002 approval is preserved, its learner code remains untouched until Q11 visual Gate① is explicitly accepted; do not ask for P-002 reapproval.
- Implementation branch `work/W-MATH-025-n05-q11-hint-approved-20261023` forked from W-MATH-024 Q18 approved Gate① HEAD `524a26ea9d765d166a42d8324d2f2bead493e4b1`, not from stale W-MATH-025 proposal-only branch. In this Stage A, **the sole learner code change is N05-Q11 wrong-only hint**: `積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。`.
- New focused N05-Q11 Vitest, a single preview-native `n05-q11` review marker, 320/390/1440 exact-SHA Playwright wrong/hint/retry and normal-mode regression, and GitHub capture CI are verification-only additions. N05 revision2, 20 original source questions and choice keys, original figures and historic progress unchanged. Protected accepted N05 Q18 and N13 Q05/Q08; N14 Q16 separate Gate① pending.
- **Q11 Gate① BLOCK-CHECK-PENDING** until real screenshots pass and user reviews numbered authentic sheet. **Q12 approved but not implemented**. Gate② open for both; Gate③/not yet hosted; no main merge, release or fee.
