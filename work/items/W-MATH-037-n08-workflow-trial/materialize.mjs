import fs from 'node:fs';import crypto from 'node:crypto';
import {repairN08} from '../../../tools/textbook/repair-n08.mjs';
const base='work/items/W-MATH-037-n08-workflow-trial/';const read=p=>JSON.parse(fs.readFileSync(p));
const approval=read(base+'APPROVAL.json');
for(const [name,key]of [['PROPOSAL.md','proposalHash'],['NODE_DESIGN.json','designHash']])if(crypto.createHash('sha256').update(fs.readFileSync(base+name)).digest('hex')!==approval[key])throw Error('APPROVED_DESIGN_CHANGED '+name);
const result=repairN08({old:read('src/data/textbook/math/numbers/n08Authored.json'),originalIR:read('work/items/W-MATH-033-n08-absolute-value/CANDIDATE_IR.json'),design:read(base+'NODE_DESIGN.json'),approval});
for(const [name,value]of Object.entries({'CANDIDATE_IR_R5.json':result.ir,'COMPILED_R5.json':result.compiled,'SOLUTION_BUNDLE_R5.json':result.bundle,'MATH_RECEIPT_R5.json':result.mathCheck,'CANDIDATE_N08_R5.json':result.artifact})){
 const bytes=JSON.stringify(value,null,2)+'\n';if(process.argv.includes('--check')){if(fs.readFileSync(base+name,'utf8')!==bytes)throw Error('DRIFT '+name);}else fs.writeFileSync(base+name,bytes);
}
if(process.argv.includes('--apply'))fs.writeFileSync('src/data/textbook/math/numbers/n08Revision5.json',JSON.stringify(result.artifact,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',irHash:result.compiled.irHash,nodes:result.artifact.nodes.length,items:result.artifact.unit.sections[0].items.length,mathSegments:result.mathCheck.checks.length,applied:process.argv.includes('--apply')}));
