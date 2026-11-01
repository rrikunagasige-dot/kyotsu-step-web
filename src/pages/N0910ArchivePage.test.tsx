// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { TextbookItem, TextbookSection, TextbookUnit } from '../domain/textbookSchema'
import type { TextbookUnitProgress } from '../domain/textbook'
import { useAppStore } from '../stores/useAppStore'
import { N0910ArchivePage } from './N0910ArchivePage'
import n09Authored from '../data/textbook/math/numbers/n09Authored.json'
import n10Authored from '../data/textbook/math/numbers/n10Authored.json'
import n08Authored from '../data/textbook/math/numbers/n08Authored.json'
import n11Authored from '../data/textbook/math/numbers/n11Authored.json'
import { validateTextbookUnits } from '../domain/textbookSchema'

vi.mock('../components/textbook/GuidedMathReadingFlow', () => ({
  GuidedMathReadingFlow: ({ unit, section, progress, onReviewAnswer, storageScope }: { unit: TextbookUnit; section: TextbookSection; progress?: TextbookUnitProgress; onReviewAnswer: (item: TextbookItem, value: string) => void; storageScope?: string }) => <div data-testid="archive-reading-flow" data-revision={unit.revision} data-storage-scope={storageScope}>
    <output data-testid="preview-answers">{JSON.stringify(progress?.answers ?? {})}</output>
    <button onClick={() => onReviewAnswer(section.items[0], section.items[0].answer)}>旧版で試し解答</button>
  </div>,
}))
const id = (code: 'n09' | 'n10') => 'math-numbers-expressions-' + code
const progress = (unitId: string, unitRevision: number): TextbookUnitProgress => ({ unitId, unitRevision, startedAt: 1, updatedAt: 2, answers: {} })
const oldAnswer = { itemId: 'archived-only', value: 'old', firstValue: 'wrong', isFirstCorrect: false, resolved: true, attemptCount: 2, firstAnsweredAt: 1, lastAnsweredAt: 2 }
beforeEach(() => { localStorage.clear(); useAppStore.setState({ textbookProgress: {} }) })
afterEach(() => { cleanup(); useAppStore.setState({ textbookProgress: {} }); localStorage.clear() })
const show = (code: 'n09' | 'n10') => render(<MemoryRouter><N0910ArchivePage code={code} /></MemoryRouter>)

