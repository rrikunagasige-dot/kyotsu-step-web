import test from 'node:test';import assert from 'node:assert/strict';
import {validateLayoutMeasurements} from '../layout/measurements.mjs';
const measurements=()=>[320,390,430,1440].flatMap(viewportWidth=>['initial','partial','complete'].map(state=>({viewportWidth,state,groupId:'g',sourceSHA:'a'.repeat(40),layoutHash:'b'.repeat(64),imageHash:'c'.repeat(64),visibleStateHash:'d'.repeat(64),activePromptCount:state==='complete'?0:1,rowGapPx:4,noteGapPx:6,paragraphGapPx:8,numberVisible:true,numberAnchorRowRef:'r',numberPosition:'below-final-row',rows:[{rowId:'r',fontPx:18,katexScale:1,relationX:100,mathCenterX:150,contentCenterX:150,clipped:false,mathOverflow:false,hitOverlap:false,interactive:true,hitWidth:44,hitHeight:44}]})));
const ctx={sourceSHA:'a'.repeat(40),layoutHash:'b'.repeat(64),groupIds:['g'],groupRows:{g:['r']}};
test('four widths and three states require fixed image/source/geometry evidence',()=>{assert.equal(validateLayoutMeasurements(measurements(),ctx).status,'PASS');});
for(const [name,mutate] of [
 ['1.21em regression',m=>m[0].rows[0].fontPx=21.78],
 ['scale despite apparent basefont',m=>m[0].rows[0].katexScale=1.21],
 ['moving math center',m=>m[0].rows[0].mathCenterX=153],
 ['collapsed hit target',m=>m[0].rows[0].hitHeight=25],
 ['missing complete state',m=>m.pop()],
 ['different source',m=>m[0].sourceSHA='f'.repeat(40)],
 ['no image evidence',m=>delete m[0].imageHash],
 ['active prompt retained',m=>m[2].activePromptCount=1],
 ['overflow',m=>m[0].rows[0].mathOverflow=true],
 ['duplicate state',m=>m.push(m[0])],
 ['foreign initial row',m=>m[0].rows[0].rowId='invented'],
 ['undefined relation',m=>delete m[0].rows[0].relationX],
 ['wrong gap',m=>m[0].rowGapPx=18],
 ['number points to choice',m=>m[0].numberAnchorRowRef='choice'],
])test('reject '+name,()=>{const m=measurements();mutate(m);assert.equal(validateLayoutMeasurements(m,ctx).status,'FAIL');});
test('relation columns compared within group',()=>{const m=measurements();m[0].rows.push({...m[0].rows[0],rowId:'r2',relationX:103});assert.equal(validateLayoutMeasurements(m,ctx).status,'FAIL');});

test('partial state uses the approved row prefix',()=>{const m=measurements();const c={...ctx,groupStates:{g:{initial:['r'],partial:['r','r2'],complete:['r']}}};assert.equal(validateLayoutMeasurements(m,c).status,'FAIL');});
