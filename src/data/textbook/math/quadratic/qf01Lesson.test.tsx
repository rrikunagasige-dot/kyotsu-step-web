// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { GuidedMathReadingFlow } from '../../../../components/textbook/GuidedMathReadingFlow'
import { useAppStore } from '../../../../stores/useAppStore'
import { answerTextbookItem, type TextbookUnitProgress } from '../../../../domain/textbook'
import { mathFunctionConditionsUnit } from '../function/functionConditionsLesson'
import { mathNumbersN01Unit } from '../numbers/n01Lesson'
import { mathQuadraticQF01Unit as unit, qf01GuidedPresentation as presentation, qf01TransformationPresentation as transformation } from './qf01Lesson'
const items = unit.sections[0].items
const active = unit.requiredInteractionRefs!.map(id => items.find(i => i.id === id)!)
function Lesson({ plan = transformation }: { plan?: unknown }) {
  const progress = useAppStore(state => state.textbookProgress[unit.unitId])
  return <GuidedMathReadingFlow presentation={presentation} transformationPresentation={plan} unit={unit} section={unit.sections[0]} progress={progress} storageScope="qf01-v2" />
}
const latex = (node: Element) => [...node.querySelectorAll('annotation[encoding="application/x-tex"]')].map(n => n.textContent)
function legacyPrefix(count: number): TextbookUnitProgress {
  const answers = Object.fromEntries(items.slice(0, count).map((item, i) => [item.id, { itemId: item.id, value: item.answer, firstValue: item.answer, isFirstCorrect: true, resolved: true, attemptCount: 1, firstAnsweredAt: i + 1, lastAnsweredAt: i + 1 }]))
  return { unitId: unit.unitId, unitRevision: 1, startedAt: 1, updatedAt: 25, answers, ...(count === 25 ? { completedAt: 25 } : {}) }
}
// Deterministic DOM-layout model, not browser pixels. Rectangles change only
// when real rendered feedback/context nodes exist, and scrollBy moves the viewport.
function qfViewportModel(contextInitiallyOutside = true) {
  const originalHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight')!
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
  const oldRAF = window.requestAnimationFrame, oldCancel = window.cancelAnimationFrame
  let serial = 0, scroll = 0, outside = contextInitiallyOutside
  const frames = new Map<number, FrameRequestCallback>()
  window.requestAnimationFrame = callback => { frames.set(++serial, callback); return serial }
  window.cancelAnimationFrame = id => { frames.delete(id) }
  const header = document.createElement('header'); header.style.position = 'fixed'; header.style.top = '0px'; document.body.append(header)
  const rect = (top: number, height: number) => ({ x: 0, y: top, top, bottom: top + height, left: 0, right: 320, width: 320, height, toJSON: () => ({}) }) as DOMRect
  const targetMeasurements: { testId: string; repeatContext: boolean; hint: boolean }[] = []
  const measurement = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this === header) return rect(0, 64)
    if (this.getAttribute('data-testid') === 'guided-source-question') return rect(outside ? -200 : 120, 100)
    const panel = this.closest('[data-testid^="inline-choice-panel-"]')
    const repeated = Boolean(panel?.querySelector('[data-testid="qf01-local-context"]'))
    const hint = Boolean(panel?.querySelector('.reading-choice-hint'))
    const contextHeight = repeated ? 120 : 0, hintHeight = hint ? 220 : 0
    const testId = this.getAttribute('data-testid') ?? ''
    if (testId.startsWith('textbook-choice-')) {
      targetMeasurements.push({ testId, repeatContext: repeated, hint })
      const index = Number(testId.split('-').at(-1))
      return rect(780 + index * 62 + contextHeight + hintHeight - scroll, 60)
    }
    if (testId.startsWith('inline-choice-panel-')) {
      targetMeasurements.push({ testId, repeatContext: repeated, hint })
      return rect(740 - scroll, 186 + contextHeight + hintHeight)
    }
    return rect(100, 50)
  })
  vi.mocked(window.scrollBy).mockImplementation((options: number | ScrollToOptions) => {
    if (typeof options === 'object') scroll += options.top ?? 0
  })
  return {
    targetMeasurements,
    flush() {
      for (let round = 0; frames.size; round++) {
        if (round > 10) throw new Error('unbounded reveal animation frames')
        const pending = [...frames.entries()]; frames.clear()
        act(() => { for (const [, callback] of pending) callback(0) })
      }
    },
    moveDown(pixels: number) { scroll -= pixels },
    showOriginalContext() { outside = false },
    hideOriginalContext() { outside = true },
    restore() { measurement.mockRestore(); header.remove(); Object.defineProperty(window, 'innerHeight', originalHeight); window.requestAnimationFrame = oldRAF; window.cancelAnimationFrame = oldCancel }
  }
}

