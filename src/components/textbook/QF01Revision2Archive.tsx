import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { GuidedMathReadingFlow } from './GuidedMathReadingFlow'
import { useAppStore } from '../../stores/useAppStore'
import { effectiveTextbookProgress, type TextbookUnitProgress } from '../../domain/textbook'
import { qf01Revision2Unit, qf01Revision2GuidedPresentation, qf01Revision2TransformationPresentation } from '../../data/textbook/math/quadratic/qf01Lesson'

/** The original r2 record is read-only; archive navigation never connects to Store mutations. */
export function QF01Revision2Archive() {
  const saved = useAppStore(state => state.textbookProgress['math-quadratic-qf01'])
  const state = useMemo(() => {
    try {
      let original: TextbookUnitProgress | undefined
      if (saved?.unitRevision === 2) original = saved
      else if (saved?.unitRevision === 3 && saved.qf01Revision2Snapshot) {
        const snapshot = saved.qf01Revision2Snapshot
        if (snapshot.schemaVersion !== 'qf01-revision2-snapshot/1' || snapshot.sourceSHA !== '9e6d6798ac40624373db0a87e53e7d8938fb317a' || typeof snapshot.serializedProgress !== 'string') throw Error('ARCHIVE_SNAPSHOT')
        original = JSON.parse(snapshot.serializedProgress) as TextbookUnitProgress
        if (original.unitId !== qf01Revision2Unit.unitId || original.unitRevision !== 2) throw Error('ARCHIVE_REVISION')
      }
      return { progress: original ? effectiveTextbookProgress(qf01Revision2Unit, original) : undefined, error: false,
        onlyRevision1: saved?.unitRevision === 1 || saved?.unitRevision === 3 && !saved.qf01Revision2Snapshot && Boolean(saved.qf01Revision1Snapshot) }
    } catch { return { progress: undefined, error: true, onlyRevision1: false } }
  }, [saved])
  return <article className="textbook-unit-page" data-testid="qf01-revision2-archive">
    <header className="textbook-unit-heading"><div><h1>以前の教材と記録（第2版）</h1><p>解答とリセットを行わず、保存された記録を読み返せます。</p></div></header>
    <p><Link to="/learning/textbook/math-quadratic-qf01">現在の教材へ戻る</Link></p>
    {state.error ? <p role="alert">以前の保存記録を確認できません。元の記録は変更していません。</p> : <>
      {state.onlyRevision1 ? <p>第1版の記録は保存されています。第2版の解答履歴はありません。</p> : !state.progress ? <p>第2版の解答履歴はありません。</p> : null}
      <GuidedMathReadingFlow unit={qf01Revision2Unit} section={qf01Revision2Unit.sections.find(section => section.id === 'lesson')!} progress={state.progress} presentation={qf01Revision2GuidedPresentation} transformationPresentation={qf01Revision2TransformationPresentation} storageScope="qf01-r2-archive-readonly" readOnlyArchive />
    </>}
  </article>
}
