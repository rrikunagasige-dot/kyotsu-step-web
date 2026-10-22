import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { mathNumbersN14Unit } from '../src/data/textbook/math/numbers/n14Lesson'

test.describe('W-MATH-022/P-001 Q16 real source-SHA review', () => {
  test.skip(process.env.E2E_WM022_GATE1 !== '1', 'Explicit GitHub Q16 Gate① job only')
  for (const width of [320, 390, 1440] as const) {
    test('numbered real Q16 app capture / wrong-hint-retry '+width, async ({page}, info) => {
      test.skip(width === 1440
        ? info.project.name !== 'desktop-chromium'
        : info.project.name !== 'mobile-chromium')
      test.setTimeout(180_000)
      await page.setViewportSize({width,height:width===1440?1000:850})
      const sha=process.env.VITE_PREVIEW_COMMIT
      expect(sha).toMatch(/^[0-9a-f]{40}$/)
      const ids=['n14-wm022-q16-left-inner','n14-wm022-q16-left-abs',
        'n14-wm022-q16-right-inner','n14-wm022-q16-right-abs','n14-16']
      mkdirSync('e2e-evidence',{recursive:true})
      await page.goto('/kyotsu-step-web/#/review/n14-q16')
      await expect(page.getByTestId('review-preview-ready')).toBeVisible()
      await expect(page.getByTestId('review-preview-sha')).toContainText(sha!)
      await expect(page.getByTestId('review-preview-count')).toContainText('0/5')
      await expect(page.getByTestId('review-preview-count')).toContainText('全38穴')
      const baseline=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
      await page.getByTestId('textbook-item-'+ids[0]).scrollIntoViewIfNeeded()
      await page.screenshot({path:'e2e-evidence/q16-review-before-'+width+'.png',fullPage:true})
      for(const [index,id] of ids.entries()){
        const q=mathNumbersN14Unit.sections[0].items.find(z=>z.id===id)!
        const trigger=page.getByTestId('textbook-item-'+id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        const panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(panel).toBeVisible()
        const wrong=q.choices!.find(x=>x!==q.answer)!
        await panel.getByRole('button',{name:wrong,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
        await trigger.click()
        await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
        if(index===0)await page.screenshot({path:'e2e-evidence/q16-review-wrong-'+width+'.png',fullPage:true})
        await panel.getByRole('button',{name:q.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
        await expect(page.getByTestId('review-preview-count')).toContainText((index+1)+'/5')
      }
      await expect(page.locator('.review-marked-block')).toHaveCount(3)
      await expect(page.getByText('左端も右端も絶対値が4となり')).toBeVisible()
      await expect(page.locator('.katex-error')).toHaveCount(0)
      await page.screenshot({path:'e2e-evidence/q16-review-complete-'+width+'.png',fullPage:true})
      const after=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
      expect(after).toBe(baseline)
      const dims=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth])
      expect(dims[0]).toBeLessThanOrEqual(dims[1]+2)
    })
    test('ordinary Q15→Q16 source and mobile fit '+width,async({page},info)=>{
      test.skip(width===1440
        ? info.project.name!=='desktop-chromium'
        : info.project.name!=='mobile-chromium')
      test.setTimeout(240_000)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/kyotsu-step-web/#/learning/textbook/math-numbers-expressions-n14')
      await page.evaluate(()=>localStorage.clear())
      await page.reload()
      const items=mathNumbersN14Unit.sections[0].items
      for(const q of items.slice(0,33)){
        const trigger=page.getByTestId('textbook-item-'+q.id)
        await expect(trigger,q.id).toBeVisible()
        await trigger.click()
        await page.getByTestId('inline-choice-panel-'+q.id).getByRole('button',{name:q.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
      }
      const first=page.getByTestId('textbook-item-n14-wm022-q16-left-inner')
      await expect(first).toBeVisible()
      await first.scrollIntoViewIfNeeded()
      await page.screenshot({path:'e2e-evidence/q16-normal-before-'+width+'.png'})
      const q16=items.slice(33)
      for(const q of q16){
        const trigger=page.getByTestId('textbook-item-'+q.id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        await page.getByTestId('inline-choice-panel-'+q.id).getByRole('button',{name:q.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
      }
      await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
      await expect(page.locator('.katex-error')).toHaveCount(0)
      await page.screenshot({path:'e2e-evidence/q16-normal-complete-'+width+'.png'})
      const dims=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth])
      expect(dims[0]).toBeLessThanOrEqual(dims[1]+2)
      await page.reload()
      for(const q of q16)await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
    })
  }
})
