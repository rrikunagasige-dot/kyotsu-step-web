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
    subtitle: '重力だけの落下から、速度比例抵抗と終端速度までをつなぐ',
    source: {
      type: 'reference',
      label: '物理・教科書モード｜1G 重力加速度・空気抵抗・終端速度',
      rightsNote: 'ユーザー提供の原教科書・母版準拠1G Word・figure.zip の図15〜17を構造化',
    },
    objectives: [
      '重力だけがはたらくとき加速度が重力加速度に等しいことを確認する',
      '速さに比例する空気抵抗 f=kv を理解する',
      '落下中に加速度が次第に小さくなる理由を力の関係から説明する',
      '終端速度の条件 mg=kv_t から v_t=mg/k を導く',
    ],
    sections: [
      {
        id: 'knowledge-check',
        number: '01',
        title: '知識点チェック',
        role: 'concept',
        description: '重力だけの落下、速度比例抵抗、加速度の変化、終端速度を順に確認する。',
        figures: [],
        readingFlow: [
          heading('kc-h-1', '1-1　重力だけがはたらくとき'),
          paragraph('kc-p-1', t('運動方程式は '), m('m\\vec a=m\\vec g'), t(' なので、')),
          formula('kc-f-1', m('\\vec a='), c('g1-1')),

          heading('kc-h-2', '1-2　空気抵抗'),
          paragraph('kc-p-2', t('速さ '), m('v'), t(' があまり大きくない範囲では、空気抵抗の大きさは速さに比例し、')),
          formula('kc-f-2', m('f='), c('g1-2')),
          paragraph('kc-p-3', t('鉛直下向きを正にとると、運動方程式は')),
          formula('kc-f-3', m('ma=mg-'), c('g1-3')),

          heading('kc-h-3', '1-3　落下加速度の変化'),
          paragraph('kc-p-4', t('落下直後は '), m('v=0'), t(' なので空気抵抗は '), c('g1-4'), t(' である。')),
          paragraph('kc-p-5', t('落下して速さが増えると空気抵抗は '), c('g1-5'), t('。その結果、合力が小さくなり加速度も小さくなる。')),
          formula('kc-f-4', m('a=g-\\frac{k}{m}v')),

          heading('kc-h-4', '1-4　終端速度'),
          paragraph('kc-p-6', t('十分時間がたつと重力と空気抵抗がつり合い、加速度は '), c('g1-6'), t(' になる。')),
          paragraph('kc-p-7', t('このときの一定の速さを終端速度 '), m('v_t'), t(' といい、')),
          formula('kc-f-5', m('mg=kv_t\\quad\\Rightarrow\\quad v_t='), c('g1-7')),
        ],
        items: [
          item('g1-1', '1G-1', 'm a⃗ = m g⃗ から加速度 a⃗ を答えよ。', 'g⃗', ['g⃗', 'mg⃗', '0', 'v⃗'], 'formula', ['g', '\\vec g']),
          item('g1-2', '1G-2', '速度比例抵抗の大きさ f を答えよ。', 'kv', ['kv', 'mg', 'mv', 'kv²'], 'formula'),
          item('g1-3', '1G-3', 'ma=mg−【　】の空欄を答えよ。', 'kv', ['kv', 'mg', 'v/k', 'k/v'], 'formula'),
          item('g1-4', '1G-4', '落下直後 v=0 のとき空気抵抗はいくらか。', '0', ['0', 'mg', 'kv', 'g'], 'number'),
          item('g1-5', '1G-5', '速さが増えると空気抵抗はどうなるか。', '大きくなる', ['大きくなる', '小さくなる', '0になる', '一定である'], 'text', ['増える']),
          item('g1-6', '1G-6', '終端速度に達したときの加速度はいくらか。', '0', ['0', 'g', 'kv', 'mg'], 'number'),
          item('g1-7', '1G-7', '終端速度 v_t を答えよ。', 'mg/k', ['mg/k', 'k/mg', 'g/k', 'm/k'], 'formula', ['\\frac{mg}{k}']),
        ],
      },
      {
        id: 'figure-reading',
        number: '02',
        title: '図の読み取り',
        role: 'figure-reading',
        description: '図15〜17を見比べ、空気抵抗の向き・大きさと終端速度への近づき方を読む。',
        figures: [
          {
            id: 'gravity-vs-air-resistance-figure',
            src: '/assets/physics/textbook/ch01/1g/gravity-vs-air-resistance.webp',
            alt: '重力だけの場合と空気抵抗がある場合の落下を比較した図',
            caption: '図15　重力だけの落下と空気抵抗がある落下',
            overlays: [],
          },
          {
            id: 'drag-force-stages-figure',
            src: '/assets/physics/textbook/ch01/1g/drag-force-stages.webp',
            alt: '落下中に空気抵抗が次第に大きくなり終端速度付近で重力とつり合う図',
            caption: '図16　落下中の力の変化',
            overlays: [],
          },
          {
            id: 'terminal-velocity-graph-figure',
            src: '/assets/physics/textbook/ch01/1g/terminal-velocity-graph.webp',
            alt: '速度 v が終端速度 v_t に近づく速度時間グラフ',
            caption: '図17　終端速度へ近づく速度の変化',
            overlays: [],
          },
        ],
        readingFlow: [
          note('fr-note-1', '図に書かれた語をそのまま拾うのではなく、矢印の長さとグラフの傾きが何を意味するかを読む。'),
          heading('fr-h-1', '図15　重力と空気抵抗'),
          figure('fr-fig-1', 'gravity-vs-air-resistance-figure'),
          heading('fr-h-2', '図16　落下中の力'),
          figure('fr-fig-2', 'drag-force-stages-figure'),
          paragraph('fr-p-1', t('初期から終端速度付近へ進むにつれて、上向きの空気抵抗の矢印は '), c('d-1'), t('。')),
          heading('fr-h-3', '図17　速度時間グラフ'),
          figure('fr-fig-3', 'terminal-velocity-graph-figure'),
          paragraph('fr-p-2', t('時間がたつにつれてグラフの傾き、すなわち加速度は '), c('d-2'), t('。')),
        ],
        items: [
          item('d-1', 'D-1', '図16で、落下が進むにつれて空気抵抗の大きさはどう変化するか。', '大きくなる', ['大きくなる', '小さくなる', '0になる', '変わらない'], 'text', ['増える']),
          item('d-2', 'D-2', '図17で、十分時間がたつとグラフの傾き（加速度）はどうなるか。', '0に近づく', ['0に近づく', 'gに近づく', '一定に大きくなる', '負に発散する'], 'text', ['0', 'ゼロに近づく']),
        ],
      },
      {
        id: 'example-q1',
        number: '03',
        title: '問1型｜終端速度',
        role: 'worked-example',
        description: '終端速度の条件を使って数値を求める。',
        figures: [],
        readingFlow: [
          heading('q1-h-1', '問題'),
          paragraph('q1-p-1', t('質量 '), m('m=0.50\\,\\mathrm{kg}'), t('、比例定数 '), m('k=0.10\\,\\mathrm{kg/s}'), t('、重力加速度 '), m('g=9.8\\,\\mathrm{m/s^2}'), t(' とする。')),
          heading('q1-h-2', 'STEP 1　重力と抵抗のつり合い'),
          formula('q1-f-1', m('v_t=\\frac{mg}{k}=\\frac{0.50\\times9.8}{0.10}='), c('q1-1'), m('\\,\\mathrm{m/s}')),
        ],
        items: [
          item('q1-1', 'Q1-1', '0.50×9.8/0.10 を計算して終端速度を答えよ。', '49', ['49', '4.9', '9.8', '98'], 'number', ['49.0'], 'm/s'),
        ],
      },
      {
        id: 'example-q2',
        number: '04',
        title: '問2型｜加速度が小さくなる理由',
        role: 'worked-example',
        description: '速さの増加と力の変化を結びつけて説明する。',
        figures: [],
        readingFlow: [
          heading('q2-h-1', '問題'),
          paragraph('q2-p-1', t('落下中、速さが増えるにつれて加速度が '), m('g'), t(' より小さくなる理由を説明する。')),
          heading('q2-h-2', 'STEP 1　上向きの力を見る'),
          paragraph('q2-p-2', t('速さとともに上向きの '), c('q2-1'), t(' が大きくなるので、下向きの合力が小さくなる。')),
        ],
        items: [
          item('q2-1', 'Q2-1', '速さとともに大きくなる上向きの力を答えよ。', '空気抵抗', ['空気抵抗', '重力', '弾性力', '向心力'], 'text'),
        ],
      },
      {
        id: 'final-review',
        number: '05',
        title: '最後の知識確認',
        role: 'review',
        description: '重力だけの落下、速度比例抵抗、終端速度を最後に再接続する。',
        figures: [],
        readingFlow: [
          paragraph('frv-p-1', t('重力だけがはたらくとき、加速度は '), c('f-1'), t(' である。')),
          paragraph('frv-p-2', t('速度比例抵抗があるとき、運動方程式は '), m('ma=mg-'), c('f-2'), t(' である。')),
          paragraph('frv-p-3', t('終端速度では加速度は '), c('f-3'), t(' である。')),
        ],
        items: [
          item('f-1', 'F-1', '重力だけがはたらくときの加速度を答えよ。', 'g', ['g', '0', 'kv', 'mg'], 'formula'),
          item('f-2', 'F-2', 'ma=mg−【　】の空欄を答えよ。', 'kv', ['kv', 'mg', 'mv', 'g'], 'formula'),
          item('f-3', 'F-3', '終端速度での加速度を答えよ。', '0', ['0', 'g', 'mg', 'kv'], 'number'),
        ],
      },
    ],
  },
]

export const textbookUnit1G = validateTextbookUnits(rawTextbookUnits)[0]
