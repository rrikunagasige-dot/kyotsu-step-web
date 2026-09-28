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
    unitId: 'physics-1g-gravity-drag-terminal-velocity',
    revision: 1,
    status: 'published',
    subject: 'physics',
    chapter: {
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1G',
      orderInChapter: 7,
      sourcePages: [25, 26, 27],
    },
    title: 'G 重力加速度・空気抵抗・終端速度',
    subtitle: '重力だけの落下から、速度比例抵抗を受ける落下と終端速度へつなぐ',
    source: {
      type: 'reference',
      label: '物理・教科書モード｜1G 重力加速度・空気抵抗・終端速度',
      rightsNote: 'ユーザー提供教材・figure.zip・教科書母版 ZIP を学習アプリ用の構造化データへ変換',
    },
    objectives: [
      '重力だけがはたらくとき加速度が一定である理由を確認する',
      '空気抵抗が速度に比例する近似 f=kv を理解する',
      '落下中に加速度が次第に小さくなる理由を説明できるようにする',
      '終端速度の条件 mg=kv_t から v_t=mg/k を導けるようにする',
    ],
    sections: [
      {
        id: 'knowledge-check',
        number: '01',
        title: '知識点チェック',
        role: 'concept',
        description: '重力だけの落下、速度比例抵抗、加速度の変化、終端速度までを一つの流れで確認する。',
        figures: [],
        readingFlow: [
          heading('kc-h-1', '1-1　重力だけがはたらく落下'),
          paragraph('kc-p-1', t('重力だけがはたらくとき、運動方程式は '), m('m\\vec a=m\\vec g'), t(' なので、加速度は')),
          formula('kc-f-1', m('\\vec a='), c('g1-1')),

          heading('kc-h-2', '1-2　空気抵抗がある落下'),
          paragraph('kc-p-2', t('速さ '), m('v'), t(' があまり大きくないとき、空気抵抗の大きさは速さに比例し、')),
          formula('kc-f-2', m('f='), c('g1-2')),
          paragraph('kc-p-3', t('下向きを正にとると、落下中の運動方程式は')),
          formula('kc-f-3', m('ma=mg-'), c('g1-3')),

          heading('kc-h-3', '1-3　落下加速度の変化'),
          paragraph('kc-p-4', t('落下直後は '), m('v=0'), t(' なので、抵抗は '), c('g1-4'), t(' である。')),
          paragraph('kc-p-5', t('速さが増えると、空気抵抗は '), c('g1-5'), t('。そのため、加速度は重力加速度より小さくなる。')),
          formula('kc-f-4', m('a=g-\\frac{k}{m}v')),

          heading('kc-h-4', '1-4　終端速度'),
          paragraph('kc-p-6', t('十分時間がたつと加速度は '), c('g1-6'), t(' になり、物体は一定の速さで落下する。この速さを終端速度という。')),
          formula('kc-f-5', m('mg=kv_t\\quad\\Rightarrow\\quad v_t='), c('g1-7')),
        ],
        items: [
          item('g1-1', '1G-1', 'm\\vec a=m\\vec g から加速度 \\vec a を答えよ。', 'g⃗', ['g⃗', 'm g⃗', '0', 'v⃗'], 'formula', ['\\vec{g}', 'g', 'ベクトルg']),
          item('g1-2', '1G-2', '速度比例抵抗の大きさ f を答えよ。', 'kv', ['kv', 'mg', 'mv', 'kv²'], 'formula'),
          item('g1-3', '1G-3', '下向きを正とした運動方程式 ma=mg−【　】の空欄を答えよ。', 'kv', ['kv', 'mg', 'v/k', 'k/v'], 'formula'),
          item('g1-4', '1G-4', '落下直後 v=0 のとき、空気抵抗はいくらか。', '0', ['0', 'mg', 'kv', 'g'], 'number'),
          item('g1-5', '1G-5', '速さが増えると空気抵抗はどうなるか。', '大きくなる', ['大きくなる', '小さくなる', '0になる', '一定である'], 'text', ['増える']),
          item('g1-6', '1G-6', '終端速度に達したときの加速度はいくらか。', '0', ['0', 'g', 'kv', 'mg'], 'number'),
          item('g1-7', '1G-7', '終端速度 v_t を答えよ。', 'mg/k', ['mg/k', 'k/mg', 'g/k', 'm/k'], 'formula', ['\\frac{mg}{k}', 'mg/k']),
        ],
      },
      {
        id: 'figure-reading',
        number: '02',
        title: '図の読み取り',
        role: 'figure-reading',
        description: '空気抵抗による力と加速度の変化、速度が終端速度へ近づく様子を図から読む。',
        figures: [
          {
            id: 'gravity-air-resistance-figure',
            src: '/assets/physics/textbook/ch01/1g/gravity-air-resistance.webp',
            alt: '空気抵抗がない場合とある場合の落下を、重力 mg、空気抵抗、速度 v の矢印で比較した図',
            caption: '図15　重力と空気抵抗',
            overlays: [],
          },
          {
            id: 'drag-force-stages-figure',
            src: '/assets/physics/textbook/ch01/1g/drag-force-stages.webp',
            alt: '落下初期、途中、終端速度付近で空気抵抗が大きくなり重力とつり合うまでを示す図',
            caption: '図16　落下中の力の変化',
            overlays: [],
          },
          {
            id: 'terminal-velocity-graph-figure',
            src: '/assets/physics/textbook/ch01/1g/terminal-velocity-graph.webp',
            alt: '速度 v が時間 t とともに増え、終端速度 v_t に近づいていく速度時間グラフ',
            caption: '図17　終端速度へ近づく速度の変化',
            overlays: [],
          },
        ],
        readingFlow: [
          note('fr-note-1', '空気抵抗は運動と逆向きにはたらく。落下速度が増すほど抵抗が大きくなり、重力との力の差が小さくなる。'),
          heading('fr-h-1', '図15〜17　空気抵抗・力の変化・終端速度'),
          figure('fr-fig-1', 'gravity-air-resistance-figure'),
          figure('fr-fig-2', 'drag-force-stages-figure'),
          figure('fr-fig-3', 'terminal-velocity-graph-figure'),
          paragraph('fr-p-1', t('図16では落下速度が増すにつれて上向きの空気抵抗が大きくなる。そのため加速度は '), c('d-1'), t('。')),
          paragraph('fr-p-2', t('図17では、速度 '), m('v'), t(' は次第に終端速度 '), m('v_t'), t(' に近づき、グラフはやがて '), c('d-2'), t('。')),
        ],
        items: [
          item('d-1', 'D-1', '落下速度が増して空気抵抗が大きくなると、加速度はどう変化するか。', '小さくなる', ['小さくなる', '大きくなる', '常にgのまま', '突然0になる'], 'text', ['次第に小さくなる']),
          item('d-2', 'D-2', '速度時間グラフは終端速度に近づくとどのような形になるか。', '水平に近づく', ['水平に近づく', '直線のまま増え続ける', '下向きに曲がる', '0へ戻る'], 'text', ['水平', 'だんだん水平になる']),
        ],
      },
      {
        id: 'example-q1',
        number: '03',
        title: '問1型｜終端速度',
        role: 'worked-example',
        description: '終端速度の条件 mg=kv_t をそのまま使って数値計算する。',
        figures: [],
        readingFlow: [
          heading('q1-h-1', '問題'),
          paragraph('q1-p-1', t('質量 '), m('m=0.50\\,\\mathrm{kg}'), t('、比例定数 '), m('k=0.10\\,\\mathrm{kg/s}'), t('、重力加速度 '), m('g=9.8\\,\\mathrm{m/s^2}'), t(' のとき、終端速度を求める。')),
          heading('q1-h-2', 'STEP 1　終端速度の式を使う'),
          formula('q1-f-1', m('v_t=\\frac{mg}{k}=\\frac{0.50\\times 9.8}{0.10}='), c('q1-1'), m('\\,\\mathrm{m/s}')),
        ],
        items: [
          item('q1-1', 'Q1-1', '0.50×9.8/0.10 を計算して終端速度を答えよ。', '49', ['49', '4.9', '9.8', '98'], 'number', ['49.0'], 'm/s'),
        ],
      },
      {
        id: 'example-q2',
        number: '04',
        title: '問2型｜加速度の変化',
        role: 'worked-example',
        description: '落下中に加速度が g より小さくなる理由を、力のつり合いから文章で説明する。',
        figures: [],
        readingFlow: [
          heading('q2-h-1', '問題'),
          paragraph('q2-p-1', t('速度が増加中の落下で、加速度が '), m('g'), t(' より小さくなる理由を説明する。')),
          heading('q2-h-2', 'STEP 1　上向きの力に注目する'),
          paragraph('q2-p-2', t('下向きの重力に対して、上向きの '), c('q2-1'), t(' が速さとともに増えるため、合力は '), m('mg'), t(' より小さくなる。したがって加速度も '), m('g'), t(' より小さくなる。')),
        ],
        items: [
          item('q2-1', 'Q2-1', '下向き重力に対して増える上向きの力を答えよ。', '空気抵抗', ['空気抵抗', '浮力', '摩擦力', '弾性力'], 'text'),
        ],
      },
      {
        id: 'final-review',
        number: '05',
        title: '最後の知識確認',
        role: 'review',
        description: '自由落下、速度比例抵抗、終端速度の3点を最後に結び直す。',
        figures: [],
        readingFlow: [
          paragraph('frv-p-1', t('自由落下では加速度 '), m('a='), c('f-1'), t(' である。')),
          paragraph('frv-p-2', t('速度比例抵抗があるときの運動方程式は '), m('ma=mg-'), c('f-2'), t(' である。')),
          paragraph('frv-p-3', t('終端速度では加速度 '), m('a='), c('f-3'), t(' である。')),
        ],
        items: [
          item('f-1', 'F-1', '自由落下の加速度 a を答えよ。', 'g', ['g', '0', 'kv', 'mg'], 'formula'),
          item('f-2', 'F-2', '速度比例抵抗では ma=mg−【　】の空欄を答えよ。', 'kv', ['kv', 'mg', 'mv', 'g'], 'formula'),
          item('f-3', 'F-3', '終端速度に達したときの加速度 a を答えよ。', '0', ['0', 'g', 'mg', 'kv'], 'number'),
        ],
      },
    ],
  },
]

export const textbookUnit1G = validateTextbookUnits(rawTextbookUnits)[0]
