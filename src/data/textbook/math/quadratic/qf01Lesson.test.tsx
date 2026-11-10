// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { GuidedMathReadingFlow } from '../../../../components/textbook/GuidedMathReadingFlow'
import { useAppStore } from '../../../../stores/useAppStore'
import { answerTextbookItem } from '../../../../domain/textbook'
import { mathFunctionConditionsUnit } from '../function/functionConditionsLesson'
import { mathNumbersN01Unit } from '../numbers/n01Lesson'
import { mathQuadraticQF01Unit as unit, qf01GuidedPresentation as presentation } from './qf01Lesson'
function Lesson() {
  const progress = useAppStore(state => state.textbookProgress[unit.unitId])
  return <GuidedMathReadingFlow presentation={presentation} unit={unit} section={unit.sections[0]} progress={progress} storageScope="qf01-v1" />
}
beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({ textbookProgress: {} })
  Element.prototype.scrollIntoView = () => undefined
  window.requestAnimationFrame = cb => { cb(0); return 1 }
})
afterEach(cleanup)
describe('QF01 approved lesson materialization', () => {
  it('completes all real reading interactions, retains wrong attempts, removes the answered question, and protects old units on reset', () => {
    const oldUnits = [mathFunctionConditionsUnit, mathNumbersN01Unit]
    const old = Object.fromEntries(oldUnits.map(u => [u.unitId, answerTextbookItem(undefined, u, u.sections[0].items[0], u.sections[0].items[0].answer, 1)]))
    useAppStore.setState({ textbookProgress: old })
    const oldSnapshot = JSON.stringify(old)
    render(<Lesson />)
    const items = unit.sections[0].items
    expect(items).toHaveLength(25)
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!screen.queryByTestId('textbook-item-' + item.id)) fireEvent.click(screen.getByTestId('math-textbook-next-stage'))
      const node = presentation.nodes[i]
      expect(document.querySelector(`[data-node-id="${node.id}"]`)).not.toBeNull()
      if (node.id === 'qf01-n05') expect(screen.getByTestId('guided-source-question').textContent).toContain('は数を表す文字です')
      expect(items.slice(i + 1).every(next => !screen.queryByTestId('textbook-item-' + next.id))).toBe(true)
      fireEvent.click(screen.getByTestId('textbook-item-' + item.id))
      for (const wrong of item.choices!.filter(c => c !== item.answer)) {
        fireEvent.click(screen.getByRole('button', { name: wrong }))
        expect(useAppStore.getState().textbookProgress[unit.unitId].answers[item.id].resolved).toBe(false)
        expect(screen.queryByTestId('textbook-item-' + item.id)).not.toBeNull()
      }
      fireEvent.click(screen.getByRole('button', { name: item.answer }))
      expect(useAppStore.getState().textbookProgress[unit.unitId].answers[item.id].resolved).toBe(true)
      expect(document.querySelector(`[data-node-id="${node.id}"] [data-block-id*="-interaction-"]`)).toBeNull()
      expect(screen.queryByTestId('inline-choice-panel-' + item.id)).toBeNull()
    }
    expect(screen.queryByTestId('qf01-complete')).not.toBeNull()
    expect(Object.values(useAppStore.getState().textbookProgress[unit.unitId].answers).every(a => a.attemptCount === 3)).toBe(true)
    expect(JSON.stringify(Object.fromEntries(oldUnits.map(u => [u.unitId, useAppStore.getState().textbookProgress[u.unitId]])))).toBe(oldSnapshot)
    expect(useAppStore.persist.getOptions().name).toBe(import.meta.env.VITE_STORAGE_NAMESPACE || 'kyotsu-step-store')
    expect(Object.keys(JSON.parse(localStorage.getItem(useAppStore.persist.getOptions().name!)!).state.textbookProgress[unit.unitId].answers)).toHaveLength(25)
    if (import.meta.env.VITE_STORAGE_NAMESPACE && import.meta.env.VITE_STORAGE_NAMESPACE !== 'kyotsu-step-store') expect(localStorage.getItem('kyotsu-step-store')).toBeNull()
    act(() => useAppStore.getState().resetTextbookUnit(unit.unitId, unit))
    expect(screen.queryByTestId('textbook-item-qf01-n01-answer')).not.toBeNull()
    expect(JSON.stringify(Object.fromEntries(oldUnits.map(u => [u.unitId, useAppStore.getState().textbookProgress[u.unitId]])))).toBe(oldSnapshot)
  })
})
