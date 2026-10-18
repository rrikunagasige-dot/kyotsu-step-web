import { expect, test, type Page } from '@playwright/test'

const appRoute = (path: string) => `/kyotsu-step-web/#${path}`

async function clearState(page: Page) {
  await page.goto(appRoute('/problems'))
  await page.evaluate(() => localStorage.clear())
  await page.reload()
}

async function chooseWrongOption(page: Page, itemId: string, correctLabel: string) {
  await page.getByTestId(`textbook-item-${itemId}`).click()
  const panel = page.getByTestId(`inline-choice-panel-${itemId}`)
  await expect(panel).toBeVisible()

  const options = panel.locator('.reading-choice-option')
  for (let index = 0; index < await options.count(); index += 1) {
    const option = options.nth(index)
    const label = (await option.getAttribute('aria-label')) ?? ''
    if (label !== correctLabel) {
      await option.click()
      return
    }
  }
  throw new Error(`No distractor visible for ${itemId}`)
}


async function advanceMathStage(page: Page) {
  const button = page.getByTestId('math-textbook-next-stage')
  await expect(button).toBeVisible()
  await button.click()
}

async function answerItem(page: Page, itemId: string, answer: string) {
  await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
  const target = page.getByTestId(`textbook-item-${itemId}`)
  // Review-only units have the original renderer and must NEVER inherit math-sets
  // navigation. Only this published math-sets pilot has explicit "次へ" stages.
  if (await page.getByTestId('math-textbook-compact-flow').count()) {
    for (let i = 0; i < 20 && await target.count() === 0; i += 1) {
      await advanceMathStage(page)
    }
  }
  await expect(target).toBeVisible()
  await target.click()
  const panel = page.getByTestId(`inline-choice-panel-${itemId}`)
  await expect(panel).toBeVisible()
  await panel.getByRole('button', { name: answer, exact: true }).click()
}

async function completeFirstSetsSlice(page: Page) {
  const answers: Array<[string, string]> = [
    ['set-a01', '1, 2, 3, 4, 6, 8, 12, 24'],
    ['set-a02', '入っている'],
    ['set-a03', '入っていない'],
    ['set-a04', '\\in'],
    ['set-a05', '\\notin'],
    ['set-a06', '1, 3, 5'],
    ['set-a07', '7, 9, 11'],
    ['set-a08', '同じ集合'],
    ['set-a08b', '要素を書き並べる方法'],
    ['set-a08c', '条件を述べる方法'],
    ['set-a09', 'Aは数え終わり、Bは無限に続く'],
    ['set-a10', 'Aは有限集合、Bは無限集合'],
  ]
  for (const [itemId, answer] of answers) await answerItem(page, itemId, answer)
  await advanceMathStage(page)
}



async function completeRelationsAndSubsets(page: Page) {
  const answers: Array<[string, string]> = [
    ['set-b01', '3, 5, 7'],
    ['set-b02', 'AとBの両方に属する要素'],
    ['set-b03', '1, 2, 3, 5, 7, 9'],
    ['set-b04', 'ない'],
    ['set-b05', 'AかBの少なくとも一方に属する要素'],
    ['set-b06', '2つの円の重なりだけ'],
    ['set-b07', 'AとBの2つの円全体'],
    ['set-b08', '3つすべてに属する要素'],
    ['set-b09', '3つのうち少なくとも1つに属する要素'],
    ['set-c01', 'すべて入っている'],
    ['set-c02', '4がAにないので、全部は入っていない'],
    ['set-c03', '0個'],
    ['set-c04', '{1}, {2}, {3}'],
    ['set-c05', '{1,2}, {1,3}, {2,3}'],
    ['set-c06', 'はい'],
    ['set-c07', '∅, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3}'],
    ['set-c08', '残らない'],
  ]
  for (const [itemId, answer] of answers) await answerItem(page, itemId, answer)
  await advanceMathStage(page)
}

async function completeComplements(page: Page) {
  const answers: Array<[string, string]> = [
    ['set-d01', '入れない'],
    ['set-d02', '1, 3, 5, 7, 9, 11'],
    ['set-d03', '1, 2, 4, 5, 7, 8, 10, 11'],
    ['set-d04', '両方'],
    ['set-d05', '2, 4, 8, 10'],
    ['set-d06', '少なくとも一方'],
    ['set-d07', '1, 3, 5, 6, 7, 9, 11, 12'],
    ['set-d08', '全部'],
    ['set-d09', 'ない'],
    ['set-d10', 'A'],
    ['set-d11a', '1つもない'],
    ['set-d11b', 'Uの全部'],
  ]
  for (const [itemId, answer] of answers) await answerItem(page, itemId, answer)
  await advanceMathStage(page)
}

async function completeDeMorgan(page: Page) {
  const answers: Array<[string, string]> = [
    ['set-e01', '2つの円の重なり'],
    ['set-e02', '重なり以外のU全体'],
    ['set-e03', '\\overline{A}\\cup\\overline{B}'],
    ['set-e04', '同じ'],
    ['set-e05', '\\overline{A}\\cup\\overline{B}'],
    ['set-e06', 'AまたはBに入る2つの円全体'],
    ['set-e07', '\\overline{A}\\cap\\overline{B}'],
    ['set-e08', '\\overline{A}\\cap\\overline{B}'],
    ['set-e09', '入れ替わる'],
    ['set-e10', 'Ā={1,3,5,7,9,11}, B̄={1,2,4,5,7,8,10,11}'],
    ['set-e11', '1, 5, 7, 11'],
    ['set-e12', '1, 5, 7, 11'],
    ['set-e13', '一致する'],
    ['set-e14', '両方とも{1,2,3,4,5,7,8,9,10,11}'],
  ]
  for (const [itemId, answer] of answers) await answerItem(page, itemId, answer)
  await advanceMathStage(page)
}

test.beforeEach(async ({ page }) => {
  await clearState(page)
})


