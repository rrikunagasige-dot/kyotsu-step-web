# W-MATH-025/P-002 — N06 Q12 誤答ヒントの因数先出しを防ぐ
**Status: APPROVED — Stage B N06 Q12 NOT YET IMPLEMENTED**  
Command: CMD-WORK-001「修正」／§12B同根事象  
2026-10-22 JST

## 現状と根本原因
現行 `src/data/textbook/math/numbers/n06Lesson.ts`、`q:12` の問題は「残った `x²+x−2` を和1・積−2から因数分解して、`(x+y)` も残し完成させる」もの。正答 `(x+y)(x+2)(x-1)` は正しい。しかし誤答ヒントは **「2と−1なら和は1、積は−2。」** と述べ、求めるべき因数の定数 `2` と `−1` をそのまま示す。

## exact 承認済み変更案（Stage BはGate① Q11後）
**旧：** `hint:'2と−1なら和は1、積は−2。'`

**新（提案）：** `hint:'積が負なので二数は異符号。和が正なので、絶対値の大きい方が正になる。元の因子(x+y)も残そう。'`

解の数字・完成した因数はヒントには出さず、符号の判定と先の因子を保持する行動だけ案内する。

## 境界と確認
- **変更対象はN06-Q12のヒント1文のみ。** N06 Q01–11/Q13–15、N05のP-001および別Work W-MATH-024のQ18、他モード、正答/4択、図、revision3、保存履歴は変更禁止。
- 検算：残余 `(x+2)(x−1)=x²+x−2`、先の因子 `(x+y)` を合わせて正答と一致。改訂後も2、−1の先出しがないことを確かめる。
- **P-002を個別に明示承認してから**、Q12だけ限定実装→CI→実画面のGate①→ユーザー細部確認→横断監査。P-001の承認でP-002を自動実施しない。
- 当該提案ブランチは文書だけ。N05 Q18の最新実装や承認済みN13版を破壊するマージを行わない。

## 2026-10-23 JST — both exact original proposals approved, staged sequentially
- The user replied **「承認続けて」** directly to the explicit question confirming **both** W-MATH-025/P-001 (N05-Q11) and P-002 (N06-Q12). This approves the existing exact one-hint-only scope of each proposal, **not** mass changes, merging or release.
- User later replied **「继续」** to continuation. Canonical Work §12A stages each small question independently: **N05 Q11 implementation and real numbered Gate① first**. N06 Q12 P-002 approval is preserved, its learner code remains untouched until Q11 visual Gate① is explicitly accepted; do not ask for P-002 reapproval.
- Implementation branch `work/W-MATH-025-n05-q11-hint-approved-20261023` forked from W-MATH-024 Q18 approved Gate① HEAD `524a26ea9d765d166a42d8324d2f2bead493e4b1`, not from stale W-MATH-025 proposal-only branch. In this Stage A, **the sole learner code change is N05-Q11 wrong-only hint**: `積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。`.
- New focused N05-Q11 Vitest, a single preview-native `n05-q11` review marker, 320/390/1440 exact-SHA Playwright wrong/hint/retry and normal-mode regression, and GitHub capture CI are verification-only additions. N05 revision2, 20 original source questions and choice keys, original figures and historic progress unchanged. Protected accepted N05 Q18 and N13 Q05/Q08; N14 Q16 separate Gate① pending.
- **Q11 Gate① BLOCK-CHECK-PENDING** until real screenshots pass and user reviews numbered authentic sheet. **Q12 approved but not implemented**. Gate② open for both; Gate③/not yet hosted; no main merge, release or fee.
