import { expect, test, type Page } from '@playwright/test'

// W-MATH-008/P-001: 15 original + 11 P-002 + 9 P-003 = 35 active stages.
const path = '/kyotsu-step-web/e2e/fixtures/historical-math.html#/learning/textbook/math-numbers-expressions-n12'

test.beforeEach(({ page }, info) => {
  void page
  if (!info.title.startsWith('N12 current r4:')) info.annotations.push({ type: 'historical-edition', description: '171c archival Page + pinned shared runtime; not current Page coverage' })
})
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
  ['n12-p003-q10-meaning', '箱と20個の菓子の合計金額'],
  ['n12-p003-q10-cream-coef', '180'],
  ['n12-p003-q10-pudding-coef', '130'],
  ['n12-p003-q10-box-fee', '50'],
  ['n12-10', '50+180x+130(20-x)'],
  ['n12-p003-q11-lower-sign', '\\le'],
  ['n12-p003-q11-upper-sign', '<'],
  ['n12-11', '3200\\le50+180x+130(20-x)<3300'],
  ['n12-p003-q12-product-constant', '2600'],
  ['n12-p002-q12-signed-coef', '-130'],
  ['n12-p003-q12-total-constant', '2650'],
  ['n12-p003-q12-x-coef', '50'],
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
  if (id.startsWith('n12-p002-') || (id.startsWith('n12-p003-') && id !== 'n12-p003-q10-meaning' && id !== 'n12-p003-q10-box-fee')) {
    await expect(trigger).toHaveClass(/reading-formula-choice--token/)
    await expect(trigger).toContainText(/選択|×/)
  }
  await trigger.click()
  const panel = page.getByTestId('inline-choice-panel-' + id)
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: value, exact: true }).click()
  await expect(page.getByTestId('resolved-' + id)).toBeVisible()
}

test('N12 P-003: 35 progressive inline holes, math, figure gates, retry and reload', async ({ page }) => {
  test.setTimeout(150_000)
  await page.goto(path)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
  await expect(page.getByTestId('n12-restart-top')).toBeVisible()
  expect(choices).toHaveLength(35);
  const f01 = page.getByTestId('textbook-figure-n12-f01')
  const f02 = page.getByTestId('textbook-figure-n12-f02')
  const f03 = page.getByTestId('textbook-figure-n12-f03')
  await expect(f01).toHaveCount(0)
  await expect(f02).toHaveCount(0)
  await expect(f03).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n12-01')).toHaveCount(0)

  // Visual-only W-MATH-006/P-001: N02-style label/border, retained 44px touch target.
  const firstToken = page.getByTestId('textbook-item-n12-p002-q01-coef')
  await expect(firstToken).toHaveText('選択')
  const tokenBox = await firstToken.boundingBox()
  expect(tokenBox?.width).toBeGreaterThanOrEqual(44)
  expect(tokenBox?.height).toBeGreaterThanOrEqual(44)
  const tokenBorder = await firstToken.evaluate((element) => {
    const style = getComputedStyle(element)
    return { radius: style.borderRadius, top: style.borderTopWidth }
  })
  expect(tokenBorder).toEqual({ radius: '0px', top: '1px' })
  await firstToken.focus()
  await expect(firstToken).toBeFocused()

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
    if (id === 'n12-p002-q01-coef' || id === 'n12-p002-q02-coef') {
      // Coefficients other than 1 must remain explicit before x.
      await expect(page.getByTestId('resolved-' + id).locator('.katex-html')).toHaveText('2')
    }
    if (id === 'n12-p002-q02-const') {
      // A numeric answer 1 at the end of an expression must remain 1.
      await expect(page.getByTestId('resolved-n12-p002-q02-const').locator('.katex-html')).toHaveText('1')
    }
    if (id === 'n12-p002-q06-left-coef') {
      // W-MATH-007: retain answer "1" internally, but the rendered formula reads x+2, never 1x.
      const solved = page.getByTestId('resolved-n12-p002-q06-left-coef')
      await expect(solved.locator('.katex-html')).toHaveText('x')
      await expect(solved).toHaveAttribute('aria-label', '係数は1（式ではx）')
      const visibleParts = await page
        .getByTestId('textbook-formula-formula-q06-left-coef')
        .locator('.katex-html').allInnerTexts()
      const visibleFormula = visibleParts.join('').replace(/\s+/g, '')
      expect(visibleFormula).toContain('x+2')
      expect(visibleFormula).not.toContain('1x')
      expect(visibleFormula).not.toContain('xx+2')
      const savedAnswer = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('kyotsu-step-store') || '{}')
          .state.textbookProgress['math-numbers-expressions-n12']
          .answers['n12-p002-q06-left-coef'].value,
      )
      expect(savedAnswer).toBe('1')
    }
    if (id === 'n12-p002-q06-right-coef') {
      await expect(page.getByTestId('resolved-n12-p002-q06-right-coef').locator('.katex-html')).toHaveText('3')
    }
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
    const overflowing = await page.locator('.reading-formula-line--n12').evaluateAll(lines =>
      lines.filter(line => line.scrollWidth > line.clientWidth + 2)
        .map(line => line.getAttribute('data-testid')),
    )
    expect(overflowing, 'No inner formula horizontal scrollbar').toEqual([])
  }

  for (const derivation of ['solve-first', 'solve-second', 'triple-solve', 'cost-range']) {
    await expect(page.locator('[data-derivation-id="' + derivation + '"]')).toHaveCount(1)
  }
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()

  // Approved W-MATH-008/P-001 visual contract: all three phone widths,
  // including every formula's *internal* scroll (document-only is insufficient).
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 760 })
    const overflow = await page.locator('.reading-formula-line--n12').evaluateAll(lines =>
      lines.filter(line => line.scrollWidth > line.clientWidth + 2)
        .map(line => line.getAttribute('data-testid')),
    )
    expect(overflow, `N12 formula overflow at ${width}px`).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(await page.evaluate(() => document.documentElement.clientWidth + 1))
    await expect(page.locator('.katex-error')).toHaveCount(0)
  }
  await page.reload()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.getByTestId('resolved-n12-p002-q01-coef')).toBeVisible()
  await expect(page.getByTestId('resolved-n12-p002-q06-left-coef').locator('.katex-html')).toHaveText('x')
  await expect(f03).toBeVisible()
})

