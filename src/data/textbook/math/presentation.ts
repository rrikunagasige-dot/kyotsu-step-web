import type { TextbookReadingBlock } from '../../../domain/textbookSchema'

// Math I+A, published "集合": presentation metadata ONLY.
// Every source block is rendered from the original readingFlow. No lesson copy, answer,
// new math statement, figure, or unit revision is stored here.
export type MathSetReadingStage = {
  id: string
  label: { ja: string; zh: string }
  startBlockId: string
}

export type MathSetRenderedStage = MathSetReadingStage & {
  blocks: readonly TextbookReadingBlock[]
}

export const mathSetReadingStages: readonly MathSetReadingStage[] = [
  { id: 'gather', label: { ja: '集合と要素', zh: '集合与元素' }, startBlockId: 'heading-represent' },
  { id: 'membership', label: { ja: '要素の所属', zh: '元素的归属' }, startBlockId: 'dialogue-teacher-membership' },
  { id: 'builder', label: { ja: '集合の表し方', zh: '集合的表示' }, startBlockId: 'marker-example-builder' },
  { id: 'finite', label: { ja: '有限集合と無限集合', zh: '有限集与无限集' }, startBlockId: 'paragraph-a08b' },
  { id: 'intersection', label: { ja: '共通部分', zh: '交集' }, startBlockId: 'heading-relations' },
  { id: 'union', label: { ja: '和集合', zh: '并集' }, startBlockId: 'paragraph-b03' },
  { id: 'subset', label: { ja: '部分集合', zh: '子集' }, startBlockId: 'marker-example-subset' },
  { id: 'empty-set', label: { ja: '空集合と部分集合', zh: '空集与子集' }, startBlockId: 'paragraph-c04' },
  { id: 'complement', label: { ja: '全体集合と補集合', zh: '全集与补集' }, startBlockId: 'heading-outside' },
  { id: 'complement-laws', label: { ja: '補集合の関係', zh: '补集的关系' }, startBlockId: 'paragraph-d03' },
  { id: 'de-morgan', label: { ja: 'ド・モルガンの法則', zh: '德摩根定律' }, startBlockId: 'marker-example-demorgan' },
  { id: 'check-de-morgan', label: { ja: '法則を要素で確認', zh: '用元素验证定律' }, startBlockId: 'marker-check-demorgan' },
  { id: 'real-line', label: { ja: '実数と数直線', zh: '实数与数轴' }, startBlockId: 'marker-example-real-line' },
  { id: 'real-line-operations', label: { ja: '数直線上の集合の関係', zh: '数轴上的集合关系' }, startBlockId: 'paragraph-f07' },
  { id: 'summary', label: { ja: '集合のまとめ', zh: '集合小结' }, startBlockId: 'marker-summary-sets' },
]

// Exact prerequisite source blocks for each active question. These blocks are part
// of the original lesson and were already learned in an earlier presentation stage.
// Unlike stage-wide references, this map cannot expose unrelated formulae just
// because another question within the same stage needs them.
// Missing entry means the question needs no cross-stage reference.
export const mathSetRequiredContextByItemId: Readonly<Record<string, readonly string[]>> = {
  'set-a02': ['formula-set-a'],
  'set-a03': ['formula-set-a'],
  'set-a04': ['formula-set-a'],
  'set-a05': ['formula-set-a'],
  'set-a08b': ['formula-set-b-rule', 'formula-set-b-list'],
  'set-a08c': ['formula-set-b-rule', 'formula-set-b-list'],
  'set-a09': ['formula-set-b-rule', 'formula-set-b-list'],
  'set-a10': ['formula-set-b-rule', 'formula-set-b-list'],
  'set-b03': ['formula-b-sets'],
  'set-b04': ['formula-b-sets'],
  'set-b05': ['formula-b-sets'],
  'set-b06': ['formula-b-sets'],
  'set-b07': ['formula-b-sets'],
  'set-b08': ['formula-b-sets'],
  'set-c04': ['formula-c-sets'],
  'set-c05': ['formula-c-sets'],
  'set-c06': ['formula-c-sets'],
  'set-c07': ['formula-c-sets'],
  'set-c08': ['paragraph-subset-concept'],
  'set-d03': ['paragraph-universal-concept', 'formula-d-b'],
  'set-d04': ['formula-d-a', 'formula-d-b'],
  'set-d05': ['formula-d-a', 'formula-d-b'],
  'set-d06': ['formula-d-abar', 'formula-d-b'],
  'set-d07': ['formula-d-abar', 'formula-d-b'],
  'set-d08': ['paragraph-universal-concept', 'formula-d-a', 'formula-d-abar', 'figure-d-complement'],
  'set-d09': ['paragraph-universal-concept', 'formula-d-a', 'formula-d-abar', 'figure-d-complement'],
  'set-d10': ['paragraph-universal-concept', 'formula-d-a', 'formula-d-abar', 'figure-d-complement'],
  'set-d11a': ['paragraph-universal-concept'],
  'set-d11b': ['paragraph-universal-concept'],
  'set-e02': ['paragraph-complement-concept'],
  'set-e03': ['paragraph-complement-concept'],
  'set-e04': ['paragraph-complement-concept'],
  'set-e05': ['paragraph-complement-concept'],
  'set-e07': ['paragraph-complement-concept'],
  'set-e08': ['paragraph-complement-concept'],
  'set-e13': ['formula-e-laws'],
  'set-e14': ['formula-e-laws'],
  'set-f07': ['formula-f-sets', 'figure-f-b'],
  'set-f08': ['formula-f-sets', 'figure-f-b'],
  'set-f09': ['formula-f-sets'],
  'set-f10': ['formula-f-sets'],
  'set-f11': ['formula-f-sets'],
  'set-f12': ['formula-f-sets'],
  'set-f13': ['formula-f-sets'],
}

