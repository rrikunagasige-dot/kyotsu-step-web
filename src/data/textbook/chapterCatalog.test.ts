import { describe, expect, it } from 'vitest'
import { physicsTextbookChapters, physicsTextbookParts } from './chapterCatalog'

describe('physics textbook catalog', () => {
  it('exposes the full five-part / fifteen-chapter textbook skeleton', () => {
    expect(physicsTextbookParts).toHaveLength(5)
    expect(physicsTextbookParts.map((part) => part.partTitle)).toEqual([
      '様々な運動',
      '熱',
      '波',
      '電気と磁気',
      '原子・分子の世界',
    ])
    expect(physicsTextbookChapters).toHaveLength(15)
  })

  it('keeps Chapter 1 implemented and later chapters as catalog-only placeholders', () => {
    const first = physicsTextbookChapters.find((chapter) => chapter.chapterId === 'physics-ch01-motion')
    expect(first?.chapterTitle).toBe('物体の運動')
    expect(first?.unitCodes).toEqual(['1A', '1B', '1C', '1D', '1E', '1F', '1G'])

    const later = physicsTextbookChapters.filter((chapter) => chapter.chapterId !== 'physics-ch01-motion')
    expect(later).toHaveLength(14)
    expect(later.every((chapter) => chapter.unitCodes.length === 0)).toBe(true)
  })

  it('uses unique stable IDs for every part and chapter', () => {
    expect(new Set(physicsTextbookParts.map((part) => part.partId)).size).toBe(5)
    expect(new Set(physicsTextbookChapters.map((chapter) => chapter.chapterId)).size).toBe(15)
  })
})
