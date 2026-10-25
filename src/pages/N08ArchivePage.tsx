import { useState } from 'react'
import { Link } from 'react-router-dom'
import { N08ReadingFlow } from '../components/textbook/N08ReadingFlow'
import original from '../data/textbook/math/numbers/n08Authored.json'
import { validateTextbookUnits } from '../domain/textbookSchema'
import { answerTextbookItem, effectiveTextbookProgress } from '../domain/textbook'
import { useAppStore } from '../stores/useAppStore'

const unit = validateTextbookUnits([original.unit])[0]

/** Archive answers are local to this view. The ordinary progress store is never written. */
export function N08ArchivePage() {
  const saved = useAppStore(state => state.textbookProgress[unit.unitId])
  const [progress, setProgress] = useState(() => effectiveTextbookProgress(unit, saved))
  return <article className="textbook-unit-page" data-testid="n08-archive-page">
    <header className="state-panel"><h1>N08 絶対値 — 以前の版</h1>
      <p>修正前の内容です。ここでの試し解答は、現在の学習記録を変更しません。</p>
      <Link className="raised-link" to={'/learning/textbook/' + unit.unitId}>現在のN08へ戻る</Link>
    </header>
    <N08ReadingFlow unit={unit} section={unit.sections[0]} progress={progress}
      onReviewAnswer={(item, choice) => setProgress(previous => answerTextbookItem(previous, unit, item, choice, Date.now()))} />
  </article>
}
