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

## QA delivery

- GitHub Pages branch deployment was attempted from `chatgpt/math-textbook-sets-v1`.
- Pages build / browser smoke / artifact upload succeeded, but the deploy job was rejected before runner allocation by the repository's `github-pages` environment policy.
- the temporary branch trigger was removed immediately; main-only Pages deployment remains intact.
- the successful Pages build artifact is used instead as a local QA package.
- review units remain `status: review` and stay hidden from the normal setup.

## 2026-10-04 MASTER restoration checkpoint

Validated code head:
- `9ef3111792d5660931b4b2b35ffb89281a92c7ad`

Why restoration was needed:
- direct hands-on inspection showed that the review units were technically correct but felt too much like consecutive short questions
- the existing 2026-10-03 mathematics MASTER already specified a different macro rhythm: concrete example → thinking → concept naming → generalization → immediate use
- therefore this was a restoration to the existing MASTER, not a new pedagogy

Implemented state:
- `math-propositions-reading`: revision 2 / 14 interactions
  - `prop-a06`, `prop-a08`, `prop-b03`, `prop-b06` merged back into textbook prose
  - source examples retained
  - counterexample / necessary-sufficient / negation cycles now expose concept boundaries more clearly
- `math-quantifiers-all-exists`: revision 4 / 11 interactions
  - `quant-a01`, `quant-c01` merged into prose
  - witness/counterexample now comes before the abstract “1 example is enough” rule
- `math-propositions-proof`: revision 3 / 23 interactions
  - concrete source proposition `x²=x⇒x=1` comes before reverse/inverse/contrapositive naming
  - worked contrapositive proof remains intact
  - contradiction method name `背理法` appears only after the worked proof

Cross-unit static audit after restoration:
- total interactions: 48
- primary/accepted answer × first hint leakage: 0
- primary/accepted answer × second hint leakage: 0
- merged-prose double「である」/double punctuation: 0
- restoration implementation diff touched only the 3 math learning units, their unit tests, and math textbook E2E

Automated validation at the validated code head:
- Math textbook mode CI: PASS
- Math practice pilot CI: PASS
- Typecheck / unit tests / build / mobile / desktop / Physics regression / Math practice setup regression: PASS

The remaining gate is user hands-on QA of the restored macro rhythm.

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
- 反例の導入例 → 「反例」の概念化 → a05/a07の即時使用が、一つの学習線として自然に感じるか。
- a05/a07の後に「もう一度真偽を選ばされる」感じが消えているか。
- 条件の否定 → 条件版ド・モルガンが飛躍しないか。

#### math-quantifiers-all-exists
- a02/c02 の具体例を先に経験してから、「1例で成立 / 1反例で崩れる」という規則が出る順序を自然に感じるか。
- 否定の規則を暗記させる前に具体例から納得できるか。
- 長い文章選択肢がスマホで読みやすいか。

#### math-propositions-proof
- 具体命題 x²=x⇒x=1 を組み替えた後で逆・裏・対偶という名称が付くため、名称当てではなく操作として理解できるか。
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


## 2026-10-04 golden Word restoration — math-sets

Authority:
- user-approved `集合_教科書モード_完成版_v1`
- mathematics textbook-mode implementation must follow this mother document rather than inventing a new app-specific structure

Restored learner structure:
- 第1部　集合を表す
- 第2部　集合どうしの関係を見る
- 第3部　集合の外側まで考える
- Part 2 order restored to `共通部分・和集合 → 部分集合`
- 例題: 7
- 確認: 1
- まとめ: 1
- selective dialogue: 8（花子3 / 太郎3 / 先生2）
- formal concept terms render as black bold text
- De Morgan confirmation repeats `U, A, B` before element-wise verification

Shared UI support added only to represent the existing mother:
- `term`: black-bold formal term
- `marker`: compact 例題 / 証明 / 確認 / まとめ label
- `dialogue`: 花子 / 太郎 / 先生
- no semantic concept coloring
- no new learning examples or concepts were invented

Isolation:
- existing holes / figures / progressive reveal retained
- math practice lesson data not modified
- physics lesson data/assets not modified
- review proposition units remain `status: review`

Validated code head before QA-deployment-only commit:
- `442d532bd1ec4eee268be242a7342198f225a721`
- Math textbook mode CI: **success**
- Math practice pilot CI: **success**
- Textbook CI internal gates: Typecheck / unit tests / Build / mobile / desktop / Physics regression / Math practice setup regression = **all success**

Next gate:
- local QA package from the successful GitHub Actions build artifact
- user hands-on comparison against the golden Word mother
- do not merge PR #31 or promote review units before user confirmation



## 2026-10-04 golden textbook role checkpoint

Validated code head:
- `2127c3d4d35793546228ac2fe2a9d38e8a9f97be`

The published `math-sets` golden Word mother was used as the learner-facing display contract for the 3 review units.

Current units:
- `math-propositions-reading`: revision 3 / 14 interactions / review
  - example markers: 6
  - check markers: 4
  - summary markers: 1
  - selective dialogue: 4
  - black-bold terms: 命題 / 反例 / 十分条件 / 必要条件 / 必要十分条件 / 同値 / 否定 / ド・モルガンの法則
- `math-quantifiers-all-exists`: revision 5 / 11 interactions / review
  - example markers: 2
  - check markers: 2
  - summary markers: 1
  - selective dialogue: 3
  - black-bold terms: ある / すべて / 否定 / 反例
- `math-propositions-proof`: revision 4 / 23 interactions / review
  - example markers: 1
  - check markers: 1
  - proof markers: 2
  - summary markers: 1
  - selective dialogue: 3
  - black-bold terms: 逆 / 裏 / 対偶 / 背理法

The review units preserve their source examples and interaction topology from the MASTER restoration. This pass did not invent new mathematics; it restored the golden textbook presentation hierarchy around the existing source-backed content.

Automated validation:
- Math textbook mode CI: PASS
- Math practice pilot CI: PASS
- Typecheck / math unit tests / Build / mobile / desktop / Physics regression / Math practice setup regression: all PASS

Promotion remains blocked on user hands-on QA.
