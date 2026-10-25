import { mathNumbersNE01R3Unit as mathNumbersNE01Unit } from '../data/textbook/math/numbers/ne01Lesson'
import { mathNumbersNE02LegacyUnit as mathNumbersNE02Unit } from '../data/textbook/math/numbers/ne02Lesson'
import type { TextbookSection, TextbookUnit } from '../domain/textbookSchema'

export type ReviewTarget = {
  id: string
  unitId: string
  title: string
  question: string
  revision: number
  totalItems: number
  blockIds: readonly string[]
  itemIds: readonly string[]
  expectedAnswers: readonly string[]
  /** Only these existing readingFlow blocks receive review-only markers. */
  markBlockIds: readonly string[]
  /** Accepted work remains in history; markers are absent from the next review build. */
  reviewState: 'awaiting-user' | 'needs-fix' | 'accepted'
}

/**
 * User-approved W-GOV-008/P-001 pilot. All content is selected by IDs from the
 * real PR lesson; no copied solution text or substituted illustration is used.
 */
function developmentTargets(unit: TextbookUnit): Record<string, ReviewTarget> {
  const section = unit.sections[0]
  return Object.fromEntries(section.items.filter(item => /^ne0[12]-\d{2}$/.test(item.id)).map(item => {
    const [prefix, number] = item.id.split('-')
    const lead = section.readingFlow.findIndex(block => block.id === prefix + '-lead-' + number)
    const intro = section.readingFlow.findIndex(block => block.id === prefix + '-intro-' + number)
    const first = intro >= 0 ? intro : lead
    const next = section.readingFlow.findIndex((block, index) => index > lead && (block.id.startsWith(prefix + '-lead-') || block.type === 'heading'))
    const blocks = section.readingFlow.slice(first, next < 0 ? undefined : next)
    const id = prefix + '-q' + number
    const selectedIds = blocks.flatMap(block => block.type === 'formula' || block.type === 'paragraph' ? block.parts.filter(p => p.type === 'choice').map(p => p.itemId) : [])
    return [id, {
      id, unitId: unit.unitId, title: unit.title,
      question: '式と説明のつながり、選択穴と誤答ヒントを確かめる',
      revision: unit.revision, totalItems: section.items.length,
      blockIds: blocks.map(block => block.id), itemIds: selectedIds, expectedAnswers: selectedIds.map(id => section.items.find(item => item.id === id)!.answer),
      markBlockIds: [prefix + '-formula-' + number], reviewState: 'awaiting-user',
    } satisfies ReviewTarget]
  }))
}

