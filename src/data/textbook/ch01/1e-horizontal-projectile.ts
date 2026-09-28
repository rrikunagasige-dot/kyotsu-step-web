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
    unitId: 'physics-1e-horizontal-projectile',
    revision: 1,
    status: 'published',
    subject: 'physics',
    chapter: {
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1E',
      orderInChapter: 5,
      sourcePages: [20, 21],
    },
    title: 'E 水平投射',
    subtitle: '水平方向の等速運動と鉛直方向の自由落下を独立に組み合わせる',
    source: {
      type: 'reference',
      label: '物理・教科書モード｜1E 水平投射',
      rightsNote: 'ユーザー提供教材と原教科書 p.20–21 を学習アプリ用の構造化データへ変換',
    },
    objectives: [
      '水平・鉛直方向の運動を独立に分けて考える',
      '水平方向が等速運動であることを式と図から確認する',
      '鉛直方向が初速度0の自由落下であることを理解する',
      '時間を消去すると軌道が放物線になることを理解する',
    ],
    sections: [
      {
        id: 'knowledge-check',
        number: '01',
        title: '知識点チェック',
        role: 'concept',
        description: '水平投射を x 方向の等速運動と y 方向の自由落下へ分けて、位置・速度・軌道を確認する。',
        figures: [],
        readingFlow: [
          heading('kc-h-1', '1-1　水平方向と鉛直方向を分ける'),
          paragraph(
            'kc-p-1',
            t('空気抵抗を無視すると、水平投射された物体には重力だけが鉛直下向きにはたらく。したがって水平方向の加速度は '),
            c('e1-1'),
            t(' である。'),
          ),
          formula('kc-f-1', m('x='), c('e1-2')),
          paragraph(
            'kc-p-2',
            t('鉛直方向は投げ出した瞬間の初速度が '),
            c('e1-3'),
            t(' で、重力加速度 '),
            m('g'),
            t(' の '),
            c('e1-4'),
            t(' 運動になる。下向きを y の正方向とする。'),
          ),
          formula('kc-f-2', m('y='), c('e1-5')),

          heading('kc-h-2', '1-2　速度成分'),
          paragraph('kc-p-3', t('時刻 t での速度を x・y 成分に分けると、')),
          formula('kc-f-3', m('v_x='), c('e1-6')),
          formula('kc-f-4', m('v_y='), c('e1-7')),
          paragraph(
            'kc-p-4',
            t('したがって速さは '),
            m('v=\\sqrt{v_0^2+g^2t^2}'),
            t(' と表せる。水平方向の速度成分は変わらず、鉛直成分だけが時間とともに大きくなる。'),
          ),

          heading('kc-h-3', '1-3　軌道'),
          paragraph(
            'kc-p-5',
            t('x=v₀t と y=1/2gt² から時間 t を消去すると、y は x の2次関数になる。したがって軌道は '),
            c('e1-8'),
            t(' である。'),
          ),
          formula('kc-f-5', m('y=\\frac{g}{2v_0^2}x^2')),
        ],
        items: [
          item('e1-1', '1E-1', '水平投射で水平方向の加速度はいくらか。', '0', ['0', 'g', 'v₀', 'gt'], 'number'),
          item('e1-2', '1E-2', '水平位置 x を v₀ と t で表せ。', 'v₀t', ['v₀t', '1/2gt²', 'gt', 'v₀+gt'], 'formula', ['v0t']),
          item('e1-3', '1E-3', '水平投射の鉛直方向の初速度はいくらか。', '0', ['0', 'v₀', 'g', 'gt'], 'number'),
          item('e1-4', '1E-4', '鉛直方向は重力加速度 g の何運動か。', '等加速度', ['等加速度', '等速', '円', '単振動']),
          item('e1-5', '1E-5', '下向きを正にした鉛直位置 y を表せ。', '1/2gt²', ['1/2gt²', 'v₀t', 'gt', '2gt²'], 'formula', ['gt²/2', '0.5gt^2']),
          item('e1-6', '1E-6', '水平速度成分 vₓ を答えよ。', 'v₀', ['v₀', 'gt', '0', 'v₀+gt'], 'formula', ['v0']),
          item('e1-7', '1E-7', '下向きを正にした鉛直速度成分 vᵧ を答えよ。', 'gt', ['gt', 'v₀', '0', 'g/t'], 'formula'),
          item('e1-8', '1E-8', '時間を消去した水平投射の軌道は何か。', '放物線', ['放物線', '直線', '円', '双曲線']),
        ],
      },
      {
        id: 'figure-reading',
        number: '02',
        title: '図の読み取り',
        role: 'figure-reading',
        description: '等時間間隔の位置と速度ベクトルから、水平と鉛直の運動の違いを読み取る。',
        figures: [
          {
            id: 'horizontal-projectile-strobe-figure',
            src: '/assets/physics/textbook/ch01/1e/horizontal-projectile-strobe.webp',
            alt: '水平初速度 v0 で投げた物体の等時間間隔の位置と、重力加速度 g を示す図',
            caption: '図11　水平投射の等時間間隔の位置',
            overlays: [
              {
                id: 'hotspot-d-1',
                itemId: 'd-1',
                mode: 'hotspot',
                x: 29,
                y: 16,
                width: 46,
                height: 10,
                reveal: 'after-answer',
                ariaLabel: '水平方向の等時間間隔を読み取る',
              },
              {
                id: 'hotspot-d-2',
                itemId: 'd-2',
                mode: 'hotspot',
                x: 31,
                y: 27,
                width: 47,
                height: 42,
                reveal: 'after-answer',
                ariaLabel: '鉛直方向の点間隔の変化を読み取る',
              },
            ],
          },
          {
            id: 'horizontal-projectile-velocity-figure',
            src: '/assets/physics/textbook/ch01/1e/horizontal-projectile-velocity.webp',
            alt: '水平投射の点 P で速度 v を水平成分 v_x と鉛直成分 v_y に分けた図',
            caption: '図12　水平投射の速度成分',
            overlays: [],
          },
        ],
        readingFlow: [
          note('fr-note-1', '同じ時間間隔ごとの点の並びを見ると、x 方向と y 方向で運動の種類が違うことが分かる。'),
          heading('fr-h-1', '図11　等時間間隔の位置'),
          figure('fr-fig-1', 'horizontal-projectile-strobe-figure'),
          note('fr-note-2', '図12　速度成分も同じ小節で確認する。'),
          figure('fr-fig-2', 'horizontal-projectile-velocity-figure'),
          paragraph(
            'fr-p-1',
            t('図12では '),
            m('v_x'),
            t(' は一定のまま、'),
            m('v_y=gt'),
            t(' が時間とともに大きくなるため、合成速度は次第に下向きへ傾く。'),
          ),
        ],
        items: [
          item('d-1', 'D-1', '図11で、等時間ごとの水平方向の点間隔はどうなるか。', '一定', ['一定', '大きくなる', '小さくなる', '不規則']),
          item('d-2', 'D-2', '図11で、等時間ごとの鉛直方向の点間隔は時間とともにどうなるか。', '大きくなる', ['大きくなる', '一定', '小さくなる', '0になる']),
        ],
      },
      {
        id: 'example-q1',
        number: '03',
        title: '例題1｜落下時間',
        role: 'worked-example',
        description: '高さから落下時間を求める。水平方向の速度は落下時間には影響しない。',
        figures: [],
        readingFlow: [
          heading('q1-h-1', '問題'),
          paragraph(
            'q1-p-1',
            t('地上から '),
            m('19.6\\,\\mathrm{m}'),
            t(' の高さから物体を水平投射する。重力加速度を '),
            m('9.8\\,\\mathrm{m/s^2}'),
            t(' として、地面に達するまでの時間を求める。'),
          ),
          heading('q1-h-2', 'STEP 1　鉛直方向だけを見る'),
          formula('q1-f-1', m('19.6=\\frac12\\times9.8\\times t^2\\quad\\Rightarrow\\quad t^2='), c('q1-1')),
          heading('q1-h-3', 'STEP 2　正の時間を選ぶ'),
          formula('q1-f-2', m('t='), c('q1-2'), m('\\,\\mathrm{s}')),
        ],
        items: [
          item('q1-1', 'Q1-1', '19.6=1/2×9.8×t² から t² を答えよ。', '4.0', ['4.0', '2.0', '9.8', '19.6'], 'number', ['4']),
          item('q1-2', 'Q1-2', 't²=4.0 から落下時間 t を答えよ。', '2.0', ['2.0', '4.0', '1.0', '9.8'], 'number', ['2']),
        ],
      },
      {
        id: 'example-q2',
        number: '04',
        title: '例題2｜水平到達距離',
        role: 'worked-example',
        description: '例題1の落下時間と水平等速運動を組み合わせる。',
        figures: [],
        readingFlow: [
          heading('q2-h-1', '問題'),
          paragraph(
            'q2-p-1',
            t('前問の物体を水平初速度 '),
            m('14.7\\,\\mathrm{m/s}'),
            t(' で投げた。落下時間 '),
            m('2.0\\,\\mathrm{s}'),
            t(' の間に進む水平距離を求める。'),
          ),
          heading('q2-h-2', 'STEP 1　x方向は等速運動'),
          formula('q2-f-1', m('x=v_0t=14.7\\times2.0='), c('q2-1'), m('\\,\\mathrm{m}')),
        ],
        items: [
          item('q2-1', 'Q2-1', '14.7×2.0 を計算し、水平到達距離を答えよ。', '29.4', ['29.4', '19.6', '14.7', '9.8'], 'number'),
        ],
      },
      {
        id: 'final-review',
        number: '05',
        title: '最後の知識確認',
        role: 'review',
        description: '水平と鉛直の独立性から、運動の種類と軌道をもう一度つなぐ。',
        figures: [],
        readingFlow: [
          paragraph('frv-p-1', t('水平投射の x 方向は '), c('f-1'), t(' 運動である。')),
          paragraph('frv-p-2', t('y 方向は初速度0の '), c('f-2'), t(' と同じ運動である。')),
          paragraph('frv-p-3', t('x と y を同時に見ると、軌道は '), c('f-3'), t(' になる。')),
        ],
        items: [
          item('f-1', 'F-1', '水平投射の x 方向は何運動か。', '等速', ['等速', '等加速度', '円', '単振動']),
          item('f-2', 'F-2', '水平投射の y 方向は何と同じ運動か。', '自由落下', ['自由落下', '等速直線運動', '円運動', '単振動']),
          item('f-3', 'F-3', '水平投射の軌道は何か。', '放物線', ['放物線', '直線', '円', '双曲線']),
        ],
      },
    ],
  },
]

export const textbookUnit1E = validateTextbookUnits(rawTextbookUnits)[0]
