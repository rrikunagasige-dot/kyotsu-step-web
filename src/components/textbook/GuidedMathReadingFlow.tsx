import { useCallback, useId, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { InlineMath } from 'react-katex'
import katex from 'katex'
import { guidedMathDisplaySteps } from './guidedMathDisplayPolicy'
import { SemanticReading } from './SemanticReading'
import { TypesetFormula, TypesetInlineMath } from './TypesetFormula'
import { NumberedEquation } from './NumberedEquation'
import { effectiveTextbookProgress, getTextbookChoices, isTextbookItemResolved, normalizeTextbookAnswer, type TextbookUnitProgress } from '../../domain/textbook'
import type { TextbookItem, TextbookReadingBlock, TextbookReadingPart, TextbookSection, TextbookUnit } from '../../domain/textbookSchema'
import { useAppStore } from '../../stores/useAppStore'
import { SolutionReadingFlow } from './SolutionReadingFlow'
import { SolutionReadingSchema } from '../../domain/solutionReading'
import { useI18n } from '../../i18n/runtime'
import { TransformationReadingGroup } from './TransformationReadingGroup'
import { TransformationReadingSchema, projectTransformationView } from '../../domain/transformationReading'
import { ReadingStageFrame } from './ReadingStageFrame'
import { canonicalReadingSourceView, recordedReadingSourceView } from '../../domain/readingSourceViews'
import { readingLayoutBlockAttributes, readingLayoutChainAttributes, qf01ReadingLayoutProfile } from './readingLayoutPolicy'
import { TextbookFigure } from './TextbookFigure'
import { validateQF01R3Reading, qf01R3Solved, projectQF01R3Block, formatQF01R3Owner, qf01R3FormulaRecipe, type QF01R3FormulaRecipe, type QF01R3Validated } from '../../domain/transformationReading'
import { normalizeTextbookMath } from '../../domain/textbookMath'
import { typesetRows, type TypesetRow } from './typesetRows'
import './guided-math-reading.css'

type Props = {
  readingPresentation?: unknown
  readOnlyArchive?: boolean
  transformationPresentation?: unknown
  presentation: unknown; unit: TextbookUnit; section: TextbookSection; progress: TextbookUnitProgress | undefined
  onSummaryReached?: (reached: boolean) => void
  onReviewAnswer?: (item: TextbookItem, choice: string) => void
  /** An isolated cursor namespace; omitted preserves the existing learner key. */
  storageScope?: string
}
type Node = { id: string; stageId: string; goal: string; role: string; knownRefs: string[]; resultId: string; interaction: string | null; extra: { table?: { caption: string; headers: string[]; rows: string[][] }; figure?: { id: string }; calculationSupport?: string } }
type Display = { hintParts: TextbookReadingPart[][]; choices: Record<string, TextbookReadingPart[]>; feedback: Record<string, TextbookReadingPart[]> }
type Presentation = { choiceDisplay?: 'semantic'; code: string; nodes: Node[]; stages: { id: string; title: string; sourceQuestionParts: TextbookReadingPart[] }[]; semanticDisplay: Record<string, Display>; equationNumbers: Record<string, number>; semantic: { nodes: { id: string; before: TextbookReadingBlock[]; after: TextbookReadingBlock[] }[] } }
const roles: Record<string, string> = { example: '例題', definition: '定義', proof: '性質の導出', substep: '導出', check: '学んだことを使う', property: '性質', summary: 'まとめ' }

type R3Envelope = { width: number; left: number; relation: number; right: number; narrow: boolean; available: number; advances: Record<string, number>; overflow: boolean; rows: TypesetRow[] }
/** R3 only: the plan depends on the approved syntax and every candidate, never
 * on the answer key, current draft, solved state, or currently exposed rows. */
function R3FixedFormula({ recipe, group, sourceId, resolved, target }: { recipe: QF01R3FormulaRecipe; group: QF01R3FormulaRecipe[]; sourceId: string; resolved: boolean; target: ReactNode }) {
  const root = useRef<HTMLSpanElement>(null)
  const [envelope, setEnvelope] = useState<R3Envelope>()
  const template = recipe.kind === 'whole-target' && resolved ? recipe.canonicalFormula : recipe.template
  const tex = (value: string, binary = false) => normalizeTextbookMath(binary && /^[+\-=]/.test(value) ? '{}' + value : value)
  useLayoutEffect(() => {
    const node = root.current
    if (!node) return
    let alive = true, frame: number | undefined
    const update = () => {
      if (!alive || node.clientWidth < 1) return
      const available = node.clientWidth - 1, probe = document.createElement('span')
      probe.className = 'r3-neutral-probe'; probe.setAttribute('aria-hidden', 'true'); probe.inert = true
      node.append(probe)
      const cache = new Map<string, number>(), advances: Record<string, number> = {}
      const plain = (value: string, binary = false): number => {
        if (!value) return 0
        const key = (binary ? 'binary:' : 'ordinary:') + value
        const old = cache.get(key); if (old !== undefined) return old
        const segments = r3NeutralSegments(value)
        if (segments.length > 1) { const relationSpacing = 2 * plain('\\;'); const width = segments.reduce((sum, segment) => sum + plain(segment.latex) + (segment.relation ? relationSpacing : 0), 0); cache.set(key, width); return width }
        // Independent fragments only; no completed future lesson is assembled.
        const part = document.createElement('span'); part.innerHTML = katex.renderToString(tex(value, binary), { output: 'html', strict: 'ignore' }); probe.append(part)
        const width = part.getBoundingClientRect().width; part.remove(); cache.set(key, width); return width
      }
      try {
        for (const item of group) advances[item.blockId] = Math.ceil(Math.max(48, ...item.candidateLatex.map(candidate => plain(candidate) + 12)))
        const measure = (item: QF01R3FormulaRecipe) => (value: string) => value.split('§0§').reduce((sum, fragment, index) => sum + plain(fragment, index > 0) + (index ? advances[item.blockId] : 0), 0)
        const alternatives = group.flatMap(item => (item.kind === 'whole-target' ? item.candidateLatex : [item.template]).map(value => ({ item, value })))
        const original = alternatives.flatMap(({ item, value }) => typesetRows(value, Infinity, measure(item)).rows.map(row => ({ item, row })))
        const relation = plain('='), left = Math.max(0, ...original.filter(x => x.row.kind === 'equation').map(x => measure(x.item)(x.row.lhs ?? ''))), right = Math.max(0, ...original.filter(x => x.row.kind === 'equation').map(x => measure(x.item)(x.row.rhs ?? '')))
        const widest = Math.max(48, ...original.map(x => x.row.kind === 'equation' ? measure(x.item)(x.row.lhs ?? '') + relation + measure(x.item)(x.row.rhs ?? '') + 8 : measure(x.item)(x.row.latex))), full = Math.max(widest, left + relation + right + 8), narrow = full > available
        const planned = alternatives.flatMap(({ item, value }) => r3FixedRows(value, available, measure(item), narrow).map(row => ({ item, row })))
        const plannedLeft = narrow ? 0 : left, plannedRight = Math.max(0, ...planned.filter(x => x.row.kind === 'equation').map(x => measure(x.item)(x.row.rhs ?? '')))
        const body = narrow ? Math.max(48, ...planned.map(x => x.row.kind === 'equation' ? relation + measure(x.item)(x.row.rhs ?? '') + 8 : measure(x.item)(x.row.latex) + (x.row.kind === 'continuation' ? 18 : 0))) : full
        const rows = r3FixedRows(template, available, measure(recipe), narrow)
        const next = { width: Math.min(body, available), left: plannedLeft, relation, right: narrow ? plannedRight : right, narrow, available, advances, overflow: body > available + 1, rows }
        setEnvelope(old => JSON.stringify(old) === JSON.stringify(next) ? old : next)
      } finally { probe.remove() }
    }
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(() => { frame = undefined; update() }) }
    update(); const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule); observer?.observe(node)
    void document.fonts?.ready.then(schedule)
    return () => { alive = false; observer?.disconnect(); if (frame !== undefined) cancelAnimationFrame(frame) }
  }, [group, recipe, template])
  useLayoutEffect(() => { root.current?.dispatchEvent(new Event('typeset-layout', { bubbles: true })) }, [envelope, resolved])
  const advance = Math.min(envelope?.advances[recipe.blockId] ?? 48, envelope?.available ?? Infinity)
  const measure = (value: string) => value.split('§0§').reduce((sum, fragment, index) => sum + fragment.length * 10 + (index ? advance : 0), 0)
  // Breaks are supplied by the same neutral measurements, including the slot's
  // reserved advance. The visible target never changes that advance.
  const rows = envelope?.rows ?? typesetRows(template, Infinity, measure).rows
  const parts = (value: string, continuation = false) => resolved && value.includes('§0§')
    ? <span className="reading-formula-math"><InlineMath math={tex(value.replace('§0§', recipe.targetLatex!), continuation)} /></span>
    : value.split(/(§0§)/).filter(Boolean).map((part, index) => part === '§0§'
    ? <span key={index} className="r3-fixed-target" style={{ width: advance }}>{resolved ? <InlineMath math={tex(recipe.targetLatex!)} /> : target}</span>
    : <span key={index} className="reading-formula-math"><InlineMath math={tex(part, continuation || index > 0)} /></span>)
  const style = { '--typeset-left': (envelope?.left ?? 0) + 'px', '--typeset-right': (envelope?.right ?? 0) + 'px', '--typeset-body': envelope ? envelope.width + 'px' : 'fit-content', '--r3-fixed-relation': (envelope?.relation ?? 14) + 'px' } as CSSProperties
  return <span ref={root} style={style} className="reading-formula-line reading-formula-line--aligned reading-formula-line--typeset r3-fixed-formula" data-testid={'textbook-formula-' + sourceId} data-latex-status="ok" data-typeset-source={sourceId} data-typeset-kind={rows.some(row => row.kind === 'equation') ? 'chain' : 'independent'} data-r3-envelope-status={envelope ? envelope.overflow ? 'OVERFLOW' : 'MEASURED' : 'UNVERIFIED'} data-r3-neutral-group={group.map(r => r.blockId).join(' ')}>
    <span className="first-theme-formula-rows typeset-formula-body">{rows.map((row, index) => <span key={index} className={'typeset-line' + (row.kind === 'equation' ? ' typeset-line--equation' : '') + (row.kind === 'continuation' ? ' typeset-line--continuation' : '')} data-row-kind={row.kind}>
      {row.kind === 'equation' ? <><span className="typeset-left"><span className="typeset-cell-content">{parts(row.lhs ?? '')}</span></span><span className="typeset-relation"><InlineMath math="=" /></span><span className="typeset-right"><span className="typeset-cell-content">{parts(row.rhs ?? '')}</span></span></> : <>{row.product && <span className="typeset-product-continuation" aria-label="掛け算の続き">·</span>}<span className="typeset-cell-content">{parts(row.latex, row.kind === 'continuation')}</span></>}
    </span>)}</span>
  </span>
}
function r3NeutralSegments(source: string): { latex: string; relation: boolean }[] {
  const result: { latex: string; relation: boolean }[] = []
  let start = 0, braces = 0, parentheses = 0
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (char === '{') braces++; if (char === '}') braces--; if (char === '(') parentheses++; if (char === ')') parentheses--
    if (braces || parentheses) continue
    const relation = char === '=' || char === '<' || char === '>' ? char : char === '\\' ? source.slice(i).match(/^\\(?:le|ge)(?![a-zA-Z])/)?.[0] : undefined
    if (!relation) continue
    if (i > start) result.push({ latex: source.slice(start, i), relation: false })
    result.push({ latex: relation, relation: true }); i += relation.length - 1; start = i + 1
  }
  if (start < source.length) result.push({ latex: source.slice(start), relation: false })
  return result.length ? result : [{ latex: source, relation: false }]
}
function r3FixedRows(source: string, width: number, measure: (value: string) => number, narrow: boolean): TypesetRow[] {
  const plan = typesetRows(source, Infinity, measure)
  if (!narrow) return plan.rows
  return plan.rows.flatMap(row => row.kind === 'equation'
    ? [...(row.lhs ? typesetRows(row.lhs, width, measure).rows : []), ...typesetRows('=' + (row.rhs ?? ''), width, measure).rows.filter(part => part.latex !== '')]
    : typesetRows(row.latex, width, measure).rows)
}

/** R3 numbering uses the real inline baseline. Glyph-box centres are not a
 * reliable baseline for a reserved target or a tall mathematical expression. */
function R3NumberedEquation({ number, children }: { number: number; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null), body = useRef<HTMLDivElement>(null), label = useRef<HTMLSpanElement>(null)
  const [placement, setPlacement] = useState({ top: 0, below: false, status: 'UNVERIFIED' })
  useLayoutEffect(() => {
    const node = root.current, content = body.current, tag = label.current
    if (!node || !content || !tag) return
    let alive = true, frame: number | undefined
    const observed = new Set<Element>()
    const observeMath = () => {
      if (!observer) return
      for (const element of observed) if (!element.isConnected) { observer.unobserve(element); observed.delete(element) }
      for (const element of [content, tag, ...content.querySelectorAll<HTMLElement>('.typeset-formula-body, .typeset-table, .typeset-line, .typeset-cell-content, .typeset-relation, .typeset-table-cell, .katex-html, button[data-testid^="textbook-item-"]')]) {
        if (!observed.has(element)) { observer.observe(element); observed.add(element) }
      }
    }
    const measure = () => {
      if (!alive || content.getBoundingClientRect().width < 1) return
      const last = [...content.querySelectorAll<HTMLElement>('.typeset-line')].filter(row => row.getBoundingClientRect().height > 0).at(-1)
      const cell = last ? [...last.querySelectorAll<HTMLElement>('.typeset-cell-content, .typeset-relation, .typeset-table-cell')].at(-1) : undefined
      const numberMarker = tag.querySelector<HTMLElement>('[data-r3-number-baseline]')
      if (!cell || !numberMarker) return
      const marker = document.createElement('i'); marker.className = 'r3-inline-baseline'; marker.setAttribute('aria-hidden', 'true'); cell.append(marker)
      const baseline = marker.getBoundingClientRect().top; marker.remove()
      const box = node.getBoundingClientRect(), tagBox = tag.getBoundingClientRect(), contentBox = content.getBoundingClientRect()
      const baselineOffset = numberMarker.getBoundingClientRect().top - tagBox.top, inlineTop = baseline - baselineOffset
      const ink = [...content.querySelectorAll<HTMLElement>('.katex-html, button[data-testid^="textbook-item-"]')].map(el => el.getBoundingClientRect()).filter(rect => rect.width > 0 && rect.height > 0)
      const left = contentBox.right - tagBox.width - 2
      const below = ink.some(rect => rect.right + 8 > left && rect.left < contentBox.right && rect.bottom > inlineTop && rect.top < inlineTop + tagBox.height)
      const top = (below ? Math.max(contentBox.bottom, ...ink.map(rect => rect.bottom)) + 8 : inlineTop) - box.top
      const next = { top, below, status: 'MEASURED' }
      setPlacement(old => old.below === below && old.status === next.status && Math.abs(old.top - top) < .01 ? old : next)
    }
    const schedule = () => { if (!alive) return; observeMath(); if (frame === undefined) frame = requestAnimationFrame(() => { frame = undefined; observeMath(); measure() }) }
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule)
    content.addEventListener('typeset-layout', schedule); measure(); observeMath(); schedule()
    window.addEventListener('resize', schedule)
    void document.fonts?.ready.then(schedule)
    return () => { alive = false; observer?.disconnect(); observed.clear(); content.removeEventListener('typeset-layout', schedule); window.removeEventListener('resize', schedule); if (frame !== undefined) cancelAnimationFrame(frame) }
  }, [children, number])
  return <div ref={root} className={'numbered-equation r3-exact-number' + (placement.below ? ' numbered-equation--below' : '')} data-equation-number={number} data-r3-number-status={placement.status}>
    <div ref={body} className="numbered-equation-body">{children}</div>
    <span ref={label} className="numbered-equation-label" style={{ top: placement.top, bottom: 'auto' }} aria-label={'式' + number}>({number})<i className="r3-inline-baseline" data-r3-number-baseline aria-hidden="true" /></span>
  </div>
}

