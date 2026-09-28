import type { ContentBlock, LearningBlank, Question } from '../domain/questionSchema'
import { validateQuestionCatalog } from '../domain/questionSchema'
import type { TextbookItem, TextbookSection, TextbookUnit } from '../domain/textbookSchema'
import { builtInTextbookUnits } from './textbook'

type Locale = 'ja' | 'zh'

const unitNames = {
  '1A': { ja: '変位と速度', zh: '位移与速度' },
  '1B': { ja: '速度の合成と分解', zh: '速度的合成与分解' },
  '1C': { ja: '相対速度', zh: '相对速度' },
  '1D': { ja: '加速度', zh: '加速度' },
  '1E': { ja: '水平投射', zh: '平抛运动' },
  '1F': { ja: '斜方投射', zh: '斜抛运动' },
  '1G': { ja: '重力加速度・空気抵抗・終端速度', zh: '重力加速度・空气阻力・终端速度' },
} as const

function normalizeChoice(value: string) {
  return value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\s\u3000]/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/[⃗→]/g, '')
}

function chineseChoice(value: string, fallback: string) {
  let result = value
    .replaceAll('上向き', '向上')
    .replaceAll('下向き', '向下')
    .replaceAll('右向き', '向右')
    .replaceAll('左向き', '向左')
    .replaceAll('東向き', '向东')
    .replaceAll('西向き', '向西')
    .replaceAll('北向き', '向北')
    .replaceAll('南向き', '向南')
    .replaceAll('大きくなる', '增大')
    .replaceAll('小さくなる', '减小')
    .replaceAll('増加する', '增大')
    .replaceAll('減少する', '减小')
    .replaceAll('一定のまま', '保持不变')
    .replaceAll('一定', '不变')
    .replaceAll('空気抵抗', '空气阻力')
    .replaceAll('接線方向', '切线方向')
    .replaceAll('接線', '切线')
    .replaceAll('水平方向', '水平方向')
    .replaceAll('鉛直方向', '竖直方向')
    .replaceAll('同じ', '相同')
    .replaceAll('負（−）', '负（−）')
    .replaceAll('正（＋）', '正（＋）')
    .replaceAll('時計回り', '顺时针')
    .replaceAll('反時計回り', '逆时针')
    .replaceAll('秒', '秒')
    .replaceAll('最大', '最大')
    .replaceAll('最小', '最小')

  result = result.replace(/[ぁ-んァ-ンー]/g, '').trim()
  return result || fallback
}

function skillForItem(item: TextbookItem, final: boolean): LearningBlank['skillTag'] {
  if (final) return 'conclusion'
  if (item.answerType === 'formula') return 'equation-building'
  if (item.answerType === 'number') return 'calculation'
  if (/向き|方向|図|グラフ/.test(item.prompt)) return 'graph-reading'
  return 'law-selection'
}

function questionId(unit: TextbookUnit, section: TextbookSection) {
  const code = unit.chapter?.unitCode.toLowerCase() ?? unit.unitId
  return `physics-ch01-${code}-${section.id}`
}

function blankId(qid: string, item: TextbookItem) {
  return `${qid}-${item.id}`
}

function createBlank(qid: string, unit: TextbookUnit, item: TextbookItem, itemIndex: number, final: boolean, locale: Locale): LearningBlank {
  const choices = item.choices ?? [item.answer, ...item.acceptedAnswers]
  const normalizedAnswer = normalizeChoice(item.answer)
  const correctIndex = choices.findIndex((choice) => normalizeChoice(choice) === normalizedAnswer)
  if (correctIndex < 0) throw new Error(`No correct choice for ${qid}/${item.id}`)

  const id = blankId(qid, item)
  const unitTag = `ch01-${unit.chapter?.unitCode.toLowerCase() ?? 'unit'}`
  const skillTag = skillForItem(item, final)

  return {
    id,
    answerType: 'single-choice',
    prompt: locale === 'ja' ? item.prompt : `手順${itemIndex + 1}：正しい結果を選びなさい。`,
    options: choices.map((choice, index) => {
      const optionId = `${id}-opt-${index + 1}`
      const label = locale === 'ja' ? choice : chineseChoice(choice, `选项${index + 1}`)
      const correct = index === correctIndex
      return {
        id: optionId,
        content: [{ id: `${optionId}-content`, type: 'text', text: label }],
        misconceptionTags: correct ? [] : ['misconception'],
        wrongReason: correct
          ? []
          : [{
              id: `${optionId}-reason`,
              type: 'text',
              text: locale === 'ja'
                ? `教科書例題の条件と式を確認すると、正解は「${item.answer}」です。`
                : `根据教材例题的条件与关系式，正确结果应为“${chineseChoice(item.answer, '正确选项')}”。`,
            }],
      }
    }),
    correctOptionIds: [`${id}-opt-${correctIndex + 1}`],
    knowledgeTags: ['motion', unitTag],
    skillTag,
    explanation: [{
      id: `${id}-explanation`,
      type: 'text',
      text: locale === 'ja'
        ? `この段階の正解は「${item.answer}」です。`
        : `这一步的正确结果是“${chineseChoice(item.answer, '正确选项')}”。`,
    }],
  }
}

