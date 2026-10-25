import { useEffect, useState } from 'react'
import { InlineMath } from 'react-katex'
import { SolutionReadingSchema, solutionFrontier, type SolutionAnswer, type SolutionPart } from '../../domain/solutionReading'
import './solution-reading.css'
import { SolutionQuadraticPlot } from './SolutionQuadraticPlot'

type Props = {
  presentation: unknown
  answers: Record<string, SolutionAnswer>
  onAnswer: (interactionId: string, value: string) => void
  onComplete?: (complete: boolean) => void
}

function Parts({ parts, onSlot, resolved }: { parts: SolutionPart[]; onSlot?: (id: string) => void; resolved?: Record<string, string> }) {
  return <>{parts.map(part => {
    if (part.type === 'math') return <span key={part.id} data-semantic-id={part.id}><InlineMath math={part.latex} /></span>
    if (part.type === 'term' && part.usage === 'first_definition') return <strong key={part.id} data-semantic-id={part.id} className="solution-term">{part.text}</strong>
    if (part.type === 'slot') return resolved?.[part.interactionId] !== undefined
      ? <span key={part.id} data-semantic-id={part.id}><InlineMath math={resolved[part.interactionId]} /></span>
      : <button key={part.id} type="button" data-semantic-id={part.id} onClick={() => onSlot?.(part.interactionId)} aria-label={`${part.label}の回答を選ぶ`}>{part.label}</button>
    return <span key={part.id} data-semantic-id={part.id}>{part.text}</span>
  })}</>
}

/** Opt-in whole-problem view. It never changes old item IDs or counts slots as attempts. */
export function SolutionReadingFlow(props: Props) {
  const parsed = SolutionReadingSchema.safeParse(props.presentation)
  if (!parsed.success) return <p role="alert">教材データの形式を確認してください。</p>
  return <ValidatedSolutionFlow {...props} data={parsed.data} />
}

function ValidatedSolutionFlow({ data, answers, onAnswer, onComplete }: Props & { data: ReturnType<typeof SolutionReadingSchema.parse> }) {
  const [problemIndex, setProblemIndex] = useState(0)
  const [active, setActive] = useState<string | null>(null)
  const [hints, setHints] = useState<Record<string, number>>({})
  const problem = data.problems[Math.min(problemIndex, data.problems.length - 1)]
  const frontier = solutionFrontier(problem, answers)
  const complete = frontier === problem.steps.length
  const allComplete = data.problems.every(p => solutionFrontier(p, answers) === p.steps.length)
  useEffect(() => { onComplete?.(allComplete) }, [allComplete, onComplete])

  return <article className="solution-reading" data-solution-problem={problem.id} data-layout={problem.layout}>
    <header><span className="solution-role">{problem.layout === 'concept' ? '考え方' : '例題'}</span><h3>{problem.title}</h3>
      <p><Parts parts={problem.prompt} /></p>{problem.goal !== problem.title && <p className="solution-goal">{problem.goal}</p>}
    </header>
    {problem.conditions.length > 0 && <div className="solution-conditions"><strong>条件</strong><p><Parts parts={problem.conditions} /></p></div>}
    <div className="solution-equation" data-state-id={problem.initial.id}><div className="solution-math"><InlineMath math={problem.initial.latex} /></div></div>
    <div className="solution-work">
      {problem.steps.slice(0, Math.min(frontier + 1, problem.steps.length)).map((step, index) => {
        const done = index < frontier || !step.interaction
        const q = step.interaction
        const record = q ? answers[q.id] : undefined
        const choice = q?.choices.find(c => c.value === record?.value)
        const content = (parts: SolutionPart[]) => parts.map(p => p.type === 'math' ? p.latex : p.type === 'slot' ? p.label : p.text).join('\n')
        const showFeedback = choice && (!done || content(choice.feedback) !== content(step.reason))
        const open = q && active === q.id && !done
        return <section key={step.id} className="solution-step" data-step-id={step.id} data-state={done ? 'complete' : 'current'}>
          <p><Parts parts={step.purpose} /></p>
          {step.promptParts.length > 0 && <p><Parts parts={step.promptParts} onSlot={setActive} resolved={done && q ? { [q.id]: q.correctValue } : undefined} /></p>}
          <div className="solution-equation" data-equation-id={step.formula.id}>
            {q && !done ? <button type="button" className="solution-math solution-math-button" data-testid={`solution-answer-${q.id}`} data-binding={q.id} data-slot-ids={step.binding?.slotIds.join(',')} aria-label={q.action} aria-expanded={Boolean(open)} onClick={() => setActive(q.id)}>
              <InlineMath math={step.formula.masked} />
            </button> : <div className="solution-math" data-state-id={step.afterId}><InlineMath math={step.formula.completed} /></div>}
            <span className="solution-number">({step.formula.number})</span>
          </div>
          {open && <div className="solution-choice-panel" role="group" aria-label={q.action}>
            {q.choices.map(c => <button type="button" key={c.id} data-choice-id={c.id} onClick={() => onAnswer(q.id, c.value)}>
              {c.rows.length > 0 ? c.rows.map(row => <span className="solution-option-row" key={row.id} data-semantic-id={row.id}><InlineMath math={row.latex} /></span>) : c.isMath ? <InlineMath math={c.value} /> : c.value}
            </button>)}
            {(hints[q.id] ?? 0) < q.hints.length && <button type="button" className="solution-hint" onClick={() => setHints(h => ({ ...h, [q.id]: (h[q.id] ?? 0) + 1 }))}>ヒントを見る</button>}
            {q.hints.slice(0, hints[q.id] ?? 0).map((hint, hi) => <p key={hi}><Parts parts={hint} /></p>)}
          </div>}
          {showFeedback && <p className="solution-feedback" role="status"><Parts parts={choice.feedback} /></p>}
          {step.detail.length > 0 && <details><summary>補助計算を見る</summary><p><Parts parts={step.detail} /></p></details>}
          {done && <><p className="solution-reason"><Parts parts={step.reason} /></p><p><Parts parts={step.afterText} /></p></>}
        </section>
      })}
    </div>
    {problem.plot && problem.steps.slice(0, frontier).some(s => s.afterId === problem.plot?.visibleAfterStateId) && <SolutionQuadraticPlot plot={problem.plot} />}
    {complete && <details className="solution-summary"><summary>一問の解法をまとめて読む</summary>
      <div className="solution-equation"><InlineMath math={problem.initial.latex} /></div>
      {problem.steps.map(step => <div className="solution-equation" key={step.id}><div className="solution-math"><InlineMath math={step.formula.completed} /></div><span className="solution-number">({step.formula.number})</span></div>)}
    </details>}
    <nav aria-label="例題の移動">
      {problemIndex > 0 && <button type="button" onClick={() => { setProblemIndex(problemIndex - 1); setActive(null) }}>前の例題</button>}
      {complete && problemIndex < data.problems.length - 1 && <button type="button" onClick={() => { setProblemIndex(problemIndex + 1); setActive(null) }}>次の例題</button>}
    </nav>
  </article>
}
