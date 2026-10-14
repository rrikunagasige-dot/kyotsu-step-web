import type { CSSProperties } from 'react'
import { isTextbookItemResolved, type TextbookUnitProgress } from '../../domain/textbook'
import type { TextbookFigure as TextbookFigureData, TextbookItem } from '../../domain/textbookSchema'

function resolveAssetSrc(src: string) {
  if (/^(?:https?:|data:|blob:)/i.test(src)) return src
  // Vite statically replaces the *direct* import.meta.env.BASE_URL expression in production.
  // Optional chaining on import.meta.env prevented reliable GitHub Pages asset prefixes.
  const viteBase = import.meta.env.BASE_URL
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
  // The 11 approved SVG sources have viewBox only, with 640x360 Venn and
  // 720x220 number-line layouts. Explicit <img> dimensions prevent zero-size
  // intrinsic layout on Chromium while the CSS still scales to narrow screens.
  const mathSetSvg = figure.src.startsWith('/assets/math/textbook/sets/') && figure.src.endsWith('.svg')
  const numberLineSvg = mathSetSvg && figure.src.includes('/number-line-')
  return (
    <figure className="reading-figure" data-testid={`textbook-figure-${figure.id}`}>
      <div className={`textbook-figure-stage${mathSetSvg ? ' textbook-figure-stage--math-set-svg' : ''}`}>
        <img src={resolveAssetSrc(figure.src)} alt={figure.alt} width={mathSetSvg ? (numberLineSvg ? 720 : 640) : undefined} height={mathSetSvg ? (numberLineSvg ? 220 : 360) : undefined} />
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