function GuidedNumberedEquation({ number, children, logical = false }: { number: number; children: ReactNode; logical?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [below, setBelow] = useState(false)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    let active = true
    const check = () => {
      if (!active) return
      const label = root.querySelector<HTMLElement>('.numbered-equation-label')
      if (!label) return
      const tag = label.getBoundingClientRect()
      const overlap = [...root.querySelectorAll<HTMLElement>('.katex, .reading-inline-blank')].some(el => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.right > tag.left - 2 && r.left < tag.right + 2 && r.bottom > tag.top - 2 && r.top < tag.bottom + 2
      })
      if (overlap) setBelow(true)
    }
    const frame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(check) : undefined
    check()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(check)
    observer?.observe(root)
    void document.fonts?.ready.then(check)
    return () => { active = false; if (frame !== undefined) cancelAnimationFrame(frame); observer?.disconnect() }
  }, [children])
  return <div ref={ref} className={below ? 'guided-number-below' : undefined}><NumberedEquation number={number} logical={logical}>{children}</NumberedEquation></div>
}

export function GuidedMathReadingFlow(props: Props) {
  if (props.unit.unitId === 'math-quadratic-qf01' && props.unit.revision === 3) return <R3QF01ReadingFlow {...props} />
  if (props.unit.unitId === 'math-quadratic-qf01' && props.unit.revision === 2) return <FullQF01ReadingFlow {...props} />
  if (props.presentation && typeof props.presentation === 'object' && 'schemaVersion' in props.presentation && props.presentation.schemaVersion === 'solution-reading/1') {
    return <SolutionTextbookAdapter {...props} />
  }
  return <LegacyGuidedMathReadingFlow {...props} />
}

function SolutionTextbookAdapter({ presentation, transformationPresentation, unit, section, progress, onSummaryReached, onReviewAnswer }: Props) {
  const answer = useAppStore(state => state.answerTextbook)
  const current = effectiveTextbookProgress(unit, progress)
  const parsed = SolutionReadingSchema.safeParse(presentation)
  if (!parsed.success || parsed.data.unitId !== unit.unitId) return <p role="alert">教材と回答データの対応を確認してください。</p>
  const items = new Map(section.items.map(item => [item.id, item]))
  const questions = parsed.data.problems.flatMap(p => p.steps.flatMap(s => s.interaction ? [s.interaction] : []))
  if (questions.some(q => items.get(q.id)?.answer !== q.correctValue || q.choices.some(c => ![items.get(q.id)?.answer, ...(items.get(q.id)?.choices ?? [])].includes(c.value)))) {
    return <p role="alert">教材と選択肢の対応を確認してください。</p>
  }
  const display = { ...parsed.data, problems: parsed.data.problems.map(p => ({ ...p, steps: p.steps.map(s => s.interaction ? { ...s, interaction: { ...s.interaction, choices: getTextbookChoices(unit, items.get(s.interaction.id)!).flatMap(value => s.interaction!.choices.filter(c => c.value === value)) } } : s) })) }
  return <SolutionReadingFlow transformationPresentation={transformationPresentation} presentation={display} answers={current?.answers ?? {}} onComplete={onSummaryReached} onAnswer={(id, value) => {
    const item = items.get(id)!
    if (onReviewAnswer) onReviewAnswer(item, value)
    else answer(unit, id, value)
  }} />
}

function LegacyGuidedMathReadingFlow({ presentation, transformationPresentation, unit, section, progress, onSummaryReached, onReviewAnswer, storageScope }: Props) {
  const data = presentation as Presentation
  const displays = data.semanticDisplay
  const formulaNumbers = data.equationNumbers
  const { text } = useI18n()
  const answer = useAppStore(state => state.answerTextbook)
  const current = effectiveTextbookProgress(unit, progress)
  const items = section.items
  const resolved = (n: Node) => !n.interaction || isTextbookItemResolved(items.find(i => i.id === n.interaction)!, current?.answers[n.interaction])
  const first = data.nodes.findIndex(n => !resolved(n))
  const frontier = first < 0 ? data.nodes.length : first
  const maxStage = first < 0 ? data.stages.length - 1 : data.stages.findIndex(s => s.id === data.nodes[first].stageId)
  const learnerStorageKey = 'math-textbook-compact-v1:' + unit.unitId + ':r' + unit.revision
  const storageKey = storageScope === undefined ? learnerStorageKey : learnerStorageKey + ':scope:' + storageScope
  const [cursor, setCursor] = useState(() => {
    const saved = window.localStorage.getItem(storageKey)
    const value = saved === null ? maxStage : Number(saved)
    return Number.isInteger(value) && value >= 0 ? Math.min(value, maxStage) : 0
  })
  const stageIndex = Math.min(cursor, maxStage)
  const stage = data.stages[stageIndex]
  const transformation = transformationPresentation ? TransformationReadingSchema.safeParse(transformationPresentation) : null
  const transformationData = transformation?.success && transformation.data.unitId === unit.unitId ? transformation.data : undefined
  const transformationSolved = transformationData?.interactions.filter(c => {
    const item = items.find(i => i.id === c.id)
    return item && isTextbookItemResolved(item, current?.answers[item.id])
  }).map(c => c.id) ?? []
  const transformed = transformationData ? projectTransformationView(transformationData, transformationSolved) : undefined
  const stageNodes = data.nodes.filter(n => n.stageId === stage.id)
  const complete = stageNodes.every(resolved)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [history, setHistory] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const flow = useRef<HTMLDivElement>(null)
  const focusNode = stageNodes.find(n => !resolved(n)) ?? stageNodes.at(-1)!
  const known = focusNode.knownRefs.flatMap(id => {
    const n = data.nodes.find(x => x.resultId === id)
    return n && data.nodes.indexOf(n) < frontier ? [n] : []
  })
  useEffect(() => { window.localStorage.setItem(storageKey, String(stageIndex)) }, [stageIndex, storageKey])
  useEffect(() => { onSummaryReached?.(first < 0 && stageIndex === data.stages.length - 1) }, [first, stageIndex, data.stages.length, onSummaryReached])

  function logical(source: string, id: string, parts: readonly ReactNode[] = [], itemIds: Record<number, string> = {}) {
    const [left, relation, right] = source.split(/(\\(?:Rightarrow|Leftrightarrow))/)
    if (!right) return null
    const vertical = relation === '\\Rightarrow' ? '\\Downarrow' : '\\Updownarrow'
    return <span className="guided-logical-chain" data-logical-relation={relation} data-typeset-source={id}>
      <TypesetFormula source={left.trim().replace(/\\$/, '')} sourceId={id + '-left'} unitId={unit.unitId} parts={parts} itemIds={itemIds} />
      <span className="guided-logical-arrow"><InlineMath math={vertical} /></span>
      <TypesetFormula source={right} sourceId={id + '-right'} unitId={unit.unitId} parts={parts} itemIds={itemIds} />
    </span>
  }
  function formula(source: string, id: string, parts: readonly ReactNode[] = [], itemIds: Record<number, string> = {}) {
    const nested = data.choiceDisplay === 'semantic' ? /\{§(\d+)§\}/.exec(source) : /\\sqrt\{§(\d+)§\}/.exec(source)
    if (nested) {
      const itemId = itemIds[Number(nested[1])]
      const item = items.find(i => i.id === itemId)!
      const node = data.nodes.find(n => n.interaction === itemId)!
      const retry = Boolean(current?.answers[itemId])
      // KaTeX receives the complete balanced radical or fraction. One native button owns
      // the visible boxed slot; no mathematical command is split at the control.
      const math = source.replace(/§\d+§/g, retry ? '\\boxed{\\text{もう一度}}' : '\\boxed{\\text{選択}}')
      return <button type="button" className="guided-formula-slot" data-testid={'textbook-item-' + itemId} data-semantic-id={node.id + '-slot'} aria-label={item.prompt} onClick={() => setActiveId(itemId)}>
        <TypesetFormula source={math} sourceId={id} unitId={unit.unitId} />
      </button>
    }
    const option = /^guided-option-(n09-08|n10-07|n10-15|n10-20)-/.exec(id)
    const itemId = option?.[1] ?? (id.startsWith('n09-08-') ? 'n09-08' : '')
    const steps = !source.includes('§') ? guidedMathDisplaySteps(itemId, source, option ? 'option' : 'completed') : undefined
    if (!steps) return <TypesetFormula source={source} sourceId={id} unitId={unit.unitId} parts={parts} itemIds={itemIds} />
    const independent = itemId === 'n09-08'
    const math = independent
      ? '\\begin{array}{rcl}' + steps.map(s => s.math.replace(/([=<>])/, '&$1&')).join('\\\\') + '\\end{array}'
      : '\\begin{aligned}' + steps.map(s => s.math).join('\\\\') + '\\end{aligned}'
    return <span className={'guided-step-sequence' + (independent ? ' guided-independent-lines' : '')} data-typeset-source={id} data-display-item={itemId} data-display-order={steps.map(s => s.role).join(',')}>
      <TypesetFormula source={math} sourceId={id + '-steps'} unitId={unit.unitId} />
    </span>
  }

  function semantic(parts: readonly unknown[] = []) {
    return (parts as (TextbookReadingPart & { optionRow?: boolean })[]).map((p, i) => p.type === 'math'
      ? <span key={p.semanticId ?? i} data-semantic-id={p.semanticId} style={p.optionRow ? { display: 'block' } : undefined}>{logical(p.latex, p.semanticId ?? 'guided-inline-' + i) ?? <TypesetInlineMath latex={p.latex.replace(/\\\s+$/, '')} sourceId={p.semanticId ?? 'guided-inline-' + i} unitId={unit.unitId} />}</span>
      : p.optionRow ? <span key={p.semanticId ?? i} style={{ display: 'block' }}><SemanticReading parts={[p]} renderChoice={blank} /></span> : <SemanticReading key={p.semanticId ?? i} parts={[p]} renderChoice={blank} />)
  }
  function blank(id: string) {
    const item = items.find(i => i.id === id)!
    const record = current?.answers[id]
    if (isTextbookItemResolved(item, record)) {
      const node = data.nodes.find(n => n.interaction === id)!
      return <span className="reading-inline-answer" data-testid={'resolved-' + id}>{semantic(displays[node.id].choices[record!.value])}</span>
    }
    return <button type="button" className={'reading-inline-blank' + (record ? ' reading-inline-blank--wrong' : '')}
      data-testid={'textbook-item-' + id} aria-label={item.prompt} onClick={() => setActiveId(id)}>{record ? text('もう一度', '再选一次') : text('選択', '选择')}</button>
  }
  function panel(id: string) {
    if (activeId !== id) return null
    const item = items.find(i => i.id === id)!
    const node = data.nodes.find(n => n.interaction === id)!
    const record = current?.answers[id]
    const wrong = record && !isTextbookItemResolved(item, record)
    return <div key={'choices-' + id} className="reading-inline-choice-panel" data-testid={'inline-choice-panel-' + id}>
      <p>{item.prompt}</p>
      {wrong && <aside className="reading-choice-hint" data-testid={'textbook-hint-' + id}>
        <strong>{text('もう一度考えよう', '再想一想')}</strong>
        <span>{semantic(displays[node.id].feedback[record.value])} {semantic(displays[node.id].hintParts[0])}</span>
      </aside>}
      <div className="reading-choice-options guided-choice-options" role="group" aria-label={item.prompt}>
        {getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).map((choice, index) =>
          <button type="button" className="reading-choice-option" key={choice} aria-label={choice}
            data-testid={'textbook-choice-' + id + '-' + index} aria-invalid={Boolean(wrong && record.value === choice) || undefined}
            onClick={() => {
              if (onReviewAnswer) onReviewAnswer(item, choice)
              else answer(unit, id, choice)
              if (choice === item.answer || item.acceptedAnswers.includes(choice)) setActiveId(null)
            }}><span>{index + 1}</span><strong>{data.choiceDisplay === 'semantic' ? semantic(displays[node.id].choices[choice]) : item.answerType === 'formula' && !choice.includes('\\text{')
              ? formula(choice, 'guided-option-' + id + '-' + index)
              : semantic(displays[node.id].choices[choice])}</strong></button>)}
      </div>
    </div>
  }
  function renderBlock(raw: unknown) {
    const block = raw as TextbookReadingBlock
    if (block.type !== 'paragraph' && block.type !== 'formula') return null
    const choices = block.parts.flatMap(p => p.type === 'choice' ? [p.itemId] : [])
    if (block.type === 'paragraph') return <div key={block.id}>
      <p className="reading-paragraph" data-block-id={block.id}>{semantic(block.parts)}</p>{choices.map(panel)}
    </div>
    const mathParts = block.parts.map((part, i) => <span key={part.semanticId ?? i} data-semantic-id={part.semanticId}>
      {part.type === 'math' ? <InlineMath math={part.latex} /> : part.type === 'choice' ? blank(part.itemId) : part.type === 'term' ? <strong>{part.text}</strong> : part.text}
    </span>)
    const source = block.parts.map((p, i) => p.type === 'math' ? p.latex : p.type === 'choice' ? '§' + i + '§' : '\\text{' + p.text + '}').join('')
    const itemIds = Object.fromEntries(block.parts.flatMap((p, i) => p.type === 'choice' ? [[i, p.itemId]] : []))
    return <div key={block.id} className={/n09-q14-(positive|negative)-integer/.test(block.id) ? "guided-number-below" : undefined} data-block-id={block.id} data-formula-semantic-parts={JSON.stringify(block.parts)}>
      <GuidedNumberedEquation number={formulaNumbers[block.id]} logical>{logical(source, block.id, mathParts, itemIds) ?? formula(source, block.id, mathParts, itemIds)}</GuidedNumberedEquation>
      {choices.map(panel)}
    </div>
  }
  function after(n: Node) {
    const compiled = data.semantic.nodes.find(x => x.id === n.id)!
    const table = n.extra.table
    if (!table) return compiled.after.map(renderBlock)
    const tableView = <table className="guided-cases-table" data-testid={n.id + '-table'}><caption>{table.caption}</caption>
      <thead><tr>{table.headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
      <tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}><TypesetInlineMath latex={cell} sourceId={n.id + '-cell-' + i + '-' + j} unitId={unit.unitId} /></td>)}</tr>)}</tbody></table>
    if (n.id !== 'n09-14') return <>{compiled.after.map(renderBlock)}{tableView}</>
    const equation = compiled.after.find(b => b.type === 'formula')!
    return <><div className="guided-number-below" data-typeset-source={equation.id} data-table-projection="equivalent-answer" data-formula-semantic-parts={JSON.stringify(equation.parts)}>
      <GuidedNumberedEquation number={formulaNumbers[equation.id]} logical>{tableView}</GuidedNumberedEquation>
    </div>{compiled.after.filter(b => b !== equation).map(renderBlock)}</>
  }
  function transformationGroup(stageId: string, onlyNodeId?: string) {
    const group = transformed?.groups.find(g => transformationData?.groups.find(x => x.id === g.id)?.stageIds.includes(stageId))
    if (!group) return null
    const index = data.stages.findIndex(s => s.id === stageId)
    const rows = group.rows.filter(r => onlyNodeId ? r.sourceNodeId === onlyNodeId : data.stages.findIndex(s => s.id === data.nodes.find(n => n.id === r.sourceNodeId)?.stageId) <= index)
    return rows.length ? <TransformationReadingGroup group={{ ...group, rows }} renderSlot={blank} renderPanel={panel} /> : null
  }
  function stageContent(nodes: Node[], past = false) {
    const emitted = new Set<string>()
    return nodes.map(n => {
      const group = transformationData?.groups.find(g => g.sourceNodeIds.includes(n.id))
      if (!group) return renderNode(n, past)
      if (emitted.has(group.id)) return null
      emitted.add(group.id)
      return <div key={group.id}>{transformationGroup(n.stageId)}</div>
    })
  }
  function result(n: Node) {
    if (transformationData?.scope.nodeIds.includes(n.id)) return <div key={n.resultId} className="guided-result math-textbook-stage-reference-content" data-result-source={n.resultId}>{transformationGroup(n.stageId, n.id)}</div>
    return <div key={n.resultId} className="guided-result math-textbook-stage-reference-content" data-result-source={n.resultId}>
      <strong>{n.goal}</strong>{after(n)}
    </div>
  }
  function renderNode(n: Node, past = false) {
    const compiled = data.semantic.nodes.find(x => x.id === n.id)!
    const done = past || resolved(n)
    // Replace the unanswered equation with the completed relation group, once.
    const before = done && n.interaction ? compiled.before.filter(b => !b.id.startsWith(n.id + '-interaction')) : compiled.before
    return <div className="guided-thinking-step" data-node-id={n.id} key={n.id}>
      <div className="guided-step-caption"><span>{roles[n.role]}</span><strong>{n.goal}</strong></div>
      {before.map(renderBlock)}
      {n.extra.calculationSupport && <details data-testid={n.id + '-calculation-support'}><summary>整数の筆算の内訳を見る</summary>{n.extra.calculationSupport.split(';').map((source, i) => <TypesetFormula key={i} source={source} sourceId={n.id + '-support-' + i} unitId={unit.unitId} />)}</details>}
      {done && after(n)}{done && n.extra.figure && originalFigure(n)}
    </div>
  }
  function originalFigure(node: Node) {
    const figure = section.figures.find(f => f.id === node.extra.figure?.id)
    if (!figure || !resolved(node)) return null
    return <figure className="guided-figure" data-testid="guided-original-figure" data-figure-id={figure.id}><img src={import.meta.env.BASE_URL + figure.src.replace(/^\//, '')} alt={figure.alt} />
      <figcaption>{figure.caption}</figcaption></figure>
  }
  if (transformationPresentation && (!transformationData || transformationData.interactions.some(c => {
    const item = items.find(i => i.id === c.id)
    return !item || item.answer !== c.correctValue || c.choices.some(value => !(item.choices ?? []).includes(value))
  }))) return <p role="alert">式列と回答データの対応を確認してください。</p>
  return <div ref={flow} className="textbook-reading-flow guided-reading" data-typeset-theme="true" data-testid="textbook-reading-flow" tabIndex={-1}>
    <div className="math-textbook-reading-controls"><span>{text('今の段階', '当前阶段')} {stageIndex + 1} / {data.stages.length}</span>
      {stageIndex > 0 && <button type="button" data-testid={data.code + '-history-toggle'} onClick={() => setHistory(x => !x)}>{history ? text('履歴を閉じる', '收起记录') : text('前の段階を見る', '查看之前的阶段')}</button>}
    </div>
    {history && <div className="guided-history"><button type="button" onClick={() => setExpandAll(x => !x)}>{expandAll ? text('全文を閉じる', '收起全文') : text('全文を開く', '展开全文')}</button>
      {data.stages.slice(0, stageIndex).map((s, i) => {
        const previous = data.nodes.filter(n => n.stageId === s.id)
        return <section className="first-theme-recorded-results" key={s.id} data-testid={'recorded-results-' + s.id}>
          <h3>{i + 1}. {s.title}</h3>{result(previous.at(-1)!)}
          <details open={expandAll || undefined}><summary>{text('全文を見る', '查看全文')}</summary>{stageContent(previous, true)}</details>
        </section>
      })}
    </div>}
    <section className="math-textbook-stage math-textbook-stage--current" data-testid={'math-textbook-stage-' + stage.id}>
      <div className="guided-source-question" data-testid="guided-source-question"><strong>元の問題・考える対象</strong><p>{semantic(stage.sourceQuestionParts)}</p></div>
      <header className="math-textbook-stage-active-title"><strong>{stage.title}</strong><small>{stageIndex + 1} / {data.stages.length}</small></header>
      {known.filter(n => !(transformationData?.scope.stageIds.includes(stage.id) && transformationData.scope.nodeIds.includes(n.id))).length > 0 && <aside className="math-textbook-stage-references" data-testid="math-textbook-stage-references"><strong>{text('使う条件・前の結果', '需要的条件与之前的结果')}</strong>{known.filter(n => !(transformationData?.scope.stageIds.includes(stage.id) && transformationData.scope.nodeIds.includes(n.id))).map(result)}</aside>}
      {stageContent(stageNodes.filter(n => data.nodes.indexOf(n) <= frontier))}
      {complete && stageIndex < data.stages.length - 1 && <button type="button" className="math-textbook-next-stage" data-testid="math-textbook-next-stage" onClick={() => {
        setCursor(stageIndex + 1); setActiveId(null); setHistory(false); setExpandAll(false)
        requestAnimationFrame(() => { flow.current?.focus({ preventScroll: true }); flow.current?.scrollIntoView({ block: 'start' }) })
      }}>{text('次へ', '下一步')}</button>}
      {first < 0 && stageIndex === data.stages.length - 1 && <p data-testid={data.code + '-complete'}>{text('ここまでの学習を終えました。', '已完成本节学习。')}</p>}
    </section>
  </div>
}

/** P017 is deliberately opt-in: incomplete QF01r2 data never falls back to old questions. */
function FullQF01ReadingFlow(props: Props) {
  const data = props.presentation as Presentation
  const parsed = TransformationReadingSchema.safeParse(props.transformationPresentation)
  const required = props.unit.requiredInteractionRefs ?? []
  const active = data?.nodes?.flatMap(n => n.interaction ? [n.interaction] : []) ?? []
  const same = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i])
  const fail = () => <p role="alert">教材の式列と保存・回答データの対応を確認してください。保存記録は変更していません。</p>
  if (!parsed.success || !data?.stages || data.stages.length !== 9 || data.nodes.length !== 25 || required.length !== 24 || !same(active, required)) return fail()
  const plan = parsed.data
  if (plan.unitId !== props.unit.unitId || plan.presentationVersion !== 2 || !same(plan.scope.nodeIds, data.nodes.map(n => n.id)) || !same(plan.scope.stageIds, data.stages.map(s => s.id)) || !same(plan.interactions.map(q => q.id), required)) return fail()
  const rowIDs = new Set<string>(), seenNodes = new Set<string>(), seenAnswers = new Set<string>()
  for (const group of plan.groups) for (const row of group.rows) {
    const node = data.nodes.find(n => n.id === row.sourceNodeId)
    if (!node || !group.stageIds.includes(node.stageId) || rowIDs.has(row.id) || row.visibleAfter.some(id => !required.includes(id))) return fail()
    rowIDs.add(row.id); seenNodes.add(node.id)
    if (row.interactionRef) {
      if (row.interactionRef !== node.interaction || seenAnswers.has(row.interactionRef)) return fail()
      seenAnswers.add(row.interactionRef)
    }
  }
  if (seenNodes.size !== data.nodes.length || seenAnswers.size !== required.length) return fail()
  for (const q of plan.interactions) {
    const item = props.section.items.find(i => i.id === q.id)
    if (!item || item.answer !== q.correctValue || q.choices.length !== item.choices?.length || q.choices.some(c => !item.choices?.includes(c))) return fail()
  }
  return <ValidatedFullQF01ReadingFlow {...props} data={data} plan={plan} />
}

