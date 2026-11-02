import { emptyNestedLedger, projectNestedLesson, type NestedLedger, type NestedLesson, type NestedNode, type NestedPartRecord } from './nestedLesson'
import { normalizeTextbookAnswer } from './textbook'

/** Deliberate opt-in to seven reviewed local answers, never a generic approved flag. */
export const REVIEWED_N10_MIGRATION = Object.freeze({
  sourceSha256: '819cc0b981419e19381f7c8ab14b1501760a830be0d433ce8f1fe6cb3c619e62',
  designSha256: 'd144b8821a19718b569b808fdcb575b688be431dae79609423645d54da7b6edd',
  analysisSha256: '78c2d505f14e15592e4e4bfb318f8f1fd6d3b6c73a88443ae50bfae56bcedbe0',
})
const REVIEWED_IDS = ['n10-q04-sign', 'n10-q05-denominator', 'n10-q06-sign', 'n10-q10-coefficients', 'n10-q17-nonzero', 'n10-q21-denominator', 'n10-q21-constants'] as const
export type CompiledMigrationBinding = { compiledHash: string; sourceSha256: string; designSha256: string; analysisSha256: string }
export type PendingImportedRecord = { oldId: string; partId: string; nodeId: string; record: NestedPartRecord; isFirstCorrect: boolean }
export type MigrationBlock = { code: string; oldId?: string }
export type NestedMigrationResult = {
  status: 'READY' | 'PARTIAL' | 'BLOCKED' | 'RESET_SUPPRESSED'
  ledger: NestedLedger
  pendingImportedRecords: Record<string, PendingImportedRecord>
  archive: unknown
  blockedReasons: MigrationBlock[]
  receipt: { kind: 'reviewed-n10-migration/1'; compiledHash: string; sourceSha256: string; designSha256: string; analysisSha256: string; activatedPartIds: string[]; resetAt?: number }
}
export type ReviewedNestedMigrationInput = {
  lesson: NestedLesson
  oldProgress: unknown
  oldSourceJson: string
  designJson: string
  analysisJson: string
  compiledBinding: CompiledMigrationBinding
  ledger?: NestedLedger
  /** Persist in the NEW namespace. A reset suppresses all future imports, including reload. */
  resetAt?: number
  now: number
}

