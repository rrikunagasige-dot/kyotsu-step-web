import { expect, test } from '@playwright/test'

const previewGate = process.env.E2E_REVIEW_CROSS === '1'

test.describe('W-GOV-008/P-003 Gate ② — two-block cross-audit, no app publication', () => {
  test.skip(!previewGate, 'Only audit the approved isolated P-002 app preview.')

  test('320px N01 coefficient chain: three ordered dependencies, correct sum, no persisted learner state', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 })
    await page.goto('/#/review/n01-q07')
    await expect(page.getByTestId('review-preview-ready')).toBeVisible()
    await expect(page.getByTestId('review-mark-formula-r3-q07-x2coef')).toContainText('確認①')
    await expect(page.getByTestId('review-mark-formula-r3-q07-xcoef')).toHaveCount(0)
    await expect(page.getByTestId('review-mark-formula-n01-07')).toHaveCount(0)
    const before = await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))
    for (const [id, answer, next] of [
      ['n01-r3-q07-x2coef', '-2', 'formula-r3-q07-xcoef'],
      ['n01-r3-q07-xcoef', '-3', 'formula-r3-q07-const'],
      ['n01-r3-q07-const', '3', 'formula-n01-07'],
      ['n01-07', '-2x^2-3x+3', ''],
    ]) {
      await page.getByTestId('textbook-item-' + id).click()
      await page.getByTestId('inline-choice-panel-' + id).getByRole('button', { name: answer, exact: true }).click()
      await expect(page.getByTestId('resolved-' + id)).toBeVisible()
      if (next && next !== 'formula-n01-07') {
        await expect(page.getByTestId('review-mark-' + next)).toBeVisible()
      }
    }
    await expect(page.getByTestId('review-preview-count')).toContainText('4/4')
    expect(await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))).toBe(before)
    const rootOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(rootOverflow).toBeLessThanOrEqual(1)
  })

  test('320px and 390px N01 formula: scroll to its right end without root overflow', async ({ page }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 740 })
      await page.goto('/#/review/n01-q07')
      await expect(page.getByTestId('review-preview-ready')).toBeVisible()
      const formula = page.getByTestId('textbook-formula-formula-like-original')
      await expect(formula).toBeVisible()
      const start = await formula.evaluate((el) => ({ max: el.scrollWidth - el.clientWidth, width: el.clientWidth }))
      expect(start.width).toBeGreaterThan(0)
      expect(start.max).toBeGreaterThan(1)
      await formula.evaluate((el) => { el.scrollLeft = el.scrollWidth })
      const end = await formula.evaluate((el) => {
        const last = el.querySelector('.reading-formula-expression')?.lastElementChild
        return { left: el.scrollLeft, max: el.scrollWidth - el.clientWidth,
          lastRight: last?.getBoundingClientRect().right ?? Infinity, rightEdge: el.getBoundingClientRect().right }
      })
      expect(end.left).toBeGreaterThanOrEqual(end.max - 2)
      expect(end.lastRight).toBeLessThanOrEqual(end.rightEdge + 3)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
    }
  })

  test('320px N03 grid: wrong answer cannot unlock next product, retry and all five results work', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 })
    await page.goto('/#/review/n03-q10')
    await expect(page.getByTestId('review-preview-ready')).toBeVisible()
    await expect(page.getByAltText(/積の対応を考える表/)).toBeVisible()
    await expect(page.getByTestId('review-mark-formula-r3-q10-p1')).toContainText('確認①')
    await expect(page.getByTestId('review-mark-formula-r3-q10-p2')).toHaveCount(0)
    const before = await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))
    const first = 'n03-r3-q10-p1'
    await page.getByTestId('textbook-item-' + first).click()
    const panel = page.getByTestId('inline-choice-panel-' + first)
    const offered = await panel.locator('.reading-choice-option').evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute('aria-label') ?? ''),
    )
    const wrong = offered.find((choice) => choice !== '6x^2')
    if (!wrong) throw new Error('N03 first blank had no incorrect option')
    await panel.getByRole('button', { name: wrong, exact: true }).click()
    await expect(page.getByTestId('textbook-item-' + first)).toBeVisible()
    await expect(page.getByTestId('review-mark-formula-r3-q10-p2')).toHaveCount(0)
    await page.getByTestId('textbook-item-' + first).click()
    await expect(page.getByTestId('textbook-hint-' + first)).toBeVisible()
    await page.getByTestId('inline-choice-panel-' + first).getByRole('button', { name: '6x^2', exact: true }).click()
    await expect(page.getByTestId('resolved-' + first)).toBeVisible()
    for (const [id, answer] of [
      ['n03-r3-q10-p2', '8x'],
      ['n03-r3-q10-p3', '3x'],
      ['n03-r3-q10-p4', '4'],
      ['n03-10', '6x^2+8x+3x+4'],
    ]) {
      await page.getByTestId('textbook-item-' + id).click()
      await page.getByTestId('inline-choice-panel-' + id).getByRole('button', { name: answer, exact: true }).click()
      await expect(page.getByTestId('resolved-' + id)).toBeVisible()
    }
    await expect(page.getByTestId('review-preview-count')).toContainText('5/5')
    expect(await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))).toBe(before)
    const rootOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(rootOverflow).toBeLessThanOrEqual(1)
  })

  test('review-to-review switch and ordinary route preserve boundaries', async ({ page }) => {
    await page.goto('/#/review/n01-q07')
    await expect(page.getByTestId('review-preview-ready')).toBeVisible()
    await page.getByRole('link', { name: 'N03 Q10 を確認' }).click()
    await expect(page.getByTestId('review-mark-formula-r3-q10-p1')).toContainText('確認①')
    await expect(page.getByTestId('review-mark-formula-r3-q07-x2coef')).toHaveCount(0)
    await page.goto('/#/problems')
    await expect(page.locator('.review-marked-block')).toHaveCount(0)
    await expect(page.locator('.review-preview__banner')).toHaveCount(0)
    await page.goto('/#/review/not-a-reviewed-block')
    await expect(page.getByText('確認ページが見つかりません')).toBeVisible()
  })
})
