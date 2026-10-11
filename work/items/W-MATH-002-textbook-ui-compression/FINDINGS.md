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