function ValidatedFullQF01ReadingFlow({ unit, section, progress, data, plan, storageScope, onSummaryReached, onReviewAnswer, readOnlyArchive = false }: Props & { data: Presentation; plan: import('../../domain/transformationReading').TransformationReading }) {
  const answer = useAppStore(state => state.answerTextbook)
  const current = effectiveTextbookProgress(unit, progress)
  const contextId = useId()
  const items = section.items
  const resolved = (id: string) => isTextbookItemResolved(items.find(i => i.id === id)!, current?.answers[id])
  const required = unit.requiredInteractionRefs!
  const first = data.nodes.findIndex(n => n.interaction && !resolved(n.interaction))
  const maxStage = first < 0 ? data.stages.length - 1 : data.stages.findIndex(s => s.id === data.nodes[first].stageId)
  const imported = Boolean(current && 'qf01Revision1Snapshot' in current)
  const storageKey = 'math-textbook-compact-v1:' + unit.unitId + ':r2' + (storageScope ? ':scope:' + storageScope : '')
  const [cursor, setCursor] = useState(() => {
    const saved = window.localStorage.getItem(storageKey)
    const value = saved === null ? (imported && first < 0 ? 0 : maxStage) : Number(saved)
    return Number.isInteger(value) && value >= 0 ? Math.min(value, maxStage) : 0
  })
  const stageIndex = Math.min(cursor, maxStage), stage = data.stages[stageIndex]
  const [activeId, setActiveId] = useState<string | null>(null)
  const [history, setHistory] = useState(false)
  const [fullHistory, setFullHistory] = useState(false)
  const [repeatContext, setRepeatContext] = useState(false)
  const flow = useRef<HTMLDivElement>(null), context = useRef<HTMLDivElement>(null)
  const solved = required.filter(resolved)
  const visible = projectTransformationView(plan, solved)
  const complete = data.nodes.filter(n => n.stageId === stage.id).every(n => !n.interaction || resolved(n.interaction))
  const viewportBounds = useCallback(() => {
    let top = 0, bottom = innerHeight
    for (const element of document.querySelectorAll<HTMLElement>('header, nav, [data-fixed-header]')) {
      const style = getComputedStyle(element), r = element.getBoundingClientRect()
      if (style.position !== 'fixed' && style.position !== 'sticky') continue
      // A fixed bottom navigation is an obstruction below, never a top header.
      if (Number.isFinite(Number.parseFloat(style.top)) && r.top < innerHeight / 2) top = Math.max(top, r.bottom)
      else if (style.position === 'fixed' && Number.isFinite(Number.parseFloat(style.bottom)) && r.top > innerHeight / 2) bottom = Math.min(bottom, r.top)
    }
    return { top: top + 12, bottom: bottom - 12 }
  }, [])
  const reveal = useCallback((target: HTMLElement | null) => {
    if (!target) return
    const { top, bottom } = viewportBounds(), r = target.getBoundingClientRect()
    flow.current?.style.setProperty('--qf01-header-clearance', top + 'px')
    if (r.top < top || r.top > bottom - 44) window.scrollBy({ top: r.top - top, behavior: 'auto' })
    else if (r.bottom > bottom && r.height <= bottom - top) window.scrollBy({ top: r.bottom - bottom, behavior: 'auto' })
  }, [viewportBounds])
  useEffect(() => { if (!readOnlyArchive) window.localStorage.setItem(storageKey, String(stageIndex)) }, [stageIndex, storageKey, readOnlyArchive])
  useEffect(() => { onSummaryReached?.(false) }, [onSummaryReached])
  useEffect(() => { setCursor(value => Math.min(value, maxStage)) }, [maxStage])
  const focusRevealFrame = useRef<number | null>(null)
  const pointerFocusTarget = useRef<HTMLElement | null>(null)
  const syncRepeatedContext = useCallback(() => {
    const r = context.current?.getBoundingClientRect(), bounds = viewportBounds()
    setRepeatContext(Boolean(r && (r.top < bounds.top || r.bottom > bounds.bottom)))
  }, [viewportBounds])
  const cancelFocusReveal = useCallback(() => {
    if (focusRevealFrame.current !== null) cancelAnimationFrame(focusRevealFrame.current)
    focusRevealFrame.current = null
  }, [])
  const revealFocusedChoice = useCallback((target: HTMLElement) => {
    cancelFocusReveal()
    // Preserve the pointer press/click transaction: its focus uses the existing reveal.
    if (pointerFocusTarget.current === target) { reveal(target); return }
    const stillCurrent = () => document.activeElement === target && Boolean(flow.current?.querySelector('.math-textbook-stage--current')?.contains(target))
    const adjust = () => { if (stillCurrent()) { reveal(target); syncRepeatedContext() } }
    adjust()
    // Repeated source context can be inserted by the focus-triggered scroll.
    // Remeasure after that commit, then settle once more after its scroll event.
    // These frames belong only to this explicit focus; manual scroll never starts them.
    focusRevealFrame.current = requestAnimationFrame(() => {
      adjust()
      focusRevealFrame.current = requestAnimationFrame(() => {
        focusRevealFrame.current = null
        if (stillCurrent()) reveal(target)
      })
    })
  }, [cancelFocusReveal, reveal, syncRepeatedContext])
  useEffect(() => {
    const clearPointer = () => { pointerFocusTarget.current = null }
    const keyboardInput = () => { clearPointer(); cancelFocusReveal() }
    window.addEventListener('pointerdown', cancelFocusReveal, true)
    window.addEventListener('pointerup', clearPointer)
    window.addEventListener('pointercancel', clearPointer)
    window.addEventListener('blur', keyboardInput)
    window.addEventListener('wheel', cancelFocusReveal, { passive: true })
    window.addEventListener('touchstart', cancelFocusReveal, { passive: true })
    window.addEventListener('keydown', keyboardInput)
    return () => {
      cancelFocusReveal()
      window.removeEventListener('wheel', cancelFocusReveal)
      window.removeEventListener('touchstart', cancelFocusReveal)
      window.removeEventListener('keydown', keyboardInput)
      window.removeEventListener('pointerdown', cancelFocusReveal, true)
      window.removeEventListener('pointerup', clearPointer)
      window.removeEventListener('pointercancel', clearPointer)
      window.removeEventListener('blur', keyboardInput)
      clearPointer()
    }
  }, [cancelFocusReveal])
  useEffect(() => { cancelFocusReveal(); pointerFocusTarget.current = null }, [stageIndex, cancelFocusReveal])
  const activeValue = activeId ? current?.answers[activeId]?.value : undefined
  const activeAttemptCount = activeId ? current?.answers[activeId]?.attemptCount : undefined
  const lastResolvedNodeId = [...data.nodes].reverse().find(node => node.stageId === stage.id && node.interaction && resolved(node.interaction))?.id
  useLayoutEffect(() => {
    const check = syncRepeatedContext
    // Commit any repeated context before the next frame measures the panel.
    // Wrong feedback can move an already focused choice without another focus event.
    check()
    const frame = requestAnimationFrame(() => {
      const currentStage = flow.current?.querySelector<HTMLElement>('.math-textbook-stage--current')
      const panel = activeId ? currentStage?.querySelector<HTMLElement>('[data-testid="inline-choice-panel-' + activeId + '"]') : null
      const completedRow = lastResolvedNodeId ? currentStage?.querySelector<HTMLElement>('[data-source-node="' + lastResolvedNodeId + '"] .transformation-equation') : null
      const focused = document.activeElement
      const target = panel && focused instanceof HTMLElement && panel.contains(focused)
        ? focused : panel ?? currentStage?.querySelector<HTMLElement>('[data-qf01-current-slot]') ?? completedRow ?? null
      reveal(target)
    })
    window.addEventListener('scroll', check, { passive: true }); window.addEventListener('resize', check)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [stageIndex, activeId, first, activeValue, activeAttemptCount, lastResolvedNodeId, syncRepeatedContext, reveal])
  const semantic = (parts: TextbookReadingPart[]) => parts.map((p, i) => p.type === 'math'
    ? <TypesetInlineMath key={i} latex={p.latex} sourceId={p.semanticId ?? 'qf01-context-' + i} unitId={unit.unitId} />
    : p.type === 'text' ? <span key={i}>{p.text}</span> : null)
  const value = (id: string, choice: string) => {
    const node = data.nodes.find(n => n.interaction === id)!
    const parts = data.semanticDisplay[node.id]?.choices[choice]
    return parts ? semantic(parts) : <TypesetInlineMath latex={choice} sourceId={id + '-choice-value'} unitId={unit.unitId} />
  }
  const slot = (id: string) => {
    const item = items.find(i => i.id === id)!
    if (resolved(id)) return <span data-testid={'resolved-' + id}>{value(id, item.answer)}</span>
    return <button type="button" disabled={readOnlyArchive} className="reading-inline-blank qf01-whole-answer-slot" data-qf01-current-slot data-testid={'textbook-item-' + id} aria-label="式中の空欄" aria-describedby={contextId} onClick={() => setActiveId(id)}>□</button>
  }
  const panel = (id: string) => {
    if (readOnlyArchive || resolved(id)) return null
    const item = items.find(i => i.id === id)!, node = data.nodes.find(n => n.interaction === id)!, record = current?.answers[id]
    const wrong = record && !resolved(id), display = data.semanticDisplay[node.id]
    // Saved feedback survives reload; opening the choices still requires a tap.
    if (activeId !== id && !wrong) return null
    return <div className="reading-inline-choice-panel qf01-attached-options" data-testid={'inline-choice-panel-' + id}>
      {repeatContext && <aside className="qf01-local-context" data-testid="qf01-local-context"><strong>元の条件・求めるもの</strong><p>{semantic(stage.sourceQuestionParts)}</p></aside>}
      {wrong && <aside className="reading-choice-hint" data-testid={'textbook-hint-' + id}><strong>この候補は採用しません：</strong>{value(id, record.value)}<p>{semantic(display.feedback[record.value] ?? [])} {semantic(display.hintParts[0] ?? [])}</p></aside>}
      {activeId === id && <div className="reading-choice-options guided-choice-options" role="group" aria-label="この空欄の候補" aria-describedby={contextId}>
        {getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).map((choice, index) => <button type="button" className="reading-choice-option" key={choice} aria-label={choice} onPointerDown={event => { pointerFocusTarget.current = event.currentTarget; cancelFocusReveal() }} onFocus={event => revealFocusedChoice(event.currentTarget)} aria-invalid={Boolean(wrong && record.value === choice) || undefined} data-testid={'textbook-choice-' + id + '-' + index} onClick={() => {
          cancelFocusReveal(); pointerFocusTarget.current = null
          if (onReviewAnswer) onReviewAnswer(item, choice); else answer(unit, id, choice)
          if (normalizeTextbookAnswer(choice) === normalizeTextbookAnswer(item.answer)) setActiveId(null)
        }}><span className="qf01-option-content">{value(id, choice)}</span></button>)}
      </div>}
    </div>
  }
  const groupsAt = (stageId: string) => visible.groups.filter(g => plan.groups.find(p => p.id === g.id)?.stageIds.includes(stageId))
  const compactGroup = (group: ReturnType<typeof groupsAt>[number]) => {
    const last = group.rows.at(-1)!
    // A continuation needs its own group's subject; a complete interval on the
    // right with no relation must remain a standalone statement.
    const subject = last.formula.left.length || !(last.formula.relation || last.formula.relationSlot)
      ? last.formula.left
      : [...group.rows].reverse().find(row => row.formula.left.length)?.formula.left
        ?? [...group.rows.slice(0, -1)].reverse().find(row => !row.formula.relation && !row.formula.relationSlot && row.formula.right.length)?.formula.right ?? []
    return { ...group, rows: [{ ...last, formula: { ...last.formula, left: subject } }] }
  }
  const mathematicalStage = (stageId: string) => <div className="qf01-continuous-derivation" data-testid={'qf01-chain-' + stageId}>{groupsAt(stageId).map(group => <TransformationReadingGroup key={group.id} group={group} renderSlot={slot} renderPanel={panel} />)}</div>
  return <div ref={flow} className="textbook-reading-flow guided-reading qf01-full-reading" data-testid="textbook-reading-flow" data-typeset-theme="true" tabIndex={-1}>
    <div className="math-textbook-reading-controls"><span>今の段階 {stageIndex + 1} / {data.stages.length}</span><span>解答の記録：{solved.length}/{required.length}</span>{stageIndex > 0 && <button type="button" data-testid="qf01-history-toggle" onClick={() => setHistory(v => !v)}>{history ? '履歴を閉じる' : '前の段階を見る'}</button>}</div>
    {imported && <p className="qf01-imported-progress" data-testid="qf01-imported-answer-history">以前の学習記録を保持しています。解答の記録は、更新された説明を確認した記録ではありません。</p>}
    {history && <div className="guided-history"><button type="button" onClick={() => setFullHistory(v => !v)}>{fullHistory ? '全文を閉じる' : '全文を開く'}</button>{data.stages.slice(0, stageIndex).map(s => <section key={s.id} data-testid={'recorded-results-' + s.id}><h3>{s.title}</h3><p>{semantic(s.sourceQuestionParts)}</p>{fullHistory ? mathematicalStage(s.id) : <div className="qf01-recorded-conclusion">{groupsAt(s.id).map(g => <TransformationReadingGroup key={g.id} group={compactGroup(g)} renderSlot={slot} renderPanel={() => null} />)}</div>}</section>)}</div>}
    <section className="math-textbook-stage math-textbook-stage--current" data-testid={'math-textbook-stage-' + stage.id}>
      <div ref={context} id={contextId} className="guided-source-question" data-testid="guided-source-question"><strong>元の条件・求めるもの</strong><p>{semantic(stage.sourceQuestionParts)}</p></div>
      <h3>{stage.title}</h3>{mathematicalStage(stage.id)}
      {complete && stageIndex < data.stages.length - 1 && <button type="button" className="math-textbook-next-stage" data-testid="math-textbook-next-stage" onClick={() => { setCursor(stageIndex + 1); setActiveId(null); setHistory(false); requestAnimationFrame(() => reveal(context.current)) }}>次へ</button>}
      {stageIndex > 0 && <button type="button" data-testid="qf01-previous-stage" onClick={() => { setCursor(stageIndex - 1); setActiveId(null); setHistory(false) }}>前の段階へ</button>}
      {first < 0 && stageIndex === data.stages.length - 1 && <p data-testid="qf01-complete">ここまでの解答を終えました。説明は前の段階から読み直せます。</p>}
    </section>
  </div>
}


