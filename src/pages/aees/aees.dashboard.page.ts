import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import logger from '@utils/logger';

export class AeesDashboardPage extends BasePage {
  readonly dashboardLink: Locator;
  readonly startNewAppBtn: Locator;
  readonly viewAppBtn: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardLink = page.getByRole('heading', { name: 'Dashboard' });
    this.startNewAppBtn = page.locator(':text("Start New Application")');
    this.viewAppBtn = page.getByRole('button', { name: 'View Application' });
    this.continueBtn = page.getByText('Continue');
  }

  async goToDashboard(): Promise<void> {
    await test.step('Go to Dashboard', async () => {
      logger.info('[AeesDashboard] Navigating to Dashboard');
      await expect(this.dashboardLink).toBeVisible();
      await this.dashboardLink.click();
    });
  }

  async startOrViewApplication(): Promise<void> {
    await test.step('Start or View Application', async () => {
      logger.info('[AeesDashboard] Starting or Viewing Application');
      const startVisible = await this.startNewAppBtn.first().waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false);
      if (startVisible) {
        await this.startNewAppBtn.first().click();
        await this.continueBtn.click();
      } else {
        const viewVisible = await this.viewAppBtn.first().waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false);
        if (viewVisible) {
          await this.viewAppBtn.first().click();
        }
      }
    });
  }
}
