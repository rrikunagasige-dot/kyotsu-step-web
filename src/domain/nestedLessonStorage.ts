import type { NestedLesson } from './nestedLesson'
import type { NestedMigrationResult } from './nestedMigration'
import type { NestedLedger } from './nestedLesson'
export type SavedNestedLesson = { schemaVersion: 'nested-reader-storage/1'; ledger: NestedLedger; nativeRevisionImport?: { sourceCompiledHash: string; eligiblePartIds: string[] };  archive?: unknown; resetAt?: number; pendingImportedRecords?: NestedMigrationResult['pendingImportedRecords']; migrationReceipt?: NestedMigrationResult['receipt']; migrationStatus?: NestedMigrationResult['status']; migrationBlockedReasons?: NestedMigrationResult['blockedReasons'] }
function object(v: unknown): v is Record<string, unknown> { return !!v && typeof v === 'object' && !Array.isArray(v) }
const time = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0
const count = (v: unknown) => typeof v === 'number' && Number.isSafeInteger(v) && v >= 1
/** Fail closed on corrupt storage; never delete or repair the raw value. */
export function parseSavedNestedLesson(raw: string, lesson: NestedLesson): SavedNestedLesson {
  const s: unknown = JSON.parse(raw)
  if (!object(s) || s.schemaVersion !== 'nested-reader-storage/1' || !object(s.ledger)) throw Error('NESTED_STORAGE_SHAPE')
  const l = s.ledger
  if (l.schemaVersion !== 'nested-lesson-progress/1' || l.unitId !== lesson.unitId || l.revision !== lesson.toRevision || l.compiledHash !== lesson.compiledHash || !object(l.draft) || !object(l.records) || !object(l.parents) || !Array.isArray(l.processedEventIds) || l.processedEventIds.some(e => typeof e !== 'string' || !e) || new Set(l.processedEventIds).size !== l.processedEventIds.length || !time(l.startedAt) || !time(l.updatedAt) || l.updatedAt < l.startedAt || s.resetAt !== undefined && (!time(s.resetAt) || s.resetAt > l.updatedAt)) throw Error('NESTED_STORAGE_BINDING')
  const parts = new Map(lesson.nodes.flatMap(n => n.parts.map(p => [p.id, p] as const)))
  const validValue = (id: string, value: unknown) => typeof value === 'string' && parts.get(id)?.choices.some(c => c.value === value)
  for (const [id, r] of Object.entries(l.records)) if (!object(r) || !validValue(id, r.value) || !validValue(id, r.firstValue) || !count(r.selectionCount) || !time(r.firstSelectedAt) || !time(r.lastSelectedAt) || r.lastSelectedAt < r.firstSelectedAt || r.selectionCount === 1 && r.value !== r.firstValue) throw Error('NESTED_STORAGE_RECORD')
  for (const [id, value] of Object.entries(l.draft)) if (!validValue(id, value) || !object(l.records[id]) || l.records[id].value !== value) throw Error('NESTED_STORAGE_DRAFT')
  for (const [id, r] of Object.entries(l.parents)) {
    const node = lesson.nodes.find(n => n.nodeId === id)
    if (!node || !node.parts.length || !object(r) || !count(r.attemptCount) || typeof r.isFirstCorrect !== 'boolean' || !object(r.firstSubmittedValues) || !time(r.firstSubmittedAt) || !time(r.lastSubmittedAt) || r.lastSubmittedAt < r.firstSubmittedAt || Object.keys(r.firstSubmittedValues).length !== node.parts.length || node.parts.some(p => !validValue(p.id, (r.firstSubmittedValues as Record<string, unknown>)[p.id]))) throw Error('NESTED_STORAGE_PARENT')
    if (r.isFirstCorrect !== node.parts.every(p => (r.firstSubmittedValues as Record<string, unknown>)[p.id] === p.expected)) throw Error('NESTED_STORAGE_FIRST_PARENT')
  }
  if (s.nativeRevisionImport !== undefined && (!object(s.nativeRevisionImport) || typeof s.nativeRevisionImport.sourceCompiledHash !== 'string' || !Array.isArray(s.nativeRevisionImport.eligiblePartIds) || s.nativeRevisionImport.eligiblePartIds.some(id => typeof id !== 'string' || !parts.has(id)) || new Set(s.nativeRevisionImport.eligiblePartIds).size !== s.nativeRevisionImport.eligiblePartIds.length)) throw Error('NESTED_STORAGE_NATIVE_IMPORT')
  return s as SavedNestedLesson
}
