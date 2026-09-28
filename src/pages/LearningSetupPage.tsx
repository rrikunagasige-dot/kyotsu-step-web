import { BookOpenCheck, ListChecks } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { NumberedSection, RaisedButton } from '../components/ui/Primitives'
import type { LearningVariant, Question } from '../domain/questionSchema'
import { groupTextbookUnitsByChapter, textbookUnitProgress } from '../domain/textbook'
import type { TextbookUnit } from '../domain/textbookSchema'
import { textbookRepository } from '../repositories/textbookRepository'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { subjectLabel } from '../i18n/labels'
import {
  buildPhysicsTopicSummary,
  isPhysicsTopicId,
  physicsTaxonomy,
  physicsTopicForQuestion,
  physicsTopicLabel,
  type PhysicsTopicId,
} from '../data/physicsTaxonomy'

type LearningMode = 'textbook' | 'practice'

const SHOW_GUIDANCE_LEVEL = false
const FIXED_PRACTICE_VARIANT: LearningVariant = 'detailed'

function displayTextbookUnitTitle(unit: TextbookUnit) {
  const code = unit.chapter?.unitCode
  const legacyPrefix = code?.slice(-1)
  if (legacyPrefix && unit.title.startsWith(`${legacyPrefix} `)) return unit.title.slice(legacyPrefix.length + 1)
  return unit.title
}

