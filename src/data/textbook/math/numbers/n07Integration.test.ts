import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { mathNumbersN07Unit as unit, n07SourceToItemIds, n07Presentation } from './n07Lesson'
import { mathNumbersN07Unit as legacy } from './n07LegacyLesson'
import { answerTextbookItem, effectiveTextbookProgress, textbookUnitProgress, type TextbookUnitProgress } from '../../../../domain/textbook'

describe('approved N07 code-to-app integration', () => {
  it('binds the registered v4 unit to the exact approved plan and reproducible output', () => {
    const raw = readFileSync('work/items/W-GOV-010-learning-production-workflow/n07/N07_DESIGN_PLAN.json')
    expect(createHash('sha256').update(raw).digest('hex')).toBe(n07Presentation.contentApproval)
    execFileSync(process.execPath, ['tools/textbook/integrate-n07.mjs', '--check'])
    expect(unit.revision).toBe(4)
    expect(n07Presentation.nodes).toHaveLength(41)
    expect(n07Presentation.stages).toHaveLength(14)
    expect(unit.sections[0].items).toHaveLength(36)
    expect(Object.keys(n07SourceToItemIds)).toHaveLength(14)
    expect(Object.values(n07SourceToItemIds).flat()).toEqual(unit.sections[0].items.map(item => item.id))
  })
  it('keeps only identical old answer contracts and archives v1-v3 without erasing history', () => {
    for (const revision of [1, 2, 3]) {
      let old: TextbookUnitProgress | undefined
      for (const item of legacy.sections[0].items) old = answerTextbookItem(old, legacy, item, item.answer, 100)
      old = { ...old!, unitRevision: revision, archivedRevisions: { '0': { unitRevision: 0, answers: {}, startedAt: 1, updatedAt: 2 } } }
      const snapshot = structuredClone(old)
      const migrated = effectiveTextbookProgress(unit, old)!
      expect(Object.keys(migrated.answers)).toEqual(['n07-10', 'n07-14'])
      for (const id of ['n07-10', 'n07-14']) {
        expect(migrated.answers[id]).toEqual(old.answers[id])
        expect(unit.sections[0].items.find(item => item.id === id)?.answer).toBe(legacy.sections[0].items.find(item => item.id === id)?.answer)
      }
      expect(migrated.archivedRevisions?.[String(revision)].answers).toEqual(old.answers)
      expect(migrated.archivedRevisions?.['0']).toEqual(old.archivedRevisions?.['0'])
      expect(migrated.completedAt).toBeUndefined()
      expect(textbookUnitProgress(unit, migrated).completed).toBe(2)
      expect(effectiveTextbookProgress(unit, migrated)).toBe(migrated)
      expect(old).toEqual(snapshot)
    }
  })
  it('grades every generated decision with existing learner logic; wrong answers never complete it', () => {
    let progress: TextbookUnitProgress | undefined
    for (const item of unit.sections[0].items) {
      progress = answerTextbookItem(progress, unit, item, item.choices!.find(choice => choice !== item.answer)!, 100)
      expect(progress.answers[item.id].resolved).toBe(false)
      progress = answerTextbookItem(progress, unit, item, item.answer, 200)
      expect(progress.answers[item.id].resolved).toBe(true)
    }
    expect(textbookUnitProgress(unit, progress).completed).toBe(36)
    expect(progress?.completedAt).toBeTruthy()
  })
})
