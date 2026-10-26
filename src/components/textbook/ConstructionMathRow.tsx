import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { InlineMath } from 'react-katex'
import { measureMathAxis, validateFrameEnvelope, type FrameEnvelope } from './axisGeometry'
import { AxisPartAdvances } from './axisGeometry'

export type AxisMathRow = { id: string; sourceNodeId: string; left: ReactNode; relation: ReactNode; right: ReactNode; hasSlots?: boolean; before?: ReactNode; after?: ReactNode; continuation?: boolean }
export type NeutralEnvelopeRun = ({ kind: 'math'; latex: string } | { kind: 'part'; partRef: string; candidates: string[]; minAdvancePx?: number })[]
export type NeutralFramePlan = { id: string; left: NeutralEnvelopeRun[]; relation: NeutralEnvelopeRun[]; right: NeutralEnvelopeRun[] }

/** Candidate fragments are deliberately isolated: this probe never renders a
 * future completed equation or picks the expected candidate for measurement. */
export function NeutralFrameProbe({ plan, onMeasure }: { plan: NeutralFramePlan; onMeasure: (envelope: FrameEnvelope) => void }) {
  const root = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const node = root.current
    if (!node) return
    let alive = true
    const measure = () => {
      if (!alive) return
      const partAdvances: Record<string, number> = {}
      const widths = (key: string) => [...node.querySelectorAll<HTMLElement>('[data-envelope-cell="' + key + '"]')].map(cell => [...cell.children].reduce((sum, item) => {
        const part = item as HTMLElement
        const candidates = [...part.querySelectorAll<HTMLElement>('[data-envelope-candidate]')]
        const width = candidates.length ? Math.max(Number(part.dataset.minAdvance) || 44, ...candidates.map(c => c.getBoundingClientRect().width + 12)) : part.getBoundingClientRect().width
        if (part.dataset.partRef) partAdvances[part.dataset.partRef] = Math.max(partAdvances[part.dataset.partRef] ?? 0, width)
        return sum + width
      }, 0))
      const leftPx = Math.max(0, ...widths('left')), relationPx = Math.max(0, ...widths('relation')), rightPx = Math.max(0, ...widths('right'))
      if (relationPx > 0 && leftPx + rightPx > 0) onMeasure({ id: plan.id, leftPx, relationPx, rightPx, partAdvances, source: 'all-candidates-neutral-syntax' })
    }
    measure()
    void document.fonts?.ready.then(measure)
    return () => { alive = false }
  }, [plan, onMeasure])
  return <span ref={root} className="axis-envelope-probe" aria-hidden="true" data-envelope-source="neutral-all-candidates">
    {(['left', 'relation', 'right'] as const).map(key => plan[key].map((run, index) => <span key={key + index} data-envelope-cell={key}>
      {run.map((part, i) => part.kind === 'math' ? <span key={i}><InlineMath math={part.latex || '\\mathstrut'} /></span> : <span key={i} data-part-ref={part.partRef} data-min-advance={part.minAdvancePx ?? 44}>{part.candidates.map((candidate, j) => <span key={j} data-envelope-candidate><InlineMath math={candidate} /></span>)}</span>)}
    </span>))}
  </span>
}

/** Fixed mathematical frame. Its envelope does not depend on the active draft;
 * the visible glyph union may compact inside it after resolution. */
