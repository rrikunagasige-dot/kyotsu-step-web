# MATH_TEXTBOOK_HANDS_ON_QA

数学・学習モードの review unit を user hands-on QA まで運ぶための台帳。

## Scope

対象:
- `math-propositions-reading`
- `math-quantifiers-all-exists`
- `math-propositions-proof`

対象外:
- 数学・練習モード本体
- `math-functions-conditions` の promotion
- Physics lesson data / assets
- Desktop / Remote Desktop

## Current curriculum contract

- `read-propositions`
  - `math-propositions-reading`
  - `math-quantifiers-all-exists`
  - 2 unit が揃って published のときだけ learner topic を開く。
  - 1 unit 目完了後は同じ topic の次 unit へ直接進む。
- `prove-propositions`
  - `math-propositions-proof`

## Automated QA status

### Content / pedagogy
- `math-propositions-reading`: FINAL UNIT QA PASS
- `math-quantifiers-all-exists`: FINAL UNIT QA PASS
- `math-propositions-proof`: FINAL UNIT QA PASS

監査済み:
- source fidelity
- concrete judgment → concept naming
- answer leakage
- unresolved wrong answer → staged hint → retry
- strong → medium → light support fading
- mixed-text / KaTeX safety
- progressive reveal
- figure alt / caption order
- mobile / desktop horizontal overflow

### Shared-UI findings fixed during hands-on preparation
1. Math `causal-reasoning` prompt
   - Before: 「変化の因果関係をたどろう。」
   - Problem: Physics wording leaked into math proposition/proof interactions.
   - After: Math uses 「条件や理由のつながりをたどろう。」
   - Regression E2E added.

2. Multi-unit topic atomicity
   - `read-propositions` must not become available with only one of its two units published.
   - Catalog-level readiness contract added.

3. Multi-unit continuation
   - Completing `math-propositions-reading` now continues directly to `math-quantifiers-all-exists`.
   - Catalog-level next-unit contract + E2E added.

4. Mobile choice layout
   - At <=640 px, choice cards stack into one column.
   - Long quantifier/proof choices no longer share a narrow two-column row.
   - Mobile regression assertion added.

## Manual hands-on gate

Automated PASS does not promote a unit. User checks the following in the real app.

### A. Reading rhythm
- 黒字本文が骨格として自然に読めるか。
- 「文章 → 穴 → 文章」が途中でぶつ切りに感じないか。
- 1画面に穴が多すぎないか。
- 同じ判断を無意味に繰り返していないか。

### B. Thinking quality
- 答えを直前の本文が言い切っていないか。
- 未知語を名称当てさせていないか。
- 先に具体例を考え、その後で概念名が付くか。
- strong → medium → light の支援減衰を体感できるか。
- 「ただ選ぶだけ」の穴になっていないか。

### C. Wrong-answer experience
- 間違えても先の本文が開かないか。
- もう一度押したとき hint が自然に出るか。
- hint が答えそのものを言っていないか。
- 正解後に赤や×が不自然に残らないか。

### D. Visual / mobile
- 390 px 前後でも横スクロールしないか。
- 長い選択肢が読みやすいか。
- 数式が細切れ・重複・崩れにならないか。
- 図が小さすぎないか。
- 図の caption / alt が答えを先に漏らしていないか。

### E. Unit-specific

#### math-propositions-reading
- 反例を見つける → 偽と判断する流れが自然か。
- 必要条件 / 十分条件を両方向確認してから名称化できているか。
- `prop-a06` / `prop-a08` の反復が「transfer」として有効か、冗長に感じるか。
- 条件の否定 → 条件版ド・モルガンが飛躍しないか。

#### math-quantifiers-all-exists
- 「ある」は witness 1つ、「すべて」は counterexample 1つ、という感覚が先にできるか。
- 否定の規則を暗記させる前に具体例から納得できるか。
- 長い文章選択肢がスマホで読みやすいか。

#### math-propositions-proof
- 逆・裏・対偶を名称当てではなく操作として理解できるか。
- 対偶を使う strategy を learner が自分で選んだ感覚があるか。
- 3の倍数の証明の式変形が細かすぎず粗すぎないか。
- 矛盾証明で `x≠0` を置く理由が自然か。
- 「背理法」という名称が worked example 後に出るため、意味が先に理解できるか。

## Promotion gate

review → published:
1. automated CI PASS
2. manual hands-on QA PASS
3. reported issues fixed locally
4. re-run regression PASS
5. user confirms promotion

User confirmation前:
- statusをreviewのまま維持
- PR #31をDraftのまま維持
- mainへmergeしない
