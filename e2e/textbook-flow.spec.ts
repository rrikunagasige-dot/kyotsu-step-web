import { expect, test } from '@playwright/test'

const appRoute = (path: string) => `/kyotsu-step-web/#${path}`


async function seedCompleted1BConceptSection(page: import('@playwright/test').Page) {
  const answers = Object.fromEntries(
    Array.from({ length: 7 }, (_, index) => {
      const itemId = `b-${index + 1}`
      return [itemId, {
        itemId,
        value: 'seeded',
        firstValue: 'seeded',
        isFirstCorrect: true,
        resolved: true,
        attemptCount: 1,
        firstAnsweredAt: 1,
        lastAnsweredAt: 1,
      }]
    }),
  )

  await page.evaluate((seededAnswers) => {
    localStorage.setItem('kyotsu-step-store', JSON.stringify({
      state: {
        textbookProgress: {
          'physics-1b-velocity-composition': {
            unitId: 'physics-1b-velocity-composition',
            unitRevision: 1,
            startedAt: 1,
            updatedAt: 1,
            answers: seededAnswers,
          },
        },
      },
      version: 1,
    }))
  }, answers)
}

async function seedCompletedConceptSection(page: import('@playwright/test').Page) {
  const answers = Object.fromEntries(
    Array.from({ length: 24 }, (_, index) => {
      const itemId = `a-${index + 1}`
      return [itemId, {
        itemId,
        value: 'seeded',
        firstValue: 'seeded',
        isFirstCorrect: true,
        resolved: true,
        attemptCount: 1,
        firstAnsweredAt: 1,
        lastAnsweredAt: 1,
      }]
    }),
  )

  await page.evaluate((seededAnswers) => {
    localStorage.setItem('kyotsu-step-store', JSON.stringify({
      state: {
        textbookProgress: {
          'physics-a-displacement-velocity': {
            unitId: 'physics-a-displacement-velocity',
            unitRevision: 3,
            startedAt: 1,
            updatedAt: 1,
            answers: seededAnswers,
          },
        },
      },
      version: 1,
    }))
  }, answers)
}

test.beforeEach(async ({ page }) => {
  await page.goto(appRoute('/problems'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('textbook setup exposes chapter and unit hierarchy before starting', async ({ page }) => {
  await page.goto(appRoute('/learning/setup'))

  await expect(page.getByText('第1章')).toBeVisible()
  await expect(page.getByText('物体の運動')).toBeVisible()
  await expect(page.getByTestId('textbook-unit-physics-a-displacement-velocity')).toBeVisible()
  await expect(page.getByTestId('textbook-unit-physics-1b-velocity-composition')).toBeVisible()
  await expect(page.getByTestId('textbook-selection-summary')).toContainText('1A')
})

test('textbook mode shows a full subsection and unlocks the next subsection after each blank is resolved', async ({ page }) => {
  await page.goto(appRoute('/learning/setup'))
  await page.getByTestId('start-learning').click()

  await expect(page.getByTestId('textbook-reading-flow')).toContainText('1-1')
  await expect(page.getByTestId('textbook-item-a-1')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-2')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-3')).toBeVisible()
  await expect(page.getByText('1-2　変位')).toHaveCount(0)

  for (const [itemId, answer] of [
    ['a-1', '位置ベクトル'],
    ['a-2', '位置'],
    ['a-3', '位置'],
  ] as const) {
    await page.getByTestId(`textbook-item-${itemId}`).click()
    const inlinePanel = page.getByTestId(`inline-choice-panel-${itemId}`)
    await expect(inlinePanel).toBeVisible()
    await inlinePanel.getByRole('button', { name: answer, exact: true }).click()
    await expect(inlinePanel).toHaveCount(0)
  }

  await expect(page.getByText('1-2　変位')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-4')).toBeVisible()
})

test('a wrong textbook choice stays red, cannot be retried, and reveals the correct answer immediately', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))

  await page.getByTestId('textbook-item-a-1').click()
  const panel = page.getByTestId('inline-choice-panel-a-1')
  await expect(panel).toBeVisible()

  const wrongOption = panel.getByRole('button', { name: '変位', exact: true })
  await wrongOption.click()

  await expect(panel).toBeVisible()
  await expect(wrongOption).toHaveClass(/reading-choice-option--wrong/)
  await expect(wrongOption).toBeDisabled()
  await expect(panel.getByRole('button', { name: '位置ベクトル', exact: true })).toHaveClass(/textbook-choice--correct/)
  await expect(panel.getByRole('button', { name: '位置ベクトル', exact: true })).toBeDisabled()
  await expect(page.getByTestId('answer-reveal-a-1')).toContainText('正解は「位置ベクトル」')
  await expect(page.getByTestId('resolved-a-1')).toContainText('変位')
  await expect(page.getByTestId('resolved-a-1')).toContainText('位置ベクトル')
  await expect(page.getByTestId('textbook-item-a-1')).toHaveCount(0)
})

test('future textbook sections stay locked until the current section is complete', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))
  await expect(page.getByRole('button', { name: /図の読み取り/ })).toBeDisabled()
  await expect(page.getByRole('button', { name: /例題1/ })).toBeDisabled()
})

test('opening a textbook blank keeps the sentence visible and expands choices directly underneath', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))

  const blank = page.getByTestId('textbook-item-a-1')
  await blank.click()

  await expect(page.getByText('原点 O から点')).toBeVisible()
  const panel = page.getByTestId('inline-choice-panel-a-1')
  await expect(panel).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})


test('real 1A figure loads and a masked label can be answered from the figure', async ({ page }) => {
  await page.goto(appRoute('/problems'))
  await seedCompletedConceptSection(page)
  await page.reload()
  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))

  const figureSection = page.getByRole('button', { name: /図の読み取り/ })
  await expect(figureSection).toBeEnabled()
  await figureSection.click()

  const figure = page.getByAltText(/位置ベクトル r1、r2 と変位/)
  await expect(figure).toBeVisible()
  await expect.poll(async () => figure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  const mask = page.getByTestId('textbook-figure-overlay-mask-d-16')
  await expect(mask).toBeVisible()
  await mask.click()

  const panel = page.getByTestId('inline-choice-panel-d-16')
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: 'r₁', exact: true }).click()

  await expect(panel).toHaveCount(0)
  await expect(mask).toHaveCount(0)

  await page.reload()
  await expect(page.getByTestId('textbook-figure-overlay-mask-d-16')).toHaveCount(0)
})



test('1B starts from the composition concept and loads the supplied composition figure', async ({ page }) => {
  await page.goto(appRoute('/learning/setup'))
  await page.getByTestId('textbook-unit-physics-1b-velocity-composition').click()
  await expect(page.getByTestId('textbook-selection-summary')).toContainText('1B')
  await page.getByTestId('start-learning').click()

  await expect(page).toHaveURL(/physics-1b-velocity-composition/)
  await expect(page.getByTestId('textbook-item-b-1')).toBeVisible()
  await expect(page.getByRole('button', { name: /図の読み取り/ })).toBeDisabled()

  await page.goto(appRoute('/problems'))
  await seedCompleted1BConceptSection(page)
  await page.reload()
  await page.goto(appRoute('/learning/textbook/physics-1b-velocity-composition'))

  const figureSection = page.getByRole('button', { name: /図の読み取り/ })
  await expect(figureSection).toBeEnabled()
  await figureSection.click()

  const figure = page.getByAltText(/川を横切る船について/)
  await expect(figure).toBeVisible()
  await expect.poll(async () => figure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await expect(page.getByTestId('textbook-figure-overlay-hotspot-d-1')).toBeVisible()
})
