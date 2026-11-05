// B-owned verification harness only; root executes it. No source/native Store/Git writes.
// This is current Page + exported old-revision browser fixtures, NOT a built or hosted old route.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const root = path.resolve(process.env.W048_APP_ROOT || process.cwd());
const require = createRequire(path.join(root, 'package.json'));
const { chromium } = require('@playwright/test');
const { createServer } = await import(require.resolve('vite'));
const out = process.env.EVIDENCE_DIR;
assert.ok(out && path.isAbsolute(out), 'Explicit absolute temporary evidence output required');
const resolvedOut = path.resolve(out);
assert.ok(resolvedOut !== root && !resolvedOut.startsWith(root + path.sep) && !root.startsWith(resolvedOut + path.sep), 'Evidence must be outside and not contain the repository');
fs.mkdirSync(out, { recursive: true });
assert.ok(process.env.W048_FIXTURES, 'Explicit current eligibility fixtures required');
const eligible = JSON.parse(fs.readFileSync(process.env.W048_FIXTURES, 'utf8')).fixtures.map(f => f.code);
assert.ok(eligible.length && eligible.every(c => ['n13', 'n14'].includes(c)));

const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const sourceFiles = ['src/pages/TextbookUnitPage.tsx', 'src/domain/textbook.ts',
  'src/data/textbook/math/numbers/n13Lesson.ts', 'src/data/textbook/math/numbers/n14Lesson.ts'];
const beforeHashes = Object.fromEntries(sourceFiles.map(p => [p, hash(path.join(root, p))]));
const report = { schemaVersion: 'w048-legacy-scroll-fixture/1', status: 'RUNNING',
  scope: 'Current-source Vite dev Page + in-memory exported N13 r4/N14 r10 fixtures only',
  author: 'B test harness author, not lesson/product patch author', sourceHashes: beforeHashes,
  eligibleUnits: eligible, notAppliedExcluded: ['n13','n14'].filter(c => !eligible.includes(c)),
  rows: [], failures: [], limits: [
    'Object.assign changes only the isolated browser module object; no source bytes, formal workflow Store or real user persistence is modified.',
    'Catalog/repository object identity, legacy revision and absent W048 class are required. Cloned catalog values or missing exports return UNVERIFIED, never fixture PASS.',
    'Exercises one actual formula judgment with wrong/correct answer per unit/width; not every old interaction, historical rendering, migration or hosted route.',
    'No product build or published old-revision route is supplied by this fixture. Reload restoration is explicitly checked.',
    'Observes formula Element.scrollTo calls; unrelated window/stage scrolling is outside this bounded no-op test.',
  ] };
