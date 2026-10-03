import { expect, test } from '@playwright/test'
import { appRoute } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto(appRoute('/learning/setup?mode=practice&subject=math-1a'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.getByRole('radio', { name: /問題を解く/ }).click()
  await page.getByRole('button', { name: '数学 I・A' }).click()
})

test('Math I・A practice starts from a small learning-theme title hierarchy', async ({ page }) => {
  await expect(page.getByTestId('math-domain-sets-and-propositions')).toContainText('数学 I｜集合と命題')
  await expect(page.getByTestId('math-domain-functions')).toContainText('数学 I｜関数')

  await expect(page.getByTestId('math-topic-organize-sets')).toContainText('集合を整理する')
  await expect(page.getByTestId('math-topic-organize-sets')).toContainText('集合の表し方 → 部分集合')
  await expect(page.getByTestId('math-topic-read-propositions')).toContainText('条件から命題を読む')
  await expect(page.getByTestId('math-topic-prove-propositions')).toContainText('命題を証明する')
  await expect(page.getByTestId('math-topic-represent-functions')).toContainText('関数を表す')

  await page.getByTestId('math-topic-organize-sets').click()
  const selector = page.getByLabel('問題番号')
  await expect(selector.locator('option')).toHaveText(['87', '94', '97'])
})

test('87 keeps 問題 separate from 考えながら解く and supports retry', async ({ page }) => {
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByLabel('問題番号').selectOption('math-practice-087')
  await page.getByTestId('start-learning').click()

  await expect(page.getByRole('heading', { name: '87｜素数と集合' })).toBeVisible()
  const problem = page.getByTestId('standard-problem')
  const guide = page.getByTestId('standard-guide')
  await expect(problem.getByRole('heading', { name: '問題' })).toBeVisible()
  await expect(problem).toContainText('次の□に')
  await expect(guide.getByRole('heading', { name: '考えながら解く' })).toBeVisible()

  const blankId = 'math-practice-087-condition-sufficiency'
  await page.getByTestId(`blank-${blankId}`).click()
  await page.getByTestId('option-math-practice-087-condition-sufficiency-enough').click()
  await expect(page.getByTestId(`answer-${blankId}`)).toContainText('不正解')

  await page.getByTestId(`retry-${blankId}`).click()
  await page.getByTestId('option-math-practice-087-condition-sufficiency-not-enough').click()
  await expect(page.getByTestId(`answer-${blankId}`)).toContainText('再回答で正解')
})

test('94 long multi-part pilot opens on mobile without horizontal page overflow', async ({ page }) => {
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByLabel('問題番号').selectOption('math-practice-094')
  await page.getByTestId('start-learning').click()

  await expect(page.getByRole('heading', { name: '94｜補集合' })).toBeVisible()
  await expect(page.getByTestId('standard-problem')).toContainText('次の集合を求めよ')
  await expect(page.getByTestId('standard-guide')).toBeVisible()

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }))
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1)
})

test('97 reasoning pilot reaches the equation-building thinking node without leaking it in the problem', async ({ page }) => {
  await page.getByTestId('math-topic-organize-sets').click()
  await page.getByLabel('問題番号').selectOption('math-practice-097')
  await page.getByTestId('start-learning').click()

  const problem = page.getByTestId('standard-problem')
  const guide = page.getByTestId('standard-guide')
  await expect(problem).toContainText('定数 a の値と和集合')
  await expect(problem).not.toContainText('3a-2=4')
  await expect(guide.getByTestId('blank-math-practice-097-equation-for-four')).toBeVisible()
})
