import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import authored from './n10Authored.json'
import revision6 from './n10Revision6.json'
export const mathNumbersN10Unit = validateTextbookUnits([revision6.unit])[0]
export const n10Presentation = authored
export const n10SourceToItemIds: Record<string, string[]> = Object.fromEntries(
  Array.from({ length: 21 }, (_, i) => ['N10-Q' + String(i + 1).padStart(2, '0'), revision6.unit.nestedContract.parents.filter(n => authored.nodes.find(source => source.id === n.nodeId)?.q === i + 1).map(n => n.nodeId)]),
)
