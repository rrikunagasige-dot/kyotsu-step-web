import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { mathNumbersNE01Unit as ne01 } from '../src/data/textbook/math/numbers/ne01Lesson'
import { mathNumbersNE02Unit as ne02 } from '../src/data/textbook/math/numbers/ne02Lesson'
import { developmentFeedback } from '../src/data/textbook/math/numbers/developmentFeedback'
import { getTextbookChoices } from '../src/domain/textbook'
const units=[ne01,ne02]
const root='e2e-evidence/ne-development'
async function fits(page: Page){
 await expect(page.locator('.katex-error')).toHaveCount(0)
 const overflow=await page.locator('.reading-formula-line, .reading-choice-option').evaluateAll(nodes=>nodes.flatMap(n=>{
  const e=n as HTMLElement,r=e.getBoundingClientRect()
  const children=Array.from(e.querySelectorAll('.katex-html')).map(c=>c.getBoundingClientRect())
  return e.scrollWidth>e.clientWidth+2||children.some(c=>c.left<r.left-2||c.right>r.right+2)?[{id:e.getAttribute('data-testid'),width:e.clientWidth,scroll:e.scrollWidth}]:[]
 }))
 expect(overflow).toEqual([])
 const w=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth])
 expect(w[1]).toBeLessThanOrEqual(w[0]+1)
}
for(const unit of units)for(const width of [320,390,1440])test('P005 all choices '+unit.unitId+' '+width,async({page},info)=>{
 test.skip(process.env.E2E_NE_DEVELOPMENT!=='1','approved P005 CI only')
 test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
 test.setTimeout(240000)
 await page.setViewportSize({width,height:1000})
 await page.goto('/#/learning/textbook/'+unit.unitId)
 const section=unit.sections[0],rows=[]
 for(const [index,item] of section.items.entries()){
  const trigger=page.getByTestId('textbook-item-'+item.id),panel=page.getByTestId('inline-choice-panel-'+item.id)
  if(index+1<section.items.length)await expect(page.getByTestId('textbook-item-'+section.items[index+1].id)).toHaveCount(0)
  await trigger.click();await fits(page)
  const choices=getTextbookChoices(unit,item)
  for(const wrong of choices.filter(c=>c!==item.answer)){
   await panel.getByRole('button',{name:wrong,exact:true}).click()
   await trigger.click()
   await expect(page.getByTestId('textbook-hint-'+item.id)).toHaveText('ヒント'+developmentFeedback(item.id,wrong)+' '+item.hints[0])
   await fits(page)
  }
  await panel.getByRole('button',{name:item.answer,exact:true}).click()
  await expect(page.getByTestId('resolved-'+item.id)).toBeVisible()
  await fits(page)
  rows.push({id:item.id,choices,attempts:choices.length})
 }
 const saved=await page.evaluate(id=>JSON.parse(localStorage.getItem('kyotsu-step-store')??'{}').state.textbookProgress[id],unit.unitId)
 for(const row of rows)expect(saved.answers[row.id]).toMatchObject({resolved:true,isFirstCorrect:false,attemptCount:row.attempts})
 expect(saved.completedAt).toBeTruthy()
 await page.reload();await fits(page)
 expect(await page.evaluate(id=>JSON.parse(localStorage.getItem('kyotsu-step-store')??'{}').state.textbookProgress[id],unit.unitId)).toEqual(saved)
 mkdirSync(root,{recursive:true});writeFileSync(root+'/'+unit.unitId+'-'+width+'.json',JSON.stringify({source:process.env.CAPTURE_SHA,unit:unit.unitId,width,rows,saved},null,2))
})
for(const unit of units)for(const item of unit.sections[0].items)test('P005 authentic review '+item.id,async({page},info)=>{
 test.skip(process.env.E2E_NE_DEVELOPMENT!=='1'||info.project.name!=='mobile-chromium','one authentic marked image group per approved source question')
 await page.setViewportSize({width:390,height:1000})
 const target=item.id.replace(/-(\d+)$/,'-q$1')
 await page.goto('/#/review/'+target)
 await expect(page.getByTestId('review-preview-sha')).toContainText(process.env.CAPTURE_SHA!)
 const trigger=page.getByTestId('textbook-item-'+item.id),panel=page.getByTestId('inline-choice-panel-'+item.id)
 const mark=page.getByTestId('review-mark-'+item.id.replace(/-(\d+)$/,'-formula-$1'))
 await expect(mark).toBeVisible()
 await trigger.click()
 const choices=getTextbookChoices(unit,item),wrong=choices.find(c=>c!==item.answer)!
 await panel.getByRole('button',{name:wrong,exact:true}).click();await trigger.click();await fits(page)
 mkdirSync(root,{recursive:true})
 await page.getByTestId('textbook-reading-flow').screenshot({path:root+'/'+item.id+'-wrong-390.png'})
 await panel.getByRole('button',{name:item.answer,exact:true}).click();await fits(page)
 await page.getByTestId('textbook-reading-flow').screenshot({path:root+'/'+item.id+'-complete-390.png'})
 expect(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store')??'')).not.toContain(item.id)
})
