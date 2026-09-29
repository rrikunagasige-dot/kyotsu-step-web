import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from '../data/textbookUnits'
import type { TextbookUnitProgress } from './textbook'
import { buildTextbookFormulaLatex } from './textbookFormula'

function render(latex: string) {
  return katex.renderToString(latex, {
    displayMode: true,
    throwOnError: false,
    trust: true,
  })
}

describe('textbook formula renderer', () => {
  it('renders every Chapter 1 formula with unresolved holes without KaTeX errors or HTML-extension commands', () => {
    let formulaCount = 0

    for (const unit of builtInTextbookUnits) {
      for (const section of unit.sections) {
        for (const block of section.readingFlow) {
          if (block.type !== 'formula') continue
          formulaCount += 1
          const latex = buildTextbookFormulaLatex(block.parts, section, undefined)
          const html = render(latex)
          expect(html, `${unit.unitId}/${section.id}/${block.id}: ${latex}`).not.toContain('katex-error')
          expect(latex).not.toContain('\\htmlData')
          expect(latex).not.toContain('\\htmlClass')
          expect(latex).not.toContain('\\href')
        }
      }
    }

    expect(formulaCount).toBeGreaterThan(50)
  })

  it('does not box resolved formula answers', () => {
    const unit = builtInTextbookUnits.find((candidate) => candidate.chapter?.unitCode === '1B')
    const section = unit?.sections[0]
    const block = section?.readingFlow.find((candidate) =>
      candidate.type === 'formula' &&
      candidate.parts.some((part) => part.type === 'choice' && part.itemId === 'b4'),
    )
    const item = section?.items.find((candidate) => candidate.id === 'b4')
    expect(unit).toBeTruthy()
    expect(section).toBeTruthy()
    expect(block?.type).toBe('formula')
    expect(item).toBeTruthy()

    const progress: TextbookUnitProgress = {
      unitId: unit!.unitId,
      unitRevision: unit!.revision,
      startedAt: 1,
      updatedAt: 1,
      answers: {
        b4: {
          itemId: 'b4',
          value: item!.answer,
          firstValue: item!.answer,
          isFirstCorrect: true,
          resolved: true,
          attemptCount: 1,
          firstAnsweredAt: 1,
          lastAnsweredAt: 1,
        },
      },
    }

    const latex = buildTextbookFormulaLatex(
      (block as Extract<typeof block, { type: 'formula' }>).parts,
      section!,
      progress,
    )
    expect(latex).toContain('\\sqrt{')
    expect(latex).not.toContain('\\boxed{\\sqrt')
    expect(latex).not.toContain('√')
    expect(latex).not.toContain('ᵧ')
  })

  it('parses prose-level symbols such as position vectors as inline math', () => {
    const unit = builtInTextbookUnits.find((candidate) => candidate.chapter?.unitCode === '1A')!
    const paragraphParts = unit.sections[0].readingFlow
      .filter((block) => block.type === 'paragraph')
      .flatMap((block) => block.type === 'paragraph' ? block.parts : [])
    expect(paragraphParts.some((part) => part.type === 'math' && part.latex.includes('\\vec{r}'))).toBe(true)
    expect(paragraphParts.some((part) => part.type === 'text' && part.text.includes('r⃗'))).toBe(false)
  })

  it('renders every Chapter 1 formula after all referenced holes are correctly resolved', () => {
    let formulaCount = 0

    for (const unit of builtInTextbookUnits) {
      for (const section of unit.sections) {
        const answers: TextbookUnitProgress['answers'] = Object.fromEntries(
          section.items.map((item) => [item.id, {
            itemId: item.id,
            value: item.answer,
            firstValue: item.answer,
            isFirstCorrect: true,
            resolved: true,
            attemptCount: 1,
            firstAnsweredAt: 1,
            lastAnsweredAt: 1,
          }]),
        )
        const progress: TextbookUnitProgress = {
          unitId: unit.unitId,
          unitRevision: unit.revision,
          startedAt: 1,
          updatedAt: 1,
          answers,
        }

        for (const block of section.readingFlow) {
          if (block.type !== 'formula') continue
          formulaCount += 1
          const latex = buildTextbookFormulaLatex(block.parts, section, progress)
          const html = render(latex)
          expect(html, `${unit.unitId}/${section.id}/${block.id}: ${latex}`).not.toContain('katex-error')
        }
      }
    }

    expect(formulaCount).toBeGreaterThan(50)
  })
})
