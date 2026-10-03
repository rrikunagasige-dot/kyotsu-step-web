import { BookOpenCheck, ListChecks } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { NumberedSection, RaisedButton } from '../components/ui/Primitives'
import type { LearningVariant, Question } from '../domain/questionSchema'
import { textbookUnitProgress } from '../domain/textbook'
import type { TextbookUnit } from '../domain/textbookSchema'
import { textbookRepository } from '../repositories/textbookRepository'
import { physicsTextbookParts } from '../data/textbook/chapterCatalog'
import { chapter1LearningChunks, chapter1Localized } from '../data/textbook/ch01/chapter1Architecture'
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
import {
  buildMathCommonTestSummary,
  buildMathPracticeTopicSummary,
  mathCommonTestAreas,
  mathCommonTestAreaForQuestion,
  mathPracticeProblemNumber,
  mathPracticeTaxonomy,
  mathPracticeTopicFlow,
  mathPracticeTopicForQuestion,
  mathPracticeTopicLabel,
  type MathCommonTestAreaId,
  type MathPracticeTopicId,
} from '../data/mathPracticeTaxonomy'

type LearningMode = 'textbook' | 'practice'
type MathExerciseType = 'basic' | 'common-test'

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
  const mathSummary = useMemo(() => buildMathPracticeTopicSummary(catalog), [catalog])
  const mathCommonTestSummary = useMemo(() => buildMathCommonTestSummary(catalog), [catalog])

  const requestedTopicParam = searchParams.get('topic')
  const requestedTopic = isPhysicsTopicId(requestedTopicParam) ? requestedTopicParam : null
  const requestedMode = searchParams.get('mode')
  const requestedSubject = searchParams.get('subject')

  const [textbookUnits, setTextbookUnits] = useState<TextbookUnit[]>([])
  const [mode, setMode] = useState<LearningMode>(requestedMode === 'practice' ? 'practice' : 'textbook')
  const [subject, setSubject] = useState<Question['subject']>(requestedSubject === 'math-1a' ? 'math-1a' : 'physics')
  const [activeTopic, setActiveTopic] = useState<PhysicsTopicId | null>(requestedTopic)
  const [mathExerciseType, setMathExerciseType] = useState<MathExerciseType | null>(null)
  const [activeMathTopic, setActiveMathTopic] = useState<MathPracticeTopicId | null>(null)
  const [activeMathCommonTestArea, setActiveMathCommonTestArea] = useState<MathCommonTestAreaId | null>(null)
  const [variant, setVariant] = useState<LearningVariant>('detailed')
  const [questionId, setQuestionId] = useState('')

  const questionsFor = (
    nextSubject: Question['subject'],
    physicsTopic: PhysicsTopicId | null = null,
    mathTopic: MathPracticeTopicId | null = null,
  ) =>
    catalog.filter((question) =>
      question.subject === nextSubject &&
      question.status === 'published' &&
      (nextSubject !== 'physics' || !physicsTopic || physicsTopicForQuestion(question) === physicsTopic) &&
      (nextSubject !== 'math-1a' || !mathTopic || mathPracticeTopicForQuestion(question) === mathTopic),
    )

  const subjectQuestions = useMemo(
    () => catalog.filter((question) =>
      question.subject === subject &&
      question.status === 'published' &&
      (subject !== 'physics' || (activeTopic !== null && physicsTopicForQuestion(question) === activeTopic)) &&
      (subject !== 'math-1a' || (
        mathExerciseType === 'basic'
          ? activeMathTopic !== null && mathPracticeTopicForQuestion(question) === activeMathTopic
          : mathExerciseType === 'common-test'
            ? activeMathCommonTestArea !== null && mathCommonTestAreaForQuestion(question) === activeMathCommonTestArea
            : false
      )),
    ),
    [activeMathCommonTestArea, activeMathTopic, activeTopic, catalog, mathExerciseType, subject],
  )

  useEffect(() => {
    textbookRepository.listPublished().then((units) => {
      setTextbookUnits(units)
    })
  }, [])

  useEffect(() => {
    if (mode !== 'practice') return
    if (
      (subject === 'physics' && !activeTopic) ||
      (subject === 'math-1a' && (
        !mathExerciseType ||
        (mathExerciseType === 'basic' && !activeMathTopic) ||
        (mathExerciseType === 'common-test' && !activeMathCommonTestArea)
      ))
    ) {
      if (questionId) setQuestionId('')
      return
    }
    if (!subjectQuestions.some((question) => question.questionId === questionId)) {
      setQuestionId(subjectQuestions[0]?.questionId ?? '')
    }
  }, [activeMathCommonTestArea, activeMathTopic, activeTopic, mathExerciseType, mode, questionId, subject, subjectQuestions])

  const variants: { value: LearningVariant; label: string; description: string }[] = [
    { value: 'detailed', label: text('詳細穴埋め', '详细引导'), description: text('手順を細かく確認', '逐步确认完整过程') },
    { value: 'standard', label: text('標準穴埋め', '标准引导'), description: text('要点だけ回答', '只回答关键步骤') },
    { value: 'selfCheck', label: text('自力確認', '自主检查'), description: text('最小限の空欄', '仅保留必要填空') },
  ]

  const changeSubject = (next: Question['subject']) => {
    setSubject(next)
    setActiveTopic(null)
    setMathExerciseType(null)
    setActiveMathTopic(null)
    setActiveMathCommonTestArea(null)
    setQuestionId('')
  }

  const changeMode = (next: LearningMode) => {
    setMode(next)
    if (next === 'textbook') {
      setSubject('physics')
      setActiveTopic(null)
      setMathExerciseType(null)
      setActiveMathTopic(null)
      setActiveMathCommonTestArea(null)
      setQuestionId('')
      return
    }

    const nextSubject: Question['subject'] = requestedTopic ? 'physics' : defaultSubject
    const nextTopic = nextSubject === 'physics' ? requestedTopic : null
    setSubject(nextSubject)
    setActiveTopic(nextTopic)
    setMathExerciseType(null)
    setActiveMathTopic(null)
    setActiveMathCommonTestArea(null)
    setQuestionId(nextSubject === 'physics' && nextTopic ? questionsFor(nextSubject, nextTopic)[0]?.questionId ?? '' : '')
  }

  const selectPhysicsTopic = (topic: PhysicsTopicId) => {
    if (physicsSummary.counts[topic] <= 0) return
    setActiveTopic(topic)
    setQuestionId(questionsFor('physics', topic)[0]?.questionId ?? '')
  }

  const selectMathExerciseType = (type: MathExerciseType) => {
    setMathExerciseType(type)
    setActiveMathTopic(null)
    setActiveMathCommonTestArea(null)
    setQuestionId('')
  }

  const selectMathTopic = (topic: MathPracticeTopicId) => {
    if (mathSummary.counts[topic] <= 0) return
    setActiveMathTopic(topic)
    setActiveMathCommonTestArea(null)
    setQuestionId(questionsFor('math-1a', null, topic)[0]?.questionId ?? '')
  }

  const selectMathCommonTestArea = (area: MathCommonTestAreaId) => {
    if (mathCommonTestSummary[area] <= 0) return
    setActiveMathCommonTestArea(area)
    setActiveMathTopic(null)
    setQuestionId(
      catalog.find((question) =>
        question.subject === 'math-1a' &&
        question.status === 'published' &&
        mathCommonTestAreaForQuestion(question) === area,
      )?.questionId ?? '',
    )
  }

  const begin = () => {
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
        <NumberedSection
          number="03"
          title={text('章・単元', '章节・单元')}
          description={text('単元名を押すと、そのまま教材本文を開きます。', '点击单元名称即可直接打开教材正文。')}
        >
          <div className="textbook-part-list" data-testid="textbook-part-list">
            {physicsTextbookParts.map((part) => (
              <section className="textbook-part-group" data-testid={`textbook-part-${part.partNumber}`} key={part.partId}>
                <header className="textbook-part-heading">
                  <span>{text(`第${part.partNumber}部`, `第${part.partNumber}部`)}</span>
                  <strong>{part.partTitle}</strong>
                </header>

                <div className="textbook-chapter-list">
                  {part.chapters.map((chapter) => {
                    const chapterUnits = textbookUnits
                      .filter((unit) => unit.chapter?.chapterId === chapter.chapterId)
                      .sort((left, right) => (left.chapter?.orderInChapter ?? 0) - (right.chapter?.orderInChapter ?? 0))
                    const available = chapterUnits.length > 0

                    return (
                      <article
                        className={`textbook-chapter-card${available ? '' : ' textbook-chapter-card--pending'}`}
                        data-testid={`textbook-chapter-${chapter.chapterId}`}
                        key={chapter.chapterId}
                      >
                        <header>
                          <span>{text(`第${chapter.chapterNumber}章`, `第${chapter.chapterNumber}章`)}</span>
                          <div>
                            <strong>{chapter.chapterTitle}</strong>
                            <small>
                              {available
                                ? chapter.chapterId === 'physics-ch01-motion'
                                  ? text('3 テーマ', '3 个主题')
                                  : text(`${chapterUnits.length} 単元`, `${chapterUnits.length} 个单元`)
                                : text('準備中', '准备中')}
                            </small>
                          </div>
                        </header>

                        {available ? (
                          chapter.chapterId === 'physics-ch01-motion' ? (
                            <div className="textbook-unit-grid textbook-chunk-grid" data-testid="chapter1-chunk-grid">
                              {chapter1LearningChunks.map((chunk) => {
                                const chunkUnits = chunk.unitCodes
                                  .map((code) => chapterUnits.find((unit) => unit.chapter?.unitCode === code))
                                  .filter((candidate): candidate is TextbookUnit => Boolean(candidate))
                                if (chunkUnits.length === 0) return null

                                const summaries = chunkUnits.map((unit) =>
                                  textbookUnitProgress(unit, textbookProgress[unit.unitId]),
                                )
                                const completed = summaries.reduce((sum, summary) => sum + summary.completed, 0)
                                const total = summaries.reduce((sum, summary) => sum + summary.total, 0)
                                const percent = total > 0 ? Math.round((completed / total) * 100) : 0
                                const resumeUnit = chunkUnits.find((unit) => {
                                  const summary = textbookUnitProgress(unit, textbookProgress[unit.unitId])
                                  return summary.completed < summary.total
                                }) ?? chunkUnits[0]

                                return (
                                  <Link
                                    className="textbook-unit-link textbook-chunk-link"
                                    data-testid={`textbook-chunk-${chunk.id}`}
                                    key={chunk.id}
                                    to={`/learning/textbook/${resumeUnit.unitId}`}
                                  >
                                    <div>
                                      <strong>{chapter1Localized(chunk.title, language)}</strong>
                                      <small className="textbook-chunk-flow">{chapter1Localized(chunk.flow, language)}</small>
                                      <small>{text(`${completed}/${total} 完了`, `已完成 ${completed}/${total}`)}</small>
                                    </div>
                                    <span className="textbook-unit-percent">{percent}%</span>
                                  </Link>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="textbook-unit-grid">
                              {chapterUnits.map((unit) => {
                                const unitProgress = textbookProgress[unit.unitId]
                                const summary = textbookUnitProgress(unit, unitProgress)
                                return (
                                  <Link
                                    className="textbook-unit-link"
                                    data-testid={`textbook-unit-${unit.unitId}`}
                                    key={unit.unitId}
                                    to={`/learning/textbook/${unit.unitId}`}
                                  >
                                    <div>
                                      <strong>{displayTextbookUnitTitle(unit)}</strong>
                                      <small>
                                        {unitProgress
                                          ? text(`${summary.completed}/${summary.total} 完了`, `已完成 ${summary.completed}/${summary.total}`)
                                          : text('未開始', '未开始')}
                                      </small>
                                    </div>
                                    <span className="textbook-unit-percent">{summary.percent}%</span>
                                  </Link>
                                )
                              })}
                            </div>
                          )
                        ) : (
                          <p className="textbook-chapter-pending">
                            {text('教材データを準備中です。', '教材数据正在准备中。')}
                          </p>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
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
        <>
          <NumberedSection
            number="03"
            title={text('演習タイプ', '练习类型')}
            description={text('まず、基礎演習と共通テスト演習を分けて選びます。', '先区分基础练习与共通测试练习。')}
          >
            <div className="learning-mode-grid math-exercise-type-grid" role="radiogroup" aria-label={text('演習タイプ', '练习类型')}>
              <button
                type="button"
                role="radio"
                aria-checked={mathExerciseType === 'basic'}
                data-testid="math-exercise-basic"
                onClick={() => selectMathExerciseType('basic')}
              >
                <ListChecks aria-hidden="true" />
                <strong>{text('基礎演習', '基础练习')}</strong>
                <small>{text('4STEP｜章とテーマから問題を積み上げる', '4STEP｜按章节与主题逐步练习')}</small>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mathExerciseType === 'common-test'}
                data-testid="math-exercise-common-test"
                onClick={() => selectMathExerciseType('common-test')}
              >
                <BookOpenCheck aria-hidden="true" />
                <strong>{text('共通テスト演習', '共通测试练习')}</strong>
                <small>{text('会話・資料・条件を読みながら考える', '通过对话、资料与条件进行思考')}</small>
              </button>
            </div>
          </NumberedSection>

          {mathExerciseType === 'basic' && (
            <NumberedSection
              number="04"
              title={text('章・テーマ', '章节・主题')}
              description={text('章の中から学習テーマを選びます。', '从章节中选择学习主题。')}
            >
              <div className="textbook-chapter-list math-practice-chapter-list" data-testid="math-basic-chapters">
                {mathPracticeTaxonomy.map((domain) => (
                  <article className="textbook-chapter-card" data-testid={`math-domain-${domain.id}`} key={domain.id}>
                    <header>
                      <span>{text('数学 I', '数学 I')}</span>
                      <div>
                        <strong>{domain.label[language]}</strong>
                        <small>{text(`${domain.topics.length} テーマ`, `${domain.topics.length} 个主题`)}</small>
                      </div>
                    </header>
                    <div className="textbook-unit-grid math-theme-grid">
                      {domain.topics.map((topic) => {
                        const count = mathSummary.counts[topic.id]
                        const selected = activeMathTopic === topic.id
                        return (
                          <button
                            type="button"
                            className={`textbook-unit-link textbook-chunk-link math-theme-link${count === 0 ? ' math-theme-link--empty' : ''}${selected ? ' math-theme-link--selected' : ''}`}
                            data-testid={`math-topic-${topic.id}`}
                            aria-pressed={selected}
                            disabled={count === 0}
                            key={topic.id}
                            onClick={() => selectMathTopic(topic.id)}
                          >
                            <div>
                              <strong>{topic.label[language]}</strong>
                              <small className="textbook-chunk-flow">{topic.flow[language]}</small>
                              <small>{text(`${count} 問`, `${count} 题`)}</small>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </NumberedSection>
          )}

          {mathExerciseType === 'common-test' && (
            <NumberedSection
              number="04"
              title={text('分野', '领域')}
              description={text('共通テスト型の問題を分野から選びます。', '从领域中选择共通测试型题目。')}
            >
              <div className="textbook-unit-grid math-common-test-grid" data-testid="math-common-test-areas">
                {mathCommonTestAreas.map((area) => {
                  const count = mathCommonTestSummary[area.id]
                  const selected = activeMathCommonTestArea === area.id
                  return (
                    <button
                      type="button"
                      className={`textbook-unit-link textbook-chunk-link math-theme-link${count === 0 ? ' math-theme-link--empty' : ''}${selected ? ' math-theme-link--selected' : ''}`}
                      data-testid={`math-common-test-${area.id}`}
                      aria-pressed={selected}
                      disabled={count === 0}
                      key={area.id}
                      onClick={() => selectMathCommonTestArea(area.id)}
                    >
                      <div>
                        <strong>{area.label[language]}</strong>
                        <small className="textbook-chunk-flow">{area.flow[language]}</small>
                        <small>{text(`${count} 問`, `${count} 题`)}</small>
                      </div>
                    </button>
                  )
                })}
              </div>
            </NumberedSection>
          )}

          {mathExerciseType === 'basic' && activeMathTopic && (
            <NumberedSection number="05" title={text('問題', '题目')}>
              <div className="topic-filter-note" data-testid="math-topic-filter">
                <span>{text('選択中のテーマ', '当前主题')}</span>
                <div className="math-topic-filter-copy">
                  <strong>{mathPracticeTopicLabel(activeMathTopic, language)}</strong>
                  <small>{mathPracticeTopicFlow(activeMathTopic, language)}</small>
                </div>
                <small>{text(`${subjectQuestions.length} 問`, `${subjectQuestions.length} 题`)}</small>
              </div>
              <div className="math-problem-grid" role="group" aria-label={text('問題番号', '题号')}>
                {subjectQuestions.map((question) => {
                  const number = mathPracticeProblemNumber(question.questionId)
                  return (
                    <button
                      type="button"
                      className={`math-problem-button${questionId === question.questionId ? ' math-problem-button--selected' : ''}`}
                      data-testid={`math-problem-${number ?? question.questionId}`}
                      aria-pressed={questionId === question.questionId}
                      key={question.questionId}
                      onClick={() => setQuestionId(question.questionId)}
                    >
                      {number ?? question.title}
                    </button>
                  )
                })}
              </div>
            </NumberedSection>
          )}

          {mathExerciseType === 'common-test' && activeMathCommonTestArea && (
            <NumberedSection number="05" title={text('問題', '题目')}>
              <div className="math-common-test-question-list" role="group" aria-label={text('学習する問題', '选择学习题目')}>
                {subjectQuestions.map((question) => (
                  <button
                    type="button"
                    className={`math-common-test-question${questionId === question.questionId ? ' math-common-test-question--selected' : ''}`}
                    aria-pressed={questionId === question.questionId}
                    key={question.questionId}
                    onClick={() => setQuestionId(question.questionId)}
                  >
                    <strong>{question.title}</strong>
                  </button>
                ))}
              </div>
            </NumberedSection>
          )}
        </>
      )}

      {mode === 'practice' && SHOW_GUIDANCE_LEVEL && (
        <NumberedSection number="05" title={text('誘導レベル', '引导强度')}>
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

      {mode === 'practice' && (
        <RaisedButton
          type="button"
          className="primary-button"
          data-testid="start-learning"
          disabled={!questionId}
          onClick={begin}
        >
          {text('この設定で問題を解く', '按此设置开始做题')}
        </RaisedButton>
      )}
    </div>
  )
}
