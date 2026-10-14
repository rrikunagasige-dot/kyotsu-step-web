# W-MATH-002 — Action Log

## A-001 — Dictionary confirmation
Date: 2026-10-11
Action: Read live target `governance/INSTRUCTION_DICTIONARY.md`, classify user's natural-language request as `SIMILAR` to `CMD-WORK-001「修正」`, and receive user's explicit confirmation: 「今のでいい。憲法からもいいし、今のこれもいい。じゃ続きよろしく」。
Result: ASSESS / PROPOSE allowed. Implementation not authorized.

## A-002 — Read-only software audit
Date: 2026-10-11
Action: Verified target repo ID/main HEAD; examined practice display component, target/result registry, maths textbook display/page, schema, published set lesson samples, math mode router, old practice MASTER LESSONS, E2E tests, and past PR #31 status. Also checked main Work record directory for approved correction; no existing authorized W-MATH-002 implementation found.
Evidence: `FINDINGS.md`; all paths/line references there; canonical target main `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`.
Result: Current learning flow reveals future content but does not compress completed past. Practice flow does compress and includes explicit dependencies and a click-to-expand. Note definition-after-answer hazard.

## A-003 — Proposal-only record
Date: 2026-10-11
Action: Prepared this Work and P-001 for user review. No source/data/code/UI/CI/prod changes, no main or Settings change.
Result: PROPOSED; STOP before implementation. Provide review link.

