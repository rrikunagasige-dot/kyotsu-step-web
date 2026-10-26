import { describe, expect, it } from 'vitest'
import katex from 'katex'
import r4 from '../data/textbook/math/numbers/n08Authored.json'
import r5 from '../data/textbook/math/numbers/n08Revision5.json'
import r6 from '../data/textbook/math/numbers/n08Revision6.json'
import presentationJson from '../data/textbook/math/numbers/n08ConstructionPresentation.json'
import { validateTextbookUnits } from './textbookSchema'
import { answerTextbookConstruction, answerTextbookItem, effectiveTextbookProgress, textbookUnitProgress, textbookSectionProgress, resetTextbookUnitProgress, type TextbookUnitProgress } from './textbook'
import { selectConstructionPart, gradeConstructionDraft } from './constructionProgress'
import { projectConstructionInteraction, projectConstructionGroup, type ConstructionPresentation } from './constructionReading'
// @ts-expect-error The authoring-only Node module is deliberately outside browser imports.
import { projectConstruction } from '../../tools/textbook/interaction/construction.mjs'
const unit = validateTextbookUnits([r6.unit])[0], old5 = validateTextbookUnits([r5.unit])[0], old4 = validateTextbookUnits([r4.unit])[0], p = presentationJson as unknown as ConstructionPresentation
const allOld = (u = old5) => u.sections.flatMap(s => s.items).reduce<TextbookUnitProgress | undefined>((progress, item, index) => answerTextbookItem(progress, u, item, item.answer, 100 + index), undefined)!
const i = (node: string) => unit.constructionItems!.find(i => i.sourceNodeId === node)!
const fillNew = (progress: TextbookUnitProgress | undefined) => unit.constructionItems!.reduce((current, parent) => parent.parts.reduce((cur, part, index) => answerTextbookConstruction(cur, unit, parent.id, part.id, part.expected, parent.id + '-' + index, 1000 + index), current), progress)!

