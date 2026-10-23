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
