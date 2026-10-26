import type { NeutralEnvelopeRun, NeutralFramePlan } from './ConstructionMathRow'
type Token = { type: string; latex?: string; partId?: string; id?: string; interactionRef?: string; numerator?: Token[]; denominator?: Token[] }
type Formula = { left: Token[]; relation: string; relationSlot?: Token; right: Token[] }
/** No grading key is read. The plan contains syntax fragments and an unordered
 * candidate pool for every slot, including future steps. */
export function buildNeutralFramePlan(id: string, formulas: Formula[], candidates: Record<string, string[]>): NeutralFramePlan {
  const run = (tokens: Token[]): NeutralEnvelopeRun => tokens.flatMap<NeutralEnvelopeRun[number]>(token => {
    if (token.type === 'math') return [{ kind: 'math' as const, latex: token.latex || '\\mathstrut' }]
    if (token.type === 'fraction') return [{ kind: 'part' as const, partRef: 'fraction-envelope', candidates: ['\\frac{\\mathstrut}{\\mathstrut}'], minAdvancePx: Math.max(44, 24 * Math.max(token.numerator?.length ?? 1, token.denominator?.length ?? 1)) }]
    const ref = token.partId ?? token.interactionRef ?? token.id ?? 'derived'
    return [{ kind: 'part' as const, partRef: ref, candidates: candidates[ref] ?? ['0', '-\\sqrt5', '\\pi'], minAdvancePx: 44 }]
  })
  return { id, left: formulas.map(f => run(f.left)), relation: formulas.map(f => f.relationSlot ? run([f.relationSlot]) : [{ kind: 'math', latex: f.relation || '=' }]), right: formulas.map(f => run(f.right)) }
}
