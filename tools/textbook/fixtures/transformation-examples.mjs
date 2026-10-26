import {linearGraph} from '../transformation/n11.mjs';
import {rat as r,sym,add,mul,div,pow,relation,expr,expressionLatex} from '../solution/expression.mjs';
import {hash} from '../util.mjs';
import {gradingContract} from '../transformation/validate.mjs';
import {squareExample} from './solution-examples.mjs';
const x=sym('x');
export function graphOf(id,statements,operations){return {schemaVersion:'solution-graph/1',id,variable:'x',parameters:[],initialFacts:['x-real'],givens:[{id:id+'-given',statement:statements[0]}],rootStateId:'S0',goalStateIds:['S'+(statements.length-1)],states:statements.map((statement,i)=>({id:'S'+i,statement,activeVariable:'x',fixedParameters:[],facts:['x-real']})),transitions:operations.map((o,i)=>({id:'a'+i,from:'S'+i,to:'S'+(i+1),requires:['x-real'],produces:[],basisRefs:['x-real'],...o}))};}
export function fixtureForGraph(graph,patternId='T03'){
 const id=graph.id,ir={schemaVersion:'authored-transformation-fixture/1',solutionGraphs:[structuredClone(graph)],unit:{unitId:id,revision:1,sections:[{items:[]}]},semantic:{nodes:graph.states.map((s,i)=>({id:'node'+i,before:[{id:'block'+i,type:'formula'}],after:[]}))}};
 const rows=graph.states.map((s,i)=>({id:'row'+i,graphRef:graph.id,stateRef:s.id,sourceNodeId:'node'+i,sourceRefs:['block'+i],role:'main',visibleAfter:[],interactionRef:null,slots:[],before:[],after:[],afterVisible:true,continuation:i>0&&s.statement.kind==='expression'}));
 const plan={schemaVersion:'transformation-plan/1',unitId:id,presentationVersion:1,baseIRHash:hash(ir),gradingHash:hash(gradingContract(ir)),scope:{problemId:id+'-problem',nodeIds:rows.map(r=>r.sourceNodeId),stageIds:['stage1'],assumptionRefs:['x-real']},graphs:[graph],groups:[{id:id+'-group',kind:graph.states[0].statement.kind==='expression'?'expression-chain':'relation-sequence',patternId,graphRef:id,stageIds:['stage1'],sourceNodeIds:rows.map(r=>r.sourceNodeId),stepRefs:graph.transitions.map(t=>t.id),number:1,numberId:id+'-number',boundaryReason:'Self-authored fixture in one scope',conclusion:{kind:'terminal-in-flow',stateRef:graph.goalStateIds[0]},rows}],candidates:[],coverage:rows.map(r=>({sourceRef:r.sourceRefs[0],disposition:'main-row',rowRef:r.id,reason:'Explicit fixture state mapping'})),numberAliases:{}};
 return {ir,plan};
}
export function twoDecisionExample(){
 const graph=linearGraph({id:'fixture-transform-linear'});
 graph.states[1].statement.left=add(mul(r(3),x),r(2),mul(r(-1),r(2)));
 graph.states[1].statement.right=add(r(5),mul(r(-1),r(2)));
 const out=fixtureForGraph(graph,'T04'),{ir,plan}=out,rows=plan.groups[0].rows;
 const specs=[{id:'A',i:1,paths:['left.args.2.args.1','right.args.1.args.1'],expected:'2',targetLatex:'2',choices:['2','-2','3'],decision:'引く数を決める',op:'subtract'},{id:'C',i:3,paths:['left.denominator','right.denominator'],expected:'3',targetLatex:'3',choices:['3','-3','0'],decision:'正の除数を決める',op:'positive-divide'}];
 for(const [j,s]of specs.entries()){
  ir.unit.sections[0].items.push({id:s.id,answer:s.expected,acceptedAnswers:[],choices:s.choices});
  plan.candidates.push({id:s.id,nodeId:rows[s.i].sourceNodeId,blankRole:'operand',learnerDecision:s.decision,availableFactRefs:['x-real'],prerequisiteInteractionIds:j?['A']:[],nextUseRef:j?'terminal':'C',taskContract:{kind:'select-number',requestedOperation:s.op},decision:'ADOPT',reason:'First variant asks for the operation operands; intervening arithmetic is demonstrated.',expected:s.expected,targetLatex:s.targetLatex,choices:s.choices});
  rows[s.i].interactionRef=s.id;rows[s.i].slots=s.paths.map((path,i)=>({id:s.id+'-'+i,interactionRef:s.id,path}));
 }
 for(let i=2;i<rows.length;i++)rows[i].visibleAfter=i<4?['A']:['A','C'];
 for(const [id,i]of [['B',2],['D',4]])plan.candidates.push({id,nodeId:rows[i].sourceNodeId,blankRole:'calculation',learnerDecision:'演算の値を求める',availableFactRefs:['x-real'],prerequisiteInteractionIds:i===2?['A']:['A','C'],nextUseRef:i===2?'C':'terminal',taskContract:{kind:'select-number',requestedOperation:'calculate'},decision:'REJECT',reason:'Initial variant demonstrates this calculation; other variants can adopt it.',expected:i===2?'3':'1',targetLatex:i===2?'3':'1',choices:i===2?['3','2']:['1','3']});
 plan.baseIRHash=hash(ir);plan.gradingHash=hash(gradingContract(ir));return out;
}
const distribute=()=>graphOf('fixture-distribute',[relation(mul(r(3),add(mul(r(2),x),r(3))),'>=',add(mul(r(10),x),r(-17))),relation(add(mul(r(6),x),r(9)),'>=',add(mul(r(10),x),r(-17))),relation(add(mul(r(-4),x),r(9)),'>=',r(-17)),relation(mul(r(-4),x),'>=',r(-26)),relation(x,'<=',r(13,2))],[{ruleId:'rewrite'},{ruleId:'add-both-sides',operand:mul(r(-10),x)},{ruleId:'add-both-sides',operand:r(-9)},{ruleId:'divide-both-sides',operand:r(-4)}]);
const denominator=()=>graphOf('fixture-denominator',[relation(div(add(x,r(-2)),r(3)),'<=',add(mul(r(2),x),r(1))),relation(add(x,r(-2)),'<=',mul(r(3),add(mul(r(2),x),r(1)))),relation(add(x,r(-2)),'<=',add(mul(r(6),x),r(3)))],[{ruleId:'multiply-both-sides',operand:r(3)},{ruleId:'rewrite'}]);
function independentComparison(){
 const a=fixtureForGraph(graphOf('independent-left',[expr(pow(r(2),2)),expr(r(4))],[{ruleId:'rewrite'}]),'T01');
 const b=fixtureForGraph(graphOf('independent-right',[expr(pow(r(3),2)),expr(r(9))],[{ruleId:'rewrite'}]),'T01');
 for(const n of b.ir.semantic.nodes){n.id+='-right';for(const q of n.before)q.id+='-right';}
 for(const row of b.plan.groups[0].rows){row.id+='-right';row.sourceNodeId+='-right';row.sourceRefs=row.sourceRefs.map(id=>id+'-right');row.continuation=false;}
 for(const row of a.plan.groups[0].rows)row.continuation=false;
 a.ir.semantic.nodes.push(...b.ir.semantic.nodes);a.plan.graphs.push(...b.plan.graphs);a.ir.solutionGraphs.push(...b.ir.solutionGraphs);
 a.plan.scope.nodeIds.push(...b.ir.semantic.nodes.map(n=>n.id));
 const group=a.plan.groups[0];group.kind='independent-comparison';group.rows.push(...b.plan.groups[0].rows);group.sourceNodeIds=a.plan.scope.nodeIds;group.conclusion.kind='interpretation';
 a.plan.coverage=group.rows.map(r=>({sourceRef:r.sourceRefs[0],disposition:'main-row',rowRef:r.id,reason:'Independent left and right squares; no equality between the two.'}));
 a.plan.baseIRHash=hash(a.ir);return a;
}
export const transformationFixtureMatrix=()=>[
 {id:'F01',...twoDecisionExample(),expected:'PASS'},
 {id:'F02',...fixtureForGraph(linearGraph({id:'fixture-negative',constant:3,right:5,coefficient:-2}),'T05'),expected:'PASS'},
 {id:'F03',...fixtureForGraph(distribute(),'T02'),expected:'PASS'},
 {id:'F04',...fixtureForGraph(denominator(),'T06'),expected:'PASS'},
 {id:'F05',...fixtureForGraph({...squareExample().problems[0].graph,initialFacts:['x-real'],states:squareExample().problems[0].graph.states.map(s=>({...s,facts:['x-real']})),transitions:squareExample().problems[0].graph.transitions.map(t=>({...t,requires:['x-real'],produces:[],basisRefs:['x-real']}))},'T11'),expected:'PASS'},
 ...[['F06','T07'],['F07','T09'],['F09','T13'],['F12','T10']].map(([id,pattern])=>({id,...fixtureForGraph(linearGraph({id:'excluded-'+id}),pattern),expected:'FAIL',reason:'Initial automatic grouping excludes the condition/concept/unsupported boundary.'})),
 {id:'F08',...independentComparison(),expected:'PASS'},
 {id:'F10',...fixtureForGraph(graphOf('fixture-long',[expr(add(pow(add(x,r(123)),2),r(456))),expr(add(pow(x,2),mul(r(246),x),r(15585)))],[{ruleId:'rewrite'}]),'T01'),expected:'PASS'},
 {id:'F11',...fixtureForGraph(graphOf('fixture-task-form',[expr(add(pow(x,2),mul(r(6),x),r(5))),expr(add(pow(add(x,r(3)),2),r(-4)))],[{ruleId:'rewrite',requiredForm:'completed-square'}]),'T11'),expected:'PASS'},
];
