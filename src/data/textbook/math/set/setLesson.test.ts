import { describe, expect, it } from 'vitest'
import { mathSetUnit } from './setLesson'
import { partitionMathSetReadingFlow, mathSetRequiredContextByItemId, requiredMathSetContext } from '../presentation'

describe('math set textbook unit', () => {
  it('keeps the first slice as one continuous math lesson', () => {
    expect(mathSetUnit.subject).toBe('math-1a')
    expect(mathSetUnit.status).toBe('published')
    expect(mathSetUnit.revision).toBe(2)
    expect(mathSetUnit.chapter?.chapterId).toBe('math-ch03-sets-propositions')
    expect(mathSetUnit.chapter?.unitCode).toBe('3SET')
    expect(mathSetUnit.sections).toHaveLength(1)
    expect(mathSetUnit.sections[0].id).toBe('lesson')
    expect(mathSetUnit.sections[0].readingFlow[0]).toMatchObject({
      type: 'heading',
      text: '第1部　集合を表す',
    })
    expect(mathSetUnit.chapter?.sourcePages).toEqual([86, 87, 88, 89, 90, 91])
  })

  it('preserves the golden Word role hierarchy and selective dialogue', () => {
    const flow = mathSetUnit.sections[0].readingFlow
    const markers = flow.filter((block) => block.type === 'marker')
    const dialogues = flow.filter((block) => block.type === 'dialogue')

    expect(markers.filter((block) => block.type === 'marker' && block.kind === 'example')).toHaveLength(7)
    expect(markers.filter((block) => block.type === 'marker' && block.kind === 'check')).toHaveLength(1)
    expect(markers.filter((block) => block.type === 'marker' && block.kind === 'summary')).toHaveLength(1)
    expect(dialogues).toHaveLength(8)
    expect(dialogues.filter((block) => block.type === 'dialogue' && block.speaker === 'hanako')).toHaveLength(3)
    expect(dialogues.filter((block) => block.type === 'dialogue' && block.speaker === 'taro')).toHaveLength(3)
    expect(dialogues.filter((block) => block.type === 'dialogue' && block.speaker === 'teacher')).toHaveLength(2)

    expect(flow.filter((block) => block.type === 'heading').map((block) => block.type === 'heading' ? block.text : '')).toEqual([
      '第1部　集合を表す',
      '第2部　集合どうしの関係を見る',
      '第3部　集合の外側まで考える',
    ])
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
        (part) => part.type === 'term' && part.text === '集合',
      ),
    )

    expect(firstQuestionIndex).toBeGreaterThanOrEqual(0)
    expect(conceptIndex).toBeGreaterThan(firstQuestionIndex)
  })

  it('uses black-bold semantic terms while keeping concept prose in the reading line', () => {
    const blocks = mathSetUnit.sections[0].readingFlow
    const terms = blocks.flatMap((block) =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'term').map((part) => part.text)
        : [],
    )

    expect(terms).toEqual(expect.arrayContaining([
      '集合',
      '要素',
      '有限集合',
      '無限集合',
      '共通部分',
      '和集合',
      '部分集合',
      '空集合',
      '全体集合',
      '補集合',
      'ド・モルガンの法則',
    ]))
    expect(blocks.filter((block) => block.type === 'note')).toHaveLength(0)
  })
})


  it('reveals set relations through a second heading and keeps answer-bearing figures after the decisions', () => {
    const section = mathSetUnit.sections[0]
    const relationHeadingIndex = section.readingFlow.findIndex(
      (block) => block.type === 'heading' && block.text === '第2部　集合どうしの関係を見る',
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
        (part) => part.type === 'term' && part.text === '部分集合',
      ),
    )
    expect(c01Index).toBeGreaterThanOrEqual(0)
    expect(c02Index).toBeGreaterThan(c01Index)
    expect(conceptIndex).toBeGreaterThan(c02Index)
  })


  it('introduces whole-set scope before complement terminology', () => {
    const section = mathSetUnit.sections[0]
    const d01Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-d01',
      ),
    )
    const universalIndex = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'term' && part.text === '全体集合',
      ),
    )
    const d02Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-d02',
      ),
    )
    const complementIndex = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'term' && part.text === '補集合',
      ),
    )
    expect(d01Index).toBeGreaterThanOrEqual(0)
    expect(universalIndex).toBeGreaterThan(d01Index)
    expect(d02Index).toBeGreaterThan(universalIndex)
    expect(complementIndex).toBeGreaterThan(d02Index)
  })

  it('keeps De Morgan formulas locked behind region comparisons', () => {
    const section = mathSetUnit.sections[0]
    const e04Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-e04',
      ),
    )
    const firstLawIndex = section.readingFlow.findIndex(
      (block) => block.type === 'formula' && block.parts.some(
        (part) => part.type === 'math' && part.latex.includes('overline{A\\cap B}'),
      ),
    )
    const conceptIndex = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'term' && part.text === 'ド・モルガンの法則',
      ),
    )
    expect(e04Index).toBeGreaterThanOrEqual(0)
    expect(firstLawIndex).toBeGreaterThan(e04Index)
    expect(conceptIndex).toBeGreaterThan(firstLawIndex)
  })


  it('repeats U, A, and B at the explicit De Morgan confirmation before element verification', () => {
    const flow = mathSetUnit.sections[0].readingFlow
    const checkIndex = flow.findIndex(
      (block) => block.type === 'marker' && block.kind === 'check' && block.text === '確認',
    )
    const dataIndex = flow.findIndex(
      (block) => block.type === 'formula' && block.id === 'formula-e-verify-sets',
    )
    const firstVerificationHole = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-e10',
      ),
    )

    expect(checkIndex).toBeGreaterThanOrEqual(0)
    expect(dataIndex).toBeGreaterThan(checkIndex)
    expect(firstVerificationHole).toBeGreaterThan(dataIndex)

    const dataBlock = flow[dataIndex]
    expect(dataBlock?.type).toBe('formula')
    if (dataBlock?.type === 'formula') {
      const latex = dataBlock.parts
        .filter((part) => part.type === 'math')
        .map((part) => part.latex)
        .join('')
      expect(latex).toContain('U=\\{1,2,\\ldots,12\\}')
      expect(latex).toContain('A=\\{2,4,6,8,10,12\\}')
      expect(latex).toContain('B=\\{3,6,9,12\\}')
    }
  })

  it('reads real-set endpoints before revealing number-line figures and complement formulas', () => {
    const section = mathSetUnit.sections[0]
    const f01Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-f01',
      ),
    )
    const f02Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-f02',
      ),
    )
    const f03Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-f03',
      ),
    )
    const firstNumberLineIndex = section.readingFlow.findIndex(
      (block) => block.type === 'figure' && block.figureId === 'number-line-a',
    )
    const f05Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-f05',
      ),
    )
    const f06Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-f06',
      ),
    )

    expect(f01Index).toBeGreaterThanOrEqual(0)
    expect(f02Index).toBeGreaterThan(f01Index)
    expect(f03Index).toBeGreaterThan(f02Index)
    expect(firstNumberLineIndex).toBeGreaterThan(f03Index)
    expect(f06Index).toBeGreaterThan(f05Index)
  })


  it('shows both De Morgan construction routes before asking whether the regions match', () => {
    const section = mathSetUnit.sections[0]
    const e03Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-e03',
      ),
    )
    const rightRouteFigureIndex = section.readingFlow.findIndex(
      (block) => block.type === 'figure' && block.figureId === 'demorgan-complements-union',
    )
    const e04Index = section.readingFlow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-e04',
      ),
    )
    expect(e03Index).toBeGreaterThanOrEqual(0)
    expect(rightRouteFigureIndex).toBeGreaterThan(e03Index)
    expect(e04Index).toBeGreaterThan(rightRouteFigureIndex)
  })


  it('keeps the source textbook interval notation on the real-line answers', () => {
    const items = mathSetUnit.sections[0].items
    expect(items.find((item) => item.id === 'set-f06')?.answer)
      .toBe('\\{x\\mid x<-1,\\ 5<x\\}')
    expect(items.find((item) => item.id === 'set-f08')?.answer)
      .toBe('\\{x\\mid x\\le -2,\\ 2\\le x\\}')
    expect(items.find((item) => item.id === 'set-f09')?.answer)
      .toBe('\\{x\\mid x\\le -2,\\ 5<x\\}')
  })


  it('keeps the approved Word order: intersection and union before subset', () => {
    const flow = mathSetUnit.sections[0].readingFlow
    const intersectionIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-b01',
      ),
    )
    const subsetIndex = flow.findIndex(
      (block) => block.type === 'paragraph' && block.parts.some(
        (part) => part.type === 'choice' && part.itemId === 'set-c01',
      ),
    )
    expect(intersectionIndex).toBeGreaterThanOrEqual(0)
    expect(subsetIndex).toBeGreaterThan(intersectionIndex)
  })

