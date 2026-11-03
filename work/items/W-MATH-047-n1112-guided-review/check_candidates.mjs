import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {operate} from '../../../tools/textbook/operations.mjs';
import {hash} from '../../../tools/textbook/util.mjs';
const b='work/items/W-MATH-047-n1112-guided-review/',old='work/items/W-MATH-036-ne02-n11-n12-guided-design/';
const read=p=>JSON.parse(fs.readFileSync(p)),save=(p,v)=>fs.writeFileSync(b+'evidence/'+p,JSON.stringify(v,null,2)+'\n'),summary={};
const materializer=execFileSync(process.execPath,[old+'materialize.mjs','--check-n11','--check-n12'],{encoding:'utf8'});
save('CURRENT_MATERIALIZER.json',{status:'PASS',output:materializer,scope:'Existing approved materializer reproduces both current authored files, including aligned-result postprocessing.'});
for(const code of ['n11','n12']){
 const original=read(old+code.toUpperCase()+'_IR.json'),candidate=read(b+code.toUpperCase()+'_CANDIDATE_IR.json'),authored=read('src/data/textbook/math/numbers/'+code+'Authored.json');
 const binding=operate('compile-ir',original);assert.equal(binding.status,'PASS');
 assert.equal(binding.compiled.irHash,authored.irHash,'Schema-normalized IR must bind the current authored content');
 save(code+'-binding.json',{rawInputHash:hash(original),normalizedIRHash:binding.compiled.irHash,authoredIRHash:authored.irHash,rawCompileIncludesPresentationPostprocessing:false,currentPresentationReproducedBy:'CURRENT_MATERIALIZER.json'});
 const outputs={};
 for(const [version,ir] of [['baseline',original],['candidate',candidate]]){
  for(const [operation,input] of [['verify-ir',ir],['compile-ir',ir],['coverage',{blocks:read(old+'evidence/'+code.toUpperCase()+'_SOURCE_INDEX.json').blocks,coverage:ir.coverage,nodes:ir.nodes}],['blank-candidates',{nodes:ir.nodes}],['visible-snapshots',{ir}]]){
   const result=operate(operation,input);save(code+'-'+version+'-'+operation+'.json',result);outputs[version+':'+operation]={status:result.status,hash:result.irHash??null,snapshots:result.snapshots?.length};
   assert(['PASS','NEEDS_AI_REVIEW'].includes(result.status),JSON.stringify({code,version,operation,result}));
  }
  const solution=ir.nodes.map(n=>({id:n.id,inputFacts:n.requires,outputFacts:n.produces,goal:n.goal,operation:n.operation,basisRefs:n.sourceRefs}));
  const teaching=operate('teaching-candidates',{solution,knowledge:ir.initialFacts,options:{budget:1}});save(code+'-'+version+'-teaching-candidates.json',teaching);assert.equal(teaching.status,'PASS');outputs[version+':teaching-candidates']={status:teaching.status};
 }
 assert.deepEqual(candidate.nodes.map(n=>n.interaction),original.nodes.map(n=>n.interaction));
 summary[code]={nodes:original.nodes.length,answers:original.nodes.filter(n=>n.interaction).length,outputs,gradingContractUnchanged:true,meaningAudit:'REQUIRED',browser:'SEPARATE'};
}
const overlay=operate('verify-ir',{ir:read('src/data/textbook/math/numbers/n11Authored.json'),transformationPlan:read('work/items/W-MATH-038-transformation-groups/N11_TRANSFORMATION_PLAN.json')});save('n11-active-overlay-verify.json',overlay);assert.equal(overlay.status,'PASS');
save('CODE_CHECKS.json',{status:'PASS_BOUNDED',units:summary,n11ActiveOverlay:overlay.status,scope:'Current IR binding, source coverage, candidate structure, compilation, blank/teaching candidates and public-only snapshots. No automatic semantic acceptance or product change.'});console.log(JSON.stringify({status:'PASS_BOUNDED',units:Object.keys(summary),overlay:overlay.status}));
