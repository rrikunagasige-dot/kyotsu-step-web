/** Approved W-MATH-032 design -> strict IR -> existing compiled blocks -> N07 adapter.
 * Pure generation; caller controls exact approval and file writes.
 */
import { validateIR, compileIR } from './ir/index.mjs';
import { hash, invariant } from './util.mjs';
const scopes={1:'division',2:'division',3:'division',4:'division',5:'remainder-property',6:'repeat-eight',7:'repeat-eight',8:'repeat-eight',9:'repeat-sixty-nine',10:'repeat-sixty-nine',11:'denominator',12:'denominator',13:'natural-counterexample',14:'real-numbers'};
const question={division:'割り算を続け、3/4と23/11の小数の表れ方を比べます。','remainder-property':'有理数を小数で表すと、有限小数か循環小数になる理由を考えます。','repeat-eight':'0.888…を整数どうしの比で表します。','repeat-sixty-nine':'0.696969…を既約分数で表します。',denominator:'2≤a≤20の整数aについて、1/aが有限小数になるものをすべて求めます。','natural-counterexample':'自然数a=2、b=3を使い、差と商が自然数になるか調べます。','real-numbers':'整数の比で表せる数と、表せない数を区別します。'};
export function repairN07(legacy, design, originalPlan, sourceIndex) {
 invariant(legacy.unit.unitId==='math-numbers-expressions-n07','N07 only');
 invariant(JSON.stringify(legacy.nodes.map(n=>n.id))===JSON.stringify(design.nodes.map(n=>n.id)),'node identity/order changed');
 const math=(id,latex)=>({kind:'math',id,latex,mathRole:'expression',semanticRef:id});
 const text=(id,value)=>({kind:'text',id,text:value});
 const clean=parts=>parts.map(({sourceText,...p})=>p.kind==='math'?{...p,mathRole:'expression',semanticRef:p.id}:p);
 const paragraph=(id,parts)=>({id,kind:'paragraph',parts});
 const formula=(id,parts,stableId=id)=>({id,kind:'relationChain',relation:'independent',expressions:[{id:id+'-expression',parts}],operators:[],layoutProfile:'single',numbering:{stableId,mode:'group-end'}});
 const aliases={}, sidecars={}, nodes=[];
 for(let index=0;index<legacy.nodes.length;index++){
  const old=legacy.nodes[index], d=design.nodes[index],id=old.id,q=old.interaction;
  invariant(JSON.stringify(q??null)===JSON.stringify(d.interaction??null),'grading contract changed');
  const before=[paragraph(id+'-before',clean(d.beforeParts))],after=[paragraph(id+'-after',clean(d.afterParts))];
  const slot=q?{kind:'answerSlot',id:id+'-slot',interactionId:q.id,semanticRef:id+'-answer'}:null;
  let input=old.inputLatex, output=old.outputLatex, response;
  if(q){
   let prefix=q.prefixLatex??'',suffix=q.suffixLatex??'';
   if(['n07-q06-scale','n07-q09-scale'].includes(id)){
    response=paragraph(id+'-interaction',[text(id+'-scale-prefix','両辺を'),slot,text(id+'-scale-suffix','倍して、小数部分をそろえます。')]); output='';
   }else if(id.endsWith('-subtract')){
    response=paragraph(id+'-interaction',[text(id+'-operation-prefix','上の式から元の式を'),slot,text(id+'-operation-suffix','ことで、同じ小数部分を消します。')]);
   }else if(id==='n07-q12-include-five'){
    response=paragraph(id+'-interaction',[text(id+'-bound-prefix','条件を満たす最大の'),math(id+'-bound-variable','r'),text(id+'-bound-middle','は'),slot,text(id+'-bound-suffix','です。')]);
   }else{
    if(id==='n07-q02-remainder-0'){prefix='10-11\\times0=';input='';output='';}
    if(id==='n07-q02-remainder-1'){prefix='100-11\\times9=';input='';output='';}
    if(id.endsWith('-coefficient')){prefix=id.includes('q07')?'(10-1)x=':'(100-1)x=';suffix='x';input='';output='';}
    if(id==='n07-q10-reduce'){prefix='x=\\frac{69}{99}=';input='';output='';}
    const ps=[...(prefix?[math(id+'-response-prefix',prefix)]:[]),slot,...(suffix?[math(id+'-response-suffix',suffix)]:[])];
    response=q.answerType==='formula'?formula(id+'-interaction',ps):paragraph(id+'-interaction',ps);
    if(prefix&&input&&prefix.startsWith(input))input='';
    if((prefix+q.answer+suffix).replaceAll(' ','')===output.replaceAll(' ',''))output='';
    if(id.endsWith('-coefficient')||id==='n07-q10-reduce'||id.includes('-remainder-')){
     response.relation='equality';response.layoutProfile='aligned-transform';
    }
   }
  }
  if(response && (id.endsWith('-coefficient')||id==='n07-q10-reduce'||id.includes('-remainder-'))){
   let expressions;
   if(id==='n07-q10-reduce')expressions=[[math(id+'-chain-x','x')],[math(id+'-chain-unreduced','\\frac{69}{99}')],[slot]];
   else if(id.endsWith('-coefficient'))expressions=[[math(id+'-chain-input',old.inputLatex)],[slot,math(id+'-chain-variable','x')]];
   else expressions=[[math(id+'-chain-input',old.inputLatex)],[slot]];
   response={...response,expressions:expressions.map((parts,i)=>({id:id+'-chain-'+i,parts})),operators:expressions.slice(1).map(()=>'='),transformRef:old.operation};
  }
  if(input)before.push(formula(id+'-input',[math(id+'-input-math',input)]));
  if(response)before.push(response);
  if(id==='n07-q11-converse'){
   const proofParts=['\\frac{p}{2^u5^v}','\\frac{p\\cdot2^{h-u}5^{h-v}}{2^h5^h}','\\frac{p\\cdot2^{h-u}5^{h-v}}{10^h}'];
   before.push({id:id+'-transform',kind:'relationChain',relation:'equality',expressions:proofParts.map((latex,i)=>({id:id+'-proof-'+i,parts:[math(id+'-proof-math-'+i,latex)]})),operators:['=','='],transformRef:old.operation,layoutProfile:'aligned-transform',numbering:{stableId:id+'-transform',mode:'group-end'}}); output='';
  }
  if(output)after.push(formula(id+'-output',[math(id+'-output-math',output)]));
  const qn=Number(old.problemId.slice(-2)),scope=scopes[qn];
  const requires=[...new Set([...old.requires,...old.knownRefs])];
  const contextNeed=old.knownRefs.map((ref,i)=>({id:id+'-context-'+i,problemId:scope,factIds:[ref],reason:'前の確定結果を使って次の判断を行う',sourceQuestionRef:scope,...(id==='n07-q03-cycle'?{tableSelection:{tableId:'n07-q02-remainder-1',rows:[1,2],columns:[0,1,2,3]}}:{})}));
  nodes.push({id,problemId:scope,sourceRefs:old.sourceRefs,requires,produces:[...old.teachesBefore,...old.teachesAfter,old.resultId],role:['bridge','interpretation','reuse'].includes(old.role)?'summary':old.role,goal:old.goal,purpose:old.reason,operation:{kind:old.operation,targets:old.knownRefs,direction:old.operation.includes('subtract')?'upper-minus-original':undefined,nextUseIds:[]},before,after,...(q?{interaction:{id:q.id,targetPath:'interaction.expected.value',learningAction:q.answerType==='formula'?'calculation':'judgment',whyHere:q.reason,prerequisiteIds:requires,expected:{value:q.answer,form:q.answerType==='formula'?'formula':'text',semanticType:q.classification},choices:q.choices.map((c,i)=>({id:q.id+'-choice-'+i,content:c,...(c!==q.answer?{misconception:q.distractorReasons[c]}:{}),feedback:c===q.answer?'本文の結果へつなげます。':q.distractorReasons[c]})),hints:q.hints,answerInsertion:{blockId:response.id,slotId:slot.id}}}:{noBlankReason:'既存の定義・性質・証明・まとめを維持する。新しい穴は追加しない。'}),contextNeed});
  sidecars[id]={beforeId:id+'-before',afterId:id+'-after',sourceScope:scope,sourceQuestion:question[scope],choiceDisplayParts:Object.fromEntries(Object.entries(d.choiceDisplayParts).map(([k,v])=>[k,clean(v)])),hintDisplayParts:d.hintDisplayParts.map(clean),distractorDisplayParts:Object.fromEntries(Object.entries(d.distractorDisplayParts).map(([k,v])=>[k,clean(v)])),taskDomain:d.taskDomain??null};
 }
 const ir={schemaVersion:'production-ir/1',unitId:legacy.unit.unitId,subject:'math',mode:'textbook',sourceHash:originalPlan.sourceHash,sourceBlocks:sourceIndex.blocks.map(b=>({id:b.id,kind:b.kind})),coverage:originalPlan.coverage.map(c=>({...c,disposition:c.disposition==='next-unit-context'?'excluded':c.disposition})),initialFacts:originalPlan.initialConcepts,nodes};
 const check=validateIR(ir);invariant(check.status==='PASS',JSON.stringify(check.findings));
 const compiled=compileIR(ir);const readingFlow=compiled.nodes.flatMap(n=>[...n.before,...n.after]);
 const equationNumbers={};for(const b of readingFlow)if(b.type==='formula')equationNumbers[b.id]=Object.keys(equationNumbers).length+1;
 for(const old of legacy.nodes){
  const cn=compiled.nodes.find(n=>n.id===old.id);
  const first=cn.before.find(b=>b.type==='formula');const last=cn.after.find(b=>b.type==='formula')??cn.before.find(b=>b.id===old.id+'-interaction'&&b.type==='formula')??first;
  if(first)aliases[old.id+'-input']=first.id;
  if(last)aliases[old.id+'-output']=last.id;
 }
 const unit=structuredClone(legacy.unit);unit.sections[0].readingFlow=readingFlow;
 // This fingerprint excludes display-only prompt/hint annotations; the full items remain untouched.
 const grading=u=>hash(u.sections.flatMap(s=>s.items.map(({id,answer,acceptedAnswers,answerType,choices})=>({id,answer,acceptedAnswers,answerType,choices}))));
 invariant(grading(unit)===grading(legacy.unit),'grading fingerprint changed');
 return {ir,compiled,artifact:{...legacy,unit,equationNumbers,semantic:compiled,semanticDisplay:sidecars,equationAliases:aliases,repair:{work:'W-MATH-032',designHash:hash(design),irHash:hash(ir),gradingFingerprint:grading(unit)}}};
}
