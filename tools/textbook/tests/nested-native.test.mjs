import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {buildNestedTransformationPlan} from '../transformation/nested-lesson.mjs';
import { operate } from '../operations.mjs';
import { buildNestedSnapshots } from '../transformation/nested-snapshots.mjs';
import { checkNestedRuns } from '../layout/nested-run-measurements.mjs';
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
