import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const assetPaths = [
  'public/assets/math/textbook/propositions/implication-inclusion.svg',
  'public/assets/math/textbook/propositions/implication-counterexample.svg',
  'public/assets/math/textbook/propositions/equal-diagonals-quadrilateral.svg',
]

function readAsset(path: string) {
  const absolutePath = resolve(process.cwd(), path)
  expect(existsSync(absolutePath), path).toBe(true)
  return readFileSync(absolutePath, 'utf8')
}

describe('math textbook proposition figure assets', () => {
  it('keeps every proposition SVG present and structurally valid', () => {
    for (const path of assetPaths) {
      const svg = readAsset(path)
      expect(svg, path).toContain('<svg')
      expect(svg, path).toContain('role="img"')
      expect(svg, path).toContain('<title')
      expect(svg, path).toContain('<desc')
      expect(svg, path).toContain('viewBox=')
    }
  })

  it('keeps the marked counterexample point inside P and outside Q', () => {
    const svg = readAsset(assetPaths[1])
    const p = svg.match(/<ellipse cx="270" cy="185" rx="150" ry="100"/)
    const q = svg.match(/<ellipse cx="400" cy="185" rx="150" ry="100"/)
    const point = svg.match(/<circle cx="175" cy="185" r="8"/)

    expect(p).not.toBeNull()
    expect(q).not.toBeNull()
    expect(point).not.toBeNull()

    const px = 175
    const py = 185
    const inP = ((px - 270) / 150) ** 2 + ((py - 185) / 100) ** 2
    const inQ = ((px - 400) / 150) ** 2 + ((py - 185) / 100) ** 2

    expect(inP).toBeLessThanOrEqual(1)
    expect(inQ).toBeGreaterThan(1)
  })

  it('keeps the equal-diagonals example geometrically exact', () => {
    const svg = readAsset(assetPaths[2])
    expect(svg).toContain('M175 70 L420 295')
    expect(svg).toContain('M340 70 L95 295')

    const ac = Math.hypot(420 - 175, 295 - 70)
    const bd = Math.hypot(95 - 340, 295 - 70)
    expect(ac).toBeCloseTo(bd, 12)
  })
})
