import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { answerTextbookItem, isTextbookItemResolved, type TextbookUnitProgress } from '../domain/textbook'
import type { TextbookItem, TextbookUnit } from '../domain/textbookSchema'
import { textbookRepository } from '../repositories/textbookRepository'
import { TextbookReadingFlow } from '../pages/TextbookUnitPage'
import { activeReviewMarkIds, extractReviewSection, reviewTargets } from './reviewTargets'
import './review.css'

/** Intentionally ephemeral: review attempts never reach Zustand or localStorage. */
export function ReviewTextbookPage() {
  const { targetId = '' } = useParams()
  const target = reviewTargets[targetId]
  const [unit, setUnit] = useState<TextbookUnit | null | undefined>(undefined)
  const [reviewProgress, setReviewProgress] = useState<TextbookUnitProgress | undefined>()
  const reviewSection = useMemo(() => unit && target ? extractReviewSection(unit, target) : null, [unit, target])
  const reviewMarks = useMemo(() => target
    ? Object.fromEntries(activeReviewMarkIds(target).map((id, index) => [id, index + 1]))
    : {}, [target])

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

  const previewSha = import.meta.env.VITE_PREVIEW_COMMIT || ''
  if (!/^[0-9a-f]{40}$/i.test(previewSha)) return (
    <div className="state-panel" data-testid="review-preview-mismatch">
      <h1>このプレビューは確認に使えません</h1>
      <p>検証対象のコミット番号が不明です。誤った版の承認を防ぐため、確認画面を停止しました。</p>
    </div>
  )
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
          <p>黄色の「確認①〜」が付いた計算だけを見てください。教材の操作はいつもと同じです。</p>
          {activeReviewMarkIds(target).length > 0 && (
            <button
              className="review-preview__jump"
              type="button"
              onClick={() => document.querySelector('.review-preview .review-marked-block')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            >
              <span aria-hidden="true">↘</span> 最初の確認箇所へ
            </button>
          )}
        </div>
      </header>
      <div className="review-preview__switch">
        <Link to="/review/n01-q07">N01 Q07 を確認</Link>
        <Link to="/review/n03-q10">N03 Q10 を確認</Link>
        <Link to="/review/n04-q01">N04 Q01 を確認</Link>
      </div>
      <p data-testid="review-preview-count">この箇所の進行: {resolvedCount}/{target.itemIds.length} / 教材 第{unit.revision}版 / 全{target.totalItems}穴</p>
      <TextbookReadingFlow
        key={target.id}
        unit={unit}
        section={reviewSection}
        progress={reviewProgress}
        onReviewAnswer={answer}
        reviewMarks={reviewMarks}
      />
      <button className="text-button" type="button" onClick={() => setReviewProgress(undefined)}>この確認だけ最初から</button>
      <p className="review-preview__footnote">確認したら ChatGPT 側で「OK」か「要修正」を選んでください。ここでの正解・不正解は修正承認にはなりません。確認用の回答はページを閉じると消え、正式な学習記録には残りません。</p>
    </div>
  )
}
