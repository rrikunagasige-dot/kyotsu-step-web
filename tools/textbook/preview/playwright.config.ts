import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: '.', testMatch: 'solution.spec.ts', fullyParallel: false, workers: 1,
  reporter: [['list']], outputDir: '../../../test-results/solution',
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', screenshot: 'only-on-failure', launchOptions: process.env.KYOTSU_CHROMIUM_PATH ? { executablePath: process.env.KYOTSU_CHROMIUM_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {} },
  webServer: { command: 'pnpm exec vite --host 127.0.0.1 --base /', cwd: '../../..', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
})
