import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  // Concise 'dot' for CI, default 'list' when running locally
  reporter: process.env.CI ? 'dot' : 'list',

  use: {
    baseURL: process.env.CI
      ? 'https://calculadoraics-cicd.onrender.com/'
      : 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },

        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },

        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
      ],

  /* Run your local dev server before starting the tests */
      ...(process.env.CI
    ? {}
    : {
        webServer: {
          command: 'node src/server.js',
          url: 'http://localhost:3000',
          reuseExistingServer: true,
        },
      }),
});

