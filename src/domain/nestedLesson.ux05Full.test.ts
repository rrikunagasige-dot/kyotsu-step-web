import { describe, expect, it } from 'vitest'
import active from '../data/textbook/math/numbers/n09ConstructionCompiledR8.json'
import pilot from '../data/textbook/math/numbers/n09ConstructionCompiledR7.json'
import approved from '../../work/items/W-MATH-046-n0910-approved-nine-continuation/evidence/ux05-proposal/N09_DESIGN.json'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from './compiledNestedLesson'
import { answerNestedPart, emptyNestedLedger, projectNestedLesson, type NestedLedger } from './nestedLesson'
const lesson = nestedLessonFromCompiled(active as unknown as CompiledNestedLesson)
const old = nestedLessonFromCompiled(pilot as unknown as CompiledNestedLesson)
const node = (id: string) => lesson.nodes.find(n => n.nodeId === id)!
const part = (id: string) => lesson.nodes.flatMap(n => n.parts).find(p => p.id === id)!
let serial = 0
const answer = (ledger: NestedLedger, id: string, value = part(id).expected) => answerNestedPart(lesson, ledger, id, value, 'full-' + ++serial, 100 + serial)!
function reach(id: string) {
  let ledger = emptyNestedLedger(lesson, 0)
  for (let guard = 0; guard < 60; guard++) {
    const next = projectNestedLesson(lesson, ledger).editable?.partId
    if (next === id) return ledger
    if (!next) throw Error('unreachable ' + id)
    ledger = answer(ledger, next)
  }
  throw Error('guard ' + id)
}
const shown = (ledger: NestedLedger, id: string) => projectNestedLesson(lesson, ledger).visible.find(n => n.node.nodeId === id)!
const visibleSignature = (ledger: NestedLedger) => projectNestedLesson(lesson, ledger).visible.map(v => ({ node: v.node.nodeId, resolved: v.resolved, rows: v.rows.map(r => r.id), correct: v.parts.filter(p => p.correct).map(p => p.id) }))
describe('UX05 full N09 preserves learning decisions and the approved representative', () => {
  it('keeps the fine-approved two pilot objects and all25 KEEP nodes, including all six Q08 calculations and comparisons', () => {
    expect(lesson.toRevision).toBe(8)
    expect(lesson.nodes.flatMap(n => n.parts)).toHaveLength(43)
    const ids = ['n09-q01-negative', 'n09-01', ...approved.nodes.filter(n => n.decision === 'KEEP').map(n => n.nodeId)]
    expect(ids).toHaveLength(27)
    for (const id of ids) expect(node(id)).toEqual(old.nodes.find(n => n.nodeId === id))
    for (const [id, prefix] of [['n09-p001-q08-left-square', 'L'], ['n09-p001-q08-right-square', 'R']]) {
      for (const key of [prefix + '1', prefix + '2', prefix + '3']) expect(node(id).parts.find(p => p.key === key)).toEqual(old.nodes.find(n => n.nodeId === id)!.parts.find(p => p.key === key))
    }
    for (const id of ['n09-p001-q08-lower-sign', 'n09-p001-q08-upper-sign', 'n09-08', 'n09-09']) expect(node(id)).toEqual(old.nodes.find(n => n.nodeId === id))
  })
  it('requires each Q08 middle-term construction before its calculation, then returns from the integer numerator to the full decimal square', () => {
    for (const [id, prefix, decimal, values] of [
      ['n09-p001-q08-left-square', 'L', '1.41', ['280', '19881', '1.9881']],
      ['n09-p001-q08-right-square', 'R', '1.42', ['560', '20164', '2.0164']],
    ] as const) {
      const middle = id + '::middleTermUX05'
      let ledger = reach(middle)
      expect(shown(ledger, id).rows.some(r => r.partKeys.includes(prefix + '1'))).toBe(false)
      expect(shown(ledger, id).rows.some(r => r.template.includes('mirror:'))).toBe(false)
      expect(answerNestedPart(lesson, ledger, id + '::' + prefix + '1', values[0], 'skip-middle', 10000)).toBe(ledger)
      for (const c of part(middle).choices.filter(c => c.value !== part(middle).expected)) {
        const wrong = answer(ledger, middle, c.value)
        expect(shown(wrong, id).rows.map(r => r.id)).toEqual(shown(ledger, id).rows.map(r => r.id))
        expect(projectNestedLesson(lesson, wrong).editable?.partId).toBe(middle)
      }
      ledger = answer(ledger, middle)
      expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe(id + '::' + prefix + '1')
      expect(shown(ledger, id).rows.some(r => r.template.startsWith(decimal + '^2=\\frac'))).toBe(false)
      ledger = answer(ledger, id + '::' + prefix + '1')
      ledger = answer(ledger, id + '::' + prefix + '2')
      const returnRow = shown(ledger, id).rows.find(r => r.partKeys.includes(prefix + '3'))!
      expect(returnRow.template).toBe(decimal + '^2=\\frac{{mirror:' + prefix + '2}}{10000}={' + prefix + '3}')
      expect(returnRow.requiresCorrectKeys).toEqual(['middleTermUX05', prefix + '1', prefix + '2'])
      expect(shown(ledger, id).parts.find(p => p.key === prefix + '2')).toMatchObject({ correct: true, value: values[1] })
      expect(projectNestedLesson(lesson, ledger).visible.some(v => v.node.nodeId === 'n09-08')).toBe(false)
      ledger = answer(ledger, id + '::' + prefix + '3')
      expect(shown(ledger, id).resolved).toBe(true)
    }
  })
  it('uses the already certified signed square as a real q03 prerequisite without inventing a new answer', () => {
    const reference = node('n09-q03-inside')
    expect(reference.parts).toEqual([])
    expect(reference.prerequisiteNodeIds).toContain('n09-q01-negative')
    expect(reference.requiredResultRefs).toContain('n09-q01-negative-result')
    expect(active.nodeDesign.find(n => n.nodeId === reference.nodeId)!.rows.every(r => r.certifiedFrom.includes('n09-q01-negative-result'))).toBe(true)
    const ledger = reach('n09-03::value')
    expect(shown(ledger, reference.nodeId).resolved).toBe(true)
    expect(ledger.parents[reference.nodeId]).toBeUndefined()
    expect(Object.keys(ledger.records).some(id => id.startsWith(reference.nodeId + '::'))).toBe(false)
    expect(ledger.records['n09-q01-negative::value'].value).toBe('16')
    const missingProof = { ...lesson, nodes: lesson.nodes.map(n => n.nodeId === reference.nodeId ? { ...n, requiredResultRefs: [...n.requiredResultRefs, 'uncertified-result'] } : n) }
    expect(projectNestedLesson(missingProof, ledger).visible.some(n => n.node.nodeId === reference.nodeId)).toBe(false)
  })
  it('keeps the signed square, difference sign, absolute-value application and expansion as gated whole judgments', () => {
    const signed = 'n09-q02-negative-square::signedRootSquareUX05'
    let ledger = reach(signed)
    expect(projectNestedLesson(lesson, ledger).visible.some(n => n.node.nodeId === 'n09-02')).toBe(false)
    for (const c of part(signed).choices.filter(c => c.value !== part(signed).expected)) expect(projectNestedLesson(lesson, answer(ledger, signed, c.value)).editable?.partId).toBe(signed)
    const sign = 'n09-06::differenceRelationUX05', absolute = 'n09-q07-negation::absoluteExpressionUX05', expanded = 'n09-07::expandedExpressionUX05'
    ledger = reach(sign)
    expect(answerNestedPart(lesson, ledger, absolute, part(absolute).expected, 'skip-sign', 10000)).toBe(ledger)
    ledger = answer(ledger, sign)
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe(absolute)
    expect(projectNestedLesson(lesson, ledger).visible.some(n => n.node.nodeId === 'n09-07')).toBe(false)
    ledger = answer(ledger, absolute)
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe(expanded)
    expect(shown(ledger, 'n09-07').rows.some(r => r.template.includes('=-2+'))).toBe(false)
    ledger = answer(ledger, expanded)
    expect(shown(ledger, 'n09-07').rows.some(r => r.template.includes('=-2+'))).toBe(true)
    expect(node('n09-07').partOrder).toEqual(['expandedExpressionUX05'])
  })
  it('requires rejecting the truncation candidate and constructs each remainder before exposing its bound', () => {
    let ledger = reach('n09-q10-reject-truncation::value')
    expect(shown(ledger, 'n09-q10-reject-truncation').rows.some(r => r.partKeys.includes('candidateValidityUX05'))).toBe(false)
    ledger = answer(ledger, 'n09-q10-reject-truncation::value')
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe('n09-q10-reject-truncation::candidateValidityUX05')
    expect(projectNestedLesson(lesson, ledger).visible.some(v => v.node.nodeId === 'n09-10')).toBe(false)
    ledger = answer(ledger, 'n09-q10-reject-truncation::candidateValidityUX05')
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe('n09-10::n')
    for (const sign of ['positive', 'negative']) {
      const id = 'n09-q14-' + sign + '-remainder', remainder = id + '::remainderExpressionUX05'
      ledger = reach(remainder)
      expect(shown(ledger, id).rows).toHaveLength(2) // Generic r=x−n and one unsolved expression.
      for (const c of part(remainder).choices.filter(c => c.value !== part(remainder).expected)) {
        const wrong = answer(ledger, remainder, c.value)
        expect(shown(wrong, id).rows).toHaveLength(2)
        expect(shown(wrong, id).node.terminalRecord).toBeUndefined()
      }
      ledger = answer(ledger, remainder)
      expect(shown(ledger, id).resolved).toBe(true)
      expect(shown(ledger, id).rows.some(r => r.template.startsWith('0<') || r.template.includes('\\Rightarrow\\ 0<'))).toBe(true)
    }
  })
  it('completes all43 decisions and tests every wrong choice without revealing a future row or certifying another step', () => {
    let ledger = emptyNestedLedger(lesson, 0), count = 0, wrongs = 0
    while (!projectNestedLesson(lesson, ledger).completed) {
      const id = projectNestedLesson(lesson, ledger).editable!.partId, p = part(id), baseline = visibleSignature(ledger)
      for (const c of p.choices.filter(c => c.value !== p.expected)) {
        const wrong = answer(ledger, id, c.value)
        expect(projectNestedLesson(lesson, wrong).editable?.partId).toBe(id)
        expect(visibleSignature(wrong)).toEqual(baseline)
        expect(shown(wrong, id.split('::')[0]).parts.find(p => p.id === id)?.visibleFeedback).toBe(c.feedback)
        wrongs++
      }
      ledger = answer(ledger, id); count++
      expect(count).toBeLessThanOrEqual(43)
    }
    expect(count).toBe(43)
    expect(wrongs).toBe(96)
    expect(Object.keys(ledger.records)).toHaveLength(43)
    expect(projectNestedLesson(lesson, ledger).visible.every(v => v.resolved)).toBe(true)
  })
})
