import { mkdirSync } from 'node:fs'
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
    const pictured = new Set<string>()
    async function captureFigureWhenUnlocked() {
      for (const fig of figureIds) {
        if (pictured.has(fig)) continue
        const locator = page.getByTestId('textbook-figure-' + fig)
        if (await locator.count() === 0) continue
        await expect(locator).toBeVisible()
        pictured.add(fig)
        if (evidence) {
          await locator.scrollIntoViewIfNeeded()
          await page.screenshot({ path: 'e2e-evidence/n' + n + '-figure-' + fig + '-' + device + '.png', fullPage: false })
        }
      }
    }
    for (const fig of figureIds) {
      const locator = page.getByTestId('textbook-figure-' + fig)
      if (fig === 'n08-f01' || fig === 'n11-f01') await expect(locator).toBeVisible()
      else await expect(locator).toHaveCount(0)
    }
    await captureFigureWhenUnlocked()

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
      await captureFigureWhenUnlocked()
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


// W-MATH-014/P-001 — original N14 Q07: two sign-case thinking decisions
// plus the unchanged original final four-choice interval. Actual screenshots
// are written only when the existing native evidence workflow enables it.
for(const width of [320,390]){
  test('W-MATH-014 N14 Q07 sign-case proof, wrong/hint/retry and persisted choices at '+width+'px',
    async({page},testInfo)=>{
      test.skip(testInfo.project.name!=='mobile-chromium','Capture once per requested viewport')
      test.setTimeout(240_000)
      await page.setViewportSize({width,height:850})
      const unit=mathTextbookUnits.find(u=>u.unitId.endsWith('n14'))!
      const items=unit.sections[0].items
      const ids=['n14-wm014-q07-nonnegative','n14-wm014-q07-negative','n14-07']
      expect(unit.revision).toBe(4)
      expect(items.slice(6,9).map(i=>i.id)).toEqual(ids)
      await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n14')
      await page.evaluate(()=>localStorage.clear())
      await page.reload()
      await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
      for(const item of items.slice(0,6)){
        const trigger=page.getByTestId('textbook-item-'+item.id)
        await expect(trigger,item.id).toBeVisible()
        await trigger.click()
        const panel=page.getByTestId('inline-choice-panel-'+item.id)
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+item.id)).toBeVisible()
      }
      const evidence=process.env.E2E_BATCH_EVIDENCE==='1'
      if(evidence)mkdirSync('e2e-evidence',{recursive:true})
      for(const id of ids){
        const item=items.find(z=>z.id===id)!
        const trigger=page.getByTestId('textbook-item-'+id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        let panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(panel).toBeVisible()
        const correct=panel.getByRole('button',{name:item.answer,exact:true})
        await expect(correct).toBeVisible()
        const correctID=await correct.getAttribute('data-testid')
        for(const option of await panel.locator('.reading-choice-option').all())
          for(const line of await option.locator('.reading-choice-formula-line').all()){
            const dimensions=await line.evaluate(node=>[node.scrollWidth,node.clientWidth])
            expect(dimensions[0],id+' choice clipping').toBeLessThanOrEqual(dimensions[1]+1)
          }
        if(evidence){
          await trigger.scrollIntoViewIfNeeded()
          await page.screenshot({path:'e2e-evidence/wmath014-'+id+'-'+width+'-before.png'})
        }
        const options=await panel.getByRole('button').all()
        let wrong:(typeof options)[number]|undefined
        for(const option of options){
          if((await option.getAttribute('data-testid'))!==correctID){wrong=option;break}
        }
        expect(wrong).toBeDefined()
        await wrong!.click()
        await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
        await trigger.click()
        panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
        if(evidence)await page.screenshot({
          path:'e2e-evidence/wmath014-'+id+'-'+width+'-wrong.png',
        })
        await panel.getByRole('button',{name:item.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
        await expect(page.locator('.katex-error')).toHaveCount(0)
        const bounds=await page.evaluate(()=>[
          document.documentElement.scrollWidth,document.documentElement.clientWidth,
        ])
        expect(bounds[0],id+' horizontal overflow').toBeLessThanOrEqual(bounds[1]+2)
        if(evidence)await page.screenshot({
          path:'e2e-evidence/wmath014-'+id+'-'+width+'-resolved.png',
        })
      }
      await expect(page.getByTestId('textbook-item-n14-08')).toBeVisible()
      await page.reload()
      for(const id of ids)await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      await expect(page.getByTestId('textbook-figure-n14-f01')).toBeVisible()
    })
}
