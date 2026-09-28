import katex from 'katex'
import { useMemo, type MouseEvent } from 'react'
import type { TextbookUnitProgress } from '../../domain/textbook'
import { buildTextbookFormulaLatex } from '../../domain/textbookFormula'
import type { TextbookReadingBlock, TextbookSection } from '../../domain/textbookSchema'

type FormulaBlock = Extract<TextbookReadingBlock, { type: 'formula' }>

type Props = {
  block: FormulaBlock
  section: TextbookSection
  progress: TextbookUnitProgress | undefined
  onOpen: (itemId: string) => void
}

export function TextbookFormula({ block, section, progress, onOpen }: Props) {
  const latex = useMemo(
    () => buildTextbookFormulaLatex(block.parts, section, progress),
    [block.parts, progress, section],
  )

  const html = useMemo(
    () => katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      strict: 'warn',
      trust: (context) => context.command === '\\href' || context.command === '\\htmlClass',
    }),
    [latex],
  )

  const hasRenderError = html.includes('katex-error')

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const link = target.closest('a[href^="#tb-choice-"]')
    if (!link) return
    event.preventDefault()
    const href = link.getAttribute('href') ?? ''
    const itemId = href.replace(/^#tb-choice-/, '')
    if (itemId) onOpen(itemId)
  }

  return (
    <div
      className={`reading-formula-line${hasRenderError ? ' reading-formula-line--error' : ''}`}
      data-testid={`textbook-formula-${block.id}`}
      data-latex-status={hasRenderError ? 'error' : 'ok'}
      onClick={handleClick}
    >
      {hasRenderError ? (
        <span className="reading-formula-error">数式を表示できません</span>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  )
}
