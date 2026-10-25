// Read-only audit. Does not materialize proposed IR into learner source.
import fs from 'node:fs';import assert from 'node:assert/strict';import katex from 'katex';import {compileIR,validateIR} from '../../../tools/textbook/ir/index.mjs';
const B='work/items/W-MATH-035-choice-order-factor-audit/';const read=p=>JSON.parse(fs.readFileSync(p));const out={sourceSHA:'cb7d30bfe666b9123ea51e1fad7e36268507b674',implementationChanged:false,units:[]};
for(const u of ['n09','n10']){
 const live=read('src/data/textbook/math/numbers/'+u+'Authored.json'),proposed=read(B+u.toUpperCase()+'_PROPOSED_IR.json');const currentErrors=[],proposalErrors=[];
 function check(nodes,items,errors){for(const n of nodes)for(const side of ['before','after'])for(const b of n[side])if(b.type==='formula'){
  const source=b.parts.map(p=>p.type==='math'?p.latex:p.type==='choice'?items.find(i=>i.id===p.itemId).answer:'').join('');try{katex.renderToString(source,{throwOnError:true,strict:'ignore'})}catch(e){errors.push({node:n.id,side,source,error:e.message})}
 }}
 const items=live.unit.sections[0].items;check(live.semantic.nodes,items,currentErrors);const compiled=compileIR(proposed);check(compiled.nodes,items,proposalErrors);
 const interaction=proposed.nodes.flatMap(n=>n.interaction?[n.interaction]:[]);assert.deepEqual(items.map(i=>({id:i.id,answer:i.answer,choices:i.choices})),interaction.map(i=>({id:i.id,answer:i.expected.value,choices:i.choices.map(c=>c.content)})));
 for(const item of items)if(item.answerType==='formula')for(const c of item.choices)katex.renderToString(c,{throwOnError:true,strict:'ignore'});
 assert.equal(proposalErrors.length,0);assert.equal(validateIR(proposed).status,'PASS');
 out.units.push({unit:u,nodeCount:live.nodes.length,items:items.length,choices:items.reduce((s,i)=>s+i.choices.length,0),currentErrors,proposalErrors,proposalIRHash:compiled.irHash,gradingKeysPreserved:true});
 fs.writeFileSync(B+'evidence/'+u.toUpperCase()+'_PROPOSAL_IR_CHECK.json',JSON.stringify(validateIR(proposed),null,2)+'\n');
}
assert.equal(out.units.flatMap(u=>u.currentErrors).length,1);assert.equal(out.units[0].currentErrors[0].node,'n09-14');
const policy=read(B+'PROPOSED_DISPLAY_POLICY.json').policies;let rows=0;
for(const [id,p]of Object.entries(policy)){for(const [key,lines]of Object.entries(p.choices)){
 for(const line of lines){katex.renderToString(line,{throwOnError:true,strict:'ignore'});rows++}
 if(id==='n09-08'){assert.ok(lines[0].startsWith('1.41^2='));assert.ok(lines[1].startsWith('1.42^2='));assert.ok(!lines[2].includes('='));const a=/^1\.41\^2=(.*?)([<>])2([<>])(.*?)=1\.42\^2$/.exec(key);assert.deepEqual(lines,[`1.41^2=${a[1]}`,`1.42^2=${a[4]}`,`${a[1]}${a[2]}2${a[3]}${a[4]}`]);}
}}
out.displayProfiles=Object.keys(policy);out.proposedRowsParsed=rows;out.status='PROPOSAL_CHECKS_PASS_CURRENT_SOURCE_HAS_KNOWN_DEFECTS';fs.writeFileSync(B+'evidence/AUDIT_CHECKS.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out));
