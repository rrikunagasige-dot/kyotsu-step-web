import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { answerNestedPart, emptyNestedLedger, projectNestedLesson, type NestedLesson } from './nestedLesson'
import { migrateReviewedNestedProgress, REVIEWED_N10_MIGRATION, type ReviewedNestedMigrationInput } from './nestedMigration'

const raw = (path: string) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8')
const oldSourceJson = raw('src/data/textbook/math/numbers/n10Authored.json')
const designJson = raw('work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json')
const analysisJson = raw('work/items/W-MATH-043-n0910-restart/evidence/migration-analysis.json')
const source = JSON.parse(oldSourceJson), analysis = JSON.parse(analysisJson)
const unit = JSON.parse(designJson).units.find((u: { code: string }) => u.code === 'N10')
const lesson: NestedLesson = { unitId: unit.unitId, fromRevision: unit.fromRevision, toRevision: unit.toRevision, compiledHash: 'compiled-candidate-with-real-validator-binding', nodes: unit.nodes }
function base(): ReviewedNestedMigrationInput {
  return { lesson: structuredClone(lesson), oldSourceJson, designJson, analysisJson, now: 100,
    oldProgress: { unitId: lesson.unitId, unitRevision: 2, startedAt: 1, updatedAt: 20, completedAt: 20, answers: Object.fromEntries(analysis.proposedMappings.map((m: { oldId: string }) => {
      const item = source.unit.sections.flatMap((s: { items: { id: string; answer: string }[] }) => s.items).find((i: { id: string }) => i.id === m.oldId)
      return [m.oldId, { itemId: m.oldId, value: item.answer, firstValue: item.answer, isFirstCorrect: true, resolved: true, attemptCount: 1, firstAnsweredAt: 10, lastAnsweredAt: 10 }]
    })) },
    compiledBinding: { compiledHash: lesson.compiledHash, ...REVIEWED_N10_MIGRATION },
  }
}
function reach(input: ReviewedNestedMigrationInput, target: string) {
  let ledger = emptyNestedLedger(input.lesson, input.now)
  let count = 0
  while (projectNestedLesson(input.lesson, ledger).editable?.partId !== target) {
    const edit = projectNestedLesson(input.lesson, ledger).editable
    if (!edit || count > 100) throw Error('cannot reach ' + target)
    const p = input.lesson.nodes.flatMap(n => n.parts).find(p => p.id === edit.partId)!
    ledger = answerNestedPart(input.lesson, ledger, p.id, p.expected, 'native-' + count++, 90)!
  }
  input.ledger = ledger
}
const records = (input: ReviewedNestedMigrationInput) => (input.oldProgress as { answers: Record<string, { itemId: string; value: string; firstValue?: string; isFirstCorrect: boolean; resolved: boolean; attemptCount: number; firstAnsweredAt: number; lastAnsweredAt: number }> }).answers