test('N12 P-003: v1 history is archived and a genuine restart begins at Q01', async ({ page }) => {
  await page.goto('/kyotsu-step-web/e2e/fixtures/historical-math-data.json')
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
  await page.goto(path)
  await expect(page.getByTestId('n12-progress-upgrade-note')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n12-p002-q01-coef')).toBeVisible()
  await expect(page.getByTestId('resolved-n12-01')).toHaveCount(0)

  await answer(page, 'n12-p002-q01-coef', '2')
  await answer(page, 'n12-p002-q01-const', '-7')
  await expect(page.getByTestId('textbook-item-n12-01')).toBeVisible()
  await answer(page, 'n12-01', 'x>-\\frac72')
  await expect(page.getByTestId('textbook-item-n12-p002-q02-coef')).toBeVisible()

  const saved = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('kyotsu-step-store') || '{}').state
    return state.textbookProgress['math-numbers-expressions-n12']
  })
  expect(saved.unitRevision).toBe(3)
  expect(saved.migratedFromRevision).toBe(1)
  expect(saved.previousRevisionCompletedAt).toBe(250)
  expect(saved.completedAt).toBeUndefined()
  expect(saved.archivedRevisions['1'].answers['n12-01'].value).toBe('x>-\\frac72')
  expect(saved.archivedRevisions['1'].answers['n12-01a'].value).toBe('-7<2x')
  expect(saved.answers['n12-p002-q01-coef'].value).toBe('2')
  await page.reload()
  await expect(page.getByTestId('resolved-n12-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n12-p002-q02-coef')).toBeVisible()

  page.once('dialog', dialog => dialog.accept())
  await page.getByTestId('n12-restart-top').click()
  await expect(page.getByTestId('textbook-item-n12-p002-q01-coef')).toBeVisible()
  await expect(page.getByTestId('resolved-n12-01')).toHaveCount(0)
  const afterReset = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('kyotsu-step-store') || '{}').state
      .textbookProgress['math-numbers-expressions-n12'],
  )
  expect(afterReset.unitRevision).toBe(3)
  expect(afterReset.answers).toEqual({})
  expect(afterReset.archivedRevisions['1']).toEqual(saved.archivedRevisions['1'])
  await page.reload()
  await expect(page.getByTestId('textbook-item-n12-p002-q01-coef')).toBeVisible()
})