function R3QF01ReadingFlow(props: Props) {
  const [source, setSource] = useState<QF01R3Validated | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let active = true
    setSource(null); setError(false)
    validateQF01R3Reading(props.unit, props.readingPresentation).then(value => { validateQF01R3BodySource(value); if (active) setSource(value) }).catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [props.unit, props.readingPresentation])
  if (error) return <p role="alert" data-testid="qf01-r3-binding-error">教材と学習記録の対応を確認できません。本文は表示していません。</p>
  if (!source || source.unit !== props.unit || source.metadata !== props.readingPresentation) return <p role="status">教材の対応を確認しています。</p>
  return <ValidatedR3QF01ReadingFlow {...props} source={source} />
}

// R3 feedback comes from canonical prose, not a second question-specific answer map.
// Keep a complete expression (including signed parenthesized factors) in one math unit.
export function R3FeedbackMath({ text, sourceId, unitId }: { text: string | null | undefined; sourceId: string; unitId: string }) {
  const copy = (text ?? '').replace(/\\+(?=[A-Za-z])/g, '\\')
  const leaf = String.raw`(?:\d+(?:\.\d+)?|[A-Za-z]+|[縦横])`
  const expression = (depth: number): string => {
    const base = depth ? String.raw`(?:${leaf}|\(${expression(depth - 1)}\))` : leaf
    const atom = String.raw`[-−]?${base}(?:\^(?:\{[-+]?\d+\}|[-+]?\d+)|²)?`
    return String.raw`${atom}(?:\s*(?:(?:\\times|\\cdot|[+−\-×=<>≤≥])\s*)?${atom})*`
  }
  const pattern = new RegExp(expression(3), 'g'), parts: ReactNode[] = []
  let end = 0
  for (const match of copy.matchAll(pattern)) {
    if (match.index! > end) parts.push(copy.slice(end, match.index))
    const latex = match[0].replaceAll('−', '-').replaceAll('×', '\\times ').replaceAll('²', '^2').replace(/[縦横]/g, label => '\\text{' + label + '}')
    parts.push(<TypesetInlineMath key={match.index} latex={latex} sourceId={sourceId + '-' + match.index} unitId={unitId} />)
    end = match.index! + match[0].length
  }
  parts.push(copy.slice(end))
  return <>{parts}</>
}

