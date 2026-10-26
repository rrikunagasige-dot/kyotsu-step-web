/** Exact N08 design materializer. Produces authoring artifacts, never changes an active lesson. */
import {hash} from '../util.mjs';
import {rat,sym,mul,add} from '../solution/expression.mjs';
import {assembleConstruction,validateConstructionPlan} from '../interaction/construction.mjs';
import {LAYOUT_TOKENS,validateLayoutPlan} from '../layout/plan.mjs';
import {n08SourceBinding} from './n08-source-binding.mjs';
import {n08TransformationPlan} from './n08.mjs';
const root={kind:'sqrt',argument:rat(5)},pi={kind:'constant',name:'pi'},a=sym('a'),negative=v=>mul(rat(-1),v);
const value=(value,expression)=>({value,...(expression?{expression}:{})});
const P=partId=>({kind:'part',partId}),unary=(partId,argument)=>({kind:'unary',sign:{partId},argument}),binary=(left,operation,right)=>({kind:'binary',left,operation,right});
const signs=[value('-'),value('+')],nums=[value('3',rat(3)),value('-3',rat(-3)),value('0',rat(0))];
export function createN08ConstructionPlan(ir){
 if(ir.unit?.unitId!=='math-numbers-expressions-n08'||hash(ir)!==n08SourceBinding.sourceHash)throw Error('N08_FROZEN_SOURCE_REQUIRED');
 const semantic=new Map(ir.semantic.nodes.map(n=>[n.id,n]));
 const interactions=[];
 function make(node,specs,assembly,activePrompt,learnerDecision,prerequisiteInteractionIds=[],gradingPurpose='mathematical-value'){
  const id=node+'-build-r6',parts=specs.map(([suffix,role,expected,choices])=>({id:id+'-'+suffix,role,expected,choices}));
  const s=semantic.get(node),sourceRefs=[...s.before,...s.after].map(b=>b.id);
  const interaction={id,sourceNodeId:node,sourceRefs,prerequisiteInteractionIds,learnerDecision,nextUseRef:node+'-result',activePrompt,parts,assembly:assembly(parts),expectedStatement:{kind:'expression',expression:rat(0)},gradingPurpose};
  interaction.expectedStatement=assembleConstruction(interaction,Object.fromEntries(parts.map(p=>[p.id,p.expected]))).statement;
  interactions.push(interaction);return id;
 }
 const coordinates=[value('a',a),value('0',rat(0))];
 const distance=parts=>({kind:'relation',operator:'=',left:{kind:'absolute',argument:a},right:binary(P(parts[0].id),'-',P(parts[1].id))});
 make('n08-r5-q02-distance',[['right','coordinate','a',coordinates],['left','coordinate','0',coordinates]],distance,'右側の点と原点の座標を、それぞれ引き算の位置へ入れます。','a≥0。右の座標−左の座標。');
 const negativeCoordinates=[...coordinates].reverse();
 const d=make('n08-q03-order',[['right','coordinate','0',negativeCoordinates],['left','coordinate','a',negativeCoordinates]],distance,'今回は原点が右側です。二つの座標を、引き算の位置へ入れます。','a<0。右の座標−左の座標。');
 make('n08-03',[['sign','unary-sign','-',signs]],p=>({kind:'relation',operator:'=',left:add(rat(0),negative(a)),right:unary(p[0].id,a)}),'0からaを引いた数を、aを使って表します。','前の行の0−aをそのまま使う。',[d]);
 make('n08-04',[['value','rational','5',[value('5',rat(5)),value('-5',rat(-5)),value('0',rat(0))]]],p=>({kind:'relation',operator:'=',left:negative(rat(-5)),right:P(p[0].id)}),'括弧の中の数と符号が反対の数を求めます。','代入の式は直前の手本で確認済み。');
 const b7=make('n08-q07-bracket',[['sign','unary-sign','-',signs]],p=>({kind:'expression',expression:unary(p[0].id,add(root,negative(rat(3))))}),'選んだ規則を、括弧で囲んだ中身全体へ適用します。','中身の符号と負の場合の規則を使い、適用範囲を照合する。');
 const d7=make('n08-q07-distribute',[['root-sign','unary-sign','-',signs],['constant','rational','3',nums]],p=>({kind:'expression',expression:binary(unary(p[0].id,root),'+',P(p[1].id))}),'各項へ掛けた結果を、それぞれ同じ行の穴へ入れます。','分配した二つの積を分けて計算する。',[b7]);
 const terms7=[value('3',rat(3)),value('-\\sqrt5',negative(root))];
 make('n08-07',[['first-term','signed-term','3',terms7]],p=>({kind:'expression',expression:binary(P(p[0].id),'+',{kind:'remaining-term',id:'n08-07-build-r6-remaining-term',fromPartId:p[0].id,terms:terms7})}),'前の行の符号付きの項から、先頭へ置く正の項を選びます。残る項はその選択に応じて配置されます。','前行の二項を符号ごと動かして指定順にする。',[d7],'specified-order');
 const b9=make('n08-q09-bracket',[['sign','unary-sign','-',signs]],p=>({kind:'expression',expression:unary(p[0].id,add(rat(3),negative(pi)))}),'前に得た中身の符号を使い、括弧全体の外側を完成させます。','今回の3−π<0と負の場合の定義を使う。');
 const d9=make('n08-q09-distribute',[['first-sign','unary-sign','-',signs],['joining-operation','binary-operation','+',[value('+'),value('-')]]],p=>({kind:'expression',expression:binary(unary(p[0].id,rat(3)),{partId:p[1].id},pi)}),'二つの積を計算し、各項と項を結ぶ符号を入れます。','各積の符号と項を結ぶ演算を区別する。',[b9]);
 const terms9=[value('\\pi',pi),value('-3',rat(-3))];
 make('n08-09',[['first-term','signed-term','\\pi',terms9]],p=>({kind:'expression',expression:binary(P(p[0].id),'+',{kind:'remaining-term',id:'n08-09-build-r6-remaining-term',fromPartId:p[0].id,terms:terms9})}),'前の行の符号付きの項から、先頭へ置く正の項を選びます。残る項はその選択に応じて配置されます。','前行の二項を各一回使い指定順にする。',[d9],'specified-order');
 make('n08-q12-negative',[['sign','unary-sign','+',[value('+'),value('-')]]],p=>({kind:'relation',operator:'=',left:mul(negative(a),negative(a)),right:unary(p[0].id,{kind:'power',base:a,exponent:2})}),'負号が二つ掛かる部分の符号を入れます。','a<0。a²の指数は既習として保持し、二つの負号の積を判断する。');
 const plan={schemaVersion:'construction-plan/1',unitId:ir.unit.unitId,revision:6,interactions};
 const checked=validateConstructionPlan(plan);if(checked.status!=='PASS')throw Error(JSON.stringify(checked.findings));
 return JSON.parse(JSON.stringify(plan));
}
export function createN08LayoutPlan(ir){
 const source=n08TransformationPlan(ir),construction=createN08ConstructionPlan(ir),byNode=new Map(construction.interactions.map(i=>[i.sourceNodeId,i]));
 const groups=source.groups.map(g=>{
  const absolute=g.kind==='expression-chain',rows=absolute?g.rows.slice(1):g.rows,rowIds=rows.map(r=>r.id),prose=[];
  const text=s=>[{type:'text',text:s}];
  prose.push({id:g.id+'-lead',role:'group-lead',content:text(absolute?'中身の符号は負と分かっています。選んだ規則を式全体へ使います。':'与えられた大小関係から、中身と0を比較する形を作ります。'),placement:'group-start',visibleAfter:[],requiredByRowIds:[]});
  if(absolute)prose.push({id:g.id+'-note',role:'essential-note',content:[...text('負号を'),{type:'math',latex:'-1'},...text('の掛け算に直します。')],placement:'before-row',rowRef:rows[1].id,visibleAfter:[byNode.get(rows[0].sourceNodeId).id],requiredByRowIds:[rows[1].id,rows[2].id]});
  for(const r of rows.filter(r=>r.interactionRef)){
   const interaction=byNode.get(r.sourceNodeId),id=interaction?.id??r.interactionRef;
   prose.push({id:r.id+'-prompt',role:'active-prompt',content:interaction?text(interaction.activePrompt):r.before,placement:'group-end',rowRef:r.id,interactionRef:id,visibleAfter:[],requiredByRowIds:[]});
  }
  const last=rows.at(-1),lastId=byNode.get(last.sourceNodeId)?.id??last.interactionRef;
  prose.push({id:g.id+'-interpretation',role:'interpretation',content:last.after.length?last.after:text('中身の符号を使って、元の問題を計算できました。'),placement:'group-end',visibleAfter:lastId?[lastId]:[],requiredByRowIds:[]});
  const details=g.rows.flatMap(r=>[...r.before,...r.after]);if(details.length)prose.push({id:g.id+'-detail',role:'detail',content:details,placement:'group-end',visibleAfter:lastId?[lastId]:[],requiredByRowIds:[]});
  return {id:g.id,rowIds,numberRowRef:rowIds.at(-1),numberCollision:'below-final-row',prose,states:{initial:rowIds.slice(0,absolute?1:2),partial:rowIds.slice(0,absolute?3:2),complete:rowIds}};
 });
 const plan={schemaVersion:'layout-plan/1',unitId:source.unitId,tokens:{...LAYOUT_TOKENS},groups};
 const checked=validateLayoutPlan(plan);if(checked.status!=='PASS')throw Error(JSON.stringify(checked.findings));return plan;
}
export function n08Revision6TransformationPlan(ir){
 const sourcePlan=n08TransformationPlan(ir),constructionPlan=createN08ConstructionPlan(ir),layoutPlan=createN08LayoutPlan(ir);
 const constructionBindings=sourcePlan.groups.flatMap(g=>g.rows.filter(r=>r.interactionRef).flatMap(r=>{const c=constructionPlan.interactions.find(i=>i.sourceNodeId===r.sourceNodeId);return c?[{rowRef:r.id,constructionRef:c.id}]:[];}));
 return {schemaVersion:'transformation-plan/2',sourcePlan,constructionPlan,layoutPlan,constructionBindings,
  rootRowMerges:sourcePlan.groups.filter(g=>g.kind==='expression-chain').map(g=>({rootRowRef:g.rows[0].id,intoRowRef:g.rows[1].id}))};
}
/** Full inventory for a later, separately applied r6 lesson. Source and old answers are retained. */
export function materializeN08Revision6Design(ir,{sourceBundle}={}){
 const constructionPlan=createN08ConstructionPlan(ir),layoutPlan=createN08LayoutPlan(ir),transformationPlan=n08Revision6TransformationPlan(ir);
 const byNode=new Map(constructionPlan.interactions.map(i=>[i.sourceNodeId,i]));
 const nodes=ir.nodes.map(n=>({sourceNodeId:n.id,stageId:n.stageId,oldInteractionId:n.interaction??null,
  interactionId:byNode.get(n.id)?.id??(n.id==='n08-q04-substitute'?null:n.interaction??null),
  action:byNode.has(n.id)?'construction':n.id==='n08-q04-substitute'?'worked-substitution':n.interaction?'retain-interaction':'retain-no-answer',
  sourceRefs:(ir.semantic.nodes.find(s=>s.id===n.id)?[...ir.semantic.nodes.find(s=>s.id===n.id).before,...ir.semantic.nodes.find(s=>s.id===n.id).after]:[]).map(b=>b.id)}));
 const oldItems=ir.unit.sections.flatMap(s=>s.items),parents=nodes.filter(n=>n.interactionId);
 if(nodes.length!==39||oldItems.length!==34||parents.length!==33||nodes.filter(n=>n.action==='retain-interaction').length!==22)throw Error('N08_FULL_INVENTORY_CHANGED');
 let bundleEvidence={sourceBundleHash:ir.solutionBundleHash,sourceBundleVerified:false};
 if(sourceBundle){
  const count=sourceBundle.problems.flatMap(p=>p.segments).length;
  if(hash(sourceBundle)!==ir.solutionBundleHash||count!==38||hash([...sourceBundle.nodeIds].sort())!==hash(nodes.map(n=>n.sourceNodeId).sort()))throw Error('N08_SOURCE_BUNDLE_CHANGED');
  bundleEvidence={sourceBundleHash:hash(sourceBundle),sourceSegmentCount:count,sourceBundleVerified:true};
 }
 const output={schemaVersion:'n08-revision6-design/1',unitId:ir.unit.unitId,revision:6,baseIRHash:hash(ir),...bundleEvidence,
  inventory:{sourceNodes:39,legacyAnswers:34,unchangedAnswers:22,newConstructionParents:11,independentParts:15,requiredParentAnswers:33,noAnswerNodes:6},nodes,
  retiredOnlyInRevision6:[{sourceNodeId:'n08-q04-substitute',oldInteractionId:ir.nodes.find(n=>n.id==='n08-q04-substitute').interaction,reason:'Given substitution is a worked example; its numerical value remains a learner calculation.',oldRecordPreserved:true}],
  constructionPlan,layoutPlan,transformationPlan,sourceArchiveHash:hash(ir.unit),activeLessonChanged:false,meaningAuditRequired:true};
 return {...output,designHash:hash(output)};
}
