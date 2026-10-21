# W-MATH-018/P-004 — N14 Q10 確認専用の黄色枠だけ320pxで内幅を確保
Status: APPROVED — user direct 「承認」 on 2026-10-22 JST; ONLY exact review frame CSS change authorized
Date: 2026-10-22 JST
Command: CMD-WORK-001 修正 / WORK_SYSTEM §12A・§12B / W-MATH-018 P-003 measured stop

## Current proven facts and why P-003 cannot simply continue
- The original N14 Q10 mathematics is approved: THREE logical equations, ONE interleaved reason, FIVE student decisions with answers `3,3,3,-2,8`, unchanged stable IDs and revision7 selective archive.
- P-003 approved full-size original blue 「選択」 and red 「×」 formula buttons. Its 430px-and-below CSS grid correctly wraps the second formula into TWO visual rows; ordinary N14 Q01→Q11 passes at 320/390, review at 390 and desktop 1440 pass.
- **However**, actual Chromium [run #39642196191](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39642196191) at source SHA `98de588ec8950b62b745aa397bc7d94a3276799e` fails specifically the yellow-numbered **review route 320px**: formula scrollWidth 216px versus clientWidth 213px. First attempt and allowed CSS padding=0 still fail. This is a real QA FAIL, not a Gate① user rejection. Other 5 test cases pass.
- [Real screenshots/artifact](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/39642196191/artifacts/12364463820): genuine 320px **normal** source and 390/1440px normal/review states. This artifact does **not** include the failing 320px review screenshot (the test assertion stopped before saving), so the exact 216/213 failing state is evidenced by the Action assertion/log rather than a falsely labeled image.
- Source root: `src/pages/TextbookUnitPage.tsx` inserts a `review-marked-block` with `data-testid="review-mark-n14-formula-10"` around the second equation only when marked. `src/review/review.css` currently applies `padding: .65rem` plus 2px borders (5px left) to every numbered review block. That extra wrapper inset, absent from the normal student app, leaves 3px too little space at viewport 320. Existing P-003 CSS cannot further remove its own formula padding without changing another (unapproved) container.
- P-003's exact stop rule forbids downsizing buttons/math or silently editing this review-only frame. Hence P-004 needs **separate exact approval**.

## P-004 narrowly scoped proposed change — review frame ONLY, not lesson UI
Change exactly ONE source file: `src/review/review.css`.

Append one Q10-specific mobile rule after the existing `.review-preview .review-marked-block` styles:

```css
@media (max-width: 430px) {
  .review-preview [data-testid="review-mark-n14-formula-10"] {
    padding-inline: .4rem;
  }
}
```

This reduces only the **yellow confirmation frame** for the N14 Q10 second formula from .65rem (10.4px) to .4rem (6.4px) horizontal padding on each side, theoretically releasing 8px: currently 213px inner vs 216px needed. Retain its 2px/5px border, color, yellow 「確認」 marker, vertical spacing, and original 3-formula grouped derivation.

No change to `src/styles/global.css` P-003 formula grid/normal learner view, `src/components/textbook/TextbookFormula.tsx`, original full-size hole buttons, N14 source math, answers, revision7, other existing markers, approved N11/N14 content, or desktop >430px. No public/main/hosting operations. Keep previous rejected P-002/failed P-003 records as history; do not claim P-004 approved before the user's explicit decision.

## Verification and stopping
- Run existing full N14 Q10 authentic Chromium review+normal 320/390/1440 tests, with all six formula parts inside the viewport/formula line, no internal scroll, exact full-size blue 「選択」/red 「×」, wrong/hint/retry/focus and 5 decisions intact; ensure formula math still has TWO visual rows only on narrow screens and THREE logical formulas throughout.
- Verify the 320px yellow marker remains legible and does not occlude a part of the equation. Check screenshot and layout, not only CSS pixel counts. Compare 390/1440 layout with prior approved screenshots.
- Run relevant N11/N14 regression, original 16 N14 Q labels, v6→7 archives, physics and math-practice tests; log affected/NOT-AFFECTED/UNVERIFIED per §12B.
- If even this narrow review-frame correction fails at 320, **STOP**, publish measured evidence and a revised proposal. No automatic further CSS tuning or font/button downsizing.
- Only after a real PASS, produce GitHub-viewable authentic Gate① sheet linked to exact verified source SHA. User checks **only N14 Q10** and replies `細部OK` / `要修正`. Gate② independent audit, Gate③ matching playable URL and explicit `総チェックOK` remain separate.

## Exact approval request
**N14 Q10の通常教材と穴は一切変えず、スマホ430px以下の「確認専用」黄色枠 `review-mark-n14-formula-10` の左右余白だけを .65rem から .4rem に縮め、320pxの不足3pxを解消するP-004を承認しますか。**

## Explicit user authorization — 2026-10-22 JST
User directly replied **「承認」** to the specific P-004 proposal and approval question. This authorizes solely the proposed `src/review/review.css` scoped padding change and corresponding verification/Work evidence. It is not Gate① visual acceptance, Gate② PASS, Gate③ `総チェックOK`, main merge, or deployment consent. P-003 approved full-size choices and P-001 mathematics must remain unchanged.
