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
  it('renders every Chapter 1 formula with unresolved holes without KaTeX errors', () => {
    let formulaCount = 0

    for (const unit of builtInTextbookUnits) {
      for (const section of unit.sections) {
        for (const block of section.readingFlow) {
          if (block.type !== 'formula') continue
          formulaCount += 1
          const latex = buildTextbookFormulaLatex(block.parts, section, undefined)
          const html = render(latex)
          expect(html, `${unit.unitId}/${section.id}/${block.id}: ${latex}`).not.toContain('katex-error')
        }
      }
    }

    expect(formulaCount).toBeGreaterThan(70)
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

    expect(formulaCount).toBeGreaterThan(70)
  })
})
