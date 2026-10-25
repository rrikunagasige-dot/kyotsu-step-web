/** Analysis only: immutable lesson input, no app writes and no acceptance. */
import fs from 'node:fs';import crypto from 'node:crypto';
import {verifySolution} from '../../../tools/textbook/solution/verify.mjs';
import {expr,rat,sym,add,mul,pow} from '../../../tools/textbook/solution/expression.mjs';
const base='work/items/W-MATH-037-n08-workflow-trial/';const path='src/data/textbook/math/numbers/n08Authored.json';const bytes=fs.readFileSync(path);const data=JSON.parse(bytes);
const plain=parts=>parts.map(p=>p.type==='math'?`$${p.latex}$`:p.type==='choice'?`[${p.itemId}]`:p.text??'').join('');
const items=new Map(data.unit.sections.flatMap(s=>s.items).map(i=>[i.id,i]));
const index=data.nodes.map(n=>{const s=data.semantic.nodes.find(s=>s.id===n.id),q=items.get(n.interaction);return {...n,before:s.before.map(b=>({id:b.id,text:plain(b.parts??[])})),after:s.after.map(b=>({id:b.id,text:plain(b.parts??[])})),...(q?{question:q.prompt,answer:q.answer,choices:q.choices,hints:q.hints}:{})};});
fs.writeFileSync(base+'NODE_INVENTORY.json',JSON.stringify({source:path,sourceSHA256:crypto.createHash('sha256').update(bytes).digest('hex'),revision:data.unit.revision,nodes:index,stages:data.stages,nodeCount:index.length,interactionCount:items.size,choiceCount:[...items.values()].reduce((n,q)=>n+q.choices.length,0)},null,2)+'\n');
function graph(id,a,b){return {schemaVersion:'solution-graph/1',id,variable:'a',parameters:[],initialFacts:['arithmetic'],givens:[{id:id+'-given',statement:expr(a)}],rootStateId:id+'-s0',goalStateIds:[id+'-s1'],states:[a,b].map((expression,i)=>({id:id+'-s'+i,statement:expr(expression),activeVariable:'a',fixedParameters:[],facts:[]})),transitions:[{id:id+'-edge',from:id+'-s0',to:id+'-s1',ruleId:'rewrite',requires:[],produces:[],basisRefs:['arithmetic']}]};}
const a=sym('a'),r=rat;
const supported=[['distance-left',add(r(0),mul(r(-1),r(-5))),r(5)],['negative-expression',add(r(0),mul(r(-1),a)),mul(r(-1),a)],['negative-square',pow(mul(r(-1),a),2),pow(a,2)]].map(([id,before,after])=>({id,...verifySolution(graph(id,before,after))}));
const absent=[['absolute-value',{kind:'absolute',argument:a},a],['radical',{kind:'sqrt',argument:r(5)},r(2)],['pi-constant',{kind:'constant',name:'pi'},r(3)]].map(([id,before,after])=>({id,status:'UNSUPPORTED_IN_CURRENT_CONTRACT',raw:verifySolution(graph(id,before,before)),notAClaimOfMathematicalError:true}));
fs.writeFileSync(base+'UNSUPPORTED_ABS_GRAPH.json',JSON.stringify(graph('absolute-probe',{kind:'absolute',argument:a},{kind:'absolute',argument:a}),null,2)+'\n');
fs.writeFileSync(base+'ENGINE_SCOPE_CHECK.json',JSON.stringify({supported,notRepresentable:absent,meaning:'Known legacy lesson is not declared wrong because the new AST lacks constructors. No unsupported result promoted.'},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',nodeCount:index.length,interactions:items.size,supported:supported.map(r=>r.status),unsupported:absent.map(r=>r.id)}));
