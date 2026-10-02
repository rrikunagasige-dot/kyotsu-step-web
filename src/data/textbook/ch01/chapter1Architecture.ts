export type Chapter1LocalizedText = {
  ja: string
  zh: string
}

export type Chapter1LearningChunk = {
  id: 'represent-motion' | 'changing-velocity' | 'force-motion'
  title: Chapter1LocalizedText
  flow: Chapter1LocalizedText
  unitCodes: readonly string[]
}

export const chapter1LearningChunks: readonly Chapter1LearningChunk[] = [
  {
    id: 'represent-motion',
    title: { ja: '運動を表す', zh: '表示运动' },
    flow: {
      ja: '位置 → 変位 → 速度 → 合成・分解 → 相対速度',
      zh: '位置 → 位移 → 速度 → 合成・分解 → 相对速度',
    },
    unitCodes: ['1A', '1B', '1C'],
  },
  {
    id: 'changing-velocity',
    title: { ja: '速度の変化', zh: '速度变化' },
    flow: {
      ja: '加速度 → 等加速度運動 → 水平投射 → 斜方投射',
      zh: '加速度 → 匀加速运动 → 平抛 → 斜抛',
    },
    unitCodes: ['1D', '1E', '1F'],
  },
  {
    id: 'force-motion',
    title: { ja: '力と運動', zh: '力与运动' },
    flow: {
      ja: '力 → 加速度 → 重力・空気抵抗 → 終端速度',
      zh: '力 → 加速度 → 重力与空气阻力 → 终端速度',
    },
    unitCodes: ['1G'],
  },
] as const

const unitSequence = [
  {
    unitCode: '1A',
    unitId: 'physics-a-displacement-velocity',
    bridge: {
      ja: '速度には向きがある。次は、複数の運動をベクトルとして組み合わせる。',
      zh: '速度有方向。接下来把多个运动作为向量组合起来。',
    },
  },
  {
    unitCode: '1B',
    unitId: 'physics-1b-velocity-composition',
    bridge: {
      ja: '速度をベクトルとして扱えた。次は、「誰から見た速度か」を考える。',
      zh: '已经能把速度作为向量处理。接下来考虑“从谁看来”的速度。',
    },
  },
  {
    unitCode: '1C',
    unitId: 'physics-1c-relative-velocity',
    bridge: {
      ja: 'ここまでは速度をどう表すかを考えた。次は、その速度そのものが時間とともに変わる運動を見る。',
      zh: '到这里我们一直在思考如何表示速度。接下来研究速度本身随时间变化的运动。',
    },
  },
  {
    unitCode: '1D',
    unitId: 'physics-1d-acceleration',
    bridge: {
      ja: '加速度と等加速度運動の式を作った。次は、その式を平面内の運動へ使う。',
      zh: '已经建立了加速度和匀加速运动的公式。接下来把这些公式用于平面运动。',
    },
  },
  {
    unitCode: '1E',
    unitId: 'physics-1e-horizontal-projectile',
    bridge: {
      ja: '水平投射では初速度が水平方向だけだった。次は、初速度を斜めにして同じ考え方を広げる。',
      zh: '平抛的初速度只有水平方向。接下来把初速度改为斜向，继续扩展同一思路。',
    },
  },
  {
    unitCode: '1F',
    unitId: 'physics-1f-oblique-projectile',
    bridge: {
      ja: 'ここまでは加速度を使って運動を求めた。最後に、その加速度を生み出す力までさかのぼる。',
      zh: '到这里我们一直用加速度求运动。最后再追溯到产生加速度的力。',
    },
  },
  {
    unitCode: '1G',
    unitId: 'physics-1g-gravity-drag-terminal-velocity',
  },
] as const

export function chapter1Localized(value: Chapter1LocalizedText, language: string) {
  return language === 'zh' ? value.zh : value.ja
}

export function chapter1ChunkForUnitCode(unitCode: string | undefined) {
  if (!unitCode) return undefined
  return chapter1LearningChunks.find((chunk) => chunk.unitCodes.includes(unitCode))
}

export function chapter1NextUnit(unitCode: string | undefined) {
  if (!unitCode) return undefined
  const index = unitSequence.findIndex((unit) => unit.unitCode === unitCode)
  if (index < 0 || index >= unitSequence.length - 1) return undefined

  const current = unitSequence[index]
  const next = unitSequence[index + 1]
  if (!('bridge' in current)) return undefined
  return {
    unitCode: next.unitCode,
    unitId: next.unitId,
    bridge: current.bridge,
  }
}

export const chapter1UnitSequence = unitSequence
