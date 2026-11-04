// REVIEW-ONLY candidate. Run from repository root; never writes product or Store files.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';
const work = 'work/items/W-MATH-048-n1314-source-audit';
const out = process.env.EVIDENCE_DIR;
assert.ok(out, 'EVIDENCE_DIR must explicitly identify temporary CI output');
fs.mkdirSync(out, { recursive: true });
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const sourceSHA = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (process.env.CANDIDATE_SHA) assert.equal(sourceSHA, process.env.CANDIDATE_SHA);
const index = read(`${work}/r3/PROPOSED_PATCH_INDEX.json`);
const files = index.files.map(row => ({ ...row, actualSHA256: hash(row.path) }));
const rows = [], fixtures = [];
const server = await createServer({ configFile: false, server: { middlewareMode: true }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
try {
  const { effectiveTextbookProgress, getTextbookChoices } = await server.ssrLoadModule('/src/domain/textbook.ts');
  for (const code of ['n13', 'n14']) {
    const row = files.find(r => r.path.endsWith(`/${code}Lesson.ts`));
    assert.ok([row.before_sha256, row.after_sha256].includes(row.actualSHA256), `${code}: unknown product bytes`);
    const applied = row.actualSHA256 === row.after_sha256;
    if (code === 'n13') assert.ok(applied, 'N13 approved fixed patch must already be applied');
    const module = await server.ssrLoadModule(`/src/data/textbook/math/numbers/${code}Lesson.ts`);
    const upper = code.toUpperCase(), unit = module[`mathNumbers${upper}Unit`];
    const baseline = read(`${work}/evidence/${upper}_CURRENT.json`).unit;
    const expected = read(`${work}/${upper}_MATERIALIZED_CANDIDATE.json`);
    const candidate = expected.unit ?? expected;
    assert.deepEqual(unit, applied ? candidate : baseline, `${code}: actual exported unit is exact fixed version`);
    if (!applied) {
      rows.push({ code, state: 'NOT_APPLIED', revision: unit.revision, browserEligible: false });
      continue;
    }
    const legacy = module[`mathNumbers${upper}LegacyUnit`];
    assert.deepEqual(legacy, baseline, `${code}: original unit retained`);
    const items = unit.sections[0].items;
    for (const old of baseline.sections[0].items) {
      const current = items.find(i => i.id === old.id);
      for (const key of ['id', 'answer', 'acceptedAnswers', 'choices']) assert.deepEqual(current[key], old[key], `${code}: ${old.id}/${key}`);
    }
    const migrationRows = [];
    for (let revision = 1; revision <= baseline.revision; revision++) {
      const anchors = baseline.sections[0].items.filter(i => revision === baseline.revision || new RegExp(`^${code}-\\d\\d$`).test(i.id));
      const answers = Object.fromEntries(anchors.map(i => [i.id, { itemId: i.id, value: i.answer, firstValue: 'audit-original-wrong', resolved: true, isFirstCorrect: false, attemptCount: 2, firstAnsweredAt: 11, lastAnsweredAt: 22 }]));
      const before = { unitId: unit.unitId, unitRevision: revision, startedAt: 11, updatedAt: 22, completedAt: 23, answers };
      const result = effectiveTextbookProgress(unit, before);
      assert.equal(result.unitRevision, unit.revision);
      assert.equal(result.completedAt, undefined);
      const added = items.filter(i => !baseline.sections[0].items.some(old => old.id === i.id));
      for (const item of added) assert.equal(result.answers[item.id], undefined, 'new decisions remain unanswered');
      if (revision === baseline.revision) for (const [id, record] of Object.entries(answers)) assert.deepEqual(result.answers[id], record);
      assert.deepEqual(effectiveTextbookProgress(unit, result), result, 'migration is idempotent');
      migrationRows.push({ revision, status: 'PASS_SYNTHETIC_DOMAIN' });
    }
    rows.push({ code, state: 'APPLIED_FIXED_PATCH', revision: unit.revision, answers: items.length, migrationRows, browserEligible: true });
    fixtures.push({ code, unit, legacy, visibleChoices: Object.fromEntries(items.map(item => [item.id, getTextbookChoices(unit, item)])), contract: module[`${code}W048DisplayContract`] });
  }
  for (const row of files.filter(r => !r.path.endsWith('Lesson.ts'))) assert.equal(row.actualSHA256, row.after_sha256, `${row.path}: exact scoped shared patch`);
} finally { await server.close(); }
const report = { status: 'PASS_BOUNDED_CURRENT_CONTRACTS', sourceSHA, rows, files, pendingUnits: rows.filter(r => !r.browserEligible).map(r => r.code), limits: ['NOT_APPLIED units are explicitly excluded from current-source browser proof.', 'Synthetic migration checks are not real learner data.', 'This does not complete native R07, nonauthor review, G2, publication or acceptance.'] };
fs.writeFileSync(path.join(out, 'CURRENT_CONTRACTS.json'), JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'BROWSER_FIXTURES.json'), JSON.stringify({ sourceSHA, fixtures }, null, 2) + '\n');
console.log(JSON.stringify(report));
