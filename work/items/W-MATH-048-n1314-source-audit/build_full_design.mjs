/** Review-only full-copy IR -> existing compiler -> explicit physical-row projection.
 * No production file, shared validator, grading key, or reader is modified here.
 */
import fs from 'node:fs';
import path from 'node:path';
import{fileURLToPath}from'node:url';
import assert from 'node:assert/strict';
import katex from 'katex';
import{validateIR,compileIR,visibleSnapshot}from'../../../tools/textbook/ir/index.mjs';
import{sourceCoverage}from'../../../tools/textbook/source/coverage.mjs';
import{hash}from'../../../tools/textbook/util.mjs';
const B=path.dirname(fileURLToPath(import.meta.url));
const read=p=>JSON.parse(fs.readFileSync(path.join(B,p),'utf8'));
const write=(p,x)=>fs.writeFileSync(path.join(B,p),JSON.stringify(x,null,2)+'\n');
const audits=read('evidence/SOURCE_AUDIT_B.json').units;
const additions=read('ADDED_DECISIONS.json');
const results=[];
for(const code of ['n13','n14']){
 const upper=code.toUpperCase(),source=read('evidence/'+upper+'_SOURCE_INDEX.json');
 const sourceAudit=audits.find(u=>u.code===upper),unit=read(upper+'_CANDIDATE.json').unit;
 const section=unit.sections[0],byItem=new Map(section.items.map(i=>[i.id,i]));
 const sourceFor=new Map();
 for(const r of sourceAudit.originalBlocks)for(const b of r.currentBlockIds){if(!sourceFor.has(b))sourceFor.set(b,[]);sourceFor.get(b).push(r.sourceId);}
 const qSources=new Map(sourceAudit.items.map(i=>[i.originalQuestion,i.sourceId]));
 for(const a of additions.filter(a=>a.unit===code))for(const tail of ['-lead','-formula','-after'])sourceFor.set(a.id+tail,[qSources.get(upper+'-Q'+String(a.q).padStart(2,'0'))]);
 if(code==='n13'){
  sourceFor.set('n13-marker-2',['word-p-000570']);
  sourceFor.set('n13-w048-positive-distance-property',['word-p-000563']);
  sourceFor.set('n13-lead-09',['word-p-000584','word-p-000585','word-p-000586']);
 }else{
  sourceFor.set('n14-heading-3',['word-p-000612','word-p-000613']);
  sourceFor.set('n14-w048-check-marker',['word-p-000618']);
  sourceFor.set('n14-marker-3',['word-p-000613']);
  sourceFor.set('n14-w048-chapter-summary',['word-p-000630','word-p-000631','word-p-000632']);
  sourceFor.set('n14-w048-next-chapter-bridge',['word-p-000633']);
 }
 const nodes=[],rows=[],tokens=[],problems=[];let serial=0,prior=null;
 const tag=()=>code+'-ir-part-'+(++serial);
 const part=p=>{
  const id=tag();if(p.type==='math')return{kind:'math',id,latex:p.latex,mathRole:'expression',semanticRef:id};
  if(p.type==='term')return{kind:'term',id,termId:id,text:p.text,usage:p.usage??'ordinary'};
  return{kind:'text',id,text:p.text};
 };
 const converted=p=>{const id=tag();return p.answerType==='formula'?{kind:'math',id,latex:p.answer,mathRole:'standalone-answer',semanticRef:id}:{kind:'text',id,text:p.answer};};
 const makeBlock=(id,type,parts,numberId)=>type==='formula'?{id,kind:'relationChain',relation:'independent',expressions:[{id:id+'-expression',parts}],operators:[],layoutProfile:'single',numbering:{stableId:numberId,mode:'group-end'}}:{id,kind:'paragraph',parts};
 const orderedInteractions=section.readingFlow.flatMap(b=>(b.parts??[]).filter(p=>p.type==='choice').map(p=>p.itemId));
 for(const block of section.readingFlow){
  const marker=/(?:lead-|after-|formula-|q)(\d{2})(?:-|$)/.exec(block.id)?.[1];
  const linkedExplanation=marker?qSources.get(upper+'-Q'+marker):null;
  const src=[...new Set(sourceFor.get(block.id)??(linkedExplanation?[linkedExplanation]:[]))];assert(src.length,'Unmapped physical block '+block.id);assert(src.every(s=>source.blocks.some(b=>b.id===s)));
  const metadata=!['formula','paragraph'].includes(block.type);
  const nativeParts=metadata?[{type:'text',text:block.type==='figure'?section.figures.find(f=>f.id===block.figureId).caption:block.text}]:block.parts;
  assert(nativeParts?.length,'Missing whole copy '+block.id);
  const choices=nativeParts.filter(p=>p.type==='choice');const owners=[];
  for(let index=0;index<Math.max(1,choices.length);index++){
   const current=choices[index]?.itemId,q=current?byItem.get(current):null;
   const id=current??block.id+'-whole-copy';const bid=id+'-before',slotId=current?current+'-slot':null;
   const atomParts=nativeParts.map(p=>{
    if(p.type!=='choice')return part(p);
    if(p.itemId===current)return{kind:'answerSlot',id:slotId,interactionId:current,semanticRef:current};
    return{kind:'ref',id:tag(),targetId:p.itemId,label:orderedInteractions.indexOf(p.itemId)<orderedInteractions.indexOf(current)?'直前の独立した回答欄':'後で判断する独立した回答欄'};
   });
   const before=makeBlock(bid,block.type,atomParts,block.id);
   const requires=prior?[prior]:['accepted-absolute-distance','accepted-order-rules'];
   const node={id,problemId:code,sourceRefs:src,requires,produces:[id+'-result'],role:current?'substep':block.type==='marker'&&block.kind==='proof'?'proof':'property',goal:q?.prompt??(block.text??block.id),purpose:q?.prompt??'原資料の本文・条件・役割・図の位置を保持する',operation:{kind:current?(additions.find(a=>a.id===current)?.action??'selection'):'read-source',targets:src,nextUseIds:[]},before:[before],after:[],contextNeed:[]};
   if(q){
    node.interaction={id:current,targetPath:'interaction.expected.value',learningAction:additions.find(a=>a.id===current)?.action??'selection',whyHere:q.prompt,prerequisiteIds:requires,expected:{value:q.answer,form:q.answerType,semanticType:'source-preserved-decision'},choices:q.choices.map((content,i)=>({id:current+'-choice-'+i,content,feedback:content===q.answer?'確定した結果を同じ論理行と元の問いへ戻します。':q.hints[0]??'元の条件と操作対象を確かめます。',...(content===q.answer?{}:{misconception:'符号・境界・対象・条件の取り違え。元の問いと照合する。'})})),hints:q.hints,answerInsertion:{blockId:bid,slotId}};
    const afterParts=nativeParts.flatMap(p=>p.type==='choice'?(p.itemId===current?(q.id==='n13-09'?[part({type:'text',text:'0なら'}),part({type:'math',latex:'x=0'}),part({type:'text',text:'、負なら実数解なし'})]:[converted(q)]):[{kind:'ref',id:tag(),targetId:p.itemId,label:'同じ論理行の別の独立した回答欄'}]):[part(p)]);
    node.after=[makeBlock(id+'-after',block.type,afterParts,block.id)];
   }else node.noBlankReason=metadata?'出典の見出し・役割・図の位置。新しい採点判断を加えず既存表示へ戻す。':'既知の条件、目的、回答後の根拠、次への接続を伝える本文。穴は直後の独立した判断へ置く。';
   nodes.push(node);prior=id+'-result';owners.push({nodeId:id,beforeBlockId:bid,compiledBlockId:before.kind==='relationChain'?bid+'-0':bid,itemId:current??null,slotId});
  }
  const shape=Object.fromEntries(Object.entries(block).filter(([k])=>k!=='parts'&&k!=='text'));
  rows.push({id:block.id,shape,metadata,textField:metadata&&block.type!=='figure'?'text':null,owners,partCount:nativeParts.length,sourceRefs:src});
 }
 const coverage=source.blocks.map(b=>{const nodeIds=nodes.filter(n=>n.sourceRefs.includes(b.id)).map(n=>n.id);return{sourceId:b.id,nodeIds,disposition:nodeIds.length?'taught':'structural',reason:nodeIds.length?'原条件・本文・式・原図・役割の位置を全文IRと物理rowへ対応':'節境界等の原資料構造。次単元の内容を勝手に現在単元へ追加しない。'};});
 const ir={schemaVersion:'production-ir/1',unitId:unit.unitId,subject:'math',mode:'textbook',sourceHash:source.documentHash,sourceBlocks:source.blocks.map(b=>({id:b.id,kind:b.kind})),coverage,initialFacts:['accepted-absolute-distance','accepted-order-rules'],nodes};
 const check=validateIR(ir);write('evidence/'+upper+'_FULL_IR_CHECK.json',check);assert.equal(check.status,'PASS',JSON.stringify(check.findings));
 // These copied legacy plain-text expressions are reviewed explicitly. They are
 // not suppressed globally and do not certify typography in the future DOM.
 const warningResolutions=check.findings.filter(f=>f.severity==='WARN').map(f=>({findingId:f.id,evidence:{rule:f.ruleId,exactText:f.detail,nodeId:f.nodeId,sourceSHA:read('evidence/'+upper+'_CURRENT.json').sourceSHA,reason:'Exact full-copy preservation, unlike the old prompt-only projection. Candidate source uses legacy plain text here; inline math normalization and root-font QA are explicit display obligations, not a claim of completed UI verification.'}}));
 const compiled=compileIR(ir,{warningResolutions});
 const convertedPart=p=>p.type==='math'?{type:'math',latex:p.latex}:p.type==='choice'?{type:'choice',itemId:p.itemId}:p.type==='term'?{type:'term',text:p.text,...(p.usage==='ordinary'?{}:{usage:p.usage})}:{type:'text',text:p.text};
 const reconstructed=structuredClone(unit);const rendered=compiled.nodes.flatMap(n=>n.before);const byBlock=new Map(rendered.map(b=>[b.id,b]));
 const compiledItems=new Map(compiled.nodes.filter(n=>n.interaction).map(n=>[n.interaction.id,n.interaction]));
 reconstructed.sections[0].items=section.items.map(old=>{const q=compiledItems.get(old.id);assert(q);const {prompt,answer,choices,hints,...metadata}=old;return{...metadata,prompt:q.whyHere,answer:q.expected.value,choices:q.choices.map(c=>c.content),hints:q.hints};});
 reconstructed.sections[0].readingFlow=rows.map(row=>{
  const first=byBlock.get(row.owners[0].compiledBlockId);assert(first);
  if(row.metadata){if(row.textField)return{...row.shape,[row.textField]:first.parts.map(p=>p.text??'').join('')};return{...row.shape};}
  const parts=first.parts.map((p,index)=>{
   const owner=row.owners.find(o=>o.itemId&&byBlock.get(o.compiledBlockId).parts[index].type==='choice');
   if(owner)return convertedPart(byBlock.get(owner.compiledBlockId).parts[index]);
   assert.notEqual(p.type,'ref');return convertedPart(p);
  });
  return{...row.shape,parts};
 });
 assert.deepEqual(reconstructed,unit,'Compiled full-copy physical-row reconstruction must be lossless');
 const boundItemIds=rows.flatMap(r=>r.owners.flatMap(o=>o.itemId?[o.itemId]:[]));assert.equal(new Set(boundItemIds).size,section.items.length);assert.deepEqual(boundItemIds,orderedInteractions);
 const actualCoverage=sourceCoverage(ir.sourceBlocks,coverage,nodes);assert.equal(actualCoverage.status,'PASS');
 const equationNumbers={};let num=0;const logicalGroups=[];let current=[];
 const flush=()=>{if(!current.length)return;const last=current.at(-1);equationNumbers[last.id]=++num;logicalGroups.push({number:num,rowIds:current.map(b=>b.id),numberedRowId:last.id,reason:'同じderivationIdの一続きの導出は最後の物理行だけに一つの番号を置く。'});current=[];};
 let lastChain;
 for(const b of section.readingFlow){if(b.type!=='formula'){if(!b.derivationId||b.derivationId!==lastChain){flush();lastChain=undefined;}continue;}const chain=b.derivationId??b.id;if(chain!==lastChain){flush();lastChain=chain;}current.push(b);}
 flush();
 const projection={schemaVersion:'w048-physical-row-projection/1',unitId:unit.unitId,revision:unit.revision,irHash:compiled.irHash,unitShell:Object.fromEntries(Object.entries(unit).filter(([k])=>k!=='sections')),sectionShell:Object.fromEntries(Object.entries(section).filter(([k])=>k!=='readingFlow'&&k!=='items')),rows,itemContracts:section.items,logicalGroups,equationNumbers,referenceLabelsAreNotStudentCopy:true,mechanicalProjectionOnly:true};
 const snapshots=ir.nodes.map((n,i)=>visibleSnapshot(ir,n.id,ir.nodes.slice(0,i).map(n=>n.id)));
 write(upper+'_FULL_IR.json',ir);write(upper+'_ROW_PROJECTION.json',projection);write(upper+'_FULL_COMPILED.json',compiled);write(upper+'_MATERIALIZED_CANDIDATE.json',{unit:reconstructed,equationNumbers});
 write('evidence/'+upper+'_FULL_VISIBLE_INDEX.json',{status:'PASS_REPRODUCIBLE_STRUCTURAL_SNAPSHOTS_ONLY',generator:'existing visibleSnapshot(ir,nodeId,all-prior-nodeIds)',irHash:compiled.irHash,views:snapshots.map(s=>({nodeId:s.nodeId,sha256:hash(s),nodes:s.nodes.length}))});
 const transient=path.join(B,'evidence/'+upper+'_FULL_VISIBLE_SNAPSHOTS.json');if(fs.existsSync(transient))fs.unlinkSync(transient);
 write('evidence/'+upper+'_FULL_WARNING_RESOLUTIONS.json',warningResolutions);
 const report={unit:code,status:'PASS_FULL_COPY_ROUNDTRIP',irHash:compiled.irHash,planHash:hash(projection),sourceBlocks:source.blocks.length,taughtSourceBlocks:coverage.filter(c=>c.disposition==='taught').length,structuralSourceBlocks:coverage.filter(c=>c.disposition==='structural').map(c=>c.sourceId),nodes:nodes.length,interactions:boundItemIds.length,physicalBlocks:rows.length,multiSlotRows:rows.filter(r=>r.owners.length>1).map(r=>({row:r.id,items:r.owners.map(o=>o.itemId)})),warningIds:warningResolutions.map(w=>w.findingId),roundTripExact:true,diagnosticProjectionUsed:false,liveUI:false};
 results.push(report);
}
write('evidence/FULL_DESIGN_CHECK.json',{status:'PASS_FULL_COPY_AND_PROJECTION',units:results,limits:['All source/candidate copy and physical independent slots are reconstructed from actual compileIR output.','This Work-scoped projection is not a new shared renderer or a UI/teaching acceptance result.','Metadata/figure placements remain explicit in row projection; figure bytes are separate source-bound inputs.']});
console.log(JSON.stringify(results));