test('learning setup exposes math textbook mode with the same three curriculum topics', async ({ page }) => {
  await page.goto(appRoute('/learning/setup?subject=math-1a'))

  await expect(page.getByRole('button', { name: /数学/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('math-textbook-chapter-3')).toContainText('集合と命題')

  const setsTopic = page.getByTestId('math-textbook-topic-organize-sets')
  await expect(setsTopic).toContainText('集合を整理する')
  await expect(setsTopic).toContainText('集合の表し方 → 共通部分・和集合 → 部分集合 → 補集合 → 集合の条件')
  await expect(setsTopic).not.toContainText('準備中')
  await expect(setsTopic).toHaveAttribute('href', '#/learning/textbook/math-sets')

  await expect(page.getByTestId('math-textbook-topic-read-propositions')).toContainText('条件から命題を読む')
  await expect(page.getByTestId('math-textbook-topic-read-propositions')).toContainText('準備中')
  await expect(page.getByTestId('math-textbook-topic-prove-propositions')).toContainText('命題を証明する')
  await expect(page.getByTestId('math-textbook-topic-prove-propositions')).toContainText('準備中')
})

test('math textbook setup enters the set lesson and physics remains available from the same subject selector', async ({ page }) => {
  await page.goto(appRoute('/learning/setup?subject=math-1a'))

  await page.getByTestId('math-textbook-topic-organize-sets').click()
  await expect(page).toHaveURL(/\/learning\/textbook\/math-sets$/)
  await expect(page.getByRole('heading', { name: '集合', exact: true })).toBeVisible()

  await page.goto(appRoute('/learning/setup?subject=math-1a'))
  await page.getByRole('button', { name: '物理', exact: true }).click()
  await expect(page.getByTestId('textbook-part-list')).toBeVisible()
  await expect(page.getByTestId('textbook-part-1')).toContainText('様々な運動')
})


test('proposition-reading builds the proposition concept from the first textbook condition', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-reading'))

  await expect(page.getByRole('heading', { name: '条件から命題を読む', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '条件から真偽を判断する', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-a01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-a02')).toHaveCount(0)
  await expect(page.getByText(/文を命題という/)).toHaveCount(0)

  await answerItem(page, 'prop-a01', '満たす')

  await expect(page.getByText(/文を命題という/)).toBeVisible()
  await expect(page.getByText(/pならばqである/)).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-a02')).toBeVisible()
})

test('proposition-reading wrong answer stays unresolved and does not reveal the proposition concept', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-reading'))

  await chooseWrongOption(page, 'prop-a01', '満たす')

  await expect(page.getByTestId('resolved-prop-a01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-prop-a02')).toHaveCount(0)
  await expect(page.getByText(/文を命題という/)).toHaveCount(0)

  await page.getByTestId('textbook-item-prop-a01').click()
  const hint = page.getByTestId('textbook-hint-prop-a01')
  await expect(hint).toBeVisible()
  await expect(hint).not.toContainText('満たす')

  const lastWrong = page.locator('[data-testid^="textbook-choice-prop-a01-"][aria-invalid="true"]')
  await expect(lastWrong).toHaveCount(1)
  await expect(lastWrong).toContainText('満たさない場合がある')
})

test('proposition-reading follows the textbook order from truth to necessary/sufficient to negation', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-reading'))

  await expect(page.getByTestId('reading-role-example-marker-example-implication')).toBeVisible()

  const truthAnswers: Array<[string, string]> = [
    ['prop-a01', '満たす'],
    ['prop-a02', 'すべて入る'],
    ['prop-a03', '-1'],
    ['prop-a04', '偽'],
    ['prop-a05', '-3'],
    ['prop-a07', '直角二等辺三角形'],
  ]
  for (const [itemId, answer] of truthAnswers) await answerItem(page, itemId, answer)

  await expect(page.getByTestId('textbook-item-prop-a06')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-prop-a08')).toHaveCount(0)
  await expect(page.getByText(/この命題は偽である/)).toBeVisible()
  await expect(page.getByTestId('reading-role-check-marker-check-counterexample')).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^反例$/ })).toBeVisible()

  await expect(page.getByRole('heading', { name: '2つの条件の関係を見る', exact: true })).toBeVisible()
  await expect(page.getByTestId('reading-role-example-marker-example-necessary-sufficient')).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-b01')).toBeVisible()
  await expect(page.getByTestId('textbook-figure-equal-diagonals-quadrilateral')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-prop-c01')).toHaveCount(0)

  await answerItem(page, 'prop-b01', '等しい')
  await expect(page.getByTestId('textbook-figure-equal-diagonals-quadrilateral')).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-b02')).toBeVisible()

  const relationAnswers: Array<[string, string]> = [
    ['prop-b02', '限らない'],
    ['prop-b04', '必要条件'],
    ['prop-b05', 'どちらも真'],
  ]
  for (const [itemId, answer] of relationAnswers) await answerItem(page, itemId, answer)

  await expect(page.getByTestId('textbook-item-prop-b03')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-prop-b06')).toHaveCount(0)
  await expect(page.getByText(/必要十分条件であり、2つの条件は同値である/)).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^十分条件$/ })).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^必要条件$/ })).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^必要十分条件$/ })).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^同値$/ })).toBeVisible()

  await expect(page.getByRole('heading', { name: '成り立たない条件を考える', exact: true })).toBeVisible()
  await expect(page.getByTestId('reading-role-example-marker-example-negation')).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-c01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-c01')).toHaveAttribute(
    'aria-label',
    /成り立たない条件/,
  )
  await expect(page.getByTestId('textbook-item-prop-c01')).not.toHaveAttribute(
    'aria-label',
    /否定/,
  )

  const negationAnswers: Array<[string, string]> = [
    ['prop-c01', 'n\\ge2'],
    ['prop-c02', '2は合成数ではない'],
    ['prop-c03', 'a\\ge0\\text{ または }b\\le0'],
    ['prop-c04', '-1<x<3'],
  ]
  for (const [itemId, answer] of negationAnswers) await answerItem(page, itemId, answer)

  await expect(page.getByTestId('reading-role-summary-marker-summary-proposition-reading')).toBeVisible()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.getByTestId('textbook-next-unit')).toHaveAttribute(
    'href',
    /\/learning\/textbook\/math-quantifiers-all-exists$/,
  )
  await expect(page.locator('.katex-error')).toHaveCount(0)

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})

test('proposition-reading counterexample is decided before the counterexample concept is named', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-reading'))

  await answerItem(page, 'prop-a01', '満たす')
  await answerItem(page, 'prop-a02', 'すべて入る')

  await expect(page.locator('.reading-term').filter({ hasText: /^反例$/ })).toHaveCount(0)
  await answerItem(page, 'prop-a03', '-1')
  await expect(page.getByTestId('textbook-item-prop-a04')).toHaveAttribute(
    'aria-label',
    /pを満たすのにqを満たさない例/,
  )
  await expect(page.getByTestId('textbook-item-prop-a04')).not.toHaveAttribute(
    'aria-label',
    /反例/,
  )
  await page.getByTestId('textbook-item-prop-a04').click()
  await expect(page.getByTestId('inline-choice-panel-prop-a04')).toContainText('条件や理由のつながりをたどろう。')
  await expect(page.getByTestId('inline-choice-panel-prop-a04')).not.toContainText('変化の因果関係をたどろう。')
  await answerItem(page, 'prop-a04', '偽')
  const counterexampleTerm = page.locator('.reading-term').filter({ hasText: /^反例$/ }).first()
  await expect(counterexampleTerm).toBeVisible()
  const counterexampleWeight = await counterexampleTerm.evaluate((element) => Number.parseInt(getComputedStyle(element).fontWeight, 10))
  expect(counterexampleWeight).toBeGreaterThanOrEqual(700)
  await expect(page.getByTestId('textbook-figure-implication-counterexample')).toBeVisible()
})


test('quantifier review unit derives the negation of exists only after an existence witness', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-quantifiers-all-exists'))

  await expect(page.getByRole('heading', { name: '「すべて」と「ある」', exact: true })).toBeVisible()
  await expect(page.getByTestId('reading-role-example-marker-example-exists')).toBeVisible()
  await expect(page.getByTestId('textbook-item-quant-a01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-quant-a02')).toBeVisible()
  await expect(page.getByText(/「あるxに対してpである」の否定は/)).toHaveCount(0)

  await answerItem(page, 'quant-a02', 'a=2, b=3')
  const existsTerm = page.locator('.reading-term').filter({ hasText: /^ある$/ }).first()
  await expect(existsTerm).toBeVisible()
  const existsWeight = await existsTerm.evaluate((element) => Number.parseInt(getComputedStyle(element).fontWeight, 10))
  expect(existsWeight).toBeGreaterThanOrEqual(700)
  await expect(page.getByText(/「あるxに対してpである」の否定は/)).toHaveCount(0)

  await answerItem(page, 'quant-a03', 'すべての素数の組(a,b)に対してabは奇数である')
  await expect(page.getByText(/「あるxに対してpである」の否定は/)).toBeVisible()
})

test('quantifier review wrong answer stays unresolved and keeps the witness step locked', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-quantifiers-all-exists'))

  await chooseWrongOption(page, 'quant-a02', 'a=2, b=3')

  await expect(page.getByTestId('resolved-quant-a02')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-quant-a03')).toHaveCount(0)
  await expect(page.getByText(/「あるxに対してpである」の否定は/)).toHaveCount(0)

  await page.getByTestId('textbook-item-quant-a02').click()
  const hint = page.getByTestId('textbook-hint-quant-a02')
  await expect(hint).toBeVisible()
  await expect(hint).not.toContainText('a=2, b=3')

  const viewport = page.viewportSize()
  if (viewport && viewport.width <= 640) {
    const columns = await page.locator('.reading-choice-options').first().evaluate(
      (element) => window.getComputedStyle(element).gridTemplateColumns,
    )
    expect(columns.trim().split(/\\s+/)).toHaveLength(1)
  }
})

test('quantifier review unit derives the negation of all only after the source counterexample', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-quantifiers-all-exists'))

  await answerItem(page, 'quant-a02', 'a=2, b=3')
  await answerItem(page, 'quant-a03', 'すべての素数の組(a,b)に対してabは奇数である')
  await answerItem(page, 'quant-b01', '存在しない')
  await answerItem(page, 'quant-b02', 'すべての実数xに対して x²≠-1')

  await expect(page.getByTestId('reading-role-example-marker-example-all')).toBeVisible()
  await expect(page.getByText(/「すべてのxに対してpである」の否定は/)).toHaveCount(0)
  await answerItem(page, 'quant-c02', '2')
  await answerItem(page, 'quant-c03', 'ある素数は偶数である')
  await expect(page.getByText(/「すべてのxに対してpである」の否定は/)).toBeVisible()
})


