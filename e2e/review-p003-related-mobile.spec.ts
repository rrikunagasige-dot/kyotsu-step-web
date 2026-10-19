import { expect, test, type Page } from '@playwright/test'
import { mathNumbersN02Unit } from '../src/data/textbook/math/numbers/n02Lesson'
import { mathNumbersN09Unit } from '../src/data/textbook/math/numbers/n09Lesson'
import { mathNumbersN10Unit } from '../src/data/textbook/math/numbers/n10Lesson'
import { mathNumbersN12Unit } from '../src/data/textbook/math/numbers/n12Lesson'

const enabled = process.env.E2E_REVIEW_RELATED === '1'
const units = [mathNumbersN02Unit, mathNumbersN09Unit, mathNumbersN10Unit, mathNumbersN12Unit]

type ScrollCheck = {
  id: string
  width: number
  max: number
  atRight: number
  endVisible: boolean
}

/** Browser-only observation; scrolling inner math does not mutate answers or app source. */
async function inspectVisibleMath(page: Page, observed: Set<string>, width: number) {
  const checks = await page.locator('.reading-formula-line, .reading-choice-formula-line').evaluateAll((elements) =>
    elements.filter((element) => {
      const box = element.getBoundingClientRect()
      return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== 'hidden'
    }).map((element, index) => {
      const panel = element.closest('[data-testid^="inline-choice-panel-"]')
      const panelId = panel?.getAttribute('data-testid') ?? ''
      const rawId = element.getAttribute('data-testid') ?? (panelId ? panelId + '/choice-' + index : 'formula-' + index)
      const max = Math.max(0, element.scrollWidth - element.clientWidth)
      element.scrollLeft = element.scrollWidth
      const expression = element.querySelector('.reading-formula-expression')
      const last = expression?.lastElementChild ?? element.querySelector('.katex') ?? element.lastElementChild
      const endVisible = !last || last.getBoundingClientRect().right <= element.getBoundingClientRect().right + 4
      const result = {
        id: rawId,
        width: element.clientWidth,
        max,
        atRight: element.scrollLeft,
        endVisible,
      }
      element.scrollLeft = 0
      return result
    }),
  ) as ScrollCheck[]

  for (const check of checks) {
    expect(check.width, width + 'px ' + check.id + ' width').toBeGreaterThan(0)
    expect(check.atRight, width + 'px ' + check.id + ' can scroll to end').toBeGreaterThanOrEqual(check.max - 3)
    expect(check.endVisible, width + 'px ' + check.id + ' rightmost text visible').toBe(true)
    observed.add(check.id)
  }
  const rootOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(rootOverflow, width + 'px document horizontal overflow').toBeLessThanOrEqual(1)
  const damagedMath = await page.locator('.katex-error:visible').count()
  expect(damagedMath, width + 'px KaTeX error').toBe(0)
}

test.describe('W-GOV-008/P-003 Gate ② — related approved creation screen sweep, no deployment', () => {
  test.skip(!enabled, 'Only run verification against the approved isolated candidate.')

  for (const unit of units) {
    test(unit.unitId + ' full 320px flow, 390px resolved reflow and math-choice scroll', async ({ page }) => {
      test.setTimeout(240_000)
      await page.setViewportSize({ width: 320, height: 740 })
      await page.goto('/#/problems')
      await page.evaluate(() => localStorage.clear())
      await page.goto('/#/learning/textbook/' + unit.unitId)
      await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()

      const sourceItems = unit.sections.flatMap((section) => section.items)
      const itemById = new Map(sourceItems.map((item) => [item.id, item]))
      const expectedFormulas = unit.sections.flatMap((section) => section.readingFlow)
        .filter((block) => block.type === 'formula')
        .map((block) => 'textbook-formula-' + block.id)
      const answered = new Set<string>()
      const seen320 = new Set<string>()

      for (let step = 0; step < sourceItems.length; step += 1) {
        await inspectVisibleMath(page, seen320, 320)
        const open = page.locator('.textbook-reading-flow button[data-testid^="textbook-item-"]:visible').first()
        await expect(open, 'next unresolved learner decision at step ' + step).toBeVisible()
        const testId = await open.getAttribute('data-testid')
        const id = testId?.slice('textbook-item-'.length) ?? ''
        const item = itemById.get(id)
        if (!item || answered.has(id)) throw new Error('unexpected/repeated learner decision: ' + id)
        await open.click()
        const panel = page.getByTestId('inline-choice-panel-' + id)
        await expect(panel).toBeVisible()
        await inspectVisibleMath(page, seen320, 320)
        await panel.getByRole('button', { name: item.answer, exact: true }).click()
        await expect(page.getByTestId('resolved-' + id)).toBeVisible()
        answered.add(id)
      }

      expect(answered.size).toBe(sourceItems.length)
      await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
      await inspectVisibleMath(page, seen320, 320)
      for (const id of expectedFormulas) {
        expect(seen320.has(id), '320px source block never displayed: ' + id).toBe(true)
      }

      await page.setViewportSize({ width: 390, height: 780 })
      const seen390 = new Set<string>()
      await inspectVisibleMath(page, seen390, 390)
      for (const id of expectedFormulas) {
        expect(seen390.has(id), '390px completed source block missing: ' + id).toBe(true)
      }

      console.log('P-003 related-screen PASS', unit.unitId, JSON.stringify({
        decisions: answered.size,
        expectedFormulas: expectedFormulas.length,
        observedAt320: seen320.size,
        observedAt390: seen390.size,
      }))
    })
  }
})
