import fs from 'node:fs';import katex from 'katex';
const base='work/items/W-MATH-036-ne02-n11-n12-guided-design/';let errors=[],count=0;
function check(latex,where){count++;try{katex.renderToString(latex,{throwOnError:true,strict:'error'});}catch(e){errors.push({...where,latex,error:e.message});}}
for(const u of ['NE02','N11','N12']){
 const ir=JSON.parse(fs.readFileSync(base+u+'_IR.json','utf8'));
 for(const n of ir.nodes)for(const state of ['before','after'])for(const b of n[state]){
 if(b.kind==='relationChain')for(const e of b.expressions)check(e.parts.map(p=>p.kind==='math'?p.latex:p.kind==='answerSlot'?'\\square':'').join(''),{u,node:n.id,state});
 else for(const p of b.parts)if(p.kind==='math')check(p.latex,{u,node:n.id,state});
 }
}
const spec=JSON.parse(fs.readFileSync(base+'DISPLAY_SPEC.json','utf8'));
for(const [u,items] of Object.entries(spec.unitChoices))for(const item of items)for(const c of item.choices)for(const row of c.rows)for(const p of row.parts)if(p.kind==='math')check(p.latex,{u,node:item.itemId,key:c.canonicalKey});
fs.writeFileSync(base+'evidence/MATH_RENDER_CHECK.json',JSON.stringify({status:errors.length?'FAIL':'PASS',count,errors,scope:'Strict composed math templates and explicit option spans, not browser geometry'},null,2)+'\n');console.log(JSON.stringify({count,errors}));if(errors.length)process.exitCode=1;
