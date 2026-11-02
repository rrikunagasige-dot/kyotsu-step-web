import fs from 'node:fs';import crypto from 'node:crypto';
const root='/workspace/scratch/6ff917b2ec4a/w046-ux05-release-frozen';const out='/tmp/w046-r04';
const {validateDesign}=await import(root+'/tools/textbook/n0910/validate-design.mjs');
const {compileNestedMathTemplate}=await import(root+'/src/components/textbook/nestedMathTemplate.ts');
const p=JSON.parse(fs.readFileSync(out+'/PROPOSAL.json'));const d=JSON.parse(fs.readFileSync(root+'/work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json'));
d.proposalId=p.proposalId;d.status='R04_UNAPPROVED_PROPOSAL';d.approvalStatus='NOT_APPROVED';d.author='/root';d.provenance='source691dのNODE_DESIGNへ新案の可視行/穴/本文をscratchで対応。製品pin/compiledは変更しない。';
for(const unit of d.units){unit.fromRevision=p.sourceRevisions[unit.code.toLowerCase()];unit.toRevision=p.targetRevisions[unit.code.toLowerCase()];
for(const n of unit.nodes){const b=p.blocks.find(b=>b.nodeId===n.nodeId);if(b){
 n.leadParts=b.leadParts;if(b.assumptionOverride)n.assumptions=b.assumptionOverride;if(b.assumptionPartsOverride)n.assumptionParts=b.assumptionPartsOverride;if(b.assumptionsDisplayOverride)n.assumptionsDisplay=b.assumptionsDisplayOverride;
 n.classification='NEW_CONSTRUCTION';n.parts=b.parts.map(x=>x.oldContract??{id:x.partId,key:x.key,kind:x.kind,role:'meaningful-expression-construction',prompt:x.prompt,learningAction:x.learningAction,expected:x.expected,choices:x.choices.map(c=>({...c,kind:x.kind,display:c.value,latex:x.kind==='math'?c.value:undefined,misconception:c.value===x.expected?'正答':c.feedback})),sourceRefs:[n.nodeId+'-source-contract'],mathAssertion:{kind:'requires-semantic-review',expected:x.expected,codeSupported:false,reviewStatus:'NEEDS_AI_REVIEW',rationale:x.learningAction,sourceRefs:[n.nodeId+'-source-contract']}});
 n.partOrder=n.parts.map(x=>x.key);n.rows=[];
 for(const r of b.visibleSequence){if(r.intro)n.rows.push({id:r.id+'-intro',kind:'text',template:r.intro,partKeys:[],requiresCorrectKeys:r.requiresCorrectKeys});n.rows.push({id:r.id,kind:r.kind,template:r.template,partKeys:r.partKeys,requiresCorrectKeys:r.requiresCorrectKeys,...(r.kind==='math'?{mathGroupId:r.mathGroupId}:{})});}
 n.rows.push({id:n.nodeId+'::ux06-after-text',kind:'text',template:b.afterVisibleText,partKeys:[],requiresCorrectKeys:n.partOrder});
 n.terminalRecord={...n.terminalRecord,formulas:b.unblankedDerivation,prose:b.afterVisibleText,requiresCorrectKeys:n.partOrder};
 n.sourceCoverage=n.sourceCoverage.map(c=>({...c,disposition:'REPLACE',reason:'UX06案：導出と本文を再構成。原資料の数学対象は保持。',targetRefs:[n.rows[0].id,n.nodeId+'::terminal']}));
 }
 const prose=p.proseOnly.find(x=>x.nodeId===n.nodeId);if(prose){if(prose.changes.lead)n.leadParts=prose.changes.leadParts;else Object.assign(n,prose.changes);}
}}
fs.writeFileSync(out+'/CANDIDATE_NODE_DESIGN.json',JSON.stringify(d,null,2)+'\n');
const sources=Object.fromEntries(d.units.map(u=>{const bytes=fs.readFileSync(root+'/'+u.sourcePath);return[u.unitId,{bytes,data:JSON.parse(bytes)}]}));
const result=validateDesign(d,sources);const math=[];
for(const u of d.units)for(const n of u.nodes){if(!p.blocks.some(b=>b.nodeId===n.nodeId))continue;for(const r of n.rows.filter(x=>x.kind==='math')){for(const mode of ['unanswered','correct']){try{
 const compiled=compileNestedMathTemplate({template:r.template,parts:n.parts,values:mode==='correct'?Object.fromEntries(n.parts.map(x=>[x.key,x.expected])):{},certifiedKeys:mode==='correct'?n.partOrder:[]});math.push({nodeId:n.nodeId,rowId:r.id,mode,status:'PASS',slotPaths:compiled.slots.map(s=>({key:s.key,path:s.path})),latex:compiled.latex});
 }catch(e){math.push({nodeId:n.nodeId,rowId:r.id,mode,status:'FAIL',error:String(e)});}}}}
fs.writeFileSync(out+'/NATIVE_PREFLIGHT.json',JSON.stringify({proposalSHA256:crypto.createHash('sha256').update(fs.readFileSync(out+'/PROPOSAL.json')).digest('hex'),design:result,math,meaningAuditRequired:true,visualAcceptance:'NOT_RUN',productChanged:false},null,2)+'\n');
console.log(JSON.stringify({design:result.status,findings:result.findings,math:math.length,mathFailures:math.filter(x=>x.status==='FAIL')},null,2));
