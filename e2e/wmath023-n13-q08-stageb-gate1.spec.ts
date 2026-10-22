import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { mathNumbersN13Unit } from '../src/data/textbook/math/numbers/n13Lesson'

const ids=['n13-wm023-q08-branches','n13-wm023-q08-positive-root','n13-08']
const unit=mathNumbersN13Unit
const section=unit.sections[0]
const screenshot=async(page:import('@playwright/test').Page,state:string,width:number)=>{
  mkdirSync('e2e-evidence',{recursive:true})
  await page.screenshot({path:'e2e-evidence/wm023-q08-'+state+'-'+width+'.png'})
}
const mobileOverflow=async(page:import('@playwright/test').Page,width:number)=>{
  const d=await page.evaluate(()=>({
    scroll:document.documentElement.scrollWidth,
    client:document.documentElement.clientWidth,
    katexErrors:document.querySelectorAll('.katex-error').length,
  }))
  expect(d.katexErrors,'invalid KaTeX').toBe(0)
  expect(d.scroll,'horizontal overflow at '+width).toBeLessThanOrEqual(d.client+2)
}

test.describe('W-MATH-023/P-002 Stage B real exact-SHA Q08 review',()=>{
  for(const width of [320,390,1440] as const){
    test('Q08 3 numbered choices, wrong-hint-retry, no persisted preview '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM023_Q08!=='1','dedicated GitHub Q08 screenshot check')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      test.setTimeout(180_000)
      const sha=process.env.CAPTURE_SHA??''
      expect(sha).toMatch(/^[0-9a-f]{40}$/)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/review/n13-q08')
      await expect(page.getByTestId('review-preview-ready')).toBeVisible()
      await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
      await expect(page.getByTestId('review-preview-count')).toContainText('0/3')
      await expect(page.getByTestId('review-preview-count')).toContainText('全12穴')
      await expect(page.getByTestId('review-mark-n13-formula-08')).toContainText('確認①')
      await expect(page.getByTestId('review-mark-n13-wm023-q08-positive-root')).toHaveCount(0)
      await expect(page.getByTestId('review-mark-n13-wm023-q08-negative-root')).toHaveCount(0)
      expect(unit.revision).toBe(4)
      expect(section.items).toHaveLength(12)
      const before=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
      await page.getByTestId('textbook-item-'+ids[0]).scrollIntoViewIfNeeded()
      await mobileOverflow(page,width)
      await screenshot(page,'review-before',width)
      for(let i=0;i<ids.length;i++){
        const id=ids[i]
        const q=section.items.find(z=>z.id===id)!
        const trigger=page.getByTestId('textbook-item-'+id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        const panel=page.getByTestId('inline-choice-panel-'+id)
        await expect(panel).toBeVisible()
        const wrong=q.choices!.find(c=>c!==q.answer)!
        await panel.getByRole('button',{name:wrong,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
        await trigger.click()
        await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
        if(i===0)await screenshot(page,'review-wrong',width)
        await panel.getByRole('button',{name:q.answer,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
        await expect(page.getByTestId('review-preview-count')).toContainText((i+1)+'/3')
        if(i===0)await expect(page.getByTestId('review-mark-n13-wm023-q08-positive-root')).toContainText('確認②')
        if(i===1)await expect(page.getByTestId('review-mark-n13-wm023-q08-negative-root')).toContainText('確認③')
        await mobileOverflow(page,width)
      }
      await expect(page.getByText('二つの解は「または」で結ぶ。')).toBeVisible()
      await screenshot(page,'review-complete',width)
      expect(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))).toBe(before)
      await expect(page.locator('.review-marked-block')).toHaveCount(3)
    })

    test('normal lesson approved Q05 preserved, Q08 has three gates, reload '+width,async({page},info)=>{
      test.skip(process.env.E2E_WM023_Q08!=='1','dedicated GitHub Q08 screenshot check')
      test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
      test.setTimeout(240_000)
      await page.setViewportSize({width,height:width===1440?1000:850})
      await page.goto('/#/learning/textbook/math-numbers-expressions-n13')
      await page.evaluate(()=>localStorage.clear())
      await page.reload()
      const list=section.items
      expect(list.slice(8,11).map(i=>i.id)).toEqual(ids)
      const solve=async(id:string,value:string)=>{
        const trigger=page.getByTestId('textbook-item-'+id)
        await expect(trigger).toBeVisible()
        await trigger.click()
        await page.getByTestId('inline-choice-panel-'+id).getByRole('button',{name:value,exact:true}).click()
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      }
      for(const prior of list.slice(0,8))await solve(prior.id,prior.answer)
      await expect(page.getByTestId('resolved-n13-wm023-q05-right')).toBeVisible()
      await expect(page.getByTestId('resolved-n13-05')).toBeVisible()
      await expect(page.getByTestId('textbook-item-'+ids[0])).toBeVisible()
      await expect(page.getByTestId('textbook-item-'+ids[1])).toHaveCount(0)
      await page.getByTestId('textbook-item-'+ids[0]).scrollIntoViewIfNeeded()
      await mobileOverflow(page,width)
      await screenshot(page,'normal-before',width)
      for(let i=0;i<ids.length;i++){
        const id=ids[i],q=list.find(x=>x.id===id)!
        await solve(id,q.answer)
        if(i<2)await expect(page.getByTestId('textbook-item-'+ids[i+1])).toBeVisible()
      }
      await expect(page.getByTestId('textbook-item-n13-09')).toBeVisible()
      await mobileOverflow(page,width)
      await screenshot(page,'normal-complete',width)
      await page.reload()
      for(const id of [...list.slice(0,8).map(i=>i.id),...ids])
        await expect(page.getByTestId('resolved-'+id)).toBeVisible()
    })
  }
})