test('quantifier review reaches all five source statements without layout regressions', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-quantifiers-all-exists'))

  const answers: Array<[string, string]> = [
    ['quant-a02', 'a=2, b=3'],
    ['quant-a03', 'すべての素数の組(a,b)に対してabは奇数である'],
    ['quant-b01', '存在しない'],
    ['quant-b02', 'すべての実数xに対して x²≠-1'],
    ['quant-c02', '2'],
    ['quant-c03', 'ある素数は偶数である'],
    ['quant-d01', 'どの2つの無理数を選んでも'],
    ['quant-d02', '4'],
    ['quant-d03', 'ある2つの無理数の積は有理数である'],
    ['quant-e01', '真'],
    ['quant-e02', '偽'],
  ]
  for (const [itemId, answer] of answers) await answerItem(page, itemId, answer)

  await expect(page.getByText(/元の命題とその否定は、真偽が反対になる/)).toBeVisible()
  await expect(page.getByTestId('reading-role-summary-marker-summary-quantifiers')).toBeVisible()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.locator('.katex-error')).toHaveCount(0)

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})

test('function-conditions review unit builds the function concept before substitution work', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-functions-conditions'))

  await expect(page.getByRole('heading', { name: '関数の条件を読む', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-item-func-a01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-func-a02')).toHaveCount(0)

  await answerItem(page, 'func-a01', 'ただ1つに決まる')

  await expect(page.getByText(/yはxの関数であるという/)).toBeVisible()
  await expect(page.getByTestId('textbook-item-func-a02')).toBeVisible()
  await expect(page.getByTestId('textbook-item-func-b01')).toHaveCount(0)
})

test('function review wrong answer stays unresolved and keeps the function concept locked', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-functions-conditions'))

  await chooseWrongOption(page, 'func-a01', 'ただ1つに決まる')

  await expect(page.getByTestId('resolved-func-a01')).toHaveCount(0)
  await expect(page.getByText(/yはxの関数であるという/)).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-func-a02')).toHaveCount(0)

  await page.getByTestId('textbook-item-func-a01').click()
  const hint = page.getByTestId('textbook-hint-func-a01')
  await expect(hint).toBeVisible()
  await expect(hint).not.toContainText('ただ1つに決まる')
})

test('function review remains readable through the rectangle domain/range conclusion', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-functions-conditions'))

  const answers: Array<[string, string]> = [
    ['func-a01', 'ただ1つに決まる'],
    ['func-a02', '-10'],
    ['func-a03', '2'],
    ['func-a04', 'a-1'],
    ['func-a05', '4a-10'],
    ['func-b01', '0'],
    ['func-b02', '3'],
    ['func-b03', 'a^2-2a'],
    ['func-c01', 'y=20-x'],
    ['func-c02', '0<x<20'],
    ['func-c03', '0<y<20'],
  ]
  for (const [itemId, answer] of answers) await answerItem(page, itemId, answer)

  await expect(page.getByTestId('textbook-figure-rectangle-perimeter-40')).toBeVisible()
  await expect(page.getByText(/定義域という/)).toBeVisible()
  await expect(page.getByText(/値域という/)).toBeVisible()
  const completePanel = page.getByTestId('textbook-unit-complete')
  await expect(completePanel).toBeVisible()
  await expect(completePanel).toContainText('この教材の内容を最後まで確認しました')
  await expect(completePanel).not.toContainText('集合の表し方')
  await expect(page.locator('.katex-error')).toHaveCount(0)

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})

test('proposition-proof review unit starts from changing the direction of a proposition', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-proof'))

  await expect(page.getByRole('heading', { name: '命題を証明する', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '命題の向きを変える', exact: true })).toBeVisible()
  await expect(page.getByTestId('reading-role-example-marker-example-transformations')).toBeVisible()
  await expect(page.getByTestId('textbook-item-proof-a01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-proof-a01')).toHaveAttribute(
    'aria-label',
    /前件と後件を入れ替えた命題/,
  )
  await expect(page.getByTestId('textbook-item-proof-a01')).not.toHaveAttribute(
    'aria-label',
    /逆/,
  )
  await expect(page.getByTestId('textbook-item-proof-a02')).toHaveCount(0)
  await expect(page.getByText(/ここまで作った3つの命題に名前をつける/)).toHaveCount(0)

  await answerItem(page, 'proof-a01', 'x=1\\Rightarrow x^2=x')
  await expect(page.getByTestId('textbook-item-proof-a02')).toBeVisible()
  await expect(page.getByText(/ここまで作った3つの命題に名前をつける/)).toHaveCount(0)

  await answerItem(page, 'proof-a02', 'x^2\\ne x\\Rightarrow x\\ne1')
  await answerItem(page, 'proof-a03', 'x\\ne1\\Rightarrow x^2\\ne x')
  await expect(page.getByText(/ここまで作った3つの命題に名前をつける/)).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^逆$/ })).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^裏$/ })).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^対偶$/ })).toBeVisible()
})


test('proof review wrong answer stays unresolved and keeps the reverse concept locked', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-proof'))

  await chooseWrongOption(page, 'proof-a01', 'x=1\\Rightarrow x^2=x')

  await expect(page.getByTestId('resolved-proof-a01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-proof-a02')).toHaveCount(0)
  await expect(page.getByText(/ここまで作った3つの命題に名前をつける/)).toHaveCount(0)

  await page.getByTestId('textbook-item-proof-a01').click()
  const hint = page.getByTestId('textbook-hint-proof-a01')
  await expect(hint).toBeVisible()
  await expect(hint).not.toContainText('x=1⇒x²=x')
})

test('proof review reaches contrapositive and contradiction conclusions without layout regressions', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-proof'))

  const answers: Array<[string, string]> = [
    ['proof-a01', 'x=1\\Rightarrow x^2=x'],
    ['proof-a02', 'x^2\\ne x\\Rightarrow x\\ne1'],
    ['proof-a03', 'x\\ne1\\Rightarrow x^2\\ne x'],
    ['proof-a04', '偽'],
    ['proof-a04r', '真'],
    ['proof-a04i', '真'],
    ['proof-a05', '偽'],
    ['proof-a06', '真'],
    ['proof-a07', 'n=6'],
    ['proof-a08', '真'],
    ['proof-b00', '対偶'],
    ['proof-b01', 'nが3の倍数でない ⇒ n²が3の倍数でない'],
    ['proof-b02', '1または2'],
    ['proof-b03', '3(3k^2+2k)+1'],
    ['proof-b04', '3の倍数にならない'],
    ['proof-b05', '真である'],
    ['proof-c00', 'x\\ne0'],
    ['proof-c01', '\\sqrt2=-\\frac{\\sqrt3y}{x}'],
    ['proof-c01b', '\\sqrt6=-\\frac{3y}{x}'],
    ['proof-c02', '有理数'],
    ['proof-c03', '矛盾する'],
    ['proof-c04', 'x=0'],
    ['proof-c05', 'y=0'],
  ]
  for (const [itemId, answer] of answers) await answerItem(page, itemId, answer)

  await expect(page.getByTestId('reading-role-proof-marker-proof-contrapositive')).toBeVisible()
  await expect(page.getByTestId('reading-role-proof-marker-proof-contradiction')).toBeVisible()
  const contradictionTerm = page.locator('.reading-term').filter({ hasText: /^背理法$/ }).first()
  await expect(contradictionTerm).toBeVisible()
  const contradictionWeight = await contradictionTerm.evaluate((element) => Number.parseInt(getComputedStyle(element).fontWeight, 10))
  expect(contradictionWeight).toBeGreaterThanOrEqual(700)
  await expect(page.getByTestId('reading-role-summary-marker-summary-proof')).toBeVisible()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.locator('.katex-error')).toHaveCount(0)

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})

