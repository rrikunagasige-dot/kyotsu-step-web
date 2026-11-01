import { describe, expect, it } from 'vitest'
import { mathTextbookUnits } from './index'
import n09Compiled from './numbers/n09ConstructionCompiled.json'
import n10Compiled from './numbers/n10ConstructionCompiled.json'
const nestedFor = (id: string) => id === n09Compiled.unitId ? n09Compiled : id === n10Compiled.unitId ? n10Compiled : undefined

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
      if (unit.constructionLessonVersion) for (const node of nestedFor(unit.unitId)!.nodeDesign) for (const part of node.parts) {
        const choices = part.choices.map(c => normalize(c.value))
        expect(new Set(choices).size, part.id).toBe(choices.length)
        expect(choices.filter(c => c === normalize(part.expected)), part.id).toHaveLength(1)
      }
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

  it('uses one answer per decision, including explicitly shared operation slots', () => {
    for (const unit of mathTextbookUnits) {
      if (unit.constructionLessonVersion) for (const node of nestedFor(unit.unitId)!.nodeDesign) for (const part of node.parts) expect(node.rows.reduce((n, row) => n + row.template.split('{' + part.key + '}').length - 1, 0), part.id).toBe(1)
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
          ).toBe(unit.unitId === 'math-numbers-expressions-n08' && [5, 6, 7].includes(unit.revision)
            && ['n08-r5-q06-operation-answer', 'n08-r5-q08-operation-answer'].includes(item.id) ? 2 : 1)
          if ((counts.get(item.id) ?? 0) > 1) {
            const owners = section.readingFlow.filter(block => (block.type === 'formula' || block.type === 'paragraph') && block.parts.some(part => part.type === 'choice' && part.itemId === item.id))
            expect(owners).toHaveLength(1)
            expect(owners[0].type).toBe('formula')
          }
        }
      }
    }
  })

  it('does not print a text answer verbatim inside staged hints', () => {
    for (const unit of mathTextbookUnits.filter((candidate) => candidate.status === 'review')) {
      if (unit.constructionLessonVersion) for (const node of nestedFor(unit.unitId)!.nodeDesign) for (const part of node.parts.filter(p => p.kind === 'text')) for (const choice of part.choices.filter(c => c.value !== part.expected)) if (normalize(part.expected).length >= 2) expect(normalize(choice.feedback).includes(normalize(part.expected)), part.id).toBe(false)
      for (const section of unit.sections) {
        for (const item of section.items) {
          if (item.answerType !== 'text') continue
          const answer = normalize(item.answer)
          if (answer.length < 2) continue

          for (const hint of item.hints) {
            expect(
              normalize(hint).includes(answer),
              `${unit.unitId}/${item.id}: hint contains the answer verbatim`,
            ).toBe(false)
          }
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
        ...(unit.constructionLessonVersion ? nestedFor(unit.unitId)!.nodeDesign.flatMap(n => [...n.leadParts.filter(p => p.type === 'text').map(p => p.text ?? ''), ...n.assumptions, ...n.parts.map(p => p.prompt)]) : []),
        ...unit.sections.flatMap((section) => [
          section.title,
          section.description ?? '',
          ...section.figures.flatMap((figure) => [figure.alt, figure.caption ?? '']),
          ...section.readingFlow.flatMap((block) => {
            if (block.type === 'heading' || block.type === 'marker' || block.type === 'dialogue') return [block.text]
            if (block.type === 'paragraph' || block.type === 'formula') {
              return block.parts
                .filter((part) => part.type === 'text' || part.type === 'term')
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
      const items = unit.constructionLessonVersion ? nestedFor(unit.unitId)!.nodeDesign.filter(n => n.parts.length) : unit.sections.flatMap((section) => section.items)
      expect(items[0]?.scaffoldLevel, `${unit.unitId}: first item should be strongly scaffolded`).toBe('strong')
      expect(
        items.some((item) => item.scaffoldLevel === 'medium' || item.scaffoldLevel === 'light'),
        `${unit.unitId}: support never fades`,
      ).toBe(true)
    }
  })
})
