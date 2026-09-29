import type { CSSProperties } from 'react'
import { isTextbookItemResolved, type TextbookUnitProgress } from '../../domain/textbook'
import type { TextbookFigure as TextbookFigureData, TextbookItem } from '../../domain/textbookSchema'

function resolveAssetSrc(src: string) {
  if (/^(?:https?:|data:|blob:)/i.test(src)) return src
  const viteBase = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  const base = viteBase.endsWith('/') ? viteBase : `${viteBase}/`
  if (src.startsWith(base)) return src
  return `${base}${src.replace(/^\.?\/+/, '')}`
}

type TextbookFigureProps = {
  figure: TextbookFigureData
  items: TextbookItem[]
  progress: TextbookUnitProgress | undefined
  onOpen: (itemId: string) => void
}

export function TextbookFigure({ figure, items, progress, onOpen }: TextbookFigureProps) {
  return (
    <figure className="reading-figure" data-testid={`textbook-figure-${figure.id}`}>
      <div className="textbook-figure-stage">
        <img src={resolveAssetSrc(figure.src)} alt={figure.alt} />
        {figure.overlays.map((overlay) => {
          const item = items.find((candidate) => candidate.id === overlay.itemId)
          const record = progress?.answers[overlay.itemId]
          const revealed = overlay.reveal === 'always' || Boolean(item && isTextbookItemResolved(item, record))
          if (revealed) return null

          const style = {
            left: `${overlay.x}%`,
            top: `${overlay.y}%`,
            width: `${overlay.width}%`,
            height: `${overlay.height}%`,
          } satisfies CSSProperties

          if (overlay.interactive === false) {
            return (
              <span
                key={overlay.id}
                className={`textbook-figure-overlay textbook-figure-overlay--${overlay.mode}`}
                style={style}
                data-testid={`textbook-figure-overlay-${overlay.id}`}
                aria-hidden="true"
              >
                <span aria-hidden="true">?</span>
              </span>
            )
          }

          return (
            <button
              type="button"
              key={overlay.id}
              className={`textbook-figure-overlay textbook-figure-overlay--${overlay.mode}`}
              style={style}
              data-testid={`textbook-figure-overlay-${overlay.id}`}
              aria-label={overlay.ariaLabel ?? item?.prompt ?? item?.label ?? overlay.itemId}
              onClick={() => onOpen(overlay.itemId)}
            >
              <span aria-hidden="true">?</span>
            </button>
          )
        })}
      </div>
      {figure.caption && <figcaption>{figure.caption}</figcaption>}
    </figure>
  )
}
