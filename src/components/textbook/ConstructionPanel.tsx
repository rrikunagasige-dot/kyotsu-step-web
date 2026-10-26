import { InlineMath } from 'react-katex'

export type ConstructionChoice = { value: string; latex: string }
type Props = {
  parentId: string
  partId: string
  label: string
  choices: ConstructionChoice[]
  value?: string
  wrong?: boolean
  feedback?: string
  onSelect: (value: string) => void
}

export function ConstructionPanel({ parentId, partId, label, choices, value, wrong = false, feedback, onSelect }: Props) {
  return <div id={'construction-panel-' + partId} className="construction-choice-panel" data-construction-panel={parentId} data-testid={'construction-panel-' + partId}>
    <fieldset>
      <legend>{label}</legend>
      {wrong && feedback && <p className="construction-feedback" role="status">{feedback}</p>}
      <div className="construction-choice-options">
        {choices.map((choice, index) => <button type="button" key={choice.value} className="construction-choice-option"
          data-testid={'construction-choice-' + partId + '-' + index} aria-label={choice.value}
          aria-pressed={value === choice.value} aria-invalid={Boolean(wrong && value === choice.value) || undefined}
          onClick={() => onSelect(choice.value)}>
          <span className="construction-choice-index" aria-hidden="true">{index + 1}</span>
          <span className="construction-choice-math"><InlineMath math={choice.latex} /></span>
        </button>)}
      </div>
    </fieldset>
  </div>
}
