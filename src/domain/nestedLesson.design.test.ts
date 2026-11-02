import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { describe, it, expect } from 'vitest'
import { answerNestedPart, projectNestedLesson, type NestedLesson, type NestedLedger } from './nestedLesson'
import { compileNestedMathTemplate } from '../components/textbook/nestedMathTemplate'

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