function createAssets(qid: string, section: TextbookSection, locale: Locale): Question['assets'] {
  return section.figures.map((figure, index) => ({
    id: `${qid}-asset-${index + 1}`,
    type: 'image' as const,
    src: figure.src,
    alt: locale === 'ja' ? figure.alt : `教材例题图${index + 1}`,
  }))
}

function createJapaneseFlow(
  qid: string,
  section: TextbookSection,
  finalBlankId: string,
  assets: Question['assets'],
): Question['learning']['solutionFlow'] {
  const figureAsset = new Map(section.figures.map((figure, index) => [figure.id, assets[index]?.id]))
  const itemIds = new Set(section.items.map((item) => blankId(qid, item)))
  const referenced = new Set<string>()
  const flow: Question['learning']['solutionFlow'] = []
  let flowIndex = 0
  let contentIndex = 0

  const pushContent = (content: ContentBlock[]) => {
    if (!content.length) return
    flowIndex += 1
    flow.push({ id: `${qid}-flow-${flowIndex}`, type: 'content', content })
  }

  for (const block of section.readingFlow) {
    if (block.type === 'heading' || block.type === 'note') {
      contentIndex += 1
      pushContent([{
        id: `${qid}-content-${contentIndex}`,
        type: 'text',
        text: block.text,
      }])
      continue
    }

    if (block.type === 'figure') {
      const assetId = figureAsset.get(block.figureId)
      const figure = section.figures.find((candidate) => candidate.id === block.figureId)
      if (assetId && figure) {
        contentIndex += 1
        pushContent([{
          id: `${qid}-content-${contentIndex}`,
          type: 'image',
          assetId,
          alt: figure.alt,
          caption: figure.caption,
        }])
      }
      continue
    }

    const buffered: ContentBlock[] = []
    const flush = () => {
      pushContent(buffered.splice(0, buffered.length))
    }

    for (const part of block.parts) {
      if (part.type === 'choice') {
        flush()
        const item = section.items.find((candidate) => candidate.id === part.itemId)
        if (!item) continue
        const id = blankId(qid, item)
        referenced.add(id)
        if (id !== finalBlankId) {
          flowIndex += 1
          flow.push({ id: `${qid}-flow-${flowIndex}`, type: 'blank', blankId: id })
        }
        continue
      }

      contentIndex += 1
      buffered.push(part.type === 'math'
        ? { id: `${qid}-content-${contentIndex}`, type: 'latex', latex: part.latex, display: block.type === 'formula' ? 'block' : 'inline' }
        : { id: `${qid}-content-${contentIndex}`, type: 'text', text: part.text })
    }
    flush()
  }

  for (const item of section.items) {
    const id = blankId(qid, item)
    if (id === finalBlankId || referenced.has(id)) continue
    contentIndex += 1
    pushContent([{
      id: `${qid}-content-${contentIndex}`,
      type: 'text',
      text: `次の判断を確認する：${item.prompt}`,
    }])
    flowIndex += 1
    flow.push({ id: `${qid}-flow-${flowIndex}`, type: 'blank', blankId: id })
  }

  if (!flow.length) {
    pushContent([{ id: `${qid}-content-1`, type: 'text', text: '教科書例題の条件を整理して最終結果を選ぶ。' }])
  }

  return flow
}

function createChineseFlow(qid: string, section: TextbookSection, finalBlankId: string): Question['learning']['solutionFlow'] {
  const flow: Question['learning']['solutionFlow'] = []
  let index = 0
  for (const item of section.items) {
    const id = blankId(qid, item)
    if (id === finalBlankId) continue
    index += 1
    flow.push({
      id: `${qid}-flow-${index}-guide`,
      type: 'content',
      content: [{
        id: `${qid}-content-${index}`,
        type: 'text',
        text: `根据教材例题的条件与关系式，完成第${index}步。`,
      }],
    })
    flow.push({ id: `${qid}-flow-${index}-blank`, type: 'blank', blankId: id })
  }

  if (!flow.length) {
    flow.push({
      id: `${qid}-flow-1-guide`,
      type: 'content',
      content: [{ id: `${qid}-content-1`, type: 'text', text: '整理题目条件后，选择最终结果。' }],
    })
  }
  return flow
}

