import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {compileIR} from '../../../tools/textbook/ir/index.mjs';
const base='work/items/W-MATH-033-n08-absolute-value/';
const read=p=>JSON.parse(fs.readFileSync(base+p,'utf8'));
const approval=read('APPROVAL.json');
for(const name of ['PROPOSAL.md','NODE_DESIGN.json','CANDIDATE_IR.json']){
 const original=execFileSync('git',['show',approval.approvedCommit+':'+base+name]);
 if(!original.equals(fs.readFileSync(base+name)))throw Error('Approved input changed: '+name);
}
const design=read('NODE_DESIGN.json'),ir=read('CANDIDATE_IR.json'),compiled=compileIR(ir);
if(compiled.irHash!==approval.contentDesignHash)throw Error('Approved IR hash mismatch');
let seq=0;
function prose(s){return s.split(/(\$[^$]+\$|\*\*[^*]+\*\*)/).filter(Boolean).map(t=>{
 const semanticId='n08-display-'+String(++seq).padStart(5,'0');
 return t.startsWith('$')?{type:'math',latex:t.slice(1,-1),semanticId}:t.startsWith('**')?{type:'term',text:t.slice(2,-2),usage:'first_definition',semanticId}:{type:'text',text:t,semanticId};
});}
// String.raw retains mathematical command backslashes in authored question copy.
const questionLatex=[String.raw`2.3,\quad-5`,String.raw`a\ge0`,String.raw`a<0`,String.raw`a=-5`,String.raw`|\sqrt5-3|`,String.raw`\sqrt5-3`,String.raw`|\sqrt5-3|`,String.raw`3-\pi`,String.raw`|3-\pi|`,String.raw`|a|=0`,String.raw`|a|,\quad|-a|`,String.raw`|a|^2`];
const questionText=['二点の距離を、与えられた順に求めよう。','0以上の場合の絶対値を表そう。','負の場合の距離を式にしよう。','負の値を代入して確かめよう。','二乗した数を比べ、中身の大小関係を求めよう。','差の符号を判断しよう。','絶対値を外し、括弧も外した式へつなげよう。','与えられた円周率の小数表示から、差の符号と根拠を求めよう。','絶対値記号のない式で表そう。','距離が0になる条件を、位置の意味から説明しよう。','反対の二数の絶対値の関係を求めよう。','正負の場合を調べ、絶対値の二乗を表そう。'];
const titles=['原点からの距離','絶対値の定義と右側の点','左側の点の距離','代入と場合分け','二乗の比較から大小へ','大小から差の符号へ','負の式の絶対値を外す','円周率を含む差の符号','同じ規則を別の式へ使う','距離が0になる条件','反対の二数の距離','絶対値を二乗する'];
const stages=Array.from({length:12},(_,i)=>({id:'n08-stage-'+String(i+1).padStart(2,'0'),title:titles[i],q:i+1,
 sourceQuestionParts:[...prose(questionText[i]),{type:'math',latex:questionLatex[i],semanticId:'n08-question-'+(i+1)}]}));
// Mixed original grading strings keep their old contract; render their prose and math separately.
function choiceParts(s,isText){
 if(s.includes('\\text{')){
  const [math,rest]=s.split(/,\\quad\\text\{/);
  return [...prose('$'+math+'$'),...prose('、'+rest.slice(0,-1))];
 }
 if(!isText)return [{type:'math',latex:s,semanticId:'n08-choice-display-'+String(++seq)}];
 return prose(s.replace(/π/g,'$\\pi$').replace(/3/g,'$3$'));
}
const items=[];const displays={};
for(const n of design.nodes){
 const q=ir.nodes.find(x=>x.id===n.id)?.interaction;
 if(q){
  const text=q.expected.form==='text';
  const level=items.length<2?'strong':items.length<22?'medium':'light';
  items.push({id:q.id,label:q.id.toUpperCase(),prompt:n.goal,answer:q.expected.value,acceptedAnswers:[],answerType:text?'text':'formula',choices:q.choices.map(c=>c.content),purpose:'causal-reasoning',scaffoldLevel:level,hints:q.hints});
  displays[n.id]={hintParts:q.hints.map(prose),choices:Object.fromEntries(q.choices.map(c=>[c.content,choiceParts(c.content,text)])),feedback:Object.fromEntries(q.choices.map(c=>[c.content,prose(c.feedback)]))};
 }
}
// Before and after are two states of one equation, so retain one visible number.
const equationNumbers={};let number=0;
for(const n of compiled.nodes){
 const formulas=[...n.before,...n.after].filter(b=>b.type==='formula');
 if(formulas.length){number++;for(const b of formulas)equationNumbers[b.id]=number;}
}
const flow=compiled.nodes.flatMap(n=>[...n.before,...n.after]);
const figure={id:'n08-f01',src:'/assets/math/textbook/numbers/n08-f01.png',alt:'原点の左右に2.3と−5の点が配置された元の数直線。距離の解答は書かれていない。',caption:'点の位置を読み、原点までの距離を考えよう。',overlays:[]};
const unit={schemaVersion:'1.1',unitId:'math-numbers-expressions-n08',revision:4,status:'review',subject:'math-1a',chapter:{chapterId:'math-ch01-numbers-expressions',chapterNumber:'1',chapterTitle:'数と式',unitCode:'1NUM',orderInChapter:8,sourcePages:[20,21]},title:'向きと距離を分けて、絶対値を読む',subtitle:'数直線の距離から場合分けを作り、式全体の符号を判定する。',source:{type:'reference',label:'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N08',rightsNote:'原問12件、原図1点。W-MATH-033/P-001承認に基づく小段階と本文。'},objectives:['数直線上の距離を絶対値として捉える','式の正負を先に確かめて絶対値を外す','絶対値の一般的な性質を距離から導く'],sections:[{id:'lesson',number:'08',title:'本文',role:'concept',figures:[figure],readingFlow:flow,items}]};
const artifact={schemaVersion:'n08-presentation/1',approvedCommit:approval.approvedCommit,proposalHash:approval.proposalHash,irHash:compiled.irHash,unit,nodes:design.nodes.map(n=>({id:n.id,stageId:n.stageId,q:n.q,goal:n.goal,role:n.role,knownRefs:n.knownRefs,resultId:n.resultId,interaction:n.itemId})),stages,semantic:compiled,semanticDisplay:displays,equationNumbers};
const target='src/data/textbook/math/numbers/n08Authored.json';const raw=JSON.stringify(artifact,null,2)+'\n';
if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==raw)throw Error('N08 compiled artifact drift');}
else fs.writeFileSync(base+'MATERIALIZED_APP.json',raw);
console.log(JSON.stringify({status:'PASS',irHash:compiled.irHash,nodes:artifact.nodes.length,items:items.length,sha256:crypto.createHash('sha256').update(raw).digest('hex')}));
