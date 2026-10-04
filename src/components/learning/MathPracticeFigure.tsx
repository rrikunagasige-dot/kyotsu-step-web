import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/runtime'

type Localize = (ja: string, zh: string) => string
import type { MathPracticeFigureId } from '../../data/mathPractice/figures'

function FigureFrame({ id, title, children }: { id: MathPracticeFigureId; title: string; children: ReactNode }) {
  return (
    <figure className="math-practice-figure" data-testid={`math-practice-figure-${id}`}>
      <div className="math-practice-figure__title">{title}</div>
      <svg viewBox="0 0 360 190" role="img" aria-label={title} className="math-practice-figure__svg">
        {children}
      </svg>
    </figure>
  )
}

function Dot({ x, y, open = false }: { x: number; y: number; open?: boolean }) {
  return <circle cx={x} cy={y} r="5" className={open ? 'mpf-open-dot' : 'mpf-closed-dot'} />
}

function Axis({ ticks, labels = ticks.map(String) }: { ticks: number[]; labels?: string[] }) {
  const left = 34
  const right = 326
  const y = 105
  const min = ticks[0]
  const max = ticks[ticks.length - 1]
  const scale = (value: number) => left + ((value - min) / (max - min)) * (right - left)
  return (
    <>
      <line x1={left} y1={y} x2={right} y2={y} className="mpf-line" />
      <path d={`M ${right} ${y} l -9 -5 v 10 z`} className="mpf-arrow" />
      {ticks.map((tick, index) => (
        <g key={tick}>
          <line x1={scale(tick)} y1={y - 5} x2={scale(tick)} y2={y + 5} className="mpf-line" />
          <text x={scale(tick)} y={y + 22} textAnchor="middle" className="mpf-label">{labels[index]}</text>
        </g>
      ))}
    </>
  )
}

function Interval({
  from,
  to,
  min,
  max,
  y,
  leftOpen = true,
  rightOpen = true,
  label,
}: {
  from: number
  to: number
  min: number
  max: number
  y: number
  leftOpen?: boolean
  rightOpen?: boolean
  label: string
}) {
  const left = 34
  const right = 326
  const scale = (value: number) => left + ((value - min) / (max - min)) * (right - left)
  return (
    <g>
      <text x="18" y={y + 4} textAnchor="middle" className="mpf-label mpf-label--strong">{label}</text>
      <line x1={scale(from)} y1={y} x2={scale(to)} y2={y} className="mpf-emphasis-line" />
      <Dot x={scale(from)} y={y} open={leftOpen} />
      <Dot x={scale(to)} y={y} open={rightOpen} />
    </g>
  )
}

