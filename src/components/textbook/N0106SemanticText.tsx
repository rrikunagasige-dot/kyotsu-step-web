import display from '../../data/textbook/math/numbers/n0106SemanticDisplay.json'
import { InlineMath } from 'react-katex'
import { normalizeTextbookMath } from '../../domain/textbookMath'

type DisplayPart = { type: 'text'; text: string } | { type: 'math'; latex: string }
const partsByRaw = display.partsByRaw as Readonly<Record<string, readonly DisplayPart[]>>
const revisions = display.revisions as Readonly<Record<string, number>>

export function isN0106DisplayUnit(unitId: string, revision: number): boolean {
  return Object.prototype.hasOwnProperty.call(revisions, unitId) && revisions[unitId] === revision
}

function displayParts(unitId: string | undefined, value: string): readonly DisplayPart[] | undefined {
  if (!unitId || !Object.prototype.hasOwnProperty.call(revisions, unitId)) return undefined
  return Object.prototype.hasOwnProperty.call(partsByRaw, value) ? partsByRaw[value] : undefined
}

// 表示用の固定原文辞書だけを使う。採点値・保存値を変換しない。
export function n0106SemanticLatex(unitId: string | undefined, value: string): string | undefined {
  const parts = displayParts(unitId, value)
  return parts?.map(part => part.type === 'math' ? normalizeTextbookMath(part.latex) : '\\text{' + part.text + '}').join('')
}

export function N0106SemanticText({ unitId, value }: { unitId?: string; value: string }) {
  const parts = displayParts(unitId, value)
  if (!parts) return <>{value}</>
  return <span className="n0106-semantic-text">{parts.map((part, index) => part.type === 'text'
    ? <span key={index}>{part.text}</span>
    : <span className="n0106-semantic-math" key={index}><InlineMath math={normalizeTextbookMath(part.latex)} /></span>)}</span>
}
