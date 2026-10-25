/** Authored implementation fixtures, not accepted or published textbook units. */
import {rat as r,sym,add,mul,pow,div,relation,expr,realLine} from '../solution/expression.mjs';
import {hash} from '../util.mjs';
const x=sym('x');
const text=(id,text)=>({type:'text',id,text});
function make({id,title,states,edges,prompts,expecteds,targets,values,domainText=[]}){
 const sourceId=id+'-source';const initialFacts=['arithmetic','order-addition','positive-division','square-nonnegative'];
 const graph={schemaVersion:'solution-graph/1',id:id+'-graph',variable:'x',parameters:[],initialFacts,
  givens:[{id:id+'-given',statement:states[0]}],rootStateId:id+'-s0',goalStateIds:[id+'-s'+(states.length-1)],
  states:states.map((statement,i)=>({id:id+'-s'+i,statement,activeVariable:'x',fixedParameters:[],facts:i?[id+'-fact'+i]:[]})),
  transitions:edges.map((operation,i)=>({id:id+'-e'+i,from:id+'-s'+i,to:id+'-s'+(i+1),requires:i?[id+'-fact'+i]:[],produces:[id+'-fact'+(i+1)],basisRefs:['arithmetic'],...operation})),
 };
 const steps=edges.map((_,i)=>{
  const sid=id+'-step'+i,qid=id+'-answer'+i,expected=expecteds[i],label=String.fromCharCode(65+i);
  const interaction=expected?{id:qid,learningAction:'calculation',learnerDecision:prompts[i][0],availableFacts:initialFacts,withheldKnowledge:'次の式を成立させる値',nextUse:prompts[i][2],
   expected,choices:values[i].map((value,j)=>({id:qid+'-c'+j,value,feedback:[text(qid+'-feedback'+j,hash(value)===hash(expected)?prompts[i][1]:'操作する対象と、直前の式を確かめよう。')],...(hash(value)===hash(expected)?{}:{misconception:'対象の符号または計算の取り違え'})})),
   hints:[[text(qid+'-hint0','今の目的と、直前の式をもう一度確かめよう。')]],supportPolicy:{level:'strong',nextProblemAction:'類題では操作から自分で組み立てる'},
  }:undefined;
  return {id:sid,transitionId:id+'-e'+i,sourceRefs:[sourceId],purpose:[text(sid+'-purpose',prompts[i][0])],reason:[text(sid+'-reason',prompts[i][1])],afterText:[text(sid+'-after',prompts[i][2])],promptParts:[],detail:[],numberId:sid+'-equation',slotTargets:expected?targets[i].map((path,j)=>({id:sid+'-slot'+j,interactionId:qid,label,path})):[],...(interaction?{interaction}:{noBlankReason:'この段階は新しい形と根拠を説明する完成例として提示する'})};
 });
 return {schemaVersion:'production-ir/2',unitId:id,sourceHash:hash({id,states}),sourceBlocks:[{id:sourceId,kind:'authored-fixture'}],coverage:[{sourceId,stepIds:steps.map(s=>s.id),disposition:'taught',reason:'全変形を実装試験で追跡する'}],
  problems:[{id:id+'-problem',title,prompt:[text(id+'-prompt','次の問題を、一つの式の流れとして解こう。')],conditions:domainText,goal:title,layout:'calculation',graph,steps}]};
}
export function linearExample(){
 const left=add(mul(r(3),x),r(-4));
 return make({id:'fixture-linear',title:'一次不等式を解く',
  states:[relation(left,'<=',r(2)),relation(add(left,r(4)),'<=',add(r(2),r(4))),relation(mul(r(3),x),'<=',r(6)),relation(div(mul(r(3),x),r(3)),'<=',div(r(6),r(3))),relation(x,'<=',r(2))],
  edges:[{ruleId:'add-both-sides',operand:r(4)},{ruleId:'rewrite'},{ruleId:'divide-both-sides',operand:r(3)},{ruleId:'rewrite'}],
  expecteds:[r(4),r(6),r(3),r(2)],targets:[['left.args.1','right.args.1'],['right'],['left.denominator','right.denominator'],['right']],
  values:[[r(4),r(-4),r(2)],[r(6),r(-2),r(8)],[r(3),r(-3),r(6)],[r(2),r(3),r(6)]],
  prompts:[['左辺の定数項をなくすため、両辺に同じ数を足す。','同じ数を足しても不等号の向きは変わらない。','定数項をなくしたので、両辺を計算して整理する。'],['両辺の計算をまとめ、文字の項だけを左辺に残す。','左辺では定数項どうしが打ち消し合う。','次に文字の係数を一にする。'],['文字の係数を一にするため、両辺を同じ正の数で割る。','正の数で割るので不等号の向きは変わらない。','商を計算すれば、解の範囲が得られる。'],['商を計算し、元の問題の解を表す。','文字の係数が一になった。','最初の不等式から最後までの解法を読み直そう。']]});
}
export function squareExample(){
 return make({id:'fixture-square',title:'平方完成する',states:[expr(add(pow(x,2),mul(r(6),x),r(5))),expr(add(pow(x,2),mul(r(6),x),r(9),mul(r(-1),r(9)),r(5))),expr(add(pow(add(x,r(3)),2),r(-9),r(5))),expr(add(pow(add(x,r(3)),2),r(-4)))],
  edges:[{ruleId:'rewrite'},{ruleId:'rewrite'},{ruleId:'rewrite'}],expecteds:[r(9),null,r(-4)],targets:[['expression.args.2','expression.args.3.args.1'],[],['expression.args.1']],values:[[r(9),r(3),r(6)],[],[r(-4),r(4),r(-14)]],
  prompts:[['二乗の形を作るため、必要な定数を足し、同じ定数を引く。','同じ数を足して引くので、式の値は変わらない。','平方の公式で、最初の三つの項をまとめる。'],['平方の公式を使って、二乗の形にまとめる。','一次の項の係数から、括弧の中の定数が決まる。','残った定数項を計算する。'],['定数項をまとめ、平方完成した式を得る。','二乗の部分はそのままにして定数項を整理する。','この形から軸と頂点を読み取れる。']]});
}
export function extremaExample(){
 const f=add(pow(x,2),mul(r(-6),x),r(10)),square=add(pow(add(x,r(-3)),2),r(1));
 const domain={lower:r(0),upper:r(2),lowerOpen:false,upperOpen:false};
 const ir=make({id:'fixture-extrema',title:'定義域の中で最小値を求める',states:[expr(f),expr(square),{kind:'extrema',function:f,variable:'x',domain,extremum:'minimum',value:r(2),at:[r(2)],attained:true}],
  edges:[{ruleId:'rewrite'},{ruleId:'extrema'}],expecteds:[null,r(2)],targets:[[],['value']],values:[[],[r(2),r(1),r(10)]],
  domainText:[text('fixture-extrema-domain-intro','定義域は次の二つの条件を満たす範囲とする。'),{type:'math',id:'fixture-extrema-domain-left',statement:relation(r(0),'<=',x)},{type:'math',id:'fixture-extrema-domain-right',statement:relation(x,'<=',r(2))}],
  prompts:[['平方完成して軸と頂点の位置を読み取れる形にする。','二乗の値が零になる位置が軸である。','頂点が定義域の中にあるかを確かめる。'],['頂点は範囲外なので、定義域の中で値が最も小さくなる位置を調べる。','この範囲では軸へ近づくほど値が小さくなる。右端での値を計算する。','定義域の条件と、最小値を取る位置を合わせて結論を読む。']]});
 ir.problems[0].plot={id:'fixture-extrema-plot',sourceStateId:'fixture-extrema-s0',visibleAfterStateId:'fixture-extrema-s2',domain,alt:'元の二次関数と定義域。太線が定義域の範囲、点線が軸を表す。'};
 return ir;
}
export function supportVariant(input,level){
 const ir=structuredClone(input);
 for(const p of ir.problems)for(const [i,s] of p.steps.entries()){
  if(s.interaction)s.interaction.supportPolicy.level=level;
  if(level==='light'&&i<p.steps.length-1){delete s.interaction;s.slotTargets=[];s.noBlankReason='低支援版の前半は完成例として提示し、結論の導出を本人へ任せる';}
 }
 return ir;
}
