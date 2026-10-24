import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import authored from './n07Authored.json'

// Generated from the exact approved N07 plan. No authoring dependencies in the app.
export const mathNumbersN07Unit = validateTextbookUnits([authored.unit])[0]
export const n07SourceToItemIds: Record<string, string[]> = Object.fromEntries(
  Array.from({ length: 14 }, (_, index) => {
    const problemId = 'N07-Q' + String(index + 1).padStart(2, '0')
    return [problemId, authored.nodes.filter(node => node.problemId === problemId)
      .flatMap(node => node.interaction ? [node.interaction.id] : [])]
  }),
)
export const n07Presentation = authored
