import fs from 'node:fs';
import {operate} from '../../../tools/textbook/operations.mjs';
const b='work/items/W-MATH-047-n1112-guided-review/',old='work/items/W-MATH-036-ne02-n11-n12-guided-design/';
const read=p=>JSON.parse(fs.readFileSync(p));
for(const code of ['n11','n12']){
 const a=read('src/data/textbook/math/numbers/'+code+'Authored.json'),ir=read(b+code.toUpperCase()+'_CANDIDATE_IR.json'),base=read(old+code.toUpperCase()+'_IR.json'),scope=read(b+'evidence/'+code.toUpperCase()+'_CANDIDATE_SCOPE.json'),cases=read('work/items/W-MATH-035-choice-order-factor-audit/LEARNING_CORPUS.json').cases;
 const publicState=(input,id)=>{
  const index=input.nodes.findIndex(n=>n.id===id),meta=a.nodes.find(n=>n.id===id),stage=a.stages.find(s=>s.id===meta.stageId);
  const visible=operate('visible-snapshots',{ir:input}).snapshots[index];
  const stageIds=new Set(a.nodes.filter(n=>n.stageId===meta.stageId).map(n=>n.id));
  const knownIds=new Set(meta.knownRefs.map(ref=>a.nodes.find(n=>n.resultId===ref)?.id));
  const nodes=visible.nodes.filter(n=>stageIds.has(n.id)||knownIds.has(n.id)).map(n=>({id:n.id,...(stageIds.has(n.id)?{before:n.before}:{}),...(n.after?{after:n.after}:{}),...(n.interaction?{prompt:n.interaction.whyHere,choices:n.interaction.choices.map(c=>({id:c.id,content:c.content}))}:{})}));
  return {sourceQuestion:stage.sourceQuestionParts,nodes,knownFacts:visible.knownFacts};
 };
 const rows=scope.changedNodes.map(id=>{const initial=publicState(ir,id),current={id,problemId:code};const visible={current,initial,baseline:publicState(base,id)};const result=operate('solution-review',{visible,context:{phase:'pre-design',sourceRefs:base.nodes.find(n=>n.id===id).sourceRefs,caseIds:cases.map(c=>c.id)}});if(result.status!=='NEEDS_AI_REVIEW')throw Error(JSON.stringify(result));return{id,request:result.request};});
 fs.writeFileSync(b+'evidence/'+code+'-PUBLIC_REVIEW_REQUESTS.json',JSON.stringify({schemaVersion:'w047-public-review/1',sourceSHA:'6b439d0d31fcd46708c256ed23a391009ab73164',code,rows,cases:cases.map(c=>({id:c.id,dimension:c.dimension,scope:c.scope})),constraints:'No author audit/proposal/rationale files were included. First pass is source/public-only. This is static proposal evidence, not rendered candidate QA.'},null,2)+'\n');
}
