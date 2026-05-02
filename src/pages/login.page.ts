// ─────────────────────────────────────────────────────────────
// src/pages/login.page.ts
// Page Object for the Login page (saucedemo.com)
// ─────────────────────────────────────────────────────────────
import { Page, Locator, test } from '@playwright/test';
import { BasePage } from './base.page';
import logger from '@utils/logger';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorContainer = page.locator('[data-test="error"]');
  }

  async open(): Promise<void> {
    await this.navigateTo('/');
  }

  async login(data: { email: string; password: string }): Promise<void> {
    logger.info(`[LoginPage] Logging in as: ${data.email}`);
    await test.step(`Login as "${data.email}"`, async () => {
      await this.usernameInput.fill(data.email);
      await this.passwordInput.fill(data.password);
      await this.loginButton.click();
    });
  }
}
