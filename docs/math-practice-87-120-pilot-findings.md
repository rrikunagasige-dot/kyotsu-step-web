# Math Practice Pilot Findings

## Why the pilot is staged but not yet exposed in the app

While wiring the first three questions (87, 94, 97) into the current question bank, the existing repository tests exposed two hidden assumptions that would make a direct publish risky.

### 1. The current built-in catalog assumes every question is Common-Test presentation

`src/data/questionCatalog.test.ts` currently expects every built-in question to:

- use `learning.presentation === 'common-test'`
- have a `finalBlankId`
- keep that final blank outside the guide flow
- include that final blank in every guidance variant

The new reviewed practice mode is intentionally different:

- the original **問題** is shown first
- **考えながら解く** follows as the guide
- the learner may complete several reasoning blanks
- there is no requirement that the final answer be represented by one special final-choice blank

`QuestionSchema` itself already allows `presentation: 'standard'`, so this is a **catalog-test assumption**, not a schema requirement.

Changing that global assumption must be a deliberate app-level decision, not a side effect of importing 87–120.

### 2. Japanese and Chinese built-in catalogs are required to have identical grading structure

`src/data/questionCatalog.zh.test.ts` requires Japanese and Chinese catalogs to have the same:

- question IDs
- revision/status
- taxonomy
- difficulty
- learning presentation / flow
- blank IDs and option IDs
- correct answers
- simulation structure

It also rejects Japanese kana anywhere in the Chinese catalog.

Therefore publishing the three Japanese pilot questions only in `questions.ts` would immediately break catalog parity.

## Action taken

The temporary change that appended the pilot questions to `builtInQuestions` was reverted.

Current branch state:

- full 87–120 title catalog: added
- source-layer types: added
- reviewed pilot sources for 87, 94, 97: added
- source → `QuestionSchema` adapter: added
- adapter unit tests: added
- existing app question bank: **unchanged**
- physics / textbook mode: **unchanged**
- main branch: **unchanged**

This is intentional. The pilot data is staged and inspectable without changing runtime behavior.

## Safe next decision

Before the pilot can be opened in the app, choose one explicit compatibility strategy.

### Recommended: make practice questions bilingual at the source layer

Add localized text for Japanese and Chinese while preserving one shared grading structure.

Then:

1. build `mathPracticePilotQuestions`
2. build `mathPracticePilotQuestionsZh`
3. update Japanese and Chinese question banks together
4. adjust catalog tests so the old “every question is common-test” assertion applies only to common-test questions
5. keep all existing finalBlank invariants for common-test questions
6. run the full check gate

This preserves the repository’s current language-parity guarantee and does not weaken existing Common-Test behavior.

### Not recommended

- silently fall back to Japanese in Chinese mode
- delete the Chinese parity test
- force the new practice mode into `common-test` only to satisfy an old test
- invent a fake final-choice blank when the reviewed pedagogy does not need one

## Gate before runtime activation

Do not append the pilot to `builtInQuestions` until all of these are true:

- Japanese/Chinese grading signatures match
- standard-presentation questions have explicit test coverage
- existing common-test finalBlank tests still pass
- adapter unit tests pass
- typecheck / lint / build pass
- then expose 87, 94, 97 only
- inspect mobile behavior before enabling the remaining 31 questions
