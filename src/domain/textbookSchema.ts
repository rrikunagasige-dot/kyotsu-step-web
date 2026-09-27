import { z } from 'zod'

const IdSchema = z.string().min(2).regex(/^[a-z0-9][a-z0-9-]*$/, 'ID は小文字英数字とハイフンで指定してください')
const PercentSchema = z.number().min(0).max(100)

export const TextbookAnswerTypeSchema = z.enum(['text', 'formula', 'number'])
export const TextbookSectionRoleSchema = z.enum(['concept', 'figure-reading', 'worked-example', 'review'])

export const TextbookItemSchema = z.object({
  id: IdSchema,
  label: z.string().min(1),
  prompt: z.string().min(1),
  answer: z.string().min(1),
  acceptedAnswers: z.array(z.string().min(1)).default([]),
  answerType: TextbookAnswerTypeSchema.default('text'),
  choices: z.array(z.string().min(1)).min(2).optional(),
  unit: z.string().optional(),
})

export const TextbookFigureOverlaySchema = z.object({
  id: IdSchema,
  itemId: IdSchema,
  mode: z.enum(['mask', 'hotspot']).default('mask'),
  x: PercentSchema,
  y: PercentSchema,
  width: z.number().positive().max(100),
  height: z.number().positive().max(100),
  reveal: z.enum(['after-answer', 'always']).default('after-answer'),
  ariaLabel: z.string().min(1).optional(),
})

export const TextbookFigureSchema = z.object({
  id: IdSchema,
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
  overlays: z.array(TextbookFigureOverlaySchema).default([]),
})

export const TextbookReadingPartSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string().min(1) }),
  z.object({ type: z.literal('math'), latex: z.string().min(1) }),
  z.object({ type: z.literal('choice'), itemId: IdSchema }),
])

export const TextbookReadingBlockSchema = z.discriminatedUnion('type', [
  z.object({ id: IdSchema, type: z.literal('heading'), text: z.string().min(1) }),
  z.object({ id: IdSchema, type: z.literal('paragraph'), parts: z.array(TextbookReadingPartSchema).min(1) }),
  z.object({ id: IdSchema, type: z.literal('formula'), parts: z.array(TextbookReadingPartSchema).min(1) }),
  z.object({ id: IdSchema, type: z.literal('figure'), figureId: IdSchema }),
  z.object({ id: IdSchema, type: z.literal('note'), text: z.string().min(1) }),
])

export const TextbookSectionSchema = z.object({
  id: IdSchema,
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  role: TextbookSectionRoleSchema.optional(),
  figures: z.array(TextbookFigureSchema).default([]),
  readingFlow: z.array(TextbookReadingBlockSchema).default([]),
  items: z.array(TextbookItemSchema).min(1),
})

export const TextbookChapterMetaSchema = z.object({
  chapterId: IdSchema,
  chapterNumber: z.string().min(1),
  chapterTitle: z.string().min(1),
  unitCode: z.string().regex(/^[0-9]+[A-Z]$/, 'unitCode は 1A のように指定してください'),
  orderInChapter: z.number().int().positive(),
  sourcePages: z.array(z.number().int().positive()).min(1),
})

const TextbookUnitBaseSchema = z.object({
  schemaVersion: z.enum(['1.0', '1.1']),
  unitId: IdSchema,
  revision: z.number().int().positive(),
  status: z.enum(['draft', 'review', 'published']),
  subject: z.literal('physics'),
  chapter: TextbookChapterMetaSchema.optional(),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  source: z.object({
    type: z.enum(['original', 'licensed', 'reference']),
    label: z.string().min(1),
    rightsNote: z.string().optional(),
  }),
  objectives: z.array(z.string().min(1)).min(1),
  sections: z.array(TextbookSectionSchema).min(1),
})

function normalizeChoiceValue(value: string) {
  return value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\s　]/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/[⃗→]/g, '')
}

