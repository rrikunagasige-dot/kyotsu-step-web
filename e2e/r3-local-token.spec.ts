import { expect, test, type Page } from '@playwright/test'
import { mathNumbersN01Unit, n01SourceToItemIds } from '../src/data/textbook/math/numbers/n01Lesson'
import { mathNumbersN03Unit, n03SourceToItemIds } from '../src/data/textbook/math/numbers/n03Lesson'
import { mathNumbersN09Unit, n09SourceToItemIds } from '../src/data/textbook/math/numbers/n09Lesson'

const route = (unitId: string) => '/kyotsu-step-web/#/learning/textbook/' + unitId
const cases = [
  { unit: mathNumbersN01Unit, source: n01SourceToItemIds, tokens: [
    ['n01-r3-q07-x2coef', '-2'], ['n01-r3-q07-xcoef', '-3'], ['n01-r3-q07-const', '3'],
  ], figure: null },
  { unit: mathNumbersN03Unit, source: n03SourceToItemIds, tokens: [
    ['n03-r3-q10-p1', '6x^2'], ['n03-r3-q10-p2', '8x'],
    ['n03-r3-q10-p3', '3x'], ['n03-r3-q10-p4', '4'],
  ], figure: 'n03-f01' },
  { unit: mathNumbersN09Unit, source: n09SourceToItemIds, tokens: [
    ['n09-r3-q08-square141', '1.9881'], ['n09-r3-q08-square142', '2.0164'],
  ], figure: 'n09-f01' },
] as const

async function solve(page: Page, id: string, answer: string) {
  const trigger = page.getByTestId('textbook-item-' + id)
  await expect(trigger).toBeVisible()
  await expect(trigger).toHaveClass(/reading-formula-choice--token/)
  await expect(trigger).toContainText(/選択|×/)
  // W-MATH-006/P-001: approved visual-only unification with the original N02 rectangle.
  const metrics = await trigger.evaluate((element) => {
    const style = getComputedStyle(element)
    const bounds = element.getBoundingClientRect()
    return { width: bounds.width, height: bounds.height, radius: style.borderRadius, border: style.borderTopWidth }
  })
  expect(metrics.width).toBeGreaterThanOrEqual(44)
  expect(metrics.height).toBeGreaterThanOrEqual(44)
  expect(metrics.radius).toBe('0px')
  expect(metrics.border).toBe('1px')
  await trigger.click()
  const panel = page.getByTestId('inline-choice-panel-' + id)
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: answer, exact: true }).click()
  await expect(page.getByTestId('resolved-' + id)).toBeVisible()
}

for (const { unit, source, tokens, figure } of cases) {
  test(unit.unitId + ': full old-v1 completion migrates, nine-hole family remains gated, and reload is safe', async ({ page }) => {
    test.setTimeout(100_000)
    await page.goto(route(unit.unitId))
    const allOldIds = Object.values(source).flat()
    const records = Object.fromEntries(allOldIds.map(id => {
      const item = unit.sections[0].items.find(candidate => candidate.id === id)!
      return [id, {
        itemId: id, value: item.answer, firstValue: item.answer, isFirstCorrect: true,
        resolved: true, attemptCount: 3, firstAnsweredAt: 100, lastAnsweredAt: 200,
      }]
    }))
    const seed = {
      unitId: unit.unitId, unitRevision: 1,
      startedAt: 100, updatedAt: 200, completedAt: 300, answers: records,
    }
    await page.evaluate((oldState) => {
      localStorage.clear()
      localStorage.setItem('kyotsu-step-store', JSON.stringify({
        state: { textbookProgress: { [oldState.unitId]: oldState } }, version: 1,
      }))
    }, seed)
    await page.reload()
    await expect(page.getByTestId('r3-progress-upgrade-note')).toBeVisible()
    await expect(page.getByTestId('textbook-unit-complete')).toHaveCount(0)
    await expect(page.getByTestId('textbook-item-' + tokens[0][0])).toBeVisible()
    await expect(page.getByTestId('textbook-item-' + tokens[1][0])).toHaveCount(0)
    if (figure === 'n09-f01') {
      await expect(page.getByTestId('textbook-figure-n09-f01')).toHaveCount(0)
    }

    await page.getByTestId('textbook-item-' + tokens[0][0]).click()
    const panel = page.getByTestId('inline-choice-panel-' + tokens[0][0])
    const options = panel.locator('.reading-choice-option')
    let wrongClicked = false
    for (let i = 0; i < await options.count(); i++) {
      const option = options.nth(i)
      if (await option.getAttribute('aria-label') === tokens[0][1]) continue
      await option.click()
      wrongClicked = true
      break
    }
    expect(wrongClicked).toBe(true)
    await expect(page.getByTestId('resolved-' + tokens[0][0])).toHaveCount(0)
    await expect(page.getByTestId('textbook-item-' + tokens[1][0])).toHaveCount(0)

    for (const [id, answer] of tokens) {
      await solve(page, id, answer)
      await expect(page.locator('.katex-error')).toHaveCount(0)
    }
    if (figure) {
      const img = page.getByTestId('textbook-figure-' + figure)
      await expect(img).toBeVisible()
      await expect(img.locator('img')).toHaveJSProperty('complete', true)
    }
    await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(await page.evaluate(() => document.documentElement.clientWidth + 1))

    const persisted = await page.evaluate(id => JSON.parse(
      localStorage.getItem('kyotsu-step-store') || '{}',
    ).state?.textbookProgress?.[id], unit.unitId)
    expect(persisted.unitRevision).toBe(2)
    expect(persisted.migratedFromRevision).toBe(1)
    expect(persisted.previousRevisionCompletedAt).toBe(300)
    expect(persisted.completedAt).toBeDefined()
    for (const id of allOldIds) {
      expect(persisted.answers[id].attemptCount).toBe(3)
      expect(persisted.answers[id].value).toBe(records[id].value)
    }
    await page.reload()
    await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
    await expect(page.getByTestId('resolved-' + tokens[0][0])).toBeVisible()
  })
}
