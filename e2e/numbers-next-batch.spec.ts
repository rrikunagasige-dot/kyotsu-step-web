import { expect, test, type Page } from '@playwright/test'

const route = (unitId: string) => '/kyotsu-step-web/#/learning/textbook/' + unitId

async function visitClean(page: Page, unitId: string) {
  await page.goto(route(unitId))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
}

async function choose(page: Page, id: string, answer: string) {
  const trigger = page.getByTestId('textbook-item-' + id)
  await expect(trigger).toBeVisible()
  await trigger.click()
  const panel = page.getByTestId('inline-choice-panel-' + id)
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: answer, exact: true }).click()
  await expect(page.getByTestId('resolved-' + id)).toBeVisible()
}

async function mobileLayoutCheck(page: Page) {
  await expect(page.locator('.katex-error')).toHaveCount(0)
  const viewport = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }))
  expect(viewport.content).toBeLessThanOrEqual(viewport.client + 1)
}

test('N02 review: all 12 source-stage decisions, compound answers, no forward leakage', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await visitClean(page, 'math-numbers-expressions-n02')
  await expect(page.getByRole('heading', { name: '式を整える', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('多項式の整理と加減')
  await expect(page.getByTestId('textbook-item-n02-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n02-02')).toHaveCount(0)
  const answers: Array<[string, string]> = [
    ['n02-01','3bx'],
    ['n02-02','x^3-ax^2+3bx+5c'],
    ['n02-03','(2y-3,\\ y^2-3y+2)'],
    ['n02-04','x^2+(2y-3)x+(y^2-3y+2)'],
    ['n02-05','0x'],
    ['n02-06','x^3-x^2+x+1'],
    ['n02-07','x^3-2x^2-2'],
    ['n02-08','3x^3-5x^2+x-3'],
    ['n02-09','(4x^3-6x^2+2x-2,\\ 3x^3-6x^2-6)'],
    ['n02-10','7x^3-12x^2+2x-8'],
    ['n02-11','2A-3B'],
    ['n02-12','7x^3-12x^2+2x-8'],
  ]
  for (const [id, answer] of answers) {
    await choose(page, id, answer)
    if (id === 'n02-07') await expect(page.getByTestId('textbook-item-n02-08')).toBeVisible()
    if (id === 'n02-10') await expect(page.getByTestId('textbook-item-n02-11')).toBeVisible()
  }
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await mobileLayoutCheck(page)
  await page.reload()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
})

test('N09 review: n=-3 gates original figure, all 16 decisions and negative fractional parts', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await visitClean(page, 'math-numbers-expressions-n09')
  await expect(page.getByRole('heading', { name: '実数を扱う', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('平方根の符号と数直線')
  const originalFigure = page.getByTestId('textbook-figure-n09-f01')
  await expect(originalFigure).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n09-02')).toHaveCount(0)

  const first: Array<[string, string]> = [
    ['n09-01','x=4,\\ -4'],
    ['n09-02','(4,\\ 5)'],
    ['n09-03','4'],
    ['n09-04','(a,\\ -a)'],
    ['n09-05','|a|'],
    ['n09-06','2-\\sqrt5<0'],
    ['n09-07','\\sqrt5-2'],
    ['n09-r3-q08-square141','1.9881'],
    ['n09-r3-q08-square142','2.0164'],
    ['n09-08','1.41^2=1.9881<2<2.0164=1.42^2'],
    ['n09-09','1.41<\\sqrt2<1.42'],
  ]
  for (const [id, answer] of first) await choose(page, id, answer)
  await expect(originalFigure).toHaveCount(0)

  // Deliberately wrong flooring must not expose image, alt, or Q11.
  await page.getByTestId('textbook-item-n09-10').click()
  const panel = page.getByTestId('inline-choice-panel-n09-10')
  await panel.getByRole('button', { name: '-2', exact: true }).click()
  await expect(originalFigure).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n09-11')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n09-10')).toBeVisible()

  await choose(page, 'n09-10', '-3')
  await expect(originalFigure).toBeVisible()
  await expect(originalFigure.locator('img')).toHaveJSProperty('complete', true)
  await expect(page.getByTestId('textbook-item-n09-11')).toBeVisible()

  const last: Array<[string, string]> = [
    ['n09-11','-3+0.9'],
    ['n09-12','3<\\sqrt{10}<4'],
    ['n09-13','-4<-\\sqrt{10}<-3'],
    ['n09-14','\\begin{aligned}\\sqrt{10}&:(3,\\sqrt{10}-3)\\\\-\\sqrt{10}&:(-4,4-\\sqrt{10})\\end{aligned}'],
  ]
  for (const [id, answer] of last) await choose(page, id, answer)
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await mobileLayoutCheck(page)
  await page.reload()
  await expect(originalFigure).toBeVisible()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
})