// Current r4 ordinary-route coverage is independent of the historical fixture above.
// Expected46 interactions/15 stages frozen from accepted n12Authored.json at84f90ba9.
const currentR4 = [
  {
    "id": "n12-q01-subtract-x",
    "stage": "n12-stage-01",
    "answer": "x",
    "afterIds": [
      "n12-q01-subtract-x-equation",
      "n12-q01-subtract-x-after"
    ]
  },
  {
    "id": "n12-p002-q01-coef",
    "stage": "n12-stage-01",
    "answer": "2",
    "afterIds": [
      "n12-p002-q01-coef-equation",
      "n12-p002-q01-coef-after"
    ]
  },
  {
    "id": "n12-p002-q01-const",
    "stage": "n12-stage-01",
    "answer": "-7",
    "afterIds": [
      "n12-p002-q01-const-equation",
      "n12-p002-q01-const-after"
    ]
  },
  {
    "id": "n12-01",
    "stage": "n12-stage-01",
    "answer": "x>-\\frac72",
    "afterIds": [
      "n12-01-equation",
      "n12-01-after"
    ]
  },
  {
    "id": "n12-p002-q02-coef",
    "stage": "n12-stage-02",
    "answer": "2",
    "afterIds": [
      "n12-p002-q02-coef-equation",
      "n12-p002-q02-coef-after"
    ]
  },
  {
    "id": "n12-p002-q02-const",
    "stage": "n12-stage-02",
    "answer": "1",
    "afterIds": [
      "n12-p002-q02-const-equation",
      "n12-p002-q02-const-after"
    ]
  },
  {
    "id": "n12-02",
    "stage": "n12-stage-02",
    "answer": "x\\le\\frac12",
    "afterIds": [
      "n12-02-equation",
      "n12-02-after"
    ]
  },
  {
    "id": "n12-q03-first",
    "stage": "n12-stage-03",
    "answer": "<",
    "afterIds": [
      "n12-q03-first-equation",
      "n12-q03-first-after"
    ]
  },
  {
    "id": "n12-q03-second",
    "stage": "n12-stage-03",
    "answer": "成り立たない",
    "afterIds": [
      "n12-q03-second-result",
      "n12-q03-second-after"
    ]
  },
  {
    "id": "n12-03",
    "stage": "n12-stage-03",
    "answer": "二つ目に反するので不適",
    "afterIds": [
      "n12-03-result",
      "n12-03-after"
    ]
  },
  {
    "id": "n12-q04-left-end",
    "stage": "n12-stage-04",
    "answer": "<",
    "afterIds": [
      "n12-q04-left-end-equation",
      "n12-q04-left-end-after"
    ]
  },
  {
    "id": "n12-04",
    "stage": "n12-stage-04",
    "answer": "-\\frac72<x\\le\\frac12",
    "afterIds": [
      "n12-04-equation",
      "n12-04-after"
    ]
  },
  {
    "id": "n12-05",
    "stage": "n12-stage-05",
    "answer": "3x+2\\le2x+4\\ \\text{かつ}\\ 2x+4\\le9-x",
    "afterIds": [
      "n12-05-equation",
      "n12-05-after"
    ]
  },
  {
    "id": "n12-p002-q06-left-coef",
    "stage": "n12-stage-06",
    "answer": "1",
    "afterIds": [
      "n12-p002-q06-left-coef-equation",
      "n12-p002-q06-left-coef-after"
    ]
  },
  {
    "id": "n12-p002-q06-left-const",
    "stage": "n12-stage-06",
    "answer": "2",
    "afterIds": [
      "n12-p002-q06-left-const-equation",
      "n12-p002-q06-left-const-after"
    ]
  },
  {
    "id": "n12-p002-q06-right-coef",
    "stage": "n12-stage-06",
    "answer": "3",
    "afterIds": [
      "n12-p002-q06-right-coef-equation",
      "n12-p002-q06-right-coef-after"
    ]
  },
  {
    "id": "n12-p002-q06-right-const",
    "stage": "n12-stage-06",
    "answer": "5",
    "afterIds": [
      "n12-p002-q06-right-const-equation",
      "n12-p002-q06-right-const-after"
    ]
  },
  {
    "id": "n12-06",
    "stage": "n12-stage-06",
    "answer": "x\\le2,\\quad x\\le\\frac53",
    "afterIds": [
      "n12-06-equation",
      "n12-06-after"
    ]
  },
  {
    "id": "n12-q07-boundary",
    "stage": "n12-stage-07",
    "answer": "成り立たない",
    "afterIds": [
      "n12-q07-boundary-result",
      "n12-q07-boundary-after"
    ]
  },
  {
    "id": "n12-07",
    "stage": "n12-stage-07",
    "answer": "x\\le\\frac53",
    "afterIds": [
      "n12-07-equation",
      "n12-07-after"
    ]
  },
  {
    "id": "n12-08",
    "stage": "n12-stage-08",
    "answer": "20-x",
    "afterIds": [
      "n12-08-equation",
      "n12-08-after"
    ]
  },
  {
    "id": "n12-09",
    "stage": "n12-stage-09",
    "answer": "x\\in\\mathbb Z,\\ 0\\le x\\le20",
    "afterIds": [
      "n12-09-equation",
      "n12-09-after"
    ]
  },
  {
    "id": "n12-p003-q10-meaning",
    "stage": "n12-stage-10",
    "answer": "箱と20個の菓子の合計金額",
    "afterIds": [
      "n12-p003-q10-meaning-result",
      "n12-p003-q10-meaning-after"
    ]
  },
  {
    "id": "n12-p003-q10-cream-coef",
    "stage": "n12-stage-10",
    "answer": "180",
    "afterIds": [
      "n12-p003-q10-cream-coef-equation",
      "n12-p003-q10-cream-coef-after"
    ]
  },
  {
    "id": "n12-p003-q10-pudding-coef",
    "stage": "n12-stage-10",
    "answer": "130",
    "afterIds": [
      "n12-p003-q10-pudding-coef-equation",
      "n12-p003-q10-pudding-coef-after"
    ]
  },
  {
    "id": "n12-p003-q10-box-fee",
    "stage": "n12-stage-10",
    "answer": "50",
    "afterIds": [
      "n12-p003-q10-box-fee-equation",
      "n12-p003-q10-box-fee-after"
    ]
  },
  {
    "id": "n12-10",
    "stage": "n12-stage-10",
    "answer": "50+180x+130(20-x)",
    "afterIds": [
      "n12-10-equation",
      "n12-10-after"
    ]
  },
  {
    "id": "n12-p003-q11-lower-sign",
    "stage": "n12-stage-11",
    "answer": "\\le",
    "afterIds": [
      "n12-p003-q11-lower-sign-equation",
      "n12-p003-q11-lower-sign-after"
    ]
  },
  {
    "id": "n12-p003-q11-upper-sign",
    "stage": "n12-stage-11",
    "answer": "<",
    "afterIds": [
      "n12-p003-q11-upper-sign-equation",
      "n12-p003-q11-upper-sign-after"
    ]
  },
  {
    "id": "n12-11",
    "stage": "n12-stage-11",
    "answer": "3200\\le50+180x+130(20-x)<3300",
    "afterIds": [
      "n12-11-equation",
      "n12-11-after"
    ]
  },
  {
    "id": "n12-p003-q12-product-constant",
    "stage": "n12-stage-12",
    "answer": "2600",
    "afterIds": [
      "n12-p003-q12-product-constant-equation",
      "n12-p003-q12-product-constant-after"
    ]
  },
  {
    "id": "n12-p002-q12-signed-coef",
    "stage": "n12-stage-12",
    "answer": "-130",
    "afterIds": [
      "n12-p002-q12-signed-coef-equation",
      "n12-p002-q12-signed-coef-after"
    ]
  },
  {
    "id": "n12-p003-q12-total-constant",
    "stage": "n12-stage-12",
    "answer": "2650",
    "afterIds": [
      "n12-p003-q12-total-constant-equation",
      "n12-p003-q12-total-constant-after"
    ]
  },
  {
    "id": "n12-p003-q12-x-coef",
    "stage": "n12-stage-12",
    "answer": "50",
    "afterIds": [
      "n12-p003-q12-x-coef-equation",
      "n12-p003-q12-x-coef-after"
    ]
  },
  {
    "id": "n12-12",
    "stage": "n12-stage-12",
    "answer": "3200\\le2650+50x<3300",
    "afterIds": [
      "n12-12-equation",
      "n12-12-after"
    ]
  },
  {
    "id": "n12-q13-operation",
    "stage": "n12-stage-13",
    "answer": "2650",
    "afterIds": [
      "n12-q13-operation-equation",
      "n12-q13-operation-after"
    ]
  },
  {
    "id": "n12-p002-q13-lower",
    "stage": "n12-stage-13",
    "answer": "550",
    "afterIds": [
      "n12-p002-q13-lower-equation",
      "n12-p002-q13-lower-after"
    ]
  },
  {
    "id": "n12-p002-q13-upper",
    "stage": "n12-stage-13",
    "answer": "650",
    "afterIds": [
      "n12-p002-q13-upper-equation",
      "n12-p002-q13-upper-after"
    ]
  },
  {
    "id": "n12-q13-lower-divide",
    "stage": "n12-stage-13",
    "answer": "11",
    "afterIds": [
      "n12-q13-lower-divide-equation",
      "n12-q13-lower-divide-after"
    ]
  },
  {
    "id": "n12-q13-upper-divide",
    "stage": "n12-stage-13",
    "answer": "13",
    "afterIds": [
      "n12-q13-upper-divide-equation",
      "n12-q13-upper-divide-after"
    ]
  },
  {
    "id": "n12-13",
    "stage": "n12-stage-13",
    "answer": "11\\le x<13",
    "afterIds": [
      "n12-13-equation",
      "n12-13-after"
    ]
  },
  {
    "id": "n12-q14-integer",
    "stage": "n12-stage-14",
    "answer": "11,\\ 12",
    "afterIds": [
      "n12-q14-integer-equation-0",
      "n12-q14-integer-after"
    ]
  },
  {
    "id": "n12-14",
    "stage": "n12-stage-14",
    "answer": "x=11\\ \\text{または}\\ 12",
    "afterIds": [
      "n12-14-equation",
      "n12-14-after"
    ]
  },
  {
    "id": "n12-q15-eleven",
    "stage": "n12-stage-15",
    "answer": "3200",
    "afterIds": [
      "n12-q15-eleven-equation",
      "n12-q15-eleven-after"
    ]
  },
  {
    "id": "n12-q15-twelve",
    "stage": "n12-stage-15",
    "answer": "3250",
    "afterIds": [
      "n12-q15-twelve-equation",
      "n12-q15-twelve-after"
    ]
  },
  {
    "id": "n12-15",
    "stage": "n12-stage-15",
    "answer": "T(11)=3200\\text{円},\\ T(12)=3250\\text{円}",
    "afterIds": [
      "n12-15-equation",
      "n12-15-after"
    ]
  }
] as const

