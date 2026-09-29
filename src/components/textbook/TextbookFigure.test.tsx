import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { TextbookUnitProgress } from '../../domain/textbook'
import type { TextbookFigure as TextbookFigureData, TextbookItem } from '../../domain/textbookSchema'
import { TextbookFigure } from './TextbookFigure'

const figure: TextbookFigureData = {
  id: 'figure-1',
  src: '/assets/physics/test.webp',
  alt: '位置ベクトルの図',
  caption: '図1',
  overlays: [
    {
      id: 'mask-a-1',
      itemId: 'a-1',
      mode: 'mask',
      x: 20,
      y: 30,
      width: 12,
      height: 8,
      reveal: 'after-answer',
    },
  ],
}

const items: TextbookItem[] = [
  {
    id: 'a-1',
    label: 'A-1',
    prompt: '図中のベクトルを答えよ。',
    answer: 'r₁',
    acceptedAnswers: [],
    answerType: 'formula',
    choices: ['r₁', 'r₂', 'Δr'],
    scaffoldLevel: 'strong',
    hints: ['図の始点と終点を見る。', '原点から位置へ向かう矢印を考える。'],
  },
]

describe('TextbookFigure', () => {
  it('renders an unresolved figure overlay as an interactive mask', () => {
    const html = renderToStaticMarkup(
      <TextbookFigure figure={figure} items={items} progress={undefined} onOpen={vi.fn()} />,
    )

    expect(html).toContain('textbook-figure-overlay--mask')
    expect(html).toContain('data-testid="textbook-figure-overlay-mask-a-1"')
    expect(html).toContain('left:20%')
    expect(html).toContain('top:30%')
  })

  it('reveals the source figure after the referenced item is resolved', () => {
    const progress: TextbookUnitProgress = {
      unitId: 'physics-1a-test',
      unitRevision: 1,
      startedAt: 1,
      updatedAt: 2,
      answers: {
        'a-1': {
          itemId: 'a-1',
          value: 'r₁',
          firstValue: 'r₁',
          isFirstCorrect: true,
          resolved: true,
          attemptCount: 1,
          firstAnsweredAt: 1,
          lastAnsweredAt: 2,
        },
      },
    }

    const html = renderToStaticMarkup(
      <TextbookFigure figure={figure} items={items} progress={progress} onOpen={vi.fn()} />,
    )

    expect(html).not.toContain('textbook-figure-overlay--mask')
    expect(html).toContain('位置ベクトルの図')
  })
})
