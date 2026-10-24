/** Deterministic operations consumed by workflow.runner. No stage is auto-approved. */
import {readFileSync} from 'node:fs';import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';import {resolve} from 'node:path';
import {validateIR,compileIR,visibleSnapshot} from './ir/index.mjs';
import {sourceCoverage} from './source/coverage.mjs';
import {solve,solutionReceipts} from './solver/n07.mjs';
import {teachingCandidates,rankValid} from './planner/graph.mjs';
import {blankCandidates,validateChoices} from './interaction/index.mjs';
import {hash} from './util.mjs';
export function operate(operation,input){
 if(operation==='coverage')return sourceCoverage(input.blocks,input.coverage,input.nodes);
 if(operation==='solve')return solve(input);
 if(operation==='solution-receipts')return {status:'PASS',receipts:solutionReceipts(),meaningAuditRequired:true};
 if(operation==='teaching-candidates')return {status:'PASS',candidates:teachingCandidates(input.solution,input.knowledge,input.options)};
 if(operation==='blank-candidates')return {status:'PASS',candidates:input.nodes.flatMap(n=>blankCandidates(n).map(c=>({...c,nodeId:n.id})))};
 if(operation==='choices')return validateChoices(input.choices,input.answer,input.options);
 if(operation==='verify-ir')return validateIR(input);
 if(operation==='compile-ir')return {status:'PASS',compiled:compileIR(input)};
 if(operation==='visible-snapshots')return {status:'PASS',snapshots:input.ir.nodes.map((n,i)=>visibleSnapshot(input.ir,n.id,input.ir.nodes.slice(0,i).map(n=>n.id)))};
 if(operation==='rank-valid')return {status:'PASS',ranked:rankValid(input.candidates)};
 if(operation==='figures'){
  const findings=[];for(const f of input.figures){if(!f.id||!f.purpose||!f.howToRead||!f.sourceRef||!f.visibleWhen)findings.push({id:f.id,rule:'FIGURE_MEANING'});if(f.sourcePath){const bytes=readFileSync(f.sourcePath);if(hash(bytes.toString('base64'))!==f.contentHash)findings.push({id:f.id,rule:'FIGURE_HASH'});}}
  if(!input.figures.length&&!input.noFigureReason)findings.push({rule:'FIGURE_DECISION_MISSING'});
  return {status:findings.length?'FAIL':'PASS',findings};
 }
 throw Error('unsupported operation '+operation);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{console.log(JSON.stringify(operate(process.argv[2],JSON.parse(readFileSync(0,'utf8')))));}catch(e){console.log(JSON.stringify({status:'FAIL',error:e.message}));process.exitCode=1;}
}
