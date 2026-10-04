import { describe, expect, it } from 'vitest'
import { mathPropositionProofUnit } from './propositionProofLesson'

describe('math proposition-proof textbook unit', () => {
  it('keeps the proof source scope in review during audit', () => {
    expect(mathPropositionProofUnit.status).toBe('review')
    expect(mathPropositionProofUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
    expect(mathPropositionProofUnit.chapter?.sourcePages).toEqual([94, 95, 96, 97, 98])
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



  it('checks all four truth values for the first reverse-inverse-contrapositive source example', () => {
    const items = mathPropositionProofUnit.sections[0].items
    expect(items.find((item) => item.id === 'proof-a04')?.answer).toBe('偽')
    expect(items.find((item) => item.id === 'proof-a04r')?.answer).toBe('真')
    expect(items.find((item) => item.id === 'proof-a04i')?.answer).toBe('真')
    expect(items.find((item) => item.id === 'proof-a05')?.answer).toBe('偽')
  })

  it('keeps the second source example: 12-multiple implication with reverse/inverse counterexample', () => {
    const items = mathPropositionProofUnit.sections[0].items
    expect(items.find((item) => item.id === 'proof-a06')?.answer).toBe('真')
    expect(items.find((item) => item.id === 'proof-a07')?.answer).toBe('n=6')
    expect(items.find((item) => item.id === 'proof-a08')?.answer).toBe('真')
  })

  it('chooses the contrapositive before starting the divisibility proof', () => {
    const flow = mathPropositionProofUnit.sections[0].readingFlow
    const strategyDecision = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-b00',
      ),
    )
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
    expect(strategyDecision).toBeGreaterThanOrEqual(0)
    expect(contrapositiveDecision).toBeGreaterThan(strategyDecision)
    expect(caseSplitDecision).toBeGreaterThan(contrapositiveDecision)
  })


  it('chooses the contradiction assumption before algebraic manipulation', () => {
    const flow = mathPropositionProofUnit.sections[0].readingFlow
    const assumptionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-c00',
      ),
    )
    const algebraIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-c01',
      ),
    )
    expect(assumptionIndex).toBeGreaterThanOrEqual(0)
    expect(algebraIndex).toBeGreaterThan(assumptionIndex)
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


  it('names the contradiction method only after the worked example reaches x=y=0', () => {
    const flow = mathPropositionProofUnit.sections[0].readingFlow
    const finalDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-c05',
      ),
    )
    const nameIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('背理法という'),
      ),
    )
    expect(finalDecisionIndex).toBeGreaterThanOrEqual(0)
    expect(nameIndex).toBeGreaterThan(finalDecisionIndex)
  })

  it('keeps mixed Japanese logical statements in text mode', () => {
    const items = mathPropositionProofUnit.sections[0].items
    expect(items.find((item) => item.id === 'proof-e02')?.answerType).toBe('text')
    expect(items.find((item) => item.id === 'proof-b01')?.answerType).toBe('text')
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
