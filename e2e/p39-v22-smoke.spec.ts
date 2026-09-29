import { expect, test, type Page } from '@playwright/test'

const appRoute = (path: string) => `/kyotsu-step-web/#${path}`

const units = [
  { id: 'physics-a-displacement-velocity', title: '変位と速度', firstHole: 'a1' },
  { id: 'physics-1b-velocity-composition', title: '速度の合成と分解', firstHole: 'b1' },
  { id: 'physics-1c-relative-velocity', title: '相対速度', firstHole: 'c2' },
  { id: 'physics-1d-acceleration', title: '加速度', firstHole: 'd1' },
  { id: 'physics-1e-horizontal-projectile', title: '水平投射', firstHole: 'e1' },
  { id: 'physics-1f-oblique-projectile', title: '斜方投射', firstHole: 'f1' },
  { id: 'physics-1g-gravity-drag-terminal-velocity', title: '重力加速度・空気抵抗・終端速度', firstHole: 'g1' },
] as const

async function clearState(page: Page) {
  await page.goto(appRoute('/problems'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
}

test.beforeEach(async ({ page }) => {
  await clearState(page)
})

test('audited app boots and opens the textbook setup', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message))

  await page.goto(appRoute('/learning/setup'))

  await expect(page.getByRole('heading', { name: '学習設定' })).toBeVisible()
  await expect(page.getByTestId('textbook-part-list')).toBeVisible()
  await expect(page.getByText('App の起動に失敗しました')).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('every Chapter 1 unit boots to its first meaningful hole without developer metadata', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message))

  for (const unit of units) {
    await page.goto(appRoute(`/learning/textbook/${unit.id}`))
    await expect(page.getByRole('heading', { name: unit.title, exact: true })).toBeVisible()
    await expect(page.getByTestId(`textbook-item-${unit.firstHole}`)).toBeVisible()

    const body = page.locator('body')
    await expect(body).not.toContainText(/第\s*\d+\s*版/)
    await expect(body).not.toContainText(/v2\.\d/i)
  }

  expect(pageErrors).toEqual([])
})

test('A1 choice panel uses natural wording and does not expose the internal hole id', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))

  const a1 = page.getByTestId('textbook-item-a1')
  await expect(a1).toBeVisible()
  await a1.click()

  const panel = page.getByTestId('inline-choice-panel-a1')
  await expect(panel).toBeVisible()
  await expect(panel).toContainText('空欄に入る内容を選んで')
  await expect(panel).not.toContainText('A1')
  await expect(panel.getByRole('button', { name: '位置', exact: true })).toBeVisible()
})

test('first concept-forming figure is not upscaled beyond its intrinsic size', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))
  const image = page.getByTestId('textbook-figure-fig-1-guide').locator('img')
  await expect(image).toBeVisible()

  const dimensions = await image.evaluate((element) => {
    const img = element as HTMLImageElement
    return {
      rendered: img.getBoundingClientRect().width,
      natural: img.naturalWidth,
    }
  })
  expect(dimensions.natural).toBeGreaterThan(0)
  expect(dimensions.rendered).toBeLessThanOrEqual(dimensions.natural + 1)
})
