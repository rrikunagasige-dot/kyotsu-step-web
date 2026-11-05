// P-W050-001 CI-only verification. Run from the immutable app checkout root.
// APP_URL (or BASE_URL), SOURCE_SHA (or CANDIDATE_SHA), EVIDENCE_DIR are required.
// STORAGE_KEY defaults to the existing public namespace. No real user context is used.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire(path.resolve('package.json'));
const work = 'work/items/W-MATH-050-n0107-layout-prose';
const base = process.env.APP_URL ?? process.env.BASE_URL;
const sourceSHA = process.env.SOURCE_SHA ?? process.env.CANDIDATE_SHA;
const storageKey = process.env.STORAGE_KEY ?? 'kyotsu-step-gate3-math-20261023';
assert.ok(base && /^https?:\/\//.test(base), 'Explicit HTTP APP_URL/BASE_URL required');
assert.match(sourceSHA ?? '', /^[0-9a-f]{40}$/, 'Explicit full SOURCE_SHA/CANDIDATE_SHA required');
assert.ok(process.env.EVIDENCE_DIR, 'Explicit temporary EVIDENCE_DIR required');
const out = path.resolve(process.env.EVIDENCE_DIR), root = process.cwd();
const relativeOut = path.relative(root, out);
assert.ok(relativeOut.startsWith('..' + path.sep) || path.isAbsolute(relativeOut), 'Evidence must be outside app source checkout');
assert.ok(!fs.existsSync(path.join(out, 'REPORT.json')), 'Use a fresh evidence directory; original attempts must not be overwritten');
fs.mkdirSync(out, { recursive: true });
const digest = b => crypto.createHash('sha256').update(b).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + '\n');
const report = { schema: 'w050-stage1-browser/1', status: 'RUNNING', sourceSHA, toolHeadSHA: process.env.GITHUB_SHA ?? null,
  base, storageKey, widths: [320, 390, 430, 1440], cases: [], failures: [], images: [],
  limits: ['Actual Chromium CI operations only when executed; this script is not an execution receipt.',
    'N04 r7 first stage only; other stages/units receive attribute-absence checks, not exhaustive content regression.',
    'Relation-column DOM positions are measured separately from expression/body starts; this does not prove every glyph or mathematical equivalence.',
    'Synthetic same-revision saves use fresh contexts and do not inspect or migrate real learner history.',
    'No all-mode, all-browser, all-input-order, accessibility, user-acceptance or native workflow PASS claim.'] };
