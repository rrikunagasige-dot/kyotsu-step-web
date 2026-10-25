/** Deterministic N08 repair. Preserves the entire r4 artifact and every old grading key. */
import {compileIR,validateIR} from './ir/index.mjs';
import {hash} from './util.mjs';
import {n08Bundle} from './fixtures/n08-bundle.mjs';
import {verifyBundle} from './solution/bundle.mjs';
export function repairN08({old,originalIR,design,approval}){
 if(old.unit.revision!==4||design.fromRevision!==4||design.proposedRevision!==5)throw Error('N08_SOURCE_VERSION');
 if(JSON.stringify(compileIR(originalIR))!==JSON.stringify(old.semantic))throw Error('N08_SOURCE_IR_BINDING');
 const ir=structuredClone(originalIR),meta=structuredClone(old.nodes);let seq=0;
 const token=()=>`n08-r5-token-${++seq}`;
 const textParts=s=>s.split(/(\$[^$]+\$|\*\*[^*]+\*\*)/).filter(Boolean).map(t=>t.startsWith('$')?math(t.slice(1,-1)):t.startsWith('**')?{kind:'term',id:token(),termId:'absolute-value',text:t.slice(2,-2),usage:'first_definition'}:{kind:'text',id:token(),text:t});
 function math(latex){const id=token();return {kind:'math',id,latex,mathRole:'expression',semanticRef:id};}
 const paragraph=(id,s)=>({id,kind:'paragraph',parts:textParts(s)});
 function group(id,values,{relation='equality',interactionId,slotIds=[],numberId=id}={}){
  let slot=0;
  const expressions=values.map((s,i)=>({id:id+'-expr-'+i,parts:s.split(/(\\boxed\{[A-Z]\})/).filter(Boolean).map(t=>t.startsWith('\\boxed')?{kind:'answerSlot',id:slotIds[slot++],interactionId,semanticRef:interactionId}:math(t))}));
  return {id,kind:'relationChain',relation,expressions,operators:relation==='independent'?[]:Array(Math.max(0,expressions.length-1)).fill('='),transformRef:id,layoutProfile:relation==='independent'?'independent':expressions.length>1?'aligned-transform':'single',numbering:{stableId:numberId,mode:'group-end'}};
 }
 for(const [id,replacement]of Object.entries(design.replacements)){
  const node=ir.nodes.find(n=>n.id===id);
  for(const side of ['before','after'])if(replacement[side]){
   const index=node[side].findIndex(b=>b.kind==='paragraph');
   node[side].splice(index,1,...replacement[side].map((s,i)=>paragraph(id+'-r5-'+side+'-'+i,s)));
  }
 }
 for(const added of design.newNodes){
  const anchor=ir.nodes.find(n=>n.id===added.insertBefore),id=added.id,qid=added.interactionId,result=id+'-result',slotIds=added.bindings.map((_,i)=>id+'-slot-'+i);
  const node={id,problemId:anchor.problemId,sourceRefs:anchor.sourceRefs,requires:[...anchor.requires],produces:[result],role:'substep',goal:added.purpose,purpose:added.purpose,
   operation:{kind:'expression',targets:anchor.sourceRefs,nextUseIds:[anchor.id]},
   before:[paragraph(id+'-before',added.before),group(id+'-interaction',[added.masked],{relation:'independent',interactionId:qid,slotIds})],
   after:[group(id+'-result-formula',[added.completed],{relation:'independent'}),paragraph(id+'-after',added.after)],
   interaction:{id:qid,targetPath:'interaction.expected.value',learningAction:'expression',whyHere:added.purpose,prerequisiteIds:[...anchor.requires],expected:{value:added.answer,form:'formula',semanticType:added.role},
    choices:added.choices.map((value,i)=>({id:qid+'-choice-'+i,content:value,feedback:i===0?added.after:added.role.includes('操作')?'元の中身が左辺に現れるか、両辺への同じ操作を確かめよう。':'右側の座標から左側の座標を引く式を確かめよう。',...(i?{misconception:'必要な対象または操作が違う'}:{})})),
    hints:['式を作る目的と、直前に分かった条件を確かめよう。'],answerInsertion:{blockId:id+'-interaction',slotId:slotIds[0],slotIds}},contextNeed:structuredClone(anchor.contextNeed).map((r,i)=>({...r,id:id+'-context-'+i}))};
  anchor.requires.push(result);anchor.interaction.prerequisiteIds.push(result);
  ir.nodes.splice(ir.nodes.indexOf(anchor),0,node);
  const m=meta.find(n=>n.id===added.insertBefore);meta.splice(meta.indexOf(m),0,{id,stageId:added.stageId,q:m.q,goal:added.purpose,role:'substep',knownRefs:[...m.knownRefs],resultId:result,interaction:qid});
  for(const c of ir.coverage)if(node.sourceRefs.includes(c.sourceId))c.nodeIds.push(id);
 }
 const rootSquare=ir.nodes.find(n=>n.id==='n08-q05-square');rootSquare.before.splice(2,0,group('n08-r5-root-square-given',['(\\sqrt5)^2=5'],{relation:'independent'}));
 const transformations={
  'n08-q07-distribute':{input:['-(\\sqrt5-3)','(-1)\\sqrt5+(-1)(-3)','\\boxed{B}'],output:['-(\\sqrt5-3)','(-1)\\sqrt5+(-1)(-3)','-\\sqrt5+3']},
  'n08-q09-distribute':{input:['-(3-\\pi)','(-1)3+(-1)(-\\pi)','\\boxed{B}'],output:['-(3-\\pi)','(-1)3+(-1)(-\\pi)','-3+\\pi']},
  'n08-q12-negative':{input:['|a|^2','(-a)^2','(-a)(-a)','\\boxed{B}'],output:['|a|^2','(-a)^2','(-a)(-a)','a^2']},
 };
 for(const [id,{input,output}]of Object.entries(transformations)){
  const n=ir.nodes.find(n=>n.id===id),q=n.interaction;
  n.before=n.before.map(b=>b.id===q.answerInsertion.blockId?group(b.id,input,{interactionId:q.id,slotIds:[q.answerInsertion.slotId]}):b);
  n.after=n.after.map(b=>b.kind==='relationChain'?group(b.id,output):b);
 }
 const comparisons={
  'n08-05':['5<9','\\sqrt5<3'],
  'n08-q11-positive':['|a|=a','|-a|=-(-a)=a'],
  'n08-q11-negative':['|a|=-a','|-a|=-a'],
 };
 for(const [id,values]of Object.entries(comparisons)){
  const n=ir.nodes.find(n=>n.id===id);n.after=n.after.map(b=>b.kind==='relationChain'?group(b.id,values,{relation:'independent'}):b);
 }
 for(const [id,change]of Object.entries(design.referenceChanges)){
  const n=ir.nodes.find(n=>n.id===id),m=meta.find(n=>n.id===id);
  const replacements=change.use.map(f=>f==='source-given-pi'?'pi-given':f);
  n.requires=[...new Set(n.requires.filter(f=>!change.remove.includes(f)).concat(replacements))];
  if(n.interaction)n.interaction.prerequisiteIds=[...n.requires];
  m.knownRefs=replacements.filter(f=>meta.some(n=>n.resultId===f));
  n.contextNeed=m.knownRefs.map((f,i)=>({id:id+'-r5-context-'+i,problemId:n.problemId,factIds:[f],reason:'現在の判断に必要な既出の定義・条件'}));
 }
 const check=validateIR(ir);if(check.status!=='PASS')throw Error(JSON.stringify(check.findings));
 const compiled=compileIR(ir),bundle=n08Bundle(design);
 for(const problem of bundle.problems)problem.sourceRefs=[...new Set(problem.segments.flatMap(s=>s.nodeIds).flatMap(id=>ir.nodes.find(n=>n.id===id)?.sourceRefs??[]))];
 const mathCheck=verifyBundle(bundle);
 if(mathCheck.status!=='PASS')throw Error('N08_MATH_BUNDLE '+JSON.stringify(mathCheck));
 const publicParts=s=>textParts(s).map(p=>p.kind==='math'?{type:'math',latex:p.latex,semanticId:p.id}:p.kind==='term'?{type:'term',text:p.text,usage:p.usage,semanticId:p.id}:{type:'text',text:p.text,semanticId:p.id});
 const displays=structuredClone(old.semanticDisplay),oldItems=new Map(old.unit.sections[0].items.map(q=>[q.id,q]));
 const items=meta.filter(n=>n.interaction).map(n=>{
  if(oldItems.has(n.interaction))return structuredClone(oldItems.get(n.interaction));
  const q=ir.nodes.find(x=>x.id===n.id).interaction;
  displays[n.id]={hintParts:q.hints.map(publicParts),choices:Object.fromEntries(q.choices.map(c=>[c.content,[{type:'math',latex:c.content,semanticId:token()}]])),feedback:Object.fromEntries(q.choices.map(c=>[c.content,publicParts(c.feedback)]))};
  return {id:q.id,label:q.id.toUpperCase(),prompt:q.whyHere,answer:q.expected.value,acceptedAnswers:[],answerType:'formula',choices:q.choices.map(c=>c.content),purpose:'causal-reasoning',scaffoldLevel:'medium',hints:q.hints};
 });
 for(const id of ['n08-01','n08-05']){
  const q=ir.nodes.find(n=>n.id===id).interaction;
  displays[id].choiceRows=Object.fromEntries(q.choices.map(c=>[c.content,c.content.replace(/\\\\/g,'\\').split(/,?\\quad\s*/).map(latex=>[{type:'math',latex,semanticId:token()}])]));
 }
 const equationNumbers={};let num=0;
 for(const n of compiled.nodes){const formulas=[...n.before,...n.after].filter(b=>b.type==='formula');if(formulas.length){num++;for(const side of [n.before,n.after]){const last=side.filter(b=>b.type==='formula').at(-1);if(last)equationNumbers[last.id]=num;}}}
 const unit=structuredClone(old.unit);unit.revision=5;unit.source.rightsNote+=' W-MATH-037/P-001: preserve r4 and add whole-problem context.';
 unit.sections[0].items=items;unit.sections[0].readingFlow=compiled.nodes.flatMap(n=>[...n.before,...n.after]);
 const artifact={...structuredClone(old),approvedCommit:approval.approvedCommit,proposalHash:approval.proposalHash,irHash:compiled.irHash,solutionBundleHash:hash(bundle),unit,nodes:meta,semantic:compiled,semanticDisplay:displays,equationNumbers,problemGroups:design.problemGroups};
 return {ir,compiled,bundle,mathCheck,artifact};
}
