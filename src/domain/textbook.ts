import * as w048N13Module from '../data/textbook/math/numbers/n13Lesson'
import * as w048N14Module from '../data/textbook/math/numbers/n14Lesson'
import type { NestedLedger } from './nestedLesson'
import { isConstructionResolvedV2, selectConstructionPartV2, type ConstructionProgressV2 } from './constructionProgressV2'
import n08Revision6 from '../data/textbook/math/numbers/n08Revision6.json'
import type { TextbookItem, TextbookUnit } from './textbookSchema'
import { isConstructionResolved, selectConstructionPart, type ConstructionProgress } from './constructionProgress'
import n08Revision5 from '../data/textbook/math/numbers/n08Revision5.json'

export type TextbookAnswerRecord = {
  itemId: string
  value: string
  firstValue?: string
  isFirstCorrect: boolean
  resolved: boolean
  attemptCount: number
  firstAnsweredAt: number
  lastAnsweredAt: number
}

export type TextbookChapterGroup = {
  chapterId: string
  chapterNumber: string
  chapterTitle: string
  units: TextbookUnit[]
}

export type TextbookRevisionArchive = {
  unitRevision: number
  startedAt: number
  updatedAt: number
  answers: Record<string, TextbookAnswerRecord>
  nestedProgress?: NestedLedger
  nestedResetAt?: number
  constructionProgressV2?: ConstructionProgressV2
  constructionProgress?: ConstructionProgress
  completedAt?: number
  previousRevisionCompletedAt?: number
  migratedFromRevision?: number
}

export type TextbookUnitProgress = {
  unitId: string
  unitRevision: number
  startedAt: number
  updatedAt: number
  answers: Record<string, TextbookAnswerRecord>
  nestedProgress?: NestedLedger
  nestedResetAt?: number
  constructionProgressV2?: ConstructionProgressV2
  constructionProgress?: ConstructionProgress
  completedAt?: number
  /** Prior revision completion is history, never current-version completion. */
  previousRevisionCompletedAt?: number
  migratedFromRevision?: number
  qf01Revision1Snapshot?: { schemaVersion: 'qf01-revision1-snapshot/1'; sourceSHA: '384021f539967038a20fd98bd146e0e499f0df65'; serializedProgress: string }
  qf01ResetSnapshots?: Array<{ schemaVersion: 'qf01-reset-snapshot/1'; priorResetCount: number; hadResetSnapshots: boolean; serializedProgressWithoutResetSnapshots: string }>
  /** Full old revision records remain recoverable after an approved restart. */
  archivedRevisions?: Record<string, TextbookRevisionArchive>
}

export function normalizeTextbookAnswer(value: string) {
  return value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\s\u3000]/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/[⃗→]/g, '')
}

function stableHash(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function stableShuffle(values: string[], seed: string) {
  const next = [...values]
  let state = stableHash(seed) || 1
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const swapIndex = state % (index + 1)
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

export function getTextbookChoices(unit: TextbookUnit, item: TextbookItem) {
  const desiredCount = item.scaffoldLevel === 'strong' ? 2 : item.scaffoldLevel === 'medium' ? 3 : 4

  if (item.choices?.length) {
    const distractors = item.choices.filter(
      (choice) => normalizeTextbookAnswer(choice) !== normalizeTextbookAnswer(item.answer),
    )
    const selectedDistractors = stableShuffle(distractors, `${item.id}-distractors`).slice(0, Math.max(1, desiredCount - 1))
    return stableShuffle([item.answer, ...selectedDistractors], `${item.id}-visible`)
  }

  const currentSection = unit.sections.find((section) => section.items.some((candidate) => candidate.id === item.id))
  const sameTypeInSection = currentSection?.items.filter((candidate) => candidate.answerType === item.answerType) ?? []
  const sameTypeInUnit = unit.sections.flatMap((section) => section.items).filter((candidate) => candidate.answerType === item.answerType)

  const pool = [...sameTypeInSection, ...sameTypeInUnit]
    .map((candidate) => candidate.answer)
    .filter((answer) => normalizeTextbookAnswer(answer) !== normalizeTextbookAnswer(item.answer))

  const distinctDistractors: string[] = []
  for (const answer of pool) {
    if (distinctDistractors.some((existing) => normalizeTextbookAnswer(existing) === normalizeTextbookAnswer(answer))) continue
    distinctDistractors.push(answer)
    if (distinctDistractors.length === 3) break
  }

  return stableShuffle(
    [item.answer, ...stableShuffle(distinctDistractors, `${item.id}-fallback-distractors`).slice(0, Math.max(1, desiredCount - 1))],
    `${item.id}-fallback-visible`,
  )
}

export function isTextbookAnswerCorrect(item: TextbookItem, value: string) {
  const normalized = normalizeTextbookAnswer(value)
  return [item.answer, ...item.acceptedAnswers].some((answer) => normalizeTextbookAnswer(answer) === normalized)
}

/**
 * W-MATH-008/P-001: A revised N12 must start from its *first* hole,
 * while preserving the complete prior answer ledger as a versioned archive.
 * Pure and idempotent: repeated reads do not mutate the persisted source.
 */
function migrateN12ToRevision3(progress: TextbookUnitProgress): TextbookUnitProgress {
  const oldRevision = progress.unitRevision
  const oldArchive: TextbookRevisionArchive = {
    unitRevision: oldRevision,
    startedAt: progress.startedAt,
    updatedAt: progress.updatedAt,
    answers: { ...progress.answers },
    ...(progress.completedAt !== undefined ? { completedAt: progress.completedAt } : {}),
    ...(progress.previousRevisionCompletedAt !== undefined
      ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}),
    ...(progress.migratedFromRevision !== undefined
      ? { migratedFromRevision: progress.migratedFromRevision } : {}),
  }
  return {
    unitId: progress.unitId,
    unitRevision: 3,
    startedAt: progress.updatedAt,
    updatedAt: progress.updatedAt,
    answers: {},
    archivedRevisions: { ...(progress.archivedRevisions ?? {}), [String(oldRevision)]: oldArchive },
    migratedFromRevision: oldRevision,
    ...(progress.completedAt !== undefined
      ? { previousRevisionCompletedAt: progress.completedAt }
      : progress.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt }
        : {}),
  }
}

/**
 * W-MATH-009/P-001: N09 v2 introduces four prerequisite decisions before Q08.
 * Keep every v1 answer in a versioned archive, but restart active Q01 onward.
 * Never interpret old Q08 as an answer to the new prerequisite holes.
 */
function migrateN09ToRevision2(progress: TextbookUnitProgress): TextbookUnitProgress {
  const oldRevision = progress.unitRevision
  const oldArchive: TextbookRevisionArchive = {
    unitRevision: oldRevision,
    startedAt: progress.startedAt,
    updatedAt: progress.updatedAt,
    answers: { ...progress.answers },
    ...(progress.completedAt !== undefined ? { completedAt: progress.completedAt } : {}),
    ...(progress.previousRevisionCompletedAt !== undefined
      ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}),
    ...(progress.migratedFromRevision !== undefined
      ? { migratedFromRevision: progress.migratedFromRevision } : {}),
  }
  return {
    unitId: progress.unitId,
    unitRevision: 2,
    startedAt: progress.updatedAt,
    updatedAt: progress.updatedAt,
    answers: {},
    archivedRevisions: { ...(progress.archivedRevisions ?? {}), [String(oldRevision)]: oldArchive },
    migratedFromRevision: oldRevision,
    ...(progress.completedAt !== undefined
      ? { previousRevisionCompletedAt: progress.completedAt }
      : progress.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt }
        : {}),
  }
}

