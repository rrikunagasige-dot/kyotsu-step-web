import { z } from 'zod'

export type ConstructionExpression = { kind: 'rational'; n: string; d: string } | { kind: 'symbol'; name: string } | { kind: 'constant'; name: 'pi' } | { kind: 'sqrt' | 'absolute'; argument: ConstructionExpression } | { kind: 'add' | 'multiply'; args: ConstructionExpression[] } | { kind: 'power'; base: ConstructionExpression; exponent: number } | { kind: 'divide'; numerator: ConstructionExpression; denominator: ConstructionExpression } | { kind: 'part'; partId: string } | { kind: 'unary'; sign: { partId: string }; argument: ConstructionExpression } | { kind: 'binary'; operation: '+' | '-' | { partId: string }; left: ConstructionExpression; right: ConstructionExpression } | { kind: 'remaining-term'; id: string; fromPartId: string; terms: ConstructionChoice[] }
export type ConstructionChoice = { value: string; expression?: ConstructionExpression }
const id = z.string().min(1)
export const ConstructionExpressionSchema: z.ZodType<ConstructionExpression> = z.lazy(() => z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('rational'), n: z.string().regex(/^-?\d+$/), d: z.string().regex(/^\d+$/).refine(d => BigInt(d) > 0n) }),
  z.object({ kind: z.literal('symbol'), name: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/) }),
  z.object({ kind: z.literal('constant'), name: z.literal('pi') }),
  z.object({ kind: z.literal('sqrt'), argument: ConstructionExpressionSchema }), z.object({ kind: z.literal('absolute'), argument: ConstructionExpressionSchema }),
  z.object({ kind: z.literal('add'), args: z.array(ConstructionExpressionSchema).min(2) }), z.object({ kind: z.literal('multiply'), args: z.array(ConstructionExpressionSchema).min(2) }),
  z.object({ kind: z.literal('power'), base: ConstructionExpressionSchema, exponent: z.number().int().min(0).max(4) }),
  z.object({ kind: z.literal('divide'), numerator: ConstructionExpressionSchema, denominator: ConstructionExpressionSchema }),
  z.object({ kind: z.literal('part'), partId: id }),
  z.object({ kind: z.literal('unary'), sign: z.object({ partId: id }), argument: ConstructionExpressionSchema }),
  z.object({ kind: z.literal('binary'), operation: z.union([z.enum(['+', '-']), z.object({ partId: id })]), left: ConstructionExpressionSchema, right: ConstructionExpressionSchema }),
  z.object({ kind: z.literal('remaining-term'), id, fromPartId: id, terms: z.array(z.object({ value: id, expression: ConstructionExpressionSchema.optional() })).length(2) }),
]))
export const ConstructionPartSchema = z.object({ id, role: z.enum(['coordinate', 'operand', 'rational', 'coefficient', 'unary-sign', 'binary-operation', 'signed-term']), expected: id, choices: z.array(z.object({ value: id, expression: ConstructionExpressionSchema.optional() })).min(2) })
const statement = z.discriminatedUnion('kind', [z.object({ kind: z.literal('expression'), expression: ConstructionExpressionSchema }), z.object({ kind: z.literal('relation'), operator: z.enum(['=', '<', '<=', '>', '>=']), left: ConstructionExpressionSchema, right: ConstructionExpressionSchema })])
export const ConstructionInteractionSchema = z.object({ id, sourceNodeId: id, sourceRefs: z.array(id), prerequisiteInteractionIds: z.array(id), learnerDecision: id, nextUseRef: id, activePrompt: id, parts: z.array(ConstructionPartSchema).min(1), assembly: statement, expectedStatement: statement, gradingPurpose: z.enum(['mathematical-value', 'specified-order']), sectionId: id.optional() })
export type ConstructionInteraction = z.infer<typeof ConstructionInteractionSchema>
export type ConstructionPart = z.infer<typeof ConstructionPartSchema>
export type ConstructionFormulaPart = { type: 'math'; latex: string } | { type: 'slot'; id: string; partId?: string; interactionRef: string; role?: ConstructionPart['role'] } | { type: 'derived-slot'; id: string; partId: string; interactionRef: string; fromPartId: string; gradedIndependently: false } | { type: 'fraction'; numerator: ConstructionFormulaPart[]; denominator: ConstructionFormulaPart[] }
export type ConstructionFormula = { left: ConstructionFormulaPart[]; relation: string; relationSlot?: ConstructionFormulaPart; right: ConstructionFormulaPart[] }
export type ConstructionCopy = { type: 'text' | 'term'; text: string } | { type: 'math'; latex: string }
export type ConstructionLayoutProse = { id: string; role: 'group-lead' | 'essential-note' | 'active-prompt' | 'detail' | 'interpretation'; content: ConstructionCopy[]; placement: string; rowRef?: string; interactionRef?: string; visibleAfter: string[] }
export type ConstructionPresentation = { groups: { id: string; kind: string; number: number; numberId: string; stageIds: string[]; sourceNodeIds: string[]; boundaryNodeIds?: string[]; rows: { id: string; sourceNodeId: string; stateRef: string; role: string; continuation: boolean; visibleAfter: string[]; interactionRef: string | null; constructionRef?: string; mergedRootLeft?: ConstructionFormulaPart[]; completed: ConstructionFormula; masked: ConstructionFormula }[] }[]; interactions: { id: string; nodeId: string; blankRole: string; learnerDecision: string; prerequisiteInteractionIds: string[]; choices?: string[] }[]; constructionPlan: { interactions: ConstructionInteraction[] }; layoutPlan: { tokens: Record<string, number>; groups: { id: string; rowIds: string[]; numberRowRef: string; numberCollision: string; prose: ConstructionLayoutProse[] }[] } }

