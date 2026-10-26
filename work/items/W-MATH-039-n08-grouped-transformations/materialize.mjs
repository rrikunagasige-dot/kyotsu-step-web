import fs from 'node:fs';import assert from 'node:assert/strict';
import {n08TransformationPlan} from '../../../tools/textbook/transformation/n08.mjs';
import {compileTransformationPresentation} from '../../../tools/textbook/transformation/compile.mjs';
const base='work/items/W-MATH-039-n08-grouped-transformations/';
const ir=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n08Revision5.json'));
const plan=n08TransformationPlan(ir),checked=compileTransformationPresentation(ir,plan);
assert.equal(checked.status,'PASS',JSON.stringify(checked.findings));
for(const [p,v] of [[base+'N08_TRANSFORMATION_PLAN.json',plan],[base+'N08_MATH_CHECK.json',checked.mathReceipts],['src/data/textbook/math/numbers/n08Transformation.json',checked.compiled]]){
 const bytes=JSON.stringify(v,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),bytes,p);else fs.writeFileSync(p,bytes);
}
console.log(JSON.stringify({status:'PASS',groups:4,interactions:plan.candidates.length,planHash:checked.compiled.planHash}));
