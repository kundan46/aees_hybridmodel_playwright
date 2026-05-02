import { Page, Locator, test } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';

export class AeesLoginPage extends BasePage {
  readonly loginHeaderBtn: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.loginHeaderBtn = page.getByRole('button', { name: ' Login' });
    this.emailInput = page.getByRole('textbox', { name: 'Email/Phone Number/' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.loginSubmitBtn = page.getByRole('button', { name: 'Login', exact: true });
  }

  async open(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Performs login using provided credentials.
   * Waits for successful navigation to dashboard after login.
   * @param email The email or phone number.
   * @param password The password.
   */
  async login(email: string, password: string): Promise<void> {
    await test.step(`Login as ${email}`, async () => {
      logger.info(`[AeesLogin] Logging in as ${email}`);

      // Wait for the page to fully load before interacting
      await this.page.waitForLoadState('domcontentloaded');

      await this.loginHeaderBtn.waitFor({ state: 'visible', timeout: 15000 });
      await this.loginHeaderBtn.click();

      await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginSubmitBtn.click();

      // Wait for successful login — dashboard should appear
      logger.info('[AeesLogin] Waiting for dashboard to load after login...');
      await this.page.waitForURL(/.*dashboard.*|.*#\/dashboard.*/, { timeout: 30000 }).catch(async () => {
        // Fallback: wait for the Dashboard heading to appear
        logger.warn('[AeesLogin] URL did not change to dashboard. Waiting for Dashboard heading...');
        await this.page.getByRole('heading', { name: 'Dashboard' }).waitFor({ state: 'visible', timeout: 15000 });
      });
      await this.page.waitForLoadState('networkidle');
      logger.info('[AeesLogin] Login successful — dashboard loaded');
    });
  }
}