// P017: only this source-bound QF01 revision uses this lossless migration.
const qf01Grading = [{"id":"qf01-n01-answer","answer":"4×2","acceptedAnswers":[],"choices":["4×2","4+2","2−4"]},{"id":"qf01-n02-answer","answer":"2","acceptedAnswers":[],"choices":["2","14","−2"]},{"id":"qf01-n03-answer","answer":"4×(−1)−6","acceptedAnswers":[],"choices":["4×(−1)−6","4−1−6","4×(−1−6)"]},{"id":"qf01-n04-answer","answer":"−10","acceptedAnswers":[],"choices":["−10","2","10"]},{"id":"qf01-n05-answer","answer":"4(a−1)−6","acceptedAnswers":[],"choices":["4(a−1)−6","4a−1−6","4(a−1−6)"]},{"id":"qf01-n06-answer","answer":"4a−4","acceptedAnswers":[],"choices":["4a−4","4a−1","4a+4"]},{"id":"qf01-n07-answer","answer":"4a−10","acceptedAnswers":[],"choices":["4a−10","4a+2","4a−2"]},{"id":"qf01-n08-answer","answer":"(−1)²−1","acceptedAnswers":[],"choices":["(−1)²−1","−1²−1","(−1−1)²"]},{"id":"qf01-n09-answer","answer":"0","acceptedAnswers":[],"choices":["0","−2","1"]},{"id":"qf01-n10-answer","answer":"3","acceptedAnswers":[],"choices":["3","1","−3"]},{"id":"qf01-n11-answer","answer":"(a−1)²−1","acceptedAnswers":[],"choices":["(a−1)²−1","a²−1−1","(a−1)²"]},{"id":"qf01-n12a-answer","answer":"−1(a−1)","acceptedAnswers":[],"choices":["−1(a−1)","+(a−1)","−1(a+1)"]},{"id":"qf01-n12b-answer","answer":"a²−a","acceptedAnswers":[],"choices":["a²−a","a²−1","a²+a"]},{"id":"qf01-n12c-answer","answer":"−a+1","acceptedAnswers":[],"choices":["−a+1","−a−1","a−1"]},{"id":"qf01-n12-answer","answer":"−2","acceptedAnswers":[],"choices":["−2","−1","2"]},{"id":"qf01-n13-answer","answer":"a²−2a","acceptedAnswers":[],"choices":["a²−2a","a²−2a+2","a²−1"]},{"id":"qf01-n14-answer","answer":"2x+2y=40","acceptedAnswers":[],"choices":["2x+2y=40","xy=40","x+y=40"]},{"id":"qf01-n15-answer","answer":"x+y=20","acceptedAnswers":[],"choices":["x+y=20","x+y=40","x+y=80"]},{"id":"qf01-n16-answer","answer":"y=20−x","acceptedAnswers":[],"choices":["y=20−x","y=x−20","y=20+x"]},{"id":"qf01-n17-answer","answer":"x>0かつy>0","acceptedAnswers":[],"choices":["x>0かつy>0","x≥0かつy≥0","x>0だけでよい"]},{"id":"qf01-n18-answer","answer":"x<20","acceptedAnswers":[],"choices":["x<20","x>20","x≤20"]},{"id":"qf01-n19-answer","answer":"0<x<20","acceptedAnswers":[],"choices":["0<x<20","0≤x≤20","x<20だけ"]},{"id":"qf01-n21-answer","answer":"20より小さい","acceptedAnswers":[],"choices":["20より小さい","20に等しい","20より大きい"]},{"id":"qf01-n22-answer","answer":"0<y<20","acceptedAnswers":[],"choices":["0<y<20","0<x<20","0≤y≤20"]}]
const qf01SourceSHA = '384021f539967038a20fd98bd146e0e499f0df65' as const
function qf01Need(ok: unknown): asserts ok { if (!ok) throw new Error('QF01保存データを変更できません。元の記録を保持しています。') }
function qf01JSON(value: unknown, stack = new Set<object>()): void {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return
  if (typeof value === 'number') { qf01Need(Number.isFinite(value)); return }
  qf01Need(typeof value === 'object' && !stack.has(value))
  qf01Need(Object.getPrototypeOf(value) === (Array.isArray(value) ? Array.prototype : Object.prototype) || Object.getPrototypeOf(value) === null)
  stack.add(value)
  const descriptors = Object.getOwnPropertyDescriptors(value)
  qf01Need(Reflect.ownKeys(value).every(k => typeof k === 'string'))
  if (Array.isArray(value)) qf01Need(Object.keys(value).length === value.length && Object.keys(value).every((k,i) => k === String(i)))
  for (const [key, d] of Object.entries(descriptors)) {
    if (Array.isArray(value) && key === 'length') continue
    qf01Need(d.enumerable && 'value' in d); qf01JSON(d.value, stack)
  }
  stack.delete(value)
}
function qf01Object(value: unknown): asserts value is Record<string, unknown> { qf01JSON(value); qf01Need(value !== null && typeof value === 'object' && !Array.isArray(value)) }
function qf01Keys(value: Record<string, unknown>, keys: string[]) { qf01Need(Object.keys(value).length === keys.length && keys.every(k => Object.hasOwn(value,k))) }
function qf01Contract(unit: TextbookUnit) {
  const items = unit.sections.flatMap(s => s.items)
  qf01Need(JSON.stringify(unit.requiredInteractionRefs) === JSON.stringify(qf01Grading.map(i => i.id)))
  for (const expected of qf01Grading) {
    const item = items.find(i => i.id === expected.id)
    qf01Need(item && JSON.stringify({id:item.id,answer:item.answer,acceptedAnswers:item.acceptedAnswers,choices:item.choices ?? []}) === JSON.stringify(expected))
  }
}
function qf01Record(item: TextbookItem, record: unknown): record is TextbookAnswerRecord {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return false
  const r = record as TextbookAnswerRecord
  if (r.itemId !== item.id || typeof r.value !== 'string' || typeof r.isFirstCorrect !== 'boolean' || typeof r.resolved !== 'boolean' || r.firstValue !== undefined && typeof r.firstValue !== 'string' || !Number.isInteger(r.attemptCount) || r.attemptCount < 1 || !Number.isFinite(r.firstAnsweredAt) || !Number.isFinite(r.lastAnsweredAt) || r.firstAnsweredAt > r.lastAnsweredAt) return false
  const recognized = (v: string) => [item.answer,...item.acceptedAnswers,...item.choices ?? []].some(a => normalizeTextbookAnswer(a) === normalizeTextbookAnswer(v))
  if (!recognized(r.value) || r.firstValue !== undefined && !recognized(r.firstValue)) return false
  const correct = isTextbookAnswerCorrect(item,r.value)
  if (r.resolved !== correct || r.isFirstCorrect && (!correct || r.firstValue !== undefined && !isTextbookAnswerCorrect(item,r.firstValue)) || !r.isFirstCorrect && r.firstValue !== undefined && isTextbookAnswerCorrect(item,r.firstValue)) return false
  return true
}
function qf01Snapshot(value: unknown) {
  qf01Object(value); qf01Keys(value,['schemaVersion','sourceSHA','serializedProgress'])
  qf01Need(value.schemaVersion === 'qf01-revision1-snapshot/1' && value.sourceSHA === qf01SourceSHA && typeof value.serializedProgress === 'string')
  const old: unknown = JSON.parse(value.serializedProgress); qf01Object(old)
  qf01Need(old.unitId === 'math-quadratic-qf01' && old.unitRevision === 1 && !Object.hasOwn(old,'qf01Revision1Snapshot') && !Object.hasOwn(old,'qf01ResetSnapshots'))
}
function qf01Current(unit: TextbookUnit, progress: TextbookUnitProgress) {
  qf01Object(progress); qf01Need(progress.unitId === unit.unitId && progress.unitRevision === 2)
  qf01Need(Number.isFinite(progress.startedAt) && Number.isFinite(progress.updatedAt)); qf01Object(progress.answers)
  for (const [id, record] of Object.entries(progress.answers)) {
    const item = unit.sections.flatMap(s => s.items).find(i => i.id === id)
    qf01Need(item && unit.requiredInteractionRefs!.includes(id) && qf01Record(item,record))
  }
  if (Object.hasOwn(progress,'qf01Revision1Snapshot')) qf01Snapshot(progress.qf01Revision1Snapshot)
  if (Object.hasOwn(progress,'qf01ResetSnapshots')) {
    qf01Need(Array.isArray(progress.qf01ResetSnapshots))
    progress.qf01ResetSnapshots.forEach((entry,index) => {
      qf01Object(entry); qf01Keys(entry,['schemaVersion','priorResetCount','hadResetSnapshots','serializedProgressWithoutResetSnapshots'])
      qf01Need(entry.schemaVersion === 'qf01-reset-snapshot/1' && entry.priorResetCount === index && typeof entry.hadResetSnapshots === 'boolean' && (index === 0 || entry.hadResetSnapshots) && typeof entry.serializedProgressWithoutResetSnapshots === 'string')
      const before: unknown = JSON.parse(entry.serializedProgressWithoutResetSnapshots); qf01Object(before)
      qf01Need(!Object.hasOwn(before,'qf01ResetSnapshots')); qf01Current(unit,before as TextbookUnitProgress)
    })
  }
  return progress
}
function qf01Progress(unit: TextbookUnit, progress: TextbookUnitProgress) {
  qf01Contract(unit); qf01Object(progress); qf01Need(progress.unitId === unit.unitId)
  if (progress.unitRevision === 2) return qf01Current(unit,progress)
  qf01Need(progress.unitRevision === 1 && !Object.hasOwn(progress,'qf01Revision1Snapshot') && !Object.hasOwn(progress,'qf01ResetSnapshots'))
  qf01Need(Number.isFinite(progress.startedAt) && Number.isFinite(progress.updatedAt)); qf01Object(progress.answers)
  const snapshot = {schemaVersion:'qf01-revision1-snapshot/1' as const,sourceSHA:qf01SourceSHA,serializedProgress:JSON.stringify(progress)}
  const answers: Record<string,TextbookAnswerRecord> = {}
  for (const {id} of qf01Grading) {
    const item = unit.sections.flatMap(s => s.items).find(i => i.id === id)!
    const record = progress.answers[id]
    if (qf01Record(item,record)) answers[id] = {...record}
  }
  const {completedAt, ...old} = progress
  return {...old,unitRevision:2,answers,qf01Revision1Snapshot:snapshot,migratedFromRevision:1,...(completedAt !== undefined ? {previousRevisionCompletedAt:completedAt} : {})}
}