function NumberLineFigure({ id, text }: { id: MathPracticeFigureId; text: Localize }) {

  if (id === 'F99-3') {
    return (
      <FigureFrame id={id} title={text('絶対値条件を2つの枝で見る', '把绝对值条件看成两个分支')}>
        <line x1="34" y1="160" x2="326" y2="160" className="mpf-line" />
        {[-3, 1, 3].map((tick) => {
          const x = tick === -3 ? 82 : tick === 1 ? 190 : 244
          return (
            <g key={tick}>
              <line x1={x} y1="155" x2={x} y2="165" className="mpf-line" />
              <text x={x} y="183" textAnchor="middle" className="mpf-label">{tick}</text>
            </g>
          )
        })}
        <text x="18" y="76" textAnchor="middle" className="mpf-label mpf-label--strong">P</text>
        <line x1="244" y1="72" x2="326" y2="72" className="mpf-emphasis-line" />
        <Dot x={244} y={72} open />
        <path d="M 326 72 l -9 -5 v 10 z" className="mpf-arrow" />
        <text x="18" y="132" textAnchor="middle" className="mpf-label mpf-label--strong">Q</text>
        <line x1="34" y1="128" x2="82" y2="128" className="mpf-emphasis-line" />
        <Dot x={82} y={128} open />
        <path d="M 34 128 l 9 -5 v 10 z" className="mpf-arrow" />
        <line x1="190" y1="128" x2="326" y2="128" className="mpf-emphasis-line" />
        <Dot x={190} y={128} open />
        <path d="M 326 128 l -9 -5 v 10 z" className="mpf-arrow" />
      </FigureFrame>
    )
  }

  if (id === 'F101-1A') {
    return (
      <FigureFrame id={id} title={text('境界 -5 を基準に考える', '以边界 -5 为基准思考')}>
        <Axis ticks={[-8, -5, -2]} />
        <line x1="180" y1="56" x2="180" y2="133" className="mpf-guide-line" />
        <text x="180" y="44" textAnchor="middle" className="mpf-label mpf-label--strong">-5</text>
        <text x="92" y="76" textAnchor="middle" className="mpf-muted">{text('左側', '左侧')}</text>
        <text x="268" y="76" textAnchor="middle" className="mpf-muted">{text('右側', '右侧')}</text>
      </FigureFrame>
    )
  }

  const configs: Partial<Record<MathPracticeFigureId, {
    title: [string, string]
    min: number
    max: number
    ticks: number[]
    intervals: Array<{ from: number; to: number; y: number; leftOpen?: boolean; rightOpen?: boolean; label: string }>
    marker?: { value: number; label: string }
  }>> = {
    'F99-1': {
      title: ['P と Q の範囲を比べる', '比较 P 与 Q 的范围'],
      min: 0, max: 4, ticks: [0, 1, 2, 3, 4],
      intervals: [
        { from: 1, to: 2, y: 72, label: 'P' },
        { from: 1, to: 3, y: 133, label: 'Q' },
      ],
    },
    'F99-2': {
      title: ['P と Q のずれを見る', '观察 P 与 Q 的差异'],
      min: -2, max: 2, ticks: [-2, 0, 1, 2],
      intervals: [
        { from: -2, to: 1, y: 72, label: 'P' },
        { from: 0, to: 1, y: 133, label: 'Q' },
      ],
      marker: { value: 0, label: 'x=0' },
    },
    'F99-4': {
      title: ['端点 -2 に注目する', '关注端点 -2'],
      min: -3, max: 5, ticks: [-2, 0, 2, 4],
      intervals: [
        { from: -2, to: 2, y: 72, leftOpen: false, rightOpen: false, label: 'P' },
        { from: -2, to: 4, y: 133, leftOpen: true, rightOpen: true, label: 'Q' },
      ],
      marker: { value: -2, label: 'x=-2' },
    },
    'F102-1A': {
      title: ['2つの条件を同じ数直線に置く', '把两个条件放在同一数轴上'],
      min: -3, max: 4, ticks: [-2, 0, 2, 3],
      intervals: [
        { from: 0, to: 3, y: 72, label: 'A' },
        { from: -2, to: 2, y: 133, label: 'B' },
      ],
    },
    'F102-2A': {
      title: ['2つの条件を同じ数直線に置く', '把两个条件放在同一数轴上'],
      min: -3, max: 4, ticks: [-2, 0, 2, 3],
      intervals: [
        { from: 0, to: 3, y: 72, label: 'A' },
        { from: -2, to: 2, y: 133, label: 'B' },
      ],
    },
    'F102-3A': {
      title: ['端点を含む2区間を比べる', '比较含端点的两个区间'],
      min: -2, max: 5, ticks: [-1, 0, 2, 4],
      intervals: [
        { from: -1, to: 2, y: 72, leftOpen: false, rightOpen: true, label: 'A' },
        { from: -1, to: 4, y: 133, leftOpen: true, rightOpen: false, label: 'B' },
      ],
    },
    'F102-4A': {
      title: ['端点を含む2区間を比べる', '比较含端点的两个区间'],
      min: -2, max: 5, ticks: [-1, 0, 2, 4],
      intervals: [
        { from: -1, to: 2, y: 72, leftOpen: false, rightOpen: true, label: 'A' },
        { from: -1, to: 4, y: 133, leftOpen: true, rightOpen: false, label: 'B' },
      ],
    },
    'F103-3A': {
      title: ['連続不等式を2条件へ分ける', '把连锁不等式拆成两个条件'],
      min: 3, max: 12, ticks: [5, 8, 10, 12],
      intervals: [
        { from: 5, to: 12, y: 72, leftOpen: true, rightOpen: true, label: 'x>5' },
        { from: 3, to: 10, y: 133, leftOpen: true, rightOpen: false, label: 'x≤10' },
      ],
    },
  }

  const config = configs[id]
  if (!config) return null

  const left = 34
  const right = 326
  const scale = (value: number) => left + ((value - config.min) / (config.max - config.min)) * (right - left)

  return (
    <FigureFrame id={id} title={text(config.title[0], config.title[1])}>
      <line x1={left} y1="163" x2={right} y2="163" className="mpf-line" />
      {config.ticks.map((tick) => (
        <g key={tick}>
          <line x1={scale(tick)} y1="158" x2={scale(tick)} y2="168" className="mpf-line" />
          <text x={scale(tick)} y="184" textAnchor="middle" className="mpf-label">{tick}</text>
        </g>
      ))}
      {config.intervals.map((interval) => (
        <Interval key={interval.label} {...interval} min={config.min} max={config.max} />
      ))}
      {config.marker && (
        <>
          <line x1={scale(config.marker.value)} y1="49" x2={scale(config.marker.value)} y2="151" className="mpf-guide-line" />
          <text x={scale(config.marker.value)} y="38" textAnchor="middle" className="mpf-label mpf-label--strong">{config.marker.label}</text>
        </>
      )}
    </FigureFrame>
  )
}

