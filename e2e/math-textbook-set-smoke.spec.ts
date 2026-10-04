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


async function answerItem(page: Page, itemId: string, answer: string) {
  await page.getByTestId(`textbook-item-${itemId}`).click()
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
}



async function completeRelationsAndSubsets(page: Page) {
  const answers: Array<[string, string]> = [
    ['set-c01', 'すべて入っている'],
    ['set-c02', '4がAにないので、全部は入っていない'],
    ['set-c03', '0個'],
    ['set-c04', '{1}, {2}, {3}'],
    ['set-c05', '{1,2}, {1,3}, {2,3}'],
    ['set-c06', 'はい'],
    ['set-c07', '∅, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3}'],
    ['set-c08', '残らない'],
    ['set-b01', '3, 5, 7'],
    ['set-b02', 'AとBの両方に属する要素'],
    ['set-b03', '1, 2, 3, 5, 7, 9'],
    ['set-b04', 'ない'],
    ['set-b05', 'AかBの少なくとも一方に属する要素'],
    ['set-b06', '2つの円の重なりだけ'],
    ['set-b07', 'AとBの2つの円全体'],
    ['set-b08', '3つすべてに属する要素'],
    ['set-b09', '3つのうち少なくとも1つに属する要素'],
  ]
  for (const [itemId, answer] of answers) await answerItem(page, itemId, answer)
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
  await expect(setsTopic).toContainText('集合の表し方 → 部分集合 → 共通部分・和集合 → 補集合 → 集合の条件')
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


test('proposition-reading review unit builds the proposition criterion before implication', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-reading'))

  await expect(page.getByRole('heading', { name: '条件から命題を読む', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '命題の真偽を読む', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-p00a')).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-a01')).toHaveCount(0)

  await answerItem(page, 'prop-p00a', '真である')
  await answerItem(page, 'prop-p00b', '頂角40°の二等辺三角形')
  await answerItem(page, 'prop-p00c', '偽である')
  await answerItem(page, 'prop-p00d', '定まっていない')
  await answerItem(page, 'prop-p00e', '一意に決められない')

  await expect(page.getByText(/文を命題という/)).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-a01')).toBeVisible()
  await expect(page.getByText(/pならばqである/)).toHaveCount(0)

  await answerItem(page, 'prop-a01', '満たす')
  await expect(page.getByText(/pならばqである/)).toBeVisible()
  await expect(page.getByTestId('textbook-item-prop-a02')).toBeVisible()
})

test('proposition-reading wrong answer stays unresolved and does not reveal the next judgment', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-reading'))

  await chooseWrongOption(page, 'prop-p00a', '真である')

  await expect(page.getByTestId('resolved-prop-p00a')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-prop-p00b')).toHaveCount(0)
  await expect(page.getByText(/文を命題という/)).toHaveCount(0)

  await page.getByTestId('textbook-item-prop-p00a').click()
  const hint = page.getByTestId('textbook-hint-prop-p00a')
  await expect(hint).toBeVisible()
  await expect(hint).not.toContainText('真である')
})

test('proposition-reading counterexample is decided before the counterexample concept is named', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-reading'))

  await answerItem(page, 'prop-p00a', '真である')
  await answerItem(page, 'prop-p00b', '頂角40°の二等辺三角形')
  await answerItem(page, 'prop-p00c', '偽である')
  await answerItem(page, 'prop-p00d', '定まっていない')
  await answerItem(page, 'prop-p00e', '一意に決められない')
  await answerItem(page, 'prop-a01', '満たす')
  await answerItem(page, 'prop-a02', 'すべて入る')

  await expect(page.getByText(/このような例を反例という/)).toHaveCount(0)
  await answerItem(page, 'prop-a03', '-1')
  await answerItem(page, 'prop-a04', '偽')
  await expect(page.getByText(/このような例を反例という/)).toBeVisible()
  await expect(page.getByTestId('textbook-figure-implication-counterexample')).toBeVisible()
})


