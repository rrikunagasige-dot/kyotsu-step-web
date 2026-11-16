import { describe, expect, it } from 'vitest'
import { canonicalReadingSourceView, recordedReadingSourceView, selectCurrentReadingContext } from './readingSourceViews'
import { isTextbookItemResolved, type TextbookAnswerRecord } from './textbook'
import type { TextbookItem, TextbookReadingBlock } from './textbookSchema'

const item: TextbookItem = { id: 'answer-a', label: '式', prompt: '式を作る', answer: '2x+2y', acceptedAnswers: ['2y+2x'], answerType: 'formula', choices: ['2x+2y', 'xy'], scaffoldLevel: 'strong', hints: [] }
const blocks: TextbookReadingBlock[] = [
  { id: 'given', type: 'paragraph', parts: [{ type: 'text', text: '周は40 cm。' }] },
  { id: 'source', type: 'formula', parts: [{ type: 'choice', itemId: item.id }, { type: 'math', latex: '=40' }] },
  { id: 'current', type: 'heading', text: '横を縦で表す' },
]
const record = (value: string): TextbookAnswerRecord => ({ itemId: item.id, value, resolved: true, isFirstCorrect: true, attemptCount: 1, firstAnsweredAt: 1, lastAnsweredAt: 1 })
const records = (answer?: TextbookAnswerRecord) => ({ itemIds: (block: TextbookReadingBlock) => block.type === 'formula' ? block.parts.filter(p => p.type === 'choice').map(p => p.itemId) : [], item: () => item, answer: () => answer, resolved: isTextbookItemResolved })

describe('canonical reading source views', () => {
  it('does not prefill an unanswered source or unresolved wrong attempt from the answer key', () => {
    expect(recordedReadingSourceView('source', blocks, records(), 'ref-')).toBeUndefined()
    expect(recordedReadingSourceView('source', blocks, records({ ...record('xy'), resolved: false, isFirstCorrect: false }), 'ref-')).toBeUndefined()
    expect(blocks[1]).toEqual({ id: 'source', type: 'formula', parts: [{ type: 'choice', itemId: item.id }, { type: 'math', latex: '=40' }] })
  })
  it('renders the actual accepted stored value as typed readonly math, with a distinct view identity', () => {
    expect(recordedReadingSourceView('source', blocks, records(record('2y+2x')), 'ref-')).toEqual({ id: 'ref-source', type: 'formula', parts: [{ type: 'math', latex: '2y+2x' }, { type: 'math', latex: '=40' }] })
  })
  it('retains the previously accepted aligned-row view and rejects an absent row', () => {
    const row: TextbookReadingBlock = { id: 'array', type: 'formula', parts: [{ type: 'math', latex: '\\begin{aligned}a&=1\\\\b&=2\\end{aligned}' }] }
    expect(canonicalReadingSourceView('array#1', [row])).toEqual({ ...row, id: 'array#1', parts: [{ type: 'math', latex: 'b=2' }] })
    expect(() => canonicalReadingSourceView('array#2', [row])).toThrow('Missing source row')
  })
  it('selects the current item rather than carrying the previous item context forward', () => {
    const byItem = { first: ['given'], second: ['source'] }
    expect(selectCurrentReadingContext({ blocks, startBlockId: 'current', byItem, itemId: 'second', stageRefs: ['given'] })).toEqual(['source'])
    expect(selectCurrentReadingContext({ blocks, startBlockId: 'current', byItem, itemId: null, stageRefs: ['given'] })).toEqual([])
    expect(() => selectCurrentReadingContext({ blocks, startBlockId: 'source', stageRefs: ['current'] })).toThrow('future')
  })
})
