import previousN10 from '../data/textbook/math/numbers/n10ConstructionCompiledR3.json'
import previousN09R5 from '../data/textbook/math/numbers/n09ConstructionCompiledR5.json'
import previousN09 from '../data/textbook/math/numbers/n09ConstructionCompiledR4.json'
import { ConstructionLessonReadingFlow } from '../components/textbook/ConstructionLessonReadingFlow'
import { nestedLessonFromCompiled, type CompiledNestedLesson } from '../domain/compiledNestedLesson'
import { answerNestedPart, nestedStorageKey, legacyNestedStorageKey } from '../domain/nestedLesson'
import { parseSavedNestedLesson } from '../domain/nestedLessonStorage'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GuidedMathReadingFlow } from '../components/textbook/GuidedMathReadingFlow'
import n09Authored from '../data/textbook/math/numbers/n09Authored.json'
import n10Authored from '../data/textbook/math/numbers/n10Authored.json'
import { validateTextbookUnits } from '../domain/textbookSchema'
import { answerTextbookItem, type TextbookUnitProgress } from '../domain/textbook'
import { useAppStore } from '../stores/useAppStore'
import { nestedStorageScope } from '../domain/nestedLesson'

const originals = {
  n09: { unit: validateTextbookUnits([n09Authored.unit])[0], presentation: n09Authored },
  n10: { unit: validateTextbookUnits([n10Authored.unit])[0], presentation: n10Authored },
}

/** Select exact archived revision data without invoking a migration or making an archive. */
function exactOldProgress(saved: TextbookUnitProgress | undefined, unitId: string, revision: number): TextbookUnitProgress | undefined {
  if (!saved || saved.unitId !== unitId) return undefined
  if (saved.unitRevision === revision) return structuredClone(saved)
  if (saved.unitRevision <= revision) return undefined
  const archive = saved.archivedRevisions?.[String(revision)]
  return archive?.unitRevision === revision ? { ...structuredClone(archive), unitId } : undefined
}

/** React identity resets only this isolated preview when the requested unit changes. */
export function N0910ArchivePage({ code, nativeRevision = false }: { code: 'n09' | 'n10'; nativeRevision?: boolean | number }) {
  return nativeRevision ? <NativeArchive key={code + String(nativeRevision)} code={code} revision={typeof nativeRevision === 'number' ? nativeRevision : undefined} /> : <IsolatedArchive key={code} code={code} />
}

function IsolatedArchive({ code }: { code: 'n09' | 'n10' }) {
  const { unit, presentation } = originals[code]
  const saved = useAppStore(state => state.textbookProgress[unit.unitId])
  const [progress, setProgress] = useState(() => exactOldProgress(saved, unit.unitId, unit.revision))
  return <article className="textbook-unit-page" data-testid="n0910-archive-page" data-unit-id={unit.unitId} data-revision={unit.revision}>
    <header className="state-panel">
      <h1>{code.toUpperCase()} {unit.title} — 以前の第{unit.revision}版</h1>
      <p>以前の教材と記録を比較できます。ここでの試し解答はこの画面内だけに保持し、現在の学習記録を変更しません。</p>
      <Link className="raised-link" to={'/learning/textbook/' + unit.unitId}>現在の{code.toUpperCase()}へ戻る</Link>
    </header>
    {unit.sections.map(section => <GuidedMathReadingFlow key={section.id} unit={unit} section={section} presentation={presentation} progress={progress} storageScope={'archive-review:' + nestedStorageScope()}
      onReviewAnswer={(item, choice) => setProgress(previous => answerTextbookItem(previous, unit, item, choice, Date.now()))} />)}
  </article>
}

export default N0910ArchivePage

function NativeArchive({ code, revision }: { code: 'n09' | 'n10'; revision?: number }) {
  const compiled = (code === 'n09' ? revision === 5 ? previousN09R5 : previousN09 : previousN10) as unknown as CompiledNestedLesson, lesson = nestedLessonFromCompiled(compiled)
  const main = useAppStore(state => state.textbookProgress[compiled.unitId])
  const [ledger, setLedger] = useState(() => {
    const key = nestedStorageKey(lesson), oldKey = legacyNestedStorageKey(lesson)
    const archive = main?.unitRevision === compiled.toRevision ? main : main?.archivedRevisions?.[String(compiled.toRevision)]
    const raw = localStorage.getItem(key) ?? (oldKey ? localStorage.getItem(oldKey) : null) ?? (archive?.nestedProgress ? JSON.stringify({ schemaVersion: 'nested-reader-storage/1', ledger: archive.nestedProgress }) : null)
    try { return raw ? parseSavedNestedLesson(raw, lesson).ledger : undefined } catch { return undefined }
  })
  return <article className="textbook-unit-page" data-testid="n0910-archive-page" data-unit-id={compiled.unitId} data-revision={compiled.toRevision}>
    <header className="state-panel"><h1>以前の第{compiled.toRevision}版</h1><p>試し解答はこの画面だけに保持し、現在と以前の記録を変更しません。</p><Link to={'/learning/textbook/' + compiled.unitId}>現在の教材へ戻る</Link></header>
    <ConstructionLessonReadingFlow compiled={compiled} ledger={ledger} onAnswer={(id, value) => setLedger(old => answerNestedPart(lesson, old, id, value, crypto.randomUUID(), Date.now()))} onReset={() => undefined} />
  </article>
}
