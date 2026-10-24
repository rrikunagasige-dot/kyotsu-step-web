import { useLayoutEffect, useMemo, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { InlineMath } from 'react-katex'
import katex from 'katex'
import { normalizeTextbookMath } from '../../domain/textbookMath'
import { typesettingGroup } from '../../data/textbook/math/typesetting'
import { typesetRows, type TypesetPlan } from './typesetRows'

type Props = { source: string; sourceId: string; unitId: string; parts?: readonly ReactNode[]; itemIds?: Readonly<Record<number, string>> }
type Dimensions = { left: number; right: number; relation: number; widest: number; width: number }
const noItems: Readonly<Record<number, string>> = {}
const noParts: readonly ReactNode[] = []
const dimensions = new WeakMap<HTMLElement, Dimensions>()
const math = (source: string) => /^[+\-=]/.test(source) ? '{}' + source : source
const markerPattern = /(§(?:\d+|a\d+|z\d+)§)/

function alignGroup(root: HTMLElement) {
  const group = root.dataset.typesetGroup
  const scope = root.closest('.first-theme-recorded-results, .math-textbook-stage-reference-content, .math-textbook-stage-detail, .reading-derivation-chain, .math-textbook-stage') ?? root.parentElement
  const own = dimensions.get(root)
  if (!own) return
  const peers = group && scope ? [...scope.querySelectorAll<HTMLElement>('[data-typeset-group]')].filter(node => node.dataset.typesetGroup === group && Math.abs(node.clientWidth - own.width) < 2) : [root]
  const sizes = peers.map(node => dimensions.get(node)).filter((d): d is Dimensions => Boolean(d))
  const left = Math.max(own.left, ...sizes.map(d => d.left)), right = Math.max(own.right, ...sizes.map(d => d.right))
  for (const node of peers.length ? peers : [root]) {
    const d = dimensions.get(node)
    if (!d) continue
    const common = left + right + d.relation + 8 <= d.width
    const l = common ? left : d.left, r = common ? right : d.right
    const widest = common ? Math.max(d.widest, ...sizes.map(size => size.widest)) : d.widest
    node.style.setProperty('--typeset-left', l + 'px')
    node.style.setProperty('--typeset-right', r + 'px')
    node.style.setProperty('--typeset-body', Math.min(d.width, Math.max(widest, l + r + d.relation + 8)) + 'px')
    node.dispatchEvent(new Event('typeset-layout', { bubbles: true }))
  }
}

/** Source pieces and existing React controls stay intact. The hidden probe only
 * measures already visible mathematics/controls; it never receives future keys. */
export function TypesetFormula({ source, sourceId, unitId, parts = noParts, itemIds = noItems }: Props) {
  const root = useRef<HTMLSpanElement>(null)
  const initial = useMemo(() => typesetRows(source, Infinity, s => s.length), [source])
  const [layout, setLayout] = useState<{ source: string; plan: TypesetPlan } | undefined>()
  const plan = layout?.source === source ? layout.plan : initial
  const group = typesettingGroup(unitId, sourceId)
  const snapshot = useRef('')
  useLayoutEffect(() => {
    const node = root.current
    if (!node) return
    let alive = true
    const update = () => {
      if (!alive || node.clientWidth < 1) return
      const width = node.clientWidth, cache = new Map<string, number>()
      const measure = (source: string) => {
        if (!source) return 0
        const previous = cache.get(source)
        if (previous !== undefined) return previous
        const probe = document.createElement('span')
        probe.className = 'typeset-cell-content typeset-probe'
        probe.setAttribute('aria-hidden', 'true')
        for (const part of source.split(markerPattern).filter(Boolean)) {
          if (/^§[az]\d+§$/.test(part)) continue
          const choice = /^§(\d+)§$/.exec(part)
          if (choice) {
            const id = itemIds[Number(choice[1])]
            const actual = id ? node.querySelector<HTMLElement>('[data-testid="textbook-item-' + id + '"]') : null
            const clone = actual?.cloneNode(true) as HTMLElement | undefined
            if (clone) { clone.removeAttribute('data-testid'); clone.removeAttribute('id'); clone.tabIndex = -1; probe.append(clone) }
            else { const blank = document.createElement('span'); blank.className = 'reading-formula-choice'; blank.textContent = '選択'; probe.append(blank) }
          } else {
            const span = document.createElement('span')
            span.className = 'reading-formula-math'
            span.innerHTML = katex.renderToString(math(part), { output: 'html', strict: 'ignore', throwOnError: true })
            probe.append(span)
          }
        }
        node.append(probe)
        const size = probe.getBoundingClientRect().width
        probe.remove(); cache.set(source, size)
        return size
      }
      const next = typesetRows(source, width - 1, measure)
      const eq = next.rows.filter(row => row.kind === 'equation')
      dimensions.set(node, { width, left: Math.max(0, ...eq.map(row => measure(row.lhs ?? ''))), right: Math.max(0, ...eq.map(row => measure(row.rhs ?? ''))), relation: measure('='), widest: Math.max(0, ...next.rows.map(row => measure(row.latex) + (row.kind === 'continuation' ? 18 : 0))) })
      const serialized = JSON.stringify({ source, plan: next })
      if (snapshot.current !== serialized) { snapshot.current = serialized; setLayout({ source, plan: next }) }
      alignGroup(node)
    }
    update()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    observer?.observe(node)
    void document.fonts?.ready.then(update)
    return () => { alive = false; observer?.disconnect(); dimensions.delete(node) }
  }, [source, sourceId, itemIds])
  useLayoutEffect(() => { if (root.current) alignGroup(root.current) }, [layout])

  let answerIndex: number | undefined
  const marked = new Set<number>()
  const render = (source: string): ReactNode[] => source.split(markerPattern).filter(Boolean).map((part, i) => {
    const start = /^§a(\d+)§$/.exec(part)
    if (start) { answerIndex = Number(start[1]); return null }
    if (/^§z\d+§$/.test(part)) { answerIndex = undefined; return null }
    const choice = /^§(\d+)§$/.exec(part)
    if (choice) return <span key={i}>{parts[Number(choice[1])]}</span>
    const id = answerIndex !== undefined && !marked.has(answerIndex) ? itemIds[answerIndex] : undefined
    if (answerIndex !== undefined && id) marked.add(answerIndex)
    return <span className="reading-formula-math" data-testid={id ? 'resolved-' + id : undefined} key={i}><InlineMath math={math(part)} /></span>
  })
  const polynomial = unitId.endsWith('-n02') && sourceId.replace(/^s5-record-/, '') === 'n02-s4-sum-align'
  const table = polynomial ? [['A', '=', '2x^3', '-3x^2', '+1x', '-1'], ['B', '=', '-x^3', '+2x^2', '+0x', '+2']] : plan.table
  const sourceKey = sourceId.replace(/^s5-record-/, '')
  return <span ref={root} className="reading-formula-line reading-formula-line--aligned reading-formula-line--typeset" data-testid={'textbook-formula-' + sourceId} data-latex-status="ok" data-typeset-source={sourceKey} data-typeset-group={group} data-typeset-kind={plan.independent || table ? 'independent' : 'chain'}>
    {table ? <span className={'typeset-table' + (polynomial ? ' typeset-table--polynomial' : '') + (sourceKey === 'n03-s4-rules-summary' ? ' typeset-table--laws' : '')} role="table" style={{ '--typeset-columns': table[0].length } as CSSProperties}>
      {table.map((row, i) => <span className="typeset-table-row typeset-line" role="row" key={i}>{row.map((cell, j) => <span className="typeset-table-cell" role="cell" key={j}>{/^\\text\{([^}]+)\}$/.test(cell) ? cell.slice(6, -1) : <InlineMath math={cell} />}</span>)}</span>)}
    </span> : <span className="first-theme-formula-rows typeset-formula-body">
      {plan.rows.map((row, i) => <span className={'typeset-line' + (row.kind === 'equation' ? ' typeset-line--equation' : '') + (row.kind === 'continuation' ? ' typeset-line--continuation' : '')} data-row-kind={row.kind} key={i}>
        {row.kind === 'equation' ? <>
          <span className="typeset-left"><span className="typeset-cell-content">{render(row.lhs ?? '')}</span></span>
          <span className="typeset-relation"><InlineMath math="=" /></span>
          <span className="typeset-right"><span className="typeset-cell-content">{render(row.rhs ?? '')}</span></span>
        </> : <>{row.product && <span className="typeset-product-continuation" aria-label="掛け算の続き">·</span>}<span className="typeset-cell-content">{render(row.latex)}</span></>}
      </span>)}
    </span>}
  </span>
}

