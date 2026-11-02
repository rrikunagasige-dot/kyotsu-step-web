import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {buildNestedTransformationPlan} from '../transformation/nested-lesson.mjs';
import { operate } from '../operations.mjs';
import { buildNestedSnapshots } from '../transformation/nested-snapshots.mjs';
import { checkNestedRuns, nestedPublicLayoutState } from '../layout/nested-run-measurements.mjs';
const compiled = code => JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/' + code + 'ConstructionCompiled.json'));
for(const code of ['n09','n10'])test(code+' native blank and interaction planning must use nested parents without flat interactions',()=>{
 const c=compiled(code),sourceRaw=fs.readFileSync('src/data/textbook/math/numbers/'+code+'Authored.json','utf8'),ir=JSON.parse(sourceRaw);
 const assets=Object.fromEntries(ir.unit.sections.flatMap(s=>s.figures).map(f=>[f.src,createHash('sha256').update(fs.readFileSync('public'+f.src)).digest('hex')]));
 const plan=buildNestedTransformationPlan(sourceRaw,fs.readFileSync('work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json','utf8'),ir.unit.unitId,assets);
 for(const operation of ['blank-candidates','interaction-plan']){
  const result=operate(operation,{ir,transformationPlan:plan});
  assert.equal(result.status,'NEEDS_AI_REVIEW');assert.equal(result.automaticAcceptance,false);
  assert.deepEqual(result.candidates.map(p=>p.id),c.nodeDesign.flatMap(n=>n.parts.map(p=>p.id)));
  assert.equal(result.decisions.length,c.nodeDesign.filter(n=>n.parts.length).length);
  assert.ok(result.decisions.every(d=>d.decision==='REVIEW_REQUIRED'));
  assert.doesNotMatch(JSON.stringify(result.candidates),/"(?:expected|correctValue|feedback)":/);
 }
 const tampered=structuredClone(plan);tampered.nodeDesign[0].leadParts=[];
 assert.equal(operate('interaction-plan',{ir,transformationPlan:tampered}).status,'FAIL');
});
for (const code of ['n09','n10']) test(code + ' native novice snapshots use every real part and preserve the runtime frontier', () => {
  const c = compiled(code), result = buildNestedSnapshots(c), parts = c.nodeDesign.flatMap(n => n.parts);
  assert.equal(result.status, 'NEEDS_AI_REVIEW'); assert.equal(result.actualDOMMeasurements, false);
  assert.equal(result.coverage.parts, parts.length);
  for (const p of parts) {
    const states = result.snapshots.filter(s => s.partId === p.id);
    assert.equal(states.filter(s => s.state === 'initial').length, 1);
    assert.deepEqual(states.filter(s => s.state === 'wrong').map(s => s.selectedValue).sort(), p.choices.filter(c => c.value !== p.expected).map(c => c.value).sort());
    for (const s of states.filter(s => s.state !== 'filled')) assert.equal(s.visible.editable.partId, p.id);
    assert.notEqual(states.at(-1).visible.editable?.partId, p.id);
  }
  assert.equal(result.snapshots.at(-1).visible.completed, true);
  for (const s of result.snapshots) assert.doesNotMatch(JSON.stringify(s.visible), /"(?:expected|mathAssertion|misconception)":/);
});
test('nested layout operations reject partial, stale and legacy-axis evidence instead of accepting geometry alone', () => {
  const c = compiled('n09');
  assert.equal(checkNestedRuns(c, []).status, 'FAIL');
  const result = operate('layout-validate', { layoutPlan: c.layoutPlan, nestedCompiled: c, measurements: [{ schemaVersion: 'nested-geometry/1' }], measurementContext: { sourceSHA: 'a'.repeat(40) } });
  assert.equal(result.status, 'FAIL'); assert.ok(result.findings.some(f => f.ruleId === 'NESTED_FOUR_RUNS_REQUIRED'));
  const runs = [320,390,430,1440].map(width => ({ width, code: 'n09', sourceSHA: 'b'.repeat(40), compiledHash: c.compiledHash, packets: [], errors: [], failures: [] }));
  const stale = checkNestedRuns(c, runs, { sourceSHA: 'a'.repeat(40) });
  assert.equal(stale.status, 'FAIL');
  for (const rule of ['NESTED_RUN_BINDING','NESTED_RUN_PROVENANCE','NESTED_LIFECYCLE_COVERAGE','NESTED_PART_STATE_COVERAGE']) assert.ok(stale.findings.some(f => f.ruleId === rule), rule);
});