class Unverified extends Error {}
let server, browser;
try {
  server = await createServer({ root, base: '/', server: { host: '127.0.0.1', port: 0, strictPort: false },
    optimizeDeps: { noDiscovery: true, include: [] } });
  await server.listen();
  const address = server.httpServer.address();
  assert.ok(address && typeof address !== 'string');
  const app = `http://127.0.0.1:${address.port}/`;
  report.localFixtureURL = app;
  browser = await chromium.launch({ headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ['--no-sandbox', ...(process.env.W048_SINGLE_PROCESS === '1'
      ? ['--disable-dev-shm-usage', '--disable-gpu', '--disable-software-rasterizer', '--no-zygote', '--single-process'] : [])] });
  for (const code of eligible) for (const width of [320, 390, 430, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage(); page.setDefaultTimeout(20000);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
      window.__w048LegacyScrollCalls = [];
      const original = Element.prototype.scrollTo;
      Element.prototype.scrollTo = function (...args) {
        if (this.dataset?.testid?.startsWith('textbook-formula-')) window.__w048LegacyScrollCalls.push({ id: this.dataset.testid, args });
        return original.apply(this, args);
      };
    });
    await page.goto(app + '#/learning/setup?subject=math-1a');
    await page.waitForFunction(() => document.querySelector('a,button,input'));
    const fixture = await page.evaluate(async code => {
      const upper = code.toUpperCase();
      const module = await import(`/src/data/textbook/math/numbers/${code}Lesson.ts`);
      const current = module[`mathNumbers${upper}Unit`], old = module[`mathNumbers${upper}LegacyUnit`];
      const { textbookRepository } = await import('/src/repositories/textbookRepository.ts');
      const { builtInTextbookUnits } = await import('/src/data/textbookUnits.ts');
      const { getTextbookChoices } = await import('/src/domain/textbook.ts');
      const { useAppStore } = await import('/src/stores/useAppStore.ts');
      if (!current || !old) return { ready: false, reason: 'Current/LegacyUnit export unavailable', code };
      const expectedLegacyRevision = code === 'n13' ? 4 : 10;
      if (old.revision !== expectedLegacyRevision) return { ready: false, reason: 'Unexpected legacy revision', actual: old.revision, expectedLegacyRevision };
      const originalRevision = current.revision, id = current.unitId;
      const fromRepoBefore = await textbookRepository.getById(id), fromCatalog = builtInTextbookUnits.find(u => u.unitId === id);
      if (fromRepoBefore !== current || fromCatalog !== current) return { ready: false, reason: 'Catalog/repository clone; exported object mutation would not prove the actual app fixture', code };
      const replacement = JSON.parse(JSON.stringify(old));
      for (const key of Object.keys(current)) delete current[key];
      Object.assign(current, replacement);
      const fromRepoAfter = await textbookRepository.getById(id);
      if (fromRepoAfter !== current || fromRepoAfter.revision !== expectedLegacyRevision) return { ready: false, reason: 'Mutated old fixture not visible to actual repository', code };
      useAppStore.setState({ textbookProgress: {} });
      for (const key of Object.keys(localStorage)) if (key.startsWith('math-textbook-compact-v1:')) localStorage.removeItem(key);
      window.__w048LegacyFixture = { code, id, originalRevision, legacyRevision: expectedLegacyRevision };
      return { ready: true, code, id, originalRevision, legacyRevision: expectedLegacyRevision,
        catalogIdentityConfirmed: true, repositoryIdentityConfirmed: true,
        items: Object.fromEntries(current.sections[0].items.map(i => [i.id, { answer: i.answer, choices: getTextbookChoices(current, i) }])) };
    }, code);
    if (!fixture.ready) throw new Unverified(JSON.stringify(fixture));
    // SPA navigation preserves the deliberately altered in-memory module object.
    await page.evaluate(id => { location.hash = '/learning/textbook/' + id; }, fixture.id);
    await page.getByTestId('textbook-reading-flow').waitFor(); await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.w048-reading-flow').count(), 0, 'Legacy revision cannot activate W048 display/scroll branch');
    const row = { code, width, fixture: { ...fixture, items: undefined }, answeredPrefix: [], status: 'RUNNING' };
    report.rows.push(row);
    async function pending() {
      for (let i = 0; i < 100; i++) {
        const ids = await page.locator('button[data-testid^="textbook-item-"]:visible').evaluateAll(ns => ns.map(n => n.dataset.testid.slice('textbook-item-'.length)));
        if (ids.length) return ids;
        const next = page.getByTestId('math-textbook-next-stage'); if (!await next.count()) return [];
        await next.click();
      }
      throw Error('Old fixture compact-stage traversal bound');
    }
    async function answer(id, value) {
      await page.getByTestId('textbook-item-' + id).click();
      const panel = page.getByTestId('inline-choice-panel-' + id); await panel.waitFor();
      await panel.getByRole('button', { name: value, exact: true }).click(); await panel.waitFor({ state: 'detached' });
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    }
    let found = false;
    for (let guard = 0; guard < Object.keys(fixture.items).length + 5; guard++) {
      const ids = await pending(); assert.ok(ids.length, 'Actual old fixture must expose a formula judgment');
      const id = ids[0], item = fixture.items[id]; assert.ok(item);
      const formulaId = await page.getByTestId('textbook-item-' + id).evaluate(e => e.closest('[data-testid^="textbook-formula-"]')?.dataset.testid);
      if (!formulaId) { await answer(id, item.answer); row.answeredPrefix.push(id); continue; }
      const wrong = item.choices.find(v => v !== item.answer); assert.ok(wrong, 'Actual displayed wrong choice required');
      const observations = [];
      for (const [state, value] of [['wrong', wrong], ['correct', item.answer]]) {
        const before = await page.getByTestId(formulaId).evaluate(e => {
          e.scrollLeft = 20; window.__w048LegacyScrollCalls = [];
          return { scrollLeft: e.scrollLeft, scrollWidth: e.scrollWidth, clientWidth: e.clientWidth };
        });
        await answer(id, value);
        const after = await page.evaluate(testid => ({ calls: window.__w048LegacyScrollCalls,
          classCount: document.querySelectorAll('.w048-reading-flow').length,
          scrollLeft: document.querySelector(`[data-testid="${testid}"]`)?.scrollLeft }), formulaId);
        assert.equal(after.classCount, 0); assert.deepEqual(after.calls, [], 'Old revision answer must not invoke formula scrollTo');
        if (state === 'wrong') assert.equal(await page.getByTestId('textbook-item-' + id).count(), 1, 'Wrong still unresolved');
        if (state === 'correct') {
          assert.equal(await page.getByTestId('textbook-item-' + id).count(), 0, 'Correct resolved original button');
          assert.equal(await page.getByTestId('resolved-' + id).count(), 1, 'Correct has one resolved marker');
          const saved = await page.evaluate(async ({ unitId, itemId }) => {
            const { useAppStore } = await import('/src/stores/useAppStore.ts');
            return useAppStore.getState().textbookProgress[unitId]?.answers[itemId];
          }, { unitId: fixture.id, itemId: id });
          assert.equal(saved?.resolved, true); assert.equal(saved?.value, item.answer);
          observations.push({ state: 'verified-correct-record', record: saved });
        }
        observations.push({ state, before, after });
      }
      row.formulaJudgment = { id, formulaId, observations }; found = true; break;
    }
    assert.ok(found, 'No-op requires real formula answer, not paragraph-only smoke');
    // Hard reload must restore the original exported current revision. Failure
    // means this fixture cannot establish clean isolation and is not a PASS.
    await page.reload(); await page.getByTestId('textbook-reading-flow').waitFor();
    const restored = await page.evaluate(async code => {
      const upper = code.toUpperCase(), module = await import(`/src/data/textbook/math/numbers/${code}Lesson.ts`);
      const current = module[`mathNumbers${upper}Unit`];
      const { textbookRepository } = await import('/src/repositories/textbookRepository.ts');
      return { revision: current.revision, sameRepositoryObject: (await textbookRepository.getById(current.unitId)) === current,
        w048Class: document.querySelectorAll('.w048-reading-flow').length };
    }, code);
    assert.equal(restored.revision, fixture.originalRevision); assert.equal(restored.sameRepositoryObject, true);
    assert.equal(restored.w048Class, 1, 'Reloaded current N13r5/N14r11 must restore current W048 branch');
    assert.deepEqual(errors, []); row.restoredOnReload = restored; row.status = 'PASS_BOUNDED_LEGACY_FIXTURE_NOOP';
    // Keep isolated contexts alive through browser.close for constrained runtimes.
  }
  report.status = 'PASS_BOUNDED_LEGACY_FIXTURE_NOOP';
} catch (error) {
  report.status = error instanceof Unverified ? 'UNVERIFIED_LEGACY_FIXTURE' : 'FAIL_LEGACY_FIXTURE';
  report.failures.push({ message: error.message, stack: error.stack });
  process.exitCode = 1;
} finally {
  if (browser) await browser.close(); if (server) await server.close();
  report.afterSourceHashes = Object.fromEntries(sourceFiles.map(p => [p, hash(path.join(root, p))]));
  if (JSON.stringify(report.afterSourceHashes) !== JSON.stringify(beforeHashes)) {
    report.status = 'FAIL_SOURCE_CHANGED'; report.failures.push({ message: 'Read-only source hash boundary changed' }); process.exitCode = 1;
  }
  fs.writeFileSync(path.join(out, 'LEGACY_SCROLL_REPORT.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, rows: report.rows.map(r => ({ code: r.code, width: r.width, status: r.status })), failures: report.failures, output: out }));
}
