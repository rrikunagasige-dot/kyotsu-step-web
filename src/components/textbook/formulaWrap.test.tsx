import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { mathTextbookUnits } from '../../data/textbook/math'
import { answerTextbookItem } from '../../domain/textbook'
import { TextbookFormula } from './TextbookFormula'
import { auditedWrapBlocks, formulaWrapChunks } from './formulaWrap'

describe('chapter overflow mathematical boundaries', () => {
  let count = 0
  for (const [unitId, ids] of Object.entries(auditedWrapBlocks)) {
    const unit = mathTextbookUnits.find(u => u.unitId === unitId)!
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
  it('limits the new wrapping to the confirmed twenty-five blocks', () => expect(count).toBe(25))
})
