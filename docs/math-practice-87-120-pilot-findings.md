# Math Practice Pilot Findings

## Current status

The first runtime pilot is now active **only on the integration branch**:

- 87 — 素数と集合
- 94 — 補集合
- 97 — 共通部分から定数を決める

`main` remains unchanged.

The pilot keeps the reviewed practice structure:

1. **問題** — original problem only
2. **考えながら解く** — guided reasoning / blanks

The existing Common-Test flow and physics/textbook content are unchanged.

## Compatibility findings and resolutions

### 1. Common-Test-only invariants were embedded in a catalog test

The repository previously tested every built-in question as if it were Common-Test presentation with a `finalBlankId`.

`QuestionSchema` already supports `presentation: 'standard'`, so the global test assumption was narrower than the schema.

Resolution:

- keep the existing `finalBlankId` invariants strict for `common-test`
- test `standard` practice separately
- standard practice contains every authored reasoning blank directly in the guide flow
- do not invent a fake final-choice blank

### 2. Japanese / Chinese catalogs require identical grading structure

The repository requires both language catalogs to have identical IDs, blanks, correct answers, variants and simulation grading.

Resolution:

- one reviewed Japanese authoring source
- an explicit Chinese localization layer
- one shared adapter
- stable IDs and grading structure in both languages
- a test rejects Japanese kana in the Chinese pilot

### 3. Old catalog-count expectations were stale

The current continuous-textbook architecture intentionally produces no legacy Chapter 1 worked-example practice questions.

Therefore the real baseline is currently:

- 2 existing Math I・A questions
- 3 existing physics practice questions

The old tests still expected 17 physics questions and 14 legacy textbook worked examples. Those stale expectations were updated to the current repository state rather than recreating removed legacy content.

## Runtime/UI findings

The standard practice screen now makes the reviewed two-block structure explicit:

- **問題**
- **考えながら解く**

This is a label/structure clarification only; the existing learning-session state machine, retry behavior and progress storage were not redesigned.

The mobile sub-question navigator (①②③…) remains on HOLD.

Problem 94 is intentionally the stress case for a long 8-part exercise. The first mobile smoke test confirms that it opens at Pixel 7 width without horizontal page overflow. This does **not** yet prove that the long vertical experience is pedagogically ideal; that decision remains for actual inspection before implementing sub-question navigation.

## Validation result

Latest pilot CI on the integration branch passes:

- dependency install
- TypeScript typecheck
- targeted math-practice unit tests
- Japanese/Chinese catalog parity tests
- production build
- mobile Playwright pilot smoke

Mobile smoke results: **4 / 4 passed**

1. 87 / 94 / 97 appear in Math I・A practice using short titles
2. 87 visibly separates **問題** and **考えながら解く**, including wrong → retry → recovered-correct behavior
3. 94 opens on mobile without horizontal page overflow
4. 97 reaches the equation-building thinking node while the original problem does not leak `3a-2=4`

## What is still intentionally not done

Do not enable 88–93, 95–96, or 98–120 yet.

Do not implement:

- mobile sub-question tabs/chips
- a LearningSession state-machine redesign
- a new simulation curriculum
- guidance-level redesign
- analytics
- changes to physics/textbook content

The next gate is human inspection of the three pilot questions in the real app. After that, either fix issues revealed by the pilot or expand in the planned four batches:

1. 87–97
2. 98–109
3. 110–117
4. 118–120
