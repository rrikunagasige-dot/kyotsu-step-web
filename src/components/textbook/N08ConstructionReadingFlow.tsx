import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { InlineMath } from 'react-katex'
import { SemanticReading } from './SemanticReading'
import { TypesetFormula, TypesetInlineMath } from './TypesetFormula'
import { NumberedEquation } from './NumberedEquation'
import { ConstructionSlot } from './ConstructionSlot'
import { ConstructionPanel } from './ConstructionPanel'
import { projectConstructionGroup, projectConstructionInteraction, constructionExpressionLatex, type ConstructionFormula, type ConstructionFormulaPart, type ConstructionPresentation, type ConstructionCopy } from '../../domain/constructionReading'
import { answerTextbookConstruction, effectiveTextbookProgress, getTextbookChoices, isTextbookItemResolved, isTextbookInteractionResolved, type TextbookUnitProgress } from '../../domain/textbook'
import type { ConstructionProgress } from '../../domain/constructionProgress'
import type { TextbookItem, TextbookReadingBlock, TextbookReadingPart, TextbookSection, TextbookUnit } from '../../domain/textbookSchema'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'
import data from '../../data/textbook/math/numbers/n08Revision6.json'
import reading from '../../data/textbook/math/numbers/n08ConstructionPresentation.json'
import './n08-reading.css'
import './n08-solution-reading.css'
import './construction-reading.css'

type Props = { unit: TextbookUnit; section: TextbookSection; progress: TextbookUnitProgress | undefined; onSummaryReached?: (reached: boolean) => void; onReviewAnswer?: (item: TextbookItem, choice: string) => void }
type Node = typeof data.nodes[number]
type VisibleGroup = ReturnType<typeof projectConstructionGroup>
type ActivePart = { parentId: string; partId: string } | null
const presentation = reading as unknown as ConstructionPresentation
const roles: Record<string, string> = { example: '例題', definition: '定義', proof: '性質の導出', substep: '導出', check: '学んだことを使う', property: '性質', summary: 'まとめ' }
const partLabels: Record<string, string> = { coordinate: '座標', operand: '式の中に入れる数', rational: '計算した数', coefficient: '係数', 'unary-sign': '項全体に付く符号', 'binary-operation': '二つの項を結ぶ符号', 'signed-term': '先頭へ置く符号付きの項' }

/** Only mathematical cells determine the shared columns. Text and choice panels
 * never widen them. The fallback wraps only rows with a real left expression. */
