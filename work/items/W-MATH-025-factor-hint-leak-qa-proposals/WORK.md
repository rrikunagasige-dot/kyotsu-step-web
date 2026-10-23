# W-MATH-025 — 因数分解ヒントの同根先出し残留
Status: VERIFYING
Command: CMD-WORK-001 修正
Date: 2026-10-23 JST

§12B correction-first。N05 Q11 と N06 Q12 に、誤答後ヒントがまだ求める整数組を直接教える同根問題を確認した。**このWorkは調査・exact提案書のみ**で、source、review marker、figure、schema、progress、CI、公開環境は一切変更していない。

[独立原因記録](./FINDINGS.md)、[P-001](./PROPOSAL_P001.md)、[P-002](./PROPOSAL_P002.md)、[正規Proposal](./PROPOSAL.md)。両Pは別個の修正範囲で、片方の承認は他方の実装許可ではない。W-MATH-024 Q18のGate①、N13 Q05/Q08 Gate①は再承認しない。先にW-MATH-024とN13の正確な現在地を再確認した上で個別に実装する。

## 2026-10-23 JST — both exact original proposals approved, staged sequentially
- The user replied **「承認続けて」** directly to the explicit question confirming **both** W-MATH-025/P-001 (N05-Q11) and P-002 (N06-Q12). This approves the existing exact one-hint-only scope of each proposal, **not** mass changes, merging or release.
- User later replied **「继续」** to continuation. Canonical Work §12A stages each small question independently: **N05 Q11 implementation and real numbered Gate① first**. N06 Q12 P-002 approval is preserved, its learner code remains untouched until Q11 visual Gate① is explicitly accepted; do not ask for P-002 reapproval.
- Implementation branch `work/W-MATH-025-n05-q11-hint-approved-20261023` forked from W-MATH-024 Q18 approved Gate① HEAD `524a26ea9d765d166a42d8324d2f2bead493e4b1`, not from stale W-MATH-025 proposal-only branch. In this Stage A, **the sole learner code change is N05-Q11 wrong-only hint**: `積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。`.
- New focused N05-Q11 Vitest, a single preview-native `n05-q11` review marker, 320/390/1440 exact-SHA Playwright wrong/hint/retry and normal-mode regression, and GitHub capture CI are verification-only additions. N05 revision2, 20 original source questions and choice keys, original figures and historic progress unchanged. Protected accepted N05 Q18 and N13 Q05/Q08; N14 Q16 separate Gate① pending.
- **Q11 Gate① BLOCK-CHECK-PENDING** until real screenshots pass and user reviews numbered authentic sheet. **Q12 approved but not implemented**. Gate② open for both; Gate③/not yet hosted; no main merge, release or fee.
