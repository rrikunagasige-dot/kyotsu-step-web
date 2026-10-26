/** Display contracts are independent of mathematical atoms and grading units. */
import {z} from 'zod';
import {hash} from '../util.mjs';
export const LAYOUT_TOKENS=Object.freeze({mathFontPx:18,katexScale:1,bodyLineHeight:1.8,mathLineHeight:1.4,rowGapPx:4,noteGapPx:6,paragraphGapPx:8,conceptGapPx:16,minHitPx:44,relationTolerancePx:1,centerTolerancePx:2,fontTolerancePx:0.25});
const id=z.string().min(1).max(160),ids=z.array(id),copy=z.array(z.discriminatedUnion('type',[
 z.object({type:z.literal('text'),text:z.string()}).strict(),z.object({type:z.literal('math'),latex:z.string()}).strict(),z.object({type:z.literal('term'),text:z.string()}).strict(),
])).min(1);
export const layoutPlanSchema=z.object({schemaVersion:z.literal('layout-plan/1'),unitId:id,
 tokens:z.object(Object.fromEntries(Object.entries(LAYOUT_TOKENS).map(([key,value])=>[key,z.literal(value)]))).strict(),
 groups:z.array(z.object({id,rowIds:ids.min(1),numberRowRef:id,numberCollision:z.literal('below-final-row'),
  prose:z.array(z.object({id,role:z.enum(['group-lead','essential-note','active-prompt','detail','interpretation']),content:copy,
   placement:z.enum(['group-start','before-row','after-row','group-end']),rowRef:id.optional(),interactionRef:id.optional(),
   visibleAfter:ids,requiredByRowIds:ids.default([]),
  }).strict()),
  states:z.object({initial:ids.min(1),partial:ids.min(1),complete:ids.min(1)}).strict(),
 }).strict()).min(1),
}).strict();
export function validateLayoutPlan(input,{rowIds,interactionIds}={}){
 const parsed=layoutPlanSchema.safeParse(input);if(!parsed.success)return {status:'FAIL',findings:[{ruleId:'LAYOUT_SCHEMA',detail:parsed.error.message}]};
 const plan=parsed.data,findings=[],seen=new Set(),add=(ruleId,detail)=>findings.push({ruleId,detail});
 for(const g of plan.groups){
  if(seen.has(g.id))add('LAYOUT_DUPLICATE_ID',g.id);seen.add(g.id);
  if(new Set(g.rowIds).size!==g.rowIds.length||rowIds&&g.rowIds.some(id=>!rowIds.includes(id)))add('LAYOUT_UNKNOWN_ROW',g.id);
  if(g.numberRowRef!==g.rowIds.at(-1))add('LAYOUT_NUMBER_ANCHOR',g.id);
  for(const [state,rows]of Object.entries(g.states))if(new Set(rows).size!==rows.length||rows.some(id=>!g.rowIds.includes(id))||rows.some((id,index)=>id!==g.rowIds[index]))add('LAYOUT_STATE_PREFIX',g.id+':'+state);
  if(g.states.initial.length>g.states.partial.length||g.states.partial.length>g.states.complete.length||hash(g.states.complete)!==hash(g.rowIds))add('LAYOUT_STATE_COVERAGE',g.id);
  const singular=new Set();
  for(const p of g.prose){
   if(seen.has(p.id))add('LAYOUT_DUPLICATE_ID',p.id);seen.add(p.id);
   if(['group-lead','interpretation'].includes(p.role)){if(singular.has(p.role))add('LAYOUT_DUPLICATE_PROSE',g.id+':'+p.role);singular.add(p.role);}
   if(['before-row','after-row'].includes(p.placement)&&!p.rowRef||p.rowRef&&!g.rowIds.includes(p.rowRef)||p.rowRef&&!['before-row','after-row'].includes(p.placement)&&p.role!=='active-prompt')add('LAYOUT_PROSE_ANCHOR',p.id);
   if(p.role==='active-prompt'&&(!p.interactionRef||!p.rowRef||p.placement!=='group-end'))add('LAYOUT_ACTIVE_PROMPT',p.id);
   if(p.interactionRef&&interactionIds&&!interactionIds.includes(p.interactionRef)||interactionIds&&p.visibleAfter.some(id=>!interactionIds.includes(id)))add('LAYOUT_UNKNOWN_INTERACTION',p.id);
   if(p.requiredByRowIds.some(id=>!g.rowIds.includes(id)))add('LAYOUT_REQUIRED_ROW',p.id);
   if(p.requiredByRowIds.length&&p.role!=='essential-note')add('LAYOUT_ESSENTIAL_IN_DETAIL',p.id);
   if(p.role==='essential-note'&&p.requiredByRowIds.some(id=>g.rowIds.indexOf(id)<g.rowIds.indexOf(p.rowRef??g.rowIds[0])||(id===p.rowRef&&p.placement==='after-row')))add('LAYOUT_LATE_ESSENTIAL_NOTE',p.id);
   if(p.role==='group-lead'&&p.placement!=='group-start'||p.role==='interpretation'&&p.placement!=='group-end')add('LAYOUT_PROSE_ROLE',p.id);
  }
  const prompts=g.prose.filter(p=>p.role==='active-prompt').map(p=>p.interactionRef);if(new Set(prompts).size!==prompts.length)add('LAYOUT_DUPLICATE_PROMPT',g.id);
 }
 return {status:findings.length?'FAIL':'PASS',findings,layoutHash:hash(input),learnerCopyHash:hash(plan.groups.map(g=>({id:g.id,prose:g.prose}))),meaningAuditRequired:true};
}
export function projectLayout(plan,groupId,{visibleRowIds=[],solvedIds=[],currentInteractionId=null,detailOpen=false}={}){
 const g=plan.groups.find(g=>g.id===groupId);if(!g)throw Error('UNKNOWN_LAYOUT_GROUP');
 if(visibleRowIds.some(id=>!g.rowIds.includes(id)))throw Error('UNKNOWN_LAYOUT_ROW');
 const visible=new Set(visibleRowIds),solved=new Set(solvedIds);
 const prose=g.prose.filter(p=>p.visibleAfter.every(id=>solved.has(id))&&(!p.rowRef||visible.has(p.rowRef))&&
  (p.role!=='active-prompt'||p.interactionRef===currentInteractionId&&!solved.has(p.interactionRef))&&
  (p.role!=='interpretation'||g.rowIds.every(id=>visible.has(id))&&!currentInteractionId)&&
  (p.role!=='detail'||detailOpen));
 return {schemaVersion:'layout-visible/1',groupId,tokens:plan.tokens,numberRowRef:visibleRowIds.at(-1)??null,completeNumberRowRef:g.numberRowRef,numberVisible:visibleRowIds.length>0,numberCollision:g.numberCollision,
  prose:prose.map(({id,role,content,placement,rowRef})=>({id,role,content,placement,...(rowRef?{rowRef}:{})})),detailAvailable:g.prose.some(p=>p.role==='detail'&&p.visibleAfter.every(id=>solved.has(id)))};
}
/** Actual browser measurements, not screenshot similarity or educational judgement. */
export function checkLayoutGeometry(measurements,tokens=LAYOUT_TOKENS){
 const findings=[];
 for(const m of measurements){
  if(!Number.isFinite(m.fontPx)||Math.abs(m.fontPx-tokens.mathFontPx)>tokens.fontTolerancePx)findings.push({ruleId:'LAYOUT_FONT',ref:m.ref});
  for(const [key,tolerance]of [['relationDeltaPx',tokens.relationTolerancePx],['centerDeltaPx',tokens.centerTolerancePx]])if(!Number.isFinite(m[key])||Math.abs(m[key])>tolerance)findings.push({ruleId:'LAYOUT_GEOMETRY',ref:m.ref,key});
  if(m.overflow!==false||m.hitOverlap!==false)findings.push({ruleId:'LAYOUT_COLLISION',ref:m.ref});
 }
 if(!measurements.length)findings.push({ruleId:'LAYOUT_NO_MEASUREMENTS'});
 return {status:findings.length?'FAIL':'PASS',findings,educationalQualityVerified:false};
}