function ConstructionEquationGroup({ id, number, rows, prose = [], renderParts, renderCopy, visibleState }: {
  id: string; number?: number; rows: { id: string; formula: ConstructionFormula; sourceNodeId: string }[]
  prose?: ConstructionCopy[] | VisibleGroup['layout']['prose']
  renderParts: (parts: ConstructionFormulaPart[]) => ReactNode
  renderCopy: (parts: readonly unknown[]) => ReactNode
  visibleState?: unknown
}) {
  const root = useRef<HTMLDivElement>(null)
  const lastMeasurement = useRef('')
  const [wrapped, setWrapped] = useState<string[]>([])
  useLayoutEffect(() => {
    const node = root.current
    if (!node) return
    let alive = true
    let frame: number | undefined
    const measure = () => {
      if (!alive || node.clientWidth < 1) return
      const actual = [...node.querySelectorAll<HTMLElement>('[data-construction-row]')]
      const size = (row: HTMLElement, cell: string) => row.querySelector<HTMLElement>(cell + ' > .construction-cell-content')?.scrollWidth ?? 0
      const widths = actual.map(row => ({ id: row.dataset.constructionRow!, left: size(row, '.construction-lhs'), relation: size(row, '.construction-relation'), right: size(row, '.construction-rhs') }))
      const max = (key: 'left' | 'relation' | 'right') => Math.max(0, ...widths.map(w => w[key]))
      const available = node.clientWidth, relation = max('relation'), right = max('right')
      const long = max('left') + relation + right + 8 > available ? widths.filter(w => w.left > 0).map(w => w.id) : []
      const left = Math.max(0, ...widths.filter(w => !long.includes(w.id)).map(w => w.left))
      const dimensions = { '--construction-body-width': available + 'px', '--construction-left': left + 'px', '--construction-relation': relation + 'px', '--construction-right': Math.min(right, Math.max(0, available - relation - left - 8)) + 'px' }
      let changed = false
      for (const [property, value] of Object.entries(dimensions)) if (node.style.getPropertyValue(property) !== value) { node.style.setProperty(property, value); changed = true }
      setWrapped(previous => previous.join('|') === long.join('|') ? previous : long)
      const signature = JSON.stringify({ available, widths, long, heights: actual.map(row => row.getBoundingClientRect().height) })
      if (changed || signature !== lastMeasurement.current) { lastMeasurement.current = signature; node.dispatchEvent(new Event('typeset-layout', { bubbles: true })) }
    }
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(() => { frame = undefined; measure() }) }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule)
    observer?.observe(node)
    void document.fonts?.ready.then(schedule)
    return () => { alive = false; if (frame !== undefined) cancelAnimationFrame(frame); observer?.disconnect() }
  }, [rows])
  const notes = (Array.isArray(prose) ? prose : []).filter((p): p is VisibleGroup['layout']['prose'][number] => 'role' in p && p.role === 'essential-note')
  const body = <div data-typeset-kind="construction" className="construction-math-scope"><div className="construction-math-grid typeset-formula-body">
    {rows.map(row => <div key={row.id} className="construction-row-scope">
      {notes.filter(p => p.rowRef === row.id && p.placement === 'before-row').map(p => <p key={p.id} className="construction-essential-note" data-prose-role="essential-note">{renderCopy(p.content)}</p>)}
      <div className={'construction-equation typeset-line' + (wrapped.includes(row.id) ? ' construction-equation--wrap' : '')}
        data-construction-row={row.id} data-source-node={row.sourceNodeId} data-node-id={row.sourceNodeId} data-construction-number-anchor={row.id === rows.at(-1)?.id ? 'true' : undefined}>
        <span className="construction-lhs"><span className="construction-cell-content">{renderParts(row.formula.left)}</span></span>
        <span className="construction-relation"><span className="construction-cell-content">{'relationSlot' in row.formula && row.formula.relationSlot ? renderParts([row.formula.relationSlot as ConstructionFormulaPart]) : row.formula.relation && <InlineMath math={row.formula.relation} />}</span></span>
        <span className="construction-rhs"><span className="construction-cell-content">{renderParts(row.formula.right)}</span></span>
      </div>
      {notes.filter(p => p.rowRef === row.id && p.placement === 'after-row').map(p => <p key={p.id} className="construction-essential-note" data-prose-role="essential-note">{renderCopy(p.content)}</p>)}
    </div>)}
  </div></div>
  return <div ref={root} className="construction-equation-group" data-construction-group={id} data-visible-state={visibleState ? JSON.stringify(visibleState) : undefined} data-number-row-ref={rows.at(-1)?.id}>
    {number !== undefined ? <NumberedEquation number={number} logical anchorSelector=".construction-equation">{body}</NumberedEquation> : body}
  </div>
}