type R3BodySpan = readonly [start: number, end: number, lexeme: string, latex: string, unit: 'cm' | null]
type R3BodyRecipe = readonly [blockId: string, partIndex: number, text: string, partSHA256: string, spans: readonly R3BodySpan[]]
// D04's reviewed inventory is an identity/boundary guard, not a second source of
// learner text. Only the already projected visible string is ever rendered.
const R3_BODY_SOURCE_PARTS: readonly R3BodyRecipe[] = [
  ["qf01-r3-c0-s01-p01",0,"一つの数を決めたとき、別の数がどのように決まるかを調べます。まず規則に数や式を入れ、次に長方形の条件から規則を作ります。最後に、使える入力と出てくる値の範囲を確かめます。","da1ebc7d568d6ff08cdca61c797d697a8a8017819ab91ae1a550f06de18e755f",[]],
  ["qf01-r3-c1-s01-p01",0,"数を4倍して6を引く規則を考えます。この規則へ2、−1、a−1を入れたときに出てくる数や式を、順に求めましょう。aは数を表す文字です。","82e781af7a684a38e848a0298839503ea8160ff80913d5f29ec6bdb3d0e83db4",[[2,3,"4","4",null],[6,7,"6","6",null],[23,24,"2","2",null],[25,27,"−1","-1",null],[28,31,"a−1","a-1",null],[56,57,"a","a",null]]],
  ["qf01-r3-c1-s01-p02",0,"まず、2を入れたときに出てくる数を求めます。規則は「4倍する」「6を引く」の順なので、はじめに掛け算の部分を作ります。","bced85dafb29f6c8487cfbe9a1df6682ca2760b565eb486bac23a3800ce168b4",[[3,4,"2","2",null],[26,27,"4","4",null],[32,33,"6","6",null]]],
  ["qf01-r3-c1-s01-p03",0,"積を計算すると8です。規則には、ここから6を引く操作が残っています。","d00c8ab8498986343b46f0fdad3869ff5d13a806316688934ab139bb325d54a5",[[7,8,"8","8",null],[20,21,"6","6",null]]],
  ["qf01-r3-c1-s01-p04",0,"入力2に対して、出てくる数は2と決まりました。入力と出力が同じ数になることもありますが、いつも等しくなる必要はありません。大切なのは、一つの入力を決めると、それに対応する出力がただ一つ決まることです。","449b8e914de2310d7d940503ed039c1330b3c837e94abb853549beb7fcff0d33",[[2,3,"2","2",null],[14,15,"2","2",null]]],
  ["qf01-r3-c1-s01-p05",0,"このような対応を関数といいます。規則をfという名前で表すと、入力xに対応する出力yを、","8abc484af298621a67254d12d44cca9e4703d6378e146a6caf79649849d080ad",[[19,20,"f","f",null],[32,33,"x","x",null],[40,41,"y","y",null]]],
  ["qf01-r3-c1-s01-p05",2,"と書きます。f(x)はfとxの積ではなく、入力xに対応する値を表す記号です。","219996b058084a3db30bfbb41e46d1e070deecb1ea534391999d962e34f950d7",[[6,10,"f(x)","f(x)",null],[11,12,"f","f",null],[13,14,"x","x",null],[23,24,"x","x",null]]],
  ["qf01-r3-c1-s01-p06",0,"今回の規則では、","c7864500ef969cd29e13beb95146951a55dc29f1f25cb0fcb7f2ee44db3bd8eb",[]],
  ["qf01-r3-c1-s01-p06",2,"です。括弧の中の2は入力、等号の右の2はその入力に対応する出力です。次は入力だけを替え、同じ規則を使います。","d48cb4a506a6c86d342619880fb7dce730686a4778089fced0018312be48a252",[[8,9,"2","2",null],[18,19,"2","2",null]]],
  ["qf01-r3-c1-s02-p01",0,"規則は引き続き","30fdbbce1625f36d213aa148de7c0dc70cbc826b4c6fda2d1cdb561f23813c64",[]],
  ["qf01-r3-c1-s02-p01",2,"です。今度は入力を−1に替え、","3bf029eccfe4f11455048753c8317cd810aafd54817ae8afb7ec06b05bc3bff9",[[9,11,"−1","-1",null]]],
  ["qf01-r3-c1-s02-p01",4,"を求めます。xのあった位置へ、負号を含む入力を一まとまりとして入れます。","4d756d964860e530d9946cef6656ba8ed9849952b3eda8a1c013b2cebe0acdf7",[[6,7,"x","x",null]]],
  ["qf01-r3-c1-s02-p02",0,"4に掛ける相手は−1です。最後に引く6は、元の規則にある別の操作なので、入力の括弧の外に残します。先に積を計算すると、次のようになります。","861d9207672d31e4dfd6e7f1b47a7a7a2a394ece3bf64eeb6942bd9730db1308",[[0,1,"4","4",null],[8,10,"−1","-1",null],[18,19,"6","6",null]]],
  ["qf01-r3-c1-s02-p03",1,"という等式の−10は、","1570d40b0d37a5fdffb89a7e793408d70555f0f8e6528f1b85e4c95efa1c4fb1",[[6,9,"−10","-10",null]]],
  ["qf01-r3-c1-s02-p03",2,"入力−1に対応する出力","e8398df4c4a1552cf1fd63edd85a72bbf1625f4c8a845e6918d387d2e3bdbb0d",[[2,4,"−1","-1",null]]],
  ["qf01-r3-c1-s02-p03",3,"です。規則の名前を掛けた値でも、どの入力でも必ず出る同じ数でもありません。ここでは入力−1と出力−10は異なっていますが、一つの入力に値が一つ決まるという見方は同じです。","8fac298150aa1bf02e5836f14fddc2e51d6da0497f371f6ff47a534d95874533",[[43,45,"−1","-1",null],[48,51,"−10","-10",null]]],
  ["qf01-r3-c1-s03-p01",0,"数を表す式も、一つの入力として扱えます。規則","e93ae58bf3975be000e6590e66a13db823002c3b8f340f7d3d07645d7de5bb54",[]],
  ["qf01-r3-c1-s03-p01",2,"に、今度はa−1を入れて、","450f722d54b4133c69ae9957e55f0241e701a0ccea049325a5b5c6f6bc6f5c46",[[5,8,"a−1","a-1",null]]],
  ["qf01-r3-c1-s03-p01",4,"を求めます。","f72f8979c90a621efaadda1769e132bd49114df309d4ded1e823ff4c669c10a4",[]],
  ["qf01-r3-c1-s03-p02",0,"ここでa−1を括弧で囲むのは、","4078162b0d9aa8b9c7f9e9e16b6466f16da114a75bd979317913e763bbec3126",[[3,6,"a−1","a-1",null]]],
  ["qf01-r3-c1-s03-p02",1,"入力全体に4を掛けることを表すため","23fe6b45e231d9f8d499e14114674fbd6d18528051628e14555975bccd6db5bc",[[5,6,"4","4",null]]],
  ["qf01-r3-c1-s03-p02",2,"です。aだけを4倍するのではありません。元の規則の最後の−6は、このまとまりの外に残します。","33b12f98f41dc38c33a26d72d640eddfb7df9878f710f318fa28b11a75e90cac",[[3,4,"a","a",null],[7,8,"4","4",null],[28,30,"−6","-6",null]]],
  ["qf01-r3-c1-s03-p03",0,"入力のまとまりが分かったので、分配法則で括弧を外します。まず4(a−1)を整え、外側の−6はそのまま残します。","2fa2e17d8a0988c83ae4de50586aa2a0f1c6b0aff5fbb1c4374c41abb9eef17d",[[30,36,"4(a−1)","4(a-1)",null],[43,45,"−6","-6",null]]],
  ["qf01-r3-c1-s03-p04",0,"4を括弧内のaと−1の両方へ掛けました。次に、文字の項4aを保ったまま、定数−4と−6をまとめます。","d6bf45f9d12143cb55088689ee94335739416021c6ddab5399402653e7594417",[[0,1,"4","4",null],[6,7,"a","a",null],[8,10,"−1","-1",null],[27,29,"4a","4a",null],[38,40,"−4","-4",null],[41,43,"−6","-6",null]]],
  ["qf01-r3-c1-s03-p05",0,"最初の規則では、入力を一まとまりとしてxの位置へ入れれば、数でも式でも同じ手順で対応する値を求められました。括弧は入力に掛ける範囲を保ち、その後で分配や同類項の整理を行います。","9503c273de21a4bc030953a77b0d42335e7f36e3413b34ca76d64fd46d744aaa",[[19,20,"x","x",null]]],
  ["qf01-r3-c2-s04-p01",0,"ここからは、入力を二乗してから1を引く別の規則です。記号fを使いますが、前の4倍して6を引く規則とは区別します。新しい規則を","9a33f6a7db112389561ac81d497c9558ef703e3a7a43ff0db9537cef56891eb6",[[15,16,"1","1",null],[28,29,"f","f",null],[38,39,"4","4",null],[42,43,"6","6",null]]],
  ["qf01-r3-c2-s04-p01",2,"とします。","4594a13128eead29291c291ba1fb4ccd411fcce77dd0e495766e9ced710a7299",[]],
  ["qf01-r3-c2-s04-p02",0,"まず入力−1に対応する","38c90031bccb31f7b2bbee637a77738b4514f1286eaa22ca470f3079b3cb3245",[[4,6,"−1","-1",null]]],
  ["qf01-r3-c2-s04-p02",2,"を求めます。","b695d277e266dd048caae3402be6c497158a8ba5bc9637a58f042c34e7732980",[]],
  ["qf01-r3-c2-s04-p02",4,"はxを二つ掛けることなので、二つのxの両方へ同じ入力を入れます。","23650cd5625e7cf39ed7785b83a064c89c3e19d3f07733b2dfe9d2bfea689af0",[[1,2,"x","x",null],[17,18,"x","x",null]]],
  ["qf01-r3-c2-s04-p03",0,"負号も入力の一部なので、−1全体を括弧で囲んで二乗します。二乗の外にある−1は、平方を求めてから行う引き算です。","b6b2fcc2e82de12dfed95490df3756cfc09098c38eb499cd90adf6b9a60d5f78",[[12,14,"−1","-1",null],[36,38,"−1","-1",null]]],
  ["qf01-r3-c2-s04-p04",0,"出力は0です。同じ−1を入れても、最初の規則では−10、今の規則では0となりました。関数値を求めるときは、入力だけでなく、どの規則を使うかも確かめる必要があります。","109391661dbf12263c1fdd398e16fc46aae3cf1f669614b0630df00835ef29d0",[[3,4,"0","0",null],[9,11,"−1","-1",null],[24,27,"−10","-10",null],[34,35,"0","0",null]]],
  ["qf01-r3-c2-s05-p01",0,"今の規則は","6c0e16736252658c664e6b05ae337546b57b3a7430fd62c191123e9110f25746",[]],
  ["qf01-r3-c2-s05-p01",2,"です。入力を2に替え、","c61497f3c304f2f03bd9f8e57f501ce2cf079d5f6b509ce94afb7e82c0787304",[[6,7,"2","2",null]]],
  ["qf01-r3-c2-s05-p01",4,"を求めます。","a8b1a6b161d8d86eef888df3c634d707ddcef8dd22ffa2a2c15651a67e1d23ba",[]],
  ["qf01-r3-c2-s05-p02",0,"この規則で最初に行うのは、","5e6cd3598a92897b5ec1ead68d98fd527c00bf528c1e7c3a990c7755583860ac",[]],
  ["qf01-r3-c2-s05-p02",1,"2を二乗する","f1b4cdd6b7b6b25129a86951dc735c61bb6c9bb219e36135ee558042c41135a7",[[0,1,"2","2",null]]],
  ["qf01-r3-c2-s05-p02",2,"ことです。二乗の対象を変えずに、元の規則へ入れると次の式になります。","3fc273d1e91e50e3f330b0197004df41f703d78076018011a6654d3a977151ed",[]],
  ["qf01-r3-c2-s05-p03",0,"まず平方部分だけを計算します。二乗は同じ数二つの積です。","ec42d6936424d92332c674478dbec0a403dfd783aab70dadaaa4c0f997162eb6",[]],
  ["qf01-r3-c2-s05-p04",0,"求めた平方の値を元の関数へ戻すと、残る計算は4−1です。","45c13dce4b3725a7df75e200bd0d1eda63bf368e121d29a56e41b8a865f8f686",[[22,25,"4−1","4-1",null]]],
  ["qf01-r3-c2-s05-p05",0,"入力2に対応する値は3です。平方の値を求めることと、元の関数に残った引き算を行うことを分けて追いました。次は同じ規則に、式全体を入れます。","05f25d386576b756eb28021fdae604fae09c724d340ab15175168b0b03310977",[[2,3,"2","2",null],[10,11,"3","3",null]]],
  ["qf01-r3-c2-s06-p01",0,"入力をa−1に替え、","dfca80c50f7d97d02b4bb7d6173d76fb3e05aef581a16f4ac168a9959021f3ef",[[3,6,"a−1","a-1",null]]],
  ["qf01-r3-c2-s06-p01",2,"を求めます。二乗するのはa−1全体で、二乗の外の引き算も残します。","d5af14c6f0f73c240e3a3cb0412bf51d03693cebdd8050e88023c981297dae51",[[12,15,"a−1","a-1",null]]],
  ["qf01-r3-c2-s06-p02",0,"この式を見失わないように残し、ここでは平方部分","a599767b6cb6f2f8b8eee57abee5b394ee97947037f226a9f90354eae819a53b",[]],
  ["qf01-r3-c2-s06-p02",2,"だけを計算します。平方を同じ式二つの積に戻すと、分配の対象が分かります。","2aa12a4bc43462c69b413a4b486a0ad8960d4f8a25bf09001cea7024555a1323",[]],
  ["qf01-r3-c2-s06-p03",0,"最初の括弧のaと−1を、それぞれ後ろの括弧全体へ掛けます。符号を含む項として分配します。","8ab2b42e65ae35b7a45bd5023ef8b6ebcc296208e02365f62b1cf558844ebebf",[[6,7,"a","a",null],[8,10,"−1","-1",null]]],
  ["qf01-r3-c2-s06-p04",0,"まずa(a−1)を展開し、残った−1(a−1)はまだそのまま残します。","d178c6ae002256dde5bc9e322f3599cacbfe39301947205aeee1809a5185e1fc",[[2,8,"a(a−1)","a(a-1)",null],[16,23,"−1(a−1)","-1(a-1)",null]]],
  ["qf01-r3-c2-s06-p05",0,"次に、残った積−1(a−1)を展開します。既に求めたa²−aは変えません。","321b60bdc183ab0b98a8033928aa98ec1f65b228db81824731252cc4912fb0ef",[[7,14,"−1(a−1)","-1(a-1)",null],[26,30,"a²−a","a^2-a",null]]],
  ["qf01-r3-c2-s06-p06",0,"定数項+1が生まれたのは、","4014bf7290261856cb2bfdbe6230d59b1119600014f755b3cd6ac9d931554a38",[[3,5,"+1","+1",null]]],
  ["qf01-r3-c2-s06-p06",1,"括弧の外の−1と、括弧の中の−1との積","2459e565ebf5e390e1f5c0d627e3c64936fe44626d3551573d96c9e20400f4c9",[[5,7,"−1","-1",null],[14,16,"−1","-1",null]]],
  ["qf01-r3-c2-s06-p06",2,"を計算したからです。文字を含む積と定数どうしの積を区別すると、分配後の項の出どころを確かめられます。","53142cd25e0e7afb777d1a55699bf89c8b3592eea6d238ff75be43a6000c121c",[]],
  ["qf01-r3-c2-s06-p07",0,"分配を終えた平方部分はa²−a−a+1です。同じ文字aの項を、係数どうしの和としてまとめます。","29ea6d9492608f3149e59152c5fde2eb4cfae369604bdc94b2fb607b8066da4d",[[11,19,"a²−a−a+1","a^2-a-a+1",null],[26,27,"a","a",null]]],
  ["qf01-r3-c2-s06-p08",1,"なので、平方部分は","3ea5dffaab9aab4c46c2048fb016c903c04f95e345e98d25d67d067033514661",[]],
  ["qf01-r3-c2-s06-p08",3,"となりました。","c22454573b25957a3dc75c6280229835e84d1879ddd669eed3542462cc75301c",[]],
  ["qf01-r3-c2-s06-p09",0,"求めたいのは平方部分そのものではなく、","f963ea9586409cca134a51f7f1c0e2d530fe0d6c7b1dd9729a805b4dc32d3941",[]],
  ["qf01-r3-c2-s06-p09",2,"でした。親の式に平方部分の結果を戻し、外側の−1まで計算します。","b39564cc5d6ab8bc94f510e3519a84c920e45f2ea2a23a3b7bac2adeb208d049",[[22,24,"−1","-1",null]]],
  ["qf01-r3-c2-s06-p10",0,"平方部分の定数+1と、元の関数の外側の−1が打ち消し合いました。式を入力にしても、入力全体を置き換えること、必要な部分を計算すること、元の規則へ戻って最後まで計算することは同じです。","f2e24ceb958c7e7389ce376bd725c9bf0b910dc8cfc2d7537b5047ced96447bb",[[7,9,"+1","+1",null],[19,21,"−1","-1",null]]],
  ["qf01-r3-c3-s07-p01",0,"ここまでは与えられた規則へ入力を入れてきました。次は、長方形の条件から二つの長さの関係を作り、縦を決めたときに横がどう決まるかを調べます。","c9e907bc6c61836484154468c8154ea2ccea98727bd3950e36c958b82507fe61",[]],
  ["qf01-r3-c3-s07-p02",0,"周の長さが40cmの長方形で、縦をx cm、横をy cmとします。横の長さyを、縦の長さxを使った式で表すことが最初の目標です。","d74604f656aca0aface5c9c877a589e8c757258793dd5500366895c412691ce6",[[5,9,"40cm","40\\,\\mathrm{cm}","cm"],[17,21,"x cm","x\\,\\mathrm{cm}","cm"],[24,28,"y cm","y\\,\\mathrm{cm}","cm"],[37,38,"y","y",null],[44,45,"x","x",null]]],
  ["qf01-r3-c3-s07-p03",0,"周の長さとは、図形のまわりを一周した長さです。長方形では、向かい合う辺の長さは等しくなります。","7da2732ae3f882d0af77de6dc875a03cf6c73d561dcfb774a3f1edda5f402b27",[]],
  ["qf01-r3-c3-s07-p04",0,"この図を一周するとき、足すのは、","ef65763b2799cbe85622e05a4e41eed08eccbcc3106af634c97f5c2ef44eacf7",[]],
  ["qf01-r3-c3-s07-p04",1,"四辺すべての長さ","b55f22f8fa99a8f605471198fc7ecb03ebafc994da14f3ca3326f53ab41db147",[]],
  ["qf01-r3-c3-s07-p04",2,"です。左の辺から、下・右・上とたどって出発点に戻ります。","3904128402d3ecb6ca3b6122bd12d51fa97199d051a2ddfbd6963bf85de94eed",[]],
  ["qf01-r3-c3-s07-p05",0,"同じ文字の項をまとめると、周の長さは","079af6ff86f101d81997299d0ba4eba2ac01771fdf9c93ae43e3e555be22e40c",[]],
  ["qf01-r3-c3-s07-p05",2,"と表せます。xとyを同じ長さとみなすのでなく、xの辺どうし、yの辺どうしをまとめています。","ab522ebe843f5926c52ad3b017f27afb96cb181df6c371ec9ede9e071bd5a7c8",[[6,7,"x","x",null],[8,9,"y","y",null],[23,24,"x","x",null],[30,31,"y","y",null]]],
  ["qf01-r3-c3-s07-p06",0,"問題では、この一周分の長さが40cmと与えられていました。図から作った周長の式と与件の周長を等しいと置きます。","12cb6795a9bbbe9e26bb7777233a803cfc0303cf20b376b0627be8e33d0232ae",[[14,18,"40cm","40\\,\\mathrm{cm}","cm"]]],
  ["qf01-r3-c3-s07-p07",0,"等しい両辺へ同じ操作をすれば、関係を保てます。共通係数2をなくして簡単にするため、","8a1ad941d8e1517f708fa63467da4c3cbed92d371b424b6c9fbc11173196aeac",[[27,28,"2","2",null]]],
  ["qf01-r3-c3-s07-p07",1,"両辺を2で割る","9c5b086d43fd857ffdbc39d9d38f8c0a48ed7c6c62e0dc7dcca77c991d8bb3b4",[[3,4,"2","2",null]]],
  ["qf01-r3-c3-s07-p07",2,"ことにします。","eccb8aa98a01b63d78392790be0f3e09989730e0913ac4892fa9e52ff64d9566",[]],
  ["qf01-r3-c3-s07-p08",0,"求めたいのは横の長さです。縦を使った式で表すため、左辺に単独で残す記号は","0cfa67ef57e50427b82b0158aa049724fbc6a98d2acabcc447912d4e66d0c388",[]],
  ["qf01-r3-c3-s07-p08",2,"です。","f6f8b5c179a9e05a9401d90be72a6e3145fbf3d1b4299d9c521f457d8d4c8524",[]],
  ["qf01-r3-c3-s07-p09",0,"両辺からxを引くと、左辺のxを打ち消せます。","89485849b0c6911c586fbb2a381be1ab25a12b8909d1faa87dacfc01ee354965",[[4,5,"x","x",null],[13,14,"x","x",null]]],
  ["qf01-r3-c3-s07-p10",0,"縦の長さxを決めると、20からその長さを引いて横の長さyがただ一つ決まります。ただし、どんな数をxに入れても長方形が作れるわけではありません。次に、使える入力の範囲を調べます。","872c52a4bbda5a88f14b4c8bc42ba3a3c762413ff9bebc3ea525309381937a62",[[4,5,"x","x",null],[11,13,"20","20",null],[27,28,"y","y",null],[48,49,"x","x",null]]],
  ["qf01-r3-c3-s08-p01",0,"同じ長方形について、関係","954281e0281096782505bf6c76cee7885915f456ce89e589ba54f8dbc37abdaa",[]],
  ["qf01-r3-c3-s08-p01",2,"を使います。今度の目標は、長方形を作れる縦の長さxの範囲を求めることです。","fe220a7c65fd27fec4920eb8d0fdbe022b27458af76f351c4f21dd66ee2c693a",[[24,25,"x","x",null]]],
  ["qf01-r3-c3-s08-p02",0,"縦も横も実際の辺の長さです。一辺が0なら形がつぶれ、負の長さも辺には使えません。二つの辺がともに正であることが必要です。","1e7c661625f309daecc268cf26f974f7a118c90a9956d8406d86c4138b6ff66b",[[17,18,"0","0",null]]],
  ["qf01-r3-c3-s08-p03",0,"横が正という条件を、縦の長さxについての条件へ直します。既に得たyの式を使います。","17994a35105d0af607ddca3a4e6c14bff9acdc2d231d8577ae47c06da680b07e",[[14,15,"x","x",null],[32,33,"y","y",null]]],
  ["qf01-r3-c3-s08-p04",0,"両辺にxを足し、最後にxを左側から読む形に直します。","a4ccef4767320609b7ac613f168889c585de596bbce959074111ce1f382f1c0d",[[3,4,"x","x",null],[11,12,"x","x",null]]],
  ["qf01-r3-c3-s08-p05",0,"横が正であるにはx<20、縦が正であるにはx>0が必要です。両方を同時に満たす範囲へまとめます。","25adc89778717a7ff3ca7ce4e7c425e2e17cf15964505e47ac83203e69b9c3f3",[[8,12,"x<20","x<20",null],[21,24,"x>0","x>0",null]]],
  ["qf01-r3-c3-s08-p06",0,"このように、関数で使える入力の範囲を定義域といいます。今回の不等式を、境界の値の扱いに注目して言葉で読みます。","8b3a028f9fb67598733be12c95ba8b90897a5188923b6a507dacd1fb7bb66562",[]],
  ["qf01-r3-c3-s08-p07",0,"この不等式は、0と20をどちらも","858385e1664cdf24431079e23fb8a27bd613b75d2095142e67708e6eb756dc9f",[[7,8,"0","0",null],[9,11,"20","20",null]]],
  ["qf01-r3-c3-s08-p07",1,"含めない","b3758473073e4709c00cef4f66eaaf00fa9847654963cd950b1a65e722974be1",[]],
  ["qf01-r3-c3-s08-p07",2,"という意味です。x=0では縦の辺が0、x=20ではy=20−x=0となって横の辺が0になります。周の和が40でも、つぶれていない長方形ではなくなるためです。","e715e5417b0f932f173fd0856b63e91b705d0f117a452214cc2d600fe4bce011",[[8,11,"x=0","x=0",null],[17,18,"0","0",null],[19,23,"x=20","x=20",null],[25,33,"y=20−x=0","y=20-x=0",null],[41,42,"0","0",null],[52,54,"40","40",null]]],
  ["qf01-r3-c3-s08-p08",0,"逆に、0<x<20のどのxでも、縦は正で、横y=20−xも正になります。周の式へ戻して確かめると、次のようになります。","d8b6d57f8e7e73ca902a07a10be8942bf84b98c3c74a3f92a82482dbadf36377",[[3,9,"0<x<20","0<x<20",null],[12,13,"x","x",null],[22,28,"y=20−x","y=20-x",null]]],
  ["qf01-r3-c3-s08-p09",0,"したがって、この範囲のどの入力でも、元の条件を満たす長方形を作れます。必要な条件を集めただけでなく、範囲内の値で実際に条件を満たすことも確かめました。","aa2ec42451ff4816d42f787119347dd05c078d1526fa039f7792224c16fd5463",[]],
  ["qf01-r3-c3-s09-p01",0,"同じ関係","dc1e7e9d74e17e18b45929ab691563024931ba68bba313d84a616aa8a188b8c2",[]],
  ["qf01-r3-c3-s09-p01",2,"で、入力は","2d1aded36dc97f83ee6884e5e129300115683478ae32c0e5dbf38dd835a6ea14",[]],
  ["qf01-r3-c3-s09-p01",4,"です。最後に、出力である横の長さyがどの範囲に入るかを調べます。","94ad0082e49c7b76ac8a8e9d6ccb97ff47ffb52849621a35db73c789fa252337",[[16,17,"y","y",null]]],
  ["qf01-r3-c3-s09-p02",0,"横が正という条件は、既に長方形の成立条件として得ています。同じ条件をもう一度求め直さず、出力の下側の条件として使います。","1bafdbdc1f13a715d262574deef90f8f50ef467fd3f0f34dec9d36f2fa6f6121",[]],
  ["qf01-r3-c3-s09-p03",0,"一方、入力xは正です。20から正の長さを引くので、出力yは","685dac454c07d4533c490f1ff856cac843e528ae32ce26a328711f18f43e4cec",[[5,6,"x","x",null],[11,13,"20","20",null],[27,28,"y","y",null]]],
  ["qf01-r3-c3-s09-p03",1,"20より小さい","625259a009d8f7b2e2b3f6bf1f8f18fb409347dcb78bba387f5058d578760435",[[0,2,"20","20",null]]],
  ["qf01-r3-c3-s09-p03",2,"と分かります。","d7fe69996b5d28eb3833f8e6bd3df81cb2e50006209d2b15a3bbbc0e016c205b",[]],
  ["qf01-r3-c3-s09-p04",0,"下側と上側の条件を合わせ、出力の範囲を一つにまとめます。","bbd1399da44f595e23fe9b42ffdb32a32d6bbb4f760b994df98be5d0bbe5fe7a",[]],
  ["qf01-r3-c3-s09-p05",0,"出力の範囲を値域といいます。定義域では入力x、値域では出力yを見ています。同じ0と20が出てきても、調べている量の役割は区別します。","e6accbb28a8b9a3ee2518f6ab9e45e8a4faa30bac26f35c71c754b1ba6f45cc1",[[21,22,"x","x",null],[29,30,"y","y",null],[39,40,"0","0",null],[41,43,"20","20",null]]],
  ["qf01-r3-c3-s09-p06",0,"ここまでで、得られる出力がこの範囲に入ることが分かりました。さらに、この範囲の途中の値もすべて実現することを確かめます。ここからの逆対応による確認は作者補足です。","774f1b2fd323f3951350db211cd5a5f3bc2fc35789d27bef3ad9d1be74bff544",[]],
  ["qf01-r3-c3-s09-p07",0,"任意の0<y<20を選び、その出力を作る入力を探します。y=20−xを、今度は入力xについて解きます。","4ec180626a7cc1292f4ccd3dd390935d3f2b5fc6e82ab4736adea619f9bd156c",[[3,9,"0<y<20","0<y<20",null],[28,34,"y=20−x","y=20-x",null],[41,42,"x","x",null]]],
  ["qf01-r3-c3-s09-p08",0,"y<20なので20−y>0、またy>0なので20−y<20です。作った入力x=20−yは、定義域0<x<20を満たします。","1ea065a8696ba00496d394b0dbba48917a01a4aff329274e0ba456135e95c5eb",[[0,4,"y<20","y<20",null],[7,13,"20−y>0","20-y>0",null],[16,19,"y>0","y>0",null],[22,29,"20−y<20","20-y<20",null],[37,43,"x=20−y","x=20-y",null],[48,54,"0<x<20","0<x<20",null]]],
  ["qf01-r3-c3-s09-p09",0,"この入力を使えば、選んだ出力yが実際に得られます。したがって0<y<20のどの値も実現し、値域はこの範囲全体です。","a9cd4a688892f162c09dc259a78880fd947fd11e60c687aefe3dff931b488497",[[14,15,"y","y",null],[30,36,"0<y<20","0<y<20",null]]],
  ["qf01-r3-c0-s09-p01",0,"関数では、一つの入力を決めると対応する出力がただ一つ決まります。f(x)は入力xに対応する値を表す記号で、入力と出力が等しいという意味ではありません。","9b4ed337c304943780ea98dfb87e5926839c7726017b1b8e1444d9665fbdecbe",[[32,36,"f(x)","f(x)",null],[39,40,"x","x",null]]],
  ["qf01-r3-c0-s09-p02",0,"与えられた規則へ数や式を入れるときは、入力全体を元の文字の位置へ入れます。括弧はそのまとまりを保つために使い、途中で必要な部分だけを計算したときも、最後に元の規則へ戻って残った操作まで確かめます。","6138f72781427e7fd860fa111a5053f5553780b1f16c51566d195fd1b0a84d86",[]],
  ["qf01-r3-c0-s09-p03",0,"状況から関数を作るときは、まず条件が表す関係を読み取ります。長方形では、一周する四辺の和と周40cmを結び、横の長さが縦からどう決まるかを表しました。式の変形は、何を求めたいかという目的に合わせて進めます。","1930aac8295d035bcd7ed59ec0883302978d2018333c1cc5a1870f5592e3c603",[[46,50,"40cm","40\\,\\mathrm{cm}","cm"]]],
  ["qf01-r3-c0-s09-p04",0,"さらに、使える入力の範囲が定義域、そこから得られる出力の範囲が値域です。長さの条件と境界の値を調べ、必要なら逆に入力を作ることで、示した範囲のすべての値が実現することまで確かめられます。規則・入力・出力・範囲の役割を区別して読むことが、今回の関数の見方です。","9e5375b2fec35bf9ed8ad800d63793c22565cc5ce9a3e586c41f89271ebecc6a",[]],
]
const r3BodyIndex = new Map(R3_BODY_SOURCE_PARTS.map(row => [row[0] + ':' + row[1], row]))
export type R3BodyOrigin = { blockId: string; partIndex: number; start: number; end: number; kind: 'whole-part' | 'text-span' | 'slot' }
export type R3BodyToken = { type: 'text'; text: string } | { type: 'math'; latex: string; start: number; end: number; unit: 'cm' | null }
function bodyNeed(value: unknown, reason: string): asserts value { if (!value) throw Error('R3_BODY_' + reason) }
function bodyOffset(text: string, value: number) {
  return Number.isSafeInteger(value) && value >= 0 && value <= text.length
    && !(value > 0 && value < text.length && /[\uD800-\uDBFF]/.test(text[value - 1]) && /[\uDC00-\uDFFF]/.test(text[value]))
}
function bodyRecipe(source: QF01R3Validated, blockId: string, partIndex: number): R3BodyRecipe {
  const recipe = r3BodyIndex.get(blockId + ':' + partIndex), block = source.blocks.get(blockId)
  bodyNeed(recipe && Number.isSafeInteger(partIndex) && partIndex >= 0 && block && (block.type === 'paragraph' || block.type === 'formula'), 'PART_IDENTITY')
  const part = block.parts[partIndex], binding = source.metadata.sourceMap.find(row => row.unitBlockId === blockId)?.parts.find(row => row.unitPartIndex === partIndex)
  bodyNeed(part?.type === 'text' && part.text === recipe[2] && binding?.unitPartSHA256 === recipe[3], 'SOURCE_BINDING')
  return recipe
}
function validateQF01R3BodySource(source: QF01R3Validated) {
  bodyNeed(source.metadata.unitParsedCanonicalSHA256 === '8af6a22c1656d6c37a799b30b42f51036d3a6f49879b0c9a85970f6020dc8e08'
    && source.metadata.canonicalBlockIds.length === 134 && source.metadata.interactions.length === 35
    && R3_BODY_SOURCE_PARTS.length === 102 && r3BodyIndex.size === 102, 'SOURCE_MANIFEST')
  let textParts = 0, spans = 0
  for (const id of source.metadata.canonicalBlockIds) {
    const block = source.blocks.get(id)
    bodyNeed(block, 'CANONICAL_BLOCK')
    if (block.type !== 'paragraph' && block.type !== 'formula') continue
    block.parts.forEach((part, partIndex) => {
      if (part.type !== 'text') return
      const recipe = bodyRecipe(source, id, partIndex)
      let previous = 0
      for (const [start, end, lexeme] of recipe[4]) {
        bodyNeed(bodyOffset(part.text, start) && bodyOffset(part.text, end) && start >= previous && end > start && part.text.slice(start, end) === lexeme, 'SPAN_BINDING')
        previous = end; spans++
      }
      textParts++
    })
  }
  bodyNeed(textParts === 102 && spans === 140, 'SOURCE_COVERAGE')
}
function qf01R3BodySlice(source: QF01R3Validated, origin: R3BodyOrigin, visibleText: string): R3BodyToken[] {
  bodyNeed(origin.kind !== 'slot', 'HIDDEN_SLOT')
  const recipe = bodyRecipe(source, origin.blockId, origin.partIndex), original = recipe[2], { start, end } = origin
  bodyNeed(bodyOffset(original, start) && bodyOffset(original, end) && end >= start && original.slice(start, end) === visibleText, 'VISIBLE_SLICE')
  bodyNeed(!recipe[4].some(([left, right]) => left < start && start < right || left < end && end < right), 'SPLIT_MATH_UNIT')
  const tokens: R3BodyToken[] = []
  let cursor = start
  for (const [left, right, lexeme, latex, unit] of recipe[4]) {
    if (left < start || right > end) continue
    bodyNeed(visibleText.slice(left - start, right - start) === lexeme, 'VISIBLE_LEXEME')
    if (left > cursor) tokens.push({ type: 'text', text: visibleText.slice(cursor - start, left - start) })
    tokens.push({ type: 'math', latex, start: left, end: right, unit }); cursor = right
  }
  if (cursor < end) tokens.push({ type: 'text', text: visibleText.slice(cursor - start) })
  return tokens
}
function qf01R3BodyOrigins(source: QF01R3Validated, blockId: string, projected: NonNullable<ReturnType<typeof projectQF01R3Block>>, solved: Set<string>, recorded = false): R3BodyOrigin[] {
  const block = source.blocks.get(blockId)
  bodyNeed(block?.type === 'paragraph' && projected.source === block, 'PROJECTED_SOURCE')
  const parts = projected.parts ?? block.parts, q = source.metadata.interactions.find(row => row.source.blockId === blockId)
  if (q && !solved.has(q.id)) {
    bodyNeed(!recorded && projected.slotItemId === q.id, 'PENDING_GATE')
    const pieces = q.projection.pending.pieces
    bodyNeed(pieces && pieces.length === parts.length, 'PENDING_PIECES')
    return pieces.map((piece, index) => {
      bodyNeed(piece.blockId === blockId && Number.isSafeInteger(piece.partIndex) && piece.partIndex >= 0, 'PIECE_IDENTITY')
      const original = block.parts[piece.partIndex], part = parts[index]
      bodyNeed(original && part, 'PIECE_PART')
      if (piece.kind === 'slot') {
        bodyNeed(part.type === 'choice' && part.itemId === q.id, 'SLOT_IDENTITY')
        return { blockId, partIndex: piece.partIndex, kind: 'slot', start: 0, end: 0 }
      }
      if (piece.kind === 'whole-part') {
        bodyNeed(part === original, 'WHOLE_PART')
        return { blockId, partIndex: piece.partIndex, kind: 'whole-part', start: 0, end: original.type === 'text' ? original.text.length : 0 }
      }
      bodyNeed(original.type === 'text' && part.type === 'text' && piece.start !== undefined && piece.end !== undefined
        && bodyOffset(original.text, piece.start) && bodyOffset(original.text, piece.end) && piece.end >= piece.start
        && original.text.slice(piece.start, piece.end) === part.text, 'PIECE_SLICE')
      return { blockId, partIndex: piece.partIndex, kind: 'text-span', start: piece.start, end: piece.end }
    })
  }
  bodyNeed(parts.length === block.parts.length && parts.every((part, index) => part === block.parts[index]), 'COMPLETE_PARTS')
  return parts.map((part, partIndex) => ({ blockId, partIndex, kind: 'whole-part', start: 0, end: part.type === 'text' ? part.text.length : 0 }))
}