export function effectiveTextbookProgress(unit: TextbookUnit, progress: TextbookUnitProgress | undefined): TextbookUnitProgress | undefined {
  if (!progress) return undefined
  if (unit.unitId === 'math-quadratic-qf01' && unit.revision === 2) return qf01Progress(unit,progress)
  // N09/N10 constructor revisions are migrated only by the source-bound Store bridge.
  if (unit.constructionLessonVersion === 'n0910/1') return progress.unitId === unit.unitId && progress.unitRevision === unit.revision ? progress : undefined
  if (progress.unitRevision === unit.revision) return progress
  // W048: use the real prior unit and prior migrations before adding new decisions.
  const w048Legacy = unit.unitId === 'math-numbers-expressions-n13' && unit.revision === 5
    ? (w048N13Module as unknown as { mathNumbersN13LegacyUnit?: TextbookUnit }).mathNumbersN13LegacyUnit ?? w048N13Module.mathNumbersN13Unit
    : unit.unitId === 'math-numbers-expressions-n14' && unit.revision === 11
      ? (w048N14Module as unknown as { mathNumbersN14LegacyUnit?: TextbookUnit }).mathNumbersN14LegacyUnit ?? w048N14Module.mathNumbersN14Unit
      : undefined
  if (w048Legacy && progress.unitId === unit.unitId && progress.unitRevision <= w048Legacy.revision) {
    const previous = effectiveTextbookProgress(w048Legacy, progress)
    if (!previous) return undefined
    const { archivedRevisions, ...archive } = previous
    const anchors = new Set(w048Legacy.sections.flatMap(section => section.items.map(item => item.id)))
    return {
      unitId: unit.unitId, unitRevision: unit.revision,
      startedAt: previous.startedAt, updatedAt: previous.updatedAt,
      answers: Object.fromEntries(Object.entries(previous.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, [String(w048Legacy.revision)]: archive },
      migratedFromRevision: w048Legacy.revision,
      ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt }
        : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}),
    }
  }
  // W041 is opt-in: an archived r7, including reset-empty records, is authoritative.
  if (unit.unitId === 'math-numbers-expressions-n08' && progress.unitId === unit.unitId && unit.revision === 7) {
    const previous = progress.unitRevision === 6 ? progress : effectiveTextbookProgress(n08Revision6.unit as unknown as TextbookUnit, progress)
    if (!previous || previous.unitRevision !== 6) return undefined
    const { archivedRevisions, ...archive } = previous, restored = archivedRevisions?.['7']
    const keep = new Set((unit.revisionMigration?.preservedInteractionIds ?? []).filter(id => {
      const f = unit.revisionMigration?.meaningFingerprints[id]; return f && f.from === f.to
    }))
    const source = restored ?? previous
    const answerIds = new Set(unit.sections.flatMap(s => s.items.map(i => i.id)))
    const constructionIds = new Set(unit.constructionItems?.map(i => i.id) ?? [])
    const next: TextbookUnitProgress = { unitId: unit.unitId, unitRevision: 7, startedAt: source.startedAt, updatedAt: source.updatedAt,
      answers: Object.fromEntries(Object.entries(source.answers).filter(([id]) => answerIds.has(id) && (restored || keep.has(id)))),
      constructionProgress: Object.fromEntries(Object.entries(source.constructionProgress ?? {}).filter(([id]) => constructionIds.has(id) && (restored || keep.has(id)))),
      constructionProgressV2: restored?.constructionProgressV2 ?? {}, archivedRevisions: {...archivedRevisions,'6':archive}, migratedFromRevision:6,
      ...(previous.completedAt !== undefined ? {previousRevisionCompletedAt:previous.completedAt} : previous.previousRevisionCompletedAt !== undefined ? {previousRevisionCompletedAt:previous.previousRevisionCompletedAt} : {}) }
    if(restored?.completedAt !== undefined && unit.requiredInteractionRefs?.every(id=>isTextbookInteractionResolved(unit,next,id))) next.completedAt=restored.completedAt
    return next
  }
  if(unit.unitId === 'math-numbers-expressions-n08' && progress.unitId === unit.unitId && progress.unitRevision === 7 && [4,5,6].includes(unit.revision)) {
    const {archivedRevisions,...archive}=progress, target=archivedRevisions?.['6']
    const revision6:TextbookUnitProgress={...(target ?? {unitRevision:6,startedAt:progress.startedAt,updatedAt:progress.updatedAt,answers:{},constructionProgress:{}}),unitId:unit.unitId,archivedRevisions:{...archivedRevisions,'7':archive},migratedFromRevision:7}
    return unit.revision===6 ? revision6 : effectiveTextbookProgress(unit,revision6)
  }
  // W040: preserve r4/r5/r6 ledgers, and never reinterpret whole-expression answers as parts.
  if (unit.unitId === 'math-numbers-expressions-n08' && progress.unitId === unit.unitId && unit.revision === 6) {
    const previous = progress.unitRevision < 5 ? effectiveTextbookProgress(n08Revision5.unit as unknown as TextbookUnit, progress) : progress
    if (!previous || previous.unitRevision !== 5) return undefined
    const { archivedRevisions, ...archive } = previous, restored = archivedRevisions?.['6']
    const ids = new Set(unit.sections.flatMap(s => s.items.map(i => i.id)))
    // A saved r6 state is authoritative, including deliberately empty answers after reset.
    // Old-version comparison answers are ephemeral and must not resurrect cleared progress.
    const next: TextbookUnitProgress = { unitId: unit.unitId, unitRevision: 6, startedAt: restored?.startedAt ?? previous.startedAt, updatedAt: restored?.updatedAt ?? previous.updatedAt, answers: Object.fromEntries(Object.entries(restored ? restored.answers : previous.answers).filter(([id]) => ids.has(id))), constructionProgress: restored?.constructionProgress ?? {}, archivedRevisions: { ...archivedRevisions, '5': archive }, migratedFromRevision: 5, ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt } : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}) }
    if ((unit.requiredInteractionRefs ?? []).length && unit.requiredInteractionRefs!.every(id => isTextbookInteractionResolved(unit, next, id)) && restored?.completedAt !== undefined) next.completedAt = restored.completedAt
    return next
  }
  if (unit.unitId === 'math-numbers-expressions-n08' && progress.unitId === unit.unitId && [4, 5].includes(unit.revision) && progress.unitRevision === 6) {
    const { archivedRevisions, ...archive } = progress, target = archivedRevisions?.[String(unit.revision)]
    const ids = new Set(unit.sections.flatMap(s => s.items.map(i => i.id)))
    return { unitId: unit.unitId, unitRevision: unit.revision, startedAt: target?.startedAt ?? progress.startedAt, updatedAt: progress.updatedAt, answers: Object.fromEntries(Object.entries({ ...target?.answers, ...progress.answers }).filter(([id]) => ids.has(id))), archivedRevisions: { ...archivedRevisions, '6': archive }, migratedFromRevision: 6, ...(target?.completedAt !== undefined ? { completedAt: target.completedAt } : {}), ...(progress.completedAt !== undefined ? { previousRevisionCompletedAt: progress.completedAt } : progress.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}) }
  }

  // W-MATH-036: apply all prior migrations first, retain current keys, reopen only added nodes.
  if (unit.unitId === 'math-numbers-expressions-ne02' && unit.revision === 2
      && progress.unitId === unit.unitId && progress.unitRevision <= 1) {
    const previous = progress.unitRevision === 1 ? progress : effectiveTextbookProgress({ ...unit, revision: 1 }, progress)
    if (!previous) return undefined
    const { archivedRevisions, ...archive } = previous
    const anchors = new Set(["ne02-01", "ne02-02", "ne02-03", "ne02-04", "ne02-05", "ne02-06", "ne02-07", "ne02-08", "ne02-09", "ne02-10", "ne02-11", "ne02-12"])
    return {
      unitId: unit.unitId, unitRevision: 2, startedAt: previous.startedAt, updatedAt: previous.updatedAt,
      answers: Object.fromEntries(Object.entries(previous.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, '1': archive }, migratedFromRevision: 1,
      ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt }
        : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-036: inactive until the approved new leaf revision is emitted.
  if (unit.unitId === 'math-numbers-expressions-n11' && unit.revision === 11
      && progress.unitId === unit.unitId && progress.unitRevision <= 10) {
    const previous = progress.unitRevision === 10 ? progress : effectiveTextbookProgress({ ...unit, revision: 10 }, progress)
    if (!previous) return undefined
    const { archivedRevisions, ...archive } = previous
    const anchors = new Set(["n11-01", "n11-02", "n11-wm011-q02-compare", "n11-wm011-q03-factor", "n11-wm011-q03-positive", "n11-03", "n11-wm011-q03-zero", "n11-wm011-q04-fraction", "n11-04", "n11-wm017-q05-operation", "n11-wm017-q05-balance", "n11-05", "n11-06", "n11-07", "n11-p007-q08-subtract-left", "n11-p007-q08-subtract-right", "n11-08", "n11-p007-q09-direction", "n11-09", "n11-10", "n11-wm012-q11-expand", "n11-wm012-q11-xcoef", "n11-11", "n11-12", "n11-p008-q13-mul-left", "n11-p008-q13-mul-right", "n11-13", "n11-p008-q13-constant", "n11-wm013-q14-xcoef", "n11-wm013-q14-const", "n11-14"])
    return {
      unitId: unit.unitId, unitRevision: 11, startedAt: previous.startedAt, updatedAt: previous.updatedAt,
      answers: Object.fromEntries(Object.entries(previous.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, '10': archive }, migratedFromRevision: 10,
      ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt }
        : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-036: inactive until the approved new leaf revision is emitted.
  if (unit.unitId === 'math-numbers-expressions-n12' && unit.revision === 4
      && progress.unitId === unit.unitId && progress.unitRevision <= 3) {
    const previous = progress.unitRevision === 3 ? progress : effectiveTextbookProgress({ ...unit, revision: 3 }, progress)
    if (!previous) return undefined
    const { archivedRevisions, ...archive } = previous
    const anchors = new Set(["n12-p002-q01-coef", "n12-p002-q01-const", "n12-01", "n12-p002-q02-coef", "n12-p002-q02-const", "n12-02", "n12-03", "n12-04", "n12-05", "n12-p002-q06-left-coef", "n12-p002-q06-left-const", "n12-p002-q06-right-coef", "n12-p002-q06-right-const", "n12-06", "n12-07", "n12-08", "n12-09", "n12-p003-q10-meaning", "n12-p003-q10-cream-coef", "n12-p003-q10-pudding-coef", "n12-p003-q10-box-fee", "n12-10", "n12-p003-q11-lower-sign", "n12-p003-q11-upper-sign", "n12-11", "n12-p003-q12-product-constant", "n12-p002-q12-signed-coef", "n12-p003-q12-total-constant", "n12-p003-q12-x-coef", "n12-12", "n12-p002-q13-lower", "n12-p002-q13-upper", "n12-13", "n12-14", "n12-15"])
    return {
      unitId: unit.unitId, unitRevision: 4, startedAt: previous.startedAt, updatedAt: previous.updatedAt,
      answers: Object.fromEntries(Object.entries(previous.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, '3': archive }, migratedFromRevision: 3,
      ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt }
        : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-034: keep all21 original N10 histories;24 new derivations are unanswered.
  if (unit.unitId === 'math-numbers-expressions-n10' && unit.revision === 2
      && progress.unitId === unit.unitId && progress.unitRevision === 1) {
    const { archivedRevisions, ...archive } = progress
    const anchors = new Set(["n10-01", "n10-02", "n10-03", "n10-04", "n10-05", "n10-06", "n10-07", "n10-08", "n10-09", "n10-10", "n10-11", "n10-12", "n10-13", "n10-14", "n10-15", "n10-16", "n10-17", "n10-18", "n10-19", "n10-20", "n10-21"])
    return {
      unitId: unit.unitId, unitRevision: 2, startedAt: progress.startedAt, updatedAt: progress.updatedAt,
      answers: Object.fromEntries(Object.entries(progress.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, '1': archive }, migratedFromRevision: 1,
      ...(progress.completedAt !== undefined ? { previousRevisionCompletedAt: progress.completedAt }
        : progress.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-034: apply the accepted v1->v2 reset before adding new N09 decisions.
  if (unit.unitId === 'math-numbers-expressions-n09' && unit.revision === 3
      && progress.unitId === unit.unitId && [1, 2].includes(progress.unitRevision)) {
    const fromV2 = progress.unitRevision === 2 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 2 }, progress)
    if (!fromV2 || fromV2.unitRevision !== 2) return undefined
    const { archivedRevisions, ...archive } = fromV2
    const anchors = new Set(["n09-01", "n09-02", "n09-03", "n09-04", "n09-05", "n09-06", "n09-07", "n09-p001-q08-left-square", "n09-p001-q08-right-square", "n09-p001-q08-lower-sign", "n09-p001-q08-upper-sign", "n09-08", "n09-09", "n09-10", "n09-11", "n09-12", "n09-13", "n09-14"])
    return {
      unitId: unit.unitId, unitRevision: 3,
      startedAt: fromV2.startedAt, updatedAt: fromV2.updatedAt,
      answers: Object.fromEntries(Object.entries(fromV2.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, '2': archive }, migratedFromRevision: 2,
      ...(fromV2.completedAt !== undefined ? { previousRevisionCompletedAt: fromV2.completedAt }
        : fromV2.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: fromV2.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-037: reversible r4/r5 migration; old answers override their archived copies.
  if (unit.unitId === 'math-numbers-expressions-n08' && progress.unitId === unit.unitId
      && [4, 5].includes(unit.revision) && (progress.unitRevision === 4 || progress.unitRevision === 5 || (unit.revision === 5 && progress.unitRevision < 4))) {
    const previous = progress.unitRevision < 4
      ? effectiveTextbookProgress({ ...unit, revision: 4 }, progress) : progress
    if (!previous) return undefined
    const { archivedRevisions, ...archive } = previous
    const targetArchive = archivedRevisions?.[String(unit.revision)]
    const ids = new Set(unit.sections.flatMap(section => section.items.map(item => item.id)))
    const answers = Object.fromEntries(Object.entries({ ...targetArchive?.answers, ...previous.answers }).filter(([id]) => ids.has(id)))
    const restoredCompletion = targetArchive?.completedAt
    return {
      unitId: unit.unitId, unitRevision: unit.revision,
      startedAt: previous.startedAt, updatedAt: previous.updatedAt, answers,
      archivedRevisions: { ...archivedRevisions, [String(previous.unitRevision)]: archive },
      migratedFromRevision: previous.unitRevision,
      ...(restoredCompletion !== undefined ? { completedAt: restoredCompletion } : {}),
      ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt }
        : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-033: keep original N08 answer records; new intermediate IDs remain unanswered.
  if (unit.unitId === 'math-numbers-expressions-n08' && unit.revision === 4
      && progress.unitId === unit.unitId && [1, 2, 3].includes(progress.unitRevision)) {
    const fromV3 = progress.unitRevision === 3 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 3 }, progress)
    if (!fromV3 || fromV3.unitRevision !== 3) return undefined
    const { archivedRevisions, ...archive } = fromV3
    const anchors = new Set(Array.from({ length: 12 }, (_, i) => 'n08-' + String(i + 1).padStart(2, '0')))
    return {
      unitId: unit.unitId, unitRevision: 4,
      startedAt: fromV3.startedAt, updatedAt: fromV3.updatedAt,
      answers: Object.fromEntries(Object.entries(fromV3.answers).filter(([id]) => anchors.has(id))),
      archivedRevisions: { ...archivedRevisions, '3': archive },
      migratedFromRevision: 3,
      ...(fromV3.completedAt !== undefined ? { previousRevisionCompletedAt: fromV3.completedAt }
        : fromV3.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: fromV3.previousRevisionCompletedAt } : {}),
    }
  }

  // N07 approved v4: retain only unchanged contracts; keep the full old record recoverable.
  if (unit.unitId === 'math-numbers-expressions-n07' && unit.revision === 4
      && progress.unitId === unit.unitId && [1, 2, 3].includes(progress.unitRevision)) {
    const { archivedRevisions, ...archive } = progress
    const retained = new Set(['n07-10', 'n07-14'])
    return {
      unitId: unit.unitId, unitRevision: 4,
      startedAt: progress.startedAt, updatedAt: progress.updatedAt,
      answers: Object.fromEntries(Object.entries(progress.answers).filter(([id]) => retained.has(id))),
      migratedFromRevision: progress.unitRevision,
      archivedRevisions: { ...archivedRevisions, [String(progress.unitRevision)]: archive },
      ...(progress.completedAt !== undefined ? { previousRevisionCompletedAt: progress.completedAt }
        : progress.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}),
    }
  }

  // First-theme repair: additions reopen only new reasoning nodes. Preserve old attempts.
  const firstThemeBase: Record<string, number> = { n01: 2, n02: 1, n03: 2, n04: 2, n05: 2, n06: 3, ne01: 1 }
  const base = firstThemeBase[unit.unitId.replace('math-numbers-expressions-', '')]
  const fromRevision = base && unit.revision > base ? unit.revision - 1 : base
  if (unit.unitId.startsWith('math-numbers-expressions-') && base && [base + 1, base + 2, base + 3, base + 4, base + 5].includes(unit.revision)
      && progress.unitId === unit.unitId && progress.unitRevision <= fromRevision) {
    const previous = progress.unitRevision === fromRevision ? progress : effectiveTextbookProgress({ ...unit, revision: fromRevision }, progress)
    if (!previous) return undefined
    const { archivedRevisions, ...archive } = previous
    const known = new Set(unit.sections.flatMap(section => section.items.map(item => item.id)))
    return {
      unitId: unit.unitId, unitRevision: unit.revision,
      startedAt: previous.startedAt, updatedAt: previous.updatedAt,
      answers: Object.fromEntries(Object.entries(previous.answers).filter(([id]) => known.has(id))),
      migratedFromRevision: previous.unitRevision,
      archivedRevisions: { ...archivedRevisions, [String(previous.unitRevision)]: archive },
      ...(previous.completedAt !== undefined ? { previousRevisionCompletedAt: previous.completedAt }
        : previous.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: previous.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-017/P-008: Q13's old full operation + completed equation
  // is replaced by local 6x coefficient; archive v9 and reopen only Q13.
  if (unit.unitId === 'math-numbers-expressions-n11' && unit.revision === 10
    && progress.unitId === unit.unitId
    && [1,2,3,4,5,6,7,8,9].includes(progress.unitRevision)) {
    const fromV9 = progress.unitRevision === 9 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 9 }, progress)
    if (!fromV9 || fromV9.unitRevision !== 9) return undefined
    const archive: TextbookRevisionArchive = {
      unitRevision: 9, startedAt: fromV9.startedAt, updatedAt: fromV9.updatedAt,
      answers: { ...fromV9.answers },
      ...(fromV9.completedAt !== undefined ? { completedAt: fromV9.completedAt } : {}),
      ...(fromV9.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV9.previousRevisionCompletedAt } : {}),
      ...(fromV9.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV9.migratedFromRevision } : {}),
    }
    const answers = { ...fromV9.answers }
    delete answers['n11-13']
    return {
      unitId: unit.unitId, unitRevision: 10,
      startedAt: fromV9.startedAt, updatedAt: fromV9.updatedAt,
      answers, migratedFromRevision: 9,
      archivedRevisions: { ...(fromV9.archivedRevisions ?? {}), '9': archive },
      ...(fromV9.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV9.completedAt }
        : fromV9.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV9.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-017/P-007: Q08/Q09 changed from premade operation+result
  // answers into local numeric answers. Preserve every v8 attempt in the
  // immutable archive, reopening ONLY the two repurposed stable IDs.
  if (unit.unitId === 'math-numbers-expressions-n11' && unit.revision === 9
    && progress.unitId === unit.unitId
    && [1, 2, 3, 4, 5, 6, 7, 8].includes(progress.unitRevision)) {
    const fromV8 = progress.unitRevision === 8 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 8 }, progress)
    if (!fromV8 || fromV8.unitRevision !== 8) return undefined
    const archive: TextbookRevisionArchive = {
      unitRevision: 8,
      startedAt: fromV8.startedAt, updatedAt: fromV8.updatedAt,
      answers: { ...fromV8.answers },
      ...(fromV8.completedAt !== undefined ? { completedAt: fromV8.completedAt } : {}),
      ...(fromV8.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV8.previousRevisionCompletedAt } : {}),
      ...(fromV8.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV8.migratedFromRevision } : {}),
    }
    const answers = { ...fromV8.answers }
    delete answers['n11-08']
    delete answers['n11-09']
    return {
      unitId: unit.unitId, unitRevision: 9,
      startedAt: fromV8.startedAt, updatedAt: fromV8.updatedAt,
      answers, migratedFromRevision: 8,
      archivedRevisions: { ...(fromV8.archivedRevisions ?? {}), '8': archive },
      ...(fromV8.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV8.completedAt }
        : fromV8.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV8.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-017/P-005: the old Q06 compound operation/result key is
  // replaced by the fractional number alone in the fourth equation row.
  // Archive all rev7 answers, reopen ONLY n11-06 and the newly added
  // right-side balancing hole; preserve rev7 Q01/Q05 and all other progress.
  if (unit.unitId === 'math-numbers-expressions-n11' && unit.revision === 8
    && progress.unitId === unit.unitId
    && [1, 2, 3, 4, 5, 6, 7].includes(progress.unitRevision)) {
    const fromV7 = progress.unitRevision === 7 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 7 }, progress)
    if (!fromV7 || fromV7.unitRevision !== 7) return undefined
    const archive: TextbookRevisionArchive = {
      unitRevision: 7,
      startedAt: fromV7.startedAt, updatedAt: fromV7.updatedAt,
      answers: { ...fromV7.answers },
      ...(fromV7.completedAt !== undefined ? { completedAt: fromV7.completedAt } : {}),
      ...(fromV7.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV7.previousRevisionCompletedAt } : {}),
      ...(fromV7.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV7.migratedFromRevision } : {}),
    }
    const answers = { ...fromV7.answers }
    delete answers['n11-06']
    return {
      unitId: unit.unitId, unitRevision: 8,
      startedAt: fromV7.startedAt, updatedAt: fromV7.updatedAt,
      answers, migratedFromRevision: 7,
      archivedRevisions: { ...(fromV7.archivedRevisions ?? {}), '7': archive },
      ...(fromV7.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV7.completedAt }
        : fromV7.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV7.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-017/P-003: Q01 (complete formula -> relation) and Q05
  // (combined answer -> computed result) have new grading semantics.
  // Preserve full prior attempts in the v6 archive; reopen only those two IDs.
  if (unit.unitId === 'math-numbers-expressions-n11' && unit.revision === 7
    && progress.unitId === unit.unitId
    && [1,2,3,4,5,6].includes(progress.unitRevision)) {
    const fromV6 = progress.unitRevision === 6 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 6 }, progress)
    if (!fromV6 || fromV6.unitRevision !== 6) return undefined
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 6,
      startedAt: fromV6.startedAt,
      updatedAt: fromV6.updatedAt,
      answers: { ...fromV6.answers },
      ...(fromV6.completedAt !== undefined ? { completedAt: fromV6.completedAt } : {}),
      ...(fromV6.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV6.previousRevisionCompletedAt } : {}),
      ...(fromV6.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV6.migratedFromRevision } : {}),
    }
    const answers = { ...fromV6.answers }
    delete answers['n11-01']
    delete answers['n11-05']
    return {
      unitId: unit.unitId,
      unitRevision: 7,
      startedAt: fromV6.startedAt,
      updatedAt: fromV6.updatedAt,
      answers,
      migratedFromRevision: 6,
      archivedRevisions: { ...(fromV6.archivedRevisions ?? {}), '6': oldArchive },
      ...(fromV6.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV6.completedAt }
        : fromV6.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV6.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-022/P-001: N14 Q16 no longer grades the old completed two-endpoint
  // expression. Archive all v9 progress, retaining earlier version archives and
  // reopening ONLY re-keyed n14-16; approved Q10/Q14/Q15 progress survives.
  if (unit.unitId === 'math-numbers-expressions-n14' && unit.revision === 10
    && progress.unitId === unit.unitId
    && [1,2,3,4,5,6,7,8,9].includes(progress.unitRevision)) {
    const fromV9 = progress.unitRevision === 9 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 9 }, progress)
    if (!fromV9 || fromV9.unitRevision !== 9) return undefined
    const archive: TextbookRevisionArchive = {
      unitRevision: 9, startedAt: fromV9.startedAt, updatedAt: fromV9.updatedAt,
      answers: { ...fromV9.answers },
      ...(fromV9.completedAt !== undefined ? { completedAt: fromV9.completedAt } : {}),
      ...(fromV9.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV9.previousRevisionCompletedAt } : {}),
      ...(fromV9.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV9.migratedFromRevision } : {}),
    }
    const answers = { ...fromV9.answers }
    delete answers['n14-16']
    return {
      unitId: unit.unitId, unitRevision: 10,
      startedAt: fromV9.startedAt, updatedAt: fromV9.updatedAt,
      answers, migratedFromRevision: 9,
      archivedRevisions: { ...(fromV9.archivedRevisions ?? {}), '9': archive },
      ...(fromV9.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV9.completedAt }
        : fromV9.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV9.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-020/P-001: archive prior v8 (and all earlier archives);
  // the old n14-15 graded a compound operation+final range, while the
  // new n14-15 grades ONLY the left fractional endpoint.
  if(unit.unitId==='math-numbers-expressions-n14' && unit.revision===9
    && progress.unitId===unit.unitId
    && [1,2,3,4,5,6,7,8].includes(progress.unitRevision)){
    const fromV8=progress.unitRevision===8 ? progress
      : effectiveTextbookProgress({...unit,revision:8},progress)
    if(!fromV8 || fromV8.unitRevision!==8) return undefined
    const archive:TextbookRevisionArchive={
      unitRevision:8,startedAt:fromV8.startedAt,updatedAt:fromV8.updatedAt,
      answers:{...fromV8.answers},
      ...(fromV8.completedAt!==undefined?{completedAt:fromV8.completedAt}:{}),
      ...(fromV8.previousRevisionCompletedAt!==undefined
        ?{previousRevisionCompletedAt:fromV8.previousRevisionCompletedAt}:{}),
      ...(fromV8.migratedFromRevision!==undefined
        ?{migratedFromRevision:fromV8.migratedFromRevision}:{}),
    }
    const answers={...fromV8.answers}
    delete answers['n14-15']
    return{
      unitId:unit.unitId,unitRevision:9,
      startedAt:fromV8.startedAt,updatedAt:fromV8.updatedAt,
      answers,migratedFromRevision:8,
      archivedRevisions:{...(fromV8.archivedRevisions??{}),'8':archive},
      ...(fromV8.completedAt!==undefined
        ?{previousRevisionCompletedAt:fromV8.completedAt}
        :fromV8.previousRevisionCompletedAt!==undefined
          ?{previousRevisionCompletedAt:fromV8.previousRevisionCompletedAt}:{}),
    }
  }

  // W-MATH-019/P-001: old N14-Q14 graded the operation AND finished range
  // in one choice. It now grades only the computed left endpoint.
  // Archive all v7 attempts, keep all unaffected Q07/Q08/Q10/Q12/Q15 keys
  // active, and reopen ONLY the re-keyed n14-14 plus four newly added IDs.
  if (unit.unitId === 'math-numbers-expressions-n14' && unit.revision === 8
    && progress.unitId === unit.unitId
    && [1,2,3,4,5,6,7].includes(progress.unitRevision)) {
    const fromV7 = progress.unitRevision === 7 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 7 }, progress)
    if (!fromV7 || fromV7.unitRevision !== 7) return undefined
    const archive: TextbookRevisionArchive = {
      unitRevision: 7, startedAt: fromV7.startedAt, updatedAt: fromV7.updatedAt,
      answers: { ...fromV7.answers },
      ...(fromV7.completedAt !== undefined ? { completedAt: fromV7.completedAt } : {}),
      ...(fromV7.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV7.previousRevisionCompletedAt } : {}),
      ...(fromV7.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV7.migratedFromRevision } : {}),
    }
    const answers = { ...fromV7.answers }
    delete answers['n14-14']
    return {
      unitId: unit.unitId, unitRevision: 8,
      startedAt: fromV7.startedAt, updatedAt: fromV7.updatedAt,
      answers, migratedFromRevision: 7,
      archivedRevisions: { ...(fromV7.archivedRevisions ?? {}), '7': archive },
      ...(fromV7.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV7.completedAt }
        : fromV7.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV7.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-018/P-001: the old N14-Q10 one-choice operation+final range
  // is replaced by the left numerical endpoint; reopen ONLY its old key.
  // Keep original v6 attempts and every earlier archive for review.
  if (unit.unitId === 'math-numbers-expressions-n14' && unit.revision === 7
    && progress.unitId === unit.unitId && [1,2,3,4,5,6].includes(progress.unitRevision)) {
    const fromV6 = progress.unitRevision === 6 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 6 }, progress)
    if (!fromV6 || fromV6.unitRevision !== 6) return undefined
    const archive: TextbookRevisionArchive = {
      unitRevision: 6, startedAt: fromV6.startedAt, updatedAt: fromV6.updatedAt,
      answers: { ...fromV6.answers },
      ...(fromV6.completedAt !== undefined ? { completedAt: fromV6.completedAt } : {}),
      ...(fromV6.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV6.previousRevisionCompletedAt } : {}),
      ...(fromV6.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV6.migratedFromRevision } : {}),
    }
    const answers = { ...fromV6.answers }
    delete answers['n14-10']
    return {
      unitId: unit.unitId, unitRevision: 7,
      startedAt: fromV6.startedAt, updatedAt: fromV6.updatedAt,
      answers, migratedFromRevision: 6,
      archivedRevisions: { ...(fromV6.archivedRevisions ?? {}), '6': archive },
      ...(fromV6.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV6.completedAt }
        : fromV6.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV6.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-016/P-001: Q12 adds two distinct subtraction decisions.
  // Normalize historical v1–v4 through existing approved v5 migration,
  // then snapshot v5 including Q07, Q08 and original Q12 answers.
  if (unit.unitId === 'math-numbers-expressions-n14' && unit.revision === 6
    && progress.unitId === unit.unitId
    && [1,2,3,4,5].includes(progress.unitRevision)) {
    const fromV5 = progress.unitRevision === 5 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 5 }, progress)
    if (!fromV5 || fromV5.unitRevision !== 5) return undefined
    const archive: TextbookRevisionArchive = {
      unitRevision: 5,
      startedAt: fromV5.startedAt,
      updatedAt: fromV5.updatedAt,
      answers: { ...fromV5.answers },
      ...(fromV5.completedAt !== undefined ? { completedAt: fromV5.completedAt } : {}),
      ...(fromV5.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV5.previousRevisionCompletedAt } : {}),
      ...(fromV5.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV5.migratedFromRevision } : {}),
    }
    return {
      unitId: unit.unitId,
      unitRevision: 6,
      startedAt: fromV5.startedAt,
      updatedAt: fromV5.updatedAt,
      answers: { ...fromV5.answers },
      migratedFromRevision: 5,
      archivedRevisions: { ...(fromV5.archivedRevisions ?? {}), '5': archive },
      ...(fromV5.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV5.completedAt }
        : fromV5.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV5.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-015/P-001: Q08 adds two sign-case checks, preserving the
  // unchanged original n14-08. Normalize v1–v3 through the approved v4
  // migration, then archive v4 without losing Q07 or other old answers.
  if (unit.unitId === 'math-numbers-expressions-n14' && unit.revision === 5
    && progress.unitId === unit.unitId && [1,2,3,4].includes(progress.unitRevision)) {
    const fromV4 = progress.unitRevision === 4 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 4 }, progress)
    if (!fromV4 || fromV4.unitRevision !== 4) return undefined
    const prior: TextbookRevisionArchive = {
      unitRevision: 4,
      startedAt: fromV4.startedAt,
      updatedAt: fromV4.updatedAt,
      answers: { ...fromV4.answers },
      ...(fromV4.completedAt !== undefined ? { completedAt: fromV4.completedAt } : {}),
      ...(fromV4.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV4.previousRevisionCompletedAt } : {}),
      ...(fromV4.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV4.migratedFromRevision } : {}),
    }
    return {
      unitId: unit.unitId,
      unitRevision: 5,
      startedAt: fromV4.startedAt,
      updatedAt: fromV4.updatedAt,
      answers: { ...fromV4.answers },
      migratedFromRevision: 4,
      archivedRevisions: { ...(fromV4.archivedRevisions ?? {}), '4': prior },
      ...(fromV4.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV4.completedAt }
        : fromV4.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV4.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-014/P-001: two new N14 Q07 sign-case choices before the
  // UNCHANGED n14-07 final. Archive v3, keep every old answer active.
  // Older v1/v2 first pass through the approved v2 and v3 migrations.
  if (unit.unitId === 'math-numbers-expressions-n14' && unit.revision === 4
    && progress.unitId === unit.unitId
    && [1, 2, 3].includes(progress.unitRevision)) {
    const fromV3 = progress.unitRevision === 3 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 3 }, progress)
    if (!fromV3 || fromV3.unitRevision !== 3) return undefined
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 3,
      startedAt: fromV3.startedAt,
      updatedAt: fromV3.updatedAt,
      answers: { ...fromV3.answers },
      ...(fromV3.completedAt !== undefined ? { completedAt: fromV3.completedAt } : {}),
      ...(fromV3.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV3.previousRevisionCompletedAt } : {}),
      ...(fromV3.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV3.migratedFromRevision } : {}),
    }
    return {
      unitId: unit.unitId,
      unitRevision: 4,
      startedAt: fromV3.startedAt,
      updatedAt: fromV3.updatedAt,
      answers: { ...fromV3.answers },
      migratedFromRevision: 3,
      archivedRevisions: { ...(fromV3.archivedRevisions ?? {}), '3': oldArchive },
      ...(fromV3.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV3.completedAt }
        : fromV3.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV3.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-013/P-001: Q14 two new decisions, original n11-14 final
  // answer retains its meaning. Archive the full previous v5 snapshot;
  // retain all v5 answers active while newly introduced Q14 nodes are open.
  if (unit.unitId === 'math-numbers-expressions-n11' && unit.revision === 6
    && progress.unitId === unit.unitId
    && [1,2,3,4,5].includes(progress.unitRevision)) {
    const fromV5 = progress.unitRevision === 5 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 5 }, progress)
    if (!fromV5 || fromV5.unitRevision !== 5) return undefined
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 5,
      startedAt: fromV5.startedAt,
      updatedAt: fromV5.updatedAt,
      answers: { ...fromV5.answers },
      ...(fromV5.completedAt !== undefined ? { completedAt: fromV5.completedAt } : {}),
      ...(fromV5.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV5.previousRevisionCompletedAt } : {}),
      ...(fromV5.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV5.migratedFromRevision } : {}),
    }
    return {
      unitId: unit.unitId,
      unitRevision: 6,
      startedAt: fromV5.startedAt,
      updatedAt: fromV5.updatedAt,
      answers: { ...fromV5.answers },
      migratedFromRevision: 5,
      archivedRevisions: { ...(fromV5.archivedRevisions ?? {}), '5': oldArchive },
      ...(fromV5.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV5.completedAt }
        : fromV5.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV5.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-012/P-001: two new Q11 decisions; original n11-11 answer
  // meaning remains unchanged. Existing old answers all survive active v5,
  // while v4 and older historical completion evidence remains archived.
  // Each older revision first traverses its earlier approved migrations.
  if (unit.unitId === 'math-numbers-expressions-n11' && unit.revision === 5
    && progress.unitId === unit.unitId
    && [1, 2, 3, 4].includes(progress.unitRevision)) {
    const fromV4 = progress.unitRevision === 4 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 4 }, progress)
    if (!fromV4 || fromV4.unitRevision !== 4) return undefined
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 4,
      startedAt: fromV4.startedAt,
      updatedAt: fromV4.updatedAt,
      answers: { ...fromV4.answers },
      ...(fromV4.completedAt !== undefined ? { completedAt: fromV4.completedAt } : {}),
      ...(fromV4.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV4.previousRevisionCompletedAt } : {}),
      ...(fromV4.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV4.migratedFromRevision } : {}),
    }
    return {
      unitId: unit.unitId,
      unitRevision: 5,
      startedAt: fromV4.startedAt,
      updatedAt: fromV4.updatedAt,
      answers: { ...fromV4.answers },
      migratedFromRevision: 4,
      archivedRevisions: { ...(fromV4.archivedRevisions ?? {}), '4': oldArchive },
      ...(fromV4.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV4.completedAt }
        : fromV4.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV4.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-011/P-001: N11's four original source questions now contain
  // nine active proof decisions, five of them entirely new. Old Q01/Q02
  // remain valid; only old Q03/Q04 change answer meaning. Archive every
  // historical answer and reopen exactly those two old IDs.
  // v1/v2 records first traverse the already-approved v2 and v3 repairs.
  if (unit.unitId === 'math-numbers-expressions-n11' && unit.revision === 4
    && progress.unitId === unit.unitId
    && [1, 2, 3].includes(progress.unitRevision)) {
    const fromV3 = progress.unitRevision === 3 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 3 }, progress)
    if (!fromV3 || fromV3.unitRevision !== 3) return undefined
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 3,
      startedAt: fromV3.startedAt,
      updatedAt: fromV3.updatedAt,
      answers: { ...fromV3.answers },
      ...(fromV3.completedAt !== undefined ? { completedAt: fromV3.completedAt } : {}),
      ...(fromV3.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV3.previousRevisionCompletedAt } : {}),
      ...(fromV3.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV3.migratedFromRevision } : {}),
    }
    const answers = { ...fromV3.answers }
    delete answers['n11-03']
    delete answers['n11-04']
    return {
      unitId: unit.unitId,
      unitRevision: 4,
      startedAt: fromV3.startedAt,
      updatedAt: fromV3.updatedAt,
      answers,
      migratedFromRevision: 3,
      archivedRevisions: { ...(fromV3.archivedRevisions ?? {}), '3': oldArchive },
      ...(fromV3.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV3.completedAt }
        : fromV3.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV3.previousRevisionCompletedAt } : {}),
    }
  }

  // P-004: the seven affected review lessons changed answer semantics.
  // Preserve all v1 attempts in history, keep unaffected resolved answers,
  // and reopen only the corrected learner decisions. Never reuse old-key
  // success as proof that the new compound answer was given.
  const repairedReviewItemIds: Record<string, string[]> = {
    'math-numbers-expressions-n04': ['n04-13'],
    'math-numbers-expressions-n05': ['n05-17'],
    'math-numbers-expressions-n06': ['n06-08'],
    'math-numbers-expressions-n07': ['n07-06'],
    'math-numbers-expressions-n08': ['n08-05'],
    'math-numbers-expressions-n11': ['n11-05'],
    'math-numbers-expressions-n14': ['n14-06', 'n14-11'],
  }
  const changed = repairedReviewItemIds[unit.unitId]
  if (changed && unit.revision === 2 && progress.unitRevision === 1 && progress.unitId === unit.unitId) {
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: progress.unitRevision,
      startedAt: progress.startedAt,
      updatedAt: progress.updatedAt,
      answers: { ...progress.answers },
      ...(progress.completedAt !== undefined ? { completedAt: progress.completedAt } : {}),
      ...(progress.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}),
      ...(progress.migratedFromRevision !== undefined
        ? { migratedFromRevision: progress.migratedFromRevision } : {}),
    }
    const answers = { ...progress.answers }
    for (const itemId of changed) delete answers[itemId]
    return {
      unitId: unit.unitId,
      unitRevision: 2,
      startedAt: progress.startedAt,
      updatedAt: progress.updatedAt,
      answers,
      migratedFromRevision: 1,
      archivedRevisions: { ...(progress.archivedRevisions ?? {}), '1': oldArchive },
      ...(progress.completedAt !== undefined
        ? { previousRevisionCompletedAt: progress.completedAt }
        : progress.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-003/P-004-R2: three revised review lessons now require learners
  // to choose the actual operation, not only the previous v2 result.
  // Reopen exactly these eight changed keys while preserving every earlier
  // attempt in version archives. A direct v1 -> v3 upgrade first applies
  // the already-approved v1 -> v2 correction map, without skipping it.
  const r2Reopen: Record<string, string[]> = {
    'math-numbers-expressions-n07': ['n07-09'],
    'math-numbers-expressions-n11': ['n11-06', 'n11-08', 'n11-09', 'n11-13'],
    'math-numbers-expressions-n14': ['n14-10', 'n14-14', 'n14-15'],
  }
  const r2Changed = r2Reopen[unit.unitId]
  if (r2Changed && unit.revision === 3 && progress.unitId === unit.unitId
    && (progress.unitRevision === 1 || progress.unitRevision === 2)) {
    const fromV2 = progress.unitRevision === 1
      ? effectiveTextbookProgress({ ...unit, revision: 2 }, progress)
      : progress
    if (!fromV2 || fromV2.unitRevision !== 2) return undefined
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 2,
      startedAt: fromV2.startedAt,
      updatedAt: fromV2.updatedAt,
      answers: { ...fromV2.answers },
      ...(fromV2.completedAt !== undefined ? { completedAt: fromV2.completedAt } : {}),
      ...(fromV2.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV2.previousRevisionCompletedAt } : {}),
      ...(fromV2.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV2.migratedFromRevision } : {}),
    }
    const answers = { ...fromV2.answers }
    for (const id of r2Changed) delete answers[id]
    return {
      unitId: unit.unitId,
      unitRevision: 3,
      startedAt: fromV2.startedAt,
      updatedAt: fromV2.updatedAt,
      answers,
      migratedFromRevision: 2,
      archivedRevisions: {
        ...(fromV2.archivedRevisions ?? {}),
        '2': oldArchive,
      },
      ...(fromV2.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV2.completedAt }
        : fromV2.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV2.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-003/P-004-R5: preserve all historical attempts for the two
  // second-revision fixes while reopening only the newly compound response.
  // A v1 -> v3 upgrade must first run the existing P-004 v1 -> v2 rule.
  const r5Revision3Changed: Record<string, string> = {
    'math-numbers-expressions-n06': 'n06-15',
    'math-numbers-expressions-n08': 'n08-10',
  }
  const r5Changed = r5Revision3Changed[unit.unitId]
  if (r5Changed && unit.revision === 3 && progress.unitId === unit.unitId
    && (progress.unitRevision === 1 || progress.unitRevision === 2)) {
    const fromV2 = progress.unitRevision === 1
      ? effectiveTextbookProgress({ ...unit, revision: 2 }, progress)
      : progress
    if (!fromV2 || fromV2.unitRevision !== 2) return undefined
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 2,
      startedAt: fromV2.startedAt,
      updatedAt: fromV2.updatedAt,
      answers: { ...fromV2.answers },
      ...(fromV2.completedAt !== undefined ? { completedAt: fromV2.completedAt } : {}),
      ...(fromV2.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV2.previousRevisionCompletedAt } : {}),
      ...(fromV2.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV2.migratedFromRevision } : {}),
    }
    const answers = { ...fromV2.answers }
    delete answers[r5Changed]
    return {
      unitId: unit.unitId,
      unitRevision: 3,
      startedAt: fromV2.startedAt,
      updatedAt: fromV2.updatedAt,
      answers,
      migratedFromRevision: 2,
      archivedRevisions: { ...(fromV2.archivedRevisions ?? {}), '2': oldArchive },
      ...(fromV2.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV2.completedAt }
        : fromV2.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV2.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-023/P-002 Stage B: the old n13-08 used to grade a combined
  // branch + two roots expression. Archive original v3 history, retain all
  // accepted Q05 answers, and reopen ONLY re-keyed n13-08 at revision4.
  if (unit.unitId === 'math-numbers-expressions-n13' && unit.revision === 4
    && progress.unitId === unit.unitId
    && [1, 2, 3].includes(progress.unitRevision)) {
    const fromV3 = progress.unitRevision === 3 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 3 }, progress)
    if (!fromV3 || fromV3.unitRevision !== 3) return undefined
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 3, startedAt: fromV3.startedAt, updatedAt: fromV3.updatedAt,
      answers: { ...fromV3.answers },
      ...(fromV3.completedAt !== undefined ? { completedAt: fromV3.completedAt } : {}),
      ...(fromV3.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV3.previousRevisionCompletedAt } : {}),
      ...(fromV3.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV3.migratedFromRevision } : {}),
    }
    const answers = { ...fromV3.answers }
    delete answers['n13-08']
    return {
      unitId: unit.unitId, unitRevision: 4,
      startedAt: fromV3.startedAt, updatedAt: fromV3.updatedAt,
      answers, migratedFromRevision: 3,
      archivedRevisions: { ...(fromV3.archivedRevisions ?? {}), '3': oldArchive },
      ...(fromV3.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV3.completedAt }
        : fromV3.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV3.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-023/P-002 Stage A: old N13 Q05 bundled two case expressions.
  // Preserve original R5 v1→v2 migration, archive v2, reopen ONLY old Q05.
  // Q08 bundled answer is intentionally NOT changed before Q05 Gate①.
  if (unit.unitId === 'math-numbers-expressions-n13' && unit.revision === 3
    && progress.unitId === unit.unitId && (progress.unitRevision === 1 || progress.unitRevision === 2)) {
    const fromV2 = progress.unitRevision === 2 ? progress
      : effectiveTextbookProgress({ ...unit, revision: 2 }, progress)
    if (!fromV2 || fromV2.unitRevision !== 2) return undefined
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 2, startedAt: fromV2.startedAt, updatedAt: fromV2.updatedAt,
      answers: { ...fromV2.answers },
      ...(fromV2.completedAt !== undefined ? { completedAt: fromV2.completedAt } : {}),
      ...(fromV2.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: fromV2.previousRevisionCompletedAt } : {}),
      ...(fromV2.migratedFromRevision !== undefined
        ? { migratedFromRevision: fromV2.migratedFromRevision } : {}),
    }
    const answers = { ...fromV2.answers }
    delete answers['n13-05']
    return {
      unitId: unit.unitId, unitRevision: 3,
      startedAt: fromV2.startedAt, updatedAt: fromV2.updatedAt,
      answers, migratedFromRevision: 2,
      archivedRevisions: { ...(fromV2.archivedRevisions ?? {}), '2': oldArchive },
      ...(fromV2.completedAt !== undefined
        ? { previousRevisionCompletedAt: fromV2.completedAt }
        : fromV2.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: fromV2.previousRevisionCompletedAt } : {}),
    }
  }

  // R5 N13 was originally review v1. Its new two-part response must be
  // answered afresh, without deleting any previous evidence or other answers.
  if (unit.unitId === 'math-numbers-expressions-n13' && unit.revision === 2
    && progress.unitId === unit.unitId && progress.unitRevision === 1) {
    const oldArchive: TextbookRevisionArchive = {
      unitRevision: 1,
      startedAt: progress.startedAt,
      updatedAt: progress.updatedAt,
      answers: { ...progress.answers },
      ...(progress.completedAt !== undefined ? { completedAt: progress.completedAt } : {}),
      ...(progress.previousRevisionCompletedAt !== undefined
        ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}),
      ...(progress.migratedFromRevision !== undefined
        ? { migratedFromRevision: progress.migratedFromRevision } : {}),
    }
    const answers = { ...progress.answers }
    delete answers['n13-08']
    return {
      unitId: unit.unitId,
      unitRevision: 2,
      startedAt: progress.startedAt,
      updatedAt: progress.updatedAt,
      answers,
      migratedFromRevision: 1,
      archivedRevisions: { ...(progress.archivedRevisions ?? {}), '1': oldArchive },
      ...(progress.completedAt !== undefined
        ? { previousRevisionCompletedAt: progress.completedAt }
        : progress.previousRevisionCompletedAt !== undefined
          ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}),
    }
  }

  // W-MATH-005/P-002: keep the N01/N03 original answer ledger while
  // the seven new local calculations begin unanswered; N09/N12 use distinct
  // already-released archive-and-restart migrations below.
  if (
    (unit.unitId === 'math-numbers-expressions-n01' || unit.unitId === 'math-numbers-expressions-n03')
    && unit.revision === 2 && progress.unitRevision === 1 && progress.unitId === unit.unitId
  ) {
    return {
      ...progress,
      unitRevision: 2,
      migratedFromRevision: 1,
      ...(progress.completedAt !== undefined ? { previousRevisionCompletedAt: progress.completedAt } : {}),
      completedAt: undefined,
      answers: { ...progress.answers },
    }
  }
  if (unit.unitId === 'math-numbers-expressions-n09' && unit.revision === 2 && progress.unitRevision === 1) {
    return migrateN09ToRevision2(progress)
  }
  if (unit.unitId !== 'math-numbers-expressions-n12') return undefined

  if (unit.revision === 3 && (progress.unitRevision === 1 || progress.unitRevision === 2)) {
    return migrateN12ToRevision3(progress)
  }

  // Historical P-002 behavior is retained for older saved review builds.
  if (unit.revision === 2 && progress.unitRevision === 1) {
    return {
      ...progress,
      unitRevision: 2,
      migratedFromRevision: 1,
      ...(progress.completedAt !== undefined ? { previousRevisionCompletedAt: progress.completedAt } : {}),
      completedAt: undefined,
      answers: { ...progress.answers },
    }
  }
  return undefined
}