export function requiredMathSetContext(itemId: string | null): readonly string[] {
  return itemId ? (mathSetRequiredContextByItemId[itemId] ?? []) : []
}

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
  // Fail closed if a prerequisite refers to a missing/future block or a question
  // outside the source lesson; this also guards against accidental answer leakage.
  const stageForItem = new Map<string, number>()
  for (const [index, stage] of stages.entries()) {
    for (const block of stage.blocks) {
      if (block.type === 'paragraph' || block.type === 'formula') {
        for (const part of block.parts) {
          if (part.type === 'choice') stageForItem.set(part.itemId, index)
        }
      }
    }
  }
  for (const [itemId, refs] of Object.entries(mathSetRequiredContextByItemId)) {
    const stageIndex = stageForItem.get(itemId)
    if (stageIndex === undefined) throw new Error('math-sets prerequisite target does not exist: ' + itemId)
    if (new Set(refs).size !== refs.length) throw new Error('math-sets duplicate prerequisite: ' + itemId)
    for (const ref of refs) {
      const sourceStage = previousStageForBlock.get(ref)
      if (sourceStage === undefined || sourceStage >= stageIndex) {
        throw new Error('math-sets prerequisite must be from a completed earlier stage: ' + itemId + ' / ' + ref)
      }
    }
  }
  if (stages.reduce((n, stage) => n + stage.blocks.length, 0) !== blocks.length) {
    throw new Error('math-sets stage coverage is incomplete')
  }
  return stages
}