/** R3's source-bound body surface and its associated projection contract stay
 * together inside the approved renderer path; feedback remains independent. */
export function R3BodyText({ source, origin, visibleText, sourceId, unitId }: { source: QF01R3Validated; origin: R3BodyOrigin; visibleText: string; sourceId: string; unitId: string }) {
  return <span>{qf01R3BodySlice(source, origin, visibleText).map((token, index) => {
    if (token.type === 'text') return token.text
    const id = sourceId + '-body-p' + origin.partIndex + '-' + token.start + '-' + token.end
    return <span key={index} data-qf01-prose-math="true" data-qf01-prose-block={origin.blockId} data-qf01-prose-part={origin.partIndex} data-qf01-prose-start={token.start} data-qf01-prose-end={token.end} data-qf01-prose-kind={token.unit ? 'quantity' : 'math'} data-qf01-prose-unit={token.unit ?? undefined} data-qf01-prose-source-id={id}><TypesetInlineMath latex={token.latex} sourceId={id} unitId={unitId} /></span>
  })}</span>
}
R3BodyText.validateSource = validateQF01R3BodySource
R3BodyText.slice = qf01R3BodySlice
R3BodyText.origins = qf01R3BodyOrigins

type R3NearbyVisibility = 'IN_VIEW' | 'OUT_OF_VIEW' | 'NOT_MOUNTED_BY_DESIGN' | 'UNVERIFIED'
type R3NearbyMeasurement = { status: R3NearbyVisibility; reason: string }
type R3BodyPlan = { parts: TextbookReadingPart[]; origins: R3BodyOrigin[] }

