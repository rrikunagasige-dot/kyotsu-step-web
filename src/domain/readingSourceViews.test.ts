import { describe, expect, it } from 'vitest'
import { canonicalReadingSourceView, recordedReadingSourceView, selectCurrentReadingContext } from './readingSourceViews'
import { isTextbookItemResolved, type TextbookAnswerRecord } from './textbook'
import type { TextbookItem, TextbookReadingBlock } from './textbookSchema'
import { webcrypto } from 'node:crypto'
import { renderToString } from 'katex'
import { qf01R3FormulaRecipe, validateQF01R3Reading } from './transformationReading'
import { mathQuadraticQF01Unit, qf01ReadingPresentation } from '../data/textbook/math/quadratic/qf01Lesson'

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

describe('QF01 R3 state-independent formula recipes', () => {
  const normal = (value: string) => value.replace(/\\text\{([^{}]*)\}/g, '$1').replaceAll('\\left', '').replaceAll('\\right', '').replaceAll('\\times', '×').replaceAll('\\cdot', '×').replaceAll('−', '-').replaceAll('²', '^2').replace(/[{}\s]/g, '')
  const source = async () => {
    Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true })
    return validateQF01R3Reading(mathQuadraticQF01Unit, qf01ReadingPresentation)
  }
  it('preserves the exact canonical notation when each approved target fills its masked owner', async () => {
    const validated = await source()
    const recipes = validated.metadata.interactions.filter(q => q.answerDomain === 'math').map(q => qf01R3FormulaRecipe(validated, q.source.blockId))
    expect(recipes).toHaveLength(27)
    expect(recipes.filter(r => r.kind === 'whole-target')).toHaveLength(10)
    for (const recipe of recipes) {
      expect(recipe.template.split('§0§')).toHaveLength(2)
      expect(normal(recipe.template.replace('§0§', recipe.targetLatex!)), recipe.interactionId!).toBe(normal(recipe.canonicalFormula))
      expect(recipe.candidateLatex).toHaveLength(validated.items.get(recipe.interactionId!)!.choices!.length)
    }
  })
  it('keeps all candidate measurement inputs independent of the answer key and leaves source data intact', async () => {
    const validated = await source(), before = JSON.stringify(mathQuadraticQF01Unit)
    const q = validated.metadata.interactions.find(q => q.id === 'qf01-n01-answer')!
    const original = qf01R3FormulaRecipe(validated, q.source.blockId)
    const items = new Map(validated.items), item = items.get(q.id)!
    items.set(q.id, { ...item, answer: 'unused answer key', choices: [...item.choices!].reverse() })
    const changed = qf01R3FormulaRecipe({ ...validated, items }, q.source.blockId)
    expect(changed.targetLatex).toBe(original.targetLatex)
    expect(changed.template).toBe(original.template)
    expect(changed.candidateLatex).toEqual([...original.candidateLatex].reverse())
    expect(JSON.stringify(mathQuadraticQF01Unit)).toBe(before)
  })
  it('compiles every candidate fragment, including conjunction and verbal restrictions, without selecting a correct result', async () => {
    const validated = await source()
    let candidates = 0
    for (const q of validated.metadata.interactions.filter(q => q.answerDomain === 'math')) {
      const recipe = qf01R3FormulaRecipe(validated, q.source.blockId)
      for (const latex of recipe.candidateLatex) {
        expect(() => renderToString(latex, { throwOnError: true, strict: 'error' }), q.id + ': ' + latex).not.toThrow()
        candidates++
      }
    }
    expect(candidates).toBe(81)
  })
  it('returns static formulas unchanged and rejects registry/nonmathematical blocks', async () => {
    const validated = await source()
    const id = validated.metadata.canonicalBlockIds.find(id => validated.blocks.get(id)?.type === 'formula' && !validated.metadata.interactions.some(q => q.source.blockId === id))!
    const recipe = qf01R3FormulaRecipe(validated, id)
    expect(recipe).toMatchObject({ kind: 'static', targetLatex: null, candidateLatex: [], interactionId: null })
    expect(recipe.template).toBe(recipe.canonicalFormula)
    expect(() => qf01R3FormulaRecipe(validated, validated.metadata.interactionRegistryBlocks[0].blockId)).toThrow('NONCANONICAL')
    expect(() => qf01R3FormulaRecipe(validated, 'qf01-r3-c0-s01-m01')).toThrow('NOT_MATH')
  })
})
