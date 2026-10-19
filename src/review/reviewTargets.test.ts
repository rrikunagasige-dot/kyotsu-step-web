import { describe, expect, it } from 'vitest'
import { mathNumbersN01Unit } from '../data/textbook/math/numbers/n01Lesson'
import { mathNumbersN03Unit } from '../data/textbook/math/numbers/n03Lesson'
import { activeReviewMarkIds, extractReviewSection, reviewTargets } from './reviewTargets'

describe('W-GOV-008/P-002 review marker boundaries', () => {
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
