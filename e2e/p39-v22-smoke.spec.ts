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

async function solveHoleByTryingChoices(page: Page, itemId: string) {
  const attempted = new Set<string>()

  for (let attempt = 0; attempt < 6; attempt += 1) {
    if (await page.getByTestId(`resolved-${itemId}`).count()) return

    const trigger = page.getByTestId(`textbook-item-${itemId}`)
    await expect(trigger).toBeVisible()
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()

    const panel = page.getByTestId(`inline-choice-panel-${itemId}`)
    await expect(panel).toBeVisible()
    const options = panel.locator('.reading-choice-option')
    const count = await options.count()

    let clicked = false
    for (let index = 0; index < count; index += 1) {
      const option = options.nth(index)
      const label = (await option.getAttribute('aria-label')) ?? ''
      if (attempted.has(label)) continue
      attempted.add(label)
      await option.click()
      clicked = true
      break
    }

    if (!clicked) throw new Error(`No untried choice remained for ${itemId}`)
    await page.waitForTimeout(80)
  }

  throw new Error(`Could not resolve textbook item ${itemId}`)
}

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
  await expect(panel).toContainText('図や本文から意味を考えよう')
  await expect(panel).not.toContainText('A1')
  await expect(panel.getByRole('button', { name: '位置', exact: true })).toBeVisible()
})

test('A1 shows a staged hint after a wrong attempt without revealing the answer', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))

  await page.getByTestId('textbook-item-a1').click()
  const panel = page.getByTestId('inline-choice-panel-a1')
  const buttons = panel.locator('.reading-choice-option')
  await expect(buttons).toHaveCount(2)

  for (let index = 0; index < await buttons.count(); index += 1) {
    const button = buttons.nth(index)
    if ((await button.getAttribute('aria-label')) !== '位置') {
      await button.click()
      break
    }
  }

  await page.getByTestId('textbook-item-a1').click()
  const hint = page.getByTestId('textbook-hint-a1')
  await expect(hint).toBeVisible()
  await expect(hint).toContainText('矢印の始点は原点')
  await expect(hint).not.toContainText('答え')
  await expect(hint).not.toContainText('位置')
})

test('first concept-forming figure is not upscaled beyond its intrinsic size', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))
  const figure = page.getByTestId('textbook-figure-fig-1')
  const image = figure.locator('img')

  await image.waitFor({ state: 'attached' })
  await page.waitForTimeout(500)

  const diagnostics = await image.evaluate((element) => {
    const img = element as HTMLImageElement
    const box = img.getBoundingClientRect()
    const parent = img.parentElement?.getBoundingClientRect()
    const style = getComputedStyle(img)
    return {
      src: img.currentSrc || img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: box.width,
      renderedHeight: box.height,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      parentWidth: parent?.width ?? -1,
      parentHeight: parent?.height ?? -1,
    }
  })
  console.log('[FIGURE-DIAG]', JSON.stringify(diagnostics))

  expect(diagnostics.complete).toBe(true)
  expect(diagnostics.naturalWidth).toBeGreaterThan(0)
  expect(diagnostics.renderedWidth).toBeGreaterThan(0)
  expect(diagnostics.renderedWidth).toBeLessThanOrEqual(diagnostics.naturalWidth + 1)
})


test('1A average-velocity calculation stays in one derivation frame', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-a-displacement-velocity'))

  for (const id of ['a1', 'a2', 'a3', 'a4', 'a6', 'a7', 'a8', 'a9c', 'a9', 'a9d', 'a9a', 'a9b', 'a10']) {
    await solveHoleByTryingChoices(page, id)
  }

  const chain = page.locator('[data-derivation-id="a-average-velocity-example"]')
  await expect(chain).toHaveCount(1)
  await expect(chain).toBeVisible()
  await expect(chain.locator('.reading-formula-line')).toHaveCount(9)

  const formulaBorders = await chain.locator('.reading-formula-line').evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).borderTopWidth),
  )
  expect(formulaBorders.every((width) => width === '0px')).toBe(true)

  const outerBorder = await chain.evaluate((element) => getComputedStyle(element).borderTopWidth)
  expect(outerBorder).not.toBe('0px')
  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('1B worked examples retrieve and apply formulas in continuous derivation frames', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-1b-velocity-composition'))

  for (const id of ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8']) {
    await solveHoleByTryingChoices(page, id)
  }

  const composition = page.locator('[data-derivation-id="b-velocity-composition-example"]')
  await expect(composition).toHaveCount(1)
  await expect(composition).toBeVisible()
  await expect(composition.locator('.reading-formula-line')).toHaveCount(6)

  const compositionBorders = await composition.locator('.reading-formula-line').evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).borderTopWidth),
  )
  expect(compositionBorders.every((width) => width === '0px')).toBe(true)

  const decomposition = page.locator('[data-derivation-id="b-velocity-decomposition-example"]')
  await expect(decomposition).toHaveCount(1)
  await expect(decomposition).toBeVisible()
  await expect(decomposition.locator('.reading-formula-line')).toHaveCount(3)

  const decompositionBorders = await decomposition.locator('.reading-formula-line').evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).borderTopWidth),
  )
  expect(decompositionBorders.every((width) => width === '0px')).toBe(true)

  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('1C rain example chooses the observer, applies relative velocity, and retrieves vector magnitude', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-1c-relative-velocity'))

  for (const id of ['c2', 'c3', 'c5', 'c4a', 'c4', 'c4b', 'c4c']) {
    await solveHoleByTryingChoices(page, id)
  }

  const chain = page.locator('[data-derivation-id="c-rain-relative-velocity-example"]')
  await expect(chain).toHaveCount(1)
  await expect(chain).toBeVisible()
  await expect(chain.locator('.reading-formula-line')).toHaveCount(6)

  const formulaBorders = await chain.locator('.reading-formula-line').evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).borderTopWidth),
  )
  expect(formulaBorders.every((width) => width === '0px')).toBe(true)

  await expect(page.locator('.katex-error')).toHaveCount(0)
  await expect(page.locator('img[src*="relative-rain-bicycle.webp"]')).toBeVisible()
})

