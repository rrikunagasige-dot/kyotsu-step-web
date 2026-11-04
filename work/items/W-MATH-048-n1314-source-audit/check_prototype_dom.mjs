// Technical DOM probe only. No learner acceptance or formal packet review is implied.
// Run against the isolated prototype Vite server: node /tmp/w048_prototype_check.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require = createRequire('/workspace/scratch/6ff917b2ec4a/w047-n1112/package.json');
const { chromium } = require('@playwright/test');
const base = process.env.W048_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const output = process.env.W048_CHECK_OUTPUT || '/tmp/w048-prototype-dom-b.json';
const report = { scope: 'ISOLATED_PROTOTYPE_TECHNICAL_DOM_ONLY', base, formalPacketReviewed: false, staticChecks: [], domChecks: [], failures: [], limits: ['No source-fidelity or learner acceptance claim', 'Browser contexts are fresh and isolated; no real learner Store is accessed', 'Old-save DOM scenarios cover latest baseline revisions; older revision chains need separate domain audit'] };
function check(name, ok, detail = {}) { const row = { name, status: ok ? 'PASS' : 'FAIL', ...detail }; report.domChecks.push(row); if (!ok) report.failures.push(row); }
let browser;
try {
 browser = await chromium.launch({ headless: true, ...(process.env.KYOTSU_CHROMIUM_PATH ? { executablePath: process.env.KYOTSU_CHROMIUM_PATH } : {}), args: ['--no-sandbox', '--disable-dev-shm-usage'] });
 const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
 const page = await context.newPage(); const pageErrors = []; page.on('pageerror', e => pageErrors.push(e.message));
 async function open(code) {
  await page.goto(`${base}/learning/textbook/math-numbers-expressions-${code}`);
  await page.waitForFunction(() => document.querySelector('[data-testid^="textbook-item-"]') || document.querySelector('.reading-paragraph'), { timeout: 60000 });
  return page.evaluate(async code => {
   const data = await import(`/src/data/textbook/math/numbers/${code}Lesson.ts`);
   const upper = code.toUpperCase();
   window.__w048 = { unit: data[`mathNumbers${upper}Unit`], legacy: data[`mathNumbers${upper}LegacyUnit`], contract: data[`${code}W048DisplayContract`] };
   return JSON.parse(JSON.stringify(window.__w048));
  }, code);
 }
 async function seed(answers, revision, completed = false) {
  await page.evaluate(async ({ answers, revision, completed }) => {
   const { useAppStore } = await import('/src/stores/useAppStore.ts'); const { unit } = window.__w048;
   const progress = { unitId: unit.unitId, unitRevision: revision ?? unit.revision, startedAt: 11, updatedAt: 22, answers, ...(completed ? { completedAt: 23 } : {}), archivedRevisions: { 'audit-sentinel': { unitRevision: 1, startedAt: 1, updatedAt: 2, answers: {} } } };
   useAppStore.setState({ textbookProgress: { [unit.unitId]: progress } });
  }, { answers, revision, completed });
  await page.waitForTimeout(60);
 }
 const record = (item, wrong = false) => ({ itemId: item.id, value: wrong ? item.choices.find(c => c !== item.answer) : item.answer, firstValue: item.answer, isFirstCorrect: !wrong, resolved: !wrong, attemptCount: 1, firstAnsweredAt: 11, lastAnsweredAt: 22 });
 async function ids() { return page.locator('button[data-testid^="textbook-item-"]').evaluateAll(els => els.map(x => x.dataset.testid.replace('textbook-item-', ''))); }
 async function answer(item, wrong = false) {
  await page.getByTestId(`textbook-item-${item.id}`).click();
  const options = page.locator(`button[data-testid^="textbook-choice-${item.id}-"]`);
  await options.first().waitFor();
  const labels = await options.evaluateAll(els => els.map(e => e.getAttribute('aria-label')));
  check(`${item.id}: exact visible choice keys`, labels.length === item.choices.length && labels.every(c => item.choices.includes(c)), { labels });
  const value = wrong ? item.choices.find(c => c !== item.answer) : item.answer;
  await options.evaluateAll((els, value) => { const button = els.find(e => e.getAttribute('aria-label') === value); if (!button) throw Error('choice missing'); button.click(); }, value);
  await options.first().waitFor({ state: 'detached' });
 }
 for (const code of ['n13', 'n14']) {
  const data = await open(code); const section = data.unit.sections[0]; const byId = Object.fromEntries(section.items.map(i => [i.id, i]));
  const fresh = await ids(); check(`${code}: fresh starts unanswered`, fresh.length > 0 && await page.locator('[data-testid^="resolved-"]').count() === 0, { fresh });
  const first = byId[fresh[0]]; await answer(first, true);
  check(`${code}: wrong closes panel and remains unresolved`, await page.getByTestId(`textbook-item-${first.id}`).count() === 1 && await page.getByTestId(`resolved-${first.id}`).count() === 0);
  await page.getByTestId(`textbook-item-${first.id}`).click();
  check(`${code}: wrong panel reopens with invalid prior key`, await page.locator(`button[data-testid^="textbook-choice-${first.id}-"][aria-invalid="true"]`).count() === 1);
  await page.getByTestId(`textbook-item-${first.id}`).click(); // panel stays active; answer helper opens same item id safely
  await answer(first);
  async function figureGate(label) {
   const currentIds = await ids();
   const firstBlocked = section.readingFlow.findIndex(b => (b.parts || []).some(p => p.type === 'choice' && currentIds.includes(p.itemId)));
   const visiblePrefix = firstBlocked === -1 ? section.readingFlow : section.readingFlow.slice(0, firstBlocked + 1);
   const expectedSrc = visiblePrefix.filter(b => b.type === 'figure').map(b => section.figures.find(f => f.id === b.figureId).src);
   const actualSrc = await page.locator('.reading-block-with-choice img').evaluateAll(els => els.map(e => e.getAttribute('src')));
   check(`${code}: positional figure gate ${label}`, JSON.stringify(actualSrc) === JSON.stringify(expectedSrc), { actualSrc, expectedSrc });
  }
  let guard = 0;
  await figureGate('after first');
  while ((await ids()).length) { if (++guard > section.items.length + 1) throw Error('traversal stalled'); const id = (await ids())[0]; await figureGate(id); await answer(byId[id]); }
  await figureGate('complete');
  check(`${code}: every interaction solved by actual DOM choice`, await page.locator('[data-testid^="resolved-"]').count() === section.items.length, { total: section.items.length });
  for (const width of [390, 768, 1024, 1440]) {
   await page.setViewportSize({ width, height: 900 });
   const numbers = await page.locator('[data-equation-number]').evaluateAll(els => els.map(e => e.getAttribute('data-equation-number')));
   const expected = Object.values(data.contract.equationNumbers).map(String);
   check(`${code}: ${width}px consumed equation numbers once`, JSON.stringify([...numbers].sort()) === JSON.stringify([...expected].sort()), { numbers, expected });
   const geometry = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: window.innerWidth, katexErrors: [...document.querySelectorAll('.katex-error')].map(e => e.textContent) }));
   check(`${code}: ${width}px no document overflow or KaTeX error`, geometry.scroll <= geometry.width + 1 && geometry.katexErrors.length === 0, geometry);
  }
  // Independent same-row slot permutations. All prior interactions solved; later slots
  // on this row may be solved first, and must not resolve an earlier missing slot.
  for (const [index, block] of section.readingFlow.entries()) {
   const slots = (block.parts || []).filter(p => p.type === 'choice').map(p => p.itemId); if (slots.length < 2) continue;
   const prior = section.readingFlow.slice(0, index).flatMap(b => (b.parts || []).filter(p => p.type === 'choice').map(p => p.itemId));
   for (let mask = 0; mask < 2 ** slots.length - 1; mask++) {
    const answers = Object.fromEntries(prior.map(id => [id, record(byId[id])]));
    slots.forEach((id, i) => { if (mask & 1 << i) answers[id] = record(byId[id]); });
    await seed(answers);
    const visible = await ids(); const missing = slots.filter((id, i) => !(mask & 1 << i));
    check(`${code}: row ${block.id} mask ${mask} same-row independent slots`, JSON.stringify(visible) === JSON.stringify(missing), { slots, visible, missing });
   }
  }
  // Latest published baseline save with all old IDs correct, completedAt set.
  const oldAnswers = Object.fromEntries(data.legacy.sections[0].items.map(i => [i.id, record(i)]));
  await seed(oldAnswers, data.legacy.revision, true);
  const newIds = section.items.filter(i => !oldAnswers[i.id]).map(i => i.id);
  const visible = await ids();
  check(`${code}: old completed save stops at added unanswered decisions`, visible.length > 0 && visible.every(id => newIds.includes(id)), { visible, newIds });
  const migration = await page.evaluate(async () => {
   const { useAppStore } = await import('/src/stores/useAppStore.ts'); const { effectiveTextbookProgress } = await import('/src/domain/textbook.ts');
   return effectiveTextbookProgress(window.__w048.unit, useAppStore.getState().textbookProgress[window.__w048.unit.unitId]);
  });
  check(`${code}: old migration keeps old records and archives without current completion`, Object.keys(oldAnswers).every(id => JSON.stringify(migration.answers[id]) === JSON.stringify(oldAnswers[id])) && migration.completedAt === undefined && migration.previousRevisionCompletedAt === 23 && migration.archivedRevisions['audit-sentinel'] !== undefined && newIds.every(id => migration.answers[id] === undefined), { revision: migration.unitRevision, answerCount: Object.keys(migration.answers).length });
  await seed({}, data.unit.revision); await page.reload(); await page.waitForTimeout(150);
  check(`${code}: isolated Store reload retains unanswered state`, (await ids()).length > 0 && await page.locator('[data-testid^="resolved-"]').count() === 0);
 }
 check('actual app has no uncaught page errors', pageErrors.length === 0, { pageErrors }); await context.close();
} catch (error) { report.failures.push({ name: 'probe execution', status: 'FAIL', error: String(error), stack: error.stack }); }
finally { await browser?.close(); report.status = report.failures.length ? 'FAIL_TECHNICAL_DOM' : 'PASS_BOUNDED_TECHNICAL_DOM'; await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n'); console.log(JSON.stringify({ output, status: report.status, checks: report.domChecks.length, failures: report.failures })); if (report.failures.length) process.exitCode = 1; }
