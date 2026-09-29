import { describe, expect, it } from 'vitest'
import source from '../../docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md?raw'
import { builtInTextbookUnits } from './textbookUnits'

const expectedCounts: Record<string, number> = {
  '1A': 10,
  '1B': 6,
  '1C': 4,
  '1D': 12,
  '1E': 9,
  '1F': 14,
  '1G': 10,
}

function allItems() {
  return builtInTextbookUnits.flatMap((unit) => unit.sections.flatMap((section) => section.items))
}

describe('Chapter 1 continuous textbook catalog', () => {
  it('loads seven continuous units in chapter order', () => {
    expect(builtInTextbookUnits).toHaveLength(7)
    expect(builtInTextbookUnits.map((unit) => unit.chapter?.unitCode)).toEqual([
      '1A', '1B', '1C', '1D', '1E', '1F', '1G',
    ])
    for (const unit of builtInTextbookUnits) {
      expect(unit.schemaVersion).toBe('1.1')
      expect(unit.status).toBe('published')
      expect(unit.sections).toHaveLength(1)
      expect(unit.sections[0].id).toBe('lesson')
      expect(unit.sections[0].readingFlow.length).toBeGreaterThan(0)
      expect(unit.subtitle).not.toMatch(/v\d/i)
    }
  })

  it('preserves all 65 audited holes with an explicit source answer', () => {
    const counts = Object.fromEntries(
      builtInTextbookUnits.map((unit) => [
        unit.chapter?.unitCode,
        unit.sections.flatMap((section) => section.items).length,
      ]),
    )
    expect(counts).toEqual(expectedCounts)
    expect(allItems()).toHaveLength(65)

    const answerLines = [...source.slice(source.indexOf('# 解答')).matchAll(/^([A-G]\d+[a-z]?)　(.+)$/gm)]
    expect(answerLines).toHaveLength(65)

    for (const item of allItems()) {
      expect(item.choices).toHaveLength(4)
      expect(item.choices).toContain(item.answer)
      expect(item.prompt).not.toMatch(/[A-G]\d/)
    }
  })

  it('keeps correct option positions balanced instead of teaching "always pick A"', () => {
    const distribution = [0, 0, 0, 0]
    for (const item of allItems()) {
      const index = item.choices?.indexOf(item.answer) ?? -1
      expect(index).toBeGreaterThanOrEqual(0)
      distribution[index] += 1
    }
    expect(distribution.reduce((sum, count) => sum + count, 0)).toBe(65)
    expect(Math.max(...distribution) - Math.min(...distribution)).toBeLessThanOrEqual(1)
  })

  it('references every hole from the continuous reading flow', () => {
    for (const unit of builtInTextbookUnits) {
      const section = unit.sections[0]
      const references = section.readingFlow.flatMap((block) =>
        block.type === 'paragraph' || block.type === 'formula'
          ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
          : [],
      )
      expect(new Set(references)).toEqual(new Set(section.items.map((item) => item.id)))
    }
  })

  it('uses 17 canonical figures plus four non-leaking learning guides/graphs', () => {
    const figures = builtInTextbookUnits.flatMap((unit) =>
      unit.sections.flatMap((section) => section.figures),
    )
    expect(figures).toHaveLength(21)
    expect(new Set(figures.map((figure) => figure.src)).size).toBe(21)

    const ids = new Set(figures.map((figure) => figure.id))
    expect(ids).toContain('fig-1-guide')
    expect(ids).toContain('fig-2-guide')
    expect(ids).toContain('fig-6-guide')
    expect(ids).toContain('fig-d-vt')
  })

  it('shows concept-forming guides before their dependent questions', () => {
    const unit1A = builtInTextbookUnits.find((unit) => unit.chapter?.unitCode === '1A')!
    const flowA = unit1A.sections[0].readingFlow
    expect(flowA.findIndex((block) => block.type === 'figure' && block.figureId === 'fig-1-guide'))
      .toBeLessThan(flowA.findIndex((block) =>
        (block.type === 'paragraph' || block.type === 'formula') &&
        block.parts.some((part) => part.type === 'choice' && part.itemId === 'a1'),
      ))

    const unit1B = builtInTextbookUnits.find((unit) => unit.chapter?.unitCode === '1B')!
    const flowB = unit1B.sections[0].readingFlow
    const guide = flowB.findIndex((block) => block.type === 'figure' && block.figureId === 'fig-6-guide')
    for (const id of ['b2', 'b3']) {
      const question = flowB.findIndex((block) =>
        (block.type === 'paragraph' || block.type === 'formula') &&
        block.parts.some((part) => part.type === 'choice' && part.itemId === id),
      )
      expect(guide).toBeLessThan(question)
    }
  })

  it('restores the v-t graph required by the acceleration derivation', () => {
    const unit1D = builtInTextbookUnits.find((unit) => unit.chapter?.unitCode === '1D')!
    expect(unit1D.sections[0].figures.some((figure) => figure.id === 'fig-d-vt')).toBe(true)
  })

  it('includes the chapter-level summary at the end of 1G', () => {
    const unit1G = builtInTextbookUnits.find((unit) => unit.chapter?.unitCode === '1G')!
    const prose = unit1G.sections[0].readingFlow.flatMap((block) =>
      block.type === 'paragraph'
        ? block.parts.filter((part) => part.type === 'text').map((part) => part.text)
        : block.type === 'heading'
          ? [block.text]
          : [],
    ).join(' ')
    expect(prose).toContain('第1章全体を一つの流れとして見る')
    expect(prose).toContain('位置')
    expect(prose).toContain('加速度')
  })

  it('classifies symbolic monomials as formula answers', () => {
    const byId = Object.fromEntries(allItems().map((item) => [item.id, item]))
    for (const id of ['d5', 'd6', 'd7c', 'e3a', 'g2', 'g6a']) {
      expect(byId[id].answerType, id).toBe('formula')
    }
  })

  it('does not leak internal unit codes into student prose', () => {
    const body = source.slice(source.indexOf('# 1A　'), source.indexOf('# 解答'))
    const studentLines = body.split('\n').filter((line) => !line.startsWith('# 1'))
    expect(studentLines.join('\n')).not.toMatch(/\b1[A-G](?:では|で|の)/)
  })

  it('has no passive question-mark masks in the audited continuous lesson', () => {
    const overlays = builtInTextbookUnits.flatMap((unit) =>
      unit.sections.flatMap((section) => section.figures.flatMap((figure) => figure.overlays)),
    )
    expect(overlays).toHaveLength(0)
  })
})
