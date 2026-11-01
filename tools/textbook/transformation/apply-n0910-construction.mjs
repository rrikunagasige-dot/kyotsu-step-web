import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildNestedTransformationPlan } from './nested-lesson.mjs';
import { compileTransformationV3 } from './v3.mjs';
import { validateCompiledNestedLesson } from '../../../src/domain/compiledNestedLesson.ts';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export async function materializeN0910(rootDir = root) {
 const work = path.join(rootDir, 'work/items/W-MATH-043-n0910-restart');
 const designRaw = fs.readFileSync(path.join(work, 'NODE_DESIGN.json'), 'utf8');
 const directory = path.join(rootDir, 'src/data/textbook/math/numbers');
 const result = {}, pins = {}, revisions = {};
 for (const code of ['n09', 'n10']) {
  const sourceRaw = fs.readFileSync(path.join(directory, code + 'Authored.json'), 'utf8'), source = JSON.parse(sourceRaw);
  const assets = Object.fromEntries(source.unit.sections.flatMap(s => s.figures).map(f => [f.src, createHash('sha256').update(fs.readFileSync(path.join(rootDir, 'public', f.src))).digest('hex')]));
  const plan = buildNestedTransformationPlan(sourceRaw, designRaw, source.unit.unitId, assets);
  const checked = compileTransformationV3(source, plan);
  if (checked.status !== 'PASS') throw Error(JSON.stringify(checked));
  const c = checked.compiled;
  const pin = { unitId: c.unitId, fromRevision: c.fromRevision, toRevision: c.toRevision, compiledHash: c.compiledHash, planHash: c.planHash, sourceIRHash: c.sourceIRHash, sourceSha256: c.sourceBinding.sourceSha256, designSha256: c.sourceBinding.designSha256 };
  await validateCompiledNestedLesson(c, pin);
  result[code] = c; pins[code] = pin;
  const sectionId = source.unit.sections[0].id;
  const parents = c.nodeDesign.filter(n => n.parts.length).map(n => ({ nodeId: n.nodeId, sectionId, parts: n.parts.map(p => ({ id: p.id, expected: p.expected })) }));
  revisions[code] = { unit: { ...source.unit, revision: c.toRevision, constructionLessonVersion: 'n0910/1', nestedContract: { compiledHash: c.compiledHash, parents }, requiredInteractionRefs: parents.map(p => p.nodeId), sections: source.unit.sections.map(s => ({ ...s, items: [], readingFlow: [] })) }, sourceBinding: c.sourceBinding, compiledHash: c.compiledHash, implementationStatus: 'STAGED_NOT_PUBLISHED', automaticAcceptance: false };
 }
 return { compiled: result, pins, revisions };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
 const { compiled, pins, revisions } = await materializeN0910();
 const directory = path.join(root, 'src/data/textbook/math/numbers');
 for (const [code, value] of Object.entries(compiled)) fs.writeFileSync(path.join(directory, code + 'ConstructionCompiled.json'), JSON.stringify(value, null, 2) + '\n');
 for (const [code, value] of Object.entries(revisions)) fs.writeFileSync(path.join(directory, code + 'Revision' + value.unit.revision + '.json'), JSON.stringify(value, null, 2) + '\n');
 fs.writeFileSync(path.join(directory, 'n0910CandidatePins.json'), JSON.stringify(pins, null, 2) + '\n');
 console.log(JSON.stringify({ status: 'PASS', scope: 'SOURCE_BOUND_STRUCTURAL_COMPILE_NOT_MATH_ACCEPTANCE', pins }));
}
