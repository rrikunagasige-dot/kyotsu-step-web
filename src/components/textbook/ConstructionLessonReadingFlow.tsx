import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from '../../domain/compiledNestedLesson'
import { projectNestedLesson, stableNestedChoices, type NestedCopy, type NestedLedger, type NestedLesson, type NestedNode, type NestedRow, type PublicNestedPart } from '../../domain/nestedLesson'
import { NestedConstructionMath } from './NestedConstructionMath'
import { renderClosedMath } from './nestedMathTemplate'
import { measureNeutralNestedGroup, type NeutralNestedGroupPlan } from './nestedMathGeometry'
import './construction-lesson-reading.css'

export type ConstructionLessonReadingFlowProps = {
  compiled: CompiledNestedLesson
  ledger?: NestedLedger
  onAnswer: (partId: string, value: string) => void
  onReset: () => void
}

function MathCopy({ latex }: { latex: string }) {
  return <span className="construction-lesson-inline-math" dangerouslySetInnerHTML={{ __html: renderClosedMath(latex) }} />
}
function Copy({ parts }: { parts: NestedCopy[] }) {
  return <>{parts.map((p, index) => p.type === 'math' ? <MathCopy key={index} latex={p.latex ?? ''} /> : p.type === 'term' || p.semanticRole === 'term' && p.usage === 'first_definition' && p.emphasis === 'black-bold' ? <strong key={index}>{p.text}</strong> : <span key={index}>{p.text}</span>)}</>
}

/** Anchor a tag to the visible math row, not to the prose or group bottom. */
function TaggedMathRow({ number, children }: { number?: string; children: ReactNode }) {
  const row = useRef<HTMLDivElement>(null), tag = useRef<HTMLSpanElement>(null)
  const [placement, setPlacement] = useState({ top: 0, below: false })
  useLayoutEffect(() => {
    if (number === undefined || !row.current || !tag.current) return
    let active = true
    const measure = () => {
      if (!active || !row.current || !tag.current) return
      const root = row.current, bounds = root.getBoundingClientRect(), label = tag.current.getBoundingClientRect()
      const formula = root.querySelector<HTMLElement>('.nested-math-formula')
      if (!formula) return
      const bases = [...formula.querySelectorAll<HTMLElement>('.katex-html > .base')]
      const base = bases.at(-1), strut = base?.querySelector<HTMLElement>(':scope > .strut')
      const math = formula.getBoundingClientRect()
      const baseline = strut ? strut.getBoundingClientRect().bottom + (parseFloat(getComputedStyle(strut).verticalAlign) || 0) : math.bottom
      // Root gathered rows use a 3em pstrut. The zero-height wrapper's top
      // is above its baseline; nested fraction/cases pstruts are not anchors.
      const shell = formula.closest<HTMLElement>('.nested-math-shell')
      const gathered = shell?.dataset.rootBreakPath ? formula.querySelector<HTMLElement>('.katex-html .mtable') : null
      const gatheredRows = gathered ? [...gathered.querySelectorAll<HTMLElement>(':scope > .col-align-c > .vlist-t > .vlist-r > .vlist > span')].filter(el => el.querySelector(':scope > .mord')) : []
      const last = gatheredRows.at(-1)
      const rootRowStrut = last?.querySelector<HTMLElement>(':scope > .pstrut')
      const anchor = rootRowStrut ? rootRowStrut.getBoundingClientRect().bottom : baseline
      const numberBaseline = tag.current.querySelector<HTMLElement>('[data-number-baseline]')?.getBoundingClientRect().top ?? label.bottom
      const descent = numberBaseline - label.top
      const proposedTop = anchor - bounds.top - descent
      const left = bounds.right - label.width
      const collision = [...formula.querySelectorAll<HTMLElement>('.katex-html .mord, .katex-html .mopen, .katex-html .mclose, .katex-html .mbin, .katex-html .mrel, .katex-html .mpunct, .katex-html .mop, .katex-html .sqrt-line, .katex-html .frac-line, .nested-slot-control')].some(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.right + 8 > left && r.bottom > bounds.top + proposedTop && r.top < bounds.top + proposedTop + label.height })
      const next = { top: collision ? math.bottom - bounds.top + 8 : proposedTop, below: collision }
      setPlacement(old => Math.abs(old.top - next.top) < .25 && old.below === next.below ? old : next)
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(row.current)
    const shell = row.current.querySelector<HTMLElement>('.nested-math-shell')
    if (shell) observer?.observe(shell)
    const mutationObserver = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(measure)
    mutationObserver?.observe(shell ?? row.current, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'data-root-break-path', 'data-neutral-status'] })
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => { active = false; observer?.disconnect(); mutationObserver?.disconnect(); window.removeEventListener('resize', measure) }
  }, [number, children])
  return <div ref={row} className={'construction-lesson-math-row' + (placement.below ? ' construction-lesson-math-row--tag-below' : '')} data-number-placement={number === undefined ? undefined : placement.below ? 'below-final-math-row' : 'final-math-baseline'}>
    {children}
    {number !== undefined && <span ref={tag} className="construction-lesson-equation-number" style={{ top: placement.top }} aria-label={'式' + number}>({number})<i data-number-baseline="true" /></span>}
  </div>
}

