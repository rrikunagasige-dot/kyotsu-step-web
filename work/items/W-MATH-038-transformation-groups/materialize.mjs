import fs from 'node:fs';
import {n11TransformationPlan} from '../../../tools/textbook/transformation/n11.mjs';
import {compileTransformationPresentation} from '../../../tools/textbook/transformation/compile.mjs';
const base='work/items/W-MATH-038-transformation-groups/';
const ir=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n11Authored.json'));
const plan=n11TransformationPlan(ir),result=compileTransformationPresentation(ir,plan);
if(result.status!=='PASS')throw Error(JSON.stringify(result));
for(const [path,value] of [[base+'N11_TRANSFORMATION_PLAN.json',plan],[base+'N11_MATH_CHECK.json',result],['src/data/textbook/math/numbers/n11Transformation.json',result.compiled]]){
 const bytes=JSON.stringify(value,null,2)+'\n';
 if(process.argv.includes('--check')){if(fs.readFileSync(path,'utf8')!==bytes)throw Error('DRIFT '+path);}else fs.writeFileSync(path,bytes);
}
console.log(JSON.stringify({status:'PASS',planHash:result.compiled.planHash,irHash:result.compiled.irHash,rows:result.compiled.groups[0].rows.length}));
