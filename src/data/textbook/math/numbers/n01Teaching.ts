import type { TextbookReadingBlock, TextbookUnit } from '../../../../domain/textbookSchema'
import { C, M, T, reviewItem } from './reviewLessonHelpers'

// R3: replace one entire teaching sequence, rather than inserting more fragments.
// The previous edition is retained in n01Lesson's raw/R2 source and Git history.
export const n01RetiredItems = ['n01-02a', 'n01-02b', 'n01-02c', 'n01-09a', 'n01-09b',
  'n01-bridge-detail-coefficient-negative', 'n01-bridge-detail-degree-linear',
  'n01-bridge-detail-coefficient-one', 'n01-bridge-detail-degree-total',
  'n01-bridge-audit-cancel-cube', 'n01-bridge-audit-cancel-linear'] as const

function p(id: string, text: string, derivationId?: string): TextbookReadingBlock {
  return { id, type: 'paragraph', parts: [T(text)], derivationId }
}
function f(id: string, latex: string, derivationId?: string): TextbookReadingBlock {
  return { id, type: 'formula', parts: [M(latex)], derivationId }
}
function h(id: string, text: string): TextbookReadingBlock { return { id, type: 'heading', text } }
function hole(id: string, stem: string, itemId: string, tail: string, chain: string): TextbookReadingBlock {
  return { id, type: 'formula', parts: [M(stem), C(itemId), ...(tail ? [M(tail)] : [])], derivationId: chain }
}
const localItem = (id: string, prompt: string, answer: string, wrong: [string, string], hint: string) =>
  reviewItem(id, prompt, answer, 'formula', wrong, 'causal-reasoning', 'medium', [hint])