/** N12 v3 reset keeps old archived revisions, but clears all v3 active answers. */
export function resetTextbookUnitProgress(unit: TextbookUnit, progress: TextbookUnitProgress | undefined, now: number): TextbookUnitProgress | undefined {
  if (unit.unitId === 'math-quadratic-qf01' && unit.revision === 2) {
    qf01Contract(unit); qf01Need(Number.isFinite(now) && now >= 0)
    const current = progress ? qf01Progress(unit,progress) : {unitId:unit.unitId,unitRevision:2,startedAt:now,updatedAt:now,answers:{}} as TextbookUnitProgress
    const {qf01ResetSnapshots, ...payload} = current
    const entry = {schemaVersion:'qf01-reset-snapshot/1' as const,priorResetCount:qf01ResetSnapshots?.length ?? 0,hadResetSnapshots:Object.hasOwn(current,'qf01ResetSnapshots'),serializedProgressWithoutResetSnapshots:JSON.stringify(payload)}
    const {completedAt, ...rest} = current
    return {...rest,startedAt:now,updatedAt:now,answers:{},qf01ResetSnapshots:[...qf01ResetSnapshots ?? [],entry],...(completedAt !== undefined ? {previousRevisionCompletedAt:completedAt} : {})}
  }
  if (unit.constructionLessonVersion === 'n0910/1' && unit.nestedContract) {
    if (!Number.isFinite(now) || now < 0 || progress && progress.unitId !== unit.unitId) return undefined
    const archivedRevisions = { ...progress?.archivedRevisions }
    if (progress) {
      const { archivedRevisions: previousArchives, ...archive } = progress
      void previousArchives
      archivedRevisions[progress.unitRevision === unit.revision ? unit.revision + '-reset-' + now : String(progress.unitRevision)] = archive
    }
    return { unitId: unit.unitId, unitRevision: unit.revision, startedAt: now, updatedAt: now, answers: {}, nestedResetAt: now,
      nestedProgress: { schemaVersion: 'nested-lesson-progress/1', unitId: unit.unitId, revision: unit.revision, compiledHash: unit.nestedContract.compiledHash, draft: {}, records: {}, parents: {}, processedEventIds: [], startedAt: now, updatedAt: now },
      archivedRevisions, ...(progress?.completedAt !== undefined ? { previousRevisionCompletedAt: progress.completedAt } : progress?.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: progress.previousRevisionCompletedAt } : {}) }
  }
  if (unit.unitId === 'math-numbers-expressions-n08' && [6,7].includes(unit.revision) && progress) {
    const current = effectiveTextbookProgress(unit, progress)
    if (!current) return undefined
    const { archivedRevisions, ...archive } = current
    return { unitId: unit.unitId, unitRevision: unit.revision, startedAt: now, updatedAt: now, answers: {}, constructionProgress: {}, ...(unit.revision===7?{constructionProgressV2:{}}:{}), archivedRevisions: { ...archivedRevisions, [unit.revision+'-reset-' + now]: archive }, ...(current.completedAt !== undefined ? { previousRevisionCompletedAt: current.completedAt } : current.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: current.previousRevisionCompletedAt } : {}) }
  }
  if (unit.unitId !== 'math-numbers-expressions-n12' || unit.revision !== 3 || !progress) return undefined
  const current = effectiveTextbookProgress(unit, progress)
  if (!current) return undefined
  return {
    unitId: unit.unitId,
    unitRevision: 3,
    startedAt: now,
    updatedAt: now,
    answers: {},
    ...(current.archivedRevisions ? { archivedRevisions: current.archivedRevisions } : {}),
    ...(current.migratedFromRevision !== undefined ? { migratedFromRevision: current.migratedFromRevision } : {}),
    ...(current.previousRevisionCompletedAt !== undefined
      ? { previousRevisionCompletedAt: current.previousRevisionCompletedAt } : {}),
  }
}