function TriangleFigure({ id, text }: { id: MathPracticeFigureId; text: Localize }) {

  if (id === 'F98-2A' || id === 'F98-2B') {
    const example = id === 'F98-2B'
    return (
      <FigureFrame id={id} title={text(example ? '二等辺だが3辺は同じとは限らない' : '二等辺三角形の条件を図で確認', example ? '等腰但三边不一定相等' : '用图确认等腰三角形条件')}>
        <path d="M 75 150 L 180 35 L 285 150 Z" className="mpf-shape" />
        <line x1="122" y1="91" x2="133" y2="101" className="mpf-tick" />
        <line x1="227" y1="101" x2="238" y2="91" className="mpf-tick" />
        <text x="112" y="98" className="mpf-label">{example ? '5' : 'a'}</text>
        <text x="244" y="98" className="mpf-label">{example ? '5' : 'a'}</text>
        <text x="180" y="174" textAnchor="middle" className="mpf-label">{example ? '6' : '?'}</text>
      </FigureFrame>
    )
  }

  if (id === 'F107-4A' || id === 'F107-4B') {
    const counter = id === 'F107-4B'
    return (
      <FigureFrame id={id} title={text(counter ? '1つの角が鋭角でも全体は決まらない' : '∠A と三角形全体を分けて見る', counter ? '一个角为锐角也不能决定整体' : '区分∠A与整个三角形')}>
        <path d="M 58 148 L 260 148 L 180 42 Z" className="mpf-shape" />
        <text x="44" y="157" className="mpf-label mpf-label--strong">A</text>
        <text x="270" y="157" className="mpf-label mpf-label--strong">B</text>
        <text x="181" y="31" className="mpf-label mpf-label--strong">C</text>
        {counter ? (
          <>
            <text x="83" y="137" className="mpf-label">60°</text>
            <text x="229" y="137" className="mpf-label">100°</text>
            <text x="176" y="66" className="mpf-label">20°</text>
          </>
        ) : (
          <path d="M 76 148 A 19 19 0 0 1 70 134" className="mpf-angle" />
        )}
      </FigureFrame>
    )
  }

  if (id === 'F107-5C') {
    return (
      <FigureFrame id={id} title={text('2つの枝は「または」で分けて読む', '把两个分支按“或”分开理解')}>
        <rect x="28" y="36" width="132" height="122" rx="10" className="mpf-card" />
        <rect x="200" y="36" width="132" height="122" rx="10" className="mpf-card" />
        <text x="94" y="56" textAnchor="middle" className="mpf-label mpf-label--strong">a=b</text>
        <path d="M 50 136 L 94 78 L 138 136 Z" className="mpf-shape" />
        <line x1="67" y1="112" x2="75" y2="119" className="mpf-tick" />
        <line x1="113" y1="119" x2="121" y2="112" className="mpf-tick" />
        <text x="94" y="151" textAnchor="middle" className="mpf-muted">{text('二等辺', '等腰')}</text>

        <text x="180" y="101" textAnchor="middle" className="mpf-label mpf-label--strong">{text('または', '或')}</text>

        <text x="266" y="56" textAnchor="middle" className="mpf-label mpf-label--strong">a²+b²=c²</text>
        <path d="M 222 136 L 222 78 L 310 136 Z" className="mpf-shape" />
        <path d="M 222 120 L 238 120 L 238 136" className="mpf-angle" />
        <text x="266" y="151" textAnchor="middle" className="mpf-muted">{text('C が直角', 'C 为直角')}</text>
      </FigureFrame>
    )
  }

  if (id.startsWith('F107-5')) {
    const state = id.slice(-1)
    const equilateral = state === 'D'
    const reverse = state === 'E'
    return (
      <FigureFrame id={id} title={text(
        reverse ? '直角の位置を変えた具体例' : equilateral ? 'a=b だけを満たす具体例' : '辺 a,b,c と2つの枝を図で読む',
        reverse ? '改变直角位置的具体例' : equilateral ? '只满足 a=b 的具体例' : '用图读取边 a,b,c 与两个分支',
      )}>
        <path d={reverse ? 'M 78 150 L 78 55 L 250 150 Z' : 'M 72 150 L 180 42 L 288 150 Z'} className="mpf-shape" />
        {reverse ? (
          <>
            <path d="M 78 132 L 96 132 L 96 150" className="mpf-angle" />
            <text x="60" y="158" className="mpf-label mpf-label--strong">A</text>
            <text x="67" y="99" className="mpf-label">c=1</text>
            <text x="164" y="169" className="mpf-label">b=1</text>
            <text x="170" y="93" className="mpf-label">a=√2</text>
          </>
        ) : (
          <>
            <text x="54" y="158" className="mpf-label mpf-label--strong">B</text>
            <text x="294" y="158" className="mpf-label mpf-label--strong">A</text>
            <text x="180" y="30" textAnchor="middle" className="mpf-label mpf-label--strong">C</text>
            <text x="112" y="95" className="mpf-label">a=BC</text>
            <text x="230" y="95" className="mpf-label">b=CA</text>
            <text x="178" y="170" textAnchor="middle" className="mpf-label">c=AB</text>
            {(state === 'B' || state === 'C' || state === 'D') && (
              <>
                <line x1="119" y1="94" x2="130" y2="103" className="mpf-tick" />
                <line x1="230" y1="103" x2="241" y2="94" className="mpf-tick" />
              </>
            )}
            {state === 'C' && <path d="M 169 53 L 181 65 L 193 53" className="mpf-angle" />}
            {equilateral && (
              <>
                <line x1="177" y1="150" x2="183" y2="150" className="mpf-tick" />
                <text x="180" y="117" textAnchor="middle" className="mpf-label mpf-label--strong">a=b=c=1</text>
              </>
            )}
          </>
        )}
      </FigureFrame>
    )
  }

  if (id === 'F120-1A') {
    return (
      <FigureFrame id={id} title={text('底辺・高さ・面積の対応', '底边、高与面积的对应')}>
        <path d="M 58 150 L 302 150 L 222 52 Z" className="mpf-shape" />
        <line x1="222" y1="52" x2="222" y2="150" className="mpf-guide-line" />
        <path d="M 222 136 L 236 136 L 236 150" className="mpf-angle" />
        <text x="180" y="173" textAnchor="middle" className="mpf-label">6 cm</text>
        <text x="232" y="103" className="mpf-label">x cm</text>
        <text x="145" y="105" className="mpf-label mpf-label--strong">S = y</text>
      </FigureFrame>
    )
  }

  return null
}

