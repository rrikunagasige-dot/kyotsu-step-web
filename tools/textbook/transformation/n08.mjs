/** Exact N08 r5 adapter. No new grading objects or general symbolic Abs/case inference. */
import {hash} from '../util.mjs';
import {rat,add,mul,relation,expr,expressionLatex} from '../solution/expression.mjs';
const text=s=>s?[{type:'text',text:s}]:[];
const neg=v=>mul(rat(-1),v),root={kind:'sqrt',argument:rat(5)},pi={kind:'constant',name:'pi'};
function graph(id,statements,rules){return {schemaVersion:'solution-graph/1',id,variable:'u',parameters:[],initialFacts:['real-arithmetic'],givens:[{id:id+'-given',statement:statements[0]}],rootStateId:'S0',goalStateIds:['S'+(statements.length-1)],states:statements.map((statement,i)=>({id:'S'+i,statement,activeVariable:'u',fixedParameters:[],facts:['real-arithmetic']})),transitions:rules.map((r,i)=>({id:id+'-a'+i,from:'S'+i,to:'S'+(i+1),ruleId:r[0],...(r[1]?{operand:r[1]}:{}),requires:['real-arithmetic'],produces:[],basisRefs:['real-arithmetic']}))};}
export function n08Graphs(){
 const inequality=(id,a,b)=>graph(id,[relation(a,'<',b),relation(add(a,neg(b)),'<',add(b,neg(b))),relation(add(a,neg(b)),'<',rat(0))],[['add-both-sides',neg(b)],['rewrite']]);
 const absolute=(id,a,b)=>{const inside=add(a,neg(b));return graph(id,[expr({kind:'absolute',argument:inside}),expr(neg(inside)),expr(add(mul(rat(-1),a),mul(rat(-1),neg(b)))),expr(add(neg(a),b)),expr(add(b,neg(a)))],[['rewrite'],['rewrite'],['rewrite'],['rewrite']]);};
 return [inequality('n08-root-sign',root,rat(3)),absolute('n08-root-absolute',root,rat(3)),inequality('n08-pi-sign',rat(3),pi),absolute('n08-pi-absolute',rat(3),pi)];
}
export function n08TransformationPlan(ir){
 const graphs=n08Graphs(),byNode=new Map(ir.nodes.map(n=>[n.id,n])),sem=new Map(ir.semantic.nodes.map(n=>[n.id,n])),contracts=ir.unit.sections.flatMap(s=>s.items).map(({id,answer,acceptedAnswers,choices})=>({id,answer,acceptedAnswers,choices})),items=new Map(contracts.map(c=>[c.id,c]));
 const candidates=[],coverage=[],numberAliases={},scopeNodes=[];
 const blocks=id=>[...sem.get(id).before,...sem.get(id).after].map(b=>b.id);
 function row(g,node,state,gate,paths=[],before='',after='',interaction=true){const id=g.id+'-'+state,n=byNode.get(node);return {id,graphRef:g.id,stateRef:state,sourceNodeId:node,sourceRefs:blocks(node),role:'main',visibleAfter:gate.map(n=>byNode.get(n).interaction),interactionRef:interaction?n.interaction:null,slots:paths.map((path,i)=>({id:id+'-slot'+i,interactionRef:n.interaction,path})),before:text(before),after:text(after),afterVisible:true,continuation:g.id.includes('absolute')&&state!=='S0'};}
 function group(g,stage,nodes,rows,boundary,number,kind,patternId){
  scopeNodes.push(...nodes);
  const interactions=nodes.map(n=>byNode.get(n).interaction);
  for(const [i,nodeId] of nodes.entries()){
   const r=rows.find(r=>r.interactionRef===byNode.get(nodeId).interaction),c=items.get(r.interactionRef),statement=g.states.find(s=>s.id===r.stateRef).statement;
   let target=statement;for(const key of r.slots[0].path.split('.'))target=target[key];
   candidates.push({id:c.id,nodeId,blankRole:r.slots[0].path==='operator'?'relation':nodeId.includes('operation')?'operand':nodeId.includes('bracket')?'expression':'calculation',learnerDecision:r.before.map(p=>p.text??p.latex).join('')||byNode.get(nodeId).goal,availableFactRefs:['real-arithmetic',g.id+'-given'],prerequisiteInteractionIds:interactions.slice(0,i),nextUseRef:interactions[i+1]??boundary[0]??nodeId+'-conclusion',taskContract:{kind:'existing-select',requestedOperation:byNode.get(nodeId).goal},decision:'ADOPT',reason:'既存の一回答を保ち、普通の変形を一続きで完成させる。意味・規則の判断は外側に保持。',expected:c.answer,targetLatex:typeof target==='string'?target:expressionLatex(target),choices:[...new Set([c.answer,...c.choices])]});
  }
  for(const nodeId of nodes){const r=rows.find(r=>r.sourceNodeId===nodeId&&r.interactionRef);for(const ref of blocks(nodeId)){coverage.push({sourceRef:ref,disposition:'superseded-display',rowRef:r.id,reason:'承認P001の連続式と説明へ対応。元leafは保存する。'});if(ir.equationNumbers[ref]!==undefined)numberAliases[ref]=r.id;}}
  return {id:g.id+'-group',kind,patternId,graphRef:g.id,stageIds:[stage],sourceNodeIds:nodes,stepRefs:g.transitions.map(t=>t.id),number,numberId:g.id+'-number',boundaryNodeIds:boundary,boundaryReason:'同じ数値の問題・実数条件での通常変形。符号の意味、規則選択、場合の証明の境界は外側へ保持。',conclusion:{kind:'terminal-in-flow',stateRef:g.goalStateIds[0]},rows};
 }
 const a='n08-r5-q06-operation',b='n08-q06-subtract',c='n08-q07-bracket',d='n08-q07-distribute',e='n08-07',f='n08-q08-order',h='n08-r5-q08-operation',i='n08-q08-difference',j='n08-q09-bracket',k='n08-q09-distribute',l='n08-09';
 const [g6,g7,g8,g9]=graphs;
 const groups=[
 group(g6,'n08-stage-06',[a,b],[row(g6,a,'S0',[],[],'前の段階で得た大小関係から、元の中身と0を比べる形を作ります。','',false),row(g6,a,'S1',[],['left.args.1.args.1','right.args.1.args.1'],'左辺に元の中身を作るため、両辺から同じ数を引きます。','両辺に同じ操作をしたので、不等号の向きは変わりません。'),row(g6,b,'S2',[a],['right'],'右辺に残った同じ数どうしの差を計算します。','中身と0の比較ができました。次は、この結果から符号を読み取ります。')],['n08-05'],13,'relation-sequence','T04'),
 group(g7,'n08-stage-07',[c,d,e],[row(g7,c,'S0',[],[],'','',false),row(g7,c,'S1',[],['expression'],'選んだ負の場合の規則を使い、式全体に負号を付けます。'),row(g7,d,'S2',[c],[],'負号は−1を掛けることです。括弧の二つの項へ、それぞれ分配します。','',false),row(g7,d,'S3',[c],['expression'],'二つの積を計算して、括弧を外した式を入れます。'),row(g7,e,'S4',[c,d],['expression'],'加法の交換法則で、各項の符号を保ったまま正の項を先に書きます。','中身の符号を判定し、定義に当てはめてから計算できました。')],['n08-q07-rule'],17,'expression-chain','T02'),
 group(g8,'n08-stage-08',[f,h,i],[row(g8,f,'S0',[],['operator'],'与えられた小数表示から、円周率と3の大小を比べます。'),row(g8,h,'S1',[f],['left.args.1.args.1','right.args.1.args.1'],'左辺に今回の中身を作ります。前の例と同じように、両辺から同じ数を引きます。','同じ数を引く操作では、不等号の向きは変わりません。'),row(g8,i,'S2',[f,h],['operator'],'右辺を0に整理しました。保たれる大小関係を入れます。','中身と0を比べられました。元の小数表示も根拠として残します。')],[],20,'relation-sequence','T04'),
 group(g9,'n08-stage-09',[j,k,l],[row(g9,j,'S0',[],[],'','',false),row(g9,j,'S1',[],['expression'],'前の例と同じ順序で、負の場合の規則を式全体に使います。'),row(g9,k,'S2',[j],[],'括弧全体に掛かる−1を、二つの項へ分配します。','',false),row(g9,k,'S3',[j],['expression'],'それぞれの積を計算し、二項の符号を確かめます。'),row(g9,l,'S4',[j,k],['expression'],'加法の交換法則で、各項の符号を保って正の項を先に書きます。','二つの例とも、大小→差の符号→場合の選択→括弧全体の反転という順序で処理しました。')],['n08-08'],23,'expression-chain','T02'),
 ];
 for(const g of groups)if(g.kind==='expression-chain')g.rows.find(r=>r.stateRef==='S2').displayForm='explicit-products';
 for(const g of groups)for(const r of g.rows)for(const key of ['before','after'])r[key]=r[key].flatMap(p=>p.text.split(/(−1|0|3)/).filter(Boolean).map(s=>/^(?:−1|0|3)$/.test(s)?{type:'math',latex:s.replace('−','-')}:{type:'text',text:s}));
 const proseOverrides=[['n08-06','中身は負です。この判断で、負の場合の規則が使えます。'],['n08-08','中身が負だと分かりました。この判断を使って絶対値を外します。']].map(([nodeId,s])=>({nodeId,sourceRefs:sem.get(nodeId).after.map(b=>b.id),visibleAfterNodeId:nodeId,after:text(s)}));
 return {schemaVersion:'transformation-plan/1',unitId:ir.unit.unitId,presentationVersion:1,baseIRHash:hash(ir),gradingHash:hash(contracts),scope:{problemId:'n08-numeric-absolute-examples',nodeIds:scopeNodes,stageIds:groups.flatMap(g=>g.stageIds),assumptionRefs:['real-arithmetic']},graphs,groups,candidates,coverage,numberAliases,proseOverrides};
}