type CandidateMap = { oldValue: string; newValue: string; oldIsCorrect: boolean; newIsCorrect: boolean }
type AnalysisMapping = { oldId: string; newPartId: string; oldMeaningHash: string; newMeaningHash: string; candidateMap: CandidateMap[] }
type Analysis = { sourceBinding: { unitId: string; oldRevision: number; newRevision: number; oldSourceSha256: string; newDesignSha256: string }; proposedMappings: AnalysisMapping[]; entries: { oldId: string; classification: string; meaningFingerprints?: { oldDescriptor: unknown; newDescriptor: unknown; oldMeaningHash: string; newMeaningHash: string } }[] }
type SourceItem = { id: string; answer: string; acceptedAnswers: string[]; choices: string[] }
type Source = { unit: { unitId: string; revision: number; sections: { items: SourceItem[] }[] } }
type Design = { units: { unitId: string; fromRevision: number; toRevision: number; nodes: NestedNode[] }[] }
function object(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value) }
function stable(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']'
  if (object(value)) return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stable(value[k])).join(',') + '}'
  return JSON.stringify(value)
}
async function hash(value: string) {
  const bytes = new TextEncoder().encode(value)
  return [...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('')
}
function runtimeNode(n: NestedNode) {
  return {
    nodeId: n.nodeId, resultId: n.resultId, stageId: n.stageId, q: n.q, classification: n.classification,
    leadParts: n.leadParts, assumptions: n.assumptions, assumptionParts: n.assumptionParts, prerequisiteNodeIds: n.prerequisiteNodeIds, requiredResultRefs: n.requiredResultRefs,
    rows: n.rows.map(r => ({ id: r.id, template: r.template, kind: r.kind, partKeys: r.partKeys, requiresCorrectKeys: r.requiresCorrectKeys })),
    parts: n.parts.map(p => ({ id: p.id, key: p.key, role: p.role, kind: p.kind, expected: p.expected, prompt: p.prompt,
      choices: p.choices.map(c => ({ value: c.value, kind: c.kind, latex: c.latex, display: c.display, feedback: c.feedback, misconception: c.misconception })) })),
    partOrder: n.partOrder, terminalRecord: n.terminalRecord,
  }
}
function validLedger(l: NestedLesson, p: NestedLedger) {
  return p.schemaVersion === 'nested-lesson-progress/1' && p.unitId === l.unitId && p.revision === l.toRevision && p.compiledHash === l.compiledHash && object(p.draft) && object(p.records) && object(p.parents) && Array.isArray(p.processedEventIds)
}

/** Pure adapter: no storage writes, no fabricated learner events, no mutation of old archives. */
export async function migrateReviewedNestedProgress(input: ReviewedNestedMigrationInput): Promise<NestedMigrationResult> {
  const { lesson, compiledBinding: binding, now } = input
  const archive: unknown = structuredClone(input.oldProgress)
  const ledger = input.ledger ? structuredClone(input.ledger) : emptyNestedLedger(lesson, now)
  const result: NestedMigrationResult = {
    status: 'BLOCKED', ledger, pendingImportedRecords: {}, archive, blockedReasons: [],
    receipt: { kind: 'reviewed-n10-migration/1', ...binding, activatedPartIds: [] },
  }
  const block = (code: string, oldId?: string) => result.blockedReasons.push({ code, ...(oldId ? { oldId } : {}) })
  if (!Number.isFinite(now) || !validLedger(lesson, ledger)) { block('CURRENT_LEDGER_OR_TIME_INVALID'); return result }
  if (input.resetAt !== undefined) {
    if (!Number.isFinite(input.resetAt) || input.resetAt > now) { block('RESET_MARKER_INVALID'); return result }
    result.status = 'RESET_SUPPRESSED'; result.receipt.resetAt = input.resetAt; return result
  }
  try {
    for (const [key, text] of [['sourceSha256', input.oldSourceJson], ['designSha256', input.designJson], ['analysisSha256', input.analysisJson]] as const) {
      if (binding[key] !== REVIEWED_N10_MIGRATION[key] || await hash(text) !== REVIEWED_N10_MIGRATION[key]) { block('REVIEWED_ARTIFACT_HASH_MISMATCH'); return result }
    }
    if (!binding.compiledHash || binding.compiledHash !== lesson.compiledHash) { block('COMPILED_BINDING_MISMATCH'); return result }
    const source = JSON.parse(input.oldSourceJson) as Source, design = JSON.parse(input.designJson) as Design, analysis = JSON.parse(input.analysisJson) as Analysis
    const unit = design.units.find(u => u.unitId === lesson.unitId), sb = analysis.sourceBinding
    if (!unit || lesson.unitId !== sb.unitId || source.unit.unitId !== lesson.unitId || lesson.fromRevision !== sb.oldRevision || lesson.toRevision !== sb.newRevision || source.unit.revision !== lesson.fromRevision || unit.fromRevision !== lesson.fromRevision || unit.toRevision !== lesson.toRevision || sb.oldSourceSha256 !== binding.sourceSha256 || sb.newDesignSha256 !== binding.designSha256) { block('UNIT_REVISION_SOURCE_BINDING_MISMATCH'); return result }
    if (stable(lesson.nodes.map(runtimeNode)) !== stable(unit.nodes.map(runtimeNode))) { block('RUNTIME_DESIGN_PROJECTION_MISMATCH'); return result }
    const oldItems = source.unit.sections.flatMap(s => s.items)
    if (analysis.proposedMappings.length !== REVIEWED_IDS.length || stable(analysis.proposedMappings.map(m => m.oldId).sort()) !== stable([...REVIEWED_IDS].sort())) { block('MAPPING_ALLOWLIST_MISMATCH'); return result }
    for (const mapping of analysis.proposedMappings) {
      const entry = analysis.entries.find(e => e.oldId === mapping.oldId), fp = entry?.meaningFingerprints
      const node = lesson.nodes.find(n => n.parts.some(p => p.id === mapping.newPartId)), part = node?.parts[0], old = oldItems.find(i => i.id === mapping.oldId)
      if (!old || !node || node.parts.length !== 1 || !part || part.id !== mapping.newPartId || entry?.classification !== 'KEEP_SAME_MEANING_CANDIDATE' || !fp || stable(fp.oldDescriptor) !== stable(fp.newDescriptor) || await hash(stable(fp.oldDescriptor)) !== mapping.oldMeaningHash || await hash(stable(fp.newDescriptor)) !== mapping.newMeaningHash || fp.oldMeaningHash !== mapping.oldMeaningHash || fp.newMeaningHash !== mapping.newMeaningHash || mapping.oldMeaningHash !== mapping.newMeaningHash) { block('MEANING_OR_MAPPING_MISMATCH', mapping.oldId); return result }
      const normalized = old.choices.map(normalizeTextbookAnswer)
      if (new Set(normalized).size !== normalized.length || mapping.candidateMap.length !== old.choices.length || mapping.candidateMap.length !== part.choices.length || new Set(mapping.candidateMap.map(c => c.oldValue)).size !== old.choices.length || new Set(mapping.candidateMap.map(c => c.newValue)).size !== part.choices.length || mapping.candidateMap.some(c => !old.choices.includes(c.oldValue) || !part.choices.some(p => p.value === c.newValue) || c.oldIsCorrect !== [old.answer, ...old.acceptedAnswers].some(v => normalizeTextbookAnswer(v) === normalizeTextbookAnswer(c.oldValue)) || c.newIsCorrect !== (c.newValue === part.expected) || c.oldIsCorrect !== c.newIsCorrect)) { block('CANDIDATE_MAP_MISMATCH', mapping.oldId); return result }
    }
    const oldProgress = input.oldProgress
    if (!object(oldProgress) || oldProgress.unitId !== lesson.unitId || oldProgress.unitRevision !== lesson.fromRevision || !object(oldProgress.answers)) { block('OLD_PROGRESS_BINDING_INVALID'); return result }
    for (const mapping of analysis.proposedMappings) {
      if (!Object.hasOwn(oldProgress.answers, mapping.oldId)) continue
      const record = oldProgress.answers[mapping.oldId]
      const node = lesson.nodes.find(n => n.parts.some(p => p.id === mapping.newPartId))!, part = node.parts[0]
      if (Object.hasOwn(ledger.records, part.id) || Object.hasOwn(ledger.draft, part.id)) continue // Native current work always wins.
      if (!object(record) || record.itemId !== mapping.oldId || typeof record.value !== 'string' || typeof record.firstValue !== 'string' || typeof record.isFirstCorrect !== 'boolean' || typeof record.resolved !== 'boolean' || !Number.isSafeInteger(record.attemptCount) || (record.attemptCount as number) < 1 || typeof record.firstAnsweredAt !== 'number' || !Number.isFinite(record.firstAnsweredAt) || record.firstAnsweredAt < 0 || typeof record.lastAnsweredAt !== 'number' || !Number.isFinite(record.lastAnsweredAt) || record.lastAnsweredAt < 0 || record.firstAnsweredAt > record.lastAnsweredAt) { block('OLD_RECORD_INVALID_OR_FIRST_VALUE_UNKNOWN', mapping.oldId); continue }
      const find = (value: string) => mapping.candidateMap.filter(c => normalizeTextbookAnswer(c.oldValue) === normalizeTextbookAnswer(value))
      const current = find(record.value), first = find(record.firstValue)
      if (current.length !== 1 || first.length !== 1 || record.isFirstCorrect !== first[0].oldIsCorrect || record.resolved !== current[0].oldIsCorrect || record.isFirstCorrect && !record.resolved || record.attemptCount === 1 && current[0].oldValue !== first[0].oldValue) { block('OLD_RECORD_VALUE_OR_GRADING_CONTRADICTION', mapping.oldId); continue }
      result.pendingImportedRecords[part.id] = { oldId: mapping.oldId, partId: part.id, nodeId: node.nodeId, isFirstCorrect: record.isFirstCorrect, record: { value: current[0].newValue, firstValue: first[0].newValue, selectionCount: record.attemptCount as number, firstSelectedAt: record.firstAnsweredAt, lastSelectedAt: record.lastAnsweredAt } }
    }
    // Import only at an actually reachable current part. Missing prerequisites never become answers.
    for (let i = 0; i < REVIEWED_IDS.length; i++) {
      const current = projectNestedLesson(lesson, ledger).editable
      if (!current) break
      const pending = result.pendingImportedRecords[current.partId]
      if (!pending) break
      const rec = pending.record
      ledger.draft[pending.partId] = rec.value; ledger.records[pending.partId] = { ...rec }
      ledger.parents[pending.nodeId] = { attemptCount: rec.selectionCount, isFirstCorrect: pending.isFirstCorrect, firstSubmittedValues: { [pending.partId]: rec.firstValue }, firstSubmittedAt: rec.firstSelectedAt, lastSubmittedAt: rec.lastSelectedAt }
      result.receipt.activatedPartIds.push(pending.partId); delete result.pendingImportedRecords[pending.partId]
      // A preserved wrong answer remains editable; later imports stay pending.
    }
    result.status = result.blockedReasons.length ? 'PARTIAL' : 'READY'
    return result
  } catch {
    block('MALFORMED_OR_UNVERIFIABLE_MIGRATION_INPUT'); return result
  }
}

/** UX-03: retain native answers by their full unchanged semantic contract.
 * This never creates answer events or treats old AUTO conclusions as answers.
 * Future retained answers stay in records until their new prerequisites unlock. */
export function migrateNativeRevisionLedger(input: { source: NestedLesson; target: NestedLesson; sourceLedger: NestedLedger; now: number }) {
  const { source, target, sourceLedger, now } = input
  const sources: Record<string, { hash: string; revision: number; targetRevision: number; targetFromRevision?: number; targetHash?: string }[]> = {
    'math-numbers-expressions-n09': [{ hash: '07bd31dc59069536bf59ad4e9339d5f43131bb4adeda76bbd288f54fae08dd7e', revision: 4, targetRevision: 5 }, { hash: '8de81d5c488393ea77e6c877f2986deec901aea90d7e90afa44bb7ba3e2534b6', revision: 5, targetRevision: 6, targetFromRevision: 5, targetHash: '470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d' }, { hash: '470f137102936e6bb73ca3df835e8c9b27d19c5ce53a40879fe9c2dfa8499a3d', revision: 6, targetRevision: 7, targetFromRevision: 6, targetHash: 'dedfd7c553c2c0186bf7bdbc881bba51649741dbe330e0c854c11dce7822a813' }],
    'math-numbers-expressions-n10': [
      { hash: 'a9604f8fdbdc06e117d596e340126ebcfd6298397d4df3e79375eb80075afbbd', revision: 3, targetRevision: 4 },
      { hash: '5f42dba655ce6dad1348dcf6cce705138fc7c266240277ad769d22be82f24f2b', revision: 4, targetRevision: 4 },
    ],
  }
  if (target.unitId !== source.unitId || !sources[source.unitId]?.some(s => s.hash === source.compiledHash && s.revision === source.toRevision && s.targetRevision === target.toRevision && target.fromRevision === (s.targetFromRevision ?? (source.unitId === 'math-numbers-expressions-n09' ? 4 : 3)) && (!s.targetHash || target.compiledHash === s.targetHash)) || !validLedger(source, sourceLedger) || !Number.isFinite(now) || now < sourceLedger.updatedAt) throw Error('UX03_NATIVE_REVISION_BINDING')
  const ledger = emptyNestedLedger(target, now), eligiblePartIds: string[] = []
  // These existing questions keep their mathematical task while UX-03 adds
  // earlier decisions and removes answer-leaking copy. No other prompt or
  // assumptions rewrite is an implicit migration approval.
  const reviewedCopyOnlyParts = new Set([
    'n09-q04-negative::value', 'n09-06::zero', 'n09-07::left', 'n09-07::sign',
    'n10-q07-product::inside', 'n10-07::factor', 'n10-q09-left::coefficient',
    'n10-q09-right::coefficient', 'n10-q20-factor::factor', 'n10-q20-factor::reason', 'n10-20::power',
  ])
  const descriptor = (n: NestedNode, p: NestedNode['parts'][number]) => ({
    nodeId: n.nodeId, resultId: n.resultId, stageId: n.stageId, q: n.q,
    prerequisites: n.prerequisiteNodeIds, results: n.requiredResultRefs,
    ...(!reviewedCopyOnlyParts.has(p.id) ? { assumptions: n.assumptions, prompt: p.prompt } : {}),
    id: p.id, key: p.key, role: p.role, kind: p.kind, expected: p.expected,
    choices: p.choices.map(c => ({ value: c.value, kind: c.kind, display: c.display, latex: c.latex, ...(c.mathLines ? { mathLines: c.mathLines } : {}) })),
  })
  for (const node of target.nodes) {
    const previous = source.nodes.find(n => n.nodeId === node.nodeId)
    if (!previous) continue
    for (const part of node.parts) {
      const oldPart = previous.parts.find(p => p.id === part.id), record = sourceLedger.records[part.id]
      if (!oldPart || !record || stable(descriptor(previous, oldPart)) !== stable(descriptor(node, part))) continue
      if (!part.choices.some(c => c.value === record.value) || !part.choices.some(c => c.value === record.firstValue)) continue
      ledger.records[part.id] = structuredClone(record); eligiblePartIds.push(part.id)
    }
    if (stable(node.parts.map(p => p.id)) === stable(previous.parts.map(p => p.id)) && node.parts.every(p => eligiblePartIds.includes(p.id)) && sourceLedger.parents[node.nodeId]) ledger.parents[node.nodeId] = structuredClone(sourceLedger.parents[node.nodeId])
  }
  ledger.startedAt = Math.min(sourceLedger.startedAt, now)
  // Old event IDs are retained as provenance, not new learner actions.
  ledger.processedEventIds = [...sourceLedger.processedEventIds]
  return { ledger: activateRetainedNativeRecords(target, ledger, eligiblePartIds), eligiblePartIds, sourceCompiledHash: source.compiledHash }
}

export function activateRetainedNativeRecords(lesson: NestedLesson, supplied: NestedLedger, eligiblePartIds: readonly string[]): NestedLedger {
  const ledger = structuredClone(supplied), eligible = new Set(eligiblePartIds)
  for (let limit = 0; limit < eligible.size; limit++) {
    const view = projectNestedLesson(lesson, ledger), id = view.editable?.partId
    if (!id || !eligible.has(id) || ledger.draft[id] !== undefined) break
    const record = ledger.records[id]
    if (!record) break
    ledger.draft[id] = record.value
    const node = lesson.nodes.find(n => n.parts.some(p => p.id === id))!, part = node.parts.find(p => p.id === id)!
    if (!ledger.parents[node.nodeId] && node.parts.every(p => ledger.draft[p.id] !== undefined && ledger.records[p.id])) {
      // Derive the new parent projection from real per-part histories after
      // its added decisions are answered. This is not a new learner event.
      const records = node.parts.map(p => ledger.records[p.id])
      ledger.parents[node.nodeId] = {
        attemptCount: Math.max(...records.map(r => r.selectionCount)),
        isFirstCorrect: node.parts.every(p => ledger.records[p.id].firstValue === p.expected),
        firstSubmittedValues: Object.fromEntries(node.parts.map(p => [p.id, ledger.records[p.id].firstValue])),
        firstSubmittedAt: Math.max(...records.map(r => r.firstSelectedAt)),
        lastSubmittedAt: Math.max(...records.map(r => r.lastSelectedAt)),
      }
    }
    if (record.value !== part.expected) break
  }
  return ledger
}