export function isTextbookItemResolved(item: TextbookItem, record: TextbookAnswerRecord | undefined) {
  if (!record?.resolved) return false
  if (record.isFirstCorrect) return true
  return isTextbookAnswerCorrect(item, record.value)
}

export function answerTextbookItem(progress: TextbookUnitProgress | undefined, unit: TextbookUnit, item: TextbookItem, value: string, now: number): TextbookUnitProgress {
  const isQf01 = unit.unitId === 'math-quadratic-qf01' && unit.revision === 2
  if (isQf01) { qf01Contract(unit); qf01Need(Number.isFinite(now) && now >= 0 && unit.requiredInteractionRefs!.includes(item.id)); const target = unit.sections.flatMap(s => s.items).find(i => i.id === item.id); qf01Need(target && JSON.stringify(target) === JSON.stringify(item)); qf01Need([item.answer,...item.acceptedAnswers,...item.choices ?? []].some(v => normalizeTextbookAnswer(v) === normalizeTextbookAnswer(value))) }
  const currentProgress = effectiveTextbookProgress(unit, progress)
  const previous = currentProgress?.answers[item.id]
  if (isTextbookItemResolved(item, previous)) return isQf01 ? currentProgress! : progress!
  if (isQf01) qf01Need(now >= (previous?.lastAnsweredAt ?? currentProgress?.updatedAt ?? 0))

  const correct = isTextbookAnswerCorrect(item, value)
  const nextRecord: TextbookAnswerRecord = {
    itemId: item.id,
    value,
    firstValue: previous?.firstValue ?? value,
    isFirstCorrect: previous?.isFirstCorrect ?? correct,
    resolved: correct,
    attemptCount: (previous?.attemptCount ?? 0) + 1,
    firstAnsweredAt: previous?.firstAnsweredAt ?? now,
    lastAnsweredAt: now,
  }

  const answers = { ...(currentProgress?.answers ?? {}), [item.id]: nextRecord }
  const allItemIds = unit.sections.flatMap((section) => section.items.map((candidate) => candidate.id))
  const completed = unit.requiredInteractionRefs ? unit.requiredInteractionRefs.every(id => isTextbookInteractionResolved(unit, { ...currentProgress, answers } as TextbookUnitProgress, id)) : allItemIds.every((id) => {
    const candidate = unit.sections.flatMap((section) => section.items).find((item) => item.id === id)
    return Boolean(candidate && isTextbookItemResolved(candidate, answers[id]))
  })

  return {
    unitId: unit.unitId,
    ...(isQf01 && currentProgress ? currentProgress : {}),
    unitRevision: unit.revision,
    startedAt: currentProgress?.startedAt ?? now,
    updatedAt: now,
    answers,
    ...(currentProgress?.constructionProgress ? { constructionProgress: currentProgress.constructionProgress } : {}),
    ...(currentProgress?.constructionProgressV2 ? { constructionProgressV2: currentProgress.constructionProgressV2 } : {}),
    ...(currentProgress?.migratedFromRevision !== undefined ? { migratedFromRevision: currentProgress.migratedFromRevision } : {}),
    ...(currentProgress?.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: currentProgress.previousRevisionCompletedAt } : {}),
    ...(currentProgress?.archivedRevisions ? { archivedRevisions: currentProgress.archivedRevisions } : {}),
    ...(completed ? { completedAt: currentProgress?.completedAt ?? now } : {}),
  }
}

