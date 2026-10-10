import { InlineMath } from 'react-katex'
import type { TextbookUnitProgress } from '../../domain/textbook'
import { isTextbookItemResolved } from '../../domain/textbook'
import { normalizeTextbookMath } from '../../domain/textbookMath'
import type { TextbookReadingBlock, TextbookSection } from '../../domain/textbookSchema'

type FormulaBlock = Extract<TextbookReadingBlock, { type: 'formula' }>

type Props = {
  block: FormulaBlock
  section: TextbookSection
  progress: TextbookUnitProgress | undefined
  onOpen: (itemId: string) => void
}

export function TextbookFormula({ block, section, progress, onOpen }: Props) {
  return (
    <div
      className="reading-formula-line"
      data-testid={`textbook-formula-${block.id}`}
      data-latex-status="ok"
    >
      <div className="reading-formula-expression">
        {block.parts.map((part, index) => {
          const key = `${block.id}-part-${index}`

          if (part.type === 'math') {
            return <span className="reading-formula-math" key={key}><InlineMath math={part.latex} /></span>
          }

          if (part.type === 'text') {
            return <span className="reading-formula-text" key={key}>{part.text}</span>
          }

          if (part.type === 'term') {
            return <strong className="reading-term reading-formula-term" key={key}>{part.text}</strong>
          }

          const item = section.items.find((candidate) => candidate.id === part.itemId)
          if (!item) {
            return <span className="reading-formula-missing" key={key}>□</span>
          }

          const record = progress?.answers[item.id]
          const resolved = isTextbookItemResolved(item, record)

          if (resolved) {
            const value = record?.value ?? item.answer
            return (
              <span className="reading-formula-answer" data-testid={`resolved-${item.id}`} key={key}>
                {item.answerType === 'formula'
                  ? <InlineMath math={normalizeTextbookMath(value)} />
                  : value}
              </span>
            )
          }

          const wrong = Boolean(record)
          return (
            <button
              type="button"
              className={`reading-formula-choice${wrong ? ' reading-formula-choice--wrong' : ''}`}
              data-testid={`textbook-item-${item.id}`}
              aria-label={item.prompt}
              onClick={() => onOpen(item.id)}
              key={key}
            >
              {wrong ? '×' : '選択'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
