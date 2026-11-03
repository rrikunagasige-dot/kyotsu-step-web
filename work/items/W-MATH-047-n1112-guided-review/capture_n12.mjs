// N12 focused capture, exercised against the approved inactive P006 candidate.
// Capture-tool assistance by reviewer B; no lesson authorship.
// Source SHA comes from the actual CI environment; local inactive captures explicitly use null.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const out = process.env.EVIDENCE_DIR;
assert.ok(out, 'Set an isolated evidence directory explicitly');
fs.mkdirSync(out, { recursive: true });
const d = JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/n12Authored.json', 'utf8'));
const app = process.env.APP_URL ?? 'http://127.0.0.1:4391/kyotsu-step-web/';
const targets = new Set(['n12-01', 'n12-q04-left-end', 'n12-04', 'n12-07', 'n12-q13-operation']);
const widths = [320, 390, 430, 1440];
const frames = [];
const errors = [];
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}), args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 390, height: 1200 } });
const page = await context.newPage();
page.on('pageerror', e => errors.push(e.message));

async function settle() {
  await page.evaluate(async () => { await document.fonts.ready; await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
}
async function geometry() {
  return page.locator('.guided-reading').evaluate(el => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) issues.push('page overflow');
    for (const eq of el.querySelectorAll('.numbered-equation')) {
      if (!eq.getClientRects().length || eq.closest('details:not([open])')) continue;
      const label = eq.querySelector('.numbered-equation-label'); if (!label) continue;
      const tag = label.getBoundingClientRect();
      for (const m of eq.querySelectorAll('.numbered-equation-body .katex,.reading-inline-blank')) {
        const r = m.getBoundingClientRect();
        if (r.width && r.right > tag.left + 1 && r.left < tag.right - 1 && r.bottom > tag.top + 1 && r.top < tag.bottom - 1) issues.push('number collision ' + eq.dataset.equationNumber);
      }
    }
    for (const n of el.querySelectorAll('[data-typeset-source]')) {
      if (!n.getClientRects().length || n.closest('details:not([open])')) continue;
      const box = n.getBoundingClientRect();
      for (const m of n.querySelectorAll('.typeset-line .katex,.reading-inline-blank')) {
        const r = m.getBoundingClientRect();
        if (r.width && (r.left < box.left - 2 || r.right > box.right + 2)) issues.push('formula overflow ' + n.dataset.typesetSource);
      }
    }
    for (const n of el.querySelectorAll('.reading-choice-option')) {
      const r = n.getBoundingClientRect();
      if (r.width && (r.left < 0 || r.right > innerWidth + 1)) issues.push('option overflow');
      for (const m of n.querySelectorAll('.katex-html')) {
        const mr = m.getBoundingClientRect();
        if (mr.width && (mr.left < r.left - 1 || mr.right > r.right + 1)) issues.push('option math overflow');
      }
    }
    return [...new Set(issues)];
  });
}
async function capture(nodeId, state) {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1200 });
    const node = page.locator('[data-node-id="' + nodeId + '"]'); await node.waitFor();
    await node.scrollIntoViewIfNeeded();
    await node.evaluate(n => window.scrollTo({ top: scrollY + n.getBoundingClientRect().top - 110, behavior: 'instant' }));
    await settle();
    const rect = await node.evaluate(n => { const r = n.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, height: r.height }; });
    assert.ok(rect.top >= 90, 'target begins below the real fixed header');
    const problems = await geometry();
    const prefix = nodeId + '-' + width + '-' + state;
    await page.screenshot({ path: path.join(out, prefix + '-viewport.png'), fullPage: false });
    await node.screenshot({ path: path.join(out, prefix + '-focus.png') });
    // Preserve an additional real viewport when the whole node does not fit.
    if (rect.bottom > 1180) {
      await node.evaluate(n => window.scrollTo({ top: scrollY + n.getBoundingClientRect().bottom - 1160, behavior: 'instant' }));
      await settle();
      await page.screenshot({ path: path.join(out, prefix + '-tail-viewport.png'), fullPage: false });
    }
    frames.push({ nodeId, state, width, height: 1200, geometry: rect, issues: problems, fullPage: false, layoutModified: false });
    assert.deepEqual(problems, [], prefix);
    assert.equal(await page.locator('.katex-error').count(), 0);
  }
  await page.setViewportSize({ width: 390, height: 1200 });
}
async function saveContext(current, name) {
  await settle();
  // Supplementary element screenshot; raw target viewports remain primary.
  await current.screenshot({ path: path.join(out, name + '-stage-context.png') });
}

