import type { TextbookItem, TextbookReadingBlock } from '../../../../domain/textbookSchema'
import { T, M, C, reviewItem } from './reviewLessonHelpers'

/**
 * W-MATH-003/P-003-R1: each original Word marker is one authored reasoning node.
 * N04-Q01 keeps its previously approved four local products plus source result.
 * This helper arranges human-written questions, explanations and answer-gated images;
 * it does NOT calculate answers or synthesize distractors.
 */
export type GuidedStep = {
  q: number
  lead: string
  expr?: string
  exprLines?: string[]
  stem?: string
  prompt: string
  answer: string
  wrong: [string, string, string]
  hint: string
  after: string
  kind?: 'text' | 'formula'
}

export type GuidedGroup = {
  title: string
  intro: string
  marker?: 'example' | 'check' | 'proof'
  steps: GuidedStep[]
}

export type FigurePlacement = { id: string; q: number; when: 'before' | 'after' }

export function makeReviewSteps(
  prefix: string,
  groups: GuidedGroup[],
  figures: FigurePlacement[] = [],
): { readingFlow: TextbookReadingBlock[]; items: TextbookItem[] } {
  const readingFlow: TextbookReadingBlock[] = []
  const items: TextbookItem[] = []
  const total = groups.reduce((sum, group) => sum + group.steps.length, 0)
  let ordinal = 0
  const seen = new Set<number>()
  for (const [groupIndex, group] of groups.entries()) {
    readingFlow.push({
      id: prefix + '-heading-' + (groupIndex + 1),
      type: 'heading', text: group.title,
    })
    readingFlow.push({
      id: prefix + '-marker-' + (groupIndex + 1),
      type: 'marker', kind: group.marker ?? (groupIndex === 0 ? 'example' : 'check'),
      text: group.marker === 'proof' ? '導出' : groupIndex === 0 ? '例題' : '確認',
    })
    readingFlow.push({
      id: prefix + '-group-' + (groupIndex + 1),
      type: 'paragraph', parts: [T(group.intro)],
    })
    for (const step of group.steps) {
      if (seen.has(step.q)) throw new Error(prefix + ': duplicated original marker Q' + step.q)
      seen.add(step.q)
      const q = String(step.q).padStart(2, '0')
      const id = prefix + '-' + q
      for (const f of figures.filter(f => f.q === step.q && f.when === 'before'))
        readingFlow.push({ id: prefix + '-show-' + f.id, type: 'figure', figureId: f.id })
      readingFlow.push({
        id: prefix + '-lead-' + q, type: 'paragraph',
        parts: step.expr ? [T(step.lead), M(step.expr)] : [T(step.lead)],
      })
      for (const [lineIndex, latex] of (step.exprLines ?? []).entries()) {
        readingFlow.push({ id: prefix + '-source-' + q + '-' + (lineIndex + 1), type: 'formula', parts: [M(latex)] })
      }
      readingFlow.push({
        id: prefix + '-formula-' + q,
        type: step.kind === 'text' ? 'paragraph' : 'formula',
        parts: step.kind === 'text' ? [T('考えて選ぶ：'), C(id)] : [M(step.stem ?? '\\text{ここから}\\;'), C(id)],
      })
      readingFlow.push({
        id: prefix + '-after-' + q,
        type: 'paragraph', parts: [T(step.after)],
      })
      for (const f of figures.filter(f => f.q === step.q && f.when === 'after'))
        readingFlow.push({ id: prefix + '-show-' + f.id, type: 'figure', figureId: f.id })
      const level = ordinal < 2 ? 'strong' : ordinal < Math.floor(total * 0.7) ? 'medium' : 'light'
      const purpose = ordinal === 0 ? 'concept-formation' : ordinal < Math.floor(total * 0.7) ? 'causal-reasoning' : 'transfer'
      items.push(reviewItem(id, step.prompt, step.answer, step.kind ?? 'formula', step.wrong, purpose, level, [step.hint]))
      ordinal += 1
    }
  }
  return { readingFlow, items }
}
