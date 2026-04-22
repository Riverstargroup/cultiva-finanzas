// NOTE: @playwright/test is not yet in package.json devDependencies.
// Before running E2E tests, install it:
//   npm install -D @playwright/test
//   npx playwright install chromium
// Then add the following to package.json scripts:
//   "test:e2e": "playwright test"

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
