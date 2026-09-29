import source from '../../../../docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md?raw'
import { validateTextbookUnits, type TextbookFigure, type TextbookItem, type TextbookReadingBlock } from '../../../domain/textbookSchema'

type UnitCode = '1A' | '1B' | '1C' | '1D' | '1E' | '1F' | '1G'

type UnitMeta = {
  code: UnitCode
  unitId: string
  title: string
  order: number
  pages: number[]
  revision: number
}

const unitMeta: UnitMeta[] = [
  { code: '1A', unitId: 'physics-a-displacement-velocity', title: '変位と速度', order: 1, pages: [12, 13], revision: 4 },
  { code: '1B', unitId: 'physics-1b-velocity-composition', title: '速度の合成と分解', order: 2, pages: [14, 15], revision: 2 },
  { code: '1C', unitId: 'physics-1c-relative-velocity', title: '相対速度', order: 3, pages: [16, 17], revision: 2 },
  { code: '1D', unitId: 'physics-1d-acceleration', title: '加速度', order: 4, pages: [18, 19], revision: 2 },
  { code: '1E', unitId: 'physics-1e-horizontal-projectile', title: '水平投射', order: 5, pages: [20, 21], revision: 2 },
  { code: '1F', unitId: 'physics-1f-oblique-projectile', title: '斜方投射', order: 6, pages: [22, 23, 24], revision: 2 },
  { code: '1G', unitId: 'physics-1g-gravity-drag-terminal-velocity', title: '重力加速度・空気抵抗・終端速度', order: 7, pages: [25, 26, 27], revision: 2 },
]

const neutralFigureText: Record<string, string> = {
  'fig-1': '図1　2つの位置と矢印の関係',
  'fig-2': '図2　曲線上の2点を結ぶ方向',
  'fig-3': '図3　曲線上の速度の向き',
  'fig-4': '図4　座標成分で見た移動',
  'fig-5': '図5　川を横切る船の運動',
  'fig-6': '図6　速度ベクトルと座標軸',
  'fig-7': '図7　2台の自動車の運動',
  'fig-8': '図8　雨と自転車の運動',
  'fig-9': '図9　曲線運動と2つの速度',
  'fig-10': '図10　速度ベクトルの変化',
  'fig-11': '図11　水平投射の等時間位置',
  'fig-12': '図12　水平投射の速度成分',
  'fig-13': '図13　斜方投射の軌跡',
  'fig-14': '図14　斜方投射の速度成分',
  'fig-15': '図15　落下物体にはたらく力',
  'fig-16': '図16　落下中の力の変化',
  'fig-17': '図17　落下中の速度変化',
}

const knownObjectives: Record<UnitCode, string[]> = {
  '1A': ['位置・変位・速度を一つの流れで理解する', '図とベクトル式を対応させる', '平均速度から瞬間速度へ考えをつなぐ'],
  '1B': ['速度をベクトルとして合成する', '速度を直交成分へ分解する', '成分から速さを復元する'],
  '1C': ['観測者によって見える速度が変わることを理解する', '相対速度をベクトルの差として扱う', '平面上の相対速度へ応用する'],
  '1D': ['速度の変化から加速度を理解する', 'v-tグラフの傾きと面積を物理量へつなぐ', '等加速度運動の式を途中式から導く'],
  '1E': ['水平投射を水平・鉛直方向へ分けて考える', '自由落下の式を鉛直方向へ適用する', '時間を消去して放物線軌道を導く'],
  '1F': ['斜方投射の初速度を分解する', '最高点・飛行時間・軌道式を条件から導く', '水平到達距離の式を途中式から作る'],
  '1G': ['重力と空気抵抗の関係を理解する', '速度比例抵抗モデルから加速度変化を読む', '終端速度を物理条件から導く'],
}

function itemId(sourceId: string) {
  return sourceId.toLowerCase()
}

function answerKey() {
  const answerSection = source.includes('# 解答') ? source.slice(source.indexOf('# 解答')) : ''
  const answers = new Map<string, string>()
  for (const match of answerSection.matchAll(/^([A-G]\d+[a-z]?)　(.+)$/gm)) {
    answers.set(match[1], match[2].trim())
  }
  return answers
}

const answers = answerKey()

function parseChoices(block: string) {
  const flat = block.replace(/\n/g, ' ').trim()
  const matches = [...flat.matchAll(/(?:^|[　]{2,}|\s{2,})([A-D])\.\s*(.*?)(?=(?:[　]{2,}|\s{2,})[A-D]\.\s*|$)/g)]
  if (matches.length === 4) return matches.map((match) => match[2].trim())

  return flat
    .split(/(?=[A-D]\.\s*)/)
    .map((part) => part.replace(/^[A-D]\.\s*/, '').trim())
    .filter(Boolean)
}

