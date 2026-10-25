import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import authored from './n10Authored.json'
export const mathNumbersN10Unit = validateTextbookUnits([authored.unit])[0]
export const n10Presentation = authored
export const n10SourceToItemIds: Record<string, string[]> = Object.fromEntries(
  Array.from({ length: 21 }, (_, i) => ['N10-Q' + String(i + 1).padStart(2, '0'), authored.nodes.filter(n => n.q === i + 1).flatMap(n => n.interaction ? [n.interaction] : [])]),
)
