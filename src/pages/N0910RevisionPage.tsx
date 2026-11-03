import n09PreviousR9 from '../data/textbook/math/numbers/n09ConstructionCompiledR9.json'
import n10PreviousR5 from '../data/textbook/math/numbers/n10ConstructionCompiledR5.json'
import n09PreviousR8 from '../data/textbook/math/numbers/n09ConstructionCompiledR8.json'
import n09PreviousR7 from '../data/textbook/math/numbers/n09ConstructionCompiledR7.json'
import n10PreviousR4 from '../data/textbook/math/numbers/n10ConstructionCompiledR4.json'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import n10Previous from '../data/textbook/math/numbers/n10ConstructionCompiledR3.json'
import n10Pilot from '../data/textbook/math/numbers/n10ConstructionCompiledPilotR4.json'
import n09PreviousR6 from '../data/textbook/math/numbers/n09ConstructionCompiledR6.json'
import n09PreviousR5 from '../data/textbook/math/numbers/n09ConstructionCompiledR5.json'
import n09Previous from '../data/textbook/math/numbers/n09ConstructionCompiledR4.json'
import n09Compiled from '../data/textbook/math/numbers/n09ConstructionCompiled.json'
import n10Compiled from '../data/textbook/math/numbers/n10ConstructionCompiled.json'
import candidatePins from '../data/textbook/math/numbers/n0910CandidatePins.json'
import oldN10Raw from '../data/textbook/math/numbers/n10Authored.json?raw'
import designRaw from '../../work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json?raw'
import migrationRaw from '../../work/items/W-MATH-043-n0910-restart/evidence/migration-analysis.json?raw'
import { ConstructionLessonReadingFlow } from '../components/textbook/ConstructionLessonReadingFlow'
import { nestedLessonFromCompiled, validateCompiledNestedLesson, type CompiledNestedLesson } from '../domain/compiledNestedLesson'
import { answerNestedPart, nestedStorageKey, legacyNestedStorageKey, resetNestedLedger, projectNestedLesson } from '../domain/nestedLesson'
import { parseSavedNestedLesson, savedNestedLessonFromMain, type SavedNestedLesson as Saved } from '../domain/nestedLessonStorage'
import { migrateReviewedNestedProgress, REVIEWED_N10_MIGRATION, migrateNativeRevisionLedger, activateRetainedNativeRecords } from '../domain/nestedMigration'
import { useAppStore } from '../stores/useAppStore'
import { mathNumbersN09Unit, n09Presentation } from '../data/textbook/math/numbers/n09Lesson'
import { mathNumbersN10Unit, n10Presentation } from '../data/textbook/math/numbers/n10Lesson'
import { effectiveTextbookProgress, type TextbookUnitProgress } from '../domain/textbook'
import { validateTextbookUnits } from '../domain/textbookSchema'
import { mathTextbookNextUnitId } from '../data/textbook/math'