describe('math-set P-002 presentation regression (no source mutations)', () => {
  it('keeps all original blocks in order while validating every explicit cross-stage prerequisite', () => {
    const reading = mathSetUnit.sections[0].readingFlow
    const stages = partitionMathSetReadingFlow(reading)
    expect(stages).toHaveLength(15)
    expect(stages.flatMap(stage => stage.blocks.map(block => block.id))).toEqual(reading.map(block => block.id))
    const sourceStageById = new Map(stages.flatMap((stage, index) => stage.blocks.map(block => [block.id, index] as const)))
    const targetStageByItemId = new Map(stages.flatMap((stage, index) => stage.blocks.flatMap(block =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter(part => part.type === 'choice').map(part => [part.itemId, index] as const)
        : [],
    )))
    for (const [itemId, refs] of Object.entries(mathSetRequiredContextByItemId)) {
      const target = targetStageByItemId.get(itemId)
      expect(target, itemId).toBeDefined()
      expect(new Set(refs).size, itemId).toBe(refs.length)
      for (const ref of refs) expect(sourceStageById.get(ref)!, itemId + '/' + ref).toBeLessThan(target!)
    }
  })
  it('uses U and B to answer B-complement, not an unrelated A-complement', () => {
    expect(requiredMathSetContext('set-d03')).toEqual(['paragraph-universal-concept', 'formula-d-b'])
    expect(requiredMathSetContext('set-d03')).not.toContain('formula-d-abar')
    expect(requiredMathSetContext('set-d04')).toEqual(['formula-d-a', 'formula-d-b'])
    expect(requiredMathSetContext('set-d06')).toEqual(['formula-d-abar', 'formula-d-b'])
  })
  it('recovers original interval and group inputs across all risky stage boundaries', () => {
    expect(requiredMathSetContext('set-b03')).toEqual(['formula-b-sets'])
    expect(requiredMathSetContext('set-c04')).toEqual(['formula-c-sets'])
    expect(requiredMathSetContext('set-f07')).toEqual(['formula-f-sets', 'figure-f-b'])
    expect(requiredMathSetContext('set-f09')).toEqual(['formula-f-sets'])
    expect(requiredMathSetContext('set-a01')).toEqual([])
  })
})