function SetFigure({ id, text }: { id: MathPracticeFigureId; text: Localize }) {
  if (id !== 'F106-A') return null
  return (
    <FigureFrame id={id} title={text('P と Q を全体集合の中で見る', '在全集中观察 P 与 Q')}>
      <rect x="38" y="31" width="284" height="128" rx="8" className="mpf-shape" />
      <ellipse cx="145" cy="96" rx="72" ry="48" className="mpf-shape" />
      <ellipse cx="215" cy="96" rx="72" ry="48" className="mpf-shape" />
      <text x="64" y="51" className="mpf-label mpf-label--strong">U</text>
      <text x="112" y="95" className="mpf-label mpf-label--strong">P</text>
      <text x="246" y="95" className="mpf-label mpf-label--strong">Q</text>
    </FigureFrame>
  )
}

function RhombusFigure({ id, text }: { id: MathPracticeFigureId; text: Localize }) {
  if (id !== 'F104-6A' && id !== 'F104-6B') return null
  const square = id === 'F104-6B'
  return (
    <FigureFrame id={id} title={text(square ? '正方形なら4辺はすべて等しい' : 'ひし形でも直角とは限らない', square ? '正方形四边都相等' : '菱形也不一定有直角')}>
      {square ? (
        <>
          <rect x="105" y="42" width="150" height="110" className="mpf-shape" />
          <path d="M 105 132 L 125 132 L 125 152" className="mpf-angle" />
        </>
      ) : (
        <path d="M 70 102 L 145 42 L 290 88 L 215 148 Z" className="mpf-shape" />
      )}
      {[0,1,2,3].map((i) => <text key={i} x={[112,184,252,178][i]} y={[78,49,119,155][i]} className="mpf-label">＝</text>)}
    </FigureFrame>
  )
}