/** Keep short mathematics in prose; long original expressions become display
 * lines inside the same paragraph, without rewriting any of its words. */
export function TypesetInlineMath({ latex, sourceId, unitId }: { latex: string; sourceId: string; unitId: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [long, setLong] = useState(false)
  const normalized = normalizeTextbookMath(latex)
  useLayoutEffect(() => {
    const node = ref.current, parent = node?.closest('.reading-paragraph')
    if (!node || !parent) return
    let alive = true
    const update = () => {
      if (!alive) return
      const probe = document.createElement('span')
      probe.className = 'typeset-inline-probe'
      probe.innerHTML = katex.renderToString(normalized, { output: 'html', strict: 'ignore' })
      node.append(probe)
      const wanted = probe.getBoundingClientRect().width > parent.clientWidth * .62
      probe.remove(); setLong(value => value === wanted ? value : wanted)
    }
    update()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    observer?.observe(parent); void document.fonts?.ready.then(update)
    return () => { alive = false; observer?.disconnect() }
  }, [normalized])
  return <span ref={ref} className={'typeset-inline-math' + (long ? ' typeset-inline-math--display' : '')}>{long ? <TypesetFormula source={normalized} sourceId={sourceId} unitId={unitId} /> : <InlineMath math={normalized} />}</span>
}
