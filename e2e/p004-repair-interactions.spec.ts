import { expect, test } from '@playwright/test'
import { mathTextbookUnits } from '../src/data/textbook/math'

/** P-004: genuine learner-choice checks for repaired source questions, no hosting/deploy. */
const repaired = [
  ['04', 'n04-13'], ['05', 'n05-17'], ['06', 'n06-08'],
  ['07', 'n07-06'], ['08', 'n08-05'], ['11', 'n11-05'],
  ['14', 'n14-06'], ['14', 'n14-11'],
] as const

for (const [n, id] of repaired) {
  for (const width of [320, 390]) {
    test('P-004 N' + n + ' ' + id + ' wrong/hint/retry + genuine ' + width + 'px screenshot', async ({ page }) => {
      test.setTimeout(180_000)
      await page.setViewportSize({ width, height: 850 })
      const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
      const items = unit.sections[0].items
      await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n' + n)
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
      const save = process.env.E2E_P004_EVIDENCE === '1'
      for (const item of items) {
        const trigger = page.getByTestId('textbook-item-' + item.id)
        await expect(trigger, item.id).toBeVisible()
        await trigger.click()
        const panel = page.getByTestId('inline-choice-panel-' + item.id)
        await expect(panel).toBeVisible()
        let correct = panel.getByRole('button', { name: item.answer, exact: true })
        await expect(correct).toBeVisible()
        if (item.id === id) {
          const hint = page.getByTestId('textbook-hint-' + id)
          await expect(hint).toHaveCount(0)
          if (save) {
            await trigger.scrollIntoViewIfNeeded()
            await page.screenshot({ path: 'e2e-evidence/p004-' + id + '-' + width + '-before.png' })
          }
          const correctTestId = await correct.getAttribute('data-testid')
          const buttons = await panel.getByRole('button').all()
          // Choose a different rendered option; the scaffold intentionally hides
          // one/two of the four authored distractors in some early questions.
          let wrongButton: (typeof buttons)[number] | undefined
          for (const button of buttons) {
            if (await button.getAttribute('data-testid') !== correctTestId) {
              wrongButton = button
              break
            }
          }
          expect(wrongButton, 'visible incorrect choice required').toBeDefined()
          await wrongButton!.click()
          await expect(hint).toBeVisible()
          await expect(page.getByTestId('resolved-' + id)).toHaveCount(0)
          if (save) {
            await page.screenshot({ path: 'e2e-evidence/p004-' + id + '-' + width + '-wrong.png' })
          }
          // Retrying uses the same open panel and must keep the intended correct key.
          correct = page.getByTestId('inline-choice-panel-' + id).getByRole('button', { name: item.answer, exact: true })
        }
        await correct.click()
        await expect(page.getByTestId('resolved-' + item.id)).toBeVisible()
        if (item.id === id) {
          await expect(page.locator('.katex-error')).toHaveCount(0)
          const widths = await page.evaluate(() => [
            document.documentElement.scrollWidth, document.documentElement.clientWidth,
          ])
          expect(widths[0], id + ' overflow at ' + width + 'px').toBeLessThanOrEqual(widths[1] + 2)
          if (save) {
            await page.screenshot({ path: 'e2e-evidence/p004-' + id + '-' + width + '-resolved.png' })
          }
          await page.reload()
          await expect(page.getByTestId('resolved-' + id)).toBeVisible()
          break
        }
      }
    })
  }
}
