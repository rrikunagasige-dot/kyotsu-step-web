// B authored this bounded verification script, not the textbook or its product patch.
// Root runs CODE once. This script never writes product source or native Store/Git.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const root = path.resolve(process.env.W048_APP_ROOT || process.cwd());
const require = createRequire(path.join(root, 'package.json'));
const { chromium } = require('@playwright/test');
const { createServer } = await import(require.resolve('vite'));
const out = process.env.EVIDENCE_DIR;
assert.ok(out && path.isAbsolute(out), 'Explicit absolute temporary evidence output required');
const resolvedOut = path.resolve(out);
// CI may place evidence under RUNNER_TEMP. Refuse any repository-owned path,
// including source/Store/Work, regardless of the chosen temporary root.
assert.ok(resolvedOut !== root && !resolvedOut.startsWith(root + path.sep), 'Evidence output must be outside the repository');
assert.ok(!root.startsWith(resolvedOut + path.sep), 'Evidence output must not contain the repository');
assert.ok(process.env.W048_FIXTURES && process.env.APP_URL, 'Current fixtures and built-app URL required');
fs.mkdirSync(out, { recursive: true });
const input = JSON.parse(fs.readFileSync(process.env.W048_FIXTURES, 'utf8'));
if (process.env.CANDIDATE_SHA) assert.equal(input.sourceSHA, process.env.CANDIDATE_SHA);
const f = input.fixtures.find(x => x.code === 'n14');
assert.ok(f, 'N14 must be formally applied and eligible in verify_current fixtures');
const { unit, legacy, contract, visibleChoices } = f;
assert.equal(unit.revision, 11); assert.equal(legacy.revision, 10);
const section = unit.sections[0], flow = section.readingFlow;
const items = new Map(section.items.map(i => [i.id, i]));
assert.equal(items.size, 41, 'Approved N14 has 41 judgments');
const record = i => ({ itemId: i.id, value: i.answer, firstValue: 'old-wrong-first', resolved: true,
  isFirstCorrect: false, attemptCount: 3, firstAnsweredAt: 111, lastAnsweredAt: 222 });
const slotsOf = b => (b.parts || []).filter(p => p.type === 'choice').map(p => p.itemId);
const multi = flow.map((block, index) => ({ block, index, slots: slotsOf(block) })).filter(x => x.slots.length > 1);
assert.equal(multi.reduce((n, x) => n + 2 ** x.slots.length, 0), 44, 'Includes completed masks, not three-state permutations');
const expectedNumbers = Object.values(contract.equationNumbers).sort((a, b) => a - b);
assert.equal(expectedNumbers.length, 20);
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const report = { schemaVersion: 'w048-n14-browser-extended/1', status: 'RUNNING', sourceSHA: input.sourceSHA,
  author: 'B: verification script only; textbook/product author separation retained',
  scope: 'Applied N14 r11 extra R07 evidence; root separately runs all-displayed-wrong-choice capture_current',
  actualProductHashes: Object.fromEntries(['src/pages/TextbookUnitPage.tsx', 'src/domain/textbook.ts',
    'src/data/textbook/math/numbers/n13Lesson.ts', 'src/data/textbook/math/numbers/n14Lesson.ts'].map(p => [p, sha(path.join(root, p))])),
  rows: [], failures: [], images: [], limits: [
    'Binary masks mean resolved/unanswered per same-row slot; wrong/resolved/unanswered Cartesian products are not claimed.',
    'The 44 masks are rendered state snapshots; clicking every remaining slot from every mask is not exhaustively covered.',
    'later-row-withheld checks unresolved choice buttons only; it does not exhaustively inspect future static prose or completed-formula answer leakage.',
    'Old saves and partial masks are synthetic records seeded into real browser persistence, never user data.',
    'Independent seed-record/archive assertions and the approved re-key allowlist are primary old-save checks. SSR actual effectiveTextbookProgress is supplementary, not an independent migration oracle.',
    'Formula-start/computed alignment is bounded geometry, not proof of all relation-glyph positions or visual teaching quality.',
    'Real formula answers test wrong/correct post-answer scroll at every encountered formula judgment; manual20 retention requires a different visible row with at least 20px real overflow. Visible-row geometry inventories support explicit NOT_APPLICABLE_NO_OVERFLOW results; zero offsets alone do not establish manual20 retention.',
    'Correct answers alternate pointer/Enter; this is not all-41-ID keyboard coverage. Manual20 retention is after another row answer, not reload persistence.',
    'N14 is the last numbers unit: existing catalog has no next-chapter link. Test actual return-to-setup and written quadratic-function bridge.',
    'No hosted-source, user acceptance, semantic review, all-mode regression, or native R07 PASS is created by this script.'
  ] };
function check(ok, label, detail) { if (!ok) report.failures.push({ label, detail }); }

