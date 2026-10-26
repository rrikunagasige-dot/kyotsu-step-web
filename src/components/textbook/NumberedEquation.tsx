import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/** The label never changes the centered mathematical body's width. When its
 * last line occupies the label area, give only the label its own trailing row. */
export function NumberedEquation({ number, children, logical = false, anchorSelector }: { number: number; children: ReactNode; logical?: boolean; anchorSelector?: string }) {
  const body = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const [below, setBelow] = useState(false)
  const [offset, setOffset] = useState(0)
  useLayoutEffect(() => {
    const content = body.current, tag = label.current
    if (!content || !tag) return
    let active = true
    const measure = () => {
      if (!active) return
      const bounds = content.getBoundingClientRect(), marker = tag.getBoundingClientRect()
      const left = bounds.right - marker.width - 2
      // Hypothetical inline position, independent of the current fallback mode.
      const layout = content.querySelector<HTMLElement>('[data-typeset-kind]')
      const rows = Array.from(content.querySelectorAll<HTMLElement>(anchorSelector ?? '.typeset-line'))
      const group = layout?.querySelector<HTMLElement>('.typeset-formula-body, .typeset-table')?.getBoundingClientRect()
      const lastRow = rows.at(-1)
      const last = lastRow?.querySelectorAll<HTMLElement>('.katex').item((lastRow?.querySelectorAll('.katex').length ?? 1) - 1)?.getBoundingClientRect() ?? lastRow?.getBoundingClientRect()
      const top = logical && group ? layout?.dataset.typesetKind === 'independent'
        ? (group.top + group.bottom - marker.height) / 2
        : last ? (last.top + last.bottom - marker.height) / 2 + 1 : bounds.bottom - marker.height - 2
        : bounds.bottom - marker.height - 6
      const collision = Array.from(content.querySelectorAll<HTMLElement>('.reading-formula-wrap-group, .reading-formula-answer, .reading-formula-choice, .katex')).some(element => {
        const r = element.getBoundingClientRect()
        return r.width > 0 && r.bottom > top && r.top < (logical ? top + marker.height : bounds.bottom - 6) && r.right + 8 > left
      })
      setBelow(value => value === collision ? value : collision)
      if (logical) setOffset(value => { const next = collision ? bounds.height + 2 : top - bounds.top; return Math.abs(next - value) < .25 ? value : next })
    }
    content.addEventListener('typeset-layout', measure)
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(content)
    observer?.observe(tag)
    void document.fonts?.ready.then(measure)
    return () => { active = false; observer?.disconnect(); content.removeEventListener('typeset-layout', measure) }
  }, [children, number, logical, anchorSelector])
  return (
    <div className={'numbered-equation' + (below ? ' numbered-equation--below' : '')} data-equation-number={number}>
      <div className="numbered-equation-body" ref={body}>{children}</div>
      <span className="numbered-equation-label" ref={label} style={logical ? { top: offset, bottom: 'auto' } : undefined} aria-label={'式' + number}>({number})</span>
    </div>
  )
}
