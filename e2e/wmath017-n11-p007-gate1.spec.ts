import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { mathNumbersN11Unit } from '../src/data/textbook/math/numbers/n11Lesson'

const steps=[
  {id:'n11-p007-q08-subtract-left',answer:'3',mark:'n11-formula-08'},
  {id:'n11-p007-q08-subtract-right',answer:'3',mark:'n11-formula-08'},
  {id:'n11-08',answer:'2',mark:'n11-after-08'},
  {id:'n11-p007-q09-direction',answer:'\\ge',mark:'n11-formula-09'},
  {id:'n11-09',answer:'-1',mark:'n11-formula-09'},
] as const
const widths=[320,390,1440] as const

test.describe('W-MATH-017 P007 exact-SHA Gate1 real Chromium Q08/Q09',()=>{
 for(const width of widths){
  test('numbered review decisions at '+width,async({page},testInfo)=>{
    test.skip(process.env.E2E_WM017_GATE1!=='1','Only evidence capture on approved review PR')
    test.skip(width===1440?testInfo.project.name!=='desktop-chromium':testInfo.project.name!=='mobile-chromium')
    test.setTimeout(180_000)
    const sha=process.env.CAPTURE_SHA||''
    expect(sha).toMatch(/^[0-9a-f]{40}$/)
    await page.setViewportSize({width,height:width===1440?1000:850})
    await page.goto('/#/review/n11-q08-q09')
    await expect(page.getByTestId('review-preview-ready')).toBeVisible()
    await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
    mkdirSync('e2e-evidence',{recursive:true})
    // P006's previously accepted yellow markers must never appear in P007.
    await expect(page.getByTestId('review-mark-n11-p006-q05-cancel-explain')).toHaveCount(0)
    await expect(page.getByTestId('review-mark-n11-p006-q06-positive-explain')).toHaveCount(0)
    for(let i=0;i<steps.length;i++){
      const {id,answer,mark}=steps[i]
      const trigger=page.getByTestId('textbook-item-'+id)
      await expect(trigger).toBeVisible()
      const marker=page.getByTestId('review-mark-'+mark)
      await expect(marker).toBeVisible()
      if(i<2){
        await expect(page.getByTestId('textbook-item-n11-08')).toHaveCount(0)
        await expect(page.getByTestId('review-mark-n11-p007-q08-explain')).toHaveCount(0)
      }
      if(i<3){
        await expect(page.getByTestId('textbook-item-n11-p007-q09-direction')).toHaveCount(0)
        await expect(page.getByTestId('review-mark-n11-p007-q09-explain')).toHaveCount(0)
      }
      await trigger.scrollIntoViewIfNeeded()
      const before='e2e-evidence/p007-review-step-'+(i+1)+'-before-'+width+'.png'
      await page.screenshot({path:before,fullPage:false})
      await trigger.click()
      const panel=page.getByTestId('inline-choice-panel-'+id)
      await expect(panel).toBeVisible()
      const choices=await panel.getByRole('button').all()
      const correct=panel.getByRole('button',{name:answer,exact:true})
      const correctTestId=await correct.getAttribute('data-testid')
      const wrongTestIds=await Promise.all(choices.map(b=>b.getAttribute('data-testid')))
      const wrong=choices.find((_,i)=>wrongTestIds[i]!==correctTestId)
      expect(wrong).toBeDefined()
      await wrong!.click()
      await expect(page.getByTestId('resolved-'+id)).toHaveCount(0)
      await trigger.click()
      await expect(page.getByTestId('textbook-hint-'+id)).toBeVisible()
      await page.screenshot({path:'e2e-evidence/p007-review-step-'+(i+1)+'-wrong-'+width+'.png',fullPage:false})
      await panel.getByRole('button',{name:answer,exact:true}).click()
      await expect(page.getByTestId('resolved-'+id)).toBeVisible()
      await page.screenshot({path:'e2e-evidence/p007-review-step-'+(i+1)+'-resolved-'+width+'.png',fullPage:false})
      await expect(page.locator('.katex-error')).toHaveCount(0)
      if(width!==1440){
        expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2)
      }
    }
    await expect(page.getByTestId('review-preview-count')).toContainText('5/5')
    writeFileSync('e2e-evidence/p007-review-manifest-'+width+'.json',JSON.stringify({sha,width,route:'/#/review/n11-q08-q09',steps},null,2)+'\n')
  })

  test('real ordinary lesson, question 8 to 10 and explanation gating at '+width,async({page},testInfo)=>{
    test.skip(process.env.E2E_WM017_GATE1!=='1','Only approved exact-source screenshot flow')
    test.skip(width===1440?testInfo.project.name!=='desktop-chromium':testInfo.project.name!=='mobile-chromium')
    test.setTimeout(180_000)
    const sha=process.env.CAPTURE_SHA||''
    expect(sha).toMatch(/^[0-9a-f]{40}$/)
    await page.setViewportSize({width,height:width===1440?1000:850})
    await page.goto('/#/learning/textbook/math-numbers-expressions-n11')
    await page.evaluate(()=>localStorage.clear())
    await page.reload()
    await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
    mkdirSync('e2e-evidence',{recursive:true})
    const first=mathNumbersN11Unit.sections[0].items.findIndex(i=>i.id===steps[0].id)
    expect(first).toBeGreaterThan(10)
    const answer=async(id:string,key:string)=>{
      const trigger=page.getByTestId('textbook-item-'+id)
      await expect(trigger).toBeVisible()
      await trigger.click()
      const panel=page.getByTestId('inline-choice-panel-'+id)
      await panel.getByRole('button',{name:key,exact:true}).click()
      await expect(page.getByTestId('resolved-'+id)).toBeVisible()
    }
    for(const old of mathNumbersN11Unit.sections[0].items.slice(0,first))await answer(old.id,old.answer)
    const chain=page.locator('[data-derivation-id="n11-q08-q09-chain"]')
    const reasons=chain.locator('.reading-derivation-step--paragraph')
    const screenshot=async(label:string,triggerId:string)=>{
      const trigger=page.getByTestId('textbook-item-'+triggerId)
      if(await trigger.count())await trigger.scrollIntoViewIfNeeded()
      await expect(page.locator('.review-marked-block')).toHaveCount(0)
      await expect(page.locator('.katex-error')).toHaveCount(0)
      if(width!==1440)expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2)
      await page.screenshot({path:'e2e-evidence/p007-normal-'+label+'-'+width+'.png',fullPage:false})
    }
    await screenshot('q08-left-before',steps[0].id)
    await expect(reasons).toHaveCount(0)
    await expect(chain.locator('.reading-formula-line')).toHaveCount(2)
    await answer(steps[0].id,steps[0].answer)
    await screenshot('q08-right-before',steps[1].id)
    await expect(reasons).toHaveCount(0)
    await answer(steps[1].id,steps[1].answer)
    await screenshot('q08-arithmetic-before',steps[2].id)
    await expect(reasons).toHaveCount(1)
    await expect(reasons.nth(0)).toContainText('左辺の＋3と−3を打ち消す')
    await expect(chain.locator('.reading-formula-line')).toHaveCount(3)
    await expect(page.getByTestId('textbook-item-n11-p007-q09-direction')).toHaveCount(0)
    await answer(steps[2].id,steps[2].answer)
    await screenshot('q09-direction-before',steps[3].id)
    await expect(reasons).toHaveCount(2)
    await expect(reasons.nth(1)).toContainText('不等号の向きが逆になる')
    await expect(chain.locator('.reading-formula-line')).toHaveCount(4)
    await expect(page.getByTestId('textbook-item-n11-10')).toHaveCount(0)
    await answer(steps[3].id,steps[3].answer)
    await screenshot('q09-quotient-before',steps[4].id)
    await expect(page.getByTestId('textbook-item-n11-10')).toHaveCount(0)
    await answer(steps[4].id,steps[4].answer)
    await screenshot('q09-finished','n11-10')
    await expect(page.getByTestId('textbook-item-n11-10')).toBeVisible()
    writeFileSync('e2e-evidence/p007-normal-manifest-'+width+'.json',JSON.stringify({sha,width,source:['N11-Q08','N11-Q09'],items:steps},null,2)+'\n')
  })
 }
})
