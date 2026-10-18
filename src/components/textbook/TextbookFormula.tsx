import { InlineMath } from 'react-katex'
import type { TextbookUnitProgress } from '../../domain/textbook'
import { isTextbookItemResolved } from '../../domain/textbook'
import { normalizeTextbookMath } from '../../domain/textbookMath'
import { n12CostDisplayLines } from '../../domain/n12CostDisplay'
import type { TextbookReadingBlock, TextbookSection } from '../../domain/textbookSchema'

type FormulaBlock = Extract<TextbookReadingBlock, { type: 'formula' }>

type Props = {
  block: FormulaBlock
  section: TextbookSection
  progress: TextbookUnitProgress | undefined
  onOpen: (itemId: string) => void
}

// Display-only: one solved coefficient of 1 immediately before the simple factor x+….
// Keep the recorded answer as "1" and leave constants and other algebraic forms untouched.
function isSolvedUnitCoefficientBeforeX(
  block: FormulaBlock,
  index: number,
  section: TextbookSection,
  progress: TextbookUnitProgress | undefined,
): boolean {
  const part = block.parts[index]
  const next = block.parts[index + 1]
  if (part?.type !== 'choice' || next?.type !== 'math' || !/^x\+/.test(next.latex)) return false

  const item = section.items.find((candidate) => candidate.id === part.itemId)
  if (!item || item.answerType !== 'formula') return false

  const record = progress?.answers[item.id]
  return isTextbookItemResolved(item, record) && (record?.value ?? item.answer) === '1'
}

export function TextbookFormula({ block, section, progress, onOpen }: Props) {
  const n12Formula = section.items.some((item) => item.id === 'n12-01')
  return (
    <div
      className={`reading-formula-line${n12Formula ? ' reading-formula-line--n12' : ''}`}
      data-testid={`textbook-formula-${block.id}`}
      data-latex-status="ok"
    >
      <div className="reading-formula-expression">
        {block.parts.map((part, index) => {
          const key = `${block.id}-part-${index}`

          if (part.type === 'math') {
            const followsUnitCoefficient = isSolvedUnitCoefficientBeforeX(block, index - 1, section, progress)
            const latex = followsUnitCoefficient ? part.latex.slice(1) : part.latex
            const arrow = '\\quad\\Longrightarrow\\quad'
            const arrowAt = n12Formula ? latex.indexOf(arrow) : -1
            if (arrowAt >= 0) {
              const left = latex.slice(0, arrowAt)
              const right = latex.slice(arrowAt + arrow.length)
              return (
                <span className="reading-formula-n12-transform" key={key}>
                  {left && <span className="reading-formula-math"><InlineMath math={left} /></span>}
                  <span className="reading-formula-n12-arrow" aria-label="次の式へ">↓</span>
                  {right && <span className="reading-formula-math"><InlineMath math={right} /></span>}
                </span>
              )
            }
            return <span className="reading-formula-math" key={key}><InlineMath math={latex} /></span>
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
            const showCoefficientAsX = isSolvedUnitCoefficientBeforeX(block, index, section, progress)
            return (
              <span
                className="reading-formula-answer"
                data-testid={`resolved-${item.id}`}
                aria-label={showCoefficientAsX ? '係数は1（式ではx）' : undefined}
                key={key}
              >
                {item.answerType === 'formula'
                  ? (() => {
                    const lines = n12Formula ? n12CostDisplayLines(item.id, value) : [value]
                    return lines.length > 1
                      ? <span className="reading-formula-n12-answer-lines">
                          {lines.map((line, i) =>
                            <span key={i}><InlineMath math={normalizeTextbookMath(line)} /></span>)}
                        </span>
                      : <InlineMath math={showCoefficientAsX ? 'x' : normalizeTextbookMath(value)} />
                  })()
                  : value}
              </span>
            )
          }

          const wrong = Boolean(record)
          const localToken = item.id.startsWith('n12-p002-') || item.id.startsWith('n12-p003-')
          return (
            <button
              type="button"
              className={`reading-formula-choice${wrong ? ' reading-formula-choice--wrong' : ''}${localToken ? ' reading-formula-choice--token' : ''}`}
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
