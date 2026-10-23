import { mkdirSync, writeFileSync } from 'node:fs'
import { expect,test } from '@playwright/test'
import { getTextbookChoices } from '../src/domain/textbook'
import { mathNumbersN01Unit as n01 } from '../src/data/textbook/math/numbers/n01Lesson'
import { mathNumbersN02Unit as n02 } from '../src/data/textbook/math/numbers/n02Lesson'
import { mathNumbersN03Unit as n03 } from '../src/data/textbook/math/numbers/n03Lesson'
import { mathNumbersN04Unit as n04 } from '../src/data/textbook/math/numbers/n04Lesson'
import { mathNumbersN05Unit as n05 } from '../src/data/textbook/math/numbers/n05Lesson'
import { mathNumbersN06Unit as n06 } from '../src/data/textbook/math/numbers/n06Lesson'
import { mathNumbersN07Unit as n07 } from '../src/data/textbook/math/numbers/n07Lesson'
import { mathNumbersN08Unit as n08 } from '../src/data/textbook/math/numbers/n08Lesson'
import { mathNumbersN09Unit as n09 } from '../src/data/textbook/math/numbers/n09Lesson'
import { mathNumbersN10Unit as n10 } from '../src/data/textbook/math/numbers/n10Lesson'
import { mathNumbersN11Unit as n11 } from '../src/data/textbook/math/numbers/n11Lesson'
import { mathNumbersN12Unit as n12 } from '../src/data/textbook/math/numbers/n12Lesson'
import { mathNumbersN13Unit as n13 } from '../src/data/textbook/math/numbers/n13Lesson'
import { mathNumbersN14Unit as n14 } from '../src/data/textbook/math/numbers/n14Lesson'
const units=[n01,n02,n03,n04,n05,n06,n07,n08,n09,n10,n11,n12,n13,n14]
for(const unit of units)for(const width of [320,390,1440])test('chapter '+unit.unitId+' '+width,async({page},info)=>{
 test.skip(process.env.E2E_P017_LAYOUT!=='1','authorized chapter final audit')
 test.skip(width===1440?info.project.name!=='desktop-chromium':info.project.name!=='mobile-chromium')
 test.setTimeout(240000)
 await page.setViewportSize({width,height:width===1440?1400:1000})
 await page.goto('/#/learning/textbook/'+unit.unitId)
 const rows:Record<string,unknown>[]=[]
 for(const item of unit.sections.flatMap(s=>s.items)){
  const trigger=page.getByTestId('textbook-item-'+item.id),panel=page.getByTestId('inline-choice-panel-'+item.id)
  await trigger.click()
  const choices=getTextbookChoices(unit,item),wrong=choices.find(c=>c!==item.answer)
  expect(choices.filter(c=>c===item.answer)).toHaveLength(1)
  expect(new Set(choices).size).toBe(choices.length)
  expect(wrong).toBeTruthy()
  await panel.getByRole('button',{name:wrong!,exact:true}).click()
  await trigger.click()
  await expect(page.getByTestId('textbook-hint-'+item.id)).toBeVisible()
  await expect(page.locator('.katex-error')).toHaveCount(0)
  const geometry=await trigger.evaluate(el=>{
   const line=el.closest('.reading-formula-line') as HTMLElement|null
   if(!line)return null
   const r=line.getBoundingClientRect()
   return {left:r.left,right:r.right,width:line.clientWidth,scrollWidth:line.scrollWidth,children:Array.from(line.querySelectorAll('.reading-formula-expression > *')).map(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right}})}
  })
  if(geometry&&(geometry.scrollWidth-geometry.width>1||geometry.children.some(c=>c.left<geometry.left-1||c.right>geometry.right+1))){
   mkdirSync('e2e-evidence/chapter-final',{recursive:true})
   await trigger.scrollIntoViewIfNeeded()
   await page.screenshot({path:'e2e-evidence/chapter-final/'+item.id+'-overflow-'+width+'.png'})
  }
  if(width===320 && await trigger.locator('xpath=ancestor::*[contains(@class,"reading-formula-line")]').locator('.reading-formula-expression--chapter-wrap').count()){
   mkdirSync('e2e-evidence/chapter-final',{recursive:true})
   await trigger.locator('xpath=ancestor::*[contains(@class,"reading-formula-line")]').screenshot({path:'e2e-evidence/chapter-final/'+item.id+'-wrong-formula-320.png'})
  }
  rows.push({id:item.id,geometry,choices})
  await panel.getByRole('button',{name:item.answer,exact:true}).click()
  await expect(page.getByTestId('resolved-'+item.id)).toBeVisible()
 }
 const saved=await page.evaluate(id=>JSON.parse(localStorage.getItem('kyotsu-step-store')??'{}').state.textbookProgress[id],unit.unitId)
 expect(Object.keys(saved.answers)).toHaveLength(unit.sections.reduce((n,s)=>n+s.items.length,0))
 for(const item of unit.sections.flatMap(s=>s.items))expect(saved.answers[item.id]).toMatchObject({value:item.answer,attemptCount:2,isFirstCorrect:false,resolved:true})
 expect(saved.completedAt).toBeTruthy()
 await page.reload()
 expect(await page.evaluate(id=>JSON.parse(localStorage.getItem('kyotsu-step-store')??'{}').state.textbookProgress[id],unit.unitId)).toEqual(saved)
 await expect(page.locator('.katex-error')).toHaveCount(0)
 mkdirSync('e2e-evidence/chapter-final',{recursive:true})
 const completeGeometry=await page.locator('.reading-formula-line').evaluateAll(lines=>lines.map(line=>{
  const el=line as HTMLElement,r=el.getBoundingClientRect()
  return {id:el.getAttribute('data-testid'),left:r.left,right:r.right,width:el.clientWidth,scrollWidth:el.scrollWidth,children:Array.from(el.querySelectorAll('.reading-formula-expression > *')).map(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right}})}
 }))
 writeFileSync('e2e-evidence/chapter-final/'+unit.unitId+'-'+width+'.json',JSON.stringify({source:process.env.CAPTURE_SHA,width,unit:unit.unitId,revision:unit.revision,rows,completeGeometry,complete:true},null,2)+'\n')
 if(width===320){
  const expressions=page.locator('.reading-formula-line:has(.reading-formula-expression--chapter-wrap)')
  for(let i=0;i<await expressions.count();i++){
   const el=expressions.nth(i),id=await el.getAttribute('data-testid')
   await el.screenshot({path:'e2e-evidence/chapter-final/'+id+'-complete-formula-320.png'})
  }
 }
 const wrongOverflow=rows.filter(row=>{const g=row.geometry as {left:number;right:number;width:number;scrollWidth:number;children:{left:number;right:number}[]}|null;return g&&(g.scrollWidth-g.width>1||g.children.some(c=>c.left<g.left-1||c.right>g.right+1))})
 const completedOverflow=completeGeometry.filter(g=>g.scrollWidth-g.width>1||g.children.some(c=>c.left<g.left-1||c.right>g.right+1))
 expect(wrongOverflow,'all chapter wrong-state expressions fit').toEqual([])
 expect(completedOverflow,'all chapter completed expressions fit').toEqual([])
})