describe('N08 construction progress', () => {
  it('validates 22 unchanged items, 11 construction parents, 15 parts and 33 required parents', () => {
    expect(unit.sections.flatMap(s => s.items)).toHaveLength(22)
    expect(unit.constructionItems).toHaveLength(11)
    expect(unit.constructionItems!.flatMap(c => c.parts)).toHaveLength(15)
    expect(unit.requiredInteractionRefs).toHaveLength(33)
    const bad = structuredClone(r6.unit); delete (bad as { requiredInteractionRefs?: string[] }).requiredInteractionRefs
    expect(() => validateTextbookUnits([bad])).toThrow()
  })
  it('archives all 34 old answer records without fabricating any new part record', () => {
    const prior = allOld(), migrated = effectiveTextbookProgress(unit, prior)!
    expect(Object.keys(migrated.archivedRevisions!['5'].answers)).toHaveLength(34)
    expect(migrated.archivedRevisions!['5'].answers).toEqual(prior.answers)
    expect(migrated.archivedRevisions!['5'].completedAt).toBe(prior.completedAt)
    expect(Object.keys(migrated.answers)).toHaveLength(22)
    expect(migrated.constructionProgress).toEqual({})
    expect(migrated.completedAt).toBeUndefined()
    expect(textbookUnitProgress(unit, migrated)).toMatchObject({ completed: 22, total: 33 })
    expect(textbookSectionProgress(unit, migrated, 'lesson')).toEqual({ completed: 22, total: 33 })
  })
  it('runs the existing r4 to r5 migration before entering r6', () => {
    const prior = allOld(old4), migrated = effectiveTextbookProgress(unit, prior)!
    expect(migrated.archivedRevisions!['4'].answers).toEqual(prior.answers)
    expect(migrated.archivedRevisions!['5'].unitRevision).toBe(5)
    expect(migrated.archivedRevisions!['5'].answers).toEqual(prior.answers)
    expect(migrated.constructionProgress).toEqual({})
  })
  it('partial selections are durable drafts, not submissions; event IDs deduplicate', () => {
    const parent = i('n08-r5-q02-distance'), [a, b] = parent.parts
    const first = selectConstructionPart(parent, undefined, a.id, a.expected, 'event1', 1)!
    expect(first.attemptCount).toBe(0); expect(first.resolved).toBe(false)
    const reloaded = JSON.parse(JSON.stringify(first))
    expect(selectConstructionPart(parent, reloaded, a.id, a.expected, 'event1', 2)).toBe(reloaded)
    const wrong = selectConstructionPart(parent, reloaded, b.id, b.choices.find(c => c.value !== b.expected)!.value, 'event2', 3)!
    expect(wrong.attemptCount).toBe(1); expect(wrong.resolved).toBe(false); expect(wrong.isFirstCorrect).toBe(false)
    const done = selectConstructionPart(parent, wrong, b.id, b.expected, 'event3', 4)!
    expect(done.attemptCount).toBe(2); expect(done.resolved).toBe(true); expect(done.isFirstCorrect).toBe(false)
    expect(done.partRecords[b.id].firstValue).toBe(wrong.draft[b.id])
    expect(done.firstSubmittedValues).toEqual(wrong.draft)
  })
  it('answering an ordinary item cannot erase partial construction progress', () => {
    const parent = i('n08-r5-q02-distance'), part = parent.parts[0]
    const partial = answerTextbookConstruction(undefined, unit, parent.id, part.id, part.expected, 'partial', 1)!
    const item = unit.sections[0].items[0], next = answerTextbookItem(partial, unit, item, item.answer, 2)
    expect(next.constructionProgress).toEqual(partial.constructionProgress)
    expect(next.completedAt).toBeUndefined()
  })
  it('requires all 33 parents to complete; rollback and return preserve parts, attempts and archives', () => {
    const original = allOld(), migrated = effectiveTextbookProgress(unit, original)!, done = fillNew(migrated)
    expect(textbookUnitProgress(unit, done)).toEqual({ completed: 33, total: 33, percent: 100 })
    expect(done.completedAt).toBeDefined(); expect(done.answers).toEqual(migrated.answers)
    const back5 = effectiveTextbookProgress(old5, done)!, return6 = effectiveTextbookProgress(unit, back5)!
    expect(back5.answers).toEqual(original.answers)
    expect(return6.constructionProgress).toEqual(done.constructionProgress)
    expect(return6.completedAt).toBe(done.completedAt)
    const back4 = effectiveTextbookProgress(old4, done)!, returnFrom4 = effectiveTextbookProgress(unit, back4)!
    expect(back4.unitRevision).toBe(4); expect(returnFrom4.constructionProgress).toEqual(done.constructionProgress)
  })
  it('reset retains all old archives and the previous r6 attempts as history', () => {
    const done = fillNew(effectiveTextbookProgress(unit, allOld())), reset = resetTextbookUnitProgress(unit, done, 9000)!
    expect(reset.answers).toEqual({}); expect(reset.constructionProgress).toEqual({})
    expect(reset.archivedRevisions!['5']).toEqual(done.archivedRevisions!['5'])
    expect(reset.archivedRevisions!['6-reset-9000'].constructionProgress).toEqual(done.constructionProgress)
  })
  it('r6 reset remains empty after r5/r4 comparison and return, despite an old completed r5 archive', () => {
    const done = fillNew(effectiveTextbookProgress(unit, allOld())), reset = resetTextbookUnitProgress(unit, done, 9000)!
    for (const old of [old5, old4]) {
      const comparison = effectiveTextbookProgress(old, reset)!, returned = effectiveTextbookProgress(unit, comparison)!
      expect(returned.answers).toEqual({}); expect(returned.constructionProgress).toEqual({})
      expect(returned.completedAt).toBeUndefined(); expect(textbookUnitProgress(unit, returned)).toEqual({ completed: 0, total: 33, percent: 0 })
      expect(returned.archivedRevisions!['6-reset-9000'].constructionProgress).toEqual(done.constructionProgress)
    }
  })
  it('rejects an unknown part/choice and keeps requested ordering separate from numerical equality', () => {
    const parent = i('n08-07')
    expect(selectConstructionPart(parent, undefined, 'unknown', '3', 'x', 1)).toBeUndefined()
    expect(selectConstructionPart(parent, undefined, parent.parts[0].id, 'not-a-choice', 'x', 1)).toBeUndefined()
    expect(gradeConstructionDraft(parent, { [parent.parts[0].id]: '-\\sqrt5' })).toMatchObject({ complete: true, correct: false, reason: 'SPECIFIED_ORDER_MISMATCH' })
  })
})