test('all review math units enter without KaTeX errors or horizontal overflow', async ({ page }) => {
  const routes = [
    '/learning/textbook/math-propositions-reading',
    '/learning/textbook/math-quantifiers-all-exists',
    '/learning/textbook/math-functions-conditions',
    '/learning/textbook/math-propositions-proof',
  ]

  for (const route of routes) {
    await page.goto(appRoute(route))
    await expect(page.locator('.katex-error')).toHaveCount(0)

    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(viewport.scrollWidth, route).toBeLessThanOrEqual(viewport.clientWidth + 1)
  }
})

test('math textbook setup exposes only the published set topic and keeps later topics pending', async ({ page }) => {
  await page.goto(appRoute('/learning/setup?subject=math-1a'))

  const sets = page.getByTestId('math-textbook-topic-organize-sets')
  await expect(sets).toHaveAttribute('href', /math-sets/)

  for (const topicId of ['read-propositions', 'prove-propositions']) {
    const topic = page.getByTestId(`math-textbook-topic-${topicId}`)
    await expect(topic).toHaveAttribute('aria-disabled', 'true')
    await expect(topic).toContainText('準備中')
    await expect(topic).not.toHaveAttribute('href', /.+/)
  }
})

test('math set lesson boots directly on the shared textbook reader', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message))

  await page.goto(appRoute('/learning/textbook/math-sets'))

  await expect(page.getByText('TEXTBOOK / MATH I+A / CHAPTER 3')).toBeVisible()
  await expect(page.getByRole('heading', { name: '集合', exact: true })).toBeVisible()
  await expect(page.getByTestId('app-back-button')).toHaveAttribute('href', '#/learning/setup?subject=math-1a')
  await expect(page.getByRole('heading', { name: '第1部　集合を表す', exact: true })).toBeVisible()
  await expect(page.getByTestId('reading-role-example-marker-example-divisors')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a02')).toHaveCount(0)
  await expect(page.getByText('TEXTBOOK / PHYSICS')).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('wrong answer stays unresolved, shows a staged hint, and does not unlock concept prose', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))

  await chooseWrongOption(page, 'set-a01', '1, 2, 3, 4, 6, 8, 12, 24')

  await expect(page.getByTestId('resolved-set-a01')).toHaveCount(0)
  await expect(page.locator('.reading-term').filter({ hasText: /^集合$/ })).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-set-a02')).toHaveCount(0)

  await page.getByTestId('textbook-item-set-a01').click()
  const hint = page.getByTestId('textbook-hint-set-a01')
  await expect(hint).toBeVisible()
  await expect(hint).toContainText('24を割り切れる正の整数')
  await expect(hint).not.toContainText('1, 2, 3, 4, 6, 8, 12, 24')
})

test('correct answer fills the sentence and unlocks the next learning step', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))

  await page.getByTestId('textbook-item-set-a01').click()
  const panel = page.getByTestId('inline-choice-panel-set-a01')
  await panel.getByRole('button', { name: '1, 2, 3, 4, 6, 8, 12, 24', exact: true }).click()

  await expect(page.getByTestId('resolved-set-a01')).toContainText('1, 2, 3, 4, 6, 8, 12, 24')
  const setTerm = page.locator('.reading-term').filter({ hasText: /^集合$/ }).first()
  await expect(setTerm).toBeVisible()
  const termWeight = await setTerm.evaluate((element) => Number.parseInt(getComputedStyle(element).fontWeight, 10))
  expect(termWeight).toBeGreaterThanOrEqual(700)
  await expect(page.getByTestId('textbook-item-set-a02')).toHaveCount(0)
  await expect(page.getByTestId('math-textbook-next-stage')).toBeVisible()
  await advanceMathStage(page)
  await expect(page.getByTestId('textbook-item-set-a02')).toBeVisible()
  await expect(page.getByTestId('math-textbook-history-toggle')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByTestId('math-textbook-stage-gather')).toHaveCount(0)
  await expect(setTerm).toHaveCount(0)
  await page.getByTestId('math-textbook-history-toggle').click()
  await expect(page.getByTestId('math-textbook-stage-gather')).toBeVisible()
  await page.getByTestId('math-textbook-toggle-gather').click()
  await expect(setTerm).toBeVisible()
})

test('set notation renders without KaTeX errors or horizontal overflow', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))

  const itemIds = ['set-a01', 'set-a02', 'set-a03', 'set-a04', 'set-a05']
  const answers = [
    '1, 2, 3, 4, 6, 8, 12, 24',
    '入っている',
    '入っていない',
    '\\in',
    '\\notin',
  ]

  for (let index = 0; index < itemIds.length; index += 1) {
    await answerItem(page, itemIds[index], answers[index])
  }

  await expect(page.locator('.katex-error')).toHaveCount(0)
  const tex = (await page.locator('annotation[encoding="application/x-tex"]').allTextContents()).join('\n')
  expect(tex).toContain('\\in')
  expect(tex).toContain('\\notin')

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})


test('the second learning group follows the golden intersection-and-union-first order', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))

  await expect(page.getByRole('heading', { name: '第2部　集合どうしの関係を見る', exact: true })).toHaveCount(0)
  await completeFirstSetsSlice(page)
  await expect(page.getByRole('heading', { name: '第2部　集合どうしの関係を見る', exact: true })).toBeVisible()
  await expect(page.getByTestId('reading-role-example-marker-example-intersection-union')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-b01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-c01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-figure-venn-two-blank')).toBeVisible()
})

test('the completed intersection figure is revealed only after the intersection decision', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)

  await expect(page.getByTestId('textbook-figure-venn-two-blank')).toBeVisible()
  await expect(page.getByTestId('textbook-figure-venn-intersection')).toHaveCount(0)

  await answerItem(page, 'set-b01', '3, 5, 7')

  await expect(page.locator('.reading-term').filter({ hasText: /^共通部分$/ })).toBeVisible()
  await expect(page.getByTestId('textbook-figure-venn-intersection')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-b02')).toBeVisible()
})

test('intersection and union lead into subset with the golden meaning-first progression', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)

  await expect(page.getByTestId('textbook-item-set-b01')).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^共通部分$/ })).toHaveCount(0)
  await answerItem(page, 'set-b01', '3, 5, 7')
  await expect(page.locator('.reading-term').filter({ hasText: /^共通部分$/ })).toBeVisible()

  const restOfRelations: Array<[string, string]> = [
    ['set-b02', 'AとBの両方に属する要素'],
    ['set-b03', '1, 2, 3, 5, 7, 9'],
    ['set-b04', 'ない'],
    ['set-b05', 'AかBの少なくとも一方に属する要素'],
    ['set-b06', '2つの円の重なりだけ'],
    ['set-b07', 'AとBの2つの円全体'],
    ['set-b08', '3つすべてに属する要素'],
    ['set-b09', '3つのうち少なくとも1つに属する要素'],
  ]
  for (const [itemId, answer] of restOfRelations) await answerItem(page, itemId, answer)

  await advanceMathStage(page)
  await expect(page.getByTestId('reading-role-example-marker-example-subset')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-c01')).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^部分集合$/ })).toHaveCount(0)
  await answerItem(page, 'set-c01', 'すべて入っている')
  await answerItem(page, 'set-c02', '4がAにないので、全部は入っていない')
  await expect(page.locator('.reading-term').filter({ hasText: /^部分集合$/ })).toBeVisible()
})


test('complement terminology appears only after the whole-set scope and outside elements are decided', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)

  await expect(page.getByRole('heading', { name: '第3部　集合の外側まで考える', exact: true })).toBeVisible()
  await expect(page.getByTestId('reading-role-example-marker-example-complement')).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^全体集合$/ })).toHaveCount(0)

  await answerItem(page, 'set-d01', '入れない')
  await expect(page.locator('.reading-term').filter({ hasText: /^全体集合$/ })).toBeVisible()
  await expect(page.locator('.reading-term').filter({ hasText: /^補集合$/ })).toHaveCount(0)

  await answerItem(page, 'set-d02', '1, 3, 5, 7, 9, 11')
  await expect(page.locator('.reading-term').filter({ hasText: /^補集合$/ })).toBeVisible()
  await expect(page.getByTestId('textbook-figure-complement-after')).toBeVisible()
})

