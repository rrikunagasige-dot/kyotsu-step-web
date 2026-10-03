import { describe, expect, it } from 'vitest'
import { mathPropositionReadingUnit } from './propositionReadingLesson'

describe('math proposition-reading textbook unit', () => {
  it('keeps the source scope and starts in review while the new unit is audited', () => {
    expect(mathPropositionReadingUnit.subject).toBe('math-1a')
    expect(mathPropositionReadingUnit.status).toBe('review')
    expect(mathPropositionReadingUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
    expect(mathPropositionReadingUnit.chapter?.sourcePages).toEqual([92, 93, 94, 95])
    expect(mathPropositionReadingUnit.sections).toHaveLength(1)
  })

  it('forms implication meaning from a concrete condition before naming p⇒q', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const decisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a01',
      ),
    )
    const conceptIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('pならばqである'),
      ),
    )
    expect(decisionIndex).toBeGreaterThanOrEqual(0)
    expect(conceptIndex).toBeGreaterThan(decisionIndex)
  })

  it('reveals the inclusion picture only after the learner links P and Q', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const setDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a02',
      ),
    )
    const figureIndex = flow.findIndex(
      (block) => block.type === 'figure' && block.figureId === 'implication-inclusion',
    )
    expect(setDecisionIndex).toBeGreaterThanOrEqual(0)
    expect(figureIndex).toBeGreaterThan(setDecisionIndex)
  })

  it('lets a counterexample break the implication before teaching the term', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const counterexampleDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a03',
      ),
    )
    const truthDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-a04',
      ),
    )
    const conceptIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('このような例を反例という'),
      ),
    )
    expect(counterexampleDecisionIndex).toBeGreaterThanOrEqual(0)
    expect(truthDecisionIndex).toBeGreaterThan(counterexampleDecisionIndex)
    expect(conceptIndex).toBeGreaterThan(truthDecisionIndex)
  })

  it('checks both directions before attaching necessary and sufficient labels', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const forwardIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-b01',
      ),
    )
    const reverseIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-b02',
      ),
    )
    const definitionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('十分条件'),
      ),
    )
    expect(forwardIndex).toBeGreaterThanOrEqual(0)
    expect(reverseIndex).toBeGreaterThan(forwardIndex)
    expect(definitionIndex).toBeGreaterThan(reverseIndex)
  })

  it('derives negation from the outside of a condition before using De Morgan', () => {
    const flow = mathPropositionReadingUnit.sections[0].readingFlow
    const simpleNegationIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-c01',
      ),
    )
    const negationConceptIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('pの否定という'),
      ),
    )
    const compoundDecisionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'prop-c03',
      ),
    )
    const deMorganIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('ド・モルガンの法則'),
      ),
    )
    expect(simpleNegationIndex).toBeGreaterThanOrEqual(0)
    expect(negationConceptIndex).toBeGreaterThan(simpleNegationIndex)
    expect(compoundDecisionIndex).toBeGreaterThan(negationConceptIndex)
    expect(deMorganIndex).toBeGreaterThan(compoundDecisionIndex)
  })

  it('uses only three learner-facing headings', () => {
    const headings = mathPropositionReadingUnit.sections[0].readingFlow
      .filter((block) => block.type === 'heading')
      .map((block) => block.text)
    expect(headings).toEqual([
      '命題の真偽を読む',
      '必要条件・十分条件を見分ける',
      '条件を否定する',
    ])
  })
})
