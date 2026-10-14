# W-MATH-002 — Verification

Status: CODE-QA-PASS / USER-REVIEW-PENDING
Date: 2026-10-11

## V-001 — Repo provenance
Check: target repo ID 1391122224, live main `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`, unrelated Paul repo read-only.
Result: PASS (actual GitHub metadata and branch API).

## V-002 — Evidence traceability
Check: practice renderer and explicit target/dependency registry; textbook grouping/reveal/rendering; math source and QA behavior; student-mode authority and difference between published and review.
Result: PASS for static read-only comparison. No runtime behavioral test newly executed; behaviors inferred from current implementation and existing cited tests.

## V-003 — No implementation
Check: new branch must add only `work/items/W-MATH-002-textbook-ui-compression/**` documents relative to main; no existing source / original mode / app changes.
Result: PASS on initial proposal PR #56 commit `510bfaa12f870aac04725ef91a22d7671fcd861a`: exactly five new Work files; no original file changes, no deletes. GitHub Repository Governance Check run 38103507520 SUCCESS. Follow-up records-only commit requires a fresh run before exact-head PASS.

## V-004 — Proposed implementation
Check: the seven QA areas in `PROPOSAL.md`.
Result: IMPLEMENTATION IN FEATURE BRANCH / TESTS PENDING. PR #56 remains a pure proposal. No main merge/Settings approval.

## V-005 — Authorization
Check: no approved math textbook compact UI proposal exists in current Work; user authorized analysis/proposal only.
Result: P-001 approved for implementation only via direct user reply 「いいと思う」. SHA anchors stored in `APPROVAL_P-001.md`. Main merge and Settings not authorized.

## V-006 — First implementation CI
Date: 2026-10-11
Commit: `05d61db9680490d77cba3c83a971b5fa5d3b3cc1`
Result: PARTIAL. Governance Check [38104372096](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104372096) PASS; independent Math Practice pilot [38104372103](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104372103) PASS; Math textbook CI [38104372113](https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104372113) **FAIL** at mobile Playwright (8 failed, 6 flaky, 17 passed) after its typecheck/unit/build steps succeeded. Root cause isolated to common E2E helper invoking math-sets-only next-stage control on review units or before the reader had mounted. Fix staged, repeat CI required.

## V-007 — Latest exact implementation code SHA (2026-10-11)
Code head: `66a24ea41951af99459435bc1198c256c360d0e7`
- **PASS** Repository Governance Check https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661477
- **PASS** Math Practice pilot https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661486 (36 mobile + 36 desktop).
- **PASS** Math Textbook https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38104661479 (11 explicit Vitest files, **110/110** cases; typecheck and production build; **31/31** mobile textbook, **31/31** desktop textbook; **13/13** Physics Chapter 1 regression; **36/36** Math Practice setup regression).
- Math-sets new stage progression/compact card/expand/cursor/keyboard assertions were in the complete textbook E2E file and passed in both browser projects.
- Standalone `presentation.test.ts` **not run by this workflow's enumerated Vitest command**, so do not label it Vitest PASS. Runtime partition coverage and E2E did run.
- Baseline Git diff: 455 original blobs, 451 unchanged; four allowed original UI/CSS/test files changed; no original source data/figures/canonical mother/Constitution changed. 162 original curriculum/governance protected blobs same Git SHA. Nine new files only within P-001 scope, zero unexpected deletions or additions.
- **PENDING** user's hands-on judgement and separately authorized merge/release. This Work stays VERIFYING; no public app is updated by the Draft PR.


## V-008 — Independent browser source-import entry (2026-10-13)
Prepared: StackBlitz documented import URL targeting exact PR57 code SHA `b8791e82215a56512094e265025c112d116e59d3`, auto-running `dev`, initial path `/kyotsu-step-web/#/learning/textbook/math-sets` (see PREVIEW_ENTRY.md). Confirmed repository public and `vite` dev script, HashRouter and configured Vite base. **Result: NOT YET VERIFIED** for actual external browser import, package installation, in-browser runtime, or user's hands-on acceptance. This is NOT a production deployment and does not close Work.


## V-009 — P-002 pre-CI / source-scope audit (2026-10-14)
P-002 implementation is on a new feature branch. Source code modifies only math-sets presentation metadata, guarded textbook renderer and CSS, plus math E2E/unit tests and Work documentation; curriculum source files, IDs, figures and source revision are untouched. New item-context registry validates every referenced original source block precedes its item stage; keeps unchanged 15-stage partition. Exact main-vs-branch diff and GitHub CI must be checked once PR is open. **No PASS for CI/browser QA yet**. Separately authorized main merge and user visual acceptance remain pending.


## V-010 — First P-002 PR #59 exact QA (2026-10-14)
- Initial source PR head `96ab1e406bab0277d1cf8b7855214023df8e54e8`: Governance PASS `38425132549`, targeted typecheck/Vitest/build PASS in Math Textbook `38425132500`. Mobile E2E: **36 passed, 1 failed**, stale P-001 assumption that first completed stage remained visible. The updated 1-line-history requirement intentionally removes it from the default DOM; existing test updated to open history explicitly. E2E remained FAILED for that commit, no passed-claim.
- Correction commit `f1738b643511b5d308e0d7457be3cfd0dbffe121` revised only the incompatible assertion. Exact-head CI and separate user QA remain pending. No production release or merge.


