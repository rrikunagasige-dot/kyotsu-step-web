import { describe, expect, it } from 'vitest'
import source from '../../docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md?raw'
import { builtInTextbookUnits } from './textbookUnits'
import type { TextbookReadingBlock } from '../domain/textbookSchema'

const expectedCounts: Record<string, number> = {
  '1A': 13,
  '1B': 8,
  '1C': 7,
  '1D': 19,
  '1E': 6,
  '1F': 8,
  '1G': 7,
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

  it('preserves all 68 audited holes with an explicit source answer', () => {
    const counts = Object.fromEntries(
      builtInTextbookUnits.map((unit) => [
        unit.chapter?.unitCode,
        unit.sections.flatMap((section) => section.items).length,
      ]),
    )
    expect(counts).toEqual(expectedCounts)
    expect(allItems()).toHaveLength(68)

    const answerLines = [...source.slice(source.indexOf('# 解答')).matchAll(/^([A-G]\d+[a-z]?)　(.+)$/gm)]
    expect(answerLines).toHaveLength(68)

    for (const item of allItems()) {
      expect(item.choices).toHaveLength(4)
      expect(item.choices).toContain(item.answer)
      expect(item.prompt).not.toMatch(/[A-G]\d/)
    }
  })

  it('attaches pedagogy metadata to every audited interaction', () => {
    const scaffoldCounts = { strong: 0, medium: 0, light: 0 }

    for (const item of allItems()) {
      expect(item.purpose, item.id).toBeTruthy()
      expect(item.hints, item.id).toHaveLength(2)
      expect(item.hints.every((hint) => hint.trim().length > 0), item.id).toBe(true)
      scaffoldCounts[item.scaffoldLevel] += 1
    }

    expect(scaffoldCounts).toEqual({ strong: 6, medium: 27, light: 35 })

    const lateItems = builtInTextbookUnits
      .filter((unit) => ['1F', '1G'].includes(unit.chapter?.unitCode ?? ''))
      .flatMap((unit) => unit.sections[0].items)
    expect(lateItems.every((item) => item.scaffoldLevel === 'light')).toBe(true)
  })

  it('does not reintroduce mechanical end-step holes', () => {
    const ids = new Set(allItems().map((item) => item.id.toUpperCase()))
    for (const removed of [
      'A5',
      'D5', 'D6',
      'E2', 'E4', 'E5B',
      'F2', 'F3A', 'F5', 'F6B', 'F8A', 'F8',
      'G3A', 'G7', 'G8',
    ]) {
      expect(ids.has(removed), removed).toBe(false)
    }

    const byId = Object.fromEntries(allItems().map((item) => [item.id, item]))
    expect(byId.a8.answer).toBe('速度')
    expect(byId.b2.answer).toBe('(v cosθ, v sinθ)')
    expect(byId.b3.answer).toBe('v⃗₁+v⃗₂')
    expect(byId.b4.answer).toBe('(2.0,1.5)')
    expect(byId.b5.answer).toBe('√(vₓ²+vᵧ²)')
    expect(byId.b7.answer).toBe('(v cosθ, v sinθ)')
    expect(byId.b8.answer).toBe('(5√3,5)')
    expect(byId.c5.answer).toBe('自転車')
    expect(byId.c4a.answer).toBe('v⃗_{rain} − v⃗_{bicycle}')
    expect(byId.c4.answer).toBe('(−10,−10)')
    expect(byId.c4b.answer).toBe('√(vₓ²+vᵧ²)')
    expect(byId.c4c.answer).toBe('10√2')
    expect(byId.d5a.answer).toBe('v−v₀')
    expect(byId.d5b.answer).toBe('t')
    expect(byId.d5c.answer).toBe('at')
    expect(byId.d4b.answer).toBe('at')
    expect(byId.d4c.answer).toBe('v₀t+(1/2)at²')
    expect(byId.d7a.answer).toBe('(v₀+v)/2')
    expect(byId.d7.answer).toBe('v−v₀=at')
    expect(byId.d7b.answer).toBe('(v−v₀)/a')
    expect(byId.d7c.answer).toBe('v²−v₀²')
    expect(byId.d7d.answer).toBe('2ax')
    expect(byId.d9a.answer).toBe('v₀+at')
    expect(byId.d9b.answer).toBe('6.0')
    expect(byId.d9.answer).toBe('v₀t+(1/2)at²')
    expect(byId.d9c.answer).toBe('9.0')
    expect(byId.e3a.answer).toBe('v²−v₀²=2ax')
    expect(byId.e5a.answer).toBe('x=v₀t')
    expect(byId.e6.answer).toBe('鉛直方向の運動')
    expect(byId.f1.answer).toBe('(v₀cosθ, v₀sinθ)')
    expect(byId.f5a.answer).toBe('v₀sinθ·t_H − (1/2)gt_H²')
    expect(byId.f6a.answer).toBe('x=v₀cosθ·t')
    expect(byId.f7.answer).toBe('[v₀sinθ − (1/2)gT]')
    expect(byId.f9.answer).toBe('sin2θ=1')
    expect(byId.g1.answer).toBe('変わらない')
    expect(byId.g2.answer).toBe('反対')
  })

  it('keeps correct option positions balanced instead of teaching "always pick A"', () => {
    const distribution = [0, 0, 0, 0]
    for (const item of allItems()) {
      const index = item.choices?.indexOf(item.answer) ?? -1
      expect(index).toBeGreaterThanOrEqual(0)
      distribution[index] += 1
    }
    expect(distribution.reduce((sum, count) => sum + count, 0)).toBe(68)
    expect(Math.max(...distribution) - Math.min(...distribution)).toBeLessThanOrEqual(1)
  })

  it('keeps explicit multi-step derivations as one semantic group', () => {
    const expected = [
      'a-average-velocity-example',
      'b-velocity-composition-example',
      'b-velocity-decomposition-example',
      'c-rain-relative-velocity-example',
      'd-velocity-update',
      'd-displacement-area',
      'd-eliminate-time',
      'd-constant-acceleration-example',
      'e-vertical-relation',
      'e-trajectory-elimination',
      'f-vertical-motion',
      'f-highest-time',
      'f-highest-height',
      'f-trajectory-elimination',
      'f-flight-time',
      'f-range',
      'g-drag-acceleration',
      'g-terminal',
    ]

    const groups = new Map<string, TextbookReadingBlock[]>()
    for (const unit of builtInTextbookUnits) {
      for (const block of unit.sections[0].readingFlow) {
        if (!('derivationId' in block) || !block.derivationId) continue
        const group = groups.get(block.derivationId) ?? []
        group.push(block)
        groups.set(block.derivationId, group)
      }
    }

    expect([...groups.keys()].sort()).toEqual([...expected].sort())
    for (const id of expected) {
      expect(groups.get(id)?.length, id).toBeGreaterThanOrEqual(2)
    }

    expect(groups.get('d-eliminate-time')?.some((block) => block.type === 'paragraph')).toBe(true)
    const averageVelocity = groups.get('a-average-velocity-example') ?? []
    const averageVelocityHoles = averageVelocity.flatMap((block) =>
      block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    )
    expect(averageVelocityHoles).toEqual(['a9c', 'a9', 'a9d', 'a9a', 'a9b', 'a10'])

    const compositionExample = groups.get('b-velocity-composition-example') ?? []
    const compositionHoles = compositionExample.flatMap((block) =>
      block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    )
    expect(compositionHoles).toEqual(['b3', 'b4', 'b5', 'b6'])

    const decompositionExample = groups.get('b-velocity-decomposition-example') ?? []
    const decompositionHoles = decompositionExample.flatMap((block) =>
      block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    )
    expect(decompositionHoles).toEqual(['b7', 'b8'])

    const relativeRainExample = groups.get('c-rain-relative-velocity-example') ?? []
    const relativeRainHoles = relativeRainExample.flatMap((block) =>
      block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    )
    expect(relativeRainHoles).toEqual(['c4a', 'c4', 'c4b', 'c4c'])

    const velocityUpdate = groups.get('d-velocity-update') ?? []
    const velocityUpdateHoles = velocityUpdate.flatMap((block) =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    )
    expect(velocityUpdateHoles).toEqual(['d5a', 'd5b', 'd5c'])

    const displacementArea = groups.get('d-displacement-area') ?? []
    const displacementAreaHoles = displacementArea.flatMap((block) =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    )
    expect(displacementAreaHoles).toEqual(['d4b', 'd4c'])

    const eliminateTime = groups.get('d-eliminate-time') ?? []
    const eliminateTimeHoles = eliminateTime.flatMap((block) =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    )
    expect(eliminateTimeHoles).toEqual(['d7a', 'd7', 'd7b', 'd7c', 'd7d'])

    const constantAccelerationExample = groups.get('d-constant-acceleration-example') ?? []
    const exampleHoles = constantAccelerationExample.flatMap((block) =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    )
    expect(exampleHoles).toEqual(['d9a', 'd9b', 'd9', 'd9c'])

    expect(groups.get('f-flight-time')?.some((block) => block.type === 'paragraph')).toBe(true)
  })

  it('does not repeat an identical completed formula immediately', () => {
    for (const unit of builtInTextbookUnits) {
      const formulas = unit.sections[0].readingFlow
        .filter((block) => block.type === 'formula')
        .map((block) => block.type === 'formula'
          ? block.parts.map((part) =>
              part.type === 'math' ? part.latex :
              part.type === 'text' ? part.text :
              `[${part.itemId}]`
            ).join('')
          : '')
      for (let index = 1; index < formulas.length; index += 1) {
        expect(formulas[index], `${unit.unitId}: duplicate formula`).not.toBe(formulas[index - 1])
      }
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

  it('keeps all 17 canonical Chapter 1 figures plus the one approved 1D educational graph', () => {
    const figures = builtInTextbookUnits.flatMap((unit) =>
      unit.sections.flatMap((section) => section.figures),
    )
    expect(figures).toHaveLength(18)
    expect(new Set(figures.map((figure) => figure.src)).size).toBe(18)

    const canonical = figures
      .filter((figure) => /^fig-\d+$/.test(figure.id))
      .map((figure) => figure.id)
      .sort((a, b) => Number(a.replace('fig-', '')) - Number(b.replace('fig-', '')))
    expect(canonical).toEqual(Array.from({ length: 17 }, (_, index) => `fig-${index + 1}`))

    const educational = figures.find((figure) => figure.id === 'edu-1d-vt-area')
    expect(educational?.src).toBe('/assets/physics/textbook/ch01/1d/vt-area-derivation.svg')
  })

  it('shows the canonical figure before prose or questions that explicitly depend on it', () => {
    const unit1A = builtInTextbookUnits.find((unit) => unit.chapter?.unitCode === '1A')!
    const flowA = unit1A.sections[0].readingFlow
    const fig1 = flowA.findIndex((block) => block.type === 'figure' && block.figureId === 'fig-1')
    const a1 = flowA.findIndex((block) =>
      (block.type === 'paragraph' || block.type === 'formula') &&
      block.parts.some((part) => part.type === 'choice' && part.itemId === 'a1'),
    )
    expect(fig1).toBeLessThan(a1)

    const fig2 = flowA.findIndex((block) => block.type === 'figure' && block.figureId === 'fig-2')
    const a7 = flowA.findIndex((block) =>
      (block.type === 'paragraph' || block.type === 'formula') &&
      block.parts.some((part) => part.type === 'choice' && part.itemId === 'a7'),
    )
    expect(fig2).toBeLessThan(a7)

    const unit1B = builtInTextbookUnits.find((unit) => unit.chapter?.unitCode === '1B')!
    const flowB = unit1B.sections[0].readingFlow
    const fig6 = flowB.findIndex((block) => block.type === 'figure' && block.figureId === 'fig-6')
    const b2 = flowB.findIndex((block) =>
      (block.type === 'paragraph' || block.type === 'formula') &&
      block.parts.some((part) => part.type === 'choice' && part.itemId === 'b2'),
    )
    expect(fig6).toBeLessThan(b2)
  })

  it('uses the explicitly approved 1D educational v-t graph without replacing canonical figures', () => {
    const unit1D = builtInTextbookUnits.find((unit) => unit.chapter?.unitCode === '1D')!
    const section = unit1D.sections[0]
    const educational = section.figures.find((figure) => figure.id === 'edu-1d-vt-area')
    expect(educational?.src).toBe('/assets/physics/textbook/ch01/1d/vt-area-derivation.svg')
    expect(section.figures.some((figure) => figure.id === 'fig-9')).toBe(true)
    expect(section.figures.some((figure) => figure.id === 'fig-10')).toBe(true)
    expect(section.items.some((item) => item.id === 'd3')).toBe(true)
    expect(section.items.some((item) => item.id === 'd4')).toBe(true)
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
    for (const id of ['d5a', 'd5b', 'd5c', 'd4b', 'd4c', 'd7a', 'd7', 'd7b', 'd7c', 'd7d', 'd9a', 'd9', 'e3a', 'e5a', 'f1', 'f5a', 'f6a', 'f7', 'g3', 'g6a']) {
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