export function textbookSectionProgress(unit: TextbookUnit, progress: TextbookUnitProgress | undefined, sectionId: string) {
  let currentProgress: TextbookUnitProgress | undefined
  try { currentProgress = effectiveTextbookProgress(unit, progress) }
  catch (error) {
    if (unit.unitId !== 'math-quadratic-qf01' || unit.revision !== 2) throw error
    const active = new Set(qf01Grading.map(i => i.id))
    return {completed:0,total:unit.sections.find(s => s.id === sectionId)?.items.filter(i => active.has(i.id)).length ?? 0}
  }
  const section = unit.sections.find((candidate) => candidate.id === sectionId)
  if (!section) return { completed: 0, total: 0 }
  if (unit.requiredInteractionRefs) {
    const ids = [...section.items.map(i => i.id), ...[...unit.constructionItems ?? [], ...unit.constructionItemsV2 ?? []].filter(i => i.sectionId === sectionId || !i.sectionId && unit.sections.length === 1).map(i => i.id), ...(unit.constructionLessonVersion === 'n0910/1' ? unit.nestedContract?.parents.filter(parent => parent.sectionId === sectionId).map(parent => parent.nodeId) ?? [] : [])]
    const activeIds = unit.unitId === 'math-quadratic-qf01' && unit.revision === 2 ? ids.filter(id => unit.requiredInteractionRefs!.includes(id)) : ids
    return { completed: activeIds.filter(id => isTextbookInteractionResolved(unit, currentProgress, id)).length, total: activeIds.length }
  }
  return {
    completed: section.items.filter((item) => isTextbookItemResolved(item, currentProgress?.answers[item.id])).length,
    total: section.items.length,
  }
}

