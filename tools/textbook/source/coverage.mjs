import { invariant } from '../util.mjs';
export function sourceCoverage(blocks,coverage,nodes){
 const source=new Set(blocks.map(x=>x.id));const errors=[];
 for(const b of blocks){const rows=coverage.filter(c=>c.sourceId===b.id);if(rows.length!==1)errors.push({rule:'SOURCE_COVERAGE',id:b.id});}
 for(const c of coverage){if(!source.has(c.sourceId)||!c.reason||!['taught','structural','excluded','next-unit-context'].includes(c.disposition))errors.push({rule:'DISPOSITION',id:c.sourceId});
  if(c.disposition==='taught'&&!c.nodeIds.length)errors.push({rule:'EMPTY_TAUGHT',id:c.sourceId});
  for(const id of c.nodeIds){const n=nodes.find(n=>n.id===id);if(!n?.sourceRefs.includes(c.sourceId))errors.push({rule:'REVERSE_COVERAGE',id});}}
 for(const n of nodes)for(const id of n.sourceRefs)if(!coverage.some(c=>c.sourceId===id&&c.nodeIds.includes(n.id)))errors.push({rule:'NODE_UNMAPPED',id:n.id});
 return {status:errors.length?'FAIL':'PASS',errors,blocks:blocks.length};
}
export function selectContext(ir,nodeId,solved){
 const n=ir.nodes.find(n=>n.id===nodeId);invariant(n,'unknown node');const known=new Set(ir.initialFacts);
 for(const prev of ir.nodes){if(prev.id===nodeId)break;if(solved.includes(prev.id)||!prev.interaction)prev.produces.forEach(f=>known.add(f));}
 return n.contextNeed.map(ref=>{invariant(ref.problemId===n.problemId,'context scope mismatch');invariant(ref.factIds.every(f=>known.has(f)),'future context');return {...ref,producers:ir.nodes.filter(p=>p.produces.some(f=>ref.factIds.includes(f))).map(p=>({id:p.id,blocks:p.after}))};});
}
