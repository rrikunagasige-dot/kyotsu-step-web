# W-MATH-002 / P-002 — 数学学習モード表示圧縮の再設計

Status: APPROVED FOR IMPLEMENTATION, NOT FOR MERGE
Approval: 2026-10-14 user responded 「じゃよろしく。いいと思う」 directly to the full P-002 proposal and its question 「このP-002の範囲と方針で実装に進んでよいか」.
Baseline: main `2419a6ca5d95b8cf62d0884769dfbda5a616f625` (merged PR #57).
Branch: `work/W-MATH-002-P-002-context-and-history-20261014`
Scope: **math-sets presentation only; source lesson content unchanged.**

## Problem from user's actual live screen
1. Previously completed stages accumulate as up to 14 large always-visible title cards, defeating compactness.
2. At item `set-d03`, `U` and `B` definitions are hidden in the previous stage, but an unrelated `overline A` reference is shown.
3. Source prerequisite inputs also cross `intersection→union`, `subset→empty set`, `real line→interval operations` stage boundaries.
4. Stage-wide references do not track the currently unresolved question. Existing E2E tests missed learner solvability.

## Authorized changes
- One-row closed history: "これまでの学習 (N段階)" with individual history detail available only on expansion. Keep the original three authored textbook headings unchanged; 15 internal stages remain, not displayed as 15 simultaneous headings.
- Map each active `itemId` to explicit earlier source block IDs (not content summaries). Show the small original precondition/equation automatically; earlier diagrams remain click-to-expand to avoid overlong pages; never leak future data.
- Audit all 15 original stage borders while preserving original block order and content, source `revision` and progress IDs. Keep legacy `math-textbook-compact-v1:math-sets:r2` cursor to ensure previously saved numeric positions remain valid since stage anchors do not move.
- Add regression checks for original source coverage, source-only predecessor references, no answer leakage, mobile/desktop rendering, history collapse, resumption, and representative items `set-b03`, `set-c04`, `set-d03`, `set-f07`.
- Protect math practice, all physics modes and math textbook unpublished/review units.

## Files eligible
`src/data/textbook/math/presentation.ts`, `presentation.test.ts`, `src/pages/TextbookUnitPage.tsx`, `src/styles/global.css`, `src/styles/mobile.css` if needed, `e2e/math-textbook-set-smoke.spec.ts`, existing pilot `set/setLesson.test.ts`, and W-MATH-002 Work records. Do not modify lesson content, source figures/assets, answers, schemas, app deploy settings, project Constitution, or prior PR history.

## QA and release gate
CI is required but **not sufficient**: actual user screen review is independent. An independent P-002 PR is the review artifact. Do not merge/main-deploy without the user's separate explicit authorization. Do not claim source-commit links are browser previews.

## Completion conditions
- Correct current question context, only prerequisite already-seen source; all-stage coverage validator.
- At least 9 stages completed has ONE closed history row, not 9 cards.
- No invisible needed operands in boundary cases, nor unrelated references.
- Source order and all original content/checksums unchanged.
- Keyboard, reload, mobile, desktop, other modes pass; any failing checks documented honestly.
