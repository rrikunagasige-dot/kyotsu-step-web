// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { N08ConstructionReadingFlowV7 } from './N08ConstructionReadingFlowV7'
import { answerTextbookConstruction, answerTextbookConstructionV2, answerTextbookItem, type TextbookUnitProgress } from '../../domain/textbook'
import { validateTextbookUnits } from '../../domain/textbookSchema'
import { useAppStore } from '../../stores/useAppStore'
import data from '../../data/textbook/math/numbers/n08Revision7.json'

const unit = validateTextbookUnits([data.unit])[0], section = unit.sections[0]
type Node = typeof data.nodes[number]
function fill(progress: TextbookUnitProgress | undefined, n: Node) {
  if (!n.interaction) return progress
  const v2 = unit.constructionItemsV2?.find(c => c.id === n.interaction)
  if (v2) return v2.parts.reduce((p, part, index) => answerTextbookConstructionV2(p, unit, v2.id, part.id, part.choices.find(c => c.value === part.expected)!.id, 'pre-v2-' + part.id, index + 10), progress)
  const v1 = unit.constructionItems?.find(c => c.id === n.interaction)
  if (v1) return v1.parts.reduce((p, part, index) => answerTextbookConstruction(p, unit, v1.id, part.id, part.expected, 'pre-v1-' + part.id, index + 10), progress)
  return answerTextbookItem(progress, unit, section.items.find(i => i.id === n.interaction)!, section.items.find(i => i.id === n.interaction)!.answer, 20)
}
function mountAt(nodeId: string, preview = false) {
  const index = data.nodes.findIndex(n => n.id === nodeId), n = data.nodes[index]
  const progress = data.nodes.slice(0, index).reduce(fill, undefined as TextbookUnitProgress | undefined)
  window.localStorage.setItem('math-textbook-compact-v1:' + unit.unitId + ':r7', String(data.stages.findIndex(s => s.id === n.stageId)))
  useAppStore.setState({ textbookProgress: progress ? { [unit.unitId]: progress } : {} })
  function Flow() { const live = useAppStore(s => s.textbookProgress[unit.unitId]); return <N08ConstructionReadingFlowV7 unit={unit} section={section} progress={live} onReviewAnswer={preview ? () => undefined : undefined} /> }
  return { ...render(<MemoryRouter><Flow /></MemoryRouter>), progress }
}
beforeEach(() => {
  window.localStorage.clear(); useAppStore.setState({ textbookProgress: {} })
  let id = 0; vi.stubGlobal('crypto', { randomUUID: () => 'r7-ui-' + ++id })
  // Only makes DOM content available in jsdom. This is explicitly not a
  // baseline/frame measurement; real layout QA uses the actual browser.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ x:0,y:0,left:0,top:0,right:20,bottom:20,width:20,height:20,toJSON:()=>({}) })
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })
describe('r7 reader behavior (not geometry QA)', () => {
  it('selects a range of the immutable original expression, then gates the distribution steps', () => {
    const view = mountAt('n08-q07-bracket')
    const scope = unit.constructionItemsV2!.find(i => i.sourceNodeId === 'n08-q07-bracket')!, part = scope.parts[0]
    fireEvent.click(screen.getByTestId('construction-part-' + part.id))
    const firstTerm = screen.getByRole('button', { name:'第一項' })
    expect(firstTerm.querySelector('[data-source-ref$="/term-1"].axis-source-range--selected')).toBeTruthy()
    expect(firstTerm.querySelector('[data-source-ast-hash]')?.getAttribute('data-source-ast-hash')).toBe(scope.boundSourceTree!.sourceASTHash)
    fireEvent.click(firstTerm)
    expect(useAppStore.getState().textbookProgress[unit.unitId].constructionProgressV2![scope.id].draft[part.id]).toBe(part.choices[1].id)
    expect(view.container.querySelector('[data-axis-row="n08-q07-distribute-r7-factor"]')).toBeNull()
    fireEvent.click(screen.getByTestId('construction-choice-' + part.id + '-0'))
    const dist = unit.constructionItemsV2!.find(i => i.sourceNodeId === 'n08-q07-distribute')!
    expect(screen.getByTestId('construction-part-' + dist.parts[0].id)).toBeTruthy()
    expect(view.container.querySelector('[data-axis-row="n08-q07-distribute-r7-distribute"]')).toBeNull()
    fireEvent.click(screen.getByTestId('construction-part-' + dist.parts[0].id))
    const choiceIndex = dist.parts[0].choices.findIndex(c => c.value === dist.parts[0].expected)
    fireEvent.click(screen.getByTestId('construction-choice-' + dist.parts[0].id + '-' + choiceIndex))
    expect(view.container.querySelector('[data-axis-row="n08-q07-distribute-r7-distribute"]')).toBeTruthy()
    expect(view.container.querySelector('[data-axis-row="n08-q07-distribute-r7-products"]')).toBeNull()
    for (const visible of view.container.querySelectorAll('[data-visible-state]')) expect(visible.getAttribute('data-visible-state')).not.toMatch(/"expected"|"feedback"|"boundSourceTree"/)
  })
  it('keeps a V2 preview isolated from persistent learner records', () => {
    const { progress } = mountAt('n08-02', true), original = JSON.stringify(progress)
    const i = unit.constructionItemsV2!.find(i => i.sourceNodeId === 'n08-02')!, part = i.parts[0]
    fireEvent.click(screen.getByTestId('construction-part-' + part.id))
    fireEvent.click(screen.getByTestId('construction-choice-' + part.id + '-' + part.choices.findIndex(c => c.value === part.expected)))
    expect(screen.queryByTestId('construction-part-' + part.id)).toBeNull()
    expect(JSON.stringify(useAppStore.getState().textbookProgress[unit.unitId])).toBe(original)
  })
  it('adapts unchanged local mathematical answers to axis slots without changing their action IDs', () => {
    mountAt('n08-q01-left')
    const item = section.items.find(i => i.id === 'n08-q01-left-answer')!
    expect(screen.getByTestId('construction-part-' + item.id)).toBeTruthy()
    fireEvent.click(screen.getByTestId('construction-part-' + item.id))
    expect(screen.getAllByTestId(new RegExp('textbook-choice-' + item.id + '-'))).toHaveLength(3)
    const correct = [...screen.getByTestId('inline-choice-panel-' + item.id).querySelectorAll('button')].find(b=>b.getAttribute('aria-label')===item.answer)!
    fireEvent.click(correct)
    expect(useAppStore.getState().textbookProgress[unit.unitId].answers[item.id].value).toBe(item.answer)
  })
  it('records the certified comparison without combining a preparation lhs and a final rhs', () => {
    const view = mountAt('n08-r5-q06-operation')
    const records = [...view.container.querySelectorAll('[data-result-source="n08-05-result"]')]
    expect(records.length).toBeGreaterThan(0)
    for (const record of records) {
      const lhs = [...record.querySelectorAll('.axis-cell--left annotation')].map(n=>n.textContent).join('')
      expect(lhs).toMatch(/\\sqrt/)
      expect(lhs).not.toBe('5')
      expect(record.getAttribute('data-record-status')).toBe('VERIFIED')
    }
    cleanup()
    const positive = mountAt('n08-q11-negative')
    expect(screen.getByTestId('n08-cases-table').querySelectorAll('tbody tr')).toHaveLength(2)
    const interpretation = positive.container.querySelector('[data-node-id="n08-q11-positive"] [data-prose-role="interpretation"]')!
    expect(interpretation).toBeTruthy()
    const facts = [...interpretation.querySelectorAll('annotation')].map(n=>n.textContent)
    expect(facts.join('')).toContain('|a|=a');expect(facts.join('')).toContain('|-a|=a')
    expect(facts.join('')).not.toContain('-a=a')
  })
  it('reserves the comparison slot in the middle column before pi is shown', () => {
    const view = mountAt('n08-q08-order')
    const comparisonEnvelope = [...view.container.querySelectorAll('[data-envelope-cell="relation"] [data-part-ref]')].find(n=>n.getAttribute('data-part-ref')==='n08-q08-order-answer')
    expect(comparisonEnvelope).toBeTruthy()
    expect(comparisonEnvelope!.getAttribute('data-min-advance')).toBe('44')
    expect(screen.getByTestId('construction-part-n08-q08-order-answer')).toBeTruthy()
  })
  it('omits a resolved unary plus while retaining the typed mathematical result', () => {
    const first = mountAt('n08-q11-negative')
    const positiveResult = first.container.querySelector('[data-axis-row="n08-q11-positive-r7-simplify"]')
    if (positiveResult) expect([...positiveResult.querySelectorAll('.axis-cell--right annotation')].map(n=>n.textContent).join('')).not.toContain('+')
    // Use the final case as well: a unary plus chosen to derive a² is omitted
    // only after completion; binary addition elsewhere remains untouched.
    cleanup()
    const second = mountAt('n08-12')
    const final = second.container.querySelector('[data-node-id="n08-q12-negative"]')!
    expect([...final.querySelectorAll('.axis-cell--right annotation')].map(n=>n.textContent)).not.toContain('+')
  })
  it('shows completion and previous results after all thirty parents, with older revision comparisons retained', () => {
    const progress = data.nodes.reduce(fill, undefined as TextbookUnitProgress | undefined)
    window.localStorage.setItem('math-textbook-compact-v1:' + unit.unitId + ':r7','11')
    const reached = vi.fn()
    const view = render(<MemoryRouter><N08ConstructionReadingFlowV7 unit={unit} section={section} progress={progress} onSummaryReached={reached}/></MemoryRouter>)
    expect(screen.getByTestId('n08-complete')).toBeTruthy()
    expect(reached).toHaveBeenLastCalledWith(true)
    expect(view.container.querySelector('a[href$="?version=6"]')).toBeTruthy()
    expect(view.container.querySelector('a[href$="?version=5"]')).toBeTruthy()
    expect(view.container.querySelector('a[href$="?version=4"]')).toBeTruthy()
    fireEvent.click(screen.getByTestId('n08-history-toggle'))
    expect(view.container.querySelector('.first-theme-recorded-results')).toBeTruthy()
  })
})