export function ConstructionMathRow({ id, rows, envelope, number, visibleState }: { id: string; rows: AxisMathRow[]; envelope: FrameEnvelope; number?: number; visibleState?: unknown }) {
  const root = useRef<HTMLDivElement>(null), probe = useRef<HTMLSpanElement>(null)
  const [geometry, setGeometry] = useState<{ axis: number; narrow: boolean; below: boolean; status: string }>({ axis: 0, narrow: false, below: false, status: 'UNVERIFIED' })
  useLayoutEffect(() => {
    const node = root.current, axisProbe = probe.current
    if (!node || !axisProbe) return
    let alive = true, raf: number | undefined
    const update = () => {
      if (!alive || node.getBoundingClientRect().width <= 0) return
      const axis = measureMathAxis(axisProbe)
      if (axis.status !== 'VERIFIED' || !validateFrameEnvelope(envelope)) { setGeometry(g => g.status === 'UNVERIFIED' ? g : { ...g, status: 'UNVERIFIED' }); return }
      const available = node.clientWidth
      node.style.setProperty('--axis-body-width', available + 'px')
      const fullWidth = envelope.leftPx + envelope.relationPx + envelope.rightPx + 8
      const narrow = fullWidth > available
      const frameWidth = narrow ? Math.max(envelope.leftPx, envelope.relationPx + envelope.rightPx + 4) : fullWidth
      const below = number !== undefined && (available - frameWidth) / 2 < 40
      setGeometry(old => old.axis === axis.axisPx && old.narrow === narrow && old.below === below && old.status === 'VERIFIED' ? old : { axis: axis.axisPx, narrow, below, status: 'VERIFIED' })
      const anchor = node.querySelector<HTMLElement>('[data-construction-number-anchor="true"] .axis-cell--right .axis-run > [data-axis-baseline]')
      const label = node.querySelector<HTMLElement>('.axis-number')
      const marker = label?.querySelector<HTMLElement>('[data-axis-number-baseline]')
      if (anchor && label && marker && !below) {
        const top = anchor.getBoundingClientRect().top - node.getBoundingClientRect().top - (marker.getBoundingClientRect().top - label.getBoundingClientRect().top)
        if (node.style.getPropertyValue('--axis-number-top') !== top + 'px') node.style.setProperty('--axis-number-top', top + 'px')
      }
      node.dispatchEvent(new Event('axis-layout', { bubbles: true }))
    }
    const schedule = () => { if (raf === undefined) raf = requestAnimationFrame(() => { raf = undefined; update() }) }
    update()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule)
    observer?.observe(node)
    void document.fonts?.ready.then(schedule)
    window.addEventListener('resize', schedule)
    return () => { alive = false; if (raf !== undefined) cancelAnimationFrame(raf); observer?.disconnect(); window.removeEventListener('resize', schedule) }
  }, [envelope, rows, number, geometry.narrow, geometry.below])
  const width = geometry.narrow ? Math.max(envelope.leftPx, envelope.relationPx + envelope.rightPx + 4) : envelope.leftPx + envelope.relationPx + envelope.rightPx + 8
  const style = { '--axis-offset': geometry.axis + 'px', '--axis-left': (geometry.narrow ? 0 : envelope.leftPx) + 'px', '--axis-relation': envelope.relationPx + 'px', '--axis-right': envelope.rightPx + 'px', '--axis-frame-width': width + 'px' } as CSSProperties
  const cell = (content: ReactNode, name: string, hit: boolean, line = 0) => <span data-axis-physical-line={line} data-axis-cell={name} className={'axis-cell axis-cell--' + name}><span className="axis-run">{hit && <span className="axis-hit-strut" aria-hidden="true" />}<i className="axis-baseline" data-axis-baseline aria-hidden="true" />{content}</span></span>
  return <AxisPartAdvances.Provider value={envelope.partAdvances ?? {}}><div ref={root} style={style} className="axis-group" data-axis-group={id} data-construction-group={id} data-axis-status={geometry.status} data-envelope-id={envelope.id} data-number-row-ref={rows.at(-1)?.id} data-visible-state={visibleState === undefined ? undefined : JSON.stringify(visibleState)}>
    <span ref={probe} className="axis-probe" aria-hidden="true"><i className="axis-baseline" data-axis-baseline /><InlineMath math={'\\frac{\\mathstrut 0}{\\mathstrut 0}'} /></span>
    <div className="axis-frame" data-math-frame style={{ width }}>
      {rows.map(row => <div className="axis-row-scope" key={row.id}>
        {row.before}
        <div className={'axis-equation' + (geometry.narrow && !row.continuation ? ' axis-equation--wrap' : '')} data-axis-layout={geometry.narrow && !row.continuation ? 'wrapped' : 'single'} data-axis-row={row.id} data-node-id={row.sourceNodeId} data-construction-row={row.id} data-source-node={row.sourceNodeId} data-construction-number-anchor={row.id === rows.at(-1)?.id ? 'true' : undefined}>
          {cell(row.left, 'left', Boolean(row.hasSlots))}{cell(row.relation, 'relation', Boolean(row.hasSlots), geometry.narrow && !row.continuation ? 1 : 0)}{cell(row.right, 'right', Boolean(row.hasSlots), geometry.narrow && !row.continuation ? 1 : 0)}
        </div>{row.after}
      </div>)}
    </div>
    {number !== undefined && <span className={'axis-number' + (geometry.below ? ' axis-number--below' : '')} data-equation-number={number}><i className="axis-baseline" data-axis-number-baseline aria-hidden="true" />({number})</span>}
  </div></AxisPartAdvances.Provider>
}
