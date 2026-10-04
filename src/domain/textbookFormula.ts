import type { TextbookAnswerRecord, TextbookUnitProgress } from './textbook'
import { isTextbookItemResolved } from './textbook'
import type { TextbookReadingPart, TextbookSection } from './textbookSchema'
import { normalizeTextbookMath } from './textbookMath'

function escapeLatexText(value: string) {
  return value
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([{}$&#%_])/g, '\\$1')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/~/g, '\\textasciitilde{}')
}

function answerLatex(value: string, formula: boolean) {
  return formula ? normalizeTextbookMath(value) : `\\text{${escapeLatexText(value)}}`
}

function choiceLatex(
  _itemId: string,
  record: TextbookAnswerRecord | undefined,
  resolvedValue?: string,
  formula = false,
) {
  if (resolvedValue !== undefined) return answerLatex(resolvedValue, formula)
  return record ? '\\boxed{\\times}' : '\\boxed{\\phantom{?}}'
}

export function buildTextbookFormulaLatex(
  parts: TextbookReadingPart[],
  section: TextbookSection,
  progress: TextbookUnitProgress | undefined,
) {
  return parts.map((part) => {
    if (part.type === 'math') return part.latex
    if (part.type === 'text' || part.type === 'term') return `\\text{${escapeLatexText(part.text)}}`

    const item = section.items.find((candidate) => candidate.id === part.itemId)
    if (!item) return '\\boxed{?}'
    const record = progress?.answers[item.id]
    const resolved = isTextbookItemResolved(item, record)
    return choiceLatex(item.id, record, resolved ? record?.value ?? item.answer : undefined, item.answerType === 'formula')
  }).join('')
}
