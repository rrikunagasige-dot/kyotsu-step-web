import {validateTransformationPlan} from './validate.mjs';
import {transformationCandidates} from './patterns.mjs';
export function planTransformations({ir,transformationPlan}){
 const checked=validateTransformationPlan(ir,transformationPlan);
 if(transformationPlan.schemaVersion==='transformation-plan/3'){
  if(checked.status!=='PASS')return checked;
  const constructions=[...transformationPlan.constructionPlan.sameMeaningInteractions??[],...transformationPlan.constructionPlan.interactions],legacy=transformationPlan.constructionPlan.legacyLocalItems??[];
  const candidates=[...constructions.flatMap(i=>i.parts.map(p=>({id:p.id,parentRef:i.id,nodeId:i.sourceNodeId,role:p.role,learnerDecision:p.prompt??i.activePrompt,nextUseRef:i.nextUseRef,prerequisiteInteractionIds:i.prerequisiteInteractionIds}))),...legacy.map(i=>({id:i.id,parentRef:i.id,nodeId:transformationPlan.nodeDesign.find(n=>n.interactionId===i.id)?.nodeId,role:i.answerType==='text'?'meaning-or-relation':'operand',learnerDecision:i.prompt,nextUseRef:i.id+'-result'}))];
  return {...checked,candidates,constructionCandidates:candidates.filter(c=>constructions.some(i=>i.id===c.parentRef)),decisions:transformationPlan.requiredInteractionRefs.map(id=>({id,decision:'ADOPT',reason:'Approved authoring contract; independent semantic review is still required.',blankRole:constructions.some(i=>i.id===id)?'construction':'local-decision',partIds:candidates.filter(c=>c.parentRef===id).map(c=>c.id)})),automaticAcceptance:false,aiReviewStatus:'NOT_REVIEWED',meaningAuditRequired:true};
 }
 if(transformationPlan.schemaVersion==='transformation-plan/2'){
  const source=transformationPlan.sourcePlan,rows=new Map(source.groups.flatMap(g=>g.rows.map(r=>[r.id,r]))),replaced=new Set(transformationPlan.constructionBindings.map(b=>rows.get(b.rowRef)?.interactionRef));
  return {...checked,candidates:source.graphs.flatMap(g=>transformationCandidates(g).candidates),
   constructionCandidates:transformationPlan.constructionPlan.interactions.flatMap(i=>i.parts.map(p=>({id:p.id,parentRef:i.id,nodeId:i.sourceNodeId,role:p.role,learnerDecision:i.learnerDecision,nextUseRef:i.nextUseRef}))),
   decisions:[...source.candidates.filter(c=>!replaced.has(c.id)).map(({id,decision,reason,learnerDecision,blankRole})=>({id,decision,reason,learnerDecision,blankRole})),...transformationPlan.constructionPlan.interactions.map(i=>({id:i.id,decision:'ADOPT',reason:'Explicit typed construction contract, not a completed-expression selection.',learnerDecision:i.learnerDecision,blankRole:'construction',partIds:i.parts.map(p=>p.id)}))],automaticAcceptance:false};
 }
 return {...checked,candidates:transformationPlan.graphs.flatMap(g=>transformationCandidates(g).candidates),decisions:transformationPlan.candidates.map(({id,decision,reason,learnerDecision,blankRole})=>({id,decision,reason,learnerDecision,blankRole})),automaticAcceptance:false};
}
