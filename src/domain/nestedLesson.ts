/// <reference types="vite/client" />
/** Opt-in candidate runtime. Old textbook ledgers are never rewritten here. */
export type NestedChoice = { value: string; kind: 'math' | 'text'; latex?: string; display?: string; mathLines?: string[]; feedback: string; misconception: string }
export type NestedCopy = { type: 'text' | 'math' | 'term'; text?: string; latex?: string; semanticRole?: string; usage?: string; emphasis?: string }
export type NestedDisplayExtra = { kind: 'math'; latex: string } | { kind: 'table'; caption: string; headers: string[]; rows: string[][] } | { kind: 'figure'; id: string; src: string; alt: string; caption: string; sha256: string }
export type NestedPart = { id: string; key: string; role: string; kind: 'math' | 'text'; expected: string; prompt: string; choices: NestedChoice[] }
export type NestedRow = { id: string; template: string; kind: 'math' | 'text'; mathGroupId?: string; partKeys: string[]; requiresCorrectKeys: string[]; hideAfterCorrectKeys?: string[] }
export type NestedNode = { nodeId: string; resultId: string; stageId: string; q: number; classification: string; assumptionsDisplay?: 'in-context'; scaffoldLevel?: 'strong' | 'medium' | 'light'; leadParts: NestedCopy[]; assumptions: string[]; assumptionParts?: NestedCopy[][]; equationNumber?: string; numberAliases?: string[]; displayExtras?: NestedDisplayExtra[]; prerequisiteNodeIds: string[]; requiredResultRefs: string[]; rows: NestedRow[]; parts: NestedPart[]; partOrder: string[]; terminalRecord: { formulas: string[]; conditions: string[]; prose: string; proseParts?: NestedCopy[]; conditionParts?: NestedCopy[][]; requiresCorrectKeys: string[] } }
export type NestedLesson = { unitId: string; fromRevision: number; toRevision: number; compiledHash: string; nodes: NestedNode[] }
export type NestedPartRecord = { value: string; firstValue: string; selectionCount: number; firstSelectedAt: number; lastSelectedAt: number }
export type NestedParentRecord = { attemptCount: number; isFirstCorrect?: boolean; firstSubmittedValues?: Record<string, string>; firstSubmittedAt?: number; lastSubmittedAt?: number }
export type NestedLedger = { schemaVersion: 'nested-lesson-progress/1'; unitId: string; revision: number; compiledHash: string; draft: Record<string, string>; records: Record<string, NestedPartRecord>; parents: Record<string, NestedParentRecord>; processedEventIds: string[]; startedAt: number; updatedAt: number }
export type PublicNestedPart = Omit<NestedPart, 'expected' | 'choices'> & { choices: Omit<NestedChoice, 'feedback' | 'misconception'>[]; value?: string; editable: boolean; correct: boolean; visibleFeedback?: string }
export type PublicNestedNode = Pick<NestedNode, 'nodeId' | 'resultId' | 'stageId' | 'q' | 'classification' | 'leadParts' | 'assumptions' | 'assumptionParts' | 'equationNumber' | 'numberAliases'> & { terminalRecord?: NestedNode['terminalRecord']; displayExtras?: NestedDisplayExtra[] }

