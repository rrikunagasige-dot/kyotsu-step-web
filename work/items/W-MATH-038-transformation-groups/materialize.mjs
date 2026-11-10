import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {n11TransformationPlan} from '../../../tools/textbook/transformation/n11.mjs';
import {compileTransformationPresentation} from '../../../tools/textbook/transformation/compile.mjs';
const base='work/items/W-MATH-038-transformation-groups/';
const irPath='src/data/textbook/math/numbers/n11Authored.json',productPath='src/data/textbook/math/numbers/n11Transformation.json';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex'),serialized=value=>JSON.stringify(value,null,2)+'\n';
// W038 records are the exact historical result, never relabelled as the current W047 result.
const legacyRecords={
 [base+'N11_TRANSFORMATION_PLAN.json']:'0d5ccf584bc97d1c4ef6054f3b02f2f2ee42a4faba4654844aae707d33c20ea5',
 [base+'N11_MATH_CHECK.json']:'69de1363cc47006f5f26eafc0146536bf8cebe5d0c76b3e1e7909603632c6c11'
};
const editions={
 '3465df01e4d764a6aae14742b370804494450055205c968685715c9157cb10fe':{
  name:'W047-accepted-r11',plan:'a3f9b71b1c7776f4d86dcebd970d7874b095218bc92cb7b40fee97b7f6231282',math:'759801342cda2cfdf127ee27706df84d5927043133360aece5fb47f96a84f91b',product:'906c4fef2e53a9a992fae5f82e7a7255a504215eeee19954f179d2fa902707a9'
 }
};
const args=process.argv.slice(2);
if(!args.includes('--check')||args.some(arg=>!['--check','--proof'].includes(arg)))throw Error('CHECK_ONLY_HISTORICAL_RECORDS_IMMUTABLE');
for(const [path,expected]of Object.entries(legacyRecords))if(digest(fs.readFileSync(path))!==expected)throw Error('UNKNOWN_OR_MIXED_HISTORICAL_RECORD '+path);
const irBytes=fs.readFileSync(irPath),irHash=digest(irBytes),edition=editions[irHash];
if(!edition)throw Error('UNREGISTERED_CURRENT_N11_SOURCE');
const productBytes=fs.readFileSync(productPath);
if(digest(productBytes)!==edition.product)throw Error('SOURCE_PRODUCT_EDITION_MISMATCH');
const ir=JSON.parse(irBytes),plan=n11TransformationPlan(ir),result=compileTransformationPresentation(ir,plan);
if(result.status!=='PASS')throw Error(JSON.stringify(result));
const planBytes=serialized(plan),mathBytes=serialized(result),compiledBytes=serialized(result.compiled);
if(digest(planBytes)!==edition.plan||digest(mathBytes)!==edition.math)throw Error('DERIVED_RESULT_DRIFT');
if(digest(compiledBytes)!==edition.product||!productBytes.equals(Buffer.from(compiledBytes)))throw Error('CURRENT_PRODUCT_DERIVATION_DRIFT');
const proof={schemaVersion:'w038-current-derivation-proof/1',status:'PASS_SOURCE_DERIVATION_ONLY',edition:edition.name,
 legacyRecordStatus:'UNCHANGED_HISTORICAL_NOT_CURRENT_RESULT',legacyRecords,
 inputSourceSHA256:irHash,derivedPlanSHA256:digest(planBytes),derivedMathCheckSHA256:digest(mathBytes),productSHA256:digest(productBytes),
 checkerSHA256:digest(fs.readFileSync(fileURLToPath(import.meta.url))),
 contentApprovalCreated:false,learnerVisibleQualityAudited:false,releaseReadinessCertified:false,
 derivedPlan:plan,derivedMathCheck:result};
// Evidence output belongs only to this new technical Work, never the old W038 records/product.
const proofPath='work/items/W-TECH-QF01-CI-EDITION-P003-20261109/activation/W038_CURRENT_DERIVATION.json';
if(args.includes('--proof')){
 const bytes=serialized(proof);
 if(fs.existsSync(proofPath)){if(fs.readFileSync(proofPath,'utf8')!==bytes)throw Error('EXISTING_PROOF_DIFFERENT');}
 else{fs.mkdirSync(dirname(proofPath),{recursive:true});fs.writeFileSync(proofPath,bytes,{flag:'wx'});}
}
console.log(JSON.stringify({status:'PASS',verificationScope:proof.status,edition:edition.name,legacyRecordStatus:proof.legacyRecordStatus,irHash,planHash:result.compiled.planHash,derivedPlanSHA256:proof.derivedPlanSHA256,derivedMathCheckSHA256:proof.derivedMathCheckSHA256,productSHA256:proof.productSHA256,proofPath:args.includes('--proof')?proofPath:null}));
