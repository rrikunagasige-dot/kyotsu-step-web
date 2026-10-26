import { useState } from 'react'
import { Link } from 'react-router-dom'
import { N08SolutionReadingFlow } from '../components/textbook/N08SolutionReadingFlow'
import original from '../data/textbook/math/numbers/n08Revision5.json'
import { validateTextbookUnits } from '../domain/textbookSchema'
import { answerTextbookItem, effectiveTextbookProgress } from '../domain/textbook'
import { useAppStore } from '../stores/useAppStore'

const unit = validateTextbookUnits([original.unit])[0]

/** Comparison is an isolated session; archived r5 records never become r6 part answers. */
export function N08Revision5Page({ originalMathLayout = false }: { originalMathLayout?: boolean }) {
  const saved = useAppStore(state => state.textbookProgress[unit.unitId])
  const [progress, setProgress] = useState(() => effectiveTextbookProgress(unit, saved))
  return <article className="textbook-unit-page" data-testid="n08-revision5-page">
    <header className="state-panel"><h1>N08 絶対値 — 変更前の版</h1>
      <p>ここでの試し解答は、現在の学習記録を変更しません。</p>
      <Link className="raised-link" to={'/learning/textbook/' + unit.unitId}>現在のN08へ戻る</Link>
    </header>
    <N08SolutionReadingFlow unit={unit} section={unit.sections[0]} progress={progress} originalMathLayout={originalMathLayout}
      onReviewAnswer={(item, choice) => setProgress(previous => answerTextbookItem(previous, unit, item, choice, Date.now()))} />
  </article>
}
