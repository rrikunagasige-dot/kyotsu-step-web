# W-MATH-002 — ユーザー実地レビュー手順

Status: READY-FOR-HANDS-ON / NOT YET REVIEWED
GitHub implementation: https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/57
Branch: `work/W-MATH-002-textbook-ui-compression-implementation-20261011`
Important: This is **NOT** deployed to GitHub Pages; current live `main` site still has the old UI. PR #57 can be reviewed as source; a rendered preview would require running the branch separately, or a separately approved release.

## Focused learner walkthrough — math-sets only
1. Open Mathematics Textbook > published 集合 with clean learning progress, on the **PR #57 code build**, not main.
2. Answer the first set-of-divisors hole. Check that the explanation defining 集合 and 要素 and original source set equation become fully readable. They must NOT be collapsed automatically when the answer is correct.
3. Read the newly revealed explanation, click `次へ`. Confirm the completed stage turns into a one-line card and the next current stage is full prose. No other future stage or answer is leaked.
4. Tap `全文を見る` to restore the **identical source paragraph, answer, math, dialogue and any relevant figure**. Reclose it. Tap `過去の学習をすべて見る` for a full previous-stage review.
5. If a current stage needs earlier math, inspect the explicit `前に学んだこと` formula reference. It must show the **original earlier** equation, not newly invented text.
6. Refresh mid-lesson; the stage cursor must resume. Reset the lesson; it must show the first unresolved hole again and never skip freshly unlocked concept content.
7. Complete all stages; ensure the final original `まとめ` remains available and the unit-complete panel only appears after entering the final stage.
8. Review mobile narrow widths / keyboard toggle and Chinese UI. Chapter titles remain the same original three, original teacher/hanako/taro dialogues and the concept words remain in black.

## What remains forbidden
Any manual changes to lesson prose, math expression, options, figures, math practice, physics, review-only units, original governance, GitHub Settings, main merge, release stage. Record any user objections as REVIEW-FEEDBACK and prepare P-002 rather than editing without fresh approval.

## Automation evidence / limits
[Math Textbook workflow 38104661479](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661479) PASS. This does not replace user visual acceptance. No live branch preview/deploy URL was created; do not link the old published Pages site as a preview of PR #57.