describe('source-bound reviewed N10 migration', () => {
  it('verifies all three real artifacts and keeps all unreachable answers pending', async () => {
    const input = base(), frozen = JSON.stringify(input.oldProgress)
    const r = await migrateReviewedNestedProgress(input)
    expect(r.status).toBe('READY'); expect(r.blockedReasons).toEqual([])
    expect(Object.keys(r.pendingImportedRecords)).toHaveLength(7)
    expect(r.ledger.draft).toEqual({}); expect(r.ledger.records).toEqual({})
    expect(r.receipt.activatedPartIds).toEqual([]); expect(r.archive).toEqual(input.oldProgress)
    expect(JSON.stringify(input.oldProgress)).toBe(frozen); expect(r.archive).not.toBe(input.oldProgress)
    expect(r.ledger).not.toHaveProperty('completedAt')
  })
  it('rejects caller booleans and altered source/design/analysis or compiled projection', async () => {
    for (const key of ['oldSourceJson', 'designJson', 'analysisJson'] as const) {
      const input = base(); input[key] += ' '
      expect((await migrateReviewedNestedProgress(input)).blockedReasons[0].code).toBe('REVIEWED_ARTIFACT_HASH_MISMATCH')
    }
    const binding = base(); binding.compiledBinding.designSha256 = 'caller-approved'
    expect((await migrateReviewedNestedProgress(binding)).status).toBe('BLOCKED')
    const changed = base(); changed.lesson.nodes[0].parts[0].expected = 'forged'
    expect((await migrateReviewedNestedProgress(changed)).blockedReasons[0].code).toBe('RUNTIME_DESIGN_PROJECTION_MISMATCH')
    const copy = base(); copy.lesson.nodes[0].assumptionParts = [[{ type: 'text', text: 'changed mathematical conditions' }]]
    expect((await migrateReviewedNestedProgress(copy)).blockedReasons[0].code).toBe('RUNTIME_DESIGN_PROJECTION_MISMATCH')
    const compiled = base(); compiled.compiledBinding.compiledHash = 'other'
    expect((await migrateReviewedNestedProgress(compiled)).blockedReasons[0].code).toBe('COMPILED_BINDING_MISMATCH')
  })
  it('activates only reachable same-meaning answer and preserves first wrong plus old times/count', async () => {
    const input = base(); reach(input, 'n10-q04-sign::relation')
    records(input)['n10-q04-sign'] = { itemId: 'n10-q04-sign', value: ' > ', firstValue: '<', isFirstCorrect: false, resolved: true, attemptCount: 2, firstAnsweredAt: 4, lastAnsweredAt: 8 }
    const beforeEvents = [...input.ledger!.processedEventIds], beforeNative = JSON.stringify(input.ledger)
    const r = await migrateReviewedNestedProgress(input)
    expect(r.ledger.records['n10-q04-sign::relation']).toEqual({ value: '>', firstValue: '<', selectionCount: 2, firstSelectedAt: 4, lastSelectedAt: 8 })
    expect(r.ledger.parents['n10-q04-sign'].isFirstCorrect).toBe(false)
    expect(r.ledger.processedEventIds).toEqual(beforeEvents); expect(JSON.stringify(input.ledger)).toBe(beforeNative)
    expect(r.receipt.activatedPartIds).toContain('n10-q04-sign::relation')
    expect(r.receipt.activatedPartIds).not.toContain('n10-q21-constants::C')
    expect(r.pendingImportedRecords['n10-q21-constants::C']).toBeDefined()
    const again = await migrateReviewedNestedProgress({ ...input, ledger: r.ledger })
    expect(again.ledger.records['n10-q04-sign::relation'].selectionCount).toBe(2)
    expect(again.receipt.activatedPartIds).not.toContain('n10-q04-sign::relation')
  })
  it('preserves an unresolved wrong answer as editable and keeps future imports pending', async () => {
    const input = base(); reach(input, 'n10-q04-sign::relation')
    records(input)['n10-q04-sign'] = { itemId: 'n10-q04-sign', value: '<', firstValue: '<', isFirstCorrect: false, resolved: false, attemptCount: 1, firstAnsweredAt: 4, lastAnsweredAt: 4 }
    const r = await migrateReviewedNestedProgress(input)
    expect(r.ledger.draft['n10-q04-sign::relation']).toBe('<')
    expect(projectNestedLesson(input.lesson, r.ledger).editable?.partId).toBe('n10-q04-sign::relation')
    expect(r.pendingImportedRecords['n10-q05-denominator::relation']).toBeDefined()
  })
  it('blocks missing firstValue, contradictory grading, unknown candidates, reverse times and invalid counts', async () => {
    const mutations = [
      (r: ReturnType<typeof records>[string]) => { delete r.firstValue },
      (r: ReturnType<typeof records>[string]) => { r.isFirstCorrect = false },
      (r: ReturnType<typeof records>[string]) => { r.value = '?' },
      (r: ReturnType<typeof records>[string]) => { r.lastAnsweredAt = 1 },
      (r: ReturnType<typeof records>[string]) => { r.attemptCount = 0 },
      (r: ReturnType<typeof records>[string]) => { r.attemptCount = Number.MAX_SAFE_INTEGER + 1 },
      (r: ReturnType<typeof records>[string]) => { r.firstAnsweredAt = -1 },
      (r: ReturnType<typeof records>[string]) => { r.firstAnsweredAt = -2; r.lastAnsweredAt = -1 },
      (r: ReturnType<typeof records>[string]) => { r.value = '<'; r.resolved = false },
    ]
    for (const change of mutations) {
      const input = base(); change(records(input)['n10-q04-sign'])
      const r = await migrateReviewedNestedProgress(input)
      expect(r.status).toBe('PARTIAL'); expect(r.blockedReasons).toContainEqual(expect.objectContaining({ oldId: 'n10-q04-sign' }))
      expect(r.pendingImportedRecords['n10-q04-sign::relation']).toBeUndefined()
    }
  })
  const allCandidateRecords = (analysis.proposedMappings as { oldId: string; newPartId: string; candidateMap: { oldValue: string; newValue: string; oldIsCorrect: boolean; newIsCorrect: boolean }[] }[]).flatMap(mapping => mapping.candidateMap.flatMap(first => mapping.candidateMap.filter(current => !first.oldIsCorrect || current.oldIsCorrect).map(current => ({ id: mapping.oldId + ': first=' + first.oldValue + ', current=' + current.oldValue, mapping, first, current }))))
  it.each(allCandidateRecords)('migrates all reviewed candidate records: $id', async ({ mapping, first, current }) => {
    const input = base(); reach(input, mapping.newPartId)
    const attemptCount = first.oldValue === current.oldValue ? 1 : 2
    records(input)[mapping.oldId] = { itemId: mapping.oldId, value: '\u3000' + current.oldValue + ' ', firstValue: ' ' + first.oldValue + '\u3000', isFirstCorrect: first.oldIsCorrect, resolved: current.oldIsCorrect, attemptCount, firstAnsweredAt: 7, lastAnsweredAt: attemptCount === 1 ? 7 : 9 }
    const nativeEvents = [...input.ledger!.processedEventIds]
    const result = await migrateReviewedNestedProgress(input)
    expect(result.blockedReasons).toEqual([])
    expect(result.receipt.activatedPartIds).toContain(mapping.newPartId)
    expect(result.ledger.records[mapping.newPartId]).toEqual({ value: current.newValue, firstValue: first.newValue, selectionCount: attemptCount, firstSelectedAt: 7, lastSelectedAt: attemptCount === 1 ? 7 : 9 })
    const node = input.lesson.nodes.find(n => n.parts.some(p => p.id === mapping.newPartId))!
    expect(result.ledger.parents[node.nodeId].isFirstCorrect).toBe(first.oldIsCorrect)
    expect(result.ledger.processedEventIds).toEqual(nativeEvents)
    if (!current.oldIsCorrect) expect(projectNestedLesson(input.lesson, result.ledger).editable?.partId).toBe(mapping.newPartId)
  })
  it('keeps reset-empty authoritative across reimport and simulated reload', async () => {
    const input = base(); input.resetAt = 99
    const r = await migrateReviewedNestedProgress(input)
    expect(r.status).toBe('RESET_SUPPRESSED'); expect(r.pendingImportedRecords).toEqual({}); expect(r.ledger.draft).toEqual({})
    const again = await migrateReviewedNestedProgress({ ...input, ledger: JSON.parse(JSON.stringify(r.ledger)), resetAt: JSON.parse(JSON.stringify(r.receipt)).resetAt })
    expect(again.ledger.records).toEqual({}); expect(again.receipt.activatedPartIds).toEqual([])
  })
  it('rejects wrong old unit/revision and current ledger provenance', async () => {
    for (const changes of [{ unitId: 'other' }, { unitRevision: 3 }]) {
      const input = base(); Object.assign(input.oldProgress!, changes)
      expect((await migrateReviewedNestedProgress(input)).blockedReasons[0].code).toBe('OLD_PROGRESS_BINDING_INVALID')
    }
    const input = base(); input.ledger = { ...emptyNestedLedger(input.lesson, 90), compiledHash: 'other' }
    expect((await migrateReviewedNestedProgress(input)).blockedReasons[0].code).toBe('CURRENT_LEDGER_OR_TIME_INVALID')
  })
})
