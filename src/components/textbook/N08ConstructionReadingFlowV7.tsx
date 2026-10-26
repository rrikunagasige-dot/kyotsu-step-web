import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { InlineMath } from 'react-katex'
import { SemanticReading } from './SemanticReading'
import { TypesetFormula, TypesetInlineMath } from './TypesetFormula'
import { ConstructionMathRow, NeutralFrameProbe, type NeutralFramePlan } from './ConstructionMathRow'
import { buildNeutralFramePlan } from './axisEnvelopePlan'
import type { FrameEnvelope } from './axisGeometry'
import { MathAxisSlot } from './MathAxisSlot'
import { SourceRegionChoice } from './SourceRegionChoice'
import { sourceRegionLabel } from './sourceRegion'
import { projectConstructionInteractionV2, type ConstructionTokenV2, type ConstructionViewV2, type ConstructionInteractionV2 } from '../../domain/constructionReadingV2'
import { projectConstructionInteraction, constructionExpressionLatex, type ConstructionFormulaPart, type ConstructionPresentation, type ConstructionCopy } from '../../domain/constructionReading'
import { answerTextbookConstruction, answerTextbookConstructionV2, effectiveTextbookProgress, getTextbookChoices, isTextbookItemResolved, isTextbookInteractionResolved, type TextbookUnitProgress } from '../../domain/textbook'
import type { TextbookItem, TextbookReadingBlock, TextbookReadingPart, TextbookSection, TextbookUnit } from '../../domain/textbookSchema'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'
import data from '../../data/textbook/math/numbers/n08Revision7.json'
import reading from '../../data/textbook/math/numbers/n08ConstructionPresentationR7.json'
import './n08-reading.css'
import './n08-solution-reading.css'
import './construction-math-axis.css'

type Props = { unit: TextbookUnit; section: TextbookSection; progress: TextbookUnitProgress | undefined; onSummaryReached?: (reached: boolean) => void; onReviewAnswer?: (item: TextbookItem, choice: string) => void }
type Node = typeof data.nodes[number]
type ActivePart = { parentId: string; partId: string } | null
const presentation = reading as unknown as ConstructionPresentation
type UiFormula = { left: UiToken[]; relation: string; relationSlot?: UiToken; right: UiToken[] }
type UiToken = ConstructionFormulaPart | ConstructionTokenV2

function ConstructionEquationGroup({ id, number, rows, renderParts, visibleState, plan }: { id: string; number?: number; rows: { id: string; sourceNodeId: string; formula: UiFormula; before?: ReactNode; after?: ReactNode; continuation?: boolean }[]; renderParts: (parts: UiToken[]) => ReactNode; renderCopy?: (parts: readonly unknown[]) => ReactNode; prose?: unknown; visibleState?: unknown; plan: NeutralFramePlan }) {
  const [envelope, setEnvelope] = useState<FrameEnvelope | null>(null)
  const measured = useCallback((next: FrameEnvelope) => setEnvelope(old => old && old.id === next.id && old.leftPx === next.leftPx && old.rightPx === next.rightPx && old.relationPx === next.relationPx ? old : next), [])
  return <><NeutralFrameProbe plan={plan} onMeasure={measured} />{envelope && <ConstructionMathRow id={id} number={number} envelope={envelope} visibleState={visibleState} rows={rows.map(row => ({ ...row, left: renderParts(row.formula.left), relation: row.formula.relationSlot ? renderParts([row.formula.relationSlot]) : <InlineMath math={row.formula.relation} />, right: renderParts(row.formula.right), hasSlots: JSON.stringify(row.formula).includes('"type":"slot"') }))} />}</>
}
const roles: Record<string, string> = { example: '例題', definition: '定義', proof: '性質の導出', substep: '導出', check: '学んだことを使う', property: '性質', summary: 'まとめ' }
const partLabels: Record<string, string> = { coordinate: '座標', operand: '式の中に入れる数', rational: '計算した数', coefficient: '係数', 'unary-sign': '項全体に付く符号', 'binary-operation': '二つの項を結ぶ符号', 'signed-term': '先頭へ置く符号付きの項', relation: '大小や等しさを表す記号', meaning: '符号の意味', 'bound-subtree-reference': '中身全体' }

