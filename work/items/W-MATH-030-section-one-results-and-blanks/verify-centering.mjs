// Layout-only regression: seeded answers exercise every stage and both display
// states; this is not reported as a learner playthrough or acceptance.
import fs from 'node:fs'
import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
const root = process.env.APP_URL ?? 'http://127.0.0.1:4173/kyotsu-step-web/'
const out = process.env.EVIDENCE_DIR ?? 'e2e-evidence/formula-centering'
const storage = process.env.VITE_STORAGE_NAMESPACE ?? 'kyotsu-step-gate3-math-20261023'
const runtime = JSON.parse(fs.readFileSync('e2e-evidence/chapter-runtime/runtime-units.json', 'utf8'))
const plans = JSON.parse(fs.readFileSync('src/data/textbook/math/numbers/firstSectionTeaching.json', 'utf8'))
const units = runtime.units.map(e => e.unit).filter(u => Object.hasOwn(plans, u.unitId.split('-').at(-1)))
fs.mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) })
for (let i = 0; i < 50; i++) { try { await fetch(root); break } catch { await new Promise(r => setTimeout(r, 200)) } }
const rows = [], views = [], errors = [], interactions = []
try {
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(root)
    for (const unit of units) {
      const key = unit.unitId.split('-').at(-1)
      const plan = plans[key], flow = unit.sections[0].readingFlow, items = unit.sections[0].items
      const starts = plan.stages.map(([id]) => flow.findIndex(b => b.id === id)).concat(flow.length)
      for (let index = 0; index < plan.stages.length; index++) {
        const [anchor] = plan.stages[index]
        const first = flow.slice(starts[index], starts[index + 1]).flatMap(b => (b.parts ?? []).filter(p => p.type === 'choice').map(p => p.itemId))[0]
        for (const resolved of first ? [false, true] : [true]) {
          const stop = resolved ? items.length : items.findIndex(q => q.id === first)
          const progress = { unitId: unit.unitId, unitRevision: unit.revision, startedAt: 1, updatedAt: 2,
            answers: Object.fromEntries(items.slice(0, stop).map(q => [q.id, { itemId: q.id, value: q.answer, resolved: true, isFirstCorrect: true, attemptCount: 1, firstAnsweredAt: 1, lastAnsweredAt: 2 }])) }
          await page.evaluate(({ storage, unit, progress, index }) => {
            localStorage.setItem(storage, JSON.stringify({ state: { textbookProgress: { [unit.unitId]: progress } }, version: 1 }))
            localStorage.setItem('math-textbook-compact-v1:' + unit.unitId + ':r' + unit.revision, String(index))
          }, { storage, unit: { unitId: unit.unitId, revision: unit.revision }, progress, index })
          await page.goto(root + '#/learning/textbook/' + unit.unitId)
          await page.reload()
          const stage = page.getByTestId('math-textbook-stage-' + anchor)
          await stage.waitFor()
          await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))) })
          assert(await stage.evaluate(el => el.classList.contains('math-textbook-stage--current')), 'Wrong current stage ' + anchor)
          const numbered = await stage.locator('.numbered-equation').evaluateAll(nodes => nodes.map(node => {
            const tag = node.querySelector('.numbered-equation-label'), box = node.getBoundingClientRect(), label = tag.getBoundingClientRect()
            const source = node.querySelector('.reading-formula-line').dataset.testid.replace(/^textbook-formula-/, '').replace(/^s5-record-/, '')
            const overlap = Array.from(node.querySelectorAll('.numbered-equation-body .reading-formula-wrap-group, .numbered-equation-body .katex, .numbered-equation-body .reading-formula-choice')).some(el => {
              const r = el.getBoundingClientRect()
              return r.width && r.right > label.left + 1 && r.left < label.right - 1 && r.bottom > label.top + 1 && r.top < label.bottom - 1
            })
            return { source, number: Number(node.dataset.equationNumber), text: tag.textContent, right: Math.abs(box.right - label.right - 2), overlap }
          }))
          for (const entry of numbered) {
            const expected = plan.equationNumbers[entry.source] ?? plan.equationNumbers[entry.source.split('#')[0]]
            assert.equal(entry.number, expected, 'Unstable equation number ' + entry.source)
            assert.equal(entry.text, '(' + expected + ')')
            assert(entry.right <= 2, 'Equation number is not at the right edge')
            assert(!entry.overlap, 'Equation number covers mathematics ' + JSON.stringify({ unit: key, width, anchor, ...entry }))
          }
          const measures = await stage.locator('.reading-formula-line--aligned').evaluateAll(lines => lines.flatMap(line => {
            const block = line.querySelector('.first-theme-formula-rows')
            const box = line.getBoundingClientRect(), bounds = block.getBoundingClientRect(), css = getComputedStyle(line)
            if (bounds.width < 1) return []
            const expected = (box.left + parseFloat(css.paddingLeft) + box.right - parseFloat(css.paddingRight)) / 2
            const columns = Array.from(block.querySelectorAll('.first-theme-formula-relation')).map(el => el.getBoundingClientRect().left)
            return [{ id: line.dataset.testid, delta: Math.abs((bounds.left + bounds.right) / 2 - expected), overflow: line.scrollWidth - line.clientWidth, columns: columns.length ? Math.max(...columns) - Math.min(...columns) : 0 }]
          }))
          for (const entry of measures) {
            assert(entry.delta <= 2, 'Formula group is off-center ' + JSON.stringify({ unit: key, width, anchor, ...entry }))
            assert(entry.overflow <= 2, 'Formula clipping ' + JSON.stringify({ unit: key, width, anchor, ...entry }))
            assert(entry.columns <= 1, 'Relation column changed inside group ' + entry.id)
          }
          assert.equal(await page.locator('.katex-error').count(), 0)
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
          rows.push(...measures.map(entry => ({ unit: key, viewport: width, stage: anchor, resolved, ...entry })))
          views.push({ unit: key, width, anchor, resolved, equationNumbersChecked: numbered.length })
          if ((key === 'n01' && anchor === 'n01-r3-linear-heading') || (key !== 'n01' && index === 0)) {
            await stage.screenshot({ path: out + '/' + key + '-' + (resolved ? 'resolved' : 'initial') + '-' + width + '.png' })
          }
          if (index === 0 && !resolved) {
            const item = items.find(q => q.id === first)
            const blank = page.getByTestId('textbook-item-' + first)
            await blank.click()
            let panel = page.getByTestId('inline-choice-panel-' + first)
            const options = panel.locator('button.reading-choice-option')
            let wrong
            for (const option of await options.all()) if (await option.getAttribute('aria-label') !== item.answer) { wrong = option; break }
            assert(wrong, 'No visible distractor')
            await wrong.click()
            assert(await blank.isVisible(), 'Wrong answer unexpectedly completed item')
            const deltas = await stage.locator('.reading-formula-line--aligned').evaluateAll(lines => lines.flatMap(line => {
              const a = line.getBoundingClientRect(), b = line.querySelector('.first-theme-formula-rows').getBoundingClientRect()
              return b.width ? [Math.abs((a.left + a.right - b.left - b.right) / 2)] : []
            }))
            assert(deltas.every(d => d <= 2), 'Wrong-state formula moved off-center')
            await blank.click()
            await page.getByTestId('textbook-hint-' + first).waitFor()
            panel = page.getByTestId('inline-choice-panel-' + first)
            await panel.getByRole('button', { name: item.answer, exact: true }).click()
            await page.getByTestId('resolved-' + first).waitFor()
            interactions.push({ unit: key, width, wrongHintCorrect: true })
          }
        }
      }
    }
    await context.close()
  }
  assert.deepEqual(errors, [])
  fs.writeFileSync(out + '/report.json', JSON.stringify({ sourceSHA: process.env.CANDIDATE_SHA ?? 'local-working-tree', root, seededLayoutViews: views.length, formulaGroups: rows.length, rows, views, interactions, passed: true }, null, 2))
  console.log(JSON.stringify({ seededLayoutViews: views.length, formulaGroups: rows.length, interactions: interactions.length, maxCenterDelta: Math.max(...rows.map(r => r.delta)), passed: true }))
} finally { await browser.close() }
