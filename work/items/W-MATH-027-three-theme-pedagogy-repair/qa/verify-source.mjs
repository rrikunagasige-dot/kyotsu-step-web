import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'
const base = 'work/items/W-MATH-027-three-theme-pedagogy-repair/'
const patch = JSON.parse(readFileSync(base + 'PATCH_P001_R1.json'))
const baseline = '30f1e9363ca33a88ffffccfd87c4abbd54f21c01'
const hash = x => createHash('sha256').update(x).digest('hex')
for (const f of patch.files) {
  assert.equal(hash(readFileSync(f.path)), f.after_sha256, f.path + ' differs from the user-approved patch')
  assert.equal(hash(execFileSync('git', ['show', baseline + ':' + f.path])), f.before_sha256)
}
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const temporary = []
try {
  const { mathTextbookUnits: units } = await server.ssrLoadModule('/src/data/textbook/math/index.ts')
  const { mathTextbookTopics: topics, mathTextbookNextUnitId: next } = await server.ssrLoadModule('/src/data/textbook/math/mathCatalog.ts')
  const chapter = topics.filter(t => t.chapterId === 'math-ch01-numbers-expressions')
  assert.deepEqual(chapter.map(t => t.label.ja), ['式を整える', '実数を扱う', '不等式を使う'])
  const assigned = chapter.flatMap(t => t.unitIds)
  assert.equal(assigned.length, 16); assert.equal(new Set(assigned).size, 16)
  const actual = units.filter(u => assigned.includes(u.unitId))
  assert.equal(actual.reduce((n, u) => n + u.sections.flatMap(s => s.items).length, 0), 315)
  assert.deepEqual(chapter.map(t => t.unitIds.reduce((n, id) => n + actual.find(u => u.unitId === id).sections.flatMap(s => s.items).length, 0)), [122, 77, 116])
  for (const code of ['ne01', 'ne02']) {
    const path = `src/data/textbook/math/numbers/${code}Lesson.ts`
    const temp = `src/data/textbook/math/numbers/.w027-before-${code}Lesson.ts`
    writeFileSync(temp, execFileSync('git', ['show', baseline + ':' + path])); temporary.push(temp)
    const mod = await server.ssrLoadModule('/' + temp)
    const before = mod[code === 'ne01' ? 'mathNumbersNE01Unit' : 'mathNumbersNE02Unit']
    const after = structuredClone(actual.find(u => u.unitId === before.unitId))
    const oldText = before.sections[0].readingFlow.find(b => b.id === code + '-intro-01').parts[0].text
    const block = after.sections[0].readingFlow.find(b => b.id === code + '-intro-01')
    assert.ok(block.parts[0].text.endsWith(oldText)); assert.notEqual(block.parts[0].text, oldText)
    block.parts[0].text = oldText
    assert.deepEqual(after, before, code + ': all IDs, revisions, answers, hints, figures and other prose remain unchanged')
  }
  assert.equal(next('math-numbers-expressions-n06'), 'math-numbers-expressions-ne01')
  assert.equal(next('math-numbers-expressions-n10'), 'math-numbers-expressions-ne02')
  assert.equal(next('math-numbers-expressions-ne01'), undefined); assert.equal(next('math-numbers-expressions-ne02'), undefined)
  const ledger = JSON.parse(readFileSync(base + 'SOURCE_AUDIT_LEDGER.json'))
  assert.equal(ledger.units.reduce((n, u) => n + Object.keys(u.sourceToItems).length, 0), 233)
  mkdirSync('e2e-evidence/wmath027', { recursive: true })
  writeFileSync('e2e-evidence/wmath027/source-invariants.json', JSON.stringify({ status: 'PASS', source: process.env.CAPTURE_SHA, baseline, originalQuestions: 233, units: 16, actions: 315, counts: [122,77,116], unchangedUnitDataExceptTwoIntroPrefixes: true }, null, 2))
} finally { for (const p of temporary) unlinkSync(p); await server.close() }
