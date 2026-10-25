import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import authored from './n09Authored.json'
export const mathNumbersN09Unit = validateTextbookUnits([authored.unit])[0]
export const n09Presentation = authored
export const n09SourceToItemIds: Record<string, string[]> = Object.fromEntries(
  Array.from({ length: 14 }, (_, i) => ['N09-Q' + String(i + 1).padStart(2, '0'), authored.nodes.filter(n => n.q === i + 1).flatMap(n => n.interaction ? [n.interaction] : [])]),
)
