// REVIEW-ONLY portable current-build probe; no source patch or baseline update.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { spawnSync } from 'node:child_process';
const out = process.env.EVIDENCE_DIR, fixturePath = process.env.W048_FIXTURES;
assert.ok(out && fixturePath && process.env.APP_URL, 'explicit output/fixtures/app URL required');
const inputs = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
assert.equal(inputs.sourceSHA, process.env.CANDIDATE_SHA);
const jsonDir = path.join(out, 'reports'), imageDir = path.join(out, 'images');
fs.mkdirSync(jsonDir, { recursive: true }); fs.mkdirSync(imageDir, { recursive: true });
const report = { status: 'RUNNING', sourceSHA: inputs.sourceSHA, scope: 'APPLIED_CURRENT_BUILD_ONLY', results: [], failures: [], limits: ['No N14 isolated prototype is labelled current-source proof.', 'Geometry and all actually displayed choices are bounded technical evidence; raw omitted distractors are not browser-tested; teaching/reading quality requires nonauthor review.', 'Reset button, figure timing, chapter transitions, old-layout comparison and cross-mode regression remain separately required R07/G2 checks.'] };
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}), args: ['--no-sandbox'] });
const record = item => ({ itemId: item.id, value: item.answer, firstValue: item.answer, resolved: true, isFirstCorrect: true, attemptCount: 1, firstAnsweredAt: 11, lastAnsweredAt: 22 });
try {
  for (const fixture of inputs.fixtures) for (const width of [320, 390, 430, 1440]) {
    const { code, unit, legacy, visibleChoices } = fixture, section = unit.sections[0], items = new Map(section.items.map(i => [i.id, i]));
    const context = await browser.newContext({ viewport: { width, height: 1000 } }), page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    async function capture(name) {
      // Clicks scroll to lower rows; a fixed header must not obscure a full-page capture.
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForFunction(() => window.scrollY === 0);
      await page.screenshot({ path: path.join(imageDir, `${code}-${width}-${name}.png`), fullPage: true });
    }
    const route = process.env.APP_URL + '#/learning/textbook/' + unit.unitId;
    await page.goto(route); await page.getByTestId('textbook-reading-flow').waitFor();
    await page.evaluate(() => document.fonts.ready);
    let correct = 0, wrong = 0, geometryChecks = 0, scrollContainers = 0;
    async function geometry(label) {
      const result = await page.locator('.textbook-reading-flow').evaluate(el => {
        const issues = [], scrolling = [];
        if (document.documentElement.scrollWidth > innerWidth + 1) issues.push('document overflow');
        if (el.querySelector('.katex-error')) issues.push('KaTeX error');
        for (const node of el.querySelectorAll('.reading-formula-expression,.reading-choice-option strong')) {
          if (!node.getClientRects().length) continue;
          const maths = [...node.querySelectorAll('.katex-html')].filter(n => n.getClientRects().length);
          if (!maths.length) continue;
          const left = Math.min(...maths.map(n => n.getBoundingClientRect().left)), right = Math.max(...maths.map(n => n.getBoundingClientRect().right));
          let ancestor = node, reachable = false;
          while (ancestor && ancestor !== el.parentElement) {
            const css = getComputedStyle(ancestor), box = ancestor.getBoundingClientRect();
            if (['auto', 'scroll'].includes(css.overflowX) && ancestor.scrollWidth > ancestor.clientWidth + 1) {
              const original = ancestor.scrollLeft;
              ancestor.scrollLeft = 0;
              const start = Math.min(...maths.map(n => n.getBoundingClientRect().left));
              ancestor.scrollLeft = ancestor.scrollWidth;
              const end = Math.max(...maths.map(n => n.getBoundingClientRect().right));
              if (start >= box.left - 2 && end <= box.right + 2) reachable = true;
              scrolling.push({ startReachable: start >= box.left - 2, endReachable: end <= box.right + 2, scrollWidth: ancestor.scrollWidth, clientWidth: ancestor.clientWidth });
              ancestor.scrollLeft = original; break;
            }
            ancestor = ancestor.parentElement;
          }
          if ((left < -2 || right > innerWidth + 2) && !reachable) issues.push('unreachable internal math');
        }
        return { issues, scrolling };
      });
      geometryChecks++; scrollContainers += result.scrolling.length;
      assert.deepEqual(result.issues, [], `${code}/${width}/${label}`);
      return result;
    }
    const ids = () => page.locator('button[data-testid^="textbook-item-"]:visible').evaluateAll(nodes => nodes.map(n => n.dataset.testid.replace('textbook-item-', '')));
    async function choose(item, value) {
      await page.getByTestId('textbook-item-' + item.id).click();
      const panel = page.getByTestId('inline-choice-panel-' + item.id);
      await panel.waitFor();
      const labels = await panel.locator('button[aria-label]').evaluateAll(nodes => nodes.map(n => n.getAttribute('aria-label')));
      assert.deepEqual([...labels].sort(), [...visibleChoices[item.id]].sort(), 'actual scaffold-filtered choice keys visible');
      await geometry(item.id + '-options');
      await panel.locator('button[aria-label]').evaluateAll((nodes, expected) => {
        const found = nodes.find(n => n.getAttribute('aria-label') === expected); if (!found) throw Error('choice missing'); found.click();
      }, value);
      await panel.waitFor({ state: 'detached' });
    }
    await geometry('fresh'); await capture('fresh');
    const visited = new Set();
    for (let guard = 0; guard < section.items.length * 4 + 100; guard++) {
      const available = await ids();
      if (!available.length) {
        const next = page.getByTestId('math-textbook-next-stage');
        if (await next.count()) { await next.click(); continue; }
        break;
      }
      const id = available[0], item = items.get(id); assert.ok(item, `known item ${id}`); assert.ok(!visited.has(id), 'solved item must advance');
      for (const value of visibleChoices[item.id].filter(value => value !== item.answer)) {
        await choose(item, value); wrong++;
        assert.ok((await ids()).includes(id), 'wrong answer remains unresolved');
        await page.getByTestId('textbook-item-' + id).click();
        await page.getByTestId('textbook-hint-' + id).waitFor();
        await page.getByTestId('textbook-item-' + id).click();
      }
      await choose(item, item.answer); correct++; visited.add(id); await geometry(id + '-correct');
      if (correct === 1 || correct === Math.floor(section.items.length / 2)) await capture(`answered-${correct}`);
    }
    assert.equal(correct, section.items.length, 'all current-source interactions answered');
    assert.equal(wrong, section.items.reduce((n, i) => n + visibleChoices[i.id].filter(c => c !== i.answer).length, 0));
    await page.reload(); await page.getByTestId('textbook-reading-flow').waitFor(); await geometry('completed-reload');
    const history = page.getByTestId('math-textbook-history-toggle');
    if (await history.count()) { await history.click(); await page.getByTestId('math-textbook-expand-all').click(); await geometry('expanded-history'); }
    await capture('history');
    // Reuse the actual persisted storage format, only inside this fresh browser context.
    const seeded = await page.evaluate(({ unit, legacy, answers }) => {
      const key = Object.keys(localStorage).find(k => { try { return Boolean(JSON.parse(localStorage.getItem(k)).state?.textbookProgress); } catch { return false; } });
      if (!key) throw Error('actual persisted Store missing');
      const value = JSON.parse(localStorage.getItem(key));
      value.state.textbookProgress[unit.unitId] = { unitId: unit.unitId, unitRevision: legacy.revision, startedAt: 11, updatedAt: 22, completedAt: 23, answers };
      value.state.textbookProgress['w048-audit-sentinel'] = { unitId: 'w048-audit-sentinel', unitRevision: 1, startedAt: 101, updatedAt: 102, answers: {} };
      localStorage.setItem(key, JSON.stringify(value));
      return key;
    }, { unit, legacy, answers: Object.fromEntries(legacy.sections[0].items.map(i => [i.id, record(i)])) });
    await page.reload(); await page.getByTestId('textbook-reading-flow').waitFor();
    let pending = await ids();
    for (let guard = 0; !pending.length && guard < 100; guard++) { const next = page.getByTestId('math-textbook-next-stage'); assert.equal(await next.count(), 1, 'new decision reachable from saved cursor'); await next.click(); pending = await ids(); }
    const oldIds = new Set(legacy.sections[0].items.map(i => i.id));
    assert.ok(pending.length && pending.every(id => !oldIds.has(id)), 'old completed save resumes an added unanswered decision');
    const persisted = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), seeded);
    assert.equal(persisted.state.textbookProgress['w048-audit-sentinel'].updatedAt, 102, 'other unit preserved');
    assert.deepEqual(errors, []);
    report.results.push({ code, width, correct, wrong, geometryChecks, observedScrollContainers: scrollContainers, latestBaselineSaveResume: pending, oldRevision: legacy.revision, historyAndReload: true });
    await context.close();
  }
  report.status = 'PASS_BOUNDED_CURRENT_BUILD_BROWSER';
} catch (error) { report.status = 'FAIL'; report.failures.push({ message: error.message, stack: error.stack }); process.exitCode = 1; }
finally {
  await browser.close();
  report.images = fs.readdirSync(imageDir).map(name => ({ name, sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(imageDir, name))).digest('hex') }));
  fs.writeFileSync(path.join(jsonDir, 'BROWSER_REPORT.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, rows: report.results.length, failures: report.failures }));
}

// Extend the already authorized current-source verification with the remaining
// bounded R07 probes. The workflow YAML, permissions and publication are unchanged.
if (report.status === 'PASS_BOUNDED_CURRENT_BUILD_BROWSER') {
  for (const [name, relative] of [
    ['N13_EXTENDED', 'ci-review/verify_extended.mjs'],
    ['SCROLL', 'scroll-review/verify_post_scroll.mjs'],
    ...(inputs.fixtures.some(f => f.code === 'n14') ? [['N14_EXTENDED', 'ci-review/verify_n14_extended.mjs']] : []),
  ]) {
    const target = path.join(out, 'extended-' + name.toLowerCase());
    fs.mkdirSync(target, { recursive: true });
    const child = spawnSync(process.execPath, [path.resolve('work/items/W-MATH-048-n1314-source-audit', relative)], {
      env: { ...process.env, W048_APP_ROOT: process.cwd(), EVIDENCE_DIR: target }, encoding: 'utf8', timeout: 600000,
    });
    fs.writeFileSync(path.join(jsonDir, name + '_EXECUTION.json'), JSON.stringify({ status: child.status, error: child.error?.message, stdout: child.stdout, stderr: child.stderr }, null, 2) + '\n');
    for (const file of fs.readdirSync(target)) {
      if (file.endsWith('.png')) fs.copyFileSync(path.join(target, file), path.join(imageDir, name + '-' + file));
      if (file.endsWith('.json')) fs.copyFileSync(path.join(target, file), path.join(jsonDir, name + '-' + file));
    }
    if (child.status !== 0 || child.error) { process.exitCode = 1; break; }
  }
}