beforeEach(() => {
  localStorage.clear(); useAppStore.setState({ textbookProgress: {} })
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollBy = vi.fn()
  window.requestAnimationFrame = cb => { cb(0); return 1 }
  window.cancelAnimationFrame = vi.fn()
})
afterEach(cleanup)
describe('QF01 full nine-stage revision2', () => {
  it('preserves physical legacy25 while all24 active real answers complete continuously, without grading the reused lower bound', () => {
    const oldUnits = [mathFunctionConditionsUnit, mathNumbersN01Unit]
    const old = Object.fromEntries(oldUnits.map(u => [u.unitId, answerTextbookItem(undefined, u, u.sections[0].items[0], u.sections[0].items[0].answer, 1)]))
    const before = JSON.stringify(old); useAppStore.setState({ textbookProgress: old })
    expect(items).toHaveLength(25); expect(active).toHaveLength(24)
    render(<Lesson />)
    expect(presentation.stages).toHaveLength(9)
    let stageAdvances = 0
    for (let i = 0; i < active.length; i++) {
      const item = active[i]
      while (!screen.queryByTestId('textbook-item-' + item.id) && stageAdvances < presentation.stages.length - 1) {
        fireEvent.click(screen.getByTestId('math-textbook-next-stage'))
        stageAdvances++
      }
      expect(screen.queryByTestId('textbook-item-' + item.id)).toBeTruthy()
      expect(active.slice(i + 1).every(next => !screen.queryByTestId('textbook-item-' + next.id))).toBe(true)
      expect(document.querySelector('.guided-thinking-step')).toBeNull()
      expect(screen.queryByTestId('textbook-item-qf01-n20-answer')).toBeNull()
      const context = screen.getByTestId('guided-source-question')
      if (item.id === 'qf01-n11-answer') {
        expect(latex(context)).toEqual(expect.arrayContaining(['f(x)=x^2-1', 'f(a-1)']))
        expect(context.textContent).not.toContain('平方部分を整えたあと')
      }
      const slot = screen.getByRole('button', { name: '式中の空欄' })
      expect(slot).toBe(screen.getByTestId('textbook-item-' + item.id))
      expect(slot.getAttribute('aria-describedby')).toBe(context.id)
      expect(context.id).not.toBe('')
      expect(slot.getAttribute('aria-label')).not.toContain(transformation.interactions.find(q => q.id === item.id)!.learnerDecision)
      fireEvent.click(slot)
      const optionGroup = within(screen.getByTestId('inline-choice-panel-' + item.id)).getByRole('group', { name: 'この空欄の候補' })
      expect(optionGroup.getAttribute('aria-describedby')).toBe(context.id)
      expect(optionGroup.getAttribute('aria-label')).not.toContain(transformation.interactions.find(q => q.id === item.id)!.learnerDecision)
      for (const wrong of item.choices!.filter(c => c !== item.answer)) {
        fireEvent.click(within(screen.getByTestId('inline-choice-panel-' + item.id)).getByRole('button', { name: wrong }))
        expect(useAppStore.getState().textbookProgress[unit.unitId].answers[item.id].resolved).toBe(false)
        expect(screen.getByTestId('textbook-item-' + item.id)).toBeTruthy()
      }
      fireEvent.click(within(screen.getByTestId('inline-choice-panel-' + item.id)).getByRole('button', { name: item.answer }))
      expect(useAppStore.getState().textbookProgress[unit.unitId].answers[item.id].resolved).toBe(true)
      expect(screen.queryByTestId('inline-choice-panel-' + item.id)).toBeNull()
    }
    expect(stageAdvances).toBe(8)
    expect(screen.getByTestId('qf01-complete').textContent).toContain('解答')
    const record = useAppStore.getState().textbookProgress[unit.unitId]
    expect(Object.keys(record.answers)).toHaveLength(24)
    expect(record.answers['qf01-n20-answer']).toBeUndefined()
    expect(Object.values(record.answers).every(a => a.attemptCount === 3)).toBe(true)
    expect(screen.getByTestId('textbook-reading-flow').querySelector('[data-source-node="qf01-n20"]')).toBeTruthy()
    expect(JSON.stringify(Object.fromEntries(oldUnits.map(u => [u.unitId, useAppStore.getState().textbookProgress[u.unitId]])))).toBe(before)
    act(() => useAppStore.getState().resetTextbookUnit(unit.unitId, unit))
    expect(screen.getByTestId('textbook-item-qf01-n01-answer')).toBeTruthy()
    expect(JSON.stringify(Object.fromEntries(oldUnits.map(u => [u.unitId, useAppStore.getState().textbookProgress[u.unitId]])))).toBe(before)
  }, 15_000)
  it('reopens every exact old prefix by active IDs, preserving the original condition and a revision2 cursor', () => {
    for (let count = 0; count <= 25; count++) {
      cleanup(); localStorage.clear()
      const old = legacyPrefix(count); const before = JSON.stringify(old)
      useAppStore.setState({ textbookProgress: { [unit.unitId]: old } })
      localStorage.setItem('math-textbook-compact-v1:' + unit.unitId + ':r1:scope:qf01-v1', '8')
      render(<Lesson />)
      const first = active.find(item => !old.answers[item.id])
      if (first) {
        expect(screen.getByTestId('textbook-item-' + first.id)).toBeTruthy()
        expect(screen.queryByTestId('textbook-item-qf01-n20-answer')).toBeNull()
      } else {
        expect(screen.getByTestId('math-textbook-stage-qf01-stage-1')).toBeTruthy()
        expect(screen.getByTestId('qf01-imported-answer-history')).toBeTruthy()
        expect(screen.queryByTestId('qf01-complete')).toBeNull()
      }
      expect(JSON.stringify(useAppStore.getState().textbookProgress[unit.unitId])).toBe(before)
      expect(localStorage.getItem('math-textbook-compact-v1:' + unit.unitId + ':r2:scope:qf01-v2')).not.toBeNull()
      if (count === 10) expect(latex(screen.getByTestId('guided-source-question'))).toEqual(expect.arrayContaining(['f(x)=x^2-1', 'f(a-1)']))
    }
  })
  it('keeps parent function, square helper and return as separate mathematical subjects', () => {
    useAppStore.setState({ textbookProgress: { [unit.unitId]: legacyPrefix(11) } })
    render(<Lesson />)
    const parent = document.querySelector('[data-transformation-group="qf01-stage-6-parent"]')!
    const helper = document.querySelector('[data-transformation-group="qf01-stage-6-square"]')!
    expect(latex(parent)).toContain('(a-1)^2-1')
    expect(latex(helper)).toContain('(a-1)^2')
    expect(latex(helper.querySelector('.transformation-left')!)).toContain('(a-1)^2')
    expect(latex(helper.querySelector('.transformation-left')!)).not.toContain('f(a-1)')
    expect(document.querySelector('[data-transformation-group="qf01-stage-6-return"]')).toBeNull()
  })
  it('retains a wrong answer through actual persistence rehydration and a fresh UI mount', async () => {
    useAppStore.setState({ textbookProgress: { [unit.unitId]: legacyPrefix(10) } })
    const view = render(<Lesson />); const item = items.find(i => i.id === 'qf01-n11-answer')!
    fireEvent.click(screen.getByTestId('textbook-item-' + item.id))
    fireEvent.click(within(screen.getByTestId('inline-choice-panel-' + item.id)).getByRole('button', { name: item.choices!.find(c => c !== item.answer)! }))
    const stored = JSON.parse(localStorage.getItem(useAppStore.persist.getOptions().name!)!).state.textbookProgress[unit.unitId]
    view.unmount(); await act(async () => { await useAppStore.persist.rehydrate() }); render(<Lesson />)
    expect(useAppStore.getState().textbookProgress[unit.unitId]).toEqual(stored)
    expect(latex(screen.getByTestId('guided-source-question'))).toEqual(expect.arrayContaining(['f(x)=x^2-1', 'f(a-1)']))
    fireEvent.click(screen.getByTestId('textbook-item-' + item.id))
    expect(screen.getByTestId('textbook-hint-' + item.id).textContent).toContain('採用しません')
  })
  it('measures only top-anchored headers as top clearance, not the fixed bottom navigation', () => {
    const header = document.createElement('header'), nav = document.createElement('nav')
    header.style.cssText = 'position:sticky;top:0'; nav.style.cssText = 'position:fixed;bottom:0;top:auto'
    document.body.append(header, nav)
    const rect = (top: number, bottom: number) => ({ x: 0, y: top, top, bottom, left: 0, right: 320, width: 320, height: bottom - top, toJSON: () => ({}) }) as DOMRect
    const mocked = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this === header) return rect(0, 80)
      if (this === nav) return rect(innerHeight - 72, innerHeight)
      return this.hasAttribute('data-qf01-current-slot') ? rect(40, 84) : rect(100, 150)
    })
    try {
      render(<Lesson />)
      expect(window.scrollBy).toHaveBeenCalledWith({ top: -52, behavior: 'auto' })
      expect((screen.getByTestId('textbook-reading-flow') as HTMLElement).style.getPropertyValue('--qf01-header-clearance')).toBe('92px')
    } finally { mocked.mockRestore(); header.remove(); nav.remove() }
  })
  it('keeps compact conclusions anchored in all prior stages and stage6 subchains, with complete final-stage conditions', () => {
    useAppStore.setState({ textbookProgress: { [unit.unitId]: legacyPrefix(25) } })
    render(<Lesson />)
    for (let stage = 1; stage < 9; stage++) fireEvent.click(screen.getByTestId('math-textbook-next-stage'))
    fireEvent.click(screen.getByTestId('qf01-history-toggle'))
    const expected: Record<string, [string[], string, string[]]> = {
      'qf01-stage-1-rule': [['\\text{出てくる数}'], '=', ['2']],
      'qf01-stage-2-negative': [['f(-1)'], '=', ['-10']],
      'qf01-stage-3-symbol': [['f(a-1)'], '=', ['4a-10']],
      'qf01-stage-4-square-number': [['f(-1)'], '=', ['0']],
      'qf01-stage-5-positive': [['f(2)'], '=', ['3']],
      'qf01-stage-6-parent': [['f(a-1)'], '=', ['(a-1)^2-1']],
      'qf01-stage-6-square': [['(a-1)^2'], '=', ['a^2-2a+1']],
      'qf01-stage-6-return': [['f(a-1)'], '=', ['a^2-2a']],
      'qf01-stage-7-rectangle': [['2x+2y=40'], '\\Leftrightarrow', ['y=20-x']],
      'qf01-stage-8-domain': [['x>0\\land x<20'], '\\Leftrightarrow', ['0<x<20']],
    }
    for (const [id, [left, relation, right]] of Object.entries(expected)) {
      const group = document.querySelector('.guided-history [data-transformation-group="' + id + '"]')!
      expect(group).toBeTruthy()
      expect(group.querySelectorAll('.transformation-equation')).toHaveLength(1)
      expect(latex(group.querySelector('.transformation-left')!)).toEqual(left)
      expect(latex(group.querySelector('.transformation-relation')!)).toEqual([relation])
      expect(latex(group.querySelector('.transformation-right')!)).toEqual(right)
    }
    const last = document.querySelector('[data-transformation-group="qf01-stage-9-range"] .transformation-row:last-child')!
    expect(latex(last.querySelector('.transformation-left')!)).toEqual(['y>0\\land y<20'])
    expect(latex(last.querySelector('.transformation-right')!)).toEqual(['0<y<20'])
    // A standalone complete interval must not inherit a spurious earlier left side.
    cleanup(); localStorage.clear()
    const standalone = structuredClone(transformation)
    const final = standalone.groups.find(g => g.id === 'qf01-stage-8-domain')!.rows.at(-1)!.completed
    final.left = []; final.relation = ''; final.right = [{ type: 'math', latex: '0<x<20' }]
    render(<Lesson plan={standalone} />)
    for (let stage = 1; stage < 9; stage++) fireEvent.click(screen.getByTestId('math-textbook-next-stage'))
    fireEvent.click(screen.getByTestId('qf01-history-toggle'))
    const interval = document.querySelector('.guided-history [data-transformation-group="qf01-stage-8-domain"]')!
    expect(latex(interval.querySelector('.transformation-left')!)).toEqual([])
    expect(latex(interval.querySelector('.transformation-relation')!)).toEqual([])
    expect(latex(interval.querySelector('.transformation-right')!)).toEqual(['0<x<20'])
  })
  it('keeps QF whole-formula choices out of the legacy ordinal chip with the actual global CSS loaded', () => {
    const styles = document.createElement('style')
    const originalGlobalCSS = readFileSync('src/styles/global.css', 'utf8')
    const guidedReadingCSS = readFileSync('src/components/textbook/guided-math-reading.css', 'utf8')
    expect(originalGlobalCSS).toContain('grid-template-columns: 30px minmax(0, 1fr) auto')
    expect(guidedReadingCSS).toContain('.qf01-option-content')
    styles.textContent = originalGlobalCSS + '\n' + guidedReadingCSS
    document.head.append(styles)
    const legacy = document.createElement('button')
    legacy.className = 'reading-choice-option'; legacy.innerHTML = '<span>1</span>'
    document.body.append(legacy)
    try {
      render(<Lesson />)
      fireEvent.click(screen.getByTestId('textbook-item-' + active[0].id))
      const panel = screen.getByTestId('inline-choice-panel-' + active[0].id)
      const buttons = within(panel).getAllByRole('button')
      expect(buttons).toHaveLength(active[0].choices!.length)
      for (const button of buttons) {
        const content = button.querySelector(':scope > .qf01-option-content')!
        expect(content).toBeTruthy()
        expect(latex(content).length).toBeGreaterThan(0)
        const buttonStyle = getComputedStyle(button), contentStyle = getComputedStyle(content)
        expect(buttonStyle.display).toBe('block')
        expect(buttonStyle.gridTemplateColumns).toBe('none')
        expect(buttonStyle.minHeight).toBe('44px')
        expect(buttonStyle.fontSize).not.toBe('0.7rem')
        expect(contentStyle.display).toBe('block')
        expect(contentStyle.width).toBe('auto')
        expect(contentStyle.height).toBe('auto')
        expect(contentStyle.borderTopWidth).toBe('0px')
        expect(contentStyle.fontWeight).not.toBe('700')
        expect(contentStyle.fontSize).not.toBe('0.7rem')
      }
      expect(getComputedStyle(screen.getByTestId('textbook-reading-flow')).fontSize).toBe('18px')
      expect(getComputedStyle(legacy).display).toBe('grid')
      expect(getComputedStyle(legacy).gridTemplateColumns).toBe('30px minmax(0, 1fr) auto')
      const chip = getComputedStyle(legacy.firstElementChild!)
      expect(chip.display).toBe('grid'); expect(chip.width).toBe('27px'); expect(chip.fontWeight).toBe('700')
    } finally { styles.remove(); legacy.remove() }
  })
  it('fails closed for missing stages/nodes or changed grading instead of exposing legacy question fallback', () => {
    for (const mutate of [(x: typeof transformation) => x.groups.splice(0, 1), (x: typeof transformation) => x.interactions[0].correctValue = 'WRONG', (x: typeof transformation) => x.scope.nodeIds.pop()]) {
      cleanup(); const plan = structuredClone(transformation); mutate(plan); render(<Lesson plan={plan} />)
      expect(screen.getByRole('alert')).toBeTruthy()
      expect(document.querySelector('.guided-thinking-step')).toBeNull()
      expect(screen.queryByTestId('textbook-item-qf01-n01-answer')).toBeNull()
    }
  })
  it('reveals the actually focused choice after wrong feedback moves the committed DOM, without requiring a new focus event', () => {
    const layout = qfViewportModel()
    try {
      render(<Lesson />); layout.flush()
      fireEvent.click(screen.getByTestId('textbook-item-' + active[0].id)); layout.flush()
      const wrong = active[0].choices!.find(choice => choice !== active[0].answer)!
      const button = within(screen.getByTestId('inline-choice-panel-' + active[0].id)).getByRole('button', { name: wrong })
      act(() => button.focus()); expect(document.activeElement).toBe(button)
      const focus = vi.spyOn(button, 'focus'); vi.mocked(window.scrollBy).mockClear()
      fireEvent.click(button); layout.flush()
      expect(screen.getByTestId('textbook-hint-' + active[0].id)).toBeTruthy()
      expect(useAppStore.getState().textbookProgress[unit.unitId].answers[active[0].id].attemptCount).toBe(1)
      expect(document.activeElement).toBe(button); expect(focus).not.toHaveBeenCalled()
      expect(window.scrollBy).toHaveBeenCalled()
      const rect = button.getBoundingClientRect()
      expect(rect.top).toBeGreaterThanOrEqual(76); expect(rect.bottom).toBeLessThanOrEqual(988)
    } finally { layout.restore() }
  })
  it('handles repeated wrong attempts and keyboard focus while preserving correct advancement and manual scrolling', () => {
    const layout = qfViewportModel()
    try {
      render(<Lesson />); layout.flush()
      fireEvent.click(screen.getByTestId('textbook-item-' + active[0].id)); layout.flush()
      const panel = screen.getByTestId('inline-choice-panel-' + active[0].id)
      const wrongs = active[0].choices!.filter(choice => choice !== active[0].answer)
      for (const [i, wrong] of [wrongs[0], wrongs[0], wrongs[1]].entries()) {
        const button = within(panel).getByRole('button', { name: wrong })
        act(() => button.focus()); layout.moveDown(1000)
        vi.mocked(window.scrollBy).mockClear()
        fireEvent.click(button); layout.flush()
        expect(useAppStore.getState().textbookProgress[unit.unitId].answers[active[0].id].attemptCount).toBe(i + 1)
        expect(document.activeElement).toBe(button)
        expect(window.scrollBy).toHaveBeenCalled()
        expect(button.getBoundingClientRect().bottom).toBeLessThanOrEqual(988)
        vi.mocked(window.scrollBy).mockClear()
        layout.showOriginalContext(); fireEvent.scroll(window); layout.flush()
        layout.hideOriginalContext(); fireEvent.scroll(window); layout.flush()
        expect(window.scrollBy).not.toHaveBeenCalled()
      }
      const correct = within(panel).getByRole('button', { name: active[0].answer })
      act(() => correct.focus()); fireEvent.click(correct); layout.flush()
      expect(useAppStore.getState().textbookProgress[unit.unitId].answers[active[0].id].resolved).toBe(true)
      expect(screen.queryByTestId('inline-choice-panel-' + active[0].id)).toBeNull()
      expect(screen.getByTestId('textbook-item-' + active[1].id)).toBeTruthy()
      vi.mocked(window.scrollBy).mockClear()
      layout.showOriginalContext(); fireEvent.scroll(window); layout.flush()
      expect(window.scrollBy).not.toHaveBeenCalled()
    } finally { layout.restore() }
  })
  it('falls back to the current panel when focus is outside it and never scrolls or focuses the unrelated control', () => {
    const layout = qfViewportModel()
    const outside = document.createElement('button'); outside.textContent = '別の操作'; document.body.append(outside)
    try {
      render(<Lesson />); layout.flush()
      fireEvent.click(screen.getByTestId('textbook-item-' + active[0].id)); layout.flush()
      act(() => outside.focus()); vi.mocked(window.scrollBy).mockClear()
      const wrong = active[0].choices!.find(choice => choice !== active[0].answer)!
      fireEvent.click(within(screen.getByTestId('inline-choice-panel-' + active[0].id)).getByRole('button', { name: wrong })); layout.flush()
      expect(document.activeElement).toBe(outside)
      expect(window.scrollBy).toHaveBeenCalled()
      expect(layout.targetMeasurements.at(-1)?.testId).toBe('inline-choice-panel-' + active[0].id)
    } finally { outside.remove(); layout.restore() }
  })
  it('measures the panel only after a newly repeated original context has committed', () => {
    const layout = qfViewportModel(false)
    try {
      render(<Lesson />); layout.flush(); layout.hideOriginalContext()
      fireEvent.click(screen.getByTestId('textbook-item-' + active[0].id)); layout.flush()
      expect(screen.getByTestId('qf01-local-context')).toBeTruthy()
      const measurement = layout.targetMeasurements.filter(entry => entry.testId === 'inline-choice-panel-' + active[0].id).at(-1)
      expect(measurement?.repeatContext).toBe(true)
    } finally { layout.restore() }
  })

  it('does not scroll on a wrong answer when the focused choice still fits between the actual header and footer bounds', () => {
    const layout = qfViewportModel()
    try {
      render(<Lesson />); layout.flush()
      fireEvent.click(screen.getByTestId('textbook-item-' + active[0].id)); layout.flush()
      const wrong = active[0].choices!.find(choice => choice !== active[0].answer)!
      const button = within(screen.getByTestId('inline-choice-panel-' + active[0].id)).getByRole('button', { name: wrong })
      act(() => button.focus()); layout.moveDown(-300)
      vi.mocked(window.scrollBy).mockClear()
      fireEvent.click(button); layout.flush()
      expect(screen.getByTestId('textbook-hint-' + active[0].id)).toBeTruthy()
      expect(document.activeElement).toBe(button)
      expect(button.getBoundingClientRect().top).toBeGreaterThanOrEqual(76)
      expect(button.getBoundingClientRect().bottom).toBeLessThanOrEqual(988)
      expect(window.scrollBy).not.toHaveBeenCalled()
    } finally { layout.restore() }
  })

})
