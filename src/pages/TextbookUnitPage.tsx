import { InlineMath } from 'react-katex'
import { Check, LockKeyhole, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TextbookFigure } from '../components/textbook/TextbookFigure'
import { TextbookFormula } from '../components/textbook/TextbookFormula'
import { ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { textbookRepository } from '../repositories/textbookRepository'
import { getTextbookChoices, isTextbookItemResolved, textbookSectionProgress, textbookUnitProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../domain/textbook'
import type { TextbookItem, TextbookReadingBlock, TextbookReadingPart, TextbookSection, TextbookUnit } from '../domain/textbookSchema'
import { useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { normalizeTextbookMath } from '../domain/textbookMath'
import { chapter1ChunkForUnitCode, chapter1Localized, chapter1NextUnit } from '../data/textbook/ch01/chapter1Architecture'

function interactionPrompt(item: TextbookItem, text: (ja: string, zh: string) => string) {
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
    case 'causal-reasoning': return text('変化の因果関係をたどろう。', '沿着变化的因果关系思考。')
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
        ? <InlineMath math={normalizeTextbookMath(record.value)} />
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
  if (part.type === 'math') return <InlineMath math={part.latex} />

  const item = section.items.find((candidate) => candidate.id === part.itemId)
  if (!item) return null
  const record = progress?.answers[item.id]
  if (isTextbookItemResolved(item, record)) return renderResolvedChoice(item, record!)
  return renderActiveChoice(item, Boolean(record), onOpen, text)
}

function TextbookReadingFlow({ unit, section, progress }: {
  unit: TextbookUnit
  section: TextbookSection
  progress: TextbookUnitProgress | undefined
}) {
  const { text } = useI18n()
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

  const activeItem = activeItemId ? section.items.find((item) => item.id === activeItemId) : undefined
  const activeRecord = activeItem ? currentProgress?.answers[activeItem.id] : undefined
  const activeChoices = activeItem ? getTextbookChoices(unit, activeItem) : []
  const activeHint = activeItem && activeRecord && !isTextbookItemResolved(activeItem, activeRecord) && activeRecord.attemptCount > 0 && activeItem.hints.length
    ? activeItem.hints[Math.min(activeRecord.attemptCount - 1, activeItem.hints.length - 1)]
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
    answerTextbook(unit, activeItem.id, choice)
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
          <span>{interactionPrompt(activeItem, text)}</span>
        </div>
        {activeHint && (
          <div className="reading-choice-hint" data-testid={`textbook-hint-${activeItem.id}`}>
            <strong>{text('ヒント', '提示')}</strong>
            <span>{activeHint}</span>
          </div>
        )}
        <div className="reading-choice-options" role="group" aria-label={interactionPrompt(activeItem, text)}>
          {activeChoices.map((choice, index) => (
            <button
              type="button"
              aria-label={choice}
              key={choice}
              data-testid={`textbook-choice-${activeItem.id}-${index}`}
              className="reading-choice-option"
              onClick={() => selectChoice(choice)}
            >
              <span>{index + 1}</span>
              <strong>
                {activeItem.answerType === 'formula'
                  ? <InlineMath math={normalizeTextbookMath(choice)} />
                  : choice}
              </strong>
              {activeItem.unit && <small>{activeItem.unit}</small>}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderBlock = (block: TextbookReadingBlock) => {
    if (block.type === 'heading') return <h3 className="reading-subheading" key={block.id}>{block.text}</h3>
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
          <TextbookFormula block={block} section={section} progress={currentProgress} onOpen={setActiveItemId} />
          {renderInlineChoicePanel(block)}
        </div>
      )
    }

    const content = block.parts.map((part, index) => (
      <span key={`${block.id}-part-${index}`}>
        {renderPart(part, section, currentProgress, setActiveItemId, text)}
      </span>
    ))

    return (
      <div className="reading-block-with-choice" key={block.id}>
        <p className="reading-paragraph">{content}</p>
        {renderInlineChoicePanel(block)}
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
                {renderBlock(entry)}
              </div>
            ))}
          </div>,
        )
        continue
      }

      rendered.push(renderBlock(block))
      index += 1
    }

    return rendered
  }

  return (
    <article className="textbook-reading-flow" data-testid="textbook-reading-flow">
      {visibleGroups.map((group, groupIndex) => {
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
  const initializedUnitRef = useRef<string | null>(null)
  const progress = useAppStore((state) => state.textbookProgress[unitId])
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
  const majorTitle = chapterChunk ? chapter1Localized(chapterChunk.title, language) : displayTitle
  const nextChapter1Unit = unit.subject === 'physics' ? chapter1NextUnit(unitCode) : undefined
  const subjectEyebrow = unit.subject === 'math-1a' ? 'MATH I+A' : 'PHYSICS'
  const unitComplete = summary.completed === summary.total
  const canOpen = (index: number) => unitComplete || index <= firstIncompleteIndex

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
    <div className="page-stack textbook-page">
      <header className="session-header">
        <div>
          <p className="eyebrow">
            {unit.chapter
              ? `TEXTBOOK / ${subjectEyebrow} / CHAPTER ${unit.chapter.chapterNumber}`
              : `TEXTBOOK / ${subjectEyebrow}`}
          </p>
          <h1>{majorTitle}</h1>
          {chapterChunk && (
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
                ? <TextbookReadingFlow unit={unit} section={section} progress={progress} />
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

        {unitComplete && (
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
                  ? text('集合・要素・所属記号・集合の表し方・有限集合と無限集合まで確認しました。', '已经学习了集合、元素、所属符号、集合的表示方法，以及有限集合与无限集合。')
                  : nextChapter1Unit
                    ? chapter1Localized(nextChapter1Unit.bridge, language)
                    : text('運動を表し、速度の変化を追い、その原因を力までつなげて考えました。', '已经把运动的表示、速度的变化以及产生变化的力联系起来了。')}
              </p>
            </div>
            {nextChapter1Unit
              ? <Link className="raised-link" data-testid="textbook-next-unit" to={`/learning/textbook/${nextChapter1Unit.unitId}`}>{text('次へ', '继续')}</Link>
              : <Link className="raised-link" to="/learning/setup">{text('学習設定へ戻る', '返回学习设置')}</Link>}
          </div>
        )}
      </div>

      <button type="button" className="text-button textbook-reset" onClick={() => {
        if (window.confirm(text('この単元の進捗を最初からやり直しますか？', '确定要清空本单元进度并重新开始吗？'))) {
          resetTextbookUnit(unit.unitId)
          initializedUnitRef.current = null
          setSelectedSectionIndex(0)
          setVisibleThroughIndex(0)
        }
      }}><RotateCcw size={15} aria-hidden="true" /> {text('この単元を最初から', '本单元重新开始')}</button>
    </div>
  )
}