export function N08ConstructionReadingFlowV7({ unit, section, progress, onSummaryReached, onReviewAnswer }: Props) {
  const { text } = useI18n()
  const answer = useAppStore(state => state.answerTextbook)
  const answerPart = useAppStore(state => state.answerConstruction)
  const answerPartV2 = useAppStore(state => state.answerConstructionV2)
  const baseProgress = effectiveTextbookProgress(unit, progress)
  const [previewProgress, setPreviewProgress] = useState<TextbookUnitProgress | undefined>()
  const current = onReviewAnswer ? previewProgress ?? baseProgress : baseProgress
  const constructions = unit.constructionItems ?? []
  const constructionsV2 = (unit as TextbookUnit & { constructionItemsV2?: ConstructionInteractionV2[] }).constructionItemsV2 ?? []
  const findV2 = (id: string) => constructionsV2.find(i => i.id === id)
  const findConstruction = (id: string) => constructions.find(i => i.id === id)
  const resolved = (n: Node) => {
    if (!n.interaction) return true
    return isTextbookInteractionResolved(unit, current, n.interaction)
  }
  const first = data.nodes.findIndex(n => !resolved(n)), frontier = first < 0 ? data.nodes.length : first
  const closed = data.nodes.filter((n, i) => i < frontier && resolved(n))
  const solvedIds = closed.flatMap(n => n.interaction ? [n.interaction] : [])
  const maxStage = first < 0 ? data.stages.length - 1 : data.stages.findIndex(s => s.id === data.nodes[first].stageId)
  const storageKey = 'math-textbook-compact-v1:' + unit.unitId + ':r7'
  const [cursor, setCursor] = useState(() => { const value = Number(window.localStorage.getItem(storageKey) ?? 0); return Number.isInteger(value) && value >= 0 ? Math.min(value, maxStage) : 0 })
  const [activePart, setActivePart] = useState<ActivePart>(null)
  const [activeLegacy, setActiveLegacy] = useState<string | null>(null)
  const [history, setHistory] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
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
      ? <span key={p.semanticId ?? i}>{logical(p.latex, p.semanticId ?? 'n08-r7-inline-' + i) ?? <TypesetInlineMath latex={p.latex.replace(/\\\s+$/, '')} sourceId={p.semanticId ?? 'n08-r7-inline-' + i} unitId={unit.unitId} />}</span>
      : <SemanticReading key={p.semanticId ?? i} parts={[p]} renderChoice={legacyBlank} />)
  }
  function legacyBlank(id: string) {
    const item = section.items.find(i => i.id === id)
    if (!item) return null
    const record = current?.answers?.[id]
    if (isTextbookItemResolved(item, record)) { const node = data.nodes.find(n => n.interaction === id)!; const display = data.semanticDisplay[node.id as keyof typeof data.semanticDisplay]; return <span className="reading-inline-answer" data-testid={'resolved-' + id}>{semantic(display.choices[record!.value as keyof typeof display.choices])}</span> }
    const meaning = getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).some(c => /[ぁ-んァ-ン一-龥]/.test(c))
    if (meaning) return <button type="button" className="axis-prose-control" data-testid={'textbook-item-' + id} data-part-id={id} onClick={() => { setActiveLegacy(id); setActivePart(null) }}>{record?.value ?? text('選択', '选择')}</button>
    return <span data-testid={'textbook-item-' + id}><MathAxisSlot parentId={id} partId={id} label={item.prompt} panelId={'n08-panel-' + id} valueLatex={record?.value} active={activeLegacy === id} wrong={Boolean(record)} onActivate={() => { setActiveLegacy(id); setActivePart(null) }} /></span>
  }
  function legacyPanel(id: string) {
    if (activeLegacy !== id) return null
    const item = section.items.find(i => i.id === id), node = data.nodes.find(n => n.interaction === id)
    if (!item || !node) return null
    const display = data.semanticDisplay[node.id as keyof typeof data.semanticDisplay]
    const record = current?.answers?.[id], wrong = record && !isTextbookItemResolved(item, record)
    return <div key={id} id={'n08-panel-' + id} className="reading-inline-choice-panel" data-testid={'inline-choice-panel-' + id}>
      <p>{item.prompt}</p>{wrong && <aside className="reading-choice-hint" data-testid={'textbook-hint-' + id}><strong>{text('もう一度考えよう', '再想一想')}</strong><span>{semantic(display.feedback[record.value as keyof typeof display.feedback])} {semantic(display.hintParts[0])}</span></aside>}
      <div className="axis-choice-list" role="group" aria-label={item.prompt}>{getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).map((choice, index) => <button type="button" className="reading-choice-option" key={choice} aria-label={choice} data-testid={'textbook-choice-' + id + '-' + index} data-choice-id={id + '::choice-' + index}
        onClick={() => { if (onReviewAnswer) onReviewAnswer(item, choice); else answer(unit, id, choice); if (choice === item.answer || item.acceptedAnswers.includes(choice)) setActiveLegacy(null) }}>
        <span>{index + 1}</span><strong>{'choiceRows' in display && display.choiceRows && choice in display.choiceRows ? <span className="n08-choice-rows">{(display.choiceRows[choice as keyof typeof display.choiceRows] as TextbookReadingPart[][]).map((row, i) => <span key={i}>{semantic(row)}</span>)}</span> : semantic(display.choices[choice as keyof typeof display.choices])}</strong>
      </button>)}</div>
    </div>
  }
  function v2View(i: ConstructionInteractionV2): ConstructionViewV2 {
    return projectConstructionInteractionV2(i, current?.constructionProgressV2?.[i.id]?.draft ?? {}, { solvedInteractionIds: solvedIds, availableSourceNodeIds: closed.map(n => n.id) })
  }
  function parts(items: UiToken[]): ReactNode {
    return items.map((p, index) => {
      if (p.type === 'math') return <InlineMath key={index} math={p.latex} />
      if (p.type === 'text') return <span key={index}>{p.text}</span>
      if (p.type === 'mirror') return null // domain projection must resolve mirrors to typed math
      if (p.type === 'fraction') return <span className="axis-fraction" key={index}><span>{parts(p.numerator)}</span><span>{parts(p.denominator)}</span></span>
      if (p.type === 'derived-slot') return <span key={p.id} className="construction-derived-slot" data-derived-slot={p.id} />
      const v2 = findV2(p.interactionRef)
      const interaction = findConstruction(p.interactionRef)
      if (!interaction && !v2) return <span key={p.id}>{legacyBlank(p.interactionRef)}</span>
      const partId = p.partId ?? p.id, record = v2 ? current?.constructionProgressV2?.[p.interactionRef] : current?.constructionProgress?.[p.interactionRef]
      const part = v2 ? v2View(v2).parts.find(part => part.id === partId) : interaction!.parts.find(part => part.id === partId)
      if (!part) return null
      const v2Part = v2 ? part as ConstructionViewV2['parts'][number] : null
      const choice = v2 ? v2Part!.choices.find(c => c.id === record?.draft[partId]) : interaction!.parts.find(p => p.id === partId)!.choices.find(c => c.value === record?.draft[partId])
      const valueLatex = choice ? 'displayLatex' in choice && choice.displayLatex ? String(choice.displayLatex) : choice.expression ? constructionExpressionLatex(choice.expression) : choice.value : undefined
      if (v2 && v2View(v2).correct && part.role === 'unary-sign' && choice?.value === '+') return null
      if (v2 && v2View(v2).correct && choice) return part.role === 'meaning' ? <span key={p.id}>{choice.value}</span> : <InlineMath key={p.id} math={valueLatex!} />
      const activate = () => { setActivePart({ parentId: p.interactionRef, partId }); setActiveLegacy(null) }
      if (part.role === 'meaning') return <button type="button" className="axis-prose-control" key={partId} data-testid={'construction-part-' + partId} data-part-id={partId} aria-expanded={activePart?.partId === partId} aria-controls={'construction-panel-' + partId} onClick={activate}>{choice?.value ?? '選択'}</button>
      return <MathAxisSlot key={p.id} parentId={p.interactionRef} partId={partId} label={partLabels[part.role]} panelId={'construction-panel-' + partId}
        valueLatex={valueLatex} active={activePart?.partId === partId} editable={v2Part?.editable ?? true}
        wrong={v2Part ? v2Part.choiceId !== undefined && !v2Part.correct : Boolean(record && record.attemptCount > 0 && !isTextbookInteractionResolved(unit, current, p.interactionRef))} onActivate={activate} />
    })
  }
  function constructionPanel(parentId: string) {
    if (activePart?.parentId !== parentId) return null
    const v2 = findV2(parentId), i = findConstruction(parentId), record = v2 ? current?.constructionProgressV2?.[parentId] : current?.constructionProgress?.[parentId]
    const view = v2 ? v2View(v2) : null
    const part = v2 ? view!.parts.find(p => p.id === activePart.partId && p.editable) : i?.parts.find(p => p.id === activePart.partId)
    if (!part || isTextbookInteractionResolved(unit, current, parentId)) return null
    const choices = part.choices.map(c => ({ id: 'id' in c ? String(c.id) : c.value, value: c.value, latex: 'displayLatex' in c && c.displayLatex ? String(c.displayLatex) : c.expression ? constructionExpressionLatex(c.expression) : c.value }))
    const selected = record?.draft[part.id]
    const wrong = v2 ? Boolean(selected && !view!.parts.find(p => p.id === part.id)?.correct) : Boolean(record && record.attemptCount > 0 && !isTextbookInteractionResolved(unit, current, parentId))
    return <div className="axis-choice-panel" id={'construction-panel-' + part.id} data-testid={'construction-panel-' + part.id}>
      <p>{'prompt' in part ? String(part.prompt) : i!.activePrompt}</p>{wrong && <p role="status">{'visibleFeedback' in part ? String(part.visibleFeedback) : '前の式と、選んだ数や符号を照らし合わせます。'}</p>}
      <div className="axis-choice-list" role="group" aria-label={partLabels[part.role]}>{choices.map((choice, index) => <button type="button" key={choice.id} data-testid={'construction-choice-' + part.id + '-' + index} data-choice-id={choice.id} aria-label={part.role === 'bound-subtree-reference' && v2 ? sourceRegionLabel(v2, choice.value) : choice.value} onClick={() => {
        const eventId = crypto.randomUUID(), submitted = v2 ? choice.id : choice.value
        let updated: TextbookUnitProgress | undefined
        if (onReviewAnswer) { updated = v2 ? answerTextbookConstructionV2(current, unit, parentId, part.id, submitted, eventId, Date.now()) : answerTextbookConstruction(current, unit, parentId, part.id, submitted, eventId, Date.now()); setPreviewProgress(updated) }
        else { if (v2) answerPartV2(unit, parentId, part.id, submitted, eventId); else answerPart(unit, parentId, part.id, submitted, eventId); updated = useAppStore.getState().textbookProgress[unit.unitId] }
        if (isTextbookInteractionResolved(unit, updated, parentId)) setActivePart(null)
        else if (v2) { const next = projectConstructionInteractionV2(v2, updated?.constructionProgressV2?.[parentId]?.draft ?? {}, { solvedInteractionIds: solvedIds }); setActivePart(next.currentPartId ? { parentId, partId: next.currentPartId } : null) }
        else { const next = i!.parts.find(p => !Object.hasOwn(updated?.constructionProgress?.[parentId]?.draft ?? {}, p.id)); if (next) setActivePart({ parentId, partId: next.id }) }
      }}><span>{index + 1}</span><strong>{part.role === 'meaning' ? choice.value : part.role === 'bound-subtree-reference' && v2 ? <SourceRegionChoice interaction={v2} subtreeRef={choice.value} /> : <InlineMath math={choice.latex} />}</strong></button>)}</div>
    </div>
  }
  function formulaForBlock(block: TextbookReadingBlock): UiFormula {
    const left: UiToken[] = [], right: UiToken[] = []
    let relation = '', destination = left
    for (const p of ('parts' in block ? block.parts : [])) {
      if (p.type === 'choice') { destination.push({ type: 'slot', id: p.itemId, partId: p.itemId, interactionRef: p.itemId }); continue }
      if (p.type !== 'math') continue
      const match = !relation && p.latex.match(/(\\(?:leq?|geq?)|[=<>])/)
      if (match && match.index !== undefined) {
        if (match.index) destination.push({ type: 'math', latex: p.latex.slice(0, match.index) })
        relation = match[0]; destination = right
        if (p.latex.slice(match.index + match[0].length)) destination.push({ type: 'math', latex: p.latex.slice(match.index + match[0].length) })
      } else destination.push({ type: 'math', latex: p.latex })
    }
    return relation ? { left, relation, right } : { left: [], relation: '', right: left }
  }
  function candidates() {
    const pool: Record<string, string[]> = {}
    for (const i of constructions) for (const p of i.parts) pool[p.id] = p.choices.map(c => c.expression ? constructionExpressionLatex(c.expression) : c.value)
    for (const i of constructionsV2) for (const p of i.parts) if (p.role !== 'meaning') pool[p.id] = p.choices.map(c => c.displayLatex ?? (c.expression ? constructionExpressionLatex(c.expression) : c.value))
    for (const item of section.items) pool[item.id] = getTextbookChoices(unit, { ...item, scaffoldLevel: 'light' }).filter(c => !/[ぁ-んァ-ン一-龥]/.test(c))
    return pool
  }
  function planForNodes(id: string, nodeIds: string[], extra: UiFormula[] = []) {
    const formulas: UiFormula[] = [...extra]
    for (const nodeId of nodeIds) {
      const n = data.nodes.find(n => n.id === nodeId)!, v2 = n.interaction && findV2(n.interaction), v1 = n.interaction && findConstruction(n.interaction)
      if (v2) formulas.push(...v2.steps.flatMap(step => step.formula ? [step.formula] : []))
      else if (v1) formulas.push(projectConstructionInteraction(v1, {}, { editableParts: true }).formula)
      else { const source = data.semantic.nodes.find(x => x.id === nodeId); for (const b of source?.before ?? []) if (b.type === 'formula') formulas.push(formulaForBlock(b as TextbookReadingBlock)) }
    }
    return buildNeutralFramePlan(id, formulas.length ? formulas : [{ left: [], relation: '=', right: [{ type: 'math', latex: '0' }] }], candidates())
  }
  function renderBlock(raw: unknown) {
    const block = raw as TextbookReadingBlock
    if (block.type !== 'paragraph' && block.type !== 'formula') return null
    const choices = [...new Set(block.parts.flatMap(p => p.type === 'choice' ? [p.itemId] : []))]
    if (block.type === 'paragraph') return <div key={block.id}><p className="reading-paragraph" data-block-id={block.id}>{semantic(block.parts)}</p>{choices.map(legacyPanel)}</div>
    const formula = formulaForBlock(block)
    const number = (data.equationNumbers as Record<string, number>)[block.id]
    const node = data.semantic.nodes.find(n => [...n.before, ...n.after].some(b => b.id === block.id))
    return <div key={block.id} data-block-id={block.id}><ConstructionEquationGroup id={block.id} number={number} rows={[{ id: block.id, sourceNodeId: node?.id ?? block.id, formula }]} plan={planForNodes(block.id, node ? [node.id] : [], [formula])} renderParts={parts} />{choices.map(legacyPanel)}</div>
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
  const designFor = (id: string) => (reading.nodeDesign as unknown as { nodeId: string; leadParts?: ConstructionCopy[]; status: string; finalConclusion?: string; terminalRecord?: { formulas: UiFormula[]; conditions: ConstructionCopy[]; prose: ConstructionCopy[] }; interpretationParts?: ConstructionCopy[] }[]).find(d => d.nodeId === id)
  function publicV2(view: ConstructionViewV2) { return { rows: view.rows, parts: view.parts.map(p => ({ id: p.id, role: p.role, value: p.value, choiceId: p.choiceId, editable: p.editable })), currentPartId: view.currentPartId, complete: view.complete, correct: view.correct, numberRowRef: view.numberRowRef, blockedReason: view.blockedReason } }
  function numberFor(n: Node) { const source = data.semantic.nodes.find(x => x.id === n.id)!; return [...source.before, ...source.after].map(b => (data.equationNumbers as Record<string, number>)[b.id]).find(x => x !== undefined) }
  function result(n: Node) {
    const source = data.semantic.nodes.find(x => x.id === n.id)!, c = n.interaction && findConstruction(n.interaction), v2 = n.interaction && findV2(n.interaction)
    if (n.id === 'n08-cases') return <div key={n.resultId} className="n08-result math-textbook-stage-reference-content" data-result-source={n.resultId}><strong>{n.goal}</strong>{after(n)}</div>
    const record = designFor(n.id)?.terminalRecord
    if (record) return <div className="n08-result math-textbook-stage-reference-content" key={n.resultId} data-result-source={n.resultId} data-record-status="VERIFIED"><strong>{n.goal}</strong>{record.conditions.length > 0 && <p className="reading-paragraph">条件：{semantic(record.conditions)}</p>}{record.formulas.length > 0 && <ConstructionEquationGroup id={'record-' + n.id} rows={record.formulas.map((formula,index)=>({id:n.id+'-record-'+index,sourceNodeId:n.id,formula}))} plan={buildNeutralFramePlan('record-' + n.id,record.formulas,candidates())} renderParts={parts} />}{record.prose.length > 0 && <p className="reading-paragraph">{semantic(record.prose)}</p>}</div>
    if (v2) return <div key={n.resultId} data-result-source={n.resultId} data-record-status="UNVERIFIED"><strong>{n.goal}</strong></div>
    return <div key={n.resultId} className="n08-result math-textbook-stage-reference-content" data-result-source={n.resultId}><strong>{n.goal}</strong>
      {c ? <><ConstructionEquationGroup id={'result-' + n.id} rows={[{ id: n.id + '-result', sourceNodeId: n.id, formula: projectConstructionInteraction(c, {}, { solved: true }).formula }]} plan={planForNodes('result-' + n.id, [n.id])} renderParts={parts} />{source.after.filter(b => b.type === 'paragraph').map(renderBlock)}</> : after(n)}
    </div>
  }
  function standalone(n: Node, past = false) {
    const source = data.semantic.nodes.find(x => x.id === n.id)!, done = past || resolved(n), c = n.interaction && findConstruction(n.interaction), v2 = n.interaction && findV2(n.interaction)
    if (v2) {
      const view = v2View(v2), design = designFor(n.id), mathematical = view.rows.flatMap(row => row.formula ? [{ id: row.id, sourceNodeId: n.id, formula: row.formula, after: row.prose ? <p className="axis-note">{parts(row.prose)}</p> : null, continuation: !row.formula.left.length }] : [])
      return <div key={n.id} className="n08-thinking-step construction-single" data-node-id={n.id} data-visible-state={JSON.stringify(publicV2(view))}>
        <div className="n08-step-caption"><span>{roles[n.role]}</span><strong>{n.goal}</strong></div>
        {design?.leadParts && <p className="reading-paragraph">{semantic(design.leadParts)}</p>}
        {mathematical.length > 0 && <ConstructionEquationGroup id={v2.id} number={numberFor(n)} rows={mathematical} plan={planForNodes(v2.id, [n.id])} renderParts={parts} visibleState={publicV2(view)} />}
        {view.rows.filter(row => row.prose && !row.formula).map(row => <p key={row.id} className="reading-paragraph">{parts(row.prose!)}</p>)}
        {view.currentPartId && <p className="construction-active-prompt" data-prose-role="active-prompt">{view.parts.find(p => p.id === view.currentPartId)?.prompt}</p>}{constructionPanel(v2.id)}
        {done && Boolean(design?.interpretationParts?.length) && <p className="reading-paragraph" data-prose-role="interpretation">{semantic(design!.interpretationParts!)}</p>}
      </div>
    }
    if (c) {
      const view = projectConstructionInteraction(c, current?.constructionProgress?.[c.id]?.draft, { solved: done, editableParts: !done })
      return <div key={n.id} className="n08-thinking-step construction-single" data-node-id={n.id} data-visible-state={JSON.stringify(view)}>
        <div className="n08-step-caption"><span>{roles[n.role]}</span><strong>{n.goal}</strong></div>{designFor(n.id)?.leadParts ? <p className="reading-paragraph">{semantic(designFor(n.id)!.leadParts!)}</p> : source.before.filter(b => b.type === 'paragraph').map(renderBlock)}
        <ConstructionEquationGroup id={c.id} number={numberFor(n)} rows={[{ id: n.id + '-r7-row', sourceNodeId: n.id, formula: view.formula }]} plan={planForNodes(c.id, [n.id])} renderParts={parts} visibleState={view} />
        {!done && <p className="construction-active-prompt" data-prose-role="active-prompt">{c.activePrompt}</p>}{constructionPanel(c.id)}{done && source.after.filter(b => b.type === 'paragraph').map(renderBlock)}
      </div>
    }
    const auto = reading.autoResults.find(a => a.id === n.id)
    if (auto) return <div className="n08-thinking-step" data-node-id={n.id} key={n.id}><div className="n08-step-caption"><span>{roles[n.role]}</span><strong>{n.goal}</strong></div>{designFor(n.id)?.leadParts ? <p className="reading-paragraph">{semantic(designFor(n.id)!.leadParts!)}</p> : source.before.filter(b => b.type === 'paragraph').map(renderBlock)}{after(n)}</div>
    const legacy = n.interaction && section.items.some(i => i.id === n.interaction)
    const before = done && !legacy ? source.before.filter(b => !b.parts?.some(p => p.type === 'choice')) : source.before
    return <div className="n08-thinking-step" data-node-id={n.id} key={n.id}><div className="n08-step-caption"><span>{roles[n.role]}</span><strong>{n.goal}</strong></div>{before.map(renderBlock)}{done && (legacy || n.id === 'n08-q04-substitute' ? source.after.filter(b => b.type === 'paragraph').map(renderBlock) : after(n))}</div>
  }
  type GroupRow = { id: string; sourceNodeId: string; formula: UiFormula; continuation?: boolean; before?: ReactNode; after?: ReactNode; current: { id: string } | null }
  function groupView(id: string) {
    const design = presentation.groups.find(g => g.id === id)!, rows: GroupRow[] = []
    for (const nodeId of design.sourceNodeIds) {
      const n = data.nodes.find(n => n.id === nodeId)!
      if (data.nodes.indexOf(n) > frontier) continue
      const c = n.interaction && findConstruction(n.interaction), v2 = n.interaction && findV2(n.interaction), done = resolved(n)
      if (v2) {
        const view = v2View(v2)
        for (const row of view.rows) if (row.formula) rows.push({ id: row.id, sourceNodeId: nodeId, formula: { ...row.formula, ...(design.kind === 'expression-chain' && rows.length ? { left: [] } : {}) }, continuation: design.kind === 'expression-chain' && rows.length > 0, current: done ? null : { id: v2.id } })
      } else if (c) {
        for (const known of design.rows.filter(r => r.sourceNodeId === nodeId && !r.interactionRef && !r.constructionRef)) rows.push({ id: known.id, sourceNodeId: nodeId, formula: known.completed, current: null })
        const view = projectConstructionInteraction(c, current?.constructionProgress?.[c.id]?.draft, { solved: done, editableParts: !done })
        rows.push({ id: nodeId + '-r7-row', sourceNodeId: nodeId, formula: { ...view.formula, ...(design.kind === 'expression-chain' && rows.length ? { left: [], relation: '=' } : {}) }, continuation: design.kind === 'expression-chain' && rows.length > 0, current: done ? null : { id: c.id } })
      } else {
        for (const row of design.rows.filter(r => r.sourceNodeId === nodeId)) rows.push({ id: row.id, sourceNodeId: nodeId, formula: done ? row.completed : row.masked, continuation: row.continuation, current: !done && row.interactionRef ? { id: row.interactionRef } : null })
      }
    }
    return { id, kind: design.kind, number: design.number, rows }
  }
  function group(id: string) {
    const design = presentation.groups.find(g => g.id === id)!, view = groupView(id)
    if (!view.rows.length) return null
    const currentId = view.rows.find(r => r.current)?.current?.id
    const currentNode = data.nodes.find(n => n.interaction === currentId), v2 = currentId && findV2(currentId)
    const active = v2 ? v2View(v2) : null
    for (const nodeId of design.sourceNodeIds) { const firstRow = view.rows.find(r => r.sourceNodeId === nodeId); if (!firstRow) continue; const lead = designFor(nodeId)?.leadParts; if (lead && firstRow.id.endsWith('-factor')) firstRow.before = <p className="axis-note" data-prose-role="essential-note">{semantic(lead)}</p> }
    return <div className="construction-reading-group" key={id} data-node-id={view.rows[0].sourceNodeId}>
      <ConstructionEquationGroup id={id} number={view.number} rows={view.rows} plan={planForNodes(id, [...design.boundaryNodeIds ?? [], ...design.sourceNodeIds], design.rows.map(r => r.masked))} renderParts={parts} visibleState={{ rows: view.rows.map(r => ({ id: r.id, sourceNodeId: r.sourceNodeId, formula: r.formula })), ...(active ? { currentPartId: active.currentPartId } : {}) }} />
      {currentId && <p className="construction-active-prompt" data-prose-role="active-prompt">{active ? active.parts.find(p => p.id === active.currentPartId)?.prompt : findConstruction(currentId)?.activePrompt ?? currentNode?.goal}</p>}
      {currentId && (findConstruction(currentId) || findV2(currentId) ? constructionPanel(currentId) : legacyPanel(currentId))}
      <details className="construction-full-explanation"><summary>説明を詳しく見る</summary>{design.sourceNodeIds.filter(nodeId => data.nodes.findIndex(n => n.id === nodeId) <= frontier).map(nodeId => { const n = data.nodes.find(n => n.id === nodeId)!, lead = designFor(nodeId)?.leadParts, source = data.semantic.nodes.find(n => n.id === nodeId)!; return <div key={nodeId}>{lead ? <p className="reading-paragraph">{semantic(lead)}</p> : source.before.filter(b => b.type === 'paragraph').map(renderBlock)}{resolved(n) && source.after.filter(b => b.type === 'paragraph').map(renderBlock)}</div> })}</details>
    </div>
  }
  function renderNodes(nodes: Node[], past = false) {
    const emitted = new Set<string>()
    return nodes.map(n => { const design = presentation.groups.find(g => g.sourceNodeIds.includes(n.id)); if (!design) return standalone(n, past); if (emitted.has(design.id)) return null; emitted.add(design.id); return group(design.id) })
  }
  const figure = section.figures[0]
  const originalFigure = () => <figure className="n08-figure"><img src={import.meta.env.BASE_URL + figure.src.replace(/^\//, '')} alt={figure.alt} /><figcaption>{figure.caption}</figcaption></figure>
  return <div ref={flow} className="textbook-reading-flow n08-reading n08-construction-reading n08-axis-reader" data-n08-revision="7" data-typeset-theme="true" data-testid="textbook-reading-flow" tabIndex={-1}>
    <p className="n08-version-link"><Link to={'/learning/textbook/' + unit.unitId + '?version=6'}>第6版</Link> · <Link to={'/learning/textbook/' + unit.unitId + '?version=5'}>第5版</Link> · <Link to={'/learning/textbook/' + unit.unitId + '?version=5&layout=original'}>変更前の表示を見る</Link> · <Link to={'/learning/textbook/' + unit.unitId + '?version=4'}>第4版</Link></p>
    <div className="math-textbook-reading-controls"><span>{text('今の段階', '当前阶段')} {stageIndex + 1} / {data.stages.length}</span>{stageIndex > 0 && <button type="button" data-testid="n08-history-toggle" onClick={() => setHistory(x => !x)}>{history ? text('履歴を閉じる', '收起记录') : text('前の段階を見る', '查看之前的阶段')}</button>}</div>
    {history && <div className="n08-history"><button type="button" onClick={() => setExpandAll(x => !x)}>{expandAll ? '全文を閉じる' : '全文を開く'}</button>{data.stages.slice(0, stageIndex).map((s, i) => { const previous = data.nodes.filter(n => n.stageId === s.id); return <section className="first-theme-recorded-results" key={s.id}><h3>{i + 1}. {s.title}</h3>{result(previous.at(-1)!)}<details open={expandAll || undefined}><summary>全文を見る</summary>{i === 0 && originalFigure()}{renderNodes(previous, true)}</details></section> })}</div>}
    <section className="math-textbook-stage math-textbook-stage--current" data-testid={'math-textbook-stage-' + stage.id}>
      <div className="n08-source-question" data-testid="n08-source-question" data-problem-id={problem.id}><strong>今解いている問題</strong><TypesetFormula source={problem.root} sourceId={problem.id + '-root'} unitId={unit.unitId} /><p>{problem.goal}</p>{'givens' in problem && problem.givens && <p>与えられた値：<TypesetInlineMath latex={problem.givens} sourceId={problem.id + '-given'} unitId={unit.unitId} /></p>}</div>
      <header className="math-textbook-stage-active-title"><strong>{stage.title}</strong><small>{stageIndex + 1} / {data.stages.length}</small></header>
      {stageIndex === 0 && originalFigure()}{stageIndex > 0 && stageIndex < 4 && <details><summary>元の数直線を見る</summary>{originalFigure()}</details>}
      {prior.length > 0 && <details className="n08-problem-record" open data-testid="n08-problem-record"><summary>この問題でここまで分かったこと</summary>{prior.map(n => { const design = presentation.groups.find(g => g.sourceNodeIds.includes(n.id)); if (design && design.sourceNodeIds.at(-1) !== n.id) return null; if (design) { const v = groupView(design.id), last = v.rows.at(-1), root = v.rows[0]; const formula = last && root && design.kind === 'expression-chain' ? { ...last.formula, left: root.formula.left.length ? root.formula.left : root.formula.right } : last?.formula; return last && formula ? <div key={n.id} data-result-source={n.resultId}><strong>{n.goal}</strong><ConstructionEquationGroup id={'prior-' + design.id} rows={[{ ...last, formula }]} plan={planForNodes('prior-' + design.id, [...design.boundaryNodeIds ?? [], ...design.sourceNodeIds], design.rows.map(r => r.masked))} renderParts={parts} renderCopy={semantic} /></div> : null } return result(n) })}</details>}
      {known.length > 0 && <aside className="math-textbook-stage-references" data-testid="math-textbook-stage-references"><strong>使う条件・前の結果</strong>{known.map(result)}</aside>}
      {renderNodes(stageNodes.filter(n => data.nodes.indexOf(n) <= frontier))}
      {complete && stageIndex < data.stages.length - 1 && <button type="button" className="math-textbook-next-stage" data-testid="math-textbook-next-stage" onClick={() => { setCursor(stageIndex + 1); setActivePart(null); setActiveLegacy(null); setHistory(false); setExpandAll(false); requestAnimationFrame(() => { flow.current?.focus({ preventScroll: true }); flow.current?.scrollIntoView({ block: 'start' }) }) }}>次へ</button>}
      {first < 0 && stageIndex === data.stages.length - 1 && <p data-testid="n08-complete">ここまでの学習を終えました。</p>}
    </section>
  </div>
}
