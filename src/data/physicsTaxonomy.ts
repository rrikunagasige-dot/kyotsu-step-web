import type { Question } from '../domain/questionSchema'
import type { AppLanguage } from '../i18n/types'

export type PhysicsDomainId = 'mechanics' | 'thermal' | 'waves' | 'electromagnetism' | 'atomic'
export type PhysicsTopicId =
  | 'motion'
  | 'force'
  | 'energy'
  | 'momentum'
  | 'circular-gravity'
  | 'rigid-body'
  | 'heat'
  | 'gas'
  | 'wave'
  | 'sound'
  | 'light'
  | 'electric-field'
  | 'current'
  | 'magnetic-field'
  | 'induction'
  | 'quantum'
  | 'nuclear'

export type PhysicsTopic = {
  id: PhysicsTopicId
  label: { ja: string; zh: string }
  aliases: string[]
}

export type PhysicsDomain = {
  id: PhysicsDomainId
  label: { ja: string; zh: string }
  topics: PhysicsTopic[]
}

export const physicsTaxonomy: PhysicsDomain[] = [
  {
    id: 'mechanics',
    label: { ja: '力学', zh: '力学' },
    topics: [
      { id: 'motion', label: { ja: '運動', zh: '运动' }, aliases: ['motion', 'motion-graph', 'kinematics', 'projectile-motion'] },
      { id: 'force', label: { ja: '力', zh: '力' }, aliases: ['force', 'dynamics', 'newton-law', 'friction'] },
      { id: 'energy', label: { ja: 'エネルギー', zh: '能量' }, aliases: ['energy', 'work-energy', 'mechanical-energy'] },
      { id: 'momentum', label: { ja: '運動量', zh: '动量' }, aliases: ['momentum', 'impulse', 'collision'] },
      { id: 'circular-gravity', label: { ja: '円運動・万有引力', zh: '圆周运动・万有引力' }, aliases: ['circular-gravity', 'circular-motion', 'simple-harmonic-motion', 'gravitation'] },
      { id: 'rigid-body', label: { ja: '剛体', zh: '刚体' }, aliases: ['rigid-body', 'torque', 'rigid-equilibrium'] },
    ],
  },
  {
    id: 'thermal',
    label: { ja: '熱', zh: '热学' },
    topics: [
      { id: 'heat', label: { ja: '熱', zh: '热' }, aliases: ['heat', 'thermal-energy', 'calorimetry'] },
      { id: 'gas', label: { ja: '気体', zh: '气体' }, aliases: ['gas', 'ideal-gas', 'kinetic-theory', 'thermodynamics'] },
    ],
  },
  {
    id: 'waves',
    label: { ja: '波動', zh: '波动' },
    topics: [
      { id: 'wave', label: { ja: '波', zh: '波' }, aliases: ['wave', 'wave-motion', 'interference-diffraction'] },
      { id: 'sound', label: { ja: '音', zh: '声' }, aliases: ['sound', 'sound-wave', 'doppler'] },
      { id: 'light', label: { ja: '光', zh: '光' }, aliases: ['light', 'optics', 'light-wave'] },
    ],
  },
  {
    id: 'electromagnetism',
    label: { ja: '電磁気', zh: '电磁学' },
    topics: [
      { id: 'electric-field', label: { ja: '電場', zh: '电场' }, aliases: ['electric-field', 'electrostatics', 'capacitor'] },
      { id: 'current', label: { ja: '電流', zh: '电流' }, aliases: ['current', 'dc-circuit', 'electric-current', 'circuit'] },
      { id: 'magnetic-field', label: { ja: '磁場', zh: '磁场' }, aliases: ['magnetic-field', 'magnetic-force', 'lorentz-force'] },
      { id: 'induction', label: { ja: '電磁誘導', zh: '电磁感应' }, aliases: ['induction', 'electromagnetic-induction', 'alternating-current', 'electromagnetic-wave'] },
    ],
  },
  {
    id: 'atomic',
    label: { ja: '原子', zh: '原子' },
    topics: [
      { id: 'quantum', label: { ja: '量子', zh: '量子' }, aliases: ['quantum', 'electron-photon', 'wave-particle-duality', 'photoelectric-effect'] },
      { id: 'nuclear', label: { ja: '原子核', zh: '原子核' }, aliases: ['nuclear', 'atomic-nucleus', 'radioactivity', 'nuclear-reaction'] },
    ],
  },
]

const topicByAlias = new Map<string, PhysicsTopicId>()
for (const domain of physicsTaxonomy) {
  for (const topic of domain.topics) {
    topicByAlias.set(topic.id, topic.id)
    for (const alias of topic.aliases) topicByAlias.set(alias, topic.id)
  }
}

export function isPhysicsTopicId(value: string | null): value is PhysicsTopicId {
  return Boolean(value && physicsTaxonomy.some((domain) => domain.topics.some((topic) => topic.id === value)))
}

export function physicsTopicForQuestion(question: Pick<Question, 'subject' | 'taxonomy'>): PhysicsTopicId | null {
  if (question.subject !== 'physics') return null
  return topicByAlias.get(question.taxonomy.minorUnit) ?? null
}

export function physicsTopicLabel(topicId: PhysicsTopicId, language: AppLanguage) {
  for (const domain of physicsTaxonomy) {
    const topic = domain.topics.find((candidate) => candidate.id === topicId)
    if (topic) return topic.label[language]
  }
  return topicId
}

export function buildPhysicsTopicSummary(questions: Question[]) {
  const counts = Object.fromEntries(
    physicsTaxonomy.flatMap((domain) => domain.topics.map((topic) => [topic.id, 0])),
  ) as Record<PhysicsTopicId, number>

  let unclassified = 0
  for (const question of questions) {
    if (question.subject !== 'physics' || question.status !== 'published') continue
    const topicId = physicsTopicForQuestion(question)
    if (topicId) counts[topicId] += 1
    else unclassified += 1
  }
  return { counts, unclassified }
}
