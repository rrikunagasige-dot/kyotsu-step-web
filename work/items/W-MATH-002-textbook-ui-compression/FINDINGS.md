# W-MATH-002 Findings — live implementation vs target

Date: 2026-10-11
Scope: comparison/read-only, from target main `be98aa0dc2c4f29d5bfb33e2295bbb9063099e33`.

## F-001 — CONFIRMED: 練習の圧縮は既にソフトウェア上で実装
`src/components/learning/MathPracticeReadingFlow.tsx` lines 37–58: first unresolved blank selects currentTarget. Lines 73–100: `targetIdForFlowIndex` and `renderedEntries` keep only the current target and already-reached steps if subproblem compression enabled. Lines 102–138: explicit dependency targets and full prior resolved details. Lines 158–190: prior result compact chip and click-to-expand. Lines 196–232: external result reuse. `src/data/mathPractice/presentation.ts` supplies explicit target/dependsOn/result definitions; no guessing that every prior subproblem matters.

## F-002 — CONFIRMED: 今の学習モードは「未来を隠す」が「過去を圧縮しない」
`src/pages/TextbookUnitPage.tsx` lines 50–62: grouping by headings. Lines 120–152: first incomplete group and visible block slice. Lines 330–344: **all** already-unlocked groups stay rendered. Lines 455–493: prior visible sections also accumulate, and current notice explicitly says previous prose and figures remain. Existing `continuousLesson` is one `lesson` section for target `math-sets` (`setLesson.ts` lines 31–75).

## F-003 — PEDAGOGICAL RISK: 穴の正解後に定義が現れる
`src/data/textbook/math/set/setLesson.ts` lines 83–114: the first divisor example blank is followed by the *meaning of 集合/要素* in `paragraph-set-concept`, then a formula. Immediately hiding the preceding stage when its last blank resolves would hide a newly revealed concept before it is read. The UI must keep the active learning stage open until explicit advance/read-complete, and must never cut continuous `derivationId` chains.

## F-004 — MODE BOUNDARY: 練習の「小問」を学習の「学びのまとまり」へ翻訳
The practice mode is question/target-oriented; textbook mode is concept→property→proof where necessary→example and prose is the backbone. `subjects/mathematics/AGENTS.md` explicitly forbids mechanical practice-flow transplant. Math Textbook imported candidate SPEC is CANONICAL-CANDIDATE and cannot overrule approved target lesson.

## F-005 — SOURCE / QA BOUNDARY
`math-sets` is currently `published`; proposition-reading/proof/quantifier/function candidates are `review`. Do not promote any of them. Existing `e2e/math-textbook-set-smoke.spec.ts` asserts original explanatory terms, diagrams, formula order, and reveal boundaries. Display compression will require tests for full-content restoration, explicit next-step, correct resolved state, keyboard accessibility and mobile scrolling, but cannot delete pedagogical expectations.

## F-006 — PERMISSION
User confirmed SIMILAR command `CMD-WORK-001` and asked for a **proposal**, not an implementation. No exact approved P-001 exists. Current GitHub changes are limited to this proposal-only Work folder. STOP at review.

## F-007 — IMPLEMENTATION APPROVAL (2026-10-11)
The user replied 「いいと思う」 directly to the explicit exact P-001 implementation question, without changing its scope. No approval was given to merge to main or modify Settings. A separate implementation branch was created from the proposal branch and an immutable approved-proposal and explicit scope SHA were recorded.

## F-008 — Confirmed first test harness failure (2026-10-11)
Type: ERROR-QA (observed)
First textbook CI 38104372113 reached mobile browser and failed. Failures pointed to `advanceMathStage` called from generic `answerItem` for both review-only units and some pre-mount math-sets navigation; the original renderer does not possess that control. Root-level governance and independent math-practice CI were PASS and textbook typecheck/unit/build reached later step, but learner-flow acceptance was NOT PASS. Isolate the helper to published math-sets only and wait for the page before interacting. Additional regressions need a clean rerun.

## F-009 — Recovery from red mobile CI is confirmed (2026-10-11)
Type: RESOLVED
The first run failed a generic E2E helper's route/scope assumptions, not the practice or physics product. By restricting stage navigation to the published `math-sets` reader and awaiting initial async mount, the exact follow-up Math Textbook CI 38104661479 passed all 31 mobile and all 31 desktop browser cases and original physics/practice regression. No curriculum text was touched.

## F-010 — Manual acceptance and separate unit-test selection (2026-10-11)
Type: REVIEW REQUIRED
User's hands-on judgment of compactness/readability is not established by CI. Also the current GitHub Math Textbook CI enumerates 11 existing Vitest test paths explicitly and does not include the new `presentation.test.ts`; that file remains authored/unexecuted in this run. Actual `math-sets` rendering invokes the strict partition validation and was covered by the 62 mobile/desktop E2E passes. Do not broaden workflow paths without a revised proposal.


## F-011 — Preview delivery gap (2026-10-13)
Type: ERROR-PROCESS / OPEN-QUESTION. The PR #57 frontend implementation and 3 CI workflows were complete, but user was incorrectly sent the old production Pages app as a way to see changes. That URL contains no PR #57 changes. Documented StackBlitz import of the exact immutable PR #57 source is now available as a **candidate launch route**, not a verified running deployment. This does not authorize a main merge or Pages/Settings changes. Successful launch and user visual QA remain unverified.


## F-012 — ERROR-SPEC / ERROR-IMPLEMENTATION (user screenshot 2026-10-13)
P-001 displayed up to fourteen cards for completed 15-stage history; the resulting page stayed long. The user rejected this in the actual Pages app. Must collapse **history itself** to a single default row. Existing 15 internal logical stages are not intended as 15 simultaneous student-facing headings.

