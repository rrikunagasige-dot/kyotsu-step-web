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
    expect(mathSetUnit.chapter?.sourcePages).toEqual([86, 87, 88])
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


  it('reveals set relations through a second heading and keeps answer-bearing figures after the decisions', () => {
    const section = mathSetUnit.sections[0]
    const relationHeadingIndex = section.readingFlow.findIndex(
      (block) => block.type === 'heading' && block.text === '集合どうしの関係を見る',
    )
    const blankFigureIndex = section.readingFlow.findIndex(
      (block) => block.type === 'figure' && block.figureId === 'venn-two-blank',
    )
    const b01Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-b01',
      ),
    )
    const intersectionFigureIndex = section.readingFlow.findIndex(
      (block) => block.type === 'figure' && block.figureId === 'venn-intersection',
    )

    expect(relationHeadingIndex).toBeGreaterThanOrEqual(0)
    expect(blankFigureIndex).toBeGreaterThan(relationHeadingIndex)
    expect(b01Index).toBeGreaterThan(blankFigureIndex)
    expect(intersectionFigureIndex).toBeGreaterThan(b01Index)
  })

  it('introduces subset terminology only after comparing B and C against A', () => {
    const section = mathSetUnit.sections[0]
    const c01Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-c01',
      ),
    )
    const c02Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-c02',
      ),
    )
    const conceptIndex = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'text' && part.text.includes('部分集合という'),
      ),
    )
    expect(c01Index).toBeGreaterThanOrEqual(0)
    expect(c02Index).toBeGreaterThan(c01Index)
    expect(conceptIndex).toBeGreaterThan(c02Index)
  })
