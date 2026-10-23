// 実際の生成HTMLを操作する。数学の独立検算はPython側の担当。
const fs=require('fs');const path=require('path');const assert=require('assert/strict');
let chromium;
try{({chromium}=require('@playwright/test'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const root=__dirname;
async function main(){
 const browser=await chromium.launch({headless:true,...(process.env.CODED_AUTHORING_CHROME?{executablePath:process.env.CODED_AUTHORING_CHROME}:{})});const results=[];
 const evidence=path.join(root,'output','evidence');fs.mkdirSync(evidence,{recursive:true});
 try{
  for(const width of [320,390,1440])for(const mode of ['textbook','practice']){
   const dir=path.join(root,'output',mode), model=JSON.parse(fs.readFileSync(path.join(dir,'compiled.json'),'utf8'));
   const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();const errors=[];
   page.on('pageerror',e=>errors.push(String(e)));await page.goto('file://'+path.join(dir,'preview.html'));
   await page.evaluate(()=>localStorage.setItem('kyotsu-step-store','production-sentinel'));
   for(const l of model.lessons){
    await page.selectOption('#lesson',l.id);assert.equal(await page.locator('.theme').count(),3);
    assert.equal(await page.locator('.derivation').count(),1);assert.equal(await page.locator('.final-result').count(),0);
    assert.equal(await page.locator('.active').count(),1);
    await page.screenshot({path:path.join(evidence,`${mode}-${l.id}-${width}-before.png`),fullPage:true});
    let answered=0;
    for(const s of l.solution.steps){
     const options=l.choices[s.id];if(!options)continue;
     const current=page.locator('.active');assert.equal(await current.getAttribute('data-step'),s.id);
     const wrong=options.find(o=>!o.correct),correct=options.find(o=>o.correct);
     await current.locator(`[data-choice="${wrong.id}"]`).click();assert.equal(await page.locator('.active').getAttribute('data-step'),s.id);
     assert.match(await page.locator('.feedback').textContent(),/まだ一致/);
     for(let i=0;i<4;i++)await page.locator('.show-hint').click();assert.equal(await page.locator('.hint').isVisible(),true);
     assert.equal(await page.locator('.final-result').count(),0);
     await page.locator(`.active [data-choice="${correct.id}"]`).click();answered++;
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'横にはみ出す');
     assert.equal(await page.evaluate(()=>[...document.querySelectorAll('.options button')].every(b=>b.getBoundingClientRect().right<=innerWidth)),true);
     if(answered===1){
      await page.reload();await page.selectOption('#lesson',l.id);
      assert.equal(await page.locator('.step:not(.active)').count(),1,'再読込で進捗を失った');
     }
    }
    assert.equal(await page.locator('.active').count(),0);assert.equal(await page.locator('.final-result').count(),1);
    assert.equal(await page.locator('.step').count(),l.solution.steps.length);
    assert.equal(await page.locator('#closing').isVisible(),true);
    await page.screenshot({path:path.join(evidence,`${mode}-${l.id}-${width}-complete.png`),fullPage:true});
    await page.reload();await page.selectOption('#lesson',l.id);assert.equal(await page.locator('.final-result').count(),1);
    results.push({mode,lesson:l.id,width,answered,wrong_retry:true,four_hints:true,reload:true,overflow:false,one_derivation_frame:true});
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('kyotsu-step-store')),'production-sentinel');
   assert.deepEqual(errors,[]);await context.close();
  }
  for(const mode of ['textbook','practice']){
   const p=path.join(root,'output',mode,'report.json'),r=JSON.parse(fs.readFileSync(p,'utf8'));
   r.stages.final.browser='PASS';r.stages.final.user_gates='PENDING';fs.writeFileSync(p,JSON.stringify(r,null,2)+'\n');
  }
  const report={status:'PASS',cases:results.length,results,browser:'Chromium',browser_version:browser.version(),user_gates:'PENDING',independent_pedagogy_audit:false,source_sha:process.env.GITHUB_SHA||'LOCAL'};
  fs.writeFileSync(path.join(root,'output','browser_results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
