# W-MATH-017/P-008 — N11 Q13 Gate① 小ブロック実画像確認
Status: BLOCK-CHECK-PENDING / REAL-IMAGES-READY / USER VISUAL ACCEPTANCE NOT YET GIVEN
Date: 2026-10-21 JST
Approved exact proposal: [P-008](./PROPOSAL_P008_N11_Q13_DENOM_DISTRIBUTION.md), user 「いいよ続けて」
Source N11 rev10, original teacher Word Q13 only, learner screenshot tested SHA `62c1702fa41175bec3bb5dfa7b468e61dc5e80b4`
GitHub Actions [Review and real capture #39608141779](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39608141779): SUCCESS.
Evidence-only image commit: `17dc9635c8533d0d4dcb61a58a02442cb37ad5fa` — not itself the render SHA.
[Full screenshot album including 320/390/1440px](./evidence/p008-gate1/README.md)

## 今回の変更箇所だけ

Four equations are one continuous mathematical derivation, with exactly 2 interleaved short explanations. Markers below refer to **changed source blocks**, not to distinct "source questions"; Q13 is still one original question.

**確認① — 式内の倍率の穴（2つ）**

![Q13 second row, two multiplication factors](./evidence/p008-gate1/p008-review-step-1-before-390.png)

**確認② — 正の数と分母消去の説明**

![Q13 sign and cancellation explanation](./evidence/p008-gate1/p008-review-step-2-resolved-390.png)

**確認③ — 分配法則への橋渡し文**

![Q13 distribution explanation](./evidence/p008-gate1/p008-review-step-3-before-390.png)

**確認④ — 最後の式の2つの穴**

![Q13 x coefficient and constant](./evidence/p008-gate1/p008-review-step-4-before-390.png)

## 通常の学習画面（黄色い確認枠なし）

![N11 Q13 coefficient gap after two explanations](./evidence/p008-gate1/p008-normal-q13-xcoef-before-390.png)

![N11 Q13 completion and original Q14 continuation](./evidence/p008-gate1/p008-normal-q13-resolved-390.png)

## 視覚確認ポイント（3点）
1. 4行の式・説明2箇所が**同じ枠の中**で連続し、式の間の説明が邪魔にならないか。
2. 倍率 `3` を左・右で別々に選び、展開後の `6` と `3` も**式の中で**考えられるか。正解が先に漏れないか。
3. スマホ320/390pxでも文字や式が切れず、Q13が完成すると既存Q14の導出につながるか。

P-006 Q05/Q06 and P-007 Q08/Q09 are **already accepted**: no repeat request; old screenshot images/history remain. No review marker outside Q13. Review-only yellow boxes do not appear in the normal learner app.

**返信： `細部OK` または `要修正`。** This is Gate① *visual acceptance only*. Gate② independent math/source/cross-unit audit and Gate③ same-SHA live whole-app user `総チェックOK` still open. No main merge or public app deployment.

## Evidence and status
- [x] Four formula rows + two paragraph bridges, four graded gaps, no grading of full premade result.
- [x] Original 14 N11 Word markers; current 31 graded operations, local Q13 source ID stable; revision9→10 archives v9 answer records then reopens only repurposed `n11-13`; older archives preserved in focused tests.
- [x] Real Chromium review + actual N11 beginning→Q14 normal route, wrong/hint/retry, 320/390/1440, exact SHA `62c1702fa41175bec3bb5dfa7b468e61dc5e80b4`.
- [ ] User Gate① answer.
- [ ] Final Math Textbook CI run #39608141804 conclusion pending at time of this record.
- [ ] Gate② overall / fresh original teacher Word line-by-line, N14 affected siblings.
- [ ] Gate③ SHA-matched public playable URL and user whole-app check.
