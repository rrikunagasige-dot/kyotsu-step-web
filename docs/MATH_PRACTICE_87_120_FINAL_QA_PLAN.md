# MATH PRACTICE 87–120 FINAL QA PLAN

Status: PREPARED BEFORE 120 IMPLEMENTATION

Purpose:
87–120 の実装完了後、個別問題のCI PASSだけでは見逃す「教材全体としての不整合」を最後に一括監査する。

## 1. Learner-facing information architecture

Expected:
- Math I・A
- 演習タイプ
  - 基礎演習
  - 共通テスト演習
- 章
- テーマ
- 問題

「集合と命題」の learner-facing themes は3つだけ:
1. 集合を整理する
2. 条件から命題を読む
3. 命題を証明する

Check:
- 87–97 → 集合を整理する
- 98–107,109,118–120 → 条件から命題を読む
- 108,110–117 → 命題を証明する
- 118–120 のための第4テーマを作っていない
- problem number はテーマではなく問題IDとしてだけ見える

## 2. Topic navigation

For every theme:
- theme tap → first problem immediately
- no intermediate confirmation page
- problem-number nav stays inside problem page
- next problem exists → 「次の問題を解く」
- topic end → 「テーマ選択へ戻る」
- no oversized completion-only screen

Expected counts:
- 集合を整理する: 11
- 条件から命題を読む: 14
- 命題を証明する: 9
- total: 34

## 3. Current-stage compression

For all reviewed 87–120:
- only current subproblem/stage is shown
- finished long derivations disappear from default view
- previous result link appears only when logically required
- previous result is compact by default
- tap may expand prior derivation/reminder
- future stages remain hidden
- current target is always visible

Special anchors:
- 87: independent membership judgments
- 94: graph dependency with selective reuse
- 97: linear dependency
- 117: cross-problem theorem dependency
- 119: current-item-only is especially important because there are 10 requested values
- 120: model-building and domain stages remain local to the active subproblem

## 4. Hole quality

For each problem:
- complete no-blank solution exists conceptually
- holes correspond to thinking nodes
- no conjunction-only holes
- no isolated final-answer guessing
- no repeated vocabulary hole after meaning is already known
- no isolated arithmetic token hole merely to increase count
- derivation does not skip two or more meaningful reasoning steps
- wrong answer does not count as progress
- retry/hint does not leak the final answer

## 5. Answer leakage audit

Inspect:
- headings
- current-target labels
- captions
- dependency links
- hints
- wrong-option explanations
- problem stem
- previous/next formula
- completion area

Fail if:
- current answer is visible before learner resolves its thinking node
- a future stage result is visible
- a previous subproblem answer is displayed without logical need

## 6. Math rendering

Every problem surface must use the same math-rendering path:
- problem prose
- prompts
- choices
- hints
- resolved answers
- target labels
- dependency results

Critical syntax sweep:
- complements / set notation
- ∩, ∪, ∈, ∉
- finite-set literals
- radicals
- fractions
- inequalities
- superscripts / subscripts
- implication
- function substitutions with parentheses

Fail if:
- raw authoring syntax visible
- KaTeX error present
- complete formula split into visually misleading fragments
- duplicate formula caused by separate renderer paths

## 7. Mobile-first visual QA

Viewport checks:
- no page-level horizontal overflow
- current target visible without searching
- choices readable without sideways scroll
- long derivations grouped semantically rather than stacked as many large cards
- 119 ten-item problem list wraps safely
- 120 units stay readable next to formulas
- dependency links remain compact

## 8. Cross-problem dependency QA

117 must show:
- compact 「116の結果」
- theorem statement A+B√2=0 ⇒ A=B=0 for rational A,B
- expandable short reminder
- no forced re-solving of 116
- no full 116 derivation by default
- theorem only appears at the stages where coefficient separation is needed

## 9. Japanese / Chinese parity

For every published problem:
- same problem number
- same blank IDs
- same correct option IDs
- same stage/dependency structure
- no Japanese kana left in Chinese source
- no locale changes to stable question IDs

## 10. Source fidelity

Re-check original source for:
- numbers
- signs
- inequalities
- radicals
- subproblem order
- domain conditions
- wording that changes mathematical meaning

If uncertain:
- stop
- re-check source
- do not normalize by memory

## 11. Repository hygiene

Before final merge:
- no unrelated physics diff
- no duplicate problem source
- no stale pilot:false for completed problem
- no temporary debug code
- no abandoned test IDs
- no failed CI hidden by weakening tests
- authority docs reflect the final accepted behavior

## 12. Final acceptance

Required:
1. typecheck PASS
2. focused math-practice tests PASS
3. build PASS
4. mobile smoke PASS
5. desktop smoke PASS
6. production deploy PASS
7. final manual learner-flow QA
8. docs/worklog updated

Only after all eight:
- mark 87–120 integration complete
