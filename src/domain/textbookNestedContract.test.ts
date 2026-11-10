import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { TextbookSectionSchema, TextbookUnitSchema } from './textbookSchema'
import { answerNestedPart, emptyNestedLedger, projectNestedLesson, type NestedLesson } from './nestedLesson'
import { effectiveTextbookProgress, resetTextbookUnitProgress, textbookSectionProgress, textbookUnitProgress, type TextbookUnitProgress } from './textbook'

const raw = (name: string) => JSON.parse(readFileSync(new URL('../data/textbook/math/numbers/' + name + '.json', import.meta.url), 'utf8'))
type Edition = 'previous-r9-r5' | 'current-r10-r6'
function fixture(code = 'n09', edition: Edition = 'current-r10-r6') {
  const source = raw(code + 'Authored'), compiled = raw(code + 'ConstructionCompiled' + (edition === 'previous-r9-r5' ? code === 'n09' ? 'R9' : 'R5' : ''))
  const lesson: NestedLesson = { unitId: compiled.unitId, fromRevision: compiled.fromRevision, toRevision: compiled.toRevision, compiledHash: compiled.compiledHash, nodes: compiled.nodeDesign }
  const unitInput = { ...source.unit, revision: compiled.toRevision, sections: source.unit.sections.map((s: { id: string }) => ({ ...s, readingFlow: [], figures: [], items: [] })), constructionLessonVersion: 'n0910/1', nestedContract: { compiledHash: compiled.compiledHash, parents: lesson.nodes.filter(n => n.parts.length).map(n => ({ nodeId: n.nodeId, sectionId: source.unit.sections[0].id, parts: n.parts.map(p => ({ id: p.id, expected: p.expected })) })) }, requiredInteractionRefs: lesson.nodes.filter(n => n.parts.length).map(n => n.nodeId) }
  return { source, lesson, unitInput, unit: TextbookUnitSchema.parse(unitInput) }
}
function progress(lesson: NestedLesson): TextbookUnitProgress { return { unitId: lesson.unitId, unitRevision: lesson.toRevision, startedAt: 1, updatedAt: 1, answers: {}, nestedProgress: emptyNestedLedger(lesson, 1) } }
function solve(lesson: NestedLesson, state: TextbookUnitProgress, count = Infinity) {
  let answered = 0
  while (projectNestedLesson(lesson, state.nestedProgress).editable && answered < count) {
    const edit = projectNestedLesson(lesson, state.nestedProgress).editable!, part = lesson.nodes.flatMap(n => n.parts).find(p => p.id === edit.partId)!
    state.nestedProgress = answerNestedPart(lesson, state.nestedProgress, part.id, part.expected, 'event-' + answered, 2)!
    answered++
  }
  return state
}

