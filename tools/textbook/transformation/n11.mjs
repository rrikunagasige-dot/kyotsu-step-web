/** Explicit legacy-v1 adapter. Original authored source and grading IDs stay intact. */
import {hash} from '../util.mjs';
import {rat,sym,add,mul,div,relation,expressionLatex} from '../solution/expression.mjs';
import {gradingContract} from './validate.mjs';
const text=s=>[{type:'text',text:s}];
const fact='x-real',x=sym('x'),three=mul(rat(3),x);
export function linearGraph({id='linear',constant=2,right=5,operator='<=',coefficient=3}={}){
 const left=mul(rat(coefficient),x),remaining=right-constant;
 const statements=[relation(add(left,rat(constant)),operator,rat(right)),relation(add(left,rat(constant),rat(-constant)),operator,add(rat(right),rat(-constant))),relation(left,operator,rat(remaining)),relation(div(left,rat(coefficient)),coefficient<0?({'<':'>','<=':'>=','>':'<','>=':'<='}[operator]??operator):operator,div(rat(remaining),rat(coefficient))),relation(x,coefficient<0?({'<':'>','<=':'>=','>':'<','>=':'<='}[operator]??operator):operator,rat(remaining*(coefficient<0?-1:1),Math.abs(coefficient)))];
 return {schemaVersion:'solution-graph/1',id,variable:'x',parameters:[],initialFacts:[fact],givens:[{id:id+'-given',statement:statements[0]}],rootStateId:'S0',goalStateIds:['S4'],states:statements.map((statement,i)=>({id:'S'+i,statement,activeVariable:'x',fixedParameters:[],facts:[fact]})),transitions:[['add-both-sides',rat(-constant)],['rewrite'],['divide-both-sides',rat(coefficient)],['rewrite']].map(([ruleId,operand],i)=>({id:'a0'+(i+1),from:'S'+i,to:'S'+(i+1),ruleId,...(operand?{operand}:{}),requires:[fact],produces:[],basisRefs:[fact]}))};
}
export function n11TransformationPlan(ir){
 const graph=linearGraph({id:'n11-linear',constant:-2,right:5,operator:'<'});
 const op='n11-wm017-q05-operation',balance='n11-wm017-q05-balance',sum='n11-05',divisor='n11-q06-operation',end='n11-06',intro='n11-solve-problem';
 const nodes=[intro,op,balance,sum,divisor,end],contracts=gradingContract(ir),byId=new Map(contracts.map(c=>[c.id,c]));
 const auxiliary=(id,statement)=>({schemaVersion:'solution-graph/1',id,variable:'x',parameters:[],initialFacts:[fact],givens:[{id:id+'-given',statement}],rootStateId:'A0',goalStateIds:['A1'],states:[{id:'A0',statement,activeVariable:'x',fixedParameters:[],facts:[fact]},{id:'A1',statement:relation(rat(id==='cancel'?0:1),'=',rat(id==='cancel'?0:1)),activeVariable:'x',fixedParameters:[],facts:[fact]}],transitions:[{id:id+'-check',from:'A0',to:'A1',ruleId:'rewrite',requires:[fact],produces:[],basisRefs:[fact]}]});
 const helpers=[auxiliary('cancel',relation(add(rat(-2),rat(2)),'=',rat(0))),auxiliary('coefficient',relation(div(rat(3),rat(3)),'=',rat(1)))];
 const row=(id,node,state,gate,interaction,slots,before,after,role='main',graphRef=graph.id)=>({id,graphRef,stateRef:state,sourceNodeId:node,sourceRefs:ir.semantic.nodes.find(n=>n.id===node).before.concat(ir.semantic.nodes.find(n=>n.id===node).after).map(b=>b.id),role,visibleAfter:gate,interactionRef:interaction,slots:slots.map(([suffix,path])=>({id:id+'-'+suffix,interactionRef:interaction,path})),before:text(before),after:text(after),afterVisible:true,continuation:false});
 const rows=[
 row('n11-tg-initial',intro,'S0',[],null,[],'不等式を変形して、条件を満たすすべての実数の範囲を求めます。まず、左辺の定数項をなくします。',''),
 row('n11-tg-cancel',op,'A0',[],op,[['operand','left.args.1']],'左辺の定数部分を0にする数を、次の式で確かめます。','左辺で定数を打ち消す数が決まりました。同じ数を右辺にも加えます。','auxiliary','cancel'),
 row('n11-tg-add',balance,'S1',[op],balance,[['right','right.args.1']],'両辺に同じ数を加えると、大小関係は保たれます。右辺にも同じ操作を入れます。','左辺の定数部分が0になりました。右辺の和を計算します。'),
 row('n11-tg-sum',sum,'S2',[op,balance],sum,[['sum','right']],'左右を整理して、不等式を次の行へ進めます。','次は、左辺の係数を1にします。'),
 row('n11-tg-divisor',divisor,'A0',[op,balance,sum],divisor,[['divisor','left.denominator']],'係数を1にするために割る数を、次の式で確かめます。','決めた数は正なので、両辺をその数で割っても不等号の向きは変わりません。','auxiliary','coefficient'),
 row('n11-tg-divide',divisor,'S3',[op,balance,sum,divisor],null,[],'両辺へ同じ除算を行います。',''),
 row('n11-tg-final',end,'S4',[op,balance,sum,divisor],end,[['quotient','right']],'右辺の商を入れて、範囲を表します。','この不等式で表される実数全体が解です。次に、境界が含まれるかを元の式で確かめます。'),
 ];
 // All inline numbers/variables in prose must be typed math, not plain-font imitations.
 for(const r of rows)for(const key of ['before','after'])r[key]=r[key].flatMap(p=>p.text.split(/([0-9]+|x)/).filter(Boolean).map(s=>/^(?:[0-9]+|x)$/.test(s)?{type:'math',latex:s}:{type:'text',text:s}));
 const candidates=[op,balance,sum,divisor,end].map((id,i)=>{const c=byId.get(id),r=rows.find(r=>r.interactionRef===id),g=[graph,...helpers].find(g=>g.id===r.graphRef),s=g.states.find(s=>s.id===r.stateRef).statement;const path=r.slots[0].path.split('.');let target=s;for(const key of path)target=target[key];return {id,nodeId:id,blankRole:[op,balance,divisor].includes(id)?'operand':'calculation',learnerDecision:r.before.map(p=>p.text??p.latex).join(''),availableFactRefs:[fact],prerequisiteInteractionIds:[op,balance,sum,divisor,end].slice(0,i),nextUseRef:i<4?[op,balance,sum,divisor,end][i+1]:'n11-q07-substitution',taskContract:{kind:'select-number',requestedOperation:[op,balance].includes(id)?'add':id===divisor?'positive-divide':'calculate'},decision:'ADOPT',reason:'既存採点契約を保ち、操作と計算を区別する。',expected:c.answer,targetLatex:expressionLatex(target),choices:[...new Set([c.answer,...c.choices])]};});
 const coverage=nodes.flatMap(node=>{const r=rows.find(r=>r.sourceNodeId===node);return r.sourceRefs.map(sourceRef=>({sourceRef,disposition:r.role==='auxiliary'?'auxiliary':'superseded-display',rowRef:r.id,reason:'元の式と説明を保存し、承認された式列・補助計算・配置文へ対応付ける。'}));});
 return {schemaVersion:'transformation-plan/1',unitId:ir.unit.unitId,presentationVersion:1,baseIRHash:hash(ir),gradingHash:hash(contracts),scope:{problemId:'n11-q05-q06',nodeIds:nodes,stageIds:['n11-stage-05','n11-stage-06'],assumptionRefs:[fact]},graphs:[graph,...helpers],groups:[{id:'n11-linear-solution',kind:'relation-sequence',patternId:'T04',graphRef:graph.id,stageIds:['n11-stage-05','n11-stage-06'],sourceNodeIds:nodes,stepRefs:graph.transitions.map(t=>t.id),number:ir.equationNumbers['n11-06-equation'],numberId:'n11-linear-solution-number',boundaryReason:'同じ原問・実数条件のもと、定数をなくして係数を1にする一続きの解答。',conclusion:{kind:'terminal-in-flow',stateRef:'S4'},rows}],candidates,coverage,numberAliases:Object.fromEntries(nodes.flatMap(node=>ir.semantic.nodes.find(n=>n.id===node).before.concat(ir.semantic.nodes.find(n=>n.id===node).after).filter(b=>b.type==='formula').map(b=>[b.id,rows.find(r=>r.sourceNodeId===node).id])))};
}
