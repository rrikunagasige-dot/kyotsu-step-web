import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { describe, it, expect } from 'vitest'
import { answerNestedPart, projectNestedLesson, resetNestedLedger, type NestedLesson, type NestedLedger } from './nestedLesson'
import { compileNestedMathTemplate } from '../components/textbook/nestedMathTemplate'
import n09Compiled from '../data/textbook/math/numbers/n09ConstructionCompiled.json'
import n10Compiled from '../data/textbook/math/numbers/n10ConstructionCompiled.json'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from './compiledNestedLesson'

// An explicit candidate path permits the same audit before and after Work storage.
const bytes = readFileSync(resolve(process.env.N0910_DESIGN_PATH ?? 'work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json'))
const design = JSON.parse(bytes.toString())
const compiledHash = createHash('sha256').update(bytes).digest('hex')

describe('materialized N09/N10 candidate, not hosted reader acceptance', () => {
  for (const unit of design.units) {
    const lesson: NestedLesson = { ...unit, compiledHash }
    it(unit.code + ': every authored math row compiles in empty and completed states', () => {
      for (const node of lesson.nodes) for (const row of node.rows.filter(r => r.kind === 'math')) {
        const parts = node.parts.filter(p => row.partKeys.includes(p.key) || row.template.includes('{mirror:' + p.key + '}'))
        const values = Object.fromEntries(node.parts.map(p => [p.key, p.expected]))
        expect(() => compileNestedMathTemplate({ template: row.template, parts, values, certifiedKeys: node.partOrder })).not.toThrow()
        if (!row.requiresCorrectKeys.length) expect(() => compileNestedMathTemplate({ template: row.template, parts })).not.toThrow()
      }
    })
    it(unit.code + ': all parts reject each wrong choice and advance only on correct answers', () => {
      let ledger: NestedLedger | undefined
      let event = 0
      for (const node of lesson.nodes) for (const key of node.partOrder) {
        const part = node.parts.find(p => p.key === key)!
        expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe(part.id)
        for (const choice of part.choices.filter(c => c.value !== part.expected)) {
          ledger = answerNestedPart(lesson, ledger, part.id, choice.value, String(++event), event)
          expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe(part.id)
        }
        ledger = answerNestedPart(lesson, ledger, part.id, part.expected, String(++event), event)
      }
      expect(projectNestedLesson(lesson, ledger).completed).toBe(true)
      expect(projectNestedLesson(lesson, ledger).certifiedNodeIds).toHaveLength(lesson.nodes.length)
    })
  }
  it('rationalization requires the new justification after choosing the factor', () => {
    const unit = design.units.find((u: { code: string }) => u.code === 'N10')
    const lesson: NestedLesson = { ...unit, compiledHash }
    const target = lesson.nodes.find(n => n.nodeId === 'n10-q20-factor')!
    const factor = target.parts.find(p => p.key === 'factor')!
    const reason = target.parts.find(p => p.key === 'reason')!
    const factorSign = target.parts.find(p => p.key === 'factorSign')!
    let ledger: NestedLedger | undefined
    let event = 0
    while (projectNestedLesson(lesson, ledger).editable?.partId !== factor.id) {
      const id = projectNestedLesson(lesson, ledger).editable!.partId
      const part = lesson.nodes.flatMap(n => n.parts).find(p => p.id === id)!
      ledger = answerNestedPart(lesson, ledger, part.id, part.expected, String(++event), event)
    }
    expect(answerNestedPart(lesson, ledger, reason.id, reason.expected, 'premature', event)).toBe(ledger)
    expect(ledger!.records[reason.id]).toBeUndefined()
    ledger = answerNestedPart(lesson, ledger, factor.id, factor.expected, String(++event), event)
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe(factorSign.id)
    expect(answerNestedPart(lesson, ledger, reason.id, reason.expected, 'before-sign', event)).toBe(ledger)
    ledger = answerNestedPart(lesson, ledger, factorSign.id, factorSign.expected, String(++event), event)
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe(reason.id)
    expect(ledger!.parents[target.nodeId]).toBeUndefined()
    const wrong = reason.choices.find(c => c.value !== reason.expected)!
    ledger = answerNestedPart(lesson, ledger, reason.id, wrong.value, String(++event), event)
    expect(projectNestedLesson(lesson, ledger).certifiedNodeIds).not.toContain(target.nodeId)
    ledger = answerNestedPart(lesson, ledger, reason.id, reason.expected, String(++event), event)
    expect(projectNestedLesson(lesson, ledger).certifiedNodeIds).toContain(target.nodeId)
    expect(ledger!.parents[target.nodeId].isFirstCorrect).toBe(false)
  })
})


