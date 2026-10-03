import { describe, expect, it } from 'vitest'
import { mathPropositionProofUnit } from './propositionProofLesson'

describe('math proposition-proof textbook unit', () => {
  it('keeps the proof source scope in review during audit', () => {
    expect(mathPropositionProofUnit.status).toBe('review')
    expect(mathPropositionProofUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
    expect(mathPropositionProofUnit.chapter?.sourcePages).toEqual([96, 97, 98])
  })

  it('builds reverse, inverse, and contrapositive before using truth-pair equivalence', () => {
    const flow = mathPropositionProofUnit.sections[0].readingFlow
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
    const equivalenceIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('元の命題とその対偶の真偽は一致する'),
      ),
    )
    expect(reverseIndex).toBeGreaterThanOrEqual(0)
    expect(inverseIndex).toBeGreaterThan(reverseIndex)
    expect(contrapositiveIndex).toBeGreaterThan(inverseIndex)
    expect(equivalenceIndex).toBeGreaterThan(contrapositiveIndex)
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
      '逆・裏・対偶を作る',
      '対偶を使って証明する',
      '矛盾を作って証明する',
    ])
  })
})
