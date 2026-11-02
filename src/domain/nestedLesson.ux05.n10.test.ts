import { describe, expect, it } from 'vitest'
import compiled from '../data/textbook/math/numbers/n10ConstructionCompiled.json'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from './compiledNestedLesson'
import { answerNestedPart, emptyNestedLedger, projectNestedLesson, type NestedLedger } from './nestedLesson'

const lesson = nestedLessonFromCompiled(compiled as unknown as CompiledNestedLesson)
const allParts = lesson.nodes.flatMap(node => node.parts)
const part = (id: string) => allParts.find(part => part.id === id)!
function before(id: string) {
  let ledger = emptyNestedLedger(lesson, 1), sequence = 2
  while (projectNestedLesson(lesson, ledger).editable?.partId !== id) {
    const next = projectNestedLesson(lesson, ledger).editable?.partId
    if (!next) throw Error('Unreachable task: ' + id)
    ledger = answerNestedPart(lesson, ledger, next, part(next).expected, 'advance-' + sequence, sequence++)!
  }
  return ledger
}
const current = (ledger: NestedLedger, id: string) => projectNestedLesson(lesson, ledger).visible.find(entry => entry.node.nodeId === id)!
const formulas = (ledger: NestedLedger, id: string) => current(ledger, id).rows.filter(row => row.kind === 'math').map(row => row.template).join('\n')

describe('UX05 N10 meaningful applications, not repeated elementary copies', () => {
  it('asks for collecting like radicals before asking for the remaining coefficient calculation', () => {
    const id = 'n10-q10-coefficients::collectedExpressionUX05', ledger = before(id)
    expect(allParts).toHaveLength(60)
    expect(formulas(ledger, 'n10-q10-coefficients')).not.toContain('(2+5)\\sqrt2')
    const correct = answerNestedPart(lesson, ledger, id, '(2+5)\\sqrt2', 'collect', 10000)!
    expect(projectNestedLesson(lesson, correct).editable?.partId).toBe('n10-q10-coefficients::coefficient')
  })
  it('requires a concrete cancelling pair, keeping the later calculation gated for a same-sign error', () => {
    const id = 'n10-q13-identity::cancellingPairUX05', ledger = before(id)
    expect(formulas(ledger, 'n10-q13-identity')).not.toContain('-\\sqrt7\\sqrt2+\\sqrt2\\sqrt7')
    const wrong = answerNestedPart(lesson, ledger, id, 'both-positive', 'wrong-cross-pair', 10000)!
    expect(projectNestedLesson(lesson, wrong).editable?.partId).toBe(id)
    expect(projectNestedLesson(lesson, wrong).visible.some(entry => entry.node.nodeId === 'n10-13')).toBe(false)
    const correct = answerNestedPart(lesson, wrong, id, 'opposite-cross-products', 'opposite-cross-pair', 10001)!
    expect(formulas(correct, 'n10-q13-identity')).toContain('-\\sqrt7\\sqrt2+\\sqrt2\\sqrt7')
    expect(projectNestedLesson(lesson, correct).editable?.partId).toBe('n10-13::left')
    expect(part(id).choices[0].mathLines).toHaveLength(2)
    expect(current(correct, 'n10-q13-identity').rows.some(row => row.template.includes('{cancellingPairUX05}'))).toBe(false)
  })
  it('first calculates comparison squares in q20 and reuses the real result in q21 without P/Q/K re-entry', () => {
    const first = 'n10-q20-factor::positiveComparisonLeftSquareUX05', second = 'n10-q20-factor::positiveComparisonRootSquareUX05'
    const ledger = before(first)
    expect(formulas(ledger, 'n10-q20-factor')).not.toContain('2^2=4')
    expect(formulas(ledger, 'n10-q20-factor')).not.toContain('(\\sqrt3)^2=3')
    const left = answerNestedPart(lesson, ledger, first, '4', 'first-square', 10000)!
    expect(projectNestedLesson(lesson, left).editable?.partId).toBe(second)
    const both = answerNestedPart(lesson, left, second, '3', 'second-square', 10001)!
    expect(projectNestedLesson(lesson, both).editable?.partId).toBe('n10-q20-factor::factorSign')
    const expandId = 'n10-q21-expand::signedMiddleTermUX05', expand = before(expandId)
    expect(lesson.nodes.find(node => node.nodeId === 'n10-q21-expand')!.requiredResultRefs).toContain('n10-q20-factor-result')
    expect(allParts.some(p => ['n10-q21-expand::P', 'n10-q21-expand::Q', 'n10-q21-expand::K'].includes(p.id))).toBe(false)
    expect(formulas(expand, 'n10-q21-expand')).toBe('(2-\\sqrt3)^2=4{signedMiddleTermUX05}+3')
    const wrong = answerNestedPart(lesson, expand, expandId, '-2\\sqrt3', 'wrong-middle', 10000)!
    expect(projectNestedLesson(lesson, wrong).editable?.partId).toBe(expandId)
    const correct = answerNestedPart(lesson, wrong, expandId, '-4\\sqrt3', 'signed-middle', 10001)!
    expect(projectNestedLesson(lesson, correct).editable?.partId).toBe('n10-q21-constants::C')
  })
})
