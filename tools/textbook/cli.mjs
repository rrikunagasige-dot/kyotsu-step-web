#!/usr/bin/env node
import { readFileSync,writeFileSync,mkdirSync,existsSync,readdirSync } from 'node:fs';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { readJSON,writeJSON,hash,invariant } from './util.mjs';
import { authorN07 } from './fixtures/n07-author.mjs';
import { verifyPlan } from './verify.mjs';
import { compileLesson } from './compile-lesson.mjs';
import { proposalMarkdown } from './export-proposal.mjs';
import { runStage } from './jobs.mjs';
import { prepareProduction,importProductionResponse,python as productionPython } from './production.mjs';
import { validateIR,compileIR } from './ir/index.mjs';
import { implementationFingerprint } from './fingerprint.mjs';
import {operate} from './operations.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const fingerprint=()=>implementationFingerprint(resolve(root,'tools/textbook'));
export function options(args){const [command,...rest]=args;const opts={};for(let i=0;i<rest.length;i++){invariant(rest[i].startsWith('--'),'named options required');const key=rest[i].slice(2);invariant(!Object.hasOwn(opts,key),'duplicate option');opts[key]=rest[i+1]&&!rest[i+1].startsWith('--')?rest[++i]:true;}return {command,opts};}
export function safeOutput(path,{source=false}={}){invariant(typeof path==='string','--out required');const p=resolve(path);invariant(!['src','public','.github'].some(x=>p===resolve(root,x)||p.startsWith(resolve(root,x)+'/')),'production writes are not authorized by this design tool');if(source)invariant(!p.startsWith(root+'/'),'raw source must stay outside the public repository');return p;}
function main(){
 const {command,opts}=options(process.argv.slice(2));invariant(command==='production'||(opts.unit??'n07')==='n07','UNSUPPORTED: only n07 pilot');let result;
 const stage=(input,produce)=>opts.job?runStage({path:safeOutput(opts.job,{source:true}),stage:command,input,implementationHash:fingerprint(),commandArgs:process.argv.slice(2),produce}).output:produce();
 if(command==='production'){
  const operation=opts.operation??'prepare';
  if(operation==='prepare')result=prepareProduction(readJSON(opts.source),opts.context?readJSON(opts.context):{});
  else if(operation==='import-ai')result=importProductionResponse(readJSON(opts.request),readJSON(opts.response));
  else if(operation==='verify')result=validateIR(readJSON(opts.input));
  else if(operation==='compile')result=compileIR(readJSON(opts.input));
  else if(['research-manifest','research-analysis','research-patterns','solution-validate','interaction-plan','render-solution','solution-review'].includes(operation))result=operate(operation,readJSON(opts.input));
  else result=productionPython(operation,readJSON(opts.input),{out:opts.out?safeOutput(opts.out):undefined});
  if(opts.out&&operation!=='finetune')writeJSON(safeOutput(opts.out),result);
  console.log(JSON.stringify({command,operation,status:result.status??'PASS',inputHash:result.inputHash}));
  if(['FAIL','UNSUPPORTED'].includes(result.status))process.exitCode=1;
  return;
 }
 else if(command==='resume'){const job=readJSON(opts.job);const item=job.stages[job.lastStage];invariant(item,'no stage to resume');if(item.status==='FAIL'){invariant(item.commandArgs&&item.commandArgs[0]!=='resume','resume command missing');const r=spawnSync(process.execPath,[fileURLToPath(import.meta.url),...item.commandArgs],{stdio:'inherit'});process.exitCode=r.status??1;return;}result={status:'PASS',resumeStage:job.lastStage,stageStatus:item.status};}
 else if(command==='inspect'){const out=safeOutput(opts.out,{source:true});invariant(typeof opts.source==='string','--source required');const r=spawnSync('python',[resolve(root,'tools/textbook/source/import-word.py'),opts.source,'--unit','N07','--out',out],{encoding:'utf8'});invariant(r.status===0,r.stderr||'source importer failed');result=readJSON(out);}
 else if(command==='author'){result=stage(readJSON(opts.source),()=>authorN07(readJSON(opts.source)));writeJSON(safeOutput(opts.out),result);}
 else if(command==='verify'){invariant(!opts.layer||opts.layer==='design','UNSUPPORTED: application verification runs after approved learner integration');result=stage(readJSON(opts.plan),()=>verifyPlan(readJSON(opts.plan)));if(opts.out)writeJSON(safeOutput(opts.out),result);}
 else if(command==='compile'){result=stage(readJSON(opts.plan),()=>compileLesson(readJSON(opts.plan)));const out=safeOutput(opts.out);if(opts.check){invariant(existsSync(out),'check target is missing');invariant(hash(readJSON(out))===hash(result),'generated artifact differs');}else writeJSON(out,result);}
 else if(command==='export-proposal'){result={status:'PASS'};const out=safeOutput(opts.out);mkdirSync(dirname(out),{recursive:true});writeFileSync(out,proposalMarkdown(readJSON(opts.plan)));}
 else if(command==='import-ai'){const plan=readJSON(opts.input);invariant(plan.sourceHash===opts['source-hash'],'stale source hash');result=verifyPlan(plan);invariant(result.status==='PASS',JSON.stringify(result.findings));invariant(plan.state==='candidate','AI cannot grant approval');writeJSON(safeOutput(opts.out),plan);}
 else throw Error('unknown command: '+command);
 console.log(JSON.stringify({command,status:result.status??'PASS',nodes:result.nodes?.length??result.nodes,items:result.items,sourceHash:result.sourceHash,findings:result.findings,resumeStage:result.resumeStage,stageStatus:result.stageStatus}));if(result.status&&result.status!=='PASS')process.exitCode=1;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main();}catch(e){console.error(JSON.stringify({status:'FAIL',message:e.message}));process.exitCode=1;}}
