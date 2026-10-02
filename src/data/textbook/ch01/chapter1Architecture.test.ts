import { describe, expect, it } from 'vitest'
import {
  chapter1ChunkForUnitCode,
  chapter1LearningChunks,
  chapter1NextUnit,
  chapter1UnitSequence,
} from './chapter1Architecture'

describe('Chapter 1 learner-facing information architecture', () => {
  it('exposes exactly three short conceptual chunks over seven stable internal units', () => {
    expect(chapter1LearningChunks).toHaveLength(3)
    expect(chapter1LearningChunks.map((chunk) => chunk.title.ja)).toEqual([
      '運動を表す',
      '速度の変化',
      '力と運動',
    ])
    expect(chapter1LearningChunks.every((chunk) => chunk.title.ja.length <= 6)).toBe(true)
    expect(chapter1LearningChunks.flatMap((chunk) => chunk.unitCodes)).toEqual([
      '1A', '1B', '1C', '1D', '1E', '1F', '1G',
    ])
    expect(chapter1UnitSequence.map((unit) => unit.unitCode)).toEqual([
      '1A', '1B', '1C', '1D', '1E', '1F', '1G',
    ])
  })

  it('keeps the two major conceptual boundaries explicit', () => {
    expect(chapter1ChunkForUnitCode('1C')?.title.ja).toBe('運動を表す')
    expect(chapter1NextUnit('1C')).toMatchObject({
      unitCode: '1D',
      unitId: 'physics-1d-acceleration',
    })
    expect(chapter1NextUnit('1C')?.bridge.ja).toContain('速度そのものが時間とともに変わる')

    expect(chapter1ChunkForUnitCode('1F')?.title.ja).toBe('速度の変化')
    expect(chapter1NextUnit('1F')).toMatchObject({
      unitCode: '1G',
      unitId: 'physics-1g-gravity-drag-terminal-velocity',
    })
    expect(chapter1NextUnit('1F')?.bridge.ja).toContain('加速度を生み出す力')
  })
})