test('De Morgan law is revealed only after the two regions are compared', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)
  await completeComplements(page)

  await expect(page.locator('.reading-term').filter({ hasText: /^ド・モルガンの法則$/ })).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-set-e01')).toBeVisible()

  await answerItem(page, 'set-e01', '2つの円の重なり')
  await answerItem(page, 'set-e02', '重なり以外のU全体')
  await expect(page.getByTestId('textbook-figure-demorgan-intersection-complement')).toBeVisible()
  await answerItem(page, 'set-e03', '\\overline{A}\\cup\\overline{B}')
  await answerItem(page, 'set-e04', '同じ')
  await answerItem(page, 'set-e05', '\\overline{A}\\cup\\overline{B}')

  await expect(page.locator('.reading-term').filter({ hasText: /^ド・モルガンの法則$/ })).toHaveCount(0)

  await answerItem(page, 'set-e06', 'AまたはBに入る2つの円全体')
  await answerItem(page, 'set-e07', '\\overline{A}\\cap\\overline{B}')
  await answerItem(page, 'set-e08', '\\overline{A}\\cap\\overline{B}')

  await expect(page.locator('.reading-term').filter({ hasText: /^ド・モルガンの法則$/ })).toBeVisible()
})

test('real-line endpoint judgments precede complement formulas and the unit can reach completion', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)
  await completeComplements(page)
  await completeDeMorgan(page)

  await expect(page.getByTestId('textbook-item-set-f01')).toBeVisible()
  await expect(page.getByTestId('textbook-figure-number-line-a')).toHaveCount(0)

  await answerItem(page, 'set-f01', '両方入る')
  await answerItem(page, 'set-f02', '両方入らない')
  await expect(page.getByTestId('textbook-figure-number-line-a')).toHaveCount(0)

  await answerItem(page, 'set-f03', '数直線')
  await expect(page.getByTestId('textbook-figure-number-line-a')).toBeVisible()

  const remaining: Array<[string, string]> = [
    ['set-f04', '−2と2の間で、両端を含まない'],
    ['set-f05', '含めない'],
    ['set-f06', '\\{x\\mid x<-1,\\ 5<x\\}'],
    ['set-f07', '含める'],
    ['set-f08', '\\{x\\mid x\\le -2,\\ 2\\le x\\}'],
    ['set-f09', '\\{x\\mid x\\le -2,\\ 5<x\\}'],
    ['set-f10', '\\{x\\mid -2<x\\le 5\\}'],
    ['set-f11', 'A\\cap B=\\{x\\mid -1\\le x<2\\},\\quad \\overline{A\\cap B}=\\{x\\mid x<-1,\\ 2\\le x\\}'],
    ['set-f12', '\\overline{A}\\cup\\overline{B}'],
    ['set-f13', '一致する'],
  ]
  for (const [itemId, answer] of remaining) await answerItem(page, itemId, answer)
  await advanceMathStage(page)

  await expect(page.getByTestId('reading-role-summary-marker-summary-sets')).toBeVisible()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.getByTestId('textbook-return-to-setup')).toHaveAttribute('href', '#/learning/setup?subject=math-1a')
  await expect(page.locator('.katex-error')).toHaveCount(0)

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})


test('math-set keeps one closed history row and shows exactly the prerequisite for the active hole', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await answerItem(page, 'set-a01', '1, 2, 3, 4, 6, 8, 12, 24')
  await expect(page.locator('.reading-term').filter({ hasText: /^集合$/ })).toBeVisible()
  await advanceMathStage(page)

  const history = page.getByTestId('math-textbook-history-toggle')
  await expect(history).toBeVisible()
  await expect(history).toHaveAttribute('aria-expanded', 'false')
  await expect(history).toContainText('1段階')
  await expect(page.getByTestId('math-textbook-stage-gather')).toHaveCount(0)
  await expect(page.getByTestId('math-textbook-stage-references')).toHaveAttribute('data-for-item', 'set-a02')
  await expect(page.getByTestId('math-textbook-context-formula-set-a')).toBeVisible()
  await expect(page.getByTestId('math-textbook-stage-references').locator('annotation[encoding="application/x-tex"]').first()).toContainText('A=')

  await history.click()
  const prior = page.getByTestId('math-textbook-stage-gather')
  await expect(prior).toBeVisible()
  await expect(prior.getByTestId('resolved-set-a01')).toHaveCount(0)
  await prior.getByTestId('math-textbook-toggle-gather').click()
  await expect(prior.getByTestId('resolved-set-a01')).toContainText('1, 2, 3, 4, 6, 8, 12, 24')
  await expect(prior.locator('.reading-term').filter({ hasText: /^集合$/ })).toBeVisible()
  await expect(prior.locator('annotation[encoding="application/x-tex"]').first()).toContainText('A=')
  await history.click()
  await expect(prior).toHaveCount(0)
  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('math-set cursor resumes at the current short stage and reset does not skip new reading', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await answerItem(page, 'set-a01', '1, 2, 3, 4, 6, 8, 12, 24')
  await advanceMathStage(page)
  await expect(page.getByTestId('textbook-item-set-a02')).toBeVisible()
  await page.reload()
  await expect(page.getByTestId('math-textbook-history-toggle')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByTestId('textbook-item-set-a02')).toBeVisible()
  await expect(page.getByTestId('math-textbook-stage-gather')).toHaveCount(0)
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'この単元を最初から' }).click()
  await expect(page.getByTestId('textbook-item-set-a01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a02')).toHaveCount(0)
})

test('math-set Chinese labels and a 320px screen retain the same compact readable flow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await page.getByTestId('language-switcher').getByRole('button', { name: '中文' }).click()
  await answerItem(page, 'set-a01', '1, 2, 3, 4, 6, 8, 12, 24')
  await advanceMathStage(page)
  await expect(page.getByTestId('math-textbook-history-toggle')).toContainText('之前的学习')
  await expect(page.getByTestId('math-textbook-history-toggle')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByTestId('math-textbook-stage-references')).toContainText('本题需要的条件')
  await expect(page.getByTestId('math-textbook-context-formula-set-a')).toBeVisible()
  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})

test('math-set old saved stage index resumes without automatically exposing history', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await answerItem(page, 'set-a01', '1, 2, 3, 4, 6, 8, 12, 24')
  await page.evaluate(() => window.localStorage.setItem('math-textbook-compact-v1:math-sets:r2', '1'))
  await page.reload()
  await expect(page.getByTestId('textbook-item-set-a02')).toBeVisible()
  await expect(page.getByTestId('math-textbook-history-toggle')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByTestId('math-textbook-stage-gather')).toHaveCount(0)
})

test('math-set union has earlier A and B available even after intersection closes', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await answerItem(page, 'set-b01', '3, 5, 7')
  await answerItem(page, 'set-b02', 'AとBの両方に属する要素')
  await advanceMathStage(page)
  await expect(page.getByTestId('math-textbook-stage-references')).toHaveAttribute('data-for-item', 'set-b03')
  await expect(page.getByTestId('math-textbook-context-formula-b-sets')).toBeVisible()
  await expect(page.getByTestId('math-textbook-stage-intersection')).toHaveCount(0)
})

test('math-set empty-set exercise retains its earlier source A without opening the full history', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  const prior: Array<[string, string]> = [
    ['set-b01', '3, 5, 7'], ['set-b02', 'AとBの両方に属する要素'],
    ['set-b03', '1, 2, 3, 5, 7, 9'], ['set-b04', 'ない'],
    ['set-b05', 'AかBの少なくとも一方に属する要素'],
    ['set-b06', '2つの円の重なりだけ'], ['set-b07', 'AとBの2つの円全体'],
    ['set-b08', '3つすべてに属する要素'], ['set-b09', '3つのうち少なくとも1つに属する要素'],
    ['set-c01', 'すべて入っている'], ['set-c02', '4がAにないので、全部は入っていない'],
    ['set-c03', '0個'],
  ]
  for (const [id, answer] of prior) await answerItem(page, id, answer)
  await advanceMathStage(page)
  await expect(page.getByTestId('math-textbook-stage-references')).toHaveAttribute('data-for-item', 'set-c04')
  await expect(page.getByTestId('math-textbook-context-formula-c-sets')).toBeVisible()
  await expect(page.getByTestId('math-textbook-history-toggle')).toHaveAttribute('aria-expanded', 'false')
})

