import { expect, test, type Page } from '@playwright/test'

// W-MATH-004/P-001: all 15 original Word answers still exist, with 6 extra
// in-flow learner decisions. Run in both mobile and desktop Chromium.
const path = '/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n12'
const choices: Array<[string, string]> = [
  ['n12-01a', '-7<2x'],
  ['n12-01', 'x>-\\frac72'],
  ['n12-02a', '2x\\le1'],
  ['n12-02', 'x\\le\\frac12'],
  ['n12-03', '二つ目に反するので不適'],
  ['n12-04', '-\\frac72<x\\le\\frac12'],
  ['n12-05', '3x+2\\le2x+4\\ \\text{かつ}\\ 2x+4\\le9-x'],
  ['n12-06a', 'x\\le2'],
  ['n12-06b', '3x\\le5'],
  ['n12-06', 'x\\le2,\\quad x\\le\\frac53'],
  ['n12-07', 'x\\le\\frac53'],
  ['n12-08', '20-x'],
  ['n12-09', 'x\\in\\mathbb Z,\\ 0\\le x\\le20'],
  ['n12-10', '50+180x+130(20-x)'],
  ['n12-11', '3200\\le50+180x+130(20-x)<3300'],
  ['n12-12a', '50+180x+2600-130x'],
  ['n12-12', '3200\\le2650+50x<3300'],
  ['n12-13a', '550\\le50x<650'],
  ['n12-13', '11\\le x<13'],
  ['n12-14', 'x=11\\ \\text{または}\\ 12'],
  ['n12-15', 'T(11)=3200\\text{円},\\ T(12)=3250\\text{円}'],
]

async function answer(page: Page, id: string, value: string) {
  const trigger = page.getByTestId('textbook-item-' + id)
  await expect(trigger).toBeVisible()
  await trigger.click()
  const panel = page.getByTestId('inline-choice-panel-' + id)
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: value, exact: true }).click()
  await expect(page.getByTestId('resolved-' + id)).toBeVisible()
}

test('N12 correction: 21 progressive decisions, no early figures, wrong feedback, mobile/desktop and restore', async ({ page }) => {
  test.setTimeout(90_000)
  await page.goto(path)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
  const f01 = page.getByTestId('textbook-figure-n12-f01')
  const f02 = page.getByTestId('textbook-figure-n12-f02')
  const f03 = page.getByTestId('textbook-figure-n12-f03')
  await expect(f01).toHaveCount(0)
  await expect(f02).toHaveCount(0)
  await expect(f03).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n12-01')).toHaveCount(0)

  // A wrong inequality reversal must not unlock the old final answer.
  await page.getByTestId('textbook-item-n12-01a').click()
  const firstPanel = page.getByTestId('inline-choice-panel-n12-01a')
  await expect(firstPanel).toBeVisible()
  const displayedOptions = firstPanel.locator('.reading-choice-option')
  let wrongClicked = false
  for (let index = 0; index < await displayedOptions.count(); index += 1) {
    const option = displayedOptions.nth(index)
    if (await option.getAttribute('aria-label') === '-7<2x') continue
    await option.click()
    wrongClicked = true
    break
  }
  expect(wrongClicked).toBe(true)
  await expect(page.getByTestId('resolved-n12-01a')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n12-01')).toHaveCount(0)

  for (const [id, choice] of choices) {
    await answer(page, id, choice)
    if (id === 'n12-02') {
      await expect(f01).toBeVisible()
      await expect(f02).toHaveCount(0)
    }
    if (id === 'n12-06') {
      await expect(f02).toBeVisible()
      await expect(f03).toHaveCount(0)
    }
    if (id === 'n12-14') {
      await expect(f03).toHaveCount(0)
    }
    if (id === 'n12-15') {
      await expect(f03).toBeVisible()
      await expect(f03.locator('img')).toHaveJSProperty('complete', true)
    }
    await expect(page.locator('.katex-error')).toHaveCount(0)
  }
  for (const id of ['solve-first', 'solve-second', 'triple-solve', 'cost-range']) {
    await expect(page.locator('[data-derivation-id="' + id + '"]')).toHaveCount(1)
  }
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  const viewport = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }))
  expect(viewport.content).toBeLessThanOrEqual(viewport.client + 1)

  await page.reload()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.getByTestId('resolved-n12-01a')).toBeVisible()
  await expect(f03).toBeVisible()
})