export function N08ConstructionReadingFlow({ unit, section, progress, onSummaryReached, onReviewAnswer }: Props) {
  const { text } = useI18n()
  const answer = useAppStore(state => state.answerTextbook)
  const answerPart = useAppStore(state => state.answerConstruction)
  const baseProgress = effectiveTextbookProgress(unit, progress)
  const [previewConstructions, setPreviewConstructions] = useState<ConstructionProgress | undefined>()
  const current = onReviewAnswer && previewConstructions ? { ...baseProgress, constructionProgress: previewConstructions } as TextbookUnitProgress : baseProgress
  const constructions = unit.constructionItems ?? []
  const findConstruction = (id: string) => constructions.find(i => i.id === id)
  const resolved = (n: Node) => {
    if (!n.interaction) return true
    return isTextbookInteractionResolved(unit, current, n.interaction)
  }
  const first = data.nodes.findIndex(n => !resolved(n)), frontier = first < 0 ? data.nodes.length : first
  const closed = data.nodes.filter((n, i) => i < frontier && resolved(n))
  const solvedIds = closed.flatMap(n => n.interaction ? [n.interaction] : [])
  const drafts = Object.fromEntries(Object.entries(current?.constructionProgress ?? {}).map(([id, record]) => [id, record.draft]))
  const maxStage = first < 0 ? data.stages.length - 1 : data.stages.findIndex(s => s.id === data.nodes[first].stageId)
  const storageKey = 'math-textbook-compact-v1:' + unit.unitId + ':r6'
  const [cursor, setCursor] = useState(() => { const value = Number(window.localStorage.getItem(storageKey) ?? 0); return Number.isInteger(value) && value >= 0 ? Math.min(value, maxStage) : 0 })
  const [activePart, setActivePart] = useState<ActivePart>(null)
  const [activeLegacy, setActiveLegacy] = useState<string | null>(null)
  const [history, setHistory] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const [details, setDetails] = useState<Record<string, boolean>>({})
  const flow = useRef<HTMLDivElement>(null)
  const stageIndex = Math.min(cursor, maxStage), stage = data.stages[stageIndex]
  const stageNodes = data.nodes.filter(n => n.stageId === stage.id), complete = stageNodes.every(resolved)
  const problem = data.problemGroups.find(p => p.stages.includes(stage.id))!
  const focusNode = stageNodes.find(n => !resolved(n)) ?? stageNodes.at(-1)!
  const known = focusNode.knownRefs.flatMap(id => { const n = data.nodes.find(x => x.resultId === id); return n && data.nodes.indexOf(n) < frontier ? [n] : [] })
  const prior = data.nodes.filter(n => problem.stages.includes(n.stageId) && data.stages.findIndex(s => s.id === n.stageId) < stageIndex && resolved(n))
  useEffect(() => { window.localStorage.setItem(storageKey, String(stageIndex)) }, [stageIndex, storageKey])
  useEffect(() => { onSummaryReached?.(first < 0 && stageIndex === data.stages.length - 1) }, [first, stageIndex, onSummaryReached])

  function logical(source: string, id: string, pieces: readonly ReactNode[] = [], itemIds: Record<number, string> = {}) {
    const [left, relation, right] = source.split(/(\\(?:Rightarrow|Leftrightarrow))/)
    if (!right) return null
    return <span className="n08-logical-chain" data-logical-relation={relation} data-typeset-source={id}>
      <TypesetFormula source={left.trim().replace(/\\$/, '')} sourceId={id + '-left'} unitId={unit.unitId} parts={pieces} itemIds={itemIds} />
      <span className="n08-logical-arrow"><InlineMath math={relation === '\\Rightarrow' ? '\\Downarrow' : '\\Updownarrow'} /></span>
      <TypesetFormula source={right} sourceId={id + '-right'} unitId={unit.unitId} parts={pieces} itemIds={itemIds} />
    </span>
  }
  function semantic(parts: readonly unknown[] = []): ReactNode {
    return (parts as TextbookReadingPart[]).map((p, i) => p.type === 'math'
      ? <span key={p.semanticId ?? i}>{logical(p.latex, p.semanticId ?? 'n08-r6-inline-' + i) ?? <TypesetInlineMath latex={p.latex.replace(/\\\s+$/, '')} sourceId={p.semanticId ?? 'n08-r6-inline-' + i} unitId={unit.unitId} />}</span>
      : <SemanticReading key={p.semanticId ?? i} parts={[p]} renderChoice={legacyBlank} />)
  }
  function legacyBlank(id: string) {
    const item = section.items.find(i => i.id === id)
    if (!item) return null
    const record = current?.answers[id]
    if (isTextbookItemResolved(item, record)) { const node = data.nodes.find(n => n.interaction === id)!; const display = data.semanticDisplay[node.id as keyof typeof data.semanticDisplay]; return <span className="reading-inline-answer" data-testid={'resolved-' + id}>{semantic(display.choices[record!.value as keyof typeof display.choices])}</span> }
    return <button type="button" className={'reading-inline-blank' + (record ? ' reading-inline-blank--wrong' : '')} data-testid={'textbook-item-' + id}
      aria-label={item.prompt} aria-expanded={activeLegacy === id} aria-controls={'n08-panel-' + id} onClick={() => { setActiveLegacy(id); setActivePart(null) }}>{record ? text('もう一度', '再选一次') : text('選択', '选择')}</button>
  }
  function legacyPanel(id: string) {
    if (activeLegacy !== id) return null
    const item = section.items.find(i => i.id === id), node = data.nodes.find(n => n.interaction === id)
    if (!item || !node) return null
    const display = data.semanticDisplay[node.id as keyof typeof data.semanticDisplay]
    const record = current?.answers[id], wrong = record && !isTextbookItemResolved(item, record)
    return <div id={'n08-panel-' + id} className="reading-inline-choice-panel" data-testid={'inline-choice-panel-' + id}>
      <p>{item.prompt}</p>{wrong && <aside className="reading-choice-hint" data-testid={'textbook-hint-' + id}><strong>{text('もう一度考えよう', '再想一想')}</strong><span>{semantic(display.feedback[record.value as keyof typeof display.feedback])} {semantic(display.hintParts[0])}</span></aside>}
      <div className="reading-choice-options n08-choice-options" role="group" aria-label={item.prompt}>{getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).map((choice, index) => <button type="button" className="reading-choice-option" key={choice} aria-label={choice} data-testid={'textbook-choice-' + id + '-' + index}
        onClick={() => { if (onReviewAnswer) onReviewAnswer(item, choice); else answer(unit, id, choice); if (choice === item.answer || item.acceptedAnswers.includes(choice)) setActiveLegacy(null) }}>
        <span>{index + 1}</span><strong>{'choiceRows' in display && display.choiceRows && choice in display.choiceRows ? <span className="n08-choice-rows">{(display.choiceRows[choice as keyof typeof display.choiceRows] as TextbookReadingPart[][]).map((row, i) => <span key={i}>{semantic(row)}</span>)}</span> : semantic(display.choices[choice as keyof typeof display.choices])}</strong>
      </button>)}</div>
    </div>
  }
  function parts(items: ConstructionFormulaPart[]): ReactNode {
    return items.map((p, i) => {
      if (p.type === 'math') return <InlineMath key={i} math={p.latex} />
      if (p.type === 'fraction') return <span className="construction-fraction" key={i}><span>{parts(p.numerator)}</span><span>{parts(p.denominator)}</span></span>
      if (p.type === 'derived-slot') return <span key={p.id} className="construction-derived-slot" aria-label="選んだ項に応じて残る項が入ります" data-derived-slot={p.id} />
      const interaction = findConstruction(p.interactionRef)
      if (!interaction) return <span key={p.id} data-slot-id={p.id}>{legacyBlank(p.interactionRef)}</span>
      const partId = p.partId ?? p.id, part = interaction.parts.find(q => q.id === partId)!
      const record = current?.constructionProgress?.[interaction.id], choice = part.choices.find(c => c.value === record?.draft[partId])
      return <ConstructionSlot key={p.id} parentId={interaction.id} partId={partId} label={partLabels[part.role]} panelId={'construction-panel-' + partId}
        valueLatex={choice ? choice.expression ? constructionExpressionLatex(choice.expression) : choice.value : undefined}
        active={activePart?.partId === partId} wrong={Boolean(record && record.attemptCount > 0 && !isTextbookInteractionResolved(unit, current, interaction.id))}
        onActivate={() => { setActivePart({ parentId: interaction.id, partId }); setActiveLegacy(null) }} />
    })
  }
  function constructionPanel(parentId: string) {
    if (activePart?.parentId !== parentId) return null
    const i = findConstruction(parentId)!, part = i.parts.find(p => p.id === activePart.partId)!, record = current?.constructionProgress?.[parentId]
    if (isTextbookInteractionResolved(unit, current, parentId)) return null
    return <ConstructionPanel parentId={parentId} partId={part.id} label={partLabels[part.role]}
      choices={part.choices.map(c => ({ value: c.value, latex: c.expression ? constructionExpressionLatex(c.expression) : c.value }))}
      value={record?.draft[part.id]} wrong={Boolean(record && record.attemptCount > 0 && !isTextbookInteractionResolved(unit, current, parentId))}
      feedback={i.gradingPurpose === 'specified-order' ? '値は変わりません。正の項を先に置く指定を確かめます。' : '前の式と、今選んだ数や符号を照らし合わせます。'}
      onSelect={value => {
        const eventId = crypto.randomUUID()
        let updated: TextbookUnitProgress | undefined
        if (onReviewAnswer) { updated = answerTextbookConstruction(current, unit, parentId, part.id, value, eventId, Date.now()); setPreviewConstructions(updated?.constructionProgress) }
        else { answerPart(unit, parentId, part.id, value, eventId); updated = useAppStore.getState().textbookProgress[unit.unitId] }
        if (isTextbookInteractionResolved(unit, updated, parentId)) setActivePart(null)
        else { const missing = i.parts.find(p => !Object.hasOwn(updated?.constructionProgress?.[parentId]?.draft ?? {}, p.id)); if (missing) setActivePart({ parentId, partId: missing.id }) }
      }} />
  }
  function renderBlock(raw: unknown) {
    const block = raw as TextbookReadingBlock
    if (block.type !== 'paragraph' && block.type !== 'formula') return null
    const choices = [...new Set(block.parts.flatMap(p => p.type === 'choice' ? [p.itemId] : []))]
    if (block.type === 'paragraph') return <div key={block.id}><p className="reading-paragraph" data-block-id={block.id}>{semantic(block.parts)}</p>{choices.map(legacyPanel)}</div>
    const source = block.parts.map((p, i) => p.type === 'math' ? p.latex : p.type === 'choice' ? '§' + i + '§' : '\\text{' + p.text + '}').join('')
    const itemIds = Object.fromEntries(block.parts.flatMap((p, i) => p.type === 'choice' ? [[i, p.itemId]] : []))
    const mathParts = block.parts.map((p, i) => <span key={i}>{p.type === 'math' ? <InlineMath math={p.latex} /> : p.type === 'choice' ? legacyBlank(p.itemId) : p.type === 'term' ? <strong>{p.text}</strong> : p.text}</span>)
    const number = (data.equationNumbers as Record<string, number>)[block.id]
    const body = logical(source, block.id, mathParts, itemIds) ?? <TypesetFormula source={source} sourceId={block.id} unitId={unit.unitId} parts={mathParts} itemIds={itemIds} />
    return <div key={block.id} data-block-id={block.id}>{number === undefined ? body : <NumberedEquation number={number} logical>{body}</NumberedEquation>}{choices.map(legacyPanel)}</div>
  }
  function after(n: Node) {
    const compiled = data.semantic.nodes.find(x => x.id === n.id)!
    if (n.id !== 'n08-cases') return compiled.after.map(renderBlock)
    const source = compiled.after[0].parts as TextbookReadingPart[], math = source.filter(p => p.type === 'math')
    const tail = source.slice(source.lastIndexOf(math.at(-1)!) + 1).map(p => p.type === 'text' ? { ...p, text: p.text.replace(/^\s*です。/, '') } : p)
    return <><table className="n08-cases-table" data-testid="n08-cases-table"><caption>絶対値を外す場合分け</caption><thead><tr><th scope="col">中身の条件</th><th scope="col">絶対値を外した式</th></tr></thead><tbody>
      <tr><td>{semantic(math.slice(0, 1))}</td><td>{semantic(math.slice(1, 2))}</td></tr><tr><td>{semantic(math.slice(2, 3))}</td><td>{semantic(math.slice(3, 4))}</td></tr>
    </tbody></table><p className="reading-paragraph">{semantic(tail)}</p></>
  }
  function result(n: Node) {
    const compiled = data.semantic.nodes.find(x => x.id === n.id)!, construction = n.interaction && findConstruction(n.interaction)
    return <div key={n.resultId} className="n08-result math-textbook-stage-reference-content" data-result-source={n.resultId}><strong>{n.goal}</strong>
      {construction ? <><ConstructionEquationGroup id={'result-' + n.id} rows={[{ id: n.id + '-result', sourceNodeId: n.id, formula: projectConstructionInteraction(construction, {}, { solved: true }).formula }]} renderParts={parts} renderCopy={semantic} />{compiled.after.filter(b => b.type === 'paragraph').map(renderBlock)}</> : after(n)}
    </div>
  }
  function standalone(n: Node, past = false) {
    const compiled = data.semantic.nodes.find(x => x.id === n.id)!, done = past || resolved(n), c = n.interaction && findConstruction(n.interaction)
    if (c) {
      const record = current?.constructionProgress?.[c.id], view = projectConstructionInteraction(c, record?.draft, { solved: done, editableParts: !done })
      const number = [...compiled.before, ...compiled.after].map(b => (data.equationNumbers as Record<string, number>)[b.id]).find(x => x !== undefined)
      return <div key={n.id} className="n08-thinking-step construction-single" data-node-id={n.id} data-visible-state={JSON.stringify(view)}>
        <div className="n08-step-caption"><span>{roles[n.role]}</span><strong>{n.goal}</strong></div>
        {compiled.before.filter(b => b.type === 'paragraph').map(renderBlock)}
        <ConstructionEquationGroup id={c.id} number={number} rows={[{ id: n.id, sourceNodeId: n.id, formula: view.formula }]} renderParts={parts} renderCopy={semantic} visibleState={view} />
        {!done && <p className="construction-active-prompt" data-prose-role="active-prompt">{c.activePrompt}</p>}{constructionPanel(c.id)}
        {done && compiled.after.filter(b => b.type === 'paragraph').map(renderBlock)}
      </div>
    }
    const before = done ? compiled.before.filter(b => !b.parts?.some(p => p.type === 'choice')) : compiled.before
    return <div className="n08-thinking-step" data-node-id={n.id} key={n.id}><div className="n08-step-caption"><span>{roles[n.role]}</span><strong>{n.goal}</strong></div>{before.map(renderBlock)}{done && (n.id === 'n08-q04-substitute' ? compiled.after.filter(b => b.type === 'paragraph').map(renderBlock) : after(n))}</div>
  }
  function groupView(id: string, detailOpen = false) { return projectConstructionGroup(presentation, id, { solvedIds, drafts, boundarySolvedNodeIds: closed.map(n => n.id), detailOpen }) }
  function group(id: string) {
    const view = groupView(id, details[id])
    if (!view.rows.length) return null
    const currentId = view.rows.find(r => r.current)?.current?.id
    const publicView = { ...view, rows: view.rows.map(r => ({ ...r, current: r.current ? { ...r.current, ...('choices' in r.current && activeLegacy !== r.current.id ? { choices: undefined } : {}) } : null })) }
    return <div className="construction-reading-group" key={id} data-node-id={view.rows[0].sourceNodeId} data-visible-state={JSON.stringify(publicView)}>
      {view.layout.prose.filter(p => p.role === 'group-lead').map(p => <p key={p.id} className="construction-group-lead" data-prose-role={p.role}>{semantic(p.content)}</p>)}
      <ConstructionEquationGroup id={id} number={view.number} rows={view.rows} prose={view.layout.prose} renderParts={parts} renderCopy={semantic} visibleState={publicView} />
      {view.layout.prose.filter(p => p.role === 'active-prompt').map(p => <p key={p.id} className="construction-active-prompt" data-prose-role={p.role}>{semantic(p.content)}</p>)}
      {currentId && (findConstruction(currentId) ? constructionPanel(currentId) : legacyPanel(currentId))}
      {view.layout.prose.filter(p => p.role === 'interpretation').map(p => <p key={p.id} className="construction-interpretation" data-prose-role={p.role}>{semantic(p.content)}</p>)}
      {view.layout.detailAvailable && <details className="construction-full-explanation" open={Boolean(details[id])} onToggle={e => { const open = e.currentTarget.open; setDetails(previous => previous[id] === open ? previous : { ...previous, [id]: open }) }}><summary>説明を詳しく見る</summary>{view.layout.prose.filter(p => p.role === 'detail').map(p => <p key={p.id}>{semantic(p.content)}</p>)}</details>}
    </div>
  }
  function renderNodes(nodes: Node[], past = false) {
    const emitted = new Set<string>()
    return nodes.map(n => { const design = presentation.groups.find(g => g.sourceNodeIds.includes(n.id)); if (!design) return standalone(n, past); if (emitted.has(design.id)) return null; emitted.add(design.id); return group(design.id) })
  }
  const figure = section.figures[0]
  const originalFigure = () => <figure className="n08-figure"><img src={import.meta.env.BASE_URL + figure.src.replace(/^\//, '')} alt={figure.alt} /><figcaption>{figure.caption}</figcaption></figure>
  return <div ref={flow} className="textbook-reading-flow n08-reading n08-construction-reading" data-n08-revision="6" data-typeset-theme="true" data-testid="textbook-reading-flow" tabIndex={-1}>
    <p className="n08-version-link"><Link to={'/learning/textbook/' + unit.unitId + '?version=5'}>以前のN08を見比べる</Link> · <Link to={'/learning/textbook/' + unit.unitId + '?version=5&layout=original'}>変更前の表示を見る</Link> · <Link to={'/learning/textbook/' + unit.unitId + '?version=4'}>第4版</Link></p>
    <div className="math-textbook-reading-controls"><span>{text('今の段階', '当前阶段')} {stageIndex + 1} / {data.stages.length}</span>{stageIndex > 0 && <button type="button" data-testid="n08-history-toggle" onClick={() => setHistory(x => !x)}>{history ? text('履歴を閉じる', '收起记录') : text('前の段階を見る', '查看之前的阶段')}</button>}</div>
    {history && <div className="n08-history"><button type="button" onClick={() => setExpandAll(x => !x)}>{expandAll ? '全文を閉じる' : '全文を開く'}</button>{data.stages.slice(0, stageIndex).map((s, i) => { const previous = data.nodes.filter(n => n.stageId === s.id); return <section className="first-theme-recorded-results" key={s.id}><h3>{i + 1}. {s.title}</h3>{result(previous.at(-1)!)}<details open={expandAll || undefined}><summary>全文を見る</summary>{i === 0 && originalFigure()}{renderNodes(previous, true)}</details></section> })}</div>}
    <section className="math-textbook-stage math-textbook-stage--current" data-testid={'math-textbook-stage-' + stage.id}>
      <div className="n08-source-question" data-testid="n08-source-question" data-problem-id={problem.id}><strong>今解いている問題</strong><TypesetFormula source={problem.root} sourceId={problem.id + '-root'} unitId={unit.unitId} /><p>{problem.goal}</p>{'givens' in problem && problem.givens && <p>与えられた値：<TypesetInlineMath latex={problem.givens} sourceId={problem.id + '-given'} unitId={unit.unitId} /></p>}</div>
      <header className="math-textbook-stage-active-title"><strong>{stage.title}</strong><small>{stageIndex + 1} / {data.stages.length}</small></header>
      {stageIndex === 0 && originalFigure()}{stageIndex > 0 && stageIndex < 4 && <details><summary>元の数直線を見る</summary>{originalFigure()}</details>}
      {prior.length > 0 && <details className="n08-problem-record" open data-testid="n08-problem-record"><summary>この問題でここまで分かったこと</summary>{prior.map(n => { const design = presentation.groups.find(g => g.sourceNodeIds.includes(n.id)); if (design && design.sourceNodeIds.at(-1) !== n.id) return null; if (design) { const v = groupView(design.id), last = v.rows.at(-1), root = v.rows[0]; const formula = last && root && design.kind === 'expression-chain' ? { ...last.formula, left: root.formula.left.length ? root.formula.left : root.formula.right } : last?.formula; return last && formula ? <div key={n.id} data-result-source={n.resultId}><strong>{n.goal}</strong><ConstructionEquationGroup id={'prior-' + design.id} rows={[{ ...last, formula }]} renderParts={parts} renderCopy={semantic} /></div> : null } return result(n) })}</details>}
      {known.length > 0 && <aside className="math-textbook-stage-references" data-testid="math-textbook-stage-references"><strong>使う条件・前の結果</strong>{known.map(result)}</aside>}
      {renderNodes(stageNodes.filter(n => data.nodes.indexOf(n) <= frontier))}
      {complete && stageIndex < data.stages.length - 1 && <button type="button" className="math-textbook-next-stage" data-testid="math-textbook-next-stage" onClick={() => { setCursor(stageIndex + 1); setActivePart(null); setActiveLegacy(null); setHistory(false); setExpandAll(false); requestAnimationFrame(() => { flow.current?.focus({ preventScroll: true }); flow.current?.scrollIntoView({ block: 'start' }) }) }}>次へ</button>}
      {first < 0 && stageIndex === data.stages.length - 1 && <p data-testid="n08-complete">ここまでの学習を終えました。</p>}
    </section>
  </div>
}
