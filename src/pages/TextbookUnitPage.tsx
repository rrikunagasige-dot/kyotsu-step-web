import { N08ReadingFlow } from '../components/textbook/N08ReadingFlow'
import { N07ReadingFlow } from '../components/textbook/N07ReadingFlow'
import { typesettingEnabled } from '../data/textbook/math/typesetting'
import { TypesetInlineMath } from '../components/textbook/TypesetFormula'
import { FirstThemeChoiceFormula } from '../components/textbook/FirstThemeChoiceFormula'
import { developmentFeedback } from '../data/textbook/math/numbers/developmentFeedback'
import { InlineMath } from 'react-katex'
import { Check, LockKeyhole, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TextbookFigure } from '../components/textbook/TextbookFigure'
import { TextbookFormula } from '../components/textbook/TextbookFormula'
import { ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { textbookRepository } from '../repositories/textbookRepository'
import { effectiveTextbookProgress, getTextbookChoices, isTextbookItemResolved, normalizeTextbookAnswer, textbookSectionProgress, textbookUnitProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../domain/textbook'
import type { TextbookItem, TextbookReadingBlock, TextbookReadingPart, TextbookSection, TextbookUnit } from '../domain/textbookSchema'
import { useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { normalizeTextbookMath } from '../domain/textbookMath'
import { textbookDisplayLines } from '../domain/textbookDisplayLines'
import { chapter1ChunkForUnitCode, chapter1Localized, chapter1NextUnit } from '../data/textbook/ch01/chapter1Architecture'
import { mathTextbookNextUnitId, mathTextbookTopicForUnit } from '../data/textbook/math'
import { partitionMathSetReadingFlow, requiredMathSetContext, partitionFirstThemeReadingFlow, requiredFirstThemeContext, firstThemeRecordedResults, firstThemeSourceView, isFirstThemeUnit } from '../data/textbook/math/presentation'

function interactionPrompt(item: TextbookItem, text: (ja: string, zh: string) => string, subject: TextbookUnit['subject']) {
  switch (item.purpose) {
    case 'concept-formation': return text('図や本文から意味を考えよう。', '根据图和正文思考含义。')
    case 'representation-link': return text('図・言葉・式のつながりを考えよう。', '思考图、文字和公式之间的联系。')
    case 'definition': return text('意味から関係を作ろう。', '从含义出发建立关系。')
    case 'solution-planning': return text('次に何を考えるべきか選ぼう。', '选择下一步应该思考什么。')
    case 'transfer': return text('ここまでの考え方を使ってみよう。', '用前面学过的思路来判断。')
    case 'relation-selection': return text('ここで使う関係を選ぼう。', '选择这里应该使用的关系。')
    case 'physical-condition': return text('この場面で成り立つ物理条件を考えよう。', '思考这个情境下成立的物理条件。')
    case 'graph-reading': return text('グラフが表している物理量を読もう。', '读取图像所表示的物理量。')
    case 'elimination': return text('どの関係を使って変数を消すか考えよう。', '思考用哪个关系消去变量。')
    case 'factorization': return text('次の式変形の意味を考えよう。', '思考下一步式变形的意义。')
    case 'causal-reasoning': return subject === 'math-1a'
      ? text('条件や理由のつながりをたどろう。', '沿着条件与理由的联系思考。')
      : text('変化の因果関係をたどろう。', '沿着变化的因果关系思考。')
    default: return item.prompt
  }
}

function readingGroupItemIds(blocks: TextbookReadingBlock[], section: TextbookSection) {
  return blocks.flatMap((block) => {
    if (block.type === 'paragraph' || block.type === 'formula') {
      return block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
    }
    if (block.type === 'figure') {
      return section.figures
        .find((figure) => figure.id === block.figureId)
        ?.overlays.filter((overlay) => overlay.interactive !== false).map((overlay) => overlay.itemId) ?? []
    }
    return []
  })
}

function groupReadingFlow(blocks: TextbookReadingBlock[]) {
  const groups: TextbookReadingBlock[][] = []
  let current: TextbookReadingBlock[] = []

  for (const block of blocks) {
    if (block.type === 'heading' && current.some((candidate) => candidate.type === 'heading')) {
      groups.push(current)
      current = []
    }
    current.push(block)
  }
  if (current.length) groups.push(current)
  return groups
}

function renderResolvedChoice(item: TextbookItem, record: TextbookAnswerRecord) {
  return (
    <span className="reading-inline-answer" data-testid={`resolved-${item.id}`}>
      {item.answerType === 'formula'
        ? (() => {
          const lines = textbookDisplayLines(item.id, record.value)
          return lines.length > 1
            ? <span className="reading-formula-n12-answer-lines">
                {lines.map((line, i) => <span key={i}><InlineMath math={normalizeTextbookMath(line)} /></span>)}
              </span>
            : <InlineMath math={normalizeTextbookMath(record.value)} />
        })()
        : <>{record.value}</>}
    </span>
  )
}

function renderActiveChoice(
  item: TextbookItem,
  isWrong: boolean,
  onOpen: (itemId: string) => void,
  text: (ja: string, zh: string) => string,
) {
  return (
    <button
      type="button"
      data-testid={`textbook-item-${item.id}`}
      className={`reading-inline-blank${isWrong ? ' reading-inline-blank--wrong' : ''}`}
      onClick={() => onOpen(item.id)}
      aria-label={item.prompt}
    >
      {isWrong && <X size={14} aria-hidden="true" />}
      <strong>{isWrong ? text('もう一度', '重新选择') : text('選択', '选择')}</strong>
    </button>
  )
}

function renderPart(
  part: TextbookReadingPart,
  section: TextbookSection,
  progress: TextbookUnitProgress | undefined,
  onOpen: (itemId: string) => void,
  text: (ja: string, zh: string) => string,
): ReactNode {
  if (part.type === 'text') return part.text
  if (part.type === 'term') return <strong className="reading-term">{part.text}</strong>
  if (part.type === 'math') return <InlineMath math={part.latex} />

  const item = section.items.find((candidate) => candidate.id === part.itemId)
  if (!item) return null
  const record = progress?.answers[item.id]
  if (isTextbookItemResolved(item, record)) return renderResolvedChoice(item, record!)
  return renderActiveChoice(item, Boolean(record), onOpen, text)
}

type ReadingFlowProps = {
  unit: TextbookUnit
  section: TextbookSection
  progress: TextbookUnitProgress | undefined
  onSummaryReached?: (reached: boolean) => void
  /** Isolated preview: grade the real item without touching persisted learner progress. */
  onReviewAnswer?: (item: TextbookItem, choice: string) => void
  /** Never passed by the ordinary learner route; visual annotations only. */
  reviewMarks?: Readonly<Record<string, number>>
}

export function TextbookReadingFlow(props: ReadingFlowProps) {
  return props.unit.unitId === 'math-numbers-expressions-n07' && props.unit.revision === 4
    ? <N07ReadingFlow {...props} />
    : props.unit.unitId === 'math-numbers-expressions-n08' && props.unit.revision === 4
      ? <N08ReadingFlow {...props} /> : <LegacyTextbookReadingFlow {...props} />
}

function LegacyTextbookReadingFlow({ unit, section, progress, onSummaryReached, onReviewAnswer, reviewMarks }: ReadingFlowProps) {
  const { text, language } = useI18n()
  const answerTextbook = useAppStore((state) => state.answerTextbook)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const groups = useMemo(() => groupReadingFlow(section.readingFlow), [section.readingFlow])
  const currentProgress = progress?.unitRevision === unit.revision ? progress : undefined

  const firstIncompleteGroup = groups.findIndex((group) => {
    const itemIds = readingGroupItemIds(group, section)
    return itemIds.length > 0 && itemIds.some((itemId) => {
      const item = section.items.find((candidate) => candidate.id === itemId)
      return !item || !isTextbookItemResolved(item, currentProgress?.answers[itemId])
    })
  })
  const visibleGroupCount = firstIncompleteGroup === -1 ? groups.length : firstIncompleteGroup + 1
  const visibleGroups = groups.slice(0, visibleGroupCount)


  // Sets and the repaired first theme use authored semantic stages.
  // Presentation never deletes source blocks or skips unresolved choices.
  const compactStages = useMemo(
    () => unit.subject === 'math-1a' && unit.unitId === 'math-sets' && unit.status === 'published' && section.id === 'lesson'
      ? partitionMathSetReadingFlow(section.readingFlow)
      : section.id === 'lesson' ? partitionFirstThemeReadingFlow(unit.unitId, section.readingFlow) : null,
    [unit.subject, unit.unitId, unit.status, section.id, section.readingFlow],
  )
  const [compactCursor, setCompactCursor] = useState(0)
  const [showPastHistory, setShowPastHistory] = useState(false)
  const [expandedPastStages, setExpandedPastStages] = useState<readonly string[]>([])
  const [expandAllPast, setExpandAllPast] = useState(false)
  const [expandedReference, setExpandedReference] = useState<string | null>(null)
  const compactKey = 'math-textbook-compact-v1:' + unit.unitId + ':r' + unit.revision
  const firstIncompleteCompactIndex = compactStages?.findIndex(stage => {
    const itemIds = readingGroupItemIds([...stage.blocks], section)
    return itemIds.some(id => {
      const item = section.items.find(candidate => candidate.id === id)
      return !item || !isTextbookItemResolved(item, currentProgress?.answers[id])
    })
  }) ?? -1
  const maxAvailableCompactIndex = compactStages
    ? firstIncompleteCompactIndex === -1 ? compactStages.length - 1 : firstIncompleteCompactIndex
    : 0
  const activeCompactIndex = Math.min(compactCursor, maxAvailableCompactIndex)
  const allMathSetItemsResolved = compactStages !== null && currentProgress !== undefined &&
    section.items.every(item => isTextbookItemResolved(item, currentProgress.answers[item.id]))

  useEffect(() => {
    if (!compactStages) return
    const stored = window.localStorage.getItem(compactKey)
    const candidate = stored !== null ? Number(stored) : Math.max(0, maxAvailableCompactIndex - 1)
    const safe = Number.isInteger(candidate) && candidate >= 0
      ? Math.min(candidate, maxAvailableCompactIndex)
      : 0
    // A reset may make the saved stage unreachable; discard that stale cursor.
    if (stored !== null && Number(stored) > maxAvailableCompactIndex) {
      window.localStorage.setItem(compactKey, String(safe))
    }
    setCompactCursor(safe)
  }, [compactKey, maxAvailableCompactIndex, compactStages])

  useEffect(() => {
    if (compactStages) {
      onSummaryReached?.(allMathSetItemsResolved && activeCompactIndex === compactStages.length - 1)
    }
  }, [compactStages, activeCompactIndex, allMathSetItemsResolved, onSummaryReached])

  const goToNextCompactStage = () => {
    if (!compactStages) return
    const next = Math.min(activeCompactIndex + 1, maxAvailableCompactIndex)
    setCompactCursor(next)
    setShowPastHistory(false)
    setExpandedReference(null)
    setExpandedPastStages([])
    setExpandAllPast(false)
    window.localStorage.setItem(compactKey, String(next))
    window.requestAnimationFrame(() => {
      const nextSection = document.querySelector<HTMLElement>('[data-testid="math-textbook-stage-' + compactStages[next].id + '"]')
      nextSection?.focus({ preventScroll: true })
      nextSection?.scrollIntoView({ block: 'start', behavior: 'auto' })
    })
  }

  const activeItem = activeItemId ? section.items.find((item) => item.id === activeItemId) : undefined
  const activeRecord = activeItem ? currentProgress?.answers[activeItem.id] : undefined
  const activeChoices = activeItem ? getTextbookChoices(unit, activeItem) : []
  // Wide mathematical alternatives must not be forced into two narrow cards.
  // This is a presentation-only decision; original answer/choice strings are preserved.
  const wideMathChoices = unit.subject === 'math-1a'
    && activeItem?.answerType === 'formula'
    && activeChoices.some(choice => choice.length > 27 || choice.includes('\\quad'))
  const activeHint = activeItem && activeRecord && !isTextbookItemResolved(activeItem, activeRecord) && activeRecord.attemptCount > 0 && activeItem.hints.length
    ? [developmentFeedback(activeItem.id, activeRecord.value), activeItem.hints[Math.min(activeRecord.attemptCount - 1, activeItem.hints.length - 1)]].filter(Boolean).join(' ')
    : undefined
  const continuousLesson = unit.sections.length === 1 && section.id === 'lesson'

  const visibleBlocksInGroup = (group: TextbookReadingBlock[]) => {
    const firstBlockedIndex = group.findIndex((block) => {
      const itemIds = readingGroupItemIds([block], section)
      return itemIds.some((itemId) => {
        const item = section.items.find((candidate) => candidate.id === itemId)
        return !item || !isTextbookItemResolved(item, currentProgress?.answers[itemId])
      })
    })
    return firstBlockedIndex === -1 ? group : group.slice(0, firstBlockedIndex + 1)
  }

  const selectChoice = (choice: string) => {
    if (!activeItem || isTextbookItemResolved(activeItem, activeRecord)) return
    if (onReviewAnswer) onReviewAnswer(activeItem, choice)
    else answerTextbook(unit, activeItem.id, choice)
    setActiveItemId(null)
  }

  const blockContainsActiveItem = (block: TextbookReadingBlock) => {
    if (!activeItemId) return false
    if (block.type === 'paragraph' || block.type === 'formula') {
      return block.parts.some((part) => part.type === 'choice' && part.itemId === activeItemId)
    }
    if (block.type === 'figure') {
      return Boolean(
        section.figures
          .find((figure) => figure.id === block.figureId)
          ?.overlays.some((overlay) => overlay.itemId === activeItemId),
      )
    }
    return false
  }

  const renderInlineChoicePanel = (block: TextbookReadingBlock) => {
    if (!activeItem || !blockContainsActiveItem(block)) return null
    return (
      <div className="reading-inline-choice-panel" data-testid={`inline-choice-panel-${activeItem.id}`}>
        <div className="reading-inline-choice-panel__head">
          <span>{(isFirstThemeUnit(unit.unitId) ? activeItem.prompt : interactionPrompt(activeItem, text, unit.subject))}</span>
        </div>
        {activeHint && (
          <div className="reading-choice-hint" data-testid={`textbook-hint-${activeItem.id}`}>
            <strong>{text('ヒント', '提示')}</strong>
            <span>{activeHint}</span>
          </div>
        )}
        <div
          className={`reading-choice-options${wideMathChoices ? ' reading-choice-options--math-wide' : ''}`}
          role="group"
          aria-label={(isFirstThemeUnit(unit.unitId) ? activeItem.prompt : interactionPrompt(activeItem, text, unit.subject))}
        >
          {activeChoices.map((choice, index) => {
            const isLastWrongChoice = unit.subject === 'math-1a'
              && Boolean(activeRecord)
              && !isTextbookItemResolved(activeItem, activeRecord)
              && normalizeTextbookAnswer(choice) === normalizeTextbookAnswer(activeRecord?.value ?? '')
            return (
            <button
              type="button"
              aria-label={choice}
              aria-invalid={isLastWrongChoice || undefined}
              key={choice}
              data-testid={`textbook-choice-${activeItem.id}-${index}`}
              className={`reading-choice-option${isLastWrongChoice ? ' reading-choice-option--wrong' : ''}`}
              onClick={() => selectChoice(choice)}
            >
              <span>{index + 1}</span>
              <strong>
                {activeItem.answerType === 'formula'
                  ? (isFirstThemeUnit(unit.unitId) ? <FirstThemeChoiceFormula itemId={activeItem.id} value={choice} /> :
                    <span className="reading-choice-formula-lines">
                      {textbookDisplayLines(activeItem.id, choice).flatMap(value => value.split('\\quad')).map((line, lineIndex) => (
                        <span className="reading-choice-formula-line" key={lineIndex}>
                          <InlineMath math={normalizeTextbookMath(line.trim())} />
                        </span>
                      ))}
                    </span>
                  )
                  : isFirstThemeUnit(unit.unitId) ? <span className="first-theme-choice-text">{choice.split('／').map((part,i)=><span key={i}>{part}</span>)}</span> : choice}
              </strong>
              {activeItem.unit && <small>{activeItem.unit}</small>}
            </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderBlock = (block: TextbookReadingBlock) => {
    if (block.type === 'heading') return <h3 className="reading-subheading" key={block.id}>{block.text}</h3>
    if (block.type === 'marker') {
      return (
        <div
          className={`reading-role-marker reading-role-marker--${block.kind}`}
          data-testid={`reading-role-${block.kind}-${block.id}`}
          key={block.id}
        >
          {block.text}
        </div>
      )
    }
    if (block.type === 'dialogue') {
      const speaker = block.speaker === 'hanako'
        ? text('花子', '花子')
        : block.speaker === 'taro'
          ? text('太郎', '太郎')
          : text('先生', '老师')
      return (
        <aside className="reading-dialogue" data-speaker={block.speaker} key={block.id}>
          <strong>{speaker}：</strong>
          <span>「{block.text}」</span>
        </aside>
      )
    }
    if (block.type === 'note') return <aside className="reading-note" key={block.id}>{block.text}</aside>

    if (block.type === 'figure') {
      const figure = section.figures.find((candidate) => candidate.id === block.figureId)
      if (!figure) return null
      return (
        <div className="reading-block-with-choice" key={block.id}>
          <TextbookFigure figure={figure} items={section.items} progress={currentProgress} onOpen={setActiveItemId} />
          {renderInlineChoicePanel(block)}
        </div>
      )
    }

    if (block.type === 'formula') {
      return (
        <div className="reading-block-with-choice" key={block.id}>
          <TextbookFormula block={block} section={section} progress={currentProgress} onOpen={setActiveItemId} unitId={unit.unitId} />
          {renderInlineChoicePanel(block)}
        </div>
      )
    }

    const content = block.parts.map((part, index) => (
      <span key={`${block.id}-part-${index}`}>
        {part.type === 'math' && typesettingEnabled(unit.unitId) ? <TypesetInlineMath latex={part.latex} sourceId={'inline-' + block.id + '-' + index} unitId={unit.unitId} /> : renderPart(part, section, currentProgress, setActiveItemId, text)}
      </span>
    ))

    return (
      <div className="reading-block-with-choice" key={block.id}>
        <p className="reading-paragraph">{content}</p>
        {renderInlineChoicePanel(block)}
      </div>
    )
  }

  const renderBlockWithReviewMark = (block: TextbookReadingBlock) => {
    const mark = reviewMarks?.[block.id]
    if (!mark) return renderBlock(block)
    return (
      <div className="review-marked-block" data-testid={`review-mark-${block.id}`} key={block.id}>
        <span className="review-marked-block__label" aria-label={`確認 ${mark}`}>
          確認{String.fromCharCode(0x2460 + mark - 1)}
        </span>
        {renderBlock(block)}
      </div>
    )
  }

  const renderVisibleBlocks = (blocks: TextbookReadingBlock[]) => {
    const rendered: ReactNode[] = []
    let index = 0

    while (index < blocks.length) {
      const block = blocks[index]
      const derivationId =
        block.type === 'paragraph' || block.type === 'formula' || block.type === 'note'
          ? block.derivationId
          : undefined

      if (derivationId) {
        const run: TextbookReadingBlock[] = []
        while (index < blocks.length) {
          const candidate = blocks[index]
          const candidateId =
            candidate.type === 'paragraph' || candidate.type === 'formula' || candidate.type === 'note'
              ? candidate.derivationId
              : undefined
          if (candidateId !== derivationId) break
          run.push(candidate)
          index += 1
        }

        rendered.push(
          <div className="reading-derivation-chain" data-derivation-id={derivationId} key={`derivation-${derivationId}`}>
            {run.map((entry) => (
              <div
                className={`reading-derivation-step reading-derivation-step--${entry.type}`}
                key={entry.id}
              >
                {renderBlockWithReviewMark(entry)}
              </div>
            ))}
          </div>,
        )
        continue
      }

      rendered.push(renderBlockWithReviewMark(block))
      index += 1
    }

    return rendered
  }

  // Read-only source views contain neither answer buttons nor duplicate answer IDs.
  // Never substitute an unresolved item with its answer, including old progress.
  const recordedBlock = (ref: string): TextbookReadingBlock | undefined => {
    const source = firstThemeSourceView(ref, section.readingFlow)
    if (!source) return undefined
    if (readingGroupItemIds([source], section).some(id => {
      const item = section.items.find(q => q.id === id)
      return !item || !isTextbookItemResolved(item, currentProgress?.answers[id])
    })) return undefined
    if (source.type !== 'formula' && source.type !== 'paragraph') return source
    return { ...source, id: 's5-record-' + ref, parts: source.parts.map(part => {
      if (part.type !== 'choice') return part
      const item = section.items.find(q => q.id === part.itemId)!
      const value = currentProgress!.answers[item.id].value
      return item.answerType === 'formula' ? { type: 'math' as const, latex: value } : { type: 'text' as const, text: value }
    }) }
  }

  const renderRecordedResults = (refs: readonly string[]) => refs.map(ref => {
    const block = recordedBlock(ref)
    return block ? <div key={ref} data-result-source={ref}>{renderBlock(block)}</div> : null
  })

  return (
    <article className="textbook-reading-flow" data-testid="textbook-reading-flow" data-first-theme={isFirstThemeUnit(unit.unitId) || undefined} data-typeset-theme={typesettingEnabled(unit.unitId) || undefined} tabIndex={-1}>
      {compactStages ? (
        <div className="math-textbook-compact-flow" data-testid="math-textbook-compact-flow">
          {activeCompactIndex > 0 && (
            <div className="math-textbook-history">
              <button
                type="button"
                className="math-textbook-history-toggle"
                data-testid="math-textbook-history-toggle"
                aria-expanded={showPastHistory}
                onClick={() => {
                  setShowPastHistory(value => !value)
                  setExpandAllPast(false)
                  setExpandedPastStages([])
                }}
              >
                <span>{text('これまでの学習', '之前的学习')}（{activeCompactIndex}{text('段階', '阶段')}）</span>
                <span aria-hidden="true">{showPastHistory ? '▲' : '▼'}</span>
              </button>
              {showPastHistory && (
                <button
                  type="button"
                  className="math-textbook-expand-all"
                  data-testid="math-textbook-expand-all"
                  aria-expanded={expandAllPast}
                  onClick={() => setExpandAllPast(value => !value)}
                >
                  {expandAllPast ? text('過去の学習を閉じる', '收起之前的学习') : text('過去の学習をすべて見る', '查看全部已学内容')}
                </button>
              )}
            </div>
          )}
          {compactStages.map((stage, index) => {
            if (index > activeCompactIndex || (index < activeCompactIndex && !showPastHistory)) return null
            const completedBefore = index < activeCompactIndex
            const expanded = expandAllPast || expandedPastStages.includes(stage.id)
            const stageItemIds = readingGroupItemIds([...stage.blocks], section)
            const currentQuestionId = stageItemIds.find(id => {
              const item = section.items.find(candidate => candidate.id === id)
              return !item || !isTextbookItemResolved(item, currentProgress?.answers[id])
            }) ?? null
            const neededContextIds = completedBefore ? [] : isFirstThemeUnit(unit.unitId) ? requiredFirstThemeContext(stage, section.readingFlow, currentQuestionId) : requiredMathSetContext(currentQuestionId)
            const resultIds = isFirstThemeUnit(unit.unitId) ? firstThemeRecordedResults(stage, section.readingFlow) : []
            const stageAnswered = stageItemIds.every(id => {
              const item = section.items.find(candidate => candidate.id === id)
              return Boolean(item && isTextbookItemResolved(item, currentProgress?.answers[id]))
            })
            return (
              <section
                key={stage.id}
                className={'math-textbook-stage' + (completedBefore ? ' math-textbook-stage--past' : ' math-textbook-stage--current')}
                data-testid={'math-textbook-stage-' + stage.id}
                tabIndex={completedBefore ? undefined : -1}
              >
                {completedBefore ? (
                  <>
                    <div className="math-textbook-stage-summary">
                      <span className="math-textbook-stage-summary__name">
                        <Check size={16} aria-hidden="true" />
                        {resultIds.length ? stage.label[language] : stage.completedLabel ?? stage.label[language]}
                      </span>
                      <button
                        type="button"
                        className="math-textbook-stage-toggle"
                        data-testid={'math-textbook-toggle-' + stage.id}
                        aria-expanded={expanded}
                        aria-controls={'math-textbook-stage-detail-' + stage.id}
                        onClick={() => setExpandedPastStages(current => current.includes(stage.id)
                          ? current.filter(id => id !== stage.id)
                          : [...current, stage.id])}
                      >
                        {expanded ? text('閉じる', '收起') : text('全文を見る', '查看全文')}
                      </button>
                    </div>
                    {resultIds.length > 0 && (
                      <div className="first-theme-recorded-results" data-testid={'recorded-results-' + stage.id}>
                        {renderRecordedResults(resultIds)}
                      </div>
                    )}
                    {expanded && (
                      <div className="math-textbook-stage-detail" id={'math-textbook-stage-detail-' + stage.id}>
                        {renderVisibleBlocks([...stage.blocks])}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <header className="math-textbook-stage-active-title">
                      <strong>{stage.label[language]}</strong>
                      <small>{index + 1} / {compactStages.length}</small>
                    </header>
                    {neededContextIds.length > 0 && (
                      <div className="math-textbook-stage-references" data-testid="math-textbook-stage-references" data-for-item={currentQuestionId ?? undefined}>
                        <strong className="math-textbook-stage-references__title">{isFirstThemeUnit(unit.unitId) ? text('使う条件・前の結果', '需要的条件与之前的结果') : text('この問題で使う条件', '本题需要的条件')}</strong>
                        {neededContextIds.map(blockId => {
                          const source = isFirstThemeUnit(unit.unitId) ? recordedBlock(blockId) : section.readingFlow.find(block => block.id === blockId)
                          if (!source) return null
                          const isFigure = source.type === 'figure'
                          const open = expandedReference === blockId
                          return (
                            <div className="math-textbook-stage-reference" key={blockId} data-testid={'math-textbook-context-' + blockId}>
                              {isFigure ? (
                                // This pre-existing, already-learned complement diagram is necessary
                                // for d08–d10. Keep other figures optional to avoid long pages.
                                blockId === 'figure-d-complement' ? (
                                  <div className="math-textbook-stage-reference-content math-textbook-stage-reference-content--figure" data-testid={'math-textbook-reference-' + blockId}>
                                    {renderBlock(source)}
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      data-testid={'math-textbook-reference-' + blockId}
                                      aria-expanded={open}
                                      onClick={() => setExpandedReference(open ? null : blockId)}
                                    >
                                      {open ? text('図を閉じる', '收起图形') : text('前に学んだ図を見る', '查看之前学过的图形')}
                                    </button>
                                    {open && <div className="math-textbook-stage-reference-content">{renderBlock(source)}</div>}
                                  </>
                                )
                              ) : (
                                <div className="math-textbook-stage-reference-content" data-testid={'math-textbook-reference-' + blockId}>
                                  {renderBlock(source)}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {renderVisibleBlocks(visibleBlocksInGroup([...stage.blocks]).filter(block => !(isFirstThemeUnit(unit.unitId) && block.id === stage.startBlockId && block.type === 'heading')))}
                    {stageAnswered && resultIds.length > 0 && (
                      <aside className="first-theme-recorded-results first-theme-recorded-results--current" data-testid={'recorded-results-' + stage.id}>
                        <strong>{text('この段階で確かめたこと', '本阶段确认的内容')}</strong>
                        {renderRecordedResults(resultIds)}
                      </aside>
                    )}
                    {stageAnswered && index < compactStages.length - 1 && (
                      <div className="math-textbook-next-stage-panel">
                        <span>{text('ここまでの本文と図を確認したら、次へ進めます。', '读完本段正文和图后，可以继续下一段。')}</span>
                        <button
                          type="button"
                          className="math-textbook-next-stage"
                          data-testid="math-textbook-next-stage"
                          onClick={goToNextCompactStage}
                        >
                          {text('次へ', '下一步')}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            )
          })}
        </div>
      ) : visibleGroups.map((group, groupIndex) => {
        const groupItemIds = readingGroupItemIds(group, section)
        const completed = groupItemIds.length > 0 && groupItemIds.every((itemId) => {
          const item = section.items.find((candidate) => candidate.id === itemId)
          return Boolean(item && isTextbookItemResolved(item, currentProgress?.answers[itemId]))
        })
        return (
          <section className="reading-subsection" data-testid={`reading-subsection-${groupIndex}`} key={group[0]?.id ?? groupIndex}>
            {renderVisibleBlocks(visibleBlocksInGroup(group))}
            {!continuousLesson && completed && groupIndex < groups.length - 1 && (
              <div className="reading-subsection-complete">
                <Check size={16} aria-hidden="true" />
                <span>{text('この小節を完了しました。次の小節へ進めます。', '本小节已完成，可以继续下一小节。')}</span>
              </div>
            )}
          </section>
        )
      })}
    </article>
  )
}

export function TextbookUnitPage() {
  const { unitId = '' } = useParams()
  const [unit, setUnit] = useState<TextbookUnit | null | undefined>(undefined)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const [visibleThroughIndex, setVisibleThroughIndex] = useState(0)
  const [mathSummaryReached, setMathSummaryReached] = useState(false)
  const [restartEpoch, setRestartEpoch] = useState(0)
  const initializedUnitRef = useRef<string | null>(null)
  const savedProgress = useAppStore((state) => state.textbookProgress[unitId])
  const progress = useMemo(() => unit ? effectiveTextbookProgress(unit, savedProgress) : savedProgress, [unit, savedProgress])
  useEffect(() => setMathSummaryReached(false), [unitId])
  const resetTextbookUnit = useAppStore((state) => state.resetTextbookUnit)
  const { language, text } = useI18n()

  useEffect(() => {
    let active = true
    textbookRepository.getById(unitId).then((value) => {
      if (active) setUnit(value ?? null)
    })
    return () => { active = false }
  }, [unitId])

  const firstIncompleteIndex = useMemo(() => {
    if (!unit) return 0
    const index = unit.sections.findIndex((section) => textbookSectionProgress(unit, progress, section.id).completed < section.items.length)
    return index === -1 ? unit.sections.length - 1 : index
  }, [progress, unit])

  useEffect(() => {
    if (!unit || initializedUnitRef.current === unitId) return
    initializedUnitRef.current = unitId
    setSelectedSectionIndex(firstIncompleteIndex)
    setVisibleThroughIndex(firstIncompleteIndex)
  }, [firstIncompleteIndex, unit, unitId])

  if (unit === undefined) return <div className="state-panel"><span className="state-panel__mark">…</span><h2>{text('教材を読み込んでいます', '正在加载教材')}</h2></div>
  if (!unit) return <ErrorState title={text('教材が見つかりません', '找不到教材')} body={text('この教材は削除されたか、まだ公開されていません。', '该教材可能已被删除或尚未发布。')} action={<Link className="raised-link" to="/learning/setup">{text('学習設定へ戻る', '返回学习设置')}</Link>} />

  const summary = textbookUnitProgress(unit, progress)
  const continuousLesson = unit.sections.length === 1 && unit.sections[0]?.id === 'lesson'
  const unitCode = unit.chapter?.unitCode
  const legacyPrefix = unitCode?.slice(-1)
  const displayTitle = legacyPrefix && unit.title.startsWith(`${legacyPrefix} `)
    ? unit.title.slice(legacyPrefix.length + 1)
    : unit.title
  const chapterChunk = unit.subject === 'physics' ? chapter1ChunkForUnitCode(unitCode) : undefined
  const mathNumbersChunk = unit.chapter?.chapterId === 'math-ch01-numbers-expressions'
    ? mathTextbookTopicForUnit(unit.unitId)
    : undefined
  const majorTitle = chapterChunk
    ? chapter1Localized(chapterChunk.title, language)
    : mathNumbersChunk?.label[language] ?? displayTitle
  const nextChapter1Unit = unit.subject === 'physics' ? chapter1NextUnit(unitCode) : undefined
  const nextMathUnitId = unit.subject === 'math-1a' ? mathTextbookNextUnitId(unit.unitId) : undefined
  const setupReturnPath = unit.subject === 'math-1a' ? '/learning/setup?subject=math-1a' : '/learning/setup'
  const subjectEyebrow = unit.subject === 'math-1a' ? 'MATH I+A' : 'PHYSICS'
  const unitComplete = summary.completed === summary.total
  const canOpen = (index: number) => unitComplete || index <= firstIncompleteIndex

  const restartFromBeginning = () => {
    if (!window.confirm(text('この単元の進捗を最初からやり直しますか？', '确定要清空本单元进度并重新开始吗？'))) return
    resetTextbookUnit(unit.unitId, unit)
    initializedUnitRef.current = null
    setSelectedSectionIndex(0)
    setVisibleThroughIndex(0)
    window.localStorage.removeItem('math-textbook-compact-v1:' + unit.unitId + ':r' + unit.revision)
    setRestartEpoch(epoch => epoch + 1)
    window.requestAnimationFrame(() => {
        const first = document.querySelector<HTMLElement>('[data-testid="textbook-reading-flow"]')
        first?.focus({ preventScroll: true })
        window.scrollTo({ top: 0, behavior: 'auto' })
    })
  }

  const scrollToSection = (index: number) => {
    window.setTimeout(() => {
      document.getElementById(`textbook-section-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  const openSection = (index: number) => {
    if (!canOpen(index)) return
    setSelectedSectionIndex(index)
    setVisibleThroughIndex((current) => Math.max(current, index))
    scrollToSection(index)
  }

  const goNext = (fromIndex: number) => {
    const nextIndex = Math.min(unit.sections.length - 1, fromIndex + 1)
    setSelectedSectionIndex(nextIndex)
    setVisibleThroughIndex((current) => Math.max(current, nextIndex))
    scrollToSection(nextIndex)
  }

  return (
    <div className="page-stack textbook-page" data-textbook-subject={unit.subject}>
      <header className="session-header">
        <div>
          <p className="eyebrow">
            {unit.chapter
              ? `TEXTBOOK / ${subjectEyebrow} / CHAPTER ${unit.chapter.chapterNumber}`
              : `TEXTBOOK / ${subjectEyebrow}`}
          </p>
          <h1>{majorTitle}</h1>
          {(chapterChunk || mathNumbersChunk) && (
            <p className="textbook-current-topic" data-testid="textbook-current-topic">
              <span>{text('現在', '当前')}</span>
              <strong>{displayTitle}</strong>
            </p>
          )}
          {unit.subtitle && <p>{unit.subtitle}</p>}
        </div>
        {!continuousLesson && <StatusBadge>{text(`第 ${unit.revision} 版`, `第 ${unit.revision} 版`)}</StatusBadge>}
      </header>

      <ProgressBar label={text('単元の進み具合', '单元进度')} value={summary.completed} max={summary.total} />
      {(unit.unitId === 'math-numbers-expressions-n12' || isFirstThemeUnit(unit.unitId)) && (
        <button type="button" className="n12-restart-top" data-testid={unit.unitId === 'math-numbers-expressions-n12' ? 'n12-restart-top' : 'first-theme-restart-top'} onClick={restartFromBeginning}>
          <RotateCcw size={15} aria-hidden="true" /> {text('この単元を最初から', '本单元重新开始')}
        </button>
      )}

      {isFirstThemeUnit(unit.unitId) && (
        <p className="first-theme-blank-guide">{text('式や文章の「選択」をタップして、空欄に入る数・符号・式を選びます。回答すると、その場所に答えが入ります。', '点击公式或文字中的“选择”，选出填入空白处的内容。回答后会在原处显示答案。')}</p>
      )}

      {unit.unitId === 'math-numbers-expressions-n12' && unit.revision === 3 && progress?.migratedFromRevision !== undefined && (
        <p className="n12-progress-upgrade-note" data-testid="n12-progress-upgrade-note">
          {text(
            'N12は新しい版です。以前の回答は履歴として保存し、最初の問題からすべて解き直します。',
            'N12已更新。以前的答案已保存为历史记录，本次从第一道题重新开始。',
          )}
        </p>
      )}

      {['math-numbers-expressions-n01', 'math-numbers-expressions-n03'].includes(unit.unitId)
        && unit.revision === 2 && progress?.migratedFromRevision === 1 && (
        <p className="n12-progress-upgrade-note" data-testid="r3-progress-upgrade-note">
          {text(
            '以前に解いた原問題の解答履歴は保存されています。追加した式内の計算穴だけ、順番に完成させてください。',
            '之前完成的原题答案和记录已保留。请依次完成新增的公式内部计算填空。',
          )}
        </p>
      )}

      <section className="textbook-objectives">
        <strong>{text('この単元で確認すること', '本单元确认内容')}</strong>
        <ol>{unit.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol>
      </section>

      {!continuousLesson && <nav className="textbook-section-nav" aria-label={text('単元内の節', '单元内章节')}>
        {unit.sections.map((section, index) => {
          const sectionProgress = textbookSectionProgress(unit, progress, section.id)
          const complete = sectionProgress.completed === sectionProgress.total
          const allowed = canOpen(index)
          return (
            <button
              type="button"
              key={section.id}
              disabled={!allowed}
              aria-pressed={selectedSectionIndex === index}
              onClick={() => openSection(index)}
            >
              <span>{complete ? <Check size={16} aria-hidden="true" /> : allowed ? section.number : <LockKeyhole size={15} aria-hidden="true" />}</span>
              <strong>{section.title}</strong>
              <small>{sectionProgress.completed}/{sectionProgress.total}</small>
            </button>
          )
        })}
      </nav>}

      <div className="textbook-section-stack" data-testid="textbook-section-stack">
        {unit.sections.slice(0, visibleThroughIndex + 1).map((section, index) => {
          const sectionSummary = textbookSectionProgress(unit, progress, section.id)
          const sectionComplete = sectionSummary.completed === sectionSummary.total
          const isLastVisible = index === visibleThroughIndex

          return (
            <section
              className="textbook-section"
              data-testid={`textbook-section-${section.id}`}
              id={`textbook-section-${index}`}
              key={section.id}
            >
              {!continuousLesson && (
                <header className="textbook-section-heading">
                  <div><span>{section.number}</span><div><h2>{section.title}</h2>{section.description && <p>{section.description}</p>}</div></div>
                  <strong>{sectionSummary.completed}/{sectionSummary.total}</strong>
                </header>
              )}

              {section.readingFlow.length > 0
                ? <TextbookReadingFlow key={`${unit.unitId}-${section.id}-restart-${restartEpoch}`} unit={unit} section={section} progress={progress} onSummaryReached={setMathSummaryReached} />
                : null}

              {!continuousLesson && sectionComplete && !unitComplete && isLastVisible && index < unit.sections.length - 1 && (
                <div className="textbook-next-panel">
                  <Check size={22} aria-hidden="true" />
                  <div><strong>{text('この節は完了しました', '本节已完成')}</strong><small>{text('前の本文と図を残したまま、次の節を下に開きます。', '保留前面的正文和图片，并在下方打开下一节。')}</small></div>
                  <RaisedButton data-testid="textbook-next-section" onClick={() => goNext(index)}>{text('次へ', '下一节')}</RaisedButton>
                </div>
              )}
            </section>
          )
        })}

        {unitComplete && ((unit.unitId !== 'math-sets' && !isFirstThemeUnit(unit.unitId)) || mathSummaryReached) && (
          <div className="textbook-complete-panel" data-testid="textbook-unit-complete">
            <Check size={28} aria-hidden="true" />
            <div>
              <strong>
                {unit.subject === 'math-1a'
                  ? text('ここまで完了', '已完成这一部分')
                  : nextChapter1Unit
                    ? text('ここまで完了', '已完成这一部分')
                    : text('第1章完了', '第1章完成')}
              </strong>
              <p>
                {unit.subject === 'math-1a'
                  ? unit.unitId === 'math-sets'
                    ? text('集合の表し方から、共通部分・和集合・部分集合・補集合・ド・モルガンの法則・数直線まで確認しました。', '已经学习了集合的表示、交集与并集、子集、补集、德摩根定律，以及数轴上的集合。')
                    : text('この教材の内容を最後まで確認しました。学習設定へ戻ると、次に学ぶ内容を選べます。', '已经完成本教材。返回学习设置后可以选择下一项学习内容。')
                  : nextChapter1Unit
                    ? chapter1Localized(nextChapter1Unit.bridge, language)
                    : text('運動を表し、速度の変化を追い、その原因を力までつなげて考えました。', '已经把运动的表示、速度的变化以及产生变化的力联系起来了。')}
              </p>
            </div>
            {nextChapter1Unit
              ? <Link className="raised-link" data-testid="textbook-next-unit" to={`/learning/textbook/${nextChapter1Unit.unitId}`}>{text('次へ', '继续')}</Link>
              : nextMathUnitId
                ? <Link className="raised-link" data-testid="textbook-next-unit" to={`/learning/textbook/${nextMathUnitId}`}>{text('次へ', '继续')}</Link>
                : <Link className="raised-link" data-testid="textbook-return-to-setup" to={setupReturnPath}>{text('学習設定へ戻る', '返回学习设置')}</Link>}
          </div>
        )}
      </div>

      <button type="button" className="text-button textbook-reset" onClick={restartFromBeginning}>
        <RotateCcw size={15} aria-hidden="true" /> {text('この単元を最初から', '本单元重新开始')}
      </button>
    </div>
  )
}

