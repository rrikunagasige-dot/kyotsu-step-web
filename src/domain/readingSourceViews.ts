import type { TextbookItem, TextbookReadingBlock } from './textbookSchema'
import type { TextbookAnswerRecord } from './textbook'

/** A view always points back to the authored block; it is not another answer key. */
export function canonicalReadingSourceView(ref: string, blocks: readonly TextbookReadingBlock[]): TextbookReadingBlock | undefined {
  const [id, row] = ref.split('#')
  const source = blocks.find(block => block.id === id)
  if (!source) return undefined
  if (row === undefined) return source
  if (source.type !== 'formula') throw Error('A mathematical source row requires a formula: ' + ref)
  const math = source.parts.find(part => part.type === 'math')
  if (!math || math.type !== 'math') throw Error('Missing source math: ' + ref)
  const body = math.latex.replace(/\\begin\{aligned\}|\\end\{aligned\}|\\begin\{array\}\{[^}]+\}|\\end\{array\}/g, '')
  const line = body.split('\\\\')[Number(row)]
  if (line === undefined) throw Error('Missing source row: ' + ref)
  const latex = math.latex.includes('\\begin{array}') ? line.slice(line.indexOf('&') + 1) : line.replaceAll('&', '')
  return { ...source, id: ref, parts: [{ type: 'math', latex }] }
}

export type ReadingSourceRecords = {
  itemIds: (block: TextbookReadingBlock) => readonly string[]
  item: (id: string) => TextbookItem | undefined
  answer: (id: string) => TextbookAnswerRecord | undefined
  resolved: (item: TextbookItem, answer: TextbookAnswerRecord | undefined) => boolean
}

/** Resolve from the learner's actual stored value, and only after every source slot is resolved. */
export function recordedReadingSourceView(ref: string, blocks: readonly TextbookReadingBlock[], records: ReadingSourceRecords, idPrefix: string): TextbookReadingBlock | undefined {
  const source = canonicalReadingSourceView(ref, blocks)
  if (!source) return undefined
  if (records.itemIds(source).some(id => {
    const item = records.item(id)
    return !item || !records.resolved(item, records.answer(id))
  })) return undefined
  if (source.type !== 'formula' && source.type !== 'paragraph') return source
  return { ...source, id: idPrefix + ref, parts: source.parts.map(part => {
    if (part.type !== 'choice') return part
    const item = records.item(part.itemId)
    const answer = records.answer(part.itemId)
    if (!item || !answer || !records.resolved(item, answer)) throw Error('Unresolved canonical source slot: ' + part.itemId)
    return item.answerType === 'formula' ? { type: 'math' as const, latex: answer.value } : { type: 'text' as const, text: answer.value }
  }) }
}

export function selectCurrentReadingContext({ startBlockId, blocks, itemId, byItem, stageRefs }: {
  startBlockId: string; blocks: readonly TextbookReadingBlock[]; itemId?: string | null
  byItem?: Readonly<Record<string, readonly string[]>>; stageRefs: readonly string[]
}): readonly string[] {
  if (itemId !== undefined && byItem) return itemId ? byItem[itemId] ?? [] : []
  const start = blocks.findIndex(block => block.id === startBlockId)
  return stageRefs.filter(id => {
    const index = blocks.findIndex(block => block.id === id)
    if (index < 0 || index >= start) throw Error('First-theme context is missing or from the future: ' + id)
    return true
  })
}

export function readingStageResults(stageId: string, resultIdsByStage?: Readonly<Record<string, readonly string[]>>): readonly string[] {
  return resultIdsByStage?.[stageId] ?? []
}
