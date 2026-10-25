import {test} from 'node:test';
import assert from 'node:assert/strict';
import {linearExample,extremaExample} from '../fixtures/solution-examples.mjs';
import {compileIRV2,validateIRV2,visibleFromCompiledV2} from '../ir/v2.mjs';
import {statementLatex} from '../solution/expression.mjs';
import {validateGraph} from '../solution/graph.mjs';
import {planBlanks} from '../interaction/plan.mjs';

test('minimum display includes domain and attainment; an infimum is not called a minimum',()=>{
 const s=extremaExample().problems[0].graph.states.at(-1).statement;
 assert.match(statementLatex(s),/x\\in \[0,2\]/);assert.match(statementLatex(s),/x=2/);
 s.attained=false;s.at=[];s.domain.upperOpen=true;assert.match(statementLatex(s),/\\inf_/);
});
test('redeclaring an initial fact or a given as a future result is rejected',()=>{
 const graph=linearExample().problems[0].graph;graph.transitions[1].produces.push(graph.givens[0].id);
 assert.ok(validateGraph(graph).findings.some(f=>f.ruleId==='DUPLICATE_FACT_DECLARATION'));
});
test('blank availability comes from its own state; supplied future facts cannot bypass it',()=>{
 const graph=linearExample().problems[0].graph;
 const common={id:'candidate',learnerDecision:'対象',target:'right',nextUse:'結論',availableFacts:['fixture-linear-fact1']};
 const out=planBlanks({graph,knownFacts:common.availableFacts,candidates:[{...common,stateId:graph.rootStateId},{...common,id:'later',stateId:'fixture-linear-s1'}]});
 assert.equal(out.candidates[0].eligibility,'INELIGIBLE');assert.equal(out.candidates[1].eligibility,'ELIGIBLE');
});
test('unopened choices and hints are absent; opening each state exposes only its contents',()=>{
 const compiled=compileIRV2(linearExample());const id='fixture-linear-step0';
 assert.equal(visibleFromCompiledV2(compiled,id).current.choices.length,0);
 const open=visibleFromCompiledV2(compiled,id,[],{choicesOpen:true,hintCount:1});
 assert.equal(open.current.choices.length,3);assert.equal(open.current.hints.length,1);assert.ok(!JSON.stringify(open).includes('correctValue'));
 assert.throws(()=>visibleFromCompiledV2(compiled,id,[],{hintCount:2}),/HINT_STATE/);
});
test('deep adversarial IR cannot overflow the recursive parser',()=>{
 const ir=linearExample();let e={kind:'rational',n:'1',d:'1'};
 for(let i=0;i<1000;i++)e={kind:'power',base:e,exponent:2};
 ir.problems[0].graph.states[0].statement.left=e;
 assert.equal(validateIRV2(ir).findings[0].ruleId,'V2_INPUT_LIMIT');
});

test('successive calculations in a choice retain full equalities as separate rows',()=>{
 const ir=linearExample();const q=ir.problems[0].steps[0].interaction;
 q.choices[0].rows=[{id:'approx-one',statement:{kind:'relation',operator:'=',left:{kind:'power',base:{kind:'rational',n:'141',d:'100'},exponent:2},right:{kind:'rational',n:'19881',d:'10000'}}},{id:'approx-two',statement:{kind:'relation',operator:'=',left:{kind:'power',base:{kind:'rational',n:'142',d:'100'},exponent:2},right:{kind:'rational',n:'5041',d:'2500'}}}];
 const rows=compileIRV2(ir).problems[0].steps[0].interaction.choices[0].rows;
 assert.equal(rows.length,2);assert.ok(rows.every(r=>r.latex.includes(' = ')));assert.notEqual(rows[0].id,rows[1].id);
});
