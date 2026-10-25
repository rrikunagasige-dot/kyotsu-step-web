import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {validateGraph} from './graph.mjs';
import {hash} from '../util.mjs';
export function verifySolution(graph,{python=process.env.KYOTSU_MATH_PYTHON??process.env.KYOTSU_ML_PYTHON??'python',timeout=15000}={}){
  const structural=validateGraph(graph);if(structural.status!=='PASS')return structural;
  return {...verifyMathPayload({graph},{python,timeout}),graphHash:hash(graph)};
}
export function verifyMathPayload(payload,{python=process.env.KYOTSU_MATH_PYTHON??process.env.KYOTSU_ML_PYTHON??'python',timeout=15000}={}){
  const run=spawnSync(python,[fileURLToPath(new URL('../solver/solution.py',import.meta.url))],{input:JSON.stringify(payload),encoding:'utf8',timeout,maxBuffer:4*1024*1024});
  if(run.error)return {status:'UNSUPPORTED',reason:run.error.code??run.error.message};
  if(run.status!==0&&run.stderr.includes("No module named 'sympy'"))return {status:'UNSUPPORTED',reason:'MATH_DEPENDENCY_MISSING',detail:'Install the pinned solution requirements in KYOTSU_MATH_PYTHON.'};
  try{return JSON.parse(run.stdout);}catch{return {status:'FAIL',reason:'MATH_ADAPTER_OUTPUT',detail:run.stderr.slice(0,1000)};}
}
