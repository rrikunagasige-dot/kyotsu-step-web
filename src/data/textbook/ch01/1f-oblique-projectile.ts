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
    unitId: 'physics-1f-oblique-projectile',
    revision: 1,
    status: 'published',
    subject: 'physics',
    chapter: {
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1F',
      orderInChapter: 6,
      sourcePages: [22, 23, 24],
    },
    title: 'F 斜方投射',
    subtitle: '初速度を水平・鉛直成分に分け、最高点・飛行時間・水平到達距離へつなぐ',
    source: {
      type: 'reference',
      label: '物理・教科書モード｜1F 斜方投射',
      rightsNote: 'ユーザー提供教材と原教科書 p.22–24 を学習アプリ用の構造化データへ変換',
    },
    objectives: [
      '斜方投射の初速度を水平・鉛直成分へ分解する',
      '水平方向を等速運動、鉛直方向を等加速度運動として扱う',
      '最高点に達する時刻と同じ高さへ戻る飛行時間を求める',
      '水平到達距離と投射角の関係を理解する',
    ],
    sections: [
      {
        id: 'knowledge-check',
        number: '01',
        title: '知識点チェック',
        role: 'concept',
        description: '初速度の分解から位置・速度、最高点、飛行時間、水平到達距離までを一つの流れで確認する。',
        figures: [],
        readingFlow: [
          heading('kc-h-1', '1-1　初速度を分解する'),
          paragraph(
            'kc-p-1',
            t('初速度の大きさを '),
            m('v_0'),
            t('、水平方向となす角を '),
            m('\\theta'),
            t(' とする。初速度の水平成分と鉛直成分は'),
          ),
          formula('kc-f-1', m('v_{0x}='), c('f1-1')),
          formula('kc-f-2', m('v_{0y}='), c('f1-2')),

          heading('kc-h-2', '1-2　水平・鉛直方向の運動'),
          paragraph(
            'kc-p-2',
            t('空気抵抗を無視すると、水平方向には力がはたらかないため等速運動になる。'),
          ),
          formula('kc-f-3', m('x=v_0\\cos\\theta\\,'), c('f1-3')),
          paragraph(
            'kc-p-3',
            t('鉛直上向きを正にとると、鉛直方向には重力加速度 '),
            m('-g'),
            t(' がはたらく。'),
          ),
          formula('kc-f-4', m('y=v_0\\sin\\theta\\,t-'), c('f1-4')),

          heading('kc-h-3', '1-3　最高点'),
          paragraph(
            'kc-p-4',
            t('最高点では鉛直速度成分が '),
            c('f1-5'),
            t(' になる。'),
          ),
          formula('kc-f-5', m('0=v_0\\sin\\theta-gt_H\\quad\\Rightarrow\\quad t_H='), c('f1-6')),

          heading('kc-h-4', '1-4　飛行時間と水平到達距離'),
          paragraph(
            'kc-p-5',
            t('投射点と同じ高さへ戻るまでの飛行時間は、上昇時間の2倍なので'),
          ),
          formula('kc-f-6', m('T='), c('f1-7')),
          paragraph(
            'kc-p-6',
            t('水平到達距離 '),
            m('D'),
            t(' は水平速度と飛行時間の積から'),
          ),
          formula('kc-f-7', m('D='), c('f1-8')),
          paragraph(
            'kc-p-7',
            t('同じ初速度 '),
            m('v_0'),
            t(' なら、水平到達距離が最大になる投射角は '),
            c('f1-9'),
            t(' である。'),
          ),
        ],
        items: [
          item('f1-1', '1F-1', '初速度 v₀ の水平成分を答えよ。', 'v₀cosθ', ['v₀cosθ', 'v₀sinθ', 'v₀tanθ', 'v₀/cosθ'], 'formula', ['v0cosθ', 'v0 cosθ']),
          item('f1-2', '1F-2', '初速度 v₀ の鉛直成分を答えよ。', 'v₀sinθ', ['v₀sinθ', 'v₀cosθ', 'v₀tanθ', 'v₀/sinθ'], 'formula', ['v0sinθ', 'v0 sinθ']),
          item('f1-3', '1F-3', 'x=v₀cosθ【　】 の空欄を答えよ。', 't', ['t', 'g', 't²', 'θ'], 'formula'),
          item('f1-4', '1F-4', 'y=v₀sinθ t−【　】 の空欄を答えよ。', '1/2gt²', ['1/2gt²', 'gt', 'v₀t', '2gt²'], 'formula', ['gt²/2', '0.5gt^2']),
          item('f1-5', '1F-5', '最高点で鉛直速度成分はいくらか。', '0', ['0', 'v₀cosθ', 'v₀sinθ', 'g'], 'number'),
          item('f1-6', '1F-6', '最高点に達する時刻 t_H を答えよ。', 'v₀sinθ/g', ['v₀sinθ/g', 'v₀cosθ/g', '2v₀sinθ/g', 'g/v₀sinθ'], 'formula', ['v0sinθ/g']),
          item('f1-7', '1F-7', '同じ高さへ戻るまでの飛行時間 T を答えよ。', '2v₀sinθ/g', ['2v₀sinθ/g', 'v₀sinθ/g', '2v₀cosθ/g', 'v₀²sin2θ/g'], 'formula', ['2v0sinθ/g']),
          item('f1-8', '1F-8', '水平到達距離 D を答えよ。', 'v₀²sin2θ/g', ['v₀²sin2θ/g', '2v₀sinθ/g', 'v₀²cos2θ/g', 'v₀sinθ/g'], 'formula', ['v0²sin2θ/g', 'v0^2sin2θ/g']),
          item('f1-9', '1F-9', '同じ初速度で水平到達距離が最大になる投射角を答えよ。', '45°', ['45°', '30°', '60°', '90°'], 'number', ['45']),
        ],
      },
      {
        id: 'figure-reading',
        number: '02',
        title: '図の読み取り',
        role: 'figure-reading',
        description: '放物線軌道と速度成分を見比べ、最高点で何が変わり何が変わらないかを読む。',
        figures: [
          {
            id: 'oblique-projectile-trajectory-figure',
            src: '/assets/physics/textbook/ch01/1f/oblique-projectile-trajectory.webp',
            alt: '斜方投射の放物線軌道と、軌道に沿う速度ベクトル、最高点 H を示す図',
            caption: '図13　斜方投射の軌道',
            overlays: [],
          },
          {
            id: 'oblique-projectile-components-figure',
            src: '/assets/physics/textbook/ch01/1f/oblique-projectile-components.webp',
            alt: '斜方投射の各点で速度を水平成分と鉛直成分に分解し、最高点で v_y=0 と示した図',
            caption: '図14　斜方投射の速度成分',
            overlays: [
              {
                id: 'mask-d-1',
                itemId: 'd-1',
                mode: 'mask',
                x: 39,
                y: 15,
                width: 17,
                height: 10,
                reveal: 'after-answer',
                ariaLabel: '最高点の鉛直速度成分を答える',
              },
            ],
          },
        ],
        readingFlow: [
          note('fr-note-1', '最高点では運動が止まるわけではない。鉛直成分だけが0になり、水平成分は残る。'),
          heading('fr-h-1', '図13・14　軌道と速度成分'),
          figure('fr-fig-1', 'oblique-projectile-trajectory-figure'),
          figure('fr-fig-2', 'oblique-projectile-components-figure'),
          paragraph(
            'fr-p-1',
            t('図14の最高点で鉛直速度成分はマスクされている。一方、水平方向には加速度がないため、水平速度成分は運動中ずっと '),
            c('d-2'),
            t(' である。'),
          ),
        ],
        items: [
          item('d-1', 'D-1', '図14の最高点で鉛直速度成分 v_y はいくらか。', '0', ['0', 'v₀sinθ', 'v₀cosθ', 'gt'], 'number'),
          item('d-2', 'D-2', '空気抵抗を無視すると、水平速度成分 v_x は運動中どうなるか。', '一定のまま', ['一定のまま', '次第に大きくなる', '次第に小さくなる', '最高点で0になる'], 'text', ['一定', '変わらない']),
        ],
      },
      {
        id: 'example-q1',
        number: '03',
        title: '例題1｜最高点に達する時刻',
        role: 'worked-example',
        description: '最高点で v_y=0 を使って上昇時間を求める。',
        figures: [],
        readingFlow: [
          heading('q1-h-1', '問題'),
          paragraph(
            'q1-p-1',
            t('初速度 '),
            m('19.6\\,\\mathrm{m/s}'),
            t('、投射角 '),
            m('60^\\circ'),
            t(' で物体を投げ上げる。重力加速度を '),
            m('9.8\\,\\mathrm{m/s^2}'),
            t(' として、最高点に達する時刻を求める。'),
          ),
          heading('q1-h-2', 'STEP 1　最高点では v_y=0'),
          formula('q1-f-1', m('t_H=\\frac{19.6\\sin60^\\circ}{9.8}='), c('q1-1'), m('\\,\\mathrm{s}')),
        ],
        items: [
          item('q1-1', 'Q1-1', '19.6sin60°/9.8 を計算し、最高点に達する時刻を答えよ。', '√3', ['√3', '2√3', '1', '2'], 'formula', ['sqrt3']),
        ],
      },
      {
        id: 'example-q2',
        number: '04',
        title: '例題2｜水平到達距離が最大になる角度',
        role: 'worked-example',
        description: 'D=(v₀²/g)sin2θ の三角関数部分だけを見て最大条件を決める。',
        figures: [],
        readingFlow: [
          heading('q2-h-1', '問題'),
          paragraph(
            'q2-p-1',
            t('同じ初速度 '),
            m('v_0'),
            t(' で投射角だけを変える。水平到達距離 '),
            m('D'),
            t(' が最大になる角度を求める。'),
          ),
          heading('q2-h-2', 'STEP 1　角度に依存する部分を見る'),
          formula('q2-f-1', m('D=\\frac{v_0^2}{g}\\sin('), c('q2-1'), m(')')),
          heading('q2-h-3', 'STEP 2　sin の最大値'),
          paragraph(
            'q2-p-2',
            t('sin の最大値は1なので、'),
            m('2\\theta='),
            c('q2-2'),
            t(' とすればよい。'),
          ),
          formula('q2-f-2', m('\\theta='), c('q2-3')),
        ],
        items: [
          item('q2-1', 'Q2-1', '水平到達距離 D=(v₀²/g)sin【　】 の空欄を答えよ。', '2θ', ['2θ', 'θ', 'θ/2', '90°−θ'], 'formula'),
          item('q2-2', 'Q2-2', 'sin2θ を最大にするため、2θ は何度か。', '90°', ['90°', '45°', '60°', '180°'], 'number', ['90']),
          item('q2-3', 'Q2-3', '2θ=90° から θ を答えよ。', '45°', ['45°', '30°', '60°', '90°'], 'number', ['45']),
        ],
      },
      {
        id: 'final-review',
        number: '05',
        title: '最後の知識確認',
        role: 'review',
        description: '斜方投射を水平・鉛直に分け、最高点と最大到達距離の結論を再接続する。',
        figures: [],
        readingFlow: [
          paragraph('frv-p-1', t('斜方投射の x 方向は '), c('f-1'), t(' 方向で、等速運動として扱う。')),
          paragraph('frv-p-2', t('重力加速度が作用するのは '), c('f-2'), t(' 方向である。')),
          paragraph('frv-p-3', t('最高点では鉛直速度成分が '), c('f-3'), t(' になる。')),
          paragraph('frv-p-4', t('同じ初速度で水平到達距離を最大にする投射角は '), c('f-4'), t(' である。')),
        ],
        items: [
          item('f-1', 'F-1', '斜方投射で等速運動として扱うのは何方向か。', '水平', ['水平', '鉛直', '速度方向', '重力方向']),
          item('f-2', 'F-2', '重力加速度が作用するのは何方向か。', '鉛直', ['鉛直', '水平', '速度方向', '接線方向']),
          item('f-3', 'F-3', '最高点で鉛直速度成分はいくらか。', '0', ['0', 'v₀', 'v₀cosθ', 'g'], 'number'),
          item('f-4', 'F-4', '同じ初速度で水平到達距離が最大になる投射角を答えよ。', '45°', ['45°', '30°', '60°', '90°'], 'number', ['45']),
        ],
      },
    ],
  },
]

export const textbookUnit1F = validateTextbookUnits(rawTextbookUnits)[0]
