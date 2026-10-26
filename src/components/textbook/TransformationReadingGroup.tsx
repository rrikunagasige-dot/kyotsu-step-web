import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { InlineMath } from 'react-katex'
import { NumberedEquation } from './NumberedEquation'
import type { TransformationFormula, VisibleTransformationGroup } from '../../domain/transformationReading'
import './transformation-reading.css'
type Props = { group: VisibleTransformationGroup; renderSlot: (id: string) => ReactNode; renderPanel: (id: string) => ReactNode }
/** A relation belongs to each statement. Adjacent inequalities never become an equality chain. */
export function TransformationReadingGroup({ group, renderSlot, renderPanel }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [stacked, setStacked] = useState(false)
  useLayoutEffect(() => {
    const node = root.current
    if (!node) return
    let active = true
    const measure = () => {
      if (!active) return
      const rows = [...node.querySelectorAll<HTMLElement>('.transformation-equation')]
      const cells = (name: string) => rows.map(r => r.querySelector<HTMLElement>(name + ' > .transformation-cell-content')?.scrollWidth ?? 0)
      const left = Math.max(0, ...cells('.transformation-left')), right = Math.max(0, ...cells('.transformation-right')), relation = Math.max(0, ...cells('.transformation-relation'))
      node.style.setProperty('--transformation-left', left + 'px')
      node.style.setProperty('--transformation-right', right + 'px')
      node.style.setProperty('--transformation-relation', relation + 'px')
      setStacked(left + right + relation + 16 > node.clientWidth)
      node.dispatchEvent(new Event('typeset-layout', { bubbles: true }))
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(node)
    void document.fonts?.ready.then(measure)
    return () => { active = false; observer?.disconnect() }
  }, [group])
  const parts = (items: TransformationFormula['left']): ReactNode => items.map((part, i) => part.type === 'slot'
    ? <span key={part.id} data-slot-id={part.id}>{renderSlot(part.interactionRef)}</span>
    : part.type === 'fraction' ? <span className="transformation-fraction" key={i}><span>{parts(part.numerator)}</span><span>{parts(part.denominator)}</span></span> : <InlineMath key={i} math={part.latex} />)
  const prose = (row: VisibleTransformationGroup['rows'][number], key: 'before' | 'after') => row[key].length > 0 && <p className={'transformation-prose transformation-' + key}>{row[key].map((p, i) => p.type === 'math' ? <InlineMath key={i} math={p.latex} /> : p.type === 'term' ? <strong key={i}>{p.text}</strong> : <span key={i}>{p.text}</span>)}</p>
  // Keep one aligned expression chain: put the source expression left of the first equality.
  const rows = group.kind === 'expression-chain' && group.rows.length > 1
    ? group.rows.slice(1).map((row, index) => index === 0 ? { ...row, formula: { ...row.formula, left: group.rows[0].formula.right } } : row)
    : group.rows
  return <div ref={root} className={'transformation-reading-group' + (stacked ? ' transformation-reading-group--stacked' : '')} data-transformation-group={group.id} data-transformation-kind={group.kind}>
    <NumberedEquation number={group.number} logical>
      <div data-typeset-kind={group.kind}><div className="transformation-rows typeset-formula-body">
        {rows.map(row => <div key={row.id} className={'transformation-row transformation-row--' + row.role} data-transformation-row={row.id} data-source-node={row.sourceNodeId} data-state-ref={row.stateRef}>
          {row.aliasRefs.map(alias => <span key={alias} id={alias} data-equation-alias={alias} />)}
          {prose(row, 'before')}
          <div className="transformation-equation typeset-line" data-relation={row.formula.relation}>
            <span className="transformation-left"><span className="transformation-cell-content">{parts(row.formula.left)}</span></span>
            <span className="transformation-relation"><span className="transformation-cell-content">{row.formula.relationSlot ? parts([row.formula.relationSlot]) : row.formula.relation ? <InlineMath math={row.formula.relation} /> : null}</span></span>
            <span className="transformation-right"><span className="transformation-cell-content">{parts(row.formula.right)}</span></span>
          </div>
          {row.current && renderPanel(row.current.id)}
          {prose(row, 'after')}
        </div>)}
      </div></div>
    </NumberedEquation>
  </div>
}
