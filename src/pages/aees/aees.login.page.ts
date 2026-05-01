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
    this.loginHeaderBtn = page.getByRole('button', { name: ' Login' });
    this.emailInput = page.getByRole('textbox', { name: 'Email/Phone Number/' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.loginSubmitBtn = page.getByRole('button', { name: 'Login', exact: true });
  }

  async open(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Performs login using provided credentials.
   * @param email The email or phone number.
   * @param password The password.
   */
  async login(email: string, password: string): Promise<void> {
    await test.step(`Login as ${email}`, async () => {
      logger.info(`[AeesLogin] Logging in as ${email}`);
      await this.loginHeaderBtn.click();
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginSubmitBtn.click();
    });
  }
}
