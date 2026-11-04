import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import katex from 'katex';
import {validateChoices} from '../../../tools/textbook/interaction/index.mjs';
const B=path.dirname(fileURLToPath(import.meta.url));
const read=p=>JSON.parse(fs.readFileSync(path.join(B,p),'utf8'));
const server=await createServer({configFile:false,server:{middlewareMode:true},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
const math=[],failures=[],contracts=[];
const render=(latex,ref)=>{try{katex.renderToString(latex,{throwOnError:true,strict:false});math.push({ref,latex});}catch(e){failures.push({ref,latex,error:e.message});}};
try{
 const {validateTextbookUnits}=await server.ssrLoadModule('/src/domain/textbookSchema.ts');
 for(const c of ['N13','N14']){
  const proposed=read(c+'_CANDIDATE.json').unit;validateTextbookUnits([proposed]);
  const old=read('evidence/'+c+'_CURRENT.json').unit;const s=proposed.sections[0],items=new Map(s.items.map(i=>[i.id,i]));
  for(const q of old.sections[0].items){const n=items.get(q.id);if(n.answer!==q.answer||JSON.stringify(n.choices)!==JSON.stringify(q.choices))failures.push({rule:'OLD_CONTRACT_CHANGED',id:q.id});}
  for(const q of s.items){
   const choices=q.choices.map((content,i)=>({id:q.id+'-'+i,content,feedback:'元の条件・操作対象・符号を照合する。',...(content===q.answer?{}:{misconception:'条件または変形の取り違え。'})}));
   const checked=validateChoices(choices,q.answer,{form:q.answerType});if(checked.status!=='PASS')failures.push({rule:'CHOICE_CONTRACT',id:q.id,checked});
   if(q.answerType==='formula')for(const [i,choice]of q.choices.entries())render(choice,q.id+':choice:'+i);
  }
  for(const block of s.readingFlow){
   let latex='';for(const p of block.parts??[]){if(p.type==='math')latex+=p.latex;else if(p.type==='choice'){const q=items.get(p.itemId);latex+=q.answerType==='formula'?q.answer:'\\text{'+q.answer+'}';}}
   if(latex)render(latex,block.id+':completed-template');
  }
  contracts.push({unit:c,oldRevision:old.revision,proposedRevision:proposed.revision,oldItems:old.sections[0].items.length,proposedItems:s.items.length,oldKeysPreserved:true,schema:'PASS'});
 }
}finally{await server.close();}
const result={status:failures.length?'FAIL':'PASS_BOUNDED_CANDIDATE_DATA',contracts,katexChecks:math.length,failures,learnerSourceModified:false,liveBrowserVerified:false,workflowR04Completed:false,limits:['Actual schema/choice and composed-math checks; no teaching acceptance, migration implementation or four-width browser PASS inferred.']};
fs.writeFileSync(path.join(B,'evidence/CANDIDATE_CHECK.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(failures.length)process.exitCode=1;
