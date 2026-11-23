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
    validateQF01R3Reading(props.unit, props.readingPresentation).then(async value => { validateQF01R3BodySource(value); await validateQF01R3MixedSource(value); if (active) setSource(value) }).catch(() => { if (active) setError(true) })
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
function qf01R3AtomicBodyMath(latex: string) {
  // A TeX group creates one unbreakable KaTeX base while retaining its inner
  // operators/spacing. \relax is invisible and prevents the shared normalizer
  // from interpreting a simple {x} or {+1} as a finite-set literal.
  return '{\\relax ' + latex + '}'
}
export function R3BodyText({ source, origin, visibleText, sourceId, unitId }: { source: QF01R3Validated; origin: R3BodyOrigin; visibleText: string; sourceId: string; unitId: string }) {
  return <span>{qf01R3BodySlice(source, origin, visibleText).map((token, index) => {
    if (token.type === 'text') return token.text
    const id = sourceId + '-body-p' + origin.partIndex + '-' + token.start + '-' + token.end
    return <span key={index} data-qf01-prose-math="true" data-qf01-prose-block={origin.blockId} data-qf01-prose-part={origin.partIndex} data-qf01-prose-start={token.start} data-qf01-prose-end={token.end} data-qf01-prose-kind={token.unit ? 'quantity' : 'math'} data-qf01-prose-unit={token.unit ?? undefined} data-qf01-prose-source-id={id}><TypesetInlineMath latex={qf01R3AtomicBodyMath(token.latex)} sourceId={id} unitId={unitId} /></span>
  })}</span>
}
R3BodyText.validateSource = validateQF01R3BodySource
R3BodyText.slice = qf01R3BodySlice
R3BodyText.origins = qf01R3BodyOrigins
R3BodyText.atomicLatex = qf01R3AtomicBodyMath

