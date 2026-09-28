import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from './textbookUnits'

function chapter1FigurePaths() {
  const paths = builtInTextbookUnits.flatMap((unit) =>
    unit.sections.flatMap((section) => section.figures.map((figure) => figure.src)),
  )
  return [...new Set(paths)].sort()
}

describe('Chapter 1 textbook figure assets', () => {
  it('keeps exactly seventeen unique source figures', () => {
    expect(chapter1FigurePaths()).toHaveLength(17)
  })

  it('stores every WebP as a complete RIFF payload', () => {
    for (const publicPath of chapter1FigurePaths()) {
      const path = resolve(process.cwd(), 'public', publicPath.replace(/^\/assets\//, 'assets/'))
      const bytes = readFileSync(path)

      expect(bytes.subarray(0, 4).toString('ascii'), publicPath).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString('ascii'), publicPath).toBe('WEBP')

      const declaredSize = bytes.readUInt32LE(4) + 8
      expect(
        declaredSize,
        `${publicPath} declares ${declaredSize} bytes but stores ${bytes.length}`,
      ).toBe(bytes.length)
      expect(bytes.length, publicPath).toBeGreaterThan(20_000)
    }
  })
})
