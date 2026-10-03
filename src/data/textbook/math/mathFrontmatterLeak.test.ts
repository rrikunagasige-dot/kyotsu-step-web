import { describe, expect, it } from 'vitest'
import { mathTextbookUnits } from './index'

const frontmatter = (unitId: string) => {
  const unit = mathTextbookUnits.find((candidate) => candidate.unitId === unitId)
  if (!unit) throw new Error(`Missing math textbook unit: ${unitId}`)
  return [unit.subtitle ?? '', ...unit.objectives].join('\n')
}

describe('math textbook frontmatter leakage audit', () => {
  it('does not preload later set terminology before the reading flow reaches it', () => {
    expect(frontmatter('math-sets')).not.toMatch(/共通部分|和集合|部分集合|補集合|ド・モルガン|有限集合|無限集合/)
  })

  it('does not give proposition-reading labels before learners build their meaning', () => {
    expect(frontmatter('math-propositions-reading')).not.toMatch(/反例|必要条件|十分条件|必要十分条件|ド・モルガン/)
  })

  it('does not state the quantifier-negation rule in the frontmatter', () => {
    expect(frontmatter('math-quantifiers-all-exists')).not.toMatch(/「すべて」の否定|「ある」の否定/)
  })

  it('does not give the function uniqueness answer or later range labels up front', () => {
    expect(frontmatter('math-functions-conditions')).not.toMatch(/ただ1つ|定義域|値域|f\(x\)/)
  })

  it('does not name proof techniques before the proof flow constructs them', () => {
    expect(frontmatter('math-propositions-proof')).not.toMatch(/対偶|背理法|逆・裏/)
  })
})
