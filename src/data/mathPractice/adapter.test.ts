import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { mathPractice87To120Catalog, mathPracticePilotCatalog } from './catalog'
import { mathPracticePilotSource } from './pilot'
import { mathPracticeSetsBatchASource } from './setsBatchA'
import { mathPracticePropositionsBatchBSource } from './propositionsBatchB'
import { mathPracticeProofsBatchCSource } from './proofsBatchC'
import { mathPracticeFunctionsBatchDSource } from './functionsBatchD'
import { mathPracticePilotQuestions, mathPracticePilotQuestionsZh } from './adapter'

describe('math practice 87-120 staged integration', () => {
  it('keeps the complete 87-120 title catalog without publishing everything at once', () => {
    expect(mathPractice87To120Catalog).toHaveLength(34)
    expect(mathPractice87To120Catalog[0]?.problemNo).toBe(87)
    expect(mathPractice87To120Catalog.at(-1)?.problemNo).toBe(120)
    expect(mathPracticePilotCatalog.map((entry) => entry.problemNo)).toEqual([87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118])
  })

  it('publishes the reviewed set, proposition and proof pilots in source order', () => {
    expect(mathPracticePilotSource.map((question) => question.problemNo)).toEqual([87, 94, 97])
    expect(mathPracticePilotQuestions.map((question) => question.questionId)).toEqual(
      Array.from({ length: 32 }, (_, index) => `math-practice-${String(87 + index).padStart(3, '0')}`),
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
    ])
  })

  it('authors 98 as a common proposition criterion plus three independent subproblems', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 98)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'definition',
      'p1-result',
      'p2-counterexample',
      'p2-result',
      'p3-objectivity',
      'p3-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p2-counterexample')?.choices.find((choice) => choice.correct)?.id)
      .toBe('forty-degree')
    expect(question?.blanks.find((blank) => blank.id === 'p3-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('not-proposition')
  })

  it('authors 99 as one inclusion rule plus four independent implication checks', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 99)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-result',
      'p2-counterexample',
      'p2-result',
      'p3-result',
      'p4-q-set',
      'p4-counterexample-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p2-counterexample')?.choices.find((choice) => choice.correct)?.id)
      .toBe('minus-one')
    expect(question?.blanks.find((blank) => blank.id === 'p4-q-set')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'p4-counterexample-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('minus-two-false')
  })

  it('authors 100 as one counterexample rule plus three independent constructions', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 100)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-counterexample',
      'p2-counterexample',
      'p3-counterexample',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-counterexample')?.choices.find((choice) => choice.correct)?.id)
      .toBe('negative-root')
    expect(question?.blanks.find((blank) => blank.id === 'p2-counterexample')?.choices.find((choice) => choice.correct)?.id)
      .toBe('minus-two')
    expect(question?.blanks.find((blank) => blank.id === 'p3-counterexample')?.choices.find((choice) => choice.correct)?.id)
      .toBe('five')
  })

  it('authors 101 as one negation rule plus three independent complements', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 101)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-result',
      'p2-result',
      'p3-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('le-minus-five')
    expect(question?.blanks.find((blank) => blank.id === 'p2-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('equals-zero')
    expect(question?.blanks.find((blank) => blank.id === 'p3-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('irrational')
  })

  it('authors 102 as one AND/OR rule plus four independent interval results', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 102)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-result',
      'p2-result',
      'p3-result',
      'p4-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('and-intersection-or-union')
    expect(question?.blanks.find((blank) => blank.id === 'p3-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('minus-one-two-open')
    expect(question?.blanks.find((blank) => blank.id === 'p4-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('minus-one-four-closed')
  })

  it('authors 103 as one semantic De Morgan rule plus five independent negations', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 103)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-result',
      'p2-result',
      'p3-result',
      'p4-result',
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
      'p1-classification',
      'p2-classification',
      'p3-classification',
      'p4-classification',
      'p5-classification',
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
      'p1-result',
      'p2-result',
      'p3-result',
      'p4-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('counterexample-false')
    expect(question?.blanks.find((blank) => blank.id === 'p2-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('both-cases-true')
    expect(question?.blanks.find((blank) => blank.id === 'p3-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('sqrt-two-false')
    expect(question?.blanks.find((blank) => blank.id === 'p4-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('conjugate-false')
  })

  it('authors 106 as one set-language rule plus four independent set expressions', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 106)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-result',
      'p2-result',
      'p3-result',
      'p4-result',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('p-inter-q')
    expect(question?.blanks.find((blank) => blank.id === 'p2-result')?.choices.find((choice) => choice.correct)?.id)
      .toBe('p-complement')
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
      'p1-classification',
      'p2-classification',
      'p3-classification',
      'p4-classification',
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
  })

  it('authors 108 as a two-direction equivalence proof with an explicit reverse sign split', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 108)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'forward',
      'reverse-sign',
      'reverse-eliminate',
      'equivalence',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('both-directions')
    expect(question?.blanks.find((blank) => blank.id === 'reverse-sign')?.choices.find((choice) => choice.correct)?.id)
      .toBe('same-sign')
    expect(question?.blanks.find((blank) => blank.id === 'reverse-eliminate')?.choices.find((choice) => choice.correct)?.id)
      .toBe('positive-remains')
    expect(question?.blanks.find((blank) => blank.id === 'equivalence')?.choices.find((choice) => choice.correct)?.id)
      .toBe('equivalent')
  })

  it('authors 109 as one quantifier-negation rule plus two independent truth checks', () => {
    const question = mathPracticePropositionsBatchBSource.find((item) => item.problemNo === 109)
    expect(question).toBeDefined()
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-negation',
      'p1-truth',
      'p2-negation',
      'p2-solve',
      'p2-truth',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'p1-negation')?.choices.find((choice) => choice.correct)?.id)
      .toBe('exists-equals')
    expect(question?.blanks.find((blank) => blank.id === 'p1-truth')?.choices.find((choice) => choice.correct)?.id)
      .toBe('x-one')
    expect(question?.blanks.find((blank) => blank.id === 'p2-negation')?.choices.find((choice) => choice.correct)?.id)
      .toBe('forall-not-equals')
    expect(question?.blanks.find((blank) => blank.id === 'p2-solve')?.choices.find((choice) => choice.correct)?.id)
      .toBe('factor-zero-five')
    expect(question?.blanks.find((blank) => blank.id === 'p2-truth')?.choices.find((choice) => choice.correct)?.id)
      .toBe('five-exists')
  })

  it('authors 110 as one relation-form rule plus three independent original/converse/contrapositive/inverse checks', () => {
    const question = mathPracticeProofsBatchCSource.find((item) => item.problemNo === 110)
    expect(question).toBeDefined()
    expect(question?.section).toBe('proofs')
    expect(question?.blanks.map((blank) => blank.id)).toEqual([
      'rule',
      'p1-original',
      'p1-converse',
      'p1-contrapositive',
      'p1-inverse',
      'p1-summary',
      'p2-original',
      'p2-converse',
      'p2-contrapositive',
      'p2-inverse',
      'p2-summary',
      'p3-original',
      'p3-converse',
      'p3-contrapositive',
      'p3-inverse',
      'p3-summary',
    ])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('correct')
    expect(question?.blanks.find((blank) => blank.id === 'p1-summary')?.choices.find((choice) => choice.correct)?.id)
      .toBe('tftf')
    expect(question?.blanks.find((blank) => blank.id === 'p2-summary')?.choices.find((choice) => choice.correct)?.id)
      .toBe('ftft')
    expect(question?.blanks.find((blank) => blank.id === 'p3-contrapositive')?.choices.find((choice) => choice.correct)?.id)
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
    expect(question?.blanks.map((blank) => blank.id)).toEqual(['rule', 'p1', 'p2', 'p3'])
    expect(question?.blanks.find((blank) => blank.id === 'rule')?.choices.find((choice) => choice.correct)?.id)
      .toBe('unique')
    expect(question?.blanks.find((blank) => blank.id === 'p1')?.choices.find((choice) => choice.correct)?.id)
      .toBe('function')
    expect(question?.blanks.find((blank) => blank.id === 'p2')?.choices.find((choice) => choice.correct)?.id)
      .toBe('counterexample')
    expect(question?.blanks.find((blank) => blank.id === 'p3')?.choices.find((choice) => choice.correct)?.id)
      .toBe('function')
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
