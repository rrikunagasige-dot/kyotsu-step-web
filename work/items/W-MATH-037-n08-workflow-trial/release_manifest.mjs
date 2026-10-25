import fs from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const base='work/items/W-MATH-037-n08-workflow-trial/',read=p=>JSON.parse(fs.readFileSync(p)),sha=process.env.CANDIDATE_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),approval=read(base+'APPROVAL.json'),plan=read(base+'IMPLEMENTATION_PLAN.json');
if(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==sha)throw Error('SOURCE_SHA_MISMATCH');
for(const [p,h]of Object.entries(plan.protected_manifest))if(createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==h)throw Error('PROTECTED_DRIFT '+p);
for(const [p,h]of [['PROPOSAL.md',approval.proposalHash],['NODE_DESIGN.json',approval.designHash]])if(createHash('sha256').update(fs.readFileSync(base+p)).digest('hex')!==h)throw Error('DESIGN_DRIFT');
execFileSync(process.execPath,[base+'materialize.mjs','--check'],{stdio:'inherit'});
const candidate=read(base+'CANDIDATE_N08_R5.json'),active=read('src/data/textbook/math/numbers/n08Revision5.json');if(JSON.stringify(candidate)!==JSON.stringify(active))throw Error('LEAF_DRIFT');
const selectedRevision=read('src/data/textbook/math/numbers/n08ActiveVersion.json').revision;
if(![4,5].includes(selectedRevision))throw Error('ACTIVE_VERSION');
if(process.argv.includes('--check')){console.log('N08 approved design, deterministic leaf, exact r4 and protected scope PASS');process.exit(0);}
const runtime=read('e2e-evidence/chapter-runtime/runtime-units.json');if(runtime.metadata.sourceSHA!==sha||runtime.units.length!==16)throw Error('RUNTIME_SOURCE_MISMATCH');
const n08=runtime.units.find(x=>x.unit.unitId===active.unit.unitId);if(n08.unit.revision!==selectedRevision||n08.unit.sections[0].items.length!==(selectedRevision===5?34:31))throw Error('RUNTIME_N08_VERSION');
const m={sourceSHA:sha,source_sha:sha,workflowSHA:process.env.GITHUB_SHA??null,storageKey:process.env.VITE_STORAGE_NAMESPACE,work:'W-MATH-037',contentApproval:approval.proposalHash,unitDesignHash:active.irHash,activeN08Revision:selectedRevision,oldN08:{revision:4,sha256:plan.protected_manifest['src/data/textbook/math/numbers/n08Authored.json'],route:'/learning/textbook/'+active.unit.unitId+'?version=4'},repairedUnits:[active.unit.unitId],themes:3,units:runtime.units.map(x=>({id:x.unit.unitId,revision:x.unit.revision,items:x.unit.sections.flatMap(s=>s.items.map(q=>q.id))}))};
fs.writeFileSync('dist/release.json',JSON.stringify(m,null,2)+'\n');console.log(JSON.stringify({sourceSHA:sha,N08Revision:selectedRevision,oldN08Preserved:true}));
