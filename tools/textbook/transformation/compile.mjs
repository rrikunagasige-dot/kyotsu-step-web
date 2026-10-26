import {compileTransformationV3} from './v3.mjs';
import {validateTransformationPlan} from './validate.mjs';
import {expressionLatex} from '../solution/expression.mjs';
import {hash} from '../util.mjs';
import {compileTransformationV2} from './v2.mjs';
const relations={'<=':'\\le','>=':'\\ge','=':'=','<':'<','>':'>'};
function parts(expression,slots,side){
 const own=slots.find(s=>s.path===side);if(own)return [{type:'slot',id:own.id,interactionRef:own.interactionRef}];
 const nested=slots.filter(s=>s.path.startsWith(side+'.'));
 if(!nested.length)return [{type:'math',latex:expressionLatex(expression)}];
 const child=(e,path)=>parts(e,slots,side+'.'+path);
 const math=latex=>({type:'math',latex});
 const negative=e=>e.kind==='rational'&&e.n.startsWith('-')||e.kind==='multiply'&&e.args[0]?.kind==='rational'&&e.args[0].n==='-1';
 if(expression.kind==='divide')return [{type:'fraction',numerator:child(expression.numerator,'numerator'),denominator:child(expression.denominator,'denominator')}];
 if(expression.kind==='add')return expression.args.flatMap((e,i)=>[...(i&&!negative(e)?[math('+')]:[]),...child(e,'args.'+i)]);
 if(expression.kind==='multiply'&&expression.args.length===2&&expression.args[0].kind==='rational'&&expression.args[0].n==='-1'&&expression.args[0].d==='1')return [math('-'),...child(expression.args[1],'args.1')];
 if(expression.kind==='multiply')return expression.args.flatMap((e,i)=>[...(i?[math('\\cdot')]:[]),...(e.kind==='add'?[math('('),...child(e,'args.'+i),math(')')]:child(e,'args.'+i))]);
 throw Error('MASK_STRUCTURE_UNSUPPORTED '+expression.kind);
}
function explicitProducts(e){
 if(e.kind==='add')return e.args.map(explicitProducts).join('+').replace(/\+-/g,'-');
 if(e.kind==='multiply')return e.args.map(a=>{const latex=expressionLatex(a);return a.kind==='rational'&&a.n.startsWith('-')||a.kind==='add'||latex.startsWith('-')?'('+latex+')':latex;}).join('');
 return expressionLatex(e);
}
function statementParts(statement,slots=[],displayForm){
 if(displayForm==='explicit-products'&&statement.kind==='expression'&&!slots.length)return {left:[],relation:'',right:[{type:'math',latex:explicitProducts(statement.expression)}]};
 if(statement.kind==='expression')return {left:[],relation:'',right:parts(statement.expression,slots,'expression')};
 const relationSlot=slots.find(s=>s.path==='operator');
 return {left:parts(statement.left,slots,'left'),relation:relations[statement.operator],relationSlot:relationSlot?{type:'slot',id:relationSlot.id,interactionRef:relationSlot.interactionRef}:undefined,right:parts(statement.right,slots,'right')};
}
export function compileTransformationPresentation(ir,plan){
 if(plan?.schemaVersion==='transformation-plan/3')return compileTransformationV3(ir,plan);
 if(plan?.schemaVersion==='transformation-plan/2')return compileTransformationV2(ir,plan,validateTransformationPlan(ir,plan),compileTransformationPresentation);
 const checked=validateTransformationPlan(ir,plan);if(checked.status!=='PASS')return checked;
 const graphs=new Map(plan.graphs.map(g=>[g.id,g]));
 let compiled;try{compiled={schemaVersion:'transformation-reading/1',unitId:plan.unitId,presentationVersion:plan.presentationVersion,baseIRHash:checked.baseIRHash,irHash:checked.baseIRHash,planHash:checked.planHash,learnerCopyHash:checked.learnerCopyHash,gradingHash:plan.gradingHash,scope:plan.scope,numberAliases:plan.numberAliases,...(plan.proseOverrides?{proseOverrides:plan.proseOverrides}:{}),
 groups:plan.groups.map(g=>({...g,rows:g.rows.map(r=>{const s=graphs.get(r.graphRef).states.find(s=>s.id===r.stateRef).statement;const completed=statementParts(s,[],r.displayForm),masked=statementParts(s,r.slots,r.displayForm);if(g.kind==='expression-chain'&&r.continuation){completed.relation='=';masked.relation='=';}return {...r,completed,masked};})})),
 interactions:plan.candidates.filter(c=>c.decision==='ADOPT').map(c=>({id:c.id,nodeId:c.nodeId,blankRole:c.blankRole,learnerDecision:c.learnerDecision,prerequisiteInteractionIds:c.prerequisiteInteractionIds,choices:c.choices,correctValue:c.expected})),automaticAcceptance:false};}catch(error){return {status:'UNSUPPORTED',findings:[{ruleId:'TG06_BINDING',detail:error.message}]};}
 return {status:'PASS',compiled:{...compiled,compiledPresentationHash:hash(compiled)},mathReceipts:checked.mathReceipts,meaningAuditRequired:true};
}
