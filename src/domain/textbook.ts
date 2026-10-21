import type { TextbookItem, TextbookUnit } from './textbookSchema'

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
  completedAt?: number
  /** Prior revision completion is history, never current-version completion. */
  previousRevisionCompletedAt?: number
  migratedFromRevision?: number
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

export function effectiveTextbookProgress(unit: TextbookUnit, progress: TextbookUnitProgress | undefined): TextbookUnitProgress | undefined {
  if (!progress) return undefined
  if (progress.unitRevision === unit.revision) return progress

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
  const currentProgress = effectiveTextbookProgress(unit, progress)
  const previous = currentProgress?.answers[item.id]
  if (isTextbookItemResolved(item, previous)) return progress!

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
  const completed = allItemIds.every((id) => {
    const candidate = unit.sections.flatMap((section) => section.items).find((item) => item.id === id)
    return Boolean(candidate && isTextbookItemResolved(candidate, answers[id]))
  })

  return {
    unitId: unit.unitId,
    unitRevision: unit.revision,
    startedAt: currentProgress?.startedAt ?? now,
    updatedAt: now,
    answers,
    ...(currentProgress?.migratedFromRevision !== undefined ? { migratedFromRevision: currentProgress.migratedFromRevision } : {}),
    ...(currentProgress?.previousRevisionCompletedAt !== undefined ? { previousRevisionCompletedAt: currentProgress.previousRevisionCompletedAt } : {}),
    ...(currentProgress?.archivedRevisions ? { archivedRevisions: currentProgress.archivedRevisions } : {}),
    ...(completed ? { completedAt: currentProgress?.completedAt ?? now } : {}),
  }
}

export function textbookSectionProgress(unit: TextbookUnit, progress: TextbookUnitProgress | undefined, sectionId: string) {
  const currentProgress = effectiveTextbookProgress(unit, progress)
  const section = unit.sections.find((candidate) => candidate.id === sectionId)
  if (!section) return { completed: 0, total: 0 }
  return {
    completed: section.items.filter((item) => isTextbookItemResolved(item, currentProgress?.answers[item.id])).length,
    total: section.items.length,
  }
}

export function textbookUnitProgress(unit: TextbookUnit, progress: TextbookUnitProgress | undefined) {
  const currentProgress = effectiveTextbookProgress(unit, progress)
  const items = unit.sections.flatMap((section) => section.items)
  const completed = items.filter((item) => isTextbookItemResolved(item, currentProgress?.answers[item.id])).length
  return { completed, total: items.length, percent: items.length ? Math.round((completed / items.length) * 100) : 0 }
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