export const TextbookUnitSchema = TextbookUnitBaseSchema.superRefine((unit, context) => {
  const sectionIds = new Set<string>()
  const itemIds = new Set<string>()
  const overlayIds = new Set<string>()

  if (unit.schemaVersion === '1.1') {
    if (!unit.chapter) {
      context.addIssue({ code: 'custom', path: ['chapter'], message: 'schemaVersion 1.1 には chapter metadata が必要です' })
    } else {
      const pages = unit.chapter.sourcePages
      if (new Set(pages).size !== pages.length || pages.some((page, index) => index > 0 && page <= pages[index - 1])) {
        context.addIssue({ code: 'custom', path: ['chapter', 'sourcePages'], message: 'sourcePages は重複のない昇順で指定してください' })
      }
    }
  }

  for (const [sectionIndex, section] of unit.sections.entries()) {
    if (sectionIds.has(section.id)) context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'id'], message: 'section id が重複しています' })
    sectionIds.add(section.id)

    if (unit.schemaVersion === '1.1' && !section.role) {
      context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'role'], message: 'schemaVersion 1.1 の section には role が必要です' })
    }

    const sectionItemIds = new Set(section.items.map((item) => item.id))
    const figureIds = new Set(section.figures.map((figure) => figure.id))
    const referencedItems = new Set<string>()

    for (const [itemIndex, item] of section.items.entries()) {
      if (itemIds.has(item.id)) context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'items', itemIndex, 'id'], message: 'item id が重複しています' })
      itemIds.add(item.id)

      if (unit.schemaVersion === '1.1' && unit.status === 'published') {
        if (!item.choices?.length) {
          context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'items', itemIndex, 'choices'], message: '公開済み schemaVersion 1.1 item には明示的な choices が必要です' })
        } else {
          const normalizedChoices = item.choices.map(normalizeChoiceValue)
          if (new Set(normalizedChoices).size !== normalizedChoices.length) {
            context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'items', itemIndex, 'choices'], message: 'choices に実質的な重複があります' })
          }
          const answer = normalizeChoiceValue(item.answer)
          if (normalizedChoices.filter((choice) => choice === answer).length !== 1) {
            context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'items', itemIndex, 'choices'], message: '正解 answer は choices に1回だけ含めてください' })
          }
        }
      }
    }

    section.figures.forEach((figure, figureIndex) => {
      figure.overlays.forEach((overlay, overlayIndex) => {
        if (overlayIds.has(overlay.id)) {
          context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'figures', figureIndex, 'overlays', overlayIndex, 'id'], message: `overlay id が重複しています: ${overlay.id}` })
        }
        overlayIds.add(overlay.id)

        if (!sectionItemIds.has(overlay.itemId)) {
          context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'figures', figureIndex, 'overlays', overlayIndex, 'itemId'], message: `存在しない item 参照: ${overlay.itemId}` })
        } else {
          referencedItems.add(overlay.itemId)
        }

        if (overlay.x + overlay.width > 100) {
          context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'figures', figureIndex, 'overlays', overlayIndex, 'width'], message: 'overlay が画像の右端を超えています' })
        }
        if (overlay.y + overlay.height > 100) {
          context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'figures', figureIndex, 'overlays', overlayIndex, 'height'], message: 'overlay が画像の下端を超えています' })
        }
      })
    })

    section.readingFlow.forEach((block, blockIndex) => {
      if (block.type === 'figure' && !figureIds.has(block.figureId)) {
        context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'readingFlow', blockIndex, 'figureId'], message: `存在しない figure 参照: ${block.figureId}` })
      }
      if (block.type === 'paragraph' || block.type === 'formula') {
        block.parts.forEach((part, partIndex) => {
          if (part.type !== 'choice') return
          if (!sectionItemIds.has(part.itemId)) {
            context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'readingFlow', blockIndex, 'parts', partIndex, 'itemId'], message: `存在しない item 参照: ${part.itemId}` })
          } else {
            referencedItems.add(part.itemId)
          }
        })
      }
    })

    if (section.readingFlow.length > 0 || section.figures.some((figure) => figure.overlays.length > 0)) {
      section.items.forEach((item, itemIndex) => {
        if (!referencedItems.has(item.id)) {
          context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'items', itemIndex, 'id'], message: 'readingFlow または figure overlay から参照されていません' })
        }
      })
    }
  }
})

export type TextbookUnit = z.infer<typeof TextbookUnitSchema>
export type TextbookSection = z.infer<typeof TextbookSectionSchema>
export type TextbookItem = z.infer<typeof TextbookItemSchema>
export type TextbookFigure = z.infer<typeof TextbookFigureSchema>
export type TextbookFigureOverlay = z.infer<typeof TextbookFigureOverlaySchema>
export type TextbookReadingPart = z.infer<typeof TextbookReadingPartSchema>
export type TextbookReadingBlock = z.infer<typeof TextbookReadingBlockSchema>

export function validateTextbookUnits(input: unknown): TextbookUnit[] {
  return z.array(TextbookUnitSchema).parse(input)
}
