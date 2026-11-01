import test from 'node:test';import assert from 'node:assert/strict';
import {checkNestedMeasurements}from'../layout/nested-measurements.mjs';
const rect={x:0,y:0,width:44,height:44};
function fixture(){return {schemaVersion:'nested-geometry/1',source:'shared-compiler-dom-revalidated',axisSource:'same-font-fraction-rule',baselineSource:'zero-inline-dom-marker',axisPx:4.5,frame:rect,available:rect,slots:[{id:'a',path:'root/0/radicand',value:'sqrt2',rect,rule:rect,baseline:26.5,localFontPx:18,axisDeltaPx:0}],lines:[{kind:'structural-svg',rect,inkOverlaps:['a'],ownerPartId:'a',ownerSemanticPath:'root/0/radicand',ownerProof:'compiler-candidate-marker',rasterized:true}]}}
test('only a proven candidate line may overlap its own hit',()=>assert.equal(checkNestedMeasurements(fixture()).status,'PASS'));
test('parent radical/fraction ink is never exempted as a DOM descendant',()=>{const p=fixture();Object.assign(p.lines[0],{ownerPartId:null,ownerSemanticPath:null,ownerProof:'template-structure'});assert.equal(checkNestedMeasurements(p).status,'FAIL')});
test('forged owner, sibling owner, missing raster and false axis are rejected',()=>{
 for(const mutate of[p=>p.lines[0].ownerProof='dom-descendant',p=>p.lines[0].ownerSemanticPath='root/other',p=>p.lines[0].ownerPartId='sibling',p=>p.lines[0].rasterized=false,p=>p.slots[0].axisDeltaPx=4.5,p=>delete p.axisPx]){const p=fixture();mutate(p);assert.equal(checkNestedMeasurements(p).status,'FAIL')}
});
test('same-sized hit swap cannot be hidden by a copied owner label',()=>{const p=fixture();p.slots[0].path='root/0/denominator';assert.equal(checkNestedMeasurements(p).status,'FAIL')});

test('a common body can center an off-center row only with a measured root relation proof',()=>{
 const p=fixture();p.available={x:0,y:0,width:100,height:44};p.frame={x:10,y:0,width:44,height:44};
 p.groupAlignment={groupId:'g',bodyLeft:10,bodyWidth:80,availableWidth:100,relationX:40,rowRelationOffset:30,rowLeftExtent:30,rowRightExtent:14,neutralLayoutKey:'neutral',status:'ALIGNED'};
 p.rootRelationProof={source:'shared-compiler-marker-dom-revalidated',semanticPath:'root/2',marker:'ROOT',rect:{x:35,y:20,width:10,height:10}};
 assert.equal(checkNestedMeasurements(p).status,'PASS');
 for(const mutate of [q=>q.groupAlignment.bodyLeft+=2,q=>q.rootRelationProof.semanticPath='root/2/numerator',q=>q.rootRelationProof.rect.x++,q=>q.groupAlignment.rowRightExtent++,q=>q.slots[0].baseline++]){const q=structuredClone(p);mutate(q);assert.equal(checkNestedMeasurements(q).status,'FAIL')}
});