const targets: Record<string, ReviewTarget> = {
  'n07-q08-fraction-display': {
    id:'n07-q08-fraction-display',unitId:'math-numbers-expressions-n07',title:'循環小数の分数表示',question:'分母が数として正しく表示される',
    revision:3,totalItems:14,blockIds:['n07-lead-08','n07-formula-08','n07-after-08'],itemIds:['n07-08'],expectedAnswers:['x=\\frac89'],markBlockIds:['n07-formula-08'],reviewState:'awaiting-user',
  },
  'n10-q16-fraction-display': {
    id:'n10-q16-fraction-display',unitId:'math-numbers-expressions-n10',title:'有理化後の分数表示',question:'選択肢と完成式の分母を正しく保つ',
    revision:1,totalItems:21,blockIds:['formula-n10-16','paragraph-rationalize-concept'],itemIds:['n10-16'],expectedAnswers:['\\frac{\\sqrt3}{6}'],markBlockIds:['formula-n10-16'],reviewState:'awaiting-user',
  },

  ...developmentTargets(mathNumbersNE01Unit),
  ...developmentTargets(mathNumbersNE02Unit),
  // W-MATH-025/P-005: exact approved after-wrong hint only.
  'n05-q06-hint': {
    id:'n05-q06-hint',unitId:'math-numbers-expressions-n05',title:'N05 Q06 ヒント',
    question:'誤答後に計算方法を案内し、求める数値を先に教えない',
    revision:5,totalItems:33,
    blockIds:['n05-lead-06','n05-formula-06','n05-after-06'],
    itemIds:['n05-06'],expectedAnswers:['(4x)^2,\\quad(3y)^2'],
    markBlockIds:['n05-formula-06'],reviewState:'accepted',
  },
  // W-MATH-025/P-006: exact approved after-wrong hint only.
  'n07-q09-hint': {
    id:'n07-q09-hint',unitId:'math-numbers-expressions-n07',title:'N07 Q09 ヒント',
    question:'誤答後に計算方法を案内し、求める数値を先に教えない',
    revision:3,totalItems:14,
    blockIds:['n07-lead-09','n07-formula-09','n07-after-09'],
    itemIds:['n07-09'],expectedAnswers:['\\text{100倍},\\;100x=69.\\overline{69},\\;99x=69'],
    markBlockIds:['n07-formula-09'],reviewState:'accepted',
  },
  // W-MATH-025/P-007: exact approved after-wrong hint only.
  'n08-q05-hint': {
    id:'n08-q05-hint',unitId:'math-numbers-expressions-n08',title:'N08 Q05 ヒント',
    question:'誤答後に計算方法を案内し、求める数値を先に教えない',
    revision:3,totalItems:12,
    blockIds:['n08-lead-05','n08-formula-05','n08-after-05'],
    itemIds:['n08-05'],expectedAnswers:['5<9,\\quad\\sqrt5<3'],
    markBlockIds:['n08-formula-05'],reviewState:'accepted',
  },
  // W-MATH-017/P-003: precisely the two newly approved learner blocks.
  // The original unit and item instances are reused, never mocked.
  'n11-q01': {
    id: 'n11-q01', unitId: 'math-numbers-expressions-n11', title: 'N11 Q01', question: '負の数の大小比較',
    revision: 10, totalItems: 31,
    blockIds: ['n11-group-1', 'n11-show-n11-f01', 'n11-lead-01', 'n11-formula-01', 'n11-after-01'],
    itemIds: ['n11-01'],
    expectedAnswers: ['>'],
    markBlockIds: ['n11-formula-01'],
    reviewState: 'awaiting-user',
  },
  'n11-q05': {
    id: 'n11-q05', unitId: 'math-numbers-expressions-n11', title: 'N11 Q05–Q06', question: 'P-006 四行導出の式間説明',
    revision: 10, totalItems: 31,
    blockIds: ['n11-lead-05', 'n11-formula-05', 'n11-p006-q05-cancel-explain', 'n11-after-05', 'n11-p006-q06-positive-explain', 'n11-formula-06', 'n11-after-06'],
    itemIds: ['n11-wm017-q05-operation', 'n11-wm017-q05-balance', 'n11-05', 'n11-06'],
    expectedAnswers: ['2', '2', '7', '\\frac73'],
    markBlockIds: ['n11-p006-q05-cancel-explain', 'n11-p006-q06-positive-explain'],
    reviewState: 'accepted',
  },
  // P007: highlight only Q08/Q09, keep P006 accepted markers hidden.
  'n11-q08-q09': {
    id:'n11-q08-q09', unitId:'math-numbers-expressions-n11', title:'N11 Q08〜Q09', question:'引き算と負数除算',
    revision:10, totalItems:31,
    blockIds:['n11-lead-08','n11-formula-08','n11-p007-q08-explain',
      'n11-after-08','n11-p007-q09-explain','n11-formula-09','n11-after-09'],
    itemIds:['n11-p007-q08-subtract-left','n11-p007-q08-subtract-right','n11-08','n11-p007-q09-direction','n11-09'],
    expectedAnswers:['3','3','2','\\ge','-1'],
    markBlockIds:['n11-formula-08','n11-p007-q08-explain','n11-after-08',
      'n11-p007-q09-explain','n11-formula-09'],
    reviewState:'accepted', // P007 user 「いいよ」; suppress old markers
  },
  'n11-q13': {
    id:'n11-q13',unitId:'math-numbers-expressions-n11',title:'N11 Q13',question:'正の3を掛ける→右辺を展開',
    revision:10,totalItems:31,
    blockIds:['n11-lead-13','n11-formula-13','n11-p008-q13-positive-explain','n11-p008-q13-cancel','n11-p008-q13-distribute-explain','n11-p008-q13-result','n11-after-13'],
    itemIds:['n11-p008-q13-mul-left','n11-p008-q13-mul-right','n11-13','n11-p008-q13-constant'],
    expectedAnswers:['3','3','6','3'],
    markBlockIds:['n11-formula-13','n11-p008-q13-positive-explain','n11-p008-q13-distribute-explain','n11-p008-q13-result'],
    reviewState:'accepted', // P008 Q13 user 「いいよ続けて」: previously accepted image
  },
  // W-MATH-018/P-001 — marks only the N14 Q10 source correction
  'n14-q10': {
    id:'n14-q10',unitId:'math-numbers-expressions-n14',title:'N14 Q10',
    question:'三辺への同じ操作と左右の境界値',revision:10,totalItems:38,
    blockIds:['n14-lead-10','n14-formula-10','n14-wm018-q10-explain','n14-wm018-q10-result','n14-after-10'],
    itemIds:['n14-wm018-q10-add-left','n14-wm018-q10-add-center','n14-wm018-q10-add-right','n14-10','n14-wm018-q10-bound-right'],
    expectedAnswers:['3','3','3','-2','8'],
    markBlockIds:['n14-formula-10','n14-wm018-q10-explain','n14-wm018-q10-result'],
    reviewState:'accepted', // user approved concise N14 Q10 formula layout; retain history, hide review marks
  },
  // W-MATH-019/P-001 — Q14 only, genuine original 5-step formula review.
  'n14-q14': {
    id:'n14-q14',unitId:'math-numbers-expressions-n14',title:'N14 Q14',
    question:'三辺に同じ2を足して境界を計算する',revision:10,totalItems:38,
    blockIds:['n14-lead-14','n14-formula-14','n14-wm019-q14-explain','n14-wm019-q14-result','n14-after-14'],
    itemIds:['n14-wm019-q14-add-left','n14-wm019-q14-add-center','n14-wm019-q14-add-right','n14-14','n14-wm019-q14-bound-right'],
    expectedAnswers:['2','2','2','-2','6'],
    markBlockIds:['n14-formula-14','n14-wm019-q14-explain','n14-wm019-q14-result'],
    reviewState:'accepted', // 2026-10-22 user「いいよ」 to concise 3-equation N14 Q14 Gate1 visual; retain history
  },
  // W-MATH-020/P-001 — original Q15 positive division, five decision stages.
  'n14-q15': {
    id:'n14-q15',unitId:'math-numbers-expressions-n14',title:'N14 Q15',
    question:'三辺を正の3で割り、左右の境界を求める',revision:10,totalItems:38,
    blockIds:['n14-lead-15','n14-formula-15','n14-wm020-q15-explain','n14-wm020-q15-result','n14-after-15'],
    itemIds:['n14-wm020-q15-divide-left','n14-wm020-q15-divide-center','n14-wm020-q15-divide-right','n14-15','n14-wm020-q15-bound-right'],
    expectedAnswers:['3','3','3','-\\frac23','2'],
    markBlockIds:['n14-formula-15','n14-wm020-q15-explain','n14-wm020-q15-result'],
    reviewState:'accepted', // user 「続けて」 to concise Q15 math Gate1 layout; preserve source-matched image history
  },
  // W-MATH-022/P-001: the original Q16 now has five genuine decisions.
  // All five grouped visuals accepted 2026-10-23; keep immutable evidence.
  'n14-q16': {
    id:'n14-q16',unitId:'math-numbers-expressions-n14',title:'N14 Q16',
    question:'左右の端点を代入して絶対値と境界包含を確かめる',revision:10,totalItems:38,
    blockIds:['n14-lead-16','n14-formula-16','n14-wm022-q16-right',
      'n14-wm022-q16-bridge','n14-wm022-q16-conclusion','n14-after-16'],
    itemIds:['n14-wm022-q16-left-inner','n14-wm022-q16-left-abs',
      'n14-wm022-q16-right-inner','n14-wm022-q16-right-abs','n14-16'],
    expectedAnswers:['-4','4','4','4','両端とも含む'],
    markBlockIds:['n14-formula-16','n14-wm022-q16-right','n14-wm022-q16-conclusion'],
    reviewState:'accepted',
  },
  // W-MATH-023/P-002 Stage A: original Q05 is now two meaningful choices.
  // No marker or other learner changes for historical N13 Q08 (Stage B pending).
  'n13-q05': {
    id:'n13-q05',unitId:'math-numbers-expressions-n13',title:'N13 Q05',
    question:'xと1の二点間の距離を、x≥1とx<1の場合に分けて表す',
    revision:4,totalItems:12,
    blockIds:['n13-show-n13-f01','n13-lead-05','n13-wm023-q05-right','n13-formula-05','n13-after-05'],
    itemIds:['n13-wm023-q05-right','n13-05'],
    expectedAnswers:['x-1','1-x'],
    markBlockIds:['n13-wm023-q05-right','n13-formula-05'],
    reviewState:'accepted',
  },
  // W-MATH-023/P-002 Stage B: only Q08 receives new numbered review markers.
  'n13-q08': {
    id:'n13-q08',unitId:'math-numbers-expressions-n13',title:'N13 Q08',
    question:'絶対値の正負2枝を作り、それぞれの方程式を解く',
    revision:4,totalItems:12,
    blockIds:['n13-lead-08','n13-formula-08','n13-wm023-q08-positive-root',
      'n13-wm023-q08-negative-root','n13-after-08'],
    itemIds:['n13-wm023-q08-branches','n13-wm023-q08-positive-root','n13-08'],
    expectedAnswers:['3x=6\\;\\text{または}\\;3x=-6','2','-2'],
    markBlockIds:['n13-formula-08','n13-wm023-q08-positive-root','n13-wm023-q08-negative-root'],
    reviewState:'accepted',
  },
  // W-MATH-025/P-001: one original N05 Q11 hint, source-native visuals only.
  'n05-q11': {
    id:'n05-q11',unitId:'math-numbers-expressions-n05',title:'N05 Q11',
    question:'整数組を先出しせず、積と和の条件を確かめる誤答ヒント',
    revision:5,totalItems:33,
    blockIds:['n05-lead-11','n05-formula-11','n05-after-11'],
    itemIds:['n05-11'],expectedAnswers:['(a-8)(a+2)'],
    markBlockIds:['n05-formula-11'],reviewState:'accepted', // user 「続けていいよ」 accepted Q11 visual on 2026-10-23
  },
  // W-MATH-025/P-004: one original Q06 wrong-only hint; no change to the student task.
  'n06-q06': {
    id:'n06-q06',unitId:'math-numbers-expressions-n06',title:'N06 Q06',
    question:'完成した因数を教えず、符号と置換の復元を手掛かりにする誤答ヒント',
    revision:6,totalItems:22,
    blockIds:['n06-lead-06','n06-formula-06','n06-after-06'],
    itemIds:['n06-06'],expectedAnswers:['(x^2-1)(x^2-4)'],
    markBlockIds:['n06-formula-06'],reviewState:'accepted', // user Q06 hint visual acceptance; fixed evidence retained
  },
  // W-MATH-026/P-001: a distinct review of choices; accepted Q12 hint stays closed.
  'n06-q12-choices': {
    id:'n06-q12-choices',unitId:'math-numbers-expressions-n06',title:'N06 Q12 選択肢',
    question:'数学的に異なる四つの選択肢と、保存済み旧誤答からの再回答',
    revision:6,totalItems:22,
    blockIds:['n06-lead-12','n06-formula-12','n06-after-12'],
    itemIds:['n06-12'],expectedAnswers:['(x+y)(x+2)(x-1)'],
    markBlockIds:['n06-formula-12'],reviewState:'accepted',
  },
  // W-MATH-025/P-003: the one original Q03 wrong-only hint; source revision unchanged.
  'n06-q03': {
    id:'n06-q03',unitId:'math-numbers-expressions-n06',title:'N06 Q03',
    question:'整数組を先に教えず、符号と和・積から考え直す誤答ヒント',
    revision:6,totalItems:22,
    blockIds:['n06-lead-03','n06-formula-03','n06-after-03'],
    itemIds:['n06-03'],expectedAnswers:['(X-3)(X+2)'],
    markBlockIds:['n06-formula-03'],reviewState:'accepted', // hint-only visual accepted by 「ヒントならいいよじゃ続けて」
  },
  // W-MATH-025/P-002: hint-only visual accepted; immutable evidence retained.
  'n06-q12': {
    id:'n06-q12',unitId:'math-numbers-expressions-n06',title:'N06 Q12',
    question:'二数の符号を手掛かりにし、先の因子も残す誤答ヒント',
    revision:6,totalItems:22,
    blockIds:['n06-lead-12','n06-formula-12','n06-after-12'],
    itemIds:['n06-12'],expectedAnswers:['(x+y)(x+2)(x-1)'],
    markBlockIds:['n06-formula-12'],reviewState:'accepted',
  },
  // W-MATH-024/P-001: one real original Q18 after-wrong hint; no learner content copy.
  'n05-q18': {
    id:'n05-q18',unitId:'math-numbers-expressions-n05',title:'N05 Q18',
    question:'二条件で正しい因数分解を選び、誤答ヒントが正解の係数を先出ししないか確かめる',
    revision:5,totalItems:33,
    blockIds:['n05-lead-18','n05-formula-18','n05-after-18'],
    itemIds:['n05-18'],
    expectedAnswers:['(x-1)(5x+3)'],
    markBlockIds:['n05-formula-18'],
    reviewState:'accepted',
  },
  'n01-q07': {
    id: 'n01-q07', unitId: 'math-numbers-expressions-n01', title: 'N01 Q07', question: '同類項の係数',
    revision:5, totalItems: 18,
    blockIds: [
      'formula-like-original', 'paragraph-n01-07-intro',
      'formula-r3-q07-x2coef', 'formula-r3-q07-xcoef',
      'formula-r3-q07-const', 'formula-n01-07',
    ],
    itemIds: ['n01-r3-q07-x2coef', 'n01-r3-q07-xcoef', 'n01-r3-q07-const', 'n01-07'],
    expectedAnswers: ['-2', '-3', '3', '-2x^2-3x+3'],
    markBlockIds: ['formula-r3-q07-x2coef', 'formula-r3-q07-xcoef', 'formula-r3-q07-const'],
    reviewState: 'awaiting-user',
  },
  'n04-q01': {
    id: 'n04-q01', unitId: 'math-numbers-expressions-n04', title: 'N04 Q01', question: '四つの積',
    revision:5, totalItems: 5,
    blockIds: [
      'paragraph-n04-intro', 'paragraph-n04-dialogue', 'paragraph-n04-four-products',
      'formula-n04-q01-p1', 'formula-n04-q01-p2',
      'formula-n04-q01-p3', 'formula-n04-q01-p4',
      'paragraph-n04-collect-without-combining', 'formula-n04-q01-complete',
    ],
    itemIds: ['n04-q01-p1', 'n04-q01-p2', 'n04-q01-p3', 'n04-q01-p4', 'n04-01'],
    expectedAnswers: ['25x^2', '20xy', '20xy', '16y^2', '25x^2+20xy+20xy+16y^2'],
    markBlockIds: ['formula-n04-q01-p1', 'formula-n04-q01-p2', 'formula-n04-q01-p3', 'formula-n04-q01-p4', 'formula-n04-q01-complete'],
    reviewState: 'awaiting-user',
  },
  'n03-q10': {
    id: 'n03-q10', unitId: 'math-numbers-expressions-n03', title: 'N03 Q10', question: '四つの積',
    revision:5, totalItems:23,
    blockIds: [
      'paragraph-two-brackets', 'figure-multiplication-grid', 'paragraph-grid-products',
      'formula-r3-q10-p1', 'formula-r3-q10-p2',
      'formula-r3-q10-p3', 'formula-r3-q10-p4', 'formula-n03-10',
    ],
    itemIds: ['n03-r3-q10-p1', 'n03-r3-q10-p2', 'n03-r3-q10-p3', 'n03-r3-q10-p4', 'n03-10'],
    expectedAnswers: ['6x^2', '8x', '3x', '4', '6x^2+8x+3x+4'],
    markBlockIds: ['formula-r3-q10-p1', 'formula-r3-q10-p2', 'formula-r3-q10-p3', 'formula-r3-q10-p4'],
    reviewState: 'awaiting-user',
  },
  // W025/P-008: exact approved hint-only scope; previous accepted blocks stay closed.
  'n04-q20-hint': {
    id:'n04-q20-hint',unitId:'math-numbers-expressions-n04',title:'N04 Q20 hint',
    question:'現在の答えを先出しせず、計算・判断の手順を案内する誤答ヒント',
    revision:5,totalItems:36,
    blockIds:["n04-lead-20","n04-formula-20","n04-after-20"],
    itemIds:["n04-20"],expectedAnswers:["(x^2+5x+4)(x^2+5x+6)"],
    markBlockIds:['n04-formula-20'],reviewState:'accepted',
  },
  // W025/P-009: exact approved hint-only scope; previous accepted blocks stay closed.
  'n10-q07-hint': {
    id:'n10-q07-hint',unitId:'math-numbers-expressions-n10',title:'N10 Q07 hint',
    question:'現在の答えを先出しせず、計算・判断の手順を案内する誤答ヒント',
    revision:1,totalItems:21,
    blockIds:["paragraph-product-check","formula-n10-07"],
    itemIds:["n10-07"],expectedAnswers:["\\sqrt{48}=\\sqrt{16\\cdot3}"],
    markBlockIds:['formula-n10-07'],reviewState:'accepted',
  },
  // W025/P-010: exact approved hint-only scope; previous accepted blocks stay closed.
  'n10-q08-hint': {
    id:'n10-q08-hint',unitId:'math-numbers-expressions-n10',title:'N10 Q08 hint',
    question:'現在の答えを先出しせず、計算・判断の手順を案内する誤答ヒント',
    revision:1,totalItems:21,
    blockIds:["paragraph-product-check","formula-n10-07","formula-n10-08"],
    itemIds:["n10-07","n10-08"],expectedAnswers:["\\sqrt{48}=\\sqrt{16\\cdot3}","4\\sqrt3"],
    markBlockIds:['formula-n10-08'],reviewState:'accepted',
  },
  // W025/P-011: exact approved hint-only scope; previous accepted blocks stay closed.
  'n12-q06-coef-hint': {
    id:'n12-q06-coef-hint',unitId:'math-numbers-expressions-n12',title:'N12 Q06 hint',
    question:'現在の答えを先出しせず、計算・判断の手順を案内する誤答ヒント',
    revision:3,totalItems:35,
    blockIds:["paragraph-triple-solve","formula-q06-left-coef","paragraph-q06-left-const"],
    itemIds:["n12-p002-q06-left-coef"],expectedAnswers:["1"],
    markBlockIds:['formula-q06-left-coef'],reviewState:'accepted',
  },
  // W025/P-012: exact approved hint-only scope; previous accepted blocks stay closed.
  'n12-q12-coef-hint': {
    id:'n12-q12-coef-hint',unitId:'math-numbers-expressions-n12',title:'N12 Q12 hint',
    question:'現在の答えを先出しせず、計算・判断の手順を案内する誤答ヒント',
    revision:3,totalItems:35,
    blockIds:["paragraph-cost-negative","formula-q12-signed-coef","paragraph-cost-collect"],
    itemIds:["n12-p002-q12-signed-coef"],expectedAnswers:["-130"],
    markBlockIds:['formula-q12-signed-coef'],reviewState:'accepted',
  },
  // W025/P-013: exact approved hint-only scope; previous accepted blocks stay closed.
  'n04-q22-hint': {
    id:'n04-q22-hint',unitId:'math-numbers-expressions-n04',title:'N04 Q22 hint',
    question:'現在の答えを先出しせず、計算・判断の手順を案内する誤答ヒント',
    revision:5,totalItems:36,
    blockIds:["n04-lead-22","n04-formula-22","n04-after-22"],
    itemIds:["n04-22"],expectedAnswers:["x^4+10x^3+35x^2+50x+24"],
    markBlockIds:['n04-formula-22'],reviewState:'accepted',
  },
  // W025/P-014: exact approved hint-only scope; previous accepted blocks stay closed.
  'n07-q11-hint': {
    id:'n07-q11-hint',unitId:'math-numbers-expressions-n07',title:'N07 Q11 hint',
    question:'現在の答えを先出しせず、計算・判断の手順を案内する誤答ヒント',
    revision:3,totalItems:14,
    blockIds:["n07-lead-11","n07-formula-11","n07-after-11"],
    itemIds:["n07-11"],expectedAnswers:["2^k\\cdot5^k"],
    markBlockIds:['n07-formula-11'],reviewState:'accepted',
  },
  'n12-q06-layout': {
    id:'n12-q06-layout',unitId:'math-numbers-expressions-n12',
    title:'N12 Q06 数式の表示',question:'通常学習と同じ折り返しで、数式と係数欄を読めるか確認する',
    revision:3,totalItems:35,blockIds:["paragraph-triple-solve","formula-q06-left-coef","paragraph-q06-left-const"],
    itemIds:["n12-p002-q06-left-coef"],expectedAnswers:["1"],
    markBlockIds:["formula-q06-left-coef"],reviewState:'accepted',
  },
  'n12-q12-layout': {
    id:'n12-q12-layout',unitId:'math-numbers-expressions-n12',
    title:'N12 Q12 数式の表示',question:'通常学習と同じ折り返しで、数式と係数欄を読めるか確認する',
    revision:3,totalItems:35,blockIds:["paragraph-cost-negative","formula-q12-signed-coef","paragraph-cost-collect"],
    itemIds:["n12-p002-q12-signed-coef"],expectedAnswers:["-130"],
    markBlockIds:["formula-q12-signed-coef"],reviewState:'accepted',
  },
  'n12-q02-layout': {
    id:'n12-q02-layout',unitId:'math-numbers-expressions-n12',
    title:'N12 Q02 係数',question:'式と穴のつながりを確かめる',
    revision:3,totalItems:35,blockIds:['formula-q02-coef'],
    itemIds:['n12-p002-q02-coef'],expectedAnswers:['2'],
    markBlockIds:['formula-q02-coef'],reviewState:'awaiting-user',
  },
  'n12-q06-right-layout': {
    id:'n12-q06-right-layout',unitId:'math-numbers-expressions-n12',
    title:'N12 Q06 右側の係数',question:'式と穴のつながりを確かめる',
    revision:3,totalItems:35,blockIds:['formula-q06-right-coef'],
    itemIds:['n12-p002-q06-right-coef'],expectedAnswers:['3'],
    markBlockIds:['formula-q06-right-coef'],reviewState:'awaiting-user',
  },
  'n12-q10-pudding-layout': {
    id:'n12-q10-pudding-layout',unitId:'math-numbers-expressions-n12',
    title:'N12 Q10 プリン代',question:'式と穴のつながりを確かめる',
    revision:3,totalItems:35,blockIds:['formula-cost-pudding'],
    itemIds:['n12-p003-q10-pudding-coef'],expectedAnswers:['130'],
    markBlockIds:['formula-cost-pudding'],reviewState:'awaiting-user',
  },
  'n12-q13-lower-layout': {
    id:'n12-q13-lower-layout',unitId:'math-numbers-expressions-n12',
    title:'N12 Q13 下限',question:'式と穴のつながりを確かめる',
    revision:3,totalItems:35,blockIds:['formula-q13-lower'],
    itemIds:['n12-p002-q13-lower'],expectedAnswers:['550'],
    markBlockIds:['formula-q13-lower'],reviewState:'awaiting-user',
  },
}

