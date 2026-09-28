import { expect, test } from '@playwright/test'
import { appRoute } from './helpers'

test('physics taxonomy board shows the approved 5-domain / 23-topic structure', async ({ page }) => {
  await page.goto(appRoute('/problems'))

  await expect(page.getByTestId('physics-taxonomy-board')).toBeVisible()
  await expect(page.locator('[data-testid^="physics-topic-"]')).toHaveCount(23)

  for (const domain of ['力学', '熱', '波動', '電磁気', '原子']) {
    await expect(page.getByRole('heading', { name: domain, exact: true })).toBeVisible()
  }

  await expect(page.getByTestId('physics-topic-motion')).toContainText('運動')
  await expect(page.getByTestId('physics-topic-motion')).toContainText('1')
  await expect(page.getByTestId('physics-topic-current')).toContainText('1')
  await expect(page.getByTestId('physics-topic-magnetic-field')).toContainText('1')

  await expect(page.getByTestId('physics-topic-force')).toHaveAttribute('aria-disabled', 'true')
  await expect(page.getByTestId('physics-topic-force')).toContainText('0')
  await expect(page.getByTestId('physics-topic-nucleus')).toHaveAttribute('aria-disabled', 'true')
})

test('a non-empty physics topic opens practice mode filtered to that topic', async ({ page }) => {
  await page.goto(appRoute('/problems'))
  await page.getByTestId('physics-topic-motion').click()

  await expect(page).toHaveURL(/\/learning\/setup\?mode=practice&subject=physics&topic=motion/)
  await expect(page.getByRole('radio', { name: /問題を解く/ })).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByRole('button', { name: '物理' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('physics-topic-filter')).toContainText('運動')
  await expect(page.getByTestId('physics-topic-filter')).toContainText('1 問')
  await expect(page.getByLabel('学習する問題').locator('option')).toHaveCount(1)
  await expect(page.getByLabel('学習する問題')).toHaveValue('physics-motion-01')
})
