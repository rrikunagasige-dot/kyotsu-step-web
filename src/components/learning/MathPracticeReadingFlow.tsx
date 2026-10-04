import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { InlineMath } from 'react-katex'
import { MathPracticeContentRenderer, MathPracticeInlineText } from './MathPracticeRichText'
import { MathPracticeFigure } from './MathPracticeFigure'
import type { LearningSession } from '../../domain/attempts'
import { isLearningAnswerResolved } from '../../domain/learning'
import type { Question } from '../../domain/questionSchema'
import { useI18n } from '../../i18n/runtime'
import { mathPracticeFigureState } from '../../data/mathPractice/figures'
import {
  mathPracticeDependencyTargets,
  mathPracticeExternalDependencies,
  mathPracticeResultItems,
  mathPracticeTargetForBlank,
  mathPracticeTargetsForQuestion,
  mathPracticeUsesSubproblemCompression,
  type MathPracticeTarget,
} from '../../data/mathPractice/presentation'

function optionContent(question: Question, blankId: string, optionIds: string[]) {
  const blank = question.learning.blanks[blankId]
  return blank.options.filter((option) => optionIds.includes(option.id)).flatMap((option) => option.content)
}

function correctContent(question: Question, blankId: string) {
  const blank = question.learning.blanks[blankId]
  return optionContent(question, blankId, blank.correctOptionIds)
}