export function LearningSetupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const customQuestions = useAppStore((state) => state.customQuestions)
  const textbookProgress = useAppStore((state) => state.textbookProgress)
  const defaultSubject = useAppStore((state) => state.settings.defaultSubject)
  const startLearning = useAppStore((state) => state.startLearning)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const physicsSummary = useMemo(() => buildPhysicsTopicSummary(catalog), [catalog])

  const requestedTopicParam = searchParams.get('topic')
  const requestedTopic = isPhysicsTopicId(requestedTopicParam) ? requestedTopicParam : null
  const requestedMode = searchParams.get('mode')
  const requestedSubject = searchParams.get('subject')

  const [textbookUnits, setTextbookUnits] = useState<TextbookUnit[]>([])
  const [mode, setMode] = useState<LearningMode>(requestedMode === 'practice' ? 'practice' : 'textbook')
  const [subject, setSubject] = useState<Question['subject']>(requestedSubject === 'math-1a' ? 'math-1a' : 'physics')
  const [activeTopic, setActiveTopic] = useState<PhysicsTopicId | null>(requestedTopic)
  const [variant, setVariant] = useState<LearningVariant>('detailed')
  const [unitId, setUnitId] = useState('')
  const [questionId, setQuestionId] = useState('')

  const questionsFor = (nextSubject: Question['subject'], topic: PhysicsTopicId | null = null) =>
    catalog.filter((question) =>
      question.subject === nextSubject &&
      question.status === 'published' &&
      (nextSubject !== 'physics' || !topic || physicsTopicForQuestion(question) === topic),
    )

  const subjectQuestions = useMemo(
    () => catalog.filter((question) =>
      question.subject === subject &&
      question.status === 'published' &&
      (subject !== 'physics' || !activeTopic || physicsTopicForQuestion(question) === activeTopic),
    ),
    [activeTopic, catalog, subject],
  )

  useEffect(() => {
    textbookRepository.listPublished().then((units) => {
      setTextbookUnits(units)
      setUnitId((current) => current || units[0]?.unitId || '')
    })
  }, [])

  useEffect(() => {
    if (mode !== 'practice') return
    if (subject === 'physics' && !activeTopic) {
      if (questionId) setQuestionId('')
      return
    }
    if (!subjectQuestions.some((question) => question.questionId === questionId)) {
      setQuestionId(subjectQuestions[0]?.questionId ?? '')
    }
  }, [activeTopic, mode, questionId, subject, subjectQuestions])

  const textbookChapters = useMemo(() => groupTextbookUnitsByChapter(textbookUnits), [textbookUnits])
  const selectedUnit = textbookUnits.find((unit) => unit.unitId === unitId)
  const selectedUnitProgress = unitId ? textbookProgress[unitId] : undefined
  const selectedSummary = selectedUnit ? textbookUnitProgress(selectedUnit, selectedUnitProgress) : undefined

  const variants: { value: LearningVariant; label: string; description: string }[] = [
    { value: 'detailed', label: text('詳細穴埋め', '详细引导'), description: text('手順を細かく確認', '逐步确认完整过程') },
    { value: 'standard', label: text('標準穴埋め', '标准引导'), description: text('要点だけ回答', '只回答关键步骤') },
    { value: 'selfCheck', label: text('自力確認', '自主检查'), description: text('最小限の空欄', '仅保留必要填空') },
  ]

  const changeSubject = (next: Question['subject']) => {
    setSubject(next)
    setActiveTopic(null)
    setQuestionId(next === 'math-1a' ? questionsFor(next)[0]?.questionId ?? '' : '')
  }

  const changeMode = (next: LearningMode) => {
    setMode(next)
    if (next === 'textbook') {
      setSubject('physics')
      setActiveTopic(null)
      setQuestionId('')
      return
    }

    const nextSubject: Question['subject'] = requestedTopic ? 'physics' : defaultSubject
    const nextTopic = nextSubject === 'physics' ? requestedTopic : null
    setSubject(nextSubject)
    setActiveTopic(nextTopic)
    setQuestionId(nextSubject === 'physics' && !nextTopic ? '' : questionsFor(nextSubject, nextTopic)[0]?.questionId ?? '')
  }

  const selectPhysicsTopic = (topic: PhysicsTopicId) => {
    if (physicsSummary.counts[topic] <= 0) return
    setActiveTopic(topic)
    setQuestionId(questionsFor('physics', topic)[0]?.questionId ?? '')
  }

  const begin = () => {
    if (mode === 'textbook') {
      if (unitId) navigate(`/learning/textbook/${unitId}`)
      return
    }
    if (questionId) navigate(`/learning/session/${startLearning(questionId, FIXED_PRACTICE_VARIANT)}`)
  }

  return (
    <div className="page-stack">
      <header className="page-hero">
        <p className="eyebrow">LEARNING SETUP</p>
        <h1>{text('学習設定', '学习设置')}</h1>
        <p>{text('学習方法、科目、分野、問題の順に選びます。', '依次选择学习方式、科目、领域和题目。')}</p>
      </header>

      <NumberedSection number="01" title={text('学習方法', '学习方式')}>
        <div className="learning-mode-grid" role="radiogroup" aria-label={text('学習方法', '学习方式')}>
          <button type="button" role="radio" aria-checked={mode === 'textbook'} onClick={() => changeMode('textbook')}>
            <BookOpenCheck aria-hidden="true" />
            <strong>{text('知識を学ぶ', '学习知识点')}</strong>
            <small>{text('教科書モード・難易度なしで順番に進む', '教科书模式・不分难度，按顺序学习')}</small>
          </button>
          <button type="button" role="radio" aria-checked={mode === 'practice'} onClick={() => changeMode('practice')}>
            <ListChecks aria-hidden="true" />
            <strong>{text('問題を解く', '做题')}</strong>
            <small>{text('科目と分野を選んで題庫から演習', '选择科目和领域后从题库练习')}</small>
          </button>
        </div>
      </NumberedSection>

      <NumberedSection number="02" title={text('科目', '科目')}>
        <div className="segmented-control" role="group" aria-label={text('科目', '科目')}>
          {(mode === 'textbook' ? ['physics'] : ['math-1a', 'physics'] as Question['subject'][]).map((value) => (
            <button type="button" key={value} aria-pressed={subject === value} onClick={() => changeSubject(value as Question['subject'])}>
              {subjectLabel(value as Question['subject'], language)}
            </button>
          ))}
        </div>
        {mode === 'textbook' && <p className="field-help">{text('現在は物理の教科書モードを先行実装しています。', '当前先实现物理教科书模式。')}</p>}
      </NumberedSection>

      {mode === 'textbook' ? (
        <NumberedSection number="03" title={text('章・単元', '章节・单元')}>
          <div className="textbook-chapter-list">
            {textbookChapters.map((chapter) => (
              <article className="textbook-chapter-card" key={chapter.chapterId}>
                <header>
                  <span>{chapter.chapterNumber ? text(`第${chapter.chapterNumber}章`, `第${chapter.chapterNumber}章`) : text('教科書', '教科书')}</span>
                  <div>
                    <strong>{chapter.chapterTitle}</strong>
                    <small>{text(`${chapter.units.length} 単元`, `${chapter.units.length} 个单元`)}</small>
                  </div>
                </header>

                <div className="textbook-unit-grid" role="radiogroup" aria-label={text(`${chapter.chapterTitle}の単元`, `${chapter.chapterTitle}的单元`)}>
                  {chapter.units.map((unit) => {
                    const unitProgress = textbookProgress[unit.unitId]
                    const summary = textbookUnitProgress(unit, unitProgress)
                    const selected = unitId === unit.unitId
                    return (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        data-testid={`textbook-unit-${unit.unitId}`}
                        key={unit.unitId}
                        onClick={() => setUnitId(unit.unitId)}
                      >
                        <span className="textbook-unit-code">{unit.chapter?.unitCode ?? 'UNIT'}</span>
                        <div>
                          <strong>{displayTextbookUnitTitle(unit)}</strong>
                          <small>{unitProgress ? text(`${summary.completed}/${summary.total} 完了`, `已完成 ${summary.completed}/${summary.total}`) : text('未開始', '未开始')}</small>
                        </div>
                        <span className="textbook-unit-percent">{summary.percent}%</span>
                      </button>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>

          {selectedUnit && (
            <div className="setup-progress-note" data-testid="textbook-selection-summary">
              <span>
                {selectedUnitProgress
                  ? text(`${selectedUnit.chapter?.unitCode ?? ''} ${displayTextbookUnitTitle(selectedUnit)}：続きから再開できます`, `${selectedUnit.chapter?.unitCode ?? ''} ${displayTextbookUnitTitle(selectedUnit)}：可以继续学习`)
                  : text(`${selectedUnit.chapter?.unitCode ?? ''} ${displayTextbookUnitTitle(selectedUnit)}：最初から開始`, `${selectedUnit.chapter?.unitCode ?? ''} ${displayTextbookUnitTitle(selectedUnit)}：从头开始`)}
              </span>
              <small>
                {text(
                  `確認項目 ${selectedSummary?.completed ?? 0}/${selectedSummary?.total ?? 0}。難易度選択はなく、教材の順番どおりに進みます。`,
                  `确认项目 ${selectedSummary?.completed ?? 0}/${selectedSummary?.total ?? 0}。没有难度选择，按教材顺序学习。`,
                )}
              </small>
            </div>
          )}
        </NumberedSection>
      ) : subject === 'physics' ? (
        <>
          <NumberedSection
            number="03"
            title={text('物理の分野', '物理领域')}
            description={text('まず分野を選び、その後に題庫から問題を選びます。', '先选择领域，再从题库中选择题目。')}
          >
            <div className="physics-taxonomy-board" data-testid="physics-taxonomy-board">
              {physicsTaxonomy.map((domain) => (
                <section className="physics-domain-group" key={domain.id} data-testid={`physics-domain-${domain.id}`}>
                  <header className="physics-domain-heading">
                    <span aria-hidden="true" />
                    <h3>{domain.label[language]}</h3>
                    <span aria-hidden="true" />
                  </header>
                  <div className="physics-topic-grid">
                    {domain.topics.map((topic) => {
                      const count = physicsSummary.counts[topic.id]
                      const selected = activeTopic === topic.id
                      return (
                        <button
                          type="button"
                          className={`physics-topic-card${count === 0 ? ' physics-topic-card--empty' : ''}${selected ? ' physics-topic-card--selected' : ''}`}
                          data-testid={`physics-topic-${topic.id}`}
                          aria-pressed={selected}
                          disabled={count === 0}
                          key={topic.id}
                          onClick={() => selectPhysicsTopic(topic.id)}
                        >
                          <strong>{topic.label[language]}</strong>
                          <small aria-label={text(`${count}問`, `${count}题`)}>{count}</small>
                        </button>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
            {physicsSummary.unclassified > 0 && (
              <p className="field-help" role="status">
                {text(`未分類の物理問題が ${physicsSummary.unclassified} 問あります。`, `有 ${physicsSummary.unclassified} 道物理题尚未分类。`)}
              </p>
            )}
          </NumberedSection>

          {activeTopic && (
            <NumberedSection number="04" title={text('問題', '题目')}>
              <div className="topic-filter-note" data-testid="physics-topic-filter">
                <span>{text('選択中の分野', '当前领域')}</span>
                <strong>{physicsTopicLabel(activeTopic, language)}</strong>
                <small>{text(`${subjectQuestions.length} 問`, `${subjectQuestions.length} 题`)}</small>
              </div>
              <label className="field-label" htmlFor="learning-question">{text('学習する問題', '选择学习题目')}</label>
              <select id="learning-question" className="select-control" value={questionId} onChange={(event) => setQuestionId(event.target.value)}>
                {subjectQuestions.map((question) => <option key={question.questionId} value={question.questionId}>{question.title}</option>)}
              </select>
            </NumberedSection>
          )}
        </>
      ) : (
        <NumberedSection number="03" title={text('問題', '题目')}>
          <label className="field-label" htmlFor="learning-question">{text('学習する問題', '选择学习题目')}</label>
          <select id="learning-question" className="select-control" value={questionId} onChange={(event) => setQuestionId(event.target.value)}>
            {subjectQuestions.map((question) => <option key={question.questionId} value={question.questionId}>{question.title}</option>)}
          </select>
        </NumberedSection>
      )}

      {mode === 'practice' && SHOW_GUIDANCE_LEVEL && (
        <NumberedSection number={subject === 'physics' ? '05' : '04'} title={text('誘導レベル', '引导强度')}>
          <div className="choice-grid" role="radiogroup" aria-label={text('誘導レベル', '引导强度')}>
            {variants.map((item) => (
              <button type="button" role="radio" aria-checked={variant === item.value} key={item.value} onClick={() => setVariant(item.value)}>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </NumberedSection>
      )}

      <RaisedButton
        type="button"
        className="primary-button"
        data-testid="start-learning"
        disabled={mode === 'textbook' ? !unitId : !questionId}
        onClick={begin}
      >
        {mode === 'textbook'
          ? text(selectedUnitProgress ? '続きから学ぶ' : '教科書モードを始める', selectedUnitProgress ? '继续学习' : '开始教科书模式')
          : text('この設定で問題を解く', '按此设置开始做题')}
      </RaisedButton>
    </div>
  )
}