function createQuestion(unit: TextbookUnit, section: TextbookSection, workedIndex: number, locale: Locale): Question {
  const qid = questionId(unit, section)
  const code = unit.chapter?.unitCode ?? '1A'
  const localizedUnitName = unitNames[code as keyof typeof unitNames]?.[locale] ?? code
  const items = section.items
  const finalItem = items.at(-1)
  if (!finalItem) throw new Error(`Worked example has no items: ${qid}`)

  const finalId = blankId(qid, finalItem)
  const blanks = Object.fromEntries(
    items.map((item, index) => {
      const id = blankId(qid, item)
      return [id, createBlank(qid, unit, item, index, id === finalId, locale)]
    }),
  )
  const blankIds = Object.keys(blanks)
  const assets = createAssets(qid, section, locale)
  const flow = locale === 'ja'
    ? createJapaneseFlow(qid, section, finalId, assets)
    : createChineseFlow(qid, section, finalId)

  const finalBlank = blanks[finalId]
  const simulationOptions = finalBlank.options.map((choice) => ({
    id: `${choice.id}-sim`,
    content: choice.content.map((block, index) => ({
      ...block,
      id: `${choice.id}-sim-content-${index + 1}`,
    })),
  }))
  const correctOptionIndex = finalBlank.options.findIndex((option) => finalBlank.correctOptionIds.includes(option.id))
  const title = locale === 'ja'
    ? `${code} ${localizedUnitName}｜例題${workedIndex}`
    : `${code} ${localizedUnitName}｜例题${workedIndex}`
  const unitTag = `ch01-${code.toLowerCase()}`
  const allAnswers = items.map((item, index) =>
    locale === 'ja'
      ? `STEP ${index + 1}: ${item.answer}`
      : `步骤${index + 1}: ${chineseChoice(item.answer, '正确选项')}`,
  ).join(locale === 'ja' ? ' / ' : '；')

  return {
    schemaVersion: '1.0',
    questionId: qid,
    revision: 1,
    status: 'published',
    subject: 'physics',
    unitType: 'major-question',
    title,
    source: {
      type: 'reference',
      label: locale === 'ja' ? `物理教科書 第1章 ${code}` : `物理教材 第1章 ${code}`,
      rightsNote: locale === 'ja'
        ? '教科書モードのworked-exampleを題庫用Questionへ構造変換'
        : '由教材例题结构化转换为题库Question',
    },
    taxonomy: {
      majorUnit: 'mechanics',
      minorUnit: 'motion',
      knowledgeTags: ['motion', unitTag],
      skillTags: ['equation-building', 'calculation', 'conclusion'],
    },
    difficulty: 'basic',
    examLevel: 'foundation',
    estimatedSeconds: Math.max(180, items.length * 75),
    assets,
    stem: [{
      id: `${qid}-stem-1`,
      type: 'text',
      text: locale === 'ja'
        ? `${code}「${localizedUnitName}」の教科書例題。問題文と解法の流れを確認しながら、各段階を完成させよ。`
        : `教材第${code}单元“${localizedUnitName}”例题。根据题目条件与解题过程，完成各步骤。`,
    }],
    learning: {
      presentation: 'common-test',
      flowType: 'calculation-derivation',
      finalBlankId: finalId,
      solutionFlow: flow,
      blanks,
      variants: {
        detailed: blankIds,
        standard: blankIds,
        selfCheck: [finalId],
      },
    },
    simulation: {
      material: [{
        id: `${qid}-sim-material-1`,
        type: 'text',
        text: locale === 'ja'
          ? `${code}「${localizedUnitName}」の例題について、最終結果を選べ。`
          : `关于第${code}单元“${localizedUnitName}”的例题，选择最终结果。`,
      }],
      items: [{
        id: `${qid}-sim-item-1`,
        label: locale === 'ja' ? '問1' : '问题 1',
        prompt: [{
          id: `${qid}-sim-prompt-1`,
          type: 'text',
          text: locale === 'ja' ? finalItem.prompt : '选择与教材例题相符的最终结果。',
        }],
        answerType: 'single-choice',
        options: simulationOptions,
        correctOptionIds: [simulationOptions[correctOptionIndex]?.id],
        score: 4,
        estimatedSeconds: 120,
        knowledgeTags: ['motion', unitTag],
        skillTags: ['conclusion'],
      }],
    },
    fullExplanation: [{
      id: `${qid}-full-1`,
      type: 'text',
      text: locale === 'ja'
        ? `教科書例題の解答系列：${allAnswers}`
        : `教材例题的答案顺序：${allAnswers}`,
    }],
    relatedQuestions: { sameKnowledge: [], sameMethod: [], reinforcement: [] },
  }
}

function buildChapter1PracticeQuestions(locale: Locale) {
  const questions: Question[] = []
  for (const unit of builtInTextbookUnits) {
    const worked = unit.sections.filter((section) => section.role === 'worked-example')
    worked.forEach((section, index) => questions.push(createQuestion(unit, section, index + 1, locale)))
  }
  return validateQuestionCatalog(questions)
}

export const chapter1PracticeQuestions = buildChapter1PracticeQuestions('ja')
export const chapter1PracticeQuestionsZh = buildChapter1PracticeQuestions('zh')
