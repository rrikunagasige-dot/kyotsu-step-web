import { validateTextbookUnits } from '../../../domain/textbookSchema'

const item = (
  id: string,
  label: string,
  prompt: string,
  answer: string,
  choices: string[],
  answerType: 'text' | 'formula' | 'number' = 'text',
  acceptedAnswers: string[] = [],
  unit?: string,
) => ({
  id,
  label,
  prompt,
  answer,
  choices,
  acceptedAnswers,
  answerType,
  ...(unit ? { unit } : {}),
})

const t = (text: string) => ({ type: 'text' as const, text })
const m = (latex: string) => ({ type: 'math' as const, latex })
const c = (itemId: string) => ({ type: 'choice' as const, itemId })
const heading = (id: string, text: string) => ({ id, type: 'heading' as const, text })
const paragraph = (id: string, ...parts: Array<ReturnType<typeof t> | ReturnType<typeof m> | ReturnType<typeof c>>) => ({
  id,
  type: 'paragraph' as const,
  parts,
})
const formula = (id: string, ...parts: Array<ReturnType<typeof t> | ReturnType<typeof m> | ReturnType<typeof c>>) => ({
  id,
  type: 'formula' as const,
  parts,
})
const figure = (id: string, figureId: string) => ({ id, type: 'figure' as const, figureId })
const note = (id: string, text: string) => ({ id, type: 'note' as const, text })

