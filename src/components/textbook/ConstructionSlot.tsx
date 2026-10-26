import { InlineMath } from 'react-katex'

type Props = {
  parentId: string
  partId: string
  label: string
  valueLatex?: string
  active?: boolean
  wrong?: boolean
  panelId: string
  onActivate: () => void
}

/** The compact visible box sits inside a real 44px target; hit areas never
 * extend over a neighbouring part through an overlapping pseudo-element. */
export function ConstructionSlot({ parentId, partId, label, valueLatex, active = false, wrong = false, panelId, onActivate }: Props) {
  return <button type="button" className={'construction-part-hit' + (active ? ' construction-part-hit--active' : '') + (wrong ? ' construction-part-hit--wrong' : '')}
    data-construction-parent={parentId} data-construction-part={partId} data-testid={'construction-part-' + partId}
    aria-label={label} aria-expanded={active} aria-controls={panelId} aria-invalid={wrong || undefined} onClick={onActivate}>
    <span className="construction-part-box" aria-hidden="true">{valueLatex !== undefined ? <InlineMath math={valueLatex} /> : <span className="construction-part-empty" />}</span>
  </button>
}
