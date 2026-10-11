import type { TextbookReadingBlock } from '../../../domain/textbookSchema'

// Math I+A, published "集合": presentation metadata ONLY.
// Every source block is rendered from the original readingFlow. No lesson copy, answer,
// new math statement, figure, or unit revision is stored here.
export type MathSetReadingStage = {
  id: string
  label: { ja: string; zh: string }
  startBlockId: string
  referenceBlockIds?: readonly string[]
}

export type MathSetRenderedStage = MathSetReadingStage & {
  blocks: readonly TextbookReadingBlock[]
}

export const mathSetReadingStages: readonly MathSetReadingStage[] = [
  { id: 'gather', label: { ja: '集合と要素', zh: '集合与元素' }, startBlockId: 'heading-represent' },
  { id: 'membership', label: { ja: '要素の所属', zh: '元素的归属' }, startBlockId: 'dialogue-teacher-membership', referenceBlockIds: ['formula-set-a'] },
  { id: 'builder', label: { ja: '集合の表し方', zh: '集合的表示' }, startBlockId: 'marker-example-builder' },
  { id: 'finite', label: { ja: '有限集合と無限集合', zh: '有限集与无限集' }, startBlockId: 'paragraph-a08b', referenceBlockIds: ['formula-set-b-rule'] },
  { id: 'intersection', label: { ja: '共通部分', zh: '交集' }, startBlockId: 'heading-relations' },
  { id: 'union', label: { ja: '和集合', zh: '并集' }, startBlockId: 'paragraph-b03' },
  { id: 'subset', label: { ja: '部分集合', zh: '子集' }, startBlockId: 'marker-example-subset' },
  { id: 'empty-set', label: { ja: '空集合と部分集合', zh: '空集与子集' }, startBlockId: 'paragraph-c04' },
  { id: 'complement', label: { ja: '全体集合と補集合', zh: '全集与补集' }, startBlockId: 'heading-outside' },
  { id: 'complement-laws', label: { ja: '補集合の関係', zh: '补集的关系' }, startBlockId: 'paragraph-d03', referenceBlockIds: ['formula-d-abar'] },
  { id: 'de-morgan', label: { ja: 'ド・モルガンの法則', zh: '德摩根定律' }, startBlockId: 'marker-example-demorgan', referenceBlockIds: ['formula-d-abar'] },
  { id: 'check-de-morgan', label: { ja: '法則を要素で確認', zh: '用元素验证定律' }, startBlockId: 'marker-check-demorgan', referenceBlockIds: ['formula-e-laws'] },
  { id: 'real-line', label: { ja: '実数と数直線', zh: '实数与数轴' }, startBlockId: 'marker-example-real-line' },
  { id: 'real-line-operations', label: { ja: '数直線上の集合の関係', zh: '数轴上的集合关系' }, startBlockId: 'paragraph-f07' },
  { id: 'summary', label: { ja: '集合のまとめ', zh: '集合小结' }, startBlockId: 'marker-summary-sets' },
]

export function partitionMathSetReadingFlow(blocks: readonly TextbookReadingBlock[]): MathSetRenderedStage[] {
  if (!blocks.length) throw new Error('math-sets readingFlow must not be empty')
  const ids = new Map<string, number>()
  for (const [index, block] of blocks.entries()) {
    if (ids.has(block.id)) throw new Error('duplicate math-sets reading block: ' + block.id)
    ids.set(block.id, index)
  }
  const starts = mathSetReadingStages.map(stage => {
    const index = ids.get(stage.startBlockId)
    if (index === undefined) throw new Error('missing math-sets stage anchor: ' + stage.startBlockId)
    return index
  })
  if (starts[0] !== 0 || starts.some((index, i) => i > 0 && index <= starts[i - 1])) {
    throw new Error('math-sets stages must form a strictly ordered complete partition')
  }

  const stages = mathSetReadingStages.map((stage, index): MathSetRenderedStage => ({
    ...stage,
    blocks: blocks.slice(starts[index], starts[index + 1] ?? blocks.length),
  }))
  const previousStageForBlock = new Map<string, number>()
  for (const [index, stage] of stages.entries()) {
    for (const block of stage.blocks) previousStageForBlock.set(block.id, index)
    const next = stages[index + 1]?.blocks[0]
    const last = stage.blocks[stage.blocks.length - 1]
    // A continuous derivation must NEVER be cut into two separately hidden stages.
    if (last && next &&
        (last.type === 'paragraph' || last.type === 'formula' || last.type === 'note') &&
        (next.type === 'paragraph' || next.type === 'formula' || next.type === 'note') &&
        last.derivationId && last.derivationId === next.derivationId) {
      throw new Error('math-sets stage cuts a derivation chain: ' + last.derivationId)
    }
  }
  for (const [index, stage] of stages.entries()) {
    for (const ref of stage.referenceBlockIds ?? []) {
      const sourceStage = previousStageForBlock.get(ref)
      if (sourceStage === undefined || sourceStage >= index) {
        throw new Error('math-sets reference must target an earlier complete stage: ' + ref)
      }
    }
  }
  if (stages.reduce((n, stage) => n + stage.blocks.length, 0) !== blocks.length) {
    throw new Error('math-sets stage coverage is incomplete')
  }
  return stages
}
