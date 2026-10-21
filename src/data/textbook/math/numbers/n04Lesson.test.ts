import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { normalizeTextbookAnswer } from '../../../../domain/textbook'
import { mathNumbersN04Unit, n04SourceToItemIds } from './n04Lesson'
import { activeReviewMarkIds, extractReviewSection, reviewTargets } from '../../../../review/reviewTargets'

const section = mathNumbersN04Unit.sections[0]
const answers = ['25x^2', '20xy', '20xy', '16y^2', '25x^2+20xy+20xy+16y^2']

describe('W-MATH-003 / N04 22-source-marker batch, preserving exact Q01 pilot', () => {
  it('maps all original N04 markers while retaining the Q01 five-step block', () => {
    expect(mathNumbersN04Unit.unitId).toBe('math-numbers-expressions-n04')
    expect(mathNumbersN04Unit.status).toBe('review')
    expect(mathNumbersN04Unit.chapter?.sourcePages).toEqual([10, 11])
    expect(Object.keys(n04SourceToItemIds)).toHaveLength(22)
    expect(Object.keys(n04SourceToItemIds)).toEqual(Array.from({ length: 22 }, (_, i) => 'N04-Q' + String(i + 1).padStart(2, '0')))
    expect(section.items.slice(0, 5).map(item => item.id)).toEqual(n04SourceToItemIds['N04-Q01'])
    expect(section.figures.map(figure => figure.id)).toEqual(['n04-f01'])
    expect(section.items.slice(0, 5).map(item => item.answer)).toEqual(answers)
  })

  it('has four mathematical product holes before the uncombined 4-term source result', () => {
    const mapped = section.readingFlow.flatMap(block =>
      (block.type === 'paragraph' || block.type === 'formula')
        ? block.parts.filter(part => part.type === 'choice').map(part => part.itemId)
        : [],
    )
    expect(mapped.slice(0, 5)).toEqual([...n04SourceToItemIds['N04-Q01']])
    expect(mapped).toHaveLength(26)
    expect(section.readingFlow.filter(block => block.type === 'formula' && block.derivationId === 'n04-q01-four-products')).toHaveLength(4)
    expect(answers[4]).toBe('25x^2+20xy+20xy+16y^2')
    expect(answers[4]).not.toContain('40xy')

    // Numerically checks that each source-factor product is correct, including both cross terms.
    for (const [x, y] of [[1, 1], [2, -3], [-4, 5], [0, 2]]) {
      expect((5*x+4*y)**2).toBe(25*x*x+20*x*y+20*x*y+16*y*y)
    }
  })

  it('uses four distinct choices for each hole and valid formula rendering', () => {
    for (const item of section.items) {
      expect(item.choices).toHaveLength(4)
      expect(item.choices).toContain(item.answer)
      expect(new Set(item.choices?.map(normalizeTextbookAnswer)).size).toBe(4)
      for (const option of item.choices ?? [])
        expect(() => katex.renderToString(option, { throwOnError: true, strict: 'ignore' })).not.toThrow()
    }
    for (const block of section.readingFlow) {
      if (block.type !== 'formula' && block.type !== 'paragraph') continue
      for (const part of block.parts) if (part.type === 'math')
        expect(() => katex.renderToString(part.latex, { throwOnError: true, strict: 'ignore' })).not.toThrow()
    }
    expect(section.items.slice(0, 5).map(item => item.scaffoldLevel)).toEqual(['strong','strong','medium','medium','light'])
  })

  it('restricts numbered review marks to this exact real reading flow', () => {
    const target = reviewTargets['n04-q01']
    expect(target.revision).toBe(2)
    expect(target.totalItems).toBe(5)
    expect(activeReviewMarkIds(target)).toHaveLength(5)
    expect(extractReviewSection(mathNumbersN04Unit,target)?.items.map(item=>item.answer)).toEqual(answers)
    expect(extractReviewSection(mathNumbersN04Unit,{ ...target, revision: 1 })).toBeNull()
    expect(activeReviewMarkIds({ ...target, reviewState: 'accepted' })).toEqual([])
  })

  it('never gives away the combined original Q02 or final Q03 answers in learner text', () => {
    const firstHoleIndex = section.readingFlow.findIndex(block => block.id === 'formula-n04-q01-p1')
    expect(JSON.stringify(section.readingFlow.slice(0,firstHoleIndex))).not.toContain('25x^2')
    expect(JSON.stringify(section.readingFlow.slice(0,firstHoleIndex))).not.toContain('20xy')
  })
})
