import { describe, expect, it } from 'vitest'
import { builtInQuestions } from './questions'
import { buildPhysicsTopicSummary, physicsTaxonomy, physicsTopicForQuestion } from './physicsTaxonomy'

describe('physics taxonomy', () => {
  it('keeps the approved 5-domain / 23-topic structure short and unique', () => {
    expect(physicsTaxonomy.map((domain) => domain.id)).toEqual(['mechanics', 'thermal', 'waves', 'electromagnetism', 'atomic'])
    expect(physicsTaxonomy.map((domain) => domain.topics.length)).toEqual([8, 2, 3, 6, 4])

    const topics = physicsTaxonomy.flatMap((domain) => domain.topics)
    expect(topics).toHaveLength(23)
    expect(new Set(topics.map((topic) => topic.id)).size).toBe(topics.length)
    expect(topics.every((topic) => topic.label.ja.length <= 8)).toBe(true)

    const aliases = topics.flatMap((topic) => topic.aliases.map((alias) => [alias, topic.id] as const))
    expect(new Set(aliases.map(([alias]) => alias)).size).toBe(aliases.length)
  })

  it('classifies the current published physics catalog without leftovers', () => {
    const physics = builtInQuestions.filter((question) => question.subject === 'physics')
    expect(physics.map((question) => physicsTopicForQuestion(question))).toEqual(['motion', 'current', 'magnetic-field'])

    const summary = buildPhysicsTopicSummary(builtInQuestions)
    expect(summary.counts.motion).toBe(1)
    expect(summary.counts.current).toBe(1)
    expect(summary.counts['magnetic-field']).toBe(1)
    expect(summary.unclassified).toBe(0)
  })
})
