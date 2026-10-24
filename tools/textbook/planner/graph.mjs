import { invariant,hash } from '../util.mjs';
export function teachingCandidates(solution,knowledge,{budget=3}={}){
 invariant(Number.isInteger(budget)&&budget>0&&budget<=3,'candidate budget 1..3');
 const ordered=[],known=new Set(knowledge),pending=[...solution];
 while(pending.length){const i=pending.findIndex(n=>n.inputFacts.every(f=>known.has(f)));invariant(i>=0,'cyclic or unknown solution prerequisite');const [n]=pending.splice(i,1);ordered.push(n);n.outputFacts.forEach(f=>known.add(f));}
 for(const n of ordered){invariant(n.goal&&n.operation?.kind&&n.operation.targets?.length&&n.basisRefs?.length,'incomplete mathematical operation');for(const id of n.nextUseIds??[])invariant(ordered.some(m=>m.id===id&&m.inputFacts.some(f=>n.outputFacts.includes(f))),'local result not consumed');}
 const candidates=[{profile:'first_application',steps:ordered.map(n=>({...n,explainInput:true,explainReason:true,reassemble:n.operation.kind==='reassemble'}))}];
 if(budget>1&&ordered.some(n=>n.repeated&&n.knownRule))candidates.push({profile:'practice',steps:ordered.map(n=>({...n,explainInput:!n.repeated,explainReason:!n.knownRule}))});
 if(budget>2&&ordered.some(n=>n.figureRef))candidates.push({profile:'figure_supported',steps:ordered.map(n=>({...n,readFigureFirst:Boolean(n.figureRef)}))});
 return candidates.map(c=>({...c,id:hash(c),status:'NEEDS_AI_REVIEW'}));
}
export function rankValid(candidates,predict){return candidates.filter(c=>c.valid!==false).map(c=>({candidate:c,receipt:predict?.(c)??{status:'ABSTAIN',reason:'NOT_TRAINED'}})).sort((a,b)=>(b.receipt.score??0)-(a.receipt.score??0));}