let answered = 0, wrongCount = 0;
try {
  await page.goto(app + '#/learning/textbook/' + d.unit.unitId);
  for (const stage of d.stages) {
    const current = page.getByTestId('math-textbook-stage-' + stage.id); await current.waitFor();
    for (const n of d.nodes.filter(n => n.stageId === stage.id)) {
      if (!n.interaction) continue;
      const item = d.unit.sections[0].items.find(i => i.id === n.interaction); assert.ok(item);
      const node = current.locator('[data-node-id="' + n.id + '"]'); await node.waitFor();
      await page.getByTestId('textbook-item-' + item.id).click();
      const panel = page.getByTestId('inline-choice-panel-' + item.id); await panel.waitFor();
      if (targets.has(n.id)) {
        assert.equal(await node.locator('[data-block-id="' + n.id + '-equation"]').count(), 0, 'future answer hidden');
        await capture(n.id, 'pending'); await saveContext(current, n.id + '-pending');
        const wrong = item.choices.find(c => c !== item.answer); assert.ok(wrong);
        await panel.getByRole('button', { name: wrong, exact: true }).click(); wrongCount++;
        await page.getByTestId('textbook-hint-' + item.id).waitFor();
        assert.equal(await page.getByTestId('textbook-item-' + item.id).count(), 1);
        const next = d.nodes[d.nodes.indexOf(n) + 1];
        if (next?.stageId === stage.id) assert.equal(await current.locator('[data-node-id="' + next.id + '"]').count(), 0);
        await capture(n.id, 'wrong');
        await page.reload(); await current.waitFor();
        await page.getByTestId('textbook-item-' + item.id).click(); await panel.waitFor();
      }
      await panel.getByRole('button', { name: item.answer, exact: true }).click(); answered++;
      if (targets.has(n.id)) {
        assert.equal(await node.locator('[data-block-id^="' + n.id + '-interaction"]').count(), 0, 'replace unanswered block');
        await capture(n.id, 'correct'); await saveContext(current, n.id + '-correct');
      }
      if (['n12-06', 'n12-15'].includes(n.id)) await node.screenshot({ path: path.join(out, n.id + '-independent-complete.png') });
    }
    if (stage !== d.stages.at(-1)) await page.getByTestId('math-textbook-next-stage').click();
  }
  assert.equal(answered, 46); assert.equal(wrongCount, 5); await page.getByTestId('n12-complete').waitFor();
  await page.getByTestId('n12-history-toggle').click();
  await page.getByRole('button', { name: '全文を開く', exact: true }).click(); await settle();
  assert.equal(await page.locator('[data-testid^="recorded-results-"]').count(), 14);
  await page.screenshot({ path: path.join(out, 'n12-390-history-full.png'), fullPage: true });
  await page.reload(); await page.getByTestId('n12-complete').waitFor();
  const nextLink = page.getByTestId('textbook-next-unit'); await nextLink.waitFor();
  const nextHref = await nextLink.getAttribute('href'); assert.ok(nextHref && !nextHref.endsWith(d.unit.unitId));
  await nextLink.click(); await page.waitForFunction(id => !location.hash.includes(id), d.unit.unitId);
  await page.getByTestId('textbook-reading-flow').waitFor(); await settle();
  const nextURL = page.url();
  await page.screenshot({ path: path.join(out, 'n12-next-unit-route.png'), fullPage: false });
  await page.goBack(); await page.getByTestId('n12-complete').waitFor();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'この単元を最初から', exact: true }).first().click();
  await page.getByTestId('math-textbook-stage-' + d.stages[0].id).waitFor();
  await page.reload(); await page.getByTestId('math-textbook-stage-' + d.stages[0].id).waitFor();
  assert.equal(await page.getByTestId('n12-complete').count(), 0);
  const progress = await page.evaluate(() => Object.keys(localStorage).flatMap(k => { try { const s = JSON.parse(localStorage.getItem(k)); return s.state?.textbookProgress ? [s.state.textbookProgress] : []; } catch { return []; } })[0]);
  assert.equal(Object.keys(progress?.[d.unit.unitId]?.answers ?? {}).length, 0);
  await page.screenshot({ path: path.join(out, 'n12-reset-reload-start.png'), fullPage: false });
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(out, 'FOCUSED_CAPTURE.json'), JSON.stringify({ status: 'PASS', targetNodes: [...targets], frames, answered, focusedWrongCount: wrongCount, allWrongCountNotTestedHere: true, history: true, reload: true, reset: { confirmedDialog: true, answersCleared: true, reloadStartsAtFirstStage: true }, chapterBoundary: { nextHref, nextURL, browserBackToCompletedN12: true }, sourceSHA: process.env.CANDIDATE_SHA ?? process.env.GITHUB_SHA ?? null, originalSourceSHA: process.env.ORIGINAL_SOURCE_SHA ?? null, inactiveCandidateManifestRef: process.env.CANDIDATE_MANIFEST_REF ?? null, errors, layoutModified: false }, null, 2) + '\n');
} finally { await context.close(); await browser.close(); }
