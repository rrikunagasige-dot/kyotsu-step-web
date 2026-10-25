import { useEffect, useRef, useState } from 'react'
import { InlineMath } from 'react-katex'
import { SemanticReading } from './SemanticReading'
import { n07Presentation } from '../../data/textbook/math/numbers/n07Lesson'
import { getTextbookChoices, isTextbookItemResolved, type TextbookUnitProgress } from '../../domain/textbook'
import type { TextbookItem, TextbookReadingBlock, TextbookSection, TextbookUnit } from '../../domain/textbookSchema'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'
import { TextbookFormula } from './TextbookFormula'
import { TypesetFormula } from './TypesetFormula'
import './n07-reading.css'

type Props = {
  unit: TextbookUnit
  section: TextbookSection
  progress: TextbookUnitProgress | undefined
  onSummaryReached?: (reached: boolean) => void
  onReviewAnswer?: (item: TextbookItem, choice: string) => void
}
type DisplayParts = { kind: string; id: string; text?: string; latex?: string; usage?: string }[]
type Node = typeof n07Presentation.nodes[number]
const roles: Record<string, string> = { example: '例題', proof: '性質の導出', definition: '定義', property: '性質', interpretation: '意味の確認', reuse: '学んだことを使う' }
const numbers: Record<string, number> = n07Presentation.equationNumbers

