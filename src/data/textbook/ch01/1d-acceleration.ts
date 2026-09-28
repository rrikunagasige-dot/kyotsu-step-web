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
    unitId: 'physics-1d-acceleration',
    revision: 1,
    status: 'published',
    subject: 'physics',
    chapter: {
      chapterId: 'physics-ch01-motion',
      chapterNumber: '1',
      chapterTitle: '物体の運動',
      unitCode: '1D',
      orderInChapter: 4,
      sourcePages: [18, 19],
    },
    title: 'D 加速度',
    subtitle: '速度の変化をベクトルで読み、等加速度運動と運動方程式へつなぐ',
    source: {
      type: 'reference',
      label: '物理・教科書モード｜1D 加速度',
      rightsNote: 'ユーザー提供教材と原教科書 p.18–19 を学習アプリ用の構造化データへ変換',
    },
    objectives: [
      '加速度を単位時間あたりの速度変化として理解する',
      '平均加速度と瞬間加速度を区別する',
      '等加速度直線運動の3式を使い分ける',
      '加速度の向きと合力の向きを運動方程式で接続する',
    ],
    sections: [
      {
        id: 'knowledge-check',
        number: '01',
        title: '知識点チェック',
        role: 'concept',
        description: '加速度の定義から等加速度運動、運動方程式までを意味のつながりで確認する。',
        figures: [],
        readingFlow: [
          heading('kc-h-1', '1-1　速度の変化と加速度'),
          paragraph(
            'kc-p-1',
            t('物体の速度が時間とともに変化するとき、単位時間あたりの速度の変化を '),
            c('d1-1'),
            t(' という。'),
          ),
          heading('kc-h-2', '1-2　平均加速度と瞬間加速度'),
          paragraph(
            'kc-p-2',
            t('時刻の差を '),
            m('\\Delta t'),
            t('、その間の速度の変化を '),
            m('\\Delta \\vec v=\\vec v_2-\\vec v_1'),
            t(' とすると、平均加速度は'),
          ),
          formula('kc-f-1', m('\\bar{\\vec a}='), c('d1-2'), m('/'), c('d1-3')),
          paragraph(
            'kc-p-3',
            t('時間間隔を限りなく短くすると、その瞬間の速度がどの向きにどんな割合で変化するかを表す瞬間加速度になる。一般に「加速度」といえば瞬間加速度を指す。'),
          ),
          heading('kc-h-3', '1-3　等加速度直線運動'),
          paragraph('kc-p-4', t('加速度 '), m('a'), t(' が一定なら、速度は時間に対して一定の割合で変化する。')),
          formula('kc-f-2', m('v=v_0+'), c('d1-4')),
          formula('kc-f-3', m('x=v_0t+'), c('d1-5')),
          formula('kc-f-4', m('v^2-v_0^2='), c('d1-6')),
          heading('kc-h-4', '1-4　運動の第2法則との接続'),
          formula('kc-f-5', m('m\\vec a='), c('d1-7')),
          paragraph(
            'kc-p-5',
            t('加速度の向きは速度そのものの向きではなく、速度の '),
            c('d1-8'),
            t(' の向きである。運動方程式では、この加速度の向きは合力の向きと一致する。'),
          ),
        ],
        items: [
          item('d1-1', '1D-1', '単位時間あたりの速度の変化を何というか。', '加速度', ['加速度', '速度', '変位', '力積']),
          item('d1-2', '1D-2', '平均加速度の分子を答えよ。', 'Δv', ['Δv', 'Δt', 'v', 'a'], 'formula', ['Δv⃗', 'delta v']),
          item('d1-3', '1D-3', '平均加速度の分母を答えよ。', 'Δt', ['Δt', 'Δv', 't', 'v'], 'formula', ['delta t']),
          item('d1-4', '1D-4', 'v=v₀+【　】 の空欄を答えよ。', 'at', ['at', 'ax', 'v₀t', '1/2at²'], 'formula'),
          item('d1-5', '1D-5', 'x=v₀t+【　】 の空欄を答えよ。', '1/2at²', ['1/2at²', 'at', '2ax', 'v₀²'], 'formula', ['at²/2', '1/2 a t^2']),
          item('d1-6', '1D-6', 'v²−v₀²=【　】 の空欄を答えよ。', '2ax', ['2ax', 'at', '1/2at²', '2vt'], 'formula'),
          item('d1-7', '1D-7', '運動方程式 m a⃗=【　】 の空欄を答えよ。', 'F⃗', ['F⃗', 'v⃗', 'p⃗', 'Δv⃗'], 'formula', ['F']),
          item('d1-8', '1D-8', '加速度の向きは速度の何の向きか。', '変化', ['変化', '大きさ', '位置', '平均'], 'text', ['速度の変化']),
        ],
      },
      {
        id: 'figure-reading',
        number: '02',
        title: '図の読み取り',
        role: 'figure-reading',
        description: '曲線運動でも加速度は「速度ベクトルの差」から決まることを図で確認する。',
        figures: [
          {
            id: 'trajectory-velocity-figure',
            src: '/assets/physics/textbook/ch01/1d/acceleration-trajectory.webp',
            alt: '曲線上の P1 と P2 で速度 v1 と v2 が異なる向きをもち、その間の時間差 Δt を示す図',
            caption: '図9　曲線運動における2時刻の速度',
            overlays: [],
          },
          {
            id: 'velocity-change-figure',
            src: '/assets/physics/textbook/ch01/1d/velocity-change-acceleration.webp',
            alt: 'v1 と v2 の差として Δv を作り、平均加速度が Δv と同じ向きをもつことを示す図',
            caption: '図10　速度変化 Δv と平均加速度',
            overlays: [
              {
                id: 'hotspot-d-1',
                itemId: 'd-1',
                mode: 'hotspot',
                x: 72,
                y: 19,
                width: 20,
                height: 22,
                reveal: 'after-answer',
                ariaLabel: '赤い Δv ベクトルが何を表すか確認する',
              },
              {
                id: 'mask-d-2',
                itemId: 'd-2',
                mode: 'mask',
                x: 66,
                y: 71,
                width: 29,
                height: 18,
                reveal: 'after-answer',
                ariaLabel: '平均加速度の向きを決めるベクトルを答える',
              },
            ],
          },
        ],
        readingFlow: [
          note('fr-note-1', '速度の向きが変わるだけでも速度ベクトルは変化するので、加速度は0とは限らない。'),
          figure('fr-fig-1', 'trajectory-velocity-figure'),
          paragraph('fr-p-1', t('P₁ から P₂ へ進む間に、速度は '), m('\\vec v_1'), t(' から '), m('\\vec v_2'), t(' へ変化する。')),
          figure('fr-fig-2', 'velocity-change-figure'),
          paragraph('fr-p-2', t('図10の赤いベクトルと、下の向きの関係を図から確認する。')),
        ],
        items: [
          item('d-1', 'D-1', '図10の Δv⃗ は何を表すか。', '速度の変化', ['速度の変化', '位置の変化', '経過時間', '速度の大きさ']),
          item('d-2', 'D-2', '平均加速度の向きは何の向きと一致するか。', 'Δv', ['Δv', 'v₁', 'v₂', 'Δt'], 'formula', ['Δv⃗', '速度の変化']),
        ],
      },
      {
        id: 'example-q1',
        number: '03',
        title: '例題1｜静止からの等加速度運動',
        role: 'worked-example',
        description: '速度式と位置式を同じ初期条件から使う。',
        figures: [],
        readingFlow: [
          heading('q1-h-1', '問題'),
          paragraph(
            'q1-p-1',
            t('物体が静止から '),
            m('2.0\\,\\mathrm{m/s^2}'),
            t(' の一定加速度で '),
            m('3.0\\,\\mathrm{s}'),
            t(' 進む。3.0 s 後の速度と変位を求める。'),
          ),
          heading('q1-h-2', 'STEP 1　速度'),
          formula('q1-f-1', m('v=0+2.0\\times3.0='), c('q1-1'), m('\\,\\mathrm{m/s}')),
          heading('q1-h-3', 'STEP 2　変位'),
          formula('q1-f-2', m('x=\\frac12\\times2.0\\times3.0^2='), c('q1-2'), m('\\,\\mathrm{m}')),
        ],
        items: [
          item('q1-1', 'Q1-1', '0+2.0×3.0 を計算し、3.0 s後の速度を答えよ。', '6.0', ['6.0', '5.0', '9.0', '3.0'], 'number', ['6']),
          item('q1-2', 'Q1-2', '1/2×2.0×3.0² を計算し、変位を答えよ。', '9.0', ['9.0', '6.0', '18', '4.5'], 'number', ['9']),
        ],
      },
      {
        id: 'example-q2',
        number: '04',
        title: '例題2｜時間を使わず距離を求める',
        role: 'worked-example',
        description: '初速度・終速度・加速度が与えられたとき、時間を消去した式を選ぶ。',
        figures: [],
        readingFlow: [
          heading('q2-h-1', '問題'),
          paragraph(
            'q2-p-1',
            t('初速度 '),
            m('4.0\\,\\mathrm{m/s}'),
            t('、加速度 '),
            m('3.0\\,\\mathrm{m/s^2}'),
            t(' の物体が、速度 '),
            m('10\\,\\mathrm{m/s}'),
            t(' になるまでに進む距離を求める。'),
          ),
          heading('q2-h-2', 'STEP 1　時間を含まない式を使う'),
          formula('q2-f-1', m('10^2-4.0^2='), c('q2-1'), m('x')),
          heading('q2-h-3', 'STEP 2　距離'),
          formula('q2-f-2', m('x='), c('q2-2'), m('\\,\\mathrm{m}')),
        ],
        items: [
          item('q2-1', 'Q2-1', 'v²−v₀²=2ax に a=3.0 を代入したとき、x の係数を答えよ。', '6', ['6', '3', '12', '2'], 'number'),
          item('q2-2', 'Q2-2', '100−16=6x から距離 x を答えよ。', '14', ['14', '12', '16', '84'], 'number', ['14.0']),
        ],
      },
      {
        id: 'final-review',
        number: '05',
        title: '最後の知識確認',
        role: 'review',
        description: '定義・等加速度運動・運動方程式を一つの流れとして再接続する。',
        figures: [],
        readingFlow: [
          paragraph('frv-p-1', t('加速度は単位時間あたりの '), c('f-1'), t(' の変化を表す。')),
          formula('frv-f-1', m('v=v_0+'), c('f-2')),
          formula('frv-f-2', c('f-3')),
        ],
        items: [
          item('f-1', 'F-1', '加速度は単位時間あたりの何の変化か。', '速度', ['速度', '位置', '質量', '力']),
          item('f-2', 'F-2', '等加速度直線運動の v=v₀+【　】 を埋めよ。', 'at', ['at', 'ax', '2ax', '1/2at²'], 'formula'),
          item('f-3', 'F-3', '運動方程式を式で答えよ。', 'ma=F', ['ma=F', 'mv=F', 'm/a=F', 'a=mF'], 'formula', ['F=ma']),
        ],
      },
    ],
  },
]

export const textbookUnit1D = validateTextbookUnits(rawTextbookUnits)[0]
