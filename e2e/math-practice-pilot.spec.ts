import { expect, test } from '@playwright/test'
import { appRoute } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto(appRoute('/learning/setup?mode=practice&subject=math-1a'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.getByRole('radio', { name: /問題を解く/ }).click()
  await page.getByRole('button', { name: '数学 I・A' }).click()
})

test('Math I・A basic theme opens its first problem directly', async ({ page }) => {
  await expect(page.getByTestId('math-exercise-basic')).toContainText('基礎演習')
  await expect(page.getByTestId('math-exercise-common-test')).toContainText('共通テスト演習')

  await page.getByTestId('math-exercise-basic').click()

  await expect(page.getByTestId('math-domain-sets-and-propositions')).toContainText('集合と命題')
  await expect(page.getByTestId('math-domain-sets-and-propositions')).toContainText('3 テーマ')
  await expect(page.getByTestId('math-topic-organize-sets')).toContainText('集合を整理する')
  await expect(page.getByTestId('math-topic-read-propositions')).toContainText('条件から命題を読む')
  await expect(page.getByTestId('math-topic-prove-propositions')).toContainText('命題を証明する')

  await expect(page.getByTestId('start-learning')).toHaveCount(0)
  await expect(page.getByRole('group', { name: '問題番号' })).toHaveCount(0)

  await page.getByTestId('math-topic-organize-sets').click()

  await expect(page.getByRole('heading', { name: '87｜素数と集合' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-1')).toHaveAttribute('aria-current', 'page')
})

test('98 opens the proposition theme directly and separates false propositions from non-propositions', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()

  await expect(page.getByRole('heading', { name: '98｜命題と真偽' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-1')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('次の文は命題か')
  await expect(problem).toContainText('二等辺三角形は正三角形')
  await expect(problem).toContainText('よい近似値')
  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('判定基準')
  await expect(page.getByTestId('blank-math-practice-098-definition')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-098-p1-result')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-098-definition').click()
  await page.getByTestId('option-math-practice-098-definition-truth-or-false').click()

  // (1) reuses only the compact proposition criterion; the preparation prose is compressed.
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(readingFlow).not.toContainText('まず、文が命題かどうかを分ける共通の基準')
  const basisDependency = page.getByTestId('math-practice-dependency-links')
  await expect(basisDependency).toContainText('判定基準')
  await expect(basisDependency).toContainText('真・偽')
  await expect(page.getByTestId('blank-math-practice-098-p1-result')).toContainText('選択')
  await expect(readingFlow.locator('.katex')).toHaveCount(1)
  await expect(readingFlow).not.toContainText('imes36')

  await page.getByTestId('blank-math-practice-098-p1-result').click()
  await page.getByTestId('option-math-practice-098-p1-result-true-proposition').click()

  // (2) is independent of (1); only the common criterion survives.
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('(1) は実際に割り算')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('判定基準')
  await expect(page.getByTestId('math-practice-dependency-links')).not.toContainText('(1) の結果')
  await expect(page.getByTestId('blank-math-practice-098-p2-counterexample')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-098-p2-result')).toHaveCount(0)
  await expect(readingFlow).not.toContainText('頂角40°')

  await page.getByTestId('blank-math-practice-098-p2-counterexample').click()
  await page.getByTestId('option-math-practice-098-p2-counterexample-forty-degree').click()
  const counterexampleAnswer = page.getByTestId('answer-math-practice-098-p2-counterexample')
  await expect(counterexampleAnswer).toContainText('頂角')
  await expect(counterexampleAnswer.getByTestId('math-practice-inline-math')).toHaveCount(1)
  await expect(counterexampleAnswer.getByTestId('math-practice-inline-math')).toContainText('40')
  await expect(page.getByTestId('blank-math-practice-098-p2-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-098-p2-result').click()
  await page.getByTestId('option-math-practice-098-p2-result-false-proposition').click()

  // (3) tests objective decidability rather than treating a vague sentence as merely false.
  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('反例が1つ見つかれば')
  await expect(page.getByTestId('blank-math-practice-098-p3-objectivity')).toContainText('選択')
  await expect(readingFlow).not.toContainText('定まっていない')

  await page.getByTestId('blank-math-practice-098-p3-objectivity').click()
  await page.getByTestId('option-math-practice-098-p3-objectivity-not-fixed').click()
  await page.getByTestId('blank-math-practice-098-p3-result').click()
  await page.getByTestId('option-math-practice-098-p3-result-not-proposition').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('99 judges implication by set inclusion and uses counterexamples only where needed', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-2').click()

  await expect(page.getByRole('heading', { name: '99｜含意の真偽' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-2')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('集合の包含関係')
  await expect(problem.locator('.katex-display')).toHaveCount(4)
  await expect(problem.locator('.katex-error')).toHaveCount(0)
  await expect(problem.locator('.katex-display').first().locator('.katex-html')).toContainText('⇒')
  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('包含関係')
  await expect(page.getByTestId('blank-math-practice-099-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-099-p1-result')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-099-rule').click()
  await page.getByTestId('option-math-practice-099-rule-p-subset-q').click()

  // (1): only the current interval comparison remains, plus the compact common rule.
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(readingFlow).not.toContainText('まず、前件を満たす集合')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('判定規則')
  await expect(page.getByTestId('blank-math-practice-099-p1-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-099-p1-result').click()
  await page.getByTestId('option-math-practice-099-p1-result-subset-true').click()

  // (2): previous subproblem disappears; the learner must construct a counterexample.
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('(1) の前件と後件')
  await expect(page.getByTestId('blank-math-practice-099-p2-counterexample')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-099-p2-result')).toHaveCount(0)
  await expect(readingFlow).not.toContainText('x=-1')

  await page.getByTestId('blank-math-practice-099-p2-counterexample').click()
  await page.getByTestId('option-math-practice-099-p2-counterexample-minus-one').click()
  const counterexample = page.getByTestId('answer-math-practice-099-p2-counterexample')
  await expect(counterexample).toContainText('-1')
  await expect(page.getByTestId('blank-math-practice-099-p2-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-099-p2-result').click()
  await page.getByTestId('option-math-practice-099-p2-result-false').click()

  // (3): no counterexample stage is invented for a true implication.
  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('選んだ値が前件を満たし')
  await expect(page.getByTestId('blank-math-practice-099-p3-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-099-p3-result').click()
  await page.getByTestId('option-math-practice-099-p3-result-positive-bound').click()

  // (4): first convert the absolute-value condition, then use the strict endpoint as a counterexample.
  await expect(currentTarget).toContainText('今の問い｜(4)')
  await expect(page.getByTestId('blank-math-practice-099-p4-q-set')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-099-p4-counterexample-result')).toHaveCount(0)
  await page.getByTestId('blank-math-practice-099-p4-q-set').click()
  await page.getByTestId('option-math-practice-099-p4-q-set-correct').click()

  await expect(page.getByTestId('blank-math-practice-099-p4-counterexample-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-099-p4-counterexample-result').click()
  await page.getByTestId('option-math-practice-099-p4-counterexample-result-minus-two-false').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('100 constructs one valid counterexample per false implication without leaking it early', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-3').click()

  await expect(page.getByRole('heading', { name: '100｜反例' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-3')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('命題が偽であることを示せ')
  await expect(problem.locator('.katex-display')).toHaveCount(3)
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('反例')
  await expect(page.getByTestId('blank-math-practice-100-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-100-p1-counterexample')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-100-rule').click()
  await page.getByTestId('option-math-practice-100-rule-antecedent-true-consequent-false').click()

  // (1): the common counterexample criterion stays compact, while the actual answer remains hidden.
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('反例の条件')
  await expect(readingFlow).not.toContainText('x=-√3')
  await expect(page.getByTestId('blank-math-practice-100-p1-counterexample')).toContainText('選択')

  await page.getByTestId('blank-math-practice-100-p1-counterexample').click()
  await page.getByTestId('option-math-practice-100-p1-counterexample-negative-root').click()

  // (2): (1) disappears; y=1 remains as the given construction scaffold, but x=-2 is not leaked.
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('平方すると符号')
  await expect(readingFlow).toContainText('y=1')
  await expect(readingFlow).not.toContainText('x=-2')
  await expect(page.getByTestId('blank-math-practice-100-p2-counterexample')).toContainText('選択')

  await page.getByTestId('blank-math-practice-100-p2-counterexample').click()
  await page.getByTestId('option-math-practice-100-p2-counterexample-minus-two').click()

  // (3): choose the odd n first; the factorization check is revealed only after the answer.
  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('n=5')
  await expect(readingFlow).not.toContainText('51')
  await expect(page.getByTestId('blank-math-practice-100-p3-counterexample')).toContainText('選択')

  await page.getByTestId('blank-math-practice-100-p3-counterexample').click()
  await page.getByTestId('option-math-practice-100-p3-counterexample-five').click()

  await expect(readingFlow.locator('.katex-display')).toHaveCount(1)
  await expect(readingFlow.locator('.katex-display').locator('.katex-html')).toContainText('51')
  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('101 treats negation as the complete complement and keeps each condition independent', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-4').click()

  await expect(page.getByRole('heading', { name: '101｜条件の否定' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-4')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('次の条件の否定')
  await expect(problem.locator('.katex-display')).toHaveCount(2)
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('条件の否定')
  await expect(page.getByTestId('blank-math-practice-101-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-101-p1-result')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-101-rule').click()
  await page.getByTestId('option-math-practice-101-rule-all-not-p').click()

  // (1): strict inequality negation must include the boundary; the final result is not leaked early.
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('否定の基準')
  await expect(readingFlow).not.toContainText('x≤-5')
  await expect(page.getByTestId('blank-math-practice-101-p1-result')).toContainText('選択')

  await page.getByTestId('blank-math-practice-101-p1-result').click()
  await page.getByTestId('option-math-practice-101-p1-result-le-minus-five').click()

  // (2): the previous inequality stage disappears; ≠ is negated by equality.
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('境界の -5')
  await expect(page.getByTestId('blank-math-practice-101-p2-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-101-p2-result').click()
  await page.getByTestId('option-math-practice-101-p2-result-equals-zero').click()

  // (3): use the real-number universe, not a weaker property such as “not an integer”.
  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('0ではない')
  await expect(page.getByTestId('blank-math-practice-101-p3-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-101-p3-result').click()
  await page.getByTestId('option-math-practice-101-p3-result-irrational').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('102 maps AND/OR to intersection/union and handles open and closed endpoints', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-5').click()

  await expect(page.getByRole('heading', { name: '102｜「かつ」と「または」' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-5')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('実数')
  await expect(problem).toContainText('全体の集合')
  await expect(problem.locator('.katex-display')).toHaveCount(4)
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('集合演算')
  await expect(page.getByTestId('blank-math-practice-102-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-102-p1-result')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-102-rule').click()
  await page.getByTestId('option-math-practice-102-rule-and-intersection-or-union').click()

  // (1): intersection only; the final interval is not leaked before the choice.
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('集合演算の対応')
  await expect(readingFlow).not.toContainText('0<x<2')
  await expect(page.getByTestId('blank-math-practice-102-p1-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-102-p1-result').click()
  await page.getByTestId('option-math-practice-102-p1-result-zero-two-open').click()

  // (2): same base intervals but no result dependency on (1).
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('(1) は2つの区間')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('集合演算の対応')
  await expect(page.getByTestId('blank-math-practice-102-p2-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-102-p2-result').click()
  await page.getByTestId('option-math-practice-102-p2-result-minus-two-three').click()

  // (3): intersection chooses the stricter endpoint conditions.
  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('少なくとも一方に入る範囲')
  await expect(page.getByTestId('blank-math-practice-102-p3-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-102-p3-result').click()
  await page.getByTestId('option-math-practice-102-p3-result-minus-one-two-open').click()

  // (4): union keeps an endpoint if either interval contains it.
  await expect(currentTarget).toContainText('今の問い｜(4)')
  await expect(readingFlow).not.toContainText('共通部分を取り')
  await expect(page.getByTestId('blank-math-practice-102-p4-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-102-p4-result').click()
  await page.getByTestId('option-math-practice-102-p4-result-minus-one-four-closed').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('103 negates compound conditions from their meaning and applies De Morgan without answer carryover', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-6').click()

  await expect(page.getByRole('heading', { name: '103｜複合条件の否定' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-6')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('次の条件の否定')
  await expect(problem.locator('.katex-display')).toHaveCount(3)
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('否定規則')
  await expect(page.getByTestId('blank-math-practice-103-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-103-p1-result')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-103-rule').click()
  await page.getByTestId('option-math-practice-103-rule-de-morgan').click()

  // (1): AND negation becomes OR of the two atomic negations.
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('複合条件の否定')
  await expect(readingFlow).not.toContainText('x≠2 または y=-1')
  await expect(page.getByTestId('blank-math-practice-103-p1-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-103-p1-result').click()
  await page.getByTestId('option-math-practice-103-p1-result-correct').click()

  // (2): OR negation requires both atomic conditions to fail.
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('(1) は「かつ」')
  await expect(page.getByTestId('blank-math-practice-103-p2-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-103-p2-result').click()
  await page.getByTestId('option-math-practice-103-p2-result-correct').click()

  // (3): continuous inequality is first exposed as an AND condition, not answered by rote.
  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow.locator('.katex-display')).toHaveCount(1)
  await expect(readingFlow).not.toContainText('x≤5 または x>10')
  await expect(page.getByTestId('blank-math-practice-103-p3-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-103-p3-result').click()
  await page.getByTestId('option-math-practice-103-p3-result-correct').click()

  // (4): both number properties must fail.
  await expect(currentTarget).toContainText('今の問い｜(4)')
  await expect(readingFlow).not.toContainText('x>5')
  await expect(page.getByTestId('blank-math-practice-103-p4-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-103-p4-result').click()
  await page.getByTestId('option-math-practice-103-p4-result-correct').click()

  // (5): “at least one irrational” fails only when both real numbers are rational.
  await expect(currentTarget).toContainText('今の問い｜(5)')
  await expect(readingFlow).not.toContainText('偶数')
  await expect(page.getByTestId('blank-math-practice-103-p5-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-103-p5-result').click()
  await page.getByTestId('option-math-practice-103-p5-result-both-rational').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('104 fixes necessary/sufficient direction first, then classifies six independent cases', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-7').click()

  await expect(page.getByRole('heading', { name: '104｜必要条件・十分条件' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-7')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('必要条件')
  await expect(problem).toContainText('十分条件')
  await expect(problem.locator('.katex-display')).toHaveCount(5)
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('含意の向き')
  await expect(page.getByTestId('blank-math-practice-104-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-104-p1-classification')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-104-rule').click()
  await page.getByTestId('option-math-practice-104-rule-direction-map').click()

  // (1): the learner receives both direction results, then maps them to the classification.
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('双方向判定表')
  await expect(readingFlow.locator('.katex-display')).toHaveCount(2)
  await expect(readingFlow).not.toContainText('十分条件だが必要条件ではない')
  await expect(page.getByTestId('blank-math-practice-104-p1-classification')).toContainText('選択')
  await page.getByTestId('blank-math-practice-104-p1-classification').click()
  await page.getByTestId('option-math-practice-104-p1-classification-sufficient-only').click()

  // (2): previous factorization disappears; the current case uses q⇒p plus a p⇒q counterexample.
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('(x-2)(x-3)')
  await expect(readingFlow).toContainText('x=3')
  await expect(page.getByTestId('blank-math-practice-104-p2-classification')).toContainText('選択')
  await page.getByTestId('blank-math-practice-104-p2-classification').click()
  await page.getByTestId('option-math-practice-104-p2-classification-necessary-only').click()

  // (3): both directions are killed by separate counterexamples.
  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('q の解は x=1,2')
  await expect(readingFlow).toContainText('x=2,y=1/2')
  await expect(readingFlow).toContainText('x=1,y=0')
  await page.getByTestId('blank-math-practice-104-p3-classification').click()
  await page.getByTestId('option-math-practice-104-p3-classification-neither').click()

  // (4): mutual implication gives equivalence.
  await expect(currentTarget).toContainText('今の問い｜(4)')
  await expect(readingFlow).not.toContainText('x=2,y=1/2')
  await page.getByTestId('blank-math-practice-104-p4-classification').click()
  await page.getByTestId('option-math-practice-104-p4-classification-iff').click()

  // (5): solve the reverse system, not just the forward substitution.
  await expect(currentTarget).toContainText('今の問い｜(5)')
  await expect(readingFlow.locator('.katex-display')).toHaveCount(2)
  await expect(readingFlow.locator('.katex-display').last().locator('.katex-html')).toContainText('x=2')
  await page.getByTestId('blank-math-practice-104-p5-classification').click()
  await page.getByTestId('option-math-practice-104-p5-classification-iff').click()

  // (6): square ⇒ rhombus, but a rhombus need not be a square.
  await expect(currentTarget).toContainText('今の問い｜(6)')
  await expect(readingFlow).not.toContainText('2y-2')
  await expect(readingFlow).toContainText('正方形なら4辺が等しい')
  await page.getByTestId('blank-math-practice-104-p6-classification').click()
  await page.getByTestId('option-math-practice-104-p6-classification-necessary-only').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('105 proves true implications by all cases and false ones by one counterexample', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-8').click()

  await expect(page.getByRole('heading', { name: '105｜命題の真偽' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-8')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('次の命題の真偽')
  await expect(problem.locator('.katex-display')).toHaveCount(2)
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('真と偽')
  await expect(page.getByTestId('blank-math-practice-105-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-105-p1-result')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-105-rule').click()
  await page.getByTestId('option-math-practice-105-rule-all-vs-counterexample').click()

  // (1): do not leak the counterexample before the learner selects it.
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('真偽判定の基準')
  await expect(readingFlow).not.toContainText('a=0,b=1')
  await expect(page.getByTestId('blank-math-practice-105-p1-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-105-p1-result').click()
  await page.getByTestId('option-math-practice-105-p1-result-counterexample-false').click()

  // (2): true requires checking both roots of a^2=4.
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('少なくとも一方が0')
  await expect(readingFlow.locator('.katex-display')).toHaveCount(3)
  await expect(readingFlow.locator('.katex-display').first().locator('.katex-html')).toContainText('a=2')
  await expect(readingFlow.locator('.katex-display').first().locator('.katex-html')).toContainText('a=−2')
  await page.getByTestId('blank-math-practice-105-p2-result').click()
  await page.getByTestId('option-math-practice-105-p2-result-both-cases-true').click()

  // (3): product rational does not force each factor rational.
  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('√2')
  await page.getByTestId('blank-math-practice-105-p3-result').click()
  await page.getByTestId('option-math-practice-105-p3-result-sqrt-two-false').click()

  // (4): the counterexample must make both sum and product rational simultaneously.
  await expect(currentTarget).toContainText('今の問い｜(4)')
  await expect(readingFlow).not.toContainText('a=√2')
  await expect(readingFlow).not.toContainText('b=-√2')
  await page.getByTestId('blank-math-practice-105-p4-result').click()
  await page.getByTestId('option-math-practice-105-p4-result-conjugate-false').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('106 translates number conditions into intersection and complement without carrying answers forward', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-9').click()

  await expect(page.getByRole('heading', { name: '106｜集合で条件を表す' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-9')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('P')
  await expect(problem).toContainText('Q')
  await expect(problem).toContainText('6の倍数')
  await expect(problem).toContainText('3の倍数でない奇数')

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('集合演算')
  await expect(page.getByTestId('blank-math-practice-106-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-106-p1-result')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-106-rule').click()
  await page.getByTestId('option-math-practice-106-rule-and-complement').click()

  // (1): 6の倍数を「2の倍数かつ3の倍数」と読むが、答えそのものは先に見せない。
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('集合表現の規則')
  await expect(readingFlow).not.toContainText('P∩Q')
  await page.getByTestId('blank-math-practice-106-p1-result').click()
  await page.getByTestId('option-math-practice-106-p1-result-p-inter-q').click()

  // (2): previous result disappears; odd numbers are the complement of P.
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('6の倍数')
  await expect(readingFlow).not.toContainText('P̄')
  await page.getByTestId('blank-math-practice-106-p2-result').click()
  await page.getByTestId('option-math-practice-106-p2-result-p-complement').click()

  // (3): combine Q with the complement of P, without reusing (2) as a visible result link.
  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('自然数の中で2の倍数ではない')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('集合表現の規則')
  await expect(readingFlow).not.toContainText('Q∩P̄')
  await page.getByTestId('blank-math-practice-106-p3-result').click()
  await page.getByTestId('option-math-practice-106-p3-result-q-inter-pbar').click()

  // (4): negate both divisibility conditions first, then intersect them.
  await expect(currentTarget).toContainText('今の問い｜(4)')
  await expect(readingFlow).not.toContainText('(3)')
  await expect(readingFlow).not.toContainText('Q̄∩P̄')
  await page.getByTestId('blank-math-practice-106-p4-result').click()
  await page.getByTestId('option-math-practice-106-p4-result-qbar-inter-pbar').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('107 applies the necessary/sufficient direction rule to algebra, signs and geometry', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-10').click()

  await expect(page.getByRole('heading', { name: '107｜必要・十分条件の判定' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-10')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('必要条件')
  await expect(problem).toContainText('十分条件')
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-107-rule').click()
  await page.getByTestId('option-math-practice-107-rule-direction-map').click()

  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('双方向判定表')
  await page.getByTestId('blank-math-practice-107-p1-classification').click()
  await page.getByTestId('option-math-practice-107-p1-classification-necessary-only').click()

  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('x=0,y=0,z=1')
  await page.getByTestId('blank-math-practice-107-p2-classification').click()
  await page.getByTestId('option-math-practice-107-p2-classification-sufficient-only').click()

  await expect(currentTarget).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('負×正')
  await page.getByTestId('blank-math-practice-107-p3-classification').click()
  await page.getByTestId('option-math-practice-107-p3-classification-iff').click()

  await expect(currentTarget).toContainText('今の問い｜(4)')
  await expect(readingFlow).toContainText('A=60')
  await expect(readingFlow).toContainText('B=100')
  await page.getByTestId('blank-math-practice-107-p4-classification').click()
  await page.getByTestId('option-math-practice-107-p4-classification-necessary-only').click()

  await expect(currentTarget).toContainText('今の問い｜(5)')
  await expect(readingFlow).toContainText('正三角形')
  await expect(readingFlow).toContainText('直角が A')
  await page.getByTestId('blank-math-practice-107-p5-classification').click()
  await page.getByTestId('option-math-practice-107-p5-classification-neither').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('109 negates quantifiers and verifies the truth of each original and negated statement', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-read-propositions').click()
  await page.getByTestId('math-topic-question-11').click()

  await expect(page.getByRole('heading', { name: '109｜「すべて」と「ある」の否定' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8','9','10','11'])
  await expect(page.getByTestId('math-topic-question-11')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('次の命題の否定')
  await expect(problem.locator('.katex-display')).toHaveCount(2)
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('「すべて」「ある」')
  await expect(page.getByTestId('blank-math-practice-109-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-109-p1-negation')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-109-rule').click()
  await page.getByTestId('option-math-practice-109-rule-quantifier-negation').click()

  // (1): build the negation first; the witness x=1 stays hidden until the truth check.
  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('量化命題の否定規則')
  await expect(readingFlow).not.toContainText('x=1')
  await expect(page.getByTestId('blank-math-practice-109-p1-negation')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-109-p1-truth')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-109-p1-negation').click()
  await page.getByTestId('option-math-practice-109-p1-negation-exists-equals').click()
  await expect(page.getByTestId('blank-math-practice-109-p1-truth')).toContainText('選択')
  await page.getByTestId('blank-math-practice-109-p1-truth').click()
  await page.getByTestId('option-math-practice-109-p1-truth-x-one').click()

  // (2): (1) disappears; first negate the existential, then solve before deciding truth.
  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('今作った否定')
  await expect(page.getByTestId('blank-math-practice-109-p2-negation')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-109-p2-solve')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-109-p2-negation').click()
  await page.getByTestId('option-math-practice-109-p2-negation-forall-not-equals').click()
  await expect(page.getByTestId('blank-math-practice-109-p2-solve')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-109-p2-truth')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-109-p2-solve').click()
  await page.getByTestId('option-math-practice-109-p2-solve-factor-zero-five').click()
  await expect(page.getByTestId('blank-math-practice-109-p2-truth')).toContainText('選択')
  await page.getByTestId('blank-math-practice-109-p2-truth').click()
  await page.getByTestId('option-math-practice-109-p2-truth-five-exists').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('108 proves equivalence in two directions and only combines them at the final stage', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-prove-propositions').click()

  await expect(page.getByRole('heading', { name: '108｜同値の証明' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8'])
  await expect(page.getByTestId('math-topic-question-1')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('同値であることを証明')
  await expect(problem.locator('.katex-display')).toHaveCount(2)
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('2方向')
  await expect(page.getByTestId('blank-math-practice-108-rule')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-108-forward')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-108-rule').click()
  await page.getByTestId('option-math-practice-108-rule-both-directions').click()

  // Forward proof: derive both q conditions from p; reverse work stays hidden.
  await expect(currentTarget).toContainText('一方向目')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('同値の証明方針')
  await expect(readingFlow).not.toContainText('次に逆方向')
  await expect(page.getByTestId('blank-math-practice-108-forward')).toContainText('選択')
  await page.getByTestId('blank-math-practice-108-forward').click()
  await page.getByTestId('option-math-practice-108-forward-sum-and-product').click()

  // Reverse proof is independent from the completed forward derivation.
  await expect(currentTarget).toContainText('二方向目')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('同値の証明方針')
  await expect(page.getByTestId('math-practice-dependency-links')).not.toContainText('一方向目')
  await expect(readingFlow).not.toContainText('一方向目では p')
  await expect(page.getByTestId('blank-math-practice-108-reverse-sign')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-108-reverse-eliminate')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-108-reverse-sign').click()
  await page.getByTestId('option-math-practice-108-reverse-sign-same-sign').click()

  await expect(page.getByTestId('blank-math-practice-108-reverse-eliminate')).toContainText('選択')
  await page.getByTestId('blank-math-practice-108-reverse-eliminate').click()
  await page.getByTestId('option-math-practice-108-reverse-eliminate-positive-remains').click()

  // Only at the final stage are the two completed direction results imported together.
  await expect(currentTarget).toContainText('結論')
  const deps = page.getByTestId('math-practice-dependency-links')
  await expect(deps).toContainText('一方向目')
  await expect(deps).toContainText('二方向目')
  await expect(readingFlow).not.toContainText('積が正であることだけから')
  await expect(page.getByTestId('blank-math-practice-108-equivalence')).toContainText('選択')

  await page.getByTestId('blank-math-practice-108-equivalence').click()
  await page.getByTestId('option-math-practice-108-equivalence-equivalent').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('110 builds converse, contrapositive and inverse separately, then consolidates each truth table', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-prove-propositions').click()
  await page.getByTestId('math-topic-question-2').click()

  await expect(page.getByRole('heading', { name: '110｜逆・対偶・裏' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8'])
  await expect(page.getByTestId('math-topic-question-2')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('逆')
  await expect(problem).toContainText('対偶')
  await expect(problem).toContainText('裏')
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(page.getByTestId('blank-math-practice-110-rule')).toContainText('選択')
  await page.getByTestId('blank-math-practice-110-rule').click()
  await page.getByTestId('option-math-practice-110-rule-correct').click()

  // (1) — each related proposition is checked independently.
  await expect(currentTarget).toContainText('(1) 元命題')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('逆・対偶・裏の形')
  await page.getByTestId('blank-math-practice-110-p1-original').click()
  await page.getByTestId('option-math-practice-110-p1-original-true').click()

  await expect(currentTarget).toContainText('(1) 逆')
  await expect(readingFlow).not.toContainText('n=9k と書ける')
  await page.getByTestId('blank-math-practice-110-p1-converse').click()
  await page.getByTestId('option-math-practice-110-p1-converse-false-three').click()

  await expect(currentTarget).toContainText('(1) 対偶')
  await page.getByTestId('blank-math-practice-110-p1-contrapositive').click()
  await page.getByTestId('option-math-practice-110-p1-contrapositive-true').click()

  await expect(currentTarget).toContainText('(1) 裏')
  await page.getByTestId('blank-math-practice-110-p1-inverse').click()
  await page.getByTestId('option-math-practice-110-p1-inverse-false-three').click()

  await expect(currentTarget).toContainText('(1) まとめ')
  const p1Deps = page.getByTestId('math-practice-dependency-links')
  await expect(p1Deps).toContainText('元命題')
  await expect(p1Deps).toContainText('逆')
  await expect(p1Deps).toContainText('対偶')
  await expect(p1Deps).toContainText('裏')
  await page.getByTestId('blank-math-practice-110-p1-summary').click()
  await page.getByTestId('option-math-practice-110-p1-summary-tftf').click()

  // (2) — factorization reveals x=1 as the original/contrapositive counterexample.
  await expect(currentTarget).toContainText('(2) 元命題')
  await expect(readingFlow).not.toContainText('n は9の倍数')
  await expect(readingFlow.locator('.katex-display')).toHaveCount(1)
  await page.getByTestId('blank-math-practice-110-p2-original').click()
  await page.getByTestId('option-math-practice-110-p2-original-false-one').click()

  await expect(currentTarget).toContainText('(2) 逆')
  await page.getByTestId('blank-math-practice-110-p2-converse').click()
  await page.getByTestId('option-math-practice-110-p2-converse-true').click()

  await expect(currentTarget).toContainText('(2) 対偶')
  await page.getByTestId('blank-math-practice-110-p2-contrapositive').click()
  await page.getByTestId('option-math-practice-110-p2-contrapositive-false-one').click()

  await expect(currentTarget).toContainText('(2) 裏')
  await page.getByTestId('blank-math-practice-110-p2-inverse').click()
  await page.getByTestId('option-math-practice-110-p2-inverse-true').click()

  await expect(currentTarget).toContainText('(2) まとめ')
  await page.getByTestId('blank-math-practice-110-p2-summary').click()
  await page.getByTestId('option-math-practice-110-p2-summary-ftft').click()

  // (3) — the negation of OR must become AND in the contrapositive.
  await expect(currentTarget).toContainText('(3) 元命題')
  await expect(readingFlow).not.toContainText('x²-3x+2')
  await page.getByTestId('blank-math-practice-110-p3-original').click()
  await page.getByTestId('option-math-practice-110-p3-original-true-zero-product').click()

  await expect(currentTarget).toContainText('(3) 逆')
  await page.getByTestId('blank-math-practice-110-p3-converse').click()
  await page.getByTestId('option-math-practice-110-p3-converse-true').click()

  await expect(currentTarget).toContainText('(3) 対偶')
  await page.getByTestId('blank-math-practice-110-p3-contrapositive').click()
  await page.getByTestId('option-math-practice-110-p3-contrapositive-true').click()

  await expect(currentTarget).toContainText('(3) 裏')
  await page.getByTestId('blank-math-practice-110-p3-inverse').click()
  await page.getByTestId('option-math-practice-110-p3-inverse-true').click()

  await expect(currentTarget).toContainText('(3) まとめ')
  await page.getByTestId('blank-math-practice-110-p3-summary').click()
  await page.getByTestId('option-math-practice-110-p3-summary-tttt').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('111 uses the source-given contrapositive strategy and proves four cases one stage at a time', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-prove-propositions').click()
  await page.getByTestId('math-topic-question-3').click()

  await expect(page.getByRole('heading', { name: '111｜対偶による証明' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8'])
  await expect(page.getByTestId('math-topic-question-3')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('対偶を考えて')
  await expect(problem.locator('.katex-error')).toHaveCount(0)
  await expect(currentTarget).toContainText('まず確認')
  await expect(page.getByTestId('blank-math-practice-111-rule')).toContainText('選択')

  await page.getByTestId('blank-math-practice-111-rule').click()
  await page.getByTestId('option-math-practice-111-rule-correct').click()

  // (1): form the contrapositive, then prove it directly.
  await expect(currentTarget).toContainText('(1) 対偶')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('対偶の形')
  await page.getByTestId('blank-math-practice-111-p1-contrapositive').click()
  await page.getByTestId('option-math-practice-111-p1-contrapositive-correct').click()

  await expect(currentTarget).toContainText('(1) 証明')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('(1) の対偶')
  await page.getByTestId('blank-math-practice-111-p1-proof').click()
  await page.getByTestId('option-math-practice-111-p1-proof-correct').click()

  // (2): negate OR semantically before using the inequality.
  await expect(currentTarget).toContainText('(2) 対偶の前件')
  await expect(readingFlow).not.toContainText('(1) 後件')
  await page.getByTestId('blank-math-practice-111-p2-negation').click()
  await page.getByTestId('option-math-practice-111-p2-negation-and-le').click()

  await expect(currentTarget).toContainText('(2) 証明')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('後件の否定')
  await page.getByTestId('blank-math-practice-111-p2-proof').click()
  await page.getByTestId('option-math-practice-111-p2-proof-correct').click()

  // (3): translate divisibility into n=3k and return to a 3×integer form.
  await expect(currentTarget).toContainText('(3) 対偶')
  await expect(readingFlow).not.toContainText('x+y')
  await page.getByTestId('blank-math-practice-111-p3-contrapositive').click()
  await page.getByTestId('option-math-practice-111-p3-contrapositive-correct').click()

  await expect(currentTarget).toContainText('(3) 証明')
  await page.getByTestId('blank-math-practice-111-p3-proof').click()
  await page.getByTestId('option-math-practice-111-p3-proof-correct').click()

  // (4): the odd-number representation is a separate reasoning node before expansion.
  await expect(currentTarget).toContainText('(4) 対偶')
  await page.getByTestId('blank-math-practice-111-p4-contrapositive').click()
  await page.getByTestId('option-math-practice-111-p4-contrapositive-correct').click()

  await expect(currentTarget).toContainText('(4) 奇数の式')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('(4) の対偶')
  await page.getByTestId('blank-math-practice-111-p4-form').click()
  await page.getByTestId('option-math-practice-111-p4-form-odd-form').click()

  await expect(currentTarget).toContainText('(4) 証明')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('奇数の表現')
  await page.getByTestId('blank-math-practice-111-p4-proof').click()
  await page.getByTestId('option-math-practice-111-p4-proof-correct').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('112 proves irrationality by contradiction and keeps rationalization as a meaningful step', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-prove-propositions').click()
  await page.getByTestId('math-topic-question-4').click()

  await expect(page.getByRole('heading', { name: '112｜無理数の証明' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8'])
  await expect(page.getByTestId('math-topic-question-4')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('が無理数であることを用いて')
  await expect(problem.locator('.katex-display')).toHaveCount(2)
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まず確認')
  await expect(currentTarget).toContainText('背理法')
  await expect(page.getByTestId('blank-math-practice-112-rule')).toContainText('選択')

  await page.getByTestId('blank-math-practice-112-rule').click()
  await page.getByTestId('option-math-practice-112-rule-rational-assume').click()

  // (1): assume rational, isolate √3, then close the contradiction.
  await expect(currentTarget).toContainText('(1) 仮定')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('背理法の方針')
  await page.getByTestId('blank-math-practice-112-p1-assumption').click()
  await page.getByTestId('option-math-practice-112-p1-assumption-rational').click()

  await expect(currentTarget).toContainText('(1) √3を取り出す')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('(1) の反対仮定')
  await expect(readingFlow).not.toContainText('r-1')
  await page.getByTestId('blank-math-practice-112-p1-isolate').click()
  await page.getByTestId('option-math-practice-112-p1-isolate-r-minus-one').click()

  await expect(currentTarget).toContainText('(1) 矛盾')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('(1) で得た√3の式')
  await page.getByTestId('blank-math-practice-112-p1-contradiction').click()
  await page.getByTestId('option-math-practice-112-p1-contradiction-contradiction').click()

  // (2): (1) disappears; rationalization is the first independent reasoning node.
  await expect(currentTarget).toContainText('(2) 有理化')
  await expect(readingFlow).not.toContainText('1+√3=r')
  await page.getByTestId('blank-math-practice-112-p2-rationalize').click()
  await page.getByTestId('option-math-practice-112-p2-rationalize-conjugate').click()

  await expect(currentTarget).toContainText('(2) 仮定')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('有理化した形')
  await page.getByTestId('blank-math-practice-112-p2-assumption').click()
  await page.getByTestId('option-math-practice-112-p2-assumption-two-minus-root').click()

  await expect(currentTarget).toContainText('(2) √3を取り出す')
  await page.getByTestId('blank-math-practice-112-p2-isolate').click()
  await page.getByTestId('option-math-practice-112-p2-isolate-two-minus-r').click()

  await expect(currentTarget).toContainText('(2) 矛盾')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('(2) で得た√3の式')
  await page.getByTestId('blank-math-practice-112-p2-contradiction').click()
  await page.getByTestId('option-math-practice-112-p2-contradiction-contradiction').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('113 returns from a rational square-root assumption to an irrational-x contradiction', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-prove-propositions').click()
  await page.getByTestId('math-topic-question-5').click()

  await expect(page.getByRole('heading', { name: '113｜平方根と無理数' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8'])
  await expect(page.getByTestId('math-topic-question-5')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('正の無理数であるとき')
  await expect(problem).toContainText('無理数であることを証明せよ')
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  await expect(currentTarget).toContainText('まずの目標')
  await expect(page.getByTestId('blank-math-practice-113-assumption')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-113-operation')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-113-assumption').click()
  await page.getByTestId('option-math-practice-113-assumption-sqrt-rational').click()

  await expect(currentTarget).toContainText('次の目標')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('反対仮定')
  await expect(readingFlow).not.toContainText('x=r²')
  await page.getByTestId('blank-math-practice-113-operation').click()
  await page.getByTestId('option-math-practice-113-operation-square').click()

  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('xへ戻る操作')
  await expect(page.getByTestId('blank-math-practice-113-square-result')).toContainText('選択')
  await page.getByTestId('blank-math-practice-113-square-result').click()
  await page.getByTestId('option-math-practice-113-square-result-x-rational').click()

  await expect(currentTarget).toContainText('最後の目標')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('2乗して得た式')
  await page.getByTestId('blank-math-practice-113-contradiction').click()
  await page.getByTestId('option-math-practice-113-contradiction-contradiction').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('114 proves divisibility claims by exhaustive nonzero residue classes', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-prove-propositions').click()
  await page.getByTestId('math-topic-question-6').click()

  await expect(page.getByRole('heading', { name: '114｜倍数の証明' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8'])
  await expect(page.getByTestId('math-topic-question-6')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('が5の倍数ならば')
  await expect(problem).toContainText('少なくとも一方')
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  // (1): choose the contrapositive, enumerate all nonzero residues mod 5, then square all cases.
  await expect(currentTarget).toContainText('(1) 方針')
  await page.getByTestId('blank-math-practice-114-p1-plan').click()
  await page.getByTestId('option-math-practice-114-p1-plan-contrapositive').click()

  await expect(currentTarget).toContainText('(1) 余り')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('(1) の対偶')
  await expect(readingFlow).not.toContainText('1、2、3、4 のいずれか')
  await page.getByTestId('blank-math-practice-114-p1-residues').click()
  await page.getByTestId('option-math-practice-114-p1-residues-one-two-three-four').click()

  await expect(currentTarget).toContainText('(1) 全ケース')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('mod 5 の候補')
  await page.getByTestId('blank-math-practice-114-p1-squares').click()
  await page.getByTestId('option-math-practice-114-p1-squares-none-zero').click()

  // (2): the first proof collapses; negate "at least one" into "neither", then test all mod-3 products.
  await expect(currentTarget).toContainText('(2) 方針')
  await expect(readingFlow).not.toContainText('5の倍数でない')
  await page.getByTestId('blank-math-practice-114-p2-plan').click()
  await page.getByTestId('option-math-practice-114-p2-plan-both-not').click()

  await expect(currentTarget).toContainText('(2) 余り')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('(2) の対偶')
  await page.getByTestId('blank-math-practice-114-p2-residues').click()
  await page.getByTestId('option-math-practice-114-p2-residues-one-or-two').click()

  await expect(currentTarget).toContainText('(2) 全ケース')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('mod 3 の候補')
  await page.getByTestId('blank-math-practice-114-p2-products').click()
  await page.getByTestId('option-math-practice-114-p2-products-none-zero').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('115 creates sqrt(6) by squaring, isolates it, and closes the irrationality contradiction', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-prove-propositions').click()
  await page.getByTestId('math-topic-question-7').click()

  await expect(page.getByRole('heading', { name: '115｜背理法' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8'])
  await expect(page.getByTestId('math-topic-question-7')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('が無理数であることを用いて')
  await expect(problem).toContainText('は無理数であることを証明せよ')
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  // First set the contradiction assumption. Future algebra stays hidden.
  await expect(currentTarget).toContainText('まずの目標')
  await expect(page.getByTestId('blank-math-practice-115-assumption')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-115-operation')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-115-assumption').click()
  await page.getByTestId('option-math-practice-115-assumption-rational-r').click()

  // Squaring is selected because it creates the product sqrt(3)sqrt(2)=sqrt(6).
  await expect(currentTarget).toContainText('次の目標')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('反対仮定')
  await expect(readingFlow).not.toContainText('5-2√6')
  await page.getByTestId('blank-math-practice-115-operation').click()
  await page.getByTestId('option-math-practice-115-operation-square').click()

  // Expand before isolating sqrt(6).
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('√6を作る操作')
  await page.getByTestId('blank-math-practice-115-expand').click()
  await page.getByTestId('option-math-practice-115-expand-five-minus-two-root6').click()

  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('2乗後の式')
  await expect(readingFlow).not.toContainText('(5-r²)/2')
  await page.getByTestId('blank-math-practice-115-isolate').click()
  await page.getByTestId('option-math-practice-115-isolate-five-minus-r2-over-two').click()

  // Only now use rational-number closure to contradict the known irrationality of sqrt(6).
  await expect(currentTarget).toContainText('最後の目標')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('√6の式')
  await page.getByTestId('blank-math-practice-115-contradiction').click()
  await page.getByTestId('option-math-practice-115-contradiction-contradiction').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('116 proves q=0 by irrationality contradiction, then back-substitutes to get p=0', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-prove-propositions').click()
  await page.getByTestId('math-topic-question-8').click()

  await expect(page.getByRole('heading', { name: '116｜有理数と無理数' })).toBeVisible()
  const nav = page.getByTestId('math-topic-question-nav')
  await expect(nav.getByRole('button')).toHaveText(['1','2','3','4','5','6','7','8'])
  await expect(page.getByTestId('math-topic-question-8')).toHaveAttribute('aria-current', 'page')

  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')

  await expect(problem).toContainText('が有理数、')
  await expect(problem).toContainText('が無理数で、')
  await expect(problem).toContainText('であることを証明せよ')
  await expect(problem.locator('.katex-error')).toHaveCount(0)

  // Identify q because it is the coefficient attached directly to the irrational number X.
  await expect(currentTarget).toContainText('まずの目標')
  await expect(page.getByTestId('blank-math-practice-116-target')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-116-assumption')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-116-target').click()
  await page.getByTestId('option-math-practice-116-target-q').click()

  // The nonzero assumption is what makes division by q legal.
  await expect(currentTarget).toContainText('次の目標')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('最初に調べる係数')
  await expect(readingFlow).not.toContainText('X=-p/q')
  await page.getByTestId('blank-math-practice-116-assumption').click()
  await page.getByTestId('option-math-practice-116-assumption-q-nonzero').click()

  // Isolate X only after q != 0 has been established locally.
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('反対仮定')
  await page.getByTestId('blank-math-practice-116-isolate').click()
  await page.getByTestId('option-math-practice-116-isolate-minus-p-over-q').click()

  // Rational quotient contradicts irrational X, forcing q=0.
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('Xの式')
  await page.getByTestId('blank-math-practice-116-q-zero').click()
  await page.getByTestId('option-math-practice-116-q-zero-contradiction-q-zero').click()

  // Return to the original equation only after q=0 is known.
  await expect(currentTarget).toContainText('最後の目標')
  await expect(page.getByTestId('math-practice-dependency-links')).toContainText('まず得た結論')
  await page.getByTestId('blank-math-practice-116-p-zero').click()
  await page.getByTestId('option-math-practice-116-p-zero-p-zero').click()

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('87 uses the Physics-style inline choice flow and reveals one reasoning node at a time', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()

  await expect(page.getByRole('heading', { name: '87｜素数と集合' })).toBeVisible()
  const problem = page.getByTestId('standard-problem')
  const guide = page.getByTestId('standard-guide')
  await expect(problem.getByRole('heading', { name: '問題' })).toBeVisible()
  await expect(problem).toContainText('次の□に')
  await expect(guide.getByRole('heading', { name: '考えながら解く' })).toBeVisible()
  await expect(page.getByTestId('math-practice-reading-flow')).toBeVisible()
  const initialTarget = page.getByTestId('math-practice-current-target')
  await expect(initialTarget).toContainText('集合')
  await expect(initialTarget).toContainText('に入る条件を整理する')
  await expect(initialTarget.locator('.katex')).toHaveCount(1)

  const firstBlank = 'math-practice-087-condition-sufficiency'
  const secondBlank = 'math-practice-087-prime-condition'
  await expect(page.getByTestId(`blank-${firstBlank}`)).toContainText('選択')
  await expect(page.getByTestId(`blank-${secondBlank}`)).toHaveCount(0)

  await page.getByTestId(`blank-${firstBlank}`).click()
  await expect(page.getByTestId(`inline-choice-panel-${firstBlank}`)).toBeVisible()
  await page.getByTestId('option-math-practice-087-condition-sufficiency-enough').click()

  await expect(page.getByTestId(`blank-${firstBlank}`)).toContainText('もう一度')
  await expect(page.getByTestId(`blank-${secondBlank}`)).toHaveCount(0)

  await page.getByTestId(`blank-${firstBlank}`).click()
  await expect(page.getByTestId(`math-practice-hint-${firstBlank}`)).toContainText('素数')
  await page.getByTestId('option-math-practice-087-condition-sufficiency-not-enough').click()

  await expect(page.getByTestId(`answer-${firstBlank}`)).toContainText('十分ではない')
  await expect(page.getByTestId(`blank-${secondBlank}`)).toContainText('選択')

  await page.getByTestId(`blank-${secondBlank}`).click()
  await page.getByTestId('option-math-practice-087-prime-condition-prime').click()
  const target = page.getByTestId('math-practice-current-target')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  await expect(target).toContainText('今の問い')
  await expect(target.locator('.katex')).toHaveCount(1)
  await expect(target.locator('.katex')).toContainText('2')

  // The completed common-rule explanation is compressed away once the first membership decision starts.
  await expect(readingFlow).not.toContainText('「30以下」だけで十分か')
  await expect(readingFlow).toContainText('まず 2 を調べる')
  await expect(page.getByTestId('math-practice-dependency-links')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-087-two-divisors').click()
  await page.getByTestId('option-math-practice-087-two-divisors-one-two').click()
  await page.getByTestId('blank-math-practice-087-two-membership').click()
  await page.getByTestId('option-math-practice-087-two-membership-in').click()

  // 2 is finished; only the 15-stage derivation remains. No false dependency link is created.
  await expect(target.locator('.katex')).toContainText('15')
  await expect(readingFlow).not.toContainText('まず 2 を調べる')
  await expect(readingFlow).toContainText('次に 15')
  await expect(page.getByTestId('math-practice-dependency-links')).toHaveCount(0)
})

test('problem card 8 opens 94 with the same Physics-style progressive reading flow', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByTestId('math-topic-question-8').click()

  await expect(page.getByRole('heading', { name: '94｜補集合' })).toBeVisible()
  await expect(page.getByTestId('math-topic-question-8')).toHaveAttribute('aria-current', 'page')
  await expect(page.getByTestId('standard-problem')).toContainText('次の集合を求めよ')
  await expect(page.getByTestId('math-practice-reading-flow')).toBeVisible()
  await expect(page.getByTestId('math-practice-current-target')).toContainText('補集合を考える基準を確認する')

  const firstBlank = 'math-practice-094-universe-basis'
  const secondBlank = 'math-practice-094-a-complement'
  await expect(page.getByTestId(`blank-${firstBlank}`)).toContainText('選択')
  await expect(page.getByTestId(`blank-${secondBlank}`)).toHaveCount(0)

  await page.getByTestId(`blank-${firstBlank}`).click()
  await page.getByTestId('option-math-practice-094-universe-basis-u').click()

  // Once preparation is finished, its long explanation disappears and only (1) is shown.
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  await expect(readingFlow).not.toContainText('補集合では、どの範囲を基準に')
  await expect(page.getByTestId(`blank-${secondBlank}`)).toContainText('選択')
  await expect(page.getByTestId('math-practice-current-target')).toContainText('今の問い｜(1)')
  await expect(page.getByTestId('math-practice-current-target').locator('.katex')).toHaveCount(1)

  await page.getByTestId(`blank-${secondBlank}`).click()
  await page.getByTestId('option-math-practice-094-a-complement-correct').click()

  // (2) is now the only derivation on screen; (1) has been compressed away.
  await expect(page.getByTestId('math-practice-current-target')).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('A の補集合はどれか')
  await expect(page.getByTestId('blank-math-practice-094-b-complement')).toContainText('選択')
  await page.getByTestId('blank-math-practice-094-b-complement').click()
  await page.getByTestId('option-math-practice-094-b-complement-correct').click()

  // (3) reuses only the result of (1), not the full previous derivation.
  const meaningBlank = page.getByTestId('blank-math-practice-094-abar-intersection-b-meaning')
  await expect(meaningBlank).toContainText('選択')
  await expect(page.getByTestId('math-practice-current-target')).toContainText('今の問い｜(3)')
  await expect(readingFlow).not.toContainText('A の補集合はどれか')
  await expect(readingFlow).not.toContainText('B の補集合はどれか')

  const dependencies = page.getByTestId('math-practice-dependency-links')
  await expect(dependencies).toContainText('(1) の結果')
  await expect(dependencies).not.toContainText('(2) の結果')
  await expect(dependencies).toContainText('4,6,8,9,10')
  await expect(page.getByTestId('math-practice-dependency-detail-s1')).toHaveCount(0)

  // The small result link can expand the old derivation only when the learner asks for it.
  await page.getByTestId('math-practice-dependency-s1').click()
  await expect(page.getByTestId('math-practice-dependency-detail-s1')).toContainText('A の補集合はどれか')
  await page.getByTestId('math-practice-dependency-s1').click()
  await expect(page.getByTestId('math-practice-dependency-detail-s1')).toHaveCount(0)

  await expect(meaningBlank.locator('xpath=..').locator('.katex')).toHaveCount(1)
  await expect(page.getByTestId('standard-guide')).not.toContainText('overline(')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('problem card 11 compresses 97 into a linear result-reuse chain', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByTestId('math-topic-question-11').click()

  await expect(page.getByRole('heading', { name: '97｜共通部分から定数を決める' })).toBeVisible()
  const problem = page.getByTestId('standard-problem')
  const readingFlow = page.getByTestId('math-practice-reading-flow')
  const currentTarget = page.getByTestId('math-practice-current-target')
  await expect(problem).toContainText('このとき、定数')
  await expect(problem).toContainText('の値と和集合')
  await expect(problem).not.toContainText('3a-2=4')
  await expect(page.getByTestId('math-practice-reading-flow')).toBeVisible()
  await expect(currentTarget).toContainText('共通部分の条件から')
  await expect(currentTarget).toContainText('を求める')
  await expect(currentTarget.locator('.katex')).toHaveCount(1)
  const problemInlineMath = page.getByTestId('standard-problem').getByTestId('math-practice-inline-math')
  expect(await problemInlineMath.count()).toBeGreaterThan(0)

  // Stage 1: solve a. Future stages stay hidden.
  await expect(page.getByTestId('blank-math-practice-097-four-membership')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-097-a-set')).toHaveCount(0)
  await expect(page.getByTestId('blank-math-practice-097-union-result')).toHaveCount(0)

  const solveStage = [
    ['math-practice-097-four-membership', 'option-math-practice-097-four-membership-both'],
    ['math-practice-097-variable-element', 'option-math-practice-097-variable-element-expr'],
    ['math-practice-097-equation-for-four', 'option-math-practice-097-equation-for-four-correct'],
    ['math-practice-097-solve-a', 'option-math-practice-097-solve-a-two'],
  ] as const
  for (const [blankId, optionId] of solveStage) {
    await page.getByTestId(`blank-${blankId}`).click()
    await page.getByTestId(optionId).click()
  }

  // Stage 2 imports only a=2; the long stage-1 derivation is gone.
  await expect(currentTarget).toContainText('求めた')
  await expect(currentTarget).toContainText('条件を本当に満たすか')
  await expect(readingFlow).not.toContainText('4 がどこに入らなければ')
  const solveDependency = page.getByTestId('math-practice-dependency-links')
  await expect(solveDependency).toContainText('前の結果')
  await expect(solveDependency).toContainText('2')
  await expect(page.getByTestId('math-practice-dependency-detail-solve-a')).toHaveCount(0)

  await page.getByTestId('math-practice-dependency-solve-a').click()
  await expect(page.getByTestId('math-practice-dependency-detail-solve-a')).toContainText('3a-2=4')
  await page.getByTestId('math-practice-dependency-solve-a').click()
  await expect(page.getByTestId('math-practice-dependency-detail-solve-a')).toHaveCount(0)

  const verifyStage = [
    ['math-practice-097-a-set', 'option-math-practice-097-a-set-correct'],
    ['math-practice-097-b-set', 'option-math-practice-097-b-set-correct'],
    ['math-practice-097-intersection-check', 'option-math-practice-097-intersection-check-correct'],
  ] as const
  for (const [blankId, optionId] of verifyStage) {
    await page.getByTestId(`blank-${blankId}`).click()
    await page.getByTestId(optionId).click()
  }

  // Final stage imports the verified A and B results, not the old solve-a derivation.
  await expect(currentTarget).toContainText('最後の目標')
  await expect(readingFlow).not.toContainText('得た値を A と B の両方へ戻し')
  const unionDependencies = page.getByTestId('math-practice-dependency-links')
  await expect(unionDependencies).toContainText('前の確認結果')
  await expect(unionDependencies).toContainText('1,3,4')
  await expect(unionDependencies).toContainText('-5,4,1')
  await expect(unionDependencies).not.toContainText('前の結果')
  await expect(page.getByTestId('blank-math-practice-097-union-result')).toContainText('選択')

  await page.getByTestId('math-practice-dependency-verify-a').click()
  await expect(page.getByTestId('math-practice-dependency-detail-verify-a')).toContainText('A∩B')
  await page.getByTestId('math-practice-dependency-verify-a').click()
  await expect(page.getByTestId('math-practice-dependency-detail-verify-a')).toHaveCount(0)

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('finishing 87 shows a direct next-problem button and opens 88', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()

  const answers = [
    ['math-practice-087-condition-sufficiency', 'option-math-practice-087-condition-sufficiency-not-enough'],
    ['math-practice-087-prime-condition', 'option-math-practice-087-prime-condition-prime'],
    ['math-practice-087-two-divisors', 'option-math-practice-087-two-divisors-one-two'],
    ['math-practice-087-two-membership', 'option-math-practice-087-two-membership-in'],
    ['math-practice-087-fifteen-factor', 'option-math-practice-087-fifteen-factor-three-five'],
    ['math-practice-087-fifteen-membership', 'option-math-practice-087-fifteen-membership-not-in'],
    ['math-practice-087-twentyone-factor', 'option-math-practice-087-twentyone-factor-three-seven'],
    ['math-practice-087-twentyone-membership', 'option-math-practice-087-twentyone-membership-not-in'],
    ['math-practice-087-twentynine-divisor-check', 'option-math-practice-087-twentynine-divisor-check-none'],
    ['math-practice-087-twentynine-membership', 'option-math-practice-087-twentynine-membership-in'],
  ] as const

  for (const [blankId, optionId] of answers) {
    await page.getByTestId(`blank-${blankId}`).click()
    await page.getByTestId(optionId).click()
  }

  await expect(page.getByTestId('math-practice-complete')).toContainText('この問題は完了です')
  await expect(page.getByTestId('math-practice-next-question')).toContainText('次の問題を解く')
  await page.getByTestId('math-practice-next-question').click()
  await expect(page.getByRole('heading', { name: '88｜集合の表し方' })).toBeVisible()
  await expect(page.getByTestId('math-practice-reading-flow')).toBeVisible()
})


test('88 keeps the stop-point answer hidden until the learner reasons it out, then compresses (1)', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByTestId('math-topic-question-2').click()

  await expect(page.getByRole('heading', { name: '88｜集合の表し方' })).toBeVisible()
  const currentTarget = page.getByTestId('math-practice-current-target')
  const readingFlow = page.getByTestId('math-practice-reading-flow')

  await expect(currentTarget).toContainText('今の問い｜(1)')
  await expect(readingFlow).toContainText('36の正の約数を漏れなく探す')
  await expect(page.getByTestId('blank-math-practice-088-p1-strategy')).toContainText('選択')
  await expect(page.getByTestId('blank-math-practice-088-p1-stop')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-088-p1-strategy').click()
  await page.getByTestId('option-math-practice-088-p1-strategy-factor-pairs').click()

  await expect(page.getByTestId('blank-math-practice-088-p1-stop')).toContainText('選択')
  await expect(readingFlow).toContainText('4×9')
  await expect(readingFlow).not.toContainText('6×6')

  await page.getByTestId('blank-math-practice-088-p1-stop').click()
  await page.getByTestId('option-math-practice-088-p1-stop-six-six').click()
  await page.getByTestId('blank-math-practice-088-p1-result').click()
  await page.getByTestId('option-math-practice-088-p1-result-correct').click()

  await expect(currentTarget).toContainText('今の問い｜(2)')
  await expect(readingFlow).not.toContainText('36の正の約数を漏れなく探す')
  await expect(page.getByTestId('math-practice-dependency-links')).toHaveCount(0)
})

test('93 reuses only the prepared A B C result block across its two subproblems', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByTestId('math-topic-question-7').click()

  await expect(page.getByRole('heading', { name: '93｜3つの集合' })).toBeVisible()
  const prepAnswers = [
    ['math-practice-093-a-set', 'option-math-practice-093-a-set-correct'],
    ['math-practice-093-b-set', 'option-math-practice-093-b-set-correct'],
    ['math-practice-093-c-set', 'option-math-practice-093-c-set-correct'],
  ] as const
  for (const [blankId, optionId] of prepAnswers) {
    await page.getByTestId(`blank-${blankId}`).click()
    await page.getByTestId(optionId).click()
  }

  await expect(page.getByTestId('math-practice-current-target')).toContainText('今の問い｜(1)')
  const deps = page.getByTestId('math-practice-dependency-links')
  await expect(deps).toContainText('準備した3集合')
  await expect(deps).toContainText('16')
  await expect(deps).toContainText('24')
  await expect(page.getByTestId('math-practice-dependency-detail-basis')).toHaveCount(0)
})

test('96 imports (1) only when reaching (5), not for unrelated subproblems', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByTestId('math-topic-question-10').click()

  await expect(page.getByRole('heading', { name: '96｜3集合の複合演算' })).toBeVisible()

  await page.getByTestId('blank-math-practice-096-p1-ab').click()
  await page.getByTestId('option-math-practice-096-p1-ab-correct').click()
  await page.getByTestId('blank-math-practice-096-p1-result').click()
  await page.getByTestId('option-math-practice-096-p1-result-correct').click()

  await expect(page.getByTestId('math-practice-current-target')).toContainText('今の問い｜(2)')
  await expect(page.getByTestId('math-practice-dependency-links')).toHaveCount(0)

  await page.getByTestId('blank-math-practice-096-p2-result').click()
  await page.getByTestId('option-math-practice-096-p2-result-correct').click()
  await page.getByTestId('blank-math-practice-096-p3-ab').click()
  await page.getByTestId('option-math-practice-096-p3-ab-correct').click()
  await page.getByTestId('blank-math-practice-096-p3-result').click()
  await page.getByTestId('option-math-practice-096-p3-result-correct').click()
  await page.getByTestId('blank-math-practice-096-p4-candidates').click()
  await page.getByTestId('option-math-practice-096-p4-candidates-b').click()
  await page.getByTestId('blank-math-practice-096-p4-result').click()
  await page.getByTestId('option-math-practice-096-p4-result-correct').click()

  await expect(page.getByTestId('math-practice-current-target')).toContainText('今の問い｜(5)')
  const deps = page.getByTestId('math-practice-dependency-links')
  await expect(deps).toContainText('(1) の結果')
  await expect(deps).toContainText('3')
  await expect(page.getByTestId('math-practice-dependency-detail-s1')).toHaveCount(0)
})

test('old math samples live under Common-Test practice instead of the 4STEP chapter cards', async ({ page }) => {
  await page.getByTestId('math-exercise-common-test').click()
  await expect(page.getByTestId('math-domain-sets-and-propositions')).toHaveCount(0)
  await expect(page.getByTestId('math-common-test-quadratic')).toContainText('二次関数')
  await expect(page.getByTestId('math-common-test-data-analysis')).toContainText('データの分析')
})