function inferAnswerType(answer: string): 'text' | 'formula' | 'number' {
  if (/^-?\d+(?:\.\d+)?(?:°)?$/.test(answer)) return 'number'
  if (/[=+\-−×÷/√²³⃗θΔ()]|(?:sin|cos|tan)|[₀₁₂₃₄₅₆₇₈₉ₓᵧₜ]/.test(answer)) return 'formula'
  return 'text'
}

function acceptedAnswers(answer: string) {
  const variants = new Set<string>()
  variants.add(answer)
  variants.add(answer.replace(/−/g, '-'))
  variants.add(answer.replace(/⃗/g, ''))
  variants.add(answer.replace(/ /g, ''))
  variants.delete(answer)
  return [...variants].filter(Boolean)
}

function stripMarkdown(value: string) {
  return value
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

function normalizeLatex(value: string) {
  let next = stripMarkdown(value)
  next = next
    .replace(/⃗/g, '\\vec{}')
    .replace(/Δ/g, '\\Delta ')
    .replace(/θ/g, '\\theta ')
    .replace(/→/g, '\\to ')
    .replace(/−/g, '-')
    .replace(/×/g, '\\times ')
    .replace(/·/g, '\\cdot ')
    .replace(/₀/g, '_0')
    .replace(/₁/g, '_1')
    .replace(/₂/g, '_2')
    .replace(/₃/g, '_3')
    .replace(/₄/g, '_4')
    .replace(/₅/g, '_5')
    .replace(/₆/g, '_6')
    .replace(/₇/g, '_7')
    .replace(/₈/g, '_8')
    .replace(/₉/g, '_9')
    .replace(/ₓ/g, '_x')
    .replace(/ᵧ/g, '_y')
    .replace(/ₜ/g, '_t')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/\bcos\b/g, '\\cos')
    .replace(/\bsin\b/g, '\\sin')
    .replace(/\btan\b/g, '\\tan')
    .replace(/√\(([^()]+)\)/g, '\\sqrt{$1}')
    .replace(/√([A-Za-z0-9]+)/g, '\\sqrt{$1}')
    .replace(/\blim\(([^)]+)\)/g, '\\lim_{$1}')
  next = next.replace(/([A-Za-zΔ])\\vec\{\}/g, '\\vec{$1}')
  return next
}

function isFormulaLine(line: string) {
  if (!line.includes('=')) return false
  if (/[。！？]/.test(line)) return false
  const japanese = (line.match(/[ぁ-んァ-ヶ一-龠]/g) ?? []).length
  return japanese <= 2
}

function splitWithHoles(value: string, math: boolean) {
  const parts: Array<
    { type: 'text'; text: string }
    | { type: 'math'; latex: string }
    | { type: 'choice'; itemId: string }
  > = []
  const regex = /【([A-G]\d+[a-z]?)[^】]*】/g
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(value))) {
    const before = value.slice(cursor, match.index)
    if (before) {
      if (math) parts.push({ type: 'math', latex: normalizeLatex(before) })
      else parts.push({ type: 'text', text: stripMarkdown(before) })
    }
    parts.push({ type: 'choice', itemId: itemId(match[1]) })
    cursor = match.index + match[0].length
  }

  const after = value.slice(cursor)
  if (after) {
    if (math) parts.push({ type: 'math', latex: normalizeLatex(after) })
    else parts.push({ type: 'text', text: stripMarkdown(after) })
  }

  if (!parts.length) {
    if (math) parts.push({ type: 'math', latex: normalizeLatex(value) })
    else parts.push({ type: 'text', text: stripMarkdown(value) })
  }

  return parts.filter((part) => part.type === 'choice' || (part.type === 'text' ? part.text.length > 0 : part.latex.length > 0))
}

function sourceSlice(code: UnitCode, next?: UnitCode) {
  const start = source.indexOf(`# ${code}　`)
  const end = next
    ? source.indexOf(`# ${next}　`, start)
    : source.indexOf('# 第1章全体', start)
  if (start < 0 || end < 0) throw new Error(`v2.2 source range not found: ${code}`)
  return source.slice(start, end)
}