function selected(i: ConstructionInteraction, draft: Record<string, string>, partId: string) { return i.parts.find(p => p.id === partId)?.choices.find(c => c.value === draft[partId]) }
function resolve(i: ConstructionInteraction, n: ConstructionExpression, draft: Record<string, string>): ConstructionExpression {
  if (n.kind === 'part') { const c = selected(i, draft, n.partId); if (!c?.expression) throw Error('INCOMPLETE_PART'); return c.expression }
  if (n.kind === 'unary') { const c = selected(i, draft, n.sign.partId); if (!c) throw Error('INCOMPLETE_PART'); const a = resolve(i, n.argument, draft); return c.value === '-' ? { kind: 'multiply', args: [{ kind: 'rational', n: '-1', d: '1' }, a] } : a }
  if (n.kind === 'binary') { const op = typeof n.operation === 'string' ? n.operation : selected(i, draft, n.operation.partId)?.value; if (!op) throw Error('INCOMPLETE_PART'); const a = resolve(i, n.left, draft), b = resolve(i, n.right, draft); return { kind: 'add', args: [a, op === '-' ? { kind: 'multiply', args: [{ kind: 'rational', n: '-1', d: '1' }, b] } : b] } }
  if (n.kind === 'remaining-term') { if (!n.terms.some(c => c.value === draft[n.fromPartId])) throw Error('INCOMPLETE_PART'); const c = n.terms.find(c => c.value !== draft[n.fromPartId]); if (!c?.expression) throw Error('INVALID_TERM_POOL'); return c.expression }
  if (n.kind === 'add' || n.kind === 'multiply') return { ...n, args: n.args.map(a => resolve(i, a, draft)) }
  if (n.kind === 'sqrt' || n.kind === 'absolute') return { ...n, argument: resolve(i, n.argument, draft) }
  if (n.kind === 'power') return { ...n, base: resolve(i, n.base, draft) }
  if (n.kind === 'divide') return { ...n, numerator: resolve(i, n.numerator, draft), denominator: resolve(i, n.denominator, draft) }
  return n
}
export function constructionExpressionLatex(n: ConstructionExpression): string {
  if (n.kind === 'rational') return n.d === '1' ? n.n : `\\frac{${n.n}}{${n.d}}`
  if (n.kind === 'symbol') return n.name.includes('_') ? n.name.replace('_', '_{') + '}' : n.name
  if (n.kind === 'constant') return '\\pi'
  if (n.kind === 'sqrt') return `\\sqrt{${constructionExpressionLatex(n.argument)}}`
  if (n.kind === 'absolute') return `\\left|${constructionExpressionLatex(n.argument)}\\right|`
  if (n.kind === 'add') return n.args.map(constructionExpressionLatex).join('+').replace(/\+-/g, '-')
  if (n.kind === 'multiply') { const negative = (a: ConstructionExpression) => a.kind === 'rational' && a.n.startsWith('-') || a.kind === 'multiply' && a.args[0]?.kind === 'rational' && a.args[0].n.startsWith('-'); const factor = (a: ConstructionExpression) => a.kind === 'add' || negative(a) ? `(${constructionExpressionLatex(a)})` : constructionExpressionLatex(a); if (n.args.length === 2 && n.args[0].kind === 'rational' && n.args[0].n === '-1' && n.args[0].d === '1') return '-' + factor(n.args[1]); return n.args.map((a, index) => (index && a.kind !== 'symbol' && !negative(a) ? '\\cdot ' : '') + factor(a)).join('') }
  if (n.kind === 'power') return `${n.base.kind === 'symbol' ? constructionExpressionLatex(n.base) : `\\left(${constructionExpressionLatex(n.base)}\\right)`}^{${n.exponent}}`
  if (n.kind === 'divide') return `\\frac{${constructionExpressionLatex(n.numerator)}}{${constructionExpressionLatex(n.denominator)}}`
  throw Error('UNRESOLVED_CONSTRUCTION')
}
function tokens(i: ConstructionInteraction, n: ConstructionExpression, draft: Record<string, string>, editableParts = false): ConstructionFormulaPart[] {
  const math = (latex: string): ConstructionFormulaPart => ({ type: 'math', latex })
  const dynamic = (v: unknown): boolean => Boolean(v && typeof v === 'object' && ('kind' in v && (v.kind === 'part' || v.kind === 'unary' || v.kind === 'binary' && 'operation' in v && typeof v.operation !== 'string') || Object.values(v).some(x => x && typeof x === 'object' && (Array.isArray(x) ? x.some(dynamic) : dynamic(x)))))
  try { if (!editableParts || !dynamic(n)) return [math(constructionExpressionLatex(resolve(i, n, draft)))] } catch { /* Render only the unresolved typed subtree. */ }
  const slot = (partId: string): ConstructionFormulaPart => { const p = i.parts.find(p => p.id === partId); if (!p) throw Error('UNKNOWN_PART'); return { type: 'slot', id: partId, partId, interactionRef: i.id, role: p.role } }
  if (n.kind === 'part') return [slot(n.partId)]
  if (n.kind === 'unary') { const c = selected(i, draft, n.sign.partId), wrap = ['add', 'binary', 'unary'].includes(n.argument.kind); return [...(c && !editableParts ? [math(c.value)] : [slot(n.sign.partId)]), ...(wrap ? [math('(')] : []), ...tokens(i, n.argument, draft, editableParts), ...(wrap ? [math(')')] : [])] }
  if (n.kind === 'binary') { const op = typeof n.operation === 'string' ? n.operation : editableParts ? undefined : selected(i, draft, n.operation.partId)?.value; let right: ConstructionExpression | undefined; try { right = resolve(i, n.right, draft) } catch { /* pending */ } const negative = right?.kind === 'rational' && right.n.startsWith('-') || right?.kind === 'multiply' && right.args[0]?.kind === 'rational' && right.args[0].n.startsWith('-'); const b = tokens(i, n.right, draft, editableParts); return [...tokens(i, n.left, draft, editableParts), ...(op ? op === '+' && negative ? [] : [math(op)] : [slot((n.operation as { partId: string }).partId)]), ...(op === '-' && negative ? [math('('), ...b, math(')')] : b)] }
  if (n.kind === 'remaining-term') { const chosen = draft[n.fromPartId], c = n.terms.some(c => c.value === chosen) ? n.terms.find(c => c.value !== chosen) : null; return c?.expression ? [math(constructionExpressionLatex(c.expression))] : [{ type: 'derived-slot', id: n.id, partId: n.id, interactionRef: i.id, fromPartId: n.fromPartId, gradedIndependently: false }] }
  if (n.kind === 'absolute') return [math('|'), ...tokens(i, n.argument, draft, editableParts), math('|')]
  if (n.kind === 'add' || n.kind === 'multiply') return n.args.flatMap((a, index) => [...(index ? [math(n.kind === 'add' ? '+' : '\\cdot ')] : []), ...tokens(i, a, draft, editableParts)])
  if (n.kind === 'power') return [...tokens(i, n.base, draft, editableParts), math(`^{${n.exponent}}`)]
  if (n.kind === 'divide') return [{ type: 'fraction', numerator: tokens(i, n.numerator, draft, editableParts), denominator: tokens(i, n.denominator, draft, editableParts) }]
  return [math(constructionExpressionLatex(n))]
}
export function projectConstructionInteraction(i: ConstructionInteraction, draft: Record<string, string> = {}, view: { solved?: boolean; editableParts?: boolean } = {}) {
  if (Object.entries(draft).some(([id, value]) => !selected(i, { [id]: value }, id))) throw Error('UNKNOWN_PART_OR_CHOICE')
  const values = view.solved ? Object.fromEntries(i.parts.map(p => [p.id, p.expected])) : draft, s = i.assembly, editable = view.editableParts === true && !view.solved
  const formula: ConstructionFormula = s.kind === 'expression' ? { left: [], relation: '', right: tokens(i, s.expression, values, editable) } : { left: tokens(i, s.left, values, editable), relation: ({ '<=': '\\le', '>=': '\\ge' } as Record<string, string>)[s.operator] ?? s.operator, right: tokens(i, s.right, values, editable) }
  return { id: i.id, formula, parts: i.parts.map(p => ({ id: p.id, role: p.role, ...(values[p.id] !== undefined ? { value: values[p.id] } : {}) })), activePrompt: view.solved ? '' : i.activePrompt }
}
export function projectConstructionGroup(p: ConstructionPresentation, groupId: string, view: { solvedIds: string[]; drafts?: Record<string, Record<string, string>>; boundarySolvedNodeIds?: string[]; detailOpen?: boolean }) {
  const g = p.groups.find(g => g.id === groupId); if (!g) throw Error('UNKNOWN_GROUP')
  const recorded = new Set(view.solvedIds), solved = new Set<string>()
  for (let pass = 0; pass < p.interactions.length; pass++) for (const i of p.interactions) if (recorded.has(i.id) && i.prerequisiteInteractionIds.every(id => solved.has(id) || recorded.has(id) && !p.interactions.some(i => i.id === id))) solved.add(i.id)
  const shown = (g.boundaryNodeIds ?? []).every(id => view.boundarySolvedNodeIds?.includes(id))
  const rows = (shown ? g.rows : []).filter(r => r.visibleAfter.every(id => solved.has(id))).map(r => { const done = !r.interactionRef || solved.has(r.interactionRef), c = p.constructionPlan.interactions.find(i => i.id === r.constructionRef), i = p.interactions.find(i => i.id === r.interactionRef), v = c ? projectConstructionInteraction(c, view.drafts?.[c.id], { solved: done, editableParts: true }) : null; return { id: r.id, sourceNodeId: r.sourceNodeId, stateRef: r.stateRef, role: r.role, continuation: r.continuation, done, before: [] as ConstructionCopy[], after: [] as ConstructionCopy[], formula: v ? { ...v.formula, left: r.mergedRootLeft ?? v.formula.left, relation: r.completed.relation } : done ? r.completed : r.masked, current: !done && i ? { id: i.id, learnerDecision: i.learnerDecision, blankRole: i.blankRole, ...(v ? { parts: v.parts } : { choices: i.choices ?? [] }) } : null } })
  const current = rows.find(r => r.current)?.current?.id ?? null, layout = p.layoutPlan.groups.find(l => l.id === g.id); if (!layout) throw Error('UNKNOWN_LAYOUT_GROUP')
  const visible = new Set(rows.map(r => r.id)), prose = layout.prose.filter(s => s.visibleAfter.every(id => solved.has(id)) && (!s.rowRef || visible.has(s.rowRef)) && (s.role !== 'active-prompt' || s.interactionRef === current && !solved.has(s.interactionRef)) && (s.role !== 'interpretation' || layout.rowIds.every(id => visible.has(id)) && !current) && (s.role !== 'detail' || view.detailOpen))
  return { id: g.id, kind: g.kind, number: g.number, numberId: g.numberId, rows, layout: { tokens: p.layoutPlan.tokens, numberRowRef: rows.at(-1)?.id ?? null, completeNumberRowRef: layout.numberRowRef, numberVisible: rows.length > 0, prose, detailAvailable: layout.prose.some(s => s.role === 'detail' && s.visibleAfter.every(id => solved.has(id))) } }
}
