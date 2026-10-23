import { mkdirSync,writeFileSync } from 'node:fs'
import { expect,test,type Page } from '@playwright/test'
import { mathNumbersN12Unit as unit } from '../src/data/textbook/math/numbers/n12Lesson'
import { getTextbookChoices,type TextbookUnitProgress } from '../src/domain/textbook'
const cases=[
 {id:'n12-p002-q06-left-coef',target:'n12-q06-layout',block:'formula-q06-left-coef',hint:'両辺から同じ文字の項を引くと、係数どうしの引き算になる。文字xを残したまま、係数だけを計算しよう。'},
 {id:'n12-p002-q12-signed-coef',target:'n12-q12-layout',block:'formula-q12-signed-coef',hint:'括弧の外の正の数を、括弧内の負の項にも掛けよう。係数の大きさと符号を別々に確かめ、文字xを除いた数を選ぼう。'}
]
async function metrics(page:Page,block:string){
 return page.getByTestId('textbook-formula-'+block).evaluate(el=>{
  const e=el as HTMLElement,r=e.getBoundingClientRect()
  return {n12:e.classList.contains('reading-formula-line--n12'),scroll:e.scrollLeft,width:e.clientWidth,scrollWidth:e.scrollWidth,
   left:r.left,right:r.right,
   parts:Array.from(e.querySelector('.reading-formula-expression')!.children).map(p=>{const b=p.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom}})}
 })
}
async function assertFits(page:Page,block:string){
 const m=await metrics(page,block)
 expect(m.n12).toBe(true);expect(m.scrollWidth-m.width).toBeLessThanOrEqual(1)
 for(const p of m.parts){expect(p.left).toBeGreaterThanOrEqual(m.left-1);expect(p.right).toBeLessThanOrEqual(m.right+1)}
 return m
}
async function saved(page:Page):Promise<TextbookUnitProgress>{
 return page.evaluate(id=>JSON.parse(localStorage.getItem('kyotsu-step-store')??'{}').state.textbookProgress[id],unit.unitId)
}
test.describe('P015 N12 actual stable identity layout',()=>{
 for(const c of cases)for(const width of [320,390,1440]){
  test(c.id+' '+width,async({page},info)=>{
   test.skip(process.env.E2E_P015_LAYOUT!=='1','dedicated branch evidence')
   test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
   test.setTimeout(240000)
   const sha=process.env.CAPTURE_SHA??'';expect(sha).toMatch(/^[0-9a-f]{40}$/)
   await page.setViewportSize({width,height:width===1440?1400:1000})
   mkdirSync('e2e-evidence',{recursive:true})
   const snap=async(name:string)=>page.screenshot({path:'e2e-evidence/p015-'+c.id+'-'+name+'-'+width+'.png'})
   if(c.id.includes('q06'))for(const target of ['n04-q20-hint','n04-q22-hint','n07-q11-hint','n10-q07-hint','n10-q08-hint','n12-q06-coef-hint','n12-q12-coef-hint']){
    await page.goto('/#/review/'+target)
    await expect(page.getByTestId('review-preview-ready')).toBeVisible()
    await expect(page.locator('[data-testid^="review-mark-"]')).toHaveCount(0)
   }
   await page.goto('/#/')
   const baseline=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
   await page.goto('/#/review/'+c.target)
   await expect(page.getByTestId('review-preview-ready')).toBeVisible()
   await expect(page.getByTestId('review-preview-sha')).toContainText(sha)
   await expect(page.getByTestId('review-mark-'+c.block)).toBeVisible()
   const trigger=page.getByTestId('textbook-item-'+c.id)
   await trigger.scrollIntoViewIfNeeded()
   const result:Record<string,unknown>={source:sha,id:c.id,width,reviewBefore:await assertFits(page,c.block)}
   if(c.id.includes('q06'))await expect(page.getByTestId('textbook-formula-'+c.block).locator('.reading-formula-n12-transform')).toHaveCount(1)
   await snap('review-before')
   const item=unit.sections[0].items.find(q=>q.id===c.id)!,wrong=getTextbookChoices(unit,item).find(x=>x!==item.answer)!
   await trigger.click()
   await page.getByTestId('inline-choice-panel-'+c.id).getByRole('button',{name:wrong,exact:true}).click()
   await trigger.click()
   await expect(page.getByTestId('textbook-hint-'+c.id).locator('span')).toHaveText(c.hint)
   await page.getByTestId('textbook-hint-'+c.id).scrollIntoViewIfNeeded()
   result.reviewWrong=await assertFits(page,c.block);await snap('review-wrong')
   await page.getByTestId('inline-choice-panel-'+c.id).getByRole('button',{name:item.answer,exact:true}).click()
   await expect(page.getByTestId('resolved-'+c.id)).toBeVisible()
   result.reviewCorrect=await assertFits(page,c.block);await snap('review-complete')
   expect(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))).toBe(baseline)
   await page.reload()
   await expect(page.getByTestId('textbook-item-'+c.id)).toBeVisible()
   result.reviewReload=await assertFits(page,c.block)
   await page.goto('/#/learning/textbook/'+unit.unitId)
   const items=unit.sections[0].items,index=items.findIndex(q=>q.id===c.id)
   expect(items).toHaveLength(35);expect(unit.revision).toBe(3)
   for(const q of items.slice(0,index)){
    await page.getByTestId('textbook-item-'+q.id).click()
    await page.getByTestId('inline-choice-panel-'+q.id).getByRole('button',{name:q.answer,exact:true}).click()
    await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
   }
   const prior=(await saved(page)).answers
   const ordinary=page.getByTestId('textbook-item-'+c.id)
   await ordinary.click()
   await page.getByTestId('inline-choice-panel-'+c.id).getByRole('button',{name:wrong,exact:true}).click()
   const wrongRecord=await saved(page)
   expect(wrongRecord.answers[c.id]).toMatchObject({value:wrong,firstValue:wrong,isFirstCorrect:false,attemptCount:1,resolved:false})
   await page.reload();expect(await saved(page)).toEqual(wrongRecord)
   await ordinary.click()
   await expect(page.getByTestId('textbook-hint-'+c.id).locator('span')).toHaveText(c.hint)
   await page.getByTestId('textbook-hint-'+c.id).scrollIntoViewIfNeeded()
   result.normalWrong=await assertFits(page,c.block);await snap('normal-wrong')
   await page.getByTestId('inline-choice-panel-'+c.id).getByRole('button',{name:item.answer,exact:true}).click()
   await expect(page.getByTestId('resolved-'+c.id)).toBeVisible()
   const retry=await saved(page)
   expect(retry.answers[c.id]).toMatchObject({value:item.answer,firstValue:wrong,isFirstCorrect:false,attemptCount:2,resolved:true,firstAnsweredAt:wrongRecord.answers[c.id].firstAnsweredAt})
   for(const q of items.slice(0,index))expect(retry.answers[q.id]).toEqual(prior[q.id])
   for(const q of items.slice(index+1)){
    await page.getByTestId('textbook-item-'+q.id).click()
    await page.getByTestId('inline-choice-panel-'+q.id).getByRole('button',{name:q.answer,exact:true}).click()
    await expect(page.getByTestId('resolved-'+q.id)).toBeVisible()
   }
   const done=await saved(page);expect(Object.keys(done.answers)).toHaveLength(35);expect(done.completedAt).toBeTruthy()
   await page.reload();expect(await saved(page)).toEqual(done)
   await expect(page.locator('.reading-formula-line--n12')).toHaveCount(32)
   await expect(page.locator('.katex-error')).toHaveCount(0)
   result.normalComplete=await assertFits(page,c.block);await snap('normal-complete')
   writeFileSync('e2e-evidence/p015-'+c.id+'-'+width+'.json',JSON.stringify(result,null,2)+'\n')
  })
 }
})
