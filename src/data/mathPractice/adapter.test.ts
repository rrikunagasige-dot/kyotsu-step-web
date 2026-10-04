import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { mathPractice87To120Catalog, mathPracticePilotCatalog } from './catalog'
import { mathPracticePilotSource } from './pilot'
import { mathPracticeSetsBatchASource } from './setsBatchA'
import { mathPracticeSetsBatchASourceZh } from './setsBatchA.zh'
import { mathPracticePropositionsBatchBSource } from './propositionsBatchB'
import { mathPracticePropositionsBatchBSourceZh } from './propositionsBatchB.zh'
import { mathPracticeProofsBatchCSource } from './proofsBatchC'
import { mathPracticeFunctionsBatchDSource } from './functionsBatchD'
import { mathPracticePilotQuestions, mathPracticePilotQuestionsZh } from './adapter'

describe('math practice 87-120 staged integration', () => {
  it('keeps the complete 87-120 title catalog without publishing everything at once', () => {
    expect(mathPractice87To120Catalog).toHaveLength(34)
    expect(mathPractice87To120Catalog[0]?.problemNo).toBe(87)
    expect(mathPractice87To120Catalog.at(-1)?.problemNo).toBe(120)
    expect(mathPracticePilotCatalog.map((entry) => entry.problemNo)).toEqual([87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120])
  })

  it('publishes the reviewed set, proposition and proof pilots in source order', () => {
    expect(mathPracticePilotSource.map((question) => question.problemNo)).toEqual([87, 94, 97])
    expect(mathPracticePilotQuestions.map((question) => question.questionId)).toEqual(
      Array.from({ length: 34 }, (_, index) => `math-practice-${String(87 + index).padStart(3, '0')}`),
    )
  })

  it('preserves short numbered titles in source order', () => {
    expect(mathPracticePilotQuestions.map((question) => question.title)).toEqual([
      '87｜素数と集合',
      '88｜集合の表し方',
      '89｜部分集合',
      '90｜集合の包含関係',
      '91｜部分集合をすべて求める',
      '92｜共通部分と和集合',
      '93｜3つの集合',
      '94｜補集合',
      '95｜集合を復元する',
      '96｜3集合の複合演算',
      '97｜共通部分から定数を決める',
      '98｜命題と真偽',
      '99｜含意の真偽',
      '100｜反例',
      '101｜条件の否定',
      '102｜「かつ」と「または」',
      '103｜複合条件の否定',
      '104｜必要条件・十分条件',
      '105｜命題の真偽',
      '106｜集合で条件を表す',
      '107｜必要・十分条件の判定',
      '108｜同値の証明',
      '109｜「すべて」と「ある」の否定',
      '110｜逆・対偶・裏',
      '111｜対偶による証明',
      '112｜無理数の証明',
      '113｜平方根と無理数',
      '114｜倍数の証明',
      '115｜背理法',
      '116｜有理数と無理数',
      '117｜無理数を含む等式',
      '118｜関数とは何か',
      '119｜関数の値',
      '120｜文章から関数を作る',
    ])
  })

  it('keeps the meaningful odd-number step in 88 but removes the redundant p4 pattern hole', () => {
    const question = mathPracticeSetsBatchASource.find((item) => item.problemNo === 88)
    expect(question).toBeDefined()

    expect(question?.blanks.some((blank) => blank.id === 'p2-step')).toBe(true)
    expect(question?.blanks.some((blank) => blank.id === 'p4-pattern')).toBe(false)

    const sampleIndex = question?.guide.findIndex(
      (node) => node.type === 'blank' && node.blankId === 'p4-sample',
    ) ?? -1
    expect(sampleIndex).toBeGreaterThan(-1)
    expect(question?.guide[sampleIndex + 1]).toEqual({
      type: 'content',
      blocks: [{ type: 'text', text: '1,4,7,10,... は3ずつ増える。' }],
    })
    expect(question?.guide[sampleIndex + 2]).toEqual({
      type: 'blank',
      blankId: 'p4-result',
    })

    const chinese = mathPracticeSetsBatchASourceZh.find((item) => item.problemNo === 88)
    expect(JSON.stringify(chinese)).toContain('1,4,7,10,... 每次增加3。')
  })

  it('explicitly closes 92-(2) as an empty intersection without adding a duplicate answer blank', () => {
    const question = mathPracticeSetsBatchASource.find((item) => item.problemNo === 92)
    expect(question).toBeDefined()

    const commonIndex = question?.guide.findIndex(
      (node) => node.type === 'blank' && node.blankId === 'p2-common',
    ) ?? -1
    expect(commonIndex).toBeGreaterThan(-1)

    expect(question?.guide[commonIndex + 1]).toEqual({
      type: 'content',
      blocks: [
        { type: 'text', text: '共通要素がないので、(2) の共通部分は空集合である。' },
        { type: 'latex', latex: 'A\\cap B=\\varnothing' },
      ],
    })
    expect(question?.guide[commonIndex + 2]).toEqual({
      type: 'blank',
      blankId: 'p2-union',
    })

    expect(question?.blanks.some((blank) => blank.id === 'p2-intersection')).toBe(false)

    const chinese = mathPracticeSetsBatchASourceZh.find((item) => item.problemNo === 92)
    expect(JSON.stringify(chinese)).toContain('没有公共元素，因此 (2) 的交集是空集。')
  })

  it('authors 96-(4) as candidate selection followed by two explicit complement filters', () => {
    const question = mathPracticeSetsBatchASource.find((item) => item.problemNo === 96)
    expect(question).toBeDefined()

    const ids = question?.blanks.map((blank) => blank.id) ?? []
    expect(ids.slice(ids.indexOf('p4-candidates'), ids.indexOf('p5-result')))
      .toEqual(['p4-candidates', 'p4-after-a', 'p4-result'])

    const afterA = question?.blanks.find((blank) => blank.id === 'p4-after-a')
    expect(afterA?.choices.find((choice) => choice.correct)?.label).toBe('{5,6}')

    const final = question?.blanks.find((blank) => blank.id === 'p4-result')
    expect(final?.choices.find((choice) => choice.correct)?.label).toBe('{5}')
  })

  it('authors 98 as a common proposition criterion plus three independent subproblems', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 98)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'definition',
      'p1-calculation',
      'p1-result',
      'p2-property',
      'p2-third-side',
      'p2-example',
      'p2-verify',
      'p2-result',
      'p3-objectivity',
      'p3-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p2-example')?.choices.find((choice) => choice.correct)?.id)
      .toBe('five-five-six')
    expect(question?.blanks.find((blank) => blank.id === 'p3-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('not-proposition')
  })

  it('authors 99 as one inclusion rule plus four independent implication checks', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 99)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-sets',
      'p1-inclusion',
      'p1-result',
      'p2-sets',
      'p2-inclusion',
      'p2-counterexample',
      'p2-verify',
      'p2-result',
      'p3-p-set',
      'p3-q-set',
      'p3-inclusion',
      'p3-result',
      'p4-p-set',
      'p4-q-set',
      'p4-left-endpoint',
      'p4-inclusion',
      'p4-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p2-counterexample')?.choices.find((choice) => choice.correct)?.id)
      .toBe('zero')
    expect(question?.blanks.find((blank) => blank.id === 'p4-q-set')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'p4-left-endpoint')?.choices.find((choice) => choice.correct)?.id)
      .toBe('p-only')
  })

  it('authors 100 as one counterexample rule plus three independent constructions', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 100)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-roots',
      'p1-counterexample',
      'p1-verify',
      'p2-break-q',
      'p2-y',
      'p2-x',
      'p2-verify',
      'p3-candidate',
      'p3-factor',
      'p3-verify',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-counterexample')?.choices.find((choice) => choice.correct)?.id)
      .toBe('minus-root')
    expect(question?.blanks.find((blank) => blank.id === 'p2-x')?.choices.find((choice) => choice.correct)?.id)
      .toBe('minus-two')
    expect(question?.blanks.find((blank) => blank.id === 'p3-candidate')?.choices.find((choice) => choice.correct)?.id)
      .toBe('five')
  })

  it('authors 101 as one negation rule plus three independent complements', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 101)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-boundary',
      'p1-side',
      'p1-result',
      'p2-result',
      'p3-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('le')
    expect(question?.blanks.find((blank) => blank.id === 'p2-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('equals')
    expect(question?.blanks.find((blank) => blank.id === 'p3-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('irrational')
  })

  it('authors 102 as one AND/OR rule plus four independent interval results', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 102)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-bounds',
      'p1-endpoints',
      'p1-result',
      'p2-bounds',
      'p2-endpoints',
      'p2-result',
      'p3-core',
      'p3-left',
      'p3-right',
      'p3-result',
      'p4-span',
      'p4-left',
      'p4-right',
      'p4-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'p3-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'p4-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
  })

  it('authors 103 as one semantic De Morgan rule plus five independent negations', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 103)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-atoms',
      'p1-result',
      'p2-atoms',
      'p2-result',
      'p3-split',
      'p3-atoms',
      'p3-result',
      'p4-atoms',
      'p4-result',
      'p5-form',
      'p5-atoms',
      'p5-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('de-morgan')
    expect(question?.blanks.find((blank) => blank.id === 'p3-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'p5-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('both-rational')
  })

  it('authors 104 as one direction rule plus six independent necessary/sufficient classifications', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 104)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-forward-calc',
      'p1-forward-judgment',
      'p1-reverse-solve',
      'p1-reverse-judgment',
      'p1-classification',
      'p2-forward-example',
      'p2-forward-judgment',
      'p2-reverse-solve',
      'p2-reverse-judgment',
      'p2-classification',
      'p3-forward-example',
      'p3-forward-judgment',
      'p3-reverse-example',
      'p3-reverse-judgment',
      'p3-classification',
      'p4-forward',
      'p4-reverse',
      'p4-classification',
      'p5-forward-check',
      'p5-forward-judgment',
      'p5-reverse-y',
      'p5-reverse-x',
      'p5-reverse-judgment',
      'p5-classification',
      'p6-forward-property',
      'p6-forward-judgment',
      'p6-reverse-property',
      'p6-reverse-judgment',
      'p6-classification',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('sufficient-only')
    expect(question?.blanks.find((blank) => blank.id === 'p2-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('necessary-only')
    expect(question?.blanks.find((blank) => blank.id === 'p3-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('neither')
    expect(question?.blanks.find((blank) => blank.id === 'p4-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('iff')
    expect(question?.blanks.find((blank) => blank.id === 'p5-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('iff')
    expect(question?.blanks.find((blank) => blank.id === 'p6-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('necessary-only')
  })

  it('authors 105 as one truth-proof rule plus four independent truth-value checks', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 105)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-zero-case',
      'p1-example',
      'p1-verify',
      'p1-judgment',
      'p2-solutions',
      'p2-check',
      'p2-judgment',
      'p3-example',
      'p3-product',
      'p3-factors',
      'p3-judgment',
      'p4-example',
      'p4-sum-product',
      'p4-factors',
      'p4-judgment',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-judgment')?.choices.find((choice) => choice.correct)?.id)
      .toBe('false')
    expect(question?.blanks.find((blank) => blank.id === 'p2-judgment')?.choices.find((choice) => choice.correct)?.id)
      .toBe('true')
    expect(question?.blanks.find((blank) => blank.id === 'p3-judgment')?.choices.find((choice) => choice.correct)?.id)
      .toBe('false')
    expect(question?.blanks.find((blank) => blank.id === 'p4-judgment')?.choices.find((choice) => choice.correct)?.id)
      .toBe('false')
  })

  it('authors 106 as one set-language rule plus four independent set expressions', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 106)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-parts',
      'p1-result',
      'p2-result',
      'p3-parts',
      'p3-result',
      'p4-parts',
      'p4-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('intersection')
    expect(question?.blanks.find((blank) => blank.id === 'p2-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('pbar')
    expect(question?.blanks.find((blank) => blank.id === 'p3-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('q-inter-pbar')
    expect(question?.blanks.find((blank) => blank.id === 'p4-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('qbar-inter-pbar')
  })

  it('authors 107 as one direction rule plus five independent necessary/sufficient classifications', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 107)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-forward-branches',
      'p1-forward-example',
      'p1-forward-judgment',
      'p1-reverse-check',
      'p1-reverse-judgment',
      'p1-classification',
      'p2-forward-sign',
      'p2-forward-judgment',
      'p2-reverse-signs',
      'p2-reverse-example',
      'p2-reverse-judgment',
      'p2-classification',
      'p3-forward-check',
      'p3-forward-judgment',
      'p3-reverse-zero-product',
      'p3-reverse-sum',
      'p3-reverse-judgment',
      'p3-classification',
      'p4-acute-definition',
      'p4-reverse-judgment',
      'p4-counterexample-angles',
      'p4-forward-verify',
      'p4-forward-judgment',
      'p4-classification',
      'p5-factor-branches',
      'p5-branch-isosceles',
      'p5-branch-right',
      'p5-forward-example',
      'p5-forward-verify',
      'p5-forward-judgment',
      'p5-reverse-position',
      'p5-reverse-lengths',
      'p5-reverse-factors',
      'p5-reverse-judgment',
      'p5-classification',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('necessary-only')
    expect(question?.blanks.find((blank) => blank.id === 'p2-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('sufficient-only')
    expect(question?.blanks.find((blank) => blank.id === 'p3-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('iff')
    expect(question?.blanks.find((blank) => blank.id === 'p4-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('necessary-only')
    expect(question?.blanks.find((blank) => blank.id === 'p5-classification')?.choices.find((choice) => choice.correct)?.id)
      .toBe('neither')

    expect(question?.problem).toContainEqual({
      type: 'text',
      text: '(5) △ABC の3辺 BC, CA, AB の長さをそれぞれ a, b, c とする。',
    })
    expect(question?.problem).toContainEqual({
      type: 'latex',
      latex: '(a-b)(a^2+b^2-c^2)=0\\;\\text{ は△ABCが直角二等辺三角形であるための□}',
    })

    const chinese = mathPracticePropositionsBatchBSourceZh.find((item) => item.problemNo === 107)
    expect(chinese?.problem).toContainEqual({
      type: 'text',
      text: '(5) 设 △ABC 的3边 BC、CA、AB 的长度分别为 a、b、c。',
    })
  })

  it('authors 108 as a two-direction equivalence proof with an explicit reverse sign split', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 108)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'forward-sum',
      'forward-product',
      'forward-judgment',
      'reverse-sign',
      'reverse-eliminate',
      'reverse-judgment',
      'equivalence',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('both-directions')
    expect(question?.blanks.find((blank) => blank.id === 'reverse-sign')?.choices.find((choice) => choice.correct)?.id)
      .toBe('same-sign')
    expect(question?.blanks.find((blank) => blank.id === 'reverse-eliminate')?.choices.find((choice) => choice.correct)?.id)
      .toBe('negative-eliminated')
    expect(question?.blanks.find((blank) => blank.id === 'equivalence')?.choices.find((choice) => choice.correct)?.id)
      .toBe('equivalent')
  })

  it('authors 109 as one quantifier-negation rule plus two independent truth checks', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 109)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-negation',
      'p1-solve',
      'p1-truth',
      'p2-negation',
      'p2-solve',
      'p2-domain',
      'p2-truth',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-negation')?.choices.find((choice) => choice.correct)?.id)
      .toBe('exists-equals')
    expect(question?.blanks.find((blank) => blank.id === 'p1-truth')?.choices.find((choice) => choice.correct)?.id)
      .toBe('original-false')
    expect(question?.blanks.find((blank) => blank.id === 'p2-negation')?.choices.find((choice) => choice.correct)?.id)
      .toBe('forall-not-equals')
    expect(question?.blanks.find((blank) => blank.id === 'p2-solve')?.choices.find((choice) => choice.correct)?.id)
      .toBe('zero-five')
    expect(question?.blanks.find((blank) => blank.id === 'p2-truth')?.choices.find((choice) => choice.correct)?.id)
      .toBe('original-true')
  })

  it('authors 110 as one relation-form rule plus three independent original/converse/contrapositive/inverse checks', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 110)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-original-proof',
      'p1-original-judgment',
      'p1-converse-form',
      'p1-converse-example',
      'p1-converse-judgment',
      'p1-contrapositive-form',
      'p1-contrapositive-evidence',
      'p1-contrapositive-judgment',
      'p1-inverse-form',
      'p1-inverse-example',
      'p1-inverse-judgment',
      'p1-summary',
      'p2-roots',
      'p2-original-example',
      'p2-original-judgment',
      'p2-converse-form',
      'p2-converse-evidence',
      'p2-converse-judgment',
      'p2-contrapositive-form',
      'p2-contrapositive-example',
      'p2-contrapositive-judgment',
      'p2-inverse-form',
      'p2-inverse-evidence',
      'p2-inverse-judgment',
      'p2-summary',
      'p3-original-factor',
      'p3-original-judgment',
      'p3-converse-form',
      'p3-converse-evidence',
      'p3-converse-judgment',
      'p3-contrapositive-form',
      'p3-contrapositive-evidence',
      'p3-contrapositive-judgment',
      'p3-inverse-form',
      'p3-inverse-evidence',
      'p3-inverse-judgment',
      'p3-summary',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'p1-summary')?.choices.find((choice) => choice.correct)?.id)
      .toBe('tftf')
    expect(question?.blanks.find((blank) => blank.id === 'p2-summary')?.choices.find((choice) => choice.correct)?.id)
      .toBe('ftft')
    expect(question?.blanks.find((blank) => blank.id === 'p3-contrapositive-judgment')?.choices.find((choice) => choice.correct)?.id)
      .toBe('true')
    expect(question?.blanks.find((blank) => blank.id === 'p3-summary')?.choices.find((choice) => choice.correct)?.id)
      .toBe('tttt')
  })

  it('authors 111 as four independent contrapositive proofs without a strategy-choice hole', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 111)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-contrapositive',
      'p1-proof',
      'p2-negation',
      'p2-proof',
      'p3-contrapositive',
      'p3-proof',
      'p4-contrapositive',
      'p4-form',
      'p4-proof',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'p2-negation')?.choices.find((choice) => choice.correct)?.id)
      .toBe('and-le')
    expect(question?.blanks.find((blank) => blank.id === 'p3-proof')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'p4-form')?.choices.find((choice) => choice.correct)?.id)
      .toBe('odd-form')
    expect(question?.blanks.find((blank) => blank.id === 'p4-proof')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
  })

  it('authors 112 as two independent contradiction proofs sharing only the irrationality target', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 112)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-assumption',
      'p1-isolate',
      'p1-contradiction',
      'p2-rationalize',
      'p2-assumption',
      'p2-isolate',
      'p2-contradiction',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('rational-assume')
    expect(question?.blanks.find((blank) => blank.id === 'p1-isolate')?.choices.find((choice) => choice.correct)?.id)
      .toBe('r-minus-one')
    expect(question?.blanks.find((blank) => blank.id === 'p2-rationalize')?.choices.find((choice) => choice.correct)?.id)
      .toBe('conjugate')
    expect(question?.blanks.find((blank) => blank.id === 'p2-isolate')?.choices.find((choice) => choice.correct)?.id)
      .toBe('two-minus-r')
    expect(question?.blanks.find((blank) => blank.id === 'p2-contradiction')?.choices.find((choice) => choice.correct)?.id)
      .toBe('contradiction')
  })

  it('authors 113 as a linear contradiction from sqrt(x)=r to x=r^2', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 113)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'assumption',
      'operation',
      'square-result',
      'contradiction',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'assumption')?.choices.find((choice) => choice.correct)?.id)
      .toBe('sqrt-rational')
    expect(question?.blanks.find((blank) => blank.id === 'operation')?.choices.find((choice) => choice.correct)?.id)
      .toBe('square')
    expect(question?.blanks.find((blank) => blank.id === 'square-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('x-rational')
    expect(question?.blanks.find((blank) => blank.id === 'contradiction')?.choices.find((choice) => choice.correct)?.id)
      .toBe('contradiction')
  })

  it('authors 114 as two independent residue-class contrapositive proofs', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 114)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'p1-plan',
      'p1-residues',
      'p1-squares',
      'p2-plan',
      'p2-residues',
      'p2-products',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-plan')?.choices.find((choice) => choice.correct)?.id)
      .toBe('contrapositive')
    expect(question?.blanks.find((blank) => blank.id === 'p1-residues')?.choices.find((choice) => choice.correct)?.id)
      .toBe('one-two-three-four')
    expect(question?.blanks.find((blank) => blank.id === 'p1-squares')?.choices.find((choice) => choice.correct)?.id)
      .toBe('none-zero')
    expect(question?.blanks.find((blank) => blank.id === 'p2-plan')?.choices.find((choice) => choice.correct)?.id)
      .toBe('both-not')
    expect(question?.blanks.find((blank) => blank.id === 'p2-products')?.choices.find((choice) => choice.correct)?.id)
      .toBe('none-zero')
  })

  it('authors 115 as a linear contradiction that creates the known irrational sqrt(6)', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 115)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'assumption',
      'operation',
      'expand',
      'isolate',
      'contradiction',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'assumption')?.choices.find((choice) => choice.correct)?.id)
      .toBe('rational-r')
    expect(question?.blanks.find((blank) => blank.id === 'operation')?.choices.find((choice) => choice.correct)?.id)
      .toBe('square')
    expect(question?.blanks.find((blank) => blank.id === 'expand')?.choices.find((choice) => choice.correct)?.id)
      .toBe('five-minus-two-root6')
    expect(question?.blanks.find((blank) => blank.id === 'isolate')?.choices.find((choice) => choice.correct)?.id)
      .toBe('five-minus-r2-over-two')
    expect(question?.blanks.find((blank) => blank.id === 'contradiction')?.choices.find((choice) => choice.correct)?.id)
      .toBe('contradiction')
  })

  it('authors 116 as a linear contradiction that proves q=0 before back-substituting for p', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 116)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'target',
      'assumption',
      'isolate',
      'q-zero',
      'p-zero',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'target')?.choices.find((choice) => choice.correct)?.id)
      .toBe('q')
    expect(question?.blanks.find((blank) => blank.id === 'assumption')?.choices.find((choice) => choice.correct)?.id)
      .toBe('q-nonzero')
    expect(question?.blanks.find((blank) => blank.id === 'isolate')?.choices.find((choice) => choice.correct)?.id)
      .toBe('minus-p-over-q')
    expect(question?.blanks.find((blank) => blank.id === 'q-zero')?.choices.find((choice) => choice.correct)?.id)
      .toBe('contradiction-q-zero')
    expect(question?.blanks.find((blank) => blank.id === 'p-zero')?.choices.find((choice) => choice.correct)?.id)
      .toBe('p-zero')
  })

  it('authors 117 as two independent coefficient-separation problems reusing theorem 116', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 117)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'p1-expand',
      'p1-group',
      'p1-apply',
      'p1-solve',
      'p2-conjugate',
      'p2-rationalize',
      'p2-group',
      'p2-apply',
      'p2-solve',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-group')?.choices.find((choice) => choice.correct)?.id)
      .toBe('grouped')
    expect(question?.blanks.find((blank) => blank.id === 'p1-solve')?.choices.find((choice) => choice.correct)?.id)
      .toBe('minus-two-three')
    expect(question?.blanks.find((blank) => blank.id === 'p2-rationalize')?.choices.find((choice) => choice.correct)?.id)
      .toBe('both-correct')
    expect(question?.blanks.find((blank) => blank.id === 'p2-group')?.choices.find((choice) => choice.correct)?.id)
      .toBe('grouped')
    expect(question?.blanks.find((blank) => blank.id === 'p2-solve')?.choices.find((choice) => choice.correct)?.id)
      .toBe('one-minus-two')
  })

  it('authors 118 around the one-input-one-output function criterion', () => {
    const question = mathPracticeFunctionsBatchDSource.find((item) => item.problemNo === 118)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-relation',
      'p1-solve',
      'p1-unique',
      'p1-judgment',
      'p2-sample',
      'p2-roots',
      'p2-count',
      'p2-judgment',
      'p3-area',
      'p3-solve',
      'p3-domain',
      'p3-unique',
      'p3-judgment',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('unique')
    expect(question?.blanks.find((blank) => blank.id === 'p1-judgment')?.choices.find((choice) => choice.correct)?.id)
      .toBe('function')
    expect(question?.blanks.find((blank) => blank.id === 'p2-judgment')?.choices.find((choice) => choice.correct)?.id)
      .toBe('not-function')
    expect(question?.blanks.find((blank) => blank.id === 'p3-judgment')?.choices.find((choice) => choice.correct)?.id)
      .toBe('function')
  })

  it('authors 119 as current-item substitution with extra stages only for composite inputs', () => {
    const question = mathPracticeFunctionsBatchDSource.find((item) => item.problemNo === 119)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'f0',
      'f2',
      'fm1',
      'fa',
      'fa1-substitute',
      'fa1-simplify',
      'g0',
      'g3',
      'gm2',
      'gma-substitute',
      'gma-square',
      'gma-simplify',
      'ga1-substitute',
      'ga1-expand',
      'ga1-simplify',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('all-x')
    expect(question?.blanks.find((blank) => blank.id === 'fa1-substitute')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'gma-square')?.choices.find((choice) => choice.correct)?.id)
      .toBe('positive')
    expect(question?.blanks.find((blank) => blank.id === 'ga1-simplify')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
  })

  it('authors 120 as two independent verbal models with local domain reasoning', () => {
    const question = mathPracticeFunctionsBatchDSource.find((item) => item.problemNo === 120)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'p1-formula',
      'p1-model',
      'p1-domain-meaning',
      'p1-domain',
      'p2-distance-rule',
      'p2-traveled',
      'p2-model',
      'p2-start',
      'p2-end',
      'p2-domain',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-formula')?.choices.find((choice) => choice.correct)?.id)
      .toBe('area-formula')
    expect(question?.blanks.find((blank) => blank.id === 'p1-model')?.choices.find((choice) => choice.correct)?.id)
      .toBe('three-x')
    expect(question?.blanks.find((blank) => blank.id === 'p1-domain')?.choices.find((choice) => choice.correct)?.id)
      .toBe('x-positive')
    expect(question?.blanks.find((blank) => blank.id === 'p2-model')?.choices.find((choice) => choice.correct)?.id)
      .toBe('fifteen-minus-three-x')
    expect(question?.blanks.find((blank) => blank.id === 'p2-end')?.choices.find((choice) => choice.correct)?.id)
      .toBe('five')
    expect(question?.blanks.find((blank) => blank.id === 'p2-domain')?.choices.find((choice) => choice.correct)?.id)
      .toBe('zero-to-five-closed')
  })

  it('keeps Japanese and Chinese grading structures aligned', () => {
    const signature = (question: (typeof mathPracticePilotQuestions)[number]) => ({
      questionId: question.questionId,
      taxonomy: question.taxonomy,
      difficulty: question.difficulty,
      presentation: question.learning.presentation,
      variants: question.learning.variants,
      blanks: Object.values(question.learning.blanks).map((blank) => ({
        id: blank.id,
        answerType: blank.answerType,
        optionIds: blank.options.map((option) => option.id),
        correctOptionIds: blank.correctOptionIds,
        knowledgeTags: blank.knowledgeTags,
        skillTag: blank.skillTag,
      })),
      simulation: question.simulation.items.map((item) => ({
        id: item.id,
        answerType: item.answerType,
        optionIds: item.options?.map((option) => option.id),
        correctOptionIds: item.correctOptionIds,
        correctValue: item.correctValue,
        tolerance: item.tolerance,
        score: item.score,
      })),
    })

    expect(mathPracticePilotQuestionsZh.map(signature)).toEqual(mathPracticePilotQuestions.map(signature))
  })

  it('contains no Japanese kana in the Chinese pilot', () => {
    expect(JSON.stringify(mathPracticePilotQuestionsZh).match(/[ぁ-んァ-ン]/g)).toBeNull()
  })

  it('contains no generic Chinese fallback placeholders in published Math practice', () => {
    const serialized = JSON.stringify(mathPracticePilotQuestionsZh)

    expect(serialized).not.toContain('请选择符合当前条件的正确结论。')
    expect(serialized).not.toContain('根据题目条件与当前推理可得到这一结论。')
    expect(serialized).not.toContain('继续根据当前条件推理。')
    expect(serialized).not.toMatch(/候选\s+[1-9]/)
  })

  it('keeps formerly-fallback Chinese prompts semantically specific in 88-96', () => {
    const sourceByNo = Object.fromEntries(
      mathPracticeSetsBatchASourceZh.map((question) => [question.problemNo, question]),
    )
    const prompt = (problemNo: number, blankId: string) =>
      sourceByNo[problemNo]?.blanks.find((blank) => blank.id === blankId)?.prompt

    expect(prompt(88, 'p2-step')).toContain('正奇数')
    expect(prompt(89, 'subset-rule')).toContain('子集')
    expect(prompt(90, 'p2-zero-product')).toContain('(x-2)(x-5)=0')
    expect(prompt(91, 'p2-range')).toContain('元素')
    expect(prompt(92, 'p2-common')).toContain('公共元素')
    expect(prompt(93, 'p1-meaning')).toContain('A∩B∩C')
    expect(prompt(95, 'p3-regions')).toContain('区域')
    expect(prompt(96, 'p4-candidates')).toContain('候选范围')
    expect(prompt(96, 'p4-after-a')).toContain('去掉属于 A 的元素')
  })

  it('keeps every authored thinking blank referenced by the learning flow', () => {
    for (const question of mathPracticePilotQuestions) {
      const flowIds = question.learning.solutionFlow
        .filter((node) => node.type === 'blank')
        .map((node) => node.blankId)
      expect(new Set(flowIds)).toEqual(new Set(Object.keys(question.learning.blanks)))
    }
  })

  it('keeps explicit TeX commands escaped in authored Math-practice source files', () => {
    for (const path of [
      'src/data/mathPractice/setsBatchA.ts',
      'src/data/mathPractice/propositionsBatchB.ts',
      'src/data/mathPractice/propositionsBatchB.zh.ts',
      'src/data/mathPractice/proofsBatchC.ts',
      'src/data/mathPractice/proofsBatchC.zh.ts',
      'src/data/mathPractice/functionsBatchD.ts',
      'src/data/mathPractice/functionsBatchD.zh.ts',
    ]) {
      const authored = readFileSync(path, 'utf8')
      expect(authored).not.toMatch(/(?<!\\)\\(?!\\)/)
    }
  })

  it('preserves TeX escapes in Math 88 source strings before adaptation', () => {
    const question = mathPracticeSetsBatchASource.find((item) => item.problemNo === 88)
    expect(question).toBeDefined()

    const latex = [
      ...(question?.problem.filter((block) => block.type === 'latex').map((block) => block.latex) ?? []),
      ...(question?.guide.flatMap((node) =>
        node.type === 'content'
          ? node.blocks.filter((block) => block.type === 'latex').map((block) => block.latex)
          : [],
      ) ?? []),
    ]

    const joined = latex.join('\n')
    expect(joined).toContain('\\text')
    expect(joined).toContain('\\times')
    expect(joined).toContain('\\ldots')
    expect(joined).not.toContain('\t')
  })

  it('uses the original problem again for simulation instead of inventing a second exercise', () => {
    for (const question of mathPracticePilotQuestions) {
      expect(question.simulation.material.length).toBeGreaterThan(1)
      expect(question.simulation.items.length).toBeGreaterThan(0)
    }
  })
})