type R3MixedField = 'marker' | 'choice' | 'hint' | 'wrong-reason'
export type R3MixedOrigin = { field: R3MixedField; owner: string; index: number; start: number; end: number }
type R3MixedRecipe = readonly [field: R3MixedField, owner: string, index: number, text: string, rawSHA256: string, spans: readonly R3BodySpan[]]
// D05 V2: 187 source strings / 191 reviewed math spans. These are identity
// guards, not a replacement source of visible text or a correctness map.
const R3_MIXED_SOURCE_STRINGS: readonly R3MixedRecipe[] = [
  ["marker","qf01-r3-c0-s01-m01",0,"関数の見方","0fc8906c718f4f2b90867b36edde6faeebc152b06bfc5d9bbbd98d571b89bd2e",[]],
  ["marker","qf01-r3-c1-s01-m01",0,"問１｜最初の規則","439ff4fe950aed7e596746720e0617064029d0a2d8e25d9ef57f7d6f3e0324ff",[]],
  ["marker","qf01-r3-c1-s01-m02",0,"入力2の出力を求め、関数と関数値の表し方を学んだ。","7f97e540b63164b077ee7b1b42a318c22951e211c5a2753821534c61bb91853b",[[2,3,"2","2",null]]],
  ["marker","qf01-r3-c1-s02-m01",0,"同じ規則に負の数を入れる","50b802adc52c7617832107ec2951b6b671c7b0718c89214f836141bb945dcf27",[]],
  ["marker","qf01-r3-c1-s02-m02",0,"入力−1に対応する関数値は−10。","4bca95092af6d446a266f4474bb025e4cbd0c2b217f92e6276ec1c86cbda1afc",[[2,4,"−1","-1",null],[13,16,"−10","-10",null]]],
  ["marker","qf01-r3-c1-s03-m01",0,"同じ規則に式全体を入れる","44def81d9e9c56a2c9761462d3192ea444cd63e444fae979c3f3b85a3c6e8e4c",[]],
  ["marker","qf01-r3-c1-s03-m02",0,"最初の規則の問を終える。","23f5e50231e9dcb8f6aab984c2120e469c4e8c0ce133726c8ae3a9dd278ae059",[]],
  ["marker","qf01-r3-c2-s04-m01",0,"問１｜二つ目の規則","d81956e6ed8d7c3bafb3b28495410bd8f08649f8c71a990d5dbd35a1a06c5630",[]],
  ["marker","qf01-r3-c2-s04-m02",0,"二乗してから1を引く規則では、入力−1の出力は0。","a70541a73143c69799e8b2056d754f19b48604f7efae3080b0b41ab86cbff257",[[6,7,"1","1",null],[17,19,"−1","-1",null],[23,24,"0","0",null]]],
  ["marker","qf01-r3-c2-s05-m01",0,"入力2で同じ規則を使う","bf82387989d57db3cd674c9f694286eb03d2fa0a50ea249e0796c3903390f835",[[2,3,"2","2",null]]],
  ["marker","qf01-r3-c2-s05-m02",0,"入力2の平方4を使い、関数値3を得た。","c98f9e59596375bb006988db87062bf52975611446b089b60a32e39d0897ab93",[[2,3,"2","2",null],[6,7,"4","4",null],[14,15,"3","3",null]]],
  ["marker","qf01-r3-c2-s06-m01",0,"式全体の二乗を整えて元の関数へ戻す","b391788de22a9ee34e5103beb8db780bb9c931c987b94fd6b6269cfe65f280f6",[]],
  ["marker","qf01-r3-c2-s06-m02",0,"平方部分の計算","d7b577d349a5372ceb2177e40caf8bef239a7928f3aea2e1759a664fd1ec89b2",[]],
  ["marker","qf01-r3-c2-s06-m03",0,"平方部分の結果を親の式へ返す。","a25106437883ee082d9b0c58511e49b32478a3b8f7bf87422982fd5be641da1f",[]],
  ["marker","qf01-r3-c2-s06-m04",0,"二つ目の規則の問を終える。","66a6e1e9367012c4a26bd0e4f62fa1a5185b53e3e659abe1aa831d30ba07575a",[]],
  ["marker","qf01-r3-c3-s07-m01",0,"問２｜長方形から関数を作る","bdbb6913d5abc1c51281ce2a515f9978edbde1abfa1234b9aaef9bdffc571e8c",[]],
  ["marker","qf01-r3-c3-s07-m02",0,"周40の条件から、横を縦で表す関係y=20−xを得た。","e60b4fdff2735f1f80124abec83e89966ea042f028f5724200fe51a38c62d6bb",[[1,3,"40","40",null],[17,23,"y=20−x","y=20-x",null]]],
  ["marker","qf01-r3-c3-s08-m01",0,"長方形を作れる入力を調べる","72962f748b832178e54e6f177a23b56631ac1d6a4751b072f46c03b1eb155268",[]],
  ["marker","qf01-r3-c3-s08-m02",0,"入力xの定義域は0<x<20。両端は含めない。","6c646f712981317a9eecc7de577249f839b3c988f642b12331d66afa8de4b6be",[[2,3,"x","x",null],[8,14,"0<x<20","0<x<20",null]]],
  ["marker","qf01-r3-c3-s09-m01",0,"出てくる横の長さの範囲を調べる","4d72d143434c2eca63500967a3f396a1887ab50f10dca7ea361865803700b2b8",[]],
  ["marker","qf01-r3-c3-s09-m02",0,"長方形の問を終える。","e827025924c0c46101ef70395898eae95748d4790925a6423d9d79b7a382f89a",[]],
  ["marker","qf01-r3-c0-s09-m01",0,"関数の見方を振り返る","8a0f3d4e4ac0248f0a9bf64afb6f4c20ce8e7ca21e9f10546eff1394192a652e",[]],
  ["marker","qf01-r3-c0-s09-m02",0,"この単元の本文を終える。","9143143a1fd16ac40d4415a6c4d4764a5811a81161973ad80a11080e945c08bf",[]],
  ["choice","qf01-r3-n04-value-meaning-answer",0,"入力−1に対応する出力","d2472a3c6ccc235b45b3e22933a138844438c45e44867a701140df5e2ed9aba8",[[2,4,"−1","-1",null]]],
  ["choice","qf01-r3-n04-value-meaning-answer",1,"関数の名前fと−1を掛けた値","d83a30a822196b842ab5e51e724c785ed34199839a439405c29e05c17ef509b4",[[5,6,"f","f",null],[7,9,"−1","-1",null]]],
  ["choice","qf01-r3-n04-value-meaning-answer",2,"どの入力でも必ず出てくる同じ数","8e944a8be4788303bb37f27f9719796b8e55c5d2378c3f76e53a61f5f1736a15",[]],
  ["choice","qf01-r3-n05-parenthesis-reason-answer",0,"入力全体に4を掛けることを表すため","7ec3aa97cfb2fc2f5e72d8c4826f34bdf200fae6af9c9893275074bc265a2b48",[[5,6,"4","4",null]]],
  ["choice","qf01-r3-n05-parenthesis-reason-answer",1,"最後の−6にも4を掛けるため","c3ae5b8e09d53a2d3f57a86494e6c6191c038cc5ebd885f6fe9b12fc8ccd8ad8",[[3,5,"−6","-6",null],[7,8,"4","4",null]]],
  ["choice","qf01-r3-n05-parenthesis-reason-answer",2,"式の意味を変えずにaだけを4倍するため","646aebb4d4f4c438a1e613be8833fe0adf3b5d73b912bdd11d051685adeb6ad6",[[9,10,"a","a",null],[13,14,"4","4",null]]],
  ["choice","qf01-r3-n10-operation-order-answer",0,"2を二乗する","258f74c42967f6dca7af08a440f44091f0bca24cc1e6eb2ef831a902d61d0ba0",[[0,1,"2","2",null]]],
  ["choice","qf01-r3-n10-operation-order-answer",1,"2から1を引く","3b62b39fc389d0f7dc437f2869c8ace487f2224888d78f128664b7a91cec8a9e",[[0,1,"2","2",null],[3,4,"1","1",null]]],
  ["choice","qf01-r3-n10-operation-order-answer",2,"2−1全体を二乗する","23d0fab75c545acff09003c919925673174916b469712cd3b8b90429eff56800",[[0,3,"2−1","2-1",null]]],
  ["choice","qf01-r3-n12c-constant-product-answer",0,"括弧の外の−1と、括弧の中の−1との積","b71d561e17471ecdaa11cb0467ef5c92d5bbe558ead118eaeb6907ae546cc713",[[5,7,"−1","-1",null],[14,16,"−1","-1",null]]],
  ["choice","qf01-r3-n12c-constant-product-answer",1,"括弧の外の−1と、括弧の中のaとの積","30362be78a03c96362d3d54b9c5f0db9395bf75b8f9ea5e2abf30290e7710bda",[[5,7,"−1","-1",null],[14,15,"a","a",null]]],
  ["choice","qf01-r3-n12c-constant-product-answer",2,"aとaとの積","753c3e0752b188752ecf0f09134ac30195d6205779d8cde654906f76b10d6b0f",[[0,1,"a","a",null],[2,3,"a","a",null]]],
  ["choice","qf01-r3-n14-boundary-answer",0,"四辺すべての長さ","2c94c6c80631440d79dc3ff17279dd4aae510db2555020122f43754c88029f85",[]],
  ["choice","qf01-r3-n14-boundary-answer",1,"縦と横の二辺だけの長さ","f7d427306543d62eb55529585a57af1659853588b1f4350aa4deba566530c74b",[]],
  ["choice","qf01-r3-n14-boundary-answer",2,"縦と横の長さの積","b1988ce2b428aaa6baf5bdaecd504d1ecbe717962658e5a11d748abeda63500d",[]],
  ["choice","qf01-r3-n15-same-operation-answer",0,"両辺を2で割る","8b0d8037e8b50e6ae1ef5f9b8c5380dbb3f28d0be3f8875eeec172b8bfe57732",[[3,4,"2","2",null]]],
  ["choice","qf01-r3-n15-same-operation-answer",1,"左辺だけを2で割る","d2d967ad8a5590fbca3543e48f95b2f9b09109fc74ec82ea8a785b002db36397",[[5,6,"2","2",null]]],
  ["choice","qf01-r3-n15-same-operation-answer",2,"両辺から2を引く","8d4fa40eccb8a7eb29b5206dcc8c2b1f2d40a12e046334eede2a3f3ec45aa316",[[4,5,"2","2",null]]],
  ["choice","qf01-r3-n19-endpoints-answer",0,"含めない","adaf02a7e4c8efbadb09366fb24517f7129ac2750461afa350e4571cc4824272",[]],
  ["choice","qf01-r3-n19-endpoints-answer",1,"含める","5e39d3630157d32e35b2a81bf08b7d2ba90def141a9b72c3b662f89fca7d5fa9",[]],
  ["choice","qf01-r3-n19-endpoints-answer",2,"0だけ含める","b021d62c6873942077c668ee0c2f3b956943c2b3b6dbfe61826893e150168f06",[[0,1,"0","0",null]]],
  ["choice","qf01-n21-answer",0,"20より小さい","f35ed559fdccba2ae48829c7206a6882dcdcde74ff7d4f4239e5f85fcf285ac1",[[0,2,"20","20",null]]],
  ["choice","qf01-n21-answer",1,"20に等しい","6268b2936a6c563f4dfc8306d78f92933ef63765b7bbc85edf19ce47eb86f864",[[0,2,"20","20",null]]],
  ["choice","qf01-n21-answer",2,"20より大きい","992f0fbc34305768409cfbf6ad3cc529d6769201603182a1622ef72105c0103e",[[0,2,"20","20",null]]],
  ["hint","qf01-n01-answer",0,"「4倍」は、入力と4との積を作る操作です。","b5c1b96f9a8f0a428963caef062a5fccf3d2e2c5523d5d77c6508c135a036543",[[1,2,"4","4",null],[9,10,"4","4",null]]],
  ["hint","qf01-n01-answer",1,"4倍する相手がどの数か、問題文の入力へ戻って確かめます。","0961685a0a7f2d379b6408bf9f518c1afd526ff4242362bfc2af436a6a059b0c",[[0,1,"4","4",null]]],
  ["wrong-reason","qf01-n01-answer",1,"「4倍」は同じ数を4個分取る操作です。","538d25c76a542852605f667940ffbd97d5aadc3bf6f6e4909e7871687fd68aa9",[[1,2,"4","4",null],[9,10,"4","4",null]]],
  ["wrong-reason","qf01-n01-answer",2,"引く数と掛ける数を区別しましょう。","17d85e465266694acfeb5cbae6af29773fe4df6ac2c95f6a5934887ab865bd1c",[]],
  ["hint","qf01-n02-answer",0,"8を起点に、6だけ小さい数を考えます。","a3b004eb4e5a2bb65e74059ed9047ab244afe816fd43a2af3c00c16a7bbeda87",[[0,1,"8","8",null],[6,7,"6","6",null]]],
  ["hint","qf01-n02-answer",1,"数直線で8から小さい方へ6進んだ位置を確かめます。","4aada849ffa71a8d9cba0f91cbd80f3bdfa3a790f780cd21e2334f3e6dc73ebb",[[4,5,"8","8",null],[12,13,"6","6",null]]],
  ["wrong-reason","qf01-n02-answer",1,"規則の最後は足し算ではありません。","5eebab132a2f3df41e3463a80cb24bd55b9eb0e9527ea08b21a57253f72a317d",[]],
  ["wrong-reason","qf01-n02-answer",2,"8と6の順を確認しましょう。","f926675884cdfa9860f6e57a1b3d0d4e5c3b26f5b5b42933c7a8e64ffb4cc816",[[0,1,"8","8",null],[2,3,"6","6",null]]],
  ["hint","qf01-n03-answer",0,"元のxの前後にある掛け算と引き算を残します。","bc90b79cfda577a811c2aa00452a17d3e231698bd10d498ef22acfcd5e7782ce",[[2,3,"x","x",null]]],
  ["hint","qf01-n03-answer",1,"負の入力に括弧を付け、規則の最後の−6まで入力へ入れないようにします。","50024b40f713541afdd5287718f461a0713713a59e54e18a38f5c23bfc9cb90a",[[17,19,"−6","-6",null]]],
  ["wrong-reason","qf01-n03-answer",1,"xの前の4とは掛け算になっています。","c7e37a9d16e942b23cb559dc0cb8c008ba6542b1cfa8c5fc69377b6f839399f6",[[0,1,"x","x",null],[4,5,"4","4",null]]],
  ["wrong-reason","qf01-n03-answer",2,"6まで括弧の中に入れると元の規則が変わります。","b8561bda3c904fcf4ca519508ce5e1042a7837e508ce6b91da82a13b4107c696",[[0,1,"6","6",null]]],
  ["hint","qf01-n04-answer",0,"−4から、さらに6小さい数へ進みます。","1c23699df9733b27d95c1b4eb8ced1bfc0dbb0051abf099d1bad386b050b4b87",[[0,2,"−4","-4",null],[8,9,"6","6",null]]],
  ["hint","qf01-n04-answer",1,"数直線の−4を起点に、小さい方へ6進んで確かめます。","de03799c885c7a60665cc40eda70544d75fef3a6524d58a2481a96dd8935cd04",[[4,6,"−4","-4",null],[16,17,"6","6",null]]],
  ["wrong-reason","qf01-n04-answer",1,"-4からさらに6だけ小さくなります。","d771d9ad704e1ee57f60405587b1d3b8564f4e072c1b9f10495781004c4a3754",[[0,2,"-4","-4",null],[7,8,"6","6",null]]],
  ["wrong-reason","qf01-n04-answer",2,"符号も値の一部です。","fe2fbc6aff772a6f28be8f82c26580be0dff01934aad92343dd04b805d231e2b",[]],
  ["hint","qf01-r3-n04-value-meaning-answer",0,"等式の括弧の内側と、右辺の数の役割を分けます。","b12f3efd627617f0ee1d800f7f992cbf9788d9d007249078e61999ab55d2b4d2",[]],
  ["hint","qf01-r3-n04-value-meaning-answer",1,"前に学んだf(入力)=対応する値という読み方へ戻ります。","b956e8503daf7f0cb588241191ccd86d095f581af24bf7b8db83a54cda11f97f",[[5,16,"f(入力)=対応する値","f(\\text{入力})=\\text{対応する値}",null]]],
  ["wrong-reason","qf01-r3-n04-value-meaning-answer",1,"fはここでは規則の名前です。掛け算の記号の省略としては読みません。","2d2826a732848234520b2a32fc3265807c2b85affc93deb5563981e0304d1725",[[0,1,"f","f",null]]],
  ["wrong-reason","qf01-r3-n04-value-meaning-answer",2,"この等式で調べた入力は−1です。別の入力の値まで同じだとは言っていません。","2b9b21adb1374d43d808aedcc7d9dd3305cfedb1c31ceac8f971f7a713cdbf7d",[[11,13,"−1","-1",null]]],
  ["hint","qf01-n05-answer",0,"元の4x−6のxの位置だけを置き換えます。","dbbe94f837e145f712e5bd897aab8ff0defb93ce5d02233e3fac5f72dfd36717",[[2,6,"4x−6","4x-6",null],[7,8,"x","x",null]]],
  ["hint","qf01-n05-answer",1,"入力はaだけではなくa−1という一つの式です。規則の最後の−6はその外に残します。","d19ba2fdd56e9fb0f594915c440c4849aebcb1ddbe6bcd478fdf9b1ecdffb9c8",[[3,4,"a","a",null],[10,13,"a−1","a-1",null],[29,31,"−6","-6",null]]],
  ["wrong-reason","qf01-n05-answer",1,"入力はaだけでなくa-1全体です。","7cb9011c4f00fbde3d14b079247f992988fac5a2e4daaefa5f6d0fe5ef1dad39",[[3,4,"a","a",null],[9,12,"a-1","a-1",null]]],
  ["wrong-reason","qf01-n05-answer",2,"最後に引く6は入力の外です。","e92a5bc9c5d156f0e0e27fb367020f7e26b6803eb373317f2daa6c067dfea7fa",[[5,6,"6","6",null]]],
  ["hint","qf01-r3-n05-parenthesis-reason-answer",0,"元の規則4x−6で、4が掛かっていた対象を確認します。","af94686ba88d793bc0033f140a6f35bb3a4333d03790611d622c37f6da3eb6b6",[[4,8,"4x−6","4x-6",null],[10,11,"4","4",null]]],
  ["hint","qf01-r3-n05-parenthesis-reason-answer",1,"今回xの位置へ入れた一まとまりがどこからどこまでか、問題の入力へ戻ります。","08e90f46912c22be2c1233a96f36d350f5869ba5714835dd8eb6fb48613bd534",[[2,3,"x","x",null]]],
  ["wrong-reason","qf01-r3-n05-parenthesis-reason-answer",1,"−6は元の規則の最後の引き算であり、入力の中には入りません。","9630ef326c9a651a596eaf33ca75e77d0e6c9959097c2362982f0a6243bff8de",[[0,2,"−6","-6",null]]],
  ["wrong-reason","qf01-r3-n05-parenthesis-reason-answer",2,"aだけを4倍すると、入力の残りの部分に4が掛からなくなります。","971199b6a28ca9cecfa329e901c514e79b7c4265f6e50f961d209e5cd6b379a0",[[0,1,"a","a",null],[4,5,"4","4",null],[19,20,"4","4",null]]],
  ["hint","qf01-n06-answer",0,"括弧の中の各項に4を掛けます。","b22024f0232df9f80df9f615a4a8bed63440f66e7a2fbd769c22480bd180b3d2",[[8,9,"4","4",null]]],
  ["hint","qf01-n06-answer",1,"4×aと4×(−1)を別々に考えてから並べます。","00bd2afe149ec27809a9c23d000cae89e87a73e092edf41ba393b774e04ec10c",[[0,3,"4×a","4\\times a",null],[4,10,"4×(−1)","4\\times (-1)",null]]],
  ["wrong-reason","qf01-n06-answer",1,"4は括弧の中の両方の項に掛かります。","5449722f9cf2b3986c6715d873e6d6d6107240fcefa6010b4739782cfc57204a",[[0,1,"4","4",null]]],
  ["wrong-reason","qf01-n06-answer",2,"4\\times (-1)の符号を確かめましょう。","84d12cd067255f83d650e0f74ac58f4ccd18027cc27e86bd290187a09f93646e",[[0,12,"4\\times (-1)","4\\times (-1)",null]]],
  ["hint","qf01-n07-answer",0,"4aを変えず、残った二つの定数の和を計算します。","622a10fa7d7f83ed4470eae99422af95777f6b40f3f036536d13c8952fca14a3",[[0,2,"4a","4a",null]]],
  ["hint","qf01-n07-answer",1,"−4からさらに6小さくする操作です。","1116fa8fb1e6e004750bf2618cd32ae4d871db2b2ee904e497903c74bfe294cd",[[0,2,"−4","-4",null],[7,8,"6","6",null]]],
  ["wrong-reason","qf01-n07-answer",1,"-4と-6はどちらも負の項です。","e7064c84c605256f3b68c33263054948bc1cb524ce8a74fe1c4884d9be0dca99",[[0,2,"-4","-4",null],[3,5,"-6","-6",null]]],
  ["wrong-reason","qf01-n07-answer",2,"-4-6を先に数直線で確かめてもよいです。","12b012a45d9d7001fbf9f0c1408e20749d846e2aa38173183db1ddf42debc57f",[[0,4,"-4-6","-4-6",null]]],
  ["hint","qf01-n08-answer",0,"x²のxが二つあると考え、それぞれに入力を入れます。","5cf5576bcc31d9d1156adf76a231e8bde54d5183380b9f19029d8e4c3c7eb447",[[0,2,"x²","x^2",null],[3,4,"x","x",null]]],
  ["hint","qf01-n08-answer",1,"二乗する入力の負号と、二乗の外にある引き算を分けます。","92024f2c1241451f138bc0a2fe122e26cf6a965c86ad37283f0969b643020d4b",[]],
  ["wrong-reason","qf01-n08-answer",1,"代入した負の数全体を二乗するので括弧が必要です。","804218ea22b656de22ab5f411219b99e2f7746e6065224172342f70b45923f5e",[]],
  ["wrong-reason","qf01-n08-answer",2,"元の規則では1を引くのは二乗の後です。","b24dae8bdb2539d8c98b062705bd2b72ee6cdaa22fb28412ccb7fd2b0b88058b",[[6,7,"1","1",null]]],
  ["hint","qf01-n09-answer",0,"平方の計算が終わった後にも、規則の−1が残っています。","953f0b4d19df3f4a3a4d141c57ba1f1774a8c6a8a2cf1d8c979141c8425de646",[[17,19,"−1","-1",null]]],
  ["hint","qf01-n09-answer",1,"得た1から1を引きます。","c1c5dc1cd7fce14af225a08ad1eaefba8bf0793f6f16b2c9c3ede518c4c3e888",[[2,3,"1","1",null],[5,6,"1","1",null]]],
  ["wrong-reason","qf01-n09-answer",1,"二乗した値は1です。","87474b5a9ce56bae2844289f567e01dd78cb478db4d2a8db8f4fe5524089a954",[[6,7,"1","1",null]]],
  ["wrong-reason","qf01-n09-answer",2,"最後に1を引く操作が残っています。","c4619a04ef49980c9e2f83886659f1b836341c20b86c5dd5e0e608bd3d3a8f3b",[[3,4,"1","1",null]]],
  ["hint","qf01-r3-n10-operation-order-answer",0,"元の式の二乗がどの部分に付いているか見ます。","19e1d82611016dd01af931547cefb33e03f32416356d801c0969e73fd8c56ddb",[]],
  ["hint","qf01-r3-n10-operation-order-answer",1,"先ほど負の数を代入したとき、入力を二つ掛けた後に外側の引き算を行った順序へ戻ります。","4f2baa22946981b61ac91e61822f6e1c5435bf212d9e404514d8b13c8abac719",[]],
  ["wrong-reason","qf01-r3-n10-operation-order-answer",1,"元の規則の平方より先に引き算を行うと、計算の順序が変わります。","828971b156bea907c67f288fe614e871759cc6b2799ab7ed36df3a71630b80c3",[]],
  ["wrong-reason","qf01-r3-n10-operation-order-answer",2,"それは(x−1)²という別の規則に対応します。","069b0ea94625d553904faf79a1b82f69c95cbae7498d961bac0e90e746545fe2",[[3,9,"(x−1)²","(x-1)^2",null]]],
  ["hint","qf01-r3-n10-square-value-answer",0,"同じ入力を二つ掛けます。","96ad827fb5f280f42257df136c8836d79f753807e5b8b32cbfc63c17501c2234",[]],
  ["hint","qf01-r3-n10-square-value-answer",1,"2×2を、2を二つ合わせる積として計算します。","f215b4a640b4cdc235574fbb7e56866338fe5a449e4a1b2c3792150280c64a76",[[0,3,"2×2","2\\times 2",null],[5,6,"2","2",null]]],
  ["wrong-reason","qf01-r3-n10-square-value-answer",1,"入力2は正です。この積へ負号を付ける操作はありません。","7e6210efe0da5303b0d05015b9da4deeed622627a764d1490a4f0b7e15168961",[[2,3,"2","2",null]]],
  ["wrong-reason","qf01-r3-n10-square-value-answer",2,"2−1を先に計算した結果と混同していないか確かめます。","fd15644e46bdb4c2bd77c3cd718c96c71b7d5503c7daba4f4846abbb68fc3c45",[[0,3,"2−1","2-1",null]]],
  ["hint","qf01-n10-answer",0,"直前に自分で求めた平方の値を使います。","af5a5671e2d5d3ccc25888aa726e1b47057433f099b4f81fdfd9d6f368d20b92",[]],
  ["hint","qf01-n10-answer",1,"4を起点として、1だけ小さくします。","73e838eac52b0f64fc89865a49d96dd4efbf7d2ee19364c61aaa93dc1e9ee29b",[[0,1,"4","4",null],[8,9,"1","1",null]]],
  ["wrong-reason","qf01-n10-answer",1,"2^2は2\\times 2で、2\\times 1ではありません。","9b29b9442ce1cade45b51be0e67688462ce9ba18331ca6453db99ba4e4a2c4b4",[[0,3,"2^2","2^2",null],[4,13,"2\\times 2","2\\times 2",null],[15,24,"2\\times 1","2\\times 1",null]]],
  ["wrong-reason","qf01-n10-answer",2,"平方した値から1を引きます。","690ea0e6aebffe1c8f52e314d47952e415fd449eb3bf438008d195a9360908f2",[[7,8,"1","1",null]]],
  ["hint","qf01-n11-answer",0,"x²の対象と、外側の−1を分けます。","6001d9540cef7773e1b2e51dda670f75ce12b086732ef9f4856d89d686a43bca",[[0,2,"x²","x^2",null],[10,12,"−1","-1",null]]],
  ["hint","qf01-n11-answer",1,"二つのxの位置に同じ入力を入れると考えます。","fcc1e08d6ae736980882ccf969cab7fa5b38597d6bcfd7ca3e9a553f8cd4946e",[[3,4,"x","x",null]]],
  ["wrong-reason","qf01-n11-answer",1,"入力した式全体を二乗します。","ce8f781706bdb0f6895cab0d3b2e211f1b1a475b05b91ed6f6afc10c465b6ff8",[]],
  ["wrong-reason","qf01-n11-answer",2,"最後に1を引く操作を残してください。","950fccd337132b4689aca2da56daa7974c5e9c2f618cf65bb7f9ee0bae6ed935",[[3,4,"1","1",null]]],
  ["hint","qf01-n12a-answer",0,"最初の括弧の二つ目の項も、符号ごと取り出します。","ddf1dda4e9aadf4f746afe1118a5aec083c1f8a56c812edfc2417006409cd92d",[]],
  ["hint","qf01-n12a-answer",1,"(A+B)C=AC+BCに対応させ、二つ目の項に当たるものを見ます。","9c685dc88304fcd539cccf32d0b89c83ec8ff57b6df6afa0f6450cf0ff4559d6",[[0,12,"(A+B)C=AC+BC","(A+B)C=AC+BC",null]]],
  ["wrong-reason","qf01-n12a-answer",1,"最初の括弧の第2項は-1です。","4f53bb064177c950dd4fa36d2c4008e89015733a0193f16097442993095030ca",[[10,12,"-1","-1",null]]],
  ["wrong-reason","qf01-n12a-answer",2,"2つ目の括弧はa-1のまま保ちます。","e48bde1800c5967a0de0b683e21cea965ed35f91c6a2e6de8d2ffae6446d8923",[[7,10,"a-1","a-1",null]]],
  ["hint","qf01-n12b-answer",0,"a×aとa×(−1)を別々に計算します。","41f2b128cbc47593bdfeab625d28a59bd1b45eba2892730670225945bd04d548",[[0,3,"a×a","a\\times a",null],[4,10,"a×(−1)","a\\times (-1)",null]]],
  ["hint","qf01-n12b-answer",1,"同じ文字二つの積と、aに負の数を掛けた積の符号を分けます。","0c93f251b906d76ea8358029cc934e9036286a611b265bd24bbc11315f20fa78",[[10,11,"a","a",null]]],
  ["wrong-reason","qf01-n12b-answer",1,"-1にもaを掛けます。","97d0d766a2dfa9ce3679739c213cd568424e7a4cb96efb4d40bc3f653f9fae5e",[[0,2,"-1","-1",null],[4,5,"a","a",null]]],
  ["wrong-reason","qf01-n12b-answer",2,"a\\times (-1)は-aです。","c658735b4fca916f4f0bb79e834fc02460e4482a12864146bfaf3abe961b48a7",[[0,12,"a\\times (-1)","a\\times (-1)",null],[13,15,"-a","-a",null]]],
  ["hint","qf01-n12c-answer",0,"括弧の二つの項に、それぞれ−1を掛けます。","94030d85415f936af96b4e313f21368e4c5e7d66ce270a15fe035e227e4bd9f8",[[13,15,"−1","-1",null]]],
  ["hint","qf01-n12c-answer",1,"文字を含む積と、定数どうしの積を分け、負号の組合せを確かめます。","6e775f15288ad383d7829c6c8a778337b76af11b81761f61fa6b5d73227bb9c5",[]],
  ["wrong-reason","qf01-n12c-answer",1,"-1\\times (-1)の符号を確認しましょう。","ade3e126d980ceeed74e51466762974c98608a47ad24ffbaeb47e6a75a4bc719",[[0,13,"-1\\times (-1)","-1\\times (-1)",null]]],
  ["wrong-reason","qf01-n12c-answer",2,"括弧の両方の項に-1を掛けます。","aa0c95a2c3c3a812aac8f9e7d8e89921ff63a9a005c1e2fcd30dfae3dce06365",[[8,10,"-1","-1",null]]],
  ["hint","qf01-r3-n12c-constant-product-answer",0,"分配の各部分積が、文字の項と定数項のどちらを作るか見ます。","d23262b182a7e388895a8a5a04d97ae4bee4d26f0aa5f9a56dccf824310356ab",[]],
  ["hint","qf01-r3-n12c-constant-product-answer",1,"定数項の出どころを探すので、aを含まない項どうしの組を調べます。","e9b07a1303782a298e89c6003711699a027e70aa6116ba263398f1ccfdff6742",[[14,15,"a","a",null]]],
  ["wrong-reason","qf01-r3-n12c-constant-product-answer",1,"文字aを含む積は、右辺の文字の項へ対応します。定数項と区別します。","14d3b6769d6cf6daa1a47b292a829efb82961cd7757cd8df72a1b1c8c23fad9c",[[2,3,"a","a",null]]],
  ["wrong-reason","qf01-r3-n12c-constant-product-answer",2,"今展開している因数は−1と(a−1)です。aを二つ掛ける積ではありません。","38e0f3f0cd1be518b075e7e7b879e4634a50e277f77631579b991a2352d1e251",[[10,12,"−1","-1",null],[13,18,"(a−1)","(a-1)",null],[21,22,"a","a",null]]],
  ["hint","qf01-n12-answer",0,"−aは係数−1とaの積です。","de3bb41f95a71c16015a0d1dbb25fe5e72c4bf809073df4d0ae86d71977dd70d",[[0,2,"−a","-a",null],[5,7,"−1","-1",null],[8,9,"a","a",null]]],
  ["hint","qf01-n12-answer",1,"係数だけを足し、文字aは一つ残します。","05eb4ea14081bd69913062167d5afa57acfab849abbf1be8ccc857ac9ff9bad4",[[10,11,"a","a",null]]],
  ["wrong-reason","qf01-n12-answer",1,"(a-1)(a-1)を分配し、-aが何個あるか見ます。","6efa8f3360c854a3d973bf015d01503d4cfacc0c8f0c08be9bdcf2c58ee375fe",[[0,10,"(a-1)(a-1)","(a-1)(a-1)",null],[15,17,"-a","-a",null]]],
  ["wrong-reason","qf01-n12-answer",2,"二つの-aからできる項です。","0e3b5e5af6dacc1f19c6224eb5e5236e3c19058286ea33ed0fb14c0a13c468f6",[[3,5,"-a","-a",null]]],
  ["hint","qf01-n13-answer",0,"親の式の、平方の外側に残した操作を確認します。","d5366783f05b9671e578c62aa0316f578a4d1447b475f05eee0db1702aa27378",[]],
  ["hint","qf01-n13-answer",1,"定数+1と外側の−1を合わせ、文字の項は変えません。","24821a1ee44a2d4a40e01124c1648fef9157b31d4885d03991bcbbf2b52958dc",[[2,4,"+1","+1",null],[8,10,"−1","-1",null]]],
  ["wrong-reason","qf01-n13-answer",1,"最後の操作は1を引くことです。","ab796ef7ce2fb405486c01eb9b8640926bda6e9815a89ff6b5698a6b955aa93a",[[6,7,"1","1",null]]],
  ["wrong-reason","qf01-n13-answer",2,"展開した中央の項は残ります。","c510cb5a47e88e910eca2a7331e45ca4f7d8e50c400a61f130cd7b146a33b27e",[]],
  ["hint","qf01-r3-n14-boundary-answer",0,"図の出発点へ戻るまで、指で周りをたどります。","07d085b28e57fc3d3281a19b4a43d7f943ee912edf46f368e94bcacfd2d7a455",[]],
  ["hint","qf01-r3-n14-boundary-answer",1,"左の辺から下、右、上へと進み、まだ通っていない辺があるか確かめます。","07b058d0306e02da1b6a3290420a2ba65dc1753e902eb356ddb17c06a2ccb866",[]],
  ["wrong-reason","qf01-r3-n14-boundary-answer",1,"二辺だけでは、出発点へ一周して戻っていません。残りの辺もたどります。","6e4bf4cc89f1a3513e1d422d2f4b00c203d375c7cd871c31f6696e8e94c4ef00",[]],
  ["wrong-reason","qf01-r3-n14-boundary-answer",2,"積は面積を考えるときの操作です。今は周りをたどった長さを考えます。","507acc768e7252bea21b4674ccf3f06afe279dc8edb55d6cea45faf497f1d592",[]],
  ["hint","qf01-r3-n14-perimeter-expression-answer",0,"足し算の式に同じ文字がそれぞれ何回出てくるか見ます。","c9e1e1fbdb1f45b78487c61e0e65d81caf2b3b5d19e6fe4aaaf7d52a23d03f17",[]],
  ["hint","qf01-r3-n14-perimeter-expression-answer",1,"順序を入れ替えてxの項どうし、yの項どうしを隣り合わせにできます。","dceb5667b251c306f3e4d89d39ff5069c853736b90c449a28b3557b6a0d6f40b",[[8,9,"x","x",null],[15,16,"y","y",null]]],
  ["wrong-reason","qf01-r3-n14-perimeter-expression-answer",1,"縦と横の一組だけになり、一周分の残りの辺が落ちています。","26ba2cb413c445be10fd8e70661440c85dcd3689038c835f38b12f927d965eb9",[]],
  ["wrong-reason","qf01-r3-n14-perimeter-expression-answer",2,"掛け算は長さの和を表していません。周長と面積を区別します。","f987e26632ae0ee3944546eb0e6ede31300ffda27d2239c4be285e356213dc66",[]],
  ["hint","qf01-n14-answer",0,"周長を表す式と、問題で与えられた値を等しいと置きます。","8462b3e322c1e4714584580980facee5c8bf30ea524e660cb75a46aefe3f4996",[]],
  ["hint","qf01-n14-answer",1,"面積を作り直さず、直前に自分で得た一周分の式を使います。","7bd3fff66175703840ecabba88f33ca95a3e355b618e2f9f9927afc86f9fdcee",[]],
  ["wrong-reason","qf01-n14-answer",1,"縦\\times 横は面積です。","ac6df88c515f4e394c3d7719a43b4c60387445674b17a8d202a2e4b69614c269",[[0,9,"縦\\times 横","\\text{縦}\\times \\text{横}",null]]],
  ["wrong-reason","qf01-n14-answer",2,"縦と横の辺がそれぞれ何本あるか数えます。","9aa0c7194f9de09fc7989bbcfabf231405288f642c5245a66c9e499bda8ee747",[]],
  ["hint","qf01-r3-n15-same-operation-answer",0,"両辺に共通している因数を、逆の計算で取り除くことを考えます。","88b308a939927e01d727dc0741a6633b5265df18d3f408781a6213ea8b2c372b",[]],
  ["hint","qf01-r3-n15-same-operation-answer",1,"掛け算を打ち消す操作を選び、それを等号の両側へ行います。","b7a968a0a997e170b44f7afc309e0db580f366634f3078ffdf7f782a9b5f435b",[]],
  ["wrong-reason","qf01-r3-n15-same-operation-answer",1,"片側だけに別の操作をすると、元の等しさを保てません。","12239349a5609dee7e2d76ac94e221aa19f77bfb4c81ceacb63bd5059ae4017f",[]],
  ["wrong-reason","qf01-r3-n15-same-operation-answer",2,"等しさは保てますが、各項の共通係数2をなくす目的には合いません。","26901ce3fd6d69b525cfb3eb216f852c65df509fd8daba821531f354b620a9f2",[[17,18,"2","2",null]]],
  ["hint","qf01-n15-answer",0,"左辺だけでなく、等号の反対側にも同じ割り算をします。","5704756cad2fa178cf7902221d0d642e6ab6848a2595ab40452f212c5ebe1a71",[]],
  ["hint","qf01-n15-answer",1,"各項の係数と右辺の数を、同じ数で割って考えます。","87d8f1a1bf4405bb954fe3cbc7b5c28ae8da27f9eb14f773a1a52a0330ea3d0f",[]],
  ["wrong-reason","qf01-n15-answer",1,"右辺も2で割ります。","4c0ba1a66215498fee41b0839eaeb7884176f66dcf10bbede2c2ed39ac298f97",[[3,4,"2","2",null]]],
  ["wrong-reason","qf01-n15-answer",2,"両辺に同じ割り算をします。","da26cd8a179a2867e688885c1be017e65887a56f83a946d8e71d8ac4873fc83a",[]],
  ["hint","qf01-r3-n16-target-answer",0,"問題の「求めるもの」と、図の文字の対応へ戻ります。","e096b96cff60a02cfbc60bca40e7d5523da93eaa055141efdc615197ab295677",[]],
  ["hint","qf01-r3-n16-target-answer",1,"横を縦の式で表すので、横に割り当てた記号を左辺へ残します。","60a51e0cdfecf66e45cdc58c4cbc98fa93d2e6c28abd0cbde70249496b24f6d2",[]],
  ["wrong-reason","qf01-r3-n16-target-answer",1,"xは縦の長さを表し、今回求めたい横ではありません。","fd8e72de1ea78ddd2299744b4811c08a9ce2b3b4a92fae526157cc7b901e1a40",[[0,1,"x","x",null]]],
  ["wrong-reason","qf01-r3-n16-target-answer",2,"二つの長さの和では、横の長さだけを表せません。","443b7997096bacdf7cf5baa1b2e47518818f09182058ec22b44fe9593bc87bd8",[]],
  ["hint","qf01-n16-answer",0,"左辺で同じxを打ち消す操作を、右辺にも行います。","006c577bf4102fd3f790ab834cfce796429c5d6dd841bcdafe58284992ea8820",[[5,6,"x","x",null]]],
  ["hint","qf01-n16-answer",1,"右辺は元の20からxを引いた順番を保ちます。","85dbab440b05540de83c27d002f277e832fa28df631f9bd77ab29633799b0261",[[5,7,"20","20",null],[9,10,"x","x",null]]],
  ["wrong-reason","qf01-n16-answer",1,"両辺からxを引きます。","125b93e45563c0f25093040b7ace6c8a6efe58686fef736841d003e9bce8b84b",[[4,5,"x","x",null]]],
  ["wrong-reason","qf01-n16-answer",2,"左辺のxを取り除くには両辺からxを引きます。","b04af7c0d0a5fed98a3793737bce47a34de416471e2c041ed6f319aca3f7a94c",[[3,4,"x","x",null],[15,16,"x","x",null]]],
  ["hint","qf01-n17-answer",0,"二つの辺のそれぞれが長方形を作れる長さかを考えます。","416f1c92a220a41fc09aa34e0ab191b433d1e0b76578ff3cf597a14a19865412",[]],
  ["hint","qf01-n17-answer",1,"0や負の値を辺の長さにできるか、図の意味へ戻って確認します。","cd7ceb6a088ba44a99f529b95ea45d3439787cad7007e0738066c5017caffd55",[[0,1,"0","0",null]]],
  ["wrong-reason","qf01-n17-answer",1,"辺が0では長方形を作れません。","9473e33c6d9651490962f30735f6deba757a1a7f0b0a44d1229e4267c8928f20",[[2,3,"0","0",null]]],
  ["wrong-reason","qf01-n17-answer",2,"横の長さも正である必要があります。","4647f027b1f5a48175555b32b44be422333441fd27cd5d72862ac7567dea7ea1",[]],
  ["hint","qf01-n18-answer",0,"20−xが正である条件を、xの大きさについて読み替えます。","a8e8d07fb887596f7f3f8e51eb3ee770ee635518a45819adba329962dab69de8",[[0,4,"20−x","20-x",null],[13,14,"x","x",null]]],
  ["hint","qf01-n18-answer",1,"両辺にxを足すとき、不等式の向きは変わりません。","ad88ec33e76cc6d8d1ed209db98cc30ccd323048e9d243c55cda9de74e24cc4e",[[3,4,"x","x",null]]],
  ["wrong-reason","qf01-n18-answer",1,"xを増やすほど20-xは小さくなります。","f61e7496b3ea19085b7f2c3660ca848cfe15fa8de66c8d9b70b86ffdb2780a01",[[0,1,"x","x",null],[7,11,"20-x","20-x",null]]],
  ["wrong-reason","qf01-n18-answer",2,"20-xは0より大きい必要があります。","f484764eafba0f1147438fdf732da615a92930e455c0a1045dff18aca1830e66",[[0,4,"20-x","20-x",null],[5,6,"0","0",null]]],
  ["hint","qf01-n19-answer",0,"下側と上側の二つの条件が、同時に残る形を探します。","3921e171826739fc77f8cbd6f0d15cd6c34416cfdbfd1807ba9c1e54fb50614e",[]],
  ["hint","qf01-n19-answer",1,"候補に入っている値が、元のx>0とx<20の両方を満たすか調べます。","d6882b401940f05dfd6ae57f1ae753033998958f92b9c8ef75200518b88c8941",[[13,16,"x>0","x>0",null],[17,21,"x<20","x<20",null]]],
  ["wrong-reason","qf01-n19-answer",1,"候補の境界値をx>0とx<20へ一つずつ入れ、両方の条件を満たすか確かめます。","e65b0a29888b47e3fd3a922ab0a77b04129fc343ff4655ef2e99f2943c39c6bc",[[7,10,"x>0","x>0",null],[11,15,"x<20","x<20",null]]],
  ["wrong-reason","qf01-n19-answer",2,"入力には、上側だけでなく下側の条件も必要です。","01191f2741c84cd7572020d05f602e91f933f53f6c65186bab1689855521b1dc",[]],
  ["hint","qf01-r3-n19-endpoints-answer",0,"等号の付かない不等号と、等号の付く不等号の違いを確かめます。","a9fc2df68a06324d22fdcde9f10e255848f5e3272615bc78e92f7a6d2f15c763",[]],
  ["hint","qf01-r3-n19-endpoints-answer",1,"0をx>0へ、20をx<20へそれぞれ入れて、元の条件を満たすか調べます。","69f315e3390635dbd8c864649da030c62c4685721afb2fb24544e2552f64c3e6",[[0,1,"0","0",null],[2,5,"x>0","x>0",null],[7,9,"20","20",null],[10,14,"x<20","x<20",null]]],
  ["wrong-reason","qf01-r3-n19-endpoints-answer",1,"x>0とx<20へ、境界の値をそのまま入れて条件が成り立つか確かめます。","b5e447bc2a0a22dfef3b9c44054cb395659e44689089f1660800abae25582db1",[[0,3,"x>0","x>0",null],[4,8,"x<20","x<20",null]]],
  ["wrong-reason","qf01-r3-n19-endpoints-answer",2,"0もx>0の条件と照らして考えます。片方だけ特別扱いしません。","b6024e7a560792df407bc1db261e315db8b370f42aa7890ef42d58078d7e0eb7",[[0,1,"0","0",null],[2,5,"x>0","x>0",null]]],
  ["hint","qf01-n21-answer",0,"20に正の数を足す場合と、引く場合を比べます。","f4e01a91d0cbce48e1a0bf97d86f8a78cb91818eaec55b944c6f36701114a9d7",[[0,2,"20","20",null]]],
  ["hint","qf01-n21-answer",1,"xは0ではなく正です。20からその分だけ小さくなることを考えます。","e42dba633f0a5218bcc62cf9063a21deed3ec21ff5fb1a4fa3cf61510cae9e35",[[0,1,"x","x",null],[2,3,"0","0",null],[11,13,"20","20",null]]],
  ["wrong-reason","qf01-n21-answer",1,"正の長さを引くので20のままではありません。","63928cc68c3adabd7b9251f8d8de462063627c11512d2690a1894bc9c1388411",[[9,11,"20","20",null]]],
  ["wrong-reason","qf01-n21-answer",2,"20から正の数を引いています。","965fe15b3a262989075f6d60bc5e4ecedbf9b3fef7cbf01e9d6f5f5b0c26385a",[[0,2,"20","20",null]]],
  ["hint","qf01-n22-answer",0,"今まとめるのは入力ではなく、出力についての二つの条件です。","68607c832e7dd2472dde3327ad7b6668e0a92a0956191e689ccf842daa68a621",[]],
  ["hint","qf01-n22-answer",1,"候補に入る値がy>0とy<20の両方を満たすか確かめます。","64e158d9d85c70dafdb642d41ea7898670e49b03d0336ba4e875ba6c1c9db44a",[[7,10,"y>0","y>0",null],[11,15,"y<20","y<20",null]]],
  ["wrong-reason","qf01-n22-answer",1,"ここで聞いているのは入力xではなく出力yです。","ac4d489ffed5452587bd6293ae9e335530b0fe189c620edd7643eb2f387dae22",[[12,13,"x","x",null],[19,20,"y","y",null]]],
  ["wrong-reason","qf01-n22-answer",2,"端の値を実現すると片方の辺が0になります。","55b3744112ae43c33b6d8bc69696a425bc69ffae664a495df6729b78c0dad771",[[14,15,"0","0",null]]],
  ["hint","qf01-r3-n22-inverse-answer",0,"両辺にxを足してから、両辺からyを引くと、xを単独にできます。","d6f0753f7a4fdaed065d0e088699b957ff0d0f00c6ef6a6079a11e6db0fe90a3",[[3,4,"x","x",null],[15,16,"y","y",null],[21,22,"x","x",null]]],
  ["hint","qf01-r3-n22-inverse-answer",1,"等しい関係を保ったまま、求めたい量を変える操作です。横の長さを単独にしたときの考え方を使います。","67e86e9912eeb92a2a6c70b3abc0a9befc1f6f55578fc82da10fcdbb4b2bf3f1",[]],
  ["wrong-reason","qf01-r3-n22-inverse-answer",1,"右辺の符号を元のy=20−xへ戻して確かめます。同じ出力には戻りません。","1fad072be7fe956e6ec1df936f7ad2bd0eee9fe4540f616b020e54931856d2c0",[[8,14,"y=20−x","y=20-x",null]]],
  ["wrong-reason","qf01-r3-n22-inverse-answer",2,"例えば許されたyを入れて、xが正の入力になるか確かめます。符号を逆にしていないか見ます。","d893fc9fb86bcdafa98438eaefd5e27fbdeccdd58d17533e18e520750d80e9f4",[[7,8,"y","y",null],[13,14,"x","x",null]]],
]
const r3MixedIndex = new Map(R3_MIXED_SOURCE_STRINGS.map(row => [row.slice(0, 3).join(':'), row]))
function mixedNeed(value: unknown, reason: string): asserts value { if (!value) throw Error('R3_MIXED_' + reason) }
function mixedOriginal(source: QF01R3Validated, field: R3MixedField, owner: string, index: number): string | null {
  mixedNeed(Number.isSafeInteger(index) && index >= 0, 'FIELD_INDEX')
  if (field === 'marker') {
    const block = source.blocks.get(owner)
    mixedNeed(index === 0 && source.metadata.canonicalBlockIds.includes(owner) && block?.type === 'marker', 'MARKER_OWNER')
    return block.text
  }
  const q = source.metadata.interactions.find(q => q.id === owner), item = source.items.get(owner)
  mixedNeed(q && item?.id === owner, 'ITEM_OWNER')
  if (field === 'choice') {
    mixedNeed(q.answerDomain === 'semantic' && item.acceptedAnswers?.length === 0 && index < (item.choices?.length ?? 0), 'CHOICE_OWNER')
    return item.choices![index]
  }
  if (field === 'hint') { mixedNeed(index < item.hints.length, 'HINT_INDEX'); return item.hints[index] }
  mixedNeed(field === 'wrong-reason' && index < q.wrongReasonByChoiceIndex.length, 'REASON_INDEX')
  return q.wrongReasonByChoiceIndex[index]
}
function mixedRecipe(source: QF01R3Validated, field: R3MixedField, owner: string, index: number): R3MixedRecipe {
  const row = r3MixedIndex.get([field, owner, index].join(':'))
  mixedNeed(row && mixedOriginal(source, field, owner, index) === row[3], 'SOURCE_IDENTITY')
  return row
}
async function validateQF01R3MixedSource(source: QF01R3Validated) {
  mixedNeed(source.metadata.unitParsedCanonicalSHA256 === '8af6a22c1656d6c37a799b30b42f51036d3a6f49879b0c9a85970f6020dc8e08'
    && source.metadata.canonicalBlockIds.length === 134 && source.metadata.interactions.length === 35
    && R3_MIXED_SOURCE_STRINGS.length === 187 && r3MixedIndex.size === 187, 'MANIFEST')
  const actual: [R3MixedField, string, number][] = []
  for (const id of source.metadata.canonicalBlockIds) if (source.blocks.get(id)?.type === 'marker') actual.push(['marker', id, 0])
  let nullReasons = 0
  for (const q of source.metadata.interactions) {
    const item = source.items.get(q.id)!
    if (q.answerDomain === 'semantic') item.choices!.forEach((_, index) => actual.push(['choice', q.id, index]))
    mixedNeed(item.hints.length === 2 && q.wrongReasonByChoiceIndex.length === 3, 'ITEM_SHAPE')
    item.hints.forEach((_, index) => actual.push(['hint', q.id, index]))
    q.wrongReasonByChoiceIndex.forEach((text, index) => { if (text === null) nullReasons++; else actual.push(['wrong-reason', q.id, index]) })
  }
  mixedNeed(actual.length === 187 && nullReasons === 35, 'COVERAGE')
  let spans = 0
  await Promise.all(actual.map(async ([field, owner, index]) => {
    const row = mixedRecipe(source, field, owner, index)
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(row[3]))
    mixedNeed([...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('') === row[4], 'RAW_HASH')
    let previous = 0
    for (const [start, end, lexeme] of row[5]) {
      mixedNeed(bodyOffset(row[3], start) && bodyOffset(row[3], end) && start >= previous && end > start && row[3].slice(start, end) === lexeme, 'SPAN_BINDING')
      previous = end; spans++
    }
  }))
  mixedNeed(spans === 191, 'MATH_COVERAGE')
}
function qf01R3MixedSlice(source: QF01R3Validated, origin: R3MixedOrigin, visibleText: string): R3BodyToken[] {
  const row = mixedRecipe(source, origin.field, origin.owner, origin.index), { start, end } = origin
  mixedNeed(bodyOffset(row[3], start) && bodyOffset(row[3], end) && end >= start && row[3].slice(start, end) === visibleText, 'VISIBLE_SLICE')
  mixedNeed(!row[5].some(([left, right]) => left < start && start < right || left < end && end < right), 'SPLIT_MATH_UNIT')
  const tokens: R3BodyToken[] = []
  let at = start
  for (const [left, right, lexeme, latex, unit] of row[5]) {
    if (left < start || right > end) continue
    mixedNeed(visibleText.slice(left - start, right - start) === lexeme, 'VISIBLE_LEXEME')
    if (left > at) tokens.push({ type: 'text', text: visibleText.slice(at - start, left - start) })
    tokens.push({ type: 'math', latex, start: left, end: right, unit }); at = right
  }
  if (at < end) tokens.push({ type: 'text', text: visibleText.slice(at - start) })
  return tokens
}
export function R3MixedText({ source, origin, visibleText, sourceId, unitId }: { source: QF01R3Validated; origin: R3MixedOrigin; visibleText: string; sourceId: string; unitId: string }) {
  const tokens = qf01R3MixedSlice(source, origin, visibleText), row = mixedRecipe(source, origin.field, origin.owner, origin.index)
  return <span data-qf01-mixed-inline-flow="true" data-qf01-mixed-field={origin.field} data-qf01-mixed-owner={origin.owner} data-qf01-mixed-index={origin.index} data-qf01-mixed-start={origin.start} data-qf01-mixed-end={origin.end} data-qf01-mixed-source-sha={row[4]} data-qf01-mixed-source-id={sourceId}>{tokens.map((token, index) => {
    if (token.type === 'text') return token.text
    const id = sourceId + '-mixed-' + token.start + '-' + token.end
    return <span key={index} data-qf01-mixed-math="true" data-qf01-mixed-start={token.start} data-qf01-mixed-end={token.end} data-qf01-mixed-source-id={id}><TypesetInlineMath latex={qf01R3AtomicBodyMath(token.latex)} sourceId={id} unitId={unitId} /></span>
  })}</span>
}
R3MixedText.validateSource = validateQF01R3MixedSource
R3MixedText.slice = qf01R3MixedSlice
R3MixedText.recipes = R3_MIXED_SOURCE_STRINGS

