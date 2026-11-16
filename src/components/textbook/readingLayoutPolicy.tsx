export type ReadingSpacingRole = 'ordinary' | 'purpose' | 'reason-equation'
export type ReadingLayoutProfile = { id: string; spacingByBlock: Readonly<Record<string, ReadingSpacingRole>> }
export type BoundReadingLayoutProfile = ReadingLayoutProfile & { unitId: string; revision: number; stageId: string }
function readingLayoutRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
export function parseReadingLayoutProfiles(input: unknown): readonly BoundReadingLayoutProfile[] {
  if (!Array.isArray(input) || input.length !== 61) throw Error('Invalid reading-layout profile collection')
  const revisions: Readonly<Record<string, number>> = {
    'math-numbers-expressions-n01': 7, 'math-numbers-expressions-n02': 6,
    'math-numbers-expressions-n03': 7, 'math-numbers-expressions-n04': 7,
    'math-numbers-expressions-n05': 7, 'math-numbers-expressions-n06': 8,
  }
  const seen = new Set<string>()
  return input.map((entry: unknown): BoundReadingLayoutProfile => {
    if (!readingLayoutRecord(entry)) throw Error('Invalid reading-layout profile')
    const { unitId, revision, stageId, id, spacingByBlock } = entry
    if (typeof unitId !== 'string' || !Object.hasOwn(revisions, unitId) || revision !== revisions[unitId]
      || typeof revision !== 'number' || !Number.isInteger(revision)
      || typeof stageId !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(stageId)
      || typeof id !== 'string' || id !== `${unitId.replace('math-numbers-expressions-', '')}:r${revision}:${stageId}`
      || (unitId === 'math-numbers-expressions-n04' && stageId === 'heading-four-products')
      || !readingLayoutRecord(spacingByBlock) || !Object.hasOwn(spacingByBlock, stageId)
      || seen.has(id)) throw Error('Invalid reading-layout binding: ' + String(id))
    seen.add(id)
    const spacing: Record<string, ReadingSpacingRole> = {}
    for (const [blockId, role] of Object.entries(spacingByBlock)) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(blockId)) throw Error('Invalid reading-layout block ID')
      if (role !== 'ordinary' && role !== 'purpose' && role !== 'reason-equation') throw Error('Invalid reading-layout spacing role: ' + blockId)
      spacing[blockId] = role
    }
    return { unitId, revision, stageId, id, spacingByBlock: spacing }
  })
}

export function readingLayoutBlockAttributes(profile: ReadingLayoutProfile | undefined, blockId: string, start = false) {
  return { 'data-reading-layout-block': profile ? blockId : undefined,
    'data-reading-layout-spacing': profile?.spacingByBlock[blockId],
    ...(start ? { 'data-reading-layout-start-spacing': profile?.spacingByBlock[blockId] } : {}),
  }
}
export function readingLayoutChainAttributes(profile: ReadingLayoutProfile | undefined, firstBlockId: string) {
  return { 'data-reading-layout-chain': profile ? true : undefined, 'data-reading-layout-start-spacing': profile?.spacingByBlock[firstBlockId] }
}
/** QF has its own profile namespace. The existing Numbers collection is never extended by alias. */
export function qf01ReadingLayoutProfile(stageId: string, blocks: ReadonlyArray<{ id: string; type: string; role: string }>): ReadingLayoutProfile {
  if (!/^qf01-stage-[1-9]$/.test(stageId)) throw Error('Invalid QF reading-layout stage')
  const spacingByBlock: Record<string, ReadingSpacingRole> = {}
  blocks.forEach((block, index) => {
    const previous = blocks[index - 1]
    spacingByBlock[block.id] = block.type === 'formula' && previous?.type === 'paragraph' ? 'reason-equation'
      : ['target', 'subderivation-purpose', 'return-to-parent', 'local-conclusion', 'problem-conclusion'].includes(block.role) ? 'purpose' : 'ordinary'
  })
  return { id: 'qf01:r3:' + stageId, spacingByBlock }
}
