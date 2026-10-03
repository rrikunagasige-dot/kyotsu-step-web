import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { mathPractice87To120Catalog, mathPracticePilotCatalog } from './catalog'
import { mathPracticePilotSource } from './pilot'
import { mathPracticeSetsBatchASource } from './setsBatchA'
import { mathPracticePropositionsBatchBSource } from './propositionsBatchB'
import { mathPracticePilotQuestions, mathPracticePilotQuestionsZh } from './adapter'

describe('math practice 87-120 staged integration', () => {
  it('keeps the complete 87-120 title catalog without publishing everything at once', () => {
    expect(mathPractice87To120Catalog).toHaveLength(34)
    expect(mathPractice87To120Catalog[0]?.problemNo).toBe(87)
    expect(mathPractice87To120Catalog.at(-1)?.problemNo).toBe(120)
    expect(mathPracticePilotCatalog.map((entry) => entry.problemNo)).toEqual([87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107])
  })

  it('publishes the reviewed set batch plus proposition pilots in source order', () => {
    expect(mathPracticePilotSource.map((question) => question.problemNo)).toEqual([87, 94, 97])
    expect(mathPracticePilotQuestions.map((question) => question.questionId)).toEqual(
      Array.from({ length: 21 }, (_, index) => `math-practice-${String(87 + index).padStart(3, '0')}`),
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
