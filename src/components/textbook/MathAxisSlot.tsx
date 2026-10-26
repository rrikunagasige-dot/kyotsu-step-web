import { useContext, useLayoutEffect, useRef, type CSSProperties } from 'react'
import { InlineMath } from 'react-katex'
import { AxisPartAdvances } from './axisGeometry'

export type MathAxisSlotProps = {
  parentId: string; partId: string; label: string; panelId: string
  valueLatex?: string; active?: boolean; wrong?: boolean; editable?: boolean
  advancePx?: number; onActivate: () => void
}

/** The in-flow mathematical strut supplies the baseline; the absolute button
 * supplies an independently measured, non-overlapping 44px hit target. */
export function MathAxisSlot({ parentId, partId, label, panelId, valueLatex, active = false, wrong = false, editable = true, advancePx = 44, onActivate }: MathAxisSlotProps) {
  const root = useRef<HTMLSpanElement>(null)
  const advances = useContext(AxisPartAdvances)
  useLayoutEffect(() => {
    const node = root.current
    if (!node) return
    const update = () => {
      const baseline = node.querySelector<HTMLElement>(':scope > [data-axis-baseline]')
      if (baseline) node.style.setProperty('--axis-local-baseline', baseline.getBoundingClientRect().top - node.getBoundingClientRect().top + 'px')
    }
    update()
    let alive = true
    void document.fonts?.ready.then(() => { if (alive) update() })
    return () => { alive = false }
  }, [valueLatex])
  return <span ref={root} className={'axis-slot' + (active ? ' axis-slot--active' : '') + (wrong ? ' axis-slot--wrong' : '')}
    style={{ '--axis-slot-advance': Math.max(44, advances[partId] ?? advancePx) + 'px' } as CSSProperties}
    data-axis-slot={partId} data-construction-parent={parentId} data-construction-part={partId} data-slot-editable={editable}>
    <i className="axis-baseline" data-axis-baseline aria-hidden="true" />
    {editable && <button type="button" className="axis-slot-hit" data-testid={'construction-part-' + partId} data-part-id={partId}
      aria-label={label} aria-expanded={active} aria-controls={panelId} aria-invalid={wrong || undefined} onClick={onActivate}>
      <span className="axis-slot-box" aria-hidden="true" />
    </button>}
    <span className={'axis-slot-ink' + (valueLatex === undefined ? ' axis-slot-ink--empty' : '')} aria-hidden={editable || undefined}>
      <InlineMath math={valueLatex ?? '\\mathstrut'} />
    </span>
  </span>
}