function SignFigure({ id, text }: { id: MathPracticeFigureId; text: Localize }) {
  if (id !== 'F107-2A') return null
  return (
    <FigureFrame id={id} title={text('積が負になる符号の組', '乘积为负时的符号组合')}>
      <line x1="180" y1="30" x2="180" y2="160" className="mpf-line" />
      <line x1="55" y1="95" x2="305" y2="95" className="mpf-line" />
      <text x="292" y="87" className="mpf-label">x&gt;0</text>
      <text x="64" y="87" className="mpf-label">x&lt;0</text>
      <text x="188" y="46" className="mpf-label">y&gt;0</text>
      <text x="188" y="151" className="mpf-label">y&lt;0</text>
      <text x="244" y="130" textAnchor="middle" className="mpf-label mpf-label--strong">(+,-)</text>
      <text x="116" y="65" textAnchor="middle" className="mpf-label mpf-label--strong">(-,+)</text>
      <text x="244" y="66" textAnchor="middle" className="mpf-muted">xy&gt;0</text>
      <text x="116" y="130" textAnchor="middle" className="mpf-muted">xy&gt;0</text>
    </FigureFrame>
  )
}

function BranchFigure({ id, text }: { id: MathPracticeFigureId; text: Localize }) {

  if (id === 'F108-A' || id === 'F108-B') {
    const eliminated = id === 'F108-B'
    return (
      <FigureFrame id={id} title={text('積が正から2つの符号ケースへ', '由乘积为正分成两个符号情况')}>
        <text x="180" y="38" textAnchor="middle" className="mpf-label mpf-label--strong">(a-1)(b-1)&gt;0</text>
        <line x1="180" y1="48" x2="100" y2="92" className="mpf-line" />
        <line x1="180" y1="48" x2="260" y2="92" className="mpf-line" />
        <rect x="48" y="92" width="105" height="55" rx="8" className="mpf-card" />
        <rect x="207" y="92" width="105" height="55" rx="8" className="mpf-card" />
        <text x="100" y="115" textAnchor="middle" className="mpf-label">a-1&gt;0</text>
        <text x="100" y="136" textAnchor="middle" className="mpf-label">b-1&gt;0</text>
        <text x="260" y="115" textAnchor="middle" className="mpf-label">a-1&lt;0</text>
        <text x="260" y="136" textAnchor="middle" className="mpf-label">b-1&lt;0</text>
        {eliminated && (
          <>
            <line x1="216" y1="96" x2="303" y2="143" className="mpf-cross" />
            <line x1="303" y1="96" x2="216" y2="143" className="mpf-cross" />
            <text x="260" y="169" textAnchor="middle" className="mpf-muted">a+b&lt;2</text>
          </>
        )}
      </FigureFrame>
    )
  }

  if (id === 'F110-A' || id === 'F110-B') {
    const summary = id === 'F110-B'
    return (
      <FigureFrame id={id} title={text(summary ? '4つの命題を整理する' : '元・逆・対偶・裏の位置関係', summary ? '整理四个命题' : '原、逆、逆否、否命题的关系')}>
        {[
          ['p⇒q', 95, 58],
          ['q⇒p', 265, 58],
          ['¬q⇒¬p', 95, 132],
          ['¬p⇒¬q', 265, 132],
        ].map(([label, x, y]) => (
          <g key={String(label)}>
            <rect x={Number(x)-58} y={Number(y)-23} width="116" height="46" rx="8" className="mpf-card" />
            <text x={Number(x)} y={Number(y)+5} textAnchor="middle" className="mpf-label mpf-label--strong">{label}</text>
            {summary && <text x={Number(x)+48} y={Number(y)-12} textAnchor="middle" className="mpf-muted">?</text>}
          </g>
        ))}
        <line x1="153" y1="58" x2="207" y2="58" className="mpf-guide-line" />
        <line x1="153" y1="132" x2="207" y2="132" className="mpf-guide-line" />
        <line x1="95" y1="81" x2="95" y2="109" className="mpf-guide-line" />
        <line x1="265" y1="81" x2="265" y2="109" className="mpf-guide-line" />
      </FigureFrame>
    )
  }

  return null
}

