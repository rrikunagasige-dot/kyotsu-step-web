import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { T, M, C, reviewItem as item } from './reviewLessonHelpers'

// W-MATH-003 — N04-Q01 small-block review ONLY.
// Original teacher-edited Word pp.10–11, 212863 bytes,
// SHA-256 93827322a877313d4d39957dd6196c01de31f2e994baa1aac0a64b96be88eeaa.
// The original author answer booklet is not available; answers were independently derived.
// Do not insert N04-Q02 or later until the small-block visual gate is closed.
export const n04SourceToItemIds = {
  'N04-Q01': ['n04-q01-p1', 'n04-q01-p2', 'n04-q01-p3', 'n04-q01-p4', 'n04-01'],
} as const

const rawN04 = {
  schemaVersion: '1.1' as const,
  unitId: 'math-numbers-expressions-n04',
  revision: 1,
  status: 'review' as const,
  subject: 'math-1a' as const,
  chapter: {
    chapterId: 'math-ch01-numbers-expressions',
    chapterNumber: '1',
    chapterTitle: '数と式',
    unitCode: '1NUM',
    orderInChapter: 4,
    sourcePages: [10],
  },
  title: '展開に現れる同じ形をまとめる',
  subtitle: '同じ括弧を二つ掛けると、積はいくつ現れるだろう。',
  source: {
    type: 'reference' as const,
    label: 'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N04 Q01',
    rightsNote: '教師編集WordのN04原問1のみを段階化した独立ブランチ確認用教材。原作者別冊解答は未提供、正答は独立計算。N04-Q02以降・原図N04-F01は未実装。',
  },
  objectives: [
    '平方を同じ二項式の積として読み直す',
    'どの項とどの項を掛けるか、四組を漏れなく確かめる',
    '同類項をまとめる前の四項の和を構成する',
  ],
  sections: [{
    id: 'lesson',
    number: '04',
    title: '本文',
    role: 'concept' as const,
    description: '平方を積に戻し、四つの積を一つずつ確かめる。',
    figures: [],
    readingFlow: [
      { id: 'heading-four-products', type: 'heading' as const, text: '平方を四つの積にほどく' },
      { id: 'marker-n04-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-n04-intro', type: 'paragraph' as const, parts: [
        M('(5x+4y)^2'), T(' を展開しよう。二乗とは、同じ括弧を二つ掛けること。'),
        M('(5x+4y)^2=(5x+4y)(5x+4y)'),
        T('。二つの括弧のどちらにも二つの項がある。'),
      ] },
      { id: 'paragraph-n04-dialogue', type: 'paragraph' as const, parts: [
        T('花子「'), M('5x'), T(' と '), M('4y'), T(' を別々に二乗するだけで、全部の掛け算を拾えるかな？」'),
      ] },
      { id: 'paragraph-n04-four-products', type: 'paragraph' as const, parts: [
        T('一つ目の括弧の各項に、二つ目の括弧の各項を順に掛けよう。'),
        T('まず四組の積を計算する。同じ文字の項をまとめるのは、まだ先だ。'),
      ] },
      { id: 'formula-n04-q01-p1', type: 'formula' as const, derivationId: 'n04-q01-four-products', parts: [
        M('5x\\cdot5x='), C('n04-q01-p1'),
      ] },
      { id: 'formula-n04-q01-p2', type: 'formula' as const, derivationId: 'n04-q01-four-products', parts: [
        M('5x\\cdot4y='), C('n04-q01-p2'),
      ] },
      { id: 'formula-n04-q01-p3', type: 'formula' as const, derivationId: 'n04-q01-four-products', parts: [
        M('4y\\cdot5x='), C('n04-q01-p3'),
      ] },
      { id: 'formula-n04-q01-p4', type: 'formula' as const, derivationId: 'n04-q01-four-products', parts: [
        M('4y\\cdot4y='), C('n04-q01-p4'),
      ] },
      { id: 'paragraph-n04-collect-without-combining', type: 'paragraph' as const, parts: [
        T('四組をすべて確かめたら、出てきた順に足し合わせよう。'),
        T('真ん中の二つが同じ文字の項でも、ここでは分けて残す。'),
      ] },
      { id: 'formula-n04-q01-complete', type: 'formula' as const, parts: [
        M('(5x+4y)^2='), C('n04-01'),
      ] },
      { id: 'paragraph-n04-bridge', type: 'paragraph' as const, parts: [
        T('二項の平方では、両端の積だけでなく、異なる項どうしの掛け算も現れる。次は、その二つを一つにまとめる理由を考える。'),
      ] },
    ],
    items: [
      item('n04-q01-p1', '最初の組、5xと5xの積を計算しよう。', '25x^2', 'formula',
        ['10x^2', '25x', '20xy'], 'representation-link', 'strong',
        ['係数は5と5の積、文字はxとxの積。']),
      item('n04-q01-p2', '5xと4yの積を計算しよう。', '20xy', 'formula',
        ['20x^2y', '9xy', '20y'], 'representation-link', 'strong',
        ['数の部分と文字の部分を分けて掛ける。']),
      item('n04-q01-p3', '順序を入れ替えた4yと5xの積を計算しよう。', '20xy', 'formula',
        ['20y^2', '9xy', '20x'], 'causal-reasoning', 'medium',
        ['掛ける順序を入れ替えると値がどうなるか思い出そう。']),
      item('n04-q01-p4', '最後の組、4yと4yの積を計算しよう。', '16y^2', 'formula',
        ['8y^2', '16y', '20xy'], 'representation-link', 'medium',
        ['yを二つ掛けると文字の指数はどうなる？']),
      item('n04-01', '四組すべてを、同類項をまとめずに並べよう。', '25x^2+20xy+20xy+16y^2', 'formula',
        ['25x^2+20xy+16y^2', '25x^2+40xy+16y^2', '25x^2+16y^2'],
        'representation-link', 'light',
        ['四組の積が一回ずつ入っているか。中間の二つはまだ別々に残す。']),
    ],
  }],
}

export const mathNumbersN04Unit = validateTextbookUnits([rawN04])[0]
