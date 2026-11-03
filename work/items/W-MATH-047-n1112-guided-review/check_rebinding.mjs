/** Inactive data-binding probe. Never writes an authored or published file. */
import fs from 'node:fs';import assert from 'node:assert/strict';
import {n11TransformationPlan} from '../../../tools/textbook/transformation/n11.mjs';
import {validateTransformationPlan} from '../../../tools/textbook/transformation/validate.mjs';
import {compileTransformationPresentation} from '../../../tools/textbook/transformation/compile.mjs';
const b='work/items/W-MATH-047-n1112-guided-review/',read=p=>JSON.parse(fs.readFileSync(p));
const original=read('src/data/textbook/math/numbers/n11Authored.json'),candidate=structuredClone(original),compiled=read(b+'evidence/n11-candidate-compile-ir.json').compiled;
for(const id of ['n11-03','n11-q11-constant','n11-12']){
 const node=candidate.semantic.nodes.find(n=>n.id===id),patch=compiled.nodes.find(n=>n.id===id);node.before=patch.before;
 if(id==='n11-q11-constant')node.after=patch.after;
}
candidate.irHash=compiled.irHash;candidate.semantic.irHash=compiled.irHash;
candidate.unit.sections[0].readingFlow=candidate.semantic.nodes.flatMap(n=>[...n.before,...n.after]);
const originalPlan=read('work/items/W-MATH-038-transformation-groups/N11_TRANSFORMATION_PLAN.json'),old=read('src/data/textbook/math/numbers/n11Transformation.json');
const stale=validateTransformationPlan(candidate,originalPlan);assert.equal(stale.status,'FAIL');assert(stale.findings.some(f=>f.ruleId==='TG12_HASH'));
const plan=n11TransformationPlan(candidate),rebuilt=compileTransformationPresentation(candidate,plan);
assert.equal(rebuilt.status,'FAIL');assert(rebuilt.findings.some(f=>f.ruleId==='TG03_COVERAGE'));
for(const key of ['graphs','groups','candidates','coverage','scope','numberAliases','gradingHash'])assert.deepEqual(plan[key],originalPlan[key],key);
fs.writeFileSync(b+'evidence/N11_BINDING_PREFLIGHT.json',JSON.stringify({status:'NEEDS_EXPLICIT_SOURCE_MAPPING',stalePlanRejection:stale.findings.map(f=>f.ruleId),regeneratedPlanRejection:rebuilt.findings.map(f=>f.ruleId),protectedEqualPlanKeys:['graphs','groups','candidates','coverage','scope','numberAliases','gradingHash'],oldBindingMustRemain:true,unknownSourceMustStillReject:true,futureGeneratedProductPath:'src/data/textbook/math/numbers/n11Transformation.json',sourceSHA:'6b439d0d31fcd46708c256ed23a391009ab73164',productionChanged:false,scope:'Inactive probe. Current source/AST bridge correctly rejects the changed full source. A new exact mapping, preserving the old bridge and identical graphs, is part of the revised proposal. No candidate compile/render PASS claimed.'},null,2)+'\n');
console.log('N11_BINDING_PREFLIGHT_NEEDS_EXPLICIT_MAPPING');
