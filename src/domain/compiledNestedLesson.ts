// @ts-expect-error Node24 imports this same source for snapshots; explicit .ts is required without changing app compiler options.
import { renderClosedMath } from '../components/textbook/nestedMathTemplate.ts'
import type { NestedCopy, NestedLesson, NestedNode } from './nestedLesson'
export type { NestedCopy, NestedDisplayExtra } from './nestedLesson'

export type NestedStage = { id: string; title: string; q: number; sourceQuestionParts: NestedCopy[] }
export type NestedLayoutPlan = { schemaVersion: 'layout-plan/2'; nestedGeometryContract: 'nested-geometry/1'; unitId: string; tokens: { mathFontPx: number; katexScale: number; minHitPx: number; rowGapPx: number; noteGapPx: number; paragraphGapPx: number }; groups: { id: string; sourceNodeIds: string[]; rowIds: string[]; mathRowIds: string[]; number: string | null; numberRowRef: string | null }[] }
export type CompiledNestedLesson = {
  schemaVersion: 'transformation-reading/3'
  nestedPipeline: 'n0910/1'
  unitId: string
  fromRevision: number
  toRevision: number
  title: string
  stages: NestedStage[]
  nodeDesign: NestedNode[]
  constructionPlan: { schemaVersion: 'nested-construction-plan/1'; nodes: Pick<NestedNode, 'nodeId' | 'rows' | 'parts' | 'partOrder'>[] }
  layoutPlan: NestedLayoutPlan
  nestedDisplay: { schemaVersion: 'nested-display/1'; breakPolicy: 'root-relation-or-operation'; unitId: string; rowTemplates: { nodeId: string; rows: { id: string; template: string; kind: string }[] }[] }
  sourceBinding: { repository: string; sourceBase: string; sourceSha256: string; designSha256: string }
  irHash: string
  sourceIRHash: string
  planHash: string
  learnerCopyHash: string
  constructionDesignHash: string
  layoutDesignHash: string
  compiledHash: string
  automaticAcceptance: false
}
export type NestedArtifactPin = Pick<CompiledNestedLesson, 'unitId' | 'fromRevision' | 'toRevision' | 'compiledHash' | 'planHash' | 'sourceIRHash'> & { sourceSha256: string; designSha256: string }

