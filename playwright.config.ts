import { defineConfig, PlaywrightTestConfig, devices, } from '@playwright/test'
import dotenv from 'dotenv';
import { jiraConfig } from './jiraSetup.config';
import path from 'path';


interface GlobalConfig extends PlaywrightTestConfig {
  [key: string]: any;
}
dotenv.config({
  path: `./app_commons/environments/.env.demo`,
  override: true
})

const defaultConfig: PlaywrightTestConfig = {
  // globalSetup:"globalSetup.ts",
  testDir: './tests',
  timeout: 1 * 60 * 15000,
  expect: { timeout: 30 * 15000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter:
    [
      ['html', { open: 'always' }],
      ['allure-playwright'],
      [ process.env.CI ? 'github' : 'list', { printSteps: true } ],
      [
        './src/zephyr-reporter.ts', {
          mode: {
            createCycle: 'off',
            updateExistingCycle: 'off'
          },
          ...jiraConfig
        }
      ]
    ],
  use: {
    // storageState:"./testloginsso.json",
    actionTimeout: 10 * 15000,
    navigationTimeout: 30 * 15000,
    ignoreHTTPSErrors: true,
    //
    headless: process.env.CI ? process.env.HEADLESS == 'true' : false,
    trace: 'retain-on-failure',
    // screenshot: 'on',
    // screenshot: {
    //   mode: 'on',
    //   fullPage: true,
    //   omitBackground: true,
    // },
    video: 'retain-on-failure',
    launchOptions: {
      args: [
        '--disable-web-security',
        // '--start-maximized',
        '--auth-server-whitelist=".ec1.aws.aztec.cloud.allianz"'
      ],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: undefined,
        viewport: null,
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    },
    /* {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1720, height: 850 }
      },

    },*/

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    //   {
    //     name: 'Microsoft Edge',
    //     use: { ...devices['Desktop Edge'], channel: 'msedge',
    //     viewport: { width: 1720, height: 850 }
    //   },
    //   },
    //   {
    //     name: 'Google Chrome',
    //     use: { ...devices['Desktop Chrome'], channel: 'chrome',
    //     viewport: { width: 1720, height: 850 } },
    //   },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
};
const globalConfig: GlobalConfig = {
  ...defaultConfig,
  ...jiraConfig
};
export default globalConfig;