export function textbookUnitProgress(unit: TextbookUnit, progress: TextbookUnitProgress | undefined) {
  let currentProgress: TextbookUnitProgress | undefined
  try { currentProgress = effectiveTextbookProgress(unit, progress) }
  catch (error) {
    // Menu summaries are read-only: keep invalid data durable and let the unit page
    // explain the blocked save. Answer/reset/effective reads still reject writes.
    if (unit.unitId !== 'math-quadratic-qf01' || unit.revision !== 2) throw error
    return {completed:0,total:qf01Grading.length,percent:0}
  }
  if (unit.requiredInteractionRefs) {
    const completed = unit.requiredInteractionRefs.filter(id => isTextbookInteractionResolved(unit, currentProgress, id)).length, total = unit.requiredInteractionRefs.length
    return { completed, total, percent: total ? Math.round(completed / total * 100) : 0 }
  }
  const items = unit.sections.flatMap((section) => section.items)
  const completed = items.filter((item) => isTextbookItemResolved(item, currentProgress?.answers[item.id])).length
  return { completed, total: items.length, percent: items.length ? Math.round((completed / items.length) * 100) : 0 }
}

function resolvedNestedParents(unit: TextbookUnit, progress: TextbookUnitProgress | undefined) {
  const resolved = new Set<string>(), contract = unit.nestedContract, ledger = progress?.nestedProgress
  if (unit.constructionLessonVersion !== 'n0910/1' || !contract || !progress || progress.unitId !== unit.unitId || progress.unitRevision !== unit.revision || !ledger || ledger.schemaVersion !== 'nested-lesson-progress/1' || ledger.unitId !== unit.unitId || ledger.revision !== unit.revision || ledger.compiledHash !== contract.compiledHash) return resolved
  for (const parent of contract.parents) {
    const record = ledger.parents?.[parent.nodeId]
    if (!record || !Number.isSafeInteger(record.attemptCount) || record.attemptCount < 1 || !parent.parts.length || !parent.parts.every(part => ledger.draft?.[part.id] === part.expected && ledger.records?.[part.id]?.value === part.expected && (progress.nestedResetAt === undefined || ledger.records[part.id].firstSelectedAt >= progress.nestedResetAt))) break
    resolved.add(parent.nodeId)
  }
  return resolved
}

