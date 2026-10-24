import fs from 'node:fs';import assert from 'node:assert/strict';
import {value} from './polynomialValue.mjs';
const runtime=JSON.parse(fs.readFileSync('e2e-evidence/chapter-runtime/runtime-units.json','utf8'));
// These existing distractors preserve numerical value but violate the explicitly
// requested order, unsimplified stage, common grouping, restoration, or full factorization.
const representationOnly = new Set([
 'n02-02|5c+3bx-ax^2+x^3','n02-02|x^3+3bx-ax^2+5c',
 'n03-10|6x^2+11x+4','n04-01|25x^2+40xy+16y^2','n04-04|a^2+2ab+b^2',
 'n04-20|(x^2+3x+2)(x^2+7x+12)','n04-20|(x^2+4x+3)(x^2+6x+8)',
 'n06-04|(x+2y-3)(X+2)','n06-07|(x-1)(x+1)(x^2-4)',
]);
const report=[],distractors=[],skipped=[],representationChecks=[];
for(const {unit} of runtime.units){
 const prefix=unit.unitId.split('-').at(-1);if(!['n01','n02','n03','n04','n05','n06','ne01'].includes(prefix))continue;
 const items=new Map(unit.sections[0].items.map(q=>[q.id,q]));let phase=0;
 for(const block of unit.sections[0].readingFlow){
  if(prefix==='n05'&&block.id==='n05-lead-12')phase=1;
  if(prefix==='n05'&&block.id==='n05-lead-16')phase=2;
  if(prefix==='n04'&&block.id==='n04-lead-20')phase=1;
  if(block.type!=='formula')continue;
  const formula=block.parts.map(p=>p.type==='math'?p.latex:p.type==='choice'?items.get(p.itemId).answer:'').join('');
  const clean=s=>s.replace(/\\(?:quad|qquad|bigl|bigr|left|right)/g,'').replace(/\\[,; ]/g,'');
  if(!formula.includes('=')||/\\(?:text|underbrace|begin|cdots)|,/.test(formula)){skipped.push({id:block.id,reason:'label/tuple/table/counting-or-no-equality'});continue}
  const expressions=clean(formula).split('=');assert(expressions.every(x=>x.trim()),'Disconnected equality '+block.id);
  const wrongs=block.parts.flatMap(p=>p.type==='choice'?[items.get(p.itemId)]:[]).flatMap(q=>q.choices.filter(c=>c!==q.answer).map(c=>({item:q.id,choice:c,different:false})));
  for(let k=-4;k<=5;k++){
   const env={x:k,y:k+2,a:k+1,b:2*k-1,c:3-k,d:k-2,p:1,q:1,r:4,s:3,m:2,n:3,U:2*(k+2)+1,V:k,T:k,X:k};
   env.A=2*env.x**3-3*env.x**2+env.x-1;env.B=-(env.x**3)+2*env.x**2+2;
   if(prefix==='n04')env.T=phase===0?env.a+env.b:env.x**2+5*env.x;
   if(prefix==='n05'&&phase===0){env.r=-8;env.s=2}
   if(prefix==='n05'&&phase===2){env.r=-1;env.s=3}
   if(prefix==='n06'){env.X=env.x+2*env.y;env.T=env.x**2;env.r=1;env.s=-2}
   const first=value(expressions[0],env);for(const expression of expressions.slice(1))assert(value(expression,env)===first,prefix+'/'+block.id+' '+formula);
   for(const wrong of wrongs){const bad=clean(block.parts.map(p=>p.type==='math'?p.latex:p.type==='choice'?(p.itemId===wrong.item?wrong.choice:items.get(p.itemId).answer):'').join('')).split('=');if(bad.slice(1).some(x=>value(x,env)!==value(bad[0],env)))wrong.different=true}
  }
  for(const w of wrongs) if(!w.different){representationChecks.push({...w,block:block.id});assert(representationOnly.has(w.item+'|'+w.choice),'Unexplained equivalent distractor '+block.id)}
  report.push({unit:prefix,id:block.id,formula,samples:10});distractors.push(...wrongs);
 }
}
assert(report.length>200);fs.mkdirSync('e2e-evidence/section-one',{recursive:true});
fs.writeFileSync('e2e-evidence/section-one/math.json',JSON.stringify({sourceSHA:runtime.metadata.sourceSHA,equations:report.length,distractors:distractors.length,report,skipped,representationChecks},null,2));
console.log(JSON.stringify({currentEquations:report.length,currentDistractors:distractors.length,samples:10,representationChecks,passed:true}));
