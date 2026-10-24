import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { renderToStaticMarkup } from 'react-dom/server'
import { TextbookFormula } from '../../../../components/textbook/TextbookFormula'
import { mathTextbookUnits } from '../index'
import { firstSectionTeachingPlans, type SectionTeachingPlan } from './firstSectionTeaching'
import { firstThemeSourceView, firstThemeRecordedResults, partitionFirstThemeReadingFlow, requiredFirstThemeContext } from '../presentation'
import { answerTextbookItem, effectiveTextbookProgress, isTextbookItemResolved, type TextbookUnitProgress } from '../../../../domain/textbook'
import type { TextbookReadingBlock, TextbookUnit } from '../../../../domain/textbookSchema'
import { firstThemeFormulaRows } from '../../../../components/textbook/formulaWrap'

const previousPlans = JSON.parse(readFileSync('work/items/W-MATH-030-section-one-results-and-blanks/BASELINE_PLANS.json', 'utf8')) as Record<string, SectionTeachingPlan>
const original = JSON.parse(readFileSync('work/items/W-MATH-029-section-one-teaching/BASELINE.json', 'utf8')) as Record<string, TextbookUnit>
const ledger = JSON.parse(readFileSync('work/items/W-MATH-030-section-one-results-and-blanks/IMPLEMENTATION_LEDGER.json', 'utf8')) as { unit: string; design: string; itemId: string; blockId: string; replaces: string | null }[]
const choices = (blocks: readonly TextbookReadingBlock[]) => blocks.flatMap(b => b.type === 'formula' || b.type === 'paragraph' ? b.parts.flatMap(p => p.type === 'choice' ? [p.itemId] : []) : [])