## F-013 — ERROR-IMPLEMENTATION / PEDAGOGICAL-SOLVABILITY
At `set-d03`, the previous stage contained the original `U` definition and `B={3,6,9,12}`, but `presentation.ts` included only `formula-d-abar` in stage-wide references. Screen showed irrelevant A-complement, hid B and U needed for the answer. Other crosses: b03, c04, f07. Problem is presentation-layer dependency selection, not source pedagogy. P-002 uses per-current-hole exact earlier source IDs.

## F-014 — ERROR-QA
Earlier CI asserted the ability to click, reach stage, expand all and restore sources, but did not test whether the active question's prerequisites were visible. P-002 adds targeted learner-answerability tests and runs deterministic prerequisite checks as part of an existing enumerated CI test file.

## F-015 — SCOPE AND RESUME SAFETY
Stage anchor IDs, all 15 stage boundaries, original readingFlow and answer IDs remain unchanged. Existing numeric v1 cursor still maps identically; changing boundaries would require a migration and an explicit new review before release.


## F-016 — ERROR-QA: 2026-10-14 first P-002 mobile CI regression
Initial P-002 mobile test run `38425132500`: 36/37 tests PASS, one existing assertion in `correct answer fills the sentence and unlocks the next learning step` expected `math-textbook-stage-gather` always visible immediately after moving forward. This contradicts the newly approved **closed-by-default history** behavior and is a stale E2E assumption, not proof that the lesson has disappeared. Updated it to assert history initially absent, then explicitly open history, inspect original and preserve full restore. Follow-up CI must rerun; initial failure preserved.


## F-017 — ERROR-IMPLEMENTATION: TeX normalization changes grouping into singleton-set braces
Source answers of five math set items (e03/e05/e07/e08/f12) are correct `\\overline{A}` but shared `normalizeTextbookMath` matches the command grouping `{A}` as an unescaped set literal; it creates `\\overline\\{A\\}` and changes mathematical meaning. Explicit tests protect TeX commands, radicals, vectors, subscripts and plain finite sets. Renderer / TeX library alone was not the root.

## F-018 — CONFIRMED: existing asset for d08/d09/d10
Source block `figure-d-complement` exists before d03 at setOutsideSlice.ts 107, mapped to original `public/assets/math/textbook/sets/complement-after.svg`, with no overlays. It is appropriate after earlier A-complement has been introduced; do not use as an incorrect B-only complement diagram or before learner discovers the concept. Past-stage compaction hides it; P-003 introduces a safe post-definition reference.

## F-019 — ERROR-IMPLEMENTATION: fixed-width 2-column math alternatives
Current grid applies 2 columns regardless of source answer size; wrapping inside mathematical typography for `set-f11` results in unreadable lines. Original choice uses `\\quad` between two equations; P-003 preserves the same full answer value, only presents two separate math lines inside a full-width option card.

## F-020 — OPEN-QUESTION: F01 aesthetic difference
Both `formula-d-a` and `formula-d-abar` already use the same `TextbookFormula` renderer; the preceding `U` definition is a mixed text/math paragraph. P-003 harmonizes reference-panel KaTeX sizing but exact subjective font/alignment acceptance remains user screen QA and must not be claimed solved from CI alone.


## F-021 — ERROR-QA: randomized alternatives are not a fixed index
Initial P-003 mobile run `38491225573`: 39/40 cases passed, new De Morgan assertion failed because test expected correct `\\cup` alternative at option index 0 while original getTextbookChoices intentionally shuffles. Actual index 0 contained the *valid original distractor* `\\cap`, and correctly normalized TeX had no singleton-set braces. Replaced positional assertion with unordered checks for both original math choices; did not alter source or randomization.

## F-022 — ERROR-QA / likely ERROR-IMPLEMENTATION, image missing in published app
User screenshot contains the caption for `figure-b-blank` but no picture; another earlier P-003 figure was also requested. Source files and all 11 SVG assets exist in GitHub. P-003 checks only `toBeVisible` for figure container and runs `pnpm dev` (not production). The shared `TextbookFigure.resolveAssetSrc` uses an optional-chain `(import.meta as ...).env?.BASE_URL ?? '/'`, potentially preventing Vite's exact static production replacement and losing subpath prefix. This is a hypothesis until the **compiled** app actually loads all figures under `/kyotsu-step-web/`. P-004 fixes use direct constant and verifies exact element.src, decoding, and all 11 SVG assets. Caption visibility cannot count as figure QA.

## F-023 — CONFIRMED CSS sizing bug exposed by real production smoke (2026-10-14)
First compiled-app P-004 CI run `38496043891` failed **2 of 4** smoke cases (desktop + mobile): the real Venn `<img>` was present with correct prefixed URL `/kyotsu-step-web/assets/math/textbook/sets/venn-two-blank.svg` but Playwright marked the image **hidden**. The separate all-11-SVG decode tests **passed** on both PC and mobile. This establishes that the published Venn issue was **not simply an absent SVG**; the rasterization/decode path succeeds but its on-screen layout collapses.
The original math SVGs have `viewBox` but no root width/height; the shared figure wrapper used `width:fit-content` and the image `width:auto;max-width:100%;height:auto`. Their intrinsic/sizing interaction likely produced a zero rendered box. Fixed only math-set SVG stage CSS to explicit responsive width, `img width:100%`, plus matched original 640x360 Venn and 720x220 number-line viewBox metadata as image width/height attributes, while preserving all 11 original files and physics sizing. Final compiled-app rerun required before PASS.