describe('browser/authoring projection parity', () => {
  it('renders all 33 finite candidate combinations identically and keeps wrong slots editable', () => {
    let count = 0
    for (const parent of unit.constructionItems!) {
      const drafts = parent.parts.reduce<Record<string, string>[]>((rows, part) => rows.flatMap(draft => part.choices.map(c => ({ ...draft, [part.id]: c.value }))), [{}])
      for (const draft of [{}, ...drafts]) {
        for (const editableParts of [false, true]) {
          const node = projectConstruction(parent, draft, { editableParts }).formula, browser = projectConstructionInteraction(parent, draft, { editableParts }).formula
          expect(browser).toEqual({ left: node.left, relation: node.relation, right: node.right })
          const check = (parts: typeof browser.left) => { for (const part of parts) { if (part.type === 'math') expect(() => katex.renderToString(part.latex, { throwOnError: true })).not.toThrow(); if (part.type === 'fraction') { check(part.numerator); check(part.denominator) } } }
          check(browser.left); check(browser.right)
          if (editableParts) expect([...browser.left, ...browser.right].filter(p => p.type === 'slot')).toHaveLength(parent.parts.length)
        }
        if (Object.keys(draft).length) count++
      }
    }
    expect(count).toBe(33)
    const double = projectConstructionInteraction(i('n08-04')).formula.left.map(p => p.type === 'math' ? p.latex : '').join('')
    expect(double).toBe('-(-5)')
    const square = projectConstructionInteraction(i('n08-q12-negative')).formula.left.map(p => p.type === 'math' ? p.latex : '').join('')
    expect(square).toBe('(-a)(-a)')
  })
  it('keeps four-row completion, three-row partial, first-row number and legacy relation holes', () => {
    const g = p.groups.find(g => g.stageIds.includes('n08-stage-07'))!, bracket = i('n08-q07-bracket'), distribute = i('n08-q07-distribute'), order = i('n08-07')
    const boundary = ['n08-q07-rule'], initial = projectConstructionGroup(p, g.id, { solvedIds: [], boundarySolvedNodeIds: boundary })
    expect(initial.rows).toHaveLength(1); expect(initial.layout.numberRowRef).toBe(initial.rows[0].id)
    const partial = projectConstructionGroup(p, g.id, { solvedIds: [bracket.id], boundarySolvedNodeIds: boundary, drafts: { [distribute.id]: { [distribute.parts[0].id]: '-' } } })
    expect(partial.rows).toHaveLength(3)
    const done = projectConstructionGroup(p, g.id, { solvedIds: [bracket.id, distribute.id, order.id], boundarySolvedNodeIds: boundary })
    expect(done.rows).toHaveLength(4); expect(done.layout.prose.filter(s => s.role === 'essential-note')).toHaveLength(1); expect(done.layout.prose.some(s => s.role === 'active-prompt')).toBe(false)
    const pi = p.groups.find(g => g.stageIds.includes('n08-stage-08'))!, shown = projectConstructionGroup(p, pi.id, { solvedIds: [] })
    expect(shown.rows[0].formula.relationSlot?.type).toBe('slot')
  })
})
