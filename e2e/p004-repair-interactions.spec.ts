import { expect, test } from '@playwright/test'
import { mathTextbookUnits } from '../src/data/textbook/math'

/** P-004: genuine learner-choice checks for repaired source questions, no hosting/deploy. */
const repaired = [
  ['04', 'n04-13'], ['05', 'n05-17'], ['06', 'n06-08'],
  ['07', 'n07-06'], ['08', 'n08-05'], ['11', 'n11-05'],
  ['14', 'n14-06'], ['14', 'n14-11'],
  ['06', 'n06-11'], ['14', 'n14-05'],
  // P-004-R2: eleven newly approved source-cognitive repairs.
  ['06', 'n06-01'], ['06', 'n06-05'], ['07', 'n07-09'],
  ['08', 'n08-02'], ['11', 'n11-06'], ['11', 'n11-08'],
  ['11', 'n11-09'], ['11', 'n11-13'], ['14', 'n14-10'],
  ['14', 'n14-14'], ['14', 'n14-15'],
  // P-004-R5: approved three source-cognitive compound response repairs.
  ['06', 'n06-15'], ['08', 'n08-10'], ['13', 'n13-08'],
] as const

const r2Ids = new Set(['n06-01', 'n06-05', 'n07-09', 'n08-02', 'n11-06', 'n11-08', 'n11-09', 'n11-13', 'n14-10', 'n14-14', 'n14-15'])
const r5Ids = new Set(['n06-15', 'n08-10', 'n13-08'])
if (r2Ids.size !== 11 || r5Ids.size !== 3 || repaired.length !== 24) throw new Error('P-004/R2 source repair list changed unexpectedly')

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
      const prefix = r5Ids.has(id) ? 'p004-r5-' : r2Ids.has(id) ? 'p004-r2-' : 'p004-'
      for (const item of items) {
        const trigger = page.getByTestId('textbook-item-' + item.id)
        await expect(trigger, item.id).toBeVisible()
        await trigger.click()
        const panel = page.getByTestId('inline-choice-panel-' + item.id)
        await expect(panel).toBeVisible()
        let correct = panel.getByRole('button', { name: item.answer, exact: true })
        await expect(correct).toBeVisible()
        if (item.id === id && r5Ids.has(id) && id !== 'n13-08') {
          const options = panel.locator('.reading-choice-option')
          expect(await options.count()).toBeGreaterThanOrEqual(2)
          for (const option of await options.all()) {
            const rows = option.locator('.reading-choice-formula-line')
            await expect(rows).toHaveCount(2)
            for (const line of await rows.all()) {
              const [whole, visible] = await line.evaluate(element =>
                [element.scrollWidth, element.clientWidth])
              expect(whole, id + ' clipped source operation at ' + width + 'px')
                .toBeLessThanOrEqual(visible + 1)
            }
          }
        }
        // W-MATH-023/P-002 Stage B supersedes original compound-answer R5
        // only for N13-Q08: now n13-08 is ONE root (x=-2), not two formula rows.
        // Earlier two-line combined R5 behavior remains tested historically by
        // revision2 fixture and current N06/N08 R5 source repairs.
        if (item.id === id && id === 'n13-08') {
          const options=panel.locator('.reading-choice-option')
          expect(await options.count()).toBeGreaterThanOrEqual(2)
          for (const option of await options.all()) {
            const rows=option.locator('.reading-choice-formula-line')
            await expect(rows).toHaveCount(1)
            const line=rows.first()
            const size=await line.evaluate(e=>[e.scrollWidth,e.clientWidth])
            expect(size[0],id+' single-root option clipped at '+width+'px').toBeLessThanOrEqual(size[1]+1)
          }
        }
        if (item.id === id && id === 'n07-09') {
          // P-004-R3: page-level overflow PASS alone misses clipped formula rows.
          // The original three decisions must each be visible WITHOUT inner scrolling.
          const options = panel.locator('.reading-choice-option')
          expect(await options.count()).toBeGreaterThanOrEqual(2)
          for (const option of await options.all()) {
            const rows = option.locator('.reading-choice-formula-line')
            await expect(rows).toHaveCount(3)
            for (const line of await rows.all()) {
              const [whole, visible] = await line.evaluate(element =>
                [element.scrollWidth, element.clientWidth])
              expect(whole, 'N07-Q09 inner clipped math row at ' + width + 'px')
                .toBeLessThanOrEqual(visible + 1)
            }
          }
        }
        if (item.id === id) {
          const hint = page.getByTestId('textbook-hint-' + id)
          await expect(hint).toHaveCount(0)
          if (save) {
            await trigger.scrollIntoViewIfNeeded()
            await page.screenshot({ path: 'e2e-evidence/' + prefix + id + '-' + width + '-before.png' })
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
          // The canonical renderer intentionally closes the panel after a wrong
          // attempt. The learner taps "もう一度" and then sees the hint.
          await expect(page.getByTestId('inline-choice-panel-' + id)).toHaveCount(0)
          await expect(page.getByTestId('resolved-' + id)).toHaveCount(0)
          await expect(trigger).toHaveAttribute('class', /--wrong/)
          await trigger.click()
          const retryPanel = page.getByTestId('inline-choice-panel-' + id)
          await expect(retryPanel).toBeVisible()
          await expect(hint).toBeVisible()
          if (save) {
            await page.screenshot({ path: 'e2e-evidence/' + prefix + id + '-' + width + '-wrong.png' })
          }
          correct = retryPanel.getByRole('button', { name: item.answer, exact: true })
        }
        await correct.click()
        await expect(page.getByTestId('resolved-' + item.id)).toBeVisible()
        if (item.id === id && id === 'n11-13') {
          // W-MATH-017/P-008 supersedes P-004/R4's completed two-line
          // operation+inequality card ONLY for N11-Q13. The currently graded
          // result is the coefficient 6 inside the final inequality; its four
          // local decisions have their own dedicated real Chromium test.
          // Preserve this original wrong/hint/retry + mobile screenshot test.
          const localAnswer = page.getByTestId('resolved-' + id)
          await expect(localAnswer).toBeVisible()
          const size = await localAnswer.evaluate(element =>
            [element.scrollWidth, element.clientWidth])
          expect(size[0], 'P-008 Q13 coefficient answer clipped at ' + width + 'px')
            .toBeLessThanOrEqual(size[1] + 1)
        }
        if(item.id === id && id === 'n14-14'){
          // W-MATH-019/P-001 supersedes the old combined Q14 card:
          // the same stable ID now means only the computed left endpoint -2.
          const answer=page.getByTestId('resolved-'+id)
          await expect(answer).toBeVisible()
          await expect(answer.locator('.reading-formula-n12-answer-lines > span')).toHaveCount(0)
          const box=await answer.evaluate(element=>[element.scrollWidth,element.clientWidth])
          expect(box[0], 'Q14 local endpoint clipped at '+width+'px').toBeLessThanOrEqual(box[1]+1)
        }
        if(item.id===id && id==='n14-15'){
          // W-MATH-020/P-001 supersedes the old Q15 combined card.
          const answer=page.getByTestId('resolved-'+id)
          await expect(answer).toBeVisible()
          await expect(answer.locator('.reading-formula-n12-answer-lines > span')).toHaveCount(0)
          const box=await answer.evaluate(element=>[element.scrollWidth,element.clientWidth])
          expect(box[0],'Q15 local fractional endpoint clipped at '+width+'px').toBeLessThanOrEqual(box[1]+1)
        }
        if (item.id === id && r5Ids.has(id) && id !== 'n13-08') {
          // P-004-R4: the 320/390px *resolved* white formula card must
          // show operation and inequality as two distinct, fully readable rows.
          const answer = page.getByTestId('resolved-' + id)
          const lines = answer.locator('.reading-formula-n12-answer-lines > span')
          await expect(lines).toHaveCount(2)
          for (const line of await lines.all()) {
            const box = await line.evaluate(element => ({
              actual: element.scrollWidth, viewport: element.clientWidth,
              rendered: element.getBoundingClientRect().width,
            }))
            expect(box.viewport, id + ' zero-width resolved line').toBeGreaterThan(0)
            expect(box.actual, id + ' clipped resolved math line at ' + width + 'px')
              .toBeLessThanOrEqual(box.viewport + 1)
          }
        }
        if(item.id===id && id==='n13-08'){
          const answer=page.getByTestId('resolved-'+id)
          const rows=answer.locator('.reading-formula-n12-answer-lines > span')
          await expect(rows).toHaveCount(0)
          const box=await answer.evaluate(e=>[e.scrollWidth,e.clientWidth])
          expect(box[0],id+' one-root resolved answer clipped at '+width+'px').toBeLessThanOrEqual(box[1]+1)
        }
        if (item.id === id) {
          await expect(page.locator('.katex-error')).toHaveCount(0)
          const widths = await page.evaluate(() => [
            document.documentElement.scrollWidth, document.documentElement.clientWidth,
          ])
          expect(widths[0], id + ' overflow at ' + width + 'px').toBeLessThanOrEqual(widths[1] + 2)
          if (save) {
            await page.screenshot({ path: 'e2e-evidence/' + prefix + id + '-' + width + '-resolved.png' })
          }
          await page.reload()
          await expect(page.getByTestId('resolved-' + id)).toBeVisible()
          break
        }
      }
    })
  }
}