function TextRow({ row, parts, onActivate }: { row: NestedRow; parts: PublicNestedPart[]; onActivate: () => void }) {
  const tokens = row.template.split(/(\{(?:mirror:)?[A-Za-z][A-Za-z0-9_.-]*\})/)
  return <p className="construction-lesson-text-row" data-text-row-id={row.id}>{tokens.map((token, index) => {
    const match = /^\{(mirror:)?([^}]+)\}$/.exec(token)
    if (!match) return <span key={index}>{token}</span>
    const part = parts.find(p => p.key === match[2])
    if (!part || match[1] && !part.correct) throw Error('READER_UNPROVEN_TEXT_PART')
    const chosen = part.choices.find(c => c.value === part.value)
    const evidence = { 'data-text-part-id': part.id, 'data-text-part-key': part.key, 'data-text-part-value': part.value, 'data-slot-state': part.correct ? 'filled' : part.value !== undefined ? 'wrong' : 'initial', 'data-editable': part.editable && !part.correct ? 'true' : 'false', ...(match[1] ? { 'data-text-mirror': 'true' } : {}) }
    if (part.correct) return <span key={index} {...evidence}>{chosen?.display ?? part.value}</span>
    return <button key={index} type="button" className="construction-lesson-text-slot" disabled={!part.editable} onClick={onActivate} aria-label={part.prompt} {...evidence}>{chosen?.display ?? part.value ?? '選択'}</button>
  })}</p>
}

type PublicPlanningNode = Pick<NestedNode, 'nodeId' | 'rows'> & { parts: PublicNestedPart[] }

