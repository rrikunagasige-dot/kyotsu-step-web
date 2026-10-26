// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { N08ConstructionReadingFlow } from './N08ConstructionReadingFlow'
import { validateTextbookUnits } from '../../domain/textbookSchema'
import { answerTextbookConstruction, answerTextbookItem, effectiveTextbookProgress, resetTextbookUnitProgress, textbookUnitProgress, type TextbookUnitProgress } from '../../domain/textbook'
import { useAppStore } from '../../stores/useAppStore'
import data from '../../data/textbook/math/numbers/n08Revision6.json'
import old5Data from '../../data/textbook/math/numbers/n08Revision5.json'
import old4Data from '../../data/textbook/math/numbers/n08Authored.json'

const unit = validateTextbookUnits([data.unit])[0], section = unit.sections[0]
const cursorKey = 'math-textbook-compact-v1:' + unit.unitId + ':r6'
type Node = typeof data.nodes[number]
function fill(progress: TextbookUnitProgress | undefined, node: Node) {
  if (!node.interaction) return progress
  const c = unit.constructionItems!.find(c => c.id === node.interaction)
  if (c) return c.parts.reduce((p, part, i) => answerTextbookConstruction(p, unit, c.id, part.id, part.expected, c.id + '-' + i, 100 + i), progress)
  const item = section.items.find(i => i.id === node.interaction)!
  return answerTextbookItem(progress, unit, item, item.answer, 100)
}
function beforeStage(index: number) { return data.nodes.filter(n => data.stages.findIndex(s => s.id === n.stageId) < index).reduce<TextbookUnitProgress | undefined>(fill, undefined) }
function mount(progress: TextbookUnitProgress | undefined, stageIndex: number, preview = false) {
  window.localStorage.setItem(cursorKey, String(stageIndex))
  useAppStore.setState({ textbookProgress: progress ? { [unit.unitId]: progress } : {} })
  function Flow() { const live = useAppStore(s => s.textbookProgress[unit.unitId]); return <N08ConstructionReadingFlow unit={unit} section={section} progress={live} onReviewAnswer={preview ? () => undefined : undefined} /> }
  return render(<MemoryRouter><Flow /></MemoryRouter>)
}
beforeEach(() => { window.localStorage.clear(); useAppStore.setState({ textbookProgress: {}, settings: { ...useAppStore.getState().settings, language: 'ja' } }); let event = 0; vi.stubGlobal('crypto', { randomUUID: () => 'component-event-' + ++event }) })
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('N08 r6 construction reader', () => {
  it('keeps two editable coordinate slots through partial and wrong full drafts', () => {
    mount(beforeStage(1), 1)
    const parent = unit.constructionItems!.find(c => c.sourceNodeId === 'n08-r5-q02-distance')!, [right, left] = parent.parts
    fireEvent.click(screen.getByTestId('construction-part-' + right.id))
    fireEvent.click(screen.getByTestId('construction-choice-' + right.id + '-0'))
    expect(useAppStore.getState().textbookProgress[unit.unitId].constructionProgress![parent.id].attemptCount).toBe(0)
    expect(screen.getByTestId('construction-part-' + right.id)).toBeTruthy()
    expect(screen.getByTestId('construction-panel-' + left.id)).toBeTruthy()
    fireEvent.click(screen.getByTestId('construction-choice-' + left.id + '-0'))
    const wrong = useAppStore.getState().textbookProgress[unit.unitId].constructionProgress![parent.id]
    expect(wrong.resolved).toBe(false); expect(wrong.attemptCount).toBe(1)
    expect(screen.getByTestId('construction-part-' + right.id)).toBeTruthy(); expect(screen.getByTestId('construction-part-' + left.id)).toBeTruthy()
    fireEvent.click(screen.getByTestId('construction-choice-' + left.id + '-1'))
    const done = useAppStore.getState().textbookProgress[unit.unitId].constructionProgress![parent.id]
    expect(done.resolved).toBe(true); expect(done.attemptCount).toBe(2); expect(done.partRecords[left.id].firstValue).toBe('a')
    expect(screen.queryByTestId('construction-panel-' + left.id)).toBeNull()
    expect(screen.queryByTestId('construction-part-' + right.id)).toBeNull()
  })
  it('restores a saved partial draft without exposing later rows or expected fields', () => {
    const parent = unit.constructionItems!.find(c => c.sourceNodeId === 'n08-r5-q02-distance')!, part = parent.parts[0]
    const progress = answerTextbookConstruction(beforeStage(1), unit, parent.id, part.id, part.expected, 'saved-draft', 200)
    const view = mount(JSON.parse(JSON.stringify(progress)), 1)
    expect(screen.getByTestId('construction-part-' + part.id).textContent).toContain('a')
    expect(screen.queryByTestId('textbook-item-n08-02')).toBeNull()
    for (const node of view.container.querySelectorAll('[data-visible-state]')) { const state = node.getAttribute('data-visible-state')!; expect(state).not.toContain('expected'); expect(state).not.toContain('correctValue') }
    expect(useAppStore.getState().textbookProgress[unit.unitId].constructionProgress![parent.id].attemptCount).toBe(0)
  })
  it('keeps preview construction answers out of persistent learner records', () => {
    const progress = beforeStage(1)!, original = JSON.parse(JSON.stringify(progress)); mount(progress, 1, true)
    const parent = unit.constructionItems!.find(c => c.sourceNodeId === 'n08-r5-q02-distance')!
    fireEvent.click(screen.getByTestId('construction-part-' + parent.parts[0].id))
    fireEvent.click(screen.getByTestId('construction-choice-' + parent.parts[0].id + '-0'))
    fireEvent.click(screen.getByTestId('construction-choice-' + parent.parts[1].id + '-1'))
    expect(screen.queryByTestId('construction-part-' + parent.parts[0].id)).toBeNull()
    expect(useAppStore.getState().textbookProgress[unit.unitId]).toEqual(original)
  })
  it('shows the substitution as one condition-bearing worked model and keeps the cases table', () => {
    const view = mount(beforeStage(3), 3)
    const worked = view.container.querySelector('[data-node-id="n08-q04-substitute"]')!
    expect(worked.querySelectorAll('[data-equation-number="7"]')).toHaveLength(1)
    expect(worked.querySelector('button')).toBeNull()
    expect(worked.textContent).toContain('a=−5')
    const parent = unit.constructionItems!.find(c => c.sourceNodeId === 'n08-04')!
    fireEvent.click(screen.getByTestId('construction-part-' + parent.parts[0].id)); fireEvent.click(screen.getByTestId('construction-choice-' + parent.parts[0].id + '-0'))
    expect(screen.getByTestId('n08-cases-table').querySelectorAll('tbody tr')).toHaveLength(2)
  })
  it('shows Q07 initial, partial-part and completed chains with the current-row number', () => {
    const rule = data.nodes.find(n => n.id === 'n08-q07-rule')!, initial = fill(beforeStage(6), rule)
    const view = mount(initial, 6), groupId = 'n08-group-absolute-root'
    const currentGroup = () => view.container.querySelector('[data-construction-group="' + groupId + '"]') ?? [...view.container.querySelectorAll('[data-construction-group]')].find(g => g.querySelector('[data-source-node="n08-q07-bracket"]'))!
    expect(currentGroup().querySelectorAll('[data-construction-row]')).toHaveLength(1)
    expect(currentGroup().querySelector('[data-equation-number="17"]')).toBeTruthy()
    const bracket = unit.constructionItems!.find(c => c.sourceNodeId === 'n08-q07-bracket')!, dist = unit.constructionItems!.find(c => c.sourceNodeId === 'n08-q07-distribute')!, order = unit.constructionItems!.find(c => c.sourceNodeId === 'n08-07')!
    fireEvent.click(screen.getByTestId('construction-part-' + bracket.parts[0].id)); fireEvent.click(screen.getByTestId('construction-choice-' + bracket.parts[0].id + '-0'))
    expect(currentGroup().querySelectorAll('[data-construction-row]')).toHaveLength(3)
    fireEvent.click(screen.getByTestId('construction-part-' + dist.parts[0].id)); fireEvent.click(screen.getByTestId('construction-choice-' + dist.parts[0].id + '-0'))
    expect(screen.getByTestId('construction-part-' + dist.parts[0].id)).toBeTruthy(); expect(screen.getByTestId('construction-panel-' + dist.parts[1].id)).toBeTruthy()
    fireEvent.click(screen.getByTestId('construction-choice-' + dist.parts[1].id + '-0'))
    fireEvent.click(screen.getByTestId('construction-part-' + order.parts[0].id)); fireEvent.click(screen.getByTestId('construction-choice-' + order.parts[0].id + '-0'))
    expect(currentGroup().querySelectorAll('[data-construction-row]')).toHaveLength(4)
    expect(view.container.querySelectorAll('[data-prose-role="active-prompt"]')).toHaveLength(0)
    expect(currentGroup().querySelectorAll('[data-prose-role="essential-note"]')).toHaveLength(1)
    expect(view.container.querySelector('.construction-full-explanation')).toBeTruthy()
  })
  it('does not resurrect archived old answers after resetting r6 and projecting an old comparison', () => {
    const old5 = validateTextbookUnits([old5Data.unit])[0], old4 = validateTextbookUnits([old4Data.unit])[0]
    const previous = old5.sections.flatMap(s => s.items).reduce<TextbookUnitProgress | undefined>((p, item, index) => answerTextbookItem(p, old5, item, item.answer, 10 + index), undefined)!
    const migrated = effectiveTextbookProgress(unit, previous)
    const done = data.nodes.reduce<TextbookUnitProgress | undefined>(fill, migrated)!
    expect(textbookUnitProgress(unit, done).completed).toBe(33)
    const reset = resetTextbookUnitProgress(unit, done, 9999)!
    for (const old of [old5, old4]) {
      const roundtrip = effectiveTextbookProgress(unit, effectiveTextbookProgress(old, reset))!
      expect(textbookUnitProgress(unit, roundtrip)).toMatchObject({ completed: 0, total: 33 })
      expect(roundtrip.answers).toEqual({}); expect(roundtrip.constructionProgress).toEqual({})
      expect(roundtrip.archivedRevisions!['5'].answers).toEqual(previous.answers)
      expect(roundtrip.archivedRevisions!['6-reset-9999'].constructionProgress).toEqual(done.constructionProgress)
    }
  })
})
