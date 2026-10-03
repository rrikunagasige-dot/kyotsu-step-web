import { mathPracticeSetsBatchASource } from './setsBatchA'
import type { MathPracticeSourceBlock, MathPracticeSourceQuestion } from './source'

const titleMap: Record<string, string> = {
  '集合の表し方': '集合的表示',
  '部分集合': '子集',
  '集合の包含関係': '集合的包含关系',
  '部分集合をすべて求める': '列出所有子集',
  '共通部分と和集合': '交集与并集',
  '3つの集合': '三个集合',
  '集合を復元する': '由区域信息还原集合',
  '3集合の複合演算': '三个集合的复合运算',
}

const exactText: Record<string, string> = {
  '集合': '集合',
  '次の集合を、要素を書き並べて表せ。': '将下列集合用列举元素的形式表示。',
  'B,C,D,E のうち、集合 A の部分集合であるものはどれか。': '在 B、C、D、E 中，哪些是集合 A 的子集？',
  '次の2つの集合 A, B の間に成り立つ関係を、記号 ⊂, = を用いて表せ。': '用符号 ⊂、= 表示下列两个集合 A、B 的关系。',
  '(1) 集合 {a,b} の部分集合をすべて求めよ。': '(1) 求集合 {a,b} 的所有子集。',
  '(2) 集合 {1,2,3,4} の部分集合をすべて求めよ。': '(2) 求集合 {1,2,3,4} 的所有子集。',
  '次の各場合について、A∩B と A∪B を求めよ。': '在下列各情形中，求 A∩B 与 A∪B。',
  '次の集合を求めよ。': '求下列集合。',
  'まず ∩ と ∪ の意味を確認する。': '先确认 ∩ 与 ∪ 的含义。',
  'まず A,B,C を要素で表して比較できる形にする。': '先把 A、B、C 列成元素形式，便于比较。',
  '(1) 3つの集合すべてに入る要素だけを残す。': '(1) 只保留同时属于三个集合的元素。',
  '(2) 3つの集合の少なくとも1つに入る要素を重複なく集める。': '(2) 收集至少属于三个集合之一的元素并去重。',
  '(1) A∪B に入らない要素がどの領域にあるか考える。': '(1) 判断不属于 A∪B 的元素位于哪个区域。',
  '(2) B を、Aにも入る部分とAには入らない部分に分ける。': '(2) 把 B 分成“也属于 A”和“不属于 A”的两部分。',
  '(3) U は A,B への入り方で4領域に分かれる。与えられていない残りの領域を求める。': '(3) 按是否属于 A、B 将 U 分成四个区域，求尚未给出的区域。',
  '(1) まず A と B の共通部分を作り、その中から C にも入る要素を残す。': '(1) 先求 A∩B，再保留其中也属于 C 的元素。',
  '(2) A,B,C の少なくとも1つに入る要素を重複なく集める。': '(2) 收集至少属于 A、B、C 之一的元素并去重。',
  '(3) A と B に入り、C には入らない要素を探す。': '(3) 找出属于 A、B 但不属于 C 的元素。',
  '(4) B に入ることは必須なので、候補を B の中に絞ってから A と C の条件を確認する。': '(4) 因为必须属于 B，先把候选限制在 B 中，再检查 A、C 的条件。',
  '(5) 括弧内は (1) で求めた結果を使える。全体集合 U からその要素を除く。': '(5) 括号内可直接使用 (1) 的结果，再从全集 U 中去掉这些元素。',
  '(6) まず括弧内 A∪C を作り、その中から B に入らない要素を残す。': '(6) 先求括号内的 A∪C，再保留其中不属于 B 的元素。',
  '元の問題に戻って、自力で確認しよう。': '回到原题，独立检查自己的答案。',
}

function translateLatex(value: string) {
  return value
    .replaceAll('\\text{ は整数}', '\\text{ 是整数}')
    .replaceAll('\\text{ は偶数}', '\\text{ 是偶数}')
    .replaceAll('\\text{ は実数}', '\\text{ 是实数}')
    .replaceAll('\\text{ は8以下の自然数}', '\\text{ 是8以下的自然数}')
    .replaceAll('\\text{ は16の正の約数}', '\\text{ 是16的正因数}')
    .replaceAll('\\text{ は24の正の約数}', '\\text{ 是24的正因数}')
    .replaceAll('\\text{ は18の正の約数}', '\\text{ 是18的正因数}')
    .replaceAll('\\text{ は27の正の約数}', '\\text{ 是27的正因数}')
    .replaceAll('\\text{ の正の約数全体の集合}', '\\text{ 的所有正因数组成的集合}')
    .replaceAll('\\text{ 以下の正の奇数全体の集合}', '\\text{ 以下所有正奇数组成的集合}')
}