describe('UX-03 completed scaffold replacement, independent projection regressions', () => {
  const compiled = { N09: n09Compiled, N10: n10Compiled } as unknown as Record<string, CompiledNestedLesson>
  const cases = [
    ['N09', 'n09-06', 'addend', 'zero'],
    ['N10', 'n10-07', 'squareFactor', 'factor'],
    ['N10', 'n10-q09-left', 'squareFactor', 'coefficient'],
    ['N10', 'n10-q09-right', 'squareFactor', 'coefficient'],
  ] as const
  function reach(lesson: NestedLesson, partId: string, initial = resetNestedLedger(lesson, 0)) {
    let ledger = initial, event = 0
    while (projectNestedLesson(lesson, ledger).editable?.partId !== partId) {
      const edit = projectNestedLesson(lesson, ledger).editable
      if (!edit || event > 200) throw Error('Cannot reach ' + partId)
      const part = lesson.nodes.flatMap(n => n.parts).find(p => p.id === edit.partId)!
      ledger = answerNestedPart(lesson, ledger, part.id, part.expected, 'reach-' + ++event, initial.updatedAt + event)!
    }
    return ledger
  }
  for (const [code, nodeId, hiddenKey, nextKey] of cases) {
    it(nodeId + ': retains initial and every wrong scaffold, replaces only after correct, and restores after reset', () => {
      const lesson = nestedLessonFromCompiled(compiled[code]), node = lesson.nodes.find(n => n.nodeId === nodeId)!
      const part = node.parts.find(p => p.key === hiddenKey)!, scaffold = node.rows.find(r => r.hideAfterCorrectKeys?.includes(hiddenKey))!
      expect(scaffold).toBeDefined()
      let ledger = reach(lesson, part.id), event = 500
      const view = (value = ledger) => projectNestedLesson(lesson, value).visible.find(v => v.node.nodeId === nodeId)!
      expect(view().rows.map(r => r.id)).toContain(scaffold.id)
      for (const wrong of part.choices.filter(c => c.value !== part.expected)) {
        ledger = answerNestedPart(lesson, ledger, part.id, wrong.value, 'scaffold-wrong-' + ++event, event)!
        const visible = view()
        expect(visible.rows.map(r => r.id)).toContain(scaffold.id)
        expect(visible.parts.find(p => p.id === part.id)?.visibleFeedback).toBe(wrong.feedback)
        expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe(part.id)
      }
      ledger = answerNestedPart(lesson, ledger, part.id, part.expected, 'scaffold-right-' + ++event, event)!
      const before = JSON.stringify(ledger), sourceBefore = JSON.stringify(lesson)
      expect(view().rows.map(r => r.id)).not.toContain(scaffold.id)
      expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe(nodeId + '::' + nextKey)
      expect(view().rows.some(r => r.template.includes('…'))).toBe(false)
      expect(view(JSON.parse(JSON.stringify(ledger))).rows.map(r => r.id)).not.toContain(scaffold.id)
      expect(JSON.stringify(ledger)).toBe(before)
      expect(JSON.stringify(lesson)).toBe(sourceBefore)
      const reset = resetNestedLedger(lesson, event + 1)
      expect(reset.records).toEqual({})
      expect(reset.processedEventIds).toEqual([])
      const returned = reach(lesson, part.id, reset)
      expect(view(returned).rows.map(r => r.id)).toContain(scaffold.id)
      expect(returned.records[part.id]).toBeUndefined()
    })
  }
  it('H03 keeps the certified addend PublicPart after hiding its only input row, through completion and rereading', () => {
    const lesson = nestedLessonFromCompiled(compiled.N09), nodeId = 'n09-06'
    let ledger = reach(lesson, nodeId + '::addend')
    const node = lesson.nodes.find(n => n.nodeId === nodeId)!, addend = node.parts.find(p => p.key === 'addend')!, zero = node.parts.find(p => p.key === 'zero')!
    ledger = answerNestedPart(lesson, ledger, addend.id, addend.expected, 'mirror-addend', 500)!
    const before = JSON.stringify(ledger)
    let visible = projectNestedLesson(lesson, ledger).visible.find(v => v.node.nodeId === nodeId)!
    expect(visible.rows.some(r => r.partKeys.includes('addend'))).toBe(false)
    expect(visible.rows.some(r => r.template.includes('{mirror:addend}'))).toBe(true)
    expect(visible.parts.find(p => p.key === 'addend')).toMatchObject({ value: addend.expected, correct: true, editable: false })
    expect(JSON.stringify(visible.parts)).not.toContain('expected')
    for (const row of visible.rows.filter(r => r.kind === 'math')) expect(() => compileNestedMathTemplate({ template: row.template, parts: visible.parts, values: Object.fromEntries(visible.parts.flatMap(p => p.value !== undefined ? [[p.key, p.value]] : [])), certifiedKeys: visible.parts.filter(p => p.correct).map(p => p.key) })).not.toThrow()
    expect(JSON.stringify(ledger)).toBe(before)
    ledger = answerNestedPart(lesson, ledger, zero.id, zero.expected, 'mirror-zero', 501)!
    visible = projectNestedLesson(lesson, JSON.parse(JSON.stringify(ledger))).visible.find(v => v.node.nodeId === nodeId)!
    expect(visible.resolved).toBe(true)
    expect(visible.rows.some(r => r.template.includes('…'))).toBe(false)
    expect(visible.parts.find(p => p.key === 'addend')?.value).toBe(addend.expected)
  })
  it('rejects hiding a two-part row after only its first answer, and defensively keeps it editable without compiler validation', () => {
    const fixture = structuredClone(compiled.N09)
    const node = fixture.nodeDesign.find(n => n.nodeId === 'n09-07')!
    const row = node.rows.find(r => r.partKeys.includes('left') && r.partKeys.includes('sign'))!
    row.hideAfterCorrectKeys = ['left']
    // Keep the plan projection identical so the failure specifically checks
    // the hide contract rather than merely a duplicated-plan mismatch.
    fixture.constructionPlan.nodes.find(n => n.nodeId === node.nodeId)!.rows = structuredClone(node.rows)
    expect(() => nestedLessonFromCompiled(fixture)).toThrow('NESTED_ROW_HIDE_CONTRACT')
    const rawLesson: NestedLesson = { unitId: fixture.unitId, fromRevision: fixture.fromRevision, toRevision: fixture.toRevision, compiledHash: fixture.compiledHash, nodes: fixture.nodeDesign }
    let ledger = reach(rawLesson, node.nodeId + '::left')
    const left = node.parts.find(p => p.key === 'left')!
    ledger = answerNestedPart(rawLesson, ledger, left.id, left.expected, 'defensive-left', 500)!
    expect(projectNestedLesson(rawLesson, ledger).editable?.partId).toBe(node.nodeId + '::sign')
    expect(projectNestedLesson(rawLesson, ledger).visible.find(v => v.node.nodeId === node.nodeId)!.rows.map(r => r.id)).toContain(row.id)
  })
})