/** N07 alone consumes the approved compiler metadata; existing modes keep their renderer. */
export function N07ReadingFlow({ unit, section, progress, onSummaryReached, onReviewAnswer }: Props) {
  const { text } = useI18n()
  const answerTextbook = useAppStore(state => state.answerTextbook)
  const currentProgress = progress?.unitRevision === unit.revision ? progress : undefined
  const nodes = n07Presentation.nodes
  const stages = n07Presentation.stages
  const resolved = (node: Node) => !node.interaction || isTextbookItemResolved(
    section.items.find(item => item.id === node.interaction?.id)!, currentProgress?.answers[node.interaction.id],
  )
  const firstUnresolved = nodes.findIndex(node => !resolved(node))
  const frontier = firstUnresolved < 0 ? nodes.length : firstUnresolved
  const maxStage = firstUnresolved < 0 ? stages.length - 1 : stages.findIndex(stage => stage.id === nodes[firstUnresolved].stageId)
  const storageKey = 'math-textbook-compact-v1:' + unit.unitId + ':r' + unit.revision
  const [cursor, setCursor] = useState(() => {
    const raw = window.localStorage.getItem(storageKey)
    const value = raw === null ? 0 : Number(raw)
    return Number.isInteger(value) && value >= 0 ? Math.min(value, maxStage) : 0
  })
  const activeStage = Math.min(cursor, maxStage)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const flow = useRef<HTMLDivElement>(null)
  const stage = stages[activeStage]
  const stageNodes = nodes.filter(node => node.stageId === stage.id)
  const stageComplete = stageNodes.every(resolved)
  const activeItem = section.items.find(item => item.id === activeId)
  const activeNode = nodes.find(node => node.interaction?.id === activeId)
  const record = activeItem ? currentProgress?.answers[activeItem.id] : undefined
  const wrong = activeItem && record && !isTextbookItemResolved(activeItem, record)
  const activeChoices = activeItem ? getTextbookChoices(unit, { ...activeItem, scaffoldLevel: 'light' }) : []
  const firstCurrent = stageNodes.find(node => !resolved(node)) ?? stageNodes.at(-1)!
  const knownNodes = firstCurrent.knownRefs.flatMap(id => {
    const node = nodes.find(candidate => candidate.resultId === id)
    return node && nodes.indexOf(node) < frontier ? [node] : []
  })

  useEffect(() => { window.localStorage.setItem(storageKey, String(activeStage)) }, [storageKey, activeStage])
  useEffect(() => { onSummaryReached?.(firstUnresolved < 0 && activeStage === stages.length - 1) }, [firstUnresolved, activeStage, stages.length, onSummaryReached])

  function formula(block: Extract<TextbookReadingBlock, { type: 'formula' }>) {
    return <TextbookFormula key={block.id} unitId={unit.unitId} block={block} section={section} progress={currentProgress}
      onOpen={setActiveId} equationNumber={numbers[block.id]} />
  }
  function semanticParts(parts: { kind: string; id: string; text?: string; latex?: string; usage?: string }[]) {
    return parts.map(part => part.kind === 'math'
      ? { type: 'math' as const, latex: part.latex!, semanticId: part.id }
      : part.kind === 'term' ? { type: 'term' as const, text: part.text!, semanticId: part.id, usage: part.usage as 'first_definition' }
        : { type: 'text' as const, text: part.text!, semanticId: part.id })
  }
  function displayText(parts: { kind: string; id: string; text?: string; latex?: string; usage?: string }[] | undefined, fallback: string) {
    return parts ? <SemanticReading parts={semanticParts(parts)} renderChoice={() => null} /> : fallback
  }
  function table(node: Node) {
    return node.table && <div className="n07-table-wrap"><table data-testid="n07-remainder-table">
      <caption>商と余りの記録</caption><thead><tr>{node.table[0].map(cell => <th key={cell} scope="col">{cell}</th>)}</tr></thead>
      <tbody>{node.table.slice(1).map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody>
    </table></div>
  }
  function result(node: Node) {
    return <div key={node.resultId} data-result-source={node.resultId} className="n07-result">
      <p className="n07-source-question">{displayText(n07Presentation.semanticDisplay[node.id as keyof typeof n07Presentation.semanticDisplay].sourceQuestionParts, '')}</p>
      {n07Presentation.semantic.nodes.find(candidate => candidate.id === node.id)?.before
        .filter(block => block.id.endsWith('-interaction')).map(block => renderBlock(block as TextbookReadingBlock))}
      {n07Presentation.semantic.nodes.find(candidate => candidate.id === node.id)?.after.map(block => renderBlock(block as TextbookReadingBlock))}
      {node.id === 'n07-q02-remainder-1' && <p className="reading-paragraph"><InlineMath math="23\div11" /> の整数部分は2、最初の余りは1です。</p>}
      {table(node)}
    </div>
  }
  function choicePanel(item: TextbookItem) {
    if (activeId !== item.id) return null
    const reasons: Record<string, string | undefined> = activeNode?.interaction?.distractorReasons ?? {}
    return <div key={item.id} className="reading-inline-choice-panel" data-testid={'inline-choice-panel-' + item.id}>
      <p>{item.prompt}</p>
      {activeNode && n07Presentation.semanticDisplay[activeNode.id as keyof typeof n07Presentation.semanticDisplay].taskDomain &&
        <p className="n07-task-domain">10、100、1000、…倍のうち、小数部分がそろう最小の倍率を選びます。</p>}
      {wrong && <aside className="reading-choice-hint" data-testid={'textbook-hint-' + item.id}>
        <strong>{text('もう一度考えよう', '再想一想')}</strong>
        <span>{activeNode && displayText((n07Presentation.semanticDisplay[activeNode.id as keyof typeof n07Presentation.semanticDisplay].distractorDisplayParts as Record<string, DisplayParts>)[record.value], reasons[record.value] ?? '')} {activeNode && displayText(n07Presentation.semanticDisplay[activeNode.id as keyof typeof n07Presentation.semanticDisplay].hintDisplayParts[0], item.hints[0])}</span>
      </aside>}
      <div className="reading-choice-options n07-choice-options" role="group" aria-label={item.prompt}>
        {activeChoices.map((choice, index) => <button type="button" key={choice} aria-label={choice}
          className="reading-choice-option" data-testid={'textbook-choice-' + item.id + '-' + index}
          aria-invalid={wrong && record.value === choice || undefined}
          onClick={() => {
            if (onReviewAnswer) onReviewAnswer(item, choice)
            else answerTextbook(unit, item.id, choice)
            if (choice === item.answer || item.acceptedAnswers.includes(choice)) setActiveId(null)
          }}>
          <span>{index + 1}</span><strong>{item.answerType === 'formula'
            ? <TypesetFormula source={choice} sourceId={'choice-' + item.id + '-' + index} unitId={unit.unitId} /> : displayText(activeNode ? (n07Presentation.semanticDisplay[activeNode.id as keyof typeof n07Presentation.semanticDisplay].choiceDisplayParts as Record<string, DisplayParts>)[choice] : undefined, choice)}</strong>
        </button>)}
      </div>
    </div>
  }
  function renderBlock(block: TextbookReadingBlock) {
    if (block.type === 'formula') return <div key={block.id} data-formula-semantic-parts={JSON.stringify(block.parts)}>{formula(block)}{block.parts.flatMap(part => part.type === 'choice'
      ? [choicePanel(section.items.find(item => item.id === part.itemId)!)] : [])}</div>
    if (block.type === 'paragraph') return <div key={block.id}><p className="reading-paragraph"><SemanticReading parts={block.parts} renderChoice={itemId => {
      const item = section.items.find(item => item.id === itemId)!
      const answer = currentProgress?.answers[item.id]
      return isTextbookItemResolved(item, answer)
        ? <span className="reading-inline-answer" data-testid={'resolved-' + item.id}>{item.answerType === 'formula'
          ? <InlineMath math={answer!.value} /> : displayText((n07Presentation.semanticDisplay[nodes.find(candidate => candidate.interaction?.id === itemId)!.id as keyof typeof n07Presentation.semanticDisplay].choiceDisplayParts as Record<string, DisplayParts>)[answer!.value], answer!.value)}</span>
        : <button type="button" className={'reading-inline-blank' + (answer ? ' reading-inline-blank--wrong' : '')}
          data-testid={'textbook-item-' + item.id} aria-label={item.prompt} onClick={() => setActiveId(item.id)}>{answer ? text('もう一度', '再选一次') : text('選択', '选择')}</button>
    }} /></p>{block.parts.flatMap(part => part.type === 'choice' ? [choicePanel(section.items.find(item => item.id === part.itemId)!)] : [])}</div>
    return null
  }
  function renderNode(node: Node, history = false) {
    const compiled = n07Presentation.semantic.nodes.find(candidate => candidate.id === node.id)!
    const visible = history || resolved(node) ? [...compiled.before, ...compiled.after] : compiled.before
    return <div className="n07-thinking-step" key={node.id} data-node-id={node.id}>
      <div className="n07-step-caption"><span>{node.role === 'example' ? '今すること' : roles[node.role] ?? '確認'}</span><strong>{node.goal}</strong></div>
      {visible.map(block => renderBlock(block as TextbookReadingBlock))}
      {(history || resolved(node)) && table(node)}
    </div>
  }
  return <div ref={flow} className="textbook-reading-flow n07-reading" data-typeset-theme="true" data-testid="textbook-reading-flow" tabIndex={-1}>
    <div className="math-textbook-reading-controls"><span>{text('今の段階', '当前阶段')} {activeStage + 1} / {stages.length}</span>
      {activeStage > 0 && <button type="button" onClick={() => setShowHistory(value => !value)} data-testid="n07-history-toggle">{showHistory ? text('履歴を閉じる', '收起记录') : text('前の段階を見る', '查看之前的阶段')}</button>}
    </div>
    {showHistory && <div className="n07-history"><button type="button" onClick={() => setExpandAll(value => !value)}>{expandAll ? text('全文を閉じる', '收起全文') : text('全文を開く', '展开全文')}</button>
      {stages.slice(0, activeStage).map((past, index) => {
        const previous = nodes.filter(node => node.stageId === past.id)
        return <section key={past.id} data-testid={'recorded-results-' + past.id} className="first-theme-recorded-results">
          <h3>{index + 1}. {previous[0].goal}</h3>{result(previous.at(-1)!)}
          {expandAll ? previous.map(node => renderNode(node, true)) : <details><summary>{text('全文を見る', '查看全文')}</summary>{previous.map(node => renderNode(node, true))}</details>}
        </section>
      })}
    </div>}
    <section className="math-textbook-stage math-textbook-stage--current" data-testid={'math-textbook-stage-' + stage.id}>
      <div className="n07-source-question" data-testid="n07-source-question"><strong>元の問題・考える対象</strong><p>{displayText(n07Presentation.semanticDisplay[stageNodes[0].id as keyof typeof n07Presentation.semanticDisplay].sourceQuestionParts, '')}</p></div>
      <header className="math-textbook-stage-active-title"><strong>{stageNodes[0].goal}</strong><small>{activeStage + 1} / {stages.length}</small></header>
      {knownNodes.length > 0 && <aside className="math-textbook-stage-references" data-testid="math-textbook-stage-references">
        <strong>{text('使う条件・前の結果', '需要的条件与之前的结果')}</strong>{knownNodes.map(node => result(node))}
      </aside>}
      {stageNodes.filter(node => nodes.indexOf(node) <= frontier).map(node => renderNode(node))}
      {stageComplete && activeStage < stages.length - 1 && <button type="button" className="math-textbook-next-stage" data-testid="math-textbook-next-stage" onClick={() => {
        setCursor(activeStage + 1); setActiveId(null); setShowHistory(false); setExpandAll(false)
        requestAnimationFrame(() => { flow.current?.focus({ preventScroll: true }); flow.current?.scrollIntoView({ block: 'start' }) })
      }}>{text('次へ', '下一步')}</button>}
      {firstUnresolved < 0 && activeStage === stages.length - 1 && <p data-testid="n07-complete">{text('ここまでの学習を終えました。', '已完成本节学习。')}</p>}
    </section>
  </div>
}
