/** Proposal prototype, using exact current reader functions and real baseline migration. */
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import ts from 'typescript';import{createServer}from'vite';import{fileURLToPath}from'node:url';
import{hash}from'../../../tools/textbook/util.mjs';
const B=path.dirname(fileURLToPath(import.meta.url)),R=path.resolve(B,'../../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(B,p),'utf8')),write=(p,x)=>fs.writeFileSync(path.join(B,p),JSON.stringify(x,null,2)+'\n');
const page=fs.readFileSync(path.join(R,'src/pages/TextbookUnitPage.tsx'),'utf8');
const ast=ts.createSourceFile('page.tsx',page,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const functions={},variables={};function visit(node){if(ts.isFunctionDeclaration(node)&&node.name)functions[node.name.text]=node.getText(ast);if(ts.isVariableDeclaration(node)&&ts.isIdentifier(node.name)&&['visibleBlocksInGroup','firstIncompleteGroup','visibleGroupCount','visibleGroups'].includes(node.name.text))variables[node.name.text]=node.getText(ast);ts.forEachChild(node,visit);}visit(ast);
const extracted=[functions.readingGroupItemIds,functions.groupReadingFlow].join('\n');
const script=extracted+'\nexport function inspect(unit,progress,isTextbookItemResolved){const section=unit.sections[0];const currentProgress=progress?.unitRevision===unit.revision?progress:undefined;const groups=groupReadingFlow(section.readingFlow);'+['firstIncompleteGroup','visibleGroupCount','visibleGroups','visibleBlocksInGroup'].map(k=>'const '+variables[k]+';').join('\n')+'return visibleGroups.flatMap(g=>visibleBlocksInGroup(g));}';
const js=ts.transpileModule(script,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {inspect}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const server=await createServer({configFile:false,server:{middlewareMode:true},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
const report=[],packets=[];
try{
 const {effectiveTextbookProgress,isTextbookItemResolved}=await server.ssrLoadModule('/src/domain/textbook.ts');
 function migrateProposal(oldUnit,newUnit,progress){
  if(!progress)return undefined;
  const previous=effectiveTextbookProgress(oldUnit,progress);if(!previous)return undefined;
  const {archivedRevisions,...archive}=previous,ids=new Set(oldUnit.sections[0].items.map(i=>i.id));
  return{unitId:newUnit.unitId,unitRevision:newUnit.revision,startedAt:previous.startedAt,updatedAt:previous.updatedAt,answers:Object.fromEntries(Object.entries(previous.answers).filter(([id])=>ids.has(id))),archivedRevisions:{...archivedRevisions,[String(oldUnit.revision)]:archive},migratedFromRevision:oldUnit.revision,...(previous.completedAt!==undefined?{previousRevisionCompletedAt:previous.completedAt}:previous.previousRevisionCompletedAt!==undefined?{previousRevisionCompletedAt:previous.previousRevisionCompletedAt}:{})};
 }
 const rec=(q,value=q.answer)=>({itemId:q.id,value,isFirstCorrect:value===q.answer,resolved:value===q.answer,attemptCount:1,firstAnsweredAt:1,lastAnsweredAt:1});
 const allStates=[];
 for(const code of ['N13','N14']){
  const old=read('evidence/'+code+'_CURRENT.json').unit,unit=read(code+'_MATERIALIZED_CANDIDATE.json').unit,section=unit.sections[0],ordered=section.readingFlow.flatMap(b=>(b.parts??[]).filter(p=>p.type==='choice').map(p=>p.itemId)),by=new Map(section.items.map(i=>[i.id,i]));
  const baseline={unitId:old.unitId,unitRevision:old.revision,startedAt:1,updatedAt:2,answers:{}};
  const progress=answers=>({...baseline,unitRevision:unit.revision,answers});
  const views=[];const nodeIds=(blocks)=>blocks.map(b=>b.id);
  for(let i=0;i<ordered.length;i++){
   const answers=Object.fromEntries(ordered.slice(0,i).map(id=>[id,rec(by.get(id))]));const q=by.get(ordered[i]);
   const before=inspect(unit,progress(answers),isTextbookItemResolved);const row=before.at(-1);assert(row.parts?.some(p=>p.type==='choice'&&p.itemId===q.id));
   for(const choice of q.choices.filter(v=>v!==q.answer))assert.deepEqual(nodeIds(inspect(unit,progress({...answers,[q.id]:rec(q,choice)}),isTextbookItemResolved)),nodeIds(before));
   const future=new Set(ordered.slice(i+1));for(const b of before.slice(0,-1))for(const p of b.parts??[])if(p.type==='choice')assert(!future.has(p.itemId),'Future row exposed');
   views.push({current:q.id,visibleBlockIds:nodeIds(before),openChoices:q.choices,hints:q.hints,meaning:'These are proposed current consumer states, not actual DOM screenshots.'});
  }
  const oldComplete={...baseline,completedAt:2,answers:Object.fromEntries(old.sections[0].items.map(q=>[q.id,rec(q)]))};
  const migrated=migrateProposal(old,unit,oldComplete);assert.deepEqual(migrated.answers,oldComplete.answers);assert(!('completedAt'in migrated));assert.equal(migrated.previousRevisionCompletedAt,2);
  const added=section.items.filter(q=>!old.sections[0].items.some(i=>i.id===q.id));for(const q of added)assert(!migrated.answers[q.id]);
  const migratedVisible=inspect(unit,migrated,isTextbookItemResolved);assert(migratedVisible.at(-1).parts.some(p=>p.type==='choice'&&p.itemId===added[0].id));
  let masks=0;
  for(const row of section.readingFlow){const ids=(row.parts??[]).filter(p=>p.type==='choice').map(p=>p.itemId);if(ids.length<2)continue;const at=ordered.indexOf(ids[0]);for(let mask=0;mask<2**ids.length;mask++){const answers=Object.fromEntries(ordered.slice(0,at).map(id=>[id,rec(by.get(id))]));ids.forEach((id,i)=>{if(mask&(1<<i))answers[id]=rec(by.get(id));});const visible=inspect(unit,progress(answers),isTextbookItemResolved);assert(visible.some(b=>b.id===row.id));if(mask<2**ids.length-1)assert.equal(visible.at(-1).id,row.id);masks++;}}
  const full=inspect(unit,progress(Object.fromEntries(section.items.map(q=>[q.id,rec(q)]))),isTextbookItemResolved);assert.equal(full.length,section.readingFlow.length);
  const packet={schemaVersion:'w048-learner-state-review/1',unit:code,baseSourceSHA:'f129ba78e496f0ccbce917c762357a81b92b0a2c',proposedRevision:unit.revision,fullCopy:section.readingFlow,figures:section.figures,views,oldCompleteResume:{firstNewItem:added[0].id,visibleBlockIds:nodeIds(migratedVisible)},labels:'Design-only learner copy and option/hint states; not app, CI, actual geometry, migration implementation, or human acceptance.'};
  write(code+'_LEARNER_REVIEW.json',packet);packets.push({unit:code,learnerCopyHash:hash(packet)});
  report.push({unit:code,status:'PASS_DESIGN_CONSUMER_PROTOTYPE',correctSteps:ordered.length,wrongChoices:section.items.reduce((n,q)=>n+q.choices.length-1,0),allPartialMultiSlotMasks:masks,oldCurrentRevisionCompletePreserved:true,firstNewItem:added[0].id,allNewUnanswered:true,futureRowsWithheld:true,oldBaselineMigrationUsed:true,productMigrationImplemented:false,actualDOM:false});
 }
 write('evidence/DESIGN_STATE_CHECK.json',{status:'PASS_DESIGN_PROTOTYPE_ONLY',readerSourceSHA256:hash(page),exactExtractedFunctionNames:['groupReadingFlow','readingGroupItemIds','visibleBlocksInGroup','firstIncompleteGroup','visibleGroupCount','visibleGroups'],implementationHash:hash(script),cases:report,packets,prototypeMigrationSource:migrateProposal.toString(),limits:['Baseline effectiveTextbookProgress/isTextbookItemResolved and exact reader declarations were executed read-only.','Migration prototype is a proposed algorithm, not a patch to src/domain/textbook.ts.','Existing older revision migrations, real DOM/history/reset/font/axis geometry and frozen-source hosted checks remain implementation gates.']});
 console.log(JSON.stringify(report));
}finally{await server.close();}
