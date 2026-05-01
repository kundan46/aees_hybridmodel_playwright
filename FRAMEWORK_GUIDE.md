# Enterprise Playwright Framework — Complete Guide
> TypeScript · Hybrid Page Object Model · Custom Fixtures · Multi-URL Ready

---

## Table of Contents
1. [What This Framework Does](#1-what-this-framework-does)
2. [Folder Structure — Where Everything Lives](#2-folder-structure)
3. [Configuration Layer](#3-configuration-layer)
4. [Path Aliases — Short Imports](#4-path-aliases)
5. [Environment Variables](#5-environment-variables)
6. [Utilities Deep-Dive](#6-utilities-deep-dive)
7. [Components — Reusable UI Pieces](#7-components)
8. [Page Objects — The Heart of the Framework](#8-page-objects)
9. [Services — API Layer](#9-services)
10. [Fixtures — Smart Test Setup & Teardown](#10-fixtures)
11. [Test Data — No Hardcoding](#11-test-data)
12. [Writing Tests](#12-writing-tests)
13. [How to Automate a New URL (Step-by-Step)](#13-how-to-automate-a-new-url)
14. [Reporters & Logs](#14-reporters--logs)
15. [Running Tests](#15-running-tests)
16. [CI/CD — Jenkins Pipeline](#16-cicd--jenkins-pipeline)
17. [Full Execution Flow Diagram](#17-full-execution-flow-diagram)

---

## 1. What This Framework Does

This framework lets you automate **any number of web applications** without writing repetitive code. Each website gets its own **Page Object**, shares common **Utilities**, and is driven by **Fixtures** that handle setup/teardown automatically.

**Key Principles:**
- ✅ No `page.waitForTimeout()` — uses smart Playwright assertions
- ✅ No hardcoded credentials — all from `.env` files
- ✅ One command to run on any browser or environment
- ✅ Auto screenshots + videos on failure
- ✅ Allure + HTML reports generated automatically

---

## 2. Folder Structure

```
playwright_with_typescript/
│
├── playwright.config.ts        ← Master config: browsers, timeouts, reporters
├── tsconfig.json               ← TypeScript + path aliases
├── package.json                ← Scripts and dependencies
├── Jenkinsfile                 ← CI/CD pipeline
├── .env                        ← Default env vars (fallback)
├── .env.qa                     ← QA environment overrides
├── .env.prod                   ← Prod environment overrides
│
└── src/
    ├── config/
    │   └── env.config.ts       ← Reads .env, exports typed config object
    │
    ├── fixtures/
    │   └── base.fixture.ts     ← Custom test setup: injects pages & services
    │
    ├── pages/
    │   ├── base.page.ts        ← Abstract base: navigateTo, getTitle, reload
    │   ├── login.page.ts       ← Login page locators + actions
    │   └── dashboard.page.ts   ← Dashboard page locators + actions
    │
    ├── components/
    │   ├── navbar.component.ts ← Burger menu, logout, cart badge
    │   └── modal.component.ts  ← Confirm/cancel/close dialog
    │
    ├── services/
    │   ├── api.client.ts       ← Low-level GET/POST/PUT/DELETE wrapper
    │   └── auth.service.ts     ← Login API, get user, create user
    │
    ├── utils/
    │   ├── logger.ts           ← Winston logger → console + files
    │   ├── screenshot.helper.ts← Full-page & element screenshots
    │   ├── wait.helper.ts      ← waitForVisible, waitForHidden, waitUntil
    │   ├── dropdown.helper.ts  ← selectByLabel, selectByValue, custom dropdowns
    │   └── date.helper.ts      ← Date formatting, timestamp for unique data
    │
    ├── test-data/
    │   └── users.data.ts       ← All user credentials in one place
    │
    └── tests/
        ├── aees3.spec.ts       ← AEES portal E2E test
        ├── auth/               ← Login/logout tests
        ├── api/                ← API-only tests
        ├── e2e/                ← Full end-to-end journeys
        └── dashboard/          ← Dashboard-specific tests
```

---

## 3. Configuration Layer

### `playwright.config.ts` — The Master Switch

This file is loaded **first** when any test runs. Think of it as the control panel.

```typescript
// What it sets up:
testDir: './src/tests'          // Where to find tests
outputDir: './reports/test-results' // Where to save artifacts
fullyParallel: false            // Run tests sequentially (safe for E2E)
retries: isCI ? 2 : 0           // Retry on CI only
workers: isCI ? 4 : 1           // Parallel workers
timeout: 60_000                 // 60s per test
```

**Browsers configured:**

| Project Name    | Device              |
|-----------------|---------------------|
| `chromium`      | Desktop Chrome 1440px |
| `firefox`       | Desktop Firefox 1440px |
| `webkit`        | Desktop Safari 1440px |
| `mobile-chrome` | Pixel 7             |
| `mobile-safari` | iPhone 14           |

**Reporters:**
- `list` → Live console output while running
- `html` → `playwright-report/index.html`
- `json` → `reports/results.json`
- `allure-playwright` → `allure-results/` (then generate with `npm run allure:generate`)

---

## 4. Path Aliases

Defined in `tsconfig.json`. These save you from writing long relative paths.

| Alias | Points To |
|---|---|
| `@pages/*` | `src/pages/*` |
| `@components/*` | `src/components/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@services/*` | `src/services/*` |
| `@testData/*` | `src/test-data/*` |
| `@config/*` | `src/config/*` |

**Example:** Instead of `../../../utils/logger`, you write `@utils/logger`.

---

## 5. Environment Variables

### How it works

1. You create a `.env.qa` file (or `.env.prod`) in the project root.
2. `env.config.ts` reads the correct file based on `ENV` variable.
3. All values are exported as a **typed** object — no raw `process.env` in tests.

### `.env.qa` example
```
BASE_URL=https://www.saucedemo.com
API_BASE_URL=https://reqres.in/api
ADMIN_USER=standard_user
ADMIN_PASSWORD=secret_sauce
LOG_LEVEL=debug
```

### `env.config.ts` — What it exports
```typescript
export const envConfig = {
  env: 'qa',
  baseUrl: 'https://www.saucedemo.com',
  apiBaseUrl: 'https://reqres.in/api',
  adminUser: 'standard_user',
  adminPassword: 'secret_sauce',
  logLevel: 'info',
};
```

**To add a new URL:** Just add a new key in `.env.qa` and update the `EnvConfig` interface.

---

## 6. Utilities Deep-Dive

### `logger.ts` — Winston Logger

Writes to **three places** simultaneously:
- Console (with colours)
- `reports/logs/execution.log` (all levels, max 5 MB, 5 rotating files)
- `reports/logs/errors.log` (errors only)

**Usage in any file:**
```typescript
import logger from '@utils/logger';

logger.info('Navigation started');
logger.debug('Filling form field');
logger.error('Element not found', error);
```

---

### `screenshot.helper.ts` — Screenshots

```typescript
// Full page screenshot — attached to Allure/HTML report
await ScreenshotHelper.captureFullPage(page, testInfo, 'checkout-page');

// Specific element screenshot
await ScreenshotHelper.captureElement(page, testInfo, '.error-banner', 'error-msg');
```

Saved to `reports/screenshots/` automatically.

---

### `wait.helper.ts` — Smart Waits (No `waitForTimeout`)

```typescript
// Wait for element to appear
await WaitHelper.waitForVisible(page.locator('.spinner'), { timeout: 10000 });

// Wait for element to disappear
await WaitHelper.waitForHidden(page.locator('.loading-overlay'));

// Wait for network to settle
await WaitHelper.waitForNetworkIdle(page);

// Wait for any custom condition
await WaitHelper.waitUntil(
  async () => (await page.locator('.cart-count').textContent()) === '3',
  { timeout: 5000, message: 'cart count to be 3' }
);
```

---

### `dropdown.helper.ts` — Dropdowns

```typescript
// Native <select> by visible text
await DropdownHelper.selectByLabel(page.locator('select[name="state"]'), 'BIHAR');

// Native <select> by value attribute
await DropdownHelper.selectByValue(page.locator('#sort'), 'lohi');

// Custom dropdown (click trigger → click option)
await DropdownHelper.selectCustomOption(page, page.locator('.dropdown-btn'), 'Male');

// Read current selection
const selected = await DropdownHelper.getSelectedText(page.locator('select'));
```

---

### `date.helper.ts` — Dynamic Dates

```typescript
// Today in ISO format: 2025-04-23
DateHelper.getFormattedDate(0, 'ISO');

// 7 days ago in Indian format: 16/04/2025
DateHelper.getFormattedDate(-7, 'IN');

// Unique timestamp for test data: 2025-04-23T10-30-00-000Z
DateHelper.getTimestamp();
```

---

## 7. Components

Components are **shared UI pieces** used across multiple pages.

### `navbar.component.ts`

Used inside `DashboardPage`. Handles the burger menu, logout, cart.

```typescript
// Logout
await dashboardPage.navbar.logout();

// Get cart count
const count = await dashboardPage.navbar.getCartCount(); // returns number

// Navigate to all items
await dashboardPage.navbar.goToAllItems();
```

### `modal.component.ts`

Generic dialog handler — works on any site that uses `role="dialog"`.

```typescript
const modal = new ModalComponent(page);
await modal.waitForModal();
const title = await modal.getTitle();
await modal.confirm();   // clicks confirm & waits for close
await modal.cancel();    // clicks cancel & waits for close
```

---

## 8. Page Objects

### `base.page.ts` — Shared by All Pages

Every page class **extends BasePage**. It provides:

```typescript
await this.navigateTo('/login');         // Goes to BASE_URL + /login
await this.navigateTo('https://...');    // Goes to absolute URL
await this.getTitle();                   // Returns page <title>
await this.getCurrentUrl();              // Returns current URL
await this.reload();                     // Reloads page
await this.waitForUrl(/dashboard/);      // Waits for URL to match pattern
```

---

### `login.page.ts` — Login Page

```typescript
// Structure
class LoginPage extends BasePage {
  usernameInput: Locator;  // [data-test="username"]
  passwordInput: Locator;  // [data-test="password"]
  loginButton: Locator;    // [data-test="login-button"]
  errorContainer: Locator; // [data-test="error"]
}

// Actions
await loginPage.open();                          // navigates to /
await loginPage.login('standard_user', 'secret_sauce'); // fills + clicks
await loginPage.isErrorVisible();                // returns true/false
await loginPage.getErrorText();                  // returns error message text
await loginPage.dismissError();                  // clicks X button on error
```

---

### `dashboard.page.ts` — Inventory/Dashboard Page

```typescript
class DashboardPage extends BasePage {
  navbar: NavbarComponent;   // Embedded navbar
  sortDropdown: Locator;
  inventoryItems: Locator;
}

// Actions
await dashboardPage.waitForLoad();          // waits for inventory list
await dashboardPage.sortBy('lohi');         // sort: az|za|lohi|hilo
await dashboardPage.addToCart(0);          // add first item to cart
await dashboardPage.getProductCount();     // returns number of products
const products = await dashboardPage.getAllProducts(); // [{name, price, desc}]
const prices = await dashboardPage.getPricesAsNumbers(); // [7.99, 9.99, ...]
```

---

## 9. Services

### `api.client.ts` — Low-Level HTTP Wrapper

Wraps Playwright's `APIRequestContext`. Logs every request status.

```typescript
const client = new ApiClient(request);

await client.get<UserResponse>('/users/2');
await client.post<LoginResponse>('/login', { email, password });
await client.put<any>('/users/2', { name: 'morpheus', job: 'leader' });
await client.delete<any>('/users/2');
```

If the response is not OK (status ≥ 400), it **throws an error automatically** with the status code and body.

---

### `auth.service.ts` — Authentication API

Built on top of `ApiClient`. Use this for API-based login (bypassing the UI for test speed).

```typescript
const authService = new AuthService(request);

// Get a token
const token = await authService.login({ email: 'eve@reqres.in', password: 'cityslicka' });

// Fetch user data
const user = await authService.getUser(2); // { id, email, first_name, ... }

// Create a user (for test setup)
const newUser = await authService.createUser('John', 'QA Engineer');
```

---

## 10. Fixtures

Fixtures are the **smartest part** of this framework. Instead of copy-pasting setup code in every test, fixtures inject ready-to-use objects.

### `base.fixture.ts` — What It Provides

```typescript
// Import this instead of the default Playwright test
import { test, expect } from '@fixtures/base.fixture';
```

**Available fixtures:**

| Fixture | What it gives you | Setup |
|---|---|---|
| `loginPage` | A fresh `LoginPage` instance | Just the page object |
| `dashboardPage` | A fresh `DashboardPage` instance | Just the page object |
| `authService` | An `AuthService` for API calls | Uses `request` context |
| `authenticatedPage` | Already logged-in session | Logs in → runs test → logs out |

### Standard Fixture Usage

```typescript
test('login shows error for locked user', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.login('locked_out_user', 'secret_sauce');
  expect(await loginPage.isErrorVisible()).toBeTruthy();
});
```

### `authenticatedPage` — Skip Login Boilerplate

```typescript
test('dashboard shows 6 products', async ({ authenticatedPage }) => {
  const { dashboardPage } = authenticatedPage;
  // Already logged in! Start testing immediately.
  const count = await dashboardPage.getProductCount();
  expect(count).toBe(6);
});
// After test → automatically logged out (teardown in fixture)
```

**Flow of `authenticatedPage`:**
```
Fixture starts
  → loginPage.open()
  → loginPage.login(adminUser, adminPassword)
  → dashboardPage.waitForLoad()
  → [YOUR TEST RUNS HERE]
  → dashboardPage.navbar.logout()   ← automatic teardown
```

---

## 11. Test Data

All credentials and data live in `src/test-data/users.data.ts`. **Never hardcode** usernames or passwords in test files.

```typescript
import { USERS, API_USERS } from '@testData/users.data';

// UI test users
USERS.standard   // { username: 'standard_user', password: 'secret_sauce' }
USERS.locked     // { username: 'locked_out_user', ... }
USERS.problem    // { username: 'problem_user', ... }
USERS.performance // { username: 'performance_glitch_user', ... }

// API test credentials
API_USERS.validLogin    // { email: 'eve.holt@reqres.in', password: 'cityslicka' }
API_USERS.invalidLogin  // { email: 'peter@klaven.com', password: 'wrong_password' }
```

---

## 12. Writing Tests

### Basic Test Structure

```typescript
// src/tests/e2e/my-test.spec.ts
import { test, expect } from '@fixtures/base.fixture';
import { USERS } from '@testData/users.data';

test.describe('Feature Name @smoke', () => {

  test('user can log in successfully', async ({ loginPage, dashboardPage }) => {
    await loginPage.open();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await dashboardPage.waitForLoad();
    expect(await dashboardPage.getProductCount()).toBeGreaterThan(0);
  });

  test('locked user sees error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await expect(loginPage.errorContainer).toBeVisible();
  });

});
```

### Test Tags for Selective Running

Add tags in the test name or describe block:

```typescript
test('quick smoke check @smoke', ...)
test('full purchase flow @regression', ...)
test('verify API response @api', ...)
```

Run only tagged tests:
```bash
npm run test:smoke       # runs @smoke
npm run test:regression  # runs @regression
npm run test:api         # runs @api
```

---

## 13. How to Automate a New URL

Follow these 4 steps every time you add a new website to the framework.

---

### Step 1 — Add Environment Config

Add the new URL to your `.env.qa` file:

```bash
# .env.qa
BASE_URL=https://www.saucedemo.com
AEES_URL=https://aees.onlineregistrationforms.com
MY_NEW_SITE_URL=https://mynewsite.com
```

Update the `EnvConfig` interface in `src/config/env.config.ts`:

```typescript
interface EnvConfig {
  env: string;
  baseUrl: string;
  apiBaseUrl: string;
  adminUser: string;
  adminPassword: string;
  logLevel: string;
  // ADD NEW ONES HERE:
  aeesUrl: string;
  myNewSiteUrl: string;
}

export const envConfig: EnvConfig = {
  // ... existing
  aeesUrl: process.env.AEES_URL || 'https://aees.onlineregistrationforms.com',
  myNewSiteUrl: process.env.MY_NEW_SITE_URL || 'https://mynewsite.com',
};
```

---

### Step 2 — Create Page Objects

Create one file per page of the new site in `src/pages/`:

```typescript
// src/pages/my-new-site/mysite.login.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import envConfig from '@config/env.config';
import logger from '@utils/logger';

export class MySiteLoginPage extends BasePage {
  // 1. Define locators as class properties
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly errorMsg: Locator;

  constructor(page: Page) {
    super(page);
    // 2. Assign locators in constructor
    this.emailInput   = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitBtn    = page.getByRole('button', { name: 'Login' });
    this.errorMsg     = page.locator('.alert-error');
  }

  // 3. Write actions as async methods
  async open(): Promise<void> {
    // navigateTo is inherited from BasePage
    await this.navigateTo(envConfig.myNewSiteUrl);
  }

  async login(email: string, password: string): Promise<void> {
    logger.info(`[MySiteLogin] Logging in as ${email}`);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMsg.waitFor({ state: 'visible' });
    return (await this.errorMsg.textContent()) ?? '';
  }
}
```

---

### Step 3 — Add to Fixtures (Optional)

If you need automatic setup, add your page to `base.fixture.ts`:

```typescript
// In src/fixtures/base.fixture.ts — extend AppFixtures type:
import { MySiteLoginPage } from '@pages/my-new-site/mysite.login.page';

type AppFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authService: AuthService;
  authenticatedPage: { loginPage: LoginPage; dashboardPage: DashboardPage };
  // ADD NEW PAGE HERE:
  mySiteLoginPage: MySiteLoginPage;
};

// Then add the fixture provider:
export const test = base.extend<AppFixtures>({
  // ... existing fixtures ...

  mySiteLoginPage: async ({ page }, use) => {
    await use(new MySiteLoginPage(page));
  },
});
```

---

### Step 4 — Write the Test

Create your test file in the right subfolder:

```typescript
// src/tests/e2e/mysite.spec.ts
import { test, expect } from '@fixtures/base.fixture';

test.describe('My New Site — Login @smoke', () => {

  test('should login with valid credentials', async ({ mySiteLoginPage }) => {
    await mySiteLoginPage.open();
    await mySiteLoginPage.login('user@example.com', 'Password123');
    await mySiteLoginPage.waitForUrl(/dashboard/);
    expect(await mySiteLoginPage.getCurrentUrl()).toContain('dashboard');
  });

  test('should show error for invalid credentials', async ({ mySiteLoginPage }) => {
    await mySiteLoginPage.open();
    await mySiteLoginPage.login('wrong@email.com', 'wrongpass');
    const error = await mySiteLoginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });

});
```

---

### Summary Checklist for New URLs

```
☐ 1. Add URL to .env.qa
☐ 2. Add key to EnvConfig interface in env.config.ts
☐ 3. Create Page Object file in src/pages/<site-name>/
☐ 4. (Optional) Add to AppFixtures type in base.fixture.ts
☐ 5. (Optional) Add fixture provider in base.fixture.ts
☐ 6. Create test file in src/tests/
☐ 7. Run: npx playwright test --grep "My New Site"
```

---

## 14. Reporters & Logs

### Log Files

| File | Contains |
|---|---|
| `reports/logs/execution.log` | Every action, navigation, API call |
| `reports/logs/errors.log` | Only errors with full stack traces |

### Reports

| Report | Location | How to Open |
|---|---|---|
| Playwright HTML | `playwright-report/index.html` | `npm run report` |
| Allure | `allure-report/index.html` | `npm run allure:open` |
| JSON | `reports/results.json` | Open in any JSON viewer |

### Generate Allure Report

```bash
npm run allure:generate   # builds the report from allure-results/
npm run allure:open       # opens browser with the report
npm run allure:serve      # generate + serve in one command
```

### What Allure Shows
- Test pass/fail status with history trend
- Step-by-step breakdown of each action
- Attached screenshots on failure
- Video recordings on failure
- Test duration and category grouping

---

## 15. Running Tests

### All Tests
```bash
npm test
```

### By Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=mobile-chrome
```

### By Tag
```bash
npm run test:smoke       # @smoke tests only
npm run test:regression  # @regression tests only
npm run test:api         # @api tests only
```

### By File or Test Name
```bash
npx playwright test src/tests/e2e/mysite.spec.ts
npx playwright test --grep "should login"
```

### By Environment
```bash
ENV=prod npm test         # uses .env.prod
ENV=dev npm test          # uses .env.dev
```

### Debug Mode (Opens Browser + Inspector)
```bash
npm run test:debug
npx playwright test --headed --slowMo=500
```

### View Report After Run
```bash
npm run report            # opens playwright HTML report
```

---

## 16. CI/CD — Jenkins Pipeline

The `Jenkinsfile` defines a full automated pipeline:

```
Stage 1: Checkout         → pulls code from Git
Stage 2: Install Deps     → npm ci (clean install)
Stage 3: Install Browsers → npx playwright install --with-deps
Stage 4: TypeScript Check → npx tsc --noEmit (catch type errors early)
Stage 5: Run Tests        → ENV + BASE_URL + browser from parameters
Stage 6: Allure Report    → generates and archives the report
Stage 7: Archive Artifacts → saves logs, reports, screenshots
```

**Pipeline Parameters (configurable per run):**

| Parameter | Options | Default |
|---|---|---|
| `ENVIRONMENT` | `qa`, `dev`, `prod` | `qa` |
| `BROWSER` | `chromium`, `firefox`, `webkit` | `chromium` |
| `SMOKE_ONLY` | `true`, `false` | `false` |

**Credentials** (stored securely in Jenkins, not in code):
- `BASE_URL`
- `ADMIN_USER`
- `ADMIN_PASSWORD`

---

## 17. Full Execution Flow Diagram

```
YOU RUN: npx playwright test
         │
         ▼
┌─────────────────────────┐
│  playwright.config.ts   │  ← Loads .env, sets browsers, timeouts, reporters
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  base.fixture.ts        │  ← Sets up: LoginPage, DashboardPage, AuthService
│  (before each test)     │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Your .spec.ts file     │  ← test('...', async ({ loginPage }) => { ... })
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Page Object (e.g.      │  ← loginPage.login(user, pass)
│  LoginPage)             │    → uses locators defined in constructor
└──────────┬──────────────┘    → calls logger.info() on every action
           │
           ▼
┌─────────────────────────┐
│  BasePage               │  ← navigateTo(), waitForUrl(), getTitle()
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Playwright Browser     │  ← Actually clicks, types, navigates in browser
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Assertion              │  ← expect(locator).toBeVisible()
│                         │    Auto-waits up to 10s before failing
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Teardown (fixture)     │  ← dashboardPage.navbar.logout()
└──────────┬──────────────┘    logs are flushed, screenshots saved
           │
           ▼
┌─────────────────────────┐
│  Reports Generated      │  ← playwright-report/, allure-results/
│                         │    reports/logs/execution.log
└─────────────────────────┘
```

---

> **Pro Tips:**
> - Always extend `BasePage` for every new page class.
> - Use `@fixtures/base.fixture` instead of `@playwright/test` in test files.
> - Keep locators in the constructor, actions as methods, assertions in tests.
> - Tag every test with `@smoke`, `@regression`, or `@api` for selective runs.
> - Use `DateHelper.getTimestamp()` to generate unique emails/usernames in test data.
