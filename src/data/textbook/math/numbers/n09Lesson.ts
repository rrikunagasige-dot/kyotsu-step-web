import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import authored from './n09Authored.json'
import revision6 from './n09Revision6.json'
export const mathNumbersN09Unit = validateTextbookUnits([revision6.unit])[0]
export const n09Presentation = authored
export const n09SourceToItemIds: Record<string, string[]> = Object.fromEntries(
  Array.from({ length: 14 }, (_, i) => ['N09-Q' + String(i + 1).padStart(2, '0'), revision6.unit.nestedContract.parents.filter(n => n.nodeId.startsWith('n09-') && authored.nodes.find(source => source.id === n.nodeId)?.q === i + 1).map(n => n.nodeId)]),
)