test('math-set B-complement starts with U and B, not an unrelated A-complement', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)
  await answerItem(page, 'set-d01', '入れない')
  await answerItem(page, 'set-d02', '1, 3, 5, 7, 9, 11')
  await advanceMathStage(page)
  const references = page.getByTestId('math-textbook-stage-references')
  await expect(references).toHaveAttribute('data-for-item', 'set-d03')
  await expect(page.getByTestId('math-textbook-context-paragraph-universal-concept')).toBeVisible()
  await expect(page.getByTestId('math-textbook-context-formula-d-b')).toBeVisible()
  await expect(page.getByTestId('math-textbook-context-formula-d-abar')).toHaveCount(0)
  await expect(references.locator('annotation[encoding="application/x-tex"]')).toContainText(['U=\\{1,2,3,\\ldots,12\\}', 'B=\\{3,6,9,12\\}'])
  await expect(page.getByTestId('math-textbook-history-toggle')).toContainText('9段階')
  await expect(page.locator('.math-textbook-stage--past')).toHaveCount(0)
})

test('math-set real-line continuation retains source intervals and only offers already-seen diagram', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)
  await completeComplements(page)
  await completeDeMorgan(page)
  const earlier: Array<[string, string]> = [
    ['set-f01', '両方入る'], ['set-f02', '両方入らない'], ['set-f03', '数直線'],
    ['set-f04', '−2と2の間で、両端を含まない'], ['set-f05', '含めない'],
    ['set-f06', '\\{x\\mid x<-1,\\ 5<x\\}'],
  ]
  for (const [id, answer] of earlier) await answerItem(page, id, answer)
  await advanceMathStage(page)
  await expect(page.getByTestId('math-textbook-stage-references')).toHaveAttribute('data-for-item', 'set-f07')
  await expect(page.getByTestId('math-textbook-context-formula-f-sets')).toBeVisible()
  const diagram = page.getByTestId('math-textbook-reference-figure-f-b')
  await expect(diagram).toHaveAttribute('aria-expanded', 'false')
  await diagram.click()
  await expect(diagram).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByTestId('math-textbook-history-toggle')).toHaveAttribute('aria-expanded', 'false')
})

test('math-set completed history can all expand without changing any answers, and is keyboard accessible', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await answerItem(page, 'set-a01', '1, 2, 3, 4, 6, 8, 12, 24')
  await advanceMathStage(page)
  const history = page.getByTestId('math-textbook-history-toggle')
  await history.focus()
  await page.keyboard.press('Enter')
  await expect(history).toHaveAttribute('aria-expanded', 'true')
  const toggle = page.getByTestId('math-textbook-toggle-gather')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.getByTestId('math-textbook-expand-all').click()
  await expect(page.getByTestId('resolved-set-a01')).toBeVisible()
  await page.getByTestId('math-textbook-expand-all').click()
  await expect(page.getByTestId('resolved-set-a01')).toBeVisible()
  await toggle.click()
  await expect(page.getByTestId('resolved-set-a01')).toHaveCount(0)
  await history.click()
  await expect(page.getByTestId('math-textbook-stage-gather')).toHaveCount(0)
})


test('P-003 reuses the original complement figure and displays U, A, A-bar in one math style at d08', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)
  const before: Array<[string, string]> = [
    ['set-d01', '入れない'],
    ['set-d02', '1, 3, 5, 7, 9, 11'],
    ['set-d03', '1, 2, 4, 5, 7, 8, 10, 11'],
    ['set-d04', '両方'], ['set-d05', '2, 4, 8, 10'],
    ['set-d06', '少なくとも一方'], ['set-d07', '1, 3, 5, 6, 7, 9, 11, 12'],
  ]
  for (const [itemId, answer] of before) await answerItem(page, itemId, answer)
  const reference = page.getByTestId('math-textbook-stage-references')
  await expect(reference).toHaveAttribute('data-for-item', 'set-d08')
  await expect(page.getByTestId('math-textbook-context-figure-d-complement')).toBeVisible()
  await expect(page.getByTestId('textbook-figure-complement-after')).toBeVisible()
  await expect(page.getByTestId('textbook-figure-complement-after').locator('img')).toHaveAttribute('src', /complement-after\.svg$/)
  const formulae = reference.locator('annotation[encoding="application/x-tex"]')
  await expect(formulae).toContainText([
    'U=\\{1,2,3,\\ldots,12\\}',
    'A=\\{2,4,6,8,10,12\\}',
    '\\overline{A}=\\{1,3,5,7,9,11\\}',
  ])
  await expect(page.getByTestId('math-textbook-history-toggle')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('P-003 complements are TeX operators, not singleton sets, in De Morgan choices', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)
  await completeComplements(page)
  await answerItem(page, 'set-e01', '2つの円の重なり')
  await answerItem(page, 'set-e02', '重なり以外のU全体')
  await page.getByTestId('textbook-item-set-e03').click()
  const panel = page.getByTestId('inline-choice-panel-set-e03')
  // Option order is intentionally randomized; inspect both math sources by value.
  const formulae = await panel.locator('.reading-choice-option annotation[encoding="application/x-tex"]').allTextContents()
  expect(formulae).toHaveLength(2)
  expect(formulae).toContain('\\overline{A}\\cup\\overline{B}')
  expect(formulae).toContain('\\overline{A}\\cap\\overline{B}')
  expect(formulae.every(latex => !latex.includes('\\{A\\}') && !latex.includes('\\{B\\}'))).toBe(true)
  await expect(panel.locator('.katex-error')).toHaveCount(0)
})

test('P-003 long real-line choices use one card per option and two meaningful math lines on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)
  await completeComplements(page)
  await completeDeMorgan(page)
  const earlier: Array<[string, string]> = [
    ['set-f01', '両方入る'], ['set-f02', '両方入らない'], ['set-f03', '数直線'],
    ['set-f04', '−2と2の間で、両端を含まない'], ['set-f05', '含めない'],
    ['set-f06', '\\{x\\mid x<-1,\\ 5<x\\}'],
    ['set-f07', '含める'], ['set-f08', '\\{x\\mid x\\le -2,\\ 2\\le x\\}'],
    ['set-f09', '\\{x\\mid x\\le -2,\\ 5<x\\}'],
    ['set-f10', '\\{x\\mid -2<x\\le 5\\}'],
  ]
  for (const [itemId, answer] of earlier) await answerItem(page, itemId, answer)
  await page.getByTestId('textbook-item-set-f11').click()
  const panel = page.getByTestId('inline-choice-panel-set-f11')
  await expect(panel.locator('.reading-choice-options--math-wide')).toBeVisible()
  await expect(panel.locator('.reading-choice-option')).toHaveCount(3)
  for (let i = 0; i < 3; i += 1) {
    const option = panel.getByTestId('textbook-choice-set-f11-' + i)
    await expect(option.locator('.reading-choice-formula-line')).toHaveCount(2)
  }
  await expect(panel.locator('.katex-error')).toHaveCount(0)
  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})

test('P-004 production figure elements load and decode actual SVG pixels in the app', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)

  const blank = page.getByTestId('textbook-figure-venn-two-blank').locator('img')
  await expect(blank).toBeVisible()
  await expect.poll(async () => blank.evaluate((img: HTMLImageElement) => ({
    complete: img.complete,
    hasWidth: img.naturalWidth > 0,
    hasHeight: img.naturalHeight > 0,
    path: new URL(img.currentSrc).pathname,
  }))).toEqual({
    complete: true,
    hasWidth: true,
    hasHeight: true,
    path: '/kyotsu-step-web/assets/math/textbook/sets/venn-two-blank.svg',
  })

  await answerItem(page, 'set-b01', '3, 5, 7')
  const intersection = page.getByTestId('textbook-figure-venn-intersection').locator('img')
  await expect(intersection).toBeVisible()
  await expect.poll(async () => intersection.evaluate((img: HTMLImageElement) => ({
    complete: img.complete,
    hasWidth: img.naturalWidth > 0,
    hasHeight: img.naturalHeight > 0,
    path: new URL(img.currentSrc).pathname,
  }))).toEqual({
    complete: true,
    hasWidth: true,
    hasHeight: true,
    path: '/kyotsu-step-web/assets/math/textbook/sets/venn-intersection.svg',
  })
})

