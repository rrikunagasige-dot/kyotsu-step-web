import { isFirstThemeUnit, firstThemeUsesAlignedFormula, firstThemeFormulaLayout, firstThemeEquationNumber } from '../../data/textbook/math/presentation'
import { NumberedEquation } from './NumberedEquation'
import { TypesetFormula } from './TypesetFormula'
import { typesettingEnabled } from '../../data/textbook/math/typesetting'
import { InlineMath } from 'react-katex'
import { auditedResolvedWrapBlocks, auditedWrapBlocks, formulaWrapChunks, firstThemeFormulaRows } from './formulaWrap'
import type { TextbookUnitProgress } from '../../domain/textbook'
import { isTextbookItemResolved } from '../../domain/textbook'
import { normalizeTextbookMath } from '../../domain/textbookMath'
import { textbookDisplayLines } from '../../domain/textbookDisplayLines'
import type { TextbookReadingBlock, TextbookSection } from '../../domain/textbookSchema'

type FormulaBlock = Extract<TextbookReadingBlock, { type: 'formula' }>

type Props = {
  unitId: string
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

export function TextbookFormula(props: Props) {
  const number = firstThemeEquationNumber(props.unitId, props.block.id)
  const body = <TextbookFormulaContent {...props} />
  return number === undefined ? body : <NumberedEquation number={number} logical={typesettingEnabled(props.unitId)}>{body}</NumberedEquation>
}

function TextbookFormulaContent({ block, section, progress, onOpen, unitId }: Props) {
  const n12Formula = unitId === 'math-numbers-expressions-n12'
  const renderedParts = block.parts.map((part, index) => {
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
              const lines = textbookDisplayLines(item.id, value)
              return lines.length > 1
                ? <span className="reading-formula-n12-answer-lines">
                    {lines.map((line, i) =>
                      <span key={i}><InlineMath math={normalizeTextbookMath(line)} /></span>)}
                  </span>
                : <InlineMath math={showCoefficientAsX ? 'x' : normalizeTextbookMath(lines[0])} />
            })()
            : value}
        </span>
      )
    }

    const wrong = Boolean(record)
    const localToken = ['n12-p002-', 'n12-p003-', 'n09-p001-', 'n01-r3-', 'n03-r3-'].some(prefix => item.id.startsWith(prefix))
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
  })
  if (typesettingEnabled(unitId)) {
    const itemIds = Object.fromEntries(block.parts.flatMap((part, index) => part.type === 'choice' ? [[index, part.itemId]] : []))
    const source = block.parts.map((part, index) => {
      if (part.type === 'math') return part.latex
      if (part.type === 'text' || part.type === 'term') return '\\text{' + part.text + '}'
      const item = section.items.find(q => q.id === part.itemId)
      const record = progress?.answers[part.itemId]
      if (!item || !isTextbookItemResolved(item, record)) return '§' + index + '§'
      const value = record?.value ?? item.answer
      return '§a' + index + '§' + (item.answerType === 'formula' ? normalizeTextbookMath(value) : '\\text{' + value + '}') + '§z' + index + '§'
    }).join('')
    return <TypesetFormula source={source} sourceId={block.id} unitId={unitId} parts={renderedParts} itemIds={itemIds} />
  }
  const first = block.parts[0]
  const n12Choice = block.parts[1]
  const suffix = block.parts[2]
  const q06Layout = n12Formula && block.parts.length === 3 && block.id === 'formula-q06-left-coef'
    && first?.type === 'math' && first.latex.endsWith('\\quad\\Longrightarrow\\quad')
    && n12Choice?.type === 'choice' && n12Choice.itemId === 'n12-p002-q06-left-coef'
    && suffix?.type === 'math'
  const q12Layout = n12Formula && block.parts.length === 3 && block.id === 'formula-q12-signed-coef'
    && first?.type === 'math' && first.latex.includes('=')
    && n12Choice?.type === 'choice' && n12Choice.itemId === 'n12-p002-q12-signed-coef'
    && suffix?.type === 'math'
  const transformLayout = n12Formula && block.parts.length === 3
    && ((block.id === 'formula-q02-coef' && n12Choice?.type === 'choice' && n12Choice.itemId === 'n12-p002-q02-coef')
      || (block.id === 'formula-q06-right-coef' && n12Choice?.type === 'choice' && n12Choice.itemId === 'n12-p002-q06-right-coef'))
    && first?.type === 'math' && first.latex.endsWith('\\quad\\Longrightarrow\\quad') && suffix?.type === 'math'
  const puddingLayout = n12Formula && block.id === 'formula-cost-pudding' && block.parts.length === 3
    && first?.type === 'math' && first.latex === '130\\times(20-x)='
    && n12Choice?.type === 'choice' && n12Choice.itemId === 'n12-p003-q10-pudding-coef'
    && suffix?.type === 'math' && suffix.latex === '(20-x)'
  const lowerLayout = n12Formula && block.id === 'formula-q13-lower' && block.parts.length === 2
    && first?.type === 'choice' && first.itemId === 'n12-p002-q13-lower'
    && n12Choice?.type === 'math' && n12Choice.latex === '\\le50x<3300-2650'
  const firstThemeWrap = isFirstThemeUnit(unitId) && !block.parts.some(p => p.type === 'math' && p.latex.includes('\\begin'))
  const auditedWrap = firstThemeWrap || (auditedWrapBlocks[unitId]?.includes(block.id) ?? false)
  const wrapBlock = auditedWrap ? {
    ...block,
    parts: block.parts.map((part, index) => {
      if(firstThemeWrap && part.type === 'math')return {...part,latex:part.latex.replace(/\)\(/g,')\\cdot(')}
      if (part.type !== 'choice' || (!firstThemeWrap && !auditedResolvedWrapBlocks.includes(block.id))) return part
      const item = section.items.find(q => q.id === part.itemId)
      const record = progress?.answers[part.itemId]
      return item && isTextbookItemResolved(item, record)
        ? { type: 'math' as const, latex: `§a${index}§${(firstThemeWrap ? normalizeTextbookMath(record?.value ?? item.answer).replace(/\)\(/g,')\\cdot(') : normalizeTextbookMath(record?.value ?? item.answer))}§z${index}§` }
        : part
    }),
  } : block
  let wrappedAnswer: number | undefined
  const markedAnswers = new Set<number>()
  const grouped = q06Layout || q12Layout || transformLayout || puddingLayout
  if (firstThemeUsesAlignedFormula(unitId, block.id)) {
    const layout = firstThemeFormulaLayout(unitId, block.id)
    const rows = firstThemeFormulaRows(wrapBlock, layout)
    return (
      <div className="reading-formula-line reading-formula-line--aligned" data-testid={`textbook-formula-${block.id}`} data-latex-status="ok">
        <div className="first-theme-formula-rows">
          {rows.map((row, rowIndex) => (
            <div className="first-theme-formula-row" key={rowIndex}>
              <span className="first-theme-formula-relation">{row.relation && <InlineMath math={row.relation} />}</span>
              <span className="first-theme-formula-terms">
                {row.chunks.flatMap((chunk, chunkIndex) => [
                  layout?.mobileBreaks?.some(point => point.row === rowIndex && point.chunk === chunkIndex)
                    ? <span className="first-theme-mobile-break" key={'break-' + chunkIndex} aria-hidden="true" /> : null,
                  <span className="reading-formula-wrap-group" key={chunkIndex}>
                    {chunk.split(/(§(?:\d+|a\d+|z\d+)§)/).filter(Boolean).map((part, partIndex) => {
                      const begin = part.match(/^§a(\d+)§$/)
                      if (begin) { wrappedAnswer = Number(begin[1]); return null }
                      if (/^§z\d+§$/.test(part)) { wrappedAnswer = undefined; return null }
                      const choice = part.match(/^§(\d+)§$/)
                      if (choice) return renderedParts[Number(choice[1])]
                      const answerPart = wrappedAnswer === undefined ? undefined : block.parts[wrappedAnswer]
                      const answerId = answerPart?.type === 'choice' && !markedAnswers.has(wrappedAnswer!) ? answerPart.itemId : undefined
                      if (answerId) markedAnswers.add(wrappedAnswer!)
                      return <span className="reading-formula-math" data-testid={answerId ? `resolved-${answerId}` : undefined} key={partIndex}><InlineMath math={/^[+\-=]/.test(part) ? '{}' + part : part} /></span>
                    })}
                  </span>
                ])}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div
      className={`reading-formula-line${n12Formula ? ' reading-formula-line--n12' : ''}`}
      data-testid={`textbook-formula-${block.id}`}
      data-latex-status="ok"
    >
      <div className={`reading-formula-expression${grouped ? ' reading-formula-expression--p016' : ''}${lowerLayout ? ' reading-formula-expression--p017-chain' : ''}${auditedWrap ? ' reading-formula-expression--chapter-wrap' : ''}`}>
        {(q06Layout || transformLayout) && first?.type === 'math' ? (
          <>
            <span className="reading-formula-group" data-testid="p016-left">
              <InlineMath math={first.latex.slice(0, first.latex.indexOf('\\quad\\Longrightarrow\\quad'))} />
            </span>
            <span className="reading-formula-p016-arrow" aria-label="次の式へ">
              <span className="reading-formula-p016-wide" aria-hidden="true">⇒</span>
              <span className="reading-formula-p016-narrow" aria-hidden="true">↓</span>
            </span>
            <span className="reading-formula-group" data-testid="p016-right">
              {renderedParts.slice(1)}
            </span>
          </>
        ) : (q12Layout || puddingLayout) && first?.type === 'math' ? (
          <>
            <span className="reading-formula-group" data-testid="p016-left">
              <InlineMath math={first.latex.slice(0, first.latex.indexOf('='))} />
            </span>
            <span className="reading-formula-group" data-testid="p016-right">
              <InlineMath math={first.latex.slice(first.latex.indexOf('='))} />
              {renderedParts.slice(1)}
            </span>
          </>
        ) : lowerLayout ? (
          <>
            <span className="reading-formula-p017-bound" data-testid="p017-bound">
              {renderedParts[0]}<span className="reading-formula-math"><InlineMath math={'\\le50x'} /></span>
            </span>
            <span className="reading-formula-math reading-formula-p017-continuation" data-testid="p017-continuation"><InlineMath math="<3300-2650" /></span>
          </>
        ) : auditedWrap ? formulaWrapChunks(firstThemeWrap ? {...wrapBlock,id:'first-theme-choice'} : wrapBlock).map((chunk, groupIndex) => (
          <span className="reading-formula-wrap-group" key={`${block.id}-wrap-${groupIndex}`}>
            {chunk.split(/(§(?:\d+|a\d+|z\d+)§)/).filter(Boolean).map((part, partIndex) => {
              const begin = part.match(/^§a(\d+)§$/)
              if (begin) { wrappedAnswer = Number(begin[1]); return null }
              if (/^§z\d+§$/.test(part)) { wrappedAnswer = undefined; return null }
              const choice = part.match(/^§(\d+)§$/)
              const answerPart = wrappedAnswer === undefined ? undefined : block.parts[wrappedAnswer]
              const answerId = answerPart?.type === 'choice' && !markedAnswers.has(wrappedAnswer!) ? answerPart.itemId : undefined
              if (answerId) markedAnswers.add(wrappedAnswer!)
              return choice ? renderedParts[Number(choice[1])]
                : <span className="reading-formula-math" data-testid={answerId ? `resolved-${answerId}` : undefined} key={`${block.id}-wrap-${groupIndex}-${partIndex}`}><InlineMath math={firstThemeWrap && /^[+=-]/.test(part) ? '{}'+part : part} /></span>
            })}
          </span>
        )) : renderedParts}
      </div>
    </div>
  )
}
