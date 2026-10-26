import { useState } from 'react'
import { Link } from 'react-router-dom'
import { N08ConstructionReadingFlow } from '../components/textbook/N08ConstructionReadingFlow'
import source from '../data/textbook/math/numbers/n08Revision6.json'
import { validateTextbookUnits } from '../domain/textbookSchema'
import { answerTextbookItem, effectiveTextbookProgress } from '../domain/textbook'
import { useAppStore } from '../stores/useAppStore'

const unit = validateTextbookUnits([source.unit])[0]

/** The preserved reader owns its temporary construction draft in review mode.
 * Both ordinary answers and construction choices remain outside the live store. */
export function N08Revision6Page() {
  const saved = useAppStore(state => state.textbookProgress[unit.unitId])
  const [progress, setProgress] = useState(() => effectiveTextbookProgress(unit, saved))
  return <article className="textbook-unit-page" data-testid="n08-revision6-page">
    <header className="state-panel"><h1>N08 絶対値 — 第6版</h1>
      <p>ここでの試し解答は、現在の学習記録を変更しません。</p>
      <Link className="raised-link" to={'/learning/textbook/' + unit.unitId}>現在のN08へ戻る</Link>
    </header>
    <N08ConstructionReadingFlow unit={unit} section={unit.sections[0]} progress={progress}
      onReviewAnswer={(item, choice) => setProgress(previous => answerTextbookItem(previous, unit, item, choice, Date.now()))} />
  </article>
}
