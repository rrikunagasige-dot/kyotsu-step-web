import type { ConstructionInteraction } from './constructionReading'

export type ConstructionPartRecord = { value: string; firstValue: string; selectionCount: number; firstSelectedAt: number; lastSelectedAt: number }
export type ConstructionParentProgress = { parentId: string; draft: Record<string, string>; partRecords: Record<string, ConstructionPartRecord>; attemptCount: number; resolved: boolean; isFirstCorrect?: boolean; firstSubmittedValues?: Record<string, string>; firstSubmittedAt?: number; lastSubmittedAt?: number; startedAt: number; updatedAt: number; processedEventIds: string[] }
export type ConstructionProgress = Record<string, ConstructionParentProgress>

export function gradeConstructionDraft(i: ConstructionInteraction, draft: Record<string, string>) {
  const invalid = Object.entries(draft).some(([partId, value]) => !i.parts.some(p => p.id === partId && p.choices.some(c => c.value === value)))
  if (invalid) return { complete: false, correct: false, reason: 'UNKNOWN_PART_OR_CHOICE' as const }
  const complete = i.parts.every(p => Object.hasOwn(draft, p.id))
  if (!complete) return { complete: false, correct: false, reason: 'INCOMPLETE' as const }
  const correct = i.parts.every(p => draft[p.id] === p.expected)
  return { complete: true, correct, reason: correct ? null : i.gradingPurpose === 'specified-order' ? 'SPECIFIED_ORDER_MISMATCH' as const : 'MATHEMATICAL_VALUE_MISMATCH' as const }
}
export function isConstructionResolved(i: ConstructionInteraction, record: ConstructionParentProgress | undefined) {
  return Boolean(record?.resolved && record.parentId === i.id && gradeConstructionDraft(i, record.draft).complete && gradeConstructionDraft(i, record.draft).correct)
}
export function selectConstructionPart(i: ConstructionInteraction, previous: ConstructionParentProgress | undefined, partId: string, value: string, eventId: string, now: number): ConstructionParentProgress | undefined {
  if (!eventId || !Number.isFinite(now) || !i.parts.some(p => p.id === partId && p.choices.some(c => c.value === value))) return previous
  if (previous?.parentId !== undefined && previous.parentId !== i.id) return previous
  if (previous?.processedEventIds.includes(eventId) || isConstructionResolved(i, previous)) return previous
  const part = previous?.partRecords[partId], draft = { ...previous?.draft, [partId]: value }, grade = gradeConstructionDraft(i, draft)
  const next: ConstructionParentProgress = { parentId: i.id, draft, partRecords: { ...previous?.partRecords, [partId]: { value, firstValue: part?.firstValue ?? value, selectionCount: (part?.selectionCount ?? 0) + 1, firstSelectedAt: part?.firstSelectedAt ?? now, lastSelectedAt: now } }, attemptCount: previous?.attemptCount ?? 0, resolved: false, startedAt: previous?.startedAt ?? now, updatedAt: now, processedEventIds: [...previous?.processedEventIds ?? [], eventId], ...(previous?.isFirstCorrect !== undefined ? { isFirstCorrect: previous.isFirstCorrect } : {}), ...(previous?.firstSubmittedValues ? { firstSubmittedValues: previous.firstSubmittedValues } : {}), ...(previous?.firstSubmittedAt !== undefined ? { firstSubmittedAt: previous.firstSubmittedAt } : {}), ...(previous?.lastSubmittedAt !== undefined ? { lastSubmittedAt: previous.lastSubmittedAt } : {}) }
  if (grade.complete) { next.attemptCount++; next.resolved = grade.correct; next.isFirstCorrect ??= grade.correct; next.firstSubmittedValues ??= { ...draft }; next.firstSubmittedAt ??= now; next.lastSubmittedAt = now }
  return next
}