describe('N09/N10旧版の隔離比較', () => {
  it.each([['n09', 3], ['n10', 2]] as const)('preserved %s第%i版を表示し通常新版へ戻る', (code, revision) => {
    show(code)
    expect(screen.getByTestId('archive-reading-flow').getAttribute('data-revision')).toBe(String(revision))
    expect(screen.getByTestId('archive-reading-flow').getAttribute('data-storage-scope')).toBe('archive-review:kyotsu-step-store')
    expect(screen.getByRole('link', { name: '現在の' + code.toUpperCase() + 'へ戻る' }).getAttribute('href')).toBe('/learning/textbook/' + id(code))
    expect(screen.getByTestId('preview-answers').textContent).toBe('{}')
  })
  it('版が一致する旧記録はcloneして表示し、試し解答はmain storeにもnested保存にも書かない', () => {
    const saved = { ...progress(id('n09'), 3), answers: { 'archived-only': oldAnswer } }
    useAppStore.setState({ textbookProgress: { [id('n09')]: saved } })
    const nestedKey = 'math-textbook-nested-v1:' + id('n09') + ':r4:fixture'
    localStorage.setItem(nestedKey, 'original-nested-record')
    const beforeStore = JSON.stringify(useAppStore.getState().textbookProgress), beforeStorage = localStorage.getItem(import.meta.env.VITE_STORAGE_NAMESPACE || 'kyotsu-step-store')
    show('n09')
    expect(screen.getByTestId('preview-answers').textContent).toContain('archived-only')
    fireEvent.click(screen.getByText('旧版で試し解答'))
    expect(screen.getByTestId('preview-answers').textContent).toContain('n09-q01-negative')
    expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(beforeStore)
    expect(localStorage.getItem(nestedKey)).toBe('original-nested-record')
    expect(localStorage.getItem(import.meta.env.VITE_STORAGE_NAMESPACE || 'kyotsu-step-store')).toBe(beforeStorage)
  })
  it('現storeが新版なら該当する実archiveを使い、新版の回答を旧版へ混ぜない', () => {
    const old = progress(id('n10'), 2)
    const saved = { ...progress(id('n10'), 3), answers: { 'new-only': { ...oldAnswer, itemId: 'new-only' } }, archivedRevisions: { '2': { unitRevision: 2, startedAt: old.startedAt, updatedAt: old.updatedAt, answers: { 'archived-only': oldAnswer } } } }
    useAppStore.setState({ textbookProgress: { [id('n10')]: saved } })
    const before = JSON.stringify(saved)
    show('n10')
    expect(screen.getByTestId('preview-answers').textContent).toContain('archived-only')
    expect(screen.getByTestId('preview-answers').textContent).not.toContain('new-only')
    fireEvent.click(screen.getByText('旧版で試し解答'))
    expect(JSON.stringify(useAppStore.getState().textbookProgress[id('n10')])).toBe(before)
  })
  it.each([undefined, { unitRevision: 3, startedAt: 1, updatedAt: 2, answers: { 'bad-archive': oldAnswer } }])('旧archiveがないか版が違えば未回答で開き、archiveを作らない', archive => {
    const saved = { ...progress(id('n10'), 3), answers: { 'new-only': oldAnswer }, ...(archive ? { archivedRevisions: { '2': archive } } : {}) }
    useAppStore.setState({ textbookProgress: { [id('n10')]: saved } })
    const before = JSON.stringify(saved)
    show('n10')
    expect(screen.getByTestId('preview-answers').textContent).toBe('{}')
    fireEvent.click(screen.getByText('旧版で試し解答'))
    expect(JSON.stringify(useAppStore.getState().textbookProgress[id('n10')])).toBe(before)
  })
  it('unitIdが違う記録は採用しない', () => {
    useAppStore.setState({ textbookProgress: { [id('n09')]: { ...progress('other-unit', 3), answers: { 'other-answer': oldAnswer } } } })
    show('n09')
    expect(screen.getByTestId('preview-answers').textContent).toBe('{}')
  })
  it('N08専用readerの既存cursor namespaceを変更しない', async () => {
    const { N08ReadingFlow } = await vi.importActual<typeof import('../components/textbook/N08ReadingFlow')>('../components/textbook/N08ReadingFlow')
    const unit = validateTextbookUnits([n08Authored.unit])[0], learnerKey = 'math-textbook-compact-v1:' + unit.unitId + ':r' + unit.revision
    localStorage.setItem(learnerKey, 'original-cursor')
    localStorage.setItem(learnerKey + ':scope:archive-review', 'unrelated-isolated-cursor')
    render(<MemoryRouter><N08ReadingFlow unit={unit} section={unit.sections[0]} progress={undefined} onReviewAnswer={() => undefined} /></MemoryRouter>)
    expect(localStorage.getItem(learnerKey)).toBe('0')
    expect(localStorage.getItem(learnerKey + ':scope:archive-review')).toBe('unrelated-isolated-cursor')
  })
  it.each([n09Authored, n10Authored, n11Authored])('実readerの比較cursorは旧本保存へ書かず、省略時のnamespaceは従来どおり', async authored => {
    const { GuidedMathReadingFlow: ActualReader } = await vi.importActual<typeof import('../components/textbook/GuidedMathReadingFlow')>('../components/textbook/GuidedMathReadingFlow')
    const unit = validateTextbookUnits([authored.unit])[0], learnerKey = 'math-textbook-compact-v1:' + unit.unitId + ':r' + unit.revision
    localStorage.setItem(learnerKey, 'original-learner-cursor')
    const scoped = render(<MemoryRouter><ActualReader unit={unit} section={unit.sections[0]} presentation={authored} progress={undefined} onReviewAnswer={() => undefined} storageScope="archive-review" /></MemoryRouter>)
    expect(localStorage.getItem(learnerKey)).toBe('original-learner-cursor')
    expect(localStorage.getItem(learnerKey + ':scope:archive-review')).toBe('0')
    scoped.unmount()
    const regular = render(<MemoryRouter><ActualReader unit={unit} section={unit.sections[0]} presentation={authored} progress={undefined} onReviewAnswer={() => undefined} /></MemoryRouter>)
    expect(localStorage.getItem(learnerKey)).toBe('0')
    expect(localStorage.getItem(learnerKey + ':scope:archive-review')).toBe('0')
    regular.unmount()
  })
})
