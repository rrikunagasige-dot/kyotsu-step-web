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
})

test('problem card 2 switches inside the theme directly to 94', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByTestId('math-topic-question-2').click()

  await expect(page.getByRole('heading', { name: '94｜補集合' })).toBeVisible()
  await expect(page.getByTestId('math-topic-question-2')).toHaveAttribute('aria-current', 'page')
  await expect(page.getByTestId('standard-problem')).toContainText('次の集合を求めよ')

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('problem card 3 switches inside the theme directly to 97 without leaking the equation', async ({ page }) => {
  await page.getByTestId('math-exercise-basic').click()
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByTestId('math-topic-question-3').click()

  await expect(page.getByRole('heading', { name: '97｜共通部分から定数を決める' })).toBeVisible()
  const problem = page.getByTestId('standard-problem')
  const guide = page.getByTestId('standard-guide')
  await expect(problem).toContainText('定数 a の値と和集合')
  await expect(problem).not.toContainText('3a-2=4')
  await expect(guide.getByTestId('blank-math-practice-097-equation-for-four')).toBeVisible()
})


test('old math samples live under Common-Test practice instead of the 4STEP chapter cards', async ({ page }) => {
  await page.getByTestId('math-exercise-common-test').click()
  await expect(page.getByTestId('math-domain-sets-and-propositions')).toHaveCount(0)
  await expect(page.getByTestId('math-common-test-quadratic')).toContainText('二次関数')
  await expect(page.getByTestId('math-common-test-data-analysis')).toContainText('データの分析')
})
