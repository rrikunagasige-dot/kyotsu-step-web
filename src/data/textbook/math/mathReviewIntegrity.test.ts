import { describe, expect, it } from 'vitest'
import { mathTextbookUnits } from './index'

function normalize(value: string) {
  return value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\s\u3000]/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/[⃗→]/g, '')
}

describe('math textbook review integrity', () => {
  it('keeps every explicit choice set unique and contains the answer exactly once', () => {
    for (const unit of mathTextbookUnits) {
      for (const section of unit.sections) {
        for (const item of section.items) {
          if (!item.choices?.length) continue
          const normalizedChoices = item.choices.map(normalize)
          expect(
            new Set(normalizedChoices).size,
            `${unit.unitId}/${item.id}: choices contain duplicates`,
          ).toBe(normalizedChoices.length)

          const normalizedAnswer = normalize(item.answer)
          expect(
            normalizedChoices.filter((choice) => choice === normalizedAnswer).length,
            `${unit.unitId}/${item.id}: answer must occur exactly once in choices`,
          ).toBe(1)
        }
      }
    }
  })

  it('uses each inline choice item only once in the continuous reading flow', () => {
    for (const unit of mathTextbookUnits) {
      for (const section of unit.sections) {
        const counts = new Map<string, number>()

        for (const block of section.readingFlow) {
          if (block.type !== 'paragraph' && block.type !== 'formula') continue
          for (const part of block.parts) {
            if (part.type !== 'choice') continue
            counts.set(part.itemId, (counts.get(part.itemId) ?? 0) + 1)
          }
        }

        for (const item of section.items) {
          expect(
            counts.get(item.id) ?? 0,
            `${unit.unitId}/${item.id}: inline item should appear once`,
          ).toBe(1)
        }
      }
    }
  })


  it('keeps learner-facing review copy free of practice-mode and source-problem numbering', () => {
    for (const unit of mathTextbookUnits.filter((candidate) => candidate.status === 'review')) {
      const learnerCopy = [
        unit.title,
        unit.subtitle ?? '',
        ...unit.objectives,
        ...unit.sections.flatMap((section) => [
          section.title,
          section.description ?? '',
          ...section.figures.flatMap((figure) => [figure.alt, figure.caption ?? '']),
          ...section.readingFlow.flatMap((block) => {
            if (block.type === 'heading') return [block.text]
            if (block.type === 'paragraph' || block.type === 'formula') {
              return block.parts
                .filter((part) => part.type === 'text')
                .map((part) => part.text)
            }
            return []
          }),
          ...section.items.flatMap((item) => [item.prompt, ...item.hints]),
        ]),
      ].join('\n')

      expect(
        learnerCopy,
        `${unit.unitId}: learner copy leaked practice/source numbering`,
      ).not.toMatch(/練習モード|MATH_PRACTICE|practice\s*\d|問\d/iu)
    }
  })

  it('keeps support fading from strong toward medium/light in every review unit', () => {
    for (const unit of mathTextbookUnits.filter((candidate) => candidate.status === 'review')) {
      const items = unit.sections.flatMap((section) => section.items)
      expect(items[0]?.scaffoldLevel, `${unit.unitId}: first item should be strongly scaffolded`).toBe('strong')
      expect(
        items.some((item) => item.scaffoldLevel === 'medium' || item.scaffoldLevel === 'light'),
        `${unit.unitId}: support never fades`,
      ).toBe(true)
    }
  })
})
