import { existsSync, readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from './textbookUnits'

const canonicalChapter1FigurePaths = [
  '/assets/physics/textbook/ch01/1a/position-vector-displacement.webp',
  '/assets/physics/textbook/ch01/1a/average-instantaneous-velocity.webp',
  '/assets/physics/textbook/ch01/1a/curve-velocity-directions.webp',
  '/assets/physics/textbook/ch01/1a/displacement-components.webp',
  '/assets/physics/textbook/ch01/1b/velocity-composition.webp',
  '/assets/physics/textbook/ch01/1b/velocity-components.webp',
  '/assets/physics/textbook/ch01/1c/relative-velocity-cars.webp',
  '/assets/physics/textbook/ch01/1c/relative-rain-bicycle.webp',
  '/assets/physics/textbook/ch01/1d/acceleration-trajectory.webp',
  '/assets/physics/textbook/ch01/1d/velocity-change-acceleration.webp',
  '/assets/physics/textbook/ch01/1e/horizontal-projectile-strobe.webp',
  '/assets/physics/textbook/ch01/1e/horizontal-projectile-velocity.webp',
  '/assets/physics/textbook/ch01/1f/oblique-projectile-trajectory.webp',
  '/assets/physics/textbook/ch01/1f/oblique-projectile-components.webp',
  '/assets/physics/textbook/ch01/1g/gravity-vs-air-resistance.webp',
  '/assets/physics/textbook/ch01/1g/drag-force-stages.webp',
  '/assets/physics/textbook/ch01/1g/terminal-velocity-graph.webp',
].sort()

function chapter1FigurePaths() {
  const paths = builtInTextbookUnits.flatMap((unit) =>
    unit.sections.flatMap((section) => section.figures.map((figure) => figure.src)),
  )
  return [...new Set(paths)].sort()
}

describe('Chapter 1 textbook figure assets', () => {
  it('uses exactly the 17 canonical Library-derived figures and no synthetic redraws', () => {
    expect(chapter1FigurePaths()).toEqual(canonicalChapter1FigurePaths)
  })

  it('keeps every referenced canonical figure asset present and structurally valid', () => {
    for (const publicPath of chapter1FigurePaths()) {
      const path = resolve(process.cwd(), 'public', publicPath.replace(/^\//, ''))
      expect(existsSync(path), publicPath).toBe(true)

      const bytes = readFileSync(path)
      const extension = extname(path).toLowerCase()
      expect(extension, publicPath).toBe('.webp')
      expect(bytes.subarray(0, 4).toString('ascii'), publicPath).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString('ascii'), publicPath).toBe('WEBP')
      const declaredSize = bytes.readUInt32LE(4) + 8
      expect(declaredSize, publicPath).toBe(bytes.length)
      expect(bytes.length, publicPath).toBeGreaterThan(1_000)
    }
  })

  it('forbids generated figure directives and figure-number references before the figure exists', () => {
    const sourcePath = resolve(
      process.cwd(),
      'docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md',
    )
    const source = readFileSync(sourcePath, 'utf8')
    expect(source).not.toMatch(/source="generated-/)

    const lines = source.split('\n')
    const directiveIds = [...source.matchAll(/^:::figure id="fig-(\d+)"/gm)].map(
      (match) => Number(match[1]),
    )
    expect(directiveIds).toHaveLength(17)
    expect([...new Set(directiveIds)].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 17 }, (_, index) => index + 1),
    )

    for (let figureNumber = 1; figureNumber <= 17; figureNumber += 1) {
      const directiveIndex = lines.findIndex((line) =>
        line.startsWith(`:::figure id="fig-${figureNumber}" `),
      )
      const mentionPattern = new RegExp(`図${figureNumber}(?!\\d)`)
      const firstMentionIndex = lines.findIndex((line) => mentionPattern.test(line))

      expect(directiveIndex, `fig-${figureNumber} directive`).toBeGreaterThanOrEqual(0)
      expect(firstMentionIndex, `図${figureNumber} first mention`).toBeGreaterThan(directiveIndex)
    }
  })
})
