import { chromium } from '@playwright/test'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const root = process.env.APP_URL ?? 'http://127.0.0.1:4173/kyotsu-step-web/'
const out = process.env.EVIDENCE_DIR ?? 'e2e-evidence/theme-one'
fs.mkdirSync(out,{recursive:true})
const runtime = JSON.parse(fs.readFileSync('e2e-evidence/chapter-runtime/runtime-units.json','utf8'))
const units = runtime.units.map(x=>x.unit).filter(u=>/^math-numbers-expressions-(n0[1-6]|ne01)$/.test(u.unitId))
const browser = await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})})
for(let i=0;i<50;i++){try{await fetch(root);break}catch{await new Promise(r=>setTimeout(r,200))}}
const results=[]
try {
 for (const width of [320,390,1440]) {
  const context=await browser.newContext({viewport:{width,height:900}})
  const page=await context.newPage()
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  for(const unit of units) {
   await page.goto(root+'#/learning/textbook/'+unit.unitId)
   await page.getByTestId('math-textbook-compact-flow').waitFor()
   const items=unit.sections[0].items
   let wrongChecked=false, stages=0
   for(const item of items) {
    const blank=page.getByTestId('textbook-item-'+item.id)
    for(let n=0;n<12 && !(await blank.isVisible());n++) {
     const next=page.getByTestId('math-textbook-next-stage')
     assert(await next.isVisible(),'Missing next stage before '+item.id)
     await next.click();stages++
    }
    await blank.click()
    let panel=page.getByTestId('inline-choice-panel-'+item.id)
    await panel.waitFor()
    if(!wrongChecked) {
     const wrong=panel.locator('button.reading-choice-option').filter({hasNot:page.locator('[data-never]')})
     let selected
     for(const option of await wrong.all()) if((await option.getAttribute('aria-label'))!==item.answer){selected=option;break}
     await selected.click()
     assert(await blank.isVisible(),'Wrong answer advanced '+item.id)
     await blank.click();await page.getByTestId('textbook-hint-'+item.id).waitFor();wrongChecked=true
    }
    panel=page.getByTestId('inline-choice-panel-'+item.id)
    const answer=panel.locator('button.reading-choice-option').filter({hasText:''})
    let selected
    for(const option of await answer.all())if((await option.getAttribute('aria-label'))===item.answer){selected=option;break}
    assert(selected,'Missing correct option '+item.id)
    if(width===320 && ['n02-bridge-distribute','n04-bridge-restore-t','ne01-bridge-negative-substitute'].includes(item.id)) {
      await panel.scrollIntoViewIfNeeded();await page.screenshot({path:out+'/'+item.id+'-'+width+'.png',fullPage:true})
    }
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)
    assert(!overflow,'Horizontal page overflow at '+width+'/'+item.id)
    assert.equal(await page.locator('.katex-error').count(),0,'Math parse error '+item.id)
    await selected.click()
   }
   assert.equal(await page.getByTestId('resolved-'+items.at(-1).id).count(),1)
   if(stages>0){const history=page.getByTestId('math-textbook-history-toggle');await history.click();assert(await page.getByTestId('math-textbook-expand-all').isVisible());await history.click()}
   await page.screenshot({path:out+'/'+unit.unitId+'-'+width+'.png',fullPage:true})
   page.once('dialog',d=>d.accept())
   await page.locator('.textbook-reset').click()
   await page.getByTestId('textbook-item-'+items[0].id).waitFor()
   assert.equal(await page.getByTestId('resolved-'+items.at(-1).id).count(),0,'Reset retained last answer')
   await page.waitForFunction(()=>scrollY<10,{},{timeout:3000})
   results.push({unitId:unit.unitId,width,answers:items.length,stages:stages+1,wrongRetry:true,reset:true})
  }
  assert.deepEqual(errors,[])
  await context.close()
 }
 fs.writeFileSync(out+'/report.json',JSON.stringify({root,sourceSHA:process.env.CANDIDATE_SHA??'local-working-tree',results},null,2))
 console.log(JSON.stringify({root,flows:results.length,answers:results.reduce((n,r)=>n+r.answers,0),passed:true}))
}finally{await browser.close()}
