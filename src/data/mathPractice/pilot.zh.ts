import { mathPracticePilotSource } from './pilot'
import type { MathPracticeSourceQuestion } from './source'

const translations: Record<string, string> = {
  '素数と集合': '素数与集合',
  'A=\\\\{x\\\\mid x\\\\text{ は30以下の素数}\\\\}': 'A=\\\\{x\\\\mid x\\\\text{ 是30以下的素数}\\\\}',
  '次の□に、∈ または ∉ のいずれか適するものを書き入れよ。': '在下列□中填入合适的 ∈ 或 ∉。',
  'ある数が A の要素かどうかは、集合 A に書かれている条件を一つずつ確認して決める。まず「30以下」だけで十分か考えよう。': '判断一个数是否属于 A，需要逐一检查集合 A 的条件。先想一想：只满足“30以下”是否足够。',
  '30以下であることに加え、もう一つ必要な条件を確認する。': '除了“30以下”以外，还要确认另一个必要条件。',
  'まず 2 を調べる。正の約数を確認しよう。': '先检查 2。确认它的正因数。',
  '次に 15。1 と 15 以外の約数があるかを調べるため、積の形を作る。': '接着看 15。为了判断是否有 1 和 15 以外的因数，把 15 写成乘积。',
  '21 も同じ基準で調べる。': '21 也用同样的标准检查。',
  '最後に 29。1 と 29 以外の正の約数を見つけられるか考える。': '最后看 29。思考能否找到 1 和 29 以外的正因数。',
  '「30以下」であることだけで A の要素と判断できるか。': '只凭“30以下”能判断它属于 A 吗？',
  '十分ではない': '不充分',
  '十分である': '充分',
  'A には「素数」という条件もあります。': 'A 还有“素数”这一条件。',
  'A の要素になるには「30以下」と「素数」の両方を満たす必要があります。': '要属于 A，必须同时满足“30以下”和“素数”。',
  '30以下であることに加えて必要な条件はどれか。': '除了“30以下”以外，还需要满足哪个条件？',
  '素数である': '是素数',
  '偶数である': '是偶数',
  '3の倍数である': '是3的倍数',
  '集合 A の定義に「素数」と書かれています。': '集合 A 的定义中写明了“素数”。',
  '2 の正の約数はどれか。': '2 的正因数是哪些？',
  '1 と 2': '1 和 2',
  '2 だけ': '只有 2',
  '2 の正の約数は 1 と 2 だけです。': '2 的正因数只有 1 和 2。',
  '2 と A の関係として正しいものはどれか。': '2 与 A 的关系哪一个正确？',
  '2 は30以下の素数なので A の要素です。': '2 是30以下的素数，所以属于 A。',
  '15 が素数か調べるために使える積はどれか。': '为了判断 15 是否为素数，可以使用哪个乘积？',
  '15 = 3 × 5 なので、1 と 15 以外の約数をもちます。': '因为 15 = 3 × 5，所以它有 1 和 15 以外的因数。',
  '15 と A の関係として正しいものはどれか。': '15 与 A 的关系哪一个正确？',
  '15 は素数ではないので A の要素ではありません。': '15 不是素数，所以不属于 A。',
  '21 が素数か調べるために使える積はどれか。': '为了判断 21 是否为素数，可以使用哪个乘积？',
  '21 = 3 × 7 なので合成数です。': '因为 21 = 3 × 7，所以它是合数。',
  '21 と A の関係として正しいものはどれか。': '21 与 A 的关系哪一个正确？',
  '21 は素数ではないので A の要素ではありません。': '21 不是素数，所以不属于 A。',
  '29 には 1 と 29 以外の正の約数があるか。': '29 是否有 1 和 29 以外的正因数？',
  'ない': '没有',
  'ある': '有',
  '29 の正の約数は 1 と 29 だけです。': '29 的正因数只有 1 和 29。',
  '29 と A の関係として正しいものはどれか。': '29 与 A 的关系哪一个正确？',
  '29 は30以下の素数なので A の要素です。': '29 是30以下的素数，所以属于 A。',
  '2, 15, 21, 29 のうち、A の要素をすべて選べ。': '从 2、15、21、29 中选出所有属于 A 的数。',
  '30以下の素数かどうかを一つずつ確認すると、2 と 29 は A の要素、15 と 21 は A の要素ではありません。': '逐一检查是否为30以下的素数可知，2 和 29 属于 A，15 和 21 不属于 A。',

  'U=\\\\{x\\\\mid1\\\\le x\\\\le10,\\\\;x\\\\text{ は整数}\\\\}': 'U=\\\\{x\\\\mid1\\\\le x\\\\le10,\\\\;x\\\\text{ 是整数}\\\\}',
  '次の集合を求めよ。': '求下列集合。',
  '補集合では、どの範囲を基準に「入っていない」と判断するかを最初に確認する。': '处理补集时，先确认以哪个全集作为“不属于”的判断范围。',
  'この式を、A と B への入り方という言葉に直してから計算する。': '先把这个式子改写成“是否属于 A、是否属于 B”的条件，再计算。',
  '今度は和集合なので、少なくとも一方に入る要素を集める。': '这次是并集，所以收集至少属于其中一个集合的元素。',
  'A にも B にも入らない要素を確認する。': '确认既不属于 A 也不属于 B 的元素。',
  '交わりではなく和になったとき、残る要素がどう変わるか確かめる。': '把交集改成并集后，观察保留下来的元素如何变化。',
  '(7) では、補集合をとる前に括弧の中を先に求める。': '在 (7) 中，先求括号内的集合，再取补集。',
  '(8) でも同様に、まず括弧の中の和集合を作る。': '在 (8) 中也一样，先求括号内的并集。',
  '補集合を考えるとき、基準にする集合はどれか。': '求补集时，以哪个集合为基准？',
  '補集合は全体集合 U の中で考えます。': '补集是在全集 U 中考虑的。',
  'A の補集合はどれか。': 'A 的补集是哪一个？',
  'U から A の要素 1,2,3,5,7 を除きます。': '从 U 中去掉 A 的元素 1,2,3,5,7。',
  'B の補集合はどれか。': 'B 的补集是哪一个？',
  'U から B の要素 2,3,8,10 を除きます。': '从 U 中去掉 B 的元素 2,3,8,10。',
  'overline(A) ∩ B に入る要素の条件はどれか。': '属于 overline(A) ∩ B 的元素需要满足什么条件？',
  'A には入らず、B には入る': '不属于 A，且属于 B',
  'A と B の両方に入る': '同时属于 A 和 B',
  'A にも B にも入らない': '既不属于 A，也不属于 B',
  'overline(A) は A に入らないこと、∩B は同時に B に入ることを表します。': 'overline(A) 表示不属于 A，而 ∩B 表示同时属于 B。',
  'overline(A) ∩ B はどれか。': 'overline(A) ∩ B 是哪一个？',
  'B={2,3,8,10} のうち A に入らないのは 8,10 です。': '在 B={2,3,8,10} 中，不属于 A 的是 8,10。',
  'A ∪ overline(B) はどれか。': 'A ∪ overline(B) 是哪一个？',
  'A と overline(B) の要素を重複なく集めます。': '把 A 和 overline(B) 的元素去重后合并。',
  'overline(A) ∩ overline(B) はどれか。': 'overline(A) ∩ overline(B) 是哪一个？',
  'A にも B にも入らない要素は 4,6,9 です。': '既不属于 A 也不属于 B 的元素是 4,6,9。',
  'overline(A) ∪ overline(B) はどれか。': 'overline(A) ∪ overline(B) 是哪一个？',
  'overline(A) と overline(B) の少なくとも一方に入る要素を集めます。': '收集至少属于 overline(A) 或 overline(B) 其中一个的元素。',
  'A ∩ B はどれか。': 'A ∩ B 是哪一个？',
  'A と B の両方にあるのは 2,3 です。': '同时属于 A 和 B 的元素是 2,3。',
  'overline(A ∩ B) はどれか。': 'overline(A ∩ B) 是哪一个？',
  'U から A∩B={2,3} を除きます。': '从 U 中去掉 A∩B={2,3}。',
  'A ∪ B はどれか。': 'A ∪ B 是哪一个？',
  'A と B の要素を重複なく集めます。': '把 A 和 B 的元素去重后合并。',
  'overline(A ∪ B) はどれか。': 'overline(A ∪ B) 是哪一个？',
  'U から A∪B={1,2,3,5,7,8,10} を除きます。': '从 U 中去掉 A∪B={1,2,3,5,7,8,10}。',
  'overline(A) を選べ。': '选择 overline(A)。',
  'overline(B) を選べ。': '选择 overline(B)。',
  'overline(A) ∩ B を選べ。': '选择 overline(A) ∩ B。',
  'A ∪ overline(B) を選べ。': '选择 A ∪ overline(B)。',
  'overline(A) ∩ overline(B) を選べ。': '选择 overline(A) ∩ overline(B)。',
  'overline(A) ∪ overline(B) を選べ。': '选择 overline(A) ∪ overline(B)。',
  'overline(A ∩ B) を選べ。': '选择 overline(A ∩ B)。',
  'overline(A ∪ B) を選べ。': '选择 overline(A ∪ B)。',
  'U の中で補集合を作り、交わり・和を一つずつ処理する。結果として overline(A∩B)=overline(A)∪overline(B)、overline(A∪B)=overline(A)∩overline(B) も具体例から確認できる。': '在 U 中先求补集，再逐步处理交集和并集。由具体计算还可以确认 overline(A∩B)=overline(A)∪overline(B)、overline(A∪B)=overline(A)∩overline(B)。',

  '共通部分から定数を決める': '由交集确定常数',
  'このとき、定数 a の値と和集合 A∪B を求めよ。': '求此时常数 a 的值以及并集 A∪B。',
  'まず A∩B={1,4} という条件から、4 がどこに入らなければならないかを読む。': '先根据 A∩B={1,4} 判断 4 必须属于哪些集合。',
  'A の3要素のうち、a によって値が変わるものを選ぶ。': '从 A 的3个元素中，找出会随 a 改变的元素。',
  '4 を A に入れるための方程式を自分で作る。': '自己列出使 4 属于 A 的方程。',
  'ただし、ここまでで確認したのは 4 が A に入ることだけ。得た値を A と B の両方へ戻し、共通部分が本当に {1,4} になるか確かめる。': '不过，到这里仅确认了 4 属于 A。把求得的值代回 A 和 B，检查交集是否真的为 {1,4}。',
  '条件と一致したら a を確定し、最後に A と B の要素を重複なく集める。': '若与条件一致，就确定 a，最后把 A 与 B 的元素去重后合并。',
  '4 は A と B のどこに入る必要があるか。': '4 必须属于 A 和 B 中的哪些集合？',
  'A と B の両方': 'A 和 B 两者',
  'A だけ': '只属于 A',
  'B だけ': '只属于 B',
  '4 は共通部分 A∩B の要素なので、A と B の両方に入ります。': '因为 4 是交集 A∩B 的元素，所以它必须同时属于 A 和 B。',
  'A={1,3,3a-2} のうち、a によって値が変わる要素はどれか。': '在 A={1,3,3a-2} 中，哪个元素会随 a 改变？',
  '1 と 3 は固定で、3a-2 だけが a によって変化します。': '1 和 3 是固定的，只有 3a-2 会随 a 改变。',
  '4 を A の要素にするために作る方程式はどれか。': '为了使 4 成为 A 的元素，应列哪个方程？',
  '変化する要素 3a-2 が 4 になればよいので 3a-2=4 と置きます。': '只需让可变元素 3a-2 等于 4，因此列出 3a-2=4。',
  '3a-2=4 を解いた a の値はどれか。': '解 3a-2=4，a 的值是多少？',
  '3a=6 より a=2 です。': '由 3a=6 得 a=2。',
  'a=2 を代入した A はどれか。': '代入 a=2 后，A 是哪一个？',
  '3a-2=4 なので A={1,3,4} です。': '因为 3a-2=4，所以 A={1,3,4}。',
  'a=2 を代入した B はどれか。': '代入 a=2 后，B 是哪一个？',
  'a+2=4、a²-2a+1=1 なので B={-5,4,1} です。': '因为 a+2=4、a²-2a+1=1，所以 B={-5,4,1}。',
  'a=2 のとき A∩B はどれか。': '当 a=2 时，A∩B 是哪一个？',
  'A={1,3,4}、B={-5,4,1} の共通要素は 1 と 4 です。': 'A={1,3,4}、B={-5,4,1} 的公共元素是 1 和 4。',
  'a=2 のとき A∪B はどれか。': '当 a=2 时，A∪B 是哪一个？',
  'A と B の要素を重複なく集めると {-5,1,3,4} です。': '把 A 和 B 的元素去重后合并，得到 {-5,1,3,4}。',
  '条件を満たす a の値を入力せよ。': '输入满足条件的 a 的值。',
  'A∪B を選べ。': '选择 A∪B。',
  'A∩B に 4 が含まれるため、A の可変要素 3a-2 を 4 と置くと a=2。代入すると A={1,3,4}, B={-5,4,1} で、共通部分は {1,4} と一致する。よって A∪B={-5,1,3,4}。': '因为 A∩B 含有 4，所以令 A 中的可变元素 3a-2=4，得到 a=2。代入后 A={1,3,4}, B={-5,4,1}，交集确为 {1,4}。因此 A∪B={-5,1,3,4}。',
}

