import { expect, test } from '@playwright/test'
import { mathTextbookUnits } from '../src/data/textbook/math'

/** W-MATH-012/P-001: actual browser Q11 formula-local derivation in 320/390. */
for (const width of [320, 390]) {
  test('N11 Q11 3 sequential decisions including historic key at ' + width + 'px', async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width, height: 850 })
    const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n11'))!
    const items = unit.sections[0].items
    const ids = ['n11-wm012-q11-expand', 'n11-wm012-q11-xcoef', 'n11-11']
    expect(unit.revision).toBe(10)
    const first = items.findIndex(item => item.id === ids[0])
    expect(first).toBeGreaterThan(10)
    expect(items.slice(first, first + 3).map(item => item.id)).toEqual(ids)
    await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n11')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
    // No Q11 answers are accessible until all prior authored decisions
    // (including accepted Q01–Q04 proof and source Q10 figure) are resolved.
    for (const item of items.slice(0, first)) {
      const trigger = page.getByTestId('textbook-item-' + item.id)
      await expect(trigger, item.id).toBeVisible()
      await trigger.click()
      const panel = page.getByTestId('inline-choice-panel-' + item.id)
      await panel.getByRole('button', { name: item.answer, exact: true }).click()
      await expect(page.getByTestId('resolved-' + item.id)).toBeVisible()
    }
    const evidence = process.env.E2E_WM012_EVIDENCE === '1'
    for (const id of ids) {
      const item = items.find(v => v.id === id)!
      const trigger = page.getByTestId('textbook-item-' + id)
      await expect(trigger).toBeVisible()
      await trigger.click()
      let panel = page.getByTestId('inline-choice-panel-' + id)
      await expect(panel).toBeVisible()
      const right = panel.getByRole('button', { name: item.answer, exact: true })
      await expect(right).toBeVisible()
      for (const option of await panel.locator('.reading-choice-option').all()) {
        for (const line of await option.locator('.reading-choice-formula-line').all()) {
          const m = await line.evaluate(node => [node.scrollWidth, node.clientWidth])
          expect(m[0], id + ' clipped choice').toBeLessThanOrEqual(m[1] + 1)
        }
      }
      if (evidence) {
        await trigger.scrollIntoViewIfNeeded()
        await page.screenshot({ path: 'e2e-evidence/wmath012-' + id + '-' + width + '-before.png' })
      }
      const correctTestId = await right.getAttribute('data-testid')
      const buttons = await panel.getByRole('button').all()
      let wrong: (typeof buttons)[number] | undefined
      for (const candidate of buttons) {
        if ((await candidate.getAttribute('data-testid')) !== correctTestId) {
          wrong = candidate
          break
        }
      }
      expect(wrong, id + ' needs visible wrong choice').toBeDefined()
      await wrong!.click()
      await trigger.click()
      panel = page.getByTestId('inline-choice-panel-' + id)
      await expect(panel).toBeVisible()
      await expect(page.getByTestId('textbook-hint-' + id)).toBeVisible()
      if (evidence) await page.screenshot({ path: 'e2e-evidence/wmath012-' + id + '-' + width + '-wrong.png' })
      await panel.getByRole('button', { name: item.answer, exact: true }).click()
      const resolved = page.getByTestId('resolved-' + id)
      await expect(resolved).toBeVisible()
      if (id === 'n11-11') {
        const fit = await resolved.evaluate(node => ({
          right: node.getBoundingClientRect().right,
          viewport: document.documentElement.clientWidth,
        }))
        expect(fit.right, 'Q11 final formula must fit 320px after removing duplicate premise')
          .toBeLessThanOrEqual(fit.viewport - 4)
      }
      await expect(page.locator('.katex-error')).toHaveCount(0)
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
      expect(w[0], id + ' document overflow').toBeLessThanOrEqual(w[1] + 2)
      if (evidence) await page.screenshot({ path: 'e2e-evidence/wmath012-' + id + '-' + width + '-resolved.png' })
    }
    await expect(page.getByTestId('textbook-item-n11-12')).toBeVisible()
    await page.reload()
    for (const id of ids) await expect(page.getByTestId('resolved-' + id)).toBeVisible()
  })
}


/** W-MATH-013/P-001: the same tested N11 page now gives Q14 two
 * staged inline formula blanks without modifying accepted Q11 stages.
 * Screenshot files are actual Playwright captures only under evidence CI.
 */
