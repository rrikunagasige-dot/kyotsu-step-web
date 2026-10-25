import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import authored from './n08Authored.json'
import revision5 from './n08Revision5.json'
import activeVersion from './n08ActiveVersion.json'

const active = activeVersion.revision === 4 ? authored : revision5

export const mathNumbersN08Unit = validateTextbookUnits([active.unit])[0]
export const n08SourceToItemIds: Record<string, string[]> = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => ['N08-Q' + String(i + 1).padStart(2, '0'),
    active.nodes.filter(n => n.q === i + 1).flatMap(n => n.interaction ? [n.interaction] : [])]),
)
export const n08Presentation = authored
