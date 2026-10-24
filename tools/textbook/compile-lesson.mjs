import { invariant, hash } from './util.mjs';
import { verifyPlan } from './verify.mjs';
// Compilation for design review only; publication/learner registration is a later approved task.
export function compileLesson(plan){
 const check=verifyPlan(plan);invariant(check.status==='PASS',JSON.stringify(check.findings));
 const nodes=new Map(plan.nodes.map(n=>[n.id,n]));const readingFlow=[],items=[],stages=[],numbers={},references={},renderPlan=[];
 const text=(id,value)=>{if(value)readingFlow.push({id,type:'paragraph',parts:[{type:'text',text:value}]});};
 for(const id of plan.orderedNodeIds){const n=nodes.get(id);
  if(!stages.some(s=>s.id===n.stageId)){stages.push({id:n.stageId,nodeIds:[]});readingFlow.push({id:n.stageId+'-title',type:'heading',text:n.goal});readingFlow.push({id:n.stageId+'-role',type:'marker',kind:n.role==='proof'?'proof':n.role==='definition'?'summary':'example',text:n.role==='proof'?'性質の導出':n.role==='definition'?'定義と確認':'例題'});}
  stages.find(s=>s.id===n.stageId).nodeIds.push(id);
  text(id+'-before',n.before);
  if(n.inputLatex&&!(n.interaction?.prefixLatex&&n.interaction.prefixLatex.startsWith(n.inputLatex)))readingFlow.push({id:id+'-input',type:'formula',parts:[{type:'math',latex:n.inputLatex}]});
  const reusedEquation=Boolean(n.outputLatex&&n.interaction&&((n.interaction.prefixLatex??'')+n.interaction.answer+(n.interaction.suffixLatex??'')).replaceAll(' ','')===n.outputLatex.replaceAll(' ',''));
  if(n.interaction){const q=n.interaction;items.push({id:q.id,label:q.id.toUpperCase(),prompt:q.prompt,answer:q.answer,acceptedAnswers:[],answerType:q.answerType,choices:q.choices,purpose:q.classification==='planning'?'solution-planning':q.classification==='representation'?'representation-link':q.classification==='reason'?'causal-reasoning':q.classification==='interpretation'?'transfer':'concept-formation',scaffoldLevel:q.scaffoldLevel??'strong',hints:q.hints});readingFlow.push({id:reusedEquation?id+'-output':id+'-interaction',type:q.answerType==='formula'?'formula':'paragraph',parts:[...(q.prefixLatex?[{type:'math',latex:q.prefixLatex}]:[]),{type:'choice',itemId:q.id},...(q.suffixLatex?[{type:'math',latex:q.suffixLatex}]:[])]});}
  text(id+'-after',n.after);
  if(n.outputLatex){const eq=id+'-output';if(!reusedEquation)readingFlow.push({id:eq,type:'formula',parts:[{type:'math',latex:n.outputLatex}]});}
  references[n.resultId]={nodeId:id,problemId:n.problemId,latex:n.outputLatex,text:n.after,equationId:n.outputLatex?id+'-output':null,dependsOn:n.knownRefs,revealAfterItemId:n.interaction?.id??null};
  for(const side of ['input','output']){const latex=n[side+'Latex'];if(latex)renderPlan.push({equationId:id+'-'+side,alignmentGroup:n.stageId,logicalRows:[{latex}],numberAnchor:side==='output'?id+'-output':null,kind:latex.includes('aligned')?'authored-alignment':latex.includes('=')?'equation':'expression',visibility:side==='output'?'after':'before',controlItem:n.interaction?.id??null});}
 }
 invariant(items.length>0,'zero interactions');
 const unit={schemaVersion:'1.1',unitId:plan.unitId,revision:plan.revision,status:'review',subject:'math-1a',chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:7,sourcePages:[17,18,19]},title:plan.title,source:{type:'reference',label:'教師Word N07 / code+AI design candidate',rightsNote:'Design candidate; not learner publication approval.'},objectives:plan.objectives,sections:[{id:'lesson',number:'07',title:'本文',role:'concept',figures:[],readingFlow,items}]};
 let number=0;for(const b of readingFlow)if(b.type==='formula')numbers[b.id]=++number;
 const displayed=new Set(readingFlow.map(b=>b.id));for(let i=renderPlan.length-1;i>=0;i--)if(!displayed.has(renderPlan[i].equationId))renderPlan.splice(i,1);
 for(const b of readingFlow.filter(b=>b.type==='formula'))if(!renderPlan.some(r=>r.equationId===b.id))renderPlan.push({equationId:b.id,alignmentGroup:plan.nodes.find(n=>b.id.startsWith(n.id+'-'))?.stageId,logicalRows:[{parts:b.parts}],numberAnchor:b.id,kind:'response',visibility:'answer-dependent',controlItem:b.parts.find(p=>p.type==='choice')?.itemId??null});
 for(const row of renderPlan)row.number=numbers[row.equationId]??null;
 return {schemaVersion:1,unit,renderPlan,tables:plan.nodes.filter(n=>n.table).map(n=>({id:n.id,rows:n.table,revealAfterItemId:n.interaction?.id??null})),stages,equationNumbers:numbers,resultReferences:references,planHash:hash(plan),publishable:plan.state==='approved'&&plan.audit.status==='reviewed'&&plan.audit.findings.length===0,integrationStatus:'NOT_REGISTERED'};
}
