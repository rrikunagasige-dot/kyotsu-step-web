import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'

test.describe('W-GOV-008/P-003 evidence-only screenshots', () => {
  // This is intentionally opt-in; a GitHub PR alone does not provide a review target.
  test.skip(process.env.E2E_REVIEW_EVIDENCE !== '1', 'Not an approved actual-app evidence capture')

  test('captures verified real review route on phone and desktop, without learner writes', async ({ page }, testInfo) => {
    const route = process.env.REVIEW_EVIDENCE_ROUTE ?? ''
    const sha = process.env.VITE_PREVIEW_COMMIT ?? ''
    expect(route, 'only a local gated review route is permitted').toMatch(/^\/#\/review\/[a-z0-9-]+$/)
    expect(sha, 'expected full checked-out git SHA').toMatch(/^[a-f0-9]{40}$/)

    await page.goto(route)
    await expect(page.getByTestId('review-preview-ready')).toBeVisible()
    await expect(page.getByTestId('review-preview-sha')).toContainText(sha)

    const before = await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))
    mkdirSync('e2e-evidence', { recursive: true })

    if (testInfo.project.name === 'mobile-chromium') {
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 844 })
        await expect(page.getByTestId('review-preview-ready')).toBeVisible()
        await page.screenshot({ path: `e2e-evidence/review-mobile-${width}.png`, fullPage: true })
      }
    } else {
      await page.setViewportSize({ width: 1440, height: 1000 })
      await page.screenshot({ path: 'e2e-evidence/review-desktop-1440.png', fullPage: true })
    }

    const after = await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))
    expect(after, 'evidence viewing must not write learner progress').toBe(before)
  })
})
