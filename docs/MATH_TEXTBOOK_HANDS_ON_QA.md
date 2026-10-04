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

validated code head:
- `34fab79dc7125e836d927df56e63197e1a99f100`
- Math textbook mode CI: success
- Math practice pilot CI: success

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

### 2026-10-04 deep static audit

User hands-on 前の assistant-side deep audit を、3 review unit 全54穴に対して実施。

- `math-propositions-reading`: revision 1 / 18穴
  - 学習目標を本文順（真偽 → 条件関係 → 否定）へ整列
  - A3 を「唯一の反例」に読めないよう「一例」と明示
  - A8 / B6 を light へ落とし、小節末で自力 transfer にする
  - B6 を definition ではなく transfer として扱う
- `math-quantifiers-all-exists`: revision 3 / 13穴
  - 「すべての2つの無理数」を、完成本文として自然な「どの2つの無理数を選んでも」へ修正
  - full-sentence answer 後の二重「である」を除去
  - `√2×√8=4` の完成本文を「4となり、有理数になる」へ修正
  - answer変更に伴い revision 2 → 3
- `math-propositions-proof`: revision 2 / 23穴
  - 逆・裏・対偶の名称を、定義前の item prompt / aria-label から除去
  - modulo-3 の B3 を「見えている余り1を選ぶ穴」から、`9k²+6k+1 → 3(3k²+2k)+1` の式変形 thinking node へ変更
  - 最終 `y=0` の first hint が答えを押し出さないよう修正
  - answer変更に伴い revision 1 → 2
- cross-unit:
  - primary/accepted answer と staged hint の完全一致漏れ: first 63候補中 0 / second 63候補中 0
  - completed-prose double「である」/二重句点: 0
  - staged hint は「1回目=方針 → 2回目=具体化」に統一（prop-b05 / quant-c03 / proof-a07 / proof-b00 を修正）
  - concept prose / resolved answer は通常本文色を継承
  - equal-diagonals figure は座標上でも AC=BD を完全一致させ、math figure asset test で固定
  - no-touch zone（math practice本体 / function lesson / physics lesson・assets）への差分なし

この deep audit は **user hands-on QA の代替ではない**。3 unit は引き続き `status: review`。

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

5. Wrong-answer visibility
   - Math textbook keeps the last wrong choice visibly marked when the learner reopens the unresolved hole.
   - Correct answer is not revealed.
   - Choice order remains stable across retries.

6. CI contract hardening
   - PR-side Math textbook CI now runs `src/domain/textbook.test.ts`, so revision changes must invalidate stale progress before merge.
   - `public/assets/math/textbook/**` now triggers Math textbook CI.
   - `mathFigureAssets.test.ts` checks SVG presence/structure, counterexample-point geometry, and equal diagonals.
   - Existing stale grouping test was corrected to group only `status: published` units.

## Temporary QA deployment

- review branch `chatgpt/math-textbook-sets-v1` is temporarily allowed to deploy to GitHub Pages for user hands-on QA.
- review units remain `status: review` and stay hidden from the normal setup.
- remove the temporary Pages branch trigger before merge.

## Manual hands-on gate

Direct routes（HashRouter）:
- `#/learning/textbook/math-propositions-reading`
- `#/learning/textbook/math-quantifiers-all-exists`
- `#/learning/textbook/math-propositions-proof`

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