function ValidatedR3QF01ReadingFlow({ unit, section, progress, source, storageScope, onReviewAnswer, onSummaryReached }: Props & { source: QF01R3Validated }) {
  const answer = useAppStore(state => state.answerTextbook)
  const progressState = useMemo(() => { try { return { value: effectiveTextbookProgress(unit, progress), error: false } } catch { return { value: undefined, error: true } } }, [unit, progress])
  const current = progressState.value, m = source.metadata
  const solved = useMemo(() => qf01R3Solved(source, current?.answers), [source, current?.answers])
  const stages = m.viewContracts.STAGE_HISTORY_CONTRACT.stages
  const firstQ = m.interactions.find(q => !solved.has(q.id))
  const maxStage = firstQ ? stages.findIndex(s => s.stageId === firstQ.stageId) : stages.length - 1
  const storageKey = 'math-textbook-compact-v1:' + unit.unitId + ':r3' + (storageScope ? ':scope:' + storageScope : '')
  const [cursor, setCursor] = useState(() => { const value = Number(window.localStorage.getItem(storageKey) ?? 0); return Number.isInteger(value) && value >= 0 ? Math.min(value, maxStage) : 0 })
  const stageIndex = Math.min(cursor, maxStage), stageInfo = stages[stageIndex], stage = { id: stageInfo.stageId }
  const currentQ = m.interactions.find(q => q.stageId === stage.id && !solved.has(q.id) && q.progressionRequires.every(id => solved.has(id)))
  const frame = m.viewContracts.FRAME_CONTRACT.frames.find(f => f.contextId === stageInfo.contextId)!
  const complete = stageInfo.availableWhen.allSolved.every(id => solved.has(id))
  const [activeId, setActiveId] = useState<string | null>(null), [helpId, setHelpId] = useState<string | null>(null)
  const [history, setHistory] = useState(false), [fullHistory, setFullHistory] = useState(false)
  const contextId = useId(), flow = useRef<HTMLDivElement>(null)
  const selectedRefs = m.viewContracts.INTERACTION_REFERENCES.rows.find(row => row.currentInteractionId === currentQ?.id)
  const preludeIds = useMemo(() => m.viewContracts.FRAME_CONTRACT.stagePreludeRefs[stage.id] ?? [], [m, stage.id])
  const nearbyRequest = useMemo(() => {
    const candidates: { blockId: string; recordId: string; sourceStage: number }[] = []
    const add = (recordId: string) => {
      const record = m.viewContracts.RESULT_REGISTRY.records.find(row => row.id === recordId)
      if (!record || !('readonly' in record) || record.readonly !== true || !record.availableWhen.allSolved.every(id => solved.has(id))) return
      const blockId = record.sourceRef.blockId
      if (candidates.some(row => row.blockId === blockId) || !projectQF01R3Block(source, blockId, solved, { helpFor: helpId, recorded: true })) return
      candidates.push({ blockId, recordId, sourceStage: stages.findIndex(row => row.stageId === record.stageId) })
    }
    for (const id of selectedRefs?.nearbyReferenceRecordIds ?? []) add(id)
    if (currentQ && m.viewContracts.FIGURE_POLICY.placement.requiredCurrentInteractionIds.includes(currentQ.id)) {
      for (const blockId of frame.figureBlockRefs) {
        const record = m.viewContracts.RESULT_REGISTRY.records.find(row => row.sourceRef.blockId === blockId)
        if (record) add(record.id)
      }
    }
    return { candidates, placements: new Set([...stageInfo.fullLessonBlockRefs, ...preludeIds]),
      key: JSON.stringify([stageInfo.stageId, currentQ?.id, helpId, [...solved], history, fullHistory, candidates]) }
  }, [m, source, stages, selectedRefs, currentQ, frame, stageInfo, preludeIds, helpId, solved, history, fullHistory])
  const [nearbySnapshot, setNearbySnapshot] = useState<{ key: string; sources: Record<string, R3NearbyMeasurement> }>({ key: '', sources: {} })
  const nearbySources = nearbySnapshot.key === nearbyRequest.key ? nearbySnapshot.sources : {}
  const nearbyBlocked = Object.values(nearbySources).some(row => row.status === 'UNVERIFIED')
  // Validation of declared visible slices creates no DOM, KaTeX or measurement
  // for the omitted part of an unresolved paragraph.
  const bodyProjection = useMemo(() => {
    const plans = new Map<string, R3BodyPlan>()
    try {
      for (const id of source.metadata.canonicalBlockIds) {
        if (source.blocks.get(id)?.type !== 'paragraph') continue
        const projected = projectQF01R3Block(source, id, solved, { helpFor: helpId })
        if (!projected) continue
        const parts = projected.parts ?? (projected.source as Extract<TextbookReadingBlock, { type: 'paragraph' }>).parts
        const origins = qf01R3BodyOrigins(source, id, projected, solved)
        parts.forEach((part, index) => { if (part.type === 'text') qf01R3BodySlice(source, origins[index], part.text) })
        plans.set(id, { parts, origins })
      }
      return { plans, failed: false }
    } catch { return { plans: new Map<string, R3BodyPlan>(), failed: true } }
  }, [source, solved, helpId])
  const bodyBlocked = bodyProjection.failed, interactionBlocked = nearbyBlocked || bodyBlocked
  const resyncNearby = useRef<() => void>(() => {})
  const syncNearbySources = useCallback(() => resyncNearby.current(), [])
  const data = { nodes: m.interactions.map(q => ({ id: q.nodeId, stageId: q.stageId, interaction: q.id })) }
  const resolved = (id: string) => solved.has(id)
  const first = firstQ ? m.interactions.indexOf(firstQ) : -1
  const viewportBounds = useCallback(() => {
    let top = 0, bottom = innerHeight
    for (const element of document.querySelectorAll<HTMLElement>('header, nav, [data-fixed-header]')) {
      const style = getComputedStyle(element), r = element.getBoundingClientRect()
      if (style.position !== 'fixed' && style.position !== 'sticky') continue
      // A fixed bottom navigation is an obstruction below, never a top header.
      if (Number.isFinite(Number.parseFloat(style.top)) && r.top < innerHeight / 2) top = Math.max(top, r.bottom)
      else if (style.position === 'fixed' && Number.isFinite(Number.parseFloat(style.bottom)) && r.top > innerHeight / 2) bottom = Math.min(bottom, r.top)
    }
    return { top: top + 12, bottom: bottom - 12 }
  }, [])
  useLayoutEffect(() => {
    let alive = true, pending: number | null = null, turns = 0, previous = '', convergenceFailed = false
    const measure = (): Record<string, R3NearbyMeasurement> => {
      const result: Record<string, R3NearbyMeasurement> = {}
      const nodes = [...(flow.current?.querySelectorAll<HTMLElement>('[data-source-view="canonical"][data-source-block]') ?? [])]
      for (const candidate of nearbyRequest.candidates) {
        const matches = nodes.filter(node => node.getAttribute('data-source-block') === candidate.blockId)
        let row: R3NearbyMeasurement
        if (!matches.length) {
          row = candidate.sourceStage >= 0 && candidate.sourceStage < stageIndex && !nearbyRequest.placements.has(candidate.blockId)
            ? { status: 'NOT_MOUNTED_BY_DESIGN', reason: 'PRIOR_STAGE_CANONICAL_NOT_PLACED' }
            : { status: 'UNVERIFIED', reason: 'MISSING_CANONICAL' }
        } else if (matches.length !== 1) row = { status: 'UNVERIFIED', reason: 'MULTIPLE_CANONICAL' }
        else {
          try {
            const node = matches[0], rect = node.getBoundingClientRect(), bounds = viewportBounds()
            const valid = (r: DOMRect) => [r.top, r.bottom, r.left, r.right, r.width, r.height].every(Number.isFinite) && r.width > 0 && r.height > 0
            if (!valid(rect) || !Number.isFinite(innerWidth) || innerWidth <= 0 || !Number.isFinite(bounds.top) || !Number.isFinite(bounds.bottom) || bounds.bottom <= bounds.top) throw new Error('INVALID_RECT')
            let left = 0, right = innerWidth, top = bounds.top, bottom = bounds.bottom
            for (let parent: HTMLElement | null = node; parent; parent = parent.parentElement) {
              const style = getComputedStyle(parent)
              if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || Number.parseFloat(style.opacity) === 0 || style.contentVisibility === 'hidden' || style.clipPath && style.clipPath !== 'none') throw new Error('UNREADABLE_CANONICAL')
              if (parent === node) continue
              const clipX = /^(auto|scroll|hidden|clip)$/.test(style.overflowX || style.overflow)
              const clipY = /^(auto|scroll|hidden|clip)$/.test(style.overflowY || style.overflow)
              if (!clipX && !clipY) continue
              const r = parent.getBoundingClientRect()
              if (!valid(r) || clipX && parent.clientWidth <= 0 || clipY && parent.clientHeight <= 0) throw new Error('INVALID_CLIP_RECT')
              if (clipX) { left = Math.max(left, r.left + parent.clientLeft); right = Math.min(right, r.left + parent.clientLeft + parent.clientWidth) }
              if (clipY) { top = Math.max(top, r.top + parent.clientTop); bottom = Math.min(bottom, r.top + parent.clientTop + parent.clientHeight) }
            }
            row = rect.left >= left && rect.right <= right && rect.top >= top && rect.bottom <= bottom
              ? { status: 'IN_VIEW', reason: 'FULL_CANONICAL_RECT_VISIBLE' }
              : { status: 'OUT_OF_VIEW', reason: 'CANONICAL_RECT_CLIPPED' }
          } catch { row = { status: 'UNVERIFIED', reason: 'CANONICAL_MEASUREMENT_FAILED' } }
        }
        result[candidate.blockId] = row
      }
      return result
    }
    const commit = (sources: Record<string, R3NearbyMeasurement>) => {
      const next = { key: nearbyRequest.key, sources }, signature = JSON.stringify(next)
      setNearbySnapshot(old => JSON.stringify(old) === signature ? old : next)
    }
    const settle = () => {
      pending = null
      if (!alive || convergenceFailed) return
      const sources = measure(), signature = JSON.stringify(sources)
      if (signature === previous) return
      if (++turns > 6) {
        convergenceFailed = true
        commit(Object.fromEntries(nearbyRequest.candidates.map(row => [row.blockId, { status: 'UNVERIFIED', reason: 'NON_CONVERGENT_LAYOUT' }])))
        return
      }
      previous = signature; commit(sources)
      pending = requestAnimationFrame(settle)
    }
    const restart = () => {
      if (pending !== null) cancelAnimationFrame(pending)
      turns = 0; previous = ''; convergenceFailed = false; settle()
    }
    const layoutChanged = () => { if (pending === null && !convergenceFailed) restart() }
    resyncNearby.current = restart
    restart()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(layoutChanged)
    if (flow.current) {
      observer?.observe(flow.current)
      flow.current.querySelectorAll<HTMLElement>('[data-source-view="canonical"]').forEach(node => observer?.observe(node))
      flow.current.addEventListener('load', layoutChanged, true)
      flow.current.addEventListener('typeset-layout', layoutChanged)
    }
    const root = flow.current
    // Scroll does not bubble from nested clipping/scroll containers.
    window.addEventListener('scroll', restart, { passive: true, capture: true }); window.addEventListener('resize', restart)
    document.fonts?.addEventListener('loadingdone', layoutChanged)
    document.fonts?.ready.then(() => { if (alive) layoutChanged() })
    return () => {
      alive = false; if (pending !== null) cancelAnimationFrame(pending)
      resyncNearby.current = () => {}; observer?.disconnect()
      window.removeEventListener('scroll', restart, true); window.removeEventListener('resize', restart)
      root?.removeEventListener('load', layoutChanged, true); root?.removeEventListener('typeset-layout', layoutChanged)
      document.fonts?.removeEventListener('loadingdone', layoutChanged)
    }
  }, [nearbyRequest, stageIndex, viewportBounds])
  const reveal = useCallback((target: HTMLElement | null) => {
    if (!target) return
    const { top, bottom } = viewportBounds(), r = target.getBoundingClientRect()
    flow.current?.style.setProperty('--qf01-header-clearance', top + 'px')
    if (r.top < top || r.top > bottom - 48) window.scrollBy({ top: r.top - top, behavior: 'auto' })
    else if (r.bottom > bottom && r.height <= bottom - top) window.scrollBy({ top: r.bottom - bottom, behavior: 'auto' })
  }, [viewportBounds])
  useEffect(() => { window.localStorage.setItem(storageKey, String(stageIndex)) }, [stageIndex, storageKey])
  useEffect(() => { onSummaryReached?.(false) }, [onSummaryReached])
  useEffect(() => { setCursor(value => Math.min(value, maxStage)) }, [maxStage])
  const focusRevealFrame = useRef<number | null>(null)
  const pointerFocusTarget = useRef<HTMLElement | null>(null)
  const cancelFocusReveal = useCallback(() => {
    if (focusRevealFrame.current !== null) cancelAnimationFrame(focusRevealFrame.current)
    focusRevealFrame.current = null
  }, [])
  const revealFocusedChoice = useCallback((target: HTMLElement) => {
    cancelFocusReveal()
    // Preserve the pointer press/click transaction: its focus uses the existing reveal.
    if (pointerFocusTarget.current === target) { reveal(target); return }
    const stillCurrent = () => document.activeElement === target && Boolean(flow.current?.querySelector('.math-textbook-stage--current')?.contains(target))
    const adjust = () => { if (stillCurrent()) { reveal(target); syncNearbySources() } }
    adjust()
    // Repeated source context can be inserted by the focus-triggered scroll.
    // Remeasure after that commit, then settle once more after its scroll event.
    // These frames belong only to this explicit focus; manual scroll never starts them.
    focusRevealFrame.current = requestAnimationFrame(() => {
      adjust()
      focusRevealFrame.current = requestAnimationFrame(() => {
        focusRevealFrame.current = null
        if (stillCurrent()) reveal(target)
      })
    })
  }, [cancelFocusReveal, reveal, syncNearbySources])
  useEffect(() => {
    const clearPointer = () => { pointerFocusTarget.current = null }
    const keyboardInput = () => { clearPointer(); cancelFocusReveal() }
    window.addEventListener('pointerdown', cancelFocusReveal, true)
    window.addEventListener('pointerup', clearPointer)
    window.addEventListener('pointercancel', clearPointer)
    window.addEventListener('blur', keyboardInput)
    window.addEventListener('wheel', cancelFocusReveal, { passive: true })
    window.addEventListener('touchstart', cancelFocusReveal, { passive: true })
    window.addEventListener('keydown', keyboardInput)
    return () => {
      cancelFocusReveal()
      window.removeEventListener('wheel', cancelFocusReveal)
      window.removeEventListener('touchstart', cancelFocusReveal)
      window.removeEventListener('keydown', keyboardInput)
      window.removeEventListener('pointerdown', cancelFocusReveal, true)
      window.removeEventListener('pointerup', clearPointer)
      window.removeEventListener('pointercancel', clearPointer)
      window.removeEventListener('blur', keyboardInput)
      clearPointer()
    }
  }, [cancelFocusReveal])
  // Clear the old stage before the current layout effect schedules its reveal.
  useLayoutEffect(() => { cancelFocusReveal(); pointerFocusTarget.current = null }, [stageIndex, cancelFocusReveal])
  const activeValue = activeId ? current?.answers[activeId]?.value : undefined
  const activeAttemptCount = activeId ? current?.answers[activeId]?.attemptCount : undefined
  const lastResolvedNodeId = [...data.nodes].reverse().find(node => node.stageId === stage.id && node.interaction && resolved(node.interaction))?.id
  useLayoutEffect(() => {
    const check = syncNearbySources
    // Commit any repeated context before the next frame measures the panel.
    // Wrong feedback can move an already focused choice without another focus event.
    check()
    const currentTarget = () => {
      const currentStage = flow.current?.querySelector<HTMLElement>('.math-textbook-stage--current')
      const panel = activeId ? currentStage?.querySelector<HTMLElement>('[data-testid="inline-choice-panel-' + activeId + '"]') : null
      const completedRow = lastResolvedNodeId ? currentStage?.querySelector<HTMLElement>('[data-source-node="' + lastResolvedNodeId + '"] .transformation-equation') : null
      const focused = document.activeElement
      return panel && focused instanceof HTMLElement && panel.contains(focused)
        ? focused : panel ?? currentStage?.querySelector<HTMLElement>('[data-qf01-current-slot]') ?? completedRow ?? null
    }
    cancelFocusReveal()
    // Revealing feedback can scroll the original conditions out of view. Their
    // readonly reappearance then moves the focused candidate once more.
    // Remeasure after that commit; explicit manual input cancels every frame.
    let alive = true
    focusRevealFrame.current = requestAnimationFrame(() => {
      if (!alive) return
      reveal(currentTarget()); check()
      if (!alive) return
      focusRevealFrame.current = requestAnimationFrame(() => {
        if (!alive) return
        reveal(currentTarget()); check()
        if (!alive) return
        focusRevealFrame.current = requestAnimationFrame(() => {
          if (!alive) return
          focusRevealFrame.current = null
          reveal(currentTarget())
        })
      })
    })
    return () => { alive = false; cancelFocusReveal() }
  }, [stageIndex, activeId, first, activeValue, activeAttemptCount, lastResolvedNodeId, syncNearbySources, reveal, cancelFocusReveal])
  const formulaRecipes = useMemo(() => new Map(m.canonicalBlockIds.filter(id => source.blocks.get(id)?.type === 'formula').map(id => [id, qf01R3FormulaRecipe(source, id)])), [source, m.canonicalBlockIds])
  const recipeGroups = useMemo(() => {
    const key = (id: string) => {
      const number = m.viewContracts.RESULT_REGISTRY.records.find(record => record.sourceRef.blockId === id)?.equation?.displayNumber
      const stage = m.sourceMap.find(row => row.unitBlockId === id)!.authorAttributes.stageId
      return number == null ? id : `${stage}-relation-${number}`
    }
    return new Map([...formulaRecipes].map(([id]) => [id, [...formulaRecipes].filter(([other]) => key(other) === key(id)).map(([, recipe]) => recipe)]))
  }, [formulaRecipes, m.sourceMap, m.viewContracts.RESULT_REGISTRY.records])
  const canonicalBlocks = m.canonicalBlockIds.map(id => source.blocks.get(id)!)
  const profile = qf01ReadingLayoutProfile(stage.id, stageInfo.fullLessonBlockRefs.map(id => ({ id, type: source.blocks.get(id)!.type, role: String(m.sourceMap.find(s => s.unitBlockId === id)!.authorAttributes.role) })))
  const renderChoiceValue = (id: string, value: string): ReactNode => {
    const q = m.interactions.find(q => q.id === id)!
    if (q.answerDomain === 'semantic') return value
    const safeMath = value.replaceAll('かつ', '\\text{ かつ }').replace(/だけでよい|だけ/g, phrase => '\\text{ ' + phrase + ' }').replaceAll('より小さい', '\\text{ より小さい }')
    return <TypesetInlineMath latex={safeMath} sourceId={id + '-choice'} unitId={unit.unitId} />
  }
  const slot = (id: string) => {
    if (solved.has(id)) return <span data-testid={'resolved-' + id}>{renderChoiceValue(id, current!.answers[id].value)}</span>
    const q = m.interactions.find(q => q.id === id)!, enabled = currentQ?.id === id && !interactionBlocked
    return <button type="button" style={{ minWidth: 48, minHeight: 48 }} disabled={!enabled} className="reading-inline-blank qf01-whole-answer-slot" data-qf01-current-slot={enabled || undefined} data-testid={'textbook-item-' + id} aria-label={q.layoutKind === 'paragraph' ? '本文の空欄。候補を開く' : '数式の空欄。候補を開く'} aria-expanded={activeId === id} aria-controls={contextId + '-options'} aria-describedby={contextId} onClick={() => setActiveId(id)}>□</button>
  }
  const renderParts = (parts: TextbookReadingPart[], id: string, body: R3BodyPlan, slotId?: string) => parts.map((p, j) => {
    if (p.type === 'text') return <R3BodyText key={j} source={source} origin={body.origins[j]} visibleText={p.text} sourceId={id} unitId={unit.unitId} />
    if (p.type === 'term') return <span key={j}>{p.text}</span>
    if (p.type === 'math') return <TypesetInlineMath key={j} latex={p.latex} sourceId={p.semanticId ?? id + '-p' + j} unitId={unit.unitId} />
    const q = m.interactions.find(q => q.id === p.itemId)!
    if (q.answerDomain === 'math') { const a = m.ownerASTBindings.find(a => a.interactionId === q.id)!; return <TypesetFormula key={j} source={formatQF01R3Owner(a.ownerAST, { targetPath: a.targetPath, mask: true, notation: a.notation })} sourceId={id + '-math-target'} unitId={unit.unitId} parts={[slot(p.itemId)]} itemIds={{ 0: p.itemId }} /> }
    return <span key={j} data-bound-slot={slotId}>{slot(p.itemId)}</span>
  })
  const renderBlock = (id: string, viewPrefix = '', recorded = false): ReactNode => {
    const projected = projectQF01R3Block(source, id, solved, { helpFor: helpId, recorded })
    if (!projected) return null
    // Shared source-view API receives explicit target IDs, not an empty list inferred from absent choices.
    const original = recorded ? recordedReadingSourceView(id, canonicalBlocks, {
      itemIds: b => m.interactions.filter(q => q.source.blockId === b.id).map(q => q.id),
      item: id => source.items.get(id), answer: id => current?.answers[id], resolved: item => solved.has(item.id),
    }, viewPrefix) : canonicalReadingSourceView(id, canonicalBlocks)
    if (!original) return null
    const b = projected.source, q = m.interactions.find(q => q.source.blockId === id), key = viewPrefix + id
    const attrs = readingLayoutBlockAttributes(profile, id)
    let content: ReactNode
    if (b.type === 'formula') {
      const recipe = formulaRecipes.get(id)!
      content = <div className="transformation-equation">{recipe.template.includes('\\begin{array}')
        ? <TypesetFormula source={recipe.template} sourceId={key} unitId={unit.unitId} />
        : <R3FixedFormula recipe={recipe} group={recipeGroups.get(id)!} sourceId={key} resolved={!recipe.interactionId || solved.has(recipe.interactionId)} target={projected.slotItemId ? slot(projected.slotItemId) : null} />}</div>
    }
    else if (b.type === 'paragraph') {
      const body = bodyProjection.plans.get(id)
      if (bodyBlocked || !body) return null
      content = <p className="reading-paragraph">{renderParts(body.parts, key, body, projected.slotItemId)}</p>
    }
    else if (b.type === 'figure') { const figure = section.figures.find(f => f.id === b.figureId)!; content = <TextbookFigure figure={figure} items={section.items} progress={current} onOpen={() => undefined} /> }
    else if (b.type === 'marker') content = <p className={'reading-role-marker reading-role-marker--' + b.kind} data-reading-role={projected.sourceRole}>{b.text}</p>
    else if (b.type === 'heading') content = <h3>{b.text}</h3>
    else content = null
    if (b.type === 'formula') {
      const alias = m.viewContracts.RESULT_REGISTRY.records.find(record => record.sourceRef.blockId === id)?.equation?.displayNumber
      if (alias !== undefined && alias !== null) {
        const sourceStage = m.sourceMap.find(entry => entry.unitBlockId === id)!.authorAttributes.stageId
        const sameRelation = m.canonicalBlockIds.filter(blockId => m.sourceMap.find(entry => entry.unitBlockId === blockId)!.authorAttributes.stageId === sourceStage && m.viewContracts.RESULT_REGISTRY.records.some(record => record.sourceRef.blockId === blockId && record.equation?.displayNumber === alias) && projectQF01R3Block(source, blockId, solved, { helpFor: helpId, recorded }))
        if (sameRelation.at(-1) === id || recorded && !viewPrefix.startsWith('history-full-')) content = <R3NumberedEquation number={alias}>{content}</R3NumberedEquation>
      }
    }
    const relationNumber = b.type === 'formula' ? m.viewContracts.RESULT_REGISTRY.records.find(record => record.sourceRef.blockId === id)?.equation?.displayNumber : undefined
    const alignmentGroup = !viewPrefix && relationNumber != null ? `${stage.id}-relation-${relationNumber}` : undefined
    return <div {...attrs} key={key} data-qf01-alignment-group={alignmentGroup} data-testid={!recorded && q && solved.has(q.id) ? 'resolved-' + q.id : undefined} data-source-block={id} data-source-view={viewPrefix || 'canonical'} data-source-node={q?.nodeId ?? id}>{!recorded && !viewPrefix && q && q.id === currentQ?.id ? nearbyInfo() : null}{content}{!recorded && q && q.id === currentQ?.id ? panel(q.id) : null}</div>
  }
  const recordView = (recordId: string, prefix: string) => {
    const record = m.viewContracts.RESULT_REGISTRY.records.find(r => r.id === recordId)
    if (!record || !record.availableWhen.allSolved.every(id => solved.has(id))) return null
    return renderBlock(record.sourceRef.blockId, prefix, true)
  }
  const refsView = (ids: string[], prefix: string) => <>{ids.map(id => recordView(id, prefix))}</>
  const nearbyInfo = () => {
    if (interactionBlocked) return null
    const ids = nearbyRequest.candidates.filter(row => ['OUT_OF_VIEW', 'NOT_MOUNTED_BY_DESIGN'].includes(nearbySources[row.blockId]?.status)).map(row => row.recordId)
    if (!ids.length) return null
    return <aside className="qf01-local-context qf01-nearby-references" aria-label="今の判断に必要な情報">{refsView(ids, 'nearby-')}</aside>
  }
  const panel = (id: string) => {
    if (solved.has(id) || id !== currentQ?.id) return null
    const item = source.items.get(id)!, record = current?.answers[id], wrong = Boolean(record && !solved.has(id)), expanded = activeId === id
    const wrongIndex = record ? item.choices?.findIndex(value => normalizeTextbookAnswer(value) === normalizeTextbookAnswer(record.value)) ?? -1 : -1
    return <div className="reading-inline-choice-panel qf01-attached-options" data-testid={'inline-choice-panel-' + id}>
      {wrong && <aside className="reading-choice-hint" data-testid={'textbook-hint-' + id}><strong>この候補は採用しません：</strong>{renderChoiceValue(id, record!.value)}<p><R3FeedbackMath text={wrongIndex >= 0 ? currentQ!.wrongReasonByChoiceIndex[wrongIndex] : '保存した解答を確認してください。'} sourceId={id + '-wrong-reason'} unitId={unit.unitId} /></p>{record!.attemptCount > 1 && <p><R3FeedbackMath text={item.hints[1]} sourceId={id + '-second-hint'} unitId={unit.unitId} /></p>}</aside>}
      <button type="button" disabled={interactionBlocked} style={{ minHeight: 48 }} aria-expanded={helpId === id} onClick={() => setHelpId(helpId === id ? null : id)}>手掛かり{helpId === id ? 'を閉じる' : 'を見る'}</button>
      {helpId === id && <p className="reading-choice-hint"><R3FeedbackMath text={item.hints[0]} sourceId={id + '-hint'} unitId={unit.unitId} /></p>}
      {expanded && <div id={contextId + '-options'} className="reading-choice-options guided-choice-options" role="group" aria-label="この空欄の候補" aria-describedby={contextId}>{getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).map((choice, index) => <button type="button" disabled={interactionBlocked} style={{ minHeight: 48, minWidth: 48 }} className="reading-choice-option" key={choice} aria-label={'候補' + (index + 1) + '、' + choice} aria-invalid={Boolean(wrong && record!.value === choice) || undefined} data-testid={'textbook-choice-' + id + '-' + index} onPointerDown={event => { pointerFocusTarget.current = event.currentTarget; cancelFocusReveal() }} onFocus={event => revealFocusedChoice(event.currentTarget)} onClick={() => {
        if (interactionBlocked) return
        cancelFocusReveal(); pointerFocusTarget.current = null
        if (onReviewAnswer) onReviewAnswer(item, choice); else answer(unit, id, choice)
        if (normalizeTextbookAnswer(choice) === normalizeTextbookAnswer(item.answer)) { setActiveId(null); setHelpId(null) }
      }}><span className="qf01-option-content">{renderChoiceValue(id, choice)}</span></button>)}</div>}
    </div>
  }
  const headerId = stageInfo.headerSourceRef
  const preludeSet = new Set(preludeIds)
  const bodyIds = stageInfo.fullLessonBlockRefs.filter(id => !preludeSet.has(id) && id !== stageInfo.terminalSourceRef)
  const topIds = (selectedRefs?.topReferenceRecordIds ?? []).filter(rid => !preludeSet.has(m.viewContracts.RESULT_REGISTRY.records.find(r => r.id === rid)?.sourceRef.blockId ?? ''))
  if (progressState.error) return <p role="alert">学習記録の対応を確認できません。回答操作はできません。</p>
  return <article ref={flow} className="textbook-reading-flow guided-reading qf01-full-reading" data-qf01-revision="3" data-testid="textbook-reading-flow" data-typeset-theme="true" data-qf01-nearby-visibility={JSON.stringify(nearbySources)} tabIndex={-1}>
    {nearbyBlocked && <p role="alert" data-testid="qf01-r3-nearby-error">参照元の表示を確認できません。回答操作を停止しています。</p>}
    {bodyBlocked && <p role="alert" data-testid="qf01-r3-prose-error">本文の数学との対応を確認できません。回答操作を停止しています。</p>}
    <div className="math-textbook-reading-controls"><span>今の段階 {stageIndex + 1} / 9</span><span>解答の記録：{solved.size}/35</span>{stageIndex > 0 && <button type="button" onClick={() => setHistory(!history)}>前の段階を見る</button>}</div>
    {stageIndex === 0 && renderBlock(m.viewContracts.FRAME_CONTRACT.単元block配置['unit-purpose'].sourceRef, 'introduction-')}
    {history && <div className="guided-history"><button type="button" onClick={() => setFullHistory(!fullHistory)}>{fullHistory ? '全文を閉じる' : '全文を開く'}</button>{stages.slice(0, stageIndex).map(s => <section key={s.stageId} data-testid={'recorded-results-' + s.stageId}>{renderBlock(s.headerSourceRef, 'history-header-', true)}{fullHistory ? s.fullLessonBlockRefs.filter(id => id !== s.headerSourceRef).map(id => renderBlock(id, 'history-full-', true)) : refsView(s.conclusionRecordIds, 'history-result-')}</section>)}</div>}
    <section inert={interactionBlocked} className="math-textbook-stage math-textbook-stage--current" data-testid={'math-textbook-stage-' + stage.id} data-reading-layout-scope="qf01-r3-shared-reading-v1" data-reading-layout-profile={profile.id}>
      <ReadingStageFrame contextHeader={frame.headerBlockRef !== headerId ? renderBlock(frame.headerBlockRef, 'frame-', true) : undefined}
        header={<div id={contextId + '-header'}>{renderBlock(headerId)}</div>}
        prelude={<div>{preludeIds.filter(id => id !== headerId).map(id => renderBlock(id))}</div>}
        references={<aside id={contextId} className="math-textbook-stage-reference-content" aria-label="現在必要な情報">{topIds.length > 0 && <strong>使う条件・前の結果</strong>}{refsView(topIds, 'top-')}</aside>}
        conclusion={complete ? <div className="qf01-recorded-conclusion">{renderBlock(stageInfo.terminalSourceRef)}</div> : undefined}
        navigation={<div className="guided-stage-navigation">{stageIndex > 0 && <button type="button" disabled={interactionBlocked} onClick={() => { setCursor(stageIndex - 1); setActiveId(null); setHelpId(null); setHistory(false) }}>前の段階へ</button>}{complete && stageIndex < 8 && <button type="button" disabled={interactionBlocked} onClick={() => { setCursor(stageIndex + 1); setActiveId(null); setHelpId(null); setHistory(false) }}>次の段階へ</button>}</div>}>
        <div data-reading-layout-body><div className="reading-derivation-chain qf01-continuous-derivation" {...readingLayoutChainAttributes(profile, bodyIds[0] ?? headerId)}>{bodyIds.map(id => renderBlock(id))}</div></div>
      </ReadingStageFrame>
    </section>
    {stageIndex === 8 && solved.size === 35 && <section className="qf01-unit-summary" data-testid="qf01-unit-summary">{m.viewContracts.FRAME_CONTRACT.単元block配置['unit-summary'].sourceRefs.map(id => renderBlock(id, 'summary-', true))}</section>}
  </article>
}
