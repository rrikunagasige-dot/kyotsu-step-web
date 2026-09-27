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
    unitId: 'physics-1c-relative-velocity',
    revision: 1,
    status: 'published',
    subject: 'physics',
    chapter: {
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1C',
      orderInChapter: 3,
      sourcePages: [16, 17],
    },
    title: 'C 相対速度',
    subtitle: '観測者を決めて「相手 − 観測者」で見える速度を求める',
    source: {
      type: 'reference',
      label: '物理・教科書モード｜1C 相対速度',
      rightsNote: 'ユーザー提供教材と原教科書 p.16–17 を学習アプリ用の構造化データへ変換',
    },
    objectives: [
      '観測者によって見える速度が変わることを理解する',
      '相対速度を「相手 − 観測者」で表す',
      '直線上と平面上でベクトルの差を使う',
      '雨・風の見え方を相対速度で説明する',
    ],
    sections: [
      {
        id: 'knowledge-check',
        number: '01',
        title: '知識点チェック',
        role: 'concept',
        description: '最初に観測者を固定し、「誰から見た誰の速度か」を式と文章で対応させる。',
        figures: [],
        readingFlow: [
          heading('kc-h-1', '1-1　観測者によって見える速度は変わる'),
          paragraph(
            'kc-p-1',
            t('同じ物体 B の運動でも、地面から見る場合と、動いている物体 A から見る場合では見える速度が異なる。このように、ある観測者から見た別の物体の速度を '),
            c('c-1'),
            t(' という。'),
          ),

          heading('kc-h-2', '1-2　相対速度の定義'),
          paragraph(
            'kc-p-2',
            t('地面から見た A の速度を '),
            m('\\vec v_A'),
            t('、B の速度を '),
            m('\\vec v_B'),
            t(' とする。A から見た B の相対速度は、相手 B の速度から観測者 A の速度を引く。'),
          ),
          formula('kc-f-1', m('\\vec v_{B/A}='), c('c-2'), m('-'), c('c-3')),
          paragraph(
            'kc-p-3',
            t('特に A と B が同じ速度で同じ向きに動くとき、A から見た B の相対速度は '),
            c('c-4'),
            t(' になる。'),
          ),

          heading('kc-h-3', '1-3　直線でも平面でも「差」をとる'),
          paragraph(
            'kc-p-4',
            t('相対速度は速度ベクトルの '),
            c('c-5'),
            t(' である。したがって平面上でも x 成分・y 成分ごとに差をとればよい。'),
          ),
          paragraph(
            'kc-p-5',
            t('雨の中を自転車で走るとき、実際の雨の速度と自転車の速度が分かれば、自転車から見た雨の '),
            c('c-6'),
            t(' を求めることができる。'),
          ),
        ],
        items: [
          item('c-1', '1C-1', 'ある観測者から見た別の物体の速度を何というか。', '相対速度', ['相対速度', '合成速度', '平均速度', '加速度']),
          item('c-2', '1C-2', 'A から見た B の相対速度 v_{B/A}=【　】−v_A の空欄を答えよ。', 'v_B', ['v_B', 'v_A', 'v_B+v_A', '0'], 'formula', ['vB']),
          item('c-3', '1C-3', 'A から見た B の相対速度 v_{B/A}=v_B−【　】 の空欄を答えよ。', 'v_A', ['v_A', 'v_B', 'v_A+v_B', '0'], 'formula', ['vA']),
          item('c-4', '1C-4', 'A と B が同じ速度・同じ向きで動くとき、A から見た B の相対速度はいくらか。', '0', ['0', 'v_A', 'v_B', 'v_A+v_B'], 'number'),
          item('c-5', '1C-5', '相対速度は2つの速度ベクトルの何で表されるか。', '差', ['差', '和', '積', '商']),
          item('c-6', '1C-6', '自転車から見た雨の速度を何というか。', '相対速度', ['相対速度', '絶対速度', '加速度', '合成速度']),
        ],
      },
      {
        id: 'figure-reading',
        number: '02',
        title: '図の読み取り',
        role: 'figure-reading',
        description: '同方向・逆方向の自動車を比べて、観測者と相対速度ベクトルの向きを図から読む。',
        figures: [
          {
            id: 'relative-cars-figure',
            src: '/assets/physics/textbook/ch01/1c/relative-velocity-cars.webp',
            alt: '自動車 A と B が同方向または逆方向に進むときの速度と、A から見た B の相対速度を示す図',
            caption: '図7　自動車 A から見た自動車 B の相対速度',
            overlays: [
              {
                id: 'hotspot-d-2',
                itemId: 'd-2',
                mode: 'hotspot',
                x: 18,
                y: 58,
                width: 24,
                height: 18,
                reveal: 'after-answer',
                ariaLabel: 'A から見た B の相対速度を表す矢印を確認する',
              },
            ],
          },
        ],
        readingFlow: [
          note('fr-note-1', '相対速度を求める前に、まず「誰が観測者か」を固定する。'),
          heading('fr-h-1', '図7　A から見た B'),
          figure('fr-fig-1', 'relative-cars-figure'),
          paragraph(
            'fr-p-1',
            t('図では A を基準にして B の見え方を考えている。このとき基準となる観測者は '),
            c('d-1'),
            t(' である。'),
          ),
          paragraph(
            'fr-p-2',
            t('図の相対速度ベクトルは、地面から見た B の速度そのものではなく、'),
            m('\\vec v_B-\\vec v_A'),
            t(' に対応する。'),
          ),
        ],
        items: [
          item('d-1', 'D-1', '図7で基準となる観測者は A・B・地面のどれか。', 'A', ['A', 'B', '地面', '道路']),
          item('d-2', 'D-2', '図7で v_B−v_A に対応する矢印は何を表すか。', 'Aから見たBの速度', ['Aから見たBの速度', 'Bから見たAの速度', 'Aの地面に対する速度', 'Bの地面に対する速度'], 'text', ['Aから見たBの相対速度']),
        ],
      },
      {
        id: 'example-q1',
        number: '03',
        title: '例題1｜追い越しと相対速度',
        role: 'worked-example',
        description: '同じ方向へ走る2台の自動車で、「相手 − 観測者」をそのまま使う。',
        figures: [],
        readingFlow: [
          heading('q1-h-1', '問題'),
          paragraph(
            'q1-p-1',
            t('自動車 A が東向きに '),
            m('10\\,\\mathrm{m/s}'),
            t('、自動車 B が東向きに '),
            m('15\\,\\mathrm{m/s}'),
            t(' で走っている。A から見た B の相対速度を求める。'),
          ),
          heading('q1-h-2', 'STEP 1　相手 − 観測者'),
          formula('q1-f-1', m('v_{B/A}=15-10='), c('q1-1'), m('\\,\\mathrm{m/s}')),
          heading('q1-h-3', 'STEP 2　向きを読む'),
          paragraph(
            'q1-p-2',
            t('結果は正なので、A から見ると B は '),
            c('q1-2'),
            t(' へ遠ざかるように見える。'),
          ),
        ],
        items: [
          item('q1-1', 'Q1-1', '15−10 を計算し、A から見た B の相対速度の大きさを答えよ。', '5.0', ['5.0', '10', '15', '25'], 'number', ['5']),
          item('q1-2', 'Q1-2', 'A から見ると B はどちらへ動いて見えるか。', '前', ['前', '後ろ', '静止', '鉛直'], 'text', ['前方']),
        ],
      },
      {
        id: 'example-q2',
        number: '04',
        title: '例題2｜自転車から見た雨',
        role: 'worked-example',
        description: '平面上の相対速度を成分ごとの差として求め、見かけの雨の向きを考える。',
        figures: [
          {
            id: 'relative-rain-figure',
            src: '/assets/physics/textbook/ch01/1c/relative-rain-bicycle.webp',
            alt: '鉛直下向きに降る雨と右向きに進む自転車、および自転車から見た雨の相対速度ベクトルを示す図',
            caption: '図8　自転車から見た雨の相対速度',
            overlays: [],
          },
        ],
        readingFlow: [
          heading('q2-h-1', '問題'),
          paragraph(
            'q2-p-1',
            t('雨が地面に対して鉛直下向きに '),
            m('10\\,\\mathrm{m/s}'),
            t(' で降り、自転車が右向きに '),
            m('10\\,\\mathrm{m/s}'),
            t(' で走っている。右向きを x 正方向、上向きを y 正方向とする。'),
          ),
          figure('q2-fig-1', 'relative-rain-figure'),
          heading('q2-h-2', 'STEP 1　2つの速度を成分で書く'),
          formula('q2-f-1', m('\\vec v_R=(0,-10),\\qquad \\vec v_C=(10,0)')),
          heading('q2-h-3', 'STEP 2　雨 − 自転車'),
          formula('q2-f-2', m('\\vec v_{R/C}=\\vec v_R-\\vec v_C=('), c('q2-1'), m(','), c('q2-2'), m(')\\,\\mathrm{m/s}')),
          heading('q2-h-4', 'STEP 3　大きさと方向'),
          formula('q2-f-3', m('|\\vec v_{R/C}|=\\sqrt{10^2+10^2}='), c('q2-3'), m('\\,\\mathrm{m/s}')),
          paragraph(
            'q2-p-2',
            t('x 成分と y 成分の大きさが等しいため、自転車からは雨が鉛直線から後方へ '),
            c('q2-4'),
            t(' 傾いて降るように見える。'),
          ),
        ],
        items: [
          item('q2-1', 'Q2-1', '自転車から見た雨の相対速度の x 成分を答えよ。', '-10', ['-10', '0', '10', '10√2'], 'number'),
          item('q2-2', 'Q2-2', '自転車から見た雨の相対速度の y 成分を答えよ。', '-10', ['-10', '0', '10', '10√2'], 'number'),
          item('q2-3', 'Q2-3', '相対速度 (-10,-10) の大きさを答えよ。', '10√2', ['10√2', '10', '20', '5√2'], 'formula', ['10sqrt2']),
          item('q2-4', 'Q2-4', '自転車から見た雨は鉛直線から後方へ何度傾いて見えるか。', '45°', ['45°', '30°', '60°', '90°'], 'number', ['45']),
        ],
      },
      {
        id: 'final-review',
        number: '05',
        title: '最後の知識確認',
        role: 'review',
        description: '新しい公式は増やさず、「相手 − 観測者」とベクトルの差を最後に再接続する。',
        figures: [],
        readingFlow: [
          note('frv-note-1', '相対速度では、記号より先に「誰から見た誰か」を言葉で確認する。'),
          formula('frv-f-1', m('\\vec v_{B/A}='), c('f-1')),
          paragraph(
            'frv-p-1',
            t('A と B が同じ速度・同じ向きで動く場合、A から見た B の相対速度は '),
            c('f-2'),
            t(' になる。'),
          ),
          paragraph(
            'frv-p-2',
            t('平面上の相対速度も、速度を '),
            c('f-3'),
            t(' として扱い、成分ごとに差をとればよい。'),
          ),
        ],
        items: [
          item('f-1', 'F-1', 'A から見た B の相対速度を v_A、v_B で表せ。', 'v_B-v_A', ['v_B-v_A', 'v_A-v_B', 'v_A+v_B', 'v_B/v_A'], 'formula', ['vB-vA', 'v_B−v_A']),
          item('f-2', 'F-2', 'A と B が同じ速度・同じ向きなら相対速度はいくらか。', '0', ['0', 'v_A', 'v_B', 'v_A+v_B'], 'number'),
          item('f-3', 'F-3', '平面上の相対速度では速度を何として扱うか。', 'ベクトル', ['ベクトル', 'スカラー', '無次元', '平均'], 'text', ['ベクトル量']),
        ],
      },
    ],
  },
]

export const textbookUnit1C = validateTextbookUnits(rawTextbookUnits)[0]
