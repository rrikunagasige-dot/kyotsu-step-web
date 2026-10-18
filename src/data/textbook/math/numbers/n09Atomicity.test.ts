import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { effectiveTextbookProgress, getTextbookChoices, isTextbookItemResolved, textbookUnitProgress, type TextbookUnitProgress } from '../../../../domain/textbook'
import { textbookDisplayLines } from '../../../../domain/textbookDisplayLines'
import { mathNumbersN09Unit, n09SourceToItemIds } from './n09Lesson'

const section = mathNumbersN09Unit.sections[0]
const original = Object.values(n09SourceToItemIds).flat()
const inserts = [
  'n09-p001-q08-left-square',
  'n09-p001-q08-right-square',
  'n09-p001-q08-lower-sign',
  'n09-p001-q08-upper-sign',
]
const ids = section.items.map(q => q.id)
const visible = section.readingFlow.flatMap(block =>
  block.type === 'paragraph' || block.type === 'formula'
    ? block.parts.flatMap(p => p.type === 'choice' ? [p.itemId] : [])
    : [],
)
const answers = ['1.9881', '2.0164', '<', '<']

describe('W-MATH-009/P-001: N09 Q08 calculation and sign holes', () => {
  it('preserves 14 original source questions and places all four prerequisite holes before the unchanged Q08', () => {
    expect(mathNumbersN09Unit.revision).toBe(2)
    expect(mathNumbersN09Unit.status).toBe('review')
    expect(ids).toHaveLength(18)
    expect(ids).toEqual([...original.slice(0, 7), ...inserts, ...original.slice(7)])
    expect(visible).toEqual(ids)
    expect(section.figures.map(f => f.id)).toEqual(['n09-f01'])
    expect(inserts.map(id => section.items.find(q => q.id === id)?.answer)).toEqual(answers)
    expect(section.items.find(q => q.id === 'n09-08')?.answer).toBe('1.41^2=1.9881<2<2.0164=1.42^2')
  })

  it('requires independent correct answers and excludes true-but-unintended distractors', () => {
    for (const [i, id] of inserts.entries()) {
      const item = section.items.find(q => q.id === id)!
      const choices = getTextbookChoices(mathNumbersN09Unit, item)
      expect(choices).toContain(answers[i])
      expect(item.choices).toHaveLength(4)
      expect(new Set(item.choices)).toHaveProperty('size', 4)
      for (const option of item.choices ?? []) {
        expect(() => katex.renderToString(option, { throwOnError: true, strict: 'ignore' })).not.toThrow()
      }
    }
    for (const id of inserts.slice(2)) {
      const choices = section.items.find(q => q.id === id)!.choices ?? []
      expect(choices).toEqual(['<', '>', '=', '\\ge'])
      expect(choices).not.toContain('\\le')
    }
  })

  it('does not show the derived squares and comparisons before their own decisions', () => {
    const flow = section.readingFlow
    const choicePosition = (id: string) => flow.findIndex(block =>
      (block.type === 'paragraph' || block.type === 'formula')
      && block.parts.some(part => part.type === 'choice' && part.itemId === id))
    const prefix = (id: string) => JSON.stringify(flow.slice(0, choicePosition(id)))
    expect(prefix(inserts[0])).not.toContain('1.9881')
    expect(prefix(inserts[1])).not.toContain('2.0164')
    expect(prefix(inserts[2])).not.toContain('1.9881<2')
    expect(prefix(inserts[3])).not.toContain('2<2.0164')
    for (let i = 1; i < inserts.length; i++) {
      expect(choicePosition(inserts[i - 1])).toBeLessThan(choicePosition(inserts[i]))
    }
    expect(choicePosition(inserts[3])).toBeLessThan(choicePosition('n09-08'))
  })

  it('formats all four Q08 answer options as short independent math rows without changing scoring', () => {
    const q08 = section.items.find(q => q.id === 'n09-08')!
    for (const option of q08.choices ?? []) {
      const rows = textbookDisplayLines(q08.id, option)
      expect(rows).toHaveLength(3)
      for (const row of rows) {
        expect(row.length).toBeLessThan(24)
        expect(() => katex.renderToString(row, { throwOnError: true, strict: 'ignore' })).not.toThrow()
      }
    }
    expect(textbookDisplayLines('n12-10', '50+180x+130(20-x)'))
      .toEqual(['50+180x', '+130(20-x)'])
    expect(textbookDisplayLines('n02-05', '0x')).toEqual(['0x'])
  })

  it('archives N09 v1 answers including completion and restarts at the first hole of revision 2', () => {
    const old: TextbookUnitProgress = {
      unitId: mathNumbersN09Unit.unitId,
      unitRevision: 1,
      startedAt: 100,
      updatedAt: 200,
      completedAt: 200,
      answers: {
        'n09-01': {
          itemId: 'n09-01', value: 'x=4,\\ -4', isFirstCorrect: true,
          resolved: true, attemptCount: 2, firstAnsweredAt: 101, lastAnsweredAt: 200,
        },
      },
    }
    const migrated = effectiveTextbookProgress(mathNumbersN09Unit, old)!
    expect(migrated.unitRevision).toBe(2)
    expect(migrated.answers).toEqual({})
    expect(migrated.completedAt).toBeUndefined()
    expect(migrated.previousRevisionCompletedAt).toBe(200)
    expect(migrated.archivedRevisions?.['1']).toMatchObject({
      unitRevision: 1, startedAt: 100, updatedAt: 200, completedAt: 200,
      answers: old.answers,
    })
    expect(effectiveTextbookProgress(mathNumbersN09Unit, migrated)).toBe(migrated)
    expect(old.answers['n09-01']).toBeDefined()
    expect(textbookUnitProgress(mathNumbersN09Unit, old)).toEqual({ completed: 0, total: 18, percent: 0 })
    expect(isTextbookItemResolved(section.items[0], migrated.answers['n09-01'])).toBe(false)
  })
})