let browser, ssr, activePage;
const unitId = 'math-numbers-expressions-n04', stageId = 'heading-four-products';
const sampleSelector = '[data-n04-sample-stage="heading-four-products"]';
const allSampleAttributes = '[data-n04-sample-stage],[data-n04-sample-chain],[data-n04-sample-block],[data-n04-sample-spacing]';
const ids = ['n04-q01-p1', 'n04-q01-p2', 'n04-q01-p3', 'n04-q01-p4', 'n04-01'];
const sentinel = { unitId: 'w050-unrelated-sentinel', unitRevision: 1, startedAt: 10, updatedAt: 11, answers: {} };
let unit, stageBlocks, plan, visibleChoices, normalize, isResolved, expectedGroups;
const urlFor = code => {
  const url = new URL(base); url.searchParams.set('source', sourceSHA);
  url.hash = '/learning/textbook/math-numbers-expressions-' + code; return url.href;
};
async function settled(page) {
  await page.evaluate(async () => { await document.fonts.ready; await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
}
async function progress(page) {
  return page.evaluate(({ key, id }) => JSON.parse(localStorage.getItem(key) ?? 'null')?.state?.textbookProgress?.[id] ?? null,
    { key: storageKey, id: unitId });
}
async function image(page, name) {
  const filename = name.replace(/[^a-zA-Z0-9_-]/g, '-') + '.png', filenamePath = path.join(out, filename);
  await page.screenshot({ path: filenamePath, fullPage: true });
  const bytes = fs.readFileSync(filenamePath);
  report.images.push({ file: filename, sha256: digest(bytes), bytes: bytes.length, sourceSHA, url: page.url() });
  return filename;
}
async function captureFailure(row) {
  if (!activePage || activePage.isClosed()) return;
  try { row.failureImage = await image(activePage, row.name + '-FAIL'); } catch (e) { row.screenshotError = String(e); }
  try { row.failureDOM = await activePage.locator('main').innerText({ timeout: 1500 }); } catch { /* retain primary failure */ }
}
async function runCase(name, fn) {
  const row = { name, sourceSHA, status: 'RUNNING', measurements: [] }; report.cases.push(row);
  try { await fn(row); row.status = 'PASS'; }
  catch (e) {
    row.status = 'FAIL'; row.error = e.stack ?? String(e);
    report.failures.push({ name, error: e.message, url: activePage?.url() ?? null });
    if (activePage && !activePage.isClosed()) {
      await captureFailure(row);
    }
  } finally { save('REPORT.json', report); }
}
function expectedVisible(resolvedIds) {
  const stop = stageBlocks.findIndex(b => (b.parts ?? []).some(p => p.type === 'choice' && !resolvedIds.includes(p.itemId)));
  return (stop < 0 ? stageBlocks : stageBlocks.slice(0, stop + 1)).filter(b => b.type === 'formula').map(b => b.id);
}
async function measure(page, scope, label, row, resolvedIds, { card = false, screenshot = true } = {}) {
  await scope.waitFor({ state: 'visible' }); await settled(page);
  const expectedFormulaIds = expectedVisible(resolvedIds);
  const measured = await scope.evaluate((scope, { ids, formulaIds, numbers }) => {
    const visible = el => Boolean(el.getClientRects().length) && !el.closest('details:not([open])') && !el.closest('.typeset-probe,.typeset-inline-probe');
    const rect = el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
    const style = el => { const s = getComputedStyle(el); return { fontSize: s.fontSize, lineHeight: s.lineHeight, border: [s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.borderLeftWidth].map(parseFloat), padding: [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft].map(parseFloat), boxShadow: s.boxShadow }; };
    const blocks = [...scope.querySelectorAll('[data-n04-sample-block]')];
    const formulas = blocks.flatMap(block => [...block.querySelectorAll('[data-typeset-source]')]
      .filter(el => el.dataset.typesetSource === block.dataset.n04SampleBlock && visible(el)));
    const issues = [], groups = {};
    for (const formula of formulas) {
      const bounds = formula.getBoundingClientRect(), group = formula.dataset.typesetGroup;
      const rows = [...formula.querySelectorAll('.typeset-line')].filter(visible);
      const body = formula.querySelector('.typeset-formula-body,.typeset-table');
      const relationRows = rows.flatMap(r => [...r.querySelectorAll('.typeset-relation')].filter(visible).map(el => ({ formulaId: formula.dataset.typesetSource, relationLeft: el.getBoundingClientRect().left, expressionLeft: r.getBoundingClientRect().left, bodyLeft: body?.getBoundingClientRect().left ?? null })));
      if (group) (groups[group] ??= []).push(...relationRows);
      for (const el of formula.querySelectorAll('.typeset-line .katex,.typeset-line .reading-formula-choice')) {
        if (!visible(el)) continue; const r = el.getBoundingClientRect();
        if (r.width && (r.left < bounds.left - 1 || r.right > bounds.right + 1)) issues.push({ kind: 'formula-clipping', id: formula.dataset.typesetSource, bounds: rect(formula), element: rect(el) });
      }
      const equation = formula.closest('.numbered-equation'), tag = equation?.querySelector('.numbered-equation-label');
      if (numbers[formula.dataset.typesetSource] !== undefined) {
        if (!tag || tag.textContent !== '(' + numbers[formula.dataset.typesetSource] + ')') issues.push({ kind: 'missing-or-wrong-number', id: formula.dataset.typesetSource, actual: tag?.textContent ?? null });
        if (tag) {
          const t = tag.getBoundingClientRect();
          for (const el of formula.querySelectorAll('.typeset-line .katex,.reading-formula-choice')) {
            if (!visible(el)) continue; const r = el.getBoundingClientRect();
            if (r.width && r.left < t.right - 1 && r.right > t.left + 1 && r.top < t.bottom - 1 && r.bottom > t.top + 1) issues.push({ kind: 'number-collision', id: formula.dataset.typesetSource, tag: rect(tag), element: rect(el) });
          }
          if (t.left < -1 || t.right > innerWidth + 1) issues.push({ kind: 'number-outside-viewport', id: formula.dataset.typesetSource, tag: rect(tag) });
        }
      }
    }
    for (const option of scope.querySelectorAll('.reading-choice-option')) {
      if (!visible(option)) continue; const r = option.getBoundingClientRect();
      if (r.left < -1 || r.right > innerWidth + 1) issues.push({ kind: 'choice-outside-viewport', element: rect(option) });
      for (const m of option.querySelectorAll('.katex-html')) { const mr = m.getBoundingClientRect(); if (mr.width && (mr.left < r.left - 1 || mr.right > r.right + 1)) issues.push({ kind: 'choice-math-clipping', element: rect(m), option: rect(option) }); }
    }
    const controls = [...scope.querySelectorAll('button[data-testid^="textbook-item-"]')].filter(visible).map(el => ({ id: el.dataset.testid, ...rect(el) }));
    const paragraphs = blocks.flatMap(b => [...b.querySelectorAll(':scope > .reading-block-with-choice > .reading-paragraph')].filter(visible).map(el => ({ blockId: b.dataset.n04SampleBlock, ...style(el) })));
    const groupRows = Object.entries(groups).map(([id, rows]) => ({ id, rows, relationDelta: Math.max(...rows.map(r => r.relationLeft)) - Math.min(...rows.map(r => r.relationLeft)), expressionDelta: Math.max(...rows.map(r => r.expressionLeft)) - Math.min(...rows.map(r => r.expressionLeft)), compared: rows.length >= 2 }));
    return { url: location.href, viewport: innerWidth, pageWidth: document.documentElement.scrollWidth, scopeStyle: style(scope),
      scroll: { x: scrollX, y: scrollY, maxY: Math.max(0, document.documentElement.scrollHeight - innerHeight) },
      formulaScrolls: formulas.map(el => ({ id: el.dataset.typesetSource, left: el.scrollLeft, clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, applicability: el.scrollWidth > el.clientWidth + 1 ? 'OVERFLOW_PRESENT' : 'NOT_APPLICABLE_NO_OVERFLOW' })),
      formulaIds: formulas.map(el => el.dataset.typesetSource), expectedFormulaIds: formulaIds,
      sourceAnnotations: formulas.map(el => ({ id: el.dataset.typesetSource, tex: [...el.querySelectorAll('annotation[encoding="application/x-tex"]')].map(a => a.textContent) })),
      groupRows, controls, paragraphs, formulaFonts: formulas.flatMap(el => [...el.querySelectorAll('.typeset-line')].filter(visible).map(r => ({ id: el.dataset.typesetSource, fontSize: getComputedStyle(r).fontSize }))),
      chainStyles: [...scope.querySelectorAll('[data-n04-sample-chain]')].map(el => style(el)),
      blockGaps: blocks.map((el, i) => ({ id: el.dataset.n04SampleBlock, previousId: blocks[i - 1]?.dataset.n04SampleBlock ?? null,
        gap: i ? el.getBoundingClientRect().top - blocks[i - 1].getBoundingClientRect().bottom : null })),
      unresolved: controls.map(c => c.id.replace('textbook-item-', '')).filter(id => ids.includes(id)), issues, katexErrors: scope.querySelectorAll('.katex-error').length };
  }, { ids, formulaIds: expectedFormulaIds, numbers: plan.equationNumbers });
  const entry = { label, sourceSHA, resolvedIds, ...measured }; row.measurements.push(entry);
  // Persist original measured failures before any assertion throws.
  save('REPORT.json', report);
  assert.ok(measured.pageWidth <= measured.viewport + 1, label + ': page overflow');
  assert.deepEqual(measured.issues, [], label + ': clipping/number issues');
  assert.equal(measured.katexErrors, 0, label + ': KaTeX errors');
  assert.deepEqual(measured.formulaIds, expectedFormulaIds, label + ': canonical formula order/gating');
  const nextID = ids.find(id => !resolvedIds.includes(id));
  assert.deepEqual(measured.unresolved, nextID ? [nextID] : [], label + ': exact pending frontier');
  for (const c of measured.controls) assert.ok(c.width >= 44 - .1 && c.height >= 44 - .1, label + ': control below44px ' + c.id);
  assert.ok(measured.paragraphs.length > 0, label + ': scoped paragraphs must exist');
  for (const p of measured.paragraphs) { assert.equal(parseFloat(p.fontSize), 18, label + ': prose18px'); assert.ok(Math.abs(parseFloat(p.lineHeight) - 32.4) <= .2, label + ': prose line-height1.8'); }
  for (const f of measured.formulaFonts) assert.equal(parseFloat(f.fontSize), 18, label + ': math18px');
  for (const g of measured.groupRows) if (g.compared) assert.ok(g.relationDelta <= 1, label + ': group relation delta ' + g.id + '=' + g.relationDelta);
  if (resolvedIds.length === 5) for (const g of expectedGroups) assert.ok(measured.groupRows.some(row => row.id === g && row.compared), label + ': both peer relations must be measured ' + g);
  for (const chain of measured.chainStyles) { assert.deepEqual(chain.border, [0, 0, 0, 0]); assert.deepEqual(chain.padding, [0, 0, 0, 0]); }
  for (const block of measured.blockGaps.filter(b => b.previousId)) {
    const purpose = /^n04-bridge-worked-n04-q01-p[1-4]-before-0-lead$/.test(block.id)
      || ['n04-s4-square-plan', 'paragraph-n04-collect-without-combining'].includes(block.id);
    const reasonEquation = /^n04-bridge-worked-n04-q01-p[1-4]-before-0-equation-0$/.test(block.id);
    const expectedGap = purpose ? 24 : reasonEquation ? 8 : 12;
    assert.ok(Math.abs(block.gap - expectedGap) <= 1, label + ': semantic block gap ' + block.id + '=' + block.gap + ', expected ' + expectedGap);
  }
  if (card) { assert.deepEqual(measured.scopeStyle.border, [0, 0, 0, 0]); assert.deepEqual(measured.scopeStyle.padding, [0, 0, 0, 0]); assert.equal(measured.scopeStyle.boxShadow, 'none'); }
  if (screenshot) entry.image = await image(page, row.name + '-' + label);
}
async function openN04(context, row) {
  const page = await context.newPage(); activePage = page;
  row.pageErrors = []; page.on('pageerror', e => row.pageErrors.push(e.message));
  page.setDefaultTimeout(12000); await page.goto(urlFor('n04'));
  await page.getByTestId('math-textbook-stage-' + stageId).waitFor();
  await page.locator('.math-textbook-stage--current' + sampleSelector).waitFor(); return page;
}
async function assertStoreSentinel(page) {
  const actual = await page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? 'null')?.state?.textbookProgress?.['w050-unrelated-sentinel'], storageKey);
  assert.deepEqual(actual, sentinel, 'unrelated synthetic save preserved');
}
async function reset(page, row, expectedResolved) {
  const before = await progress(page); page.once('dialog', d => d.dismiss()); await page.locator('.textbook-reset').click();
  assert.deepEqual(await progress(page), before, 'reset cancellation preserves exact progress');
  page.once('dialog', d => d.accept()); await page.locator('.textbook-reset').click();
  await page.getByTestId('textbook-item-' + ids[0]).waitFor();
  assert.equal(await progress(page), null, 'NE04 ordinary reset removes only its saved unit');
  await assertStoreSentinel(page); await page.reload(); await page.getByTestId('textbook-item-' + ids[0]).waitFor();
  await measure(page, page.locator('.math-textbook-stage--current' + sampleSelector), 'reset-reload', row, [], { card: true });
  row.reset = { cancelPreserved: true, actualReset: true, reload: true, sentinelPreserved: true, fromResolvedIds: expectedResolved };
}
try {
  report.actualCheckoutSHA = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  assert.equal(report.actualCheckoutSHA, sourceSHA, 'sourceSHA must identify actual material checkout');
  const approved = read(work + '/evidence/APPROVED_PATCH.json');
  assert.deepEqual(approved.files.map(file => file.path).sort(), [
    'src/data/textbook/math/numbers/firstSectionTeaching.json',
    'src/pages/TextbookUnitPage.tsx',
    'src/components/textbook/n04-sample-reading.css',
  ].sort(), 'Exact three approved product paths required');
  report.approvedPatchSHA256 = digest(fs.readFileSync(work + '/evidence/APPROVED_PATCH.json'));
  report.productHashes = approved.files.map(file => {
    const actual = digest(fs.readFileSync(file.path)); assert.equal(actual, file.after_sha256, file.path + ': approved after bytes required');
    assert.equal(digest(file.after_text), file.after_sha256, file.path + ': after text binding'); return { path: file.path, sha256: actual };
  });
  const { createServer } = await import(pathToFileURL(require.resolve('vite')).href);
  ssr = await createServer({ configFile: false, server: { middlewareMode: true }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
  const module = await ssr.ssrLoadModule('/src/data/textbook/math/numbers/n04Lesson.ts');
  const domain = await ssr.ssrLoadModule('/src/domain/textbook.ts');
  normalize = domain.normalizeTextbookAnswer; isResolved = domain.isTextbookItemResolved;
  unit = JSON.parse(JSON.stringify(module.mathNumbersN04Unit)); assert.equal(unit.revision, 7);
  plan = read('src/data/textbook/math/numbers/firstSectionTeaching.json').n04;
  const start = unit.sections[0].readingFlow.findIndex(b => b.id === plan.stages[0][0]);
  const end = unit.sections[0].readingFlow.findIndex(b => b.id === plan.stages[1][0]);
  assert.equal(plan.stages[0][0], stageId); assert.equal(start, 0); assert.ok(end > 0);
  stageBlocks = unit.sections[0].readingFlow.slice(start, end);
  assert.deepEqual(stageBlocks.flatMap(b => (b.parts ?? []).filter(p => p.type === 'choice').map(p => p.itemId)), ids);
  visibleChoices = Object.fromEntries(unit.sections[0].items.map(item => [item.id, domain.getTextbookChoices(unit, item)]));
  const groups = read('src/data/textbook/math/typesetting.json').groups.n04;
  expectedGroups = ids.slice(0, 4).map((_, i) => 'n04-g' + groups.findIndex(group => group.includes('formula-n04-q01-p' + (i + 1))));
  assert.ok(!expectedGroups.includes('n04-g-1'));
  save('FIXTURE.json', { sourceSHA, kind: 'ACTUAL_MODULE_EXPORT_FOR_CI_NOT_BROWSER_PROOF', unit, stageBlocks, visibleChoices, expectedGroups, equationNumbers: plan.equationNumbers });
  report.fixture = { file: 'FIXTURE.json', sha256: digest(fs.readFileSync(path.join(out, 'FIXTURE.json'))), revision: unit.revision,
    unitAnswers: unit.sections[0].items.length, stageIds: ids, expectedGroups,
    formulaContract: stageBlocks.filter(b => b.type === 'formula').map(b => ({ id: b.id, parts: b.parts, equationNumber: plan.equationNumbers[b.id] })) };
  await ssr.close(); ssr = undefined;
  const { chromium } = require('@playwright/test'); browser = await chromium.launch({ headless: true });
  for (const width of report.widths) {
    await runCase('actual-' + width, async row => {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      try {
        const page = await openN04(context, row);
        await page.evaluate(({ key, sentinel }) => { const value = JSON.parse(localStorage.getItem(key) ?? '{"state":{},"version":1}'); value.state.textbookProgress ??= {}; value.state.textbookProgress[sentinel.unitId] = sentinel; localStorage.setItem(key, JSON.stringify(value)); }, { key: storageKey, sentinel });
        // Reload makes the real store ingest the synthetic unrelated record before any answer.
        await page.reload(); await page.getByTestId('textbook-item-' + ids[0]).waitFor();
        const scope = page.locator('.math-textbook-stage--current' + sampleSelector), resolved = [];
        await measure(page, scope, 'initial', row, resolved, { card: true }); row.answers = [];
        for (const id of ids) {
          const item = unit.sections[0].items.find(i => i.id === id), choices = visibleChoices[id];
          const isCorrect = choice => [item.answer, ...(item.acceptedAnswers ?? [])].some(v => normalize(v) === normalize(choice));
          const wrongs = choices.filter(choice => !isCorrect(choice)); assert.ok(wrongs.length > 0, id + ': actual wrong choices required');
          let wrongCount = 0;
          for (const wrong of wrongs) {
            await page.getByTestId('textbook-item-' + id).click();
            const panel = page.getByTestId('inline-choice-panel-' + id); await panel.waitFor();
            assert.equal(await panel.locator('.reading-choice-option').count(), choices.length);
            await measure(page, scope, id + '-option-' + wrongCount, row, resolved, { card: true, screenshot: false });
            await panel.getByRole('button', { name: wrong, exact: true }).click();
            const saved = await progress(page); assert.ok(saved?.answers?.[id] && !isResolved(item, saved.answers[id]), id + ': wrong remains unresolved');
            await page.getByTestId('textbook-item-' + id).click(); await page.getByTestId('textbook-hint-' + id).waitFor();
            await measure(page, scope, id + '-wrong-' + wrongCount, row, resolved, { card: true, screenshot: wrongCount === 0 });
            // The reopened panel may stay open until the next distinct choice.
            wrongCount++;
          }
          await page.getByTestId('textbook-item-' + id).click();
          await page.getByTestId('inline-choice-panel-' + id).getByRole('button', { name: item.answer, exact: true }).click();
          resolved.push(id); await page.getByTestId('resolved-' + id).first().waitFor();
          const saved = await progress(page); assert.ok(isResolved(item, saved?.answers?.[id]), id + ': real correct answer persisted');
          await assertStoreSentinel(page);
          row.answers.push({ id, correctValue: item.answer, displayedChoices: choices, wrongChoicesExercised: wrongs, wrongCount, correctPersisted: true });
          await measure(page, scope, 'correct-' + resolved.length, row, resolved, { card: true });
        }
        row.verticalScroll = await page.evaluate(() => { window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }); return { maxY: Math.max(0, document.documentElement.scrollHeight - innerHeight) }; });
        await settled(page); row.verticalScroll.actualY = await page.evaluate(() => scrollY);
        row.verticalScroll.applicability = row.verticalScroll.maxY > 1 ? 'SCROLLED_REAL_PAGE' : 'NOT_APPLICABLE_NO_VERTICAL_OVERFLOW';
        if (row.verticalScroll.maxY > 1) assert.ok(row.verticalScroll.actualY > 0, 'real page scroll should move when vertically overflowing');
        await page.getByTestId('math-textbook-next-stage').click();
        await page.getByTestId('math-textbook-stage-' + plan.stages[1][0]).waitFor();
        assert.equal(await page.locator(allSampleAttributes).count(), 0, 'stage2 has no sample attributes before history opens');
        row.nextStageImage = await image(page, row.name + '-next-stage');
        await page.getByTestId('math-textbook-history-toggle').click(); await page.getByTestId('math-textbook-toggle-' + stageId).click();
        const history = page.locator('#math-textbook-stage-detail-' + stageId + sampleSelector);
        await measure(page, history, 'history', row, ids);
        for (const container of ['.first-theme-recorded-results', '.math-textbook-stage-reference-content']) {
          const count = await page.locator(container).evaluateAll(nodes => nodes.reduce((n, node) => n + Number(node.matches('[data-n04-sample-stage],[data-n04-sample-chain],[data-n04-sample-block],[data-n04-sample-spacing]')) + node.querySelectorAll('[data-n04-sample-stage],[data-n04-sample-chain],[data-n04-sample-block],[data-n04-sample-spacing]').length, 0));
          assert.equal(count, 0, container + ': summary/reference excluded');
        }
        await page.reload(); await page.getByTestId('math-textbook-stage-' + plan.stages[1][0]).waitFor();
        for (const id of ids) assert.ok(isResolved(unit.sections[0].items.find(i => i.id === id), (await progress(page))?.answers?.[id]));
        assert.equal(await page.locator(allSampleAttributes).count(), 0, 'reloaded stage2 has no sample scope');
        await reset(page, row, ids); assert.deepEqual(row.pageErrors, []);
      } catch (e) { await captureFailure(row); throw e; } finally { await context.close(); }
    });
    for (const state of ['unanswered', 'partial', 'completed']) await runCase('synthetic-r7-' + state + '-' + width, async row => {
      const items = state === 'completed' ? unit.sections[0].items : state === 'partial' ? ids.slice(0, 2).map(id => unit.sections[0].items.find(i => i.id === id)) : [];
      const answers = Object.fromEntries(items.map(item => [item.id, { itemId: item.id, value: item.answer, firstValue: 'synthetic-earlier-wrong', resolved: true, isFirstCorrect: false, attemptCount: 2, firstAnsweredAt: 1, lastAnsweredAt: 2 }]));
      const saved = { unitId, unitRevision: 7, startedAt: 1, updatedAt: 2, ...(state === 'completed' ? { completedAt: 3 } : {}), answers };
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      try {
        await context.addInitScript(({ key, id, saved, sentinel }) => { if (!localStorage.getItem('w050-fixture-seeded')) { localStorage.setItem(key, JSON.stringify({ state: { textbookProgress: { [id]: saved, [sentinel.unitId]: sentinel } }, version: 1 })); localStorage.setItem('math-textbook-compact-v1:' + id + ':r7', '0'); localStorage.setItem('w050-fixture-seeded', 'true'); } }, { key: storageKey, id: unitId, saved, sentinel });
        const page = await openN04(context, row); assert.deepEqual(await progress(page), saved, 'same-revision synthetic record preserved');
        const resolved = ids.filter(id => answers[id]);
        await measure(page, page.locator('.math-textbook-stage--current' + sampleSelector), 'restored', row, resolved, { card: true });
        await page.reload(); await page.getByTestId('math-textbook-stage-' + stageId).waitFor();
        assert.deepEqual(await progress(page), saved, 'synthetic save reload preserves complete record'); await assertStoreSentinel(page);
        await reset(page, row, resolved); assert.deepEqual(row.pageErrors, []); row.fixture = { kind: 'SYNTHETIC_SAME_REVISION_7_NOT_REAL_LEARNER_HISTORY', state, seededAnswerCount: items.length, completeUnit: state === 'completed' };
      } catch (e) { await captureFailure(row); throw e; } finally { await context.close(); }
    });
    for (const code of ['ne01', 'n07', 'n11', 'n13']) await runCase('scope-' + code + '-' + width, async row => {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      try { const page = await context.newPage(); activePage = page; row.pageErrors = []; page.on('pageerror', e => row.pageErrors.push(e.message)); page.setDefaultTimeout(12000); await page.goto(urlFor(code)); await page.getByTestId('textbook-reading-flow').waitFor(); await settled(page);
        row.sampleAttributeCount = await page.locator(allSampleAttributes).count();
        assert.equal(row.sampleAttributeCount, 0); assert.deepEqual(row.pageErrors, []); row.url = page.url(); row.image = await image(page, row.name);
      } catch (e) { await captureFailure(row); throw e; } finally { await context.close(); }
    });
  }
  assert.equal(report.cases.length, 32, 'All declared width/case combinations must be attempted');
  report.status = report.failures.length ? 'FAIL' : 'PASS_DECLARED_BROWSER_SCOPE';
} catch (e) {
  report.status = 'FAIL'; report.failures.push({ name: 'setup-or-uncaught', error: e.stack ?? String(e) });
} finally {
  if (ssr) await ssr.close(); if (browser) await browser.close();
  report.finishedAt = new Date().toISOString(); save('REPORT.json', report);
  console.log(JSON.stringify({ status: report.status, sourceSHA, cases: report.cases.length, failures: report.failures.length, report: path.join(out, 'REPORT.json') }));
}
if (report.status !== 'PASS_DECLARED_BROWSER_SCOPE') process.exitCode = 1;
