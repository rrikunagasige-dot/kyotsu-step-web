import { expect, test } from '@playwright/test'
import { appRoute } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto(appRoute('/problems'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('analysis, mistakes, and history are derived from a real completed attempt', async ({ page }) => {
  await page.goto(appRoute('/learning/setup'))
  await page.getByRole('radio', { name: /問題を解く/ }).click()
  await page.getByLabel('学習する問題').selectOption('math-quadratic-01')
  await page.getByTestId('start-learning').click()
  await page.getByTestId('blank-mq-blank-sign').click()
  await page.getByTestId('option-mq-sign-minus').click()
  await page.getByTestId('option-mq-vertex-minus-two').click()
  await page.getByTestId('retry-mq-blank-vertex').click()
  await page.getByTestId('option-mq-vertex-two').click()
  await page.getByTestId('option-mq-max-five').click()
  await page.getByTestId('open-final-choice').click()
  await page.getByTestId('final-option-mq-final-a').click()
  await expect(page).toHaveURL(/\/learning\/result\/learn-/)

  await page.goto(appRoute('/analysis'))
  await expect(page.getByRole('heading', { name: '分析' })).toBeVisible()
  await expect(page.getByText('75%', { exact: true }).first()).toBeVisible()
  await page.getByRole('link', { name: /maximum/ }).click()
  await expect(page.getByRole('heading', { name: 'maximum' })).toBeVisible()
  await expect(page.getByText('反復誤答', { exact: true })).toBeVisible()

  await page.goto(appRoute('/mistakes'))
  await expect(page.getByText('復習中', { exact: true })).toBeVisible()
  await expect(page.getByText('二次関数の最大値')).toBeVisible()

  await page.goto(appRoute('/history'))
  await expect(page.getByRole('heading', { name: '学習履歴' })).toBeVisible()
  await expect(page.getByText('rev.2')).toBeVisible()
  await expect(page.getByText('3/4 初回正解')).toBeVisible()
})

test('empty analytics states do not fabricate progress', async ({ page }) => {
  await page.goto(appRoute('/analysis'))
  await expect(page.getByText('分析できる記録がありません')).toBeVisible()
  await page.goto(appRoute('/mistakes'))
  await expect(page.getByText('復習する誤答はありません')).toBeVisible()
  await page.goto(appRoute('/history'))
  await expect(page.getByText('履歴はまだありません')).toBeVisible()
})
