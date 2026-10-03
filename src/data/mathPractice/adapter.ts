import type { ContentBlock, LearningBlank, Question } from '../../domain/questionSchema'
import { validateQuestionCatalog } from '../../domain/questionSchema'
import { mathPracticePilotSource } from './pilot'
import { mathPracticePilotSourceZh } from './pilot.zh'
import { mathPracticeSetsBatchASource } from './setsBatchA'
import { mathPracticeSetsBatchASourceZh } from './setsBatchA.zh'
import { mathPracticePropositionsBatchBSource } from './propositionsBatchB'
import { mathPracticePropositionsBatchBSourceZh } from './propositionsBatchB.zh'
import { mathPracticeProofsBatchCSource } from './proofsBatchC'
import { mathPracticeProofsBatchCSourceZh } from './proofsBatchC.zh'
import { mathPracticeFunctionsBatchDSource } from './functionsBatchD'
import { mathPracticeFunctionsBatchDSourceZh } from './functionsBatchD.zh'
import type {
  MathPracticeSimulationItem,
  MathPracticeSourceBlock,
  MathPracticeSourceChoice,
  MathPracticeSourceQuestion,
} from './source'

type Locale = 'ja' | 'zh'

function qid(problemNo: number) {
  return `math-practice-${String(problemNo).padStart(3, '0')}`
}

function toContentBlock(id: string, block: MathPracticeSourceBlock): ContentBlock {
  if (block.type === 'latex') {
    return {
      id,
      type: 'latex',
      latex: block.latex,
      display: block.display ?? 'block',
    }
  }

  return {
    id,
    type: 'text',
    text: block.text,
  }
}

function optionId(questionId: string, blankId: string, choice: MathPracticeSourceChoice) {
  return `${questionId}-${blankId}-${choice.id}`
}

function createBlank(questionId: string, blank: MathPracticeSourceQuestion['blanks'][number], locale: Locale): LearningBlank {
  const correct = blank.choices.filter((choice) => choice.correct)
  if (!correct.length) throw new Error(`Math practice blank has no correct choice: ${questionId}/${blank.id}`)

  return {
    id: `${questionId}-${blank.id}`,
    answerType: 'single-choice',
    prompt: blank.prompt,
    options: blank.choices.map((choice) => {
      const id = optionId(questionId, blank.id, choice)
      return {
        id,
        content: [{ id: `${id}-content`, type: 'text', text: choice.label }],
        misconceptionTags: choice.correct ? [] : ['misconception'],
        wrongReason: choice.correct
          ? []
          : [{
              id: `${id}-reason`,
              type: 'text',
              text: choice.wrongReason ?? (locale === 'ja' ? '問題の条件と直前の推論をもう一度確認しよう。' : '请重新检查题目条件和刚才的推理。'),
            }],
      }
    }),
    correctOptionIds: correct.map((choice) => optionId(questionId, blank.id, choice)),
    knowledgeTags: blank.knowledgeTags,
    skillTag: blank.skillTag,
    explanation: [{
      id: `${questionId}-${blank.id}-explanation`,
      type: 'text',
      text: blank.explanation,
    }],
  }
}

function createSimulationItem(questionId: string, item: MathPracticeSimulationItem): Question['simulation']['items'][number] {
  const base = {
    id: `${questionId}-sim-${item.id}`,
    label: item.label,
    prompt: [{
      id: `${questionId}-sim-${item.id}-prompt`,
      type: 'text' as const,
      text: item.prompt,
    }],
    score: item.score,
    estimatedSeconds: item.estimatedSeconds,
    knowledgeTags: item.knowledgeTags,
    skillTags: item.skillTags,
  }

  if (item.answerType === 'number') {
    return {
      ...base,
      answerType: 'number',
      correctValue: item.correctValue,
      tolerance: item.tolerance ?? 0,
    }
  }

  const correct = item.choices.filter((choice) => choice.correct)
  if (!correct.length) throw new Error(`Math practice simulation item has no correct choice: ${questionId}/${item.id}`)

  const options = item.choices.map((choice) => {
    const id = `${questionId}-sim-${item.id}-${choice.id}`
    return {
      id,
      content: [{ id: `${id}-content`, type: 'text' as const, text: choice.label }],
    }
  })

  return {
    ...base,
    answerType: item.answerType,
    options,
    correctOptionIds: correct.map((choice) => `${questionId}-sim-${item.id}-${choice.id}`),
    tolerance: 0,
  }
}

