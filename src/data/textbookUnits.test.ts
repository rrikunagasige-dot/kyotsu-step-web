import { describe, expect, it } from 'vitest'
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

describe('Chapter 1 textbook v2.2 catalog', () => {
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
    }
  })

  it('preserves all 65 reviewed v2.2 holes with explicit choices', () => {
    const counts = Object.fromEntries(
      builtInTextbookUnits.map((unit) => [
        unit.chapter?.unitCode,
        unit.sections.flatMap((section) => section.items).length,
      ]),
    )
    expect(counts).toEqual(expectedCounts)
    const total = builtInTextbookUnits.reduce((sum, unit) =>
      sum + unit.sections.flatMap((section) => section.items).length, 0)
    expect(total).toBe(65)

    for (const unit of builtInTextbookUnits) {
      const items = unit.sections.flatMap((section) => section.items)
      expect(new Set(items.map((item) => item.id)).size).toBe(items.length)
      expect(items.every((item) => item.choices?.length === 4)).toBe(true)
      expect(items.every((item) => item.choices?.includes(item.answer))).toBe(true)
    }
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

  it('keeps all 17 canonical Chapter-1 figure assets', () => {
    const figures = builtInTextbookUnits.flatMap((unit) =>
      unit.sections.flatMap((section) => section.figures),
    )
    expect(figures).toHaveLength(17)
    expect(new Set(figures.map((figure) => figure.src)).size).toBe(17)
    expect(figures.every((figure) => figure.src.startsWith('/assets/physics/textbook/ch01/'))).toBe(true)
  })

  it('keeps the future Δr label on fig-1 passively masked until A3 is resolved', () => {
    const unit1A = builtInTextbookUnits.find((unit) => unit.chapter?.unitCode === '1A')
    const fig1 = unit1A?.sections[0].figures.find((figure) => figure.id === 'fig-1')
    const mask = fig1?.overlays.find((overlay) => overlay.id === 'mask-a3-delta-r')
    expect(mask?.itemId).toBe('a3')
    expect(mask?.interactive).toBe(false)
  })
})