export function isTextbookInteractionResolved(unit: TextbookUnit, progress: TextbookUnitProgress | undefined, id: string): boolean {
  if (unit.constructionLessonVersion === 'n0910/1' && unit.nestedContract?.parents.some(parent => parent.nodeId === id)) return resolvedNestedParents(unit, progress).has(id)
  const v2 = unit.constructionItemsV2?.find(i=>i.id===id)
  if(v2) return isConstructionResolvedV2(v2,progress?.constructionProgressV2?.[id]) && v2.prerequisiteInteractionIds.every(dep=>dep!==id && isTextbookInteractionResolved(unit,progress,dep))
  const construction = unit.constructionItems?.find(i => i.id === id)
  if (construction) return isConstructionResolved(construction, progress?.constructionProgress?.[id])
  const item = unit.sections.flatMap(s => s.items).find(i => i.id === id)
  return Boolean(item && isTextbookItemResolved(item, progress?.answers[id]))
}

export function answerTextbookConstruction(progress: TextbookUnitProgress | undefined, unit: TextbookUnit, parentId: string, partId: string, value: string, eventId: string, now: number): TextbookUnitProgress | undefined {
  const current = effectiveTextbookProgress(unit, progress), interaction = unit.constructionItems?.find(i => i.id === parentId)
  if (!interaction || interaction.prerequisiteInteractionIds.some(id => !isTextbookInteractionResolved(unit, current, id))) return current
  const prior = current?.constructionProgress?.[parentId], record = selectConstructionPart(interaction, prior, partId, value, eventId, now)
  if (!record || record === prior) return current
  const next: TextbookUnitProgress = { ...current, unitId: unit.unitId, unitRevision: unit.revision, startedAt: current?.startedAt ?? now, updatedAt: now, answers: current?.answers ?? {}, constructionProgress: { ...current?.constructionProgress, [parentId]: record } }
  if (unit.requiredInteractionRefs?.every(id => isTextbookInteractionResolved(unit, next, id))) next.completedAt = current?.completedAt ?? now
  else delete next.completedAt
  return next
}


export function groupTextbookUnitsByChapter(units: TextbookUnit[]): TextbookChapterGroup[] {
  const groups = new Map<string, TextbookChapterGroup>()

  units.forEach((unit, index) => {
    const chapter = unit.chapter
    const chapterId = chapter?.chapterId ?? `legacy-${unit.subject}`
    const existing = groups.get(chapterId)
    const group = existing ?? {
      chapterId,
      chapterNumber: chapter?.chapterNumber ?? '',
      chapterTitle: chapter?.chapterTitle ?? '教科書',
      units: [],
    }
    group.units.push(unit)
    if (!existing) groups.set(chapterId, group)

    if (!unit.chapter) {
      group.units.sort((left, right) => units.indexOf(left) - units.indexOf(right))
      return
    }

    group.units.sort((left, right) => {
      const leftOrder = left.chapter?.orderInChapter ?? index + 1
      const rightOrder = right.chapter?.orderInChapter ?? index + 1
      return leftOrder - rightOrder
    })
  })

  return [...groups.values()].sort((left, right) =>
    left.chapterNumber.localeCompare(right.chapterNumber, undefined, { numeric: true }),
  )
}

/** New-version bridge; old construction and legacy signatures remain unchanged. */
export function answerTextbookConstructionV2(progress:TextbookUnitProgress|undefined,unit:TextbookUnit,parentId:string,partId:string,choiceId:string,eventId:string,now:number):TextbookUnitProgress|undefined {
  const current=effectiveTextbookProgress(unit,progress), interaction=unit.constructionItemsV2?.find(i=>i.id===parentId)
  if(!interaction || interaction.prerequisiteInteractionIds.some(id=>!isTextbookInteractionResolved(unit,current,id))) return current
  const prior=current?.constructionProgressV2?.[parentId],record=selectConstructionPartV2(interaction,prior,partId,choiceId,eventId,now)
  if(!record || record===prior)return current
  const next:TextbookUnitProgress={...current,unitId:unit.unitId,unitRevision:unit.revision,startedAt:current?.startedAt??now,updatedAt:now,answers:current?.answers??{},constructionProgressV2:{...current?.constructionProgressV2,[parentId]:record}}
  if(unit.requiredInteractionRefs?.every(id=>isTextbookInteractionResolved(unit,next,id)))next.completedAt=current?.completedAt??now
  else delete next.completedAt
  return next
}
