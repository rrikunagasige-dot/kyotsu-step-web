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
  await expect(nav.getByRole('button')).toHaveText(['1', '2', '3'])
  await expect(page.getByTestId('math-topic-question-1')).toHaveAttribute('aria-current', 'page')
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

test('problem card 2 opens 94 with the same Physics-style progressive reading flow', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByTestId('math-topic-question-2').click()

  await expect(page.getByRole('heading', { name: '94｜補集合' })).toBeVisible()
  await expect(page.getByTestId('math-topic-question-2')).toHaveAttribute('aria-current', 'page')
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

test('problem card 3 compresses 97 into a linear result-reuse chain', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByTestId('math-topic-question-3').click()

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

test('finishing 87 shows a direct next-problem button and opens 94', async ({ page }) => {
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
  await expect(page.getByRole('heading', { name: '94｜補集合' })).toBeVisible()
  await expect(page.getByTestId('math-practice-reading-flow')).toBeVisible()
})


test('old math samples live under Common-Test practice instead of the 4STEP chapter cards', async ({ page }) => {
  await page.getByTestId('math-exercise-common-test').click()
  await expect(page.getByTestId('math-domain-sets-and-propositions')).toHaveCount(0)
  await expect(page.getByTestId('math-common-test-quadratic')).toContainText('二次関数')
  await expect(page.getByTestId('math-common-test-data-analysis')).toContainText('データの分析')
})
