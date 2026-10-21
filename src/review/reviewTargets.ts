import type { TextbookSection, TextbookUnit } from '../domain/textbookSchema'

export type ReviewTarget = {
  id: string
  unitId: string
  title: string
  question: string
  revision: number
  totalItems: number
  blockIds: readonly string[]
  itemIds: readonly string[]
  expectedAnswers: readonly string[]
  /** Only these existing readingFlow blocks receive review-only markers. */
  markBlockIds: readonly string[]
  /** Accepted work remains in history; markers are absent from the next review build. */
  reviewState: 'awaiting-user' | 'needs-fix' | 'accepted'
}

/**
 * User-approved W-GOV-008/P-001 pilot. All content is selected by IDs from the
 * real PR lesson; no copied solution text or substituted illustration is used.
 */
const targets: Record<string, ReviewTarget> = {
  // W-MATH-017/P-003: precisely the two newly approved learner blocks.
  // The original unit and item instances are reused, never mocked.
  'n11-q01': {
    id: 'n11-q01', unitId: 'math-numbers-expressions-n11', title: 'N11 Q01', question: '負の数の大小比較',
    revision: 7, totalItems: 24,
    blockIds: ['n11-group-1', 'n11-show-n11-f01', 'n11-lead-01', 'n11-formula-01', 'n11-after-01'],
    itemIds: ['n11-01'],
    expectedAnswers: ['>'],
    markBlockIds: ['n11-formula-01'],
    reviewState: 'awaiting-user',
  },
  'n11-q05': {
    id: 'n11-q05', unitId: 'math-numbers-expressions-n11', title: 'N11 Q05', question: '一次不等式の操作と計算',
    revision: 7, totalItems: 24,
    blockIds: ['n11-after-04', 'n11-lead-05', 'n11-formula-05', 'n11-after-05'],
    itemIds: ['n11-wm017-q05-operation', 'n11-05'],
    expectedAnswers: ['2', '7'],
    markBlockIds: ['n11-lead-05', 'n11-formula-05'],
    reviewState: 'awaiting-user',
  },
  'n01-q07': {
    id: 'n01-q07', unitId: 'math-numbers-expressions-n01', title: 'N01 Q07', question: '同類項の係数',
    revision: 2, totalItems: 18,
    blockIds: [
      'formula-like-original', 'paragraph-n01-07-intro',
      'formula-r3-q07-x2coef', 'formula-r3-q07-xcoef',
      'formula-r3-q07-const', 'formula-n01-07',
    ],
    itemIds: ['n01-r3-q07-x2coef', 'n01-r3-q07-xcoef', 'n01-r3-q07-const', 'n01-07'],
    expectedAnswers: ['-2', '-3', '3', '-2x^2-3x+3'],
    markBlockIds: ['formula-r3-q07-x2coef', 'formula-r3-q07-xcoef', 'formula-r3-q07-const'],
    reviewState: 'awaiting-user',
  },
  'n04-q01': {
    id: 'n04-q01', unitId: 'math-numbers-expressions-n04', title: 'N04 Q01', question: '四つの積',
    revision: 2, totalItems: 5,
    blockIds: [
      'paragraph-n04-intro', 'paragraph-n04-dialogue', 'paragraph-n04-four-products',
      'formula-n04-q01-p1', 'formula-n04-q01-p2',
      'formula-n04-q01-p3', 'formula-n04-q01-p4',
      'paragraph-n04-collect-without-combining', 'formula-n04-q01-complete',
    ],
    itemIds: ['n04-q01-p1', 'n04-q01-p2', 'n04-q01-p3', 'n04-q01-p4', 'n04-01'],
    expectedAnswers: ['25x^2', '20xy', '20xy', '16y^2', '25x^2+20xy+20xy+16y^2'],
    markBlockIds: ['formula-n04-q01-p1', 'formula-n04-q01-p2', 'formula-n04-q01-p3', 'formula-n04-q01-p4', 'formula-n04-q01-complete'],
    reviewState: 'awaiting-user',
  },
  'n03-q10': {
    id: 'n03-q10', unitId: 'math-numbers-expressions-n03', title: 'N03 Q10', question: '四つの積',
    revision: 2, totalItems: 17,
    blockIds: [
      'paragraph-two-brackets', 'figure-multiplication-grid', 'paragraph-grid-products',
      'formula-r3-q10-p1', 'formula-r3-q10-p2',
      'formula-r3-q10-p3', 'formula-r3-q10-p4', 'formula-n03-10',
    ],
    itemIds: ['n03-r3-q10-p1', 'n03-r3-q10-p2', 'n03-r3-q10-p3', 'n03-r3-q10-p4', 'n03-10'],
    expectedAnswers: ['6x^2', '8x', '3x', '4', '6x^2+8x+3x+4'],
    markBlockIds: ['formula-r3-q10-p1', 'formula-r3-q10-p2', 'formula-r3-q10-p3', 'formula-r3-q10-p4'],
    reviewState: 'awaiting-user',
  },
}

export const reviewTargets = targets

/** Never expose markers for a block that the user has already accepted. */
export function activeReviewMarkIds(target: ReviewTarget): readonly string[] {
  return target.reviewState === 'accepted' ? [] : target.markBlockIds
}

export function extractReviewSection(unit: TextbookUnit, target: ReviewTarget): TextbookSection | null {
  if (unit.unitId !== target.unitId || unit.revision !== target.revision) return null
  if (new Set(target.markBlockIds).size !== target.markBlockIds.length) return null
  if (target.markBlockIds.some(id => !target.blockIds.includes(id))) return null
  const section = unit.sections.find(candidate => candidate.id === 'lesson')
  if (!section || section.items.length < target.totalItems) return null

  const blocks = target.blockIds.map(id => section.readingFlow.find(block => block.id === id))
  const items = target.itemIds.map(id => section.items.find(item => item.id === id))
  if (blocks.some(block => !block) || items.some(item => !item)) return null

  // Guard against stale/partial PR content and any accidental answer/key change.
  if (items.some((item, index) => item?.answer !== target.expectedAnswers[index])) return null
  const actualChoiceOrder = blocks.flatMap(block => {
    if (!block || (block.type !== 'paragraph' && block.type !== 'formula')) return []
    return block.parts.filter(part => part.type === 'choice').map(part => part.itemId)
  })
  if (actualChoiceOrder.join('|') !== target.itemIds.join('|')) return null

  return {
    ...section,
    readingFlow: blocks as TextbookSection['readingFlow'],
    items: items as TextbookSection['items'],
  }
}