export function emptyNestedLedger(lesson: NestedLesson, now: number): NestedLedger {
  return { schemaVersion: 'nested-lesson-progress/1', unitId: lesson.unitId, revision: lesson.toRevision, compiledHash: lesson.compiledHash, draft: {}, records: {}, parents: {}, processedEventIds: [], startedAt: now, updatedAt: now }
}
function matches(lesson: NestedLesson, ledger?: NestedLedger): ledger is NestedLedger {
  return !!ledger && ledger.schemaVersion === 'nested-lesson-progress/1' && ledger.unitId === lesson.unitId && ledger.revision === lesson.toRevision && ledger.compiledHash === lesson.compiledHash
}
function correct(node: NestedNode, key: string, ledger?: NestedLedger) {
  const part = node.parts.find(p => p.key === key)
  return !!part && ledger?.draft?.[part.id] === part.expected
}
/** Current drafts are separate from first-answer history; unreachable values do not revive. */
function sanitizedLedger(lesson: NestedLesson, ledger: NestedLedger): NestedLedger {
  const draft: Record<string, string> = {}, done = new Set<string>(), results = new Set<string>()
  let stopped = false
  for (const n of lesson.nodes) {
    if (stopped || !n.prerequisiteNodeIds.every(id => done.has(id)) || !n.requiredResultRefs.every(id => results.has(id))) { stopped = true; continue }
    let complete = true
    for (const key of n.partOrder) {
      const p = n.parts.find(p => p.key === key)!, value = ledger.draft?.[p.id]
      if (value !== undefined && p.choices.some(c => c.value === value)) draft[p.id] = value
      if (value !== p.expected) { complete = false; break }
    }
    if (complete) { done.add(n.nodeId); results.add(n.resultId) } else stopped = true
  }
  return { ...ledger, draft }
}
function orderedCorrect(node: NestedNode, key: string, ledger?: NestedLedger) {
  const index = node.partOrder.indexOf(key)
  return index >= 0 && node.partOrder.slice(0, index + 1).every(key => correct(node, key, ledger))
}
export function projectNestedLesson(lesson: NestedLesson, supplied?: NestedLedger) {
  const ledger = matches(lesson, supplied) ? sanitizedLedger(lesson, supplied) : undefined
  const certifiedNodes = new Set<string>(), certifiedResults = new Set<string>()
  const visible: { node: PublicNestedNode; rows: NestedRow[]; parts: PublicNestedPart[]; resolved: boolean }[] = []
  let editable: { nodeId: string; partKey: string; partId: string } | null = null
  for (const node of lesson.nodes) {
    if (!node.prerequisiteNodeIds.every(id => certifiedNodes.has(id)) || !node.requiredResultRefs.every(id => certifiedResults.has(id))) break
    const rows = node.rows.filter(r => r.requiresCorrectKeys.every(key => orderedCorrect(node, key, ledger)) && !(r.hideAfterCorrectKeys?.length && r.hideAfterCorrectKeys.every(key => orderedCorrect(node, key, ledger)) && r.partKeys.every(key => orderedCorrect(node, key, ledger))))
    // A completed scaffold can disappear while its certified value is still
    // needed by a mirror in the replacement row. Only visible rows contribute.
    const visibleKeys = new Set(rows.flatMap(r => [...r.partKeys, ...Array.from(r.template.matchAll(/\{mirror:([A-Za-z][A-Za-z0-9_.-]*)\}/g), m => m[1])]))
    const currentKey = node.partOrder.find(key => !orderedCorrect(node, key, ledger))
    if (currentKey && visibleKeys.has(currentKey)) {
      const p = node.parts.find(p => p.key === currentKey)!
      editable = { nodeId: node.nodeId, partKey: p.key, partId: p.id }
    }
    const parts = node.parts.filter(p => visibleKeys.has(p.key)).map(p => {
      const value = ledger?.draft[p.id]
      const chosen = p.choices.find(c => c.value === value)
      // An imported JSON object can carry fields absent from the TypeScript
      // type (mathAssertion/answer labels). Only whitelist learner fields.
      return { id: p.id, key: p.key, role: p.role, kind: p.kind, prompt: p.prompt,
        choices: p.choices.map(c => ({ value: c.value, kind: c.kind, ...(c.latex !== undefined ? { latex: c.latex } : {}), ...(c.display !== undefined ? { display: c.display } : {}), ...(c.mathLines !== undefined ? { mathLines: [...c.mathLines] } : {}) })),
        ...(value !== undefined ? { value } : {}), editable: currentKey === p.key, correct: orderedCorrect(node, p.key, ledger), ...(chosen && value !== p.expected && currentKey === p.key ? { visibleFeedback: chosen.feedback } : {}) }
    })
    const resolved = node.partOrder.every(key => orderedCorrect(node, key, ledger))
    const publicNode: PublicNestedNode = { nodeId: node.nodeId, resultId: node.resultId, stageId: node.stageId, q: node.q, classification: node.classification, leadParts: node.leadParts, assumptions: node.assumptions, assumptionParts: node.assumptionParts, equationNumber: node.equationNumber, numberAliases: node.numberAliases, ...(resolved ? { terminalRecord: node.terminalRecord, displayExtras: node.displayExtras } : {}) }
    visible.push({ node: publicNode, rows, parts, resolved })
    if (!resolved) break
    certifiedNodes.add(node.nodeId); certifiedResults.add(node.resultId)
  }
  return { visible, certifiedNodeIds: [...certifiedNodes], certifiedResultIds: [...certifiedResults], editable, completed: certifiedNodes.size === lesson.nodes.length, staleLedger: !!supplied && !matches(lesson, supplied) }
}
export function answerNestedPart(lesson: NestedLesson, previous: NestedLedger | undefined, partId: string, value: string, eventId: string, now: number): NestedLedger | undefined {
  if (!eventId || !Number.isFinite(now) || previous && !matches(lesson, previous) || previous?.processedEventIds.includes(eventId)) return previous
  const view = projectNestedLesson(lesson, previous)
  if (!view.editable || view.editable.partId !== partId) return previous
  const node = lesson.nodes.find(n => n.nodeId === view.editable!.nodeId)!, part = node.parts.find(p => p.id === partId)!
  if (!part.choices.some(c => c.value === value)) return previous
  const base = previous ? sanitizedLedger(lesson, previous) : emptyNestedLedger(lesson, now), old = base.records[partId]
  const next = sanitizedLedger(lesson, { ...base, draft: { ...base.draft, [partId]: value }, records: { ...base.records, [partId]: { value, firstValue: old?.firstValue ?? value, selectionCount: (old?.selectionCount ?? 0) + 1, firstSelectedAt: old?.firstSelectedAt ?? now, lastSelectedAt: now } }, processedEventIds: [...base.processedEventIds, eventId], updatedAt: now })
  if (node.parts.every(p => next.draft[p.id] !== undefined)) {
    const oldParent = base.parents?.[node.nodeId], right = node.parts.every(p => next.draft[p.id] === p.expected)
    next.parents = { ...base.parents, [node.nodeId]: { attemptCount: (oldParent?.attemptCount ?? 0) + 1, isFirstCorrect: oldParent?.isFirstCorrect ?? right, firstSubmittedValues: oldParent?.firstSubmittedValues ?? Object.fromEntries(node.parts.map(p => [p.id, next.draft[p.id]])), firstSubmittedAt: oldParent?.firstSubmittedAt ?? now, lastSubmittedAt: now } }
  }
  return next
}
export function nestedFirstPassAllCorrect(lesson: NestedLesson, ledger?: NestedLedger) {
  return matches(lesson, ledger) && lesson.nodes.every(n => n.parts.every(p => ledger.records[p.id]?.firstValue === p.expected))
}
export function stableNestedChoices<T>(choices: readonly T[], seed: string): T[] {
  let n = 2166136261
  for (const c of seed) n = Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0
  const out = [...choices]
  for (let i = out.length - 1; i > 0; i--) { n ^= n << 13; n ^= n >>> 17; n ^= n << 5; const j = (n >>> 0) % (i + 1); [out[i], out[j]] = [out[j], out[i]] }
  return out
}
/** Reset-empty is its own current revision; old archives are not a fallback. */
export function resetNestedLedger(lesson: NestedLesson, now: number) { return emptyNestedLedger(lesson, now) }
export function nestedStorageScope(namespace?: string) {
  return (namespace ?? import.meta.env?.VITE_STORAGE_NAMESPACE) || 'kyotsu-step-store'
}
export function nestedStoragePrefix(namespace?: string) { return `math-textbook-nested-v1:@scope:${encodeURIComponent(nestedStorageScope(namespace))}:` }
export function nestedStorageKey(lesson: NestedLesson, namespace?: string) { return `${nestedStoragePrefix(namespace)}${lesson.unitId}:r${lesson.toRevision}:${lesson.compiledHash}` }
/** Only the ordinary environment may read its previous unscoped key. */
export function legacyNestedStorageKey(lesson: NestedLesson, namespace?: string) { return nestedStorageScope(namespace) === 'kyotsu-step-store' ? `math-textbook-nested-v1:${lesson.unitId}:r${lesson.toRevision}:${lesson.compiledHash}` : undefined }
export function isLegacyNestedStorageKey(key: string, namespace?: string) { return nestedStorageScope(namespace) === 'kyotsu-step-store' && /^math-textbook-nested-v1:math-numbers-expressions-n(?:09|10):r\d+:[a-f0-9]{64}$/.test(key) }

