import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, `.env.${process.env.ENV || 'qa'}`) });
dotenv.config({ path: path.resolve(__dirname, '.env') }); // fallback

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './src/tests',
  outputDir: './reports/test-results',

  /* Run tests in files in parallel */
  fullyParallel: false,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: isCI,

  /* Retry failed tests: 2 times on CI, 0 locally */
  retries: 1,

  /* Opt out of parallel tests on CI to avoid resource exhaustion per shard */
  workers: 1,

  /* Global timeout per test */
  timeout: 60_000,

  /* Global expect timeout */
  expect: {
    timeout: 10_000,
  },

  /* Reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false,
    }],
  ],

  /* Shared settings for all projects */
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    /* Capture trace on first retry only */
    trace: 'on-first-retry',

    /* Screenshot only on failure */
    screenshot: 'only-on-failure',

    /* Retain video on failure */
    video: 'retain-on-failure',

    /* Action and navigation timeouts */
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    /* Default locale and timezone */
    locale: 'en-US',
    timezoneId: 'Asia/Kolkata',
  },

  /* Configure test projects (browsers) */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    /*{
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },*/
  ],
});