// Explicitly approved old-key reopening boundaries, read from the existing
// W003/P004, W003/P004-R2 and W018/W019/W020/W022 migrations. This constant is
// independent of the migration function used by the browser under test.
const approvedReopens = revision => new Set([
  ...(revision <= 1 ? ['n14-06', 'n14-11'] : []),
  ...(revision <= 6 ? ['n14-10'] : []),
  ...(revision <= 7 ? ['n14-14'] : []),
  ...(revision <= 8 ? ['n14-15'] : []),
  ...(revision <= 9 ? ['n14-16'] : []),
]);
// Retain real-domain expectations only as a supplemental consistency check.
// The browser must separately satisfy the seed-based invariants below.
const ssr = await createServer({ root, configFile: false, server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
const migrationCases = [];
try {
  const { effectiveTextbookProgress } = await ssr.ssrLoadModule('/src/domain/textbook.ts');
  for (let revision = 1; revision <= legacy.revision; revision++) for (const completed of [false, true]) {
    const seed = { unitId: unit.unitId, unitRevision: revision, startedAt: 11, updatedAt: 22,
      answers: Object.fromEntries(legacy.sections[0].items.map(i => [i.id, record(i)])),
      archivedRevisions: { 'audit-sentinel': { unitRevision: 1, startedAt: 1, updatedAt: 2, answers: {} } },
      ...(completed ? { completedAt: 33 } : {}) };
    const expected = effectiveTextbookProgress(unit, seed);
    assert.ok(expected && expected.unitRevision === 11 && expected.completedAt === undefined);
    assert.deepEqual(effectiveTextbookProgress(unit, expected), expected, 'Actual domain migration is idempotent');
    migrationCases.push({ revision, completed, seed, expected });
  }
} finally { await ssr.close(); }

const browser = await chromium.launch({ headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  for (const width of [320, 390, 430, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage(); page.setDefaultTimeout(15000);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    const row = { width, answered: [], figures: [], measurements: [], masks: [], saves: [], navigation: [], images: [], scrollProbes: [], alignmentCoverage: {} };
    report.rows.push(row);
    await page.addInitScript(() => {
      window.__w048N14ScrollCalls = [];
      const original = Element.prototype.scrollTo;
      Element.prototype.scrollTo = function (...args) {
        if (this.dataset?.testid?.startsWith('textbook-formula-')) window.__w048N14ScrollCalls.push({ id: this.dataset.testid, args });
        return original.apply(this, args);
      };
    });
    const route = id => process.env.APP_URL + '#/learning/textbook/' + id;
    const ids = () => page.locator('button[data-testid^="textbook-item-"]:visible').evaluateAll(ns => ns.map(n => n.dataset.testid.slice('textbook-item-'.length)));
    async function open(id = unit.unitId) {
      await page.goto(route(id)); await page.getByTestId('textbook-reading-flow').waitFor(); await page.evaluate(() => document.fonts.ready);
    }
    async function nextUntilPending() {
      for (let n = 0; n < 100; n++) {
        const pending = await ids(); if (pending.length) return pending;
        const next = page.getByTestId('math-textbook-next-stage'); if (!await next.count()) return [];
        await next.click();
      }
      throw Error('Compact-stage traversal exceeded bound');
    }
    async function expandHistory() {
      const toggle = page.getByTestId('math-textbook-history-toggle');
      if (await toggle.count()) {
        if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
        const all = page.getByTestId('math-textbook-expand-all');
        if (await all.count() && await all.getAttribute('aria-expanded') !== 'true') await all.click();
      }
    }
    async function choose(id, value, keyboard = false) {
      await page.getByTestId('textbook-item-' + id).click();
      const panel = page.getByTestId('inline-choice-panel-' + id); await panel.waitFor();
      const option = panel.getByRole('button', { name: value, exact: true });
      if (keyboard) { await option.focus(); await page.keyboard.press('Enter'); } else await option.click();
      await panel.waitFor({ state: 'detached' });
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    }
    // Instrument an actual answer rather than inferring the scroll effect from
    // styles. Different-row selection excludes the entire current formula, so
    // another slot on that same formula cannot masquerade as an unrelated row.
    async function chooseWithScrollProbe(id, value, state, keyboard = false) {
      const button = page.getByTestId('textbook-item-' + id);
      await button.click();
      const panel = page.getByTestId('inline-choice-panel-' + id); await panel.waitFor();
      const option = panel.getByRole('button', { name: value, exact: true });
      if (keyboard) await option.focus();
      const before = await button.evaluate(e => {
        const current = e.closest('[data-testid^="textbook-formula-"]');
        const root = e.closest('[data-testid="textbook-reading-flow"]');
        const read = n => n && ({ id: n.dataset.testid, scrollLeft: n.scrollLeft,
          scrollWidth: n.scrollWidth, clientWidth: n.clientWidth, connected: n.isConnected });
        const visible = [...root.querySelectorAll('[data-testid^="textbook-formula-"]')].filter(n => n.getClientRects().length);
        const other = current && visible.find(n => n !== current && n.scrollWidth - n.clientWidth >= 20);
        if (current) current.scrollLeft = 20;
        if (other) other.scrollLeft = 20;
        window.__w048N14ScrollCalls = [];
        return { target: read(current), unrelated: read(other), visibleFormulaGeometry: visible.map(read) };
      });
      // Push before the interaction so an actual execution error retains its
      // attempted target, seeded offset and state in the original FAIL report.
      const probe = { id, state, method: keyboard ? 'Enter' : 'pointer', before, status: 'RUNNING' };
      row.scrollProbes.push(probe);
      if (keyboard) await page.keyboard.press('Enter'); else await option.click();
      await panel.waitFor({ state: 'detached' });
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      probe.after = await page.getByTestId('textbook-reading-flow').evaluate((root, before) => {
        const read = prior => {
          const n = prior && root.querySelector(`[data-testid="${prior.id}"]`);
          return n && { id: n.dataset.testid, scrollLeft: n.scrollLeft,
            scrollWidth: n.scrollWidth, clientWidth: n.clientWidth, connected: n.isConnected };
        };
        const visibleFormulaGeometry = [...root.querySelectorAll('[data-testid^="textbook-formula-"]')]
          .filter(n => n.getClientRects().length).map(n => ({ id: n.dataset.testid, scrollLeft: n.scrollLeft,
            scrollWidth: n.scrollWidth, clientWidth: n.clientWidth, connected: n.isConnected }));
        return { target: read(before.target), unrelated: read(before.unrelated), visibleFormulaGeometry, calls: window.__w048N14ScrollCalls };
      }, before);
      probe.answerResolved = await button.count() === 0;
      check(probe.answerResolved === (state === 'correct'), `${width}/${id}/${state}/real-answer-state`, probe);
      if (before.target) {
        check(probe.after.target?.scrollLeft === 0, `${width}/${id}/${state}/target-left-zero`, probe);
        check(probe.after.calls.length === 1 && probe.after.calls[0].id === before.target.id,
          `${width}/${id}/${state}/only-answer-formula-reset`, probe);
        const overflow = before.target.scrollWidth > before.target.clientWidth + 1;
        check(!overflow || before.target.scrollLeft > 0, `${width}/${id}/${state}/real-overflow-seed`, probe);
        probe.targetObservation = before.target.scrollLeft > 0 ? 'ACTUAL_OVERFLOW_OFFSET_RESET'
          : overflow ? 'OVERFLOW_WITHOUT_SEEDED_OFFSET' : 'ZERO_OFFSET_NO_OVERFLOW';
      } else {
        check(probe.after.calls.length === 0, `${width}/${id}/${state}/nonformula-no-reset`, probe);
        probe.targetObservation = 'NONFORMULA_ANSWER';
      }
      if (before.unrelated) {
        check(before.unrelated.scrollLeft === 20 && probe.after.unrelated?.scrollLeft === 20,
          `${width}/${id}/${state}/different-formula-manual20-preserved`, probe);
      }
      probe.status = 'MEASURED';
    }
    async function image(name) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: path.join(out, name + '.png'), fullPage: true }); row.images.push(name + '.png');
    }
    async function measure(label) {
      const data = await page.getByTestId('textbook-reading-flow').evaluate(root => {
        const shown = e => Boolean(e.getClientRects().length), box = e => {
          const b = e.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom }; };
        const formulas = [...root.querySelectorAll('.reading-formula-line')].filter(shown).map(e => {
          const x = e.querySelector('.reading-formula-expression'), m = x?.querySelector('.katex-html');
          return { id: e.dataset.testid, font: getComputedStyle(e).fontSize,
            katex: [...e.querySelectorAll('.katex')].map(k => getComputedStyle(k).fontSize),
            derivation: e.closest('[data-derivation-id]')?.dataset.derivationId,
            justify: x && getComputedStyle(x).justifyContent, justifyItems: x && getComputedStyle(x).justifyItems,
            firstMath: m && box(m), expression: x && box(x), scrollLeft: e.scrollLeft,
            line: box(e), paddingInlineStart: getComputedStyle(e).paddingInlineStart,
            pendingIds: [...e.querySelectorAll('button[data-testid^="textbook-item-"]')].filter(shown).map(n => n.dataset.testid.slice('textbook-item-'.length)),
            resolvedIds: [...e.querySelectorAll('[data-testid^="resolved-"]')].filter(shown).map(n => n.dataset.testid.slice('resolved-'.length)) };
        });
        const numbers = [...root.querySelectorAll('[data-equation-number]')].filter(shown).map(e => {
          const l = e.querySelector('.numbered-equation-label'), label = l && box(l);
          return { number: Number(e.dataset.equationNumber), label,
            formulaIds: [...e.querySelectorAll('[data-testid^="textbook-formula-"]')].map(n => n.dataset.testid.slice('textbook-formula-'.length)),
            collision: label && [...e.querySelectorAll('.katex-html,button')].filter(shown).some(n => {
              const b = box(n); return b.left < label.right && b.right > label.left && b.top < label.bottom && b.bottom > label.top;
            }) };
        });
        return { rootFont: getComputedStyle(document.documentElement).fontSize, overflow: document.documentElement.scrollWidth > innerWidth + 1,
          katexErrors: root.querySelectorAll('.katex-error').length, formulas, numbers,
          optionFonts: [...root.querySelectorAll('.reading-choice-option>strong')].filter(shown).map(e => ({
            font: getComputedStyle(e).fontSize, katex: [...e.querySelectorAll('.katex')].map(k => getComputedStyle(k).fontSize) })) };
      });
      check(!data.overflow && data.katexErrors === 0, `${width}/${label}/overflow-katex`, data);
      for (const f of data.formulas) {
        check(f.font === '18px' && f.katex.every(s => s === '18px'), `${width}/${label}/formula18`, f);
        if (f.derivation) check(f.justify === 'flex-start' && f.justifyItems === 'start', `${width}/${label}/derivation-alignment`, f);
      }
      // Compare expression containers within one authored derivation group.
      // firstMath remains the first KaTeX HTML box, not a glyph/text Range axis.
      data.expressionStartGroups = [];
      for (const chain of ['n14-q10-chain', 'n14-q14-chain', 'n14-q15-chain']) {
        const members = data.formulas.filter(f => f.derivation === chain && f.expression);
        if (members.length < 2) continue;
        const starts = members.map(f => ({ id: f.id, left: f.expression.left,
          firstMathLeft: f.firstMath?.left ?? null, paddingInlineStart: f.paddingInlineStart,
          pendingIds: f.pendingIds, resolvedIds: f.resolvedIds }));
        const delta = Math.max(...starts.map(f => f.left)) - Math.min(...starts.map(f => f.left));
        const op = members.find(f => f.id === 'textbook-formula-n14-formula-' + chain.match(/q(\d+)/)[1]);
        const stateKind = !op ? 'NO_OPERATION_ROW' : op.pendingIds.length === 3 ? 'UNANSWERED'
          : op.pendingIds.length > 0 ? 'PARTIAL' : op.resolvedIds.length === 3 ? 'COMPLETED' : 'UNKNOWN';
        const observation = { chain, stateKind, starts, delta, tolerancePx: 1,
          measure: 'reading-formula-expression DOMRect.left; not glyph or relation-sign alignment' };
        data.expressionStartGroups.push(observation);
        check(delta <= 1, `${width}/${label}/${chain}/expression-start-delta`, observation);
        if (['UNANSWERED', 'PARTIAL', 'COMPLETED'].includes(stateKind)) {
          const states = row.alignmentCoverage[chain] ??= [];
          if (!states.includes(stateKind)) states.push(stateKind);
        }
      }
      for (const f of data.optionFonts) check(f.font === '18px' && f.katex.every(s => s === '18px'), `${width}/${label}/option18`, f);
      const numbers = new Set();
      for (const n of data.numbers) {
        check(!numbers.has(n.number), `${width}/${label}/duplicate-number`, n); numbers.add(n.number);
        check(n.formulaIds.length === 1 && contract.equationNumbers[n.formulaIds[0]] === n.number, `${width}/${label}/numbered-final-row`, n);
        check(n.label && !n.collision && n.label.left >= -1 && n.label.right <= width + 1, `${width}/${label}/number-placement`, n);
      }
      row.measurements.push({ label, ...data }); return data;
    }
    // Revealed history is included when checking figure timing; collapsed past
    // stages must not be mistaken for a missing source figure.
    async function figures(label, solved) {
      await expandHistory();
      const expected = flow.filter(b => b.type === 'figure' &&
        flow.slice(0, flow.indexOf(b)).flatMap(slotsOf).every(id => solved.has(id)))
        .map(b => section.figures.find(f => f.id === b.figureId).src);
      const actual = await page.getByTestId('textbook-reading-flow').locator('img:visible').evaluateAll(ns => ns.map(e => e.getAttribute('src')));
      // The source catalog uses /assets while the built app mounts those exact
      // paths under VITE_BASE_PATH. Compare complete resolved URLs, never just
      // filenames, so another asset/origin/path still fails the gate.
      const expectedURLs = expected.map(src => new URL(src.startsWith('/assets/') ? src.slice(1) : src, process.env.APP_URL).href);
      const actualURLs = actual.map(src => new URL(src, process.env.APP_URL).href);
      check(JSON.stringify([...new Set(actualURLs)].sort()) === JSON.stringify([...new Set(expectedURLs)].sort()), `${width}/${label}/source-figure-gate`, { expected, actual, expectedURLs, actualURLs });
      row.figures.push({ label, expected, actual, expectedURLs, actualURLs });
    }
    await open();
    let storageKey = await page.evaluate(() => Object.keys(localStorage).find(k => {
      try { return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress); } catch { return false; }
    }));
    // Store may not have persisted an untouched page yet. The first real answer
    // creates its normal persistence; no invented storage key is used.
    const solved = new Set();
    for (let guard = 0; guard < 100; guard++) {
      const pending = await nextUntilPending(); if (!pending.length) break;
      const id = pending[0], item = items.get(id); assert.ok(item && !solved.has(id));
      await figures(id + '-before', solved);
      await measure(id + '-before');
      await page.getByTestId('textbook-item-' + id).click();
      await page.getByTestId('inline-choice-panel-' + id).waitFor(); await measure(id + '-options');
      const wrong = visibleChoices[id].find(value => value !== item.answer);
      assert.ok(wrong, 'Real displayed wrong choice is required for the scroll probe');
      await chooseWithScrollProbe(id, wrong, 'wrong');
      await measure(id + '-wrong');
      await chooseWithScrollProbe(id, item.answer, 'correct', solved.size % 2 === 1); solved.add(id); row.answered.push(id);
      await measure(id + '-resolved');
    }
    check(row.answered.length === 41, `${width}/all41-real-answers`, row.answered);
    row.scrollSummary = {
      targetFormulaAnswers: row.scrollProbes.filter(p => p.before.target).length,
      actualOverflowResets: row.scrollProbes.filter(p => p.targetObservation === 'ACTUAL_OVERFLOW_OFFSET_RESET').length,
      zeroOffsetObservations: row.scrollProbes.filter(p => p.targetObservation === 'ZERO_OFFSET_NO_OVERFLOW').length,
      differentRowManual20: row.scrollProbes.filter(p => p.before.unrelated).length,
    };
    check(row.scrollSummary.targetFormulaAnswers > 0, `${width}/real-formula-scroll-observations`, row.scrollSummary);
    const targetGeometry = row.scrollProbes.flatMap(p => p.before.target ? [p.before.target] : []);
    const visibleGeometry = row.scrollProbes.flatMap(p => [...p.before.visibleFormulaGeometry, ...(p.after?.visibleFormulaGeometry ?? [])]);
    const delta = n => n.scrollWidth - n.clientWidth;
    row.scrollSummary.geometryEvidence = {
      targetObservations: targetGeometry.length, visibleRowObservations: visibleGeometry.length,
      maximumTargetOverflow: Math.max(0, ...targetGeometry.map(delta)),
      maximumVisibleOverflow: Math.max(0, ...visibleGeometry.map(delta)),
      scope: 'Actual before/after visible rows during the 41 judgment traversal; no artificial widths or style changes.',
    };
    row.scrollSummary.overflowResetStatus = targetGeometry.some(n => delta(n) > 1)
      ? 'ACTUAL_OVERFLOW_RESET_MEASURED' : 'NOT_APPLICABLE_NO_OVERFLOW';
    if (targetGeometry.some(n => delta(n) > 1)) check(row.scrollSummary.actualOverflowResets > 0, `${width}/real-overflow-reset-required-when-present`, row.scrollSummary);
    // Do not require or fabricate a 20px position where the rendered content
    // fits. Conversely, a real eligible different row must not be silently
    // reported N/A if the probe failed to exercise it.
    const eligibleOther20 = row.scrollProbes.some(p => p.before.target &&
      p.before.visibleFormulaGeometry.some(n => n.id !== p.before.target.id && delta(n) >= 20));
    row.scrollSummary.manual20Status = row.scrollSummary.differentRowManual20 > 0 ? 'ACTUAL_DIFFERENT_ROW_MANUAL20_MEASURED'
      : eligibleOther20 ? 'UNVERIFIED_ELIGIBLE_DIFFERENT_ROW_NOT_MEASURED'
      : !visibleGeometry.some(n => delta(n) > 1) ? 'NOT_APPLICABLE_NO_OVERFLOW'
      : !visibleGeometry.some(n => delta(n) >= 20) ? 'NOT_APPLICABLE_NO_20PX_RANGE'
      : 'NOT_APPLICABLE_NO_DIFFERENT_ROW_AT_ANSWER';
    check(!eligibleOther20 || row.scrollSummary.differentRowManual20 > 0, `${width}/real-different-row-manual20-required-when-present`, row.scrollSummary);
    await nextUntilPending(); await expandHistory(); await figures('complete', solved);
    const full = await measure('complete-expanded-history');
    check(JSON.stringify(full.numbers.map(n => n.number).sort((a, b) => a - b)) === JSON.stringify(expectedNumbers), `${width}/all20-equation-numbers`, full.numbers);
    check(await page.getByTestId('textbook-reading-flow').innerText().then(t => t.includes('二次関数')), `${width}/written-next-chapter-bridge`);
    await image(`n14-${width}-complete-history`);
    await page.getByTestId('textbook-unit-complete').waitFor();
    check(await page.getByTestId('textbook-next-unit').count() === 0, `${width}/N14-no-invented-next-unit`);
    const returnLink = page.getByTestId('textbook-return-to-setup');
    const returnHref = await returnLink.getAttribute('href'); await returnLink.click();
    row.navigation.push({ kind: 'N14-terminal-return', href: returnHref, actualURL: page.url() });
    check(page.url().includes(returnHref.replace(/^#/, '')), `${width}/return-to-setup-route`, { returnHref, url: page.url() });
    await open();
    storageKey = await page.evaluate(() => Object.keys(localStorage).find(k => {
      try { return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress); } catch { return false; }
    })); assert.ok(storageKey, 'Find actual persisted schema');
    const sentinel = { unitId: 'w048-n14-extended-sentinel', unitRevision: 1, startedAt: 77, updatedAt: 88, answers: {} };
    async function seed(progress, otherUnit) {
      await page.evaluate(({ key, progress, sentinel, otherUnit }) => {
        const value = JSON.parse(localStorage.getItem(key));
        value.state.textbookProgress[progress.unitId] = progress;
        value.state.textbookProgress[sentinel.unitId] = sentinel;
        if (otherUnit) value.state.textbookProgress[otherUnit.unitId] = otherUnit;
        localStorage.setItem(key, JSON.stringify(value));
        for (const k of Object.keys(localStorage)) if (k.startsWith('math-textbook-compact-v1:')) localStorage.removeItem(k);
      }, { key: storageKey, progress, sentinel, otherUnit });
      await page.reload(); await page.getByTestId('textbook-reading-flow').waitFor(); await page.evaluate(() => document.fonts.ready);
    }
    // All 44 same-row binary masks, including all-complete. Test DOM row
    // membership/independence and withheld future rows before expanding history.
    for (const { block, index, slots } of multi) for (let mask = 0; mask < 2 ** slots.length; mask++) {
      const prior = flow.slice(0, index).flatMap(slotsOf);
      const answers = Object.fromEntries(prior.map(id => [id, record(items.get(id))]));
      slots.forEach((id, bit) => { if (mask & (1 << bit)) answers[id] = record(items.get(id)); });
      await seed({ unitId: unit.unitId, unitRevision: 11, startedAt: 11, updatedAt: 22, answers });
      await nextUntilPending();
      const missing = slots.filter((id, bit) => !(mask & (1 << bit))), allPending = await ids();
      const visibleCurrent = allPending.filter(id => slots.includes(id));
      check(JSON.stringify(visibleCurrent) === JSON.stringify(missing), `${width}/${block.id}/mask${mask}/independent-missing-slots`, { slots, missing, allPending });
      if (missing.length) check(allPending.every(id => slots.includes(id)), `${width}/${block.id}/mask${mask}/later-row-withheld`, allPending);
      await expandHistory();
      const formula = page.getByTestId('textbook-formula-' + block.id); await formula.waitFor();
      const completed = [];
      for (const [bit, id] of slots.entries()) if (mask & (1 << bit)) {
        const count = await formula.getByTestId('resolved-' + id).count();
        check(count === 1, `${width}/${block.id}/mask${mask}/${id}/resolved-in-same-row`, count); completed.push(id);
      }
      await measure(block.id + '-mask' + mask);
      row.masks.push({ block: block.id, mask, slots, missing, completed, allPending });
      if (width === 320 && (mask === 0 || mask === 5 || mask === 2 ** slots.length - 1) && slots.length === 3) await image(`n14-${width}-${block.id}-mask${mask}`);
    }
    check(row.masks.length === 44, `${width}/all44-binary-masks`, row.masks.length);
    for (const chain of ['n14-q10-chain', 'n14-q14-chain', 'n14-q15-chain'])
      check(['UNANSWERED', 'PARTIAL', 'COMPLETED'].every(s => row.alignmentCoverage[chain]?.includes(s)),
        `${width}/${chain}/alignment-three-state-coverage`, row.alignmentCoverage[chain] ?? []);
    // Old revision chains retain the real migration's intentional reopening.
    // Compare every pre-existing answer record and archive after a real click.
    for (const test of migrationCases) {
      await seed(test.seed); const pending = await nextUntilPending();
      assert.ok(pending.length); const first = pending[0];
      check(!test.expected.answers[first]?.resolved, `${width}/r${test.revision}/${test.completed}/expected-unresolved-first`, { first });
      check(first === 'n14-w048-q03-region', `${width}/r${test.revision}/${test.completed}/first-new-region`, { first });
      await choose(first, items.get(first).answer);
      const state = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).state.textbookProgress, storageKey);
      const actual = state[unit.unitId], expected = test.expected;
      check(actual.unitRevision === 11 && actual.completedAt === undefined, `${width}/r${test.revision}/${test.completed}/revision-open`, actual);
      const allowedReopens = approvedReopens(test.revision);
      // Independent oracle: every un-rekeyed old record must match the original
      // seed exactly, including firstValue/attemptCount/timestamps. Only the
      // explicitly approved old keys may be removed, and they must reopen.
      for (const [id, original] of Object.entries(test.seed.answers)) {
        if (allowedReopens.has(id)) {
          check(actual.answers[id] === undefined, `${width}/r${test.revision}/${test.completed}/${id}/approved-old-key-reopened`, actual.answers[id]);
        } else {
          check(JSON.stringify(actual.answers[id]) === JSON.stringify(original), `${width}/r${test.revision}/${test.completed}/${id}/independent-seed-record-preserved`, { original, actual: actual.answers[id] });
        }
      }
      for (const [revision, originalArchive] of Object.entries(test.seed.archivedRevisions)) {
        check(JSON.stringify(actual.archivedRevisions?.[revision]) === JSON.stringify(originalArchive), `${width}/r${test.revision}/${test.completed}/${revision}/independent-original-archive-preserved`, { original: originalArchive, actual: actual.archivedRevisions?.[revision] });
      }
      const originArchive = actual.archivedRevisions?.[String(test.revision)];
      check(originArchive && JSON.stringify(originArchive.answers) === JSON.stringify(test.seed.answers), `${width}/r${test.revision}/${test.completed}/independent-origin-answer-archive`, { expected: test.seed.answers, actual: originArchive?.answers });
      for (const key of ['unitRevision', 'startedAt', 'updatedAt', 'completedAt']) {
        check(originArchive?.[key] === test.seed[key], `${width}/r${test.revision}/${test.completed}/independent-origin-archive-${key}`, { expected: test.seed[key], actual: originArchive?.[key] });
      }
      if (test.revision === 10) {
        const { archivedRevisions: originalArchives, ...originalR10 } = test.seed;
        check(Object.keys(test.seed.answers).length === 38 && allowedReopens.size === 0, `${width}/r10/${test.completed}/38-old-records-no-rekey`);
        check(JSON.stringify(actual.archivedRevisions?.['10']) === JSON.stringify(originalR10), `${width}/r10/${test.completed}/independent-exact-r10-archive`, { original: originalR10, actual: actual.archivedRevisions?.['10'] });
        check(Object.entries(originalArchives).every(([key, archive]) => JSON.stringify(actual.archivedRevisions?.[key]) === JSON.stringify(archive)), `${width}/r10/${test.completed}/independent-exact-original-archives`);
      }
      for (const [id, answer] of Object.entries(expected.answers)) check(JSON.stringify(actual.answers[id]) === JSON.stringify(answer), `${width}/r${test.revision}/${test.completed}/${id}/original-metadata`, { expected: answer, actual: actual.answers[id] });
      check(JSON.stringify(actual.archivedRevisions) === JSON.stringify(expected.archivedRevisions), `${width}/r${test.revision}/${test.completed}/archive-chain`, { expected: expected.archivedRevisions, actual: actual.archivedRevisions });
      check(actual.previousRevisionCompletedAt === expected.previousRevisionCompletedAt, `${width}/r${test.revision}/${test.completed}/old-completion`, actual.previousRevisionCompletedAt);
      const added = section.items.filter(i => !legacy.sections[0].items.some(j => j.id === i.id)).map(i => i.id);
      check(added.filter(id => id !== first).every(id => actual.answers[id] === undefined), `${width}/r${test.revision}/${test.completed}/later-new-unanswered`, added);
      check(JSON.stringify(state[sentinel.unitId]) === JSON.stringify(sentinel), `${width}/r${test.revision}/${test.completed}/other-unit-kept`, state[sentinel.unitId]);
      await page.reload(); await page.getByTestId('textbook-reading-flow').waitFor();
      const afterReload = await page.evaluate(({ key, unitId }) => JSON.parse(localStorage.getItem(key)).state.textbookProgress[unitId], { key: storageKey, unitId: unit.unitId });
      check(JSON.stringify(afterReload) === JSON.stringify(actual), `${width}/r${test.revision}/${test.completed}/reload-idempotent`);
      row.saves.push({ revision: test.revision, completed: test.completed, pending, preservedOldAnswers: Object.keys(test.seed.answers).length - allowedReopens.size, approvedReopenedIds: [...allowedReopens], independentSeedAndArchiveAssertions: true, firstRealAnswer: first });
    }
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'この単元を最初から', exact: false }).last().click();
    await page.reload(); await page.getByTestId('textbook-reading-flow').waitFor();
    check((await nextUntilPending()).includes('n14-01'), `${width}/explicit-reset-first-question`);
    const resetState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).state.textbookProgress, storageKey);
    check(resetState[unit.unitId] == null, `${width}/reset-current-progress-removed`, resetState[unit.unitId]);
    check(JSON.stringify(resetState[sentinel.unitId]) === JSON.stringify(sentinel), `${width}/reset-other-unit-kept`);
    row.reset = { firstPending: await ids(), currentProgress: resetState[unit.unitId] ?? null };
    await image(`n14-${width}-reset`);
    // N13 -> N14 must use the actual existing completion link, not a direct-route
    // smoke labelled as a transition. Seed only this isolated context.
    const previous = input.fixtures.find(x => x.code === 'n13'); assert.ok(previous, 'N13 fixture for real predecessor transition');
    const previousUnit = previous.unit;
    const previousProgress = { unitId: previousUnit.unitId, unitRevision: previousUnit.revision, startedAt: 1, updatedAt: 2,
      completedAt: 3, answers: Object.fromEntries(previousUnit.sections[0].items.map(i => [i.id, record(i)])) };
    await seed({ unitId: unit.unitId, unitRevision: 11, startedAt: 11, updatedAt: 22, answers: {} }, previousProgress);
    await open(previousUnit.unitId); await nextUntilPending();
    const nextLink = page.getByTestId('textbook-next-unit'); await nextLink.waitFor();
    const nextHref = await nextLink.getAttribute('href');
    const transition = { kind: 'N13-completion-to-N14', href: nextHref, status: 'RUNNING', timeoutMs: 15000 };
    row.navigation.push(transition);
    const navigationSnapshot = () => page.evaluate(({ key, previousId, currentId }) => {
      const root = document.querySelector('[data-testid="textbook-reading-flow"]');
      const pending = [...document.querySelectorAll('button[data-testid^="textbook-item-"]')]
        .filter(n => n.getClientRects().length).map(n => n.dataset.testid.slice('textbook-item-'.length));
      let progress;
      try {
        const stored = JSON.parse(localStorage.getItem(key))?.state?.textbookProgress ?? {};
        progress = Object.fromEntries([previousId, currentId].map(id => [id, stored[id] ? {
          revision: stored[id].unitRevision, answerIds: Object.keys(stored[id].answers ?? {}),
          completedAt: stored[id].completedAt ?? null,
        } : null]));
      } catch (error) { progress = { diagnosticError: String(error) }; }
      return { url: location.href, hash: location.hash, pending,
        readingFlowPresent: Boolean(root), w048Class: root?.classList.contains('w048-reading-flow') ?? false,
        formulaIds: root && [...root.querySelectorAll('[data-testid^="textbook-formula-"]')].slice(0, 8).map(n => n.dataset.testid),
        textPrefix: root?.textContent?.slice(0, 240) ?? null, progress };
    }, { key: storageKey, previousId: previousUnit.unitId, currentId: unit.unitId });
    transition.beforeClick = await navigationSnapshot();
    try {
      await nextLink.click();
      transition.immediatelyAfterClick = await navigationSnapshot();
      // The generic reading-flow element is reused while the asynchronous unit
      // repository request resolves. Its presence alone cannot identify N14.
      // Keep a bounded wait for BOTH the exact route and N14's real first slot;
      // a wrong unit, stale completed page or hidden slot still fails the probe.
      await Promise.all([
        page.waitForURL(url => url.hash === '#/learning/textbook/' + unit.unitId, { timeout: 15000 }),
        page.getByTestId('textbook-item-n14-01').waitFor({ state: 'visible', timeout: 15000 }),
      ]);
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      transition.settled = await navigationSnapshot();
      transition.actualURL = page.url();
      transition.firstQuestionVisible = await page.getByTestId('textbook-item-n14-01').isVisible();
      transition.status = transition.settled.hash === '#/learning/textbook/' + unit.unitId &&
        transition.firstQuestionVisible && transition.settled.pending.includes('n14-01') ? 'PASS' : 'FAIL';
      check(transition.status === 'PASS', `${width}/actual-N13-N14-transition`, transition);
    } catch (error) {
      transition.status = 'FAIL'; transition.failure = { message: error.message, stack: error.stack };
      try { transition.failureSnapshot = await navigationSnapshot(); }
      catch (diagnosticError) { transition.snapshotError = String(diagnosticError); }
      const name = `n14-${width}-transition-failure.png`;
      try { await page.screenshot({ path: path.join(out, name), fullPage: true, timeout: 5000 }); row.images.push(name); transition.failureImage = name; }
      catch (diagnosticError) { transition.imageError = String(diagnosticError); }
      check(false, `${width}/actual-N13-N14-transition`, transition);
    }
    check(errors.length === 0, `${width}/uncaught-page-errors`, errors);
    // Retain contexts until browser.close; constrained --single-process browsers
    // can terminate if a context is closed during a multi-width run.
  }
  report.status = report.failures.length ? 'FAIL_N14_EXTENDED' : 'PASS_BOUNDED_N14_EXTENDED';
} catch (error) {
  report.status = 'FAIL_N14_EXTENDED'; report.failures.push({ label: 'probe-execution', message: error.message, stack: error.stack });
} finally {
  await browser.close();
  report.images = fs.readdirSync(out).filter(n => n.endsWith('.png')).map(name => ({ name, sha256: sha(path.join(out, name)) }));
  fs.writeFileSync(path.join(out, 'N14_EXTENDED_REPORT.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, rows: report.rows.map(r => ({ width: r.width, answers: r.answered.length, masks: r.masks.length, saves: r.saves.length })), failures: report.failures.length, firstFailures: report.failures.slice(0, 3), output: out }));
  if (report.status.startsWith('FAIL')) process.exitCode = 1;
}