const rawTextbookUnits = [
  {
    schemaVersion: '1.1',
    unitId: 'physics-1b-velocity-composition',
    revision: 1,
    status: 'published',
    subject: 'physics',
    chapter: {
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1B',
      orderInChapter: 2,
      sourcePages: [14, 15],
    },
    title: 'B 速度の合成と分解',
    subtitle: '基準をそろえて速度を足す・成分へ分ける',
    source: {
      type: 'reference',
      label: '物理・教科書モード｜1B 速度の合成と分解',
      rightsNote: 'ユーザー提供教材と原教科書 p.14–15 を学習アプリ用の構造化データへ変換',
    },
    objectives: [
      '基準を明確にして速度ベクトルを合成する',
      '速度を x・y 成分へ分解する',
      '三角比から速度成分を求める',
      '成分から速さを復元する',
    ],
    sections: [
      {
        id: 'knowledge-check',
        number: '01',
        title: '知識点チェック',
        role: 'concept',
        description: '「どの基準から見た速度か」をそろえたうえで、合成・分解の意味を式と一緒に確認する。',
        figures: [],
        readingFlow: [
          heading('kc-h-1', '1-1　速度の合成'),
          paragraph(
            'kc-p-1',
            t('川の水 A が地面に対して動き、その水に対して船 B が動くとする。地面から見た船 B の速度は、地面から見た水 A の速度と、水 A から見た船 B の速度のベクトルの '),
            c('b-1'),
            t(' で求める。'),
          ),
          formula('kc-f-1', m('\\vec v_{B/地}=\\vec v_{A/地}+\\vec v_{B/A}')),
          paragraph(
            'kc-p-2',
            t('このように複数の速度ベクトルから一つの速度を求めることを、速度の '),
            c('b-2'),
            t(' という。合成後の速度も、大きさと向きをもつベクトルである。'),
          ),

          heading('kc-h-2', '1-2　速度の分解'),
          paragraph(
            'kc-p-3',
            t('逆に、一つの速度ベクトルを互いに垂直な x 軸・y 軸方向へ分けて考える。速さを '),
            m('v'),
            t('、速度と x 軸のなす角を '),
            m('\\theta'),
            t(' とすると、'),
          ),
          formula('kc-f-2', m('v_x='), c('b-3')),
          formula('kc-f-3', m('v_y='), c('b-4')),
          paragraph(
            'kc-p-4',
            t('したがって、速さは2つの直交成分から三平方の関係を用いて'),
          ),
          formula('kc-f-4', m('v=\\sqrt{'), c('b-5'), m('^2+'), c('b-6'), m('^2}')),
          paragraph(
            'kc-p-5',
            t('このように一つのベクトルを成分へ分けることを、速度の '),
            c('b-7'),
            t(' という。'),
          ),

          heading('kc-h-3', '1-3　ベクトルの和と差'),
          paragraph(
            'kc-p-6',
            t('ベクトルの和は、矢印をつなぐ方法・平行四辺形の対角線・成分ごとの加算のいずれでも同じ結果になる。差 '),
            m('\\vec a-\\vec b'),
            t(' は '),
            m('\\vec a+(-\\vec b)'),
            t(' と考える。次の1C「相対速度」では、この差をそのまま使う。'),
          ),
        ],
        items: [
          item('b-1', '1B-1', '速度を合成するとき、2つの速度ベクトルをどの演算で組み合わせるか。', '和', ['和', '差', '積', '比']),
          item('b-2', '1B-2', '複数の速度から一つの速度を求めることを速度の何というか。', '合成', ['合成', '分解', '平均', '相対化']),
          item('b-3', '1B-3', '速さ v、x軸となす角 θ のとき x 成分 vₓ を表せ。', 'vcosθ', ['vcosθ', 'vsinθ', 'v/cosθ', 'v/sinθ'], 'formula', ['v cosθ', 'vcos(theta)']),
          item('b-4', '1B-4', '速さ v、x軸となす角 θ のとき y 成分 vᵧ を表せ。', 'vsinθ', ['vsinθ', 'vcosθ', 'v/sinθ', 'v/cosθ'], 'formula', ['v sinθ', 'vsin(theta)']),
          item('b-5', '1B-5', 'v=√(【　】²+vᵧ²) の空欄を答えよ。', 'vₓ', ['vₓ', 'vᵧ', 'v', 'θ'], 'formula', ['vx']),
          item('b-6', '1B-6', 'v=√(vₓ²+【　】²) の空欄を答えよ。', 'vᵧ', ['vᵧ', 'vₓ', 'v', 'θ'], 'formula', ['vy']),
          item('b-7', '1B-7', '一つの速度ベクトルを成分に分けることを何というか。', '分解', ['分解', '合成', '平均', '平行移動']),
        ],
      },
      {
        id: 'figure-reading',
        number: '02',
        title: '図の読み取り',
        role: 'figure-reading',
        description: '矢印の始点・終点と成分の向きを見て、合成と分解を図から読み取る。',
        figures: [
          {
            id: 'velocity-composition-figure',
            src: '/assets/physics/textbook/ch01/1b/velocity-composition.webp',
            alt: '川を横切る船について、水に対する船の速度、地面に対する水の速度、地面に対する船の合成速度を示す図',
            caption: '図5　船の速度の合成',
            overlays: [
              {
                id: 'hotspot-d-1',
                itemId: 'd-1',
                mode: 'hotspot',
                x: 72,
                y: 34,
                width: 18,
                height: 22,
                reveal: 'after-answer',
                ariaLabel: '合成速度を表す対角線を確認する',
              },
            ],
          },
          {
            id: 'velocity-components-figure',
            src: '/assets/physics/textbook/ch01/1b/velocity-components.webp',
            alt: '速度 v を x 成分 v_x と y 成分 v_y に直交分解した図',
            caption: '図6　速度の x・y 成分への分解',
            overlays: [],
          },
        ],
        readingFlow: [
          note('fr-note-1', '図では「矢印を足した結果」と「一つの矢印を成分に分けた結果」を区別する。'),
          heading('fr-h-1', '図5　速度の合成'),
          figure('fr-fig-1', 'velocity-composition-figure'),
          paragraph(
            'fr-p-1',
            t('2つの速度ベクトルを同じ始点から描くと、合成速度は平行四辺形の対角線として読める。図の青い対角線を選んで確認しよう。'),
          ),
          heading('fr-h-2', '図6　速度の分解'),
          figure('fr-fig-2', 'velocity-components-figure'),
          paragraph(
            'fr-p-2',
            t('x 成分と y 成分は座標軸に沿って分けられるので、両者の向きは互いに '),
            c('d-2'),
            t(' である。'),
          ),
        ],
        items: [
          item('d-1', 'D-1', '2つの速度を同じ始点から描いたとき、合成速度は平行四辺形のどこに対応するか。', '平行四辺形の対角線', ['平行四辺形の対角線', '2辺のうち長い方', '2辺の差', 'x軸方向の辺'], 'text', ['対角線']),
          item('d-2', 'D-2', 'x 成分と y 成分の向きは互いにどのような関係か。', '垂直', ['垂直', '平行', '同方向', '反対方向'], 'text', ['直交']),
        ],
      },
      {
        id: 'example-q1',
        number: '03',
        title: '例題1｜川を横切る船',
        role: 'worked-example',
        description: '2つの互いに垂直な速度を合成し、地面から見た船の速さを求める。',
        figures: [
          {
            id: 'boat-example-figure',
            src: '/assets/physics/textbook/ch01/1b/velocity-composition.webp',
            alt: '川を横切る船の速度ベクトルの合成図',
            caption: '例題1　川の流れと船の速度',
            overlays: [],
          },
        ],
        readingFlow: [
          heading('q1-h-1', '問題'),
          paragraph(
            'q1-p-1',
            t('川の水が東向きに '),
            m('2.0\\,\\mathrm{m/s}'),
            t('、船が水に対して北向きに '),
            m('1.5\\,\\mathrm{m/s}'),
            t(' で進む。地面に対する船の速さを求める。'),
          ),
          figure('q1-fig-1', 'boat-example-figure'),
          heading('q1-h-2', 'STEP 1　直交成分として書く'),
          paragraph(
            'q1-p-2',
            t('東を x 正方向、北を y 正方向とすると、地面に対する船の速度成分は'),
          ),
          formula('q1-f-1', m('(v_x,v_y)=('), c('q1-1'), m(','), c('q1-2'), m(')\\,\\mathrm{m/s}')),
          heading('q1-h-3', 'STEP 2　速さを求める'),
          paragraph('q1-p-3', t('x・y 成分は垂直なので三平方の関係を用いる。')),
          formula('q1-f-2', m('v=\\sqrt{2.0^2+1.5^2}='), c('q1-3'), m('\\,\\mathrm{m/s}')),
        ],
        items: [
          item('q1-1', 'Q1-1', '東向きを x 正方向としたとき vₓ を答えよ。', '2.0', ['2.0', '1.5', '-2.0', '3.5'], 'number', ['2']),
          item('q1-2', 'Q1-2', '北向きを y 正方向としたとき vᵧ を答えよ。', '1.5', ['1.5', '2.0', '-1.5', '0.5'], 'number'),
          item('q1-3', 'Q1-3', '√(2.0²+1.5²) を計算し、地面に対する船の速さを答えよ。', '2.5', ['2.5', '3.5', '0.5', '1.75'], 'number'),
        ],
      },
      {
        id: 'example-q2',
        number: '04',
        title: '例題2｜速度の分解',
        role: 'worked-example',
        description: '速度の大きさと角度から、水平成分・鉛直成分を取り出す。',
        figures: [
          {
            id: 'components-example-figure',
            src: '/assets/physics/textbook/ch01/1b/velocity-components.webp',
            alt: '速度 v と x 軸の角 θ、および v_x・v_y 成分を示す図',
            caption: '例題2　速度の直交分解',
            overlays: [],
          },
        ],
        readingFlow: [
          heading('q2-h-1', '問題'),
          paragraph(
            'q2-p-1',
            t('大きさ '),
            m('30\\,\\mathrm{m/s}'),
            t(' の速度が水平となす角が '),
            m('30^\\circ'),
            t(' である。水平成分と鉛直成分を求める。'),
          ),
          figure('q2-fig-1', 'components-example-figure'),
          heading('q2-h-2', 'STEP 1　水平成分'),
          formula('q2-f-1', m('v_x=30\\cos30^\\circ='), c('q2-1'), m('\\,\\mathrm{m/s}')),
          heading('q2-h-3', 'STEP 2　鉛直成分'),
          formula('q2-f-2', m('v_y=30\\sin30^\\circ='), c('q2-2'), m('\\,\\mathrm{m/s}')),
        ],
        items: [
          item('q2-1', 'Q2-1', '30cos30° を計算し、水平成分を答えよ。', '15√3', ['15√3', '15', '30√3', '30'], 'formula', ['15sqrt3']),
          item('q2-2', 'Q2-2', '30sin30° を計算し、鉛直成分を答えよ。', '15', ['15', '15√3', '30', '30√3'], 'number'),
        ],
      },
      {
        id: 'final-review',
        number: '05',
        title: '最後の知識確認',
        role: 'review',
        description: '合成と分解の関係を、式を見ずにもう一度つなげる。',
        figures: [],
        readingFlow: [
          note('frv-note-1', 'ここでは新しい知識を増やさず、1Bで使った関係だけを再接続する。'),
          paragraph('frv-p-1', t('速度の合成では、速度ベクトルの '), c('f-1'), t(' をとる。')),
          formula('frv-f-1', m('v_x='), c('f-2')),
          formula('frv-f-2', m('v_y='), c('f-3')),
          paragraph('frv-p-2', t('直交する2成分から速さを戻すときは '), c('f-4'), t(' の関係を使う。')),
        ],
        items: [
          item('f-1', 'F-1', '速度の合成はベクトルの何をとるか。', '和', ['和', '差', '積', '比']),
          item('f-2', 'F-2', 'vₓ を v と θ で表せ。', 'vcosθ', ['vcosθ', 'vsinθ', 'v/cosθ', 'v/sinθ'], 'formula', ['v cosθ']),
          item('f-3', 'F-3', 'vᵧ を v と θ で表せ。', 'vsinθ', ['vsinθ', 'vcosθ', 'v/sinθ', 'v/cosθ'], 'formula', ['v sinθ']),
          item('f-4', 'F-4', '直交する成分から速さを求めるときに用いる関係を答えよ。', '三平方', ['三平方', '比例', '反比例', '等差'], 'text', ['三平方の関係', '三平方の定理']),
        ],
      },
    ],
  },
]

export const textbookUnit1B = validateTextbookUnits(rawTextbookUnits)[0]
