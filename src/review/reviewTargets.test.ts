import { describe, expect, it } from 'vitest'
import { mathNumbersN01Unit } from '../data/textbook/math/numbers/n01Lesson'
import { mathNumbersN03Unit } from '../data/textbook/math/numbers/n03Lesson'
import { mathNumbersN11Unit } from '../data/textbook/math/numbers/n11Lesson'
import { activeReviewMarkIds, extractReviewSection, reviewTargets } from './reviewTargets'

describe('W-GOV-008/P-002 review marker boundaries', () => {
  it('W-MATH-017 P-003 reuses exact N11 revision7 source blocks with two distinct Q05 thinking steps', () => {
    const q1 = reviewTargets['n11-q01']
    const q5 = reviewTargets['n11-q05']
    expect(q1.revision).toBe(8)
    expect(q5.revision).toBe(8)
    expect(activeReviewMarkIds(q1)).toEqual(['n11-formula-01'])
    expect(activeReviewMarkIds(q5)).toEqual(['n11-formula-05', 'n11-after-05', 'n11-formula-06'])
    expect(extractReviewSection(mathNumbersN11Unit,q1)?.items.map(i=>i.answer)).toEqual(['>'])
    expect(extractReviewSection(mathNumbersN11Unit,q5)?.items.map(i=>i.answer)).toEqual(['2','2','7','\\frac73'])
    expect(extractReviewSection({...mathNumbersN11Unit,revision:7},q5)).toBeNull()
    expect(activeReviewMarkIds({...q1,reviewState:'accepted'})).toEqual([])
    expect(activeReviewMarkIds({...q5,reviewState:'accepted'})).toEqual([])
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