## A-004 — Proposal review URL and baseline checks
Date: 2026-10-11
Action: Created proposal-only [Draft PR #56](https://github.com/rrikunagasige-dot/kyotsu-step-web/pull/56) from a branch anchored to the verified main baseline. GitHub compare showed exactly five new `work/items/W-MATH-002-textbook-ui-compression/**` files, with no changes/deletions to original app or curriculum. Repository Governance Check [38103507520](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38103507520) SUCCESS.
Result: Work is PROPOSED, not approved for implementation, merging or Settings modification. Proposal presented to the user for explicit review.

## A-005 — P-001 approval and math-sets UI implementation (2026-10-11)
User's exact reply: 「いいと思う」 to the question 「このP-001修正案で実装へ進んでよいか？」. Preserved proposal-only Draft PR #56; created separate work branch. Implemented **display-only** math-sets stage metadata and math-only reading view, compact history + full original expansion, prior-source references, explicit next-stage, view pointer persistence, CSS and targeted regression tests. All other mode/source data including math practice and physics remain unchanged. Implementation tests currently PENDING observed CI. See `APPROVAL_P-001.md`, `SCOPE.json`.

## A-006 — First GitHub CI failure and scoped test correction (2026-10-11)
The first implementation run [38104372113](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104372113) passed typecheck, target unit tests, and production build but **FAILED mobile Playwright** (8 failed, 6 flaky, 17 passed); a shared E2E helper incorrectly attempted the new math-sets-only Next control on unchanged review units and sometimes before the async textbook page loaded. No source lessons changed. Fixed the helper to wait for the reader and use explicit Next only when `math-textbook-compact-flow` is present, and corrected locale labels, next-stage focus/scroll, reload/reset dialog handling, and an overly broad KaTeX expectation. Must rerun; do not report browser PASS yet.

## A-007 — Full QA closure for approved implementation code (2026-10-11)
After the first red run, re-scoped the E2E helper rather than changing the user-approved lessons. Exact code head `66a24ea41951af99459435bc1198c256c360d0e7`:
- [Repository Governance CI 38104661477](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661477) SUCCESS.
- [Math Practice pilot CI 38104661486](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661486) SUCCESS, mobile 36/36, desktop 36/36.
- [Math Textbook CI 38104661479](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661479) SUCCESS: typecheck, Vitest 11 files / 110 tests PASS, build PASS, mobile textbook 31/31, desktop textbook 31/31, Physics Chapter 1 desktop 13/13, Math Practice setup desktop 36/36.
- Original target main 455 tracked blobs: 451 unchanged; only four P-001-approved existing UI/CSS/E2E files modified. Nine new files confined to stage registry/test and W-MATH-002 records. No deletions or out-of-scope additions/edits; math lesson, mathematics practice, physics source and original governance 162/162 protected blobs byte-identical.
- Standalone `src/data/textbook/math/presentation.test.ts` was added and typechecked but is not in the workflow's explicit Vitest file list; **do not count it as executed**. The runtime stage partition validator and E2E learner flow were executed in both browser projects.
Status: Code QA PASS; actual user's visual acceptance and explicit main merge authorization remain PENDING. No Pages deploy.


## A-008 — Browser-accessible source preview launch route (2026-10-13)
User correctly objected that PR #57 source and old Pages URL were not an actually usable application preview, and explicitly requested implementation. Investigated production Vite base/HashRouter, package `dev` script and external documented StackBlitz GitHub-import by immutable commit. Added `PREVIEW_ENTRY.md` with a commit-pinned import URL, `view=preview`, `startScript=dev` and `initialpath`. This uses real PR #57 source; **the third-party browser runtime has not been independently verified**. No production deploy, Github Settings, main merge, or curriculum changes. If import fails, this remains a BLOCKER until a real preview is confirmed.


## A-009 — P-002 scoped implementation (2026-10-14)
- User approved exact P-002 implementation after seeing the live PR #57 defects; no merge approval.
- Created independent branch `work/W-MATH-002-P-002-context-and-history-20261014` from merged main `2419a6c`.
- New per-item source-prerequisite registry and fail-closed reference validation in `presentation.ts`. The source math lesson remains unchanged.
- The active step's first unanswered `itemId` selects context. Earlier input formulae/definitions display directly, optional figure stays click-to-expand. Completed history is one closed toggle by default.
- Preserve legacy numeric stage cursor because all 15 stage boundaries remain unchanged.
- Updated mobile/desktop E2E regressions, stage unit assertions, and existing CI-selected `setLesson.test.ts`.
- Latest outcomes pending PR CI. No main merge or GitHub Pages publication.


## A-010 — QA failure handling / E2E contract upgrade (2026-10-14)
Initial PR #59 mobile run `38425132500` ended with exactly one failed outdated assertion (36/37 successful). Reviewed raw GitHub Actions logs and modified `e2e/math-textbook-set-smoke.spec.ts` to explicitly open previously closed history before asserting original source restoration. Work stays VERIFYING pending a clean exact-head run. No main merge.


## A-011 — P-003 source-fidelity and display correction (2026-10-14)
After user explicitly requested locations, proposals, then approved 「よろしく」, created `work/W-MATH-002-P-003-display-fidelity-20261014` from released main `9ea189a` and Draft PR #60. Protected original math curriculum. Changes: preserve LaTeX command groups in `normalizeTextbookMath` while escaping plain finite-set braces; retain exact original math formula choices; add existing SVG `figure-d-complement` to d08/d09/d10 question context (auto-visible only for that existing diagram); full-width/2-line formula option rendering from original `\\quad` for long alternatives, narrower viewport CSS. Added unit/E2E tests, no new images or source alterations. Exact-head CI pending.


## A-012 — Test assumption repair (2026-10-14)
Inspected Actions logs `38491225573`: P-003 new De Morgan E2E incorrectly expected `\\cup` at choice index 0 despite intentional option shuffle. Replaced with order-independent assertion checking both original choices are correctly rendered, without changing educational data or production choice order. Rerun required before PASS or main release.

## A-013 — P-004 investigation and targeted fix (2026-10-14)
User screenshot: figure caption shown but SVG rectangle empty at intersection. No reset was performed; previously answered set-b01 appeared resolved. Inspected main 7eaac5d: all 11 math set SVG assets and source figure references already present, but TextbookFigure resolved prefixes through optional `import.meta.env?.BASE_URL`, unlike Vite's documented direct constant. Existing E2E only checked container visibility under Vite dev server. P-004 branch changes asset prefix to direct `import.meta.env.BASE_URL`, adds compiled-output Playwright preview mode, visible figure `img.complete/naturalWidth/naturalHeight/src` checks plus all eleven SVG browser decode checks. CI and Pages publication are gated on compiled preview smoke before upload. No reset, asset rewrite, new diagram, or content changes.
