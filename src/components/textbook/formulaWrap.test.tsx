import { mathNumbersN01R2Unit } from '../../data/textbook/math/numbers/n01Lesson'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { mathTextbookUnits } from '../../data/textbook/math'
import { answerTextbookItem } from '../../domain/textbook'
import { TextbookFormula } from './TextbookFormula'
import { auditedWrapBlocks, formulaWrapChunks } from './formulaWrap'

describe('chapter overflow mathematical boundaries', () => {
  let count = 0
  for (const [unitId, ids] of Object.entries(auditedWrapBlocks)) {
    // Retired tuple blocks retain their historical wrapping contract; current R3 blocks have separate coverage.
        const unit = unitId === 'math-numbers-expressions-n01' ? mathNumbersN01R2Unit : mathTextbookUnits.find(u => u.unitId === unitId)!
    for (const id of ids) {
      count++
      it(`${unitId}/${id} preserves the complete source and actual controls`, () => {
        expect(unit).toBeTruthy()
        const section = unit.sections.find(s => s.readingFlow.some(b => b.id === id))!
        const block = section.readingFlow.find(b => b.id === id)!
        if (block.type !== 'formula') throw Error(id)
        const original = block.parts.map((p, i) => p.type === 'math' ? p.latex : p.type === 'choice' ? `§${i}§` : '').join('')
        expect(formulaWrapChunks(block).join('')).toBe(original)
        let progress
        for (const part of block.parts) if (part.type === 'choice') {
          const item = section.items.find(q => q.id === part.itemId)!
          progress = answerTextbookItem(progress, unit, item, item.answer, 1)
        }
        for (const value of [undefined, progress]) {
          const html = renderToStaticMarkup(<TextbookFormula unitId={unitId} block={block} section={section} progress={value} onOpen={() => {}} />)
          expect(html).not.toContain('katex-error')
          expect(html).toContain('reading-formula-expression--chapter-wrap')
          for (const p of block.parts) if (p.type === 'choice') expect(html).toContain(`data-testid="${value ? 'resolved-' : 'textbook-item-'}${p.itemId}"`)
        }
      })
    }
  }
  it('preserves the original forty-two blocks and explicitly opts in only the two approved development units', () => {
    const existing = Object.entries(auditedWrapBlocks).filter(([id]) => !id.endsWith('-ne01') && !id.endsWith('-ne02'))
    expect(existing.flatMap(([, ids]) => ids)).toHaveLength(42)
    expect(Object.entries(auditedWrapBlocks).filter(([id]) => id.endsWith('-ne01') || id.endsWith('-ne02')).map(([id]) => id).sort())
      .toEqual(['math-numbers-expressions-ne01', 'math-numbers-expressions-ne02'])
    expect(count).toBe(84)
  })
})