test('P-004 all eleven existing math-set SVG assets load and decode under production base', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  const names = [
    'venn-two-blank.svg', 'venn-intersection.svg', 'venn-union.svg',
    'subset-after.svg', 'complement-after.svg',
    'demorgan-intersection-complement.svg', 'demorgan-union-complement.svg',
    'number-line-a.svg', 'number-line-b.svg', 'number-line-abar.svg', 'number-line-bbar.svg',
  ]
  const results = await page.evaluate(async (files: string[]) => {
    return await Promise.all(files.map(async name => {
      const src = '/kyotsu-step-web/assets/math/textbook/sets/' + name
      return await new Promise<{ name: string, loaded: boolean, width: number, height: number, path: string }>((resolve) => {
        const img = new Image()
        img.onload = () => resolve({ name, loaded: true, width: img.naturalWidth, height: img.naturalHeight, path: new URL(img.src).pathname })
        img.onerror = () => resolve({ name, loaded: false, width: 0, height: 0, path: new URL(img.src).pathname })
        img.src = src
      })
    }))
  }, names)
  expect(results).toHaveLength(11)
  for (const item of results) {
    expect(item.path, item.name).toBe('/kyotsu-step-web/assets/math/textbook/sets/' + item.name)
    expect(item.loaded, item.name).toBe(true)
    expect(item.width, item.name).toBeGreaterThan(0)
    expect(item.height, item.name).toBeGreaterThan(0)
  }
})

test('P-004 P-005 subset figure uses approved PNG inside real app in compiled preview', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  const beforeSubset: Array<[string, string]> = [
    ['set-b01','3, 5, 7'],
    ['set-b02','AとBの両方に属する要素'],
    ['set-b03','1, 2, 3, 5, 7, 9'],
    ['set-b04','ない'],
    ['set-b05','AかBの少なくとも一方に属する要素'],
    ['set-b06','2つの円の重なりだけ'],
    ['set-b07','AとBの2つの円全体'],
    ['set-b08','3つすべてに属する要素'],
    ['set-b09','3つのうち少なくとも1つに属する要素'],
    ['set-c01','すべて入っている'],
    ['set-c02','4がAにないので、全部は入っていない'],
  ]
  for (const [id, answer] of beforeSubset) await answerItem(page, id, answer)
  const figure = page.getByTestId('textbook-figure-subset-after')
  await expect(figure).toBeVisible()
  const png = figure.locator('img')
  await expect(png).toBeVisible()
  await expect.poll(() => png.evaluate((img: HTMLImageElement) => ({
    complete: img.complete,
    width: img.naturalWidth,
    height: img.naturalHeight,
    path: new URL(img.currentSrc).pathname,
    displayedWidth: img.getBoundingClientRect().width > 0,
    displayedHeight: img.getBoundingClientRect().height > 0,
  }))).toEqual({
    complete: true, width: 720, height: 300,
    path: '/kyotsu-step-web/assets/math/textbook/sets/subset-after.png',
    displayedWidth: true, displayedHeight: true,
  })
  await expect(figure).toContainText('「要素が全部入っているか」が部分集合を判断する基準になる。')
})


test('N01 review-only pilot: original 10 source tasks plus three local coefficient holes become 18 gated steps without revealing later answers', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-numbers-expressions-n01'))
  await expect(page.getByRole('heading', { level: 1, name: '式を整える' })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('式の見方')
  await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n01-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n01-09a')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n01-10a')).toHaveCount(0)

  // Wrong options must not unlock the following items or reveal the internal answer key.
  await chooseWrongOption(page, 'n01-01', '-1')
  await expect(page.getByTestId('textbook-item-n01-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n01-02a')).toHaveCount(0)

  const answers: Array<[string, string]> = [
    ['n01-01', '-1'],
    ['n01-02a', '(-2,1)'],
    ['n01-02b', '(1,2)'],
    ['n01-02c', '(-1,4)'],
    ['n01-03', '5y'],
    ['n01-04', '(5x^3,1)'],
    ['n01-05', '(ay,ax)'],
    ['n01-06a', '3x^2-5x^2'],
    ['n01-06b', '(-5x+2x)\\quad (6-3)'],
    ['n01-r3-q07-x2coef', '-2'], ['n01-r3-q07-xcoef', '-3'], ['n01-r3-q07-const', '3'],
    ['n01-07', '-2x^2-3x+3'],
    ['n01-08', '(2,3)'],
    ['n01-09a', '(1-1)x^3-2x^2+(1+3)x-1'],
    ['n01-09b', '-2x^2+4x-1'],
    ['n01-10a', '2次式'],
    ['n01-10b', '3次の項が整理によって消えるから'],
  ]
  for (const [id, answer] of answers) {
    await answerItem(page, id, answer)
    await expect(page.getByTestId('resolved-' + id)).toBeVisible()
  }
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await page.reload()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  // Review previews appear through the approved chapter-1 learner catalog.
  await page.goto(appRoute('/learning/setup?subject=math-1a'))
  await expect(page.getByTestId('math-textbook-topic-numbers-polynomials')).toContainText('式を整える')
})


test('W-MATH-003 N01 review-only pilot completes all 18 inline decisions in actual compiled app', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-numbers-expressions-n01'))
  await expect(page.getByRole('heading', { name: '式を整える' })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('式の見方')
  await expect(page.getByTestId('textbook-reading-flow')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n01-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n01-03')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n01-10a')).toHaveCount(0)
  await expect(page.getByTestId('math-textbook-compact-flow')).toHaveCount(0)
  await expect(page.getByTestId('inline-choice-panel-n01-01')).toHaveCount(0)
  await chooseWrongOption(page, 'n01-01', '-1')
  await expect(page.getByTestId('textbook-item-n01-01')).toBeVisible()
  await page.getByTestId('textbook-item-n01-01').click()
  await expect(page.getByTestId('textbook-hint-n01-01')).toBeVisible()
  await page.getByTestId('inline-choice-panel-n01-01').getByRole('button', { name: '-1', exact: true }).click()
  await expect(page.getByTestId('resolved-n01-01')).toBeVisible()

  const remaining: Array<[string, string]> = [
    ['n01-02a', '(-2,1)'], ['n01-02b', '(1,2)'], ['n01-02c', '(-1,4)'],
    ['n01-03', '5y'], ['n01-04', '(5x^3,1)'], ['n01-05', '(ay,ax)'],
    ['n01-06a', '3x^2-5x^2'], ['n01-06b', '(-5x+2x)\\quad (6-3)'],
    ['n01-r3-q07-x2coef', '-2'], ['n01-r3-q07-xcoef', '-3'], ['n01-r3-q07-const', '3'],
    ['n01-07', '-2x^2-3x+3'], ['n01-08', '(2,3)'],
    ['n01-09a', '(1-1)x^3-2x^2+(1+3)x-1'], ['n01-09b', '-2x^2+4x-1'],
    ['n01-10a', '2次式'], ['n01-10b', '3次の項が整理によって消えるから'],
  ]
  for (const [id, answer] of remaining) {
    if (id === 'n01-09a') await expect(page.getByTestId('textbook-item-n01-10a')).toHaveCount(0)
    await answerItem(page, id, answer)
    await expect(page.getByTestId('resolved-' + id)).toBeVisible()
  }
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.getByTestId('textbook-reading-flow')).toContainText('残った項の次数を判断する')
  await page.reload()
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
})