describe('UX04 photo derivation does not skip independent learner operations', () => {
  const lesson = nestedLessonFromCompiled(n09Compiled as unknown as CompiledNestedLesson)
  it('requires scope and product sign before the negative square value', () => {
    let ledger = resetNestedLedger(lesson, 0)
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe('n09-q01-negative::powerAction')
    expect(answerNestedPart(lesson, ledger, 'n09-q01-negative::value', '16', 'skip', 1)).toBe(ledger)
    expect(projectNestedLesson(lesson, ledger).visible.at(-1)!.rows.some(r => r.template.includes('\\times'))).toBe(false)
    ledger = answerNestedPart(lesson, ledger, 'n09-q01-negative::powerAction', 'repeat-whole-base', 'scope', 2)!
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe('n09-q01-negative::productSign')
    expect(projectNestedLesson(lesson, ledger).visible.at(-1)!.rows.some(r => r.partKeys.includes('value'))).toBe(false)
    ledger = answerNestedPart(lesson, ledger, 'n09-q01-negative::productSign', '+', 'sign', 3)!
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe('n09-q01-negative::value')
  })
  it('zero-product OR certifies neither linear branch before its own inverse operation', () => {
    let ledger = resetNestedLedger(lesson, 0), event = 0
    for (const [partId, answer] of [
      ['n09-q01-negative::powerAction', 'repeat-whole-base'], ['n09-q01-negative::productSign', '+'], ['n09-q01-negative::value', '16'],
      ['n09-01::balanceOperation', '-'], ['n09-01::factorSign', '+'], ['n09-01::zeroLogic', 'or'],
    ]) ledger = answerNestedPart(lesson, ledger, partId, answer, 'ux04-' + ++event, event)!
    const current = () => projectNestedLesson(lesson, ledger).visible.find(n => n.node.nodeId === 'n09-01')!
    expect(current().resolved).toBe(false)
    expect(current().node.terminalRecord).toBeUndefined()
    expect(projectNestedLesson(lesson, ledger).editable?.partId).toBe('n09-01::leftInverseOperation')
    expect(current().rows.some(r => /x=4|x=-4/.test(r.template))).toBe(false)
    expect(answerNestedPart(lesson, ledger, 'n09-01::rightInverseOperation', '-', 'skip-right', 10)).toBe(ledger)
    ledger = answerNestedPart(lesson, ledger, 'n09-01::leftInverseOperation', '+', 'left', 11)!
    expect(current().resolved).toBe(false)
    expect(current().rows.some(r => r.template.includes('x=4'))).toBe(true)
    expect(current().rows.some(r => r.template.includes('x=-4'))).toBe(false)
    ledger = answerNestedPart(lesson, ledger, 'n09-01::rightInverseOperation', '-', 'right', 12)!
    expect(current().resolved).toBe(true)
  })
})