test('quantifier review unit derives the negation of exists only after an existence witness', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-quantifiers-all-exists'))

  await expect(page.getByRole('heading', { name: '「すべて」と「ある」', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-item-quant-a01')).toBeVisible()
  await expect(page.getByText(/「あるxに対してpである」の否定は/)).toHaveCount(0)

  await answerItem(page, 'quant-a01', '1つ')
  await answerItem(page, 'quant-a02', 'a=2, b=3')
  await expect(page.getByText(/「あるxに対してpである」の否定は/)).toHaveCount(0)

  await answerItem(page, 'quant-a03', 'すべての素数の組(a,b)に対してabは奇数である')
  await expect(page.getByText(/「あるxに対してpである」の否定は/)).toBeVisible()
})

test('quantifier review wrong answer stays unresolved and keeps the witness step locked', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-quantifiers-all-exists'))

  await chooseWrongOption(page, 'quant-a01', '1つ')

  await expect(page.getByTestId('resolved-quant-a01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-quant-a02')).toHaveCount(0)
  await expect(page.getByText(/「あるxに対してpである」の否定は/)).toHaveCount(0)

  await page.getByTestId('textbook-item-quant-a01').click()
  const hint = page.getByTestId('textbook-hint-quant-a01')
  await expect(hint).toBeVisible()
  await expect(hint).not.toContainText('1つ')
})

test('quantifier review unit derives the negation of all only after the source counterexample', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-quantifiers-all-exists'))

  await answerItem(page, 'quant-a01', '1つ')
  await answerItem(page, 'quant-a02', 'a=2, b=3')
  await answerItem(page, 'quant-a03', 'すべての素数の組(a,b)に対してabは奇数である')
  await answerItem(page, 'quant-b01', '存在しない')
  await answerItem(page, 'quant-b02', 'すべての実数xに対して x²≠-1')
  await answerItem(page, 'quant-c01', '1つ')

  await expect(page.getByText(/「すべてのxに対してpである」の否定は/)).toHaveCount(0)
  await answerItem(page, 'quant-c02', '2')
  await answerItem(page, 'quant-c03', 'ある素数は偶数である')
  await expect(page.getByText(/「すべてのxに対してpである」の否定は/)).toBeVisible()
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
  await expect(page.locator('.katex-error')).toHaveCount(0)

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})

test('proposition-proof review unit establishes equivalence before reverse and contrapositive work', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-proof'))

  await expect(page.getByRole('heading', { name: '命題を証明する', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-item-proof-e01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-proof-a01')).toHaveCount(0)

  await answerItem(page, 'proof-e01', '真')
  await answerItem(page, 'proof-e02', 'x=0')

  await expect(page.getByText(/pとqは同値である/)).toBeVisible()
  await expect(page.getByTestId('textbook-item-proof-a01')).toBeVisible()
})


test('proof review wrong answer stays unresolved and keeps equivalence prose locked', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-propositions-proof'))

  await chooseWrongOption(page, 'proof-e01', '真')

  await expect(page.getByTestId('resolved-proof-e01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-proof-e02')).toHaveCount(0)
  await expect(page.getByText(/pとqは同値である/)).toHaveCount(0)

  await page.getByTestId('textbook-item-proof-e01').click()
  const hint = page.getByTestId('textbook-hint-proof-e01')
  await expect(hint).toBeVisible()
  await expect(hint).not.toContainText('真')
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

test('math set lesson boots directly on the shared textbook reader', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message))

  await page.goto(appRoute('/learning/textbook/math-sets'))

  await expect(page.getByText('TEXTBOOK / MATH I+A / CHAPTER 3')).toBeVisible()
  await expect(page.getByRole('heading', { name: '集合', exact: true })).toBeVisible()
  await expect(page.getByTestId('app-back-button')).toHaveAttribute('href', '#/learning/setup?subject=math-1a')
  await expect(page.getByRole('heading', { name: '集合を表す', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a02')).toHaveCount(0)
  await expect(page.getByText('TEXTBOOK / PHYSICS')).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('wrong answer stays unresolved, shows a staged hint, and does not unlock concept prose', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))

  await chooseWrongOption(page, 'set-a01', '1, 2, 3, 4, 6, 8, 12, 24')

  await expect(page.getByTestId('resolved-set-a01')).toHaveCount(0)
  await expect(page.getByText(/ひとまとまりとして考えたものを集合という/)).toHaveCount(0)
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
  await expect(page.getByText(/ひとまとまりとして考えたものを集合という/)).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a02')).toBeVisible()
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
    const itemId = itemIds[index]
    await page.getByTestId(`textbook-item-${itemId}`).click()
    await page.getByTestId(`inline-choice-panel-${itemId}`).getByRole('button', { name: answers[index], exact: true }).click()
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


test('the second learning group follows the synchronized subset-first curriculum order', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))

  await expect(page.getByRole('heading', { name: '集合どうしの関係を見る', exact: true })).toHaveCount(0)
  await completeFirstSetsSlice(page)
  await expect(page.getByRole('heading', { name: '集合どうしの関係を見る', exact: true })).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-c01')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-b01')).toHaveCount(0)
  await expect(page.getByTestId('textbook-figure-venn-two-blank')).toHaveCount(0)
})

