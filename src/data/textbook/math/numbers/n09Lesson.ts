import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { T, M, C, K, reviewItem as item, oneToOneSourceMap } from './reviewLessonHelpers'

// W-MATH-003/P-001: user-accepted exact N09 learner-design review.
// Teacher-edited original Word N09 Q1–Q14, pp.22–23; independently solved.
// N09-F01 is the unchanged original image6.png, revealed AFTER Q10 to avoid
// leaking n=-3 from the tick labels. No separate official answer booklet.
export const n09SourceToItemIds = oneToOneSourceMap('N09', 14)

const rawN09 = {
  schemaVersion: '1.1' as const,
  unitId: 'math-numbers-expressions-n09',
  revision: 1, status: 'review' as const, subject: 'math-1a' as const,
  chapter: {
    chapterId: 'math-ch01-numbers-expressions',
    chapterNumber: '1', chapterTitle: '数と式', unitCode: '1NUM',
    orderInChapter: 9, sourcePages: [22, 23],
  },
  title: '平方根の符号と数直線',
  subtitle: '根号の非負性と、負の数でも変わらない整数部分の意味を確かめる。',
  source: {
    type: 'reference' as const,
    label: 'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N09',
    rightsNote: '教師編集Wordの原問14件と元図1点に対応。原図内容を改変せず漏洩防止で表示時点のみ調整。解答は独立導出、別冊公式解答と出版社の再配布許諾は未確認。',
  },
  objectives: [
    '二つの平方根と、根号が表す非負の値を区別する',
    '符号別の場合分けから平方根と絶対値の関係を確かめる',
    '大小の挟みと0以上1未満の小数部分を正負の数へ使う',
  ],
  sections: [{
    id: 'lesson', number: '09', title: '本文', role: 'concept' as const,
    description: '符号から根号を読み、数直線で負数の整数部分へつなぐ。',
    figures: [{
      id: 'n09-f01',
      src: '/assets/math/textbook/numbers/n09-f01.png',
      alt: '元の数直線で、等間隔の目盛り-4、-3、-2、-1と、その-3と-2の間にある-2.1の点を示す。',
      caption: '直前に求めた整数の間に、負の小数の点があることを確かめよう。',
      overlays: [],
    }],
    readingFlow: [
      { id: 'heading-roots', type: 'heading' as const, text: '平方根は二つあることがある。でも根号は一つを表す' },
      { id: 'marker-roots-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-roots-question', type: 'paragraph' as const, parts: [
        T('2乗すると16になる実数を、'), K('すべて'), T('挙げよう。'),
        M('4'), T(' を2回掛けると16。負の数どうしを掛けても正になる。正負両方を平方で確かめると、'),
      ] },
      { id: 'formula-n09-01', type: 'formula' as const, parts: [
        M('x^2=16\\quad\\Longrightarrow\\quad'), C('n09-01'),
      ] },
      { id: 'paragraph-roots-definition', type: 'paragraph' as const, parts: [
        T('2乗して '), M('a'), T(' になる数を '), M('a'), T(' の '), K('平方根'),
        T(' という。正の数 '), M('a'), T(' には正負二つの平方根があり、'),
        T('正の方を '), M('\\sqrt a'), T('、負の方を '), M('-\\sqrt a'),
        T(' と書く。'), K('根号は非負の一つの数'), T('を表し、二つをまとめた記号ではない。'),
      ] },
      { id: 'marker-roots-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-roots-contrast', type: 'paragraph' as const, parts: [
        M('\\sqrt{16}'), T(' は正の平方根を選ぶ記号だが、'),
        M('(-\\sqrt5)^2'), T(' は負の平方根を実際に2乗する。二つの値を組で答えよう。'),
      ] },
      { id: 'formula-n09-02', type: 'formula' as const, parts: [
        M('\\bigl(\\sqrt{16},\\ (-\\sqrt5)^2\\bigr)='), C('n09-02'),
      ] },
      { id: 'paragraph-roots-zero', type: 'paragraph' as const, parts: [
        T('0の平方根は0だけで '), M('\\sqrt0=0'), T('。実数を2乗して負の数にはならない。負の数の平方根は、ここで扱う実数の範囲にはない。'),
      ] },

      { id: 'heading-square', type: 'heading' as const, text: '根号を外す前に、負の値を確かめる' },
      { id: 'marker-square-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-square-first', type: 'paragraph' as const, parts: [
        M('\\sqrt{(-4)^2}'), T(' は内側が '), M('-4'),
        T(' だからといって負のまま出せるだろうか。先に2乗して、根号が表す非負の値を確かめる。'),
      ] },
      { id: 'formula-n09-03', type: 'formula' as const, parts: [
        M('\\sqrt{(-4)^2}=\\sqrt{16}='), C('n09-03'),
      ] },
      { id: 'marker-square-proof', type: 'marker' as const, kind: 'proof' as const, text: '導出' },
      { id: 'paragraph-sign-cases', type: 'paragraph' as const, parts: [
        T('一般の実数 '), M('a'), T(' でも '), M('a^2=(-a)^2'),
        T(' だが、根号で選ぶのは非負の方だ。'),
        M('a\\ge0'), T(' と '), M('a<0'), T(' でそれぞれ非負の方を組で選ぶと、'),
      ] },
      { id: 'formula-n09-04', type: 'formula' as const, parts: [
        M('\\bigl(a\\ge0\\text{のとき},\\ a<0\\text{のとき}\\bigr)='), C('n09-04'),
      ] },
      { id: 'paragraph-abs-definition', type: 'paragraph' as const, parts: [
        T('0からの距離を表す '), K('絶対値'), T(' は、正でも負でも非負になる。'),
        T('先ほどの二つの場合を一つの記号へまとめると、'),
      ] },
      { id: 'formula-n09-05', type: 'formula' as const, parts: [
        M('\\sqrt{a^2}='), C('n09-05'), M('\\qquad(a\\in\\mathbb R)'),
      ] },
      { id: 'paragraph-abs-after', type: 'paragraph' as const, parts: [
        T('「2乗と根号を機械的に消す」のではない。すべての実数で結果を非負にする性質だ。'),
      ] },
      { id: 'marker-abs-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-sign-radical', type: 'paragraph' as const, parts: [
        M('\\sqrt{(2-\\sqrt5)^2}'), T(' の根号を外す前に、内側の数の符号を決める。'),
        M('2'), T(' と '), M('\\sqrt5'), T(' はどちらも非負。二乗すると4と5なので比較できる。'),
        T('すると、'),
      ] },
      { id: 'formula-n09-06', type: 'formula' as const, parts: [
        C('n09-06'),
      ] },
      { id: 'paragraph-abs-apply', type: 'paragraph' as const, parts: [
        T('今の負の符号を、絶対値を外す判断に使おう。'),
      ] },
      { id: 'formula-n09-07', type: 'formula' as const, parts: [
        M('\\sqrt{(2-\\sqrt5)^2}=|2-\\sqrt5|='), C('n09-07'),
      ] },

      { id: 'heading-approximation', type: 'heading' as const, text: '近似は平方で両側から挟んで確かめる' },
      { id: 'marker-approx-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-approx-intro', type: 'paragraph' as const, parts: [
        M('\\sqrt2'), T(' は '), M('1.41'), T(' と '), M('1.42'),
        T(' の間にあるだろうか。近似値の暗記でなく平方から確かめよう。'),
        T('両端の二乗を厳密に計算し、2を挟む不等式まで書くと、'),
      ] },
      { id: 'formula-n09-08', type: 'formula' as const, parts: [C('n09-08')] },
      { id: 'paragraph-approx-monotone', type: 'paragraph' as const, parts: [
        M('1.41'), T(' と '), M('1.42'), T(' は正なので、非負の範囲では二乗の大小と元の大小が一致する。よって、'),
      ] },
      { id: 'formula-n09-09', type: 'formula' as const, parts: [C('n09-09')] },
      { id: 'paragraph-approx-after', type: 'paragraph' as const, parts: [
        T('平方の計算と、比較する数の非負性を組にしたので、両側から挟めた。'),
      ] },

      { id: 'heading-floor', type: 'heading' as const, text: '負の数も、整数＋0以上1未満に分ける' },
      { id: 'marker-floor-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-floor-intro', type: 'paragraph' as const, parts: [
        M('-2.1'), T(' を「整数＋0以上1未満の数」に分けよう。'),
        M('-2-0.1'), T(' と書くだけでは残りが負になってしまう。'),
        T('整数 '), M('n'), T(' で '), M('n\\le x<n+1'),
        T(' を満たすものを探す。'), M('x=-2.1'), T(' で左端の整数を選ぶと、'),
      ] },
      { id: 'formula-n09-10', type: 'formula' as const, parts: [M('n='), C('n09-10')] },
      { id: 'formula-floor-confirm', type: 'formula' as const, parts: [
        M('-3\\le-2.1<-2'),
      ] },
      { id: 'figure-negative-number-line', type: 'figure' as const, figureId: 'n09-f01' },
      { id: 'paragraph-figure-after', type: 'paragraph' as const, parts: [
        T('元の数直線でも、今選んだ整数と次の整数の間に点がある。'),
        T('この整数からの残りを、0以上1未満にそろえると、'),
      ] },
      { id: 'formula-n09-11', type: 'formula' as const, parts: [M('-2.1='), C('n09-11')] },
      { id: 'paragraph-floor-definition', type: 'paragraph' as const, parts: [
        M('n\\le x<n+1'), T(' を満たす整数 '), M('n'), T(' を '), M('x'), T(' の '),
        K('整数部分'), T('、残り '), M('x-n'), T(' を '), K('小数部分'), T('という。'),
        T('小数部分は必ず '), M('0\\le x-n<1'), T('。負数の表示から小数桁を切り出す操作ではない。'),
      ] },

      { id: 'heading-root-parts', type: 'heading' as const, text: '正負の根号を、同じ定義で挟む' },
      { id: 'marker-parts-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-parts-root', type: 'paragraph' as const, parts: [
        M('\\sqrt{10}'), T(' と '), M('-\\sqrt{10}'), T(' の整数部分・小数部分を求めよう。'),
        M('3^2=9'), T('、'), M('4^2=16'), T('。'),
        M('9<10<16'), T(' から正の根号を隣り合う整数で挟むと、'),
      ] },
      { id: 'formula-n09-12', type: 'formula' as const, parts: [C('n09-12')] },
      { id: 'paragraph-parts-minus', type: 'paragraph' as const, parts: [
        T('次に不等式の全体へ '), M('-1'), T(' を掛けると向きが逆になる。小さい順に並べ直すと、'),
      ] },
      { id: 'formula-n09-13', type: 'formula' as const, parts: [C('n09-13')] },
      { id: 'paragraph-parts-final', type: 'paragraph' as const, parts: [
        T('どちらも「整数＋0以上1未満」の形にする。正負それぞれの（整数部分,小数部分）の組は、'),
      ] },
      { id: 'formula-n09-14', type: 'formula' as const, parts: [C('n09-14')] },
      { id: 'paragraph-final-bridge', type: 'paragraph' as const, parts: [
        T('二乗の結果に加えて、根号が表す'), K('非負の値'),
        T('を確認した。数の位置を隣接する整数で挟めば負数の小数部分も常に0以上1未満になる。'),
        T('次はこの考えを根号の積や商の計算の証明へ使う。'),
      ] },
    ],
    items: [
      item('n09-01','二乗して16になる実数をすべて書こう。','x=4,\\ -4','formula',
        ['x=4','x=-4','x=16,\\ -16'],'concept-formation','strong',['正の数と負の数を両方二乗して確かめよう。']),
      item('n09-02','根号の値と負の平方根の二乗を組で選ぼう。','(4,\\ 5)','formula',
        ['(\\pm4,\\ 5)','(-4,\\ 5)','(4,\\ -5)'],'representation-link','strong',['一つ目は非負の平方根、二つ目は平方した結果。']),
      item('n09-03','内側を平方した後、根号の非負の値は？','4','formula',
        ['-4','\\pm4','16'],'causal-reasoning','medium',['根号で表す数は負にはならない。']),
      item('n09-04','aの符号に応じた非負の方を組で書こう。','(a,\\ -a)','formula',
        ['(a,\\ a)','(-a,\\ -a)','(-a,\\ a)'],'causal-reasoning','medium',['aが負のときは-aが非負になる。']),
      item('n09-05','二つの場合を絶対値でまとめよう。','|a|','formula',
        ['a','-a','a^2'],'concept-formation','medium',['負のaの場合にも非負になる記号を選ぼう。']),
      item('n09-06','平方の比較から中身の符号を決めよう。','2-\\sqrt5<0','formula',
        ['2-\\sqrt5>0','2-\\sqrt5=0','2-\\sqrt5\\ge0'],'causal-reasoning','medium',['どちらも非負なので、平方した4と5の大小で比べられる。']),
      item('n09-07','負の中身の絶対値を非負の式にしよう。','\\sqrt5-2','formula',
        ['2-\\sqrt5','\\sqrt5+2','-(2+\\sqrt5)'],'transfer','medium',['中身が負なので、符号を反対にすると非負になる。']),
      item('n09-08','両方の小数を平方し、2を挟もう。','1.41^2=1.9881<2<2.0164=1.42^2','formula',
        ['1.41^2=1.9981<2<2.0164=1.42^2',
         '1.41^2=1.9881<2<2.0104=1.42^2',
         '1.41^2=1.9881<2>2.0164=1.42^2'],'representation-link','medium',
        ['141と142をそれぞれ二乗し、分母10000で戻して2と比較しよう。']),
      item('n09-09','正の数の大小へ戻して根号を挟もう。','1.41<\\sqrt2<1.42','formula',
        ['1.42<\\sqrt2<1.41','1.41>\\sqrt2>1.42','1.41=\\sqrt2'],'causal-reasoning','medium',
        ['両端が正なので平方の比較を逆にたどれる。']),
      item('n09-10','n≤−2.1<n+1の左端の整数を選ぼう。','-3','formula',
        ['-2','-1','-4'],'graph-reading','medium',['左の整数が-2だと、-2≤-2.1は成り立つだろうか。']),
      item('n09-11','整数と0以上1未満の残りに分けよう。','-3+0.9','formula',
        ['-2-0.1','-2+0.1','-3-0.9'],'representation-link','medium',['残りは0以上1未満、整数部分からの差を引く。']),
      item('n09-12','9<10<16から隣接整数で挟もう。','3<\\sqrt{10}<4','formula',
        ['2<\\sqrt{10}<3','3<\\sqrt{10}<3','4<\\sqrt{10}<5'],'transfer','light',
        ['3と4の平方の間に10があるかを確かめる。']),
      item('n09-13','不等式全体へ-1を掛けよう。','-4<-\\sqrt{10}<-3','formula',
        ['-3<-\\sqrt{10}<-4','-5<-\\sqrt{10}<-4','-3<-\\sqrt{10}<-2'],'transfer','light',
        ['負を掛けると向きは逆転し、小さい順に並べ直す。']),
      item('n09-14','正負の整数部分・小数部分を組で選ぼう。',
        '\\begin{aligned}\\sqrt{10}&:(3,\\sqrt{10}-3)\\\\-\\sqrt{10}&:(-4,4-\\sqrt{10})\\end{aligned}',
        'formula',
        ['\\begin{aligned}\\sqrt{10}&:(3,\\sqrt{10}-3)\\\\-\\sqrt{10}&:(-3,3-\\sqrt{10})\\end{aligned}',
         '\\begin{aligned}\\sqrt{10}&:(3,\\sqrt{10}-3)\\\\-\\sqrt{10}&:(-3,\\sqrt{10}-3)\\end{aligned}',
         '\\begin{aligned}\\sqrt{10}&:(4,\\sqrt{10}-4)\\\\-\\sqrt{10}&:(-4,4-\\sqrt{10})\\end{aligned}'],
        'transfer','light',['正負どちらも小数部分が0以上1未満か検算する。']),
    ],
  }],
}

export const mathNumbersN09Unit = validateTextbookUnits([rawN09])[0]