function ResidueFigure({ id, text }: { id: MathPracticeFigureId; text: Localize }) {
  if (id === 'F114-1A') {
    return (
      <FigureFrame id={id} title={text('4つの余りを2乗して調べる', '平方检查四种余数')}>
        {[1,2,3,4].map((r, i) => (
          <g key={r}>
            <circle cx={66+i*76} cy="72" r="22" className="mpf-card" />
            <text x={66+i*76} y="79" textAnchor="middle" className="mpf-label mpf-label--strong">{r}</text>
            <line x1={66+i*76} y1="96" x2={66+i*76} y2="126" className="mpf-line" />
            <text x={66+i*76} y="151" textAnchor="middle" className="mpf-muted">r² mod 5</text>
          </g>
        ))}
      </FigureFrame>
    )
  }
  if (id === 'F114-2A') {
    return (
      <FigureFrame id={id} title={text('余り 1,2 の組をすべて掛ける', '把余数 1、2 的组合全部相乘')}>
        <text x="180" y="42" textAnchor="middle" className="mpf-label mpf-label--strong">m mod 3, n mod 3 ∈ {'{1,2}'}</text>
        {['1×1','1×2','2×1','2×2'].map((v,i)=>(
          <g key={v}>
            <rect x={42+i*79} y="82" width="66" height="50" rx="8" className="mpf-card" />
            <text x={75+i*79} y="112" textAnchor="middle" className="mpf-label">{v}</text>
          </g>
        ))}
        <text x="180" y="162" textAnchor="middle" className="mpf-muted">mod 3 → ?</text>
      </FigureFrame>
    )
  }
  return null
}

