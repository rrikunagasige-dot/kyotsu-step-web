import {validateTransformationPlan} from './validate.mjs';
import {expressionLatex} from '../solution/expression.mjs';
import {hash} from '../util.mjs';
const relations={'<=':'\\le','>=':'\\ge','=':'=','<':'<','>':'>'};
function parts(expression,slots,side){
 const own=slots.find(s=>s.path===side);if(own)return [{type:'slot',id:own.id,interactionRef:own.interactionRef}];
 const nested=slots.filter(s=>s.path.startsWith(side+'.'));
 if(!nested.length)return [{type:'math',latex:expressionLatex(expression)}];
 const child=(e,path)=>parts(e,slots,side+'.'+path);
 const math=latex=>({type:'math',latex});
 if(expression.kind==='divide')return [{type:'fraction',numerator:child(expression.numerator,'numerator'),denominator:child(expression.denominator,'denominator')}];
 if(expression.kind==='add')return expression.args.flatMap((e,i)=>[...(i&&!(e.kind==='rational'&&e.n.startsWith('-'))?[math('+')]:[]),...child(e,'args.'+i)]);
 if(expression.kind==='multiply'&&expression.args.length===2&&expression.args[0].kind==='rational'&&expression.args[0].n==='-1'&&expression.args[0].d==='1')return [math('-'),...child(expression.args[1],'args.1')];
 if(expression.kind==='multiply')return expression.args.flatMap((e,i)=>[...(i?[math('\\cdot')]:[]),...(e.kind==='add'?[math('('),...child(e,'args.'+i),math(')')]:child(e,'args.'+i))]);
 throw Error('MASK_STRUCTURE_UNSUPPORTED '+expression.kind);
}
function statementParts(statement,slots=[]){
 if(statement.kind==='expression')return {left:[],relation:'',right:parts(statement.expression,slots,'expression')};
 const relationSlot=slots.find(s=>s.path==='operator');
 return {left:parts(statement.left,slots,'left'),relation:relations[statement.operator],relationSlot:relationSlot?{type:'slot',id:relationSlot.id,interactionRef:relationSlot.interactionRef}:undefined,right:parts(statement.right,slots,'right')};
}
export function compileTransformationPresentation(ir,plan){
 const checked=validateTransformationPlan(ir,plan);if(checked.status!=='PASS')return checked;
 const graphs=new Map(plan.graphs.map(g=>[g.id,g]));
 let compiled;try{compiled={schemaVersion:'transformation-reading/1',unitId:plan.unitId,presentationVersion:plan.presentationVersion,baseIRHash:checked.baseIRHash,irHash:checked.baseIRHash,planHash:checked.planHash,learnerCopyHash:checked.learnerCopyHash,gradingHash:plan.gradingHash,scope:plan.scope,numberAliases:plan.numberAliases,
 groups:plan.groups.map(g=>({...g,rows:g.rows.map(r=>{const s=graphs.get(r.graphRef).states.find(s=>s.id===r.stateRef).statement;const completed=statementParts(s),masked=statementParts(s,r.slots);if(g.kind==='expression-chain'&&r.continuation){completed.relation='=';masked.relation='=';}return {...r,completed,masked};})})),
 interactions:plan.candidates.filter(c=>c.decision==='ADOPT').map(c=>({id:c.id,nodeId:c.nodeId,blankRole:c.blankRole,learnerDecision:c.learnerDecision,prerequisiteInteractionIds:c.prerequisiteInteractionIds,choices:c.choices,correctValue:c.expected})),automaticAcceptance:false};}catch(error){return {status:'UNSUPPORTED',findings:[{ruleId:'TG06_BINDING',detail:error.message}]};}
 return {status:'PASS',compiled:{...compiled,compiledPresentationHash:hash(compiled)},mathReceipts:checked.mathReceipts,meaningAuditRequired:true};
}