for (const width of [320, 390]) {
  test('N11 Q14 new two local blanks and original final choice at ' + width + 'px', async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width, height: 850 })
    const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n11'))!
    expect(unit.revision).toBe(10)
    const items = unit.sections[0].items
    const ids = ['n11-wm013-q14-xcoef', 'n11-wm013-q14-const', 'n11-14']
    const first = items.findIndex(item => item.id === ids[0])
    expect(first).toBe(28) // P008 adds 3 Q13 decisions before protected Q14
    expect(items.slice(first, first + 3).map(item => item.id)).toEqual(ids)
    await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n11')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
    // Earlier accepted Q01-Q04 and Q11 answers remain prerequisites, not
    // bypassed by opening Q14 as a synthetic isolated card.
    for (const item of items.slice(0, first)) {
      const trigger = page.getByTestId('textbook-item-' + item.id)
      await expect(trigger, item.id).toBeVisible()
      await trigger.click()
      const panel = page.getByTestId('inline-choice-panel-' + item.id)
      await panel.getByRole('button', { name: item.answer, exact: true }).click()
      await expect(page.getByTestId('resolved-' + item.id)).toBeVisible()
    }
    const screenshot = process.env.E2E_WM012_EVIDENCE === '1'
    for (const id of ids) {
      const item = items.find(v => v.id === id)!
      const trigger = page.getByTestId('textbook-item-' + id)
      await expect(trigger).toBeVisible()
      await trigger.click()
      let panel = page.getByTestId('inline-choice-panel-' + id)
      await expect(panel).toBeVisible()
      const right = panel.getByRole('button', { name: item.answer, exact: true })
      await expect(right).toBeVisible()
      const rightKey = await right.getAttribute('data-testid')
      for (const option of await panel.locator('.reading-choice-option').all()) {
        for (const line of await option.locator('.reading-choice-formula-line').all()) {
          const box = await line.evaluate(node => [node.scrollWidth, node.clientWidth])
          expect(box[0], id + ' 320/390 clipped choice').toBeLessThanOrEqual(box[1] + 1)
        }
      }
      if (screenshot) {
        await trigger.scrollIntoViewIfNeeded()
        await page.screenshot({ path: 'e2e-evidence/wmath013-' + id + '-' + width + '-before.png' })
      }
      const candidates = await panel.getByRole('button').all()
      let wrong: (typeof candidates)[number] | undefined
      for (const candidate of candidates) {
        if ((await candidate.getAttribute('data-testid')) !== rightKey) {
          wrong = candidate
          break
        }
      }
      expect(wrong, id + ' expected a visible distractor').toBeDefined()
      await wrong!.click()
      await expect(page.getByTestId('inline-choice-panel-' + id)).toHaveCount(0)
      await expect(page.getByTestId('resolved-' + id)).toHaveCount(0)
      await trigger.click()
      panel = page.getByTestId('inline-choice-panel-' + id)
      await expect(panel).toBeVisible()
      await expect(page.getByTestId('textbook-hint-' + id)).toBeVisible()
      if (screenshot) await page.screenshot({
        path: 'e2e-evidence/wmath013-' + id + '-' + width + '-wrong.png',
      })
      await panel.getByRole('button', { name: item.answer, exact: true }).click()
      const resolved = page.getByTestId('resolved-' + id)
      await expect(resolved).toBeVisible()
      const rightEdge = await resolved.evaluate(node => ({
        right: node.getBoundingClientRect().right,
        viewport: document.documentElement.clientWidth,
      }))
      expect(rightEdge.right, id + ' resolved card right edge').toBeLessThanOrEqual(rightEdge.viewport - 4)
      await expect(page.locator('.katex-error')).toHaveCount(0)
      const bounds = await page.evaluate(() =>
        [document.documentElement.scrollWidth, document.documentElement.clientWidth])
      expect(bounds[0], id + ' document overflow').toBeLessThanOrEqual(bounds[1] + 2)
      if (screenshot) await page.screenshot({
        path: 'e2e-evidence/wmath013-' + id + '-' + width + '-resolved.png',
      })
    }
    await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
    await page.reload()
    for (const id of ids) await expect(page.getByTestId('resolved-' + id)).toBeVisible()
    await expect(page.getByTestId('resolved-n11-11')).toBeVisible()
  })
}
