import { invariant } from './util.mjs';
// Executable design-state model. Actual React/progress integration is still a separate task.
export const startState = ()=>({cursor:0,phase:'before',completed:[],mistakes:0});
export function currentNode(plan,state){const id=plan.orderedNodeIds[state.cursor];return plan.nodes.find(n=>n.id===id);}
export function exposedResults(plan,state){
 const exposed=new Set();
 for(const id of plan.orderedNodeIds.slice(0,state.cursor)){const n=plan.nodes.find(n=>n.id===id);exposed.add(n.resultId);}
 const current=currentNode(plan,state);if(current&&state.phase==='after')exposed.add(current.resultId);
 return exposed;
}
export function submit(plan,state,itemId,correct){
 const node=currentNode(plan,state);invariant(node?.interaction?.id===itemId&&state.phase==='before','out-of-order response');
 return correct?{...state,phase:'after',completed:[...state.completed,itemId]}:{...state,mistakes:state.mistakes+1};
}
export function advance(plan,state){
 const node=currentNode(plan,state);invariant(node,'already finished');invariant(!node.interaction||state.phase==='after','answer required');
 return {...state,cursor:state.cursor+1,phase:'before'};
}
