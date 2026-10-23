import { mkdirSync,writeFileSync } from 'node:fs'
import { test,expect,type Page } from '@playwright/test'
import { mathNumbersN12Unit as unit } from '../src/data/textbook/math/numbers/n12Lesson'
import { reviewTargets,extractReviewSection } from '../src/review/reviewTargets'
import { getTextbookChoices } from '../src/domain/textbook'
const cases=[
 {id:'n12-p002-q06-left-coef',target:'n12-q06-coef-hint',block:'formula-q06-left-coef'},
 {id:'n12-p002-q12-signed-coef',target:'n12-q12-coef-hint',block:'formula-q12-signed-coef'}
]
async function measure(page:Page,block:string) {
 return page.getByTestId('textbook-formula-'+block).evaluate(el=>{
  const e=el as HTMLElement,ex=e.querySelector('.reading-formula-expression') as HTMLElement
  const r=e.getBoundingClientRect(),x=ex.getBoundingClientRect()
  return {n12:e.classList.contains('reading-formula-line--n12'),scrollLeft:e.scrollLeft,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,
   expression:{left:x.left,right:x.right,width:x.width,wrap:getComputedStyle(ex).flexWrap,minWidth:getComputedStyle(ex).minWidth},
   formula:{left:r.left,right:r.right,overflow:getComputedStyle(e).overflowX},
   parts:Array.from(ex.children).map(p=>{const b=p.getBoundingClientRect();return {class:p.className,text:p.textContent,left:b.left,right:b.right,top:b.top,bottom:b.bottom}})}
 })
}
test.describe('N12 read-only review identity diagnosis',()=>{
 for(const c of cases)for(const width of [320,390,1440]){
  test(c.id+' '+width,async({page},info)=>{
   test.skip(process.env.E2E_N12_DIAG!=='1','diagnostic branch only')
   test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
   test.setTimeout(180000)
   await page.setViewportSize({width,height:width===1440?1400:1000})
   mkdirSync('e2e-evidence',{recursive:true})
   const rows:Record<string,unknown>={width,id:c.id,source:process.env.CAPTURE_SHA,learnerSource:'22ccf559a70d758689b958c77d19f4c9cdd43b7e'}
   const item=unit.sections[0].items.find(q=>q.id===c.id)!
   const wrong=getTextbookChoices(unit,item).find(v=>v!==item.answer)!
   await page.goto('/#/review/'+c.target)
   await expect(page.getByTestId('review-preview-ready')).toBeVisible()
   const before=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
   const trigger=page.getByTestId('textbook-item-'+c.id)
   await trigger.scrollIntoViewIfNeeded()
   rows.reviewBefore=await measure(page,c.block)
   expect((rows.reviewBefore as {n12:boolean}).n12).toBe(false)
   await trigger.click()
   await page.getByTestId('inline-choice-panel-'+c.id).getByRole('button',{name:wrong,exact:true}).click()
   await trigger.click()
   await page.getByTestId('textbook-hint-'+c.id).scrollIntoViewIfNeeded()
   rows.reviewWrong=await measure(page,c.block)
   await page.screenshot({path:'e2e-evidence/n12-diag-'+c.id+'-review-baseline-'+width+'.png'})
   await page.getByTestId('textbook-formula-'+c.block).evaluate(el=>{el.scrollLeft=0})
   rows.reviewAtScrollZero=await measure(page,c.block)
   // Browser-session-only root-cause experiment. No source, key or persisted state changes.
   await page.getByTestId('textbook-formula-'+c.block).evaluate(el=>el.classList.add('reading-formula-line--n12'))
   rows.reviewRestoredClassProbe=await measure(page,c.block)
   expect((rows.reviewRestoredClassProbe as {n12:boolean}).n12).toBe(true)
   await page.screenshot({path:'e2e-evidence/n12-diag-'+c.id+'-session-only-class-probe-'+width+'.png'})
   expect(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))).toBe(before)
   await page.reload()
   rows.reviewReload=await measure(page,c.block)
   expect((rows.reviewReload as {n12:boolean}).n12).toBe(false)
   await page.goto('/#/learning/textbook/'+unit.unitId)
   const items=unit.sections[0].items
   for(const q of items.slice(0,items.findIndex(q=>q.id===c.id))){
    await page.getByTestId('textbook-item-'+q.id).click()
    await page.getByTestId('inline-choice-panel-'+q.id).getByRole('button',{name:q.answer,exact:true}).click()
    await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
   }
   const normal=page.getByTestId('textbook-item-'+c.id)
   await normal.scrollIntoViewIfNeeded()
   rows.normalBefore=await measure(page,c.block)
   expect((rows.normalBefore as {n12:boolean}).n12).toBe(true)
   await normal.click()
   await page.getByTestId('inline-choice-panel-'+c.id).getByRole('button',{name:wrong,exact:true}).click()
   await normal.click()
   await page.getByTestId('textbook-hint-'+c.id).scrollIntoViewIfNeeded()
   rows.normalWrong=await measure(page,c.block)
   await page.screenshot({path:'e2e-evidence/n12-diag-'+c.id+'-normal-baseline-'+width+'.png'})
   const extracted=Object.values(reviewTargets).filter(t=>t.unitId===unit.unitId).map(t=>{
    const u=unit
    const section=u?extractReviewSection(u,t):null
    return {target:t.id,unit:t.unitId,valid:!!section,originalN12Class:u?.sections.find(s=>s.id==='lesson')?.items.some(q=>q.id==='n12-01')??false,
     extractedN12Class:section?.items.some(q=>q.id==='n12-01')??false,items:section?.items.map(q=>q.id)??[]}
   })
   rows.extractionSurvey=extracted
   writeFileSync('e2e-evidence/n12-diag-'+c.id+'-'+width+'.json',JSON.stringify(rows,null,2)+'\n')
  })
 }
})
