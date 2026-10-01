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

const approvedEducationalChapter1FigurePaths = [
  '/assets/physics/textbook/ch01/1d/vt-area-derivation.webp',
].sort()

function chapter1FigurePaths() {
  const paths = builtInTextbookUnits.flatMap((unit) =>
    unit.sections.flatMap((section) => section.figures.map((figure) => figure.src)),
  )
  return [...new Set(paths)].sort()
}

function webpDimensions(bytes: Buffer) {
  const chunk = bytes.subarray(12, 16).toString('ascii')

  if (chunk === 'VP8X') {
    return {
      width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16),
      height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16),
    }
  }

  if (chunk === 'VP8L') {
    const b1 = bytes[21]
    const b2 = bytes[22]
    const b3 = bytes[23]
    const b4 = bytes[24]
    return {
      width: 1 + (((b2 & 0x3f) << 8) | b1),
      height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)),
    }
  }

  if (chunk === 'VP8 ') {
    for (let index = 20; index < Math.min(bytes.length - 7, 120); index += 1) {
      if (bytes[index] === 0x9d && bytes[index + 1] === 0x01 && bytes[index + 2] === 0x2a) {
        return {
          width: (bytes[index + 3] | (bytes[index + 4] << 8)) & 0x3fff,
          height: (bytes[index + 5] | (bytes[index + 6] << 8)) & 0x3fff,
        }
      }
    }
  }

  throw new Error('Could not read WebP dimensions')
}

describe('Chapter 1 textbook figure assets', () => {
  it('keeps the 17 canonical Library-derived figures and only the explicitly approved educational add-on', () => {
    const live = chapter1FigurePaths()
    expect(live.filter((path) => canonicalChapter1FigurePaths.includes(path))).toEqual(canonicalChapter1FigurePaths)
    expect(live.filter((path) => approvedEducationalChapter1FigurePaths.includes(path))).toEqual(approvedEducationalChapter1FigurePaths)
    expect(live).toHaveLength(canonicalChapter1FigurePaths.length + approvedEducationalChapter1FigurePaths.length)
  })

  it('keeps every referenced Chapter-1 figure asset present, readable, and structurally valid', () => {
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
      expect(bytes.length, publicPath).toBeGreaterThan(5_000)
      const dimensions = webpDimensions(bytes)
      expect(dimensions.width, publicPath).toBeGreaterThanOrEqual(1_000)
      expect(dimensions.height, publicPath).toBeGreaterThanOrEqual(700)
    }
  })

  it('forbids unauthorized figure replacements while allowing the one approved 1D educational directive', () => {
    const sourcePath = resolve(
      process.cwd(),
      'docs/physics-ch01/prototypes/CH1_LEARNING_TEXT_V2_2_FORMULA_HOLES.md',
    )
    const source = readFileSync(sourcePath, 'utf8')
    expect(source).not.toMatch(/source="generated-/)

    const educational = [...source.matchAll(/^:::figure id="edu-1d-vt-area" source="educational-user-approved-2026-10-02" app_asset="public\/assets\/physics\/textbook\/ch01\/1d\/vt-area-derivation\.webp"/gm)]
    expect(educational).toHaveLength(1)

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