const fixedTranslations: Record<string, string> = {
  '補集合': '补集',
  '確認': '确认',
  '問1': '问题1',
  '問2': '问题2',
}

function translate(value: string) {
  const exact = translations[value] ?? fixedTranslations[value] ?? value
  const translated = exact
    .replaceAll('は30以下の素数', '是30以下的素数')
    .replaceAll('は整数', '是整数')
  if (/[ぁ-んァ-ン]/.test(translated)) {
    throw new Error(`Missing Chinese translation for math practice pilot text: ${value}`)
  }
  return translated
}

function translateBlock<T extends { type: string }>(block: T): T {
  if (block.type === 'text') return { ...block, text: translate((block as { text: string }).text) }
  if (block.type === 'latex') return { ...block, latex: translate((block as { latex: string }).latex) }
  return block
}

function translateQuestion(source: MathPracticeSourceQuestion): MathPracticeSourceQuestion {
  return {
    ...source,
    sectionTitle: translate(source.sectionTitle),
    title: translate(source.title),
    problem: source.problem.map((block) => translateBlock(block)),
    guide: source.guide.map((node) => node.type === 'content'
      ? { ...node, blocks: node.blocks.map((block) => translateBlock(block)) }
      : node),
    blanks: source.blanks.map((blank) => ({
      ...blank,
      prompt: translate(blank.prompt),
      explanation: translate(blank.explanation),
      choices: blank.choices.map((item) => ({
        ...item,
        label: translate(item.label),
        ...(item.wrongReason ? { wrongReason: translate(item.wrongReason) } : {}),
      })),
    })),
    simulation: source.simulation.map((item) => item.answerType === 'number'
      ? { ...item, label: translate(item.label), prompt: translate(item.prompt) }
      : {
          ...item,
          label: translate(item.label),
          prompt: translate(item.prompt),
          choices: item.choices.map((choice) => ({
            ...choice,
            label: translate(choice.label),
            ...(choice.wrongReason ? { wrongReason: translate(choice.wrongReason) } : {}),
          })),
        }),
    fullExplanation: translate(source.fullExplanation),
  }
}

export const mathPracticePilotSourceZh = mathPracticePilotSource.map(translateQuestion)