test('W-MATH-003 N03 review: 13 source decisions plus four product holes, original four-cell figure, mobile KaTeX', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto(appRoute('/learning/textbook/math-numbers-expressions-n03'))
  await expect(page.getByRole('heading', { name: '式を整える', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('指数法則と展開')
  await expect(page.getByTestId('textbook-item-n03-01')).toBeVisible()
  await expect(page.getByTestId('textbook-figure-n03-f01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-n03-13')).toHaveCount(0)
  const answers: Array<[string, string]> = [
    ['n03-01', '4a^8'],
    ['n03-02', 'a^{m+n}'],
    ['n03-03', 'a^{mn}'],
    ['n03-04', 'a^nb^n'],
    ['n03-05', '(-2)^3(x^3)^3(y^2)^3'],
    ['n03-06', '-8x^9y^6'],
    ['n03-07', 'x^2x^2+x^2(-3x)+x^2\\cdot4'],
    ['n03-08', 'x^4-3x^3+4x^2'],
    ['n03-09', '2x(3x+4)+1(3x+4)'],
    ['n03-r3-q10-p1', '6x^2'], ['n03-r3-q10-p2', '8x'],
    ['n03-r3-q10-p3', '3x'], ['n03-r3-q10-p4', '4'],
    ['n03-10', '6x^2+8x+3x+4'],
    ['n03-11', '6x^2+11x+4'],
    ['n03-12', '3x(2x^2-x+5)-(2x^2-x+5)'],
    ['n03-13', '6x^3-5x^2+16x-5'],
  ]
  for (const [id, answer] of answers) {
    if (id === 'n03-09') {
      const figure = page.getByTestId('textbook-figure-n03-f01')
      await expect(figure).toBeVisible()
      await expect.poll(() => figure.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
      await expect(figure.locator('img')).toHaveAttribute('src', /n03-f01\.png$/)
    }
    await answerItem(page, id, answer)
    await expect(page.getByTestId('resolved-' + id)).toBeVisible()
  }
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.locator('.katex-error')).toHaveCount(0)
  const viewport = await page.evaluate(() => ({
    width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth,
  }))
  expect(viewport.scroll).toBeLessThanOrEqual(viewport.width + 1)
})

test('W-MATH-003 N10 review: proof prerequisites and all 21 roots/rationalization choices', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-numbers-expressions-n10'))
  await expect(page.getByRole('heading', { name: '実数を扱う', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('平方根の証明と有理化')
  await expect(page.getByTestId('textbook-item-n10-01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n10-21')).toHaveCount(0)
  const answers: Array<[string, string]> = [
    ['n10-01', 't^2=25'],
    ['n10-02', '5\\sqrt5'],
    ['n10-03', 'ab'],
    ['n10-04', '\\sqrt{ab}'],
    ['n10-05', '\\frac ab'],
    ['n10-06', '\\sqrt{\\frac ab}'],
    ['n10-07', '\\sqrt{48}=\\sqrt{16\\cdot3}'],
    ['n10-08', '4\\sqrt3'],
    ['n10-09', '2\\sqrt2+5\\sqrt2'],
    ['n10-10', '7\\sqrt2'],
    ['n10-11', '2-2\\sqrt2\\sqrt3+3'],
    ['n10-12', '5-2\\sqrt6'],
    ['n10-13', '7-2=5'],
    ['n10-14', '0でない同じ数を分子・分母の両方に掛ける'],
    ['n10-15', '\\frac1{2\\sqrt3}\\cdot\\frac{\\sqrt3}{\\sqrt3}=\\frac{\\sqrt3}{2(\\sqrt3)^2}'],
    ['n10-16', '\\frac{\\sqrt3}{6}'],
    ['n10-17', '\\frac{\\sqrt3}{\\sqrt3+\\sqrt2}\\cdot\\frac{\\sqrt3-\\sqrt2}{\\sqrt3-\\sqrt2}'],
    ['n10-18', '3-2=1'],
    ['n10-19', '3-\\sqrt6'],
    ['n10-20', '\\frac{(2-\\sqrt3)^2}{(2+\\sqrt3)(2-\\sqrt3)}=\\frac{(2-\\sqrt3)^2}{4-3}'],
    ['n10-21', '7-4\\sqrt3'],
  ]
  for (const [id, answer] of answers) {
    await answerItem(page, id, answer)
    await expect(page.getByTestId('resolved-' + id)).toBeVisible()
  }
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.locator('.katex-error')).toHaveCount(0)
})

test('W-MATH-003 N12 review: original number lines gated and answer figure hidden until Q15', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto(appRoute('/learning/textbook/math-numbers-expressions-n12'))
  await expect(page.getByRole('heading', { name: '不等式を使う', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-current-topic')).toContainText('連立不等式と整数条件')
  await expect(page.getByTestId('textbook-item-n12-p002-q01-coef')).toBeVisible()
  await expect(page.getByTestId('textbook-item-n12-01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-figure-n12-f01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-figure-n12-f02')).toHaveCount(0)
  await expect(page.getByTestId('textbook-figure-n12-f03')).toHaveCount(0)
  await answerItem(page, 'n12-p002-q01-coef', '2')
  await answerItem(page, 'n12-p002-q01-const', '-7')
  await chooseWrongOption(page, 'n12-01', 'x>-\\frac72')
  await expect(page.getByTestId('textbook-item-n12-p002-q02-coef')).toHaveCount(0)

  const answers: Array<[string, string]> = [
    ['n12-01', 'x>-\\frac72'],
    ['n12-p002-q02-coef', '2'],
    ['n12-p002-q02-const', '1'],
    ['n12-02', 'x\\le\\frac12'],
    ['n12-03', '二つ目に反するので不適'],
    ['n12-04', '-\\frac72<x\\le\\frac12'],
    ['n12-05', '3x+2\\le2x+4\\ \\text{かつ}\\ 2x+4\\le9-x'],
    ['n12-p002-q06-left-coef', '1'],
    ['n12-p002-q06-left-const', '2'],
    ['n12-p002-q06-right-coef', '3'],
    ['n12-p002-q06-right-const', '5'],
    ['n12-06', 'x\\le2,\\quad x\\le\\frac53'],
    ['n12-07', 'x\\le\\frac53'],
    ['n12-08', '20-x'],
    ['n12-09', 'x\\in\\mathbb Z,\\ 0\\le x\\le20'],
    ['n12-10', '50+180x+130(20-x)'],
    ['n12-11', '3200\\le50+180x+130(20-x)<3300'],
    ['n12-p002-q12-signed-coef', '-130'],
    ['n12-12', '3200\\le2650+50x<3300'],
    ['n12-p002-q13-lower', '550'],
    ['n12-p002-q13-upper', '650'],
    ['n12-13', '11\\le x<13'],
    ['n12-14', 'x=11\\ \\text{または}\\ 12'],
    ['n12-15', 'T(11)=3200\\text{円},\\ T(12)=3250\\text{円}'],
  ]
  for (const [id, answer] of answers) {
    if (id === 'n12-03') {
      await expect(page.getByTestId('textbook-figure-n12-f01')).toBeVisible()
      await expect(page.getByTestId('textbook-figure-n12-f02')).toHaveCount(0)
    }
    if (id === 'n12-07') {
      await expect(page.getByTestId('textbook-figure-n12-f02')).toBeVisible()
      await expect(page.getByTestId('textbook-figure-n12-f03')).toHaveCount(0)
    }
    if (id === 'n12-15') await expect(page.getByTestId('textbook-figure-n12-f03')).toHaveCount(0)
    await answerItem(page, id, answer)
  }
  const lastFigure = page.getByTestId('textbook-figure-n12-f03')
  await expect(lastFigure).toBeVisible()
  await expect(lastFigure.locator('img')).toHaveAttribute('src', /n12-f03\.png$/)
  for (const id of ['n12-f01', 'n12-f02', 'n12-f03']) {
    await expect.poll(() => page.getByTestId('textbook-figure-' + id).locator('img')
      .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
  }
  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.locator('.katex-error')).toHaveCount(0)
  const viewport = await page.evaluate(() => ({
    width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth,
  }))
  expect(viewport.scroll).toBeLessThanOrEqual(viewport.width + 1)
})

test('W-MATH-003 approved review themes appear on the public setup and keep physics intact', async ({ page }) => {
  await page.goto(appRoute('/learning/setup?subject=math-1a'))
  for (const [id, label] of [['numbers-polynomials','式を整える'], ['numbers-real','実数を扱う'], ['numbers-inequalities','不等式を使う']] as const) {
    await expect(page.getByTestId('math-textbook-topic-' + id)).toContainText(label)
  }
  await page.getByRole('button', { name: '物理', exact: true }).click()
  await expect(page.getByTestId('textbook-part-list')).toBeVisible()
})
