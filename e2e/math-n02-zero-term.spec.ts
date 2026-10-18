import { expect, test } from '@playwright/test'

const appRoute = (path: string) => `/kyotsu-step-web/#${path}`

test('W-MATH-010 N02 Q05: asks for term 0x, reveals explanation after answer, mobile display safe', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto(appRoute('/problems'))
  await page.evaluate(() => localStorage.clear())
  await page.goto(appRoute('/learning/textbook/math-numbers-expressions-n02'))
  const earlier: Array<[string, string]> = [
    ['n02-01', '3bx'],
    ['n02-02', 'x^3-ax^2+3bx+5c'],
    ['n02-03', '(2y-3,\\ y^2-3y+2)'],
    ['n02-04', 'x^2+(2y-3)x+(y^2-3y+2)'],
  ]
  for (const [id, answer] of earlier) {
    await page.getByTestId(`textbook-item-${id}`).click()
    await page.getByTestId(`inline-choice-panel-${id}`)
      .getByRole('button', { name: answer, exact: true }).click()
  }
  const hole = page.getByTestId('textbook-item-n02-05')
  await expect(hole).toBeVisible()
  await expect(hole).toHaveAttribute('aria-label', '係数が0の一次項を、Bの式中に補おう。')
  await expect(page.getByText('係数は', { exact: false })).toHaveCount(0)
  await hole.click()
  const panel = page.getByTestId('inline-choice-panel-n02-05')
  await expect(panel.getByRole('button', { name: '0x', exact: true })).toBeVisible()
  const wrong = panel.getByRole('button', { name: 'x', exact: true })
  await wrong.click()
  await expect(page.getByTestId('textbook-item-n02-06')).toHaveCount(0)
  await hole.click()
  await page.getByTestId('inline-choice-panel-n02-05').getByRole('button', { name: '0x', exact: true }).click()
  await expect(page.getByTestId('resolved-n02-05')).toBeVisible()
  await expect(page.getByText('もとの式の値は変わらない。')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n02-06')).toBeVisible()
  await expect(page.locator('.katex-error')).toHaveCount(0)
  const viewport = await page.evaluate(() => ({
    width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth,
  }))
  expect(viewport.scroll).toBeLessThanOrEqual(viewport.width + 1)
})
