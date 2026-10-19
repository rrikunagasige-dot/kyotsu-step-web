import { expect, test } from '@playwright/test'

test.describe('W-GOV-008 exact-head isolated app review pilot', () => {
  test.skip(process.env.E2E_REVIEW_PREVIEW !== '1', 'Only run against the approved PR #92-based pilot, not old main.')

  test('N01 Q07: direct jump, actual wrong/correct gating, no persistence', async ({ page }) => {
    await page.goto('/#/review/n01-q07')
    await expect(page.getByTestId('review-preview-ready')).toBeVisible()
    await expect(page.getByTestId('review-preview-count')).toContainText('全18穴')
    const sha = process.env.VITE_PREVIEW_COMMIT
    if (sha) await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
    const before = await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))

    const first = 'n01-r3-q07-x2coef'
    await page.getByTestId('textbook-item-' + first).click()
    await page.getByTestId('inline-choice-panel-' + first).getByRole('button', { name: '2', exact: true }).click()
    await expect(page.getByTestId('textbook-item-' + first)).toBeVisible()
    await expect(page.getByTestId('textbook-item-n01-r3-q07-xcoef')).toHaveCount(0)
    await page.getByTestId('textbook-item-' + first).click()
    await page.getByTestId('inline-choice-panel-' + first).getByRole('button', { name: '-2', exact: true }).click()
    await expect(page.getByTestId('resolved-' + first)).toBeVisible()

    for (const [id, answer] of [
      ['n01-r3-q07-xcoef', '-3'],
      ['n01-r3-q07-const', '3'],
      ['n01-07', '-2x^2-3x+3'],
    ]) {
      await page.getByTestId('textbook-item-' + id).click()
      await page.getByTestId('inline-choice-panel-' + id).getByRole('button', { name: answer, exact: true }).click()
      await expect(page.getByTestId('resolved-' + id)).toBeVisible()
    }
    await expect(page.getByTestId('review-preview-count')).toContainText('4/4')
    expect(await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))).toBe(before)
    await page.reload()
    await expect(page.getByTestId('textbook-item-' + first)).toBeVisible()
  })

  test('N03 Q10: original four-cell figure, four products and correct sum', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 })
    await page.goto('/#/review/n03-q10')
    await expect(page.getByTestId('review-preview-ready')).toBeVisible()
    await expect(page.getByTestId('review-preview-count')).toContainText('全17穴')
    await expect(page.getByAltText(/積の対応を考える表/)).toBeVisible()
    const before = await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))

    for (const [id, answer] of [
      ['n03-r3-q10-p1', '6x^2'], ['n03-r3-q10-p2', '8x'],
      ['n03-r3-q10-p3', '3x'], ['n03-r3-q10-p4', '4'],
      ['n03-10', '6x^2+8x+3x+4'],
    ]) {
      await page.getByTestId('textbook-item-' + id).click()
      await page.getByTestId('inline-choice-panel-' + id).getByRole('button', { name: answer, exact: true }).click()
      await expect(page.getByTestId('resolved-' + id)).toBeVisible()
    }
    await expect(page.getByTestId('review-preview-count')).toContainText('5/5')
    expect(await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))).toBe(before)
    const excess = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(excess).toBeLessThanOrEqual(1)
  })
})
