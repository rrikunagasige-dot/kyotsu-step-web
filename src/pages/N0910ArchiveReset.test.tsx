// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { N0910ArchivePage } from './N0910ArchivePage'
import old from '../data/textbook/math/numbers/n09ConstructionCompiledR6.json'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from '../domain/compiledNestedLesson'
import { answerNestedPart, emptyNestedLedger, nestedStorageKey, projectNestedLesson, type NestedLedger } from '../domain/nestedLesson'
import { useAppStore } from '../stores/useAppStore'
const lesson = nestedLessonFromCompiled(old as unknown as CompiledNestedLesson)
vi.mock('../components/textbook/ConstructionLessonReadingFlow', () => ({
  ConstructionLessonReadingFlow: ({ ledger, onAnswer }: { ledger?: NestedLedger; onAnswer: (id: string, value: string) => void }) => <div>
    <output data-testid="ledger">{JSON.stringify(ledger)}</output>
    <button onClick={() => onAnswer('n09-q01-negative::productSign', '+')}>試し解答</button>
  </div>,
}))
beforeEach(() => { localStorage.clear(); useAppStore.setState({ textbookProgress: {} }) })
afterEach(() => { cleanup(); useAppStore.setState({ textbookProgress: {} }); localStorage.clear() })
it('r6 comparison chooses the newer main reset with its subsequent answer and never writes its trial to either store', () => {
  let stale = emptyNestedLedger(lesson, 1), i = 0
  while (!projectNestedLesson(lesson, stale).completed) {
    const id = projectNestedLesson(lesson, stale).editable!.partId, p = lesson.nodes.flatMap(n => n.parts).find(p => p.id === id)!
    stale = answerNestedPart(lesson, stale, id, p.expected, 'old-' + ++i, i + 1)!
  }
  localStorage.setItem(nestedStorageKey(lesson), JSON.stringify({ schemaVersion: 'nested-reader-storage/1', ledger: stale }))
  const fresh = answerNestedPart(lesson, emptyNestedLedger(lesson, 100), 'n09-q01-negative::powerAction', 'repeat-whole-base', 'after-reset', 101)!
  useAppStore.setState({ textbookProgress: { [lesson.unitId]: { unitId: lesson.unitId, unitRevision: 7, startedAt: 100, updatedAt: 102, answers: {}, archivedRevisions: { '6': { unitRevision: 6, startedAt: 100, updatedAt: 101, answers: {}, nestedProgress: fresh, nestedResetAt: 100 } } } } })
  const storage = () => JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map(k => [k, localStorage.getItem(k)])))
  const mainBefore = JSON.stringify(useAppStore.getState().textbookProgress), rawBefore = storage()
  render(<MemoryRouter><N0910ArchivePage code="n09" nativeRevision={6} /></MemoryRouter>)
  expect(JSON.parse(screen.getByTestId('ledger').textContent!)).toEqual(fresh)
  fireEvent.click(screen.getByText('試し解答'))
  expect(JSON.parse(screen.getByTestId('ledger').textContent!).records['n09-q01-negative::productSign'].value).toBe('+')
  expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(mainBefore)
  expect(storage()).toBe(rawBefore)
})
