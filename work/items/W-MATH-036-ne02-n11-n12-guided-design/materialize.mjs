import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {compileIR} from '../../../tools/textbook/ir/index.mjs';
const base='work/items/W-MATH-036-ne02-n11-n12-guided-design/';const read=p=>JSON.parse(fs.readFileSync(base+p,'utf8'));const approval=read('APPROVAL.json');
const hash=value=>createHash('sha256').update(value).digest('hex');
for(const [p,h]of Object.entries(approval.designInputs)){
 let v=fs.readFileSync(base+p);
 // P001 adds only this exact metadata envelope; compare its untouched body to the original approval and Git blob.
 if(p==='PROPOSAL.md'&&hash(v)==='4f044de4ea449e0a945443d13aecdee9ccd2b9bc11bcf00969778bd0a9e4715d'){
  const body=v.subarray(1045);
  if(h!=='db7460ff94b1c493e2c26f3d6e2d3450d7ae5d9e936d57b0b1237e280702f6b9'||approval.proposalHash!==h||hash(fs.readFileSync(base+'APPROVAL.json'))!=='20f52be25e4e3240cf3bc669753687878feb10af88329c3a41e0472759c90377'||hash(v.subarray(0,1045))!=='2d396bbf78fcb3034228b411c989771ede946305a83862835547818cd2ad210f'||hash(body)!==h)throw Error('Frozen design drift '+p);
  v=body;
 }
 if(hash(v)!==h||!execFileSync('git',['show',approval.approvedCommit+':'+base+p]).equals(v))throw Error('Frozen design drift '+p);
}
const checkArgs=process.argv.slice(2).filter(a=>a==='--check'||a.startsWith('--check-'));
if(checkArgs.some(a=>!['--check','--check-ne02','--check-n11','--check-n12'].includes(a)))throw Error('Unknown W036 check mode');
const checkMode=checkArgs.length>0;
// Read and pin immutable W036 outputs BEFORE generation; checks never rewrite these historical records.
const historicalHashes={"ne02":"cdd077c7d67a448f4341fdfca92c58f263f449caf80341ff5f77232a42755552","n11":"ae3823163ac23bb334ac02a6c868bbd1273b8b6f1f65c77cde6f751773900a74","n12":"bd7e9942376589e822bc3028954867997167bf4f44e3cb5fc9b7aea90b8af97a"};
const historicalRaw={};
if(checkMode)for(const [code,h]of Object.entries(historicalHashes)){
 const raw=fs.readFileSync(base+'MATERIALIZED_'+code.toUpperCase()+'.json','utf8');
 if(hash(raw)!==h)throw Error('Frozen historical materialization drift '+code);
 historicalRaw[code]=raw;
}
const spec=read('DISPLAY_SPEC.json');const titles={ne02:['和の平方を展開する','元の式へ対応させる','和と積から候補を探す','平方と符号を検算する','差の平方を展開する','交差項の係数をそろえる','二つの順序を候補に残す','非負の差を選ぶ','根号内全体を分数へ直す','商の平方根を使う','分子の候補を確定する','有理化して全体へ戻す'],n11:['負の数倍を数直線で読む','差の符号から加法を調べる','正・負・0の乗法と除法','元の大小へ戻って使う','定数を両辺で打ち消す','正の係数を1にする','元の式で境界を確かめる','定数を同じように引く','負の数で割る向きを選ぶ','等号を含む境界を確かめる','括弧・文字項・定数を順に整理','負の係数を1にする','分母を両辺からなくす','同類項をまとめ範囲を読む'],n12:['一つ目の条件を解く','二つ目の条件を解く','同じ数を両方へ代入する','端点を含め共通部分を残す','三連を二つの条件へ分ける','二つの条件を別々に解く','上限を元の式で確かめる','個数の関係を式にする','整数と個数の範囲を保存する','合計金額を組み立てる','以上と未満を条件にする','分配と同類項を順に計算する','三辺を同じ操作で変形する','整数条件へ戻って個数を選ぶ','二つの内訳を元の金額で検算する']};
function sourceQuestion(code,q){
 if(code==='ne02')return q<=4?'例題：$\\sqrt{5+2\\sqrt6}$ を簡単にする。候補の平方と非負性を確かめる。':q<=8?'例題：$\\sqrt{9-4\\sqrt5}$ を簡単にする。ここでも $a,b$ は正の実数として候補を作る。':'確認：$\\sqrt{3+\\sqrt5}$ を簡単にする。根号内全体の値を保って変形する。';
 if(code==='n11')return q===1?'例題：$2<5$ の両辺を $-1$ 倍した数を、数直線で比べる。':q<=4?'条件は $a<b$、文字は実数。差の符号を根拠に、同じ加減と正・負・0の乗法を調べる。':q<=7?'例題：$3x-2<5$ を満たすすべての実数 $x$ を求める。':q<=10?'例題：$-2x+3\\le5$ を満たすすべての実数 $x$ を求める。':q<=12?'確認：$3(2x+3)\\ge10x-17$ を解く。':'確認：$\\frac{x-2}{3}\\le2x+1$ を解く。';
 return q<=4?'例題：$x-2<3x+5$ と $x+4\\le5-x$ を同時に満たす実数 $x$ を求める。':q<=7?'確認：$3x+2\\le2x+4\\le9-x$ を解く。中央との二つの比較をどちらも残す。':'例題：50円の箱に、180円のシュークリームと130円のプリンを合わせて20個入れる。合計は3200円以上3300円未満。シュークリームの個数を $x$ として、可能な個数を求める。';
}
function splitRelation(s){let depth=0;for(let i=0;i<s.length;i++){if(s[i]==='{')depth++;if(s[i]==='}')depth--;if(depth)continue;for(const t of ['\\le','\\ge','<','>','='])if(s.startsWith(t,i)&&(!t.startsWith('\\')||!/[a-zA-Z]/.test(s[i+t.length]||'')))return [s.slice(0,i),t,s.slice(i+t.length)];}return null;}
function independentFunctionRows(s){return s.split(/,\s*\\(?:quad\b|\s+)(?=[A-Za-z]+\()/);}
for(const code of ['ne02','n11','n12']){
 const ir=read(code.toUpperCase()+'_IR.json'),ds=read(code.toUpperCase()+'_NODE_DESIGN.json').nodes,compiled=compileIR(ir);if(compiled.irHash!==approval.blockHashes[code])throw Error('IR mismatch');let serial=0;
 const prose=s=>s.split(/(\$[^$]+\$|\*\*[^*]+\*\*)/).filter(Boolean).map(t=>{const semanticId=code+'-d-'+(++serial);return t.startsWith('$')?{type:'math',latex:t.slice(1,-1),semanticId}:t.startsWith('**')?{type:'term',text:t.slice(2,-2),usage:'first_definition',semanticId}:{type:'text',text:t,semanticId};});
 function choiceParts(c){
  const normalized=c.rows.map(r=>r.parts.map(p=>p.kind==='math'?{...p,latex:p.latex.replaceAll('\\\\','\\')}:p));
  if(normalized.some(row=>row.some(p=>p.kind==='math'&&/^\\text\{[^{}]+\}$/.test(p.latex))))return normalized.flatMap(row=>row.map(p=>{const text=p.kind==='math'?p.latex.match(/^\\text\{([^{}]+)\}$/):null;return text?{type:'text',text:text[1],optionRow:true,semanticId:code+'-option-'+(++serial)}:p.kind==='math'?{type:'math',latex:p.latex,optionRow:true,semanticId:code+'-option-'+(++serial)}:{type:'text',text:p.text,optionRow:true,semanticId:code+'-option-'+(++serial)};}));
  if(c.rows.every(r=>r.parts.every(p=>p.kind==='math'))){const rows=c.rows.flatMap(r=>r.parts.map(p=>p.latex.replaceAll('\\\\','\\')).join('').split(/\\quad\s*\\text\{または\}\\quad\s*/).flatMap((t,i)=>i?['\\text{または}',t]:[t])).flatMap(independentFunctionRows);if(rows.length===1)return [{type:'math',latex:rows[0],semanticId:code+'-option-'+(++serial)}];
   const aligned=rows.map(s=>{const r=splitRelation(s);return r?r[0]+'&'+r[1]+r[2]:'&'+s;});return [{type:'math',latex:'\\begin{aligned}'+aligned.join('\\\\')+'\\end{aligned}',semanticId:code+'-option-'+(++serial)}];}
  return c.rows.flatMap(r=>r.parts.map(p=>p.kind==='math'?{type:'math',latex:p.latex,semanticId:code+'-option-'+(++serial)}:{type:'text',text:p.text,semanticId:code+'-option-'+(++serial)}));
 }
 // Several independent statements are one displayed result group with one end number.
 for(const node of compiled.nodes){const formulas=node.after.filter(b=>b.type==='formula');if(formulas.length>1&&formulas.every(b=>b.derivationId===formulas[0].derivationId)){
  const sources=formulas.map(b=>b.parts.map(p=>p.type==='math'?p.latex:'').join(''));const rows=sources.map(t=>{const r=splitRelation(t);return r?r[0]+'&'+r[1]+r[2]:'&'+t;});
  const merged={id:formulas[0].derivationId,type:'formula',derivationId:formulas[0].derivationId,parts:[{type:'math',latex:'\\begin{aligned}'+rows.join('\\\\')+'\\end{aligned}',semanticId:node.id+'-aligned-result'}]};
  const first=node.after.indexOf(formulas[0]);node.after=node.after.filter(b=>!formulas.includes(b));node.after.splice(first,0,merged);
 }}
 // Comma-separated function evaluations are independent results, not a single equality chain.
 for(const node of compiled.nodes)for(const block of node.after.filter(b=>b.type==='formula'&&b.parts.every(p=>p.type==='math'))){
  const rows=independentFunctionRows(block.parts.map(p=>p.latex).join('').replaceAll('\\\\','\\'));
  if(rows.length>1)block.parts=[{type:'math',latex:'\\begin{aligned}'+rows.map(s=>{const r=splitRelation(s);return r?r[0]+'&'+r[1]+r[2]:'&'+s;}).join('\\\\')+'\\end{aligned}',semanticId:node.id+'-independent-results'}];
 }
 const semanticDisplay={},old=read('evidence/'+code.toUpperCase()+'_CURRENT.json').unit;const olditems=new Map(old.sections[0].items.map(i=>[i.id,i]));
 const items=ds.filter(n=>n.itemId).map((n,i)=>{const q=ir.nodes.find(x=>x.id===n.id).interaction,cfg=spec.unitChoices[code].find(x=>x.itemId===q.id);semanticDisplay[n.id]={hintParts:q.hints.map(prose),choices:Object.fromEntries(cfg.choices.map(c=>[c.canonicalKey,choiceParts(c)])),feedback:Object.fromEntries(q.choices.map(c=>[c.content,prose(c.feedback)]))};return {...(olditems.get(q.id)||{}),id:q.id,label:q.id.toUpperCase(),prompt:n.goal,answer:q.expected.value,acceptedAnswers:olditems.get(q.id)?.acceptedAnswers||[],answerType:q.expected.form==='text'?'text':'formula',choices:q.choices.map(c=>c.content),purpose:'causal-reasoning',scaffoldLevel:i<3?'strong':i<25?'medium':'light',hints:q.hints};});
 const gates={n11:{'n11-intro':'n11-f01','n11-10':'n11-f02'},n12:{'n12-02':'n12-f01','n12-06':'n12-f02','n12-15':'n12-f03'}};
 const nodes=ds.map(n=>({id:n.id,stageId:n.stageId,q:n.q,goal:n.goal,role:n.role,knownRefs:n.knownRefs,resultId:n.resultId,interaction:n.itemId,extra:gates[code]?.[n.id]?{figure:{id:gates[code][n.id]}}:{}}));
 const stages=titles[code].map((title,i)=>({id:code+'-stage-'+String(i+1).padStart(2,'0'),title,q:i+1,sourceQuestionParts:prose(sourceQuestion(code,i+1))}));let n=0;const equationNumbers={};for(const node of compiled.nodes){const formulas=[...node.before,...node.after].filter(b=>b.type==='formula');if(formulas.length){n++;for(const b of formulas)equationNumbers[b.id]=n;}}
 const revisions={ne02:2,n11:11,n12:4};const unit={...old,revision:revisions[code],sections:[{...old.sections[0],readingFlow:compiled.nodes.flatMap(n=>[...n.before,...n.after]),items}]};const artifact={schemaVersion:'guided-math-presentation/1',choiceDisplay:'semantic',code,approvedCommit:approval.approvedCommit,proposalHash:approval.proposalHash,irHash:compiled.irHash,unit,nodes,stages,semantic:compiled,semanticDisplay,equationNumbers};const raw=JSON.stringify(artifact,null,2)+'\n';
 if(checkMode){
  if(raw!==historicalRaw[code])throw Error('Historical generated source drift '+code);
  if(code==='ne02'&&fs.readFileSync('src/data/textbook/math/numbers/ne02Authored.json','utf8')!==raw)throw Error('Generated source drift ne02');
 }else fs.writeFileSync(base+'MATERIALIZED_'+code.toUpperCase()+'.json',raw);
 console.log(JSON.stringify({code,nodes:nodes.length,items:items.length,stages:stages.length,irHash:compiled.irHash}));
}

// Current W047 is a distinct exact accepted edition, never a replacement for W036 proof.
if(checkMode){
 const baseline='929f3c5677758b55bcc583b84a6166b92a600f10';
 if(process.env.BASELINE_REF&&process.env.BASELINE_REF!==baseline)throw Error('W036 current baseline mismatch');
 const fixedInputs={"work/items/W-MATH-047-n1112-guided-review/APPROVAL.json":"2a5f4faabb9b60e711fa01e3cb683905cc74395b857a66de9e385a74c34455dd","work/items/W-MATH-047-n1112-guided-review/verify_current.mjs":"7ca1a5b211a5e56cf0c699fa7cb55ba1d04b87e165d429cb34bc812e58cd9079","work/items/W-MATH-047-n1112-guided-review/verify_r1_projection.mjs":"adf899f12de8314f88ae53af01e9c4fbd5bf44ea5026bebdbdb9e9d966f5f67a","work/items/W-MATH-047-n1112-guided-review/MATERIALIZED_N11.json":"3465df01e4d764a6aae14742b370804494450055205c968685715c9157cb10fe","work/items/W-MATH-047-n1112-guided-review/MATERIALIZED_N12.json":"8ba070624e1e34804e836e652f049298a91625eadbf91881371fd354a5f74f7c","work/items/W-MATH-047-n1112-guided-review/evidence/N11_G2_CORRECTION_DRAFT_PLAN.json":"a3f9b71b1c7776f4d86dcebd970d7874b095218bc92cb7b40fee97b7f6231282","work/items/W-MATH-047-n1112-guided-review/evidence/R1_COMPILED.json":"906c4fef2e53a9a992fae5f82e7a7255a504215eeee19954f179d2fa902707a9","work/items/W-MATH-047-n1112-guided-review/evidence/S1_N12_APPLIED.json":"86bca3590d501cac5215aa7c301087fd96ae714f784de1a845b94979624463c9"};
 for(const [p,h]of Object.entries(fixedInputs))if(hash(fs.readFileSync(p))!==h)throw Error('Frozen W047 proof drift '+p);
 const authoredHashes={"n11":"3465df01e4d764a6aae14742b370804494450055205c968685715c9157cb10fe","n12":"8ba070624e1e34804e836e652f049298a91625eadbf91881371fd354a5f74f7c"};
 for(const [code,h]of Object.entries(authoredHashes))if(hash(fs.readFileSync('src/data/textbook/math/numbers/'+code+'Authored.json'))!==h)throw Error('Current accepted source drift '+code);
 const currentIRHashes={"n11":"3a1fd6ceb816c676edeb2bdcd9bf7e529fc2b6718da2d5810e5fe0087d591423","n12":"7dfc39c14fee60a12ce6bea4bbb4ff56d6fe054288547c6e318e3e012dff95cb"};
 for(const [code,h]of Object.entries(currentIRHashes)){
  const raw=fs.readFileSync('work/items/W-MATH-047-n1112-guided-review/'+code.toUpperCase()+'_CANDIDATE_IR.json');
  if(hash(raw)!==h)throw Error('Frozen W047 IR drift '+code);
  const current=JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/'+code+'Authored.json','utf8'));
  if(compileIR(JSON.parse(raw.toString('utf8'))).irHash!==current.irHash)throw Error('Current W047 IR compile drift '+code);
 }
 const baselineHashes={"src/data/textbook/math/numbers/n11Authored.json":"ae3823163ac23bb334ac02a6c868bbd1273b8b6f1f65c77cde6f751773900a74","src/data/textbook/math/numbers/n12Authored.json":"bd7e9942376589e822bc3028954867997167bf4f44e3cb5fc9b7aea90b8af97a"};
 for(const [p,h]of Object.entries(baselineHashes))if(hash(execFileSync('git',['show',baseline+':'+p]))!==h)throw Error('Frozen W047 baseline drift '+p);
 const evidence=fs.mkdtempSync(join(tmpdir(),'w036-current-proof-'));
 try{
  const proof=JSON.parse(execFileSync(process.execPath,['work/items/W-MATH-047-n1112-guided-review/verify_current.mjs'],{encoding:'utf8',env:{...process.env,BASELINE_REF:baseline,EVIDENCE_DIR:evidence}}));
  if(proof.status!=='PASS'||proof.rows.length!==2||!['n11','n12'].every(code=>proof.rows.filter(row=>row.code===code&&row.mode==='APPROVED').length===1))throw Error('Current W047 approved rows required');
 }finally{fs.rmSync(evidence,{recursive:true,force:true});}
}
