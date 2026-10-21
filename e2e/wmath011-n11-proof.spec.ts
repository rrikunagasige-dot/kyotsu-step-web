import { expect, test } from '@playwright/test'
import { mathTextbookUnits } from '../src/data/textbook/math'

/**
 * W-MATH-011/P-001: a REAL browser walks the nine Q01–Q04 decisions,
 * preserving original source question IDs and independent historical keys.
 * Captures genuine before/wrong/resolved screenshots only when approved
 * evidence workflow enables it. Never deploys this review-only unit.
 */
const ids = [
  'n11-01', 'n11-02', 'n11-wm011-q02-compare',
  'n11-wm011-q03-factor', 'n11-wm011-q03-positive',
  'n11-03', 'n11-wm011-q03-zero',
  'n11-wm011-q04-fraction', 'n11-04',
] as const

for (const width of [320, 390]) {
  test('W-MATH-011 N11 original Q01–Q04 proof and selective 9-step revision at ' + width + 'px', async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width, height: 850 })
    const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n11'))!
    const original = unit.sections[0].items
    expect(original.length).toBe(23)
    expect(original.slice(0, 9).map(x => x.id)).toEqual([...ids])
    await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n11')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()

    // Original number-line observation must be visible BEFORE any learner
    // answer, but the completed endpoint-range figure must stay locked.
    await expect(page.getByTestId('textbook-figure-n11-f01')).toBeVisible()
    await expect(page.getByTestId('textbook-figure-n11-f02')).toHaveCount(0)
    const save = process.env.E2E_WM011_EVIDENCE === '1'

    for (const item of original.slice(0, 9)) {
      const trigger = page.getByTestId('textbook-item-' + item.id)
      await expect(trigger, item.id).toBeVisible()
      await trigger.click()
      const panel = page.getByTestId('inline-choice-panel-' + item.id)
      await expect(panel).toBeVisible()
      let correct = panel.getByRole('button', { name: item.answer, exact: true })
      await expect(correct).toBeVisible()
      if (save) {
        await trigger.scrollIntoViewIfNeeded()
        await page.screenshot({ path: 'e2e-evidence/wmath011-' + item.id + '-' + width + '-before.png' })
      }
      for (const option of await panel.locator('.reading-choice-option').all()) {
        const rows = option.locator('.reading-choice-formula-line')
        for (const line of await rows.all()) {
          const m = await line.evaluate(element => [element.scrollWidth, element.clientWidth])
          expect(m[0], item.id + ' mobile choice math overflow').toBeLessThanOrEqual(m[1] + 1)
        }
      }
      const correctId = await correct.getAttribute('data-testid')
      const other = await panel.getByRole('button').all()
      let wrong: (typeof other)[number] | undefined
      for (const button of other) {
        if ((await button.getAttribute('data-testid')) !== correctId) { wrong = button; break }
      }
      expect(wrong, item.id + ' needs visible wrong alternative').toBeDefined()
      await wrong!.click()
      await expect(page.getByTestId('inline-choice-panel-' + item.id)).toHaveCount(0)
      await trigger.click()
      const retry = page.getByTestId('inline-choice-panel-' + item.id)
      await expect(retry).toBeVisible()
      await expect(page.getByTestId('textbook-hint-' + item.id)).toBeVisible()
      if (save) await page.screenshot({ path: 'e2e-evidence/wmath011-' + item.id + '-' + width + '-wrong.png' })
      correct = retry.getByRole('button', { name: item.answer, exact: true })
      await correct.click()
      const resolved = page.getByTestId('resolved-' + item.id)
      await expect(resolved).toBeVisible()
      await expect(page.locator('.katex-error')).toHaveCount(0)
      const lines = resolved.locator('.reading-formula-n12-answer-lines > span')
      if (['n11-wm011-q02-compare', 'n11-wm011-q03-positive', 'n11-03',
           'n11-wm011-q03-zero', 'n11-wm011-q04-fraction'].includes(item.id)) {
        await expect(lines).toHaveCount(2)
        for (const line of await lines.all()) {
          const m = await line.evaluate(element => [element.scrollWidth, element.clientWidth])
          expect(m[0], item.id + ' clipped answer math').toBeLessThanOrEqual(m[1] + 1)
        }
      }
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
      expect(w[0], item.id + ' document overflow').toBeLessThanOrEqual(w[1] + 2)
      if (save) await page.screenshot({ path: 'e2e-evidence/wmath011-' + item.id + '-' + width + '-resolved.png' })
    }
    await page.reload()
    for (const id of ids) await expect(page.getByTestId('resolved-' + id)).toBeVisible()
    await expect(page.getByTestId('textbook-item-n11-05')).toBeVisible()
    // The original complete-solution figure cannot be used to reveal Q05–Q10.
    await expect(page.getByTestId('textbook-figure-n11-f02')).toHaveCount(0)
  })
}
