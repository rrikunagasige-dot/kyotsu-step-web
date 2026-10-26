/** Opt-in construction/layout layer over the fully checked v1 source presentation. */
import {planV2Schema} from './schema.mjs';
import {validateConstructionPlan,compileConstruction,projectConstruction} from '../interaction/construction.mjs';
import {validateLayoutPlan,projectLayout} from '../layout/plan.mjs';
import {hash} from '../util.mjs';
import {createN08ConstructionPlan} from './n08-r6.mjs';
function canonicalMath(v){
 if(v.kind==='rational'){
  let n=BigInt(v.n),d=BigInt(v.d),a=n<0n?-n:n,b=d;while(b){const r=a%b;a=b;b=r;}return {kind:'rational',n:String(n/(a||1n)),d:String(d/(a||1n))};
 }
 if(v.kind==='multiply'){
  const args=v.args.map(canonicalMath),numbers=args.filter(a=>a.kind==='rational'),other=args.filter(a=>a.kind!=='rational');
  const coefficient=canonicalMath({kind:'rational',n:String(numbers.reduce((n,a)=>n*BigInt(a.n),1n)),d:String(numbers.reduce((d,a)=>d*BigInt(a.d),1n))});
  const factors=coefficient.n==='1'&&coefficient.d==='1'&&other.length?other:[coefficient,...other];return factors.length===1?factors[0]:{kind:'multiply',args:factors};
 }
 if(v.kind==='relation')return {kind:'relation',operator:v.operator,left:canonicalMath(v.left),right:canonicalMath(v.right)};
 if(v.kind==='expression')return {kind:'expression',expression:canonicalMath(v.expression)};
 if(v.kind==='symbol'||v.kind==='constant')return {kind:v.kind,name:v.name};
 if(v.kind==='sqrt'||v.kind==='absolute')return {kind:v.kind,argument:canonicalMath(v.argument)};
 if(v.kind==='add')return {kind:'add',args:v.args.map(canonicalMath)};
 if(v.kind==='power')return {kind:'power',base:canonicalMath(v.base),exponent:v.exponent};
 if(v.kind==='divide')return {kind:'divide',numerator:canonicalMath(v.numerator),denominator:canonicalMath(v.denominator)};
 throw Error('UNSUPPORTED_PROJECTION_AST');
}
export function validateTransformationV2(ir,input,options,validateSource){
 const parsed=planV2Schema.safeParse(input);if(!parsed.success)return {status:'FAIL',findings:[{ruleId:'TG_V2_SCHEMA',detail:parsed.error.message}]};
 const p=parsed.data,source=validateSource(ir,p.sourcePlan,options),findings=[...(source.findings??[])],add=(ruleId,detail)=>findings.push({ruleId,detail});
 const construction=validateConstructionPlan(p.constructionPlan),layout=validateLayoutPlan(p.layoutPlan,{rowIds:p.sourcePlan.groups.flatMap(g=>g.rows.map(r=>r.id)),interactionIds:[...p.sourcePlan.candidates.map(c=>c.id),...p.constructionPlan.interactions.map(c=>c.id)]});
 findings.push(...construction.findings,...layout.findings);
 if(p.constructionPlan.unitId!==p.sourcePlan.unitId||p.layoutPlan.unitId!==p.sourcePlan.unitId)add('TG_V2_SCOPE','unit mismatch');
 const rows=new Map(p.sourcePlan.groups.flatMap(g=>g.rows.map(r=>[r.id,r]))),interactions=new Map(p.constructionPlan.interactions.map(i=>[i.id,i])),nodes=new Map((ir.semantic?.nodes??ir.nodes??ir.problems?.flatMap(p=>p.steps)??[]).map(n=>[n.id,n]));
 const bindingRows=new Set(),boundParents=new Set();
 for(const b of p.constructionBindings){
  const row=rows.get(b.rowRef),i=interactions.get(b.constructionRef);if(bindingRows.has(b.rowRef)||boundParents.has(b.constructionRef))add('TG_V2_DUPLICATE_BINDING',b.rowRef);bindingRows.add(b.rowRef);boundParents.add(b.constructionRef);
  if(!row||!i||row.sourceNodeId!==i.sourceNodeId||!row.interactionRef){add('TG_V2_BINDING',b.rowRef);continue;}
  const graph=p.sourcePlan.graphs.find(g=>g.id===row.graphRef),statement=graph?.states.find(s=>s.id===row.stateRef)?.statement;
  // The typed assembly must reproduce an already source-bound statement, never a new root.
  if(!statement||hash(canonicalMath(statement))!==hash(canonicalMath(i.expectedStatement)))add('TG_V2_SOURCE_ASSEMBLY',b.rowRef);
 }
 for(const i of interactions.values()){
  const n=nodes.get(i.sourceNodeId),refs=[...(n?.before??[]),...(n?.after??[])].map(b=>b.id);
  if(!n||i.sourceRefs.some(ref=>!refs.includes(ref)))add('TG_V2_SOURCE_COVERAGE',i.id);
 }
 // Parents outside the displayed numeric chains need an explicit registered source contract.
 // The N08 bridge is exact-source-bound; it does not authorize arbitrary symbolic cases.
 let canonicalOutside=new Map();
 if(p.sourcePlan.unitId==='math-numbers-expressions-n08'){
  try{canonicalOutside=new Map(createN08ConstructionPlan(ir).interactions.map(i=>[i.sourceNodeId,i.expectedStatement]));}catch{add('TG_V2_SOURCE_COVERAGE','N08 construction source changed');}
 }
 for(const i of interactions.values())if(!boundParents.has(i.id)&&(p.sourcePlan.scope.nodeIds.includes(i.sourceNodeId)||!canonicalOutside.has(i.sourceNodeId)||hash(canonicalOutside.get(i.sourceNodeId))!==hash(i.expectedStatement)))add('TG_V2_UNBOUND_CONSTRUCTION',i.id);
 const merged=new Set(),targets=new Set();
 for(const m of p.rootRowMerges){
  const group=p.sourcePlan.groups.find(g=>g.rows.some(r=>r.id===m.rootRowRef)),root=rows.get(m.rootRowRef),into=rows.get(m.intoRowRef);
  if(merged.has(m.rootRowRef)||targets.has(m.intoRowRef)||!group||group.kind!=='expression-chain'||group.rows[0]?.id!==m.rootRowRef||group.rows[1]?.id!==m.intoRowRef||root?.interactionRef||root?.graphRef!==into?.graphRef||!bindingRows.has(m.intoRowRef))add('TG_V2_ROOT_MERGE',m.rootRowRef);
  merged.add(m.rootRowRef);targets.add(m.intoRowRef);
 }
 if(p.layoutPlan.groups.length!==p.sourcePlan.groups.length)add('TG_V2_LAYOUT_COVERAGE','group count');
 for(const g of p.sourcePlan.groups){const l=p.layoutPlan.groups.find(l=>l.id===g.id);if(!l||hash(l.rowIds)!==hash(g.rows.filter(r=>!merged.has(r.id)).map(r=>r.id)))add('TG_V2_LAYOUT_COVERAGE',g.id);}
 return {status:findings.length?'FAIL':'PASS',findings,mathReceipts:source.mathReceipts??[],baseIRHash:hash(ir),planHash:hash(input),constructionDesignHash:hash(input.constructionPlan),layoutDesignHash:hash(input.layoutPlan),learnerCopyHash:layout.learnerCopyHash,meaningAuditRequired:true};
}
export function compileTransformationV2(ir,plan,checked,compileSource){
 if(checked.status!=='PASS')return checked;
 const source=compileSource(ir,plan.sourcePlan);if(source.status!=='PASS')return source;
 const constructions=plan.constructionPlan.interactions.map(compileConstruction),byId=new Map(constructions.map(i=>[i.id,i])),bindings=new Map(plan.constructionBindings.map(b=>[b.rowRef,b.constructionRef]));
 const replaced=new Map(plan.sourcePlan.groups.flatMap(g=>g.rows.filter(r=>bindings.has(r.id)).map(r=>[r.interactionRef,bindings.get(r.id)]))),replace=id=>replaced.get(id)??id;
 const groups=source.compiled.groups.map(g=>({...g,rows:g.rows.map(r=>{
  const c=byId.get(bindings.get(r.id));if(!c)return {...r,visibleAfter:r.visibleAfter.map(replace),before:[],after:[]};
  const completed={left:c.completed.left,relation:r.continuation?'=':c.completed.relation,right:c.completed.right},masked={left:c.masked.left,relation:r.continuation?'=':c.masked.relation,right:c.masked.right};
  return {...r,interactionRef:c.id,visibleAfter:r.visibleAfter.map(replace),constructionRef:c.id,slots:[],before:[],after:[],completed,masked};
 })}));
 for(const m of plan.rootRowMerges){const group=groups.find(g=>g.rows.some(r=>r.id===m.rootRowRef)),root=group.rows.find(r=>r.id===m.rootRowRef),into=group.rows.find(r=>r.id===m.intoRowRef);into.mergedRootLeft=root.completed.right;into.completed.left=root.completed.right;into.masked.left=root.completed.right;into.completed.relation=into.masked.relation='=';group.rows=group.rows.filter(r=>r.id!==m.rootRowRef);}
 const aliases=Object.fromEntries(Object.entries(source.compiled.numberAliases).map(([k,v])=>[k,plan.rootRowMerges.find(m=>m.rootRowRef===v)?.intoRowRef??v]));
 const compiled={...source.compiled,schemaVersion:'transformation-reading/2',presentationVersion:2,groups,numberAliases:aliases,sourcePlanHash:source.compiled.planHash,planHash:checked.planHash,constructionDesignHash:checked.constructionDesignHash,layoutDesignHash:checked.layoutDesignHash,learnerCopyHash:checked.learnerCopyHash,
  constructionPlan:plan.constructionPlan,layoutPlan:plan.layoutPlan,constructionInteractions:constructions,
  interactions:[...source.compiled.interactions.filter(i=>!replaced.has(i.id)).map(i=>({...i,prerequisiteInteractionIds:i.prerequisiteInteractionIds.map(replace)})),...constructions.map(i=>({id:i.id,nodeId:i.sourceNodeId,blankRole:'construction',learnerDecision:i.learnerDecision,prerequisiteInteractionIds:i.prerequisiteInteractionIds}))]};
 delete compiled.compiledPresentationHash;
 return {status:'PASS',compiled:{...compiled,compiledPresentationHash:hash(compiled)},mathReceipts:checked.mathReceipts,meaningAuditRequired:true};
}
export function projectTransformationV2(presentation,solvedIds=[],view={}){
 const recorded=new Set(solvedIds),solved=new Set(),allowed=new Set(presentation.interactions.map(i=>i.id));
 if([...recorded].some(id=>!allowed.has(id)))throw Error('UNKNOWN_COMPLETED_INTERACTION');
 const external=new Set(view.externalSolvedIds??[]);
 for(let pass=0;pass<presentation.interactions.length;pass++)for(const i of presentation.interactions)if(recorded.has(i.id)&&i.prerequisiteInteractionIds.every(id=>solved.has(id)||external.has(id)))solved.add(i.id);
 const groups=presentation.groups.filter(g=>(!view.stageId||g.stageIds.includes(view.stageId))&&(g.boundaryNodeIds??[]).every(id=>view.boundarySolvedNodeIds?.includes(id))).map(g=>{
  const rows=g.rows.filter(r=>r.visibleAfter.every(id=>solved.has(id))).map(r=>{
   const done=!r.interactionRef||solved.has(r.interactionRef),i=presentation.interactions.find(i=>i.id===r.interactionRef);
   const source=r.constructionRef?presentation.constructionPlan.interactions.find(i=>i.id===r.constructionRef):null;
   const draft=source?(done?Object.fromEntries(source.parts.map(p=>[p.id,p.expected])):view.constructionDrafts?.[source.id]??{}):{};
   const construction=source?projectConstruction(source,draft,{choicesOpen:view.choicesOpen,solved:done}):null;
   const formula=construction?{...construction.formula,left:r.mergedRootLeft??construction.formula.left,relation:r.completed.relation}:done?r.completed:r.masked;
   if(formula.tokens)delete formula.tokens; // left/relation/right are the sole rendered representation in a group.
   return {aliasRefs:Object.entries(presentation.numberAliases??{}).filter(([,target])=>target===r.id).map(([id])=>id),id:r.id,sourceNodeId:r.sourceNodeId,stateRef:r.stateRef,role:r.role,continuation:r.continuation,done,before:[],after:[],formula,
    current:!done&&i?{id:i.id,learnerDecision:i.learnerDecision,blankRole:i.blankRole,...(construction?{parts:construction.parts}:view.choicesOpen===i.id?{choices:i.choices}:{})}:null};
  });
  const current=rows.find(r=>r.current)?.current?.id??null;
  return {id:g.id,kind:g.kind,number:g.number,numberId:g.numberId,rows,layout:projectLayout(presentation.layoutPlan,g.id,{visibleRowIds:rows.map(r=>r.id),solvedIds:[...solved],currentInteractionId:current,detailOpen:view.detailOpen})};
 }).filter(g=>g.rows.length);
 return {schemaVersion:'transformation-visible/2',unitId:presentation.unitId,presentationVersion:presentation.presentationVersion,planHash:presentation.planHash,groups};
}