test('synthetic all-state labels cannot substitute an unrelated formula for real rows and slots', () => {
  const c=compiled('n09'), snapshots=buildNestedSnapshots(c).snapshots, rect={x:0,y:0,width:44,height:44};
  const unrelated={id:'not-a-real-row',template:'1=1',mode:'readonly',font:'18px',status:'MEASURED',overflow:'false',formula:rect,slots:[],geometry:{schemaVersion:'nested-geometry/1',source:'shared-compiler-dom-revalidated',status:'PASS',axisSource:'same-font-fraction-rule',baselineSource:'zero-inline-dom-marker',axisPx:4.5,frame:rect,available:rect,slots:[],lines:[]}};
  const manifest={'synthetic-unit-fixture':'f'.repeat(64)},sourceSHA='a'.repeat(40);
  const runs=[320,390,430,1440].map(width=>({width,code:'n09',sourceSHA,compiledHash:c.compiledHash,scriptHash:'b'.repeat(64),fontSha256:'c'.repeat(64),sourceManifest:manifest,sourceManifestAfter:manifest,errors:[],failures:[],lifecycle:{completed:true,reloaded:true,historyReadonly:true,resetReloaded:true},packets:snapshots.map(s=>({part:s.partId,state:s.state,selectedValue:s.selectedValue,viewport:width,readerWidth:100,pageWidth:width,formulas:[unrelated]}))}));
  const result=checkNestedRuns(c,runs,{sourceSHA,sourceManifest:manifest});
  assert.equal(result.status,'FAIL');
  assert.equal(result.findings.filter(f=>f.ruleId==='NESTED_VISIBLE_FORMULA_COVERAGE').length,4*snapshots.length);
});


test('public layout phases retain neutral frames for wrong choices and replan only after certification or exposure', () => {
 const snapshots=buildNestedSnapshots(compiled('n09')).snapshots;
 const initial=snapshots.find(s=>s.state==='initial');
 const wrong=snapshots.find(s=>s.partId===initial.partId&&s.state==='wrong');
 const filled=snapshots.find(s=>s.partId===initial.partId&&s.state==='filled');
 assert.equal(nestedPublicLayoutState(initial.visible),nestedPublicLayoutState(wrong.visible));
 assert.notEqual(nestedPublicLayoutState(initial.visible),nestedPublicLayoutState(filled.visible));
 const modified=structuredClone(wrong.visible);modified.visible[0].rows.push({id:'newly-exposed'});
 assert.notEqual(nestedPublicLayoutState(wrong.visible),nestedPublicLayoutState(modified));
});

test('reader formula contract has no memo, preserves history tags, and does not prefix math extras', async () => {
 const {expectedNestedReaderFormulas,expectedNestedReaderAuxiliary}=await import('../layout/nested-run-measurements.mjs');
 const make=(id,stageId,auto=false)=>({nodeId:id,stageId,parts:auto?[]:[{key:'p'}],equationNumber:id==='a'?'7':undefined,numberAliases:id==='a'?['6']:[],terminalRecord:{formulas:['never-rendered-terminal-memo']},displayExtras:id==='auto'?[]:[{kind:'math',latex:'2^2=4'}]});
 const a=make('a','first'),auto=make('auto','first',true),b=make('b','last');
 const visible=node=>({node,parts:[],resolved:true,rows:[{id:node.nodeId+'-row',kind:'math',template:'1=1',partKeys:[]}]});
 const history=expectedNestedReaderFormulas(a,visible(a),'readonly','history-');
 assert.deepEqual(history.map(f=>f.id),['history-a-row','a-extra-0']);
 assert.equal(history[0].equationTag,'(7 / 6)');assert.equal(history[1].mode,'readonly');
 assert.ok(history.every(f=>!f.template.includes('never-rendered')));
 const auxiliary=expectedNestedReaderAuxiliary({stages:[{id:'first'},{id:'last'}],nodeDesign:[a,auto,b]},{visible:[a,auto,b].map(visible)});
 assert.deepEqual(auxiliary.auto.map(p=>({stageId:p.stageId,ids:p.formulas.map(f=>f.id)})),[
  {stageId:'first',ids:['a-extra-0','auto-row']},{stageId:'last',ids:['b-extra-0']},
 ]);
 assert.deepEqual(auxiliary.history.map(f=>f.id),['history-a-row','a-extra-0','history-auto-row']);
 assert.ok(auxiliary.history.every(f=>f.mode==='readonly'));assert.equal(auxiliary.currentStageId,'last');
 assert.equal(expectedNestedReaderFormulas(auto,visible(auto),'interactive')[0].mode,'interactive');
});