test('N12 current r4: ordinary route,46 decisions,15 stages,wrong gate,completion and reload', async ({ page }) => {
  test.setTimeout(150_000)
  await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n12')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  expect(currentR4).toHaveLength(46)
  expect(new Set(currentR4.map(row => row.stage)).size).toBe(15)
  // The ordinary entry loads App lazily; await actual reader bootstrap, not the HTML loading shell.
  await expect(page.getByTestId('textbook-reading-flow')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByTestId('math-textbook-stage-n12-stage-01')).toBeVisible()
  await expect(page.getByTestId('guided-source-question')).toContainText('同時に満たす')
  await expect(page.getByTestId('textbook-item-n12-p002-q01-coef')).toHaveCount(0)
  const first = page.getByTestId('textbook-item-n12-q01-subtract-x')
  await first.click()
  const firstPanel = page.getByTestId('inline-choice-panel-n12-q01-subtract-x')
  await firstPanel.getByRole('button', { name: '2', exact: true }).click()
  await expect(page.getByTestId('textbook-hint-n12-q01-subtract-x')).toBeVisible()
  await expect(page.locator('[data-block-id="n12-q01-subtract-x-equation"]')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n12-p002-q01-coef')).toHaveCount(0)
  let stage = currentR4[0].stage as string
  let transitions = 0
  for (const row of currentR4) {
    if (row.stage !== stage) {
      await expect(page.getByTestId('math-textbook-next-stage')).toBeVisible()
      await page.getByTestId('math-textbook-next-stage').click()
      stage = row.stage
      transitions += 1
    }
    await expect(page.getByTestId('math-textbook-stage-' + row.stage)).toBeVisible()
    await page.getByTestId('textbook-item-' + row.id).click()
    await page.getByTestId('inline-choice-panel-' + row.id).getByRole('button', { name: row.answer, exact: true }).click()
    await expect(page.getByTestId('textbook-item-' + row.id)).toHaveCount(0)
    for (const blockId of row.afterIds) {
      await expect(page.locator('[data-block-id="' + blockId + '"]')).toBeVisible()
    }
    await expect(page.locator('.katex-error')).toHaveCount(0)
  }
  expect(transitions).toBe(14)
  await expect(page.getByTestId('n12-complete')).toBeVisible()
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('kyotsu-step-store') || '{}').state.textbookProgress['math-numbers-expressions-n12'])
  expect(saved.unitRevision).toBe(4)
  expect(Object.keys(saved.answers)).toHaveLength(46)
  expect(saved.answers['n12-q01-subtract-x'].attemptCount).toBe(2)
  expect(saved.completedAt).toBeGreaterThan(0)
  await page.reload()
  await expect(page.getByTestId('textbook-reading-flow')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByTestId('n12-complete')).toBeVisible()
  await expect(page.locator('[data-block-id="n12-15-equation"]')).toBeVisible()
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'この単元を最初から', exact: true }).first().click()
  await expect(page.getByTestId('textbook-item-n12-q01-subtract-x')).toBeVisible()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kyotsu-step-store') || '{}').state.textbookProgress['math-numbers-expressions-n12'])).toBeUndefined()
  await page.reload()
  await expect(page.getByTestId('textbook-item-n12-q01-subtract-x')).toBeVisible({ timeout: 30_000 })
})
