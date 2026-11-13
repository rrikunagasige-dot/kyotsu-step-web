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
import './guided-math-reading.css'

type Props = {
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

function ValidatedFullQF01ReadingFlow({ unit, section, progress, data, plan, storageScope, onSummaryReached, onReviewAnswer }: Props & { data: Presentation; plan: import('../../domain/transformationReading').TransformationReading }) {
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
  useEffect(() => { window.localStorage.setItem(storageKey, String(stageIndex)) }, [stageIndex, storageKey])
  useEffect(() => { onSummaryReached?.(false) }, [onSummaryReached])
  useEffect(() => { setCursor(value => Math.min(value, maxStage)) }, [maxStage])
  useLayoutEffect(() => {
    const check = () => { const r = context.current?.getBoundingClientRect(); setRepeatContext(Boolean(r && (r.top < viewportBounds().top || r.bottom > viewportBounds().bottom))) }
    const frame = requestAnimationFrame(() => { check(); reveal(flow.current?.querySelector<HTMLElement>(activeId ? '[data-testid="inline-choice-panel-' + activeId + '"]' : '[data-qf01-current-slot]') ?? null) })
    window.addEventListener('scroll', check, { passive: true }); window.addEventListener('resize', check)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [stageIndex, activeId, first, viewportBounds, reveal])
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
    return <button type="button" className="reading-inline-blank qf01-whole-answer-slot" data-qf01-current-slot data-testid={'textbook-item-' + id} aria-label="式中の空欄" aria-describedby={contextId} onClick={() => setActiveId(id)}>□</button>
  }
  const panel = (id: string) => {
    if (activeId !== id || resolved(id)) return null
    const item = items.find(i => i.id === id)!, node = data.nodes.find(n => n.interaction === id)!, record = current?.answers[id]
    const wrong = record && !resolved(id), display = data.semanticDisplay[node.id]
    return <div className="reading-inline-choice-panel qf01-attached-options" data-testid={'inline-choice-panel-' + id}>
      {repeatContext && <aside className="qf01-local-context" data-testid="qf01-local-context"><strong>元の条件・求めるもの</strong><p>{semantic(stage.sourceQuestionParts)}</p></aside>}
      {wrong && <aside className="reading-choice-hint" data-testid={'textbook-hint-' + id}><strong>この候補は採用しません：</strong>{value(id, record.value)}<p>{semantic(display.feedback[record.value] ?? [])} {semantic(display.hintParts[0] ?? [])}</p></aside>}
      <div className="reading-choice-options guided-choice-options" role="group" aria-label="この空欄の候補" aria-describedby={contextId}>
        {getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).map((choice, index) => <button type="button" className="reading-choice-option" key={choice} aria-label={choice} onFocus={event => reveal(event.currentTarget)} aria-invalid={Boolean(wrong && record.value === choice) || undefined} data-testid={'textbook-choice-' + id + '-' + index} onClick={() => {
          if (onReviewAnswer) onReviewAnswer(item, choice); else answer(unit, id, choice)
          if (normalizeTextbookAnswer(choice) === normalizeTextbookAnswer(item.answer)) setActiveId(null)
        }}><span className="qf01-option-content">{value(id, choice)}</span></button>)}
      </div>
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
