import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{chromium}from'@playwright/test';
const dir='work/items/W-MATH-032-n07-semantic-repair/presentation';const out=process.env.ROLE_EVIDENCE_DIR??'/tmp/workflow-role-diagrams';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));const rows=[];
try{
 await page.goto('file://'+path.resolve(dir,'workflow_roles.html'));await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('nav button').count(),5);
 for(const id of ['overview','common','creation','correction','learning']){
  await page.locator('button[data-panel="'+id+'"]').click();const panel=page.locator('#'+id);await panel.waitFor({state:'visible'});
  const report=await panel.locator('svg').evaluate(svg=>{
   const width=svg.viewBox.baseVal.width,height=svg.viewBox.baseVal.height;
   const root=svg.getBoundingClientRect();const bad=[...svg.querySelectorAll('text')].flatMap(t=>{const r=t.getBoundingClientRect();const b={x:(r.left-root.left)*width/root.width,y:(r.top-root.top)*height/root.height,width:r.width*width/root.width,height:r.height*height/root.height};return b.x<0||b.y<0||b.x+b.width>width+1||b.y+b.height>height+1?[{text:t.textContent,...b}]:[]});return{width,height,texts:svg.querySelectorAll('text').length,bad};
  });assert.deepEqual(report.bad,[],id+' text exceeds page');
  await panel.screenshot({path:out+'/'+id+'.png'});rows.push({panel:id,...report});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/REPORT.json',JSON.stringify({status:'PASS',sourceSHA:process.env.GITHUB_SHA,panels:rows,errors},null,2));console.log(JSON.stringify({status:'PASS',panels:rows.length}));
}finally{await browser.close()}
