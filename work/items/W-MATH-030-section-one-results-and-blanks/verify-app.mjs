import { chromium } from '@playwright/test'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const root = process.env.APP_URL ?? 'http://127.0.0.1:4173/kyotsu-step-web/'
const out = process.env.EVIDENCE_DIR ?? 'e2e-evidence/theme-one'
fs.mkdirSync(out,{recursive:true})
const runtime = JSON.parse(fs.readFileSync('e2e-evidence/chapter-runtime/runtime-units.json','utf8'))
const units = runtime.units.map(x=>x.unit).filter(u=>/^math-numbers-expressions-(n0[1-6]|ne01)$/.test(u.unitId) && (!process.env.ONLY_UNIT || u.unitId.endsWith('-'+process.env.ONLY_UNIT)))
const browser = await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})})
for(let i=0;i<50;i++){try{await fetch(root);break}catch{await new Promise(r=>setTimeout(r,200))}}
const plans=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/firstSectionTeaching.json','utf8'));
const changes=JSON.parse(fs.readFileSync('work/items/W-MATH-030-section-one-results-and-blanks/IMPLEMENTATION_LEDGER.json','utf8'));
const changed=new Set(changes.map(x=>x.itemId));
const results=[]
const formulaGeometry=[]
try {
 for (const width of JSON.parse(process.env.VIEWPORTS ?? '[320,390,1440]')) {
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
    if(item.id.includes('-bridge-detail-')||item.id.includes('-bridge-audit-')) assert((await blank.innerText()).includes('選択'),'Missing sets-style inline blank '+item.id)
    if(item.id==='n01-bridge-r3-linear') {
      assert.equal(await page.getByTestId('textbook-formula-n01-r3-linear-result').count(),0,'Linear answer leaked');
      assert.equal(await page.getByTestId('textbook-formula-n01-r3-cubic-zero').count(),0,'Future cubic result leaked');
    }
    if(item.id==='n01-bridge-r3-cubic') assert.equal(await page.getByTestId('textbook-formula-n01-r3-cubic-zero').count(),0,'Cubic answer leaked');
    assert(!(await blank.innerText()).includes('□'),'Nested square returned '+item.id);
    const refs=plans[unit.unitId.split('-').at(-1)].contextBlockIdsByItem[item.id]??[];
    for(const ref of refs)assert(await page.getByTestId('math-textbook-context-'+ref).isVisible(),'Missing prerequisite '+item.id+'/'+ref);
    assert.equal(await page.locator('.math-textbook-stage-references [data-testid^=textbook-item-]').count(),0,'Reference contains a live answer control');
    await blank.click()
    let panel=page.getByTestId('inline-choice-panel-'+item.id)
    await panel.waitFor()
    await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))})
    if(!wrongChecked || item.id.startsWith('n01-bridge-r3-') || item.id.includes('-s4-') || item.id.includes('-s5-')) {
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
    if(changed.has(item.id) || ['n01-s4-y-degree','n01-bridge-r3-linear','n02-bridge-detail-cube-coefficient','n02-bridge-minus-constant','n04-bridge-cross-coefficient','n04-s4-product-rule','n05-s4-linear-condition','n06-bridge-audit-constant-pair','ne01-bridge-detail-quadratic-coefficient','ne01-s4-sum-rule'].includes(item.id)) {
      await panel.scrollIntoViewIfNeeded();await page.screenshot({path:out+'/'+item.id+'-'+width+'.png',fullPage:true})
    }
    const layout=await panel.locator('button.reading-choice-option').evaluateAll(options=>options.map(option=>{const strong=option.querySelector('strong');const bounds=strong.getBoundingClientRect();return {left:option.getBoundingClientRect().left,font:parseFloat(getComputedStyle(strong).fontSize),over:Array.from(strong.querySelectorAll('.first-theme-choice-chunk, .typeset-line .katex, .typeset-table-cell .katex')).filter(c=>!c.closest('.typeset-probe')).some(c=>{const r=c.getBoundingClientRect();return r.width>0&&(r.left<bounds.left-2||r.right>bounds.right+2)})}}))
    assert(layout.every(x=>x.font>=16&&!x.over),'Clipped or undersized option '+width+'/'+item.id+' '+JSON.stringify(layout))
    assert(layout.every(x=>Math.abs(x.left-layout[0].left)<2),'Options are crowded into columns '+item.id)
    for(const entry of await page.locator('.math-textbook-stage--current .reading-formula-line').evaluateAll(rows=>rows.filter(row=>row.scrollWidth>row.clientWidth+2).map(row=>({id:row.dataset.testid,width:row.clientWidth,scrollWidth:row.scrollWidth})))) formulaGeometry.push({unit:unit.unitId,item:item.id,width,...entry});
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)
    assert(!overflow,'Horizontal page overflow at '+width+'/'+item.id)
    assert.equal(await page.locator('.katex-error').count(),0,'Math parse error '+item.id)
    await selected.click()
    if(['n01-bridge-r3-linear','n01-bridge-r3-cubic','n01-bridge-r3-reuse'].includes(item.id)) {
      const result={'n01-bridge-r3-linear':'n01-r3-linear-result','n01-bridge-r3-cubic':'n01-r3-cubic-zero','n01-bridge-r3-reuse':'n01-r3-final-equation'}[item.id];
      assert(await page.getByTestId('textbook-formula-'+result).isVisible(),'Missing calculation/result connection '+item.id);
      const borders=await page.locator('[data-derivation-id^="n01-r3-"] .reading-formula-line').evaluateAll(rows=>rows.map(row=>getComputedStyle(row).borderTopWidth));
      assert(borders.every(x=>parseFloat(x)===0),'Individual formula cards split teaching chain');
    }
   }
   for(const entry of await page.locator('.math-textbook-stage--current .reading-formula-line').evaluateAll(rows=>rows.filter(row=>row.scrollWidth>row.clientWidth+2).map(row=>({id:row.dataset.testid,width:row.clientWidth,scrollWidth:row.scrollWidth})))) formulaGeometry.push({unit:unit.unitId,item:'completed',width,...entry});
   assert.equal(await page.getByTestId('resolved-'+items.at(-1).id).count(),1)
   if(stages>0){const history=page.getByTestId('math-textbook-history-toggle');await history.click();assert(await page.getByTestId('math-textbook-expand-all').isVisible());assert((await page.locator('.math-textbook-stage--past .first-theme-recorded-results').count())>0,'Missing recorded previous conclusions');await page.screenshot({path:out+'/'+unit.unitId+'-history-'+width+'.png',fullPage:true});await history.click()}
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
 fs.writeFileSync(out+'/formula-geometry.json',JSON.stringify(formulaGeometry,null,2))
 fs.writeFileSync(out+'/report.json',JSON.stringify({root,sourceSHA:process.env.CANDIDATE_SHA??'local-working-tree',results},null,2))
 assert.equal(formulaGeometry.length,0,'Mathematical line requires horizontal scrolling: '+JSON.stringify(formulaGeometry.slice(0,5)))
 console.log(JSON.stringify({root,flows:results.length,answers:results.reduce((n,r)=>n+r.answers,0),passed:true}))
}finally{await browser.close()}