/** This checks the actual rows/parts used by the reader, not a separate sidecar. */
export function nestedLessonFromCompiled(compiled: CompiledNestedLesson): NestedLesson {
  if (compiled.schemaVersion !== 'transformation-reading/3' || compiled.nestedPipeline !== 'n0910/1' || compiled.constructionPlan.schemaVersion !== 'nested-construction-plan/1') throw Error('NESTED_COMPILED_SCHEMA')
  const plan = compiled.constructionPlan.nodes
  if (!Array.isArray(plan) || plan.length !== compiled.nodeDesign.length) throw Error('NESTED_COMPILED_COVERAGE')
  const layout = compiled.layoutPlan
  if (layout?.schemaVersion !== 'layout-plan/2' || layout.nestedGeometryContract !== 'nested-geometry/1' || layout.unitId !== compiled.unitId || layout.groups.length !== compiled.nodeDesign.length || JSON.stringify(layout.tokens) !== JSON.stringify({ mathFontPx: 18, katexScale: 1, minHitPx: 44, rowGapPx: 4, noteGapPx: 6, paragraphGapPx: 8 })) throw Error('NESTED_LAYOUT_CONTRACT')
  const nodes = layout.groups.map((group, index) => {
    const node = compiled.nodeDesign[index]
    for (const part of node.parts) for (const choice of part.choices) if (choice.mathLines !== undefined) {
      if (!Array.isArray(choice.mathLines) || !choice.mathLines.length || typeof choice.display !== 'string' || !choice.display.trim() || choice.mathLines.some(line => typeof line !== 'string' || !line.trim())) throw Error('NESTED_CHOICE_MATH_LINES')
      for (const line of choice.mathLines) renderClosedMath(line)
    }
    for (const row of node.rows) if (row.hideAfterCorrectKeys !== undefined && (!Array.isArray(row.hideAfterCorrectKeys) || !row.hideAfterCorrectKeys.length || new Set(row.hideAfterCorrectKeys).size !== row.hideAfterCorrectKeys.length || row.hideAfterCorrectKeys.length !== row.partKeys.length || row.hideAfterCorrectKeys.some(key => !row.partKeys.includes(key)))) throw Error('NESTED_ROW_HIDE_CONTRACT')
    if (group.sourceNodeIds.length !== 1 || group.sourceNodeIds[0] !== node.nodeId || JSON.stringify(group.rowIds) !== JSON.stringify(node.rows.map(r => r.id)) || group.number !== (node.equationNumber ?? null)) throw Error('NESTED_LAYOUT_NODE_BINDING')
    const row = plan[index]
    if (!row || row.nodeId !== node.nodeId || JSON.stringify([row.rows, row.parts, row.partOrder]) !== JSON.stringify([node.rows, node.parts, node.partOrder])) throw Error('NESTED_COMPILED_PLAN_MISMATCH')
    return { ...node, rows: row.rows, parts: row.parts, partOrder: row.partOrder }
  })
  const display = compiled.nestedDisplay
  if (display?.schemaVersion !== 'nested-display/1' || display.unitId !== compiled.unitId || display.breakPolicy !== 'root-relation-or-operation' || JSON.stringify(display.rowTemplates) !== JSON.stringify(nodes.map(n => ({ nodeId: n.nodeId, rows: n.rows.map(({ id, template, kind }) => ({ id, template, kind })) })))) throw Error('NESTED_DISPLAY_BINDING')
  return { unitId: compiled.unitId, fromRevision: compiled.fromRevision, toRevision: compiled.toRevision, compiledHash: compiled.compiledHash, nodes }
}

export async function nestedArtifactHash(value: unknown) {
  const raw = typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n'
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  return [...new Uint8Array(hash)].map(x => x.toString(16).padStart(2, '0')).join('')
}

/** Call before reading IDs, displaying, restoring storage, or accepting answers. */
export async function validateCompiledNestedLesson(compiled: CompiledNestedLesson, pin: NestedArtifactPin) {
  if (!compiled || compiled.automaticAcceptance !== false || compiled.unitId !== pin.unitId || compiled.fromRevision !== pin.fromRevision || compiled.toRevision !== pin.toRevision || compiled.compiledHash !== pin.compiledHash || compiled.planHash !== pin.planHash || compiled.sourceIRHash !== pin.sourceIRHash || compiled.irHash !== compiled.sourceIRHash || !/^[a-f0-9]{64}$/.test(compiled.planHash) || !/^[a-f0-9]{64}$/.test(compiled.sourceIRHash)) throw Error('NESTED_COMPILED_PIN')
  const binding = compiled.sourceBinding
  if (binding?.repository !== 'rrikunagasige-dot/kyotsu-step-web' || binding.sourceBase !== '18839ba97ec73c99f41c8715c3a888524b743358' || binding.sourceSha256 !== pin.sourceSha256 || binding.designSha256 !== pin.designSha256) throw Error('NESTED_COMPILED_SOURCE')
  nestedLessonFromCompiled(compiled)
  const { compiledHash, ...payload } = compiled
  if (await nestedArtifactHash(payload) !== compiledHash || await nestedArtifactHash(compiled.constructionPlan) !== compiled.constructionDesignHash || await nestedArtifactHash(compiled.layoutPlan) !== compiled.layoutDesignHash || await nestedArtifactHash({ stages: compiled.stages, nodes: compiled.nodeDesign }) !== compiled.learnerCopyHash) throw Error('NESTED_COMPILED_HASH')
  return compiled
}
