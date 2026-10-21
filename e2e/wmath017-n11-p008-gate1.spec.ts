import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { mathNumbersN11Unit } from '../src/data/textbook/math/numbers/n11Lesson'

const steps=[
 {id:'n11-p008-q13-mul-left',answer:'3',mark:'n11-formula-13'},
 {id:'n11-p008-q13-mul-right',answer:'3',mark:'n11-formula-13'},
 {id:'n11-13',answer:'6',mark:'n11-p008-q13-result'},
 {id:'n11-p008-q13-constant',answer:'3',mark:'n11-p008-q13-result'},
] as const
const widths=[320,390,1440] as const

test.describe('W-MATH-017/P-008 exact-SHA four-row real-app Q13 Gate①',()=>{
 for(const width of widths){
  test('numbered real Q13 review at '+width,async({page},info)=>{
   test.skip(process.env.E2E_WM017_GATE1!=='1','Only original GitHub Gate1 evidence')
   test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
   test.setTimeout(180_000)
   const sha=process.env.CAPTURE_SHA||''
   expect(sha).toMatch(/^[0-9a-f]{40}$/)
   await page.setViewportSize({width,height:width===1440?1000:850})
   await page.goto('/#/review/n11-q13')
   await expect(page.getByTestId('review-preview-ready')).toBeVisible()
   await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
   mkdirSync('e2e-evidence',{recursive:true})
   for(const old of ['n11-p006-q05-cancel-explain','n11-p007-q08-explain','n11-p007-q09-explain'])
     await expect(page.getByTestId('review-mark-'+old)).toHaveCount(0)
   for(let i=0;i<steps.length;i++){
    const {id,answer,mark}=steps[i]
    const trigger=page.getByTestId('textbook-item-'+id)
    await expect(trigger).toBeVisible()
    await expect(page.getByTestId('review-mark-'+mark)).toBeVisible()
    if(i<2){
     await expect(page.getByTestId('review-mark-n11-p008-q13-positive-explain')).toHaveCount(0)
     await expect(page.getByTestId('textbook-item-n11-13')).toHaveCount(0)
    }
    await trigger.scrollIntoViewIfNeeded()
    await page.screenshot({path:'e2e-evidence/p008-review-step-'+(i+1)+'-before-'+width+'.png',fullPage:false})
    await trigger.click()
    const panel=page.getByTestId('inline-choice-panel-'+id)
    await expect(panel).toBeVisible()
    const right=panel.getByRole('button',{name:answer,exact:true})
    const correctId=await right.getAttribute('data-testid')
    const options=await panel.getByRole('button').all()
    const wrongs=await Promise.all(options.map(o=>o.getAttribute('data-testid')))
    const wrong=options.find((_,k)=>wrongs[k]!==correctId)
    expect(wrong).toBeDefined()
    await wrong!.click()
    await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
    await trigger.click()
    await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
    await page.screenshot({path:'e2e-evidence/p008-review-step-'+(i+1)+'-wrong-'+width+'.png',fullPage:false})
    await panel.getByRole('button',{name:answer,exact:true}).click()
    await expect(page.getByTestId('resolved-'+id)).toBeVisible()
    await page.screenshot({path:'e2e-evidence/p008-review-step-'+(i+1)+'-resolved-'+width+'.png',fullPage:false})
    await expect(page.locator('.katex-error')).toHaveCount(0)
    if(width!==1440)
     expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2)
   }
   await expect(page.getByTestId('review-preview-count')).toContainText('4/4')
   writeFileSync('e2e-evidence/p008-review-manifest-'+width+'.json',JSON.stringify({sha,width,steps},null,2)+'\n')
  })

  test('normal Q01 to Q14 gating and math captions at '+width,async({page},info)=>{
   test.skip(process.env.E2E_WM017_GATE1!=='1','Only exact real source capture')
   test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
   test.setTimeout(240_000)
   const sha=process.env.CAPTURE_SHA||''
   expect(sha).toMatch(/^[0-9a-f]{40}$/)
   await page.setViewportSize({width,height:width===1440?1000:850})
   await page.goto('/#/learning/textbook/math-numbers-expressions-n11')
   await page.evaluate(()=>localStorage.clear())
   await page.reload()
   await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
   mkdirSync('e2e-evidence',{recursive:true})
   const first=mathNumbersN11Unit.sections[0].items.findIndex(i=>i.id===steps[0].id)
   expect(first).toBeGreaterThan(15)
   const answer=async(id:string,key:string)=>{
    const t=page.getByTestId('textbook-item-'+id)
    await expect(t).toBeVisible()
    await t.click()
    await page.getByTestId('inline-choice-panel-'+id).getByRole('button',{name:key,exact:true}).click()
    await expect(page.getByTestId('resolved-'+id)).toBeVisible()
   }
   for(const old of mathNumbersN11Unit.sections[0].items.slice(0,first))await answer(old.id,old.answer)
   const chain=page.locator('[data-derivation-id="n11-q13-chain"]')
   const reasons=chain.locator('.reading-derivation-step--paragraph')
   const shot=async(label:string,id:string)=>{
    const t=page.getByTestId('textbook-item-'+id)
    if(await t.count())await t.scrollIntoViewIfNeeded()
    await expect(page.locator('.review-marked-block')).toHaveCount(0)
    await expect(page.locator('.katex-error')).toHaveCount(0)
    if(width!==1440)
     expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2)
    await page.screenshot({path:'e2e-evidence/p008-normal-'+label+'-'+width+'.png',fullPage:false})
   }
   await expect(reasons).toHaveCount(0)
   await expect(chain.locator('.reading-formula-line')).toHaveCount(2)
   await shot('q13-mul-left-before',steps[0].id)
   await answer(steps[0].id,steps[0].answer)
   await shot('q13-mul-right-before',steps[1].id)
   await expect(reasons).toHaveCount(0)
   await answer(steps[1].id,steps[1].answer)
   await expect(reasons).toHaveCount(2)
   await expect(reasons.nth(0)).toContainText('3は正の数なので')
   await expect(reasons.nth(1)).toContainText('二つの項それぞれに')
   await expect(chain.locator('.reading-formula-line')).toHaveCount(4)
   await shot('q13-xcoef-before',steps[2].id)
   // Both holes intentionally share one equation row: the second gap is
   // visible before the coefficient is solved, but Q14 remains gated.
   await expect(page.getByTestId('textbook-item-n11-p008-q13-constant')).toBeVisible()
   await expect(page.getByTestId('textbook-item-n11-wm013-q14-xcoef')).toHaveCount(0)
   await answer(steps[2].id,steps[2].answer)
   await shot('q13-constant-before',steps[3].id)
   await expect(page.getByTestId('textbook-item-n11-wm013-q14-xcoef')).toHaveCount(0)
   await answer(steps[3].id,steps[3].answer)
   await shot('q13-resolved','n11-wm013-q14-xcoef')
   await expect(page.getByTestId('textbook-item-n11-wm013-q14-xcoef')).toBeVisible()
   writeFileSync('e2e-evidence/p008-normal-manifest-'+width+'.json',JSON.stringify({sha,width,original:'N11-Q13',steps},null,2)+'\n')
  })
 }
})