test('full-run importer rejects wrong stage, old filled readonly mode, memo injection and incomplete auto stages', async () => {
 const {expectedNestedReaderFormulas}=await import('../layout/nested-run-measurements.mjs');
 const c=compiled('n09'),snapshots=buildNestedSnapshots(c).snapshots;
 const snapshot=snapshots.find(s=>s.partId==='n09-01::factorZeroConditionUX05'&&s.state==='filled');
 assert.ok(snapshot);
 const node=c.nodeDesign.find(n=>n.nodeId==='n09-01'),visible=snapshot.visible.visible.find(v=>v.node.nodeId===node.nodeId);
 // This is a contract-negative fixture, never actual DOM geometry or a positive run.
 const formulas=expectedNestedReaderFormulas(node,visible,'interactive').map(f=>({...f,geometry:{slots:[],resolvedParts:[]}}));
 const manifest={fixture:'f'.repeat(64)},sourceSHA='a'.repeat(40);
 const runs=[320,390,430,1440].map(width=>({width,code:'n09',sourceSHA,compiledHash:c.compiledHash,scriptHash:'b'.repeat(64),fontSha256:'c'.repeat(64),sourceManifest:manifest,sourceManifestAfter:manifest,errors:[],failures:[],httpErrors:[],networkFailures:[],lifecycle:{completed:true,reloaded:true,historyReadonly:true,resetReloaded:true},keyboardChecks:{slotFocus:true,Enter:true,Space:true,Escape:true},packets:[{part:snapshot.partId,state:'filled',selectedValue:snapshot.selectedValue,stageId:node.stageId,viewport:width,readerWidth:100,pageWidth:width,formulas}]}));
 const context={sourceSHA,sourceManifest:manifest};
 const initial=checkNestedRuns(c,runs,context);
 assert.equal(initial.status,'FAIL'); // No synthetic fixture can substitute real evidence.
 assert.equal(initial.findings.some(f=>f.ruleId==='NESTED_VISIBLE_FORMULA_BINDING'),false);
 const stage=structuredClone(runs);stage.forEach(r=>r.packets[0].stageId='unrelated-stage');
 assert.equal(checkNestedRuns(c,stage,context).findings.filter(f=>f.ruleId==='NESTED_PACKET_STAGE_BINDING').length,4);
 const readonly=structuredClone(runs);readonly.forEach(r=>r.packets[0].formulas[0].mode='readonly');
 assert.equal(checkNestedRuns(c,readonly,context).findings.filter(f=>f.ruleId==='NESTED_VISIBLE_FORMULA_BINDING').length,4);
 const memo=structuredClone(runs);memo.forEach(r=>r.packets[0].formulas.push({id:'n09-01-memo-0',template:'x=4',mode:'readonly'}));
 assert.equal(checkNestedRuns(c,memo,context).findings.filter(f=>f.ruleId==='NESTED_VISIBLE_FORMULA_COVERAGE').length,4);
 assert.equal(initial.findings.filter(f=>f.ruleId==='NESTED_AUTO_STAGE_COVERAGE').length,4);
 const unknownAux=structuredClone(runs);unknownAux[0].auxiliaryPackets=[{kind:'fabricated-stage'}];
 assert.ok(checkNestedRuns(c,unknownAux,context).findings.some(f=>f.ruleId==='NESTED_UNKNOWN_AUXILIARY_PACKET'));
 const network=structuredClone(runs);network[0].httpErrors=[{status:403}];
 assert.ok(checkNestedRuns(c,network,context).findings.some(f=>f.ruleId==='NESTED_HTTP_NETWORK_FAILURE'));
});