test('the completed intersection figure is revealed only after subsets and the intersection decision', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)

  const subsetAnswers: Array<[string, string]> = [
    ['set-c01', 'すべて入っている'],
    ['set-c02', '4がAにないので、全部は入っていない'],
    ['set-c03', '0個'],
    ['set-c04', '{1}, {2}, {3}'],
    ['set-c05', '{1,2}, {1,3}, {2,3}'],
    ['set-c06', 'はい'],
    ['set-c07', '∅, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3}'],
    ['set-c08', '残らない'],
  ]
  for (const [itemId, answer] of subsetAnswers) await answerItem(page, itemId, answer)

  await expect(page.getByTestId('textbook-figure-venn-two-blank')).toBeVisible()
  await expect(page.getByTestId('textbook-figure-venn-intersection')).toHaveCount(0)

  await answerItem(page, 'set-b01', '3, 5, 7')

  await expect(page.getByText(/共通部分といい/)).toBeVisible()
  await expect(page.getByTestId('textbook-figure-venn-intersection')).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-b02')).toBeVisible()
})

test('subset then union concepts keep the synchronized meaning-first progression', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)

  await expect(page.getByTestId('textbook-item-set-c01')).toBeVisible()
  await expect(page.getByText(/部分集合という/)).toHaveCount(0)
  await answerItem(page, 'set-c01', 'すべて入っている')
  await answerItem(page, 'set-c02', '4がAにないので、全部は入っていない')
  await expect(page.getByText(/部分集合という/)).toBeVisible()

  const restOfSubset: Array<[string, string]> = [
    ['set-c03', '0個'],
    ['set-c04', '{1}, {2}, {3}'],
    ['set-c05', '{1,2}, {1,3}, {2,3}'],
    ['set-c06', 'はい'],
    ['set-c07', '∅, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3}'],
    ['set-c08', '残らない'],
  ]
  for (const [itemId, answer] of restOfSubset) await answerItem(page, itemId, answer)

  await expect(page.getByTestId('textbook-item-set-b01')).toBeVisible()
  await expect(page.getByText(/共通部分といい/)).toHaveCount(0)
  await answerItem(page, 'set-b01', '3, 5, 7')
  await expect(page.getByText(/共通部分といい/)).toBeVisible()
})


test('complement terminology appears only after the whole-set scope and outside elements are decided', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)

  await expect(page.getByRole('heading', { name: '集合の外側まで考える', exact: true })).toBeVisible()
  await expect(page.getByText(/全体集合といい/)).toHaveCount(0)

  await answerItem(page, 'set-d01', '入れない')
  await expect(page.getByText(/全体集合といい/)).toBeVisible()
  await expect(page.getByText(/補集合といい/)).toHaveCount(0)

  await answerItem(page, 'set-d02', '1, 3, 5, 7, 9, 11')
  await expect(page.getByText(/補集合といい/)).toBeVisible()
  await expect(page.getByTestId('textbook-figure-complement-after')).toBeVisible()
})

test('De Morgan law is revealed only after the two regions are compared', async ({ page }) => {
  await page.goto(appRoute('/learning/textbook/math-sets'))
  await completeFirstSetsSlice(page)
  await completeRelationsAndSubsets(page)
  await completeComplements(page)

  await expect(page.getByText(/ド・モルガンの法則という/)).toHaveCount(0)
  await expect(page.getByTestId('textbook-item-set-e01')).toBeVisible()

  await answerItem(page, 'set-e01', '2つの円の重なり')
  await answerItem(page, 'set-e02', '重なり以外のU全体')
  await expect(page.getByTestId('textbook-figure-demorgan-intersection-complement')).toBeVisible()
  await answerItem(page, 'set-e03', '\\overline{A}\\cup\\overline{B}')
  await answerItem(page, 'set-e04', '同じ')
  await answerItem(page, 'set-e05', '\\overline{A}\\cup\\overline{B}')

  await expect(page.getByText(/ド・モルガンの法則という/)).toHaveCount(0)

  await answerItem(page, 'set-e06', 'AまたはBに入る2つの円全体')
  await answerItem(page, 'set-e07', '\\overline{A}\\cap\\overline{B}')
  await answerItem(page, 'set-e08', '\\overline{A}\\cap\\overline{B}')

  await expect(page.getByText(/ド・モルガンの法則という/)).toBeVisible()
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

  await expect(page.getByTestId('textbook-unit-complete')).toBeVisible()
  await expect(page.getByTestId('textbook-return-to-setup')).toHaveAttribute('href', '#/learning/setup?subject=math-1a')
  await expect(page.locator('.katex-error')).toHaveCount(0)

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
})
