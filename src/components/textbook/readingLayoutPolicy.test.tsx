import { describe, expect, it } from 'vitest'
import fixedProfiles from '../../data/textbook/math/numbers/n0106ReadingLayout.json'
import { parseReadingLayoutProfiles, qf01ReadingLayoutProfile, readingLayoutBlockAttributes } from './readingLayoutPolicy'

describe('scoped reading layout policy', () => {
  it('retains the fixed Numbers collection and rejects a QF profile masquerading as part of it', () => {
    expect(parseReadingLayoutProfiles(fixedProfiles)).toHaveLength(61)
    const changed = structuredClone(fixedProfiles)
    changed[0].unitId = 'math-quadratic-qf01'
    expect(() => parseReadingLayoutProfiles(changed)).toThrow('binding')
    expect(() => parseReadingLayoutProfiles([...fixedProfiles, fixedProfiles[0]])).toThrow('collection')
  })
  it('gives QF its own role-based profile and leaves an unregistered caller unstyled', () => {
    const profile = qf01ReadingLayoutProfile('qf01-stage-7', [{ id: 'purpose', type: 'paragraph', role: 'target' }, { id: 'formula', type: 'formula', role: 'operation' }])
    expect(profile.id).toBe('qf01:r3:qf01-stage-7')
    expect(readingLayoutBlockAttributes(profile, 'purpose')['data-reading-layout-spacing']).toBe('purpose')
    expect(readingLayoutBlockAttributes(profile, 'formula')['data-reading-layout-spacing']).toBe('reason-equation')
    expect(readingLayoutBlockAttributes(undefined, 'purpose')['data-reading-layout-block']).toBeUndefined()
    expect(() => qf01ReadingLayoutProfile('heading-four-products', [])).toThrow()
  })
})
