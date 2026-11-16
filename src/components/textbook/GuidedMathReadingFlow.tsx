import { useCallback, useId, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { InlineMath } from 'react-katex'
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
import { validateQF01R3Reading, qf01R3Solved, projectQF01R3Block, formatQF01R3Owner, type QF01R3Validated } from '../../domain/transformationReading'
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
    validateQF01R3Reading(props.unit, props.readingPresentation).then(value => { if (active) setSource(value) }).catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [props.unit, props.readingPresentation])
  if (error) return <p role="alert" data-testid="qf01-r3-binding-error">教材と学習記録の対応を確認できません。本文は表示していません。</p>
  if (!source || source.unit !== props.unit || source.metadata !== props.readingPresentation) return <p role="status">教材の対応を確認しています。</p>
  return <ValidatedR3QF01ReadingFlow {...props} source={source} />
}
function ValidatedR3QF01ReadingFlow({ unit, section, progress, source, storageScope, onReviewAnswer, onSummaryReached }: Props & { source: QF01R3Validated }) {
  const answer = useAppStore(state => state.answerTextbook)
  const progressState = (() => { try { return { value: effectiveTextbookProgress(unit, progress), error: false } } catch { return { value: undefined, error: true } } })()
  const current = progressState.value, m = source.metadata
  const solved = qf01R3Solved(source, current?.answers)
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
  const [history, setHistory] = useState(false), [fullHistory, setFullHistory] = useState(false), [repeatContext, setRepeatContext] = useState(false)
  const contextId = useId(), flow = useRef<HTMLDivElement>(null), context = useRef<HTMLDivElement>(null)
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
  // Clear the old stage before the current layout effect schedules its reveal.
  useLayoutEffect(() => { cancelFocusReveal(); pointerFocusTarget.current = null }, [stageIndex, cancelFocusReveal])
  const activeValue = activeId ? current?.answers[activeId]?.value : undefined
  const activeAttemptCount = activeId ? current?.answers[activeId]?.attemptCount : undefined
  const lastResolvedNodeId = [...data.nodes].reverse().find(node => node.stageId === stage.id && node.interaction && resolved(node.interaction))?.id
  useLayoutEffect(() => {
    const check = syncRepeatedContext
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
    window.addEventListener('scroll', check, { passive: true }); window.addEventListener('resize', check)
    return () => { alive = false; cancelFocusReveal(); window.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [stageIndex, activeId, first, activeValue, activeAttemptCount, lastResolvedNodeId, syncRepeatedContext, reveal, cancelFocusReveal])
  // The canonical derivation shares one relation axis. Formula numbering is a
  // separate contract; recalled conditions and hints keep their own layout.
  useLayoutEffect(() => {
    const root = flow.current
    if (!root) return
    let alive = true, notifying = false, frame: number | undefined
    const align = () => {
      if (!alive) return
      const groups = new Map<string, HTMLElement[]>()
      for (const block of root.querySelectorAll<HTMLElement>('.qf01-continuous-derivation [data-qf01-alignment-group]')) {
        const id = block.dataset.qf01AlignmentGroup!
        groups.set(id, [...(groups.get(id) ?? []), block])
      }
      for (const blocks of groups.values()) {
        const formulas = blocks.flatMap(block => [...block.querySelectorAll<HTMLElement>('.transformation-equation > .reading-formula-line--typeset')].filter(formula => formula.closest('[data-source-block]') === block && formula.dataset.typesetSource === block.dataset.sourceBlock))
        const rows = formulas.flatMap(formula => [...formula.querySelectorAll<HTMLElement>('.typeset-line--equation')])
        const width = (row: HTMLElement, selector: string) => row.querySelector<HTMLElement>(selector)?.getBoundingClientRect().width ?? 0
        const left = Math.max(0, ...rows.map(row => width(row, '.typeset-left > .typeset-cell-content')))
        const right = Math.max(0, ...rows.map(row => width(row, '.typeset-right > .typeset-cell-content')))
        const relation = Math.max(0, ...rows.map(row => width(row, '.typeset-relation')))
        const naturalWidth = Math.max(0, ...formulas.map(formula => parseFloat(formula.style.getPropertyValue('--typeset-body')) || 0))
        const bodyWidth = Math.max(naturalWidth, left + relation + right + 8)
        // Keep the existing responsive split when a shared row cannot fit.
        // Pixel QA still checks every visible relation; no overflow is hidden.
        const fits = rows.length >= 2 && formulas.every(formula => formula.clientWidth >= bodyWidth)
        let changed = false
        const set = (element: HTMLElement, property: string, value: string) => {
          if (element.style.getPropertyValue(property) === value) return
          element.style.setProperty(property, value); changed = true
        }
        for (const formula of formulas) {
          const body = formula.querySelector<HTMLElement>('.typeset-formula-body')
          if (body) set(body, 'width', fits ? bodyWidth + 'px' : '')
        }
        for (const row of rows) set(row, 'grid-template-columns', fits ? `${left}px ${relation}px ${right}px` : '')
        if (changed) {
          notifying = true
          for (const formula of formulas) formula.dispatchEvent(new Event('typeset-layout', { bubbles: true }))
          notifying = false
        }
      }
    }
    const schedule = () => { if (!alive || notifying) return; if (frame !== undefined) cancelAnimationFrame(frame); frame = requestAnimationFrame(align) }
    align()
    root.addEventListener('typeset-layout', schedule)
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule)
    observer?.observe(root)
    void document.fonts?.ready.then(schedule)
    return () => { alive = false; root.removeEventListener('typeset-layout', schedule); observer?.disconnect(); if (frame !== undefined) cancelAnimationFrame(frame) }
  })
  const canonicalBlocks = m.canonicalBlockIds.map(id => source.blocks.get(id)!)
  const profile = qf01ReadingLayoutProfile(stage.id, stageInfo.fullLessonBlockRefs.map(id => ({ id, type: source.blocks.get(id)!.type, role: String(m.sourceMap.find(s => s.unitBlockId === id)!.authorAttributes.role) })))
  const selectedRefs = m.viewContracts.INTERACTION_REFERENCES.rows.find(row => row.currentInteractionId === currentQ?.id)
  const preludeIds = m.viewContracts.FRAME_CONTRACT.stagePreludeRefs[stage.id] ?? []
  const renderChoiceValue = (id: string, value: string): ReactNode => {
    const q = m.interactions.find(q => q.id === id)!
    if (q.answerDomain === 'semantic') return value
    const safeMath = value.replaceAll('かつ', '\\text{ かつ }').replace(/だけでよい|だけ/g, phrase => '\\text{ ' + phrase + ' }').replaceAll('より小さい', '\\text{ より小さい }')
    return <TypesetInlineMath latex={safeMath} sourceId={id + '-choice'} unitId={unit.unitId} />
  }
  const slot = (id: string) => {
    if (solved.has(id)) return <span data-testid={'resolved-' + id}>{renderChoiceValue(id, current!.answers[id].value)}</span>
    const q = m.interactions.find(q => q.id === id)!, enabled = currentQ?.id === id
    return <button type="button" style={{ minWidth: 48, minHeight: 48 }} disabled={!enabled} className="reading-inline-blank qf01-whole-answer-slot" data-qf01-current-slot={enabled || undefined} data-testid={'textbook-item-' + id} aria-label={q.layoutKind === 'paragraph' ? '本文の空欄。候補を開く' : '数式の空欄。候補を開く'} aria-expanded={activeId === id} aria-controls={contextId + '-options'} aria-describedby={contextId} onClick={() => setActiveId(id)}>□</button>
  }
  const renderParts = (parts: TextbookReadingPart[], id: string, slotId?: string) => parts.map((p, j) => {
    if (p.type === 'text' || p.type === 'term') return <span key={j}>{p.text}</span>
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
    if (b.type === 'formula') content = <div className="transformation-equation"><TypesetFormula source={projected.formulaSource ?? b.parts.map(p => p.type === 'math' ? p.latex : p.type === 'text' || p.type === 'term' ? '\\text{' + p.text + '}' : '').join('')} sourceId={key} unitId={unit.unitId} parts={projected.slotItemId ? [slot(projected.slotItemId)] : []} itemIds={projected.slotItemId ? { 0: projected.slotItemId } : {}} /></div>
    else if (b.type === 'paragraph') content = <p className="reading-paragraph">{renderParts(projected.parts ?? b.parts, key, projected.slotItemId)}</p>
    else if (b.type === 'figure') { const figure = section.figures.find(f => f.id === b.figureId)!; content = <TextbookFigure figure={figure} items={section.items} progress={current} onOpen={() => undefined} /> }
    else if (b.type === 'marker') content = <p className={'reading-role-marker reading-role-marker--' + b.kind} data-reading-role={projected.sourceRole}>{b.text}</p>
    else if (b.type === 'heading') content = <h3>{b.text}</h3>
    else content = null
    if (b.type === 'formula') {
      const alias = m.viewContracts.RESULT_REGISTRY.records.find(record => record.sourceRef.blockId === id)?.equation?.displayNumber
      if (alias !== undefined && alias !== null) {
        const sourceStage = m.sourceMap.find(entry => entry.unitBlockId === id)!.authorAttributes.stageId
        const sameRelation = m.canonicalBlockIds.filter(blockId => m.sourceMap.find(entry => entry.unitBlockId === blockId)!.authorAttributes.stageId === sourceStage && m.viewContracts.RESULT_REGISTRY.records.some(record => record.sourceRef.blockId === blockId && record.equation?.displayNumber === alias) && projectQF01R3Block(source, blockId, solved, { helpFor: helpId, recorded }))
        if (sameRelation.at(-1) === id || recorded && !viewPrefix.startsWith('history-full-')) content = <GuidedNumberedEquation number={alias}>{content}</GuidedNumberedEquation>
      }
    }
    const relationNumber = b.type === 'formula' ? m.viewContracts.RESULT_REGISTRY.records.find(record => record.sourceRef.blockId === id)?.equation?.displayNumber : undefined
    const alignmentGroup = !viewPrefix && relationNumber != null ? `${stage.id}-relation-${relationNumber}` : undefined
    return <div {...attrs} key={key} data-qf01-alignment-group={alignmentGroup} data-testid={!recorded && q && solved.has(q.id) ? 'resolved-' + q.id : undefined} data-source-block={id} data-source-view={viewPrefix || 'canonical'} data-source-node={q?.nodeId ?? id}>{!recorded && !viewPrefix && q && q.id === currentQ?.id ? nearbyInfo(q.id) : null}{content}{!recorded && q && q.id === currentQ?.id ? panel(q.id) : null}</div>
  }
  const recordView = (recordId: string, prefix: string) => {
    const record = m.viewContracts.RESULT_REGISTRY.records.find(r => r.id === recordId)
    if (!record || !record.availableWhen.allSolved.every(id => solved.has(id))) return null
    return renderBlock(record.sourceRef.blockId, prefix, true)
  }
  const refsView = (ids: string[], prefix: string) => <>{ids.map(id => recordView(id, prefix))}</>
  const nearbyInfo = (id: string) => {
    if (!repeatContext) return null
    const shown = new Set<string>(), recordIds: string[] = []
    for (const recordId of selectedRefs?.nearbyReferenceRecordIds ?? []) {
      const record = m.viewContracts.RESULT_REGISTRY.records.find(row => row.id === recordId)
      if (!record || !record.availableWhen.allSolved.every(ref => solved.has(ref))) continue
      const blockId = record.sourceRef.blockId
      if (shown.has(blockId) || !projectQF01R3Block(source, blockId, solved, { helpFor: helpId, recorded: true })) continue
      shown.add(blockId); recordIds.push(recordId)
    }
    const missingFigures = m.viewContracts.FIGURE_POLICY.placement.requiredCurrentInteractionIds.includes(id)
      ? frame.figureBlockRefs.filter(ref => !shown.has(ref) && projectQF01R3Block(source, ref, solved, { helpFor: helpId, recorded: true })) : []
    if (!recordIds.length && !missingFigures.length) return null
    return <aside className="qf01-local-context qf01-nearby-references" aria-label="今の判断に必要な情報">{refsView(recordIds, 'nearby-')}{missingFigures.map(ref => renderBlock(ref, 'nearby-figure-', true))}</aside>
  }
  const panel = (id: string) => {
    if (solved.has(id) || id !== currentQ?.id) return null
    const item = source.items.get(id)!, record = current?.answers[id], wrong = Boolean(record && !solved.has(id)), expanded = activeId === id
    const wrongIndex = record ? item.choices?.findIndex(value => normalizeTextbookAnswer(value) === normalizeTextbookAnswer(record.value)) ?? -1 : -1
    return <div className="reading-inline-choice-panel qf01-attached-options" data-testid={'inline-choice-panel-' + id}>
      {wrong && <aside className="reading-choice-hint" data-testid={'textbook-hint-' + id}><strong>この候補は採用しません：</strong>{renderChoiceValue(id, record!.value)}<p>{wrongIndex >= 0 ? currentQ!.wrongReasonByChoiceIndex[wrongIndex] : '保存した解答を確認してください。'}</p>{record!.attemptCount > 1 && <p>{item.hints[1]}</p>}</aside>}
      <button type="button" style={{ minHeight: 48 }} aria-expanded={helpId === id} onClick={() => setHelpId(helpId === id ? null : id)}>手掛かり{helpId === id ? 'を閉じる' : 'を見る'}</button>
      {helpId === id && <p className="reading-choice-hint">{item.hints[0]}</p>}
      {expanded && <div id={contextId + '-options'} className="reading-choice-options guided-choice-options" role="group" aria-label="この空欄の候補" aria-describedby={contextId}>{getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).map((choice, index) => <button type="button" style={{ minHeight: 48, minWidth: 48 }} className="reading-choice-option" key={choice} aria-label={'候補' + (index + 1) + '、' + choice} aria-invalid={Boolean(wrong && record!.value === choice) || undefined} data-testid={'textbook-choice-' + id + '-' + index} onPointerDown={event => { pointerFocusTarget.current = event.currentTarget; cancelFocusReveal() }} onFocus={event => revealFocusedChoice(event.currentTarget)} onClick={() => {
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
  return <article ref={flow} className="textbook-reading-flow guided-reading qf01-full-reading" data-qf01-revision="3" data-testid="textbook-reading-flow" data-typeset-theme="true" tabIndex={-1}>
    <div className="math-textbook-reading-controls"><span>今の段階 {stageIndex + 1} / 9</span><span>解答の記録：{solved.size}/35</span>{stageIndex > 0 && <button type="button" onClick={() => setHistory(!history)}>前の段階を見る</button>}</div>
    {stageIndex === 0 && renderBlock(m.viewContracts.FRAME_CONTRACT.単元block配置['unit-purpose'].sourceRef, 'introduction-')}
    {history && <div className="guided-history"><button type="button" onClick={() => setFullHistory(!fullHistory)}>{fullHistory ? '全文を閉じる' : '全文を開く'}</button>{stages.slice(0, stageIndex).map(s => <section key={s.stageId} data-testid={'recorded-results-' + s.stageId}>{renderBlock(s.headerSourceRef, 'history-header-', true)}{fullHistory ? s.fullLessonBlockRefs.filter(id => id !== s.headerSourceRef).map(id => renderBlock(id, 'history-full-', true)) : refsView(s.conclusionRecordIds, 'history-result-')}</section>)}</div>}
    <section className="math-textbook-stage math-textbook-stage--current" data-testid={'math-textbook-stage-' + stage.id} data-reading-layout-scope="qf01-r3-shared-reading-v1" data-reading-layout-profile={profile.id}>
      <ReadingStageFrame contextHeader={frame.headerBlockRef !== headerId ? renderBlock(frame.headerBlockRef, 'frame-', true) : undefined}
        header={<div id={contextId + '-header'}>{renderBlock(headerId)}</div>}
        prelude={<div>{preludeIds.filter(id => id !== headerId).map(id => renderBlock(id))}</div>}
        references={<aside ref={context} id={contextId} className="math-textbook-stage-reference-content" aria-label="現在必要な情報">{topIds.length > 0 && <strong>使う条件・前の結果</strong>}{refsView(topIds, 'top-')}</aside>}
        conclusion={complete ? <div className="qf01-recorded-conclusion">{renderBlock(stageInfo.terminalSourceRef)}</div> : undefined}
        navigation={<div className="guided-stage-navigation">{stageIndex > 0 && <button type="button" onClick={() => { setCursor(stageIndex - 1); setActiveId(null); setHelpId(null); setHistory(false) }}>前の段階へ</button>}{complete && stageIndex < 8 && <button type="button" onClick={() => { setCursor(stageIndex + 1); setActiveId(null); setHelpId(null); setHistory(false) }}>次の段階へ</button>}</div>}>
        <div data-reading-layout-body><div className="reading-derivation-chain qf01-continuous-derivation" {...readingLayoutChainAttributes(profile, bodyIds[0] ?? headerId)}>{bodyIds.map(id => renderBlock(id))}</div></div>
      </ReadingStageFrame>
    </section>
    {stageIndex === 8 && solved.size === 35 && <section className="qf01-unit-summary" data-testid="qf01-unit-summary">{m.viewContracts.FRAME_CONTRACT.単元block配置['unit-summary'].sourceRefs.map(id => renderBlock(id, 'summary-', true))}</section>}
  </article>
}