export function teachN01(unit: TextbookUnit): TextbookUnit {
  const section = unit.sections[0]
  const flow = section.readingFlow
  const start = flow.findIndex(b => b.id === 'paragraph-coefficient-compare')
  const end = flow.findIndex(b => b.id === 'heading-variable')
  const sample = flow.findIndex(b => b.id === 'marker-degree-check')
  const interpretation = flow.findIndex(b => b.id === 'paragraph-n01-10a')
  if (!(start >= 0 && end > start && sample > end && interpretation > sample)) throw Error('N01 R3 source boundaries changed')
  const coefficients: TextbookReadingBlock[] = [
    p('n01-r3-coefficient-intro', '係数と次数を、一つずつ確かめます。まず数の部分を読み取り、次に掛け合わせた文字の個数を数えます。'),
    h('n01-r3-negative-heading', '−2xの係数と次数'),
    p('n01-r3-negative-lead', '−2xを掛け算に戻すと、−2×xです。符号を含む数の部分が係数です。', 'n01-r3-negative'),
    hole('n01-r3-negative-coefficient-formula', '-2x=(', 'n01-bridge-r3-negative-coefficient', ')\\times x', 'n01-r3-negative'),
    p('n01-r3-negative-degree-lead', '次に次数を見ます。掛けている文字はxが一つなので、その個数を入れます。', 'n01-r3-negative'),
    hole('n01-r3-negative-degree-formula', '\\text{次数}=', 'n01-bridge-r3-negative-degree', '', 'n01-r3-negative'),
    h('n01-r3-square-heading', 'x²の係数と次数'),
    p('n01-r3-square-lead', 'x²は、xを二つ掛けた式です。文字の前に数がない場合は、1が省略されています。', 'n01-r3-square'),
    hole('n01-r3-square-coefficient-formula', 'x^2=', 'n01-bridge-r3-square-coefficient', '\\times x\\times x', 'n01-r3-square'),
    hole('n01-r3-square-degree-formula', '\\text{次数}=', 'n01-bridge-r3-square-degree', '', 'n01-r3-square'),
    h('n01-r3-product-heading', '−x²y²の係数と次数'),
    p('n01-r3-product-lead', '最初に扱った−x²y²も、同じ順に読みます。前の負号を数の部分に含めて、係数を入れます。', 'n01-r3-product'),
    hole('n01-r3-product-coefficient-formula', '-x^2y^2=(', 'n01-bridge-r3-product-coefficient', ')\\times x\\times x\\times y\\times y', 'n01-r3-product'),
    p('n01-r3-product-degree-lead', '次数は、xとyを合わせて数えます。xが二つ、yが二つなので、2+2を計算します。', 'n01-r3-product'),
    hole('n01-r3-product-degree-formula', '\\text{次数}=2+2=', 'n01-bridge-r3-product-degree', '', 'n01-r3-product'),
  ]
  const example: TextbookReadingBlock[] = [
    { id: 'marker-degree-check', type: 'marker', kind: 'example', text: '例題｜同類項をまとめる' },
    p('paragraph-cancellation-intro', '次の式を、同類項をまとめて簡単にしましょう。'),
    f('formula-cancellation-original', 'x^3-2x^2+x-x^3+3x-1'),
    h('n01-r3-plan', '解き方の見通し'),
    p('n01-r3-plan-text', '同類項は、文字の部分が同じ項です。同類項どうしは、係数を計算して一つにまとめられます。この式では、一次の項、二次の項、三次の項、定数項の順に確かめ、最後に結果を組み合わせます。'),
    h('n01-r3-linear-heading', '① 一次の項をまとめる'),
    p('n01-r3-linear-target', '元の式から、文字の部分がxの項を取り出します。項を取り出すときは、その項の前の符号も一緒に見ます。', 'n01-r3-linear'),
    f('n01-r3-linear-locate', 'x^3-2x^2+\\underbrace{x}_{\\text{一次の項}}-x^3+\\underbrace{3x}_{\\text{一次の項}}-1', 'n01-r3-linear'),
    p('n01-r3-linear-reason', '一次の項はxと3xです。xには係数の1が省略されているので、x=1xと考えます。', 'n01-r3-linear'),
    f('n01-r3-linear-expand', 'x+3x=1x+3x', 'n01-r3-linear'),
    p('n01-r3-linear-operation', '同じxが1個と3個あるので、文字の部分xを残して係数を足します。', 'n01-r3-linear'),
    f('n01-r3-linear-factor', '1x+3x=(1+3)x', 'n01-r3-linear'),
    hole('n01-r3-linear-calculate', '(1+3)x=', 'n01-bridge-r3-linear', 'x', 'n01-r3-linear'),
    p('n01-r3-linear-result-text', '一次の項は4xにまとまりました。この結果を、最後に式全体を組み立てるときに使います。', 'n01-r3-linear'),
    f('n01-r3-linear-result', '\\text{一次の項：}4x', 'n01-r3-linear'),
    h('n01-r3-quadratic-heading', '② 二次の項を確かめる'),
    p('n01-r3-quadratic-text', '文字の部分がx²の項は、−2x²だけです。ほかに同類項がないため、この項はそのまま残します。', 'n01-r3-quadratic'),
    f('n01-r3-quadratic-result', '\\text{二次の項：}-2x^2', 'n01-r3-quadratic'),
    h('n01-r3-cubic-heading', '③ 三次の項をまとめる'),
    p('n01-r3-cubic-target', '文字の部分がx³の項は、x³と−x³です。一次の項と同じように、文字の部分を残して係数を計算します。', 'n01-r3-cubic'),
    f('n01-r3-cubic-expand', 'x^3-x^3=1x^3-1x^3', 'n01-r3-cubic'),
    f('n01-r3-cubic-factor', '1x^3-1x^3=(1-1)x^3', 'n01-r3-cubic'),
    p('n01-r3-cubic-operation', '二つの項の係数を引き算します。1−1の計算結果を入れます。', 'n01-r3-cubic'),
    hole('n01-r3-cubic-calculate', '(1-1)x^3=', 'n01-bridge-r3-cubic', 'x^3', 'n01-r3-cubic'),
    f('n01-r3-cubic-zero', '0x^3=0', 'n01-r3-cubic'),
    p('n01-r3-cubic-result-text', '三次の項をまとめた結果は0です。したがって、最後の式には三次の項が残りません。', 'n01-r3-cubic'),
    f('n01-r3-cubic-result', '\\text{三次の項：}0', 'n01-r3-cubic'),
    h('n01-r3-constant-heading', '④ 定数項を確かめる'),
    p('n01-r3-constant-text', '定数項は、文字を含まない項です。元の式では−1なので、そのまま残します。', 'n01-r3-constant'),
    f('n01-r3-constant-result', '\\text{定数項：}-1', 'n01-r3-constant'),
    h('n01-r3-assembly-heading', '⑤ 求めた結果で式全体をまとめる'),
    p('n01-r3-assembly-lead', 'ここまでの結果を、次数の高い順に並べて確かめます。'),
    f('n01-r3-results-table', '\\begin{array}{c|r}\\text{種類}&\\text{まとめた結果}\\\\\\hline\\text{三次の項}&0\\\\\\text{二次の項}&-2x^2\\\\\\text{一次の項}&4x\\\\\\text{定数項}&-1\\end{array}'),
    p('n01-r3-assembly-rule', '0になった三次の項は省きます。二次の項・一次の項・定数項は同類項ではないため、これ以上一つの項にはまとめられません。①で求めた一次の項を、次の空欄に戻します。', 'n01-r3-assembly'),
    hole('n01-r3-assembly-reuse', '-2x^2+', 'n01-bridge-r3-reuse', '-1', 'n01-r3-assembly'),
    p('n01-r3-assembly-return', 'これで元の式のすべての項を整理できました。元の式と答えをつなぐと、次のようになります。', 'n01-r3-assembly'),
    f('n01-r3-final-equation', 'x^3-2x^2+x-x^3+3x-1=-2x^2+4x-1', 'n01-r3-assembly'),
    p('n01-r3-method-summary', '同じ文字の部分を持つ項だけをまとめます。まとめた結果が0になった項は省き、残る項を次数の高い順に並べます。', 'n01-r3-assembly'),
    h('n01-r3-interpret-heading', '整理後の式から次数を読む'),
  ]
  const newItems = [
    localItem('n01-bridge-r3-negative-coefficient', '−2xの数の部分を、符号も含めて入れます。', '-2', ['2', '-1'], '−2x=(−2)×xです。前の負号も数の部分に含めます。'),
    localItem('n01-bridge-r3-negative-degree', '−2xに掛けている文字の個数を入れます。', '1', ['2', '0'], '係数の−2ではなく、文字xの個数を数えます。'),
    localItem('n01-bridge-r3-square-coefficient', 'x²で省略されている数の部分を入れます。', '1', ['2', '0'], '指数の2はxの個数です。数の部分は1です。'),
    localItem('n01-bridge-r3-square-degree', 'x²=x×xに掛けている文字の個数を入れます。', '2', ['1', '0'], 'xを二つ掛けています。'),
    localItem('n01-bridge-r3-product-coefficient', '−x²y²の数の部分を、符号も含めて入れます。', '-1', ['1', '-4'], '負号は−1を掛けることを表します。'),
    localItem('n01-bridge-r3-product-degree', 'xとyを合わせた個数を入れます。', '4', ['2', '3'], 'xが二つ、yが二つなので、2+2を計算します。'),
    localItem('n01-bridge-r3-linear', '係数の計算1+3の結果を入れます。', '4', ['3', '4x'], '空欄の外にxがあります。空欄には係数だけを入れます。'),
    localItem('n01-bridge-r3-cubic', '係数の計算1−1の結果を入れます。', '0', ['1', '2'], '引き算です。同じ数から同じ数を引きます。'),
    localItem('n01-bridge-r3-reuse', '①で求めた一次の項を、式全体へ戻します。', '4x', ['4x^2', '4'], 'ここは係数だけの空欄ではありません。一次の項を、文字xも含めて戻します。'),
  ]
  const readingFlow = [...flow.slice(0, start), ...coefficients, ...flow.slice(end, sample), ...example, ...flow.slice(interpretation)]
  const items = [...section.items.filter(q => !n01RetiredItems.some(id => id === q.id)), ...newItems]
  const order = readingFlow.flatMap(b => b.type === 'paragraph' || b.type === 'formula' ? b.parts.filter(part => part.type === 'choice').map(part => part.itemId) : [])
  items.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  return { ...unit, revision: unit.revision + 1, sections: [{ ...section, items, readingFlow }] }
}
