import { describe, expect, it } from 'vitest'
import { mathPropositionProofUnit } from './propositionProofLesson'

describe('math proposition-proof textbook unit', () => {
  it('keeps the proof source scope in review during audit', () => {
    expect(mathPropositionProofUnit.status).toBe('review')
    expect(mathPropositionProofUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
    expect(mathPropositionProofUnit.chapter?.sourcePages).toEqual([96, 97, 98])
  })

  it('establishes equivalence before building reverse, inverse, and contrapositive', () => {
    const flow = mathPropositionProofUnit.sections[0].readingFlow
    const eqForwardIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-e01',
      ),
    )
    const eqReverseIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-e02',
      ),
    )
    const equivalenceConceptIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('pとqは同値である'),
      ),
    )
    const reverseIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-a01',
      ),
    )
    const inverseIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-a02',
      ),
    )
    const contrapositiveIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-a03',
      ),
    )
    expect(eqForwardIndex).toBeGreaterThanOrEqual(0)
    expect(eqReverseIndex).toBeGreaterThan(eqForwardIndex)
    expect(equivalenceConceptIndex).toBeGreaterThan(eqReverseIndex)
    expect(reverseIndex).toBeGreaterThan(equivalenceConceptIndex)
    expect(inverseIndex).toBeGreaterThan(reverseIndex)
    expect(contrapositiveIndex).toBeGreaterThan(inverseIndex)
  })

  it('chooses the contrapositive before starting the divisibility proof', () => {
    const flow = mathPropositionProofUnit.sections[0].readingFlow
    const contrapositiveDecision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-b01',
      ),
    )
    const caseSplitDecision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-b02',
      ),
    )
    expect(contrapositiveDecision).toBeGreaterThanOrEqual(0)
    expect(caseSplitDecision).toBeGreaterThan(contrapositiveDecision)
  })

  it('uses a contradiction before rejecting the nonzero assumption', () => {
    const flow = mathPropositionProofUnit.sections[0].readingFlow
    const contradictionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-c03',
      ),
    )
    const conclusionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-c04',
      ),
    )
    expect(contradictionIndex).toBeGreaterThanOrEqual(0)
    expect(conclusionIndex).toBeGreaterThan(contradictionIndex)
  })

  it('keeps the proof lesson to three learner-facing headings', () => {
    const headings = mathPropositionProofUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual([
      '同値と命題の向きを整理する',
      '対偶を使って証明する',
      '矛盾を作って証明する',
    ])
  })
})
