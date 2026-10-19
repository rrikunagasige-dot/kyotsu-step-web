import { expect, test } from '@playwright/test'
import { mathTextbookUnits } from '../src/data/textbook/math'

const units = ['04', '05', '06', '07', '08', '11', '13', '14'] as const
const route = (n: string) => '/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n' + n

for (const n of units) {
  test('W-MATH-003 batch N' + n + ': all original choices, mobile/PC progression, persistence and figures', async ({ page }, testInfo) => {
    test.setTimeout(180_000)
    const unit = mathTextbookUnits.find(u => u.unitId.endsWith('n' + n))!
    const items = unit.sections[0].items
    const figureIds = unit.sections[0].figures.map(f => f.id)
    await page.goto(route(n))
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
    await expect(page.getByTestId('textbook-item-' + items[0].id)).toBeVisible()
    const evidence = process.env.E2E_BATCH_EVIDENCE === '1'
    const device = testInfo.project.name.includes('mobile') ? 'mobile' : 'desktop'
    for (const fig of figureIds) {
      const locator = page.getByTestId('textbook-figure-' + fig)
      if (fig === 'n08-f01' || fig === 'n11-f01') await expect(locator).toBeVisible()
      else await expect(locator).toHaveCount(0)
    }

    for (const [i, item] of items.entries()) {
      const trigger = page.getByTestId('textbook-item-' + item.id)
      await expect(trigger, item.id).toBeVisible()
      await trigger.click()
      const panel = page.getByTestId('inline-choice-panel-' + item.id)
      await expect(panel).toBeVisible()
      if (evidence && (i === 0 || i === Math.floor(items.length / 2))) {
        await trigger.scrollIntoViewIfNeeded()
        await page.screenshot({ path: 'e2e-evidence/n' + n + '-' + (i === 0 ? 'start' : 'middle') + '-' + device + '.png', fullPage: false })
      }
      await panel.getByRole('button', { name: item.answer, exact: true }).click()
      await expect(page.getByTestId('resolved-' + item.id)).toBeVisible()
      await expect(page.locator('.katex-error')).toHaveCount(0)
      if (i + 1 < items.length) await expect(page.getByTestId('textbook-item-' + items[i + 1].id)).toBeVisible()
    }
    await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
    for (const fig of figureIds) {
      const image = page.getByTestId('textbook-figure-' + fig).locator('img')
      await expect(image).toBeVisible()
      expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), fig).toBe(true)
    }
    if (evidence) await page.screenshot({ path: 'e2e-evidence/n' + n + '-finish-' + device + '.png', fullPage: false })
    const width = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
    expect(width[0], 'document horizontal overflow').toBeLessThanOrEqual(width[1] + 2)
    await page.reload()
    await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
    await expect(page.getByTestId('resolved-' + items[0].id)).toBeVisible()
  })
}