export function MathPracticeReadingFlow({ question, session, onSelect }: {
  question: Question
  session: LearningSession
  onSelect: (blankId: string, optionId: string) => void
}) {
  const { language, text } = useI18n()
  const [openBlankId, setOpenBlankId] = useState<string | null>(null)
  const [expandedDependencyId, setExpandedDependencyId] = useState<string | null>(null)
  const interactive = useMemo(() => new Set(question.learning.variants[session.variant]), [question.learning.variants, session.variant])

  const firstUnresolvedIndex = question.learning.solutionFlow.findIndex((block) =>
    block.type === 'blank' &&
    interactive.has(block.blankId) &&
    !isLearningAnswerResolved(session.answers[block.blankId]),
  )
  const visibleThrough = firstUnresolvedIndex === -1
    ? question.learning.solutionFlow.length - 1
    : firstUnresolvedIndex

  const unresolvedBlankId = firstUnresolvedIndex >= 0 && question.learning.solutionFlow[firstUnresolvedIndex]?.type === 'blank'
    ? question.learning.solutionFlow[firstUnresolvedIndex].blankId
    : null
  const targets = mathPracticeTargetsForQuestion(question.questionId)
  const currentTarget = mathPracticeTargetForBlank(
    question.questionId,
    unresolvedBlankId ?? targets.at(-1)?.blankIds.at(-1),
  )
  const usesSubproblemCompression = mathPracticeUsesSubproblemCompression(question.questionId)

  const resolvedLocalBlankIds = useMemo(() => {
    const prefix = `${question.questionId}-`
    return new Set(
      Object.entries(session.answers)
        .filter(([, answer]) => isLearningAnswerResolved(answer))
        .map(([blankId]) => blankId.startsWith(prefix) ? blankId.slice(prefix.length) : blankId),
    )
  }, [question.questionId, session.answers])

  const figureId = currentTarget
    ? mathPracticeFigureState(question.questionId, currentTarget.id, resolvedLocalBlankIds)
    : null

  const targetIdForFlowIndex = (index: number) => {
    const block = question.learning.solutionFlow[index]
    if (!block) return null
    if (block.type === 'blank') return mathPracticeTargetForBlank(question.questionId, block.blankId)?.id ?? null

    for (let cursor = index + 1; cursor < question.learning.solutionFlow.length; cursor += 1) {
      const next = question.learning.solutionFlow[cursor]
      if (next.type !== 'blank') continue
      const target = mathPracticeTargetForBlank(question.questionId, next.blankId)
      if (target) return target.id
    }

    for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
      const previous = question.learning.solutionFlow[cursor]
      if (previous.type !== 'blank') continue
      const target = mathPracticeTargetForBlank(question.questionId, previous.blankId)
      if (target) return target.id
    }
    return null
  }

  const flowEntries = question.learning.solutionFlow.map((block, index) => ({ block, index }))
  const renderedEntries = usesSubproblemCompression && currentTarget
    ? flowEntries.filter(({ index }) =>
        targetIdForFlowIndex(index) === currentTarget.id &&
        (firstUnresolvedIndex === -1 || index <= firstUnresolvedIndex),
      )
    : flowEntries.filter(({ index }) => index <= visibleThrough)

  const dependencyTargets = currentTarget
    ? mathPracticeDependencyTargets(question.questionId, currentTarget.id)
    : []

  const externalDependencies = currentTarget
    ? mathPracticeExternalDependencies(question.questionId, currentTarget.id)
    : []

  const fullBlankId = (localBlankId: string) => `${question.questionId}-${localBlankId}`
  const dependencyResultResolved = (target: MathPracticeTarget) => {
    const results = mathPracticeResultItems(target)
    return results.length > 0 && results.every((result) =>
      isLearningAnswerResolved(session.answers[fullBlankId(result.blankId)]),
    )
  }

  const entriesForTarget = (target: MathPracticeTarget) =>
    flowEntries.filter(({ index }) => targetIdForFlowIndex(index) === target.id)

  const renderResolvedTarget = (target: MathPracticeTarget) => (
    <div className="math-practice-dependency-detail" data-testid={`math-practice-dependency-detail-${target.id}`}>
      {entriesForTarget(target).map(({ block }) => {
        if (block.type === 'content') {
          return (
            <div className="math-practice-reading-content" key={block.id}>
              <MathPracticeContentRenderer blocks={block.content} assets={question.assets} />
            </div>
          )
        }
        const blank = question.learning.blanks[block.blankId]
        return (
          <div className="math-practice-reading-line" key={block.id}>
            <span><MathPracticeInlineText value={blank.prompt} /></span>
            <div className="reading-inline-answer math-practice-inline-answer">
              <MathPracticeContentRenderer blocks={correctContent(question, block.blankId)} assets={question.assets} />
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      {currentTarget && (
        <aside className="math-practice-target-anchor" data-testid="math-practice-current-target">
          <span>{currentTarget.kicker[language]}</span>
          {currentTarget.label && <strong><MathPracticeInlineText value={currentTarget.label[language]} /></strong>}
          {currentTarget.latex && (
            <strong className="math-practice-target-anchor__math">
              <InlineMath math={currentTarget.latex} />
            </strong>
          )}
        </aside>
      )}

      {usesSubproblemCompression && dependencyTargets.some(dependencyResultResolved) && (
        <div className="math-practice-dependency-links" data-testid="math-practice-dependency-links">
          <span className="math-practice-dependency-links__label">{text('前の小問から使う結果', '使用前面小题的结果')}</span>
          {dependencyTargets.filter(dependencyResultResolved).map((dependency) => {
            const results = mathPracticeResultItems(dependency)
            const expanded = expandedDependencyId === dependency.id
            const linkLabel = dependency.resultLinkLabel?.[language] ?? results[0]?.label[language]
            return (
              <div className="math-practice-dependency-item" key={dependency.id}>
                <div className="math-practice-dependency-summary">
                  <button
                    type="button"
                    className="math-practice-dependency-link"
                    data-testid={`math-practice-dependency-${dependency.id}`}
                    aria-expanded={expanded}
                    onClick={() => setExpandedDependencyId(expanded ? null : dependency.id)}
                  >
                    {linkLabel}
                  </button>
                  <span className="math-practice-dependency-result">
                    {results.map((result) => {
                      const resultBlankId = fullBlankId(result.blankId)
                      return (
                        <span className="math-practice-dependency-result__item" key={result.blankId}>
                          {result.latexPrefix && <InlineMath math={result.latexPrefix} />}
                          <MathPracticeContentRenderer blocks={correctContent(question, resultBlankId)} assets={question.assets} />
                        </span>
                      )
                    })}
                  </span>
                </div>
                {expanded && renderResolvedTarget(dependency)}
              </div>
            )
          })}
        </div>
      )}

      {usesSubproblemCompression && externalDependencies.length > 0 && (
        <div className="math-practice-dependency-links" data-testid="math-practice-external-dependencies">
          <span className="math-practice-dependency-links__label">{text('前に使える結果', '前面可用的结果')}</span>
          {externalDependencies.map((dependency) => {
            const expansionId = `external:${dependency.id}`
            const expanded = expandedDependencyId === expansionId
            return (
              <div className="math-practice-dependency-item" key={dependency.id}>
                <div className="math-practice-dependency-summary">
                  <button
                    type="button"
                    className="math-practice-dependency-link"
                    data-testid={`math-practice-external-dependency-${dependency.id}`}
                    aria-expanded={expanded}
                    onClick={() => setExpandedDependencyId(expanded ? null : expansionId)}
                  >
                    {dependency.label[language]}
                  </button>
                  <span className="math-practice-dependency-result">
                    <span className="math-practice-dependency-result__item">
                      <InlineMath math={dependency.resultLatex} />
                    </span>
                  </span>
                </div>
                {expanded && (
                  <div
                    className="math-practice-dependency-detail"
                    data-testid={`math-practice-external-dependency-detail-${dependency.id}`}
                  >
                    <MathPracticeInlineText value={dependency.detail[language]} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {figureId && <MathPracticeFigure figureId={figureId} />}

      <article className="math-practice-reading-flow" data-testid="math-practice-reading-flow">
      {renderedEntries.map(({ block }) => {
        if (block.type === 'content') {
          return (
            <div className="math-practice-reading-content" key={block.id}>
              <MathPracticeContentRenderer blocks={block.content} assets={question.assets} />
            </div>
          )
        }

        const blank = question.learning.blanks[block.blankId]
        const answer = session.answers[block.blankId]
        const isInteractive = interactive.has(block.blankId)

        if (!isInteractive) {
          return (
            <div className="math-practice-reading-line" key={block.id}>
              <span><MathPracticeInlineText value={blank.prompt} /></span>
              <div className="reading-inline-answer math-practice-inline-answer">
                <MathPracticeContentRenderer blocks={correctContent(question, block.blankId)} assets={question.assets} />
              </div>
            </div>
          )
        }

        if (isLearningAnswerResolved(answer)) {
          return (
            <div className="math-practice-reading-line" data-testid={`answer-${block.blankId}`} key={block.id}>
              <span><MathPracticeInlineText value={blank.prompt} /></span>
              <div className="reading-inline-answer math-practice-inline-answer">
                <MathPracticeContentRenderer blocks={correctContent(question, block.blankId)} assets={question.assets} />
              </div>
            </div>
          )
        }

        const isWrong = Boolean(answer)
        const isOpen = openBlankId === block.blankId
        const selectedIds = answer?.lastSelectedOptionIds ?? answer?.firstSelectedOptionIds ?? []
        const selectedWrongOption = blank.options.find((option) => selectedIds.includes(option.id))
        const hintBlocks = selectedWrongOption?.wrongReason?.length
          ? selectedWrongOption.wrongReason
          : blank.explanation

        return (
          <div className="math-practice-reading-block" key={block.id}>
            <div className="math-practice-reading-line">
              <span><MathPracticeInlineText value={blank.prompt} /></span>
              <button
                type="button"
                data-testid={`blank-${block.blankId}`}
                className={`reading-inline-blank${isWrong ? ' reading-inline-blank--wrong' : ''}`}
                onClick={() => setOpenBlankId(isOpen ? null : block.blankId)}
              >
                {isWrong && <X size={14} aria-hidden="true" />}
                <strong>{isWrong ? text('もう一度', '重新选择') : text('選択', '选择')}</strong>
              </button>
            </div>

            {isOpen && (
              <div className="reading-inline-choice-panel" data-testid={`inline-choice-panel-${block.blankId}`}>
                <div className="reading-inline-choice-panel__head">
                  <span><MathPracticeInlineText value={blank.prompt} /></span>
                </div>

                {isWrong && (
                  <div className="reading-choice-hint" data-testid={`math-practice-hint-${block.blankId}`}>
                    <strong>{text('ヒント', '提示')}</strong>
                    <MathPracticeContentRenderer blocks={hintBlocks} assets={question.assets} />
                  </div>
                )}

                <div className="reading-choice-options" role="group" aria-label={blank.prompt}>
                  {blank.options.map((option, index) => (
                    <button
                      type="button"
                      key={option.id}
                      data-testid={`option-${option.id}`}
                      className="reading-choice-option"
                      onClick={() => {
                        onSelect(block.blankId, option.id)
                        setOpenBlankId(null)
                      }}
                    >
                      <span>{index + 1}</span>
                      <div className="math-practice-choice-content"><MathPracticeContentRenderer blocks={option.content} assets={question.assets} /></div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
      </article>
    </>
  )
}
