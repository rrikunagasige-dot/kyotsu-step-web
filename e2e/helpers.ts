import { expect, test, type Page } from '@playwright/test'

const BOOT_READY_MS = 30_000
const STORAGE_DOCUMENT = '/kyotsu-step-web/assets/math/textbook/sets/venn-two-blank.svg'
type BootLog = { pageErrors: string[]; consoleErrors: string[] }
const bootLogs = new WeakMap<Page, BootLog>()
function observeBoot(page: Page) {
  let log = bootLogs.get(page)
  if (!log) {
    log = { pageErrors: [], consoleErrors: [] }
    bootLogs.set(page, log)
    const captured = log
    page.on('pageerror', error => { captured.pageErrors.push(error.stack ?? error.message); captured.pageErrors.splice(0, Math.max(0, captured.pageErrors.length - 20)) })
    page.on('console', message => { if (message.type() === 'error') { captured.consoleErrors.push(message.text()); captured.consoleErrors.splice(0, Math.max(0, captured.consoleErrors.length - 20)) } })
  }
  log.pageErrors.length = 0
  log.consoleErrors.length = 0
  return log
}
async function logBootFailure(page: Page, operation: string, log: BootLog) {
  const body = await page.locator('body').innerText({ timeout: 1000 }).catch(() => '<body unavailable>')
  const entry = new URL(page.url()).pathname === '/kyotsu-step-web/e2e/fixtures/historical-math.html' ? 'historical-compatibility' : 'ordinary'
  console.error('E2E_BOOT_NOT_READY', JSON.stringify({ entry, operation, url: page.url(), body: body.slice(0, 4000), pageErrors: log.pageErrors, consoleErrors: log.consoleErrors }))
}
async function requireAppReady(page: Page) {
  // Both fixed historical routes wrap their archived reader OR old-data catalog in the imported current AppShell.
  // The initial .fatal-error is a loading placeholder, not a failure. A direct-root h1 is the actual boot/render error surface.
  await page.waitForFunction(() => {
    if (document.querySelector('#root > main h1')) return true
    const main = document.getElementById('main-content')
    if (!main || main.getClientRects().length === 0) return false
    if (!window.location.hash.slice(1).split('?')[0].startsWith('/learning/textbook/')) return true
    return [...document.querySelectorAll<HTMLElement>('[data-testid="textbook-reading-flow"]')].some(flow => flow.getClientRects().length > 0 && getComputedStyle(flow).visibility !== 'hidden')
  }, undefined, { timeout: BOOT_READY_MS })
  await expect(page.locator('#root > main h1'), 'The genuine App must not show its boot/render error surface').toHaveCount(0)
  await expect(page.locator('#main-content')).toBeVisible()
  if (new URL(page.url()).hash.slice(1).split('?')[0].startsWith('/learning/textbook/')) await expect(page.locator('[data-testid="textbook-reading-flow"]:visible').first()).toBeVisible()
}
export async function gotoReady(page: Page, url: string, options?: Parameters<Page['goto']>[1]) {
  const log = observeBoot(page)
  try { const response = await page.goto(url, options); await requireAppReady(page); return response }
  catch (error) { await logBootFailure(page, 'goto ' + url, log); throw error }
}
export async function reloadReady(page: Page, options?: Parameters<Page['reload']>[0]) {
  const log = observeBoot(page)
  try { const response = await page.reload(options); await requireAppReady(page); return response }
  catch (error) { await logBootFailure(page, 'reload', log); throw error }
}
export async function openStorageOrigin(page: Page) {
  const base = test.info().project.use.baseURL
  if (!base) throw new Error('A fixed same-origin baseURL is required')
  const url = new URL(STORAGE_DOCUMENT, base)
  const response = await page.goto(url.href)
  expect(new URL(page.url()).origin).toBe(url.origin)
  expect(response?.status()).toBe(200)
  expect(response?.headers()['content-type']).toMatch(/image\/svg\+xml/)
}
export async function clearStoredState(page: Page) {
  // This existing public SVG is present in dev and compiled preview; it runs no App script. JSON fixture files are not part of dist.
  await openStorageOrigin(page)
  await page.evaluate(() => localStorage.clear())
}

export const appRoute = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `/kyotsu-step-web/#${normalized}`
}
