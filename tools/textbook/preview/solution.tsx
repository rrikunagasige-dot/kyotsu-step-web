import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import { SolutionReadingFlow } from '../../../src/components/textbook/SolutionReadingFlow'
import type { SolutionAnswer, SolutionReading } from '../../../src/domain/solutionReading'
import linear from '../fixtures/solution-generated/linear-reading.json'
import square from '../fixtures/solution-generated/square-reading.json'
import extrema from '../fixtures/solution-generated/extrema-reading.json'
import './solution.css'

const examples: Record<string, unknown> = { linear, square, extrema }
const family = new URLSearchParams(location.search).get('family') ?? 'linear'
const presentation = examples[family] ?? linear
const storageKey = 'kyotsu-step-implementation-fixture-solution-1:' + family
export function Fixture() {
  const [answers, setAnswers] = useState<Record<string, SolutionAnswer>>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) ?? '{}') } catch { return {} }
  })
  function answer(id: string, value: string) {
    const q = (presentation as SolutionReading).problems.flatMap(p => p.steps).find(s => s.interaction?.id === id)?.interaction
    const next = { ...answers, [id]: { value, resolved: value === q?.correctValue } }
    setAnswers(next); localStorage.setItem(storageKey, JSON.stringify(next))
  }
  return <main><aside>実装検証用の自作例題・教材の承認対象外</aside><SolutionReadingFlow presentation={presentation} answers={answers} onAnswer={answer} /></main>
}
createRoot(document.getElementById('root')!).render(<Fixture />)
