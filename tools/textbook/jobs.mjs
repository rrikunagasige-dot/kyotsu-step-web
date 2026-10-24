import { existsSync } from 'node:fs';
import { readJSON,writeJSON,hash,invariant } from './util.mjs';
export function runStage({path,stage,input,implementationHash,commandArgs,produce}){
 invariant(typeof implementationHash==='string'&&implementationHash.length>0,'implementation fingerprint required');
 const job=existsSync(path)?readJSON(path):{version:1,stages:{}};
 invariant(job.version===1,'unknown job format');
 const key=hash({input,implementationHash});job.lastStage=stage;job.history??=[];const previous=job.stages[stage];
 if(previous?.status==='PASS'&&previous.key===key&&hash(previous.output)===previous.outputHash){job.history.push({stage,key,status:'PASS',reused:true,outputHash:previous.outputHash,implementationHash});writeJSON(path,job);return {output:previous.output,cached:true};}
 try{const output=produce();if(output?.status&&output.status!=='PASS')throw Error('stage verification failed: '+JSON.stringify(output));job.stages[stage]={key,input,commandArgs,status:'PASS',outputHash:hash(output),output,implementationHash};job.history.push({stage,key,status:'PASS',outputHash:hash(output),implementationHash});writeJSON(path,job);return {output,cached:false};}
 catch(error){job.stages[stage]={key,input,commandArgs,status:'FAIL',error:error.message,implementationHash,resumeStage:stage};job.history.push({stage,key,status:'FAIL',error:error.message,implementationHash});writeJSON(path,job);throw error;}
}
