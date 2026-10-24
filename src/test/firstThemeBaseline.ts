import type { TextbookUnit } from '../domain/textbookSchema'
import type { ReviewTarget } from '../review/reviewTargets'

// Historical W-MATH regression contracts intentionally exercise the 171c edition.
// The current edition is tested independently in firstThemeRepair.test.ts and E2E.
const base: Record<string, [number, number]> = { n02:[1,12], n03:[2,17], n04:[2,26], n05:[2,20], n06:[3,16], ne01:[1,13] }
export function firstThemeBaseline(unit: TextbookUnit): TextbookUnit {
  const revision = base[unit.unitId.replace('math-numbers-expressions-','')]?.[0]
  if (!revision) return unit
  return { ...unit, revision, sections: unit.sections.map(s => ({...s,
    readingFlow: s.readingFlow.filter(b => !b.id.includes('-bridge-')),
    items: s.items.filter(q => !q.id.includes('-bridge-')),
  })) }
}
export function firstThemeBaselineTargets(targets: Record<string, ReviewTarget>): Record<string, ReviewTarget> {
  return Object.fromEntries(Object.entries(targets).map(([id,t]) => {
    const value = base[t.unitId.replace('math-numbers-expressions-','')]
    if (!value) return [id,t]
    const keep = t.itemIds.map((id,i) => [id,t.expectedAnswers[i]]).filter(([id]) => !id.includes('-bridge-'))
    return [id,{ ...t, revision:value[0],totalItems:t.totalItems === 5 ? 5 : value[1],
      blockIds:t.blockIds.filter(id => !id.includes('-bridge-')),
      itemIds:keep.map(([id])=>id),expectedAnswers:keep.map(([,answer])=>answer) }]
  }))
}
