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
    expect(unit.revision).toBe(5)
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
