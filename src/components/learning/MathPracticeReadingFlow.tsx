import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { InlineMath } from 'react-katex'
import { MathPracticeContentRenderer, MathPracticeInlineText } from './MathPracticeRichText'
import type { LearningSession } from '../../domain/attempts'
import { isLearningAnswerResolved } from '../../domain/learning'
import type { Question } from '../../domain/questionSchema'
import { useI18n } from '../../i18n/runtime'
import { mathPracticeTargetForBlank, mathPracticeTargetsForQuestion } from '../../data/mathPractice/presentation'

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

  return (
    <>
      {currentTarget && (
        <aside className="math-practice-target-anchor" data-testid="math-practice-current-target">
          <span>{currentTarget.kicker[language]}</span>
          {currentTarget.label && <strong>{currentTarget.label[language]}</strong>}
          {currentTarget.latex && (
            <strong className="math-practice-target-anchor__math">
              <InlineMath math={currentTarget.latex} />
            </strong>
          )}
        </aside>
      )}
      <article className="math-practice-reading-flow" data-testid="math-practice-reading-flow">
      {question.learning.solutionFlow.slice(0, visibleThrough + 1).map((block) => {
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
