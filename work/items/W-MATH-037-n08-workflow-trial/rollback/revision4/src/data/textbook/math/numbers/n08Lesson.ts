import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import authored from './n08Authored.json'

export const mathNumbersN08Unit = validateTextbookUnits([authored.unit])[0]
export const n08SourceToItemIds: Record<string, string[]> = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => ['N08-Q' + String(i + 1).padStart(2, '0'),
    authored.nodes.filter(n => n.q === i + 1).flatMap(n => n.interaction ? [n.interaction] : [])]),
)
export const n08Presentation = authored
