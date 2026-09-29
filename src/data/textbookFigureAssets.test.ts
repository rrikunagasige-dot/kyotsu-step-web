import { existsSync, readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from './textbookUnits'

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

function chapter1FigurePaths() {
  const paths = builtInTextbookUnits.flatMap((unit) =>
    unit.sections.flatMap((section) => section.figures.map((figure) => figure.src)),
  )
  return [...new Set(paths)].sort()
}

describe('Chapter 1 textbook figure assets', () => {
  it('keeps every referenced figure asset unique and present', () => {
    const paths = chapter1FigurePaths()
    expect(paths).toHaveLength(21)
    for (const publicPath of paths) {
      const path = resolve(process.cwd(), 'public', publicPath.replace(/^\//, ''))
      expect(existsSync(path), publicPath).toBe(true)
    }
  })

  it('validates SVG and WebP payloads without assuming one image format', () => {
    for (const publicPath of chapter1FigurePaths()) {
      const path = resolve(process.cwd(), 'public', publicPath.replace(/^\//, ''))
      const bytes = readFileSync(path)
      const extension = extname(path).toLowerCase()

      if (extension === '.svg') {
        expect(bytes.toString('utf8'), publicPath).toContain('<svg')
        continue
      }

      if (extension === '.webp') {
        expect(bytes.subarray(0, 4).toString('ascii'), publicPath).toBe('RIFF')
        expect(bytes.subarray(8, 12).toString('ascii'), publicPath).toBe('WEBP')
        const declaredSize = bytes.readUInt32LE(4) + 8
        expect(declaredSize, publicPath).toBe(bytes.length)
        expect(bytes.length, publicPath).toBeGreaterThan(5_000)
        const dimensions = webpDimensions(bytes)
        expect(dimensions.width, publicPath).toBeGreaterThanOrEqual(1_000)
        expect(dimensions.height, publicPath).toBeGreaterThanOrEqual(700)
        continue
      }

      throw new Error(`Unsupported textbook figure format: ${publicPath}`)
    }
  })

  it('does not use the known ultra-compressed 1C/1D/1G WebPs in the live lesson', () => {
    const paths = chapter1FigurePaths().join('\n')
    expect(paths).not.toContain('/1b/velocity-components.webp')
    expect(paths).not.toContain('/1c/relative-velocity-cars.webp')
    expect(paths).not.toContain('/1c/relative-rain-bicycle.webp')
    expect(paths).not.toContain('/1d/acceleration-trajectory.webp')
    expect(paths).not.toContain('/1d/velocity-change-acceleration.webp')
    expect(paths).not.toContain('/1g/gravity-vs-air-resistance.webp')
    expect(paths).not.toContain('/1g/drag-force-stages.webp')
    expect(paths).not.toContain('/1g/terminal-velocity-graph.webp')
  })
})
