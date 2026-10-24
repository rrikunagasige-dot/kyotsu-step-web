// Seeded read-only history geometry; not a learner playthrough or human acceptance.
import fs from 'node:fs'
import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
const root=process.env.APP_URL??'http://127.0.0.1:4173/kyotsu-step-web/'
const out=(process.env.EVIDENCE_DIR??'e2e-evidence/typesetting')+'/history'
const storage=process.env.VITE_STORAGE_NAMESPACE??'kyotsu-step-gate3-math-20261023'
const runtime=JSON.parse(fs.readFileSync('e2e-evidence/chapter-runtime/runtime-units.json','utf8'))
const plans=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/firstSectionTeaching.json','utf8'))
const enabled=JSON.parse(fs.readFileSync('src/data/textbook/math/typesetting.json','utf8')).enabledUnits
const units=runtime.units.map(e=>e.unit).filter(u=>enabled.includes(u.unitId.split('-').at(-1)))
fs.mkdirSync(out,{recursive:true})
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})})
for(let i=0;i<50;i++){try{await fetch(root);break}catch{await new Promise(r=>setTimeout(r,200))}}
const views=[],errors=[]
try{
 for(const width of [320,360,390,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage()
  page.on('pageerror',e=>errors.push(e.message))
  await page.goto(root)
  for(const unit of units){
   const key=unit.unitId.split('-').at(-1),plan=plans[key],items=unit.sections[0].items
   const progress={unitId:unit.unitId,unitRevision:unit.revision,startedAt:1,updatedAt:2,answers:Object.fromEntries(items.map(q=>[q.id,{itemId:q.id,value:q.answer,resolved:true,isFirstCorrect:true,attemptCount:1,firstAnsweredAt:1,lastAnsweredAt:2}]))}
   await page.evaluate(({storage,unit,progress,index})=>{localStorage.setItem(storage,JSON.stringify({state:{textbookProgress:{[unit.unitId]:progress}},version:1}));localStorage.setItem('math-textbook-compact-v1:'+unit.unitId+':r'+unit.revision,String(index))},{storage,unit:{unitId:unit.unitId,revision:unit.revision},progress,index:plan.stages.length-1})
   const url=new URL(root);url.searchParams.set('history-case',key+'-'+width);url.hash='/learning/textbook/'+unit.unitId
   await page.goto(url.href)
   await page.getByTestId('math-textbook-stage-'+plan.stages.at(-1)[0]).waitFor()
   await page.getByTestId('math-textbook-history-toggle').click()
   await page.getByTestId('math-textbook-expand-all').click()
   await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))})
   assert.equal(await page.locator('.math-textbook-stage-detail').count(),plan.stages.length-1,'Incomplete expanded history '+key)
   assert.equal(await page.locator('.math-textbook-stage--past [data-testid^="textbook-item-"]').count(),0,'Past history has live blanks')
   const formulae=await page.locator('[data-typeset-source]').evaluateAll(nodes=>nodes.map(node=>{
    const box=node.getBoundingClientRect(),body=node.querySelector('.typeset-formula-body,.typeset-table')?.getBoundingClientRect()
    const overflow=[...node.querySelectorAll('.typeset-line .katex,.typeset-table-cell .katex')].some(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.left<box.left-1||r.right>box.right+1)})
    const relations=[...node.querySelectorAll('.typeset-relation')].map(el=>el.getBoundingClientRect().left)
    return {source:node.dataset.typesetSource,overflow,center:body?.width?Math.abs((box.left+box.right-body.left-body.right)/2):0,relationDelta:relations.length?Math.max(...relations)-Math.min(...relations):0}
   }))
   for(const f of formulae){assert(!f.overflow,'Expanded math overflow '+JSON.stringify({key,width,...f}));assert(f.center<=2,'Expanded group is off center '+JSON.stringify({key,width,...f}));assert(f.relationDelta<=1,'Expanded relation drift '+JSON.stringify({key,width,...f}))}
   const numbered=await page.locator('.numbered-equation').evaluateAll(nodes=>nodes.map(node=>{
    const tag=node.querySelector('.numbered-equation-label'),label=tag.getBoundingClientRect(),box=node.getBoundingClientRect()
    const source=node.querySelector('[data-typeset-source]').dataset.typesetSource
    const overlap=[...node.querySelectorAll('.numbered-equation-body .katex')].some(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>label.left+1&&r.left<label.right-1&&r.bottom>label.top+1&&r.top<label.bottom-1})
    return {source,number:Number(node.dataset.equationNumber),label:tag.textContent,right:Math.abs(box.right-label.right-2),overlap}
   }))
   for(const n of numbered){assert.equal(n.number,plan.equationNumbers[n.source]??plan.equationNumbers[n.source.split('#')[0]],'History equation identity '+n.source);assert.equal(n.label,'('+n.number+')');assert(n.right<=2&&!n.overlap,'History equation label '+JSON.stringify({key,width,...n}))}
   assert.equal(await page.locator('.katex-error').count(),0)
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'History page overflow')
   if(width===390)await page.locator('.math-textbook-stage--past').first().screenshot({path:out+'/'+key+'-390.png'})
   views.push({unit:key,width,expandedStages:plan.stages.length-1,formulaGroups:formulae.length,equationLabels:numbered.length})
  }
  await context.close()
 }
 assert.deepEqual(errors,[])
 const result={sourceSHA:process.env.CANDIDATE_SHA??'local-working-tree',root,views,expandedViews:views.length,expandedStages:views.reduce((n,v)=>n+v.expandedStages,0),formulaGroups:views.reduce((n,v)=>n+v.formulaGroups,0),equationLabels:views.reduce((n,v)=>n+v.equationLabels,0),passed:true}
 fs.writeFileSync(out+'/report.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,views:undefined}))
}finally{await browser.close()}
