import fs from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const base='work/items/W-MATH-039-n08-grouped-transformations/',read=p=>JSON.parse(fs.readFileSync(p)),sha=process.env.CANDIDATE_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),approval=read(base+'APPROVAL.json'),plan=read(base+'WORKFLOW_PLAN.json'),presentation=read('src/data/textbook/math/numbers/n08Transformation.json');
if(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==sha)throw Error('SOURCE_SHA_MISMATCH');
// Exact approved64 record envelope; original approval remains immutable. Unknown edits fail closed.
const digest=bytes=>createHash('sha256').update(bytes).digest('hex'),proposalBytes=fs.readFileSync(base+'PROPOSAL.md');
if(digest(proposalBytes)!==approval.proposalSha256){
 if(digest(proposalBytes)!=="fe5a64db1dbbedc2bedf10edd3e23f3a176754e72c2c8c89fe1ac53287a8c47b"||proposalBytes.length!==14743||digest(proposalBytes.subarray(0,1204))!=="272df485f45c26b6c9905fa2a292cea30e199b8f61ab16391aba9d6c51f605de"||digest(proposalBytes.subarray(1204))!==approval.proposalSha256||approval.proposalSha256!=="c27fd866666af45d35893bac52747ea33b710a4ea4a040ac82be90afacb491ee")throw Error('DESIGN_DRIFT');
}
// Original eight protected entries are retained; only exact W041 r7 / W047 r11 editions are admitted.
const acceptedLaterEditions={
  "src/data/textbook/math/numbers/n08ActiveVersion.json": {
    "old": "b05269e287cb1c4d210081745c4099df9dd7bdc35d038dc1ffcd6f7bc0160f07",
    "accepted": "a5d754a9411eb3f7cb366ab37b2aed781b9ee786fc7d18a4a935b483312f7878"
  },
  "src/data/textbook/math/numbers/n11Authored.json": {
    "old": "ae3823163ac23bb334ac02a6c868bbd1273b8b6f1f65c77cde6f751773900a74",
    "accepted": "3465df01e4d764a6aae14742b370804494450055205c968685715c9157cb10fe"
  },
  "src/data/textbook/math/numbers/n11Transformation.json": {
    "old": "c1cbfd5c5e4b7ee79baf40cd54a9170c4cae5286fb04e940c5f50e92bc3f5197",
    "accepted": "906c4fef2e53a9a992fae5f82e7a7255a504215eeee19954f179d2fa902707a9"
  }
};
// N11 source/display are one exact approved cohort; known old/new mixtures also fail.
const n11CohortPaths=['src/data/textbook/math/numbers/n11Authored.json','src/data/textbook/math/numbers/n11Transformation.json'];
const n11CohortHashes=Object.fromEntries(n11CohortPaths.map(path=>[path,digest(fs.readFileSync(path))]));
const isOriginalN11Cohort=n11CohortPaths.every(path=>n11CohortHashes[path]===acceptedLaterEditions[path].old);
const isAcceptedN11Cohort=n11CohortPaths.every(path=>n11CohortHashes[path]===acceptedLaterEditions[path].accepted);
if(!isOriginalN11Cohort&&!isAcceptedN11Cohort)throw Error('N11_COHORT_DRIFT');
if(digest(fs.readFileSync(base+'WORKFLOW_PLAN.json'))!=="abc2e58c3772e84769ee0f3dd46b461b9c1a4a1b5d087afcf2a38cbf8f9a450a")throw Error('PROTECTED_PLAN_DRIFT');
for(const [path,h]of Object.entries(plan.protected_manifest)){
 const actual=digest(fs.readFileSync(path));if(actual===h)continue;
 const later=acceptedLaterEditions[path];if(!later||h!==later.old||actual!==later.accepted)throw Error('PROTECTED_DRIFT '+path);
}
execFileSync(process.execPath,[base+'materialize.mjs','--check'],{stdio:'inherit'});
if(process.argv.includes('--check')){console.log('W039 approved design and exact protected source PASS');process.exit(0);}
const runtime=read('e2e-evidence/chapter-runtime/runtime-units.json');if(runtime.metadata.sourceSHA!==sha||runtime.units.length!==16)throw Error('RUNTIME_SOURCE_MISMATCH');
const oldPath='src/data/textbook/math/numbers/n08Authored.json';
const m={sourceSHA:sha,source_sha:sha,workflowSHA:process.env.GITHUB_SHA??null,storageKey:process.env.VITE_STORAGE_NAMESPACE,work:'W-MATH-039',contentApproval:approval.proposalSha256,transformation:{unitId:presentation.unitId,presentationVersion:presentation.presentationVersion,planHash:presentation.planHash,baseIRHash:presentation.baseIRHash,compiledPresentationHash:presentation.compiledPresentationHash,scope:presentation.scope,originalLayoutRoute:'/learning/textbook/'+presentation.unitId+'?layout=original'},activeN08Revision:read('src/data/textbook/math/numbers/n08ActiveVersion.json').revision,originalN08:{revision:5,sha256:plan.protected_manifest['src/data/textbook/math/numbers/n08Revision5.json'],route:'/learning/textbook/math-numbers-expressions-n08?layout=original'},retainedN11:read('src/data/textbook/math/numbers/n11Transformation.json').planHash,oldN08:{revision:4,sha256:plan.protected_manifest[oldPath],route:'/learning/textbook/math-numbers-expressions-n08?version=4'},repairedUnits:[presentation.unitId],themes:3,units:runtime.units.map(x=>({id:x.unit.unitId,revision:x.unit.revision,items:x.unit.sections.flatMap(s=>s.items.map(q=>q.id))}))};
fs.writeFileSync('dist/release.json',JSON.stringify(m,null,2)+'\n');console.log(JSON.stringify({sourceSHA:sha,N08Presentation:presentation.presentationVersion,planHash:presentation.planHash,oldN08Preserved:true}));
