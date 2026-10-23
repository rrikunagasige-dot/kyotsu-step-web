import { mkdirSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { mathNumbersNE01Unit as ne01 } from '../src/data/textbook/math/numbers/ne01Lesson'
import { mathNumbersNE02Unit as ne02 } from '../src/data/textbook/math/numbers/ne02Lesson'
import { getTextbookChoices } from '../src/domain/textbook'
const units=[ne01,ne02]
const root='e2e-evidence/ne-development-recapture'
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
async function captureFullReading(page: Page, path: string) {
 // Actual browser viewport only. Never hide navigation or inject DOM/CSS.
 // Normal phone-height interactions were verified in the frozen-source chapter run.
 const extent=await page.locator('body').evaluate(el=>el.scrollHeight)
 await page.setViewportSize({width:390,height:Math.ceil(extent)+300})
 await page.evaluate(()=>window.scrollTo(0,0))
 const flow=page.getByTestId('textbook-reading-flow')
 const overlap=await flow.evaluate(el=>{
   const r=el.getBoundingClientRect()
   return Array.from(document.querySelectorAll('nav')).some(n=>{
     const style=getComputedStyle(n),b=n.getBoundingClientRect()
     return style.position==='fixed' && Math.min(r.right,b.right)-Math.max(r.left,b.left)>1 && Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top)>1
   })
 })
 expect(overlap,'fixed navigation must be outside the captured reading flow').toBe(false)
 await fits(page)
 await flow.screenshot({path})
 await page.setViewportSize({width:390,height:1000})
}
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
 await captureFullReading(page,root+'/'+item.id+'-wrong-390.png')
 await panel.getByRole('button',{name:item.answer,exact:true}).click();await fits(page)
 await captureFullReading(page,root+'/'+item.id+'-complete-390.png')
 expect(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store')??'')).not.toContain(item.id)
})
