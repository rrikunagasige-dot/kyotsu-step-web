
## 2026-10-23 — current accepted candidate reconciliation
User visually accepted all five items with 「続けていいよ。5件承認。　後仕事はまたどれぐらい残っているのか私に状況説明」, then authorized continuation 「おけいいよ。じゃ続けて」. **Q16 Gate① is BLOCK-VISUAL-OK; no repeat acceptance required.** Older pending statements below are historical.
This branch reconciles the exact accepted Q16 lesson from e64fd99b18ba167364c2dd6b108a6f7fef76f439 into PR118/e4f9cbe850379d0dd30d1a5c9484e8bdf606390d. Preserve current N13 rev3/rev4 migrations and all accepted hint/choice changes. Q16 original images remain immutable at f5b15694740325b56077fe64d740c7a7dc8fb22e; [original evidence](https://github.com/rrikunagasige-dot/kyotsu-step-web/tree/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1). New candidate QA is **PENDING**. [Reconciliation and audit](./RECONCILIATION_20261023.md). Gate② OPEN; Gate③ FINAL-REVIEW-NOT-READY; no main merge or deployment.

# N14 Q16 — GitHub 実画面・細部確認票（W-GOV-008/P-003）

Review: W-MATH-022 / exact approved P-001
Status: BLOCK-CHECK-PENDING（ユーザー細部確認待ち）
Block: N14-Q16; q16-chain; stable IDs `n14-wm022-q16-left-inner`, `n14-wm022-q16-left-abs`, `n14-wm022-q16-right-inner`, `n14-wm022-q16-right-abs`, `n14-16`.
**この確認票に埋め込む固定画像の撮影元・テストSHA:** `e64fd99b18ba167364c2dd6b108a6f7fef76f439`
**その実画像15枚を保存した固定コミット:** `f5b15694740325b56077fe64d740c7a7dc8fb22e`（このコミットにあるREADMEが撮影元SHA e64fd99b18ba167364c2dd6b108a6f7fef76f439 と明記）。
**注意:** 後からブランチ上の画像が再撮影されても、この確認票は**固定コミットの画像だけ**を指す。画像の出典が勝手に変わることはない。
Source: Teacher-original Word N14 Q16 (handoff ZIP 2026-10-22); app `src/data/textbook/math/numbers/n14Lesson.ts` revision10.
Route: review-only `/#/review/n14-q16` under GitHub Actions preview build; not a public playable URL.
Unchanged: Q10/Q14/Q15 previously accepted math/choices; Q15 P-003 four-question wrong hint; N14 original figure; 16 original source questions; other modes.
Pinned authentic capture: [GitHub Actions #39752264290](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39752264290), **SUCCESS**, code SHA `e64fd99b18ba167364c2dd6b108a6f7fef76f439`; uploaded in immutable commit `f5b15694740325b56077fe64d740c7a7dc8fb22e`. Browser 320/390/1440, normal + numbered views.
Review history: [WORK](./WORK.md), [ACTION_LOG](./ACTION_LOG.md), [VERIFICATION](./VERIFICATION.md).

## ユーザーに見せる部分

**今回ここだけ確認：N14 Q16**。左端・右端をそれぞれ代入し、絶対値の計算と、両端を含むかの判断を一続きにしました。

![実Chromeで得たN14 Q16 390px完成状態・確認①〜③](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1/q16-review-complete-390.png)

- **確認①（左端）** 左端を代入し、中身と絶対値を別々の選択で埋められる。
- **確認②（右端）** 同じ順で右端を計算でき、320pxでも代入式とボタンが欠けずに見える。
- **確認③（結論）** 二つの結果を比べ、最後に「両端とも含む」を自分で判断できる。

[320px の誤答後ヒント実画像](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1/q16-review-wrong-320.png) ／ [320px 学習途中](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1/q16-normal-before-320.png) ／ [1440px 完成](https://raw.githubusercontent.com/rrikunagasige-dot/kyotsu-step-web/f5b15694740325b56077fe64d740c7a7dc8fb22e/work/items/W-MATH-022-n14-q16-endpoint-verification/evidence/gate1/q16-review-complete-1440.png)

**返信：** `細部OK` または `要修正：確認②の〇〇`。

`細部OK` はGate①の視覚確認のみです。横断Gate②・アプリ全体Gate③の `総チェックOK`、main統合・公開・課金許可にはなりません。

## Agent-only readiness

- [x] Source authority, math, five item IDs/answers and Q15 prerequisites recorded.
- [x] 15 authentic, immutable GitHub images at source/test SHA e64fd99b18ba167364c2dd6b108a6f7fef76f439, screenshot storage commit f5b15694740325b56077fe64d740c7a7dc8fb22e.
- [x] Each embedded image is pinned to verified commit f5b15694740325b56077fe64d740c7a7dc8fb22e, not a mutable branch. Source CI and screenshot run share tested SHA e64fd99b18ba167364c2dd6b108a6f7fef76f439.
- [x] Previously accepted marks Q10/Q14/Q15 remain hidden, Q16 has 3 numbered change markers.
- [x] Reviewer sees just 3 concise visual decisions and unchanged boundaries.
- [ ] User exact visual acceptance, response time, confirmed SHA and screenshot path to record.
- [ ] Gate② independent entire affected cross-audit.
- [ ] Gate③ verified executable entire-app SHA URL and explicit end-to-end user acceptance.
