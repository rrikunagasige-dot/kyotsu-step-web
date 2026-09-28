import { InlineMath } from 'react-katex'
import { Check, LockKeyhole, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TextbookFigure } from '../components/textbook/TextbookFigure'
import { TextbookFormula } from '../components/textbook/TextbookFormula'
import { ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { textbookRepository } from '../repositories/textbookRepository'
import { getTextbookChoices, isTextbookAnswerCorrect, isTextbookItemResolved, textbookSectionProgress, textbookUnitProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../domain/textbook'
import type { TextbookItem, TextbookReadingBlock, TextbookReadingPart, TextbookSection, TextbookUnit } from '../domain/textbookSchema'
import { useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'

function readingGroupItemIds(blocks: TextbookReadingBlock[], section: TextbookSection) {
  return blocks.flatMap((block) => {
    if (block.type === 'paragraph' || block.type === 'formula') {
      return block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
    }
    if (block.type === 'figure') {
      return section.figures
        .find((figure) => figure.id === block.figureId)
        ?.overlays.map((overlay) => overlay.itemId) ?? []
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
      <Check size={14} aria-hidden="true" />
      <strong>{record.value}</strong>
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

  const firstIncompleteGroup = groups.findIndex((group) => {
    const itemIds = readingGroupItemIds(group, section)
    return itemIds.length > 0 && itemIds.some((itemId) => {
      const item = section.items.find((candidate) => candidate.id === itemId)
      return !item || !isTextbookItemResolved(item, progress?.answers[itemId])
    })
  })
  const visibleGroupCount = firstIncompleteGroup === -1 ? groups.length : firstIncompleteGroup + 1
  const visibleGroups = groups.slice(0, visibleGroupCount)

  const activeItem = activeItemId ? section.items.find((item) => item.id === activeItemId) : undefined
  const activeRecord = activeItem ? progress?.answers[activeItem.id] : undefined
  const activeChoices = activeItem ? getTextbookChoices(unit, activeItem) : []

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
          <span>{activeItem.prompt}</span>
        </div>
        <div className="reading-choice-options" role="group" aria-label={activeItem.prompt}>
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
              <strong>{choice}</strong>
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
          <TextbookFigure figure={figure} items={section.items} progress={progress} onOpen={setActiveItemId} />
          {renderInlineChoicePanel(block)}
        </div>
      )
    }

    if (block.type === 'formula') {
      return (
        <div className="reading-block-with-choice" key={block.id}>
          <TextbookFormula block={block} section={section} progress={progress} onOpen={setActiveItemId} />
          {renderInlineChoicePanel(block)}
        </div>
      )
    }

    const content = block.parts.map((part, index) => (
      <span key={`${block.id}-part-${index}`}>
        {renderPart(part, section, progress, setActiveItemId, text)}
      </span>
    ))

    return (
      <div className="reading-block-with-choice" key={block.id}>
        <p className="reading-paragraph">{content}</p>
        {renderInlineChoicePanel(block)}
      </div>
    )
  }

  return (
    <article className="textbook-reading-flow" data-testid="textbook-reading-flow">
      {visibleGroups.map((group, groupIndex) => {
        const groupItemIds = readingGroupItemIds(group, section)
        const completed = groupItemIds.length > 0 && groupItemIds.every((itemId) => {
          const item = section.items.find((candidate) => candidate.id === itemId)
          return Boolean(item && isTextbookItemResolved(item, progress?.answers[itemId]))
        })
        return (
          <section className="reading-subsection" data-testid={`reading-subsection-${groupIndex}`} key={group[0]?.id ?? groupIndex}>
            {group.map(renderBlock)}
            {completed && groupIndex < groups.length - 1 && (
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
  const { text } = useI18n()

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
  const unitCode = unit.chapter?.unitCode
  const legacyPrefix = unitCode?.slice(-1)
  const displayTitle = legacyPrefix && unit.title.startsWith(`${legacyPrefix} `)
    ? unit.title.slice(legacyPrefix.length + 1)
    : unit.title
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
              ? `TEXTBOOK / PHYSICS / CHAPTER ${unit.chapter.chapterNumber}`
              : 'TEXTBOOK / PHYSICS'}
          </p>
          <h1>{displayTitle}</h1>
          {unit.subtitle && <p>{unit.subtitle}</p>}
        </div>
        <StatusBadge>{text(`第 ${unit.revision} 版`, `第 ${unit.revision} 版`)}</StatusBadge>
      </header>

      <ProgressBar label={text('単元の進み具合', '单元进度')} value={summary.completed} max={summary.total} />

      <section className="textbook-objectives">
        <strong>{text('この単元で確認すること', '本单元确认内容')}</strong>
        <ol>{unit.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol>
      </section>

      <nav className="textbook-section-nav" aria-label={text('単元内の節', '单元内章节')}>
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
      </nav>

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
              <header className="textbook-section-heading">
                <div><span>{section.number}</span><div><h2>{section.title}</h2>{section.description && <p>{section.description}</p>}</div></div>
                <strong>{sectionSummary.completed}/{sectionSummary.total}</strong>
              </header>

              {section.readingFlow.length > 0
                ? <TextbookReadingFlow unit={unit} section={section} progress={progress} />
                : null}

              {sectionComplete && !unitComplete && isLastVisible && index < unit.sections.length - 1 && (
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
              <h2>{text('単元完了', '单元完成')}</h2>
              <p>{text(
                `${displayTitle} の ${summary.total} 個の確認項目をすべて完了しました。`,
                `已完成 ${displayTitle} 的全部 ${summary.total} 个确认项目。`,
              )}</p>
            </div>
            <Link className="raised-link" to="/learning/setup">{text('問題演習へ進む', '进入做题模式')}</Link>
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