function createQuestion(source: MathPracticeSourceQuestion, locale: Locale): Question {
  const questionId = qid(source.problemNo)
  const blankMap = new Map(source.blanks.map((blank) => [blank.id, blank]))

  const stem = source.problem.map((block, index) =>
    toContentBlock(`${questionId}-problem-${index + 1}`, block),
  )

  let guideContentIndex = 0
  const solutionFlow: Question['learning']['solutionFlow'] = source.guide.map((node, index) => {
    if (node.type === 'blank') {
      if (!blankMap.has(node.blankId)) {
        throw new Error(`Unknown math practice blank: ${questionId}/${node.blankId}`)
      }
      return {
        id: `${questionId}-flow-${index + 1}`,
        type: 'blank',
        blankId: `${questionId}-${node.blankId}`,
      }
    }

    return {
      id: `${questionId}-flow-${index + 1}`,
      type: 'content',
      content: node.blocks.map((block) => {
        guideContentIndex += 1
        return toContentBlock(`${questionId}-guide-${guideContentIndex}`, block)
      }),
    }
  })

  const blanks = Object.fromEntries(
    source.blanks.map((blank) => {
      const adapted = createBlank(questionId, blank, locale)
      return [adapted.id, adapted]
    }),
  )

  const blankIds = Object.keys(blanks)
  const question: Question = {
    schemaVersion: '1.0',
    questionId,
    revision: 1,
    status: 'published',
    subject: 'math-1a',
    unitType: 'major-question',
    title: `${source.problemNo}｜${source.title}`,
    source: {
      type: 'reference',
      label: locale === 'ja' ? `4STEP 問題${source.problemNo}` : `4STEP 题目${source.problemNo}`,
      rightsNote: locale === 'ja'
        ? '原問題を基に、レビュー済みの「問題／考えながら解く」練習モードへ構造化'
        : '基于原题，结构化为已审核的“题目／边思考边解答”练习模式',
    },
    taxonomy: {
      majorUnit: source.section === 'functions' ? 'functions' : 'sets-and-propositions',
      minorUnit: source.section,
      knowledgeTags: source.knowledgeTags,
      skillTags: source.skillTags,
    },
    difficulty: 'basic',
    examLevel: 'foundation',
    estimatedSeconds: source.estimatedSeconds,
    assets: [],
    stem,
    learning: {
      presentation: 'standard',
      solutionFlow,
      blanks,
      variants: {
        detailed: blankIds,
        standard: blankIds,
        selfCheck: blankIds.length ? [blankIds.at(-1)!] : blankIds,
      },
    },
    simulation: {
      material: [
        {
          id: `${questionId}-sim-material-heading`,
          type: 'text',
          text: locale === 'ja' ? '元の問題に戻って、自力で確認しよう。' : '回到原题，独立检查自己的答案。',
        },
        ...source.problem.map((block, index) =>
          toContentBlock(`${questionId}-sim-material-${index + 1}`, block),
        ),
      ],
      items: source.simulation.map((item) => createSimulationItem(questionId, item)),
    },
    fullExplanation: [{
      id: `${questionId}-full-explanation`,
      type: 'text',
      text: source.fullExplanation,
    }],
    relatedQuestions: {
      sameKnowledge: [],
      sameMethod: [],
      reinforcement: [],
    },
  }

  return question
}

function buildMathPracticeQuestions(source: MathPracticeSourceQuestion[], locale: Locale) {
  return validateQuestionCatalog(source.map((question) => createQuestion(question, locale)))
}

const mathPracticePublishedSource = [
  ...mathPracticePilotSource,
  ...mathPracticeSetsBatchASource,
  ...mathPracticePropositionsBatchBSource,
  ...mathPracticeProofsBatchCSource,
  ...mathPracticeFunctionsBatchDSource,
].sort((left, right) => left.problemNo - right.problemNo)
const mathPracticePublishedSourceZh = [
  ...mathPracticePilotSourceZh,
  ...mathPracticeSetsBatchASourceZh,
  ...mathPracticePropositionsBatchBSourceZh,
  ...mathPracticeProofsBatchCSourceZh,
  ...mathPracticeFunctionsBatchDSourceZh,
].sort((left, right) => left.problemNo - right.problemNo)

export const mathPracticePilotQuestions = buildMathPracticeQuestions(mathPracticePublishedSource, 'ja')
export const mathPracticePilotQuestionsZh = buildMathPracticeQuestions(mathPracticePublishedSourceZh, 'zh')
