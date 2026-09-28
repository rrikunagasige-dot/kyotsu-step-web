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

async function seed1CProgress(
  page: import('@playwright/test').Page,
  itemIds: string[],
) {
  const answers = Object.fromEntries(
    itemIds.map((itemId) => [itemId, {
      itemId,
      value: 'seeded',
      firstValue: 'seeded',
      isFirstCorrect: true,
      resolved: true,
      attemptCount: 1,
      firstAnsweredAt: 1,
      lastAnsweredAt: 1,
    }]),
  )

  await page.evaluate((seededAnswers) => {
    localStorage.setItem('kyotsu-step-store', JSON.stringify({
      state: {
        textbookProgress: {
          'physics-1c-relative-velocity': {
            unitId: 'physics-1c-relative-velocity',
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

async function seedCompleted1CConceptSection(page: import('@playwright/test').Page) {
  await seed1CProgress(page, ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6'])
}

async function seedCompleted1DConceptSection(page: import('@playwright/test').Page) {
  const itemIds = Array.from({ length: 8 }, (_, index) => `d1-${index + 1}`)
  const answers = Object.fromEntries(
    itemIds.map((itemId) => [itemId, {
      itemId,
      value: 'seeded',
      firstValue: 'seeded',
      isFirstCorrect: true,
      resolved: true,
      attemptCount: 1,
      firstAnsweredAt: 1,
      lastAnsweredAt: 1,
    }]),
  )

  await page.evaluate((seededAnswers) => {
    localStorage.setItem('kyotsu-step-store', JSON.stringify({
      state: {
        textbookProgress: {
          'physics-1d-acceleration': {
            unitId: 'physics-1d-acceleration',
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


async function seedCompleted1EConceptSection(page: import('@playwright/test').Page) {
  const itemIds = Array.from({ length: 8 }, (_, index) => 'e1-' + String(index + 1))
  const answers = Object.fromEntries(
    itemIds.map((itemId) => [itemId, {
      itemId,
      value: 'seeded',
      firstValue: 'seeded',
      isFirstCorrect: true,
      resolved: true,
      attemptCount: 1,
      firstAnsweredAt: 1,
      lastAnsweredAt: 1,
    }]),
  )

  await page.evaluate((seededAnswers) => {
    localStorage.setItem('kyotsu-step-store', JSON.stringify({
      state: {
        textbookProgress: {
          'physics-1e-horizontal-projectile': {
            unitId: 'physics-1e-horizontal-projectile',
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
  await expect(page.getByTestId('textbook-unit-physics-1c-relative-velocity')).toBeVisible()
  await expect(page.getByTestId('textbook-unit-physics-1d-acceleration')).toBeVisible()
  await expect(page.getByTestId('textbook-unit-physics-1e-horizontal-projectile')).toBeVisible()
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



test('1B uses the supplied figures and resolves the composition hotspot on mobile', async ({ page }) => {
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

  const figureCard = page.getByTestId('textbook-figure-velocity-composition-figure')
  const figure = figureCard.getByAltText(/川を横切る船について/)
  await expect(figure).toBeVisible()
  await expect.poll(async () => figure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  const hotspot = page.getByTestId('textbook-figure-overlay-hotspot-d-1')
  await expect(hotspot).toBeVisible()

  const stageBox = await figureCard.locator('.textbook-figure-stage').boundingBox()
  const hotspotBox = await hotspot.boundingBox()
  expect(stageBox).not.toBeNull()
  expect(hotspotBox).not.toBeNull()
  expect(hotspotBox!.x).toBeGreaterThanOrEqual(stageBox!.x)
  expect(hotspotBox!.y).toBeGreaterThanOrEqual(stageBox!.y)
  expect(hotspotBox!.x + hotspotBox!.width).toBeLessThanOrEqual(stageBox!.x + stageBox!.width + 1)
  expect(hotspotBox!.y + hotspotBox!.height).toBeLessThanOrEqual(stageBox!.y + stageBox!.height + 1)

  await hotspot.click()
  const panel = page.getByTestId('inline-choice-panel-d-1')
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: '平行四辺形の対角線', exact: true }).click()

  await expect(panel).toHaveCount(0)
  await expect(hotspot).toHaveCount(0)

  const componentsFigure = page.getByAltText(/速度 v を x 成分/)
  await expect(componentsFigure).toBeVisible()
  await expect.poll(async () => componentsFigure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await expect(page.getByTestId('textbook-item-d-2')).toBeVisible()

  await page.reload()
  await expect(page.getByTestId('textbook-figure-overlay-hotspot-d-1')).toHaveCount(0)
})


test('1C uses both supplied relative-velocity figures and resolves the figure hotspot', async ({ page }) => {
  await page.goto(appRoute('/learning/setup'))
  await page.getByTestId('textbook-unit-physics-1c-relative-velocity').click()
  await expect(page.getByTestId('textbook-selection-summary')).toContainText('1C')
  await page.getByTestId('start-learning').click()

  await expect(page).toHaveURL(/physics-1c-relative-velocity/)
  await expect(page.getByTestId('textbook-item-c-1')).toBeVisible()
  await expect(page.getByRole('button', { name: /図の読み取り/ })).toBeDisabled()

  await page.goto(appRoute('/problems'))
  await seedCompleted1CConceptSection(page)
  await page.reload()
  await page.goto(appRoute('/learning/textbook/physics-1c-relative-velocity'))

  const figureSection = page.getByRole('button', { name: /図の読み取り/ })
  await expect(figureSection).toBeEnabled()
  await figureSection.click()

  const carsFigureCard = page.getByTestId('textbook-figure-relative-cars-figure')
  const carsFigure = carsFigureCard.getByAltText(/自動車 A と B/)
  await expect(carsFigure).toBeVisible()
  await expect.poll(async () => carsFigure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  const hotspot = page.getByTestId('textbook-figure-overlay-hotspot-d-2')
  await expect(hotspot).toBeVisible()
  const stageBox = await carsFigureCard.locator('.textbook-figure-stage').boundingBox()
  const hotspotBox = await hotspot.boundingBox()
  expect(stageBox).not.toBeNull()
  expect(hotspotBox).not.toBeNull()
  expect(hotspotBox!.x).toBeGreaterThanOrEqual(stageBox!.x)
  expect(hotspotBox!.y).toBeGreaterThanOrEqual(stageBox!.y)
  expect(hotspotBox!.x + hotspotBox!.width).toBeLessThanOrEqual(stageBox!.x + stageBox!.width + 1)
  expect(hotspotBox!.y + hotspotBox!.height).toBeLessThanOrEqual(stageBox!.y + stageBox!.height + 1)

  await hotspot.click()
  const panel = page.getByTestId('inline-choice-panel-d-2')
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: 'Aから見たBの速度', exact: true }).click()
  await expect(panel).toHaveCount(0)
  await expect(hotspot).toHaveCount(0)

  await page.goto(appRoute('/problems'))
  await seed1CProgress(page, [
    'c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6',
    'd-1', 'd-2',
    'q1-1', 'q1-2',
  ])
  await page.reload()
  await page.goto(appRoute('/learning/textbook/physics-1c-relative-velocity'))

  const example2Section = page.getByRole('button', { name: /例題2/ })
  await expect(example2Section).toBeEnabled()
  await example2Section.click()

  const rainFigure = page.getByAltText(/鉛直下向きに降る雨/)
  await expect(rainFigure).toBeVisible()
  await expect.poll(async () => rainFigure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
})


test('1D uses the acceleration source figures and resolves both figure questions', async ({ page }) => {
  await page.goto(appRoute('/learning/setup'))
  await page.getByTestId('textbook-unit-physics-1d-acceleration').click()
  await expect(page.getByTestId('textbook-selection-summary')).toContainText('1D')
  await page.getByTestId('start-learning').click()

  await expect(page).toHaveURL(/physics-1d-acceleration/)
  await expect(page.getByTestId('textbook-item-d1-1')).toBeVisible()
  await expect(page.getByRole('button', { name: /図の読み取り/ })).toBeDisabled()

  await page.goto(appRoute('/problems'))
  await seedCompleted1DConceptSection(page)
  await page.reload()
  await page.goto(appRoute('/learning/textbook/physics-1d-acceleration'))

  const figureSection = page.getByRole('button', { name: /図の読み取り/ })
  await expect(figureSection).toBeEnabled()
  await figureSection.click()

  const trajectoryFigure = page.getByAltText(/曲線上の P1 と P2/)
  await expect(trajectoryFigure).toBeVisible()
  await expect.poll(async () => trajectoryFigure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  const velocityChangeFigure = page.getByTestId('textbook-figure-velocity-change-figure')
  const velocityImage = velocityChangeFigure.getByAltText(/v1 と v2 の差として/)
  await expect(velocityImage).toBeVisible()
  await expect.poll(async () => velocityImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  const hotspot = page.getByTestId('textbook-figure-overlay-hotspot-d-1')
  await expect(hotspot).toBeVisible()
  await hotspot.click()
  const d1Panel = page.getByTestId('inline-choice-panel-d-1')
  await d1Panel.getByRole('button', { name: '速度の変化', exact: true }).click()
  await expect(hotspot).toHaveCount(0)

  const mask = page.getByTestId('textbook-figure-overlay-mask-d-2')
  await expect(mask).toBeVisible()
  await mask.click()
  const d2Panel = page.getByTestId('inline-choice-panel-d-2')
  await d2Panel.getByRole('button', { name: 'Δv', exact: true }).click()
  await expect(mask).toHaveCount(0)

  await page.reload()
  await expect(page.getByTestId('textbook-figure-overlay-hotspot-d-1')).toHaveCount(0)
  await expect(page.getByTestId('textbook-figure-overlay-mask-d-2')).toHaveCount(0)
})


test('1E uses both supplied horizontal-projectile figures and resolves the strobe questions', async ({ page }) => {
  await page.goto(appRoute('/learning/setup'))
  await page.getByTestId('textbook-unit-physics-1e-horizontal-projectile').click()
  await expect(page.getByTestId('textbook-selection-summary')).toContainText('1E')
  await page.getByTestId('start-learning').click()

  await expect(page).toHaveURL(/physics-1e-horizontal-projectile/)
  await expect(page.getByTestId('textbook-item-e1-1')).toBeVisible()
  await expect(page.getByRole('button', { name: /図の読み取り/ })).toBeDisabled()

  await page.goto(appRoute('/problems'))
  await seedCompleted1EConceptSection(page)
  await page.reload()
  await page.goto(appRoute('/learning/textbook/physics-1e-horizontal-projectile'))

  const figureSection = page.getByRole('button', { name: /図の読み取り/ })
  await expect(figureSection).toBeEnabled()
  await figureSection.click()

  const strobeCard = page.getByTestId('textbook-figure-horizontal-projectile-strobe-figure')
  const strobe = strobeCard.getByAltText(/等時間間隔の位置/)
  await expect(strobe).toBeVisible()
  await expect.poll(async () => strobe.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  const horizontalHotspot = page.getByTestId('textbook-figure-overlay-hotspot-d-1')
  const verticalHotspot = page.getByTestId('textbook-figure-overlay-hotspot-d-2')
  await expect(horizontalHotspot).toBeVisible()
  await expect(verticalHotspot).toBeVisible()

  const stageBox = await strobeCard.locator('.textbook-figure-stage').boundingBox()
  for (const hotspot of [horizontalHotspot, verticalHotspot]) {
    const box = await hotspot.boundingBox()
    expect(stageBox).not.toBeNull()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(stageBox!.x)
    expect(box!.y).toBeGreaterThanOrEqual(stageBox!.y)
    expect(box!.x + box!.width).toBeLessThanOrEqual(stageBox!.x + stageBox!.width + 1)
    expect(box!.y + box!.height).toBeLessThanOrEqual(stageBox!.y + stageBox!.height + 1)
  }

  await horizontalHotspot.click()
  const d1Panel = page.getByTestId('inline-choice-panel-d-1')
  await d1Panel.getByRole('button', { name: '一定', exact: true }).click()
  await expect(horizontalHotspot).toHaveCount(0)

  await verticalHotspot.click()
  const d2Panel = page.getByTestId('inline-choice-panel-d-2')
  await d2Panel.getByRole('button', { name: '大きくなる', exact: true }).click()
  await expect(verticalHotspot).toHaveCount(0)

  const velocityFigure = page.getByAltText(/速度 v を水平成分/)
  await expect(velocityFigure).toBeVisible()
  await expect.poll(async () => velocityFigure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  await page.reload()
  await expect(page.getByTestId('textbook-figure-overlay-hotspot-d-1')).toHaveCount(0)
  await expect(page.getByTestId('textbook-figure-overlay-hotspot-d-2')).toHaveCount(0)
})
