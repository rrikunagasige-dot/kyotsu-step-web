import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

type Step = { mark: string; item: string; correct: string; label: string }

const targets: ReadonlyArray<{ route: string; steps: readonly Step[] }> = [
  {
    route: 'n01-q07',
    steps: [
      { mark: 'formula-r3-q07-x2coef', item: 'n01-r3-q07-x2coef', correct: '-2', label: '確認①' },
      { mark: 'formula-r3-q07-xcoef', item: 'n01-r3-q07-xcoef', correct: '-3', label: '確認②' },
      { mark: 'formula-r3-q07-const', item: 'n01-r3-q07-const', correct: '3', label: '確認③' },
    ],
  },
  {
    route: 'n03-q10',
    steps: [
      { mark: 'formula-r3-q10-p1', item: 'n03-r3-q10-p1', correct: '6x^2', label: '確認①' },
      { mark: 'formula-r3-q10-p2', item: 'n03-r3-q10-p2', correct: '8x', label: '確認②' },
      { mark: 'formula-r3-q10-p3', item: 'n03-r3-q10-p3', correct: '3x', label: '確認③' },
      { mark: 'formula-r3-q10-p4', item: 'n03-r3-q10-p4', correct: '4', label: '確認④' },
    ],
  },
]

test.describe('W-GOV-008/P-003 — actual pilot screenshot evidence, no hosted deployment', () => {
  test.skip(process.env.E2E_REVIEW_EVIDENCE !== '1', 'Capture only on approved preview artifact workflow')

  for (const target of targets) {
    test(`${target.route}: captures each visible mark before choosing its correct answer`, async ({ page }, info) => {
      const sha = process.env.VITE_PREVIEW_COMMIT ?? ''
      expect(sha).toMatch(/^[0-9a-f]{40}$/i)
      const mobile = info.project.name === 'mobile-chromium'
      const width = mobile ? 390 : 1440
      await page.setViewportSize({ width, height: mobile ? 844 : 1000 })
      await page.goto('/#/review/' + target.route)
      await expect(page.getByTestId('review-preview-ready')).toBeVisible()
      await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
      if (target.route === 'n03-q10') {
        await expect(page.getByAltText(/積の対応を考える表/)).toBeVisible()
      }
      const initialStorage = await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))
      mkdirSync('e2e-evidence', { recursive: true })
      const evidence: Array<{ file: string; label: string; mark: string; item: string; viewport: number }> = []

      for (const [index, step] of target.steps.entries()) {
        const marker = page.getByTestId('review-mark-' + step.mark)
        await expect(marker).toContainText(step.label)
        await marker.scrollIntoViewIfNeeded()
        const file = `e2e-evidence/${target.route}-review-${index + 1}-${mobile ? 'mobile' : 'desktop'}-${width}.png`
        await page.screenshot({ path: file, fullPage: false })
        evidence.push({ file, label: step.label, mark: step.mark, item: step.item, viewport: width })

        await page.getByTestId('textbook-item-' + step.item).click()
        await page.getByTestId('inline-choice-panel-' + step.item).getByRole('button', { name: step.correct, exact: true }).click()
        await expect(page.getByTestId('resolved-' + step.item)).toBeVisible()
      }

      const endingStorage = await page.evaluate(() => localStorage.getItem('kyotsu-step-store'))
      expect(endingStorage, 'review capture must not alter learner progress').toBe(initialStorage)
      if (mobile) {
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow).toBeLessThanOrEqual(1)
      }
      writeFileSync(
        `e2e-evidence/${target.route}-manifest-${mobile ? 'mobile' : 'desktop'}.json`,
        JSON.stringify({ target: target.route, buildSha: sha, capturedAtUtc: new Date().toISOString(), project: info.project.name, evidence }, null, 2) + '\n',
      )
    })
  }
})