export type NestedMigrationMap = { approved: boolean; oldRevision: number; newRevision: number; entries: { oldId: string; newPartId: string; oldMeaningHash: string; newMeaningHash: string }[] }
export function migrateNestedRecords(lesson: NestedLesson, oldRecords: Record<string, NestedPartRecord>, map: NestedMigrationMap | undefined, now: number) {
  if (!map || !map.approved || map.oldRevision !== lesson.fromRevision || map.newRevision !== lesson.toRevision) return { status: 'BLOCKED' as const, reason: 'MEANING_MAPPING_NOT_CONFIRMED', oldRecords }
  const ids = new Set(lesson.nodes.flatMap(n => n.parts.map(p => p.id))), seen = new Set<string>()
  for (const e of map.entries) {
    if (seen.has(e.newPartId) || !ids.has(e.newPartId) || !e.oldMeaningHash || e.oldMeaningHash !== e.newMeaningHash) return { status: 'BLOCKED' as const, reason: 'MEANING_MISMATCH', oldRecords }
    seen.add(e.newPartId)
  }
  // An approved boolean and caller-supplied equal strings are not a reviewed,
  // source/compiled-bound mapping. The unrecovered local7 must not be guessed.
  return { status: 'BLOCKED' as const, reason: 'REVIEWED_SOURCE_BOUND_MAPPING_NOT_IMPLEMENTED', oldRecords, checkedAt: now }
}
