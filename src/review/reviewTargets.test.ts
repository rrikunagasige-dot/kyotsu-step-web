import { describe, expect, it } from 'vitest'
import { mathNumbersN01Unit } from '../data/textbook/math/numbers/n01Lesson'
import { mathNumbersN03Unit } from '../data/textbook/math/numbers/n03Lesson'
import { mathNumbersN11Unit } from '../data/textbook/math/numbers/n11Lesson'
import { mathNumbersN14Unit } from '../data/textbook/math/numbers/n14Lesson'
import { activeReviewMarkIds, extractReviewSection, reviewTargets } from './reviewTargets'

describe('W-GOV-008/P-002 review marker boundaries', () => {
  it('W-MATH-017 P-006 marks only the new explanatory paragraphs in existing N11 revision8', () => {
    const q1 = reviewTargets['n11-q01']
    const q5 = reviewTargets['n11-q05']
    expect(q1.revision).toBe(10)
    expect(q5.revision).toBe(10)
    expect(activeReviewMarkIds(q1)).toEqual(['n11-formula-01'])
    expect(activeReviewMarkIds(q5)).toEqual([]) // P006 user visual approved
    expect(extractReviewSection(mathNumbersN11Unit,q1)?.items.map(i=>i.answer)).toEqual(['>'])
    expect(extractReviewSection(mathNumbersN11Unit,q5)?.items.map(i=>i.answer)).toEqual(['2','2','7','\\frac73'])
    expect(extractReviewSection({...mathNumbersN11Unit,revision:7},q5)).toBeNull()
    expect(activeReviewMarkIds({...q1,reviewState:'accepted'})).toEqual([])
    expect(activeReviewMarkIds({...q5,reviewState:'accepted'})).toEqual([])
    const q89=reviewTargets['n11-q08-q09']
    expect(q89.revision).toBe(10)
    expect(extractReviewSection(mathNumbersN11Unit,q89)?.items.map(i=>i.answer)).toEqual(['3','3','2','\\ge','-1'])
    expect(activeReviewMarkIds(q89)).toEqual([]) // P007 accepted
    const q13=reviewTargets['n11-q13']
    expect(extractReviewSection(mathNumbersN11Unit,q13)?.items.map(i=>i.answer)).toEqual(['3','3','6','3'])
    expect(activeReviewMarkIds(q13)).toEqual([]) // P008 accepted
    const n14=reviewTargets['n14-q10']
    expect(n14.revision).toBe(9)
    expect(n14.totalItems).toBe(34)
    expect(extractReviewSection(mathNumbersN14Unit,n14)?.items.map(i=>i.answer)).toEqual(['3','3','3','-2','8'])
    expect(activeReviewMarkIds(n14)).toEqual([])
    expect(extractReviewSection({...mathNumbersN14Unit,revision:6},n14)).toBeNull()
    const q14=reviewTargets['n14-q14']
    expect(q14.revision).toBe(9)
    expect(q14.totalItems).toBe(34)
    expect(extractReviewSection(mathNumbersN14Unit,q14)?.items.map(i=>i.answer)).toEqual(['2','2','2','-2','6'])
    expect(activeReviewMarkIds(q14)).toEqual([]) // Q14 user accepted concise formula Gate1 layout
    expect(extractReviewSection({...mathNumbersN14Unit,revision:7},q14)).toBeNull()
    const q15=reviewTargets['n14-q15']
    expect(q15.revision).toBe(9)
    expect(q15.totalItems).toBe(34)
    expect(extractReviewSection(mathNumbersN14Unit,q15)?.items.map(i=>i.answer)).toEqual(['3','3','3','-\\frac23','2'])
    expect(activeReviewMarkIds(q15)).toEqual(q15.markBlockIds)
    expect(extractReviewSection({...mathNumbersN14Unit,revision:8},q15)).toBeNull()
    expect(extractReviewSection({...mathNumbersN11Unit,revision:9},q89)).toBeNull()
  })

  it('marks only the seven user-review blocks, not original final examples', () => {
    expect(activeReviewMarkIds(reviewTargets['n01-q07'])).toEqual([
      'formula-r3-q07-x2coef', 'formula-r3-q07-xcoef', 'formula-r3-q07-const',
    ])
    expect(activeReviewMarkIds(reviewTargets['n03-q10'])).toEqual([
      'formula-r3-q10-p1', 'formula-r3-q10-p2',
      'formula-r3-q10-p3', 'formula-r3-q10-p4',
    ])
    expect(activeReviewMarkIds(reviewTargets['n01-q07'])).not.toContain('formula-n01-07')
    expect(activeReviewMarkIds(reviewTargets['n03-q10'])).not.toContain('formula-n03-10')
  })

  it('hides accepted marks without deleting their traceable IDs', () => {
    const target = reviewTargets['n01-q07']
    expect(activeReviewMarkIds({ ...target, reviewState: 'accepted' })).toEqual([])
    expect(target.markBlockIds).toHaveLength(3)
    expect(activeReviewMarkIds({ ...target, reviewState: 'needs-fix' })).toHaveLength(3)
  })

  it('fails closed for unknown, repeated, or out-of-scope markers', () => {
    const target = reviewTargets['n01-q07']
    expect(extractReviewSection(mathNumbersN01Unit, target)).not.toBeNull()
    expect(extractReviewSection(mathNumbersN03Unit, reviewTargets['n03-q10'])).not.toBeNull()
    expect(extractReviewSection(mathNumbersN01Unit, {
      ...target, markBlockIds: ['not-a-real-block'],
    })).toBeNull()
    expect(extractReviewSection(mathNumbersN01Unit, {
      ...target, markBlockIds: [target.markBlockIds[0], target.markBlockIds[0]],
    })).toBeNull()
  })
})
