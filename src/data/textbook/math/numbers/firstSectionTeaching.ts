import type { TextbookItem, TextbookReadingBlock, TextbookUnit } from '../../../../domain/textbookSchema'
import authored from './firstSectionTeaching.json'

export type SectionTeachingPlan = {
  baselineRevision: number
  readingFlow: TextbookReadingBlock[]
  newItems: TextbookItem[]
  itemPrompts: Record<string, string>
  retiredItems: string[]
  stages: [string, string][]
  contexts: Record<string, string[]>
  auditedRegions: string[]
  sourceCoverage: Record<string, { originalItemIds: string[]; activeItemIds: string[]; workedBlockIds: string[] }>
  editionIncrement?: number
  resultBlockIdsByStage?: Record<string, string[]>
  contextBlockIdsByItem?: Record<string, string[]>
  alignedFormulaBlockIds?: string[]
  formulaLayouts?: Record<string, { mobileBreaks?: { row: number; chunk: number }[]; continueOuterFactor?: boolean }>
  equationNumbers?: Record<string, number>
}
export const firstSectionTeachingPlans = authored as unknown as Record<string, SectionTeachingPlan>

/** Whole-solution authoring: ordering is authored explicitly, never inferred by UI. */
export function teachFirstSection(unit: TextbookUnit): TextbookUnit {
  const prefix = unit.unitId.replace('math-numbers-expressions-', '')
  const plan = firstSectionTeachingPlans[prefix]
  if (!plan) return unit
  if (unit.revision !== plan.baselineRevision) throw Error('Teaching baseline mismatch: ' + prefix)
  const original = unit.sections[0]
  const items = new Map([...original.items, ...plan.newItems].map(item => [item.id, item]))
  const order = plan.readingFlow.flatMap(block => block.type === 'paragraph' || block.type === 'formula'
    ? block.parts.flatMap(part => part.type === 'choice' ? [part.itemId] : []) : [])
  if (new Set(order).size !== order.length) throw Error('Repeated teaching interaction: ' + prefix)
  const currentItems = order.map(id => {
    const item = items.get(id)
    if (!item || plan.retiredItems.includes(id)) throw Error('Missing or retired teaching item: ' + id)
    return plan.itemPrompts[id] && plan.itemPrompts[id] !== item.prompt
      ? { ...item, prompt: plan.itemPrompts[id] } : item
  })
  return { ...unit, revision: unit.revision + (plan.editionIncrement ?? 1), sections: [{ ...original, readingFlow: plan.readingFlow, items: currentItems }] }
}
