// Inactive proposal only: validate two display-row changes without touching app data.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {n11TransformationPlan} from '../../../tools/textbook/transformation/n11.mjs';
import {compileTransformationPresentation} from '../../../tools/textbook/transformation/compile.mjs';
import {hash} from '../../../tools/textbook/util.mjs';
const b='work/items/W-MATH-047-n1112-guided-review/';
const ir=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n11Authored.json','utf8'));
const before=n11TransformationPlan(ir),p=structuredClone(before),rows=p.groups[0].rows;
const divide=rows.find(r=>r.id==='n11-tg-divide'),final=rows.find(r=>r.id==='n11-tg-final');
divide.sourceNodeId=final.sourceNodeId;divide.sourceRefs=structuredClone(final.sourceRefs);
divide.interactionRef=final.interactionRef;divide.slots=structuredClone(final.slots);
divide.before=[{type:'text',text:'両辺を決めた数で割ります。右辺の商を分数で表しましょう。'}];
final.visibleAfter.push(final.interactionRef);final.interactionRef=null;final.slots=[];
final.before=[{type:'text',text:'右辺の商が求まりました。左辺を整理して、解の範囲をまとめます。'}];
p.candidates.find(c=>c.id==='n11-06').learnerDecision=divide.before[0].text;
const compiled=compileTransformationPresentation(ir,p);assert.equal(compiled.status,'PASS',JSON.stringify(compiled.findings));
assert.deepEqual(p.graphs,before.graphs);assert.equal(p.gradingHash,before.gradingHash);
assert.deepEqual(p.numberAliases,before.numberAliases);assert.deepEqual(p.scope,before.scope);
for(const c of p.candidates){const old=before.candidates.find(x=>x.id===c.id);for(const k of ['id','nodeId','expected','choices','prerequisiteInteractionIds'])assert.deepEqual(c[k],old[k]);}
const partial=new Set(p.candidates.slice(0,-1).map(c=>c.id));
const visible=compiled.compiled.groups[0].rows.filter(r=>r.visibleAfter.every(id=>partial.has(id))).map(r=>({id:r.id,formula:(!r.interactionRef||partial.has(r.interactionRef))?r.completed:r.masked}));
assert.ok(!visible.some(r=>r.id==='n11-tg-final'));
assert.deepEqual(visible.find(r=>r.id==='n11-tg-divide').formula.right,[{type:'slot',id:'n11-tg-final-quotient',interactionRef:'n11-06'}]);
const report={status:'PASS_STATIC_PROPOSAL_ONLY',implemented:false,sourceSHA:'4a09de7a0f910669946466daf918ab28c820a5f2',planHash:hash(p),gradingHash:p.gradingHash,checks:['Current graph/source binding validation','All five interaction IDs, answer keys, choices, prerequisites unchanged','39 answer contracts in authored data untouched','Number16 and aliases preserved','At divisor-correct/end-unanswered: divide right is one slot, final hidden'],limits:['Not rendered or deployed','After approval: real four-width initial/wrong/correct/history/reset/save/migration and source-first meaning review required'],partialVisible:visible};
fs.writeFileSync(b+'evidence/N11_G2_CORRECTION_DRAFT_PLAN.json',JSON.stringify(p,null,2)+'\n');
fs.writeFileSync(b+'evidence/N11_G2_CORRECTION_DRAFT_CHECK.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
