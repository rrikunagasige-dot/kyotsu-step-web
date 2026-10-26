import test from 'node:test'
import assert from 'node:assert/strict'
import { checkAxisMeasurements } from '../layout/axis-measurements.mjs'
const fixture = () => ({ schemaVersion: 'axis-measurement/1', baselineSource: 'zero-inline-dom-marker', axisSource: 'same-font-fraction-rule', mathFontPx: 18, katexScale: 1, axisStatus:'VERIFIED',axisPx:4.625, rows: [{ id: 'r', baselines: [30,30,30], katexStrutBaselines: [30.01], inkRects:[{x:20,y:10,width:12,height:18}], slots: [{ partId: 'p', axisDeltaPx: 0, x: 80, y: 0, width:44,height:44,focusRingCount:1 }] }], frame: { source:'measured-mathematical-envelope',centerX:195,bodyCenterX:195 }, visibleGlyphUnion: { left:90,right:220,top:10,bottom:30 }, anchorDeltas:[{ anchor:'relation',deltaPx:0 }], number:{rowRef:'r',baselineDeltaPx:0,clearancePx:8,placement:'inline'} })
test('actual marker contract and fixed anchors pass', () => assert.equal(checkAxisMeasurements(fixture()).status,'PASS'))
for (const [name,mutate,code] of [
  ['old centre proxy',p=>p.baselineSource='glyph-bbox-centre','AXIS_PROVENANCE'],
  ['missing baseline',p=>p.rows[0].baselines=[],'BASELINE_UNVERIFIED'],
  ['moving input',p=>p.anchorDeltas[0].deltaPx=30,'ANCHOR_MOVED'],
  ['outer frame tautology',p=>p.frame.source='100%-outer-wrapper','FRAME_UNVERIFIED'],
  ['double ring',p=>p.rows[0].slots[0].focusRingCount=2,'DUPLICATE_FOCUS'],
  ['overlapping hit',p=>p.rows[0].slots.push({...p.rows[0].slots[0],partId:'q',x:100}),'HIT_OVERLAP'],
  ['hit over neighboring pi glyph',p=>p.rows[0].inkRects=[{x:100,y:10,width:12,height:18}],'HIT_INK_OVERLAP'],
  ['wrong number baseline',p=>p.number.baselineDeltaPx=5,'NUMBER_ANCHOR'],
]) test('rejects '+name,()=>{const p=fixture();mutate(p);assert.ok(checkAxisMeasurements(p).failures.some(f=>f.code===code))})
const wrapped=()=>{const p=fixture(),r=p.rows[0];r.layout='wrapped';r.baselines=[30,74,74];r.katexStrutBaselines=[30.01,74,74.01];r.physicalLines=[{cellRefs:['left'],baselines:[30],katexStrutBaselines:[30.01]},{cellRefs:['relation','right'],baselines:[74,74],katexStrutBaselines:[74,74.01]}];return p}
test('declared two-line wrap checks each actual physical baseline without relaxing 1px',()=>assert.equal(checkAxisMeasurements(wrapped()).status,'PASS'))
for(const[name,mutate,code]of[
 ['real same-line misalignment',r=>{r.baselines[2]=77;r.physicalLines[1].baselines[1]=77},'BASELINE_MISMATCH'],
 ['dropped ink strut',r=>r.physicalLines[1].katexStrutBaselines.pop(),'PHYSICAL_LINE_COVERAGE'],
 ['arbitrary partition to conceal misalignment',r=>r.physicalLines[1].cellRefs=['right','relation'],'PHYSICAL_LINE_PARTITION'],
 ['wrap label without physical-line proof',r=>delete r.physicalLines,'PHYSICAL_LINE_PARTITION'],
 ['invented same-height wrap',r=>{r.baselines=[74,74,74];r.physicalLines[0].baselines=[74]},'PHYSICAL_LINE_ORDER'],
])test('wrapped rejects '+name,()=>{const p=wrapped();mutate(p.rows[0]);assert.ok(checkAxisMeasurements(p).failures.some(f=>f.code===code))})
