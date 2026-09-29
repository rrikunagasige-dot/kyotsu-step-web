import { expect, test } from '@playwright/test'

const appRoute = (path: string) => `/kyotsu-step-web/#${path}`

test.beforeEach(async ({ page }) => {
  await page.goto(appRoute('/problems'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('v2.2 app boots and opens the textbook setup', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto(appRoute('/learning/setup'))

  await expect(page.getByRole('heading', { name: '学習設定' })).toBeVisible()
  await expect(page.getByTestId('textbook-part-list')).toBeVisible()
  await expect(page.getByText('App の起動に失敗しました')).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('v2.2 1A renders the first inline hole and choices', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))

  await expect(page.getByRole('heading', { name: '変位と速度', exact: true })).toBeVisible()
  const a1 = page.getByTestId('textbook-item-a1')
  await expect(a1).toBeVisible()
  await a1.click()

  const choices = page.getByTestId('inline-choice-panel-a1')
  await expect(choices).toBeVisible()
  await expect(choices.getByRole('button', { name: '位置', exact: true })).toBeVisible()
  await expect(page.getByText('App の起動に失敗しました')).toHaveCount(0)
  expect(pageErrors).toEqual([])
})
