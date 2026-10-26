import test from 'node:test'
import assert from 'node:assert/strict'
import { readJSON } from '../util.mjs'
import { buildLayoutPlanV2,validateLayoutPlanV2 } from '../layout/plan-v2.mjs'
import { validateLayoutPlan } from '../layout/plan.mjs'
const root = new URL('../../../',import.meta.url)
const load = p => readJSON(new URL(p,root))
const build = () => {const r=load('src/data/textbook/math/numbers/n08Revision7.json'),p=load('src/data/textbook/math/numbers/n08ConstructionPresentationR7.json');return buildLayoutPlanV2({unitId:r.unit.unitId,nodeDesign:p.nodeDesign,groups:p.groups,interactionsV1:r.unit.constructionItems,interactionsV2:r.unit.constructionItemsV2,legacyItems:r.unit.sections.flatMap(s=>s.items),semantic:r.semantic,equationNumbers:r.equationNumbers})}
test('real 39-node r7 layout covers every source and staged prerequisite',()=>{const plan=build();const result=validateLayoutPlan(plan);assert.equal(result.status,'PASS',JSON.stringify(result.findings));assert.equal(plan.nodeCoverage.length,39);assert.equal(plan.partIds.length,32);assert.equal(plan.legacyInteractionIds.length,10)})
for(const [name,mutate,rule]of[
 ['no groups',p=>p.groups=[],'LAYOUT2_SCHEMA'],
 ['changed math font',p=>p.tokens.mathFontPx=20,'LAYOUT2_TOKENS'],
 ['glyph centre axis substitute',p=>p.axisContract.baselineSource='bbox-centre','LAYOUT2_AXIS_CONTRACT'],
 ['state-dependent resizing',p=>p.groups[0].framePolicy='resize-current-draft','LAYOUT2_FRAME_CONTRACT'],
 ['terminal instead of visible number',p=>p.groups[0].numberBaselineRef='complete-row-only','LAYOUT2_NUMBER_ANCHOR'],
 ['lost source node',p=>p.nodeCoverage.pop(),'LAYOUT2_NODE_COVERAGE'],
 ['future prerequisite',p=>{const g=p.groups.find(g=>g.rows.some(r=>r.requiresCorrectParts.length));const r=g.rows.find(r=>r.requiresCorrectParts.length);g.rows[0].requiresCorrectParts=[...r.partIds]},'LAYOUT2_FUTURE_PREREQUISITE'],
])test('r7 rejects '+name,()=>{const p=build();mutate(p);const r=validateLayoutPlanV2(p);assert.equal(r.status,'FAIL');assert.ok(r.findings.some(f=>f.ruleId===rule),JSON.stringify(r.findings))})
test('v1 layout receipt remains exactly the preexisting schema/version',()=>{const p=load('src/data/textbook/math/numbers/n08Layout.json');assert.equal(p.schemaVersion,'layout-plan/1');assert.equal(validateLayoutPlan(p).status,'PASS');assert.equal(validateLayoutPlan(p).meaningAuditRequired,true)})
