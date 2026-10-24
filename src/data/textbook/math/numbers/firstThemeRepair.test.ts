import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import katex from 'katex'
import { mathTextbookUnits } from '../index'
import { isFirstThemeUnit, partitionFirstThemeReadingFlow, requiredFirstThemeContext } from '../presentation'
import { answerTextbookItem, effectiveTextbookProgress, textbookUnitProgress, type TextbookUnitProgress } from '../../../../domain/textbook'
import { normalizeTextbookMath } from '../../../../domain/textbookMath'
import repairs from './firstThemeRepair.json'
const baseline = JSON.parse(readFileSync('work/items/W-MATH-027-first-theme-repair/baseline.json','utf8')) as Record<string,{unitHash:string;revision:number;itemHashes:Record<string,string>}>
const hash = (value:unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex')
const units = mathTextbookUnits.filter(u => isFirstThemeUnit(u.unitId))
describe('2026-10-24 current first-theme edition', () => {
  it('protects every original answer, hint, figure contract and every out-of-scope unit', () => {
    expect(units).toHaveLength(7)
    for (const unit of mathTextbookUnits) {
      const previous = baseline[unit.unitId]
      if (!previous) continue
      if (!isFirstThemeUnit(unit.unitId)) expect(hash(unit),unit.unitId).toBe(previous.unitHash)
      for (const item of unit.sections.flatMap(s => s.items)) {
        if (previous.itemHashes[item.id]) expect(hash(item),item.id).toBe(previous.itemHashes[item.id])
      }
    }
  })
  it.each(units)('$unitId has a complete ordered semantic partition and only earlier prerequisites', unit => {
    const flow = unit.sections[0].readingFlow
    const stages = partitionFirstThemeReadingFlow(unit.unitId,flow)!
    expect(stages.flatMap(s => s.blocks)).toEqual(flow)
    for (const stage of stages) expect(() => requiredFirstThemeContext(stage,flow)).not.toThrow()
    const ids = flow.flatMap(b => b.type === 'formula' || b.type === 'paragraph' ? b.parts.filter(p => p.type === 'choice').map(p => p.itemId) : [])
    expect(ids).toEqual(unit.sections[0].items.map(q => q.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('renders every inserted expression and all distractors without malformed math', () => {
    for (const [prefix,nodes] of Object.entries(repairs)) {
      const unit = units.find(u => u.unitId.endsWith('-'+prefix))!
      for (const node of nodes) {
        const item = unit.sections[0].items.find(q => q.id === node.id)!
        expect(item.hints.length).toBeGreaterThan(0)
        expect(new Set(item.choices).size).toBe(4)
        if (node.stem) expect(() => katex.renderToString(normalizeTextbookMath(node.stem),{throwOnError:true,strict:'ignore'}),node.id).not.toThrow()
        if (item.answerType === 'formula') for (const choice of item.choices!) expect(() => katex.renderToString(normalizeTextbookMath(choice),{throwOnError:true,strict:'ignore'}),node.id).not.toThrow()
      }
    }
  })
  it.each(units.filter(u => u.unitId !== 'math-numbers-expressions-n01'))('$unitId preserves history but requires the newly added decisions', unit => {
    const previous = baseline[unit.unitId]
    const old: TextbookUnitProgress = {unitId:unit.unitId,unitRevision:previous.revision,startedAt:1,updatedAt:2,completedAt:3,
      answers:Object.fromEntries(unit.sections[0].items.filter(q => !q.id.includes('-bridge-')).map(q => [q.id,{itemId:q.id,value:q.answer,resolved:true,isFirstCorrect:true,attemptCount:2,firstAnsweredAt:1,lastAnsweredAt:2}]))}
    const migrated = effectiveTextbookProgress(unit,old)!
    expect(migrated.answers).toEqual(old.answers)
    expect(migrated.completedAt).toBeUndefined()
    expect(migrated.archivedRevisions?.[String(old.unitRevision)].answers).toEqual(old.answers)
    const added = unit.sections[0].items.filter(q => q.id.includes('-bridge-'))
    expect(added.length).toBeGreaterThan(0)
    let progress = migrated
    for (const item of added) {
      const wrong = item.choices!.find(c => c !== item.answer)!
      const before = textbookUnitProgress(unit,progress).completed
      progress = answerTextbookItem(progress,unit,item,wrong,4)
      expect(textbookUnitProgress(unit,progress).completed).toBe(before)
      progress = answerTextbookItem(progress,unit,item,item.answer,5)
    }
    expect(textbookUnitProgress(unit,progress).completed).toBe(unit.sections[0].items.length)
  })
})
