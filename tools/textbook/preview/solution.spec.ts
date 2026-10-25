import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import type { SolutionReading } from '../../../src/domain/solutionReading'
const examples = Object.fromEntries(['linear', 'square', 'extrema'].map(name => [name, JSON.parse(readFileSync(new URL(`../fixtures/solution-generated/${name}-reading.json`, import.meta.url), 'utf8'))])) as Record<string, SolutionReading>
const artifactDir = 'work/items/W-GOV-011-solution-production/verification'
const cases = [
  { family: 'linear', answers: [['0', '4'], ['1', '6'], ['2', '3'], ['3', '2']] },
  { family: 'square', answers: [['0', '9'], ['2', '-4']] },
  { family: 'extrema', answers: [['1', '2']] },
]
for (const width of [320, 390, 430, 1440]) {
  for (const { family, answers } of cases) {
    test(`${family} whole solution at ${width}`, async ({ page }) => {
      const errors: string[] = []; page.on('pageerror', e => errors.push(e.message))
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/tools/textbook/preview/solution.html?family=${family}`)
      const reading = page.locator('[data-solution-problem]')
      await expect(reading).toBeVisible()
      await expect(page.locator('.solution-summary')).toHaveCount(0)
      await expect(page.locator('[data-figure-id]')).toHaveCount(0)
      for (const [i] of answers) {
        const question = `fixture-${family}-answer${i}`
        const button = page.getByTestId(`solution-answer-${question}`)
        await expect(button).toBeVisible()
        if (i === answers[0][0]) {
          await button.focus(); await page.keyboard.press('Enter')
          await page.locator('.solution-hint').click()
          await expect(page.locator('.solution-choice-panel p')).toHaveCount(1)
          await page.locator(`[data-choice-id="${question}-c1"]`).click()
          await expect(button).toBeVisible()
          await expect(page.getByRole('status')).toContainText('確かめよう')
        } else await button.click()
        await page.locator(`[data-choice-id="${question}-c0"]`).click()
        await expect(button).toHaveCount(0)
      }
      await expect(page.locator('.solution-summary')).toBeVisible()
      if (family === 'extrema') await expect(page.locator('[data-figure-id]')).toBeVisible()
      await page.reload()
      await expect(page.locator('.solution-summary')).toBeVisible()
      await expect(page.locator('.solution-math-button')).toHaveCount(0)
      const problem = examples[family].problems[0]
      const expected = [problem.initial.id, ...problem.prompt.map(p => p.id), ...problem.conditions.map(p => p.id), ...problem.steps.flatMap(s => [s.id, s.afterId, s.formula.id, ...[...s.purpose, ...s.reason, ...s.afterText, ...s.promptParts].map(p => p.id)])]
      const actual = await reading.evaluate(element => [...element.querySelectorAll('[data-semantic-id],[data-state-id],[data-step-id],[data-equation-id]')].flatMap(e => ['data-semantic-id', 'data-state-id', 'data-step-id', 'data-equation-id'].flatMap(attr => e.getAttribute(attr) ? [e.getAttribute(attr)!] : [])))
      expect(expected.filter(id => !actual.includes(id))).toEqual([])
      await page.locator('.solution-summary summary').click()
      const layout = await page.evaluate(() => ({
        width: innerWidth, documentWidth: document.documentElement.scrollWidth,
        errors: document.querySelectorAll('.katex-error').length,
        formulas: [...document.querySelectorAll('.solution-equation')].every(element => {
          const math = element.querySelector('.solution-math'), number = element.querySelector('.solution-number')
          return !math || !number || math.getBoundingClientRect().right <= number.getBoundingClientRect().left
        }),
      }))
      expect(layout.documentWidth).toBeLessThanOrEqual(layout.width)
      expect(layout.errors).toBe(0); expect(layout.formulas).toBe(true); expect(errors).toEqual([])
      await mkdir(artifactDir, { recursive: true })
      await page.screenshot({ path: `${artifactDir}/${family}-${width}.png`, fullPage: true })
      await page.setViewportSize({ width: width === 320 ? 430 : 320, height: 900 })
      await expect(page.locator('.solution-summary')).toBeVisible()
    })
  }
}
