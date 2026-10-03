import { describe, expect, it } from 'vitest'
import { mathSetUnit } from './setLesson'

describe('math set textbook unit', () => {
  it('keeps the first slice as one continuous math lesson', () => {
    expect(mathSetUnit.subject).toBe('math-1a')
    expect(mathSetUnit.status).toBe('review')
    expect(mathSetUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
    expect(mathSetUnit.chapter?.unitCode).toBe('3SET')
    expect(mathSetUnit.sections).toHaveLength(1)
    expect(mathSetUnit.sections[0].id).toBe('lesson')
    expect(mathSetUnit.sections[0].readingFlow[0]).toMatchObject({
      type: 'heading',
      text: '集合を表す',
    })
  })

  it('starts from a concrete set-building decision before teaching the term', () => {
    const section = mathSetUnit.sections[0]
    const firstItem = section.items.find((item) => item.id === 'set-a01')
    expect(firstItem?.answer).toBe('1, 2, 3, 4, 6, 8, 12, 24')
    expect(firstItem?.purpose).toBe('concept-formation')

    const firstQuestionIndex = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-a01',
      ),
    )
    const conceptIndex = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('ひとまとまりとして考えたものを集合という'),
      ),
    )

    expect(firstQuestionIndex).toBeGreaterThanOrEqual(0)
    expect(conceptIndex).toBeGreaterThan(firstQuestionIndex)
  })

  it('keeps concept prose as ordinary reading blocks instead of note callouts', () => {
    const blocks = mathSetUnit.sections[0].readingFlow
    const conceptBlocks = blocks.filter(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && /(集合という|要素という|有限集合|無限集合)/.test(part.text),
      ),
    )
    expect(conceptBlocks.length).toBeGreaterThan(0)
    expect(blocks.filter((block) => block.type === 'note')).toHaveLength(0)
  })
})
