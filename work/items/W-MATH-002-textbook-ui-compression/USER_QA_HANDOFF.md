# W-MATH-002 — ユーザー実地レビュー手順

Status: SOURCE-IMPORT PREVIEW URL PREPARED / BROWSER LAUNCH NOT YET VERIFIED
GitHub implementation: https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/57
Branch: `work/W-MATH-002-textbook-ui-compression-implementation-20261011`
Important: **NOT deployed to GitHub Pages**; public `main` still serves the old UI. A browser-only source-import launch route is prepared via StackBlitz, but actual successful launch is NOT verified.

[Open PR #57 source in a browser preview](https://stackblitz.com/github/rrikunagasige-dot/kyotsu-step-web/tree/b8791e82215a56512094e265025c112d116e59d3?startScript=dev&view=preview&initialpath=%2Fkyotsu-step-web%2F%23%2Flearning%2Ftextbook%2Fmath-sets)

This is the exact PR #57 app source at code SHA `b8791e82...`, not a simulated textbook and not a released production deployment. See [PREVIEW_ENTRY.md](PREVIEW_ENTRY.md) for launch assumptions, limits and QA route.

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
[Math Textbook workflow 38104661479](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661479) PASS. This does not replace user visual acceptance. An experimental source-import browser-launch URL is documented; no separately hosted deployment or verified live runtime URL exists. Never link old published Pages as if it were PR #57.
