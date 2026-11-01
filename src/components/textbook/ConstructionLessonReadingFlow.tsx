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
      const collision = [...formula.querySelectorAll<HTMLElement>('.katex-html .mord, .nested-slot-control')].some(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.right + 8 > left && r.bottom > bounds.top + proposedTop && r.top < bounds.top + proposedTop + label.height })
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

function NodeRows({ planningNode, rows, parts, readonly, number, onActivate, idPrefix = '' }: { planningNode: NestedNode; rows: NestedRow[]; parts: PublicNestedPart[]; readonly: boolean; number?: string; onActivate: () => void; idPrefix?: string }) {
  const group = useRef<HTMLDivElement>(null), [plan, setPlan] = useState<NeutralNestedGroupPlan>()
  const groupId = idPrefix + planningNode.nodeId + '-math-group'
  const neutralRows = useMemo(() => planningNode.rows.filter(row => row.kind === 'math').map(row => {
    const referenced = new Set([...row.partKeys, ...Array.from(row.template.matchAll(/\{mirror:([A-Za-z][A-Za-z0-9_.-]*)\}/g), match => match[1])])
    return { id: row.id, template: row.template, parts: planningNode.parts.filter(part => referenced.has(part.key)).map(part => ({ key: part.key, kind: part.prompt, role: part.role, choices: part.choices.map(choice => ({ value: choice.value, latex: choice.latex, kind: choice.kind })) })) }
  }), [planningNode])
  useLayoutEffect(() => {
    if (!group.current || !neutralRows.length) return
    let active = true, lastStamp = ''
    const measure = () => {
      if (!active || !group.current) return
      const width = group.current.getBoundingClientRect().width
      // jsdom/no geometry cannot produce or certify a shared layout.
      if (!(width > 0)) return
      const stamp = width + ':' + document.fonts?.status
      if (stamp === lastStamp) return
      const next = measureNeutralNestedGroup(groupId, neutralRows, group.current, width)
      lastStamp = stamp
      setPlan(previous => previous?.neutralLayoutKey === next.neutralLayoutKey ? previous : next)
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(group.current)
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => { active = false; observer?.disconnect(); window.removeEventListener('resize', measure) }
  }, [groupId, neutralRows])
  const lastMathId = rows.filter(r => r.kind === 'math').at(-1)?.id
  return <div ref={group} className="construction-lesson-continuous-calculation" data-math-group-id={groupId} data-group-neutral-key={plan?.neutralLayoutKey} data-group-body-width={plan?.bodyWidth} data-group-relation-column={plan?.relationColumn} data-group-layout-overflow={plan?.overflow ? 'true' : 'false'}>{rows.map(row => {
    if (row.kind === 'text') return <TextRow key={row.id} row={row} parts={parts} onActivate={onActivate} />
    const referencedKeys = new Set([...row.partKeys, ...Array.from(row.template.matchAll(/\{mirror:([A-Za-z][A-Za-z0-9_.-]*)\}/g), match => match[1])])
    const rowParts = parts.filter(part => referencedKeys.has(part.key))
    const values = Object.fromEntries(rowParts.flatMap(p => p.value !== undefined ? [[p.key, p.value]] : []))
    const certifiedKeys = rowParts.filter(p => p.correct).map(p => p.key)
    const neutralRow = plan?.rows.find(r => r.id === row.id)
    return <TaggedMathRow key={row.id} number={row.id === lastMathId ? number : undefined}><NestedConstructionMath id={idPrefix + row.id} template={row.template} parts={rowParts.map(p => ({ key: p.key, kind: p.prompt, role: p.role, choices: p.choices }))} values={values} certifiedKeys={certifiedKeys} editableKey={rowParts.find(p => p.editable)?.key ?? null} onActivate={onActivate} mode={readonly ? 'readonly' : 'interactive'} groupAlignment={plan && neutralRow ? { groupId, bodyWidth: plan.bodyWidth, relationColumn: plan.relationColumn, neutralLayoutKey: plan.neutralLayoutKey, breakAtPaths: neutralRow.breakAtPaths } : undefined} /></TaggedMathRow>
  })}</div>
}

export function ConstructionLessonReadingFlow(props: ConstructionLessonReadingFlowProps) {
  const bound = useMemo(() => { try { return { lesson: nestedLessonFromCompiled(props.compiled) } } catch (error) { return { error: error instanceof Error ? error.message : 'READER_BINDING_FAILED' } } }, [props.compiled])
  if (!bound.lesson) return <div role="alert">教材データの対応を確認できません。{bound.error}</div>
  return <BoundConstructionLesson {...props} lesson={bound.lesson} />
}

function BoundConstructionLesson({ compiled, ledger, onAnswer, onReset, lesson }: ConstructionLessonReadingFlowProps & { lesson: NestedLesson }) {
  const view = projectNestedLesson(lesson, ledger)
  const choicePanel = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState(false)
  const frontier = view.visible.at(-1)
  const currentStage = frontier?.node.stageId
  const visibleStages = compiled.stages.filter(s => view.visible.some(n => n.node.stageId === s.id))
  const activePart = frontier?.parts.find(p => p.editable)
  const choices = activePart ? stableNestedChoices(activePart.choices, compiled.unitId + ':' + compiled.toRevision + ':' + activePart.id) : []
  const activate = () => choicePanel.current?.querySelector<HTMLButtonElement>('button')?.focus()
  const nodeMeta = (id: string) => compiled.nodeDesign.find(n => n.nodeId === id)!
  const tokens = compiled.layoutPlan.tokens
  const tokenStyle = { '--construction-font': tokens.mathFontPx + 'px', '--construction-katex-scale': tokens.katexScale + 'em', '--construction-hit': tokens.minHitPx + 'px', '--construction-row-gap': tokens.rowGapPx + 'px', '--construction-note-gap': tokens.noteGapPx + 'px', '--construction-paragraph-gap': tokens.paragraphGapPx + 'px' } as CSSProperties
  const memo = (node: NestedNode) => <div className="construction-lesson-memo" data-certified-memo={node.nodeId}>
    {node.terminalRecord.formulas.map((formula, index) => <div key={index} className="construction-lesson-memo-math"><NestedConstructionMath id={node.nodeId + '-memo-' + index} template={formula} parts={[]} values={{}} certifiedKeys={[]} editableKey={null} onActivate={() => undefined} mode="readonly" /></div>)}
    {(node.terminalRecord.conditionParts ?? node.terminalRecord.conditions.map(text => [{ type: 'text' as const, text }])).map((parts, index) => <p key={index}><Copy parts={parts} /></p>)}
    <p><Copy parts={node.terminalRecord.proseParts ?? [{ type: 'text', text: node.terminalRecord.prose }]} /></p>
  </div>
  return <div className="textbook-reading-flow construction-lesson-reading" style={tokenStyle} data-compiled-hash={compiled.compiledHash} data-current-stage={currentStage}>
    {view.staleLedger && <p role="status">別の版の記録は、この教材の回答として使いません。</p>}
    {visibleStages.map(stage => <section key={stage.id} data-stage-id={stage.id} className="construction-lesson-stage">
      <h2>{stage.title}</h2>
      <p className="construction-lesson-original-question"><Copy parts={stage.sourceQuestionParts} /></p>
      {view.visible.filter(n => n.node.stageId === stage.id).map(item => {
        const meta = nodeMeta(item.node.nodeId), historical = item.resolved && stage.id !== currentStage
        return <div key={item.node.nodeId} className="construction-lesson-node" data-node-id={item.node.nodeId} data-node-resolved={item.resolved ? 'true' : 'false'}>
          <p className="construction-lesson-lead"><Copy parts={item.node.leadParts} /></p>
          {(meta.assumptionParts ?? item.node.assumptions.map(text => [{ type: 'text' as const, text }])).map((parts, index) => <p className="construction-lesson-condition" key={index}><Copy parts={parts} /></p>)}
          <NodeRows planningNode={meta} rows={item.rows} parts={item.parts} readonly={historical} number={meta.equationNumber === undefined ? undefined : [meta.equationNumber, ...(meta.numberAliases ?? [])].join(' / ')} onActivate={activate} />
          {item.resolved && memo(meta)}
          {item.node.displayExtras?.map((extra, index) => extra.kind === 'math' ? <div key={index} className="construction-lesson-extra"><NestedConstructionMath id={item.node.nodeId + '-extra-' + index} template={extra.latex} parts={[]} values={{}} certifiedKeys={[]} editableKey={null} onActivate={() => undefined} mode="readonly" /></div> : extra.kind === 'table' ? <div key={index} className="construction-lesson-extra"><table><caption>{extra.caption}</caption><thead><tr>{extra.headers.map((header, column) => <th scope="col" key={column}>{header}</th>)}</tr></thead><tbody>{extra.rows.map((cells, row) => <tr key={row}>{cells.map((cell, column) => <td key={column}><MathCopy latex={cell} /></td>)}</tr>)}</tbody></table></div> : <figure key={index} className="construction-lesson-extra" data-figure-id={extra.id}><img src={import.meta.env.BASE_URL + extra.src.replace(/^\//, '')} alt={extra.alt} data-figure-sha256={extra.sha256} /><figcaption>{extra.caption}</figcaption></figure>)}
        </div>
      })}
    </section>)}
    {activePart && <div ref={choicePanel} className="construction-lesson-choice-panel" data-active-part-id={activePart.id}>
      <p>{activePart.prompt}</p>
      {activePart.visibleFeedback && <p role="status" className="construction-lesson-feedback">{activePart.visibleFeedback}</p>}
      <div className="construction-lesson-choices" role="group" aria-label={activePart.prompt}>{choices.map((choice, index) => <button key={choice.value} type="button" data-choice-value={choice.value} aria-label={choice.display ?? choice.value} onClick={() => onAnswer(activePart.id, choice.value)}><span className="construction-lesson-choice-index">{index + 1}</span>{choice.kind === 'math' ? <MathCopy latex={choice.latex ?? choice.value} /> : <span>{choice.display ?? choice.value}</span>}</button>)}</div>
    </div>}
    {view.completed && <p role="status">この教材の計算と確認が終わりました。</p>}
    <div className="construction-lesson-record-controls"><button type="button" onClick={() => setHistory(v => !v)} aria-expanded={history}>確定した計算の履歴</button><button type="button" onClick={onReset}>この版をやり直す</button></div>
    {history && <div className="construction-lesson-history" data-readonly-history="true">{view.visible.filter(n => n.resolved).map(item => <div key={item.node.nodeId}><NodeRows planningNode={nodeMeta(item.node.nodeId)} rows={item.rows} parts={item.parts} readonly idPrefix="history-" onActivate={() => undefined} />{(item.node.terminalRecord?.conditionParts ?? item.node.terminalRecord?.conditions.map(text => [{ type: 'text' as const, text }]) ?? []).map((parts, index) => <p key={index} className="construction-lesson-history-condition"><Copy parts={parts} /></p>)}<p><Copy parts={item.node.terminalRecord?.proseParts ?? [{ type: 'text', text: item.node.terminalRecord?.prose ?? '' }]} /></p></div>)}</div>}
  </div>
}

export default ConstructionLessonReadingFlow