function FunctionFigure({ id, text }: { id: MathPracticeFigureId; text: Localize }) {
  if (id === 'F118-1') {
    return (
      <FigureFrame id={id} title={text('円周 x と半径 y の対応', '圆周 x 与半径 y 的对应')}>
        <circle cx="180" cy="98" r="62" className="mpf-shape" />
        <line x1="180" y1="98" x2="242" y2="98" className="mpf-line" />
        <text x="208" y="90" className="mpf-label">y</text>
        <path d="M 123 55 A 75 75 0 0 1 250 76" className="mpf-guide-line" />
        <text x="184" y="35" textAnchor="middle" className="mpf-label mpf-label--strong">x</text>
      </FigureFrame>
    )
  }
  if (id === 'F118-2A' || id === 'F118-2B') {
    const solved = id === 'F118-2B'
    return (
      <FigureFrame id={id} title={text(solved ? '同じ x=4 に2つの出力' : 'x=4 の出力を探す', solved ? '同一个 x=4 对应两个输出' : '寻找 x=4 的输出')}>
        <rect x="48" y="70" width="82" height="54" rx="10" className="mpf-card" />
        <text x="89" y="103" textAnchor="middle" className="mpf-label mpf-label--strong">x=4</text>
        <line x1="130" y1="87" x2="228" y2="60" className="mpf-line" />
        <line x1="130" y1="107" x2="228" y2="134" className="mpf-line" />
        <rect x="230" y="37" width="78" height="46" rx="8" className="mpf-card" />
        <rect x="230" y="111" width="78" height="46" rx="8" className="mpf-card" />
        <text x="269" y="66" textAnchor="middle" className="mpf-label mpf-label--strong">{solved ? 'y=2' : 'y=?'}</text>
        <text x="269" y="140" textAnchor="middle" className="mpf-label mpf-label--strong">{solved ? 'y=-2' : 'y=?'}</text>
      </FigureFrame>
    )
  }
  if (id === 'F118-3') {
    return (
      <FigureFrame id={id} title={text('面積1の長方形で x と y を見る', '在面积为1的长方形中观察 x 与 y')}>
        <rect x="78" y="55" width="204" height="90" className="mpf-shape" />
        <text x="180" y="106" textAnchor="middle" className="mpf-label mpf-label--strong">{text('面積 1', '面积 1')}</text>
        <text x="180" y="168" textAnchor="middle" className="mpf-label">x</text>
        <text x="296" y="104" className="mpf-label">y</text>
      </FigureFrame>
    )
  }
  return null
}

function RouteFigure({ id, text }: { id: MathPracticeFigureId; text: Localize }) {
  if (!id.startsWith('F120-2')) return null
  const model = id === 'F120-2B'
  const endpoints = id === 'F120-2C'
  const domain = id === 'F120-2D'

  return (
    <FigureFrame id={id} title={text('15 km の道のりを区切って考える', '把15 km路程分段思考')}>
      <circle cx="54" cy="98" r="9" className="mpf-closed-dot" />
      <circle cx="306" cy="98" r="9" className="mpf-closed-dot" />
      <line x1="63" y1="98" x2="297" y2="98" className="mpf-emphasis-line" />
      <text x="54" y="130" textAnchor="middle" className="mpf-label">{text('出発', '出发')}</text>
      <text x="306" y="130" textAnchor="middle" className="mpf-label">{text('到着', '到达')}</text>
      <text x="180" y="67" textAnchor="middle" className="mpf-label mpf-label--strong">15 km</text>
      {!endpoints && !domain && <text x="180" y="151" textAnchor="middle" className="mpf-muted">3 km/h</text>}
      {model && (
        <>
          <circle cx="154" cy="98" r="6" className="mpf-closed-dot" />
          <text x="108" y="88" textAnchor="middle" className="mpf-label">3x</text>
          <text x="228" y="88" textAnchor="middle" className="mpf-label">y</text>
        </>
      )}
      {endpoints && (
        <>
          <text x="54" y="62" textAnchor="middle" className="mpf-muted">x=?</text>
          <text x="306" y="62" textAnchor="middle" className="mpf-muted">x=?</text>
        </>
      )}
      {domain && (
        <>
          <text x="54" y="62" textAnchor="middle" className="mpf-label mpf-label--strong">x=0</text>
          <text x="306" y="62" textAnchor="middle" className="mpf-label mpf-label--strong">x=5</text>
          <line x1="54" y1="160" x2="306" y2="160" className="mpf-line" />
          <Dot x={54} y={160} />
          <Dot x={306} y={160} />
        </>
      )}
    </FigureFrame>
  )
}

export function MathPracticeFigure({ figureId }: { figureId: MathPracticeFigureId }) {
  const { text } = useI18n()
  return (
    NumberLineFigure({ id: figureId, text })
    ?? TriangleFigure({ id: figureId, text })
    ?? SetFigure({ id: figureId, text })
    ?? RhombusFigure({ id: figureId, text })
    ?? SignFigure({ id: figureId, text })
    ?? BranchFigure({ id: figureId, text })
    ?? ResidueFigure({ id: figureId, text })
    ?? FunctionFigure({ id: figureId, text })
    ?? RouteFigure({ id: figureId, text })
  )
}
