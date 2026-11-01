import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildNestedTransformationPlan } from '../transformation/nested-lesson.mjs';
import { compileTransformationV3 } from '../transformation/v3.mjs';
import { validateCompiledNestedLesson } from '../../../src/domain/compiledNestedLesson.ts';
const designRaw = fs.readFileSync('work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json', 'utf8');
function fixture(code = 'n09') {
  const sourceRaw = fs.readFileSync('src/data/textbook/math/numbers/' + code + 'Authored.json', 'utf8'), source = JSON.parse(sourceRaw);
  const assets = Object.fromEntries(source.unit.sections.flatMap(s => s.figures).map(f => [f.src, createHash('sha256').update(fs.readFileSync('public' + f.src)).digest('hex')]));
  return [source, buildNestedTransformationPlan(sourceRaw, designRaw, source.unit.unitId, assets)];
}
for (const code of ['n09', 'n10']) test(code + ' uses the existing v3 compiler and browser validator on the same artifact', async () => {
  const result = compileTransformationV3(...fixture(code)); assert.equal(result.status, 'PASS');
  const c = result.compiled, pin = { unitId: c.unitId, fromRevision: c.fromRevision, toRevision: c.toRevision, compiledHash: c.compiledHash, planHash: c.planHash, sourceIRHash: c.sourceIRHash, ...c.sourceBinding };
  assert.equal((await validateCompiledNestedLesson(c, pin)).compiledHash, c.compiledHash);
  assert.equal(result.automaticAcceptance, false);
  assert.equal(c.nodeDesign.length, code === 'n09' ? 41 : 45);
  assert.equal(c.layoutPlan.groups.length, c.nodeDesign.length);
});
test('same-sized row or part substitution cannot acquire a new compile receipt', () => {
  for (const field of ['rows', 'parts', 'leadParts', 'terminalRecord']) {
    const [source, plan] = fixture(); plan.nodeDesign.find(n => n.parts.length)[field] = [];
    assert.equal(compileTransformationV3(source, plan).status, 'FAIL');
  }
});
test('changing source bytes or the reviewed design is rejected before compilation', () => {
  const [source, plan] = fixture(); plan.designRaw += '\n'; assert.equal(compileTransformationV3(source, plan).status, 'FAIL');
  const next = fixture(); next[1].sourceRaw += '\n'; assert.equal(compileTransformationV3(...next).status, 'FAIL');
});
test('layout tokens, numbers, gates and nested-display templates are source-bound', () => {
  const changes = [p => p.layoutPlan.tokens.mathFontPx = 16, p => p.layoutPlan.groups[0].number = '999', p => p.constructionPlan.nodes[1].rows[0].requiresCorrectKeys = ['future'], p => p.nestedDisplay.rowTemplates[0].rows[0].template = '1=1'];
  for (const change of changes) { const [source, plan] = fixture(); change(plan); assert.equal(compileTransformationV3(source, plan).status, 'FAIL'); }
});
test('a changed compiled payload is rejected even when the writer recomputes a self-reported hash', async () => {
  const c = compileTransformationV3(...fixture()).compiled;
  const pin = { unitId: c.unitId, fromRevision: c.fromRevision, toRevision: c.toRevision, compiledHash: c.compiledHash, planHash: c.planHash, sourceIRHash: c.sourceIRHash, ...c.sourceBinding };
  c.nodeDesign[0].leadParts[0].text = 'changed';
  await assert.rejects(validateCompiledNestedLesson(c, pin), /NESTED_COMPILED_HASH/);
});
test('calculated support and source figure are attached only to their certified target', () => {
  const c = compileTransformationV3(...fixture()).compiled;
  assert.equal(c.nodeDesign.find(n => n.nodeId === 'n09-decimal-method').displayExtras, undefined);
  assert.equal(c.nodeDesign.find(n => n.nodeId === 'n09-08').displayExtras[0].kind, 'math');
  assert.equal(c.nodeDesign.find(n => n.nodeId === 'n09-10').displayExtras[0].kind, 'figure');
});

test('native compile preserves the exact source and plan identities in the pinned artifact', async () => {
  const [source, plan] = fixture(), c = compileTransformationV3(source, plan).compiled;
  const pin = { unitId: c.unitId, fromRevision: c.fromRevision, toRevision: c.toRevision, compiledHash: c.compiledHash, planHash: c.planHash, sourceIRHash: c.sourceIRHash, ...c.sourceBinding };
  assert.equal(c.irHash, plan.sourceIRHash);
  assert.equal(c.sourceIRHash, plan.sourceIRHash);
  assert.match(c.planHash, /^[a-f0-9]{64}$/);
  for (const field of ['planHash', 'sourceIRHash', 'irHash']) {
    await assert.rejects(validateCompiledNestedLesson({ ...c, [field]: '0'.repeat(64) }, pin), /NESTED_COMPILED_PIN/);
  }
});
