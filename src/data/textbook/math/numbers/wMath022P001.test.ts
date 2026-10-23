import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { mathNumbersN14Unit, n14SourceToItemIds } from './n14Lesson'
import { effectiveTextbookProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../../../../domain/textbook'

const unit = mathNumbersN14Unit
const section = unit.sections[0]
const at = (id: string) => section.readingFlow.findIndex(block => block.id === id)
const item = (id: string) => section.items.find(entry => entry.id === id)!
const record = (id: string, value: string): TextbookAnswerRecord => ({
  itemId: id, value, firstValue: value, resolved: true, isFirstCorrect: true,
  attemptCount: 1, firstAnsweredAt: 100, lastAnsweredAt: 200,
})

describe('W-MATH-022/P-001 N14 Q16 endpoint verification', () => {
  it('preserves 16 original source questions, 38 app decisions, Q15/Q16 boundary and original diagram', () => {
    expect(unit.revision).toBe(10)
    expect(Object.keys(n14SourceToItemIds)).toHaveLength(16)
    expect(section.items).toHaveLength(38)
    expect(section.items.map(entry => entry.id)).toEqual(Object.values(n14SourceToItemIds).flat())
    expect(n14SourceToItemIds['N14-Q16']).toEqual([
      'n14-wm022-q16-left-inner', 'n14-wm022-q16-left-abs',
      'n14-wm022-q16-right-inner', 'n14-wm022-q16-right-abs', 'n14-16',
    ])
    expect(section.figures.map(f => f.id)).toEqual(['n14-f01'])
    expect(at('n14-after-15') + 1).toBe(at('n14-lead-16'))
    const ids = [
      'n14-lead-16', 'n14-formula-16', 'n14-wm022-q16-right',
      'n14-wm022-q16-bridge', 'n14-wm022-q16-conclusion', 'n14-after-16',
    ]
    const positions = ids.map(at)
    expect(positions).toEqual(positions.map((_, index) => positions[0] + index))
    expect(ids.slice(0, 5).map(id => section.readingFlow[at(id)]).every(block =>
      (block.type === 'paragraph' || block.type === 'formula') &&
      block.derivationId === 'n14-q16-chain',
    )).toBe(true)
    const choiceIds = section.readingFlow.flatMap(block =>
      block.type === 'formula' || block.type === 'paragraph'
        ? block.parts.flatMap(part => part.type === 'choice' ? [part.itemId] : [])
        : [],
    )
    expect(choiceIds).toEqual(Object.values(n14SourceToItemIds).flat())
    const q16ChoiceBlocks = ids.map(id => section.readingFlow[at(id)]).flatMap(block =>
      block.type === 'formula' || block.type === 'paragraph'
        ? block.parts.flatMap(part => part.type === 'choice' ? [part.itemId] : [])
        : [],
    )
    expect(q16ChoiceBlocks).toEqual(n14SourceToItemIds['N14-Q16'])
    expect(at('n14-after-16')).toBe(section.readingFlow.length - 1)
  })

  it('asks for four distinct calculations followed by endpoint inclusion and never gives unresolved values in hints', () => {
    const ids = n14SourceToItemIds['N14-Q16']
    expect(ids.map(id => item(id).answer)).toEqual(['-4', '4', '4', '4', '両端とも含む'])
    expect(ids.map(id => item(id).answerType)).toEqual(['formula', 'formula', 'formula', 'formula', 'text'])
    const targets = ['3\\times(-\\frac13)', '|-3|=3', '3×1−2', '|2|=2', '|−2|≤2']
    for (const [index, id] of ids.entries()) {
      const q = item(id)
      const choices = q.choices ?? []
      expect(choices).toHaveLength(4)
      expect(new Set(choices).size).toBe(4)
      expect(choices.filter(option => option === q.answer)).toHaveLength(1)
      expect(q.hints).toHaveLength(1)
      expect(q.hints[0]).not.toContain('3x−2=−4')
      expect(q.hints[0]).not.toContain('3x−2=4')
      if (index < 4) {
        for (const answer of choices) expect(() => katex.renderToString(answer, { throwOnError: true })).not.toThrow()
      }
    }
    expect(item(ids[0]).hints[0]).toContain('3×(−1/3)')
    expect(item(ids[1]).hints[0]).toContain('|−3|=3')
    expect(item(ids[2]).hints[0]).toContain('3×1−2')
    expect(item(ids[3]).hints[0]).toContain('|2|=2')
    expect(item(ids[4]).hints[0]).toContain('|−2|≤2')
    expect(targets.length).toBe(5)
    for (const block of section.readingFlow.slice(at('n14-lead-16'), at('n14-after-16'))) {
      if (block.type !== 'formula' && block.type !== 'paragraph') continue
      for (const part of block.parts) if (part.type === 'math')
        expect(() => katex.renderToString(part.latex, { throwOnError: true, strict: 'ignore' }), block.id).not.toThrow()
    }
    expect(3 * (-2 / 3) - 2).toBe(-4)
    expect(Math.abs(3 * (-2 / 3) - 2)).toBe(4)
    expect(3 * 2 - 2).toBe(4)
    expect(Math.abs(3 * 2 - 2)).toBe(4)
  })

  it('retains every Q10/Q14/Q15 approved item identity, key and 4-stage Q15 hint', () => {
    const q15 = n14SourceToItemIds['N14-Q15']
    expect(q15).toEqual(['n14-wm020-q15-divide-left','n14-wm020-q15-divide-center',
      'n14-wm020-q15-divide-right','n14-15','n14-wm020-q15-bound-right'])
    expect(q15.map(id => item(id).answer)).toEqual(['3', '3', '3', '-\\frac23', '2'])
    expect(item('n14-wm020-q15-divide-center').hints[0]).toContain('④ この掛け算を割り算に直すと')
    expect(n14SourceToItemIds['N14-Q14']).toHaveLength(5)
    expect(n14SourceToItemIds['N14-Q10']).toHaveLength(5)
    expect(item('n14-14').answer).toBe('-2')
    expect(item('n14-10').answer).toBe('-2')
    expect(at('n14-after-15')).toBeLessThan(at('n14-lead-16'))
  })

  it('archives v9 and reopens ONLY repurposed n14-16; Q10 Q14 Q15 and other answers remain intact', () => {
    const old: TextbookUnitProgress = {
      unitId: unit.unitId, unitRevision: 9, startedAt: 10, updatedAt: 200, completedAt: 210,
      answers: Object.fromEntries([
        ['n14-07', record('n14-07', 'source')],
        ['n14-wm018-q10-add-left', record('n14-wm018-q10-add-left', '3')],
        ['n14-10', record('n14-10', '-2')],
        ['n14-wm019-q14-add-center', record('n14-wm019-q14-add-center', '2')],
        ['n14-14', record('n14-14', '-2')],
        ['n14-wm020-q15-divide-center', record('n14-wm020-q15-divide-center', '3')],
        ['n14-15', record('n14-15', '-\\frac23')],
        ['n14-wm020-q15-bound-right', record('n14-wm020-q15-bound-right', '2')],
        ['n14-16', record('n14-16', '|-4|=4,\\quad|4|=4')],
      ]),
      archivedRevisions: { '8': { unitRevision: 8, startedAt: 1, updatedAt: 2,
        answers: { 'n14-01': record('n14-01','old v8') } } },
    }
    const migrated = effectiveTextbookProgress(unit, old)!
    expect(migrated.unitRevision).toBe(10)
    expect(migrated.migratedFromRevision).toBe(9)
    expect(migrated.completedAt).toBeUndefined()
    expect(migrated.previousRevisionCompletedAt).toBe(210)
    expect(migrated.archivedRevisions?.['9']?.answers).toEqual(old.answers)
    expect(migrated.archivedRevisions?.['9']?.completedAt).toBe(210)
    expect(migrated.archivedRevisions?.['8']).toEqual(old.archivedRevisions?.['8'])
    for (const id of Object.keys(old.answers).filter(id => id !== 'n14-16')) {
      expect(migrated.answers[id]).toEqual(old.answers[id])
    }
    for (const id of n14SourceToItemIds['N14-Q16']) expect(migrated.answers[id]).toBeUndefined()
    expect(effectiveTextbookProgress(unit, migrated)).toBe(migrated)
  })

  it('preserves revisions 1–9 by chained migration; never resurrects prior bundled n14-16', () => {
    for (let oldRev = 1; oldRev <= 9; oldRev++) {
      const source: TextbookUnitProgress = {
        unitId: unit.unitId, unitRevision: oldRev, startedAt: 1, updatedAt: 3,
        answers: { 'n14-01': record('n14-01','old'), 'n14-16': record('n14-16','old bundled') },
      }
      const migrated = effectiveTextbookProgress(unit, source)!
      expect(migrated.unitRevision).toBe(10)
      expect(migrated.answers['n14-16']).toBeUndefined()
      expect(migrated.answers['n14-01']).toEqual(source.answers['n14-01'])
      for (let k = oldRev; k <= 9; k++) expect(migrated.archivedRevisions?.[String(k)]).toBeDefined()
      expect(effectiveTextbookProgress(unit, migrated)).toBe(migrated)
    }
  })
})