function parseUnit(meta: UnitMeta, next?: UnitCode) {
  const unitSource = sourceSlice(meta.code, next)
  const choicesById = new Map<string, string[]>()

  for (const match of unitSource.matchAll(/:::choices id="([^"]+)"\n([\s\S]*?)\n:::/g)) {
    const values = parseChoices(match[2])
    if (values.length !== 4) throw new Error(`Expected four choices for ${match[1]}, got ${values.length}`)
    choicesById.set(match[1], values)
  }

  const items: TextbookItem[] = [...choicesById.entries()].map(([sourceId, choices]) => {
    const answer = answers.get(sourceId) ?? choices[0]
    if (!choices.includes(answer)) throw new Error(`Answer is not one of the choices for ${sourceId}: ${answer}`)
    return {
      id: itemId(sourceId),
      label: sourceId,
      prompt: `空欄 ${sourceId} に入る内容を選んで、本文・式を完成させよう。`,
      answer,
      acceptedAnswers: acceptedAnswers(answer),
      answerType: inferAnswerType(answer),
      choices,
    }
  })

  const figures: TextbookFigure[] = []
  const blocks: TextbookReadingBlock[] = []
  let headingIndex = 0
  let paragraphIndex = 0
  let formulaIndex = 0
  let figureIndex = 0
  let noteIndex = 0

  const bodyLines = unitSource.split('\n')
  let paragraphLines: string[] = []

  const flushParagraph = () => {
    const text = paragraphLines.join(' ').trim()
    paragraphLines = []
    if (!text) return
    const formula = isFormulaLine(text)
    if (formula) {
      formulaIndex += 1
      blocks.push({ id: `formula-${formulaIndex}`, type: 'formula', parts: splitWithHoles(text, true) })
    } else {
      paragraphIndex += 1
      blocks.push({ id: `paragraph-${paragraphIndex}`, type: 'paragraph', parts: splitWithHoles(text, false) })
    }
  }

  for (let index = 1; index < bodyLines.length; index += 1) {
    const line = bodyLines[index].trim()

    if (!line) {
      flushParagraph()
      continue
    }

    if (line.startsWith('## ')) {
      flushParagraph()
      headingIndex += 1
      blocks.push({ id: `heading-${headingIndex}`, type: 'heading', text: line.slice(3).trim() })
      continue
    }

    if (line.startsWith(':::choices ')) {
      flushParagraph()
      while (index + 1 < bodyLines.length && bodyLines[index + 1].trim() !== ':::') index += 1
      if (index + 1 < bodyLines.length) index += 1
      continue
    }

    if (line.startsWith(':::figure ')) {
      flushParagraph()
      const directive = line.match(/^:::figure id="([^"]+)" source="([^"]+)" app_asset="([^"]+)"/)
      if (!directive) throw new Error(`Malformed figure directive in ${meta.code}: ${line}`)
      const [, figureId, , appAsset] = directive
      const captionLines: string[] = []
      while (index + 1 < bodyLines.length && bodyLines[index + 1].trim() !== ':::') {
        index += 1
        captionLines.push(bodyLines[index].trim())
      }
      if (index + 1 < bodyLines.length) index += 1

      const caption = neutralFigureText[figureId] ?? stripMarkdown(captionLines.join(' '))
      figures.push({
        id: figureId,
        src: appAsset.replace(/^public/, ''),
        alt: `${caption.replace(/^図\d+\s*/, '')}を示す学習図`,
        caption,
        overlays: [],
      })
      figureIndex += 1
      blocks.push({ id: `figure-block-${figureIndex}`, type: 'figure', figureId })
      continue
    }

    if (line.startsWith(':::callout')) {
      flushParagraph()
      const noteLines: string[] = []
      while (index + 1 < bodyLines.length && bodyLines[index + 1].trim() !== ':::') {
        index += 1
        noteLines.push(bodyLines[index].trim())
      }
      if (index + 1 < bodyLines.length) index += 1
      noteIndex += 1
      blocks.push({ id: `note-${noteIndex}`, type: 'note', text: stripMarkdown(noteLines.join(' ')) })
      continue
    }

    if (line.startsWith('# ')) continue
    paragraphLines.push(line)
  }
  flushParagraph()

  const referencedItems = new Set(
    blocks.flatMap((block) =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    ),
  )
  const missingReferences = items.filter((item) => !referencedItems.has(item.id))
  if (missingReferences.length) {
    throw new Error(`Unreferenced v2.2 items in ${meta.code}: ${missingReferences.map((item) => item.label).join(', ')}`)
  }

  return {
    schemaVersion: '1.1' as const,
    unitId: meta.unitId,
    revision: meta.revision,
    status: 'published' as const,
    subject: 'physics' as const,
    chapter: {
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: meta.code,
      orderInChapter: meta.order,
      sourcePages: meta.pages,
    },
    title: meta.title,
    subtitle: '文章・図・式を一つの流れで学ぶ教科書モード v2.2',
    source: {
      type: 'reference' as const,
      label: 'Chapter 1 learning text v2.2 formula-hole enhanced',
      rightsNote: '原教科書・canonical figures・user-reviewed v2.2 learning textをApp用に構造化',
    },
    objectives: knownObjectives[meta.code],
    sections: [{
      id: 'lesson',
      number: '01',
      title: '本文',
      role: 'concept' as const,
      description: '文章を読みながら、重要な意味・関係・式変形だけを選択して完成させる。',
      figures,
      readingFlow: blocks,
      items,
    }],
  }
}

const rawChapter1V22Units = unitMeta.map((meta, index) => parseUnit(meta, unitMeta[index + 1]?.code))

export const textbookChapter1V22Units = validateTextbookUnits(rawChapter1V22Units)