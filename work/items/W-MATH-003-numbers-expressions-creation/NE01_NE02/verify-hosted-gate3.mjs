import fs from 'node:fs'
import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
// Authorized by the user's 2026-10-23 「いいよ」 to publish the frozen candidate
// to the existing Pages site. Main learner source is not merged by this harness.
const base=process.env.LIVE_APP_URL
const source='171c04781f32c1286a0762905891b582714834f9'
const storage='kyotsu-step-gate3-math-20261023'
const fixture=JSON.parse(fs.readFileSync('e2e-evidence/chapter-runtime/runtime-units.json','utf8'))
assert.equal(fixture.metadata.sourceSHA,source)
assert.equal(fixture.units.length,16)
const out='e2e-evidence/gate3-hosted'
fs.mkdirSync(out,{recursive:true})
const browser=await chromium.launch()
const results=[]
try {
 for(const width of [320,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}})
  const page=await context.newPage()
  await page.goto(base)
  const metadata=await page.evaluate(async()=>{const r=await fetch('release.json',{cache:'no-store'});if(!r.ok)throw Error('release manifest '+r.status);return r.json()})
  assert.equal(metadata.sourceSHA,source)
  await page.evaluate(()=>localStorage.setItem('kyotsu-step-store',JSON.stringify({state:{settings:{displayName:'PUBLISHED_HISTORY_SENTINEL'}},version:1})))
  const old=await page.evaluate(()=>localStorage.getItem('kyotsu-step-store'))
  for(const entry of fixture.units){
   const unit=entry.unit,item=unit.sections[0].items[0]
   await page.goto(base+'#/learning/textbook/'+unit.unitId)
   const trigger=page.getByTestId('textbook-item-'+item.id)
   await trigger.waitFor({state:'visible'})
   await trigger.click()
   const panel=page.getByTestId('inline-choice-panel-'+item.id)
   const choices=entry.visibleChoices.find(q=>q.id===item.id).choices
   const wrong=choices.find(c=>c!==item.answer)
   assert.ok(wrong)
   await panel.getByRole('button',{name:wrong,exact:true}).click()
   await trigger.click()
   await page.getByTestId('textbook-hint-'+item.id).waitFor({state:'visible'})
   await panel.getByRole('button',{name:item.answer,exact:true}).click()
   await page.getByTestId('resolved-'+item.id).waitFor({state:'visible'})
   assert.equal(await page.locator('.katex-error').count(),0)
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1))
   const before=await page.evaluate(key=>localStorage.getItem(key),storage)
   assert.ok(before?.includes(item.id))
   assert.equal(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store')),old)
   await page.reload()
   await page.getByTestId('resolved-'+item.id).waitFor({state:'visible'})
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),storage),before)
   if(['math-numbers-expressions-n01','math-numbers-expressions-ne02'].includes(unit.unitId))await page.screenshot({path:out+'/'+entry.code+'-'+width+'.png',fullPage:true})
   results.push({unit:unit.unitId,item:item.id,width,wrongHintCorrectReload:true,productionHistoryUnchanged:true})
  }
  await context.close()
 }
 fs.writeFileSync(out+'/results.json',JSON.stringify({sourceSHA:source,lessonBaseline:'3055ed71b25057b80b85d46b1d219f1005d0a35d',url:base,storageKey:storage,results},null,2))
} finally {await browser.close()}
console.log('Hosted candidate: all16 units x2 widths, wrong/hint/correct/reload and production-history isolation PASS')