// Semantic boundaries are authored, never inferred from screen length.
const firstThemeStages: Readonly<Record<string, readonly [string, string][]>> = {
  n01: [['heading-factors','因数・係数・次数'],['heading-variable','注目する文字'],['marker-variable-check','文字を変えて確かめる'],['heading-like-terms','同類項を集める'],['marker-degree-check','整理後の次数を調べる']],
  n02: [['heading-variable','注目する文字と項'],['marker-variable-check','係数を文字式で表す'],['heading-add','同じ次数をそろえる'],['heading-minus','引く式の符号'],['paragraph-minus-add','符号を直した式を加える'],['marker-multiply-check','式全体の係数倍'],['paragraph-multiple-collect','次数ごとに集める'],['heading-structure','まとまりを整理して再利用']],
  n03: [['heading-indices','指数の意味と法則'],['marker-powers-check','負の係数と累乗'],['heading-distribute','一つの項を全項へ掛ける'],['paragraph-two-brackets','表で四つの積を数える'],['marker-final-check','三項の括弧へ広げる']],
  n04: [['heading-four-products','四つの積を作る'],['n04-heading-1','平方の公式を導く'],['n04-lead-06','差の平方と和差の積'],['n04-heading-2','公式への対応と代入'],['n04-lead-11','一般の一次式の積'],['n04-lead-14','三項の平方へつなぐ'],['n04-heading-3','共通するまとまりを探す'],['n04-lead-20','四つの因数を組み直す'],['n04-lead-21','共通部分をTで置き換える'],['n04-lead-22','Tを戻して次数ごとに集める']],
  n05: [['n05-heading-1','共通因数と置換からの復元'],['n05-lead-04','符号をそろえてくくる'],['n05-heading-2','平方の公式を逆に使う'],['n05-lead-09','和と積から二数を探す'],['n05-heading-3','たすき掛けの根拠'],['n05-lead-14','候補の交差積を比べる'],['n05-heading-4','自分で条件を立てる'],['n05-lead-19','共通因数の後も分解する']],
  n06: [['n06-heading-1','置換して展開する'],['n06-lead-03','因数分解して元へ戻す'],['n06-heading-2','四次式を二次式へ変える'],['n06-heading-3','低い次数の文字を選ぶ'],['n06-lead-11','共通因数をまとめる'],['n06-heading-4','xの係数と定数部分へ分ける'],['n06-lead-14','定数部分の因数を探す'],['n06-lead-15','和と積を元の係数へ戻す']],
  ne01: [['ne01-heading-01','具体例から3乗を展開する'],['ne01-heading-03','和の3乗を導く'],['ne01-lead-06','負の式を代入して差の3乗へ'],['ne01-heading-07','代入して係数を計算する'],['ne01-heading-08','3乗の和を積へ戻す'],['ne01-heading-12','3乗の形を見抜いて使う']],
}
export function isFirstThemeUnit(unitId: string): boolean {
  return Object.hasOwn(firstThemeStages, unitId.replace('math-numbers-expressions-', '')) && unitId.startsWith('math-numbers-expressions-')
}
export function partitionFirstThemeReadingFlow(unitId: string, blocks: readonly TextbookReadingBlock[]): MathSetRenderedStage[] | null {
  if (!isFirstThemeUnit(unitId)) return null
  const definitions = firstThemeStages[unitId.replace('math-numbers-expressions-', '')]
  const starts = definitions.map(([anchor]) => blocks.findIndex(b => b.id === anchor))
  if (starts[0] !== 0 || starts.some((n,i) => n < 0 || (i > 0 && n <= starts[i-1]))) throw Error('Invalid first-theme stage anchor: ' + unitId)
  return definitions.map(([anchor,label],i) => ({id: anchor, startBlockId: anchor, label:{ja:label,zh:label},blocks:blocks.slice(starts[i],starts[i+1] ?? blocks.length)}))
}

// Only already available premise/result blocks are pinned. No future answers.
const firstThemeReferences: Readonly<Record<string, readonly string[]>> = {
  'heading-minus': ['formula-ab-definition'],
  'paragraph-minus-add': ['formula-ab-definition','formula-n02-07'],
  'marker-multiply-check': ['formula-ab-definition'],
  'paragraph-multiple-collect': ['formula-ab-definition','formula-n02-09'],
  'heading-structure': ['formula-ab-definition','formula-n02-10'],
  'n04-lead-06': ['n04-formula-05'],
  'n04-lead-14': ['n04-formula-05'],
  'n04-lead-21': ['n04-formula-20'],
  'n04-lead-22': ['n04-lead-21', 'n04-formula-21'],
  'n05-lead-14': ['n05-formula-13', 'n05-show-n05-f01'],
  'n06-lead-03': ['n06-formula-01','n06-formula-02'],
  'n06-lead-11': ['n06-formula-09','n06-formula-10'],
  'n06-lead-14': ['n06-formula-13'],
  'n06-lead-15': ['n06-formula-13','n06-formula-14'],
  'ne01-lead-06': ['ne01-formula-05'],
  'ne01-heading-07': ['ne01-formula-06'],
  'ne01-heading-12': ['ne01-formula-10','ne01-formula-11'],
}
export function requiredFirstThemeContext(stage: MathSetRenderedStage, blocks: readonly TextbookReadingBlock[]): readonly string[] {
  const start = blocks.findIndex(b => b.id === stage.startBlockId)
  return (firstThemeReferences[stage.startBlockId] ?? []).filter(id => {
    const index = blocks.findIndex(b => b.id === id)
    if (index < 0 || index >= start) throw Error('First-theme context is missing or from the future: ' + id)
    return true
  })
}
