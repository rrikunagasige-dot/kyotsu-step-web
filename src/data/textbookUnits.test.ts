import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from './textbookUnits'

describe('textbook unit catalog', () => {
  it('imports 1A displacement and velocity as the chapter-1 golden unit', () => {
    expect(builtInTextbookUnits).toHaveLength(7)
    const unit = builtInTextbookUnits[0]
    expect(unit.unitId).toBe('physics-a-displacement-velocity')
    expect(unit.schemaVersion).toBe('1.1')
    expect(unit.revision).toBe(3)
    expect(unit.subject).toBe('physics')
    expect(unit.chapter).toEqual({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1A',
      orderInChapter: 1,
      sourcePages: [12, 13],
    })
    expect(unit.sections.map((section) => [section.id, section.role])).toEqual([
      ['knowledge-check', 'concept'],
      ['figure-reading', 'figure-reading'],
      ['example-q1', 'worked-example'],
      ['example-q2', 'worked-example'],
      ['final-review', 'review'],
    ])
  })

  it('keeps all 78 source blanks with stable ids and curated choices', () => {
    const unit = builtInTextbookUnits[0]
    const items = unit.sections.flatMap((section) => section.items)
    expect(items).toHaveLength(78)
    expect(new Set(items.map((item) => item.id)).size).toBe(78)
    expect(items[0].label).toBe('A-1')
    expect(items.at(-1)?.label).toBe('F-8')
    expect(items.every((item) => item.choices && item.choices.length >= 3)).toBe(true)
    expect(items.every((item) => item.choices?.includes(item.answer))).toBe(true)
  })

  it('maps every textbook blank into reading flow or a figure overlay', () => {
    const unit = builtInTextbookUnits[0]
    for (const section of unit.sections) {
      expect(section.readingFlow.length).toBeGreaterThan(0)
      const readingReferences = section.readingFlow.flatMap((block) =>
        block.type === 'paragraph' || block.type === 'formula'
          ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
          : [],
      )
      const overlayReferences = section.figures.flatMap((figure) => figure.overlays.map((overlay) => overlay.itemId))
      expect(new Set([...readingReferences, ...overlayReferences])).toEqual(new Set(section.items.map((item) => item.id)))
    }
  })

  it('uses all four chapter-1 source figures and masks answer-bearing labels', () => {
    const figures = builtInTextbookUnits[0].sections.flatMap((section) => section.figures)
    expect(figures).toHaveLength(4)
    expect(figures.every((figure) => figure.src.startsWith('/assets/physics/textbook/ch01/1a/'))).toBe(true)

    const overlays = figures.flatMap((figure) => figure.overlays)
    expect(overlays.map((overlay) => overlay.itemId)).toEqual(expect.arrayContaining([
      'd-11', 'd-16', 'd-17', 'd-18', 'd-19', 'q1-4', 'q1-5', 'q1-7',
    ]))
    expect(overlays.every((overlay) => overlay.x + overlay.width <= 100)).toBe(true)
    expect(overlays.every((overlay) => overlay.y + overlay.height <= 100)).toBe(true)
  })

  it('imports 1B velocity composition with curated source figures and choices', () => {
    const unit = builtInTextbookUnits.find((candidate) => candidate.chapter?.unitCode === '1B')
    expect(unit).toBeDefined()
    expect(unit?.unitId).toBe('physics-1b-velocity-composition')
    expect(unit?.schemaVersion).toBe('1.1')
    expect(unit?.chapter).toEqual({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1B',
      orderInChapter: 2,
      sourcePages: [14, 15],
    })
    expect(unit?.sections.map((section) => [section.id, section.role])).toEqual([
      ['knowledge-check', 'concept'],
      ['figure-reading', 'figure-reading'],
      ['example-q1', 'worked-example'],
      ['example-q2', 'worked-example'],
      ['final-review', 'review'],
    ])

    const items = unit?.sections.flatMap((section) => section.items) ?? []
    expect(items).toHaveLength(18)
    expect(items.every((item) => item.choices && item.choices.length >= 4)).toBe(true)
    expect(items.every((item) => item.choices?.includes(item.answer))).toBe(true)

    const figures = unit?.sections.flatMap((section) => section.figures) ?? []
    expect(figures.map((figure) => figure.src)).toEqual(expect.arrayContaining([
      '/assets/physics/textbook/ch01/1b/velocity-composition.webp',
      '/assets/physics/textbook/ch01/1b/velocity-components.webp',
    ]))
    expect(figures.flatMap((figure) => figure.overlays).map((overlay) => overlay.itemId)).toContain('d-1')
  })

  it('imports 1C relative velocity with source figures and explicit choices', () => {
    const unit = builtInTextbookUnits.find((candidate) => candidate.chapter?.unitCode === '1C')
    expect(unit).toBeDefined()
    expect(unit?.unitId).toBe('physics-1c-relative-velocity')
    expect(unit?.schemaVersion).toBe('1.1')
    expect(unit?.chapter).toEqual({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1C',
      orderInChapter: 3,
      sourcePages: [16, 17],
    })
    expect(unit?.sections.map((section) => [section.id, section.role])).toEqual([
      ['knowledge-check', 'concept'],
      ['figure-reading', 'figure-reading'],
      ['example-q1', 'worked-example'],
      ['example-q2', 'worked-example'],
      ['final-review', 'review'],
    ])

    const items = unit?.sections.flatMap((section) => section.items) ?? []
    expect(items).toHaveLength(17)
    expect(new Set(items.map((item) => item.id)).size).toBe(17)
    expect(items.every((item) => item.choices && item.choices.length >= 4)).toBe(true)
    expect(items.every((item) => item.choices?.includes(item.answer))).toBe(true)

    const figures = unit?.sections.flatMap((section) => section.figures) ?? []
    expect(figures.map((figure) => figure.src)).toEqual(expect.arrayContaining([
      '/assets/physics/textbook/ch01/1c/relative-velocity-cars.webp',
      '/assets/physics/textbook/ch01/1c/relative-rain-bicycle.webp',
    ]))
    expect(figures.flatMap((figure) => figure.overlays).map((overlay) => overlay.itemId)).toContain('d-2')
  })


  it('imports 1D acceleration with source figures and Figure V2 overlays', () => {
    const unit = builtInTextbookUnits.find((candidate) => candidate.chapter?.unitCode === '1D')
    expect(unit).toBeDefined()
    expect(unit?.unitId).toBe('physics-1d-acceleration')
    expect(unit?.schemaVersion).toBe('1.1')
    expect(unit?.chapter).toEqual({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1D',
      orderInChapter: 4,
      sourcePages: [18, 19],
    })
    expect(unit?.sections.map((section) => [section.id, section.role])).toEqual([
      ['knowledge-check', 'concept'],
      ['figure-reading', 'figure-reading'],
      ['example-q1', 'worked-example'],
      ['example-q2', 'worked-example'],
      ['final-review', 'review'],
    ])

    const items = unit?.sections.flatMap((section) => section.items) ?? []
    expect(items).toHaveLength(17)
    expect(new Set(items.map((item) => item.id)).size).toBe(17)
    expect(items.every((item) => item.choices && item.choices.length >= 4)).toBe(true)
    expect(items.every((item) => item.choices?.includes(item.answer))).toBe(true)

    const figures = unit?.sections.flatMap((section) => section.figures) ?? []
    expect(figures.map((figure) => figure.src)).toEqual(expect.arrayContaining([
      '/assets/physics/textbook/ch01/1d/acceleration-trajectory.webp',
      '/assets/physics/textbook/ch01/1d/velocity-change-acceleration.webp',
    ]))
    expect(figures.flatMap((figure) => figure.overlays).map((overlay) => overlay.itemId)).toEqual(
      expect.arrayContaining(['d-1', 'd-2']),
    )
  })



  it('imports 1E horizontal projectile with source figures and explicit choices', () => {
    const unit = builtInTextbookUnits.find((candidate) => candidate.chapter?.unitCode === '1E')
    expect(unit).toBeDefined()
    expect(unit?.unitId).toBe('physics-1e-horizontal-projectile')
    expect(unit?.schemaVersion).toBe('1.1')
    expect(unit?.chapter).toEqual({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1E',
      orderInChapter: 5,
      sourcePages: [20, 21],
    })
    expect(unit?.sections.map((section) => [section.id, section.role])).toEqual([
      ['knowledge-check', 'concept'],
      ['figure-reading', 'figure-reading'],
      ['example-q1', 'worked-example'],
      ['example-q2', 'worked-example'],
      ['final-review', 'review'],
    ])

    const items = unit?.sections.flatMap((section) => section.items) ?? []
    expect(items).toHaveLength(16)
    expect(new Set(items.map((item) => item.id)).size).toBe(16)
    expect(items.every((item) => item.choices && item.choices.length >= 4)).toBe(true)
    expect(items.every((item) => item.choices?.includes(item.answer))).toBe(true)

    const figures = unit?.sections.flatMap((section) => section.figures) ?? []
    expect(figures.map((figure) => figure.src)).toEqual(expect.arrayContaining([
      '/assets/physics/textbook/ch01/1e/horizontal-projectile-strobe.webp',
      '/assets/physics/textbook/ch01/1e/horizontal-projectile-velocity.webp',
    ]))
    expect(figures.flatMap((figure) => figure.overlays).map((overlay) => overlay.itemId)).toEqual(
      expect.arrayContaining(['d-1', 'd-2']),
    )
  })


  it('imports 1F oblique projectile with source figures and explicit choices', () => {
    const unit = builtInTextbookUnits.find((candidate) => candidate.chapter?.unitCode === '1F')
    expect(unit).toBeDefined()
    expect(unit?.unitId).toBe('physics-1f-oblique-projectile')
    expect(unit?.schemaVersion).toBe('1.1')
    expect(unit?.chapter).toEqual({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1F',
      orderInChapter: 6,
      sourcePages: [22, 23, 24],
    })

    const items = unit?.sections.flatMap((section) => section.items) ?? []
    expect(items).toHaveLength(19)
    expect(new Set(items.map((item) => item.id)).size).toBe(19)
    expect(items.every((item) => item.choices && item.choices.length >= 4)).toBe(true)
    expect(items.every((item) => item.choices?.includes(item.answer))).toBe(true)

    const figures = unit?.sections.flatMap((section) => section.figures) ?? []
    expect(figures.map((figure) => figure.src)).toEqual(expect.arrayContaining([
      '/assets/physics/textbook/ch01/1f/oblique-projectile-trajectory.webp',
      '/assets/physics/textbook/ch01/1f/oblique-projectile-components.webp',
    ]))
    expect(figures.flatMap((figure) => figure.overlays).map((overlay) => overlay.itemId)).toContain('d-1')
  })


  it('imports 1G gravity, drag and terminal velocity with source figures and explicit choices', () => {
    const unit = builtInTextbookUnits.find((candidate) => candidate.chapter?.unitCode === '1G')
    expect(unit).toBeDefined()
    expect(unit?.unitId).toBe('physics-1g-gravity-drag-terminal-velocity')
    expect(unit?.schemaVersion).toBe('1.1')
    expect(unit?.chapter).toEqual({
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1G',
      orderInChapter: 7,
      sourcePages: [25, 26, 27],
    })

    const items = unit?.sections.flatMap((section) => section.items) ?? []
    expect(items).toHaveLength(14)
    expect(new Set(items.map((item) => item.id)).size).toBe(14)
    expect(items.every((item) => item.choices && item.choices.length >= 4)).toBe(true)
    expect(items.every((item) => item.choices?.includes(item.answer))).toBe(true)

    const figures = unit?.sections.flatMap((section) => section.figures) ?? []
    expect(figures.map((figure) => figure.src)).toEqual(expect.arrayContaining([
      '/assets/physics/textbook/ch01/1g/gravity-vs-air-resistance.webp',
      '/assets/physics/textbook/ch01/1g/drag-force-stages.webp',
      '/assets/physics/textbook/ch01/1g/terminal-velocity-graph.webp',
    ]))
  })



  it('passes the Chapter 1 static gate for order, all 17 figures and stable IDs', () => {
    const chapterUnits = builtInTextbookUnits
      .filter((unit) => unit.chapter?.chapterId === 'physics-ch01-motion')
      .sort((left, right) => (left.chapter?.orderInChapter ?? 0) - (right.chapter?.orderInChapter ?? 0))

    expect(chapterUnits.map((unit) => unit.chapter?.unitCode)).toEqual([
      '1A', '1B', '1C', '1D', '1E', '1F', '1G',
    ])

    const unitIds = chapterUnits.map((unit) => unit.unitId)
    expect(new Set(unitIds).size).toBe(7)

    const figures = chapterUnits.flatMap((unit) =>
      unit.sections.flatMap((section) => section.figures),
    )
    const sourceFigureAssets = [...new Set(figures.map((figure) => figure.src))].sort()
    expect(sourceFigureAssets).toEqual([
      '/assets/physics/textbook/ch01/1a/average-instantaneous-velocity.webp',
      '/assets/physics/textbook/ch01/1a/curve-velocity-directions.webp',
      '/assets/physics/textbook/ch01/1a/displacement-components.webp',
      '/assets/physics/textbook/ch01/1a/position-vector-displacement.webp',
      '/assets/physics/textbook/ch01/1b/velocity-components.webp',
      '/assets/physics/textbook/ch01/1b/velocity-composition.webp',
      '/assets/physics/textbook/ch01/1c/relative-rain-bicycle.webp',
      '/assets/physics/textbook/ch01/1c/relative-velocity-cars.webp',
      '/assets/physics/textbook/ch01/1d/acceleration-trajectory.webp',
      '/assets/physics/textbook/ch01/1d/velocity-change-acceleration.webp',
      '/assets/physics/textbook/ch01/1e/horizontal-projectile-strobe.webp',
      '/assets/physics/textbook/ch01/1e/horizontal-projectile-velocity.webp',
      '/assets/physics/textbook/ch01/1f/oblique-projectile-components.webp',
      '/assets/physics/textbook/ch01/1f/oblique-projectile-trajectory.webp',
      '/assets/physics/textbook/ch01/1g/drag-force-stages.webp',
      '/assets/physics/textbook/ch01/1g/gravity-vs-air-resistance.webp',
      '/assets/physics/textbook/ch01/1g/terminal-velocity-graph.webp',
    ])

    const compositeItemIds: string[] = []
    for (const unit of chapterUnits) {
      const itemIds = unit.sections.flatMap((section) => section.items.map((item) => item.id))
      expect(new Set(itemIds).size).toBe(itemIds.length)
      compositeItemIds.push(...itemIds.map((itemId) => `${unit.unitId}:${itemId}`))
    }
    expect(new Set(compositeItemIds).size).toBe(compositeItemIds.length)
  })


})
