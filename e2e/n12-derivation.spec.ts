import { expect, test, type Page } from '@playwright/test'

// P-002: source 15 decisions unchanged; 11 local algebra tokens add 26 total.
const path = '/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n12'
const choices: Array<[string, string]> = [
  ['n12-p002-q01-coef', '2'],
  ['n12-p002-q01-const', '-7'],
  ['n12-01', 'x>-\\frac72'],
  ['n12-p002-q02-coef', '2'],
  ['n12-p002-q02-const', '1'],
  ['n12-02', 'x\\le\\frac12'],
  ['n12-03', '二つ目に反するので不適'],
  ['n12-04', '-\\frac72<x\\le\\frac12'],
  ['n12-05', '3x+2\\le2x+4\\ \\text{かつ}\\ 2x+4\\le9-x'],
  ['n12-p002-q06-left-coef', '1'],
  ['n12-p002-q06-left-const', '2'],
  ['n12-p002-q06-right-coef', '3'],
  ['n12-p002-q06-right-const', '5'],
  ['n12-06', 'x\\le2,\\quad x\\le\\frac53'],
  ['n12-07', 'x\\le\\frac53'],
  ['n12-08', '20-x'],
  ['n12-09', 'x\\in\\mathbb Z,\\ 0\\le x\\le20'],
  ['n12-10', '50+180x+130(20-x)'],
  ['n12-11', '3200\\le50+180x+130(20-x)<3300'],
  ['n12-p002-q12-signed-coef', '-130'],
  ['n12-12', '3200\\le2650+50x<3300'],
  ['n12-p002-q13-lower', '550'],
  ['n12-p002-q13-upper', '650'],
  ['n12-13', '11\\le x<13'],
  ['n12-14', 'x=11\\ \\text{または}\\ 12'],
  ['n12-15', 'T(11)=3200\\text{円},\\ T(12)=3250\\text{円}'],
]

async function answer(page: Page, id: string, value: string) {
  const trigger = page.getByTestId('textbook-item-' + id)
  await expect(trigger).toBeVisible()
  if (id.startsWith('n12-p002-')) {
    await expect(trigger).toHaveClass(/reading-formula-choice--token/)
    await expect(trigger).toContainText(/□|×/)
  }
  await trigger.click()
  const panel = page.getByTestId('inline-choice-panel-' + id)
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: value, exact: true }).click()
  await expect(page.getByTestId('resolved-' + id)).toBeVisible()
}

test('N12 P-002: 26 progressive inline holes, math, figure gates, retry and reload', async ({ page }) => {
  test.setTimeout(150_000)
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

  // Wrong coefficient: cannot unlock either the next local constant or original final question.
  await page.getByTestId('textbook-item-n12-p002-q01-coef').click()
  const panel = page.getByTestId('inline-choice-panel-n12-p002-q01-coef')
  await expect(panel).toBeVisible()
  const displayedOptions = panel.locator('.reading-choice-option')
  let wrongClicked = false
  for (let i = 0; i < await displayedOptions.count(); i += 1) {
    const option = displayedOptions.nth(i)
    if (await option.getAttribute('aria-label') === '2') continue
    await option.click()
    wrongClicked = true
    break
  }
  expect(wrongClicked).toBe(true)
  await expect(page.getByTestId('resolved-n12-p002-q01-coef')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n12-p002-q01-const')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n12-01')).toHaveCount(0)

  for (const [id, value] of choices) {
    await answer(page, id, value)
    if (id === 'n12-02') {
      await expect(f01).toBeVisible()
      await expect(f02).toHaveCount(0)
    }
    if (id === 'n12-06') {
      await expect(f02).toBeVisible()
      await expect(f03).toHaveCount(0)
    }
    if (id === 'n12-14') await expect(f03).toHaveCount(0)
    if (id === 'n12-15') {
      await expect(f03).toBeVisible()
      await expect(f03.locator('img')).toHaveJSProperty('complete', true)
    }
    await expect(page.locator('.katex-error')).toHaveCount(0)
  }

  for (const derivation of ['solve-first', 'solve-second', 'triple-solve', 'cost-range']) {
    await expect(page.locator('[data-derivation-id="' + derivation + '"]')).toHaveCount(1)
  }
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(await page.evaluate(() => document.documentElement.clientWidth + 1))
  await page.reload()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.getByTestId('resolved-n12-p002-q01-coef')).toBeVisible()
  await expect(f03).toBeVisible()
})

test('N12 P-002: old v1 progress keeps source answers and archives supplemental history', async ({ page }) => {
  await page.goto(path)
  await page.evaluate(() => {
    localStorage.clear()
    const record = (id: string, value: string) => ({
      itemId: id, value, firstValue: value, isFirstCorrect: true, resolved: true,
      attemptCount: 1, firstAnsweredAt: 100, lastAnsweredAt: 200,
    })
    const progress = {
      unitId: 'math-numbers-expressions-n12', unitRevision: 1,
      startedAt: 100, updatedAt: 200, completedAt: 250,
      answers: {
        'n12-01': record('n12-01', 'x>-\\frac72'),
        'n12-01a': record('n12-01a', '-7<2x'),
      },
    }
    localStorage.setItem('kyotsu-step-store', JSON.stringify({
      state: { textbookProgress: { [progress.unitId]: progress } }, version: 1,
    }))
  })
  await page.reload()
  await expect(page.getByTestId('n12-progress-upgrade-note')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n12-p002-q01-coef')).toBeVisible()
  await expect(page.getByTestId('resolved-n12-01')).toHaveCount(0)

  await answer(page, 'n12-p002-q01-coef', '2')
  await answer(page, 'n12-p002-q01-const', '-7')
  await expect(page.getByTestId('resolved-n12-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n12-p002-q02-coef')).toBeVisible()

  const saved = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('kyotsu-step-store') || '{}').state
    return state.textbookProgress['math-numbers-expressions-n12']
  })
  expect(saved.unitRevision).toBe(2)
  expect(saved.migratedFromRevision).toBe(1)
  expect(saved.previousRevisionCompletedAt).toBe(250)
  expect(saved.completedAt).toBeUndefined()
  expect(saved.answers['n12-01'].value).toBe('x>-\\frac72')
  expect(saved.answers['n12-01a'].value).toBe('-7<2x')
  expect(saved.answers['n12-p002-q01-coef'].value).toBe('2')
  await page.reload()
  await expect(page.getByTestId('resolved-n12-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n12-p002-q02-coef')).toBeVisible()
})