describe('P-003 first section: active derivation and retained results', () => {
  it('implements every approved decision once, preserving all original explanatory prose', () => {
    expect(ledger).toHaveLength(46)
    for (const [key, plan] of Object.entries(firstSectionTeachingPlans)) {
      const old = previousPlans[key]
      expect(plan.stages).toHaveLength(old.stages.length)
      for (const entry of ledger.filter(e => e.unit === key)) {
        expect(choices(plan.readingFlow).filter(id => id === entry.itemId), entry.design).toHaveLength(1)
        expect(plan.readingFlow.find(b => b.id === entry.blockId)).toBeDefined()
      }
      for (const block of old.readingFlow.filter(b => b.type === 'paragraph')) {
        const current = plan.readingFlow.find(b => b.id === block.id)
        expect(current?.type, block.id).toBe('paragraph')
        expect(current && 'parts' in current ? current.parts.filter(p => p.type !== 'choice') : [], block.id).toEqual('parts' in block ? block.parts.filter(p => p.type !== 'choice') : [])
      }
      expect(Object.keys(plan.resultBlockIdsByStage!)).toHaveLength(plan.stages.length)
    }
    expect(Object.values(firstSectionTeachingPlans).reduce((n, p) => n + choices(p.readingFlow).length, 0)).toBe(291)
  })

  it.each(Object.keys(previousPlans))('%s references only earlier source steps, and records only its own stage', key => {
    const plan = firstSectionTeachingPlans[key]
    const stages = partitionFirstThemeReadingFlow('math-numbers-expressions-' + key, plan.readingFlow)!
    const positions = new Map(plan.readingFlow.map((b, i) => [b.id, i]))
    for (const stage of stages) {
      for (const ref of firstThemeRecordedResults(stage, plan.readingFlow)) expect(stage.blocks.some(b => b.id === ref)).toBe(true)
      for (const block of stage.blocks) for (const id of choices([block])) {
        for (const ref of requiredFirstThemeContext(stage, plan.readingFlow, id)) {
          expect(positions.get(ref.split('#')[0])!, id + ' / ' + ref).toBeLessThan(positions.get(block.id)!)
          const source = firstThemeSourceView(ref, plan.readingFlow)!
          expect(source).toBeDefined()
          if (source.type === 'formula') for (const p of source.parts) if (p.type === 'math') expect(() => katex.renderToString(p.latex, { throwOnError: true })).not.toThrow()
          expect(choices([source])).not.toContain(id)
        }
      }
      expect(requiredFirstThemeContext(stage, plan.readingFlow, null)).toEqual([])
    }
  })

  it.each(Object.keys(previousPlans))('%s preserves completed S4 attempts and reopens new/replaced decisions', key => {
    const unit = mathTextbookUnits.find(u => u.unitId === 'math-numbers-expressions-' + key)!
    const old = previousPlans[key]
    const all = [...original[unit.unitId].sections[0].items, ...old.newItems]
    const before: TextbookUnit = { ...unit, revision: unit.revision - 1, sections: [{ ...unit.sections[0], readingFlow: old.readingFlow, items: choices(old.readingFlow).map(id => all.find(q => q.id === id)!) }] }
    const progress: TextbookUnitProgress = { unitId: unit.unitId, unitRevision: before.revision, startedAt: 1, updatedAt: 2, completedAt: 3, answers: Object.fromEntries(before.sections[0].items.map(q => [q.id, { itemId: q.id, value: q.answer, resolved: true, attemptCount: 1, isFirstCorrect: true, firstAnsweredAt: 1, lastAnsweredAt: 2 }])) }
    let current = effectiveTextbookProgress(unit, progress)!
    expect(current.archivedRevisions![String(before.revision)].answers).toEqual(progress.answers)
    expect(current.completedAt).toBeUndefined()
    for (const q of unit.sections[0].items) {
      if (progress.answers[q.id]) expect(current.answers[q.id]).toEqual(progress.answers[q.id])
      else {
        expect(current.answers[q.id]).toBeUndefined()
        current = answerTextbookItem(current, unit, q, q.choices!.find(c => c !== q.answer)!, 4)
        expect(isTextbookItemResolved(q, current.answers[q.id])).toBe(false)
        current = answerTextbookItem(current, unit, q, q.answer, 5)
        expect(isTextbookItemResolved(q, current.answers[q.id])).toBe(true)
      }
    }
  })

  it('selects B and the applicable index law from their actual canonical rows', () => {
    const b = firstThemeSourceView('formula-ab-definition#1', firstSectionTeachingPlans.n02.readingFlow)!
    expect(JSON.stringify(b)).toContain('B=-x^3+2x^2+2')
    expect(JSON.stringify(b)).not.toContain('A=')
    const law = firstThemeSourceView('n03-s4-rules-summary#1', firstSectionTeachingPlans.n03.readingFlow)!
    expect(JSON.stringify(law)).toContain('(a^m)^n=a^{mn}')
    expect(JSON.stringify(law)).not.toContain('a^{m+n}')
  })

  it('keeps a parenthesized constant together and separates relations into aligned rows', () => {
    const block: Extract<TextbookReadingBlock, { type: 'formula' }> = { id: 'sample', type: 'formula', parts: [{ type: 'math', latex: 'x^2+2xy+y^2-3x-3y+2=x^2+(2y-3)x+(y^2-3y+2)' }] }
    const rows = firstThemeFormulaRows(block)
    expect(rows.map(r => r.relation)).toEqual(['', '='])
    expect(rows[1].chunks).toContain('+(y^2-3y+2)')
    expect(rows.flatMap(r => r.chunks)).not.toContain('+2)')
    expect(firstThemeFormulaRows({ ...block, parts: [{ type: 'math', latex: 'T=a+b\\qquad X=x+2y' }] }).map(r => r.relation)).toEqual(['', '=', '', '='])
  })

  it('renders every current formula before and after answers without breaking mathematical tokens', () => {
    for (const unit of mathTextbookUnits.filter(u => Object.hasOwn(firstSectionTeachingPlans, u.unitId.split('-').at(-1)!))) {
      const section = unit.sections[0]
      const progress: TextbookUnitProgress = { unitId: unit.unitId, unitRevision: unit.revision, startedAt: 1, updatedAt: 2, answers: Object.fromEntries(section.items.map(q => [q.id, { itemId: q.id, value: q.answer, resolved: true, attemptCount: 1, isFirstCorrect: true, firstAnsweredAt: 1, lastAnsweredAt: 2 }])) }
      for (const block of section.readingFlow) if (block.type === 'formula') {
        for (const attempt of [undefined, progress]) {
          const html = renderToStaticMarkup(<TextbookFormula block={block} section={section} progress={attempt} unitId={unit.unitId} onOpen={() => {}} />)
          expect(html, block.id).not.toContain('katex-error')
          expect(html, block.id).not.toContain('§')
          for (const id of choices([block])) expect(html.match(new RegExp('data-testid="' + (attempt ? 'resolved-' : 'textbook-item-') + id + '"', 'g')), id).toHaveLength(1)
        }
      }
    }
  })
})
