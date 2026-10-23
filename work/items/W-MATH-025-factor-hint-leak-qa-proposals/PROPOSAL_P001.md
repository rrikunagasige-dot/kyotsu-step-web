# W-MATH-025/P-001 — N05 Q11 誤答ヒントで因数の整数組を先出ししない
**Status: APPROVED — Stage A N05 Q11 IMPLEMENTING**  
Command: CMD-WORK-001「修正」／§12B同根事象から派生  
2026-10-22 JST

## 現状と根本原因
現行 `src/data/textbook/math/numbers/n05Lesson.ts`、`q:11` では、問題は「積が−16、和が−6となる二つの整数を探す」、生徒が整数の組と因数分解を選ぶ。正答 `(a-8)(a+2)` は正しい。しかし誤答時ヒントが **「−8と2なら積は負、和も負になる。二条件をともに確かめる。」** と述べ、*求めるべき整数組そのもの* を教えている。符号の説明自体は正しいが、問いの独立判断を失わせる。

## exact 承認済み変更案（N05 Q11 1箇所のみ）
**旧：** `hint:'−8と2なら積は負、和も負になる。二条件をともに確かめる。'`

**新（提案）：** `hint:'積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。'`

求める組 `−8,2` と答えの `(a-8)(a+2)` は、誤答ヒントで明かさない。

## 境界と確認
- **変更対象はN05-Q11のヒント1文のみ。** Q01–10・Q12–20、Q18の別途承認済み修正、既存正答・誤答選択肢、補助図、N05 revision2、20 original Word questions、回答履歴は変更禁止。
- 原式の検算 `(-8)×2=-16`, `(-8)+2=-6`, `(a-8)(a+2)=a²−6a−16` は検査で確かめる。ただしヒント内には入れない。
- P-001が承認されたときのみ、最新の**N05 Q18実装・Gate①履歴**と枝を照合してから1文限定実装→テスト→本物のChrome 320/390/1440 Gate①画像→ユーザー細部確認→Gate②二周目。変更に追加スコープが必要なら再提案。
- **この提案ブランチは文書専用**。N05 Q18実装のコードは取り込んでいない。勝手なmainマージ、公開、追加費用、他の教材修正は禁止。

## 2026-10-23 JST — both exact original proposals approved, staged sequentially
- The user replied **「承認続けて」** directly to the explicit question confirming **both** W-MATH-025/P-001 (N05-Q11) and P-002 (N06-Q12). This approves the existing exact one-hint-only scope of each proposal, **not** mass changes, merging or release.
- User later replied **「继续」** to continuation. Canonical Work §12A stages each small question independently: **N05 Q11 implementation and real numbered Gate① first**. N06 Q12 P-002 approval is preserved, its learner code remains untouched until Q11 visual Gate① is explicitly accepted; do not ask for P-002 reapproval.
- Implementation branch `work/W-MATH-025-n05-q11-hint-approved-20261023` forked from W-MATH-024 Q18 approved Gate① HEAD `524a26ea9d765d166a42d8324d2f2bead493e4b1`, not from stale W-MATH-025 proposal-only branch. In this Stage A, **the sole learner code change is N05-Q11 wrong-only hint**: `積が負なので二数の符号は異なる。和が負になるには、絶対値の大きい方が負になる。積が−16、和が−6の両方に合うか確かめよう。`.
- New focused N05-Q11 Vitest, a single preview-native `n05-q11` review marker, 320/390/1440 exact-SHA Playwright wrong/hint/retry and normal-mode regression, and GitHub capture CI are verification-only additions. N05 revision2, 20 original source questions and choice keys, original figures and historic progress unchanged. Protected accepted N05 Q18 and N13 Q05/Q08; N14 Q16 separate Gate① pending.
- **Q11 Gate① BLOCK-CHECK-PENDING** until real screenshots pass and user reviews numbered authentic sheet. **Q12 approved but not implemented**. Gate② open for both; Gate③/not yet hosted; no main merge, release or fee.
