import { describe, expect, it } from 'vitest'
import { TextbookUnitSchema } from './textbookSchema'

const baseUnit = {
  schemaVersion: '1.1' as const,
  unitId: 'physics-1a-test',
  revision: 1,
  status: 'published' as const,
  subject: 'physics' as const,
  chapter: {
    chapterId: 'physics-ch01-motion',
    chapterNumber: '1',
    chapterTitle: '物体の運動',
    unitCode: '1A',
    orderInChapter: 1,
    sourcePages: [12, 13],
  },
  title: '変位と速度',
  source: { type: 'reference' as const, label: 'test source' },
  objectives: ['変位を理解する'],
  sections: [
    {
      id: 'concept',
      number: '01',
      title: '概念',
      role: 'concept' as const,
      figures: [],
      readingFlow: [
        {
          id: 'p-1',
          type: 'paragraph' as const,
          parts: [
            { type: 'text' as const, text: '位置の変化を ' },
            { type: 'choice' as const, itemId: 'a-1' },
            { type: 'text' as const, text: ' という。' },
          ],
        },
      ],
      items: [
        {
          id: 'a-1',
          label: 'A-1',
          prompt: '位置の変化を何というか。',
          answer: '変位',
          acceptedAnswers: [],
          answerType: 'text' as const,
          choices: ['変位', '位置', '速度', '加速度'],
        },
      ],
    },
  ],
}

describe('TextbookUnitSchema 1.1', () => {
  it('accepts chapter metadata, semantic roles and explicit choices', () => {
    expect(TextbookUnitSchema.parse(baseUnit).schemaVersion).toBe('1.1')
  })


  it('accepts a math textbook unit with a non-physics unit code', () => {
    const mathUnit = {
      ...baseUnit,
      unitId: 'math-sets-test',
      subject: 'math-1a' as const,
      chapter: {
        chapterId: 'math-ch03-sets-propositions',
        chapterNumber: '3',
        chapterTitle: '集合と命題',
        unitCode: '3SET',
        orderInChapter: 1,
        sourcePages: [86, 87],
      },
      title: '集合',
    }

    const parsed = TextbookUnitSchema.parse(mathUnit)
    expect(parsed.subject).toBe('math-1a')
    expect(parsed.chapter?.unitCode).toBe('3SET')
  })

  it('allows an item to be referenced only from a figure overlay', () => {
    const unit = structuredClone(baseUnit)
    unit.sections[0].readingFlow = [
      { id: 'fig-block', type: 'figure', figureId: 'fig-1' } as never,
    ]
    unit.sections[0].figures = [
      {
        id: 'fig-1',
        src: '/figure.webp',
        alt: '位置ベクトルの図',
        overlays: [
          { id: 'mask-a-1', itemId: 'a-1', mode: 'mask', x: 20, y: 20, width: 10, height: 8, reveal: 'after-answer' },
        ],
      } as never,
    ]
    expect(() => TextbookUnitSchema.parse(unit)).not.toThrow()
  })

  it('rejects a published V2 item without explicit choices', () => {
    const unit = structuredClone(baseUnit)
    delete (unit.sections[0].items[0] as { choices?: string[] }).choices
    expect(() => TextbookUnitSchema.parse(unit)).toThrow(/明示的な choices/)
  })

  it('rejects an overlay that leaves the image bounds', () => {
    const unit = structuredClone(baseUnit)
    unit.sections[0].figures = [
      {
        id: 'fig-1',
        src: '/figure.webp',
        alt: '位置ベクトルの図',
        overlays: [
          { id: 'mask-a-1', itemId: 'a-1', mode: 'mask', x: 95, y: 20, width: 10, height: 8, reveal: 'after-answer' },
        ],
      } as never,
    ]
    expect(() => TextbookUnitSchema.parse(unit)).toThrow(/右端/)
  })
})