export const reviewTargets = targets

/** Never expose markers for a block that the user has already accepted. */
export function activeReviewMarkIds(target: ReviewTarget): readonly string[] {
  return target.reviewState === 'accepted' ? [] : target.markBlockIds
}

export function extractReviewSection(unit: TextbookUnit, target: ReviewTarget): TextbookSection | null {
  if (unit.unitId !== target.unitId || unit.revision !== target.revision) return null
  if (new Set(target.markBlockIds).size !== target.markBlockIds.length) return null
  if (target.markBlockIds.some(id => !target.blockIds.includes(id))) return null
  const section = unit.sections.find(candidate => candidate.id === 'lesson')
  if (!section || section.items.length < target.totalItems) return null

  const blocks = target.blockIds.map(id => section.readingFlow.find(block => block.id === id))
  const items = target.itemIds.map(id => section.items.find(item => item.id === id))
  if (blocks.some(block => !block) || items.some(item => !item)) return null

  // Guard against stale/partial PR content and any accidental answer/key change.
  if (items.some((item, index) => item?.answer !== target.expectedAnswers[index])) return null
  const actualChoiceOrder = blocks.flatMap(block => {
    if (!block || (block.type !== 'paragraph' && block.type !== 'formula')) return []
    return block.parts.filter(part => part.type === 'choice').map(part => part.itemId)
  })
  if (actualChoiceOrder.join('|') !== target.itemIds.join('|')) return null

  return {
    ...section,
    readingFlow: blocks as TextbookSection['readingFlow'],
    items: items as TextbookSection['items'],
  }
}

