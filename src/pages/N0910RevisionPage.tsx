import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import n09Compiled from '../data/textbook/math/numbers/n09ConstructionCompiled.json'
import n10Compiled from '../data/textbook/math/numbers/n10ConstructionCompiled.json'
import candidatePins from '../data/textbook/math/numbers/n0910CandidatePins.json'
import oldN10Raw from '../data/textbook/math/numbers/n10Authored.json?raw'
import designRaw from '../../work/items/W-MATH-043-n0910-restart/NODE_DESIGN.json?raw'
import migrationRaw from '../../work/items/W-MATH-043-n0910-restart/evidence/migration-analysis.json?raw'
import { ConstructionLessonReadingFlow } from '../components/textbook/ConstructionLessonReadingFlow'
import { nestedLessonFromCompiled, validateCompiledNestedLesson, type CompiledNestedLesson } from '../domain/compiledNestedLesson'
import { answerNestedPart, nestedStorageKey, legacyNestedStorageKey, resetNestedLedger, projectNestedLesson } from '../domain/nestedLesson'
import { parseSavedNestedLesson, type SavedNestedLesson as Saved } from '../domain/nestedLessonStorage'
import { migrateReviewedNestedProgress, REVIEWED_N10_MIGRATION } from '../domain/nestedMigration'
import { useAppStore } from '../stores/useAppStore'
import { mathNumbersN09Unit, n09Presentation } from '../data/textbook/math/numbers/n09Lesson'
import { mathNumbersN10Unit, n10Presentation } from '../data/textbook/math/numbers/n10Lesson'
import { effectiveTextbookProgress, type TextbookUnitProgress } from '../domain/textbook'
import { validateTextbookUnits } from '../domain/textbookSchema'
import { mathTextbookNextUnitId } from '../data/textbook/math'

const registry = { n09: n09Compiled, n10: n10Compiled } as unknown as Record<'n09' | 'n10', CompiledNestedLesson>
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
export function N0910RevisionPage({ code }: { code: 'n09' | 'n10' }) {
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
      const restored = readSaved(key, compiled)
      const main = useAppStore.getState().textbookProgress[compiled.unitId]
      const archived = main?.unitRevision === compiled.fromRevision || main && main.unitRevision < compiled.fromRevision ? main : main?.archivedRevisions?.[String(compiled.fromRevision)] ? { ...main.archivedRevisions[String(compiled.fromRevision)], unitId: compiled.unitId } : undefined
      let initial: Saved = restored ?? { schemaVersion: 'nested-reader-storage/1', ledger: resetNestedLedger(lesson, Date.now()), archive: structuredClone(archived) }
      if (main?.nestedResetAt !== undefined && (initial.resetAt === undefined || main.nestedResetAt > initial.resetAt)) initial = { ...initial, resetAt: main.nestedResetAt, ledger: resetNestedLedger(lesson, Date.now()), pendingImportedRecords: {}, migrationStatus: 'RESET_SUPPRESSED', migrationBlockedReasons: [] }
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
  const reset = () => {
    if (!ready || !current.current) return
    generation.current++
    const now = Date.now()
    commit({ ...current.current, resetAt: now, ledger: resetNestedLedger(lesson, now), pendingImportedRecords: {}, migrationReceipt: undefined, migrationStatus: 'RESET_SUPPRESSED', migrationBlockedReasons: [] })
  }
  const nextUnit = mathTextbookNextUnitId(compiled.unitId)
  return <article className="textbook-unit-page" data-testid="n0910-revision-page" data-unit-id={compiled.unitId} data-revision={compiled.toRevision} data-compiled-hash={compiled.compiledHash}>
    <header className="state-panel"><h1>{code.toUpperCase()} {compiled.title} — 第{compiled.toRevision}版</h1>
      <Link to={'/learning/textbook/' + compiled.unitId + '?version=' + compiled.fromRevision}>以前の版を開く</Link>
    </header>
    {error ? <p role="alert">{error}</p> : ready ? <ConstructionLessonReadingFlow compiled={compiled} ledger={saved?.ledger} onAnswer={answer} onReset={reset} /> : <p role="status">教材を読み込んでいます。</p>}
    {ready && nextUnit && projectNestedLesson(lesson, saved?.ledger).completed && <Link className="raised-link" to={'/learning/textbook/' + nextUnit}>次の教材へ進む</Link>}
  </article>
}
