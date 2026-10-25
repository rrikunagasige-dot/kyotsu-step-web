import authored from './n12Authored.json'
import { validateTextbookUnits } from '../../../../domain/textbookSchema'
import { T, M, C, K, reviewItem as item, oneToOneSourceMap } from './reviewLessonHelpers'

// W-MATH-003 / approved N12 learner copy, original Word pp.30–32.
// 15 independently solved questions and exact original images 9,10,11.
// F03 (shows the solution) MUST only appear after Q15 is answered.
// Review only; separate original answer booklet was not provided.
export const n12LegacySourceToItemIds = oneToOneSourceMap('N12', 15)

const rawN12 = {
  schemaVersion: '1.1' as const,
  unitId: 'math-numbers-expressions-n12', revision: 3,
  status: 'review' as const, subject: 'math-1a' as const,
  chapter: {
    chapterId: 'math-ch01-numbers-expressions', chapterNumber: '1',
    chapterTitle: '数と式', unitCode: '1NUM', orderInChapter: 12,
    sourcePages: [30, 31, 32],
  },
  title: '連立不等式と整数条件',
  subtitle: '条件の共通部分を確かめ、現実の個数に戻して考える。',
  source: {
    type: 'reference' as const,
    label: 'ユーザー提供「数と式」教科書モード対話段階導入版 v2 / N12',
    rightsNote: '教師編集WordのN12原問15件と元図3点を対応させたレビュー用新規学習本文。元の別冊解答は未提供・独立数学監査。出版社素材の独立再配布許諾を主張しない。',
  },
  objectives: [
    '複数の不等式の解の共通部分を端点も含めて読む',
    '三連不等式を二つの条件に分けて解く',
    '代金の条件と整数の個数条件を組み合わせて確かめる',
  ],
  sections: [{
    id: 'lesson', number: '12', title: '本文', role: 'concept' as const,
    description: '数直線で共通部分を考え、整数の個数へ戻る。',
    figures: [
      {
        id: 'n12-f01', src: '/assets/math/textbook/numbers/n12-f01.png',
        alt: '二つの不等式を別々の段に表した元の数直線。左端は白丸、右端は黒丸。',
        caption: '二つの条件の範囲を上下で比べよう。共通部分はまだ選ばない。',
        overlays: [],
      },
      {
        id: 'n12-f02', src: '/assets/math/textbook/numbers/n12-f02.png',
        alt: '上限が2と5/3で異なる二つの範囲を示した元の二段の数直線。',
        caption: '上下のどちらの上限まで残るかを考えよう。',
        overlays: [],
      },
      {
        id: 'n12-f03', src: '/assets/math/textbook/numbers/n12-f03.png',
        alt: '最後の検算まで終えた後のまとめの数直線。整数の解を示している。',
        caption: '整数条件と金額の検算を終えた後のまとめ。',
        overlays: [],
      },
    ],
    readingFlow: [
      { id: 'heading-system', type: 'heading' as const, text: '二つの条件の共通部分を探す' },
      { id: 'marker-system-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-system-intro', type: 'paragraph' as const, parts: [
        T('次の二つの不等式を'), K('同時に'), T('満たす実数 '), M('x'), T(' を求めよう。'),
      ] },
      { id: 'formula-system', type: 'formula' as const, parts: [
        M('\\begin{cases}x-2<3x+5\\\\x+4\\le5-x\\end{cases}'),
      ] },
      { id: 'paragraph-system-first', type: 'paragraph' as const, parts: [
        T('まず別々に解く。一つ目では、'), M('x'), T(' の項を右にまとめて、'),
      ] },
      { id: 'formula-q01-coef', type: 'formula' as const, derivationId: 'solve-first', parts: [
        M('x-2<3x+5\\quad\\Longrightarrow\\quad-2<'), C('n12-p002-q01-coef'), M('x+5'),
      ] },
      { id: 'paragraph-q01-const', type: 'paragraph' as const, derivationId: 'solve-first', parts: [
        T('ここまでで x の係数を求めた。続いて両辺から5を引いて、左側の定数を計算しよう。'),
      ] },
      { id: 'formula-q01-const', type: 'formula' as const, derivationId: 'solve-first', parts: [
        M('-2<2x+5\\quad\\Longrightarrow\\quad'), C('n12-p002-q01-const'), M('<2x'),
      ] },
      { id: 'paragraph-system-first-after', type: 'paragraph' as const, derivationId: 'solve-first', parts: [
        T('両辺から同じ数を引いても不等号の向きは変わらない。最後は正の2で割ろう。'),
      ] },
      { id: 'formula-n12-01', type: 'formula' as const, derivationId: 'solve-first', parts: [M('-7<2x\\quad\\Longrightarrow\\quad'), C('n12-01')] },
      { id: 'paragraph-system-second', type: 'paragraph' as const, parts: [
        T('二つ目でも、'), M('x'), T(' を片方に集める。'),
      ] },
      { id: 'formula-q02-coef', type: 'formula' as const, derivationId: 'solve-second', parts: [
        M('x+4\\le5-x\\quad\\Longrightarrow\\quad'), C('n12-p002-q02-coef'), M('x+4\\le5'),
      ] },
      { id: 'paragraph-q02-const', type: 'paragraph' as const, derivationId: 'solve-second', parts: [
        T('両辺から4を引く。等号を含む不等号はそのまま残そう。'),
      ] },
      { id: 'formula-q02-const', type: 'formula' as const, derivationId: 'solve-second', parts: [
        M('2x+4\\le5\\quad\\Longrightarrow\\quad2x\\le'), C('n12-p002-q02-const'),
      ] },
      { id: 'paragraph-system-second-after', type: 'paragraph' as const, derivationId: 'solve-second', parts: [
        T('残った係数2は正なので、割っても不等号の向きはそのまま。'),
      ] },
      { id: 'formula-n12-02', type: 'formula' as const, derivationId: 'solve-second', parts: [M('2x\\le1\\quad\\Longrightarrow\\quad'), C('n12-02')] },
      { id: 'figure-first-lines', type: 'figure' as const, figureId: 'n12-f01' },
      { id: 'paragraph-system-figure', type: 'paragraph' as const, parts: [
        T('数直線の○はその端点を含まず、●は含むという意味である。上下どちらか片方に入ればよいのだろうか。'),
      ] },
      { id: 'paragraph-n12-03', type: 'paragraph' as const, parts: [
        T('例えば '), M('x=1'), T(' を試そう。一つ目を満たすだけでなく、二つ目も満たすかを確かめると、'),
        M('x=1'), T(' は '), C('n12-03'), T('。'),
      ] },
      { id: 'paragraph-system-overlap', type: 'paragraph' as const, parts: [
        T('「同時に満たす」とは、どちらの範囲にも入っているということである。二本の図の'),
        K('共通部分'), T('を端点の違いも含めて書くと、'),
      ] },
      { id: 'formula-n12-04', type: 'formula' as const, parts: [C('n12-04')] },
      { id: 'paragraph-system-term', type: 'paragraph' as const, parts: [
        T('このように二つ以上の不等式を組にしたものを'), K('連立不等式'),
        T('という。答えは各不等式の解の共通部分であって、どちらか一方の解全部ではない。'),
      ] },
      { id: 'marker-system-check', type: 'marker' as const, kind: 'check' as const, text: '確認' },
      { id: 'paragraph-triple-intro', type: 'paragraph' as const, parts: [
        T('今度は、'), M('3x+2\\le2x+4\\le9-x'),
        T(' を考えよう。三つの式が並ぶときも、中央の式を使って二つの条件に分ける。まず必要な二つの不等式は '),
        C('n12-05'), T('。'),
      ] },
      { id: 'paragraph-triple-solve', type: 'paragraph' as const, parts: [
        T('二つを一度に片づけず、まず左側の不等式から。'),
      ] },
      { id: 'formula-q06-left-coef', type: 'formula' as const, derivationId: 'triple-solve', parts: [
        M('3x+2\\le2x+4\\quad\\Longrightarrow\\quad'), C('n12-p002-q06-left-coef'), M('x+2\\le4'),
      ] },
      { id: 'paragraph-q06-left-const', type: 'paragraph' as const, derivationId: 'triple-solve', parts: [
        T('係数1はふつう書かず、1x=x と表す。次は両辺から2を引こう。'),
      ] },
      { id: 'formula-q06-left-const', type: 'formula' as const, derivationId: 'triple-solve', parts: [
        M('x+2\\le4\\quad\\Longrightarrow\\quad x\\le'), C('n12-p002-q06-left-const'),
      ] },
      { id: 'paragraph-triple-right', type: 'paragraph' as const, derivationId: 'triple-solve', parts: [
        T('続いて右側。'), M('-x'), T(' を左に移した後、定数項を整理しよう。'),
      ] },
      { id: 'formula-q06-right-coef', type: 'formula' as const, derivationId: 'triple-solve', parts: [
        M('2x+4\\le9-x\\quad\\Longrightarrow\\quad'), C('n12-p002-q06-right-coef'), M('x+4\\le9'),
      ] },
      { id: 'paragraph-q06-right-const', type: 'paragraph' as const, derivationId: 'triple-solve', parts: [
        T('左側へ移した x の係数を確かめたら、両辺から4を引こう。'),
      ] },
      { id: 'formula-q06-right-const', type: 'formula' as const, derivationId: 'triple-solve', parts: [
        M('3x+4\\le9\\quad\\Longrightarrow\\quad3x\\le'), C('n12-p002-q06-right-const'),
      ] },
      { id: 'paragraph-triple-compare', type: 'paragraph' as const, derivationId: 'triple-solve', parts: [
        T('それぞれの結果を比べる。右側の不等式は正の3で割る。'),
      ] },
      { id: 'formula-n12-06', type: 'formula' as const, derivationId: 'triple-solve', parts: [
        M('\\begin{cases}x\\le2\\\\3x\\le5\\end{cases}\\quad\\Longrightarrow\\quad'), C('n12-06'),
      ] },
      { id: 'figure-triple-lines', type: 'figure' as const, figureId: 'n12-f02' },
      { id: 'paragraph-triple-limit', type: 'paragraph' as const, parts: [
        T('両方の条件を満たすには、'), M('x=2'), T(' まで残してよいだろうか。'),
        T('二つの上限のうち、実際に残せる範囲を選ぶと、'),
      ] },
      { id: 'formula-n12-07', type: 'formula' as const, parts: [C('n12-07')] },
      { id: 'paragraph-triple-after', type: 'paragraph' as const, parts: [
        T('元の三連不等式では、左端と右端だけを比べても不十分である。中央の式との二つの比較が、両方必要になる。'),
      ] },

      { id: 'heading-integer', type: 'heading' as const, text: '数値の範囲を、実際の個数に戻す' },
      { id: 'marker-integer-example', type: 'marker' as const, kind: 'example' as const, text: '例題' },
      { id: 'paragraph-count-intro', type: 'paragraph' as const, parts: [
        T('50円の箱に、1個180円のシュークリームと1個130円のプリンを合わせて20個入れる。全体の金額を3200円以上3300円未満にしたい。シュークリームを何個にできるだろう。'),
      ] },
      { id: 'paragraph-n12-08', type: 'paragraph' as const, parts: [
        T('シュークリームの個数を '), M('x'), T(' とする。残りはすべてプリンだから、プリンの個数は '), C('n12-08'), T('。'),
      ] },
      { id: 'paragraph-n12-09', type: 'paragraph' as const, parts: [
        T('どちらも個数であり、20個の内訳である。'), M('x'),
        T(' の'), K('範囲と数の種類'), T('は '), C('n12-09'),
        T('。ここで整数条件を保存しておこう。後で不等式を解いても、この条件は消えない。'),
      ] },
      { id: 'paragraph-cost-intro', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('ここからは、個数を使って合計金額を作る。'), M('T(x)'), T(' が表すのは '),
        C('n12-p003-q10-meaning'), T(' である。'),
      ] },
      { id: 'paragraph-cost-cream', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('まずシュークリーム。1個180円を'), M('x'), T(' 個買う。単価と個数を掛けた式を作ろう。'),
      ] },
      { id: 'formula-cost-cream', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('180\\times x='), C('n12-p003-q10-cream-coef'), M('x'),
      ] },
      { id: 'paragraph-cost-pudding', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('次はプリン。個数はさっき求めた'), M('20-x'), T(' 個で、1個130円。'),
      ] },
      { id: 'formula-cost-pudding', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('130\\times(20-x)='), C('n12-p003-q10-pudding-coef'), M('(20-x)'),
      ] },
      { id: 'paragraph-cost-box-fee', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('お菓子代だけではなく、箱そのものの代金も必要だ。箱の固定代金は '),
        C('n12-p003-q10-box-fee'), T(' 円。'),
      ] },
      { id: 'paragraph-cost-assemble', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('今求めた三つの代金を足し、'), M('T(x)'), T(' を一つの式にまとめよう。'),
      ] },
      { id: 'formula-n12-10', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('T(x)='), C('n12-10'),
      ] },
      { id: 'paragraph-cost-bound', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('目標の金額は3200円'), K('以上'), T('、3300円'), K('未満'), T('。まずそれぞれの不等号を決めよう。'),
      ] },
      { id: 'formula-cost-lower-bound', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('3200'), C('n12-p003-q11-lower-sign'), M('T(x)'),
      ] },
      { id: 'formula-cost-upper-bound', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('T(x)'), C('n12-p003-q11-upper-sign'), M('3300'),
      ] },
      { id: 'paragraph-cost-bound-assemble', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('両方の条件を満たすように、さっきの合計金額の式を代入する。'),
      ] },
      { id: 'formula-n12-11', type: 'formula' as const, derivationId: 'cost-range', parts: [
        C('n12-11'),
      ] },
      { id: 'paragraph-cost-simplify', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('次は括弧を展開する。まずプリン20個分に当たる定数を計算しよう。'),
      ] },
      { id: 'formula-cost-product-constant', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('130\\times20='), C('n12-p003-q12-product-constant'),
      ] },
      { id: 'paragraph-cost-negative', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('もう一方の'), M('-x'), T(' にも130を掛ける。負号を忘れずに式内へ入れよう。'),
      ] },
      { id: 'formula-q12-signed-coef', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('130(20-x)=2600+('), C('n12-p002-q12-signed-coef'), M(')x'),
      ] },
      { id: 'paragraph-cost-collect', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('箱代と定数項をまとめ、次に'), M('x'), T(' の係数をまとめよう。'),
      ] },
      { id: 'formula-cost-total-constant', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('50+2600='), C('n12-p003-q12-total-constant'),
      ] },
      { id: 'formula-cost-x-coef', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('180-130='), C('n12-p003-q12-x-coef'),
      ] },
      { id: 'paragraph-cost-collect-result', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('だから、合計金額は次の短い式でも表せる。'),
      ] },
      { id: 'formula-cost-collected-total', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('T(x)=2650+50x'),
      ] },
      { id: 'paragraph-cost-collect-bound', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('この式を3200円以上、3300円未満という条件に戻すと、'),
      ] },
      { id: 'formula-n12-12', type: 'formula' as const, derivationId: 'cost-range', parts: [
        C('n12-12'),
      ] },
      { id: 'paragraph-cost-solve', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('金額の三つの辺から、同じ'), M('2650'), T('を引いて整理しよう。'),
      ] },
      { id: 'formula-cost-subtract', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('3200-2650\\le50x<3300-2650'),
      ] },
      { id: 'formula-q13-lower', type: 'formula' as const, derivationId: 'cost-range', parts: [
        C('n12-p002-q13-lower'), M('\\le50x<3300-2650'),
      ] },
      { id: 'formula-q13-upper', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('550\\le50x<'), C('n12-p002-q13-upper'),
      ] },
      { id: 'paragraph-cost-positive', type: 'paragraph' as const, derivationId: 'cost-range', parts: [
        T('次はすべての辺を正の'), M('50'), T('で割る。正の数で割るときは不等号の向きが変わらない。'),
      ] },
      { id: 'formula-n12-13', type: 'formula' as const, derivationId: 'cost-range', parts: [
        M('550\\le50x<650\\quad\\Longrightarrow\\quad'), C('n12-13'),
      ] },
      { id: 'paragraph-n12-14', type: 'paragraph' as const, parts: [
        T('ここで得たのは実数としての範囲である。問題は「お菓子を何個にするか」だった。最初に保存した整数条件 '),
        M('x\\in\\mathbb Z,\\ 0\\le x\\le20'), T(' と比べると、実際に選べる '),
        M('x'), T(' は '), C('n12-14'), T('。'),
      ] },
      { id: 'paragraph-verify-substitution', type: 'paragraph' as const, parts: [
        T('最後に整数11個と12個を、整理した金額の式へ代入して確かめよう。'),
      ] },
      { id: 'formula-verify-eleven', type: 'formula' as const, parts: [
        M('T(11)=2650+50\\times11'),
      ] },
      { id: 'formula-verify-twelve', type: 'formula' as const, parts: [
        M('T(12)=2650+50\\times12'),
      ] },
      { id: 'paragraph-n12-15', type: 'paragraph' as const, parts: [
        T('二つの合計金額を計算すると '), C('n12-15'), T('。'),
      ] },
      // Answer-bearing original source image is below the FINAL choice.
      { id: 'figure-after-verification', type: 'figure' as const, figureId: 'n12-f03' },
      { id: 'paragraph-integer-final', type: 'paragraph' as const, parts: [
        T('文章題では、式を解く前に「どんな数が許されるか」を決める。そして計算後にその条件へ戻る。次は絶対値を数直線上の距離として解釈する。'),
      ] },
    ],
    items: [
      item('n12-p002-q01-coef', 'xを右へ移した後、xの係数はいくつ？', '2', 'formula',
        ['-2', '3', '4'], 'representation-link', 'strong', ['両辺からxを引く。3x−xを計算しよう。']),
      item('n12-p002-q01-const', '両辺から5を引くと左辺の定数はいくつ？', '-7', 'formula',
        ['7', '-3', '3'], 'representation-link', 'strong', ['−2−5を計算しよう。']),
      item('n12-01', '最初の不等式をxについて解こう。', 'x>-\\frac72', 'formula',
        ['x< -\\frac72', 'x>\\frac72', 'x\\ge-\\frac72'],
        'representation-link', 'strong', ['−7<2xになったら、正の2で割る。']),
      item('n12-p002-q02-coef', '−xを左辺に移すとxの係数はいくつ？', '2', 'formula',
        ['0', '-2', '1'], 'representation-link', 'strong', ['両辺にxを足す。x+xを考えよう。']),
      item('n12-p002-q02-const', '両辺から4を引くと右辺の定数はいくつ？', '1', 'formula',
        ['9', '-1', '4'], 'representation-link', 'strong', ['5−4を計算しよう。等号は残る。']),
      item('n12-02', '二つ目の不等式をxについて解こう。', 'x\\le\\frac12', 'formula',
        ['x<\\frac12', 'x\\ge\\frac12', 'x\\le-\\frac12'],
        'representation-link', 'strong', ['最後の等号は問題の条件に残っている。']),
      item('n12-03', 'x=1は二つとも満たす？', '二つ目に反するので不適', 'text',
        ['一つ目を満たすから適する', '二つとも満たす', 'どちらも満たさない'],
        'causal-reasoning', 'strong', ['「同時に」は片方だけでは足りない。']),
      item('n12-04', '二つの範囲の共通部分を選ぼう。', '-\\frac72<x\\le\\frac12', 'formula',
        ['-\\frac72\\le x\\le\\frac12', '-\\frac72<x<\\frac12', 'x>-\\frac72\\ \\text{または}\\ x\\le\\frac12'],
        'representation-link', 'medium', ['白丸は含まず黒丸は含む。両方の条件を満たす範囲を探す。']),
      item('n12-05', '三連不等式を二つの条件に分けよう。', '3x+2\\le2x+4\\ \\text{かつ}\\ 2x+4\\le9-x', 'formula',
        ['3x+2\\le9-x', '3x+2\\le2x+4\\ \\text{または}\\ 2x+4\\le9-x', '3x+2\\ge2x+4\\ \\text{かつ}\\ 2x+4\\le9-x'],
        'representation-link', 'medium', ['中央の式と両隣をそれぞれ比較する。']),
      item('n12-p002-q06-left-coef', '3x−2xの係数を埋めよう。', '1', 'formula',
        ['2', '-1', '5'], 'representation-link', 'medium', ['両辺から同じ文字の項を引くと、係数どうしの引き算になる。文字xを残したまま、係数だけを計算しよう。']),
      item('n12-p002-q06-left-const', 'x+2≤4 の右辺の定数を求めよう。', '2', 'formula',
        ['6', '-2', '4'], 'representation-link', 'medium', ['4−2を計算する。']),
      item('n12-p002-q06-right-coef', '−xを左辺に移した後のxの係数を求めよう。', '3', 'formula',
        ['1', '-3', '2'], 'representation-link', 'medium', ['2x+xの係数を計算する。']),
      item('n12-p002-q06-right-const', '3x+4≤9 の右辺の定数を求めよう。', '5', 'formula',
        ['13', '-5', '9'], 'representation-link', 'medium', ['9−4を計算する。']),
      item('n12-06', '二つの不等式の解をそれぞれ選ぼう。', 'x\\le2,\\quad x\\le\\frac53', 'formula',
        ['x\\le2,\\quad x\\ge\\frac53', 'x\\ge2,\\quad x\\le\\frac53', 'x\\le2,\\quad x\\le\\frac35'],
        'transfer', 'medium', ['一方の計算では3x≤5になる。']),
      item('n12-07', '二つの上限のうち、共通に残る範囲は？', 'x\\le\\frac53', 'formula',
        ['x\\le2', 'x\\ge\\frac53', '\\frac53\\le x\\le2'],
        'causal-reasoning', 'medium', ['より小さい方の上限も超えてはいけない。']),
      item('n12-08', 'プリンの個数をxで表そう。', '20-x', 'formula',
        ['20+x', 'x-20', '20'], 'concept-formation', 'strong', ['合わせて20個という条件を使う。']),
      item('n12-09', 'xの取りうる数の種類と範囲を選ぼう。', 'x\\in\\mathbb Z,\\ 0\\le x\\le20', 'formula',
        ['x\\in\\mathbb R,\\ 0\\le x\\le20', 'x\\in\\mathbb Z,\\ x\\ge0', 'x\\in\\mathbb Z,\\ 0<x<20'],
        'causal-reasoning', 'medium', ['個数なので小数にはできない。全部同じ種類でもよい。']),
      item('n12-p003-q10-meaning', 'T(x) は何の金額を表す？', '箱と20個の菓子の合計金額', 'text',
        ['箱だけの代金', 'シュークリームの個数', 'プリン1個の代金'],
        'concept-formation', 'strong', ['xを決めたとき、箱と20個の菓子を買うための全体の金額だ。']),
      item('n12-p003-q10-cream-coef', 'シュークリームの単価をxの係数へ入れよう。', '180', 'formula',
        ['130', '50', '20'], 'representation-link', 'medium', ['1個の値段×個数を式で書く。']),
      item('n12-p003-q10-pudding-coef', 'プリンの単価を括弧の係数へ入れよう。', '130', 'formula',
        ['180', '50', '20'], 'representation-link', 'medium', ['20−x個に掛ける単価を選ぶ。']),
      item('n12-p003-q10-box-fee', '固定の箱代はいくら？', '50', 'formula',
        ['130', '180', '20'], 'representation-link', 'medium', ['菓子の個数に関係なく払う金額に注目する。']),
      item('n12-10', '箱代と二種類の菓子代を合わせよう。', '50+180x+130(20-x)', 'formula',
        ['180x+130(20-x)', '50+180x+130x', '50+180x+130(20+x)'],
        'representation-link', 'medium', ['箱の固定代金も加える。']),
      item('n12-p003-q11-lower-sign', '3200円以上を表す不等号を選ぼう。', '\\le', 'formula',
        ['<', '\\ge', '>'], 'representation-link', 'medium', ['ちょうど3200円の場合も許す。']),
      item('n12-p003-q11-upper-sign', '3300円未満を表す不等号を選ぼう。', '<', 'formula',
        ['\\le', '>', '\\ge'], 'representation-link', 'medium', ['3300円ちょうどは含めない。']),
      item('n12-11', '金額の「以上・未満」を式にしよう。', '3200\\le50+180x+130(20-x)<3300', 'formula',
        ['3200<50+180x+130(20-x)\\le3300', '3200\\le50+180x+130(20-x)\\le3300', '3200\\ge50+180x+130(20-x)<3300'],
        'representation-link', 'medium', ['以上には等号があり、未満には等号がない。']),
      item('n12-p003-q12-product-constant', '130×20を計算して定数項を作ろう。', '2600', 'formula',
        ['260', '2500', '1300'], 'representation-link', 'medium', ['130を20回足した金額に等しい。']),
      item('n12-p002-q12-signed-coef', '130を−xに分配した符号付き係数はいくつ？', '-130', 'formula',
        ['130', '-20', '2600'], 'representation-link', 'medium', ['括弧の外の正の数を、括弧内の負の項にも掛けよう。係数の大きさと符号を別々に確かめ、文字xを除いた数を選ぼう。']),
      item('n12-p003-q12-total-constant', '箱代とプリン20個分の定数項を足そう。', '2650', 'formula',
        ['2600', '2550', '3100'], 'representation-link', 'medium', ['50+2600を計算する。']),
      item('n12-p003-q12-x-coef', 'xの項の係数をまとめよう。', '50', 'formula',
        ['310', '-50', '130'], 'representation-link', 'medium', ['180−130でxの係数を求める。']),
      item('n12-12', '同類項をまとめて金額を整理しよう。', '3200\\le2650+50x<3300', 'formula',
        ['3200\\le2600+50x<3300', '3200\\le2650+310x<3300', '3200\\le2650-50x<3300'],
        'transfer', 'medium', ['箱代とプリン20個分を定数項にする。']),
      item('n12-p002-q13-lower', '3200−2650を計算して下端を埋めよう。', '550', 'formula',
        ['650', '-550', '3200'], 'representation-link', 'medium', ['下端から同じ2650を引く。']),
      item('n12-p002-q13-upper', '3300−2650を計算して上端を埋めよう。', '650', 'formula',
        ['550', '-650', '3300'], 'representation-link', 'medium', ['上端も同じ2650を引く。未満の向きは変わらない。']),
      item('n12-13', '実数としてのxの範囲を解こう。', '11\\le x<13', 'formula',
        ['11<x\\le13', '11\\le x\\le13', 'x\\le11\\ \\text{または}\\ x>13'],
        'transfer', 'light', ['各辺から2650を引き、正の50で割る。']),
      item('n12-14', '整数条件に戻って可能な個数を選ぼう。', 'x=11\\ \\text{または}\\ 12', 'formula',
        ['11\\le x\\le13', 'x=12\\ \\text{または}\\ 13', 'x=11\\ \\text{のみ}'],
        'transfer', 'light', ['実数の区間と整数の集合の共通部分を考える。']),
      item('n12-15', '箱代を含め、候補二つの合計金額を確かめよう。', 'T(11)=3200\\text{円},\\ T(12)=3250\\text{円}', 'formula',
        ['T(11)=3150\\text{円},\\ T(12)=3200\\text{円}', 'T(11)=3200\\text{円},\\ T(12)=3300\\text{円}', 'T(11)=3250\\text{円},\\ T(12)=3200\\text{円}'],
        'transfer', 'light', ['整理したT(x)へ二つの整数を順に代入する。']),
    ],
  }],
}

export const mathNumbersN12LegacyUnit = validateTextbookUnits([rawN12])[0]

export const mathNumbersN12Unit = validateTextbookUnits([authored.unit])[0]
export const n12Presentation = authored
export const n12SourceToItemIds: Record<string, string[]> = Object.fromEntries(Array.from({length:15},(_,i)=>['N12-Q'+String(i+1).padStart(2,'0'), authored.nodes.filter(n=>n.q===i+1).flatMap(n=>n.interaction?[n.interaction]:[])]))