// Both literal historical compiled editions and current editions run every contract/negative/reset check.
describe.each(['previous-r9-r5', 'current-r10-r6'] as const)('%s: explicit N09/N10 unit schema and real parent progress', edition => {
  const editionFixture = (code = 'n09') => fixture(code, edition)
  const previous = edition === 'previous-r9-r5'
  it('permits empty items only for the opted-in current section with actual nested parents', () => {
    expect(editionFixture('n09').unit.revision).toBe(previous ? 9 : 10)
    expect(editionFixture('n09').unit.nestedContract!.parents).toHaveLength(previous ? 31 : 32)
    expect(editionFixture('n09').unit.nestedContract!.parents.flatMap(parent => parent.parts)).toHaveLength(previous ? 49 : 55)
    expect(editionFixture('n10').unit.revision).toBe(previous ? 5 : 6)
    expect(editionFixture('n10').unit.nestedContract!.parents).toHaveLength(previous ? 39 : 40)
    expect(editionFixture('n10').unit.nestedContract!.parents.flatMap(parent => parent.parts)).toHaveLength(previous ? 60 : 70)
    const source = raw('n10Authored').unit
    expect(TextbookUnitSchema.safeParse(source).success).toBe(true)
    const ordinaryEmpty = { ...source, sections: source.sections.map((s: object) => ({ ...s, items: [], figures: [], readingFlow: [] })) }
    expect(TextbookUnitSchema.safeParse(ordinaryEmpty).success).toBe(false)
    expect(TextbookSectionSchema.safeParse(editionFixture().unitInput.sections[0]).success).toBe(false)
  })
  for (const [name, change] of Object.entries({
    missingVersion: (u: ReturnType<typeof fixture>['unitInput']) => { Object.assign(u, { constructionLessonVersion: undefined }) },
    missingContract: (u: ReturnType<typeof fixture>['unitInput']) => { Object.assign(u, { nestedContract: undefined }) },
    foreignUnit: (u: ReturnType<typeof fixture>['unitInput']) => { u.unitId = 'math-numbers-expressions-n11' },
    wrongRevision: (u: ReturnType<typeof fixture>['unitInput']) => { u.revision = 3 },
    zeroParts: (u: ReturnType<typeof fixture>['unitInput']) => { u.nestedContract.parents[0].parts = [] },
    wrongSection: (u: ReturnType<typeof fixture>['unitInput']) => { u.nestedContract.parents[0].sectionId = 'unknown' },
    parentCollision: (u: ReturnType<typeof fixture>['unitInput']) => { u.nestedContract.parents[1].nodeId = u.nestedContract.parents[0].nodeId },
    partCollision: (u: ReturnType<typeof fixture>['unitInput']) => { u.nestedContract.parents[1].parts[0].id = u.nestedContract.parents[0].parts[0].id },
    missingRequired: (u: ReturnType<typeof fixture>['unitInput']) => { u.requiredInteractionRefs.pop() },
    unknownRequired: (u: ReturnType<typeof fixture>['unitInput']) => { u.requiredInteractionRefs.push('unknown') },
    ordinaryCollision: (u: ReturnType<typeof fixture>['unitInput']) => { Object.assign(u.sections[0], { items: [{ id: u.nestedContract.parents[0].nodeId, label: 'ordinary', prompt: 'ordinary', answer: '1', choices: ['1', '2'] }] }) },
    emptyUncoveredSection: (u: ReturnType<typeof fixture>['unitInput']) => { u.sections.push({ ...u.sections[0], id: 'other-section' }) },
  })) it('rejects invalid opt-in contract: ' + name, () => { const input = editionFixture().unitInput; change(input); expect(TextbookUnitSchema.safeParse(input).success).toBe(false) })

  for (const code of ['n09', 'n10']) it('counts actual part-certified parents for ' + code + ', never automatic nodes or old whole answers', () => {
    const f = editionFixture(code), initial = progress(f.lesson), total = f.unit.nestedContract!.parents.length
    expect(textbookUnitProgress(f.unit, initial)).toEqual({ completed: 0, total, percent: 0 })
    expect(projectNestedLesson(f.lesson).visible.some(n => n.resolved && !n.parts.length)).toBe(code === 'n09')
    const full = solve(f.lesson, initial)
    expect(textbookUnitProgress(f.unit, full)).toEqual({ completed: total, total, percent: 100 })
    expect(textbookSectionProgress(f.unit, full, f.unit.sections[0].id)).toEqual({ completed: total, total })
    expect(textbookSectionProgress(f.unit, full, 'unknown')).toEqual({ completed: 0, total: 0 })
    const previous = { ...full, unitRevision: f.lesson.fromRevision, answers: Object.fromEntries(f.unit.requiredInteractionRefs!.map(id => [id, { itemId: id, value: 'correct-old', isFirstCorrect: true, resolved: true, attemptCount: 1, firstAnsweredAt: 1, lastAnsweredAt: 1 }])) }
    expect(effectiveTextbookProgress(f.unit, previous)).toBeUndefined()
    expect(textbookUnitProgress(f.unit, previous).completed).toBe(0)
  })
  it('does not count an unfinished multi-part parent or a future saved parent', () => {
    const f = editionFixture('n09'), p = progress(f.lesson)
    const multi = f.lesson.nodes.find(n => n.parts.length > 1)!
    let index = 0
    while (projectNestedLesson(f.lesson, p.nestedProgress).editable?.nodeId !== multi.nodeId) {
      const edit = projectNestedLesson(f.lesson, p.nestedProgress).editable!, part = f.lesson.nodes.flatMap(n => n.parts).find(q => q.id === edit.partId)!
      p.nestedProgress = answerNestedPart(f.lesson, p.nestedProgress, part.id, part.expected, 'pre-' + index++, 2)!
    }
    const before = textbookUnitProgress(f.unit, p).completed
    p.nestedProgress = answerNestedPart(f.lesson, p.nestedProgress, multi.parts[0].id, multi.parts[0].expected, 'partial', 3)!
    expect(textbookUnitProgress(f.unit, p).completed).toBe(before)
    const fake = progress(f.lesson), last = f.unit.nestedContract!.parents.at(-1)!
    fake.nestedProgress!.parents[last.nodeId] = { attemptCount: 1 }
    for (const part of last.parts) {
      fake.nestedProgress!.draft[part.id] = part.expected
      fake.nestedProgress!.records[part.id] = { value: part.expected, firstValue: part.expected, selectionCount: 1, firstSelectedAt: 1, lastSelectedAt: 1 }
    }
    expect(textbookUnitProgress(f.unit, fake).completed).toBe(0)
  })
  it('requires current unit/revision/hash and complete part records', () => {
    const f = editionFixture(), full = solve(f.lesson, progress(f.lesson))
    for (const change of [ (p: TextbookUnitProgress) => { p.unitId = 'other' }, (p: TextbookUnitProgress) => { p.nestedProgress!.revision++ }, (p: TextbookUnitProgress) => { p.nestedProgress!.compiledHash = 'other' }, (p: TextbookUnitProgress) => { delete p.nestedProgress!.records[f.unit.nestedContract!.parents[0].parts[0].id] } ]) {
      const state = structuredClone(full); change(state)
      expect(textbookUnitProgress(f.unit, state).completed).toBe(0)
    }
  })
  it('home reset persists an empty current hash/revision and reset marker while archiving prior data', () => {
    const f = editionFixture(), old = solve(f.lesson, progress(f.lesson)), oldRaw = JSON.stringify(old)
    const reset = resetTextbookUnitProgress(f.unit, old, 100)!
    expect(reset.nestedResetAt).toBe(100); expect(reset.nestedProgress!.compiledHash).toBe(f.lesson.compiledHash)
    expect(reset.nestedProgress!.records).toEqual({}); expect(reset.nestedProgress!.draft).toEqual({})
    expect(reset.archivedRevisions![previous ? '9-reset-100' : '10-reset-100'].nestedProgress).toEqual(old.nestedProgress)
    expect(JSON.stringify(old)).toBe(oldRaw); expect(textbookUnitProgress(f.unit, reset).completed).toBe(0)
    const stale = { ...reset, nestedProgress: old.nestedProgress }
    expect(textbookUnitProgress(f.unit, stale).completed).toBe(0)
    expect(resetTextbookUnitProgress(f.unit, undefined, 100)?.nestedResetAt).toBe(100)
  })
})