test('1D actively derives constant-acceleration formulas with the approved v-t graph', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-1d-acceleration'))

  for (const id of [
    'd1', 'd2', 'd3', 'd4',
    'd5a', 'd5b', 'd5c',
    'd4b', 'd4c',
    'd7a', 'd7', 'd7b', 'd7c', 'd7d',
    'd8',
    'd9a', 'd9b', 'd9', 'd9c',
  ]) {
    await solveHoleByTryingChoices(page, id)
  }

  await expect(page.locator('img[src*="vt-area-derivation.svg"]')).toBeVisible()

  const velocity = page.locator('[data-derivation-id="d-velocity-update"]')
  await expect(velocity).toHaveCount(1)
  await expect(velocity.locator('.reading-formula-line')).toHaveCount(6)

  const displacement = page.locator('[data-derivation-id="d-displacement-area"]')
  await expect(displacement).toHaveCount(1)
  await expect(displacement.locator('.reading-formula-line')).toHaveCount(4)

  const eliminate = page.locator('[data-derivation-id="d-eliminate-time"]')
  await expect(eliminate).toHaveCount(1)
  await expect(eliminate.locator('.reading-formula-line')).toHaveCount(7)

  const example = page.locator('[data-derivation-id="d-constant-acceleration-example"]')
  await expect(example).toHaveCount(1)
  await expect(example.locator('.reading-formula-line')).toHaveCount(6)

  for (const chain of [velocity, displacement, eliminate, example]) {
    const borders = await chain.locator('.reading-formula-line').evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).borderTopWidth),
    )
    expect(borders.every((width) => width === '0px')).toBe(true)
  }

  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('1E applies prior formulas, derives the trajectory, solves the worked example, and keeps the radical stable', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-1e-horizontal-projectile'))

  for (const id of [
    'e1',
    'e1a', 'e1b', 'e1c', 'e1d',
    'e2a', 'e2b', 'e2c', 'e3',
    'e3a', 'e3b',
    'e4a', 'e4b',
    'e5a', 'e5b', 'e5c', 'e5',
    'e6', 'e6a', 'e6b', 'e6c', 'e6d',
  ]) {
    await solveHoleByTryingChoices(page, id)
  }

  const groups = [
    ['e-horizontal-motion', 6],
    ['e-vertical-motion', 6],
    ['e-vertical-relation', 3],
    ['e-speed-composition', 3],
    ['e-trajectory-elimination', 5],
    ['e-horizontal-projectile-example', 5],
  ] as const

  for (const [id, formulaCount] of groups) {
    const chain = page.locator(`[data-derivation-id="${id}"]`)
    await expect(chain).toHaveCount(1)
    await expect(chain).toBeVisible()
    await expect(chain.locator('.reading-formula-line')).toHaveCount(formulaCount)
    const borders = await chain.locator('.reading-formula-line').evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).borderTopWidth),
    )
    expect(borders.every((width) => width === '0px')).toBe(true)
  }

  const paragraph = page.locator('.reading-paragraph').filter({ hasText: 'したがって速さは' })
  await expect(paragraph).toBeVisible()
  await expect(paragraph.locator('.katex')).toHaveCount(1)
  await expect(paragraph.locator('.katex .sqrt')).toHaveCount(1)

  const sourceTex = await paragraph.locator('annotation[encoding="application/x-tex"]').textContent()
  expect(sourceTex).toContain('\\sqrt{v_0^2+g^2t^2}')

  const layout = await paragraph.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }))
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1)
  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('oblique projectile derivations render as compiled math in one chain', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/physics-1f-oblique-projectile'))

  for (const id of ['f1', 'f3', 'f4', 'f5a', 'f6a', 'f6', 'f7', 'f9']) {
    await solveHoleByTryingChoices(page, id)
  }

  const body = page.locator('body')
  await expect(body).not.toContainText('v_0_x')
  await expect(body).not.toContainText('v_0_y')
  await expect(page.locator('.katex-error')).toHaveCount(0)

  const highestTime = page.locator('[data-derivation-id="f-highest-time"]')
  await expect(highestTime).toBeVisible()
  await expect(highestTime.locator('.reading-formula-line')).toHaveCount(3)

  const borderWidths = await highestTime.locator('.reading-formula-line').evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).borderTopWidth),
  )
  expect(borderWidths.every((width) => width === '0px')).toBe(true)
})