const registry = { n09: n09Compiled, n10: n10Compiled } as unknown as Record<'n09' | 'n10', CompiledNestedLesson>
const migrationSources = { n09: [n09PreviousR9, n09PreviousR8, n09PreviousR7, n09PreviousR6, n09PreviousR5, n09Previous], n10: [n10PreviousR5, n10PreviousR4, n10Pilot, n10Previous] } as unknown as Record<'n09' | 'n10', CompiledNestedLesson[]>
const activeUnits = { n09: mathNumbersN09Unit, n10: mathNumbersN10Unit }
const legacyUnits = { n09: validateTextbookUnits([n09Presentation.unit])[0], n10: validateTextbookUnits([n10Presentation.unit])[0] }
function readSaved(key: string, compiled: CompiledNestedLesson): Saved | undefined {
  const lesson = nestedLessonFromCompiled(compiled), legacyKey = legacyNestedStorageKey(lesson)
  const raw = localStorage.getItem(key) ?? (legacyKey ? localStorage.getItem(legacyKey) : null)
  if (!raw) return undefined
  return parseSavedNestedLesson(raw, nestedLessonFromCompiled(compiled))
}
async function validateFigures(compiled: CompiledNestedLesson) {
  for (const extra of compiled.nodeDesign.flatMap(n => n.displayExtras ?? [])) if (extra.kind === 'figure') {
    const response = await fetch(import.meta.env.BASE_URL + extra.src.replace(/^\//, ''))
    if (!response.ok) throw Error('NESTED_FIGURE_UNAVAILABLE')
    const bytes = await response.arrayBuffer(), hash = await crypto.subtle.digest('SHA-256', bytes)
    if ([...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('') !== extra.sha256) throw Error('NESTED_FIGURE_CHANGED')
  }
}

/** Existing application route; staged new revision with its own ledger. */
export function N0910RevisionPage({ code, embedded = false }: { code: 'n09' | 'n10'; embedded?: boolean }) {
  const compiled = registry[code], lesson = nestedLessonFromCompiled(compiled), key = nestedStorageKey(lesson)
  const [saved, setSaved] = useState<Saved>(), current = useRef<Saved | undefined>(undefined)
  const [ready, setReady] = useState(false), [error, setError] = useState('')
  const generation = useRef(0)
  const oldProgress = (raw: unknown) => {
    const p = raw as TextbookUnitProgress | undefined
    if (!p || p.unitId !== compiled.unitId || !p.answers || typeof p.answers !== 'object' || Array.isArray(p.answers) || !Number.isInteger(p.unitRevision) || p.unitRevision > compiled.fromRevision) return undefined
    try { return effectiveTextbookProgress(legacyUnits[code], p) } catch { return undefined }
  }
  const commit = (next: Saved) => {
    localStorage.setItem(key, JSON.stringify(next)); current.current = next; setSaved(next)
    useAppStore.getState().syncNestedTextbook(activeUnits[code], next.ledger, next.resetAt, oldProgress(next.archive))
  }
  const migrate = async (state: Saved) => {
    if (state.nativeRevisionImport) return { ...state, ledger: activateRetainedNativeRecords(lesson, state.ledger, state.nativeRevisionImport.eligiblePartIds) }
    if (code === 'n10' && compiled.toRevision >= 4) return state
    if (code !== 'n10' || state.archive === undefined) return state
    const result = await migrateReviewedNestedProgress({ lesson, oldProgress: oldProgress(state.archive), oldSourceJson: oldN10Raw, designJson: designRaw, analysisJson: migrationRaw,
      compiledBinding: { compiledHash: compiled.compiledHash, ...REVIEWED_N10_MIGRATION }, ledger: state.ledger, resetAt: state.resetAt, now: Date.now() })
    // Invalid old records remain archived. They do not prevent new native work.
    return { ...state, ledger: result.status === 'BLOCKED' ? state.ledger : result.ledger, pendingImportedRecords: result.pendingImportedRecords, migrationReceipt: result.receipt, migrationStatus: result.status, migrationBlockedReasons: result.blockedReasons }
  }
  useEffect(() => {
    const token = ++generation.current
    setReady(false); setError('')
    void (async () => {
      await validateCompiledNestedLesson(compiled, candidatePins[code]); await validateFigures(compiled)
      if (activeUnits[code].nestedContract?.compiledHash !== compiled.compiledHash) throw Error('NESTED_CATALOG_COMPILED_MISMATCH')
      const sectionId = legacyUnits[code].sections[0].id
      const expectedParents = compiled.nodeDesign.filter(n => n.parts.length).map(n => ({ nodeId: n.nodeId, sectionId, parts: n.parts.map(p => ({ id: p.id, expected: p.expected })) }))
      if (activeUnits[code].revision !== compiled.toRevision || activeUnits[code].title !== compiled.title || JSON.stringify(activeUnits[code].nestedContract?.parents) !== JSON.stringify(expectedParents)) throw Error('NESTED_CATALOG_GRADING_MISMATCH')
      const main = useAppStore.getState().textbookProgress[compiled.unitId]
      const dedicated = readSaved(key, compiled), exactMain = savedNestedLessonFromMain(main, lesson)
      const restored = exactMain && (!dedicated || (exactMain.resetAt ?? -1) > (dedicated.resetAt ?? -1)) ? exactMain : dedicated
      {
        // An unknown newer native artifact must never fall back to an older
        // revision or be silently replaced by an empty current ledger.
        const known = [compiled, ...migrationSources[code]]
        const candidates = [main, ...(!restored ? Object.values(main?.archivedRevisions ?? {}) : [])]
        for (const candidate of candidates) {
          if (!candidate?.nestedProgress) continue
          if (!known.some(c => c.toRevision === candidate.unitRevision && c.compiledHash === candidate.nestedProgress?.compiledHash)) throw Error('NESTED_UNKNOWN_NATIVE_ARTIFACT')
        }
      }
      const archived = main?.unitRevision === compiled.fromRevision || main && main.unitRevision < compiled.fromRevision ? main : main?.archivedRevisions?.[String(compiled.fromRevision)] ? { ...main.archivedRevisions[String(compiled.fromRevision)], unitId: compiled.unitId } : undefined
      let initial: Saved = restored ?? { schemaVersion: 'nested-reader-storage/1', ledger: resetNestedLedger(lesson, Date.now()), archive: structuredClone(archived) }
      if (!restored && initial.resetAt === undefined) {
        for (const previous of migrationSources[code]) {
          const previousLesson = nestedLessonFromCompiled(previous)
          const matchingMain = main?.unitRevision === previous.toRevision && main.nestedProgress?.compiledHash === previous.compiledHash ? main : undefined
          const mainArchive = main?.archivedRevisions?.[String(previous.toRevision)]
          const matchingArchive = mainArchive?.nestedProgress?.compiledHash === previous.compiledHash ? mainArchive : undefined
          const oldMain = matchingMain ?? matchingArchive
          let native = readSaved(nestedStorageKey(previousLesson), previous)
          const nativeMain = savedNestedLessonFromMain(oldMain ? { ...oldMain, unitId: compiled.unitId } : undefined, previousLesson)
          // A newer exact main-store reset owns the source even if an older
          // dedicated key still contains solved answers. Do not revive them.
          if (nativeMain && (!native || (nativeMain.resetAt ?? -1) > (native.resetAt ?? -1))) native = nativeMain
          let sourceLedger = native?.ledger
          // The seven reviewed authored-r2 answers are first projected into the
          // exact reviewed r3 snapshot, then retained like any native answers.
          if (!sourceLedger && code === 'n10' && previous.toRevision === 3 && initial.archive !== undefined) {
            const reviewedDesign = JSON.parse(designRaw).priorReviewedDesignRaw
            const legacy = await migrateReviewedNestedProgress({ lesson: previousLesson, oldProgress: oldProgress(initial.archive), oldSourceJson: oldN10Raw, designJson: reviewedDesign,
              analysisJson: migrationRaw, compiledBinding: { compiledHash: previous.compiledHash, ...REVIEWED_N10_MIGRATION }, now: Date.now() })
            if (legacy.status !== 'BLOCKED') {
              sourceLedger = legacy.ledger
              for (const pending of Object.values(legacy.pendingImportedRecords)) {
                const record = pending.record
                sourceLedger.records[pending.partId] = record
                sourceLedger.parents[pending.nodeId] = { attemptCount: record.selectionCount, isFirstCorrect: pending.isFirstCorrect,
                  firstSubmittedValues: { [pending.partId]: record.firstValue }, firstSubmittedAt: record.firstSelectedAt, lastSubmittedAt: record.lastSelectedAt }
              }
            }
          }
          if (!sourceLedger) continue
          // Each reviewed edge owns its exact source/target artifact. Older
          // answers travel r4→r5→r6→r7→r8 without treating an intermediate AUTO
          // result as a newly answered question.
          let sourceLesson = previousLesson
          if (code === 'n10' && previous.compiledHash === n10Pilot.compiledHash) {
            const fullR4 = nestedLessonFromCompiled(n10PreviousR4 as unknown as CompiledNestedLesson)
            sourceLedger = migrateNativeRevisionLedger({ source: sourceLesson, target: fullR4, sourceLedger, now: Date.now() }).ledger
            sourceLesson = fullR4
          }
          const intermediates = code === 'n09' ? [n09PreviousR5, n09PreviousR6, n09PreviousR7, n09PreviousR8, n09PreviousR9] as unknown as CompiledNestedLesson[] : [n10PreviousR4, n10PreviousR5] as unknown as CompiledNestedLesson[]
          for (const snapshot of intermediates.filter(c => c.toRevision > sourceLesson.toRevision && c.toRevision < lesson.toRevision)) {
            const target = nestedLessonFromCompiled(snapshot)
            sourceLedger = migrateNativeRevisionLedger({ source: sourceLesson, target, sourceLedger, now: Date.now() }).ledger
            sourceLesson = target
          }
          const imported = migrateNativeRevisionLedger({ source: sourceLesson, target: lesson, sourceLedger, now: Date.now() })
          initial = { ...initial, ledger: imported.ledger, archive: native?.archive ?? initial.archive,
            nativeRevisionImport: { sourceCompiledHash: imported.sourceCompiledHash, eligiblePartIds: imported.eligiblePartIds }, ...(native?.resetAt !== undefined ? { resetAt: native.resetAt } : {}) }
          // An existing latest source, including a deliberate empty reset,
          // owns the migration. Never refill it from an older revision.
          break
        }
      }
      const migrated = await migrate(initial)
      if (token !== generation.current) return
      commit(migrated); setReady(true)
    })().catch(() => { if (token === generation.current) setError('教材または学習記録を読み込めません。既存の記録は変更していません。') })
    // This is a generation counter, not a DOM ref whose current node can change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { generation.current++ }
    // Exact compiled artifact owns the entire page lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, compiled, key])
  const answer = (partId: string, value: string) => {
    if (!ready || !current.current) return
    const nextLedger = answerNestedPart(lesson, current.current.ledger, partId, value, crypto.randomUUID(), Date.now())
    if (!nextLedger) return
    const next = { ...current.current, ledger: nextLedger }, token = ++generation.current
    commit(next)
    void migrate(next).then(migrated => { if (token === generation.current) commit(migrated) }).catch(() => { /* Native answer is already saved; old archive stays intact. */ })
  }
  const nextUnit = mathTextbookNextUnitId(compiled.unitId)
  return <article className="textbook-unit-page" data-testid="n0910-revision-page" data-unit-id={compiled.unitId} data-revision={compiled.toRevision} data-compiled-hash={compiled.compiledHash}>
    {!embedded && <p><Link to={'/learning/textbook/' + compiled.unitId}>現在の教材へ戻る</Link></p>}
    <details className="construction-lesson-version-links"><summary>以前の版と比較する</summary><Link to={'/learning/textbook/' + compiled.unitId + '?version=' + compiled.fromRevision}>以前の版を開く</Link>{compiled.fromRevision !== legacyUnits[code].revision && <Link to={'/learning/textbook/' + compiled.unitId + '?version=' + legacyUnits[code].revision}>元の第{legacyUnits[code].revision}版を開く</Link>}</details>
    {error ? <p role="alert">{error}</p> : ready ? <ConstructionLessonReadingFlow compiled={compiled} ledger={saved?.ledger} onAnswer={answer} onReset={() => undefined} /> : <p role="status">教材を読み込んでいます。</p>}
    {!embedded && ready && nextUnit && projectNestedLesson(lesson, saved?.ledger).completed && <Link className="raised-link" to={'/learning/textbook/' + nextUnit}>次の教材へ進む</Link>}
  </article>
}
