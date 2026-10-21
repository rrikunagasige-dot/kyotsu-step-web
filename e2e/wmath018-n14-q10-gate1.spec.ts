import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { mathNumbersN14Unit } from '../src/data/textbook/math/numbers/n14Lesson'

const steps=[
  {id:'n14-wm018-q10-add-left',answer:'3',mark:'n14-formula-10'},
  {id:'n14-wm018-q10-add-center',answer:'3',mark:'n14-formula-10'},
  {id:'n14-wm018-q10-add-right',answer:'3',mark:'n14-formula-10'},
  {id:'n14-10',answer:'-2',mark:'n14-wm018-q10-result'},
  {id:'n14-wm018-q10-bound-right',answer:'8',mark:'n14-wm018-q10-result'},
] as const
const widths=[320,390,1440] as const
const evidence='e2e-evidence/'

test.describe('W-MATH-018/P-001 exact-SHA genuine N14 Q10 Gate①',()=>{
 for(const width of widths){
  test('five numbered reviewer actions '+width,async({page},info)=>{
   test.skip(process.env.E2E_WM018_GATE1!=='1','Q10 approved PR review screenshots only')
   test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
   test.setTimeout(180_000)
   const sha=process.env.CAPTURE_SHA||''
   expect(sha).toMatch(/^[0-9a-f]{40}$/)
   await page.setViewportSize({width,height:width===1440?1000:850})
   await page.goto('/#/review/n14-q10')
   await expect(page.getByTestId('review-preview-ready')).toBeVisible()
   await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
   mkdirSync(evidence,{recursive:true})
   for(const earlier of ['n11-p006-q05-cancel-explain','n11-p007-q08-explain','n11-p008-q13-positive-explain'])
     await expect(page.getByTestId('review-mark-'+earlier)).toHaveCount(0)
   for(let i=0;i<steps.length;i++){
    const {id,answer,mark}=steps[i]
    const trigger=page.getByTestId('textbook-item-'+id)
    await expect(trigger).toBeVisible()
    await expect(page.getByTestId('review-mark-'+mark)).toBeVisible()
    if(i<3){
     await expect(page.getByTestId('review-mark-n14-wm018-q10-explain')).toHaveCount(0)
     await expect(page.getByTestId('textbook-item-n14-10')).toHaveCount(0)
    }
    await trigger.scrollIntoViewIfNeeded()
    await page.screenshot({path:evidence+'p001-review-'+(i+1)+'-before-'+width+'.png'})
    await trigger.click()
    const panel=page.getByTestId('inline-choice-panel-'+id)
    await expect(panel).toBeVisible()
    const correct=panel.getByRole('button',{name:answer,exact:true})
    const correctKey=await correct.getAttribute('data-testid')
    const options=await panel.getByRole('button').all()
    const keys=await Promise.all(options.map(x=>x.getAttribute('data-testid')))
    const bad=options.find((_,k)=>keys[k]!==correctKey)
    expect(bad).toBeDefined()
    await bad!.click()
    await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
    await trigger.click()
    await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
    await page.screenshot({path:evidence+'p001-review-'+(i+1)+'-wrong-'+width+'.png'})
    await panel.getByRole('button',{name:answer,exact:true}).click()
    await expect(page.getByTestId('resolved-'+id)).toBeVisible()
    await page.screenshot({path:evidence+'p001-review-'+(i+1)+'-resolved-'+width+'.png'})
    await expect(page.locator('.katex-error')).toHaveCount(0)
    if(width!==1440)
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2)
   }
   await expect(page.getByTestId('review-preview-count')).toContainText('5/5')
   writeFileSync(evidence+'p001-review-manifest-'+width+'.json',JSON.stringify({sha,width,steps},null,2)+'\n')
  })

  test('real normal N14 from Q01 to Q11 and exact equation layout '+width,async({page},info)=>{
   test.skip(process.env.E2E_WM018_GATE1!=='1','Q10 approved PR review screenshots only')
   test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
   test.setTimeout(240_000)
   const sha=process.env.CAPTURE_SHA||''
   expect(sha).toMatch(/^[0-9a-f]{40}$/)
   await page.setViewportSize({width,height:width===1440?1000:850})
   await page.goto('/#/learning/textbook/math-numbers-expressions-n14')
   await page.evaluate(()=>localStorage.clear())
   await page.reload()
   await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
   mkdirSync(evidence,{recursive:true})
   const src=mathNumbersN14Unit.sections[0]
   const first=src.items.findIndex(i=>i.id===steps[0].id)
   expect(first).toBeGreaterThan(9)
   const answer=async(id:string,key:string)=>{
     const trigger=page.getByTestId('textbook-item-'+id)
     await expect(trigger).toBeVisible()
     await trigger.click()
     await page.getByTestId('inline-choice-panel-'+id).getByRole('button',{name:key,exact:true}).click()
     await expect(page.getByTestId('resolved-'+id)).toBeVisible()
   }
   for(const prior of src.items.slice(0,first))await answer(prior.id,prior.answer)
   const chain=page.locator('[data-derivation-id="n14-q10-chain"]')
   const explanations=chain.locator('.reading-derivation-step--paragraph')
   const photo=async(label:string,id:string)=>{
     const trigger=page.getByTestId('textbook-item-'+id)
     if(await trigger.count())await trigger.scrollIntoViewIfNeeded()
     await expect(page.locator('.review-marked-block')).toHaveCount(0)
     await expect(page.locator('.katex-error')).toHaveCount(0)
     if(width!==1440)
       expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2)
     await page.screenshot({path:evidence+'p001-normal-'+label+'-'+width+'.png'})
   }
   await expect(chain.locator('.reading-formula-line')).toHaveCount(2)
   await expect(explanations).toHaveCount(0)
   await photo('left-before',steps[0].id)
   for(let i=0;i<3;i++){
     if(i!==0)await photo('addition-'+(i+1)+'-before',steps[i].id)
     await answer(steps[i].id,steps[i].answer)
     if(i<2){
       await expect(explanations).toHaveCount(0)
       await expect(page.getByTestId('textbook-item-n14-10')).toHaveCount(0)
     }
   }
   await expect(explanations).toHaveCount(1)
   await expect(explanations.first()).toContainText('三辺に同じ数を足しても')
   await expect(chain.locator('.reading-formula-line')).toHaveCount(3)
   await photo('left-bound-before',steps[3].id)
   await expect(page.getByTestId('textbook-item-n14-wm018-q10-bound-right')).toBeVisible()
   await expect(page.getByTestId('textbook-item-n14-11')).toHaveCount(0)
   await answer(steps[3].id,steps[3].answer)
   await photo('right-bound-before',steps[4].id)
   await expect(page.getByTestId('textbook-item-n14-11')).toHaveCount(0)
   await answer(steps[4].id,steps[4].answer)
   await photo('final','n14-11')
   await expect(page.getByTestId('textbook-item-n14-11')).toBeVisible()
   writeFileSync(evidence+'p001-normal-manifest-'+width+'.json',JSON.stringify({sha,width,source:'N14-Q10',steps},null,2)+'\n')
  })
 }
})
