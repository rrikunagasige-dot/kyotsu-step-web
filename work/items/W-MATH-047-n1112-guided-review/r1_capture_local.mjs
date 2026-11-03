// Keep preview server and browser in the same isolated execution environment.
import {spawn} from 'node:child_process';import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4397','--outDir','/tmp/w047-r1-dist'],{cwd:'/tmp/w047-r1-preview',stdio:'ignore'});
try{
 let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch('http://127.0.0.1:4397/kyotsu-step-web/')).ok;if(ready)break;}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready);
 const task=spawn(process.execPath,['work/items/W-MATH-047-n1112-guided-review/capture_n11.mjs'],{stdio:'inherit',env:{...process.env,CHROME_PATH:'/tmp/w046-browser-manual/chrome-headless-shell-linux64/chrome-headless-shell',APP_URL:'http://127.0.0.1:4397/kyotsu-step-web/',CANDIDATE_SHA:'INACTIVE_R1_a3f9',EVIDENCE_DIR:'work/items/W-MATH-047-n1112-guided-review/evidence/r1-inactive-preview'}});
 const code=await new Promise(resolve=>task.once('exit',resolve));assert.equal(code,0);
}finally{server.kill();}
