# Math Practice 87–120 Integration Plan

Status: **pilot implementation only**

This document freezes the integration scope before touching the existing practice-mode UI.

## Goal

Import the reviewed practice-mode material for problems 87–120 into the existing app without rewriting the practice engine at the same time.

The first integration is deliberately small: **87, 94, 97** only.

- 87: short/basic case
- 94: long multi-part case
- 97: reasoning/parameter case

These three expose different failure modes before the remaining 31 questions are enabled.

## CHANGE / KEEP / HOLD

### CHANGE

- Add a Math 1A practice catalog for problems 87–120.
- Use short mobile-friendly titles while preserving the original problem numbers.
- Add an authoring/source layer that is separate from `QuestionSchema`.
- Add a source → `Question` adapter.
- Publish only pilot questions 87, 94, 97 in the first pass.
- Reuse the original problem itself for simulation/self-check; do not invent a second exercise.
- Add unit tests for source/adaptor integrity.

### KEEP

- Existing physics practice questions.
- Existing physics textbook mode.
- Existing `LearningSessionPage` state machine.
- Retry/wrong-answer behavior.
- Existing progress storage.
- Existing question IDs and current question bank.
- Existing `QuestionSchema` 1.0 for the pilot.

### HOLD

Do **not** implement these until the pilot is inspected in the real app:

- mobile sub-question tabs/chips such as ①②③…
- a redesign of `LearningSessionPage`
- a new simulation curriculum
- guidance-level redesign
- analytics
- problems outside 87–120
- changing physics or textbook data
- merging directly to `main`

## Catalog / titles

| No. | Section | Short title |
|---:|---|---|
| 87 | 集合 | 素数と集合 |
| 88 | 集合 | 集合の表し方 |
| 89 | 集合 | 部分集合 |
| 90 | 集合 | 集合の包含関係 |
| 91 | 集合 | 部分集合をすべて求める |
| 92 | 集合 | 共通部分と和集合 |
| 93 | 集合 | 3つの集合 |
| 94 | 集合 | 補集合 |
| 95 | 集合 | 集合を復元する |
| 96 | 集合 | 3集合の複合演算 |
| 97 | 集合 | 共通部分から定数を決める |
| 98 | 命題と条件 | 命題と真偽 |
| 99 | 命題と条件 | 含意の真偽 |
| 100 | 命題と条件 | 反例 |
| 101 | 命題と条件 | 条件の否定 |
| 102 | 命題と条件 | 「かつ」と「または」 |
| 103 | 命題と条件 | 複合条件の否定 |
| 104 | 命題と条件 | 必要条件・十分条件 |
| 105 | 命題と条件 | 命題の真偽 |
| 106 | 命題と条件 | 集合で条件を表す |
| 107 | 命題と条件 | 必要・十分条件の判定 |
| 108 | 命題と条件 | 同値の証明 |
| 109 | 命題と条件 | 「すべて」と「ある」の否定 |
| 110 | 命題と証明 | 逆・対偶・裏 |
| 111 | 命題と証明 | 対偶による証明 |
| 112 | 命題と証明 | 無理数の証明 |
| 113 | 命題と証明 | 平方根と無理数 |
| 114 | 命題と証明 | 倍数の証明 |
| 115 | 命題と証明 | 背理法 |
| 116 | 命題と証明 | 有理数と無理数 |
| 117 | 命題と証明 | 無理数を含む等式 |
| 118 | 関数 | 関数とは何か |
| 119 | 関数 | 関数の値 |
| 120 | 関数 | 文章から関数を作る |

## Authoring rule

The authoring source must preserve the reviewed two-block structure:

1. **問題** — original problem only; no hint mixed into the stem.
2. **考えながら解く** — guided reasoning with thinking nodes.

For each question, audit in this order:

1. What is being asked?
2. Does the learner have to interpret the condition?
3. Does the learner choose the method?
4. Does the learner generate the equation/expression instead of receiving it?
5. Are there any two-step reasoning jumps?
6. Is any answer leaked before the blank?
7. Does every sub-question reach its requested final answer?
8. Does the prose read continuously rather than as a list of formulas?

Do not move to the next question until the current question passes all eight checks.

## Pilot acceptance gate

Before enabling 88–93 or 95–96:

- source records validate
- adapter output passes `QuestionSchema`
- no ID collisions
- typecheck passes
- unit tests pass
- build passes
- 87, 94, 97 can be opened from current Math 1A practice selection
- answer → wrong → retry → correct → complete works
- mobile-width inspection identifies whether multi-part navigation is actually needed

If 94 is too long on mobile, solve that as a separate UI change after the pilot. Do not mix that redesign into the data import commit.