## V-011 — P-003 pre-CI audit / release gate (2026-10-14)
Draft PR #60 from source HEAD `9ea189a`: only math presentation registry, shared TeX normalization (with unit tests), textbook reader/CSS/E2E, CI-selected setLesson tests, and Work records changed. Original lesson source `setOutsideSlice.ts`, `setRealLineSlice.ts`, `setLesson.ts`, assets and answer IDs untouched. Regression tests added for original SVG, TeX-group preservation across five formula items, 320px two-line `set-f11`. Pending independent exact-head Governance/CI. Do not mark SUCCESS until result and user visual QA.


## V-012 — P-003 initial exact-head CI (2026-10-14)
- On source commit `4a8e78f70b922270f293ea00f675d17d0bac34a8`, Governance SUCCESS, math practice independent CI SUCCESS; math textbook Typecheck, original and P-003 unit tests, and Build SUCCESS.
- Mobile E2E: **39 passed, 1 failed**. Failed assertion assumed fixed choice ordering; source/app behavior legitimately randomizes choice order. It was an invalid test expectation, not evidence of a broken mathematical renderer. Corrected at commit `093eecd57756c6b1a88f372cafee51ecf9d07471` with unordered checks; follow-up latest-head CI pending. Do not overwrite this initial failure.


## V-013 — P-003 code exact-head verified PASS (2026-10-14)
Approved implementation source head `2f0c3216879969804e17f718a4d657e39f4e64c9` passed all GitHub checks:
- **Repository Governance SUCCESS**: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38491685479
- **Math practice pilot SUCCESS**: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38491685536
- **Math textbook mode SUCCESS**: https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38491685502
  - Typecheck, original/P-003 Vitest suite, production build PASS
  - **Mobile math textbook 40/40**, **Desktop math textbook 40/40**, **Physics textbook 13/13**, **Math practice setup 36/36**
- Compared main `9ea189a` and code head: only approved math reader rendering, normalizer/tests, style, P-003 original-figure reference and Work records touched. No modifications to accepted source lesson, original Word, answer data, figures/assets or modes' curricula.
- The earlier 39/40 mobile failure was an invalid fixed-choice-index expectation; corrected and preserved in V-012, and clean run confirmed PASS.
- **Not yet verified**: human visual acceptance of F01 appearance; there is no live P-003 version URL because Draft PR #60 is not merged. No release approval inferred from technical CI.

## V-014 — P-004 verification contract / pending (2026-10-14)
Base main 7eaac5d, work branch `work/W-MATH-002-P-004-published-figure-assets-20261014`. Tests added: actual figure images require `img.complete`, positive `naturalWidth/naturalHeight` and exact GitHub Pages subpath for unfilled Venn + filled intersection after answer; each of the existing 11 SVGs loaded and decoded with a browser Image object. Both mobile+desktop run from built `dist` via `E2E_USE_PREVIEW=1` and `vite preview` in PR and Pages deployment CI (before upload). No source lesson/assets or user progress changes. **PASS NOT CLAIMED** until exact-head CI and Pages deployment return SUCCESS. Never reset learners to simulate success.

## V-015 — P-004 original production-smoke failure and controlled fix
Initial commit `da695517ba4d4dabd1531ea98d2ae226b2656c9a`, CI `38496043891`: Governance PASS, typecheck/Vitest/build PASS, but the newly added *compiled* HTML image test **FAILED for mobile and desktop** (`<img>` present with correct path but `toBeVisible() = hidden`), while all existing SVG decode tests passed on both. Therefore no merge or release was performed; this test correctly detected a defect older dev smoke missed.
CSS/image layout patch `8fbecea83992fdffc0090e197cd21147ce4599ae` adds explicit width and height based on source SVG viewBox and responsive stage sizing; **follow-up exact HEAD CI is required**. The user progress persistence code is untouched; no reset action.

## V-016 — P-004 exact source code QA PASS (2026-10-14)
Final code commit `8fbecea83992fdffc0090e197cd21147ce4599ae` (subsequent commits only Work documents): Math textbook CI **SUCCESS** https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38496386685
- Typecheck, unit tests, built production preview: PASS.
- Production Venn image displayed (including actual positive width/height) in mobile and desktop Chromium: PASS.
- All 11 original Math Set SVG decoded and loaded from `/kyotsu-step-web/assets/math/textbook/sets/`: PASS.
- Existing Math Textbook mobile and desktop: PASS; Physics textbook regression: PASS; Math practice setup regression: PASS.
- Independent Math practice pilot CI **SUCCESS** https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38496386687; Governance PASS https://github.com/rrikunagasige-dot/kyotsu-step-web/actions/runs/38496386686.
- First test run failure `38496043891` preserved in V-015. No reset or source image alterations.
Release gate: user authorized merged Pages release within P-004, but **main merge, deployment SUCCESS, and hands-on visual approval not yet claimed here**.

## V-017 — P-005 binary/target pre-CI (2026-10-14)
Approved asset PNG is 720x300, 4515 bytes, original generated geometry maintained including overlapping C and visible label, source image cropped to the diagram region only; Git blob SHA `7a609a1e84b73dbaa46bb67ca3062b29b4e9821a` matched locally computed Git blob hash. Source figure ID `subset-after`, original caption, alt, and lesson flow remain unchanged; `venn-union` still references its original SVG; progress schema untouched. Added unit test checking PNG signature/intrinsic dimensions and app source, plus compiled-`dist` browser test for actual PNG decoded and visible at target stage. **CI and live deployment not yet verified**; must not claim published result until release workflow passes.
