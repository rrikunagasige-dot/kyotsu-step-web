import type { TextbookAnswerRecord, TextbookUnitProgress } from './textbook'
import { isTextbookItemResolved } from './textbook'
import type { TextbookReadingPart, TextbookSection } from './textbookSchema'

function escapeLatexText(value: string) {
  return value
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([{}$&#%_])/g, '\\$1')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/~/g, '\\textasciitilde{}')
}

function answerLatex(value: string, formula: boolean) {
  return formula ? value : `\\text{${escapeLatexText(value)}}`
}

function choiceLatex(
  itemId: string,
  record: TextbookAnswerRecord | undefined,
  resolvedValue?: string,
  formula = false,
) {
  if (resolvedValue !== undefined) {
    return `\\htmlData{testid=resolved-${itemId}}{\\htmlClass{tb-math-answer}{\\boxed{${answerLatex(resolvedValue, formula)}}}}`
  }

  const wrong = Boolean(record)
  const marker = wrong ? '\\times' : '\\phantom{?}'
  const className = wrong ? 'tb-math-choice tb-math-choice-wrong' : 'tb-math-choice'
  return `\\htmlData{testid=textbook-item-${itemId}}{\\htmlClass{${className}}{\\href{#tb-choice-${itemId}}{\\boxed{${marker}}}}}`
}

export function buildTextbookFormulaLatex(
  parts: TextbookReadingPart[],
  section: TextbookSection,
  progress: TextbookUnitProgress | undefined,
) {
  return parts.map((part) => {
    if (part.type === 'math') return part.latex
    if (part.type === 'text') return `\\text{${escapeLatexText(part.text)}}`

    const item = section.items.find((candidate) => candidate.id === part.itemId)
    if (!item) return '\\boxed{?}'
    const record = progress?.answers[item.id]
    const resolved = isTextbookItemResolved(item, record)
    return choiceLatex(item.id, record, resolved ? record?.value ?? item.answer : undefined, item.answerType === 'formula')
  }).join('')
}
