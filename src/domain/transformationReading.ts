import { z } from 'zod'
export type TransformationPart = { type: 'math'; latex: string } | { type: 'slot'; id: string; interactionRef: string } | { type: 'fraction'; numerator: TransformationPart[]; denominator: TransformationPart[] }
const part: z.ZodType<TransformationPart> = z.lazy(() => z.discriminatedUnion('type', [
  z.object({ type: z.literal('math'), latex: z.string() }),
  z.object({ type: z.literal('slot'), id: z.string(), interactionRef: z.string() }),
  z.object({ type: z.literal('fraction'), numerator: z.array(part), denominator: z.array(part) }),
]))
const copy = z.discriminatedUnion('type', [z.object({ type: z.literal('math'), latex: z.string() }), z.object({ type: z.literal('text'), text: z.string() }), z.object({ type: z.literal('term'), text: z.string() })])
const formula = z.object({ left: z.array(part), relation: z.string(), relationSlot: part.optional(), right: z.array(part) })
export const TransformationReadingSchema = z.object({
  schemaVersion: z.literal('transformation-reading/1'), unitId: z.string(), presentationVersion: z.number(), baseIRHash: z.string(), planHash: z.string(), gradingHash: z.string(),
  numberAliases: z.record(z.string(), z.string()).optional(),
  scope: z.object({ nodeIds: z.array(z.string()), stageIds: z.array(z.string()) }),
  groups: z.array(z.object({ id: z.string(), kind: z.enum(['relation-sequence', 'expression-chain', 'independent-comparison']), number: z.number(), numberId: z.string(), boundaryNodeIds: z.array(z.string()).optional(), stageIds: z.array(z.string()), sourceNodeIds: z.array(z.string()), rows: z.array(z.object({
    id: z.string(), sourceNodeId: z.string(), stateRef: z.string(), role: z.enum(['main', 'auxiliary']), visibleAfter: z.array(z.string()), interactionRef: z.string().nullable(), before: z.array(copy), after: z.array(copy), afterVisible: z.boolean(), continuation: z.boolean(), completed: formula, masked: formula,
  })) })),
  proseOverrides: z.array(z.object({ nodeId: z.string(), sourceRefs: z.array(z.string()), visibleAfterNodeId: z.string(), after: z.array(copy) })).optional(),
  interactions: z.array(z.object({ id: z.string(), nodeId: z.string(), blankRole: z.string(), learnerDecision: z.string(), prerequisiteInteractionIds: z.array(z.string()), choices: z.array(z.string()), correctValue: z.string() })),
})
export type TransformationReading = z.infer<typeof TransformationReadingSchema>
export type TransformationFormula = z.infer<typeof formula>
export function projectTransformationView(presentation: TransformationReading, solvedIds: string[] = [], view: { boundarySolvedNodeIds?: string[]; stageId?: string; choicesOpen?: string; hint?: { interactionId: string; parts: z.infer<typeof copy>[] } } = {}) {
  const recorded = new Set(solvedIds), solved = new Set<string>(), allowed = new Set(presentation.interactions.map(c => c.id))
  for (const id of recorded) if (!allowed.has(id)) throw Error('UNKNOWN_COMPLETED_INTERACTION')
  // Existing saved answers do not imply that newly added prerequisites are complete.
  for (let pass = 0; pass < presentation.interactions.length; pass++) for (const c of presentation.interactions) if (recorded.has(c.id) && c.prerequisiteInteractionIds.every(id => solved.has(id))) solved.add(c.id)
  const groups = presentation.groups.filter(g => (!view.stageId || g.stageIds.includes(view.stageId)) && (g.boundaryNodeIds ?? []).every(id => view.boundarySolvedNodeIds?.includes(id))).map(g => ({ id: g.id, kind: g.kind, number: g.number, numberId: g.numberId,
    rows: g.rows.filter(r => r.visibleAfter.every(id => solved.has(id))).map(r => {
      const done = !r.interactionRef || solved.has(r.interactionRef), c = presentation.interactions.find(c => c.id === r.interactionRef)
      return { aliasRefs: Object.entries(presentation.numberAliases ?? {}).filter(([, target]) => target === r.id).map(([id]) => id), id: r.id, sourceNodeId: r.sourceNodeId, stateRef: r.stateRef, role: r.role, continuation: r.continuation, done, before: r.before, after: done && r.afterVisible ? r.after : [], formula: done ? r.completed : r.masked,
        current: !done && c ? { id: c.id, learnerDecision: c.learnerDecision, blankRole: c.blankRole, ...(view.choicesOpen === c.id ? { choices: c.choices } : {}), ...(view.hint?.interactionId === c.id ? { hint: view.hint.parts } : {}) } : null }
    }),
  })).filter(g => g.rows.length)
  return { schemaVersion: 'transformation-visible/1', unitId: presentation.unitId, presentationVersion: presentation.presentationVersion, planHash: presentation.planHash, groups }
}
export type VisibleTransformationGroup = ReturnType<typeof projectTransformationView>['groups'][number]
