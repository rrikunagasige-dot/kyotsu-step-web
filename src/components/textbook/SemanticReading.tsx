import type { ReactNode } from 'react'
import { InlineMath } from 'react-katex'
import type { TextbookReadingPart } from '../../domain/textbookSchema'

type SemanticPart = TextbookReadingPart & { semanticId?: string; usage?: 'first_definition' | 'recall' | 'ordinary' }

/** Opt-in renderer for production IR; no existing lesson is automatically converted. */
export function SemanticReading({ parts, renderChoice }: {
  parts: SemanticPart[]
  renderChoice: (itemId: string) => ReactNode
}) {
  return <>{parts.map((part, index) => {
    const key = part.semanticId ?? index
    const attributes = { 'data-semantic-id': part.semanticId }
    if (part.type === 'math') return <span key={key} {...attributes}><InlineMath math={part.latex} /></span>
    if (part.type === 'term' && part.usage === 'first_definition') {
      return <strong key={key} {...attributes} style={{ color: 'var(--ink, #172b3a)' }}>{part.text}</strong>
    }
    if (part.type === 'choice') return <span key={key} {...attributes}>{renderChoice(part.itemId)}</span>
    return <span key={key} {...attributes}>{part.text}</span>
  })}</>
}
