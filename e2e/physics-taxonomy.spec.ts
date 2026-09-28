import { expect, test } from '@playwright/test'
import { appRoute } from './helpers'

async function openPhysicsPractice(page: import('@playwright/test').Page) {
  await page.goto(appRoute('/problems'))
  await expect(page.getByTestId('physics-taxonomy-board')).toHaveCount(0)
  await page.getByRole('link', { name: /学習を始める/ }).click()
  await page.getByRole('radio', { name: /問題を解く/ }).click()
  await page.getByRole('button', { name: '物理' }).click()
}

test('physics taxonomy appears only after learning setup → practice → physics', async ({ page }) => {
  await openPhysicsPractice(page)

  await expect(page.getByTestId('physics-taxonomy-board')).toBeVisible()
  await expect(page.locator('[data-testid^="physics-topic-"]')).toHaveCount(23)

  for (const domain of ['力学', '熱', '波動', '電磁気', '原子']) {
    await expect(page.getByRole('heading', { name: domain, exact: true })).toBeVisible()
  }

  await expect(page.getByTestId('physics-topic-motion')).toContainText('運動')
  await expect(page.getByTestId('physics-topic-motion')).toContainText('15')
  await expect(page.getByTestId('physics-topic-current')).toContainText('1')
  await expect(page.getByTestId('physics-topic-magnetic-field')).toContainText('1')

  await expect(page.getByTestId('physics-topic-force')).toBeDisabled()
  await expect(page.getByTestId('physics-topic-force')).toContainText('0')
  await expect(page.getByTestId('physics-topic-nucleus')).toBeDisabled()
  await expect(page.getByTestId('start-learning')).toBeDisabled()
})

test('motion topic contains the original sample plus fourteen Chapter 1 worked examples', async ({ page }) => {
  await openPhysicsPractice(page)
  await page.getByTestId('physics-topic-motion').click()

  await expect(page.getByTestId('physics-topic-filter')).toContainText('運動')
  await expect(page.getByTestId('physics-topic-filter')).toContainText('15 問')
  await expect(page.getByLabel('学習する問題').locator('option')).toHaveCount(15)
  await expect(page.getByLabel('学習する問題')).toHaveValue('physics-motion-01')

  await page.getByLabel('学習する問題').selectOption('physics-ch01-1g-example-q1')
  await expect(page.getByLabel('学習する問題')).toContainText('1G 重力加速度・空気抵抗・終端速度｜例題1')
  await page.getByTestId('start-learning').click()

  await expect(page).toHaveURL(/\/learning\/session\/learn-/)
  await expect(page.getByRole('heading', { name: '1G 重力加速度・空気抵抗・終端速度｜例題1' })).toBeVisible()
})