type R3NearbyVisibility = 'IN_VIEW' | 'OUT_OF_VIEW' | 'NOT_MOUNTED_BY_DESIGN' | 'UNVERIFIED'

// D06 is local to the existing R3 panel. Keep standalone hint padding,
// borders, vertical spacing, fonts and whole mathematical units unchanged.
const R3_NARROW_INLINE_LAYOUT = `@media (max-width:360px) {
[data-qf01-revision="3"] .reading-inline-choice-panel { padding-left:2px; padding-right:2px; }
[data-qf01-revision="3"] .reading-inline-choice-panel > aside.reading-choice-hint { padding-left:0; padding-right:0; min-width:0; }
[data-qf01-revision="3"] .reading-inline-choice-panel > aside.reading-choice-hint > p { min-width:0; }
}`
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
  const mixedProjection = useMemo(() => {
    try {
      const inspect = (field: R3MixedField, owner: string, index: number, text: string) => qf01R3MixedSlice(source, { field, owner, index, start: 0, end: text.length }, text)
      for (const id of m.canonicalBlockIds) {
        const projected = projectQF01R3Block(source, id, solved, { helpFor: helpId })
        if (projected?.source.type === 'marker') inspect('marker', id, 0, projected.source.text)
      }
      for (const q of m.interactions) if (q.answerDomain === 'semantic' && solved.has(q.id)) {
        const value = current?.answers[q.id]?.value, item = source.items.get(q.id)!
        mixedNeed(value !== undefined, 'RESOLVED_VALUE')
        inspect('choice', q.id, item.choices!.indexOf(value), value)
      }
      if (currentQ) {
        const item = source.items.get(currentQ.id)!, record = current?.answers[currentQ.id]
        if (activeId === currentQ.id && currentQ.answerDomain === 'semantic') item.choices!.forEach((text, index) => inspect('choice', currentQ.id, index, text))
        if (helpId === currentQ.id) inspect('hint', currentQ.id, 0, item.hints[0])
        if (record && !solved.has(currentQ.id)) {
          const index = item.choices!.indexOf(record.value)
          mixedNeed(index >= 0, 'WRONG_VALUE')
          if (currentQ.answerDomain === 'semantic') inspect('choice', currentQ.id, index, record.value)
          const text = currentQ.wrongReasonByChoiceIndex[index]
          mixedNeed(typeof text === 'string', 'NULL_REASON_NOT_VISIBLE')
          inspect('wrong-reason', currentQ.id, index, text)
          if (record.attemptCount > 1) inspect('hint', currentQ.id, 1, item.hints[1])
        }
      }
      return { failed: false }
    } catch { return { failed: true } }
  }, [source, m, solved, helpId, activeId, currentQ, current?.answers])
  const bodyBlocked = bodyProjection.failed, mixedBlocked = mixedProjection.failed, interactionBlocked = nearbyBlocked || bodyBlocked || mixedBlocked
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
  const renderMixed = (field: R3MixedField, owner: string, index: number, text: string, sourceId: string) => mixedBlocked ? null
    : <R3MixedText source={source} origin={{ field, owner, index, start: 0, end: text.length }} visibleText={text} sourceId={sourceId} unitId={unit.unitId} />
  const renderChoiceValue = (id: string, value: string, sourceId: string): ReactNode => {
    const q = m.interactions.find(q => q.id === id)!
    if (q.answerDomain === 'semantic') return renderMixed('choice', id, source.items.get(id)!.choices!.indexOf(value), value, sourceId)
    const safeMath = value.replaceAll('かつ', '\\text{ かつ }').replace(/だけでよい|だけ/g, phrase => '\\text{ ' + phrase + ' }').replaceAll('より小さい', '\\text{ より小さい }')
    return <TypesetInlineMath latex={safeMath} sourceId={id + '-choice'} unitId={unit.unitId} />
  }
  const slot = (id: string) => {
    if (solved.has(id)) return <span data-testid={'resolved-' + id}>{renderChoiceValue(id, current!.answers[id].value, id + '-resolved-value')}</span>
    const q = m.interactions.find(q => q.id === id)!, enabled = currentQ?.id === id && !interactionBlocked
    return <button type="button" style={{ minWidth: 48, minHeight: 48 }} disabled={!enabled} className="reading-inline-blank qf01-whole-answer-slot" data-qf01-current-slot={enabled || undefined} data-testid={'textbook-item-' + id} aria-label={q.layoutKind === 'paragraph' ? '本文の空欄。候補を開く' : '数式の空欄。候補を開く'} aria-expanded={activeId === id} aria-controls={contextId + '-options'} aria-describedby={contextId} onClick={() => setActiveId(id)}>□</button>
  }
  const renderParts = (parts: TextbookReadingPart[], id: string, body: R3BodyPlan, slotId?: string) => parts.map((p, j) => {
    if (p.type === 'text') return <R3BodyText key={j} source={source} origin={body.origins[j]} visibleText={p.text} sourceId={id} unitId={unit.unitId} />
    if (p.type === 'term') return <span key={j}>{p.text}</span>
    if (p.type === 'math') return <TypesetInlineMath key={j} latex={qf01R3AtomicBodyMath(p.latex)} sourceId={p.semanticId ?? id + '-p' + j} unitId={unit.unitId} />
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
    else if (b.type === 'marker') content = <p className={'reading-role-marker reading-role-marker--' + b.kind} data-reading-role={projected.sourceRole}>{renderMixed('marker', id, 0, b.text, key + '-marker')}</p>
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
    if (solved.has(id) || id !== currentQ?.id || mixedBlocked) return null
    const item = source.items.get(id)!, record = current?.answers[id], wrong = Boolean(record && !solved.has(id)), expanded = activeId === id
    const wrongIndex = record ? item.choices?.findIndex(value => normalizeTextbookAnswer(value) === normalizeTextbookAnswer(record.value)) ?? -1 : -1
    return <div className="reading-inline-choice-panel qf01-attached-options" data-testid={'inline-choice-panel-' + id}>
      {wrong && <aside className="reading-choice-hint" data-testid={'textbook-hint-' + id}><strong>この候補は採用しません：</strong>{renderChoiceValue(id, record!.value, id + '-wrong-value')}<p>{renderMixed('wrong-reason', id, wrongIndex, currentQ!.wrongReasonByChoiceIndex[wrongIndex]!, id + '-wrong-reason')}</p>{record!.attemptCount > 1 && <p>{renderMixed('hint', id, 1, item.hints[1], id + '-second-hint')}</p>}</aside>}
      <button type="button" disabled={interactionBlocked} style={{ minHeight: 48 }} aria-expanded={helpId === id} onClick={() => setHelpId(helpId === id ? null : id)}>手掛かり{helpId === id ? 'を閉じる' : 'を見る'}</button>
      {helpId === id && <p className="reading-choice-hint">{renderMixed('hint', id, 0, item.hints[0], id + '-hint')}</p>}
      {expanded && <div id={contextId + '-options'} className="reading-choice-options guided-choice-options" role="group" aria-label="この空欄の候補" aria-describedby={contextId}>{getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).map((choice, index) => <button type="button" disabled={interactionBlocked} style={{ minHeight: 48, minWidth: 48 }} className="reading-choice-option" key={choice} aria-label={'候補' + (index + 1) + '、' + choice} aria-invalid={Boolean(wrong && record!.value === choice) || undefined} data-testid={'textbook-choice-' + id + '-' + index} onPointerDown={event => { pointerFocusTarget.current = event.currentTarget; cancelFocusReveal() }} onFocus={event => revealFocusedChoice(event.currentTarget)} onClick={() => {
        if (interactionBlocked) return
        cancelFocusReveal(); pointerFocusTarget.current = null
        if (onReviewAnswer) onReviewAnswer(item, choice); else answer(unit, id, choice)
        if (normalizeTextbookAnswer(choice) === normalizeTextbookAnswer(item.answer)) { setActiveId(null); setHelpId(null) }
      }}><span className="qf01-option-content">{renderChoiceValue(id, choice, id + '-option-' + index)}</span></button>)}</div>}
    </div>
  }
  const headerId = stageInfo.headerSourceRef
  const preludeSet = new Set(preludeIds)
  const bodyIds = stageInfo.fullLessonBlockRefs.filter(id => !preludeSet.has(id) && id !== stageInfo.terminalSourceRef)
  const topIds = (selectedRefs?.topReferenceRecordIds ?? []).filter(rid => !preludeSet.has(m.viewContracts.RESULT_REGISTRY.records.find(r => r.id === rid)?.sourceRef.blockId ?? ''))
  if (progressState.error) return <p role="alert">学習記録の対応を確認できません。回答操作はできません。</p>
  return <article ref={flow} className="textbook-reading-flow guided-reading qf01-full-reading" data-qf01-revision="3" data-testid="textbook-reading-flow" data-typeset-theme="true" data-qf01-nearby-visibility={JSON.stringify(nearbySources)} tabIndex={-1}>
    <style data-qf01-r3-narrow-inline-layout>{R3_NARROW_INLINE_LAYOUT}</style>
    {nearbyBlocked && <p role="alert" data-testid="qf01-r3-nearby-error">参照元の表示を確認できません。回答操作を停止しています。</p>}
    {bodyBlocked && <p role="alert" data-testid="qf01-r3-prose-error">本文の数学との対応を確認できません。回答操作を停止しています。</p>}
    {mixedBlocked && <p role="alert" data-testid="qf01-r3-mixed-error">表示する数学と参照元の対応を確認できません。回答操作を停止しています。</p>}
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
