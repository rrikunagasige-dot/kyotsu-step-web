import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { answerTextbookItem, isTextbookItemResolved, type TextbookUnitProgress } from '../domain/textbook'
import type { TextbookItem, TextbookUnit } from '../domain/textbookSchema'
import { textbookRepository } from '../repositories/textbookRepository'
import { TextbookReadingFlow } from '../pages/TextbookUnitPage'
import { extractReviewSection, reviewTargets } from './reviewTargets'
import './review.css'

/** Intentionally ephemeral: review attempts never reach Zustand or localStorage. */
export function ReviewTextbookPage() {
  const { targetId = '' } = useParams()
  const target = reviewTargets[targetId]
  const [unit, setUnit] = useState<TextbookUnit | null | undefined>(undefined)
  const [reviewProgress, setReviewProgress] = useState<TextbookUnitProgress | undefined>()
  const reviewSection = useMemo(() => unit && target ? extractReviewSection(unit, target) : null, [unit, target])

  useEffect(() => {
    if (!target) return
    setUnit(undefined)
    setReviewProgress(undefined)
    let live = true
    textbookRepository.getById(target.unitId).then(result => { if (live) setUnit(result ?? null) })
    return () => { live = false }
  }, [target])

  if (!target) return <div className="state-panel"><h1>確認ページが見つかりません</h1></div>
  if (unit === undefined) return <div className="state-panel"><h1>確認画面を読み込み中…</h1></div>
  if (!unit || !reviewSection) return (
    <div className="state-panel" data-testid="review-preview-mismatch">
      <h1>このプレビューは確認に使えません</h1>
      <p>対象の変更と版が一致していません。公開中の旧版や異なるブランチを、承認対象として見せないために停止しました。</p>
    </div>
  )

  const previewSha = import.meta.env.VITE_PREVIEW_COMMIT || '未設定（確認不可）'
  const resolvedCount = target.itemIds.filter(id => {
    const item = reviewSection.items.find(candidate => candidate.id === id)
    return Boolean(item && isTextbookItemResolved(item, reviewProgress?.answers[id]))
  }).length

  function answer(item: TextbookItem, choice: string) {
    if (!unit) return
    setReviewProgress(previous => answerTextbookItem(previous, unit, item, choice, Date.now()))
  }

  return (
    <div className="page-stack textbook-page review-preview" data-testid="review-preview-ready">
      <div className="review-preview__banner">
        <strong>確認専用プレビュー｜本番の学習記録に保存しません</strong>
        <small data-testid="review-preview-sha">検証対象 commit: {previewSha}</small>
      </div>
      <header className="session-header">
        <div>
          <p className="eyebrow">APP REVIEW / {target.title}</p>
          <h1>{target.question}</h1>
          <p>今回追加された計算穴から、通常の教材と同じ画面・選択肢で順番に試せます。</p>
        </div>
      </header>
      <div className="review-preview__switch">
        <Link to="/review/n01-q07">N01 Q07 を確認</Link>
        <Link to="/review/n03-q10">N03 Q10 を確認</Link>
      </div>
      <p data-testid="review-preview-count">この箇所の進行: {resolvedCount}/{target.itemIds.length}　|　教材 第{unit.revision}版 / 全{target.totalItems}穴</p>
      <TextbookReadingFlow
        key={target.id}
        unit={unit}
        section={reviewSection}
        progress={reviewProgress}
        onReviewAnswer={answer}
      />
      <button className="text-button" type="button" onClick={() => setReviewProgress(undefined)}>この確認だけ最初から</button>
      <p className="review-preview__footnote">確認用の回答はページを閉じると消えます。ほかの単元や正式な学習進捗には影響しません。</p>
    </div>
  )
}
