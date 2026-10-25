import type { SolutionReading } from '../../domain/solutionReading'

type Plot = NonNullable<SolutionReading['problems'][number]['plot']>
/** Geometry comes from the same checked function AST, not hand-authored coordinates. */
export function SolutionQuadraticPlot({ plot }: { plot: Plot }) {
  const xs = plot.points.map(p => p[0]), ys = plot.points.map(p => p[1])
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.min(0, ...ys) - 1, maxY = Math.max(...ys) + 1
  const X = (x: number) => 35 + (x - minX) * 285 / (maxX - minX || 1)
  const Y = (y: number) => 205 - (y - minY) * 180 / (maxY - minY || 1)
  const path = (points: [number, number][]) => points.map((p, i) => `${i ? 'L' : 'M'}${X(p[0])},${Y(p[1])}`).join(' ')
  const first = plot.domainPoints[0], last = plot.domainPoints[plot.domainPoints.length - 1]
  return <figure className="solution-plot" data-figure-id={plot.id}>
    <svg viewBox="0 0 350 235" role="img" aria-label={plot.alt}>
      <line x1="30" x2="325" y1={Y(0)} y2={Y(0)} stroke="#6b7479" />
      <line x1={X(0)} x2={X(0)} y1="20" y2="210" stroke="#6b7479" />
      <path d={path(plot.points)} fill="none" stroke="#9ca8af" strokeWidth="1.5" />
      <path d={path(plot.domainPoints)} fill="none" stroke="#162e40" strokeWidth="3" />
      <line x1={X(plot.vertex[0])} x2={X(plot.vertex[0])} y1="20" y2="210" stroke="#6b7479" strokeDasharray="4 4" />
      {[first, last].map((point, i) => <g key={i}><circle cx={X(point[0])} cy={Y(point[1])} r="4" fill={(i ? plot.upperOpen : plot.lowerOpen) ? 'white' : '#162e40'} stroke="#162e40" /><text x={X(point[0])} y={Y(0) + 18} textAnchor="middle" fontSize="11">{point[0]}</text></g>)}
      <text x="330" y={Y(0) + 4} fontFamily="serif" fontStyle="italic">x</text><text x={X(0) + 5} y="17" fontFamily="serif" fontStyle="italic">y</text>
    </svg><figcaption>{plot.alt}</figcaption>
  </figure>
}
