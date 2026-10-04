import { describe, expect, it } from 'vitest'
import { mathPropositionProofUnit } from './propositionProofLesson'

describe('math proposition-proof textbook unit', () => {
  it('keeps the proof source scope in review during audit', () => {
    expect(mathPropositionProofUnit.status).toBe('review')
    expect(mathPropositionProofUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
    expect(mathPropositionProofUnit.chapter?.sourcePages).toEqual([96, 97, 98])
  })

  it('starts from reverse, inverse, and contrapositive without reteaching equivalence', () => {
    const flow = mathPropositionProofUnit.sections[0].readingFlow
    const items = mathPropositionProofUnit.sections[0].items
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

    expect(items.some((item) => item.id.startsWith('proof-e'))).toBe(false)
    expect(reverseIndex).toBeGreaterThanOrEqual(0)
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
    const divideIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-c01',
      ),
    )
    const multiplyIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'proof-c01b',
      ),
    )
    expect(assumptionIndex).toBeGreaterThanOrEqual(0)
    expect(divideIndex).toBeGreaterThan(assumptionIndex)
    expect(multiplyIndex).toBeGreaterThan(divideIndex)
  })


  it('keeps the source algebra chain for the contradiction proof', () => {
    const items = mathPropositionProofUnit.sections[0].items
    expect(items.find((item) => item.id === 'proof-c01')?.answer)
      .toBe('\\sqrt2=-\\frac{\\sqrt3y}{x}')
    expect(items.find((item) => item.id === 'proof-c01b')?.answer)
      .toBe('\\sqrt6=-\\frac{3y}{x}')
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
    expect(items.find((item) => item.id === 'proof-b01')?.answerType).toBe('text')
  })

  it('keeps the proof lesson to three learner-facing headings', () => {
    const headings = mathPropositionProofUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual([
      '命題の向きを変える',
      '証明しやすい向きを選ぶ',
      '矛盾を作って証明する',
    ])
  })
})
