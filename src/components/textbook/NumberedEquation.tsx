import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/** The label never changes the centered mathematical body's width. When its
 * last line occupies the label area, give only the label its own trailing row. */
export function NumberedEquation({ number, children }: { number: number; children: ReactNode }) {
  const body = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const [below, setBelow] = useState(false)
  useLayoutEffect(() => {
    const content = body.current, tag = label.current
    if (!content || !tag) return
    let active = true
    const measure = () => {
      if (!active) return
      const bounds = content.getBoundingClientRect(), marker = tag.getBoundingClientRect()
      const left = bounds.right - marker.width - 2
      // Hypothetical inline position, independent of the current fallback mode.
      const top = bounds.bottom - marker.height - 6
      const collision = Array.from(content.querySelectorAll<HTMLElement>('.reading-formula-wrap-group, .reading-formula-answer, .reading-formula-choice, .katex')).some(element => {
        const r = element.getBoundingClientRect()
        return r.width > 0 && r.bottom > top && r.top < bounds.bottom - 6 && r.right + 8 > left
      })
      setBelow(value => value === collision ? value : collision)
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(content)
    observer?.observe(tag)
    void document.fonts?.ready.then(measure)
    return () => { active = false; observer?.disconnect() }
  }, [children, number])
  return (
    <div className={'numbered-equation' + (below ? ' numbered-equation--below' : '')} data-equation-number={number}>
      <div className="numbered-equation-body" ref={body}>{children}</div>
      <span className="numbered-equation-label" ref={label} aria-label={'式' + number}>({number})</span>
    </div>
  )
}