function NodeRows({ planningNode, planningNodes, rows, parts, readonly, number, onActivate, idPrefix = '' }: { planningNode: NestedNode; planningNodes: PublicPlanningNode[]; rows: NestedRow[]; parts: PublicNestedPart[]; readonly: boolean; number?: string; onActivate: () => void; idPrefix?: string }) {
  const group = useRef<HTMLDivElement>(null), [plans, setPlans] = useState<Record<string, NeutralNestedGroupPlan>>({})
  const groupId = idPrefix + planningNode.nodeId + '-math-group'
  const neutralGroups = useMemo(() => {
    const ids = new Set(rows.filter(r => r.kind === 'math').map(r => r.mathGroupId ?? planningNode.nodeId))
    return [...ids].map(id => ({ id: idPrefix + id, rows: planningNodes.flatMap(owner => owner.rows.filter(row => row.kind === 'math' && (row.mathGroupId ?? owner.nodeId) === id).map(row => {
      const referenced = new Set([...row.partKeys, ...Array.from(row.template.matchAll(/\{mirror:([A-Za-z][A-Za-z0-9_.-]*)\}/g), match => match[1])])
      const parts = owner.parts.filter(part => referenced.has(part.key))
      return { id: row.id, template: row.template, parts: parts.map(part => ({ key: part.key, kind: part.prompt, role: part.role, choices: part.choices.map(choice => ({ value: choice.value, latex: choice.latex, kind: choice.kind })) })), values: Object.fromEntries(parts.filter(p => p.correct && p.value !== undefined).map(p => [p.key, p.value!])), certifiedKeys: parts.filter(p => p.correct).map(p => p.key) }
    })) }))
  }, [planningNode, planningNodes, rows, idPrefix])
  useLayoutEffect(() => {
    if (!group.current || !neutralGroups.length) return
    let active = true, lastStamp = ''
    const measure = () => {
      if (!active || !group.current) return
      const width = group.current.getBoundingClientRect().width
      if (!(width > 0)) return
      const stamp = JSON.stringify([width, document.fonts?.status, getComputedStyle(group.current).font, document.fonts ? [...document.fonts].map(face => [face.family, face.style, face.weight, face.status]).sort() : []])
      if (stamp === lastStamp) return
      const next = Object.fromEntries(neutralGroups.map(g => [g.id, measureNeutralNestedGroup(g.id, g.rows, group.current!, width)]))
      lastStamp = stamp
      setPlans(old => JSON.stringify(old) === JSON.stringify(next) ? old : next)
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(group.current)
    void document.fonts?.ready.then(measure)
    document.fonts?.addEventListener('loadingdone', measure)
    window.addEventListener('resize', measure)
    return () => { active = false; observer?.disconnect(); document.fonts?.removeEventListener('loadingdone', measure); window.removeEventListener('resize', measure) }
  }, [neutralGroups])
  const plan = plans[neutralGroups[0]?.id]
  const lastMathId = rows.filter(r => r.kind === 'math').at(-1)?.id
  return <div ref={group} className="construction-lesson-continuous-calculation" data-math-group-id={groupId} data-group-neutral-key={plan?.neutralLayoutKey} data-group-body-width={plan?.bodyWidth} data-group-relation-column={plan?.relationColumn} data-group-layout-overflow={plan?.overflow ? 'true' : 'false'}>{rows.map(row => {
    if (row.kind === 'text') return <TextRow key={row.id} row={row} parts={parts} onActivate={onActivate} />
    const referencedKeys = new Set([...row.partKeys, ...Array.from(row.template.matchAll(/\{mirror:([A-Za-z][A-Za-z0-9_.-]*)\}/g), match => match[1])])
    const rowParts = parts.filter(part => referencedKeys.has(part.key))
    const values = Object.fromEntries(rowParts.flatMap(p => p.value !== undefined ? [[p.key, p.value]] : []))
    const certifiedKeys = rowParts.filter(p => p.correct).map(p => p.key)
    const rowPlan = plans[idPrefix + (row.mathGroupId ?? planningNode.nodeId)]
    const neutralRow = rowPlan?.rows.find(r => r.id === row.id)
    return <TaggedMathRow key={row.id} number={row.id === lastMathId ? number : undefined}><NestedConstructionMath id={idPrefix + row.id} template={row.template} parts={rowParts.map(p => ({ key: p.key, kind: p.prompt, role: p.role, choices: p.choices }))} values={values} certifiedKeys={certifiedKeys} editableKey={rowParts.find(p => p.editable)?.key ?? null} onActivate={onActivate} mode={readonly ? 'readonly' : 'interactive'} groupAlignment={rowPlan && neutralRow ? { groupId: idPrefix + (row.mathGroupId ?? planningNode.nodeId), bodyWidth: rowPlan.bodyWidth, relationColumn: rowPlan.relationColumn, neutralLayoutKey: rowPlan.neutralLayoutKey, breakAtPaths: neutralRow.breakAtPaths } : undefined} /></TaggedMathRow>
  })}</div>
}

export function ConstructionLessonReadingFlow(props: ConstructionLessonReadingFlowProps) {
  const bound = useMemo(() => { try { return { lesson: nestedLessonFromCompiled(props.compiled) } } catch (error) { return { error: error instanceof Error ? error.message : 'READER_BINDING_FAILED' } } }, [props.compiled])
  if (!bound.lesson) return <div role="alert">教材データの対応を確認できません。{bound.error}</div>
  return <BoundConstructionLesson {...props} lesson={bound.lesson} />
}

function BoundConstructionLesson({ compiled, ledger, onAnswer, lesson }: ConstructionLessonReadingFlowProps & { lesson: NestedLesson }) {
  const view = projectNestedLesson(lesson, ledger)
  const flow = useRef<HTMLDivElement>(null), choicePanel = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState(false), [stageCursor, setStageCursor] = useState<string>()
  const frontier = view.visible.at(-1)
  const currentStage = stageCursor ?? frontier?.node.stageId
  const stageIndex = compiled.stages.findIndex(s => s.id === currentStage), stage = compiled.stages[stageIndex]
  const stageItems = view.visible.filter(n => n.node.stageId === currentStage)
  const stageComplete = stageItems.length > 0 && stageItems.length === lesson.nodes.filter(n => n.stageId === currentStage).length && stageItems.every(n => n.resolved)
  const activePart = frontier?.node.stageId === currentStage ? frontier?.parts.find(p => p.editable) : undefined
  const choices = activePart ? stableNestedChoices(activePart.choices, compiled.unitId + ':' + compiled.toRevision + ':' + activePart.id) : []
  const activate = () => choicePanel.current?.querySelector<HTMLButtonElement>('button')?.focus()
  const nodeMeta = (id: string) => compiled.nodeDesign.find(n => n.nodeId === id)!
  const tokens = compiled.layoutPlan.tokens
  const tokenStyle = { '--construction-font': tokens.mathFontPx + 'px', '--construction-katex-scale': tokens.katexScale + 'em', '--construction-hit': tokens.minHitPx + 'px', '--construction-row-gap': tokens.rowGapPx + 'px', '--construction-note-gap': tokens.noteGapPx + 'px', '--construction-paragraph-gap': tokens.paragraphGapPx + 'px' } as CSSProperties
  const renderNode = (item: typeof view.visible[number], readonly = false) => {
    const meta = nodeMeta(item.node.nodeId)
    return <div key={item.node.nodeId} className="construction-lesson-node" data-node-id={item.node.nodeId} data-node-resolved={item.resolved ? 'true' : 'false'}>
      <p className="construction-lesson-lead reading-paragraph"><Copy parts={item.node.leadParts} /></p>
      {(meta.assumptionsDisplay === 'in-context' ? [] : meta.assumptionParts ?? item.node.assumptions.map(text => [{ type: 'text' as const, text }])).map((parts, index) => <p className="construction-lesson-condition reading-paragraph" key={index}><Copy parts={parts} /></p>)}
      <NodeRows planningNode={meta} planningNodes={view.visible.map(item => ({ nodeId: item.node.nodeId, rows: item.rows, parts: item.parts }))} rows={item.rows} parts={item.parts} readonly={readonly} number={meta.equationNumber === undefined ? undefined : [meta.equationNumber, ...(meta.numberAliases ?? [])].join(' / ')} onActivate={readonly ? () => undefined : activate} idPrefix={readonly ? 'history-' : ''} />
      {item.node.displayExtras?.map((extra, index) => extra.kind === 'math' ? <div key={index} className="construction-lesson-extra"><NestedConstructionMath id={item.node.nodeId + '-extra-' + index} template={extra.latex} parts={[]} values={{}} certifiedKeys={[]} editableKey={null} onActivate={() => undefined} mode="readonly" /></div> : extra.kind === 'table' ? <div key={index} className="construction-lesson-extra"><table><caption>{extra.caption}</caption><thead><tr>{extra.headers.map((header, column) => <th scope="col" key={column}>{header}</th>)}</tr></thead><tbody>{extra.rows.map((cells, row) => <tr key={row}>{cells.map((cell, column) => <td key={column}><MathCopy latex={cell} /></td>)}</tr>)}</tbody></table></div> : <figure key={index} className="construction-lesson-extra" data-figure-id={extra.id}><img src={import.meta.env.BASE_URL + extra.src.replace(/^\//, '')} alt={extra.alt} data-figure-sha256={extra.sha256} /><figcaption>{extra.caption}</figcaption></figure>)}
      {!readonly && item.node.nodeId === frontier?.node.nodeId && activePart && <div ref={choicePanel} className="construction-lesson-choice-panel axis-choice-panel" data-active-part-id={activePart.id}>
        <p>{activePart.prompt}</p>
        {activePart.visibleFeedback && <aside role="status" className="construction-lesson-feedback reading-choice-hint"><strong>もう一度考えよう</strong><span>{activePart.visibleFeedback}</span></aside>}
        <div className="construction-lesson-choices axis-choice-list" role="group" aria-label={activePart.prompt}>{choices.map((choice, index) => <button key={choice.value} type="button" className="reading-choice-option" data-choice-value={choice.value} aria-label={choice.display ?? choice.value} onClick={() => { setStageCursor(currentStage); onAnswer(activePart.id, choice.value) }}><span className="construction-lesson-choice-index">{index + 1}</span><strong>{choice.mathLines ? <span className="construction-lesson-choice-math-lines" aria-hidden="true">{choice.mathLines.map((line, lineIndex) => <span key={lineIndex}><MathCopy latex={line} /></span>)}</span> : choice.kind === 'math' ? <MathCopy latex={choice.latex ?? choice.value} /> : choice.display ?? choice.value}</strong></button>)}</div>
      </div>}
    </div>
  }
  const known = stage ? [...new Set(stageItems.flatMap(n => nodeMeta(n.node.nodeId).requiredResultRefs))].map(id => view.visible.find(n => n.resolved && n.node.stageId !== currentStage && n.node.resultId === id)).filter((n): n is typeof view.visible[number] => !!n) : []
  return <div ref={flow} tabIndex={-1} className="textbook-reading-flow construction-lesson-reading" data-testid="textbook-reading-flow" style={tokenStyle} data-compiled-hash={compiled.compiledHash} data-current-stage={currentStage}>
    {view.staleLedger && <p role="status">別の版の記録は、この教材の回答として使いません。</p>}
    <div className="math-textbook-reading-controls"><span>今の段階 {stageIndex + 1} / {compiled.stages.length}</span>{stageIndex > 0 && <button type="button" onClick={() => setHistory(v => !v)} aria-expanded={history}>{history ? '履歴を閉じる' : '前の段階を見る'}</button>}</div>
    {history && <div className="construction-lesson-history" data-readonly-history="true">{compiled.stages.slice(0, stageIndex).map(previous => <details key={previous.id}><summary>{previous.title}</summary>{view.visible.filter(n => n.resolved && n.node.stageId === previous.id).map(item => renderNode(item, true))}</details>)}</div>}
    {stage && <section data-stage-id={stage.id} className="construction-lesson-stage math-textbook-stage math-textbook-stage--current">
      <header className="math-textbook-stage-active-title"><strong>{stage.title}</strong><small>{stageIndex + 1} / {compiled.stages.length}</small></header>
      <div className="construction-lesson-source-question"><span className="construction-lesson-kind">{stage.title.includes('証明') ? '導出' : '例題'}</span><p className="construction-lesson-original-question"><Copy parts={stage.sourceQuestionParts} /></p></div>
      {known.length > 0 && <aside className="math-textbook-stage-references"><strong>使う条件・前の結果</strong>{known.map(item => <div key={item.node.resultId} data-certified-reference={item.node.resultId}>{item.node.terminalRecord?.formulas.map((latex, index) => <p key={index}><MathCopy latex={latex} /></p>)}</div>)}</aside>}
      {stageItems.map(item => renderNode(item))}
      {stageComplete && stageIndex < compiled.stages.length - 1 && <button type="button" className="math-textbook-next-stage" data-testid="math-textbook-next-stage" onClick={() => { setStageCursor(compiled.stages[stageIndex + 1].id); setHistory(false); requestAnimationFrame(() => { flow.current?.focus({ preventScroll: true }); flow.current?.scrollIntoView({ block: 'start' }) }) }}>次へ</button>}
      {view.completed && stageIndex === compiled.stages.length - 1 && <p role="status">ここまでの学習を終えました。</p>}
    </section>}
  </div>
}

export default ConstructionLessonReadingFlow
