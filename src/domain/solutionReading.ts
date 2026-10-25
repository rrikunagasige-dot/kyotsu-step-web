import { z } from 'zod'

const id = z.string().min(1)
const part = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), id, text: z.string() }),
  z.object({ type: z.literal('math'), id, latex: z.string() }),
  z.object({ type: z.literal('term'), id, text: z.string(), usage: z.enum(['first_definition', 'recall', 'ordinary']) }),
  z.object({ type: z.literal('slot'), id, interactionId: id, label: z.string() }),
])
export const SolutionReadingSchema = z.object({
  schemaVersion: z.literal('solution-reading/1'), unitId: id, sourceHash: id, irHash: id,
  problems: z.array(z.object({
    id, title: z.string(), prompt: z.array(part), conditions: z.array(part), goal: z.string(),
    layout: z.enum(['concept', 'derivation', 'calculation', 'cases', 'word-problem']),
    initial: z.object({ id, latex: z.string() }),
    plot: z.object({ id, visibleAfterStateId: id, alt: z.string(), points: z.array(z.tuple([z.number(), z.number()])), domainPoints: z.array(z.tuple([z.number(), z.number()])), vertex: z.tuple([z.number(), z.number()]), lowerOpen: z.boolean(), upperOpen: z.boolean(), sourceFunctionHash: id }).optional(),
    steps: z.array(z.object({
      id, beforeId: id, afterId: id, purpose: z.array(part), reason: z.array(part), afterText: z.array(part),
      promptParts: z.array(part), detail: z.array(part),
      formula: z.object({ id, number: z.number().int().positive(), masked: z.string(), completed: z.string() }),
      binding: z.object({ interactionId: id, slotIds: z.array(id) }).nullable(),
      interaction: z.object({
        id, action: z.string(), correctValue: z.string(), hints: z.array(z.array(part)),
        choices: z.array(z.object({ id, value: z.string(), isMath: z.boolean(), rows: z.array(z.object({ id, latex: z.string() })), feedback: z.array(part) })),
        support: z.object({ level: z.enum(['strong', 'medium', 'light']), nextProblemAction: z.string() }),
      }).nullable(),
    })).min(1),
  })).min(1),
})
export type SolutionReading = z.infer<typeof SolutionReadingSchema>
export type SolutionPart = z.infer<typeof part>
export type SolutionAnswer = { value: string; resolved: boolean }

/** First answers belong to the existing textbook store, not to display slot instances. */
export function solutionFrontier(problem: SolutionReading['problems'][number], answers: Record<string, SolutionAnswer>) {
  const index = problem.steps.findIndex(step => step.interaction && !answers[step.interaction.id]?.resolved)
  return index < 0 ? problem.steps.length : index
}
