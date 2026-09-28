import { expect, test } from '@playwright/test'
import { appRoute } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto(appRoute('/problems'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('switches the complete learning flow and preserves progress across languages', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
  await page.getByRole('button', { name: '中文' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
  await expect(page.getByRole('heading', { name: '题目' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('button', { name: '中文' })).toHaveAttribute('aria-pressed', 'true')
  await page.goto(appRoute('/learning/setup'))
  await expect(page.getByRole('heading', { name: '学习设置' })).toBeVisible()
  await page.getByRole('radio', { name: /做题/ }).click()
  await page.getByLabel('选择学习题目').selectOption('math-quadratic-01')
  await expect(page.getByLabel('选择学习题目').locator('option:checked')).toHaveText('通过对话理解二次函数最大值')
  await expect(page.getByText('引导强度')).toHaveCount(0)
  await page.getByTestId('start-learning').click()

  await expect(page.getByRole('heading', { name: '通过对话理解二次函数最大值' })).toBeVisible()
  await expect(page.getByText('要判断最大值，可以先配方，再看抛物线的顶点。')).toBeVisible()
  await page.getByTestId('blank-mq-blank-sign').click()
  await page.getByTestId('option-mq-sign-minus').click()
  await expect(page.getByTestId('answer-mq-blank-sign')).toContainText('首次正确')

  const sessionUrl = page.url()
  await page.getByRole('button', { name: '日本語' }).click()
  await expect(page.getByRole('heading', { name: '会話で考える二次関数の最大値' })).toBeVisible()
  await expect(page.getByTestId('answer-mq-blank-sign')).toContainText('初回正解')
  await expect(page).toHaveURL(sessionUrl)

  await page.getByRole('button', { name: '中文' }).click()
  await page.getByTestId('option-mq-vertex-two').click()
  await page.getByTestId('option-mq-max-five').click()
  await page.getByTestId('open-final-choice').click()
  await page.getByTestId('final-option-mq-final-a').click()
  await expect(page).toHaveURL(/\/learning\/result\/learn-/)
  await expect(page.getByRole('heading', { name: '学习结果' })).toBeVisible()
  await expect(page.getByText('最大值', { exact: true })).toBeVisible()
})

test('uses Chinese in simulation, analysis, ranking, profile, and persists the preference', async ({ page }) => {
  await page.getByRole('button', { name: '中文' }).click()
  await page.goto(appRoute('/simulation/setup'))
  await expect(page.getByRole('heading', { name: '模拟测试设置' })).toBeVisible()
  await expect(page.getByText('通过对话理解二次函数最大值')).toBeVisible()
  await page.getByTestId('start-simulation').click()
  await expect(page.getByRole('heading', { name: '通过对话理解二次函数最大值' })).toBeVisible()
  await expect(page.getByText('选择取得最大值时的 x。')).toBeVisible()
  await page.getByTestId('open-submit').click()
  await expect(page.getByRole('alertdialog')).toContainText('还有 2 个小题未作答')
  await page.getByRole('button', { name: '确认提交' }).click()
  await expect(page.getByRole('heading', { name: '模拟测试结果' })).toBeVisible()
  await expect(page.getByText('未作答', { exact: true }).first()).toBeVisible()

  await page.goto(appRoute('/analysis'))
  await expect(page.getByRole('heading', { name: '分析' })).toBeVisible()
  await page.goto(appRoute('/ranking'))
  await expect(page.getByRole('heading', { name: '排行榜' })).toBeVisible()
  await page.goto(appRoute('/profile'))
  await expect(page.getByRole('heading', { name: '我的' })).toBeVisible()
  await expect(page.getByLabel('显示名称')).toHaveValue('学习者')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
  await expect(page.getByTestId('language-switcher').getByRole('button', { name: '中文' })).toHaveAttribute('aria-pressed', 'true')
})