function looseText(value: string, fallback: string) {
  if (exactText[value]) return exactText[value]
  let next = value
    .replaceAll('部分集合', '子集')
    .replaceAll('要素', '元素')
    .replaceAll('正の約数', '正因数')
    .replaceAll('奇数', '奇数')
    .replaceAll('偶数', '偶数')
    .replaceAll('整数', '整数')
    .replaceAll('自然数', '自然数')
    .replaceAll('全体集合', '全集')
    .replaceAll('補集合', '补集')
    .replaceAll('共通部分', '交集')
    .replaceAll('和集合', '并集')
    .replaceAll('両方', '两者')
    .replaceAll('少なくとも一方', '至少一方')
    .replaceAll('入らない', '不属于')
    .replaceAll('入る', '属于')
    .replaceAll('同じ', '相同')
    .replaceAll('異なる', '不同')
    .replaceAll('ある', '有')
    .replaceAll('ない', '没有')
    .replaceAll('はい', '是')
    .replaceAll('いいえ', '否')
    .replaceAll('個', '个')
    .replaceAll('空集合', '空集')
    .replaceAll('少なくとも', '至少')
    .replaceAll('すべて', '全部')
    .replaceAll('だけ', '仅')
    .replaceAll('まで', '为止')

  return /[ぁ-んァ-ン]/.test(next) ? fallback : next
}

function translateBlock(block: MathPracticeSourceBlock, index: number): MathPracticeSourceBlock {
  if (block.type === 'latex') {
    const latex = translateLatex(block.latex)
    return {
      ...block,
      latex: /[ぁ-んァ-ン]/.test(latex)
        ? latex.replace(/\\text\{[^}]*[ぁ-んァ-ン][^}]*\}/g, '\\text{按题意}')
        : latex,
    }
  }
  return {
    ...block,
    text: looseText(block.text, index === 0 ? '请根据题目条件逐步作答。' : '继续根据当前条件推理。'),
  }
}

function translateQuestion(source: MathPracticeSourceQuestion): MathPracticeSourceQuestion {
  return {
    ...source,
    sectionTitle: '集合',
    title: titleMap[source.title] ?? '集合练习',
    problem: source.problem.map((block, index) => translateBlock(block, index)),
    guide: source.guide.map((node, index) => node.type === 'content'
      ? {
          ...node,
          blocks: node.blocks.map((block, blockIndex) =>
            translateBlock(block, index + blockIndex + 1),
          ),
        }
      : node),
    blanks: source.blanks.map((blank) => ({
      ...blank,
      prompt: looseText(blank.prompt, '请选择符合当前条件的正确结论。'),
      explanation: looseText(blank.explanation, '根据题目条件与当前推理可得到这一结论。'),
      choices: blank.choices.map((item, index) => ({
        ...item,
        label: looseText(item.label, '候选 ' + (index + 1)),
        ...(item.wrongReason
          ? { wrongReason: looseText(item.wrongReason, '请重新检查当前条件。') }
          : {}),
      })),
    })),
    simulation: source.simulation.map((item, itemIndex) => item.answerType === 'number'
      ? {
          ...item,
          label: looseText(item.label, '问题 ' + (itemIndex + 1)),
          prompt: looseText(item.prompt, '根据原题输入正确数值。'),
        }
      : {
          ...item,
          label: looseText(item.label, '问题 ' + (itemIndex + 1)),
          prompt: looseText(item.prompt, '根据原题选择正确答案。'),
          choices: item.choices.map((itemChoice, index) => ({
            ...itemChoice,
            label: looseText(itemChoice.label, '候选 ' + (index + 1)),
            ...(itemChoice.wrongReason
              ? { wrongReason: looseText(itemChoice.wrongReason, '请重新检查题目条件。') }
              : {}),
          })),
        }),
    fullExplanation: looseText(
      source.fullExplanation,
      '按照集合的定义、包含关系、交集、并集和补集的条件逐步整理即可。',
    ),
  }
}

export const mathPracticeSetsBatchASourceZh = mathPracticeSetsBatchASource.map(translateQuestion)
