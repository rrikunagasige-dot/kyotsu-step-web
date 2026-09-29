import { existsSync, readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from './textbookUnits'

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
        continue
      }

      throw new Error(`Unsupported textbook figure format: ${publicPath}`)
    }
  })

  it('does not use the known ultra-compressed 1C/1D/1G WebPs in the live lesson', () => {
    const paths = chapter1FigurePaths().join('\n')
    expect(paths).not.toContain('/1c/relative-velocity-cars.webp')
    expect(paths).not.toContain('/1c/relative-rain-bicycle.webp')
    expect(paths).not.toContain('/1d/acceleration-trajectory.webp')
    expect(paths).not.toContain('/1d/velocity-change-acceleration.webp')
    expect(paths).not.toContain('/1g/gravity-vs-air-resistance.webp')
    expect(paths).not.toContain('/1g/drag-force-stages.webp')
    expect(paths).not.toContain('/1g/terminal-velocity-graph.webp')
  })
})
