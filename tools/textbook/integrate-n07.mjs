import fs from 'node:fs';
import{execFileSync}from'node:child_process';
import{isDeepStrictEqual}from'node:util';
import{repairN07}from'./repair-n07.mjs';
import { createHash } from 'node:crypto';
import { compileLesson } from './compile-lesson.mjs';
const root='work/items/W-GOV-010-learning-production-workflow/n07/';
const raw=fs.readFileSync(root+'N07_DESIGN_PLAN.json','utf8');
const approval=JSON.parse(fs.readFileSync(root+'CONTENT_APPROVAL.json','utf8'));
if(approval.status!=='APPROVED'||approval.planSHA256!==createHash('sha256').update(raw).digest('hex'))throw Error('Exact N07 content approval required');
const plan=JSON.parse(raw),compiled=compileLesson(plan);
compiled.unit.source={type:'reference',label:'教師編集Word「数と式」N07 / 承認済み段階設計',rightsNote:'原問14件と無番号説明を段階化。本文設計承認2026-10-24。'};
const output={...compiled,publishable:true,integrationStatus:'REGISTERED',nodes:plan.nodes,contentApproval:approval.planSHA256};
const repairRoot='work/items/W-MATH-032-n07-semantic-repair/';
let registered=output;
if(fs.existsSync(repairRoot+'APPROVAL.json')){
 const approved=JSON.parse(fs.readFileSync(repairRoot+'APPROVAL.json','utf8'));
 const proposal=fs.readFileSync(repairRoot+'PROPOSAL.md');
 if(createHash('sha256').update(proposal).digest('hex')!==approved.proposalHash)throw Error('N07 repair proposal approval mismatch');
 const immutable=execFileSync('git',['show','e6fc1017f3ce8f5cdce6102720b32afdc73f652b:'+repairRoot+'NODE_DESIGN.json']);
 if(!immutable.equals(fs.readFileSync(repairRoot+'NODE_DESIGN.json')))throw Error('N07 approved attached design changed');
 const source=JSON.parse(fs.readFileSync('tools/textbook/fixtures/n07-source-index.json'));
 registered=repairN07(output,JSON.parse(immutable),plan,source).artifact;
}
const path='src/data/textbook/math/numbers/n07Authored.json',text=JSON.stringify(registered,null,2)+'\n';
if(process.argv.includes('--check')){if(!isDeepStrictEqual(JSON.parse(fs.readFileSync(path,'utf8')),JSON.parse(text)))throw Error('N07 integration artifact is stale');console.log('N07 exact approved generation PASS');}
else fs.writeFileSync(path,text);
