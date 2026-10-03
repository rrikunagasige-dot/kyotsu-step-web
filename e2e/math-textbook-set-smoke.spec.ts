import { expect, test, type Page } from '@playwright/test'

const appRoute = (path: string) => `/kyotsu-step-web/#${path}`

async function clearState(page: Page) {
  await page.goto(appRoute('/problems'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
}

async function chooseWrongOption(page: Page, itemId: string, correctLabel: string) {
  await page.getByTestId(`textbook-item-${itemId}`).click()
  const panel = page.getByTestId(`inline-choice-panel-${itemId}`)
  await expect(panel).toBeVisible()

  const options = panel.locator('.reading-choice-option')
  for (let index = 0; index < await options.count(); index += 1) {
    const option = options.nth(index)
    const label = (await option.getAttribute('aria-label')) ?? ''
    if (label !== correctLabel) {
      await option.click()
      return
    }
  }
  throw new Error(`No distractor visible for ${itemId}`)
}

test.beforeEach(async ({ page }) => {
  await clearState(page)
})

test('math set lesson boots directly on the shared textbook reader', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message))

  await page.goto(appRoute('/learning/textbook/math-sets'))

  await expect(page.getByText('TEXTBOOK / MATH I+A / CHAPTER 3')).toBeVisible()
  await expect(page.getByRole('heading', { name: '集合', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '集合を表す', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a02')).toHaveCount(0)
  await expect(page.getByText('TEXTBOOK / PHYSICS')).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('wrong answer stays unresolved, shows a staged hint, and does not unlock concept prose', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))

  await chooseWrongOption(page, 'set-a01', '1, 2, 3, 4, 6, 8, 12, 24')

  await expect(page.getByTestId('resolved-set-a01')).toHaveCount(0)
  await expect(page.getByText(/ひとまとまりとして考えたものを集合という/)).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-set-a02')).toHaveCount(0)

  await page.getByTestId('textbook-item-set-a01').click()
  const hint = page.getByTestId('textbook-hint-set-a01')
  await expect(hint).toBeVisible()
  await expect(hint).toContainText('24を割り切れる正の整数')
  await expect(hint).not.toContainText('1, 2, 3, 4, 6, 8, 12, 24')
})

test('correct answer fills the sentence and unlocks the next learning step', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))

  await page.getByTestId('textbook-item-set-a01').click()
  const panel = page.getByTestId('inline-choice-panel-set-a01')
  await panel.getByRole('button', { name: '1, 2, 3, 4, 6, 8, 12, 24', exact: true }).click()

  await expect(page.getByTestId('resolved-set-a01')).toContainText('1, 2, 3, 4, 6, 8, 12, 24')
  await expect(page.getByText(/ひとまとまりとして考えたものを集合という/)).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a02')).toBeVisible()
})

test('set notation renders without KaTeX errors or horizontal overflow', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))

  const itemIds = ['set-a01', 'set-a02', 'set-a03', 'set-a04', 'set-a05']
  const answers = [
    '1, 2, 3, 4, 6, 8, 12, 24',
    '入っている',
    '入っていない',
    '\\in',
    '\\notin',
  ]

  for (let index = 0; index < itemIds.length; index += 1) {
    const itemId = itemIds[index]
    await page.getByTestId(`textbook-item-${itemId}`).click()
    await page.getByTestId(`inline-choice-panel-${itemId}`).getByRole('button', { name: answers[index], exact: true }).click()
  }

  await expect(page.locator('.katex-error')).toHaveCount(0)
  const tex = (await page.locator('annotation[encoding="application/x-tex"]').allTextContents()).join('\n')
  expect(tex).toContain('\\in')
  expect(tex).toContain('\\notin')

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})
