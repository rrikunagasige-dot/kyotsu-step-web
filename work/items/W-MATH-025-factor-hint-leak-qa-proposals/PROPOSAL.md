# W-MATH-025 — approved P-001 & P-002, staged execution
Status: APPROVED

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
