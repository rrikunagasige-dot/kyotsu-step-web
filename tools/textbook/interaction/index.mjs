import { invariant } from '../util.mjs';
import { answerCheck } from '../rules/n07.mjs';
export function resolveTarget(node,path){
 const parts=path.split('.');invariant(parts.every(p=>/^(?:[a-zA-Z][a-zA-Z0-9_]*|\d+)$/.test(p)&&!['constructor','prototype','__proto__'].includes(p)),'unsafe target');
 let value=node;for(const p of parts){invariant(value!=null&&Object.hasOwn(value,p),'unknown target '+path);value=value[p];}return value;
}
export function blankCandidates(node){return [
 ...node.operation.targets.map((v,i)=>({targetPath:`operation.targets.${i}`,learningAction:'selection',value:v})),
 ...(node.operation.direction?[{targetPath:'operation.direction',learningAction:'judgment',value:node.operation.direction}]:[]),
 ...node.produces.map((v,i)=>({targetPath:`produces.${i}`,learningAction:'relation',value:v})),
 {targetPath:'operation.kind',learningAction:'judgment',value:node.operation.kind},
 ].map(x=>({...x,decision:'NEEDS_AI_SELECTION',whyHere:null}));}
export function validateChoices(choices,answer,{form='text'}={}){
 const errors=[];const equivalent=(a,b)=>a===b||(form!=='text'&&answerCheck(a,b).equivalent);
 if(choices.filter(c=>equivalent(c.content,answer)).length!==1)errors.push('ANSWER_COUNT');
 for(let i=0;i<choices.length;i++){if(!choices[i].feedback||(!equivalent(choices[i].content,answer)&&!choices[i].misconception))errors.push('DISTRACTOR_BASIS');for(let j=0;j<i;j++)if(equivalent(choices[i].content,choices[j].content))errors.push('EQUIVALENT_CHOICES');}
 return {status:errors.length?'FAIL':'PASS',errors};
}
export function adaptHints(hints){invariant(hints.length<=3,'HINT_REDESIGN_REQUIRED: legacy four hints cannot be truncated');return hints;}
