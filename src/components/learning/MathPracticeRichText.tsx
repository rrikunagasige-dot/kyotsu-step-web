import { Fragment } from 'react'
import { InlineMath } from 'react-katex'
import type { ContentBlock, QuestionAsset } from '../../domain/questionSchema'
import { splitTextbookInlineMath } from '../../domain/textbookMath'
import { ContentRenderer } from '../question/ContentRenderer'

export function MathPracticeInlineText({ value }: { value: string }) {
  const parts = splitTextbookInlineMath(value)

  if (!parts.length) return <>{value}</>

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part.type}-${index}`}>
          {part.type === 'math'
            ? <span className="math-practice-inline-math" data-testid="math-practice-inline-math"><InlineMath math={part.latex} /></span>
            : part.text}
        </Fragment>
      ))}
    </>
  )
}

export function MathPracticeContentRenderer({
  blocks,
  assets = [],
}: {
  blocks: ContentBlock[]
  assets?: QuestionAsset[]
}) {
  return (
    <div className="content-renderer math-practice-content-renderer">
      {blocks.map((block) => {
        if (block.type === 'text') {
          if (block.speaker) {
            return (
              <div key={block.id} className="dialogue-block">
                <strong>{block.speaker}</strong>
                <p><MathPracticeInlineText value={block.text} /></p>
              </div>
            )
          }
          return <p key={block.id}><MathPracticeInlineText value={block.text} /></p>
        }

        return <ContentRenderer key={block.id} blocks={[block]} assets={assets} />
      })}
    </div>
  )
}
